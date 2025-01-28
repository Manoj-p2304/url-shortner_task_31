import Analytics from '../models/Analytics.js';
import ShortUrl from '../models/ShortUrl.js';
import { getOS, getDeviceType } from '../utils/geoTracker.js';
import redisClient from '../utils/redisClient.js';

const cleanAnalyticsResponse = (analyticsData) => {
    return {
      totalClicks: analyticsData.totalClicks,
      uniqueUsers: analyticsData.uniqueUsers.length,
      clicksByDate: analyticsData.clicksByDate.map((entry) => ({
        date: entry.date,
        clickCount: entry.clickCount,
      })),
      osType: analyticsData.osType.map((entry) => ({
        osName: entry.osName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers.length,
      })),
      deviceType: analyticsData.deviceType.map((entry) => ({
        deviceName: entry.deviceName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers.length,
      })),
    };
  };
  
  const cleanTopicAnalyticsResponse = (analyticsData, shortUrls) => {
    const clicksByDate = analyticsData.reduce((acc, a) => {
      a.clicksByDate.forEach(dateClick => {
        const existing = acc.find(d => d.date === dateClick.date);
        if (existing) {
          existing.clickCount += dateClick.clickCount;
        } else {
          acc.push({ date: dateClick.date, clickCount: dateClick.clickCount });
        }
      });
      return acc;
    }, []);
  
    return {
      totalClicks: analyticsData.reduce((sum, a) => sum + a.totalClicks, 0),
      uniqueUsers: new Set(analyticsData.flatMap(a => a.uniqueUsers)).size,
      clicksByDate: clicksByDate,
      urls: shortUrls.map(shortUrl => {
        const analytics = analyticsData.find(a => a.shortUrl === shortUrl) || {};
        return {
          shortUrl: shortUrl,
          totalClicks: analytics.totalClicks || 0,
          uniqueUsers: (analytics.uniqueUsers ? new Set(analytics.uniqueUsers).size : 0)
        };
      })
    };
  };
  
  
export const getSpecificUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    const analytics = await Analytics.findOne({ shortUrl: alias }).lean();
    if (!analytics) {
      return res.status(404).json({ error: 'Analytics not found' });
    }

    const cleanedResponse = cleanAnalyticsResponse(analytics);

    return res.json(cleanedResponse);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Error fetching analytics' });
  }
};

export const getTopicAnalytics = async (req, res) => {
    const { topic } = req.params;
  
    try {
     
      const urls = await ShortUrl.find({ topic });
      const shortUrls = urls.map(url => url.shortUrl);
  
      const analytics = await Analytics.find({ shortUrl: { $in: shortUrls } });
  
      const response = cleanTopicAnalyticsResponse(analytics, shortUrls);
     // console.log('Serving fresh data and caching it');
      return res.json(response);
    } catch (err) {
      console.error('Error fetching topic analytics:', err);
      return res.status(500).json({ error: 'Error fetching topic analytics' });
    }
  };
  
  
export const getOverallAnalytics = async (req, res) => {
    try {
      const userId = req.user.googleId;
  
      const urls = await ShortUrl.find({ userId });
      const shortUrls = urls.map(url => url.shortUrl);
  
      const analytics = await Analytics.find({ shortUrl: { $in: shortUrls } });
  
      const totalClicks = analytics.reduce((sum, a) => sum + a.totalClicks, 0);
      const uniqueUsers = new Set(analytics.flatMap(a => a.uniqueUsers)).size;
  
      // Aggregating clicks by date
      const clicksByDate = analytics.reduce((acc, a) => {
        a.clicksByDate.forEach(dateClick => {
          const existing = acc.find(d => d.date === dateClick.date);
          if (existing) {
            existing.clickCount += dateClick.clickCount;
          } else {
            acc.push({ date: dateClick.date, clickCount: dateClick.clickCount });
          }
        });
        return acc;
      }, []).slice(-7); // Only keep the last 7 days
  
      // Aggregating data by OS type
      const osType = analytics.reduce((acc, a) => {
        a.osType.forEach(os => {
          const existing = acc.find(o => o.osName === os.osName);
          if (existing) {
            existing.uniqueClicks += os.uniqueClicks;
            existing.uniqueUsers = Array.isArray(existing.uniqueUsers)
              ? [...new Set([...existing.uniqueUsers, ...os.uniqueUsers])]
              : [os.uniqueUsers];
          } else {
            acc.push({
              osName: os.osName,
              uniqueClicks: os.uniqueClicks,
              uniqueUsers: Array.isArray(os.uniqueUsers) ? os.uniqueUsers : [os.uniqueUsers], // Ensure os.uniqueUsers is always an array
            });
          }
        });
        return acc;
      }, []);
  
      // Aggregating data by device type
      const deviceType = analytics.reduce((acc, a) => {
        a.deviceType.forEach(device => {
          const existing = acc.find(d => d.deviceName === device.deviceName);
          if (existing) {
            existing.uniqueClicks += device.uniqueClicks;
            existing.uniqueUsers = Array.isArray(existing.uniqueUsers)
              ? [...new Set([...existing.uniqueUsers, ...device.uniqueUsers])]
              : [device.uniqueUsers]; 
          } else {
            acc.push({
              deviceName: device.deviceName,
              uniqueClicks: device.uniqueClicks,
              uniqueUsers: Array.isArray(device.uniqueUsers) ? device.uniqueUsers : [device.uniqueUsers], // Ensure device.uniqueUsers is always an array
            });
          }
        });
        return acc;
      }, []);
  
      // Sending the response in the required format
      return res.json({
        totalUrls: urls.length,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType
      });
    } catch (err) {
      console.error('Error fetching overall analytics:', err);
      return res.status(500).json({ error: 'Error fetching overall analytics' });
    }
  };
  

// Update analytics for a short URL
export const updateAnalytics = async (shortUrl, userAgent) => {
  try {
    const osName = getOS(userAgent);
    const deviceName = getDeviceType(userAgent);
    const currentDate = new Date().toISOString().split('T')[0];

    let analytics = await Analytics.findOne({ shortUrl });
    if (!analytics) {
      analytics = new Analytics({
        shortUrl,
        totalClicks: 0,
        uniqueUsers: [],
        clicksByDate: [],
        osType: [],
        deviceType: []
      });
    }

    analytics.totalClicks += 1;
    if (!analytics.uniqueUsers.includes(userAgent)) {
      analytics.uniqueUsers.push(userAgent);
    }

    const dateIndex = analytics.clicksByDate.findIndex(item => item.date === currentDate);
    if (dateIndex !== -1) {
      analytics.clicksByDate[dateIndex].clickCount += 1;
    } else {
      analytics.clicksByDate.push({ date: currentDate, clickCount: 1 });
    }

    const osIndex = analytics.osType.findIndex(item => item.osName === osName);
    if (osIndex !== -1) {
      analytics.osType[osIndex].uniqueClicks += 1;
      if (!analytics.osType[osIndex].uniqueUsers.includes(userAgent)) {
        analytics.osType[osIndex].uniqueUsers.push(userAgent);
      }
    } else {
      analytics.osType.push({ osName, uniqueClicks: 1, uniqueUsers: [userAgent] });
    }

    const deviceIndex = analytics.deviceType.findIndex(item => item.deviceName === deviceName);
    if (deviceIndex !== -1) {
      analytics.deviceType[deviceIndex].uniqueClicks += 1;
      if (!analytics.deviceType[deviceIndex].uniqueUsers.includes(userAgent)) {
        analytics.deviceType[deviceIndex].uniqueUsers.push(userAgent);
      }
    } else {
      analytics.deviceType.push({ deviceName, uniqueClicks: 1, uniqueUsers: [userAgent] });
    }

    await analytics.save();
  } catch (err) {
    console.error('Error updating analytics:', err);
  }
};

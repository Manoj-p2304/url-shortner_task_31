import Analytics from '../models/Analytics.js';
import ShortUrl from '../models/ShortUrl.js';
import { getOS, getDeviceType } from '../utils/geoTracker.js';

export const getSpecificUrlAnalytics = async (req, res) => {
  const { alias } = req.params;
  try {
    const analytics = await Analytics.findOne({ shortUrl: alias });
    if (!analytics) {
      return res.status(404).json({ error: 'Analytics not found' });
    }

    const recentClicks = analytics.clicksByDate.slice(-7);

    const osTypeWithUniqueUsers = analytics.osType.map(os => ({
      ...os,
      uniqueUsers: os.uniqueUsers.length
    }));

    const deviceTypeWithUniqueUsers = analytics.deviceType.map(device => ({
      ...device,
      uniqueUsers: device.uniqueUsers.length
    }));

    return res.json({
      totalClicks: analytics.totalClicks,
      uniqueUsers: analytics.uniqueUsers.length,
      clicksByDate: recentClicks,
      osType: osTypeWithUniqueUsers,
      deviceType: deviceTypeWithUniqueUsers
    });
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

    const totalClicks = analytics.reduce((sum, a) => sum + a.totalClicks, 0);
    const uniqueUsers = new Set(analytics.flatMap(a => a.uniqueUsers)).size;
    
    const clicksByDate = analytics.reduce((acc, a) => {
      a.clicksByDate.forEach(dateClick => {
        const existing = acc.find(d => d.date === dateClick.date);
        if (existing) {
          existing.clickCount += dateClick.clickCount;
        } else {
          acc.push({ ...dateClick });
        }
      });
      return acc;
    }, []).slice(-7);

    const urlDetails = shortUrls.map(shortUrl => {
      const urlAnalytics = analytics.find(a => a.shortUrl === shortUrl);
      return {
        shortUrl,
        totalClicks: urlAnalytics ? urlAnalytics.totalClicks : 0,
        uniqueUsers: urlAnalytics ? urlAnalytics.uniqueUsers.length : 0
      };
    });

    return res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlDetails
    });
  } catch (err) {
    console.error('Error fetching topic analytics:', err);
    return res.status(500).json({ error: 'Error fetching topic analytics' });
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.googleId;
    console.log("userId", userId)
    const urls = await ShortUrl.find({ userId });
    console.log("urls", urls)
    const shortUrls = urls.map(url => url.shortUrl);

    const analytics = await Analytics.find({ shortUrl: { $in: shortUrls } });
    console.log("analytics", analytics)

    const totalClicks = analytics.reduce((sum, a) => sum + a.totalClicks, 0);
    const uniqueUsers = new Set(analytics.flatMap(a => a.uniqueUsers)).size;

    const clicksByDate = analytics.reduce((acc, a) => {
      a.clicksByDate.forEach(dateClick => {
        const existing = acc.find(d => d.date === dateClick.date);
        if (existing) {
          existing.clickCount += dateClick.clickCount;
        } else {
          acc.push({ ...dateClick });
        }
      });
      return acc;
    }, []).slice(-7);

    const osType = analytics.reduce((acc, a) => {
        a.osType.forEach(os => {
          const existing = acc.find(o => o.osName === os.osName);
          if (existing) {
            existing.uniqueClicks += os.uniqueClicks;
            existing.uniqueUsers = [
              ...new Set([
                ...(Array.isArray(existing.uniqueUsers) ? existing.uniqueUsers : []), // Ensure existing.uniqueUsers is an array
                ...(Array.isArray(os.uniqueUsers) ? os.uniqueUsers : [])              // Ensure os.uniqueUsers is an array
              ])
            ];
          } else {
            acc.push({
              osName: os.osName,
              uniqueClicks: os.uniqueClicks,
              uniqueUsers: Array.isArray(os.uniqueUsers) ? os.uniqueUsers : [] // Initialize as an array
            });
          }
        });
        return acc;
      }, []);
      
      

      const deviceType = analytics.reduce((acc, a) => {
        a.deviceType.forEach(device => {
          const existing = acc.find(d => d.deviceName === device.deviceName);
          if (existing) {
            existing.uniqueClicks += device.uniqueClicks;
            existing.uniqueUsers = [
              ...new Set([
                ...(Array.isArray(existing.uniqueUsers) ? existing.uniqueUsers : []), // Ensure existing.uniqueUsers is an array
                ...(Array.isArray(device.uniqueUsers) ? device.uniqueUsers : [])      // Ensure device.uniqueUsers is an array
              ])
            ];
          } else {
            acc.push({
              deviceName: device.deviceName,
              uniqueClicks: device.uniqueClicks,
              uniqueUsers: Array.isArray(device.uniqueUsers) ? device.uniqueUsers : [] // Initialize as an array
            });
          }
        });
        return acc;
      }, []);
      
      

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
      analytics.osType.push({
        osName,
        uniqueClicks: 1,
        uniqueUsers: [userAgent]
      });
    }

    const deviceIndex = analytics.deviceType.findIndex(item => item.deviceName === deviceName);
    if (deviceIndex !== -1) {
      analytics.deviceType[deviceIndex].uniqueClicks += 1;
      if (!analytics.deviceType[deviceIndex].uniqueUsers.includes(userAgent)) {
        analytics.deviceType[deviceIndex].uniqueUsers.push(userAgent);
      }
    } else {
      analytics.deviceType.push({
        deviceName,
        uniqueClicks: 1,
        uniqueUsers: [userAgent]
      });
    }

    await analytics.save();
  } catch (err) {
    console.error('Error updating analytics:', err);
  }
};
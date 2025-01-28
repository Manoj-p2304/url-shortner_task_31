export const cleanAnalyticsResponse = (analyticsData) => {
    console.log("analyticsData", analyticsData);
  
    return {
      totalClicks: analyticsData.totalClicks,
      uniqueUsers: analyticsData.uniqueUsers.length, // Count of unique users
      clicksByDate: analyticsData.clicksByDate.map((entry) => ({
        date: entry.date,
        clickCount: entry.clickCount,
      })),
      osType: analyticsData.osType.map((entry) => ({
        osName: entry.osName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers.length, // Unique users count for OS type
      })),
      deviceType: analyticsData.deviceType.map((entry) => ({
        deviceName: entry.deviceName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers.length, // Unique users count for device type
      })),
    };
  };
  

  export const formatTopicAnalyticsData = (analytics, shortUrls) => {
    // Calculate total clicks and unique users across all URLs
    const totalClicks = analytics.reduce((sum, a) => sum + a.totalClicks, 0);
    const uniqueUsers = new Set(analytics.flatMap(a => a.uniqueUsers)).size;
  
    // Aggregate clicks by date for the past 7 days
    const clicksByDate = analytics
      .reduce((acc, a) => {
        a.clicksByDate.forEach(dateClick => {
          const existing = acc.find(d => d.date === dateClick.date);
          if (existing) {
            existing.clickCount += dateClick.clickCount;
          } else {
            acc.push({ ...dateClick });
          }
        });
        return acc;
      }, [])
      .slice(-7); // Only keep the last 7 days of data
  
    // Format the data for each URL under the topic
    const urlsData = shortUrls.map(shortUrl => {
      const urlAnalytics = analytics.find(a => a.shortUrl === shortUrl);
      return {
        shortUrl,
        totalClicks: urlAnalytics?.totalClicks || 0,
        uniqueUsers: new Set(urlAnalytics?.uniqueUsers).size || 0, // Unique users count
      };
    });
  
    // Return the formatted response
    return {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlsData,
    };
  };
  
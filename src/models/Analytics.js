import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    shortUrl: String,
    totalClicks: { type: Number, default: 0 },
    uniqueUsers: { type: [String], default: [] },
    clicksByDate: [{
      date: String,
      clickCount: Number
    }],
    osType: [{
      osName: String,
      uniqueClicks: Number,
      uniqueUsers: [String]
    }],
    deviceType: [{
      deviceName: String,
      uniqueClicks: Number,
      uniqueUsers: [String]
    }]
  });

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

export default Analytics;

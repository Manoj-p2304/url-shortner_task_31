import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true, unique: true },
  totalClicks: { type: Number, default: 0 },
  uniqueUsers: { type: [String], default: [] },
  clicksByDate: [
    {
      date: { type: String },
      clickCount: { type: Number, default: 0 },
    },
  ],
  osType: [
    {
      osName: { type: String },
      uniqueClicks: { type: Number, default: 0 },
      uniqueUsers: { type: [String], default: [] },
    },
  ],
  deviceType: [
    {
      deviceName: { type: String },
      uniqueClicks: { type: Number, default: 0 },
      uniqueUsers: { type: [String], default: [] },
    },
  ],
});

export default mongoose.model('Analytics', AnalyticsSchema);

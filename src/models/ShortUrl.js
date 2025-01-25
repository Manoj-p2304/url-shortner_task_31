import mongoose from 'mongoose';

const ShortUrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customAlias: { type: String },
  topic: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ShortUrl = mongoose.model('ShortUrl', ShortUrlSchema);

export default ShortUrl;

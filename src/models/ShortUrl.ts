import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the ShortUrl model
export interface IShortUrl extends Document {
  longUrl: string;
  shortUrl: string;
  customAlias?: string; // Optional field
  topic?: string; // Optional field
  userId: mongoose.Schema.Types.ObjectId; // Referencing User model
  createdAt: Date; // Timestamp for when the Short URL was created
}

// Define the schema for the ShortUrl model
const ShortUrlSchema: Schema<IShortUrl> = new Schema({
  longUrl: { type: String, required: true }, // The original URL
  shortUrl: { type: String, required: true, unique: true }, // The shortened URL
  customAlias: { type: String }, // Optional custom alias
  topic: { type: String }, // Optional topic/category
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  createdAt: { type: Date, default: Date.now }, // Default value of current date/time
});

// Create and export the model based on the schema
export default mongoose.model<IShortUrl>('ShortUrl', ShortUrlSchema);

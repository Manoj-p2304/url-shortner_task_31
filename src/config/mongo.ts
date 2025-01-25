import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.error('Unknown error occurred:', error);
        }
        process.exit(1);
      }
      
};

export default connectDB;

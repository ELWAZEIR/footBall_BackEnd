import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/football_academy', {
    await mongoose.connect( 'mongodb://localhost:27017/football_academy', {
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;

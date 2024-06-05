import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/miniProyecto4');
    console.log('Database is connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); 
  }
};
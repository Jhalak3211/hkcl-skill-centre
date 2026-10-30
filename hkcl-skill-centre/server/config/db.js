import mongoose from 'mongoose';

export let isDbConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hkcl_skill_centre';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    // Disable Mongoose command buffering so requests don't hang if MongoDB is offline
    mongoose.set('bufferCommands', false);
    console.warn(`[Database] MongoDB connection notice: ${error.message}`);
    console.warn('[Database] Operating with resilient in-memory fallback for local development & demonstration.');
    return null;
  }
}

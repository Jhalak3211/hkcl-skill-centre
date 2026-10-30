import mongoose from 'mongoose';

// Disable Mongoose command buffering immediately so operations fail fast when DB is offline
mongoose.set('bufferCommands', false);

export let isDbConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hkcl_skill_centre';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isDbConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[Database] MongoDB connection notice: ${error.message}`);
    console.warn('[Database] Operating with resilient in-memory fallback for local development & demonstration.');
    return null;
  }
}

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('⚡ No MONGO_URI provided in environment. Initializing MongoMemoryServer for instant local demo...');
      try {
        memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        console.log(`✅ In-memory MongoDB active at: ${mongoUri}`);
      } catch (memErr) {
        console.warn('⚠️ Could not start MongoMemoryServer, falling back to local mongodb://127.0.0.1:27017/veloop_rewards');
        mongoUri = 'mongodb://127.0.0.1:27017/veloop_rewards';
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Attempting fallback to MongoMemoryServer...');
    try {
      memoryServer = await MongoMemoryServer.create();
      const fallbackUri = memoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Connected to fallback MongoMemoryServer: ${conn.connection.host}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`💥 Fatal: Failed to initialize MongoDB: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

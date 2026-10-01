const mongoose = require('mongoose');

/**
 * MongoDB Database Connection Handler
 * 
 * Concept:
 * 1. Checks if a MongoDB server is reachable via MONGO_URI (e.g. MongoDB Atlas or local mongod).
 * 2. If no local or cloud MongoDB is running, it automatically spins up `mongodb-memory-server`
 *    in development mode, enabling immediate testing and development out-of-the-box!
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge';

  try {
    // Attempt standard connection with 2.5s timeout to not block startup if local mongod is absent
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Standard connection to ${uri} failed (${err.message}).`);

    // In development mode, fallback to in-memory MongoDB
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Initializing in-memory Mongo server fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[MongoDB] Connected to In-Memory instance: ${memoryUri}`);
        return conn;
      } catch (memErr) {
        console.error('[MongoDB] In-memory fallback failed:', memErr.message);
        throw memErr;
      }
    } else {
      throw err;
    }
  }
};

module.exports = connectDB;

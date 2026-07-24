import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  const readyState = mongoose.connection.readyState;

  // 1 = connected
  if (readyState === 1) {
    return mongoose.connection;
  }

  // 2 = connecting
  if (readyState === 2 && cached!.promise) {
    return cached!.promise;
  }

  // Optimized MongoDB Connection Options for high performance and low latency
  const opts = {
    bufferCommands: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
    return mongooseInstance;
  });

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    cached!.conn = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;

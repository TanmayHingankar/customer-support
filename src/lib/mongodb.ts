import mongoose from 'mongoose';

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = globalThis.mongooseCache || { conn: null, promise: null };
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  return uri;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = getMongoUri();
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: 'customer-support-ai',
      bufferCommands: false,
      // `bufferMaxEntries` was removed in newer MongoDB drivers; avoid passing it
      autoIndex: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

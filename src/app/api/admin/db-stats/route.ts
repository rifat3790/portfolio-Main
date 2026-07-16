import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    if (!mongoose.connection.db) {
      return NextResponse.json({ error: 'Database connection not ready.' }, { status: 500 });
    }

    // Run dbStats command in MongoDB
    const stats = await mongoose.connection.db.command({ dbStats: 1 });

    // Format metrics
    const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
    const storageSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
    const indexSizeMB = (stats.indexSize / (1024 * 1024)).toFixed(2);

    // Limit of Atlas M0 Sandbox is 512MB
    const limitMB = 512;
    const percentage = ((stats.storageSize / (limitMB * 1024 * 1024)) * 100).toFixed(4);

    return NextResponse.json({
      db: stats.db,
      collections: stats.collections,
      views: stats.views || 0,
      objects: stats.objects,
      dataSizeMB,
      storageSizeMB,
      indexSizeMB,
      limitMB,
      percentage,
      raw: stats
    });
  } catch (error) {
    console.error('Database stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch database metrics' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    // Only fetch published blogs
    const blogs = await Blog.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .replace(/[\s_-]+/g, '-') // replace spaces, underscore with -
    .replace(/^-+|-+$/g, ''); // remove leading/trailing -
}

// GET all blogs for admin
export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const blogs = await Blog.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a blog post
export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    if (!data.title || !data.content || !data.excerpt) {
      return NextResponse.json({ error: 'Missing required fields (title, excerpt, content)' }, { status: 400 });
    }

    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);

    // Check slug uniqueness
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'A blog post with this slug already exists. Please choose a different title or slug.' }, { status: 400 });
    }

    const newBlog = await Blog.create({
      ...data,
      slug,
      order: data.order || 0
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { clearDbCache, writeHomepageDataJson } from '@/lib/data-cache';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const data = await req.json();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const newSlug = data.slug ? generateSlug(data.slug) : (data.title ? generateSlug(data.title) : blog.slug);

    if (newSlug !== blog.slug) {
      const existing = await Blog.findOne({ slug: newSlug });
      if (existing) {
        return NextResponse.json({ error: 'A blog post with this slug already exists' }, { status: 400 });
      }
      blog.slug = newSlug;
    }

    Object.assign(blog, data);
    await blog.save();

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    revalidatePath('/');
    clearDbCache();
    await writeHomepageDataJson();

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

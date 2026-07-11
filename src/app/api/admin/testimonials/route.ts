import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET all testimonials (Admin view, sorted by order)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Testimonials GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST create testimonial
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newTestimonial = await Testimonial.create(data);
    revalidatePath('/');
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Testimonials POST API error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

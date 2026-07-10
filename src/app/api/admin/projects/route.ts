import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { isAuthenticated } from '@/lib/auth';

// GET all projects (Admin view, sorted by order)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create project
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newProject = await Project.create(data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Projects POST API error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

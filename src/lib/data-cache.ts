import dbConnect from './db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import Service from '@/models/Service';
import Experience from '@/models/Experience';
import { revalidatePath } from 'next/cache';

interface CacheContainer {
  data: any;
  timestamp: number;
}

declare global {
  // eslint-disable-next-line no-var
  var homepageDataCache: CacheContainer | undefined;
}

const CACHE_TTL_MS = 60 * 1000; // Cache for 60 seconds globally across all requests

// Helper to fetch homepage data directly from MongoDB.
async function fetchFreshHomepageData() {
  console.log('Fetching fresh homepage data from MongoDB...');
  await dbConnect();

  const [projectsData, skillsData, testimonialsData, blogsData, settingsData, servicesData, experiencesData] = await Promise.all([
    Project.find({}).sort({ order: 1, createdAt: -1 }).lean(),
    Skill.find({}).sort({ order: 1, createdAt: -1 }).lean(),
    Testimonial.find({}).sort({ order: 1, createdAt: -1 }).lean(),
    Blog.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(),
    Setting.findOne().lean(),
    Service.find({}).sort({ order: 1, createdAt: -1 }).lean(),
    Experience.find({}).sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  return {
    projects: JSON.parse(JSON.stringify(projectsData)),
    skills: JSON.parse(JSON.stringify(skillsData)),
    testimonials: JSON.parse(JSON.stringify(testimonialsData)),
    blogs: JSON.parse(JSON.stringify(blogsData)),
    services: JSON.parse(JSON.stringify(servicesData)),
    experiences: JSON.parse(JSON.stringify(experiencesData)),
    settings: settingsData ? JSON.parse(JSON.stringify(settingsData)) : null,
  };
}

export async function getHomepageData() {
  const now = Date.now();
  
  // Use in-memory cache if available and not expired
  if (global.homepageDataCache && (now - global.homepageDataCache.timestamp < CACHE_TTL_MS)) {
    console.log('Serving homepage data from in-memory cache...');
    return global.homepageDataCache.data;
  }

  const data = await fetchFreshHomepageData();

  // Save to in-memory global cache
  global.homepageDataCache = {
    data,
    timestamp: now,
  };

  return data;
}

// Kept for API compatibility — updates the cache and returns fresh data
export async function writeHomepageDataJson() {
  clearDbCache();
  return await getHomepageData();
}

export async function getSettingsOnly() {
  const data = await getHomepageData();
  return data.settings;
}

// Triggers an on-demand invalidation of the Next.js page and in-memory cache.
export function clearDbCache() {
  console.log('Clearing database query cache and revalidating paths...');
  global.homepageDataCache = undefined;
  try {
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to revalidate path:', error);
  }
}



import dbConnect from './db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';

interface DbCache {
  projects: any[];
  skills: any[];
  testimonials: any[];
  blogs: any[];
  settings: any;
  lastFetched: number;
}

declare global {
  // eslint-disable-next-line no-var
  var dbCache: DbCache | undefined;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getHomepageData() {
  const now = Date.now();
  
  if (global.dbCache && (now - global.dbCache.lastFetched < CACHE_TTL)) {
    console.log('Returning homepage data from memory cache');
    return global.dbCache;
  }

  console.log('Fetching homepage data from database...');
  await dbConnect();

  const [projectsData, skillsData, testimonialsData, blogsData, settingsData] = await Promise.all([
    Project.find({}).sort({ order: 1, createdAt: -1 }),
    Skill.find({}).sort({ order: 1, createdAt: -1 }),
    Testimonial.find({}).sort({ order: 1, createdAt: -1 }),
    Blog.find({ published: true }).sort({ order: 1, createdAt: -1 }),
    Setting.findOne(),
  ]);

  const data = {
    projects: JSON.parse(JSON.stringify(projectsData)),
    skills: JSON.parse(JSON.stringify(skillsData)),
    testimonials: JSON.parse(JSON.stringify(testimonialsData)),
    blogs: JSON.parse(JSON.stringify(blogsData)),
    settings: settingsData ? JSON.parse(JSON.stringify(settingsData)) : null,
    lastFetched: now,
  };

  global.dbCache = data;
  return data;
}

export async function getSettingsOnly() {
  const now = Date.now();
  if (global.dbCache && (now - global.dbCache.lastFetched < CACHE_TTL)) {
    return global.dbCache.settings;
  }

  await dbConnect();
  const settingsData = await Setting.findOne();
  const settings = settingsData ? JSON.parse(JSON.stringify(settingsData)) : null;

  if (global.dbCache) {
    global.dbCache.settings = settings;
  }
  
  return settings;
}

export function clearDbCache() {
  console.log('Clearing database memory cache');
  global.dbCache = undefined;
}

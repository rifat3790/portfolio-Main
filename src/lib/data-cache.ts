import dbConnect from './db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import Service from '@/models/Service';
import Experience from '@/models/Experience';

interface DbCache {
  projects: any[];
  skills: any[];
  testimonials: any[];
  blogs: any[];
  services: any[];
  experiences: any[];
  settings: any;
  lastFetched: number;
}

declare global {
  // eslint-disable-next-line no-var
  var dbCache: DbCache | undefined;
}

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes in memory

// Fetch the cached data. Priority: Memory Cache -> MongoDB database query fallback.
export async function getHomepageData() {
  const now = Date.now();
  
  // 1. Check memory cache
  if (global.dbCache && (now - global.dbCache.lastFetched < CACHE_TTL)) {
    console.log('Returning homepage data from memory cache');
    return global.dbCache;
  }

  // 2. Cache missed or invalidated. Query MongoDB for fresh data!
  console.log('Cache miss. Fetching fresh homepage data from MongoDB...');
  await dbConnect();

  const [projectsData, skillsData, testimonialsData, blogsData, settingsData, servicesData, experiencesData] = await Promise.all([
    Project.find({}).sort({ order: 1, createdAt: -1 }),
    Skill.find({}).sort({ order: 1, createdAt: -1 }),
    Testimonial.find({}).sort({ order: 1, createdAt: -1 }),
    Blog.find({ published: true }).sort({ order: 1, createdAt: -1 }),
    Setting.findOne(),
    Service.find({}).sort({ order: 1, createdAt: -1 }),
    Experience.find({}).sort({ order: 1, createdAt: -1 }),
  ]);

  const data = {
    projects: JSON.parse(JSON.stringify(projectsData)),
    skills: JSON.parse(JSON.stringify(skillsData)),
    testimonials: JSON.parse(JSON.stringify(testimonialsData)),
    blogs: JSON.parse(JSON.stringify(blogsData)),
    services: JSON.parse(JSON.stringify(servicesData)),
    experiences: JSON.parse(JSON.stringify(experiencesData)),
    settings: settingsData ? JSON.parse(JSON.stringify(settingsData)) : null,
    lastFetched: now,
  };

  global.dbCache = data;
  return data;
}

// Keep it compatible with seeder/admin API hooks but no longer write to files at runtime
export async function writeHomepageDataJson() {
  console.log('Regenerating memory cache...');
  return await getHomepageData();
}

export async function getSettingsOnly() {
  const data = await getHomepageData();
  return data.settings;
}

export function clearDbCache() {
  console.log('Clearing database memory cache');
  global.dbCache = undefined;
}

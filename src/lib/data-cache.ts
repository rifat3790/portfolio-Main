import fs from 'fs';
import path from 'path';
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

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in memory in case of rapid page changes
const JSON_FILE_PATH = path.join(process.cwd(), 'src/data/homepage-data.json');

// Write the database state directly to a local JSON file to bypass database round-trips entirely
export async function writeHomepageDataJson() {
  try {
    console.log('Writing database state to local JSON file...');
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
      lastFetched: Date.now(),
    };

    const dir = path.dirname(JSON_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Successfully saved homepage-data.json');
    
    // Warm up the global memory cache too
    global.dbCache = data;
    return data;
  } catch (error) {
    console.error('Error writing homepage-data.json:', error);
  }
}

// Fetch the cached data. Priority: Memory Cache -> Local JSON file -> MongoDB query fallback.
export async function getHomepageData() {
  const now = Date.now();
  
  // 1. Check memory cache
  if (global.dbCache && (now - global.dbCache.lastFetched < CACHE_TTL)) {
    return global.dbCache;
  }

  // 2. Check local JSON file cache
  try {
    if (fs.existsSync(JSON_FILE_PATH)) {
      const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      const data = JSON.parse(fileContent);
      global.dbCache = data; // Keep in memory
      return data;
    }
  } catch (error) {
    console.error('Failed to read local JSON cache file:', error);
  }

  // 3. Fallback to querying the database directly if JSON cache is missing
  console.warn('JSON Cache missing. Querying live database...');
  const data = await writeHomepageDataJson();
  if (data) return data;

  // Last-resort blank data structure to prevent page errors
  return {
    projects: [],
    skills: [],
    testimonials: [],
    blogs: [],
    settings: null,
    lastFetched: now,
  };
}

export async function getSettingsOnly() {
  const data = await getHomepageData();
  return data.settings;
}

export function clearDbCache() {
  console.log('Clearing database memory cache');
  global.dbCache = undefined;
}

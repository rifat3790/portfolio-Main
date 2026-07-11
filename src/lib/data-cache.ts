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

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in memory
const JSON_FILE_PATH = path.join(process.cwd(), 'src/data/homepage-data.json');

// Write the database state directly to a local JSON file to bypass database round-trips entirely
export async function writeHomepageDataJson() {
  try {
    console.log('Querying MongoDB to update local JSON file...');
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

    // Warm up the global memory cache too
    global.dbCache = data;

    // Write to disk asynchronously (non-blocking) so it does not block execution threads
    const dir = path.dirname(JSON_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error writing homepage-data.json:', err);
      } else {
        console.log('Successfully saved homepage-data.json to disk');
      }
    });

    return data;
  } catch (error) {
    console.error('Error in writeHomepageDataJson:', error);
    throw error;
  }
}

// Fetch the cached data. Priority: Memory Cache -> Live DB (and update cache/JSON) -> Fallback local JSON file.
export async function getHomepageData() {
  const now = Date.now();
  
  // 1. Check memory cache
  if (global.dbCache && (now - global.dbCache.lastFetched < CACHE_TTL)) {
    console.log('Returning homepage data from memory cache');
    return global.dbCache;
  }

  // 2. Memory cache missed/invalidated. Query MongoDB for fresh data!
  try {
    console.log('Memory cache missed. Querying MongoDB for fresh data...');
    const data = await writeHomepageDataJson();
    if (data) {
      return data;
    }
  } catch (error) {
    console.error('Failed to query MongoDB, falling back to local JSON file:', error);
  }

  // 3. Fallback to local JSON file if MongoDB is unreachable
  try {
    if (fs.existsSync(JSON_FILE_PATH)) {
      console.log('Returning fallback data from local JSON file');
      const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      const data = JSON.parse(fileContent);
      global.dbCache = data; // Keep in memory
      return data;
    }
  } catch (error) {
    console.error('Failed to read fallback local JSON cache file:', error);
  }

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

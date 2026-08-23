import dbConnect from './db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import Service from '@/models/Service';
import Experience from '@/models/Experience';
import { revalidatePath } from 'next/cache';
import defaultHomepageData from '@/data/homepage-data.json';

interface CacheContainer {
  data: any;
  timestamp: number;
}

declare global {
  // eslint-disable-next-line no-var
  var homepageDataCache: CacheContainer | undefined;
  // eslint-disable-next-line no-var
  var isRevalidatingData: boolean | undefined;
}

const CACHE_STALE_TTL_MS = 2 * 60 * 1000; // 2 minutes background revalidation TTL

function cleanBsonDoc(doc: any): any {
  if (!doc) return doc;
  if (Array.isArray(doc)) {
    return doc.map(cleanBsonDoc);
  }
  if (typeof doc === 'object') {
    const clean: any = {};
    for (const key in doc) {
      if (Object.prototype.hasOwnProperty.call(doc, key)) {
        const val = doc[key];
        if (val && typeof val === 'object' && val._bsontype === 'ObjectID') {
          clean[key] = val.toString();
        } else if (val instanceof Date) {
          clean[key] = val.toISOString();
        } else if (key === '_id') {
          clean[key] = val.toString();
        } else if (Array.isArray(val)) {
          clean[key] = val.map(cleanBsonDoc);
        } else if (val && typeof val === 'object') {
          clean[key] = cleanBsonDoc(val);
        } else {
          clean[key] = val;
        }
      }
    }
    return clean;
  }
  return doc;
}

// Helper to fetch homepage data directly from MongoDB with lean queries
export async function fetchFreshHomepageData() {
  try {
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

    const fresh = {
      projects: cleanBsonDoc(projectsData),
      skills: cleanBsonDoc(skillsData),
      testimonials: cleanBsonDoc(testimonialsData),
      blogs: cleanBsonDoc(blogsData),
      services: cleanBsonDoc(servicesData),
      experiences: cleanBsonDoc(experiencesData),
      settings: settingsData ? cleanBsonDoc(settingsData) : null,
    };

    // Update in-memory cache
    global.homepageDataCache = {
      data: fresh,
      timestamp: Date.now(),
    };

    return fresh;
  } catch (error) {
    console.error('fetchFreshHomepageData background error:', error);
    if (global.homepageDataCache?.data) {
      return global.homepageDataCache.data;
    }
    return defaultHomepageData;
  }
}

export async function getHomepageData() {
  const now = Date.now();

  // Tier 1: In-Memory Hot Cache Available
  if (global.homepageDataCache && global.homepageDataCache.data) {
    const isStale = (now - global.homepageDataCache.timestamp > CACHE_STALE_TTL_MS);
    if (isStale && !global.isRevalidatingData) {
      global.isRevalidatingData = true;
      // Background non-blocking revalidation
      fetchFreshHomepageData().finally(() => {
        global.isRevalidatingData = false;
      });
    }
    return global.homepageDataCache.data;
  }

  // Tier 2: Instant Cold-Start Boot (Zero Latency)
  // Seed the cache with bundled JSON immediately so the user NEVER waits for MongoDB cold connections
  global.homepageDataCache = {
    data: defaultHomepageData,
    timestamp: now,
  };

  // Kick off background fetch to sync fresh data from MongoDB
  if (!global.isRevalidatingData) {
    global.isRevalidatingData = true;
    fetchFreshHomepageData().finally(() => {
      global.isRevalidatingData = false;
    });
  }

  return defaultHomepageData;
}

// Called after any Admin mutation — immediately refreshes cache and revalidates Next.js ISR paths
export async function writeHomepageDataJson() {
  try {
    const freshData = await fetchFreshHomepageData();
    global.homepageDataCache = {
      data: freshData,
      timestamp: Date.now(),
    };
    try {
      revalidatePath('/');
      revalidatePath('/admin');
    } catch {}
    return freshData;
  } catch (error) {
    console.error('Error in writeHomepageDataJson:', error);
    return await getHomepageData();
  }
}

export async function getSettingsOnly() {
  const data = await getHomepageData();
  return data?.settings || defaultHomepageData.settings;
}

// Triggers an on-demand invalidation of the Next.js page and in-memory cache.
export function clearDbCache() {
  global.homepageDataCache = undefined;
  global.isRevalidatingData = false;
  try {
    revalidatePath('/');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to revalidate path:', error);
  }
}



import dbConnect from './db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import Service from '@/models/Service';
import Experience from '@/models/Experience';

// No caching — always fetch fresh from MongoDB so admin changes reflect instantly
// on both localhost and live site.
export async function getHomepageData() {
  console.log('Fetching fresh homepage data from MongoDB...');
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

// Kept for API compatibility — no-op since there's no cache to clear
export async function writeHomepageDataJson() {
  return await getHomepageData();
}

export async function getSettingsOnly() {
  const data = await getHomepageData();
  return data.settings;
}

// No-op — kept for API compatibility
export function clearDbCache() {
  // Cache removed — nothing to clear
}

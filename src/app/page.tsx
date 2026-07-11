import { getHomepageData } from '@/lib/data-cache';
import HomeClient from './HomeClient';

export default async function Home() {
  let projects = [];
  let skills = [];
  let testimonials = [];
  let blogs = [];
  let settings = null;

  try {
    const data = await getHomepageData();
    projects = data.projects;
    skills = data.skills;
    testimonials = data.testimonials;
    blogs = data.blogs;
    settings = data.settings;
  } catch (error) {
    console.error('Error fetching database records for homepage:', error);
  }

  return (
    <HomeClient
      initialProjects={projects}
      initialSkills={skills}
      initialTestimonials={testimonials}
      initialBlogs={blogs}
      siteSettings={settings}
    />
  );
}

import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Testimonial from '@/models/Testimonial';
import Blog from '@/models/Blog';
import Setting from '@/models/Setting';
import HomeClient from './HomeClient';

// Enable dynamic rendering to query database on every request
export const revalidate = 0;

export default async function Home() {
  let projects = [];
  let skills = [];
  let testimonials = [];
  let blogs = [];
  let settings = null;

  try {
    await dbConnect();

    // Query databases sorted by order index
    const projectsData = await Project.find({}).sort({ order: 1, createdAt: -1 });
    const skillsData = await Skill.find({}).sort({ order: 1, createdAt: -1 });
    const testimonialsData = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    const blogsData = await Blog.find({ published: true }).sort({ order: 1, createdAt: -1 });
    const settingsData = await Setting.findOne();

    // Safely serialize database values to plain JSON objects for Client Components
    projects = JSON.parse(JSON.stringify(projectsData));
    skills = JSON.parse(JSON.stringify(skillsData));
    testimonials = JSON.parse(JSON.stringify(testimonialsData));
    blogs = JSON.parse(JSON.stringify(blogsData));
    settings = settingsData ? JSON.parse(JSON.stringify(settingsData)) : null;
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

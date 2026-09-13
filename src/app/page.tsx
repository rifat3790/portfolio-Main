import { getHomepageData } from '@/lib/data-cache';
import HomeClient from './HomeClient';
import JsonLd from './components/JsonLd';
import SeoSemanticContent from './components/SeoSemanticContent';

// Enable ISR (Incremental Static Regeneration) for sub-50ms instant Global Edge CDN loads
// On-demand revalidation is automatically executed whenever mutations occur in /admin
export const revalidate = 86400; // 24 hours ISR

export default async function Home() {
  let projects = [];
  let skills = [];
  let testimonials = [];
  let blogs = [];
  let services = [];
  let experiences = [];
  let settings = null;

  try {
    const data = await getHomepageData();
    projects = data.projects || [];
    skills = data.skills || [];
    testimonials = data.testimonials || [];
    blogs = data.blogs || [];
    services = data.services || [];
    experiences = data.experiences || [];
    settings = data.settings || null;
  } catch (error) {
    console.error('Error fetching database records for homepage:', error);
  }

  const siteUrl = settings?.canonicalUrl || 'https://rifat-portfolio-brown.vercel.app';

  return (
    <>
      {/* Comprehensive Schema.org JSON-LD Knowledge Graph for Search Engine Crawlers */}
      <JsonLd
        siteSettings={settings}
        projects={projects}
        experiences={experiences}
        blogs={blogs}
        services={services}
        testimonials={testimonials}
        skills={skills}
        siteUrl={siteUrl}
      />

      {/* Semantic NLP & Entity Architecture for Search Engine Dominance */}
      <SeoSemanticContent
        siteSettings={settings}
        projects={projects}
        experiences={experiences}
        blogs={blogs}
        services={services}
        skills={skills}
      />

      {/* Main Interactive Client Presentation */}
      <HomeClient
        initialProjects={projects}
        initialSkills={skills}
        initialTestimonials={testimonials}
        initialBlogs={blogs}
        initialServices={services}
        initialExperiences={experiences}
        siteSettings={settings}
      />
    </>
  );
}

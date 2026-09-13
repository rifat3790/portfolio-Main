import React from 'react';
import { ISetting, IProject, IExperience, IBlog, IService, ISkill } from '../sections/shared/types';

interface SeoSemanticContentProps {
  siteSettings: ISetting | null;
  projects?: IProject[];
  experiences?: IExperience[];
  blogs?: IBlog[];
  services?: IService[];
  skills?: ISkill[];
}

/**
 * SeoSemanticContent
 * Provides accessible, semantic HTML5 entity indexing for search engine crawlers (Googlebot, Bingbot, Applebot)
 * and screen readers. Establishes unambiguous entity relationships for Refayet Hossen (Rifayet Hossen),
 * his projects, past client companies, services, blogs, and core skills.
 */
export default function SeoSemanticContent({
  siteSettings,
  projects = [],
  experiences = [],
  blogs = [],
  services = [],
  skills = [],
}: SeoSemanticContentProps) {
  const name = siteSettings?.aboutName || 'Refayet Hossen';
  const role = siteSettings?.headerFooterRole || 'Best Shopify Developer & Full Stack Web Engineer';
  const email = siteSettings?.email || siteSettings?.aboutEmail || 'mdrifayethossen@gmail.com';
  const location = siteSettings?.aboutLocation || 'Dhaka, Bangladesh';

  return (
    <aside
      aria-label="Authoritative Entity Directory & Semantic Index"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      <header>
        <h2>{name} (Rifayet Hossen) - Semantic Knowledge Graph & Professional Portfolio Index</h2>
        <p>
          Official portfolio and authoritative digital hub of {name}, also searched and known as Rifayet Hossen, Md. Refayet Hossen, and Rifat.
          Top-rated Shopify Developer, Liquid Expert, Next.js Architect, Full Stack Web Developer, and E-Commerce Specialist.
        </p>
      </header>

      {/* Core Entity Information */}
      <section>
        <h3>Professional Profile & Core Specializations</h3>
        <ul>
          <li><strong>Full Name:</strong> {name} (Aliases: Rifayet Hossen, Md. Refayet Hossen, Md Rifayet Hossen, Rifat)</li>
          <li><strong>Primary Role:</strong> {role}</li>
          <li><strong>Location:</strong> {location} (Serving clients across United States, United Kingdom, Canada, Australia, Europe, Bangladesh, and Worldwide)</li>
          <li><strong>Contact Email:</strong> {email}</li>
          <li><strong>Specializations:</strong> Best Shopify Developer, Custom Shopify Theme Development, Shopify Liquid Coding, E-Commerce Website Build, Ecommerce Store Optimization, Full Stack Web Development (Next.js, React, Node.js, Express, MongoDB), New Website Build from scratch, Core Web Vitals Optimization, Headless Commerce.</li>
        </ul>
      </section>

      {/* Services Index */}
      {services.length > 0 && (
        <section>
          <h3>Web Development & Shopify Services Offered by {name}</h3>
          <ul>
            {services.map((svc) => (
              <li key={svc._id}>
                <strong>{svc.title}:</strong> {svc.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects Directory Index */}
      {projects.length > 0 && (
        <section>
          <h3>Featured Projects & Case Studies Engineered by {name}</h3>
          <ul>
            {projects.map((proj) => (
              <li key={proj._id}>
                <strong>{proj.title} ({proj.category || 'Web Application'}):</strong> {proj.description}
                {proj.richText && ` - ${proj.richText}`}
                <span> Tech Stack: {proj.techStack?.join(', ')}</span>
                {proj.liveLink && <span> - Live URL: {proj.liveLink}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience & Company History Index */}
      {experiences.length > 0 && (
        <section>
          <h3>Work History, Client Companies & Professional Experience</h3>
          <ul>
            {experiences.map((exp) => (
              <li key={exp._id}>
                <strong>{exp.role} at {exp.company} ({exp.duration}):</strong> {exp.description}
                {exp.responsibilities && ` Key Duties: ${exp.responsibilities.replace(/\n/g, ' ')}`}
                {exp.techStack && <span> - Technologies: {exp.techStack.join(', ')}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Technical Skills Index */}
      {skills.length > 0 && (
        <section>
          <h3>Technical Skills, Languages & Frameworks</h3>
          <p>
            {skills.map((s) => `${s.name} (${s.category} - ${s.proficiency}%)`).join(' • ')}
          </p>
        </section>
      )}

      {/* Blog & Publications Index */}
      {blogs.length > 0 && (
        <section>
          <h3>Engineering Publications, Articles & Tutorials by {name}</h3>
          <ul>
            {blogs.map((b) => (
              <li key={b._id || b.slug}>
                <strong>{b.title}:</strong> {b.excerpt}
                <span> Tags: {b.tags?.join(', ')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}

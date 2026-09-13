import React from 'react';
import { ISetting, IProject, IExperience, IBlog, IService, ITestimonial, ISkill } from '../sections/shared/types';

interface JsonLdProps {
  siteSettings: ISetting | null;
  projects?: IProject[];
  experiences?: IExperience[];
  blogs?: IBlog[];
  services?: IService[];
  testimonials?: ITestimonial[];
  skills?: ISkill[];
  siteUrl?: string;
}

export default function JsonLd({
  siteSettings,
  projects = [],
  experiences = [],
  blogs = [],
  services = [],
  testimonials = [],
  skills = [],
  siteUrl = 'https://rifat-portfolio-brown.vercel.app',
}: JsonLdProps) {
  const canonical = (siteSettings?.canonicalUrl || siteUrl).replace(/\/$/, '');
  const name = siteSettings?.aboutName || 'Refayet Hossen';
  const email = siteSettings?.email || siteSettings?.aboutEmail || 'mdrifayethossen@gmail.com';
  const phone = siteSettings?.phone || '+880 1700-000000';
  const location = siteSettings?.aboutLocation || 'Dhaka, Bangladesh';

  // Extract all skill names
  const allSkillNames = skills.length > 0
    ? skills.map(s => s.name)
    : ['Shopify', 'Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Liquid', 'Tailwind CSS', 'GraphQL', 'REST APIs'];

  // Calculate review score
  const reviewCount = testimonials.length > 0 ? testimonials.length : 38;
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  // 1. ProfilePage & Person Knowledge Graph Schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonical}/#profilepage`,
    url: canonical,
    name: 'Refayet Hossen (Rifayet Hossen) | Best Shopify Developer & Full Stack Web Developer',
    description: siteSettings?.seoDescription || 'Refayet Hossen (also known as Rifayet Hossen) is a premier Shopify Developer, Full Stack Web Developer, and E-commerce Specialist building high-converting Shopify stores, custom e-commerce websites, and modern web applications.',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${canonical}/refayet-profile.png`,
      caption: 'Refayet Hossen - Best Shopify Developer & Full Stack Web Developer',
    },
    mainEntity: {
      '@type': 'Person',
      '@id': `${canonical}/#person`,
      name: name,
      alternateName: [
        'Rifayet Hossen',
        'Md. Refayet Hossen',
        'Md Rifayet Hossen',
        'Rifat',
        'rifat3790',
        'Best Shopify Developer',
        'Top Shopify Developer',
        'Shopify Liquid Expert',
        'Full Stack Web Developer',
        'Next.js Developer',
      ],
      givenName: 'Refayet',
      familyName: 'Hossen',
      additionalName: 'Rifayet',
      jobTitle: [
        'Best Shopify Developer',
        'Shopify Developer',
        'Shopify Liquid Developer',
        'Full Stack Web Developer',
        'Next.js Developer',
        'React Developer',
        'Software Engineer',
        'E-Commerce Specialist',
        'Frontend Engineer',
        'Backend Engineer',
      ],
      description: siteSettings?.seoDescription || 'Refayet Hossen is a world-class Shopify Developer and Full Stack Web Engineer specializing in ultra-fast Shopify Liquid themes, headless commerce, and scalable Next.js & React web applications.',
      url: canonical,
      image: `${canonical}/refayet-profile.png`,
      email: email,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'BD',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Green University of Bangladesh',
        sameAs: 'https://green.edu.bd',
      },
      sameAs: [
        siteSettings?.github || 'https://github.com/rifat3790',
        siteSettings?.linkedin || 'https://linkedin.com/in/rifat',
        'https://facebook.com/refayet.hossen',
        'https://github.com/rifat3790',
        siteSettings?.whatsapp ? `https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}` : undefined,
      ].filter(Boolean),
      knowsAbout: [
        'Shopify Development',
        'Shopify Liquid Theme Development',
        'Shopify App & Store Customization',
        'E-Commerce Website Build',
        'Ecommerce Store Architecture',
        'Full Stack Web Development',
        'Next.js 16',
        'React 19',
        'Node.js',
        'TypeScript',
        'MongoDB',
        'Tailwind CSS',
        'Headless Commerce',
        'Core Web Vitals Optimization',
        'Conversion Rate Optimization (CRO)',
        'Search Engine Optimization (SEO)',
        'MERN Stack Development',
        'REST & GraphQL APIs',
        ...allSkillNames,
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance & Bespoke Digital Architecture',
        url: canonical,
      },
      hasOccupation: [
        {
          '@type': 'Occupation',
          name: 'Shopify Developer & Liquid Expert',
          skills: 'Shopify, Liquid, Theme Customization, E-Commerce CRO, Speed Optimization',
        },
        {
          '@type': 'Occupation',
          name: 'Full Stack Web Developer',
          skills: 'Next.js, React, Node.js, TypeScript, MongoDB, Cloud Architecture',
        },
      ],
    },
  };

  // 2. ProfessionalService & LocalBusiness Schema
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${canonical}/#service`,
    name: 'Refayet Hossen - Shopify & Full Stack Web Development Services',
    alternateName: 'Rifayet Hossen E-Commerce & Web Solutions',
    url: canonical,
    logo: `${canonical}/icon.png`,
    image: `${canonical}/services_laptop_display.png`,
    description: 'Bespoke Shopify store creation, custom Liquid themes, full-stack web applications (Next.js, React, Node.js), and new website builds engineered for sub-second speeds and top Google rankings.',
    priceRange: '$$',
    currenciesAccepted: 'USD, EUR, GBP, BDT',
    paymentAccepted: 'Credit Card, PayPal, Bank Transfer, Crypto',
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Bangladesh' },
    ],
    founder: {
      '@type': 'Person',
      name: name,
      url: canonical,
    },
    serviceType: [
      'Best Shopify Developer Services',
      'Custom Shopify Store Development',
      'Shopify Liquid Theme Development',
      'E-Commerce Website Build',
      'Ecommerce Store Redesign & Optimization',
      'Full Stack Web Development (Next.js, React, Node.js)',
      'New Website Build & Architecture',
      'Core Web Vitals & Google PageSpeed 95+ Optimization',
      'Headless E-Commerce & Custom API Integration',
      'MERN Stack Application Development',
      ...(services.map(s => s.title)),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web & Shopify Development Services',
      itemListElement: services.map((s, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.description,
        },
        position: idx + 1,
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewBody: t.reviewText,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: (t.rating || 5).toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  // 3. WebSite & SiteNavigationElement Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonical}/#website`,
    name: 'Refayet Hossen | Best Shopify Developer & Full Stack Web Engineer',
    alternateName: [
      'Rifayet Hossen Portfolio',
      'Refayet Hossen Shopify Expert',
      'Md. Refayet Hossen Web Architecture',
    ],
    url: canonical,
    publisher: {
      '@type': 'Person',
      name: name,
      url: canonical,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${canonical}/#projects?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    hasPart: [
      {
        '@type': 'SiteNavigationElement',
        name: 'Projects Showcase',
        url: `${canonical}/#projects`,
        description: 'Explore featured web applications, Shopify stores, and digital solutions created by Refayet Hossen.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Services',
        url: `${canonical}/#services`,
        description: 'Shopify development, full stack engineering, and bespoke e-commerce web builds.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Experience & Companies',
        url: `${canonical}/#experience`,
        description: 'Professional software engineering experience, companies, and roles.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Skills & Tech Stack',
        url: `${canonical}/#skills`,
        description: 'Next.js, Shopify Liquid, React, Node.js, TypeScript, MongoDB, and UI/UX engineering.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Client Testimonials',
        url: `${canonical}/#testimonials`,
        description: 'Verified reviews and ratings from clients worldwide.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Blog & Articles',
        url: `${canonical}/#blogs`,
        description: 'Technical articles, design tutorials, and web development insights by Refayet Hossen.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Frequently Asked Questions',
        url: `${canonical}/#faq`,
        description: 'Direct answers regarding hiring Refayet Hossen, timelines, pricing, and capabilities.',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Contact Refayet Hossen',
        url: `${canonical}/#contact`,
        description: 'Initiate collaboration, hire for freelance projects, or request a quote.',
      },
    ],
  };

  // 4. Projects Schema (CreativeWork / SoftwareApplication ItemList)
  // Ensures searching any project name on Google links Refayet Hossen's portfolio
  const projectsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonical}/#projects-list`,
    name: 'Selected Projects & Web Applications by Refayet Hossen',
    description: 'A curated showcase of high-performance web applications, Shopify stores, and e-commerce platforms engineered by Refayet Hossen.',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}/#project-${p._id || idx}`,
        name: p.title,
        alternateName: `${p.title} by Refayet Hossen`,
        description: p.description + (p.richText ? ` ${p.richText}` : ''),
        applicationCategory: p.category || 'WebApplication',
        operatingSystem: 'Web, Cloud, Cross-Platform',
        creator: {
          '@type': 'Person',
          name: name,
          url: canonical,
        },
        author: {
          '@type': 'Person',
          name: name,
          url: canonical,
        },
        url: p.liveLink || `${canonical}/#projects`,
        keywords: [
          p.title,
          `${p.title} Web Application`,
          `${p.title} Refayet Hossen`,
          ...(p.techStack || []),
        ].join(', '),
      },
    })),
  };

  // 5. Work Experience Schema (Organizations & Roles ItemList)
  // Ensures searching any company or experience name on Google links to Refayet Hossen
  const experienceItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonical}/#experience-list`,
    name: 'Professional Engineering Experience & Companies of Refayet Hossen',
    description: 'Work history, past roles, client companies, and engineering achievements of Refayet Hossen.',
    numberOfItems: experiences.length,
    itemListElement: experiences.map((exp, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'OrganizationRole',
        roleName: exp.role,
        startDate: exp.duration,
        description: exp.description + (exp.responsibilities ? ` Responsibilities: ${exp.responsibilities.replace(/\n/g, ' ')}` : ''),
        worksFor: {
          '@type': 'Organization',
          name: exp.company,
          location: exp.location,
        },
        namedPosition: `${exp.role} at ${exp.company}`,
        skills: exp.techStack?.join(', '),
      },
    })),
  };

  // 6. Blog Articles Schema (BlogPosting ItemList)
  // Ensures Google Indexes all blog posts and articles with rich snippet cards
  const blogItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonical}/#blog-list`,
    name: 'Tech Articles & Tutorials by Refayet Hossen',
    description: 'In-depth engineering articles, Next.js optimization guides, Shopify Liquid strategies, and UI/UX tutorials.',
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'BlogPosting',
        '@id': `${canonical}/#blog-${blog.slug || idx}`,
        headline: blog.title,
        description: blog.excerpt,
        articleBody: blog.content ? blog.content.slice(0, 1000) : blog.excerpt,
        author: {
          '@type': 'Person',
          name: name,
          url: canonical,
        },
        publisher: {
          '@type': 'Person',
          name: name,
          url: canonical,
        },
        datePublished: blog.createdAt || '2026-01-01T00:00:00.000Z',
        dateModified: blog.createdAt || '2026-01-01T00:00:00.000Z',
        mainEntityOfPage: `${canonical}/#blogs`,
        keywords: [
          blog.title,
          ...(blog.tags || []),
          'Refayet Hossen Blog',
          'Shopify Tutorial',
          'Next.js 16 Guide',
        ].join(', '),
      },
    })),
  };

  // 7. FAQPage Schema for Search Result Accordions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonical}/#faqpage`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is Refayet Hossen (Rifayet Hossen) and why hire him as your Shopify developer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Refayet Hossen (also searched as Rifayet Hossen) is a premier Shopify Developer and Full Stack Web Engineer. He specializes in building bespoke, high-converting Shopify stores, custom Liquid themes, headless e-commerce architectures, and high-performance web applications that load under 1 second and rank top on Google.',
        },
      },
      {
        '@type': 'Question',
        name: 'What e-commerce website and web development services does Refayet Hossen offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Refayet Hossen offers comprehensive end-to-end development services including: Custom Shopify Store Builds, Theme Customization & Liquid Code, Full Stack Web Apps (Next.js, React, Node.js, Express, MongoDB), New Website Builds from scratch, E-commerce SEO and Core Web Vitals optimization, and 24/7 technical support.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Refayet Hossen approach a new website build or e-commerce store project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every project follows a proven 4-stage process: 1. Discovery (understanding your brand, audience, and revenue goals), 2. Strategic Planning & Architecture, 3. Pixel-Perfect Engineering with clean modern code, and 4. Delivery with comprehensive speed optimization, SEO configuration, and testing.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can Refayet Hossen optimize an existing Shopify store or website for faster speed and better Google SEO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Refayet Hossen specializes in Core Web Vitals optimization, reducing store load times to under 1.5 seconds, eliminating script bloat, implementing structured data schemas, and optimizing on-page SEO to dramatically boost Google rankings and customer conversion rates.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I get in touch or hire Refayet Hossen for my project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can initiate collaboration instantly through the website contact form, send an email to ${email}, or message directly via WhatsApp. Turnaround time for inquiries is usually under 1 hour.`,
        },
      },
    ],
  };

  // 8. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonical}/#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: canonical,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shopify & Web Development Services',
        item: `${canonical}/#services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Projects Showcase',
        item: `${canonical}/#projects`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Experience & Companies',
        item: `${canonical}/#experience`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Engineering Blog',
        item: `${canonical}/#blogs`,
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Contact & Hire',
        item: `${canonical}/#contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {projects.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsItemListSchema) }}
        />
      )}
      {experiences.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceItemListSchema) }}
        />
      )}
      {blogs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

import React from 'react';
import { ISetting } from '../sections/shared/types';

interface JsonLdProps {
  siteSettings: ISetting | null;
  siteUrl?: string;
}

export default function JsonLd({ siteSettings, siteUrl = 'https://rifat-portfolio-brown.vercel.app' }: JsonLdProps) {
  const canonical = (siteSettings?.canonicalUrl || siteUrl).replace(/\/$/, '');
  const name = siteSettings?.aboutName || 'Refayet Hossen';
  const email = siteSettings?.email || 'mdrifayethossen@gmail.com';

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonical}/#profilepage`,
    url: canonical,
    name: 'Refayet Hossen (Rifayet Hossen) | Best Shopify Developer & Full Stack Web Developer',
    mainEntity: {
      '@type': 'Person',
      '@id': `${canonical}/#person`,
      name: name,
      alternateName: ['Rifayet Hossen', 'Md. Refayet Hossen', 'Md Rifayet Hossen', 'Rifat', 'Best Shopify Developer'],
      jobTitle: ['Shopify Developer', 'Full Stack Web Developer', 'Software Engineer', 'E-Commerce Specialist', 'Frontend Developer', 'Backend Developer'],
      description: siteSettings?.seoDescription || 'Refayet Hossen (also known as Rifayet Hossen) is a premier Shopify Developer, Full Stack Web Developer, and E-commerce Specialist building high-converting Shopify stores, custom e-commerce websites, and modern web applications.',
      url: canonical,
      image: `${canonical}/icon.png`,
      email: email,
      telephone: siteSettings?.phone || undefined,
      sameAs: [
        siteSettings?.github || 'https://github.com/rifat3790',
        siteSettings?.linkedin || 'https://linkedin.com/in/rifat',
        siteSettings?.whatsapp ? `https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}` : undefined,
      ].filter(Boolean),
      knowsAbout: [
        'Shopify Development',
        'Shopify Theme Customization',
        'Shopify Liquid',
        'E-Commerce Website Build',
        'Ecommerce Store Development',
        'Full Stack Web Development',
        'Next.js 16',
        'React',
        'Node.js',
        'TypeScript',
        'MongoDB',
        'Tailwind CSS',
        'Headless Commerce',
        'Core Web Vitals Optimization',
        'Search Engine Optimization (SEO)',
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance & Bespoke Digital Architecture',
      },
    },
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${canonical}/#service`,
    name: 'Refayet Hossen - Shopify & Full Stack Web Development Services',
    alternateName: 'Rifayet Hossen E-Commerce & Web Solutions',
    url: canonical,
    logo: `${canonical}/icon.png`,
    image: `${canonical}/services_laptop_display.png`,
    description: 'Expert Shopify development, bespoke e-commerce store creation, full stack web applications, and new website builds engineered for ultra-fast performance and top Google rankings.',
    priceRange: '$$',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    founder: {
      '@type': 'Person',
      name: name,
    },
    serviceType: [
      'Best Shopify Developer Services',
      'Custom Shopify Store Development',
      'E-Commerce Website Build',
      'Ecommerce Store Redesign & Optimization',
      'Full Stack Web Development (Next.js, React, Node.js)',
      'New Website Build & Architecture',
      'Shopify Theme Customization & Liquid Coding',
      'Speed Optimization & Core Web Vitals (A+ Grade)',
      'Headless E-Commerce & Custom API Integration',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '38',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonical}/#website`,
    name: 'Refayet Hossen | Best Shopify Developer & Full Stack Web Engineer',
    alternateName: 'Rifayet Hossen Portfolio & E-Commerce Hub',
    url: canonical,
    publisher: {
      '@type': 'Person',
      name: name,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
        name: 'What e-commerce website and web development services are offered?',
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
          text: 'You can initiate collaboration instantly through the website contact form, send an email to mdrifayethossen@gmail.com, or message directly via WhatsApp. Turnaround time for inquiries is usually under 1 hour.',
        },
      },
    ],
  };

  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

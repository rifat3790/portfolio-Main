import { MetadataRoute } from 'next';
import { getHomepageData } from '@/lib/data-cache';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let siteUrl = defaultUrl;
  let projects: any[] = [];
  let blogs: any[] = [];

  try {
    const data = await getHomepageData();
    if (data.settings?.canonicalUrl) {
      siteUrl = data.settings.canonicalUrl.replace(/\/$/, '');
    }
    projects = data.projects || [];
    blogs = data.blogs || [];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  const currentDate = new Date();

  // Root Homepage & Section Anchors
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      images: [
        `${siteUrl}/refayet-profile.png`,
        `${siteUrl}/services_laptop_display.png`,
        `${siteUrl}/blog_cup_graphic.png`,
        `${siteUrl}/icon.png`,
      ],
    },
    {
      url: `${siteUrl}/#projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/#experience`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/#skills`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/#blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/#testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/#faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];

  // Dynamically include every published Blog article in XML Sitemap
  blogs.forEach((blog) => {
    if (blog.published !== false) {
      sitemapEntries.push({
        url: `${siteUrl}/#blogs?article=${encodeURIComponent(blog.slug || blog._id)}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : (blog.createdAt ? new Date(blog.createdAt) : currentDate),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  });

  // Dynamically include every Project in XML Sitemap
  projects.forEach((proj) => {
    sitemapEntries.push({
      url: `${siteUrl}/#projects?view=${encodeURIComponent(proj._id || proj.title)}`,
      lastModified: proj.updatedAt ? new Date(proj.updatedAt) : currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  return sitemapEntries;
}

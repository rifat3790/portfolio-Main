import { MetadataRoute } from 'next';
import { getHomepageData } from '@/lib/data-cache';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let siteUrl = defaultUrl;
  let blogs = [];
  let projects = [];

  try {
    const data = await getHomepageData();
    if (data.settings?.canonicalUrl) {
      siteUrl = data.settings.canonicalUrl.replace(/\/$/, '');
    }
    blogs = data.blogs || [];
    projects = data.projects || [];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  const currentDate = new Date();

  // Core Landing Page
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Blog dynamic entries (if blogs exist)
  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((blog: any) => blog.published !== false && blog.slug)
    .map((blog: any) => ({
      url: `${siteUrl}/#blogs`,
      lastModified: blog.createdAt ? new Date(blog.createdAt) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...blogRoutes];
}

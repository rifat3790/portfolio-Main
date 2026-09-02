import { MetadataRoute } from 'next';
import { getHomepageData } from '@/lib/data-cache';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let siteUrl = defaultUrl;

  try {
    const data = await getHomepageData();
    if (data.settings?.canonicalUrl) {
      siteUrl = data.settings.canonicalUrl.replace(/\/$/, '');
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  const currentDate = new Date();

  return [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}

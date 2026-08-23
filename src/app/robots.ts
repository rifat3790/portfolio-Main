import { MetadataRoute } from 'next';
import { getSettingsOnly } from '@/lib/data-cache';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let siteUrl = defaultUrl;

  try {
    const settings = await getSettingsOnly();
    if (settings?.canonicalUrl) {
      siteUrl = settings.canonicalUrl.replace(/\/$/, '');
    }
  } catch (err) {
    console.error('Error fetching settings for robots.ts:', err);
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin/*',
          '/api/cron/*',
          '/api/auth/*',
          '/wallet',
          '/wallet/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin/*',
          '/api/cron/*',
          '/api/auth/*',
          '/wallet',
          '/wallet/*',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

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

  const disallowed = [
    '/admin',
    '/admin/*',
    '/api/admin/*',
    '/api/cron/*',
    '/api/auth/*',
    '/wallet',
    '/wallet/*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowed,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

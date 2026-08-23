import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Syne, Satisfy } from 'next/font/google';
import './globals.css';
import { getSettingsOnly } from '@/lib/data-cache';
import JsonLd from './components/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const satisfy = Satisfy({
  subsets: ['latin'],
  variable: '--font-cursive',
  weight: '400',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#07080f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let title = 'Refayet Hossen (Rifayet Hossen) | Best Shopify Developer & Full Stack Web Developer';
  let description = 'Refayet Hossen (also known as Rifayet Hossen) is a premier Shopify Developer, Full Stack Web Developer, and E-commerce Specialist building high-converting Shopify stores, custom e-commerce websites, and new website builds with Next.js, React, Node.js, and Shopify Liquid.';
  let keywords = 'Rifayet Hossen, Refayet Hossen, Best shopify developer, Shopify developer, Shopify expert, Web developer, Full stack developer, e-commerce website, ecommerce website, e-commerce store, ecommerce store, New website build, developer, engineer, Shopify liquid developer, Next.js developer, React developer, MERN stack developer, Custom web application';
  let favicon = '/favicon.ico';
  let siteUrl = defaultUrl;
  let googleVerification = '';

  try {
    const settings = await getSettingsOnly();
    if (settings) {
      if (settings.seoTitle) {
        title = settings.seoTitle;
      } else if (settings.logoText && settings.heroTitle) {
        title = `${settings.heroTitle} | Best Shopify & Full Stack Web Developer`;
      }

      if (settings.seoDescription) {
        description = settings.seoDescription;
      } else if (settings.heroSubtitle) {
        description = `${settings.heroSubtitle} Expert Shopify Developer and Full Stack Web Engineer specializing in high-performance e-commerce stores and custom websites.`;
      }

      if (settings.seoKeywords) {
        keywords = settings.seoKeywords;
      }

      if (settings.favicon) {
        favicon = settings.favicon;
      }

      if (settings.canonicalUrl) {
        siteUrl = settings.canonicalUrl;
      }

      if (settings.googleSiteVerification) {
        googleVerification = settings.googleSiteVerification;
      }
    }
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
  }

  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  return {
    metadataBase: new URL(cleanSiteUrl),
    title: {
      default: title,
      template: '%s | Refayet Hossen',
    },
    description,
    keywords: keywords.split(',').map((k) => k.trim()),
    authors: [
      { name: 'Refayet Hossen (Rifayet Hossen)', url: cleanSiteUrl },
    ],
    creator: 'Refayet Hossen',
    publisher: 'Refayet Hossen',
    alternates: {
      canonical: cleanSiteUrl,
    },
    icons: {
      icon: [
        { url: favicon, sizes: 'any' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: cleanSiteUrl,
      title,
      description,
      siteName: 'Refayet Hossen | Best Shopify Developer & Full Stack Web Engineer',
      images: [
        {
          url: '/services_laptop_display.png',
          width: 1200,
          height: 630,
          alt: 'Refayet Hossen (Rifayet Hossen) - Best Shopify Developer & Full Stack Web Developer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@rifat',
      images: ['/services_laptop_display.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: [
        'SS7ibWZJLzqWLymSqKjIvm_BLRj6aJ_dv9FNqugK-P4',
        'JnoN5vpptN87OgIZvo0pMIZdXebRaXO8rtE1a4wguic',
        ...(googleVerification ? [googleVerification] : []),
      ],
    },
    category: 'technology',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await getSettingsOnly();
  } catch (err) {
    console.error('Error fetching settings for RootLayout:', err);
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${syne.variable} ${satisfy.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="SS7ibWZJLzqWLymSqKjIvm_BLRj6aJ_dv9FNqugK-P4" />
        <meta name="google-site-verification" content="JnoN5vpptN87OgIZvo0pMIZdXebRaXO8rtE1a4wguic" />
        <JsonLd siteSettings={settings} siteUrl="https://rifat-portfolio-brown.vercel.app" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


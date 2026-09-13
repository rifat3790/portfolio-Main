import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Syne, Satisfy } from 'next/font/google';
import './globals.css';
import { getSettingsOnly } from '@/lib/data-cache';

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

const DEFAULT_SEO_KEYWORDS = [
  'Refayet Hossen',
  'Rifayet Hossen',
  'Md. Refayet Hossen',
  'Md Rifayet Hossen',
  'Refayet',
  'Rifayet',
  'Rifat',
  'rifat3790',
  'Refayet Hossen Portfolio',
  'Rifayet Hossen Portfolio',
  'Best shopify developer',
  'Shopify developer',
  'Shopify expert',
  'Shopify liquid developer',
  'Shopify theme developer',
  'Shopify theme customization',
  'Shopify app developer',
  'Shopify speed optimization',
  'Shopify CRO specialist',
  'Hire Shopify developer',
  'Freelance Shopify developer',
  'Web developer',
  'Full stack developer',
  'Full stack web developer',
  'Next.js developer',
  'Next.js 16 developer',
  'React developer',
  'React 19 developer',
  'Node.js developer',
  'MERN stack developer',
  'TypeScript developer',
  'Frontend developer',
  'Backend developer',
  'Software engineer',
  'e-commerce website',
  'ecommerce website',
  'e-commerce store',
  'ecommerce store',
  'New website build',
  'Custom web application',
  'Headless Shopify developer',
  'Headless commerce',
  'Shopify developer Bangladesh',
  'Web developer Bangladesh',
  'Best web developer Bangladesh',
  'Remote Shopify developer',
  'Hire full stack developer',
  'Aetheria Estates',
  'Chronos Horology',
];

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = 'https://rifat-portfolio-brown.vercel.app';
  let title = 'Refayet Hossen (Rifayet Hossen) | Best Shopify Developer & Full Stack Web Developer';
  let description = 'Refayet Hossen (also known as Rifayet Hossen) is a premier Shopify Developer, Full Stack Web Developer, and E-commerce Specialist building high-converting Shopify stores, custom e-commerce websites, and new website builds with Next.js, React, Node.js, and Shopify Liquid.';
  let keywordsList = DEFAULT_SEO_KEYWORDS;
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
        const customKeywords = String(settings.seoKeywords).split(',').map((k: string) => k.trim()).filter(Boolean);
        keywordsList = Array.from(new Set([...customKeywords, ...DEFAULT_SEO_KEYWORDS]));
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
      template: '%s | Refayet Hossen (Rifayet Hossen)',
    },
    description,
    keywords: keywordsList,
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
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'profile',
      locale: 'en_US',
      url: cleanSiteUrl,
      title,
      description,
      siteName: 'Refayet Hossen | Best Shopify Developer & Full Stack Web Engineer',
      images: [
        {
          url: '/refayet-profile.png',
          width: 1200,
          height: 1200,
          alt: 'Refayet Hossen (Rifayet Hossen) - Best Shopify Developer & Full Stack Web Developer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@rifat3790',
      images: ['/refayet-profile.png'],
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
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${syne.variable} ${satisfy.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="SS7ibWZJLzqWLymSqKjIvm_BLRj6aJ_dv9FNqugK-P4" />
        <meta name="google-site-verification" content="JnoN5vpptN87OgIZvo0pMIZdXebRaXO8rtE1a4wguic" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Playfair_Display, Syne } from 'next/font/google';
import './globals.css';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

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

export async function generateMetadata(): Promise<Metadata> {
  let title = 'Aura | Luxury Digital Showcase & Development';
  let description = 'Premium personal portfolio site. Crafting lightning-fast digital solutions with premium aesthetics.';
  let favicon = '/favicon.ico';

  try {
    await dbConnect();
    const settings = await Setting.findOne();
    if (settings) {
      if (settings.logoText && settings.heroTitle) {
        title = `${settings.logoText} | ${settings.heroTitle}`;
      }
      if (settings.heroSubtitle) {
        description = settings.heroSubtitle;
      }
      if (settings.favicon) {
        favicon = settings.favicon;
      }
    }
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
  }

  return {
    title,
    description,
    icons: {
      icon: favicon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${syne.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

import { Metadata, Viewport } from 'next';
import WalletMobileClient from './WalletMobileClient';

export const metadata: Metadata = {
  title: 'Personal Wallet Android App | Executive Financial Suite',
  description: 'Standalone Mobile Android Application for Personal Finance, Net Worth, Wealth Vault, Daily Burn Rate & AI Advisor.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Personal Wallet',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function WalletMobilePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc' }}>
      <WalletMobileClient />
    </main>
  );
}

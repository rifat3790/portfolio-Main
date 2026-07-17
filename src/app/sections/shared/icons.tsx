'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette, Smartphone, Layers, Cpu, Database, Shield, Code, Globe,
  ShoppingBag, Gauge, TrendingUp
} from 'lucide-react';

// --- SVG Icon Components ---

export const ReactIcon = () => (
  <svg viewBox="0 0 100 100" width="28" height="28" fill="none" stroke="#60a5fa" strokeWidth="4">
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(30 50 50)" />
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(90 50 50)" />
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(150 50 50)" />
    <circle cx="50" cy="50" r="6" fill="#60a5fa" />
  </svg>
);

export const JSIcon = () => (
  <div style={{ background: '#facc15', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontFamily: 'var(--font-display)' }}>
    JS
  </div>
);

export const NodeIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export const MongoIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#10b981">
    <path d="M12 2C11.5 2 7 8.5 7 12c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-4.5-10-5-10zm0 13c-1.7 0-3-1.3-3-3 0-1.5 1.5-4.5 3-7.2 1.5 2.7 3 5.7 3 7.2 0 1.7-1.3 3-3 3z" />
  </svg>
);

export const NextIcon = () => (
  <svg viewBox="0 0 180 180" width="28" height="28" fill="#ffffff">
    <circle cx="90" cy="90" r="90" fill="#000000" />
    <path d="M140 135.5L80.5 58h-11.5v63.5h10.5V74l53.5 69.5c2.5-2.5 5-5.5 7.5-8zM120 58h-10.5v63.5H120V58z" />
  </svg>
);

export const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// --- Helper Functions ---

export const renderServiceIcon = (iconName: string) => {
  const lower = (iconName || '').toLowerCase();
  if (lower === 'palette' || lower === 'design' || lower === 'ui/ux design') return <Palette size={24} />;
  if (lower === 'smartphone' || lower === 'mobile') return <Smartphone size={24} />;
  if (lower === 'globe' || lower === 'web' || lower === 'api integration') return <Layers size={24} />;
  if (lower === 'cpu' || lower === 'backend') return <Cpu size={24} />;
  if (lower === 'database' || lower === 'storage') return <Database size={24} />;
  if (lower === 'shield' || lower === 'security') return <Shield size={24} />;
  if (lower === 'layout' || lower === 'frontend' || lower === 'full stack development') return <Code size={24} />;
  if (lower === 'layers' || lower === 'architecture') return <Layers size={24} />;
  if (lower === 'shopify' || lower === 'shopify development' || lower === 'shoppingbag') return <ShoppingBag size={24} />;
  if (lower === 'gauge' || lower === 'performance' || lower === 'performance optimization') return <Gauge size={24} />;
  if (lower === 'trendingup' || lower === 'seo' || lower === 'seo optimization') return <TrendingUp size={24} />;
  return <Code size={24} />;
};

// --- TypewriterLoop Component ---

export const TypewriterLoop = ({ roles, delay = 80, deleteDelay = 40, pause = 2000 }: { roles: string[], delay?: number, deleteDelay?: number, pause?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const currentRole = roles[roleIndex] || '';
    if (!isDeleting && charIndex < currentRole.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + currentRole[charIndex]);
        setCharIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      }, deleteDelay);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentRole.length) {
      const timeout = setTimeout(() => { setIsDeleting(true); }, pause);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex(prev => (prev + 1) % roles.length);
    }
  }, [charIndex, isDeleting, roleIndex, roles, delay, deleteDelay, pause]);

  return (
    <span style={{ color: 'var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', paddingRight: '4px', animation: 'blink 0.75s step-end infinite' }}>
      {currentText}
    </span>
  );
};

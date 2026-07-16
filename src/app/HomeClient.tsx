'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Layers,
  Quote,
  X,
  Code,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  User,
  Star,
  ArrowRight,
  Menu,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  Palette,
  Smartphone,
  Globe,
  Cpu,
  Database,
  Shield,
  Layout,
  BookOpen,
  ExternalLink,
  MessageSquare,
  Lock,
  ShoppingBag,
  Gauge,
  TrendingUp,
  Rocket,
  Pencil
} from 'lucide-react';
import styles from './home.module.css';
import CustomCursor from './components/CustomCursor';
import BackgroundAnimation from './components/BackgroundAnimation';

const ChatWidget = dynamic(() => import('./components/ChatWidget'), { ssr: false });
const ProjectModal = dynamic(() => import('./components/ProjectModal'), { ssr: false });

const TypewriterLoop = ({ roles, delay = 80, deleteDelay = 40, pause = 2000 }: { roles: string[], delay?: number, deleteDelay?: number, pause?: number }) => {
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
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
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

interface IProject {
  _id: string;
  title: string;
  description: string;
  richText?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  order: number;
  category?: string;
  screenshots?: string[];
  role?: string;
  duration?: string;
  projectType?: string;
  keyFeatures?: string;
  isFeatured?: boolean;
}

interface ISkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
  order: number;
}

interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  reviewText: string;
  avatar?: string;
  rating: number;
  order: number;
}

interface IMessage {
  _id?: string;
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  image?: string;
  createdAt: string;
}

interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  readTime: string;
  published: boolean;
  order: number;
  createdAt: string;
}

interface IExperience {
  _id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  employmentType?: string;
  description: string;
  responsibilities?: string;
  techStack: string[];
  logo?: string;
  order: number;
  isCurrent: boolean;
}

interface IService {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

interface INavbarLink {
  label: string;
  url: string;
}

interface ISetting {
  logoText: string;
  logoImage?: string;
  heroBannerImage?: string;
  favicon?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtn1Text?: string;
  heroBtn1Url?: string;
  heroBtn2Text?: string;
  heroBtn2Url?: string;
  aboutHeading: string;
  aboutText: string;
  aboutTitle?: string;
  aboutImage?: string;
  aboutName?: string;
  aboutEmail?: string;
  aboutLocation?: string;
  aboutAvailability?: string;
  aboutCvText?: string;
  aboutCvUrl?: string;
  aboutCvFile?: string;
  aboutCvFileName?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
  footerText: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  navbarLinks: INavbarLink[];
  typewriterRoles?: string;
  projectsLayout?: string;
  skillsLayout?: string;
  testimonialsLayout?: string;
  blogsLayout?: string;
  servicesPerRow?: number;
  servicesAutoScroll?: boolean;
  projectsPerRow?: number;
  projectCategories?: string;
  heroTagline?: string;
  heroTitleCursive?: string;
  heroSpecializationText?: string;
  heroShowFreelanceBadge?: boolean;
  heroFreelanceText?: string;
}

const ReactIcon = () => (
  <svg viewBox="0 0 100 100" width="28" height="28" fill="none" stroke="#60a5fa" strokeWidth="4">
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(30 50 50)" />
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(90 50 50)" />
    <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(150 50 50)" />
    <circle cx="50" cy="50" r="6" fill="#60a5fa" />
  </svg>
);

const JSIcon = () => (
  <div style={{ background: '#facc15', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontFamily: 'var(--font-display)' }}>
    JS
  </div>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#10b981">
    <path d="M12 2C11.5 2 7 8.5 7 12c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-4.5-10-5-10zm0 13c-1.7 0-3-1.3-3-3 0-1.5 1.5-4.5 3-7.2 1.5 2.7 3 5.7 3 7.2 0 1.7-1.3 3-3 3z" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 180 180" width="28" height="28" fill="#ffffff">
    <circle cx="90" cy="90" r="90" fill="#000000" />
    <path d="M140 135.5L80.5 58h-11.5v63.5h10.5V74l53.5 69.5c2.5-2.5 5-5.5 7.5-8zM120 58h-10.5v63.5H120V58z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const renderServiceIcon = (iconName: string) => {
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

interface HomeClientProps {
  initialProjects: IProject[];
  initialSkills: ISkill[];
  initialTestimonials: ITestimonial[];
  initialBlogs: IBlog[];
  initialServices: IService[];
  initialExperiences: IExperience[];
  siteSettings: ISetting | null;
}

export default function HomeClient({
  initialProjects,
  initialSkills,
  initialTestimonials,
  initialBlogs,
  initialServices,
  initialExperiences,
  siteSettings
}: HomeClientProps) {
  const roles = siteSettings?.typewriterRoles
    ? siteSettings.typewriterRoles.split(',').map(r => r.trim())
    : ['Shopify Expert', 'Full Stack Developer', 'Next.js Architect'];

  const typewriterRolesFiltered = roles.filter(r => r.toLowerCase() !== 'refayet hossen' && r.toLowerCase() !== 'md. refayet hossen');

  const getHeroTitleLines = (titleText: string) => {
    const trimmed = (titleText || "Building Digital Experiences").trim();
    const words = trimmed.split(' ');
    if (words.length <= 2) {
      return { line1: words.join(' '), line2: '' };
    }
    const line1 = words.slice(0, 2).join(' ');
    const line2 = words.slice(2).join(' ');
    return { line1, line2 };
  };

  const renderHeroTitle = (titleText: string) => {
    const trimmed = titleText.trim();
    const words = trimmed.split(' ');
    if (words.length <= 1) {
      return <span className="gold-gradient-text">{trimmed}</span>;
    }
    const lastWord = words[words.length - 1];
    const restOfName = words.slice(0, words.length - 1).join(' ');
    return (
      <>
        <span>{restOfName} </span>
        <span className="gold-gradient-text" style={{ display: 'inline-block' }}>{lastWord}</span>
      </>
    );
  };

  // Navigation & UI States
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(initialExperiences[0] || null);

  const getFrontendSkills = () => initialSkills.filter(s => {
    const cat = (s.category || '').toLowerCase();
    return cat.includes('front') || cat === 'ui' || cat === 'client';
  });

  const getBackendSkills = () => initialSkills.filter(s => {
    const cat = (s.category || '').toLowerCase();
    return cat.includes('back') || cat.includes('db') || cat.includes('server') || cat === 'database';
  });

  const getToolsSkills = () => initialSkills.filter(s => {
    const cat = (s.category || '').toLowerCase();
    return cat.includes('tool') || cat.includes('platform') || cat.includes('design') || cat.includes('figma') || cat.includes('git') || cat === 'other' || cat.includes('other/tools') || cat.includes('tools/other');
  });

  const getCompetencySkills = () => initialSkills.filter(s => {
    const cat = (s.category || '').toLowerCase();
    return cat.includes('competenc') || cat.includes('core');
  });

  const getOtherSkills = () => initialSkills.filter(s => {
    const cat = (s.category || '').toLowerCase();
    return cat.includes('other tech') || cat === 'other-tech' || cat === 'badge' || cat === 'cloud' || cat === 'other' || cat === 'other technologies';
  });

  // Sync selectedExp when initialExperiences updates (useful after seeds)
  useEffect(() => {
    if (initialExperiences.length > 0) {
      setSelectedExp(initialExperiences[0]);
    }
  }, [initialExperiences]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Newsletter States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (res.status === 409) {
        setNewsletterStatus('already');
        setTimeout(() => setNewsletterStatus('idle'), 4500);
      } else if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 5000);
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus('idle'), 4500);
      }
    } catch (err) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 4500);
    }
  };

  // Carousel Constraint States (safe SSR)
  const [carouselLeftConstraint, setCarouselLeftConstraint] = useState(0);
  const [testLeftConstraint, setTestLeftConstraint] = useState(0);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCarouselLeftConstraint(-((initialProjects.length * 364) - window.innerWidth + 200));
      setTestLeftConstraint(-((initialTestimonials.length * 364) - window.innerWidth + 200));
    }
  }, [initialProjects.length, initialTestimonials.length]);

  // Dynamically update favicon
  useEffect(() => {
    if (siteSettings?.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.favicon;
    }
  }, [siteSettings?.favicon]);

  // Chat features moved to self-contained ChatWidget component

  // Group skills by category
  const skillCategories = ['Frontend', 'Backend', 'Design', 'Tools/Other'];
  const getSkillsByCategory = (category: string) => {
    return initialSkills
      .filter(s => s.category === category)
      .sort((a, b) => a.order - b.order);
  };


  // Simple markdown processor for blog rendering
  const [activeTocId, setActiveTocId] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [visibleProjectsLimit, setVisibleProjectsLimit] = useState(8);

  // Dynamically extract headings for table of contents
  const extractHeadings = (content: string) => {
    if (!content) return [];
    const lines = content.split('\n');
    const headings: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(##|###) (.*)$/);
      if (match) {
        const text = match[2].replace(/\*\*|\*/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({
          id,
          text,
          level: match[1].length
        });
      }
    });
    return headings;
  };

  const renderCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'all projects':
        return <Layout size={15} />;
      case 'web applications':
      case 'web app':
        return <Code size={15} />;
      case 'e-commerce':
      case 'shopify':
        return <Briefcase size={15} />;
      case 'dashboard':
        return <Cpu size={15} />;
      case 'landing page':
        return <BookOpen size={15} />;
      default:
        return <Layers size={15} />;
    }
  };

  // Simple markdown processor for blog rendering
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    
    // Pre-process headings to add IDs
    let processed = text
      .replace(/### (.*?)\n/g, (_, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<h3 id="${id}">${p1}</h3>\n`;
      })
      .replace(/## (.*?)\n/g, (_, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<h2 id="${id}">${p1}</h2>\n`;
      })
      .replace(/# (.*?)\n/g, (_, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<h1 id="${id}">${p1}</h1>\n`;
      });

    // Convert code blocks
    processed = processed
      .replace(/```typescript([\s\S]*?)```/g, '<pre><code class="language-typescript">$1</code></pre>')
      .replace(/```javascript([\s\S]*?)```/g, '<pre><code class="language-javascript">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert bold and inline code
    processed = processed
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert lists
    processed = processed
      .replace(/\* (.*?)\n/g, '<li>$1</li>\n')
      .replace(/- (.*?)\n/g, '<li>$1</li>\n');

    // Convert blockquotes and alerts
    processed = processed.replace(/^> (.*?)\n/gm, (_, p1) => {
      if (p1.includes('[!NOTE]') || p1.includes('[!TIP]')) {
        const cleaned = p1.replace(/\[!NOTE\]|\[!TIP\]/g, '').trim();
        return `<div class="blog-callout"><span class="blog-callout-icon">💡</span><div class="blog-callout-text">${cleaned}</div></div>\n`;
      }
      return `<blockquote>${p1}</blockquote>\n`;
    });

    // Split into paragraphs
    return processed
      .split('\n\n')
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div')) {
          return para;
        }
        return `<p>${para.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');
  };

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 3000);
      }
    } catch (err) {
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <CustomCursor />
      <BackgroundAnimation />
      <div className="luxury-grid" />

      {/* Decorative Glow Mesh Backgrounds */}
      <div className={styles.meshGlowContainer}>
        <div className={styles.glowBall1} />
        <div className={styles.glowBall2} />
      </div>

      <header className={styles.floatingNavbar}>
        <div className={styles.navPill}>
          <a href="#" className={styles.navBrand}>
            <div className={styles.navLogoBox}>
              <span>&lt;/&gt;</span>
            </div>
            <div className={styles.navBrandInfo}>
              <div className={styles.navBrandName}>{siteSettings?.logoText || 'RIFAT'}</div>
              <div className={styles.navBrandRole}>{siteSettings?.heroSpecializationText || 'Full Stack Developer'}</div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className={styles.navLinks}>
            {(siteSettings?.navbarLinks || []).map((link, idx) => (
              <a key={idx} href={link.url} className={styles.navLinkItem}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.navActions}>
            <button type="button" className={styles.themeToggleBtn} aria-label="Toggle Dark Mode">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <a href="#contact" className={styles.navCTAButton}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>Hire Me</span>
            </a>

            {/* Mobile Menu Toggle button */}
            <button type="button" onClick={() => setIsDrawerOpen(true)} className={styles.mobileMenuToggle} aria-label="Menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(6, 6, 8, 0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button 
              onClick={() => setIsDrawerOpen(false)}
              style={{ position: 'absolute', top: '40px', right: '5vw', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={40} />
            </button>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'center' }}>
              {(siteSettings?.navbarLinks || []).map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                  href="#contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (siteSettings?.navbarLinks?.length || 0) * 0.1 }}
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  Contact
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className={styles.heroPremium} style={{ 
        backgroundImage: siteSettings?.heroBannerImage ? `url(${siteSettings.heroBannerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {siteSettings?.heroBannerImage && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(3, 5, 12, 0.85)', zIndex: 1 }} />
        )}
        
        <div className={styles.heroPremiumContent} style={{ position: 'relative', zIndex: 10 }}>
          <div className={styles.heroPremiumGrid}>
            
            {/* Left Column: Text Content and Actions */}
            <motion.div 
              className={styles.heroPremiumLeft}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.heroPremiumTagline}>
                {siteSettings?.heroTagline || "HI, I'M REFAYET HOSSEN"} 
                <span style={{ display: 'inline-block', animation: 'wave 2.5s infinite', transformOrigin: '70% 70%' }}>👋</span>
              </div>
              
              <h1 className={styles.heroPremiumTitle}>
                {(() => {
                  const { line1, line2 } = getHeroTitleLines(siteSettings?.heroTitle || "Building Digital Experiences");
                  return (
                    <>
                      <div>{line1}</div>
                      {line2 && <div className={styles.heroPremiumGradientWord}>{line2}</div>}
                      <div className={styles.heroPremiumCursiveWord}>
                        {siteSettings?.heroTitleCursive || "That Make Impact"}
                      </div>
                    </>
                  );
                })()}
              </h1>

              <p className={styles.heroPremiumDesc}>
                {siteSettings?.heroSubtitle || "Full Stack Developer specializing in Shopify, Next.js & modern web technologies. I build scalable, high-performance websites and applications that bring ideas to life."}
              </p>

              <div className={styles.heroPremiumButtons}>
                <a href={siteSettings?.heroBtn1Url || '#projects'} className="btn-premium btn-premium-gold" style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '100px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', gap: 8 }}>
                  {siteSettings?.heroBtn1Text || 'View My Work'} <ArrowRight size={16} />
                </a>
                <a href={siteSettings?.heroBtn2Url || '#contact'} className="btn-premium btn-premium-outline" style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span>{siteSettings?.heroBtn2Text || "Let's Connect"}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', boxShadow: '0 0 10px #22c55e' }} />
                </a>
              </div>

              {/* Stats Row */}
              <div className={styles.heroPremiumStats}>
                {/* Stat 1 with Trophy card */}
                <div className={styles.heroPremiumStatItem} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                    flexShrink: 0
                  }}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: 'auto' }}>
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                      <path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.heroPremiumStatValue}>{siteSettings?.stat1Value || "4+"}</div>
                    <div className={styles.heroPremiumStatLabel}>{siteSettings?.stat1Label || "Years Experience"}</div>
                  </div>
                </div>
                
                {/* Stat 2 */}
                <div className={styles.heroPremiumStatItem}>
                  <div className={styles.heroPremiumStatValue}>{siteSettings?.stat2Value || "20+"}</div>
                  <div className={styles.heroPremiumStatLabel}>{siteSettings?.stat2Label || "Projects Completed"}</div>
                </div>

                {/* Stat 3 */}
                <div className={styles.heroPremiumStatItem}>
                  <div className={styles.heroPremiumStatValue}>{siteSettings?.stat3Value || "15+"}</div>
                  <div className={styles.heroPremiumStatLabel}>{siteSettings?.stat3Label || "Happy Clients"}</div>
                </div>

                {/* Stat 4 */}
                <div className={styles.heroPremiumStatItem}>
                  <div className={styles.heroPremiumStatValue}>{siteSettings?.stat4Value || "100%"}</div>
                  <div className={styles.heroPremiumStatLabel}>{siteSettings?.stat4Label || "Commitment"}</div>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Visual Showcase */}
            <motion.div 
              className={styles.heroPremiumVisual}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              {/* Radial Aura Glow Ring */}
              <div className={styles.heroPremiumGlowRing} style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 65%)' }} />
              
              {/* Curved neon background paths */}
              <svg 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} 
                viewBox="0 0 500 500" 
                fill="none"
              >
                <path 
                  d="M80 120 C 180 80, 420 180, 400 360 C 380 430, 220 400, 160 460" 
                  stroke="url(#neon-line-grad)" 
                  strokeWidth="1.5" 
                  strokeOpacity="0.4"
                />
                <defs>
                  <linearGradient id="neon-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating dot grids */}
              <svg width="112" height="48" style={{ position: 'absolute', top: '10%', left: '0%', opacity: 0.35, zIndex: 1 }} viewBox="0 0 112 48">
                {[...Array(6)].map((_, x) => 
                  [...Array(3)].map((_, y) => (
                    <circle key={`dots1-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
                  ))
                )}
              </svg>

              <svg width="64" height="112" style={{ position: 'absolute', bottom: '15%', left: '-5%', opacity: 0.35, zIndex: 1 }} viewBox="0 0 64 112">
                {[...Array(3)].map((_, x) => 
                  [...Array(6)].map((_, y) => (
                    <circle key={`dots2-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
                  ))
                )}
              </svg>

              <svg width="96" height="48" style={{ position: 'absolute', bottom: '35%', right: '-5%', opacity: 0.35, zIndex: 1 }} viewBox="0 0 96 48">
                {[...Array(5)].map((_, x) => 
                  [...Array(3)].map((_, y) => (
                    <circle key={`dots3-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
                  ))
                )}
              </svg>

              {/* Portrait Image Frame */}
              <div className={styles.heroPremiumPortraitFrame}>
                {siteSettings?.logoImage ? (
                  <img src={siteSettings.logoImage} alt="Portrait" className={styles.heroPremiumPortrait} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070b19', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <User size={80} color="#475569" />
                  </div>
                )}
              </div>

              {/* Floating Badge 1: Available for Freelance */}
              {siteSettings?.heroShowFreelanceBadge !== false && (
                <motion.div 
                  className={styles.heroPremiumFreelanceBadge}
                  whileHover={{ scale: 1.05 }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', position: 'relative', display: 'inline-block' }}>
                    <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'ping 1.5s infinite', opacity: 0.75 }} />
                  </span>
                  <span>{siteSettings?.heroFreelanceText || "Available for freelance"}</span>
                </motion.div>
              )}

              {/* Floating Badge 2: Code </> icon */}
              <motion.div 
                className={styles.heroPremiumCodeBadge}
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
              >
                <Code size={22} color="#60a5fa" />
              </motion.div>

              {/* Floating Badge 3: Specializations Details Box */}
              <motion.div 
                className={styles.heroPremiumSpecsCard}
                whileHover={{ scale: 1.05 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className={styles.heroPremiumSpecsContent}>
                  <div className={styles.heroPremiumSpecsTitle}>Specialized In</div>
                  <div className={styles.heroPremiumSpecsValue}>
                    {(siteSettings?.heroSpecializationText || "Shopify • Next.js • React\nNode.js • MongoDB").split('\n').map((line, idx) => (
                      <div key={`spec-line-${idx}`}>{line}</div>
                    ))}
                  </div>
                </div>
                <a href={siteSettings?.heroBtn1Url || '#projects'} className={styles.heroPremiumSpecsArrow} aria-label="View specifications" style={{ textDecoration: 'none' }}>
                  <ArrowRight size={16} style={{ transform: 'rotate(-45deg)' }} />
                </a>
              </motion.div>

            </motion.div>

          </div>

          {/* Logos Bar spanning full width under the grid */}
          <div className={styles.heroPremiumLogosBar}>
            <div className={styles.heroPremiumLogosTitle}>Trusted by businesses worldwide</div>
            <div className={styles.heroPremiumLogosContainer}>
              
              <div className={styles.heroPremiumLogoItem}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span>shopify</span>
              </div>

              <div className={styles.heroPremiumLogoItem}>
                <NextIcon />
                <span>NEXT.js</span>
              </div>

              <div className={styles.heroPremiumLogoItem}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <span>tailwindcss</span>
              </div>

              <div className={styles.heroPremiumLogoItem}>
                <MongoIcon />
                <span>mongoDB</span>
              </div>

              <div className={styles.heroPremiumLogoItem}>
                <ReactIcon />
                <span>React</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* About Biography Section */}
      <section id="about" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
        <div className={styles.sectionContent}>
          <div className={styles.aboutPremiumGrid}>
            
            {/* Left Side: Portrait & Graphic Badges */}
            <motion.div 
              className={styles.aboutPortraitWrapper}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4 }}
            >
              {/* Dot Pattern Background Graphic */}
              <div className={styles.aboutDotPattern}>
                <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                  <pattern id="dot-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="20" height="20" fill="url(#dot-pattern)" />
                </svg>
              </div>

              <div className={styles.aboutPortraitImage}>
                {siteSettings?.aboutImage ? (
                  <img src={siteSettings.aboutImage} alt="Biography portrait" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                    <User size={80} color="var(--text-muted)" />
                  </div>
                )}
              </div>

              {/* absolute overlay badge */}
              <div className={styles.aboutCupOverlay}>
                <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <span>&lt;/&gt;</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Copy & Info Cards */}
            <motion.div 
              className={styles.aboutRightColumn}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <span className={styles.aboutSubBadge}>
                {siteSettings?.aboutHeading || 'ABOUT ME'}
              </span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', marginBottom: '20px', letterSpacing: '-0.01em', lineHeight: 1.2, color: '#ffffff', fontWeight: 800 }}>
                {(() => {
                  const title = siteSettings?.aboutTitle || 'Crafting Digital Experiences That Drive Real Results.';
                  const splitIndex = title.indexOf('That');
                  if (splitIndex !== -1) {
                    const firstPart = title.substring(0, splitIndex);
                    const secondPart = title.substring(splitIndex);
                    return (
                      <>
                        {firstPart} <span className={styles.aboutGradientText} style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{secondPart}</span>
                      </>
                    );
                  }
                  return title;
                })()}
              </h2>
              
              <p style={{ fontSize: '0.98rem', color: '#94a3b8', lineHeight: '1.7', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: '24px' }}>
                {siteSettings?.aboutText || "I'm Md. Refayet Hossen, a Full Stack Developer with a passion for building modern, scalable, and user-centric web applications. I combine clean code with creative thinking to deliver solutions that not only look great but also solve real-world problems and create meaningful impact for businesses and users."}
              </p>

              {/* 3 columns feature list */}
              <div className={styles.aboutFeaturesList}>
                <div className={styles.aboutFeatureCard}>
                  <div className={styles.aboutFeatureIconBox}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  </div>
                  <h4 className={styles.aboutFeatureTitle}>Purpose-Driven</h4>
                  <p className={styles.aboutFeatureDesc}>I build with purpose, focused on solving real problems.</p>
                </div>

                <div className={styles.aboutFeatureCard}>
                  <div className={styles.aboutFeatureIconBox}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>
                  </div>
                  <h4 className={styles.aboutFeatureTitle}>Modern & Scalable</h4>
                  <p className={styles.aboutFeatureDesc}>I use the latest technologies to build fast, secure applications.</p>
                </div>

                <div className={styles.aboutFeatureCard}>
                  <div className={styles.aboutFeatureIconBox}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h4 className={styles.aboutFeatureTitle}>Collaborative</h4>
                  <p className={styles.aboutFeatureDesc}>I believe in clear communication and strong collaboration.</p>
                </div>
              </div>

              {/* Signature Row & Quote Box */}
              <div className={styles.aboutSignatureWrapper}>
                <div className={styles.aboutSignatureLeft}>
                  <div className={styles.aboutSignatureText}>{siteSettings?.aboutName || 'Refayet Hossen'}</div>
                  <div className={styles.aboutSignatureRole}>Full Stack Developer</div>
                </div>

                <div className={styles.aboutQuoteBlock}>
                  <Quote size={20} className={styles.aboutQuoteIcon} style={{ transform: 'rotate(180deg)', opacity: 0.6 }} />
                  <p className={styles.aboutQuoteText}>
                    My goal is to help businesses and individuals turn their ideas into powerful digital solutions that make a difference.
                  </p>
                </div>
              </div>

              {/* CV Download / Talk CTA button */}
              <a 
                href={siteSettings?.aboutCvFile ? siteSettings.aboutCvFile : (siteSettings?.aboutCvUrl || '#')} 
                download={siteSettings?.aboutCvFile ? (siteSettings.aboutCvFileName || 'Md_Refayet_Hossen_CV.pdf') : undefined}
                target="_blank" 
                rel="noreferrer" 
                className="btn-premium btn-premium-gold" 
                style={{ padding: '16px 36px', fontSize: '0.9rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {siteSettings?.aboutCvText || 'Download CV'} <ArrowRight size={16} />
              </a>
            </motion.div>

          </div>

          {/* Bottom Stats Container Row */}
          <div className={styles.aboutStatsRow}>
            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatIcon}>
                <Briefcase size={20} />
              </div>
              <div className={styles.aboutStatInfo}>
                <div className={styles.aboutStatVal}>{siteSettings?.stat1Value || '5+'}</div>
                <div className={styles.aboutStatLabel}>{siteSettings?.stat1Label || 'Years Experience'}</div>
              </div>
            </div>

            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className={styles.aboutStatInfo}>
                <div className={styles.aboutStatVal}>{siteSettings?.stat2Value || '50+'}</div>
                <div className={styles.aboutStatLabel}>{siteSettings?.stat2Label || 'Projects Completed'}</div>
              </div>
            </div>

            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
              <div className={styles.aboutStatInfo}>
                <div className={styles.aboutStatVal}>{siteSettings?.stat3Value || '20+'}</div>
                <div className={styles.aboutStatLabel}>{siteSettings?.stat3Label || 'Happy Clients'}</div>
              </div>
            </div>

            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <div className={styles.aboutStatInfo}>
                <div className={styles.aboutStatVal}>{siteSettings?.stat4Value || '100%'}</div>
                <div className={styles.aboutStatLabel}>{siteSettings?.stat4Label || 'Client Satisfaction'}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section Redesigned */}
      {initialServices && initialServices.length > 0 && (
        <section id="services" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden' }}>
          <div className={styles.sectionContent}>
            
            {/* Redesigned Services Intro Row */}
            <div className={styles.servicesIntroRow}>
              <motion.div 
                className={styles.servicesIntroLeft}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
              >
                <span className={styles.servicesIntroTag}>WHAT I DO</span>
                <h2 className={styles.servicesIntroTitle}>
                  Premium Digital Solutions Built for Your <span className="gold-gradient-text">Success</span>
                </h2>
                <p className={styles.servicesIntroDesc}>
                  I help businesses and individuals turn their ideas into powerful, scalable, and user-friendly digital products.
                </p>

                {/* Stats Counters */}
                <div className={styles.servicesStatsRow}>
                  <div className={styles.servicesStatCard}>
                    <div className={styles.servicesStatIcon}>
                      <Briefcase size={20} />
                    </div>
                    <span className={styles.servicesStatValue}>{siteSettings?.stat1Value || '5+'}</span>
                    <span className={styles.servicesStatLabel}>{siteSettings?.stat1Label || 'Years Experience'}</span>
                  </div>

                  <div className={styles.servicesStatCard}>
                    <div className={styles.servicesStatIcon}>
                      <CheckCircle2 size={20} />
                    </div>
                    <span className={styles.servicesStatValue}>{siteSettings?.stat2Value || '50+'}</span>
                    <span className={styles.servicesStatLabel}>{siteSettings?.stat2Label || 'Projects Completed'}</span>
                  </div>

                  <div className={styles.servicesStatCard}>
                    <div className={styles.servicesStatIcon}>
                      <Star size={20} />
                    </div>
                    <span className={styles.servicesStatValue}>{siteSettings?.stat4Value || '100%'}</span>
                    <span className={styles.servicesStatLabel}>{siteSettings?.stat4Label || 'Client Satisfaction'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Laptop & Orbiting Tech Icons */}
              <motion.div 
                className={styles.servicesIntroRight}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
              >
                {/* Outer Orbit Ring (420px) */}
                <div className={styles.orbitRing2}>
                  {/* Node 1: Next.js */}
                  <div className={styles.orbitIconNode} style={{ top: '20%', left: '10%' }} title="Next.js">
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>NEXT</span>
                  </div>
                  {/* Node 2: Shopify */}
                  <div className={styles.orbitIconNode} style={{ top: '20%', left: '90%' }} title="Shopify">
                    <ShoppingBag size={18} />
                  </div>
                  {/* Node 3: Database */}
                  <div className={styles.orbitIconNode} style={{ top: '90%', left: '50%' }} title="Database">
                    <Database size={18} />
                  </div>
                </div>

                {/* Inner Orbit Ring (300px) */}
                <div className={styles.orbitRing1}>
                  {/* Node 1: React */}
                  <div className={styles.orbitIconNode} style={{ top: '0%', left: '50%' }} title="React">
                    <svg viewBox="0 0 841.9 595.3" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="25">
                      <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(30, 420.95, 297.65)" />
                      <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(90, 420.95, 297.65)" />
                      <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(150, 420.95, 297.65)" />
                      <circle cx="420.95" cy="297.65" r="45" fill="currentColor" />
                    </svg>
                  </div>
                  {/* Node 2: JavaScript */}
                  <div className={styles.orbitIconNode} style={{ top: '75%', left: '10%' }} title="JavaScript">
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>JS</span>
                  </div>
                  {/* Node 3: Node.js */}
                  <div className={styles.orbitIconNode} style={{ top: '75%', left: '90%' }} title="Node.js">
                    <Cpu size={18} />
                  </div>
                </div>

                {/* Laptop image frame */}
                <div className={styles.servicesLaptopFrame}>
                  <img src="/services_laptop_display.png" alt="Laptop display" className={styles.servicesLaptopImg} />
                  <div className={styles.servicesLaptopPedestal} />
                </div>
              </motion.div>
            </div>

            {/* Redesigned Services list */}
            <div className={styles.servicesSectionMid}>
              <div className={styles.servicesMidHeader}>
                <span className={styles.servicesMidTag}>MY SERVICES</span>
                <h2 className={styles.servicesMidTitle}>What I Can Help You With</h2>
                <p className={styles.servicesMidDesc}>
                  I offer end-to-end development services to create modern, high-performance web applications tailored to your business needs.
                </p>
              </div>

              <div className={styles.servicesPremiumGridCol}>
                {initialServices.map((service, idx) => (
                  <motion.div 
                    key={service._id} 
                    className={styles.serviceCardHorizontal}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className={styles.serviceCardIconWrap}>
                      {renderServiceIcon(service.iconName)}
                    </div>
                    <div className={styles.serviceCardTextWrap}>
                      <h3 className={styles.serviceCardHorizontalTitle}>{service.title}</h3>
                      <p className={styles.serviceCardHorizontalDesc}>{service.description}</p>
                      <span className={styles.serviceCardLink}>
                        Learn More <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Process Timeline Flow */}
            <div className={styles.processSection}>
              <div className={styles.processHeader}>
                <span className={styles.processTag}>MY PROCESS</span>
                <h2 className={styles.processTitle}>How I Work</h2>
              </div>

              <div className={styles.processTimelineGrid}>
                <div className={styles.processLine} />
                
                <motion.div 
                  className={styles.processItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <div className={styles.processIconCard}>
                    <MessageSquare size={22} />
                  </div>
                  <span className={styles.processStepNum}>01</span>
                  <h3 className={styles.processItemTitle}>Discover</h3>
                  <p className={styles.processItemDesc}>Understanding your goals, requirements, and vision.</p>
                </motion.div>

                <motion.div 
                  className={styles.processItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className={styles.processIconCard}>
                    <Pencil size={22} />
                  </div>
                  <span className={styles.processStepNum}>02</span>
                  <h3 className={styles.processItemTitle}>Plan</h3>
                  <p className={styles.processItemDesc}>Planning the best strategy and solution for your project.</p>
                </motion.div>

                <motion.div 
                  className={styles.processItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <div className={styles.processIconCard}>
                    <Code size={22} />
                  </div>
                  <span className={styles.processStepNum}>03</span>
                  <h3 className={styles.processItemTitle}>Build</h3>
                  <p className={styles.processItemDesc}>Developing with clean, scalable, and efficient code.</p>
                </motion.div>

                <motion.div 
                  className={styles.processItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className={styles.processIconCard}>
                    <Rocket size={22} />
                  </div>
                  <span className={styles.processStepNum}>04</span>
                  <h3 className={styles.processItemTitle}>Deliver</h3>
                  <p className={styles.processItemDesc}>Testing, optimizing, and delivering a high-quality product.</p>
                </motion.div>
              </div>
            </div>

            {/* Banner Callout Section */}
            <div className={styles.servicesCTASection}>
              <div className={styles.servicesCTAText}>
                <span className={styles.servicesCTASub}>LET'S WORK TOGETHER</span>
                <h3 className={styles.servicesCTATitle}>Have a Project in Mind?</h3>
                <p className={styles.servicesCTADesc}>Let's build something amazing together.</p>
              </div>
              <div className={styles.servicesCTAActions}>
                <a href="#contact" className="btn-premium btn-premium-gold" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  Hire Me Now <Rocket size={14} />
                </a>
                <a href="#projects" className="btn-premium btn-premium-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  View My Work
                </a>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Projects Showcase */}
      <section id="projects" className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionContent}>
          
          {/* Header Grid */}
          <div className={styles.projectHeaderGrid}>
            <div className={styles.projectHeaderLeft}>
              <span className={styles.sectionTag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 8px #3b82f6' }} />
                My Work
              </span>
              <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', margin: '16px 0 24px', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 800 }}>
                Projects That<br/>
                <span style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167,139,250,0.15)' }}>Solve Problems</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '480px', marginBottom: '24px', fontWeight: 300 }}>
                Here are some of my selected projects. Each project is built with passion, clean code, and a focus on performance and usability.
              </p>
              {(() => {
                const cats = siteSettings?.projectCategories 
                  ? ['All Projects', ...siteSettings.projectCategories.split(',').map(c => c.trim())]
                  : ['All Projects', 'Web Applications', 'E-Commerce', 'Dashboard', 'Landing Page', 'Other'];
                const filtered = initialProjects.filter(p => {
                  if (selectedCategory === 'All Projects') return true;
                  return p.category?.toLowerCase() === selectedCategory.toLowerCase();
                });
                return filtered.length > visibleProjectsLimit && (
                  <button 
                    onClick={() => setVisibleProjectsLimit(filtered.length)}
                    className="btn-premium btn-premium-gold"
                    style={{ width: 'fit-content', padding: '12px 28px', fontSize: '0.85rem' }}
                  >
                    View All Projects <ArrowRight size={14} style={{ marginLeft: 8 }} />
                  </button>
                );
              })()}
            </div>

            <div className={styles.projectHeaderRight}>
              <div className={styles.projectStatsOverlay}>
                <div className={styles.projectStatItem}>
                  <span className={styles.projectStatValue}>{siteSettings?.stat2Value || '20+'}</span>
                  <span className={styles.projectStatLabel}>{siteSettings?.stat2Label || 'Projects Completed'}</span>
                </div>
                <div className={styles.projectStatItem}>
                  <span className={styles.projectStatValue}>{siteSettings?.stat3Value || '10+'}</span>
                  <span className={styles.projectStatLabel}>{siteSettings?.stat3Label || 'Technologies Used'}</span>
                </div>
                <div className={styles.projectStatItem}>
                  <span className={styles.projectStatValue}>{siteSettings?.stat1Value || '2+'}</span>
                  <span className={styles.projectStatLabel}>{siteSettings?.stat1Label || 'Years Experience'}</span>
                </div>
                <div className={styles.projectStatItem}>
                  <span className={styles.projectStatValue}>{siteSettings?.stat4Value || '100%'}</span>
                  <span className={styles.projectStatLabel}>{siteSettings?.stat4Label || 'Client Satisfaction'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className={styles.projectCategoryBar}>
            {(() => {
              const categories = siteSettings?.projectCategories 
                ? ['All Projects', ...siteSettings.projectCategories.split(',').map(c => c.trim())]
                : ['All Projects', 'Web Applications', 'E-Commerce', 'Dashboard', 'Landing Page', 'Other'];
              return categories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleProjectsLimit(8); // Reset limit on category switch
                    }}
                    className={`${styles.projectCategoryBtn} ${isActive ? styles.projectCategoryBtnActive : ''}`}
                  >
                    {renderCategoryIcon(cat)}
                    {cat}
                  </button>
                );
              });
            })()}
          </div>

          {/* Projects Grid */}
          {(() => {
            const filtered = initialProjects.filter(p => {
              if (selectedCategory === 'All Projects') return true;
              return p.category?.toLowerCase() === selectedCategory.toLowerCase();
            });
            const toDisplay = filtered.slice(0, visibleProjectsLimit);
            if (filtered.length === 0) {
              return (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
                  No projects found in this category. Check back shortly.
                </div>
              );
            }
            return (
              <>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${siteSettings?.projectsPerRow || 3}, 1fr)`,
                  }}
                  className={styles.projectsResponsiveGrid}
                >
                  {toDisplay.map((p, idx) => (
                    <motion.div
                      key={p._id}
                      className={styles.projectCardPremium}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.3, delay: (idx % 3) * 0.04 }}
                      onClick={() => setSelectedProject(p)}
                    >
                      <div className={styles.projectCardImageWrapper}>
                        <img src={p.image} alt={p.title} className={styles.projectCardImage} />
                        <div className={styles.projectCardIndex}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </div>
                      </div>

                      <div className={styles.projectCardContent}>
                        <h3 className={styles.projectCardTitle}>{p.title}</h3>
                        <p className={styles.projectCardDesc}>{p.description}</p>
                        
                        <div className={styles.projectCardFooter}>
                          <div className={styles.projectCardTags}>
                            {p.techStack.slice(0, 3).map((tech) => (
                              <span key={tech} className={styles.projectCardTag}>{tech}</span>
                            ))}
                          </div>
                          <div className={styles.projectCardCircleBtn}>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {filtered.length > visibleProjectsLimit && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button
                      onClick={() => setVisibleProjectsLimit(prev => prev + 8)}
                      className="btn-premium btn-premium-gold"
                      style={{ padding: '16px 36px', borderRadius: '100px' }}
                    >
                      Load More Projects
                    </button>
                  </div>
                )}
              </>
            );
          })()}

          {/* Bottom Collaboration Banner */}
          <div className={styles.projectBottomBanner}>
            <div className={styles.projectBottomLeft}>
              <div className={styles.projectBottomIcon}>
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className={styles.projectBottomTitle}>Have a project in mind?</h4>
                <p className={styles.projectBottomDesc}>Let's collaborate and turn your ideas into real solutions.</p>
              </div>
            </div>
            <a href="#contact" className="btn-premium btn-premium-gold" style={{ padding: '16px 36px', borderRadius: '100px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              Let's Work Together <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={styles.expSection}>
        <div className={styles.expContent}>
          <div className={styles.expHeader}>
            <span className={styles.expSubBadge}>
              <Briefcase size={14} style={{ marginRight: 6 }} /> MY JOURNEY
            </span>
            <h2 className={styles.expTitle}>
              <span className={styles.expGradientText}>Experience</span> That Shapes Me
            </h2>
            <p className={styles.expSubtitle}>
              A timeline of my professional journey, the companies I've worked with, and the impact I've created.
            </p>
          </div>

          {/* Stats cards grid */}
          <div className={styles.expStatsRow}>
            <div className={styles.expStatCard}>
              <div className={`${styles.expStatIconBox} ${styles.expStatIconBlue}`}>
                <Briefcase size={22} />
              </div>
              <div>
                <div className={styles.expStatVal}>{siteSettings?.stat1Value || "4+"}</div>
                <div className={styles.expStatLabel}>{siteSettings?.stat1Label || "Years Experience"}</div>
              </div>
            </div>

            <div className={styles.expStatCard}>
              <div className={`${styles.expStatIconBox} ${styles.expStatIconPurple}`}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                  <line x1="9" y1="22" x2="9" y2="16"/>
                  <line x1="9" y1="16" x2="15" y2="16"/>
                  <line x1="15" y1="16" x2="15" y2="22"/>
                  <line x1="9" y1="6" x2="15" y2="6"/>
                  <line x1="9" y1="10" x2="15" y2="10"/>
                </svg>
              </div>
              <div>
                <div className={styles.expStatVal}>{siteSettings?.stat2Value || "6+"}</div>
                <div className={styles.expStatLabel}>{siteSettings?.stat2Label || "Companies Worked"}</div>
              </div>
            </div>

            <div className={styles.expStatCard}>
              <div className={`${styles.expStatIconBox} ${styles.expStatIconBlue}`}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                </svg>
              </div>
              <div>
                <div className={styles.expStatVal}>{siteSettings?.stat3Value || "20+"}</div>
                <div className={styles.expStatLabel}>{siteSettings?.stat3Label || "Projects Completed"}</div>
              </div>
            </div>

            <div className={styles.expStatCard}>
              <div className={`${styles.expStatIconBox} ${styles.expStatIconPurple}`}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className={styles.expStatVal}>{siteSettings?.stat4Value || "100%"}</div>
                <div className={styles.expStatLabel}>{siteSettings?.stat4Label || "Client Satisfaction"}</div>
              </div>
            </div>
          </div>

          {/* Interactive grid */}
          {initialExperiences.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.06)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No experiences registered. Add them in the admin dashboard panel.</p>
            </div>
          ) : (
            <div className={styles.expGrid}>
              
              {/* Left Timeline Column */}
              <div className={styles.expTimelineCol}>
                <div className={styles.expTimelineLine} />
                {initialExperiences.map((item) => {
                  const isActive = selectedExp?._id === item._id;
                  return (
                    <div 
                      key={item._id} 
                      className={`${styles.expTimelineItem} ${isActive ? styles.expTimelineItemActive : ''}`}
                      onClick={() => setSelectedExp(item)}
                    >
                      <div className={styles.expTimelineNode} />
                      <div className={`${styles.expCard} ${isActive ? styles.expCardActive : ''}`}>
                        <div className={styles.expCardLogoBox}>
                          {item.logo ? (
                            <img src={item.logo} alt={item.company} className={styles.expCardLogoImg} />
                          ) : (
                            <div className={styles.expCardLogoPlaceholder}>
                              {item.company.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className={styles.expCardContent}>
                          <div className={styles.expCardHeaderRow}>
                            <h4 className={styles.expCardCompany}>{item.company}</h4>
                            {item.isCurrent && <span className={styles.expCurrentPill}>Current</span>}
                          </div>
                          <div className={styles.expCardRole}>{item.role}</div>
                          <div className={styles.expCardMeta}>{item.duration}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Detail Column */}
              <div className={styles.expDetailCol}>
                {selectedExp ? (
                  <>
                    <div className={styles.expDetailHeader}>
                      <div className={styles.expDetailLogoBox}>
                        {selectedExp.logo ? (
                          <img src={selectedExp.logo} alt={selectedExp.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className={styles.expCardLogoPlaceholder} style={{ fontSize: '1.8rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedExp.company.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className={styles.expDetailInfo}>
                        <h3 className={styles.expDetailCompany}>{selectedExp.company}</h3>
                        <div className={styles.expDetailRole}>{selectedExp.role}</div>
                        <div className={styles.expDetailMetaRow}>
                          <div className={styles.expDetailMetaItem}>
                            <Clock size={14} />
                            <span>{selectedExp.duration}</span>
                          </div>
                          {selectedExp.location && (
                            <div className={styles.expDetailMetaItem}>
                              <MapPin size={14} />
                              <span>{selectedExp.location}</span>
                            </div>
                          )}
                          {selectedExp.employmentType && (
                            <div className={styles.expDetailMetaItem} style={{ color: 'var(--accent-gold)' }}>
                              <span>• {selectedExp.employmentType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className={styles.expDetailDesc}>{selectedExp.description}</p>

                    {selectedExp.responsibilities && (
                      <div>
                        <h4 className={styles.expDetailSectionTitle}>
                          <CheckCircle2 size={16} /> Key Responsibilities
                        </h4>
                        <div className={styles.expDetailResponsibilitiesList}>
                          {selectedExp.responsibilities.split('\n').filter(r => r.trim().length > 0).map((resp, rIdx) => (
                            <div key={rIdx} className={styles.expDetailRespItem}>
                              <span className={styles.expDetailRespIcon}>✓</span>
                              <span>{resp.replace(/^[-\*\u2022]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedExp.techStack && selectedExp.techStack.length > 0 && (
                      <div style={{ marginTop: 'auto' }}>
                        <h4 className={styles.expDetailSectionTitle}>
                          <Code size={16} /> Tech Stack
                        </h4>
                        <div className={styles.expDetailTechList}>
                          {selectedExp.techStack.map((tech) => (
                            <div key={tech} className={styles.expTechBadge}>
                              {tech.toLowerCase() === 'shopify' && (
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                              )}
                              {tech.toLowerCase() === 'next.js' && <span style={{ fontWeight: 'bold', fontSize: '0.65rem' }}>N</span>}
                              {tech.toLowerCase() === 'react' && <span style={{ color: '#60a5fa' }}>⚛</span>}
                              <span>{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Select an experience item to read description details.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Bottom connect banner */}
          <div className={styles.expCallout}>
            <div className={styles.expCalloutLeft}>
              <div className={styles.expCalloutIcon}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <div>
                <h4 className={styles.expCalloutTitle}>I'm always open to new opportunities and exciting projects.</h4>
                <p className={styles.expCalloutDesc}>Let's build something amazing together!</p>
              </div>
            </div>
            <a href="#contact" className={styles.expCalloutBtn}>
              Let's Connect <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

      {/* Skills / Expertise */}
      <section id="skills" className={styles.skillsPremium}>
        <div className={styles.skillsPremiumContent}>
          
          <div className={styles.skillsPremiumHeaderRow}>
            <div className={styles.skillsPremiumHeaderLeft}>
              <span className={styles.skillsPremiumSubBadge}>
                <Star size={14} style={{ marginRight: 6 }} /> MY SKILLS
              </span>
              <h2 className={styles.skillsPremiumTitle}>
                Tech Skills, <span className={styles.skillsPremiumGradientText}>Real-World Impact.</span>
              </h2>
              <p className={styles.skillsPremiumDesc}>
                I combine creativity with technology to build fast, scalable, and user-friendly digital solutions.
              </p>
            </div>
            
            {/* Skills Overview Card (Top Right) */}
            <div className={styles.skillsOverviewCard}>
              <div className={styles.skillsOverviewGraphicBox}>
                <div className={styles.skillsOverviewCircle}>
                  <div className={styles.skillsOverviewCircleInner}>
                    <Code size={30} />
                  </div>
                </div>
              </div>
              <div className={styles.skillsOverviewInfo}>
                <div className={styles.skillsOverviewHeader}>Skills Overview</div>
                <div className={styles.skillsOverviewStatsGrid}>
                  <div className={styles.skillsOverviewStatItem}>
                    <div className={styles.skillsOverviewStatVal}>{siteSettings?.stat1Value || "5+励"}</div>
                    <div className={styles.skillsOverviewStatLabel}>Years Experience</div>
                  </div>
                  <div className={styles.skillsOverviewStatItem}>
                    <div className={styles.skillsOverviewStatVal}>{initialSkills.length}+</div>
                    <div className={styles.skillsOverviewStatLabel}>Techs Mastered</div>
                  </div>
                  <div className={styles.skillsOverviewStatItem}>
                    <div className={styles.skillsOverviewStatVal}>{siteSettings?.stat2Value || "50+"}</div>
                    <div className={styles.skillsOverviewStatLabel}>Projects Done</div>
                  </div>
                  <div className={styles.skillsOverviewStatItem}>
                    <div className={styles.skillsOverviewStatVal}>{siteSettings?.stat3Value || "15+"}</div>
                    <div className={styles.skillsOverviewStatLabel}>Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 columns Grid */}
          <div className={styles.skillsCategoriesGrid}>
            
            {/* Column 1: Frontend Development */}
            <div className={styles.skillsCategoryCard}>
              <div className={styles.skillsCategoryHeader}>
                <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconFrontend}`}>
                  <Layout size={18} />
                </div>
                <h3 className={styles.skillsCategoryTitle}>Frontend Development</h3>
              </div>
              <div className={styles.skillsList}>
                {getFrontendSkills().map((s) => (
                  <div key={s._id} className={styles.skillItem}>
                    <div className={styles.skillLabelRow}>
                      <span>{s.name}</span>
                      <span className={styles.skillValue}>{s.proficiency}%</span>
                    </div>
                    <div className={styles.skillProgressBarBg}>
                      <motion.div 
                        className={`${styles.skillProgressBarFill} ${styles.skillFillFrontend}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
                {getFrontendSkills().length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No frontend skills added.</span>}
              </div>
            </div>

            {/* Column 2: Backend Development */}
            <div className={styles.skillsCategoryCard}>
              <div className={styles.skillsCategoryHeader}>
                <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconBackend}`}>
                  <Database size={18} />
                </div>
                <h3 className={styles.skillsCategoryTitle}>Backend Development</h3>
              </div>
              <div className={styles.skillsList}>
                {getBackendSkills().map((s) => (
                  <div key={s._id} className={styles.skillItem}>
                    <div className={styles.skillLabelRow}>
                      <span>{s.name}</span>
                      <span className={styles.skillValue}>{s.proficiency}%</span>
                    </div>
                    <div className={styles.skillProgressBarBg}>
                      <motion.div 
                        className={`${styles.skillProgressBarFill} ${styles.skillFillBackend}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
                {getBackendSkills().length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No backend skills added.</span>}
              </div>
            </div>

            {/* Column 3: Tools & Platforms */}
            <div className={styles.skillsCategoryCard}>
              <div className={styles.skillsCategoryHeader}>
                <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconTools}`}>
                  <Globe size={18} />
                </div>
                <h3 className={styles.skillsCategoryTitle}>Tools & Platforms</h3>
              </div>
              <div className={styles.skillsList}>
                {getToolsSkills().map((s) => (
                  <div key={s._id} className={styles.skillItem}>
                    <div className={styles.skillLabelRow}>
                      <span>{s.name}</span>
                      <span className={styles.skillValue}>{s.proficiency}%</span>
                    </div>
                    <div className={styles.skillProgressBarBg}>
                      <motion.div 
                        className={`${styles.skillProgressBarFill} ${styles.skillFillTools}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
                {getToolsSkills().length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No tools/platforms added.</span>}
              </div>
            </div>

            {/* Column 4: Core Competencies */}
            <div className={styles.skillsCategoryCard}>
              <div className={styles.skillsCategoryHeader}>
                <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconCore}`}>
                  <Cpu size={18} />
                </div>
                <h3 className={styles.skillsCategoryTitle}>Core Competencies</h3>
              </div>
              <div className={styles.compList}>
                {getCompetencySkills().map((s) => (
                  <div key={s._id} className={styles.compItem}>
                    <CheckCircle2 size={16} className={styles.compIcon} />
                    <span>{s.name}</span>
                  </div>
                ))}
                {getCompetencySkills().length === 0 && (
                  <>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Problem Solving</span>
                    </div>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Clean & Efficient Code</span>
                    </div>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Scalable Architecture</span>
                    </div>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Performance Optimization</span>
                    </div>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Responsive Design</span>
                    </div>
                    <div className={styles.compItem}>
                      <CheckCircle2 size={16} className={styles.compIcon} />
                      <span>Agile & Team Collaboration</span>
                    </div>
                  </>
                )}
              </div>
              {/* Floating isometric cube */}
              <div className={styles.compGraphicWrapper}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
            </div>

          </div>

          {/* Bottom other technologies ticker/badges */}
          <div className={styles.otherTechsBar}>
            <div className={styles.otherTechsTitle}>Other Technologies I Work With</div>
            <div className={styles.otherTechsContainer}>
              {getOtherSkills().map((s) => (
                <div key={s._id} className={styles.otherTechBadge}>
                  {s.name}
                </div>
              ))}
              {getOtherSkills().length === 0 && (
                <>
                  <div className={styles.otherTechBadge}>TypeScript</div>
                  <div className={styles.otherTechBadge}>Redux</div>
                  <div className={styles.otherTechBadge}>GraphQL</div>
                  <div className={styles.otherTechBadge}>JWT</div>
                  <div className={styles.otherTechBadge}>Sass</div>
                  <div className={styles.otherTechBadge}>Docker</div>
                  <div className={styles.otherTechBadge}>Cloudinary</div>
                  <div className={styles.otherTechBadge}>Stripe</div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>



      {/* Testimonials */}
      {initialTestimonials.length > 0 && (
        <section id="testimonials" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
          <div className={styles.sectionContent}>
            
            <div className={styles.sectionHeader} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', padding: '6px 16px', borderRadius: '100px', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Client Testimonials</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', lineHeight: 1.2, color: '#ffffff', fontWeight: 800 }}>
                Trusted by Clients, <span style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proven by Results</span>
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#94a3b8', maxWidth: '600px', marginTop: '12px', fontWeight: 300 }}>
                I take pride in delivering exceptional digital solutions that help businesses grow, scale, and stand out.
              </p>
            </div>

            {/* Testimonials Slider */}
            <div className={styles.testimonialPremiumSlider}>
              {/* Prev Button */}
              <button 
                type="button"
                onClick={() => setActiveReviewIdx((prev) => (prev === 0 ? initialTestimonials.length - 1 : prev - 1))}
                className={`${styles.testimonialArrowBtn} ${styles.testimonialArrowPrev}`}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Slider Track */}
              <div className={styles.testimonialSliderTrack}>
                {(function getSliderItems() {
                  const items = [];
                  const count = initialTestimonials.length;
                  const limit = Math.min(3, count);
                  for (let i = 0; i < limit; i++) {
                    const index = (activeReviewIdx + i) % count;
                    items.push(initialTestimonials[index]);
                  }
                  return items;
                })().map((t, idx) => (
                  <motion.div
                    key={`${t._id}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className={styles.testimonialSliderCard}
                  >
                    <div className={styles.testimonialCardQuoteSign}>“</div>
                    <p className={styles.testimonialCardText}>
                      "{t.reviewText}"
                    </p>
                    <div className={styles.testimonialCardDivider} />
                    
                    <div className={styles.testimonialCardAuthor}>
                      <div className={styles.testimonialCardAvatarBox}>
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                            <User size={16} color="var(--accent-gold)" />
                          </div>
                        )}
                      </div>
                      <div className={styles.testimonialCardAuthorInfo}>
                        <div className={styles.testimonialCardAuthorName}>{t.name}</div>
                        <div className={styles.testimonialCardAuthorRole}>{t.role} at {t.company}</div>
                        
                        <div className={styles.testimonialCardStars}>
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next Button */}
              <button 
                type="button"
                onClick={() => setActiveReviewIdx((prev) => (prev === initialTestimonials.length - 1 ? 0 : prev + 1))}
                className={`${styles.testimonialArrowBtn} ${styles.testimonialArrowNext}`}
                aria-label="Next Testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Testimonials Stats Row */}
            <div className={styles.testimonialStatsContainer}>
              <div className={styles.aboutStatItem}>
                <div className={styles.aboutStatIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className={styles.aboutStatInfo}>
                  <div className={styles.aboutStatVal}>{siteSettings?.stat3Value || '20+'}</div>
                  <div className={styles.aboutStatLabel}>{siteSettings?.stat3Label || 'Happy Clients'}</div>
                </div>
              </div>

              <div className={styles.aboutStatItem}>
                <div className={styles.aboutStatIcon}>
                  <Briefcase size={20} />
                </div>
                <div className={styles.aboutStatInfo}>
                  <div className={styles.aboutStatVal}>{siteSettings?.stat2Value || '50+'}</div>
                  <div className={styles.aboutStatLabel}>{siteSettings?.stat2Label || 'Projects Delivered'}</div>
                </div>
              </div>

              <div className={styles.aboutStatItem}>
                <div className={styles.aboutStatIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </div>
                <div className={styles.aboutStatInfo}>
                  <div className={styles.aboutStatVal}>5.0</div>
                  <div className={styles.aboutStatLabel}>Average Rating</div>
                </div>
              </div>

              <div className={styles.aboutStatItem}>
                <div className={styles.aboutStatIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div className={styles.aboutStatInfo}>
                  <div className={styles.aboutStatVal}>{siteSettings?.stat4Value || '100%'}</div>
                  <div className={styles.aboutStatLabel}>{siteSettings?.stat4Label || 'Client Satisfaction'}</div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Journal Blogs Section */}
      <section id="blogs" className={`${styles.section} ${styles.sectionDark}`} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
        <div className={styles.sectionContent}>
          
          <div className={styles.blogHeaderGrid}>
            <div className={styles.blogHeaderLeft}>
              <span className={styles.sectionTag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 8px #3b82f6' }} />
                Latest From Blog
              </span>
              <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', margin: '16px 0 24px', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 800 }}>
                Thoughts, Tutorials<br/>& <span style={{ color: '#60a5fa', textShadow: '0 0 15px rgba(96,165,250,0.1)' }}>My Learnings</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '480px', marginBottom: '24px', fontWeight: 300 }}>
                I love sharing knowledge and experiences about web development, tools, and everything I learn on my journey.
              </p>
              <a href="#blogs" className="gold-gradient-text" style={{ fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                View all articles <ArrowRight size={14} />
              </a>
            </div>

            <div className={styles.blogHeaderRight}>
              <div className={styles.blogMugContainer}>
                <img src="/blog_cup_graphic.png" alt="3D Digital Art Mug" className={styles.blogMugImg} />
              </div>
            </div>
          </div>

          {initialBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              Articles are being curated. Check back shortly.
            </div>
          ) : (
            <>
              <div className={styles.blogCardsGrid}>
                {initialBlogs.slice(0, showAllBlogs ? undefined : 3).map((blog) => (
                  <motion.div
                    key={blog._id}
                    className={styles.blogCardPremium}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <div className={styles.blogCardImageWrapper}>
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className={styles.blogCardImage} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                          <BookOpen size={48} color="var(--text-muted)" />
                        </div>
                      )}
                      <span className={styles.blogCardCategory}>{blog.tags && blog.tags[0] ? blog.tags[0] : 'Tech'}</span>
                      <span className={styles.blogCardDate}>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>

                    <div className={styles.blogCardContent}>
                      <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                      <p className={styles.blogCardExcerpt}>{blog.excerpt}</p>
                      
                      <div className={styles.blogCardFooter}>
                        <div className={styles.blogCardAuthor}>
                          {siteSettings?.aboutImage ? (
                            <img src={siteSettings.aboutImage} alt="Refayet" className={styles.blogCardAvatar} />
                          ) : siteSettings?.logoImage ? (
                            <img src={siteSettings.logoImage} alt="Refayet" className={styles.blogCardAvatar} />
                          ) : (
                            <div className={styles.blogCardAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                              <User size={16} />
                            </div>
                          )}
                          <div className={styles.blogCardAuthorInfo}>
                            <span className={styles.blogCardAuthorName}>{siteSettings?.aboutName || 'Md. Refayet Hossen'}</span>
                            <span className={styles.blogCardReadTime}>{blog.readTime || '5 min read'}</span>
                          </div>
                        </div>
                        <div className={styles.blogCardCircleBtn}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                  onClick={() => {
                    setShowAllBlogs(!showAllBlogs);
                  }}
                  className="btn-premium btn-premium-gold"
                  style={{ gap: 12, padding: '16px 36px', borderRadius: '100px', display: 'flex', alignItems: 'center' }}
                >
                  {showAllBlogs ? 'Show Less' : 'Explore All Blog Posts'} <BookOpen size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactPremium}>
        <div className={styles.contactPremiumGrid}>
          
          {/* Left Column: Details & Socials */}
          <div className={styles.contactPremiumLeft}>
            <span className={styles.contactPremiumSub}>
              <MessageSquare size={14} style={{ marginRight: 6 }} /> GET IN TOUCH
            </span>
            <h2 className={styles.contactPremiumTitle}>
              Let's Create Something <span className={styles.contactPremiumGradientText}>Extraordinary.</span>
            </h2>
            <p className={styles.contactPremiumDesc}>
              Have a project in mind, want to discuss a partnership, or simply want to say hello? Drop me a line and let's start a conversation.
            </p>

            <div className={styles.contactPremiumInfoList}>
              {siteSettings?.aboutLocation && (
                <div className={styles.contactPremiumInfoItem}>
                  <div className={styles.contactPremiumIconCard}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className={styles.contactPremiumInfoLabel}>Location</div>
                    <div className={styles.contactPremiumInfoValue}>{siteSettings.aboutLocation}</div>
                  </div>
                </div>
              )}

              {siteSettings?.email && (
                <a href={`mailto:${siteSettings.email}`} className={styles.contactPremiumInfoItem} style={{ textDecoration: 'none' }}>
                  <div className={styles.contactPremiumIconCard}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className={styles.contactPremiumInfoLabel}>Email Me Directly</div>
                    <div className={styles.contactPremiumInfoValue}>{siteSettings.email}</div>
                  </div>
                </a>
              )}

              {siteSettings?.phone && (
                <a href={`tel:${siteSettings.phone}`} className={styles.contactPremiumInfoItem} style={{ textDecoration: 'none' }}>
                  <div className={styles.contactPremiumIconCard}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className={styles.contactPremiumInfoLabel}>Call / WhatsApp</div>
                    <div className={styles.contactPremiumInfoValue}>{siteSettings.phone}</div>
                  </div>
                </a>
              )}

              <div className={styles.contactPremiumInfoItem}>
                <div className={styles.contactPremiumIconCard} style={{ background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                  <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
                </div>
                <div>
                  <div className={styles.contactPremiumInfoLabel}>Availability</div>
                  <div className={styles.contactPremiumInfoValue} style={{ color: '#22c55e', fontWeight: 500 }}>Open for Freelance & Contracts</div>
                </div>
              </div>
            </div>

            <div className={styles.contactPremiumSignatureText}>Let's Connect</div>
            
            <div className={styles.contactPremiumSocialRow}>
              {siteSettings?.github && (
                <a href={siteSettings.github} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}>
                  <Code size={18} />
                </a>
              )}
              {siteSettings?.linkedin && (
                <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}>
                  <Briefcase size={18} />
                </a>
              )}
              {siteSettings?.whatsapp && (
                <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}>
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Message Form Card */}
          <div className={styles.contactPremiumFormCard}>
            <div className={styles.contactFormCardHeader}>
              <div className={styles.contactFormCardIcon}>
                <Mail size={20} />
              </div>
              <div>
                <h3 className={styles.contactFormCardTitle}>Send Me a Message</h3>
                <span className={styles.contactFormCardSubtitle}>Usually responds in less than 24 hours</span>
              </div>
            </div>

            <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.contactFormPremiumGrid}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Your Name</label>
                  <div className={styles.contactInputWrapper}>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className={styles.contactPremiumInput}
                    />
                    <User size={16} className={styles.contactInputIcon} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
                  <div className={styles.contactInputWrapper}>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className={styles.contactPremiumInput}
                    />
                    <Mail size={16} className={styles.contactInputIcon} />
                  </div>
                </div>

              </div>

              <div className={styles.contactFormGroupFull}>
                <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Subject</label>
                <div className={styles.contactInputWrapper}>
                  <input 
                    type="text" 
                    required
                    placeholder="Project Inquiry / General Question"
                    value={contactForm.subject}
                    onChange={e => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className={styles.contactPremiumInput}
                  />
                  <MessageSquare size={16} className={styles.contactInputIcon} />
                </div>
              </div>

              <div className={styles.contactFormGroupFull}>
                <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Your Message</label>
                <div className={styles.contactInputWrapper}>
                  <textarea 
                    required
                    placeholder="Tell me about your project, goals, and budget constraints..."
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className={styles.contactPremiumTextarea}
                  />
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className={styles.contactTextareaIcon}>
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={contactStatus === 'loading'}
                className={styles.contactFormSubmitBtn}
              >
                {contactStatus === 'loading' ? (
                  <>Sending Message...</>
                ) : (
                  <>
                    Send Message <ArrowRight size={16} />
                  </>
                )}
              </button>

              {contactStatus === 'success' && (
                <div style={{ color: '#4caf50', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(76, 175, 80, 0.08)', border: '1px solid rgba(76, 175, 80, 0.2)', padding: '12px', borderRadius: '8px' }}>
                  <CheckCircle2 size={16} /> Message sent successfully! I'll get back to you shortly.
                </div>
              )}
              {contactStatus === 'error' && (
                <div style={{ color: '#f44336', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(244, 67, 54, 0.08)', border: '1px solid rgba(244, 67, 54, 0.2)', padding: '12px', borderRadius: '8px' }}>
                  Failed to send message. Please email me directly instead.
                </div>
              )}
            </form>

            <div className={styles.contactFormDisclaimer}>
              <Lock size={12} />
              <span>Your message and contact data are safe & secure.</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className={styles.footerPremium}>
        <div className={styles.footerPremiumContent}>
          
          <div className={styles.footerPremiumGrid}>
            
            {/* Column 1: Brand & newsletter */}
            <div className={styles.footerBrandCol}>
              <div className={styles.footerLogoRow}>
                <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold' }}>
                  <span>&lt;&gt;</span>
                </div>
                <div>
                  <div className={styles.footerLogoTitle}>{siteSettings?.logoText || 'RIFAT'}</div>
                  <div className={styles.footerLogoSubtitle}>{siteSettings?.heroSpecializationText || 'Full Stack Developer'}</div>
                </div>
              </div>
              <p className={styles.footerBioText}>
                Building bespoke, high-performance web applications and high-converting Shopify stores that drive real business results.
              </p>
              
              <div className={styles.footerSocialRow}>
                {siteSettings?.github && (
                  <a href={siteSettings.github} target="_blank" rel="noreferrer" className={styles.footerSocialBtn} aria-label="GitHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  </a>
                )}
                {siteSettings?.linkedin && (
                  <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" className={styles.footerSocialBtn} aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
                {siteSettings?.whatsapp && (
                  <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className={styles.footerSocialBtn} aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </a>
                )}
              </div>

              <div className={styles.footerSectionLabel}>Newsletter</div>
              <form className={styles.footerNewsletterForm} onSubmit={handleNewsletterSubscribe}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={styles.footerNewsletterInput} 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading'}
                  required 
                />
                <button type="submit" className={styles.footerNewsletterSubmit} aria-label="Subscribe" disabled={newsletterStatus === 'loading'}>
                  {newsletterStatus === 'loading' ? (
                    <div style={{ display: 'inline-block', width: '12px', height: '12px', border: '1px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  )}
                </button>
              </form>

              {newsletterStatus === 'success' && (
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '8px', fontWeight: 500 }}>
                  ✓ Successfully subscribed!
                </div>
              )}
              {newsletterStatus === 'already' && (
                <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '8px', fontWeight: 500 }}>
                  ⚠ Already subscribed.
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '8px', fontWeight: 500 }}>
                  ✗ Subscription failed.
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div className={styles.footerLinksCol}>
              <div className={styles.footerColHeader}>
                <ChevronRight size={14} className={styles.footerColHeaderIcon} />
                <h4 className={styles.footerColTitle}>Quick Links</h4>
              </div>
              <nav className={styles.footerLinksList}>
                <a href="#about" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>About Me</span>
                </a>
                <a href="#services" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Services</span>
                </a>
                <a href="#skills" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Skills</span>
                </a>
                <a href="#projects" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Projects</span>
                </a>
                <a href="#experience" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Experience</span>
                </a>
                <a href="#blogs" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Blog</span>
                </a>
                <a href="#contact" className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>Contact</span>
                </a>
              </nav>
            </div>

            {/* Column 3: Services */}
            <div className={styles.footerLinksCol}>
              <div className={styles.footerColHeader}>
                <ChevronRight size={14} className={styles.footerColHeaderIcon} />
                <h4 className={styles.footerColTitle}>Services</h4>
              </div>
              <div className={styles.footerLinksList}>
                <a href="#services" className={styles.footerLinkItem}>Shopify Development</a>
                <a href="#services" className={styles.footerLinkItem}>Full Stack Development</a>
                <a href="#services" className={styles.footerLinkItem}>UI/UX Design</a>
                <a href="#services" className={styles.footerLinkItem}>SEO Optimization</a>
                <a href="#services" className={styles.footerLinkItem}>Performance Optimization</a>
                <a href="#services" className={styles.footerLinkItem}>API Integration</a>
                <a href="#services" className={styles.footerLinkItem}>Maintenance & Support</a>
                <a href="#services" className={styles.footerLinkItem}>Consulting</a>
              </div>
            </div>

            {/* Column 4: Resources */}
            <div className={styles.footerLinksCol}>
              <div className={styles.footerColHeader}>
                <ChevronRight size={14} className={styles.footerColHeaderIcon} />
                <h4 className={styles.footerColTitle}>Resources</h4>
              </div>
              <div className={styles.footerLinksList}>
                <a href="#projects" className={styles.footerLinkItem}>Portfolio</a>
                <a href="#projects" className={styles.footerLinkItem}>Case Studies</a>
                <a href="#blogs" className={styles.footerLinkItem}>Blog & Insights</a>
                <a href="#skills" className={styles.footerLinkItem}>Tools & Tech</a>
                <a href="#about" className={styles.footerLinkItem}>FAQ</a>
                <a href="#about" className={styles.footerLinkItem}>Documentation</a>
                <a href="#contact" className={styles.footerLinkItem}>Support</a>
                <a href="#contact" className={styles.footerLinkItem}>Hire Me</a>
              </div>
            </div>

            {/* Column 5: Contact Info */}
            <div className={styles.footerLinksCol}>
              <div className={styles.footerColHeader}>
                <ChevronRight size={14} className={styles.footerColHeaderIcon} />
                <h4 className={styles.footerColTitle}>Contact Info</h4>
              </div>
              <div className={styles.footerContactList}>
                <div className={styles.footerContactItem}>
                  <MapPin size={16} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>{siteSettings?.aboutLocation || 'Dhaka, Bangladesh'}</span>
                </div>
                <div className={styles.footerContactItem}>
                  <Mail size={16} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>{siteSettings?.aboutEmail || siteSettings?.email || 'refayet@example.com'}</span>
                </div>
                <div className={styles.footerContactItem}>
                  <Phone size={16} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>{siteSettings?.phone || '+880 1700-000000'}</span>
                </div>
                <div className={styles.footerContactItem}>
                  <Clock size={16} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>Sun - Thu: 9AM - 9PM (BST)</span>
                </div>
              </div>
              
              {/* Dots Map Graphic */}
              <div className={styles.footerMapBg}>
                <svg viewBox="0 0 100 50" width="100%" height="auto" opacity="0.35">
                  <path d="M10,15 A2,2 0 1,1 10,15.1 Z M25,12 A1.5,1.5 0 1,1 25,12.1 Z M45,22 A2.5,2.5 0 1,1 45,22.1 Z M75,18 A2,2 0 1,1 75,18.1 Z M85,32 A2.2,2.2 0 1,1 85,32.1 Z M30,35 A2,2 0 1,1 30,35.1 Z M60,40 A1.8,1.8 0 1,1 60,40.1 Z M55,10 A2,2 0 1,1 55,10.1 Z M90,15 A2,2 0 1,1 90,15.1 Z M15,42 A1.5,1.5 0 1,1 15,42.1 Z" fill="#60a5fa" />
                </svg>
              </div>
            </div>

          </div>

          <div className={styles.footerBottomBar}>
            <div className={styles.footerBottomLeft}>
              <div className={styles.footerCopyright}>
                {siteSettings?.footerText || `© ${new Date().getFullYear()} Refayet Hossen. All rights reserved.`}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                Building digital solutions with passion 💜 | <a href="/admin/login" style={{ color: 'inherit', textDecoration: 'underline' }}>Portal Access</a>
              </div>
            </div>

            <div className={styles.footerBottomLinks}>
              <a href="#about" className={styles.footerBottomLink}>Privacy Policy</a>
              <a href="#about" className={styles.footerBottomLink}>Terms of Service</a>
              <a href="#about" className={styles.footerBottomLink}>Cookie Policy</a>
            </div>

            <button 
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.footerBackToTop}
            >
              <span>Back to Top</span>
              <div className={styles.footerBackToTopBtn}>
                <ChevronUp size={16} />
              </div>
            </button>
          </div>

        </div>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget siteSettings={siteSettings} />

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Blog Article Reader Modal Overlay */}
      {selectedBlog && (() => {
        const headings = extractHeadings(selectedBlog.content);
        return (
          <div className={styles.blogReaderOverlay} onClick={() => setSelectedBlog(null)}>
            <div className={styles.blogReaderBox} onClick={e => e.stopPropagation()}>
              
              {/* Header Area */}
              <div className={styles.blogReaderHeader}>
                <button onClick={() => setSelectedBlog(null)} className={styles.blogReaderClose} aria-label="Close modal">
                  <X size={18} />
                </button>

                <div className={styles.blogReaderMetaRow}>
                  <span className={styles.blogReaderCategory}>{selectedBlog.tags && selectedBlog.tags[0] ? selectedBlog.tags[0] : 'Tech'}</span>
                  <span>•</span>
                  <span>{selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime || '10 min read'}</span>
                </div>

                <div className={styles.blogReaderHeaderContent}>
                  <div>
                    <h2 className={styles.blogReaderTitle}>{selectedBlog.title}</h2>
                    <p className={styles.blogReaderExcerpt}>{selectedBlog.excerpt}</p>
                    
                    <div className={styles.blogReaderAuthorCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {siteSettings?.aboutImage ? (
                          <img src={siteSettings.aboutImage} alt="Refayet" className={styles.blogReaderAuthorAvatar} />
                        ) : siteSettings?.logoImage ? (
                          <img src={siteSettings.logoImage} alt="Refayet" className={styles.blogReaderAuthorAvatar} />
                        ) : (
                          <div className={styles.blogReaderAuthorAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                            <User size={18} />
                          </div>
                        )}
                        <div className={styles.blogReaderAuthorMeta}>
                          <span className={styles.blogReaderAuthorName}>{siteSettings?.aboutName || 'Md. Refayet Hossen'}</span>
                          <span className={styles.blogReaderAuthorSub}>Full Stack Developer & Shopify Expert</span>
                        </div>
                      </div>

                      <div className={styles.blogReaderShareGroup}>
                        <button 
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(window.location.href);
                              setCopiedToast(true);
                              setTimeout(() => setCopiedToast(false), 2000);
                            }
                          }}
                          className={styles.blogReaderShareBtn} 
                          title="Copy article link"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedBlog.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.blogReaderShareBtn}
                          title="Share on Twitter"
                        >
                          <TwitterIcon />
                        </a>
                        <a 
                          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(selectedBlog.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.blogReaderShareBtn}
                          title="Share on LinkedIn"
                        >
                          <LinkedinIcon />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className={styles.blogReaderImageWrapper}>
                    {selectedBlog.image ? (
                      <img src={selectedBlog.image} alt={selectedBlog.title} className={styles.blogReaderImage} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                        <BookOpen size={64} color="var(--text-muted)" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Split Columns Area */}
              <div className={styles.blogReaderBodyGrid}>
                
                {/* Column 1: On This Page */}
                <div className={styles.blogReaderTocCol}>
                  <h4 className={styles.blogReaderTocTitle}>On This Page</h4>
                  {headings.length > 0 ? (
                    <ul className={styles.blogReaderTocList}>
                      {headings.map((h) => (
                        <li key={h.id} className={`${styles.blogReaderTocItem} ${activeTocId === h.id ? styles.blogReaderTocItemActive : ''}`}>
                          <span 
                            onClick={() => {
                              const el = document.getElementById(h.id);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                setActiveTocId(h.id);
                              }
                            }}
                            className={`${styles.blogReaderTocLink} ${activeTocId === h.id ? styles.blogReaderTocLinkActive : ''}`}
                            style={{ paddingLeft: h.level === 3 ? '12px' : '0' }}
                            title={h.text}
                          >
                            {h.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Introduction</div>
                  )}
                </div>

                {/* Column 2: Article Text Content */}
                <div className={styles.blogReaderContentCol}>
                  <div 
                    className="journal-content"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(selectedBlog.content) }}
                  />
                </div>

                {/* Column 3: Details & Social share links */}
                <div className={styles.blogReaderSidebarCol}>
                  <div className={styles.blogReaderSideCard}>
                    <h4 className={styles.blogReaderSideCardTitle}>Details</h4>
                    <div className={styles.blogReaderSideDetailList}>
                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Published on</span>
                        <span className={styles.blogReaderSideDetailVal}>
                          {selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </span>
                      </div>

                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Reading time</span>
                        <span className={styles.blogReaderSideDetailVal}>{selectedBlog.readTime || '10 min read'}</span>
                      </div>

                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Category</span>
                        <span className={styles.blogReaderSideCategoryPill}>
                          {selectedBlog.tags && selectedBlog.tags[0] ? selectedBlog.tags[0] : 'Web Development'}
                        </span>
                      </div>

                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Tags</span>
                        <div className={styles.blogReaderSideTagsGrid}>
                          {selectedBlog.tags && selectedBlog.tags.map((t) => (
                            <span key={t} className={styles.blogReaderSideTagBadge}>#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.blogReaderSideCard}>
                    <h4 className={styles.blogReaderSideCardTitle}>Share this article</h4>
                    <div className={styles.blogReaderSideShareRow}>
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedBlog.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.blogReaderShareBtn}
                        title="Share on Twitter"
                      >
                        <TwitterIcon />
                      </a>
                      <a 
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(selectedBlog.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.blogReaderShareBtn}
                        title="Share on LinkedIn"
                      >
                        <LinkedinIcon />
                      </a>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.blogReaderShareBtn}
                        title="Share on Facebook"
                      >
                        <FacebookIcon />
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {copiedToast && (
                <div style={{
                  position: 'fixed',
                  bottom: '40px',
                  right: '40px',
                  background: '#60a5fa',
                  color: '#000',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  zIndex: 2000,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(96,165,250,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} /> Link copied to clipboard!
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

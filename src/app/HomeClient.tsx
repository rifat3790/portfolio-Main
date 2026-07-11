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
  MessageCircle
} from 'lucide-react';
import styles from './home.module.css';
import CustomCursor from './components/CustomCursor';

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
}

interface HomeClientProps {
  initialProjects: IProject[];
  initialSkills: ISkill[];
  initialTestimonials: ITestimonial[];
  initialBlogs: IBlog[];
  siteSettings: ISetting | null;
}

export default function HomeClient({
  initialProjects,
  initialSkills,
  initialTestimonials,
  initialBlogs,
  siteSettings
}: HomeClientProps) {
  const roles = siteSettings?.typewriterRoles
    ? siteSettings.typewriterRoles.split(',').map(r => r.trim())
    : ['Refayet Hossen', 'Full Stack Developer', 'Shopify Developer'];

  // Navigation & UI States
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/## (.*?)\n/g, '<h2>$1</h2>')
      .replace(/# (.*?)\n/g, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)\n/g, '<li>$1</li>')
      .replace(/- (.*?)\n/g, '<li>$1</li>')
      .replace(/```typescript([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .split('\n\n')
      .map(para => {
        const trimmed = para.trim();
        if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<pre')) {
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
      <div className="luxury-grid" />

      {/* Decorative Glow Mesh Backgrounds */}
      <div className={styles.meshGlowContainer}>
        <div className={styles.glowBall1} />
        <div className={styles.glowBall2} />
      </div>

      <header className={styles.header}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#" className={`${styles.logo} gold-gradient-text`} style={{ zIndex: 100 }}>
            {siteSettings?.logoText || 'AURA'}
          </a>
          {/* Desktop Nav Links */}
          <nav className={styles.nav}>
            {(siteSettings?.navbarLinks || []).map((link, idx) => (
              <a key={idx} href={link.url} className={styles.navLink}>
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-premium btn-premium-gold" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
              Let's Talk
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className={`${styles.menuBtn} ${styles.mobileMenuBtn}`} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              zIndex: 100
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>Menu</span>
            <Menu size={24} />
          </button>
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
      <section className={`${styles.section} ${styles.sectionDark}`} style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: '160px',
        paddingBottom: '80px',
        position: 'relative',
        backgroundImage: siteSettings?.heroBannerImage ? `url(${siteSettings.heroBannerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {siteSettings?.heroBannerImage && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(4, 4, 6, 0.85)', zIndex: 1 }} />
        )}
        <div className={styles.luxuryMeshGlow} style={{ zIndex: 2, top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        
        <div className={styles.sectionContent} style={{ width: '100%', maxWidth: '1200px', position: 'relative', zIndex: 10 }}>
          <div className={styles.heroCentered}>
            
            {/* Left Column: Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ 
                display: 'inline-block',
                padding: '8px 24px', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '100px', 
                fontSize: '0.8rem', 
                letterSpacing: '0.3em', 
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                backdropFilter: 'blur(10px)',
                marginBottom: '24px',
                background: 'rgba(var(--accent-gold-rgb), 0.02)'
              }}>
                {siteSettings?.heroSubtitle || 'Exclusive Digital Atelier'}
              </span>
            </motion.div>

            <motion.h1 
              className="editorial-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 5.2rem)',
                lineHeight: 1.08,
                textAlign: 'center',
                letterSpacing: '-0.01em',
                marginBottom: '24px',
                color: 'var(--text-primary)'
              }}
            >
              {siteSettings?.heroTitle || "I'm Refayet Hossen"}
            </motion.h1>

            {/* Typewriter Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              style={{ 
                fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', 
                fontFamily: 'var(--font-serif)', 
                fontStyle: 'italic', 
                textAlign: 'center',
                marginBottom: '40px', 
                color: 'var(--text-secondary)' 
              }}
            >
              <TypewriterLoop roles={roles} />
            </motion.div>

            {/* Luxury Arch Portrait Showcase */}
            <motion.div 
              className={styles.heroArchWrapper}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <div className={styles.luxuryArchFrame}>
                {siteSettings?.logoImage ? (
                   <img src={siteSettings.logoImage} alt="Portrait" className={styles.luxuryArchImg} />
                ) : (
                   <div className={styles.luxuryArchPlaceholder}>
                     <User size={80} color="var(--text-muted)" />
                   </div>
                )}
                <div className={styles.luxuryArchGlow} />
              </div>
              
              {/* Floating Accent Icons */}
              <motion.div className={styles.floatingAccentIcon} style={{ top: '15%', left: '-12%' }} animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Code size={18} />
              </motion.div>
              <motion.div className={styles.floatingAccentIcon} style={{ bottom: '20%', right: '-12%' }} animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <Sparkles size={18} />
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <a href={siteSettings?.heroBtn1Url || '#projects'} className="btn-premium btn-premium-gold" style={{ padding: '18px 40px', fontSize: '0.9rem', borderRadius: '100px' }}>
                {siteSettings?.heroBtn1Text || 'Explore Showcase'}
              </a>
              <a href={siteSettings?.heroBtn2Url || '#contact'} className="btn-premium btn-premium-outline" style={{ padding: '18px 40px', fontSize: '0.9rem', borderRadius: '100px' }}>
                {siteSettings?.heroBtn2Text || 'Establish Dialogue'}
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className={`${styles.section} ${styles.sectionLight}`}>
        <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Showcase</span>
          <h2 className={`${styles.sectionTitle} gold-gradient-text`} style={{ fontFamily: 'var(--font-display)', fontSize: '3rem' }}>Selected Works</h2>
        </div>

        {initialProjects.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Showcase works are being updated. Check back shortly.
          </div>
        ) : siteSettings?.projectsLayout === 'grid' ? (
          <div className={styles.projectsGrid}>
            {initialProjects.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="luxury-card"
                style={{ display: 'flex', flexDirection: 'column', minHeight: '400px', cursor: 'pointer' }}
                onClick={() => setSelectedProject(p)}
              >
                <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', borderRadius: '4px', marginBottom: '24px' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flexGrow: 1 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {p.techStack.map(t => (
                    <span key={t} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border-light)', borderRadius: '30px' }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : siteSettings?.projectsLayout === 'carousel' ? (
          <div className={styles.carouselWrapper} style={{ overflow: 'hidden', cursor: 'grab' }}>
            <motion.div 
              drag="x" 
              dragConstraints={{ right: 0, left: carouselLeftConstraint }}
              style={{ display: 'flex', gap: '24px' }}
            >
              {initialProjects.map((p) => (
                <motion.div
                  key={p._id}
                  className="luxury-card"
                  style={{ flexShrink: 0, width: '340px', minHeight: '400px' }}
                  onClick={() => setSelectedProject(p)}
                >
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative', borderRadius: '4px', marginBottom: '20px' }}>
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : siteSettings?.projectsLayout === 'masonry' ? (
          <div style={{ columnCount: 3, columnGap: '32px' }} className="projects-masonry">
            {initialProjects.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ display: 'inline-block', width: '100%', marginBottom: '32px', cursor: 'pointer' }}
                onClick={() => setSelectedProject(p)}
                className="luxury-card"
              >
                <div style={{ overflow: 'hidden', borderRadius: '4px', marginBottom: '16px' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.description}</p>
              </motion.div>
            ))}
          </div>
        ) : siteSettings?.projectsLayout === 'stacked-list' ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {initialProjects.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => setSelectedProject(p)}
                style={{ display: 'flex', alignItems: 'center', padding: '32px 0', borderBottom: '1px solid var(--glass-border-light)', cursor: 'pointer', position: 'relative' }}
              >
                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--accent-gold)', width: '60px' }}>0{idx + 1}</span>
                <h3 style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>{p.title}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.techStack.slice(0, 3).join(' • ')}</span>
              </motion.div>
            ))}
          </div>
        ) : siteSettings?.projectsLayout === 'minimal-cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
            {initialProjects.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(p)}
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '350px', borderRadius: '4px' }}
                className="minimal-card-wrapper"
              >
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: 0, color: '#fff' }}>{p.title}</h4>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginTop: '4px' }}>View Case Study</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : siteSettings?.projectsLayout === 'split-parallax' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', padding: '40px 0' }}>
            {initialProjects.map((p, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: isEven ? 80 : 0 }}
                  whileInView={{ opacity: 1, y: isEven ? 40 : -20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  onClick={() => setSelectedProject(p)}
                  className="luxury-card"
                  style={{ cursor: 'pointer', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ height: '300px', overflow: 'hidden', borderRadius: '4px' }}>
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0 }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{p.description}</p>
                </motion.div>
              );
            })}
          </div>
        ) : siteSettings?.projectsLayout === 'minimal-list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {initialProjects.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(p)}
                style={{ cursor: 'pointer', padding: '16px 0', borderBottom: '1px solid var(--glass-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 300, margin: 0 }}>{p.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore →</span>
              </motion.div>
            ))}
          </div>
        ) : (
          /* asymmetric default layout */
          <div className={styles.projectsGallery}>
            {initialProjects.map((p, idx) => {
              const isLarge = idx % 3 === 0;
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: (idx % 3) * 0.2 }}
                  className={isLarge ? styles.projectCardLarge : styles.projectCardMedium}
                  onClick={() => setSelectedProject(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.projectImageWrapper}>
                    <img src={p.image} alt={p.title} className={styles.projectImage} />
                  </div>
                  <div className={styles.projectOverlay}>
                    <h3 className={styles.projectTitle}>{p.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', opacity: 0.9 }}>
                      {p.techStack.slice(0, 4).map(t => (
                        <span key={t} style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-champagne)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        </div>
      </section>

      {/* Skills / Expertise */}
      <section id="skills" className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Expertise</span>
          <h2 className={`${styles.sectionTitle} gold-gradient-text`}>Technical Proficiency</h2>
        </div>

        {siteSettings?.skillsLayout === 'grid-cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {initialSkills.map((s, idx) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-panel"
                style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -5, borderColor: 'var(--accent-gold)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>{s.name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', borderRadius: '100px', padding: '2px 10px' }}>{s.proficiency}%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.category}</div>
              </motion.div>
            ))}
          </div>
        ) : siteSettings?.skillsLayout === 'marquee' ? (
          <div style={{ position: 'relative', overflow: 'hidden', padding: '40px 0', borderTop: '1px solid var(--glass-border-light)', borderBottom: '1px solid var(--glass-border-light)' }}>
            <div style={{ display: 'flex', width: 'max-content', overflow: 'hidden' }}>
              <div className={styles.marqueeTrack} style={{ display: 'flex', gap: '40px' }}>
                {initialSkills.concat(initialSkills).concat(initialSkills).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-light)', padding: '16px 28px', borderRadius: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>{s.proficiency}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : siteSettings?.skillsLayout === 'minimal-tags' ? (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {initialSkills.map((s) => (
              <span key={s._id} style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', border: '1px solid var(--glass-border-light)', padding: '12px 24px', borderRadius: '30px', color: 'var(--accent-gold)', background: 'var(--bg-secondary)' }}>
                {s.name} • {s.proficiency}%
              </span>
            ))}
          </div>
        ) : siteSettings?.skillsLayout === 'timeline-steps' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {skillCategories.map((category, idx) => {
              const list = getSkillsByCategory(category);
              if (list.length === 0) return null;
              return (
                <div key={category} className="glass-panel" style={{ padding: '32px' }}>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>PHASE 0{idx+1}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '8px 0 20px', letterSpacing: '0.05em' }}>{category}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {list.map(s => (
                      <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 500 }}>{s.proficiency}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : siteSettings?.skillsLayout === 'two-column-list' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%' }} className="skills-two-column">
            {skillCategories.slice(0, 2).map((category) => {
              const list = getSkillsByCategory(category);
              return (
                <div key={category}>
                  <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.1rem', marginBottom: '24px', color: 'var(--accent-gold)' }}>{category}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {list.map(s => (
                        <tr key={s._id} style={{ borderBottom: '1px solid var(--glass-border-light)' }}>
                          <td style={{ padding: '16px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{s.name}</td>
                          <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '1rem', color: 'var(--text-secondary)' }}>{s.proficiency}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : siteSettings?.skillsLayout === 'circular-progress' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
            {initialSkills.map((s) => (
              <div key={s._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--glass-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{s.proficiency}%</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>{s.name}</div>
              </div>
            ))}
          </div>
        ) : siteSettings?.skillsLayout === 'badge-cloud' ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {initialSkills.map((s) => (
              <span key={s._id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          /* default category-progress list */
          <div className={styles.skillsContainer}>
            {skillCategories.map((category) => {
              const list = getSkillsByCategory(category);
              if (list.length === 0) return null;
              return (
                <div key={category} className={`${styles.skillGroup} glass-panel`}>
                  <h3 className={styles.skillGroupTitle}>{category}</h3>
                  {list.map(s => (
                    <div key={s._id} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span>{s.name}</span>
                        <span className="gold-text">{s.proficiency}%</span>
                      </div>
                      <div className={styles.skillBarContainer}>
                        <motion.div
                          className={styles.skillBarFill}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        </div>
      </section>

      {/* About Biography Section */}
      <section id="about" className={`${styles.section} ${styles.sectionLight}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="luxury-grid" />
        <div className={styles.sectionContent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Editorial Quote Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
          >
            <Quote size={60} color="var(--accent-gold)" style={{ opacity: 0.3, marginBottom: '20px' }} />
            <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', marginBottom: '24px', letterSpacing: '0.05em', lineHeight: 1.2 }}>
              {siteSettings?.aboutHeading || 'The Luxury Narrative'}
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', marginBottom: '32px' }} />
          </motion.div>

          {/* Biography Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.8', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: '24px' }}>
              {siteSettings?.aboutText || 'We build fast, bespoke web applications with luxury branding. Crafting premium architectures that are engineered for the absolute elite.'}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Every pixel is placed with intent, and every line of code is optimized for performance and aesthetic perfection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {initialTestimonials.length > 0 && (
        <section id="testimonials" className={`${styles.section} ${styles.sectionDark}`}>
          <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Endorsements</span>
            <h2 className={`${styles.sectionTitle} gold-gradient-text`}>Client Reviews</h2>
          </div>

          {siteSettings?.testimonialsLayout === 'carousel' ? (
            <div className={styles.carouselWrapper} style={{ overflow: 'hidden', cursor: 'grab' }}>
              <motion.div 
                drag="x"
                dragConstraints={{ right: 0, left: testLeftConstraint }}
                style={{ display: 'flex', gap: '24px' }}
              >
                {initialTestimonials.map((t) => (
                  <motion.div
                    key={t._id}
                    className="glass-panel"
                    style={{ flexShrink: 0, width: '340px', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}
                  >
                    <Quote size={30} color="var(--accent-gold)" style={{ opacity: 0.2 }} />
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', flexGrow: 1 }}>"{t.reviewText}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '16px' }}>
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                          <User size={16} color="var(--accent-gold)" />
                        </div>
                      )}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.role} at {t.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : siteSettings?.testimonialsLayout === 'masonry' ? (
            <div style={{ columnCount: 3, columnGap: '24px' }} className="testimonials-masonry">
              {initialTestimonials.map((t, idx) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="glass-panel"
                  style={{ display: 'inline-block', width: '100%', marginBottom: '24px', padding: '32px', position: 'relative' }}
                >
                  <Quote size={24} color="var(--accent-gold)" style={{ opacity: 0.15, marginBottom: '16px' }} />
                  <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '20px' }}>"{t.reviewText}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                        <User size={14} color="var(--accent-gold)" />
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.role} at {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : siteSettings?.testimonialsLayout === 'single-featured' ? (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', padding: '40px 0' }}>
              <Quote size={60} color="var(--accent-gold)" style={{ opacity: 0.15, margin: '0 auto 24px' }} />
              <motion.p 
                key={activeReviewIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '32px' }}
              >
                "{initialTestimonials[activeReviewIdx]?.reviewText}"
              </motion.p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                {initialTestimonials[activeReviewIdx]?.avatar && (
                  <img src={initialTestimonials[activeReviewIdx].avatar} alt={initialTestimonials[activeReviewIdx].name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{initialTestimonials[activeReviewIdx]?.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{initialTestimonials[activeReviewIdx]?.role} at {initialTestimonials[activeReviewIdx]?.company}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                <button 
                  onClick={() => setActiveReviewIdx((prev) => (prev === 0 ? initialTestimonials.length - 1 : prev - 1))}
                  className="btn-premium btn-premium-outline" style={{ padding: '8px 20px', borderRadius: '30px' }}
                >
                  ← Prev
                </button>
                <button 
                  onClick={() => setActiveReviewIdx((prev) => (prev === initialTestimonials.length - 1 ? 0 : prev + 1))}
                  className="btn-premium btn-premium-outline" style={{ padding: '8px 20px', borderRadius: '30px' }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : siteSettings?.testimonialsLayout === 'split-editorial' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '60px', alignItems: 'start' }}>
              <div>
                <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Voices of Trust</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontStyle: 'italic', marginTop: '12px', lineHeight: 1.2 }}>What elite clients say about our bespoke craft.</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {initialTestimonials.map((t, idx) => (
                  <div key={t._id} style={{ paddingBottom: '32px', borderBottom: '1px solid var(--glass-border-light)' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '16px' }}>"{t.reviewText}"</p>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{t.name} — <span style={{ color: 'var(--accent-gold)' }}>{t.role}, {t.company}</span></h4>
                  </div>
                ))}
              </div>
            </div>
          ) : siteSettings?.testimonialsLayout === 'bubble-chat' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px', margin: '0 auto' }}>
              {initialTestimonials.map((t, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={t._id} style={{ display: 'flex', justifyContent: isEven ? 'flex-start' : 'flex-end', width: '100%' }}>
                    <div style={{
                      maxWidth: '85%',
                      background: isEven ? 'var(--bg-secondary)' : 'rgba(var(--accent-gold-rgb), 0.08)',
                      border: isEven ? '1px solid var(--glass-border)' : '1px solid rgba(var(--accent-gold-rgb), 0.2)',
                      borderRadius: isEven ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', lineHeight: 1.6 }}>{t.reviewText}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {t.avatar && <img src={t.avatar} alt={t.name} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />}
                        <span style={{ fontSize: '0.8,rem', fontWeight: 600 }}>{t.name} ({t.company})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : siteSettings?.testimonialsLayout === 'minimalist-citations' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '800px', margin: '0 auto' }}>
              {initialTestimonials.map((t) => (
                <div key={t._id} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    "{t.reviewText}"
                  </p>
                  <div style={{ width: '30px', height: '1px', background: 'var(--accent-gold)', margin: '16px auto' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                    {t.name} — {t.role}, {t.company}
                  </span>
                </div>
              ))}
            </div>
          ) : siteSettings?.testimonialsLayout === 'infinite-scroll' ? (
            <div style={{ overflow: 'hidden', padding: '20px 0', borderTop: '1px solid var(--glass-border-light)', borderBottom: '1px solid var(--glass-border-light)' }}>
              <div style={{ display: 'flex', width: 'max-content' }}>
                <div className={styles.marqueeTrack} style={{ display: 'flex', gap: '40px', animationDuration: '40s' }}>
                  {initialTestimonials.concat(initialTestimonials).map((t, idx) => (
                    <div key={idx} style={{ width: '400px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-light)', padding: '32px', borderRadius: '8px', flexShrink: 0 }}>
                      <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '16px' }}>"{t.reviewText.slice(0, 140)}..."</p>
                      <h4 style={{ fontSize: '0.85rem', margin: 0 }}>{t.name} • <span style={{ color: 'var(--accent-gold)' }}>{t.company}</span></h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* default grid layout */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {initialTestimonials.map((t, idx) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    position: 'relative'
                  }}
                >
                  <Quote size={40} color="var(--accent-gold)" style={{ opacity: 0.2 }} />
                  
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic', flexGrow: 1 }}>
                    "{t.reviewText}"
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '24px' }}>
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-gold)' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                        <User size={20} color="var(--accent-gold)" />
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>{t.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role} at {t.company}</p>
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', top: '40px', right: '40px', display: 'flex', gap: '4px', color: 'var(--accent-gold)' }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </div>
        </section>
      )}

      {/* Journal Blogs Section */}
      <section id="blogs" className={`${styles.section} ${styles.sectionLight}`}>
        <div className={styles.sectionContent}>
          
          {initialBlogs.length > 0 && (!siteSettings?.blogsLayout || siteSettings.blogsLayout !== 'editorial-split-sticky') && (
            <div className={styles.sectionHeader} style={{ marginBottom: '48px' }}>
              <span className={styles.sectionTag}>Journal</span>
              <h2 className={`${styles.sectionTitle} gold-gradient-text`}>Curated Insights</h2>
            </div>
          )}

          {initialBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Articles are being curated. Check back shortly.
            </div>
          ) : siteSettings?.blogsLayout === 'editorial-rows' ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {initialBlogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedBlog(blog)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid var(--glass-border-light)', cursor: 'pointer' }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{blog.readTime}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '4px 0 0 0' }}>{blog.title}</h3>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>Read Article →</span>
                </motion.div>
              ))}
            </div>
          ) : siteSettings?.blogsLayout === 'cards-grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {initialBlogs.map((blog) => (
                <div key={blog._id} className="luxury-card" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: '400px' }} onClick={() => setSelectedBlog(blog)}>
                  {blog.image && (
                    <div style={{ height: '200px', overflow: 'hidden', borderRadius: '4px', marginBottom: '20px' }}>
                      <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{blog.readTime}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '8px 0 12px' }}>{blog.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flexGrow: 1 }}>{blog.excerpt}</p>
                </div>
              ))}
            </div>
          ) : siteSettings?.blogsLayout === 'magazine-split' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px' }}>
              {initialBlogs[0] && (
                <div onClick={() => setSelectedBlog(initialBlogs[0])} style={{ cursor: 'pointer' }}>
                  {initialBlogs[0].image && (
                    <div style={{ height: '380px', overflow: 'hidden', borderRadius: '4px', marginBottom: '24px' }}>
                      <img src={initialBlogs[0].image} alt={initialBlogs[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>FEATURED • {initialBlogs[0].readTime}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '12px 0 16px' }}>{initialBlogs[0].title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{initialBlogs[0].excerpt}</p>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {initialBlogs.slice(1).map((blog) => (
                  <div key={blog._id} onClick={() => setSelectedBlog(blog)} style={{ cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '20px' }}>
                    {blog.image && <img src={blog.image} alt={blog.title} style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>{blog.readTime}</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 0 0', fontSize: '1.05rem' }}>{blog.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : siteSettings?.blogsLayout === 'magazine-cover' ? (
            <div style={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setSelectedBlog(initialBlogs[0])}>
              {initialBlogs[0]?.image && <img src={initialBlogs[0].image} alt={initialBlogs[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '60px' }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cover Story • {initialBlogs[0]?.readTime}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', margin: '16px 0 24px', lineHeight: 1.1 }}>{initialBlogs[0]?.title}</h2>
                <p style={{ color: '#ccc', maxWidth: '600px', margin: 0, fontSize: '1.1rem', lineHeight: 1.7 }}>{initialBlogs[0]?.excerpt}</p>
              </div>
            </div>
          ) : siteSettings?.blogsLayout === 'asymmetric-cards' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {initialBlogs.map((blog, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={blog._id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', direction: isEven ? 'ltr' : 'rtl' }} onClick={() => setSelectedBlog(blog)}>
                    {blog.image && (
                      <div style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}>
                        <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ textAlign: 'left', direction: 'ltr', cursor: 'pointer' }}>
                      <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>{blog.readTime}</span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '12px 0 16px' }}>{blog.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{blog.excerpt}</p>
                      <span style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', borderBottom: '1px solid var(--accent-gold)', paddingBottom: '4px' }}>Read Thoughts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : siteSettings?.blogsLayout === 'horizontal-strip' ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px' }}>
              {initialBlogs.map((blog) => (
                <div key={blog._id} onClick={() => setSelectedBlog(blog)} style={{ flexShrink: 0, width: '280px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-light)', borderRadius: '4px', padding: '20px', cursor: 'pointer' }}>
                  {blog.image && <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px' }} />}
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem' }}>{blog.readTime}</span>
                  <h4 style={{ fontFamily: 'var(--font-display)', margin: '8px 0 0 0', fontSize: '1.1rem' }}>{blog.title}</h4>
                </div>
              ))}
            </div>
          ) : siteSettings?.blogsLayout === 'minimalist-list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {initialBlogs.map((blog) => (
                <div key={blog._id} onClick={() => setSelectedBlog(blog)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border-light)', cursor: 'pointer' }}>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', margin: 0, fontWeight: 300 }}>{blog.title}</h4>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>{blog.readTime} →</span>
                </div>
              ))}
            </div>
          ) : (
            /* default editorial-split-sticky layout */
            <div className={styles.blogsSplitSection}>
              
              {/* Left Column: Heading Info (sticky) */}
              <div style={{ position: 'sticky', top: '120px' }}>
                <span className={styles.sectionTag}>Journal</span>
                <h2 className={`${styles.sectionTitle} gold-gradient-text`} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1.1, marginBottom: '24px' }}>
                  Curated Insights
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '360px' }}>
                  Thought-leadership, technical reviews, and engineering logs from the absolute peak of modern web development.
                </p>
              </div>

              {/* Right Column: Rows List */}
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {initialBlogs.map((blog, idx) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      onClick={() => setSelectedBlog(blog)}
                      className={styles.blogEditorialRow}
                    >
                      <div className={styles.blogEditorialNumber}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      
                      <h3 className={styles.blogEditorialTitle}>
                        {blog.title}
                      </h3>
                      
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', width: '120px', textAlign: 'right' }}>
                        {blog.readTime}
                      </div>

                      {blog.image && (
                        <div className={styles.blogEditorialImageWrapper}>
                          <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative' }}>
        <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Connect</span>
          <h2 className={`${styles.sectionTitle} gold-gradient-text`}>Start a Conversation</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Socials & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Direct Contact</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                Interested in a collaboration or have a project in mind? Reach out directly or send a message using the form.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {siteSettings?.email && (
                <a href={`mailto:${siteSettings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-primary)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-light)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                    <div style={{ fontSize: '1rem' }}>{siteSettings.email}</div>
                  </div>
                </a>
              )}
              {siteSettings?.phone && (
                <a href={`tel:${siteSettings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-primary)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-light)' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</div>
                    <div style={{ fontSize: '1rem' }}>{siteSettings.phone}</div>
                  </div>
                </a>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Digital Presence</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                {siteSettings?.github && (
                  <a href={siteSettings.github} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-light)', color: 'var(--text-primary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border-light)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                    <Code size={20} />
                  </a>
                )}
                {siteSettings?.linkedin && (
                  <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-light)', color: 'var(--text-primary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border-light)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                    <Briefcase size={20} />
                  </a>
                )}
                {siteSettings?.whatsapp && (
                  <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-light)', color: 'var(--text-primary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border-light)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                    <MessageCircle size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '40px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your full name"
                  value={contactForm.name}
                  onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: 'var(--bg-primary)', border: '1px solid var(--glass-border-light)', padding: '12px 16px', color: 'var(--text-primary)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address"
                  value={contactForm.email}
                  onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: 'var(--bg-primary)', border: '1px solid var(--glass-border-light)', padding: '12px 16px', color: 'var(--text-primary)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="How can I help you?"
                  value={contactForm.subject}
                  onChange={e => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: 'var(--bg-primary)', border: '1px solid var(--glass-border-light)', padding: '12px 16px', color: 'var(--text-primary)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Message</label>
                <textarea 
                  required
                  placeholder="Describe your project, timeline, or query..."
                  value={contactForm.message}
                  onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', background: 'var(--bg-primary)', border: '1px solid var(--glass-border-light)', padding: '12px 16px', color: 'var(--text-primary)', borderRadius: '4px', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={contactStatus === 'loading'}
                className="btn-premium btn-premium-gold" 
                style={{ width: '100%', marginTop: '8px' }}
              >
                {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              {contactStatus === 'success' && (
                <div style={{ color: '#4caf50', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Message sent successfully!
                </div>
              )}
              {contactStatus === 'error' && (
                <div style={{ color: '#f44336', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>
                  Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-primary)', padding: '100px 40px 40px', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--glass-border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="massive-text gold-gradient-text" style={{ fontFamily: 'var(--font-display)', opacity: 0.1, position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
            {siteSettings?.logoText || 'AURA'}
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '60px', zIndex: 10 }}>
            {siteSettings?.navbarLinks && siteSettings.navbarLinks.length > 0 ? (
              siteSettings.navbarLinks.map(link => (
                <a key={link.label} href={link.url} style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <a href="#projects" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>Works</a>
                <a href="#skills" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>Expertise</a>
              </>
            )}
          </div>
          
          <div style={{ zIndex: 10, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderTop: '1px solid var(--glass-border-light)', paddingTop: '32px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {siteSettings?.footerText || `© ${new Date().getFullYear()} Aura Portfolio. All rights reserved.`}
            </p>
            <a href="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portal Access</a>
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
      {selectedBlog && (
        <div className={styles.projectModalOverlay} onClick={() => setSelectedBlog(null)}>
          <div className={styles.projectModalContent} style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setSelectedBlog(null)} className={styles.projectModalClose}>
                <X size={20} />
              </button>
              {selectedBlog.image && (
                <img src={selectedBlog.image} alt={selectedBlog.title} className={styles.projectModalImg} style={{ maxHeight: '350px', objectFit: 'cover' }} />
              )}
            </div>

            <div className={styles.projectModalMeta} style={{ padding: '40px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--accent-gold)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                <span>{selectedBlog.readTime}</span>
                <span>•</span>
                <span>{selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
              </div>
              
              <h2 className={`${styles.projectModalTitle} gold-gradient-text`} style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '24px' }}>
                {selectedBlog.title}
              </h2>
              
              <div 
                className="journal-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(selectedBlog.content) }}
                style={{ marginBottom: '32px' }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, borderTop: '1px solid var(--glass-border-light)', paddingTop: '20px' }}>
                {selectedBlog.tags.map(t => (
                  <span key={t} className={styles.projectTag}>#{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

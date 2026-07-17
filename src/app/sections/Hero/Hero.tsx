'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowRight, User } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';
import { ReactIcon, MongoIcon, NextIcon } from '../shared/icons';

interface HeroProps {
  siteSettings: ISetting | null;
}

function getHeroTitleLines(titleText: string) {
  const trimmed = (titleText || 'Building Digital Experiences').trim();
  const words = trimmed.split(' ');
  if (words.length <= 2) return { line1: words.join(' '), line2: '' };
  return { line1: words.slice(0, 2).join(' '), line2: words.slice(2).join(' ') };
}

export default function Hero({ siteSettings }: HeroProps) {
  const { line1, line2 } = getHeroTitleLines(siteSettings?.heroTitle || 'Building Digital Experiences');

  return (
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
              <div>{line1}</div>
              {line2 && <div className={styles.heroPremiumGradientWord}>{line2}</div>}
              <div className={styles.heroPremiumCursiveWord}>
                {siteSettings?.heroTitleCursive || 'That Make Impact'}
              </div>
            </h1>

            <p className={styles.heroPremiumDesc}>
              {siteSettings?.heroSubtitle || 'Full Stack Developer specializing in Shopify, Next.js & modern web technologies. I build scalable, high-performance websites and applications that bring ideas to life.'}
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

            {/* Core Pillars Bullet Row */}
            <div className={styles.heroPremiumBulletRow}>
              <div className={styles.heroPremiumBulletItem}>
                <span className={styles.heroPremiumBulletDot} />
                <span>Performance Optimized</span>
              </div>
              <div className={styles.heroPremiumBulletItem}>
                <span className={styles.heroPremiumBulletDot} />
                <span>Pixel-Perfect Aesthetics</span>
              </div>
              <div className={styles.heroPremiumBulletItem}>
                <span className={styles.heroPremiumBulletDot} />
                <span>Scalable Architecture</span>
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
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 500 500" fill="none">
              <path d="M80 120 C 180 80, 420 180, 400 360 C 380 430, 220 400, 160 460" stroke="url(#neon-line-grad)" strokeWidth="1.5" strokeOpacity="0.4" />
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
              {[...Array(6)].map((_, x) => [...Array(3)].map((_, y) => (
                <circle key={`dots1-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
              )))}
            </svg>
            <svg width="64" height="112" style={{ position: 'absolute', bottom: '15%', left: '-5%', opacity: 0.35, zIndex: 1 }} viewBox="0 0 64 112">
              {[...Array(3)].map((_, x) => [...Array(6)].map((_, y) => (
                <circle key={`dots2-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
              )))}
            </svg>
            <svg width="96" height="48" style={{ position: 'absolute', bottom: '35%', right: '-5%', opacity: 0.35, zIndex: 1 }} viewBox="0 0 96 48">
              {[...Array(5)].map((_, x) => [...Array(3)].map((_, y) => (
                <circle key={`dots3-${x}-${y}`} cx={16 + x * 16} cy={16 + y * 16} r={2} fill="#3b82f6" />
              )))}
            </svg>

            {/* Portrait Image Frame */}
            <div className={styles.heroPremiumPortraitFrame}>
              {siteSettings?.logoImage ? (
                <img src={siteSettings.logoImage} alt="Portrait" className={styles.heroPremiumPortrait} loading="eager" decoding="async" />
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
                <span>{siteSettings?.heroFreelanceText || 'Available for freelance'}</span>
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
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>shopify</span>
            </div>
            <div className={styles.heroPremiumLogoItem}>
              <NextIcon />
              <span>NEXT.js</span>
            </div>
            <div className={styles.heroPremiumLogoItem}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
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
  );
}

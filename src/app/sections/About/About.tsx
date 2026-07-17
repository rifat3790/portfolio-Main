'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Quote, User, ArrowRight } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';

interface AboutProps {
  siteSettings: ISetting | null;
}

export default function About({ siteSettings }: AboutProps) {
  return (
    <section id="about" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
      <div className={styles.sectionContent}>
        <div className={styles.aboutPremiumGrid}>

          {/* Left Side: Portrait & Graphic Badges */}
          <motion.div
            className={styles.aboutPortraitWrapper}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Slow Spinning Background Aura */}
            <div className={styles.aboutLuxuryAura} />

            {/* Dot Pattern Background Graphic */}
            <div className={styles.aboutDotPattern}>
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                <pattern id="dot-pattern-about" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
                <rect width="20" height="20" fill="url(#dot-pattern-about)" />
              </svg>
            </div>

            {/* Asymmetrical Arched Frame */}
            <div className={styles.aboutPortraitArchedFrame}>
              {siteSettings?.aboutImage ? (
                <img src={siteSettings.aboutImage} alt="Biography portrait" loading="lazy" decoding="async" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                  <User size={80} color="var(--text-muted)" />
                </div>
              )}
            </div>

            {/* Overlay 1: Floating Profile Card */}
            <motion.div
              className={styles.aboutFloatingProfileCard}
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.aboutActiveIndicator} />
                <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 700 }}>
                  {siteSettings?.aboutName || 'Refayet Hossen'}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {siteSettings?.aboutSignatureRole || 'Full Stack Developer'}
              </span>
            </motion.div>

            {/* Overlay 2: Floating Tech Stack Blueprint */}
            <motion.div
              className={styles.aboutFloatingTechCard}
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <Briefcase size={12} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Blueprint Stack</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className={styles.aboutTechTag}>React</span>
                <span className={styles.aboutTechTag}>Next.js</span>
                <span className={styles.aboutTechTag}>Mongoose</span>
                <span className={styles.aboutTechTag}>Node.js</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Copy & Info Cards */}
          <motion.div
            className={styles.aboutRightColumn}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            <span className={styles.aboutSubBadge}>
              {siteSettings?.aboutHeading || 'ABOUT ME'}
            </span>
            <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', marginBottom: '20px', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 800 }}>
              {siteSettings?.aboutTitle || 'Crafting Digital Experiences That Drive Real Results.'}
            </h2>

            <p style={{ fontSize: '0.98rem', color: '#94a3b8', lineHeight: '1.7', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: '24px' }}>
              {siteSettings?.aboutText || "I'm Md. Refayet Hossen, a Full Stack Developer with a passion for building modern, scalable, and user-centric web applications."}
            </p>

            {/* Bento feature list */}
            <div className={styles.aboutFeaturesList}>
              <div className={styles.aboutFeatureCard}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                </div>
                <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature1Title || 'Purpose-Driven'}</h4>
                <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature1Desc || 'I build with purpose, focused on solving real problems.'}</p>
              </div>

              <div className={styles.aboutFeatureCard}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>
                </div>
                <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature2Title || 'Modern & Scalable'}</h4>
                <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature2Desc || 'I use the latest technologies to build fast, secure applications.'}</p>
              </div>

              <div className={`${styles.aboutFeatureCard} ${styles.aboutFeatureCardFull}`}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature3Title || 'Collaborative Engineering'}</h4>
                  <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature3Desc || 'I believe in clear communication, direct collaboration, and rapid agile workflows to make ideas happen.'}</p>
                </div>
              </div>
            </div>

            {/* Signature Row & Quote Box */}
            <div className={styles.aboutSignatureWrapper}>
              <div className={styles.aboutSignatureLeft}>
                <div className={styles.aboutSignatureText}>{siteSettings?.aboutName || 'Refayet Hossen'}</div>
                <div className={styles.aboutSignatureRole}>{siteSettings?.aboutSignatureRole || 'Full Stack Developer'}</div>
              </div>

              <div className={styles.aboutQuoteBlock}>
                <Quote size={18} className={styles.aboutQuoteIcon} style={{ transform: 'rotate(180deg)', opacity: 0.6 }} />
                <p className={styles.aboutQuoteText}>
                  {siteSettings?.aboutQuoteText || 'My goal is to help businesses and individuals turn their ideas into powerful digital solutions.'}
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

        {/* Premium Philosophy / Core Values Showcase */}
        <div className={styles.aboutPhilosophyGrid}>
          <div className={styles.aboutPhilosophyItem}>
            <div className={styles.aboutPhilosophyHeader}>
              <span className={styles.aboutPhilosophyNumber}>01</span>
              <span className={styles.aboutPhilosophyLine} />
            </div>
            <h4 className={styles.aboutPhilosophyTitle}>{siteSettings?.aboutValue1Title || 'Quality First'}</h4>
            <p className={styles.aboutPhilosophyDesc}>{siteSettings?.aboutValue1Desc || 'Delivering pixel-perfect, premium code matching top international standards.'}</p>
          </div>

          <div className={styles.aboutPhilosophyItem}>
            <div className={styles.aboutPhilosophyHeader}>
              <span className={styles.aboutPhilosophyNumber}>02</span>
              <span className={styles.aboutPhilosophyLine} />
            </div>
            <h4 className={styles.aboutPhilosophyTitle}>{siteSettings?.aboutValue2Title || 'Agile & Responsive'}</h4>
            <p className={styles.aboutPhilosophyDesc}>{siteSettings?.aboutValue2Desc || 'Fast iterations, transparent updates, and super lightweight pages.'}</p>
          </div>

          <div className={styles.aboutPhilosophyItem}>
            <div className={styles.aboutPhilosophyHeader}>
              <span className={styles.aboutPhilosophyNumber}>03</span>
              <span className={styles.aboutPhilosophyLine} />
            </div>
            <h4 className={styles.aboutPhilosophyTitle}>{siteSettings?.aboutValue3Title || 'Clean & Scalable'}</h4>
            <p className={styles.aboutPhilosophyDesc}>{siteSettings?.aboutValue3Desc || 'Future-proof modular structures tailored for high-scale enterprise operations.'}</p>
          </div>

          <div className={styles.aboutPhilosophyItem}>
            <div className={styles.aboutPhilosophyHeader}>
              <span className={styles.aboutPhilosophyNumber}>04</span>
              <span className={styles.aboutPhilosophyLine} />
            </div>
            <h4 className={styles.aboutPhilosophyTitle}>{siteSettings?.aboutValue4Title || 'Client-Centric'}</h4>
            <p className={styles.aboutPhilosophyDesc}>{siteSettings?.aboutValue4Desc || 'Partnering closely to solve real-world problems and drive conversion rates.'}</p>
          </div>
        </div>

      </div>
    </section>
  );
}

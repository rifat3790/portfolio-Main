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
                <img src={siteSettings.aboutImage} alt="Biography portrait" loading="lazy" decoding="async" />
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
                  return (
                    <>
                      {title.substring(0, splitIndex)} <span className={styles.aboutGradientText} style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title.substring(splitIndex)}</span>
                    </>
                  );
                }
                return title;
              })()}
            </h2>

            <p style={{ fontSize: '0.98rem', color: '#94a3b8', lineHeight: '1.7', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: '24px' }}>
              {siteSettings?.aboutText || "I'm Md. Refayet Hossen, a Full Stack Developer with a passion for building modern, scalable, and user-centric web applications."}
            </p>

            {/* 3 columns feature list */}
            <div className={styles.aboutFeaturesList}>
              <div className={styles.aboutFeatureCard}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                </div>
                <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature1Title || 'Purpose-Driven'}</h4>
                <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature1Desc || 'I build with purpose, focused on solving real problems.'}</p>
              </div>

              <div className={styles.aboutFeatureCard}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>
                </div>
                <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature2Title || 'Modern & Scalable'}</h4>
                <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature2Desc || 'I use the latest technologies to build fast, secure applications.'}</p>
              </div>

              <div className={styles.aboutFeatureCard}>
                <div className={styles.aboutFeatureIconBox}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h4 className={styles.aboutFeatureTitle}>{siteSettings?.aboutFeature3Title || 'Collaborative'}</h4>
                <p className={styles.aboutFeatureDesc}>{siteSettings?.aboutFeature3Desc || 'I believe in clear communication and strong collaboration.'}</p>
              </div>
            </div>

            {/* Signature Row & Quote Box */}
            <div className={styles.aboutSignatureWrapper}>
              <div className={styles.aboutSignatureLeft}>
                <div className={styles.aboutSignatureText}>{siteSettings?.aboutName || 'Refayet Hossen'}</div>
                <div className={styles.aboutSignatureRole}>{siteSettings?.aboutSignatureRole || 'Full Stack Developer'}</div>
              </div>

              <div className={styles.aboutQuoteBlock}>
                <Quote size={20} className={styles.aboutQuoteIcon} style={{ transform: 'rotate(180deg)', opacity: 0.6 }} />
                <p className={styles.aboutQuoteText}>
                  {siteSettings?.aboutQuoteText || 'My goal is to help businesses and individuals turn their ideas into powerful digital solutions that make a difference.'}
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

        {/* Premium Philosophy / Core Values Showcase (Replaces duplicate stats row) */}
        <div className={styles.aboutStatsRow} style={{ marginTop: '48px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border-light)', borderRadius: '20px' }}>
          <div className={styles.aboutStatItem} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>01 / QUALITY</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{siteSettings?.aboutValue1Title || 'Quality First'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{siteSettings?.aboutValue1Desc || 'Delivering pixel-perfect, premium code matching top international standards.'}</p>
          </div>

          <div className={styles.aboutStatItem} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>02 / SPEED</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{siteSettings?.aboutValue2Title || 'Agile & Responsive'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{siteSettings?.aboutValue2Desc || 'Fast iterations, transparent updates, and super lightweight pages.'}</p>
          </div>

          <div className={styles.aboutStatItem} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>03 / SECURITY</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{siteSettings?.aboutValue3Title || 'Clean & Scalable'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{siteSettings?.aboutValue3Desc || 'Future-proof modular structures tailored for high-scale enterprise operations.'}</p>
          </div>

          <div className={styles.aboutStatItem} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>04 / VISION</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{siteSettings?.aboutValue4Title || 'Client-Centric'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{siteSettings?.aboutValue4Desc || 'Partnering closely to solve real-world problems and drive conversion rates.'}</p>
          </div>
        </div>

      </div>
    </section>
  );
}

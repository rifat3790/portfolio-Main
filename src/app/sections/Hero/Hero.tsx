'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, User } from 'lucide-react';
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
  const { line1, line2 } = getHeroTitleLines(siteSettings?.heroTitle || 'Refayet Hossen');

  return (
    <section
      className={styles.heroPremium}
      style={{
        backgroundImage: siteSettings?.heroBannerImage ? `url(${siteSettings.heroBannerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {siteSettings?.heroBannerImage && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(3, 5, 12, 0.85)', zIndex: 1 }} />
      )}

      <div className={styles.heroPremiumContent} style={{ position: 'relative', zIndex: 10 }}>
        <div className={styles.heroPremiumGrid}>

          {/* Left Column: Text Content and Actions */}
          <motion.div
            className={styles.heroPremiumLeft}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.heroPremiumTagline}>
              {siteSettings?.heroTagline || "HI, I'M"}
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
              {siteSettings?.heroSubtitle || 'I build fast, scalable and modern web applications that help businesses grow and make a real impact in the digital world.'}
            </p>

            <div className={styles.heroPremiumButtons}>
              <a href={siteSettings?.heroBtn1Url || '#contact'} className="btn-premium btn-premium-gold" style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '100px', background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', border: 'none', gap: 8 }}>
                {siteSettings?.heroBtn1Text || "Let's Work Together"} <ChevronRight size={16} />
              </a>
              <a
                href={siteSettings?.aboutCvFile ? siteSettings.aboutCvFile : (siteSettings?.aboutCvUrl || '#')}
                download={siteSettings?.aboutCvFile ? (siteSettings.aboutCvFileName || 'Md_Refayet_Hossen_CV.pdf') : undefined}
                target="_blank"
                rel="noreferrer"
                className="btn-premium btn-premium-outline"
                style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--glass-bg)', border: '1px solid var(--glass-border-light)', color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{siteSettings?.aboutCvText || 'Download CV'}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#818cf8', display: 'inline-block', boxShadow: '0 0 10px #818cf8' }} />
              </a>
            </div>

            {/* Premium Stat Row (directly in Hero below buttons as requested in mockup) */}
            <div className={styles.aboutStatsRow} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border-light)', borderRadius: '16px', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{siteSettings?.stat1Value || '5+'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{siteSettings?.stat1Label || 'Years Experience'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{siteSettings?.stat2Value || '50+'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{siteSettings?.stat2Label || 'Projects Completed'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{siteSettings?.stat3Value || '20+'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{siteSettings?.stat3Label || 'Happy Clients'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{siteSettings?.stat4Value || '100%'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{siteSettings?.stat4Label || 'Satisfaction'}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase configured specifically for transparent/overlay portrait placement */}
          <motion.div
            className={styles.heroPremiumVisual}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            style={{ minHeight: '520px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            {/* Glowing Neon Blue Ring Background */}
            <div
              style={{
                position: 'absolute',
                width: '460px',
                height: '460px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129, 140, 248, 0.16) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 70%)',
                border: '1.5px solid rgba(129, 140, 248, 0.25)',
                boxShadow: '0 0 60px rgba(129, 140, 248, 0.15)',
                zIndex: 0,
                transform: 'translate3d(0,0,0)',
                animation: 'slowSpin 35s linear infinite',
              }}
            />

            {/* Main Portrait Frame - Masked inside a perfect responsive circle */}
            <div
              style={{
                width: 'clamp(260px, 35vw, 380px)',
                height: 'clamp(260px, 35vw, 380px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(129, 140, 248, 0.3)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 2px 8px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'relative',
                background: 'rgba(7, 8, 15, 0.5)',
                padding: 0,
                margin: 0,
              }}
            >
              {siteSettings?.logoImage ? (
                <img
                  src={siteSettings.logoImage}
                  alt="Refayet Hossen Portrait"
                  loading="eager"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate3d(0, 0, 0)',
                    zIndex: 2,
                    display: 'block',
                    padding: 0,
                    margin: 0,
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090b14' }}>
                  <User size={80} color="#818cf8" style={{ opacity: 0.3 }} />
                </div>
              )}
            </div>

            {/* ─── OVERLAY FLOATING WIDGETS (Matches the mockup layout perfectly) ─── */}

            {/* Overlay 1: Available for Freelance badge (Left Side) */}
            <motion.div
              className={styles.heroPremiumFreelanceBadge}
              whileHover={{ scale: 1.05 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{
                background: 'rgba(7, 8, 15, 0.85)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                padding: '12px 20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                textAlign: 'left',
                maxWidth: '240px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', position: 'relative', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'ping 1.6s infinite', opacity: 0.8 }} />
                </span>
                <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 700 }}>Available for Freelance</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Let's build something amazing!</span>
            </motion.div>

            {/* Overlay 2: Floating code tag Badge (Top-Left Area) */}
            <motion.div
              className={styles.heroPremiumCodeBadge}
              whileHover={{ scale: 1.1, rotate: -5 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              style={{
                background: 'rgba(7, 8, 15, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
                zIndex: 10,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Code size={22} />
            </motion.div>

            {/* Overlay 3: 100% Client Satisfaction Badge (Bottom-Left Area) */}
            <motion.div
              className={styles.heroPremiumSatisfactionCard}
              whileHover={{ scale: 1.05 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75 }}
              style={{
                background: 'rgba(7, 8, 15, 0.85)',
                border: '1px solid rgba(129, 140, 248, 0.2)',
                padding: '12px 18px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
                zIndex: 10,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                <ShieldCheck size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>100%</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Client Satisfaction</span>
              </div>
            </motion.div>

            {/* Overlay 4: Futuristic code window Card (Right Side) */}
            <motion.div
              className={styles.heroPremiumSpecsCard}
              whileHover={{ scale: 1.03 }}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{
                background: 'rgba(7, 8, 15, 0.9)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55)',
                zIndex: 10,
                maxWidth: '300px',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Window Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '6px', fontFamily: 'monospace' }}>success.js</span>
              </div>
              {/* Window Body (Code) */}
              <pre style={{ margin: 0, fontSize: '0.76rem', color: '#e2e8f0', fontFamily: 'monospace', textAlign: 'left', lineHeight: 1.45 }}>
                <span style={{ color: '#569cd6' }}>const</span> success = <span style={{ color: '#569cd6' }}>await</span> createAmazingThings({`{`}
                {`\n  `}ideas: <span style={{ color: '#4fc1ff' }}>true</span>,
                {`\n  `}code: <span style={{ color: '#ce9178' }}>"clean"</span>,
                {`\n  `}design: <span style={{ color: '#ce9178' }}>"beautiful"</span>,
                {`\n  `}impact: <span style={{ color: '#ce9178' }}>"global"</span>
                {`\n`}{`}`});
                {`\n\n`}<span style={{ color: '#4fc1ff' }}>console</span>.log(<span style={{ color: '#ce9178' }}>"Let's Build Together!"</span>);
              </pre>
            </motion.div>

          </motion.div>

        </div>

        {/* Logos Bar spanning full width under the grid */}
        <div className={styles.heroPremiumLogosBar} style={{ marginTop: '60px' }}>
          <div className={styles.heroPremiumLogosTitle}>Trusted by businesses worldwide</div>
          <div className={styles.heroPremiumLogosContainer}>
            <div className={styles.heroPremiumLogoItem}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>shopify</span>
            </div>
            <div className={styles.heroPremiumLogoItem}>
              <NextIcon />
              <span>NEXT.js</span>
            </div>
            <div className={styles.heroPremiumLogoItem}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
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

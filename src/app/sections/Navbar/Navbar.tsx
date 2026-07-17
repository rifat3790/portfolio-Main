'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';

interface NavbarProps {
  siteSettings: ISetting | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export default function Navbar({ siteSettings, isDrawerOpen, setIsDrawerOpen }: NavbarProps) {
  return (
    <>
      <header className={styles.floatingNavbar}>
        <div className={styles.navPill}>
          <a href="#" className={styles.navBrand}>
            <div className={styles.navLogoBox}>
              <span>&lt;/&gt;</span>
            </div>
            <div className={styles.navBrandInfo}>
              <div className={styles.navBrandName}>{siteSettings?.logoText || 'RIFAT'}</div>
              <div className={styles.navBrandRole}>{siteSettings?.headerFooterRole || 'Full Stack Developer'}</div>
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
              background: 'rgba(6, 6, 8, 0.98)',
              backdropFilter: 'blur(30px)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{ position: 'absolute', top: '40px', right: '5vw', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
              aria-label="Close menu"
            >
              <X size={36} />
            </button>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '90%', maxWidth: '420px', margin: '0 auto', textAlign: 'left', padding: '20px' }}>
              {(siteSettings?.navbarLinks || []).map((link, idx) => {
                const stepNum = String(idx + 1).padStart(2, '0');
                const linkSubtitles: { [key: string]: string } = {
                  'projects': 'Selected works & case studies',
                  'skills': 'Technical expertise & workflows',
                  'about': 'Philosophy, bio & background',
                  'curation': 'Creative story & achievements',
                  'journal': 'Thoughts, tutorials & learnings',
                  'blogs': 'Thoughts, tutorials & learnings',
                  'testimonials': 'Client feedback & references',
                  'experience': 'Professional path & timeline'
                };
                const urlClean = link.url.replace('#', '').toLowerCase();
                const sub = linkSubtitles[urlClean] || 'Explore segment details';

                return (
                  <motion.a
                    key={idx}
                    href={link.url}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 8 }}
                    transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setIsDrawerOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '8px',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      const titleSpan = e.currentTarget.querySelector('.nav-drawer-link-title') as HTMLElement;
                      if (titleSpan) titleSpan.style.color = 'var(--accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      const titleSpan = e.currentTarget.querySelector('.nav-drawer-link-title') as HTMLElement;
                      if (titleSpan) titleSpan.style.color = 'var(--text-primary)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)', color: 'var(--accent-gold)', opacity: 0.8, letterSpacing: '0.1em' }}>{stepNum}</span>
                      <span className="nav-drawer-link-title" style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        transition: 'color 0.3s'
                      }}>{link.label}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: '2px', paddingLeft: '28px' }}>{sub}</span>
                  </motion.a>
                );
              })}

              <motion.a
                href="#contact"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 8 }}
                transition={{ delay: (siteSettings?.navbarLinks?.length || 0) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '8px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  const titleSpan = e.currentTarget.querySelector('.nav-drawer-link-title-contact') as HTMLElement;
                  if (titleSpan) titleSpan.style.color = 'var(--accent-gold)';
                }}
                onMouseLeave={(e) => {
                  const titleSpan = e.currentTarget.querySelector('.nav-drawer-link-title-contact') as HTMLElement;
                  if (titleSpan) titleSpan.style.color = 'var(--text-primary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)', color: 'var(--accent-gold)', opacity: 0.8, letterSpacing: '0.1em' }}>
                    {String((siteSettings?.navbarLinks?.length || 0) + 1).padStart(2, '0')}
                  </span>
                  <span className="nav-drawer-link-title-contact" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    transition: 'color 0.3s'
                  }}>{'Contact'}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: '2px', paddingLeft: '28px' }}>{'Start a project collaboration'}</span>
              </motion.a>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                marginTop: '32px',
                textAlign: 'center',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {siteSettings?.email && <div>{siteSettings.email}</div>}
              {siteSettings?.aboutLocation && <div>{siteSettings.aboutLocation}</div>}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '6px' }}>
                {siteSettings?.github && <a href={siteSettings.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>GitHub</a>}
                {siteSettings?.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>LinkedIn</a>}
                {siteSettings?.whatsapp && <a href={`https://wa.me/${siteSettings.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>WhatsApp</a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

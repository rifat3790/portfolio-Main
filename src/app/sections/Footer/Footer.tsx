'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, ChevronRight, ChevronUp } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';

interface FooterProps {
  siteSettings: ISetting | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus(data.alreadySubscribed ? 'already' : 'success');
        if (!data.alreadySubscribed) setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 4000);
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
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
                <div className={styles.footerLogoSubtitle}>{siteSettings?.headerFooterRole || 'Full Stack Developer'}</div>
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
            {newsletterStatus === 'success' && <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '8px', fontWeight: 500 }}>✓ Successfully subscribed!</div>}
            {newsletterStatus === 'already' && <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '8px', fontWeight: 500 }}>⚠ Already subscribed.</div>}
            {newsletterStatus === 'error' && <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '8px', fontWeight: 500 }}>✗ Subscription failed.</div>}
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.footerLinksCol}>
            <div className={styles.footerColHeader}>
              <ChevronRight size={14} className={styles.footerColHeaderIcon} />
              <h4 className={styles.footerColTitle}>Quick Links</h4>
            </div>
            <nav className={styles.footerLinksList}>
              {['about', 'services', 'skills', 'projects', 'experience', 'blogs', 'contact'].map(link => (
                <a key={link} href={`#${link}`} className={styles.footerLinkItem}>
                  <ChevronRight size={12} className={styles.footerLinkItemChevron} />
                  <span>{link.charAt(0).toUpperCase() + link.slice(1)}{link === 'about' ? ' Me' : ''}{link === 'blogs' ? 'Blog' : ''}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Services */}
          <div className={styles.footerLinksCol}>
            <div className={styles.footerColHeader}>
              <ChevronRight size={14} className={styles.footerColHeaderIcon} />
              <h4 className={styles.footerColTitle}>Services</h4>
            </div>
            <div className={styles.footerLinksList}>
              {['Shopify Development', 'Full Stack Development', 'UI/UX Design', 'SEO Optimization', 'Performance Optimization', 'API Integration', 'Maintenance & Support', 'Consulting'].map(svc => (
                <a key={svc} href="#services" className={styles.footerLinkItem}>{svc}</a>
              ))}
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
                <span className={styles.footerContactText}>{siteSettings?.aboutEmail || siteSettings?.email || 'rifat@example.com'}</span>
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
            <div className={styles.footerMapBg}>
              <svg viewBox="0 0 100 50" width="100%" height="auto" opacity={0.35}>
                <path d="M10,15 A2,2 0 1,1 10,15.1 Z M25,12 A1.5,1.5 0 1,1 25,12.1 Z M45,22 A2.5,2.5 0 1,1 45,22.1 Z M75,18 A2,2 0 1,1 75,18.1 Z M85,32 A2.2,2.2 0 1,1 85,32.1 Z M30,35 A2,2 0 1,1 30,35.1 Z M60,40 A1.8,1.8 0 1,1 60,40.1 Z M55,10 A2,2 0 1,1 55,10.1 Z M90,15 A2,2 0 1,1 90,15.1 Z M15,42 A1.5,1.5 0 1,1 15,42.1 Z" fill="#60a5fa" />
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
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
  );
}

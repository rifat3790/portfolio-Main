'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, User, Briefcase } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, ITestimonial } from '../shared/types';

interface TestimonialsProps {
  siteSettings: ISetting | null;
  initialTestimonials: ITestimonial[];
}

export default function Testimonials({ siteSettings, initialTestimonials }: TestimonialsProps) {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  if (!initialTestimonials || initialTestimonials.length === 0) return null;

  return (
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
          <button
            type="button"
            onClick={() => setActiveReviewIdx((prev) => (prev === 0 ? initialTestimonials.length - 1 : prev - 1))}
            className={`${styles.testimonialArrowBtn} ${styles.testimonialArrowPrev}`}
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={24} />
          </button>

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
                <div className={styles.testimonialCardQuoteSign}>"</div>
                <p className={styles.testimonialCardText}>"{t.reviewText}"</p>
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
                      {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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
              <div className={styles.aboutStatVal}>{siteSettings?.testiStat1Value || '5.0'}</div>
              <div className={styles.aboutStatLabel}>{siteSettings?.testiStat1Label || 'Average Rating'}</div>
            </div>
          </div>
          <div className={styles.aboutStatItem}>
            <div className={styles.aboutStatIcon}><Briefcase size={20} /></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.aboutStatVal}>{siteSettings?.testiStat2Value || '98%'}</div>
              <div className={styles.aboutStatLabel}>{siteSettings?.testiStat2Label || 'Client Retention'}</div>
            </div>
          </div>
          <div className={styles.aboutStatItem}>
            <div className={styles.aboutStatIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
            <div className={styles.aboutStatInfo}>
              <div className={styles.aboutStatVal}>{siteSettings?.testiStat3Value || '100%'}</div>
              <div className={styles.aboutStatLabel}>{siteSettings?.testiStat3Label || 'Client Trust'}</div>
            </div>
          </div>
          <div className={styles.aboutStatItem}>
            <div className={styles.aboutStatIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <div className={styles.aboutStatInfo}>
              <div className={styles.aboutStatVal}>{siteSettings?.testiStat4Value || 'Direct'}</div>
              <div className={styles.aboutStatLabel}>{siteSettings?.testiStat4Label || 'Collaboration'}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

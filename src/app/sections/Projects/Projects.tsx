'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layout, Code, Briefcase, Cpu, BookOpen, Layers } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, IProject } from '../shared/types';

interface ProjectsProps {
  siteSettings: ISetting | null;
  initialProjects: IProject[];
  onSelectProject: (project: IProject) => void;
}

function renderCategoryIcon(cat: string) {
  switch (cat.toLowerCase()) {
    case 'all projects': return <Layout size={15} />;
    case 'web applications': case 'web app': return <Code size={15} />;
    case 'e-commerce': case 'shopify': return <Briefcase size={15} />;
    case 'dashboard': return <Cpu size={15} />;
    case 'landing page': return <BookOpen size={15} />;
    default: return <Layers size={15} />;
  }
}

export default function Projects({ siteSettings, initialProjects, onSelectProject }: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [visibleProjectsLimit, setVisibleProjectsLimit] = useState(8);

  const categories = siteSettings?.projectCategories
    ? ['All Projects', ...siteSettings.projectCategories.split(',').map(c => c.trim())]
    : ['All Projects', 'Web Applications', 'E-Commerce', 'Dashboard', 'Landing Page', 'Other'];

  const filtered = initialProjects.filter(p => {
    if (selectedCategory === 'All Projects') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });
  const toDisplay = filtered.slice(0, visibleProjectsLimit);

  return (
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
            {filtered.length > visibleProjectsLimit && (
              <button
                onClick={() => setVisibleProjectsLimit(filtered.length)}
                className="btn-premium btn-premium-gold"
                style={{ width: 'fit-content', padding: '12px 28px', fontSize: '0.85rem' }}
              >
                View All Projects <ArrowRight size={14} style={{ marginLeft: 8 }} />
              </button>
            )}
          </div>

          <div className={styles.projectHeaderRight}>
            <div className={styles.projectStatsOverlay}>
              <div className={styles.projectStatItem}>
                <span className={styles.projectStatValue}>{siteSettings?.projectStat1Value || 'Pixel'}</span>
                <span className={styles.projectStatLabel}>{siteSettings?.projectStat1Label || 'Precision UI'}</span>
              </div>
              <div className={styles.projectStatItem}>
                <span className={styles.projectStatValue}>{siteSettings?.projectStat2Value || 'Fluid'}</span>
                <span className={styles.projectStatLabel}>{siteSettings?.projectStat2Label || 'Animations'}</span>
              </div>
              <div className={styles.projectStatItem}>
                <span className={styles.projectStatValue}>{siteSettings?.projectStat3Value || 'Mobile'}</span>
                <span className={styles.projectStatLabel}>{siteSettings?.projectStat3Label || 'First Design'}</span>
              </div>
              <div className={styles.projectStatItem}>
                <span className={styles.projectStatValue}>{siteSettings?.projectStat4Value || 'SEO'}</span>
                <span className={styles.projectStatLabel}>{siteSettings?.projectStat4Label || 'Optimized (A+)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className={styles.projectCategoryBar}>
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleProjectsLimit(8); }}
                className={`${styles.projectCategoryBtn} ${isActive ? styles.projectCategoryBtnActive : ''}`}
              >
                {renderCategoryIcon(cat)}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
            No projects found in this category. Check back shortly.
          </div>
        ) : (
          <>
            <div
              style={{ display: 'grid', gridTemplateColumns: `repeat(${siteSettings?.projectsPerRow || 3}, 1fr)` }}
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
                  onClick={() => onSelectProject(p)}
                >
                  <div className={styles.projectCardImageWrapper}>
                    <img src={p.image} alt={p.title} className={styles.projectCardImage} loading="lazy" decoding="async" />
                    <div className={styles.projectCardIndex}>{(idx + 1).toString().padStart(2, '0')}</div>
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
                      <div className={styles.projectCardCircleBtn}><ArrowRight size={16} /></div>
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
        )}

        {/* Bottom Collaboration Banner */}
        <div className={styles.projectBottomBanner}>
          <div className={styles.projectBottomLeft}>
            <div className={styles.projectBottomIcon}><Sparkles size={24} /></div>
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
  );
}

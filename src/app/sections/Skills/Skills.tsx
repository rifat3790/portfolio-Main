'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Layout, Database, Globe, Cpu, Code, CheckCircle2 } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, ISkill } from '../shared/types';

interface SkillsProps {
  siteSettings: ISetting | null;
  initialSkills: ISkill[];
}

function getFrontendSkills(skills: ISkill[]) {
  return skills.filter(s => { const cat = (s.category || '').toLowerCase(); return cat.includes('front') || cat === 'ui' || cat === 'client'; });
}
function getBackendSkills(skills: ISkill[]) {
  return skills.filter(s => { const cat = (s.category || '').toLowerCase(); return cat.includes('back') || cat.includes('db') || cat.includes('server') || cat === 'database'; });
}
function getToolsSkills(skills: ISkill[]) {
  return skills.filter(s => { const cat = (s.category || '').toLowerCase(); return cat.includes('tool') || cat.includes('platform') || cat.includes('design') || cat.includes('figma') || cat.includes('git') || cat === 'other' || cat.includes('other/tools') || cat.includes('tools/other'); });
}
function getCompetencySkills(skills: ISkill[]) {
  return skills.filter(s => { const cat = (s.category || '').toLowerCase(); return cat.includes('competenc') || cat.includes('core'); });
}
function getOtherSkills(skills: ISkill[]) {
  return skills.filter(s => { const cat = (s.category || '').toLowerCase(); return cat.includes('other tech') || cat === 'other-tech' || cat === 'badge' || cat === 'cloud' || cat === 'other' || cat === 'other technologies'; });
}

export default function Skills({ siteSettings, initialSkills }: SkillsProps) {
  const frontend = getFrontendSkills(initialSkills);
  const backend = getBackendSkills(initialSkills);
  const tools = getToolsSkills(initialSkills);
  const competency = getCompetencySkills(initialSkills);
  const other = getOtherSkills(initialSkills);

  return (
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

          {/* Skills Overview Card (Replaces duplicate stats) */}
          <div className={styles.skillsOverviewCard}>
            <div className={styles.skillsOverviewGraphicBox}>
              <div className={styles.skillsOverviewCircle}>
                <div className={styles.skillsOverviewCircleInner}><CheckCircle2 size={24} style={{ color: '#818cf8' }} /></div>
              </div>
            </div>
            <div className={styles.skillsOverviewInfo}>
              <div className={styles.skillsOverviewHeader}>Coding Standards</div>
              <div className={styles.skillsOverviewStatsGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>✓ Clean Architecture</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SOLID & DRY code styling</span>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>✓ Speed Optimized</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fluid 120 FPS & hardware accelerated</span>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>✓ SEO Architecture</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Semantic HTML5 structure</span>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>✓ Version Controlled</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Continuous delivery with Git</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 columns Grid */}
        <div className={styles.skillsCategoriesGrid}>
          {/* Column 1: Frontend */}
          <div className={styles.skillsCategoryCard}>
            <div className={styles.skillsCategoryHeader}>
              <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconFrontend}`}><Layout size={18} /></div>
              <h3 className={styles.skillsCategoryTitle}>Frontend Development</h3>
            </div>
            <div className={styles.skillsList}>
              {frontend.map((s) => (
                <div key={s._id} className={styles.skillItem}>
                  <div className={styles.skillLabelRow}><span>{s.name}</span><span className={styles.skillValue}>{s.proficiency}%</span></div>
                  <div className={styles.skillProgressBarBg}>
                    <motion.div className={`${styles.skillProgressBarFill} ${styles.skillFillFrontend}`} initial={{ width: 0 }} whileInView={{ width: `${s.proficiency}%` }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
              {frontend.length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No frontend skills added.</span>}
            </div>
          </div>

          {/* Column 2: Backend */}
          <div className={styles.skillsCategoryCard}>
            <div className={styles.skillsCategoryHeader}>
              <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconBackend}`}><Database size={18} /></div>
              <h3 className={styles.skillsCategoryTitle}>Backend Development</h3>
            </div>
            <div className={styles.skillsList}>
              {backend.map((s) => (
                <div key={s._id} className={styles.skillItem}>
                  <div className={styles.skillLabelRow}><span>{s.name}</span><span className={styles.skillValue}>{s.proficiency}%</span></div>
                  <div className={styles.skillProgressBarBg}>
                    <motion.div className={`${styles.skillProgressBarFill} ${styles.skillFillBackend}`} initial={{ width: 0 }} whileInView={{ width: `${s.proficiency}%` }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
              {backend.length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No backend skills added.</span>}
            </div>
          </div>

          {/* Column 3: Tools */}
          <div className={styles.skillsCategoryCard}>
            <div className={styles.skillsCategoryHeader}>
              <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconTools}`}><Globe size={18} /></div>
              <h3 className={styles.skillsCategoryTitle}>Tools & Platforms</h3>
            </div>
            <div className={styles.skillsList}>
              {tools.map((s) => (
                <div key={s._id} className={styles.skillItem}>
                  <div className={styles.skillLabelRow}><span>{s.name}</span><span className={styles.skillValue}>{s.proficiency}%</span></div>
                  <div className={styles.skillProgressBarBg}>
                    <motion.div className={`${styles.skillProgressBarFill} ${styles.skillFillTools}`} initial={{ width: 0 }} whileInView={{ width: `${s.proficiency}%` }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
              {tools.length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No tools/platforms added.</span>}
            </div>
          </div>

          {/* Column 4: Core Competencies */}
          <div className={styles.skillsCategoryCard}>
            <div className={styles.skillsCategoryHeader}>
              <div className={`${styles.skillsCategoryIconCard} ${styles.skillsCategoryIconCore}`}><Cpu size={18} /></div>
              <h3 className={styles.skillsCategoryTitle}>Core Competencies</h3>
            </div>
            <div className={styles.compList}>
              {competency.map((s) => (
                <div key={s._id} className={styles.compItem}><CheckCircle2 size={16} className={styles.compIcon} /><span>{s.name}</span></div>
              ))}
              {competency.length === 0 && (
                <>
                  {['Problem Solving', 'Clean & Efficient Code', 'Scalable Architecture', 'Performance Optimization', 'Responsive Design', 'Agile & Team Collaboration'].map(item => (
                    <div key={item} className={styles.compItem}><CheckCircle2 size={16} className={styles.compIcon} /><span>{item}</span></div>
                  ))}
                </>
              )}
            </div>
            <div className={styles.compGraphicWrapper}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom other technologies ticker/badges */}
        <div className={styles.otherTechsBar}>
          <div className={styles.otherTechsTitle}>Other Technologies I Work With</div>
          <div className={styles.otherTechsContainer}>
            {other.map((s) => <div key={s._id} className={styles.otherTechBadge}>{s.name}</div>)}
            {other.length === 0 && ['TypeScript', 'Redux', 'GraphQL', 'JWT', 'Sass', 'Docker', 'Cloudinary', 'Stripe'].map(t => (
              <div key={t} className={styles.otherTechBadge}>{t}</div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

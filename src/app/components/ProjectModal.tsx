'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Code, Check, Briefcase, Calendar, Info, Globe } from 'lucide-react';
import styles from '../home.module.css';

interface IProject {
  _id: string;
  title: string;
  description: string;
  richText?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  category?: string;
  screenshots?: string[];
  role?: string;
  duration?: string;
  projectType?: string;
  keyFeatures?: string;
  isFeatured?: boolean;
}

interface ProjectModalProps {
  project: IProject;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const screenshots = [project.image, ...(project.screenshots || [])].filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);

  const features = project.keyFeatures
    ? project.keyFeatures.split(/[,\n]/).map(f => f.trim()).filter(Boolean)
    : [
        'User authentication & authorization',
        'Product listing with advanced filtering',
        'Shopping cart & checkout with Stripe',
        'Order management & user dashboard',
        'Responsive design & dark mode',
        'SEO optimized & high performance'
      ];

  return (
    <div className={styles.projModalOverlay} onClick={onClose}>
      <div className={styles.projModalBox} onClick={e => e.stopPropagation()}>
        
        {/* Header Area */}
        <div className={styles.projModalHeader}>
          <button onClick={onClose} className={styles.projModalClose} aria-label="Close modal">
            <X size={18} />
          </button>

          <div className={styles.projModalMetaRow}>
            {project.isFeatured && (
              <span className={styles.projModalFeaturedPill}>Featured Project</span>
            )}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {project.category || 'Web Applications'}
            </span>
          </div>

          <div className={styles.projModalHeaderGrid}>
            <div>
              <h2 className={`${styles.projModalTitle} gold-gradient-text`}>{project.title}</h2>
              <div className={styles.projModalMetaPills}>
                {project.techStack.map(t => (
                  <span key={t} className={styles.projModalMetaPill}>{t}</span>
                ))}
              </div>
            </div>

            {/* Laptop Mockup Frame */}
            <div className={styles.projModalLaptopContainer}>
              <div className={styles.projModalLaptopMockup}>
                <img 
                  src={screenshots[activeIdx] || project.image} 
                  alt={`${project.title} screenshot view`} 
                  className={styles.projModalLaptopScreen} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body Split Grid */}
        <div className={styles.projModalBodyGrid}>
          
          {/* Column 1: Details Metadata Card */}
          <div className={styles.projModalDetailsCard}>
            <div className={styles.projModalDetailItem}>
              <div className={styles.projModalDetailIcon}>
                <Briefcase size={16} />
              </div>
              <div className={styles.projModalDetailContent}>
                <span className={styles.projModalDetailLabel}>Role</span>
                <span className={styles.projModalDetailValue}>{project.role || 'Full Stack Developer'}</span>
              </div>
            </div>

            <div className={styles.projModalDetailItem}>
              <div className={styles.projModalDetailIcon}>
                <Calendar size={16} />
              </div>
              <div className={styles.projModalDetailContent}>
                <span className={styles.projModalDetailLabel}>Duration</span>
                <span className={styles.projModalDetailValue}>{project.duration || 'Feb 2024 - Apr 2024'}</span>
              </div>
            </div>

            <div className={styles.projModalDetailItem}>
              <div className={styles.projModalDetailIcon}>
                <Info size={16} />
              </div>
              <div className={styles.projModalDetailContent}>
                <span className={styles.projModalDetailLabel}>Project Type</span>
                <span className={styles.projModalDetailValue}>{project.projectType || 'Web Application'}</span>
              </div>
            </div>

            <div className={styles.projModalDetailItem}>
              <div className={styles.projModalDetailIcon}>
                <Globe size={16} />
              </div>
              <div className={styles.projModalDetailContent}>
                <span className={styles.projModalDetailLabel}>Live Demo</span>
                {project.liveLink ? (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.projModalDetailValue}
                    style={{ color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    {project.liveLink.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className={styles.projModalDetailValue}>Not available</span>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Key Features Checklist */}
          <div className={styles.projModalFeaturesCard}>
            <h4 className={styles.projModalFeaturesTitle}>Key Features</h4>
            <ul className={styles.projModalFeaturesList}>
              {features.map((f, idx) => (
                <li key={idx} className={styles.projModalFeatureItem}>
                  <Check size={16} className={styles.projModalFeatureCheck} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full-width Row 1: Overview Text */}
          <div className={styles.projModalOverviewSection}>
            <h4 className={styles.projModalOverviewTitle}>Project Overview</h4>
            {project.richText ? (
              <div 
                className={styles.projModalOverviewText}
                dangerouslySetInnerHTML={{ __html: project.richText }}
              />
            ) : (
              <p className={styles.projModalOverviewText}>{project.description}</p>
            )}
          </div>

          {/* Full-width Row 2: Gallery Carousel */}
          {screenshots.length > 0 && (
            <div className={styles.projModalScreenshotsSection}>
              <h4 className={styles.projModalScreenshotsTitle}>Project Screenshots</h4>
              <div className={styles.projModalCarousel}>
                {screenshots.map((shot, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`${styles.projModalThumbnailWrapper} ${activeIdx === idx ? styles.projModalThumbnailActive : ''}`}
                  >
                    <img src={shot} alt="Screenshot thumb" className={styles.projModalThumbnail} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '20px' }}>
            {project.liveLink && (
              <a 
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium-gold"
                style={{ padding: '14px 32px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Launch Live Site <ExternalLink size={14} />
              </a>
            )}
            {project.githubLink && (
              <a 
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium-outline"
                style={{ padding: '14px 32px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                View Source Code <Code size={14} />
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

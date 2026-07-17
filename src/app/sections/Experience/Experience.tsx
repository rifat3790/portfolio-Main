'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Code, Clock, MapPin } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, IExperience } from '../shared/types';

interface ExperienceProps {
  siteSettings: ISetting | null;
  initialExperiences: IExperience[];
}

export default function Experience({ siteSettings, initialExperiences }: ExperienceProps) {
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(initialExperiences[0] || null);

  useEffect(() => {
    if (initialExperiences.length > 0) setSelectedExp(initialExperiences[0]);
  }, [initialExperiences]);

  return (
    <section id="experience" className={styles.expSection}>
      <div className={styles.expContent}>
        <div className={styles.expHeader}>
          <span className={styles.expSubBadge}>
            <Briefcase size={14} style={{ marginRight: 6 }} /> MY JOURNEY
          </span>
          <h2 className={styles.expTitle}>
            <span className={styles.expGradientText}>Experience</span> That Shapes Me
          </h2>
          <p className={styles.expSubtitle}>
            A timeline of my professional journey, the companies I've worked with, and the impact I've created.
          </p>
        </div>

        {/* Stats cards grid */}
        <div className={styles.expStatsRow}>
          <div className={styles.expStatCard}>
            <div className={`${styles.expStatIconBox} ${styles.expStatIconBlue}`}><Briefcase size={22} /></div>
            <div>
              <div className={styles.expStatVal}>{siteSettings?.expStat1Value || '10k+'}</div>
              <div className={styles.expStatLabel}>{siteSettings?.expStat1Label || 'Hours Coding'}</div>
            </div>
          </div>
          <div className={styles.expStatCard}>
            <div className={`${styles.expStatIconBox} ${styles.expStatIconPurple}`}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><line x1="15" y1="16" x2="15" y2="22"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="15" y2="10"/>
              </svg>
            </div>
            <div>
              <div className={styles.expStatVal}>{siteSettings?.expStat2Value || 'Agile'}</div>
              <div className={styles.expStatLabel}>{siteSettings?.expStat2Label || 'Workflow'}</div>
            </div>
          </div>
          <div className={styles.expStatCard}>
            <div className={`${styles.expStatIconBox} ${styles.expStatIconBlue}`}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/>
              </svg>
            </div>
            <div>
              <div className={styles.expStatVal}>{siteSettings?.expStat3Value || 'Modern'}</div>
              <div className={styles.expStatLabel}>{siteSettings?.expStat3Label || 'Tool Stacks'}</div>
            </div>
          </div>
          <div className={styles.expStatCard}>
            <div className={`${styles.expStatIconBox} ${styles.expStatIconPurple}`}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div className={styles.expStatVal}>{siteSettings?.expStat4Value || 'Swift'}</div>
              <div className={styles.expStatLabel}>{siteSettings?.expStat4Label || 'Resolution Rate'}</div>
            </div>
          </div>
        </div>

        {/* Interactive grid */}
        {initialExperiences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No experiences registered. Add them in the admin dashboard panel.</p>
          </div>
        ) : (
          <div className={styles.expGrid}>
            {/* Left Timeline Column */}
            <div className={styles.expTimelineCol}>
              <div className={styles.expTimelineLine} />
              {initialExperiences.map((item) => {
                const isActive = selectedExp?._id === item._id;
                return (
                  <div
                    key={item._id}
                    className={`${styles.expTimelineItem} ${isActive ? styles.expTimelineItemActive : ''}`}
                    onClick={() => setSelectedExp(item)}
                  >
                    <div className={styles.expTimelineNode} />
                    <div className={`${styles.expCard} ${isActive ? styles.expCardActive : ''}`}>
                      <div className={styles.expCardLogoBox}>
                        {item.logo ? (
                          <img src={item.logo} alt={item.company} className={styles.expCardLogoImg} loading="lazy" decoding="async" />
                        ) : (
                          <div className={styles.expCardLogoPlaceholder}>{item.company.charAt(0)}</div>
                        )}
                      </div>
                      <div className={styles.expCardContent}>
                        <div className={styles.expCardHeaderRow}>
                          <h4 className={styles.expCardCompany}>{item.company}</h4>
                          {item.isCurrent && <span className={styles.expCurrentPill}>Current</span>}
                        </div>
                        <div className={styles.expCardRole}>{item.role}</div>
                        <div className={styles.expCardMeta}>{item.duration}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Detail Column */}
            <div className={styles.expDetailCol}>
              {selectedExp ? (
                <>
                  <div className={styles.expDetailHeader}>
                    <div className={styles.expDetailLogoBox}>
                      {selectedExp.logo ? (
                        <img src={selectedExp.logo} alt={selectedExp.company} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className={styles.expCardLogoPlaceholder} style={{ fontSize: '1.8rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selectedExp.company.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.expDetailInfo}>
                      <h3 className={styles.expDetailCompany}>{selectedExp.company}</h3>
                      <div className={styles.expDetailRole}>{selectedExp.role}</div>
                      <div className={styles.expDetailMetaRow}>
                        <div className={styles.expDetailMetaItem}><Clock size={14} /><span>{selectedExp.duration}</span></div>
                        {selectedExp.location && <div className={styles.expDetailMetaItem}><MapPin size={14} /><span>{selectedExp.location}</span></div>}
                        {selectedExp.employmentType && <div className={styles.expDetailMetaItem} style={{ color: 'var(--accent-gold)' }}><span>• {selectedExp.employmentType}</span></div>}
                      </div>
                    </div>
                  </div>

                  <p className={styles.expDetailDesc}>{selectedExp.description}</p>

                  {selectedExp.responsibilities && (
                    <div>
                      <h4 className={styles.expDetailSectionTitle}><CheckCircle2 size={16} /> Key Responsibilities</h4>
                      <div className={styles.expDetailResponsibilitiesList}>
                        {selectedExp.responsibilities.split('\n').filter(r => r.trim().length > 0).map((resp, rIdx) => (
                          <div key={rIdx} className={styles.expDetailRespItem}>
                            <span className={styles.expDetailRespIcon}>✓</span>
                            <span>{resp.replace(/^[-\*\u2022]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedExp.techStack && selectedExp.techStack.length > 0 && (
                    <div style={{ marginTop: 'auto' }}>
                      <h4 className={styles.expDetailSectionTitle}><Code size={16} /> Tech Stack</h4>
                      <div className={styles.expDetailTechList}>
                        {selectedExp.techStack.map((tech) => (
                          <div key={tech} className={styles.expTechBadge}>
                            {tech.toLowerCase() === 'shopify' && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                            {tech.toLowerCase() === 'next.js' && <span style={{ fontWeight: 'bold', fontSize: '0.65rem' }}>N</span>}
                            {tech.toLowerCase() === 'react' && <span style={{ color: '#60a5fa' }}>⚛</span>}
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Select an experience item to read description details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom connect banner */}
        <div className={styles.expCallout}>
          <div className={styles.expCalloutLeft}>
            <div className={styles.expCalloutIcon}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </div>
            <div>
              <h4 className={styles.expCalloutTitle}>I'm always open to new opportunities and exciting projects.</h4>
              <p className={styles.expCalloutDesc}>Let's build something amazing together!</p>
            </div>
          </div>
          <a href="#contact" className={styles.expCalloutBtn}>
            Let's Connect <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}

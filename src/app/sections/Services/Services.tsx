'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Star, Database, ShoppingBag, Cpu, MessageSquare, Pencil, Code, Rocket, ArrowRight } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, IService } from '../shared/types';
import { renderServiceIcon } from '../shared/icons';

interface ServicesProps {
  siteSettings: ISetting | null;
  initialServices: IService[];
}

export default function Services({ siteSettings, initialServices }: ServicesProps) {
  if (!initialServices || initialServices.length === 0) return null;

  return (
    <section id="services" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className={styles.sectionContent}>

        {/* Redesigned Services Intro Row */}
        <div className={styles.servicesIntroRow}>
          <motion.div
            className={styles.servicesIntroLeft}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.servicesIntroTag}>WHAT I DO</span>
            <h2 className={styles.servicesIntroTitle}>
              Premium Digital Solutions Built for Your <span className="gold-gradient-text">Success</span>
            </h2>
            <p className={styles.servicesIntroDesc}>
              I help businesses and individuals turn their ideas into powerful, scalable, and user-friendly digital products.
            </p>

            {/* Stats Counters */}
            <div className={styles.servicesStatsRow}>
              <div className={styles.servicesStatCard}>
                <div className={styles.servicesStatIcon}><Briefcase size={20} /></div>
                <div className={styles.servicesStatInfo}>
                  <div className={styles.servicesStatValue}>{siteSettings?.serviceStat1Value || '99.9%'}</div>
                  <div className={styles.servicesStatLabel}>{siteSettings?.serviceStat1Label || 'Uptime & Performance'}</div>
                </div>
              </div>
              <div className={styles.servicesStatCard}>
                <div className={styles.servicesStatIcon}><CheckCircle2 size={20} /></div>
                <div className={styles.servicesStatInfo}>
                  <div className={styles.servicesStatValue}>{siteSettings?.serviceStat2Value || 'Clean'}</div>
                  <div className={styles.servicesStatLabel}>{siteSettings?.serviceStat2Label || 'Architecture'}</div>
                </div>
              </div>
              <div className={styles.servicesStatCard}>
                <div className={styles.servicesStatIcon}><Star size={20} /></div>
                <div className={styles.servicesStatInfo}>
                  <div className={styles.servicesStatValue}>{siteSettings?.serviceStat3Value || '24/7'}</div>
                  <div className={styles.servicesStatLabel}>{siteSettings?.serviceStat3Label || 'Support & Comm'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Laptop & Orbiting Tech Icons */}
          <motion.div
            className={styles.servicesIntroRight}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            {/* Outer Orbit Ring */}
            <div className={styles.orbitRing2}>
              <div className={styles.orbitIconNode} style={{ top: '20%', left: '10%' }} title="Next.js">
                <span style={{ fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>NEXT</span>
              </div>
              <div className={styles.orbitIconNode} style={{ top: '20%', left: '90%' }} title="Shopify">
                <ShoppingBag size={18} />
              </div>
              <div className={styles.orbitIconNode} style={{ top: '90%', left: '50%' }} title="Database">
                <Database size={18} />
              </div>
            </div>

            {/* Inner Orbit Ring */}
            <div className={styles.orbitRing1}>
              <div className={styles.orbitIconNode} style={{ top: '0%', left: '50%' }} title="React">
                <svg viewBox="0 0 841.9 595.3" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="25">
                  <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(30, 420.95, 297.65)" />
                  <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(90, 420.95, 297.65)" />
                  <ellipse cx="420.95" cy="297.65" rx="385" ry="152.5" transform="rotate(150, 420.95, 297.65)" />
                  <circle cx="420.95" cy="297.65" r="45" fill="currentColor" />
                </svg>
              </div>
              <div className={styles.orbitIconNode} style={{ top: '75%', left: '10%' }} title="JavaScript">
                <span style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>JS</span>
              </div>
              <div className={styles.orbitIconNode} style={{ top: '75%', left: '90%' }} title="Node.js">
                <Cpu size={18} />
              </div>
            </div>

            {/* Laptop image frame - Masked inside a perfect responsive circle */}
            <div
              style={{
                position: 'relative',
                width: 'clamp(260px, 32vw, 360px)',
                height: 'clamp(260px, 32vw, 360px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(129, 140, 248, 0.3)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 2px 8px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                background: 'rgba(7, 8, 15, 0.5)',
                padding: 0,
                margin: '0 auto',
              }}
            >
              <img
                src="/services_laptop_display.png"
                alt="Laptop display"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'translate3d(0, 0, 0)',
                  display: 'block',
                  padding: 0,
                  margin: 0,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Redesigned Services list */}
        <div className={styles.servicesSectionMid}>
          <div className={styles.servicesMidHeader}>
            <span className={styles.servicesMidTag}>MY SERVICES</span>
            <h2 className={styles.servicesMidTitle}>What I Can Help You With</h2>
            <p className={styles.servicesMidDesc}>
              I offer end-to-end development services to create modern, high-performance web applications tailored to your business needs.
            </p>
          </div>

          <div className={styles.servicesPremiumGridCol}>
            {initialServices.map((service, idx) => (
              <motion.div
                key={service._id}
                className={styles.serviceCardHorizontal}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className={styles.serviceCardIconWrap}>
                  {renderServiceIcon(service.iconName)}
                </div>
                <div className={styles.serviceCardTextWrap}>
                  <h3 className={styles.serviceCardHorizontalTitle}>{service.title}</h3>
                  <p className={styles.serviceCardHorizontalDesc}>{service.description}</p>
                  <span className={styles.serviceCardLink}>
                    Learn More <ArrowRight size={12} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Timeline Flow */}
        <div className={styles.processSection}>
          <div className={styles.processHeader}>
            <span className={styles.processTag}>MY PROCESS</span>
            <h2 className={styles.processTitle}>How I Work</h2>
          </div>

          <div className={styles.processTimelineGrid}>
            <div className={styles.processLine} />
            {[
              { icon: <MessageSquare size={22} />, num: '01', title: 'Discover', desc: 'Understanding your goals, requirements, and vision.', delay: 0.05 },
              { icon: <Pencil size={22} />, num: '02', title: 'Plan', desc: 'Planning the best strategy and solution for your project.', delay: 0.1 },
              { icon: <Code size={22} />, num: '03', title: 'Build', desc: 'Developing with clean, scalable, and efficient code.', delay: 0.15 },
              { icon: <Rocket size={22} />, num: '04', title: 'Deliver', desc: 'Testing, optimizing, and delivering a high-quality product.', delay: 0.2 },
            ].map((step) => (
              <motion.div
                key={step.num}
                className={styles.processItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: step.delay }}
              >
                <div className={styles.processIconCard}>{step.icon}</div>
                <span className={styles.processStepNum}>{step.num}</span>
                <h3 className={styles.processItemTitle}>{step.title}</h3>
                <p className={styles.processItemDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Banner Callout Section */}
        <div className={styles.servicesCTASection}>
          <div className={styles.servicesCTAText}>
            <span className={styles.servicesCTASub}>LET'S WORK TOGETHER</span>
            <h3 className={styles.servicesCTATitle}>Have a Project in Mind?</h3>
            <p className={styles.servicesCTADesc}>Let's build something amazing together.</p>
          </div>
          <div className={styles.servicesCTAActions}>
            <a href="#contact" className="btn-premium btn-premium-gold" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              Hire Me Now <Rocket size={14} />
            </a>
            <a href="#projects" className="btn-premium btn-premium-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              View My Work
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

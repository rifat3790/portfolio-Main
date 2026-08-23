'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';

interface FAQProps {
  siteSettings: ISetting | null;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Shopify & E-Commerce',
    question: 'Why is Refayet Hossen (Rifayet Hossen) considered the best Shopify developer for custom stores?',
    answer: 'Refayet Hossen (also known as Rifayet Hossen) brings specialized expertise in Shopify Liquid theme development, headless e-commerce architectures, conversion rate optimization (CRO), and custom app integrations. Every store is engineered with clean code, lightning-fast sub-second loading speeds, and responsive design tailored to maximize sales and ROI.',
  },
  {
    category: 'Web Development',
    question: 'What types of e-commerce websites and custom web applications can you build?',
    answer: 'I build a comprehensive spectrum of solutions: from high-converting custom Shopify stores and multi-vendor e-commerce platforms to scalable full-stack web applications using Next.js 16, React 19, TypeScript, Node.js, Express, and MongoDB. Whether you need a bespoke brand store or an enterprise SaaS platform, I handle end-to-end architecture and deployment.',
  },
  {
    category: 'New Website Build',
    question: 'What is the step-by-step process for a new website build from scratch?',
    answer: 'The process involves 4 streamlined phases: 1. Discovery & Strategy (identifying target audience, core features, and brand tone), 2. High-Fidelity UI/UX Architecture, 3. Clean, Modular Full-Stack Engineering with SEO and Core Web Vitals baked in, and 4. Comprehensive Testing, Deployment on Vercel/Cloud, and ongoing support.',
  },
  {
    category: 'Performance & SEO',
    question: 'How do you optimize e-commerce stores and websites to rank on Google first page?',
    answer: 'I implement comprehensive technical and on-page SEO: dynamic Next.js 16 metadata, JSON-LD rich structured data (Person, ProfessionalService, Product, FAQPage), OpenGraph tags, semantic HTML5 tags, mobile responsiveness, and 95+ Google PageSpeed / Core Web Vitals optimization to help your site achieve top search rankings.',
  },
  {
    category: 'Collaboration',
    question: 'What is the typical turnaround time and how can we get started?',
    answer: 'Turnaround time ranges from 5 to 14 business days depending on the project scope. Getting started is simple: click "Let\'s Work Together" or use the contact form below, and I will get back to you within 1 hour with a customized project roadmap and proposal.',
  },
];

export default function FAQ({ siteSettings }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`${styles.section} ${styles.sectionDark}`} style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
      <div className={styles.sectionContent}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className={styles.sectionTag} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HelpCircle size={14} style={{ color: '#818cf8' }} />
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', margin: '8px 0 16px', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 800 }}>
            Everything You Need to Know About <span style={{ color: '#818cf8', textShadow: '0 0 20px rgba(129,140,248,0.2)' }}>Shopify & Web Development</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', fontWeight: 300 }}>
            Got questions about hiring a Shopify developer, building a new custom e-commerce website, or boosting your Google search rankings? Here are direct answers.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                style={{
                  background: isOpen ? 'rgba(15, 18, 35, 0.85)' : 'rgba(10, 12, 22, 0.65)',
                  border: isOpen ? '1px solid rgba(129, 140, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen ? '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isOpen ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: isOpen ? '1px solid rgba(129, 140, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isOpen ? '#818cf8' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        flexShrink: 0,
                      }}
                    >
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '1.02rem', fontWeight: 600, color: isOpen ? '#ffffff' : 'var(--text-primary)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
                      {item.question}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isOpen ? '#818cf8' : 'rgba(255, 255, 255, 0.05)',
                      color: isOpen ? '#000000' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: '0 24px 22px 66px',
                          color: '#94a3b8',
                          fontSize: '0.94rem',
                          lineHeight: '1.7',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 300,
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                          marginTop: '4px',
                          paddingTop: '16px',
                        }}
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Consultation Callout */}
        <div
          style={{
            maxWidth: '860px',
            margin: '40px auto 0',
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(79, 70, 229, 0.04) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            borderRadius: '20px',
            padding: '24px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.98rem' }}>Have a question not listed here?</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Get in touch for a free 1-on-1 technical consultation.</div>
            </div>
          </div>
          <a
            href="#contact"
            className="btn-premium btn-premium-gold"
            style={{ padding: '12px 24px', fontSize: '0.85rem', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            Ask Refayet Directly <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}

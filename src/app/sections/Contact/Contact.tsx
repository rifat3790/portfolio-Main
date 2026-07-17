'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Code, Briefcase, MessageCircle, User, MessageSquare, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting } from '../shared/types';

interface ContactProps {
  siteSettings: ISetting | null;
}

export default function Contact({ siteSettings }: ContactProps) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 4000);
      } else {
        setContactStatus('error');
      }
    } catch {
      setContactStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.contactPremium}>
      <div className={styles.contactPremiumGrid}>

        {/* Left Column: Details & Socials */}
        <div className={styles.contactPremiumLeft}>
          <span className={styles.contactPremiumSub}>
            <MessageSquare size={14} style={{ marginRight: 6 }} /> GET IN TOUCH
          </span>
          <h2 className={styles.contactPremiumTitle}>
            Let's Create Something <span className={styles.contactPremiumGradientText}>Extraordinary.</span>
          </h2>
          <p className={styles.contactPremiumDesc}>
            Have a project in mind, want to discuss a partnership, or simply want to say hello? Drop me a line and let's start a conversation.
          </p>

          <div className={styles.contactPremiumInfoList}>
            {siteSettings?.aboutLocation && (
              <div className={styles.contactPremiumInfoItem}>
                <div className={styles.contactPremiumIconCard}><MapPin size={18} /></div>
                <div>
                  <div className={styles.contactPremiumInfoLabel}>Location</div>
                  <div className={styles.contactPremiumInfoValue}>{siteSettings.aboutLocation}</div>
                </div>
              </div>
            )}
            {siteSettings?.email && (
              <a href={`mailto:${siteSettings.email}`} className={styles.contactPremiumInfoItem} style={{ textDecoration: 'none' }}>
                <div className={styles.contactPremiumIconCard}><Mail size={18} /></div>
                <div>
                  <div className={styles.contactPremiumInfoLabel}>Email Me Directly</div>
                  <div className={styles.contactPremiumInfoValue}>{siteSettings.email}</div>
                </div>
              </a>
            )}
            {siteSettings?.phone && (
              <a href={`tel:${siteSettings.phone}`} className={styles.contactPremiumInfoItem} style={{ textDecoration: 'none' }}>
                <div className={styles.contactPremiumIconCard}><Phone size={18} /></div>
                <div>
                  <div className={styles.contactPremiumInfoLabel}>Call / WhatsApp</div>
                  <div className={styles.contactPremiumInfoValue}>{siteSettings.phone}</div>
                </div>
              </a>
            )}
            <div className={styles.contactPremiumInfoItem}>
              <div className={styles.contactPremiumIconCard} style={{ background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
              </div>
              <div>
                <div className={styles.contactPremiumInfoLabel}>Availability</div>
                <div className={styles.contactPremiumInfoValue} style={{ color: '#22c55e', fontWeight: 500 }}>Open for Freelance & Contracts</div>
              </div>
            </div>
          </div>

          <div className={styles.contactPremiumSignatureText}>Let's Connect</div>

          <div className={styles.contactPremiumSocialRow}>
            {siteSettings?.github && (
              <a href={siteSettings.github} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}><Code size={18} /></a>
            )}
            {siteSettings?.linkedin && (
              <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}><Briefcase size={18} /></a>
            )}
            {siteSettings?.whatsapp && (
              <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className={styles.contactPremiumSocialBtn}><MessageCircle size={18} /></a>
            )}
          </div>
        </div>

        {/* Right Column: Message Form Card */}
        <div className={styles.contactPremiumFormCard}>
          <div className={styles.contactFormCardHeader}>
            <div className={styles.contactFormCardIcon}><Mail size={20} /></div>
            <div>
              <h3 className={styles.contactFormCardTitle}>Send Me a Message</h3>
              <span className={styles.contactFormCardSubtitle}>Usually responds in less than 24 hours</span>
            </div>
          </div>

          <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className={styles.contactFormPremiumGrid}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Your Name</label>
                <div className={styles.contactInputWrapper}>
                  <input type="text" required placeholder="Rifat Hossen" value={contactForm.name} onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))} className={styles.contactPremiumInput} />
                  <User size={16} className={styles.contactInputIcon} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
                <div className={styles.contactInputWrapper}>
                  <input type="email" required placeholder="example@gmail.com" value={contactForm.email} onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))} className={styles.contactPremiumInput} />
                  <Mail size={16} className={styles.contactInputIcon} />
                </div>
              </div>
            </div>

            <div className={styles.contactFormGroupFull}>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Subject</label>
              <div className={styles.contactInputWrapper}>
                <input type="text" required placeholder="Project Inquiry / General Question" value={contactForm.subject} onChange={e => setContactForm(prev => ({ ...prev, subject: e.target.value }))} className={styles.contactPremiumInput} />
                <MessageSquare size={16} className={styles.contactInputIcon} />
              </div>
            </div>

            <div className={styles.contactFormGroupFull}>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>Your Message</label>
              <div className={styles.contactInputWrapper}>
                <textarea required placeholder="Tell me about your project, goals, and budget constraints..." value={contactForm.message} onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))} className={styles.contactPremiumTextarea} />
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className={styles.contactTextareaIcon}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
            </div>

            <button type="submit" disabled={contactStatus === 'loading'} className={styles.contactFormSubmitBtn}>
              {contactStatus === 'loading' ? <>Sending Message...</> : <>Send Message <ArrowRight size={16} /></>}
            </button>

            {contactStatus === 'success' && (
              <div style={{ color: '#4caf50', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(76, 175, 80, 0.08)', border: '1px solid rgba(76, 175, 80, 0.2)', padding: '12px', borderRadius: '8px' }}>
                <CheckCircle2 size={16} /> Message sent successfully! I'll get back to you shortly.
              </div>
            )}
            {contactStatus === 'error' && (
              <div style={{ color: '#f44336', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(244, 67, 54, 0.08)', border: '1px solid rgba(244, 67, 54, 0.2)', padding: '12px', borderRadius: '8px' }}>
                Failed to send message. Please email me directly instead.
              </div>
            )}
          </form>

          <div className={styles.contactFormDisclaimer}>
            <Lock size={12} />
            <span>Your message and contact data are safe & secure.</span>
          </div>
        </div>

      </div>
    </section>
  );
}

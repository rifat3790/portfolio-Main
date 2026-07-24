'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ExternalLink, X, User, CheckCircle2 } from 'lucide-react';
import styles from '../../home.module.css';
import { ISetting, IBlog } from '../shared/types';
import { TwitterIcon, LinkedinIcon, FacebookIcon } from '../shared/icons';
import Image from 'next/image';

interface BlogsProps {
  siteSettings: ISetting | null;
  initialBlogs: IBlog[];
}

const formatMarkdown = (text: string) => {
  if (!text) return '';
  let processed = text
    .replace(/### (.*?)\n/g, (_, p1) => { const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return `<h3 id="${id}">${p1}</h3>\n`; })
    .replace(/## (.*?)\n/g, (_, p1) => { const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return `<h2 id="${id}">${p1}</h2>\n`; })
    .replace(/# (.*?)\n/g, (_, p1) => { const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return `<h1 id="${id}">${p1}</h1>\n`; });
  processed = processed
    .replace(/```typescript([\s\S]*?)```/g, '<pre><code class="language-typescript">$1</code></pre>')
    .replace(/```javascript([\s\S]*?)```/g, '<pre><code class="language-javascript">$1</code></pre>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  processed = processed.replace(/\* (.*?)\n/g, '<li>$1</li>\n').replace(/- (.*?)\n/g, '<li>$1</li>\n');
  processed = processed.replace(/^> (.*?)\n/gm, (_, p1) => {
    if (p1.includes('[!NOTE]') || p1.includes('[!TIP]')) {
      const cleaned = p1.replace(/\[!NOTE\]|\[!TIP\]/g, '').trim();
      return `<div class="blog-callout"><span class="blog-callout-icon">💡</span><div class="blog-callout-text">${cleaned}</div></div>\n`;
    }
    return `<blockquote>${p1}</blockquote>\n`;
  });
  return processed.split('\n\n').map(para => {
    const trimmed = para.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div')) return para;
    return `<p>${para.replace(/\n/g, '<br/>')}</p>`;
  }).join('');
};

const extractHeadings = (content: string) => {
  if (!content) return [];
  const lines = content.split('\n');
  const headings: { id: string; text: string; level: number }[] = [];
  lines.forEach((line) => {
    const match = line.match(/^(##|###) (.*)$/);
    if (match) {
      const text = match[2].replace(/\*\*|\*/g, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level: match[1].length });
    }
  });
  return headings;
};

export default function Blogs({ siteSettings, initialBlogs }: BlogsProps) {
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [activeTocId, setActiveTocId] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedBlog]);

  return (
    <>
      <section id="blogs" className={`${styles.section} ${styles.sectionDark}`} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
        <div className={styles.sectionContent}>

          <div className={styles.blogHeaderGrid}>
            <div className={styles.blogHeaderLeft}>
              <span className={styles.sectionTag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 8px #3b82f6' }} />
                Latest From Blog
              </span>
              <h2 className="gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontFamily: 'var(--font-display)', margin: '16px 0 24px', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 800 }}>
                Thoughts, Tutorials<br/>& <span style={{ color: '#60a5fa', textShadow: '0 0 15px rgba(96,165,250,0.1)' }}>My Learnings</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '480px', marginBottom: '24px', fontWeight: 300 }}>
                I love sharing knowledge and experiences about web development, tools, and everything I learn on my journey.
              </p>
              <a href="#blogs" className="gold-gradient-text" style={{ fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                View all articles <ArrowRight size={14} />
              </a>
            </div>
            <div className={styles.blogHeaderRight} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div 
                className={styles.blogMugContainer} 
                style={{ 
                  width: 'clamp(260px, 32vw, 340px)', 
                  height: 'clamp(260px, 32vw, 340px)', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: '3px solid rgba(129, 140, 248, 0.3)', 
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 2px 8px rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 8, 15, 0.5)',
                  padding: 0,
                  margin: '0 auto'
                }}
              >
                <Image 
                  src="/blog_cup_graphic.png" 
                  alt="3D Digital Art Mug" 
                  width={360}
                  height={360}
                  className={styles.blogMugImg} 
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate3d(0, 0, 0)',
                    display: 'block',
                    padding: 0,
                    margin: 0
                  }}
                />
              </div>
            </div>
          </div>

          {initialBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              Articles are being curated. Check back shortly.
            </div>
          ) : (
            <>
              <div className={styles.blogCardsGrid}>
                {initialBlogs.slice(0, showAllBlogs ? undefined : 3).map((blog) => (
                  <motion.div
                    key={blog._id}
                    className={styles.blogCardPremium}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <div className={styles.blogCardImageWrapper}>
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className={styles.blogCardImage} loading="lazy" decoding="async" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                          <BookOpen size={48} color="var(--text-muted)" />
                        </div>
                      )}
                      <span className={styles.blogCardCategory}>{blog.tags && blog.tags[0] ? blog.tags[0] : 'Tech'}</span>
                      <span className={styles.blogCardDate}>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <div className={styles.blogCardContent}>
                      <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                      <p className={styles.blogCardExcerpt}>{blog.excerpt}</p>
                      <div className={styles.blogCardFooter}>
                        <div className={styles.blogCardAuthor}>
                          {siteSettings?.aboutImage ? (
                            <img src={siteSettings.aboutImage} alt="Author" className={styles.blogCardAvatar} loading="lazy" decoding="async" />
                          ) : siteSettings?.logoImage ? (
                            <img src={siteSettings.logoImage} alt="Author" className={styles.blogCardAvatar} loading="lazy" decoding="async" />
                          ) : (
                            <div className={styles.blogCardAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                              <User size={16} />
                            </div>
                          )}
                          <div className={styles.blogCardAuthorInfo}>
                            <span className={styles.blogCardAuthorName}>{siteSettings?.aboutName || 'Md. Refayet Hossen'}</span>
                            <span className={styles.blogCardReadTime}>{blog.readTime || '5 min read'}</span>
                          </div>
                        </div>
                        <div className={styles.blogCardCircleBtn}><ArrowRight size={16} /></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => setShowAllBlogs(!showAllBlogs)}
                  className="btn-premium btn-premium-gold"
                  style={{ gap: 12, padding: '16px 36px', borderRadius: '100px', display: 'flex', alignItems: 'center' }}
                >
                  {showAllBlogs ? 'Show Less' : 'Explore All Blog Posts'} <BookOpen size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Blog Article Reader Modal Overlay */}
      {selectedBlog && (() => {
        const headings = extractHeadings(selectedBlog.content);
        return (
          <div className={styles.blogReaderOverlay} onClick={() => setSelectedBlog(null)}>
            <div className={styles.blogReaderBox} onClick={e => e.stopPropagation()}>
              <div className={styles.blogReaderHeader}>
                <button onClick={() => setSelectedBlog(null)} className={styles.blogReaderClose} aria-label="Close modal"><X size={18} /></button>
                <div className={styles.blogReaderMetaRow}>
                  <span className={styles.blogReaderCategory}>{selectedBlog.tags && selectedBlog.tags[0] ? selectedBlog.tags[0] : 'Tech'}</span>
                  <span>•</span>
                  <span>{selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime || '10 min read'}</span>
                </div>
                <div className={styles.blogReaderHeaderContent}>
                  <div>
                    <h2 className={styles.blogReaderTitle}>{selectedBlog.title}</h2>
                    <p className={styles.blogReaderExcerpt}>{selectedBlog.excerpt}</p>
                    <div className={styles.blogReaderAuthorCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {siteSettings?.aboutImage ? (
                          <img src={siteSettings.aboutImage} alt="Author" className={styles.blogReaderAuthorAvatar} loading="lazy" decoding="async" />
                        ) : siteSettings?.logoImage ? (
                          <img src={siteSettings.logoImage} alt="Author" className={styles.blogReaderAuthorAvatar} loading="lazy" decoding="async" />
                        ) : (
                          <div className={styles.blogReaderAuthorAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                            <User size={18} />
                          </div>
                        )}
                        <div className={styles.blogReaderAuthorMeta}>
                          <span className={styles.blogReaderAuthorName}>{siteSettings?.aboutName || 'Md. Refayet Hossen'}</span>
                          <span className={styles.blogReaderAuthorSub}>Full Stack Developer & Shopify Expert</span>
                        </div>
                      </div>
                      <div className={styles.blogReaderShareGroup}>
                        <button onClick={() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(window.location.href); setCopiedToast(true); setTimeout(() => setCopiedToast(false), 2000); } }} className={styles.blogReaderShareBtn} title="Copy article link"><ExternalLink size={14} /></button>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noreferrer" className={styles.blogReaderShareBtn} title="Share on Twitter"><TwitterIcon /></a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noreferrer" className={styles.blogReaderShareBtn} title="Share on LinkedIn"><LinkedinIcon /></a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.blogReaderImageWrapper}>
                    {selectedBlog.image ? (
                      <img src={selectedBlog.image} alt={selectedBlog.title} className={styles.blogReaderImage} loading="lazy" decoding="async" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                        <BookOpen size={64} color="var(--text-muted)" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.blogReaderBodyGrid}>
                <div className={styles.blogReaderTocCol}>
                  <h4 className={styles.blogReaderTocTitle}>On This Page</h4>
                  {headings.length > 0 ? (
                    <ul className={styles.blogReaderTocList}>
                      {headings.map((h) => (
                        <li key={h.id} className={`${styles.blogReaderTocItem} ${activeTocId === h.id ? styles.blogReaderTocItemActive : ''}`}>
                          <span onClick={() => { const el = document.getElementById(h.id); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setActiveTocId(h.id); } }} className={`${styles.blogReaderTocLink} ${activeTocId === h.id ? styles.blogReaderTocLinkActive : ''}`} style={{ paddingLeft: h.level === 3 ? '12px' : '0' }} title={h.text}>{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Introduction</div>
                  )}
                </div>

                <div className={styles.blogReaderContentCol}>
                  <div className="journal-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(selectedBlog.content) }} />
                </div>

                <div className={styles.blogReaderSidebarCol}>
                  <div className={styles.blogReaderSideCard}>
                    <h4 className={styles.blogReaderSideCardTitle}>Details</h4>
                    <div className={styles.blogReaderSideDetailList}>
                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Published on</span>
                        <span className={styles.blogReaderSideDetailVal}>{selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                      </div>
                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Reading time</span>
                        <span className={styles.blogReaderSideDetailVal}>{selectedBlog.readTime || '10 min read'}</span>
                      </div>
                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Category</span>
                        <span className={styles.blogReaderSideCategoryPill}>{selectedBlog.tags && selectedBlog.tags[0] ? selectedBlog.tags[0] : 'Web Development'}</span>
                      </div>
                      <div className={styles.blogReaderSideDetailItem}>
                        <span className={styles.blogReaderSideDetailLabel}>Tags</span>
                        <div className={styles.blogReaderSideTagsGrid}>
                          {selectedBlog.tags && selectedBlog.tags.map((t) => <span key={t} className={styles.blogReaderSideTagBadge}>#{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.blogReaderSideCard}>
                    <h4 className={styles.blogReaderSideCardTitle}>Share this article</h4>
                    <div className={styles.blogReaderSideShareRow}>
                      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noreferrer" className={styles.blogReaderShareBtn} title="Share on Twitter"><TwitterIcon /></a>
                      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noreferrer" className={styles.blogReaderShareBtn} title="Share on LinkedIn"><LinkedinIcon /></a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noreferrer" className={styles.blogReaderShareBtn} title="Share on Facebook"><FacebookIcon /></a>
                    </div>
                  </div>
                </div>
              </div>

              {copiedToast && (
                <div style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#60a5fa', color: '#000', padding: '12px 24px', borderRadius: '30px', zIndex: 2000, fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Link copied to clipboard!
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}

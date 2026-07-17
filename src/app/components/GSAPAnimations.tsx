'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAPAnimations — Premium scroll-triggered and entrance animations
 * Uses GSAP ScrollTrigger to animate sections as they enter the viewport.
 * Zero visual changes; purely enhances motion feel of existing elements.
 */
export default function GSAPAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Small delay to let DOM render
    const timer = setTimeout(() => {
      initAnimations();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null; // Purely behavioral component
}

function initAnimations() {
  // ─── 1. Section tags (pill badges) — slide in from left ───
  gsap.utils.toArray<HTMLElement>('[class*="sectionTag"], [class*="expSubBadge"], [class*="skillsPremiumSubBadge"], [class*="servicesIntroTag"], [class*="servicesMidTag"], [class*="processTag"], [class*="contactPremiumSub"]').forEach(el => {
    gsap.fromTo(el,
      { x: -24, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });

  // ─── 2. Section headings — fade up with slight Y ───
  gsap.utils.toArray<HTMLElement>('h2, h1').forEach(el => {
    // Skip if already animated by framer-motion (check for data attributes)
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // ─── 3. About feature cards — staggered reveal ───
  const aboutCards = gsap.utils.toArray<HTMLElement>('[class*="aboutFeatureCard"]');
  if (aboutCards.length > 0) {
    gsap.fromTo(aboutCards,
      { y: 40, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)',
        stagger: 0.08,
        scrollTrigger: { trigger: aboutCards[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 4. Service cards — staggered left-to-right ───
  const serviceCards = gsap.utils.toArray<HTMLElement>('[class*="serviceCardHorizontal"]');
  if (serviceCards.length > 0) {
    gsap.fromTo(serviceCards,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: { trigger: serviceCards[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 5. Process items — slide up in sequence ───
  const processItems = gsap.utils.toArray<HTMLElement>('[class*="processItem"]');
  if (processItems.length > 0) {
    gsap.fromTo(processItems,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: processItems[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 6. Project cards — scale + fade stagger ───
  const projectCards = gsap.utils.toArray<HTMLElement>('[class*="projectCardPremium"]');
  if (projectCards.length > 0) {
    gsap.fromTo(projectCards,
      { y: 40, opacity: 0, scale: 0.96 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: projectCards[0], start: 'top 90%', once: true }
      }
    );
  }

  // ─── 7. Experience stat cards — pop in ───
  const expStatCards = gsap.utils.toArray<HTMLElement>('[class*="expStatCard"]');
  if (expStatCards.length > 0) {
    gsap.fromTo(expStatCards,
      { scale: 0.88, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)',
        stagger: 0.07,
        scrollTrigger: { trigger: expStatCards[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 8. Skills category cards — left slide stagger ───
  const skillCards = gsap.utils.toArray<HTMLElement>('[class*="skillsCategoryCard"]');
  if (skillCards.length > 0) {
    gsap.fromTo(skillCards,
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: skillCards[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 9. Other tech badges — stagger fade ───
  const techBadges = gsap.utils.toArray<HTMLElement>('[class*="otherTechBadge"]');
  if (techBadges.length > 0) {
    gsap.fromTo(techBadges,
      { scale: 0.7, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)',
        stagger: 0.04,
        scrollTrigger: { trigger: techBadges[0], start: 'top 90%', once: true }
      }
    );
  }

  // ─── 10. Testimonial slider — slide in from right ───
  const testimonialSlider = document.querySelector('[class*="testimonialPremiumSlider"]');
  if (testimonialSlider) {
    gsap.fromTo(testimonialSlider,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: testimonialSlider, start: 'top 88%', once: true }
      }
    );
  }

  // ─── 11. Blog cards — stagger up ───
  const blogCards = gsap.utils.toArray<HTMLElement>('[class*="blogCardPremium"]');
  if (blogCards.length > 0) {
    gsap.fromTo(blogCards,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: blogCards[0], start: 'top 90%', once: true }
      }
    );
  }

  // ─── 12. Contact info items — slide up stagger ───
  const contactItems = gsap.utils.toArray<HTMLElement>('[class*="contactPremiumInfoItem"]');
  if (contactItems.length > 0) {
    gsap.fromTo(contactItems,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: contactItems[0], start: 'top 90%', once: true }
      }
    );
  }

  // ─── 13. Contact form card — slide in from right ───
  const contactFormCard = document.querySelector('[class*="contactPremiumFormCard"]');
  if (contactFormCard) {
    gsap.fromTo(contactFormCard,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: contactFormCard, start: 'top 88%', once: true }
      }
    );
  }

  // ─── 14. Footer columns — stagger fade up ───
  const footerCols = gsap.utils.toArray<HTMLElement>('[class*="footerBrandCol"], [class*="footerLinksCol"]');
  if (footerCols.length > 0) {
    gsap.fromTo(footerCols,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: footerCols[0], start: 'top 92%', once: true }
      }
    );
  }

  // ─── 15. About stats row — counter-like scale in ───
  const aboutStats = gsap.utils.toArray<HTMLElement>('[class*="aboutStatItem"]');
  if (aboutStats.length > 0) {
    gsap.fromTo(aboutStats,
      { scale: 0.85, opacity: 0, y: 20 },
      {
        scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)',
        stagger: 0.07,
        scrollTrigger: { trigger: aboutStats[0], start: 'top 90%', once: true }
      }
    );
  }

  // ─── 16. Orbit rings in Services section — gentle spin in ───
  const orbitRings = gsap.utils.toArray<HTMLElement>('[class*="orbitRing"]');
  orbitRings.forEach(ring => {
    gsap.fromTo(ring,
      { scale: 0.5, opacity: 0, rotate: -45 },
      {
        scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ring, start: 'top 85%', once: true }
      }
    );
  });

  // ─── 17. Hero section — entrance timeline ───
  const heroSection = document.querySelector('[class*="heroPremium"]');
  if (heroSection) {
    const tl = gsap.timeline({ delay: 0.1 });
    const heroLeft = heroSection.querySelector('[class*="heroPremiumLeft"]');
    const heroRight = heroSection.querySelector('[class*="heroPremiumVisual"]');
    const logosBar = heroSection.querySelector('[class*="heroPremiumLogosBar"]');

    if (heroLeft) tl.fromTo(heroLeft, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
    if (heroRight) tl.fromTo(heroRight, { x: 40, opacity: 0, scale: 0.95 }, { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.1);
    if (logosBar) tl.fromTo(logosBar, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5);
  }

  // ─── 18. Continuous subtle floating on hero portrait ───
  const portrait = document.querySelector('[class*="heroPremiumPortraitFrame"]');
  if (portrait) {
    gsap.to(portrait, {
      y: -12,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }

  // ─── 19. Experience timeline items — slide in ───
  const expItems = gsap.utils.toArray<HTMLElement>('[class*="expTimelineItem"]');
  if (expItems.length > 0) {
    gsap.fromTo(expItems,
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: expItems[0], start: 'top 88%', once: true }
      }
    );
  }

  // ─── 20. Services CTA Banner — scale in ───
  const servicesCTA = document.querySelector('[class*="servicesCTASection"]');
  if (servicesCTA) {
    gsap.fromTo(servicesCTA,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: servicesCTA, start: 'top 90%', once: true }
      }
    );
  }
}

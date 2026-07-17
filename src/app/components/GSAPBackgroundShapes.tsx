'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAPBackgroundShapes
 * Renders an extremely premium, movie-grade interactive background.
 * Includes:
 * 1. Cinematic Film Grain/Noise Overlay for high-end organic texture.
 * 2. Multi-layered bright glowing auroras (Neon Indigo, Royal Violet, Electric Cyan, Gold).
 * 3. Dynamic Cursor-Trailing Glow (Ambient Light Burst) that smoothly trails mouse coordinates.
 * 4. Geometric floating vectors with ScrollTrigger parallax.
 */
export default function GSAPBackgroundShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes = container.querySelectorAll('.gsap-floating-shape');
    const auroras = container.querySelectorAll('.gsap-bg-aurora');
    const cursorGlow = cursorGlowRef.current;

    // ─── 1. Aurora Blobs Floating & Morphing ───
    auroras.forEach((aurora, idx) => {
      gsap.to(aurora, {
        x: '+=random(-150, 150)',
        y: '+=random(-150, 150)',
        scale: 'random(0.9, 1.4)',
        duration: gsap.utils.random(12, 22),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: idx * 0.5,
      });
    });

    // ─── 2. Geometric Shapes Floating & Scroll Parallax ───
    shapes.forEach((shape, idx) => {
      gsap.set(shape, {
        x: gsap.utils.random(10, 90) + 'vw',
        y: gsap.utils.random(10, 90) + 'vh',
        rotation: gsap.utils.random(0, 360),
        scale: gsap.utils.random(0.7, 1.4),
      });

      // Float drift animation
      gsap.to(shape, {
        x: '+=random(-120, 120)',
        y: '+=random(-120, 120)',
        rotation: '+=random(-180, 180)',
        duration: gsap.utils.random(15, 25),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: idx * 0.3,
      });

      // Scroll Parallax Effect
      gsap.to(shape, {
        yPercent: gsap.utils.random(-200, 200),
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    });

    // ─── 3. Mouse-Follow Parallax & Cursor Glow Trail ───
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Parallax effect on backgrounds
      const xOffset = (clientX - window.innerWidth / 2) * 0.05;
      const yOffset = (clientY - window.innerHeight / 2) * 0.05;

      auroras.forEach((aurora, idx) => {
        const factor = (idx + 1) * 0.3;
        gsap.to(aurora, {
          xPercent: xOffset * factor,
          yPercent: yOffset * factor,
          duration: 3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      shapes.forEach((shape, idx) => {
        const factor = (idx + 1) * 0.45;
        gsap.to(shape, {
          xPercent: xOffset * factor,
          yPercent: yOffset * factor,
          duration: 2.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      // Ambient Cursor Glow Trail
      if (cursorGlow) {
        gsap.to(cursorGlow, {
          x: clientX,
          y: clientY,
          duration: 1.5,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    // Show cursor glow when mouse enters window
    const handleMouseEnter = () => {
      if (cursorGlow) {
        gsap.to(cursorGlow, { opacity: 1, duration: 0.5 });
      }
    };

    // Hide cursor glow when mouse leaves window
    const handleMouseLeave = () => {
      if (cursorGlow) {
        gsap.to(cursorGlow, { opacity: 0, duration: 0.5 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* ─── Cinematic Noise / Film Grain Overlay ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
          zIndex: 2,
        }}
      />

      {/* ─── Tech Grid Pattern with Subtle Color Accents ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(rgba(129, 140, 248, 0.12) 1.5px, transparent 1.5px),
            radial-gradient(rgba(192, 132, 252, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0, 24px 24px',
          opacity: 0.9,
          zIndex: 1,
        }}
      />

      {/* ─── Premium Ambient Cursor Trail Glow ─── */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.16) 0%, rgba(192, 132, 252, 0.06) 45%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0,
          mixBlendMode: 'screen',
          zIndex: 1,
        }}
      />

      {/* ─── Multilayered Colorful Auroras (Brighter and Richer) ─── */}
      
      {/* Aurora 1: Neon Cyan & Blue */}
      <div
        className="gsap-bg-aurora"
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, rgba(0,0,0,0) 70%)',
          filter: 'blur(110px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Aurora 2: Deep Indigo & Lavender */}
      <div
        className="gsap-bg-aurora"
        style={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.24) 0%, rgba(192, 132, 252, 0.1) 40%, rgba(0,0,0,0) 70%)',
          filter: 'blur(120px)',
          transform: 'translate(50%, -50%)',
        }}
      />

      {/* Aurora 3: Sunset Gold & Amber Accent */}
      <div
        className="gsap-bg-aurora"
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '25%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(236, 72, 153, 0.04) 50%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          transform: 'translate(-50%, 50%)',
        }}
      />

      {/* ─── Interactive Vector Elements ─── */}

      {/* Vector 1: Elegant Wireframe Web-Ring */}
      <svg
        className="gsap-floating-shape"
        width="160"
        height="160"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', opacity: 0.35 }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(129, 140, 248, 0.45)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <circle
          cx="50"
          cy="50"
          r="44.5"
          fill="none"
          stroke="rgba(129, 140, 248, 0.1)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Vector 2: Nested Rings */}
      <svg
        className="gsap-floating-shape"
        width="220"
        height="220"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', opacity: 0.3 }}
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(192, 132, 252, 0.35)" strokeWidth="1" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(192, 132, 252, 0.2)" strokeWidth="0.75" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(192, 132, 252, 0.1)" strokeWidth="0.5" />
      </svg>

      {/* Vector 3: Floating Rotating Octagon Grid */}
      <svg
        className="gsap-floating-shape"
        width="130"
        height="130"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', opacity: 0.35 }}
      >
        <polygon
          points="50,5 82,18 95,50 82,82 50,95 18,82 5,50 18,18"
          fill="none"
          stroke="rgba(6, 182, 212, 0.4)"
          strokeWidth="1.5"
        />
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.75" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.75" />
      </svg>

      {/* Vector 4: Glassmorphic Floating Panel */}
      <div
        className="gsap-floating-shape"
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          border: '1.5px solid rgba(129, 140, 248, 0.35)',
          background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.12) 0%, rgba(192, 132, 252, 0.05) 100%)',
          backdropFilter: 'blur(3px)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(129, 140, 248, 0.15)',
        }}
      />

      {/* Vector 5: 4-Point Sparkling Star */}
      <svg
        className="gsap-floating-shape"
        width="90"
        height="90"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', opacity: 0.4 }}
      >
        <path
          d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z"
          fill="rgba(192, 132, 252, 0.45)"
        />
      </svg>
    </div>
  );
}

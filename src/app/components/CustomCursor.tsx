'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinates using Framer Motion variables
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring configuration for smooth premium lag
  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Setup interactive hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.style.cursor === 'pointer' ||
        target.classList.contains('interactive-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Glow Ball */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorXSpring,
          y: cursorYSpring,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: '1px solid var(--accent-gold)',
          boxShadow: isHovered 
            ? '0 0 30px rgba(212, 175, 55, 0.4)' 
            : '0 0 15px rgba(212, 175, 55, 0.1)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.05)' : 'rgba(212, 175, 55, 0)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
      />
      {/* Central Pointer Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(14px, 14px)' // Center it inside the 32x32 glow ball
        }}
        ref={(el) => {
          if (!el) return;
          const updateDot = (e: MouseEvent) => {
            el.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
          };
          window.addEventListener('mousemove', updateDot);
        }}
      />
    </>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for trailing outer ring
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 220, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 220, mass: 0.6 });

  // Direct fast spring for inner dot (no lag, super responsive)
  const dotX = useSpring(mouseX, { damping: 45, stiffness: 450, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 45, stiffness: 450, mass: 0.2 });

  useEffect(() => {
    // Check if device supports touch
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half of cursor size to center
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Glow Ring (will-change optimized) */}
      <motion.div
        style={{
          position: 'fixed',
          left: -16,
          top: -16,
          x: ringX,
          y: ringY,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: '1.5px solid var(--accent-gold)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform, width, height',
        }}
        animate={{
          scale: isHovered ? 1.7 : 1,
          borderColor: isHovered ? 'var(--accent-gold-hover)' : 'var(--accent-gold)',
          backgroundColor: isHovered ? 'rgba(129, 140, 248, 0.08)' : 'rgba(129, 140, 248, 0)',
          boxShadow: isHovered 
            ? '0 0 25px rgba(129, 140, 248, 0.45)' 
            : '0 0 8px rgba(129, 140, 248, 0.1)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
      
      {/* Inner Central Pointer Dot (Direct performance tracker) */}
      <motion.div
        style={{
          position: 'fixed',
          left: -3,
          top: -3,
          x: dotX,
          y: dotY,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold-hover)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
    </>
  );
}

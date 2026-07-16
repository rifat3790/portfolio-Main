'use client';

import React, { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for interactive push/pull force
    const mouse = { x: -1000, y: -1000, active: false };

    // Setup color palette
    const colors = {
      primary: 'rgba(96, 165, 250, 0.12)', // Cyan-blue
      secondary: 'rgba(167, 139, 250, 0.12)', // Purple
      accent: 'rgba(212, 175, 55, 0.08)', // Gold
      gshape1: 'rgba(59, 130, 246, 0.03)',
      gshape2: 'rgba(139, 92, 246, 0.03)',
      gshape3: 'rgba(245, 158, 11, 0.02)',
    };

    // Particle class for the interactive constellation network
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseSize = Math.random() * 2 + 1.5;
        this.size = this.baseSize;

        // Distribute colors across nodes
        const rand = Math.random();
        if (rand < 0.45) {
          this.color = colors.primary;
        } else if (rand < 0.8) {
          this.color = colors.secondary;
        } else {
          this.color = colors.accent;
        }
      }

      update() {
        // Floating drift
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Cursor magnetic interaction
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 180;

          if (dist < maxDist) {
            // Smooth gravitational attraction or push
            const force = (maxDist - dist) / maxDist;
            this.x -= (dx / dist) * force * 0.8;
            this.y -= (dy / dist) * force * 0.8;
            this.size = this.baseSize + force * 1.5;
          } else {
            if (this.size > this.baseSize) {
              this.size -= 0.05;
            }
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Large floating geometric blur objects (G-shapes)
    class FloatingShape {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      color: string;
      scaleX: number;
      scaleY: number;

      constructor(color: string, radius: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = radius;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.0003 + 0.0001;
        this.color = color;
        this.scaleX = Math.random() * 0.4 + 0.8;
        this.scaleY = Math.random() * 0.4 + 0.8;
      }

      update() {
        this.angle += this.speed;
        this.x += Math.sin(this.angle) * 0.15;
        this.y += Math.cos(this.angle) * 0.15;

        // Reset boundaries
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * 0.1);
        ctx.scale(this.scaleX, this.scaleY);

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace('0.03', '0.015').replace('0.02', '0.01'));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Populate particles and geometric overlay blobs
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    const particles: Particle[] = Array.from({ length: count }, () => new Particle());

    const shapes = [
      new FloatingShape(colors.gshape1, 350),
      new FloatingShape(colors.gshape2, 400),
      new FloatingShape(colors.gshape3, 250),
      new FloatingShape(colors.gshape1, 280),
    ];

    // Animation Tick
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw large background blurred G-shapes
      shapes.forEach((shape) => {
        shape.update();
        shape.draw();
      });

      // 2. Update and draw constellation network particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // 3. Connect particles with premium web links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          const connectionLimit = 150;

          if (dist < connectionLimit) {
            const alpha = (1 - dist / connectionLimit) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            // Set drawing style
            ctx.lineWidth = 0.6;
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    // Start
    tick();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
}

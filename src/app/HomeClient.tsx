'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './home.module.css';
import CustomCursor from './components/CustomCursor';

// Section Components
import Navbar from './sections/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import About from './sections/About/About';
import Services from './sections/Services/Services';
import Projects from './sections/Projects/Projects';
import Experience from './sections/Experience/Experience';
import Skills from './sections/Skills/Skills';
import Testimonials from './sections/Testimonials/Testimonials';
import Blogs from './sections/Blogs/Blogs';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';

// Shared Types
import { HomeClientProps, IProject } from './sections/shared/types';

// Dynamic imports (client-only)
const ChatWidget = dynamic(() => import('./components/ChatWidget'), { ssr: false });
const ProjectModal = dynamic(() => import('./components/ProjectModal'), { ssr: false });
const GSAPAnimations = dynamic(() => import('./components/GSAPAnimations'), { ssr: false });
const GSAPBackgroundShapes = dynamic(() => import('./components/GSAPBackgroundShapes'), { ssr: false });

export default function HomeClient({
  initialProjects,
  initialSkills,
  initialTestimonials,
  initialBlogs,
  initialServices,
  initialExperiences,
  siteSettings
}: HomeClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Dynamically update favicon
  useEffect(() => {
    if (siteSettings?.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.favicon;
    }
  }, [siteSettings?.favicon]);

  return (
    <div className={styles.container}>
      <CustomCursor />

      {/* Background Effects */}
      <div className={styles.meshGlowContainer}>
        <div className={styles['luxury-mesh-glow']} />
      </div>
      <GSAPBackgroundShapes />

      {/* Navbar */}
      <Navbar
        siteSettings={siteSettings}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Hero */}
      <Hero siteSettings={siteSettings} />

      {/* About */}
      <About siteSettings={siteSettings} />

      {/* Services */}
      <Services
        siteSettings={siteSettings}
        initialServices={initialServices}
      />

      {/* Projects */}
      <Projects
        siteSettings={siteSettings}
        initialProjects={initialProjects}
        onSelectProject={setSelectedProject}
      />

      {/* Experience */}
      <Experience
        siteSettings={siteSettings}
        initialExperiences={initialExperiences}
      />

      {/* Skills */}
      <Skills
        siteSettings={siteSettings}
        initialSkills={initialSkills}
      />

      {/* Testimonials */}
      <Testimonials
        siteSettings={siteSettings}
        initialTestimonials={initialTestimonials}
      />

      {/* Blogs */}
      <Blogs
        siteSettings={siteSettings}
        initialBlogs={initialBlogs}
      />

      {/* Contact */}
      <Contact siteSettings={siteSettings} />

      {/* Footer */}
      <Footer siteSettings={siteSettings} />

      {/* GSAP Premium Animations */}
      <GSAPAnimations />

      {/* Floating Chat Widget */}
      <ChatWidget siteSettings={siteSettings} />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

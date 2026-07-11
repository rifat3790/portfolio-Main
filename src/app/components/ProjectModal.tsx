'use client';

import React from 'react';
import { X, ExternalLink, Code } from 'lucide-react';
import styles from '../home.module.css';

interface IProject {
  _id: string;
  title: string;
  description: string;
  richText?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
}

interface ProjectModalProps {
  project: IProject;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className={styles.projectModalOverlay} onClick={onClose}>
      <div className={styles.projectModalContent} onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <button onClick={onClose} className={styles.projectModalClose}>
            <X size={20} />
          </button>
          <img src={project.image} alt={project.title} className={styles.projectModalImg} />
        </div>

        <div className={styles.projectModalMeta}>
          <h2 className={`${styles.projectModalTitle} gold-gradient-text`}>{project.title}</h2>
          <p className={styles.projectModalDesc}>{project.description}</p>
          
          {project.richText && (
            <div 
              className={styles.projectModalRich}
              dangerouslySetInnerHTML={{ __html: project.richText }}
            />
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
            {project.techStack.map(t => (
              <span key={t} className={styles.projectTag}>{t}</span>
            ))}
          </div>

          <div className={styles.projectModalActions}>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium-gold"
              >
                Launch Site <ExternalLink size={14} style={{ marginLeft: 8 }} />
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium-outline"
              >
                View Source <Code size={14} style={{ marginLeft: 8 }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

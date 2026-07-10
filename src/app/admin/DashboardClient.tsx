'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Briefcase,
  Layers,
  Quote,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Send,
  Image as ImageIcon,
  ExternalLink,
  X,
  Star,
  Sparkles,
  BookOpen,
  Settings,
  Database,
  Globe
} from 'lucide-react';
import styles from './admin.module.css';

type Tab = 'chat' | 'messages' | 'projects' | 'skills' | 'testimonials' | 'blogs' | 'settings';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.adminBrand}>Aura Console</h2>
            <div className={styles.adminStatus}>
              <span className={styles.statusIndicator} />
              <span>Owner Online</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab('chat')}
              className={`${styles.navItem} ${activeTab === 'chat' ? styles.navItemActive : ''}`}
            >
              <MessageSquare size={18} />
              <span>Live Chats</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`${styles.navItem} ${activeTab === 'messages' ? styles.navItemActive : ''}`}
            >
              <MessageSquare size={18} />
              <span>Contact Forms</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`${styles.navItem} ${activeTab === 'projects' ? styles.navItemActive : ''}`}
            >
              <Briefcase size={18} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`${styles.navItem} ${activeTab === 'skills' ? styles.navItemActive : ''}`}
            >
              <Layers size={18} />
              <span>Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`${styles.navItem} ${activeTab === 'testimonials' ? styles.navItemActive : ''}`}
            >
              <Quote size={18} />
              <span>Testimonials</span>
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`${styles.navItem} ${activeTab === 'blogs' ? styles.navItemActive : ''}`}
            >
              <BookOpen size={18} />
              <span>Journal (Blogs)</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${styles.navItem} ${activeTab === 'settings' ? styles.navItemActive : ''}`}
            >
              <Settings size={18} />
              <span>Settings Console</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className={`${styles.navItem} ${styles.logoutBtn}`}
          >
            <LogOut size={18} />
            <span>{logoutLoading ? 'Leaving...' : 'Logout'}</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {activeTab === 'chat' && <ChatManager />}
          {activeTab === 'messages' && <ContactMessagesManager />}
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'skills' && <SkillManager />}
          {activeTab === 'testimonials' && <TestimonialManager />}
          {activeTab === 'blogs' && <BlogManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. CHAT MANAGER COMPONENT
   ========================================================================== */
interface IChatSession {
  sessionId: string;
  userName: string;
  unreadCount: number;
  updatedAt: string;
}

interface IMessage {
  _id?: string;
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  image?: string;
  createdAt: string;
}

function ChatManager() {
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<IChatSession | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [imageInput, setImageInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all chat sessions
  const fetchSessions = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch messages for active session
  const fetchMessages = async (sessId: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sessId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Periodic Polling
  useEffect(() => {
    fetchSessions(true);
    const interval = setInterval(() => {
      fetchSessions();
      if (selectedSession) {
        fetchMessages(selectedSession.sessionId);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedSession?.sessionId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectSession = (session: IChatSession) => {
    setSelectedSession(session);
    // Mark local session as read instantly for responsiveness
    setSessions(prev =>
      prev.map(s => s.sessionId === session.sessionId ? { ...s, unreadCount: 0 } : s)
    );
    fetchMessages(session.sessionId);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || (!inputText.trim() && !imageInput)) return;

    const messageData = {
      sessionId: selectedSession.sessionId,
      sender: 'admin',
      text: inputText,
      image: imageInput || undefined,
    };

    // Optimistic Update
    const optimisticMsg: IMessage = {
      sessionId: selectedSession.sessionId,
      sender: 'admin',
      text: inputText,
      image: imageInput || undefined,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setImageInput(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (res.ok) {
        fetchMessages(selectedSession.sessionId);
        fetchSessions();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteSession = async (sessId: string) => {
    if (!confirm('Are you sure you want to delete this chat session? This will remove all messages.')) return;

    try {
      const res = await fetch(`/api/admin/chat/${sessId}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedSession(null);
        setMessages([]);
        fetchSessions();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Communication Board</h1>
        <p className={styles.adminStatus}>Live conversations with your visitors</p>
      </div>

      <div className={styles.chatManagerGrid}>
        {/* Sidebar Sessions */}
        <div className={styles.sessionList}>
          {sessions.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              No messages received yet.
            </div>
          ) : (
            sessions.map(s => {
              const lastUpdated = new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={s.sessionId}
                  onClick={() => handleSelectSession(s)}
                  className={`${styles.sessionItem} ${selectedSession?.sessionId === s.sessionId ? styles.sessionItemActive : ''}`}
                >
                  <div className={styles.sessionItemHeader}>
                    <span className={styles.sessionName}>{s.userName}</span>
                    <span className={styles.sessionTime}>{lastUpdated}</span>
                  </div>
                  <div className={styles.sessionSub}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>ID: {s.sessionId.substring(0, 8)}</span>
                    {s.unreadCount > 0 && (
                      <span className={styles.sessionUnreadBadge}>{s.unreadCount}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Console */}
        <div style={{ background: 'var(--bg-tertiary)' }}>
          {selectedSession ? (
            <div className={styles.chatConsole}>
              <div className={styles.chatConsoleHeader}>
                <div className={styles.chatConsoleUser}>
                  <span className={styles.chatConsoleName}>{selectedSession.userName}</span>
                  <span className={styles.chatConsoleId}>Session: {selectedSession.sessionId}</span>
                </div>
                <button
                  onClick={() => handleDeleteSession(selectedSession.sessionId)}
                  className={styles.deleteSessionBtn}
                  title="Delete conversation"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className={styles.messageArea}>
                {messages.map((m, idx) => {
                  const isAdmin = m.sender === 'admin';
                  const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={m._id || idx}
                      className={`${styles.msgRow} ${isAdmin ? styles.msgRowAdmin : styles.msgRowUser}`}
                    >
                      <div className={`${styles.msgBubble} ${isAdmin ? styles.msgBubbleAdmin : styles.msgBubbleUser}`}>
                        {m.image && (
                          <img
                            src={m.image}
                            alt="Received attachment"
                            className={styles.msgImage}
                            onClick={() => window.open(m.image, '_blank')}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        {m.text && <p className={styles.msgText}>{m.text}</p>}
                        <span className={`${styles.msgTime} ${isAdmin ? styles.msgTimeAdmin : styles.msgTimeUser}`}>
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              {/* Chat Input */}
              <div className={styles.chatConsoleInputArea}>
                {imageInput && (
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12, border: '1px solid var(--accent-gold)', borderRadius: 4, padding: 4 }}>
                    <img src={imageInput} alt="Preview" style={{ height: 60, borderRadius: 2 }} />
                    <button
                      type="button"
                      onClick={() => setImageInput(null)}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', border: 'none', borderRadius: '50%', color: 'white', padding: 2, cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSend} className={styles.chatInputForm}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.actionBtn}
                    title="Send Image"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter reply..."
                    className={styles.chatInputText}
                  />
                  <button type="submit" className="btn-premium btn-premium-gold" style={{ padding: '0 20px', height: 46 }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className={styles.noChatSelected}>
              <MessageSquare size={48} className={styles.emptyStateIcon} />
              <h3>Select a Conversation</h3>
              <p>Choose a visitor session from the sidebar to start live chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PROJECTS CRUD MANAGER
   ========================================================================== */
interface IProject {
  _id: string;
  title: string;
  description: string;
  richText?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  order: number;
}

function ProjectManager() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [richText, setRichText] = useState('');
  const [image, setImage] = useState('');
  const [techStack, setTechStack] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [order, setOrder] = useState(0);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setRichText('');
    setImage('');
    setTechStack('');
    setLiveLink('');
    setGithubLink('');
    setOrder(projects.length);
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProject) => {
    setEditId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setRichText(p.richText || '');
    setImage(p.image);
    setTechStack(p.techStack.join(', '));
    setLiveLink(p.liveLink || '');
    setGithubLink(p.githubLink || '');
    setOrder(p.order);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert('Title, Description, and Image are required.');
      return;
    }

    const dataPayload = {
      title,
      description,
      richText,
      image,
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      liveLink,
      githubLink,
      order: Number(order),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/projects/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      } else {
        res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Showcase Projects</h1>
        <button onClick={openNewModal} className="btn-premium btn-premium-gold" style={{ gap: 8 }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase size={40} className={styles.emptyStateIcon} />
          <h3>No Projects Added</h3>
          <p>Click "Add Project" to display your custom showcase.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {projects.map(p => (
            <div key={p._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                <img src={p.image} alt={p.title} className={styles.crudItemThumb} />
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle}>{p.title}</span>
                  <span className={styles.crudItemSubtitle}>{p.techStack.join(' • ')}</span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button onClick={() => openEditModal(p)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(p._id)} className={`${styles.actionBtn} styles.actionBtnDelete`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Modify Project' : 'New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Order index</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Brief Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, Mongoose, Framer Motion"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Live Demo URL</label>
                <input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>GitHub Code URL</label>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Detailed Description (HTML/Rich Text)</label>
                <textarea
                  value={richText}
                  onChange={(e) => setRichText(e.target.value)}
                  className={styles.textarea}
                  placeholder="Rich text details shown in modal overlay..."
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Project Banner Image</label>
                <div className={styles.imageUploadArea} onClick={() => document.getElementById('projectFile')?.click()}>
                  {image ? (
                    <img src={image} alt="Preview" className={styles.imagePreview} />
                  ) : (
                    <>
                      <ImageIcon size={32} color="var(--accent-gold)" />
                      <span>Select Banner Image File</span>
                    </>
                  )}
                  <input
                    type="file"
                    id="projectFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. SKILLS CRUD MANAGER
   ========================================================================== */
interface ISkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
  order: number;
}

function SkillManager() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState(80);
  const [iconName, setIconName] = useState('');
  const [order, setOrder] = useState(0);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setName('');
    setCategory('Frontend');
    setProficiency(80);
    setIconName('');
    setOrder(skills.length);
    setIsModalOpen(true);
  };

  const openEditModal = (s: ISkill) => {
    setEditId(s._id);
    setName(s.name);
    setCategory(s.category);
    setProficiency(s.proficiency);
    setIconName(s.iconName || '');
    setOrder(s.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const dataPayload = {
      name,
      category,
      proficiency: Number(proficiency),
      iconName,
      order: Number(order),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/skills/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      } else {
        res = await fetch('/api/admin/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Professional Skills</h1>
        <button onClick={openNewModal} className="btn-premium btn-premium-gold" style={{ gap: 8 }}>
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className={styles.emptyState}>
          <Layers size={40} className={styles.emptyStateIcon} />
          <h3>No Skills Added</h3>
          <p>Add tools and technologies to render your interactive skill charts.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {skills.map(s => (
            <div key={s._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle}>{s.name}</span>
                  <span className={styles.crudItemSubtitle}>
                    Category: {s.category} • Proficiency: {s.proficiency}%
                  </span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button onClick={() => openEditModal(s)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(s._id)} className={`${styles.actionBtn} styles.actionBtnDelete`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skill Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Modify Skill' : 'New Skill'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Skill Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, Figma, Python"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.input}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                  <option value="Tools/Other">Tools/Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Proficiency (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Icon Name (Lucide React)</label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="e.g. Code, Database, Cpu"
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Order index</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. TESTIMONIALS CRUD MANAGER
   ========================================================================== */
interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  reviewText: string;
  avatar?: string;
  rating: number;
  order: number;
}

function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [avatar, setAvatar] = useState('');
  const [rating, setRating] = useState(5);
  const [order, setOrder] = useState(0);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setName('');
    setRole('');
    setCompany('');
    setReviewText('');
    setAvatar('');
    setRating(5);
    setOrder(testimonials.length);
    setIsModalOpen(true);
  };

  const openEditModal = (t: ITestimonial) => {
    setEditId(t._id);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company);
    setReviewText(t.reviewText);
    setAvatar(t.avatar || '');
    setRating(t.rating);
    setOrder(t.order);
    setIsModalOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reviewText) return;

    const dataPayload = {
      name,
      role,
      company,
      reviewText,
      avatar,
      rating: Number(rating),
      order: Number(order),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/testimonials/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      } else {
        res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Client Testimonials</h1>
        <button onClick={openNewModal} className="btn-premium btn-premium-gold" style={{ gap: 8 }}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className={styles.emptyState}>
          <Quote size={40} className={styles.emptyStateIcon} />
          <h3>No Testimonials Added</h3>
          <p>Publish client reviews and endorsements on your home portal.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {testimonials.map(t => (
            <div key={t._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                {t.avatar && <img src={t.avatar} alt={t.name} className={styles.crudItemThumb} style={{ borderRadius: '50%' }} />}
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle}>{t.name}</span>
                  <span className={styles.crudItemSubtitle}>
                    {t.role} at {t.company} • {t.rating} Stars
                  </span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button onClick={() => openEditModal(t)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(t._id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Modify Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. CTO, Design Director"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Order index</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Client Quote / Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className={styles.textarea}
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Client Avatar</label>
                <div className={styles.imageUploadArea} onClick={() => document.getElementById('avatarFile')?.click()}>
                  {avatar ? (
                    <img src={avatar} alt="Preview" className={styles.imagePreview} style={{ borderRadius: '50%' }} />
                  ) : (
                    <>
                      <ImageIcon size={32} color="var(--accent-gold)" />
                      <span>Select Avatar Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    id="avatarFile"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Save Changes' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. BLOG MANAGER COMPONENT
   ========================================================================== */
interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  readTime: string;
  published: boolean;
  order: number;
  createdAt?: string;
}

function BlogManager() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [published, setPublished] = useState(true);
  const [order, setOrder] = useState(0);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setImage('');
    setTagsStr('');
    setReadTime('5 min read');
    setPublished(true);
    setOrder(blogs.length);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: IBlog) => {
    setEditId(blog._id || null);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImage(blog.image || '');
    setTagsStr(blog.tags.join(', '));
    setReadTime(blog.readTime);
    setPublished(blog.published);
    setOrder(blog.order);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) return;

    const dataPayload = {
      title,
      slug,
      excerpt,
      content,
      image,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      readTime,
      published,
      order: Number(order)
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/blogs/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload)
        });
      } else {
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save blog post');
      }
    } catch (err) {
      console.error('Error submitting blog:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Journal (Blog) Console</h1>
        <button onClick={openNewModal} className="btn-premium btn-premium-gold" style={{ gap: 8 }}>
          <Plus size={16} /> Write Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className={styles.emptyState}>
          <BookOpen size={40} className={styles.emptyStateIcon} />
          <h3>No Journal Posts Yet</h3>
          <p>Draft or publish premium thoughts, case studies, and insights.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {blogs.map(blog => (
            <div key={blog._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                {blog.image && <img src={blog.image} alt={blog.title} className={styles.crudItemThumb} />}
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle}>
                    {blog.title} {!blog.published && <span style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>[DRAFT]</span>}
                  </span>
                  <span className={styles.crudItemSubtitle}>
                    {blog.readTime} • Tags: {blog.tags.join(', ')}
                  </span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button onClick={() => openEditModal(blog)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(blog._id || '')} className={`${styles.actionBtn} styles.actionBtnDelete`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Write/Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Edit Journal Entry' : 'Create New Journal Entry'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Article Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Custom Slug (Optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. custom-slug-url"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Read Time</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g., 5 min read"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Order index</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Design, Next.js, Luxury, Development"
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Brief Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a catchy 1-2 sentence hook for the homepage feed..."
                  className={styles.input}
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Article Content (Markdown Supported)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.textarea}
                  style={{ minHeight: '300px', fontFamily: 'monospace' }}
                  placeholder="# Heading 1\nWrite your content here..."
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Cover Image (Base64)</label>
                <div className={styles.imageUploadArea} onClick={() => document.getElementById('blogImageFile')?.click()}>
                  {image ? (
                    <img src={image} alt="Preview" className={styles.imagePreview} style={{ maxHeight: '180px', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <ImageIcon size={32} color="var(--accent-gold)" />
                      <span>Select Cover Banner Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    id="blogImageFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                />
                <label htmlFor="published" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>Publish immediately</label>
              </div>

              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Update Post' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. SETTINGS MANAGER COMPONENT
   ========================================================================== */
interface INavbarLink {
  label: string;
  url: string;
}

interface ISetting {
  logoText: string;
  logoImage?: string;
  heroBannerImage?: string;
  favicon?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtn1Text: string;
  heroBtn1Url: string;
  heroBtn2Text: string;
  heroBtn2Url: string;
  aboutHeading: string;
  aboutText: string;
  footerText: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  navbarLinks: INavbarLink[];
  typewriterRoles?: string;
  projectsLayout?: string;
  skillsLayout?: string;
  testimonialsLayout?: string;
  blogsLayout?: string;
}

function SettingsManager() {
  const [logoText, setLogoText] = useState('AURA');
  const [logoImage, setLogoImage] = useState('');
  const [heroBannerImage, setHeroBannerImage] = useState('');
  const [favicon, setFavicon] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBtn1Text, setHeroBtn1Text] = useState('');
  const [heroBtn1Url, setHeroBtn1Url] = useState('');
  const [heroBtn2Text, setHeroBtn2Text] = useState('');
  const [heroBtn2Url, setHeroBtn2Url] = useState('');
  const [aboutHeading, setAboutHeading] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [navbarLinks, setNavbarLinks] = useState<INavbarLink[]>([]);
  const [typewriterRoles, setTypewriterRoles] = useState('Refayet Hossen, Full Stack Developer, Shopify Developer');
  const [projectsLayout, setProjectsLayout] = useState('asymmetric');
  const [skillsLayout, setSkillsLayout] = useState('category-progress');
  const [testimonialsLayout, setTestimonialsLayout] = useState('grid');
  const [blogsLayout, setBlogsLayout] = useState('editorial-rows');

  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings?t=' + Date.now());
      if (res.ok) {
        const data = (await res.json()) as ISetting;
        setLogoText(data.logoText || 'AURA');
        setLogoImage(data.logoImage || '');
        setHeroBannerImage(data.heroBannerImage || '');
        setFavicon(data.favicon || '');
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroBtn1Text(data.heroBtn1Text || '');
        setHeroBtn1Url(data.heroBtn1Url || '');
        setHeroBtn2Text(data.heroBtn2Text || '');
        setHeroBtn2Url(data.heroBtn2Url || '');
        setAboutHeading(data.aboutHeading || '');
        setAboutText(data.aboutText || '');
        setFooterText(data.footerText || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setGithub(data.github || '');
        setLinkedin(data.linkedin || '');
        setWhatsapp(data.whatsapp || '');
        setNavbarLinks(data.navbarLinks || []);
        setTypewriterRoles(data.typewriterRoles || 'Refayet Hossen, Full Stack Developer, Shopify Developer');
        setProjectsLayout(data.projectsLayout || 'asymmetric');
        setSkillsLayout(data.skillsLayout || 'category-progress');
        setTestimonialsLayout(data.testimonialsLayout || 'grid');
        setBlogsLayout(data.blogsLayout || 'editorial-rows');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavLinkChange = (index: number, field: keyof INavbarLink, value: string) => {
    const updated = [...navbarLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavbarLinks(updated);
  };

  const addNavLink = () => {
    setNavbarLinks([...navbarLinks, { label: 'New Link', url: '#' }]);
  };

  const removeNavLink = (index: number) => {
    setNavbarLinks(navbarLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      logoText,
      logoImage,
      heroBannerImage,
      favicon,
      heroTitle,
      heroSubtitle,
      heroBtn1Text,
      heroBtn1Url,
      heroBtn2Text,
      heroBtn2Url,
      aboutHeading,
      aboutText,
      footerText,
      email,
      phone,
      github,
      linkedin,
      whatsapp,
      navbarLinks,
      typewriterRoles,
      projectsLayout,
      skillsLayout,
      testimonialsLayout,
      blogsLayout
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Site Settings successfully updated!');
      } else {
        alert('Failed to update settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('Warning: Seeding database will clear existing Skills, Projects, Testimonials, Blogs and Settings, and replace them with curated premium layout contents. Do you want to proceed?')) {
      return;
    }
    setSeedLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Database successfully seeded!');
        fetchSettings(); // Refresh
      } else {
        alert('Seeding failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Seeding encountered an error.');
    } finally {
      setSeedLoading(false);
    }
  };

  if (loading && !heroTitle) {
    return (
      <div className={styles.emptyState}>
        <h3>Connecting Settings Console...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>System Curation Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Form panel */}
        <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>BRANDING & LAYOUT</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Navbar Brand Text</label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Portrait Image (Circle)</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button type="button" onClick={() => document.getElementById('logoUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Upload Portrait
              </button>
              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
              {logoImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logoImage} alt="Portrait" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--glass-border-light)', padding: 2, background: '#000' }} />
                  <button type="button" onClick={() => setLogoImage('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Custom Favicon (Square PNG/SVG)</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button type="button" onClick={() => document.getElementById('faviconUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Upload Favicon
              </button>
              <input
                type="file"
                id="faviconUpload"
                accept="image/*"
                onChange={handleFaviconUpload}
                style={{ display: 'none' }}
              />
              {favicon && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={favicon} alt="Favicon" style={{ width: 32, height: 32, objectFit: 'contain', border: '1px solid var(--glass-border-light)', padding: 2, background: '#000' }} />
                  <button type="button" onClick={() => setFavicon('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>LAYOUT & TYPEWRITER CONFIG</h3>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Hero Typewriter Roles (comma-separated)</label>
            <input
              type="text"
              value={typewriterRoles}
              onChange={(e) => setTypewriterRoles(e.target.value)}
              className={styles.input}
              placeholder="e.g. Refayet Hossen, Full Stack Developer, Shopify Developer"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Selected Works Layout</label>
            <select
              value={projectsLayout}
              onChange={(e) => setProjectsLayout(e.target.value)}
              className={styles.input}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
            >
              <option value="asymmetric">Asymmetric Gallery (Modern)</option>
              <option value="grid">Classic Luxury Card Grid</option>
              <option value="carousel">Horizontal Drag Carousel</option>
              <option value="masonry">Staggered Height Masonry Grid</option>
              <option value="stacked-list">Large List Rows (Expand Hover Image)</option>
              <option value="minimal-cards">Borderless Minimal Hover Cards</option>
              <option value="split-parallax">Split Columns with Parallax Scroll</option>
              <option value="minimal-list">Simple Text Links (Image on Hover)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Technical Proficiency Layout</label>
            <select
              value={skillsLayout}
              onChange={(e) => setSkillsLayout(e.target.value)}
              className={styles.input}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
            >
              <option value="category-progress">Category Progress Bars</option>
              <option value="grid-cards">3D Glass Cards Grid</option>
              <option value="marquee">Infinite Smooth Marquee</option>
              <option value="minimal-tags">Elegant Minimalist Badge Cloud</option>
              <option value="timeline-steps">Staggered Skill Flow Columns</option>
              <option value="two-column-list">Sleek Dual-Column Table</option>
              <option value="circular-progress">Circular Progress Dials</option>
              <option value="badge-cloud">Modern Compact Badge Cloud</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Client Reviews Layout</label>
            <select
              value={testimonialsLayout}
              onChange={(e) => setTestimonialsLayout(e.target.value)}
              className={styles.input}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
            >
              <option value="grid">Staggered Columns Grid</option>
              <option value="carousel">Dragging Card Carousel</option>
              <option value="masonry">Luxury Masonry Wall</option>
              <option value="single-featured">Huge Single Quote Slider</option>
              <option value="split-editorial">Split Sticky Review Cards</option>
              <option value="bubble-chat">Conversational Bubble Messages Mockup</option>
              <option value="minimalist-citations">Elegant Gold Signature Quotes</option>
              <option value="infinite-scroll">Auto-Scrolling Review Ribbon</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Journal Blogs Layout</label>
            <select
              value={blogsLayout}
              onChange={(e) => setBlogsLayout(e.target.value)}
              className={styles.input}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
            >
              <option value="editorial-split-sticky">Split Sticky Editorial (Featured Layout)</option>
              <option value="editorial-rows">Editorial List Rows (Minimal)</option>
              <option value="cards-grid">Premium Post Cards Grid</option>
              <option value="magazine-split">Magazine Split Columns (One Large Featured)</option>
              <option value="magazine-cover">Digital Cover Blog Slider</option>
              <option value="asymmetric-cards">Staggered Large Alternate Blocks</option>
              <option value="horizontal-strip">Inline Scrolling Strip Cards</option>
              <option value="minimalist-list">Date-Focused Golden Text List</option>
            </select>
          </div>


          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>HERO SCREEN COPY</h3>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Hero Background Banner Image (Optional Full Page Background)</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button type="button" onClick={() => document.getElementById('bannerUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Upload Full Background
              </button>
              <input
                type="file"
                id="bannerUpload"
                accept="image/*"
                onChange={handleBannerImageUpload}
                style={{ display: 'none' }}
              />
              {heroBannerImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={heroBannerImage} alt="Banner" style={{ height: 40, width: 80, objectFit: 'cover', border: '1px solid var(--glass-border-light)' }} />
                  <button type="button" onClick={() => setHeroBannerImage('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Main Hero Heading</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Hero Subtitle Copy</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className={styles.textarea}
              style={{ minHeight: '60px' }}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Primary Button Text</label>
            <input
              type="text"
              value={heroBtn1Text}
              onChange={(e) => setHeroBtn1Text(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Primary Button Link</label>
            <input
              type="text"
              value={heroBtn1Url}
              onChange={(e) => setHeroBtn1Url(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Secondary Button Text</label>
            <input
              type="text"
              value={heroBtn2Text}
              onChange={(e) => setHeroBtn2Text(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Secondary Button Link</label>
            <input
              type="text"
              value={heroBtn2Url}
              onChange={(e) => setHeroBtn2Url(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>ABOUT CURIOSITY STORY</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Story Section Heading</label>
            <input
              type="text"
              value={aboutHeading}
              onChange={(e) => setAboutHeading(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Biography Story Content</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className={styles.textarea}
              style={{ minHeight: '120px' }}
              required
            />
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>FOOTER & CONTACT</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GitHub Profile URL</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>WhatsApp Number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Footer Signature Label</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>NAVIGATION LINKS</h3>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {navbarLinks.map((link, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleNavLinkChange(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Projects)"
                    className={styles.input}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleNavLinkChange(idx, 'url', e.target.value)}
                    placeholder="URL Path (e.g. #projects)"
                    className={styles.input}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeNavLink(idx)} className={styles.actionBtn} style={{ color: 'var(--status-offline)', border: '1px solid rgba(220,53,69,0.2)', height: '44px', width: '44px', padding: 0 }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addNavLink} className="btn-premium btn-premium-outline" style={{ alignSelf: 'start', fontSize: '0.8rem', padding: '6px 12px', marginTop: 4 }}>
                + Add Custom Nav Link
              </button>
            </div>
          </div>

          <div className={`${styles.formActions} ${styles.formSpanFull}`} style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '16px' }}>
            <button type="submit" disabled={loading} className="btn-premium btn-premium-gold" style={{ width: '100%' }}>
              {loading ? 'Saving Curation Settings...' : 'Save Configuration Changes'}
            </button>
          </div>
        </form>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Seeding panel */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', gap: 12, color: 'var(--accent-gold)', marginBottom: 12 }}>
              <Database size={24} />
              <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Core Seeding Tools</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: 16 }}>
              Need to populate the database with premium designs, projects, testimonials, and blog articles instantly? Click below to seed elite layout data.
            </p>
            
            <button 
              type="button" 
              onClick={handleSeedDatabase} 
              disabled={seedLoading}
              className="btn-premium btn-premium-gold"
              style={{ width: '100%', gap: 8 }}
            >
              <Sparkles size={16} />
              {seedLoading ? 'Seeding Database...' : 'Seed Premium Dummy Data'}
            </button>
          </div>

          {/* Quick instructions */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Configuration Rules</h4>
            <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Changing navbar links reflects instantly across the public portfolio header menus.</li>
              <li>Favicon uploads will change the website browser tab icon dynamically.</li>
              <li>Hero headings automatically support text reveals inside the visual showcase.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   7. CONTACT MESSAGES COMPONENT
   ========================================================================== */

interface IContactFormMsg {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function ContactMessagesManager() {
  const [messages, setMessages] = useState<IContactFormMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMessage, setActiveMessage] = useState<IContactFormMsg | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentReadStatus: boolean) => {
    if (currentReadStatus) return; // already read
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true })
      });
      fetchMessages(); // Refresh list to reflect read status
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Contact Form Submissions</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border-light)' }}>
            <h3 style={{ color: 'var(--accent-gold)' }}>Inbox</h3>
          </div>
          {messages.length === 0 ? (
             <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>No messages received.</div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {messages.map(msg => (
                <div 
                  key={msg._id} 
                  onClick={() => {
                    setActiveMessage(msg);
                    markAsRead(msg._id, msg.read);
                  }}
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid var(--glass-border-light)', 
                    cursor: 'pointer',
                    background: activeMessage?._id === msg._id ? 'var(--bg-tertiary)' : 'transparent',
                    borderLeft: !msg.read ? '4px solid var(--accent-gold)' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: !msg.read ? 'bold' : 'normal', color: 'var(--text-primary)' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: 4 }}>{msg.subject}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)', padding: '24px', minHeight: '400px' }}>
          {!activeMessage ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              Select a message to read.
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{activeMessage.subject}</h2>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>From: <span style={{ color: 'var(--text-primary)' }}>{activeMessage.name}</span> &lt;{activeMessage.email}&gt;</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {new Date(activeMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                {activeMessage.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

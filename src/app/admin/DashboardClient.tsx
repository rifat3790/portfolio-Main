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
  Globe,
  Palette,
  Smartphone,
  Cpu,
  Shield,
  Layout,
  Code,
  Clock,
  Mail,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Printer,
  FileText,
  Download,
  Eye,
  Menu,
  ArrowLeft
} from 'lucide-react';
import styles from './admin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import WalletManager from './components/WalletManager';
import TeamTrackerManager from './components/TeamTrackerManager';

const compressImage = (base64Str: string, maxWidth: number, maxHeight: number, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

type Tab = 'chat' | 'messages' | 'projects' | 'skills' | 'testimonials' | 'blogs' | 'services' | 'experiences' | 'newsletter' | 'hero-settings' | 'about-settings' | 'brand-settings' | 'wallet' | 'team-tracker';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    // Auto hide
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

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
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.menuToggleBtn} aria-label="Toggle Sidebar">
          <Menu size={24} />
        </button>
        <span className={styles.mobileBrand}>Rifat Console</span>
        <div className={styles.mobileActiveTab}>
          {activeTab.replace('-', ' ')}
        </div>
      </header>

      {isSidebarOpen && (
        <div className={styles.sidebarBackdrop} onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.adminBrand}>Rifat Console</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
              <span>OWNER ONLINE</span>
            </div>
          </div>

          <nav className={styles.navMenu}>
            <button
              onClick={() => selectTab('chat')}
              className={`${styles.navItem} ${activeTab === 'chat' ? styles.navItemActive : ''}`}
            >
              <MessageSquare size={18} />
              <span>Live Chats</span>
            </button>

            <button
              onClick={() => selectTab('messages')}
              className={`${styles.navItem} ${activeTab === 'messages' ? styles.navItemActive : ''}`}
            >
              <Send size={18} />
              <span>Contact Forms</span>
            </button>

            <button
              onClick={() => selectTab('projects')}
              className={`${styles.navItem} ${activeTab === 'projects' ? styles.navItemActive : ''}`}
            >
              <Briefcase size={18} />
              <span>Projects</span>
            </button>

            <button
              onClick={() => selectTab('skills')}
              className={`${styles.navItem} ${activeTab === 'skills' ? styles.navItemActive : ''}`}
            >
              <Layers size={18} />
              <span>Skills</span>
            </button>

            <button
              onClick={() => selectTab('testimonials')}
              className={`${styles.navItem} ${activeTab === 'testimonials' ? styles.navItemActive : ''}`}
            >
              <Quote size={18} />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => selectTab('blogs')}
              className={`${styles.navItem} ${activeTab === 'blogs' ? styles.navItemActive : ''}`}
            >
              <BookOpen size={18} />
              <span>Journal (Blogs)</span>
            </button>

            <button
              onClick={() => selectTab('services')}
              className={`${styles.navItem} ${activeTab === 'services' ? styles.navItemActive : ''}`}
            >
              <Sparkles size={18} />
              <span>Services (What I Do)</span>
            </button>

            <button
              onClick={() => selectTab('experiences')}
              className={`${styles.navItem} ${activeTab === 'experiences' ? styles.navItemActive : ''}`}
            >
              <Clock size={18} />
              <span>Experience Timeline</span>
            </button>

            <button
              onClick={() => selectTab('hero-settings')}
              className={`${styles.navItem} ${activeTab === 'hero-settings' ? styles.navItemActive : ''}`}
            >
              <Layout size={18} />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => selectTab('about-settings')}
              className={`${styles.navItem} ${activeTab === 'about-settings' ? styles.navItemActive : ''}`}
            >
              <Briefcase size={18} />
              <span>About Section</span>
            </button>

            <button
              onClick={() => selectTab('brand-settings')}
              className={`${styles.navItem} ${activeTab === 'brand-settings' ? styles.navItemActive : ''}`}
            >
              <Globe size={18} />
              <span>Branding & Socials</span>
            </button>

            <button
              onClick={() => selectTab('newsletter')}
              className={`${styles.navItem} ${activeTab === 'newsletter' ? styles.navItemActive : ''}`}
            >
              <Mail size={18} />
              <span>Newsletter</span>
            </button>

            <button
              onClick={() => selectTab('wallet')}
              className={`${styles.navItem} ${activeTab === 'wallet' ? styles.navItemActive : ''}`}
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '8px', paddingTop: '12px' }}
            >
              <Wallet size={18} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontWeight: 600 }}>Personal Wallet</span>
            </button>

            <button
              onClick={() => selectTab('team-tracker')}
              className={`${styles.navItem} ${activeTab === 'team-tracker' ? styles.navItemActive : ''}`}
            >
              <TrendingUp size={18} style={{ color: '#00e5ff' }} />
              <span style={{ fontWeight: 600 }}>Team Workload</span>
            </button>
          </nav>

          <button
            onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
            disabled={logoutLoading}
            className={`${styles.navItem} ${styles.logoutBtn}`}
          >
            <LogOut size={18} />
            <span>{logoutLoading ? 'Leaving...' : 'Logout'}</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {activeTab === 'chat' && <ChatManager showToast={showToast} />}
          {activeTab === 'messages' && <ContactMessagesManager showToast={showToast} />}
          {activeTab === 'projects' && <ProjectManager showToast={showToast} />}
          {activeTab === 'skills' && <SkillManager showToast={showToast} />}
          {activeTab === 'testimonials' && <TestimonialManager showToast={showToast} />}
          {activeTab === 'blogs' && <BlogManager showToast={showToast} />}
          {activeTab === 'services' && <ServiceManager showToast={showToast} />}
          {activeTab === 'experiences' && <ExperienceManager showToast={showToast} />}
          {activeTab === 'newsletter' && <NewsletterManager showToast={showToast} />}
          {activeTab === 'hero-settings' && <HeroSettingsManager showToast={showToast} />}
          {activeTab === 'about-settings' && <AboutSettingsManager showToast={showToast} />}
          {activeTab === 'brand-settings' && <BrandSettingsManager showToast={showToast} />}
          {activeTab === 'wallet' && <WalletManager showToast={showToast} />}
          {activeTab === 'team-tracker' && <TeamTrackerManager showToast={showToast} />}
        </main>
      </div>

      {/* Animated Custom Toast Popup */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              background: toast.type === 'success' ? '#1c3d28' : toast.type === 'error' ? '#4d1c1c' : 'var(--bg-tertiary)',
              border: `1px solid ${toast.type === 'success' ? '#2e7d32' : toast.type === 'error' ? '#c62828' : 'var(--accent-gold)'}`,
              padding: '16px 24px',
              borderRadius: '8px',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              pointerEvents: 'none'
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: toast.type === 'success' ? '#4caf50' : toast.type === 'error' ? '#f44336' : 'var(--accent-gold)'
            }} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   1. CHAT MANAGER COMPONENT
   ========================================================================== */
interface IChatSession {
  sessionId: string;
  userName: string;
  userEmail?: string;
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

function ChatManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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
      const res = await fetch('/api/admin/chat');
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
      const res = await fetch(`/api/admin/chat?sessionId=${sessId}`);
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
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 600, 600, 0.7);
        setImageInput(compressed);
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

      <div className={`${styles.chatManagerGrid} ${selectedSession ? styles.chatActive : ''}`}>
        {/* Sidebar Sessions */}
        <div className={styles.sessionList}>
          {sessions.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                  {s.userEmail && (
                    <div style={{ fontSize: '0.78rem', color: '#60a5fa', marginBottom: '4px', wordBreak: 'break-all' }}>
                      {s.userEmail}
                    </div>
                  )}
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
        <div className={styles.chatConsoleWrapper} style={{ background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {selectedSession ? (
            <div className={styles.chatConsole}>
              <div className={styles.chatConsoleHeader}>
                <button
                  onClick={() => setSelectedSession(null)}
                  className={styles.chatBackButton}
                  title="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className={styles.chatConsoleUser}>
                  <span className={styles.chatConsoleName}>{selectedSession.userName}</span>
                  <span className={styles.chatConsoleId}>
                    {selectedSession.userEmail ? `${selectedSession.userEmail} • ` : ''}Session: {selectedSession.sessionId}
                  </span>
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
  category?: string;
  screenshots?: string[];
  role?: string;
  duration?: string;
  projectType?: string;
  keyFeatures?: string;
  isFeatured?: boolean;
  password?: string;
}

function ProjectManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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
  const [category, setCategory] = useState('Web Applications');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [role, setRole] = useState('Developer');
  const [duration, setDuration] = useState('');
  const [projectType, setProjectType] = useState('Web Application');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [password, setPassword] = useState('');
  const [categoriesList, setCategoriesList] = useState<string[]>(['Web Applications', 'E-Commerce', 'Dashboard', 'Landing Page', 'Other']);
  const [newCategoryInput, setNewCategoryInput] = useState('');

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

  const fetchSettingsForCategories = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.projectCategories) {
          const list = data.projectCategories.split(',').map((c: string) => c.trim()).filter(Boolean);
          setCategoriesList(list);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSettingsForCategories();
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
    setCategory(categoriesList[0] || 'Web Applications');
    setScreenshots([]);
    setRole('Developer');
    setDuration('');
    setProjectType('Web Application');
    setKeyFeatures('');
    setIsFeatured(false);
    setPassword('');
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
    setCategory(p.category || 'Web Applications');
    setScreenshots(p.screenshots || []);
    setRole(p.role || 'Developer');
    setDuration(p.duration || '');
    setProjectType(p.projectType || 'Web Application');
    setKeyFeatures(p.keyFeatures || '');
    setIsFeatured(!!p.isFeatured);
    setPassword(p.password || '');
    setOrder(p.order);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
        setImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
            resolve(compressed);
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((results) => {
        setScreenshots(prev => [...prev, ...results]);
      });
    }
  };

  const removeScreenshot = (idx: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      showToast('Title, Description, and Image are required.', 'error');
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
      category,
      screenshots,
      role,
      duration,
      projectType,
      keyFeatures,
      isFeatured,
      password,
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
        showToast(editId ? 'Project updated successfully!' : 'Project created successfully!', 'success');
        setIsModalOpen(false);
        fetchProjects();
      } else {
        showToast(editId ? 'Failed to update project.' : 'Failed to create project.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while saving the project.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Project deleted successfully!', 'success');
        fetchProjects();
      } else {
        showToast('Failed to delete project.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while deleting the project.', 'error');
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.input}
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Or Add New Category Inline</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newCategoryInput.trim();
                      if (trimmed && !categoriesList.includes(trimmed)) {
                        setCategoriesList(prev => [...prev, trimmed]);
                        setCategory(trimmed);
                        setNewCategoryInput('');
                        showToast(`Category "${trimmed}" added! Save settings later to persist globally.`, 'info');
                      }
                    }}
                    className="btn-premium btn-premium-gold"
                    style={{ padding: '0 16px', fontSize: '0.8rem', height: '42px' }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '32px' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                />
                <label htmlFor="isFeatured" className={styles.label} style={{ cursor: 'pointer', margin: 0 }}>
                  Mark as Featured Project
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Developer Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. Feb 2024 - Apr 2024"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Type</label>
                <input
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g. Web Application"
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Password (Optional)</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. secret123"
                  className={styles.input}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Key Features (one per line)</label>
                <textarea
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className={styles.textarea}
                  placeholder="User authentication & authorization&#10;Product listing with advanced filtering&#10;Shopping cart & checkout with Stripe"
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

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Additional Screenshots Gallery</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {screenshots.map((shot, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--glass-border-light)' }}>
                      <img src={shot} alt="Screenshot thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(220, 53, 69, 0.8)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.65rem',
                          lineHeight: 1
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('screenshotUpload')?.click()}
                  className="btn-premium btn-premium-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                  Upload Screenshot Files
                </button>
                <input
                  type="file"
                  id="screenshotUpload"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleScreenshots}
                  style={{ display: 'none' }}
                />
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

function SkillManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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

function TestimonialManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 200, 200, 0.7);
        setAvatar(compressed);
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

function BlogManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
        setImage(compressed);
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
        showToast(errData.error || 'Failed to save blog post', 'error');
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
   5. SERVICES CRUD MANAGER
   ========================================================================== */
function ServiceManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [services, setServices] = useState<IService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code');
  const [order, setOrder] = useState(0);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setIconName('Code');
    setOrder(services.length);
    setIsModalOpen(true);
  };

  const openEditModal = (s: IService) => {
    setEditId(s._id);
    setTitle(s.title);
    setDescription(s.description);
    setIconName(s.iconName || 'Code');
    setOrder(s.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const dataPayload = {
      title,
      description,
      iconName,
      order: Number(order),
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/admin/services/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      } else {
        res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
        showToast(editId ? 'Service updated successfully!' : 'Service created successfully!', 'success');
      } else {
        showToast('Failed to save service', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving service', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
        showToast('Service deleted successfully!', 'success');
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting service', 'error');
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Service Offerings</h1>
        <button onClick={openNewModal} className="btn-premium btn-premium-gold" style={{ gap: 8 }}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className={styles.emptyState}>
          <Sparkles size={40} className={styles.emptyStateIcon} />
          <h3>No Services Added</h3>
          <p>Add the services you offer to show them on your homepage.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {services.map(s => (
            <div key={s._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  background: 'rgba(var(--accent-gold-rgb), 0.1)',
                  border: '1px solid rgba(var(--accent-gold-rgb), 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                  marginRight: '12px',
                  fontSize: '0.9rem'
                }}>
                  {s.iconName === 'Palette' && <Palette size={16} />}
                  {s.iconName === 'Smartphone' && <Smartphone size={16} />}
                  {s.iconName === 'Globe' && <Globe size={16} />}
                  {s.iconName === 'Cpu' && <Cpu size={16} />}
                  {s.iconName === 'Database' && <Database size={16} />}
                  {s.iconName === 'Shield' && <Shield size={16} />}
                  {s.iconName === 'Layout' && <Layout size={16} />}
                  {s.iconName === 'Layers' && <Layers size={16} />}
                  {s.iconName !== 'Palette' && s.iconName !== 'Smartphone' && s.iconName !== 'Globe' && s.iconName !== 'Cpu' && s.iconName !== 'Database' && s.iconName !== 'Shield' && s.iconName !== 'Layout' && s.iconName !== 'Layers' && <Code size={16} />}
                </div>
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle}>{s.title}</span>
                  <span className={styles.crudItemSubtitle}>
                    Order: {s.order} • Icon: {s.iconName}
                  </span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button onClick={() => openEditModal(s)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(s._id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Modify Service' : 'New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Service Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  style={{ minHeight: '100px' }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Visual Icon Representative</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className={styles.input}
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
                >
                  <option value="Code">Code (Development)</option>
                  <option value="Palette">Palette (UI/UX Design)</option>
                  <option value="Smartphone">Smartphone (Mobile Apps)</option>
                  <option value="Globe">Globe (Websites)</option>
                  <option value="Cpu">Cpu (System Integrations)</option>
                  <option value="Database">Database (Data Warehousing)</option>
                  <option value="Shield">Shield (Cyber Security)</option>
                  <option value="Layout">Layout (Frontend Architecture)</option>
                  <option value="Layers">Layers (Full Stack Structure)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sort Order Index</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className={styles.input}
                  required
                />
              </div>

              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Save Changes' : 'Publish Service'}
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
   5B. EXPERIENCE CRUD MANAGER
   ========================================================================== */
interface IExperience {
  _id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  employmentType?: string;
  description: string;
  responsibilities?: string;
  techStack: string[];
  logo?: string;
  order: number;
  isCurrent: boolean;
}

function ExperienceManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [logo, setLogo] = useState('');
  const [order, setOrder] = useState(0);
  const [isCurrent, setIsCurrent] = useState(false);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/admin/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data || []);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEdit = (exp: IExperience) => {
    setEditId(exp._id);
    setCompany(exp.company);
    setRole(exp.role);
    setLocation(exp.location || '');
    setDuration(exp.duration);
    setEmploymentType(exp.employmentType || 'Full-time');
    setDescription(exp.description);
    setResponsibilities(exp.responsibilities || '');
    setTechStackInput((exp.techStack || []).join(', '));
    setLogo(exp.logo || '');
    setOrder(exp.order || 0);
    setIsCurrent(exp.isCurrent || false);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditId(null);
    setCompany('');
    setRole('');
    setLocation('');
    setDuration('');
    setEmploymentType('Full-time');
    setDescription('');
    setResponsibilities('');
    setTechStackInput('');
    setLogo('');
    setOrder(experiences.length);
    setIsCurrent(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience timeline item?')) return;
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Experience item deleted successfully!', 'success');
        fetchExperiences();
      } else {
        showToast('Failed to delete experience item.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error occurred while deleting.', 'error');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400, 0.7);
        setLogo(compressed);
      };
      reader.readAsDataURL(file);
    }
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techStack = techStackInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const body = {
      company,
      role,
      location,
      duration,
      employmentType,
      description,
      responsibilities,
      techStack,
      logo,
      order,
      isCurrent
    };

    try {
      const url = editId ? `/api/admin/experiences/${editId}` : '/api/admin/experiences';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showToast(editId ? 'Experience saved successfully!' : 'Experience created successfully!', 'success');
        setIsModalOpen(false);
        fetchExperiences();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to save experience.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error saving experience item.', 'error');
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <div>
          <h1 className={styles.contentTitle}>Work Experience Timeline</h1>
          <p className={styles.adminStatus}>Manage your professional background timeline shown on the home page</p>
        </div>
        <button onClick={handleCreateNew} className="btn-premium btn-premium-gold" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className={styles.emptyState}>
          <Clock size={40} className={styles.emptyStateIcon} />
          <h3>No Experiences Registered</h3>
          <p>Click "Add Experience" to create one.</p>
        </div>
      ) : (
        <div className={styles.crudList}>
          {experiences.sort((a,b) => a.order - b.order).map((exp) => (
            <div key={exp._id} className={styles.crudItemCard}>
              <div className={styles.crudItemMeta}>
                <div style={{ width: '50px', height: '50px', background: '#fff', border: '1px solid var(--glass-border-light)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {exp.logo ? (
                    <img src={exp.logo} alt={exp.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.2rem' }}>{exp.company.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.crudItemInfo}>
                  <span className={styles.crudItemTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {exp.company}
                    {exp.isCurrent && (
                      <span style={{ background: 'rgba(129, 140, 248, 0.1)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600 }}>Current</span>
                    )}
                  </span>
                  <span className={styles.crudItemSubtitle}>{exp.role} • {exp.duration}</span>
                </div>
              </div>
              <div className={styles.crudActions}>
                <button type="button" onClick={() => handleEdit(exp)} className={styles.actionBtn} title="Edit">
                  <Edit size={16} />
                </button>
                <button type="button" onClick={() => handleDelete(exp._id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editId ? 'Edit Work Experience' : 'Add Work Experience'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Name *</label>
                <input 
                  type="text" 
                  required 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  className={styles.input} 
                  placeholder="e.g. Google"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Job Title / Role *</label>
                <input 
                  type="text" 
                  required 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className={styles.input} 
                  placeholder="e.g. Senior Frontend Architect"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className={styles.input} 
                  placeholder="e.g. Mountain View, CA (Remote)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Duration (Dates) *</label>
                <input 
                  type="text" 
                  required 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  className={styles.input} 
                  placeholder="e.g. Jan 2023 - Present or 2021 - 2022"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Employment Type</label>
                <select 
                  value={employmentType} 
                  onChange={e => setEmploymentType(e.target.value)} 
                  className={styles.input}
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Display Order</label>
                <input 
                  type="number" 
                  value={order} 
                  onChange={e => setOrder(parseInt(e.target.value) || 0)} 
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="isCurrent"
                  checked={isCurrent} 
                  onChange={e => setIsCurrent(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                />
                <label htmlFor="isCurrent" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>
                  This is my current company/role
                </label>
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Short Job Description *</label>
                <textarea 
                  required 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className={styles.textarea} 
                  placeholder="Summarize your main responsibilities and achievements in this role..."
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Key Responsibilities (One per line)</label>
                <textarea 
                  value={responsibilities} 
                  onChange={e => setResponsibilities(e.target.value)} 
                  className={styles.textarea} 
                  placeholder="e.g. Built responsive interfaces using Next.js&#10;Integrated third-party APIs&#10;Led team of developers"
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Tech Stack Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={techStackInput} 
                  onChange={e => setTechStackInput(e.target.value)} 
                  className={styles.input} 
                  placeholder="e.g. Next.js, React, Node.js, TypeScript"
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
                <label className={styles.label}>Company Logo Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('expLogoUpload') as HTMLInputElement;
                      if (input) { input.value = ''; input.click(); }
                    }}
                    className="btn-premium btn-premium-outline"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  >
                    {logo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <input 
                    type="file" 
                    id="expLogoUpload"
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    style={{ display: 'none' }}
                  />
                  {logo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '60px', height: '60px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={logo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogo('')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles.formActions} ${styles.formSpanFull}`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-premium btn-premium-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-premium-gold">
                  {editId ? 'Save Changes' : 'Create Timeline Item'}
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
interface IService {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

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
  aboutTitle?: string;
  aboutImage?: string;
  aboutName?: string;
  aboutEmail?: string;
  aboutLocation?: string;
  aboutAvailability?: string;
  aboutCvText?: string;
  aboutCvUrl?: string;
  aboutCvFile?: string;
  aboutCvFileName?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
  headerFooterRole?: string;
  serviceStat1Value?: string;
  serviceStat1Label?: string;
  serviceStat2Value?: string;
  serviceStat2Label?: string;
  serviceStat3Value?: string;
  serviceStat3Label?: string;
  projectStat1Value?: string;
  projectStat1Label?: string;
  projectStat2Value?: string;
  projectStat2Label?: string;
  projectStat3Value?: string;
  projectStat3Label?: string;
  projectStat4Value?: string;
  projectStat4Label?: string;
  expStat1Value?: string;
  expStat1Label?: string;
  expStat2Value?: string;
  expStat2Label?: string;
  expStat3Value?: string;
  expStat3Label?: string;
  expStat4Value?: string;
  expStat4Label?: string;
  testiStat1Value?: string;
  testiStat1Label?: string;
  testiStat2Value?: string;
  testiStat2Label?: string;
  testiStat3Value?: string;
  testiStat3Label?: string;
  testiStat4Value?: string;
  testiStat4Label?: string;
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
  servicesPerRow?: number;
  servicesAutoScroll?: boolean;
  projectsPerRow?: number;
  projectCategories?: string;
  heroTagline?: string;
  heroTitleCursive?: string;
  heroSpecializationText?: string;
  heroShowFreelanceBadge?: boolean;
  heroFreelanceText?: string;
  // About Feature Cards
  aboutFeature1Title?: string;
  aboutFeature1Desc?: string;
  aboutFeature2Title?: string;
  aboutFeature2Desc?: string;
  aboutFeature3Title?: string;
  aboutFeature3Desc?: string;
  // About Signature & Quote
  aboutSignatureRole?: string;
  aboutQuoteText?: string;
  // About Core Values
  aboutValue1Title?: string;
  aboutValue1Desc?: string;
  aboutValue2Title?: string;
  aboutValue2Desc?: string;
  aboutValue3Title?: string;
  aboutValue3Desc?: string;
  aboutValue4Title?: string;
  aboutValue4Desc?: string;
}

function HeroSettingsManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBtn1Text, setHeroBtn1Text] = useState('');
  const [heroBtn1Url, setHeroBtn1Url] = useState('');
  const [heroBtn2Text, setHeroBtn2Text] = useState('');
  const [heroBtn2Url, setHeroBtn2Url] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [heroTitleCursive, setHeroTitleCursive] = useState('');
  const [heroSpecializationText, setHeroSpecializationText] = useState('');
  const [heroShowFreelanceBadge, setHeroShowFreelanceBadge] = useState(true);
  const [heroFreelanceText, setHeroFreelanceText] = useState('');
  const [heroBannerImage, setHeroBannerImage] = useState('');
  const [heroBannerImageDirty, setHeroBannerImageDirty] = useState(false);
  const [typewriterRoles, setTypewriterRoles] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings?t=' + Date.now());
      if (res.ok) {
        const data = (await res.json()) as ISetting;
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroBtn1Text(data.heroBtn1Text || '');
        setHeroBtn1Url(data.heroBtn1Url || '');
        setHeroBtn2Text(data.heroBtn2Text || '');
        setHeroBtn2Url(data.heroBtn2Url || '');
        setHeroTagline(data.heroTagline || '');
        setHeroTitleCursive(data.heroTitleCursive || '');
        setHeroSpecializationText(data.heroSpecializationText || '');
        setHeroShowFreelanceBadge(data.heroShowFreelanceBadge !== false);
        setHeroFreelanceText(data.heroFreelanceText || '');
        setHeroBannerImage(data.heroBannerImage || '');
        setTypewriterRoles(data.typewriterRoles || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 1200, 1200, 0.7);
        setHeroBannerImage(compressed);
        setHeroBannerImageDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: any = {
      heroTitle,
      heroSubtitle,
      heroBtn1Text,
      heroBtn1Url,
      heroBtn2Text,
      heroBtn2Url,
      heroTagline,
      heroTitleCursive,
      heroSpecializationText,
      heroShowFreelanceBadge: !!heroShowFreelanceBadge,
      heroFreelanceText,
      typewriterRoles
    };
    if (heroBannerImageDirty) {
      payload.heroBannerImage = heroBannerImage;
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Hero settings successfully updated!', 'success');
        setHeroBannerImageDirty(false);
      } else {
        showToast('Failed to update Hero settings.', 'error');
      }
    } catch (err) {
      showToast('Error updating Hero settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !heroTitle) {
    return <div className={styles.emptyState}><h3>Connecting Hero Settings...</h3></div>;
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Hero Section Curation</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>HERO SECTION CONFIG</h3>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Hero Background Banner Image</label>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button type="button" onClick={() => document.getElementById('heroBannerUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
              Upload Banner
            </button>
            <input
              type="file"
              id="heroBannerUpload"
              accept="image/*"
              onChange={handleBannerImageUpload}
              style={{ display: 'none' }}
            />
            {heroBannerImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={heroBannerImage} alt="Banner" style={{ height: 40, width: 80, objectFit: 'cover', border: '1px solid var(--glass-border-light)' }} />
                <button type="button" onClick={() => { setHeroBannerImage(''); setHeroBannerImageDirty(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Main Hero Heading</label>
          <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={styles.input} required />
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Hero Subtitle Copy</label>
          <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={styles.textarea} style={{ minHeight: '60px' }} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Primary Button Text</label>
          <input type="text" value={heroBtn1Text} onChange={(e) => setHeroBtn1Text(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Primary Button Link</label>
          <input type="text" value={heroBtn1Url} onChange={(e) => setHeroBtn1Url(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Secondary Button Text</label>
          <input type="text" value={heroBtn2Text} onChange={(e) => setHeroBtn2Text(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Secondary Button Link</label>
          <input type="text" value={heroBtn2Url} onChange={(e) => setHeroBtn2Url(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hero Small Greeting Tagline</label>
          <input type="text" value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} className={styles.input} placeholder="e.g., HI, I'M REFAYET HOSSEN 👋" />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hero Title Cursive Overlay Word/Phrase</label>
          <input type="text" value={heroTitleCursive} onChange={(e) => setHeroTitleCursive(e.target.value)} className={styles.input} placeholder="e.g., That Make Impact" />
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Hero Specializations Box Content (one per line)</label>
          <textarea value={heroSpecializationText} onChange={(e) => setHeroSpecializationText(e.target.value)} className={styles.textarea} style={{ minHeight: '60px' }} placeholder="Shopify • Next.js • React&#10;Node.js • MongoDB" />
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Hero Typewriter Roles (comma-separated)</label>
          <input type="text" value={typewriterRoles} onChange={(e) => setTypewriterRoles(e.target.value)} className={styles.input} placeholder="e.g. Refayet Hossen, Full Stack Developer, Shopify Developer" required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Freelance Status Text</label>
          <input type="text" value={heroFreelanceText} onChange={(e) => setHeroFreelanceText(e.target.value)} className={styles.input} placeholder="e.g., Available for freelance" />
        </div>

        <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '32px' }}>
          <input type="checkbox" id="heroShowFreelanceBadge" checked={heroShowFreelanceBadge} onChange={(e) => setHeroShowFreelanceBadge(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }} />
          <label htmlFor="heroShowFreelanceBadge" className={styles.label} style={{ cursor: 'pointer', margin: 0 }}>Show Freelance Status Badge</label>
        </div>

        <div className={`${styles.formActions} ${styles.formSpanFull}`} style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '16px' }}>
          <button type="submit" disabled={loading} className="btn-premium btn-premium-gold" style={{ width: '100%' }}>
            {loading ? 'Saving Hero Configuration...' : 'Save Hero Section Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function AboutSettingsManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [aboutHeading, setAboutHeading] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [aboutImageDirty, setAboutImageDirty] = useState(false);
  const [aboutName, setAboutName] = useState('');
  const [aboutEmail, setAboutEmail] = useState('');
  const [aboutLocation, setAboutLocation] = useState('');
  const [aboutAvailability, setAboutAvailability] = useState('');
  const [aboutCvText, setAboutCvText] = useState('');
  const [aboutCvUrl, setAboutCvUrl] = useState('');
  const [aboutCvFile, setAboutCvFile] = useState('');
  const [aboutCvFileName, setAboutCvFileName] = useState('');
  const [aboutCvFileDirty, setAboutCvFileDirty] = useState(false);
  const [stat1Value, setStat1Value] = useState('');
  const [stat1Label, setStat1Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [stat3Value, setStat3Value] = useState('');
  const [stat3Label, setStat3Label] = useState('');
  const [stat4Value, setStat4Value] = useState('');
  const [stat4Label, setStat4Label] = useState('');

  const [serviceStat1Value, setServiceStat1Value] = useState('');
  const [serviceStat1Label, setServiceStat1Label] = useState('');
  const [serviceStat2Value, setServiceStat2Value] = useState('');
  const [serviceStat2Label, setServiceStat2Label] = useState('');
  const [serviceStat3Value, setServiceStat3Value] = useState('');
  const [serviceStat3Label, setServiceStat3Label] = useState('');

  const [projectStat1Value, setProjectStat1Value] = useState('');
  const [projectStat1Label, setProjectStat1Label] = useState('');
  const [projectStat2Value, setProjectStat2Value] = useState('');
  const [projectStat2Label, setProjectStat2Label] = useState('');
  const [projectStat3Value, setProjectStat3Value] = useState('');
  const [projectStat3Label, setProjectStat3Label] = useState('');
  const [projectStat4Value, setProjectStat4Value] = useState('');
  const [projectStat4Label, setProjectStat4Label] = useState('');

  const [expStat1Value, setExpStat1Value] = useState('');
  const [expStat1Label, setExpStat1Label] = useState('');
  const [expStat2Value, setExpStat2Value] = useState('');
  const [expStat2Label, setExpStat2Label] = useState('');
  const [expStat3Value, setExpStat3Value] = useState('');
  const [expStat3Label, setExpStat3Label] = useState('');
  const [expStat4Value, setExpStat4Value] = useState('');
  const [expStat4Label, setExpStat4Label] = useState('');

  const [testiStat1Value, setTestiStat1Value] = useState('');
  const [testiStat1Label, setTestiStat1Label] = useState('');
  const [testiStat2Value, setTestiStat2Value] = useState('');
  const [testiStat2Label, setTestiStat2Label] = useState('');
  const [testiStat3Value, setTestiStat3Value] = useState('');
  const [testiStat3Label, setTestiStat3Label] = useState('');
  const [testiStat4Value, setTestiStat4Value] = useState('');
  const [testiStat4Label, setTestiStat4Label] = useState('');

  // About Feature Cards
  const [aboutFeature1Title, setAboutFeature1Title] = useState('');
  const [aboutFeature1Desc, setAboutFeature1Desc] = useState('');
  const [aboutFeature2Title, setAboutFeature2Title] = useState('');
  const [aboutFeature2Desc, setAboutFeature2Desc] = useState('');
  const [aboutFeature3Title, setAboutFeature3Title] = useState('');
  const [aboutFeature3Desc, setAboutFeature3Desc] = useState('');
  // About Signature & Quote
  const [aboutSignatureRole, setAboutSignatureRole] = useState('');
  const [aboutQuoteText, setAboutQuoteText] = useState('');
  // About Core Values
  const [aboutValue1Title, setAboutValue1Title] = useState('');
  const [aboutValue1Desc, setAboutValue1Desc] = useState('');
  const [aboutValue2Title, setAboutValue2Title] = useState('');
  const [aboutValue2Desc, setAboutValue2Desc] = useState('');
  const [aboutValue3Title, setAboutValue3Title] = useState('');
  const [aboutValue3Desc, setAboutValue3Desc] = useState('');
  const [aboutValue4Title, setAboutValue4Title] = useState('');
  const [aboutValue4Desc, setAboutValue4Desc] = useState('');

  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings?t=' + Date.now());
      if (res.ok) {
        const data = (await res.json()) as ISetting;
        setAboutHeading(data.aboutHeading || '');
        setAboutText(data.aboutText || '');
        setAboutTitle(data.aboutTitle || '');
        setAboutImage(data.aboutImage || '');
        setAboutName(data.aboutName || 'Md. Refayet Hossen');
        setAboutEmail(data.aboutEmail || 'refayet@example.com');
        setAboutLocation(data.aboutLocation || 'Dhaka, Bangladesh');
        setAboutAvailability(data.aboutAvailability || 'Open for opportunities');
        setAboutCvText(data.aboutCvText || 'Download CV');
        setAboutCvUrl(data.aboutCvUrl || '#');
        setAboutCvFile(data.aboutCvFile || '');
        setAboutCvFileName(data.aboutCvFileName || 'CV.pdf');
        setStat1Value(data.stat1Value || '5+');
        setStat1Label(data.stat1Label || 'Years Experience');
        setStat2Value(data.stat2Value || '50+');
        setStat2Label(data.stat2Label || 'Projects Completed');
        setStat3Value(data.stat3Value || '20+');
        setStat3Label(data.stat3Label || 'Happy Clients');
        setStat4Value(data.stat4Value || '100%');
        setStat4Label(data.stat4Label || 'Client Satisfaction');

        setServiceStat1Value(data.serviceStat1Value || '99.9%');
        setServiceStat1Label(data.serviceStat1Label || 'Uptime & Performance');
        setServiceStat2Value(data.serviceStat2Value || 'Clean');
        setServiceStat2Label(data.serviceStat2Label || 'Architecture');
        setServiceStat3Value(data.serviceStat3Value || '24/7');
        setServiceStat3Label(data.serviceStat3Label || 'Support & Comm');

        setProjectStat1Value(data.projectStat1Value || 'Pixel');
        setProjectStat1Label(data.projectStat1Label || 'Precision UI');
        setProjectStat2Value(data.projectStat2Value || 'Fluid');
        setProjectStat2Label(data.projectStat2Label || 'Animations');
        setProjectStat3Value(data.projectStat3Value || 'Mobile');
        setProjectStat3Label(data.projectStat3Label || 'First Design');
        setProjectStat4Value(data.projectStat4Value || 'SEO');
        setProjectStat4Label(data.projectStat4Label || 'Optimized (A+)');

        setExpStat1Value(data.expStat1Value || '10k+');
        setExpStat1Label(data.expStat1Label || 'Hours Coding');
        setExpStat2Value(data.expStat2Value || 'Agile');
        setExpStat2Label(data.expStat2Label || 'Workflow');
        setExpStat3Value(data.expStat3Value || 'Modern');
        setExpStat3Label(data.expStat3Label || 'Tool Stacks');
        setExpStat4Value(data.expStat4Value || 'Swift');
        setExpStat4Label(data.expStat4Label || 'Resolution Rate');

        setTestiStat1Value(data.testiStat1Value || '5.0');
        setTestiStat1Label(data.testiStat1Label || 'Average Rating');
        setTestiStat2Value(data.testiStat2Value || '98%');
        setTestiStat2Label(data.testiStat2Label || 'Client Retention');
        setTestiStat3Value(data.testiStat3Value || '100%');
        setTestiStat3Label(data.testiStat3Label || 'Client Trust');
        setTestiStat4Value(data.testiStat4Value || 'Direct');
        setTestiStat4Label(data.testiStat4Label || 'Collaboration');

        // About Feature Cards
        setAboutFeature1Title(data.aboutFeature1Title || 'Purpose-Driven');
        setAboutFeature1Desc(data.aboutFeature1Desc || 'I build with purpose, focused on solving real problems.');
        setAboutFeature2Title(data.aboutFeature2Title || 'Modern & Scalable');
        setAboutFeature2Desc(data.aboutFeature2Desc || 'I use the latest technologies to build fast, secure applications.');
        setAboutFeature3Title(data.aboutFeature3Title || 'Collaborative');
        setAboutFeature3Desc(data.aboutFeature3Desc || 'I believe in clear communication and strong collaboration.');
        // About Signature & Quote
        setAboutSignatureRole(data.aboutSignatureRole || 'Full Stack Developer');
        setAboutQuoteText(data.aboutQuoteText || 'My goal is to help businesses and individuals turn their ideas into powerful digital solutions that make a difference.');
        // About Core Values
        setAboutValue1Title(data.aboutValue1Title || 'Quality First');
        setAboutValue1Desc(data.aboutValue1Desc || 'Delivering pixel-perfect, premium code matching top international standards.');
        setAboutValue2Title(data.aboutValue2Title || 'Agile & Responsive');
        setAboutValue2Desc(data.aboutValue2Desc || 'Fast iterations, transparent updates, and super lightweight pages.');
        setAboutValue3Title(data.aboutValue3Title || 'Clean & Scalable');
        setAboutValue3Desc(data.aboutValue3Desc || 'Future-proof modular structures tailored for high-scale enterprise operations.');
        setAboutValue4Title(data.aboutValue4Title || 'Client-Centric');
        setAboutValue4Desc(data.aboutValue4Desc || 'Partnering closely to solve real-world problems and drive conversion rates.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 1000, 0.7);
        setAboutImage(compressed);
        setAboutImageDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutCvFile(reader.result as string);
        setAboutCvFileName(file.name);
        setAboutCvFileDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: any = {
      aboutHeading,
      aboutText,
      aboutTitle,
      aboutName,
      aboutEmail,
      aboutLocation,
      aboutAvailability,
      aboutCvText,
      aboutCvUrl,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      stat3Value,
      stat3Label,
      stat4Value,
      stat4Label,
      serviceStat1Value,
      serviceStat1Label,
      serviceStat2Value,
      serviceStat2Label,
      serviceStat3Value,
      serviceStat3Label,
      projectStat1Value,
      projectStat1Label,
      projectStat2Value,
      projectStat2Label,
      projectStat3Value,
      projectStat3Label,
      projectStat4Value,
      projectStat4Label,
      expStat1Value,
      expStat1Label,
      expStat2Value,
      expStat2Label,
      expStat3Value,
      expStat3Label,
      expStat4Value,
      expStat4Label,
      testiStat1Value,
      testiStat1Label,
      testiStat2Value,
      testiStat2Label,
      testiStat3Value,
      testiStat3Label,
      testiStat4Value,
      testiStat4Label,
      // About Feature Cards
      aboutFeature1Title,
      aboutFeature1Desc,
      aboutFeature2Title,
      aboutFeature2Desc,
      aboutFeature3Title,
      aboutFeature3Desc,
      // About Signature & Quote
      aboutSignatureRole,
      aboutQuoteText,
      // About Core Values
      aboutValue1Title,
      aboutValue1Desc,
      aboutValue2Title,
      aboutValue2Desc,
      aboutValue3Title,
      aboutValue3Desc,
      aboutValue4Title,
      aboutValue4Desc
    };
    if (aboutImageDirty) payload.aboutImage = aboutImage;
    if (aboutCvFileDirty) {
      payload.aboutCvFile = aboutCvFile;
      payload.aboutCvFileName = aboutCvFileName;
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('About settings successfully updated!', 'success');
        setAboutImageDirty(false);
        setAboutCvFileDirty(false);
      } else {
        showToast('Failed to update About settings.', 'error');
      }
    } catch (err) {
      showToast('Error updating About settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !aboutTitle) {
    return <div className={styles.emptyState}><h3>Connecting About Settings...</h3></div>;
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>About Section Curation</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>ABOUT CURIOSITY STORY</h3>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>About Biography Portrait Image</label>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button type="button" onClick={() => document.getElementById('aboutImageUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
              Upload Image
            </button>
            <input
              type="file"
              id="aboutImageUpload"
              accept="image/*"
              onChange={handleAboutImageUpload}
              style={{ display: 'none' }}
            />
            {aboutImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={aboutImage} alt="About Bio" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border-light)' }} />
                <button type="button" onClick={() => { setAboutImage(''); setAboutImageDirty(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Story Section Tag/Heading</label>
          <input type="text" value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Who am I Title</label>
          <input type="text" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className={styles.input} required />
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Biography Story Content</label>
          <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} className={styles.textarea} style={{ minHeight: '120px' }} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card: Name Display</label>
          <input type="text" value={aboutName} onChange={(e) => setAboutName(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card: Email Display</label>
          <input type="text" value={aboutEmail} onChange={(e) => setAboutEmail(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card: Location Display</label>
          <input type="text" value={aboutLocation} onChange={(e) => setAboutLocation(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card: Availability Status</label>
          <input type="text" value={aboutAvailability} onChange={(e) => setAboutAvailability(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>CV Download Button Text</label>
          <input type="text" value={aboutCvText} onChange={(e) => setAboutCvText(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>CV Document Upload (Direct PDF/Doc)</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
            <button 
              type="button" 
              onClick={() => document.getElementById('cvDocUpload')?.click()} 
              className="btn-premium btn-premium-outline" 
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              Upload CV File
            </button>
            <input
              type="file"
              id="cvDocUpload"
              accept=".pdf,.doc,.docx"
              onChange={handleCvUpload}
              style={{ display: 'none' }}
            />
            {aboutCvFileName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>📄 {aboutCvFileName}</span>
                <button 
                  type="button" 
                  onClick={() => { setAboutCvFile(''); setAboutCvFileName(''); setAboutCvFileDirty(true); }} 
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>ABOUT FEATURE CARDS</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card 1: Title (e.g. Purpose-Driven)</label>
          <input type="text" value={aboutFeature1Title} onChange={(e) => setAboutFeature1Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Card 1: Description</label>
          <input type="text" value={aboutFeature1Desc} onChange={(e) => setAboutFeature1Desc(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card 2: Title (e.g. Modern & Scalable)</label>
          <input type="text" value={aboutFeature2Title} onChange={(e) => setAboutFeature2Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Card 2: Description</label>
          <input type="text" value={aboutFeature2Desc} onChange={(e) => setAboutFeature2Desc(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Card 3: Title (e.g. Collaborative)</label>
          <input type="text" value={aboutFeature3Title} onChange={(e) => setAboutFeature3Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Card 3: Description</label>
          <input type="text" value={aboutFeature3Desc} onChange={(e) => setAboutFeature3Desc(e.target.value)} className={styles.input} />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>SIGNATURE & QUOTE</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>Signature Role (e.g. Full Stack Developer)</label>
          <input type="text" value={aboutSignatureRole} onChange={(e) => setAboutSignatureRole(e.target.value)} className={styles.input} />
        </div>

        <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
          <label className={styles.label}>Quote Text</label>
          <textarea value={aboutQuoteText} onChange={(e) => setAboutQuoteText(e.target.value)} className={styles.textarea} style={{ minHeight: '80px' }} />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>CORE VALUES (Bottom Row)</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>01 / QUALITY — Title</label>
          <input type="text" value={aboutValue1Title} onChange={(e) => setAboutValue1Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>01 / QUALITY — Description</label>
          <input type="text" value={aboutValue1Desc} onChange={(e) => setAboutValue1Desc(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>02 / SPEED — Title</label>
          <input type="text" value={aboutValue2Title} onChange={(e) => setAboutValue2Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>02 / SPEED — Description</label>
          <input type="text" value={aboutValue2Desc} onChange={(e) => setAboutValue2Desc(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>03 / SECURITY — Title</label>
          <input type="text" value={aboutValue3Title} onChange={(e) => setAboutValue3Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>03 / SECURITY — Description</label>
          <input type="text" value={aboutValue3Desc} onChange={(e) => setAboutValue3Desc(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>04 / VISION — Title</label>
          <input type="text" value={aboutValue4Title} onChange={(e) => setAboutValue4Title(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>04 / VISION — Description</label>
          <input type="text" value={aboutValue4Desc} onChange={(e) => setAboutValue4Desc(e.target.value)} className={styles.input} />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>BIOGRAPHY STATISTICS ROW</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 1: Value (e.g. 5+)</label>
          <input type="text" value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 1: Label (e.g. Years Experience)</label>
          <input type="text" value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 2: Value (e.g. 50+)</label>
          <input type="text" value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 2: Label (e.g. Projects Completed)</label>
          <input type="text" value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 3: Value (e.g. 20+)</label>
          <input type="text" value={stat3Value} onChange={(e) => setStat3Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 3: Label (e.g. Happy Clients)</label>
          <input type="text" value={stat3Label} onChange={(e) => setStat3Label(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 4: Value (e.g. 100%)</label>
          <input type="text" value={stat4Value} onChange={(e) => setStat4Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Stat 4: Label (e.g. Client Satisfaction)</label>
          <input type="text" value={stat4Label} onChange={(e) => setStat4Label(e.target.value)} className={styles.input} required />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '24px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>SERVICES SECTION STATS</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 1: Value</label>
          <input type="text" value={serviceStat1Value} onChange={(e) => setServiceStat1Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 1: Label</label>
          <input type="text" value={serviceStat1Label} onChange={(e) => setServiceStat1Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 2: Value</label>
          <input type="text" value={serviceStat2Value} onChange={(e) => setServiceStat2Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 2: Label</label>
          <input type="text" value={serviceStat2Label} onChange={(e) => setServiceStat2Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 3: Value</label>
          <input type="text" value={serviceStat3Value} onChange={(e) => setServiceStat3Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Service Stat 3: Label</label>
          <input type="text" value={serviceStat3Label} onChange={(e) => setServiceStat3Label(e.target.value)} className={styles.input} required />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '24px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>PROJECTS SECTION STATS</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 1: Value</label>
          <input type="text" value={projectStat1Value} onChange={(e) => setProjectStat1Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 1: Label</label>
          <input type="text" value={projectStat1Label} onChange={(e) => setProjectStat1Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 2: Value</label>
          <input type="text" value={projectStat2Value} onChange={(e) => setProjectStat2Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 2: Label</label>
          <input type="text" value={projectStat2Label} onChange={(e) => setProjectStat2Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 3: Value</label>
          <input type="text" value={projectStat3Value} onChange={(e) => setProjectStat3Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 3: Label</label>
          <input type="text" value={projectStat3Label} onChange={(e) => setProjectStat3Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 4: Value</label>
          <input type="text" value={projectStat4Value} onChange={(e) => setProjectStat4Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Stat 4: Label</label>
          <input type="text" value={projectStat4Label} onChange={(e) => setProjectStat4Label(e.target.value)} className={styles.input} required />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '24px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>EXPERIENCE SECTION STATS</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 1: Value</label>
          <input type="text" value={expStat1Value} onChange={(e) => setExpStat1Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 1: Label</label>
          <input type="text" value={expStat1Label} onChange={(e) => setExpStat1Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 2: Value</label>
          <input type="text" value={expStat2Value} onChange={(e) => setExpStat2Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 2: Label</label>
          <input type="text" value={expStat2Label} onChange={(e) => setExpStat2Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 3: Value</label>
          <input type="text" value={expStat3Value} onChange={(e) => setExpStat3Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 3: Label</label>
          <input type="text" value={expStat3Label} onChange={(e) => setExpStat3Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 4: Value</label>
          <input type="text" value={expStat4Value} onChange={(e) => setExpStat4Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Stat 4: Label</label>
          <input type="text" value={expStat4Label} onChange={(e) => setExpStat4Label(e.target.value)} className={styles.input} required />
        </div>

        <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '24px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>TESTIMONIALS SECTION STATS</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 1: Value</label>
          <input type="text" value={testiStat1Value} onChange={(e) => setTestiStat1Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 1: Label</label>
          <input type="text" value={testiStat1Label} onChange={(e) => setTestiStat1Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 2: Value</label>
          <input type="text" value={testiStat2Value} onChange={(e) => setTestiStat2Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 2: Label</label>
          <input type="text" value={testiStat2Label} onChange={(e) => setTestiStat2Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 3: Value</label>
          <input type="text" value={testiStat3Value} onChange={(e) => setTestiStat3Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 3: Label</label>
          <input type="text" value={testiStat3Label} onChange={(e) => setTestiStat3Label(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 4: Value</label>
          <input type="text" value={testiStat4Value} onChange={(e) => setTestiStat4Value(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Testimonial Stat 4: Label</label>
          <input type="text" value={testiStat4Label} onChange={(e) => setTestiStat4Label(e.target.value)} className={styles.input} required />
        </div>

        <div className={`${styles.formActions} ${styles.formSpanFull}`} style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '16px' }}>
          <button type="submit" disabled={loading} className="btn-premium btn-premium-gold" style={{ width: '100%' }}>
            {loading ? 'Saving About Configuration...' : 'Save About Section Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function BrandSettingsManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [logoText, setLogoText] = useState('RIFAT');
  const [headerFooterRole, setHeaderFooterRole] = useState('Full Stack Developer');
  const [logoImage, setLogoImage] = useState('');
  const [logoImageDirty, setLogoImageDirty] = useState(false);
  const [favicon, setFavicon] = useState('');
  const [faviconDirty, setFaviconDirty] = useState(false);
  const [footerText, setFooterText] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [navbarLinks, setNavbarLinks] = useState<INavbarLink[]>([]);
  const [projectsLayout, setProjectsLayout] = useState('asymmetric');
  const [skillsLayout, setSkillsLayout] = useState('category-progress');
  const [testimonialsLayout, setTestimonialsLayout] = useState('grid');
  const [blogsLayout, setBlogsLayout] = useState('editorial-rows');
  const [servicesPerRow, setServicesPerRow] = useState(3);
  const [servicesAutoScroll, setServicesAutoScroll] = useState(false);
  const [projectsPerRow, setProjectsPerRow] = useState(3);
  const [projectCategories, setProjectCategories] = useState('Web Applications, E-Commerce, Dashboard, Landing Page, Other');
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings?t=' + Date.now());
      if (res.ok) {
        const data = (await res.json()) as ISetting;
        setLogoText(data.logoText || 'RIFAT');
        setHeaderFooterRole(data.headerFooterRole || 'Full Stack Developer');
        setLogoImage(data.logoImage || '');
        setFavicon(data.favicon || '');
        setFooterText(data.footerText || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setGithub(data.github || '');
        setLinkedin(data.linkedin || '');
        setWhatsapp(data.whatsapp || '');
        setNavbarLinks(data.navbarLinks || []);
        setProjectsLayout(data.projectsLayout || 'asymmetric');
        setSkillsLayout(data.skillsLayout || 'category-progress');
        setTestimonialsLayout(data.testimonialsLayout || 'grid');
        setBlogsLayout(data.blogsLayout || 'editorial-rows');
        setServicesPerRow(data.servicesPerRow || 3);
        setServicesAutoScroll(!!data.servicesAutoScroll);
        setProjectsPerRow(data.projectsPerRow || 3);
        setProjectCategories(data.projectCategories || 'Web Applications, E-Commerce, Dashboard, Landing Page, Other');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400, 0.7);
        setLogoImage(compressed);
        setLogoImageDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 128, 128, 0.8);
        setFavicon(compressed);
        setFaviconDirty(true);
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
    const payload: any = {
      logoText,
      headerFooterRole,
      footerText,
      email,
      phone,
      github,
      linkedin,
      whatsapp,
      navbarLinks,
      projectsLayout,
      skillsLayout,
      testimonialsLayout,
      blogsLayout,
      servicesPerRow: Number(servicesPerRow),
      servicesAutoScroll: !!servicesAutoScroll,
      projectsPerRow: Number(projectsPerRow),
      projectCategories
    };
    if (logoImageDirty) payload.logoImage = logoImage;
    if (faviconDirty) payload.favicon = favicon;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Branding & Socials settings successfully updated!', 'success');
        setLogoImageDirty(false);
        setFaviconDirty(false);
      } else {
        showToast('Failed to update Branding settings.', 'error');
      }
    } catch (err) {
      showToast('Error updating Branding settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('Warning: Seeding database will clear existing Skills, Projects, Testimonials, Blogs and Settings, and replace them with curated premium dummy layout contents. Do you want to proceed?')) {
      return;
    }
    setSeedLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Database successfully seeded!', 'success');
        fetchSettings();
      } else {
        showToast('Seeding failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Seeding encountered an error.', 'error');
    } finally {
      setSeedLoading(false);
    }
  };

  if (loading && !logoText) {
    return <div className={styles.emptyState}><h3>Connecting Branding Settings...</h3></div>;
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Branding & General Settings</h1>
      </div>

      <div className={styles.brandSettingsGrid}>
        <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>BRANDING IDENTITY</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Navbar Brand Text</label>
            <input type="text" value={logoText} onChange={(e) => setLogoText(e.target.value)} className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Header/Footer Brand Role</label>
            <input type="text" value={headerFooterRole} onChange={(e) => setHeaderFooterRole(e.target.value)} className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Branding Logo/Portrait</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button type="button" onClick={() => document.getElementById('logoImageUpload')?.click()} className="btn-premium btn-premium-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Upload Image
              </button>
              <input type="file" id="logoImageUpload" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              {logoImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logoImage} alt="Logo" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--glass-border-light)' }} />
                  <button type="button" onClick={() => { setLogoImage(''); setLogoImageDirty(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
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
              <input type="file" id="faviconUpload" accept="image/*" onChange={handleFaviconUpload} style={{ display: 'none' }} />
              {favicon && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={favicon} alt="Favicon" style={{ width: 32, height: 32, objectFit: 'contain', border: '1px solid var(--glass-border-light)' }} />
                  <button type="button" onClick={() => { setFavicon(''); setFaviconDirty(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>LAYOUT & VIEW SCHEMAS</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Projects Gallery Layout</label>
            <select value={projectsLayout} onChange={(e) => setProjectsLayout(e.target.value)} className={styles.input} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}>
              <option value="asymmetric">Asymmetric Gallery</option>
              <option value="grid">Classic Card Grid</option>
              <option value="carousel">Drag Carousel</option>
              <option value="masonry">Staggered Masonry</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Technical Skills Layout</label>
            <select value={skillsLayout} onChange={(e) => setSkillsLayout(e.target.value)} className={styles.input} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}>
              <option value="category-progress">Category Progress Bars</option>
              <option value="grid-cards">3D Glass Cards Grid</option>
              <option value="marquee">Infinite Smooth Marquee</option>
              <option value="badge-cloud">Compact Badge Cloud</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Services Grid Column Count</label>
            <select value={servicesPerRow} onChange={(e) => setServicesPerRow(Number(e.target.value))} className={styles.input} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '32px' }}>
            <input type="checkbox" id="servicesAutoScroll" checked={servicesAutoScroll} onChange={(e) => setServicesAutoScroll(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label htmlFor="servicesAutoScroll" className={styles.label} style={{ cursor: 'pointer', margin: 0 }}>Enable Service Ticker</label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Projects Grid Column Count</label>
            <select value={projectsPerRow} onChange={(e) => setProjectsPerRow(Number(e.target.value))} className={styles.input} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border-light)' }}>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Project Categories (comma separated)</label>
            <input type="text" value={projectCategories} onChange={(e) => setProjectCategories(e.target.value)} className={styles.input} />
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>CONTACT CHANNELS & SOCIALS</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GitHub URL</label>
            <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>LinkedIn URL</label>
            <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>WhatsApp Number</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={styles.input} />
          </div>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <label className={styles.label}>Footer Signature/Copyright Label</label>
            <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className={styles.input} required />
          </div>

          <h3 className="gold-gradient-text" style={{ gridColumn: 'span 2', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '8px' }}>NAVIGATION LINKS</h3>

          <div className={`${styles.formGroup} ${styles.formSpanFull}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {navbarLinks.map((link, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input type="text" value={link.label} onChange={(e) => handleNavLinkChange(idx, 'label', e.target.value)} placeholder="Label" className={styles.input} style={{ flex: 1 }} />
                  <input type="text" value={link.url} onChange={(e) => handleNavLinkChange(idx, 'url', e.target.value)} placeholder="URL" className={styles.input} style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeNavLink(idx)} className={styles.actionBtn} style={{ color: 'var(--status-offline)', border: '1px solid rgba(220,53,69,0.2)', height: '44px', width: '44px', padding: 0 }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addNavLink} className="btn-premium btn-premium-outline" style={{ alignSelf: 'start', fontSize: '0.8rem', padding: '6px 12px' }}>
                + Add Custom Nav Link
              </button>
            </div>
          </div>

          <div className={`${styles.formActions} ${styles.formSpanFull}`} style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border-light)', paddingTop: '16px' }}>
            <button type="submit" disabled={loading} className="btn-premium btn-premium-gold" style={{ width: '100%' }}>
              {loading ? 'Saving Branding...' : 'Save Branding Changes'}
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', gap: 12, color: 'var(--accent-gold)', marginBottom: 12 }}>
              <Database size={24} />
              <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Core Seeding Tools</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: 16 }}>
              Populate the database with dummy premium layout assets instantly.
            </p>
            <button type="button" onClick={handleSeedDatabase} disabled={seedLoading} className="btn-premium btn-premium-gold" style={{ width: '100%', gap: 8 }}>
              <Sparkles size={16} />
              {seedLoading ? 'Seeding Database...' : 'Seed Premium Dummy Data'}
            </button>
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

function ContactMessagesManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
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

      <div className={`${styles.contactMessagesGrid} ${activeMessage ? styles.msgActive : ''}`}>
        <div className={styles.inboxListWrapper} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: !msg.read ? 'bold' : 'normal', color: 'var(--text-primary)' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#60a5fa', marginBottom: 4, fontStyle: 'italic' }}>{msg.email}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: 4 }}>{msg.subject}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.messageDetailsWrapper} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)', padding: '24px', minHeight: '400px' }}>
          {!activeMessage ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              Select a message to read.
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveMessage(null)}
                className={styles.inboxBackButton}
                title="Back to inbox"
              >
                <ArrowLeft size={16} /> Back to Inbox
              </button>
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

function NewsletterManager({ showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }) {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStats, setDbStats] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(5);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/newsletter');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStats = async () => {
    try {
      const res = await fetch('/api/admin/db-stats');
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchDbStats();

    const intervalId = setInterval(() => {
      fetchDbStats();
      fetchSubscribers();
      setRefreshCountdown(5);
    }, 5000);

    const countdownId = setInterval(() => {
      setRefreshCountdown(prev => (prev > 1 ? prev - 1 : 5));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Subscriber deleted successfully', 'success');
        setSubscribers(prev => prev.filter(s => s._id !== id));
      } else {
        showToast('Failed to delete subscriber', 'error');
      }
    } catch (err) {
      showToast('Error deleting subscriber', 'error');
    }
  };

  const filtered = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.crudHeader}>
        <div>
          <h1 className={styles.crudTitle}>Newsletter & Database</h1>
          <p className={styles.crudSubtitle}>Manage email list subscriptions and monitor live database storage space.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={20} color="var(--accent-gold)" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>Storage Space</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>Live (Auto-refresh {refreshCountdown}s)</span>
            </div>
          </div>

          {dbLoading ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading storage stats...</div>
          ) : dbStats ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                  {dbStats.storageSizeMB} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>MB</span>
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  of {dbStats.limitMB} MB ({dbStats.percentage}%)
                </span>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ 
                  width: `${Math.min(100, Math.max(1, parseFloat(dbStats.percentage) * 10))}%`,
                  height: '100%', 
                  background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                  borderRadius: '100px'
                }} />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                * Standard Atlas M0 free tier database is capped at 512MB storage space. Live metrics are read directly from MongoDB storage stats.
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Failed to load storage details.</div>
          )}
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Collections</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>{dbStats ? dbStats.collections : '-'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Documents Count</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>{dbStats ? dbStats.objects : '-'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Data Payload Size</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>{dbStats ? `${dbStats.dataSizeMB} MB` : '-'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Indexes Size</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>{dbStats ? `${dbStats.indexSizeMB} MB` : '-'}</span>
          </div>
        </div>

      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Subscribers List ({filtered.length})
          </h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="Search subscriber emails..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading subscribers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', border: '1px dashed var(--glass-border-light)', borderRadius: '8px' }}>
            No subscribers found matching query.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((s, idx) => (
              <div 
                key={s._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(15, 23, 42, 0.25)', 
                  border: '1px solid var(--glass-border-light)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{s.email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Subscribed: {new Date(s.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(s._id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  title="Remove Subscriber"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

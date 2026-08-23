'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Phone,
  Video,
  X,
  Send,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import styles from '../home.module.css';

interface IMessage {
  _id?: string;
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  image?: string;
  seen?: boolean;
  seenAt?: string;
  createdAt: string;
}

interface ISetting {
  phone?: string;
}

interface ChatWidgetProps {
  siteSettings: ISetting | null;
}

export default function ChatWidget({ siteSettings }: ChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  
  // Chat Widget States
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [chatImageInput, setChatImageInput] = useState<string | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // Load chat session from local storage
  useEffect(() => {
    const savedSessionId = localStorage.getItem('portfolio_chat_session_id');
    const savedUserName = localStorage.getItem('portfolio_chat_user_name');
    const savedUserEmail = localStorage.getItem('portfolio_chat_user_email');

    if (savedSessionId && savedUserName) {
      setSessionId(savedSessionId);
      setUserName(savedUserName);
      if (savedUserEmail) setUserEmail(savedUserEmail);
      setIsRegistered(true);
    }
  }, []);

  const lastTypingSentRef = useRef<number>(0);
  const broadcastUserTyping = () => {
    const now = Date.now();
    if (now - lastTypingSentRef.current > 2000 && sessionId) {
      lastTypingSentRef.current = now;
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'typing', sessionId, sender: 'user' }),
      }).catch(() => {});
    }
  };

  // Fetch chat messages periodically
  const fetchChatMessages = async (sessId: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sessId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && data.messages) {
          setMessages(data.messages);
          if (data.session) {
            setIsTyping(Boolean(data.session.isAdminTyping));
          }
        }
      }
    } catch (err) {
      console.error('Chat refresh failed:', err);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    
    fetchChatMessages(sessionId);
    const interval = setInterval(() => {
      fetchChatMessages(sessionId);
    }, 2500);
    return () => clearInterval(interval);
  }, [sessionId, isChatOpen]);

  // Scroll chat messages to bottom
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isChatOpen]);

  // Register chat session
  const handleRegisterChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    const randomId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('portfolio_chat_session_id', randomId);
    localStorage.setItem('portfolio_chat_user_name', userName);
    localStorage.setItem('portfolio_chat_user_email', userEmail);
    setSessionId(randomId);
    setIsRegistered(true);
  };

  // Send message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || (!chatInputText.trim() && !chatImageInput)) return;

    const isFirstMessage = messages.filter(m => m.sender === 'admin').length === 0;

    const messagePayload = {
      sessionId,
      sender: 'user',
      text: chatInputText,
      image: chatImageInput || undefined,
      userName: userName,
      userEmail: userEmail || undefined,
    };

    const optimisticMsg: IMessage = {
      sessionId,
      sender: 'user',
      text: chatInputText,
      image: chatImageInput || undefined,
      seen: false,
      createdAt: new Date().toISOString() as any,
    } as any;
    setMessages(prev => [...prev, optimisticMsg]);
    setChatInputText('');
    setChatImageInput(null);

    if (isFirstMessage) {
      setTimeout(() => {
        setIsTyping(true);
      }, 400);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload),
      });
      if (res.ok) {
        if (isFirstMessage) {
          setTimeout(async () => {
            await fetchChatMessages(sessionId);
            setIsTyping(false);
          }, 1200);
        } else {
          fetchChatMessages(sessionId);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setIsTyping(false);
    }
  };

  // Image attachment upload
  const handleChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatImageInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.chatWidgetContainer}>
      <button onClick={() => setIsChatOpen(!isChatOpen)} className={styles.chatBubbleBtn}>
        <MessageCircle size={28} />
        <div className={styles.chatBubblePulse} />
      </button>

      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatWindowHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span className={styles.chatHeaderTitle}>Live Dialogue</span>
            </div>
            <div className={styles.chatHeaderActions}>
              <button onClick={() => setIsDialerOpen(true)} className={styles.headerIconBtn} title="Make a call">
                <Phone size={16} />
              </button>
              <button onClick={() => setIsChatOpen(false)} className={styles.headerIconBtn}>
                <X size={18} />
              </button>
            </div>
          </div>

          {!isRegistered ? (
            <form onSubmit={handleRegisterChat} className={styles.chatRegister}>
              <Sparkles size={36} className={styles.chatRegisterIcon} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Connect Instantly</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Enter your details to begin a secure real-time dialogue about your custom projects.
              </p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className={styles.chatInput}
                style={{ width: '100%', marginBottom: '10px' }}
                required
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={styles.chatInput}
                style={{ width: '100%', marginBottom: '16px' }}
                required
              />
              <button type="submit" className="btn-premium btn-premium-gold" style={{ width: '100%' }}>
                Initialize Dialogue
              </button>
            </form>
          ) : (
            <>
              <div className={styles.chatMessages}>
                {messages.length === 0 ? (
                  <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                    Dialogue initialized. Send a message to start chatting.
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isAdmin = m.sender === 'admin';
                    const timeStr = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    return (
                      <div
                        key={idx}
                        className={`${styles.chatBubble} ${isAdmin ? styles.chatBubbleAdmin : styles.chatBubbleUser}`}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        {m.image && (
                          <img
                            src={m.image}
                            alt="Uploaded file"
                            style={{ maxWidth: '100%', borderRadius: 4, marginBottom: 4, cursor: 'pointer' }}
                            onClick={() => window.open(m.image, '_blank')}
                          />
                        )}
                        {m.text && <p style={{ margin: 0 }}>{m.text}</p>}
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isAdmin ? 'flex-start' : 'flex-end', gap: '4px', marginTop: '4px', fontSize: '0.68rem', color: isAdmin ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)' }}>
                          <span>{timeStr}</span>
                          {!isAdmin && (
                            <span style={{ marginLeft: '4px', fontWeight: 600, color: m.seen ? '#34d399' : 'rgba(255,255,255,0.6)' }}>
                              {m.seen ? '✓✓ Seen' : '✓ Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                {isTyping && (
                  <div
                    className={`${styles.chatBubble} ${styles.chatBubbleAdmin}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '10px 14px',
                      background: 'rgba(129, 140, 248, 0.12)',
                      border: '1px solid rgba(129, 140, 248, 0.25)',
                      borderRadius: '16px 16px 16px 4px',
                      maxWidth: '85%',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: '#c7d2fe', marginRight: 4, fontWeight: 500 }}>
                      Refayet is typing
                    </span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'bounce 1s infinite' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'bounce 1s infinite 0.2s' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#818cf8', animation: 'bounce 1s infinite 0.4s' }} />
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              <div className={styles.chatInputArea}>
                {chatImageInput && (
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8, padding: 2, border: '1px solid var(--accent-gold)', borderRadius: 4 }}>
                    <img src={chatImageInput} alt="Preview" style={{ height: 40, borderRadius: 2 }} />
                    <button
                      type="button"
                      onClick={() => setChatImageInput(null)}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendChatMessage} className={styles.chatForm}>
                  <input
                    type="file"
                    ref={chatFileInputRef}
                    onChange={handleChatImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    className={styles.chatIconBtn}
                    title="Attach Image"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => {
                      setChatInputText(e.target.value);
                      broadcastUserTyping();
                    }}
                    placeholder="Type your message..."
                    className={styles.chatTextInput}
                  />
                  <button type="submit" className={styles.chatSendBtn} title="Send Message">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* Dialer Call Modal */}
      {isDialerOpen && (
        <div className={styles.dialerOverlay}>
          <div className={styles.dialerContent}>
            <div className={styles.dialerHeader}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: 'rgba(197, 168, 128, 0.05)', color: 'var(--accent-gold)' }}>
                <Phone size={24} />
              </div>
              <h3 className={styles.dialerTitle}>Secure Communications</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Connect directly through encrypted networks.
              </p>
            </div>
            
            <div className={styles.dialerGrid}>
              <a href={`tel:${siteSettings?.phone || '+1234567890'}`} className="btn-premium btn-premium-gold dialOption">
                <Phone size={18} /> Voice Link Call
              </a>
              <a href={`https://wa.me/${(siteSettings?.phone || '1234567890').replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-premium btn-premium-outline dialOption">
                <Video size={18} /> WhatsApp Secure
              </a>
            </div>

            <button
              onClick={() => setIsDialerOpen(false)}
              className="btn-premium btn-premium-outline"
              style={{ width: '100%', marginTop: 24, fontSize: '0.85rem', border: '1px solid rgba(246, 239, 226, 0.08)' }}
            >
              Close Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

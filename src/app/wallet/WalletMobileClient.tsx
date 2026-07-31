'use client';

import React, { useState, useEffect } from 'react';
import WalletManager from '../admin/components/WalletManager';
import { 
  ShieldCheck, Lock, LogOut, Smartphone, Sparkles, CheckCircle2, 
  XCircle, AlertCircle, RefreshCw, Eye, EyeOff, Wallet, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../admin/admin.module.css';

interface ToastMessage {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

export default function WalletMobileClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  // Check persistent session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('wallet_mobile_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Listen for PWA Install Prompt (Android Homescreen Install)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setAuthenticating(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/wallet', {
        headers: {
          'x-admin-password': pinInput,
        },
      });

      if (res.ok) {
        // Save session locally and store header token
        localStorage.setItem('wallet_mobile_auth', 'true');
        localStorage.setItem('wallet_mobile_pin', pinInput);
        setIsAuthenticated(true);
        showToast('Successfully authenticated!', 'success');
      } else {
        setLoginError('Invalid PIN or Password. Please try again.');
        showToast('Invalid PIN or Password', 'error');
      }
    } catch (err) {
      setLoginError('Network error. Check server connection.');
      showToast('Network error', 'error');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wallet_mobile_auth');
    localStorage.removeItem('wallet_mobile_pin');
    setIsAuthenticated(false);
    showToast('Logged out of Mobile Wallet', 'info');
  };

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('App installed on home screen!', 'success');
        }
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'radial-gradient(circle at top, #1e293b 0%, #090d16 100%)',
      }}>
        {/* Mobile Header Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)',
          }}>
            <Wallet size={36} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
            Personal Wallet
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Smartphone size={14} /> Official Android App Edition
          </p>
        </motion.div>

        {/* Lock Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: '100%',
            maxWidth: '380px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <img src="/wallet-icon.png" alt="Wallet App Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Personal Wallet Security
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Enter your Admin PIN or Password to access
            </p>
          </div>

          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input 
                type="password"
                placeholder="Enter PIN / Password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: loginError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  fontSize: '15px',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '2px',
                }}
              />
              {loginError && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', textAlign: 'center', margin: '6px 0 0' }}>
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={authenticating || !pinInput}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: authenticating ? 'not-allowed' : 'pointer',
                opacity: authenticating || !pinInput ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              {authenticating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Unlock Wallet App
                </>
              )}
            </button>
          </form>

          {showInstallBanner && (
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}>
              <button
                onClick={handleInstallApp}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} /> Install Android App on Home Screen
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', paddingBottom: '30px' }}>
      {/* Top Android App Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9, 13, 22, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <img src="/wallet-icon.png" alt="Wallet App Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.2 }}>
              Personal Wallet
            </h1>
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live DB Synchronized
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showInstallBanner && (
            <button
              onClick={handleInstallApp}
              title="Install App"
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Download size={13} /> Install APK
            </button>
          )}

          <button
            onClick={handleLogout}
            title="Lock App"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '8px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Wallet Manager Container */}
      <div style={{ padding: '10px 8px', maxWidth: '100%', boxSizing: 'border-box' }}>
        <WalletManager showToast={showToast} />
      </div>

      {/* Mobile Toast Notifications */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e3a8a',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'auto',
              }}
            >
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <XCircle size={18} />}
              {toast.type === 'info' && <AlertCircle size={18} />}
              <span style={{ flex: 1 }}>{toast.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

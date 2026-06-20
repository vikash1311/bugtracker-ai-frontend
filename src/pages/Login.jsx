import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiTarget, FiGitMerge, FiFileText, FiUsers } from 'react-icons/fi';
import axiosInstance, { wakeBackend } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { brand as b } from '../utils/brandTheme';
import LogoMark from '../assets/brand/logo-mark.svg';

const MOBILE_BREAKPOINT = 768;

// Tracks viewport width reactively via matchMedia — the previous
// `window.innerWidth < 768` check only ran once at mount and never
// updated on resize.
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

const FEATURES = [
  { icon: FiTarget, label: 'AI Priority Suggestion' },
  { icon: FiGitMerge, label: 'Duplicate Detection' },
  { icon: FiFileText, label: 'Auto Reproduction Steps' },
  { icon: FiUsers, label: 'Role-Based Access' },
];

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'superadmin2@bugtracker.com', pass: 'Admin@123' },
  { role: 'Developer', email: 'dev@bugtracker.com', pass: 'Dev@123' },
  { role: 'Tester', email: 'tester@bugtracker.com', pass: 'Test@123' },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Show waking up message after 5 seconds
    const wakeTimer = setTimeout(() => {
      setError('Server is waking up from sleep mode — this can take 30–60 seconds on first load.');
    }, 5000);

    try {
      const res = await axiosInstance.post('/auth/login', form);
      clearTimeout(wakeTimer);
      login(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      clearTimeout(wakeTimer);
      if (err.code === 'ECONNABORTED' || !err.response) {
        setError('Server is waking up — please try again in 30 seconds.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Wake backend as soon as user lands on login page
    wakeBackend();
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: `linear-gradient(135deg, ${b.bg} 0%, ${b.bgElevated} 50%, ${b.bg} 100%)`,
      position: 'relative', overflow: 'hidden',
      fontFamily: b.fontBody,
    }}>
      {/* Background grid, matches Landing page identity */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${b.grid} 1px, transparent 1px), linear-gradient(90deg, ${b.grid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 20% 30%, black 30%, transparent 85%)',
      }} />

      {/* Animated glow accents */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', top: -100, left: -100,
          background: `radial-gradient(circle, ${b.signal}1A, transparent)`,
        }} />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', bottom: -150, right: -150,
          background: `radial-gradient(circle, ${b.resolved}14, transparent)`,
        }} />

      {/* Left panel */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            flex: 1, flexDirection: 'column',
            justifyContent: 'center', padding: '60px',
            display: 'flex', position: 'relative', zIndex: 1,
          }}>
          <div style={{ maxWidth: 480 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: 32 }}>
              <img src={LogoMark} alt="BugTracker AI" style={{ width: 64, height: 64, borderRadius: 16 }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                color: b.textPrimary, fontSize: 42, fontWeight: 800,
                fontFamily: b.fontDisplay, letterSpacing: '-1px',
                lineHeight: 1.15, marginBottom: 16,
              }}>
              BugTracker <span style={{ color: b.signal }}>AI</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ color: b.textSecondary, fontSize: 16, lineHeight: 1.6 }}>
              AI-powered bug tracking with smart triage, duplicate detection,
              and automated reproduction steps.
            </motion.p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px',
                    backgroundColor: `${b.signal}14`,
                    border: `1px solid ${b.signal}33`,
                    borderRadius: 20, color: b.textSecondary, fontSize: 13,
                  }}>
                  <Icon size={13} color={b.signal} />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Right panel — Login form */}
      <div style={{
        width: '100%', maxWidth: isMobile ? '100%' : 480,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%', backgroundColor: b.bgElevated + 'CC',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${b.border}`,
            borderRadius: 24, padding: '40px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
          <h2 style={{
            color: b.textPrimary, fontSize: 28, fontWeight: 700,
            fontFamily: b.fontDisplay, letterSpacing: '-0.5px',
            marginBottom: 8,
          }}>
            Welcome back
          </h2>
          <p style={{ color: b.textMuted, marginBottom: 32, fontSize: 14 }}>
            Sign in to your account
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: `${b.signal}1A`,
                border: `1px solid ${b.signal}4D`,
                color: '#F2A99A', padding: '12px 16px',
                borderRadius: 12, marginBottom: 20, fontSize: 13.5,
                lineHeight: 1.5,
              }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: b.textSecondary, fontSize: 13,
                fontWeight: 500, marginBottom: 8, display: 'block',
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: b.textMuted,
                }} size={16} />
                <input
                  type="email" placeholder="admin@company.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${b.border}`,
                    borderRadius: 12, color: b.textPrimary, fontSize: 14,
                    boxSizing: 'border-box', outline: 'none',
                  }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                color: b.textSecondary, fontSize: 13,
                fontWeight: 500, marginBottom: 8, display: 'block',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: b.textMuted,
                }} size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${b.border}`,
                    borderRadius: 12, color: b.textPrimary, fontSize: 14,
                    boxSizing: 'border-box', outline: 'none',
                  }} />
                <div
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', cursor: 'pointer',
                    color: b.textMuted,
                  }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? b.border : b.signal,
                color: loading ? b.textMuted : b.bg,
                border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 20px ${b.signal}4D`,
              }}>
              {loading ? 'Connecting…' : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: 24,
            padding: '16px',
            backgroundColor: `${b.signal}0D`,
            border: `1px solid ${b.signal}33`,
            borderRadius: 12,
          }}>
            <p style={{
              color: b.signal, fontSize: 11.5, fontWeight: 700,
              marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1,
              fontFamily: b.fontMono,
            }}>
              Demo Credentials
            </p>
            {DEMO_ACCOUNTS.map(({ role, email, pass }) => (
              <div
                key={role}
                onClick={() => setForm({ email, password: pass })}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '8px 10px',
                  marginBottom: 6, borderRadius: 8, cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = `${b.signal}26`}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
              >
                <span style={{ color: b.textSecondary, fontSize: 12, fontWeight: 600 }}>
                  {role}
                </span>
                <span style={{ color: b.signal, fontSize: 11, fontFamily: b.fontMono }}>
                  {email}
                </span>
              </div>
            ))}
            <p style={{ color: b.textMuted, fontSize: 11, marginTop: 8, textAlign: 'center' }}>
              Click any role to auto-fill credentials
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
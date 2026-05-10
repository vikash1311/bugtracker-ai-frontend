import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', form);
      login(res.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', top: -100, left: -100,
          background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)',
        }} />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', bottom: -150, right: -150,
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)',
        }} />

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1, flexDirection: 'column',
          justifyContent: 'center', padding: '60px',
          display: window.innerWidth < 768 ? 'none' : 'flex',
        }}>
        <div style={{ maxWidth: 480 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 32,
            }}>
            <FiAlertCircle color="#fff" size={30} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              color: '#fff', fontSize: 42, fontWeight: 800,
              lineHeight: 1.2, marginBottom: 16,
            }}>
            BugTracker <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>
            AI-powered bug tracking with smart triage, duplicate detection,
            and automated reproduction steps.
          </motion.p>

          {/* Feature pills */}
          {['🎯 AI Priority Suggestion', '🔍 Duplicate Detection',
            '📋 Auto Reproduction Steps', '👥 Role-Based Access'].map(
            (f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                style={{
                  display: 'inline-block', marginRight: 8,
                  marginTop: 12, padding: '6px 14px',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 20, color: '#94a3b8', fontSize: 13,
                }}>
                {f}
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Right panel — Login form */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%', backgroundColor: 'rgba(30,41,59,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '40px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
          <h2 style={{
            color: '#fff', fontSize: 28, fontWeight: 700,
            marginBottom: 8,
          }}>
            Welcome back
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
            Sign in to your account
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', padding: '12px 16px',
                borderRadius: 12, marginBottom: 20, fontSize: 14,
              }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: '#94a3b8', fontSize: 13,
                fontWeight: 500, marginBottom: 8, display: 'block',
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#64748b',
                }} size={16} />
                <input
                  type="email" placeholder="admin@company.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14,
                    boxSizing: 'border-box', outline: 'none',
                  }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                color: '#94a3b8', fontSize: 13,
                fontWeight: 500, marginBottom: 8, display: 'block',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#64748b',
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
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14,
                    boxSizing: 'border-box', outline: 'none',
                  }} />
                <div
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', cursor: 'pointer',
                    color: '#64748b',
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
                background: loading
                  ? '#334155'
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
              }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 24,
            color: '#475569', fontSize: 13,
          }}>
            Contact your administrator for access
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

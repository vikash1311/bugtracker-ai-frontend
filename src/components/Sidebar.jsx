import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import {
  FiZap, FiHome, FiFolder, FiUsers,
  FiLogOut, FiChevronLeft, FiChevronRight,
  FiSun, FiMoon, FiAlertCircle
} from 'react-icons/fi';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const t = getTheme(isDark);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiFolder, label: 'Projects', path: '/projects' },
    { icon: FiZap, label: 'Report Bug', path: '/bugs/create',
      roles: ['TESTER', 'ADMIN'] },
    { icon: FiUsers, label: 'Users', path: '/users',
      roles: ['ADMIN'] },
  ].filter(item =>
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <motion.div
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh', position: 'fixed', left: 0, top: 0,
        backgroundColor: t.sidebar, display: 'flex',
        flexDirection: 'column', zIndex: 100, overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px', display: 'flex',
        alignItems: 'center', gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <FiZap color="#fff" size={18} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{
                color: '#fff', fontWeight: 700,
                fontSize: 16, whiteSpace: 'nowrap',
              }}>
              BugTracker AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <motion.div
              key={path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: '11px 12px',
                borderRadius: 10, cursor: 'pointer',
                marginBottom: 4,
                backgroundColor: active
                  ? 'rgba(59,130,246,0.2)' : 'transparent',
                borderLeft: active
                  ? '3px solid #3b82f6' : '3px solid transparent',
              }}>
              <Icon
                size={20}
                color={active ? '#3b82f6' : '#94a3b8'}
                style={{ flexShrink: 0 }}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      color: active ? '#fff' : '#94a3b8',
                      fontSize: 14, fontWeight: active ? 600 : 400,
                      whiteSpace: 'nowrap',
                    }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        {/* User Info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '10px 12px', marginBottom: 8,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 10,
              }}>
              <div style={{
                color: '#fff', fontSize: 13,
                fontWeight: 600, marginBottom: 2,
              }}>
                {user?.name}
              </div>
              <div style={{
                color: '#64748b', fontSize: 11,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>
                {user?.role}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Toggle */}
        <motion.div
          whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            cursor: 'pointer', marginBottom: 4,
          }}>
          {isDark
            ? <FiSun size={20} color="#f59e0b" />
            : <FiMoon size={20} color="#94a3b8" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: '#94a3b8', fontSize: 14 }}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Logout */}
        <motion.div
          whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            cursor: 'pointer', marginBottom: 8,
          }}>
          <FiLogOut size={20} color="#ef4444" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: '#ef4444', fontSize: 14 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Collapse Toggle */}
        <motion.div
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '8px',
            borderRadius: 10, cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}>
          {collapsed
            ? <FiChevronRight size={18} color="#94a3b8" />
            : <FiChevronLeft size={18} color="#94a3b8" />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

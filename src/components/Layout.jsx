import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import { FiMenu } from 'react-icons/fi';

const MOBILE_BREAKPOINT = 768;

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

const Layout = ({ children }) => {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close the overlay automatically if the viewport grows back to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const desktopMargin = collapsed ? 72 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh',
      backgroundColor: t.bg }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(c => !c)}
      />

      {isMobile && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{
            position: 'fixed', top: 16, left: 16, zIndex: 80,
            width: 40, height: 40, borderRadius: 10,
            display: mobileOpen ? 'none' : 'flex',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: t.sidebar, border: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)', cursor: 'pointer',
          }}>
          <FiMenu size={20} color="#fff" />
        </motion.button>
      )}

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginLeft: isMobile ? 0 : desktopMargin,
          flex: 1,
          padding: isMobile ? '72px 16px 24px' : '24px',
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'margin-left 0.3s ease',
        }}>
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
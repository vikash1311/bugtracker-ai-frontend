import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

const Layout = ({ children }) => {
  const { isDark } = useTheme();
  const t = getTheme(isDark);

  return (
    <div style={{ display: 'flex', minHeight: '100vh',
      backgroundColor: t.bg }}>
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginLeft: 240, flex: 1, padding: '24px',
          minHeight: '100vh', transition: 'margin-left 0.3s ease',
        }}>
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>BugTracker</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/projects" style={styles.link}>Projects</Link>
        <span style={styles.user}>
          {user?.name} ({user?.role})
        </span>
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 24px', backgroundColor: '#1e293b', color: '#fff',
  },
  brand: { fontSize: '20px', fontWeight: 'bold' },
  brandLink: { color: '#60a5fa', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' },
  user: { color: '#94a3b8', fontSize: '13px' },
  btn: {
    padding: '6px 14px', backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  },
};

export default Navbar;
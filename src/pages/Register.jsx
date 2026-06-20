import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'TESTER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/register', form);
      login(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Bug Tracker</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" placeholder="Enter your name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="Enter email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select style={styles.input} value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}>
              <option value="TESTER">Tester</option>
              <option value="DEVELOPER">Developer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f1f5f9',
  },
  card: {
    backgroundColor: '#fff', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
  },
  title: { textAlign: 'center', color: '#1e293b', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
};

export default Register;
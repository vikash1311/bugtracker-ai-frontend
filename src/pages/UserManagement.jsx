import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiUser, FiMail, FiLock, FiX } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'TESTER'
  });
  const { isDark } = useTheme();
  const t = getTheme(isDark);

  const roleColors = {
    ADMIN: { bg: '#ede9fe', color: '#7c3aed' },
    DEVELOPER: { bg: '#dbeafe', color: '#1d4ed8' },
    TESTER: { bg: '#d1fae5', color: '#065f46' },
  };

  const fetchUsers = () => {
    axiosInstance.get('/users')
      .then(res => setUsers(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/register', form);
      setForm({ name: '', email: '', password: '', role: 'TESTER' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800,
            color: t.text, marginBottom: 4 }}>
            User Management
          </h1>
          <p style={{ color: t.textSecondary, fontSize: 14 }}>
            Create and manage team members
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 12,
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
          }}>
          <FiPlus size={18} /> Add User
        </motion.button>
      </motion.div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 200,
            }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                backgroundColor: t.bgSecondary,
                borderRadius: 20, padding: 32, width: '100%',
                maxWidth: 440,
                border: `1px solid ${t.border}`,
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: t.text, fontSize: 20, fontWeight: 700 }}>
                  Create New User
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none',
                    cursor: 'pointer', color: t.textSecondary }}>
                  <FiX size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleCreate}>
                {[
                  { icon: FiUser, key: 'name',
                    placeholder: 'Full name', type: 'text' },
                  { icon: FiMail, key: 'email',
                    placeholder: 'Email address', type: 'email' },
                  { icon: FiLock, key: 'password',
                    placeholder: 'Password', type: 'password' },
                ].map(({ icon: Icon, key, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <div style={{ position: 'relative' }}>
                      <Icon style={{
                        position: 'absolute', left: 14, top: '50%',
                        transform: 'translateY(-50%)',
                        color: t.textMuted,
                      }} size={16} />
                      <input
                        type={type} placeholder={placeholder}
                        value={form[key]}
                        onChange={e =>
                          setForm({...form, [key]: e.target.value})}
                        required
                        style={{
                          width: '100%', padding: '12px 12px 12px 42px',
                          backgroundColor: t.bgTertiary,
                          border: `1px solid ${t.border}`,
                          borderRadius: 10, color: t.text,
                          fontSize: 14, boxSizing: 'border-box',
                          outline: 'none',
                        }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginBottom: 24 }}>
                  <select
                    value={form.role}
                    onChange={e => setForm({...form, role: e.target.value})}
                    style={{
                      width: '100%', padding: '12px',
                      backgroundColor: t.bgTertiary,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10, color: t.text,
                      fontSize: 14, boxSizing: 'border-box',
                      outline: 'none',
                    }}>
                    <option value="TESTER">Tester</option>
                    <option value="DEVELOPER">Developer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1, padding: '12px',
                      backgroundColor: t.bgTertiary,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10, color: t.textSecondary,
                      cursor: 'pointer', fontSize: 14,
                    }}>
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{
                      flex: 1, padding: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      border: 'none', borderRadius: 10,
                      color: '#fff', cursor: 'pointer',
                      fontSize: 14, fontWeight: 600,
                    }}>
                    Create User
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          backgroundColor: t.bgSecondary, borderRadius: 16,
          border: `1px solid ${t.border}`,
          boxShadow: t.cardShadow, overflow: 'hidden',
        }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${t.border}`,
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr',
          color: t.textSecondary, fontSize: 12,
          fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>

        {loading ? (
          [1,2,3].map(i => (
            <motion.div key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ height: 64, margin: '8px 24px',
                backgroundColor: t.bgTertiary, borderRadius: 8 }} />
          ))
        ) : users.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${t.border}`,
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr',
              alignItems: 'center',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff',
                fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: t.text, fontSize: 14,
                fontWeight: 500 }}>
                {user.name}
              </span>
            </div>
            <span style={{ color: t.textSecondary, fontSize: 14 }}>
              {user.email}
            </span>
            <span style={{
              display: 'inline-block', padding: '4px 10px',
              borderRadius: 20, fontSize: 11, fontWeight: 600,
              backgroundColor: roleColors[user.role]?.bg,
              color: roleColors[user.role]?.color,
            }}>
              {user.role}
            </span>
            <span style={{
              display: 'inline-block', padding: '4px 10px',
              borderRadius: 20, fontSize: 11, fontWeight: 600,
              backgroundColor: '#d1fae5', color: '#065f46',
            }}>
              Active
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UserManagement;
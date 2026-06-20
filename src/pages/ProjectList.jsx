import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiFolder, FiChevronRight, FiFileText } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const navigate = useNavigate();

  const fetchProjects = () => {
    axiosInstance.get('/projects')
      .then(res => setProjects(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await axiosInstance.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 28, gap: 16, flexWrap: 'wrap',
        }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800,
            fontFamily: t.fontDisplay, letterSpacing: '-0.5px',
            color: t.text, margin: '0 0 4px' }}>
            Projects
          </h1>
          <p style={{ color: t.textSecondary, fontSize: 14, margin: 0 }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 18px', background: t.accent,
              color: '#0A0E14', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
              boxShadow: `0 4px 16px ${t.accent}4D`,
            }}>
            <FiPlus size={16} /> New Project
          </motion.button>
        )}
      </motion.div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setShowForm(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 200, padding: 20,
            }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: t.bgSecondary,
                borderRadius: 18, padding: 28, width: '100%',
                maxWidth: 440, border: `1px solid ${t.border}`,
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 22 }}>
                <h2 style={{ color: t.text, fontSize: 18, fontWeight: 700,
                  fontFamily: t.fontDisplay, margin: 0 }}>
                  Create New Project
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none',
                    cursor: 'pointer', color: t.textSecondary, padding: 4 }}>
                  <FiX size={20} />
                </motion.button>
              </div>

              {submitError && (
                <div style={{
                  backgroundColor: `${t.accent}1A`, border: `1px solid ${t.accent}4D`,
                  color: t.accent, padding: '10px 14px', borderRadius: 10,
                  marginBottom: 16, fontSize: 13,
                }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6,
                    color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                    Project name
                  </label>
                  <input
                    placeholder="e.g. Mobile App Redesign"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                    style={{
                      width: '100%', padding: '11px 14px',
                      backgroundColor: t.bgTertiary,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10, color: t.text,
                      fontSize: 14, boxSizing: 'border-box', outline: 'none',
                    }} />
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', marginBottom: 6,
                    color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                    Description <span style={{ color: t.textMuted }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="What's this project about?"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    style={{
                      width: '100%', padding: '11px 14px',
                      backgroundColor: t.bgTertiary,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10, color: t.text,
                      fontSize: 14, boxSizing: 'border-box', outline: 'none',
                      minHeight: 80, resize: 'vertical', fontFamily: 'inherit',
                    }} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
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
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit" disabled={submitting}
                    style={{
                      flex: 1, padding: '12px',
                      background: submitting ? t.border : t.accent,
                      border: 'none', borderRadius: 10,
                      color: submitting ? t.textMuted : '#0A0E14',
                      cursor: submitting ? 'default' : 'pointer',
                      fontSize: 14, fontWeight: 700,
                    }}>
                    {submitting ? 'Creating…' : 'Create Project'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ height: 76, backgroundColor: t.bgTertiary, borderRadius: 14 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          backgroundColor: t.bgSecondary, borderRadius: 16, padding: 48,
          border: `1px solid ${t.border}`, textAlign: 'center',
        }}>
          <FiFolder size={32} color={t.textMuted} style={{ marginBottom: 12 }} />
          <p style={{ color: t.textSecondary, fontSize: 14.5, margin: 0 }}>
            No projects yet{user?.role === 'ADMIN' ? ' — create your first one above.' : '.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 3 }}
              onClick={() => navigate(`/bugs/project/${p.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                backgroundColor: t.bgSecondary, borderRadius: 14,
                padding: '18px 20px', border: `1px solid ${t.border}`,
                boxShadow: t.cardShadow, cursor: 'pointer',
              }}>
              <div style={{
                width: 42, height: 42, borderRadius: 11,
                backgroundColor: `${t.accent}1A`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FiFolder size={18} color={t.accent} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: t.text, fontSize: 15, fontWeight: 700,
                  fontFamily: t.fontDisplay,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {p.name}
                </div>
                {p.description && (
                  <div style={{
                    color: t.textSecondary, fontSize: 12.5, marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.description}
                  </div>
                )}
                <div style={{ color: t.textMuted, fontSize: 11.5, marginTop: 4 }}>
                  Created by {p.createdBy?.name || 'Unknown'}
                </div>
              </div>

              <div className="project-card-view-btn" style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 20,
                backgroundColor: `${t.accent}14`, color: t.accent,
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>
                <FiFileText size={12} />
                <span className="project-card-view-label">View Bugs</span>
              </div>
              <FiChevronRight size={16} color={t.textMuted} style={{ flexShrink: 0 }} className="project-card-chevron" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
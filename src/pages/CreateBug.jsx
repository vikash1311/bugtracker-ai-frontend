import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu, FiTarget, FiFileText, FiGitMerge,
  FiAlertTriangle, FiCheckCircle, FiArrowLeft
} from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

const CreateBug = () => {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM',
    projectId: '', assignedToId: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [aiLoading, setAiLoading] = useState(null); // tracks which AI action is running
  const [aiError, setAiError] = useState('');
  const [reproSteps, setReproSteps] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);

  useEffect(() => {
    axiosInstance.get('/projects')
      .then(res => setProjects(res.data.data || []));
  }, []);

  const runAiAction = async (action, validate, request, onSuccess) => {
    setAiError('');
    if (!validate()) return;
    setAiLoading(action);
    try {
      const res = await request();
      onSuccess(res);
    } catch (e) {
      setAiError('AI service is unavailable right now — try again in a moment.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSuggestPriority = () => runAiAction(
    'priority',
    () => !!form.description || (setAiError('Enter a description first'), false),
    () => axiosInstance.post('/ai/suggest-priority', { description: form.description }),
    res => setForm(f => ({ ...f, priority: res.data.data }))
  );

  const handleGenerateSteps = () => runAiAction(
    'steps',
    () => (!!form.title && !!form.description) || (setAiError('Enter a title and description first'), false),
    () => axiosInstance.post('/ai/reproduction-steps', { title: form.title, description: form.description }),
    res => setReproSteps(res.data.data)
  );

  const handleCheckDuplicate = () => runAiAction(
    'duplicate',
    () => (!!form.description && !!form.projectId) || (setAiError('Enter a description and select a project first'), false),
    () => axiosInstance.post('/ai/check-duplicate', { description: form.description, projectId: form.projectId }),
    res => setDuplicateWarning(res.data.data)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    try {
      const payload = {
        title: form.title,
        description: reproSteps
          ? form.description + '\n\nReproduction Steps:\n' + reproSteps
          : form.description,
        priority: form.priority,
        projectId: parseInt(form.projectId),
        assignedToId: form.assignedToId ? parseInt(form.assignedToId) : null,
      };
      await axiosInstance.post('/bugs', payload);
      navigate(`/bugs/project/${form.projectId}`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  const isDuplicateAlert = duplicateWarning.startsWith('DUPLICATE');

  const aiButtons = [
    { key: 'priority', icon: FiTarget, label: 'Suggest Priority', onClick: handleSuggestPriority },
    { key: 'steps', icon: FiFileText, label: 'Generate Steps', onClick: handleGenerateSteps },
    { key: 'duplicate', icon: FiGitMerge, label: 'Check Duplicate', onClick: handleCheckDuplicate },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        whileHover={{ x: -3 }}
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.textSecondary, fontSize: 13, marginBottom: 16, padding: 0,
        }}>
        <FiArrowLeft size={15} /> Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: t.bgSecondary, borderRadius: 18, padding: 28,
          border: `1px solid ${t.border}`, boxShadow: t.cardShadow,
        }}>
        <h1 style={{
          fontSize: 22, fontWeight: 800, fontFamily: t.fontDisplay,
          color: t.text, margin: '0 0 18px',
        }}>
          Report New Bug
        </h1>

        {/* AI Banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          backgroundColor: `${t.accent}14`, border: `1px solid ${t.accent}33`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 22,
        }}>
          <FiCpu size={18} color={t.accent} style={{ flexShrink: 0 }} />
          <span style={{ color: t.textSecondary, fontSize: 12.5, lineHeight: 1.4 }}>
            AI-powered triage — auto-suggest priority, detect duplicates,
            and generate reproduction steps.
          </span>
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6,
              color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
              Title
            </label>
            <input
              placeholder="Short, descriptive bug title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              style={{
                width: '100%', padding: '11px 14px',
                backgroundColor: t.bgTertiary, border: `1px solid ${t.border}`,
                borderRadius: 10, color: t.text, fontSize: 14,
                boxSizing: 'border-box', outline: 'none',
              }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6,
              color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
              Description
            </label>
            <textarea
              placeholder="Describe the bug in plain language…"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              style={{
                width: '100%', padding: '11px 14px',
                backgroundColor: t.bgTertiary, border: `1px solid ${t.border}`,
                borderRadius: 10, color: t.text, fontSize: 14,
                boxSizing: 'border-box', minHeight: 110, resize: 'vertical',
                fontFamily: 'inherit', outline: 'none',
              }} />

            {/* AI action buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {aiButtons.map(({ key, icon: Icon, label, onClick }) => (
                <motion.button
                  key={key} type="button"
                  whileHover={{ scale: aiLoading ? 1 : 1.03 }}
                  whileTap={{ scale: aiLoading ? 1 : 0.97 }}
                  onClick={onClick} disabled={!!aiLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 13px', borderRadius: 20,
                    border: `1px solid ${t.border}`,
                    backgroundColor: t.bgTertiary,
                    color: t.textSecondary, fontSize: 12,
                    cursor: aiLoading ? 'default' : 'pointer',
                    opacity: aiLoading && aiLoading !== key ? 0.5 : 1,
                  }}>
                  <Icon size={12} color={t.accent} />
                  {aiLoading === key ? 'Working…' : label}
                </motion.button>
              ))}
            </div>
            {aiError && (
              <p style={{ color: t.accent, fontSize: 12, marginTop: 8 }}>{aiError}</p>
            )}
          </div>

          {/* Duplicate warning */}
          {duplicateWarning && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 9,
              padding: '11px 14px', borderRadius: 10, marginBottom: 16,
              fontSize: 12.5, lineHeight: 1.5,
              backgroundColor: isDuplicateAlert ? `${t.accent}14` : `${t.success}14`,
              border: `1px solid ${isDuplicateAlert ? t.accent : t.success}4D`,
              color: isDuplicateAlert ? t.accent : t.success,
            }}>
              {isDuplicateAlert
                ? <FiAlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                : <FiCheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />}
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* Generated repro steps */}
          {reproSteps && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 6,
                color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                AI-generated reproduction steps
              </label>
              <textarea
                value={reproSteps}
                onChange={e => setReproSteps(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px',
                  backgroundColor: `${t.success}0D`, border: `1px solid ${t.success}33`,
                  borderRadius: 10, color: t.text, fontSize: 13.5,
                  boxSizing: 'border-box', minHeight: 100, resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none',
                }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px' }}>
              <label style={{ display: 'block', marginBottom: 6,
                color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                Priority
              </label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                style={{
                  width: '100%', padding: '11px 14px',
                  backgroundColor: t.bgTertiary, border: `1px solid ${t.border}`,
                  borderRadius: 10, color: t.text, fontSize: 14,
                  boxSizing: 'border-box', outline: 'none',
                }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={{ display: 'block', marginBottom: 6,
                color: t.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                Project
              </label>
              <select
                value={form.projectId}
                onChange={e => setForm({ ...form, projectId: e.target.value })}
                required
                style={{
                  width: '100%', padding: '11px 14px',
                  backgroundColor: t.bgTertiary, border: `1px solid ${t.border}`,
                  borderRadius: 10, color: t.text, fontSize: 14,
                  boxSizing: 'border-box', outline: 'none',
                }}>
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate(-1)}
              style={{
                padding: '11px 22px', backgroundColor: t.bgTertiary,
                color: t.textSecondary, border: `1px solid ${t.border}`,
                borderRadius: 10, cursor: 'pointer', fontSize: 13.5,
              }}>
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit" disabled={loading}
              style={{
                padding: '11px 26px',
                background: loading ? t.bgTertiary : t.accent,
                color: loading ? t.textMuted : '#0A0E14',
                border: 'none', borderRadius: 10,
                cursor: loading ? 'default' : 'pointer',
                fontSize: 13.5, fontWeight: 700,
              }}>
              {loading ? 'Submitting…' : 'Report Bug'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBug;
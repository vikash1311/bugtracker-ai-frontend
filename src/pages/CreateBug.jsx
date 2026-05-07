import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CreateBug = () => {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM',
    projectId: '', assignedToId: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [reproSteps, setReproSteps] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/projects')
      .then(res => setProjects(res.data.data || []));
  }, []);

  const handleSuggestPriority = async () => {
    if (!form.description) return alert('Enter description first');
    setAiLoading(true);
    try {
      const res = await axiosInstance.post('/ai/suggest-priority', {
        description: form.description
      });
      setForm(f => ({ ...f, priority: res.data.data }));
    } catch (e) {
      alert('AI unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateSteps = async () => {
    if (!form.title || !form.description)
      return alert('Enter title and description first');
    setAiLoading(true);
    try {
      const res = await axiosInstance.post('/ai/reproduction-steps', {
        title: form.title,
        description: form.description
      });
      setReproSteps(res.data.data);
    } catch (e) {
      alert('AI unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckDuplicate = async () => {
    if (!form.description || !form.projectId)
      return alert('Enter description and select project first');
    setAiLoading(true);
    try {
      const res = await axiosInstance.post('/ai/check-duplicate', {
        description: form.description,
        projectId: form.projectId
      });
      setDuplicateWarning(res.data.data);
    } catch (e) {
      alert('AI unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: reproSteps
          ? form.description + '\n\nReproduction Steps:\n' + reproSteps
          : form.description,
        priority: form.priority,
        projectId: parseInt(form.projectId),
        assignedToId: form.assignedToId
          ? parseInt(form.assignedToId) : null,
      };
      await axiosInstance.post('/bugs', payload);
      navigate(`/bugs/project/${form.projectId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Report New Bug</h1>

        {/* AI Banner */}
        <div style={styles.aiBanner}>
          <span style={styles.aiIcon}>🤖</span>
          <span style={styles.aiText}>
            AI-Powered Triage — auto-suggest priority,
            detect duplicates, generate reproduction steps
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} placeholder="Bug title"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea}
              placeholder="Describe the bug in plain language..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required />
            {/* AI Buttons */}
            <div style={styles.aiButtons}>
              <button type="button" style={styles.aiBtn}
                onClick={handleSuggestPriority} disabled={aiLoading}>
                🎯 Suggest Priority
              </button>
              <button type="button" style={styles.aiBtn}
                onClick={handleGenerateSteps} disabled={aiLoading}>
                📋 Generate Steps
              </button>
              <button type="button" style={styles.aiBtn}
                onClick={handleCheckDuplicate} disabled={aiLoading}>
                🔍 Check Duplicate
              </button>
            </div>
            {aiLoading && (
              <p style={styles.aiStatus}>🤖 AI is thinking...</p>
            )}
          </div>

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div style={{
              ...styles.alert,
              backgroundColor: duplicateWarning.startsWith('DUPLICATE')
                ? '#fee2e2' : '#d1fae5',
              borderColor: duplicateWarning.startsWith('DUPLICATE')
                ? '#fca5a5' : '#6ee7b7',
            }}>
              {duplicateWarning.startsWith('DUPLICATE')
                ? '⚠️ ' : '✅ '}{duplicateWarning}
            </div>
          )}

          {/* Reproduction Steps */}
          {reproSteps && (
            <div style={styles.field}>
              <label style={styles.label}>
                AI Generated Reproduction Steps
              </label>
              <textarea style={{...styles.textarea, backgroundColor: '#f0fdf4'}}
                value={reproSteps}
                onChange={e => setReproSteps(e.target.value)} />
            </div>
          )}

          <div style={styles.row}>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>Priority</label>
              <select style={styles.input} value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>Project</label>
              <select style={styles.input} value={form.projectId}
                onChange={e => setForm({...form, projectId: e.target.value})}
                required>
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="button" style={styles.cancelBtn}
              onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Submitting...' : 'Report Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '700px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  title: { fontSize: '22px', color: '#1e293b', marginBottom: '16px' },
  aiBanner: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px' },
  aiIcon: { fontSize: '20px' },
  aiText: { color: '#1d4ed8', fontSize: '13px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: '500' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', minHeight: '100px' },
  aiButtons: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
  aiBtn: { padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#475569' },
  aiStatus: { color: '#6366f1', fontSize: '13px', marginTop: '6px' },
  alert: { padding: '10px 14px', borderRadius: '8px', border: '1px solid', marginBottom: '16px', fontSize: '13px' },
  row: { display: 'flex', gap: '16px' },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  btn: { padding: '10px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  cancelBtn: { padding: '10px 24px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};

export default CreateBug;
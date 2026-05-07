import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
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
    try {
      await axiosInstance.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '16px' }}>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <input style={styles.input} placeholder="Project name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required />
            <textarea style={styles.textarea} placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
            <button style={styles.btn} type="submit">Create Project</button>
          </form>
        </div>
      )}

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Project Name</span>
          <span>Description</span>
          <span>Created By</span>
          <span>Actions</span>
        </div>
        {projects.map(p => (
          <div key={p.id} style={styles.tableRow}>
            <span style={styles.projectName}>{p.name}</span>
            <span style={styles.desc}>{p.description || '—'}</span>
            <span style={styles.meta}>{p.createdBy?.name}</span>
            <button style={styles.viewBtn}
              onClick={() => navigate(`/bugs/project/${p.id}`)}>
              View Bugs
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', color: '#1e293b' },
  formCard: {
    backgroundColor: '#fff', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  input: {
    display: 'block', width: '100%', padding: '10px 12px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box',
  },
  textarea: {
    display: 'block', width: '100%', padding: '10px 12px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box',
    minHeight: '80px',
  },
  btn: {
    padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  table: {
    backgroundColor: '#fff', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr',
    padding: '12px 20px', backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0', fontSize: '13px',
    fontWeight: '600', color: '#475569',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr',
    padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
    alignItems: 'center',
  },
  projectName: { fontWeight: '500', color: '#1e293b', fontSize: '14px' },
  desc: { color: '#64748b', fontSize: '13px' },
  meta: { color: '#94a3b8', fontSize: '13px' },
  viewBtn: {
    padding: '6px 12px', backgroundColor: '#eff6ff', color: '#3b82f6',
    border: '1px solid #bfdbfe', borderRadius: '6px',
    cursor: 'pointer', fontSize: '12px',
  },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
};

export default ProjectList;
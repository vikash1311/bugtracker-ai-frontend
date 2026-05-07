import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  OPEN: '#fef3c7', IN_PROGRESS: '#dbeafe',
  RESOLVED: '#d1fae5', CLOSED: '#f1f5f9',
};
const priorityColors = {
  LOW: '#d1fae5', MEDIUM: '#fef3c7',
  HIGH: '#fee2e2', CRITICAL: '#fce7f3',
};

const BugList = () => {
  const { projectId } = useParams();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBugs = useCallback(() => {
    let url = `/bugs/project/${projectId}?page=${page}&size=10`;
    if (statusFilter) url += `&status=${statusFilter}`;
    axiosInstance.get(url)
      .then(res => {
        setBugs(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId, page, statusFilter]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Bugs</h1>
        <div style={styles.actions}>
          <select style={styles.select} value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          {(user?.role === 'TESTER' || user?.role === 'ADMIN') && (
            <button style={styles.btn}
              onClick={() => navigate('/bugs/create')}>
              + Report Bug
            </button>
          )}
        </div>
      </div>

      {bugs.length === 0 ? (
        <div style={styles.empty}>No bugs found.</div>
      ) : (
        <div style={styles.list}>
          {bugs.map(bug => (
            <div key={bug.id} style={styles.card}
              onClick={() => navigate(`/bugs/${bug.id}`)}>
              <div style={styles.cardTop}>
                <span style={styles.bugTitle}>{bug.title}</span>
                <div style={styles.badges}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: priorityColors[bug.priority]
                  }}>
                    {bug.priority}
                  </span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: statusColors[bug.status]
                  }}>
                    {bug.status}
                  </span>
                </div>
              </div>
              <p style={styles.desc}>{bug.description}</p>
              <div style={styles.cardBottom}>
                <span style={styles.meta}>
                  Project: {bug.projectName}
                </span>
                <span style={styles.meta}>
                  Reporter: {bug.reportedByName}
                </span>
                <span style={styles.meta}>
                  Assigned: {bug.assignedToName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 0}
            onClick={() => setPage(p => p - 1)}>
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button style={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', color: '#1e293b' },
  actions: { display: 'flex', gap: '12px', alignItems: 'center' },
  select: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' },
  btn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { backgroundColor: '#fff', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', border: '1px solid #e2e8f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  bugTitle: { fontWeight: '600', color: '#1e293b', fontSize: '15px' },
  badges: { display: 'flex', gap: '8px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  desc: { color: '#64748b', fontSize: '13px', marginBottom: '12px' },
  cardBottom: { display: 'flex', gap: '20px' },
  meta: { fontSize: '12px', color: '#94a3b8' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff' },
  pageInfo: { color: '#64748b', fontSize: '14px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
};

export default BugList;
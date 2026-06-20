import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme, priorityConfig, statusConfig } from '../utils/theme';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const BugList = () => {
  const { projectId } = useParams();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const navigate = useNavigate();

  const fetchBugs = useCallback(() => {
    setLoading(true);
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

  useEffect(() => { fetchBugs(); }, [fetchBugs]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap',
        }}>
        <h1 style={{ fontSize: 26, fontWeight: 800,
          fontFamily: t.fontDisplay, letterSpacing: '-0.5px',
          color: t.text, margin: 0 }}>
          Bugs
        </h1>
        {(user?.role === 'TESTER' || user?.role === 'ADMIN') && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/bugs/create')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 18px', background: t.accent,
              color: '#0A0E14', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
              boxShadow: `0 4px 16px ${t.accent}4D`,
            }}>
            <FiPlus size={16} /> Report Bug
          </motion.button>
        )}
      </motion.div>

      {/* Status filter pills */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
        overflowX: 'auto', paddingBottom: 2,
      }}>
        {STATUS_FILTERS.map(f => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(0); }}
              style={{
                padding: '7px 14px', borderRadius: 20, fontSize: 12.5,
                fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                border: `1px solid ${active ? t.accent : t.border}`,
                backgroundColor: active ? `${t.accent}1A` : 'transparent',
                color: active ? t.accent : t.textSecondary,
              }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Bug cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ height: 92, backgroundColor: t.bgTertiary, borderRadius: 14 }} />
          ))}
        </div>
      ) : bugs.length === 0 ? (
        <div style={{
          backgroundColor: t.bgSecondary, borderRadius: 16, padding: 48,
          border: `1px solid ${t.border}`, textAlign: 'center',
        }}>
          <FiInbox size={32} color={t.textMuted} style={{ marginBottom: 12 }} />
          <p style={{ color: t.textSecondary, fontSize: 14.5, margin: 0 }}>
            No bugs found{statusFilter ? ' for this filter.' : '.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bugs.map((bug, i) => {
            const statusInfo = statusConfig[bug.status] || statusConfig.OPEN;
            const priorityInfo = priorityConfig[bug.priority] || priorityConfig.LOW;
            return (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/bugs/${bug.id}`)}
                style={{
                  backgroundColor: t.bgSecondary, borderRadius: 14,
                  padding: '16px 20px', border: `1px solid ${t.border}`,
                  boxShadow: t.cardShadow, cursor: 'pointer',
                }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 12, marginBottom: 8,
                }}>
                  <span style={{
                    color: t.text, fontSize: 15, fontWeight: 700,
                    fontFamily: t.fontDisplay, lineHeight: 1.3,
                  }}>
                    {bug.title}
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 10.5,
                      fontWeight: 700, letterSpacing: '0.3px',
                      color: priorityInfo.color, backgroundColor: priorityInfo.bg,
                    }}>
                      {priorityInfo.label.toUpperCase()}
                    </span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 10.5,
                      fontWeight: 700, letterSpacing: '0.3px',
                      color: statusInfo.color, backgroundColor: statusInfo.bg,
                    }}>
                      {statusInfo.label.toUpperCase()}
                    </span>
                  </div>
                </div>
                {bug.description && (
                  <p style={{
                    color: t.textSecondary, fontSize: 13, lineHeight: 1.5,
                    margin: '0 0 12px',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {bug.description}
                  </p>
                )}
                <div style={{
                  display: 'flex', gap: 16, flexWrap: 'wrap',
                  color: t.textMuted, fontSize: 11.5,
                }}>
                  <span>Project: {bug.projectName}</span>
                  <span>Reporter: {bug.reportedByName}</span>
                  {bug.assignedToName && <span>Assigned: {bug.assignedToName}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 14, marginTop: 28,
        }}>
          <motion.button
            whileHover={{ scale: page === 0 ? 1 : 1.05 }}
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              border: `1px solid ${t.border}`,
              backgroundColor: t.bgSecondary,
              color: page === 0 ? t.textMuted : t.textSecondary,
              cursor: page === 0 ? 'default' : 'pointer', fontSize: 13,
            }}>
            <FiChevronLeft size={14} /> Previous
          </motion.button>
          <span style={{ color: t.textMuted, fontSize: 13, fontFamily: t.fontMono }}>
            {page + 1} / {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: page >= totalPages - 1 ? 1 : 1.05 }}
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              border: `1px solid ${t.border}`,
              backgroundColor: t.bgSecondary,
              color: page >= totalPages - 1 ? t.textMuted : t.textSecondary,
              cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontSize: 13,
            }}>
            Next <FiChevronRight size={14} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default BugList;
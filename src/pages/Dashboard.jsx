import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAlertCircle, FiFolder, FiClock, FiCheckCircle,
  FiChevronRight
} from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme, priorityConfig, statusConfig } from '../utils/theme';

// Circular status ring built as raw SVG (not recharts) so it sizes itself
// deterministically on mobile instead of depending on ResponsiveContainer's
// post-mount measurement, which was producing the broken/blank arcs.
const StatusRing = ({ open, resolved, total, t, size = 220 }) => {
  const radius = size * 0.38;
  const stroke = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const resolvedFrac = total > 0 ? resolved / total : 0;
  const openFrac = total > 0 ? open / total : 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius + stroke * 0.9}
        fill="none" stroke={t.border} strokeWidth="1" />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={t.bgTertiary} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={t.success} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - resolvedFrac) }}
        transition={{ duration: 1, ease: 'easeOut' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={t.accent} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference * openFrac} ${circumference}`}
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={{ strokeDashoffset: -circumference * resolvedFrac, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="48%" textAnchor="middle" fontFamily={t.fontDisplay}
        fontWeight="800" fontSize={size * 0.21} fill={t.text}>
        {open}
      </text>
      <text x="50%" y="62%" textAnchor="middle" fontFamily={t.fontMono}
        fontSize={size * 0.05} letterSpacing="1" fill={t.textMuted}>
        OPEN BUGS
      </text>
    </svg>
  );
};

const MiniStat = ({ icon: Icon, label, value, color, t, highlight, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    style={{
      backgroundColor: t.bgSecondary, borderRadius: 14,
      padding: '14px', border: `1px solid ${highlight ? color + '55' : t.border}`,
      flex: '1 1 0', minWidth: 0,
    }}>
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      border: `1.25px solid ${color}`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    }}>
      <Icon size={13} color={color} />
    </div>
    <div style={{ fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 800, color: t.text }}>
      {value}
    </div>
    <div style={{ color: t.textMuted, fontSize: 11.5, marginTop: 2, whiteSpace: 'nowrap' }}>
      {label}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [allBugs, setAllBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/projects'),
    ]).then(([projRes]) => {
      const projs = projRes.data.data || [];
      setProjects(projs);
      return Promise.all(
        projs.map(p =>
          axiosInstance.get(`/bugs/project/${p.id}?page=0&size=100`)
            .then(r => (r.data.data?.content || []).map(bug => ({ ...bug, projectId: p.id })))
            .catch(() => [])
        )
      );
    }).then(bugArrays => {
      setAllBugs(bugArrays.flat());
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: allBugs.length,
    open: allBugs.filter(b => b.status === 'OPEN').length,
    inProgress: allBugs.filter(b => b.status === 'IN_PROGRESS').length,
    resolved: allBugs.filter(b => b.status === 'RESOLVED').length,
    closed: allBugs.filter(b => b.status === 'CLOSED').length,
  };

  // Recent activity derived from real bug data (most recently updated),
  // not a fabricated feed — there's no dedicated activity endpoint yet.
  const recentActivity = [...allBugs]
    .filter(b => b.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const formatRelativeTime = (iso) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 16,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: `3px solid ${t.accent}`,
          borderTopColor: 'transparent',
        }}
      />
      <p style={{ color: t.textSecondary, fontSize: 14 }}>
        Loading dashboard...
      </p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: t.fontMono, fontSize: 11, letterSpacing: '1.5px',
          color: t.textMuted, marginBottom: 6, textTransform: 'uppercase',
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800,
          fontFamily: t.fontDisplay, letterSpacing: '-0.5px',
          color: t.text, margin: 0 }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
      </motion.div>

      {/* Hero: status ring + mini stats */}
      <div className="dashboard-hero-grid" style={{
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24,
        marginBottom: 28, alignItems: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: t.bgSecondary, borderRadius: 18,
            padding: '24px', border: `1px solid ${t.border}`,
            boxShadow: t.cardShadow,
          }}>
          <StatusRing open={stats.open} resolved={stats.resolved} total={stats.total} t={t} />
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: t.textSecondary }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
              Needs attention
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.success, display: 'inline-block' }} />
              Resolved
            </span>
          </div>
        </motion.div>

        <div>
          <p style={{ fontFamily: t.fontMono, fontSize: 10.5, letterSpacing: '1.5px',
            color: t.textMuted, marginBottom: 10, textTransform: 'uppercase' }}>
            Overview
          </p>
          <div className="dashboard-mini-stats" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <MiniStat icon={FiAlertCircle} label="Total Bugs" value={stats.total}
              color={t.textSecondary} t={t} delay={0} />
            <MiniStat icon={FiAlertCircle} label="Open" value={stats.open}
              color={t.accent} t={t} highlight delay={0.05} />
            <MiniStat icon={FiClock} label="In Progress" value={stats.inProgress}
              color="#E0A22D" t={t} delay={0.1} />
            <MiniStat icon={FiCheckCircle} label="Resolved" value={stats.resolved}
              color={t.success} t={t} delay={0.15} />
            <MiniStat icon={FiFolder} label="Projects" value={projects.length}
              color={t.accent} t={t} delay={0.2} />
          </div>
        </div>
      </div>

      {/* Recent activity + projects */}
      <div className="dashboard-bottom-grid" style={{
        display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24,
      }}>
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}>
          <p style={{ fontFamily: t.fontMono, fontSize: 10.5, letterSpacing: '1.5px',
            color: t.textMuted, marginBottom: 10, textTransform: 'uppercase' }}>
            Recent Activity
          </p>
          {recentActivity.length === 0 ? (
            <div style={{
              backgroundColor: t.bgSecondary, borderRadius: 14, padding: 20,
              border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 13.5,
            }}>
              No recent activity yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentActivity.map((bug, i) => {
                const statusInfo = statusConfig[bug.status] || statusConfig.OPEN;
                const priorityInfo = priorityConfig[bug.priority] || priorityConfig.LOW;
                return (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ x: 3 }}
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      backgroundColor: t.bgSecondary, borderRadius: 14,
                      padding: '13px 16px', border: `1px solid ${t.border}`,
                      cursor: 'pointer',
                    }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: statusInfo.color, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: t.text, fontSize: 13.5, fontWeight: 600,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {bug.title}
                      </div>
                      <div style={{ color: t.textMuted, fontSize: 11.5, marginTop: 1 }}>
                        {bug.projectName} · {formatRelativeTime(bug.updatedAt)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '4px 9px',
                      borderRadius: 20, color: priorityInfo.color,
                      backgroundColor: priorityInfo.bg, flexShrink: 0,
                      letterSpacing: '0.3px',
                    }}>
                      {priorityInfo.label.toUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <p style={{ fontFamily: t.fontMono, fontSize: 10.5, letterSpacing: '1.5px',
            color: t.textMuted, marginBottom: 10, textTransform: 'uppercase' }}>
            Projects
          </p>
          {projects.length === 0 ? (
            <div style={{
              backgroundColor: t.bgSecondary, borderRadius: 14, padding: 20,
              border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 13.5,
            }}>
              No projects yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileHover={{ x: 3 }}
                  onClick={() => navigate(`/bugs/project/${project.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    backgroundColor: t.bgSecondary, borderRadius: 14,
                    padding: '13px 16px', border: `1px solid ${t.border}`,
                    cursor: 'pointer',
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    backgroundColor: t.accent + '1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FiFolder size={14} color={t.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: t.text, fontSize: 13.5, fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {project.name}
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 11.5, marginTop: 1 }}>
                      {project.createdByName}
                    </div>
                  </div>
                  <FiChevronRight size={16} color={t.textMuted} style={{ flexShrink: 0 }} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
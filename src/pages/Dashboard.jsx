import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  FiAlertCircle, FiFolder, 
  FiCheckCircle, FiClock, FiXCircle
} from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

const StatCard = ({ icon: Icon, label, value, color, delay, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
    style={{
      backgroundColor: t.bgSecondary, borderRadius: 16,
      padding: '24px', border: `1px solid ${t.border}`,
      boxShadow: t.cardShadow, cursor: 'default',
    }}>
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: color + '20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color={color} />
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring' }}
        style={{
          fontSize: 32, fontWeight: 800, color: t.text,
        }}>
        {value}
      </motion.div>
    </div>
    <div style={{ color: t.textSecondary, fontSize: 14, fontWeight: 500 }}>
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
      // Fetch bugs for all projects
      return Promise.all(
        projs.map(p =>
          axiosInstance.get(`/bugs/project/${p.id}?page=0&size=100`)
            .then(r => r.data.data?.content || [])
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
    critical: allBugs.filter(b => b.priority === 'CRITICAL').length,
  };

  const pieData = [
    { name: 'Open', value: stats.open, color: '#3b82f6' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
    { name: 'Closed', value: stats.closed, color: '#64748b' },
  ].filter(d => d.value > 0);

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
        border: '3px solid #3b82f6',
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
        style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800,
          color: t.text, marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: t.textSecondary, fontSize: 14 }}>
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16, marginBottom: 32 }}>
        <StatCard icon={FiAlertCircle} label="Total Bugs"
          value={stats.total} color="#3b82f6" delay={0} t={t} />
        <StatCard icon={FiAlertCircle} label="Open"
          value={stats.open} color="#ef4444" delay={0.1} t={t} />
        <StatCard icon={FiClock} label="In Progress"
          value={stats.inProgress} color="#f59e0b" delay={0.2} t={t} />
        <StatCard icon={FiCheckCircle} label="Resolved"
          value={stats.resolved} color="#10b981" delay={0.3} t={t} />
        <StatCard icon={FiXCircle} label="Closed"
          value={stats.closed} color="#64748b" delay={0.4} t={t} />
        <StatCard icon={FiFolder} label="Projects"
          value={projects.length} color="#8b5cf6" delay={0.5} t={t} />
      </div>

      {/* Chart + Projects */}
      <div style={{ display: 'grid',
        gridTemplateColumns: '1fr 1.5fr', gap: 24,
        marginBottom: 32 }}>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              backgroundColor: t.bgSecondary, borderRadius: 16,
              padding: 24, border: `1px solid ${t.border}`,
              boxShadow: t.cardShadow,
            }}>
            <h3 style={{ color: t.text, marginBottom: 16,
              fontSize: 16, fontWeight: 600 }}>
              Bug Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: t.bgSecondary,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8, color: t.text,
                  }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            backgroundColor: t.bgSecondary, borderRadius: 16,
            padding: 24, border: `1px solid ${t.border}`,
            boxShadow: t.cardShadow,
          }}>
          <h3 style={{ color: t.text, marginBottom: 16,
            fontSize: 16, fontWeight: 600 }}>
            Projects
          </h3>
          {projects.length === 0 ? (
            <p style={{ color: t.textMuted, fontSize: 14 }}>
              No projects yet.
            </p>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/bugs/project/${project.id}`)}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: `1px solid ${t.border}`,
                  cursor: 'pointer',
                }}>
                <div>
                  <div style={{ color: t.text, fontSize: 14,
                    fontWeight: 500, marginBottom: 2 }}>
                    {project.name}
                  </div>
                  <div style={{ color: t.textMuted, fontSize: 12 }}>
                    {project.createdByName}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: t.accent + '20',
                    color: t.accent, borderRadius: 20,
                    fontSize: 12, fontWeight: 500,
                  }}>
                  View →
                </motion.div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

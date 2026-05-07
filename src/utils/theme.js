export const getTheme = (isDark) => ({
  bg: isDark ? '#0f172a' : '#f1f5f9',
  bgSecondary: isDark ? '#1e293b' : '#ffffff',
  bgTertiary: isDark ? '#334155' : '#f8fafc',
  sidebar: isDark ? '#1e293b' : '#1e293b',
  text: isDark ? '#f1f5f9' : '#0f172a',
  textSecondary: isDark ? '#94a3b8' : '#64748b',
  textMuted: isDark ? '#64748b' : '#94a3b8',
  border: isDark ? '#334155' : '#e2e8f0',
  accent: '#3b82f6',
  accentHover: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  critical: '#8b5cf6',
  cardShadow: isDark
    ? '0 4px 24px rgba(0,0,0,0.4)'
    : '0 4px 24px rgba(0,0,0,0.08)',
  glass: isDark
    ? 'rgba(30,41,59,0.8)'
    : 'rgba(255,255,255,0.8)',
});

export const priorityConfig = {
  LOW:      { color: '#10b981', bg: '#d1fae5', label: 'Low' },
  MEDIUM:   { color: '#f59e0b', bg: '#fef3c7', label: 'Medium' },
  HIGH:     { color: '#ef4444', bg: '#fee2e2', label: 'High' },
  CRITICAL: { color: '#8b5cf6', bg: '#ede9fe', label: 'Critical' },
};

export const statusConfig = {
  OPEN:        { color: '#3b82f6', bg: '#dbeafe', label: 'Open' },
  IN_PROGRESS: { color: '#f59e0b', bg: '#fef3c7', label: 'In Progress' },
  RESOLVED:    { color: '#10b981', bg: '#d1fae5', label: 'Resolved' },
  CLOSED:      { color: '#64748b', bg: '#f1f5f9', label: 'Closed' },
};
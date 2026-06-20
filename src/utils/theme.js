// Core app theme — drives Sidebar, Layout, Login, Dashboard, and all
// authenticated pages via getTheme(isDark). Built on the same brand
// identity as the public Landing page (utils/brandTheme.js): near-black
// surfaces, a single signal-orange accent for action/attention, and a
// cold teal reserved for "resolved/success" states only.

const SIGNAL = '#E94F37';   // primary accent — CTAs, active states, alerts
const RESOLVED = '#5EEAD4'; // secondary accent — success/done only

export const getTheme = (isDark) => ({
  bg: isDark ? '#0A0E14' : '#F7F8FA',
  bgSecondary: isDark ? '#10141C' : '#FFFFFF',
  bgTertiary: isDark ? '#171D27' : '#F1F3F6',
  sidebar: isDark ? '#0A0E14' : '#10141C', // sidebar stays dark in both modes — anchors the brand
  text: isDark ? '#F5F6F7' : '#10141C',
  textSecondary: isDark ? '#8B93A1' : '#5C6470',
  textMuted: isDark ? '#5A6372' : '#8B93A1',
  border: isDark ? '#1C2330' : '#E4E7EC',
  accent: SIGNAL,
  accentHover: '#D8432C',
  success: RESOLVED,
  warning: '#E0A22D',
  danger: '#E94F37',
  critical: '#C73A24',
  cardShadow: isDark
    ? '0 4px 24px rgba(0,0,0,0.45)'
    : '0 2px 12px rgba(16,20,28,0.06)',
  glass: isDark
    ? 'rgba(16,20,28,0.85)'
    : 'rgba(255,255,255,0.85)',
  fontDisplay: "'Inter Tight', 'Inter', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Courier New', monospace",
});

// Severity: intensity within the same warm family rather than a rainbow —
// reads as "how urgent" instead of mismatched hues competing for attention.
export const priorityConfig = {
  LOW:      { color: '#8B93A1', bg: 'rgba(139,147,161,0.12)', label: 'Low' },
  MEDIUM:   { color: '#E0A22D', bg: 'rgba(224,162,45,0.12)',  label: 'Medium' },
  HIGH:     { color: '#E94F37', bg: 'rgba(233,79,55,0.12)',   label: 'High' },
  CRITICAL: { color: '#C73A24', bg: 'rgba(199,58,36,0.16)',   label: 'Critical' },
};

// Status: neutral -> in-progress -> resolved (teal), closed fades to muted.
export const statusConfig = {
  OPEN:        { color: '#8B93A1', bg: 'rgba(139,147,161,0.12)', label: 'Open' },
  IN_PROGRESS: { color: '#E0A22D', bg: 'rgba(224,162,45,0.12)',  label: 'In Progress' },
  RESOLVED:    { color: '#5EEAD4', bg: 'rgba(94,234,212,0.12)',  label: 'Resolved' },
  CLOSED:      { color: '#5A6372', bg: 'rgba(90,99,114,0.12)',   label: 'Closed' },
};
// Brand tokens for the public-facing identity (landing page, marketing
// surfaces, logo). Deliberately separate from utils/theme.js, which still
// drives the authenticated app (dashboard, sidebar, etc.) on the existing
// blue/violet palette. Merge the two only when you're ready to re-skin the
// whole product — until then this keeps the landing page redesign isolated
// and low-risk.

export const brand = {
  bg: '#0A0E14',
  bgElevated: '#10141C',
  bgCard: '#10141C',
  border: '#1C2330',
  borderStrong: '#2A3342',
  grid: '#151B26',

  textPrimary: '#F5F6F7',
  textSecondary: '#8B93A1',
  textMuted: '#5A6372',

  signal: '#E94F37',       // detection / primary CTA / alert-as-feature
  signalDim: '#E94F3733',  // 20% opacity signal, for glows/fills
  resolved: '#5EEAD4',     // success / "fixed" state / secondary accent

  fontDisplay: "'Inter Tight', 'Inter', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Courier New', monospace",
};
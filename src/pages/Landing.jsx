import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTarget, FiGitMerge, FiFileText, FiUsers,
  FiArrowRight, FiGithub
} from 'react-icons/fi';
import { brand as b } from '../utils/brandTheme';

const NAV_LINKS = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Stack', href: '#stack' },
];

const CAPABILITIES = [
  {
    icon: FiTarget,
    title: 'AI priority triage',
    body: 'Every report is scored for severity straight from plain-language descriptions — no manual tagging.',
    accent: b.signal,
  },
  {
    icon: FiGitMerge,
    title: 'Duplicate detection',
    body: 'Semantic matching against your entire backlog catches duplicates a keyword search would miss.',
    accent: b.resolved,
  },
  {
    icon: FiFileText,
    title: 'Auto reproduction steps',
    body: 'Developer-ready repro steps generated instantly from the original report — no back-and-forth.',
    accent: b.signal,
  },
  {
    icon: FiUsers,
    title: 'Role-based access',
    body: 'Admin, developer, and tester scopes are built into the core data model, not bolted on after.',
    accent: b.resolved,
  },
];

const STACK = [
  'Java 21', 'Spring Boot 3', 'Spring Security', 'React', 'JWT Auth',
  'MySQL', 'Groq LLaMA 3.3 70B', 'Render', 'Netlify',
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Report', body: 'A tester or user describes the bug in plain language — no rigid form fields required.' },
  { step: '02', title: 'Detect', body: 'The AI engine scores severity, checks for duplicates, and drafts reproduction steps automatically.' },
  { step: '03', title: 'Resolve', body: 'Developers get a fully triaged, de-duplicated ticket — ready to act on, not ready to investigate.' },
];

// Radar visual used in the hero — mirrors the logo mark concept.
const RadarGraphic = () => (
  <svg viewBox="0 0 340 340" width="100%" style={{ maxWidth: 420, display: 'block', margin: '0 auto' }}>
    <circle cx="170" cy="170" r="168" fill="none" stroke={b.grid} strokeWidth="1" />
    <circle cx="170" cy="170" r="123" fill="none" stroke={b.grid} strokeWidth="1" />
    <circle cx="170" cy="170" r="78" fill="none" stroke={b.grid} strokeWidth="1" />
    <circle cx="170" cy="170" r="33" fill="none" stroke={b.border} strokeWidth="1" />
    <line x1="170" y1="2" x2="170" y2="338" stroke={b.grid} strokeWidth="1" />
    <line x1="2" y1="170" x2="338" y2="170" stroke={b.grid} strokeWidth="1" />

    <motion.g
      style={{ transformOrigin: '170px 170px' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    >
      <path d="M170 170 L170 2 A168 168 0 0 1 288 50 Z" fill={b.signal} opacity="0.08" />
      <line x1="170" y1="170" x2="170" y2="2" stroke={b.signal} strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    </motion.g>

    <motion.circle
      cx="232" cy="92" r="5" fill={b.signal}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <circle cx="120" cy="242" r="4" fill={b.resolved} />
    <circle cx="262" cy="222" r="3.5" fill={b.resolved} opacity="0.6" />
    <circle cx="92" cy="120" r="3.5" fill={b.resolved} opacity="0.6" />

    <g transform="translate(170,170)">
      <line x1="-7" y1="-4" x2="-14" y2="-8" stroke={b.signal} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-7" y1="4" x2="-14" y2="8" stroke={b.signal} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="-4" x2="14" y2="-8" stroke={b.signal} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="4" x2="14" y2="8" stroke={b.signal} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="0,-9 8,-4.5 8,4.5 0,9 -8,4.5 -8,-4.5" fill={b.signal} />
    </g>
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: b.bg, minHeight: '100vh', color: b.textPrimary,
      fontFamily: b.fontBody, overflowX: 'hidden' }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${b.grid} 1px, transparent 1px), linear-gradient(90deg, ${b.grid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)',
      }} />

      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(10px)',
        backgroundColor: scrolled ? `${b.bg}E6` : 'transparent',
        borderBottom: `1px solid ${scrolled ? b.border : 'transparent'}`,
        transition: 'all 0.25s ease',
      }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="24" fill="none" stroke={b.border} strokeWidth="1.5" />
              <line x1="32" y1="32" x2="32" y2="8" stroke={b.signal} strokeWidth="2" strokeLinecap="round" />
              <polygon points="32,24 39,28 39,36 32,40 25,36 25,28" fill={b.signal} />
            </svg>
            <span style={{ fontFamily: b.fontDisplay, fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
              BugTracker <span style={{ color: b.signal }}>AI</span>
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 32 }} className="landing-nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{
                color: b.textSecondary, textDecoration: 'none', fontSize: 14,
              }}>{l.label}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="https://github.com/vikash1311/bugtracker-ai" target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: b.textSecondary, textDecoration: 'none', fontSize: 13.5,
                padding: '8px 14px', borderRadius: 7, border: `1px solid ${b.borderStrong}`,
              }}>
              <FiGithub size={15} /> GitHub
            </a>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              style={{
                background: b.signal, color: b.bg, border: 'none',
                borderRadius: 7, padding: '9px 16px', fontSize: 13.5,
                fontWeight: 700, cursor: 'pointer',
              }}>
              Sign in
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto',
        padding: '88px 24px 64px', display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)',
        gap: 48, alignItems: 'center',
      }} className="landing-hero-grid">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid ${b.borderStrong}`, borderRadius: 20,
              padding: '6px 14px', marginBottom: 28,
            }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: b.signal,
            }} />
            <span style={{
              fontFamily: b.fontMono, fontSize: 11, letterSpacing: '0.5px',
              color: b.textSecondary,
            }}>LIVE DETECTION · AI-POWERED TRIAGE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: b.fontDisplay, fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 58px)', lineHeight: 1.08,
              letterSpacing: '-1.5px', margin: '0 0 24px',
            }}>
            Every bug, found<br />before it finds <span style={{ color: b.signal }}>you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 17, color: b.textSecondary, lineHeight: 1.6, maxWidth: 480, margin: '0 0 36px' }}>
            AI triage, duplicate detection, and reproduction steps —
            built for engineering teams who ship fast and don't have time
            to manually sort a backlog.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: b.signal, color: b.bg, border: 'none',
                borderRadius: 8, padding: '14px 22px', fontSize: 14.5,
                fontWeight: 700, cursor: 'pointer',
              }}>
              Sign in to start <FiArrowRight size={16} />
            </motion.button>
            <motion.a
              href="https://github.com/vikash1311/bugtracker-ai" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: b.textPrimary,
                border: `1px solid ${b.borderStrong}`, borderRadius: 8,
                padding: '14px 22px', fontSize: 14.5, fontWeight: 600,
                cursor: 'pointer', textDecoration: 'none',
              }}>
              View on GitHub
            </motion.a>
          </motion.div>

          <p style={{ fontFamily: b.fontMono, fontSize: 12, color: b.textMuted }}>
            $ no credit card · open source · MIT license
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <RadarGraphic />
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: b.bgCard, border: `1px solid ${b.border}`,
              borderRadius: 10, padding: '14px 18px', marginTop: -20,
              maxWidth: 220, marginLeft: 'auto', marginRight: 'auto',
              position: 'relative', zIndex: 2,
            }}>
            <div style={{ fontFamily: b.fontMono, fontSize: 10.5, letterSpacing: '0.5px', color: b.textMuted, marginBottom: 6 }}>
              AVG. TRIAGE TIME
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: b.fontDisplay, fontSize: 26, fontWeight: 800, color: b.resolved }}>4.2s</span>
              <span style={{ fontSize: 12, color: b.textMuted }}>vs 14 min manual</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" style={{
        position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto',
        padding: '64px 24px', borderTop: `1px solid ${b.border}`,
      }}>
        <div style={{ fontFamily: b.fontMono, fontSize: 11, letterSpacing: '1.5px', color: b.textMuted, marginBottom: 14 }}>
          CAPABILITIES
        </div>
        <h2 style={{
          fontFamily: b.fontDisplay, fontSize: 30, fontWeight: 700,
          letterSpacing: '-0.5px', margin: '0 0 40px', maxWidth: 560,
        }}>
          Built to remove the manual work between report and fix.
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16,
        }}>
          {CAPABILITIES.map(({ icon: Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: b.bgCard, border: `1px solid ${b.border}`,
                borderRadius: 12, padding: 22,
              }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: `1.25px solid ${accent}`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 18,
              }}>
                <Icon size={16} color={accent} />
              </div>
              <h3 style={{ fontFamily: b.fontDisplay, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>
                {title}
              </h3>
              <p style={{ fontSize: 13.5, color: b.textSecondary, lineHeight: 1.55, margin: 0 }}>
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{
        position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto',
        padding: '64px 24px', borderTop: `1px solid ${b.border}`,
      }}>
        <div style={{ fontFamily: b.fontMono, fontSize: 11, letterSpacing: '1.5px', color: b.textMuted, marginBottom: 14 }}>
          HOW IT WORKS
        </div>
        <h2 style={{
          fontFamily: b.fontDisplay, fontSize: 30, fontWeight: 700,
          letterSpacing: '-0.5px', margin: '0 0 40px',
        }}>
          From report to resolution, automatically.
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0,
        }}>
          {HOW_IT_WORKS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: '0 24px 0 0', borderLeft: i === 0 ? 'none' : `1px solid ${b.border}`,
                paddingLeft: i === 0 ? 0 : 24,
              }}>
              <div style={{
                fontFamily: b.fontMono, fontSize: 13, color: b.signal,
                marginBottom: 12, fontWeight: 500,
              }}>{s.step}</div>
              <h3 style={{ fontFamily: b.fontDisplay, fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13.5, color: b.textSecondary, lineHeight: 1.6, margin: 0 }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" style={{
        position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto',
        padding: '64px 24px', borderTop: `1px solid ${b.border}`,
      }}>
        <div style={{ fontFamily: b.fontMono, fontSize: 11, letterSpacing: '1.5px', color: b.textMuted, marginBottom: 18 }}>
          BUILT WITH
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {STACK.map(s => (
            <span key={s} style={{
              fontFamily: b.fontMono, fontSize: 12.5, color: b.textSecondary,
              border: `1px solid ${b.border}`, borderRadius: 6,
              padding: '7px 12px', background: b.bgCard,
            }}>{s}</span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto',
        padding: '64px 24px 96px', borderTop: `1px solid ${b.border}`,
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: b.fontDisplay, fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.5px', margin: '0 0 16px',
        }}>
          Ready to see it in action?
        </h2>
        <p style={{ color: b.textSecondary, fontSize: 15, margin: '0 0 28px' }}>
          Sign in and triage your first bug in under a minute.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: b.signal, color: b.bg, border: 'none',
            borderRadius: 8, padding: '14px 28px', fontSize: 15,
            fontWeight: 700, cursor: 'pointer',
          }}>
          Sign in to start <FiArrowRight size={16} />
        </motion.button>
      </section>

      <footer style={{
        position: 'relative', zIndex: 1, borderTop: `1px solid ${b.border}`,
        padding: '28px 24px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: b.fontMono, fontSize: 11.5, color: b.textMuted, margin: 0 }}>
          BugTracker AI · MIT License · <a href="https://github.com/vikash1311/bugtracker-ai" target="_blank" rel="noreferrer" style={{ color: b.textMuted }}>GitHub</a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
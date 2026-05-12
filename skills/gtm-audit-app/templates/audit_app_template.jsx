/* GTM Audit App — Template scaffold.
 *
 * Replace the placeholder data in the constants below (RUN, TOOLS, FINDINGS,
 * TACTICS, STRATEGIC_SHIFTS) with values from the user's audit output.
 * Everything else (helpers, views, layout, design tokens) should stay
 * unchanged unless you have a specific reason to deviate.
 *
 * The file is self-contained: imports React + lucide-react, embeds the
 * Google Fonts <link> inside the rendered tree, and exports a single
 * default component.
 */

import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, AlertCircle, AlertTriangle,
  ArrowUpRight, Download, RefreshCw, ExternalLink, Sparkles,
  Database, Mail,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
// Design tokens — DO NOT MODIFY
// ─────────────────────────────────────────────────────────────────────
const C = {
  cream: '#F1ECDF', creamSoft: '#E8E2D2', creamLine: '#D8D2C0',
  mutedOnCream: '#6E6A5C',
  ink: '#0B0B1C', inkSoft: '#161630', inkLine: '#262642',
  mutedOnInk: '#9A95B0',
  indigo: '#5B5FC7', indigoLight: '#8B8FE0', indigoDeep: '#3D40A0',
  lime: '#DCFA45', amber: '#E8B048', crimson: '#B84A56', rose: '#D86878',
};

const FONT_DISPLAY = "'Fraunces', 'Times New Roman', serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ─────────────────────────────────────────────────────────────────────
// AUDIT DATA — REPLACE WITH REAL VALUES
// ─────────────────────────────────────────────────────────────────────
const RUN = {
  client: '<Client Name>',
  startedAt: '2026-01-01T00:00:00Z',
  completedAt: '2026-01-01T00:30:00Z',
  durationMin: 30,
  toolsAudited: ['Tool A', 'Tool B'],
  categories: ['CRM', 'Sales Engagement'],
  findingsTotal: 0,
  findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
  tacticsTotal: 0,
  tacticsByEffort: { XS: 0, S: 0, M: 0, L: 0 },
};

const TOOLS = [
  // {
  //   name: 'Attio', category: 'CRM', auth: 'OK',
  //   workspace: 'Workspace name', user: 'user@example.com', role: 'Admin',
  //   icon: Database,
  //   stats: [
  //     { label: 'Companies', value: '0' },
  //     { label: 'People', value: '0' },
  //     { label: 'Deals', value: '0' },
  //     { label: 'Active users', value: '0 / 0' },
  //   ],
  //   health: 'amber',
  //   healthNote: 'One-sentence diagnosis of what is wrong.',
  // },
];

const FINDINGS = [
  // {
  //   id: 'F-001',
  //   severity: 'critical',
  //   title: 'Short, opinionated finding title',
  //   evidence: [
  //     ['Metric A', 'value'],
  //     ['Metric B', 'value'],
  //   ],
  //   implication: 'Why this matters in plain language.',
  //   action: 'What to do about it.',
  //   tools: ['Tool A'],
  // },
];

const TACTICS = [
  // {
  //   id: 'T-001', from: 'F-002', priority: 9.5, effort: 'S',
  //   title: 'Action-oriented tactic title',
  //   outcome: 'What will be true after this tactic ships.',
  //   tools: ['Tool A'],
  // },
];

const STRATEGIC_SHIFTS = [
  // {
  //   n: '01',
  //   title: 'The shift in one phrase',
  //   body: 'Main paragraph from strategy.md.',
  //   altBody: 'The alternate path or summary line.',
  // },
];

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────
const Mono = ({ children, color }) => (
  <span style={{ fontFamily: FONT_MONO, fontVariantNumeric: 'tabular-nums', color }}>{children}</span>
);

const Italic = ({ children, color }) => (
  <span style={{ fontStyle: 'italic', color }}>{children}</span>
);

const Eyebrow = ({ children, color = C.mutedOnCream }) => (
  <div style={{
    fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.22em',
    textTransform: 'uppercase', fontWeight: 500, color,
  }}>{children}</div>
);

const SeverityChip = ({ level }) => {
  const styles = {
    critical: { bg: C.crimson, fg: C.cream, label: 'Critical' },
    high:     { bg: C.amber,   fg: C.ink,   label: 'High' },
    medium:   { bg: C.creamLine, fg: C.ink, label: 'Medium' },
    low:      { bg: C.creamSoft, fg: C.mutedOnCream, label: 'Low' },
  }[level];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', background: styles.bg, color: styles.fg,
      fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.16em',
      textTransform: 'uppercase', fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, background: styles.fg, borderRadius: '50%', opacity: 0.8 }} />
      {styles.label}
    </span>
  );
};

const EffortChip = ({ effort }) => {
  const fill = { XS: 1, S: 2, M: 3, L: 4 }[effort] || 1;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{ width: 5, height: 14, background: i <= fill ? C.ink : C.creamLine }} />
        ))}
      </span>
      <Mono color={C.ink}><span style={{ fontSize: 11, fontWeight: 500 }}>{effort}</span></Mono>
    </span>
  );
};

const HealthDot = ({ level }) => {
  const color = { good: C.indigo, amber: C.amber, critical: C.crimson }[level] || C.mutedOnCream;
  return (
    <span style={{
      width: 8, height: 8, background: color, borderRadius: '50%',
      boxShadow: `0 0 0 3px ${color}25`, display: 'inline-block',
    }} />
  );
};

const buttonPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: C.ink, color: C.cream,
  fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
  padding: '10px 16px', border: 'none', cursor: 'pointer',
};
const buttonGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'transparent', color: C.ink,
  fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
  padding: '10px 16px', border: `1px solid ${C.creamLine}`, cursor: 'pointer',
};

// ─────────────────────────────────────────────────────────────────────
// Views — fill these in following the patterns in examples/anyreach_example.jsx
// ─────────────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Findings', 'Tactics', 'Strategy', 'Tools'];

function OverviewView() {
  // TODO: hero stat strip + severity bar + tools list + top-5 findings preview.
  // See references/component_catalog.md → "Hero stat strip", "Severity distribution bar".
  return <div style={{ fontFamily: FONT_BODY, color: C.mutedOnCream }}>Overview view — fill me in.</div>;
}

function FindingsView() {
  // TODO: filter row + expandable findings list. See "Findings list" in component_catalog.
  return <div style={{ fontFamily: FONT_BODY, color: C.mutedOnCream }}>Findings view — fill me in.</div>;
}

function TacticsView() {
  // TODO: effort summary + ranked tactics list. See "Tactics list" in component_catalog.
  return <div style={{ fontFamily: FONT_BODY, color: C.mutedOnCream }}>Tactics view — fill me in.</div>;
}

function StrategyView() {
  // TODO: ink hero memo + 3-shift tile grid + risks callout. See "Strategy hero memo" in component_catalog.
  return <div style={{ fontFamily: FONT_BODY, color: C.mutedOnCream }}>Strategy view — fill me in.</div>;
}

function ToolsView() {
  // TODO: one large card per tool. See "Tool cards" in component_catalog.
  return <div style={{ fontFamily: FONT_BODY, color: C.mutedOnCream }}>Tools view — fill me in.</div>;
}

// ─────────────────────────────────────────────────────────────────────
// Top-level component
// ─────────────────────────────────────────────────────────────────────
export default function GTMAuditApp() {
  const [tab, setTab] = useState('Overview');

  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: FONT_BODY, color: C.ink }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      {/* Top bar */}
      <div style={{
        background: C.ink, color: C.cream,
        padding: '14px 48px', display: 'flex', alignItems: 'center', gap: 24,
        borderBottom: `1px solid ${C.inkLine}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, background: C.lime, transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 500 }}>{RUN.client.split(' ')[0]}</span>
          <span style={{ color: C.mutedOnInk, fontSize: 12 }}>/</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mutedOnInk }}>GTM Stack Audit</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 11, color: C.mutedOnInk, fontFamily: FONT_BODY }}>
          <span><Mono>Run #001</Mono></span>
          <span style={{ width: 1, height: 12, background: C.inkLine }} />
          <span>Completed <Mono color={C.cream}>{RUN.completedAt.slice(0, 10)}</Mono></span>
          <span style={{ width: 1, height: 12, background: C.inkLine }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, background: C.lime, borderRadius: '50%' }} />
            <Mono color={C.cream}>{RUN.durationMin} min</Mono>
          </span>
        </div>
        <button style={{ ...buttonGhost, background: 'transparent', color: C.cream, border: `1px solid ${C.inkLine}` }}>
          <RefreshCw size={13} strokeWidth={1.7} />Re-run audit
        </button>
        <button style={{ ...buttonPrimary, background: C.lime, color: C.ink }}>
          <Download size={13} strokeWidth={2} />Export PDF
        </button>
      </div>

      {/* Title block */}
      <div style={{ padding: '48px 48px 36px 48px', borderBottom: `1px solid ${C.creamLine}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
          <div>
            <Eyebrow>{RUN.client} · audit window</Eyebrow>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 60, color: C.ink,
              marginTop: 12, lineHeight: 1.05, fontWeight: 400, maxWidth: 1100,
            }}>
              {/* TODO: replace with the audit's actual argument.
                  Steal a phrase from strategy.md's executive summary. */}
              The audit's <Italic>argument</Italic>, in one line.
            </div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 15, color: C.mutedOnCream,
              marginTop: 18, lineHeight: 1.6, maxWidth: 760,
            }}>
              {/* TODO: 2-3 sentence summary of what the audit found. */}
              Brief description of what the audit found, in the voice of the strategy memo.
            </div>
          </div>
          <div style={{ flexShrink: 0, paddingLeft: 32, borderLeft: `1px solid ${C.creamLine}`, paddingTop: 8 }}>
            <Eyebrow>Audit by</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500, color: C.ink, marginTop: 8 }}>
              GTM Audit Engine
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream, marginTop: 4 }}>
              <Mono>v0.7.2</Mono> · MCP-orchestrated
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: FONT_BODY, fontSize: 11, padding: '4px 9px',
                background: C.creamSoft, color: C.ink,
              }}>
                <Sparkles size={10} strokeWidth={2} />Claude
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        padding: '0 48px', background: C.cream,
        borderBottom: `1px solid ${C.creamLine}`, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: FONT_BODY, fontSize: 13, letterSpacing: '0.04em',
                fontWeight: tab === t ? 600 : 500,
                padding: '18px 22px',
                background: 'transparent',
                color: tab === t ? C.ink : C.mutedOnCream,
                border: 'none',
                borderBottom: `2px solid ${tab === t ? C.ink : 'transparent'}`,
                cursor: 'pointer', marginBottom: -1,
              }}
            >
              {t}
              {t === 'Findings' && <span style={{ marginLeft: 8 }}><Mono color={tab === t ? C.crimson : C.mutedOnCream}>{RUN.findingsTotal}</Mono></span>}
              {t === 'Tactics' && <span style={{ marginLeft: 8 }}><Mono color={tab === t ? C.indigo : C.mutedOnCream}>{RUN.tacticsTotal}</Mono></span>}
              {t === 'Tools' && <span style={{ marginLeft: 8 }}><Mono color={tab === t ? C.ink : C.mutedOnCream}>{RUN.toolsAudited.length}</Mono></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '36px 48px 80px 48px', maxWidth: 1440, margin: '0 auto' }}>
        {tab === 'Overview' && <OverviewView />}
        {tab === 'Findings' && <FindingsView />}
        {tab === 'Tactics' && <TacticsView />}
        {tab === 'Strategy' && <StrategyView />}
        {tab === 'Tools' && <ToolsView />}
      </div>

      {/* Footer */}
      <div style={{
        padding: '24px 48px', background: C.cream,
        borderTop: `1px solid ${C.creamLine}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream,
      }}>
        <div>
          {RUN.toolsAudited.length} tools · {RUN.findingsTotal} findings ·{' '}
          <Mono color={C.ink}>{RUN.durationMin}:00</Mono> elapsed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            View raw JSON <ExternalLink size={11} />
          </span>
          <span>·</span>
          <span>Documentation</span>
          <span>·</span>
          <span>Audit history</span>
        </div>
      </div>
    </div>
  );
}

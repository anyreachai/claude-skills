import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, AlertCircle, AlertTriangle, ArrowUpRight,
  Download, Share2, ExternalLink, Sparkles, Users, Target, Layers,
  GitBranch, Shield, Calendar, MessageCircle, CheckCircle2, Circle,
  XCircle, Clock,
} from 'lucide-react';

// ============================================================
// DESIGN TOKENS — copy verbatim, do not modify
// ============================================================

const C = {
  cream:        '#F1ECDF',
  creamSoft:    '#E8E2D2',
  creamLine:    '#D8D2C0',
  mutedOnCream: '#6E6A5C',
  ink:          '#0B0B1C',
  inkSoft:      '#161630',
  inkLine:      '#262642',
  mutedOnInk:   '#9A95B0',
  indigo:       '#5B5FC7',
  indigoLight:  '#8B8FE0',
  indigoDeep:   '#3D40A0',
  lime:         '#DCFA45',
  amber:        '#E8B048',
  crimson:      '#B84A56',
  rose:         '#D86878',
  sentPositive: '#7FB069',
  sentNeutral:  '#9A95B0',
  sentSkeptic:  '#E8B048',
  sentBlocker:  '#B84A56',
};

const FONT_DISPLAY = "'Fraunces', 'Times New Roman', serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ============================================================
// DISCOVERY DATA — REPLACE WITH EXTRACTED DATA FROM TRANSCRIPT
// ============================================================
// See references/data_model.md for the exact shapes expected.

const PROJECT = {
  prospect: 'REPLACE: Prospect Company Name',
  prospectShort: 'REPLACE',
  callDate: '2026-04-23',
  callType: 'Discovery Call',
  stage: 'Discovery',
  owner: 'Richard Lin',
  participants: 6,
  eyebrow: 'DISCOVERY · APR 23 2026 · 47 MIN',
  headline: 'Two systems, *one mandate*.',
  spotlightWord: 'mandate',
  frame: 'REPLACE with ~50 word project frame answering: what is the ' +
         'problem, what is the scope of our involvement, what does ' +
         'success look like, what is the urgency.',
  kpis: [
    { label: 'Deal-size signal', value: '$212K',  hint: 'signed pilot' },
    { label: 'Pilot length',     value: '12 wks', hint: 'live by Jun 1' },
    { label: 'Stakeholders',     value: '8',      hint: '3 decision-makers' },
    { label: 'Use cases',        value: '4',      hint: 'voice, IVR, FAQ, ID' },
  ],
  byline: 'Compiled from transcript + meeting notes',
};

const STAKEHOLDERS = [
  // Each: { id, name, title, role, sentiment, influence, onCall, quote, notes }
  // role: 'champion' | 'economic_buyer' | 'technical' | 'user' | 'influencer' | 'gatekeeper'
  // sentiment: 'positive' | 'neutral' | 'skeptical' | 'blocker'
  // influence: 1–5
];

const PAIN_POINTS = [
  // Each: { id, title, detail, quantified, metric, source, severity, linkedValuePropId }
];

const VALUE_PROPS = [
  // Each: { id, title, detail, proofPoint, linkedPainId }
];

const SCOPE = {
  channels: [],         // [{ name, status, volume, note }]
  languages: [],        // ['English', 'Spanish']
  integrations: [],     // [{ name, status, complexity, note }]
  useCases: [],         // [{ name, priority, status }]
  inScope: [],
  outOfScope: [],
  technicalRequirements: [], // [{ req, status, owner }]
};

const DECISION = {
  criteria: [],  // [{ criterion, weight, met }]
  process: [],   // [{ stage, owner, status, date }]
  timeline: {
    discoveryDate:    '2026-04-23',
    pilotStartTarget: '2026-06-01',
    pilotEndTarget:   '2026-08-24',
    expansionTarget:  '2026-09-15',
  },
};

const COMPETITION = [
  // Each: { name, type, positioning, threat, note }
];

const RISKS = [
  // Each: { id, title, detail, impact, likelihood, mitigation, owner, source }
];

const OPEN_QUESTIONS = [
  // Each: { question, owner }
];

const NEXT_STEPS = [
  // Each: { action, owner, due, status, priority }
];

// ============================================================
// HELPER COMPONENTS
// ============================================================

const Mono = ({ children, style }) => (
  <span style={{ fontFamily: FONT_MONO, ...style }}>{children}</span>
);

const Italic = ({ children, color, style }) => (
  <span style={{ fontStyle: 'italic', color, ...style }}>{children}</span>
);

const Eyebrow = ({ children, color = C.mutedOnCream, style }) => (
  <div style={{
    fontFamily: FONT_BODY, fontSize: 10, fontWeight: 500,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color, ...style,
  }}>
    {children}
  </div>
);

// Render headline like "Two systems, *one mandate*." with italic+lime span.
const RenderHeadline = ({ text, spotlightColor = C.lime, baseColor = C.ink }) => {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <span key={i} style={{ fontStyle: 'italic', color: spotlightColor }}>
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={i} style={{ color: baseColor }}>{part}</span>;
      })}
    </>
  );
};

const SentimentDot = ({ sentiment, size = 8 }) => {
  const colorMap = {
    positive: C.sentPositive,
    neutral:  C.sentNeutral,
    skeptical: C.sentSkeptic,
    blocker:  C.sentBlocker,
  };
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: colorMap[sentiment] || C.sentNeutral,
      verticalAlign: 'middle',
    }} />
  );
};

const SeverityChip = ({ level, label }) => {
  const styleMap = {
    high:   { bg: C.crimson, fg: C.cream },
    medium: { bg: C.amber,   fg: C.ink },
    low:    { bg: C.creamLine, fg: C.mutedOnCream },
  };
  const s = styleMap[level] || styleMap.low;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px',
      fontFamily: FONT_BODY, fontSize: 9, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      background: s.bg, color: s.fg,
    }}>
      {label || level}
    </span>
  );
};

const StatusChip = ({ status }) => {
  const styleMap = {
    committed:   { bg: C.indigo,    fg: C.cream,    label: 'COMMITTED' },
    probable:    { bg: C.indigoLight, fg: C.ink,    label: 'PROBABLE'  },
    exploratory: { bg: C.creamLine, fg: C.mutedOnCream, label: 'EXPLORATORY' },
    out:         { bg: 'transparent', fg: C.mutedOnCream, label: 'OUT-OF-SCOPE', border: `1px solid ${C.creamLine}` },
    done:        { bg: C.sentPositive, fg: C.ink,   label: 'DONE'      },
    in_progress: { bg: C.amber,     fg: C.ink,      label: 'IN PROGRESS' },
    pending:     { bg: C.creamLine, fg: C.mutedOnCream, label: 'PENDING' },
    future:      { bg: 'transparent', fg: C.mutedOnCream, label: 'FUTURE', border: `1px solid ${C.creamLine}` },
    blocked:     { bg: C.crimson,   fg: C.cream,    label: 'BLOCKED'   },
    open:        { bg: C.creamLine, fg: C.mutedOnCream, label: 'OPEN'  },
    confirmed:   { bg: C.sentPositive, fg: C.ink,   label: 'CONFIRMED' },
    unknown:     { bg: 'transparent', fg: C.mutedOnCream, label: 'UNKNOWN', border: `1px dashed ${C.creamLine}` },
    yes:         { bg: C.sentPositive, fg: C.ink,   label: 'YES'       },
    no:          { bg: C.crimson,   fg: C.cream,    label: 'NO'        },
    partial:     { bg: C.amber,     fg: C.ink,      label: 'PARTIAL'   },
  };
  const s = styleMap[status] || styleMap.unknown;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px',
      fontFamily: FONT_BODY, fontSize: 9, fontWeight: 600,
      letterSpacing: '0.12em',
      background: s.bg, color: s.fg, border: s.border,
    }}>
      {s.label}
    </span>
  );
};

const InfluenceBar = ({ value, max = 5 }) => (
  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    {[...Array(max)].map((_, i) => (
      <span key={i} style={{
        width: 14, height: 4,
        background: i < value ? C.indigo : C.creamLine,
      }} />
    ))}
  </div>
);

// ============================================================
// VIEW COMPONENTS
// ============================================================

// ---------- OVERVIEW ----------

const OverviewView = ({ onNavigate }) => {
  const topPain = [...PAIN_POINTS].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.severity] ?? 9) - (order[b.severity] ?? 9);
  })[0];
  const topValue = VALUE_PROPS[0];
  const topRisk = [...RISKS].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.impact] ?? 9) - (order[b.impact] ?? 9);
  })[0];

  return (
    <div style={{ padding: '32px 48px', background: C.cream }}>
      {/* Frame block */}
      <div style={{ maxWidth: 800, marginBottom: 36 }}>
        <Eyebrow style={{ marginBottom: 12 }}>The project</Eyebrow>
        <p style={{
          fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400,
          lineHeight: 1.4, color: C.ink, margin: 0,
        }}>
          {PROJECT.frame}
        </p>
      </div>

      {/* What we heard — 3 columns */}
      <Eyebrow style={{ marginBottom: 14 }}>What we heard</Eyebrow>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 16, marginBottom: 40,
      }}>
        <PreviewCard
          tagLabel="TOP PAIN"
          tagColor={C.crimson}
          title={topPain?.title || '(no pain identified yet)'}
          body={topPain?.metric || topPain?.detail?.slice(0, 100)}
          ctaLabel="See pain map"
          onClick={() => onNavigate('pain')}
        />
        <PreviewCard
          tagLabel="TOP VALUE"
          tagColor={C.indigo}
          title={topValue?.title || '(no value prop mapped)'}
          body={topValue?.proofPoint || topValue?.detail?.slice(0, 100)}
          ctaLabel="See value map"
          onClick={() => onNavigate('pain')}
        />
        <PreviewCard
          tagLabel="TOP RISK"
          tagColor={C.amber}
          title={topRisk?.title || '(no risks logged)'}
          body={topRisk?.mitigation?.slice(0, 100)}
          ctaLabel="See risk map"
          onClick={() => onNavigate('risks')}
        />
      </div>

      {/* Use case chip grid */}
      <Eyebrow style={{ marginBottom: 14 }}>Use cases in scope</Eyebrow>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40,
      }}>
        {SCOPE.useCases?.map((uc, i) => (
          <div key={i} style={{
            padding: '10px 14px', background: C.creamSoft,
            border: `1px solid ${C.creamLine}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Mono style={{ fontSize: 11, color: C.mutedOnCream }}>
              {String(uc.priority).padStart(2, '0')}
            </Mono>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 13, color: C.ink,
            }}>
              {uc.name}
            </span>
            <StatusChip status={uc.status} />
          </div>
        ))}
      </div>

      {/* Mini timeline */}
      <Eyebrow style={{ marginBottom: 14 }}>Timeline</Eyebrow>
      <TimelineBar timeline={DECISION.timeline} />

      {/* Top 3 next steps */}
      <div style={{ marginTop: 40 }}>
        <Eyebrow style={{ marginBottom: 14 }}>Top next steps</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...NEXT_STEPS]
            .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
            .slice(0, 3)
            .map((step, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 120px 100px 100px',
                gap: 16, padding: '14px 0',
                borderBottom: `1px solid ${C.creamLine}`,
                alignItems: 'center',
              }}>
                <Mono style={{ fontSize: 11, color: C.mutedOnCream }}>
                  {String(step.priority).padStart(2, '0')}
                </Mono>
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink }}>
                  {step.action}
                </span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream }}>
                  {step.owner}
                </span>
                <Mono style={{ fontSize: 11, color: C.mutedOnCream }}>
                  {step.due}
                </Mono>
                <StatusChip status={step.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const PreviewCard = ({ tagLabel, tagColor, title, body, ctaLabel, onClick }) => (
  <div style={{
    background: C.creamSoft, border: `1px solid ${C.creamLine}`,
    padding: 20, display: 'flex', flexDirection: 'column',
    minHeight: 180,
  }}>
    <Eyebrow color={tagColor} style={{ marginBottom: 12 }}>{tagLabel}</Eyebrow>
    <div style={{
      fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500,
      lineHeight: 1.25, color: C.ink, marginBottom: 10,
    }}>
      {title}
    </div>
    <div style={{
      fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.5,
      color: C.mutedOnCream, marginBottom: 16, flexGrow: 1,
    }}>
      {body}
    </div>
    <button onClick={onClick} style={{
      alignSelf: 'flex-start', background: 'transparent',
      border: 'none', cursor: 'pointer', padding: 0,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: C.indigo,
    }}>
      {ctaLabel} <ArrowUpRight size={12} />
    </button>
  </div>
);

const TimelineBar = ({ timeline }) => {
  const milestones = [
    { label: 'Discovery',    date: timeline.discoveryDate,    pct: 0 },
    { label: 'Pilot start',  date: timeline.pilotStartTarget, pct: 25 },
    { label: 'Pilot end',    date: timeline.pilotEndTarget,   pct: 75 },
    { label: 'Expansion',    date: timeline.expansionTarget,  pct: 100 },
  ];
  return (
    <div style={{ position: 'relative', height: 80 }}>
      <div style={{
        position: 'absolute', top: 24, left: 0, right: 0, height: 2,
        background: C.creamLine,
      }} />
      <div style={{
        position: 'absolute', top: 24, left: 0, width: '25%', height: 2,
        background: C.indigo,
      }} />
      {milestones.map((m, i) => (
        <div key={i} style={{
          position: 'absolute', top: 0, left: `${m.pct}%`,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 6,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i === 0 ? C.indigo : C.cream,
            border: `2px solid ${i === 0 ? C.indigo : C.creamLine}`,
            marginTop: 19,
          }} />
          <Mono style={{ fontSize: 10, color: C.mutedOnCream, marginTop: 4 }}>
            {m.date}
          </Mono>
          <span style={{
            fontFamily: FONT_BODY, fontSize: 11, color: C.ink,
            fontWeight: 500,
          }}>
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- STAKEHOLDERS ----------

const StakeholdersView = () => {
  const onCall = STAKEHOLDERS.filter(s => s.onCall).length;
  return (
    <div style={{ padding: '32px 48px', background: C.cream }}>
      <div style={{
        display: 'flex', gap: 32, marginBottom: 36,
        alignItems: 'flex-end',
      }}>
        <div>
          <Eyebrow style={{ marginBottom: 8 }}>Stakeholder map</Eyebrow>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 500,
            color: C.ink, lineHeight: 1,
          }}>
            <Mono style={{ fontSize: 36 }}>{STAKEHOLDERS.length}</Mono> people
            <span style={{ color: C.mutedOnCream, fontStyle: 'italic' }}>
              {' '}in the deal
            </span>
          </div>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream,
            marginTop: 6,
          }}>
            <Mono>{onCall}</Mono> on the discovery call ·{' '}
            <Mono>{STAKEHOLDERS.length - onCall}</Mono> referenced
          </div>
        </div>
        <SentimentLegend />
      </div>

      {/* Influence × Sentiment grid */}
      <Eyebrow style={{ marginBottom: 14 }}>Influence × Sentiment</Eyebrow>
      <InfluenceSentimentGrid stakeholders={STAKEHOLDERS} />

      {/* Stakeholder cards */}
      <Eyebrow style={{ marginTop: 40, marginBottom: 14 }}>The people</Eyebrow>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        {[...STAKEHOLDERS]
          .sort((a, b) => b.influence - a.influence)
          .map((s) => (
            <StakeholderCard key={s.id} stakeholder={s} />
          ))}
      </div>
    </div>
  );
};

const SentimentLegend = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    {[
      { label: 'Positive', s: 'positive' },
      { label: 'Neutral',  s: 'neutral'  },
      { label: 'Skeptical', s: 'skeptical' },
      { label: 'Blocker',  s: 'blocker'  },
    ].map((item, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <SentimentDot sentiment={item.s} />
        <span style={{
          fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream,
        }}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

const InfluenceSentimentGrid = ({ stakeholders }) => {
  // X axis = sentiment (positive → blocker)
  // Y axis = influence (1 → 5, higher = top)
  const xMap = { positive: 12, neutral: 38, skeptical: 64, blocker: 88 };
  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 600, height: 260,
      background: C.creamSoft, border: `1px solid ${C.creamLine}`,
    }}>
      {/* Y axis label */}
      <div style={{
        position: 'absolute', left: -8, top: '50%',
        transform: 'rotate(-90deg) translateX(50%)',
        transformOrigin: 'left center',
      }}>
        <Eyebrow>Influence →</Eyebrow>
      </div>
      {/* X axis label */}
      <div style={{
        position: 'absolute', bottom: -20, left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <Eyebrow>← Skeptical · Positive →</Eyebrow>
      </div>
      {/* Quadrant divider lines */}
      <div style={{
        position: 'absolute', left: '50%', top: 0, bottom: 0,
        width: 1, background: C.creamLine,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1, background: C.creamLine,
      }} />
      {/* Dots */}
      {stakeholders.map((s) => {
        const xPct = xMap[s.sentiment] ?? 50;
        const yPct = 95 - (s.influence / 5) * 90;
        return (
          <div key={s.id} title={`${s.name} (${s.title})`} style={{
            position: 'absolute', left: `${xPct}%`, top: `${yPct}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: s.sentiment === 'positive' ? C.sentPositive :
                          s.sentiment === 'blocker' ? C.sentBlocker :
                          s.sentiment === 'skeptical' ? C.sentSkeptic :
                          C.sentNeutral,
              border: `2px solid ${C.cream}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
              color: C.ink,
            }}>
              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StakeholderCard = ({ stakeholder: s }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: C.creamSoft, border: `1px solid ${C.creamLine}`,
      padding: 20,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: C.indigo, color: C.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
          flexShrink: 0,
        }}>
          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500,
            color: C.ink, lineHeight: 1.2,
          }}>
            {s.name}
          </div>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream,
            marginTop: 2,
          }}>
            {s.title}
          </div>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center', marginTop: 10,
          }}>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '2px 7px', background: C.indigoLight, color: C.ink,
            }}>
              {s.role.replace(/_/g, ' ')}
            </span>
            <SentimentDot sentiment={s.sentiment} />
            <InfluenceBar value={s.influence} />
            {!s.onCall && (
              <span style={{
                fontFamily: FONT_BODY, fontSize: 10,
                color: C.mutedOnCream, fontStyle: 'italic',
              }}>
                not on call
              </span>
            )}
          </div>
        </div>
      </div>

      {s.quote && (
        <blockquote style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 14,
          lineHeight: 1.4, color: C.ink, margin: '16px 0 0',
          paddingLeft: 14, borderLeft: `2px solid ${C.creamLine}`,
        }}>
          "{s.quote}"
        </blockquote>
      )}

      {s.notes && (
        <>
          <button onClick={() => setExpanded(!expanded)} style={{
            marginTop: 12, background: 'transparent', border: 'none',
            padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.indigo,
          }}>
            {expanded ? 'Hide notes' : 'Show notes'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {expanded && (
            <div style={{
              fontFamily: FONT_BODY, fontSize: 12, lineHeight: 1.5,
              color: C.mutedOnCream, marginTop: 10,
              paddingTop: 10, borderTop: `1px solid ${C.creamLine}`,
            }}>
              {s.notes}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ---------- PAIN & VALUE ----------

const PainValueView = () => {
  return (
    <div style={{ padding: '32px 48px', background: C.ink, color: C.cream }}>
      <div style={{ marginBottom: 36 }}>
        <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 12 }}>
          Pain → Value map
        </Eyebrow>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 500,
          color: C.cream, lineHeight: 1.2, maxWidth: 700,
        }}>
          What they're feeling.{' '}
          <Italic color={C.lime}>What we answer with.</Italic>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        border: `1px solid ${C.inkLine}`,
      }}>
        {/* Column headers */}
        <div style={{
          padding: '14px 20px', borderRight: `1px solid ${C.inkLine}`,
          borderBottom: `1px solid ${C.inkLine}`, background: C.inkSoft,
        }}>
          <Eyebrow color={C.mutedOnInk}>Pain Point</Eyebrow>
        </div>
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${C.inkLine}`, background: C.inkSoft,
        }}>
          <Eyebrow color={C.indigoLight}>Anyreach Answer</Eyebrow>
        </div>

        {/* Rows */}
        {PAIN_POINTS.map((pain, i) => {
          const value = VALUE_PROPS.find(v => v.id === pain.linkedValuePropId);
          return <PainValueRow key={pain.id} pain={pain} value={value} />;
        })}
      </div>

      {/* Quantified pain strip */}
      {PAIN_POINTS.some(p => p.quantified) && (
        <div style={{ marginTop: 40 }}>
          <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 14 }}>
            Quantified pain
          </Eyebrow>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(PAIN_POINTS.filter(p => p.quantified).length, 4)}, 1fr)`,
            gap: 1, background: C.inkLine,
          }}>
            {PAIN_POINTS.filter(p => p.quantified).map((p) => (
              <div key={p.id} style={{
                background: C.inkSoft, padding: 20,
              }}>
                <Mono style={{
                  fontSize: 24, fontWeight: 500, color: C.lime,
                  display: 'block', marginBottom: 6,
                }}>
                  {p.metric?.split('·')[0]?.trim()}
                </Mono>
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk,
                  lineHeight: 1.4,
                }}>
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PainValueRow = ({ pain, value }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div style={{
        padding: 20, borderRight: `1px solid ${C.inkLine}`,
        borderBottom: `1px solid ${C.inkLine}`,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <SeverityChip level={pain.severity} />
          {pain.quantified && (
            <span style={{
              fontFamily: FONT_BODY, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.lime,
            }}>
              quantified
            </span>
          )}
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500,
          color: C.cream, marginTop: 10, lineHeight: 1.3,
        }}>
          {pain.title}
        </div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk,
          marginTop: 8, lineHeight: 1.5,
        }}>
          {pain.detail}
        </div>
        {pain.metric && (
          <Mono style={{
            display: 'block', fontSize: 14, color: C.lime, marginTop: 10,
          }}>
            {pain.metric}
          </Mono>
        )}
        {pain.source && (
          <div style={{
            fontFamily: FONT_BODY, fontSize: 10, color: C.mutedOnInk,
            marginTop: 10, fontStyle: 'italic',
          }}>
            {pain.source}
          </div>
        )}
      </div>
      <div style={{
        padding: 20, borderBottom: `1px solid ${C.inkLine}`,
        background: value ? 'transparent' : C.inkSoft,
      }}>
        {value ? (
          <>
            <Eyebrow color={C.indigoLight}>{value.id?.toUpperCase()}</Eyebrow>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500,
              color: C.cream, marginTop: 10, lineHeight: 1.3,
            }}>
              {value.title}
            </div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk,
              marginTop: 8, lineHeight: 1.5,
            }}>
              {value.detail}
            </div>
            {value.proofPoint && (
              <div style={{
                fontFamily: FONT_BODY, fontSize: 11, color: C.indigoLight,
                marginTop: 10, paddingTop: 10,
                borderTop: `1px solid ${C.inkLine}`,
              }}>
                <Sparkles size={11} style={{
                  display: 'inline', verticalAlign: 'middle', marginRight: 4,
                }} />
                {value.proofPoint}
              </div>
            )}
          </>
        ) : (
          <div style={{
            fontFamily: FONT_BODY, fontStyle: 'italic',
            fontSize: 13, color: C.mutedOnInk,
            display: 'flex', alignItems: 'center', gap: 8,
            height: '100%',
          }}>
            <AlertCircle size={14} color={C.amber} />
            No answer mapped yet — flag for next-call prep
          </div>
        )}
      </div>
    </>
  );
};

// ---------- SCOPE ----------

const ScopeView = () => {
  return (
    <div style={{ padding: '32px 48px', background: C.cream }}>
      <div style={{ marginBottom: 36 }}>
        <Eyebrow style={{ marginBottom: 12 }}>Scope of the work</Eyebrow>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 500,
          color: C.ink, lineHeight: 1.2, maxWidth: 700,
        }}>
          What we{"'"}re doing.{' '}
          <Italic>What we{"'"}re not.</Italic>
        </div>
      </div>

      {/* Channels */}
      <Eyebrow style={{ marginBottom: 14 }}>Channels</Eyebrow>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 1, background: C.creamLine, marginBottom: 40,
      }}>
        {SCOPE.channels?.map((ch, i) => (
          <div key={i} style={{
            background: C.creamSoft, padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500,
                color: C.ink,
              }}>
                {ch.name}
              </span>
              <StatusChip status={ch.status} />
            </div>
            {ch.volume && ch.volume !== '—' && (
              <Mono style={{
                fontSize: 13, color: C.indigo, marginTop: 8,
                display: 'block',
              }}>
                {ch.volume}
              </Mono>
            )}
            {ch.note && (
              <div style={{
                fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream,
                marginTop: 6,
              }}>
                {ch.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Languages + use cases */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32,
        marginBottom: 40,
      }}>
        <div>
          <Eyebrow style={{ marginBottom: 14 }}>Languages</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SCOPE.languages?.map((lang, i) => (
              <span key={i} style={{
                padding: '6px 12px', background: C.creamSoft,
                border: `1px solid ${C.creamLine}`,
                fontFamily: FONT_BODY, fontSize: 13, color: C.ink,
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Eyebrow style={{ marginBottom: 14 }}>Use cases ranked</Eyebrow>
          <div>
            {SCOPE.useCases?.map((uc, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 120px',
                gap: 12, padding: '10px 0',
                borderBottom: i < SCOPE.useCases.length - 1
                  ? `1px solid ${C.creamLine}` : 'none',
                alignItems: 'center',
              }}>
                <Mono style={{ fontSize: 11, color: C.mutedOnCream }}>
                  {String(uc.priority).padStart(2, '0')}
                </Mono>
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink }}>
                  {uc.name}
                </span>
                <StatusChip status={uc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <Eyebrow style={{ marginBottom: 14 }}>Integrations required</Eyebrow>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        background: C.creamLine, marginBottom: 40,
      }}>
        {SCOPE.integrations?.map((int, i) => (
          <div key={i} style={{
            background: C.creamSoft, padding: '14px 18px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr',
            gap: 16, alignItems: 'center',
          }}>
            <span style={{
              fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 500,
              color: C.ink,
            }}>
              {int.name}
            </span>
            <StatusChip status={int.status} />
            <SeverityChip
              level={int.complexity === 'high' ? 'high' :
                     int.complexity === 'medium' ? 'medium' : 'low'}
              label={`${int.complexity} complexity`}
            />
            <span style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream,
            }}>
              {int.note}
            </span>
          </div>
        ))}
      </div>

      {/* In-scope / out-of-scope */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
        marginBottom: 40,
      }}>
        <div>
          <Eyebrow color={C.indigo} style={{ marginBottom: 14 }}>In scope</Eyebrow>
          <ul style={{
            margin: 0, padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 1,
          }}>
            {SCOPE.inScope?.map((item, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: i < SCOPE.inScope.length - 1
                  ? `1px solid ${C.creamLine}` : 'none',
                fontFamily: FONT_BODY, fontSize: 13, color: C.ink,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <CheckCircle2 size={14} color={C.indigo} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow color={C.mutedOnCream} style={{ marginBottom: 14 }}>Out of scope</Eyebrow>
          <ul style={{
            margin: 0, padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 1,
          }}>
            {SCOPE.outOfScope?.map((item, i) => (
              <li key={i} style={{
                padding: '10px 0',
                borderBottom: i < SCOPE.outOfScope.length - 1
                  ? `1px solid ${C.creamLine}` : 'none',
                fontFamily: FONT_BODY, fontSize: 13,
                color: C.mutedOnCream, textDecoration: 'line-through',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <XCircle size={14} color={C.mutedOnCream} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical requirements */}
      <Eyebrow style={{ marginBottom: 14 }}>Technical requirements</Eyebrow>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        background: C.creamLine,
      }}>
        {SCOPE.technicalRequirements?.map((tr, i) => (
          <div key={i} style={{
            background: C.creamSoft, padding: '12px 18px',
            display: 'grid', gridTemplateColumns: '3fr 1fr 1fr',
            gap: 16, alignItems: 'center',
          }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink }}>
              {tr.req}
            </span>
            <StatusChip status={tr.status} />
            <span style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream,
            }}>
              {tr.owner}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- DECISION ----------

const DecisionView = () => {
  return (
    <div style={{ padding: '32px 48px', background: C.cream }}>
      <div style={{ marginBottom: 36 }}>
        <Eyebrow style={{ marginBottom: 12 }}>How they decide</Eyebrow>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 500,
          color: C.ink, lineHeight: 1.2, maxWidth: 700,
        }}>
          Criteria, process, competition.{' '}
          <Italic>One path through.</Italic>
        </div>
      </div>

      {/* Criteria */}
      <Eyebrow style={{ marginBottom: 14 }}>Decision criteria</Eyebrow>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        background: C.creamLine, marginBottom: 40,
      }}>
        {DECISION.criteria?.map((cr, i) => (
          <div key={i} style={{
            background: C.creamSoft, padding: '12px 18px',
            display: 'grid', gridTemplateColumns: '3fr 1fr 1fr',
            gap: 16, alignItems: 'center',
          }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink }}>
              {cr.criterion}
            </span>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: cr.weight === 'must-have' ? C.crimson : C.mutedOnCream,
            }}>
              {cr.weight}
            </span>
            <StatusChip status={cr.met} />
          </div>
        ))}
      </div>

      {/* Process */}
      <Eyebrow style={{ marginBottom: 14 }}>Process map</Eyebrow>
      <div style={{ marginBottom: 40 }}>
        {DECISION.process?.map((p, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 180px 110px 100px',
            gap: 16, padding: '14px 0',
            borderBottom: `1px solid ${C.creamLine}`,
            alignItems: 'center',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: p.status === 'done' ? C.sentPositive :
                         p.status === 'in_progress' ? C.amber :
                         p.status === 'blocked' ? C.crimson : C.cream,
              border: `2px solid ${
                p.status === 'done' ? C.sentPositive :
                p.status === 'in_progress' ? C.amber :
                p.status === 'blocked' ? C.crimson : C.creamLine}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {p.status === 'done' && (
                <CheckCircle2 size={10} color={C.cream} />
              )}
            </div>
            <span style={{
              fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 500,
              color: C.ink,
            }}>
              {p.stage}
            </span>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream,
            }}>
              {p.owner}
            </span>
            <Mono style={{ fontSize: 11, color: C.mutedOnCream }}>
              {p.date}
            </Mono>
            <StatusChip status={p.status} />
          </div>
        ))}
      </div>

      {/* Competition */}
      <Eyebrow style={{ marginBottom: 14 }}>Competition</Eyebrow>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 1, background: C.creamLine, marginBottom: 40,
      }}>
        {COMPETITION.map((c, i) => (
          <div key={i} style={{
            background: C.creamSoft, padding: 18,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: 8,
            }}>
              <span style={{
                fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 500,
                color: C.ink,
              }}>
                {c.name}
              </span>
              <SeverityChip
                level={c.threat === 'high' ? 'high' :
                       c.threat === 'medium' ? 'medium' : 'low'}
                label={`${c.threat} threat`}
              />
            </div>
            <Eyebrow style={{ marginBottom: 8 }}>{c.type?.replace(/_/g, ' ')}</Eyebrow>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 12, color: C.ink,
              lineHeight: 1.5,
            }}>
              {c.positioning}
            </div>
            {c.note && (
              <div style={{
                fontFamily: FONT_BODY, fontSize: 11,
                fontStyle: 'italic', color: C.mutedOnCream, marginTop: 10,
                paddingTop: 10, borderTop: `1px solid ${C.creamLine}`,
              }}>
                {c.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- RISKS & NEXT STEPS ----------

const RisksNextView = () => {
  return (
    <div style={{ padding: '32px 48px', background: C.ink, color: C.cream }}>
      <div style={{ marginBottom: 36 }}>
        <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 12 }}>
          Risks · open questions · next moves
        </Eyebrow>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 500,
          color: C.cream, lineHeight: 1.2, maxWidth: 700,
        }}>
          What could kill it.{' '}
          <Italic color={C.lime}>What unlocks it.</Italic>
        </div>
      </div>

      {/* Risk heatmap */}
      <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 14 }}>Risk heatmap</Eyebrow>
      <div style={{
        display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32,
        marginBottom: 40,
      }}>
        <RiskHeatmap risks={RISKS} />
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[...RISKS]
            .sort((a, b) => {
              const order = { high: 0, medium: 1, low: 2 };
              return (order[a.impact] ?? 9) - (order[b.impact] ?? 9);
            })
            .map((r) => <RiskCard key={r.id} risk={r} />)}
        </div>
      </div>

      {/* Open questions */}
      <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 14 }}>Open questions</Eyebrow>
      <div style={{
        background: C.inkSoft, border: `1px solid ${C.inkLine}`,
        padding: 24, marginBottom: 40,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          {OPEN_QUESTIONS.map((q, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 200px',
              gap: 16, padding: '12px 0',
              borderBottom: i < OPEN_QUESTIONS.length - 1
                ? `1px solid ${C.inkLine}` : 'none',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                fontSize: 15, color: C.cream,
              }}>
                {q.question}
              </span>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnInk,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                ask: {q.owner}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 14 }}>Next steps</Eyebrow>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        background: C.inkLine, marginBottom: 32,
      }}>
        {[...NEXT_STEPS]
          .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
          .map((step, i) => (
            <div key={i} style={{
              background: C.inkSoft, padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '32px 1fr 140px 110px 100px',
              gap: 16, alignItems: 'center',
            }}>
              <Mono style={{ fontSize: 11, color: C.mutedOnInk }}>
                {String(step.priority).padStart(2, '0')}
              </Mono>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 13, color: C.cream,
              }}>
                {step.action}
              </span>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk,
              }}>
                {step.owner}
              </span>
              <Mono style={{ fontSize: 11, color: C.mutedOnInk }}>
                {step.due}
              </Mono>
              <StatusChip status={step.status} />
            </div>
          ))}
      </div>

      {/* Spotlight callout */}
      <div style={{
        background: C.inkSoft, border: `1px solid ${C.lime}`,
        padding: 28, display: 'flex', gap: 24, alignItems: 'center',
      }}>
        <Sparkles size={28} color={C.lime} />
        <div>
          <Eyebrow color={C.lime} style={{ marginBottom: 8 }}>
            The unlock
          </Eyebrow>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 500,
            color: C.cream, lineHeight: 1.3,
          }}>
            Send the SOC 2 package to Marcus by <Italic color={C.lime}>Friday</Italic>{' '}
            — every other gate clears behind it.
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskHeatmap = ({ risks }) => {
  // 3x3 grid: rows = impact (high top, low bottom), cols = likelihood (low left, high right)
  const matrix = [
    ['high-low', 'high-medium', 'high-high'],
    ['medium-low', 'medium-medium', 'medium-high'],
    ['low-low', 'low-medium', 'low-high'],
  ];
  const cellColor = (cell) => {
    const [impact, likelihood] = cell.split('-');
    if (impact === 'high' && likelihood === 'high') return C.crimson;
    if ((impact === 'high' && likelihood === 'medium') ||
        (impact === 'medium' && likelihood === 'high')) return C.crimson;
    if (impact === 'low' && likelihood === 'low') return C.inkSoft;
    if (impact === 'low' || likelihood === 'low') return C.inkSoft;
    return C.amber;
  };
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 4, marginBottom: 8,
      }}>
        {matrix.flat().map((cell, i) => {
          const [impact, likelihood] = cell.split('-');
          const cellRisks = risks.filter(r =>
            r.impact === impact && r.likelihood === likelihood);
          return (
            <div key={i} style={{
              aspectRatio: '1', background: cellColor(cell),
              border: `1px solid ${C.inkLine}`,
              padding: 8, position: 'relative',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              {cellRisks.length > 0 ? (
                <>
                  <Mono style={{
                    fontSize: 20, color: cellColor(cell) === C.inkSoft ? C.mutedOnInk : C.cream,
                  }}>
                    {cellRisks.length}
                  </Mono>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 9, lineHeight: 1.2,
                    color: cellColor(cell) === C.inkSoft ? C.mutedOnInk : C.cream,
                  }}>
                    {cellRisks.map(r => r.id?.toUpperCase()).join(', ')}
                  </div>
                </>
              ) : (
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 11, color: C.mutedOnInk,
                  opacity: 0.4,
                }}>
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8,
      }}>
        <Eyebrow color={C.mutedOnInk}>← Low likelihood</Eyebrow>
        <Eyebrow color={C.mutedOnInk}>High likelihood →</Eyebrow>
      </div>
    </div>
  );
};

const RiskCard = ({ risk }) => {
  return (
    <div style={{
      background: C.inkSoft, border: `1px solid ${C.inkLine}`,
      padding: 18,
    }}>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10,
      }}>
        <Mono style={{ fontSize: 11, color: C.mutedOnInk }}>
          {risk.id?.toUpperCase()}
        </Mono>
        <SeverityChip level={risk.impact} label={`${risk.impact} impact`} />
        <SeverityChip level={risk.likelihood} label={`${risk.likelihood} likelihood`} />
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 500,
        color: C.cream, lineHeight: 1.3, marginBottom: 8,
      }}>
        {risk.title}
      </div>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk,
        lineHeight: 1.5, marginBottom: 12,
      }}>
        {risk.detail}
      </div>
      <div style={{
        background: C.ink, padding: '10px 12px',
        border: `1px solid ${C.inkLine}`,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Shield size={14} color={C.indigoLight} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <Eyebrow color={C.indigoLight} style={{ marginBottom: 4 }}>
            Mitigation · {risk.owner}
          </Eyebrow>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 12, color: C.cream,
            lineHeight: 1.5,
          }}>
            {risk.mitigation}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TOP-LEVEL DASHBOARD
// ============================================================

const DiscoveryDashboard = () => {
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview',     label: 'Overview',         icon: Layers },
    { id: 'stakeholders', label: 'Stakeholders',     icon: Users,         count: STAKEHOLDERS.length },
    { id: 'pain',         label: 'Pain & Value',     icon: Target,        count: PAIN_POINTS.length },
    { id: 'scope',        label: 'Scope',            icon: GitBranch },
    { id: 'decision',     label: 'Decision',         icon: CheckCircle2 },
    { id: 'risks',        label: 'Risks & Next',     icon: AlertTriangle, count: RISKS.length },
  ];

  return (
    <div style={{
      fontFamily: FONT_BODY, background: C.cream, minHeight: '100vh',
      color: C.ink,
    }}>
      <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      {/* TOP BAR */}
      <div style={{
        background: C.ink, color: C.cream, padding: '14px 48px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: `1px solid ${C.inkLine}`,
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600,
            letterSpacing: '0.04em',
          }}>
            anyreach<span style={{ color: C.lime }}>.</span>
          </div>
          <div style={{
            height: 14, width: 1, background: C.inkLine,
          }} />
          <Eyebrow color={C.mutedOnInk}>
            {PROJECT.prospectShort || PROJECT.prospect} · {PROJECT.callType}
          </Eyebrow>
          <Mono style={{ fontSize: 11, color: C.mutedOnInk }}>
            {PROJECT.callDate}
          </Mono>
          <span style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '2px 8px', background: C.indigo, color: C.cream,
          }}>
            stage: {PROJECT.stage}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={topBtnStyle}>
            <Download size={12} /> Export
          </button>
          <button style={topBtnStyle}>
            <Share2 size={12} /> Share
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        padding: '56px 48px 36px', background: C.cream,
        borderBottom: `1px solid ${C.creamLine}`,
      }}>
        <Eyebrow style={{ marginBottom: 18 }}>{PROJECT.eyebrow}</Eyebrow>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontSize: 60, fontWeight: 500,
          lineHeight: 1.05, color: C.ink, margin: 0,
          letterSpacing: '-0.01em', maxWidth: 1000,
        }}>
          <RenderHeadline text={PROJECT.headline} />
        </h1>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream,
          marginTop: 24, letterSpacing: '0.04em',
        }}>
          {PROJECT.byline}
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{
        background: C.ink, padding: '24px 48px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, borderBottom: `1px solid ${C.inkLine}`,
      }}>
        {PROJECT.kpis?.map((kpi, i) => (
          <div key={i} style={{
            padding: '8px 24px',
            borderLeft: i > 0 ? `1px solid ${C.inkLine}` : 'none',
          }}>
            <Eyebrow color={C.mutedOnInk} style={{ marginBottom: 8 }}>
              {kpi.label}
            </Eyebrow>
            <Mono style={{
              fontSize: 36, fontWeight: 500,
              color: i === 0 ? C.lime : C.cream, lineHeight: 1,
              display: 'block', marginBottom: 6,
            }}>
              {kpi.value}
            </Mono>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnInk,
              fontStyle: 'italic',
            }}>
              {kpi.hint}
            </div>
          </div>
        ))}
      </div>

      {/* TAB NAV */}
      <div style={{
        background: C.cream, padding: '0 48px',
        borderBottom: `1px solid ${C.creamLine}`,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: 'transparent', border: 'none', padding: '16px 18px',
              cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center',
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: tab === id ? C.ink : C.mutedOnCream,
              borderBottom: `2px solid ${tab === id ? C.indigo : 'transparent'}`,
              marginBottom: -1,
            }}>
              <Icon size={14} />
              {label}
              {count !== undefined && (
                <Mono style={{
                  fontSize: 11, color: C.mutedOnCream,
                  background: C.creamSoft, padding: '1px 6px',
                }}>
                  {count}
                </Mono>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div>
        {tab === 'overview' && <OverviewView onNavigate={setTab} />}
        {tab === 'stakeholders' && <StakeholdersView />}
        {tab === 'pain' && <PainValueView />}
        {tab === 'scope' && <ScopeView />}
        {tab === 'decision' && <DecisionView />}
        {tab === 'risks' && <RisksNextView />}
      </div>

      {/* FOOTER */}
      <div style={{
        background: C.ink, color: C.mutedOnInk, padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Eyebrow color={C.mutedOnInk}>
          discovery dashboard · {PROJECT.prospect} · owner: {PROJECT.owner}
        </Eyebrow>
        <Mono style={{ fontSize: 10, color: C.mutedOnInk }}>
          anyreach.ai · confidential
        </Mono>
      </div>
    </div>
  );
};

const topBtnStyle = {
  background: 'transparent', border: `1px solid ${C.inkLine}`,
  color: C.cream, padding: '6px 12px', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
  fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
  letterSpacing: '0.08em', textTransform: 'uppercase',
};

export default DiscoveryDashboard;

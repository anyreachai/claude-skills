import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, Info, ArrowUpRight, Download, RefreshCw, ExternalLink, Sparkles, Database, Mail } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
// Anyreach editorial design tokens — matched to the deck system
// ─────────────────────────────────────────────────────────────────────
const C = {
  cream: '#F1ECDF',
  creamSoft: '#E8E2D2',
  creamLine: '#D8D2C0',
  mutedOnCream: '#6E6A5C',
  ink: '#0B0B1C',
  inkSoft: '#161630',
  inkLine: '#262642',
  mutedOnInk: '#9A95B0',
  indigo: '#5B5FC7',
  indigoLight: '#8B8FE0',
  indigoDeep: '#3D40A0',
  lime: '#DCFA45',
  amber: '#E8B048',
  crimson: '#B84A56',
  rose: '#D86878',
};

const FONT_DISPLAY = "'Fraunces', 'Times New Roman', serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

// ─────────────────────────────────────────────────────────────────────
// Audit data (extracted from the run output)
// ─────────────────────────────────────────────────────────────────────
const RUN = {
  client: 'Anyreach Inc',
  startedAt: '2026-05-09T00:00:00Z',
  completedAt: '2026-05-09T00:30:00Z',
  durationMin: 30,
  toolsAudited: ['Attio', 'Apollo'],
  categories: ['CRM', 'Sales Engagement'],
  findingsTotal: 12,
  findingsBySeverity: { critical: 4, high: 5, medium: 3, low: 0 },
  tacticsTotal: 12,
  tacticsByEffort: { XS: 4, S: 5, M: 3, L: 0 },
};

const TOOLS = [
  {
    name: 'Attio',
    category: 'CRM',
    auth: 'OK',
    workspace: 'Anyreach',
    user: 'richard@anyreach.ai',
    role: 'Admin',
    icon: Database,
    stats: [
      { label: 'Companies', value: '46,191' },
      { label: 'People', value: '111,116' },
      { label: 'Deals', value: '146' },
      { label: 'Active users', value: '2 / 10' },
    ],
    health: 'amber',
    healthNote: 'Single-owner pipeline · 99% companies unclassified',
  },
  {
    name: 'Apollo',
    category: 'Sales Engagement',
    auth: 'OK',
    workspace: 'team_676be7…',
    user: 'richard@anyreach.ai',
    role: 'Admin',
    icon: Mail,
    stats: [
      { label: 'Sequences', value: '11' },
      { label: 'Linked inboxes', value: '0' },
      { label: 'Sends in 90d', value: '0' },
      { label: 'Credits used', value: '0%' },
    ],
    health: 'critical',
    healthNote: 'Zero inboxes linked · 12 weeks dormant · zombie spend',
  },
];

const FINDINGS = [
  {
    id: 'F-001',
    severity: 'critical',
    title: 'Stated ICP (BPOs) does not match either won-deal or active-prospecting reality',
    evidence: [
      ['Stated ICP', 'BPO partners'],
      ['Won deals', '5 total'],
      ['Won deals in BPO industry', '0'],
      ['Deals via BPO channel', '2.1%'],
      ['Apollo sequences targeting BPOs', '0'],
    ],
    implication: "Anyreach's GTM motion does not match its public positioning. 0 of 5 won deals are BPOs. Apollo's sequence library targets marketing agencies and generic Tier-3 C-suite. Half of all 146 deals are tied to companies marked Low ICP fit.",
    action: 'Pick one ICP and hard-commit. Either re-aim outbound at BPO COOs/CROs and rebuild Apollo sequences to match — or drop the BPO positioning and re-pitch as a healthcare-services AI voice partner. Hybrid is the worst option and is the current state.',
    tools: ['Attio', 'Apollo'],
  },
  {
    id: 'F-002',
    severity: 'critical',
    title: 'Zero pipeline coverage from sales engagement: Apollo cannot send and has no team',
    evidence: [
      ['Linked email accounts', '0'],
      ['Sequences active', '10 of 11'],
      ['Days since last send', '82'],
      ['Lead credits used', '0%'],
      ['AI credits used', '0%'],
    ],
    implication: 'Apollo is paid software with infrastructure-level breakage. No mailbox is linked, so the 10 "active" sequences cannot send. The single user owning all sequences does not exist in Attio — likely a former employee.',
    action: 'This week: cancel or downgrade the Apollo plan if it stays unused, or fix the inbox-link + reassign sequences to an active user this sprint. Until at least one mailbox is linked, every dollar spent on Apollo is waste.',
    tools: ['Apollo'],
  },
  {
    id: 'F-003',
    severity: 'critical',
    title: 'Single-owner pipeline: 100% of 146 deals owned by Richard, no sales team in CRM',
    evidence: [
      ['Deal owner count', '1'],
      ['Owner % of pipeline', '100%'],
      ['Active Attio users', '2 of 10'],
      ['Suspended users', '8'],
    ],
    implication: 'Every deal is on the CEO\'s plate. 8 of 10 Attio seats are suspended. The only other active seat is a "demo anyreach" generic account. There is no rep capacity beyond Richard.',
    action: 'Decide whether Anyreach is in founder-led-sales mode (shut down Apollo, stop spending on RevOps tooling) or actively rebuilding a sales motion (hire one BPO-ICP AE this quarter and reassign half of Richard\'s pipeline).',
    tools: ['Attio'],
  },
  {
    id: 'F-004',
    severity: 'critical',
    title: 'Pipeline coverage math is not computable: >80% of deals lack value or ARR',
    evidence: [
      ['Deals total', '146'],
      ['With status set', '6.2%'],
      ['With AI-type set', '4.8%'],
      ['With deal value set', '~20%'],
      ['With ARR set', '~15%'],
    ],
    implication: 'On 146 deals, only ~9 have a status, ~7 have AI-type, ~30 have value, and ~22 have ARR. There is no way to forecast pipeline coverage, compute conversion rates by stage, or learn from lost deals.',
    action: 'Make value+ARR+stage required at deal creation. Backfill the 100+ deals missing them (a 2-hour Saturday). Add a structured loss_reason picklist before the next 5 deals close.',
    tools: ['Attio'],
  },
  {
    id: 'F-005',
    severity: 'high',
    title: 'Stage sprawl: 17 deal stages with overlapping scheduling/discovery states',
    evidence: [
      ['Deal stages defined', '17'],
      ['Deal stages in use', '15'],
      ['Scheduling-state stages', '5'],
      ['Parallel pipeline on companies', '16 stages'],
      ['Open deals in vague Follow-up', '34%'],
    ],
    implication: '44 of 130 open deals (34%) sit in a "Follow-up" bucket. Five separate stages exist for the discovery-call lifecycle. The companies object carries a near-duplicate 16-stage Deal Status field.',
    action: 'Collapse to 6 stages: Prospect → Discovery → Proposal → Negotiation → Won → Lost (with Churn as a status on Won, not a parallel terminal). Delete the companies.bpo_deals field.',
    tools: ['Attio'],
  },
  {
    id: 'F-006',
    severity: 'high',
    title: 'Single-customer concentration: EGS Global is both top revenue source and top churn source',
    evidence: [
      ['EGS won deals', '2 of 5'],
      ['EGS won ARR', '$300K (47%)'],
      ['EGS churn deals', '2 of 5'],
      ['EGS churn ARR', '$240K (67%)'],
    ],
    implication: 'EGS Global is the largest customer ($300K won) AND the largest churn ($240K of $360K total churn). One advisor relationship represents both Anyreach\'s revenue concentration risk and its retention failure.',
    action: 'Get the EGS relationship clarified this week. Then build at least 2 more BPO/healthcare-services advisor relationships in the next 90 days so EGS isn\'t 47% of won ARR.',
    tools: ['Attio'],
  },
  {
    id: 'F-007',
    severity: 'high',
    title: 'Account base is a graveyard: 99.2% of 46K companies have no source/ICP/account_type',
    evidence: [
      ['Total companies', '46,191'],
      ['With classification', '367 (0.8%)'],
      ['Without classification', '99.2%'],
      ['People records', '111,116'],
    ],
    implication: 'This is not a CRM — it is a list-import dump. Anyone trying to segment for outreach has nothing to filter by. There\'s no way to feed targeted, ICP-fit lists from Attio into Apollo.',
    action: 'Pick ~5K BPO companies (filter by industry + location + employee count via enrichment), bulk-set source=BPO and account_type=Connector(BPO/Partner), and delete or archive the rest.',
    tools: ['Attio'],
  },
  {
    id: 'F-008',
    severity: 'high',
    title: 'Zombie spend on Apollo: 9.6M AI / 59K lead / 58K dial credits at 0% utilization',
    evidence: [
      ['AI credits used', '0% of 9.6M'],
      ['Lead credits used', '0% of 59K'],
      ['Dial credits used', '0% of 58K'],
      ['Days since last send', '82'],
    ],
    implication: 'Apollo is paid for at a high tier (9.6M AI credits) but every credit type sits at 0% used. Combined with the 0 linked inboxes and 12-week dormancy, this is the textbook zombie-SaaS pattern.',
    action: 'If outbound isn\'t a priority for this quarter, downgrade Apollo to the cheapest tier or pause it. If outbound IS a priority, link an inbox today and start one BPO-targeted sequence by end of week.',
    tools: ['Apollo'],
  },
  {
    id: 'F-009',
    severity: 'high',
    title: 'Deliverability is failing on the small volume Apollo did send',
    evidence: [
      ['Aggregate bounce rate', '9.2%'],
      ['Hard bounce rate', '6.8%'],
      ['Acceptable bounce rate', '2%'],
      ['Reply rate', '0.73%'],
      ['Acceptable reply rate', '4%'],
    ],
    implication: '6.8% hard bounce rate is enough to permanently damage the sending domain\'s reputation if scaled. Reply rate is ~5x worse than acceptable. List quality is the root cause.',
    action: 'Before any new outbound: verify all addresses, warm a fresh sending domain (not anyreach.ai) for 4 weeks, and keep batches under 50/day per inbox until reputation is rebuilt.',
    tools: ['Apollo'],
  },
  {
    id: 'F-010',
    severity: 'medium',
    title: 'Stage/status data inconsistency on 3 of 5 churn deals',
    evidence: [
      ['Deals in Churn stage', '5'],
      ['Churn stage + Active status', '2'],
      ['Churn stage + Pilot status', '1'],
    ],
    implication: 'Until reconciled, gross retention can be reported anywhere from 17% to 57% depending on which field is trusted.',
    action: 'Reconcile the 3 ambiguous EGS+Physiofunnel records this week. Add a CRM rule: if Stage=Churn, Status must be Churn Subscription.',
    tools: ['Attio'],
  },
  {
    id: 'F-011',
    severity: 'medium',
    title: 'Prospects list is a dead artifact — 50+ entries with March 2025 close dates never updated',
    evidence: [
      ['Entries', '50+'],
      ['Bulk-created', '2025-02-19'],
      ['Months overdue', '14'],
    ],
    implication: 'Every entry in the Prospects list has a projected close date 14 months in the past. Any new RevOps hire will misread this as real pipeline.',
    action: 'Either archive the list or do a one-pass triage: anything not advanced past Prospecting in 14 months is dead.',
    tools: ['Attio'],
  },
  {
    id: 'F-012',
    severity: 'medium',
    title: 'Loss/churn taxonomy missing — patterns invisible',
    evidence: [
      ['Structured loss_reason', 'Missing'],
      ['Structured churn_reason', 'Missing'],
      ['Competitors named in notes', 'Thoughtly (1×)'],
    ],
    implication: 'Anyreach\'s two best signal sources for product and sales feedback exist only as free-text notes. With 4 lost + 5 churn deals, every data point matters and none is queryable.',
    action: 'Add a loss_reason picklist (Price, No-decision, Competitor, Fit, Reliability, Champion-departed). Make required at stage transition to Lost or Churn.',
    tools: ['Attio'],
  },
];

const TACTICS = [
  { id: 'T-001', from: 'F-002', priority: 9.5, effort: 'S', title: "Decide Apollo's fate this sprint: link an inbox + reassign, or downgrade", outcome: 'Apollo either becomes a real channel within 1 sprint, or stops drawing zombie monthly cost.', tools: ['Apollo'] },
  { id: 'T-002', from: 'F-004', priority: 9.2, effort: 'S', title: 'Make value/ARR/stage/source required at deal creation; backfill 100+ existing deals', outcome: 'Pipeline coverage analysis becomes possible. Forecasting becomes possible.', tools: ['Attio'] },
  { id: 'T-003', from: 'F-001', priority: 9.0, effort: 'M', title: 'Pick one ICP — BPO or healthcare-services — and align CRM, Apollo, and brand', outcome: 'Brand, CRM, and outbound all point at the same target.', tools: ['Attio', 'Apollo', 'Website'] },
  { id: 'T-004', from: 'F-005', priority: 8.5, effort: 'S', title: "Collapse Attio's deal pipeline from 17 stages to 6 and delete the parallel pipeline on companies", outcome: 'Stage definitions become unambiguous. Conversion-rate analytics become trustable.', tools: ['Attio'] },
  { id: 'T-005', from: 'F-006', priority: 8.4, effort: 'S', title: 'Reconcile the EGS Global account state and publish one canonical retention number', outcome: 'EGS state is unambiguous. Gross retention has a single canonical number.', tools: ['Attio'] },
  { id: 'T-006', from: 'F-007', priority: 8.0, effort: 'M', title: 'Triage the 46K-company Attio dump: tag ~5K ICP-fit, archive the rest', outcome: 'Active company pool drops from 46K to ~5K. Segmentation for outreach becomes possible.', tools: ['Attio'] },
  { id: 'T-007', from: 'F-012', priority: 7.8, effort: 'XS', title: 'Add structured loss_reason and churn_reason picklists to deals', outcome: 'Loss and churn patterns become aggregable. Competitor frequency becomes trackable.', tools: ['Attio'] },
  { id: 'T-008', from: 'F-009', priority: 7.5, effort: 'M', title: 'Before any outbound resumes: verify list, warm fresh sending domain, throttle volume', outcome: 'Bounce rate <2%. Primary domain reputation preserved.', tools: ['Apollo', 'DNS'] },
  { id: 'T-009', from: 'F-003', priority: 7.0, effort: 'S', title: 'Decide founder-led-sales vs first-AE-hire and act on the decision', outcome: "Anyreach's headcount intent matches its tooling spend.", tools: ['Attio', 'HR'] },
  { id: 'T-010', from: 'F-011', priority: 6.5, effort: 'XS', title: 'Archive or triage the 14-month-stale Prospects list', outcome: "The Prospects list becomes either accurate or absent.", tools: ['Attio'] },
  { id: 'T-011', from: 'F-008', priority: 6.0, effort: 'XS', title: 'Audit Apollo plan tier vs actual usage and right-size', outcome: 'Apollo monthly cost matches actual usage.', tools: ['Apollo', 'Finance'] },
  { id: 'T-012', from: 'F-010', priority: 5.5, effort: 'XS', title: 'Add Attio rule preventing Stage=Churn with non-Churn Status', outcome: 'Stage and Status fields cannot disagree on terminal-negative state.', tools: ['Attio'] },
];

const STRATEGIC_SHIFTS = [
  {
    n: '01',
    title: 'Pick one ICP and re-aim the stack at it',
    body: 'The hybrid state is the most expensive. If BPOs are the strategic ICP, in the next 30 days: filter Attio\'s 46K companies to ~5K BPOs and bulk-tag them; rebuild Apollo sequences to target BPO COOs/CROs; verify the BPO list before sending and warm a new domain.',
    altBody: 'If healthcare-services is where wins actually happen, update the brand, the website, and the pitch deck — and re-aim the BPO advisor program at healthcare-adjacent BPOs specifically.',
  },
  {
    n: '02',
    title: 'Treat the GTM stack as a write-once data asset',
    body: 'Even if Anyreach stays in founder-led-sales mode, the CRM should still be queryable in 12 months. Make value/arr/stage/status required. Add structured loss_reason and churn_reason. Collapse 17 stages to 6. Delete the duplicate bpo_deals field on companies. Archive the dead Prospects list.',
    altBody: 'A few hours of work that unlocks every other analysis.',
  },
  {
    n: '03',
    title: 'Decide whether Apollo stays or goes, this sprint',
    body: 'Apollo today produces no output and consumes monthly cost. Two acceptable futures: (Go) link an inbox this week, transfer ownership to Richard, warm a fresh domain, ship one BPO-targeted sequence at <50/day. (Goes) downgrade or cancel; rely on advisors and inbound until a BPO-ICP AE is hired.',
    altBody: 'Either is fine. The third option — leaving it as zombie spend while telling the world there\'s an outbound machine — is not.',
  },
];

// ─────────────────────────────────────────────────────────────────────
// Tiny components
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
    high: { bg: C.amber, fg: C.ink, label: 'High' },
    medium: { bg: C.creamLine, fg: C.ink, label: 'Medium' },
    low: { bg: C.creamSoft, fg: C.mutedOnCream, label: 'Low' },
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
          <span key={i} style={{
            width: 5, height: 14, background: i <= fill ? C.ink : C.creamLine,
          }} />
        ))}
      </span>
      <Mono color={C.ink}><span style={{ fontSize: 11, fontWeight: 500 }}>{effort}</span></Mono>
    </span>
  );
};

const HealthDot = ({ level }) => {
  const color = { good: C.indigo, amber: C.amber, critical: C.crimson }[level] || C.mutedOnCream;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 8, height: 8, background: color, borderRadius: '50%',
        boxShadow: `0 0 0 3px ${color}25`,
      }} />
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Findings', 'Tactics', 'Strategy', 'Tools'];

// ─────────────────────────────────────────────────────────────────────
// Views
// ─────────────────────────────────────────────────────────────────────
function OverviewView() {
  const totalFindings = RUN.findingsTotal;
  const sev = RUN.findingsBySeverity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Hero stat bar */}
      <div style={{ background: C.ink, padding: '40px 44px', display: 'grid', gridTemplateColumns: '1.5fr 1px 1fr 1px 1fr 1px 1fr', gap: 32, alignItems: 'center' }}>
        <div>
          <Eyebrow color={C.mutedOnInk}>The state of the stack</Eyebrow>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 44, color: C.cream,
            lineHeight: 1.04, marginTop: 14, fontWeight: 400,
          }}>
            The machinery is mostly <Italic color={C.lime}>off</Italic>. The
            parts that run, run on the <Italic>wrong target</Italic>.
          </div>
        </div>
        <div style={{ background: C.inkLine, height: '70%', alignSelf: 'center' }} />
        <div>
          <Eyebrow color={C.mutedOnInk}>Findings</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: C.cream, marginTop: 10, lineHeight: 1, fontWeight: 400 }}>
            <Mono>{totalFindings}</Mono>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk, marginTop: 6 }}>
            <Mono color={C.crimson}>{sev.critical}</Mono> critical · <Mono color={C.amber}>{sev.high}</Mono> high · <Mono color={C.mutedOnInk}>{sev.medium}</Mono> medium
          </div>
        </div>
        <div style={{ background: C.inkLine, height: '70%', alignSelf: 'center' }} />
        <div>
          <Eyebrow color={C.mutedOnInk}>Recommended Tactics</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: C.cream, marginTop: 10, lineHeight: 1, fontWeight: 400 }}>
            <Mono>{RUN.tacticsTotal}</Mono>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk, marginTop: 6 }}>
            <Mono color={C.cream}>9</Mono> ship in 30 days · <Mono color={C.cream}>3</Mono> need a decision
          </div>
        </div>
        <div style={{ background: C.inkLine, height: '70%', alignSelf: 'center' }} />
        <div>
          <Eyebrow color={C.mutedOnInk}>Audit Runtime</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: C.cream, marginTop: 10, lineHeight: 1, fontWeight: 400 }}>
            <Mono>{RUN.durationMin}</Mono><span style={{ fontSize: 24 }}> min</span>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnInk, marginTop: 6 }}>
            {RUN.toolsAudited.length} tools · {RUN.categories.length} categories
          </div>
        </div>
      </div>

      {/* Severity bar + Tools audited */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div style={{ background: C.cream, border: `1px solid ${C.creamLine}`, padding: 28 }}>
          <Eyebrow>Severity distribution</Eyebrow>
          <div style={{ marginTop: 18, display: 'flex', height: 80, gap: 1, background: C.creamLine }}>
            {[
              { level: 'critical', count: sev.critical, color: C.crimson },
              { level: 'high', count: sev.high, color: C.amber },
              { level: 'medium', count: sev.medium, color: C.indigoLight },
            ].map(s => (
              <div key={s.level} style={{
                flex: s.count, background: s.color, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: s.level === 'critical' ? C.cream : C.ink,
              }}>
                <Eyebrow color={s.level === 'critical' ? `${C.cream}cc` : `${C.ink}99`}>{s.level}</Eyebrow>
                <Mono><span style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400 }}>{s.count}</span></Mono>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontFamily: FONT_BODY, fontSize: 13, color: C.mutedOnCream, lineHeight: 1.55 }}>
            Four critical findings touch the same root cause: <Italic>positioning, infrastructure,
            ownership, and data</Italic> have all drifted from each other.
          </div>
        </div>
        <div style={{ background: C.cream, border: `1px solid ${C.creamLine}`, padding: 28 }}>
          <Eyebrow>Tools audited</Eyebrow>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TOOLS.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: `1px solid ${C.creamLine}` }}>
                  <div style={{ width: 36, height: 36, background: C.ink, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: C.ink, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream, marginTop: 2 }}>{t.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <HealthDot level={t.health} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 findings preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <Eyebrow>Top findings · sorted by severity</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: C.ink, marginTop: 6, fontWeight: 500 }}>
              The five things that need a decision <Italic>this week</Italic>.
            </div>
          </div>
          <button style={{ ...buttonGhost, fontSize: 12 }}>View all 12 →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FINDINGS.slice(0, 5).map((f, i) => (
            <div key={f.id} style={{
              display: 'grid', gridTemplateColumns: '60px 110px 1fr 100px',
              gap: 24, alignItems: 'center', padding: '20px 0',
              borderTop: i === 0 ? `1px solid ${C.ink}` : `1px solid ${C.creamLine}`,
              borderBottom: i === 4 ? `1px solid ${C.ink}` : 'none',
            }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.mutedOnCream, fontWeight: 400 }}>
                <Mono>{f.id}</Mono>
              </div>
              <SeverityChip level={f.severity} />
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: C.ink, fontWeight: 500, lineHeight: 1.35 }}>
                {f.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                {f.tools.map(t => (
                  <span key={t} style={{ fontFamily: FONT_BODY, fontSize: 10, padding: '3px 7px', border: `1px solid ${C.creamLine}`, color: C.mutedOnCream, letterSpacing: '0.04em' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FindingsView() {
  const [expanded, setExpanded] = useState('F-001');
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? FINDINGS : FINDINGS.filter(f => f.severity === filter);

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, paddingBottom: 18, borderBottom: `1px solid ${C.creamLine}` }}>
        <div>
          <Eyebrow>Filter</Eyebrow>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {['all', 'critical', 'high', 'medium'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: FONT_BODY, fontSize: 11, letterSpacing: '0.16em',
                textTransform: 'uppercase', fontWeight: 500,
                padding: '8px 14px', cursor: 'pointer',
                background: filter === f ? C.ink : 'transparent',
                color: filter === f ? C.cream : C.mutedOnCream,
                border: `1px solid ${filter === f ? C.ink : C.creamLine}`,
                marginLeft: -1,
              }}
            >
              {f} {f !== 'all' && <Mono color={filter === f ? C.cream : C.mutedOnCream}>· {RUN.findingsBySeverity[f]}</Mono>}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream }}>
          Showing <Mono color={C.ink}>{filtered.length}</Mono> of <Mono color={C.ink}>{FINDINGS.length}</Mono>
        </div>
      </div>

      {/* Findings list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((f, i) => {
          const isOpen = expanded === f.id;
          return (
            <div key={f.id} style={{
              borderTop: i === 0 ? `1px solid ${C.ink}` : `1px solid ${C.creamLine}`,
              borderBottom: i === filtered.length - 1 ? `1px solid ${C.ink}` : 'none',
            }}>
              <div
                onClick={() => setExpanded(isOpen ? null : f.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '60px 110px 1fr 120px 28px',
                  gap: 24, alignItems: 'center', padding: '20px 0',
                  cursor: 'pointer',
                }}
              >
                <Mono color={C.mutedOnCream}><span style={{ fontFamily: FONT_DISPLAY, fontSize: 18 }}>{f.id}</span></Mono>
                <SeverityChip level={f.severity} />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: C.ink, fontWeight: 500, lineHeight: 1.35 }}>
                  {f.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  {f.tools.map(t => (
                    <span key={t} style={{ fontFamily: FONT_BODY, fontSize: 10, padding: '3px 7px', border: `1px solid ${C.creamLine}`, color: C.mutedOnCream, letterSpacing: '0.04em' }}>{t}</span>
                  ))}
                </div>
                <div style={{ color: C.mutedOnCream }}>
                  {isOpen ? <ChevronUp size={18} strokeWidth={1.5} /> : <ChevronDown size={18} strokeWidth={1.5} />}
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '8px 0 32px 60px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40 }}>
                  {/* Evidence panel */}
                  <div style={{ background: C.creamSoft, padding: 20, borderLeft: `2px solid ${C.indigo}` }}>
                    <Eyebrow>Evidence</Eyebrow>
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
                      {f.evidence.map(([k, v], j) => (
                        <div key={j} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                          padding: '10px 0', borderBottom: j < f.evidence.length - 1 ? `1px solid ${C.creamLine}` : 'none',
                        }}>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream }}>{k}</span>
                          <Mono color={C.ink}><span style={{ fontSize: 14, fontWeight: 500 }}>{v}</span></Mono>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implication + action */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <Eyebrow>Implication</Eyebrow>
                      <div style={{ marginTop: 10, fontFamily: FONT_BODY, fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                        {f.implication}
                      </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.creamLine}`, paddingTop: 18 }}>
                      <Eyebrow color={C.indigo}>Recommended action</Eyebrow>
                      <div style={{ marginTop: 10, fontFamily: FONT_BODY, fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                        {f.action}
                      </div>
                      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                        <button style={buttonPrimary}>
                          <ArrowUpRight size={14} strokeWidth={2} />
                          View linked tactic
                        </button>
                        <button style={buttonGhost}>Mark as reviewed</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TacticsView() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Eyebrow>Tactics · prioritized</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: C.ink, marginTop: 6, fontWeight: 500 }}>
            12 moves, ranked by <Italic>impact ÷ effort</Italic>.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={buttonGhost}>Export to Linear</button>
          <button style={buttonPrimary}>Push to Notion</button>
        </div>
      </div>

      {/* Effort summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: C.creamLine, marginBottom: 32 }}>
        {[
          { effort: 'XS', count: RUN.tacticsByEffort.XS, label: '< 2 hrs' },
          { effort: 'S', count: RUN.tacticsByEffort.S, label: '< 1 day' },
          { effort: 'M', count: RUN.tacticsByEffort.M, label: '1–3 days' },
          { effort: 'L', count: RUN.tacticsByEffort.L, label: '> 3 days' },
        ].map(e => (
          <div key={e.effort} style={{ background: C.cream, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Eyebrow>Effort {e.effort}</Eyebrow>
              <Mono color={C.mutedOnCream}><span style={{ fontSize: 11 }}>{e.label}</span></Mono>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 42, color: C.ink, marginTop: 8, fontWeight: 400 }}>
              <Mono>{e.count}</Mono>
            </div>
          </div>
        ))}
      </div>

      {/* Tactics list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TACTICS.map((t, i) => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '40px 80px 100px 1fr 110px 30px',
            gap: 20, alignItems: 'center', padding: '18px 0',
            borderTop: i === 0 ? `1px solid ${C.ink}` : `1px solid ${C.creamLine}`,
            borderBottom: i === TACTICS.length - 1 ? `1px solid ${C.ink}` : 'none',
          }}>
            <Mono color={C.mutedOnCream}><span style={{ fontSize: 12 }}>{i + 1}.</span></Mono>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <Mono color={C.ink}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400 }}>{t.priority.toFixed(1)}</span>
              </Mono>
            </div>
            <EffortChip effort={t.effort} />
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>
                {t.title}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream, marginTop: 6, lineHeight: 1.5 }}>
                <Mono color={C.indigo}>{t.id}</Mono> · from <Mono color={C.mutedOnCream}>{t.from}</Mono> · {t.outcome}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              {t.tools.map(tool => (
                <span key={tool} style={{ fontFamily: FONT_BODY, fontSize: 10, padding: '3px 7px', border: `1px solid ${C.creamLine}`, color: C.mutedOnCream }}>{tool}</span>
              ))}
            </div>
            <div style={{ color: C.mutedOnCream }}>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrategyView() {
  return (
    <div>
      {/* Hero memo */}
      <div style={{ background: C.ink, padding: '56px 60px', marginBottom: 32 }}>
        <Eyebrow color={C.mutedOnInk}>Strategy memo · the audit's argument</Eyebrow>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 40, color: C.cream,
          marginTop: 18, lineHeight: 1.15, fontWeight: 400, maxWidth: 980,
        }}>
          The right posture is not to <Italic>optimize</Italic> this stack.
          It is to decide, in 30 days, whether Anyreach is in <Italic color={C.lime}>founder-led-sales mode</Italic> —
          or rebuilding a <Italic>real</Italic> sales motion.
        </div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 14, color: C.mutedOnInk,
          marginTop: 24, lineHeight: 1.65, maxWidth: 880,
        }}>
          The pitch is BPO partners. The data is healthcare end-customers. The CRM is a 46K-row dump.
          Apollo is paid software with zero linked inboxes. The current state — paying for tools,
          telling the world there's a sales motion, but operating like a one-CEO consulting practice
          — is the most expensive of the three options and the easiest to misrepresent in a fundraise.
        </div>
      </div>

      {/* Three shifts */}
      <Eyebrow>Three strategic shifts</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: C.creamLine, marginTop: 18 }}>
        {STRATEGIC_SHIFTS.map((s, i) => (
          <div key={s.n} style={{ background: C.cream, padding: 32, display: 'flex', flexDirection: 'column', minHeight: 380 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: i === 0 ? C.indigo : C.ink, fontWeight: 400, lineHeight: 1, marginBottom: 18 }}>
              <Mono>{s.n}</Mono>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.ink, fontWeight: 500, lineHeight: 1.25, marginBottom: 18 }}>
              {s.title}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink, lineHeight: 1.6, marginBottom: 16 }}>
              {s.body}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ paddingTop: 16, borderTop: `1px solid ${C.creamLine}`, fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream, lineHeight: 1.55, fontStyle: 'italic' }}>
              {s.altBody}
            </div>
          </div>
        ))}
      </div>

      {/* Risk callout */}
      <div style={{ marginTop: 32, padding: '24px 28px', borderLeft: `2px solid ${C.crimson}`, background: C.creamSoft }}>
        <Eyebrow color={C.crimson}>Risks if status quo persists</Eyebrow>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {[
            ['Investor narrative risk', 'Saying "we have a sales motion" while the CRM shows 1 active user, 5 won deals in 14 months, and a broken Apollo will not survive diligence.'],
            ['Concentration risk', 'EGS represents 47% of won ARR. Any further EGS deterioration drops Anyreach below $500K of clean won ARR.'],
            ['Domain reputation risk', 'A 6.8% hard bounce rate on existing sends has already damaged the sending domain. Restarting outbound on the same lists from the same domain will collapse deliverability.'],
            ['Hire-time risk', 'When Anyreach hires its first AE, they\'ll see 46K unclassified companies, 17 stages, and a 14-month-stale Prospects list. Their first 30 days will be cleanup, not selling.'],
          ].map(([t, b], i) => (
            <div key={i}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: C.ink, fontWeight: 500, marginBottom: 6 }}>{t}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream, lineHeight: 1.55 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolsView() {
  return (
    <div>
      <Eyebrow>Tool inventory</Eyebrow>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: C.ink, marginTop: 6, marginBottom: 24, fontWeight: 500 }}>
        Two systems, <Italic>one functioning</Italic>.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {TOOLS.map(t => {
          const Icon = t.icon;
          const isCritical = t.health === 'critical';
          return (
            <div key={t.name} style={{
              background: isCritical ? C.ink : C.cream,
              color: isCritical ? C.cream : C.ink,
              border: `1px solid ${isCritical ? C.ink : C.creamLine}`,
              padding: '32px 36px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56,
                  background: isCritical ? C.inkSoft : C.ink,
                  color: isCritical ? C.cream : C.cream,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <Eyebrow color={isCritical ? C.mutedOnInk : C.mutedOnCream}>{t.category} · {t.auth}</Eyebrow>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400, marginTop: 6 }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: isCritical ? C.mutedOnInk : C.mutedOnCream, marginTop: 4 }}>
                    Workspace: <Mono>{t.workspace}</Mono> · {t.user} · {t.role}
                  </div>
                </div>
                <div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px',
                    background: isCritical ? C.crimson : C.amber,
                    color: isCritical ? C.cream : C.ink,
                    fontFamily: FONT_BODY, fontSize: 11, letterSpacing: '0.16em',
                    textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    {isCritical ? <AlertCircle size={12} /> : <AlertTriangle size={12} />}
                    {isCritical ? 'Critical' : 'Needs attention'}
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
                background: isCritical ? C.inkLine : C.creamLine,
              }}>
                {t.stats.map(s => (
                  <div key={s.label} style={{
                    background: isCritical ? C.ink : C.cream,
                    padding: 18,
                  }}>
                    <Eyebrow color={isCritical ? C.mutedOnInk : C.mutedOnCream}>{s.label}</Eyebrow>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, marginTop: 8 }}>
                      <Mono>{s.value}</Mono>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: `1px solid ${isCritical ? C.inkLine : C.creamLine}`,
                fontFamily: FONT_BODY, fontSize: 13,
                color: isCritical ? C.mutedOnInk : C.mutedOnCream,
                lineHeight: 1.6, fontStyle: 'italic',
              }}>
                {t.healthNote}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────────────
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
// Main app
// ─────────────────────────────────────────────────────────────────────
export default function GTMAuditApp() {
  const [tab, setTab] = useState('Overview');

  return (
    <div style={{
      minHeight: '100vh',
      background: C.cream,
      fontFamily: FONT_BODY,
      color: C.ink,
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" />

      {/* Top bar */}
      <div style={{
        background: C.ink, color: C.cream,
        padding: '14px 48px', display: 'flex', alignItems: 'center', gap: 24,
        borderBottom: `1px solid ${C.inkLine}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, background: C.lime, transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 500 }}>Anyreach</span>
          <span style={{ color: C.mutedOnInk, fontSize: 12 }}>/</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mutedOnInk }}>GTM Stack Audit</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 11, color: C.mutedOnInk, fontFamily: FONT_BODY }}>
          <span><Mono>Run #042</Mono></span>
          <span style={{ width: 1, height: 12, background: C.inkLine }} />
          <span>Completed <Mono color={C.cream}>2026-05-09</Mono></span>
          <span style={{ width: 1, height: 12, background: C.inkLine }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, background: C.lime, borderRadius: '50%' }} />
            <Mono color={C.cream}>30 min</Mono>
          </span>
        </div>
        <button style={{
          ...buttonGhost,
          background: 'transparent',
          color: C.cream, border: `1px solid ${C.inkLine}`,
        }}>
          <RefreshCw size={13} strokeWidth={1.7} />
          Re-run audit
        </button>
        <button style={{
          ...buttonPrimary,
          background: C.lime, color: C.ink,
        }}>
          <Download size={13} strokeWidth={2} />
          Export PDF
        </button>
      </div>

      {/* Title block */}
      <div style={{ padding: '48px 48px 36px 48px', borderBottom: `1px solid ${C.creamLine}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
          <div>
            <Eyebrow>{RUN.client} · Q1 2026 audit window</Eyebrow>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 60, color: C.ink,
              marginTop: 12, lineHeight: 1.05, fontWeight: 400,
              maxWidth: 1100,
            }}>
              The GTM stack tells a different story than the <Italic>pitch</Italic>.
            </div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 15, color: C.mutedOnCream,
              marginTop: 18, lineHeight: 1.6, maxWidth: 760,
            }}>
              Two tools audited. Twelve findings. Four critical. The pattern across them
              is not complexity — it's drift between what Anyreach sells, what its CRM is
              measuring, and what its outbound is actually doing.
            </div>
          </div>
          <div style={{ flexShrink: 0, paddingLeft: 32, borderLeft: `1px solid ${C.creamLine}`, paddingTop: 8 }}>
            <Eyebrow>Audit by</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 500, color: C.ink, marginTop: 8 }}>
              Anyreach Audit Engine
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mutedOnCream, marginTop: 4 }}>
              <Mono>v0.7.2</Mono> · MCP-orchestrated
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT_BODY, fontSize: 11, padding: '4px 9px', background: C.creamSoft, color: C.ink }}>
                <Sparkles size={10} strokeWidth={2} />
                Claude · Sonnet 4.6
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '0 48px', background: C.cream, borderBottom: `1px solid ${C.creamLine}`, position: 'sticky', top: 0, zIndex: 10 }}>
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
                cursor: 'pointer',
                marginBottom: -1,
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
        padding: '24px 48px', background: C.cream, borderTop: `1px solid ${C.creamLine}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FONT_BODY, fontSize: 11, color: C.mutedOnCream,
      }}>
        <div>
          Audit run by <Mono color={C.ink}>richard@anyreach.ai</Mono> · 2 tools · 12 findings ·{' '}
          <Mono color={C.ink}>30:00</Mono> elapsed
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

import { useState } from "react";

const C = {
  bg: "#0D0D1A",
  surface: "#161631",
  card: "#1E1E3A",
  cardHover: "#252550",
  border: "#2A2A4A",
  text: "#E8E8F0",
  muted: "#8B8BA8",
  dim: "#5A5A7A",
  indigo: "#5B5FC7",
  green: "#10B981",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  pink: "#EC4899",
  red: "#EF4444",
  purple: "#8B5CF6",
};

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];

const DOMAINS = [
  {
    name: "Contract Negotiation",
    score: 4,
    stage: "Series B",
    color: C.pink,
    icon: "§",
    quant: [
      "7+ counterparty negotiations codified",
      "10 standing contract rules",
      "7-step analysis framework mandatory",
      "6 BPO-specific trap patterns documented",
    ],
    qual: "Battle-tested IP, exclusivity, and liability positions from Startek, ResultsCX, iQor, and CP360 negotiations. Concession framework with escalation triggers. Most Series B companies with in-house counsel don't have this level of codification.",
  },
  {
    name: "Compliance & Infosec",
    score: 3,
    stage: "Series A",
    color: C.green,
    icon: "◈",
    quant: [
      "SOC 2 Type II certified",
      "99 master compliance documents",
      "5-10 day DDQ response SLA",
      "HIPAA-ready with executed BAAs",
    ],
    qual: "Structured intake → classify → scope → respond pipeline for SIG, DDQ, and RFP security sections. Library maintenance rules prevent document drift. Gap: single-operator dependency on Richard for gap analysis and narrative responses.",
  },
  {
    name: "Sales Operations",
    score: 3,
    stage: "Series A",
    color: C.cyan,
    icon: "◎",
    quant: [
      "5 BPO partners in active enablement scope",
      "6 deliverable types per prospect",
      "~3 min auto-demo generation",
      "4-question discovery intake standardized",
    ],
    qual: "End-to-end enablement machine: inbound email → triage → Google Drive folder → CX Intel + pitch deck + deep research + stakeholder intel. Automated demo bot at demo@mail.anyreach.ai. The multi-deliverable pipeline from a single partner request is a legitimate RevOps system.",
  },
  {
    name: "SLA Management",
    score: 3,
    stage: "Series A",
    color: C.amber,
    icon: "◆",
    quant: [
      "48-hour extraction SLA post-execution",
      "3-tier risk classification (G/Y/R)",
      "Per-client obligation catalog active",
      "Monthly re-evaluation cadence",
    ],
    qual: "Full lifecycle: extraction → risk scoring → monitoring → early-warning → escalation → remediation. ResultsCX and Startek obligations already cataloged with verbatim contractual language + plain English paraphrases. Most pre-Series B companies don't systematically extract SLA obligations.",
  },
  {
    name: "Discovery & Proposals",
    score: 3,
    stage: "Series A",
    color: C.purple,
    icon: "◇",
    quant: [
      "3-phase discovery framework",
      "60-75 min structured call format",
      "Question bank by section",
      "Automated SoW generation from transcripts",
    ],
    qual: "Pre-call prep → structured discovery → post-call proposal pipeline. NWFCU SOW went through 16+ versions; GameStop SOW scoped with risk matrix, RACI, and phased pricing. The proposal generator from call transcripts is a productivity multiplier few startups have.",
  },
  {
    name: "Organizational Scalability",
    score: 1,
    stage: "Pre-Seed",
    color: C.red,
    icon: "△",
    quant: [
      "9-person team total",
      "~$818K total raised (SAFEs)",
      "All SOPs v1.0 (April 2026)",
      "CEO as primary owner on all SOPs",
    ],
    qual: "This is the honest one. Every SOP has Richard at the triage/decision layer. The processes document Richard's brain but haven't been stress-tested by someone else executing them. Works at 9 people — becomes a bottleneck at 15-20, and a single point of failure now.",
  },
];

const DEAL_PIPELINE = [
  { name: "GameStop / ResultsCX", stage: "POC Scoped", value: "$75K", status: "active" },
  { name: "Centene / IL Meridian", stage: "Procurement", value: "TBD", status: "active" },
  { name: "NWFCU", stage: "SOW v16+", value: "Negotiating", status: "active" },
  { name: "Startek / LogiCX", stage: "MSA Redlines", value: "$100-300M ARR target", status: "caution" },
  { name: "eSAL / UBA Ghana", stage: "MSA Signed", value: "Large", status: "active" },
  { name: "CGS Nexus", stage: "NDA Signed", value: "Early", status: "early" },
];

const statusColor = { active: C.green, caution: C.amber, early: C.dim };

function RadialGauge({ score, max = 5, color, size = 80 }) {
  const pct = score / max;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={C.text} fontSize={20} fontWeight={700} style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
        {score}
      </text>
    </svg>
  );
}

function MaturityBar() {
  const avg = DOMAINS.reduce((s, d) => s + d.score, 0) / DOMAINS.length;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {STAGES.map((s, i) => (
          <span key={s} style={{ fontSize: 11, color: i <= Math.round(avg) - 1 ? C.text : C.dim, fontWeight: i === Math.round(avg) - 1 ? 700 : 400, flex: 1, textAlign: "center" }}>{s}</span>
        ))}
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 3, position: "relative" }}>
        <div style={{ height: 6, background: `linear-gradient(90deg, ${C.indigo}, ${C.cyan})`, borderRadius: 3, width: `${(avg / 5) * 100}%`, transition: "width 1s ease" }} />
        {DOMAINS.map((d) => (
          <div key={d.name} title={d.name} style={{
            position: "absolute", top: -4, left: `${(d.score / 5) * 100}%`, transform: "translateX(-50%)",
            width: 14, height: 14, borderRadius: "50%", background: d.color, border: `2px solid ${C.bg}`,
          }} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: C.muted }}>
        Composite Maturity: <span style={{ color: C.text, fontWeight: 700 }}>{avg.toFixed(1)} / 5.0</span>
        <span style={{ marginLeft: 8, color: C.cyan }}>≈ Series A operating maturity on a Pre-Seed balance sheet</span>
      </div>
    </div>
  );
}

function DomainCard({ domain, isOpen, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: isOpen ? C.cardHover : C.card, border: `1px solid ${isOpen ? domain.color + "66" : C.border}`,
      borderLeft: `3px solid ${domain.color}`, borderRadius: 8, padding: 16, cursor: "pointer",
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <RadialGauge score={domain.score} color={domain.color} size={52} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{domain.name}</div>
            <div style={{ fontSize: 11, color: domain.color, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>
              {domain.stage} Maturity
            </div>
          </div>
        </div>
        <span style={{ fontSize: 18, color: C.dim, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
            {domain.quant.map((q, i) => (
              <div key={i} style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ color: domain.color, fontSize: 8 }}>●</span> {q}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, opacity: 0.85 }}>{domain.qual}</div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "24px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ height: 3, width: 32, background: C.pink, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: C.pink, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Operational Maturity Assessment</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 4px", color: C.text }}>Anyreach, Inc.</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
          Pre-Seed · 9 people · $818K raised · 7 BPO partners · 6+ concurrent enterprise deals
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "SOPs Formalized", value: "5", sub: "All v1.0 April 2026", color: C.indigo },
          { label: "Active Deal Threads", value: "6+", sub: "Enterprise / regulated", color: C.cyan },
          { label: "Compliance Docs", value: "99", sub: "Master library", color: C.green },
          { label: "Funding Stage", value: "Pre-Seed", sub: "Operating at Series A", color: C.amber },
        ].map((s) => (
          <div key={s.label} style={{ background: C.card, borderRadius: 8, padding: "14px 12px", borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Maturity Bar */}
      <div style={{ background: C.surface, borderRadius: 10, padding: 20, marginBottom: 24, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.indigo, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
          Composite Maturity Spectrum
        </div>
        <MaturityBar />
      </div>

      {/* Two-column: Domains + Pipeline */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
        {/* Domain Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, color: C.cyan, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
            Domain Breakdown — Click to Expand
          </div>
          {DOMAINS.map((d, i) => (
            <DomainCard key={d.name} domain={d} isOpen={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)} />
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Pipeline */}
          <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.amber, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
              Active Enterprise Pipeline
            </div>
            {DEAL_PIPELINE.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{d.stage}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{d.value}</div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[d.status], marginLeft: "auto", marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div style={{ background: `linear-gradient(135deg, ${C.indigo}15, ${C.cyan}15)`, borderRadius: 10, padding: 16, border: `1px solid ${C.indigo}33` }}>
            <div style={{ fontSize: 11, color: C.indigo, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
              Pound-for-Pound Verdict
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>
              2–3 funding stages above weight class
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              Operating at Series A / early Series B enterprise maturity on a pre-seed balance sheet. This is what lets a 9-person company sit across the table from GameStop and Centene without getting dismissed.
            </p>
            <div style={{ marginTop: 14, padding: "10px 12px", background: C.red + "18", borderRadius: 6, border: `1px solid ${C.red}33` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.red, marginBottom: 4 }}>⚠ KEY RISK</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                CEO is primary owner on all 5 SOPs. Processes document Richard's brain but haven't been proven to run without him. Next unlock: make these executable by someone who isn't you.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.dim }}>
        CONFIDENTIAL · anyreach.ai · April 2026
      </div>
    </div>
  );
}

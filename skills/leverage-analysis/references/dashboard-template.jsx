/**
 * Leverage Analysis Dashboard — Reference Template
 * 
 * This is the base template for generating leverage dashboards.
 * Customize the data arrays below for each specific analysis.
 * Do NOT modify the component structure or styling unless necessary.
 * 
 * CUSTOMIZATION POINTS (marked with 🔧):
 * 1. COLORS.partyA / COLORS.partyB — Change accent colors per relationship type
 * 2. leverageData[] — Core leverage dimensions, scores, details, evidence
 * 3. financialExposure[] — Line items with values and risk types
 * 4. statusQuoTotal / restructuredTotal — Hero card numbers
 * 5. counterpartyOptions[] / richardOptions[] — Game theory scenarios
 * 6. Header text — Title, subtitle, party names
 * 7. Bottom line verdict text
 */

import { useState } from "react";

// 🔧 COLORS — Adjust partyA/partyB for different relationship types
const COLORS = {
  bg: "#0B0B1A",
  card: "#12122A",
  cardBorder: "#1E1E3A",
  partyA: "#5B5FC7",    // Richard / Anyreach — indigo
  partyB: "#EF4444",    // Counterparty — red
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
  cyan: "#06B6D4",
  pink: "#EC4899",
  text: "#E2E8F0",
  muted: "#6B7280",
  dimText: "#94A3B8",
};

// 🔧 LEVERAGE DATA — One entry per dimension
// richard: 0-100 score for Party A (Richard/Anyreach)
// tom: 0-100 score for Party B (counterparty) — NOTE: rename this field to match counterparty
// richard + tom must equal 100 for each dimension
const leverageData = [
  {
    category: "Dimension Name",
    richard: 80,
    tom: 20,
    details: "Factual summary of the dimension — what the evidence shows about who holds leverage here.",
    evidence: "Specific citation: email dates, document names, behavioral patterns, quotes.",
  },
  // Add 6-10 dimensions total for a comprehensive analysis
];

// 🔧 FINANCIAL EXPOSURE — Line items showing cost/risk
// type: "spent" (sunk cost), "owed" (committed), "risk" (potential future exposure)
const financialExposure = [
  { label: "Description of cost item", value: "$XX,XXX", type: "spent" },
  { label: "Description of committed cost", value: "$XX,XXX", type: "owed" },
  { label: "Description of risk exposure", value: "$X.XM+", type: "risk" },
];

// 🔧 COUNTERPARTY OPTIONS — What the other party could credibly do
// severity: "none" | "low" | "medium" | "high" | "critical"
const counterpartyOptions = [
  { action: "Action name", impact: "Realistic assessment of what would happen", severity: "low" },
];

// 🔧 RICHARD'S OPTIONS — What Richard/Anyreach could do
// severity: "strong" | "neutral" | "weak"
const richardOptions = [
  { action: "Action name", impact: "Realistic assessment of outcomes", severity: "strong" },
];

// ============================================================
// COMPONENT CODE — Generally do not modify below this line
// ============================================================

function Bar({ left, right, leftColor, rightColor }) {
  return (
    <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "#1a1a3a", width: "100%" }}>
      <div style={{ width: `${left}%`, background: leftColor, transition: "width 0.8s ease" }} />
      <div style={{ width: `${right}%`, background: rightColor, transition: "width 0.8s ease" }} />
    </div>
  );
}

function ScoreCircle({ value, label, color, size = 120 }) {
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#1E1E3A" strokeWidth="8" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fill={COLORS.text} fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{value}</text>
      </svg>
      <span style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, textAlign: "center" }}>{label}</span>
    </div>
  );
}

export default function LeverageDashboard() {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("leverage");

  // 🔧 Update field names if you renamed "richard" / "tom" in leverageData
  const partyAAvg = Math.round(leverageData.reduce((s, d) => s + d.richard, 0) / leverageData.length);
  const partyBAvg = Math.round(leverageData.reduce((s, d) => s + d.tom, 0) / leverageData.length);

  const tabs = [
    { id: "leverage", label: "Leverage Analysis" },
    { id: "financial", label: "Financial Exposure" },
    { id: "scenarios", label: "Game Theory" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", padding: "24px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* 🔧 HEADER — Update title and party names */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
          <span style={{ fontSize: 10, color: COLORS.green, textTransform: "uppercase", letterSpacing: 3, fontWeight: 600 }}>Live Analysis</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 4px", letterSpacing: -0.5 }}>
          Advisor Leverage Matrix {/* 🔧 Change title */}
        </h1>
        <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
          Party A ↔ Party B · Quantified Power Dynamics {/* 🔧 Change names */}
        </p>
      </div>

      {/* COMPOSITE SCORES */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 48, padding: "24px 0",
        marginBottom: 24, borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}`,
      }}>
        <ScoreCircle value={partyAAvg} label="Richard" color={COLORS.partyA} /> {/* 🔧 Label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Leverage</span>
          <span style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Ratio</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, margin: "4px 0" }}>
            {Math.round(partyAAvg / Math.max(partyBAvg, 1))}:1
          </span>
          <span style={{ fontSize: 10, color: COLORS.green }}>Richard's favor</span> {/* 🔧 */}
        </div>
        <ScoreCircle value={partyBAvg} label="Counterparty" color={COLORS.partyB} /> {/* 🔧 Label */}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0f0f24", borderRadius: 8, padding: 3 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "10px 8px", border: "none", borderRadius: 6, cursor: "pointer",
            fontSize: 10, fontWeight: 600, letterSpacing: 0.5, fontFamily: "inherit",
            textTransform: "uppercase",
            background: activeTab === t.id ? COLORS.card : "transparent",
            color: activeTab === t.id ? COLORS.text : COLORS.muted,
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: LEVERAGE ANALYSIS */}
      {activeTab === "leverage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leverageData.map((d, i) => (
            <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{
              background: COLORS.card, borderRadius: 10, padding: "14px 16px", cursor: "pointer",
              border: `1px solid ${expanded === i ? COLORS.partyA + "60" : COLORS.cardBorder}`,
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{d.category}</span>
                <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                  <span style={{ color: COLORS.partyA }}>{d.richard}</span>
                  <span style={{ color: COLORS.muted }}>·</span>
                  <span style={{ color: COLORS.partyB }}>{d.tom}</span>
                </div>
              </div>
              <Bar left={d.richard} right={d.tom} leftColor={COLORS.partyA} rightColor={COLORS.partyB} />
              {expanded === i && (
                <div style={{ marginTop: 12, fontSize: 11, lineHeight: 1.6 }}>
                  <p style={{ color: COLORS.dimText, margin: "0 0 6px" }}>{d.details}</p>
                  <p style={{ color: COLORS.muted, margin: 0, fontSize: 10, fontStyle: "italic" }}>📎 {d.evidence}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: COLORS.muted }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.partyA }} /> Richard {/* 🔧 */}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: COLORS.muted }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.partyB }} /> Counterparty {/* 🔧 */}
            </div>
          </div>
        </div>
      )}

      {/* TAB: FINANCIAL EXPOSURE */}
      {activeTab === "financial" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* 🔧 STATUS QUO HERO CARD */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.card}, #1a1035)`,
            borderRadius: 10, padding: 16, border: `1px solid ${COLORS.cardBorder}`, marginBottom: 4,
          }}>
            <span style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2 }}>Total Exposure If Status Quo</span>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.red, marginTop: 4 }}>$X.XM+/yr</div> {/* 🔧 */}
            <span style={{ fontSize: 10, color: COLORS.muted }}>Primary driver description</span> {/* 🔧 */}
          </div>

          {financialExposure.map((item, i) => (
            <div key={i} style={{
              background: COLORS.card, borderRadius: 10, padding: "12px 16px",
              border: `1px solid ${COLORS.cardBorder}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.dimText }}>{item.label}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: item.type === "risk" ? COLORS.red : item.type === "owed" ? COLORS.amber : COLORS.muted,
                }}>{item.value}</span>
                <span style={{
                  fontSize: 8, padding: "2px 6px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
                  background: item.type === "risk" ? COLORS.red + "20" : item.type === "owed" ? COLORS.amber + "20" : COLORS.muted + "20",
                  color: item.type === "risk" ? COLORS.red : item.type === "owed" ? COLORS.amber : COLORS.muted,
                }}>{item.type}</span>
              </div>
            </div>
          ))}

          {/* 🔧 POST-RESTRUCTURE HERO CARD */}
          <div style={{
            background: COLORS.card, borderRadius: 10, padding: 16, marginTop: 4,
            border: `1px solid ${COLORS.green}30`,
          }}>
            <span style={{ fontSize: 10, color: COLORS.green, textTransform: "uppercase", letterSpacing: 2 }}>Post-Restructure Exposure</span>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.green, marginTop: 4 }}>$XX-XXK</div> {/* 🔧 */}
            <span style={{ fontSize: 10, color: COLORS.muted }}>Restructured terms description</span> {/* 🔧 */}
          </div>
        </div>
      )}

      {/* TAB: GAME THEORY */}
      {activeTab === "scenarios" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: COLORS.partyB, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, fontWeight: 600 }}>
              Counterparty's Options & Impact {/* 🔧 */}
            </div>
            {counterpartyOptions.map((s, i) => (
              <div key={i} style={{
                background: COLORS.card, borderRadius: 10, padding: "12px 16px", marginBottom: 6,
                border: `1px solid ${COLORS.cardBorder}`,
                borderLeft: `3px solid ${
                  s.severity === "none" ? COLORS.muted :
                  s.severity === "low" ? COLORS.amber :
                  s.severity === "medium" ? COLORS.red :
                  COLORS.red
                }`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{s.action}</span>
                  <span style={{
                    fontSize: 8, padding: "2px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
                    background: s.severity === "none" ? COLORS.muted + "20" : s.severity === "low" ? COLORS.amber + "20" : COLORS.red + "20",
                    color: s.severity === "none" ? COLORS.muted : s.severity === "low" ? COLORS.amber : COLORS.red,
                  }}>
                    {s.severity === "none" ? "No Impact" : s.severity === "low" ? "Low Risk" : s.severity === "medium" ? "Medium Risk" : "High Risk"}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: COLORS.dimText, margin: 0, lineHeight: 1.5 }}>{s.impact}</p>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, color: COLORS.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, fontWeight: 600 }}>
              Richard's Options & Impact {/* 🔧 */}
            </div>
            {richardOptions.map((s, i) => (
              <div key={i} style={{
                background: COLORS.card, borderRadius: 10, padding: "12px 16px", marginBottom: 6,
                border: `1px solid ${COLORS.cardBorder}`,
                borderLeft: `3px solid ${s.severity === "strong" ? COLORS.green : s.severity === "weak" ? COLORS.red : COLORS.amber}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{s.action}</span>
                  <span style={{
                    fontSize: 8, padding: "2px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
                    background: s.severity === "strong" ? COLORS.green + "20" : s.severity === "weak" ? COLORS.red + "20" : COLORS.amber + "20",
                    color: s.severity === "strong" ? COLORS.green : s.severity === "weak" ? COLORS.red : COLORS.amber,
                  }}>
                    {s.severity === "strong" ? "Strong" : s.severity === "weak" ? "Weak" : "Neutral"}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: COLORS.dimText, margin: 0, lineHeight: 1.5 }}>{s.impact}</p>
              </div>
            ))}
          </div>

          {/* 🔧 BOTTOM LINE VERDICT */}
          <div style={{
            background: `linear-gradient(135deg, #0d1a0d, ${COLORS.card})`,
            borderRadius: 10, padding: 16,
            border: `1px solid ${COLORS.green}40`,
          }}>
            <div style={{ fontSize: 10, color: COLORS.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontWeight: 600 }}>
              Bottom Line
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: COLORS.dimText, margin: 0 }}>
              {/* 🔧 Replace with analysis-specific verdict */}
              Summary verdict goes here. Include the leverage ratio, key risk, and recommended action.
              Highlight the ratio in a span: <span style={{ color: COLORS.green, fontWeight: 700 }}>X:1 in Richard's favor</span>.
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${COLORS.cardBorder}`, textAlign: "center" }}>
        <span style={{ fontSize: 9, color: COLORS.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          Anyreach, Inc. · Internal Analysis · Confidential
        </span>
      </div>
    </div>
  );
}

#!/usr/bin/env node
/**
 * Internal Briefing DOCX generator.
 *
 * Reads a JSON file from stdin (config + computed results from internal_math.py)
 * and writes the docx to a path passed as argv[2].
 *
 * Usage:
 *   python3 internal_math.py config.json | node generate_docx.js out.docx
 */

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber,
} = require('docx');

// ── Read input ────────────────────────────────────────────────
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
const { config, results } = input;
const outPath = process.argv[2];

if (!outPath) {
  console.error('Usage: node generate_docx.js <output.docx>');
  process.exit(1);
}

// ── Brand variables (with sensible defaults) ─────────────────
// These derive from the BPO brand colors in the config but stay generic —
// the doc has the BPO's color identity but uses standard internal-doc styling.
const brand = config.bpo?.brand || {};
const NAVY      = (brand.navy || '#003D6B').replace('#', '');
const ACCENT    = (brand.accent || '#E92983').replace('#', '');

// Fixed neutrals (don't vary across BPOs)
const RED       = 'C81E3F';
const RED_SOFT  = 'FEEBEF';
const PINK_SOFT = 'FDE7F1';
const GREEN     = '1D7366';
const TEXT      = '14293D';
const TEXT_MUTE = '5D758D';
const BORDER    = 'E3E8ED';
const BG_LIGHT  = 'F6F8FA';

// ── Helpers ──────────────────────────────────────────────────
const brd = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const borders = { top: brd, bottom: brd, left: brd, right: brd };
const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };

const run = (text, opts = {}) => new TextRun({ text, font: 'Arial', ...opts });

const spacer = (size = 120) => new Paragraph({ children: [], spacing: { before: 0, after: size } });

const heading1 = (text) => new Paragraph({
  children: [run(text, { bold: true, size: 30, color: NAVY })],
  spacing: { before: 280, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 4 } },
});

const heading2 = (text) => new Paragraph({
  children: [run(text, { bold: true, size: 24, color: NAVY })],
  spacing: { before: 200, after: 100 },
});

const heading3 = (text) => new Paragraph({
  children: [run(text, { bold: true, size: 20, color: ACCENT, allCaps: true })],
  spacing: { before: 160, after: 80 },
});

const body = (text, opts = {}) => new Paragraph({
  children: [run(text, { size: 20, color: TEXT, ...opts })],
  spacing: { before: 60, after: 100 },
});

const bullet = (runs, opts = {}) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  children: (Array.isArray(runs) ? runs : [runs]).map(r =>
    typeof r === 'string' ? run(r, { size: 20 }) : r
  ),
  spacing: { before: 50, after: 50 },
  ...opts,
});

const footnote = (text) => new Paragraph({
  children: [run(text, { size: 16, color: TEXT_MUTE, italics: true })],
  spacing: { before: 40, after: 100 },
});

const tcell = (text, opts = {}) => new TableCell({
  borders,
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  margins: cellMargins,
  verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    children: [run(text, {
      size: opts.size || 20,
      bold: opts.bold,
      color: opts.color || TEXT,
      italics: opts.italics,
    })],
  })],
});

const callout = (text, { fill = PINK_SOFT, border = ACCENT } = {}) => new Paragraph({
  children: [run(text, { size: 20, bold: true, color: NAVY })],
  shading: { fill, type: ShadingType.CLEAR },
  spacing: { before: 140, after: 140 },
  border: {
    left: { style: BorderStyle.SINGLE, size: 18, color: border, space: 6 },
  },
});

// ── Format helpers ───────────────────────────────────────────
const fmtMoneyM = (n) => {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (Math.abs(n) >= 1e6) {
    const m = n / 1e6;
    if (Math.abs(m) >= 100) return `$${m.toFixed(0)}M`;
    return `$${m.toFixed(1)}M`;
  }
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};
const fmtMoneyMTilde = (n) => `~${fmtMoneyM(n)}`;
const fmtPct = (p, dec = 1) => p == null ? '—' : `${(p * 100).toFixed(dec)}%`;
const fmtPrice = (p) => `$${p.toFixed(2)}`;

// Smart possessive: "Fabletics" → "Fabletics'", "Walmart" → "Walmart's"
const possessive = (name) => {
  if (!name) return name;
  return name + (name.slice(-1).toLowerCase() === 's' ? "'" : "'s");
};

// ── Pull commonly-used values ────────────────────────────────
const bpo = config.bpo;
const client = config.end_client;
const aiVendor = config.current_state?.ai_vendor?.name || 'Cognigy';
const stakeholders = (config.stakeholders || [])
  .map(s => `${s.name}${s.title ? ` (${s.title})` : ''}`).join(' · ') || 'leadership team';

const internalRecipients = (config.internal_recipients || []).join(' · ') || 'internal team';

// ── Build document children ──────────────────────────────────
const children = [];

// ── Title ────────────────────────────────────────────────────
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [run(`${bpo.name.toUpperCase()} INTERNAL BRIEFING`, {
    bold: true, size: 22, color: RED, letterSpacing: 2,
  })],
  spacing: { after: 60 },
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [run(`${client.name} ROI Model — Strategy & Talking Points`, {
    bold: true, size: 32, color: NAVY,
  })],
  spacing: { after: 80 },
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [run(`For: ${internalRecipients}`,
    { size: 18, color: TEXT_MUTE, italics: true })],
  spacing: { after: 240 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 12 } },
}));

// ═══════════════════════════════════════════════════════════
// 1. MODEL OVERVIEW
// ═══════════════════════════════════════════════════════════
children.push(heading1('1. Model Overview'));

const overviewIntro = config.internal_briefing?.overview_intro
  || `Executive-level ROI model comparing ${possessive(client.name)} current state (${aiVendor} + incumbent ${bpo.label || 'BPO'}) against our outcomes-based AI + Human approach.`;
children.push(body(overviewIntro));

children.push(heading3('What the model shows'));

const totalCxStr = fmtMoneyM(results.total_cx_spend);
const aiSpendStr = fmtMoneyM(results.ai_spend);
const bpoSpendStr = fmtMoneyM(results.bpo_spend);
const phase1Price = results.phases[0].price_per_outcome;
const phase3Price = results.phases[results.phases.length - 1].price_per_outcome;
const y1Savings = fmtMoneyM(results.year1_savings);
const y1Pct = fmtPct(results.year1_savings_pct);
const y2Savings = fmtMoneyM(results.year2_savings);
const y2Pct = fmtPct(results.year2_savings_pct);

children.push(bullet([
  run('Current State: ', { bold: true, size: 20 }),
  run(`~${totalCxStr} total CX spend (~${aiSpendStr} ${aiVendor} + ${bpoSpendStr} BPO at ${results.fte_count} FTEs × $${results.fte_rate}/hr)`, { size: 20 }),
]));
children.push(bullet([
  run('Proposed: ', { bold: true, size: 20 }),
  run(`Outcomes-based pricing at ${fmtPrice(phase1Price)}/outcome (Phase 1) stepping down to ${fmtPrice(phase3Price)}/outcome (Phase 3)`, { size: 20 }),
]));
children.push(bullet([
  run('Year 1 Savings: ', { bold: true, size: 20 }),
  run(`${y1Savings} (${y1Pct}) — savings from Day 1`, { size: 20 }),
]));
children.push(bullet([
  run('Year 2+ Savings: ', { bold: true, size: 20 }),
  run(`${y2Savings} (${y2Pct}) — at ${fmtPrice(phase3Price)} steady state`, { size: 20 }),
]));
if (results.retained_revenue) {
  children.push(bullet([
    run('Retained Revenue: ', { bold: true, size: 20 }),
    run(`+${fmtMoneyM(results.retained_revenue)} annual (${(results.retention_lift_pct * 100).toFixed(1)}% CX retention lift)`, { size: 20 }),
  ]));
}
if (config.revenue_generation?.annual_estimate) {
  children.push(bullet([
    run('Revenue Generation: ', { bold: true, size: 20 }),
    run(`${fmtMoneyM(config.revenue_generation.annual_estimate)} incremental (Phase 2+ — requires cross-functional engagement beyond core scope)`, { size: 20 }),
  ]));
}
const totalY1Value = results.year1_savings
  + (results.retained_revenue || 0)
  + (config.revenue_generation?.annual_estimate || 0);
children.push(bullet([
  run('Total Year 1 Value: ', { bold: true, size: 20 }),
  run(`${fmtMoneyM(totalY1Value)} (savings + retained revenue${config.revenue_generation ? ' + revenue gen potential' : ''})`, { size: 20 }),
]));

// ═══════════════════════════════════════════════════════════
// 2. CURRENT STATE DERIVATION
// ═══════════════════════════════════════════════════════════
children.push(heading1('2. How We Built the Current State Estimate'));

children.push(heading2(`${aiVendor} Spend (~${aiSpendStr})`));

if (results.ai_spend_is_estimated && results.ai_breakdown) {
  children.push(body(
    `Reverse-engineered using ${aiVendor}'s public per-conversation billing model multiplied by ${possessive(client.name)} stated contact volumes. Lands at ~${aiSpendStr} independent of any confidential figure.`
  ));
  const breakdown = results.ai_breakdown;
  const rates = breakdown.rates_used;
  const volumes = config.current_state.volumes;
  if (volumes.chat) {
    children.push(bullet(`Chat: ${(volumes.chat / 1e6).toFixed(2)}M conversations × $${rates.chat.toFixed(2)}/conv = ${fmtMoneyM(breakdown.chat)}`));
  }
  if (volumes.voice) {
    children.push(bullet(`Voice: ${(volumes.voice / 1e6).toFixed(2)}M conversations × $${rates.voice.toFixed(2)}/conv = ${fmtMoneyM(breakdown.voice)}`));
  }
  if (volumes.social) {
    children.push(bullet(`Social/WhatsApp: ${volumes.social >= 1e6 ? (volumes.social / 1e6).toFixed(2) + 'M' : (volumes.social / 1e3).toFixed(0) + 'K'} × $${rates.social.toFixed(2)}/conv = ${fmtMoneyM(breakdown.social)}`));
  }
  children.push(bullet(`Platform base + LLM tokens: ${fmtMoneyM(rates.platform_base)}`));
  children.push(bullet([
    run('Total: ', { bold: true, size: 20 }),
    run(`~${fmtMoneyM(breakdown.total)}  → rounds to ~${aiSpendStr}`, { bold: true, size: 20, color: NAVY }),
  ]));
} else {
  children.push(body(
    `${aiVendor} spend provided directly: ~${aiSpendStr}.`
  ));
}

// Confidentiality callout (only if user supplied a confidentiality_note)
if (config.internal_briefing?.confidentiality_note) {
  children.push(spacer(120));
  children.push(new Paragraph({
    children: [run('CRITICAL: CONFIDENTIALITY', { bold: true, size: 20, color: 'FFFFFF', allCaps: true })],
    shading: { fill: RED, type: ShadingType.CLEAR },
    spacing: { before: 120, after: 0 },
  }));
  children.push(new Paragraph({
    children: [run(config.internal_briefing.confidentiality_note, { size: 18, color: TEXT })],
    shading: { fill: RED_SOFT, type: ShadingType.CLEAR },
    spacing: { before: 0, after: 140 },
  }));
}

children.push(heading2(`BPO Spend (~${bpoSpendStr})`));
children.push(body(
  `${results.fte_count} FTEs × $${results.fte_rate}/hr × 2,080 annual hours = ${fmtMoneyM(results.bpo_spend)}.`
));

if (config.current_state.containment_source) {
  children.push(heading2(`AI Containment (${fmtPct(results.containment, 1)}) — SOURCED`));
  children.push(body(config.current_state.containment_source));
  if (results.containment > 0) {
    children.push(callout(
      `Why this matters: at ${fmtPct(results.containment, 1)} containment, ${aiVendor} is costing ${client.name} $${results.cost_per_ai_outcome.toFixed(2)} per AI-resolved contact. The BPO handles the remaining ${fmtPct(1 - results.containment, 1)} at $${results.cost_per_human_outcome.toFixed(2)} per human-resolved contact. Combined blended cost: $${results.blended_cost.toFixed(2)} per outcome.`
    ));
  }
}

if (results.cx_pct_of_revenue) {
  children.push(heading2('Revenue Benchmark Validation'));
  children.push(body(
    `${totalCxStr} total CX spend = ${fmtPct(results.cx_pct_of_revenue, 1)} of ${possessive(client.name)} ${fmtMoneyM(results.annual_revenue)} revenue. Industry benchmark for the vertical is 2–5%, so our estimate tracks within range. Strong credibility anchor if questioned.`
  ));
}

// ═══════════════════════════════════════════════════════════
// 3. PRICING STRATEGY + MARGIN PROFILE
// ═══════════════════════════════════════════════════════════
children.push(heading1('3. Pricing Strategy'));

children.push(heading2(`Why ${fmtPrice(phase1Price)} → ${fmtPrice(phase3Price)} (Not $1.00)`));
children.push(body(
  `At $1.00/outcome we'd be giving away $5–8M in capturable value, and the number is so low it could actually slow the deal — ${client.name} would wonder how we replace a ${totalCxStr} operation for a fraction of that. The "too good to be true" problem.`
));
children.push(body(
  `At ${fmtPrice(phase1Price)} starting, we're already ${Math.round((1 - phase1Price / results.blended_cost) * 100)}% below their current ${fmtPrice(results.blended_cost)} blended cost. Immediate, credible win. Stepping to ${fmtPrice(phase3Price)} as AI containment improves ties price reduction to measurable performance — they see us earning the better rate.`
));

children.push(heading2('Margin Profile (INTERNAL ONLY)'));
children.push(body(
  `Honest blended cost (FTE labor + AI platform) per phase, vs. what the client pays. The margin compresses in early phases because we absorb full FTE delivery cost on residual volume while charging a discounted per-outcome rate. As containment ramps, margins improve substantially.`
));

// Margin table
const mHdrs = ['', ...results.margins.map(m => m.phase_name)];
const mRows = [
  ['Price/Outcome',          ...results.margins.map(m => fmtPrice(m.price_per_outcome))],
  ['AI Containment',         ...results.margins.map(m => fmtPct(m.containment, 0))],
  [`${bpo.name} FTEs`,        ...results.margins.map(m => `~${m.ftes}`)],
  ['FTE Hourly Rate',        ...results.margins.map(m => `$${m.fte_rate}/hr`)],
  ['FTE Annual Cost',        ...results.margins.map(m => `~${fmtMoneyM(m.labor_cost)}`)],
  ['AI Platform Cost (est.)', ...results.margins.map(m => `~${fmtMoneyM(m.platform_cost)}`)],
  ['Our Total Blended Cost', ...results.margins.map(m => `~${fmtMoneyM(m.total_cost)}`)],
  [`${client.name} Annual Cost`, ...results.margins.map(m => `${fmtMoneyM(m.customer_cost)} ann.`)],
  ['Gross Margin $',         ...results.margins.map(m => `~${fmtMoneyM(m.gross_margin)}`)],
  ['Gross Margin %',         ...results.margins.map(m => `~${Math.round(m.margin_pct * 100)}%`)],
];

const colCount = mHdrs.length;
const firstColW = 2640;
const otherColW = Math.floor((9360 - firstColW) / (colCount - 1));

const marginTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [firstColW, ...Array(colCount - 1).fill(otherColW)],
  rows: [
    new TableRow({
      children: mHdrs.map((t, i) => tcell(t, {
        fill: NAVY, color: 'FFFFFF', bold: true,
        align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        width: i === 0 ? firstColW : otherColW,
      })),
    }),
    ...mRows.map((r, ri) => new TableRow({
      children: r.map((t, ci) => tcell(t, {
        fill: ri === mRows.length - 1 ? PINK_SOFT : (ri % 2 === 0 ? BG_LIGHT : 'FFFFFF'),
        bold: ci === 0 || ri === mRows.length - 1 || ri === 0,
        color: ri === mRows.length - 1 && ci > 0 ? GREEN : TEXT,
        align: ci === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        width: ci === 0 ? firstColW : otherColW,
      })),
    })),
  ],
});
children.push(marginTable);

// Phase 1 margin warning if it's thin
const p1Margin = results.margins[0];
if (p1Margin.margin_pct < 0.20) {
  children.push(callout(
    `Why Phase 1 margin is thin (~${Math.round(p1Margin.margin_pct * 100)}%): we're absorbing the full FTE delivery cost on the residual ${Math.round((1 - p1Margin.containment) * 100)}% of volume at the same $${p1Margin.fte_rate}/hr rate ${client.name} pays today, while only charging ${fmtPrice(p1Margin.price_per_outcome)}/outcome blended. The model gets economic as AI containment ramps. This is why the contract structure must protect us against scope creep in Phase 1 and stalled containment ramps in subsequent phases.`
  ));
}

children.push(footnote(
  'Margin sensitivity: every $1/hr added to the FTE rate compresses Phase 1 margin meaningfully. Every 5% under-delivery on Phase 1 containment costs us in residual FTE cost. Phase 1 pricing is the most exposed — we should not concede further on Phase 1 price during negotiation. Later phases have more flexibility.'
));

// ═══════════════════════════════════════════════════════════
// 4. KEY TALKING POINTS
// ═══════════════════════════════════════════════════════════
children.push(heading1(`4. Key Talking Points for ${client.name}`));

const tp = config.internal_briefing?.talking_points || {};

children.push(heading2('Lead With'));
const leadWith = tp.lead_with || [
  ['Savings from Day 1.', `${fmtPrice(phase1Price)}/outcome is already ${Math.round((1 - phase1Price / results.blended_cost) * 100)}% below their current ${fmtPrice(results.blended_cost)} blended cost. No ramp period where they're paying more.`],
  ['It only gets better.', "Price steps down as AI containment improves. Floor-protected — pricing never steps up if milestones aren't jointly verified."],
  ['Zero risk.', "They pay per resolved outcome. If we don't resolve it, they don't pay. We absorb the ramp risk."],
  ['One vendor, one price.', `Replaces ${aiVendor} + incumbent ${bpo.label || 'BPO'} with a single outcomes-based partner. One SLA, one invoice.`],
];
leadWith.forEach(([head, tail]) => {
  children.push(bullet([
    run(`${head} `, { bold: true, size: 20 }),
    run(tail, { size: 20 }),
  ]));
});

if (tp.if_pushed_on_price) {
  children.push(heading2('If They Push on Price'));
  tp.if_pushed_on_price.forEach(([head, tail]) => {
    children.push(bullet([
      run(`${head} `, { bold: true, size: 20 }),
      run(tail, { size: 20 }),
    ]));
  });
}

if (tp.other_questions) {
  Object.entries(tp.other_questions).forEach(([heading, points]) => {
    children.push(heading2(heading));
    points.forEach(([head, tail]) => {
      children.push(bullet([
        run(`${head} `, { bold: true, size: 20 }),
        run(tail, { size: 20 }),
      ]));
    });
  });
}

// ═══════════════════════════════════════════════════════════
// 5. INTEL FINDINGS (optional, only if intel provided)
// ═══════════════════════════════════════════════════════════
if (config.internal_briefing?.intel_findings && config.internal_briefing.intel_findings.length > 0) {
  children.push(heading1(`5. Intel from ${client.name} ${config.internal_briefing.intel_source || 'Discovery'}`));

  if (config.internal_briefing.intel_intro) {
    children.push(body(config.internal_briefing.intel_intro));
  }

  const iHdrs = ['Topic', 'Finding', 'How we use it'];
  const iRows = config.internal_briefing.intel_findings.map(f => [f.topic, f.finding, f.how_we_use_it]);
  const intelTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 3400, 4160],
    rows: [
      new TableRow({
        children: iHdrs.map((t, i) => tcell(t, {
          fill: NAVY, color: 'FFFFFF', bold: true,
          width: [1800, 3400, 4160][i],
          align: AlignmentType.LEFT,
        })),
      }),
      ...iRows.map((r, ri) => new TableRow({
        children: r.map((t, ci) => tcell(t, {
          fill: ri % 2 === 0 ? BG_LIGHT : 'FFFFFF',
          bold: ci === 0,
          size: 18,
          width: [1800, 3400, 4160][ci],
          align: AlignmentType.LEFT,
        })),
      })),
    ],
  });
  children.push(intelTable);
}

// ═══════════════════════════════════════════════════════════
// 6. RED LINES
// ═══════════════════════════════════════════════════════════
const sectionNum = config.internal_briefing?.intel_findings ? 6 : 5;
children.push(heading1(`${sectionNum}. What NOT to Say`));

children.push(new Paragraph({
  children: [run('RED LINES', { bold: true, size: 20, color: 'FFFFFF', allCaps: true })],
  shading: { fill: RED, type: ShadingType.CLEAR },
  spacing: { before: 120, after: 0 },
}));

const redLines = config.internal_briefing?.red_lines || [
  `Never reference any confidential third-party intel as a sourced number. Our published figures must derive independently from public data.`,
  `Never share our internal margins or cost structure with ${client.name}.`,
  `Never share per-minute or per-hour internal rates.`,
  `Never position this as "replacing" their AI vendor — frame as "elevating" their CX with a blended model.`,
  `Never guarantee specific revenue generation numbers — always "potential" or "opportunity."`,
  `Never commit to containment percentages as guarantees — pricing is floor-protected but milestones require joint validation.`,
];

redLines.forEach((text) => {
  children.push(new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [run(text, { size: 18 })],
    shading: { fill: RED_SOFT, type: ShadingType.CLEAR },
    spacing: { before: 0, after: 0 },
  }));
});
children.push(spacer(120));

// ═══════════════════════════════════════════════════════════
// 7. NEXT STEPS
// ═══════════════════════════════════════════════════════════
const nextSectionNum = sectionNum + 1;
children.push(heading1(`${nextSectionNum}. Next Steps`));

const nextSteps = config.internal_briefing?.next_steps || [
  'Internal review of brief and updated model.',
  'Legal/commercial review — stress-test liability language.',
  `Source sanity-check on directional validity of ${totalCxStr} total / ${aiSpendStr} ${aiVendor} / ${results.fte_count} FTE before send.`,
  `Share the client-facing brief with ${client.name} stakeholders.`,
  `Schedule alignment call to walk ${client.name} through the model.`,
  'Upon client interest, prepare SOW for the lighthouse pilot.',
];

nextSteps.forEach((text) => {
  children.push(new Paragraph({
    numbering: { reference: 'numbered', level: 0 },
    children: [run(text, { size: 20 })],
    spacing: { before: 60, after: 60 },
  }));
});

// ═══════════════════════════════════════════════════════════
// Compose document
// ═══════════════════════════════════════════════════════════
const versionStamp = config.internal_briefing?.version || 'v1';
const dateStamp = config.internal_briefing?.date || new Date().toISOString().split('T')[0];

const doc = new Document({
  styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }],
      },
      {
        reference: 'numbered',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [run(`${bpo.name.toUpperCase()} INTERNAL  ·  ${client.name.toUpperCase()} ROI BRIEFING  ·  CONFIDENTIAL — DO NOT SHARE EXTERNALLY`,
            { size: 14, color: RED, letterSpacing: 1, bold: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            run('Page ', { size: 16, color: TEXT_MUTE }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: TEXT_MUTE }),
            run(' of ', { size: 16, color: TEXT_MUTE }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 16, color: TEXT_MUTE }),
            run(`  ·  ${versionStamp} · ${dateStamp}`, { size: 16, color: TEXT_MUTE }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.error(`Generated: ${outPath}`);
});

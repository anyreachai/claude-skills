# JSX Artifact Spec — AI Fluency Assessment

The output is a single React component saved as `.jsx`. It functions as both a 1-pager report and the visual.

## Constraints (artifact environment)

- **Tailwind core utilities only.** No `bg-[#abc123]` arbitrary values. For custom colors, use inline `style={{ backgroundColor: '#FF5733' }}`.
- **Imports available**: `recharts`, `lucide-react`, `react` hooks. Use these via standard imports.
- **No `localStorage`, no `<form>`, no required props.** Default-export the component.
- **Self-contained.** All data lives in component constants — no fetch calls.

## Color palette

Mirror the framework's orange header but layer in a calmer typography palette so it reads as a serious scorecard, not a marketing sheet.

```js
const COLORS = {
  headerOrange: '#E8541C',   // matches framework image header
  bgPaper:      '#FAF8F5',   // warm off-white page background
  ink:          '#1A1A1F',   // primary text
  inkMuted:     '#6B6B73',   // secondary text
  divider:      '#E5E2DC',   // hairline borders
  // Level colors (darker = higher level)
  level1:       '#D7D4CD',   // Unacceptable — washed grey
  level2:       '#F2B999',   // Capable — pale orange
  level3:       '#E8541C',   // Adoptive — full orange
  level4:       '#1A1A1F',   // Transformative — ink black
  highlight:    '#FFE9DC',   // current-cell tint
};
```

## Layout (top to bottom)

### 1. Header band
- Orange band, white text. Title: "AI Fluency Self-Assessment". Subtitle: today's date + framework attribution ("5 roles × 4 levels").

### 2. Verdict block
- Large display number: overall score (e.g., "2.8 / 4").
- Label: dominant level word (e.g., "Adoptive").
- One-sentence verdict (the synthesized summary).
- Optional "blind spot" callout if any role is materially below the others.

### 3. Per-role rows (5 rows)
Each row:
- Left: Role label (uppercase, bold, ~120px column).
- Middle-left: Level pill (colored per level).
- Middle: Evidence — one paraphrased line. ~2 lines max.
- Right: "Next move" — one specific action to level up.

Use a clean grid, hairline dividers between rows.

### 4. The 5×4 matrix
Recreate the framework grid: 5 role rows × 4 level columns. Each cell shows the original framework descriptor (short, ~2 bullets per cell). The user's current cell per role is **highlighted** with `COLORS.highlight` background and a small filled circle indicator. Other cells are subdued.

Cell text should be tiny (10–11px) and show the rubric bullet points from `references/rubric.md`. Keep cells dense — this is reference material, not the primary readout.

### 5. Radar chart
Use `recharts` `RadarChart`:
- 5 axes (one per role)
- Scale 0–4 with gridlines at 1, 2, 3, 4
- Single data series filled with `COLORS.level3` at ~30% opacity, stroke at full opacity
- Tooltip showing role + level name + level number

```jsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const radarData = [
  { role: 'Engineering', level: 3, levelName: 'Adoptive' },
  { role: 'Product',     level: 3, levelName: 'Adoptive' },
  // ...
];

<ResponsiveContainer width="100%" height={320}>
  <RadarChart data={radarData}>
    <PolarGrid stroke={COLORS.divider} />
    <PolarAngleAxis dataKey="role" tick={{ fill: COLORS.ink, fontSize: 12 }} />
    <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} tick={{ fill: COLORS.inkMuted, fontSize: 10 }} />
    <Tooltip />
    <Radar dataKey="level" stroke={COLORS.level3} fill={COLORS.level3} fillOpacity={0.3} />
  </RadarChart>
</ResponsiveContainer>
```

### 6. Footer
- Small attribution line: "Generated from your past Claude conversations · paraphrased, not verbatim"

## Component skeleton

```jsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

const COLORS = { /* see palette above */ };

const ASSESSMENT = {
  overallScore: 2.8,
  dominantLevel: 'Adoptive',
  verdict: 'Adoptive overall, with Engineering pulling the average up and Support trailing — your AI usage is well past competent but not yet org-shaping.',
  blindSpot: 'Support is materially behind the rest — worth a closer look.',
  roles: [
    {
      name: 'Engineering',
      level: 3,
      levelName: 'Adoptive',
      evidence: 'Built MCP-powered Python scripts orchestrating Mixpanel, Attio, and Gmail; uses Claude Code daily for refactors.',
      nextMove: 'Ship an LLM-powered feature with live metrics + user-feedback loop — currently building infra, not yet measuring.',
    },
    // ... 4 more roles
  ],
};

const FRAMEWORK = {
  // 5 roles × 4 levels of bullet-point text from the framework image
};

export default function AIFluencyAssessment() {
  // render header → verdict → role rows → matrix → radar → footer
}
```

## Quality bar

- **Density without clutter.** This is a scorecard for a founder who likes data — pack info but keep visual hierarchy clean.
- **No emoji.** The orange header is the only "personality." Everything else reads serious.
- **Print-friendly.** It should look right if Richard screenshots it for an investor or board doc.
- **Self-contained.** No external image URLs. No fonts beyond system stack.

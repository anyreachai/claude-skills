---
name: ai-fluency-assessment
description: Generate an AI fluency self-assessment scorecard based on a 5-role × 4-level framework (Engineering, Product, Support, People/HR, Marketing × Unacceptable, Capable, Adoptive, Transformative). Searches the user's past Claude conversations to find evidence of how they actually use Claude (chat, Code, etc.), grades each role with citations, and produces a single JSX artifact that is both a 1-pager report and a visual — overall verdict, per-role evidence + rationale, the 5×4 matrix with current position highlighted, a radar chart, and "what's next" moves to level up. Use whenever Richard asks for an AI fluency self-assessment, AI maturity check, AI proficiency scorecard, AI usage audit, "where do I stand on AI", "how AI-fluent am I", "grade my AI usage", "score my Claude usage", or any variant of assessing how good he is at using AI/Claude across functions. Trigger even for partial requests like "rate me on AI" or "am I using Claude well" since the full multi-role assessment is what produces a useful answer.
---

# AI Fluency Self-Assessment

Produces a one-pager scorecard + visualization grading Richard's AI fluency across **5 roles × 4 levels**, grounded in evidence from his actual past Claude conversations.

## Output

A **single JSX artifact** that combines:
1. **Header + overall verdict** (one-line summary, dominant level, overall score)
2. **Per-role rows**: role label, assigned level, evidence snippet from past chats, "next move" to level up
3. **The 5×4 matrix** (mirroring the framework image) with the user's current cell highlighted per role
4. **Radar chart** plotting the 5 roles on a 1–4 scale (Unacceptable=1, Capable=2, Adoptive=3, Transformative=4)

## Workflow

### Step 1 — Gather evidence (parallel `conversation_search` calls)

Run **5 `conversation_search` calls in a single turn** (one per role) to collect evidence of how the user actually uses Claude. Use the keyword sets below. Set `max_results=10` per call. Then optionally one `recent_chats` call (n=10) to skim the last few weeks.

Search query suggestions per role:

- **Engineering**: `Claude Code python script` (also try: `debug code`, `pull request`, `function refactor`)
- **Product**: `PRD product spec` (also try: `roadmap feature`, `user research`)
- **Support**: `customer support ticket` (also try: `CX automation`, `triage workflow`)
- **People/HR**: `hiring interview candidate` (also try: `recruiting funnel`, `onboarding doc`)
- **Marketing**: `marketing campaign content` (also try: `social post draft`, `landing page copy`, `blog`)

If a role returns zero/weak hits, **do not invent evidence**. Mark that role as "Insufficient signal" and either (a) ask the user 2 targeted questions for that role, or (b) grade conservatively at "Unacceptable" or "Capable" with a note that more evidence would refine the call. Default to (a) unless the user has signaled they want a fully automatic run.

### Step 2 — Grade each role against the rubric

Read `references/rubric.md` for the full 5×4 evidence patterns. For each role:

1. List 2–4 concrete behaviors observed in the search results (e.g., "asked Claude to write a Python script that calls Mixpanel MCP and produces a PDF — Adoptive-level orchestration").
2. Match those behaviors to the level whose pattern they best fit. A role is at level N if **most** of its evidence fits N's pattern, even if there are stray higher- or lower-level signals.
3. Pick **one short evidence snippet** (2–3 lines, paraphrased) to show in the JSX. Do not quote past chats verbatim — paraphrase.
4. Note **one concrete "next move"** to reach the next level up (drawn from the level-N+1 pattern in the rubric).

Be honest. If the evidence shows strong signal at one level but the user occasionally does something more advanced, stay at the level the bulk of evidence supports. The framework rewards consistent practice, not one-off heroics.

### Step 3 — Compute overall score

- Map levels to numbers: Unacceptable=1, Capable=2, Adoptive=3, Transformative=4.
- Overall score = average across the 5 roles, rounded to one decimal.
- Dominant level = the modal level (or the floor of the average if tied).
- Overall verdict line = single sentence summarizing the founder's AI fluency stance, e.g., *"Adoptive overall, with Engineering pulling the average up and Support trailing — your AI usage is well past competent but not yet org-shaping."*

### Step 4 — Render the JSX artifact

Save to `/mnt/user-data/outputs/ai-fluency-assessment.jsx`. The artifact should be a single React component with no required props and a default export. See `references/jsx-spec.md` for the layout, color tokens, and chart implementation details.

Critical JSX requirements (from artifact constraints):
- Use only Tailwind core utility classes (no arbitrary values like `bg-[#abc123]` — use inline `style` for custom colors).
- Use `recharts` for the radar chart.
- Use `lucide-react` for any icons.
- No `localStorage`, no `<form>` tags.
- No required props; default export the component.

After creating the file, call `present_files` so it renders inline.

## Tone and framing

- Address the reader as "you" — this is a self-assessment.
- Be direct and data-grounded, not flattering. Richard prefers blunt analysis over diplomatic hedging.
- The verdict line should *say something*, not hedge. If the evidence says he's Adoptive in Marketing but Capable in Support, name it.
- Include a short "blind spots" callout if any role is graded materially lower than the others — surface the gap rather than burying it.

## Founder lens note

Richard wears all 5 hats as a founder. The assessment is **how AI-fluently he operates in each function**, not whether he has a dedicated person for it. Someone who never does any HR work in Claude isn't "Unacceptable" at HR — they're "no signal." Distinguish:

- **Active practice with weak technique** → grade per rubric.
- **No engagement at all** → mark "no signal," grade conservatively or ask follow-ups.

## Reference files

- `references/rubric.md` — Full 5×4 framework with detailed evidence patterns per cell.
- `references/jsx-spec.md` — JSX artifact layout spec, colors, radar chart implementation, matrix highlighting logic.

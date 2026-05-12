# AI Fluency Rubric — 5 Roles × 4 Levels

Use this rubric to grade evidence for each role. Match the bulk of the user's observed behaviors to the closest level pattern.

---

## Levels

- **Unacceptable (1)** — AI-skeptical, manual-everything, no curiosity.
- **Capable (2)** — Uses AI for first drafts and summarization. Knows the basics. Hand-edits everything.
- **Adoptive (3)** — Builds workflows, chains tools, measures outcomes, tracks ROI. AI is part of the operating system.
- **Transformative (4)** — Ships AI-powered products/processes that change the org's economics. Sets policy, trains others.

---

## ENGINEERING

### Unacceptable
- Calls AI coding assistants "too risky"
- Has never tested AI-generated code
- Relies only on Stack Overflow snippets

### Capable
- Uses ChatGPT/Copilot/etc for simple coding tasks (regex, unit-test stubs)
- Can explain how they prompt, review, and validate AI output

### Adoptive
- Chains LLM calls with fallback + retry logic
- Adds eval tests to flag hallucinations
- Knows Claude Code, Cursor, Windsurf, etc
- Can walk interviewers through prompt tweaks, token limits, code-review patterns

### Transformative
- Ships LLM-powered features, monitors live metrics, refines based on user feedback
- Builds an AI-first dev pipeline (guardrails, RAG docs, evals) that cuts down PR cycle time

**Evidence patterns to look for:** Use of Claude Code, MCP integrations, multi-step Python scripts, debugging sessions, PR-related work, building agents/pipelines, eval harnesses, voice AI infra (DualTurn, turn-taking research).

---

## PRODUCT

### Unacceptable
- Dismisses AI as hype, showing no curiosity about user value
- PRDs and prototypes lack any AI concepts or experiments

### Capable
- Uses ChatGPT to draft PRDs, story maps, synthesizes user-interview notes
- Knows basics (LLMs, embeddings, latency vs. cost) and can share example prompt patterns

### Adoptive
- Ships an AI-powered feature with a clear "human-in-the-loop" check
- Chooses models based on accuracy, latency, throughput, and context-window constraints
- Demonstrates ROI (e.g., cut time-to-insight from 5 days to 3)

### Transformative
- Builds/drives product strategy & org-wide AI roadmap through eval-first product development
- Launches a proprietary fine-tuned LLM feature that opens up a new pricing tier

**Evidence patterns to look for:** PRD drafts, product strategy work, AI feature scoping, model selection decisions, ROI math, agent builder discussions, AI-first roadmap conversations, productizing AI workflows.

---

## SUPPORT

### Unacceptable
- Refuses to use AI for support workflows
- Has zero automation skills (no rules, macros, bots)
- Manually handles every ticket

### Capable
- Summarizes tickets with ChatGPT and cites faster context shifts
- Knows and follows Security / TSO approval flow before trying new tools

### Adoptive
- Builds Zapier-style workflows that triage queues and auto-tag CRM records
- Tracks CX metrics, refines prompts when AI misreads tone, keeps living doc of what works

### Transformative
- Rolls out an org-wide AI triage bot that cuts first-response time by 25%
- Creates & presents ROI dashboards balancing cost vs. customer experience in quarterly planning

**Evidence patterns to look for:** Customer support automation, ticket triage workflows, voice agent deployment for CX, BPO partnerships, contact center AI work, support-related Anyreach product discussions, CX metrics analysis.

---

## PEOPLE / HR

### Unacceptable
- Distrusts all AI hiring tools
- Screens each resume one-by-one
- Relies on manual scheduling and candidate follow-ups

### Capable
- Drafts interview guides & summarizes panels with ChatGPT, saving ~2 hours/week
- Can explain privacy limits (e.g., no PII in public models)

### Adoptive
- Automates onboarding docs; runs LLM resume-screen with bias checks, yielding 3× faster shortlists
- Measures time-to-hire gains and refines prompts for under-represented talent pools

### Transformative
- Revamps recruiting funnel with AI to shorten time-to-hire by 30%
- Trains HRBPs on safe AI and shapes company policy on ethical hiring AI

**Evidence patterns to look for:** Hiring assistance, candidate screening, interview prep, onboarding docs, resume analysis, recruiting funnel work, HR policy discussions, advisor agreement structuring.

---

## MARKETING

### Unacceptable
- Runs campaigns without AI-driven A/B tests or content variants
- Ignores AI tools for analytics, personalization, or audience insights

### Capable
- Uses AI to summarize customer stories
- Drafts first drafts of social posts and headlines with AI, then edits by hand

### Adoptive
- Runs a basic AI stack and A/B-tests copy to increase CTR
- Audits biased language and optimizes prompt libraries

### Transformative
- Builds an AI-driven campaign engine to personalize content at scale
- Leads quarterly AI trainings, sets tooling roadmap, speaks at industry events on AI-powered growth

**Evidence patterns to look for:** Content drafting, blog/LinkedIn posts, sales decks, marketing copy, brand positioning, audience research, campaign work, thought leadership generation, landing page copy.

---

## Grading heuristics

1. **Bulk of evidence wins.** A single Transformative-level act doesn't elevate a role that's mostly Capable.
2. **No signal ≠ Unacceptable.** If the user simply doesn't operate in a function, mark "no signal" and ask follow-ups.
3. **Founder lens.** Richard wears all 5 hats. Even if HR is light, look for hiring-related Claude usage as the proxy.
4. **Recency weights more.** Patterns from the last 2 months count more than older one-offs.
5. **Be specific.** When citing evidence, name the actual behavior (e.g., "shipped voice AI agent with eval harness") rather than vague "uses AI a lot."

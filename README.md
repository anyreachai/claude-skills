# Anyreach Claude Skills

Shared Claude Code skills and slash commands for the Anyreach team. When you describe a task, Claude Code matches it to the right skill and executes the full workflow.

## Quick Start

```bash
git clone https://github.com/anyreachai/claude-skills.git
```

Then copy (or symlink) the skills and commands you need into your `~/.claude/` directory:

```
~/.claude/
  skills/
    account-brief-generator/SKILL.md
    calls/SKILL.md
    ...
  commands/
    financial-report.md
    burn-check.md
    ...
```

Claude Code automatically picks up skills from `~/.claude/skills/` and commands from `~/.claude/commands/`.

---

## Skills Catalog (19 skills)

### Research & Intelligence

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[company-deep-research](skills/company-deep-research/)** | "deep research on [company]", "GTM analysis", "company deep dive" | Branded .docx report — overview, history, divisions, GTM, competitive landscape, key personnel |
| **[stakeholder-intel](skills/stakeholder-intel/)** | "research [person]", "what makes [person] tick", "prep me for [person]" | Branded PDF — career arc, psychological profile, public positions, tactical playbook |
| **[competitor-deep-dive](skills/competitor-deep-dive/)** | "analyze [company]", "competitive report", "battle card" | Branded PDF white paper — user reviews, employee sentiment, pricing, market position |
| **[brand-style-extractor](skills/brand-style-extractor/)** | "extract brand info from [URL]", "what's their brand style?" | Structured .md style guide — voice, typography, colors, logo, imagery, patterns |

### Sales & Deal Execution

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[account-brief-generator](skills/account-brief-generator/)** | "prep me for a call with [company]", "give me everything on [company]" | Branded .docx meeting brief — timeline, contacts, use cases, commercial terms, strategy |
| **[proposal-sow-generator](skills/proposal-sow-generator/)** | "generate a proposal for [company]", "create the SoW", "scope this out" | Branded PDF proposal + integration flowchart |
| **[calls](skills/calls/)** | "analyze this call", "score this meeting", "call debrief" | Branded PDF — sentiment, engagement, seller performance, psychoanalysis, inflection analysis |
| **[meeting-recap-email](skills/meeting-recap-email/)** | "recap that meeting", "send a follow-up", "email the recap" | Drafted email to attendees via Gmail/message_compose |

### Legal & Contracts

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[legal-review](skills/legal-review/)** | "review this contract", "check the redline", "are we protected?" | Structured analysis — dealbreakers, must-fix, counter-language, edge cases |

### Analytics & Reporting

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[anyreach-funnel-analysis](skills/anyreach-funnel-analysis/)** | "run the funnel analysis", "check conversion rates", "how's the funnel?" | PDF report — acquisition, onboarding, activation metrics, dropoffs, recommendations |
| **[demo-bot-usage-report](skills/demo-bot-usage-report/)** | "create a usage report from this CSV", "analyze the bot calls", "build a partner report" | Branded 10-page PDF — topics, duration, capabilities, sentiment, verbatim quotes, partner takeaways |
| **[cx-intel-report-pdf](skills/cx-intel-report-pdf/)** | "generate CX report", "consumer intelligence report" | 12-section PDF — executive summary through strategic recommendations |
| **[cx-intel-report-xlsx](skills/cx-intel-report-xlsx/)** | "generate the XLSX", "create the data export" | 5-sheet Excel workbook — reviews, themes, benchmarking, competitor deep dives |
| **[leverage-analysis](skills/leverage-analysis/)** | "who has leverage?", "quantify power dynamics", "score the relationship" | Interactive React dashboard — leverage scoring, financial exposure, game theory |
| **[maturity-assessment](skills/maturity-assessment/)** | "how mature are our ops?", "enterprise readiness", "benchmark our SOPs" | Interactive React dashboard — maturity by domain vs funding stage norms |

### Content & Presentations

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[richard-thought-leadership](skills/richard-thought-leadership/)** | "help me write about [topic]", "draft a LinkedIn post", "thought leadership" | Long-form articles, LinkedIn posts, memos in Richard's voice |
| **[narrative-deck](skills/narrative-deck/)** | "build a pitch deck", "narrative deck", "investor deck" | Storyboard-first deck in 3 modes: Outrage (BPOs), Empathy (enterprise), Paradigm (investors) |
| **[shadcn-deck](skills/shadcn-deck/)** | "create a deck for [client]", "branded presentation", "clean slides" | Polished .pptx with shadcn/Tailwind design system + client brand theming |

### DevOps

| Skill | Trigger Phrases | Output |
|---|---|---|
| **[deploy-intel](skills/deploy-intel/)** | "deploy intel bot", "push intel to cloud run" | Cloud Run deployment of intel-email-bot |

---

## Slash Commands (5 commands)

| Command | Description |
|---|---|
| `/financial-report` | Full CEO Financial Health Report — reads Gusto, Mercury, QuickBooks, Wise CSVs and generates a complete financial analysis |
| `/burn-check` | Quick burn rate and runway check — cash, revenue, costs, net burn, runway, zero cash date |
| `/pipeline-update` | Update deal pipeline and recalculate all 4 scenarios with probability-weighted forecasts |
| `/blog-audit` | Deep audit of all 130 BPO Insights blog posts — source format, manifest, outputs, cross-reference |
| `/sync-skills` | Sync skills from `Desktop/Skills/` to this repo — extracts `.skill` ZIPs, maps `.txt` references, updates docs, commits & pushes |

---

## How It Works

Each skill is a `SKILL.md` file that tells Claude Code exactly how to execute a workflow. Skills can include:

- **Frontmatter** (`name`, `description`) — Claude uses the description to match your request to the right skill
- **Step-by-step workflow** — the exact sequence of actions to perform
- **References** (`references/` folder) — templates, frameworks, query definitions, design systems

When you describe a task, Claude Code reads the `CLAUDE.md` skill router, identifies the matching skill, reads its `SKILL.md` and references, then executes the workflow.

---

## Adding a New Skill

1. Create a new directory under `skills/` with your skill name
2. Add a `SKILL.md` with frontmatter (`name`, `description`) and the full workflow
3. Add any reference files in a `references/` subfolder
4. Update `CLAUDE.md` to include the new skill in the router table
5. Copy the skill to `~/.claude/skills/` on any machine that needs it

---

## Repository Structure

```
claude-skills/
├── CLAUDE.md                              # Skill router — Claude reads this to match tasks
├── README.md                              # This file
├── skills/
│   ├── account-brief-generator/           # Meeting prep briefs
│   ├── anyreach-funnel-analysis/          # Mixpanel funnel analysis
│   ├── brand-style-extractor/             # Website → brand guide
│   ├── calls/                             # Sales call analysis (3 modes)
│   ├── company-deep-research/             # Company GTM research
│   ├── competitor-deep-dive/              # Competitor battle cards
│   ├── demo-bot-usage-report/              # Bot usage report from CSV
│   ├── cx-intel-report-pdf/               # Consumer intel PDF
│   ├── cx-intel-report-xlsx/              # Consumer intel XLSX
│   ├── deploy-intel/                      # Cloud Run deployment
│   ├── legal-review/                      # Contract analysis
│   ├── leverage-analysis/                 # Negotiation leverage
│   ├── maturity-assessment/               # Ops maturity scoring
│   ├── meeting-recap-email/               # Meeting follow-up emails
│   ├── narrative-deck/                    # Pitch deck storyboarding
│   ├── proposal-sow-generator/            # Proposal & SoW PDFs
│   ├── richard-thought-leadership/        # Thought leadership content
│   ├── shadcn-deck/                       # Branded presentations
│   └── stakeholder-intel/                 # Person research PDFs
└── commands/
    ├── blog-audit.md                      # /blog-audit
    ├── burn-check.md                      # /burn-check
    ├── financial-report.md                # /financial-report
    ├── pipeline-update.md                 # /pipeline-update
    └── sync-skills.md                     # /sync-skills
```

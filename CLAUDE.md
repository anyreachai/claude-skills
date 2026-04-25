# Anyreach Claude Skills & Commands

This repo contains the team's shared Claude Code skills and slash commands. When a team member describes a task, match it to the right skill and execute.

## Skill Router — Match Tasks to Skills

Use this table to identify which skill to use. Read the skill's `SKILL.md` before executing.

### Research & Intel

| If the user wants to... | Use this skill |
|---|---|
| Research a company's business, GTM, divisions, or competitive positioning | `skills/company-deep-research/` |
| Research a person, stakeholder, or decision-maker (LinkedIn, career, psychology) | `skills/stakeholder-intel/` |
| Analyze a competitor and generate a battle card or white paper | `skills/competitor-deep-dive/` |
| Extract brand style/identity from a company's website | `skills/brand-style-extractor/` |

### Sales & Deal Execution

| If the user wants to... | Use this skill |
|---|---|
| Prep for a meeting — pull together everything on a company/contact | `skills/account-brief-generator/` |
| Generate a Proposal or Statement of Work from a transcript | `skills/proposal-sow-generator/` |
| Analyze a sales call transcript (sentiment, scoring, performance) | `skills/calls/` |
| Before & After inflection point analysis of a strategic move | `skills/calls/` (mode 2: inflection) |
| Psychoanalyze stakeholders from a call transcript | `skills/calls/` (mode 3: psychoanalysis) |
| Send a meeting recap email to attendees | `skills/meeting-recap-email/` |

### Legal & Contracts

| If the user wants to... | Use this skill |
|---|---|
| Review, redline, or negotiate a contract/MSA/SOW/NDA | `skills/legal-review/` |

### Analytics & Reporting

| If the user wants to... | Use this skill |
|---|---|
| Run end-to-end funnel analysis from Mixpanel data | `skills/anyreach-funnel-analysis/` |
| Generate a demo bot usage report PDF from a conversations CSV | `skills/demo-bot-usage-report/` |
| Generate a Consumer Intelligence PDF from review data | `skills/cx-intel-report-pdf/` |
| Generate the companion XLSX data export for a CX Intel report | `skills/cx-intel-report-xlsx/` |
| Quantify leverage/power dynamics in a negotiation | `skills/leverage-analysis/` |
| Assess Anyreach's operational maturity / enterprise readiness | `skills/maturity-assessment/` |

### Content & Presentations

| If the user wants to... | Use this skill |
|---|---|
| Write thought leadership content in Richard's voice | `skills/richard-thought-leadership/` |
| Build a narrative pitch deck (storyboard-first framework) | `skills/narrative-deck/` |
| Create a polished shadcn-style branded presentation | `skills/shadcn-deck/` |

### DevOps

| If the user wants to... | Use this skill |
|---|---|
| Deploy the intel-email-bot to Cloud Run | `skills/deploy-intel/` |

## Slash Commands

| Command | What it does |
|---|---|
| `/financial-report` | Full CEO Financial Health Report (Gusto + Mercury + QuickBooks + Wise) |
| `/burn-check` | Quick burn rate and runway check |
| `/pipeline-update` | Update deal pipeline and recalculate scenarios |
| `/blog-audit` | Deep audit of all 130 BPO Insights blog posts |

## How to Use a Skill

1. Match the task to a skill using the tables above
2. Read the skill's `SKILL.md` file — it contains the full workflow
3. If the skill has a `references/` folder, read those files too (templates, frameworks, queries)
4. Follow the skill's step-by-step instructions exactly

## Installation

To install these skills for your Claude Code instance:

```bash
# Clone the repo
git clone https://github.com/anyreachai/claude-skills.git

# Symlink skills into your Claude config
# macOS/Linux:
ln -s $(pwd)/claude-skills/skills/* ~/.claude/skills/
ln -s $(pwd)/claude-skills/commands/* ~/.claude/commands/

# Windows (run as admin):
# Copy skills into %USERPROFILE%\.claude\skills\
# Copy commands into %USERPROFILE%\.claude\commands\
```

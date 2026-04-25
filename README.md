# Claude Skills & Commands

Custom [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills and slash commands for Anyreach workflows.

## Skills

| Skill | Description |
|-------|-------------|
| [deploy-intel](skills/deploy-intel/SKILL.md) | Deploy the intel-email-bot to Cloud Run |
| [inflection-analysis](skills/inflection-analysis/SKILL.md) | Sales call transcript analysis with psychoanalysis, sentiment tracking, engagement scoring, and Before & After inflection point analysis — outputs a branded PDF report |

## Commands

| Command | Description |
|---------|-------------|
| [/financial-report](commands/financial-report.md) | Full CEO Financial Health Report from Gusto, Mercury, QuickBooks, and Wise data |
| [/burn-check](commands/burn-check.md) | Quick burn rate and runway check |
| [/pipeline-update](commands/pipeline-update.md) | Update deal pipeline and recalculate scenarios |
| [/blog-audit](commands/blog-audit.md) | Deep audit of all 130 BPO Insights blog posts |

## Usage

**Skills** go in `~/.claude/skills/<name>/SKILL.md` and are invoked automatically when Claude detects a matching trigger.

**Commands** go in `~/.claude/commands/<name>.md` and are invoked with `/<name>` in Claude Code.

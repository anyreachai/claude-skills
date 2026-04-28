Sync skills from Desktop/Skills to the anyreachai/claude-skills GitHub repo.

## Instructions

### 1. Pull latest from remote

```bash
cd ~/claude-skills && git checkout master && git pull origin master
```

### 2. Extract and sync `.skill` files

For each `.skill` file in `C:\Users\Lin Richard\Desktop\Skills\`:

1. The `.skill` file is a ZIP archive. Extract it to a temp location:
   ```bash
   unzip -o "~/Desktop/Skills/<name>.skill" -d /tmp/skill-extract/
   ```
2. The ZIP contains `<name>/SKILL.md`. Copy it into the repo:
   ```bash
   mkdir -p ~/claude-skills/skills/<name>/
   cp /tmp/skill-extract/<name>/SKILL.md ~/claude-skills/skills/<name>/SKILL.md
   ```
3. If the ZIP contains a `references/` folder or other files beyond SKILL.md, copy those too.

### 3. Handle `.txt` skill files

Some skills live as `.txt` files in `Desktop/Skills/` (e.g., narrative deck modes, CX intel report templates, legal review). These are reference files for existing skills. Check each `.txt` file and determine which skill it belongs to based on its content. If it's a standalone skill, create a `skills/<name>/SKILL.md` from it. If it's a reference file for an existing skill, place it in `skills/<parent-skill>/references/`.

Known mappings:
- `CX intel report pdf.txt` → `skills/cx-intel-report-pdf/SKILL.md`
- `CX intel report xlsx skill.txt` → `skills/cx-intel-report-xlsx/SKILL.md`
- `legal skill.txt` → `skills/legal-review/SKILL.md`
- `Mode A — Outrage*.txt` → `skills/narrative-deck/references/mode-a-outrage.md`
- `Mode B — Empathy*.txt` → `skills/narrative-deck/references/mode-b-empathy.md`
- `Mode C — Paradigm*.txt` → `skills/narrative-deck/references/mode-c-paradigm.md`
- `PDF_TEMPLATE.md` → reference file for cx-intel-report-pdf or demo-bot-usage-report (check content)
- `QUOTE_EXTRACTION.md` → reference file (check content to determine parent skill)

### 4. Also sync any installed skills

Check `~/.claude/skills/` for skills not sourced from `Desktop/Skills/` (e.g., `deploy-intel`). If they exist in `~/.claude/skills/` but not in `~/claude-skills/skills/`, copy them into the repo too.

### 5. Diff and report

Run `git status` and `git diff --stat` in the repo. Show the user:
- New skills being added
- Skills being updated (changed content)
- Skills in the repo that have NO local source (orphans)

### 6. Update CLAUDE.md router table

Read the current `~/claude-skills/CLAUDE.md`. For any NEW skills being added, add them to the appropriate section of the skill router table. Read each new skill's SKILL.md to determine the right category and description.

### 7. Update README.md catalog

Similarly update `~/claude-skills/README.md` — add new skills to the Skills Catalog table with trigger phrases and output descriptions.

### 8. Commit and push

Ask the user to confirm before pushing. Then:

```bash
cd ~/claude-skills
git add -A
git commit -m "sync: update skills from Desktop/Skills"
git push origin master
```

### 9. Report

Show a summary of what was synced:
- Skills added (new)
- Skills updated (changed)
- Total skill count in repo

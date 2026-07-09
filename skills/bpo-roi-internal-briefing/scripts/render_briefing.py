#!/usr/bin/env python3
"""
Orchestrator for the BPO Internal Briefing skill.

Reads a config JSON (same schema as bpo-roi-brief, plus optional
internal_briefing section), runs the math + margin profile, and hands off
to the Node DOCX generator.

Usage:
    python render_briefing.py <config.json> <output.docx>
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import internal_math as im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('config', help='Path to brief config JSON')
    ap.add_argument('output', help='Path to output DOCX')
    args = ap.parse_args()

    config_path = Path(args.config).resolve()
    out_path = Path(args.output).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(config_path) as f:
        config = json.load(f)

    # Run the math (brief math + margin overlay)
    results = im.compute_internal_extras(config)

    # ── Print cascade summary ──
    print('── Numbers cascade ──')
    print(f'  Total CX spend:        ${results["total_cx_spend"]:,.0f}')
    print(f'  AI vendor:             ${results["ai_spend"]:,.0f}'
          f' ({"estimated" if results["ai_spend_is_estimated"] else "provided"})')
    print(f'  BPO labor:             ${results["bpo_spend"]:,.0f}')
    print(f'  Blended cost/outcome:  ${results["blended_cost"]:.2f}')
    print(f'  Year 1 savings:        ${results["year1_savings"]:,.0f} ({results["year1_savings_pct"] * 100:.1f}%)')
    print(f'  Year 2+ savings:       ${results["year2_savings"]:,.0f} ({results["year2_savings_pct"] * 100:.1f}%)')
    print()
    print('── Margin profile (INTERNAL) ──')
    for m in results['margins']:
        print(f'  {m["phase_name"]}: '
              f'${m["customer_cost"] / 1e6:.1f}M paid by client / '
              f'${m["total_cost"] / 1e6:.1f}M our cost / '
              f'${m["gross_margin"] / 1e6:.2f}M margin '
              f'({m["margin_pct"] * 100:.1f}%)')

    # ── Hand off to Node ──
    # Need to recursively serialize floats (they encode fine; no work to do).
    payload = json.dumps({'config': config, 'results': results})
    script_dir = Path(__file__).resolve().parent
    node_script = script_dir / 'generate_docx.js'

    # Make sure docx npm package is available — install if not
    docx_check = subprocess.run(
        ['node', '-e', "require.resolve('docx')"],
        capture_output=True, text=True
    )
    if docx_check.returncode != 0:
        print('Installing docx npm package (one-time setup)...', file=sys.stderr)
        # Try global install first; fall back to local
        npm_global_dir = os.path.expanduser('~/.npm-global')
        os.environ['NPM_CONFIG_PREFIX'] = npm_global_dir
        subprocess.run(['npm', 'install', '-g', 'docx'], check=False)
        # Make sure NODE_PATH points to global modules
        os.environ['NODE_PATH'] = os.path.join(npm_global_dir, 'lib', 'node_modules')

    proc = subprocess.run(
        ['node', str(node_script), str(out_path)],
        input=payload,
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        print('Node generator failed:', file=sys.stderr)
        print(proc.stderr, file=sys.stderr)
        sys.exit(1)
    print(proc.stderr.strip())  # Node logs the success message via stderr
    print(f'\nDOCX written: {out_path}')


if __name__ == '__main__':
    main()

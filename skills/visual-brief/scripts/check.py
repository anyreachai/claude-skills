#!/usr/bin/env python3
"""Render check for a visual-brief page.

Usage: python3 check.py <brief.html> [out_dir]

Wraps the page in the Artifact viewer's skeleton, then asserts:
  - no horizontal scroll at 1280px and 400px (scrollWidth == viewport)
  - zero page errors
  - at least one running animation when a #method strip exists
and writes: desktop.png (first 1100px), phone.png (first 1300px), strip-<t>.png frames
(animations paused at 3.6s, 6.6s, 11.9s) when the strip exists, plus swarm.png mid-run.

Google Fonts will fail to load in a sandbox (ERR_TUNNEL_CONNECTION_FAILED); that is not a page error.
"""
import asyncio, sys, os
from playwright.async_api import async_playwright

SKEL = ('<!doctype html><html><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>')

async def main(path, out):
    os.makedirs(out, exist_ok=True)
    html = SKEL + open(path, encoding='utf-8').read() + '</body></html>'
    problems = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        pg = await b.new_page(viewport={'width': 1280, 'height': 900})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.set_content(html, wait_until='load')
        await pg.wait_for_timeout(1500)
        w = await pg.evaluate('document.documentElement.scrollWidth')
        if w != 1280: problems.append(f'desktop scrollWidth {w} != 1280')
        has_strip = await pg.evaluate("!!document.getElementById('method')")
        na = await pg.evaluate('document.getAnimations().length')
        if has_strip and na == 0: problems.append('strip present but no animations running')
        await pg.wait_for_timeout(4000)
        await pg.screenshot(path=f'{out}/desktop.png', clip={'x': 0, 'y': 0, 'width': 1280, 'height': 1100})
        if await pg.evaluate("!!document.getElementById('swarm')"):
            el = await pg.query_selector('#swarm'); await el.screenshot(path=f'{out}/swarm.png')
        if has_strip:
            await pg.evaluate("document.getElementById('method').scrollIntoView()")
            await pg.wait_for_timeout(300)
            el = await pg.query_selector('#method')
            for t in (3600, 6600, 11900):
                await pg.evaluate(f"document.getAnimations().forEach(a=>{{a.pause();a.currentTime={t}}})")
                await el.screenshot(path=f'{out}/strip-{t//100}.png')
            await pg.evaluate("document.getAnimations().forEach(a=>a.play())")
        pg2 = await b.new_page(viewport={'width': 400, 'height': 800})
        pg2.on('pageerror', lambda e: errs.append('phone: ' + str(e)))
        await pg2.set_content(html, wait_until='load')
        await pg2.wait_for_timeout(1500)
        w2 = await pg2.evaluate('document.documentElement.scrollWidth')
        if w2 != 400: problems.append(f'phone scrollWidth {w2} != 400')
        await pg2.screenshot(path=f'{out}/phone.png', clip={'x': 0, 'y': 0, 'width': 400, 'height': 1300})
        await b.close()
    problems += [f'page error: {e}' for e in errs]
    print('animations:', na, '| strip:', has_strip)
    print('OK' if not problems else 'PROBLEMS:\n  ' + '\n  '.join(problems))
    print('screenshots in', out)

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    asyncio.run(main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'check-out'))

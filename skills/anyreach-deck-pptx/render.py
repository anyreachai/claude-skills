"""
Anyreach Deck (PPTX) — Build Pipeline.

Entry point for assembling a deck: create the Presentation with the
right custom slide size, run each slide function in order, and save.

USAGE
    from lib.render import build_deck

    build_deck(
        slide_fns=[make_hero_slide, make_donut_slide, ...],
        output_path='examples/example_deck.pptx',
        title='My Deck',
    )
"""

from pathlib import Path

from pptx import Presentation
from pptx.util import Emu

from .tokens import slide_width_emu, slide_height_emu, PAGE_W, PAGE_H


def new_deck(page_w_px=None, page_h_px=None):
    """Create a fresh Presentation with the editorial slide size.

    Default size matches the PDF version exactly: 1400 x 900 px →
    1050pt x 675pt → 14.583" x 9.375" (a 14:9 landscape, slightly
    taller than 16:9 widescreen).

    Override per-deck if needed, but most decks should keep the default.
    """
    prs = Presentation()
    if page_w_px is not None or page_h_px is not None:
        from .tokens import px_to_emu
        prs.slide_width = Emu(px_to_emu(page_w_px or PAGE_W))
        prs.slide_height = Emu(px_to_emu(page_h_px or PAGE_H))
    else:
        prs.slide_width = Emu(slide_width_emu())
        prs.slide_height = Emu(slide_height_emu())
    return prs


def build_deck(slide_fns, output_path, title=None,
               page_w_px=None, page_h_px=None):
    """Build a deck end-to-end.

    Args:
        slide_fns: list of callables, each takes (prs) and adds a slide.
                   Each function should call blank_slide(prs, ...) to
                   create the slide before drawing on it.
        output_path: where to save the .pptx (string or Path).
        title: optional deck title (sets core property).
        page_w_px, page_h_px: override default slide size (px units).

    Returns: Path of the saved file.
    """
    prs = new_deck(page_w_px=page_w_px, page_h_px=page_h_px)

    if title:
        prs.core_properties.title = title

    for fn in slide_fns:
        fn(prs)

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(output_path))
    return output_path


# ============================================================
# DIAGNOSTIC: dump a deck to PNGs for visual QA
# ============================================================

def render_previews(pptx_path, output_dir, dpi=150):
    """Convert each slide to a PNG via LibreOffice for visual QA. The
    output directory is created if missing. Returns the list of PNG paths
    in order.

    Requires `soffice` (LibreOffice) and `pdftoppm` (poppler) to be
    installed in the environment.
    """
    import subprocess
    import shutil

    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # 1. Convert .pptx to PDF
    pdf_path = output_dir / (pptx_path.stem + '.pdf')
    subprocess.run([
        'soffice', '--headless', '--convert-to', 'pdf',
        '--outdir', str(output_dir), str(pptx_path),
    ], check=True, capture_output=True)

    # 2. PDF → PNGs
    # Clean prior previews
    for p in output_dir.glob('slide-*.png'):
        p.unlink()
    subprocess.run([
        'pdftoppm', '-png', '-r', str(dpi),
        str(pdf_path), str(output_dir / 'slide'),
    ], check=True, capture_output=True)

    return sorted(output_dir.glob('slide-*.png'))

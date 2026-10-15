EMU_W = 12192000
EMU_H = 6858000

# Uniform content area used across every slide.
CONTENT_LEFT = 342909        # left margin
CONTENT_RIGHT = 11849400     # right content edge
CONTENT_TOP = 1100000        # top of the content/infographic area, just below the title
TITLE_TOP = 330000           # baseline for every slide title

# One bar thickness shared by progress bars and gantt bars so they read as one weight.
BAR_H = 165000


def week_x(start_x, week, per_week):
    return int(start_x + week * per_week)


def pct_to_emu(pct, full):
    return int(max(0, min(100, pct)) / 100.0 * full)

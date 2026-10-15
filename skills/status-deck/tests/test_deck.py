from status_deck.theme import Theme
from status_deck.deck import Deck

def test_deck_is_16x9_and_saves(tmp_path):
    d=Deck(Theme.anyreach(footer="Anyreach", date="19 Aug 2026"))
    assert int(d.prs.slide_width)==12192000 and int(d.prs.slide_height)==6858000
    s=d.add_slide(); d.title_block(s,"Executive summary","Status update")
    assert any("Executive summary"==sh.text_frame.text for sh in s.shapes if sh.has_text_frame)
    out=d.save(str(tmp_path/"x.pptx")); assert out.endswith("x.pptx")

def test_appendix_divider_adds_slide():
    d=Deck(Theme.anyreach()); n=len(d.prs.slides._sldIdLst)
    d.appendix_divider(); assert len(d.prs.slides._sldIdLst)==n+1

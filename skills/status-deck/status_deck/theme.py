from dataclasses import dataclass, replace
from pptx.dml.color import RGBColor

def hex_to_rgb(h): return RGBColor(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))

@dataclass(frozen=True)
class Theme:
    ink: str="1F2547"; indigo: str="3B3F8C"; purple: str="6C5CE7"; body: str="23262F"
    muted: str="6B7088"; gold: str="B8860B"; rag_red: str="C0504D"; rag_amber: str="E69138"
    rag_green: str="2E7D32"; zebra: str="F7F8FC"; blocker: str="FCE7E7"; border: str="E7E9F2"
    band_fill: str="1F2547"; band_text: str="FFFFFF"; font_head: str="Arial"; font_body: str="Arial"
    size_title: int=24; size_subtitle: int=12; size_section: int=13; size_table_header: int=9
    size_body: int=11; size_subtext: int=9; size_label: int=8; size_footer: int=8; size_confidential: int=7
    size_display: int=32
    data_palette: tuple=("indigo","purple","gold","muted")
    org_parties: tuple=(); footer: str=""; date: str=""; status: str="green"; confidential: bool=True
    def color(self, name): return hex_to_rgb(getattr(self, name))
    def series_color(self, i): return self.color(self.data_palette[i % len(self.data_palette)])
    def rag(self, status): return self.color({"red":"rag_red","amber":"rag_amber","green":"rag_green"}[status])
    @classmethod
    def anyreach(cls, **overrides): return replace(cls(), **overrides)

from .. import blocks
LEFT=342909
_STATUS={"recorded":"green","pending":"red","in progress":"amber","on track":"green","at risk":"amber"}
def render(slide, content, theme):
    rows=content["rows"]
    blocks.text_box(slide,left=LEFT,top=330000,width=11500000,height=430000,text=content["title"],
                    size=theme.size_title,color=theme.color("ink"),bold=True,font=theme.font_head)
    cols=[("ITEM",2050000),("WHAT WAS DECIDED",6000000),("RECORDED",1400000),("STATUS",1900000)]
    top=980000; xs=[LEFT];
    for _,w in cols: xs.append(xs[-1]+w)
    blocks.header_band(slide,theme,top=top,height=300000)
    for (label,w),x in zip(cols,xs):
        blocks.band_label(slide,theme,label,x,top+55000,w-40000,210000)
    y=top+320000
    for i,r in enumerate(rows):
        if i%2==1: blocks.filled_rect(slide,325650,y-10000,11540700,470000,theme.zebra)
        blocks.text_box(slide,left=xs[0],top=y,width=cols[0][1]-40000,height=460000,text=r["item"],
                        size=theme.size_body,color=theme.color("ink"),bold=True,font=theme.font_head)
        blocks.text_box(slide,left=xs[1],top=y,width=cols[1][1]-40000,height=460000,text=r["decision"],
                        size=theme.size_subtext,color=theme.color("body"),font=theme.font_body)
        blocks.text_box(slide,left=xs[2],top=y,width=cols[2][1]-40000,height=460000,text=r.get("recorded",""),
                        size=theme.size_subtext,color=theme.color("muted"),font=theme.font_body)
        st=r["status"]; rag=_STATUS.get(st.lower(),"amber")
        blocks.text_box(slide,left=xs[3],top=y,width=cols[3][1]-40000,height=460000,text=st,
                        size=theme.size_body,color=theme.rag(rag),bold=True,font=theme.font_head)
        y+=490000

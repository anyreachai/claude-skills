import re, shutil, subprocess, os
from collections import namedtuple
Issue=namedtuple("Issue","level where text reason")
_BANNED={"—":"em dash","–":"en dash","→":"arrow","←":"arrow","⇒":"arrow",
         "•":"bullet glyph","…":"ellipsis glyph","✓":"tick glyph","✗":"cross glyph"}
_HEDGE=re.compile(r"\b(happy to|feel free|of course|simply|just|obviously)\b",re.I)

def _walk(o,path="brief"):
    if isinstance(o,dict):
        for k,v in o.items(): yield from _walk(v,f"{path}.{k}")
    elif isinstance(o,(list,tuple)):
        for i,v in enumerate(o): yield from _walk(v,f"{path}[{i}]")
    elif isinstance(o,str):
        yield path,o

def lint_brief(brief):
    out=[]
    for where,s in _walk(brief):
        for ch,name in _BANNED.items():
            if ch in s: out.append(Issue("block",where,s,f"banned {name}"))
        if _HEDGE.search(s): out.append(Issue("warn",where,s,"hedge or filler wording"))
        words=len(re.findall(r"\w+",s))
        if words>=40: out.append(Issue("warn",where,s,f"long sentence, {words} words"))
    return out

def has_blocking(issues): return any(i.level=="block" for i in issues)

def render_to_pdf(pptx_path,out_dir):
    soffice=shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice: return None
    os.makedirs(out_dir,exist_ok=True)
    subprocess.run([soffice,"--headless","--convert-to","pdf","--outdir",out_dir,pptx_path],check=True)
    return sorted(os.path.join(out_dir,f) for f in os.listdir(out_dir) if f.endswith(".pdf"))

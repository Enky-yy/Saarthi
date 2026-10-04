"""Tiny offline RAG: TF-IDF retrieval over the curated KB (EN + HI),
optional Gemini grounded answering when keyed. No dependencies."""
import math
import re
from collections import Counter

_TOKEN = re.compile(r"[\w\u0900-\u097F]+", re.UNICODE)

_docs: list[dict] | None = None
_idf: dict[str, float] = {}
_vecs: list[dict[str, float]] = []


def _tokens(s: str) -> list[str]:
    return [t.lower() for t in _TOKEN.findall(s or "") if len(t) > 1]


def _build() -> None:
    global _docs, _idf, _vecs
    from .kb_data import DOCS
    _docs = []
    for d in DOCS:
        for lang in ("en", "hi"):
            _docs.append({"id": d["id"], "lang": lang, "title": d[f"title_{lang}"],
                          "body": d[f"body_{lang}"], "links": d["links"]})
    df: Counter = Counter()
    tf_list = []
    for d in _docs:
        tf = Counter(_tokens(d["title"] + " " + d["body"]))
        tf_list.append(tf)
        for t in tf:
            df[t] += 1
    n = len(_docs)
    _idf = {t: math.log(1 + n / c) for t, c in df.items()}
    _vecs = [{t: (c / sum(tf.values())) * _idf[t] for t, c in tf.items()} for tf in tf_list]


def _ensure() -> None:
    if _docs is None:
        _build()


def search(query: str, lang: str = "en", top: int = 3) -> list[dict]:
    """Best KB docs for query; same-language preferred, cross-lingual fallback."""
    _ensure()
    qt = Counter(_tokens(query))
    if not qt:
        return []
    qv = {t: (c / sum(qt.values())) * _idf.get(t, 0.0) for t, c in qt.items()}
    scored = []
    for d, v in zip(_docs, _vecs):
        dot = sum(qv.get(t, 0.0) * w for t, w in v.items())
        if dot > 0:
            scored.append((dot * (1.25 if d["lang"] == lang else 1.0), d))
    scored.sort(key=lambda x: -x[0])
    # de-dupe by topic id, keep best language match
    seen, out = set(), []
    for _, d in scored:
        if d["id"] not in seen:
            seen.add(d["id"])
            out.append(d)
        if len(out) == top:
            break
    return out


def count() -> int:
    _ensure()
    return len(_docs)

"""Dense retrieval: multilingual-e5-small embeddings (CPU/GPU, ~120MB),
cosine search over the KB, hybrid-blended with TF-IDF. Zero APIs, zero keys.
Vectors persist in backend/data/ so restarts are instant."""
import json
import os

import numpy as np

_MODEL_ID = os.environ.get("EMBED_MODEL", "intfloat/multilingual-e5-small")
_DATA = os.path.join(os.path.dirname(__file__), "..", "data")
_VEC_PATH = os.path.join(_DATA, "kb_vectors.npz")

_model = None
_tok = None
_lock = None


def _load():
    global _model, _tok, _lock
    if _model is not None:
        return _model is not False
    import threading
    if _lock is None:
        _lock = threading.Lock()
    with _lock:
        if _model is not None:
            return _model is not False
        try:
            import torch
            from transformers import AutoModel, AutoTokenizer
            _tok = AutoTokenizer.from_pretrained(_MODEL_ID)
            _model = AutoModel.from_pretrained(_MODEL_ID)
            _model.eval()
            if torch.cuda.is_available():
                _model = _model.cuda()
        except Exception:
            _model = False
        return _model is not False


def available() -> bool:
    return _load()


def embed(texts: list[str], is_query: bool = False) -> np.ndarray | None:
    """Mean-pooled e5 embeddings, L2-normalized. None when model missing."""
    if not _load() or not texts:
        return None
    try:
        import torch
        prefixed = [("query: " if is_query else "passage: ") + (t or "")[:2000] for t in texts]
        with torch.no_grad():
            batch = _tok(prefixed, padding=True, truncation=True, max_length=512, return_tensors="pt")
            if next(_model.parameters()).is_cuda:
                batch = {k: v.cuda() for k, v in batch.items()}
            out = _model(**batch).last_hidden_state
            mask = batch["attention_mask"].unsqueeze(-1).float()
            vec = (out * mask).sum(1) / mask.sum(1).clamp(min=1e-6)
            vec = torch.nn.functional.normalize(vec, dim=1)
            return vec.float().cpu().numpy()
    except Exception:
        return None


def _docs() -> list[dict]:
    from .kb_data import DOCS
    docs = []
    for d in DOCS:
        for lang in ("en", "hi"):
            docs.append({"id": d["id"], "lang": lang, "title": d[f"title_{lang}"],
                         "body": d[f"body_{lang}"], "links": d["links"]})
    try:
        from .kb_official import DOCS as OFF
        for d in OFF:
            docs.append({"id": d["id"], "lang": "en", "title": d["title"],
                         "body": d["body"], "links": d["links"]})
    except Exception:
        pass
    return docs


def rebuild() -> int:
    """(Re)embed the whole corpus. Returns doc count."""
    docs = _docs()
    vecs = embed([d["title"] + " " + d["body"] for d in docs])
    if vecs is None:
        return 0
    os.makedirs(os.path.abspath(_DATA), exist_ok=True)
    np.savez_compressed(_VEC_PATH, vecs=vecs, meta=json.dumps(
        [{"id": d["id"], "lang": d["lang"], "title": d["title"], "body": d["body"], "links": d["links"]} for d in docs]))
    return len(docs)


def _stored() -> tuple | None:
    try:
        z = np.load(_VEC_PATH, allow_pickle=True)
        return z["vecs"], json.loads(str(z["meta"]))
    except Exception:
        return None


def dense_search(query: str, lang: str = "en", top: int = 3) -> list[dict] | None:
    """Cosine search; None when the model/index is unavailable."""
    stored = _stored()
    if stored is None:
        if rebuild() == 0:
            return None
        stored = _stored()
        if stored is None:
            return None
    vecs, meta = stored
    qv = embed([query], is_query=True)
    if qv is None:
        return None
    sims = (vecs @ qv[0]).tolist()
    order = sorted(range(len(meta)), key=lambda i: -sims[i])
    seen, out = set(), []
    for i in order:
        d = meta[i]
        bonus = 1.1 if d["lang"] == lang else 1.0
        if d["id"] not in seen:
            seen.add(d["id"])
            out.append((sims[i] * bonus, d))
        if len(out) == top:
            break
    return [d for _, d in sorted(out, key=lambda x: -x[0])]

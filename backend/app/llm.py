"""Gemini augmentation for classifier + explainer. Rule-based code stays primary
fallback: every function returns None on missing key, timeout, or bad output,
and the pipeline silently keeps the deterministic result."""
import json
import os
import urllib.request

_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
_KEY = None  # lazy, so tests/imports never need env


def _key() -> str | None:
    global _KEY
    if _KEY is None:
        _KEY = os.environ.get("GEMINI_API_KEY") or ""
    return _KEY or None


def _generate(prompt: str, timeout: int = 20) -> dict | list | None:
    key = _key()
    if not key:
        return None
    try:
        body = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.3},
        }).encode()
        req = urllib.request.Request(
            f"https://generativelanguage.googleapis.com/v1beta/models/{_MODEL}:generateContent?key={key}",
            data=body, headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = json.load(r)
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
    except Exception:
        return None


_CLASSIFY_SYS = (
    "You are an investor-protection assistant for Indian retail investors. "
    "Decide if the content EDUCATES (explains concepts, no sales pressure) or "
    "PROMOTES (sells, pressures, guarantees returns, pushes groups/links). "
    "Never give investment advice or predictions. Respond with ONLY this JSON: "
    '{"label": "education|promotion|mixed", "score": 0-1, "signals": ["short reason", ...]}'
)

_EXPLAIN_SYS = (
    "You explain investing concepts to a first-time Indian investor in {lang} "
    "at grade-6 reading level with ONE everyday Indian analogy. "
    "Never give investment advice, tips, or predictions. End with a caution to "
    "verify on SEBI/SCORES/NSE. Respond with ONLY this JSON: "
    '{"plain_text": "...", "analogy": "...", "terms": [{"term": "...", "meaning": "..."}]}'
    " (max 3 terms)"
)

_LANG_NAMES = {"en": "English", "hi": "Hindi", "hinglish": "Hinglish (Hindi in Roman script)", "mr": "Marathi", "ta": "Tamil", "bn": "Bengali", "te": "Telugu", "kn": "Kannada", "ml": "Malayalam", "gu": "Gujarati", "pa": "Punjabi"}


def llm_classify(text: str):
    """Returns (PromoLabel, score, signals) or None to keep rule result."""
    from .schemas import PromoLabel
    out = _generate(_CLASSIFY_SYS + "\n\nContent:\n" + (text or "")[:2000])
    try:
        label = {"education": PromoLabel.education, "promotion": PromoLabel.promotion, "mixed": PromoLabel.mixed}[out["label"]]
        score = max(0.0, min(1.0, float(out["score"])))
        signals = [str(s)[:80] for s in out.get("signals", [])][:6]
        return label, round(score, 2), signals
    except Exception:
        return None


def llm_explain(text: str, lang: str):
    """Returns Explainer or None to keep template result."""
    from .schemas import Explainer
    langname = _LANG_NAMES.get(lang, "English")
    out = _generate(_EXPLAIN_SYS.format(lang=langname) + "\n\nContent:\n" + (text or "")[:2000])
    try:
        return Explainer(plain_text=str(out["plain_text"])[:800], analogy=str(out["analogy"])[:300], terms=out.get("terms", [])[:3])
    except Exception:
        return None


_TRANSLATE_SYS = (
    "Translate each of these short investor-protection strings into {lang}. "
    "Keep SEBI, SCORES, NSE, NAV, SIP untranslated. Keep it plain and short. "
    "Respond with ONLY a JSON array of translated strings in the same order."
)


def llm_translate(texts: list[str], lang: str) -> list[str] | None:
    """Translate UI/evidence strings; None => keep English."""
    if lang in ("en", "hinglish") or not texts:
        return None
    langname = _LANG_NAMES.get(lang, "English")
    out = _generate(_TRANSLATE_SYS.format(lang=langname) + "\n\n" + json.dumps(texts[:8]))
    try:
        return [str(s)[:500] for s in out][: len(texts)] if isinstance(out, list) else None
    except Exception:
        return None


_RAG_SYS = (
    "Answer the investor's question in {lang} using ONLY the notes below. "
    "Plain words, grade-6 level, max 5 sentences. Never give investment advice, "
    "tips, or predictions. End with one caution line. Respond with ONLY JSON: "
    '{"answer": "..."}'
)


def rag_answer(query: str, chunks: list[dict], lang: str) -> str | None:
    """Grounded abstractive answer; None => caller uses extractive chunks."""
    notes = "\n".join(f"- {c['title']}: {c['body']}" for c in chunks[:3])
    langname = _LANG_NAMES.get(lang, "English")
    out = _generate(_RAG_SYS.format(lang=langname) + f"\n\nNotes:\n{notes}\n\nQuestion: {query[:500]}")
    try:
        return str(out["answer"])[:1200]
    except Exception:
        return None


def gemini_transcribe(audio: bytes, language_hint: str = "auto") -> str | None:
    """REMOVED from pipeline (Gnani Prisma is the transcription engine).
    Kept for reference; not called anywhere."""
    return None

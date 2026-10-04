"""Local-first LLM client. No external APIs, no keys, no per-call cost.
Uses a small instruct model (Qwen2.5-1.5B) on local GPU/CPU for polish tasks:
explainer upgrades, evidence translation, grounded RAG answers.
Every function returns None when the model is absent/busy, and callers keep
their deterministic templates — the app is never hostage to the model."""
import json
import os
import threading

_MODEL_ID = os.environ.get("LOCAL_GEN_MODEL", "Qwen/Qwen2.5-1.5B-Instruct")
_pipe = None
_lock = threading.Lock()


def _gen():
    global _pipe
    if _pipe is not None:
        return _pipe
    with _lock:
        if _pipe is not None:
            return _pipe
        try:
            import torch
            from transformers import pipeline
            try:
                _pipe = pipeline("text-generation", model=_MODEL_ID, device=0,
                                 dtype=torch.float16, trust_remote_code=True)
                # prove the allocation now; training may own the VRAM
                _pipe("ok", max_new_tokens=1, return_full_text=False)
            except Exception:
                _pipe = pipeline("text-generation", model=_MODEL_ID, device=-1,
                                 trust_remote_code=True)
        except Exception:
            _pipe = False
        return _pipe or None


def _gen_json(prompt: str, max_new: int = 300) -> dict | list | None:
    pipe = _gen()
    if not pipe:
        return None
    try:
        out = pipe(prompt, max_new_tokens=max_new, do_sample=False,
                   return_full_text=False, temperature=None, top_p=None)
        text = out[0]["generated_text"]
        start = text.find("{") if "{" in text else text.find("[")
        end = text.rfind("}") if "{" in text else text.rfind("]")
        return json.loads(text[start:end + 1])
    except Exception:
        return None


_LANG_NAMES = {"en": "English", "hi": "Hindi", "hinglish": "Hinglish (Hindi in Roman script)", "mr": "Marathi", "ta": "Tamil", "bn": "Bengali", "te": "Telugu", "kn": "Kannada", "ml": "Malayalam", "gu": "Gujarati", "pa": "Punjabi"}


def llm_classify(text: str):
    """Retired: the fine-tuned MuRIL classifier lives in classifier.py."""
    return None


_RAG_SYS = (
    "Answer in {lang} using ONLY these notes. Plain words, grade-6, max 5 sentences. "
    "No advice, tips, or predictions. End with one caution line. Reply ONLY JSON: "
    '\'{{"answer": "..."}}\''
)


def rag_answer(query: str, chunks: list[dict], lang: str) -> str | None:
    """Grounded abstractive answer; None => caller uses extractive chunks."""
    notes = "\n".join(f"- {c['title']}: {c['body']}" for c in chunks[:3])
    langname = _LANG_NAMES.get(lang, "English")
    out = _gen_json(_RAG_SYS.format(lang=langname) + f"\nNotes:\n{notes}\nQuestion: {query[:500]}")
    try:
        return str(out["answer"])[:1200]
    except Exception:
        return None

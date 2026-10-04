import hashlib
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .classifier import classify
from .evidence import check_evidence
from .explainer import explain
from .llm import rag_answer  # grounded EN answers; extractive otherwise
from .ocr import extract_image_text
from .youtube import extract_youtube_text
from .schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    CalcRequest,
    CalcResponse,
    Claim,
    ClaimType,
    LearnRequest,
    LearnResponse,
    SearchRequest,
    SearchResponse,
    SearchSource,
    SimRequest,
    Simulator,
    WallRequest,
)
from .simulator import build_sim
from .simulator import simulate as run_simulation
from .store import recent as history_recent
from .store import save as history_save
from .voice import stub_audio_url

app = FastAPI(title="Saarthi Investor Resilience API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo hackathon build; tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# History persists in SQLite (store.py); voice reads on-device (Web Speech).


def _input_hash(req: AnalyzeRequest) -> str:
    raw = (req.input_text or "") + (req.image_url or "") + (req.youtube_url or "")
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _stub_pipeline(req: AnalyzeRequest, job_id: str) -> AnalyzeResponse:
    # Rules run first (always available); the local model upgrades when loaded.
    import re as _re
    source_note: str | None = None
    if req.input_text:
        text = req.input_text
        if _re.fullmatch(r"https?://\S+", text.strip()):
            # Bare link pasted as text: read what it points to, not the URL string.
            from .ingest import extract_article_text, kind_of
            from .ocr import extract_image_text as _ocr_url
            from .youtube import extract_youtube_text as _yt_text
            kind = kind_of(text.strip())
            if kind == "youtube":
                got, note = _yt_text(text.strip())
            elif kind == "image":
                got, note = _ocr_url(text.strip())
            elif kind == "article":
                got, note = extract_article_text(text.strip())
            else:
                got, note = None, None
            if got:
                text, source_note = got, "Link content was read automatically."
            elif note:
                source_note = note
    elif req.image_url:
        extracted, source_note = extract_image_text(req.image_url)
        text = extracted or req.image_url
    elif req.youtube_url:
        extracted, source_note = extract_youtube_text(req.youtube_url)
        text = extracted or req.youtube_url
    else:
        text = ""
    promo_label, promo_score, promo_signals, rule_tags = classify(text)
    # (MuRIL upgrades label+score inside classify(); rules own signals+tags.)
    has_guarantee = any("guarantee" in s for s in promo_signals)
    claims = [
        Claim(text=text[:200] or "empty input", type=ClaimType.guarantee if has_guarantee else ClaimType.product, jargon=["NAV"] if not has_guarantee else ["guaranteed returns"])
    ]
    evidence = check_evidence(text, claims, req.lang.value)
    ev_tag = "official_source" if evidence.level.value == "strong" else ("no_evidence" if evidence.level.value == "none" else "has_numbers")
    tags = rule_tags + [ev_tag]
    # Decisive action call: stop (danger) / verify (unclear) / learn (safe teaching).
    # A group invite, tip line, referral, or hurry tactic alone is never "safe".
    # Fake authority COMBINED with a money funnel is danger even when the
    # wording stays just soft enough to dodge a promotion label.
    pressure = set(rule_tags) & {"group_cta", "authority_tip", "referral", "urgency"}
    funnel = {"authority_tip", "referral"} <= set(rule_tags) or {"authority_tip", "group_cta"} <= set(rule_tags)
    if promo_label.value == "promotion" or "guarantee" in rule_tags or funnel:
        action = "stop"
    elif promo_label.value == "other":
        action = "other"
    elif promo_label.value == "education" and not pressure:
        action = "learn"
    else:
        action = "verify"
    if source_note:
        evidence = evidence.model_copy(update={"uncertainty": evidence.uncertainty + " " + source_note})
    # Evidence strings are natively translated in evidence.py (no MT).
    explainer = explain(text, claims, req.lang)
    simulator = build_sim(text)
    audio_url = stub_audio_url(job_id, req.voice, req.lang, explainer.plain_text)
    return AnalyzeResponse(
        job_id=job_id,
        lang=req.lang,
        claims=claims,
        promo_label=promo_label,
        promo_score=promo_score,
        promo_signals=promo_signals,
        tags=tags,
        action=action,
        evidence=evidence,
        explainer=explainer,
        simulator=simulator,
        audio_url=audio_url,
    )


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    if not (req.input_text or req.image_url or req.youtube_url):
        raise HTTPException(status_code=422, detail="provide input_text, image_url or youtube_url")
    job_id = str(uuid.uuid4())
    resp = _stub_pipeline(req, job_id)
    history_save(job_id, req.lang.value, _input_hash(req), resp.promo_label.value, resp.evidence.level.value)
    return resp


@app.get("/api/history")
def history():
    return history_recent()


TOPICS = ["NAV", "SIP", "volatility", "compounding", "diversification", "leverage", "demat", "nomination", "SCORES", "guaranteed returns"]


@app.get("/api/topics")
def topics():
    return TOPICS


@app.post("/api/learn", response_model=LearnResponse)
def learn(req: LearnRequest):
    topic = req.topic if req.topic in TOPICS else "NAV"
    explainer = explain(topic, [], req.lang)
    try:
        upgraded = llm_explain(topic, req.lang.value)
        if upgraded:
            explainer = upgraded
    except Exception:
        pass
    return LearnResponse(topic=topic, lang=req.lang, explainer=explainer)


@app.post("/api/simulate", response_model=Simulator)
def simulate(req: SimRequest):
    return run_simulation(req.pmt, req.months, req.claimed_monthly_pct, req.crash_pct)


@app.get("/api/calcs")
def calc_specs():
    from .calcs import SPECS
    return SPECS

@app.post("/api/calc", response_model=CalcResponse)
def calc(req: CalcRequest):
    from .calcs import SPECS, TOOL_FN, describe
    if req.tool not in TOOL_FN:
        raise HTTPException(status_code=422, detail="unknown tool")
    spec = {name: (lo, hi) for name, _, lo, hi, _ in SPECS[req.tool]["fields"]}
    clean: dict = {}
    for name, _, lo, hi, default in SPECS[req.tool]["fields"]:
        try:
            v = float(req.inputs.get(name, default))
        except Exception:
            v = float(default)
        clean[name] = min(max(v, lo), hi)
    results, series = TOOL_FN[req.tool](clean)
    return CalcResponse(tool=req.tool, results=results, series=[float(x) for x in series], explain=describe(req.tool, req.lang))


@app.post("/api/search", response_model=SearchResponse)
def search(req: SearchRequest):
    import hashlib
    from .llm import rag_answer
    from .rag import search as rag_search
    from .store import answer_cache_get, answer_cache_put
    if not (req.q or "").strip():
        raise HTTPException(status_code=422, detail="empty query")
    lang = req.lang.value
    qhash = hashlib.sha256(f"{lang}|{req.q.strip().lower()}".encode()).hexdigest()[:24]
    hit = answer_cache_get(qhash)
    if hit:
        return SearchResponse(answer=hit["answer"],
                              sources=[SearchSource(**s) for s in hit["sources"]],
                              grounded_ai=hit["grounded_ai"])
    docs = rag_search(req.q, lang if lang != "hinglish" else "hi")
    if not docs:
        docs = rag_search(req.q, "en")
    try:
        from .rag_embed import dense_search
        dense = dense_search(req.q, lang if lang != "hinglish" else "hi")
        if dense:
            want = {d["id"] for d in dense}
            docs = dense + [d for d in docs if d["id"] not in want]
            docs = docs[:3]
    except Exception:
        pass
    if not docs:
        return SearchResponse(answer="", sources=[])
    grounded = False
    answer = None
    if lang == "en":
        # Local-model grounding verified for English; other languages get
        # native extractive passages (better than small-model translation).
        try:
            answer = rag_answer(req.q, docs, lang)
            grounded = bool(answer)
        except Exception:
            pass
    if not answer:
        answer = " ".join(d["body"] for d in docs[:2])[:1200]
    sources = [SearchSource(id=d["id"], title=d["title"], links=d["links"]) for d in docs]
    answer_cache_put(qhash, answer, [s.model_dump() for s in sources], grounded)
    return SearchResponse(answer=answer, sources=sources, grounded_ai=grounded)


@app.post("/api/ocr")
async def ocr_upload(file: UploadFile = File(...)):
    from .ocr import extract_image_text, ocr_bytes
    data = await file.read(6 * 1024 * 1024)
    if not data:
        raise HTTPException(status_code=422, detail="empty file")
    text = ocr_bytes(data)
    if not text:
        return {"text": None, "note": "No readable text found in the image."}
    return {"text": text[:6000], "note": None}


@app.post("/api/ingest-url")
def ingest_url(req: dict):
    from .ingest import extract_article_text, kind_of
    from .ocr import extract_image_text
    from .youtube import extract_youtube_text
    url = (req.get("url") or "").strip()
    if not url:
        raise HTTPException(status_code=422, detail="empty url")
    kind = kind_of(url)
    if kind == "youtube":
        text, note = extract_youtube_text(url)
    elif kind == "image":
        text, note = extract_image_text(url)
    elif kind == "article":
        text, note = extract_article_text(url)
    else:
        text, note = None, "Link type not recognised; paste the message text instead."
    return {"kind": kind, "text": (text or "")[:6000], "note": note}


_transcriber = None


@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...), language_hint: str = "auto"):
    global _transcriber
    data = await file.read(26 * 1024 * 1024)
    if not data:
        raise HTTPException(status_code=422, detail="empty file")
    # 1) Gnani Prisma STT API when keyed
    try:
        from .stt import gnani_transcribe
        text, glang = gnani_transcribe(data, language_hint if language_hint != "auto" else "auto")
        if text:
            return {"text": text, "engine": "gnani-prisma", "language": glang}
    except Exception:
        pass
    # 2) local faster-whisper (offline, multilingual incl. Hindi)
    try:
        if _transcriber is None:
            from faster_whisper import WhisperModel
            _transcriber = WhisperModel("tiny", device="cpu", compute_type="int8")
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".audio") as f:
            f.write(data)
            path = f.name
        try:
            segs, info = _transcriber.transcribe(path, language=None if language_hint == "auto" else language_hint, beam_size=1)
            text = " ".join(s.text for s in segs).strip()
        finally:
            import os
            os.unlink(path)
        if text:
            return {"text": text[:6000], "engine": "local-whisper", "language": info.language}
        return {"text": None, "note": "No speech detected in the recording. Try again closer to the mic."}
    except HTTPException:
        raise
    except Exception:
        pass
    raise HTTPException(status_code=503, detail="no transcription engine available (use the mic button instead)")


@app.get("/api/providers")
def providers():
    import os
    return {
        "local_gen": bool(os.environ.get("LOCAL_GEN_MODEL", "Qwen/Qwen2.5-1.5B-Instruct")),
        "muril_classifier": os.path.exists(os.environ.get("MURIL_MODEL_DIR", "models/muril-clf")),
        "gnani_stt": bool(os.environ.get("GNANI_API_KEY")),
        "local_whisper": True,
        "fallback": "rules + templates + device speech (always on)",
    }


@app.get("/api/wall")
def wall_get():
    from .store import wall_read
    return wall_read()

@app.post("/api/wall")
def wall_post(req: WallRequest):
    from .store import wall_add
    saved = wall_add(req.scam_type, req.state, req.amount, req.text)
    if not saved:
        raise HTTPException(status_code=422, detail="bad report fields")
    return {"ok": True}


# Single-container deploy (Hugging Face Spaces): serve the static frontend
# from the same origin. Mounted LAST so /api/* and /docs keep priority.
# Local dev is unaffected (FRONTEND_DIR unset).
import os as _os
_front = _os.environ.get("FRONTEND_DIR", "")
if _front and _os.path.isdir(_front):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=_front, html=True), name="static")

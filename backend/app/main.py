import hashlib
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .bhashini import tts as bhashini_tts
from .classifier import classify
from .evidence import check_evidence
from .explainer import explain
from .llm import llm_classify, llm_explain, llm_translate
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

app = FastAPI(title="Sangyan C+E API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo hackathon build; tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory TTS cache: job_id -> audio bytes (Bhashini only; else Web Speech).
_audio: dict[str, bytes] = {}


def _input_hash(req: AnalyzeRequest) -> str:
    raw = (req.input_text or "") + (req.image_url or "") + (req.youtube_url or "")
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _stub_pipeline(req: AnalyzeRequest, job_id: str) -> AnalyzeResponse:
    # Rules run first (always available); Gemini upgrades when keyed + reachable.
    source_note: str | None = None
    if req.input_text:
        text = req.input_text
    elif req.image_url:
        extracted, source_note = extract_image_text(req.image_url)
        text = extracted or req.image_url
    elif req.youtube_url:
        extracted, source_note = extract_youtube_text(req.youtube_url)
        text = extracted or req.youtube_url
    else:
        text = ""
    promo_label, promo_score, promo_signals, rule_tags = classify(text)
    try:
        upgraded = llm_classify(text)
        if upgraded:
            promo_label, promo_score, promo_signals = upgraded
    except Exception:
        pass
    has_guarantee = any("guarantee" in s for s in promo_signals)
    claims = [
        Claim(text=text[:200] or "empty input", type=ClaimType.guarantee if has_guarantee else ClaimType.product, jargon=["NAV"] if not has_guarantee else ["guaranteed returns"])
    ]
    evidence = check_evidence(text, claims)
    ev_tag = "official_source" if evidence.level.value == "strong" else ("no_evidence" if evidence.level.value == "none" else "has_numbers")
    tags = rule_tags + [ev_tag]
    # Decisive action call: stop (danger) / verify (unclear) / learn (safe teaching).
    # A group invite, tip line, referral, or hurry tactic alone is never "safe".
    pressure = set(rule_tags) & {"group_cta", "authority_tip", "referral", "urgency"}
    if promo_label.value == "promotion" or "guarantee" in rule_tags:
        action = "stop"
    elif promo_label.value == "education" and not pressure:
        action = "learn"
    else:
        action = "verify"
    if source_note:
        evidence = evidence.model_copy(update={"uncertainty": evidence.uncertainty + " " + source_note})
    # Evidence strings are authored in English; Gemini translates them when keyed.
    if req.lang.value not in ("en", "hinglish"):
        try:
            tr = llm_translate([evidence.summary, evidence.uncertainty], req.lang.value)
            if tr and len(tr) == 2 and all(tr):
                evidence = evidence.model_copy(update={"summary": tr[0], "uncertainty": tr[1]})
        except Exception:
            pass
    explainer = explain(text, claims, req.lang)
    try:
        upgraded_ex = llm_explain(text, req.lang.value)
        if upgraded_ex:
            explainer = upgraded_ex
    except Exception:
        pass
    simulator = build_sim(text)
    audio_url = stub_audio_url(job_id, req.voice, req.lang, explainer.plain_text)
    if req.voice and audio_url is None:
        try:
            blob = bhashini_tts(explainer.plain_text, req.lang.value)
            if blob:
                _audio[job_id] = blob
                audio_url = f"/api/audio/{job_id}"
        except Exception:
            pass
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
    from .llm import rag_answer
    from .rag import count, search as rag_search
    if not (req.q or "").strip():
        raise HTTPException(status_code=422, detail="empty query")
    docs = rag_search(req.q, req.lang.value if req.lang.value != "hinglish" else "hi")
    if not docs:
        docs = rag_search(req.q, "en")
    if not docs:
        return SearchResponse(answer="", sources=[])
    grounded = False
    answer = None
    try:
        answer = rag_answer(req.q, docs, req.lang.value)
        grounded = bool(answer)
    except Exception:
        pass
    if not answer:
        answer = " ".join(d["body"] for d in docs[:2])[:1200]
    return SearchResponse(
        answer=answer,
        sources=[SearchSource(id=d["id"], title=d["title"], links=d["links"]) for d in docs],
        grounded_ai=grounded,
    )


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
    # 1) Gnani Prisma STT API when keyed (no Gemini for transcription)
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


@app.get("/api/audio/{job_id}")
def audio(job_id: str):
    blob = _audio.get(job_id)
    if not blob:
        raise HTTPException(status_code=404, detail="no server audio for this job (uses device speech)")
    return Response(content=blob, media_type="audio/mpeg")


@app.get("/api/providers")
def providers():
    import os
    return {
        "gemini": bool(os.environ.get("GEMINI_API_KEY")),
        "gnani_stt": bool(os.environ.get("GNANI_API_KEY")),
        "bhashini": bool(os.environ.get("BHASHINI_USER_ID") and os.environ.get("BHASHINI_API_KEY")),
        "fallback": "rules + templates + local-whisper + device speech (always on)",
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

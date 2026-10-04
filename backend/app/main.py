import hashlib
import uuid

from fastapi import FastAPI, HTTPException
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
    Claim,
    ClaimType,
    LearnRequest,
    LearnResponse,
    SimRequest,
    Simulator,
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
    promo_label, promo_score, promo_signals = classify(text)
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
        "bhashini": bool(os.environ.get("BHASHINI_USER_ID") and os.environ.get("BHASHINI_API_KEY")),
        "fallback": "rule-based + templates + device speech (always on)",
    }

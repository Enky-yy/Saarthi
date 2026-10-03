import hashlib
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from .classifier import classify
from .evidence import check_evidence
from .explainer import explain
from .schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    Claim,
    ClaimType,
    HistoryItem,
)
from .simulator import build_sim
from .voice import stub_audio_url

app = FastAPI(title="Sangyan C+E API")

# in-memory history, no PII stored. replaced by SQLite in later stage.
_history: list[HistoryItem] = []


def _input_hash(req: AnalyzeRequest) -> str:
    raw = (req.input_text or "") + (req.image_url or "") + (req.youtube_url or "")
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _stub_pipeline(req: AnalyzeRequest, job_id: str) -> AnalyzeResponse:
    # Stage-5: full pipeline classroom stub. LLM/OCR/Bhashini plug into same signatures.
    text = req.input_text or req.youtube_url or req.image_url or ""
    promo_label, promo_score, promo_signals = classify(text)
    has_guarantee = any("guarantee" in s for s in promo_signals)
    claims = [
        Claim(text=(req.input_text or "")[:200] or "empty input", type=ClaimType.guarantee if has_guarantee else ClaimType.product, jargon=["NAV"] if not has_guarantee else ["guaranteed returns"])
    ]
    evidence = check_evidence(text, claims)
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
    _history.append(
        HistoryItem(
            job_id=job_id,
            created_at=datetime.now(timezone.utc),
            lang=req.lang,
            input_hash=_input_hash(req),
            promo_label=resp.promo_label,
            evidence_level=resp.evidence.level,
        )
    )
    return resp


@app.get("/api/history")
def history():
    return _history

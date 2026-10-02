import hashlib
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from .schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    Claim,
    ClaimType,
    Evidence,
    EvidenceLevel,
    Explainer,
    PromoLabel,
    Simulator,
    HistoryItem,
    Lang,
)

app = FastAPI(title="Sangyan C+E Stage-1 Stub")

# in-memory history, no PII stored. replaced by SQLite in later stage.
_history: list[HistoryItem] = []


def _input_hash(req: AnalyzeRequest) -> str:
    raw = (req.input_text or "") + (req.image_url or "") + (req.youtube_url or "")
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _stub_pipeline(req: AnalyzeRequest, job_id: str) -> AnalyzeResponse:
    # Stage-1 stub: deterministic placeholder. Real LLM/OCR plugs in stage 2-4.
    has_guarantee = "guarantee" in (req.input_text or "").lower() or "गारंटी" in (req.input_text or "")
    promo_label = PromoLabel.mixed if has_guarantee else PromoLabel.education
    return AnalyzeResponse(
        job_id=job_id,
        lang=req.lang,
        claims=[
            Claim(text=(req.input_text or "")[:200] or "empty input", type=ClaimType.guarantee if has_guarantee else ClaimType.product, jargon=["NAV"] if not has_guarantee else ["guaranteed returns"])
        ],
        promo_label=promo_label,
        promo_score=0.65 if has_guarantee else 0.2,
        promo_signals=["guarantee keyword"] if has_guarantee else [],
        evidence=Evidence(
            level=EvidenceLevel.none,
            summary="No verifiable evidence provided in stub.",
            sources=[],
            uncertainty="Stub cannot verify. Check SEBI / NSE / SCORES before acting.",
        ),
        explainer=Explainer(
            plain_text="Stub explanation in grade-6 language.",
            analogy="Like monsoon promise: no one can guarantee rain.",
            terms=[{"term": "NAV", "meaning": "per-share value of a mutual fund"}],
        ),
        simulator=Simulator(type="sip-vs-hype", inputs={"pmt": 5000, "n": 12}, projection=[5000.0 * (i + 1) for i in range(12)]),
        audio_url=None,
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

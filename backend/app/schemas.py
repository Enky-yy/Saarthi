from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Lang(str, Enum):
    hi = "hi"
    hinglish = "hinglish"
    en = "en"
    mr = "mr"
    ta = "ta"
    bn = "bn"
    te = "te"
    kn = "kn"
    ml = "ml"
    gu = "gu"
    pa = "pa"


class ClaimType(str, Enum):
    ret = "return"
    guarantee = "guarantee"
    risk = "risk"
    product = "product"


class Claim(BaseModel):
    text: str
    type: ClaimType
    jargon: list[str] = Field(default_factory=list)


class PromoLabel(str, Enum):
    education = "education"
    promotion = "promotion"
    mixed = "mixed"


class EvidenceLevel(str, Enum):
    strong = "strong"
    weak = "weak"
    none = "none"


class EvidenceSource(BaseModel):
    title: str
    url: str


class Evidence(BaseModel):
    level: EvidenceLevel
    summary: str
    sources: list[EvidenceSource] = Field(default_factory=list)
    uncertainty: str


class TermMeaning(BaseModel):
    term: str
    meaning: str


class Explainer(BaseModel):
    plain_text: str
    analogy: str
    terms: list[TermMeaning] = Field(default_factory=list)


class Simulator(BaseModel):
    type: str = Field(examples=["sip-vs-hype", "volatility", "leverage"])
    inputs: dict = Field(default_factory=dict)
    projection: list[float] = Field(default_factory=list)


class AnalyzeRequest(BaseModel):
    input_text: Optional[str] = None
    image_url: Optional[str] = None
    youtube_url: Optional[str] = None
    lang: Lang = Lang.hinglish
    voice: bool = False


class AnalyzeResponse(BaseModel):
    job_id: str
    lang: Lang
    claims: list[Claim] = Field(default_factory=list)
    promo_label: PromoLabel
    promo_score: float = Field(ge=0, le=1)
    promo_signals: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    action: str = Field(examples=["stop", "verify", "learn"])
    evidence: Evidence
    explainer: Explainer
    simulator: Simulator
    audio_url: Optional[str] = None
    disclaimer: str = "Education only, not investment advice."


class HistoryItem(BaseModel):
    job_id: str
    created_at: datetime
    lang: Lang
    input_hash: str
    promo_label: PromoLabel
    evidence_level: EvidenceLevel


class LearnRequest(BaseModel):
    topic: str
    lang: Lang = Lang.hinglish


class LearnResponse(BaseModel):
    topic: str
    lang: Lang
    explainer: Explainer
    disclaimer: str = "Education only, not investment advice."


class SimRequest(BaseModel):
    pmt: float = 5000
    months: int = 12
    claimed_monthly_pct: Optional[float] = None
    crash_pct: float = 0.0


class CalcRequest(BaseModel):
    tool: str
    inputs: dict
    lang: Lang = Lang.hinglish


class CalcResponse(BaseModel):
    tool: str
    results: dict
    series: list[float] = Field(default_factory=list)
    explain: str
    disclaimer: str = "Education only, not investment advice."


class SearchRequest(BaseModel):
    q: str
    lang: Lang = Lang.hinglish


class SearchSource(BaseModel):
    id: str
    title: str
    links: list[str] = Field(default_factory=list)


class SearchResponse(BaseModel):
    answer: str
    sources: list[SearchSource] = Field(default_factory=list)
    grounded_ai: bool = False
    disclaimer: str = "Education only, not investment advice."


class WallRequest(BaseModel):
    scam_type: str
    state: str
    amount: str
    text: str = ""

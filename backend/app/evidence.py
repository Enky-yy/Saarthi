import re
from .schemas import Claim, Evidence, EvidenceLevel, EvidenceSource

_URL_RE = re.compile(r"https?://[^\s)>\]]+")
_OFFICIAL = ("sebi.gov.in", "scores.sebi.gov.in", "nseindia.com", "bseindia.com", "rbi.org.in", "amfiindia.com", "iepf.gov.in")
_NUMBER_RE = re.compile(r"\d+(\.\d+)?\s*%|\b\d{4}\b|₹\s?[\d,]+|Rs\.?\s?[\d,]+|crore|lakh|FY\d{2,4}")
_GUARANTEE_RE = re.compile(r"guarantee|assured|100%\s*sure|risk-?free|double money|\b\d+x\b|multibagger|sureshot|गारंटी|पक्का\s*मुनाफा", re.IGNORECASE)

_SUGGESTED = [
    ("SEBI official site", "https://www.sebi.gov.in"),
    ("SCORES grievance portal", "https://scores.sebi.gov.in"),
    ("NSE India", "https://www.nseindia.com"),
]


def _extract_urls(text: str) -> list[str]:
    return _URL_RE.findall(text or "")


def check_evidence(text: str, claims: list[Claim]) -> Evidence:
    urls = _extract_urls(text)
    official_hits = [u for u in urls if any(d in u for d in _OFFICIAL)]
    other_urls = [u for u in urls if u not in official_hits]
    has_numbers = bool(_NUMBER_RE.search(text or ""))
    has_guarantee = bool(_GUARANTEE_RE.search(text or ""))

    sources = [EvidenceSource(title="Official source cited", url=u) for u in official_hits]
    sources += [EvidenceSource(title="Unverified link cited", url=u) for u in other_urls[:3]]

    # Never binary true/false — level + honest uncertainty only.
    if official_hits and not has_guarantee:
        return Evidence(
            level=EvidenceLevel.strong,
            summary="Cites official source(s); still verify the exact page/date before acting.",
            sources=sources,
            uncertainty="Even official links can be quoted out of context. Check the source page directly.",
        )
    if has_guarantee:
        return Evidence(
            level=EvidenceLevel.none,
            summary="Makes assured-return claims with no verifiable evidence.",
            sources=sources,
            uncertainty="No one can guarantee market returns. Treat as unverified promotion.",
        )
    if other_urls or has_numbers:
        return Evidence(
            level=EvidenceLevel.weak,
            summary="Has figures or links but no official source to confirm them.",
            sources=sources or [EvidenceSource(title=t, url=u) for t, u in _SUGGESTED],
            uncertainty="Figures without an official source cannot be trusted at face value.",
        )
    return Evidence(
        level=EvidenceLevel.none,
        summary="No verifiable evidence provided.",
        sources=[EvidenceSource(title=t, url=u) for t, u in _SUGGESTED],
        uncertainty="Nothing here can be independently verified. Check SEBI / NSE / SCORES before acting.",
    )

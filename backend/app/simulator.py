import re
from .schemas import Simulator

_DEFAULT_PMT = 5000
_DEFAULT_MONTHS = 12
_REALISTIC_ANNUAL = 0.10  # 10% p.a. illustration only, not a prediction


def _parse_claimed_monthly(text: str) -> float | None:
    t = (text or "").lower()
    m = re.search(r"(\d+(\.\d+)?)\s*%\s*(monthly|per month|mahine|महीने|महिना|மாதம்|month)", t)
    if m:
        return float(m.group(1)) / 100.0
    m = re.search(r"double.*?(\d+)\s*months?", t)
    if m:
        n = max(1, int(m.group(1)))
        return 2 ** (1 / n) - 1
    m = re.search(r"(\d+)\s*x\b", t)
    if m and int(m.group(1)) >= 2:
        return 0.20  # cap illustration at 20%/mo for absurd Nx claims
    if re.search(r"guarantee|गारंटी|पक्का\s*मुनाफा|double money", t):
        return 0.05  # default hype illustration when guarantee claimed w/o number
    return None


def _sip_series(pmt: float, months: int, monthly_r: float) -> list[float]:
    out: list[float] = []
    fv = 0.0
    for _ in range(months):
        fv = (fv + pmt) * (1 + monthly_r) if monthly_r else fv + pmt
        out.append(round(fv, 2))
    return out


def build_sim(text: str) -> Simulator:
    claimed = _parse_claimed_monthly(text)
    monthly_real = _REALISTIC_ANNUAL / 12
    realistic = _sip_series(_DEFAULT_PMT, _DEFAULT_MONTHS, monthly_real)
    if claimed is None:
        return Simulator(
            type="sip-vs-hype",
            inputs={"pmt": _DEFAULT_PMT, "months": _DEFAULT_MONTHS, "realistic_annual_pct": 10, "note": "No return claim detected; showing steady-habit illustration only."},
            projection=realistic,
        )
    hype = _sip_series(_DEFAULT_PMT, _DEFAULT_MONTHS, claimed)
    return Simulator(
        type="sip-vs-hype",
        inputs={
            "pmt": _DEFAULT_PMT,
            "months": _DEFAULT_MONTHS,
            "claimed_monthly_pct": round(claimed * 100, 2),
            "realistic_annual_pct": 10,
            "hype_final": hype[-1],
            "realistic_final": realistic[-1],
            "hype_series": hype,
            "note": "Hype vs steady illustration, not a prediction. Crash/drawdown not shown — real path is bumpier.",
        },
        projection=realistic,
    )

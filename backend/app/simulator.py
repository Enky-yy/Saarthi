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


def simulate(pmt: float = 5000, months: int = 12, claimed_monthly_pct: float | None = None, crash_pct: float = 0.0) -> Simulator:
    """Interactive consequence simulator: steady 10% p.a. habit vs hype claim,
    with an optional end-crash so users *feel* volatility with zero real money."""
    pmt = min(max(pmt, 100), 100000)
    months = min(max(months, 3), 360)
    crash = min(max(crash_pct, 0), 90) / 100.0
    monthly_real = _REALISTIC_ANNUAL / 12
    monthly_inf = 0.06 / 12
    realistic = _sip_series(pmt, months, monthly_real)
    # purchasing power of the steady path in today's rupees
    real_terms = [round(v / ((1 + monthly_inf) ** (i + 1)), 2) for i, v in enumerate(realistic)]
    inputs: dict = {"pmt": pmt, "months": months, "realistic_annual_pct": 10, "inflation_pct": 6}
    if claimed_monthly_pct is not None:
        claimed = min(max(claimed_monthly_pct / 100.0, 0), 0.5)
        hype = _sip_series(pmt, months, claimed)
        inputs.update({
            "claimed_monthly_pct": round(claimed * 100, 2),
            "hype_final": hype[-1],
            "realistic_final": realistic[-1],
            "real_terms_final": real_terms[-1],
            "hype_series": hype,
            "real_terms_series": real_terms,
            "hype_multiple": round(hype[-1] / max(1, pmt * months), 2),
            "gap": round(hype[-1] - realistic[-1], 2),
            "gap_months_of_saving": round((hype[-1] - realistic[-1]) / max(1, pmt), 1),
        })
    else:
        inputs.update({"realistic_final": realistic[-1], "real_terms_final": real_terms[-1], "real_terms_series": real_terms})
    if crash:
        realistic = [round(v * (1 - crash * (i + 1) / len(realistic) * 0.5), 2) for i, v in enumerate(realistic)]
        if "hype_series" in inputs:
            n = len(inputs["hype_series"])
            inputs["hype_series"] = [round(v * (1 - crash * (i + 1) / n), 2) for i, v in enumerate(inputs["hype_series"])]
            inputs["hype_final"] = inputs["hype_series"][-1]
            inputs["gap"] = round(inputs["hype_final"] - realistic[-1], 2)
            inputs["gap_months_of_saving"] = round((inputs["hype_final"] - realistic[-1]) / max(1, pmt), 1)
        inputs["realistic_final"] = realistic[-1]
        inputs["crash_pct"] = round(crash * 100, 1)
        inputs["note"] = "Crash applied: steady habits dip but survive — hype promises snap. Illustration, not a prediction."
    elif "note" not in inputs:
        inputs["note"] = "Hype vs steady illustration, not a prediction. Real paths are bumpier."
    return Simulator(type="sip-vs-hype", inputs=inputs, projection=realistic)


def build_sim(text: str) -> Simulator:
    claimed = _parse_claimed_monthly(text)
    sim = simulate(
        _DEFAULT_PMT, _DEFAULT_MONTHS,
        round(claimed * 100, 2) if claimed is not None else None,
    )
    if claimed is None:
        sim.inputs["note"] = "No return claim detected; showing steady-habit illustration only."
    return sim

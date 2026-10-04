"""Threshold contract tests: classifier/evidence/simulator/explainer must keep
their demo-day behavior. Run: python3 -m pytest tests/ -q"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
for v in ("GEMINI_API_KEY", "BHASHINI_USER_ID", "BHASHINI_API_KEY"):
    os.environ.pop(v, None)
os.environ["SANGYAN_DB"] = "/tmp/opencode/test-pytest.db"

from app.classifier import classify  # noqa: E402
from app.evidence import check_evidence  # noqa: E402
from app.explainer import explain  # noqa: E402
from app.schemas import Lang, PromoLabel  # noqa: E402
from app.simulator import build_sim  # noqa: E402


def test_obvious_scam_is_promotion():
    label, score, signals = classify("Guaranteed 5% monthly returns, join telegram now, hurry limited offer")
    assert label == PromoLabel.promotion and score > 0.65 and len(signals) >= 2


def test_plain_question_is_education():
    label, score, _ = classify("What is NAV? NAV means per-share value, explained simply")
    assert label == PromoLabel.education and score < 0.35


def test_hindi_guarantee_caught():
    label, _, _ = classify("गारंटी मुनाफा, जल्दी करो, टेलीग्राम जॉइन करो")
    assert label == PromoLabel.promotion


def test_evidence_never_binary():
    for text in ["guaranteed double money", "https://www.sebi.gov.in circular on nomination", "Nifty 12% FY2024", "What is SIP?"]:
        ev = check_evidence(text, [])
        assert ev.level.value in ("strong", "weak", "none")
        assert ev.uncertainty.strip()


def test_official_link_is_strong():
    ev = check_evidence("As per https://www.sebi.gov.in circular, nomination is mandatory", [])
    assert ev.level.value == "strong"


def test_simulator_hype_beats_real():
    sim = build_sim("Guaranteed 5% monthly returns")
    assert len(sim.projection) == 12
    assert sim.inputs["hype_final"] > sim.inputs["realistic_final"]


def test_simulator_no_claim_is_neutral():
    sim = build_sim("What is NAV?")
    assert "claimed_monthly_pct" not in sim.inputs


def test_explainer_all_langs_native():
    for lang in Lang:
        ex = explain("What is SIP?", [], lang)
        assert ex.plain_text and ex.analogy and len(ex.terms) >= 1

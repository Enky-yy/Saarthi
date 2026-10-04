"""Threshold contract tests: classifier/evidence/simulator/explainer must keep
their demo-day behavior. Run: python3 -m pytest tests/ -q"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
for v in ("GNANI_API_KEY",):
    os.environ.pop(v, None)
os.environ["SANGYAN_DB"] = "/tmp/opencode/test-pytest.db"

from app.classifier import classify  # noqa: E402
from app.evidence import check_evidence  # noqa: E402
from app.explainer import explain  # noqa: E402
from app.schemas import Lang, PromoLabel  # noqa: E402
from app.simulator import build_sim  # noqa: E402


def test_obvious_scam_is_promotion():
    label, score, signals, tags = classify("Guaranteed 5% monthly returns, join telegram now, hurry limited offer")
    assert label == PromoLabel.promotion and score > 0.65 and len(signals) >= 2
    assert "selling" in tags and "guarantee" in tags


def test_plain_question_is_education():
    label, score, _, tags = classify("What is NAV? NAV means per-share value, explained simply")
    assert label == PromoLabel.education  # score is ML confidence now, not risk
    assert tags == ["educational"]


def test_hindi_guarantee_caught():
    label, _, _, tags = classify("गारंटी मुनाफा, जल्दी करो, टेलीग्राम जॉइन करो")
    assert label == PromoLabel.promotion
    assert "guarantee" in tags and "urgency" in tags


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


def test_action_calls():
    from app.main import app
    from fastapi.testclient import TestClient
    c = TestClient(app)
    scam = c.post("/api/analyze", json={"input_text": "Guaranteed 5% monthly, join telegram", "lang": "en"}).json()
    assert scam["action"] == "stop" and "guarantee" in scam["tags"]
    safe = c.post("/api/analyze", json={"input_text": "What is NAV? NAV means per-share value, explained", "lang": "en"}).json()
    assert safe["action"] == "learn" and "educational" in safe["tags"]
    funnel = c.post("/api/analyze", json={"input_text": "SEBI registered jackpot multibagger, use my code", "lang": "en"}).json()
    assert funnel["action"] == "stop"
    invite = c.post("/api/analyze", json={"input_text": "Join our telegram for daily market updates", "lang": "en"}).json()
    assert invite["action"] == "stop"  # stranger-group funnels are danger, not curiosity


def test_search_rag():
    from app.main import app
    from fastapi.testclient import TestClient
    c = TestClient(app)
    r = c.post("/api/search", json={"q": "UPI fraud PIN", "lang": "en"}).json()
    assert "upi_fraud" in [s["id"] for s in r["sources"]] and r["answer"]
    r = c.post("/api/search", json={"q": "  ", "lang": "en"})
    assert r.status_code == 422
    r = c.post("/api/ingest-url", json={"url": "https://x.com/a.png"}).json()
    assert r["kind"] == "image"


def test_calcs_math():
    from app.calcs import TOOL_FN
    sip, _ = TOOL_FN["sip"]({"pmt": 5000, "rate": 12, "years": 10})
    assert abs(sip["final_value"] - 1150193.45) < 1.0  # standard SIP formula
    from app.main import app
    from fastapi.testclient import TestClient
    c = TestClient(app)
    assert c.post("/api/calc", json={"tool": "nope", "inputs": {}}).status_code == 422
    r = c.post("/api/calc", json={"tool": "emi", "inputs": {"principal": 500000, "rate": 9, "years": 5}, "lang": "en"}).json()
    assert abs(r["results"]["emi"] - 10379.18) < 1.0
    r = c.post("/api/calc", json={"tool": "ror", "inputs": {"start": 100000, "end": 200000, "years": 5}, "lang": "en"}).json()
    assert abs(r["results"]["cagr_pct"] - 14.87) < 0.01
    r = c.post("/api/calc", json={"tool": "sip", "inputs": {"pmt": 1e12, "rate": 99, "years": 99}, "lang": "en"}).json()
    assert r["results"]["final_value"] > 0  # clamped, never crashes

"""Eval the trained MuRIL classifier: accuracy, per-class F1, scam recall,
plus hand-picked tricky cases (the ones that decide stamps).
Usage: python3 scripts/eval_muril.py"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))

TRICKY = [
    ("Guaranteed 5% monthly returns, join telegram now", "promotion"),
    ("Join our telegram for daily market updates", "promotion"),
    ("What is NAV? NAV means per-share value, explained simply", "education"),
    ("गारंटी मुनाफा, जल्दी करो, टेलीग्राम जॉइन करो", "promotion"),
    ("SIP kya hai, compounding samjhao", "education"),
    ("SEBI registered jackpot multibagger, use my code", "promotion"),
    ("Nifty may give good returns this year, details inside", "mixed"),
    ("What is NAV?", "education"),
    ("As per https://www.sebi.gov.in circular", "education"),
    ("Nomination is mandatory for demat accounts", "education"),
    ("File your complaint free on SCORES", "education"),
]


def ham_regression() -> list[str]:
    import json as _json
    import os as _os
    p = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "data", "real_ham_eval.jsonl")
    try:
        with open(p, encoding="utf-8") as f:
            return [_json.loads(l)["text"] for l in f][:100]
    except Exception:
        return []


def main() -> None:
    from app.classifier import _ml_predict
    from app.schemas import PromoLabel
    ok = total = 0
    scam_ok = scam_total = 0
    for text, want in TRICKY:
        got = _ml_predict(text)
        label = got[0].value if got else "NO-MODEL"
        mark = "OK " if label == want else "MISS"
        print(f"{mark} want={want:10s} got={label:10s} :: {text[:60]}")
        total += 1
        ok += label == want
        if want == "promotion":
            scam_total += 1
            scam_ok += label == want
    print(f"tricky accuracy: {ok}/{total} | scam recall: {scam_ok}/{scam_total}")
    stops = 0
    other_ok = 0
    ham = ham_regression()
    for text in ham:
        got = _ml_predict(text)
        if not got:
            continue
        if got[0].value == "promotion":
            stops += 1
            print(f"FALSE-STOP :: {text[:70]}")
        if got[0].value == "other":
            other_ok += 1
    print(f"ham: {other_ok}/{len(ham)} read as chatter (other), {stops} false stops")


if __name__ == "__main__":
    main()

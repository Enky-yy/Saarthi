"""Fetch real public scam corpora -> data/real_promotion.jsonl (train) +
data/real_ham_eval.jsonl (must-never-stop regression set).
Sources (public, research-oriented):
- anmolshrivastav/scam-hum-india (Indian scam/spam SMS)
- ysangam/Indian_Cyber_Scam_PhoneCall_Hinglish_Dataset (Hinglish scam calls)
Ham/personal rows are NEVER labeled education (they're chit-chat, not
teaching) — they only guard against false stops.
Usage: python3 scripts/fetch_real.py"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")


def norm(t: str) -> str:
    return re.sub(r"\s+", " ", (t or "").strip().lower())


def main() -> None:
    from datasets import load_dataset
    promo, seen = [], set()

    def add(text: str) -> None:
        key = norm(text)
        if len(key) > 15 and key not in seen:
            seen.add(key)
            promo.append({"text": text.strip()[:800], "label": "promotion"})

    d1 = load_dataset("anmolshrivastav/scam-hum-india", split="train")
    for r in d1:
        if str(r["label"]).lower() == "spam" and r["text"]:
            add(r["text"])
    print(f"scam-hum-india spam: {len(promo)}")

    d2 = load_dataset("ysangam/Indian_Cyber_Scam_PhoneCall_Hinglish_Dataset", split="train")
    n0 = len(promo)
    ham_eval = []
    for r in d2:
        if not r["text"]:
            continue
        if int(r["label"]) == 1:
            add(f"[{r.get('scam_category', 'scam')}] " + r["text"])
        else:
            key = norm(r["text"])
            if len(key) > 15 and key not in seen:
                seen.add(key)
                ham_eval.append(r["text"].strip()[:400])
    print(f"hinglish scam added: {len(promo) - n0}, ham eval: {len(ham_eval)}")

    with open(os.path.join(DATA, "real_promotion.jsonl"), "w", encoding="utf-8") as f:
        for r in promo:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(os.path.join(DATA, "real_ham_eval.jsonl"), "w", encoding="utf-8") as f:
        for t in ham_eval[:2000]:
            f.write(json.dumps({"text": t}, ensure_ascii=False) + "\n")
    print(f"total real promotion rows: {len(promo)}")


if __name__ == "__main__":
    main()

import re
from .schemas import PromoLabel

# signal -> (weight, user-facing signal, machine tag)
_PATTERNS: list[tuple[str, float, str, str]] = [
    # guarantee / assured returns — strongest promo signal
    (r"guarantee\w*|assured|100%\s*sure|risk-?free|double money|\b10x\b|\b\d+x\b|पक्का\s*मुनाफा|गारंटी|गॅरंटी|உத்தரவாதம்", 0.45, "guarantee/assured-return claim", "guarantee"),
    # urgency / FOMO
    (r"hurry|act now|last chance|limited (offer|seats|slots)|only \d+ left|जल्दी\s*करो|सीमित\s*ऑफर|मर्यादित\s*ऑफर|அவசரம்", 0.25, "urgency/FOMO pressure", "urgency"),
    # CTA to closed group / link
    (r"join[\w\s]{0,25}(telegram|whatsapp|group)|(telegram|whatsapp)\s+(group|channel|link)|click (here|link)|link in bio|\bDM\b|whatsapp (pe|par|number)|टेलीग्राम\s*(जॉइन|ज्वाइन)|लिंक\s*(पर\s*क्लिक|इन\s*बायो)", 0.25, "closed-group/link CTA", "group_cta"),
    # selling / referral funnel
    (r"open demat|use my code|referral|discount|buy now|subscribe|affiliate|मेरा\s*कोड|डीमैट\s*खोलो", 0.20, "selling/referral funnel", "referral"),
    # fake authority + tip language
    (r"sebi registered|nse approved|insider tip|jackpot call|multibagger|sureshot|सेबी\s*रजिस्टर्ड|सेबी\s*पंजीकृत|शर्तिया\s*टिप", 0.20, "authority/tip language", "authority_tip"),
    # money-pressure (emergency funds / loans) — context flag, lighter weight
    (r"emergency fund|instant loan|borrow.*invest|लोन\s*लेकर|उधार\s*लेकर", 0.15, "risky-money context", "risky_money"),
]

_EDU_MARKERS = r"what is|means|explained|learn|understand|how .* works|क्या\s*है|मतलब|समझो|म्हणजे\s*काय|என்றால்\s*என்ன"


def classify(text: str) -> tuple[PromoLabel, float, list[str], list[str]]:
    t = (text or "").lower()
    signals: list[str] = []
    tags: list[str] = []
    score = 0.0
    for pat, weight, label, tag in _PATTERNS:
        if re.search(pat, t, re.IGNORECASE):
            score += weight
            signals.append(label)
            tags.append(tag)
    # education markers slightly reduce score, never below 0
    if re.search(_EDU_MARKERS, t, re.IGNORECASE) and not signals:
        return PromoLabel.education, 0.1, ["educational phrasing"], ["educational"]
    if re.search(_EDU_MARKERS, t, re.IGNORECASE):
        score = max(0.0, score - 0.15)
        signals.append("has educational phrasing (mixed)")
    score = min(1.0, round(score, 2))
    if score < 0.35:
        return PromoLabel.education, score, signals, ([] if tags else ["educational"]) + tags
    if score <= 0.65:
        return PromoLabel.mixed, score, signals, tags
    return PromoLabel.promotion, score, signals, ["selling"] + tags

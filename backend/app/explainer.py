import re
from .schemas import Claim, Explainer, Lang, TermMeaning

# minimal jargon pack — extend or replace with LLM/Bhashini in prod
_JARGON: dict[str, dict[str, str]] = {
    "NAV": {"en": "per-share value of a mutual fund, changes daily", "hi": "mutual fund ke ek hisse ki keemat, roz badalti hai"},
    "SIP": {"en": "fixed small investment every month to build habit", "hi": "har mahine thodi-thodi nivesh ki aadat"},
    "volatility": {"en": "how much prices jump up and down", "hi": "keemat ka upar-neeche hilna"},
    "compounding": {"en": "profit on profit over time, like interest on interest", "hi": "munafe par munafa, byaaj par byaaj jaise"},
    "diversification": {"en": "not putting all money in one place", "hi": "saara paisa ek jagah na lagana"},
    "leverage": {"en": "borrowed money to invest — losses also grow bigger", "hi": "udhaar lekar nivesh — nuksaan bhi bada hota hai"},
    "demat": {"en": "digital locker for your shares", "hi": "share rakhne ka digital locker"},
    "nomination": {"en": "naming who gets your investments after you", "hi": "aapke baad paisa kise milega, yeh chunna"},
    "SCORES": {"en": "SEBI's free portal to complain against brokers", "hi": "broker ke khilaaf shikayat ka SEBI portal, muft hai"},
    "guaranteed returns": {"en": "promise of fixed profit — no one can promise this in markets", "hi": "pakke munafe ka vaada — bazaar me yeh koi nahi de sakta"},
}

_ANALOGY: dict[str, dict[str, str]] = {
    "NAV": {"en": "Like the price of one sabzi thali that changes with vegetable rates.", "hi": "Jaise sabzi thali ka daam roz sabzi ke bhav se badalta hai."},
    "volatility": {"en": "Like a bus on a bumpy village road — same route, jerky ride.", "hi": "Jaise kachchi sadak par bus — rasta wahi, jhatke lagte hain."},
    "compounding": {"en": "Like a snowball rolling down — small start, grows as it rolls.", "hi": "Jaise belan se aata gundhna nahi — jaise golak aage badhkar bada hota hai."},
    "default": {"en": "Like monsoon promise: no one can guarantee rain.", "hi": "Jaise mausam ka vaada: baarish ki guarantee koi nahi de sakta."},
}

_CLOSER = {
    "en": " Learn first, never act on a tip alone.",
    "hinglish": " Pehle samjho, tip par turant paisa mat lagao.",
    "hi": " पहले समझो, टिप पर तुरंत पैसा मत लगाओ।",
    "mr": " आधी समजून घ्या, टिपवर लगेच पैसे लावू नका.",
    "ta": " முதலில் புரிந்து கொள்ளுங்கள், டிப்-ஐ நம்பி உடனே பணம் போடாதீர்கள்.",
}


def _pick_topic(text: str) -> str:
    t = (text or "").lower()
    for key in _JARGON:
        if key.lower() in t:
            return key
    if re.search(r"guarantee|गारंटी|10x|double money", t):
        return "guaranteed returns"
    if re.search(r"sip|हर महीन", t):
        return "SIP"
    return "NAV"


def explain(text: str, claims: list[Claim], lang: Lang) -> Explainer:
    topic = _pick_topic(text)
    pack = _JARGON.get(topic, _JARGON["NAV"])
    analogy_pack = _ANALOGY.get(topic, _ANALOGY["default"])
    lkey = lang.value if lang.value in ("en", "hi") else "hinglish" if lang == Lang.hinglish else "en"
    meaning = pack.get(lkey if lkey in pack else "en")
    analogy = analogy_pack.get(lkey if lkey in analogy_pack else "en")
    closer = _CLOSER.get(lang.value, _CLOSER["hinglish"])

    if lang == Lang.hi:
        plain = f"{topic} ka matlab: {meaning}." + closer
    elif lang == Lang.hinglish:
        plain = f"{topic} matlab: {meaning}. Theory me simple hai, practice me keemat upar-neeche hoti hai." + closer
    else:
        plain = f"{topic}: {meaning}." + closer

    terms = [TermMeaning(term=topic, meaning=meaning)]
    # add one extra term if text mentions another jargon
    for k, v in _JARGON.items():
        if k != topic and k.lower() in (text or "").lower():
            terms.append(TermMeaning(term=k, meaning=v.get(lkey if lkey in v else "en")))
            break
    return Explainer(plain_text=plain, analogy=analogy, terms=terms[:3])

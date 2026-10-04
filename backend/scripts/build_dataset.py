"""Synthetic training set for the MuRIL scam-vs-education classifier.
Templates x slots x languages + typo noise. Labels: education/mixed/promotion.
Usage: python3 scripts/build_dataset.py  -> data/train.jsonl (+ eval split inside trainer)
Wall reports (data/history.db) are appended when present — the data flywheel."""
import json
import os
import random
import sqlite3

random.seed(7)
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
os.makedirs(DATA, exist_ok=True)

PCT = ["3%", "5%", "7%", "10%", "2.5%"]
GRP = {"en": ["Telegram group", "WhatsApp group"], "hi": ["टेलीग्राम ग्रुप", "व्हाट्सऐप ग्रुप"],
       "hinglish": ["Telegram group", "Whatsapp group"], "mr": ["टेलीग्राम ग्रुप"], "ta": ["டெலிகிராம் குழு"]}
URG = {"en": ["hurry, only 50 seats left", "offer ends tonight", "act now"],
       "hi": ["जल्दी करो, सिर्फ 50 सीटें", "ऑफर आज रात खत्म", "अभी करो"],
       "hinglish": ["jaldi karo, sirf 50 seats", "offer aaj raat khatm"],
       "mr": ["लवकर करा, फक्त 50 जागा"], "ta": ["அவசரம், 50 இடங்கள் மட்டும்"]}

SCAM_T = {
    "en": ["Guaranteed {p} monthly profit! Join our {g} now — {u}.",
           "Double your money in 6 months. I am SEBI-registered, DM for the link.",
           "Multibagger jackpot call! Pay advance today to block your slot."],
    "hi": ["हर महीने {p} पक्का मुनाफा! अभी हमारा {g} जॉइन करें — {u}।",
           "6 महीने में पैसा दोगुना। मैं SEBI-पंजीकृत हूँ, लिंक हेतु DM करें।",
           "मल्टीबैगर जैकपॉट! स्लॉट हेतु आज ही एडवांस दें।"],
    "hinglish": ["Har mahine {p} pakka munafa! Abhi hamara {g} join karo — {u}.",
                 "6 mahine me paisa double. Main SEBI-registered hoon, link ke liye DM karo.",
                 "Multibagger jackpot! Slot ke liye aaj hi advance do."],
    "mr": ["दरमहा {p} खात्रीशीर नफा! आमचा {g} आत्ताच जॉइन करा — {u}。",
           "6 महिन्यांत पैसे दुप्पट. मी SEBI-नोंदणीकृत आहे, लिंकसाठी DM करा."],
    "ta": ["மாதம் {p} உத்தரவாத லாபம்! எங்கள் {g} இப்போதே சேருங்கள் — {u}。",
           "6 மாதத்தில் பணம் இரட்டிப்பு. நான் SEBI-பதிவு, இணைப்புக்கு DM."],
}
EDU_T = {
    "en": ["What is {t}? {t} means {m}. Learn the basics before investing a rupee.",
           "{t} explained simply: {m}. Patience beats tips.",
           "New to markets? Start by understanding {t}: {m}."],
    "hi": ["{t} क्या है? {t} का मतलब {m}। एक रुपया लगाने से पहले बुनियाद समझें।",
           "{t} सरल भाषा में: {m}। धैर्य टिप से बड़ा है।"],
    "hinglish": ["{t} kya hai? {t} matlab {m}। Paisa lagane se pehle basic samjho.",
                 "{t} simple me: {m}। Sabr tip se bada hai."],
    "mr": ["{t} म्हणजे काय? {t} म्हणजे {m}। गुंतवणुकीआधी पाया समजा."],
    "ta": ["{t} என்றால் என்ன? {t} என்பது {m}。 முதலில் அடிப்படையைப் புரிந்துகொள்ளுங்கள்."],
}
MIX_T = {
    "en": ["{t} means {m}. Open your free demat with my link to start today!",
           "Learn {t}: {m}. Join our free webinar this Sunday, limited seats!",
           "SIP builds habit. Use my referral code for zero-fee setup."],
    "hi": ["{t} का मतलब {m}। आज ही मेरे लिंक से मुफ़्त डीमैट खोलें!",
           "{t} सीखें: {m}। इस रविवार मुफ़्त वेबिनार जॉइन करें, सीटें सीमित!"],
    "hinglish": ["{t} matlab {m}। Aaj hi mere link se free demat kholo!",
                 "{t} seekho: {m}। Is Sunday free webinar join karo, seats limited!"],
    "mr": ["{t} म्हणजे {m}। आजच माझ्या लिंकने मोफत डीमॅट उघडा!"],
    "ta": ["{t} என்பது {m}。 என் இணைப்பில் இலவச டீமேட் திறக்கவும்!"],
}
TERMS = [("NAV", {"en": "per-share fund value", "hi": "प्रति-हिस्सा फंड मूल्य", "hinglish": "per-share fund value", "mr": "प्रति-हिश्श्ता मूल्य", "ta": "பங்கு மதிப்பு"}),
         ("SIP", {"en": "monthly investing habit", "hi": "मासिक निवेश आदत", "hinglish": "monthly nivesh aadat", "mr": "मासिक गुंतवणूक सवय", "ta": "மாத முதலீட்டுப் பழக்கம்"}),
         ("volatility", {"en": "prices moving up and down", "hi": "कीमतों का उतार-चढ़ाव", "hinglish": "keemat upar-neeche", "mr": "किमतींची चढ-उतार", "ta": "விலை ஏற்ற இறக்கம்"})]
FILLER = {"en": ["Share this with family. ", "Think before you invest. "],
          "hi": ["परिवार से साझा करें। ", "निवेश से पहले सोचें। "],
          "hinglish": ["Family se share karo. ", "Invest karne se pehle socho. "],
          "mr": ["कुटुंबासोबत शेअर करा. "], "ta": ["குடும்பத்துடன் பகிரவும். "]}

# Formal, official-tone education WITHOUT how-to phrasing — stops the model
# from equating "SEBI/registration mention" with promotion.
FORMAL = {
    "en": ["As per the SEBI circular, nomination is mandatory for demat accounts.",
           "SCORES portal allows investors to file complaints free of charge.",
           "AMFI data shows SIP contributions rose this quarter.",
           "NSE will conduct a mock trading session on Sunday.",
           "Unclaimed dividends can be recovered through IEPF."],
    "hi": ["SEBI परिपत्र के अनुसार डीमैट हेतु नामांकन अनिवार्य है।",
           "SCORES पोर्टल पर निवेशक मुफ़्त शिकायत दर्ज कर सकते हैं।",
           "बेदावा लाभांश IEPF से वापस पाया जा सकता है।",
           "KYC हेतु PAN व आधार आवश्यक हैं।"],
    "hinglish": ["SEBI circular ke anusaar demat hetu nomination anivarya hai.",
                 "SCORES portal par investor muft shikayat kar sakte hain.",
                 "Unclaimed dividend IEPF se wapas mil sakta hai."],
    "mr": ["SEBI परिपत्रकानुसार डीमॅटसाठी नामांकन बंधनकारक आहे.",
           "SCORES पोर्टलवर गुंतवणूकदार मोफत तक्रार करू शकतात."],
    "ta": ["SEBI சுற்றறிக்கைப்படி டீமேட்டுக்கு நாமினி கட்டாயம்.",
           "SCORES இணையதளத்தில் இலவசமாகப் புகார் செய்யலாம்."],
}


def typo(s: str) -> str:
    if len(s) < 8 or random.random() > 0.12:
        return s
    i = random.randrange(1, len(s) - 1)
    return s[:i] + s[i + 1] + s[i] + s[i + 2:]


def gen(lang: str, n: int) -> list[dict]:
    rows = []
    per = n // 3
    for _ in range(per):
        rows.append({"text": typo(random.choice(SCAM_T[lang]).format(
            p=random.choice(PCT), g=random.choice(GRP[lang]), u=random.choice(URG[lang]))), "label": "promotion"})
    for _ in range(per):
        t, m = random.choice(TERMS)
        rows.append({"text": typo(random.choice(EDU_T[lang]).format(t=t, m=m.get(lang, m["en"]))), "label": "education"})
    for _ in range(per):
        t, m = random.choice(TERMS)
        rows.append({"text": typo(random.choice(MIX_T[lang]).format(t=t, m=m.get(lang, m["en"]))), "label": "mixed"})
    for r in rows:
        if random.random() < 0.3:
            r["text"] = random.choice(FILLER[lang]) + r["text"]
    for _ in range(300):
        rows.append({"text": typo(random.choice(FORMAL[lang])), "label": "education"})
    return rows


def wall_rows() -> list[dict]:
    """Real reports become promotion examples — the flywheel hook."""
    db = os.path.join(DATA, "history.db")
    if not os.path.exists(db):
        return []
    try:
        con = sqlite3.connect(db)
        rows = con.execute("SELECT scam_type, text FROM wall WHERE text != ''").fetchall()
        con.close()
        return [{"text": t[:500], "label": "promotion"} for _, t in rows if t and len(t) > 20]
    except Exception:
        return []


def main() -> None:
    rows = []
    for lang in ("en", "hi", "hinglish", "mr", "ta"):
        rows += gen(lang, 3600)
    rows += wall_rows()
    # Real public scam rows: keep every one (already deduped), then trim
    # synthetic promotion so real patterns dominate the scam side.
    try:
        with open(os.path.join(DATA, "real_promotion.jsonl"), encoding="utf-8") as f:
            real = [json.loads(l) for l in f]
    except Exception:
        real = []
    synth_promo = [r for r in rows if r["label"] == "promotion"]
    rest = [r for r in rows if r["label"] != "promotion"]
    keep = 4200 - len(real)
    rows = rest + random.sample(synth_promo, max(0, min(len(synth_promo), keep))) + real
    random.shuffle(rows)
    path = os.path.join(DATA, "train.jsonl")
    with open(path, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    from collections import Counter
    print(f"wrote {len(rows)} rows -> {path}", Counter(r["label"] for r in rows))


if __name__ == "__main__":
    main()

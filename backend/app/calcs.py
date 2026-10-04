"""Educate-Bharat calculator suite. Pure math, no advice: every tool shows
what the numbers do and teaches *why* in plain words (EN + HI templates)."""
from .schemas import Lang

ANN = " — illustration only, not a prediction or recommendation."


def _yearly_sip(pmt: float, mr: float, months: int) -> list[float]:
    out, fv = [], 0.0
    for m in range(1, months + 1):
        fv = (fv + pmt) * (1 + mr) if mr else fv + pmt
        if m % 12 == 0 or m == months:
            out.append(round(fv, 2))
    return out


def c_sip(pmt, rate, years):
    r, n = rate / 100 / 12, int(years * 12)
    fv = round(pmt * ((((1 + r) ** n) - 1) / r), 2) if r else pmt * n
    invested = round(pmt * n, 2)
    return {"invested": invested, "final_value": fv, "gains": round(fv - invested, 2)}, _yearly_sip(pmt, r, n)


def c_compound(principal, rate, years, freq=1):
    r = rate / 100 / freq
    fv = round(principal * (1 + r) ** (freq * years), 2)
    series = [round(principal * (1 + r) ** (freq * y), 2) for y in range(int(years) + 1)]
    return {"invested": round(principal, 2), "final_value": fv, "gains": round(fv - principal, 2)}, series


def c_inflation(amount, rate, years):
    i = rate / 100
    future = round(amount * (1 + i) ** years, 2)
    worth = round(amount / ((1 + i) ** years), 2)
    series = [round(amount * (1 + i) ** y, 2) for y in range(int(years) + 1)]
    return {"today": round(amount, 2), "future_cost": future, "worth_in_today_money": worth}, series


def c_emi(principal, rate, years):
    r, n = rate / 100 / 12, int(years * 12)
    emi = round(principal * r * (1 + r) ** n / ((1 + r) ** n - 1), 2) if r else round(principal / n, 2)
    bal, yearly, total_int, paid = float(principal), [], 0.0, 0.0
    for m in range(1, n + 1):
        interest = bal * r
        total_int += interest
        bal = max(0.0, bal + interest - emi)
        paid += emi
        if m % 12 == 0 or m == n:
            yearly.append(round(bal, 2))
    return {"emi": emi, "total_interest": round(total_int, 2), "total_payment": round(paid, 2)}, yearly


def c_ror(start, end, years):
    cagr = round((((end / start) ** (1 / years)) - 1) * 100, 2) if start > 0 and years > 0 else 0.0
    multiple = round(end / start, 2) if start > 0 else 0.0
    series = [round(start * (1 + cagr / 100) ** y, 2) for y in range(int(years) + 1)]
    return {"cagr_pct": cagr, "multiple": multiple}, series


def c_bond(face, coupon, price, years):
    annual_coupon = face * coupon / 100
    cy = round(annual_coupon / price * 100, 2) if price else 0.0
    ytm = round((annual_coupon + (face - price) / years) / ((face + price) / 2) * 100, 2) if years and price else 0.0
    return {"current_yield_pct": cy, "approx_ytm_pct": ytm, "annual_coupon": round(annual_coupon, 2)}, [round(price, 2), round(face, 2)]


def c_retire(annual_goal, years_to_ret, inflation, expected_return):
    corpus_today = annual_goal * 25  # 4% rule illustration
    corpus_future = round(corpus_today * (1 + inflation / 100) ** years_to_ret, 2)
    r, n = expected_return / 100 / 12, int(years_to_ret * 12)
    sip = round(corpus_future * r / (((1 + r) ** n) - 1), 2) if r and n else round(corpus_future / max(1, n), 2)
    series = [round(sip * ((((1 + r) ** k) - 1) / r), 2) if r else sip * k for k in range(0, n + 1, max(1, n // 12))]
    return {"corpus_needed_today": round(corpus_today, 2), "corpus_needed_then": corpus_future, "monthly_sip": sip}, series


EXPLAIN = {
    "sip": ("Small monthly investments grow through compounding — profit earns its own profit. Starting early beats investing more later.",
            "छोटा मासिक निवेश चक्रवृद्धि से बढ़ता है — मुनाफा खुद मुनाफा कमाता है। जल्दी शुरू करना, बाद में ज़्यादा लगाने से बेहतर है।"),
    "compound": ("One-time money grows fastest when left untouched for years. Time does the heavy lifting, not timing.",
                 "एकमुश्त पैसा सालों तक छूए बिना सबसे तेज़ बढ़ता है। समय मेहनत करता है, सही मौका पकड़ना नहीं।"),
    "inflation": ("Prices rising 6% a year halves your money's power in ~12 years. Returns below inflation mean shrinking wealth.",
                  "सालाना 6% महंगाई ~12 साल में पैसे की ताक़त आधी कर देती है। महंगाई से कम रिटर्न यानी घटती दौलत।"),
    "emi": ("Every EMI is part loan-return, part interest-gift to the bank. Longer loans feel cheaper monthly but cost far more overall.",
            "हर EMI में हिस्सा कर्ज़-वापसी, हिस्सा बैंक को ब्याज़-उपहार है। लंबा कर्ज़ मासिक सस्ता लगता है पर कुल महंगा पड़ता है।"),
    "ror": ("CAGR is the true yearly speed of your money — it smooths out jumpy years into one honest number. Compare it with inflation.",
            "CAGR आपके पैसे की असली सालाना रफ़्तार है — यह उछल-कूद वाले सालों को एक ईमानदार संख्या में समेटता है। इसकी तुलना महंगाई से करें।"),
    "bond": ("A bond pays fixed yearly interest (coupon). If you pay more than face value, your real yield falls — price and yield move opposite.",
             "बॉन्ड सालाना तय ब्याज़ (कूपन) देता है। अंकित मूल्य से ज़्यादा चुकाएं तो असली यील्ड घटती है — कीमत और यील्ड उल्टी दिशा में चलते हैं।"),
    "retire": ("Retirement needs ~25× your yearly spending (4% rule). Inflation makes that corpus much bigger by the time you retire — SIP bridges the gap.",
               "रिटायरमेंट हेतु सालाना खर्च का ~25 गुना चाहिए (4% नियम)। तब तक महंगाई यह राशि बहुत बढ़ा देती है — SIP यह खाई पाटती है।"),
}

SPECS = {
    "sip": {"fields": [("pmt", "Monthly investment ₹", 500, 100000, 5000), ("rate", "Expected return % p.a.", 1, 30, 12), ("years", "Years", 1, 40, 10)]},
    "compound": {"fields": [("principal", "One-time amount ₹", 1000, 10000000, 100000), ("rate", "Rate % p.a.", 1, 30, 10), ("years", "Years", 1, 40, 10)]},
    "inflation": {"fields": [("amount", "Amount today ₹", 100, 100000000, 100000), ("rate", "Inflation % p.a.", 0.5, 20, 6), ("years", "Years", 1, 40, 10)]},
    "emi": {"fields": [("principal", "Loan amount ₹", 10000, 10000000, 500000), ("rate", "Interest % p.a.", 1, 30, 9), ("years", "Years", 1, 30, 5)]},
    "ror": {"fields": [("start", "Start value ₹", 100, 100000000, 100000), ("end", "End value ₹", 100, 1000000000, 200000), ("years", "Years", 1, 40, 5)]},
    "bond": {"fields": [("face", "Face value ₹", 100, 1000000, 1000), ("coupon", "Coupon % p.a.", 0.5, 20, 7), ("price", "Market price ₹", 100, 1000000, 950), ("years", "Years to maturity", 1, 30, 5)]},
    "retire": {"fields": [("annual_goal", "Yearly need in today's ₹", 50000, 10000000, 600000), ("years_to_ret", "Years to retirement", 1, 45, 20), ("inflation", "Inflation % p.a.", 1, 15, 6), ("expected_return", "Expected return % p.a.", 1, 20, 12)]},
}

TOOL_FN = {
    "sip": lambda i: c_sip(i["pmt"], i["rate"], i["years"]),
    "compound": lambda i: c_compound(i["principal"], i["rate"], i["years"]),
    "inflation": lambda i: c_inflation(i["amount"], i["rate"], i["years"]),
    "emi": lambda i: c_emi(i["principal"], i["rate"], i["years"]),
    "ror": lambda i: c_ror(i["start"], i["end"], i["years"]),
    "bond": lambda i: c_bond(i["face"], i["coupon"], i["price"], i["years"]),
    "retire": lambda i: c_retire(i["annual_goal"], i["years_to_ret"], i["inflation"], i["expected_return"]),
}


def describe(tool: str, lang: Lang) -> str:
    en, hi = EXPLAIN[tool]
    return (hi if lang.value == "hi" else en) + ANN

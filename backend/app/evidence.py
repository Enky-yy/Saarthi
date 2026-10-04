import re
from .schemas import Claim, Evidence, EvidenceLevel, EvidenceSource

_URL_RE = re.compile(r"https?://[^\s)>\]]+")
_OFFICIAL = ("sebi.gov.in", "scores.sebi.gov.in", "nseindia.com", "bseindia.com", "rbi.org.in", "amfiindia.com", "iepf.gov.in")
_NUMBER_RE = re.compile(r"\d+(\.\d+)?\s*%|\b\d{4}\b|₹\s?[\d,]+|Rs\.?\s?[\d,]+|crore|lakh|FY\d{2,4}")
_GUARANTEE_RE = re.compile(r"guarantee|assured|100%\s*sure|risk-?free|double money|\b\d+x\b|multibagger|sureshot|गारंटी|पक्का\s*मुनाफा", re.IGNORECASE)

_SUGGESTED = [
    ("SEBI official site", "https://www.sebi.gov.in"),
    ("SCORES grievance portal", "https://scores.sebi.gov.in"),
    ("NSE India", "https://www.nseindia.com"),
]

_SUGGESTED = [
    ("SEBI official site", "https://www.sebi.gov.in"),
    ("SCORES grievance portal", "https://scores.sebi.gov.in"),
    ("NSE India", "https://www.nseindia.com"),
]

# Native (summary, uncertainty) per evidence state. Hand-written: instant,
# correct, and offline — small-model MT proved too unreliable for this.
EVID = {
"strong": {
 "en": ("Cites official source(s); still verify the exact page/date before acting.", "Even official links can be quoted out of context. Check the source page directly."),
 "hinglish": ("Isme sarkari source ka hawala hai — phir bhi page/taareekh khud verify karo.", "Sarkari link ko bhi galat context me quote kiya ja sakta hai. Source page khud dekho."),
 "hi": ("इसमें आधिकारिक स्रोत का हवाला है — फिर भी पेज/तारीख़ खुद सत्यापित करें।", "आधिकारिक लिंक को भी ग़लत संदर्भ में उद्धृत किया जा सकता है। स्रोत पेज स्वयं देखें।"),
 "mr": ("यात अधिकृत स्रोताचा हवाला आहे — तरी पान/तारीख स्वतः तपासा।", "अधिकृत लिंकही चुकीच्या संदर्भात वापरता येते. स्रोत पान स्वतः पहा."),
 "ta": ("இதில் அதிகாரப்பூர்வ ஆதாரக் குறிப்பு உள்ளது — பக்கம்/தேதியை நீங்களே சரிபார்க்கவும்.", "அதிகார இணைப்புகளையும் தவறான சூழலில் மேற்கோள் காட்டலாம். மூலப் பக்கத்தை நேரடியாகப் பாருங்கள்."),
 "bn": ("এতে সরকারি উৎসের উল্লেখ আছে — তবু পেজ/তারিখ নিজে যাচাই করুন।", "সরকারি লিংকও ভুল প্রসঙ্গে উদ্ধৃত হতে পারে। উৎস পেজ সরাসরি দেখুন।"),
 "te": ("దీంట్లో అధికారిక మూలం ఉంది — అయినా పేజీ/తేదీ మీరే ధృవీకరించండి.", "అధికారిక లింకులను కూడా తప్పు సందర్భంలో చూపవచ్చు. మూల పేజీ నేరుగా చూడండి."),
 "kn": ("ಇದರಲ್ಲಿ ಅಧಿಕೃತ ಮೂಲದ ಉಲ್ಲೇಖವಿದೆ — ಆದರೂ ಪುಟ/ದಿನಾಂಕ ನೀವೇ ಪರಿಶೀಲಿಸಿ.", "ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳನ್ನೂ ತಪ್ಪು ಸಂದರ್ಭದಲ್ಲಿ ಬಳಸಬಹುದು. ಮೂಲ ಪುಟವನ್ನು ನೇರವಾಗಿ ನೋಡಿ."),
 "ml": ("ഇതിൽ ഔദ്യോഗിക ഉറവിട പരാമർശമുണ്ട് — എന്നാലും പേജ്/തീയതി നിങ്ങൾ തന്നെ പരിശോധിക്കൂ.", "ഔദ്യോഗിക ലിങ്കുകൾ പോലും തെറ്റായ സന്ദർഭത്തിൽ ഉദ്ധരിക്കാം. മൂല പേജ് നേരിട്ട് നോക്കൂ."),
 "gu": ("આમાં સત્તાવાર સ્રોતનો ઉલ્લેખ છે — છતાં પેજ/તારીખ જાતે ચકાસો.", "સત્તાવાર લિંક પણ ખોટા સંદર્ભમાં ટાંકી શકાય. મૂળ પેજ સીધું જુઓ."),
 "pa": ("ਇਸ ਵਿੱਚ ਸਰਕਾਰੀ ਸਰੋਤ ਦਾ ਹਵਾਲਾ ਹੈ — ਫਿਰ ਵੀ ਪੇਜ/ਤਾਰੀਖ਼ ਖ਼ੁਦ ਜਾਂਚੋ।", "ਸਰਕਾਰੀ ਲਿੰਕ ਵੀ ਗ਼ਲਤ ਸੰਦਰਭ ਵਿੱਚ ਵਰਤੇ ਜਾ ਸਕਦੇ ਹਨ। ਮੂਲ ਪੇਜ ਸਿੱਧਾ ਵੇਖੋ।")},
"guarantee": {
 "en": ("Makes assured-return claims with no verifiable evidence.", "No one can guarantee market returns. Treat as unverified promotion."),
 "hinglish": ("Pakke munafe ka dawa, koi check karne layak saboot nahi.", "Bazaar me guarantee koi nahi de sakta. Ise unverified prachar mano."),
 "hi": ("पक्के मुनाफे का दावा, जांचने लायक कोई प्रमाण नहीं।", "बाज़ार में गारंटी कोई नहीं दे सकता। इसे असत्यापित प्रचार मानें।"),
 "mr": ("खात्रीशीर नफ्याचा दावा, तपासण्याजोगा पुरावा नाही.", "बाजारात हमी कोणी देऊ शकत नाही. हे अप्रमाणित प्रचार समजा."),
 "ta": ("உத்தரவாத லாபக் கூற்று, சரிபார்க்க ஆதாரம் இல்லை.", "சந்தையில் யாரும் உத்தரவாதம் தர முடியாது. இதைச் சரிபார்க்காத விளம்பரமாகக் கருதுங்கள்."),
 "bn": ("পাকা মুনাফার দাবি, যাচাইযোগ্য প্রমাণ নেই।", "বাজারে গ্যারান্টি কেউ দিতে পারে না। এটাকে অযাচাইকৃত প্রচার ধরুন।"),
 "te": ("ఖచ్చిత లాభం వాదన, ధృవీకరించే ఆధారం లేదు.", "మార్కెట్లో ఎవరూ గ్యారెంటీ ఇవ్వలేరు. దీన్ని ధృవీకరించని ప్రచారంగా భావించండి."),
 "kn": ("ಖಾತರಿ ಲಾಭದ ಹಕ್ಕು, ಪರಿಶೀಲಿಸಬಹುದಾದ ಪುರಾವೆ ಇಲ್ಲ.", "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಯಾರೂ ಗ್ಯಾರಂಟಿ ನೀಡಲಾರರು. ಇದನ್ನು ಪರಿಶೀಲಿಸದ ಪ್ರಚಾರವೆಂದು ಭಾವಿಸಿ."),
 "ml": ("ഉറപ്പുള്ള ലാഭ അവകാശവാദം, പരിശോധിക്കാവുന്ന തെളിവില്ല.", "വിപണിയിൽ ആർക്കും ഗ്യാരണ്ടി നൽകാനാവില്ല. ഇത് പരിശോധിക്കാത്ത പ്രചാരണമായി കാണൂ."),
 "gu": ("પાકા નફાનો દાવો, ચકાસીલાયક પુરાવો નથી.", "બજારમાં કોઈ ગેરંટી આપી શકે નહીં. આને અચકાસેલ પ્રચાર માનો."),
 "pa": ("ਪੱਕੇ ਮੁਨਾਫ਼ੇ ਦਾ ਦਾਅਵਾ, ਜਾਂਚਣਯੋਗ ਸਬੂਤ ਨਹੀਂ।", "ਬਾਜ਼ਾਰ ਵਿੱਚ ਕੋਈ ਗਾਰੰਟੀ ਨਹੀਂ ਦੇ ਸਕਦਾ। ਇਸਨੂੰ ਅਣਪੁਸ਼ਟ ਪ੍ਰਚਾਰ ਮੰਨੋ।")},
"weak": {
 "en": ("Has figures or links but no official source to confirm them.", "Figures without an official source cannot be trusted at face value."),
 "hinglish": ("Isme aankde ya link hain, par confirm karne hetu sarkari source nahi.", "Bina sarkari source ke aankdon par bharosa mat karo."),
 "hi": ("इसमें आंकड़े या लिंक हैं, पर पुष्टि हेतु आधिकारिक स्रोत नहीं।", "आधिकारिक स्रोत के बिना आंकड़ों पर भरोसा न करें।"),
 "mr": ("यात आकडे वा लिंक आहेत, पण खात्री हेतु अधिकृत स्रोत नाही.", "अधिकृत स्रोताशिवाय आकड्यांवर विश्वास ठेवू नका."),
 "ta": ("இதில் எண்கள்/இணைப்புகள் உள்ளன, உறுதி செய்ய அதிகார ஆதாரம் இல்லை.", "அதிகார ஆதாரமின்றி எண்களை நம்ப வேண்டாம்."),
 "bn": ("এতে সংখ্যা বা লিংক আছে, কিন্তু নিশ্চিত করতে সরকারি উৎস নেই।", "সরকারি উৎস ছাড়া সংখ্যায় ভরসা করবেন না।"),
 "te": ("దీంట్లో సంఖ్యలు/లింకులున్నాయి, నిర్ధారించడానికి అధికారిక ఆధారం లేదు.", "అధికారిక ఆధారం లేకుండా సంఖ్యలను నమ్మవద్దు."),
 "kn": ("ಇದರಲ್ಲಿ ಸಂಖ್ಯೆಗಳು/ಲಿಂಕ್‌ಗಳಿವೆ, ಖಚಿತಪಡಿಸಲು ಅಧಿಕೃತ ಮೂಲವಿಲ್ಲ.", "ಅಧಿಕೃತ ಮೂಲವಿಲ್ಲದೆ ಸಂಖ್ಯೆಗಳನ್ನು ನಂಬಬೇಡಿ."),
 "ml": ("ഇതിൽ കണക്കുകൾ/ലിങ്കുകൾ ഉണ്ട്, ഉറപ്പിക്കാൻ ഔദ്യോഗിക ഉറവിടമില്ല.", "ഔദ്യോഗിക ഉറവിടമില്ലാതെ കണക്കുകൾ വിശ്വസിക്കരുത്."),
 "gu": ("આમાં આંકડા/લિંક છે, પણ ખાતરી માટે સત્તાવાર સ્રોત નથી.", "સત્તાવાર સ્રોત વિના આંકડા પર ભરોસો ન કરો."),
 "pa": ("ਇਸ ਵਿੱਚ ਅੰਕੜੇ/ਲਿੰਕ ਹਨ, ਪਰ ਪੁਸ਼ਟੀ ਲਈ ਸਰਕਾਰੀ ਸਰੋਤ ਨਹੀਂ।", "ਸਰਕਾਰੀ ਸਰੋਤ ਤੋਂ ਬਿਨਾਂ ਅੰਕੜਿਆਂ ’ਤੇ ਭਰੋਸਾ ਨਾ ਕਰੋ।")},
"none": {
 "en": ("No verifiable evidence provided.", "Nothing here can be independently verified. Check SEBI / NSE / SCORES before acting."),
 "hinglish": ("Koi check karne layak saboot nahi diya gaya.", "Yahan kuch bhi independently verify nahi ho sakta. Kaam karne se pehle SEBI / NSE / SCORES check karo."),
 "hi": ("जांचने लायक कोई प्रमाण नहीं दिया गया।", "यहां कुछ भी स्वतंत्र रूप से सत्यापित नहीं हो सकता। कार्रवाई से पहले SEBI / NSE / SCORES जांचें।"),
 "mr": ("तपासण्याजोगा पुरावा दिलेला नाही.", "इथे काहीही स्वतंत्रपणे तपासता येत नाही. कृतीपूर्वी SEBI / NSE / SCORES तपासा."),
 "ta": ("சரிபார்க்கும் ஆதாரம் எதுவும் இல்லை.", "இங்கு எதையும் தனியே சரிபார்க்க முடியாது. செயல்படும் முன் SEBI / NSE / SCORES பாருங்கள்."),
 "bn": ("যাচাইযোগ্য প্রমাণ দেওয়া হয়নি।", "এখানে কিছুই স্বাধীনভাবে যাচাই করা যায় না। ব্যবস্থার আগে SEBI / NSE / SCORES দেখুন।"),
 "te": ("ధృవీకరించే ఆధారం ఇవ్వలేదు.", "ఇక్కడ ఏదీ స్వతంత్రంగా ధృవీకరించలేము. చర్యకు ముందు SEBI / NSE / SCORES చూడండి."),
 "kn": ("ಪರಿಶೀಲಿಸಬಹುದಾದ ಪುರಾವೆ ನೀಡಿಲ್ಲ.", "ಇಲ್ಲಿ ಯಾವುದನ್ನೂ ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗದು. ಕ್ರಮಕ್ಕೂ ಮುನ್ನ SEBI / NSE / SCORES ನೋಡಿ."),
 "ml": ("പരിശോധിക്കാവുന്ന തെളിവ് നൽകിയിട്ടില്ല.", "ഇവിടെ ഒന്നും സ്വതന്ത്രമായി പരിശോധിക്കാനാവില്ല. പ്രവർത്തിക്കുന്നതിന് മുൻപ് SEBI / NSE / SCORES നോക്കൂ."),
 "gu": ("ચકાસીલાયક પુરાવો આપ્યો નથી.", "અહીં કંઈ સ્વતંત્ર રીતે ચકાસી શકાતું નથી. કાર્યવાહી પહેલા SEBI / NSE / SCORES જુઓ."),
 "pa": ("ਜਾਂਚਣਯੋਗ ਸਬੂਤ ਦਿੱਤਾ ਨਹੀਂ ਗਿਆ।", "ਇੱਥੇ ਕੁਝ ਵੀ ਸੁਤੰਤਰ ਤੌਰ ’ਤੇ ਜਾਂਚਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ। ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ SEBI / NSE / SCORES ਵੇਖੋ।")},
}


def _extract_urls(text: str) -> list[str]:
    return _URL_RE.findall(text or "")


def check_evidence(text: str, claims: list[Claim], lang: str = "en") -> Evidence:
    urls = _extract_urls(text)
    official_hits = [u for u in urls if any(d in u for d in _OFFICIAL)]
    other_urls = [u for u in urls if u not in official_hits]
    has_numbers = bool(_NUMBER_RE.search(text or ""))
    has_guarantee = bool(_GUARANTEE_RE.search(text or ""))

    sources = [EvidenceSource(title="Official source cited", url=u) for u in official_hits]
    sources += [EvidenceSource(title="Unverified link cited", url=u) for u in other_urls[:3]]
    L = lang if lang in EVID["none"] else "en"

    def ev(key: str, level: EvidenceLevel, srcs: list) -> Evidence:
        summary, uncertainty = EVID[key].get(L, EVID[key]["en"])
        return Evidence(level=level, summary=summary, sources=srcs, uncertainty=uncertainty)

    # Never binary true/false — level + honest uncertainty only.
    if official_hits and not has_guarantee:
        return ev("strong", EvidenceLevel.strong, sources)
    if has_guarantee:
        return ev("guarantee", EvidenceLevel.none, sources)
    if other_urls or has_numbers:
        return ev("weak", EvidenceLevel.weak,
                  sources or [EvidenceSource(title=t, url=u) for t, u in _SUGGESTED])
    return ev("none", EvidenceLevel.none,
              [EvidenceSource(title=t, url=u) for t, u in _SUGGESTED])

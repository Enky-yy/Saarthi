import re
from .schemas import Claim, Explainer, Lang, TermMeaning

# Full native gloss pack for all 11 supported languages.
# Prod path: the local model upgrades `explain()` output; keep the signature.
_JARGON: dict[str, dict[str, str]] = {
    "NAV": {"en": "per-share value of a mutual fund, changes daily", "hi": "म्यूचुअल फंड के एक हिस्से की कीमत, रोज़ बदलती है", "hinglish": "mutual fund ke ek hisse ki keemat, roz badalti hai", "mr": "म्युच्युअल फंडाच्या एका हिश्याची किंमत, रोज बदलते", "ta": "மியூச்சுவல் ஃபண்டின் ஒரு பங்கு விலை, தினமும் மாறும்", "bn": "মিউচুয়াল ফান্ডের এক ইউনিটের দাম, রোজ বদলায়", "te": "మ్యూచువల్ ఫండ్ ఒక యూనిట్ ధర, రోజూ మారుతుంది", "kn": "ಮ್ಯೂಚ್ಯುವಲ್ ಫಂಡ್‌ನ ಒಂದು ಯೂನಿಟ್ ಬೆಲೆ, ಪ್ರತಿದಿನ ಬದಲಾಗುತ್ತದೆ", "ml": "മ്യൂച്വൽ ഫണ്ടിന്റെ ഒരു യൂണിറ്റിന്റെ വില, ദിവസവും മാറും", "gu": "મ્યુચ્યુઅલ ફંડના એક યુનિટની કિંમત, રોજ બદલાય છે", "pa": "ਮਿਊਚੁਅਲ ਫੰਡ ਦੇ ਇੱਕ ਯੂਨਿਟ ਦੀ ਕੀਮਤ, ਰੋਜ਼ ਬਦਲਦੀ ਹੈ"},
    "SIP": {"en": "fixed small investment every month to build habit", "hi": "हर महीने थोड़ा-थोड़ा निवेश की आदत", "hinglish": "har mahine thodi-thodi nivesh ki aadat", "mr": "दरमहा ठराविक गुंतवणुकीची सवय", "ta": "மாதந்தோறும் தவறாமல் முதலீடு செய்யும் பழக்கம்", "bn": "প্রতি মাসে নির্দিষ্ট টাকা বিনিয়োগের অভ্যাস", "te": "ప్రతి నెలా నిర్ణీత మొత్తం పెట్టుబడి అలవాటు", "kn": "ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಹಣ ಹೂಡುವ ಅಭ್ಯಾಸ", "ml": "എല്ലാ മാസവും നിശ്ചിത തുക നിക്ഷേപിക്കുന്ന ശീലം", "gu": "દર મહિને નિશ્ચિત રકમ રોકાણ કરવાની ટેવ", "pa": "ਹਰ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਰਕਮ ਨਿਵੇਸ਼ ਕਰਨ ਦੀ ਆਦਤ"},
    "volatility": {"en": "how much prices jump up and down", "hi": "कीमत का ऊपर-नीचे हिलना", "hinglish": "keemat ka upar-neeche hilna", "mr": "किमतीची वर-खाली हालचाल", "ta": "விலை மேலும் கீழும் மாறுவது", "bn": "দামের ওঠানামা", "te": "ధరలు పైకి కిందికి కదలడం", "kn": "ಬೆಲೆ ಮೇಲೆ-ಕೆಳಗೆ ಚಲಿಸುವುದು", "ml": "വില മുകളിലേക്കും താഴേക്കും മാറുന്നത്", "gu": "કિંમતની ઉપર-નીચે હલચલ", "pa": "ਕੀਮਤ ਦਾ ਉੱਪਰ-ਹੇਠਾਂ ਹਿੱਲਣਾ"},
    "compounding": {"en": "profit on profit over time, like interest on interest", "hi": "मुनाफे पर मुनाफा, ब्याज़ पर ब्याज़ जैसे", "hinglish": "munafe par munafa, byaaj par byaaj jaise", "mr": "नफ्यावर नफा, व्याजावर व्याजासारखे", "ta": "லாபத்தின் மீது லாபம், வட்டிக்கு வட்டி போல", "bn": "মুনাফার উপর মুনাফা, সুদের উপর সুদের মতো", "te": "లాభంపై లాభం, వడ్డీపై వడ్డీలా", "kn": "ಲಾಭದ ಮೇಲೆ ಲಾಭ, ಬಡ್ಡಿಯ ಮೇಲೆ ಬಡ್ಡಿಯಂತೆ", "ml": "ലാഭത്തിന് മേൽ ലാഭം, പലിശയ്ക്ക് മേൽ പലിശ പോലെ", "gu": "નફા પર નફો, વ્યાજ પર વ્યાજ જેવું", "pa": "ਮੁਨਾਫ਼ੇ ਉੱਤੇ ਮੁਨਾਫ਼ਾ, ਵਿਆਜ ਉੱਤੇ ਵਿਆਜ ਵਾਂਗ"},
    "diversification": {"en": "not putting all money in one place", "hi": "सारा पैसा एक जगह न लगाना", "hinglish": "saara paisa ek jagah na lagana", "mr": "सगळे पैसे एकाच ठिकाणी न लावणे", "ta": "எல்லாப் பணத்தையும் ஒரே இடத்தில் போடாமல் இருப்பது", "bn": "সব টাকা এক জায়গায় না লাগানো", "te": "మొత్తం డబ్బు ఒకే చోట పెట్టకుండా ఉండటం", "kn": "ಎಲ್ಲಾ ಹಣವನ್ನು ಒಂದೇ ಕಡೆ ಹಾಕದಿರುವುದು", "ml": "മുഴുവൻ പണവും ഒരിടത്ത് ഇടാതിരിക്കൽ", "gu": "બધા પૈસા એક જ જગ્યાએ ન મૂકવા", "pa": "ਸਾਰੇ ਪੈਸੇ ਇੱਕੋ ਥਾਂ ਨਾ ਲਾਉਣਾ"},
    "leverage": {"en": "borrowed money to invest — losses also grow bigger", "hi": "उधार लेकर निवेश — नुक़सान भी बड़ा होता है", "hinglish": "udhaar lekar nivesh — nuksaan bhi bada hota hai", "mr": "उसने घेऊन गुंतवणूक — तोटाही मोठा होतो", "ta": "கடன் வாங்கி முதலீடு — நஷ்டமும் பெரிதாகும்", "bn": "ধার করে বিনিয়োগ — লোকসানও বড় হয়", "te": "అప్పు చేసి పెట్టుబడి — నష్టం కూడా పెద్దదవుతుంది", "kn": "ಸಾಲ ಮಾಡಿ ಹೂಡಿಕೆ — ನಷ್ಟವೂ ದೊಡ್ಡದಾಗುತ್ತದೆ", "ml": "കടം വാങ്ങി നിക്ഷേപം — നഷ്ടവും വലുതാകും", "gu": "ઉધાર લઈને રોકાણ — નુકસાન પણ મોટું થાય", "pa": "ਉਧਾਰ ਲੈ ਕੇ ਨਿਵੇਸ਼ — ਨੁਕਸਾਨ ਵੀ ਵੱਡਾ ਹੁੰਦਾ ਹੈ"},
    "demat": {"en": "digital locker for your shares", "hi": "शेयर रखने का डिजिटल लॉकर", "hinglish": "share rakhne ka digital locker", "mr": "शेअर ठेवण्याचा डिजिटल लॉकर", "ta": "பங்குகளை வைக்கும் டிஜிட்டல் பெட்டகம்", "bn": "শেয়ার রাখার ডিজিটাল লকার", "te": "షేర్లు ఉంచే డిజిటల్ లాకర్", "kn": "ಷೇರುಗಳನ್ನು ಇಡುವ ಡಿಜಿಟಲ್ ಲಾಕರ್", "ml": "ഓഹരികൾ സൂക്ഷിക്കുന്ന ഡിജിറ്റൽ ലോക്കർ", "gu": "શેર રાખવાનું ડિજિટલ લોકર", "pa": "ਸ਼ੇਅਰ ਰੱਖਣ ਦਾ ਡਿਜਿਟਲ ਲਾਕਰ"},
    "nomination": {"en": "naming who gets your investments after you", "hi": "आपके बाद पैसा किसे मिलेगा, यह चुनना", "hinglish": "aapke baad paisa kise milega, yeh chunna", "mr": "तुमच्यानंतर पैसे कोणाला मिळतील हे निवडणे", "ta": "உங்களுக்குப் பிறகு பணம் யாருக்கு என்று தேர்வு செய்வது", "bn": "আপনার পরে টাকা কে পাবেন, তা বেছে নেওয়া", "te": "మీ తర్వాత డబ్బు ఎవరికి అనేది ఎంచుకోవడం", "kn": "ನಿಮ್ಮ ನಂತರ ಹಣ ಯಾರಿಗೆ ಎಂದು ಆಯ್ಕೆ ಮಾಡುವುದು", "ml": "നിങ്ങൾക്ക് ശേഷം പണം ആർക്ക് എന്ന് തിരഞ്ഞെടുക്കൽ", "gu": "તમારા પછી પૈસા કોને મળશે તે પસંદ કરવું", "pa": "ਤੁਹਾਡੇ ਬਾਅਦ ਪੈਸਾ ਕਿਸ ਨੂੰ ਮਿਲੇਗਾ, ਇਹ ਚੁਣਨਾ"},
    "SCORES": {"en": "SEBI's free portal to complain against brokers", "hi": "ब्रोकर के ख़िलाफ़ शिकायत का SEBI पोर्टल, मुफ़्त है", "hinglish": "broker ke khilaaf shikayat ka SEBI portal, muft hai", "mr": "ब्रोकरविरोधात तक्रारीसाठी SEBI पोर्टल, मोफत आहे", "ta": "தரகர் மீது புகார் செய்ய SEBI இணையதளம், இலவசம்", "bn": "ব্রোকারের বিরুদ্ধে অভিযোগের SEBI পোর্টাল, বিনামূল্যে", "te": "బ్రోకర్‌పై ఫిర్యాదుకు SEBI పోర్టల్, ఉచితం", "kn": "ಬ್ರೋಕರ್ ವಿರುದ್ಧ ದೂರಿಗೆ SEBI ಪೋರ್ಟಲ್, ಉಚಿತ", "ml": "ബ്രോക്കർക്കെതിരെ പരാതിക്ക് SEBI പോർട്ടൽ, സൗജന്യം", "gu": "બ્રોકર સામે ફરિયાદ માટે SEBI પોર્ટલ, મફત છે", "pa": "ਬ੍ਰੋਕਰ ਖ਼ਿਲਾਫ਼ ਸ਼ਿਕਾਇਤ ਲਈ SEBI ਪੋਰਟਲ, ਮੁਫ਼ਤ ਹੈ"},
    "guaranteed returns": {"en": "promise of fixed profit — no one can promise this in markets", "hi": "पक्के मुनाफे का वादा — बाज़ार में यह कोई नहीं दे सकता", "hinglish": "pakke munafe ka vaada — bazaar me yeh koi nahi de sakta", "mr": "खात्रीशीर नफ्याचे आश्वासन — बाजारात हे कोणीही देऊ शकत नाही", "ta": "உத்தரவாத லாப வாக்குறுதி — சந்தையில் இதை யாரும் தர முடியாது", "bn": "পাকা মুনাফার প্রতিশ্রুতি — বাজারে এটা কেউ দিতে পারে না", "te": "ఖచ్చితమైన లాభం హామీ — మార్కెట్లో ఇది ఎవరూ ఇవ్వలేరు", "kn": "ಖಾತರಿ ಲಾಭದ ಭರವಸೆ — ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇದನ್ನು ಯಾರೂ ನೀಡಲಾರರು", "ml": "ഉറപ്പുള്ള ലാഭ വാഗ്ദാനം — വിപണിയിൽ ഇത് ആർക്കും നൽകാനാവില്ല", "gu": "પાકા નફાનું વચન — બજારમાં આ કોઈ આપી શકે નહીં", "pa": "ਪੱਕੇ ਮੁਨਾਫ਼ੇ ਦਾ ਵਾਅਦਾ — ਬਾਜ਼ਾਰ ਵਿੱਚ ਇਹ ਕੋਈ ਨਹੀਂ ਦੇ ਸਕਦਾ"},
}

_ANALOGY_TOPIC: dict[str, dict[str, str]] = {
    "NAV": {"en": "Like the price of one sabzi thali that changes with vegetable rates.", "hi": "जैसे सब्ज़ी थाली का दाम रोज़ सब्ज़ी के भाव से बदलता है।"},
    "volatility": {"en": "Like a bus on a bumpy village road — same route, jerky ride.", "hi": "जैसे कच्ची सड़क पर बस — रास्ता वही, झटके लगते हैं।"},
    "compounding": {"en": "Like a snowball rolling down — small start, grows as it rolls.", "hi": "जैसे लुढ़कता गोला बर्फ का — छोटा शुरू, आगे बड़ा।"},
}

_ANALOGY_DEFAULT: dict[str, str] = {
    "en": "Like a monsoon promise: no one can guarantee rain.",
    "hi": "जैसे मौसम का वादा: बारिश की गारंटी कोई नहीं दे सकता।",
    "hinglish": "Jaise mausam ka vaada: baarish ki guarantee koi nahi de sakta.",
    "mr": "जसे पावसाचे आश्वासन: पावसाची हमी कोणी देऊ शकत नाही.",
    "ta": "பருவமழை வாக்குறுதி போல: மழைக்கு யாரும் உத்தரவாதம் தர முடியாது.",
    "bn": "বর্ষার প্রতিশ্রুতির মতো: বৃষ্টির গ্যারান্টি কেউ দিতে পারে না।",
    "te": "వర్షం హామీలా: వానకు ఎవరూ గ్యారెంటీ ఇవ్వలేరు.",
    "kn": "ಮಳೆ ಭರವಸೆಯಂತೆ: ಮಳೆಗೆ ಯಾರೂ ಗ್ಯಾರಂಟಿ ನೀಡಲಾರರು.",
    "ml": "മഴവാഗ്ദാനം പോലെ: മഴയ്ക്ക് ആർക്കും ഉറപ്പ് നൽകാനാവില്ല.",
    "gu": "ચોમાસાના વચન જેવું: વરસાદની ગેરંટી કોઈ આપી શકે નહીં.",
    "pa": "ਮੀਂਹ ਦੇ ਵਾਅਦੇ ਵਾਂਗ: ਮੀਂਹ ਦੀ ਗਾਰੰਟੀ ਕੋਈ ਨਹੀਂ ਦੇ ਸਕਦਾ।",
}

_CLOSER = {
    "en": " Learn first, never act on a tip alone.",
    "hinglish": " Pehle samjho, tip par turant paisa mat lagao.",
    "hi": " पहले समझो, टिप पर तुरंत पैसा मत लगाओ।",
    "mr": " आधी समजून घ्या, टिपवर लगेच पैसे लावू नका.",
    "ta": " முதலில் புரிந்து கொள்ளுங்கள், டிப்-ஐ நம்பி உடனே பணம் போடாதீர்கள்.",
    "bn": " প্রথমে বুঝুন, টিপ দেখে তাড়াহুড়ো করে টাকা লাগাবেন না।",
    "te": " ముందు అర్థం చేసుకోండి, టిప్ చూసి వెంటనే డబ్బు పెట్టవద్దు.",
    "kn": " ಮೊದಲು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಟಿಪ್ ನೋಡಿ ತಕ್ಷಣ ಹಣ ಹಾಕಬೇಡಿ.",
    "ml": " ആദ്യം മനസ്സിലാക്കൂ, ടിപ്പ് കണ്ട് ഉടൻ പണം ഇടരുത്.",
    "gu": " પહેલા સમજો, ટિપ જોઈને તરત પૈસા ન રોકો.",
    "pa": " ਪਹਿਲਾਂ ਸਮਝੋ, ਟਿਪ ਵੇਖ ਕੇ ਤੁਰੰਤ ਪੈਸੇ ਨਾ ਲਾਓ.",
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
    lv = lang.value
    topic = _pick_topic(text)
    pack = _JARGON.get(topic, _JARGON["NAV"])
    meaning = pack.get(lv, pack["en"])
    topic_pack = _ANALOGY_TOPIC.get(topic)
    if topic_pack:
        analogy = topic_pack.get(lv, _ANALOGY_DEFAULT.get(lv, _ANALOGY_DEFAULT["en"]))
    else:
        analogy = _ANALOGY_DEFAULT.get(lv, _ANALOGY_DEFAULT["en"])
    closer = _CLOSER.get(lv, _CLOSER["en"])

    if lv == "hi":
        plain = f"{topic} का मतलब: {meaning}।" + closer
    elif lv == "hinglish":
        plain = f"{topic} matlab: {meaning}. Theory me simple hai, practice me keemat upar-neeche hoti hai." + closer
    else:
        plain = f"{topic}: {meaning}." + closer

    terms = [TermMeaning(term=topic, meaning=meaning)]
    for k, v in _JARGON.items():
        if k != topic and k.lower() in (text or "").lower():
            terms.append(TermMeaning(term=k, meaning=v.get(lv, v["en"])))
            break
    return Explainer(plain_text=plain, analogy=analogy, terms=terms[:3])

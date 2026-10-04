const API = location.port === "8001" ? "" : "http://127.0.0.1:8001";
let LANG = "en", LAST = null;
const $ = (id) => document.getElementById(id);

const I18N = {
en: {skip:"Skip to main content",sra:"Screen Reader Access",lang_more:"More languages",nav_home:"Home",nav_check:"Check a Claim",nav_report:"Assessment Report",nav_learn:"Investor Education",nav_help:"Helpline",ticker:"<strong>Notice:</strong> No one can guarantee market returns. Verify registration on SEBI / SCORES / NSE before transferring money. This portal gives education only — never investment advice.",crumb:"Home / Investor Resilience / Claim Assessment",h1:"Online Claim Assessment Facility",intro:"Paste the text of any investment tip, message, or video caption received on WhatsApp, Telegram, YouTube or Instagram. The facility examines whether the content is <strong>educating</strong> you or <strong>selling</strong> to you, states what evidence supports it, and explains the concept in plain words with a steady-vs-hype illustration.",form_title:"Application Form — Claim Details",form_label:"Text of claim / tip / caption",req:"(required)",form_hint:"Do not enter OTPs, bank passwords, or full account numbers. Only the claim text is needed.",btn_check:"Submit for assessment",btn_speak:"Listen to explanation",btn_clear:"Reset form",rep_title:"Assessment Report",empty:"No assessment generated yet. Acknowledgement number will appear here after submission.",loading:"Assessment in progress…",th_class:"Classification",th_ev:"Evidence level",th_mean:"Plain-language meaning",th_sim:"Consequence illustration (₹5,000/month × 12)",th_sig:"Detected signals",disclaimer:"Disclaimer: computer-generated educational assessment, not investment advice or a legal finding. Verify independently on SEBI / SCORES / NSE before acting.",learn_title:"Investor education",learn1:"What is NAV — per-share value of a mutual fund, changes daily.",learn2:"SIP — a fixed monthly habit; compounding rewards patience, not tips.",learn3:"Volatility — prices move up and down; guaranteed returns do not exist.",learn4:"Grievance — lodge complaints on SCORES; check nominee and IEPF status.",help_title:"Helpline",news_title:"What is new",news1:"Check tip-group screenshots before forwarding.",news2:"Nominee registration now mandatory for demat.",news3:"Unclaimed dividends recoverable via IEPF.",links_title:"Related links",hist_title:"Previous assessments",hist_empty:"None on this device yet.",footer:"Content owned and maintained by Team Saarthi (SANGYAN hackathon) for demonstration. Source registries: SEBI · NSE · SCORES.",f_acc:"Accessibility",f_terms:"Terms of Use",f_priv:"Privacy (no PII collected)",f_upd:"Last updated: Oct 2026"},
hinglish: {skip:"Main content par jayein",sra:"Screen Reader Access",lang_more:"Aur bhashayein",nav_home:"Home",nav_check:"Dawa Check Karein",nav_report:"Assessment Report",nav_learn:"Niveshak Shiksha",nav_help:"Helpline",ticker:"<strong>Suchna:</strong> Bazaar me pakke munafe ki guarantee koi nahi de sakta. Paisa bhejne se pehle SEBI / SCORES / NSE par registration verify karein. Yeh portal sirf shiksha deta hai — salah nahi.",crumb:"Home / Niveshak Suraksha / Dawa Mulyankan",h1:"Online Dawa Mulyankan Suvidha",intro:"WhatsApp, Telegram, YouTube ya Instagram par mile kisi bhi tip, message ya video caption ka text paste karein. Yeh suvidha batayegi ki content aapko <strong>sikha</strong> raha hai ya <strong>bech</strong> raha hai, iske peeche kya saboot hai, aur iska seedha-saadha matlab kya hai.",form_title:"Aavedan Form — Dawe ka Vivaran",form_label:"Dawe / tip / caption ka text",req:"(zaroori)",form_hint:"OTP, bank password ya poora account number na likhein. Sirf dawe ka text chahiye.",btn_check:"Mulyankan ke liye bhejein",btn_speak:"Samjhauta sunein",btn_clear:"Form saaf karein",rep_title:"Mulyankan Report",empty:"Abhi koi mulyankan nahi hua. Bhejne ke baad yahan report aayegi.",loading:"Mulyankan chal raha hai…",th_class:"Vargikaran",th_ev:"Saboot ka star",th_mean:"Seedhe shabdon me arth",th_sim:"Parinaam udaharan (₹5,000/mahina × 12)",th_sig:"Pakde gaye sanket",disclaimer:"Disclaimer: computer se bani shiksha report, salah ya kanooni faisla nahi. Kaam karne se pehle SEBI / SCORES / NSE par khud verify karein.",learn_title:"Niveshak shiksha",learn1:"NAV kya hai — mutual fund ke ek hisse ki keemat, roz badalti hai.",learn2:"SIP — har mahine ki aadat; compounding dhairya ka phal deta hai, tip ka nahi.",learn3:"Volatility — keemat upar-neeche hoti hai; pakke munafe hote hi nahi.",learn4:"Shikayat — SCORES par shikayat karein; nominee aur IEPF sthiti dekhein.",help_title:"Helpline",news_title:"Naya kya hai",news1:"Forward karne se pehle tip-group screenshot check karein.",news2:"Demat ke liye nominee ab anivarya hai.",news3:"IEPF se be-daawa dividend wapas mil sakta hai.",links_title:"Sambandhit link",hist_title:"Pichhle mulyankan",hist_empty:"Is device par abhi koi nahi.",footer:"Samagri pradarshan hetu Team Saarthi (SANGYAN hackathon) dwara. Source: SEBI · NSE · SCORES.",f_acc:"Accessibility",f_terms:"Upp yog shartein",f_priv:"Privacy (koi PII nahi)",f_upd:"Update: Oct 2026"},
hi: {skip:"मुख्य सामग्री पर जाएं",sra:"स्क्रीन रीडर एक्सेस",lang_more:"अन्य भाषाएँ",nav_home:"मुख्य पृष्ठ",nav_check:"दावा जांचें",nav_report:"मूल्यांकन रिपोर्ट",nav_learn:"निवेशक शिक्षा",nav_help:"हेल्पलाइन",ticker:"<strong>सूचना:</strong> बाज़ार में पक्के मुनाफे की गारंटी कोई नहीं दे सकता। पैसे भेजने से पहले SEBI / SCORES / NSE पर पंजीकरण सत्यापित करें। यह पोर्टल केवल शिक्षा देता है — सलाह नहीं।",crumb:"मुख्य पृष्ठ / निवेशक सुरक्षा / दावा मूल्यांकन",h1:"ऑनलाइन दावा मूल्यांकन सुविधा",intro:"WhatsApp, Telegram, YouTube या Instagram पर मिले किसी भी टिप, संदेश या वीडियो कैप्शन का पाठ चिपकाएं। यह सुविधा बताएगी कि सामग्री आपको <strong>सिखा</strong> रही है या <strong>बेच</strong> रही है, इसके पीछे क्या प्रमाण है, और इसका सीधा अर्थ क्या है।",form_title:"आवेदन प्रपत्र — दावे का विवरण",form_label:"दावे / टिप / कैप्शन का पाठ",req:"(आवश्यक)",form_hint:"OTP, बैंक पासवर्ड या पूरा खाता नंबर न लिखें। केवल दावे का पाठ चाहिए।",btn_check:"मूल्यांकन हेतु भेजें",btn_speak:"व्याख्या सुनें",btn_clear:"प्रपत्र साफ़ करें",rep_title:"मूल्यांकन रिपोर्ट",empty:"अभी कोई मूल्यांकन नहीं हुआ। भेजने के बाद रिपोर्ट यहाँ दिखेगी।",loading:"मूल्यांकन प्रगति पर है…",th_class:"वर्गीकरण",th_ev:"प्रमाण स्तर",th_mean:"सरल भाषा में अर्थ",th_sim:"परिणाम उदाहरण (₹5,000/माह × 12)",th_sig:"पकड़े गए संकेत",disclaimer:"अस्वीकरण: कंप्यूटर-निर्मित शैक्षणिक मूल्यांकन, निवेश सलाह या विधिक निष्कर्ष नहीं। कार्रवाई से पहले SEBI / SCORES / NSE पर स्वयं सत्यापित करें।",learn_title:"निवेशक शिक्षा",learn1:"NAV क्या है — म्यूचुअल फंड के एक हिस्से की कीमत, रोज़ बदलती है।",learn2:"SIP — हर महीने की आदत; चक्रवृद्धि धैर्य का फल देती है, टिप का नहीं।",learn3:"उतार-चढ़ाव — कीमत ऊपर-नीचे होती है; पक्का मुनाफा होता ही नहीं।",learn4:"शिकायत — SCORES पर शिकायत करें; नामांकन और IEPF स्थिति देखें।",help_title:"हेल्पलाइन",news_title:"नया क्या है",news1:"फॉरवर्ड करने से पहले टिप-ग्रुप स्क्रीनशॉट जांचें।",news2:"डीमैट हेतु नामांकन अब अनिवार्य है।",news3:"IEPF से बेदावा लाभांश वापस मिल सकता है।",links_title:"संबंधित लिंक",hist_title:"पिछले मूल्यांकन",hist_empty:"इस डिवाइस पर अभी कोई नहीं।",footer:"प्रदर्शन हेतु सामग्री Team Saarthi (SANGYAN हैकथॉन) द्वारा। स्रोत: SEBI · NSE · SCORES।",f_acc:"सुगम्यता",f_terms:"उपयोग की शर्तें",f_priv:"गोपनीयता (कोई PII नहीं)",f_upd:"अद्यतन: अक्तू 2026"},
mr: {skip:"मुख्य मजकुराकडे जा",sra:"स्क्रीन रीडर अ‍ॅक्सेस",lang_more:"इतर भाषा",nav_home:"मुख्यपृष्ठ",nav_check:"दावा तपासा",nav_report:"मूल्यमापन अहवाल",nav_learn:"गुंतवणूकदार शिक्षण",nav_help:"हेल्पलाइन",ticker:"<strong>सूचना:</strong> बाजारात खात्रीशीर परताव्याची हमी कोणीही देऊ शकत नाही. पैसे पाठवण्यापूर्वी SEBI / SCORES / NSE वर नोंदणी तपासा. हे पोर्टल फक्त शिक्षण देते — सल्ला नाही.",crumb:"मुख्यपृष्ठ / गुंतवणूकदार सुरक्षा / दावा मूल्यमापन",h1:"ऑनलाइन दावा मूल्यमापन सुविधा",intro:"WhatsApp, Telegram, YouTube किंवा Instagram वरील कोणत्याही टीप, संदेश किंवा व्हिडिओ कॅप्शनचा मजकूर चिकटवा. ही सुविधा सांगेल की मजकूर तुम्हाला <strong>शिकवत</strong> आहे की <strong>विकत</strong> आहे, त्यामागे काय पुरावा आहे आणि त्याचा साधा अर्थ काय आहे.",form_title:"अर्ज — दाव्याचा तपशील",form_label:"दावा / टीप / कॅप्शनचा मजकूर",req:"(आवश्यक)",form_hint:"OTP, बँक पासवर्ड किंवा पूर्ण खाते क्रमांक लिहू नका. फक्त दाव्याचा मजकूर हवा आहे.",btn_check:"मूल्यमापनासाठी पाठवा",btn_speak:"स्पष्टीकरण ऐका",btn_clear:"अर्ज साफ करा",rep_title:"मूल्यमापन अहवाल",empty:"अद्याप कोणतेही मूल्यमापन नाही. पाठवल्यावर अहवाल येथे दिसेल.",loading:"मूल्यमापन सुरू आहे…",th_class:"वर्गीकरण",th_ev:"पुराव्याची पातळी",th_mean:"साध्या भाषेतील अर्थ",th_sim:"परिणाम उदाहरण (₹5,000/महिना × 12)",th_sig:"आढळलेले संकेत",disclaimer:"टीप: संगणक-निर्मित शैक्षणिक मूल्यमापन, गुंतवणूक सल्ला किंवा कायदेशीर निष्कर्ष नाही. कृतीपूर्वी SEBI / SCORES / NSE वर स्वतः तपासा.",learn_title:"गुंतवणूकदार शिक्षण",learn1:"NAV म्हणजे काय — म्युच्युअल फंडाच्या एका हिश्याची किंमत, रोज बदलते.",learn2:"SIP — दरमहा ठराविक सवय; चक्रवाढ संयमाचे फळ देते, टीपचे नाही.",learn3:"चढ-उतार — किंमत वर-खाली होते; हमखास नफा नसतोच.",learn4:"तक्रार — SCORES वर तक्रार करा; नामांकन व IEPF स्थिती पहा.",help_title:"हेल्पलाइन",news_title:"नवीन काय",news1:"फॉरवर्ड करण्यापूर्वी टीप-ग्रुप स्क्रीनशॉट तपासा.",news2:"डीमॅटसाठी नामांकन आता बंधनकारक.",news3:"IEPF मधून बेहक्क लाभांश परत मिळू शकतो.",links_title:"संबंधित दुवे",hist_title:"मागील मूल्यमापने",hist_empty:"या डिव्हाइसवर अद्याप नाही.",footer:"प्रात्यक्षिकासाठी मजकूर SANGYAN हॅकेथॉन टीमचा. स्रोत: SEBI · NSE · SCORES.",f_acc:"सुगमता",f_terms:"वापर अटी",f_priv:"गोपनीयता (PII नाही)",f_upd:"अद्यतन: ऑक्टो 2026"},
ta: {skip:"முக்கிய உள்ளடக்கத்திற்குச் செல்க",sra:"திரை வாசிப்பு அணுகல்",lang_more:"மேலும் மொழிகள்",nav_home:"முகப்பு",nav_check:"கோரிக்கையைச் சரிபார்",nav_report:"மதிப்பீட்டு அறிக்கை",nav_learn:"முதலீட்டாளர் கல்வி",nav_help:"உதவி எண்",ticker:"<strong>அறிவிப்பு:</strong> சந்தையில் உத்தரவாத வருமானம் யாரும் தர முடியாது. பணம் அனுப்பும் முன் SEBI / SCORES / NSE இல் பதிவைச் சரிபார்க்கவும். இந்த இணையதளம் கல்வி மட்டுமே தரும் — ஆலோசனை அல்ல.",crumb:"முகப்பு / முதலீட்டாளர் பாதுகாப்பு / கோரிக்கை மதிப்பீடு",h1:"ஆன்லைன் கோரிக்கை மதிப்பீட்டு வசதி",intro:"WhatsApp, Telegram, YouTube அல்லது Instagram இல் வந்த டிப், செய்தி அல்லது வீடியோ விளக்க உரையை ஒட்டவும். அது உங்களுக்குக் <strong>கற்பிக்கிறதா</strong> அல்லது <strong>விற்கிறதா</strong>, அதற்கு என்ன ஆதாரம் உள்ளது, எளிய பொருள் என்ன என்பதை இது கூறும்.",form_title:"விண்ணப்பம் — கோரிக்கை விவரம்",form_label:"கோரிக்கை / டிப் / விளக்க உரை",req:"(கட்டாயம்)",form_hint:"OTP, வங்கி கடவுச்சொல் அல்லது முழு கணக்கு எண்ணை எழுத வேண்டாம். கோரிக்கை உரை மட்டும் போதும்.",btn_check:"மதிப்பீட்டுக்கு அனுப்பு",btn_speak:"விளக்கத்தைக் கேள்",btn_clear:"படிவத்தை அழி",rep_title:"மதிப்பீட்டு அறிக்கை",empty:"இன்னும் மதிப்பீடு இல்லை. அனுப்பிய பிறகு அறிக்கை இங்கே தோன்றும்.",loading:"மதிப்பீடு நடக்கிறது…",th_class:"வகைப்பாடு",th_ev:"ஆதார நிலை",th_mean:"எளிய பொருள்",th_sim:"விளைவு எடுத்துக்காட்டு (₹5,000/மாதம் × 12)",th_sig:"கண்டறிந்த குறிகள்",disclaimer:"குறிப்பு: கணினி உருவாக்கிய கல்வி மதிப்பீடு; முதலீட்டு ஆலோசனை அல்லது சட்ட முடிவு அல்ல. செயல்படும் முன் SEBI / SCORES / NSE இல் சரிபார்க்கவும்.",learn_title:"முதலீட்டாளர் கல்வி",learn1:"NAV என்றால் என்ன — மியூச்சுவல் ஃபண்டின் ஒரு பங்கு மதிப்பு, தினமும் மாறும்.",learn2:"SIP — மாதந்தோறும் பழக்கம்; கூட்டு வளர்ச்சி பொறுமைக்குப் பலன் தரும், டிப்புக்கு அல்ல.",learn3:"ஏற்ற இறக்கம் — விலை ஏறும் இறங்கும்; உத்தரவாத லாபம் கிடையாது.",learn4:"புகார் — SCORES இல் புகார் செய்யுங்கள்; நாமினி மற்றும் IEPF நிலையைப் பாருங்கள்.",help_title:"உதவி எண்",news_title:"புதியவை",news1:"பகிரும் முன் டிப்-குழு ஸ்கிரீன்ஷாட்டைச் சரிபார்க்கவும்.",news2:"டீமேட்டுக்கு நாமினி இப்போது கட்டாயம்.",news3:"IEPF மூலம் உரிமை கோரா ஈவுத்தொகையை மீட்கலாம்.",links_title:"தொடர்புடைய இணைப்புகள்",hist_title:"முந்தைய மதிப்பீடுகள்",hist_empty:"இந்தச் சாதனத்தில் இதுவரை இல்லை.",footer:"செயல்விளக்க உள்ளடக்கம் SANGYAN ஹேக்கத்தான் குழுவினது. ஆதாரம்: SEBI · NSE · SCORES.",f_acc:"அணுகல்",f_terms:"பயன்பாட்டு விதிகள்",f_priv:"தனியுரிமை (PII இல்லை)",f_upd:"புதுப்பிப்பு: அக் 2026"},
bn: {skip:"মূল বিষয়বস্তুতে যান",sra:"স্ক্রিন রিডার অ্যাক্সেস",lang_more:"আরও ভাষা",nav_home:"মূলপৃষ্ঠা",nav_check:"দাবি যাচাই",nav_report:"মূল্যায়ন প্রতিবেদন",nav_learn:"বিনিয়োগকারী শিক্ষা",nav_help:"হেল্পলাইন",ticker:"<strong>বিজ্ঞপ্তি:</strong> বাজারে পাকা মুনাফার গ্যারান্টি কেউ দিতে পারে না। টাকা পাঠানোর আগে SEBI / SCORES / NSE-তে নিবন্ধন যাচাই করুন। এই পোর্টাল শুধু শিক্ষা দেয় — পরামর্শ নয়।",crumb:"মূলপৃষ্ঠা / বিনিয়োগকারী সুরক্ষা / দাবি মূল্যায়ন",h1:"অনলাইন দাবি মূল্যায়ন সুবিধা",intro:"WhatsApp, Telegram, YouTube বা Instagram-এ পাওয়া যেকোনো টিপ, বার্তা বা ভিডিও ক্যাপশনের পাঠ পেস্ট করুন। বিষয়বস্তু আপনাকে <strong>শেখাচ্ছে</strong> না <strong>বিক্রি করছে</strong>, এর পেছনে কী প্রমাণ আছে এবং সহজ অর্থ কী — তা এই সুবিধা জানাবে।",form_title:"আবেদন ফর্ম — দাবির বিবরণ",form_label:"দাবি / টিপ / ক্যাপশনের পাঠ",req:"(আবশ্যক)",form_hint:"OTP, ব্যাংক পাসওয়ার্ড বা পুরো অ্যাকাউন্ট নম্বর লিখবেন না। শুধু দাবির পাঠ দরকার।",btn_check:"মূল্যায়নের জন্য পাঠান",btn_speak:"ব্যাখ্যা শুনুন",btn_clear:"ফর্ম মুছুন",rep_title:"মূল্যায়ন প্রতিবেদন",empty:"এখনও কোনো মূল্যায়ন হয়নি। পাঠানোর পর প্রতিবেদন এখানে দেখা যাবে।",loading:"মূল্যায়ন চলছে…",th_class:"শ্রেণিবিভাগ",th_ev:"প্রমাণের মাত্রা",th_mean:"সহজ ভাষায় অর্থ",th_sim:"ফলাফলের উদাহরণ (₹5,000/মাস × 12)",th_sig:"পাওয়া সংকেত",disclaimer:"দাবিত্যাগ: কম্পিউটার-তৈরি শিক্ষামূলক মূল্যায়ন, বিনিয়োগ পরামর্শ বা আইনি সিদ্ধান্ত নয়। ব্যবস্থা নেওয়ার আগে SEBI / SCORES / NSE-তে নিজে যাচাই করুন।",learn_title:"বিনিয়োগকারী শিক্ষা",learn1:"NAV কী — মিউচুয়াল ফান্ডের এক ইউনিটের দাম, রোজ বদলায়।",learn2:"SIP — প্রতি মাসে নির্দিষ্ট অভ্যাস; চক্রবৃদ্ধি ধৈর্যের ফল দেয়, টিপের নয়।",learn3:"ওঠানামা — দাম ওঠে-নামে; পাকা মুনাফা হয়ই না।",learn4:"অভিযোগ — SCORES-এ অভিযোগ করুন; নমিনি ও IEPF অবস্থা দেখুন।",help_title:"হেল্পলাইন",news_title:"নতুন কী",news1:"ফরোয়ার্ড করার আগে টিপ-গ্রুপের স্ক্রিনশট যাচাই করুন।",news2:"ডিম্যাটের জন্য নমিনি এখন বাধ্যতামূলক।",news3:"IEPF থেকে বেদাবি লভ্যাংশ ফেরত পাওয়া যায়।",links_title:"সম্পর্কিত লিংক",hist_title:"আগের মূল্যায়ন",hist_empty:"এই ডিভাইসে এখনও কিছু নেই।",footer:"প্রদর্শনের জন্য বিষয়বস্তু SANGYAN হ্যাকাথন দলের। উৎস: SEBI · NSE · SCORES।",f_acc:"অ্যাক্সেসযোগ্যতা",f_terms:"ব্যবহারের শর্ত",f_priv:"গোপনীয়তা (কোনো PII নয়)",f_upd:"হালনাগাদ: অক্টো 2026"},
te: {skip:"ప్రధాన విషయానికి వెళ్ళండి",sra:"స్క్రీన్ రీడర్ యాక్సెస్",lang_more:"మరిన్ని భాషలు",nav_home:"హోమ్",nav_check:"క్లెయిమ్ తనిఖీ",nav_report:"మదింపు నివేదిక",nav_learn:"పెట్టుబడిదారుల విద్య",nav_help:"హెల్ప్‌లైన్",ticker:"<strong>గమనిక:</strong> మార్కెట్లో ఖచ్చితమైన లాభానికి ఎవరూ గ్యారెంటీ ఇవ్వలేరు. డబ్బు పంపే ముందు SEBI / SCORES / NSE లో నమోదు ధృవీకరించండి. ఈ పోర్టల్ విద్య మాత్రమే ఇస్తుంది — సలహా కాదు.",crumb:"హోమ్ / పెట్టుబడిదారుల రక్షణ / క్లెయిమ్ మదింపు",h1:"ఆన్‌లైన్ క్లెయిమ్ మదింపు సౌకర్యం",intro:"WhatsApp, Telegram, YouTube లేదా Instagram లో వచ్చిన ఏదైనా టిప్, సందేశం లేదా వీడియో శీర్షిక పాఠాన్ని అతికించండి. ఆ కంటెంట్ మీకు <strong>నేర్పుతోందా</strong> లేక <strong>అమ్ముతోందా</strong>, దానికి ఏ ఆధారం ఉంది, సులభ అర్థం ఏమిటో ఈ సౌకర్యం తెలియజేస్తుంది.",form_title:"దరఖాస్తు ఫారం — క్లెయిమ్ వివరాలు",form_label:"క్లెయిమ్ / టిప్ / శీర్షిక పాఠం",req:"(తప్పనిసరి)",form_hint:"OTP, బ్యాంక్ పాస్‌వర్డ్ లేదా పూర్తి ఖాతా నంబర్ రాయవద్దు. క్లెయిమ్ పాఠం మాత్రమే కావాలి.",btn_check:"మదింపుకు పంపండి",btn_speak:"వివరణ వినండి",btn_clear:"ఫారం తుడవండి",rep_title:"మదింపు నివేదిక",empty:"ఇంకా మదింపు జరగలేదు. పంపిన తర్వాత నివేదిక ఇక్కడ కనిపిస్తుంది.",loading:"మదింపు జరుగుతోంది…",th_class:"వర్గీకరణ",th_ev:"ఆధార స్థాయి",th_mean:"సులభ భాషలో అర్థం",th_sim:"ఫలిత ఉదాహరణ (₹5,000/నెల × 12)",th_sig:"కనుగొన్న సంకేతాలు",disclaimer:"గమనిక: కంప్యూటర్ రూపొందించిన విద్యా మదింపు; పెట్టుబడి సలహా లేదా చట్టపరమైన నిర్ణయం కాదు. చర్యకు ముందు SEBI / SCORES / NSE లో స్వయంగా ధృవీకరించండి.",learn_title:"పెట్టుబడిదారుల విద్య",learn1:"NAV అంటే ఏమిటి — మ్యూచువల్ ఫండ్ ఒక యూనిట్ ధర, రోజూ మారుతుంది.",learn2:"SIP — ప్రతి నెలా క్రమ అలవాటు; చక్రవడ్డీ ఓర్పుకు ఫలమిస్తుంది, టిప్పుకు కాదు.",learn3:"ఒడిదుడుకులు — ధరలు పైకి కిందికి కదులుతాయి; ఖచ్చితమైన లాభాలు ఉండవు.",learn4:"ఫిర్యాదు — SCORES లో ఫిర్యాదు చేయండి; నామినీ, IEPF స్థితి చూడండి.",help_title:"హెల్ప్‌లైన్",news_title:"కొత్తవి",news1:"ఫార్వార్డ్ చేసే ముందు టిప్-గ్రూప్ స్క్రీన్‌షాట్ తనిఖీ చేయండి.",news2:"డీమ్యాట్‌కు నామినీ ఇప్పుడు తప్పనిసరి.",news3:"IEPF ద్వారా క్లెయిమ్ చేయని డివిడెండ్ పొందవచ్చు.",links_title:"సంబంధిత లింకులు",hist_title:"గత మదింపులు",hist_empty:"ఈ పరికరంలో ఇంకా ఏమీ లేదు.",footer:"ప్రదర్శన నిమిత్తం కంటెంట్ SANGYAN హ్యాకథాన్ బృందానిది. మూలం: SEBI · NSE · SCORES.",f_acc:"యాక్సెసిబిలిటీ",f_terms:"వాడుక నిబంధనలు",f_priv:"గోప్యత (PII లేదు)",f_upd:"నవీకరణ: అక్టో 2026"},
kn: {skip:"ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ",sra:"ಸ್ಕ್ರೀನ್ ರೀಡರ್ ಪ್ರವೇಶ",lang_more:"ಇನ್ನಷ್ಟು ಭಾಷೆಗಳು",nav_home:"ಮುಖಪುಟ",nav_check:"ಹಕ್ಕು ಪರಿಶೀಲಿಸಿ",nav_report:"ಮೌಲ್ಯಮಾಪನ ವರದಿ",nav_learn:"ಹೂಡಿಕೆದಾರರ ಶಿಕ್ಷಣ",nav_help:"ಸಹಾಯವಾಣಿ",ticker:"<strong>ಸೂಚನೆ:</strong> ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಖಾತರಿ ಲಾಭವನ್ನು ಯಾರೂ ನೀಡಲಾರರು. ಹಣ ಕಳುಹಿಸುವ ಮೊದಲು SEBI / SCORES / NSE ನಲ್ಲಿ ನೋಂದಣಿ ಪರಿಶೀಲಿಸಿ. ಈ ಪೋರ್ಟಲ್ ಶಿಕ್ಷಣ ಮಾತ್ರ ನೀಡುತ್ತದೆ — ಸಲಹೆಯಲ್ಲ.",crumb:"ಮುಖಪುಟ / ಹೂಡಿಕೆದಾರರ ರಕ್ಷಣೆ / ಹಕ್ಕು ಮೌಲ್ಯಮಾಪನ",h1:"ಆನ್‌ಲೈನ್ ಹಕ್ಕು ಮೌಲ್ಯಮಾಪನ ಸೌಲಭ್ಯ",intro:"WhatsApp, Telegram, YouTube ಅಥವಾ Instagram ನಲ್ಲಿ ಬಂದ ಯಾವುದೇ ಟಿಪ್, ಸಂದೇಶ ಅಥವಾ ವೀಡಿಯೊ ಶೀರ್ಷಿಕೆಯ ಪಠ್ಯವನ್ನು ಅಂಟಿಸಿ. ಆ ವಿಷಯವು ನಿಮಗೆ <strong>ಕಲಿಸುತ್ತಿದೆಯೇ</strong> ಅಥವಾ <strong>ಮಾರಾಟ ಮಾಡುತ್ತಿದೆಯೇ</strong>, ಅದಕ್ಕೆ ಏನು ಸಾಕ್ಷ್ಯವಿದೆ ಮತ್ತು ಸರಳ ಅರ್ಥವೇನು ಎಂದು ಈ ಸೌಲಭ್ಯ ತಿಳಿಸುತ್ತದೆ.",form_title:"ಅರ್ಜಿ ನಮೂನೆ — ಹಕ್ಕಿನ ವಿವರ",form_label:"ಹಕ್ಕು / ಟಿಪ್ / ಶೀರ್ಷಿಕೆಯ ಪಠ್ಯ",req:"(ಕಡ್ಡಾಯ)",form_hint:"OTP, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಪೂರ್ಣ ಖಾತೆ ಸಂಖ್ಯೆ ಬರೆಯಬೇಡಿ. ಹಕ್ಕಿನ ಪಠ್ಯ ಮಾತ್ರ ಬೇಕು.",btn_check:"ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಕಳುಹಿಸಿ",btn_speak:"ವಿವರಣೆ ಕೇಳಿ",btn_clear:"ನಮೂನೆ ಅಳಿಸಿ",rep_title:"ಮೌಲ್ಯಮಾಪನ ವರದಿ",empty:"ಇನ್ನೂ ಯಾವುದೇ ಮೌಲ್ಯಮಾಪನವಾಗಿಲ್ಲ. ಕಳುಹಿಸಿದ ನಂತರ ವರದಿ ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ.",loading:"ಮೌಲ್ಯಮಾಪನ ನಡೆಯುತ್ತಿದೆ…",th_class:"ವರ್ಗೀಕರಣ",th_ev:"ಸಾಕ್ಷ್ಯ ಮಟ್ಟ",th_mean:"ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಅರ್ಥ",th_sim:"ಪರಿಣಾಮ ಉದಾಹರಣೆ (₹5,000/ತಿಂಗಳು × 12)",th_sig:"ಪತ್ತೆಯಾದ ಸೂಚನೆಗಳು",disclaimer:"ಹಕ್ಕುತ್ಯಾಗ: ಕಂಪ್ಯೂಟರ್ ನಿರ್ಮಿತ ಶೈಕ್ಷಣಿಕ ಮೌಲ್ಯಮಾಪನ, ಹೂಡಿಕೆ ಸಲಹೆ ಅಥವಾ ಕಾನೂನು ತೀರ್ಪಲ್ಲ. ಕ್ರಮಕ್ಕೂ ಮುನ್ನ SEBI / SCORES / NSE ನಲ್ಲಿ ನೀವೇ ಪರಿಶೀಲಿಸಿ.",learn_title:"ಹೂಡಿಕೆದಾರರ ಶಿಕ್ಷಣ",learn1:"NAV ಎಂದರೇನು — ಮ್ಯೂಚ್ಯುವಲ್ ಫಂಡ್‌ನ ಒಂದು ಯೂನಿಟ್ ಬೆಲೆ, ಪ್ರತಿದಿನ ಬದಲಾಗುತ್ತದೆ.",learn2:"SIP — ಪ್ರತಿ ತಿಂಗಳ ನಿಯತ ಅಭ್ಯಾಸ; ಚಕ್ರಬಡ್ಡಿ ತಾಳ್ಮೆಗೆ ಫಲ ನೀಡುತ್ತದೆ, ಟಿಪ್‌ಗಲ್ಲ.",learn3:"ಏರಿಳಿತ — ಬೆಲೆ ಮೇಲೆ-ಕೆಳಗೆ ಚಲಿಸುತ್ತದೆ; ಖಾತರಿ ಲಾಭವಿರುವುದಿಲ್ಲ.",learn4:"ದೂರು — SCORES ನಲ್ಲಿ ದೂರು ನೀಡಿ; ನಾಮಿನಿ ಮತ್ತು IEPF ಸ್ಥಿತಿ ನೋಡಿ.",help_title:"ಸಹಾಯವಾಣಿ",news_title:"ಹೊಸತೇನು",news1:"ಫಾರ್ವರ್ಡ್ ಮಾಡುವ ಮೊದಲು ಟಿಪ್-ಗ್ರೂಪ್ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಪರಿಶೀಲಿಸಿ.",news2:"ಡೀಮ್ಯಾಟ್‌ಗೆ ನಾಮಿನಿ ಈಗ ಕಡ್ಡಾಯ.",news3:"IEPF ಮೂಲಕ ಹಕ್ಕು ಸಲ್ಲಿಸದ ಲಾಭಾಂಶ ಪಡೆಯಬಹುದು.",links_title:"ಸಂಬಂಧಿತ ಕೊಂಡಿಗಳು",hist_title:"ಹಿಂದಿನ ಮೌಲ್ಯಮಾಪನಗಳು",hist_empty:"ಈ ಸಾಧನದಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.",footer:"ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ವಿಷಯ SANGYAN ಹ್ಯಾಕಥಾನ್ ತಂಡದ್ದು. ಮೂಲ: SEBI · NSE · SCORES.",f_acc:"ಪ್ರವೇಶಶೀಲತೆ",f_terms:"ಬಳಕೆ ನಿಯಮಗಳು",f_priv:"ಗೌಪ್ಯತೆ (PII ಇಲ್ಲ)",f_upd:"ನವೀಕರಣ: ಅಕ್ಟೋ 2026"},
ml: {skip:"പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകൂ",sra:"സ്ക്രീൻ റീഡർ ആക്സസ്",lang_more:"കൂടുതൽ ഭാഷകൾ",nav_home:"മുഖപേജ്",nav_check:"അവകാശവാദം പരിശോധിക്കൂ",nav_report:"വിലയിരുത്തൽ റിപ്പോർട്ട്",nav_learn:"നിക്ഷേപക വിദ്യാഭ്യാസം",nav_help:"ഹെൽപ്‌ലൈൻ",ticker:"<strong>അറിയിപ്പ്:</strong> വിപണിയിൽ ഉറപ്പുള്ള ലാഭം ആർക്കും നൽകാനാവില്ല. പണം അയയ്ക്കുന്നതിന് മുൻപ് SEBI / SCORES / NSE ൽ രജിസ്ട്രേഷൻ പരിശോധിക്കൂ. ഈ പോർട്ടൽ വിദ്യാഭ്യാസം മാത്രം നൽകുന്നു — ഉപദേശമല്ല.",crumb:"മുഖപേജ് / നിക്ഷേപക സംരക്ഷണം / അവകാശവാദ വിലയിരുത്തൽ",h1:"ഓൺലൈൻ അവകാശവാദ വിലയിരുത്തൽ സൗകര്യം",intro:"WhatsApp, Telegram, YouTube അല്ലെങ്കിൽ Instagram ൽ ലഭിച്ച ഏതെങ്കിലും ടിപ്പ്, സന്ദേശം അല്ലെങ്കിൽ വീഡിയോ തലക്കെട്ടിന്റെ പാഠം ഒട്ടിക്കൂ. അത് നിങ്ങളെ <strong>പഠിപ്പിക്കുകയാണോ</strong> അതോ <strong>വിൽക്കുകയാണോ</strong>, അതിന് എന്ത് തെളിവുണ്ട്, ലളിതമായ അർത്ഥം എന്ത് എന്ന് ഈ സൗകര്യം പറയും.",form_title:"അപേക്ഷാ ഫോം — അവകാശവാദ വിവരം",form_label:"അവകാശവാദ / ടിപ്പ് / തലക്കെട്ടിന്റെ പാഠം",req:"(നിർബന്ധം)",form_hint:"OTP, ബാങ്ക് പാസ്‌വേഡ് അല്ലെങ്കിൽ മുഴുവൻ അക്കൗണ്ട് നമ്പർ എഴുതരുത്. അവകാശവാദ പാഠം മാത്രം മതി.",btn_check:"വിലയിരുത്തലിന് അയയ്ക്കൂ",btn_speak:"വിശദീകരണം കേൾക്കൂ",btn_clear:"ഫോം മായ്ക്കൂ",rep_title:"വിലയിരുത്തൽ റിപ്പോർട്ട്",empty:"ഇതുവരെ വിലയിരുത്തലില്ല. അയച്ച ശേഷം റിപ്പോർട്ട് ഇവിടെ കാണും.",loading:"വിലയിരുത്തൽ നടക്കുന്നു…",th_class:"തരംതിരിവ്",th_ev:"തെളിവിന്റെ നില",th_mean:"ലളിത ഭാഷയിൽ അർത്ഥം",th_sim:"ഫല ഉദാഹരണം (₹5,000/മാസം × 12)",th_sig:"കണ്ടെത്തിയ സൂചനകൾ",disclaimer:"അറിയിപ്പ്: കമ്പ്യൂട്ടർ നിർമ്മിത വിദ്യാഭ്യാസ വിലയിരുത്തൽ; നിക്ഷേപ ഉപദേശമോ നിയമപരമായ കണ്ടെത്തലോ അല്ല. പ്രവർത്തിക്കുന്നതിന് മുൻപ് SEBI / SCORES / NSE ൽ സ്വയം പരിശോധിക്കൂ.",learn_title:"നിക്ഷേപക വിദ്യാഭ്യാസം",learn1:"NAV എന്താണ് — മ്യൂച്വൽ ഫണ്ടിന്റെ ഒരു യൂണിറ്റിന്റെ വില, ദിവസവും മാറും.",learn2:"SIP — എല്ലാ മാസവും നിശ്ചിത ശീലം; കൂട്ടുപലിശ ക്ഷമയ്ക്ക് ഫലം നൽകും, ടിപ്പിനല്ല.",learn3:"ഏറ്റക്കുറച്ചിൽ — വില മുകളിലേക്കും താഴേക്കും മാറും; ഉറപ്പുള്ള ലാഭമില്ല.",learn4:"പരാതി — SCORES ൽ പരാതി നൽകൂ; നോമിനി, IEPF നില പരിശോധിക്കൂ.",help_title:"ഹെൽപ്‌ലൈൻ",news_title:"പുതിയവ",news1:"ഫോർവേഡ് ചെയ്യുന്നതിന് മുൻപ് ടിപ്പ്-ഗ്രൂപ്പ് സ്ക്രീൻഷോട്ട് പരിശോധിക്കൂ.",news2:"ഡീമാറ്റിന് നോമിനി ഇപ്പോൾ നിർബന്ധം.",news3:"IEPF വഴി അവകാശപ്പെടാത്ത ലভ്യാംശം തിരികെ നേടാം.",links_title:"ബന്ധപ്പെട്ട ലിങ്കുകൾ",hist_title:"മുൻ വിലയിരുത്തലുകൾ",hist_empty:"ഈ ഉപകരണത്തിൽ ഇതുവരെ ഒന്നുമില്ല.",footer:"പ്രദർശനത്തിനുള്ള ഉള്ളടക്കം SANGYAN ഹാക്കത്താൺ ടീമിന്റെത്. ഉറവിടം: SEBI · NSE · SCORES.",f_acc:"പ്രവേശനക്ഷമത",f_terms:"ഉപയോഗ നിബന്ധനകൾ",f_priv:"സ്വകാര്യത (PII ഇല്ല)",f_upd:"പുതുക്കം: ഒക്ടോ 2026"},
gu: {skip:"મુખ્ય સામગ્રી પર જાઓ",sra:"સ્ક્રીન રીડર એક્સેસ",lang_more:"વધુ ભાષાઓ",nav_home:"મુખ્યપૃષ્ઠ",nav_check:"દાવો તપાસો",nav_report:"મૂલ્યાંકન અહેવાલ",nav_learn:"રોકાણકાર શિક્ષણ",nav_help:"હેલ્પલાઇન",ticker:"<strong>સૂચના:</strong> બજારમાં પાકા નફાની ગેરંટી કોઈ આપી શકે નહીં. પૈસા મોકલતા પહેલા SEBI / SCORES / NSE પર નોંધણી ચકાસો. આ પોર્ટલ ફક્ત શિક્ષણ આપે છે — સલાહ નહીં.",crumb:"મુખ્યપૃષ્ઠ / રોકાણકાર સુરક્ષા / દાવા મૂલ્યાંકન",h1:"ઓનલાઇન દાવા મૂલ્યાંકન સુવિધા",intro:"WhatsApp, Telegram, YouTube કે Instagram પર મળેલી કોઈપણ ટિપ, સંદેશ કે વિડિયો કૅપ્શનનો પાઠ ચોંટાડો. તે તમને <strong>શીખવી</strong> રહ્યું છે કે <strong>વેચી</strong> રહ્યું છે, તેની પાછળ શું પુરાવો છે અને સરળ અર્થ શું છે તે આ સુવિધા જણાવશે.",form_title:"અરજી ફોર્મ — દાવાની વિગત",form_label:"દાવા / ટિપ / કૅપ્શનનો પાઠ",req:"(જરૂરી)",form_hint:"OTP, બેંક પાસવર્ડ કે પૂરો ખાતા નંબર ન લખો. ફક્ત દાવાનો પાઠ જોઈએ.",btn_check:"મૂલ્યાંકન માટે મોકલો",btn_speak:"સમજૂતી સાંભળો",btn_clear:"ફોર્મ સાફ કરો",rep_title:"મૂલ્યાંકન અહેવાલ",empty:"હજુ કોઈ મૂલ્યાંકન થયું નથી. મોકલ્યા પછી અહેવાલ અહીં દેખાશે.",loading:"મૂલ્યાંકન ચાલી રહ્યું છે…",th_class:"વર્ગીકરણ",th_ev:"પુરાવાનું સ્તર",th_mean:"સરળ ભાષામાં અર્થ",th_sim:"પરિણામ ઉદાહરણ (₹5,000/મહિને × 12)",th_sig:"મળેલા સંકેતો",disclaimer:"નોંધ: કમ્પ્યુટર-નિર્મિત શૈક્ષણિક મૂલ્યાંકન, રોકાણ સલાહ કે કાનૂની તારણ નહીં. કાર્યવાહી પહેલા SEBI / SCORES / NSE પર જાતે ચકાસો.",learn_title:"રોકાણકાર શિક્ષણ",learn1:"NAV શું છે — મ્યુચ્યુઅલ ફંડના એક યુનિટની કિંમત, રોજ બદલાય છે.",learn2:"SIP — દર મહિને નિશ્ચિત ટેવ; ચક્રવૃદ્ધિ ધીરજનું ફળ આપે છે, ટિપનું નહીં.",learn3:"વધઘટ — કિંમત ઉપર-નીચે થાય છે; પાકો નફો હોતો જ નથી.",learn4:"ફરિયાદ — SCORES પર ફરિયાદ કરો; નોમિની અને IEPF સ્થિતિ જુઓ.",help_title:"હેલ્પલાઇન",news_title:"નવું શું",news1:"ફોરવર્ડ કરતા પહેલા ટિપ-ગ્રુપ સ્ક્રીનશોટ તપાસો.",news2:"ડીમેટ માટે નોમિની હવે ફરજિયાત.",news3:"IEPF દ્વારા બેદાવા ડિવિડન્ડ પાછું મેળવી શકાય.",links_title:"સંબંધિત લિંક",hist_title:"અગાઉના મૂલ્યાંકન",hist_empty:"આ ડિવાઇસ પર હજુ કંઈ નથી.",footer:"પ્રદર્શન માટે સામગ્રી SANGYAN હેકાથોન ટીમની. સ્રોત: SEBI · NSE · SCORES.",f_acc:"સુગમતા",f_terms:"વપરાશ શરતો",f_priv:"ગોપનીયતા (PII નહીં)",f_upd:"અપડેટ: ઓક્ટો 2026"},
pa: {skip:"ਮੁੱਖ ਸਮੱਗਰੀ ’ਤੇ ਜਾਓ",sra:"ਸਕ੍ਰੀਨ ਰੀਡਰ ਪਹੁੰਚ",lang_more:"ਹੋਰ ਭਾਸ਼ਾਵਾਂ",nav_home:"ਮੁੱਖ ਪੰਨਾ",nav_check:"ਦਾਅਵਾ ਜਾਂਚੋ",nav_report:"ਮੁਲਾਂਕਣ ਰਿਪੋਰਟ",nav_learn:"ਨਿਵੇਸ਼ਕ ਸਿੱਖਿਆ",nav_help:"ਹੈਲਪਲਾਈਨ",ticker:"<strong>ਸੂਚਨਾ:</strong> ਬਾਜ਼ਾਰ ਵਿੱਚ ਪੱਕੇ ਮੁਨਾਫ਼ੇ ਦੀ ਗਾਰੰਟੀ ਕੋਈ ਨਹੀਂ ਦੇ ਸਕਦਾ। ਪੈਸੇ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ SEBI / SCORES / NSE ’ਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ। ਇਹ ਪੋਰਟਲ ਸਿਰਫ਼ ਸਿੱਖਿਆ ਦਿੰਦਾ ਹੈ — ਸਲਾਹ ਨਹੀਂ।",crumb:"ਮੁੱਖ ਪੰਨਾ / ਨਿਵੇਸ਼ਕ ਸੁਰੱਖਿਆ / ਦਾਅਵਾ ਮੁਲਾਂਕਣ",h1:"ਔਨਲਾਈਨ ਦਾਅਵਾ ਮੁਲਾਂਕਣ ਸਹੂਲਤ",intro:"WhatsApp, Telegram, YouTube ਜਾਂ Instagram ’ਤੇ ਮਿਲੀ ਕਿਸੇ ਵੀ ਟਿਪ, ਸੁਨੇਹੇ ਜਾਂ ਵੀਡੀਓ ਕੈਪਸ਼ਨ ਦਾ ਪਾਠ ਚਿਪਕਾਓ। ਇਹ ਸਹੂਲਤ ਦੱਸੇਗੀ ਕਿ ਸਮੱਗਰੀ ਤੁਹਾਨੂੰ <strong>ਸਿਖਾ</strong> ਰਹੀ ਹੈ ਜਾਂ <strong>ਵੇਚ</strong> ਰਹੀ ਹੈ, ਇਸ ਪਿੱਛੇ ਕੀ ਸਬੂਤ ਹੈ ਅਤੇ ਸਿੱਧਾ ਅਰਥ ਕੀ ਹੈ।",form_title:"ਅਰਜ਼ੀ ਫਾਰਮ — ਦਾਅਵੇ ਦਾ ਵੇਰਵਾ",form_label:"ਦਾਅਵੇ / ਟਿਪ / ਕੈਪਸ਼ਨ ਦਾ ਪਾਠ",req:"(ਲਾਜ਼ਮੀ)",form_hint:"OTP, ਬੈਂਕ ਪਾਸਵਰਡ ਜਾਂ ਪੂਰਾ ਖਾਤਾ ਨੰਬਰ ਨਾ ਲਿਖੋ। ਸਿਰਫ਼ ਦਾਅਵੇ ਦਾ ਪਾਠ ਚਾਹੀਦਾ ਹੈ।",btn_check:"ਮੁਲਾਂਕਣ ਲਈ ਭੇਜੋ",btn_speak:"ਵਿਆਖਿਆ ਸੁਣੋ",btn_clear:"ਫਾਰਮ ਸਾਫ਼ ਕਰੋ",rep_title:"ਮੁਲਾਂਕਣ ਰਿਪੋਰਟ",empty:"ਅਜੇ ਕੋਈ ਮੁਲਾਂਕਣ ਨਹੀਂ ਹੋਇਆ। ਭੇਜਣ ਤੋਂ ਬਾਅਦ ਰਿਪੋਰਟ ਇੱਥੇ ਦਿਖੇਗੀ।",loading:"ਮੁਲਾਂਕਣ ਚੱਲ ਰਿਹਾ ਹੈ…",th_class:"ਵਰਗੀਕਰਨ",th_ev:"ਸਬੂਤ ਦਾ ਪੱਧਰ",th_mean:"ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਅਰਥ",th_sim:"ਨਤੀਜਾ ਉਦਾਹਰਨ (₹5,000/ਮਹੀਨਾ × 12)",th_sig:"ਮਿਲੇ ਸੰਕੇਤ",disclaimer:"ਨੋਟ: ਕੰਪਿਊਟਰ-ਨਿਰਮਿਤ ਵਿਦਿਅਕ ਮੁਲਾਂਕਣ, ਨਿਵੇਸ਼ ਸਲਾਹ ਜਾਂ ਕਾਨੂੰਨੀ ਸਿੱਟਾ ਨਹੀਂ। ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ SEBI / SCORES / NSE ’ਤੇ ਖ਼ੁਦ ਪੁਸ਼ਟੀ ਕਰੋ।",learn_title:"ਨਿਵੇਸ਼ਕ ਸਿੱਖਿਆ",learn1:"NAV ਕੀ ਹੈ — ਮਿਊਚੁਅਲ ਫੰਡ ਦੇ ਇੱਕ ਯੂਨਿਟ ਦੀ ਕੀਮਤ, ਰੋਜ਼ ਬਦਲਦੀ ਹੈ।",learn2:"SIP — ਹਰ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਆਦਤ; ਚੱਕਰਵਾਧ ਧੀਰਜ ਦਾ ਫਲ ਦਿੰਦਾ ਹੈ, ਟਿਪ ਦਾ ਨਹੀਂ।",learn3:"ਉਤਰਾਅ-ਚੜ੍ਹਾਅ — ਕੀਮਤ ਉੱਪਰ-ਹੇਠਾਂ ਹੁੰਦੀ ਹੈ; ਪੱਕਾ ਮੁਨਾਫ਼ਾ ਹੁੰਦਾ ਹੀ ਨਹੀਂ।",learn4:"ਸ਼ਿਕਾਇਤ — SCORES ’ਤੇ ਸ਼ਿਕਾਇਤ ਕਰੋ; ਨਾਮਜ਼ਦਗੀ ਅਤੇ IEPF ਸਥਿਤੀ ਵੇਖੋ।",help_title:"ਹੈਲਪਲਾਈਨ",news_title:"ਨਵਾਂ ਕੀ",news1:"ਫਾਰਵਰਡ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਟਿਪ-ਗਰੁੱਪ ਸਕ੍ਰੀਨਸ਼ਾਟ ਜਾਂਚੋ।",news2:"ਡੀਮੈਟ ਲਈ ਨਾਮਜ਼ਦਗੀ ਹੁਣ ਲਾਜ਼ਮੀ।",news3:"IEPF ਰਾਹੀਂ ਬੇਦਾਅਵਾ ਲਾਭਅੰਸ਼ ਵਾਪਸ ਮਿਲ ਸਕਦਾ ਹੈ।",links_title:"ਸਬੰਧਿਤ ਲਿੰਕ",hist_title:"ਪਿਛਲੇ ਮੁਲਾਂਕਣ",hist_empty:"ਇਸ ਡਿਵਾਈਸ ’ਤੇ ਅਜੇ ਕੁਝ ਨਹੀਂ।",footer:"ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਸਮੱਗਰੀ SANGYAN ਹੈਕਾਥਨ ਟੀਮ ਦੀ। ਸਰੋਤ: SEBI · NSE · SCORES.",f_acc:"ਪਹੁੰਚਯੋਗਤਾ",f_terms:"ਵਰਤੋਂ ਸ਼ਰਤਾਂ",f_priv:"ਗੋਪਨੀਯਤਾ (ਕੋਈ PII ਨਹੀਂ)",f_upd:"ਅਪਡੇਟ: ਅਕਤੂ 2026"}}

const HTML_LANG = {en: "en", hinglish: "hi", hi: "hi", mr: "mr", ta: "ta", bn: "bn", te: "te", kn: "kn", ml: "ml", gu: "gu", pa: "pa"};

// Optional-input labels (kept separate so the big dicts stay untouched).
const EXTRA = {
form_img: {en: "Screenshot image URL (optional)", hinglish: "Screenshot image ka URL (optional)", hi: "स्क्रीनशॉट चित्र का URL (वैकल्पिक)", mr: "स्क्रीनशॉट प्रतिमेची URL (ऐच्छिक)", ta: "ஸ்கிரீன்ஷாட் பட URL (விருப்பம்)", bn: "স্ক্রিনশট ছবির URL (ঐচ্ছিক)", te: "స్క్రీన్‌షాట్ చిత్ర URL (ఐచ్ఛికం)", kn: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಚಿತ್ರದ URL (ಐಚ್ಛಿಕ)", ml: "സ്ക്രീൻഷോട്ട് ചിത്ര URL (ഓപ്ഷണൽ)", gu: "સ્ક્રીનશોટ છબીનું URL (વૈકલ્પિક)", pa: "ਸਕ੍ਰੀਨਸ਼ਾਟ ਚਿੱਤਰ URL (ਵਿਕਲਪਿਕ)"},
form_yt: {en: "YouTube video link (optional)", hinglish: "YouTube video ka link (optional)", hi: "YouTube वीडियो लिंक (वैकल्पिक)", mr: "YouTube व्हिडिओ लिंक (ऐच्छिक)", ta: "YouTube வீடியோ இணைப்பு (விருப்பம்)", bn: "YouTube ভিডিও লিংক (ঐচ্ছিক)", te: "YouTube వీడియో లింక్ (ఐచ్ఛికం)", kn: "YouTube ವೀಡಿಯೊ ಲಿಂಕ್ (ಐಚ್ಛಿಕ)", ml: "YouTube വീഡിയോ ലിങ്ക് (ഓപ്ഷണൽ)", gu: "YouTube વિડિયો લિંક (વૈકલ્પિક)", pa: "YouTube ਵੀਡੀਓ ਲਿੰਕ (ਵਿਕਲਪਿਕ)"}};
for (const [k, m] of Object.entries(EXTRA)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA2 = {
learn_pick: {en: "Choose a topic to learn in plain words:", hinglish: "Simple shabdon me seekhne ke liye vishay chunein:", hi: "सरल शब्दों में सीखने हेतु विषय चुनें:", mr: "सोप्या शब्दांत शिकण्यासाठी विषय निवडा:", ta: "எளிய சொற்களில் கற்க தலைப்பைத் தேர்வு:", bn: "সহজ ভাষায় শিখতে বিষয় বেছে নিন:", te: "సులభ భాషలో నేర్చుకోవడానికి అంశం ఎంచుకోండి:", kn: "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಕಲಿಯಲು ವಿಷಯ ಆರಿಸಿ:", ml: "ലളിത ഭാഷയിൽ പഠിക്കാൻ വിഷയം തിരഞ്ഞെടുക്കൂ:", gu: "સરળ ભાષામાં શીખવા વિષય પસંદ કરો:", pa: "ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਿੱਖਣ ਲਈ ਵਿਸ਼ਾ ਚੁਣੋ:"},
learn_listen: {en: "Listen to lesson", hinglish: "Paath sunein", hi: "पाठ सुनें", mr: "धडा ऐका", ta: "பாடத்தைக் கேள்", bn: "পাঠ শুনুন", te: "పాఠం వినండి", kn: "ಪಾಠ ಕೇಳಿ", ml: "പാഠം കേൾക്കൂ", gu: "પાઠ સાંભળો", pa: "ਪਾਠ ਸੁਣੋ"},
sim_title: {en: "Try it yourself — consequence simulator", hinglish: "Khud aazmao — parinaam simulator", hi: "खुद आज़माएं — परिणाम सिम्युलेटर", mr: "स्वतः करून पहा — परिणाम सिम्युलेटर", ta: "நீங்களே முயலுங்கள் — விளைவு உருவகம்", bn: "নিজে চেষ্টা করুন — ফলাফল সিমুলেটর", te: "మీరే ప్రయత్నించండి — పరిణామ అనుకరణ", kn: "ನೀವೇ ಪ್ರಯತ್ನಿಸಿ — ಪರಿಣಾಮ ಅನುಕರಣೆ", ml: "നിങ്ങൾ തന്നെ പരീക്ഷിക്കൂ — ഫല സിമുലേറ്റർ", gu: "જાતે અજમાવો — પરિણામ સિમ્યુલેટર", pa: "ਖ਼ੁਦ ਅਜ਼ਮਾਓ — ਨਤੀਜਾ ਸਿਮੁਲੇਟਰ"},
sim_pmt: {en: "Monthly amount (₹)", hinglish: "Mahine ki rakam (₹)", hi: "मासिक राशि (₹)", mr: "मासिक रक्कम (₹)", ta: "மாதத் தொகை (₹)", bn: "মাসিক টাকা (₹)", te: "నెలవారీ మొత్తం (₹)", kn: "ಮಾಸಿಕ ಮೊತ್ತ (₹)", ml: "പ്രതിമാസ തുക (₹)", gu: "માસિક રકમ (₹)", pa: "ਮਹੀਨਾਵਾਰ ਰਕਮ (₹)"},
sim_yrs: {en: "Years", hinglish: "Saal", hi: "वर्ष", mr: "वर्षे", ta: "ஆண்டுகள்", bn: "বছর", te: "సంవత్సరాలు", kn: "ವರ್ಷಗಳು", ml: "വർഷം", gu: "વર્ષ", pa: "ਸਾਲ"},
sim_hype: {en: "Claimed growth (%/month)", hinglish: "Dawa wali growth (%/mahina)", hi: "दावाकृत वृद्धि (%/माह)", mr: "सांगितलेली वाढ (%/महिना)", ta: "கூறப்படும் வளர்ச்சி (%/மாதம்)", bn: "দাবি করা বৃদ্ধি (%/মাস)", te: "చెప్పిన వృద్ధి (%/నెల)", kn: "ಹೇಳಿಕೊಂಡ ಬೆಳವಣಿಗೆ (%/ತಿಂಗಳು)", ml: "അവകാശപ്പെടുന്ന വളർച്ച (%/മാസം)", gu: "દાવા કરેલ વૃદ્ધિ (%/મહિને)", pa: "ਦਾਅਵਾ ਵਾਧਾ (%/ਮਹੀਨਾ)"},
sim_crash: {en: "Add a 30% market crash at the end", hinglish: "Aakhir me 30% bazaar giravat jodein", hi: "अंत में 30% बाज़ार गिरावट जोड़ें", mr: "शेवटी 30% बाजार घसरण जोडा", ta: "முடிவில் 30% சந்தை வீழ்ச்சியைச் சேர்", bn: "শেষে 30% বাজার ধস যোগ করুন", te: "చివర్లో 30% మార్కెట్ పతనం జోడించండి", kn: "ಕೊನೆಯಲ್ಲಿ 30% ಮಾರುಕಟ್ಟೆ ಕುಸಿತ ಸೇರಿಸಿ", ml: "ഒടുവിൽ 30% വിപണി ഇടിവ് ചേർക്കൂ", gu: "અંતે 30% બજાર ઘટાડો ઉમેરો", pa: "ਅੰਤ ਵਿੱਚ 30% ਮਾਰਕੀਟ ਡਿੱਗ ਸ਼ਾਮਲ ਕਰੋ"},
sim_go: {en: "Show outcome", hinglish: "Parinaam dikhao", hi: "परिणाम दिखाएं", mr: "निकाल दाखवा", ta: "முடிவைக் காட்டு", bn: "ফল দেখান", te: "ఫలితం చూపించు", kn: "ಫಲಿತಾಂಶ ತೋರಿಸಿ", ml: "ഫലം കാണിക്കൂ", gu: "પરિણામ બતાવો", pa: "ਨਤੀਜਾ ਦਿਖਾਓ"}};
for (const [k, m] of Object.entries(EXTRA2)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA3 = {
sim_verdict: {en: "Promise: {hype} (×{mult} of what you paid). Steady habit: {real} (₹{realterms} in today's money). Gap ₹{gap} ≈ {months} months of your savings.", hinglish: "Vaada: {hype} (jama ka ×{mult}). Sabr wali aadat: {real} (aaj ke paise me ₹{realterms}). Antar ₹{gap} ≈ {months} mahine ki bachat.", hi: "वादा: {hype} (जमा का ×{mult})। धैर्य वाली आदत: {real} (आज के पैसे में ₹{realterms})। अंतर ₹{gap} ≈ {months} माह की बचत।", mr: "आश्वासन: {hype} (भरलेल्याच्या ×{mult})। संयमी सवय: {real} (आजच्या पैशांत ₹{realterms})। तफावत ₹{gap} ≈ {months} महिन्यांची बचत।", ta: "வாக்குறுதி: {hype} (செலுத்தியதில் ×{mult}). நிதானப் பழக்கம்: {real} (இன்றைய பணத்தில் ₹{realterms}). இடைவெளி ₹{gap} ≈ {months} மாத சேமிப்பு.", bn: "প্রতিশ্রুতি: {hype} (জমার ×{mult})। ধৈর্যের অভ্যাস: {real} (আজকের টাকায় ₹{realterms})। ফারাক ₹{gap} ≈ {months} মাসের সঞ্চয়।", te: "హామీ: {hype} (చెల్లించినదానికి ×{mult}). ఓర్పు అలవాటు: {real} (నేటి డబ్బులో ₹{realterms}). తేడా ₹{gap} ≈ {months} నెలల పొదుపు.", kn: "ಭರವಸೆ: {hype} (ಪಾವತಿಸಿದ್ದರ ×{mult}). ತಾಳ್ಮೆಯ ಅಭ್ಯಾಸ: {real} (ಇಂದಿನ ಹಣದಲ್ಲಿ ₹{realterms}). ಅಂತರ ₹{gap} ≈ {months} ತಿಂಗಳ ಉಳಿತಾಯ.", ml: "വാഗ്ദാനം: {hype} (അടച്ചതിന്റെ ×{mult}). ക്ഷമാശീലം: {real} (ഇന്നത്തെ പണത്തിൽ ₹{realterms}). വിടവ് ₹{gap} ≈ {months} മാസത്തെ സമ്പാദ്യം.", gu: "વચન: {hype} (ભરેલાના ×{mult}). ધીરજની ટેવ: {real} (આજના પૈસામાં ₹{realterms}). તફાવત ₹{gap} ≈ {months} મહિનાની બચત.", pa: "ਵਾਅਦਾ: {hype} (ਭਰੇ ਦੇ ×{mult})। ਧੀਰਜ ਵਾਲੀ ਆਦਤ: {real} (ਅੱਜ ਦੇ ਪੈਸੇ ਵਿੱਚ ₹{realterms})। ਫ਼ਰਕ ₹{gap} ≈ {months} ਮਹੀਨਿਆਂ ਦੀ ਬਚਤ।"}};
for (const [k, m] of Object.entries(EXTRA3)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA4 = {
calc_title: {en: "Money calculators — learn by doing", hinglish: "Paise ke calculator — karke seekho", hi: "पैसे के कैलकुलेटर — करके सीखें", mr: "पैसे गणक — करून शिका", ta: "பணக் கணக்கீடுகள் — செய்து கற்க", bn: "টাকার ক্যালকুলেটর — করে শিখুন", te: "డబ్బు కాలిక్యులేటర్లు — చేసి నేర్చుకోండి", kn: "ಹಣದ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು — ಮಾಡಿ ಕಲಿಯಿರಿ", ml: "പണ കാൽക്കുലേറ്ററുകൾ — ചെയ്ത് പഠിക്കൂ", gu: "પૈસાના કેલ્ક્યુલેટર — કરીને શીખો", pa: "ਪੈਸੇ ਦੇ ਕੈਲਕੁਲੇਟਰ — ਕਰਕੇ ਸਿੱਖੋ"},
calc_go: {en: "Calculate", hinglish: "Ginti karo", hi: "गणना करें", mr: "मोजा", ta: "கணக்கிடு", bn: "হিসাব করুন", te: "లెక్కించు", kn: "ಲೆಕ್ಕ ಹಾಕಿ", ml: "കണക്കാക്കൂ", gu: "ગણતરી કરો", pa: "ਹਿਸਾਬ ਲਾਓ"}};
for (const [k, m] of Object.entries(EXTRA4)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA5 = {
game_title: {en: "Spot the scam — play & learn", hinglish: "Scam pehchano — khelo aur seekho", hi: "ठगी पहचानो — खेलो और सीखो", mr: "फसवणूक ओळखा — खेळा आणि शिका", ta: "மோசடியைக் கண்டுபிடி — விளையாடு கற்றுக்கொள்", bn: "প্রতারণা চিনুন — খেলুন ও শিখুন", te: "స్కామ్ గుర్తించండి — ఆడండి నేర్చుకోండి", kn: "ವಂಚನೆ ಗುರುತಿಸಿ — ಆಡಿ ಕಲಿಯಿರಿ", ml: "തട്ടിപ്പ് കണ്ടെത്തൂ — കളിച്ച് പഠിക്കൂ", gu: "છેતરપિંડી ઓળખો — રમો અને શીખો", pa: "ਠੱਗੀ ਪਛਾਣੋ — ਖੇਡੋ ਤੇ ਸਿੱਖੋ"},
game_sub: {en: "6 real-style messages. Tap Scam or Safe — we show the red flags instantly.", hinglish: "6 asli-jaise message. Scam ya Safe dabao — red flags turant dikhenge.", hi: "6 असली जैसे संदेश। Scam या Safe दबाएं — रेड फ्लैग तुरंत दिखेंगे।", mr: "6 खऱ्यांसारखे संदेश. Scam की Safe दाबा — रेड फ्लॅग लगेच दिसतील.", ta: "6 உண்மை போன்ற செய்திகள். Scam அல்லது Safe — சிவப்புக் கொடிகள் உடனே.", bn: "6টি আসলের মতো বার্তা। Scam বা Safe চাপুন — রেড ফ্ল্যাগ সঙ্গে সঙ্গে।", te: "6 నిజమైన-లాంటి సందేశాలు. Scam లేదా Safe నొక్కండి — రెడ్ ఫ్లాగ్‌లు వెంటనే.", kn: "6 ನೈಜ-ಶೈಲಿಯ ಸಂದೇಶಗಳು. Scam ಅಥವಾ Safe ಒತ್ತಿ — ಕೆಂಪು ಚಿಹ್ನೆಗಳು ತಕ್ಷಣ.", ml: "6 യഥാർത്ഥ ശൈലി സന്ദേശങ്ങൾ. Scam അല്ലെങ്കിൽ Safe അമർത്തൂ — റെഡ് ഫ്ലാഗുകൾ ഉടൻ.", gu: "6 અસલી જેવા સંદેશ. Scam કે Safe દબાવો — રેડ ફ્લેગ તરત.", pa: "6 ਅਸਲੀ-ਵਰਗੇ ਸੁਨੇਹੇ। Scam ਜਾਂ Safe ਦਬਾਓ — ਰੈੱਡ ਫਲੈਗ ਤੁਰੰਤ।"},
btn_scam: {en: "Scam", hinglish: "Scam / Thagi", hi: "ठगी", mr: "फसवणूक", ta: "மோசடி", bn: "প্রতারণা", te: "స్కామ్", kn: "ವಂಚನೆ", ml: "തട്ടിപ്പ്", gu: "છેતરપિંડી", pa: "ਠੱਗੀ"},
btn_safe: {en: "Safe", hinglish: "Safe / Sahi", hi: "सही", mr: "सुरक्षित", ta: "பாதுகாப்பு", bn: "নিরাপদ", te: "సురక్షితం", kn: "ಸುರಕ್ಷಿತ", ml: "സുരക്ഷിതം", gu: "સલામત", pa: "ਸੁਰੱਖਿਅਤ"},
game_next: {en: "Next →", hinglish: "Aage →", hi: "आगे →", mr: "पुढे →", ta: "அடுத்து →", bn: "পরের →", te: "తర్వాత →", kn: "ಮುಂದೆ →", ml: "അടുത്തത് →", gu: "આગળ →", pa: "ਅੱਗੇ →"},
game_again: {en: "Play again", hinglish: "Phir khelo", hi: "फिर खेलें", mr: "पुन्हा खेळा", ta: "மீண்டும் விளையாடு", bn: "আবার খেলুন", te: "మళ్లీ ఆడండి", kn: "ಮತ್ತೆ ಆಡಿ", ml: "വീണ്ടും കളിക്കൂ", gu: "ફરી રમો", pa: "ਫਿਰ ਖੇਡੋ"},
game_real: {en: "Check a real message →", hinglish: "Asli message check karo →", hi: "असली संदेश जांचें →", mr: "खरा संदेश तपासा →", ta: "உண்மைச் செய்தியைச் சரிபார் →", bn: "আসল বার্তা যাচাই করুন →", te: "నిజమైన సందేశం తనిఖీ →", kn: "ನಿಜ ಸಂದೇಶ ಪರಿಶೀಲಿಸಿ →", ml: "യഥാർത്ഥ സന്ദേശം പരിശോധിക്കൂ →", gu: "અસલી સંદેશ તપાસો →", pa: "ਅਸਲੀ ਸੁਨੇਹਾ ਜਾਂਚੋ →"},
game_score: {en: "Score", hinglish: "Score", hi: "स्कोर", mr: "स्कोअर", ta: "மதிப்பெண்", bn: "স্কোর", te: "స్కోరు", kn: "ಸ್ಕೋರ್", ml: "സ്കോർ", gu: "સ્કોર", pa: "ਸਕੋਰ"},
game_best: {en: "Best on this device", hinglish: "Is device par best", hi: "इस डिवाइस पर सर्वश्रेष्ठ", mr: "या डिव्हाइसवर सर्वोत्तम", ta: "இந்தச் சாதனத்தில் சிறந்தது", bn: "এই ডিভাইসে সেরা", te: "ఈ పరికరంలో అత్యుత్తమం", kn: "ಈ ಸಾಧನದಲ್ಲಿ ಅತ್ಯುತ್ತಮ", ml: "ഈ ഉപകരണത്തിലെ മികച്ചത്", gu: "આ ડિવાઇસ પર શ્રેષ્ઠ", pa: "ਇਸ ਡਿਵਾਈਸ ’ਤੇ ਸਭ ਤੋਂ ਵਧੀਆ"},
game_win: {en: "Excellent — scam-proof instincts! You caught them all.", hinglish: "Shabaash — tumhe koi thag nahi sakta!", hi: "शाबाश — आपको कोई ठग नहीं सकता!", mr: "शाब्बास — तुम्हाला कोणी फसवू शकत नाही!", ta: "அருமை — உங்களை யாரும் ஏமாற்ற முடியாது!", bn: "সাবাশ — আপনাকে কেউ ঠকাতে পারবে না!", te: "భేష్ — మిమ్మల్ని ఎవరూ మోసం చేయలేరు!", kn: "ಶಹಬ್ಬಾಸ್ — ನಿಮ್ಮನ್ನು ಯಾರೂ ಮೋಸಗೊಳಿಸಲಾರರು!", ml: "കൊള്ളാം — നിങ്ങളെ ആർക്കും പറ്റിക്കാനാവില്ല!", gu: "શાબાશ — તમને કોઈ છેતરી શકે નહીં!", pa: "ਸ਼ਾਬਾਸ਼ — ਤੁਹਾਨੂੰ ਕੋਈ ਠੱਗ ਨਹੀਂ ਸਕਦਾ!"},
game_mid: {en: "Good start — replay to sharpen your eye for red flags.", hinglish: "Achhi shuruaat — red flags ke liye phir khelo.", hi: "अच्छी शुरुआत — रेड फ्लैग हेतु फिर खेलें।", mr: "चांगली सुरुवात — रेड फ्लॅगसाठी पुन्हा खेळा.", ta: "நல்ல தொடக்கம் — மீண்டும் விளையாடுங்கள்.", bn: "ভালো শুরু — আবার খেলে চোখ ধারালো করুন।", te: "మంచి ఆరంభం — మళ్లీ ఆడి కన్ను పదును పెట్టండి.", kn: "ಒಳ್ಳೆಯ ಆರಂಭ — ಮತ್ತೆ ಆಡಿ ಕಣ್ಣು ಹರಿತಗೊಳಿಸಿ.", ml: "നല്ല തുടക്കം — വീണ്ടും കളിച്ച് കണ്ണ് മൂർച്ചയാക്കൂ.", gu: "સારી શરૂઆત — ફરી રમીને નજર તેજ કરો.", pa: "ਚੰਗੀ ਸ਼ੁਰੂਆਤ — ਫਿਰ ਖੇਡ ਕੇ ਨਜ਼ਰ ਤਿੱਖੀ ਕਰੋ।"},
game_low: {en: "Scammers love beginners — play again, every round teaches the tricks.", hinglish: "Scammer naye logon ko phasate hain — phir khelo, har round trick sikhata hai.", hi: "ठग नए लोगों को फंसाते हैं — फिर खेलें, हर दौर तरकीब सिखाता है।", mr: "फसवणूकदार नवख्यांना फसवतात — पुन्हा खेळा.", ta: "மோசடிக்காரர்கள் புதியவர்களை ஏமாற்றுவர் — மீண்டும் விளையாடுங்கள்.", bn: "প্রতারকরা নতুনদের ফাঁসায় — আবার খেলুন।", te: "మోసగాళ్లు కొత్తవారిని మోసం చేస్తారు — మళ్లీ ఆడండి.", kn: "ವಂಚಕರು ಹೊಸಬರನ್ನು ಮೋಸಗೊಳಿಸುತ್ತಾರೆ — ಮತ್ತೆ ಆಡಿ.", ml: "തട്ടിപ്പുകാർ പുതിയവരെ പറ്റിക്കും — വീണ്ടും കളിക്കൂ.", gu: "છેતરનારા નવાઓને ફસાવે છે — ફરી રમો.", pa: "ਠੱਗ ਨਵਿਆਂ ਨੂੰ ਫਸਾਉਂਦੇ ਹਨ — ਫਿਰ ਖੇਡੋ।"}};
for (const [k, m] of Object.entries(EXTRA5)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA6 = {
th_verdict: {en: "Final word", hinglish: "Aakhri baat", hi: "आख़िरी बात", mr: "शेवटचे मत", ta: "முடிவு", bn: "শেষ কথা", te: "తుది మాట", kn: "ಕೊನೆಯ ಮಾತು", ml: "അവസാന വാക്ക്", gu: "છેલ્લી વાત", pa: "ਆਖ਼ਰੀ ਗੱਲ"},
th_tags: {en: "Simple tags", hinglish: "Seedhe tags", hi: "सीधे टैग", mr: "साधे टॅग", ta: "எளிய குறிச்சொற்கள்", bn: "সহজ ট্যাগ", te: "సులభ ట్యాగులు", kn: "ಸರಳ ಟ್ಯಾಗ್‌ಗಳು", ml: "ലളിത ടാഗുകൾ", gu: "સરળ ટેગ", pa: "ਸਿੱਧੇ ਟੈਗ"},
v_edu: {en: "This looks like teaching.", hinglish: "Yeh sikhane wala lagta hai.", hi: "यह सिखाने वाला लगता है।", mr: "हे शिकवणारे वाटते.", ta: "இது கற்பிப்பது போல் தெரிகிறது.", bn: "এটা শেখানোর মতো লাগছে।", te: "ఇది నేర్పేదిలా ఉంది.", kn: "ಇದು ಕಲಿಸುವಂತಿದೆ.", ml: "ഇത് പഠിപ്പിക്കുന്നത് പോലെ തോന്നുന്നു.", gu: "આ શીખવતું લાગે છે.", pa: "ਇਹ ਸਿਖਾਉਂਦਾ ਲੱਗਦਾ ਹੈ।"},
v_mix: {en: "This mixes teaching with selling — stay alert.", hinglish: "Isme seekh bhi hai, bechna bhi — savdhaan raho.", hi: "इसमें सीख भी है, बेचना भी — सावधान रहें।", mr: "यात शिकवणही आहे, विक्रीही — सावध राहा.", ta: "இதில் கற்பித்தலும் விற்பனையும் கலந்துள்ளது — கவனம்.", bn: "এতে শেখানোও আছে, বিক্রিও — সতর্ক থাকুন।", te: "దీంట్లో నేర్పడం, అమ్మడం రెండూ ఉన్నాయి — జాగ్రత్త.", kn: "ಇದರಲ್ಲಿ ಕಲಿಕೆಯೂ ಇದೆ, ಮಾರಾಟವೂ — ಎಚ್ಚರ.", ml: "ഇതിൽ പഠിപ്പിക്കലും വിൽപ്പനയും കലർന്നിരിക്കുന്നു — ശ്രദ്ധിക്കൂ.", gu: "આમાં શીખવણ પણ છે, વેચાણ પણ — સાવધ રહો.", pa: "ਇਸ ਵਿੱਚ ਸਿਖਾਉਣਾ ਵੀ ਹੈ, ਵੇਚਣਾ ਵੀ — ਸਾਵਧਾਨ ਰਹੋ।"},
v_pro: {en: "This looks like selling, not teaching.", hinglish: "Yeh sikhana nahi, bechna lagta hai.", hi: "यह सिखाना नहीं, बेचना लगता है।", mr: "हे शिकवणे नव्हे, विकणे वाटते.", ta: "இது கற்பித்தல் அல்ல, விற்பனை போல் தெரிகிறது.", bn: "এটা শেখানো নয়, বিক্রি মনে হচ্ছে।", te: "ఇది నేర్పడం కాదు, అమ్మకంలా ఉంది.", kn: "ಇದು ಕಲಿಸುವುದಲ್ಲ, ಮಾರುವುದರಂತೆ ಕಾಣುತ್ತದೆ.", ml: "ഇത് പഠിപ്പിക്കലല്ല, വിൽപ്പന പോലെ തോന്നുന്നു.", gu: "આ શીખવણ નહીં, વેચાણ લાગે છે.", pa: "ਇਹ ਸਿਖਾਉਣਾ ਨਹੀਂ, ਵੇਚਣਾ ਲੱਗਦਾ ਹੈ।"},
v_strong: {en: "It shows an official proof — still open the page yourself before trusting.", hinglish: "Isme sarkari saboot hai — phir bhi page khud kholkar dekho.", hi: "इसमें आधिकारिक प्रमाण है — फिर भी पेज खुद खोलकर देखें।", mr: "यात अधिकृत पुरावा आहे — तरी पान स्वतः उघडून पहा.", ta: "இதில் அதிகாரப்பூர்வ ஆதாரம் உள்ளது — பக்கத்தை நீங்களே திறந்து பாருங்கள்.", bn: "এতে সরকারি প্রমাণ আছে — তবু পেজ নিজে খুলে দেখুন।", te: "దీంట్లో అధికారిక ఆధారం ఉంది — అయినా పేజీ మీరే తెరిచి చూడండి.", kn: "ಇದರಲ್ಲಿ ಅಧಿಕೃತ ಪುರಾವೆ ಇದೆ — ಆದರೂ ಪುಟವನ್ನು ನೀವೇ ತೆರೆದು ನೋಡಿ.", ml: "ഇതിൽ ഔദ്യോഗിക തെളിവുണ്ട് — എന്നാലും പേജ് നിങ്ങൾ തന്നെ തുറന്ന് നോക്കൂ.", gu: "આમાં સત્તાવાર પુરાવો છે — છતાં પેજ જાતે ખોલીને જુઓ.", pa: "ਇਸ ਵਿੱਚ ਸਰਕਾਰੀ ਸਬੂਤ ਹੈ — ਫਿਰ ਵੀ ਪੇਜ ਖ਼ੁਦ ਖੋਲ੍ਹ ਕੇ ਵੇਖੋ।"},
v_weak: {en: "It has numbers or links, but no official proof to confirm them.", hinglish: "Isme number ya link hai, par pakka sarkari saboot nahi.", hi: "इसमें नंबर या लिंक है, पर पक्का आधिकारिक प्रमाण नहीं।", mr: "यात आकडे वा लिंक आहेत, पण अधिकृत पुरावा नाही.", ta: "இதில் எண்கள் அல்லது இணைப்புகள் உள்ளன, அதிகார ஆதாரம் இல்லை.", bn: "এতে সংখ্যা বা লিংক আছে, কিন্তু সরকারি প্রমাণ নেই।", te: "దీంట్లో సంఖ్యలు లేదా లింకులున్నాయి, కానీ అధికారిక ఆధారం లేదు.", kn: "ಇದರಲ್ಲಿ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ಲಿಂಕ್‌ಗಳಿವೆ, ಆದರೆ ಅಧಿಕೃತ ಪುರಾವೆ ಇಲ್ಲ.", ml: "ഇതിൽ കണക്കുകളോ ലിങ്കുകളോ ഉണ്ട്, പക്ഷേ ഔദ്യോഗിക തെളിവില്ല.", gu: "આમાં આંકડા કે લિંક છે, પણ સત્તાવાર પુરાવો નથી.", pa: "ਇਸ ਵਿੱਚ ਅੰਕੜੇ ਜਾਂ ਲਿੰਕ ਹਨ, ਪਰ ਸਰਕਾਰੀ ਸਬੂਤ ਨਹੀਂ।"},
v_none: {en: "It gives no proof you can check — never send money on such words.", hinglish: "Isme koi check karne layak saboot nahi — aisi baaton par paisa kabhi mat bhejo.", hi: "इसमें जांचने लायक कोई प्रमाण नहीं — ऐसी बातों पर पैसा कभी न भेजें।", mr: "यात तपासण्याजोगा पुरावा नाही — अशा बोलण्यावर पैसे पाठवू नका.", ta: "சரிபார்க்க எந்த ஆதாரமும் இல்லை — இப்படிப் பேச்சை நம்பி பணம் அனுப்பாதீர்கள்.", bn: "যাচাই করার মতো কোনো প্রমাণ নেই — এমন কথায় টাকা পাঠাবেন না।", te: "ధృవీకరించే ఆధారం ఏదీ లేదు — ఇలాంటి మాటలకు డబ్బు పంపవద్దు.", kn: "ಪರಿಶೀಲಿಸಬಹುದಾದ ಪುರಾವೆ ಇಲ್ಲ — ಇಂತಹ ಮಾತಿಗೆ ಹಣ ಕಳುಹಿಸಬೇಡಿ.", ml: "പരിശോധിക്കാവുന്ന തെളിവില്ല — ഇങ്ങനെയുള്ള വാക്കിൽ പണം അയയ്ക്കരുത്.", gu: "ચકાસી શકાય એવો કોઈ પુરાવો નથી — આવી વાતો પર પૈસા ક્યારેય ન મોકલો.", pa: "ਜਾਂਚਣ ਯੋਗ ਕੋਈ ਸਬੂਤ ਨਹੀਂ — ਅਜਿਹੀਆਂ ਗੱਲਾਂ ’ਤੇ ਪੈਸੇ ਕਦੇ ਨਾ ਭੇਜੋ।"},
tag_selling: {en: "Selling, not teaching", hinglish: "Bechna, sikhana nahi", hi: "बेचना, सिखाना नहीं", mr: "विक्री, शिकवण नव्हे", ta: "விற்பனை, கற்பித்தல் அல்ல", bn: "বিক্রি, শেখানো নয়", te: "అమ్మకం, నేర్పడం కాదు", kn: "ಮಾರಾಟ, ಕಲಿಕೆಯಲ್ಲ", ml: "വിൽപ്പന, പഠിപ്പിക്കലല്ല", gu: "વેચાણ, શીખવણ નહીં", pa: "ਵੇਚਣਾ, ਸਿਖਾਉਣਾ ਨਹੀਂ"},
tag_guarantee: {en: "Promises sure profit", hinglish: "Pakke munafe ka vaada", hi: "पक्के मुनाफे का वादा", mr: "खात्रीशीर नफ्याचे आश्वासन", ta: "உத்தரவாத லாப வாக்குறுதி", bn: "পাকা মুনাফার প্রতিশ্রুতি", te: "ఖచ్చిత లాభ హామీ", kn: "ಖಾತರಿ ಲಾಭದ ಭರವಸೆ", ml: "ഉറപ്പുള്ള ലാഭ വാഗ്ദാനം", gu: "પાકા નફાનું વચન", pa: "ਪੱਕੇ ਮੁਨਾਫ਼ੇ ਦਾ ਵਾਅਦਾ"},
tag_urgency: {en: "Creates hurry", hinglish: "Jaldi banata hai", hi: "जल्दी बनाता है", mr: "घाई निर्माण करते", ta: "அவசரம் காட்டுகிறது", bn: "তাড়াহুড়ো তৈরি করে", te: "తొందర పెడుతుంది", kn: "ಅವಸರ ಮಾಡಿಸುತ್ತದೆ", ml: "ധൃതി കൂട്ടുന്നു", gu: "ઉતાવળ કરાવે છે", pa: "ਕਾਹਲੀ ਪਾਉਂਦਾ ਹੈ"},
tag_group_cta: {en: "Pushes secret group/link", hinglish: "Chhupa group/link ki taraf dhakelta hai", hi: "छुपा ग्रुप/लिंक की ओर धकेलता है", mr: "गुप्त ग्रुप/लिंककडे ढकलते", ta: "ரகசிய குழு/இணைப்புக்குத் தள்ளுகிறது", bn: "গোপন গ্রুপ/লিংকের দিকে ঠেলে", te: "రహస్య గ్రూప్/లింక్ వైపు తోస్తుంది", kn: "ರಹಸ್ಯ ಗುಂಪು/ಲಿಂಕ್‌ಗೆ ತಳ್ಳುತ್ತದೆ", ml: "രഹസ്യ ഗ്രൂപ്പിലേക്ക്/ലിങ്കിലേക്ക് തള്ളുന്നു", gu: "છૂપા ગ્રુપ/લિંક તરફ ધકેલે છે", pa: "ਲੁਕਵੇਂ ਗਰੁੱਪ/ਲਿੰਕ ਵੱਲ ਧੱਕਦਾ ਹੈ"},
tag_referral: {en: "Earns from you", hinglish: "Tumse kamata hai", hi: "तुमसे कमाता है", mr: "तुमच्याकडून कमावते", ta: "உங்களிடமிருந்து சம்பாதிக்கிறது", bn: "তোমার থেকে কামায়", te: "మీ నుంచి సంపాదిస్తుంది", kn: "ನಿಮ್ಮಿಂದ ಗಳಿಸುತ್ತದೆ", ml: "നിങ്ങളിൽ നിന്ന് സമ്പാദിക്കുന്നു", gu: "તમારી પાસેથી કમાય છે", pa: "ਤੁਹਾਡੇ ਤੋਂ ਕਮਾਉਂਦਾ ਹੈ"},
tag_authority_tip: {en: "Fake expert talk", hinglish: "Nakli expert baatein", hi: "नकली विशेषज्ञ बातें", mr: "बनावट तज्ज्ञ भाषा", ta: "போலி நிபுணர் பேச்சு", bn: "ভুয়ো বিশেষজ্ঞের কথা", te: "నకిలీ నిపుణుల మాటలు", kn: "ನಕಲಿ ತಜ್ಞರ ಮಾತು", ml: "വ്യാജ വിദഗ്ധ സംസാരം", gu: "નકલી નિષ્ણાત વાતો", pa: "ਨਕਲੀ ਮਾਹਿਰ ਗੱਲਾਂ"},
tag_risky_money: {en: "Touches emergency money", hinglish: "Emergency paise ko chhuta hai", hi: "आपात पैसे को छूता है", mr: "आणीबाणीच्या पैशाला हात लावते", ta: "அவசரப் பணத்தைத் தொடுகிறது", bn: "জরুরি টাকায় হাত দেয়", te: "అత్యవసర డబ్బును ముట్టుకుంటుంది", kn: "ತುರ್ತು ಹಣವನ್ನು ಮುಟ್ಟುತ್ತದೆ", ml: "അടിയന്തര പണത്തെ തൊടുന്നു", gu: "કટોકટીના પૈસાને અડે છે", pa: "ਐਮਰਜੈਂਸੀ ਪੈਸੇ ਨੂੰ ਛੂੰਹਦਾ ਹੈ"},
tag_educational: {en: "Teaches patiently", hinglish: "Dheeraj se sikhata hai", hi: "धैर्य से सिखाता है", mr: "संयमाने शिकवते", ta: "பொறுமையாகக் கற்பிக்கிறது", bn: "ধৈর্য ধরে শেখায়", te: "ఓపికగా నేర్పుతుంది", kn: "ತಾಳ್ಮೆಯಿಂದ ಕಲಿಸುತ್ತದೆ", ml: "ക്ഷമയോടെ പഠിപ്പിക്കുന്നു", gu: "ધીરજથી શીખવે છે", pa: "ਧੀਰਜ ਨਾਲ ਸਿਖਾਉਂਦਾ ਹੈ"},
tag_official_source: {en: "Shows official proof", hinglish: "Sarkari saboot dikhata hai", hi: "आधिकारिक प्रमाण दिखाता है", mr: "अधिकृत पुरावा दाखवते", ta: "அதிகார ஆதாரம் காட்டுகிறது", bn: "সরকারি প্রমাণ দেখায়", te: "అధికారిక ఆధారం చూపుతుంది", kn: "ಅಧಿಕೃತ ಪುರಾವೆ ತೋರಿಸುತ್ತದೆ", ml: "ഔദ്യോഗിക തെളിവ് കാണിക്കുന്നു", gu: "સત્તાવાર પુરાવો બતાવે છે", pa: "ਸਰਕਾਰੀ ਸਬੂਤ ਦਿਖਾਉਂਦਾ ਹੈ"},
tag_has_numbers: {en: "Numbers but no proof", hinglish: "Number hain, saboot nahi", hi: "नंबर हैं, सबूत नहीं", mr: "आकडे आहेत, पुरावा नाही", ta: "எண்கள் உண்டு, ஆதாரம் இல்லை", bn: "সংখ্যা আছে, প্রমাণ নেই", te: "సంఖ్యలున్నాయి, ఆధారం లేదు", kn: "ಸಂಖ್ಯೆಗಳಿವೆ, ಪುರಾವೆ ಇಲ್ಲ", ml: "കണക്കുകളുണ്ട്, തെളിവില്ല", gu: "આંકડા છે, પુરાવો નથી", pa: "ਅੰਕੜੇ ਹਨ, ਸਬੂਤ ਨਹੀਂ"},
tag_no_evidence: {en: "No proof given", hinglish: "Koi saboot nahi", hi: "कोई सबूत नहीं", mr: "पुरावा नाहीच", ta: "ஆதாரமே இல்லை", bn: "কোনো প্রমাণ নেই", te: "ఆధారమే లేదు", kn: "ಪುರಾವೆಯೇ ಇಲ್ಲ", ml: "തെളിവേ ഇല്ല", gu: "કોઈ પુરાવો નથી", pa: "ਕੋਈ ਸਬੂਤ ਨਹੀਂ"}};
for (const [k, m] of Object.entries(EXTRA6)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA7 = {
act_title: {en: "What should I do now?", hinglish: "Ab mujhe kya karna chahiye?", hi: "अब मुझे क्या करना चाहिए?", mr: "आता मी काय करावे?", ta: "இப்போது நான் என்ன செய்ய வேண்டும்?", bn: "এখন আমার কী করা উচিত?", te: "ఇప్పుడు నేనేం చేయాలి?", kn: "ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?", ml: "ഇനി ഞാൻ എന്ത് ചെയ്യണം?", gu: "હવે મારે શું કરવું જોઈએ?", pa: "ਹੁਣ ਮੈਂ ਕੀ ਕਰਾਂ?"},
stamp_stop: {en: "DANGER — do not pay or reply", hinglish: "Khatra — paise mat bhejo, jawab mat do", hi: "ख़तरा — पैसे न भेजें, जवाब न दें", mr: "धोका — पैसे पाठवू नका, उत्तर देऊ नका", ta: "ஆபத்து — பணம் அனுப்பாதீர்கள், பதில் அளிக்காதீர்கள்", bn: "বিপদ — টাকা পাঠাবেন না, জবাব দেবেন না", te: "ప్రమాదం — డబ్బు పంపవద్దు, జవాబివ్వవద్దు", kn: "ಅಪಾಯ — ಹಣ ಕಳುಹಿಸಬೇಡಿ, ಉತ್ತರಿಸಬೇಡಿ", ml: "അപകടം — പണം അയയ്ക്കരുത്, മറുപടി നൽകരുത്", gu: "ખતરો — પૈસા ન મોકલો, જવાબ ન આપો", pa: "ਖ਼ਤਰਾ — ਪੈਸੇ ਨਾ ਭੇਜੋ, ਜਵਾਬ ਨਾ ਦਿਓ"},
stamp_learn: {en: "SAFE — good for learning", hinglish: "Safe hai — seekhne ke liye achha", hi: "सुरक्षित — सीखने हेतु अच्छा", mr: "सुरक्षित — शिकण्यासाठी चांगले", ta: "பாதுகாப்பு — கற்க நல்லது", bn: "নিরাপদ — শেখার জন্য ভালো", te: "సురక్షితం — నేర్చుకోవడానికి మంచిది", kn: "ಸುರಕ್ಷಿತ — ಕಲಿಯಲು ಒಳ್ಳೆಯದು", ml: "സുരക്ഷിതം — പഠിക്കാൻ നല്ലത്", gu: "સલામત — શીખવા માટે સારું", pa: "ਸੁਰੱਖਿਅਤ — ਸਿੱਖਣ ਲਈ ਚੰਗਾ"},
stamp_verify: {en: "BE CAREFUL — verify first", hinglish: "Savdhaan — pehle verify karo", hi: "सावधान — पहले सत्यापित करें", mr: "सावधान — आधी तपासा", ta: "கவனம் — முதலில் சரிபார்க்கவும்", bn: "সতর্ক থাকুন — আগে যাচাই করুন", te: "జాగ్రత్త — ముందు ధృవీకరించండి", kn: "ಎಚ್ಚರ — ಮೊದಲು ಪರಿಶೀಲಿಸಿ", ml: "ശ്രദ്ധിക്കൂ — ആദ്യം പരിശോധിക്കൂ", gu: "સાવધાન — પહેલા ચકાસો", pa: "ਸਾਵਧਾਨ — ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰੋ"},
step_stop1: {en: "Do NOT pay, click any link, or reply. Block the sender.", hinglish: "Paise mat bhejo, link mat kholo, jawab mat do. Bhejne wale ko block karo.", hi: "पैसे न भेजें, लिंक न खोलें, जवाब न दें। भेजने वाले को ब्लॉक करें।", mr: "पैसे पाठवू नका, लिंक उघडू नका, उत्तर देऊ नका. पाठवणाऱ्याला ब्लॉक करा.", ta: "பணம் அனுப்பவோ, இணைப்பைத் திறக்கவோ, பதில் அளிக்கவோ வேண்டாம். அனுப்பியவரைத் தடுக்கவும்.", bn: "টাকা পাঠাবেন না, লিংক খুলবেন না, জবাব দেবেন না। পাঠানো ব্যক্তিকে ব্লক করুন।", te: "డబ్బు పంపవద్దు, లింక్ తెరవవద్దు, జవాబివ్వవద్దు. పంపినవారిని బ్లాక్ చేయండి.", kn: "ಹಣ ಕಳುಹಿಸಬೇಡಿ, ಲಿಂಕ್ ತೆರೆಯಬೇಡಿ, ಉತ್ತರಿಸಬೇಡಿ. ಕಳುಹಿಸಿದವರನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ.", ml: "പണം അയയ്ക്കരുത്, ലിങ്ക് തുറക്കരുത്, മറുപടി നൽകരുത്. അയച്ചയാളെ ബ്ലോക്ക് ചെയ്യൂ.", gu: "પૈસા ન મોકલો, લિંક ન ખોલો, જવાબ ન આપો. મોકલનારને બ્લોક કરો.", pa: "ਪੈਸੇ ਨਾ ਭੇਜੋ, ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ, ਜਵਾਬ ਨਾ ਦਿਓ। ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਬਲਾਕ ਕਰੋ।"},
step_stop2: {en: "Warn your family and village group — these messages target many people at once.", hinglish: "Parivar aur gaon ke group ko chetao — aise message ek saath kai logon ko jaate hain.", hi: "परिवार व गाँव के ग्रुप को चेताएं — ऐसे संदेश एक साथ कई लोगों को जाते हैं।", mr: "कुटुंब व गावच्या ग्रुपला सावध करा — असे संदेश एकाच वेळी अनेकांना जातात.", ta: "குடும்ப, கிராமக் குழுவை எச்சரிக்கவும் — இச்செய்திகள் பலருக்கு ஒரே நேரத்தில் செல்லும்.", bn: "পরিবার ও গ্রামের গ্রুপকে সতর্ক করুন — এমন বার্তা একসঙ্গে অনেকের কাছে যায়।", te: "కుటుంబ, గ్రామ గ్రూపును హెచ్చరించండి — ఇలాంటి సందేశాలు ఒకేసారి చాలామందికి వెళ్తాయి.", kn: "ಕುಟುಂಬ, ಗ್ರಾಮದ ಗುಂಪಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಿ — ಇಂತಹ ಸಂದೇಶಗಳು ಏಕಕಾಲಕ್ಕೆ ಹಲವರಿಗೆ ಹೋಗುತ್ತವೆ.", ml: "കുടുംബത്തെയും ഗ്രാമ ഗ്രൂപ്പിനെയും മുന്നറിയിപ്പ് നൽകൂ — ഇത്തരം സന്ദേശങ്ങൾ ഒരുമിച്ച് പലർക്കും പോകും.", gu: "કુટુંબ અને ગામના ગ્રુપને ચેતવો — આવા સંદેશ એકસાથે ઘણાને જાય છે.", pa: "ਪਰਿਵਾਰ ਤੇ ਪਿੰਡ ਦੇ ਗਰੁੱਪ ਨੂੰ ਚੇਤਾਵਨੀ ਦਿਓ — ਅਜਿਹੇ ਸੁਨੇਹੇ ਇਕੱਠੇ ਕਈਆਂ ਨੂੰ ਜਾਂਦੇ ਹਨ।"},
step_stop3: {en: "Report it: call 1930 (cyber fraud helpline) with a screenshot.", hinglish: "Report karo: screenshot ke saath 1930 (cyber thagi helpline) par call karo.", hi: "रिपोर्ट करें: स्क्रीनशॉट के साथ 1930 (साइबर ठगी हेल्पलाइन) पर कॉल करें।", mr: "तक्रार करा: स्क्रीनशॉटसह 1930 (सायबर फसवणूक हेल्पलाइन) वर कॉल करा.", ta: "புகார்: ஸ்கிரீன்ஷாட்டுடன் 1930 (சைபர் மோசடி) எண்ணை அழையுங்கள்.", bn: "রিপোর্ট করুন: স্ক্রিনশটসহ 1930 (সাইবার প্রতারণা) নম্বরে কল করুন।", te: "రిపోర్ట్ చేయండి: స్క్రీన్‌షాట్‌తో 1930 (సైబర్ మోసం)కు కాల్ చేయండి.", kn: "ವರದಿ ಮಾಡಿ: ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ನೊಂದಿಗೆ 1930 (ಸೈಬರ್ ವಂಚನೆ) ಗೆ ಕರೆ ಮಾಡಿ.", ml: "റിപ്പോർട്ട് ചെയ്യൂ: സ്ക്രീൻഷോട്ടുമായി 1930 (സൈബർ തട്ടിപ്പ്) വിളിക്കൂ.", gu: "રિપોર્ટ કરો: સ્ક્રીનશોટ સાથે 1930 (સાયબર છેતરપિંડી) પર કૉલ કરો.", pa: "ਰਿਪੋਰਟ ਕਰੋ: ਸਕ੍ਰੀਨਸ਼ਾਟ ਨਾਲ 1930 (ਸਾਈਬਰ ਠੱਗੀ) ’ਤੇ ਕਾਲ ਕਰੋ।"},
step_stop4: {en: "Already paid? Complain on SCORES today and inform your bank.", hinglish: "Paise de chuke? Aaj hi SCORES par shikayat karo aur bank ko batao.", hi: "पैसे दे चुके? आज ही SCORES पर शिकायत करें और बैंक को बताएं।", mr: "पैसे दिलेत? आजच SCORES वर तक्रार करा व बँकेला कळवा.", ta: "பணம் கொடுத்துவிட்டீர்களா? இன்றே SCORES-இல் புகார் செய்து வங்கிக்குத் தெரிவியுங்கள்.", bn: "টাকা দিয়ে ফেলেছেন? আজই SCORES-এ অভিযোগ করুন ও ব্যাংককে জানান।", te: "డబ్బు ఇచ్చేశారా? ఈరోజే SCORESలో ఫిర్యాదు చేసి బ్యాంకుకు తెలపండి.", kn: "ಹಣ ಕೊಟ್ಟಿದ್ದೀರಾ? ಇಂದೇ SCORES ನಲ್ಲಿ ದೂರು ನೀಡಿ ಬ್ಯಾಂಕಿಗೆ ತಿಳಿಸಿ.", ml: "പണം കൊടുത്തോ? ഇന്ന് തന്നെ SCORES ൽ പരാതി നൽകി ബാങ്കിനെ അറിയിക്കൂ.", gu: "પૈસા આપી દીધા? આજે જ SCORES પર ફરિયાદ કરો અને બેંકને જણાવો.", pa: "ਪੈਸੇ ਦੇ ਚੁੱਕੇ? ਅੱਜ ਹੀ SCORES ’ਤੇ ਸ਼ਿਕਾਇਤ ਕਰੋ ਤੇ ਬੈਂਕ ਨੂੰ ਦੱਸੋ।"},
step_verify1: {en: "Do NOT pay yet. Ask yourself: where is the official proof?", hinglish: "Abhi paise mat do. Khud se poocho: official saboot kahan hai?", hi: "अभी पैसे न दें। खुद से पूछें: आधिकारिक प्रमाण कहाँ है?", mr: "अजून पैसे देऊ नका. स्वतःला विचारा: अधिकृत पुरावा कुठे आहे?", ta: "இன்னும் பணம் அனுப்ப வேண்டாம். அதிகார ஆதாரம் எங்கே என்று கேளுங்கள்.", bn: "এখনই টাকা দেবেন না। নিজেকে জিজ্ঞেস করুন: সরকারি প্রমাণ কোথায়?", te: "ఇంకా డబ్బు ఇవ్వవద్దు. అధికారిక ఆధారం ఎక్కడని అడగండి.", kn: "ಇನ್ನೂ ಹಣ ಕೊಡಬೇಡಿ. ಅಧಿಕೃತ ಪುರಾವೆ ಎಲ್ಲಿದೆ ಎಂದು ಕೇಳಿ.", ml: "ഇനിയും പണം നൽകരുത്. ഔദ്യോഗിക തെളിവ് എവിടെ എന്ന് ചോദിക്കൂ.", gu: "હજુ પૈસા ન આપો. પૂછો: સત્તાવાર પુરાવો ક્યાં છે?", pa: "ਅਜੇ ਪੈਸੇ ਨਾ ਦਿਓ। ਪੁੱਛੋ: ਸਰਕਾਰੀ ਸਬੂਤ ਕਿੱਥੇ ਹੈ?"},
step_verify2: {en: "Check the claim yourself on sebi.gov.in or NSE.", hinglish: "sebi.gov.in ya NSE par dawa khud check karo.", hi: "sebi.gov.in या NSE पर दावा खुद जांचें।", mr: "sebi.gov.in किंवा NSE वर दावा स्वतः तपासा.", ta: "sebi.gov.in அல்லது NSE-இல் நீங்களே சரிபார்க்கவும்.", bn: "sebi.gov.in বা NSE-তে দাবি নিজে যাচাই করুন।", te: "sebi.gov.in లేదా NSEలో మీరే ధృవీకరించండి.", kn: "sebi.gov.in ಅಥವಾ NSE ನಲ್ಲಿ ನೀವೇ ಪರಿಶೀಲಿಸಿ.", ml: "sebi.gov.in അല്ലെങ്കിൽ NSE ൽ നിങ്ങൾ തന്നെ പരിശോധിക്കൂ.", gu: "sebi.gov.in કે NSE પર જાતે ચકાસો.", pa: "sebi.gov.in ਜਾਂ NSE ’ਤੇ ਖ਼ੁਦ ਜਾਂਚੋ।"},
step_verify3: {en: "Show it to a trusted person before you decide.", hinglish: "Faisle se pehle kisi bharosemand vyakti ko dikhao.", hi: "फैसले से पहले किसी भरोसेमंद व्यक्ति को दिखाएं।", mr: "निर्णयापूर्वी विश्वासू व्यक्तीला दाखवा.", ta: "முடிவுக்கு முன் நம்பிக்கையானவரிடம் காட்டுங்கள்.", bn: "সিদ্ধান্তের আগে বিশ্বস্ত কাউকে দেখান।", te: "నిర్ణయానికి ముందు నమ్మకస్తుడికి చూపించండి.", kn: "ನಿರ್ಧಾರಕ್ಕೂ ಮೊದಲು ವಿಶ್ವಾಸಾರ್ಹರಿಗೆ ತೋರಿಸಿ.", ml: "തീരുമാനത്തിന് മുൻപ് വിശ്വസ്തനെ കാണിക്കൂ.", gu: "નિર્ણય પહેલા વિશ્વાસુ વ્યક્તિને બતાવો.", pa: "ਫ਼ੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਕਿਸੇ ਭਰੋਸੇਮੰਦ ਨੂੰ ਦਿਖਾਓ।"},
step_learn1: {en: "Safe to learn from. Explore the lessons below.", hinglish: "Seekhne ke liye safe. Neeche paath padho.", hi: "सीखने हेतु सुरक्षित। नीचे पाठ पढ़ें।", mr: "शिकण्यासाठी सुरक्षित. खालील धडे वाचा.", ta: "கற்கப் பாதுகாப்பானது. கீழே பாடங்களைப் படியுங்கள்.", bn: "শেখার জন্য নিরাপদ। নিচের পাঠ পড়ুন।", te: "నేర్చుకోవడానికి సురక్షితం. కింద పాఠాలు చదవండి.", kn: "ಕಲಿಯಲು ಸುರಕ್ಷಿತ. ಕೆಳಗಿನ ಪಾಠಗಳನ್ನು ಓದಿ.", ml: "പഠിക്കാൻ സുരക്ഷിതം. താഴെയുള്ള പാഠങ്ങൾ വായിക്കൂ.", gu: "શીખવા માટે સલામત. નીચે પાઠ વાંચો.", pa: "ਸਿੱਖਣ ਲਈ ਸੁਰੱਖਿਅਤ। ਹੇਠਾਂ ਪਾਠ ਪੜ੍ਹੋ।"},
step_learn2: {en: "Still, never share OTPs or bank passwords with anyone.", hinglish: "Phir bhi OTP ya bank password kisi se share mat karo.", hi: "फिर भी OTP या बैंक पासवर्ड किसी से साझा न करें।", mr: "तरी OTP किंवा बँक पासवर्ड कोणालाही देऊ नका.", ta: "ஆனாலும் OTP/வங்கி கடவுச்சொல்லை யாரிடமும் பகிர வேண்டாம்.", bn: "তবু OTP বা ব্যাংক পাসওয়ার্ড কাউকে দেবেন না।", te: "అయినా OTP/బ్యాంక్ పాస్‌వర్డ్ ఎవరికీ ఇవ్వవద్దు.", kn: "ಆದರೂ OTP/ಬ್ಯಾಂಕ್ ಪಾಸ್‌ವರ್ಡ್ ಯಾರಿಗೂ ನೀಡಬೇಡಿ.", ml: "എന്നാലും OTP/ബാങ്ക് പാസ്‌വേഡ് ആർക്കും നൽകരുത്.", gu: "છતાં OTP/બેંક પાસવર્ડ કોઈને ન આપો.", pa: "ਫਿਰ ਵੀ OTP/ਬੈਂਕ ਪਾਸਵਰਡ ਕਿਸੇ ਨੂੰ ਨਾ ਦਿਓ।"}};
for (const [k, m] of Object.entries(EXTRA7)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA8 = {
mic_btn: {en: "Speak instead", hinglish: "Bolkar likho", hi: "बोलकर लिखें", mr: "बोलून लिहा", ta: "பேசி எழுது", bn: "বলে লিখুন", te: "మాట్లాడి రాయండి", kn: "ಮಾತನಾಡಿ ಬರೆಯಿರಿ", ml: "പറഞ്ഞ് എഴുതൂ", gu: "બોલીને લખો", pa: "ਬੋਲ ਕੇ ਲਿਖੋ"},
file_label: {en: "Attach screenshot", hinglish: "Screenshot lagao", hi: "स्क्रीनशॉट लगाएं", mr: "स्क्रीनशॉट जोडा", ta: "ஸ்கிரீன்ஷாட் இணை", bn: "স্ক্রিনশট লাগান", te: "స్క్రీన్‌షాట్ జోడించండి", kn: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಲಗತ್ತಿಸಿ", ml: "സ്ക്രീൻഷോട്ട് ചേർക്കൂ", gu: "સ્ક્રીનશોટ જોડો", pa: "ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਾਓ"},
share_btn: {en: "Share result", hinglish: "Result share karo", hi: "परिणाम साझा करें", mr: "निकाल शेअर करा", ta: "முடிவைப் பகிர்", bn: "ফল শেয়ার করুন", te: "ఫలితం పంచుకోండి", kn: "ಫಲಿತಾಂಶ ಹಂಚಿಕೊಳ್ಳಿ", ml: "ഫലം പങ്കിടൂ", gu: "પરિણામ શેર કરો", pa: "ਨਤੀਜਾ ਸਾਂਝਾ ਕਰੋ"},
copied: {en: "Copied — paste it in WhatsApp to warn others.", hinglish: "Copy ho gaya — WhatsApp par chipka kar sabko chetao.", hi: "कॉपी हो गया — WhatsApp पर चिपकाकर सबको चेताएं।", mr: "कॉपी झाले — WhatsApp वर चिकटवून सर्वांना सावध करा.", ta: "நகலெடுக்கப்பட்டது — WhatsApp-இல் ஒட்டி எச்சரிக்கவும்.", bn: "কপি হয়েছে — WhatsApp-এ পেস্ট করে সবাইকে সতর্ক করুন।", te: "కాపీ అయింది — WhatsAppలో అతికించి అందరినీ హెచ్చరించండి.", kn: "ನಕಲಿಸಲಾಗಿದೆ — WhatsApp ನಲ್ಲಿ ಅಂಟಿಸಿ ಎಲ್ಲರಿಗೂ ಎಚ್ಚರಿಸಿ.", ml: "പകർത്തി — WhatsApp-ൽ ഒട്ടിച്ച് എല്ലാവരെയും മുന്നറിയിപ്പ് നൽകൂ.", gu: "કોપી થયું — WhatsApp પર ચોંટાડીને સૌને ચેતવો.", pa: "ਕਾਪੀ ਹੋ ਗਿਆ — WhatsApp ’ਤੇ ਚਿਪਕਾ ਕੇ ਸਭ ਨੂੰ ਚੇਤਾਵਨੀ ਦਿਓ।"},
ask_title: {en: "Ask & learn — search investor knowledge", hinglish: "Poocho aur seekho — gyaan khojo", hi: "पूछें व सीखें — निवेश ज्ञान खोजें", mr: "विचारा व शिका — ज्ञान शोधा", ta: "கேள் & கற்க — அறிவைத் தேடு", bn: "জিজ্ঞেস করুন ও শিখুন — জ্ঞান খুঁজুন", te: "అడగండి & నేర్చుకోండి — జ్ఞానం వెతకండి", kn: "ಕೇಳಿ ಮತ್ತು ಕಲಿಯಿರಿ — ಜ್ಞಾನ ಹುಡುಕಿ", ml: "ചോദിക്കൂ & പഠിക്കൂ — അറിവ് തിരയൂ", gu: "પૂછો અને શીખો — જ્ઞાન શોધો", pa: "ਪੁੱਛੋ ਤੇ ਸਿੱਖੋ — ਗਿਆਨ ਲੱਭੋ"},
ask_hint: {en: "Ask anything — NAV, SIP, UPI fraud, F&O risks, nomination — answered from our curated library with official sources.", hinglish: "Kuch bhi poocho — NAV, SIP, UPI thagi, F&O jokhim — hamari library se jawab, sarkari sources ke saath.", hi: "कुछ भी पूछें — NAV, SIP, UPI ठगी, F&O जोखिम, नामांकन — हमारी लाइब्रेरी से उत्तर, आधिकारिक स्रोतों सहित।", mr: "काहीही विचारा — NAV, SIP, UPI फसवणूक, F&O धोके — आमच्या लायब्ररीतून उत्तर.", ta: "எதையும் கேளுங்கள் — NAV, SIP, UPI மோசடி — நூலகத்திலிருந்து பதில்.", bn: "যা খুশি জিজ্ঞেস করুন — NAV, SIP, UPI প্রতারণা — লাইব্রেরি থেকে উত্তর।", te: "ఏదైనా అడగండి — NAV, SIP, UPI మోసం — లైబ్రరీ నుంచి సమాధానం.", kn: "ಏನಾದರೂ ಕೇಳಿ — NAV, SIP, UPI ವಂಚನೆ — ಗ್ರಂಥಾಲಯದಿಂದ ಉತ್ತರ.", ml: "എന്തും ചോദിക്കൂ — NAV, SIP, UPI തട്ടിപ്പ് — ലൈബ്രറിയിൽ നിന്ന് ഉത്തരം.", gu: "કંઈ પણ પૂછો — NAV, SIP, UPI છેતરપિંડી — લાઇબ્રેરીમાંથી જવાબ.", pa: "ਕੁਝ ਵੀ ਪੁੱਛੋ — NAV, SIP, UPI ਠੱਗੀ — ਲਾਇਬ੍ਰੇਰੀ ਤੋਂ ਜਵਾਬ।"},
ask_ph: {en: "e.g. how to avoid UPI fraud?", hinglish: "e.g. UPI thagi se kaise bache?", hi: "जैसे: UPI ठगी से कैसे बचें?", mr: "उदा: UPI फसवणूक कशी टाळावी?", ta: "எ.கா: UPI மோசடியைத் தவிர்ப்பது எப்படி?", bn: "যেমন: UPI প্রতারণা এড়াব কীভাবে?", te: "ఉదా: UPI మోసం నివారించడం ఎలా?", kn: "ಉದಾ: UPI ವಂಚನೆ ತಪ್ಪಿಸುವುದು ಹೇಗೆ?", ml: "ഉദാ: UPI തട്ടിപ്പ് എങ്ങനെ ഒഴിവാക്കാം?", gu: "દા.ત. UPI છેતરપિંડીથી કેવી રીતે બચવું?", pa: "ਜਿਵੇਂ: UPI ਠੱਗੀ ਤੋਂ ਕਿਵੇਂ ਬਚੀਏ?"},
ask_go: {en: "Search", hinglish: "Khojo", hi: "खोजें", mr: "शोधा", ta: "தேடு", bn: "খুঁজুন", te: "వెతకండి", kn: "ಹುಡುಕಿ", ml: "തിരയൂ", gu: "શોધો", pa: "ਲੱਭੋ"}};
for (const [k, m] of Object.entries(EXTRA8)) for (const [l, v] of Object.entries(m)) I18N[l][k] = v;

const EXTRA9 = {
nav_sim: {en: "Simulator", hi: "सिम्युलेटर", hinglish: "Simulator"},
nav_calc: {en: "Calculators", hi: "कैलकुलेटर", hinglish: "Calculator"},
nav_ask: {en: "Ask & learn", hi: "पूछें व सीखें", hinglish: "Poocho aur seekho"},
nav_recover: {en: "Already paid? Recover", hi: "पैसे दे चुके? वापसी", hinglish: "Paise de chuke? Vaapsi"},
nav_wall: {en: "Fraud wall", hi: "ठगी दीवार", hinglish: "Thagi deewar"},
rec_title: {en: "Already paid? Recover step by step", hi: "पैसे दे चुके? कदम-दर-कदम वापसी", hinglish: "Paise de chuke? Step-by-step vaapsi"},
rec_sub: {en: "Do not feel ashamed — act fast. The first hour matters most.", hi: "शर्मिंदा न हों — तेज़ी से काम करें। पहला घंटा सबसे अहम है।", hinglish: "Sharminda mat ho — tez kaam karo. Pehla ghanta sabse aham hai."},
rec_q: {en: "What happened?", hi: "क्या हुआ?", hinglish: "Kya hua?"},
rec_lost: {en: "Paid money to fraud", hi: "ठग को पैसे दिए", hinglish: "Thag ko paise diye"},
rec_upi: {en: "UPI fraud", hi: "UPI ठगी", hinglish: "UPI thagi"},
rec_otp: {en: "Shared OTP/password", hi: "OTP/पासवर्ड साझा किया", hinglish: "OTP/password share kiya"},
rec_scared: {en: "Just scared, no loss", hi: "बस डर, नुकसान नहीं", hinglish: "Bas darr, nuksaan nahi"},
draft_title: {en: "SCORES complaint draft — copy & paste on scores.sebi.gov.in", hi: "SCORES शिकायत मसौदा — scores.sebi.gov.in पर कॉपी-पेस्ट करें", hinglish: "SCORES shikayat draft — scores.sebi.gov.in par copy-paste karo"},
f_platform: {en: "Broker / platform / group name", hi: "ब्रोकर / प्लेटफॉर्म / ग्रुप का नाम", hinglish: "Broker / platform / group ka naam"},
f_amount: {en: "Amount lost (₹)", hi: "गंवाई राशि (₹)", hinglish: "Gawayi rakam (₹)"},
f_date: {en: "Date of payment", hi: "भुगतान की तारीख", hinglish: "Payment ki tareekh"},
f_details: {en: "What happened (2-3 lines)", hi: "क्या हुआ (2-3 पंक्तियां)", hinglish: "Kya hua (2-3 line)"},
draft_go: {en: "Make my draft", hi: "मसौदा बनाएं", hinglish: "Draft banao"},
draft_copy: {en: "Copy draft", hi: "मसौदा कॉपी करें", hinglish: "Draft copy karo"},
draft_copied: {en: "Draft copied — paste it on SCORES.", hi: "मसौदा कॉपी हुआ — SCORES पर चिपकाएं।", hinglish: "Draft copy hua — SCORES par chipkao."},
wall_title: {en: "Fraud wall — learn from others, warn others", hi: "ठगी दीवार — औरों से सीखें, औरों को चेताएं", hinglish: "Thagi deewar — auron se seekho, auron ko chetao"},
wall_sub: {en: "100% anonymous. No names, no phone numbers — numbers are auto-hidden. Your report teaches the next village.", hi: "100% गुमनाम। नाम नहीं, फोन नंबर नहीं — नंबर स्वतः छिपते हैं। आपकी रिपोर्ट अगले गांव को सिखाएगी।", hinglish: "100% gumnam. Naam nahi, phone number nahi — number auto-hide. Tumhari report agle gaon ko sikhayegi."},
w_type: {en: "Scam type", hi: "ठगी का प्रकार", hinglish: "Thagi ka prakaar"},
w_state: {en: "State", hi: "राज्य", hinglish: "Rajya"},
w_amount: {en: "Money involved", hi: "शामिल राशि", hinglish: "Shamil rakam"},
w_text: {en: "What happened (optional, no names/numbers)", hi: "क्या हुआ (वैकल्पिक, नाम/नंबर नहीं)", hinglish: "Kya hua (optional, naam/number nahi)"},
w_go: {en: "Post anonymously", hi: "गुमनाम पोस्ट करें", hinglish: "Gumnam post karo"},
w_thanks: {en: "Posted. Thank you — you may save someone today.", hi: "पोस्ट हुआ। धन्यवाद — आज आप किसी को बचा सकते हैं।", hinglish: "Post hua. Dhanyavaad — aaj tum kisi ko bacha sakte ho."},
w_counts: {en: "Reports so far", hi: "अब तक की रिपोर्ट", hinglish: "Ab tak ki report"},
wt_telegram: {en: "Telegram/WhatsApp tips group", hi: "टेलीग्राम/WhatsApp टिप ग्रुप", hinglish: "Telegram/WhatsApp tip group"},
wt_advisor: {en: "Fake SEBI advisor", hi: "नकली SEBI सलाहकार", hinglish: "Nakli SEBI advisor"},
wt_upi: {en: "UPI fraud", hi: "UPI ठगी", hinglish: "UPI thagi"},
wt_kyc: {en: "Fake KYC message", hi: "नकली KYC संदेश", hinglish: "Nakli KYC message"},
wt_loan: {en: "Loan app trap", hi: "लोन ऐप जाल", hinglish: "Loan app jaal"},
wt_ponzi: {en: "Ponzi / double-money scheme", hi: "पोंजी / दोगुना-पैसा योजना", hinglish: "Ponzi / double-paise scheme"},
wt_other: {en: "Other", hi: "अन्य", hinglish: "Anya"},
wa_none: {en: "Caught in time — no loss", hi: "समय पर पकड़ा — नुकसान नहीं", hinglish: "Time par pakda — nuksaan nahi"},
wa_1: {en: "Below ₹1,000", hi: "₹1,000 से कम", hinglish: "₹1,000 se kam"},
wa_2: {en: "₹1,000 – ₹10,000", hi: "₹1,000 – ₹10,000", hinglish: "₹1,000 – ₹10,000"},
wa_3: {en: "₹10,000 – ₹1 lakh", hi: "₹10,000 – ₹1 लाख", hinglish: "₹10,000 – ₹1 lakh"},
wa_4: {en: "Above ₹1 lakh", hi: "₹1 लाख से ऊपर", hinglish: "₹1 lakh se upar"}};
for (const [k, m] of Object.entries(EXTRA9)) for (const [l, v] of Object.entries(m)) { if (!I18N[l]) I18N[l] = {...I18N.en}; if (I18N[l][k] === undefined) I18N[l][k] = v; }
for (const [k, m] of Object.entries(EXTRA9)) { if (I18N.en[k] === undefined) I18N.en[k] = m.en; }
const SPEECH_LANG = {hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", bn: "bn-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN", gu: "gu-IN", pa: "pa-IN"};

function applyLang() {
  const d = I18N[LANG] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = d[el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  });
  document.documentElement.lang = HTML_LANG[LANG] || "en";
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const v = d[el.dataset.i18nPh];
    if (v !== undefined) el.setAttribute("placeholder", v);
  });
  document.querySelectorAll(".langs button").forEach((x) =>
    x.setAttribute("aria-pressed", String(x.dataset.lang === LANG)));
}

document.querySelectorAll(".langs button").forEach((b) =>
  b.addEventListener("click", () => {
    if (LANG === b.dataset.lang) return;
    LANG = b.dataset.lang;
    $("lang-more").value = "";
    applyLang();
    if (LAST && !$("out").hidden) doCheck(); // re-assess in the new language
  })
);

$("lang-more").addEventListener("change", (e) => {
  if (!e.target.value) return;
  LANG = e.target.value;
  applyLang();
  if (LAST && !$("out").hidden) doCheck();
});

async function doCheck() {
  const text = $("claim").value.trim();
  const imgurl = $("imgurl").value.trim();
  const yturl = $("yturl").value.trim();
  $("form-err").hidden = true;
  if (!text && !imgurl && !yturl) { const e = $("form-err"); e.textContent = "Give some text, an image link, or a YouTube link first."; e.hidden = false; return; }
  $("empty").hidden = true; $("out").hidden = true; $("loading").hidden = false; $("speak").disabled = true;
  try {
    const body = {lang: LANG};
    if (text) body.input_text = text;
    if (imgurl) body.image_url = imgurl;
    if (yturl) body.youtube_url = yturl;
    const r = await fetch(`${API}/api/analyze`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Server said ${r.status}`);
    LAST = await r.json();
    render(LAST); saveHist(LAST);
  } catch (err) {
    const e = $("form-err"); e.textContent = `Could not check. Is the backend on :8001? (${err.message})`; e.hidden = false;
    $("empty").hidden = false;
  } finally { $("loading").hidden = true; }
}

$("check").addEventListener("click", doCheck);

function render(d) {
  $("out").hidden = false; $("speak").disabled = false; $("share").disabled = false;
  const D = (I18N[LANG] && I18N[LANG].v_edu) ? I18N[LANG] : I18N.en;
  const vlabel = d.promo_label === "education" ? D.v_edu : (d.promo_label === "mixed" ? D.v_mix : D.v_pro);
  const vev = d.evidence.level === "strong" ? D.v_strong : (d.evidence.level === "weak" ? D.v_weak : D.v_none);
  $("verdict").textContent = vlabel + " " + vev;
  const stamp = $("stamp");
  stamp.className = "stamp stamp-" + d.action;
  stamp.textContent = D["stamp_" + d.action] || d.action.toUpperCase();
  const stepKeys = d.action === "stop"
    ? ["step_stop1", "step_stop2", "step_stop3", "step_stop4"]
    : (d.action === "verify" ? ["step_verify1", "step_verify2", "step_verify3"] : ["step_learn1", "step_learn2"]);
  $("acts").innerHTML = stepKeys.map((k) => `<li>${(D[k] || I18N.en[k])}</li>`).join("");
  const GOOD = {educational: 1, official_source: 1}, MID = {has_numbers: 1, no_evidence: 1};
  const labelOf = (t) => (D["tag_" + t] ? D["tag_" + t] : (I18N.en["tag_" + t] || t));
  $("tags").innerHTML = (d.tags || []).map((t) =>
    `<span class="badge ${GOOD[t] ? "b-edu" : (MID[t] ? "b-mixed" : "b-promo")}">${labelOf(t)}</span>`).join("");
  $("ev").textContent = d.evidence.summary;
  $("ev-u").textContent = "Uncertainty: " + d.evidence.uncertainty;
  $("src").innerHTML = (d.evidence.sources || []).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join("");
  $("plain").textContent = d.explainer.plain_text;
  $("analogy").textContent = d.explainer.analogy;
  $("terms").innerHTML = (d.explainer.terms || []).map((t) => `<li><strong>${t.term}:</strong> ${t.meaning}</li>`).join("");
}

function drawChart(sim, cvId) {
  const cv = $(cvId || "chart2"), ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, cv.width, cv.height);
  const real = sim.projection, hype = sim.inputs.hype_series || null;
  const terms = sim.inputs.real_terms_series || null;
  const max = Math.max(...real, ...(hype || [0]), ...(terms || [0])) || 1;
  const X = (i, n) => 34 + (i / Math.max(1, n - 1)) * (cv.width - 54);
  const Y = (v) => cv.height - 24 - (v / max) * (cv.height - 58);
  if (sim.inputs.crash_pct) { // shade the crash zone
    ctx.fillStyle = "rgba(198,40,40,.08)";
    ctx.fillRect(X(Math.floor(real.length * 0.7), real.length), 10, cv.width - X(Math.floor(real.length * 0.7), real.length) - 10, cv.height - 34);
    ctx.fillStyle = "#C62828"; ctx.font = "12px sans-serif"; ctx.fillText(`crash -${sim.inputs.crash_pct}%`, X(Math.floor(real.length * 0.7), real.length) + 4, 24);
  }
  ctx.strokeStyle = "#D5D5D5"; ctx.beginPath(); ctx.moveTo(34, 10); ctx.lineTo(34, cv.height - 24); ctx.lineTo(cv.width - 10, cv.height - 24); ctx.stroke();
  const line = (arr, col, dash, width) => { ctx.strokeStyle = col; ctx.lineWidth = width || 2; ctx.setLineDash(dash || []); ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i, arr.length), Y(v)) : ctx.moveTo(X(0, arr.length), Y(v))); ctx.stroke(); ctx.setLineDash([]); };
  if (terms) line(terms, "#9E9E9E", [2, 3], 1.5);
  line(real, "#0B3C5D", [], 2.5);
  if (hype) line(hype, "#C62828", [6, 4], 2);
  const f = (v) => "₹" + Math.round(v / 1000) + "k";
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#0B3C5D"; ctx.fillText("steady " + f(real[real.length - 1]), 38, 24);
  if (hype) { ctx.fillStyle = "#C62828"; ctx.fillText("hype " + f(hype[hype.length - 1]), 130, 24); }
  if (terms) { ctx.fillStyle = "#757575"; ctx.fillText("today's money " + f(terms[terms.length - 1]), 230, 24); }
}

$("speak").addEventListener("click", () => {
  if (!LAST) return;
  if (LAST.audio_url) { // Bhashini server voice when keyed
    new Audio(`${API}${LAST.audio_url}`).play().catch(() => deviceSpeech());
    return;
  }
  deviceSpeech();
});

function deviceSpeech() {
  const text = LAST.explainer.plain_text + " " + LAST.explainer.analogy;
  const want = (SPEECH_LANG[LANG] || "en-IN").toLowerCase().slice(0, 2);
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(want) && v.localService) || voices.find((v) => v.lang.toLowerCase().startsWith(want)) || null;
  speechSynthesis.cancel();
  // chunk: some engines cut long utterances
  const chunks = text.match(/.{1,200}(?:\s|$)/g) || [text];
  chunks.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    u.lang = SPEECH_LANG[LANG] || "en-IN";
    u.rate = 0.95;
    if (voice) u.voice = voice;
    if (i === 0 && typeof speechSynthesis.getVoices === "function") speechSynthesis.getVoices();
    speechSynthesis.speak(u);
  });
}

function saveHist(d) {
  const k = "sangyan-hist", arr = JSON.parse(localStorage.getItem(k) || "[]");
  arr.unshift({t: new Date().toLocaleString(), label: d.promo_label, ev: d.evidence.level, txt: d.claims[0]?.text?.slice(0, 80)});
  localStorage.setItem(k, JSON.stringify(arr.slice(0, 8)));
  $("hist").innerHTML = arr.slice(0, 8).map((h) => `<div>${h.t} — <strong>${h.label}</strong> / evidence ${h.ev} — ${h.txt}</div>`).join("");
}

$("clear").addEventListener("click", () => {
  $("claim").value = ""; $("imgurl").value = ""; $("yturl").value = ""; $("imgfile").value = ""; $("file-note").textContent = "";
  $("out").hidden = true; $("empty").hidden = false;
  $("form-err").hidden = true; LAST = null; $("speak").disabled = true; $("share").disabled = true;
});

let FS = 16;
const setFS = (v) => { FS = Math.min(20, Math.max(13, v)); document.documentElement.style.setProperty("--fs", FS + "px"); };
$("f-inc").addEventListener("click", () => setFS(FS + 1));
$("f-dec").addEventListener("click", () => setFS(FS - 1));
$("f-reset").addEventListener("click", () => setFS(16));

applyLang();

// ---- Track C: voice-first lesson browser + hands-on simulator ----
let LESSON = null;
fetch(`${API}/api/topics`).then((r) => r.json()).then((topics) => {
  $("chips").innerHTML = topics.map((t) => `<button data-topic="${t}" aria-pressed="false">${t}</button>`).join("");
  document.querySelectorAll("#chips button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#chips button").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      learnTopic(b.dataset.topic);
    }));
}).catch(() => { $("chips").innerHTML = "<span class='muted'>Topics need the backend on :8001.</span>"; });

async function learnTopic(topic) {
  $("lesson").hidden = false;
  $("lesson-plain").textContent = "…";
  try {
    const r = await fetch(`${API}/api/learn`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({topic, lang: LANG}),
    });
    LESSON = await r.json();
    $("lesson-plain").textContent = LESSON.explainer.plain_text;
    $("lesson-analogy").textContent = LESSON.explainer.analogy;
    $("lesson-terms").innerHTML = (LESSON.explainer.terms || []).map((t) => `<li><strong>${t.term}:</strong> ${t.meaning}</li>`).join("");
  } catch { $("lesson-plain").textContent = "Could not load. Is the backend on :8001?"; }
}

$("lesson-speak").addEventListener("click", () => {
  if (!LESSON) return;
  const u = new SpeechSynthesisUtterance(LESSON.explainer.plain_text + " " + LESSON.explainer.analogy);
  u.lang = SPEECH_LANG[LANG] || "en-IN";
  speechSynthesis.cancel(); speechSynthesis.speak(u);
});

for (const [id, out] of [["sim-pmt", "sim-pmt-v"], ["sim-yrs", "sim-yrs-v"], ["sim-hype", "sim-hype-v"]])
  $(id).addEventListener("input", (e) => $(out).textContent = e.target.value);

document.querySelectorAll(".preset").forEach((b) =>
  b.addEventListener("click", () => { $("sim-hype").value = b.dataset.hype; $("sim-hype-v").textContent = b.dataset.hype; $("sim-go").click(); }));

$("sim-go").addEventListener("click", async () => {  const body = {
    pmt: parseFloat($("sim-pmt").value),
    months: parseInt($("sim-yrs").value, 10) * 12,
    claimed_monthly_pct: parseFloat($("sim-hype").value),
    crash_pct: $("sim-crash").checked ? 30 : 0,
  };
  try {
    const r = await fetch(`${API}/api/simulate`, {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body),
    });
    const sim = await r.json();
    drawChart(sim, "chart2");
    const f = (v) => "₹" + Math.round(v).toLocaleString("en-IN");
    const t = (I18N[LANG] && I18N[LANG].sim_verdict) || I18N.en.sim_verdict;
    const paid = sim.inputs.pmt * sim.inputs.months;
    $("sim-verdict").hidden = false;
    $("sim-verdict").textContent = t
      .replace("{hype}", f(sim.inputs.hype_final)).replace("{mult}", sim.inputs.hype_multiple)
      .replace("{real}", f(sim.inputs.realistic_final)).replace("{realterms}", Math.round(sim.inputs.real_terms_final).toLocaleString("en-IN"))
      .replace("{gap}", Math.round(sim.inputs.gap).toLocaleString("en-IN")).replace("{months}", sim.inputs.gap_months_of_saving);
    $("sim-note2").textContent = sim.inputs.note || "";
  } catch { $("sim-note2").textContent = "Could not simulate. Is the backend on :8001?"; }
});

// ---- Track C: money calculator suite ----
const CALC_NAMES = {sip: "SIP", compound: "Compound", inflation: "Inflation", emi: "EMI", ror: "Returns %", bond: "Bond yield", retire: "Retirement"};
let CALC_SPECS = {}, CALC_TOOL = "sip";
fetch(`${API}/api/calcs`).then((r) => r.json()).then((specs) => {
  CALC_SPECS = specs;
  $("calc-chips").innerHTML = Object.keys(specs).map((t) => `<button data-tool="${t}" aria-pressed="${t === "sip"}">${CALC_NAMES[t] || t}</button>`).join("");
  document.querySelectorAll("#calc-chips button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#calc-chips button").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      CALC_TOOL = b.dataset.tool;
      renderCalcForm();
    }));
  renderCalcForm();
}).catch(() => { $("calc-form").innerHTML = "<span class='muted'>Calculators need the backend on :8001.</span>"; });

function renderCalcForm() {
  const spec = CALC_SPECS[CALC_TOOL];
  if (!spec) return;
  $("calc-form").innerHTML = spec.fields.map(([name, label, lo, hi, def]) =>
    `<div><label for="cf-${name}">${label} <output id="cf-${name}-v">${def}</output></label>` +
    `<input type="range" id="cf-${name}" min="${lo}" max="${hi}" step="${(hi - lo) > 1000 ? 100 : ((hi - lo) > 30 ? 1 : 0.5)}" value="${def}"></div>`).join("");
  spec.fields.forEach(([name]) => $(`cf-${name}`).addEventListener("input", (e) => $(`cf-${name}-v`).textContent = e.target.value));
}

$("calc-go").addEventListener("click", async () => {
  const spec = CALC_SPECS[CALC_TOOL];
  if (!spec) return;
  const inputs = {};
  spec.fields.forEach(([name]) => inputs[name] = parseFloat($(`cf-${name}`).value));
  try {
    const r = await fetch(`${API}/api/calc`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({tool: CALC_TOOL, inputs, lang: LANG}),
    });
    const d = await r.json();
    $("calc-out").hidden = false;
    const f = (v) => (typeof v === "number" ? (v % 1 ? v.toLocaleString("en-IN", {maximumFractionDigits: 2}) : Math.round(v).toLocaleString("en-IN")) : v);
    $("calc-rows").innerHTML = Object.entries(d.results).map(([k, v]) =>
      `<tr><th>${k.replace(/_/g, " ")}</th><td>${typeof v === "number" && v > 100 ? "₹" : ""}${f(v)}${k.endsWith("_pct") ? "%" : ""}</td></tr>`).join("");
    drawSeries("chart3", d.series);
    $("calc-explain").textContent = d.explain;
  } catch { $("calc-out").hidden = true; }
});

// ---- Spot-the-scam game (sidebar trainer) ----
const DECK = [
{answer: "scam",
 en: "Guaranteed 5% monthly profit! Join our private Telegram group now — only 50 seats left.",
 hi: "हर महीने 5% पक्का मुनाफा! अभी हमारा प्राइवेट टेलीग्राम ग्रुप जॉइन करें — सिर्फ़ 50 सीटें बचीं।",
 hinglish: "Har mahine 5% pakka munafa! Abhi hamara private Telegram group join karo — sirf 50 seats bachi.",
 fen: "Guaranteed returns + secret group + urgency — three classic scam signals.",
 fhi: "पक्का मुनाफा + गुप्त ग्रुप + जल्दी का दबाव — तीन पुराने ठगी के संकेत।",
 fhinglish: "Pakka munafa + secret group + jaldi ka dabav — teen classic scam sanket."},
{answer: "safe",
 en: "NAV is the per-share value of a mutual fund. It changes daily with the market — learn more on amfiindia.com.",
 hi: "NAV म्यूचुअल फंड के एक हिस्से की कीमत है। यह बाज़ार के साथ रोज़ बदलती है — amfiindia.com पर और जानें।",
 hinglish: "NAV mutual fund ke ek hisse ki keemat hai. Yeh bazaar ke saath roz badalti hai.",
 fen: "Explains a concept, no promises, no pressure, points to an official source.",
 fhi: "संकल्पना समझाता है — कोई वादा-दबाव नहीं, आधिकारिक स्रोत बताता है।",
 fhinglish: "Concept samjhata hai — koi vaada-dabav nahi, official source batata hai."},
{answer: "scam",
 en: "I am a SEBI-registered advisor. Double your money in 6 months — DM me for the payment link.",
 hi: "मैं SEBI-पंजीकृत सलाहकार हूँ। 6 महीने में पैसा दोगुना — पेमेंट लिंक हेतु DM करें।",
 hinglish: "Main SEBI-registered advisor hoon. 6 mahine me paisa double — payment link ke liye DM karo.",
 fen: "Real advisors never DM for payments or promise doubling. Registration claims are easy to fake.",
 fhi: "असली सलाहकार DM पर पेमेंट नहीं मांगते, दोगुना करने का वादा नहीं करते।",
 fhinglish: "Asli advisor DM par payment nahi mangte, double ka vaada nahi karte."},
{answer: "safe",
 en: "Faced a problem with your broker? File a free complaint on SCORES at scores.sebi.gov.in — keep your documents ready.",
 hi: "ब्रोकर से दिक्कत? scores.sebi.gov.in पर SCORES में मुफ़्त शिकायत करें — दस्तावेज़ तैयार रखें।",
 hinglish: "Broker se dikkat? scores.sebi.gov.in par SCORES me muft shikayat karo.",
 fen: "Gives a process, names the official portal, asks for documents — not money.",
 fhi: "प्रक्रिया बताता है, आधिकारिक पोर्टल का नाम — पैसे नहीं, दस्तावेज़ मांगता है।",
 fhinglish: "Process batata hai, official portal ka naam — paise nahi, documents mangta hai."},
{answer: "scam",
 en: "Multibagger jackpot call! Pay ₹9,999 advance today to block your slot — offer ends tonight.",
 hi: "मल्टीबैगर जैकपॉट कॉल! स्लॉट पक्का करने हेतु आज ही ₹9,999 एडवांस दें — ऑफर आज रात ख़त्म।",
 hinglish: "Multibagger jackpot call! Slot pakka karne ke liye aaj hi ₹9,999 advance do — offer aaj raat khatm.",
 fen: "Advance fee + jackpot language + midnight deadline. Legit services never work like this.",
 fhi: "एडवांस फीस + जैकपॉट भाषा + आधी रात की डेडलाइन। असली सेवाएं ऐसे काम नहीं करतीं।",
 fhinglish: "Advance fee + jackpot bhasha + midnight deadline. Asli services aise kaam nahi karti."},
{answer: "safe",
 en: "A ₹5,000 monthly SIP builds discipline. Markets will rise and fall — that is normal, not a signal to panic.",
 hi: "₹5,000 मासिक SIP अनुशासन बनाती है। बाज़ार चढ़ेगा-उतरेगा — यह सामान्य है, घबराने का संकेत नहीं।",
 hinglish: "₹5,000 monthly SIP discipline banati hai. Bazaar chadhega-utrega — yeh normal hai, panic ka signal nahi.",
 fen: "Teaches a habit, admits ups and downs. No tip, no link, no hurry.",
 fhi: "आदत सिखाता है, उतार-चढ़ाव स्वीकारता है — कोई टिप, लिंक, जल्दी नहीं।",
 fhinglish: "Aadat sikhata hai, upar-neeche accept karta hai — koi tip, link, jaldi nahi."}];

let G_ORDER = [], G_I = 0, G_S = 0;
function deckLang() { return (LANG === "hi" || LANG === "hinglish") ? LANG : "en"; }
function flagLang() { return deckLang() === "en" ? "fen" : (deckLang() === "hi" ? "fhi" : "fhinglish"); }

function gameStart() {
  G_ORDER = [...DECK.keys()].sort(() => Math.random() - 0.5);
  G_I = 0; G_S = 0;
  $("game-end").hidden = true;
  gameShow();
}

function gameShow() {
  const c = DECK[G_ORDER[G_I]], L = deckLang();
  $("game-card").textContent = c[L];
  $("game-q").textContent = `${G_I + 1} / ${DECK.length}`;
  $("game-s").textContent = G_S;
  $("game-why").hidden = true;
  $("game-next").hidden = true;
  $("game-scam").disabled = $("game-safe").disabled = false;
}

function gameAnswer(pick) {
  const c = DECK[G_ORDER[G_I]];
  const ok = pick === c.answer;
  if (ok) G_S++;
  $("game-s").textContent = G_S;
  const w = $("game-why");
  w.className = "game-why " + (ok ? "ok" : "no");
  w.textContent = (ok ? "✓ " : "✗ ") + c[flagLang()];
  w.hidden = false;
  $("game-scam").disabled = $("game-safe").disabled = true;
  const last = G_I === DECK.length - 1;
  $("game-next").hidden = false;
  $("game-next").textContent = last
    ? ((I18N[LANG] && I18N[LANG].game_score) || "Score") + ` → ${G_S}/${DECK.length}`
    : ((I18N[LANG] && I18N[LANG].game_next) || "Next →");
  $("game-next").onclick = () => { if (last) gameEnd(); else { G_I++; gameShow(); } };
}

function gameEnd() {
  $("game-end").hidden = false;
  const t = G_S >= 5 ? "game_win" : (G_S >= 3 ? "game_mid" : "game_low");
  $("game-tier").textContent = (I18N[LANG] && I18N[LANG][t]) || I18N.en[t];
  let best = 0;
  try {
    best = Math.max(G_S, parseInt(localStorage.getItem("sangyan-best") || "0", 10));
    localStorage.setItem("sangyan-best", String(best));
  } catch { best = G_S; }
  $("game-b").textContent = best;
}

$("game-scam").addEventListener("click", () => gameAnswer("scam"));
$("game-safe").addEventListener("click", () => gameAnswer("safe"));
$("game-again").addEventListener("click", gameStart);
function gameLangRefresh() { if (!$("game-scam").disabled) gameShow(); }
document.querySelectorAll(".langs button").forEach((b) => b.addEventListener("click", gameLangRefresh));
$("lang-more").addEventListener("change", gameLangRefresh);
try { $("game-b").textContent = localStorage.getItem("sangyan-best") || "0"; } catch {}
gameStart();

function drawSeries(cvId, series) {
  const cv = $(cvId), ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (!series || !series.length) return;
  const max = Math.max(...series) || 1, min = Math.min(...series, 0);
  const X = (i) => 34 + (i / Math.max(1, series.length - 1)) * (cv.width - 54);
  const Y = (v) => cv.height - 24 - ((v - min) / (max - min || 1)) * (cv.height - 58);
  ctx.strokeStyle = "#D5D5D5"; ctx.beginPath(); ctx.moveTo(34, 10); ctx.lineTo(34, cv.height - 24); ctx.lineTo(cv.width - 10, cv.height - 24); ctx.stroke();
  ctx.strokeStyle = "#0B3C5D"; ctx.lineWidth = 2.5; ctx.beginPath();
  series.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(0), Y(v)));
  ctx.stroke();
  ctx.fillStyle = "#0B3C5D"; ctx.font = "12px sans-serif";
  ctx.fillText("₹" + Math.round(series[series.length - 1]).toLocaleString("en-IN"), 38, 24);
}

// ---- Uploads, mic, share, knowledge search, offline ----
$("imgfile").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  $("file-note").textContent = "…";
  try {
    const fd = new FormData();
    fd.append("file", f);
    const r = await fetch(`${API}/api/ocr`, {method: "POST", body: fd});
    const d = await r.json();
    if (d.text) { $("claim").value = d.text; $("file-note").textContent = ""; }
    else $("file-note").textContent = d.note || "No text found.";
  } catch { $("file-note").textContent = "Upload failed. Is the backend on :8001?"; }
});

$("mic").addEventListener("click", () => {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) { $("claim").focus(); return; }
  const rec = new Rec();
  rec.lang = SPEECH_LANG[LANG] || "en-IN";
  rec.onresult = (e) => { $("claim").value += ( $("claim").value ? " " : "") + e.results[0][0].transcript; };
  rec.start();
});

$("share").addEventListener("click", async () => {
  if (!LAST) return;
  const steps = [...document.querySelectorAll("#acts li")].map((li) => "- " + li.textContent).join("\n");
  const text = `Saarthi check:\n${$("stamp").textContent}\n${$("verdict").textContent}\n${steps}\nHelpline: 1930 | SCORES: scores.sebi.gov.in`;
  if (navigator.share) { try { await navigator.share({text}); return; } catch {} }
  try {
    await navigator.clipboard.writeText(text);
    $("share").textContent = (I18N[LANG] && I18N[LANG].copied) || I18N.en.copied;
    setTimeout(applyLang, 2500);
  } catch {}
});

async function doAsk() {
  const q = $("ask-q").value.trim();
  if (!q) return;
  $("ask-out").hidden = false;
  $("ask-answer").textContent = "…";
  $("ask-src").innerHTML = "";
  try {
    const r = await fetch(`${API}/api/search`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({q, lang: LANG}),
    });
    const d = await r.json();
    $("ask-answer").textContent = d.answer || "—";
    $("ask-flag").textContent = d.grounded_ai ? "AI answer, grounded in library notes." : "";
    $("ask-src").innerHTML = (d.sources || []).map((s) =>
      `<li><strong>${s.title}</strong>${(s.links || []).map((u) => ` — <a href="${u}" target="_blank" rel="noopener">${u.replace("https://", "").replace("www.", "")}</a>`).join("")}</li>`).join("");
  } catch { $("ask-answer").textContent = "Search needs the backend on :8001."; }
}
$("ask-go").addEventListener("click", doAsk);
$("ask-q").addEventListener("keydown", (e) => { if (e.key === "Enter") doAsk(); });

// ---- Hash routes: one section per page ----
const ROUTES = {"": ["check-sec", "result"], "#/": ["check-sec", "result"], "#/learn": ["learn"], "#/simulate": ["simsec"], "#/calculators": ["calcsec"], "#/ask": ["asksec"], "#/recover": ["recsec"], "#/wall": ["wallsec"]};
function showRoute() {
  let h = location.hash;
  if (h === "#help") {
    h = "#/";
    history.replaceState(null, "", h);
    setTimeout(() => { const el = $("help"); if (el) el.scrollIntoView(); }, 50);
  }
  const ids = ROUTES[h] || ROUTES[""];
  document.querySelectorAll("main .content > section.panel").forEach((s) => {
    const show = ids.includes(s.id);
    s.classList.toggle("route-hidden", !show);
    if (show) { s.classList.remove("route-enter"); void s.offsetWidth; s.classList.add("route-enter"); }
  });
  document.querySelectorAll(".mainnav a[href^='#/']").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === (h || "#/")));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showRoute);

// ---- Recovery wizard ----
const REC = {
lost: {en: ["Call 1930 NOW with your transaction ID — the first hour matters most.", "Call your bank: ask to freeze the transaction and recall the money.", "Save everything: screenshots, numbers, UPI IDs, receipts.", "Then make your SCORES draft below and file it today."],
 hi: ["ट्रांजैक्शन ID के साथ अभी 1930 पर कॉल करें — पहला घंटा सबसे अहम है।", "बैंक को कॉल करें: लेनदेन रोकने व पैसा वापस मंगाने को कहें।", "सब सहेजें: स्क्रीनशॉट, नंबर, UPI ID, रसीदें।", "फिर नीचे SCORES मसौदा बनाकर आज ही दर्ज करें।"],
 hinglish: ["Transaction ID ke saath abhi 1930 par call karo — pehla ghanta sabse aham hai.", "Bank ko call karo: transaction rokne aur paisa wapas mangane ko kaho.", "Sab sahejo: screenshot, number, UPI ID, raseedein.", "Phir neeche SCORES draft banakar aaj hi file karo."]},
upi: {en: ["Call 1930 and report inside your UPI app (BHIM/GPay/PhonePe) too.", "Ask your bank to block the collect request and recall the payment.", "Change your UPI PIN today; never approve 'receive money' requests."],
 hi: ["1930 पर कॉल करें और UPI ऐप में भी रिपोर्ट करें।", "बैंक से कलेक्ट-रिक्वेस्ट ब्लॉक व पेमेंट वापस मंगाने को कहें।", "आज ही UPI PIN बदलें; 'पैसे पाने' वाली मांग कभी अप्रूव न करें।"],
 hinglish: ["1930 par call karo aur UPI app me bhi report karo.", "Bank se collect-request block aur payment wapas mangao.", "Aaj hi UPI PIN badlo; 'paise paane' wali maang kabhi approve mat karo."]},
otp: {en: ["Call your bank NOW: freeze cards, netbanking and UPI.", "Change UPI PIN, ATM PIN and all passwords from a safe phone.", "Call 1930 with details; watch statements daily for 30 days."],
 hi: ["बैंक को अभी कॉल करें: कार्ड, नेटबैंकिंग व UPI फ्रीज़ कराएं।", "सुरक्षित फोन से UPI PIN, ATM PIN व पासवर्ड बदलें।", "विवरण सहित 1930 पर कॉल करें; 30 दिन रोज़ स्टेटमेंट देखें।"],
 hinglish: ["Bank ko abhi call karo: card, netbanking aur UPI freeze karao.", "Safe phone se UPI PIN, ATM PIN aur password badlo.", "Details ke saath 1930 par call karo; 30 din roz statement dekho."]},
scared: {en: ["No money lost means you already won — well done for stopping.", "Block the sender and play the Spot-the-Scam game to learn the flags."],
 hi: ["पैसा नहीं गया यानी आप जीत गए — रुकने हेतु शाबाश।", "भेजने वाले को ब्लॉक करें और झंडे सीखने हेतु गेम खेलें।"],
 hinglish: ["Paisa nahi gaya matlab tum jeet gaye — rukne ke liye shabaash.", "Bhejne wale ko block karo aur flags seekhne ke liye game khelo."]}};
let REC_KIND = "lost";
function recLang() { return (LANG === "hi" || LANG === "hinglish") ? LANG : "en"; }
function recShow() {
  const L = recLang();
  $("rec-steps").innerHTML = REC[REC_KIND][L].map((s) => `<li>${s}</li>`).join("");
}
document.querySelectorAll("#rec-chips button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("#rec-chips button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
    REC_KIND = b.dataset.rec;
    recShow();
  }));
function draftLangRefresh() { recShow(); }
document.querySelectorAll(".langs button").forEach((b) => b.addEventListener("click", draftLangRefresh));
$("lang-more").addEventListener("change", draftLangRefresh);
recShow();

$("draft-go").addEventListener("click", () => {
  const p = $("d-platform").value.trim() || "—", a = $("d-amount").value.trim() || "—";
  const dt = $("d-date").value || "—", w = $("d-details").value.trim() || "—";
  const L = recLang();
  const T = {
    en: `Subject: Fraud complaint — ${p}, Rs.${a}, ${dt}\n\nRespected Sir/Madam,\nOn ${dt}, I lost Rs.${a} to ${p}. What happened: ${w}. I have saved screenshots and transaction references and will attach them. I request investigation and refund of my money.\n\nI will file this on SCORES (scores.sebi.gov.in) with my contact details.`,
    hi: `विषय: ठगी शिकायत — ${p}, ₹${a}, ${dt}\n\nआदरणीय महोदय/महोदया,\n${dt} को ${p} के कारण मेरे ₹${a} गए। क्या हुआ: ${w}। स्क्रीनशॉट व लेनदेन-संदर्भ सहेजे हैं, संलग्न करूंगा/करूंगी। जांच व राशि-वापसी का निवेदन है।\n\nइसे SCORES (scores.sebi.gov.in) पर अपनी संपर्क-जानकारी सहित दर्ज करूंगा/करूंगी।`,
    hinglish: `Vishay: Thagi shikayat — ${p}, ₹${a}, ${dt}\n\nAadarniya Mahoday/Mahodaya,\n${dt} ko ${p} ke kaaran mere ₹${a} gaye. Kya hua: ${w}। Screenshot aur transaction reference saheje hain, attach karunga/karungi. Jaanch aur rashi-vaapsi ka nivedan hai.\n\nIse SCORES (scores.sebi.gov.in) par apni contact-details sahit file karunga/karungi.`}[L];
  $("draft-out").value = T;
});
$("draft-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("draft-out").value);
    $("draft-copy").textContent = (I18N[LANG] && I18N[LANG].draft_copied) || I18N.en.draft_copied;
    setTimeout(applyLang, 2500);
  } catch {}
});

// ---- Fraud wall ----
const WALL_STATES = ["AP", "Bihar", "Delhi", "Gujarat", "Haryana", "HP", "Jharkhand", "Karnataka", "Kerala", "MP", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "TN", "Telangana", "UP", "Uttarakhand", "WB", "Other"];
$("w-state").innerHTML = WALL_STATES.map((s) => `<option value="${s}">${s}</option>`).join("");
async function wallLoad() {
  try {
    const w = await (await fetch(`${API}/api/wall`)).json();
    $("wall-total").textContent = w.total || 0;
    const names = {telegram_tip: "Tips group", fake_advisor: "Fake advisor", upi_fraud: "UPI fraud", kyc_phishing: "Fake KYC", loan_app: "Loan app", ponzi: "Ponzi", other: "Other"};
    $("wall-list").innerHTML = (w.recent || []).map((r) =>
      `<div class="wallrow"><strong>${names[r.scam_type] || r.scam_type}</strong> · ${r.state} · ${r.amount.replace(/_/g, " ")}${r.text ? `<br>${r.text}` : ""}</div>`).join("") || "<p class='muted'>—</p>";
  } catch {}
}
$("wall-go").addEventListener("click", async () => {
  const body = {scam_type: $("w-type").value, state: $("w-state").value, amount: $("w-amount").value, text: $("w-text").value.trim()};
  const r = await fetch(`${API}/api/wall`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)});
  if (r.ok) {
    $("w-text").value = "";
    $("wall-msg").textContent = (I18N[LANG] && I18N[LANG].w_thanks) || I18N.en.w_thanks;
    wallLoad();
  }
});
wallLoad();
showRoute();

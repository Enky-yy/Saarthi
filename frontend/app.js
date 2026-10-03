const API = location.port === "8001" ? "" : "http://127.0.0.1:8001";
let LANG = "en", LAST = null;
const $ = (id) => document.getElementById(id);

const I18N = {
en: {skip:"Skip to main content",sra:"Screen Reader Access",nav_home:"Home",nav_check:"Check a Claim",nav_report:"Assessment Report",nav_learn:"Investor Education",nav_help:"Helpline",ticker:"<strong>Notice:</strong> No one can guarantee market returns. Verify registration on SEBI / SCORES / NSE before transferring money. This portal gives education only — never investment advice.",crumb:"Home / Investor Resilience / Claim Assessment",h1:"Online Claim Assessment Facility",intro:"Paste the text of any investment tip, message, or video caption received on WhatsApp, Telegram, YouTube or Instagram. The facility examines whether the content is <strong>educating</strong> you or <strong>selling</strong> to you, states what evidence supports it, and explains the concept in plain words with a steady-vs-hype illustration.",form_title:"Application Form — Claim Details",form_label:"Text of claim / tip / caption",req:"(required)",form_hint:"Do not enter OTPs, bank passwords, or full account numbers. Only the claim text is needed.",btn_check:"Submit for assessment",btn_speak:"Listen to explanation",btn_clear:"Reset form",rep_title:"Assessment Report",empty:"No assessment generated yet. Acknowledgement number will appear here after submission.",loading:"Assessment in progress…",th_class:"Classification",th_ev:"Evidence level",th_mean:"Plain-language meaning",th_sim:"Consequence illustration (₹5,000/month × 12)",th_sig:"Detected signals",disclaimer:"Disclaimer: computer-generated educational assessment, not investment advice or a legal finding. Verify independently on SEBI / SCORES / NSE before acting.",learn_title:"Investor education",learn1:"What is NAV — per-share value of a mutual fund, changes daily.",learn2:"SIP — a fixed monthly habit; compounding rewards patience, not tips.",learn3:"Volatility — prices move up and down; guaranteed returns do not exist.",learn4:"Grievance — lodge complaints on SCORES; check nominee and IEPF status.",help_title:"Helpline",news_title:"What is new",news1:"Check tip-group screenshots before forwarding.",news2:"Nominee registration now mandatory for demat.",news3:"Unclaimed dividends recoverable via IEPF.",links_title:"Related links",hist_title:"Previous assessments",hist_empty:"None on this device yet.",footer:"Content owned and maintained by SANGYAN hackathon team for demonstration. Source registries: SEBI · NSE · SCORES.",f_acc:"Accessibility",f_terms:"Terms of Use",f_priv:"Privacy (no PII collected)",f_upd:"Last updated: Oct 2026"},
hinglish: {skip:"Main content par jayein",sra:"Screen Reader Access",nav_home:"Home",nav_check:"Dawa Check Karein",nav_report:"Assessment Report",nav_learn:"Niveshak Shiksha",nav_help:"Helpline",ticker:"<strong>Suchna:</strong> Bazaar me pakke munafe ki guarantee koi nahi de sakta. Paisa bhejne se pehle SEBI / SCORES / NSE par registration verify karein. Yeh portal sirf shiksha deta hai — salah nahi.",crumb:"Home / Niveshak Suraksha / Dawa Mulyankan",h1:"Online Dawa Mulyankan Suvidha",intro:"WhatsApp, Telegram, YouTube ya Instagram par mile kisi bhi tip, message ya video caption ka text paste karein. Yeh suvidha batayegi ki content aapko <strong>sikha</strong> raha hai ya <strong>bech</strong> raha hai, iske peeche kya saboot hai, aur iska seedha-saadha matlab kya hai.",form_title:"Aavedan Form — Dawe ka Vivaran",form_label:"Dawe / tip / caption ka text",req:"(zaroori)",form_hint:"OTP, bank password ya poora account number na likhein. Sirf dawe ka text chahiye.",btn_check:"Mulyankan ke liye bhejein",btn_speak:"Samjhauta sunein",btn_clear:"Form saaf karein",rep_title:"Mulyankan Report",empty:"Abhi koi mulyankan nahi hua. Bhejne ke baad yahan report aayegi.",loading:"Mulyankan chal raha hai…",th_class:"Vargikaran",th_ev:"Saboot ka star",th_mean:"Seedhe shabdon me arth",th_sim:"Parinaam udaharan (₹5,000/mahina × 12)",th_sig:"Pakde gaye sanket",disclaimer:"Disclaimer: computer se bani shiksha report, salah ya kanooni faisla nahi. Kaam karne se pehle SEBI / SCORES / NSE par khud verify karein.",learn_title:"Niveshak shiksha",learn1:"NAV kya hai — mutual fund ke ek hisse ki keemat, roz badalti hai.",learn2:"SIP — har mahine ki aadat; compounding dhairya ka phal deta hai, tip ka nahi.",learn3:"Volatility — keemat upar-neeche hoti hai; pakke munafe hote hi nahi.",learn4:"Shikayat — SCORES par shikayat karein; nominee aur IEPF sthiti dekhein.",help_title:"Helpline",news_title:"Naya kya hai",news1:"Forward karne se pehle tip-group screenshot check karein.",news2:"Demat ke liye nominee ab anivarya hai.",news3:"IEPF se be-daawa dividend wapas mil sakta hai.",links_title:"Sambandhit link",hist_title:"Pichhle mulyankan",hist_empty:"Is device par abhi koi nahi.",footer:"Samagri pradarshan hetu SANGYAN hackathon team dwara. Source: SEBI · NSE · SCORES.",f_acc:"Accessibility",f_terms:"Upp yog shartein",f_priv:"Privacy (koi PII nahi)",f_upd:"Update: Oct 2026"},
hi: {skip:"मुख्य सामग्री पर जाएं",sra:"स्क्रीन रीडर एक्सेस",nav_home:"मुख्य पृष्ठ",nav_check:"दावा जांचें",nav_report:"मूल्यांकन रिपोर्ट",nav_learn:"निवेशक शिक्षा",nav_help:"हेल्पलाइन",ticker:"<strong>सूचना:</strong> बाज़ार में पक्के मुनाफे की गारंटी कोई नहीं दे सकता। पैसे भेजने से पहले SEBI / SCORES / NSE पर पंजीकरण सत्यापित करें। यह पोर्टल केवल शिक्षा देता है — सलाह नहीं।",crumb:"मुख्य पृष्ठ / निवेशक सुरक्षा / दावा मूल्यांकन",h1:"ऑनलाइन दावा मूल्यांकन सुविधा",intro:"WhatsApp, Telegram, YouTube या Instagram पर मिले किसी भी टिप, संदेश या वीडियो कैप्शन का पाठ चिपकाएं। यह सुविधा बताएगी कि सामग्री आपको <strong>सिखा</strong> रही है या <strong>बेच</strong> रही है, इसके पीछे क्या प्रमाण है, और इसका सीधा अर्थ क्या है।",form_title:"आवेदन प्रपत्र — दावे का विवरण",form_label:"दावे / टिप / कैप्शन का पाठ",req:"(आवश्यक)",form_hint:"OTP, बैंक पासवर्ड या पूरा खाता नंबर न लिखें। केवल दावे का पाठ चाहिए।",btn_check:"मूल्यांकन हेतु भेजें",btn_speak:"व्याख्या सुनें",btn_clear:"प्रपत्र साफ़ करें",rep_title:"मूल्यांकन रिपोर्ट",empty:"अभी कोई मूल्यांकन नहीं हुआ। भेजने के बाद रिपोर्ट यहाँ दिखेगी।",loading:"मूल्यांकन प्रगति पर है…",th_class:"वर्गीकरण",th_ev:"प्रमाण स्तर",th_mean:"सरल भाषा में अर्थ",th_sim:"परिणाम उदाहरण (₹5,000/माह × 12)",th_sig:"पकड़े गए संकेत",disclaimer:"अस्वीकरण: कंप्यूटर-निर्मित शैक्षणिक मूल्यांकन, निवेश सलाह या विधिक निष्कर्ष नहीं। कार्रवाई से पहले SEBI / SCORES / NSE पर स्वयं सत्यापित करें।",learn_title:"निवेशक शिक्षा",learn1:"NAV क्या है — म्यूचुअल फंड के एक हिस्से की कीमत, रोज़ बदलती है।",learn2:"SIP — हर महीने की आदत; चक्रवृद्धि धैर्य का फल देती है, टिप का नहीं।",learn3:"उतार-चढ़ाव — कीमत ऊपर-नीचे होती है; पक्का मुनाफा होता ही नहीं।",learn4:"शिकायत — SCORES पर शिकायत करें; नामांकन और IEPF स्थिति देखें।",help_title:"हेल्पलाइन",news_title:"नया क्या है",news1:"फॉरवर्ड करने से पहले टिप-ग्रुप स्क्रीनशॉट जांचें।",news2:"डीमैट हेतु नामांकन अब अनिवार्य है।",news3:"IEPF से बेदावा लाभांश वापस मिल सकता है।",links_title:"संबंधित लिंक",hist_title:"पिछले मूल्यांकन",hist_empty:"इस डिवाइस पर अभी कोई नहीं।",footer:"प्रदर्शन हेतु सामग्री SANGYAN हैकथॉन टीम द्वारा। स्रोत: SEBI · NSE · SCORES।",f_acc:"सुगम्यता",f_terms:"उपयोग की शर्तें",f_priv:"गोपनीयता (कोई PII नहीं)",f_upd:"अद्यतन: अक्तू 2026"},
mr: {skip:"मुख्य मजकुराकडे जा",sra:"स्क्रीन रीडर अ‍ॅक्सेस",nav_home:"मुख्यपृष्ठ",nav_check:"दावा तपासा",nav_report:"मूल्यमापन अहवाल",nav_learn:"गुंतवणूकदार शिक्षण",nav_help:"हेल्पलाइन",ticker:"<strong>सूचना:</strong> बाजारात खात्रीशीर परताव्याची हमी कोणीही देऊ शकत नाही. पैसे पाठवण्यापूर्वी SEBI / SCORES / NSE वर नोंदणी तपासा. हे पोर्टल फक्त शिक्षण देते — सल्ला नाही.",crumb:"मुख्यपृष्ठ / गुंतवणूकदार सुरक्षा / दावा मूल्यमापन",h1:"ऑनलाइन दावा मूल्यमापन सुविधा",intro:"WhatsApp, Telegram, YouTube किंवा Instagram वरील कोणत्याही टीप, संदेश किंवा व्हिडिओ कॅप्शनचा मजकूर चिकटवा. ही सुविधा सांगेल की मजकूर तुम्हाला <strong>शिकवत</strong> आहे की <strong>विकत</strong> आहे, त्यामागे काय पुरावा आहे आणि त्याचा साधा अर्थ काय आहे.",form_title:"अर्ज — दाव्याचा तपशील",form_label:"दावा / टीप / कॅप्शनचा मजकूर",req:"(आवश्यक)",form_hint:"OTP, बँक पासवर्ड किंवा पूर्ण खाते क्रमांक लिहू नका. फक्त दाव्याचा मजकूर हवा आहे.",btn_check:"मूल्यमापनासाठी पाठवा",btn_speak:"स्पष्टीकरण ऐका",btn_clear:"अर्ज साफ करा",rep_title:"मूल्यमापन अहवाल",empty:"अद्याप कोणतेही मूल्यमापन नाही. पाठवल्यावर अहवाल येथे दिसेल.",loading:"मूल्यमापन सुरू आहे…",th_class:"वर्गीकरण",th_ev:"पुराव्याची पातळी",th_mean:"साध्या भाषेतील अर्थ",th_sim:"परिणाम उदाहरण (₹5,000/महिना × 12)",th_sig:"आढळलेले संकेत",disclaimer:"टीप: संगणक-निर्मित शैक्षणिक मूल्यमापन, गुंतवणूक सल्ला किंवा कायदेशीर निष्कर्ष नाही. कृतीपूर्वी SEBI / SCORES / NSE वर स्वतः तपासा.",learn_title:"गुंतवणूकदार शिक्षण",learn1:"NAV म्हणजे काय — म्युच्युअल फंडाच्या एका हिश्याची किंमत, रोज बदलते.",learn2:"SIP — दरमहा ठराविक सवय; चक्रवाढ संयमाचे फळ देते, टीपचे नाही.",learn3:"चढ-उतार — किंमत वर-खाली होते; हमखास नफा नसतोच.",learn4:"तक्रार — SCORES वर तक्रार करा; नामांकन व IEPF स्थिती पहा.",help_title:"हेल्पलाइन",news_title:"नवीन काय",news1:"फॉरवर्ड करण्यापूर्वी टीप-ग्रुप स्क्रीनशॉट तपासा.",news2:"डीमॅटसाठी नामांकन आता बंधनकारक.",news3:"IEPF मधून बेहक्क लाभांश परत मिळू शकतो.",links_title:"संबंधित दुवे",hist_title:"मागील मूल्यमापने",hist_empty:"या डिव्हाइसवर अद्याप नाही.",footer:"प्रात्यक्षिकासाठी मजकूर SANGYAN हॅकेथॉन टीमचा. स्रोत: SEBI · NSE · SCORES.",f_acc:"सुगमता",f_terms:"वापर अटी",f_priv:"गोपनीयता (PII नाही)",f_upd:"अद्यतन: ऑक्टो 2026"},
ta: {skip:"முக்கிய உள்ளடக்கத்திற்குச் செல்க",sra:"திரை வாசிப்பு அணுகல்",nav_home:"முகப்பு",nav_check:"கோரிக்கையைச் சரிபார்",nav_report:"மதிப்பீட்டு அறிக்கை",nav_learn:"முதலீட்டாளர் கல்வி",nav_help:"உதவி எண்",ticker:"<strong>அறிவிப்பு:</strong> சந்தையில் உத்தரவாத வருமானம் யாரும் தர முடியாது. பணம் அனுப்பும் முன் SEBI / SCORES / NSE இல் பதிவைச் சரிபார்க்கவும். இந்த இணையதளம் கல்வி மட்டுமே தரும் — ஆலோசனை அல்ல.",crumb:"முகப்பு / முதலீட்டாளர் பாதுகாப்பு / கோரிக்கை மதிப்பீடு",h1:"ஆன்லைன் கோரிக்கை மதிப்பீட்டு வசதி",intro:"WhatsApp, Telegram, YouTube அல்லது Instagram இல் வந்த டிப், செய்தி அல்லது வீடியோ விளக்க உரையை ஒட்டவும். அது உங்களுக்குக் <strong>கற்பிக்கிறதா</strong> அல்லது <strong>விற்கிறதா</strong>, அதற்கு என்ன ஆதாரம் உள்ளது, எளிய பொருள் என்ன என்பதை இது கூறும்.",form_title:"விண்ணப்பம் — கோரிக்கை விவரம்",form_label:"கோரிக்கை / டிப் / விளக்க உரை",req:"(கட்டாயம்)",form_hint:"OTP, வங்கி கடவுச்சொல் அல்லது முழு கணக்கு எண்ணை எழுத வேண்டாம். கோரிக்கை உரை மட்டும் போதும்.",btn_check:"மதிப்பீட்டுக்கு அனுப்பு",btn_speak:"விளக்கத்தைக் கேள்",btn_clear:"படிவத்தை அழி",rep_title:"மதிப்பீட்டு அறிக்கை",empty:"இன்னும் மதிப்பீடு இல்லை. அனுப்பிய பிறகு அறிக்கை இங்கே தோன்றும்.",loading:"மதிப்பீடு நடக்கிறது…",th_class:"வகைப்பாடு",th_ev:"ஆதார நிலை",th_mean:"எளிய பொருள்",th_sim:"விளைவு எடுத்துக்காட்டு (₹5,000/மாதம் × 12)",th_sig:"கண்டறிந்த குறிகள்",disclaimer:"குறிப்பு: கணினி உருவாக்கிய கல்வி மதிப்பீடு; முதலீட்டு ஆலோசனை அல்லது சட்ட முடிவு அல்ல. செயல்படும் முன் SEBI / SCORES / NSE இல் சரிபார்க்கவும்.",learn_title:"முதலீட்டாளர் கல்வி",learn1:"NAV என்றால் என்ன — மியூச்சுவல் ஃபண்டின் ஒரு பங்கு மதிப்பு, தினமும் மாறும்.",learn2:"SIP — மாதந்தோறும் பழக்கம்; கூட்டு வளர்ச்சி பொறுமைக்குப் பலன் தரும், டிப்புக்கு அல்ல.",learn3:"ஏற்ற இறக்கம் — விலை ஏறும் இறங்கும்; உத்தரவாத லாபம் கிடையாது.",learn4:"புகார் — SCORES இல் புகார் செய்யுங்கள்; நாமினி மற்றும் IEPF நிலையைப் பாருங்கள்.",help_title:"உதவி எண்",news_title:"புதியவை",news1:"பகிரும் முன் டிப்-குழு ஸ்கிரீன்ஷாட்டைச் சரிபார்க்கவும்.",news2:"டீமேட்டுக்கு நாமினி இப்போது கட்டாயம்.",news3:"IEPF மூலம் உரிமை கோரா ஈவுத்தொகையை மீட்கலாம்.",links_title:"தொடர்புடைய இணைப்புகள்",hist_title:"முந்தைய மதிப்பீடுகள்",hist_empty:"இந்தச் சாதனத்தில் இதுவரை இல்லை.",footer:"செயல்விளக்க உள்ளடக்கம் SANGYAN ஹேக்கத்தான் குழுவினது. ஆதாரம்: SEBI · NSE · SCORES.",f_acc:"அணுகல்",f_terms:"பயன்பாட்டு விதிகள்",f_priv:"தனியுரிமை (PII இல்லை)",f_upd:"புதுப்பிப்பு: அக் 2026"}};

const HTML_LANG = {en: "en", hinglish: "hi", hi: "hi", mr: "mr", ta: "ta"};

function applyLang() {
  const d = I18N[LANG] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = d[el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  });
  document.documentElement.lang = HTML_LANG[LANG] || "en";
  document.querySelectorAll(".langs button").forEach((x) =>
    x.setAttribute("aria-pressed", String(x.dataset.lang === LANG)));
}

document.querySelectorAll(".langs button").forEach((b) =>
  b.addEventListener("click", () => {
    if (LANG === b.dataset.lang) return;
    LANG = b.dataset.lang;
    applyLang();
    if (LAST && !$("out").hidden) doCheck(); // re-assess in the new language
  })
);

async function doCheck() {
  const text = $("claim").value.trim();
  $("form-err").hidden = true;
  if (!text) { const e = $("form-err"); e.textContent = "Paste some text first — a tip, message, or caption."; e.hidden = false; return; }
  $("empty").hidden = true; $("out").hidden = true; $("loading").hidden = false; $("speak").disabled = true;
  try {
    const r = await fetch(`${API}/api/analyze`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({input_text: text, lang: LANG}),
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
  $("out").hidden = false; $("speak").disabled = false;
  const p = $("promo"); p.textContent = d.promo_label;
  p.className = "badge " + (d.promo_label === "education" ? "b-edu" : d.promo_label === "mixed" ? "b-mixed" : "b-promo");
  $("score").textContent = `score ${d.promo_score}`;
  document.querySelectorAll(".meter span").forEach((s, i) => {
    s.className = i === 0 ? "on-" + d.evidence.level : "";
  });
  $("ev").textContent = d.evidence.summary;
  $("ev-u").textContent = "Uncertainty: " + d.evidence.uncertainty;
  $("src").innerHTML = (d.evidence.sources || []).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join("");
  $("plain").textContent = d.explainer.plain_text;
  $("analogy").textContent = d.explainer.analogy;
  $("terms").innerHTML = (d.explainer.terms || []).map((t) => `<li><strong>${t.term}:</strong> ${t.meaning}</li>`).join("");
  $("sig").innerHTML = (d.promo_signals || []).map((s) => `<li>${s}</li>`).join("") || "<li>None</li>";
  drawChart(d.simulator);
  $("sim-note").textContent = d.simulator.inputs.note || "";
}

function drawChart(sim) {
  const cv = $("chart"), ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, cv.width, cv.height);
  const real = sim.projection, hype = sim.inputs.hype_series || null;
  const max = Math.max(...real, ...(hype || [0])) || 1;
  const X = (i, n) => 30 + (i / Math.max(1, n - 1)) * (cv.width - 50);
  const Y = (v) => cv.height - 20 - (v / max) * (cv.height - 50);
  ctx.strokeStyle = "#D5D5D5"; ctx.beginPath(); ctx.moveTo(30, 10); ctx.lineTo(30, cv.height - 20); ctx.lineTo(cv.width - 10, cv.height - 20); ctx.stroke();
  const line = (arr, col, dash) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash || []); ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i, arr.length), Y(v)) : ctx.moveTo(X(0, arr.length), Y(v))); ctx.stroke(); ctx.setLineDash([]); };
  line(real, "#0B3C5D");
  if (hype) line(hype, "#C62828", [6, 4]);
  ctx.fillStyle = "#5A5A5A"; ctx.font = "12px sans-serif";
  ctx.fillText("steady", 34, 22); if (hype) { ctx.fillStyle = "#C62828"; ctx.fillText("hype claim", 90, 22); }
}

$("speak").addEventListener("click", () => {
  if (!LAST) return;
  const u = new SpeechSynthesisUtterance(LAST.explainer.plain_text + " " + LAST.explainer.analogy);
  u.lang = LANG === "hi" ? "hi-IN" : LANG === "mr" ? "mr-IN" : LANG === "ta" ? "ta-IN" : "en-IN";
  speechSynthesis.cancel(); speechSynthesis.speak(u);
});

function saveHist(d) {
  const k = "sangyan-hist", arr = JSON.parse(localStorage.getItem(k) || "[]");
  arr.unshift({t: new Date().toLocaleString(), label: d.promo_label, ev: d.evidence.level, txt: d.claims[0]?.text?.slice(0, 80)});
  localStorage.setItem(k, JSON.stringify(arr.slice(0, 8)));
  $("hist").innerHTML = arr.slice(0, 8).map((h) => `<div>${h.t} — <strong>${h.label}</strong> / evidence ${h.ev} — ${h.txt}</div>`).join("");
}

$("clear").addEventListener("click", () => {
  $("claim").value = ""; $("out").hidden = true; $("empty").hidden = false;
  $("form-err").hidden = true; LAST = null; $("speak").disabled = true;
});

let FS = 16;
const setFS = (v) => { FS = Math.min(20, Math.max(13, v)); document.documentElement.style.setProperty("--fs", FS + "px"); };
$("f-inc").addEventListener("click", () => setFS(FS + 1));
$("f-dec").addEventListener("click", () => setFS(FS - 1));
$("f-reset").addEventListener("click", () => setFS(16));

applyLang();

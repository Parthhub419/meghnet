// ── MeghNet i18n — Hindi & Marathi Support ───────────────────────────────────
const TRANSLATIONS = {

  en: {
    // Header
    appTagline: "AI Climate Intelligence",
    offlineText: "Offline",

    // Search card
    getClimate: "Get Climate Intelligence",
    subtitle: "Click the map or enter coordinates below",
    locationLabel: "Location Name",
    locationPlaceholder: "e.g. Nagpur, Maharashtra",
    iAmA: "I am a",
    general: "General Public",
    farmer: "Farmer",
    disaster: "Disaster Manager",
    latLabel: "Latitude",
    lngLabel: "Longitude",
    myLocation: "📍 My Location",
    analyzeBtn: "🔍 Analyze Climate",
    analyzing: "⏳ Analyzing...",

    // Farmer fields
    farmHeader: "🌾 Tell us about your farm",
    cropType: "Crop Type",
    cropStage: "Crop Stage",
    soilType: "Soil Type",
    irrigation: "Irrigation",
    selectCrop: "Select crop...",

    // Crop options
    rice: "Rice / Paddy", wheat: "Wheat", cotton: "Cotton",
    sugarcane: "Sugarcane", soybean: "Soybean", maize: "Maize / Corn",
    tomato: "Tomato", onion: "Onion", potato: "Potato",
    groundnut: "Groundnut", turmeric: "Turmeric", orange: "Orange / Citrus",
    banana: "Banana", other: "Other",

    // Stages
    sowing: "Sowing / Planting", germination: "Germination",
    vegetative: "Vegetative", flowering: "Flowering",
    fruiting: "Fruiting", harvesting: "Harvesting",

    // Soil
    loamy: "Loamy", clay: "Clay", sandy: "Sandy",
    black: "Black Cotton", red: "Red Soil", alluvial: "Alluvial",

    // Irrigation
    rainfed: "Rainfed", drip: "Drip", flood: "Flood",
    sprinkler: "Sprinkler", canal: "Canal",

    // Risk levels
    risk: "RISK", low: "LOW", medium: "MEDIUM", high: "HIGH", critical: "CRITICAL",

    // Sections
    disasterAlerts: "🔔 Disaster Alerts",
    noAlerts: "No active disaster alerts for this location",
    currentConditions: "⛅ Current Conditions",
    forecast3Day: "📅 3-Day Forecast",
    aiAnalysis: "🤖 AI Analysis",
    poweredBy: "Powered by Gemini",
    recommendations: "📋 Actionable Recommendations",
    farmerAdvisory: "🌾 Farmer Advisory",

    // Weather stats
    temperature: "Temperature", feelsLike: "Feels Like",
    humidity: "Humidity", wind: "Wind", rain: "Rain",
    uvIndex: "UV Index", soilMoisture: "Soil Moist.", pressure: "Pressure",
    conditions: "Conditions",

    // Forecast chart tabs
    tempTab: "🌡️ Temperature", rainTab: "🌧️ Rainfall", windTab: "💨 Wind",

    // Farmer advisory sections
    irrigationPlan: "💧 Irrigation Plan",
    pestRisk: "🐛 Pest & Disease Risk",
    harvestTiming: "🌾 Harvest Timing",
    weeklyTasks: "✅ Tasks This Week",
    avoidThis: "🚫 Avoid This Week",

    // Alert actions
    immediateAction: "⚡ Immediate Action",
    duration: "⏱️ Duration",

    // Map tabs
    liveMap: "🗺️ Live Map",
    history: "💾 History",
    alertCheck: "🔔 Alert Check",
    sessionLocations: "📍 Session Locations",

    // DB panel
    riskDistribution: "📊 Risk Distribution",
    recentAnalyses: "🕐 Recent Analyses",
    refresh: "↻ Refresh",
    totalAnalyses: "Total analyses",
    quickAlertCheck: "🔔 Quick Alert Check",
    quickAlertDesc: "Check disaster alerts for any location instantly",
    checkAlertsNow: "⚡ Check Alerts Now",

    // Alert levels
    noActiveAlerts: "✅ No Active Alerts",
    alertLevel: "ALERT LEVEL",

    // Saved
    saved: "💾 Saved",
    cached: "cached",

    // Emergency
    emergencyText: "🆘 CRITICAL ALERT ACTIVE — Scroll down to view emergency instructions",

    // Errors
    offlineNoCache: "Offline — no cached data.",
    analysisFailed: "Analysis failed",
  },

  hi: {
    appTagline: "AI जलवायु बुद्धिमत्ता",
    offlineText: "ऑफलाइन",

    getClimate: "जलवायु जानकारी प्राप्त करें",
    subtitle: "नक्शे पर क्लिक करें या नीचे निर्देशांक दर्ज करें",
    locationLabel: "स्थान का नाम",
    locationPlaceholder: "जैसे नागपुर, महाराष्ट्र",
    iAmA: "मैं हूँ",
    general: "आम नागरिक",
    farmer: "किसान",
    disaster: "आपदा प्रबंधक",
    latLabel: "अक्षांश",
    lngLabel: "देशांतर",
    myLocation: "📍 मेरा स्थान",
    analyzeBtn: "🔍 जलवायु विश्लेषण करें",
    analyzing: "⏳ विश्लेषण हो रहा है...",

    farmHeader: "🌾 अपने खेत के बारे में बताएं",
    cropType: "फसल का प्रकार",
    cropStage: "फसल की अवस्था",
    soilType: "मिट्टी का प्रकार",
    irrigation: "सिंचाई",
    selectCrop: "फसल चुनें...",

    rice: "चावल / धान", wheat: "गेहूँ", cotton: "कपास",
    sugarcane: "गन्ना", soybean: "सोयाबीन", maize: "मक्का",
    tomato: "टमाटर", onion: "प्याज", potato: "आलू",
    groundnut: "मूंगफली", turmeric: "हल्दी", orange: "संतरा",
    banana: "केला", other: "अन्य",

    sowing: "बुवाई / रोपाई", germination: "अंकुरण",
    vegetative: "वानस्पतिक वृद्धि", flowering: "फूल आना",
    fruiting: "फल आना", harvesting: "कटाई",

    loamy: "दोमट", clay: "चिकनी मिट्टी", sandy: "बलुई मिट्टी",
    black: "काली मिट्टी", red: "लाल मिट्टी", alluvial: "जलोढ़ मिट्टी",

    rainfed: "वर्षा आधारित", drip: "ड्रिप", flood: "बाढ़ सिंचाई",
    sprinkler: "फव्वारा", canal: "नहर",

    risk: "जोखिम", low: "कम", medium: "मध्यम", high: "अधिक", critical: "गंभीर",

    disasterAlerts: "🔔 आपदा चेतावनियाँ",
    noAlerts: "इस स्थान के लिए कोई सक्रिय आपदा चेतावनी नहीं",
    currentConditions: "⛅ वर्तमान स्थिति",
    forecast3Day: "📅 3 दिनों का पूर्वानुमान",
    aiAnalysis: "🤖 AI विश्लेषण",
    poweredBy: "Gemini द्वारा संचालित",
    recommendations: "📋 सिफारिशें",
    farmerAdvisory: "🌾 किसान सलाह",

    temperature: "तापमान", feelsLike: "महसूस",
    humidity: "आर्द्रता", wind: "हवा", rain: "वर्षा",
    uvIndex: "UV सूचकांक", soilMoisture: "मिट्टी नमी", pressure: "दबाव",
    conditions: "स्थिति",

    tempTab: "🌡️ तापमान", rainTab: "🌧️ वर्षा", windTab: "💨 हवा",

    irrigationPlan: "💧 सिंचाई योजना",
    pestRisk: "🐛 कीट एवं रोग जोखिम",
    harvestTiming: "🌾 कटाई का समय",
    weeklyTasks: "✅ इस सप्ताह के कार्य",
    avoidThis: "🚫 इस सप्ताह न करें",

    immediateAction: "⚡ तत्काल कार्रवाई",
    duration: "⏱️ अवधि",

    liveMap: "🗺️ लाइव मानचित्र",
    history: "💾 इतिहास",
    alertCheck: "🔔 चेतावनी जाँच",
    sessionLocations: "📍 सत्र स्थान",

    riskDistribution: "📊 जोखिम वितरण",
    recentAnalyses: "🕐 हालिया विश्लेषण",
    refresh: "↻ ताज़ा करें",
    totalAnalyses: "कुल विश्लेषण",
    quickAlertCheck: "🔔 त्वरित चेतावनी जाँच",
    quickAlertDesc: "किसी भी स्थान की आपदा चेतावनियाँ तुरंत जाँचें",
    checkAlertsNow: "⚡ अभी जाँचें",

    noActiveAlerts: "✅ कोई सक्रिय चेतावनी नहीं",
    alertLevel: "चेतावनी स्तर",

    saved: "💾 सहेजा गया",
    cached: "कैश्ड",

    emergencyText: "🆘 गंभीर चेतावनी सक्रिय — आपातकालीन निर्देशों के लिए नीचे स्क्रॉल करें",

    offlineNoCache: "ऑफलाइन — कोई कैश्ड डेटा नहीं।",
    analysisFailed: "विश्लेषण विफल",
  },

  mr: {
    appTagline: "AI हवामान बुद्धिमत्ता",
    offlineText: "ऑफलाइन",

    getClimate: "हवामान माहिती मिळवा",
    subtitle: "नकाशावर क्लिक करा किंवा खाली निर्देशांक प्रविष्ट करा",
    locationLabel: "ठिकाणाचे नाव",
    locationPlaceholder: "उदा. नागपूर, महाराष्ट्र",
    iAmA: "मी आहे",
    general: "सामान्य नागरिक",
    farmer: "शेतकरी",
    disaster: "आपत्ती व्यवस्थापक",
    latLabel: "अक्षांश",
    lngLabel: "रेखांश",
    myLocation: "📍 माझे ठिकाण",
    analyzeBtn: "🔍 हवामान विश्लेषण करा",
    analyzing: "⏳ विश्लेषण होत आहे...",

    farmHeader: "🌾 तुमच्या शेताबद्दल सांगा",
    cropType: "पिकाचा प्रकार",
    cropStage: "पिकाची अवस्था",
    soilType: "मातीचा प्रकार",
    irrigation: "सिंचन",
    selectCrop: "पीक निवडा...",

    rice: "भात / तांदूळ", wheat: "गहू", cotton: "कापूस",
    sugarcane: "ऊस", soybean: "सोयाबीन", maize: "मका",
    tomato: "टोमॅटो", onion: "कांदा", potato: "बटाटा",
    groundnut: "भुईमूग", turmeric: "हळद", orange: "संत्रा",
    banana: "केळी", other: "इतर",

    sowing: "पेरणी / लागवड", germination: "अंकुरण",
    vegetative: "वनस्पती वाढ", flowering: "फुलोरा",
    fruiting: "फळधारणा", harvesting: "कापणी",

    loamy: "चिकण माती", clay: "काळी माती", sandy: "वालुकामय माती",
    black: "काळी कापूस माती", red: "लाल माती", alluvial: "गाळाची माती",

    rainfed: "पावसावर अवलंबून", drip: "ठिबक", flood: "पूर सिंचन",
    sprinkler: "तुषार", canal: "कालवा",

    risk: "धोका", low: "कमी", medium: "मध्यम", high: "जास्त", critical: "अतिगंभीर",

    disasterAlerts: "🔔 आपत्ती इशारे",
    noAlerts: "या ठिकाणासाठी कोणतेही सक्रिय आपत्ती इशारे नाहीत",
    currentConditions: "⛅ सध्याची स्थिती",
    forecast3Day: "📅 ३ दिवसांचा अंदाज",
    aiAnalysis: "🤖 AI विश्लेषण",
    poweredBy: "Gemini द्वारे चालवलेले",
    recommendations: "📋 शिफारसी",
    farmerAdvisory: "🌾 शेतकरी सल्ला",

    temperature: "तापमान", feelsLike: "जाणवते",
    humidity: "आर्द्रता", wind: "वारा", rain: "पाऊस",
    uvIndex: "UV निर्देशांक", soilMoisture: "माती ओलावा", pressure: "दाब",
    conditions: "स्थिती",

    tempTab: "🌡️ तापमान", rainTab: "🌧️ पाऊस", windTab: "💨 वारा",

    irrigationPlan: "💧 सिंचन योजना",
    pestRisk: "🐛 कीड व रोग धोका",
    harvestTiming: "🌾 कापणीची वेळ",
    weeklyTasks: "✅ या आठवड्याची कामे",
    avoidThis: "🚫 या आठवड्यात टाळा",

    immediateAction: "⚡ तात्काळ कृती",
    duration: "⏱️ कालावधी",

    liveMap: "🗺️ थेट नकाशा",
    history: "💾 इतिहास",
    alertCheck: "🔔 इशारा तपासणी",
    sessionLocations: "📍 सत्र ठिकाणे",

    riskDistribution: "📊 धोका वितरण",
    recentAnalyses: "🕐 अलीकडील विश्लेषणे",
    refresh: "↻ ताजे करा",
    totalAnalyses: "एकूण विश्लेषणे",
    quickAlertCheck: "🔔 त्वरित इशारा तपासणी",
    quickAlertDesc: "कोणत्याही ठिकाणाचे आपत्ती इशारे त्वरित तपासा",
    checkAlertsNow: "⚡ आत्ता तपासा",

    noActiveAlerts: "✅ कोणतेही सक्रिय इशारे नाहीत",
    alertLevel: "इशारा पातळी",

    saved: "💾 जतन केले",
    cached: "कॅश्ड",

    emergencyText: "🆘 अतिगंभीर इशारा सक्रिय — आपत्कालीन सूचनांसाठी खाली स्क्रोल करा",

    offlineNoCache: "ऑफलाइन — कॅश्ड डेटा नाही।",
    analysisFailed: "विश्लेषण अयशस्वी",
  }
};

// ── Current language ───────────────────────────────────────────────────────────
let currentLang = localStorage.getItem("meghnet_lang") || "en";

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("meghnet_lang", lang);
  applyTranslations();
}

// ── Apply all translations to DOM ─────────────────────────────────────────────
function applyTranslations() {
  // All elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });

  // Select options
  document.querySelectorAll("[data-i18n-opt]").forEach(el => {
    const key = el.getAttribute("data-i18n-opt");
    el.textContent = t(key);
  });

  // Update language switcher active state
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
  });

  // Update button text if currently idle
  const btnText = document.getElementById("btnText");
  if (btnText) btnText.textContent = t("analyzeBtn");
}

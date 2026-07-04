// ── MeghNet Language System — English, Hindi, Marathi ────────────────────────
const LANGUAGES = {
  en: {
    name: "English", flag: "🇬🇧", dir: "ltr",
    t: {
      // Header
      tagline: "AI Climate Intelligence",
      offlineBadge: "📴 Offline",

      // Search card
      searchTitle: "Get Climate Intelligence",
      searchSubtitle: "Click the map or enter coordinates below",
      labelLocation: "Location Name",
      labelIAm: "I am a",
      labelLat: "Latitude",
      labelLng: "Longitude",
      myLocation: "📍 My Location",
      btnAnalyze: "🔍 Analyze Climate",
      btnAnalyzing: "⏳ Analyzing...",
      optGeneral: "General Public",
      optFarmer: "Farmer",
      optDisaster: "Disaster Manager",

      // Farmer fields
      farmerHeader: "🌾 Tell us about your farm",
      labelCrop: "Crop Type",
      labelStage: "Crop Stage",
      labelSoil: "Soil Type",
      labelIrrigation: "Irrigation",
      cropPlaceholder: "Select crop...",

      // Risk levels
      riskLow: "LOW RISK", riskMedium: "MEDIUM RISK",
      riskHigh: "HIGH RISK", riskCritical: "CRITICAL RISK",

      // Sections
      secAlerts: "🔔 Disaster Alerts",
      secConditions: "⛅ Current Conditions",
      secForecast: "📅 3-Day Forecast",
      secFarmerAdvisory: "🌾 Farmer Advisory",
      secAI: "🤖 AI Analysis",
      secRecommendations: "📋 Actionable Recommendations",

      // Weather labels
      wTemp: "Temperature", wFeels: "Feels Like", wHumidity: "Humidity",
      wWind: "Wind", wRain: "Rain", wUV: "UV Index",
      wSoilMoist: "Soil Moist.", wPressure: "Pressure", wConditions: "Conditions",

      // Forecast
      fcTemp: "🌡️ Temperature", fcRain: "🌧️ Rainfall", fcWind: "💨 Wind",

      // Farmer advisory sections
      faIrrigation: "💧 Irrigation Plan", faPest: "🐛 Pest & Disease Risk",
      faHarvest: "🌾 Harvest Timing", faTasks: "✅ Tasks This Week",
      faAvoid: "🚫 Avoid This Week",

      // Alerts
      noAlerts: "No active disaster alerts for this location",
      alertAction: "⚡ Immediate Action",
      alertDuration: "⏱️ Duration",
      emergencyBanner: "🆘 CRITICAL ALERT ACTIVE — Scroll down to view emergency instructions",

      // Map tabs
      tabMap: "🗺️ Live Map",
      tabHistory: "💾 History",
      tabAlertCheck: "🔔 Alert Check",
      tabSessions: "📍 Session Locations",

      // DB
      dbConnected: "✓ Supabase connected — analyses are being saved",
      dbDisconnected: "Database not configured — add SUPABASE keys to .env",
      statsTitle: "📊 Risk Distribution",
      recentTitle: "🕐 Recent Analyses",
      refresh: "↻ Refresh",
      savedBadge: "💾 Saved",
      aiPowered: "Powered by Gemini",

      // Alert check
      alertCheckTitle: "🔔 Quick Alert Check",
      alertCheckDesc: "Check disaster alerts for any location instantly — no AI call needed.",
      btnCheckAlerts: "⚡ Check Alerts Now",
      noAlertsFound: "No active alerts for this location",
    }
  },

  hi: {
    name: "हिंदी", flag: "🇮🇳", dir: "ltr",
    t: {
      tagline: "AI जलवायु बुद्धिमत्ता",
      offlineBadge: "📴 ऑफलाइन",

      searchTitle: "जलवायु जानकारी प्राप्त करें",
      searchSubtitle: "नक्शे पर क्लिक करें या नीचे निर्देशांक दर्ज करें",
      labelLocation: "स्थान का नाम",
      labelIAm: "मैं हूँ",
      labelLat: "अक्षांश",
      labelLng: "देशांतर",
      myLocation: "📍 मेरा स्थान",
      btnAnalyze: "🔍 जलवायु विश्लेषण करें",
      btnAnalyzing: "⏳ विश्लेषण हो रहा है...",
      optGeneral: "सामान्य जनता",
      optFarmer: "किसान",
      optDisaster: "आपदा प्रबंधक",

      farmerHeader: "🌾 अपने खेत के बारे में बताएं",
      labelCrop: "फसल का प्रकार",
      labelStage: "फसल की अवस्था",
      labelSoil: "मिट्टी का प्रकार",
      labelIrrigation: "सिंचाई",
      cropPlaceholder: "फसल चुनें...",

      riskLow: "कम जोखिम", riskMedium: "मध्यम जोखिम",
      riskHigh: "अधिक जोखिम", riskCritical: "गंभीर जोखिम",

      secAlerts: "🔔 आपदा चेतावनी",
      secConditions: "⛅ वर्तमान स्थिति",
      secForecast: "📅 3-दिन का पूर्वानुमान",
      secFarmerAdvisory: "🌾 किसान सलाह",
      secAI: "🤖 AI विश्लेषण",
      secRecommendations: "📋 सुझाव और सलाह",

      wTemp: "तापमान", wFeels: "महसूस होता है", wHumidity: "नमी",
      wWind: "हवा", wRain: "वर्षा", wUV: "UV सूचकांक",
      wSoilMoist: "मिट्टी नमी", wPressure: "दबाव", wConditions: "स्थिति",

      fcTemp: "🌡️ तापमान", fcRain: "🌧️ वर्षा", fcWind: "💨 हवा",

      faIrrigation: "💧 सिंचाई योजना", faPest: "🐛 कीट और रोग जोखिम",
      faHarvest: "🌾 कटाई का समय", faTasks: "✅ इस सप्ताह के कार्य",
      faAvoid: "🚫 इस सप्ताह न करें",

      noAlerts: "इस स्थान के लिए कोई सक्रिय आपदा चेतावनी नहीं है",
      alertAction: "⚡ तुरंत करें",
      alertDuration: "⏱️ अवधि",
      emergencyBanner: "🆘 गंभीर चेतावनी सक्रिय — आपातकालीन निर्देश देखने के लिए नीचे स्क्रॉल करें",

      tabMap: "🗺️ लाइव मानचित्र",
      tabHistory: "💾 इतिहास",
      tabAlertCheck: "🔔 चेतावनी जांच",
      tabSessions: "📍 सत्र स्थान",

      dbConnected: "✓ डेटाबेस जुड़ा है — विश्लेषण सहेजे जा रहे हैं",
      dbDisconnected: "डेटाबेस कॉन्फ़िगर नहीं है",
      statsTitle: "📊 जोखिम वितरण",
      recentTitle: "🕐 हाल के विश्लेषण",
      refresh: "↻ ताज़ा करें",
      savedBadge: "💾 सहेजा गया",
      aiPowered: "Gemini द्वारा संचालित",

      alertCheckTitle: "🔔 त्वरित चेतावनी जांच",
      alertCheckDesc: "किसी भी स्थान के लिए तुरंत आपदा चेतावनी जांचें।",
      btnCheckAlerts: "⚡ अभी जांचें",
      noAlertsFound: "इस स्थान के लिए कोई चेतावनी नहीं",
    }
  },

  mr: {
    name: "मराठी", flag: "🇮🇳", dir: "ltr",
    t: {
      tagline: "AI हवामान बुद्धिमत्ता",
      offlineBadge: "📴 ऑफलाइन",

      searchTitle: "हवामान माहिती मिळवा",
      searchSubtitle: "नकाशावर क्लिक करा किंवा खाली निर्देशांक टाका",
      labelLocation: "स्थानाचे नाव",
      labelIAm: "मी आहे",
      labelLat: "अक्षांश",
      labelLng: "रेखांश",
      myLocation: "📍 माझे स्थान",
      btnAnalyze: "🔍 हवामान विश्लेषण करा",
      btnAnalyzing: "⏳ विश्लेषण होत आहे...",
      optGeneral: "सामान्य नागरिक",
      optFarmer: "शेतकरी",
      optDisaster: "आपत्ती व्यवस्थापक",

      farmerHeader: "🌾 तुमच्या शेताबद्दल सांगा",
      labelCrop: "पिकाचा प्रकार",
      labelStage: "पिकाची अवस्था",
      labelSoil: "मातीचा प्रकार",
      labelIrrigation: "सिंचन",
      cropPlaceholder: "पीक निवडा...",

      riskLow: "कमी धोका", riskMedium: "मध्यम धोका",
      riskHigh: "अधिक धोका", riskCritical: "गंभीर धोका",

      secAlerts: "🔔 आपत्ती सूचना",
      secConditions: "⛅ सध्याची स्थिती",
      secForecast: "📅 ३-दिवसांचा अंदाज",
      secFarmerAdvisory: "🌾 शेतकरी सल्ला",
      secAI: "🤖 AI विश्लेषण",
      secRecommendations: "📋 उपाय आणि सल्ला",

      wTemp: "तापमान", wFeels: "जाणवते", wHumidity: "आर्द्रता",
      wWind: "वारा", wRain: "पाऊस", wUV: "UV निर्देशांक",
      wSoilMoist: "माती ओलावा", wPressure: "दाब", wConditions: "स्थिती",

      fcTemp: "🌡️ तापमान", fcRain: "🌧️ पाऊस", fcWind: "💨 वारा",

      faIrrigation: "💧 सिंचन योजना", faPest: "🐛 कीड व रोग धोका",
      faHarvest: "🌾 काढणीची वेळ", faTasks: "✅ या आठवड्यातील कामे",
      faAvoid: "🚫 या आठवड्यात टाळा",

      noAlerts: "या स्थानासाठी कोणतीही सक्रिय आपत्ती सूचना नाही",
      alertAction: "⚡ तात्काळ करा",
      alertDuration: "⏱️ कालावधी",
      emergencyBanner: "🆘 गंभीर सूचना सक्रिय — आपत्कालीन सूचना पाहण्यासाठी खाली स्क्रोल करा",

      tabMap: "🗺️ लाइव्ह नकाशा",
      tabHistory: "💾 इतिहास",
      tabAlertCheck: "🔔 सूचना तपासा",
      tabSessions: "📍 सत्र स्थाने",

      dbConnected: "✓ डेटाबेस जोडला — विश्लेषण जतन होत आहे",
      dbDisconnected: "डेटाबेस कॉन्फिगर केलेले नाही",
      statsTitle: "📊 धोका वितरण",
      recentTitle: "🕐 अलीकडील विश्लेषण",
      refresh: "↻ ताजे करा",
      savedBadge: "💾 जतन केले",
      aiPowered: "Gemini द्वारे चालवले",

      alertCheckTitle: "🔔 त्वरित सूचना तपासणी",
      alertCheckDesc: "कोणत्याही ठिकाणासाठी आपत्ती सूचना त्वरित तपासा.",
      btnCheckAlerts: "⚡ आत्ता तपासा",
      noAlertsFound: "या स्थानासाठी कोणतीही सूचना नाही",
    }
  }
};

// ── Language state ─────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem("meghnet_lang") || "en";

function t(key) {
  return LANGUAGES[currentLang]?.t[key] || LANGUAGES.en.t[key] || key;
}

function setLanguage(lang) {
  if (!LANGUAGES[lang]) return;
  currentLang = lang;
  localStorage.setItem("meghnet_lang", lang);
  applyLanguage();
}

function applyLanguage() {
  const L = LANGUAGES[currentLang];

  // Update lang switcher buttons
  document.querySelectorAll(".lang-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === currentLang);
  });

  // Apply all translations via data-i18n attributes
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // Update select options
  document.querySelectorAll("[data-i18n-opt]").forEach(el => {
    const key = el.dataset.i18nOpt;
    el.textContent = t(key);
  });

  // Update logo tagline
  const tagline = document.querySelector(".logo-tagline");
  if (tagline) tagline.textContent = t("tagline");

  // Crop options in Hindi/Marathi
  updateCropOptions();
}

// ── Crop translations ──────────────────────────────────────────────────────────
const CROP_TRANSLATIONS = {
  en: ["Select crop...","Rice / Paddy","Wheat","Cotton","Sugarcane","Soybean","Maize / Corn","Tomato","Onion","Potato","Groundnut","Turmeric","Orange / Citrus","Banana","Other"],
  hi: ["फसल चुनें...","चावल / धान","गेहूं","कपास","गन्ना","सोयाबीन","मक्का","टमाटर","प्याज","आलू","मूंगफली","हल्दी","संतरा / नींबू","केला","अन्य"],
  mr: ["पीक निवडा...","तांदूळ / भात","गहू","कापूस","ऊस","सोयाबीन","मका","टोमॅटो","कांदा","बटाटा","भुईमूग","हळद","संत्रा / लिंबू","केळी","इतर"],
};

const STAGE_TRANSLATIONS = {
  en: ["Sowing","Germination","Vegetative","Flowering","Fruiting","Harvesting"],
  hi: ["बुवाई","अंकुरण","वानस्पतिक वृद्धि","फूल आना","फल लगना","कटाई"],
  mr: ["पेरणी","उगवण","वनस्पती वाढ","फुलोरा","फळधारणा","काढणी"],
};

const SOIL_TRANSLATIONS = {
  en: ["Loamy","Clay","Sandy","Black Cotton","Red Soil","Alluvial"],
  hi: ["दोमट","चिकनी मिट्टी","बलुई","काली कपास","लाल मिट्टी","जलोढ़"],
  mr: ["चिकण माती","भारी माती","वाळू माती","काळी माती","लाल माती","गाळाची माती"],
};

const IRR_TRANSLATIONS = {
  en: ["Rainfed","Drip","Flood","Sprinkler","Canal"],
  hi: ["वर्षा आधारित","ड्रिप","बाढ़","फव्वारा","नहर"],
  mr: ["पावसावर अवलंबून","ठिबक","पूर","तुषार","कालवा"],
};

function updateCropOptions() {
  const lang = currentLang in CROP_TRANSLATIONS ? currentLang : "en";
  const cropSel  = document.getElementById("cropType");
  const stageSel = document.getElementById("cropStage");
  const soilSel  = document.getElementById("soilType");
  const irrSel   = document.getElementById("irrigationType");
  if (!cropSel) return;

  const cropVals  = ["","rice","wheat","cotton","sugarcane","soybean","maize","tomato","onion","potato","groundnut","turmeric","orange","banana","other"];
  const stageVals = ["sowing","germination","vegetative","flowering","fruiting","harvesting"];
  const soilVals  = ["loamy","clay","sandy","black","red","alluvial"];
  const irrVals   = ["rainfed","drip","flood","sprinkler","canal"];

  cropSel.innerHTML  = CROP_TRANSLATIONS[lang].map((l,i)=>`<option value="${cropVals[i]}">${l}</option>`).join("");
  stageSel.innerHTML = STAGE_TRANSLATIONS[lang].map((l,i)=>`<option value="${stageVals[i]}">${l}</option>`).join("");
  soilSel.innerHTML  = SOIL_TRANSLATIONS[lang].map((l,i)=>`<option value="${soilVals[i]}">${l}</option>`).join("");
  irrSel.innerHTML   = IRR_TRANSLATIONS[lang].map((l,i)=>`<option value="${irrVals[i]}">${l}</option>`).join("");
}

// Auto-apply on load
window.addEventListener("DOMContentLoaded", () => applyLanguage());

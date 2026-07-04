// ── MeghNet Translations — English, Hindi, Marathi ───────────────────────────
const TRANSLATIONS = {

  en: {
    // Header
    app_name: "MeghNet",
    app_tagline: "AI Climate Intelligence",
    offline: "📴 Offline",
    analyzed: "analyzed",

    // Search card
    get_climate: "Get Climate Intelligence",
    subtitle: "Click the map or enter coordinates below",
    location_name: "Location Name",
    i_am_a: "I am a",
    general: "General Public",
    farmer: "Farmer",
    disaster_manager: "Disaster Manager",
    latitude: "Latitude",
    longitude: "Longitude",
    my_location: "📍 My Location",
    analyze_btn: "🔍 Analyze Climate",
    analyzing: "⏳ Analyzing...",

    // Farmer fields
    farm_info: "🌾 Tell us about your farm",
    crop_type: "Crop Type",
    crop_stage: "Crop Stage",
    soil_type: "Soil Type",
    irrigation: "Irrigation",
    select_crop: "Select crop...",
    rice: "Rice / Paddy", wheat: "Wheat", cotton: "Cotton",
    sugarcane: "Sugarcane", soybean: "Soybean", maize: "Maize / Corn",
    tomato: "Tomato", onion: "Onion", potato: "Potato",
    groundnut: "Groundnut", turmeric: "Turmeric", orange: "Orange / Citrus",
    banana: "Banana", other: "Other",
    sowing: "Sowing / Planting", germination: "Germination",
    vegetative: "Vegetative Growth", flowering: "Flowering",
    fruiting: "Fruiting / Grain Fill", harvesting: "Harvesting",
    loamy: "Loamy (Medium)", clay: "Clay (Heavy)", sandy: "Sandy (Light)",
    black: "Black Cotton Soil", red: "Red Soil", alluvial: "Alluvial",
    rainfed: "Rainfed Only", drip: "Drip Irrigation",
    flood: "Flood Irrigation", sprinkler: "Sprinkler", canal: "Canal Water",

    // Results
    risk: "RISK",
    low_risk: "LOW RISK", medium_risk: "MEDIUM RISK",
    high_risk: "HIGH RISK", critical_risk: "CRITICAL RISK",
    saved: "💾 Saved",
    current_conditions: "⛅ Current Conditions",
    temperature: "Temperature", feels_like: "Feels Like",
    humidity: "Humidity", wind: "Wind", rain: "Rain",
    uv_index: "UV Index", conditions: "Conditions",
    soil_moisture: "Soil Moisture", pressure: "Pressure",

    // Forecast
    forecast_title: "📅 3-Day Forecast",
    temp_tab: "🌡️ Temperature", rain_tab: "🌧️ Rainfall", wind_tab: "💨 Wind",

    // Alerts
    disaster_alerts: "🔔 Disaster Alerts",
    no_alerts: "No active disaster alerts for this location",
    no_alerts_icon: "✅",
    immediate_action: "⚡ Immediate Action",
    duration: "⏱️ Duration",
    critical_banner: "🆘 CRITICAL ALERT ACTIVE — Scroll down to view emergency instructions",
    checking: "Checking...",
    no_active_alerts: "✅ No Active Alerts",
    alert_level: "ALERT LEVEL",

    // Farmer advisory
    farmer_advisory: "🌾 Farmer Advisory",
    irrigation_plan: "💧 Irrigation Plan",
    pest_risk: "🐛 Pest & Disease Risk",
    harvest_timing: "🌾 Harvest Timing",
    tasks_week: "✅ Tasks This Week",
    avoid_week: "🚫 Avoid This Week",

    // AI
    ai_analysis: "🤖 AI Analysis",
    powered_by: "Powered by Gemini",
    recommendations: "📋 Actionable Recommendations",

    // Tabs
    live_map: "🗺️ Live Map",
    history: "💾 History",
    alert_check: "🔔 Alert Check",
    session_locations: "📍 Session Locations",
    risk_distribution: "📊 Risk Distribution",
    recent_analyses: "🕐 Recent Analyses",
    refresh: "↻ Refresh",
    total: "Total analyses",
    quick_alert_check: "🔔 Quick Alert Check",
    quick_alert_desc: "Check disaster alerts for any location instantly — no AI call needed.",
    check_now: "⚡ Check Alerts Now",
    db_connected: "✓ Supabase connected — analyses are being saved",
    db_not_configured: "Database not configured — add SUPABASE keys to .env",
    found_alerts: "Found",
    alert_singular: "Alert",
    alert_plural: "Alerts",

    // Footer
    footer: "MeghNet · ISRO Bharatiya Antariksh Hackathon 2026 · Team MeghNet",
  },

  hi: {
    app_name: "मेघनेट",
    app_tagline: "AI जलवायु बुद्धिमत्ता",
    offline: "📴 ऑफलाइन",
    analyzed: "विश्लेषित",

    get_climate: "जलवायु बुद्धिमत्ता प्राप्त करें",
    subtitle: "नक्शे पर क्लिक करें या नीचे निर्देशांक दर्ज करें",
    location_name: "स्थान का नाम",
    i_am_a: "मैं हूँ",
    general: "आम जनता",
    farmer: "किसान",
    disaster_manager: "आपदा प्रबंधक",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    my_location: "📍 मेरी लोकेशन",
    analyze_btn: "🔍 जलवायु विश्लेषण करें",
    analyzing: "⏳ विश्लेषण हो रहा है...",

    farm_info: "🌾 अपने खेत के बारे में बताएं",
    crop_type: "फसल का प्रकार",
    crop_stage: "फसल की अवस्था",
    soil_type: "मिट्टी का प्रकार",
    irrigation: "सिंचाई",
    select_crop: "फसल चुनें...",
    rice: "चावल / धान", wheat: "गेहूं", cotton: "कपास",
    sugarcane: "गन्ना", soybean: "सोयाबीन", maize: "मक्का",
    tomato: "टमाटर", onion: "प्याज", potato: "आलू",
    groundnut: "मूंगफली", turmeric: "हल्दी", orange: "संतरा",
    banana: "केला", other: "अन्य",
    sowing: "बुवाई / रोपाई", germination: "अंकुरण",
    vegetative: "वानस्पतिक विकास", flowering: "फूल आना",
    fruiting: "फल / दाना भरना", harvesting: "कटाई",
    loamy: "दोमट (मध्यम)", clay: "चिकनी मिट्टी (भारी)", sandy: "रेतीली (हल्की)",
    black: "काली कपास मिट्टी", red: "लाल मिट्टी", alluvial: "जलोढ़",
    rainfed: "केवल वर्षा आधारित", drip: "ड्रिप सिंचाई",
    flood: "बाढ़ सिंचाई", sprinkler: "फव्वारा", canal: "नहर का पानी",

    risk: "जोखिम",
    low_risk: "कम जोखिम", medium_risk: "मध्यम जोखिम",
    high_risk: "उच्च जोखिम", critical_risk: "गंभीर जोखिम",
    saved: "💾 सहेजा गया",
    current_conditions: "⛅ वर्तमान स्थिति",
    temperature: "तापमान", feels_like: "महसूस होता है",
    humidity: "नमी", wind: "हवा", rain: "बारिश",
    uv_index: "UV सूचकांक", conditions: "मौसम",
    soil_moisture: "मिट्टी नमी", pressure: "दबाव",

    forecast_title: "📅 3 दिन का पूर्वानुमान",
    temp_tab: "🌡️ तापमान", rain_tab: "🌧️ बारिश", wind_tab: "💨 हवा",

    disaster_alerts: "🔔 आपदा चेतावनी",
    no_alerts: "इस स्थान के लिए कोई सक्रिय आपदा चेतावनी नहीं",
    no_alerts_icon: "✅",
    immediate_action: "⚡ तत्काल कार्रवाई",
    duration: "⏱️ अवधि",
    critical_banner: "🆘 गंभीर चेतावनी सक्रिय — आपातकालीन निर्देश देखने के लिए नीचे स्क्रॉल करें",
    checking: "जांच हो रही है...",
    no_active_alerts: "✅ कोई सक्रिय चेतावनी नहीं",
    alert_level: "चेतावनी स्तर",

    farmer_advisory: "🌾 किसान सलाह",
    irrigation_plan: "💧 सिंचाई योजना",
    pest_risk: "🐛 कीट और रोग जोखिम",
    harvest_timing: "🌾 कटाई का समय",
    tasks_week: "✅ इस सप्ताह के कार्य",
    avoid_week: "🚫 इस सप्ताह न करें",

    ai_analysis: "🤖 AI विश्लेषण",
    powered_by: "Gemini द्वारा संचालित",
    recommendations: "📋 कार्यवाही योग्य सिफारिशें",

    live_map: "🗺️ लाइव नक्शा",
    history: "💾 इतिहास",
    alert_check: "🔔 चेतावनी जांच",
    session_locations: "📍 सत्र स्थान",
    risk_distribution: "📊 जोखिम वितरण",
    recent_analyses: "🕐 हाल के विश्लेषण",
    refresh: "↻ ताज़ा करें",
    total: "कुल विश्लेषण",
    quick_alert_check: "🔔 त्वरित चेतावनी जांच",
    quick_alert_desc: "किसी भी स्थान के लिए तुरंत आपदा चेतावनी जांचें।",
    check_now: "⚡ अभी चेतावनी जांचें",
    db_connected: "✓ Supabase जुड़ा हुआ है — विश्लेषण सहेजे जा रहे हैं",
    db_not_configured: "डेटाबेस कॉन्फ़िगर नहीं है — .env में SUPABASE कुंजी जोड़ें",
    found_alerts: "मिलीं",
    alert_singular: "चेतावनी",
    alert_plural: "चेतावनियां",

    footer: "मेघनेट · ISRO भारतीय अंतरिक्ष हैकाथॉन 2026 · टीम मेघनेट",
  },

  mr: {
    app_name: "मेघनेट",
    app_tagline: "AI हवामान बुद्धिमत्ता",
    offline: "📴 ऑफलाइन",
    analyzed: "विश्लेषित",

    get_climate: "हवामान माहिती मिळवा",
    subtitle: "नकाशावर क्लिक करा किंवा खाली निर्देशांक टाका",
    location_name: "ठिकाणाचे नाव",
    i_am_a: "मी आहे",
    general: "सामान्य नागरिक",
    farmer: "शेतकरी",
    disaster_manager: "आपत्ती व्यवस्थापक",
    latitude: "अक्षांश",
    longitude: "रेखांश",
    my_location: "📍 माझे ठिकाण",
    analyze_btn: "🔍 हवामान विश्लेषण करा",
    analyzing: "⏳ विश्लेषण होत आहे...",

    farm_info: "🌾 तुमच्या शेताबद्दल सांगा",
    crop_type: "पिकाचा प्रकार",
    crop_stage: "पिकाची अवस्था",
    soil_type: "मातीचा प्रकार",
    irrigation: "सिंचन",
    select_crop: "पीक निवडा...",
    rice: "तांदूळ / भात", wheat: "गहू", cotton: "कापूस",
    sugarcane: "ऊस", soybean: "सोयाबीन", maize: "मका",
    tomato: "टोमॅटो", onion: "कांदा", potato: "बटाटा",
    groundnut: "भुईमूग", turmeric: "हळद", orange: "संत्रा",
    banana: "केळी", other: "इतर",
    sowing: "पेरणी / लागवड", germination: "उगवण",
    vegetative: "वनस्पती वाढ", flowering: "फुलोरा",
    fruiting: "फळ / दाणे भरणे", harvesting: "काढणी",
    loamy: "चिकण माती (मध्यम)", clay: "काळी माती (जड)", sandy: "वालुकामय (हलकी)",
    black: "काळी कापूस माती", red: "लाल माती", alluvial: "गाळाची माती",
    rainfed: "केवळ पावसावर अवलंबून", drip: "ठिबक सिंचन",
    flood: "पूर सिंचन", sprinkler: "तुषार सिंचन", canal: "कालव्याचे पाणी",

    risk: "धोका",
    low_risk: "कमी धोका", medium_risk: "मध्यम धोका",
    high_risk: "जास्त धोका", critical_risk: "गंभीर धोका",
    saved: "💾 जतन केले",
    current_conditions: "⛅ सध्याची परिस्थिती",
    temperature: "तापमान", feels_like: "जाणवते",
    humidity: "आर्द्रता", wind: "वारा", rain: "पाऊस",
    uv_index: "UV निर्देशांक", conditions: "हवामान",
    soil_moisture: "मातीचा ओलावा", pressure: "दाब",

    forecast_title: "📅 ३ दिवसांचा अंदाज",
    temp_tab: "🌡️ तापमान", rain_tab: "🌧️ पाऊस", wind_tab: "💨 वारा",

    disaster_alerts: "🔔 आपत्ती इशारे",
    no_alerts: "या ठिकाणासाठी कोणतेही सक्रिय आपत्ती इशारे नाहीत",
    no_alerts_icon: "✅",
    immediate_action: "⚡ तात्काळ कृती",
    duration: "⏱️ कालावधी",
    critical_banner: "🆘 गंभीर इशारा सक्रिय — आपत्कालीन सूचना पाहण्यासाठी खाली स्क्रोल करा",
    checking: "तपासत आहे...",
    no_active_alerts: "✅ कोणतेही सक्रिय इशारे नाहीत",
    alert_level: "इशारा पातळी",

    farmer_advisory: "🌾 शेतकरी सल्ला",
    irrigation_plan: "💧 सिंचन योजना",
    pest_risk: "🐛 कीड आणि रोग धोका",
    harvest_timing: "🌾 काढणीची वेळ",
    tasks_week: "✅ या आठवड्यातील कामे",
    avoid_week: "🚫 या आठवड्यात टाळा",

    ai_analysis: "🤖 AI विश्लेषण",
    powered_by: "Gemini द्वारे चालवलेले",
    recommendations: "📋 कृती करण्यायोग्य शिफारसी",

    live_map: "🗺️ थेट नकाशा",
    history: "💾 इतिहास",
    alert_check: "🔔 इशारा तपासा",
    session_locations: "📍 सत्र ठिकाणे",
    risk_distribution: "📊 धोका वितरण",
    recent_analyses: "🕐 अलीकडील विश्लेषणे",
    refresh: "↻ ताजे करा",
    total: "एकूण विश्लेषणे",
    quick_alert_check: "🔔 जलद इशारा तपासणी",
    quick_alert_desc: "कोणत्याही ठिकाणाचे आपत्ती इशारे त्वरित तपासा.",
    check_now: "⚡ आत्ता इशारे तपासा",
    db_connected: "✓ Supabase जोडले आहे — विश्लेषणे जतन होत आहेत",
    db_not_configured: "डेटाबेस कॉन्फिगर केलेला नाही — .env मध्ये SUPABASE की जोडा",
    found_alerts: "सापडले",
    alert_singular: "इशारा",
    alert_plural: "इशारे",

    footer: "मेघनेट · ISRO भारतीय अंतरिक्ष हॅकेथॉन 2026 · टीम मेघनेट",
  },
};

// Current language
let currentLang = localStorage.getItem("meghnet_lang") || "en";

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("meghnet_lang", lang);
  applyTranslations();
}

function applyTranslations() {
  // All elements with data-t attribute get translated
  document.querySelectorAll("[data-t]").forEach(el => {
    const key = el.getAttribute("data-t");
    el.textContent = t(key);
  });
  // Placeholders
  document.querySelectorAll("[data-tp]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-tp"));
  });
  // Update active lang button
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
  // Update select options
  updateSelectOptions();
}

function updateSelectOptions() {
  const userTypeEl = document.getElementById("userType");
  if (userTypeEl) {
    const val = userTypeEl.value;
    userTypeEl.options[0].text = t("general");
    userTypeEl.options[1].text = t("farmer");
    userTypeEl.options[2].text = t("disaster_manager");
    userTypeEl.value = val;
  }

  const cropMap = ["","rice","wheat","cotton","sugarcane","soybean","maize","tomato","onion","potato","groundnut","turmeric","orange","banana","other"];
  const cropEl = document.getElementById("cropType");
  if (cropEl) {
    Array.from(cropEl.options).forEach((opt, i) => {
      if (i === 0) opt.text = t("select_crop");
      else if (cropMap[i]) opt.text = t(cropMap[i]);
    });
  }

  const stageMap = ["sowing","germination","vegetative","flowering","fruiting","harvesting"];
  const stageEl = document.getElementById("cropStage");
  if (stageEl) {
    Array.from(stageEl.options).forEach((opt, i) => {
      if (stageMap[i]) opt.text = t(stageMap[i]);
    });
  }

  const soilMap = ["loamy","clay","sandy","black","red","alluvial"];
  const soilEl = document.getElementById("soilType");
  if (soilEl) {
    Array.from(soilEl.options).forEach((opt, i) => {
      if (soilMap[i]) opt.text = t(soilMap[i]);
    });
  }

  const irrMap = ["rainfed","drip","flood","sprinkler","canal"];
  const irrEl = document.getElementById("irrigationType");
  if (irrEl) {
    Array.from(irrEl.options).forEach((opt, i) => {
      if (irrMap[i]) opt.text = t(irrMap[i]);
    });
  }
}

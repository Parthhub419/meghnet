// ── MeghNet v7 — Multi-language Platform ─────────────────────────────────────
const CACHE_KEY   = "meghnet_last_result";
const HISTORY_KEY = "meghnet_history";
const RISK_COLORS = { LOW:"#22c55e", MEDIUM:"#eab308", HIGH:"#f97316", CRITICAL:"#ef4444" };
const RISK_ICONS  = { LOW:"✅", MEDIUM:"⚠️", HIGH:"🚨", CRITICAL:"🆘" };
const ALERT_COLORS= { CRITICAL:"#ef4444", HIGH:"#f97316", MEDIUM:"#eab308", LOW:"#22c55e", NONE:"#22c55e" };

let map=null, markers=[], locationHistory=[];
let tempChartInst=null, rainChartInst=null, windChartInst=null;

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded",()=>{
  initMap(); loadHistory(); checkDbStatus();
  // Apply saved language on load
  applyTranslations();
  window.addEventListener("online",()=>document.getElementById("offlineBadge").style.display="none");
  window.addEventListener("offline",()=>document.getElementById("offlineBadge").style.display="block");
  if(!navigator.onLine) document.getElementById("offlineBadge").style.display="block";
  const cached=localStorage.getItem(CACHE_KEY);
  if(cached){try{renderResults(JSON.parse(cached),true);}catch(_){}}
});

// ── DB Status ─────────────────────────────────────────────────────────────────
async function checkDbStatus(){
  try{
    const r=await fetch("/api/health"); const d=await r.json();
    const bar=document.getElementById("dbStatusBar"),dot=document.getElementById("dbDotBar"),
          text=document.getElementById("dbStatusText"),hdot=document.getElementById("dbDot");
    if(d.db_connected){
      bar.className="db-status-bar connected"; dot.className="db-dot on"; hdot.className="db-dot on";
      text.textContent="✓ Supabase connected — analyses are being saved";
      loadDbHistory(); loadStats();
    } else {
      text.textContent="Database not configured — add SUPABASE keys to .env";
    }
  }catch(_){}
}

async function loadDbHistory(){
  try{
    const r=await fetch("/api/history?limit=20"); const d=await r.json();
    const list=document.getElementById("dbHistoryList");
    if(!d.analyses||d.analyses.length===0){
      list.innerHTML=`<div style="text-align:center;color:var(--muted);padding:24px;font-size:13px">No analyses saved yet.</div>`;return;
    }
    list.innerHTML=d.analyses.map(a=>{
      const color=RISK_COLORS[a.risk_level]||"#22c55e";
      const time=new Date(a.analyzed_at).toLocaleString("en-IN",{dateStyle:"short",timeStyle:"short"});
      return`<div class="db-history-item" onclick="jumpToDbItem(${a.latitude},${a.longitude},'${a.location_name}')">
        <div class="dhi-top"><span class="dhi-dot" style="background:${color}"></span>
          <span class="dhi-name">${a.location_name}</span>
          <span class="dhi-risk" style="color:${color}">${a.risk_level}</span>
          <span class="dhi-time">${time}</span></div>
        <div class="dhi-bottom">
          <span>🌡️ ${a.temperature}°C</span><span>💧 ${a.humidity}%</span>
          <span>💨 ${a.wind_speed}km/h</span>
          ${a.crop_type?`<span>🌾 ${a.crop_type}</span>`:""}
        </div></div>`;
    }).join("");
  }catch(_){}
}

async function loadStats(){
  try{
    const r=await fetch("/api/stats"); const d=await r.json(); const s=d.stats;
    if(!s||!s.total)return;
    document.getElementById("statLow").textContent=s.LOW??0;
    document.getElementById("statMedium").textContent=s.MEDIUM??0;
    document.getElementById("statHigh").textContent=s.HIGH??0;
    document.getElementById("statCritical").textContent=s.CRITICAL??0;
    document.getElementById("statTotal").textContent=`Total analyses: ${s.total}`;
  }catch(_){}
}

function jumpToDbItem(lat,lng,name){
  document.getElementById("latitude").value=lat;
  document.getElementById("longitude").value=lng;
  document.getElementById("locationName").value=name;
  switchRightTab("map",document.querySelector(".right-tab"));
  map.panTo([lat,lng]);
}

// ── Quick alert check (Phase 6) ───────────────────────────────────────────────
async function quickAlertCheck(){
  const lat=document.getElementById("checkLat").value;
  const lng=document.getElementById("checkLng").value;
  const res=document.getElementById("quickAlertResults");
  res.innerHTML=`<div style="text-align:center;padding:20px;color:var(--muted)">⏳ Checking alerts...</div>`;
  try{
    const r=await fetch(`/api/alerts/check?lat=${lat}&lng=${lng}&location=Checked Location`);
    const d=await r.json();
    if(d.alerts.length===0){
      res.innerHTML=`<div class="card"><div class="no-alerts"><div class="no-alerts-icon">✅</div>${t("no_alerts")}</div></div>`;
    } else {
      const alertWord = d.count===1 ? t("alert_singular") : t("alert_plural");
      res.innerHTML=`<div class="card"><h3 style="margin-bottom:12px">${t("found_alerts")} ${d.count} ${alertWord}</h3>
        <div class="alerts-section">${renderAlertCards(d.alerts)}</div></div>`;
    }
  }catch(e){
    res.innerHTML=`<div class="card error-card"><div class="error-icon">❌</div><div>${e.message}</div></div>`;
  }
}

// ── Tab switchers ─────────────────────────────────────────────────────────────
function switchRightTab(tab,btn){
  document.querySelectorAll(".right-tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".right-tab-content").forEach(c=>c.classList.remove("active"));
  if(btn) btn.classList.add("active");
  const tabMap={map:"tabMap",db:"tabDb",alerts:"tabAlerts"};
  document.getElementById(tabMap[tab]).classList.add("active");
  if(tab==="db"){loadDbHistory();loadStats();}
  if(tab==="map"){setTimeout(()=>map&&map.invalidateSize(),100);}
}

function toggleFarmerFields(){
  document.getElementById("farmerFields").style.display=
    document.getElementById("userType").value==="farmer"?"block":"none";
}

// ── Map ───────────────────────────────────────────────────────────────────────
function initMap(){
  map=L.map("map",{zoomControl:true}).setView([20.5937,78.9629],5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"© OpenStreetMap contributors",maxZoom:18}).addTo(map);
  map.on("click",(e)=>{
    const{lat,lng}=e.latlng;
    document.getElementById("latitude").value=lat.toFixed(4);
    document.getElementById("longitude").value=lng.toFixed(4);
    document.getElementById("locationName").value=`${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
    document.getElementById("mapHint").style.opacity="0";
    analyze();
  });
}

function addMarker(lat,lng,data){
  const color=RISK_COLORS[data.risk_level]||"#22c55e";
  const alertCount=data.disaster_alerts?.length||0;
  const marker=L.circleMarker([lat,lng],{
    radius:14,fillColor:color,color:"#ffffff",weight:2.5,opacity:1,fillOpacity:0.9
  }).addTo(map);
  const alertSnippet=alertCount>0
    ?`<div style="border-top:1px solid #2a2d3e;margin-top:8px;padding-top:8px;color:#fca5a5;font-size:11px">
        🔔 ${alertCount} active alert${alertCount>1?"s":""}:
        ${data.disaster_alerts.slice(0,2).map(a=>`<div>• ${a.emoji} ${a.title}</div>`).join("")}
      </div>` : "";
  const fcRows=data.forecast?.map(f=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0">
    <span>${f.emoji} ${f.day_short}</span><span style="color:#f97316">${f.temp_max}°</span>
    <span style="color:#60a5fa">${f.temp_min}°</span><span>🌧️${f.rain_probability}%</span></div>`).join("")||"";
  marker.bindPopup(`<div style="min-width:200px">
    <div style="font-weight:700;font-size:14px;margin-bottom:4px">${RISK_ICONS[data.risk_level]} ${data.risk_level} RISK</div>
    <div style="color:#8b8fa8;font-size:12px;margin-bottom:6px">📍 ${data.location}</div>
    <div style="display:flex;gap:10px;font-size:12px;margin-bottom:6px">
      <span>🌡️ ${data.weather.temperature}°C</span><span>💧 ${data.weather.humidity}%</span><span>💨 ${data.weather.wind_speed}km/h</span></div>
    <div style="font-size:12px;line-height:1.5;color:#c8cad8">${data.summary.slice(0,100)}...</div>
    ${fcRows?`<div style="border-top:1px solid #2a2d3e;margin-top:8px;padding-top:8px">${fcRows}</div>`:""}
    ${alertSnippet}
    ${data.saved_to_db?`<div style="color:#22c55e;font-size:11px;margin-top:6px">💾 Saved</div>`:""}
  </div>`);
  marker.openPopup();
  markers.push({marker,data,lat,lng});
  map.panTo([lat,lng]);
}

// ── History ───────────────────────────────────────────────────────────────────
function loadHistory(){const s=localStorage.getItem(HISTORY_KEY);if(s){locationHistory=JSON.parse(s);renderHistory();}}
function saveToHistory(data,lat,lng){
  locationHistory=locationHistory.filter(h=>!(Math.abs(h.lat-lat)<0.01&&Math.abs(h.lng-lng)<0.01));
  locationHistory.unshift({data,lat,lng});
  if(locationHistory.length>10)locationHistory.pop();
  localStorage.setItem(HISTORY_KEY,JSON.stringify(locationHistory)); renderHistory();
}
function renderHistory(){
  const card=document.getElementById("historyCard"),list=document.getElementById("historyList"),pin=document.getElementById("pinCount");
  if(locationHistory.length===0){card.style.display="none";pin.style.display="none";return;}
  card.style.display="block";pin.style.display="block";
  document.getElementById("pinNum").textContent=locationHistory.length;
  list.innerHTML=locationHistory.map((h,i)=>`<div class="history-item" onclick="jumpToHistory(${i})">
    <span class="history-dot" style="background:${RISK_COLORS[h.data.risk_level]}"></span>
    <span class="history-name">${h.data.location}</span>
    <span class="history-risk">${h.data.risk_level}</span>
    <span class="history-coords">${h.lat.toFixed(2)}, ${h.lng.toFixed(2)}</span>
  </div>`).join("");
}
function jumpToHistory(i){
  const h=locationHistory[i];if(!h)return;
  document.getElementById("latitude").value=h.lat;
  document.getElementById("longitude").value=h.lng;
  document.getElementById("locationName").value=h.data.location;
  map.panTo([h.lat,h.lng]);
  const ex=markers.find(m=>Math.abs(m.lat-h.lat)<0.01&&Math.abs(m.lng-h.lng)<0.01);
  if(ex)ex.marker.openPopup();
  renderResults(h.data,false);
}

function getMyLocation(){
  if(!navigator.geolocation){alert("Geolocation not supported.");return;}
  navigator.geolocation.getCurrentPosition(pos=>{
    document.getElementById("latitude").value=pos.coords.latitude.toFixed(4);
    document.getElementById("longitude").value=pos.coords.longitude.toFixed(4);
    document.getElementById("locationName").value="My Location";
    map.panTo([pos.coords.latitude,pos.coords.longitude],{animate:true});
  },()=>alert("Could not get location."));
}

// ── Analyze ───────────────────────────────────────────────────────────────────
async function analyze(){
  const btn=document.getElementById("analyzeBtn");
  document.getElementById("errorCard").style.display="none";
  document.getElementById("results").style.display="none";
  btn.disabled=true;
  document.getElementById("btnText").style.display="none";
  document.getElementById("btnLoader").style.display="inline";
  const lat=parseFloat(document.getElementById("latitude").value);
  const lng=parseFloat(document.getElementById("longitude").value);
  const userType=document.getElementById("userType").value;
  const payload={latitude:lat,longitude:lng,
    location_name:document.getElementById("locationName").value||"Your Location",
    user_type:userType, language:currentLang};
  if(userType==="farmer"){
    payload.crop_type=document.getElementById("cropType").value;
    payload.crop_stage=document.getElementById("cropStage").value;
    payload.soil_type=document.getElementById("soilType").value;
    payload.irrigation=document.getElementById("irrigationType").value;
  }
  if(!navigator.onLine){
    const cached=localStorage.getItem(CACHE_KEY);
    if(cached)renderResults(JSON.parse(cached),true);
    else showError("Offline — no cached data.");
    resetBtn();return;
  }
  try{
    const resp=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!resp.ok){const e=await resp.json();throw new Error(e.detail||"Server error");}
    const data=await resp.json();
    localStorage.setItem(CACHE_KEY,JSON.stringify(data));
    saveToHistory(data,lat,lng);
    addMarker(lat,lng,data);
    renderResults(data,false);
    if(data.saved_to_db){loadDbHistory();loadStats();}
  }catch(err){showError(`Analysis failed: ${err.message}`);}
  finally{resetBtn();}
}

// ── Render all results ────────────────────────────────────────────────────────
function renderResults(data,fromCache){
  // Risk banner
  document.getElementById("riskBanner").className=`risk-banner ${data.risk_color}`;
  document.getElementById("riskIcon").textContent=RISK_ICONS[data.risk_level]||"⚠️";
  document.getElementById("riskLevel").textContent=`${data.risk_level} ${t("risk")}`;
  document.getElementById("riskLocation").textContent=`📍 ${data.location}`;
  document.getElementById("riskTime").textContent=fromCache?`🕐 ${data.timestamp} (cached)`:`🕐 ${data.timestamp}`;
  document.getElementById("savedBadge").style.display=data.saved_to_db?"inline-flex":"none";

  // ── Disaster alerts (Phase 6) ──
  renderDisasterAlerts(data.disaster_alerts||[], data.alert_level||"NONE");

  // Weather
  const w=data.weather;
  let g=[
    {icon:"🌡️",value:w.temperature,unit:"°C",label:t("temperature")},
    {icon:"🤔",value:w.feels_like,unit:"°C",label:t("feels_like")},
    {icon:"💧",value:w.humidity,unit:"%",label:t("humidity")},
    {icon:"💨",value:w.wind_speed,unit:"km/h",label:t("wind")},
    {icon:"🌧️",value:w.precipitation,unit:"mm",label:t("rain")},
    {icon:"☀️",value:w.uv_index??"—",unit:"",label:t("uv_index")},
  ].map(s=>`<div class="weather-stat"><div class="stat-icon">${s.icon}</div><div class="stat-value">${s.value}<span class="stat-unit">${s.unit}</span></div><div class="stat-label">${s.label}</div></div>`).join("");
  if(w.soil_moisture!=null) g+=`<div class="weather-stat"><div class="stat-icon">🌱</div><div class="stat-value">${(w.soil_moisture*100).toFixed(0)}<span class="stat-unit">%</span></div><div class="stat-label">${t("soil_moisture")}</div></div>`;
  if(w.pressure) g+=`<div class="weather-stat"><div class="stat-icon">🔵</div><div class="stat-value" style="font-size:14px">${w.pressure?.toFixed(0)}<span class="stat-unit">hPa</span></div><div class="stat-label">${t("pressure")}</div></div>`;
  if(w.description) g+=`<div class="weather-stat"><div class="stat-icon">🌤️</div><div class="stat-value" style="font-size:12px">${w.description}</div><div class="stat-label">${t("conditions")}</div></div>`;
  document.getElementById("weatherGrid").innerHTML=g;

  if(data.forecast&&data.forecast.length>0){renderForecastCards(data.forecast);renderCharts(data.forecast);}

  const fa=document.getElementById("farmerAdvisoryCard");
  if(data.farmer_advisory){renderFarmerAdvisory(data.farmer_advisory);fa.style.display="block";}
  else fa.style.display="none";

  document.getElementById("aiSummary").textContent=data.summary;
  document.getElementById("recommendationsList").innerHTML=data.recommendations.map(r=>`<li class="rec-item">→ ${r}</li>`).join("");

  const el=document.getElementById("results");
  el.style.display="flex";el.style.flexDirection="column";el.style.gap="16px";
  document.querySelector(".left-panel").scrollTo({top:0,behavior:"smooth"});
}

// ── Render disaster alerts (Phase 6 key feature) ─────────────────────────────
function renderDisasterAlerts(alerts, alertLevel){
  const container = document.getElementById("alertsContainer");
  const levelBar  = document.getElementById("alertLevelBar");
  const badge     = document.getElementById("alertBadge");
  const emergency = document.getElementById("emergencyBanner");

  // Update level bar
  levelBar.className = `alert-level-bar ${alertLevel}`;
  document.getElementById("alertLevelText").textContent =
    alertLevel === "NONE" ? t("no_active_alerts") : `${alertLevel} ${t("alert_level")}`;

  // Header badge
  if(alerts.length > 0){
    badge.textContent = `🔔 ${alerts.length} Alert${alerts.length>1?"s":""}`;
    badge.className = "alert-badge show";
  } else {
    badge.className = "alert-badge";
  }

  // Emergency banner for CRITICAL
  emergency.className = alertLevel === "CRITICAL" ? "emergency-banner show" : "emergency-banner";

  // Render alert cards
  if(alerts.length === 0){
    container.innerHTML = `<div class="no-alerts"><div class="no-alerts-icon">${t("no_alerts_icon")}</div>${t("no_alerts")}</div>`;
    return;
  }
  container.innerHTML = renderAlertCards(alerts);
}

function renderAlertCards(alerts){
  return alerts.map((a,i) => `
    <div class="alert-card ${a.severity}" id="alertCard${i}">
      <div class="alert-card-header" onclick="toggleAlert(${i})">
        <span class="alert-sev-badge">${a.severity}</span>
        <span class="alert-emoji">${a.emoji}</span>
        <span class="alert-title">${a.title}</span>
        <span class="alert-chevron">▼</span>
      </div>
      <div class="alert-card-body">
        <p class="alert-message">${a.message}</p>
        <div class="alert-action-box">
          <div class="alert-action-label">${t("immediate_action")}</div>
          <div class="alert-action-text">${a.action}</div>
        </div>
        <div class="alert-expires">${t("duration")}: ${a.expires_in}</div>
      </div>
    </div>`).join("");
}

function toggleAlert(i){
  const card=document.getElementById(`alertCard${i}`);
  card.classList.toggle("expanded");
}

function renderFarmerAdvisory(fa){
  const cropSel=document.getElementById("cropType");
  const cropLabel=cropSel?cropSel.options[cropSel.selectedIndex]?.text:"";
  document.getElementById("faCropTag").textContent=cropLabel?`🌾 ${cropLabel}`:"";
  document.getElementById("faOverall").textContent=fa.overall_advice;
  const gn=document.getElementById("faGoodnews");
  if(fa.good_news){gn.style.display="flex";document.getElementById("faGoodnewsText").textContent=fa.good_news;}
  else gn.style.display="none";
  document.getElementById("faIrrigation").textContent=fa.irrigation_plan;
  document.getElementById("faPestRisk").textContent=fa.pest_disease_risk;
  document.getElementById("faHarvest").textContent=fa.harvest_warning;
  document.getElementById("faWeeklyTasks").innerHTML=fa.weekly_tasks.map(t=>`<li class="fa-task-item">${t}</li>`).join("");
  document.getElementById("faDontDo").innerHTML=fa.dont_do.map(t=>`<li class="fa-avoid-item">${t}</li>`).join("");
}

function renderForecastCards(forecast){
  document.getElementById("forecastDays").innerHTML=forecast.map(f=>`
    <div class="forecast-day">
      <div class="fc-day-name">${f.date}</div><div class="fc-emoji">${f.emoji}</div>
      <div class="fc-desc">${f.description}</div>
      <div class="fc-temps"><span class="fc-temp-max">${f.temp_max}°</span><span class="fc-temp-min">${f.temp_min}°</span></div>
      <div class="fc-rain">🌧️ ${f.rain_probability}% · ${f.precipitation}mm</div>
      <div class="fc-wind">💨 ${f.wind_max} km/h</div>
    </div>`).join("");
}

const CD={responsive:true,maintainAspectRatio:false,
  plugins:{legend:{display:false}},
  scales:{
    x:{ticks:{color:"#6b82a8",font:{size:10,family:"'JetBrains Mono'"}},grid:{color:"#1e2f4d"}},
    y:{ticks:{color:"#6b82a8",font:{size:10,family:"'JetBrains Mono'"}},grid:{color:"#1e2f4d"}},
  }};

function renderCharts(fc){
  if(tempChartInst){tempChartInst.destroy();tempChartInst=null;}
  if(rainChartInst){rainChartInst.destroy();rainChartInst=null;}
  if(windChartInst){windChartInst.destroy();windChartInst=null;}
  const labels=fc.map(f=>f.day_short);
  const legendOpts={display:true,labels:{color:"#6b82a8",font:{size:10},boxWidth:10}};
  tempChartInst=new Chart(document.getElementById("tempChart"),{type:"line",data:{labels,datasets:[
    {label:"Max °C",data:fc.map(f=>f.temp_max),borderColor:"#f97316",backgroundColor:"rgba(249,115,22,0.1)",pointBackgroundColor:"#f97316",pointRadius:5,tension:0.4,fill:false,borderWidth:2},
    {label:"Min °C",data:fc.map(f=>f.temp_min),borderColor:"#00d4ff",backgroundColor:"rgba(0,212,255,0.1)",pointBackgroundColor:"#00d4ff",pointRadius:5,tension:0.4,fill:false,borderWidth:2},
  ]},options:{...CD,plugins:{legend:legendOpts},scales:{...CD.scales,y:{...CD.scales.y,title:{display:true,text:"°C",color:"#6b82a8"}}}}});
  rainChartInst=new Chart(document.getElementById("rainChart"),{type:"bar",data:{labels,datasets:[
    {label:"Rainfall mm",data:fc.map(f=>f.precipitation),backgroundColor:"rgba(0,212,255,0.5)",borderColor:"#00d4ff",borderWidth:1,borderRadius:5},
    {label:"Rain %",data:fc.map(f=>f.rain_probability),backgroundColor:"rgba(0,170,204,0.2)",borderColor:"#00aacc",borderWidth:1,type:"line",yAxisID:"y1",tension:0.4,pointRadius:4,pointBackgroundColor:"#00aacc"},
  ]},options:{...CD,plugins:{legend:legendOpts},scales:{...CD.scales,y:{...CD.scales.y,title:{display:true,text:"mm",color:"#6b82a8"}},y1:{position:"right",ticks:{color:"#6b82a8",font:{size:10}},grid:{display:false},title:{display:true,text:"%",color:"#6b82a8"}}}}});
  windChartInst=new Chart(document.getElementById("windChart"),{type:"bar",data:{labels,datasets:[
    {label:"Max Wind km/h",data:fc.map(f=>f.wind_max),backgroundColor:fc.map(f=>f.wind_max>60?"rgba(239,68,68,0.7)":f.wind_max>40?"rgba(249,115,22,0.7)":"rgba(16,185,129,0.7)"),borderColor:"#1e2f4d",borderWidth:1,borderRadius:5}
  ]},options:{...CD,scales:{...CD.scales,y:{...CD.scales.y,title:{display:true,text:"km/h",color:"#6b82a8"}}}}});
}

function switchTab(tab,btn){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  document.getElementById("tempChartWrap").style.display=tab==="temp"?"block":"none";
  document.getElementById("rainChartWrap").style.display=tab==="rain"?"block":"none";
  document.getElementById("windChartWrap").style.display=tab==="wind"?"block":"none";
}

function showError(msg){document.getElementById("errorMsg").textContent=msg;document.getElementById("errorCard").style.display="block";}
function resetBtn(){document.getElementById("analyzeBtn").disabled=false;document.getElementById("btnText").style.display="inline";document.getElementById("btnLoader").style.display="none";}

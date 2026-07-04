"""
MeghNet - AI Climate Intelligence & Decision Support Platform
FastAPI Backend v7 — Multi-language (English, Hindi, Marathi)
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, google.generativeai as genai
import json, os
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
import database as db
import alerts as alert_engine

load_dotenv()

app = FastAPI(title="MeghNet API", version="7.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")
templates = Jinja2Templates(directory="../frontend/templates")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

# ── Language instructions for AI ───────────────────────────────────────────────
LANG_INSTRUCTIONS = {
    "en": "Respond in simple English. Use short sentences.",
    "hi": "हिंदी में जवाब दें। सरल और स्पष्ट भाषा उपयोग करें। ग्रामीण किसानों के लिए लिखें।",
    "mr": "मराठीत उत्तर द्या। सोपी आणि स्पष्ट भाषा वापरा। ग्रामीण शेतकऱ्यांसाठी लिहा।",
}

WMO_CODES = {
    0:("Clear sky","☀️"),1:("Mainly clear","🌤️"),2:("Partly cloudy","⛅"),
    3:("Overcast","☁️"),45:("Foggy","🌫️"),48:("Rime fog","🌫️"),
    51:("Light drizzle","🌦️"),53:("Moderate drizzle","🌦️"),55:("Dense drizzle","🌧️"),
    61:("Slight rain","🌧️"),63:("Moderate rain","🌧️"),65:("Heavy rain","🌧️"),
    71:("Slight snow","❄️"),73:("Moderate snow","❄️"),75:("Heavy snow","❄️"),
    80:("Rain showers","🌦️"),81:("Moderate showers","🌧️"),82:("Violent showers","⛈️"),
    95:("Thunderstorm","⛈️"),96:("Thunderstorm+hail","⛈️"),99:("Heavy hail storm","⛈️"),
}
def wmo_desc(code):  return WMO_CODES.get(code,("Unknown","🌡️"))[0]
def wmo_emoji(code): return WMO_CODES.get(code,("Unknown","🌡️"))[1]

# ── Models ─────────────────────────────────────────────────────────────────────
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = "Your Location"
    user_type: Optional[str] = "general"
    language: Optional[str] = "en"          # ← NEW: en | hi | mr
    crop_type:  Optional[str] = None
    crop_stage: Optional[str] = None
    farm_size:  Optional[str] = None
    soil_type:  Optional[str] = None
    irrigation: Optional[str] = None

class ForecastDay(BaseModel):
    date: str; day_short: str; temp_max: float; temp_min: float
    precipitation: float; rain_probability: int; wind_max: float
    uv_index: float; weather_code: int; description: str; emoji: str

class DisasterAlert(BaseModel):
    id: str; severity: str; type: str; emoji: str
    title: str; message: str; action: str; expires_in: str

class FarmerAdvisory(BaseModel):
    overall_advice: str; irrigation_plan: str; pest_disease_risk: str
    harvest_warning: str; weekly_tasks: list[str]; dont_do: list[str]
    good_news: Optional[str]

class ClimateResponse(BaseModel):
    location: str; timestamp: str; weather: dict; language: str
    forecast: list[ForecastDay]
    disaster_alerts: list[DisasterAlert]
    alert_level: str
    risk_level: str; risk_color: str
    summary: str; recommendations: list[str]
    farmer_advisory: Optional[FarmerAdvisory]
    raw_weather: dict; saved_to_db: bool = False

# ── Fetchers ───────────────────────────────────────────────────────────────────
async def fetch_weather(lat, lon):
    url=(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
         f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,"
         f"rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,"
         f"soil_temperature_0cm,soil_moisture_0_to_1cm"
         f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,"
         f"precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code,"
         f"et0_fao_evapotranspiration&timezone=auto&forecast_days=3")
    async with httpx.AsyncClient(timeout=10) as c:
        r=await c.get(url); r.raise_for_status(); return r.json()

async def fetch_nasa(lat, lon):
    url=(f"https://power.larc.nasa.gov/api/temporal/daily/point"
         f"?parameters=ALLSKY_SFC_SW_DWN,T2M,PRECTOTCORR,RH2M"
         f"&community=AG&longitude={lon}&latitude={lat}&start=20250101&end=20250110&format=JSON")
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r=await c.get(url)
            if r.status_code==200:
                p=r.json().get("properties",{}).get("parameter",{})
                sv=list(p.get("ALLSKY_SFC_SW_DWN",{}).values())
                return {"avg_solar_radiation_kwh_m2":round(sum(sv)/len(sv),2) if sv else 0}
    except: pass
    return {"avg_solar_radiation_kwh_m2":None}

def build_forecast(wd):
    daily=wd.get("daily",{})
    dates,tmax,tmin,prec,rprob,wmax,uv,codes=(
        daily.get("time",[]),daily.get("temperature_2m_max",[]),daily.get("temperature_2m_min",[]),
        daily.get("precipitation_sum",[]),daily.get("precipitation_probability_max",[]),
        daily.get("wind_speed_10m_max",[]),daily.get("uv_index_max",[]),daily.get("weather_code",[]))
    fc=[]
    for i in range(len(dates)):
        try:
            dt=datetime.strptime(dates[i],"%Y-%m-%d"); code=int(codes[i]) if i<len(codes) else 0
            fc.append(ForecastDay(
                date=dt.strftime("%a %d %b"),day_short=dt.strftime("%a"),
                temp_max=round(tmax[i],1) if i<len(tmax) else 0,
                temp_min=round(tmin[i],1) if i<len(tmin) else 0,
                precipitation=round(prec[i],1) if i<len(prec) else 0,
                rain_probability=int(rprob[i]) if i<len(rprob) else 0,
                wind_max=round(wmax[i],1) if i<len(wmax) else 0,
                uv_index=round(uv[i],1) if i<len(uv) else 0,
                weather_code=code,description=wmo_desc(code),emoji=wmo_emoji(code)))
        except: continue
    return fc

async def ai_analyze(wd, nasa, location, user_type, alerts, lang="en"):
    cur=wd.get("current",{}); d=wd.get("daily",{})
    lang_instruction = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    alert_context = "\n".join([f"- {a['title']}" for a in alerts]) if alerts else "None"
    prompt=f"""You are MeghNet Climate AI. {lang_instruction}
Return JSON only, no markdown.
LOCATION:{location} USER:{user_type}
CURRENT: T={cur.get('temperature_2m')}°C H={cur.get('relative_humidity_2m')}%
W={wmo_desc(cur.get('weather_code',0))} Rain={cur.get('precipitation')}mm Wind={cur.get('wind_speed_10m')}km/h
3DAY: MaxT={d.get('temperature_2m_max',[])} Rain={d.get('precipitation_sum',[])}mm
ACTIVE ALERTS:\n{alert_context}
Return: {{"risk_level":"LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
"summary":"2-3 sentences in {lang} language",
"recommendations":["r1 in {lang}","r2 in {lang}","r3 in {lang}"]}}"""
    r=model.generate_content(prompt); t=r.text.strip()
    if t.startswith("```"): t=t.split("```")[1]; t=t[4:] if t.startswith("json") else t
    return json.loads(t.strip())

async def ai_farmer(wd, forecast, crop, stage, farm_size, soil, irrigation, location, lang="en"):
    cur=wd.get("current",{})
    lang_instruction = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    fc_text="\n".join([f"  {f.date}: {f.emoji} Max={f.temp_max}°C Rain={f.precipitation}mm ({f.rain_probability}%)" for f in forecast])
    et0=wd.get("daily",{}).get("et0_fao_evapotranspiration",[None])[0]
    prompt=f"""Expert Indian agricultural advisor. {lang_instruction}
Return JSON only, no markdown.
LOCATION:{location} CROP:{crop or "mixed"} STAGE:{stage or "growing"}
SOIL:{soil or "loamy"} IRRIGATION:{irrigation or "rainfed"}
CURRENT: T={cur.get('temperature_2m')}°C H={cur.get('relative_humidity_2m')}%
Rain={cur.get('precipitation')}mm SoilMoisture={cur.get('soil_moisture_0_to_1cm')} ET0={et0}mm/day
3-DAY:\n{fc_text}
All text in {lang} language. Return: {{"overall_advice":"2-3 sentences",
"irrigation_plan":"specific","pest_disease_risk":"specific risks named",
"harvest_warning":"timing or no urgent concern",
"weekly_tasks":["t1","t2","t3","t4"],"dont_do":["d1","d2"],"good_news":"positive or null"}}"""
    r=model.generate_content(prompt); t=r.text.strip()
    if t.startswith("```"): t=t.split("```")[1]; t=t[4:] if t.startswith("json") else t
    return FarmerAdvisory(**json.loads(t.strip()))

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/analyze", response_model=ClimateResponse)
async def analyze_climate(req: LocationRequest):
    try:
        lang = req.language or "en"
        wd       = await fetch_weather(req.latitude, req.longitude)
        nasa     = await fetch_nasa(req.latitude, req.longitude)
        forecast = build_forecast(wd)
        raw_alerts  = alert_engine.generate_alerts(wd, forecast, req.location_name)
        alert_level = alert_engine.get_overall_alert_level(raw_alerts)
        rich_alerts = [DisasterAlert(**a) for a in raw_alerts]
        ai = await ai_analyze(wd, nasa, req.location_name, req.user_type, raw_alerts, lang)
        rc = {"LOW":"green","MEDIUM":"yellow","HIGH":"orange","CRITICAL":"red"}

        farmer_advisory = None
        if req.user_type == "farmer":
            farmer_advisory = await ai_farmer(
                wd, forecast, req.crop_type, req.crop_stage,
                req.farm_size, req.soil_type, req.irrigation, req.location_name, lang)

        result = ClimateResponse(
            location=req.location_name, language=lang,
            timestamp=datetime.now().strftime("%d %b %Y, %I:%M %p"),
            weather={"temperature":wd["current"]["temperature_2m"],
                "feels_like":wd["current"]["apparent_temperature"],
                "humidity":wd["current"]["relative_humidity_2m"],
                "wind_speed":wd["current"]["wind_speed_10m"],
                "precipitation":wd["current"]["precipitation"],
                "description":wmo_desc(wd["current"].get("weather_code",0)),
                "uv_index":wd["daily"]["uv_index_max"][0] if wd["daily"].get("uv_index_max") else None,
                "soil_temp":wd["current"].get("soil_temperature_0cm"),
                "soil_moisture":wd["current"].get("soil_moisture_0_to_1cm"),
                "pressure":wd["current"].get("surface_pressure"),},
            forecast=forecast, disaster_alerts=rich_alerts, alert_level=alert_level,
            risk_level=ai["risk_level"], risk_color=rc.get(ai["risk_level"],"green"),
            summary=ai["summary"], recommendations=ai["recommendations"],
            farmer_advisory=farmer_advisory, raw_weather=wd["current"],)

        result_dict = result.model_dump()
        result_dict["farmer_advisory"] = farmer_advisory.model_dump() if farmer_advisory else None
        result_dict["disaster_alerts"] = [a.model_dump() for a in rich_alerts]
        saved = await db.save_analysis(result_dict, req.latitude, req.longitude,
                                       req.user_type, req.crop_type)
        result.saved_to_db = saved
        return result

    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"Weather API error: {str(e)}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI response parsing failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alerts/check")
async def check_alerts(lat: float, lng: float, location: str = "Your Location"):
    try:
        wd=await fetch_weather(lat,lng); forecast=build_forecast(wd)
        raw=alert_engine.generate_alerts(wd,forecast,location)
        level=alert_engine.get_overall_alert_level(raw)
        return {"alert_level":level,"alerts":raw,"count":len(raw),
                "location":location,"checked_at":datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@app.get("/api/history")
async def get_history(limit: int = 20):
    data=await db.get_recent_analyses(limit)
    return {"analyses":data,"count":len(data)}

@app.get("/api/stats")
async def get_stats():
    stats=await db.get_risk_stats()
    return {"stats":stats,"db_connected":db.is_connected()}

@app.get("/api/health")
async def health():
    return {"status":"ok","service":"MeghNet API","version":"7.0.0",
            "db_connected":db.is_connected()}

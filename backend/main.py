"""
MeghNet - AI Climate Intelligence Platform
FastAPI Backend - Pydantic v1 Compatible for Render
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import google.generativeai as genai
import json
import os
import pathlib
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ── App Setup ──────────────────────────────────────────────────────────────────
app = FastAPI(title="MeghNet API", version="9.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = pathlib.Path(__file__).parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(BASE / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE / "templates"))

# ── Gemini ─────────────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

LANG_INSTRUCTIONS = {
    "en": "Respond in simple English.",
    "hi": "हिंदी में जवाब दें। सरल भाषा उपयोग करें।",
    "mr": "मराठीत उत्तर द्या। सोपी भाषा वापरा।",
}

WMO_CODES = {
    0:("Clear sky","☀️"), 1:("Mainly clear","🌤️"), 2:("Partly cloudy","⛅"),
    3:("Overcast","☁️"), 45:("Foggy","🌫️"), 48:("Rime fog","🌫️"),
    51:("Light drizzle","🌦️"), 53:("Moderate drizzle","🌦️"), 55:("Dense drizzle","🌧️"),
    61:("Slight rain","🌧️"), 63:("Moderate rain","🌧️"), 65:("Heavy rain","🌧️"),
    71:("Slight snow","❄️"), 73:("Moderate snow","❄️"), 75:("Heavy snow","❄️"),
    80:("Rain showers","🌦️"), 81:("Moderate showers","🌧️"), 82:("Violent showers","⛈️"),
    95:("Thunderstorm","⛈️"), 96:("Thunderstorm+hail","⛈️"), 99:("Heavy hail","⛈️"),
}

def wmo_desc(code):  return WMO_CODES.get(code, ("Unknown","🌡️"))[0]
def wmo_emoji(code): return WMO_CODES.get(code, ("Unknown","🌡️"))[1]


# ── Pydantic v1 Models ─────────────────────────────────────────────────────────
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = "Your Location"
    user_type: Optional[str] = "general"
    language: Optional[str] = "en"
    crop_type: Optional[str] = None
    crop_stage: Optional[str] = None
    farm_size: Optional[str] = None
    soil_type: Optional[str] = None
    irrigation: Optional[str] = None


class ForecastDay(BaseModel):
    date: str
    day_short: str
    temp_max: float
    temp_min: float
    precipitation: float
    rain_probability: int
    wind_max: float
    uv_index: float
    weather_code: int
    description: str
    emoji: str


class DisasterAlert(BaseModel):
    id: str
    severity: str
    type: str
    emoji: str
    title: str
    message: str
    action: str
    expires_in: str


class FarmerAdvisory(BaseModel):
    overall_advice: str
    irrigation_plan: str
    pest_disease_risk: str
    harvest_warning: str
    weekly_tasks: List[str]
    dont_do: List[str]
    good_news: Optional[str] = None


class ClimateResponse(BaseModel):
    location: str
    timestamp: str
    weather: Dict[str, Any]
    language: str
    forecast: List[ForecastDay]
    disaster_alerts: List[DisasterAlert]
    alert_level: str
    risk_level: str
    risk_color: str
    summary: str
    recommendations: List[str]
    farmer_advisory: Optional[FarmerAdvisory] = None
    raw_weather: Dict[str, Any]
    saved_to_db: bool = False


# ── Weather Fetchers ───────────────────────────────────────────────────────────
async def fetch_weather(lat: float, lon: float) -> dict:
    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,"
        f"rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,"
        f"soil_temperature_0cm,soil_moisture_0_to_1cm"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,"
        f"precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code,"
        f"et0_fao_evapotranspiration&timezone=auto&forecast_days=3"
    )
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(url)
        r.raise_for_status()
        return r.json()


async def fetch_nasa(lat: float, lon: float) -> dict:
    url = (
        f"https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters=ALLSKY_SFC_SW_DWN,T2M,PRECTOTCORR,RH2M"
        f"&community=AG&longitude={lon}&latitude={lat}"
        f"&start=20250101&end=20250110&format=JSON"
    )
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get(url)
            if r.status_code == 200:
                p = r.json().get("properties", {}).get("parameter", {})
                sv = list(p.get("ALLSKY_SFC_SW_DWN", {}).values())
                return {"avg_solar": round(sum(sv)/len(sv), 2) if sv else 0}
    except Exception:
        pass
    return {"avg_solar": None}


def build_forecast(wd: dict) -> List[ForecastDay]:
    daily = wd.get("daily", {})
    dates  = daily.get("time", [])
    tmax   = daily.get("temperature_2m_max", [])
    tmin   = daily.get("temperature_2m_min", [])
    prec   = daily.get("precipitation_sum", [])
    rprob  = daily.get("precipitation_probability_max", [])
    wmax   = daily.get("wind_speed_10m_max", [])
    uv     = daily.get("uv_index_max", [])
    codes  = daily.get("weather_code", [])
    fc = []
    for i in range(len(dates)):
        try:
            dt   = datetime.strptime(dates[i], "%Y-%m-%d")
            code = int(codes[i]) if i < len(codes) else 0
            fc.append(ForecastDay(
                date=dt.strftime("%a %d %b"),
                day_short=dt.strftime("%a"),
                temp_max=round(tmax[i], 1) if i < len(tmax) else 0,
                temp_min=round(tmin[i], 1) if i < len(tmin) else 0,
                precipitation=round(prec[i], 1) if i < len(prec) else 0,
                rain_probability=int(rprob[i]) if i < len(rprob) else 0,
                wind_max=round(wmax[i], 1) if i < len(wmax) else 0,
                uv_index=round(uv[i], 1) if i < len(uv) else 0,
                weather_code=code,
                description=wmo_desc(code),
                emoji=wmo_emoji(code),
            ))
        except Exception:
            continue
    return fc


# ── Alert Engine ───────────────────────────────────────────────────────────────
def generate_alerts(wd: dict, location: str) -> List[dict]:
    alerts = []
    cur    = wd.get("current", {})
    daily  = wd.get("daily", {})
    temp   = cur.get("temperature_2m", 0) or 0
    precip = cur.get("precipitation", 0) or 0
    wind   = cur.get("wind_speed_10m", 0) or 0
    wcode  = cur.get("weather_code", 0) or 0
    pressure = cur.get("surface_pressure", 1013) or 1013
    humidity = cur.get("relative_humidity_2m", 0) or 0
    daily_rain = (daily.get("precipitation_sum") or [0])[0] or 0
    daily_wind = (daily.get("wind_speed_10m_max") or [0])[0] or 0
    uv = (daily.get("uv_index_max") or [0])[0] or 0

    if wcode in [95, 96, 99]:
        alerts.append({"id":"storm","severity":"CRITICAL","type":"Thunderstorm","emoji":"⛈️",
            "title":"Severe Thunderstorm Active","expires_in":"2-4 hours",
            "message":f"Thunderstorm detected over {location}. Stay indoors.",
            "action":"Seek shelter immediately. Avoid open areas and trees."})
    if temp >= 45:
        alerts.append({"id":"heat","severity":"CRITICAL","type":"Extreme Heat","emoji":"🌡️",
            "title":f"Extreme Heat — {temp}°C","expires_in":"Until evening",
            "message":f"Temperature {temp}°C is dangerous. Risk of heatstroke.",
            "action":"Stay indoors 11AM–4PM. Drink water every 30 mins."})
    elif temp >= 40:
        alerts.append({"id":"heat_warn","severity":"HIGH","type":"Heat Warning","emoji":"☀️",
            "title":f"Heat Warning — {temp}°C","expires_in":"Rest of day",
            "message":f"High temperature of {temp}°C. Vulnerable people at risk.",
            "action":"Limit outdoor activity. Stay hydrated."})
    if daily_rain >= 50:
        alerts.append({"id":"flood","severity":"CRITICAL","type":"Flood Risk","emoji":"🌊",
            "title":f"Flood Risk — {daily_rain}mm Expected","expires_in":"Next 24 hours",
            "message":f"Heavy rainfall of {daily_rain}mm expected. Low areas at risk.",
            "action":"Avoid river crossings. Move valuables to higher ground."})
    elif daily_rain >= 20:
        alerts.append({"id":"rain","severity":"MEDIUM","type":"Heavy Rain","emoji":"🌧️",
            "title":f"Heavy Rain Advisory","expires_in":"Next 12 hours",
            "message":f"Significant rainfall expected ({daily_rain}mm).",
            "action":"Carry rain protection. Avoid waterlogged roads."})
    if daily_wind >= 60:
        alerts.append({"id":"wind","severity":"HIGH","type":"Strong Wind","emoji":"💨",
            "title":f"Strong Wind — {daily_wind}km/h","expires_in":"Next 6 hours",
            "message":f"Dangerous winds of {daily_wind}km/h expected.",
            "action":"Secure loose objects. Stay away from trees."})
    if uv >= 8:
        alerts.append({"id":"uv","severity":"MEDIUM","type":"UV Warning","emoji":"☀️",
            "title":f"High UV Index — {uv}","expires_in":"Daytime hours",
            "message":f"UV index of {uv} is very high. Sunburn risk within 20 minutes.",
            "action":"Apply SPF 50+. Avoid direct sun 10AM–3PM."})
    if pressure < 990:
        alerts.append({"id":"cyclone","severity":"HIGH","type":"Cyclone Watch","emoji":"🌀",
            "title":f"Low Pressure — {pressure:.0f}hPa","expires_in":"Monitor continuously",
            "message":f"Very low pressure indicates possible cyclonic activity.",
            "action":"Monitor NDMA/IMD bulletins. Prepare emergency kit."})

    priority = {"CRITICAL":4,"HIGH":3,"MEDIUM":2,"LOW":1}
    alerts.sort(key=lambda x: priority.get(x["severity"], 0), reverse=True)
    return alerts


def get_alert_level(alerts: List[dict]) -> str:
    if not alerts:
        return "NONE"
    priority = {"CRITICAL":4,"HIGH":3,"MEDIUM":2,"LOW":1,"NONE":0}
    return max(alerts, key=lambda x: priority.get(x["severity"], 0))["severity"]


# ── AI Analysis ────────────────────────────────────────────────────────────────
async def ai_analyze(wd: dict, location: str, user_type: str,
                     alerts: List[dict], lang: str = "en") -> dict:
    cur = wd.get("current", {})
    d   = wd.get("daily", {})
    li  = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    ac  = "\n".join([f"- {a['title']}" for a in alerts]) if alerts else "None"
    prompt = f"""You are MeghNet Climate AI. {li} Return JSON only, no markdown.
LOCATION:{location} USER:{user_type}
CURRENT: T={cur.get('temperature_2m')}°C H={cur.get('relative_humidity_2m')}%
Weather={wmo_desc(cur.get('weather_code',0))} Rain={cur.get('precipitation')}mm
Wind={cur.get('wind_speed_10m')}km/h
3DAY MaxT={d.get('temperature_2m_max',[])} Rain={d.get('precipitation_sum',[])}mm
ACTIVE ALERTS:\n{ac}
Return: {{"risk_level":"LOW","summary":"2-3 sentences","recommendations":["r1","r2","r3"]}}
risk_level must be one of: LOW, MEDIUM, HIGH, CRITICAL"""
    r = model.generate_content(prompt)
    t = r.text.strip()
    if t.startswith("```"):
        t = t.split("```")[1]
        if t.startswith("json"):
            t = t[4:]
    return json.loads(t.strip())


async def ai_farmer(wd: dict, forecast: List[ForecastDay], crop: Optional[str],
                    stage: Optional[str], soil: Optional[str],
                    irrigation: Optional[str], location: str, lang: str = "en") -> FarmerAdvisory:
    cur = wd.get("current", {})
    li  = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    fc_text = "\n".join([
        f"  {f.date}: {f.emoji} Max={f.temp_max}°C Rain={f.precipitation}mm ({f.rain_probability}%)"
        for f in forecast
    ])
    prompt = f"""Expert Indian agricultural advisor. {li} Return JSON only, no markdown.
LOCATION:{location} CROP:{crop or "mixed"} STAGE:{stage or "growing"}
SOIL:{soil or "loamy"} IRRIGATION:{irrigation or "rainfed"}
CURRENT: T={cur.get('temperature_2m')}°C H={cur.get('relative_humidity_2m')}%
3-DAY:\n{fc_text}
Return JSON in {lang} language:
{{"overall_advice":"2-3 sentences","irrigation_plan":"specific advice",
"pest_disease_risk":"named risks","harvest_warning":"timing or No urgent concern",
"weekly_tasks":["t1","t2","t3","t4"],"dont_do":["d1","d2"],"good_news":"positive or null"}}"""
    r = model.generate_content(prompt)
    t = r.text.strip()
    if t.startswith("```"):
        t = t.split("```")[1]
        if t.startswith("json"):
            t = t[4:]
    data = json.loads(t.strip())
    return FarmerAdvisory(**data)


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/analyze")
async def analyze_climate(req: LocationRequest):
    try:
        lang     = req.language or "en"
        wd       = await fetch_weather(req.latitude, req.longitude)
        forecast = build_forecast(wd)
        raw_alerts  = generate_alerts(wd, req.location_name or "Your Location")
        alert_level = get_alert_level(raw_alerts)
        rich_alerts = [DisasterAlert(**a) for a in raw_alerts]
        ai = await ai_analyze(wd, req.location_name or "Your Location",
                              req.user_type or "general", raw_alerts, lang)

        rc = {"LOW":"green","MEDIUM":"yellow","HIGH":"orange","CRITICAL":"red"}

        farmer_advisory = None
        if req.user_type == "farmer":
            farmer_advisory = await ai_farmer(
                wd, forecast, req.crop_type, req.crop_stage,
                req.soil_type, req.irrigation,
                req.location_name or "Your Location", lang
            )

        cur = wd["current"]
        daily = wd.get("daily", {})

        result = {
            "location": req.location_name,
            "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p"),
            "language": lang,
            "weather": {
                "temperature":   cur.get("temperature_2m"),
                "feels_like":    cur.get("apparent_temperature"),
                "humidity":      cur.get("relative_humidity_2m"),
                "wind_speed":    cur.get("wind_speed_10m"),
                "precipitation": cur.get("precipitation"),
                "description":   wmo_desc(cur.get("weather_code", 0)),
                "uv_index":      (daily.get("uv_index_max") or [None])[0],
                "soil_moisture": cur.get("soil_moisture_0_to_1cm"),
                "pressure":      cur.get("surface_pressure"),
                "feels_like":    cur.get("apparent_temperature"),
            },
            "forecast":        [f.dict() for f in forecast],
            "disaster_alerts": [a.dict() for a in rich_alerts],
            "alert_level":     alert_level,
            "risk_level":      ai.get("risk_level", "LOW"),
            "risk_color":      rc.get(ai.get("risk_level", "LOW"), "green"),
            "summary":         ai.get("summary", ""),
            "recommendations": ai.get("recommendations", []),
            "farmer_advisory": farmer_advisory.dict() if farmer_advisory else None,
            "raw_weather":     cur,
            "saved_to_db":     False,
        }

        # Try saving to DB (optional — won't crash if not configured)
        try:
            import database as db
            saved = await db.save_analysis(result, req.latitude, req.longitude,
                                           req.user_type or "general", req.crop_type)
            result["saved_to_db"] = saved
        except Exception:
            pass

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
        wd  = await fetch_weather(lat, lng)
        raw = generate_alerts(wd, location)
        lvl = get_alert_level(raw)
        return {"alert_level": lvl, "alerts": raw, "count": len(raw),
                "location": location, "checked_at": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/history")
async def get_history(limit: int = 20):
    try:
        import database as db
        data = await db.get_recent_analyses(limit)
        return {"analyses": data, "count": len(data)}
    except Exception:
        return {"analyses": [], "count": 0}


@app.get("/api/stats")
async def get_stats():
    try:
        import database as db
        return {"stats": await db.get_risk_stats(), "db_connected": db.is_connected()}
    except Exception:
        return {"stats": {}, "db_connected": False}


@app.get("/api/health")
async def health():
    db_ok = False
    try:
        import database as db
        db_ok = db.is_connected()
    except Exception:
        pass
    return {"status": "ok", "service": "MeghNet", "version": "9.0.0", "db_connected": db_ok}

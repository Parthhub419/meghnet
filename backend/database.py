"""
MeghNet - Database Layer
Supabase (PostgreSQL) integration
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# ── Client (None if not configured) ───────────────────────────────────────────
def get_client() -> Optional[Client]:
    if not SUPABASE_URL or not SUPABASE_KEY or "your-project" in SUPABASE_URL:
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception:
        return None

# ── Save analysis to DB ────────────────────────────────────────────────────────
async def save_analysis(data: dict, lat: float, lng: float, user_type: str,
                        crop_type: Optional[str] = None) -> bool:
    client = get_client()
    if not client:
        return False
    try:
        record = {
            "location_name":    data.get("location", "Unknown"),
            "latitude":         round(lat, 4),
            "longitude":        round(lng, 4),
            "user_type":        user_type,
            "crop_type":        crop_type,
            "risk_level":       data.get("risk_level"),
            "risk_color":       data.get("risk_color"),
            "summary":          data.get("summary"),
            "temperature":      data.get("weather", {}).get("temperature"),
            "humidity":         data.get("weather", {}).get("humidity"),
            "wind_speed":       data.get("weather", {}).get("wind_speed"),
            "precipitation":    data.get("weather", {}).get("precipitation"),
            "weather_desc":     data.get("weather", {}).get("description"),
            "recommendations":  data.get("recommendations", []),
            "disaster_alerts":  data.get("disaster_alerts", []),
            "has_farmer_advisory": data.get("farmer_advisory") is not None,
            "analyzed_at":      datetime.utcnow().isoformat(),
        }
        client.table("analyses").insert(record).execute()
        return True
    except Exception as e:
        print(f"DB save error: {e}")
        return False

# ── Get recent analyses ────────────────────────────────────────────────────────
async def get_recent_analyses(limit: int = 20) -> list:
    client = get_client()
    if not client:
        return []
    try:
        resp = client.table("analyses")\
            .select("*")\
            .order("analyzed_at", desc=True)\
            .limit(limit)\
            .execute()
        return resp.data or []
    except Exception as e:
        print(f"DB fetch error: {e}")
        return []

# ── Get analyses by location ───────────────────────────────────────────────────
async def get_location_history(lat: float, lng: float, radius: float = 0.5) -> list:
    client = get_client()
    if not client:
        return []
    try:
        resp = client.table("analyses")\
            .select("*")\
            .gte("latitude",  lat - radius)\
            .lte("latitude",  lat + radius)\
            .gte("longitude", lng - radius)\
            .lte("longitude", lng + radius)\
            .order("analyzed_at", desc=True)\
            .limit(10)\
            .execute()
        return resp.data or []
    except Exception as e:
        print(f"DB location fetch error: {e}")
        return []

# ── Get risk stats (for dashboard) ────────────────────────────────────────────
async def get_risk_stats() -> dict:
    client = get_client()
    if not client:
        return {}
    try:
        resp = client.table("analyses").select("risk_level, analyzed_at").execute()
        rows = resp.data or []
        stats = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0, "total": len(rows)}
        for r in rows:
            lvl = r.get("risk_level", "LOW")
            if lvl in stats:
                stats[lvl] += 1
        return stats
    except Exception as e:
        print(f"DB stats error: {e}")
        return {}

# ── Check if DB is connected ───────────────────────────────────────────────────
def is_connected() -> bool:
    return get_client() is not None

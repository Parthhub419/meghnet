"""
MeghNet - Disaster Alert System
Rule-based + AI alert generation with severity scoring
"""

from datetime import datetime
from typing import Optional

# ── Alert severity levels ──────────────────────────────────────────────────────
SEVERITY = {
    "CRITICAL": {"color": "#ef4444", "emoji": "🆘", "priority": 4},
    "HIGH":     {"color": "#f97316", "emoji": "🚨", "priority": 3},
    "MEDIUM":   {"color": "#eab308", "emoji": "⚠️",  "priority": 2},
    "LOW":      {"color": "#22c55e", "emoji": "ℹ️",  "priority": 1},
}

# ── Rule-based alert engine ────────────────────────────────────────────────────
def generate_alerts(weather: dict, forecast: list, location: str) -> list[dict]:
    """
    Checks weather data against disaster thresholds.
    Returns list of alert dicts sorted by severity.
    """
    alerts = []
    cur = weather.get("current", {})
    daily = weather.get("daily", {})

    temp        = cur.get("temperature_2m", 0)
    humidity    = cur.get("relative_humidity_2m", 0)
    precip      = cur.get("precipitation", 0)
    wind        = cur.get("wind_speed_10m", 0)
    pressure    = cur.get("surface_pressure", 1013)
    cloud       = cur.get("cloud_cover", 0)
    wcode       = cur.get("weather_code", 0)
    soil_moist  = cur.get("soil_moisture_0_to_1cm", 0)

    daily_rain  = daily.get("precipitation_sum", [0])[0] or 0
    daily_wind  = daily.get("wind_speed_10m_max", [0])[0] or 0
    rain_prob   = daily.get("precipitation_probability_max", [0])[0] or 0
    uv          = daily.get("uv_index_max", [0])[0] or 0

    # ── Cyclone / Severe storm ──
    if wcode in [95, 96, 99]:
        alerts.append({
            "id": "thunderstorm",
            "severity": "CRITICAL" if wcode in [96, 99] else "HIGH",
            "type": "Severe Thunderstorm",
            "emoji": "⛈️",
            "title": "Severe Thunderstorm Active",
            "message": f"Thunderstorm{'with hail' if wcode in [96,99] else ''} detected over {location}. Stay indoors, avoid open areas and tall trees.",
            "action": "Seek shelter immediately. Keep emergency kit ready.",
            "expires_in": "2-4 hours",
        })

    # ── Extreme heat ──
    if temp >= 45:
        alerts.append({
            "id": "extreme_heat",
            "severity": "CRITICAL",
            "type": "Extreme Heat Warning",
            "emoji": "🌡️",
            "title": f"Extreme Heat Alert — {temp}°C",
            "message": f"Temperature has reached {temp}°C in {location}. Dangerous heat conditions. Risk of heatstroke.",
            "action": "Stay indoors 11AM–4PM. Drink water every 30 mins. Never leave children or animals in vehicles.",
            "expires_in": "Until evening",
        })
    elif temp >= 40:
        alerts.append({
            "id": "heat_warning",
            "severity": "HIGH",
            "type": "Heat Warning",
            "emoji": "☀️",
            "title": f"Heat Warning — {temp}°C",
            "message": f"High temperature of {temp}°C recorded. Vulnerable people (elderly, children) at risk.",
            "action": "Limit outdoor activity. Stay hydrated. Check on elderly neighbours.",
            "expires_in": "Rest of the day",
        })

    # ── Heavy rainfall / Flood risk ──
    if daily_rain >= 50 or precip >= 10:
        alerts.append({
            "id": "flood_risk",
            "severity": "CRITICAL" if daily_rain >= 100 else "HIGH",
            "type": "Flood Risk",
            "emoji": "🌊",
            "title": f"Flood Risk — {daily_rain}mm Expected",
            "message": f"Heavy rainfall of {daily_rain}mm expected today in {location}. Low-lying areas and riverbanks at risk of flooding.",
            "action": "Avoid river crossings. Move valuables to higher ground. Keep emergency contacts ready.",
            "expires_in": "Next 24 hours",
        })
    elif daily_rain >= 20 or rain_prob >= 80:
        alerts.append({
            "id": "heavy_rain",
            "severity": "MEDIUM",
            "type": "Heavy Rain Advisory",
            "emoji": "🌧️",
            "title": f"Heavy Rain Advisory — {rain_prob}% chance",
            "message": f"Significant rainfall expected ({daily_rain}mm, {rain_prob}% probability). Waterlogging possible in low areas.",
            "action": "Carry rain protection. Avoid waterlogged roads. Secure loose outdoor items.",
            "expires_in": "Next 12 hours",
        })

    # ── Strong winds ──
    if daily_wind >= 80 or wind >= 60:
        alerts.append({
            "id": "strong_wind",
            "severity": "HIGH" if daily_wind >= 80 else "MEDIUM",
            "type": "Strong Wind Warning",
            "emoji": "💨",
            "title": f"Strong Wind Warning — {max(wind, daily_wind):.0f} km/h",
            "message": f"Dangerous wind speeds of {max(wind, daily_wind):.0f} km/h recorded/expected. Risk of structural damage and falling trees.",
            "action": "Secure loose objects. Avoid weak structures. Stay away from trees.",
            "expires_in": "Next 6 hours",
        })
    elif daily_wind >= 50:
        alerts.append({
            "id": "wind_advisory",
            "severity": "LOW",
            "type": "Wind Advisory",
            "emoji": "🌬️",
            "title": f"Wind Advisory — {daily_wind:.0f} km/h",
            "message": f"Moderately strong winds of {daily_wind:.0f} km/h expected. Minor disruptions possible.",
            "action": "Secure outdoor furniture. Be cautious while driving on highways.",
            "expires_in": "Rest of the day",
        })

    # ── High UV ──
    if uv >= 8:
        alerts.append({
            "id": "uv_warning",
            "severity": "HIGH" if uv >= 10 else "MEDIUM",
            "type": "UV Index Warning",
            "emoji": "☀️",
            "title": f"High UV Alert — Index {uv}",
            "message": f"UV index of {uv} is {'extreme' if uv>=10 else 'very high'}. Risk of sunburn within {'10' if uv>=10 else '20'} minutes of exposure.",
            "action": "Apply SPF 50+ sunscreen. Wear hat and full sleeves. Avoid direct sun 10AM–3PM.",
            "expires_in": "Daytime hours",
        })

    # ── Low pressure / Cyclone watch ──
    if pressure < 990:
        alerts.append({
            "id": "low_pressure",
            "severity": "CRITICAL" if pressure < 970 else "HIGH",
            "type": "Cyclone Watch",
            "emoji": "🌀",
            "title": f"Low Pressure System — {pressure:.0f} hPa",
            "message": f"Very low atmospheric pressure of {pressure:.0f} hPa indicates possible cyclonic activity near {location}.",
            "action": "Monitor official NDMA/IMD bulletins. Prepare emergency kit. Do not ignore official evacuation orders.",
            "expires_in": "Monitor continuously",
        })

    # ── Dense fog ──
    if wcode in [45, 48] or (humidity >= 95 and cloud >= 90):
        alerts.append({
            "id": "fog",
            "severity": "MEDIUM",
            "type": "Dense Fog Advisory",
            "emoji": "🌫️",
            "title": "Dense Fog Advisory",
            "message": f"Dense fog conditions in {location}. Visibility severely reduced. Road and air travel disruptions expected.",
            "action": "Use fog lights. Reduce speed. Keep safe following distance. Avoid highway travel if possible.",
            "expires_in": "Until mid-morning",
        })

    # ── Cold wave ──
    if temp <= 5:
        alerts.append({
            "id": "cold_wave",
            "severity": "HIGH" if temp <= 2 else "MEDIUM",
            "type": "Cold Wave Warning",
            "emoji": "🥶",
            "title": f"Cold Wave — {temp}°C",
            "message": f"Temperature has dropped to {temp}°C in {location}. Risk of hypothermia for vulnerable populations.",
            "action": "Wear warm layers. Check on elderly relatives. Protect crops from frost damage.",
            "expires_in": "Until morning",
        })

    # ── Soil saturation / Landslide risk ──
    if soil_moist and soil_moist > 0.4 and daily_rain >= 20:
        alerts.append({
            "id": "landslide",
            "severity": "HIGH",
            "type": "Landslide Risk",
            "emoji": "⛰️",
            "title": "Landslide Risk in Hilly Areas",
            "message": f"High soil moisture ({soil_moist:.2f} m³/m³) combined with {daily_rain}mm rainfall increases landslide risk on slopes.",
            "action": "Avoid hilly roads. Stay away from slope bases. Evacuate if official advisory issued.",
            "expires_in": "Next 24 hours",
        })

    # Sort by severity priority (highest first)
    priority = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
    alerts.sort(key=lambda x: priority.get(x["severity"], 0), reverse=True)

    return alerts


def get_overall_alert_level(alerts: list) -> str:
    """Returns the highest severity from all alerts"""
    if not alerts:
        return "NONE"
    priority = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "NONE": 0}
    return max(alerts, key=lambda x: priority.get(x["severity"], 0))["severity"]


def format_alerts_for_response(alerts: list) -> list[str]:
    """Simple string list for backward compatibility"""
    return [f"{a['emoji']} {a['title']}: {a['message']}" for a in alerts]

# MeghNet 🌤️
### AI Climate Intelligence & Decision Support Platform
**ISRO Bharatiya Antariksh Hackathon 2026 — Team MeghNet**

---

## What this does
Takes a location (lat/lon) → fetches live weather from Open-Meteo (free) + NASA POWER API (free) → runs Gemini AI to produce a risk assessment, plain-language summary, and actionable recommendations → caches the result locally for offline use.

---

## Setup (one-time)

### Step 1 — Get your FREE Gemini API key
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Step 2 — Set your API key
```bash
# In the meghnet/ folder, copy the example env file
cp .env.example .env

# Open .env in any text editor and paste your key:
# GEMINI_API_KEY=AIzaSy...your key here...
```

### Step 3 — Install Python dependencies
```bash
# Make sure Python 3.10+ is installed
python --version

# Go to the backend folder
cd backend

# Install required packages
pip install -r requirements.txt
```

### Step 4 — Run the server
```bash
# From the backend/ folder:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5 — Open the app
Open your browser and go to: http://localhost:8000

---

## Project Structure
```
meghnet/
├── .env.example          ← Copy to .env and add your Gemini key
├── README.md
├── backend/
│   ├── main.py           ← FastAPI app — all backend logic
│   └── requirements.txt  ← Python dependencies
└── frontend/
    ├── templates/
    │   └── index.html    ← Main UI
    └── static/
        ├── css/style.css ← Styling
        └── js/app.js     ← Frontend logic + offline caching
```

---

## APIs Used (all FREE)
| API | What it provides | Cost |
|-----|-----------------|------|
| Open-Meteo | Current weather + 3-day forecast | Free, no key |
| NASA POWER | Solar radiation + climate history | Free, no key |
| Gemini 1.5 Flash | AI risk analysis + recommendations | Free tier |

---

## What to build next (Phase 2)

- [ ] **Database** — Save analysis history with Supabase (free PostgreSQL)
- [ ] **Second AI agent** — Separate agent specialized for disaster predictions
- [ ] **Map view** — Show risk level on a Leaflet.js map
- [ ] **Farmer mode** — Deeper crop advisory with planting calendars
- [ ] **User accounts** — Firebase Auth so users can save their locations
- [ ] **SMS alerts** — Twilio integration for critical alerts in offline areas
- [ ] **PWA** — Add service worker for true app-like offline experience

---

## For the hackathon demo
1. Open the app in browser
2. Enter Nagpur coordinates (pre-filled) or use "My Location"
3. Select user type (try "Farmer" for extra advice)
4. Click Analyze — see live risk analysis in ~3-5 seconds
5. Turn off WiFi → refresh → it loads the cached result (offline demo)

---

## Team
- Vedant R Thamke (Leader) — WCEM Nagpur
- Om P Bharsakle — KDKCE Nagpur  
- Parth Doharkar — KDKCE Nagpur

-- Run this in Supabase → SQL Editor → New Query → Run

CREATE TABLE IF NOT EXISTS analyses (
  id                  BIGSERIAL PRIMARY KEY,
  location_name       TEXT,
  latitude            DECIMAL(9,4),
  longitude           DECIMAL(9,4),
  user_type           TEXT DEFAULT 'general',
  crop_type           TEXT,
  risk_level          TEXT,
  risk_color          TEXT,
  summary             TEXT,
  temperature         DECIMAL(5,2),
  humidity            INTEGER,
  wind_speed          DECIMAL(6,2),
  precipitation       DECIMAL(6,2),
  weather_desc        TEXT,
  recommendations     JSONB DEFAULT '[]',
  disaster_alerts     JSONB DEFAULT '[]',
  has_farmer_advisory BOOLEAN DEFAULT false,
  analyzed_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast location queries
CREATE INDEX IF NOT EXISTS idx_analyses_location ON analyses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_analyses_time     ON analyses(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_risk     ON analyses(risk_level);

-- Allow public read/write (for the free tier anon key)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON analyses FOR ALL USING (true) WITH CHECK (true);

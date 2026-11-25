-- ==============================================================================
-- HAZEM KHALED PORTFOLIO - VISITOR TRACKING & ANALYTICS SCHEMA
-- Database: PostgreSQL / Supabase
-- Target Timezone: Africa/Tunis
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing table if needed (safe recreate)
-- DROP TABLE IF EXISTS visits CASCADE;

-- 3. Main Visits & Sessions Table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,                                -- Anonymous persistent ID (e.g. v_abcdef123)
  session_id TEXT NOT NULL,                                -- Current session ID (e.g. s_987654321)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),           -- First visit / session start timestamp
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),         -- Last activity timestamp (heartbeat)
  session_duration_seconds INTEGER NOT NULL DEFAULT 0,     -- Calculated time spent on portfolio
  
  -- Geographic Data (Vercel Edge headers + fallback)
  country TEXT DEFAULT 'Inconnu',
  country_code TEXT DEFAULT 'XX',
  city TEXT DEFAULT 'Inconnue',
  region TEXT DEFAULT '',
  timezone TEXT DEFAULT 'Africa/Tunis',
  
  -- Technical & Device Data
  device_type TEXT DEFAULT 'desktop',                      -- 'desktop', 'mobile', 'tablet'
  browser TEXT DEFAULT 'Autre',                            -- 'Chrome', 'Safari', 'Firefox', 'Edge', etc.
  os TEXT DEFAULT 'Autre',                                 -- 'Windows', 'iOS', 'Android', 'macOS', 'Linux'
  screen_resolution TEXT DEFAULT '',                       -- e.g. '1920x1080'
  language TEXT DEFAULT 'fr',                              -- e.g. 'fr-FR', 'ar-TN', 'en-US'
  user_agent TEXT DEFAULT '',
  
  -- Navigation & Traffic Source
  referrer TEXT DEFAULT 'Direct',                          -- Full referrer URL or 'Direct'
  referrer_domain TEXT DEFAULT 'Direct',                   -- e.g. 'linkedin.com', 'github.com', 'google.com'
  landing_page TEXT DEFAULT '/',
  pages_visited JSONB NOT NULL DEFAULT '["/"]'::jsonb,     -- Array of visited sections: ['#accueil', '#projets', etc.]
  
  -- Bot Detection & Email Notification Tracking
  is_bot BOOLEAN NOT NULL DEFAULT FALSE,
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,        -- True when new visit email was dispatched
  
  -- Voluntary Contact Association (Only filled if visitor voluntarily sends message)
  contact_name TEXT,
  contact_email TEXT,
  contact_subject TEXT,
  contact_message TEXT,
  contact_submitted_at TIMESTAMPTZ
);

-- 4. High-Performance Indexes for Dashboard Analytics
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON visits (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_session_id ON visits (session_id);
CREATE INDEX IF NOT EXISTS idx_visits_country ON visits (country);
CREATE INDEX IF NOT EXISTS idx_visits_country_code ON visits (country_code);
CREATE INDEX IF NOT EXISTS idx_visits_device_type ON visits (device_type);
CREATE INDEX IF NOT EXISTS idx_visits_referrer_domain ON visits (referrer_domain);
CREATE INDEX IF NOT EXISTS idx_visits_is_bot ON visits (is_bot);
CREATE INDEX IF NOT EXISTS idx_visits_contact_email ON visits (contact_email) WHERE contact_email IS NOT NULL;

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow Server-Side API (using service_role key) full access
DROP POLICY IF EXISTS "Service role has full access" ON visits;
CREATE POLICY "Service role has full access"
  ON visits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous inserts only via API with rate limiting
-- Public client anon key has no direct read access to preserve visitors' privacy
DROP POLICY IF EXISTS "Deny direct public read access" ON visits;
CREATE POLICY "Deny direct public read access"
  ON visits
  FOR SELECT
  TO anon
  USING (false);

-- 6. Helper Function: Calculate Analytics Summary (Tunis Timezone)
CREATE OR REPLACE FUNCTION get_analytics_overview(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_visits', COUNT(*),
    'unique_visitors', COUNT(DISTINCT visitor_id),
    'unique_countries', COUNT(DISTINCT country_code) FILTER (WHERE country_code != 'XX'),
    'contact_leads', COUNT(*) FILTER (WHERE contact_email IS NOT NULL),
    'avg_duration_seconds', COALESCE(ROUND(AVG(session_duration_seconds)), 0),
    'mobile_count', COUNT(*) FILTER (WHERE device_type = 'mobile'),
    'desktop_count', COUNT(*) FILTER (WHERE device_type = 'desktop'),
    'tablet_count', COUNT(*) FILTER (WHERE device_type = 'tablet'),
    'direct_count', COUNT(*) FILTER (WHERE referrer_domain = 'Direct'),
    'social_count', COUNT(*) FILTER (WHERE referrer_domain IN ('linkedin.com', 'github.com', 'twitter.com', 'facebook.com', 'instagram.com'))
  )
  INTO result
  FROM visits
  WHERE is_bot = FALSE
    AND created_at >= start_date
    AND created_at <= end_date;
    
  RETURN result;
END;
$$;

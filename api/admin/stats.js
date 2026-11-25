import { verifyAdminRequest } from '../_lib/auth.js';
import { fetchVisits, isSupabaseConfigured } from '../_lib/supabase.js';
import { getCountryFlag } from '../_lib/mailer.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Authenticate request
  const auth = verifyAdminRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
  }

  const { range = '7d', customStart, customEnd } = req.query;

  // 2. Compute date boundaries in Africa/Tunis
  const now = new Date();
  let startDate = null;
  const endDate = customEnd ? new Date(customEnd).toISOString() : now.toISOString();

  if (range === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today.toISOString();
  } else if (range === '7d') {
    const d7 = new Date();
    d7.setDate(d7.getDate() - 7);
    startDate = d7.toISOString();
  } else if (range === '30d') {
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    startDate = d30.toISOString();
  } else if (customStart) {
    startDate = new Date(customStart).toISOString();
  }

  // 3. Fetch visits from Supabase
  const { data: visits, error } = await fetchVisits({
    startDate,
    endDate,
    limit: 1000,
    excludeBots: true
  });

  if (!isSupabaseConfigured()) {
    return res.status(200).json({
      configured: false,
      message: 'Supabase n’est pas encore configuré avec vos clés d’API. Veuillez suivre le guide de configuration.',
      summary: {
        totalVisits: 0,
        uniqueVisitors: 0,
        activeSessions: 0,
        contactLeads: 0,
        avgDurationSeconds: 0
      },
      charts: { daily: [], countries: [], devices: [], referrers: [], pages: [] },
      visits: []
    });
  }

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des données', details: error });
  }

  // 4. Compute Analytics & Statistics
  const totalVisits = visits.length;
  const uniqueVisitorIds = new Set(visits.map((v) => v.visitor_id));
  const uniqueVisitors = uniqueVisitorIds.size;

  // Active sessions in the last 15 minutes
  const activeThreshold = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const activeSessions = visits.filter((v) => v.last_seen_at && v.last_seen_at >= activeThreshold).length;

  // Contact leads (voluntary submission)
  const contactLeads = visits.filter((v) => v.contact_email);

  // Average session duration
  const totalDuration = visits.reduce((acc, v) => acc + (v.session_duration_seconds || 0), 0);
  const avgDurationSeconds = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;

  // Daily timeline breakdown for chart
  const dailyMap = new Map();
  visits.forEach((v) => {
    const day = v.created_at ? v.created_at.slice(0, 10) : 'Autre';
    const entry = dailyMap.get(day) || { date: day, visits: 0, uniqueSet: new Set() };
    entry.visits += 1;
    entry.uniqueSet.add(v.visitor_id);
    dailyMap.set(day, entry);
  });

  const dailyChart = Array.from(dailyMap.values())
    .map((item) => ({
      date: item.date,
      visits: item.visits,
      unique: item.uniqueSet.size
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Geographic distribution
  const countryMap = new Map();
  visits.forEach((v) => {
    const code = v.country_code || 'XX';
    const name = v.country || 'Inconnu';
    const entry = countryMap.get(code) || {
      code,
      country: name,
      flag: getCountryFlag(code),
      count: 0
    };
    entry.count += 1;
    countryMap.set(code, entry);
  });

  const countriesBreakdown = Array.from(countryMap.values())
    .map((item) => ({
      ...item,
      percentage: totalVisits > 0 ? Math.round((item.count / totalVisits) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown
  const deviceMap = { desktop: 0, mobile: 0, tablet: 0 };
  visits.forEach((v) => {
    const dev = v.device_type || 'desktop';
    if (deviceMap[dev] !== undefined) {
      deviceMap[dev] += 1;
    } else {
      deviceMap.desktop += 1;
    }
  });

  // OS & Browser breakdown
  const osMap = new Map();
  const browserMap = new Map();
  visits.forEach((v) => {
    const os = v.os || 'Autre';
    osMap.set(os, (osMap.get(os) || 0) + 1);
    const br = v.browser || 'Autre';
    browserMap.set(br, (browserMap.get(br) || 0) + 1);
  });

  // Referrers breakdown
  const refMap = new Map();
  visits.forEach((v) => {
    const dom = v.referrer_domain || 'Direct';
    refMap.set(dom, (refMap.get(dom) || 0) + 1);
  });
  const referrersBreakdown = Array.from(refMap.entries())
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Most Visited Sections
  const pagesMap = new Map();
  visits.forEach((v) => {
    const pages = Array.isArray(v.pages_visited) ? v.pages_visited : [v.landing_page || '/'];
    pages.forEach((p) => {
      pagesMap.set(p, (pagesMap.get(p) || 0) + 1);
    });
  });
  const pagesBreakdown = Array.from(pagesMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return res.status(200).json({
    configured: true,
    timezone: 'Africa/Tunis',
    range,
    summary: {
      totalVisits,
      uniqueVisitors,
      activeSessions,
      contactLeads: contactLeads.length,
      avgDurationSeconds
    },
    charts: {
      daily: dailyChart,
      countries: countriesBreakdown,
      devices: deviceMap,
      os: Array.from(osMap.entries()).map(([name, count]) => ({ name, count })),
      browsers: Array.from(browserMap.entries()).map(([name, count]) => ({ name, count })),
      referrers: referrersBreakdown,
      pages: pagesBreakdown
    },
    leads: contactLeads.slice(0, 50),
    visits: visits.slice(0, 150)
  });
}

import { insertVisit, updateVisitSession } from './_lib/supabase.js';
import { sendVisitNotification } from './_lib/mailer.js';
import { isBot } from './_lib/botDetector.js';

// Cache to prevent duplicate email notifications for the same session
const notifiedSessions = new Set();

// Simple in-memory rate limiter per IP (max 60 hits/minute)
const ipRateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRateLimits.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 60000;
  }
  record.count += 1;
  ipRateLimits.set(ip, record);
  return record.count > 60;
}

// User-Agent Parsing Helpers
function parseDeviceType(ua) {
  if (!ua) return 'desktop';
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(lower)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(lower)) return 'mobile';
  return 'desktop';
}

function parseBrowser(ua) {
  if (!ua) return 'Autre';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  return 'Autre';
}

function parseOS(ua) {
  if (!ua) return 'Autre';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Autre';
}

function parseReferrerDomain(referrer) {
  if (!referrer || referrer === 'Direct') return 'Direct';
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Autre';
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      action = 'init',
      visitorId,
      sessionId,
      pathname = '/',
      hash = '',
      referrer = 'Direct',
      screenResolution = '',
      language = 'fr',
      timezone = 'Africa/Tunis',
      durationSeconds = 0,
      contact = null
    } = body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: 'Missing visitorId or sessionId' });
    }

    const userAgent = req.headers['user-agent'] || '';
    const botDetected = isBot(userAgent);

    // 1. Geolocation from Vercel Edge Headers
    const countryCode = req.headers['x-vercel-ip-country'] || 'XX';
    let country = countryCode !== 'XX' ? countryCode : 'Inconnu';
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Inconnue';
    const region = req.headers['x-vercel-ip-country-region'] ? decodeURIComponent(req.headers['x-vercel-ip-country-region']) : '';

    // Country code to friendly French names mapping for top regions
    const countryNames = {
      TN: 'Tunisie', FR: 'France', US: 'États-Unis', DE: 'Allemagne',
      CA: 'Canada', GB: 'Royaume-Uni', IT: 'Italie', ES: 'Espagne',
      BE: 'Belgique', CH: 'Suisse', MA: 'Maroc', DZ: 'Algérie',
      SA: 'Arabie Saoudite', AE: 'Émirats Arabes Unis', QA: 'Qatar'
    };
    if (countryNames[countryCode]) {
      country = countryNames[countryCode];
    }

    // 2. Action: Init / New Session
    if (action === 'init') {
      const visitRecord = {
        visitor_id: visitorId,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        session_duration_seconds: 0,
        country,
        country_code: countryCode,
        city,
        region,
        timezone: timezone || 'Africa/Tunis',
        device_type: parseDeviceType(userAgent),
        browser: parseBrowser(userAgent),
        os: parseOS(userAgent),
        screen_resolution: screenResolution,
        language,
        user_agent: userAgent.slice(0, 500),
        referrer: referrer || 'Direct',
        referrer_domain: parseReferrerDomain(referrer),
        landing_page: pathname + hash,
        pages_visited: [pathname + hash],
        is_bot: botDetected,
        notification_sent: false
      };

      // Insert into database
      await insertVisit(visitRecord);

      // Trigger instant email notification if not already notified for this session
      if (!botDetected && !notifiedSessions.has(sessionId)) {
        notifiedSessions.add(sessionId);
        // Clean old cache entries if it grows too large
        if (notifiedSessions.size > 2000) {
          notifiedSessions.clear();
        }
        // Send email asynchronously in background
        sendVisitNotification(visitRecord).catch((err) =>
          console.error('[Notification dispatch error]', err)
        );
      }

      return res.status(200).json({ success: true, status: 'initialized' });
    }

    // 3. Action: Heartbeat (update session duration)
    if (action === 'heartbeat') {
      await updateVisitSession(sessionId, {
        last_seen_at: new Date().toISOString(),
        session_duration_seconds: Math.max(0, parseInt(durationSeconds, 10) || 0)
      });
      return res.status(200).json({ success: true, status: 'heartbeat_updated' });
    }

    // 4. Action: Navigate (record section/page navigation)
    if (action === 'navigate') {
      const pageNav = pathname + hash;
      await updateVisitSession(sessionId, {
        last_seen_at: new Date().toISOString(),
        pages_visited: [pageNav]
      });
      return res.status(200).json({ success: true, status: 'navigation_recorded' });
    }

    // 5. Action: Contact Form Submission Link (Voluntary Identity Association)
    if (action === 'contact_submit' && contact) {
      await updateVisitSession(sessionId, {
        contact_name: contact.name || '',
        contact_email: contact.email || '',
        contact_subject: contact.subject || '',
        contact_message: contact.message || '',
        contact_submitted_at: new Date().toISOString()
      });
      return res.status(200).json({ success: true, status: 'lead_associated' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[API /api/track error]', err);
    return res.status(500).json({ error: 'Internal tracking error', details: err.message });
  }
}

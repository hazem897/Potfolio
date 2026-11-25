/**
 * Supabase REST Client
 * Connects directly to Supabase PostgREST API with zero cold-start delay
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

function getHeaders(customHeaders = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...customHeaders
  };
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/**
 * Insert a new visit record into Supabase
 */
export async function insertVisit(visitData) {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Not configured. Visit data:', visitData.visitor_id);
    return { data: visitData, error: null };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: 'POST',
      headers: getHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(visitData)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Supabase insertVisit error]', res.status, errText);
      return { data: null, error: errText };
    }

    const data = await res.json();
    return { data: data[0] || data, error: null };
  } catch (err) {
    console.error('[Supabase insertVisit exception]', err);
    return { data: null, error: err.message };
  }
}

/**
 * Update an existing session (heartbeat, duration, navigation pages, contact info)
 */
export async function updateVisitSession(sessionId, updateData) {
  if (!isSupabaseConfigured()) {
    return { data: updateData, error: null };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/visits?session_id=eq.${encodeURIComponent(sessionId)}`,
      {
        method: 'PATCH',
        headers: getHeaders({ Prefer: 'return=representation' }),
        body: JSON.stringify(updateData)
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: errText };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Fetch visits for the Admin Dashboard with date filters
 */
export async function fetchVisits({ startDate, endDate, limit = 200, excludeBots = true }) {
  if (!isSupabaseConfigured()) {
    return { data: [], error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    let queryUrl = `${SUPABASE_URL}/rest/v1/visits?select=*&order=created_at.desc&limit=${limit}`;

    if (startDate) {
      queryUrl += `&created_at=gte.${encodeURIComponent(startDate)}`;
    }
    if (endDate) {
      queryUrl += `&created_at=lte.${encodeURIComponent(endDate)}`;
    }
    if (excludeBots) {
      queryUrl += `&is_bot=eq.false`;
    }

    const res = await fetch(queryUrl, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: [], error: errText };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

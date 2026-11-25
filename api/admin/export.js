import { verifyAdminRequest } from '../_lib/auth.js';
import { fetchVisits } from '../_lib/supabase.js';
import { formatTunisDate } from '../_lib/mailer.js';

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify Admin Auth
  const auth = verifyAdminRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  const { range = 'all' } = req.query;

  let startDate = null;
  const now = new Date();
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
  }

  const { data: visits } = await fetchVisits({
    startDate,
    limit: 5000,
    excludeBots: true
  });

  const headers = [
    'ID Session',
    'ID Visiteur',
    'Date & Heure (Afrique/Tunis)',
    'Pays',
    'Code Pays',
    'Ville',
    'Région',
    'Appareil',
    'Système (OS)',
    'Navigateur',
    'Résolution Écran',
    'Source Référente',
    'Domaine Provenance',
    'Pages & Sections Visitées',
    'Durée Session (secondes)',
    'Nom Contact Volontaire',
    'Email Contact Volontaire',
    'Sujet Contact Volontaire'
  ];

  const rows = (visits || []).map((v) => {
    const pages = Array.isArray(v.pages_visited) ? v.pages_visited.join(' > ') : (v.landing_page || '/');
    return [
      escapeCsvField(v.session_id),
      escapeCsvField(v.visitor_id),
      escapeCsvField(formatTunisDate(v.created_at)),
      escapeCsvField(v.country),
      escapeCsvField(v.country_code),
      escapeCsvField(v.city),
      escapeCsvField(v.region),
      escapeCsvField(v.device_type),
      escapeCsvField(v.os),
      escapeCsvField(v.browser),
      escapeCsvField(v.screen_resolution),
      escapeCsvField(v.referrer),
      escapeCsvField(v.referrer_domain),
      escapeCsvField(pages),
      escapeCsvField(v.session_duration_seconds),
      escapeCsvField(v.contact_name),
      escapeCsvField(v.contact_email),
      escapeCsvField(v.contact_subject)
    ].join(',');
  });

  // UTF-8 BOM to ensure proper character rendering in Excel
  const csvContent = '\uFEFF' + [headers.map(escapeCsvField).join(','), ...rows].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="hazem-portfolio-visiteurs-${range}-${Date.now()}.csv"`
  );

  return res.status(200).send(csvContent);
}

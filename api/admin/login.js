import {
  checkLoginRateLimit,
  recordFailedLogin,
  clearFailedLogin,
  validateAdminPassword,
  generateAdminToken
} from '../_lib/auth.js';

export default async function handler(req, res) {
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

  // Rate limiting check
  const rateLimitCheck = checkLoginRateLimit(clientIp);
  if (!rateLimitCheck.allowed) {
    return res.status(429).json({ error: rateLimitCheck.error });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { password } = body;

    if (!password) {
      return res.status(400).json({ error: 'Mot de passe requis' });
    }

    const isValid = validateAdminPassword(password);

    if (!isValid) {
      recordFailedLogin(clientIp);
      return res.status(401).json({ error: 'Mot de passe administrateur incorrect' });
    }

    // Success: clear rate limit and issue token
    clearFailedLogin(clientIp);
    const token = generateAdminToken();

    return res.status(200).json({
      success: true,
      token,
      expiresIn: 7 * 24 * 60 * 60 // 7 days
    });
  } catch (err) {
    console.error('[API /api/admin/login error]', err);
    return res.status(500).json({ error: 'Erreur serveur d’authentification' });
  }
}

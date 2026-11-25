import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hazem2026admin';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'hazem-portfolio-secret-key-2026';

// In-memory rate limiting for login attempts
const failedAttempts = new Map(); // ip -> { count, lockedUntil }

export function checkLoginRateLimit(ip) {
  const record = failedAttempts.get(ip);
  if (!record) return { allowed: true };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return {
      allowed: false,
      error: `Trop de tentatives. Veuillez réessayer dans ${minutesLeft} minute(s).`
    };
  }
  return { allowed: true };
}

export function recordFailedLogin(ip) {
  const record = failedAttempts.get(ip) || { count: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
  }
  failedAttempts.set(ip, record);
}

export function clearFailedLogin(ip) {
  failedAttempts.delete(ip);
}

/**
 * Sign an admin session token (HMAC-SHA256 signed payload, 7 days validity)
 */
export function generateAdminToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      iat: Math.floor(Date.now() / 1000)
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify an admin session token
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) {
      return false; // Token expired
    }
    return data.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Validate incoming password against ADMIN_PASSWORD
 */
export function validateAdminPassword(inputPassword) {
  if (!inputPassword || typeof inputPassword !== 'string') return false;
  const inputBuffer = Buffer.from(inputPassword.trim());
  const expectedBuffer = Buffer.from(ADMIN_PASSWORD.trim());
  if (inputBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

/**
 * Extract and verify token from request
 */
export function verifyAdminRequest(req) {
  const authHeader = req.headers.authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = req.headers['x-admin-token'];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  const isValid = verifyAdminToken(token);
  return { authenticated: isValid };
}

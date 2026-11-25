/**
 * Email Notification Dispatcher
 * Sends instant notifications for new portfolio visits to hazemhazem9089@gmail.com
 * Formatted in Africa/Tunis timezone
 */

const TARGET_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'hazemhazem9089@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * Format a Date object to Africa/Tunis timezone string
 */
export function formatTunisDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('fr-TN', {
      timeZone: 'Africa/Tunis',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date(date));
  } catch {
    return new Date(date).toLocaleString('fr-FR');
  }
}

/**
 * Build Flag emoji from 2-letter country code (e.g. TN -> 🇹🇳)
 */
export function getCountryFlag(countryCode = '') {
  if (!countryCode || countryCode.length !== 2 || countryCode === 'XX') return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Build rich HTML email template matching Hazem's Dark Navy & Turquoise Identity
 */
function buildVisitEmailHtml(visit) {
  const tunisTime = formatTunisDate(visit.created_at || new Date());
  const flag = getCountryFlag(visit.country_code);
  const locationStr = `${flag} ${visit.country || 'Pays inconnu'}${
    visit.city && visit.city !== 'Inconnue' ? ` (${visit.city})` : ''
  }`;
  const deviceStr = `${visit.device_type === 'mobile' ? '📱 Mobile' : visit.device_type === 'tablet' ? '📟 Tablette' : '💻 Ordinateur'} — ${visit.os || 'OS inconnu'} / ${visit.browser || 'Navigateur'}`;
  const referrerStr = visit.referrer && visit.referrer !== 'Direct' ? visit.referrer : 'Visite Directe (aucun lien externe)';
  const pages = Array.isArray(visit.pages_visited) ? visit.pages_visited.join(' → ') : (visit.landing_page || '/');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Visite Détectée</title>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #040811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #040811;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #080f1d; border-radius: 14px; overflow: hidden; border: 1px solid rgba(45, 212, 191, 0.35); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #091322 0%, #0d1e38 100%); padding: 22px 26px; border-bottom: 2px solid #2dd4bf;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="100" valign="middle" style="font-family: monospace; font-size: 24px; font-weight: 800; color: #ffffff;">
                    HK <span style="color: #2dd4bf;">&lt;/&gt;</span>
                  </td>
                  <td valign="middle" style="padding-left: 16px; border-left: 1px solid rgba(45, 212, 191, 0.3);">
                    <div style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px;">
                      🔔 Nouvelle Visite sur votre Portfolio
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                      ${tunisTime} (Heure de Tunis)
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px 26px;">
              
              <!-- Location Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d1728; border: 1px solid rgba(45, 212, 191, 0.22); border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2dd4bf; letter-spacing: 0.08em; margin-bottom: 6px;">
                      📍 Localisation Géographique
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: #ffffff;">
                      ${locationStr}
                    </div>
                    ${visit.region ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">Région : ${visit.region}</div>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Tech & Device Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d1728; border: 1px solid rgba(45, 212, 191, 0.22); border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2dd4bf; letter-spacing: 0.08em; margin-bottom: 6px;">
                      💻 Appareil & Système
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #ffffff;">
                      ${deviceStr}
                    </div>
                    ${visit.screen_resolution ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">Résolution : ${visit.screen_resolution} · Langue : ${visit.language || 'Non spécifiée'}</div>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Source & Pages Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d1728; border: 1px solid rgba(45, 212, 191, 0.22); border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2dd4bf; letter-spacing: 0.08em; margin-bottom: 6px;">
                      🔗 Source du Trafic & Navigation
                    </div>
                    <div style="font-size: 13.5px; color: #ffffff; word-break: break-all;">
                      <strong>Provenance :</strong> ${referrerStr}
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
                      <strong>Parcours :</strong> ${pages}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Voluntary Contact Details if any -->
              ${visit.contact_email ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(45, 212, 191, 0.08); border: 1px solid #2dd4bf; border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2dd4bf; letter-spacing: 0.08em; margin-bottom: 6px;">
                      ✉️ Lead Identifié (Formulaire Contact Soumis)
                    </div>
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">
                      ${visit.contact_name || ''} &lt;${visit.contact_email}&gt;
                    </div>
                    <div style="font-size: 13px; color: #e2e8f0; margin-top: 4px;">
                      <strong>Sujet :</strong> ${visit.contact_subject || ''}
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Action Link -->
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://hazem-khaled-portfolio.vercel.app/admin" style="display: inline-block; padding: 11px 22px; background: linear-gradient(90deg, #2dd4bf 0%, #38bdf8 100%); color: #040811; font-weight: 800; font-size: 13px; text-decoration: none; border-radius: 7px; letter-spacing: 0.03em;">
                  Ouvrir le Tableau de Bord Admin ↗
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #060b14; border-top: 1px solid rgba(45, 212, 191, 0.15); padding: 16px 26px; text-align: center;">
              <div style="font-size: 11.5px; color: #64748b;">
                Système d'Analytics & Tracking Privé · Portfolio Hazem Khaled<br>
                ID Visiteur : <code style="color: #2dd4bf;">${visit.visitor_id || 'v_anon'}</code>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Dispatch visit notification email
 */
export async function sendVisitNotification(visit) {
  // If bot, skip email to prevent inbox spam
  if (visit.is_bot) {
    return { success: false, reason: 'IS_BOT' };
  }

  const subject = `🔔 Nouvelle Visite Portfolio [${getCountryFlag(visit.country_code)} ${visit.country || 'Inconnu'}]`;
  const htmlContent = buildVisitEmailHtml(visit);

  // Method 1: Resend API (Preferred on Vercel)
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Portfolio Analytics <onboarding@resend.dev>',
          to: [TARGET_EMAIL],
          subject,
          html: htmlContent
        })
      });

      if (res.ok) {
        return { success: true, provider: 'resend' };
      }
      const err = await res.text();
      console.warn('[Mailer Resend Error]', err);
    } catch (e) {
      console.warn('[Mailer Resend Exception]', e.message);
    }
  }

  // Method 2: FormSubmit notification fallback (already activated)
  try {
    const tunisTime = formatTunisDate(visit.created_at || new Date());
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        "📅 Date & Heure (Tunis)": tunisTime,
        "📍 Pays & Ville": `${getCountryFlag(visit.country_code)} ${visit.country} (${visit.city || ''})`,
        "💻 Appareil & OS": `${visit.device_type} · ${visit.os} · ${visit.browser}`,
        "🔗 Provenance (Referrer)": visit.referrer || 'Direct',
        "📄 Pages Visitees": Array.isArray(visit.pages_visited) ? visit.pages_visited.join(', ') : visit.landing_page,
        "🆔 Visitor ID": visit.visitor_id,
        _captcha: 'false',
        _template: 'box'
      })
    });

    if (res.ok) {
      return { success: true, provider: 'formsubmit' };
    }
  } catch (err) {
    console.error('[Mailer FormSubmit fallback error]', err);
  }

  return { success: false, reason: 'NO_PROVIDER_AVAILABLE' };
}

/**
 * Bot & Crawler Detection Helper
 */
const KNOWN_BOT_PATTERNS = [
  'bot', 'crawl', 'spider', 'slurp', 'mediapartners', 'lighthouse',
  'headlesschrome', 'phantomjs', 'selenium', 'puppeteer', 'postman',
  'python-requests', 'aiohttp', 'httpx', 'curl', 'wget', 'urllib',
  'googlebot', 'bingbot', 'yandex', 'baiduspider', 'duckduckbot',
  'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot',
  'embedly', 'quora link preview', 'showyoubot', 'outbrain',
  'pinterest', 'slackbot', 'vkshare', 'w3c_validator', 'uptime',
  'pingdom', 'statuscake', 'datadog', 'newrelic', 'vercel-cron'
];

export function isBot(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  const ua = userAgent.toLowerCase();
  return KNOWN_BOT_PATTERNS.some((pattern) => ua.includes(pattern));
}

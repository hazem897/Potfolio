import { useEffect, useRef, useCallback } from 'react';

const VISITOR_ID_KEY = 'hk_visitor_id';
const SESSION_ID_KEY = 'hk_session_id';

function generateRandomId(prefix = 'v') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateRandomId('v');
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return generateRandomId('v');
  }
}

export function getOrCreateSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = generateRandomId('s');
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return generateRandomId('s');
  }
}

/**
 * Send tracking payload to /api/track with fallback to sendBeacon on exit
 */
async function sendTrackingPayload(payload, useBeacon = false) {
  // If user is on admin page, don't pollute visitor analytics with admin's own dashboard views
  if (typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')) {
    return;
  }

  const endpoint = '/api/track';
  const data = JSON.stringify(payload);

  if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    } catch {
      // Fallback to fetch
    }
  }

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      keepalive: true
    });
  } catch {
    // Fail silently so portfolio user experience is never interrupted
  }
}

/**
 * Hook to automatically track visitor session, duration, and navigation
 */
export function useVisitorTracker() {
  const visitorIdRef = useRef('');
  const sessionIdRef = useRef('');
  const startTimeRef = useRef(Date.now());
  const heartbeatTimerRef = useRef(null);
  const pagesVisitedRef = useRef(new Set());

  // Method to associate voluntary contact form submission with the session
  const associateContact = useCallback(async (contactData) => {
    const visitorId = visitorIdRef.current || getOrCreateVisitorId();
    const sessionId = sessionIdRef.current || getOrCreateSessionId();

    await sendTrackingPayload({
      action: 'contact_submit',
      visitorId,
      sessionId,
      contact: {
        name: contactData.name || '',
        email: contactData.email || '',
        subject: contactData.subject || '',
        message: contactData.message || ''
      }
    });
  }, []);

  useEffect(() => {
    // Skip tracking if in admin mode or if user has Do Not Track explicitly set
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    visitorIdRef.current = visitorId;
    sessionIdRef.current = sessionId;

    const currentPath = window.location.pathname;
    const currentHash = window.location.hash || '#accueil';
    const initialPage = currentPath + currentHash;
    pagesVisitedRef.current.add(initialPage);

    // 1. Dispatch initial visit
    sendTrackingPayload({
      action: 'init',
      visitorId,
      sessionId,
      pathname: currentPath,
      hash: currentHash,
      referrer: document.referrer || 'Direct',
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || 'fr',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Tunis'
    });

    // 2. Track section anchor navigation
    const handleHashChange = () => {
      const newPage = window.location.pathname + (window.location.hash || '');
      if (!pagesVisitedRef.current.has(newPage)) {
        pagesVisitedRef.current.add(newPage);
        sendTrackingPayload({
          action: 'navigate',
          visitorId,
          sessionId,
          pathname: window.location.pathname,
          hash: window.location.hash
        });
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // 3. Heartbeat every 25 seconds to track accurate session duration
    heartbeatTimerRef.current = setInterval(() => {
      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      sendTrackingPayload({
        action: 'heartbeat',
        visitorId,
        sessionId,
        durationSeconds: elapsedSeconds
      });
    }, 25000);

    // 4. Send final duration on tab close/unload using sendBeacon
    const handleUnload = () => {
      const finalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
      sendTrackingPayload(
        {
          action: 'heartbeat',
          visitorId,
          sessionId,
          durationSeconds: finalDuration
        },
        true
      );
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, []);

  return { associateContact };
}

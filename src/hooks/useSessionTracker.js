// src/hooks/useSessionTracker.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';

export default function useSessionTracker() {
  const location = useLocation();

  const sessionIdRef = useRef(null);
  const lastRef = useRef(Date.now());
  const timerRef = useRef(null);

  const getToken = () => localStorage.getItem('customerToken') || localStorage.getItem('accessToken');
  const authHeader = () => {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  useEffect(() => {
    if (!getToken()) return; // not logged-in

    let mounted = true;

    const start = async () => {
      try {
        const { data } = await api.post('/analytics/session/start', {}, {
          withCredentials: true,
          headers: authHeader()
        });
        if (!mounted) return;
        sessionIdRef.current = data.sessionId;
        lastRef.current = Date.now();

        await ping({ deltaSec: 0, path: location.pathname, visible: document.visibilityState === 'visible' });

        timerRef.current = setInterval(() => {
          tick();
        }, 15000);

        window.addEventListener('beforeunload', end);
        document.addEventListener('visibilitychange', resetLast);
      } catch (e) {
        // console.warn('session start failed', e);
      }
    };

    const resetLast = () => { lastRef.current = Date.now(); };

    const tick = () => {
      const now = Date.now();
      const deltaSec = Math.round((now - lastRef.current) / 1000);
      lastRef.current = now;
      ping({ deltaSec, path: location.pathname, visible: document.visibilityState === 'visible' });
    };

    const ping = async ({ deltaSec = 0, path = '/', visible = true }) => {
      const sid = sessionIdRef.current;
      if (!sid) return;
      try {
        await api.post('/analytics/session/ping', { sessionId: sid, deltaSec, path, visible }, {
          withCredentials: true,
          headers: authHeader()
        });
      } catch {}
    };

    const end = async () => {
      const sid = sessionIdRef.current;
      if (!sid) return;
      try {
        await api.post('/analytics/session/end', { sessionId: sid }, {
          withCredentials: true,
          headers: authHeader()
        });
      } catch {}
    };

    start();
    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', end);
      document.removeEventListener('visibilitychange', resetLast);
      sessionIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // একবারই শুরু করলেই যথেষ্ট

  // রুট চেঞ্জ হলে সাথে সাথেই নতুন path দিয়ে ping
  useEffect(() => {
    const sid = sessionIdRef.current;
    const token = getToken();
    if (!sid || !token) return;
    (async () => {
      try {
        await api.post('/analytics/session/ping',
          { sessionId: sid, deltaSec: 0, path: location.pathname, visible: document.visibilityState === 'visible' },
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {}
    })();
  }, [location.pathname]);
}
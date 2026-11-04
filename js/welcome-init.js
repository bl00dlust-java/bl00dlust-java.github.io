(() => {
'use strict';
let initialized = false;
try { initialized = sessionStorage.getItem('cyberhygiene-session-initialized') === '1'; } catch (_) {}
if (initialized) return;
try { sessionStorage.setItem('cyberhygiene-session-initialized','1'); } catch (_) {}
try {
  const raw = localStorage.getItem('cyberhygiene-course-v2');
  const state = raw ? JSON.parse(raw) : null;
  if (state && state.last && typeof state.last.id === 'string') {
    window.__cyberWelcomeReturn = true;
    if (location.hash !== '#/') location.hash = '#/';
  }
} catch (_) {}
})();
(() => {
'use strict';
try {
  if (!location.hash) {
    const raw = localStorage.getItem('cyberhygiene-course-v2');
    const state = raw ? JSON.parse(raw) : null;
    if (state && state.last && typeof state.last.id === 'string') {
      window.__cyberWelcomeReturn = true;
      location.hash = '#/';
    }
  }
} catch (_) {}
})();
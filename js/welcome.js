(() => {
'use strict';
let alreadyDismissed = false;
try { alreadyDismissed = sessionStorage.getItem('cyberhygiene-welcome-dismissed') === '1'; } catch (_) {}
if (!window.__cyberWelcomeReturn || alreadyDismissed) return;

const state = (() => {
  try { return JSON.parse(localStorage.getItem('cyberhygiene-course-v2') || '{}'); }
  catch (_) { return {}; }
})();
const last = state && state.last && typeof state.last === 'object' ? state.last : {};
const rawId = typeof last.id === 'string' ? last.id : '';
const id = /^[a-z0-9_-]{1,40}$/i.test(rawId) ? rawId : '';
const stageName = ['quiz', 'review'].includes(last.stage) ? last.stage : 'module';
const params = new URLSearchParams();
if (id) params.set('id', id);
if (stageName === 'review') {
  const attempt = Number(last.attemptIndex);
  params.set('tab', String(Number.isInteger(attempt) && attempt >= 0 ? Math.min(attempt, 99) : 0));
}
const route = stageName + (params.toString() ? '?' + params.toString() : '');

const overlay = document.createElement('div');
overlay.className = 'welcome-overlay';
const dialog = document.createElement('section');
dialog.className = 'welcome-dialog';
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('aria-labelledby', 'welcome-title');
dialog.setAttribute('aria-describedby', 'welcome-description');

const eyebrow = document.createElement('span');
eyebrow.className = 'eyebrow';
eyebrow.textContent = 'С ВОЗВРАЩЕНИЕМ';
const heading = document.createElement('h2');
heading.id = 'welcome-title';
heading.textContent = 'Продолжим обучение?';
const description = document.createElement('p');
description.id = 'welcome-description';
description.textContent = 'Твой прогресс сохранён в этом браузере. Можешь вернуться к последнему занятию или открыть главную страницу.';
const actions = document.createElement('div');
actions.className = 'welcome-actions';
const continueLink = document.createElement('a');
continueLink.className = 'button';
continueLink.id = 'welcome-continue';
continueLink.href = '#/' + route;
continueLink.textContent = 'Продолжить обучение →';
const homeLink = document.createElement('a');
homeLink.className = 'button button-ghost';
homeLink.id = 'welcome-home';
homeLink.href = '#/';
homeLink.textContent = 'На главную';
const stayButton = document.createElement('button');
stayButton.className = 'welcome-stay';
stayButton.type = 'button';
stayButton.id = 'welcome-stay';
stayButton.textContent = 'Остаться на текущей странице';

actions.append(continueLink, homeLink);
dialog.append(eyebrow, heading, description, actions, stayButton);
overlay.append(dialog);
document.body.append(overlay);

const previouslyFocused = document.activeElement;
const close = (restoreFocus = false) => {
  try { sessionStorage.setItem('cyberhygiene-welcome-dismissed', '1'); } catch (_) {}
  overlay.remove();
  if (restoreFocus && previouslyFocused instanceof HTMLElement && previouslyFocused !== document.body && previouslyFocused.isConnected) {
    previouslyFocused.focus();
  }
};
stayButton.addEventListener('click', () => close(true));
homeLink.addEventListener('click', () => close());
continueLink.addEventListener('click', () => close());
overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });
dialog.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    e.preventDefault();
    close(true);
    return;
  }
  if (e.key !== 'Tab') return;
  const focusable = Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  if (!focusable.length) {
    e.preventDefault();
    return;
  }
  const first = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && (document.activeElement === lastFocusable || !dialog.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
});
continueLink.focus();
})();
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

const eyebrow = document.createElement('span');
eyebrow.className = 'eyebrow';
eyebrow.textContent = 'С ВОЗВРАЩЕНИЕМ';
const heading = document.createElement('h2');
heading.id = 'welcome-title';
heading.textContent = 'Продолжим обучение?';
const description = document.createElement('p');
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

const close = () => {
  try { sessionStorage.setItem('cyberhygiene-welcome-dismissed', '1'); } catch (_) {}
  overlay.remove();
};
stayButton.addEventListener('click', close);
homeLink.addEventListener('click', close);
continueLink.addEventListener('click', close);
overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
continueLink.focus();
})();
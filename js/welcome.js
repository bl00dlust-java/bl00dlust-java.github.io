(() => {
'use strict';
let alreadyDismissed = false;
try { alreadyDismissed = sessionStorage.getItem('cyberhygiene-welcome-dismissed') === '1'; } catch (_) {}
if (!window.__cyberWelcomeReturn || alreadyDismissed) return;
const state = (() => { try { return JSON.parse(localStorage.getItem('cyberhygiene-course-v2') || '{}'); } catch (_) { return {}; } })();
const last = state.last || {};
const id = encodeURIComponent(String(last.id || ''));
const stage = last.stage === 'quiz' ? 'quiz?id=' + id : last.stage === 'review' ? 'review?id=' + id + '&tab=' + encodeURIComponent(String(last.attemptIndex || 0)) : 'module?id=' + id;
const overlay = document.createElement('div');
overlay.className = 'welcome-overlay';
overlay.innerHTML = '<section class="welcome-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><span class="eyebrow">С ВОЗВРАЩЕНИЕМ</span><h2 id="welcome-title">Продолжим обучение?</h2><p>Твой прогресс сохранён в этом браузере. Можешь вернуться к последнему занятию или открыть главную страницу.</p><div class="welcome-actions"><a class="button" id="welcome-continue" href="#/' + stage + '">Продолжить обучение →</a><a class="button button-ghost" id="welcome-home" href="#/">На главную</a></div><button class="welcome-stay" type="button" id="welcome-stay">Остаться на текущей странице</button></section>';
document.body.append(overlay);
const close = () => { try { sessionStorage.setItem('cyberhygiene-welcome-dismissed','1'); } catch (_) {} overlay.remove(); };
overlay.querySelector('#welcome-stay').addEventListener('click',close);
overlay.querySelector('#welcome-home').addEventListener('click',close);
overlay.querySelector('#welcome-continue').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
overlay.querySelector('#welcome-continue').focus();
})();
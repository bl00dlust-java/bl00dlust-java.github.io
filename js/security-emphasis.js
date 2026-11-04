(() => {
  'use strict';

  const terms = [
    'многофакторная аутентификация',
    'цифровая безопасность',
    'персональные данные',
    'конфиденциальность',
    'кибербезопасность',
    'кибергигиена',
    'утечка данных',
    'вредоносное ПО',
    'двухфакторная аутентификация',
    'безопасность',
    'защита',
    'приватность',
    'фишинг',
    'мошенничество',
    'пароли',
    'пароль',
    'MFA',
    '2FA'
  ];
  const escaped = terms
    .sort((a, b) => b.length - a.length)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const matcher = new RegExp('(?<![\\p{L}\\p{N}_])(' + escaped.join('|') + ')(?![\\p{L}\\p{N}_])', 'giu');
  const excluded = 'SCRIPT,STYLE,NOSCRIPT,TEXTAREA,INPUT,SELECT,OPTION,BUTTON,CODE,PRE,KBD,SAMP,SVG,MATH';

  function highlightTextNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('.security-term') || parent.closest('[' + 'data-no-security-highlight' + ']')) return;
    if (parent.closest(excluded) || parent.closest('a,button,[contenteditable="true"]')) return;

    const value = node.nodeValue;
    matcher.lastIndex = 0;
    if (!matcher.test(value)) return;
    matcher.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;
    while ((match = matcher.exec(value))) {
      if (match.index > cursor) fragment.append(document.createTextNode(value.slice(cursor, match.index)));
      const mark = document.createElement('span');
      mark.className = 'security-term';
      mark.textContent = match[0];
      fragment.append(mark);
      cursor = match.index + match[0].length;
    }
    if (cursor < value.length) fragment.append(document.createTextNode(value.slice(cursor)));
    node.replaceWith(fragment);
  }

  function highlight(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(highlightTextNode);
  }

  function start() {
    const root = document.querySelector('main') || document.body;
    highlight(root);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) highlightTextNode(added);
          else if (added.nodeType === Node.ELEMENT_NODE && !added.matches('.security-term')) highlight(added);
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

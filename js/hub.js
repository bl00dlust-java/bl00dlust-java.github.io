(() => {
'use strict';
const root=document.getElementById('hub-content');
if(!root)return;
const storedState=(()=>{try{return JSON.parse(localStorage.getItem('cyberhygiene-course-v2')||'{}');}catch(_){return {};}})();
const themeButton=document.getElementById('hub-theme-toggle');
function applyHubTheme(){const mode=storedState.theme==='light'?'light':storedState.theme==='dark'?'dark':(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=mode;if(themeButton)themeButton.textContent=mode==='dark'?'Светлая тема':'Тёмная тема';}
applyHubTheme();
if(themeButton)themeButton.addEventListener('click',()=>{const current=document.documentElement.dataset.theme;storedState.theme=current==='dark'?'light':'dark';try{localStorage.setItem('cyberhygiene-course-v2',JSON.stringify(storedState));}catch(_){}applyHubTheme();});
let articles=[
{title:'Как распознать фишинг',category:'Мошенничество',text:'Проверяй неожиданные просьбы, адрес отправителя, домен сайта, вложения и попытки заставить тебя торопиться. Самостоятельно открывай сервис через приложение или сохранённую закладку.'},
{title:'Защита аккаунтов',category:'Аккаунты',text:'Используй уникальные пароли, менеджер паролей и многофакторную аутентификацию. Особенно внимательно защищай почту, через которую восстанавливается доступ к другим сервисам.'},
{title:'Безопасность смартфона',category:'Устройства',text:'Устанавливай обновления, используй блокировку экрана, проверяй разрешения приложений и устанавливай программы из официальных источников.'},
{title:'Приватность в социальных сетях',category:'Приватность',text:'Периодически проверяй видимость публикаций, список активных сеансов, подключённые приложения и доступ к контактам, камере и микрофону.'},
{title:'Что делать при подозрении на утечку',category:'Инциденты',text:'Открой официальный сайт сервиса самостоятельно, проверь уведомления, смени затронутый пароль с доверенного устройства, заверши неизвестные сеансы и включи дополнительную защиту.'},
{title:'Безопасные онлайн-покупки',category:'Платежи',text:'Проверяй адрес магазина, условия возврата и независимые сведения о продавце. Не сообщай коды подтверждения и не переходи к оплате по неожиданным ссылкам.'}
];
let glossary=[{term:'Фишинг',definition:'Обман, при котором человека пытаются заставить раскрыть данные или выполнить небезопасное действие.'},{term:'MFA',definition:'Многофакторная аутентификация: вход с использованием нескольких независимых факторов проверки.'},{term:'Менеджер паролей',definition:'Программа для создания и хранения уникальных паролей.'},{term:'Утечка данных',definition:'Ситуация, когда сведения становятся доступны тем, кому они не предназначались.'},{term:'Цифровой след',definition:'Информация, которая остаётся о действиях человека в интернете.'},{term:'Сеанс',definition:'Период, в течение которого пользователь остаётся авторизованным в сервисе.'}];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let newsItems=[{title:'CISA — Secure Our World',text:'Практические рекомендации по паролям, MFA, обновлениям и распознаванию фишинга.',url:'https://www.cisa.gov/secure-our-world'},{title:'FTC — распознавание фишинга',text:'Материалы о признаках мошеннических сообщений и безопасных действиях.',url:'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams'},{title:'Google — защита аккаунта',text:'Официальная инструкция для случаев подозрения на компрометацию аккаунта Google.',url:'https://support.google.com/accounts/answer/6294825'},{title:'Банк России — информационная безопасность',text:'Материалы о финансовом мошенничестве и безопасном поведении.',url:'https://cbr.ru/information_security/'}];\nfunction section(){return (location.hash.slice(1)||'practice').split('?')[0];}
function card(title,desc,tag){return '<article class="hub-card"><span class="hub-kicker">'+tag+'</span><h2>'+title+'</h2><p>'+desc+'</p></article>';}
function practice(){return '<div class="hub-kicker">ТРЕНАЖЁРЫ / УЧЕБНАЯ СРЕДА</div><h2 class="section-title">Практическая лаборатория</h2><p class="page-lead">Все примеры вымышлены. Не вводи реальные пароли, коды и персональные данные. Тренажёры работают локально в браузере.</p><div class="hub-grid"><section class="hub-card"><span class="hub-kicker">01 / ФИШИНГ</span><h2>Найди признаки подозрительного письма</h2><p>Письмо ниже — учебный пример. Выбери наиболее безопасное действие.</p><div class="hub-callout"><b>Тема:</b> Срочно подтвердите доступ<br><b>Отправитель:</b> Уведомления службы &lt;notice@example.invalid&gt;<br><b>Текст:</b> «Доступ будет ограничен. Перейдите по ссылке и сообщите код подтверждения».</div><div class="hub-options"><button class="hub-option" data-phish="0">Перейти по ссылке и проверить форму</button><button class="hub-option" data-phish="1">Не переходить по ссылке, открыть сервис самостоятельно и проверить уведомления</button><button class="hub-option" data-phish="2">Ответить и попросить прислать код повторно</button></div><div class="hub-feedback" id="phish-feedback" role="status">Выбери действие, чтобы увидеть разбор.</div></section><section class="hub-card"><span class="hub-kicker">02 / ПЕРЕПИСКА</span><h2>Как ответить на подозрительную просьбу?</h2><p>В чате незнакомый собеседник представляется сотрудником поддержки и просит код из SMS «для проверки аккаунта».</p><div class="hub-options"><button class="hub-option" data-chat="0">Отправить код, чтобы быстрее решить вопрос</button><button class="hub-option" data-chat="1">Не сообщать код и обратиться в поддержку через официальный канал</button><button class="hub-option" data-chat="2">Переслать код знакомому для проверки</button></div><div class="hub-feedback" id="chat-feedback" role="status">Выбери безопасное действие.</div></section></div><section class="hub-card"><span class="hub-kicker">03 / СЦЕНАРИЙ</span><h2>Ты заметил неизвестный вход в аккаунт</h2><p>Какой порядок действий лучше?</p><div class="hub-options"><button class="hub-option" data-scenario="0">Ничего не делать, если пароль ещё работает</button><button class="hub-option" data-scenario="1">Самостоятельно открыть официальный сервис, защитить почту, сменить пароль, завершить неизвестные сеансы и проверить MFA</button><button class="hub-option" data-scenario="2">Написать незнакомцу, который предлагает вернуть аккаунт</button></div><div class="hub-feedback" id="scenario-feedback" role="status">Выбери вариант.</div></section><p class="hub-small">Тренажёры предназначены для обучения и не проверяют реальные письма, аккаунты или сайты.</p>';}
function knowledge(){return '<div class="hub-kicker">СПРАВОЧНИК / ПРОСТЫЕ ОБЪЯСНЕНИЯ</div><h2 class="section-title">База знаний</h2><p class="page-lead">Короткие материалы о повседневной цифровой безопасности. Используй поиск, чтобы найти нужную тему.</p><div class="hub-form"><label for="knowledge-search">Поиск по статьям и словарю</label><input id="knowledge-search" type="search" placeholder="Например: фишинг, пароль, приватность"></div><div class="hub-search-results" id="knowledge-results"></div><h2 class="hub-section-title">Словарь терминов</h2><div class="hub-grid">'+glossary.map(x=>'<article class="hub-card"><h3>'+escapeHtml(x.term)+'</h3><p>'+escapeHtml(x.definition)+'</p></article>').join('')+'</div>';}
function tools(){return '<div class="hub-kicker">ИНСТРУМЕНТЫ / ЛОКАЛЬНАЯ РАБОТА</div><h2 class="section-title">Полезные инструменты</h2><p class="page-lead">Эти инструменты работают в браузере. Введённые данные не отправляются на сервер.</p><div class="hub-grid"><section class="hub-card"><span class="hub-kicker">01 / ПАРОЛИ</span><h2>Генератор паролей</h2><p>Создаёт случайную комбинацию с помощью криптографического генератора браузера.</p><div class="hub-form"><label for="password-length">Длина пароля: <output id="password-length-value">20</output></label><input id="password-length" type="range" min="12" max="48" value="20"><label><input id="password-symbols" type="checkbox" checked> Добавлять специальные символы</label><button class="button" id="generate-password" type="button">Создать пароль</button><div class="hub-tool-output" id="password-output" aria-live="polite">Нажми «Создать пароль».</div><button class="button button-ghost" id="copy-password" type="button" disabled>Копировать</button><p class="hub-small">Сохраняй сгенерированный пароль в надёжном менеджере паролей. Не используй его на нескольких сайтах.</p></div></section><section class="hub-card"><span class="hub-kicker">02 / ЧЕК-ЛИСТ</span><h2>Базовая проверка безопасности</h2><p>Отметь пункты, которые уже выполнил. Отметки сохраняются только в этом браузере.</p><div class="hub-checklist" id="security-checklist"><label><input type="checkbox" data-check="mail"> Для почты включена MFA</label><label><input type="checkbox" data-check="unique"> На важных сайтах используются уникальные пароли</label><label><input type="checkbox" data-check="updates"> Устройства и приложения обновлены</label><label><input type="checkbox" data-check="sessions"> Проверены активные сеансы важных аккаунтов</label><label><input type="checkbox" data-check="recovery"> Проверены способы восстановления доступа</label><label><input type="checkbox" data-check="privacy"> Проверены настройки приватности и разрешения приложений</label></div><p class="hub-feedback" id="checklist-progress" role="status">Выполнено 0 из 6 пунктов.</p><button class="button button-ghost" id="reset-checklist" type="button">Сбросить отметки</button></section></div>';}
function help(){return '<div class="hub-kicker">ЦЕНТР ПОМОЩИ / ПЕРВЫЕ ШАГИ</div><h2 class="section-title">Что произошло?</h2><p class="page-lead">Выбери ситуацию и начни с безопасных действий. Если есть риск потери денег или доступа, используй официальную поддержку сервиса или банка.</p><div class="hub-grid"><article class="hub-card hub-emergency"><span class="hub-kicker">СИТУАЦИЯ 01</span><h2>Подозрительное письмо или сообщение</h2><ol><li>Не переходи по ссылкам и не открывай неожиданные вложения.</li><li>Не сообщай пароли и коды подтверждения.</li><li>Открой сервис самостоятельно через официальное приложение или закладку.</li><li>Пожалуйся на сообщение средствами самого сервиса.</li></ol></article><article class="hub-card hub-emergency"><span class="hub-kicker">СИТУАЦИЯ 02</span><h2>Неизвестный вход в аккаунт</h2><ol><li>Открой официальный сайт или приложение самостоятельно.</li><li>Защити связанную почту и смени затронутый пароль с доверенного устройства.</li><li>Заверши неизвестные сеансы и проверь способы восстановления.</li><li>Включи MFA и обратись в официальную поддержку, если доступ потерян.</li></ol></article><article class="hub-card"><span class="hub-kicker">СИТУАЦИЯ 03</span><h2>Подозрительное списание или платёж</h2><ol><li>Свяжись с банком через номер на карте или официальное приложение.</li><li>Следуй указаниям банка по блокировке карты или оспариванию операции.</li><li>Сохрани сведения об операции и переписку.</li><li>Не сообщай посторонним PIN, CVV и коды подтверждения.</li></ol></article><article class="hub-card"><span class="hub-kicker">СИТУАЦИЯ 04</span><h2>Возможная утечка данных</h2><ol><li>Уточни информацию на официальном сайте затронутого сервиса.</li><li>Если пароль использовался повторно, замени его и на других сервисах.</li><li>Проверь активные сеансы и MFA.</li><li>Остерегайся последующих сообщений, использующих сведения об утечке.</li></ol></article></div><div class="hub-callout"><b>Важно:</b> не отправляй на этот сайт настоящие пароли, коды, номера карт или документы. Материалы носят общий информационный характер и не заменяют обращение в банк, полицию или официальную поддержку.</div>';}
function news(){return '<div class="hub-kicker">НОВОСТИ / ПРОВЕРЕННЫЕ ИСТОЧНИКИ</div><h2 class="section-title">Новости и официальные материалы</h2><p class="page-lead">Здесь собраны проверенные первоисточники. Новостные публикации следует добавлять только после проверки даты, фактов и рекомендаций.</p><div class="hub-article-list">'+newsItems.map(item=>'<article class="hub-article"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.text)+' <a href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer">Открыть источник ↗</a></p></article>').join('')+'</div>';}
function educators(){return '<div class="hub-kicker">МАТЕРИАЛЫ / СЕМЬЯ И ОБРАЗОВАНИЕ</div><h2 class="section-title">Для родителей и учителей</h2><p class="page-lead">Материалы, которые помогают обсуждать цифровую безопасность спокойно, без запугивания и обвинений.</p><div class="hub-grid">'+card('Для родителей','Обсуждайте правила общения с незнакомцами, приватность, покупки в интернете и обращение за помощью. Важно, чтобы ребёнок мог рассказать о проблеме без страха наказания.','ПАМЯТКА')+card('Для учителей','Используйте короткие сценарии: проверка источника, разбор подозрительного сообщения, выбор безопасного действия. Не просите учеников приносить реальные пароли или личную переписку.','МЕТОДИКА')+card('План занятия на 20 минут','5 минут — вводная ситуация; 10 минут — разбор учебных примеров; 5 минут — обсуждение безопасных действий и выводов.','ГОТОВЫЙ ФОРМАТ')+card('Универсальный чек-лист','Обсудите уникальные пароли, MFA, обновления, приватность, проверку ссылок и способы обращения за помощью.','ДЛЯ ГРУППЫ')+'</div>';}
async function loadHubContent(){
try{
 const response=await fetch('data/hub-content.json',{cache:'no-cache'});
 if(!response.ok)return;
 const data=await response.json();
 const validText=value=>typeof value==='string'&&value.trim().length>0&&value.length<=3000;
 if(!data||data.version!==1)return;
 if(Array.isArray(data.articles)&&data.articles.length>0&&data.articles.length<=100&&data.articles.every(x=>x&&validText(x.title)&&validText(x.category)&&validText(x.text)))articles=data.articles;
 if(Array.isArray(data.glossary)&&data.glossary.length>0&&data.glossary.length<=200&&data.glossary.every(x=>x&&validText(x.term)&&validText(x.definition)))glossary=data.glossary;
 if(Array.isArray(data.news)&&data.news.length>0&&data.news.length<=100&&data.news.every(x=>x&&validText(x.title)&&validText(x.text)&&typeof x.url==='string'&&(()=>{try{return new URL(x.url).protocol==='https:';}catch(_){return false;}})()))newsItems=data.news;
}catch(error){console.warn('Не удалось загрузить редакционные материалы; используются встроенные.',error);}
}
async function loadHubContent(){
try{
 const response=await fetch('data/hub-content.json',{cache:'no-cache'});
 if(!response.ok)return;
 const data=await response.json();
 const validText=value=>typeof value==='string'&&value.trim().length>0&&value.length<=3000;
 if(!data||data.version!==1)return;
 if(Array.isArray(data.articles)&&data.articles.length>0&&data.articles.length<=100&&data.articles.every(x=>x&&validText(x.title)&&validText(x.category)&&validText(x.text)))articles=data.articles;
 if(Array.isArray(data.glossary)&&data.glossary.length>0&&data.glossary.length<=200&&data.glossary.every(x=>x&&validText(x.term)&&validText(x.definition)))glossary=data.glossary;
 if(Array.isArray(data.news)&&data.news.length>0&&data.news.length<=100&&data.news.every(x=>x&&validText(x.title)&&validText(x.text)&&typeof x.url==='string'&&(()=>{try{return new URL(x.url).protocol==='https:';}catch(_){return false;}})()))newsItems=data.news;
}catch(error){console.warn('Не удалось загрузить редакционные материалы; используются встроенные.',error);}
}
function render(){
const page=section();const routes={practice,knowledge,tools,help,news,educators};const fn=routes[page]||practice;
root.innerHTML=fn();
document.querySelectorAll('.hub-tabs a').forEach(a=>{if(a.getAttribute('href')==='#'+(routes[page]?page:'practice'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
if(page==='knowledge')renderSearch('');
if(page==='tools')restoreChecklist();
}
function renderSearch(query){
const box=document.getElementById('knowledge-results');if(!box)return;
const q=query.trim().toLocaleLowerCase('ru');
const found=articles.filter(a=>(a.title+' '+a.category+' '+a.text).toLocaleLowerCase('ru').includes(q)).map(a=>({title:a.title,category:a.category,text:a.text}));
const terms=glossary.filter(a=>(a.term+' '+a.definition).toLocaleLowerCase('ru').includes(q)).map(a=>({title:a.term,category:'Словарь терминов',text:a.definition}));
const results=found.concat(terms);
box.replaceChildren();
if(!results.length){const p=document.createElement('p');p.className='hub-muted';p.textContent='Ничего не найдено. Попробуй другой запрос.';box.append(p);return;}
results.forEach(a=>{const el=document.createElement('article');el.className='hub-article';const h=document.createElement('h3');h.textContent=a.title;const tag=document.createElement('span');tag.className='hub-kicker';tag.textContent=a.category;const p=document.createElement('p');p.textContent=a.text;el.append(tag,h,p);box.append(el);});
}
function restoreChecklist(){
const checks=[...document.querySelectorAll('[data-check]')];let saved={};try{saved=JSON.parse(localStorage.getItem('cyberhygiene-security-checklist')||'{}')||{};}catch{}
checks.forEach(c=>c.checked=saved[c.dataset.check]===true);updateChecklist();
}
function updateChecklist(){
const checks=[...document.querySelectorAll('[data-check]')];const done=checks.filter(c=>c.checked).length;const out=document.getElementById('checklist-progress');if(out)out.textContent='Выполнено '+done+' из '+checks.length+' пунктов.';
try{const data={};checks.forEach(c=>data[c.dataset.check]=c.checked);localStorage.setItem('cyberhygiene-security-checklist',JSON.stringify(data));}catch{}
}
function secureRandomIndex(max){const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]%max;}
function generatePassword(){
const length=Number(document.getElementById('password-length').value);
const symbols=document.getElementById('password-symbols').checked;
const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'+(symbols?'!@#$%*+-_=?':'');
const limit=Math.floor(0x100000000/chars.length)*chars.length;
let result='';
while(result.length<length){
 const bytes=new Uint32Array(Math.max(16,length-result.length));
 crypto.getRandomValues(bytes);
 for(const value of bytes){
  if(value>=limit)continue;
  result+=chars[value%chars.length];
  if(result.length===length)break;
 }
}
const output=document.getElementById('password-output');
output.textContent=result;
document.getElementById('copy-password').disabled=false;
}
document.addEventListener('click',async e=>{
const b=e.target.closest('button');if(!b)return;
if(b.dataset.phish){const out=document.getElementById('phish-feedback');const good=b.dataset.phish==='1';out.textContent=good?'Верно. Не переходи по ссылке и проверь уведомление через официальный сервис. Запрос кода подтверждения — серьёзный предупреждающий признак.':'Это небезопасно. Не используй ссылку из неожиданного сообщения и никогда не передавай коды подтверждения.';}
if(b.dataset.chat){document.getElementById('chat-feedback').textContent=b.dataset.chat==='1'?'Верно. Коды подтверждения нельзя передавать собеседникам. Открой поддержку через официальный сайт или приложение.':'Неверно. Код подтверждения предназначен только для тебя. Не передавай его никому.';}
if(b.dataset.scenario){document.getElementById('scenario-feedback').textContent=b.dataset.scenario==='1'?'Верно. Начни с официального сервиса, защити связанные способы восстановления и заверши неизвестные сеансы.':'Это может увеличить риск. Не игнорируй уведомление и не обращайся к незнакомым посредникам.';}
if(b.id==='generate-password'){try{generatePassword();}catch(_){document.getElementById('password-output').textContent='Генератор недоступен в этом браузере. Открой сайт по HTTPS в современном браузере.';}}
if(b.id==='copy-password'){const val=document.getElementById('password-output').textContent;if(val&&val!=='Нажми «Создать пароль».'){try{await navigator.clipboard.writeText(val);b.textContent='Скопировано';}catch{b.textContent='Копирование недоступно';}}}
if(b.id==='reset-checklist'){try{localStorage.removeItem('cyberhygiene-security-checklist');}catch(_){}restoreChecklist();}
});
document.addEventListener('input',e=>{
if(e.target.id==='knowledge-search')renderSearch(e.target.value);
if(e.target.id==='password-length')document.getElementById('password-length-value').textContent=e.target.value;
});
document.addEventListener('change',e=>{if(e.target.matches('[data-check]'))updateChecklist();});
window.addEventListener('hashchange',render);
loadHubContent().then(render);
})();
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
let customSimulators=[{"moduleId":"basics","moduleTitle":"01 · Основы кибергигиены","id":"basics-alert","category":"ОСНОВЫ","title":"Неожиданное предупреждение","prompt":"На экране появилось сообщение: «Ваш аккаунт будет удалён через 10 минут. Срочно подтвердите данные по ссылке». Ты не запрашивал никаких изменений. Что делать?","options":["Открыть ссылку, чтобы успеть отменить удаление","Самостоятельно открыть официальный сервис и проверить уведомления","Ответить на сообщение и попросить отсрочку"],"correctIndex":1,"explanation":"Срочность и давление — повод остановиться. Проверяй уведомления через официальный сайт или приложение, открытое самостоятельно."},{"moduleId":"basics","moduleTitle":"01 · Основы кибергигиены","id":"basics-code","category":"ОСНОВЫ","title":"Код подтверждения","prompt":"Знакомый пишет: «Мне случайно пришёл твой код, перешли его, пожалуйста». Как поступить?","options":["Переслать код знакомому","Опубликовать код в общем чате, чтобы выяснить, чей он","Не передавать код никому и проверить активность аккаунта"],"correctIndex":2,"explanation":"Одноразовый код предназначен только для подтверждения твоего действия. Даже знакомый аккаунт мог быть скомпрометирован."},{"moduleId":"passwords","moduleTitle":"02 · Пароли и вход в аккаунты","id":"password-sample","category":"ПРОВЕРКА ПАРОЛЯ · УЧЕБНЫЙ ПРИМЕР","title":"Какой пароль надёжнее?","prompt":"Сравни три полностью вымышленных примера. Не вводи сюда настоящий пароль.\n\nA · Summer2026!\nB · qwerty-123\nC · river-lantern-orbit-copper-47","options":["A — есть заглавные буквы и символ","B — содержит дефис","C — длинная непредсказуемая фраза, не используемая повторно"],"correctIndex":2,"explanation":"Длина и непредсказуемость важнее декоративной замены букв. Для каждого сервиса нужен отдельный пароль; настоящий пароль никогда не проверяй на учебном сайте."},{"moduleId":"passwords","moduleTitle":"02 · Пароли и вход в аккаунты","id":"password-reuse","category":"ПАРОЛИ","title":"Один пароль для нескольких сервисов","prompt":"Ты используешь один пароль для почты, игры и школьного аккаунта. Узнал, что на игровом сервисе произошла утечка. Какой вывод правильный?","options":["Ничего менять не нужно, ведь утечка была только в игре","Нужно заменить повторяющийся пароль на уникальные пароли, начиная с почты и важных аккаунтов","Достаточно изменить одну букву в старом пароле"],"correctIndex":1,"explanation":"Повтор пароля связывает аккаунты между собой. Уникальные пароли ограничивают последствия утечки одного сервиса."},{"moduleId":"phishing","moduleTitle":"03 · Фишинг и подозрительные сообщения","id":"phishing-email","category":"РАЗБОР ПИСЬМА","title":"Письмо о блокировке аккаунта","prompt":"Учебное письмо:\nОт: Security Team <security@example.invalid>\nТема: СРОЧНО! Аккаунт будет заблокирован через 15 минут\nТекст: «Перейдите по кнопке ниже и введите пароль и код из SMS».\n\nКакой вывод наиболее обоснован?","options":["Это точно настоящее письмо, потому что в нём есть слово Security","Есть несколько тревожных признаков: давление временем и просьба ввести пароль и код по ссылке","Нужно открыть ссылку, чтобы проверить, куда она ведёт"],"correctIndex":1,"explanation":"Срочность, неожиданный запрос секретов и ссылка из письма — сильные признаки фишинга. Не открывай ссылку; проверь аккаунт через официальный сервис."},{"moduleId":"phishing","moduleTitle":"03 · Фишинг и подозрительные сообщения","id":"phishing-cloud","category":"ФИШИНГ","title":"Неожиданный общий документ","prompt":"Пришло письмо о документе от неизвестного отправителя. Чтобы прочитать его, просят повторно войти в аккаунт. Ты не ждёшь этот документ.","options":["Ввести пароль, если страница выглядит знакомо","Переслать приглашение друзьям","Не использовать ссылку и проверить уведомления в официальном облачном сервисе"],"correctIndex":2,"explanation":"Внешний вид страницы можно подделать. Открой облачный сервис самостоятельно и проверь, действительно ли документ был предоставлен."},{"moduleId":"privacy","moduleTitle":"04 · Приватность и цифровой след","id":"privacy-photo","category":"ЦИФРОВОЙ СЛЕД","title":"Фото перед публикацией","prompt":"Ты собираешься выложить фотографию рабочего стола. На заднем плане видны школьный пропуск и лист с расписанием. Что лучше сделать?","options":["Опубликовать фото: оно ведь не про документы","Убрать или закрыть личные сведения и ещё раз проверить весь кадр","Добавить геометку, чтобы друзьям было понятнее"],"correctIndex":1,"explanation":"Личные сведения могут случайно попасть в кадр. Перед публикацией проверяй фон, документы, адреса и геометки."},{"moduleId":"privacy","moduleTitle":"04 · Приватность и цифровой след","id":"privacy-permissions","category":"РАЗРЕШЕНИЯ","title":"Фонарик просит контакты","prompt":"Простое приложение-фонарик запрашивает доступ к контактам и микрофону. Для включения фонаря эти разрешения не нужны.","options":["Разрешить всё, иначе приложение не заработает","Отказать в лишних разрешениях и проверить, можно ли использовать другое приложение","Отправить разработчику список контактов"],"correctIndex":1,"explanation":"Разрешения должны соответствовать назначению приложения. Необязательный доступ лучше не предоставлять."},{"moduleId":"devices","moduleTitle":"05 · Защита устройств и сетей","id":"devices-wifi","category":"СЕТИ","title":"Две похожие сети Wi-Fi","prompt":"В кафе видны две сети: Cafe_WiFi и Cafe_WiFi_Free. Ты не знаешь, какая из них настоящая.","options":["Подключиться к той, у которой сильнее сигнал","Проверить точное имя сети у сотрудников и отключить автоподключение к неизвестным точкам","Отключить предупреждения браузера, чтобы сеть работала быстрее"],"correctIndex":1,"explanation":"Похожие названия могут вводить в заблуждение. Уточняй точное имя сети у персонала; HTTPS не делает сам сайт автоматически надёжным."},{"moduleId":"devices","moduleTitle":"05 · Защита устройств и сетей","id":"devices-update","category":"УСТРОЙСТВА","title":"Обновление или случайный файл?","prompt":"В чате прислали файл «Обновление_браузера.apk» и совет отключить защиту устройства, чтобы установить его.","options":["Установить файл и отключить защиту","Не запускать файл, оставить защиту включённой и обновлять приложения через официальный источник","Переслать файл друзьям для проверки"],"correctIndex":1,"explanation":"Не устанавливай неизвестные файлы из чатов и не отключай встроенную защиту. Используй официальный магазин или сайт разработчика."},{"moduleId":"recovery","moduleTitle":"06 · Если аккаунт под угрозой","id":"recovery-login","category":"ВОССТАНОВЛЕНИЕ","title":"Неизвестный вход","prompt":"Пришло уведомление о входе в аккаунт с незнакомого устройства. Ты не выполнял этот вход.","options":["Нажать ссылку в письме и ввести код, чтобы отменить вход","Игнорировать уведомление, пока пароль работает","Самостоятельно открыть официальный сервис, проверить сеансы, защитить почту и сменить пароль при подтверждении проблемы"],"correctIndex":2,"explanation":"Открывай сервис самостоятельно. Проверь активные сеансы, связанную почту, пароль, MFA и способы восстановления."},{"moduleId":"recovery","moduleTitle":"06 · Если аккаунт под угрозой","id":"recovery-impostor","category":"ВОССТАНОВЛЕНИЕ","title":"Посредник обещает вернуть аккаунт","prompt":"Незнакомец пишет, что может вернуть потерянный аккаунт за плату. Он просит прислать код подтверждения.","options":["Передать код, если человек обещает помочь","Не платить и не сообщать код; использовать официальный процесс восстановления и поддержку","Отправить ему пароль, но не код"],"correctIndex":1,"explanation":"Посредники могут пытаться получить деньги или доступ к аккаунту. Не сообщай секреты и пользуйся только официальными способами восстановления."}];
let newsItems=[{title:'CISA — Secure Our World',text:'Практические рекомендации по паролям, MFA, обновлениям и распознаванию фишинга.',url:'https://www.cisa.gov/secure-our-world'},{title:'FTC — распознавание фишинга',text:'Материалы о признаках мошеннических сообщений и безопасных действиях.',url:'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams'},{title:'Google — защита аккаунта',text:'Официальная инструкция для случаев подозрения на компрометацию аккаунта Google.',url:'https://support.google.com/accounts/answer/6294825'},{title:'Банк России — информационная безопасность',text:'Материалы о финансовом мошенничестве и безопасном поведении.',url:'https://cbr.ru/information_security/'}];
function section(){return (location.hash.slice(1)||'practice').split('?')[0];}
function card(title,desc,tag){return '<article class="hub-card"><span class="hub-kicker">'+tag+'</span><h2>'+title+'</h2><p>'+desc+'</p></article>';}
function practice(){return '<div class="hub-kicker">ТРЕНАЖЁРЫ / УЧЕБНАЯ СРЕДА</div><h2 class="section-title">Практическая лаборатория</h2><p class="page-lead">Шесть модулей — отдельные практические ситуации. Все адреса, письма и пароли вымышлены. Не вводи настоящие пароли, коды или личные данные.</p><div class="hub-callout"><b>Важно:</b> тренажёры работают локально в браузере. Для проверки пароля выбери только готовый учебный пример — поле для настоящего пароля здесь отсутствует.</div><div id="custom-simulators"></div><p class="hub-small">После выбора ответа появится объяснение. Можно выбрать другой вариант и сравнить разбор.</p>';}
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
}catch(error){console.info('Редакционные материалы недоступны; показана встроенная версия.');}
}
async function loadCustomSimulators(){
 try{
  const response=await fetch('data/simulators.json',{cache:'no-cache'});
  if(!response.ok)return;
  const data=await response.json();
  const validText=value=>typeof value==='string'&&value.trim().length>0&&value.length<=1200;
  if(!data||data.version!==1||!Array.isArray(data.scenarios)||data.scenarios.length>50)return;
  const valid=data.scenarios.every(x=>x&&typeof x.id==='string'&&/^[a-z0-9-]{1,40}$/.test(x.id)&&validText(x.title)&&validText(x.prompt)&&Array.isArray(x.options)&&x.options.length>=2&&x.options.length<=5&&x.options.every(validText)&&Number.isInteger(x.correctIndex)&&x.correctIndex>=0&&x.correctIndex<x.options.length&&validText(x.explanation));
  if(valid)customSimulators=data.scenarios;
 }catch(error){console.info('Дополнительные сценарии недоступны; показаны встроенные сценарии.');}
}
function renderCustomSimulators(){
 const host=document.getElementById('custom-simulators');
 if(!host)return;
 host.replaceChildren();
 if(!customSimulators.length){const note=document.createElement('p');note.className='hub-muted';note.textContent='Учебные сценарии временно недоступны.';host.append(note);return;}
 let currentModule='';
 customSimulators.forEach((scenario,scenarioIndex)=>{
  if(scenario.moduleTitle!==currentModule){
   currentModule=scenario.moduleTitle||'Дополнительные учебные сценарии';
   const heading=document.createElement('h2');heading.className='hub-section-title hub-sim-module';heading.textContent=currentModule;host.append(heading);
  }
  const article=document.createElement('section');article.className='hub-card hub-sim-card';article.dataset.simCard=String(scenarioIndex);
  const tag=document.createElement('span');tag.className='hub-kicker';tag.textContent=scenario.category||'ТРЕНАЖЁР';
  const title=document.createElement('h3');title.textContent=scenario.title;
  const prompt=document.createElement('p');prompt.className='hub-sim-prompt';prompt.textContent=scenario.prompt;
  const options=document.createElement('div');options.className='hub-options';
  scenario.options.forEach((option,optionIndex)=>{
   const button=document.createElement('button');button.type='button';button.className='hub-option';button.textContent=option;button.dataset.customSim=scenarioIndex+':'+optionIndex;button.setAttribute('aria-pressed','false');options.append(button);
  });
  const feedback=document.createElement('div');feedback.className='hub-feedback';feedback.id='custom-sim-feedback-'+scenarioIndex;feedback.setAttribute('role','status');feedback.textContent='Выбери ответ, чтобы увидеть разбор.';
  article.append(tag,title,prompt,options,feedback);host.append(article);
 });
}
function render(){
const page=section();const routes={practice,knowledge,tools,help,news,educators};const fn=routes[page]||practice;
root.innerHTML=fn();
document.querySelectorAll('.hub-tabs a').forEach(a=>{if(a.getAttribute('href')==='#'+(routes[page]?page:'practice'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
if(page==='practice')renderCustomSimulators();
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
if(b.dataset.customSim){
 const [scenarioValue,optionValue]=b.dataset.customSim.split(':');
 const scenarioIndex=Number(scenarioValue),optionIndex=Number(optionValue),item=customSimulators[scenarioIndex];
 const card=b.closest('[data-sim-card]');
 if(item&&card&&Number.isInteger(optionIndex)&&optionIndex>=0&&optionIndex<item.options.length){
  card.querySelectorAll('[data-custom-sim]').forEach(option=>{option.classList.remove('is-correct','is-wrong');option.setAttribute('aria-pressed','false');});
  const correct=optionIndex===item.correctIndex;
  b.classList.add(correct?'is-correct':'is-wrong');b.setAttribute('aria-pressed','true');
  const output=card.querySelector('.hub-feedback');
  if(output)output.textContent=(correct?'Верно. ':'Не совсем. ')+item.explanation;
 }
}
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
Promise.all([loadHubContent(),loadCustomSimulators()]).then(render);
})();
(()=> {
  if (document.querySelector(".app-sidebar")) return;
  const admin = location.pathname.includes("/admin/");
  const root = admin ? "../" : "./";
  const groups = [
    { label: "ПЛАТФОРМА", links: [["⌂","Главная",root+"index.html"],["▤","Обучение",root+"classic.html#/course"],["◈","Практика",root+"hub.html#practice"],["▧","База знаний",root+"hub.html#knowledge"]] },
    { label: "ИНСТРУМЕНТЫ", links: [["⌘","Полезные инструменты",root+"hub.html#tools"],["?","Центр помощи",root+"hub.html#help"],["↗","Сообщить об ошибке",root+"bug-report.html"]] }
  ];
  if (admin) groups.push({ label:"УПРАВЛЕНИЕ", links:[["▦","Обзор админки","dashboard.html"],["Aa","Шрифты и оформление","fonts.html"],["✎","Материалы","content.html"],["◎","Тренажёры","simulators.html"]] });
  const nav = document.createElement("aside");
  nav.className = "app-sidebar";
  nav.setAttribute("aria-label","Основная навигация");
  nav.innerHTML =
    '<div class="app-sidebar__brand-row"><a class="app-sidebar__brand" href="'+root+'index.html"><span class="app-sidebar__mark">K</span><span>КИБЕРГИГИЕНА</span></a><button class="app-sidebar__mobile-close" type="button" aria-label="Закрыть меню">×</button></div>' +
    groups.map(group => '<section class="app-sidebar__group"><div class="app-sidebar__label">'+group.label+'</div>'+group.links.map(([icon,label,url])=>'<a class="app-sidebar__link" href="'+url+'"><span class="app-sidebar__icon">'+icon+'</span><span>'+label+'</span></a>').join("")+'</section>').join("") +
    '<div class="app-sidebar__bottom"><button class="app-sidebar__collapse" type="button" aria-label="Свернуть меню" title="Свернуть меню">‹</button></div>';
  const trigger = document.createElement("button");
  trigger.className = "app-sidebar-mobile-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-label","Открыть меню");
  trigger.setAttribute("aria-expanded","false");
  trigger.textContent = "☰";
  const backdrop = document.createElement("button");
  backdrop.className = "app-sidebar-backdrop";
  backdrop.type = "button";
  backdrop.setAttribute("aria-label","Закрыть меню");
  const close = () => {
    document.body.classList.remove("app-sidebar-open");
    trigger.textContent = "☰";
    trigger.setAttribute("aria-label","Открыть меню");
    trigger.setAttribute("aria-expanded","false");
  };
  const open = () => {
    document.body.classList.add("app-sidebar-open");
    trigger.textContent = "×";
    trigger.setAttribute("aria-label","Закрыть меню");
    trigger.setAttribute("aria-expanded","true");
  };
  trigger.addEventListener("click",()=>document.body.classList.contains("app-sidebar-open") ? close() : open());
  backdrop.addEventListener("click",close);
  nav.querySelector(".app-sidebar__mobile-close").addEventListener("click",close);
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",close));
  nav.querySelector(".app-sidebar__collapse").addEventListener("click",()=>document.body.classList.toggle("app-sidebar-collapsed"));
  document.body.classList.add("has-app-sidebar");
  document.body.prepend(nav,trigger,backdrop);
  try { if(localStorage.getItem("cyber-sidebar-collapsed")==="1") document.body.classList.add("app-sidebar-collapsed"); } catch {}
})();
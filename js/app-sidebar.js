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
  // Reuse the original header menu button instead of creating a duplicate.
  const trigger = document.querySelector(".menu-toggle") || document.createElement("button");
  trigger.className = "app-sidebar-mobile-trigger";
  trigger.type = "button";
  trigger.removeAttribute("data-action");
  trigger.removeAttribute("aria-controls");
  trigger.setAttribute("aria-label","Открыть меню");
  trigger.setAttribute("aria-expanded","false");
  trigger.textContent = "☰";
  const backdrop = document.createElement("button");
  backdrop.className = "app-sidebar-backdrop";
  backdrop.type = "button";
  backdrop.setAttribute("aria-label","Закрыть меню");
  nav.id = "app-sidebar-navigation";
  trigger.setAttribute("aria-controls", nav.id);
  const focusableItems = () => Array.from(nav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(item => item.getClientRects().length > 0);
  const close = (restoreFocus = true) => {
    document.body.classList.remove("app-sidebar-open");
    trigger.textContent = "☰";
    trigger.setAttribute("aria-label","Открыть меню");
    trigger.setAttribute("aria-expanded","false");
    if (restoreFocus && trigger.isConnected) trigger.focus();
  };
  const open = () => {
    document.body.classList.add("app-sidebar-open");
    trigger.textContent = "×";
    trigger.setAttribute("aria-label","Закрыть меню");
    trigger.setAttribute("aria-expanded","true");
    const firstLink = nav.querySelector("a[href]");
    if (firstLink) firstLink.focus();
  };
  trigger.addEventListener("click",()=>document.body.classList.contains("app-sidebar-open") ? close(false) : open());
  backdrop.addEventListener("click",() => close(true));
  nav.querySelector(".app-sidebar__mobile-close").addEventListener("click",() => close(true));
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",() => close(false)));
  document.addEventListener("keydown", event => {
    if (!document.body.classList.contains("app-sidebar-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusableItems();
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !nav.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !nav.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });
  const collapseButton = nav.querySelector(".app-sidebar__collapse");
  const syncCollapseButton = () => {
    const collapsed = document.body.classList.contains("app-sidebar-collapsed");
    collapseButton.textContent = collapsed ? "›" : "‹";
    collapseButton.setAttribute("aria-label", collapsed ? "Раскрыть меню" : "Свернуть меню");
    collapseButton.title = collapsed ? "Раскрыть меню" : "Свернуть меню";
  };
  collapseButton.addEventListener("click",()=>{
    document.body.classList.toggle("app-sidebar-collapsed");
    syncCollapseButton();
    try { localStorage.setItem("cyber-sidebar-collapsed",document.body.classList.contains("app-sidebar-collapsed") ? "1" : "0"); } catch {}
  });
  document.body.classList.add("has-app-sidebar");
  document.body.prepend(nav,trigger,backdrop);
  try { if(localStorage.getItem("cyber-sidebar-collapsed")==="1") document.body.classList.add("app-sidebar-collapsed"); } catch {}
  syncCollapseButton();
})();
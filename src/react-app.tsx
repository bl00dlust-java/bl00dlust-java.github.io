import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Fingerprint, LockKeyhole, Menu, Moon, ShieldCheck, Smartphone, Sun, X, Zap } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { AppSidebar } from "@/components/app-sidebar";

const modules = [
  ["01", "Основы кибергигиены", "Повседневные привычки, которые помогают защищать устройства и личную информацию.", ShieldCheck],
  ["02", "Пароли и вход", "Уникальные пароли, менеджеры паролей и дополнительная проверка входа.", LockKeyhole],
  ["03", "Фишинг и обман", "Как замечать подозрительные письма, сообщения и поддельные страницы.", Fingerprint],
  ["04", "Приватность", "Настройки видимости, разрешения приложений и цифровой след.", Smartphone],
  ["05", "Защита устройств", "Обновления, резервные копии и безопасная работа с приложениями.", Zap],
  ["06", "Действия при инциденте", "Понятный план, если аккаунт или данные оказались под угрозой.", CheckCircle2],
] as const;

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("cyberhygiene-theme");
    return saved === "light" || saved === "dark" ? saved : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cyberhygiene-theme", theme);
  }, [theme]);

  return <div className="min-h-screen bg-background text-foreground"><AppSidebar/>
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="brand"><span className="brand-mark"><ShieldCheck size={21}/></span>КИБЕР<span className="text-primary">ГИГИЕНА</span></a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex"><a href="#program">Программа</a><a href="#practice">Практика</a><a href="#about">О проекте</a></nav>
        <div className="flex items-center gap-2">
          <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Переключить тему">{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <a className="primary-btn hidden sm:inline-flex" href="classic.html#/course">Начать обучение <ArrowUpRight size={16}/></a>
          <button className="icon-btn md:hidden" onClick={() => setMenu(!menu)} aria-label="Меню">{menu ? <X/> : <Menu/>}</button>
        </div>
      </div>
      {menu && <nav className="grid gap-4 border-t border-border px-6 py-5 md:hidden"><a href="#program" onClick={() => setMenu(false)}>Программа</a><a href="#practice" onClick={() => setMenu(false)}>Практика</a><a href="#about" onClick={() => setMenu(false)}>О проекте</a><a href="classic.html#/course">Начать обучение</a></nav>}
    </header>
    <main>
      <section className="hero mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div>
          <div className="eyebrow"><span className="live-dot"/> БЕСПЛАТНЫЙ ИНТЕРАКТИВНЫЙ КУРС</div>
          <h1 className="hero-title mt-7">Твоя безопасность<br/>начинается <em>с привычек.</em></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">Практический курс, который помогает увереннее пользоваться интернетом, защищать аккаунты и распознавать цифровые угрозы.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a className="primary-btn px-6 py-4" href="classic.html#/course">Перейти к обучению <ArrowRight size={17}/></a><a className="secondary-btn px-6 py-4" href="#program">Изучить программу</a></div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-muted-foreground"><span>✓ Без регистрации</span><span>✓ В своём темпе</span><span>✓ Прогресс в браузере</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] px-3 py-8">
          <BorderBeam size="md" colorVariant="colorful" theme={theme}>
            <div className="security-panel">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-[10px] tracking-[.18em] text-slate-400"><span>PERSONAL SECURITY</span><span className="text-emerald-300">● LIVE</span></div>
              <div className="px-7 py-9 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-violet-300/30 bg-violet-400/10 text-violet-200 shadow-glow"><ShieldCheck size={40}/></div>
                <div className="mt-6 text-[10px] tracking-[.2em] text-slate-400">ТВОЯ ЦИФРОВАЯ СРЕДА</div><div className="mt-2 font-display text-3xl">Под защитой <span className="text-emerald-300">●</span></div>
                <div className="mt-8 flex justify-between text-xs text-slate-400"><span>Полезные привычки</span><span>01—06</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"/></div>
                <div className="mt-7 grid grid-cols-2 gap-3 text-left"><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><LockKeyhole size={18} className="text-violet-300"/><b className="mt-3 block text-xs">Аккаунты</b><small className="text-slate-400">Уникальные пароли</small></div><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><Fingerprint size={18} className="text-cyan-300"/><b className="mt-3 block text-xs">Приватность</b><small className="text-slate-400">Контроль данных</small></div></div>
              </div>
            </div>
          </BorderBeam>
        </div>
      </section>
      <section className="border-y border-border bg-card/50"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8">{[["06","модулей"],["18","коротких уроков"],["30","вопросов"],["∞","попыток теста"]].map(([n,l])=><div className="text-center" key={l}><b className="block font-display text-3xl text-primary">{n}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div></section>
      <section id="program" className="section-shell py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="eyebrow">МАРШРУТ ОБУЧЕНИЯ / 01—06</div><h2 className="section-title mt-4">Понятно. Постепенно.<br/><em>На практике.</em></h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground">Шесть тематических модулей — от базовых правил до уверенных действий в непростых ситуациях.</p></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([n,title,desc,Icon])=><a href="classic.html#/course" key={n} className="module-card"><div className="flex items-center justify-between text-primary"><span className="font-mono text-[10px] tracking-widest">{n} / MODULE</span><Icon size={21}/></div><h3 className="mt-8 font-display text-2xl">{title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{desc}</p><div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>3 урока · 5 вопросов</span><ArrowUpRight size={17} className="text-primary"/></div></a>)}</div>
      </section>
      <section id="practice" className="border-y border-border bg-card/40 py-24"><div className="section-shell grid gap-12 lg:grid-cols-2 lg:items-center"><div><div className="eyebrow">НЕ ТОЛЬКО ТЕОРИЯ / ПРАКТИКА</div><h2 className="section-title mt-4">Проверь себя<br/><em>в безопасной среде.</em></h2><p className="mt-6 max-w-lg text-sm leading-8 text-muted-foreground">Разбирай учебные сообщения, находи признаки обмана и тренируй полезные действия. Все примеры вымышлены и работают прямо в браузере.</p><a href="hub.html#practice" className="primary-btn mt-8">Открыть практику <ArrowUpRight size={17}/></a></div><div className="grid gap-3">{[["01","Симулятор сообщений","Находи подозрительные детали в учебных примерах.",Fingerprint],["02","База знаний","Короткие инструкции и понятные объяснения терминов.",BookOpen],["03","Полезные инструменты","Чек-листы для повседневной безопасности.",Smartphone]].map(([n,t,d,I])=><div className="feature-row" key={n as string}><span className="font-mono text-xs text-primary">{n as string}</span><div className="flex-1"><b>{t as string}</b><p>{d as string}</p></div><I size={20} className="text-primary"/></div>)}</div></div></section>
      <section id="about" className="section-shell py-24"><div className="about-panel"><div className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary"><BookOpen size={25}/></div><div><div className="eyebrow">ОТКРЫТЫЙ УЧЕБНЫЙ ПРОЕКТ</div><h2 className="section-title mt-3">Безопасность — это навык,<br/><em>который можно развить.</em></h2><p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground">Курс бесплатный, не требует регистрации и сохраняет учебный прогресс в браузере. Проходи материалы в удобном темпе и возвращайся к сложным темам.</p><a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary" href="classic.html#/project">Подробнее о проекте <ArrowRight size={16}/></a></div></div></section>
    </main>
    <footer className="border-t border-border"><div className="section-shell flex flex-col justify-between gap-6 py-10 sm:flex-row sm:items-end"><div><a href="#" className="brand"><span className="brand-mark"><ShieldCheck size={20}/></span>КИБЕР<span className="text-primary">ГИГИЕНА</span></a><p className="mt-3 text-xs leading-6 text-muted-foreground">Цифровая безопасность начинается<br/>с повседневных привычек.</p></div><div className="flex flex-wrap gap-5 text-xs text-muted-foreground"><a href="classic.html#/course">Обучение</a><a href="hub.html#practice">Практика</a><a href="hub.html#knowledge">База знаний</a><a href="bug-report.html">Сообщить об ошибке</a></div><span className="text-[10px] text-muted-foreground">© Учебный проект · 2026</span></div></footer>
  </div>;
}

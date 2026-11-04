import { ArrowUpRight, BookOpen, FileText, PenSquare, SlidersHorizontal } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";

const sections = [
  { title: "Оформление сайта", desc: "Шрифты и визуальные настройки страниц", href: "fonts.html", action: "Открыть настройки", icon: SlidersHorizontal },
  { title: "Материалы и база знаний", desc: "Редактирование статей, словаря и источников", href: "content.html", action: "Открыть редактор", icon: FileText },
  { title: "Учебные тренажёры", desc: "Создание и публикация учебных сценариев", href: "simulators.html", action: "Открыть конструктор", icon: PenSquare },
];

export default function AdminApp() {
  return <div className="admin-app min-h-screen text-foreground">
    <AppSidebar admin />
    <div className="admin-main">
      <header className="admin-topbar">
        <div><div className="admin-breadcrumb">КИБЕРГИГИЕНА <span>/</span> УПРАВЛЕНИЕ</div><h1>Панель управления</h1></div>
        <a className="admin-avatar" href="/" aria-label="Перейти на сайт">К</a>
      </header>
      <main className="admin-content">
        <section className="admin-welcome">
          <div><div className="admin-kicker">РАЗДЕЛЫ ПРОЕКТА</div><h2>Управляй<br/><em>содержимым сайта.</em></h2><p>Выбери нужный инструмент. Данные и разделы не подменяются демонстрационными показателями.</p></div>
          <a className="admin-button" href="/">Открыть сайт <ArrowUpRight size={16}/></a>
        </section>
        <section className="admin-tools-grid" aria-label="Инструменты управления">
          {sections.map(item => { const Icon = item.icon; return <a className="admin-tool-card" href={item.href} key={item.href}>
            <span className="admin-tool-icon"><Icon size={20}/></span>
            <span className="admin-tool-copy"><b>{item.title}</b><small>{item.desc}</small><strong>{item.action} <ArrowUpRight size={14}/></strong></span>
          </a>; })}
        </section>
        <section className="admin-info-panel">
          <BookOpen size={19}/>
          <div><b>Публичная часть сайта</b><p>Учебный курс, практика и база знаний доступны отдельно от панели управления.</p><a href="/">Перейти к курсу <ArrowUpRight size={13}/></a></div>
        </section>
        <footer className="admin-footer"><span>КИБЕРГИГИЕНА · ПАНЕЛЬ УПРАВЛЕНИЯ</span><a href="/">Вернуться на сайт <ArrowUpRight size={13}/></a></footer>
      </main>
    </div>
  </div>;
}

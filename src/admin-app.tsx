import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock3, FileText, Gauge, Layers3, PenSquare, ShieldCheck, SlidersHorizontal, Users, Zap } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";

const stats = [
  { label: "Учебные модули", value: "06", detail: "Основная программа", icon: Layers3, trend: "Структура курса" },
  { label: "Уроки", value: "18", detail: "3 урока в каждом модуле", icon: BookOpen, trend: "Учебные материалы" },
  { label: "Вопросы тестов", value: "30", detail: "5 вопросов на модуль", icon: CheckCircle2, trend: "Проверка знаний" },
  { label: "Инструменты", value: "03", detail: "Редакторы управления", icon: SlidersHorizontal, trend: "Панель администратора" },
];
const sections = [
  { title: "Настройки оформления", desc: "Шрифты, начертания и визуальные параметры сайта", href: "index.html", label: "Открыть настройки", icon: SlidersHorizontal },
  { title: "Редактор материалов", desc: "Статьи базы знаний, словарь и полезные источники", href: "content.html", label: "Редактировать", icon: FileText },
  { title: "Конструктор тренажёров", desc: "Создание безопасных учебных сценариев", href: "simulators.html", label: "Открыть конструктор", icon: PenSquare },
];
const bars = [42, 68, 52, 86, 61, 94];
export default function AdminApp() {
  return <div className="admin-app min-h-screen bg-background text-foreground">
    <AppSidebar admin/>
    <div className="admin-main">
      <header className="admin-topbar"><div><div className="admin-breadcrumb">ПЛАТФОРМА <span>/</span> УПРАВЛЕНИЕ</div><h1>Обзор</h1></div><div className="flex items-center gap-3"><span className="admin-live"><i/> СИСТЕМА ДОСТУПНА</span><a className="admin-avatar" href="/">К</a></div></header>
      <main className="admin-content">
        <section className="admin-welcome"><div><div className="admin-kicker"><Zap size={13}/> WORKSPACE OVERVIEW</div><h2>Добро пожаловать<br/><em>в панель управления.</em></h2><p>Здесь собраны основные разделы и структура учебной платформы.</p></div><a className="admin-button" href="/classic.html#/course">Открыть сайт <ArrowUpRight size={16}/></a></section>
        <section className="admin-stats">{stats.map((item)=>{const Icon=item.icon;return <article className="admin-stat" key={item.label}><div className="admin-stat-head"><span>{item.label}</span><Icon size={18}/></div><div className="admin-stat-value">{item.value}</div><div className="admin-stat-foot"><span>{item.detail}</span><span className="admin-stat-tag">{item.trend}</span></div></article>;})}</section>
        <section className="admin-grid">
          <article className="admin-panel admin-chart-panel"><div className="admin-panel-head"><div><h3>Структура курса</h3><p>Количество модулей по программе</p></div><span className="admin-period">6 МОДУЛЕЙ</span></div><div className="admin-chart"><div className="admin-chart-y"><span>6</span><span>4</span><span>2</span><span>0</span></div><div className="admin-chart-bars">{bars.map((height,i)=><div className="admin-chart-column" key={i}><div className="admin-bar" style={{height:height+"%"}}/><span>0{i+1}</span></div>)}</div></div><div className="admin-chart-legend"><span><i/> Тематические модули</span><span>3 урока · 5 вопросов в каждом</span></div></article>
          <article className="admin-panel admin-progress-panel"><div className="admin-panel-head"><div><h3>Состав платформы</h3><p>Основные учебные разделы</p></div><Gauge size={18}/></div><div className="admin-ring"><div><strong>06</strong><span>модулей</span></div></div><div className="admin-progress-list"><div><span>Обучение</span><b>18 уроков</b></div><div><span>Тестирование</span><b>30 вопросов</b></div><div><span>Практика</span><b>Тренажёры</b></div></div></article>
        </section>
        <section className="admin-bottom-grid"><article className="admin-panel"><div className="admin-panel-head"><div><h3>Быстрый доступ</h3><p>Управление содержимым проекта</p></div><ArrowUpRight size={18}/></div><div className="admin-quick-list">{sections.map(item=>{const Icon=item.icon;return <a href={item.href} className="admin-quick-row" key={item.href}><span className="admin-quick-icon"><Icon size={18}/></span><span className="admin-quick-copy"><b>{item.title}</b><small>{item.desc}</small></span><ArrowRight size={16}/></a>;})}</div></article>
          <article className="admin-panel admin-activity"><div className="admin-panel-head"><div><h3>Состояние проекта</h3><p>Полезная информация</p></div><Activity size={18}/></div><div className="admin-status-row"><span className="admin-status-icon"><CheckCircle2 size={17}/></span><div><b>Учебные разделы</b><small>Сохранены в проекте</small></div><span className="admin-status-pill">ГОТОВО</span></div><div className="admin-status-row"><span className="admin-status-icon"><Clock3 size={17}/></span><div><b>Прогресс обучения</b><small>Хранится локально в браузере</small></div></div><div className="admin-status-row"><span className="admin-status-icon"><ShieldCheck size={17}/></span><div><b>Публикация</b><small>Через GitHub Pages</small></div></div><div className="admin-note"><b>Важно о доступе</b><p>Эта панель не является серверной авторизацией. Не публикуй секреты и не вводи токены на общих устройствах.</p></div></article></section>
        <footer className="admin-footer"><span>КИБЕРГИГИЕНА · ADMIN WORKSPACE</span><a href="/">Вернуться на сайт <ArrowUpRight size={13}/></a></footer>
      </main>
    </div>
  </div>;
}

import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, CircleHelp, FileText, Home, LayoutDashboard, Menu, PenSquare, ShieldCheck, SlidersHorizontal, Wrench, X } from "lucide-react";

type Props = { admin?: boolean };
const publicGroups = [
  { label: "ПЛАТФОРМА", links: [
    { label: "Главная", href: "/", icon: Home },
    { label: "Обучение", href: "/classic.html#/course", icon: BookOpen },
    { label: "Практика", href: "/hub.html#practice", icon: ShieldCheck },
    { label: "База знаний", href: "/hub.html#knowledge", icon: FileText },
  ]},
  { label: "ИНСТРУМЕНТЫ", links: [
    { label: "Полезные инструменты", href: "/hub.html#tools", icon: Wrench },
    { label: "Центр помощи", href: "/hub.html#help", icon: CircleHelp },
  ]},
];
const adminGroup = { label: "УПРАВЛЕНИЕ", links: [
  { label: "Обзор", href: "/admin/dashboard.html", icon: LayoutDashboard },
  { label: "Оформление", href: "/admin/fonts.html", icon: SlidersHorizontal },
  { label: "Материалы", href: "/admin/content.html", icon: FileText },
  { label: "Тренажёры", href: "/admin/simulators.html", icon: PenSquare },
]};

export function AppSidebar({ admin = false }: Props) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return window.localStorage.getItem("cyber-sidebar-collapsed") === "1"; } catch { return false; }
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.add("has-app-sidebar");
    return () => document.body.classList.remove("has-app-sidebar", "app-sidebar-collapsed", "app-sidebar-open");
  }, []);
  useEffect(() => {
    document.body.classList.toggle("app-sidebar-collapsed", collapsed);
    try { window.localStorage.setItem("cyber-sidebar-collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);
  useEffect(() => {
    document.body.classList.toggle("app-sidebar-open", open);
    return () => document.body.classList.remove("app-sidebar-open");
  }, [open]);
  const groups = admin ? [...publicGroups, adminGroup] : publicGroups;
  return <>
    <button className="app-sidebar-mobile-trigger" onClick={() => setOpen(value => !value)} aria-label="Открыть меню" aria-expanded={open}><Menu/></button>
    {!collapsed && <button className="app-sidebar-desktop-backdrop" type="button" onClick={() => setCollapsed(true)} aria-label="Свернуть боковое меню"/>}
    {open && <button className="app-sidebar-backdrop react-sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Закрыть меню"/>}
    <aside className={`app-sidebar ${open ? "is-open" : ""}`} aria-label="Основная навигация">
      <div className="app-sidebar__brand-row">
        <a className="app-sidebar__brand" href="/"><span className="app-sidebar__mark"><ShieldCheck size={20}/></span><span>КИБЕРГИГИЕНА</span></a>
        <button className="app-sidebar__mobile-close" type="button" onClick={() => setOpen(false)} aria-label="Свернуть меню"><X size={19}/></button>
      </div>
      {groups.map(group => <section className="app-sidebar__group" key={group.label}>
        <div className="app-sidebar__label">{group.label}</div>
        {group.links.map(link => { const Icon = link.icon; const active = location.pathname + location.hash === link.href || (link.href === "/" && location.pathname === "/"); return <a className="app-sidebar__link" key={link.href} href={link.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><span className="app-sidebar__icon"><Icon size={17}/></span><span>{link.label}</span></a>; })}
      </section>)}
      <div className="app-sidebar__bottom"><button className="app-sidebar__collapse" onClick={() => setCollapsed(value => !value)} aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}><ChevronLeft size={17}/><span className="ml-2 text-xs">Свернуть</span></button></div>
    </aside>
  </>;
}

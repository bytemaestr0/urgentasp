import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from "react-router";
import { sb } from "./lib/supabase";
import { useI18n } from "./lib/i18n";
import { DEF, load } from "./lib/settings";
import Home from "./components/Home";
import Instr from "./components/Instructions";
import Cont from "./components/Account";
import Prog from "./components/Booking";
import { Login, Signup, Forgot, Reset } from "./components/Auth";

const LINK_OK = /^(https:\/\/eservicii\.gov\.md\/asp\/dimtcca\/cerere\/[A-Za-z0-9]{3,12}\/Edit\/)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?([?#].*)?$/i;
const LINKS = [["/", "Acasă"], ["/instructiuni", "Instrucțiuni"], ["/programare", "Programare"], ["/cont", "Cont"]];
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Authed({ user, children }) {
  const l = useLocation();
  return user ? <Navigate to={l.state?.from || "/cont"} replace /> : children;
}

const SunIcon = () => (
  <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line key={a} x1="12" y1="2.5" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);
const MoonIcon = () => (
  <svg className="moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function App() {
  const nav = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState(() => localStorage.getItem("urgentasp-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("urgentasp-theme", theme); }, [theme]);
  const { pathname } = useLocation();
  const [s, setS] = useState(load);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const swapping = useRef(false);
  const go = (p) => { nav(p === "home" ? "/" : "/" + p); window.scrollTo(0, 0); };

  /* ---------- animated dark mode: circular reveal from the button (View Transitions), fade fallback ---------- */
  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => { document.documentElement.dataset.theme = next; setTheme(next); };
    if (reduced()) return apply();
    const root = document.documentElement;
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    root.style.setProperty("--tx", x + "px");
    root.style.setProperty("--ty", y + "px");
    root.style.setProperty("--tr", Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + "px");
    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(apply));
    } else {
      root.classList.add("theme-fade");
      apply();
      setTimeout(() => root.classList.remove("theme-fade"), 650);
    }
  };

  /* ---------- animated language switch: content blurs out, text swaps, content blurs back in ---------- */
  const switchLang = () => {
    const next = lang === "ro" ? "ru" : "ro";
    if (reduced()) return setLang(next);
    if (swapping.current) return;
    swapping.current = true;
    const root = document.documentElement;
    root.classList.add("lang-out");
    setTimeout(() => {
      flushSync(() => setLang(next));
      requestAnimationFrame(() => { root.classList.remove("lang-out"); swapping.current = false; });
    }, 230);
  };

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setUser(data.session?.user || null); setReady(true); });
    const { data: l } = sb.auth.onAuthStateChange((ev, ses) => {
      setUser(ses?.user || null);
      if (ev === "PASSWORD_RECOVERY") nav("/reset-password");
    });
    return () => l.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setS(DEF); return; }
    sb.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) setS({ ...DEF, name: data.name || "", email: user.email, plan: data.plan, link: data.link || "", ntfy: data.ntfy || "", freeMode: data.free_mode, auto: data.auto, excluded: data.excluded || [], lastChecked: data.last_checked, lastError: data.last_error, currentExam: data.current_exam_date });
    });
  }, [user]);

  const save = async () => {
    if (s.link && !LINK_OK.test(s.link.trim())) return { error: { message: t("Link sau cod de programare invalid. Copiază linkul complet de pe eservicii.gov.md.") } };
    return doSave();
  };
  const doSave = () => sb.from("profiles").update({ link: s.link.trim(), ntfy: s.ntfy, free_mode: s.freeMode, auto: s.plan === "paid" && s.auto, excluded: s.plan === "paid" ? s.excluded : [] }).eq("id", user.id);

  useEffect(() => {
    const els = [...document.querySelectorAll("main .stripe,main h1,main h2,main .lead,main .row,main .sub,main .card,main .steps li")];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.setAttribute("data-rv", "in");
        const el = e.target;
        setTimeout(() => { el.style.transitionDelay = ""; }, 1000); // so hover effects are not delayed afterwards
        io.unobserve(el);
      }
    }), { threshold: 0.15 });
    els.forEach((el, i) => { el.setAttribute("data-rv", ""); el.style.transitionDelay = (i % 5) * 80 + "ms"; io.observe(el); });
    return () => io.disconnect();
  }, [pathname, ready]);

  const guard = (el) => (!ready ? null : user ? el : <Navigate to="/login" state={{ from: pathname }} replace />);

  return (
    <>
      <div className={"scrim" + (open ? " on" : "")} onClick={() => setOpen(false)} aria-hidden="true" />
      <nav className={(open ? "open " : "") + (scrolled ? "scrolled" : "")}>
        <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu" aria-label={t("Meniu")}>
          <i /><i /><i />
        </button>
        <button className="logo" onClick={() => go("home")}>
          <span className="siren" />
          <span className="wm"><span className="lw">Urgent</span><span className="aw"><span className="ao"><span className="abounce">A</span></span><span className="ac r"><span className="abounce">A</span></span></span><span className="rw">SP</span></span>
        </button>
        <div className="links" id="menu">
          {LINKS.map(([to, label], i) => (
            <NavLink key={to} to={to} end className="l" style={{ "--i": i }} onClick={() => setOpen(false)}>
              <span className="lt">{t(label)}</span>
            </NavLink>
          ))}
        </div>
        <div className="tools">
          <button className="lang" data-v={lang} onClick={switchLang} aria-label="Limba / Язык">
            <i className="thumb" /><span>RO</span><span>RU</span>
          </button>
          <button className="theme" data-t={theme} onClick={toggleTheme} aria-label="Dark mode">
            <SunIcon /><MoonIcon />
          </button>
        </div>
      </nav>
      <main>
        <div className="page" key={pathname}>
          <Routes>
            <Route path="/" element={<Home go={go} />} />
            <Route path="/instructiuni" element={<Instr go={go} />} />
            <Route path="/programare" element={guard(<Prog s={s} set={setS} go={go} save={save} />)} />
            <Route path="/cont" element={guard(<Cont s={s} set={setS} user={user} />)} />
            <Route path="/login" element={<Authed user={user}><Login /></Authed>} />
            <Route path="/signup" element={<Authed user={user}><Signup /></Authed>} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password" element={<Reset go={go} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

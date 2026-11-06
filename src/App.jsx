import { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from "react-router";
import { sb } from "./lib/supabase";
import { useI18n } from "./lib/i18n";
import { DEF, load } from "./lib/settings";
import Home from "./components/Home";
import Instr from "./components/Instructions";
import Cont from "./components/Account";
import Prog from "./components/Booking";
import { Login, Signup, Forgot, Reset } from "./components/Auth";

const LINKS = [["/", "Acasă"], ["/instructiuni", "Instrucțiuni"], ["/programare", "Programare"], ["/cont", "Cont"]];

function Authed({ user, children }) {
  const l = useLocation();
  return user ? <Navigate to={l.state?.from || "/cont"} replace /> : children;
}

export default function App() {
  const nav = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState(() => localStorage.getItem("urgentasp-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("urgentasp-theme", theme); }, [theme]);
  const { pathname } = useLocation();
  const [s, setS] = useState(load);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const go = (p) => { nav(p === "home" ? "/" : "/" + p); window.scrollTo(0, 0); };

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
      if (data) setS({ ...DEF, name: data.name || "", email: user.email, plan: data.plan, link: data.link || "", ntfy: data.ntfy || "", freeMode: data.free_mode, auto: data.auto, excluded: data.excluded || [] });
    });
  }, [user]);

  const save = async () => {
    if (s.link && !/^https:\/\/[^\s]+$/i.test(s.link)) return { error: { message: t("Linkul trebuie să înceapă cu https://") } };
    return doSave();
  };
  const doSave = () => sb.from("profiles").update({ link: s.link, ntfy: s.ntfy, free_mode: s.freeMode, auto: s.plan === "paid" && s.auto, excluded: s.plan === "paid" ? s.excluded : [] }).eq("id", user.id);

  useEffect(() => {
    const els = [...document.querySelectorAll("main .stripe,main h1,main h2,main .lead,main .row,main .sub,main .card,main .steps li")];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.setAttribute("data-rv", "in"); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    els.forEach((el, i) => { el.setAttribute("data-rv", ""); el.style.transitionDelay = (i % 5) * 80 + "ms"; io.observe(el); });
    return () => io.disconnect();
  }, [pathname, ready]);

  const guard = (el) => (!ready ? null : user ? el : <Navigate to="/login" state={{ from: pathname }} replace />);

  return (
    <>
      <nav>
        <button className="logo" onClick={() => go("home")}>
          <span className="siren" />
          <span className="wm"><span className="lw">Urgent</span><span className="aw"><span className="ao"><span className="abounce">A</span></span><span className="ac r"><span className="abounce">A</span></span></span><span className="rw">SP</span></span>
        </button>
        {LINKS.map(([to, label]) => <NavLink key={to} to={to} end className="l">{t(label)}</NavLink>)}
        <button className="l tg" onClick={() => setLang(lang === "ro" ? "ru" : "ro")} aria-label="Limba / Язык">{lang === "ro" ? "RU" : "RO"}</button>
        <button className="l tg" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Dark mode">{theme === "dark" ? "☀️" : "🌙"}</button>
      </nav>
      <main>
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
      </main>
    </>
  );
}

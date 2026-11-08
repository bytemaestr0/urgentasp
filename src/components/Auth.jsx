import { useState } from "react";
import { Link } from "react-router";
import { sb, SITE_URL } from "../lib/supabase";
import { useI18n } from "../lib/i18n";

const ro = (m) => ({
  "Invalid login credentials": "Email sau parolă greșită.",
  "Email not confirmed": "Confirmă mai întâi emailul din mesajul primit.",
  "User already registered": "Există deja un cont cu acest email.",
}[m] || m);

function Shell({ title, sub, children, foot }) {
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2>{title}</h2>
        <p className="sub">{sub}</p>
        {children}
        <div className="auth-foot">{foot}</div>
      </div>
    </div>
  );
}

function Field({ id, label, ...p }) {
  return (<><label className="f" htmlFor={id}>{label}</label><input id={id} {...p} /></>);
}

export function Login() {
  const { t } = useI18n();
  const [em, setEm] = useState(() => localStorage.getItem("urgentasp-email") || "");
  const [pw, setPw] = useState("");
  const [rem, setRem] = useState(() => localStorage.getItem("urgentasp-remember") !== "0");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg("");
    localStorage.setItem("urgentasp-remember", rem ? "1" : "0");
    const { error } = await sb.auth.signInWithPassword({ email: em, password: pw });
    if (error) setMsg(t(ro(error.message)));
    else if (rem) localStorage.setItem("urgentasp-email", em);
    else localStorage.removeItem("urgentasp-email");
    setBusy(false);
  };

  return (
    <Shell title={t("Autentificare")} sub={t("Intră în cont ca să-ți gestionezi programările.")}
      foot={<>{t("Nu ai cont?")} <Link to="/signup">{t("Creează cont")}</Link></>}>
      <form onSubmit={submit}>
        <Field id="le" label={t("Email")} type="email" value={em} onChange={(e) => setEm(e.target.value)} autoComplete="email" required />
        <Field id="lp" label={t("Parolă")} type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
        <div className="auth-opts">
          <label className="rem"><input type="checkbox" checked={rem} onChange={(e) => setRem(e.target.checked)} /> {t("Ține-mă minte")}</label>
          <Link to="/forgot-password">{t("Am uitat parola")}</Link>
        </div>
        {msg && <p className="err">{msg}</p>}
        <button className="btn block" disabled={busy}>{t("Intră în cont")}</button>
      </form>
    </Shell>
  );
}

export function Signup() {
  const { t } = useI18n();
  const [nm, setNm] = useState(""); const [em, setEm] = useState("");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    if (pw.length < 6) return setMsg(t("Parola trebuie să aibă cel puțin 6 caractere."));
    if (pw !== pw2) return setMsg(t("Parolele nu coincid."));
    setBusy(true);
    const { data, error } = await sb.auth.signUp({ email: em, password: pw, options: { data: { name: nm }, emailRedirectTo: SITE_URL + "/login" } });
    if (error) setMsg(t(ro(error.message)));
    else if (!data.session) setOk(true);
    setBusy(false);
  };

  return (
    <Shell title={t("Creează cont")} sub={t("Contul îți salvează setările și planul.")}
      foot={<>{t("Ai deja cont?")} <Link to="/login">{t("Autentifică-te")}</Link></>}>
      {ok ? <p className="okmsg">{t("Cont creat. Verifică emailul și confirmă adresa, apoi autentifică-te.")}</p> :
      <form onSubmit={submit}>
        <Field id="sn" label={t("Nume")} type="text" value={nm} onChange={(e) => setNm(e.target.value)} autoComplete="name" />
        <Field id="se" label={t("Email")} type="email" value={em} onChange={(e) => setEm(e.target.value)} autoComplete="email" required />
        <Field id="sp" label={t("Parolă")} type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" required />
        <Field id="sp2" label={t("Confirmă parola")} type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
        {msg && <p className="err">{msg}</p>}
        <button className="btn block" disabled={busy} style={{ marginTop: 18 }}>{t("Creează cont")}</button>
      </form>}
    </Shell>
  );
}

export function Forgot() {
  const { t } = useI18n();
  const [em, setEm] = useState(""); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const { error } = await sb.auth.resetPasswordForEmail(em, { redirectTo: SITE_URL + "/reset-password" });
    if (error) setMsg(t(ro(error.message))); else setOk(true);
    setBusy(false);
  };
  return (
    <Shell title={t("Resetează parola")} sub={t("Îți trimitem un link de resetare pe email.")}
      foot={<><Link to="/login">{t("Înapoi la autentificare")}</Link></>}>
      {ok ? <p className="okmsg">{t("Dacă există un cont cu acest email, ți-am trimis linkul de resetare.")}</p> :
      <form onSubmit={submit}>
        <Field id="fe" label={t("Email")} type="email" value={em} onChange={(e) => setEm(e.target.value)} autoComplete="email" required />
        {msg && <p className="err">{msg}</p>}
        <button className="btn block" disabled={busy} style={{ marginTop: 18 }}>{t("Trimite linkul")}</button>
      </form>}
    </Shell>
  );
}

export function Reset({ go }) {
  const { t } = useI18n();
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    if (pw.length < 6) return setMsg(t("Parola trebuie să aibă cel puțin 6 caractere."));
    if (pw !== pw2) return setMsg(t("Parolele nu coincid."));
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) setMsg(t(ro(error.message))); else { setOk(true); setTimeout(() => go("cont"), 1500); }
  };
  return (
    <Shell title={t("Parolă nouă")} sub={t("Alege o parolă nouă pentru contul tău.")} foot={null}>
      {ok ? <p className="okmsg">{t("Parola a fost schimbată.")}</p> :
      <form onSubmit={submit}>
        <Field id="rp" label={t("Parolă nouă")} type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" required />
        <Field id="rp2" label={t("Confirmă parola")} type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
        {msg && <p className="err">{msg}</p>}
        <button className="btn block" style={{ marginTop: 18 }}>{t("Schimbă parola")}</button>
      </form>}
    </Shell>
  );
}

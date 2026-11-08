import { useState, useEffect } from "react";
import { useI18n } from "../lib/i18n";

// Cheia Web3Forms (publică prin design) se setează în .env: VITE_WEB3FORMS_KEY
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";

function Report({ s }) {
  const { t, lang } = useI18n();
  const [nm, setNm] = useState("");
  const [em, setEm] = useState("");
  const [msg, setMsg] = useState("");
  const [bot, setBot] = useState(false);
  const [st, setSt] = useState("idle"); // idle | sending | ok
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!nm && s.name) setNm(s.name);
    if (!em && s.email) setEm(s.email);
  }, [s.name, s.email]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!KEY) return setErr(t("Formularul nu este configurat încă."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim())) return setErr(t("Introdu o adresă de email validă."));
    if (msg.trim().length < 10) return setErr(t("Mesajul trebuie să aibă cel puțin 10 caractere."));
    setSt("sending");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY,
          subject: "UrgentASP – problemă raportată",
          from_name: "UrgentASP",
          name: nm.trim(),
          email: em.trim(),
          message: msg.trim(),
          cod_unic: s.payCode || "-",
          plan: s.plan,
          limba: lang,
          pagina: window.location.href,
          browser: navigator.userAgent,
          botcheck: bot,
        }),
      });
      const d = await r.json();
      if (d.success) { setSt("ok"); setMsg(""); }
      else { setSt("idle"); setErr(d.message || t("Nu am putut trimite mesajul. Încearcă din nou.")); }
    } catch (_) {
      setSt("idle");
      setErr(t("Nu am putut trimite mesajul. Încearcă din nou."));
    }
  };

  return <div className="auth-wrap"><div className="card auth-card" style={{ maxWidth: 560 }}>
    <h2>{t("Raportează o problemă")}</h2>
    <p className="sub">{t("Ai întâmpinat o eroare sau ceva nu funcționează? Scrie-ne și îți răspundem pe email.")}</p>
    {st === "ok" ? <div className="sent">
      <div className="tick">✓</div>
      <p className="okmsg">{t("Mesajul tău a fost trimis. Mulțumim!")}</p>
      <button type="button" className="btn ghost block" style={{ marginTop: 16 }} onClick={() => setSt("idle")}>{t("Trimite alt mesaj")}</button>
    </div> : <form onSubmit={submit} noValidate>
      <label className="f" htmlFor="rn">{t("Nume")}</label>
      <input id="rn" type="text" value={nm} onChange={(e) => setNm(e.target.value)} autoComplete="name" maxLength={80} />
      <label className="f" htmlFor="re">{t("Email")}</label>
      <input id="re" type="email" value={em} onChange={(e) => setEm(e.target.value)} autoComplete="email" required />
      <label className="f" htmlFor="rm">{t("Descrie problema")}</label>
      <textarea id="rm" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t("Ce s-a întâmplat? Ce ai încercat să faci?")} maxLength={3000} required />
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" checked={bot} onChange={(e) => setBot(e.target.checked)} aria-hidden="true" />
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn block" style={{ marginTop: 18 }} disabled={st === "sending"}>{st === "sending" ? t("Se trimite…") : t("Trimite")}</button>
    </form>}
  </div></div>;
}

export default Report;

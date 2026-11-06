import { useI18n } from "../lib/i18n";

// NOTE: these are SAMPLE testimonials (placeholders). Replace them with real feedback
// from real users (with their permission) before launching publicly.
const REVIEWS = [
  { q: "Căutam de două luni o dată liberă pentru examen. În a treia zi cu UrgentASP am primit notificarea și am prins un loc cu o săptămână mai devreme.", n: "Andrei M.", c: "Chișinău" },
  { q: "Nu mai stau cu pagina deschisă noaptea. Telefonul sună când apare ceva, iar linkul l-am pus în două minute.", n: "Elena C.", c: "Bălți" },
  { q: "Cu planul Plus am exclus zilele în care lucrez și restul s-a făcut singur. Cel mai bun mod de a scăpa de stresul programării.", n: "Dmitri P.", c: "Cahul" },
];

function Home({ go }) {
  const { t } = useI18n();
  return <>
    <section className="hero">
      <div>
        <div className="pill"><i />{t("Monitorizare activă 24/7")}</div>
        <div className="stripe" />
        <h1>{t("Programări la ASP, înainte să te prindă alții.")}</h1>
        <p className="lead">{t("UrgentASP urmărește locurile libere non-stop și îți trimite notificare pe telefon în secunda în care apare o dată. Fără refresh la pagină la 3 dimineața.")}</p>
        <div className="row"><button className="btn" onClick={() => go("cont")}>{t("Începe acum")}</button><button className="btn ghost" onClick={() => go("instructiuni")}>{t("Cum funcționează")}</button></div>
      </div>
    </section>
    <div className="grid3">
      <div className="card"><div className="ico">⚡</div><h3>{t("Programare rapidă")}</h3><p>{t("Verificăm datele disponibile continuu și te anunțăm instant, ca să ajungi primul la loc.")}</p></div>
      <div className="card"><div className="ico b">🔔</div><h3>{t("Notificări ntfy")}</h3><p>{t("Primești alerta direct pe telefon, fără cont și fără aplicații grele.")}</p></div>
      <div className="card"><div className="ico r">🤖</div><h3>{t("Autoprogramare")}</h3><p>{t("Cu planul Plus, rezervăm noi locul pentru tine și sărim peste zilele pe care le excluzi.")}</p></div>
    </div>
    <section className="tsec">
      <div className="thead">
        <div className="stripe" />
        <h2>{t("Ce spun utilizatorii")}</h2>
        <p className="sub">{t("Oameni care au prins un loc înaintea celorlalți.")}</p>
      </div>
      <div className="tgrid">
        {REVIEWS.map((r) => (
          <figure className="card tcard" key={r.n}>
            <div className="stars" aria-label="5/5">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--i": i }}>★</i>)}</div>
            <blockquote>{t(r.q)}</blockquote>
            <figcaption className="who">
              <span className="av">{r.n[0]}</span>
              <span><b>{t(r.n)}</b><small>{t(r.c)}</small></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  </>;
}

export default Home;

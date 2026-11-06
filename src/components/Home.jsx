import { useI18n } from "../lib/i18n";

function Home({go}){const {t}=useI18n();return <>
  <section className="hero">
    <div>
      <div className="stripe"/>
      <h1>{t("Programări la ASP, înainte să te prindă alții.")}</h1>
      <p className="lead">{t("UrgentASP urmărește locurile libere non-stop și îți trimite notificare pe telefon în secunda în care apare o dată. Fără refresh la pagină la 3 dimineața.")}</p>
      <div className="row"><button className="btn" onClick={()=>go("cont")}>{t("Începe acum")}</button><button className="btn ghost" onClick={()=>go("instructiuni")}>{t("Cum funcționează")}</button></div>
    </div>
  </section>
  <div className="grid3">
    <div className="card"><h3>{t("Programare rapidă")}</h3><p>{t("Verificăm datele disponibile continuu și te anunțăm instant, ca să ajungi primul la loc.")}</p></div>
    <div className="card"><h3>{t("Notificări ntfy")}</h3><p>{t("Primești alerta direct pe telefon, fără cont și fără aplicații grele.")}</p></div>
    <div className="card"><h3>{t("Autoprogramare")}</h3><p>{t("Cu planul Plus, rezervăm noi locul pentru tine și sărim peste zilele pe care le excluzi.")}</p></div>
  </div></>}

export default Home;

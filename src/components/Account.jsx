import { useI18n } from "../lib/i18n";
import { sb } from "../lib/supabase";

function Cont({s,set,user}){
  const {t}=useI18n();
  const upd=(p)=>set({...s,...p});
  return <>
    <h2>{t("Cont")}</h2><p className="sub">{t("Planul tău:")} <span className={"badge "+(s.plan==="paid"?"paid":"")}>{s.plan==="paid"?t("Plus (plătit)"):t("Gratuit")}</span></p>
    <div className="card" style={{marginBottom:20}}>
      <label className="f" htmlFor="nm" style={{marginTop:0}}>{t("Nume")}</label>
      <input id="nm" type="text" value={s.name} onChange={e=>upd({name:e.target.value})} onBlur={()=>sb.from("profiles").update({name:s.name}).eq("id",user.id)} placeholder="Ion Popescu"/>
      <label className="f" htmlFor="em">{t("Email")}</label>
      <input id="em" type="email" value={s.email} readOnly/>
    </div>
    <div className="plans">
      <div className={"card plan "+(s.plan==="free"?"cur":"")}>
        <h3>{t("Gratuit")}</h3><div className="price">0 {t("lei")}</div>
        <ul><li>{t("Alerte ntfy")}</li><li>{t("Doar date noi sau toate datele")}</li><li>{t("Fără autoprogramare")}</li></ul>
        <button className="btn ghost" disabled>{s.plan==="free"?t("Plan activ"):t("Gratuit")}</button>
      </div>
      <div className={"card plan "+(s.plan==="paid"?"cur":"")}>
        <h3>Plus</h3><div className="price">200 {t("lei")}<small style={{fontSize:14,fontWeight:400}}> / {t("lună")}</small></div>
        <ul><li>{t("Tot din Gratuit")}</li><li>{t("Autoprogramare cu date excluse")}</li><li>{t("Verificare prioritară")}</li></ul>
        <button className="btn" disabled>{s.plan==="paid"?t("Plan activ"):t("Plata se activează în curând")}</button>
      </div>
    </div>
    <div className="row"><button className="btn ghost" onClick={()=>sb.auth.signOut()}>{t("Ieși din cont")}</button></div>
  </>}

export default Cont;

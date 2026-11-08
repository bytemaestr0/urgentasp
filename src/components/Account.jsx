import { useState } from "react";
import { useI18n } from "../lib/i18n";
import { sb } from "../lib/supabase";

// Destinatarul plății MIA (număr de telefon / IDNO / IBAN etc.). Se setează în .env: VITE_MIA_RECIPIENT
const MIA_RECIPIENT = import.meta.env.VITE_MIA_RECIPIENT || "";
const PRICE = 200;

function Copy({text}){
  const {t}=useI18n();
  const [ok,setOk]=useState(false);
  const copy=async()=>{
    try{await navigator.clipboard.writeText(text)}catch(e){
      const a=document.createElement("textarea");a.value=text;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove();
    }
    setOk(true);setTimeout(()=>setOk(false),1800);
  };
  return <button type="button" className={"copy"+(ok?" ok":"")} onClick={copy}>{ok?t("Copiat")+" ✓":t("Copiază")}</button>;
}

function Cont({s,set,user}){
  const {t}=useI18n();
  const [pay,setPay]=useState(false);
  const msg=s.payCode?"cod unic: "+s.payCode:"";
  const upd=(p)=>set({...s,...p});
  return <>
    <h2>{t("Cont")}</h2><p className="sub">{t("Planul tău:")} <span className={"badge "+(s.plan==="paid"?"paid":"")}>{s.plan==="paid"?t("Plus (plătit)"):t("Gratuit")}</span></p>
    <div className="card" style={{marginBottom:20}}>
      <label className="f" htmlFor="nm" style={{marginTop:0}}>{t("Nume")}</label>
      <input id="nm" type="text" value={s.name} onChange={e=>upd({name:e.target.value})} onBlur={()=>sb.from("profiles").update({name:s.name}).eq("id",user.id)} placeholder="Ion Popescu"/>
      <label className="f" htmlFor="em">{t("Email")}</label>
      <input id="em" type="email" value={s.email} readOnly/>
      {s.payCode&&<><label className="f">{t("Cod unic")}</label><div className="copybox"><code>{s.payCode}</code><Copy text={s.payCode}/></div></>}
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
        <button className="btn" disabled={s.plan==="paid"} onClick={()=>setPay(!pay)} aria-expanded={pay}>{s.plan==="paid"?t("Plan activ"):t("Activează Plus")}</button>
      </div>
    </div>
    {pay&&s.plan!=="paid"&&<div className="card pay">
      <h3>{t("Plată prin MIA")}</h3>
      <p className="sub" style={{marginBottom:14}}>{t("Fă un transfer instant prin MIA din aplicația băncii tale cu datele de mai jos.")}</p>
      <div className="payrow"><span>{t("Sumă")}</span><b>{PRICE} {t("lei")}</b></div>
      {MIA_RECIPIENT&&<div className="payrow"><span>{t("Destinatar")}</span><div className="copybox"><code>{MIA_RECIPIENT}</code><Copy text={MIA_RECIPIENT}/></div></div>}
      <div className="payrow col"><span>{t("Mesaj (obligatoriu, exact ca mai jos)")}</span>
        {msg?<div className="copybox big"><code>{msg}</code><Copy text={msg}/></div>:<em>{t("Codul tău se generează. Reîncarcă pagina.")}</em>}
      </div>
      <p className="lock">{t("Planul Plus se activează după ce confirmăm plata. Fără codul unic în mesaj, nu putem asocia plata contului tău.")}</p>
    </div>}
    <div className="row"><button className="btn ghost" onClick={()=>sb.auth.signOut()}>{t("Ieși din cont")}</button></div>
  </>}

export default Cont;

import { useI18n } from "../lib/i18n";
import { useState } from "react";

function Prog({s,set,go,save}){
  const {t,lang}=useI18n();
  const [d,setD]=useState("");const [ok,setOk]=useState(false);
  const paid=s.plan==="paid";
  const upd=(p)=>{set({...s,...p});setOk(false)};
  const addD=()=>{if(d&&!s.excluded.includes(d)){upd({excluded:[...s.excluded,d].sort()});setD("")}};
  const fmt=x=>x.split("-").reverse().join(".");
  return <>
    <h2>{t("Programare")}</h2><p className="sub">{t("Setările căutării tale. Plan:")} <span className={"badge "+(paid?"paid":"")}>{paid?"Plus":t("Gratuit")}</span></p>
    <div className="card">
      <label className="f" htmlFor="lk" style={{marginTop:0}}>{t("Link programare")}</label>
      <input id="lk" type="text" value={s.link} onChange={e=>upd({link:e.target.value})} placeholder="https://eservicii.gov.md/asp/dimtcca/cerere/APO01/Edit/..."/>
      <label className="f" htmlFor="nt">{t("Cod ntfy (topic)")}</label>
      <input id="nt" type="text" value={s.ntfy} onChange={e=>upd({ntfy:e.target.value.replace(/[^A-Za-z0-9_-]/g,"").slice(0,64)})} placeholder="urgentasp-ion-2026"/>
      {s.ntfy&&<p className="sub" style={{margin:"6px 0 0"}}>{t("Notificările merg la")} <code>ntfy.sh/{s.ntfy}</code></p>}

      <>
        <label className="f">{t("Ce date vrei să primești?")}</label>
        <div className="seg">
          <label className={s.freeMode==="new"?"on":""}><input type="radio" name="m" checked={s.freeMode==="new"} onChange={()=>upd({freeMode:"new"})}/><span><b>{t("Doar date mai noi")}</b><br/><small>{t("Te anunțăm doar când apar locuri mai devreme decât cele cunoscute.")}</small></span></label>
          <label className={s.freeMode==="all"?"on":""}><input type="radio" name="m" checked={s.freeMode==="all"} onChange={()=>upd({freeMode:"all"})}/><span><b>{t("Toate datele disponibile")}</b><br/><small>{t("Primești alertă pentru orice loc liber.")}</small></span></label>
        </div>
        {!paid&&<div className="lock">{t("Autoprogramarea și datele excluse sunt în planul Plus.")} <button className="btn" style={{padding:"6px 14px",marginLeft:6}} onClick={()=>go("cont")}>{t("Vezi planurile")}</button></div>}
      </>

      <div style={{marginTop:18}}>
        <label className={"chk "+(paid?"":"off")}><input type="checkbox" disabled={!paid} checked={paid&&s.auto} onChange={e=>upd({auto:e.target.checked})}/><span>{t("Autoprogramare")} {!paid&&<span className="badge paid">Plus</span>}<small>{t("Rezervăm automat primul loc care nu e într-o dată exclusă.")}</small></span></label>
      </div>

      {paid&&<>
        <label className="f" htmlFor="ex">{t("Date excluse pentru autoprogramare")}</label>
        <div style={{display:"flex",gap:8}}><input id="ex" type="date" value={d} onChange={e=>setD(e.target.value)}/><button className="btn" onClick={addD}>{t("Adaugă")}</button></div>
        <div className="chips">{s.excluded.length===0&&<small style={{color:"var(--mut)"}}>{t("Nicio dată exclusă.")}</small>}
          {s.excluded.map(x=><span className="chip" key={x}>{fmt(x)}<button aria-label={t("Șterge")+" "+fmt(x)} onClick={()=>upd({excluded:s.excluded.filter(y=>y!==x)})}>×</button></span>)}</div>
      </>}

      {s.lastChecked&&<p className="sub" style={{margin:"18px 0 0"}}>{t("Ultima verificare:")} {new Date(s.lastChecked).toLocaleString(lang==="ru"?"ru-RU":"ro-RO")}{s.currentExam&&<> · {t("Programarea ta actuală:")} {s.currentExam.split("-").reverse().join(".")}</>}</p>}
      {s.lastError&&<p className="err">{s.lastError}</p>}
      <div className="row"><button className="btn" onClick={async()=>{const {error}=await save();if(error){alert(error.message)}setOk(!error)}}>{t("Salvează setările")}</button>{ok&&<span className="saved" style={{alignSelf:"center"}}>{t("Salvat ✓")}</span>}</div>
    </div></>}

export default Prog;

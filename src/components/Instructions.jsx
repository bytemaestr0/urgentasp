import { useState } from "react";
import { useI18n } from "../lib/i18n";

function Art({i}){
  const {t}=useI18n();
  const W={fill:"#fff"};
  return <svg className="art" viewBox="0 0 320 180" role="img" aria-label={t("Ilustrație pasul")+" "+(i+1)}>
    {i===0&&<g><rect x="90" y="8" width="140" height="164" rx="18" className="fc"/><circle cx="160" cy="62" r="26" className="fy"/><text x="160" y="72" textAnchor="middle" style={{fontSize:28}}>🔔</text><text x="160" y="108" textAnchor="middle">ntfy</text><rect x="100" y="122" width="120" height="26" rx="13" className="fm"/><text x="160" y="139" textAnchor="middle" style={{fontSize:9}}>urgentasp-ion-2026</text></g>}
    {i===1&&<g><rect x="30" y="16" width="260" height="148" rx="10" className="fc"/><rect x="44" y="28" width="200" height="20" rx="10" className="fy"/><text x="54" y="42" style={{fontSize:10}}>https://programare.asp.md/...</text><rect x="252" y="26" width="28" height="24" rx="7" className="fb"/><text x="266" y="43" textAnchor="middle" style={{fontSize:13}}>📋</text><rect x="44" y="68" width="150" height="12" rx="4" className="fm"/><rect x="44" y="92" width="232" height="12" rx="4" className="fm"/><rect x="44" y="116" width="190" height="12" rx="4" className="fm"/></g>}
    {i===2&&<g><rect x="50" y="10" width="220" height="160" rx="12" className="fc"/><rect x="66" y="26" width="188" height="24" rx="6" className="fm"/><text x="76" y="42" style={{fontSize:10}}>{t("Link programare")}</text><rect x="66" y="58" width="188" height="24" rx="6" className="fm"/><text x="76" y="74" style={{fontSize:10}}>{t("Cod ntfy")}</text><rect x="66" y="94" width="36" height="20" rx="10" className="fb"/><circle cx="92" cy="104" r="7" fill="#fff"/><text x="110" y="108" style={{fontSize:10}}>{t("Autoprogramare")}</text><rect x="66" y="128" width="188" height="28" rx="8" className="fy"/><text x="160" y="146" textAnchor="middle">{t("Salvează")}</text></g>}
    {i===3&&<g><rect x="90" y="8" width="140" height="164" rx="18" className="fc"/><rect x="98" y="28" width="124" height="46" rx="10" className="fr"/><text x="110" y="48" style={W}>🔔 {t("Loc liber!")}</text><text x="110" y="64" style={{...W,fontSize:10}}>{t("joi")} 14:20</text><circle cx="160" cy="124" r="26" className="fb"/><text x="160" y="134" textAnchor="middle" style={{...W,fontSize:28}}>✓</text></g>}
  </svg>}

function Instr({go}){
  const {t}=useI18n();
  const [i,setI]=useState(0);
  const S=[
    [t("Instalează ntfy"),<>{t("Descarcă aplicația ntfy pe telefon (Android sau iOS) și abonează-te la un topic ales de tine, de exemplu")} <code>urgentasp-ion-2026</code>. {t("Alege ceva greu de ghicit.")}</>],
    [t("Copiază linkul de programare"),<>{t("Deschide pagina de programare a ASP pentru serviciul dorit și copiază adresa din bara browserului.")}</>],
    [t("Completează setările"),<>{t("La pagina Programare lipește linkul și codul ntfy, apoi alege ce date vrei: doar cele noi sau toate cele disponibile.")}</>],
    [t("Așteaptă alerta"),<>{t("Când apare un loc, primești notificarea. Cu planul Plus, activează Autoprogramare și lasă-ne să rezervăm noi.")}</>]
  ];
  const last=i===S.length-1;
  return <>
    <h2>{t("Instrucțiuni")}</h2><p className="sub">{t("Pasul {n} din {total}",{n:i+1,total:S.length})}</p>
    <div className="dots">{S.map((_,k)=><i key={k} className={k<=i?"on":""}/>)}</div>
    <div className="card"><div className="stepin" key={i}>
      <Art i={i}/>
      <h3>{S[i][0]}</h3><p>{S[i][1]}</p>
    </div></div>
    <div className="row">
      {i>0&&<button className="btn ghost" onClick={()=>setI(i-1)}>{t("Înapoi")}</button>}
      <button className="btn" onClick={()=>last?go("programare"):setI(i+1)}>{last?t("Mergi la Programare"):t("Următorul pas")}</button>
    </div>
  </>}

export default Instr;

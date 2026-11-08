import { useState, useRef } from "react";
import { useI18n } from "../lib/i18n";

function Art({i}){
  const {t}=useI18n();
  const W={fill:"var(--bg)"};
  return <svg className="art" viewBox="0 0 320 180" role="img" aria-label={t("Ilustrație pasul")+" "+(i+1)}>
    {i===0&&<g><rect x="90" y="8" width="140" height="164" rx="18" className="fc"/><circle cx="160" cy="62" r="26" className="fy"/><text x="160" y="72" textAnchor="middle" style={{fontSize:28}}>🔔</text><text x="160" y="108" textAnchor="middle">ntfy</text><rect x="100" y="122" width="120" height="26" rx="13" className="fm"/><text x="160" y="139" textAnchor="middle" style={{fontSize:9}}>urgentasp-ion-2026</text></g>}
    {i===1&&<g><rect x="30" y="16" width="260" height="148" rx="10" className="fc"/><rect x="44" y="28" width="200" height="20" rx="10" className="fy"/><text x="54" y="42" style={{fontSize:10}}>https://programare.asp.md/...</text><rect x="252" y="26" width="28" height="24" rx="7" className="fb"/><text x="266" y="43" textAnchor="middle" style={{fontSize:13}}>📋</text><rect x="44" y="68" width="150" height="12" rx="4" className="fm"/><rect x="44" y="92" width="232" height="12" rx="4" className="fm"/><rect x="44" y="116" width="190" height="12" rx="4" className="fm"/></g>}
    {i===2&&<g><rect x="50" y="10" width="220" height="160" rx="12" className="fc"/><rect x="66" y="26" width="188" height="24" rx="6" className="fm"/><text x="76" y="42" style={{fontSize:10}}>{t("Link programare")}</text><rect x="66" y="58" width="188" height="24" rx="6" className="fm"/><text x="76" y="74" style={{fontSize:10}}>{t("Cod ntfy")}</text><rect x="66" y="94" width="36" height="20" rx="10" className="fb"/><circle cx="92" cy="104" r="7" style={{fill:"var(--bg)"}}/><text x="110" y="108" style={{fontSize:10}}>{t("Autoprogramare")}</text><rect x="66" y="128" width="188" height="28" rx="8" className="fy"/><text x="160" y="146" textAnchor="middle">{t("Salvează")}</text></g>}
    {i===3&&<g><rect x="90" y="8" width="140" height="164" rx="18" className="fc"/><rect x="98" y="28" width="124" height="46" rx="10" className="fr"/><text x="110" y="48" style={W}>🔔 {t("Loc liber!")}</text><text x="110" y="64" style={{...W,fontSize:10}}>{t("joi")} 14:20</text><circle cx="160" cy="124" r="26" className="fb"/><text x="160" y="134" textAnchor="middle" style={{...W,fontSize:28}}>✓</text></g>}
  </svg>}

// Pozele se pun în public/instructiuni/ (vezi README.txt de acolo). Se acceptă .png, .jpg sau .webp.
const EXT=[".png",".jpg",".webp"];
const Chev=({d})=><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d==="l"?"M15 5l-7 7 7 7":"M9 5l7 7-7 7"}/></svg>;

function Shot({base,alt}){
  const {t}=useI18n();
  const [e,setE]=useState(0);
  return e<EXT.length
    ? <img src={base+EXT[e]} alt={alt} draggable="false" onError={()=>setE(e+1)}/>
    : <div className="ph"><span>📷</span>{t("Imaginea va apărea în curând")}</div>;
}

function Gallery({name,n=5,label,ratio=0.5}){
  const {t}=useI18n();
  const [k,setK]=useState(0);
  const x0=useRef(null);
  const to=(v)=>setK(Math.max(0,Math.min(n-1,v)));
  return <div className="gal">
    {label&&<div className="gal-l">{label}</div>}
    <div className="gal-v" style={{"--ar":ratio}}
      onPointerDown={e=>{x0.current=e.clientX}}
      onPointerUp={e=>{if(x0.current!=null){const d=e.clientX-x0.current;if(Math.abs(d)>40)to(k+(d<0?1:-1));x0.current=null}}}
      onPointerCancel={()=>{x0.current=null}}>
      <div className="gal-t" style={{transform:`translateX(-${k*100}%)`}}>
        {Array.from({length:n},(_,j)=><div className="gal-s" key={j}><Shot base={`/instructiuni/${name}-${j+1}`} alt={`${label||t("Ilustrație pasul")} ${j+1}/${n}`}/></div>)}
      </div>
    </div>
    <div className="gal-c">
      <button type="button" className="gbtn" disabled={k===0} onClick={()=>to(k-1)} aria-label={t("Poza anterioară")}><Chev d="l"/></button>
      <span className="gal-n">{k+1} / {n}</span>
      <button type="button" className="gbtn" disabled={k===n-1} onClick={()=>to(k+1)} aria-label={t("Poza următoare")}><Chev d="r"/></button>
    </div>
    <div className="gal-d">{Array.from({length:n},(_,j)=><i key={j} className={j===k?"on":""} onClick={()=>to(j)}/>)}</div>
  </div>;
}

function Instr({go}){
  const {t}=useI18n();
  const [i,setI]=useState(0);
  const S=[
    [t("Instalează și configurează ntfy"),<>{t("Descarcă aplicația ntfy pe telefon (Android sau iOS) și abonează-te la un topic ales de tine, de exemplu")} <code>urgentasp-ion-2026</code>. {t("Alege ceva greu de ghicit.")} {t("Urmează pozele pentru telefonul tău, pas cu pas.")}</>,
      <div className="duo"><Gallery name="ios" label="iOS" ratio={0.46}/><Gallery name="android" label="Android" ratio={0.46}/></div>],
    [t("Obține linkul de modificare a programării"),<>{t("Deschide programarea ta pe site-ul ASP și copiază linkul paginii de modificare (cel care conține /Edit/). Pozele arată pașii.")}</>,
      <Gallery name="link" ratio={0.56}/>],
    [t("Completează datele în urgentasp.com"),<>{t("La pagina Programare lipește linkul și codul ntfy, apoi alege ce date vrei: doar cele noi sau toate cele disponibile.")} <a className="inl" href="/programare" onClick={e=>{e.preventDefault();go("programare")}}>{t("Deschide pagina Programare")} →</a></>],
    [t("Așteaptă alerta"),<>{t("Când apare un loc, primești notificarea. Cu planul Plus, activează Autoprogramare și lasă-ne să rezervăm noi.")}</>]
  ];
  const last=i===S.length-1;
  return <>
    <h2>{t("Instrucțiuni")}</h2><p className="sub">{t("Pasul {n} din {total}",{n:i+1,total:S.length})}</p>
    <div className="dots">{S.map((_,k)=><i key={k} className={k<=i?"on":""}/>)}</div>
    <div className="card"><div className="stepin" key={i}>
      {S[i][2]||<Art i={i}/>}
      <h3>{S[i][0]}</h3><p>{S[i][1]}</p>
    </div></div>
    <div className="row">
      {i>0&&<button className="btn ghost" onClick={()=>setI(i-1)}>{t("Înapoi")}</button>}
      <button className="btn" onClick={()=>last?go("programare"):setI(i+1)}>{last?t("Mergi la Programare"):t("Următorul pas")}</button>
    </div>
  </>}

export default Instr;

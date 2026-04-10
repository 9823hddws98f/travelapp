"use client";
import { useState, useEffect, useRef } from "react";

interface Spot { name:string; desc:string; tip?:string; }
interface Resto { name:string; type:string; price:string; tip?:string; }
interface Viral { name:string; desc:string; tag:string; }
interface City { id:string; name:string; region:string; emoji:string; color:string; lat:number; lng:number; zoom:number; intro:string; firstSteps:string[]; spots:Spot[]; restaurants:Resto[]; viral:Viral[]; transport:string[]; }
interface Day { day:number; title:string; cityId:string; hotel:string; hotelUrl?:string; morning:string[]; afternoon:string[]; evening:string; }
interface MustSee { id:string; title:string; desc:string; link?:string; img?:string; done:boolean; }
interface Todo { id:string; text:string; done:boolean; }

const C: City[] = [
  { id:"ven", name:"Venetië", region:"Veneto", emoji:"🚣", color:"#1e3a5f", lat:45.4408,lng:12.3155,zoom:14, intro:"Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.", firstSteps:["Koop vaporetto dagpas bij station","Download Venezia Unica app","Water bij supermarkt, niet op plein","Loop Rialto → San Marco als eerste"], spots:[{name:"San Marco",desc:"Plein, basiliek, Dogenpaleis",tip:"Voor 9u gaan"},{name:"Rialto & Markt",desc:"Iconische brug + vismarkt",tip:"Markt 7:30-12:00"},{name:"Burano",desc:"Kleurrijkste eiland",tip:"Vaporetto 12, 45 min"},{name:"Dorsoduro",desc:"Rustigste wijk",tip:"Ponte Accademia bij sunset"}], restaurants:[{name:"Osteria Al Squero",type:"Cicchetti",price:"€",tip:"Spritz aan het water"},{name:"Da Romano",type:"Buranees",price:"€€",tip:"Risotto di gò op Burano"},{name:"Cantina Do Spade",type:"Venetiaans",price:"€€",tip:"Sinds 1488"}], viral:[{name:"Libreria Acqua Alta",desc:"Boekwinkel met gondels",tag:"#venezia"},{name:"Burano streets",desc:"Meest Instagrammable",tag:"#burano"},{name:"Gondel sunset",desc:"Cliché maar onvergetelijk",tag:"#gondola"}], transport:["Vaporetto dagpas kopen","Alilaguna boot vanaf vliegveld","Alles te voet + vaporetto","Gondel ~€80-100/30min"] },
  { id:"gar", name:"Gardameer", region:"Lombardije", emoji:"⛵", color:"#1a4433", lat:45.65,lng:10.67,zoom:11, intro:"Italië's grootste meer. Citroentuinen, bergen, Hotel Berta.", firstSteps:["Check in Hotel Berta","Huur boot of fiets bij haven","Download Navigarda voor veerboten","Koop limoncello lokaal"], spots:[{name:"Sirmione",desc:"Kasteel + thermale bronnen",tip:"Grotte di Catullo ruïnes"},{name:"Limone sul Garda",desc:"Citroentuinen + pittoresk",tip:"Limonaia del Castel"},{name:"Riva del Garda",desc:"Bergen + meer",tip:"Cascata del Varone"}], restaurants:[{name:"Al Pescatore",type:"Vis",price:"€€",tip:"Terras aan het water"},{name:"Osteria Il Gallo",type:"Lokaal",price:"€",tip:"Authentiek"}], viral:[{name:"Sirmione kasteel",desc:"Toren uit het water",tag:"#lakegarda"},{name:"Limone citroenen",desc:"Geel tegen blauw",tag:"#limone"}], transport:["Veerboten: navigazionelaghi.it","Auto voor westoever","Trein: Desenzano station","Fietsen langs meer = top"] },
  { id:"ver", name:"Verona", region:"Veneto", emoji:"🏟️", color:"#3a1e45", lat:45.4384,lng:10.9916,zoom:14, intro:"Shakespeare's stad. Arena, Amarone, liefde overal.", firstSteps:["Station → Piazza Bra (10 min lopen)","Koop Verona Card 24/48u","Arena van buiten = gratis","Boek wijnproeverij Valpolicella"], spots:[{name:"Arena di Verona",desc:"Romeins amfitheater",tip:"arena.it voor opera"},{name:"Piazza delle Erbe",desc:"Markt + aperitivo",tip:"Torre dei Lamberti"},{name:"Castel San Pietro",desc:"Panorama over stad",tip:"15 min klimmen"},{name:"Ponte Pietra",desc:"Romeinse brug",tip:"Golden hour"},{name:"Valpolicella",desc:"Amarone wijnstreek",tip:"20 min rijden"}], restaurants:[{name:"Osteria al Duca",type:"Veronees",price:"€€",tip:"Pastissada de caval"},{name:"Du de Cope",type:"Pizza",price:"€",tip:"Beste pizza Verona"},{name:"Monte Baldo",type:"Osteria",price:"€€",tip:"Reserveer, risotto"}], viral:[{name:"Juliet's Balkon",desc:"Briefjes op de muur",tag:"#romeo #juliet"},{name:"Arena bij nacht",desc:"Verlicht = magisch",tag:"#arena"},{name:"Spritz Piazza Erbe",desc:"Aperitivo op plein",tag:"#aperolspritz"}], transport:["Porta Nuova → Venetië/Milaan","Centrum = te voet","Bus naar Valpolicella","Luchthaven: bus 199"] },
  { id:"tos", name:"Toscane", region:"Toscane", emoji:"🍷", color:"#2a3518", lat:43.7696,lng:11.2558,zoom:10, intro:"Renaissance, cipressen, wijn. Firenze + droomdorpen.", firstSteps:["Boek Uffizi WEKEN vooruit","Download Trenitalia app","Huur auto 1 dag voor Val d'Orcia","ZTL zones = niet centrum inrijden!"], spots:[{name:"Uffizi",desc:"Botticelli, Da Vinci",tip:"Boek vooruit"},{name:"Ponte Vecchio",desc:"Gouden juweliersbrug",tip:"Sunset = goud"},{name:"San Gimignano",desc:"Torens + gelato",tip:"Dondero = kampioen"},{name:"Val d'Orcia",desc:"Cipressen-foto",tip:"Auto huren"},{name:"Siena",desc:"Piazza del Campo",tip:"Compacter dan Firenze"},{name:"Piazzale Michelangelo",desc:"Uitzicht Firenze",tip:"Zonsondergang"}], restaurants:[{name:"Trattoria Mario",type:"Florentijns",price:"€",tip:"Bistecca"},{name:"All'Antico Vinaio",type:"Panini",price:"€",tip:"Beroemdste broodjes"},{name:"Osteria dell'Enoteca",type:"Toscaans",price:"€€",tip:"Wild zwijn ragù"}], viral:[{name:"Vinaio rij",desc:"Film je schiacciata",tag:"#firenze #foodtiktok"},{name:"Val d'Orcia weg",desc:"Cipressenlaan",tag:"#tuscany"},{name:"Ponte Vecchio",desc:"Verplichte selfie",tag:"#pontevecchio"}], transport:["Firenze SMN = hub","Bus San Gimignano via Poggibonsi","Auto voor Val d'Orcia","ZTL boete = €150+!"] },
  { id:"nap", name:"Napels", region:"Campanië", emoji:"🌋", color:"#3d1f1a", lat:40.8518,lng:14.2681,zoom:13, intro:"Rauw, luid, echt. Pizza, Pompeï, Vesuvius.", firstSteps:["Metro naar Toledo (kunst!)","Loop Spaccanapoli west→oost","Boek Pompeï online","Cash meenemen"], spots:[{name:"Spaccanapoli",desc:"Hartader centrum",tip:"Ochtend = best"},{name:"Pompeï",desc:"Bevroren stad",tip:"Online tickets, vroeg gaan"},{name:"Cappella Sansevero",desc:"Christus-sculptuur",tip:"Reserveer"},{name:"Vesuvius",desc:"Beklim de vulkaan",tip:"Combi-ticket"},{name:"Sotterranea",desc:"Ondergrondse tunnels",tip:"Elk half uur"}], restaurants:[{name:"Da Michele",type:"Pizza",price:"€",tip:"Margherita of marinara"},{name:"Da Nennella",type:"Napolitaans",price:"€",tip:"Cash only, chaos"},{name:"Sorbillo",type:"Pizza",price:"€",tip:"Frittatina!"}], viral:[{name:"Da Michele",desc:"Film de pizza fold",tag:"#damichele"},{name:"Toledo metro",desc:"Mooiste station",tag:"#naplesmetro"},{name:"Street food",desc:"Frittatina, pizza portafoglio",tag:"#streetfood"}], transport:["Metro Lijn 1 (Toledo!)","Circumvesuviana → Pompeï €4","Alibus luchthaven €5","Pas op zakkenrollers"] },
  { id:"ama", name:"Amalfikust", region:"Campanië", emoji:"🏖️", color:"#1a3040", lat:40.6333,lng:14.6029,zoom:12, intro:"Pastelkliffen, azuurblauwe zee, citroenen overal.", firstSteps:["SITA-bus kaartjes bij tabacchi","Veerboot = sneller + mooier","GOEDE schoenen (trappen!)","Sentiero degli Dei: start vroeg"], spots:[{name:"Positano",desc:"Kleurendorp aan klif",tip:"Comfy schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden 7km",tip:"Vroeg + 2L water"},{name:"Ravello",desc:"Tuinen + uitzicht",tip:"Rustiger"},{name:"Amalfi Duomo",desc:"Kathedraal + trap",tip:"Gratis entree"}], restaurants:[{name:"Da Vincenzo",type:"Vis",price:"€€€",tip:"Positano terras"},{name:"Le Arcate",type:"Pizza",price:"€",tip:"Atrani aan zee"},{name:"Il Ritrovo",type:"Seizoen",price:"€€",tip:"Kookles!"}], viral:[{name:"Positano trappen",desc:"Pastel op azuur",tag:"#positano"},{name:"Limoncello",desc:"Citroenen = hoofd-groot",tag:"#limoncello"},{name:"Path of Gods",desc:"Boven de wolken",tag:"#sentierodeglidei"}], transport:["SITA-bus langs kust","Veerboot Positano↔Salerno","Geen auto!","Trein Napels→Salerno"] },
];

const EMERGENCY = { Algemeen:"112", Politie:"113", Ambulance:"118", Wegenwacht:"+39 803 116", "NL Ambassade":"+39 06 3228 6001" };

export default function Page() {
  const [openDay, setOpenDay] = useState<number|null>(null);
  const [cityId, setCityId] = useState<string|null>(null);
  const [showSOS, setShowSOS] = useState(false);
  const city = cityId ? CITIES.find(c=>c.id===cityId)||null : null;
  const [cityTab, setCityTab] = useState<"do"|"eat"|"viral"|"transport">("do");

  return (
    <div style={css.page}>
      {/* HEADER */}
      <header style={css.header}>
        <div style={css.pin}>2026</div>
        <h1 style={css.h1}>Italia</h1>
        <p style={css.sub}>Tein & Tessa · 10 dagen · Venetië → Gardameer → Verona → Toscane → Napels → Amalfi</p>
      </header>

      <div style={css.layout}>
        {/* LEFT: DAY PLANNING */}
        <div style={css.left}>
          <h2 style={css.colTitle}>📅 Dagplanning</h2>
          {DAYS.map(d => {
            const c = CITIES.find(x=>x.id===d.cityId);
            const open = openDay===d.day;
            return (
              <div key={d.day} style={css.dayCard}>
                <button onClick={()=>setOpenDay(open?null:d.day)} style={css.dayBtn}>
                  <span style={css.dayBadge}>Dag {d.day}</span>
                  <span style={css.dayEmoji}>{c?.emoji}</span>
                  <span style={css.dayLabel}>{d.title}</span>
                  <span style={css.chevron}>{open?"▾":"▸"}</span>
                </button>
                {open && (
                  <div style={css.dayBody}>
                    <div style={css.dayRow}><span style={css.dayIcon}>☀️</span><div><b style={css.rowLabel}>Ochtend</b><br/>{d.morning}</div></div>
                    <div style={css.dayRow}><span style={css.dayIcon}>🌤️</span><div><b style={css.rowLabel}>Middag</b><br/>{d.afternoon}</div></div>
                    <div style={css.dayRow}><span style={css.dayIcon}>🌙</span><div><b style={css.rowLabel}>Avond</b><br/>{d.evening}</div></div>
                    <div style={css.hotelRow}>🏨 {d.hotel}{d.hotelLink && <a href={d.hotelLink} target="_blank" rel="noreferrer" style={css.mapLink}> Maps ↗</a>}</div>
                    {c && <button onClick={()=>{setCityId(c.id);setCityTab("do")}} style={css.cityLink}>Bekijk {c.city} gids →</button>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: CITIES */}
        <div style={css.right}>
          {!city ? (
            <>
              <h2 style={css.colTitle}>🏙️ Steden</h2>
              {CITIES.map(c=>(
                <button key={c.id} onClick={()=>{setCityId(c.id);setCityTab("do")}} style={{...css.sCityBtn,background:c.hero}}>
                  <span style={{fontSize:24}}>{c.emoji}</span>
                  <div><div style={css.sCityName}>{c.city}</div><div style={css.sCityReg}>{c.region}</div></div>
                  <span style={css.sCityArr}>→</span>
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={()=>setCityId(null)} style={css.back}>← Alle steden</button>
              <div style={{...css.cityHero,background:city.hero}}>
                <div style={{fontSize:40}}>{city.emoji}</div>
                <h2 style={css.cityTitle}>{city.city}</h2>
                <p style={css.cityReg}>{city.region}</p>
              </div>
              <p style={css.cityIntro}>{city.intro}</p>

              {/* MAP */}
              <div style={css.mapWrap}><iframe style={css.mapFrame} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen /></div>

              {/* FIRST STEPS */}
              <div style={css.firstBox}>
                <h4 style={css.firstTitle}>🎯 Eerst doen als je aankomt</h4>
                {city.firstSteps.map((s,i)=><div key={i} style={css.firstItem}><span style={css.stepNum}>{i+1}</span>{s}</div>)}
              </div>

              {/* CITY TABS */}
              <nav style={css.cTabs}>
                {([["do","🎭 Doen"],["eat","🍕 Eten"],["viral","📱 Viral"],["transport","🚃 OV"]] as ["do"|"eat"|"viral"|"transport",string][]).map(([t,l])=>(
                  <button key={t} onClick={()=>setCityTab(t)} style={{...css.cTab,...(cityTab===t?css.cTabOn:{})}}>{l}</button>
                ))}
              </nav>

              {cityTab==="do" && city.mustDo.map((p,i)=>(<div key={i} style={css.card}><div style={css.cardN}>{p.name}</div><div style={css.cardD}>{p.desc}</div>{p.tip&&<div style={css.cardT}>💡 {p.tip}</div>}</div>))}
              {cityTab==="eat" && city.restaurants.map((r,i)=>(<div key={i} style={css.card}><div style={css.cardN}>{r.name} <span style={css.price}>{r.price}</span></div><div style={css.cardD}>{r.cuisine}</div>{r.tip&&<div style={css.cardT}>💡 {r.tip}</div>}</div>))}
              {cityTab==="viral" && city.viral.map((v,i)=>(<div key={i} style={css.card}><div style={css.cardN}>📱 {v.name}</div><div style={css.cardD}>{v.desc}</div>{v.tiktok&&<div style={css.cardT}>🔥 {v.tiktok}</div>}</div>))}
              {cityTab==="transport" && city.transport.map((t,i)=>(<div key={i} style={css.transItem}>🚃 {t}</div>))}
            </>
          )}
        </div>
      </div>

      {/* SOS */}
      <button onClick={()=>setShowSOS(!showSOS)} style={css.sosBtn}>🚨 Noodnummers {showSOS?"▲":"▼"}</button>
      {showSOS && <div style={css.sosBox}>{Object.entries(EMERGENCY).map(([k,v])=><div key={k} style={css.sosRow}><span style={css.sosK}>{k}</span><a href={`tel:${v.replace(/\s/g,"")}`} style={css.sosV}>{v}</a></div>)}</div>}

      <footer style={css.footer}>Buon viaggio, Tein &amp; Tessa 🇮🇹</footer>
    </div>
  );
}

const DAYS: Day[] = [
  { day:1, title:"Aankomst Venetië", cityId:"ven", hotel:"Hotel nabij San Marco", morning:["Vlucht → Marco Polo","Alilaguna boot naar centrum"], afternoon:["Inchecken","Wandeling Rialto → San Marco"], evening:"Cicchetti & spritz Cannaregio" },
  { day:2, title:"Venetië → Gardameer", cityId:"gar", hotel:"Hotel Berta, Gardameer", hotelUrl:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda", morning:["Burano bezoeken","Kleurenhuizen fotograferen"], afternoon:["Checkout Venetië","Reis naar Gardameer (~2u)"], evening:"Aankomst Hotel Berta, diner aan meer" },
  { day:3, title:"Gardameer → Verona", cityId:"ver", hotel:"Hotel Verona centrum", morning:["Sirmione kasteel","Of: Limone sul Garda"], afternoon:["Lunch aan meer","Naar Verona (~45 min)"], evening:"Piazza Bra + Arena bekijken" },
  { day:4, title:"Verona", cityId:"ver", hotel:"Hotel Verona centrum", morning:["Arena di Verona","Piazza delle Erbe + toren"], afternoon:["Ponte Pietra + Castel San Pietro","Juliet's Balkon"], evening:"Amarone proeverij + diner" },
  { day:5, title:"Verona → Toscane", cityId:"tos", hotel:"Agriturismo Chianti", morning:["Checkout Verona","Frecciarossa → Firenze (1.5u)"], afternoon:["Inchecken agriturismo","Omgeving verkennen"], evening:"Wijn & kaas agriturismo" },
  { day:6, title:"Firenze", cityId:"tos", hotel:"Agriturismo Chianti", morning:["Uffizi Gallery","Ponte Vecchio"], afternoon:["Duomo beklimmen","All'Antico Vinaio lunch"], evening:"Piazzale Michelangelo sunset" },
  { day:7, title:"San Gimignano & Siena", cityId:"tos", hotel:"Agriturismo Chianti", morning:["Auto → San Gimignano","Torens + Dondero gelato"], afternoon:["Siena Piazza del Campo","Duomo bezoeken"], evening:"Laatste avond Toscane" },
  { day:8, title:"Toscane → Napels", cityId:"nap", hotel:"Hotel Napels centrum", morning:["Checkout","Frecciarossa → Napels (3u)"], afternoon:["Spaccanapoli wandeling","Metro Toledo station"], evening:"Pizza Da Michele 🍕" },
  { day:9, title:"Pompeï & Amalfikust", cityId:"ama", hotel:"B&B Amalfikust", morning:["Circumvesuviana → Pompeï","Rondleiding ruïnes"], afternoon:["Door naar Positano/Amalfi","Strand of dorpje"], evening:"Zeevruchten met uitzicht" },
  { day:10, title:"Amalfikust → Terug", cityId:"ama", hotel:"—", morning:["Ravello of Sentiero degli Dei","Limoncello proeven"], afternoon:["Terug naar Napels","Luchthaven"], evening:"Arrivederci Italia 🇮🇹" },
];

const INIT_MS: MustSee[] = [
  { id:"1",title:"Sunset Ponte Vecchio",desc:"Gouden uur over de Arno",done:false },
  { id:"2",title:"Pompeï ochtendlicht",desc:"Magisch zonder drukte",done:false },
  { id:"3",title:"Burano kleuren",desc:"Fotogeniekste plek Italië",done:false },
  { id:"4",title:"Sentiero degli Dei",desc:"Wandelen boven wolken",done:false },
  { id:"5",title:"Spritz bij Arena",desc:"Aperitivo + Romeins uitzicht",done:false },
];

const EMERG: Record<string,string> = {"Algemeen":"112","Politie":"113","Ambulance":"118","Wegenwacht":"+39 803 116","NL Ambassade":"+39 06 3228 6001"};

const uid=()=>Math.random().toString(36).slice(2,8);
function useLS<T>(k:string,init:T):[T,(v:T|((_:T)=>T))=>void]{
  const[v,setV]=useState<T>(init);
  useEffect(()=>{try{const s=localStorage.getItem(k);if(s)setV(JSON.parse(s))}catch{}},[k]);
  const set=(x:T|((_:T)=>T))=>{setV(p=>{const n=typeof x==="function"?(x as((_:T)=>T))(p):x;localStorage.setItem(k,JSON.stringify(n));return n})};
  return[v,set];
}

const css: Record<string, React.CSSProperties> = {
  page:{maxWidth:1100,margin:"0 auto",padding:"0 16px",minHeight:"100vh"},
  header:{textAlign:"center",padding:"36px 0 24px"},
  pin:{display:"inline-block",background:"#c4704b",color:"#fff",fontSize:11,fontWeight:700,letterSpacing:2,padding:"4px 14px",borderRadius:20,marginBottom:10,textTransform:"uppercase" as const},
  h1:{fontFamily:"var(--font-serif)",fontSize:48,fontWeight:400,color:"var(--cream)",margin:0,lineHeight:1.1},
  sub:{fontSize:13,color:"var(--cream-muted)",marginTop:6,lineHeight:1.5},
  layout:{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap" as const},
  left:{flex:"1 1 340px",minWidth:0},
  right:{flex:"1 1 340px",minWidth:0},
  colTitle:{fontFamily:"var(--font-serif)",fontSize:22,fontWeight:400,color:"var(--cream)",margin:"0 0 14px"},
  // Day cards
  dayCard:{marginBottom:8,borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",background:"var(--bg-card)"},
  dayBtn:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"14px 16px",background:"none",border:"none",color:"var(--cream)",cursor:"pointer",textAlign:"left" as const,fontSize:14,fontFamily:"var(--font-sans)"},
  dayBadge:{background:"rgba(196,112,75,0.2)",color:"#d4886a",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8,flexShrink:0,whiteSpace:"nowrap" as const},
  dayEmoji:{fontSize:20,flexShrink:0},
  dayLabel:{flex:1,fontSize:14,fontWeight:500},
  chevron:{color:"var(--cream-muted)",fontSize:14,flexShrink:0},
  dayBody:{padding:"0 16px 16px",fontSize:13,color:"var(--cream-muted)",lineHeight:1.6},
  dayRow:{display:"flex",gap:10,padding:"6px 0",alignItems:"flex-start"},
  dayIcon:{fontSize:16,flexShrink:0,marginTop:1},
  rowLabel:{color:"var(--cream)",fontSize:12,fontWeight:600,textTransform:"uppercase" as const,letterSpacing:0.5},
  hotelRow:{fontSize:13,color:"var(--cream-muted)",padding:"10px 0 6px",borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:6},
  mapLink:{color:"#d4886a",textDecoration:"none",fontSize:12},
  cityLink:{background:"rgba(196,112,75,0.15)",border:"1px solid rgba(196,112,75,0.3)",borderRadius:10,padding:"8px 16px",color:"#d4886a",fontSize:12,cursor:"pointer",marginTop:8,width:"100%",textAlign:"left" as const},
  // City sidebar
  sCityBtn:{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",color:"var(--cream)",textAlign:"left" as const,fontSize:14,marginBottom:8},
  sCityName:{fontFamily:"var(--font-serif)",fontSize:18,fontWeight:400},
  sCityReg:{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:1},
  sCityArr:{marginLeft:"auto",color:"#c4704b",fontSize:16},
  // City detail
  back:{background:"none",border:"none",color:"#d4886a",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:8},
  cityHero:{borderRadius:18,padding:"28px 20px",textAlign:"center" as const,marginBottom:14},
  cityTitle:{fontFamily:"var(--font-serif)",fontSize:30,fontWeight:400,color:"#fff",margin:"6px 0 0"},
  cityReg:{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:3},
  cityIntro:{fontSize:14,lineHeight:1.6,color:"var(--cream-muted)",marginBottom:16,fontStyle:"italic",fontFamily:"var(--font-serif)"},
  mapWrap:{borderRadius:14,overflow:"hidden",marginBottom:16,border:"1px solid rgba(255,255,255,0.08)"},
  mapFrame:{width:"100%",height:180,border:"none",display:"block"},
  firstBox:{background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.2)",borderRadius:14,padding:16,marginBottom:16},
  firstTitle:{fontSize:14,fontWeight:600,color:"#d4886a",margin:"0 0 10px"},
  firstItem:{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:"var(--cream-muted)",padding:"5px 0",lineHeight:1.5},
  stepNum:{background:"#c4704b",color:"#fff",fontSize:10,fontWeight:700,width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1},
  cTabs:{display:"flex",gap:4,marginBottom:14,overflowX:"auto" as const},
  cTab:{padding:"8px 12px",background:"var(--bg-card)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,color:"var(--cream-muted)",fontSize:12,cursor:"pointer",whiteSpace:"nowrap" as const,fontFamily:"var(--font-sans)"},
  cTabOn:{background:"#c4704b",color:"#fff",borderColor:"#c4704b"},
  card:{background:"var(--bg-card)",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"},
  cardN:{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3},
  cardD:{fontSize:12,color:"var(--cream-muted)",lineHeight:1.5},
  cardT:{fontSize:11,color:"#d4886a",marginTop:5},
  price:{color:"#d4886a",fontWeight:400,fontSize:12},
  transItem:{fontSize:13,color:"var(--cream-muted)",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5},
  // SOS
  sosBtn:{background:"rgba(196,112,75,0.1)",border:"1px solid rgba(196,112,75,0.25)",borderRadius:12,padding:"12px 16px",color:"#d4886a",fontSize:13,cursor:"pointer",width:"100%",textAlign:"left" as const,marginTop:20},
  sosBox:{background:"var(--bg-card)",borderRadius:12,padding:14,display:"flex",flexDirection:"column" as const,gap:8,marginTop:8},
  sosRow:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  sosK:{fontSize:12,color:"var(--cream-muted)"},
  sosV:{fontSize:13,color:"#d4886a",textDecoration:"none",fontWeight:500},
  footer:{textAlign:"center" as const,padding:"28px 0 44px",fontSize:13,color:"var(--accent)",fontFamily:"var(--font-serif)",fontStyle:"italic"},
};

export default function Page(){
  const[openDay,setOpenDay]=useState<number|null>(null);
  const[cityId,setCityId]=useState<string|null>(null);
  const[view,setView]=useState<"main"|"city"|"ms"|"td">("main");
  const[ms,setMs]=useLS<MustSee[]>("it-ms",INIT_MS);
  const[todos,setTodos]=useLS<Todo[]>("it-td",[]);
  const[showAdd,setShowAdd]=useState(false);
  const[addTd,setAddTd]=useState(false);
  const[form,setForm]=useState({t:"",d:"",l:"",i:""});
  const[tdTxt,setTdTxt]=useState("");
  const[showE,setShowE]=useState(false);
  const[ctab,setCtab]=useState<"do"|"eat"|"viral"|"move">("do");
  const city=cityId?C.find(c=>c.id===cityId):null;
  const openC=(id:string)=>{setCityId(id);setView("city");setCtab("do")};
  const back=()=>{setView("main");setCityId(null)};
  const inp:React.CSSProperties={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 12px",color:"var(--cream)",fontSize:14,fontFamily:"var(--sans)",outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div style={{maxWidth:520,margin:"0 auto",padding:"0 16px 80px",minHeight:"100vh"}}>

      <header style={{textAlign:"center",padding:"36px 0 20px",animation:"fadeUp .6s ease"}}>
        <div style={{display:"inline-block",background:"var(--terra)",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:3,padding:"3px 16px",borderRadius:20,marginBottom:14,textTransform:"uppercase"}}>2026</div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:46,fontWeight:400,color:"var(--cream)",lineHeight:1.05}}>Italia</h1>
        <p style={{fontSize:13,color:"var(--cream2)",marginTop:6}}>Tein & Tessa · 10 dagen</p>
        <p style={{fontSize:11,color:"var(--cream3)",marginTop:2}}>Venetië → Gardameer → Verona → Toscane → Napels → Amalfikust</p>
      </header>

      {view==="main"&&(<>
        {/* Day pills */}
        <div style={{display:"flex",gap:6,overflowX:"auto",padding:"4px 0 16px",scrollbarWidth:"thin"}}>
          {DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId)!;const o=openDay===d.day;return(
            <button key={d.day} onClick={()=>setOpenDay(o?null:d.day)} style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:14,border:o?"2px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:o?"rgba(196,112,75,0.15)":"var(--bg2)",color:"var(--cream)",cursor:"pointer",minWidth:64,transition:"all .2s",fontFamily:"var(--sans)"}}>
              <span style={{fontSize:10,fontWeight:700,color:o?"var(--terra-l)":"var(--cream3)",letterSpacing:1}}>DAG</span>
              <span style={{fontSize:20,fontWeight:600,color:o?"var(--terra-l)":"var(--cream)"}}>{d.day}</span>
              <span style={{fontSize:16}}>{c.emoji}</span>
              <span style={{fontSize:9,color:"var(--cream2)",whiteSpace:"nowrap",maxWidth:56,overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</span>
            </button>
          )})}
        </div>

        {/* Expanded day */}
        {openDay&&(()=>{const d=DAYS.find(x=>x.day===openDay)!;const c=C.find(x=>x.id===d.cityId)!;return(
          <div style={{background:"var(--bg2)",borderRadius:18,padding:20,marginBottom:20,border:"1px solid rgba(255,255,255,0.06)",animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:2}}>DAG {d.day}</div>
                <div style={{fontFamily:"var(--serif)",fontSize:22,color:"var(--cream)"}}>{d.title}</div>
              </div>
              <button onClick={()=>openC(c.id)} style={{background:c.color,border:"none",borderRadius:12,padding:"8px 14px",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{c.emoji} {c.name} →</button>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:600,color:"var(--cream3)",marginBottom:6}}>🏨 HOTEL</div>
              <div style={{fontSize:14,color:"var(--cream)"}}>{d.hotel}{d.hotelUrl&&<a href={d.hotelUrl} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none",fontSize:12}}> Maps↗</a>}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:6}}>☀️ OCHTEND</div>
                {d.morning.map((a,i)=><div key={i} style={{fontSize:12,color:"var(--cream2)",padding:"2px 0",lineHeight:1.5}}>· {a}</div>)}
              </div>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:6}}>🌤️ MIDDAG</div>
                {d.afternoon.map((a,i)=><div key={i} style={{fontSize:12,color:"var(--cream2)",padding:"2px 0",lineHeight:1.5}}>· {a}</div>)}
              </div>
            </div>
            <div style={{fontSize:13,color:"var(--cream3)",fontStyle:"italic",paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.04)"}}>🌙 {d.evening}</div>
          </div>
        )})()}

        {/* City grid */}
        <div style={{marginBottom:20}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--cream)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:24,height:1,background:"var(--terra)",display:"inline-block"}}/>Steden</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {C.map(c=>(<button key={c.id} onClick={()=>openC(c.id)} style={{background:`linear-gradient(135deg,${c.color},${c.color}dd)`,border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 14px",cursor:"pointer",color:"#fff",textAlign:"left",display:"flex",flexDirection:"column",gap:6,fontFamily:"var(--sans)"}}>
              <span style={{fontSize:28}}>{c.emoji}</span>
              <span style={{fontFamily:"var(--serif)",fontSize:18}}>{c.name}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>{c.region}</span>
            </button>))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          <button onClick={()=>setView("ms")} style={{background:"var(--bg2)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:16,cursor:"pointer",color:"var(--cream)",textAlign:"left",fontFamily:"var(--sans)"}}>
            <div style={{fontSize:22,marginBottom:6}}>⭐</div><div style={{fontSize:14,fontWeight:600}}>Must-See</div><div style={{fontSize:11,color:"var(--cream3)"}}>{ms.filter(m=>!m.done).length} items</div>
          </button>
          <button onClick={()=>setView("td")} style={{background:"var(--bg2)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:16,cursor:"pointer",color:"var(--cream)",textAlign:"left",fontFamily:"var(--sans)"}}>
            <div style={{fontSize:22,marginBottom:6}}>✅</div><div style={{fontSize:14,fontWeight:600}}>To-Do</div><div style={{fontSize:11,color:"var(--cream3)"}}>{todos.filter(t=>!t.done).length} open</div>
          </button>
        </div>

        <button onClick={()=>setShowE(!showE)} style={{width:"100%",background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.2)",borderRadius:12,padding:"12px 16px",color:"var(--terra-l)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"var(--sans)"}}>🚨 Nood {showE?"▲":"▼"}</button>
        {showE&&<div style={{background:"var(--bg2)",borderRadius:12,padding:14,marginTop:8,display:"flex",flexDirection:"column",gap:8}}>{Object.entries(EMERG).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"var(--cream2)"}}>{k}</span><a href={`tel:${v.replace(/\s/g,"")}`} style={{fontSize:13,color:"var(--terra-l)",textDecoration:"none",fontWeight:600}}>{v}</a></div>)}</div>}
      </>)}

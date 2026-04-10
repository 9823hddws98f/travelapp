"use client";
import { useState, useEffect } from "react";
interface Spot{name:string;desc:string;tip?:string}
interface Resto{name:string;type:string;price:string;tip?:string}
interface Viral{name:string;desc:string;tag:string}
interface City{id:string;name:string;region:string;emoji:string;color:string;lat:number;lng:number;zoom:number;intro:string;firstSteps:string[];spots:Spot[];restaurants:Resto[];viral:Viral[];transport:string[]}
interface Day{day:number;title:string;cityId:string;hotel:string;hotelUrl?:string;morning:string[];afternoon:string[];evening:string}
interface MustSee{id:string;title:string;desc:string;link?:string;img?:string;done:boolean}
interface Todo{id:string;text:string;done:boolean}

const C:City[]=[{"id": "ven", "name": "Venetië", "region": "Veneto", "emoji": "🚣", "color": "#1e3a5f", "lat": 45.4408, "lng": 12.3155, "zoom": 14, "intro": "Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.", "firstSteps": ["Koop vaporetto dagpas bij station", "Download Venezia Unica app", "Water bij supermarkt, niet op plein", "Loop Rialto \\u2192 San Marco als eerste"], "spots": [{"name": "San Marco", "desc": "Plein, basiliek, Dogenpaleis", "tip": "Voor 9u gaan"}, {"name": "Rialto & Markt", "desc": "Iconische brug + vismarkt", "tip": "Markt 7:30-12:00"}, {"name": "Burano", "desc": "Kleurrijkste eiland", "tip": "Vaporetto 12, 45 min"}, {"name": "Dorsoduro", "desc": "Rustigste wijk", "tip": "Ponte Accademia bij sunset"}], "restaurants": [{"name": "Osteria Al Squero", "type": "Cicchetti", "price": "\\u20ac", "tip": "Spritz aan het water"}, {"name": "Da Romano", "type": "Buranees", "price": "\\u20ac\\u20ac", "tip": "Risotto op Burano"}, {"name": "Cantina Do Spade", "type": "Venetiaans", "price": "\\u20ac\\u20ac", "tip": "Sinds 1488"}], "viral": [{"name": "Libreria Acqua Alta", "desc": "Boekwinkel met gondels", "tag": "#venezia"}, {"name": "Burano streets", "desc": "Meest Instagrammable", "tag": "#burano"}, {"name": "Gondel sunset", "desc": "Clich\\u00e9 maar wow", "tag": "#gondola"}], "transport": ["Vaporetto dagpas kopen", "Alilaguna boot vliegveld", "Alles te voet + vaporetto", "Gondel ~\\u20ac80-100/30min"]}, {"id": "gar", "name": "Gardameer", "region": "Lombardije", "emoji": "\\u26f5", "color": "#1a4433", "lat": 45.65, "lng": 10.67, "zoom": 11, "intro": "Itali\\u00eb\\u2019s grootste meer. Citroentuinen, bergen, Hotel Berta.", "firstSteps": ["Check in Hotel Berta", "Huur boot of fiets", "Download Navigarda app", "Koop lokale limoncello"], "spots": [{"name": "Sirmione", "desc": "Kasteel + thermale bronnen", "tip": "Grotte di Catullo"}, {"name": "Limone sul Garda", "desc": "Citroentuinen", "tip": "Limonaia del Castel"}, {"name": "Riva del Garda", "desc": "Bergen + meer", "tip": "Cascata del Varone"}], "restaurants": [{"name": "Al Pescatore", "type": "Vis", "price": "\\u20ac\\u20ac", "tip": "Terras water"}, {"name": "Osteria Il Gallo", "type": "Lokaal", "price": "\\u20ac", "tip": "Authentiek"}], "viral": [{"name": "Sirmione kasteel", "desc": "Toren uit water", "tag": "#lakegarda"}, {"name": "Limone citroenen", "desc": "Geel op blauw", "tag": "#limone"}], "transport": ["Veerboten navigazionelaghi.it", "Auto westoever", "Trein Desenzano", "Fietsen = top"]}, {"id": "ver", "name": "Verona", "region": "Veneto", "emoji": "\\ud83c\\udfdf\\ufe0f", "color": "#3a1e45", "lat": 45.4384, "lng": 10.9916, "zoom": 14, "intro": "Shakespeare\\u2019s stad. Arena, Amarone, liefde.", "firstSteps": ["Station \\u2192 Piazza Bra (10 min)", "Koop Verona Card", "Arena buiten = gratis", "Boek wijnproeverij Valpolicella"], "spots": [{"name": "Arena di Verona", "desc": "Romeins amfitheater", "tip": "arena.it"}, {"name": "Piazza delle Erbe", "desc": "Markt + aperitivo", "tip": "Torre dei Lamberti"}, {"name": "Castel San Pietro", "desc": "Panorama", "tip": "15 min klimmen"}, {"name": "Ponte Pietra", "desc": "Romeinse brug", "tip": "Golden hour"}, {"name": "Valpolicella", "desc": "Amarone wijnstreek", "tip": "20 min rijden"}], "restaurants": [{"name": "Osteria al Duca", "type": "Veronees", "price": "\\u20ac\\u20ac", "tip": "Pastissada"}, {"name": "Du de Cope", "type": "Pizza", "price": "\\u20ac", "tip": "Beste Verona"}, {"name": "Monte Baldo", "type": "Osteria", "price": "\\u20ac\\u20ac", "tip": "Reserveer"}], "viral": [{"name": "Juliet Balkon", "desc": "Briefjes muur", "tag": "#juliet"}, {"name": "Arena nacht", "desc": "Verlicht = magisch", "tag": "#arena"}, {"name": "Spritz Erbe", "desc": "Aperitivo plein", "tag": "#spritz"}], "transport": ["Porta Nuova treinen", "Centrum te voet", "Bus Valpolicella", "Luchthaven bus 199"]}, {"id": "tos", "name": "Toscane", "region": "Toscane", "emoji": "\\ud83c\\udf77", "color": "#2a3518", "lat": 43.7696, "lng": 11.2558, "zoom": 10, "intro": "Renaissance, cipressen, wijn. Firenze + droomdorpen.", "firstSteps": ["Boek Uffizi WEKEN vooruit", "Download Trenitalia app", "Huur auto 1 dag Val d\\u2019Orcia", "ZTL = niet centrum inrijden!"], "spots": [{"name": "Uffizi", "desc": "Botticelli, Da Vinci", "tip": "Boek vooruit"}, {"name": "Ponte Vecchio", "desc": "Gouden brug", "tip": "Sunset"}, {"name": "San Gimignano", "desc": "Torens + gelato", "tip": "Dondero = kampioen"}, {"name": "Val d\\u2019Orcia", "desc": "Cipressen-foto", "tip": "Auto huren"}, {"name": "Siena", "desc": "Piazza del Campo", "tip": "Compacter"}, {"name": "Piazzale Michelangelo", "desc": "Uitzicht", "tip": "Zonsondergang"}], "restaurants": [{"name": "Trattoria Mario", "type": "Florentijns", "price": "\\u20ac", "tip": "Bistecca"}, {"name": "All\\u2019Antico Vinaio", "type": "Panini", "price": "\\u20ac", "tip": "Beroemdste broodjes"}, {"name": "Osteria Enoteca", "type": "Toscaans", "price": "\\u20ac\\u20ac", "tip": "Wild zwijn"}], "viral": [{"name": "Vinaio rij", "desc": "Film je schiacciata", "tag": "#firenze"}, {"name": "Val d\\u2019Orcia", "desc": "Cipressenlaan", "tag": "#tuscany"}, {"name": "Ponte Vecchio", "desc": "Verplichte selfie", "tag": "#pontevecchio"}], "transport": ["Firenze SMN hub", "Bus San Gimignano", "Auto Val d\\u2019Orcia", "ZTL boete \\u20ac150+!"]}, {"id": "nap", "name": "Napels", "region": "Campani\\u00eb", "emoji": "\\ud83c\\udf0b", "color": "#3d1f1a", "lat": 40.8518, "lng": 14.2681, "zoom": 13, "intro": "Rauw, luid, echt. Pizza, Pompe\\u00ef, Vesuvius.", "firstSteps": ["Metro naar Toledo (kunst!)", "Spaccanapoli west\\u2192oost", "Boek Pompe\\u00ef online", "Cash meenemen"], "spots": [{"name": "Spaccanapoli", "desc": "Hartader centrum", "tip": "Ochtend"}, {"name": "Pompe\\u00ef", "desc": "Bevroren stad", "tip": "Online tickets"}, {"name": "Cappella Sansevero", "desc": "Christus-sculptuur", "tip": "Reserveer"}, {"name": "Vesuvius", "desc": "Beklim vulkaan", "tip": "Combi-ticket"}, {"name": "Sotterranea", "desc": "Tunnels", "tip": "Elk half uur"}], "restaurants": [{"name": "Da Michele", "type": "Pizza", "price": "\\u20ac", "tip": "Margherita only"}, {"name": "Da Nennella", "type": "Napolitaans", "price": "\\u20ac", "tip": "Cash, chaos"}, {"name": "Sorbillo", "type": "Pizza", "price": "\\u20ac", "tip": "Frittatina!"}], "viral": [{"name": "Da Michele", "desc": "Pizza fold", "tag": "#damichele"}, {"name": "Toledo metro", "desc": "Mooiste station", "tag": "#naplesmetro"}, {"name": "Street food", "desc": "Frittatina", "tag": "#streetfood"}], "transport": ["Metro Lijn 1", "Circumvesuviana \\u20ac4", "Alibus \\u20ac5", "Zakkenrollers!"]}, {"id": "ama", "name": "Amalfikust", "region": "Campani\\u00eb", "emoji": "\\ud83c\\udfd6\\ufe0f", "color": "#1a3040", "lat": 40.6333, "lng": 14.6029, "zoom": 12, "intro": "Pastelkliffen, azuurblauwe zee, citroenen.", "firstSteps": ["SITA-bus kaartjes tabacchi", "Veerboot = sneller + mooier", "GOEDE schoenen (trappen)", "Sentiero degli Dei: vroeg starten"], "spots": [{"name": "Positano", "desc": "Kleurendorp klif", "tip": "Comfy schoenen"}, {"name": "Sentiero degli Dei", "desc": "Pad der Goden 7km", "tip": "Vroeg + 2L water"}, {"name": "Ravello", "desc": "Tuinen + uitzicht", "tip": "Rustiger"}, {"name": "Amalfi Duomo", "desc": "Kathedraal", "tip": "Gratis"}], "restaurants": [{"name": "Da Vincenzo", "type": "Vis", "price": "\\u20ac\\u20ac\\u20ac", "tip": "Positano terras"}, {"name": "Le Arcate", "type": "Pizza", "price": "\\u20ac", "tip": "Atrani"}, {"name": "Il Ritrovo", "type": "Seizoen", "price": "\\u20ac\\u20ac", "tip": "Kookles!"}], "viral": [{"name": "Positano trappen", "desc": "Pastel op azuur", "tag": "#positano"}, {"name": "Limoncello", "desc": "Mega citroenen", "tag": "#limoncello"}, {"name": "Path of Gods", "desc": "Boven wolken", "tag": "#hiking"}], "transport": ["SITA-bus kust", "Veerboot", "Geen auto!", "Trein Napels\\u2192Salerno"]}];

const DAYS:Day[]=[{"day": 1, "title": "Aankomst Venetië", "cityId": "ven", "hotel": "Hotel nabij San Marco", "morning": ["Vlucht → Marco Polo", "Alilaguna boot centrum"], "afternoon": ["Inchecken", "Wandeling Rialto → San Marco"], "evening": "Cicchetti & spritz"}, {"day": 2, "title": "Venetië → Gardameer", "cityId": "gar", "hotel": "Hotel Berta, Gardameer", "hotelUrl": "https://maps.google.com/?q=Hotel+Berta+Lake+Garda", "morning": ["Burano bezoeken", "Kleurenhuizen"], "afternoon": ["Checkout Venetië", "Reis Gardameer ~2u"], "evening": "Diner aan het meer"}, {"day": 3, "title": "Gardameer → Verona", "cityId": "ver", "hotel": "Hotel Verona centrum", "morning": ["Sirmione kasteel", "Of: Limone"], "afternoon": ["Lunch aan meer", "Naar Verona ~45 min"], "evening": "Piazza Bra + Arena"}, {"day": 4, "title": "Verona", "cityId": "ver", "hotel": "Hotel Verona centrum", "morning": ["Arena di Verona", "Piazza delle Erbe"], "afternoon": ["Ponte Pietra + Castel San Pietro", "Juliet Balkon"], "evening": "Amarone proeverij"}, {"day": 5, "title": "Verona → Toscane", "cityId": "tos", "hotel": "Agriturismo Chianti", "morning": ["Checkout Verona", "Frecciarossa → Firenze 1.5u"], "afternoon": ["Inchecken agriturismo", "Omgeving verkennen"], "evening": "Wijn & kaas"}, {"day": 6, "title": "Firenze", "cityId": "tos", "hotel": "Agriturismo Chianti", "morning": ["Uffizi Gallery", "Ponte Vecchio"], "afternoon": ["Duomo beklimmen", "All'Antico Vinaio"], "evening": "Piazzale Michelangelo sunset"}, {"day": 7, "title": "San Gimignano & Siena", "cityId": "tos", "hotel": "Agriturismo Chianti", "morning": ["Auto → San Gimignano", "Dondero gelato"], "afternoon": ["Siena Piazza del Campo", "Duomo"], "evening": "Laatste avond Toscane"}, {"day": 8, "title": "Toscane → Napels", "cityId": "nap", "hotel": "Hotel Napels centrum", "morning": ["Checkout", "Frecciarossa → Napels 3u"], "afternoon": ["Spaccanapoli", "Metro Toledo"], "evening": "Pizza Da Michele 🍕"}, {"day": 9, "title": "Pompeï & Amalfikust", "cityId": "ama", "hotel": "B&B Amalfikust", "morning": ["Circumvesuviana → Pompeï", "Rondleiding ruïnes"], "afternoon": ["Door naar Positano", "Strand of dorpje"], "evening": "Zeevruchten met uitzicht"}, {"day": 10, "title": "Amalfikust → Terug", "cityId": "ama", "hotel": "—", "morning": ["Ravello of Sentiero dei", "Limoncello proeven"], "afternoon": ["Terug Napels", "Luchthaven"], "evening": "Arrivederci 🇮🇹"}];

const INIT_MS:MustSee[]=[
{id:"1",title:"Sunset Ponte Vecchio",desc:"Gouden uur over de Arno",done:false},
{id:"2",title:"Pompeï ochtendlicht",desc:"Magisch zonder drukte",done:false},
{id:"3",title:"Burano kleuren",desc:"Fotogeniekste plek",done:false},
{id:"4",title:"Sentiero degli Dei",desc:"Boven de wolken",done:false},
{id:"5",title:"Spritz bij Arena",desc:"Aperitivo Romeins uitzicht",done:false},
];
const EMERG:Record<string,string>={"Algemeen":"112","Politie":"113","Ambulance":"118","Wegenwacht":"+39 803 116","NL Ambassade":"+39 06 3228 6001"};
const uid=()=>Math.random().toString(36).slice(2,8);
function useLS<T>(k:string,init:T):[T,(v:T|((_:T)=>T))=>void]{
const[v,setV]=useState<T>(init);
useEffect(()=>{try{const s=localStorage.getItem(k);if(s)setV(JSON.parse(s))}catch{}},[k]);
const set=(x:T|((_:T)=>T))=>{setV(p=>{const n=typeof x==="function"?(x as((_:T)=>T))(p):x;localStorage.setItem(k,JSON.stringify(n));return n})};
return[v,set];
}

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
const openCi=(id:string)=>{setCityId(id);setView("city");setCtab("do")};
const back=()=>{setView("main");setCityId(null)};
const inp:React.CSSProperties={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 12px",color:"var(--cream)",fontSize:14,fontFamily:"var(--sans)",outline:"none",width:"100%",boxSizing:"border-box"};

return(
<div style={{maxWidth:520,margin:"0 auto",padding:"0 16px 80px",minHeight:"100vh"}}>

<header style={{textAlign:"center",padding:"36px 0 20px",animation:"fadeUp .6s ease"}}>
<div style={{display:"inline-block",background:"var(--terra)",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:3,padding:"3px 16px",borderRadius:20,marginBottom:14,textTransform:"uppercase"}}>2026</div>
<h1 style={{fontFamily:"var(--serif)",fontSize:46,fontWeight:400,color:"var(--cream)",lineHeight:1.05}}>Italia</h1>
<p style={{fontSize:13,color:"var(--cream2)",marginTop:6}}>Tein &amp; Tessa &middot; 10 dagen</p>
<p style={{fontSize:11,color:"var(--cream3)",marginTop:2}}>Venetië → Gardameer → Verona → Toscane → Napels → Amalfikust</p>
</header>

{view==="main"&&(<>
<div style={{display:"flex",gap:6,overflowX:"auto",padding:"4px 0 16px",scrollbarWidth:"thin"}}>
{DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId)!;const o=openDay===d.day;return(
<button key={d.day} onClick={()=>setOpenDay(o?null:d.day)} style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:14,border:o?"2px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:o?"rgba(196,112,75,0.15)":"var(--bg2)",color:"var(--cream)",cursor:"pointer",minWidth:64,transition:"all .2s",fontFamily:"var(--sans)"}}>
<span style={{fontSize:10,fontWeight:700,color:o?"var(--terra-l)":"var(--cream3)",letterSpacing:1}}>DAG</span>
<span style={{fontSize:20,fontWeight:600,color:o?"var(--terra-l)":"var(--cream)"}}>{d.day}</span>
<span style={{fontSize:16}}>{c.emoji}</span>
<span style={{fontSize:9,color:"var(--cream2)",whiteSpace:"nowrap",maxWidth:56,overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</span>
</button>)})}
</div>

{openDay&&(()=>{const d=DAYS.find(x=>x.day===openDay)!;const c=C.find(x=>x.id===d.cityId)!;return(
<div style={{background:"var(--bg2)",borderRadius:18,padding:20,marginBottom:20,border:"1px solid rgba(255,255,255,0.06)",animation:"fadeUp .3s ease"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
<div>
<div style={{fontSize:11,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:2}}>DAG {d.day}</div>
<div style={{fontFamily:"var(--serif)",fontSize:22,color:"var(--cream)"}}>{d.title}</div>
</div>
<button onClick={()=>openCi(c.id)} style={{background:c.color,border:"none",borderRadius:12,padding:"8px 14px",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{c.emoji} {c.name} →</button>
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
</div>)})()}

<div style={{marginBottom:20}}>
<h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--cream)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:24,height:1,background:"var(--terra)",display:"inline-block"}}/>Steden</h2>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{C.map(c=>(<button key={c.id} onClick={()=>openCi(c.id)} style={{background:`linear-gradient(135deg,${c.color},${c.color}dd)`,border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 14px",cursor:"pointer",color:"#fff",textAlign:"left",display:"flex",flexDirection:"column",gap:6,fontFamily:"var(--sans)"}}>
<span style={{fontSize:28}}>{c.emoji}</span>
<span style={{fontFamily:"var(--serif)",fontSize:18}}>{c.name}</span>
<span style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>{c.region}</span>
</button>))}
</div>
</div>

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

{view==="city"&&city&&(<div style={{animation:"fadeUp .3s ease"}}>
<button onClick={back} style={{background:"none",border:"none",color:"var(--terra-l)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:10}}>← Terug</button>
<div style={{background:`linear-gradient(135deg,${city.color},${city.color}cc)`,borderRadius:20,padding:"28px 20px",textAlign:"center",marginBottom:16}}>
<span style={{fontSize:44,display:"block",marginBottom:6}}>{city.emoji}</span>
<h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"#fff",fontWeight:400}}>{city.name}</h2>
<p style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>{city.region}</p>
</div>
<p style={{fontSize:14,lineHeight:1.7,color:"var(--cream2)",marginBottom:16,fontFamily:"var(--serif)",fontStyle:"italic"}}>{city.intro}</p>
<div style={{borderRadius:14,overflow:"hidden",marginBottom:20,border:"1px solid rgba(255,255,255,0.08)"}}>
<iframe style={{width:"100%",height:200,border:"none",display:"block"}} loading="lazy" src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen />
</div>
<div style={{background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.15)",borderRadius:14,padding:"14px 16px",marginBottom:20}}>
<div style={{fontSize:12,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:8}}>🎯 ALS EERSTE DOEN</div>
{city.firstSteps.map((s,i)=><div key={i} style={{fontSize:13,color:"var(--cream)",padding:"4px 0",display:"flex",gap:8}}><span style={{color:"var(--terra-l)",fontWeight:700,flexShrink:0}}>{i+1}.</span>{s}</div>)}
</div>
<div style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto"}}>
{([["do","🏛️ Doen"],["eat","🍝 Eten"],["viral","📱 TikTok"],["move","🚃 Vervoer"]] as [typeof ctab,string][]).map(([t,l])=>(
<button key={t} onClick={()=>setCtab(t)} style={{flex:"1 0 auto",padding:"8px 12px",borderRadius:10,border:ctab===t?"2px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:ctab===t?"rgba(196,112,75,0.12)":"var(--bg2)",color:ctab===t?"var(--terra-l)":"var(--cream2)",fontSize:12,cursor:"pointer",fontFamily:"var(--sans)",whiteSpace:"nowrap"}}>{l}</button>
))}
</div>
{ctab==="do"&&city.spots.map((p,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.05}s both`}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>{p.name}</div><div style={{fontSize:12,color:"var(--cream2)",lineHeight:1.5}}>{p.desc}</div>{p.tip&&<div style={{fontSize:11,color:"var(--terra-l)",marginTop:6}}>💡 {p.tip}</div>}</div>))}
{ctab==="eat"&&city.restaurants.map((r,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.05}s both`}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>{r.name} <span style={{color:"var(--terra-l)",fontSize:12}}>{r.price}</span></div><div style={{fontSize:12,color:"var(--cream2)"}}>{r.type}</div>{r.tip&&<div style={{fontSize:11,color:"var(--terra-l)",marginTop:6}}>💡 {r.tip}</div>}</div>))}
{ctab==="viral"&&city.viral.map((v,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.05}s both`}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>📱 {v.name}</div><div style={{fontSize:12,color:"var(--cream2)",lineHeight:1.5}}>{v.desc}</div><div style={{fontSize:10,color:"var(--terra-l)",marginTop:6}}>{v.tag}</div></div>))}
{ctab==="move"&&city.transport.map((t,i)=>(<div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5}}>🚃 {t}</div>))}
</div>)}

{view==="ms"&&(<div style={{animation:"fadeUp .3s ease"}}>
<button onClick={back} style={{background:"none",border:"none",color:"var(--terra-l)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:10}}>← Terug</button>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--cream)"}}>⭐ Must-See</h2>
<button onClick={()=>setShowAdd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Nieuw</button>
</div>
{showAdd&&(<div style={{background:"var(--bg2)",borderRadius:16,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10}}>
<input placeholder="Titel *" value={form.t} onChange={e=>setForm({...form,t:e.target.value})} style={inp} />
<input placeholder="Beschrijving" value={form.d} onChange={e=>setForm({...form,d:e.target.value})} style={inp} />
<input placeholder="Link (optioneel)" value={form.l} onChange={e=>setForm({...form,l:e.target.value})} style={inp} />
<input placeholder="Afbeelding URL (optioneel)" value={form.i} onChange={e=>setForm({...form,i:e.target.value})} style={inp} />
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{if(!form.t)return;setMs(p=>[...p,{id:uid(),title:form.t,desc:form.d,link:form.l||undefined,img:form.i||undefined,done:false}]);setForm({t:"",d:"",l:"",i:""});setShowAdd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>Opslaan</button>
<button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:"var(--cream2)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer"}}>Annuleer</button>
</div>
</div>)}
{ms.map(m=>(<div key={m.id} style={{background:"var(--bg2)",borderRadius:14,padding:14,marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:12,alignItems:"flex-start",opacity:m.done?.45:1}}>
{m.img&&<div style={{width:56,height:56,borderRadius:10,backgroundImage:`url(${m.img})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}} />}
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:14,fontWeight:600,color:"var(--cream)",display:"flex",alignItems:"center",gap:6}}>
<button onClick={()=>setMs(p=>p.map(x=>x.id===m.id?{...x,done:!x.done}:x))} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:0}}>{m.done?"✅":"⬜"}</button>
{m.link?<a href={m.link} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none"}}>{m.title} ↗</a>:<span>{m.title}</span>}
</div>
{m.desc&&<div style={{fontSize:12,color:"var(--cream2)",marginTop:3}}>{m.desc}</div>}
</div>
<button onClick={()=>setMs(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:14,cursor:"pointer"}}>✕</button>
</div>))}
</div>)}

{view==="td"&&(<div style={{animation:"fadeUp .3s ease"}}>
<button onClick={back} style={{background:"none",border:"none",color:"var(--terra-l)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:10}}>← Terug</button>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--cream)"}}>✅ To-Do</h2>
<button onClick={()=>setAddTd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Nieuw</button>
</div>
{addTd&&(<div style={{background:"var(--bg2)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
<input placeholder="Wat moet er gebeuren?" value={tdTxt} onChange={e=>setTdTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&tdTxt){setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}}} style={{...inp,flex:1}} />
<button onClick={()=>{if(!tdTxt)return;setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer",flexShrink:0}}>+</button>
</div>)}
{todos.map(t=>(<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg2)",borderRadius:12,marginBottom:6,border:"1px solid rgba(255,255,255,0.04)",opacity:t.done?.45:1}}>
<button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:0}}>{t.done?"✅":"⬜"}</button>
<span style={{fontSize:14,color:"var(--cream)",flex:1,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
<button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:14,cursor:"pointer"}}>✕</button>
</div>))}
{todos.length===0&&!addTd&&<p style={{fontSize:13,color:"var(--cream3)",textAlign:"center",padding:32,fontStyle:"italic"}}>Nog geen items.</p>}
</div>)}

<footer style={{textAlign:"center",padding:"28px 0 16px",fontSize:13,color:"var(--cream3)",fontFamily:"var(--serif)",fontStyle:"italic"}}>Buon viaggio, Tein &amp; Tessa 🇮🇹</footer>
</div>
);
}

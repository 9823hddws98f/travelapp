"use client";
import { useState, useEffect } from "react";

interface Spot{name:string;desc:string;tip?:string;priority?:number}
interface Resto{name:string;vibe:string;price:string;tip?:string;tiktok?:boolean}
interface TikTok{name:string;desc:string}
interface CityData{id:string;city:string;emoji:string;lat:number;lng:number;zoom:number;color:string;intro:string;firstSteps:string[];spots:Spot[];restaurants:Resto[];tiktok:TikTok[];transport:string[]}
interface DayPlan{day:number;title:string;cityId:string;hotel:string;hotelLink?:string;activities:string[];evening:string}

const C:CityData[]=[
{id:"venezia",city:"Venetië",emoji:"🚣",lat:45.4408,lng:12.3155,zoom:14,color:"#2d6a8a",intro:"Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.",firstSteps:["Koop 24u Vaporetto-pas","Download offline Maps","Loop naar Rialto voor oriëntatie","Check of alle tickets geboekt zijn"],spots:[{name:"Piazza San Marco",desc:"Basiliek, Dogenpaleis, campanile",tip:"Ga voor 9u",priority:1},{name:"Rialto Brug & Markt",desc:"Iconische brug + vismarkt",tip:"Markt tot ~12u",priority:2},{name:"Burano",desc:"Kleurrijk eiland — perfecte foto's",tip:"Vaporetto 12, ~45 min",priority:3},{name:"Dorsoduro",desc:"Rustigste wijk, slenteren langs kanalen",priority:4},{name:"Libreria Acqua Alta",desc:"Gekste boekwinkel — boeken in gondels"}],restaurants:[{name:"Osteria Al Squero",vibe:"Locals spritz spot",price:"€",tip:"Cicchetti aan het water",tiktok:true},{name:"Dal Moro's",vibe:"Pasta to go",price:"€",tip:"Verse pasta in beker",tiktok:true},{name:"Cantina Do Spade",vibe:"Sinds 1488",price:"€€",tip:"Cicchetti bij Rialto"}],tiktok:[{name:"Libreria Acqua Alta",desc:"Boeken in gondels en badkuipen"},{name:"Dal Moro's pasta box",desc:"€5-8 verse pasta to-go"},{name:"Zonsondergang Zattere",desc:"Mooiste golden hour"}],transport:["Vaporetto dagpas €25/24u","Marco Polo → Alilaguna waterbus","Geen auto's — voeten + boot","Gondel ~€80/30 min"]},
{id:"garda",city:"Gardameer",emoji:"⛵",lat:45.65,lng:10.67,zoom:11,color:"#2d7a5e",intro:"Italië's grootste meer. Hotel Berta als thuisbasis.",firstSteps:["Check-in Hotel Berta","Vraag receptie naar bootschema's","Plan welke dorpen je wilt bezoeken","Zwemkleding klaarleggen"],spots:[{name:"Sirmione",desc:"Schiereiland met kasteel + thermaal",tip:"Grotte di Catullo",priority:1},{name:"Limone sul Garda",desc:"Pittoresk + citroentuinen",priority:2},{name:"Riva del Garda",desc:"Bergen ontmoeten meer",priority:3}],restaurants:[{name:"Al Pescatore",vibe:"Vis aan water",price:"€€",tip:"Sirmione terras"},{name:"Gelateria 4 Torri",vibe:"Beste gelato",price:"€",tip:"Pistachio + nocciola",tiktok:true}],tiktok:[{name:"Sirmione kasteel sunset",desc:"Gouden licht op het kasteel"},{name:"Zwemmen in het meer",desc:"Crystal clear water"}],transport:["Veerboten tussen dorpen","Auto handig westoever","Station Desenzano-Sirmione","Fietsen langs het meer"]},
{id:"verona",city:"Verona",emoji:"🏟️",lat:45.4384,lng:10.9916,zoom:14,color:"#6a3d7a",intro:"Shakespeare's stad. Arena, Amarone, mooiste piazza van Noord-Italië.",firstSteps:["Loop naar Piazza Bra — Arena zien","Verona Card kopen (musea + OV)","Check opera-programma Arena","Reserveer Osteria al Duca"],spots:[{name:"Arena di Verona",desc:"Romeins amfitheater",tip:"arena.it voor opera",priority:1},{name:"Piazza delle Erbe",desc:"Markt + aperitivo",tip:"Torre dei Lamberti",priority:2},{name:"Ponte Pietra",desc:"Romeinse brug",tip:"Castel San Pietro panorama",priority:3},{name:"Valpolicella",desc:"Amarone proeven op 20 min",priority:4}],restaurants:[{name:"Osteria al Duca",vibe:"Klassiek",price:"€€",tip:"Pastissada de caval"},{name:"Gelateria Savoia",vibe:"Sinds 1939",price:"€",tip:"Pistachio = TikTok famous",tiktok:true},{name:"Du de Cope",vibe:"Beste pizza",price:"€"}],tiktok:[{name:"Castel San Pietro sunset",desc:"Panorama over Verona"},{name:"Gelateria Savoia",desc:"Viral pistachio gelato"},{name:"Arena van binnen",desc:"Reel in het amfitheater"},{name:"Spritz Piazza Erbe",desc:"Ultieme Italiaanse avond"}],transport:["Porta Nuova — snelle treinen","Centrum = alles te voet","Bus 11/12 naar Valpolicella","Luchthaven: bus 199"]},
{id:"toscane",city:"Toscane",emoji:"🍷",lat:43.7696,lng:11.2558,zoom:11,color:"#5a7a2d",intro:"Heuvels, cipressen, wijn, Renaissance. Drie dagen is te kort maar we gaan ervoor.",firstSteps:["Check Uffizi tickets","Plan: Firenze → San Gimignano → Siena","Huurauto voor Val d'Orcia?","ZTL-zones checken"],spots:[{name:"Uffizi",desc:"Botticelli, Da Vinci, Caravaggio",tip:"Boek vooruit",priority:1},{name:"Ponte Vecchio",desc:"Brug vol juweliers",tip:"Zonsondergang!",priority:2},{name:"San Gimignano",desc:"Torens + wereldkampioen gelato",priority:3},{name:"Piazzale Michelangelo",desc:"Panorama Firenze",tip:"Ga bij sunset",priority:2},{name:"Val d'Orcia",desc:"DÉ Toscaanse heuvels",priority:4}],restaurants:[{name:"All'Antico Vinaio",vibe:"Panini legende",price:"€",tip:"Altijd rij, altijd waard",tiktok:true},{name:"Trattoria Mario",vibe:"Gedeelde tafels",price:"€",tip:"Bistecca alla fiorentina",tiktok:true},{name:"Osteria dell'Enoteca",vibe:"Wijn + wild zwijn",price:"€€",tip:"San Gimignano"},{name:"La Bottega del Buon Caffè",vibe:"Michelin",price:"€€€",tip:"Splurge avond"}],tiktok:[{name:"All'Antico Vinaio",desc:"Meest viral food van Italië"},{name:"Piazzale Michelangelo sunset",desc:"Golden hour over Duomo"},{name:"Dondero gelato",desc:"Wereldkampioen, San Gimignano"},{name:"Cypressen Val d'Orcia",desc:"Die ene iconische foto"}],transport:["Firenze SMN = hub","Trenitalia + Italo","Bus San Gimignano via Poggibonsi","Huurauto platteland, ZTL vermijden!"]},
{id:"napels",city:"Napels",emoji:"🌋",lat:40.8518,lng:14.2681,zoom:13,color:"#8a4a2d",intro:"Rauw, luid, echt. Pizza is hier uitgevonden. Chaos is de charme.",firstSteps:["Metro naar hotel, niet taxi","Loop door Spaccanapoli","Boek Pompeï tickets","Cash meenemen — veel cash only"],spots:[{name:"Spaccanapoli",desc:"Hartader — smal, luid, magisch",tip:"West→oost ochtend",priority:1},{name:"Pompeï",desc:"Bevroren stad Vesuvius",tip:"Voor 9u, tickets online",priority:1},{name:"Cappella Sansevero",desc:"Christus onder lijkkleed",tip:"Reserveer",priority:2},{name:"Vesuvius",desc:"Uitzicht Golf van Napels"},{name:"Napoli Sotterranea",desc:"Tunnels onder de stad"}],restaurants:[{name:"Da Michele",vibe:"DE pizzeria",price:"€",tip:"Alleen margherita of marinara",tiktok:true},{name:"Da Nennella",vibe:"Chaos = liefde",price:"€",tip:"Ze gooien brood. Cash only."},{name:"Sorbillo",vibe:"Rivaal Da Michele",price:"€",tip:"Frittatina is goddelijk",tiktok:true}],tiktok:[{name:"Da Michele margherita",desc:"De originele, de beste"},{name:"Frittatina Sorbillo",desc:"Gefrituurde pasta bal"},{name:"Cuoppo fritto Spaccanapoli",desc:"Gefrituurde kegel street food"},{name:"Underground tunnels",desc:"2000 jaar oude geheime stad"}],transport:["Metro L1 — Toledo = kunst","Circumvesuviana Pompeï ~€4","Alibus luchthaven ~€5","Pas op zakkenrollers"]},
{id:"amalfi",city:"Amalfikust",emoji:"🏖️",lat:40.6333,lng:14.6029,zoom:12,color:"#2d7a8a",intro:"Pastelkleuren, kliffen, azuur. Elke bocht een ansichtkaart.",firstSteps:["Check veerboot-schema's","Goede schoenen — alles is steil","Sentiero degli Dei: vroeg + 2L water","Boek restaurant met uitzicht"],spots:[{name:"Positano",desc:"DÉ ansichtkaart — kleuren & trappen",tip:"Goede schoenen!",priority:1},{name:"Sentiero degli Dei",desc:"Pad der Goden kustwandeling",tip:"Start voor 9u",priority:2},{name:"Ravello",desc:"Villa Rufolo & Cimbrone",tip:"Rustiger, oneindig uitzicht",priority:3},{name:"Amalfi kathedraal",desc:"Imposante trap"},{name:"Limoncello proeven",desc:"Citroenen als voetballen"}],restaurants:[{name:"Da Vincenzo",vibe:"Positano terras",price:"€€€",tip:"Vis + uitzicht, reserveer"},{name:"Le Arcate",vibe:"Budget aan zee",price:"€",tip:"Atrani — rustig"},{name:"Il Ritrovo",vibe:"Bergdorp",price:"€€",tip:"Kookles mogelijk"}],tiktok:[{name:"Positano van bovenaf",desc:"Die ene perfecte foto"},{name:"Lemon granita beach",desc:"Citroengranita, voeten in zee"},{name:"Path of Gods sunrise",desc:"Boven de wolken wandelen"},{name:"Atrani secret beach",desc:"Rustigste strand, locals only"}],transport:["SITA-bus kust — tabacchi tickets","Veerboot = sneller + mooier","GEEN auto","Trein Napels→Salerno, dan boot"]},
];

const DAYS:DayPlan[]=[
{day:1,title:"Aankomst Venetië",cityId:"venezia",hotel:"Hotel Venetië",activities:["Vaporetto naar hotel","San Marco → Rialto wandeling","Verdwalen in Dorsoduro"],evening:"Cicchetti + Spritz tour"},
{day:2,title:"Venetië → Gardameer",cityId:"garda",hotel:"Hotel Berta",hotelLink:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda",activities:["Ochtend: Burano bezoeken","Checkout + reis Gardameer","Aankomst Hotel Berta"],evening:"Avond aan het meer"},
{day:3,title:"Gardameer → Verona",cityId:"verona",hotel:"Hotel Verona",activities:["Ochtend: Sirmione verkennen","Lunch aan het meer","Middag: door naar Verona"],evening:"Aperitivo Piazza Bra"},
{day:4,title:"Verona",cityId:"verona",hotel:"Hotel Verona",activities:["Arena di Verona","Ponte Pietra + panorama","Valpolicella wijn"],evening:"Diner Osteria al Duca"},
{day:5,title:"Verona → Toscane",cityId:"toscane",hotel:"Agriturismo Chianti",activities:["Vertrek naar Toscane","Stop Bologna lunch?","Aankomst + inchecken"],evening:"Wijn + kaas agriturismo"},
{day:6,title:"Firenze",cityId:"toscane",hotel:"Agriturismo Chianti",activities:["Uffizi Gallery","Ponte Vecchio","Piazzale Michelangelo sunset"],evening:"Diner Trattoria Mario"},
{day:7,title:"San Gimignano & Siena",cityId:"toscane",hotel:"Agriturismo Chianti",activities:["San Gimignano + gelato","Siena Piazza del Campo","Val d'Orcia als tijd"],evening:"Laatste avond Toscane"},
{day:8,title:"Toscane → Napels",cityId:"napels",hotel:"Hotel Napels",activities:["Frecciarossa ~3u","Spaccanapoli wandeling","Napoli Sotterranea"],evening:"Pizza Da Michele"},
{day:9,title:"Pompeï & Amalfikust",cityId:"amalfi",hotel:"B&B Amalfikust",activities:["Pompeï bezoeken","Door naar Positano","Strand of wandeling"],evening:"Diner met zeezicht"},
{day:10,title:"Afscheid",cityId:"amalfi",hotel:"—",activities:["Ravello verkennen","Limoncello proeven","Naar luchthaven Napels"],evening:"Arrivederci 🇮🇹"},
];

const EMERG={Algemeen:"112",Politie:"113",Ambulance:"118",Wegenwacht:"+39 803 116","NL Ambassade":"+39 06 3228 6001"};
function useW(){const[w,setW]=useState(1024);useEffect(()=>{setW(window.innerWidth);const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return w;}

export default function Page(){
const w=useW();const m=w<768;
const[openDay,setOpenDay]=useState<number|null>(null);
const[cityId,setCityId]=useState<string|null>(null);
const[ct,setCt]=useState<"do"|"eat"|"tiktok"|"transport">("do");
const[showE,setShowE]=useState(false);
const city=cityId?C.find(c=>c.id===cityId):null;

return(<div style={{minHeight:"100vh",background:"var(--bg)"}}>
<header style={{textAlign:"center",padding:"40px 20px 20px"}}>
<div style={{display:"inline-block",background:"#c4704b",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:3,padding:"4px 16px",borderRadius:20,marginBottom:12,textTransform:"uppercase" as const}}>2026</div>
<h1 style={{fontFamily:"var(--font-serif)",fontSize:m?40:52,fontWeight:400,color:"var(--cream)",margin:0,lineHeight:1.1}}>Italia</h1>
<p style={{color:"var(--cream-muted)",fontSize:14,marginTop:6}}>Tein & Tessa · 10 dagen</p>
<p style={{color:"#8b6f5e",fontSize:12,marginTop:4}}>Venetië → Gardameer → Verona → Toscane → Napels → Amalfikust</p>
</header>

<div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px 40px",display:m?"block":"flex",gap:28}}>
{/* DAYS */}
<div style={{flex:m?undefined:"1 1 62%",minWidth:0}}>
<h2 style={{fontFamily:"var(--font-serif)",fontSize:20,color:"var(--cream)",fontWeight:400,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>📅 Dag voor dag</h2>
{DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId);const o=openDay===d.day;
return(<div key={d.day} style={{background:o?"var(--bg-card)":"rgba(35,28,24,0.5)",borderRadius:14,marginBottom:6,border:`1px solid ${o?"rgba(196,112,75,0.25)":"rgba(255,255,255,0.03)"}`,overflow:"hidden"}}>
<button onClick={()=>setOpenDay(o?null:d.day)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",color:"var(--cream)",textAlign:"left" as const,fontFamily:"var(--font-sans)"}}>
<span style={{background:c?.color||"#555",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:7,flexShrink:0}}>{d.day}</span>
<span style={{fontFamily:"var(--font-serif)",fontSize:16,flex:1,whiteSpace:"nowrap" as const,overflow:"hidden",textOverflow:"ellipsis"}}>{d.title}</span>
<span style={{fontSize:16,flexShrink:0}}>{c?.emoji}</span>
<span style={{color:"var(--cream-muted)",fontSize:12,transform:o?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
</button>
{o&&<div style={{padding:"0 16px 14px"}}>
<div style={{fontSize:12,color:"var(--cream-muted)",padding:"6px 0 8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>🏨 {d.hotel}{d.hotelLink&&<a href={d.hotelLink} target="_blank" rel="noreferrer" style={{color:"#d4886a",textDecoration:"none",marginLeft:8,fontSize:11}}>Maps ↗</a>}</div>
{d.activities.map((a,i)=><div key={i} style={{fontSize:13,color:"var(--cream)",padding:"4px 0 4px 10px",borderLeft:"2px solid rgba(196,112,75,0.25)"}}>{a}</div>)}
<div style={{fontSize:12,color:"#8b6f5e",fontStyle:"italic",marginTop:8,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.05)"}}>🌙 {d.evening}</div>
{c&&<button onClick={()=>{setCityId(c.id);setCt("do")}} style={{marginTop:10,background:"rgba(196,112,75,0.12)",border:"1px solid rgba(196,112,75,0.25)",borderRadius:8,padding:"8px 14px",color:"#d4886a",fontSize:12,cursor:"pointer",width:"100%"}}>Bekijk {c.city} {c.emoji}</button>}
</div>}
</div>)})}
</div>

{/* CITIES SIDEBAR */}
<div style={{flex:m?undefined:"0 0 34%",marginTop:m?28:0}}>
<h2 style={{fontFamily:"var(--font-serif)",fontSize:20,color:"var(--cream)",fontWeight:400,marginBottom:14}}>🏙️ Steden</h2>
{C.map(c=><button key={c.id} onClick={()=>{setCityId(c.id);setCt("do")}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:cityId===c.id?`${c.color}22`:"var(--bg-card)",border:`1px solid ${cityId===c.id?c.color+"66":"rgba(255,255,255,0.04)"}`,borderRadius:12,cursor:"pointer",color:"var(--cream)",width:"100%",textAlign:"left" as const,marginBottom:6}}>
<span style={{fontSize:22}}>{c.emoji}</span>
<span style={{fontFamily:"var(--font-serif)",fontSize:15,flex:1}}>{c.city}</span>
<span style={{color:c.color,fontSize:14}}>→</span>
</button>)}
{/* Emergency */}
<button onClick={()=>setShowE(!showE)} style={{marginTop:12,background:"rgba(196,112,75,0.1)",border:"1px solid rgba(196,112,75,0.2)",borderRadius:10,padding:"10px 14px",color:"#d4886a",fontSize:12,cursor:"pointer",width:"100%",textAlign:"left" as const}}>🚨 Noodnummers {showE?"▲":"▼"}</button>
{showE&&<div style={{background:"var(--bg-card)",borderRadius:10,padding:12,marginTop:6}}>{Object.entries(EMERG).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"var(--cream-muted)"}}>{k}</span><a href={`tel:${v.replace(/\s/g,"")}`} style={{fontSize:12,color:"#d4886a",textDecoration:"none"}}>{v}</a></div>)}</div>}
</div>
</div>

{/* CITY OVERLAY */}
{city&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,overflowY:"auto" as const,padding:m?"0":"20px"}} onClick={e=>{if(e.target===e.currentTarget)setCityId(null)}}>
<div style={{maxWidth:560,margin:"0 auto",background:"var(--bg)",borderRadius:m?0:20,minHeight:m?"100vh":"auto",paddingBottom:32}}>
<div style={{background:`linear-gradient(135deg,${city.color}99,${city.color}55)`,padding:"28px 20px 20px",borderRadius:m?"0":"20px 20px 0 0",position:"relative"}}>
<button onClick={()=>setCityId(null)} style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,0.3)",border:"none",color:"#fff",width:30,height:30,borderRadius:15,fontSize:14,cursor:"pointer"}}>✕</button>
<div style={{fontSize:44}}>{city.emoji}</div>
<h2 style={{fontFamily:"var(--font-serif)",fontSize:32,color:"#fff",margin:"8px 0 0",fontWeight:400}}>{city.city}</h2>
</div>
<div style={{padding:"0 20px"}}>
<p style={{fontSize:14,lineHeight:1.7,color:"var(--cream-muted)",margin:"16px 0",fontFamily:"var(--font-serif)",fontStyle:"italic"}}>{city.intro}</p>

<div style={{background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.2)",borderRadius:12,padding:14,marginBottom:20}}>
<div style={{fontSize:13,color:"#d4886a",fontWeight:600,marginBottom:8}}>🚀 Eerste stappen</div>
{city.firstSteps.map((s,i)=><div key={i} style={{fontSize:12,color:"var(--cream)",padding:"3px 0",display:"flex",gap:6}}><span style={{color:"#d4886a"}}>{i+1}.</span>{s}</div>)}
</div>

<div style={{borderRadius:12,overflow:"hidden",marginBottom:20,border:"1px solid rgba(255,255,255,0.06)"}}>
<iframe style={{width:"100%",height:180,border:"none",display:"block"}} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen />
</div>

<nav style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto" as const}}>
{([["do","🎯 Doen"],["eat","🍽️ Eten"],["tiktok","📱 TikTok"],["transport","🚃 Vervoer"]] as [typeof ct,string][]).map(([t,l])=><button key={t} onClick={()=>setCt(t)} style={{padding:"7px 12px",borderRadius:8,border:"none",fontSize:11,cursor:"pointer",whiteSpace:"nowrap" as const,background:ct===t?city.color:"var(--bg-card)",color:ct===t?"#fff":"var(--cream-muted)",fontWeight:ct===t?600:400}}>{l}</button>)}
</nav>

{ct==="do"&&[...city.spots].sort((a,b)=>(a.priority||99)-(b.priority||99)).map((p,i)=><div key={i} style={{background:"var(--bg-card)",borderRadius:11,padding:"12px 14px",marginBottom:6,border:"1px solid rgba(255,255,255,0.03)"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>{p.priority&&p.priority<=3&&<span style={{background:city.color,color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:5,fontWeight:700}}>#{p.priority}</span>}<span style={{fontSize:13,fontWeight:600,color:"var(--cream)"}}>{p.name}</span></div>
<div style={{fontSize:11,color:"var(--cream-muted)",lineHeight:1.5}}>{p.desc}</div>
{p.tip&&<div style={{fontSize:10,color:"#d4886a",marginTop:5}}>💡 {p.tip}</div>}
</div>)}

{ct==="eat"&&city.restaurants.map((r,i)=><div key={i} style={{background:"var(--bg-card)",borderRadius:11,padding:"12px 14px",marginBottom:6,border:"1px solid rgba(255,255,255,0.03)"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:13,fontWeight:600,color:"var(--cream)"}}>{r.name}</span><span style={{color:"#d4886a",fontSize:11}}>{r.price}</span>{r.tiktok&&<span style={{background:"#ff006622",color:"#ff0066",fontSize:8,padding:"2px 5px",borderRadius:5,fontWeight:700}}>VIRAL</span>}</div>
<div style={{fontSize:11,color:"var(--cream-muted)"}}>{r.vibe}</div>
{r.tip&&<div style={{fontSize:10,color:"#d4886a",marginTop:5}}>💡 {r.tip}</div>}
</div>)}

{ct==="tiktok"&&<div><p style={{fontSize:11,color:"var(--cream-muted)",marginBottom:10}}>📱 Viral spots & content ideeën</p>{city.tiktok.map((t,i)=><div key={i} style={{background:"var(--bg-card)",borderRadius:11,padding:"12px 14px",marginBottom:6,border:"1px solid rgba(255,255,255,0.03)",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:18}}>🎬</span><div><div style={{fontSize:13,fontWeight:600,color:"var(--cream)"}}>{t.name}</div><div style={{fontSize:11,color:"var(--cream-muted)"}}>{t.desc}</div></div></div>)}</div>}

{ct==="transport"&&city.transport.map((t,i)=><div key={i} style={{fontSize:12,color:"var(--cream-muted)",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",lineHeight:1.5}}>🚃 {t}</div>)}
</div></div></div>}

<footer style={{textAlign:"center",padding:"16px 0 36px",fontSize:12,color:"#8b6f5e",fontFamily:"var(--font-serif)",fontStyle:"italic"}}>Buon viaggio, Tein & Tessa 🇮🇹</footer>
</div>);}

/* ═══ 10-DAY PLAN ═══ */
const DAYS: Day[] = [
  { day:1, title:"Aankomst Venetië", cityId:"ven", hotel:"Hotel nabij San Marco", morning:["Vlucht → Marco Polo","Alilaguna boot naar centrum"], afternoon:["Inchecken hotel","Eerste wandeling: Rialto → San Marco"], evening:"Cicchetti & spritz bij Cantina Do Spade" },
  { day:2, title:"Venetië → Gardameer", cityId:"gar", hotel:"Hotel Berta, Gardameer", hotelUrl:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda", morning:["Burano bezoeken (vaporetto 12)","Kleurenhuizen + lace museum"], afternoon:["Checkout Venetië","Trein/auto naar Gardameer (~2u)"], evening:"Aankomst Hotel Berta, diner aan het meer" },
  { day:3, title:"Gardameer ochtend → Verona", cityId:"ver", hotel:"Hotel Verona centrum", morning:["Sirmione kasteel + thermale baden","Of: Limone sul Garda"], afternoon:["Lunch aan het meer","Doorrijden naar Verona (~45 min)"], evening:"Piazza Bra + Arena di Verona van buiten" },
  { day:4, title:"Verona", cityId:"ver", hotel:"Hotel Verona centrum", morning:["Arena di Verona (binnen)","Piazza delle Erbe + Torre dei Lamberti"], afternoon:["Ponte Pietra + Castel San Pietro panorama","Juliet's Balkon"], evening:"Amarone proeverij Valpolicella + diner" },
  { day:5, title:"Verona → Toscane", cityId:"tos", hotel:"Agriturismo Chianti streek", morning:["Checkout Verona","Trein → Firenze (~1.5u Frecciarossa)"], afternoon:["Inchecken agriturismo","Korte verkenning omgeving"], evening:"Wijn & kaas bij de agriturismo" },
  { day:6, title:"Firenze", cityId:"tos", hotel:"Agriturismo Chianti streek", morning:["Uffizi Gallery (geboekt!)","Ponte Vecchio"], afternoon:["Duomo + koepel beklimmen","All'Antico Vinaio lunch"], evening:"Piazzale Michelangelo zonsondergang + diner Mario" },
  { day:7, title:"San Gimignano & Siena", cityId:"tos", hotel:"Agriturismo Chianti streek", morning:["Auto → San Gimignano","Torens + Dondero gelato"], afternoon:["Siena: Piazza del Campo","Duomo + panorama walk"], evening:"Laatste avond Toscane" },
  { day:8, title:"Toscane → Napels", cityId:"nap", hotel:"Hotel Napels centrum", morning:["Checkout + naar station","Frecciarossa Firenze→Napels (~3u)"], afternoon:["Spaccanapoli wandeling","Metro Toledo (kunst!)"], evening:"Pizza bij Da Michele 🍕" },
  { day:9, title:"Pompeï & Amalfikust", cityId:"ama", hotel:"B&B Amalfikust", morning:["Circumvesuviana → Pompeï","Rondleiding ruïnes (3-4u)"], afternoon:["Door naar kust: Positano of Amalfi","Strand of dorpje verkennen"], evening:"Zeevruchten met uitzicht" },
  { day:10, title:"Amalfikust → Terug", cityId:"ama", hotel:"—", morning:["Ravello tuinen of Sentiero degli Dei","Limoncello proeven"], afternoon:["Terug naar Napels","Luchthaven Capodichino"], evening:"Arrivederci Italia 🇮🇹" },
];

const INIT_MS: MustSee[] = [
  { id:"1",title:"Zonsondergang Ponte Vecchio",desc:"Gouden uur over de Arno",done:false },
  { id:"2",title:"Pompeï bij ochtendlicht",desc:"Magisch zonder de drukte",done:false },
  { id:"3",title:"Burano kleurenhuizen",desc:"Meest fotogenieke plek van Italië",done:false },
  { id:"4",title:"Sentiero degli Dei",desc:"Wandelen boven de wolken",done:false },
  { id:"5",title:"Spritz bij Arena di Verona",desc:"Aperitivo met Romeins uitzicht",done:false },
];

const EMERG: Record<string,string> = { "Algemeen":"112","Politie":"113","Ambulance":"118","Wegenwacht":"+39 803 116","NL Ambassade":"+39 06 3228 6001" };

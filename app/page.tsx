"use client";
import { useState, useEffect } from "react";

interface Place { name: string; desc: string; tip?: string; }
interface Resto { name: string; cuisine: string; price: string; tip?: string; }
interface CityData { id: string; city: string; region: string; emoji: string; lat: number; lng: number; zoom: number; intro: string; hero: string; mustDo: Place[]; restaurants: Resto[]; transport: string[]; }
interface DayPlan { day: number; title: string; cityId: string; hotel: string; hotelLink?: string; activities: string[]; evening: string; }
interface MustSeeItem { id: string; title: string; desc: string; link?: string; image?: string; done: boolean; }
interface TodoItem { id: string; text: string; done: boolean; }

const EMERGENCY: Record<string,string> = { Algemeen:"112", Politie:"113", Ambulance:"118", Wegenwacht:"+39 803 116", "NL Ambassade":"+39 06 3228 6001" };

const CITIES: CityData[] = [
  { id:"venezia", city:"Venetie", region:"Veneto", emoji:"\u{1F6A3}", lat:45.4408,lng:12.3155,zoom:14, hero:"linear-gradient(135deg,#1a2533,#2d4a5e)", intro:"Drijvende droomstad. Gondels, San Marco en verloren verdwalen in steegjes.",
    mustDo:[{name:"San Marco",desc:"Het plein, de basiliek, het Dogenpaleis",tip:"Ga voor 9u ochtends"},{name:"Rialto Brug",desc:"Iconische brug + verse vismarkt",tip:"Markt alleen ochtends"},{name:"Burano",desc:"Kleurrijk eiland met perfecte fotos",tip:"Vaporetto lijn 12, ~45 min"},{name:"Dorsoduro",desc:"Rustigste sestiere, langs kanalen",tip:"Ponte dell Accademia bij zonsondergang"}],
    restaurants:[{name:"Osteria Al Squero",cuisine:"Cicchetti",price:"\u20AC",tip:"Spritz + hapjes aan het water"},{name:"Trattoria da Romano",cuisine:"Buranees",price:"\u20AC\u20AC",tip:"Op Burano, risotto di go"},{name:"Cantina Do Spade",cuisine:"Venetiaans",price:"\u20AC\u20AC",tip:"Al sinds 1488, bij Rialto"}],
    transport:["Vaporetto (waterbus) is je metro, koop 24/48u pas","Luchthaven Marco Polo: Alilaguna waterbus of bus","Alles te voet + vaporetto, geen autos","Gondel: ~80-100 euro voor 30 min"]
  },
  { id:"garda", city:"Gardameer", region:"Lombardije", emoji:"\u26F5", lat:45.65,lng:10.67,zoom:11, hero:"linear-gradient(135deg,#1a3322,#2d5e4a)", intro:"Het grootste meer van Italie. Citroentuinen, bergen en azuurblauw water.",
    mustDo:[{name:"Sirmione",desc:"Schiereiland met kasteel en thermale baden",tip:"Grotte di Catullo, Romeinse ruines"},{name:"Limone sul Garda",desc:"Pittoresk dorpje met citroentuinen",tip:"Limonaia del Castel is prachtig"},{name:"Riva del Garda",desc:"Noordpunt, bergen ontmoeten het meer",tip:"Wandeling naar Cascata del Varone"}],
    restaurants:[{name:"Al Pescatore",cuisine:"Vis",price:"\u20AC\u20AC",tip:"Sirmione, terras aan het water"},{name:"Osteria Il Gallo",cuisine:"Lokaal",price:"\u20AC",tip:"Authentiek, geen toeristen"}],
    transport:["Veerboten verbinden alle dorpen","Auto handig voor westoever","Trein Desenzano is dichtstbijzijnde station","Fietsen langs het meer is fantastisch"]
  },
  { id:"verona", city:"Verona", region:"Veneto", emoji:"\u{1F3DF}\uFE0F", lat:45.4384,lng:10.9916,zoom:14, hero:"linear-gradient(135deg,#1e1520,#3a2845)", intro:"Shakespeares stad van de liefde. Romeinse arena, Amarone en perfecte afsluiting.",
    mustDo:[{name:"Arena di Verona",desc:"Romeins amfitheater, opera openlucht",tip:"Check arena.it"},{name:"Piazza delle Erbe",desc:"Markt overdag, aperitivo avonds",tip:"Torre dei Lamberti voor uitzicht"},{name:"Ponte Pietra",desc:"Romeinse brug aan de Adige",tip:"Loop omhoog naar Castel San Pietro"},{name:"Amarone proeverij",desc:"Valpolicella op 20 min",tip:"Boek via Viator of direct"}],
    restaurants:[{name:"Osteria al Duca",cuisine:"Veronees",price:"\u20AC\u20AC",tip:"Pastissada de caval"},{name:"Du de Cope",cuisine:"Pizza",price:"\u20AC",tip:"Beste pizza van Verona"},{name:"Caffe Monte Baldo",cuisine:"Lokaal",price:"\u20AC\u20AC",tip:"Reserveer, risotto is top"}],
    transport:["Verona Porta Nuova, treinen naar Venetie/Milaan","Centrum compact, alles te voet","Luchthaven Catullo: bus 199"]
  },
  { id:"toscane", city:"Toscane", region:"Toscane", emoji:"\u{1F377}", lat:43.7696,lng:11.2558,zoom:11, hero:"linear-gradient(135deg,#1f2418,#3d4a2a)", intro:"Glooiende heuvels, cipressen, wijn en Renaissance. Hier vertraagt de tijd.",
    mustDo:[{name:"Uffizi",desc:"Botticelli, Da Vinci, Caravaggio",tip:"Boek weken vooruit"},{name:"Ponte Vecchio",desc:"Beroemde brug vol juweliers",tip:"Mooiste bij zonsondergang"},{name:"San Gimignano",desc:"Middeleeuws Manhattan",tip:"Dondero gelato = wereldkampioen"},{name:"Val d Orcia",desc:"Iconische heuvels met cipressen",tip:"Huur auto voor een dag"},{name:"Siena",desc:"Piazza del Campo en Duomo",tip:"Compacter dan Firenze"}],
    restaurants:[{name:"Trattoria Mario",cuisine:"Florentijns",price:"\u20AC",tip:"Gedeelde tafels, bistecca"},{name:"All Antico Vinaio",cuisine:"Panini",price:"\u20AC",tip:"Beroemdste broodjeszaak"},{name:"Osteria dell Enoteca",cuisine:"Toscaans",price:"\u20AC\u20AC",tip:"Wild zwijn ragu"}],
    transport:["Firenze SMN is de hub","Bus naar San Gimignano via Poggibonsi","Huurauto voor Val d Orcia","ZTL-zones, niet met auto centrum in!"]
  },
  { id:"napels", city:"Napels", region:"Campanie", emoji:"\u{1F30B}", lat:40.8518,lng:14.2681,zoom:13, hero:"linear-gradient(135deg,#2d1f1a,#4a2c1e)", intro:"Rauw, luid en echt. Geboorteplaats van pizza, poort naar Amalfikust.",
    mustDo:[{name:"Spaccanapoli",desc:"Hartader van het centrum",tip:"Loop west naar oost in de ochtend"},{name:"Pompei",desc:"Bevroren stad onder de Vesuvius",tip:"Tickets online, ga vroeg"},{name:"Cappella Sansevero",desc:"Christus onder het lijkkleed",tip:"Reserveer vooraf"},{name:"Vesuvius",desc:"Uitzicht Golf van Napels",tip:"Combi-ticket met Pompei"},{name:"Napoli Sotterranea",desc:"Tunnels onder de stad",tip:"Tours elk half uur"}],
    restaurants:[{name:"Da Michele",cuisine:"Pizza",price:"\u20AC",tip:"Alleen margherita of marinara"},{name:"Da Nennella",cuisine:"Napolitaans",price:"\u20AC",tip:"Chaotisch, fantastisch, cash only"},{name:"Sorbillo",cuisine:"Pizza",price:"\u20AC",tip:"Probeer de frittatina"}],
    transport:["Metro Lijn 1 (Toledo is spectaculair)","Circumvesuviana naar Pompei (~4 euro)","Alibus luchthaven (~5 euro)"]
  },
  { id:"amalfi", city:"Amalfikust", region:"Campanie", emoji:"\u{1F3D6}\uFE0F", lat:40.6333,lng:14.6029,zoom:12, hero:"linear-gradient(135deg,#1a2633,#2d4a5e)", intro:"Pastelkleurige dorpen aan kliffen boven azuurblauwe zee.",
    mustDo:[{name:"Positano",desc:"Iconisch kleurendorp",tip:"Comfortabele schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden, kustwandeling",tip:"Start vroeg, 2L water"},{name:"Ravello",desc:"Villa Rufolo en Cimbrone",tip:"Rustiger dan Positano"},{name:"Limoncello proeven",desc:"Citroenen zo groot als je vuist"}],
    restaurants:[{name:"Da Vincenzo",cuisine:"Vis",price:"\u20AC\u20AC\u20AC",tip:"Positano, terras reserveren"},{name:"Le Arcate",cuisine:"Pizza/pasta",price:"\u20AC",tip:"Atrani, budget aan zee"}],
    transport:["SITA-bus langs de kust","Veerboot Positano-Amalfi-Salerno","Auto afgeraden, smalle wegen","Trein naar Salerno, dan bus/boot"]
  },
];

const INIT_DAYS: DayPlan[] = [
  { day:1, title:"Aankomst Venetie", cityId:"venezia", hotel:"Hotel nabij San Marco", activities:["Aankomst luchthaven Marco Polo","Vaporetto naar hotel","Eerste wandeling: San Marco en Rialto","Aperitivo bij zonsondergang"], evening:"Cicchetti tour Cannaregio" },
  { day:2, title:"Venetie naar Gardameer", cityId:"garda", hotel:"Hotel Berta, Gardameer", hotelLink:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda", activities:["Ochtend: Burano bezoeken","Middag: checkout + reis naar Gardameer","Aankomst Hotel Berta"], evening:"Rustige avond aan het meer" },
  { day:3, title:"Gardameer en Verona", cityId:"verona", hotel:"Hotel Verona centrum", activities:["Ochtend: Sirmione of Limone sul Garda","Lunch aan het meer","Middag: doorrijden naar Verona","Eerste verkenning Piazza delle Erbe"], evening:"Aperitivo Piazza Bra + Arena bekijken" },
  { day:4, title:"Verona", cityId:"verona", hotel:"Hotel Verona centrum", activities:["Arena di Verona","Ponte Pietra + Castel San Pietro","Juliets Balkon (voor de foto)","Amarone wijnproeverij Valpolicella"], evening:"Diner Osteria al Duca" },
  { day:5, title:"Verona naar Toscane", cityId:"toscane", hotel:"Agriturismo Chianti", activities:["Ochtend: vertrek naar Toscane (~3u)","Onderweg: stop in Bologna voor lunch","Aankomst Toscane, inchecken","Avondwandeling platteland"], evening:"Wijn + kaas bij agriturismo" },
  { day:6, title:"Firenze", cityId:"toscane", hotel:"Agriturismo Chianti", activities:["Uffizi Gallery (ochtend)","Ponte Vecchio","Duomo + Piazzale Michelangelo","All Antico Vinaio lunch"], evening:"Diner Trattoria Mario" },
  { day:7, title:"San Gimignano en Siena", cityId:"toscane", hotel:"Agriturismo Chianti", activities:["Ochtend: San Gimignano + gelato Dondero","Middag: Siena, Piazza del Campo","Val d Orcia rijden als tijd over"], evening:"Laatste avond Toscane" },
  { day:8, title:"Toscane naar Napels", cityId:"napels", hotel:"Hotel Napels centrum", activities:["Trein Firenze naar Napels (~3u Frecciarossa)","Aankomst + inchecken","Spaccanapoli wandeling","Napoli Sotterranea tour"], evening:"Pizza Da Michele" },
  { day:9, title:"Pompei en Amalfikust", cityId:"amalfi", hotel:"B&B Amalfikust", activities:["Ochtend: Circumvesuviana naar Pompei","Middag: door naar Positano/Amalfi","Strand of Sentiero degli Dei wandeling"], evening:"Diner met uitzicht op zee" },
  { day:10, title:"Amalfikust en terug", cityId:"amalfi", hotel:"Terugreis", activities:["Ochtend: Ravello of Amalfi verkennen","Limoncello proeven","Terugreis naar luchthaven Napels","Vlucht naar huis"], evening:"Arrivederci Italia" },
];

const DEFAULT_MS: MustSeeItem[] = [
  { id:"ms1", title:"Zonsondergang Ponte Vecchio", desc:"Gouden uur over de Arno", done:false },
  { id:"ms2", title:"Pompei vroeg in de ochtend", desc:"Voor de drukte, magisch licht", done:false },
  { id:"ms3", title:"Burano kleurenwijk", desc:"Instagram-perfect eiland bij Venetie", done:false },
  { id:"ms4", title:"Sentiero degli Dei", desc:"Pad der Goden langs de Amalfikust", done:false },
];

const uid = () => Math.random().toString(36).slice(2,9);
function useLocal<T>(key:string, init:T):[T,(v:T|((_:T)=>T))=>void] {
  const [val,setVal] = useState<T>(init);
  useEffect(()=>{ try{ const d=localStorage.getItem(key); if(d) setVal(JSON.parse(d)); }catch{} },[key]);
  const set = (v:T|((_:T)=>T)) => setVal(p=>{ const n=typeof v==="function"?(v as (_:T)=>T)(p):v; localStorage.setItem(key,JSON.stringify(n)); return n; });
  return [val,set];
}

type Tab = "plan"|"cities"|"mustsee"|"todo";

export default function Page() {
  const [tab,setTab] = useState<Tab>("plan");
  const [cityId,setCityId] = useState<string|null>(null);
  const [mustSee,setMustSee] = useLocal<MustSeeItem[]>("it-ms", DEFAULT_MS);
  const [todos,setTodos] = useLocal<TodoItem[]>("it-td", []);
  const [showEmerg,setShowEmerg] = useState(false);
  const [addMS,setAddMS] = useState(false);
  const [addTD,setAddTD] = useState(false);
  const [mf,setMf] = useState({t:"",d:"",l:"",i:""});
  const [tf,setTf] = useState("");
  const city = cityId ? CITIES.find(c=>c.id===cityId) : null;

  return (
    <div style={S.wrap}>
      <header style={S.hdr}><div style={S.pin}>2026</div><h1 style={S.ttl}>Italia</h1><p style={S.sub}>Tein & Tessa &middot; 10 dagen</p></header>
      <nav style={S.tabs}>{([["plan","Planning"],["cities","Steden"],["mustsee","Must-See"],["todo","To-Do"]] as [Tab,string][]).map(([t,l])=><button key={t} onClick={()=>{setTab(t);setCityId(null)}} style={{...S.tab,...(tab===t?S.tabA:{})}}>{l}</button>)}</nav>

      {tab==="plan"&&<div style={S.ct}>{INIT_DAYS.map(d=>{const c=CITIES.find(x=>x.id===d.cityId);return(
        <div key={d.day} style={S.dayC}>
          <div style={S.dayH}><span style={S.dayN}>Dag {d.day}</span><span style={S.dayT}>{d.title}</span>{c&&<span style={{cursor:"pointer"}} onClick={()=>{setCityId(c.id);setTab("cities")}}>{c.emoji}</span>}</div>
          <div style={S.dayHt}>{"🏨 "+d.hotel}{d.hotelLink&&<a href={d.hotelLink} target="_blank" rel="noreferrer" style={S.htL}> Maps</a>}</div>
          <div>{d.activities.map((a,i)=><div key={i} style={S.act}>{"• "+a}</div>)}</div>
          <div style={S.eve}>{"🌙 "+d.evening}</div>
        </div>)})}</div>}

      {tab==="cities"&&!city&&<div style={S.ct}>{CITIES.map(c=><button key={c.id} onClick={()=>setCityId(c.id)} style={{...S.ccrd,background:c.hero}}><span style={S.cem}>{c.emoji}</span><div><div style={S.cnm}>{c.city}</div><div style={S.crg}>{c.region}</div></div><span style={S.car}>&rarr;</span></button>)}</div>}

      {tab==="cities"&&city&&<div style={S.ct}>
        <button onClick={()=>setCityId(null)} style={S.back}>&larr; Alle steden</button>
        <div style={{...S.hero,background:city.hero}}><span style={{fontSize:44,display:"block",marginBottom:6}}>{city.emoji}</span><h2 style={S.hNm}>{city.city}</h2><p style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:4}}>{city.region}</p></div>
        <p style={S.intro}>{city.intro}</p>
        <div style={S.mapW}><iframe style={S.mapF} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={"https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center="+city.lat+","+city.lng+"&zoom="+city.zoom+"&maptype=roadmap"} allowFullScreen /></div>
        <section style={S.sec}><h3 style={S.sT}>Must-dos</h3>{city.mustDo.map((p,i)=><div key={i} style={S.crd}><div style={S.cN}>{p.name}</div><div style={S.cD}>{p.desc}</div>{p.tip&&<div style={S.tip}>{p.tip}</div>}</div>)}</section>
        <section style={S.sec}><h3 style={S.sT}>Eten en drinken</h3>{city.restaurants.map((r,i)=><div key={i} style={S.crd}><div style={S.cN}>{r.name} <span style={S.pr}>{r.price}</span></div><div style={S.cD}>{r.cuisine}</div>{r.tip&&<div style={S.tip}>{r.tip}</div>}</div>)}</section>
        <section style={S.sec}><h3 style={S.sT}>Vervoer</h3>{city.transport.map((t,i)=><div key={i} style={S.trn}>{t}</div>)}</section>
      </div>}

      {tab==="mustsee"&&<div style={S.ct}>
        <div style={S.lH}><h2 style={S.lT}>Must-See</h2><button onClick={()=>setAddMS(true)} style={S.addB}>+ Toevoegen</button></div>
        {addMS&&<div style={S.fBox}><input placeholder="Titel *" value={mf.t} onChange={e=>setMf({...mf,t:e.target.value})} style={S.inp}/><input placeholder="Beschrijving" value={mf.d} onChange={e=>setMf({...mf,d:e.target.value})} style={S.inp}/><input placeholder="Link (optioneel)" value={mf.l} onChange={e=>setMf({...mf,l:e.target.value})} style={S.inp}/><input placeholder="Afbeelding URL (optioneel)" value={mf.i} onChange={e=>setMf({...mf,i:e.target.value})} style={S.inp}/><div style={S.fA}><button onClick={()=>{if(!mf.t)return;setMustSee(p=>[...p,{id:uid(),title:mf.t,desc:mf.d,link:mf.l||undefined,image:mf.i||undefined,done:false}]);setMf({t:"",d:"",l:"",i:""});setAddMS(false)}} style={S.svB}>Opslaan</button><button onClick={()=>setAddMS(false)} style={S.cnB}>Annuleer</button></div></div>}
        {mustSee.map(m=><div key={m.id} style={{...S.msC,...(m.done?{opacity:0.5}:{})}}>
          {m.image&&<div style={{width:56,height:56,borderRadius:10,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0,backgroundImage:"url("+m.image+")"}}/>}
          <div style={{flex:1,minWidth:0}}><div style={S.msT}><button onClick={()=>setMustSee(p=>p.map(x=>x.id===m.id?{...x,done:!x.done}:x))} style={S.chk}>{m.done?"\u2705":"\u2B1C"}</button>{m.link?<a href={m.link} target="_blank" rel="noreferrer" style={S.msL}>{m.title}</a>:m.title}</div>{m.desc&&<div style={S.msD}>{m.desc}</div>}</div>
          <button onClick={()=>setMustSee(p=>p.filter(x=>x.id!==m.id))} style={S.del}>&times;</button>
        </div>)}
        {mustSee.length===0&&<p style={S.emp}>Nog geen items. Voeg je eerste must-see toe!</p>}
      </div>}

      {tab==="todo"&&<div style={S.ct}>
        <div style={S.lH}><h2 style={S.lT}>To-Do</h2><button onClick={()=>setAddTD(true)} style={S.addB}>+ Toevoegen</button></div>
        {addTD&&<div style={S.fBox}><input placeholder="Wat moet er gebeuren?" value={tf} onChange={e=>setTf(e.target.value)} style={S.inp} onKeyDown={e=>{if(e.key==="Enter"&&tf){setTodos(p=>[...p,{id:uid(),text:tf,done:false}]);setTf("");setAddTD(false)}}}/><div style={S.fA}><button onClick={()=>{if(!tf)return;setTodos(p=>[...p,{id:uid(),text:tf,done:false}]);setTf("");setAddTD(false)}} style={S.svB}>Toevoegen</button><button onClick={()=>setAddTD(false)} style={S.cnB}>Annuleer</button></div></div>}
        {todos.map(t=><div key={t.id} style={{...S.tdI,...(t.done?{opacity:0.5}:{})}}>
          <button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={S.chk}>{t.done?"\u2705":"\u2B1C"}</button>
          <span style={{fontSize:14,color:"var(--cream)",flex:1,...(t.done?{textDecoration:"line-through"}:{})}}>{t.text}</span>
          <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={S.del}>&times;</button>
        </div>)}
        {todos.length===0&&<p style={S.emp}>Nog geen items.</p>}
      </div>}

      <button onClick={()=>setShowEmerg(!showEmerg)} style={S.emB}>{"🚨 Noodnummers "+(showEmerg?"\u25B2":"\u25BC")}</button>
      {showEmerg&&<div style={S.emBx}>{Object.entries(EMERGENCY).map(([k,v])=><div key={k} style={S.emR}><span style={{fontSize:12,color:"var(--cream-muted)"}}>{k}</span><a href={"tel:"+v.replace(/\s/g,"")} style={{fontSize:13,color:"#d4886a",textDecoration:"none",fontWeight:500}}>{v}</a></div>)}</div>}
      <footer style={S.ftr}>Buon viaggio, Tein &amp; Tessa &#x1F1EE;&#x1F1F9;</footer>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap:{maxWidth:480,margin:"0 auto",padding:"0 16px",minHeight:"100vh"},
  hdr:{textAlign:"center",padding:"40px 0 20px"},
  pin:{display:"inline-block",background:"#c4704b",color:"#fff",fontSize:11,fontWeight:600,letterSpacing:2,padding:"4px 14px",borderRadius:20,marginBottom:12,textTransform:"uppercase"},
  ttl:{fontFamily:"var(--font-serif)",fontSize:48,fontWeight:400,color:"var(--cream)",lineHeight:1.1,margin:0},
  sub:{fontSize:14,color:"var(--cream-muted)",marginTop:6},
  tabs:{display:"flex",gap:4,marginBottom:20,overflowX:"auto",paddingBottom:4},
  tab:{flex:1,padding:"10px 6px",background:"var(--bg-card)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,color:"var(--cream-muted)",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",minWidth:0},
  tabA:{background:"#c4704b",color:"#fff",borderColor:"#c4704b"},
  ct:{paddingBottom:16},
  dayC:{background:"var(--bg-card)",borderRadius:14,padding:"16px 18px",marginBottom:12,border:"1px solid rgba(255,255,255,0.04)",borderLeft:"3px solid #c4704b"},
  dayH:{display:"flex",alignItems:"center",gap:8,marginBottom:8},
  dayN:{background:"rgba(196,112,75,0.2)",color:"#d4886a",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:8},
  dayT:{fontFamily:"var(--font-serif)",fontSize:18,fontWeight:400,color:"var(--cream)",flex:1},
  dayHt:{fontSize:13,color:"var(--cream-muted)",marginBottom:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"},
  htL:{color:"#d4886a",textDecoration:"none",fontSize:12},
  act:{fontSize:13,color:"var(--cream-muted)",padding:"3px 0",lineHeight:1.5},
  eve:{fontSize:13,color:"#8b6f5e",fontStyle:"italic",paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.04)"},
  ccrd:{display:"flex",alignItems:"center",gap:14,padding:18,borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",color:"var(--cream)",textAlign:"left",fontSize:16,width:"100%",marginBottom:8},
  cem:{fontSize:28,flexShrink:0},
  cnm:{fontFamily:"var(--font-serif)",fontSize:20,fontWeight:400},
  crg:{fontSize:12,color:"var(--cream-muted)",marginTop:2},
  car:{marginLeft:"auto",fontSize:18,color:"#c4704b",flexShrink:0},
  back:{background:"none",border:"none",color:"#d4886a",fontSize:14,cursor:"pointer",padding:"8px 0",marginBottom:8},
  hero:{borderRadius:18,padding:"32px 20px",textAlign:"center",marginBottom:16},
  hNm:{fontFamily:"var(--font-serif)",fontSize:32,fontWeight:400,color:"#fff",margin:0},
  intro:{fontSize:14,lineHeight:1.7,color:"var(--cream-muted)",marginBottom:20,fontStyle:"italic",fontFamily:"var(--font-serif)"},
  mapW:{borderRadius:14,overflow:"hidden",marginBottom:24,border:"1px solid rgba(255,255,255,0.08)"},
  mapF:{width:"100%",height:200,border:"none",display:"block"},
  sec:{marginBottom:24},
  sT:{fontFamily:"var(--font-serif)",fontSize:20,fontWeight:400,color:"var(--cream)",marginBottom:12,paddingBottom:6,borderBottom:"1px solid rgba(255,255,255,0.08)"},
  crd:{background:"var(--bg-card)",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"},
  cN:{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3},
  cD:{fontSize:12,color:"var(--cream-muted)",lineHeight:1.5},
  pr:{color:"#d4886a",fontWeight:400,fontSize:12},
  tip:{fontSize:11,color:"#d4886a",marginTop:6},
  trn:{fontSize:13,color:"var(--cream-muted)",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5},
  lH:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  lT:{fontFamily:"var(--font-serif)",fontSize:22,fontWeight:400,color:"var(--cream)",margin:0},
  addB:{background:"#c4704b",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,cursor:"pointer"},
  fBox:{background:"var(--bg-card)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10},
  inp:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 12px",color:"var(--cream)",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"},
  fA:{display:"flex",gap:8},
  svB:{background:"#c4704b",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,cursor:"pointer"},
  cnB:{background:"transparent",color:"var(--cream-muted)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer"},
  msC:{background:"var(--bg-card)",borderRadius:14,padding:14,marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:12,alignItems:"flex-start"},
  msT:{fontSize:14,fontWeight:600,color:"var(--cream)",display:"flex",alignItems:"center",gap:6},
  msL:{color:"#d4886a",textDecoration:"none"},
  msD:{fontSize:12,color:"var(--cream-muted)",marginTop:4,lineHeight:1.4},
  chk:{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:0,flexShrink:0},
  del:{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:14,cursor:"pointer",padding:"4px",flexShrink:0},
  tdI:{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg-card)",borderRadius:12,marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"},
  emp:{fontSize:13,color:"var(--cream-muted)",textAlign:"center",padding:32,fontStyle:"italic"},
  emB:{background:"rgba(196,112,75,0.12)",border:"1px solid rgba(196,112,75,0.3)",borderRadius:12,padding:"12px 18px",color:"#d4886a",fontSize:13,cursor:"pointer",width:"100%",textAlign:"left",marginTop:12},
  emBx:{background:"var(--bg-card)",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:8,marginTop:8},
  emR:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  ftr:{textAlign:"center",padding:"28px 0 44px",fontSize:13,color:"var(--accent)",fontFamily:"var(--font-serif)",fontStyle:"italic"},
};

"use client";
import { useState, useEffect } from "react";

interface Spot{name:string;desc:string;tip?:string}
interface Resto{name:string;type:string;price:string;tip?:string}
interface Viral{name:string;desc:string;tag:string}
interface City{id:string;name:string;region:string;emoji:string;color:string;lat:number;lng:number;zoom:number;intro:string;firstSteps:string[];spots:Spot[];restaurants:Resto[];viral:Viral[];transport:string[]}
interface Day{day:number;title:string;cityId:string;hotel:string;hotelUrl?:string;morning:string[];afternoon:string[];evening:string}
interface MustSee{id:string;title:string;desc:string;link?:string;img?:string;done:boolean}
interface Todo{id:string;text:string;done:boolean}

const C:City[]=[
{id:"ven",name:"Venetië",region:"Veneto",emoji:"🚣",color:"#1e3a5f",lat:45.4408,lng:12.3155,zoom:14,intro:"Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.",firstSteps:["Koop vaporetto dagpas bij station","Download Venezia Unica app","Water bij supermarkt, niet op plein","Loop Rialto → San Marco als eerste"],spots:[{name:"San Marco",desc:"Plein, basiliek, Dogenpaleis",tip:"Voor 9u gaan"},{name:"Rialto & Markt",desc:"Iconische brug + vismarkt",tip:"Markt 7:30-12:00"},{name:"Burano",desc:"Kleurrijkste eiland",tip:"Vaporetto 12, 45 min"},{name:"Dorsoduro",desc:"Rustigste wijk",tip:"Ponte Accademia bij sunset"}],restaurants:[{name:"Osteria Al Squero",type:"Cicchetti",price:"€",tip:"Spritz aan het water"},{name:"Da Romano",type:"Buranees",price:"€€",tip:"Risotto di gò op Burano"},{name:"Cantina Do Spade",type:"Venetiaans",price:"€€",tip:"Sinds 1488"}],viral:[{name:"Libreria Acqua Alta",desc:"Boekwinkel met gondels",tag:"#venezia"},{name:"Burano streets",desc:"Meest Instagrammable",tag:"#burano"},{name:"Gondel sunset",desc:"Cliché maar onvergetelijk",tag:"#gondola"}],transport:["Vaporetto dagpas kopen","Alilaguna boot vanaf vliegveld","Alles te voet + vaporetto","Gondel ~€80-100/30min"]},
{id:"gar",name:"Gardameer",region:"Lombardije",emoji:"⛵",color:"#1a4433",lat:45.65,lng:10.67,zoom:11,intro:"Grootste meer van Italië. Citroentuinen, bergen, Hotel Berta.",firstSteps:["Check in Hotel Berta","Huur boot of fiets bij haven","Download Navigarda voor veerboten","Koop limoncello lokaal"],spots:[{name:"Sirmione",desc:"Kasteel + thermale bronnen",tip:"Grotte di Catullo"},{name:"Limone sul Garda",desc:"Citroentuinen",tip:"Limonaia del Castel"},{name:"Riva del Garda",desc:"Bergen + meer",tip:"Cascata del Varone"}],restaurants:[{name:"Al Pescatore",type:"Vis",price:"€€",tip:"Terras aan water"},{name:"Il Gallo",type:"Lokaal",price:"€",tip:"Authentiek"}],viral:[{name:"Sirmione kasteel",desc:"Toren uit het water",tag:"#lakegarda"},{name:"Limone citroenen",desc:"Geel tegen blauw",tag:"#limone"}],transport:["Veerboten: navigazionelaghi.it","Auto voor westoever","Trein: Desenzano","Fietsen = top"]},
{id:"ver",name:"Verona",region:"Veneto",emoji:"🏟",color:"#3a1e45",lat:45.4384,lng:10.9916,zoom:14,intro:"Shakespeare's stad. Arena, Amarone, liefde overal.",firstSteps:["Station → Piazza Bra (10 min)","Koop Verona Card 24/48u","Arena van buiten = gratis","Boek wijnproeverij Valpolicella"],spots:[{name:"Arena di Verona",desc:"Romeins amfitheater",tip:"arena.it voor opera"},{name:"Piazza delle Erbe",desc:"Markt + aperitivo",tip:"Torre dei Lamberti"},{name:"Castel San Pietro",desc:"Panorama",tip:"15 min klimmen"},{name:"Ponte Pietra",desc:"Romeinse brug",tip:"Golden hour"},{name:"Valpolicella",desc:"Amarone wijnstreek",tip:"20 min rijden"}],restaurants:[{name:"Osteria al Duca",type:"Veronees",price:"€€",tip:"Pastissada"},{name:"Du de Cope",type:"Pizza",price:"€",tip:"Beste pizza"},{name:"Monte Baldo",type:"Osteria",price:"€€",tip:"Reserveer"}],viral:[{name:"Juliet Balkon",desc:"Briefjes op muur",tag:"#juliet"},{name:"Arena nacht",desc:"Verlicht = magisch",tag:"#arena"},{name:"Spritz Erbe",desc:"Aperitivo op plein",tag:"#spritz"}],transport:["Porta Nuova → Venetië/Milaan","Centrum = te voet","Bus Valpolicella","Luchthaven: bus 199"]},
{id:"tos",name:"Toscane",region:"Toscane",emoji:"🍷",color:"#2a3518",lat:43.7696,lng:11.2558,zoom:10,intro:"Renaissance, cipressen, wijn. Firenze + droomdorpen.",firstSteps:["Boek Uffizi WEKEN vooruit","Download Trenitalia app","Huur auto 1 dag Val d'Orcia","ZTL = niet centrum inrijden!"],spots:[{name:"Uffizi",desc:"Botticelli, Da Vinci",tip:"Boek vooruit"},{name:"Ponte Vecchio",desc:"Juweliersbrug",tip:"Sunset = goud"},{name:"San Gimignano",desc:"Torens + gelato",tip:"Dondero"},{name:"Val d'Orcia",desc:"Cipressen-foto",tip:"Auto huren"},{name:"Siena",desc:"Piazza del Campo",tip:"Compact"},{name:"Piazzale Michelangelo",desc:"Uitzicht Firenze",tip:"Zonsondergang"}],restaurants:[{name:"Trattoria Mario",type:"Florentijns",price:"€",tip:"Bistecca"},{name:"All'Antico Vinaio",type:"Panini",price:"€",tip:"Beroemdste broodjes"},{name:"dell'Enoteca",type:"Toscaans",price:"€€",tip:"Wild zwijn"}],viral:[{name:"Vinaio rij",desc:"Film je schiacciata",tag:"#foodtiktok"},{name:"Val d'Orcia",desc:"Cipressenlaan",tag:"#tuscany"},{name:"Ponte Vecchio",desc:"Selfie spot",tag:"#florence"}],transport:["Firenze SMN hub","Bus San Gimignano","Auto Val d'Orcia","ZTL boete €150+"]},
{id:"nap",name:"Napels",region:"Campanië",emoji:"🌋",color:"#3d1f1a",lat:40.8518,lng:14.2681,zoom:13,intro:"Rauw, luid, echt. Pizza, Pompeï, Vesuvius.",firstSteps:["Metro naar Toledo (kunst!)","Loop Spaccanapoli west→oost","Boek Pompeï online","Cash meenemen"],spots:[{name:"Spaccanapoli",desc:"Hartader centrum",tip:"Ochtend = best"},{name:"Pompeï",desc:"Bevroren stad",tip:"Vroeg gaan"},{name:"Cappella Sansevero",desc:"Christus-sculptuur",tip:"Reserveer"},{name:"Vesuvius",desc:"Beklim vulkaan",tip:"Combi-ticket"},{name:"Sotterranea",desc:"Tunnels",tip:"Elk half uur"}],restaurants:[{name:"Da Michele",type:"Pizza",price:"€",tip:"Margherita only"},{name:"Da Nennella",type:"Napolitaans",price:"€",tip:"Cash, chaos"},{name:"Sorbillo",type:"Pizza",price:"€",tip:"Frittatina!"}],viral:[{name:"Da Michele",desc:"Pizza fold",tag:"#damichele"},{name:"Toledo metro",desc:"Mooiste station",tag:"#naplesmetro"},{name:"Street food",desc:"Frittatina",tag:"#streetfood"}],transport:["Metro Lijn 1","Circumvesuviana €4","Alibus €5","Zakkenrollers!"]},
{id:"ama",name:"Amalfikust",region:"Campanië",emoji:"🏖",color:"#1a3040",lat:40.6333,lng:14.6029,zoom:12,intro:"Pastelkliffen, azuurblauwe zee, citroenen overal.",firstSteps:["SITA-bus kaartjes bij tabacchi","Veerboot = sneller + mooier","GOEDE schoenen!","Sentiero degli Dei: start vroeg"],spots:[{name:"Positano",desc:"Kleurendorp",tip:"Comfy schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden",tip:"Vroeg + 2L water"},{name:"Ravello",desc:"Tuinen + uitzicht",tip:"Rustiger"},{name:"Amalfi Duomo",desc:"Kathedraal",tip:"Gratis"}],restaurants:[{name:"Da Vincenzo",type:"Vis",price:"€€€",tip:"Positano terras"},{name:"Le Arcate",type:"Pizza",price:"€",tip:"Atrani aan zee"},{name:"Il Ritrovo",type:"Seizoen",price:"€€",tip:"Kookles!"}],viral:[{name:"Positano trappen",desc:"Pastel op azuur",tag:"#positano"},{name:"Limoncello",desc:"Citroenen!",tag:"#limoncello"},{name:"Path of Gods",desc:"Boven wolken",tag:"#hiking"}],transport:["SITA-bus kust","Veerboot","Geen auto!","Trein Napels→Salerno"]},
];

const DAYS:Day[]=[
{day:1,title:"Aankomst Venetië",cityId:"ven",hotel:"Hotel nabij San Marco",morning:["Vlucht → Marco Polo","Alilaguna boot centrum"],afternoon:["Inchecken","Wandeling Rialto → San Marco"],evening:"Cicchetti & spritz Cannaregio"},
{day:2,title:"Venetië → Gardameer",cityId:"gar",hotel:"Hotel Berta, Gardameer",hotelUrl:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda",morning:["Burano bezoeken","Kleurenhuizen"],afternoon:["Checkout Venetië","Reis Gardameer (~2u)"],evening:"Hotel Berta, diner aan meer"},
{day:3,title:"Gardameer → Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Sirmione kasteel","Of: Limone sul Garda"],afternoon:["Lunch aan meer","Naar Verona (~45 min)"],evening:"Piazza Bra + Arena bekijken"},
{day:4,title:"Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Arena di Verona","Piazza delle Erbe + toren"],afternoon:["Ponte Pietra + panorama","Juliet Balkon"],evening:"Amarone proeverij + diner"},
{day:5,title:"Verona → Toscane",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Checkout Verona","Frecciarossa Firenze (1.5u)"],afternoon:["Inchecken agriturismo","Omgeving verkennen"],evening:"Wijn & kaas agriturismo"},
{day:6,title:"Firenze",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Uffizi Gallery","Ponte Vecchio"],afternoon:["Duomo beklimmen","Vinaio lunch"],evening:"Piazzale Michelangelo sunset"},
{day:7,title:"San Gimignano & Siena",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Auto San Gimignano","Torens + gelato Dondero"],afternoon:["Siena Piazza del Campo","Duomo"],evening:"Laatste avond Toscane"},
{day:8,title:"Toscane → Napels",cityId:"nap",hotel:"Hotel Napels centrum",morning:["Checkout","Frecciarossa Napels (3u)"],afternoon:["Spaccanapoli","Metro Toledo"],evening:"Pizza Da Michele"},
{day:9,title:"Pompeï & Amalfikust",cityId:"ama",hotel:"B&B Amalfikust",morning:["Trein → Pompeï","Rondleiding ruïnes"],afternoon:["Door naar Positano","Strand of dorpje"],evening:"Zeevruchten met uitzicht"},
{day:10,title:"Amalfikust → Terug",cityId:"ama",hotel:"—",morning:["Ravello of Sentiero","Limoncello proeven"],afternoon:["Terug Napels","Luchthaven"],evening:"Arrivederci Italia!"},
];

const INIT_MS:MustSee[]=[
{id:"1",title:"Sunset Ponte Vecchio",desc:"Gouden uur over de Arno",done:false},
{id:"2",title:"Pompeï ochtendlicht",desc:"Magisch zonder drukte",done:false},
{id:"3",title:"Burano kleuren",desc:"Fotogeniekste plek",done:false},
{id:"4",title:"Sentiero degli Dei",desc:"Wandelen boven wolken",done:false},
{id:"5",title:"Spritz bij Arena",desc:"Aperitivo + Romeins uitzicht",done:false},
];

const EM:Record<string,string>={"Algemeen":"112","Politie":"113","Ambulance":"118","Wegenwacht":"+39 803 116","NL Ambassade":"+39 06 3228 6001"};
const uid=()=>Math.random().toString(36).slice(2,8);
function useLS<T>(k:string,i:T):[T,(v:T|((_:T)=>T))=>void]{const[v,s]=useState<T>(i);useEffect(()=>{try{const x=localStorage.getItem(k);if(x)s(JSON.parse(x))}catch{}},[k]);return[v,(x:T|((_:T)=>T))=>{s(p=>{const n=typeof x==="function"?(x as((_:T)=>T))(p):x;localStorage.setItem(k,JSON.stringify(n));return n})}]}

export default function Page(){
  const[selDay,setSelDay]=useState<number|null>(null);
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
  const[cityDrop,setCityDrop]=useState(false);
  const city=cityId?C.find(c=>c.id===cityId)||null:null;
  const openC=(id:string)=>{setCityId(id);setView("city");setCtab("do");setCityDrop(false)};
  const back=()=>{setView("main");setCityId(null)};
  const inp:React.CSSProperties={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 12px",color:"var(--cream)",fontSize:14,fontFamily:"var(--sans)",outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"var(--sans)"}}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{width:220,flexShrink:0,background:"var(--bg2)",borderRight:"1px solid rgba(255,255,255,0.06)",padding:"20px 0",position:"sticky",top:0,height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0 16px 20px",textAlign:"center"}}>
          <div style={{display:"inline-block",background:"var(--terra)",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:3,padding:"2px 12px",borderRadius:16,marginBottom:8,textTransform:"uppercase"}}>2026</div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:28,fontWeight:400,color:"var(--cream)",lineHeight:1.1}}>Italia</h1>
          <p style={{fontSize:11,color:"var(--cream3)",marginTop:4}}>Tein & Tessa</p>
        </div>

        {/* Days list */}
        <div style={{flex:1,overflowY:"auto"}}>
          <div style={{padding:"0 8px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--cream3)",letterSpacing:2,padding:"0 8px 8px",textTransform:"uppercase"}}>10 Dagen</div>
            {DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId)!;const sel=selDay===d.day&&view==="main";return(
              <button key={d.day} onClick={()=>{setSelDay(sel?null:d.day);setView("main");setCityId(null)}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:sel?"rgba(196,112,75,0.15)":"transparent",color:"var(--cream)",cursor:"pointer",textAlign:"left",marginBottom:2,transition:"all .15s",fontFamily:"var(--sans)"}}>
                <span style={{fontSize:12,fontWeight:700,color:sel?"var(--terra-l)":"var(--cream3)",minWidth:28}}>D{d.day}</span>
                <span style={{fontSize:15}}>{c.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:sel?"var(--cream)":"var(--cream2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                </div>
              </button>
            )})}
          </div>

          {/* Cities dropdown */}
          <div style={{padding:"0 8px",marginBottom:16}}>
            <button onClick={()=>setCityDrop(!cityDrop)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",background:"var(--bg3)",color:"var(--cream2)",cursor:"pointer",fontSize:12,fontFamily:"var(--sans)"}}>
              <span style={{fontWeight:600}}>Steden</span><span>{cityDrop?"\u25B2":"\u25BC"}</span>
            </button>
            {cityDrop&&C.map(c=>(
              <button key={c.id} onClick={()=>openC(c.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 12px",border:"none",background:cityId===c.id?"rgba(196,112,75,0.12)":"transparent",borderRadius:8,color:"var(--cream)",cursor:"pointer",textAlign:"left",fontSize:12,marginTop:2,fontFamily:"var(--sans)"}}>
                <span style={{fontSize:14}}>{c.emoji}</span><span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Quick links */}
          <div style={{padding:"0 8px"}}>
            <button onClick={()=>{setView("ms");setCityId(null)}} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:view==="ms"?"rgba(196,112,75,0.12)":"transparent",color:view==="ms"?"var(--terra-l)":"var(--cream2)",cursor:"pointer",textAlign:"left",fontSize:12,marginBottom:2,fontFamily:"var(--sans)"}}>\u2B50 Must-See ({ms.filter(m=>!m.done).length})</button>
            <button onClick={()=>{setView("td");setCityId(null)}} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:view==="td"?"rgba(196,112,75,0.12)":"transparent",color:view==="td"?"var(--terra-l)":"var(--cream2)",cursor:"pointer",textAlign:"left",fontSize:12,marginBottom:2,fontFamily:"var(--sans)"}}>\u2705 To-Do ({todos.filter(t=>!t.done).length})</button>
            <button onClick={()=>setShowE(!showE)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:"transparent",color:"var(--terra-l)",cursor:"pointer",textAlign:"left",fontSize:12,fontFamily:"var(--sans)"}}>\U0001F6A8 Nood</button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <main style={{flex:1,maxWidth:640,padding:"24px 28px 80px",margin:"0 auto"}}>

        {/* MAIN VIEW - Day detail */}
        {view==="main"&&selDay&&(()=>{const d=DAYS.find(x=>x.day===selDay)!;const c=C.find(x=>x.id===d.cityId)!;return(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--terra-l)",letterSpacing:2,marginBottom:4}}>DAG {d.day}</div>
                <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--cream)",fontWeight:400}}>{d.title}</h2>
              </div>
              <button onClick={()=>openC(c.id)} style={{background:c.color,border:"none",borderRadius:12,padding:"10px 16px",color:"#fff",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>{c.emoji} {c.name} \u2192</button>
            </div>
            <div style={{background:"var(--bg2)",borderRadius:16,padding:"16px 20px",marginBottom:16,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:11,fontWeight:600,color:"var(--cream3)",marginBottom:6}}>\U0001F3E8 HOTEL</div>
              <div style={{fontSize:15,color:"var(--cream)"}}>{d.hotel}{d.hotelUrl&&<a href={d.hotelUrl} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none",fontSize:12}}> Maps\u2197</a>}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:"var(--bg2)",borderRadius:14,padding:"16px 18px",border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:8}}>\u2600 OCHTEND</div>
                {d.morning.map((a,i)=><div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"3px 0",lineHeight:1.6}}>\u00B7 {a}</div>)}
              </div>
              <div style={{background:"var(--bg2)",borderRadius:14,padding:"16px 18px",border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:8}}>\U0001F324 MIDDAG</div>
                {d.afternoon.map((a,i)=><div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"3px 0",lineHeight:1.6}}>\u00B7 {a}</div>)}
              </div>
            </div>
            <div style={{fontSize:14,color:"var(--cream3)",fontStyle:"italic",padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.04)"}}>\U0001F319 {d.evening}</div>
          </div>
        )})()}

        {view==="main"&&!selDay&&(
          <div style={{textAlign:"center",padding:"80px 20px",animation:"fadeUp .5s ease"}}>
            <div style={{fontSize:48,marginBottom:16}}>\U0001F1EE\U0001F1F9</div>
            <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--cream)",fontWeight:400,marginBottom:8}}>Welkom!</h2>
            <p style={{fontSize:14,color:"var(--cream2)",lineHeight:1.7,maxWidth:360,margin:"0 auto"}}>Selecteer een dag in de sidebar om je planning te zien, of klik op een stad voor de complete gids.</p>
          </div>
        )}

        {/* CITY DETAIL */}
        {view==="city"&&city&&(<div style={{animation:"fadeUp .3s ease"}}>
          <button onClick={back} style={{background:"none",border:"none",color:"var(--terra-l)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:12}}>\u2190 Terug</button>
          <div style={{background:`linear-gradient(135deg,${city.color},${city.color}cc)`,borderRadius:20,padding:"32px 24px",textAlign:"center",marginBottom:20}}>
            <span style={{fontSize:48,display:"block",marginBottom:8}}>{city.emoji}</span>
            <h2 style={{fontFamily:"var(--serif)",fontSize:36,color:"#fff",fontWeight:400}}>{city.name}</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>{city.region}</p>
          </div>
          <p style={{fontSize:15,lineHeight:1.8,color:"var(--cream2)",marginBottom:20,fontFamily:"var(--serif)",fontStyle:"italic"}}>{city.intro}</p>
          <div style={{borderRadius:16,overflow:"hidden",marginBottom:24,border:"1px solid rgba(255,255,255,0.08)"}}>
            <iframe style={{width:"100%",height:240,border:"none",display:"block"}} loading="lazy" src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen />
          </div>
          <div style={{background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.15)",borderRadius:16,padding:"16px 20px",marginBottom:24}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:10}}>\U0001F3AF ALS EERSTE DOEN</div>
            {city.firstSteps.map((s,i)=><div key={i} style={{fontSize:14,color:"var(--cream)",padding:"5px 0",display:"flex",gap:10}}><span style={{color:"var(--terra-l)",fontWeight:700,flexShrink:0}}>{i+1}.</span>{s}</div>)}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {([["do","\U0001F3DB Doen"],["eat","\U0001F35D Eten"],["viral","\U0001F4F1 TikTok"],["move","\U0001F683 Vervoer"]] as [typeof ctab,string][]).map(([t,l])=>(
              <button key={t} onClick={()=>setCtab(t)} style={{flex:1,padding:"10px 8px",borderRadius:10,border:ctab===t?"2px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:ctab===t?"rgba(196,112,75,0.12)":"var(--bg2)",color:ctab===t?"var(--terra-l)":"var(--cream2)",fontSize:12,cursor:"pointer",fontFamily:"var(--sans)"}}>{l}</button>
            ))}
          </div>
          {ctab==="do"&&city.spots.map((p,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"16px 20px",marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.06}s both`}}><div style={{fontSize:15,fontWeight:600,color:"var(--cream)",marginBottom:4}}>{p.name}</div><div style={{fontSize:13,color:"var(--cream2)",lineHeight:1.6}}>{p.desc}</div>{p.tip&&<div style={{fontSize:12,color:"var(--terra-l)",marginTop:8}}>\U0001F4A1 {p.tip}</div>}</div>))}
          {ctab==="eat"&&city.restaurants.map((r,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"16px 20px",marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.06}s both`}}><div style={{fontSize:15,fontWeight:600,color:"var(--cream)",marginBottom:4}}>{r.name} <span style={{color:"var(--terra-l)",fontSize:13}}>{r.price}</span></div><div style={{fontSize:13,color:"var(--cream2)"}}>{r.type}</div>{r.tip&&<div style={{fontSize:12,color:"var(--terra-l)",marginTop:8}}>\U0001F4A1 {r.tip}</div>}</div>))}
          {ctab==="viral"&&city.viral.map((v,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:14,padding:"16px 20px",marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",animation:`slideIn .3s ease ${i*.06}s both`}}><div style={{fontSize:15,fontWeight:600,color:"var(--cream)",marginBottom:4}}>\U0001F4F1 {v.name}</div><div style={{fontSize:13,color:"var(--cream2)",lineHeight:1.6}}>{v.desc}</div><div style={{fontSize:11,color:"var(--terra-l)",marginTop:8}}>{v.tag}</div></div>))}
          {ctab==="move"&&city.transport.map((t,i)=>(<div key={i} style={{fontSize:14,color:"var(--cream2)",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.6,animation:`slideIn .3s ease ${i*.06}s both`}}>\U0001F683 {t}</div>))}
        </div>)}

        {/* MUST-SEE */}
        {view==="ms"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--cream)"}}>\u2B50 Must-See</h2>
            <button onClick={()=>setShowAdd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,cursor:"pointer",fontWeight:600}}>+ Nieuw</button>
          </div>
          {showAdd&&(<div style={{background:"var(--bg2)",borderRadius:16,padding:18,marginBottom:18,border:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10}}>
            <input placeholder="Titel *" value={form.t} onChange={e=>setForm({...form,t:e.target.value})} style={inp} />
            <input placeholder="Beschrijving" value={form.d} onChange={e=>setForm({...form,d:e.target.value})} style={inp} />
            <input placeholder="Link (optioneel)" value={form.l} onChange={e=>setForm({...form,l:e.target.value})} style={inp} />
            <input placeholder="Afbeelding URL (optioneel)" value={form.i} onChange={e=>setForm({...form,i:e.target.value})} style={inp} />
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{if(!form.t)return;setMs(p=>[...p,{id:uid(),title:form.t,desc:form.d,link:form.l||undefined,img:form.i||undefined,done:false}]);setForm({t:"",d:"",l:"",i:""});setShowAdd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 24px",fontSize:13,cursor:"pointer"}}>Opslaan</button>
              <button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:"var(--cream2)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 18px",fontSize:13,cursor:"pointer"}}>Annuleer</button>
            </div>
          </div>)}
          {ms.map(m=>(<div key={m.id} style={{background:"var(--bg2)",borderRadius:14,padding:16,marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:14,alignItems:"flex-start",opacity:m.done?.45:1,transition:"opacity .2s"}}>
            {m.img&&<div style={{width:64,height:64,borderRadius:12,backgroundImage:`url(${m.img})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}} />}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:600,color:"var(--cream)",display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>setMs(p=>p.map(x=>x.id===m.id?{...x,done:!x.done}:x))} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:0}}>{m.done?"\u2705":"\u2B1C"}</button>
                {m.link?<a href={m.link} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none"}}>{m.title} \u2197</a>:<span>{m.title}</span>}
              </div>
              {m.desc&&<div style={{fontSize:13,color:"var(--cream2)",marginTop:4,lineHeight:1.5}}>{m.desc}</div>}
            </div>
            <button onClick={()=>setMs(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:16,cursor:"pointer",padding:4}}>\u2715</button>
          </div>))}
        </div>)}

        {/* TODO */}
        {view==="td"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--cream)"}}>\u2705 To-Do</h2>
            <button onClick={()=>setAddTd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,cursor:"pointer",fontWeight:600}}>+ Nieuw</button>
          </div>
          {addTd&&(<div style={{background:"var(--bg2)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
            <input placeholder="Wat moet er gebeuren?" value={tdTxt} onChange={e=>setTdTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&tdTxt){setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}}} style={{...inp,flex:1}} />
            <button onClick={()=>{if(!tdTxt)return;setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontSize:13,cursor:"pointer",flexShrink:0}}>+</button>
          </div>)}
          {todos.map(t=>(<div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"var(--bg2)",borderRadius:12,marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",opacity:t.done?.45:1}}>
            <button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:0}}>{t.done?"\u2705":"\u2B1C"}</button>
            <span style={{fontSize:14,color:"var(--cream)",flex:1,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:16,cursor:"pointer",padding:4}}>\u2715</button>
          </div>))}
          {todos.length===0&&!addTd&&<p style={{fontSize:14,color:"var(--cream3)",textAlign:"center",padding:40,fontStyle:"italic"}}>Nog geen items.</p>}
        </div>)}

        {/* Emergency modal */}
        {showE&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99}} onClick={()=>setShowE(false)}>
          <div style={{background:"var(--bg2)",borderRadius:20,padding:24,maxWidth:360,width:"90%",border:"1px solid rgba(255,255,255,0.08)"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:22,color:"var(--cream)",marginBottom:16}}>\U0001F6A8 Noodnummers</h3>
            {Object.entries(EM).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><span style={{fontSize:13,color:"var(--cream2)"}}>{k}</span><a href={`tel:${v.replace(/\s/g,"")}`} style={{fontSize:14,color:"var(--terra-l)",textDecoration:"none",fontWeight:600}}>{v}</a></div>)}
            <button onClick={()=>setShowE(false)} style={{marginTop:16,width:"100%",padding:"10px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,fontSize:13,cursor:"pointer"}}>Sluiten</button>
          </div>
        </div>}

      </main>
    </div>
  );
}

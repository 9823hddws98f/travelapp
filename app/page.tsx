"use client";
import { useState, useEffect } from "react";

interface Spot{name:string;desc:string;tip?:string}
interface Resto{name:string;type:string;price:string;tip?:string}
interface Viral{name:string;desc:string;tag:string}
interface City{id:string;name:string;region:string;color:string;lat:number;lng:number;zoom:number;intro:string;firstSteps:string[];spots:Spot[];restaurants:Resto[];viral:Viral[];transport:string[]}
interface Day{day:number;title:string;cityId:string;hotel:string;hotelUrl?:string;morning:string[];afternoon:string[];evening:string}
interface MustSee{id:string;title:string;desc:string;link?:string;img?:string;done:boolean}
interface Todo{id:string;text:string;done:boolean}

const C:City[]=[
{id:"ven",name:"Venetie",region:"Veneto",color:"#1e3a5f",lat:45.4408,lng:12.3155,zoom:14,intro:"Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.",firstSteps:["Koop vaporetto dagpas bij station","Download Venezia Unica app","Water bij supermarkt niet op plein","Loop Rialto naar San Marco als eerste"],spots:[{name:"San Marco",desc:"Plein, basiliek, Dogenpaleis",tip:"Voor 9u gaan"},{name:"Rialto en Markt",desc:"Iconische brug + vismarkt",tip:"Markt 7:30-12:00"},{name:"Burano",desc:"Kleurrijkste eiland van lagune",tip:"Vaporetto 12, 45 min"},{name:"Dorsoduro",desc:"Rustigste wijk",tip:"Ponte Accademia bij sunset"}],restaurants:[{name:"Osteria Al Squero",type:"Cicchetti",price:"E",tip:"Spritz aan het water"},{name:"Da Romano",type:"Buranees",price:"EE",tip:"Risotto op Burano"},{name:"Cantina Do Spade",type:"Venetiaans",price:"EE",tip:"Sinds 1488"}],viral:[{name:"Libreria Acqua Alta",desc:"Boekwinkel met gondels",tag:"#venezia"},{name:"Burano streets",desc:"Meest Instagrammable",tag:"#burano"}],transport:["Vaporetto dagpas kopen","Alilaguna boot vanaf vliegveld","Alles te voet + vaporetto"]},
{id:"gar",name:"Gardameer",region:"Lombardije",color:"#1a4433",lat:45.65,lng:10.67,zoom:11,intro:"Grootste meer van Italie. Citroentuinen, bergen, Hotel Berta.",firstSteps:["Check in Hotel Berta","Huur boot of fiets bij haven","Download Navigarda app"],spots:[{name:"Sirmione",desc:"Kasteel + thermale bronnen",tip:"Grotte di Catullo"},{name:"Limone sul Garda",desc:"Citroentuinen + pittoresk",tip:"Limonaia del Castel"},{name:"Riva del Garda",desc:"Bergen + meer",tip:"Cascata del Varone"}],restaurants:[{name:"Al Pescatore",type:"Vis",price:"EE",tip:"Terras aan het water"},{name:"Osteria Il Gallo",type:"Lokaal",price:"E",tip:"Authentiek"}],viral:[{name:"Sirmione kasteel",desc:"Toren uit het water",tag:"#lakegarda"},{name:"Limone citroenen",desc:"Geel tegen blauw",tag:"#limone"}],transport:["Veerboten: navigazionelaghi.it","Auto voor westoever","Trein: Desenzano station"]},
{id:"ver",name:"Verona",region:"Veneto",color:"#3a1e45",lat:45.4384,lng:10.9916,zoom:14,intro:"Shakespeare stad. Arena, Amarone, liefde overal.",firstSteps:["Station naar Piazza Bra 10 min","Koop Verona Card 24/48u","Arena buiten = gratis","Boek wijnproeverij Valpolicella"],spots:[{name:"Arena di Verona",desc:"Romeins amfitheater",tip:"arena.it voor opera"},{name:"Piazza delle Erbe",desc:"Markt + aperitivo",tip:"Torre dei Lamberti"},{name:"Castel San Pietro",desc:"Panorama over stad",tip:"15 min klimmen"},{name:"Ponte Pietra",desc:"Romeinse brug",tip:"Golden hour"},{name:"Valpolicella",desc:"Amarone wijnstreek",tip:"20 min rijden"}],restaurants:[{name:"Osteria al Duca",type:"Veronees",price:"EE",tip:"Pastissada de caval"},{name:"Du de Cope",type:"Pizza",price:"E",tip:"Beste pizza Verona"},{name:"Monte Baldo",type:"Osteria",price:"EE",tip:"Reserveer risotto"}],viral:[{name:"Juliet Balkon",desc:"Briefjes op muur",tag:"#juliet"},{name:"Arena bij nacht",desc:"Verlicht = magisch",tag:"#arena"},{name:"Spritz Piazza Erbe",desc:"Aperitivo",tag:"#aperolspritz"}],transport:["Porta Nuova: Venetie/Milaan","Centrum = te voet","Bus naar Valpolicella"]},
{id:"tos",name:"Toscane",region:"Toscane",color:"#2a3518",lat:43.7696,lng:11.2558,zoom:10,intro:"Renaissance, cipressen, wijn. Firenze + droomdorpen.",firstSteps:["Boek Uffizi WEKEN vooruit","Download Trenitalia app","Huur auto 1 dag Val d Orcia","ZTL = niet centrum inrijden!"],spots:[{name:"Uffizi",desc:"Botticelli, Da Vinci",tip:"Boek vooruit"},{name:"Ponte Vecchio",desc:"Gouden juweliersbrug",tip:"Sunset = goud"},{name:"San Gimignano",desc:"Torens + gelato",tip:"Dondero = kampioen"},{name:"Val d Orcia",desc:"Cipressen-foto",tip:"Auto huren"},{name:"Siena",desc:"Piazza del Campo",tip:"Compacter dan Firenze"},{name:"Piazzale Michelangelo",desc:"Uitzicht Firenze",tip:"Zonsondergang"}],restaurants:[{name:"Trattoria Mario",type:"Florentijns",price:"E",tip:"Bistecca"},{name:"All Antico Vinaio",type:"Panini",price:"E",tip:"Beroemdste broodjes"},{name:"Osteria dell Enoteca",type:"Toscaans",price:"EE",tip:"Wild zwijn ragu"}],viral:[{name:"Vinaio rij",desc:"Film je schiacciata",tag:"#foodtiktok"},{name:"Val d Orcia weg",desc:"Cipressenlaan",tag:"#tuscany"},{name:"Ponte Vecchio",desc:"Verplichte selfie",tag:"#florence"}],transport:["Firenze SMN = hub","Bus San Gimignano via Poggibonsi","Auto voor Val d Orcia","ZTL boete = 150+!"]},
{id:"nap",name:"Napels",region:"Campanie",color:"#3d1f1a",lat:40.8518,lng:14.2681,zoom:13,intro:"Rauw, luid, echt. Pizza, Pompei, Vesuvius.",firstSteps:["Metro naar Toledo station","Loop Spaccanapoli west naar oost","Boek Pompei online","Cash meenemen"],spots:[{name:"Spaccanapoli",desc:"Hartader centrum",tip:"Ochtend = best"},{name:"Pompei",desc:"Bevroren stad",tip:"Online tickets vroeg"},{name:"Cappella Sansevero",desc:"Christus-sculptuur",tip:"Reserveer"},{name:"Vesuvius",desc:"Beklim de vulkaan",tip:"Combi-ticket"},{name:"Sotterranea",desc:"Ondergrondse tunnels",tip:"Elk half uur"}],restaurants:[{name:"Da Michele",type:"Pizza",price:"E",tip:"Margherita of marinara"},{name:"Da Nennella",type:"Napolitaans",price:"E",tip:"Cash only chaos"},{name:"Sorbillo",type:"Pizza",price:"E",tip:"Frittatina!"}],viral:[{name:"Da Michele",desc:"Film de pizza fold",tag:"#damichele"},{name:"Toledo metro",desc:"Mooiste station",tag:"#naplesmetro"},{name:"Street food",desc:"Frittatina",tag:"#streetfood"}],transport:["Metro Lijn 1 Toledo!","Circumvesuviana Pompei E4","Alibus luchthaven E5"]},
{id:"ama",name:"Amalfikust",region:"Campanie",color:"#1a3040",lat:40.6333,lng:14.6029,zoom:12,intro:"Pastelkliffen, azuurblauwe zee, citroenen overal.",firstSteps:["SITA-bus kaartjes bij tabacchi","Veerboot = sneller + mooier","GOEDE schoenen trappen!","Sentiero degli Dei: start vroeg"],spots:[{name:"Positano",desc:"Kleurendorp aan klif",tip:"Comfy schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden 7km",tip:"Vroeg + 2L water"},{name:"Ravello",desc:"Tuinen + uitzicht",tip:"Rustiger"},{name:"Amalfi Duomo",desc:"Kathedraal + trap",tip:"Gratis entree"}],restaurants:[{name:"Da Vincenzo",type:"Vis",price:"EEE",tip:"Positano terras"},{name:"Le Arcate",type:"Pizza",price:"E",tip:"Atrani aan zee"},{name:"Il Ritrovo",type:"Seizoen",price:"EE",tip:"Kookles!"}],viral:[{name:"Positano trappen",desc:"Pastel op azuur",tag:"#positano"},{name:"Limoncello",desc:"Citroenen",tag:"#limoncello"},{name:"Path of Gods",desc:"Boven wolken",tag:"#hiking"}],transport:["SITA-bus langs kust","Veerboot Positano/Salerno","Geen auto!","Trein Napels naar Salerno"]},
];

const DAYS:Day[]=[
{day:1,title:"Aankomst Venetie",cityId:"ven",hotel:"Hotel nabij San Marco",morning:["Vlucht naar Marco Polo","Boot naar centrum"],afternoon:["Inchecken","Wandeling Rialto naar San Marco"],evening:"Cicchetti en spritz"},
{day:2,title:"Venetie naar Gardameer",cityId:"gar",hotel:"Hotel Berta Gardameer",hotelUrl:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda",morning:["Burano bezoeken","Kleurenhuizen"],afternoon:["Checkout Venetie","Reis naar Gardameer"],evening:"Aankomst Hotel Berta diner aan meer"},
{day:3,title:"Gardameer naar Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Sirmione kasteel","Of Limone sul Garda"],afternoon:["Lunch aan meer","Naar Verona 45 min"],evening:"Piazza Bra + Arena"},
{day:4,title:"Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Arena di Verona","Piazza delle Erbe + toren"],afternoon:["Ponte Pietra + panorama","Juliet Balkon"],evening:"Amarone proeverij + diner"},
{day:5,title:"Verona naar Toscane",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Checkout Verona","Frecciarossa naar Firenze"],afternoon:["Inchecken agriturismo","Omgeving verkennen"],evening:"Wijn en kaas agriturismo"},
{day:6,title:"Firenze",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Uffizi Gallery","Ponte Vecchio"],afternoon:["Duomo beklimmen","All Antico Vinaio"],evening:"Piazzale Michelangelo sunset"},
{day:7,title:"San Gimignano en Siena",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Auto naar San Gimignano","Torens + gelato"],afternoon:["Siena Piazza del Campo","Duomo bezoeken"],evening:"Laatste avond Toscane"},
{day:8,title:"Toscane naar Napels",cityId:"nap",hotel:"Hotel Napels centrum",morning:["Checkout","Frecciarossa naar Napels 3u"],afternoon:["Spaccanapoli wandeling","Metro Toledo"],evening:"Pizza Da Michele"},
{day:9,title:"Pompei en Amalfikust",cityId:"ama",hotel:"B&B Amalfikust",morning:["Circumvesuviana Pompei","Rondleiding ruines"],afternoon:["Door naar Positano","Strand of dorpje"],evening:"Zeevruchten met uitzicht"},
{day:10,title:"Amalfikust en terug",cityId:"ama",hotel:"Geen",morning:["Ravello of Sentiero degli Dei","Limoncello proeven"],afternoon:["Terug naar Napels","Luchthaven"],evening:"Arrivederci Italia"},
];

const INIT_MS:MustSee[]=[
{id:"1",title:"Sunset Ponte Vecchio",desc:"Gouden uur over de Arno",done:false},
{id:"2",title:"Pompei ochtendlicht",desc:"Magisch zonder drukte",done:false},
{id:"3",title:"Burano kleuren",desc:"Fotogeniekste plek",done:false},
{id:"4",title:"Sentiero degli Dei",desc:"Wandelen boven wolken",done:false},
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
  const[selDay,setSelDay]=useState<number|null>(null);
  const[cityId,setCityId]=useState<string|null>(null);
  const[view,setView]=useState<"plan"|"city"|"ms"|"td">("plan");
  const[ms,setMs]=useLS<MustSee[]>("it-ms",INIT_MS);
  const[todos,setTodos]=useLS<Todo[]>("it-td",[]);
  const[showAdd,setShowAdd]=useState(false);
  const[addTd,setAddTd]=useState(false);
  const[form,setForm]=useState({t:"",d:"",l:"",i:""});
  const[tdTxt,setTdTxt]=useState("");
  const[showE,setShowE]=useState(false);
  const[ctab,setCtab]=useState<"do"|"eat"|"viral"|"move">("do");
  const[showCities,setShowCities]=useState(false);
  const city=cityId?C.find(c=>c.id===cityId):null;
  const openC=(id:string)=>{setCityId(id);setView("city");setCtab("do");setShowCities(false)};
  const inp:React.CSSProperties={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 12px",color:"var(--cream)",fontSize:14,fontFamily:"var(--sans)",outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div className="layout">
      <aside className="sidebar">
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"inline-block",background:"var(--terra)",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:3,padding:"2px 12px",borderRadius:16,marginBottom:8,textTransform:"uppercase"}}>2026</div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:32,fontWeight:400,lineHeight:1.1}}>Italia</h1>
          <p style={{fontSize:11,color:"var(--cream3)",marginTop:4}}>Tein & Tessa</p>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--cream3)",letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>10 Dagen</div>
          {DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId)!;const sel=selDay===d.day&&view==="plan";return(
            <button key={d.day} onClick={()=>{setSelDay(sel?null:d.day);setView("plan");setCityId(null)}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,border:"none",background:sel?"rgba(196,112,75,0.15)":"transparent",color:"var(--cream)",cursor:"pointer",textAlign:"left",fontFamily:"var(--sans)",marginBottom:2,transition:"all .15s"}}>
              <span style={{width:24,height:24,borderRadius:7,background:sel?"var(--terra)":"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:sel?"#fff":"var(--cream2)",flexShrink:0}}>{d.day}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:sel?600:400,color:sel?"var(--cream)":"var(--cream2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.title}</div>
              </div>
              <span style={{fontSize:10,color:"var(--cream3)"}}>{c.name.slice(0,3)}</span>
            </button>
          )})}
        </div>

        <div style={{marginBottom:16}}>
          <button onClick={()=>setShowCities(!showCities)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",background:"var(--bg3)",color:"var(--cream)",cursor:"pointer",fontSize:12,fontFamily:"var(--sans)"}}>
            <span style={{fontWeight:600}}>Steden</span><span style={{color:"var(--cream3)"}}>{showCities?"\u25B2":"\u25BC"}</span>
          </button>
          {showCities&&C.map(c=>(
            <button key={c.id} onClick={()=>openC(c.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:"none",background:cityId===c.id?"rgba(196,112,75,0.1)":"transparent",color:"var(--cream)",cursor:"pointer",textAlign:"left",fontFamily:"var(--sans)",borderRadius:8,marginTop:2}}>
              <span style={{width:8,height:8,borderRadius:4,background:c.color,flexShrink:0}}/>
              <span style={{fontSize:12}}>{c.name}</span>
              <span style={{fontSize:10,color:"var(--cream3)",marginLeft:"auto"}}>{c.region}</span>
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:12}}>
          <button onClick={()=>{setView("ms");setCityId(null)}} style={{flex:1,padding:"10px 8px",borderRadius:10,border:view==="ms"?"1px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:view==="ms"?"rgba(196,112,75,0.1)":"var(--bg3)",color:"var(--cream)",cursor:"pointer",fontSize:11,fontFamily:"var(--sans)"}}>Must-See<br/><span style={{fontSize:10,color:"var(--cream3)"}}>{ms.filter(m=>!m.done).length}</span></button>
          <button onClick={()=>{setView("td");setCityId(null)}} style={{flex:1,padding:"10px 8px",borderRadius:10,border:view==="td"?"1px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:view==="td"?"rgba(196,112,75,0.1)":"var(--bg3)",color:"var(--cream)",cursor:"pointer",fontSize:11,fontFamily:"var(--sans)"}}>To-Do<br/><span style={{fontSize:10,color:"var(--cream3)"}}>{todos.filter(t=>!t.done).length}</span></button>
        </div>

        <button onClick={()=>setShowE(!showE)} style={{width:"100%",background:"rgba(196,112,75,0.06)",border:"1px solid rgba(196,112,75,0.15)",borderRadius:8,padding:"6px 10px",color:"var(--terra-l)",fontSize:11,cursor:"pointer",textAlign:"left"}}>{"Noodnummers "+(showE?"\u25B2":"\u25BC")}</button>
        {showE&&<div style={{padding:"8px 0"}}>{Object.entries(EMERG).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 10px"}}><span style={{fontSize:10,color:"var(--cream2)"}}>{k}</span><a href={"tel:"+v.replace(/\s/g,"")} style={{fontSize:11,color:"var(--terra-l)",textDecoration:"none"}}>{v}</a></div>)}</div>}
      </aside>

      <main className="main">
        {view==="plan"&&!selDay&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:28,marginBottom:4}}>Reisplanning</h2>
            <p style={{fontSize:13,color:"var(--cream2)",marginBottom:24}}>Selecteer een dag om details te zien.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
              {DAYS.map(d=>{const c=C.find(x=>x.id===d.cityId)!;return(
                <button key={d.day} onClick={()=>setSelDay(d.day)} style={{background:"var(--bg2)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:16,cursor:"pointer",color:"var(--cream)",textAlign:"left",fontFamily:"var(--sans)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{background:"var(--terra)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6}}>DAG {d.day}</span>
                    <span style={{width:10,height:10,borderRadius:5,background:c.color}}/>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{d.title}</div>
                  <div style={{fontSize:11,color:"var(--cream3)"}}>{c.name}</div>
                </button>
              )})}
            </div>
          </div>
        )}

        {view==="plan"&&selDay&&(()=>{const d=DAYS.find(x=>x.day===selDay)!;const c=C.find(x=>x.id===d.cityId)!;return(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--terra-l)",letterSpacing:2,marginBottom:4}}>DAG {d.day} VAN 10</div>
                <h2 style={{fontFamily:"var(--serif)",fontSize:28}}>{d.title}</h2>
              </div>
              <button onClick={()=>openC(c.id)} style={{background:c.color,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"var(--sans)"}}>{c.name} bekijken</button>
            </div>
            <div style={{background:"var(--bg2)",borderRadius:14,padding:"14px 18px",marginBottom:16,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--cream3)",letterSpacing:1,marginBottom:6}}>HOTEL</div>
              <div style={{fontSize:15,color:"var(--cream)"}}>{d.hotel}{d.hotelUrl&&<a href={d.hotelUrl} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none",fontSize:12,marginLeft:8}}>Maps</a>}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:"var(--bg2)",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:8}}>OCHTEND</div>
                {d.morning.map((a,i)=><div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"3px 0",lineHeight:1.5}}>{"\u00B7 "+a}</div>)}
              </div>
              <div style={{background:"var(--bg2)",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:8}}>MIDDAG</div>
                {d.afternoon.map((a,i)=><div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"3px 0",lineHeight:1.5}}>{"\u00B7 "+a}</div>)}
              </div>
            </div>
            <div style={{background:"var(--bg2)",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--cream3)",letterSpacing:1,marginBottom:6}}>AVOND</div>
              <div style={{fontSize:14,color:"var(--cream)",fontStyle:"italic"}}>{d.evening}</div>
            </div>
          </div>
        )})()}

        {view==="city"&&city&&(<div style={{animation:"fadeUp .3s ease"}}>
          <button onClick={()=>{setView("plan");setCityId(null)}} style={{background:"none",border:"none",color:"var(--terra-l)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:12}}>Terug naar planning</button>
          <div style={{background:`linear-gradient(135deg,${city.color},${city.color}cc)`,borderRadius:18,padding:"32px 24px",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:34,color:"#fff",fontWeight:400}}>{city.name}</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>{city.region}</p>
          </div>
          <p style={{fontSize:15,lineHeight:1.7,color:"var(--cream2)",marginBottom:20,fontFamily:"var(--serif)",fontStyle:"italic"}}>{city.intro}</p>
          <div style={{borderRadius:14,overflow:"hidden",marginBottom:24,border:"1px solid rgba(255,255,255,0.08)"}}>
            <iframe style={{width:"100%",height:220,border:"none",display:"block"}} loading="lazy" src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen />
          </div>
          <div style={{background:"rgba(196,112,75,0.08)",border:"1px solid rgba(196,112,75,0.15)",borderRadius:14,padding:"16px 18px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--terra-l)",letterSpacing:1,marginBottom:10}}>ALS EERSTE DOEN</div>
            {city.firstSteps.map((s,i)=><div key={i} style={{fontSize:13,color:"var(--cream)",padding:"4px 0",display:"flex",gap:8}}><span style={{color:"var(--terra-l)",fontWeight:700,flexShrink:0}}>{i+1}.</span>{s}</div>)}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {(["do","eat","viral","move"] as const).map(t=>(
              <button key={t} onClick={()=>setCtab(t)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:ctab===t?"2px solid var(--terra)":"1px solid rgba(255,255,255,0.06)",background:ctab===t?"rgba(196,112,75,0.12)":"var(--bg2)",color:ctab===t?"var(--terra-l)":"var(--cream2)",fontSize:11,cursor:"pointer",fontFamily:"var(--sans)"}}>{t==="do"?"Bezienswaardigheden":t==="eat"?"Restaurants":t==="viral"?"TikTok Viral":"Vervoer"}</button>
            ))}
          </div>
          {ctab==="do"&&city.spots.map((p,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>{p.name}</div><div style={{fontSize:12,color:"var(--cream2)",lineHeight:1.5}}>{p.desc}</div>{p.tip&&<div style={{fontSize:11,color:"var(--terra-l)",marginTop:6}}>{p.tip}</div>}</div>))}
          {ctab==="eat"&&city.restaurants.map((r,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>{r.name} <span style={{color:"var(--terra-l)",fontSize:12}}>{r.price}</span></div><div style={{fontSize:12,color:"var(--cream2)"}}>{r.type}</div>{r.tip&&<div style={{fontSize:11,color:"var(--terra-l)",marginTop:6}}>{r.tip}</div>}</div>))}
          {ctab==="viral"&&city.viral.map((v,i)=>(<div key={i} style={{background:"var(--bg2)",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"}}><div style={{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:3}}>{v.name}</div><div style={{fontSize:12,color:"var(--cream2)",lineHeight:1.5}}>{v.desc}</div><div style={{fontSize:10,color:"var(--terra-l)",marginTop:6}}>{v.tag}</div></div>))}
          {ctab==="move"&&city.transport.map((t,i)=>(<div key={i} style={{fontSize:13,color:"var(--cream2)",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5}}>{t}</div>))}
        </div>)}

        {view==="ms"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:28}}>Must-See</h2>
            <button onClick={()=>setShowAdd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Toevoegen</button>
          </div>
          {showAdd&&(<div style={{background:"var(--bg2)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10}}>
            <input placeholder="Titel *" value={form.t} onChange={e=>setForm({...form,t:e.target.value})} style={inp}/>
            <input placeholder="Beschrijving" value={form.d} onChange={e=>setForm({...form,d:e.target.value})} style={inp}/>
            <input placeholder="Link (optioneel)" value={form.l} onChange={e=>setForm({...form,l:e.target.value})} style={inp}/>
            <input placeholder="Afbeelding URL (optioneel)" value={form.i} onChange={e=>setForm({...form,i:e.target.value})} style={inp}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{if(!form.t)return;setMs(p=>[...p,{id:uid(),title:form.t,desc:form.d,link:form.l||undefined,img:form.i||undefined,done:false}]);setForm({t:"",d:"",l:"",i:""});setShowAdd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>Opslaan</button>
              <button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:"var(--cream2)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer"}}>Annuleer</button>
            </div>
          </div>)}
          {ms.map(m=>(<div key={m.id} style={{background:"var(--bg2)",borderRadius:14,padding:14,marginBottom:8,border:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:12,alignItems:"flex-start",opacity:m.done?.45:1}}>
            {m.img&&<div style={{width:56,height:56,borderRadius:10,backgroundImage:`url(${m.img})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--cream)",display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>setMs(p=>p.map(x=>x.id===m.id?{...x,done:!x.done}:x))} style={{background:"none",border:"1px solid var(--cream3)",width:18,height:18,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--terra-l)",flexShrink:0}}>{m.done?"\u2713":""}</button>
                {m.link?<a href={m.link} target="_blank" rel="noreferrer" style={{color:"var(--terra-l)",textDecoration:"none"}}>{m.title}</a>:<span>{m.title}</span>}
              </div>
              {m.desc&&<div style={{fontSize:12,color:"var(--cream2)",marginTop:4,lineHeight:1.4}}>{m.desc}</div>}
            </div>
            <button onClick={()=>setMs(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:14,cursor:"pointer",padding:4}}>x</button>
          </div>))}
        </div>)}

        {view==="td"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:28}}>To-Do</h2>
            <button onClick={()=>setAddTd(true)} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Toevoegen</button>
          </div>
          {addTd&&(<div style={{background:"var(--bg2)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
            <input placeholder="Wat moet er gebeuren?" value={tdTxt} onChange={e=>setTdTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&tdTxt){setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}}} style={{...inp,flex:1}}/>
            <button onClick={()=>{if(!tdTxt)return;setTodos(p=>[...p,{id:uid(),text:tdTxt,done:false}]);setTdTxt("");setAddTd(false)}} style={{background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer",flexShrink:0}}>+</button>
          </div>)}
          {todos.map(t=>(<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg2)",borderRadius:12,marginBottom:6,border:"1px solid rgba(255,255,255,0.04)",opacity:t.done?.45:1}}>
            <button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{background:"none",border:"1px solid var(--cream3)",width:18,height:18,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--terra-l)",flexShrink:0}}>{t.done?"\u2713":""}</button>
            <span style={{fontSize:14,color:"var(--cream)",flex:1,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:14,cursor:"pointer",padding:4}}>x</button>
          </div>))}
          {todos.length===0&&!addTd&&<p style={{fontSize:13,color:"var(--cream3)",textAlign:"center",padding:40,fontStyle:"italic"}}>Nog geen items.</p>}
        </div>)}

        <footer style={{textAlign:"center",padding:"32px 0 16px",fontSize:12,color:"var(--cream3)",fontFamily:"var(--serif)",fontStyle:"italic"}}>Buon viaggio, Tein & Tessa</footer>
      </main>
    </div>
  );
}
/* v4 */


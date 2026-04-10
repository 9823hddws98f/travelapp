"use client";
import { useState, useEffect } from "react";

/* ═══ TYPES ═══ */
interface Spot { name:string; desc:string; tip?:string; priority?:number; tiktok?:boolean; }
interface Resto { name:string; vibe:string; price:string; tip?:string; tiktok?:boolean; }
interface CityData { id:string; city:string; region:string; emoji:string; lat:number; lng:number; zoom:number; intro:string; hero:string; color:string; firstSteps:string[]; spots:Spot[]; restaurants:Resto[]; tiktok:string[]; transport:string[]; }
interface DayPlan { day:number; title:string; cityId:string; hotel:string; hotelLink?:string; morning:string[]; afternoon:string[]; evening:string; }
interface CustomItem { id:string; title:string; desc:string; link?:string; img?:string; done:boolean; }

/* ═══ DATA ═══ */
const EMERGENCY:Record<string,string>={Algemeen:"112",Politie:"113",Ambulance:"118",Wegenwacht:"+39 803 116","NL Ambassade":"+39 06 3228 6001"};
const CITIES: CityData[] = [
  { id:"venezia", city:"Venezia", region:"Veneto", emoji:"🚣", lat:45.4408,lng:12.3155,zoom:14,
    hero:"linear-gradient(135deg,#0f1926,#1a3344)", color:"#4a8cba",
    intro:"Drijvende droomstad. Gondels, San Marco, verloren verdwalen in eeuwenoude steegjes.",
    firstSteps:["Koop een Vaporetto 24u/48u pas bij het station","Download offline Google Maps van Venetie","Boek Uffizi tickets NIET hier maar in Firenze","Draag comfortabele schoenen, alles is lopen"],
    spots:[
      {name:"Piazza San Marco",desc:"Het plein, de basiliek, het Dogenpaleis",tip:"Ga voor 9u, vermijd duiven-foto mensen",priority:1},
      {name:"Rialto Brug & Markt",desc:"Iconische brug + verse vismarkt",tip:"Markt alleen ochtends open",priority:2},
      {name:"Burano",desc:"Kleurrijk eiland, perfecte fotos",tip:"Vaporetto lijn 12, ~45 min",priority:3,tiktok:true},
      {name:"Dorsoduro & Accademia",desc:"Rustigste wijk, langs kanalen",tip:"Beste zonsondergang-spot van Venetie",priority:4},
      {name:"Libreria Acqua Alta",desc:"Boekwinkel met boeken in gondels en badkuipen",tip:"Gratis toegang, trap van boeken naar uitzicht",tiktok:true},
    ],
    restaurants:[
      {name:"Osteria Al Squero",vibe:"Cicchetti + spritz aan het water",price:"€",tip:"Lokale vibe, geen toeristen-trap"},
      {name:"Trattoria da Romano",vibe:"Burano, risotto di go",price:"€€",tip:"Op Burano, combineer met eilandbezoek"},
      {name:"Cantina Do Spade",vibe:"Sinds 1488, bij Rialto",price:"€€",tip:"Reserveer, klein maar geweldig"},
      {name:"Dal Moro's Fresh Pasta",vibe:"Verse pasta to-go in bakje",price:"€",tip:"TikTok-famous, rij is het waard",tiktok:true},
    ],
    tiktok:["Libreria Acqua Alta boekentrap","Burano kleurenstraatjes","Dal Moro's pasta to-go","Gondel door smalle kanalen bij zonsondergang"],
    transport:["Vaporetto = waterbus, koop dagpas","Marco Polo airport: Alilaguna boot of bus","Geen autos, alles te voet + boot","Gondel: ~80-100 euro/30 min"]
  },
  { id:"garda", city:"Gardameer", region:"Lombardije", emoji:"⛵", lat:45.65,lng:10.67,zoom:11,
    hero:"linear-gradient(135deg,#0f261a,#1a4433)", color:"#4aba8c",
    intro:"Het grootste meer van Italie. Citroentuinen, bergen en azuurblauw water. Hotel Berta als uitvalsbasis.",
    firstSteps:["Check in bij Hotel Berta","Huur fietsen als beschikbaar","Download Navigazione Lago di Garda app voor veerboten","Neem zonnebrand mee, reflectie van het water"],
    spots:[
      {name:"Sirmione",desc:"Schiereiland met kasteel en thermale baden",tip:"Grotte di Catullo Romeinse ruines zijn magisch",priority:1},
      {name:"Limone sul Garda",desc:"Pittoresk dorpje met citroentuinen",tip:"Limonaia del Castel is prachtig",priority:2,tiktok:true},
      {name:"Riva del Garda",desc:"Noordpunt, bergen ontmoeten het meer",tip:"Cascata del Varone waterval",priority:3},
    ],
    restaurants:[
      {name:"Al Pescatore",vibe:"Sirmione, terras aan het water",price:"€€",tip:"Verse vis uit het meer"},
      {name:"Osteria Il Gallo",vibe:"Authentiek, geen toeristen",price:"€",tip:"Lokale wijn proberen"},
    ],
    tiktok:["Limone sul Garda kleurenstraatjes","Sirmione kasteel met meer op achtergrond","Fietsen langs het meer"],
    transport:["Veerboten verbinden alle dorpen","Auto handig voor westoever","Station Desenzano dichtstbij","Fietsen langs het meer is fantastisch"]
  },
  { id:"verona", city:"Verona", region:"Veneto", emoji:"🏟️", lat:45.4384,lng:10.9916,zoom:14,
    hero:"linear-gradient(135deg,#1a0f20,#331a40)", color:"#a64dba",
    intro:"Shakespeares stad van de liefde. Romeinse arena, Amarone-wijn en romantische steegjes.",
    firstSteps:["Loop van station naar Piazza Bra (10 min)","Check of er opera is in de Arena (zomer)","Verona Card overweegen voor musea","Boek Valpolicella wijnproeverij vooraf"],
    spots:[
      {name:"Arena di Verona",desc:"Romeins amfitheater, opera in openlucht",tip:"Check arena.it voor programma",priority:1,tiktok:true},
      {name:"Piazza delle Erbe",desc:"Markt overdag, aperitivo avonds",tip:"Torre dei Lamberti voor panorama",priority:2},
      {name:"Ponte Pietra",desc:"Romeinse brug over de Adige",tip:"Loop omhoog naar Castel San Pietro voor view",priority:3,tiktok:true},
      {name:"Juliets Balkon",desc:"Kitscherig maar onvermijdelijk",tip:"Sla de rij over, plein is gratis",priority:4},
      {name:"Amarone wijnproeverij",desc:"Valpolicella op 20 min rijden",tip:"Boek via Viator of direct bij wijnhuis",priority:5},
    ],
    restaurants:[
      {name:"Osteria al Duca",vibe:"Traditioneel Veronees",price:"€€",tip:"Pastissada de caval proberen"},
      {name:"Pizzeria Du de Cope",vibe:"Beste pizza van Verona",price:"€",tip:"Locals-only sfeer"},
      {name:"Caffe Monte Baldo",vibe:"Klein, intiem, top risotto",price:"€€",tip:"Reserveer, vol voor je het weet"},
    ],
    tiktok:["Arena di Verona bij zonsondergang","Ponte Pietra walk met uitzicht","Castel San Pietro panorama"],
    transport:["Porta Nuova station, treinen overal","Centrum compact, alles te voet","Luchthaven Catullo: bus 199"]
  },
  { id:"toscane", city:"Toscane", region:"Toscane", emoji:"🍷", lat:43.7696,lng:11.2558,zoom:11,
    hero:"linear-gradient(135deg,#1a200f,#334a1a)", color:"#8cba4a",
    intro:"Glooiende heuvels, cipressen, wijn en Renaissance-meesterwerken. Hier vertraagt de tijd.",
    firstSteps:["Boek Uffizi tickets minimaal 2 weken vooraf","Huur auto voor Val d Orcia (1 dag)","ZTL-zones: NIET met auto centrum in","Download Trenitalia app"],
    spots:[
      {name:"Uffizi Gallery",desc:"Botticelli, Da Vinci, Caravaggio",tip:"Boek weken vooruit, ga in de middag",priority:1},
      {name:"Ponte Vecchio",desc:"Beroemde brug vol juweliers",tip:"Mooiste bij zonsondergang",priority:2,tiktok:true},
      {name:"Piazzale Michelangelo",desc:"Beste panorama over Firenze",tip:"Ga bij zonsondergang, neem wijn mee",priority:3,tiktok:true},
      {name:"San Gimignano",desc:"Middeleeuws Manhattan met torens",tip:"Dondero gelato = wereldkampioen",priority:4,tiktok:true},
      {name:"Siena",desc:"Piazza del Campo en Duomo",tip:"Compacter dan Firenze, fijner wandelen",priority:5},
      {name:"Val d Orcia",desc:"Iconische heuvels met cipressen",tip:"Huur auto, de mooiste drive van Italie",priority:6},
    ],
    restaurants:[
      {name:"All Antico Vinaio",vibe:"Beroemdste broodjeszaak ter wereld",price:"€",tip:"De rij is onderdeel van de experience",tiktok:true},
      {name:"Trattoria Mario",vibe:"Gedeelde tafels, geen reservering",price:"€",tip:"Bistecca alla fiorentina is legendarisch"},
      {name:"Vivoli Gelato",vibe:"Oudste gelateria van Firenze",price:"€",tip:"Pistachio en stracciatella",tiktok:true},
    ],
    tiktok:["All Antico Vinaio mega-panini","Ponte Vecchio zonsondergang","Piazzale Michelangelo panorama","San Gimignano gelato Dondero","Val d Orcia cypressenlaan"],
    transport:["Firenze SMN is de hub","Bus naar San Gimignano via Poggibonsi","Huurauto voor Val d Orcia en dorpen","ZTL = boete! Parkeer buiten centrum"]
  },
  { id:"napels", city:"Napels", region:"Campanie", emoji:"🌋", lat:40.8518,lng:14.2681,zoom:13,
    hero:"linear-gradient(135deg,#261a0f,#4a2c1a)", color:"#ba6a4a",
    intro:"Rauw, luid en ongelooflijk echt. Geboorteplaats van pizza. Poort naar Amalfikust en Pompei.",
    firstSteps:["Pas op voor zakkenrollers bij station","Download Circumvesuviana tijden (naar Pompei)","Boek Pompei tickets online vooraf","Cash meenemen, veel plekken geen pin"],
    spots:[
      {name:"Pompei",desc:"Bevroren stad onder de Vesuvius",tip:"Tickets online, ga vroeg, neem water mee",priority:1,tiktok:true},
      {name:"Spaccanapoli",desc:"Hartader van het historisch centrum",tip:"Loop west naar oost in de ochtend",priority:2},
      {name:"Cappella Sansevero",desc:"Christus onder het lijkkleed, adembenemend",tip:"Klein museum, reserveer vooraf",priority:3},
      {name:"Napoli Sotterranea",desc:"Griekse en Romeinse tunnels onder de stad",tip:"Tours elk half uur, cool in de zomer",priority:4},
      {name:"Vesuvius",desc:"Beklim de vulkaan, uitzicht over de Golf",tip:"Combi-ticket met Pompei beschikbaar",priority:5},
    ],
    restaurants:[
      {name:"L Antica Pizzeria Da Michele",vibe:"DE pizza. Alleen margherita of marinara.",price:"€",tip:"Eat Pray Love-famous, rij is snel",tiktok:true},
      {name:"Sorbillo",vibe:"Rivaal van Da Michele, meer keuze",price:"€",tip:"Probeer de frittatina als voorgerecht",tiktok:true},
      {name:"Da Nennella",vibe:"Chaotisch, luid, fantastisch",price:"€",tip:"Cash only, ga met de flow mee"},
    ],
    tiktok:["Da Michele pizza-moment","Pompei wandeling","Spaccanapoli street food tour","Sfogliatella proeven"],
    transport:["Metro Lijn 1 (Toledo station is spectaculair)","Circumvesuviana naar Pompei (~4 euro, 40 min)","Alibus naar luchthaven (~5 euro)","Taxi: spreek prijs VOORAF af"]
  },
  { id:"amalfi", city:"Amalfikust", region:"Campanie", emoji:"🏖️", lat:40.6333,lng:14.6029,zoom:12,
    hero:"linear-gradient(135deg,#0f1926,#1a3344)", color:"#4a8cba",
    intro:"Pastelkleurige dorpen geplakt aan kliffen boven azuurblauwe zee. Elke bocht is een ansichtkaart.",
    firstSteps:["Boek accommodatie ver vooraf (populair!)","SITA bus kaartjes kopen bij tabacchi, NIET in de bus","Veerboot is sneller en mooier dan de bus","Auto = stress. Doe het niet."],
    spots:[
      {name:"Positano",desc:"Het iconische kleurendorp",tip:"Comfortabele schoenen, alles is trappen",priority:1,tiktok:true},
      {name:"Sentiero degli Dei",desc:"Pad der Goden, spectaculaire kustwandeling",tip:"Start vroeg, neem 2L water mee",priority:2,tiktok:true},
      {name:"Ravello",desc:"Villa Rufolo en Villa Cimbrone tuinen",tip:"Rustiger dan Positano, net zo mooi",priority:3},
      {name:"Amalfi stad",desc:"Kathedraal met imposante trap",tip:"Gratis toegang kathedraal, klooster is apart",priority:4},
    ],
    restaurants:[
      {name:"Da Vincenzo",vibe:"Positano, terras met zeezicht",price:"€€€",tip:"Reserveer het terras, magic hour"},
      {name:"Le Arcate",vibe:"Atrani, budget optie recht aan zee",price:"€",tip:"Beste waarde aan de hele kust"},
    ],
    tiktok:["Positano trappen-view","Sentiero degli Dei kliffen","Limoncello proeven bij boer","Boot langs de kust"],
    transport:["SITA-bus is de enige landroute","Veerboot Positano-Amalfi-Salerno (sneller!)","Vanuit Napels: trein Salerno, dan boot","Auto = NIET DOEN. Smalle wegen, geen parking"]
  },
];

const DAYS: DayPlan[] = [
  { day:1, title:"Venetie", cityId:"venezia", hotel:"Hotel nabij San Marco", morning:["Aankomst Marco Polo","Vaporetto naar hotel","Check-in en opfrissen"], afternoon:["San Marco plein en basiliek","Rialto Brug en markt","Verloren lopen in steegjes"], evening:"Cicchetti tour Cannaregio + spritz" },
  { day:2, title:"Venetie + Gardameer", cityId:"garda", hotel:"Hotel Berta, Gardameer", hotelLink:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda", morning:["Burano bezoeken (vaporetto)","Kleurenhuisjes en fotos"], afternoon:["Checkout Venetie","Reis naar Gardameer (~2u)","Aankomst Hotel Berta"], evening:"Rustige avond aan het meer" },
  { day:3, title:"Gardameer + Verona", cityId:"verona", hotel:"Hotel Verona centrum", morning:["Sirmione verkennen","Grotte di Catullo ruines","Zwemmen in het meer"], afternoon:["Doorrijden naar Verona (~45min)","Check-in hotel","Piazza delle Erbe verkennen"], evening:"Aperitivo Piazza Bra met Arena-view" },
  { day:4, title:"Verona", cityId:"verona", hotel:"Hotel Verona centrum", morning:["Arena di Verona bezoeken","Torre dei Lamberti beklimmen"], afternoon:["Ponte Pietra en Castel San Pietro","Juliets Balkon (voor de foto)"], evening:"Amarone proeverij Valpolicella + diner" },
  { day:5, title:"Naar Toscane", cityId:"toscane", hotel:"Agriturismo Chianti", morning:["Checkout Verona","Vertrek richting Toscane"], afternoon:["Stop Bologna voor lunch (optional)","Aankomst Toscane (~3u)","Inchecken agriturismo"], evening:"Wijn en kaas bij agriturismo" },
  { day:6, title:"Firenze", cityId:"toscane", hotel:"Agriturismo Chianti", morning:["Uffizi Gallery","All Antico Vinaio lunch"], afternoon:["Ponte Vecchio","Duomo beklimmen","Piazzale Michelangelo zonsondergang"], evening:"Diner Trattoria Mario, bistecca" },
  { day:7, title:"San Gimignano + Siena", cityId:"toscane", hotel:"Agriturismo Chianti", morning:["San Gimignano torens","Dondero gelato (wereldkampioen!)"], afternoon:["Siena, Piazza del Campo","Val d Orcia drive als tijd over"], evening:"Laatste avond Toscane" },
  { day:8, title:"Naar Napels", cityId:"napels", hotel:"Hotel Napels centrum", morning:["Checkout Toscane","Frecciarossa Firenze-Napels (~3u)"], afternoon:["Aankomst en inchecken","Spaccanapoli wandeling","Napoli Sotterranea tour"], evening:"Pizza bij Da Michele" },
  { day:9, title:"Pompei + Amalfi", cityId:"amalfi", hotel:"B&B Amalfikust", morning:["Circumvesuviana naar Pompei","Pompei verkennen (3-4u)"], afternoon:["Door naar Positano of Amalfi","Strand of Sentiero degli Dei"], evening:"Diner met zeezicht" },
  { day:10, title:"Amalfi + terug", cityId:"amalfi", hotel:"Terugreis", morning:["Ravello of Amalfi verkennen","Limoncello proeven"], afternoon:["Terugreis naar Napels airport","Check-in vlucht"], evening:"Arrivederci Italia" },
];

const uid = () => Math.random().toString(36).slice(2,9);
function useLocal<T>(key:string,init:T):[T,(v:T|((_:T)=>T))=>void]{
  const [v,setV]=useState<T>(init);
  useEffect(()=>{try{const d=localStorage.getItem(key);if(d)setV(JSON.parse(d))}catch{}},[key]);
  const set=(nv:T|((_:T)=>T))=>setV(p=>{const r=typeof nv==="function"?(nv as(_:T)=>T)(p):nv;localStorage.setItem(key,JSON.stringify(r));return r});
  return[v,set];
}

export default function Page(){
  const [view,setView]=useState<"days"|"city">("days");
  const [openDay,setOpenDay]=useState<number|null>(null);
  const [cityId,setCityId]=useState<string|null>(null);
  const [cityTab,setCityTab]=useState<"do"|"eat"|"viral"|"tips">("do");
  const [saves,setSaves]=useLocal<CustomItem[]>("it-saves",[]);
  const [showAdd,setShowAdd]=useState(false);
  const [af,setAf]=useState({t:"",d:"",l:"",i:""});
  const [showEmerg,setShowEmerg]=useState(false);
  const city=cityId?CITIES.find(c=>c.id===cityId):null;

  const openCity=(id:string)=>{setCityId(id);setView("city");setCityTab("do")};

  return(
    <div style={S.wrap}>
      {/* ══ HEADER ══ */}
      <header style={S.hdr}>
        <div style={S.pin}>2026</div>
        <h1 style={S.ttl}>Italia</h1>
        <p style={S.sub}>Tein & Tessa &middot; 10 dagen</p>
        <p style={S.route}>Venezia → Garda → Verona → Toscane → Napels → Amalfi</p>
      </header>

      {/* ══ VIEW TOGGLE ══ */}
      <div style={S.viewToggle}>
        <button onClick={()=>{setView("days");setCityId(null)}} style={{...S.vBtn,...(view==="days"?S.vBtnA:{})}}>📅 Dag voor dag</button>
        <button onClick={()=>setView("city")} style={{...S.vBtn,...(view==="city"?S.vBtnA:{})}}>🏙️ Steden</button>
      </div>

      {/* ══ DAY VIEW ══ */}
      {view==="days"&&<div style={S.ct}>
        {DAYS.map(d=>{
          const c=CITIES.find(x=>x.id===d.cityId);
          const open=openDay===d.day;
          return(
            <div key={d.day} style={{...S.dayCard,...(open?{borderColor:c?.color||"#c4704b"}:{})}}>
              <button onClick={()=>setOpenDay(open?null:d.day)} style={S.dayHead}>
                <div style={{...S.dayBadge,background:c?.color||"#c4704b"}}>{""+d.day}</div>
                <div style={S.dayInfo}>
                  <div style={S.dayTitle}>{d.title}</div>
                  <div style={S.dayHotel}>{"🏨 "+d.hotel}</div>
                </div>
                <span style={S.dayEmoji} onClick={(e)=>{e.stopPropagation();if(c)openCity(c.id)}}>{c?.emoji||""}</span>
                <span style={{...S.chevron,...(open?{transform:"rotate(180deg)"}:{})}}>▼</span>
              </button>
              {open&&<div style={S.dayBody}>
                {d.hotelLink&&<a href={d.hotelLink} target="_blank" rel="noreferrer" style={S.mapLink}>📍 Hotel op Maps</a>}
                <div style={S.daySection}><div style={S.dayLabel}>☀️ Ochtend</div>{d.morning.map((m,i)=><div key={i} style={S.dayItem}>{m}</div>)}</div>
                <div style={S.daySection}><div style={S.dayLabel}>🌤️ Middag</div>{d.afternoon.map((a,i)=><div key={i} style={S.dayItem}>{a}</div>)}</div>
                <div style={S.daySection}><div style={S.dayLabel}>🌙 Avond</div><div style={S.dayItem}>{d.evening}</div></div>
                {c&&<button onClick={()=>openCity(c.id)} style={S.cityLink}>{"Bekijk alles in "+c.city+" →"}</button>}
              </div>}
            </div>
          )
        })}
      </div>}

      {/* ══ CITY VIEW ══ */}
      {view==="city"&&!city&&<div style={S.ct}>
        {CITIES.map(c=><button key={c.id} onClick={()=>openCity(c.id)} style={{...S.cCard,background:c.hero}}>
          <span style={S.cEm}>{c.emoji}</span>
          <div style={{flex:1}}><div style={S.cNm}>{c.city}</div><div style={S.cRg}>{c.region}</div></div>
          <span style={{color:c.color}}>→</span>
        </button>)}
      </div>}

      {view==="city"&&city&&<div style={S.ct}>
        <button onClick={()=>setCityId(null)} style={S.back}>← Alle steden</button>
        <div style={{...S.cHero,background:city.hero}}>
          <span style={{fontSize:48,display:"block",marginBottom:8}}>{city.emoji}</span>
          <h2 style={S.cTitle}>{city.city}</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:4}}>{city.region}</p>
        </div>
        <p style={S.cIntro}>{city.intro}</p>

        {/* Map */}
        <div style={S.mapW}><iframe style={S.mapF} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={"https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center="+city.lat+","+city.lng+"&zoom="+city.zoom+"&maptype=roadmap"} allowFullScreen/></div>

        {/* City tabs */}
        <div style={S.cTabs}>
          {([["do","⭐ Doen"],["eat","🍽️ Eten"],["viral","📱 Viral"],["tips","💡 Tips"]] as [string,string][]).map(([t,l])=>
            <button key={t} onClick={()=>setCityTab(t as typeof cityTab)} style={{...S.cTab,...(cityTab===t?{borderBottomColor:city.color,color:"var(--cream)"}:{})}}>{l}</button>
          )}
        </div>

        {cityTab==="do"&&<div>
          <div style={S.firstBox}><div style={S.firstTitle}>🎯 Eerste stappen</div>{city.firstSteps.map((s,i)=><div key={i} style={S.firstItem}><span style={{...S.firstNum,background:city.color}}>{""+( i+1)}</span>{s}</div>)}</div>
          {city.spots.sort((a,b)=>(a.priority||99)-(b.priority||99)).map((sp,i)=><div key={i} style={S.card}>
            <div style={S.cardTop}><span style={S.cardName}>{sp.name}</span>{sp.tiktok&&<span style={S.tiktokBadge}>viral</span>}</div>
            <div style={S.cardDesc}>{sp.desc}</div>
            {sp.tip&&<div style={S.cardTip}>{"💡 "+sp.tip}</div>}
          </div>)}
        </div>}

        {cityTab==="eat"&&<div>{city.restaurants.map((r,i)=><div key={i} style={S.card}>
          <div style={S.cardTop}><span style={S.cardName}>{r.name}</span><span style={{color:city.color,fontSize:12}}>{r.price}</span>{r.tiktok&&<span style={S.tiktokBadge}>viral</span>}</div>
          <div style={S.cardDesc}>{r.vibe}</div>
          {r.tip&&<div style={S.cardTip}>{"💡 "+r.tip}</div>}
        </div>)}</div>}

        {cityTab==="viral"&&<div>
          <p style={{fontSize:13,color:"var(--cream-muted)",marginBottom:16}}>TikTok & Instagram spots die je niet wilt missen:</p>
          {city.tiktok.map((t,i)=><div key={i} style={S.viralItem}><span style={S.viralIcon}>📱</span>{t}</div>)}
        </div>}

        {cityTab==="tips"&&<div>
          <div style={{marginBottom:20}}><h4 style={S.tipHead}>🚌 Vervoer</h4>{city.transport.map((t,i)=><div key={i} style={S.tipItem}>{t}</div>)}</div>
          <div><h4 style={S.tipHead}>🎯 Eerste stappen</h4>{city.firstSteps.map((s,i)=><div key={i} style={S.tipItem}>{s}</div>)}</div>
        </div>}
      </div>}

      {/* ══ SAVES ══ */}
      <div style={S.savesBar}>
        <button onClick={()=>setShowAdd(!showAdd)} style={S.savesBtn}>{"📌 Bewaard ("+saves.filter(s=>!s.done).length+")"}</button>
      </div>
      {showAdd&&<div style={S.savesBox}>
        <div style={S.addRow}>
          <input placeholder="Toevoegen..." value={af.t} onChange={e=>setAf({...af,t:e.target.value})} style={S.addInp} onKeyDown={e=>{if(e.key==="Enter"&&af.t){setSaves(p=>[...p,{id:uid(),title:af.t,desc:af.d,link:af.l||undefined,img:af.i||undefined,done:false}]);setAf({t:"",d:"",l:"",i:""})}}}/>
          <button onClick={()=>{if(!af.t)return;setSaves(p=>[...p,{id:uid(),title:af.t,desc:af.d,link:af.l||undefined,img:af.i||undefined,done:false}]);setAf({t:"",d:"",l:"",i:""})}} style={S.addGo}>+</button>
        </div>
        {saves.map(s=><div key={s.id} style={{...S.saveItem,...(s.done?{opacity:0.4}:{})}}>
          <button onClick={()=>setSaves(p=>p.map(x=>x.id===s.id?{...x,done:!x.done}:x))} style={S.chk}>{s.done?"✅":"⬜"}</button>
          <span style={{flex:1,fontSize:13,color:"var(--cream)",...(s.done?{textDecoration:"line-through"}:{})}}>{s.link?<a href={s.link} target="_blank" rel="noreferrer" style={{color:"#d4886a",textDecoration:"none"}}>{s.title}</a>:s.title}</span>
          <button onClick={()=>setSaves(p=>p.filter(x=>x.id!==s.id))} style={S.del}>✕</button>
        </div>)}
      </div>}

      {/* ══ EMERGENCY ══ */}
      <button onClick={()=>setShowEmerg(!showEmerg)} style={S.emBtn}>{"🚨 Nood "+(showEmerg?"▲":"▼")}</button>
      {showEmerg&&<div style={S.emBox}>{Object.entries(EMERGENCY).map(([k,v])=><div key={k} style={S.emRow}><span style={{fontSize:12,color:"var(--cream-muted)"}}>{k}</span><a href={"tel:"+v.replace(/\s/g,"")} style={{fontSize:13,color:"#d4886a",textDecoration:"none",fontWeight:500}}>{v}</a></div>)}</div>}

      <footer style={S.ftr}>Buon viaggio 🇮🇹</footer>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap:{maxWidth:520,margin:"0 auto",padding:"0 16px",minHeight:"100vh"},
  hdr:{textAlign:"center",padding:"44px 0 16px"},
  pin:{display:"inline-block",background:"#c4704b",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:2.5,padding:"5px 16px",borderRadius:20,marginBottom:14,textTransform:"uppercase"},
  ttl:{fontFamily:"var(--font-serif)",fontSize:52,fontWeight:400,color:"var(--cream)",lineHeight:1,margin:0},
  sub:{fontSize:14,color:"var(--cream-muted)",marginTop:8},
  route:{fontSize:11,color:"var(--accent)",marginTop:4,letterSpacing:0.5},
  viewToggle:{display:"flex",gap:6,marginBottom:20,background:"var(--bg-card)",borderRadius:12,padding:4},
  vBtn:{flex:1,padding:"10px 8px",background:"transparent",border:"none",borderRadius:10,color:"var(--cream-muted)",fontSize:13,cursor:"pointer"},
  vBtnA:{background:"#c4704b",color:"#fff"},
  ct:{paddingBottom:16},
  // Day cards
  dayCard:{background:"var(--bg-card)",borderRadius:16,marginBottom:10,border:"1px solid rgba(255,255,255,0.04)",overflow:"hidden",transition:"border-color 0.2s"},
  dayHead:{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",color:"var(--cream)",textAlign:"left"},
  dayBadge:{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0},
  dayInfo:{flex:1,minWidth:0},
  dayTitle:{fontFamily:"var(--font-serif)",fontSize:17,fontWeight:400},
  dayHotel:{fontSize:11,color:"var(--cream-muted)",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  dayEmoji:{fontSize:22,flexShrink:0,cursor:"pointer"},
  chevron:{fontSize:10,color:"var(--cream-muted)",transition:"transform 0.2s",flexShrink:0},
  dayBody:{padding:"0 16px 16px",borderTop:"1px solid rgba(255,255,255,0.04)"},
  mapLink:{display:"inline-block",fontSize:12,color:"#d4886a",textDecoration:"none",padding:"8px 0"},
  daySection:{marginTop:12},
  dayLabel:{fontSize:11,fontWeight:600,color:"var(--cream-muted)",marginBottom:6,textTransform:"uppercase",letterSpacing:1},
  dayItem:{fontSize:13,color:"var(--cream)",padding:"3px 0",paddingLeft:12,borderLeft:"2px solid rgba(255,255,255,0.06)",marginBottom:4,lineHeight:1.5},
  cityLink:{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 16px",color:"#d4886a",fontSize:12,cursor:"pointer",marginTop:12,width:"100%"},
  // City list
  cCard:{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",color:"var(--cream)",textAlign:"left",fontSize:16,width:"100%",marginBottom:8},
  cEm:{fontSize:28,flexShrink:0},
  cNm:{fontFamily:"var(--font-serif)",fontSize:19,fontWeight:400},
  cRg:{fontSize:11,color:"var(--cream-muted)",marginTop:1},
  back:{background:"none",border:"none",color:"#d4886a",fontSize:14,cursor:"pointer",padding:"8px 0",marginBottom:8},
  cHero:{borderRadius:20,padding:"36px 24px",textAlign:"center",marginBottom:16},
  cTitle:{fontFamily:"var(--font-serif)",fontSize:34,fontWeight:400,color:"#fff",margin:0},
  cIntro:{fontSize:14,lineHeight:1.7,color:"var(--cream-muted)",marginBottom:16,fontStyle:"italic",fontFamily:"var(--font-serif)"},
  mapW:{borderRadius:14,overflow:"hidden",marginBottom:20,border:"1px solid rgba(255,255,255,0.08)"},
  mapF:{width:"100%",height:200,border:"none",display:"block"},
  cTabs:{display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.08)"},
  cTab:{flex:1,padding:"10px 4px",background:"none",border:"none",borderBottom:"2px solid transparent",color:"var(--cream-muted)",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"},
  // First steps
  firstBox:{background:"rgba(196,112,75,0.08)",borderRadius:14,padding:16,marginBottom:20,border:"1px solid rgba(196,112,75,0.15)"},
  firstTitle:{fontSize:14,fontWeight:600,color:"var(--cream)",marginBottom:12},
  firstItem:{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"var(--cream-muted)",marginBottom:8,lineHeight:1.5},
  firstNum:{width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0},
  // Cards
  card:{background:"var(--bg-card)",borderRadius:14,padding:"14px 16px",marginBottom:10,border:"1px solid rgba(255,255,255,0.04)"},
  cardTop:{display:"flex",alignItems:"center",gap:8,marginBottom:4},
  cardName:{fontSize:14,fontWeight:600,color:"var(--cream)",flex:1},
  cardDesc:{fontSize:12,color:"var(--cream-muted)",lineHeight:1.5},
  cardTip:{fontSize:11,color:"#d4886a",marginTop:8},
  tiktokBadge:{background:"rgba(255,0,80,0.15)",color:"#ff4d6a",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:8},
  // Viral
  viralItem:{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg-card)",borderRadius:12,marginBottom:8,fontSize:13,color:"var(--cream)",border:"1px solid rgba(255,255,255,0.04)"},
  viralIcon:{fontSize:18,flexShrink:0},
  // Tips
  tipHead:{fontSize:15,fontWeight:400,fontFamily:"var(--font-serif)",color:"var(--cream)",marginBottom:10,margin:0,marginTop:0},
  tipItem:{fontSize:13,color:"var(--cream-muted)",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",lineHeight:1.5},
  // Saves
  savesBar:{marginTop:20},
  savesBtn:{background:"var(--bg-card)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 18px",color:"var(--cream)",fontSize:13,cursor:"pointer",width:"100%",textAlign:"left"},
  savesBox:{background:"var(--bg-card)",borderRadius:14,padding:14,marginTop:8,border:"1px solid rgba(255,255,255,0.06)"},
  addRow:{display:"flex",gap:8,marginBottom:12},
  addInp:{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:"var(--cream)",fontSize:13,outline:"none"},
  addGo:{width:36,background:"#c4704b",border:"none",borderRadius:8,color:"#fff",fontSize:18,cursor:"pointer"},
  saveItem:{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"},
  chk:{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:0,flexShrink:0},
  del:{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:12,cursor:"pointer",padding:4,flexShrink:0},
  // Emergency
  emBtn:{background:"rgba(196,112,75,0.1)",border:"1px solid rgba(196,112,75,0.2)",borderRadius:12,padding:"12px 18px",color:"#d4886a",fontSize:13,cursor:"pointer",width:"100%",textAlign:"left",marginTop:12},
  emBox:{background:"var(--bg-card)",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:8,marginTop:8},
  emRow:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  ftr:{textAlign:"center",padding:"28px 0 44px",fontSize:13,color:"var(--accent)",fontFamily:"var(--font-serif)",fontStyle:"italic"},
};

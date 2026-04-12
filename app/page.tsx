"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

interface Spot{name:string;desc:string;tip?:string}
interface Resto{name:string;type:string;price:string;tip?:string}
interface Viral{name:string;desc:string;tag:string}
interface City{id:string;name:string;region:string;color:string;lat:number;lng:number;zoom:number;intro:string;history:string;budget:string;safety:string;firstSteps:string[];spots:Spot[];restaurants:Resto[];viral:Viral[];transport:string[];bookings?:string[]}
interface Day{day:number;title:string;cityId:string;hotel:string;hotelUrl?:string;morning:string[];afternoon:string[];evening:string;schedule:{time:string;what:string;type?:string}[]}
interface MustSee{id:string;title:string;description:string;link?:string;img?:string;done:boolean}
interface Todo{id:string;text:string;done:boolean}
interface SBDay{id:string;day_num:number;title:string;city_id:string;hotel:string;hotel_url?:string;morning:string[];afternoon:string[];evening:string}
interface Note{id:string;city_id:string;title:string;content:string}
interface CustomPOI{id:string;name:string;cat:string;city_id:string;description?:string;img?:string}
interface DayPoi{id:string;day:number;name:string;desc:string;link?:string}

const C:City[]=[
{id:"ven",name:"Venetie",region:"Veneto",color:"#1e3a5f",lat:45.4408,lng:12.3155,zoom:14,intro:"Drijvende droomstad. Gondels, San Marco, verdwalen in steegjes.",history:"Venetie werd gesticht in de 5e eeuw door vluchtelingen. Groeide uit tot machtige handelsrepubliek die het Byzantijnse Rijk, de kruistochten en de Renaissance domineerde. Het Dogenpaleis was 1000 jaar het centrum van de macht.",budget:"Venetie is duur. Reken op E15-25 voor lunch, E30-50 voor diner. Vaporetto dagpas E25. Vermijd restaurants direct aan San Marco.",safety:"Veilige stad. Let op zakkenrollers bij Rialto en San Marco. Water uit kraan is drinkbaar. Acqua alta (hoogwater) nov-feb.",bookings:["Dogenpaleis: palazzoducale.visitmuve.it","Burano vaporetto: actv.avmspa.it"],firstSteps:["Koop vaporetto dagpas bij station","Download Venezia Unica app","Water bij supermarkt niet op plein","Loop Rialto naar San Marco als eerste"],spots:[{name:"San Marco",desc:"Plein, basiliek, Dogenpaleis",tip:"Voor 9u gaan"},{name:"Rialto en Markt",desc:"Iconische brug + vismarkt",tip:"Markt 7:30-12:00"},{name:"Burano",desc:"Kleurrijkste eiland van lagune",tip:"Vaporetto 12, 45 min"},{name:"Dorsoduro",desc:"Rustigste wijk",tip:"Ponte Accademia bij sunset"}],restaurants:[{name:"Osteria Al Squero",type:"Cicchetti",price:"E",tip:"Spritz aan het water"},{name:"Da Romano",type:"Buranees",price:"EE",tip:"Risotto op Burano"},{name:"Cantina Do Spade",type:"Venetiaans",price:"EE",tip:"Sinds 1488"}],viral:[{name:"Libreria Acqua Alta",desc:"Boekwinkel met gondels",tag:"#venezia"},{name:"Burano streets",desc:"Meest Instagrammable",tag:"#burano"}],transport:["Vaporetto dagpas kopen","Alilaguna boot vanaf vliegveld","Alles te voet + vaporetto"]},
{id:"gar",name:"Gardameer",region:"Lombardije",color:"#1a4433",lat:45.65,lng:10.67,zoom:11,intro:"Grootste meer van Italie. Citroentuinen, bergen, Hotel Berta.",history:"Het Gardameer is al sinds de Romeinse tijd een vakantiebestemming. Catullus had hier een villa. Later verbleef Goethe en D'Annunzio hier. De Scaligeri bouwden kastelen langs de oevers.",budget:"Goedkoper dan Venetie. Lunch E10-18, diner E20-35. Veerboot dagpas ~E35. Parkeren kan lastig zijn in Sirmione.",safety:"Zeer veilig. Zwemmen in het meer is prima. Wegen langs westoever zijn smal en druk in het seizoen.",bookings:["Grotte di Catullo: grottedicatullo.beniculturali.it"],firstSteps:["Check in Hotel Berta","Huur boot of fiets bij haven","Download Navigarda app"],spots:[{name:"Sirmione",desc:"Kasteel + thermale bronnen",tip:"Grotte di Catullo"},{name:"Limone sul Garda",desc:"Citroentuinen + pittoresk",tip:"Limonaia del Castel"},{name:"Riva del Garda",desc:"Bergen + meer",tip:"Cascata del Varone"}],restaurants:[{name:"Al Pescatore",type:"Vis",price:"EE",tip:"Terras aan het water"},{name:"Osteria Il Gallo",type:"Lokaal",price:"E",tip:"Authentiek"}],viral:[{name:"Sirmione kasteel",desc:"Toren uit het water",tag:"#lakegarda"},{name:"Limone citroenen",desc:"Geel tegen blauw",tag:"#limone"}],transport:["Veerboten: navigazionelaghi.it","Auto voor westoever","Trein: Desenzano station"]},
{id:"ver",name:"Verona",region:"Veneto",color:"#3a1e45",lat:45.4384,lng:10.9916,zoom:14,intro:"Shakespeare stad. Arena, Amarone, liefde overal.",history:"Verona was een belangrijke Romeinse stad (Arena uit 30 na Chr). Later heersten de Scaligeri, daarna Venetie. Shakespeare maakte het onsterfelijk met Romeo en Julia, al was het verhaal fictief.",budget:"Middenklasse. Lunch E10-20, diner E25-40. Verona Card E20/24u bespaart veel op musea. Wijn in Valpolicella is goedkoop.",safety:"Veilige, compacte stad. Arena-omgeving kan druk zijn. Pas op voor fietsen in het centrum.",bookings:["Arena di Verona: arena.it","Verona Card: veronacard.it"],firstSteps:["Station naar Piazza Bra 10 min","Koop Verona Card 24/48u","Arena buiten = gratis","Boek wijnproeverij Valpolicella"],spots:[{name:"Arena di Verona",desc:"Romeins amfitheater",tip:"arena.it voor opera"},{name:"Piazza delle Erbe",desc:"Markt + aperitivo",tip:"Torre dei Lamberti"},{name:"Castel San Pietro",desc:"Panorama over stad",tip:"15 min klimmen"},{name:"Ponte Pietra",desc:"Romeinse brug",tip:"Golden hour"},{name:"Valpolicella",desc:"Amarone wijnstreek",tip:"20 min rijden"}],restaurants:[{name:"Osteria al Duca",type:"Veronees",price:"EE",tip:"Pastissada de caval"},{name:"Du de Cope",type:"Pizza",price:"E",tip:"Beste pizza Verona"},{name:"Monte Baldo",type:"Osteria",price:"EE",tip:"Reserveer risotto"}],viral:[{name:"Juliet Balkon",desc:"Briefjes op muur",tag:"#juliet"},{name:"Arena bij nacht",desc:"Verlicht = magisch",tag:"#arena"},{name:"Spritz Piazza Erbe",desc:"Aperitivo",tag:"#aperolspritz"}],transport:["Porta Nuova: Venetie/Milaan","Centrum = te voet","Bus naar Valpolicella"]},
{id:"tos",name:"Toscane",region:"Toscane",color:"#2a3518",lat:43.7696,lng:11.2558,zoom:10,intro:"Renaissance, cipressen, wijn. Firenze + droomdorpen.",history:"Toscane is de bakermat van de Renaissance. De Medici familie maakte Firenze tot cultureel centrum van Europa. Siena was eeuwenlang rivaal. Het landschap is al 500 jaar vrijwel onveranderd.",budget:"Firenze is prijzig, platteland goedkoper. Lunch E12-20, diner E25-45. Uffizi E25. Huurauto ~E50/dag. Agriturismo = beste waarde.",safety:"Zeer veilig. ZTL boetes in alle steden (E150+!). Wegen in Val d'Orcia zijn smal. Drinkwater uit kraan prima.",bookings:["Uffizi: uffizi.it/en/tickets","Duomo Firenze: duomo.firenze.it"],firstSteps:["Boek Uffizi WEKEN vooruit","Download Trenitalia app","Huur auto 1 dag Val d Orcia","ZTL = niet centrum inrijden!"],spots:[{name:"Uffizi",desc:"Botticelli, Da Vinci",tip:"Boek vooruit"},{name:"Ponte Vecchio",desc:"Gouden juweliersbrug",tip:"Sunset = goud"},{name:"San Gimignano",desc:"Torens + gelato",tip:"Dondero = kampioen"},{name:"Val d Orcia",desc:"Cipressen-foto",tip:"Auto huren"},{name:"Siena",desc:"Piazza del Campo",tip:"Compacter dan Firenze"},{name:"Piazzale Michelangelo",desc:"Uitzicht Firenze",tip:"Zonsondergang"}],restaurants:[{name:"Trattoria Mario",type:"Florentijns",price:"E",tip:"Bistecca"},{name:"All Antico Vinaio",type:"Panini",price:"E",tip:"Beroemdste broodjes"},{name:"Osteria dell Enoteca",type:"Toscaans",price:"EE",tip:"Wild zwijn ragu"}],viral:[{name:"Vinaio rij",desc:"Film je schiacciata",tag:"#foodtiktok"},{name:"Val d Orcia weg",desc:"Cipressenlaan",tag:"#tuscany"},{name:"Ponte Vecchio",desc:"Verplichte selfie",tag:"#florence"}],transport:["Firenze SMN = hub","Bus San Gimignano via Poggibonsi","Auto voor Val d Orcia","ZTL boete = 150+!"]},
{id:"nap",name:"Napels",region:"Campanie",color:"#3d1f1a",lat:40.8518,lng:14.2681,zoom:13,intro:"Rauw, luid, echt. Pizza, Pompei, Vesuvius.",history:"Napels is een van de oudste steden van Europa, gesticht door Grieken als Neapolis. Hoofdstad van het Koninkrijk der Twee Sicilien. Pompei werd in 79 na Chr bedolven onder de Vesuvius.",budget:"Goedkoopste stad op de route! Pizza E4-8, lunch E8-15, diner E15-30. Metro E1.30. Pompei E18. Cash is koning.",safety:"Reputatie is erger dan realiteit, maar wees alert. Geen sieraden dragen, rugzak voor. Niet in donkere steegjes 's nachts. Verkeer is chaotisch.",bookings:["Pompei: ticketone.it/pompei","Vesuvius: ticketone.it/vesuvio"],firstSteps:["Metro naar Toledo station","Loop Spaccanapoli west naar oost","Boek Pompei online","Cash meenemen"],spots:[{name:"Spaccanapoli",desc:"Hartader centrum",tip:"Ochtend = best"},{name:"Pompei",desc:"Bevroren stad",tip:"Online tickets vroeg"},{name:"Cappella Sansevero",desc:"Christus-sculptuur",tip:"Reserveer"},{name:"Vesuvius",desc:"Beklim de vulkaan",tip:"Combi-ticket"},{name:"Sotterranea",desc:"Ondergrondse tunnels",tip:"Elk half uur"}],restaurants:[{name:"Da Michele",type:"Pizza",price:"E",tip:"Margherita of marinara"},{name:"Da Nennella",type:"Napolitaans",price:"E",tip:"Cash only chaos"},{name:"Sorbillo",type:"Pizza",price:"E",tip:"Frittatina!"}],viral:[{name:"Da Michele",desc:"Film de pizza fold",tag:"#damichele"},{name:"Toledo metro",desc:"Mooiste station",tag:"#naplesmetro"},{name:"Street food",desc:"Frittatina",tag:"#streetfood"}],transport:["Metro Lijn 1 Toledo!","Circumvesuviana Pompei E4","Alibus luchthaven E5"]},
{id:"ama",name:"Amalfikust",region:"Campanie",color:"#1a3040",lat:40.6333,lng:14.6029,zoom:12,intro:"Pastelkliffen, azuurblauwe zee, citroenen overal.",history:"De Amalfikust was in de middeleeuwen een machtige zeerepubliek die handelde met de Arabische wereld. Positano was een arm vissersdorp tot John Steinbeck er in 1953 over schreef. Ravello was favoriet van Wagner.",budget:"Duurste plek op de route. Lunch E15-25, diner E35-60. Veerboot E10-15 per rit. Strandbed E15-25/dag. Budget tip: eet in Atrani.",safety:"Veilig maar fysiek uitdagend. Steile trappen overal. SITA-bussen zijn vol in het seizoen. Geen auto - parkeren onmogelijk. Zon is intens, neem zonnebrand.",bookings:["Sentiero degli Dei: geen ticket nodig","Veerboot: travelmar.it"],firstSteps:["SITA-bus kaartjes bij tabacchi","Veerboot = sneller + mooier","GOEDE schoenen trappen!","Sentiero degli Dei: start vroeg"],spots:[{name:"Positano",desc:"Kleurendorp aan klif",tip:"Comfy schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden 7km",tip:"Vroeg + 2L water"},{name:"Ravello",desc:"Tuinen + uitzicht",tip:"Rustiger"},{name:"Amalfi Duomo",desc:"Kathedraal + trap",tip:"Gratis entree"}],restaurants:[{name:"Da Vincenzo",type:"Vis",price:"EEE",tip:"Positano terras"},{name:"Le Arcate",type:"Pizza",price:"E",tip:"Atrani aan zee"},{name:"Il Ritrovo",type:"Seizoen",price:"EE",tip:"Kookles!"}],viral:[{name:"Positano trappen",desc:"Pastel op azuur",tag:"#positano"},{name:"Limoncello",desc:"Citroenen",tag:"#limoncello"},{name:"Path of Gods",desc:"Boven wolken",tag:"#hiking"}],transport:["SITA-bus langs kust","Veerboot Positano/Salerno","Geen auto!","Trein Napels naar Salerno"]},
{id:"apu",name:"Apuaanse Alpen",region:"Toscane",color:"#2d3a3a",lat:44.05,lng:10.15,zoom:11,intro:"Marmeren bergen, wilde natuur, verborgen dorpjes. Carrara marmer komt hier vandaan.",history:"De Apuaanse Alpen worden al 2000 jaar ontgonnen voor marmer. Michelangelo koos hier persoonlijk zijn blokken voor de David. Colonnata maakt al eeuwen lardo in marmeren kuipen. Anarchistisch verleden in Carrara.",budget:"Zeer betaalbaar. Lunch E8-15, diner E15-25. Marmergroeve tour ~E15. Benzine nodig want auto is essentieel.",safety:"Bergwegen kunnen smal zijn. Groeves bezoek alleen met gids. Weer kan snel omslaan in de bergen. Goede schoenen essentieel.",bookings:["Carrara marmergroeve tours: marmortour.com"],firstSteps:["Huur een auto, OV is beperkt","Neem wandelschoenen mee","Bezoek een marmergroeve","Probeer lardo di Colonnata"],spots:[{name:"Carrara marmergroeven",desc:"Witte bergen van marmer, spectaculair",tip:"Guided tour boeken"},{name:"Colonnata",desc:"Bergdorpje bekend om lardo",tip:"Eet bij Venanzio"},{name:"Campocecina",desc:"Uitzichtpunt over kust en bergen",tip:"Auto nodig, onverharde weg"},{name:"Forte dei Marmi",desc:"Chique kustplaatsje aan de voet",tip:"Strand + shoppen"}],restaurants:[{name:"Ristorante Venanzio",type:"Lardo di Colonnata",price:"EE",tip:"Beroemd om lardo, reserveer"},{name:"Osteria nella Pia",type:"Toscaans",price:"E",tip:"Authentiek bergeten"}],viral:[{name:"Carrara groeves",desc:"Witte marmeren canyon",tag:"#carrara #marble"},{name:"Colonnata dorpje",desc:"Kleinste foodie dorp",tag:"#lardo #tuscany"}],transport:["Auto is essentieel","Dichtstbijzijnde station: Massa-Carrara","Vanaf Gardameer: ~3.5u rijden","Vanaf Firenze: ~1.5u"]}
];

const DAYS:Day[]=[
{day:1,title:"Aankomst Venetie",cityId:"ven",hotel:"Hotel nabij San Marco",morning:["Vlucht naar Marco Polo","Boot naar centrum"],afternoon:["Inchecken","Wandeling Rialto naar San Marco"],evening:"Cicchetti en spritz",schedule:[{time:"10:00",what:"Landing Marco Polo"},{time:"11:00",what:"Alilaguna boot naar centrum",type:"transport"},{time:"12:30",what:"Inchecken hotel"},{time:"13:00",what:"Lunch bij Cantina Do Spade",type:"food"},{time:"14:30",what:"Wandeling Rialto naar San Marco"},{time:"16:30",what:"Dogenpaleis of San Marco binnen"},{time:"18:30",what:"Aperitivo Dorsoduro",type:"food"},{time:"20:00",what:"Cicchetti tour Cannaregio",type:"food"}]},
{day:2,title:"Venetie naar Gardameer",cityId:"gar",hotel:"Hotel Berta Gardameer",hotelUrl:"https://maps.google.com/?q=Hotel+Berta+Lake+Garda",morning:["Burano bezoeken","Kleurenhuizen"],afternoon:["Checkout Venetie","Reis naar Gardameer"],evening:"Aankomst Hotel Berta diner aan meer",schedule:[{time:"08:30",what:"Ontbijt hotel"},{time:"09:30",what:"Vaporetto naar Burano",type:"transport"},{time:"10:30",what:"Burano verkennen + fotos"},{time:"12:00",what:"Lunch Da Romano op Burano",type:"food"},{time:"13:30",what:"Terug naar Venetie",type:"transport"},{time:"14:30",what:"Checkout + naar station"},{time:"15:00",what:"Trein/auto naar Gardameer",type:"transport"},{time:"17:30",what:"Aankomst Hotel Berta"},{time:"19:00",what:"Diner aan het meer",type:"food"}]},
{day:3,title:"Gardameer naar Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Sirmione kasteel","Of Limone sul Garda"],afternoon:["Lunch aan meer","Naar Verona 45 min"],evening:"Piazza Bra + Arena",schedule:[{time:"08:30",what:"Ontbijt Hotel Berta"},{time:"09:30",what:"Sirmione kasteel + thermaal"},{time:"12:00",what:"Lunch in Sirmione",type:"food"},{time:"13:30",what:"Limone sul Garda of vrije tijd meer"},{time:"15:30",what:"Auto naar Verona",type:"transport"},{time:"16:15",what:"Inchecken Verona"},{time:"17:00",what:"Wandeling naar Piazza Bra"},{time:"18:30",what:"Aperitivo met zicht op Arena",type:"food"},{time:"20:00",what:"Diner Piazza delle Erbe",type:"food"}]},
{day:4,title:"Verona",cityId:"ver",hotel:"Hotel Verona centrum",morning:["Arena di Verona","Piazza delle Erbe + toren"],afternoon:["Ponte Pietra + panorama","Juliet Balkon"],evening:"Amarone proeverij + diner",schedule:[{time:"09:00",what:"Ontbijt + Arena di Verona"},{time:"11:00",what:"Piazza delle Erbe + Torre dei Lamberti"},{time:"12:30",what:"Lunch Du de Cope pizza",type:"food"},{time:"14:00",what:"Ponte Pietra + Castel San Pietro panorama"},{time:"15:30",what:"Juliet Balkon (voor de foto)"},{time:"16:30",what:"Auto naar Valpolicella",type:"transport"},{time:"17:00",what:"Amarone wijnproeverij",type:"food"},{time:"19:30",what:"Diner Osteria al Duca",type:"food"}]},
{day:5,title:"Verona naar Toscane",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Checkout Verona","Frecciarossa naar Firenze"],afternoon:["Inchecken agriturismo","Omgeving verkennen"],evening:"Wijn en kaas agriturismo",schedule:[{time:"08:30",what:"Checkout Verona"},{time:"09:15",what:"Frecciarossa naar Firenze",type:"transport"},{time:"10:45",what:"Aankomst Firenze SMN"},{time:"11:30",what:"Auto/bus naar agriturismo",type:"transport"},{time:"12:30",what:"Inchecken + lunch agriturismo",type:"food"},{time:"14:30",what:"Omgeving verkennen of zwembad"},{time:"17:00",what:"Wandeling door wijnranken"},{time:"19:00",what:"Wijn en kaas proeverij agriturismo",type:"food"}]},
{day:6,title:"Firenze",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Uffizi Gallery","Ponte Vecchio"],afternoon:["Duomo beklimmen","All Antico Vinaio"],evening:"Piazzale Michelangelo sunset",schedule:[{time:"08:30",what:"Auto/bus naar Firenze",type:"transport"},{time:"09:30",what:"Uffizi Gallery (geboekt!)"},{time:"12:00",what:"Ponte Vecchio bekijken"},{time:"12:30",what:"Lunch All Antico Vinaio",type:"food"},{time:"14:00",what:"Duomo + koepel beklimmen"},{time:"16:00",what:"Wandeling door Oltrarno wijk"},{time:"17:30",what:"Piazzale Michelangelo sunset"},{time:"19:30",what:"Diner Trattoria Mario",type:"food"},{time:"21:00",what:"Terug naar agriturismo",type:"transport"}]},
{day:7,title:"San Gimignano en Siena",cityId:"tos",hotel:"Agriturismo Chianti",morning:["Auto naar San Gimignano","Torens + gelato"],afternoon:["Siena Piazza del Campo","Duomo bezoeken"],evening:"Laatste avond Toscane",schedule:[{time:"08:30",what:"Auto naar San Gimignano",type:"transport"},{time:"09:30",what:"Torens beklimmen + uitzicht"},{time:"11:00",what:"Gelato Dondero (wereldkampioen!)",type:"food"},{time:"12:00",what:"Lunch in San Gimignano",type:"food"},{time:"13:30",what:"Auto naar Siena",type:"transport"},{time:"14:15",what:"Piazza del Campo"},{time:"15:30",what:"Duomo di Siena"},{time:"17:00",what:"Aperitivo op Il Campo",type:"food"},{time:"18:30",what:"Terug naar agriturismo",type:"transport"},{time:"20:00",what:"Laatste avond Toscane diner",type:"food"}]},
{day:8,title:"Toscane naar Napels",cityId:"nap",hotel:"Hotel Napels centrum",morning:["Checkout","Frecciarossa naar Napels 3u"],afternoon:["Spaccanapoli wandeling","Metro Toledo"],evening:"Pizza Da Michele",schedule:[{time:"08:00",what:"Checkout agriturismo"},{time:"09:00",what:"Naar Firenze SMN",type:"transport"},{time:"09:45",what:"Frecciarossa naar Napels",type:"transport"},{time:"12:45",what:"Aankomst Napels Centrale"},{time:"13:00",what:"Inchecken hotel"},{time:"13:30",what:"Metro naar Toledo (kunststation!)",type:"transport"},{time:"14:00",what:"Spaccanapoli wandeling west naar oost"},{time:"16:00",what:"Cappella Sansevero"},{time:"17:00",what:"Napoli Sotterranea tour"},{time:"19:00",what:"Pizza Da Michele",type:"food"}]},
{day:9,title:"Pompei en Amalfikust",cityId:"ama",hotel:"B&B Amalfikust",morning:["Circumvesuviana Pompei","Rondleiding ruines"],afternoon:["Door naar Positano","Strand of dorpje"],evening:"Zeevruchten met uitzicht",schedule:[{time:"07:30",what:"Vroeg vertrek + ontbijt"},{time:"08:00",what:"Circumvesuviana naar Pompei",type:"transport"},{time:"09:00",what:"Pompei ruines rondleiding"},{time:"12:00",what:"Lunch bij Pompei",type:"food"},{time:"13:00",what:"Trein naar Sorrento of bus naar kust",type:"transport"},{time:"15:00",what:"Aankomst Positano of Amalfi"},{time:"15:30",what:"Inchecken B&B"},{time:"16:00",what:"Strand of dorp verkennen"},{time:"19:00",what:"Diner zeevruchten met uitzicht",type:"food"}]},
{day:10,title:"Amalfikust en terug",cityId:"ama",hotel:"Geen",morning:["Ravello of Sentiero degli Dei","Limoncello proeven"],afternoon:["Terug naar Napels","Luchthaven"],evening:"Arrivederci Italia",schedule:[{time:"08:30",what:"Ontbijt met uitzicht"},{time:"09:30",what:"Ravello tuinen of Sentiero degli Dei start"},{time:"12:00",what:"Limoncello proeven",type:"food"},{time:"13:00",what:"Lunch aan de kust",type:"food"},{time:"14:30",what:"Bus/boot naar Salerno",type:"transport"},{time:"15:30",what:"Trein naar Napels",type:"transport"},{time:"16:30",what:"Aankomst luchthaven"},{time:"18:00+",what:"Vlucht naar huis"}]},
];

const INIT_MS:MustSee[]=[
{id:"1",title:"Sunset Ponte Vecchio",description:"Gouden uur over de Arno",done:false},
{id:"2",title:"Pompei ochtendlicht",description:"Magisch zonder drukte",done:false},
{id:"3",title:"Burano kleuren",description:"Fotogeniekste plek",done:false},
{id:"4",title:"Sentiero degli Dei",description:"Wandelen boven wolken",done:false},
{id:"5",title:"Spritz bij Arena",description:"Aperitivo Romeins uitzicht",done:false},
];

const EMERG:Record<string,string>={"Algemeen":"112","Politie":"113","Ambulance":"118","Wegenwacht":"+39 803 116","NL Ambassade":"+39 06 3228 6001"};
const PHRASES:Record<string,string>={"Hallo":"Ciao","Goedemorgen":"Buongiorno","Dank je":"Grazie","Alsjeblieft":"Per favore","Sorry":"Mi scusi","Hoeveel kost dit?":"Quanto costa?","De rekening":"Il conto, per favore","Waar is...?":"Dove si trova...?","Ik ben verdwaald":"Mi sono perso/a","Mag ik water?":"Posso avere dell\'acqua?","Lekker!":"Buonissimo!","Proost!":"Salute!","Ik spreek geen Italiaans":"Non parlo italiano","Links/rechts":"Sinistra/destra","Station":"La stazione"};
const PACK:Record<string,string[]>={"ven":["Comfortabele wandelschoenen","Vaporetto dagpas kopen","Waterfles vullen","Powerbank opladen"],"gar":["Zwemkleding","Zonnebrand","Camera","Navigarda app checken"],"ver":["Verona Card kopen","Comfy schoenen","Cash voor gelato"],"tos":["Uffizi tickets checken","Auto huren bevestiging","ZTL zones vermijden","Zonnebrand"],"nap":["Cash! Veel plekken geen pin","Rugzak VOOR dragen","Pompei tickets","Waterfles"],"ama":["Goede wandelschoenen!","2L water meenemen","Zonnebrand","SITA bus kaartjes","Zwemkleding"],"apu":["Wandelschoenen","Auto tanken","Jas voor bergen","Water + snacks"]};
const START_DATE=new Date("2026-04-17");
const dayDate=(n:number)=>{const d=new Date(START_DATE);d.setDate(d.getDate()+n-1);return d.toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"});};
const uid=()=>Math.random().toString(36).slice(2,8);

function useSB<T extends {id:string}>(table:string,init:T[]):[T[],(v:T[]|((_:T[])=>T[]))=>void,()=>Promise<void>]{
  const[v,setV]=useState<T[]>(init);
  const load=useCallback(async()=>{const{data}=await supabase.from(table).select("*").order("created_at",{ascending:true});if(data)setV(data as T[])},[table]);
  useEffect(()=>{load()},[load]);
  const set=(x:T[]|((_:T[])=>T[]))=>{setV(p=>typeof x==="function"?(x as((_:T[])=>T[]))(p):x)};
  return[v,set,load];
}

export default function Page(){
  const[sbDays,setSbDays]=useState<SBDay[]>([]);
  const[editingDay,setEditingDay]=useState<string|null>(null);
  const[dayForm,setDayForm]=useState({title:"",city_id:"",hotel:"",hotel_url:"",morning:"",afternoon:"",evening:""});
  const loadDays=useCallback(async()=>{const{data}=await supabase.from("travel_days").select("*").order("day_num",{ascending:true});if(data&&data.length>0)setSbDays(data as SBDay[]);else{const seed=DAYS.map((d,i)=>({day_num:i+1,title:d.title,city_id:d.cityId,hotel:d.hotel,hotel_url:d.hotelUrl||null,morning:d.morning,afternoon:d.afternoon,evening:d.evening}));await supabase.from("travel_days").insert(seed);const{data:d2}=await supabase.from("travel_days").select("*").order("day_num",{ascending:true});if(d2)setSbDays(d2 as SBDay[])}},[]);
  useEffect(()=>{loadDays()},[loadDays]);
  const[selDay,setSelDay]=useState<number|null>(null);
  const[cityId,setCityId]=useState<string|null>(null);
  const[view,setView]=useState<"plan"|"city"|"ms"|"td"|"hotels">("plan");
  const[ms,setMs,reloadMs]=useSB<MustSee>("travel_mustsee",INIT_MS);
  const[todos,setTodos,reloadTd]=useSB<Todo>("travel_todos",[]);
  const[showAdd,setShowAdd]=useState(false);
  const[addTd,setAddTd]=useState(false);
  const[form,setForm]=useState({t:"",d:"",l:"",i:""});
  const[tdTxt,setTdTxt]=useState("");
  const[showE,setShowE]=useState(false);
  const[mapQ,setMapQ]=useState("");const[ctab,setCtab]=useState<"do"|"eat"|"viral"|"move"|"history"|"info"|"notes">("do");
  const[showCities,setShowCities]=useState(false);
  const[showHotels,setShowHotels]=useState(false);
  const[cpois,setCpois,reloadPoi]=useSB<CustomPOI>("travel_custom_pois",[]);
  const[addPoi,setAddPoi]=useState<string|null>(null);
  const[expanded,setExpanded]=useState<Record<string,boolean>>({});
  const[selPoi,setSelPoi]=useState<string|null>(null);
  const[editing,setEditing]=useState<string|null>(null);
  const[dragIdx,setDragIdx]=useState<{block:number,idx:number}|null>(null);
  const[dragStop,setDragStop]=useState<number|null>(null);
  const[dragDay,setDragDay]=useState<number|null>(null);
  const[editDesc,setEditDesc]=useState("");
  const[hotelLoc,setHotelLoc]=useState("");
  const[editImg,setEditImg]=useState("");
  const[notes,setNotes,reloadNotes]=useSB<Note>("travel_notes",[]);
  const[addNote,setAddNote]=useState(false);
  const[noteForm,setNoteForm]=useState({t:"",c:""});
  const[poiName,setPoiName]=useState("");
  const[poiCat,setPoiCat]=useState<"cultuur"|"eten"|"tiktok"|"overig">("cultuur");
  const city=cityId?C.find(c=>c.id===cityId):null;
  useEffect(()=>{if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js")},[]);
  const openC=(id:string)=>{const c2=C.find(x=>x.id===id);setCityId(id);setView("city");setCtab("do");setShowCities(false);setMapQ(c2?c2.name+", Italy":"")};
  const inp:React.CSSProperties={background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px",color:"var(--text)",fontSize:14,fontFamily:"var(--sans)",outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div className="layout">
      <aside className="sidebar">
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"inline-block",background:"var(--accent)",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:3,padding:"2px 12px",borderRadius:"var(--r)",marginBottom:8,textTransform:"uppercase"}}>2026</div>
          <h1 style={{fontFamily:"var(--sans)",fontSize:22,fontWeight:700,lineHeight:1.1,letterSpacing:-0.5}}>Italia</h1>
          <p style={{fontSize:11,color:"var(--text3)",marginTop:4}}>Tein & Tessa</p>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:10,fontWeight:700,color:"var(--text3)",letterSpacing:2,textTransform:"uppercase"}}>{sbDays.length} Dagen</span>
            <span style={{fontSize:9,color:"var(--text3)"}}>17 apr — {dayDate(sbDays.length)}</span>
          </div>
          {sbDays.map((d,idx)=>{const ct=C.find(x=>x.id===d.city_id);const sel=selDay===d.day_num&&view==="plan";return(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 6px",borderRadius:10,background:sel?"var(--accent2)":"transparent",marginBottom:2,transition:"all .15s"}}>
              <div style={{display:"flex",flexDirection:"column",gap:1,flexShrink:0}}>
                {idx>0?<button onClick={async e=>{e.stopPropagation();const prev2=sbDays[idx-1];await supabase.from("travel_days").update({day_num:d.day_num}).eq("id",prev2.id);await supabase.from("travel_days").update({day_num:prev2.day_num}).eq("id",d.id);await loadDays();setSelDay(prev2.day_num)}} style={{background:"var(--bg3)",border:"none",color:"var(--text2)",fontSize:10,cursor:"pointer",padding:"2px 6px",borderRadius:4,lineHeight:1}}>▲</button>:<div style={{height:10}}/>}
                {idx<sbDays.length-1?<button onClick={async e=>{e.stopPropagation();const next2=sbDays[idx+1];await supabase.from("travel_days").update({day_num:d.day_num}).eq("id",next2.id);await supabase.from("travel_days").update({day_num:next2.day_num}).eq("id",d.id);await loadDays();setSelDay(next2.day_num)}} style={{background:"var(--bg3)",border:"none",color:"var(--text2)",fontSize:10,cursor:"pointer",padding:"2px 6px",borderRadius:4,lineHeight:1}}>▼</button>:<div style={{height:10}}/>}
              </div>
              <span style={{width:22,height:22,borderRadius:7,background:sel?"var(--accent)":ct?.color||"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:"#fff",flexShrink:0}}>{d.day_num}</span>
              {editingDay==="sb-"+d.id?(<input autoFocus value={dayForm.title} onChange={e=>setDayForm({...dayForm,title:e.target.value})} onBlur={async()=>{if(dayForm.title){await supabase.from("travel_days").update({title:dayForm.title}).eq("id",d.id);await loadDays()}setEditingDay(null)}} onKeyDown={async e=>{if(e.key==="Enter"&&dayForm.title){await supabase.from("travel_days").update({title:dayForm.title}).eq("id",d.id);await loadDays();setEditingDay(null)}if(e.key==="Escape")setEditingDay(null)}} style={{flex:1,fontSize:11,fontWeight:600,border:"1px solid var(--accent)",borderRadius:4,padding:"2px 6px",outline:"none",background:"var(--bg2)",color:"var(--text)",fontFamily:"var(--sans)",minWidth:0}}/>):(
              <div onClick={()=>{setSelDay(sel?null:d.day_num);setView("plan");setCityId(null)}} onDoubleClick={e=>{e.stopPropagation();setEditingDay("sb-"+d.id);setDayForm({...dayForm,title:d.title})}} style={{flex:1,minWidth:0,cursor:"pointer"}}>
                <div style={{fontSize:11,fontWeight:sel?600:400,color:sel?"var(--text)":"var(--text2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.title}</div>
                <div style={{fontSize:9,color:"var(--text3)"}}>{dayDate(d.day_num)}</div>
              </div>)}
              <button onClick={async e=>{e.stopPropagation();if(!confirm("Dag "+d.day_num+" verwijderen?"))return;await supabase.from("travel_days").delete().eq("id",d.id);const rest=sbDays.filter(x=>x.id!==d.id);for(let i=0;i<rest.length;i++){await supabase.from("travel_days").update({day_num:i+1}).eq("id",rest[i].id)}await loadDays();if(selDay===d.day_num)setSelDay(null)}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",padding:"2px 4px",flexShrink:0,opacity:0.3}}>x</button>
            </div>
          )})}
          <button onClick={async()=>{const num=sbDays.length+1;await supabase.from("travel_days").insert({day_num:num,title:"Nieuwe dag",city_id:C[0].id,hotel:"",morning:[],afternoon:[],evening:""});await loadDays()}} style={{width:"100%",padding:"7px 10px",borderRadius:10,border:"1px dashed var(--border)",background:"transparent",color:"var(--text3)",fontSize:11,cursor:"pointer",marginTop:4}}>+ Dag toevoegen</button>
        </div>

        <div style={{marginBottom:16}}>
          <button onClick={()=>setShowCities(!showCities)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderRadius:"var(--r)",border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:12,fontFamily:"var(--sans)"}}>
            <span style={{fontWeight:600}}>Steden</span><span style={{color:"var(--text3)"}}>{showCities?"\u25B2":"\u25BC"}</span>
          </button>
          {showCities&&C.map(c=>(
            <button key={c.id} onClick={()=>openC(c.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:"none",background:cityId===c.id?"rgba(196,112,75,0.1)":"transparent",color:"var(--text)",cursor:"pointer",textAlign:"left",fontFamily:"var(--sans)",borderRadius:8,marginTop:2}}>
              <span style={{width:8,height:8,borderRadius:4,background:c.color,flexShrink:0}}/>
              <span style={{fontSize:12}}>{c.name}</span>
              <span style={{fontSize:10,color:"var(--text3)",marginLeft:"auto"}}>{c.region}</span>
            </button>
          ))}
        </div>

        <div style={{marginBottom:16}}>
          <button onClick={()=>setShowHotels(!showHotels)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderRadius:"var(--r)",border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:12,fontFamily:"var(--sans)"}}>
            <span style={{fontWeight:600}}>Overnachtingen</span><span style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,color:"var(--text3)"}}>{sbDays.filter(dy=>dy.hotel).length}</span><span style={{color:"var(--text3)"}}>{showHotels?"\u25B2":"\u25BC"}</span></span>
          </button>
          {showHotels&&<div style={{marginTop:4}}>
            {sbDays.map(dy=>{const ct2=C.find(x2=>x2.id===dy.city_id);const booked=notes.some(n=>n.title==="booked:"+dy.id);const hNote=notes.find(n=>n.title==="hnote:"+dy.id);return <div key={dy.id} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,marginBottom:4,padding:"8px 10px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:18,height:18,borderRadius:6,background:ct2?.color||"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,color:"#fff",flexShrink:0}}>{dy.day_num}</span>
                <button onClick={async()=>{if(booked){const bn=notes.find(n=>n.title==="booked:"+dy.id);if(bn){await supabase.from("travel_notes").delete().eq("id",bn.id);await reloadNotes()}}else{await supabase.from("travel_notes").insert({city_id:dy.city_id,title:"booked:"+dy.id,content:"1"});await reloadNotes()}}} style={{width:16,height:16,borderRadius:4,border:booked?"none":"1.5px solid var(--border)",background:booked?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:10,color:"#fff"}}>{booked?"\u2713":""}</button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--text)"}}>{dayDate(dy.day_num)} <span style={{fontWeight:400,color:"var(--text3)",fontSize:10}}>{ct2?.name||""}</span></div>
                </div>
                {dy.hotel?<a href={dy.hotel_url||"https://maps.google.com/?q="+encodeURIComponent(dy.hotel+", Italy")} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:9,color:"var(--accent)",textDecoration:"none",flexShrink:0}}>Maps</a>:null}
              </div>
              {editingDay==="sh-"+dy.id?<div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
                <input autoFocus value={dayForm.hotel} onChange={e=>setDayForm({...dayForm,hotel:e.target.value})} placeholder="Hotelnaam of adres..." style={{fontSize:11,border:"1px solid var(--accent)",borderRadius:6,padding:"5px 8px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)",width:"100%"}}/>
                <input value={hotelLoc} onChange={e=>setHotelLoc(e.target.value)} placeholder="Locatie / stad (vrij invullen)" style={{fontSize:10,border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",outline:"none",background:"var(--bg)",color:"var(--text2)",fontFamily:"var(--sans)",width:"100%"}}/>
                <textarea value={dayForm.evening} onChange={e=>setDayForm({...dayForm,evening:e.target.value})} placeholder="Notitie (boekingsnr, wifi, check-in...)" style={{fontSize:10,border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",outline:"none",background:"var(--bg)",color:"var(--text2)",fontFamily:"var(--sans)",width:"100%",minHeight:36,resize:"vertical"}}/>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={async()=>{await supabase.from("travel_days").update({hotel:dayForm.hotel,hotel_url:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(dayForm.hotel+", Italy")}).eq("id",dy.id);const noteContent=JSON.stringify({loc:hotelLoc||"",note:dayForm.evening||""});const ex=notes.find(n2=>n2.title==="hnote:"+dy.id);if(ex){await supabase.from("travel_notes").update({content:noteContent}).eq("id",ex.id)}else if(hotelLoc||dayForm.evening){await supabase.from("travel_notes").insert({city_id:dy.city_id,title:"hnote:"+dy.id,content:noteContent})}await loadDays();await reloadNotes();setEditingDay(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:6,padding:"4px 12px",fontSize:10,cursor:"pointer",flex:1}}>Opslaan</button>
                  <button onClick={()=>setEditingDay(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button>
                </div>
              </div>:<div onClick={()=>{const parsed=hNote?JSON.parse(hNote.content):{loc:"",note:""};setEditingDay("sh-"+dy.id);setDayForm({...dayForm,hotel:dy.hotel||"",evening:parsed.note||""});setHotelLoc(parsed.loc||"")}} style={{cursor:"pointer",marginTop:4}}>
                {dy.hotel?<div style={{fontSize:11,color:"var(--text)",fontWeight:500}}>{dy.hotel}</div>:<div style={{fontSize:10,color:"var(--text3)",fontStyle:"italic"}}>Klik om hotel in te vullen</div>}
                {hNote&&JSON.parse(hNote.content).loc?<div style={{fontSize:9,color:"var(--text3)"}}>{"\u2022 "+JSON.parse(hNote.content).loc}</div>:null}
                {hNote&&JSON.parse(hNote.content).note?<div style={{fontSize:9,color:"var(--text2)",fontStyle:"italic",marginTop:1}}>{JSON.parse(hNote.content).note}</div>:null}
              </div>}
            </div>})}
          </div>}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:12}}>
          <button onClick={()=>{setView("ms");setCityId(null)}} style={{flex:1,padding:"10px 8px",borderRadius:"var(--r)",border:view==="ms"?"1px solid var(--accent)":"1px solid var(--border)",background:view==="ms"?"var(--accent3)":"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:11,fontFamily:"var(--sans)"}}>Must-See<br/><span style={{fontSize:10,color:"var(--text3)"}}>{ms.filter(m=>!m.done).length}</span></button>
          <button onClick={()=>{setView("td");setCityId(null)}} style={{flex:1,padding:"10px 8px",borderRadius:"var(--r)",border:view==="td"?"1px solid var(--accent)":"1px solid var(--border)",background:view==="td"?"var(--accent3)":"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:11,fontFamily:"var(--sans)"}}>To-Do<br/><span style={{fontSize:10,color:"var(--text3)"}}>{todos.filter(t=>!t.done).length}</span></button>
        </div>

        <button onClick={()=>setShowE(!showE)} style={{width:"100%",background:"var(--accent3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--accent)",fontSize:11,cursor:"pointer",textAlign:"left"}}>{"Noodnummers "+(showE?"\u25B2":"\u25BC")}</button>
        {showE&&<div style={{padding:"8px 0"}}>{Object.entries(EMERG).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 10px"}}><span style={{fontSize:10,color:"var(--text2)"}}>{k}</span><a href={"tel:"+v.replace(/\s/g,"")} style={{fontSize:11,color:"var(--accent)",textDecoration:"none"}}>{v}</a></div>)}</div>}
      </aside>

      <main className="main">
        {view==="plan"&&!selDay&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <h2 style={{fontFamily:"var(--sans)",fontSize:22,fontWeight:400,marginBottom:4}}>Reisplanning</h2>
            <p style={{fontSize:13,color:"var(--text2)",marginBottom:24}}>Selecteer een dag om details te zien.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
              {sbDays.map(d=>{const ct=C.find(x=>x.id===d.city_id);return(
                <button key={d.id} onClick={()=>setSelDay(d.day_num)} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:16,cursor:"pointer",color:"var(--text)",textAlign:"left",fontFamily:"var(--sans)",boxShadow:"var(--shadow)",transition:"box-shadow .2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{background:"var(--accent2)",color:"var(--accent)",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:8}}>DAG {d.day_num}</span>
                    <span style={{fontSize:9,color:"var(--text3)"}}>{dayDate(d.day_num)}</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{d.title}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{ct?.name||"?"}</div>
                  {(()=>{const prev2=sbDays.find(x=>x.day_num===d.day_num-1);const prevCt=prev2?C.find(x=>x.id===prev2.city_id):null;const KM2:Record<string,Record<string,{km:number,t:string}>>={ven:{gar:{km:180,t:"2u30"},ver:{km:120,t:"1u30"},tos:{km:260,t:"3u"},apu:{km:350,t:"4u"}},gar:{ver:{km:65,t:"45min"},apu:{km:280,t:"3u30"},tos:{km:200,t:"2u30"},ven:{km:180,t:"2u30"}},ver:{tos:{km:230,t:"2u30"},gar:{km:65,t:"45min"},ven:{km:120,t:"1u30"},apu:{km:200,t:"2u30"}},tos:{nap:{km:470,t:"4u30"},ver:{km:230,t:"2u30"},apu:{km:120,t:"1u30"}},apu:{tos:{km:120,t:"1u30"},ver:{km:200,t:"2u30"},gar:{km:280,t:"3u30"}},nap:{ama:{km:65,t:"1u15"},tos:{km:470,t:"4u30"}},ama:{nap:{km:65,t:"1u15"}}};const dist2=prevCt&&prevCt.id!==d.city_id?KM2[prevCt.id]?.[d.city_id]:null;return dist2?<div style={{fontSize:10,color:"var(--accent)",marginTop:4}}>{dist2.km} km — {dist2.t}</div>:null})()}
                </button>
              )})}
            </div>
          </div>
        )}

        {view==="plan"&&selDay&&(()=>{const sd=sbDays.find(x=>x.day_num===selDay);if(!sd)return null;const d={...sd,day:sd.day_num,cityId:sd.city_id,hotelUrl:sd.hotel_url};const c=C.find(x=>x.id===d.cityId)!;
          
          return(
          <div style={{animation:"fadeUp .3s ease"}}>
            {/* Header - compact */}
            <button onClick={()=>setSelDay(null)} style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,cursor:"pointer",padding:"0 0 8px",fontFamily:"var(--sans)",display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:14}}>←</span> Reisplanning
            </button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"var(--accent)"}}>Dag {d.day} / {sbDays.length} — {dayDate(d.day)}</div>
                {editingDay===sd.id?(<div style={{display:"flex",gap:6,marginTop:4}}>
                  <input value={dayForm.title} onChange={e=>setDayForm({...dayForm,title:e.target.value})} style={{...inp,fontSize:16,fontWeight:700,padding:"4px 8px"}}/>
                  <button onClick={async()=>{await supabase.from("travel_days").update({title:dayForm.title}).eq("id",sd.id);await loadDays();setEditingDay(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",fontSize:12,cursor:"pointer"}}>OK</button>
                  <button onClick={()=>setEditingDay(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 8px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button>
                </div>):(<h2 onClick={()=>{setEditingDay(sd.id);setDayForm({...dayForm,title:sd.title})}} style={{fontSize:20,fontWeight:700,letterSpacing:-0.3,cursor:"pointer"}} title="Klik om te bewerken">{d.title}</h2>)}
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button onClick={()=>openC(c.id)} style={{fontSize:12,color:"var(--accent)",background:"var(--accent2)",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:600,fontFamily:"var(--sans)"}}>{c.name}</button>
                {sbDays.length>1&&<button onClick={async()=>{if(!confirm("Dag verwijderen?"))return;await supabase.from("travel_days").delete().eq("id",sd.id);const remaining=sbDays.filter(x=>x.id!==sd.id);for(let i=0;i<remaining.length;i++){await supabase.from("travel_days").update({day_num:i+1}).eq("id",remaining[i].id)}await loadDays();setSelDay(null)}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--text3)",fontSize:11,cursor:"pointer"}}>Verwijder</button>}
                {d.day>1&&<button onClick={async()=>{const prev=sbDays.find(x=>x.day_num===d.day-1);if(!prev)return;await supabase.from("travel_days").update({day_num:d.day}).eq("id",prev.id);await supabase.from("travel_days").update({day_num:d.day-1}).eq("id",sd.id);await loadDays();setSelDay(d.day-1)}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 8px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>↑</button>}
                {d.day<sbDays.length&&<button onClick={async()=>{const next=sbDays.find(x=>x.day_num===d.day+1);if(!next)return;await supabase.from("travel_days").update({day_num:d.day}).eq("id",next.id);await supabase.from("travel_days").update({day_num:d.day+1}).eq("id",sd.id);await loadDays();setSelDay(d.day+1)}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 8px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>↓</button>}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
              <a href={d.hotelUrl||`https://maps.google.com/?q=${encodeURIComponent(d.hotel+", Italy")}`} target="_blank" rel="noreferrer" style={{flex:"0 0 auto",display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,background:"var(--bg2)",border:"1px solid var(--border)",boxShadow:"var(--shadow)",color:"var(--text)",textDecoration:"none",fontSize:11,fontWeight:500}}>Navigeer</a>
              <a href="https://translate.google.com/?sl=nl&tl=it" target="_blank" rel="noreferrer" style={{flex:"0 0 auto",display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,background:"var(--bg2)",border:"1px solid var(--border)",boxShadow:"var(--shadow)",color:"var(--text)",textDecoration:"none",fontSize:11,fontWeight:500}}>Vertalen</a>
              <a href="tel:112" style={{flex:"0 0 auto",padding:"6px 12px",borderRadius:20,background:"var(--bg2)",border:"1px solid var(--border)",boxShadow:"var(--shadow)",color:"var(--text)",textDecoration:"none",fontSize:11,fontWeight:500}}>112</a>
              <a href={"https://www.google.com/search?q=weer+"+c.name+"+Italy"} target="_blank" rel="noreferrer" style={{flex:"0 0 auto",padding:"6px 12px",borderRadius:20,background:"var(--bg2)",border:"1px solid var(--border)",boxShadow:"var(--shadow)",color:"var(--text)",textDecoration:"none",fontSize:11,fontWeight:500}}>Weer</a>
            </div>

            {/* Route */}
            {(()=>{const R:Record<string,{stops:string[],km:string,hrs:string}>={
              "Aankomst Venetie":{stops:["Schiphol","Marco Polo","Venetie"],km:"1600",hrs:"2u30"},
              "Venetie naar Gardameer":{stops:["Venetie","Verona","Gardameer"],km:"180",hrs:"2u30"},
              "Venetie en Verona":{stops:["Venetie","Verona","Gardameer"],km:"180",hrs:"3u"},
              "Gardameer en Apuaanse Alpen":{stops:["Gardameer","Sirmione","Apuaanse Alpen"],km:"280",hrs:"3u30"},
              "Gardameer naar Verona":{stops:["Gardameer","Verona"],km:"65",hrs:"45min"},
              "Verona naar Toscane":{stops:["Verona","Bologna","Firenze"],km:"230",hrs:"2u30"},
              "Toscane naar Napels":{stops:["Firenze","Roma","Napels"],km:"470",hrs:"4u30"},
              "Amalfikust en terug":{stops:["Amalfi","Napels","Luchthaven"],km:"80",hrs:"1u30"},
            };const r=R[d.title];return r?(<div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"14px 18px",marginBottom:16,boxShadow:"var(--shadow)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:10,fontWeight:700,color:"var(--text3)",letterSpacing:1,textTransform:"uppercase"}}>Rijschema</span>
                <span style={{fontSize:12,color:"var(--text2)"}}>{r.km} km — {r.hrs}</span>
              </div>
              <div style={{display:"flex",alignItems:"center"}}>
                {r.stops.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",flex:i<r.stops.length-1?1:"0 0 auto"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                    <div style={{width:i===0||i===r.stops.length-1?12:8,height:i===0||i===r.stops.length-1?12:8,borderRadius:"50%",background:i===0?"var(--accent)":i===r.stops.length-1?"#22c55e":"var(--bg4)",border:i===0?"2px solid var(--accent)":i===r.stops.length-1?"2px solid #22c55e":"2px solid var(--text3)"}}/>
                    <div style={{fontSize:i===0||i===r.stops.length-1?10:9,color:i===0||i===r.stops.length-1?"var(--text)":"var(--text3)",marginTop:4,whiteSpace:"nowrap",fontWeight:i===0||i===r.stops.length-1?600:400}}>{s}</div>
                  </div>
                  {i<r.stops.length-1&&<div style={{flex:1,height:2,background:"linear-gradient(90deg, var(--accent), var(--bg4))",margin:"0 6px",marginBottom:18,borderRadius:1}}/>}
                </div>))}
              </div>
            </div>):null})()}

            {(()=>{const prev=sbDays.find(x=>x.day_num===d.day-1);const prevC=prev?C.find(x=>x.id===prev.city_id):null;
              const KM:Record<string,Record<string,{km:number,t:string}>>={ven:{gar:{km:180,t:"2u30"},ver:{km:120,t:"1u30"},tos:{km:260,t:"3u"},apu:{km:350,t:"4u"}},gar:{ver:{km:65,t:"45min"},apu:{km:280,t:"3u30"},tos:{km:200,t:"2u30"},ven:{km:180,t:"2u30"}},ver:{tos:{km:230,t:"2u30"},gar:{km:65,t:"45min"},ven:{km:120,t:"1u30"},apu:{km:200,t:"2u30"}},tos:{nap:{km:470,t:"4u30"},ver:{km:230,t:"2u30"},apu:{km:120,t:"1u30"}},apu:{tos:{km:120,t:"1u30"},ver:{km:200,t:"2u30"},gar:{km:280,t:"3u30"}},nap:{ama:{km:65,t:"1u15"},tos:{km:470,t:"4u30"}},ama:{nap:{km:65,t:"1u15"}}};
              const isTravel=prevC&&prevC.id!==c.id;
              const dist=isTravel&&prevC?KM[prevC.id]?.[c.id]:null;
              const stops=d.title.includes(" - ")?d.title.split(" - ").map((x:string)=>x.trim()):isTravel&&prevC?[prevC.name,c.name]:[c.name];
              return <div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"12px 16px",marginBottom:16,boxShadow:"var(--shadow)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:10,fontWeight:700,color:"var(--text3)",letterSpacing:1,textTransform:"uppercase"}}>{isTravel?"Reisschema":"Locatie"}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {dist?<span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{dist.km} km — {dist.t}</span>:null}
                    <button onClick={()=>{setEditingDay(editingDay==="route"?null:"route");setDayForm({...dayForm,title:d.title})}} style={{fontSize:9,color:"var(--accent)",background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 8px",cursor:"pointer"}}>{editingDay==="route"?"x":"Wijzig"}</button>
                  </div>
                </div>
                {editingDay==="route"?<div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--text3)"}}>Stops (klik om te verwijderen)</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                    {dayForm.title.split(" - ").filter(Boolean).map((st2:string,si2:number)=><div key={si2} style={{display:"flex",alignItems:"center",gap:2}}>
                      {si2>0&&<span style={{fontSize:10,color:"var(--text3)"}}>→</span>}
                      <button onClick={()=>{const arr=dayForm.title.split(" - ").filter(Boolean);arr.splice(si2,1);setDayForm({...dayForm,title:arr.join(" - ")})}} style={{fontSize:11,padding:"4px 10px",borderRadius:16,background:"var(--accent2)",border:"1px solid var(--accent)",color:"var(--accent)",cursor:"pointer",fontWeight:600,fontFamily:"var(--sans)",display:"flex",alignItems:"center",gap:4}}>{st2.trim()} <span style={{fontSize:9}}>✕</span></button>
                    </div>)}
                    {dayForm.title&&<span style={{fontSize:10,color:"var(--text3)"}}>→ ?</span>}
                  </div>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--text3)"}}>Voeg stop toe</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {["Venetie","Verona","Gardameer","Apuaanse Alpen","Florence","Siena","San Gimignano","Rome","Napoli","Pompeii","Amalfikust","Positano","Sorrento"].filter(s3=>!dayForm.title.includes(s3)).map(s2=><button key={s2} onClick={()=>setDayForm({...dayForm,title:dayForm.title?(dayForm.title+" - "+s2):s2})} style={{fontSize:10,padding:"4px 10px",borderRadius:16,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--sans)"}}>{s2}</button>)}
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={async()=>{await supabase.from("travel_days").update({title:dayForm.title}).eq("id",sd.id);await loadDays();setEditingDay(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:600,flex:1}}>Opslaan</button>
                    <button onClick={()=>setEditingDay(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>Annuleer</button>
                  </div>
                </div>:<div style={{display:"flex",alignItems:"center"}}>{stops.map((st:string,si:number)=><div key={si} style={{display:"flex",alignItems:"center",flex:si<stops.length-1?1:"0 0 auto"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}><div style={{width:si===0||si===stops.length-1?12:8,height:si===0||si===stops.length-1?12:8,borderRadius:"50%",background:si===0?"var(--accent)":si===stops.length-1?"#22c55e":"var(--bg4)",border:"2px solid "+(si===0?"var(--accent)":si===stops.length-1?"#22c55e":"var(--text3)")}}/><div style={{fontSize:10,color:si===0||si===stops.length-1?"var(--text)":"var(--text3)",marginTop:4,whiteSpace:"nowrap",fontWeight:si===0||si===stops.length-1?600:400}}>{st}</div></div>{si<stops.length-1?<div style={{flex:1,height:2,background:"var(--bg4)",margin:"0 6px",marginBottom:18,borderRadius:1}}/>:null}</div>)}</div>}
              </div>})()}

            {/* Map */}
            <div style={{borderRadius:"var(--r2)",overflow:"hidden",marginBottom:20,border:"1px solid var(--border)",boxShadow:"var(--shadow2)"}}>
              <iframe style={{width:"100%",height:280,border:"none",display:"block"}} loading="lazy" src={mapQ?`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapQ)}`:`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${c.lat},${c.lng}&zoom=${c.zoom}&maptype=roadmap`} allowFullScreen />
            </div>

            {/* Planning toggle */}
            <button onClick={()=>setExpanded(p=>({...p,plan:!p.plan}))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",cursor:"pointer",fontFamily:"var(--sans)",boxShadow:"var(--shadow)",marginBottom:expanded.plan?0:16}}>
              <span style={{fontSize:13,fontWeight:600}}>Dagplanning</span>
              <span style={{fontSize:11,color:"var(--text3)"}}>{expanded.plan?"▲":"▼"}</span>
            </button>
            {expanded.plan&&<div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 var(--r) var(--r)",boxShadow:"var(--shadow)",marginBottom:16,overflow:"hidden"}}>
              <div style={{display:"flex",flexDirection:typeof window!=="undefined"&&window.innerWidth<600?"column":"row"}}>
                <div style={{flex:1,padding:"14px 16px",borderRight:"1px solid var(--border)"}}>
                  {(()=>{
                    const blocks=[
                      {key:"morning",time:"08:00",label:"Ochtend",items:sd.morning||[],color:"#f59e0b"},
                      {key:"afternoon",time:"13:00",label:"Middag",items:sd.afternoon||[],color:"var(--accent)"},
                      {key:"evening",time:"19:00",label:"Avond",items:sd.evening?sd.evening.split("|||"):[],color:"#6366f1"},
                    ];
                    const updateArr=async(key:string,arr:string[])=>{await supabase.from("travel_days").update({[key]:key==="evening"?arr.join("|||"):arr}).eq("id",sd.id);await loadDays()};
                    const deleteItem=(key:string,items:string[],idx:number)=>{const a=items.filter((_,i)=>i!==idx);updateArr(key,a)};
                    return blocks.map((block,bi)=>(
                      <div key={bi} style={{display:"flex",gap:10,marginBottom:12}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:32,flexShrink:0}}>
                          <div style={{fontSize:10,fontWeight:600,color:"var(--text3)"}}>{block.time}</div>
                          <div style={{width:2,flex:1,background:"var(--border)",marginTop:4}}/>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,fontWeight:600,color:block.color,letterSpacing:0.5,marginBottom:4,textTransform:"uppercase"}}>{block.label}</div>
                          {block.items.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 0",fontSize:12,borderBottom:"1px solid var(--border2)"}}>
                            <span style={{width:4,height:4,borderRadius:2,background:block.color,flexShrink:0,opacity:0.5}}/>
                            <span style={{flex:1}}>{a}</span>
                            <button onClick={()=>deleteItem(block.key,block.items,i)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button>
                          </div>)}
                          {editingDay==="add-"+bi?<div style={{display:"flex",gap:4,marginTop:4}}><input placeholder="Activiteit..." value={dayForm.title} onChange={e=>setDayForm({...dayForm,title:e.target.value})} onKeyDown={async e=>{if(e.key==="Enter"&&dayForm.title){await updateArr(block.key,[...block.items,dayForm.title]);setDayForm({...dayForm,title:""});setEditingDay(null)}}} style={{flex:1,fontSize:11,border:"1px solid var(--border)",borderRadius:6,padding:"3px 6px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)"}}/><button onClick={()=>setEditingDay(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button></div>:<button onClick={()=>{setEditingDay("add-"+bi);setDayForm({...dayForm,title:""})}} style={{fontSize:10,color:"var(--text3)",background:"none",border:"none",cursor:"pointer",padding:"3px 0"}}>+ toevoegen</button>}
                        </div>
                      </div>
                    ))})()}
                </div>
                <div style={{width:240,flexShrink:0,padding:"14px 16px"}}>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--text3)",marginBottom:8,textTransform:"uppercase"}}>Verblijf</div>
                  <div style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",marginBottom:8}}><iframe style={{width:"100%",height:100,border:"none",display:"block"}} loading="lazy" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(d.hotel+", Italy")}`}/></div>
                  <div style={{fontSize:13,fontWeight:600}}>{d.hotel||"Geen hotel"}</div>
                  <a href={d.hotelUrl||`https://maps.google.com/?q=${encodeURIComponent(d.hotel+", Italy")}`} target="_blank" rel="noreferrer" style={{fontSize:10,color:"var(--accent)",textDecoration:"none"}}>Open in Maps</a>
                </div>
              </div>
            </div>}

            {/* Content columns */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:12,marginBottom:24}}>
              {/* Cultuur */}
              <div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"12px 14px",boxShadow:"var(--shadow)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--text)",marginBottom:8,borderBottom:"2px solid var(--accent)",paddingBottom:4}}>Cultuur</div>
                {c.spots.filter(p=>!cpois.some(x=>x.cat==="hidden"&&x.name===p.name&&x.city_id===c.id)).map((p,i)=><div key={i} onClick={()=>{setSelPoi(selPoi==="s-"+c.id+"-"+i?null:"s-"+c.id+"-"+i);setMapQ(p.name+", "+c.name+", Italy")}} style={{padding:"4px 0",fontSize:12,cursor:"pointer",color:selPoi==="s-"+c.id+"-"+i?"var(--accent)":"var(--text)",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{p.name}</span><button onClick={e2=>{e2.stopPropagation();(async()=>{await supabase.from("travel_custom_pois").insert({name:p.name,cat:"hidden",city_id:c.id});await reloadPoi()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer",padding:0}}>x</button></div>)}
                {cpois.filter(p=>p.city_id===c.id&&p.cat==="cultuur").map(p2=><div key={p2.id} style={{padding:"4px 0",fontSize:12,color:"var(--accent)",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between"}}><span onClick={()=>setMapQ(p2.name+", "+c.name+", Italy")} style={{cursor:"pointer"}}>{p2.name}</span><button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",p2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button></div>)}
                {addPoi==="c-col"?<div style={{marginTop:4,display:"flex",flexDirection:"column",gap:4}}><input autoFocus placeholder="Naam..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"cultuur",city_id:c.id,description:form.d||""});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{fontSize:11,border:"1px solid var(--border)",borderRadius:6,padding:"4px 6px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)"}}/></div>:<button onClick={()=>setAddPoi("c-col")} style={{marginTop:4,fontSize:10,color:"var(--text3)",background:"none",border:"none",cursor:"pointer",padding:0}}>+ toevoegen</button>}
              </div>

              {/* Eten */}
              <div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"12px 14px",boxShadow:"var(--shadow)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--text)",marginBottom:8,borderBottom:"2px solid #f59e0b",paddingBottom:4}}>Eten & Drinken</div>
                {c.restaurants.filter(r=>!cpois.some(x=>x.cat==="hidden"&&x.name===r.name&&x.city_id===c.id)).map((r,i)=><div key={i} onClick={()=>{setSelPoi(selPoi==="r-"+c.id+"-"+i?null:"r-"+c.id+"-"+i);setMapQ(r.name+", "+c.name+", Italy")}} style={{padding:"4px 0",fontSize:12,cursor:"pointer",color:selPoi==="r-"+c.id+"-"+i?"var(--accent)":"var(--text)",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{r.name} <span style={{fontSize:10,color:"var(--text3)"}}>{r.price}</span></span><button onClick={e2=>{e2.stopPropagation();(async()=>{await supabase.from("travel_custom_pois").insert({name:r.name,cat:"hidden",city_id:c.id});await reloadPoi()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer",padding:0}}>x</button></div>)}
                {cpois.filter(p=>p.city_id===c.id&&p.cat==="eten").map(p2=><div key={p2.id} style={{padding:"4px 0",fontSize:12,color:"var(--accent)",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between"}}><span onClick={()=>setMapQ(p2.name+", "+c.name+", Italy")} style={{cursor:"pointer"}}>{p2.name}</span><button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",p2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button></div>)}
                {addPoi==="e-col"?<div style={{marginTop:4}}><input autoFocus placeholder="Restaurant..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"eten",city_id:c.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{fontSize:11,border:"1px solid var(--border)",borderRadius:6,padding:"4px 6px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)",width:"100%"}}/></div>:<button onClick={()=>setAddPoi("e-col")} style={{marginTop:4,fontSize:10,color:"var(--text3)",background:"none",border:"none",cursor:"pointer",padding:0}}>+ toevoegen</button>}
              </div>

              {/* TikTok */}
              <div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"12px 14px",boxShadow:"var(--shadow)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--text)",marginBottom:8,borderBottom:"2px solid #6366f1",paddingBottom:4}}>TikTok</div>
                {c.viral.filter(v=>!cpois.some(x=>x.cat==="hidden"&&x.name===v.name&&x.city_id===c.id)).map((v,i)=><div key={i} onClick={()=>{setSelPoi(selPoi==="v-"+c.id+"-"+i?null:"v-"+c.id+"-"+i);setMapQ(v.name+", "+c.name+", Italy")}} style={{padding:"4px 0",fontSize:12,cursor:"pointer",color:selPoi==="v-"+c.id+"-"+i?"var(--accent)":"var(--text)",borderBottom:"1px solid var(--border2)"}}><span>{v.name}</span></div>)}
                {cpois.filter(p=>p.city_id===c.id&&p.cat==="tiktok").map(p2=><div key={p2.id} style={{padding:"4px 0",fontSize:12,color:"var(--accent)",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between"}}><span>{p2.name}</span><button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",p2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button></div>)}
                {addPoi==="t-col"?<div style={{marginTop:4}}><input autoFocus placeholder="Spot..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"tiktok",city_id:c.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{fontSize:11,border:"1px solid var(--border)",borderRadius:6,padding:"4px 6px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)",width:"100%"}}/></div>:<button onClick={()=>setAddPoi("t-col")} style={{marginTop:4,fontSize:10,color:"var(--text3)",background:"none",border:"none",cursor:"pointer",padding:0}}>+ toevoegen</button>}
              </div>

              {/* Vervoer + Tips */}
              <div style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"12px 14px",boxShadow:"var(--shadow)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--text)",marginBottom:8,borderBottom:"2px solid #22c55e",paddingBottom:4}}>Vervoer & Tips</div>
                {c.transport.map((t2,i)=><div key={"t"+i} style={{padding:"3px 0",fontSize:11,color:"var(--text2)"}}>{t2}</div>)}
                <div style={{borderTop:"1px solid var(--border)",marginTop:8,paddingTop:8}}>
                  {c.firstSteps.map((s2,i)=><div key={"s"+i} style={{padding:"3px 0",fontSize:11,color:"var(--text)",display:"flex",gap:4}}><span style={{color:"var(--accent)",fontWeight:600}}>{i+1}</span>{s2}</div>)}
                </div>
              </div>
            </div>

            {/* Selected POI detail */}
            {selPoi&&(selPoi.startsWith("s-")||selPoi.startsWith("r-")||selPoi.startsWith("v-"))&&(()=>{
              const type=selPoi[0];const idx=parseInt(selPoi.split("-")[2]);
              let name="",desc="",tip="",price="";
              if(type==="s"){const spots2=c.spots.filter(p=>!cpois.some(x=>x.cat==="hidden"&&x.name===p.name&&x.city_id===c.id));const p=spots2[idx];if(!p)return null;name=p.name;desc=p.desc;tip=p.tip||""}
              if(type==="r"){const rests=c.restaurants.filter(r=>!cpois.some(x=>x.cat==="hidden"&&x.name===r.name&&x.city_id===c.id));const r=rests[idx];if(!r)return null;name=r.name;desc=r.type;tip=r.tip||"";price=r.price}
              if(type==="v"){const virs=c.viral.filter(v=>!cpois.some(x=>x.cat==="hidden"&&x.name===v.name&&x.city_id===c.id));const v=virs[idx];if(!v)return null;name=v.name;desc=v.desc;tip=v.tag}
              const ov=cpois.find(x=>x.cat==="overlay"&&x.name===name&&x.city_id===c.id);
              const poiNote=notes.find(n=>n.title==="poi:"+name+":"+c.id);
              return <div onClick={()=>setSelPoi(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div onClick={e2=>e2.stopPropagation()} style={{background:"var(--bg2)",borderRadius:16,maxWidth:520,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",maxHeight:"90vh",overflowY:"auto"}}>
                  <div style={{display:"flex",height:200}}>
                    <iframe style={{flex:1,border:"none",display:"block",minWidth:0}} loading="lazy" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(name+", "+c.name+", Italy")}`}/>
                    {ov?.description&&ov.description.startsWith("data:image")?<img src={ov.description} style={{flex:1,objectFit:"cover",minWidth:0}} alt={name}/>:<img src={`https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${encodeURIComponent(name+", "+c.name+", Italy")}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`} style={{flex:1,objectFit:"cover",minWidth:0}} alt={name}/>}
                  </div>
                  <div style={{padding:"16px 20px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:18,fontWeight:700}}>{name}{price&&<span style={{fontWeight:400,color:"var(--accent)",fontSize:14,marginLeft:6}}>{price}</span>}</div>
                      <button onClick={()=>setEditing(editing===selPoi?null:selPoi)} style={{fontSize:11,color:"var(--accent)",background:"var(--accent2)",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600}}>{editing===selPoi?"Annuleer":"Bewerken"}</button>
                    </div>
                    <div style={{fontSize:13,color:"var(--text2)"}}>{desc}</div>
                    {tip&&<div style={{fontSize:12,color:"var(--accent)",marginTop:4}}>{tip}</div>}
                    {poiNote&&!editing&&<div style={{marginTop:10,padding:"10px 12px",background:"var(--bg)",borderRadius:8,border:"1px solid var(--border)"}}>
                      <div style={{fontSize:13,color:"var(--text)",whiteSpace:"pre-wrap"}}>{poiNote.content.includes("[IMG]")?poiNote.content.split("\n[IMG]")[0]:poiNote.content}</div>
                      {poiNote.content.includes("[IMG]")&&<img src={poiNote.content.split("[IMG]")[1]} style={{width:"100%",maxHeight:150,objectFit:"cover",borderRadius:8,marginTop:6}} alt=""/>}
                    </div>}
                    {editing===selPoi&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                      <textarea placeholder="Beschrijving, tips, links..." value={noteForm.c} onChange={e2=>setNoteForm({...noteForm,c:e2.target.value})} style={{...inp,fontSize:13,minHeight:60,resize:"vertical",padding:"8px 10px"}}/>
                      <div onDragOver={e2=>{e2.preventDefault();e2.currentTarget.style.borderColor="var(--accent)"}} onDragLeave={e2=>{e2.currentTarget.style.borderColor="var(--border)"}} onDrop={e2=>{e2.preventDefault();e2.currentTarget.style.borderColor="var(--border)";const file=e2.dataTransfer.files[0];if(file&&file.type.startsWith("image/")){const reader=new FileReader();reader.onload=ev=>{setNoteForm({...noteForm,t:ev.target?.result as string||""})};reader.readAsDataURL(file)}}} style={{border:"2px dashed var(--border)",borderRadius:10,padding:noteForm.t?"4px":"16px 12px",textAlign:"center",cursor:"pointer",transition:"border-color .2s",background:"var(--bg)"}}>
                        {noteForm.t?<div style={{position:"relative"}}><img src={noteForm.t} style={{width:"100%",maxHeight:120,objectFit:"cover",borderRadius:8}} alt=""/><button onClick={()=>setNoteForm({...noteForm,t:""})} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.5)",color:"#fff",border:"none",borderRadius:6,padding:"2px 8px",fontSize:11,cursor:"pointer"}}>x</button></div>:<div><div style={{fontSize:12,color:"var(--text3)"}}>Sleep een foto hierin</div><input type="file" accept="image/*" onChange={e2=>{const file=e2.target.files?.[0];if(file){const reader=new FileReader();reader.onload=ev=>{setNoteForm({...noteForm,t:ev.target?.result as string||""})};reader.readAsDataURL(file)}}} style={{fontSize:11,color:"var(--text2)",marginTop:4,width:"100%"}}/></div>}
                      </div>
                      <button onClick={()=>{const content=noteForm.t?noteForm.c+"\n[IMG]"+noteForm.t:noteForm.c;(async()=>{if(poiNote){await supabase.from("travel_notes").update({content}).eq("id",poiNote.id)}else if(content){await supabase.from("travel_notes").insert({city_id:c.id,title:"poi:"+name+":"+c.id,content})}await reloadNotes()})();setEditing(null);setNoteForm({t:"",c:""})}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600}}>Opslaan</button>
                    </div>}
                    {!editing&&<><div style={{marginTop:10}}>
                      <button onClick={()=>{setEditing(editing==="modal-note"?null:"modal-note");setEditDesc("")}} style={{width:"100%",padding:8,borderRadius:8,border:"1px dashed var(--border)",background:editing==="modal-note"?"var(--accent2)":"transparent",color:editing==="modal-note"?"var(--accent)":"var(--text3)",fontSize:12,cursor:"pointer"}}>{editing==="modal-note"?"Annuleer":"+ Beschrijving toevoegen"}</button>
                      {editing==="modal-note"&&<div style={{marginTop:8}}><textarea autoFocus placeholder="Jouw beschrijving, tips, ervaringen..." value={editDesc} onChange={e2=>setEditDesc(e2.target.value)} style={{width:"100%",fontSize:13,border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px",outline:"none",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--sans)",minHeight:60,resize:"vertical",boxSizing:"border-box"}}/><button onClick={()=>{if(!editDesc)return;(async()=>{await supabase.from("travel_notes").insert({city_id:c.id,title:"poi:"+c.id+":"+name,content:editDesc});await reloadNotes()})();setEditing(null)}} style={{marginTop:6,background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,cursor:"pointer",width:"100%"}}>Opslaan</button></div>}
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:12}}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name+", "+c.name+", Italy")}`} target="_blank" rel="noreferrer" style={{flex:1,textAlign:"center",fontSize:13,color:"#fff",textDecoration:"none",background:"var(--accent)",padding:"10px",borderRadius:10,fontWeight:600}}>Navigeer</a>
                      <button onClick={()=>setSelPoi(null)} style={{flex:1,fontSize:13,color:"var(--text2)",background:"var(--bg3)",border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontWeight:500}}>Sluiten</button>
                    </div></>}
                  </div>
                </div>
              </div>})()}

{/* Stadsinfo */}
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4,marginBottom:24}}>
              <button onClick={()=>setExpanded(p=>({...p,hist:!p.hist}))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:expanded["hist"]?"var(--r) var(--r) 0 0":"var(--r)",cursor:"pointer",fontFamily:"var(--sans)",boxShadow:"var(--shadow)"}}>
                <span style={{fontSize:14,fontWeight:600}}>Geschiedenis</span>
                <span style={{fontSize:12,color:"var(--text3)",transform:expanded["hist"]?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>{String.fromCharCode(9662)}</span>
              </button>
              {expanded["hist"]&&<div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 var(--r) var(--r)",padding:"16px 18px",boxShadow:"var(--shadow)",animation:"fadeUp .2s ease"}}><p style={{fontSize:14,lineHeight:1.8,color:"var(--text2)"}}>{c.history}</p></div>}

              <button onClick={()=>setExpanded(p=>({...p,budget:!p.budget}))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:expanded["budget"]?"var(--r) var(--r) 0 0":"var(--r)",cursor:"pointer",fontFamily:"var(--sans)",boxShadow:"var(--shadow)"}}>
                <span style={{fontSize:14,fontWeight:600}}>Budget & Veiligheid</span>
                <span style={{fontSize:12,color:"var(--text3)",transform:expanded["budget"]?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>{String.fromCharCode(9662)}</span>
              </button>
              {expanded["budget"]&&<div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 var(--r) var(--r)",padding:"16px 18px",boxShadow:"var(--shadow)",animation:"fadeUp .2s ease"}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--accent)",marginBottom:6}}>Budget</div>
                <p style={{fontSize:13,lineHeight:1.7,color:"var(--text2)",marginBottom:14}}>{c.budget}</p>
                <div style={{fontSize:12,fontWeight:600,color:"var(--accent)",marginBottom:6}}>Veiligheid</div>
                <p style={{fontSize:13,lineHeight:1.7,color:"var(--text2)"}}>{c.safety}</p>
                {c.bookings&&<div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:10}}><div style={{fontSize:12,fontWeight:600,color:"var(--accent)",marginBottom:6}}>Boekingslinks</div>{c.bookings.map((b,i)=>{const parts=b.split(": ");return <a key={i} href={"https://"+parts[1]} target="_blank" rel="noreferrer" style={{display:"block",fontSize:13,color:"var(--accent)",textDecoration:"none",padding:"2px 0"}}>{parts[0]}</a>})}</div>}
              </div>}

              <button onClick={()=>setExpanded(p=>({...p,"notes-d":!p["notes-d"]}))} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:expanded["notes-d"]?"var(--r) var(--r) 0 0":"var(--r)",cursor:"pointer",fontFamily:"var(--sans)",boxShadow:"var(--shadow)"}}>
                <span style={{fontSize:14,fontWeight:600}}>Notities</span>
                <span style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"var(--text3)"}}>{notes.filter(n=>n.city_id===c.id).length}</span><span style={{fontSize:12,color:"var(--text3)",transform:expanded["notes-d"]?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>{String.fromCharCode(9662)}</span></span>
              </button>
              {expanded["notes-d"]&&<div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 var(--r) var(--r)",padding:"12px 16px",boxShadow:"var(--shadow)",animation:"fadeUp .2s ease"}}>
                {notes.filter(n=>n.city_id===c.id).map(n=>(<div key={n.id} style={{padding:"8px 0",borderBottom:"1px solid var(--border2)",display:"flex",alignItems:"flex-start",gap:8}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{n.title}</div>{n.content&&<div style={{fontSize:12,color:"var(--text2)",marginTop:2,whiteSpace:"pre-wrap"}}>{n.content}</div>}</div>
                  <button onClick={()=>{(async()=>{await supabase.from("travel_notes").delete().eq("id",n.id);await reloadNotes()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",padding:4}}>x</button>
                </div>))}
                {addNote?(<div style={{display:"flex",flexDirection:"column",gap:6,paddingTop:8}}>
                  <input placeholder="Titel" value={noteForm.t} onChange={e=>setNoteForm({...noteForm,t:e.target.value})} style={inp}/>
                  <textarea placeholder="Notitie..." value={noteForm.c} onChange={e=>setNoteForm({...noteForm,c:e.target.value})} style={{...inp,minHeight:60,resize:"vertical"}}/>
                  <div style={{display:"flex",gap:6}}><button onClick={()=>{if(!noteForm.t)return;(async()=>{await supabase.from("travel_notes").insert({city_id:c.id,title:noteForm.t,content:noteForm.c});await reloadNotes()})();setNoteForm({t:"",c:""});setAddNote(false)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer"}}>Opslaan</button><button onClick={()=>setAddNote(false)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button></div>
                </div>):(<button onClick={()=>setAddNote(true)} style={{width:"100%",padding:8,background:"transparent",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",marginTop:4}}>+ Notitie toevoegen</button>)}
              </div>}
            </div>

            <button onClick={()=>openC(c.id)} style={{width:"100%",padding:14,borderRadius:"var(--r)",background:"var(--accent)",border:"none",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",boxShadow:"0 2px 8px rgba(191,107,67,0.25)"}}>{c.name} volledig bekijken</button>
          </div>
        )})()}

        {view==="city"&&city&&(<div style={{animation:"fadeUp .3s ease"}}>
          <button onClick={()=>{setView("plan");setCityId(null)}} style={{background:"none",border:"none",color:"var(--accent)",fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:12}}>Terug naar planning</button>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
            <div style={{width:6,height:32,borderRadius:3,background:city.color,flexShrink:0}}/>
            <div>
              <h2 style={{fontFamily:"var(--sans)",fontSize:24,color:"var(--text)",fontWeight:400,lineHeight:1.2}}>{city.name}</h2>
              <p style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{city.region}</p>
            </div>
          </div>
          <p style={{fontSize:15,lineHeight:1.7,color:"var(--text2)",marginBottom:20,fontFamily:"var(--sans)",fontWeight:700,fontStyle:"italic"}}>{city.intro}</p>
          <div style={{borderRadius:"var(--r)",overflow:"hidden",marginBottom:24,border:"1px solid var(--border)"}}>
            <iframe style={{width:"100%",height:240,border:"none",display:"block"}} loading="lazy" src={mapQ?`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapQ)}`:`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`} allowFullScreen />
          </div>
          <div style={{marginBottom:20}}>
            <button onClick={()=>setMapQ(city.name+", Italy")} style={{padding:"4px 12px",borderRadius:6,border:mapQ===city.name+", Italy"?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.1)",background:mapQ===city.name+", Italy"?"rgba(196,112,75,0.15)":"var(--bg2)",color:mapQ===city.name+", Italy"?"var(--terra-l)":"var(--cream2)",fontSize:10,cursor:"pointer",marginBottom:10}}>Overzicht</button>

            {(["cultuur","eten","tiktok","overig"] as const).map(cat=>{
              const label=cat==="cultuur"?"Cultuur & Bezienswaardigheden":cat==="eten"?"Eten & Drinken":cat==="tiktok"?"TikTok Viral":"Overig";
              const items=cat==="cultuur"?city.spots.map(p=>p.name):cat==="eten"?city.restaurants.map(r=>r.name):cat==="tiktok"?city.viral.map(v=>v.name):[];
              const custom=cpois.filter(p=>p.city_id===city.id&&p.cat===cat);
              const all=[...items,...custom.map(c=>c.name)];
              if(all.length===0&&cat!=="overig") return null;
              return(<div key={cat} style={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:9,fontWeight:700,color:"var(--text3)",letterSpacing:2,textTransform:"uppercase"}}>{label}</span>
                  <button onClick={()=>{setAddPoi(cat);setPoiCat(cat)}} style={{background:"none",border:"1px solid var(--border)",borderRadius:4,color:"var(--accent)",fontSize:9,padding:"2px 6px",cursor:"pointer"}}>+ toevoegen</button>
                </div>
                {addPoi===cat&&(<div style={{display:"flex",gap:6,marginBottom:8}}>
                  <input placeholder="Naam plek..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat,city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",color:"var(--text)",fontSize:11,fontFamily:"var(--sans)",outline:"none",flex:1}}/>
                  <button onClick={()=>{if(!poiName)return;(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat,city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>+</button>
                  <button onClick={()=>setAddPoi(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",color:"var(--text3)",fontSize:10,cursor:"pointer"}}>x</button>
                </div>)}
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {items.map((n,i)=>(<button key={"b"+i} onClick={()=>setMapQ(n+", "+city.name+", Italy")} style={{padding:"4px 10px",borderRadius:6,fontSize:10,cursor:"pointer",border:mapQ?.includes(n)?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.08)",background:mapQ?.includes(n)?"rgba(196,112,75,0.15)":"var(--bg3)",color:mapQ?.includes(n)?"var(--terra-l)":"var(--cream2)"}}>{n}</button>))}
                  {custom.map(c=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:0}}>
                    <button onClick={()=>setMapQ(c.name+", "+city.name+", Italy")} style={{padding:"4px 10px",fontSize:10,cursor:"pointer",border:mapQ?.includes(c.name)?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.08)",background:mapQ?.includes(c.name)?"rgba(196,112,75,0.15)":"var(--bg3)",color:mapQ?.includes(c.name)?"var(--terra-l)":"var(--cream2)",borderRadius:"6px 0 0 6px"}}>{c.name}</button>
                    <button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",c.id);await reloadPoi()})()}} style={{padding:"4px 6px",borderRadius:"0 6px 6px 0",border:"1px solid var(--border)",borderLeft:"none",background:"var(--bg3)",color:"rgba(255,255,255,0.2)",fontSize:9,cursor:"pointer"}}>x</button>
                  </div>))}
                </div>
              </div>);
            })}
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:24}}>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1,marginBottom:8}}>Als eerste doen</div>
            {city.firstSteps.map((s,i)=><div key={i} style={{fontSize:13,color:"var(--text)",padding:"4px 0",display:"flex",gap:8}}><span style={{color:"var(--accent)",fontWeight:700,flexShrink:0}}>{i+1}.</span>{s}</div>)}
          </div>
          
          {/* Alle content onder de kaart */}
          
          {/* Cultuur & Bezienswaardigheden */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase"}}>Bezienswaardigheden</div>
            </div>
            {city.spots.map((p,i)=>(<div key={"s"+i} onClick={()=>setMapQ(p.name+", "+city.name+", Italy")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:mapQ?.includes(p.name)?"rgba(196,112,75,0.1)":"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:mapQ?.includes(p.name)?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.04)",cursor:"pointer",transition:"all .15s"}}>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{p.name}</div><div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{p.desc}</div>{p.tip&&<div style={{fontSize:11,color:"var(--accent)",marginTop:4}}>{p.tip}</div>}</div>
              <span style={{fontSize:11,color:"var(--text3)",flexShrink:0,marginLeft:10}}>Kaart</span>
            </div>))}
            {cpois.filter(p=>p.city_id===city.id&&p.cat==="cultuur").map(c2=>(<div key={c2.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)"}}>
              <span onClick={()=>setMapQ(c2.name+", "+city.name+", Italy")} style={{flex:1,fontSize:14,color:"var(--text)",cursor:"pointer"}}>{c2.name}</span>
              <button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",c2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:12,cursor:"pointer",padding:"4px 8px"}}>x</button>
            </div>))}
            {addPoi==="cultuur"?(<div style={{display:"flex",gap:6,marginTop:4}}>
              <input placeholder="Naam toevoegen..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"cultuur",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:13,outline:"none",flex:1,fontFamily:"var(--sans)"}}/>
              <button onClick={()=>{if(!poiName)return;(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"cultuur",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>+</button>
              <button onClick={()=>setAddPoi(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 10px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button>
            </div>):(<button onClick={()=>setAddPoi("cultuur")} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed var(--border)",background:"var(--bg2)",color:"var(--text2)",fontSize:11,cursor:"pointer",marginTop:4}}>+ Eigen plek toevoegen</button>)}
          </div>

          {/* Eten & Drinken */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Eten & Drinken</div>
            {city.restaurants.map((r,i)=>(<div key={"r"+i} onClick={()=>setMapQ(r.name+", "+city.name+", Italy")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:mapQ?.includes(r.name)?"rgba(196,112,75,0.1)":"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:mapQ?.includes(r.name)?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.04)",cursor:"pointer",transition:"all .15s"}}>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{r.name} <span style={{color:"var(--accent)",fontWeight:400,fontSize:12}}>{r.price}</span></div><div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{r.type}</div>{r.tip&&<div style={{fontSize:11,color:"var(--accent)",marginTop:4}}>{r.tip}</div>}</div>
              <span style={{fontSize:11,color:"var(--text3)",flexShrink:0,marginLeft:10}}>Kaart</span>
            </div>))}
            {cpois.filter(p=>p.city_id===city.id&&p.cat==="eten").map(c2=>(<div key={c2.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)"}}>
              <span onClick={()=>setMapQ(c2.name+", "+city.name+", Italy")} style={{flex:1,fontSize:14,color:"var(--text)",cursor:"pointer"}}>{c2.name}</span>
              <button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",c2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:12,cursor:"pointer",padding:"4px 8px"}}>x</button>
            </div>))}
            {addPoi==="eten"?(<div style={{display:"flex",gap:6,marginTop:4}}>
              <input placeholder="Restaurant toevoegen..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"eten",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:13,outline:"none",flex:1,fontFamily:"var(--sans)"}}/>
              <button onClick={()=>{if(!poiName)return;(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"eten",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>+</button>
              <button onClick={()=>setAddPoi(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 10px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button>
            </div>):(<button onClick={()=>setAddPoi("eten")} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed var(--border)",background:"var(--bg2)",color:"var(--text2)",fontSize:11,cursor:"pointer",marginTop:4}}>+ Eigen restaurant toevoegen</button>)}
          </div>

          {/* TikTok Viral */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>TikTok Viral</div>
            {city.viral.map((v,i)=>(<div key={"v"+i} onClick={()=>setMapQ(v.name+", "+city.name+", Italy")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:mapQ?.includes(v.name)?"rgba(196,112,75,0.1)":"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:mapQ?.includes(v.name)?"1px solid var(--accent)":"1px solid rgba(255,255,255,0.04)",cursor:"pointer",transition:"all .15s"}}>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{v.name}</div><div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{v.desc}</div><div style={{fontSize:10,color:"var(--accent)",marginTop:4}}>{v.tag}</div></div>
              <span style={{fontSize:11,color:"var(--text3)",flexShrink:0,marginLeft:10}}>Kaart</span>
            </div>))}
            {cpois.filter(p=>p.city_id===city.id&&p.cat==="tiktok").map(c2=>(<div key={c2.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)"}}>
              <span onClick={()=>setMapQ(c2.name+", "+city.name+", Italy")} style={{flex:1,fontSize:14,color:"var(--text)",cursor:"pointer"}}>{c2.name}</span>
              <button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",c2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:12,cursor:"pointer",padding:"4px 8px"}}>x</button>
            </div>))}
            {addPoi==="tiktok"?(<div style={{display:"flex",gap:6,marginTop:4}}>
              <input placeholder="TikTok spot toevoegen..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"tiktok",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:13,outline:"none",flex:1,fontFamily:"var(--sans)"}}/>
              <button onClick={()=>{if(!poiName)return;(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"tiktok",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>+</button>
              <button onClick={()=>setAddPoi(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 10px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button>
            </div>):(<button onClick={()=>setAddPoi("tiktok")} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed var(--border)",background:"var(--bg2)",color:"var(--text2)",fontSize:11,cursor:"pointer",marginTop:4}}>+ TikTok spot toevoegen</button>)}
          </div>

          {/* Overige eigen plekken */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Overig</div>
            {cpois.filter(p=>p.city_id===city.id&&p.cat==="overig").map(c2=>(<div key={c2.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)"}}>
              <span onClick={()=>setMapQ(c2.name+", "+city.name+", Italy")} style={{flex:1,fontSize:14,color:"var(--text)",cursor:"pointer"}}>{c2.name}</span>
              <button onClick={()=>{(async()=>{await supabase.from("travel_custom_pois").delete().eq("id",c2.id);await reloadPoi()})()}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:12,cursor:"pointer",padding:"4px 8px"}}>x</button>
            </div>))}
            {addPoi==="overig"?(<div style={{display:"flex",gap:6,marginTop:4}}>
              <input placeholder="Plek toevoegen..." value={poiName} onChange={e=>setPoiName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&poiName){(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"overig",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}}} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:13,outline:"none",flex:1,fontFamily:"var(--sans)"}}/>
              <button onClick={()=>{if(!poiName)return;(async()=>{await supabase.from("travel_custom_pois").insert({name:poiName,cat:"overig",city_id:city.id});await reloadPoi()})();setPoiName("");setAddPoi(null)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>+</button>
              <button onClick={()=>setAddPoi(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 10px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>x</button>
            </div>):(<button onClick={()=>setAddPoi("overig")} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed var(--border)",background:"var(--bg2)",color:"var(--text2)",fontSize:11,cursor:"pointer",marginTop:4}}>+ Eigen plek toevoegen</button>)}
          </div>

          {/* Vervoer */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Vervoer</div>
            {city.transport.map((t,i)=>(<div key={i} style={{padding:"10px 16px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)",fontSize:13,color:"var(--text2)",lineHeight:1.5}}>{t}</div>))}
          </div>

          {/* Geschiedenis */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Geschiedenis</div>
            <div style={{padding:"16px 18px",background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border2)"}}>
              <p style={{fontSize:14,lineHeight:1.8,color:"var(--text2)"}}>{city.history}</p>
            </div>
          </div>

          {/* Budget & Veiligheid */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Budget</div>
            <div style={{padding:"16px 18px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:12,border:"1px solid var(--border2)"}}>
              <p style={{fontSize:13,lineHeight:1.7,color:"var(--text2)"}}>{city.budget}</p>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Veiligheid & Tips</div>
            <div style={{padding:"16px 18px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:12,border:"1px solid var(--border2)"}}>
              <p style={{fontSize:13,lineHeight:1.7,color:"var(--text2)"}}>{city.safety}</p>
            </div>
            {city.bookings&&(<>
              <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Boekingslinks</div>
              <div style={{padding:"16px 18px",background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border2)"}}>
                {city.bookings.map((b,i)=>{const[label,url]=b.includes(": ")?b.split(": "):["Link",b];return(<div key={i} style={{marginBottom:6}}><a href={"https://"+url} target="_blank" rel="noreferrer" style={{color:"var(--accent)",textDecoration:"none",fontSize:13}}>{label}</a></div>)})}
              </div>
            </>)}
          </div>

          {/* Notities */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:2,textTransform:"uppercase"}}>Notities</div>
              <button onClick={()=>setAddNote(true)} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:11,cursor:"pointer",fontWeight:600}}>+ Notitie</button>
            </div>
            {addNote&&(<div style={{background:"var(--bg2)",borderRadius:"var(--r)",padding:14,marginBottom:12,border:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:8}}>
              <input placeholder="Titel" value={noteForm.t} onChange={e=>setNoteForm({...noteForm,t:e.target.value})} style={inp}/>
              <textarea placeholder="Notitie..." value={noteForm.c} onChange={e=>setNoteForm({...noteForm,c:e.target.value})} style={{...inp,minHeight:80,resize:"vertical"}} />
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{if(!noteForm.t)return;(async()=>{await supabase.from("travel_notes").insert({city_id:city.id,title:noteForm.t,content:noteForm.c});await reloadNotes()})();setNoteForm({t:"",c:""});setAddNote(false)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"6px 16px",fontSize:12,cursor:"pointer"}}>Opslaan</button>
                <button onClick={()=>setAddNote(false)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",color:"var(--text3)",fontSize:12,cursor:"pointer"}}>Annuleer</button>
              </div>
            </div>)}
            {notes.filter(n=>n.city_id===city.id).map(n=>(<div key={n.id} style={{background:"var(--bg2)",borderRadius:"var(--r)",padding:"14px 16px",marginBottom:8,border:"1px solid var(--border2)",position:"relative"}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>{n.title}</div>
              {n.content&&<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{n.content}</div>}
              <button onClick={()=>{(async()=>{await supabase.from("travel_notes").delete().eq("id",n.id);await reloadNotes()})()}} style={{position:"absolute",top:10,right:10,background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:12,cursor:"pointer"}}>x</button>
            </div>))}
            {notes.filter(n=>n.city_id===city.id).length===0&&!addNote&&<p style={{fontSize:13,color:"var(--text3)",textAlign:"center",padding:16,fontStyle:"italic"}}>Nog geen notities.</p>}
          </div>
        </div>)}

        {view==="hotels"&&<div style={{animation:"fadeUp .3s ease"}}>
          <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>Overnachtingen</h2>
          {sbDays.filter(dd=>dd.hotel).map(dy=><div key={dy.id} style={{background:"var(--bg2)",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--shadow)",marginBottom:12,overflow:"hidden",display:"flex"}}>
            <iframe style={{width:180,height:120,border:"none",display:"block",flexShrink:0}} loading="lazy" src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q="+encodeURIComponent(dy.hotel+", Italy")}/>
            <div style={{flex:1,padding:"12px 16px",minWidth:0}}>
              <div style={{fontSize:10,color:"var(--text3)"}}>{"Nacht "+dy.day_num+" — "+dayDate(dy.day_num)}</div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{dy.hotel}</div>
              <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>{C.find(x=>x.id===dy.city_id)?.name||""}</div>
              <a href={dy.hotel_url||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(dy.hotel+", Italy")} target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--accent)",textDecoration:"none",fontWeight:600}}>Open in Maps</a>
            </div>
          </div>)}
        </div>}

        {view==="ms"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--sans)",fontSize:22,fontWeight:400}}>Must-See</h2>
            <button onClick={()=>setShowAdd(true)} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--r)",padding:"8px 18px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Toevoegen</button>
          </div>
          {showAdd&&(<div style={{background:"var(--bg2)",borderRadius:"var(--r)",padding:16,marginBottom:16,border:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:10}}>
            <input placeholder="Titel *" value={form.t} onChange={e=>setForm({...form,t:e.target.value})} style={inp}/>
            <input placeholder="Beschrijving" value={form.d} onChange={e=>setForm({...form,d:e.target.value})} style={inp}/>
            <input placeholder="Link (optioneel)" value={form.l} onChange={e=>setForm({...form,l:e.target.value})} style={inp}/>
            <input placeholder="Afbeelding URL (optioneel)" value={form.i} onChange={e=>setForm({...form,i:e.target.value})} style={inp}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{if(!form.t)return;(async()=>{await supabase.from("travel_mustsee").insert({title:form.t,desc:form.d,link:form.l||null,img:form.i||null,done:false});await reloadMs()})();setForm({t:"",d:"",l:"",i:""});setShowAdd(false)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>Opslaan</button>
              <button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer"}}>Annuleer</button>
            </div>
          </div>)}
          {ms.map(m=>(<div key={m.id} style={{background:"var(--bg2)",borderRadius:"var(--r)",padding:14,marginBottom:8,border:"1px solid var(--border2)",display:"flex",gap:12,alignItems:"flex-start",opacity:m.done?.45:1}}>
            {m.img&&<div style={{width:56,height:56,borderRadius:"var(--r)",backgroundImage:`url(${m.img})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>{(async()=>{await supabase.from("travel_mustsee").update({done:!m.done}).eq("id",m.id);await reloadMs()})()}} style={{background:"none",border:"1.5px solid var(--border)",width:18,height:18,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--accent)",flexShrink:0}}>{m.done?"\u2713":""}</button>
                {m.link?<a href={m.link} target="_blank" rel="noreferrer" style={{color:"var(--accent)",textDecoration:"none"}}>{m.title}</a>:<span>{m.title}</span>}
              </div>
              {m.description&&<div style={{fontSize:12,color:"var(--text2)",marginTop:4,lineHeight:1.4}}>{m.description}</div>}
            </div>
            <button onClick={()=>{(async()=>{await supabase.from("travel_mustsee").delete().eq("id",m.id);await reloadMs()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:14,cursor:"pointer",padding:4}}>x</button>
          </div>))}
        </div>)}

        {view==="td"&&(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"var(--sans)",fontSize:22,fontWeight:400}}>To-Do</h2>
            <button onClick={()=>setAddTd(true)} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--r)",padding:"8px 18px",fontSize:12,cursor:"pointer",fontWeight:600}}>+ Toevoegen</button>
          </div>
          {addTd&&(<div style={{background:"var(--bg2)",borderRadius:"var(--r)",padding:14,marginBottom:14,border:"1px solid var(--border)",display:"flex",gap:8}}>
            <input placeholder="Wat moet er gebeuren?" value={tdTxt} onChange={e=>setTdTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&tdTxt){(async()=>{await supabase.from("travel_todos").insert({text:tdTxt,done:false});await reloadTd()})();setTdTxt("");setAddTd(false)}}} style={{...inp,flex:1}}/>
            <button onClick={()=>{if(!tdTxt)return;(async()=>{await supabase.from("travel_todos").insert({text:tdTxt,done:false});await reloadTd()})();setTdTxt("");setAddTd(false)}} style={{background:"var(--accent)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer",flexShrink:0}}>+</button>
          </div>)}
          {todos.map(t=>(<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg2)",borderRadius:"var(--r)",marginBottom:6,border:"1px solid var(--border)",boxShadow:"var(--shadow)",opacity:t.done?.45:1}}>
            <button onClick={()=>{(async()=>{await supabase.from("travel_todos").update({done:!t.done}).eq("id",t.id);await reloadTd()})()}} style={{background:"none",border:"1.5px solid var(--border)",width:18,height:18,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--accent)",flexShrink:0}}>{t.done?"\u2713":""}</button>
            <span style={{fontSize:14,color:"var(--text)",flex:1,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            <button onClick={()=>{(async()=>{await supabase.from("travel_todos").delete().eq("id",t.id);await reloadTd()})()}} style={{background:"none",border:"none",color:"var(--text3)",fontSize:14,cursor:"pointer",padding:4}}>x</button>
          </div>))}
          {todos.length===0&&!addTd&&<p style={{fontSize:13,color:"var(--text3)",textAlign:"center",padding:40,fontStyle:"italic"}}>Nog geen items.</p>}
        </div>)}

        <footer style={{textAlign:"center",padding:"24px 0 12px",fontSize:12,color:"var(--text3)",fontFamily:"var(--sans)",fontWeight:700,fontStyle:"italic"}}>Buon viaggio, Tein & Tessa</footer>
      </main>
    </div>
  );
}
/* v4 */


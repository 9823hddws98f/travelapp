"use client";
import { useState, useEffect } from "react";

/* ── TYPES ── */
interface Place { name: string; desc: string; tip?: string; }
interface Resto { name: string; cuisine: string; price: string; tip?: string; }
interface CityData { id: string; city: string; region: string; emoji: string; lat: number; lng: number; zoom: number; intro: string; hero: string; mustDo: Place[]; restaurants: Resto[]; transport: string[]; }
interface DayPlan { day: number; date: string; title: string; cityId: string; hotel: string; hotelLink?: string; activities: string[]; evening: string; }
interface MustSeeItem { id: string; title: string; desc: string; link?: string; image?: string; done: boolean; }
interface TodoItem { id: string; text: string; done: boolean; }

/* ── DATA ── */
const EMERGENCY = { Algemeen:"112", Politie:"113", Ambulance:"118", Wegenwacht:"+39 803 116", "NL Ambassade":"+39 06 3228 6001" };

const CITIES: CityData[] = [
  { id:"venezia", city:"Venetië", region:"Veneto", emoji:"🚣", lat:45.4408,lng:12.3155,zoom:14, hero:"linear-gradient(135deg,#1a2533,#2d4a5e)", intro:"Drijvende droomstad. Gondels, San Marco en verloren verdwalen in steegjes.",
    mustDo:[{name:"San Marco",desc:"Het plein, de basiliek, het Dogenpaleis",tip:"Ga voor 9u 's ochtends"},{name:"Rialto Brug & Markt",desc:"Iconische brug + verse vismarkt",tip:"Markt alleen 's ochtends"},{name:"Burano",desc:"Kleurrijk eiland — perfecte foto's",tip:"Vaporetto lijn 12, ~45 min"},{name:"Dorsoduro wandeling",desc:"Rustigste sestiere, langs kanalen",tip:"Ponte dell'Accademia voor zonsondergang"}],
    restaurants:[{name:"Osteria Al Squero",cuisine:"Cicchetti",price:"€",tip:"Spritz + hapjes aan het water"},{name:"Trattoria da Romano",cuisine:"Buranees",price:"€€",tip:"Op Burano — risotto di gò"},{name:"Cantina Do Spade",cuisine:"Venetiaans",price:"€€",tip:"Al sinds 1488, bij Rialto"}],
    transport:["Vaporetto (waterbus) is je metro — koop 24/48u pas","Luchthaven Marco Polo: Alilaguna waterbus of bus","Alles te voet + vaporetto, geen auto's","Gondel: ~€80-100 voor 30 min, onderhandel"]
  },
  { id:"garda", city:"Gardameer", region:"Lombardije/Veneto", emoji:"⛵", lat:45.6500,lng:10.6700,zoom:11, hero:"linear-gradient(135deg,#1a3322,#2d5e4a)", intro:"Italië's grootste meer. Citroentuinen, bergen en azuurblauw water.",
    mustDo:[{name:"Sirmione",desc:"Schiereiland met kasteel en thermale baden",tip:"Grotte di Catullo — Romeinse ruïnes"},{name:"Limone sul Garda",desc:"Pittoresk dorpje met citroentuinen",tip:"Limonaia del Castel is prachtig"},{name:"Riva del Garda",desc:"Noordpunt — bergen ontmoeten het meer",tip:"Wandeling naar Cascata del Varone"}],
    restaurants:[{name:"Ristorante Al Pescatore",cuisine:"Vis",price:"€€",tip:"Sirmione — terras aan het water"},{name:"Osteria Il Gallo",cuisine:"Lokaal",price:"€",tip:"Authentiek, geen toeristen"}],
    transport:["Veerboten verbinden alle dorpen — Navigazione Lago di Garda","Auto handig voor westoever","Trein Desenzano-Sirmione is dichtstbijzijnde station","Fietsen langs het meer is fantastisch"]
  },

/* ── COMPONENT ── */
export default function Page() {
  const [tab, setTab] = useState<"plan"|"mustsee"|"todo">("plan");
  const [expandedDay, setExpandedDay] = useState<number|null>(null);
  const [mustSees, setMustSees] = useState<CustomItem[]>([]);
  const [todos, setTodos] = useState<CustomItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const ms = localStorage.getItem("italia-mustsees");
    const td = localStorage.getItem("italia-todos");
    if (ms) setMustSees(JSON.parse(ms));
    if (td) setTodos(JSON.parse(td));
  }, []);
  useEffect(() => { localStorage.setItem("italia-mustsees", JSON.stringify(mustSees)); }, [mustSees]);
  useEffect(() => { localStorage.setItem("italia-todos", JSON.stringify(todos)); }, [todos]);

  const addItem = () => {
    if (!newTitle.trim()) return;
    const item: CustomItem = { id: Date.now().toString(), title: newTitle, desc: newDesc, link: newLink || undefined };
    if (tab === "mustsee") setMustSees(p => [...p, item]);
    else setTodos(p => [...p, { ...item, done: false }]);
    setNewTitle(""); setNewDesc(""); setNewLink(""); setShowAdd(false);
  };
  const removeItem = (id: string) => {
    if (tab === "mustsee") setMustSees(p => p.filter(x => x.id !== id));
    else setTodos(p => p.filter(x => x.id !== id));
  };
  const toggleTodo = (id: string) => setTodos(p => p.map(x => x.id === id ? { ...x, done: !x.done } : x));

  return (
    <div style={s.wrapper}>
      <header style={s.header}>
        <div style={s.pin}>2026</div>
        <h1 style={s.title}>Italia</h1>
        <p style={s.subtitle}>Tein & Tessa · 10 dagen</p>
        <p style={s.route}>Venetië → Gardameer → Toscane → Napels → Amalfi → Verona</p>
      </header>

      {/* Tabs */}
      <div style={s.tabs}>
        {(["plan","mustsee","todo"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...s.tab, ...(tab===t ? s.tabActive : {})}}>
            {t === "plan" ? "📅 Planning" : t === "mustsee" ? "⭐ Must-sees" : "✅ Todo"}
          </button>
        ))}
      </div>

      {/* ── PLANNING TAB ── */}
      {tab === "plan" && (
        <div style={s.dayList}>
          {DAYS.map(d => {
            const open = expandedDay === d.day;
            return (
              <div key={d.day} style={s.dayCard}>
                <button onClick={() => setExpandedDay(open ? null : d.day)} style={s.dayHeader}>
                  <span style={s.dayEmoji}>{d.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={s.dayTitle}>{d.date}: {d.title}</div>
                    <div style={s.dayHotel}>🏨 {d.hotel}</div>
                  </div>
                  <span style={s.dayArrow}>{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div style={s.dayBody}>
                    {d.hotelLink && <a href={d.hotelLink} target="_blank" rel="noreferrer" style={s.hotelLink}>📍 Hotel op Google Maps</a>}
                    <div style={s.mapWrap}>
                      <iframe style={s.mapIframe} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${d.lat},${d.lng}&zoom=${d.zoom}&maptype=roadmap`} />
                    </div>
                    <h4 style={s.actTitle}>Activiteiten</h4>
                    {d.activities.map((a, i) => (
                      <div key={i} style={s.actItem}>
                        <span style={s.actBullet}>→</span> {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MUST-SEES & TODO TAB ── */}
      {(tab === "mustsee" || tab === "todo") && (
        <div style={s.listSection}>
          <div style={s.listHeader}>
            <h2 style={s.listTitle}>{tab === "mustsee" ? "⭐ Must-see lijst" : "✅ Todo lijst"}</h2>
            <button onClick={() => setShowAdd(!showAdd)} style={s.addBtn}>{showAdd ? "✕" : "+ Toevoegen"}</button>
          </div>
          {showAdd && (
            <div style={s.addForm}>
              <input style={s.input} placeholder="Titel *" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <input style={s.input} placeholder="Beschrijving" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              <input style={s.input} placeholder="Link (optioneel)" value={newLink} onChange={e => setNewLink(e.target.value)} />
              <button onClick={addItem} style={s.saveBtn}>Opslaan</button>
            </div>
          )}
          {(tab === "mustsee" ? mustSees : todos).length === 0 && !showAdd && (
            <p style={s.emptyText}>Nog geen items. Tik op &quot;+ Toevoegen&quot; om te beginnen.</p>
          )}
          {(tab === "mustsee" ? mustSees : todos).map(item => (
            <div key={item.id} style={{...s.listCard, opacity: (item as CustomItem & {done?:boolean}).done ? 0.5 : 1}}>
              <div style={s.listCardTop}>
                {tab === "todo" && (
                  <button onClick={() => toggleTodo(item.id)} style={s.checkBtn}>
                    {(item as CustomItem & {done?:boolean}).done ? "☑️" : "⬜"}
                  </button>
                )}
                <div style={{flex:1}}>
                  <div style={{...s.listCardTitle, textDecoration: (item as CustomItem & {done?:boolean}).done ? "line-through" : "none"}}>{item.title}</div>
                  {item.desc && <div style={s.listCardDesc}>{item.desc}</div>}
                  {item.link && <a href={item.link} target="_blank" rel="noreferrer" style={s.listCardLink}>🔗 Link openen</a>}
                </div>
                <button onClick={() => removeItem(item.id)} style={s.deleteBtn}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer style={s.footer}>Buon viaggio, Tein &amp; Tessa 🇮🇹</footer>
    </div>
  );
}
  { id:"verona", city:"Verona", region:"Veneto", emoji:"🏟️", lat:45.4384,lng:10.9916,zoom:14, hero:"linear-gradient(135deg,#1e1520,#3a2845)", intro:"Shakespeare's stad van de liefde. Romeinse arena, Amarone en perfecte afsluiting.",
    mustDo:[{name:"Arena di Verona",desc:"Romeins amfitheater — opera openlucht",tip:"Check arena.it"},{name:"Piazza delle Erbe",desc:"Markt overdag, aperitivo 's avonds",tip:"Torre dei Lamberti voor uitzicht"},{name:"Ponte Pietra",desc:"Romeinse brug aan de Adige",tip:"Loop omhoog naar Castel San Pietro"},{name:"Amarone proeverij",desc:"Valpolicella op 20 min",tip:"Boek via Viator of direct"}],
    restaurants:[{name:"Osteria al Duca",cuisine:"Veronees",price:"€€",tip:"Pastissada de caval"},{name:"Pizzeria Du de Cope",cuisine:"Pizza",price:"€",tip:"Beste pizza van Verona"},{name:"Osteria Caffè Monte Baldo",cuisine:"Lokaal",price:"€€",tip:"Reserveer — risotto is top"}],
    transport:["Verona Porta Nuova — treinen naar Venetië/Milaan","Centrum compact — alles te voet","Luchthaven Catullo: bus 199"]
  },
  { id:"toscane", city:"Toscane", region:"Toscane", emoji:"🍷", lat:43.7696,lng:11.2558,zoom:11, hero:"linear-gradient(135deg,#1f2418,#3d4a2a)", intro:"Glooiende heuvels, cipressen, wijn en Renaissance. Hier vertraagt de tijd.",
    mustDo:[{name:"Uffizi",desc:"Botticelli, Da Vinci, Caravaggio",tip:"Boek weken vooruit"},{name:"Ponte Vecchio",desc:"Beroemde brug vol juweliers",tip:"Mooiste bij zonsondergang"},{name:"San Gimignano",desc:"Middeleeuws Manhattan",tip:"Dondero gelato = wereldkampioen"},{name:"Val d'Orcia",desc:"Iconische heuvels met cipressen",tip:"Huur auto voor een dag"},{name:"Siena",desc:"Piazza del Campo en Duomo",tip:"Compacter dan Firenze"}],
    restaurants:[{name:"Trattoria Mario",cuisine:"Florentijns",price:"€",tip:"Gedeelde tafels, bistecca"},{name:"All'Antico Vinaio",cuisine:"Panini",price:"€",tip:"Beroemdste broodjeszaak"},{name:"Osteria dell'Enoteca",cuisine:"Toscaans",price:"€€",tip:"Wild zwijn ragù"}],
    transport:["Firenze SMN is de hub","Bus naar San Gimignano (via Poggibonsi)","Huurauto voor Val d'Orcia","ZTL-zones — niet met auto centrum in!"]
  },
  { id:"napels", city:"Napels", region:"Campanië", emoji:"🌋", lat:40.8518,lng:14.2681,zoom:13, hero:"linear-gradient(135deg,#2d1f1a,#4a2c1e)", intro:"Rauw, luid en echt. Geboorteplaats van pizza, poort naar Amalfikust.",
    mustDo:[{name:"Spaccanapoli",desc:"Hartader van het centrum",tip:"Loop west→oost in de ochtend"},{name:"Pompeï",desc:"Bevroren stad onder de Vesuvius",tip:"Tickets online, ga vroeg"},{name:"Cappella Sansevero",desc:"Christus onder het lijkkleed",tip:"Reserveer vooraf"},{name:"Vesuvius",desc:"Uitzicht Golf van Napels",tip:"Combi-ticket met Pompeï"},{name:"Napoli Sotterranea",desc:"Tunnels onder de stad",tip:"Tours elk half uur"}],
    restaurants:[{name:"Da Michele",cuisine:"Pizza",price:"€",tip:"Alleen margherita of marinara"},{name:"Da Nennella",cuisine:"Napolitaans",price:"€",tip:"Chaotisch, fantastisch, cash only"},{name:"Sorbillo",cuisine:"Pizza",price:"€",tip:"Probeer de frittatina"}],
    transport:["Metro Lijn 1 (Toledo is spectaculair)","Circumvesuviana naar Pompeï (~€4)","Alibus luchthaven (~€5)"]
  },
  { id:"amalfi", city:"Amalfikust", region:"Campanië", emoji:"🏖️", lat:40.6333,lng:14.6029,zoom:12, hero:"linear-gradient(135deg,#1a2633,#2d4a5e)", intro:"Pastelkleurige dorpen aan kliffen boven azuurblauwe zee.",
    mustDo:[{name:"Positano",desc:"Iconisch kleurendorp",tip:"Comfortabele schoenen"},{name:"Sentiero degli Dei",desc:"Pad der Goden — kustwandeling",tip:"Start vroeg, 2L water"},{name:"Ravello",desc:"Villa Rufolo & Cimbrone",tip:"Rustiger dan Positano"},{name:"Limoncello proeven",desc:"Citroenen zo groot als je vuist"}],
    restaurants:[{name:"Da Vincenzo",cuisine:"Vis",price:"€€€",tip:"Positano — terras reserveren"},{name:"Le Arcate",cuisine:"Pizza/pasta",price:"€",tip:"Atrani — budget aan zee"}],
    transport:["SITA-bus langs de kust","Veerboot Positano↔Amalfi↔Salerno","Auto afgeraden — smalle wegen","Trein naar Salerno, dan bus/boot"]
  },
];

/* ── STYLES ── */
const s: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: 480, margin: "0 auto", padding: "0 16px", minHeight: "100vh" },
  header: { textAlign: "center" as const, padding: "48px 0 24px" },
  pin: { display: "inline-block", background: "#c4704b", color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: 2, padding: "4px 14px", borderRadius: 20, marginBottom: 16, textTransform: "uppercase" as const },
  title: { fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, color: "var(--cream)", lineHeight: 1.1, margin: 0 },
  subtitle: { fontSize: 15, color: "var(--cream-muted)", marginTop: 8 },
  route: { fontSize: 12, color: "var(--accent)", marginTop: 4 },

  tabs: { display: "flex", gap: 4, marginBottom: 20, background: "var(--bg-card)", borderRadius: 14, padding: 4 },
  tab: { flex: 1, padding: "12px 8px", border: "none", borderRadius: 12, background: "transparent", color: "var(--cream-muted)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" },
  tabActive: { background: "#c4704b", color: "#fff" },

  dayList: { display: "flex", flexDirection: "column" as const, gap: 8, paddingBottom: 32 },
  dayCard: { background: "var(--bg-card)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" },
  dayHeader: { display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", width: "100%", border: "none", background: "none", color: "var(--cream)", cursor: "pointer", textAlign: "left" as const, fontFamily: "var(--font-sans)" },
  dayEmoji: { fontSize: 28, flexShrink: 0 },
  dayTitle: { fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400 },
  dayHotel: { fontSize: 12, color: "var(--cream-muted)", marginTop: 3 },
  dayArrow: { fontSize: 14, color: "#c4704b", flexShrink: 0 },
  dayBody: { padding: "0 18px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" },
  hotelLink: { display: "inline-block", fontSize: 13, color: "#d4886a", textDecoration: "none", marginTop: 12, marginBottom: 8 },
  mapWrap: { borderRadius: 12, overflow: "hidden", margin: "12px 0 16px", border: "1px solid rgba(255,255,255,0.08)" },
  mapIframe: { width: "100%", height: 200, border: "none", display: "block" },
  actTitle: { fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 400, color: "var(--cream)", marginBottom: 10 },
  actItem: { fontSize: 14, color: "var(--cream-muted)", padding: "6px 0", lineHeight: 1.5 },
  actBullet: { color: "#c4704b", marginRight: 6 },

  listSection: { paddingBottom: 32 },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  listTitle: { fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--cream)" },
  addBtn: { background: "#c4704b", border: "none", color: "#fff", fontSize: 13, padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-sans)" },
  addForm: { background: "var(--bg-card)", borderRadius: 14, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column" as const, gap: 10 },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "var(--cream)", fontSize: 14, outline: "none", fontFamily: "var(--font-sans)" },
  saveBtn: { background: "#c4704b", border: "none", color: "#fff", fontSize: 14, padding: "12px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-sans)" },
  emptyText: { color: "var(--cream-muted)", fontSize: 14, textAlign: "center" as const, padding: "40px 0", fontStyle: "italic" },
  listCard: { background: "var(--bg-card)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.04)" },
  listCardTop: { display: "flex", alignItems: "flex-start", gap: 10 },
  checkBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0, flexShrink: 0, marginTop: 1 },
  listCardTitle: { fontSize: 15, fontWeight: 600, color: "var(--cream)", marginBottom: 3, fontFamily: "var(--font-sans)" },
  listCardDesc: { fontSize: 13, color: "var(--cream-muted)", lineHeight: 1.4 },
  listCardLink: { fontSize: 12, color: "#d4886a", textDecoration: "none", display: "inline-block", marginTop: 6 },
  deleteBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", padding: "4px", flexShrink: 0, opacity: 0.5 },

  footer: { textAlign: "center" as const, padding: "32px 0 48px", fontSize: 14, color: "var(--accent)", fontFamily: "var(--font-serif)", fontStyle: "italic" },
};

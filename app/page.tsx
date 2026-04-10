"use client";
import { useState } from "react";

const EMERGENCY = { algemeen: "112", politie: "113", ambulance: "118", wegenwacht: "+39 803 116", nlAmbassade: "+39 06 3228 6001" };

interface Place { name: string; desc: string; tip?: string; }
interface Resto { name: string; cuisine: string; price: string; tip?: string; }
interface CityData {
  city: string; region: string; days: string; emoji: string;
  hero: string; intro: string; mustDo: Place[]; restaurants: Resto[];
  transport: string[]; mapQuery: string; lat: number; lng: number;
}

const CITIES: CityData[] = [
  {
    city: "Napels", region: "Campani\u00eb", days: "Dag 1\u20133", emoji: "\ud83c\udf0b",
    hero: "linear-gradient(135deg, #2d1f1a 0%, #4a2c1e 100%)",
    intro: "Rauw, luid en ongelooflijk echt. De geboorteplaats van pizza en de poort naar de Amalfikust.",
    lat: 40.8518, lng: 14.2681, mapQuery: "Naples,Italy",
    mustDo: [
      { name: "Spaccanapoli", desc: "De hartader van het historisch centrum", tip: "Loop van west naar oost in de ochtend" },
      { name: "Pompe\u00ef", desc: "De bevroren stad onder de Vesuvius", tip: "Boek tickets online, ga vroeg" },
      { name: "Cappella Sansevero", desc: "De Christus onder het lijkkleed", tip: "Klein museum, reserveer vooraf" },
      { name: "Vesuvius beklimmen", desc: "Uitzicht over de Golf van Napels", tip: "Combi-ticket met Pompe\u00ef" },
      { name: "Napoli Sotterranea", desc: "Griekse en Romeinse tunnels onder de stad", tip: "Tours elk half uur" },
    ],
    restaurants: [
      { name: "Da Michele", cuisine: "Pizza", price: "\u20ac", tip: "Alleen margherita of marinara" },
      { name: "Trattoria da Nennella", cuisine: "Napolitaans", price: "\u20ac", tip: "Chaotisch en fantastisch. Cash only." },
      { name: "Sorbillo", cuisine: "Pizza", price: "\u20ac", tip: "Probeer de frittatina" },
      { name: "Gran Caff\u00e8 Gambrinus", cuisine: "Caf\u00e9", price: "\u20ac\u20ac", tip: "Sfogliata en espresso" },
    ],
    transport: ["Metro Lijn 1 (Toledo is spectaculair)", "Circumvesuviana naar Pompe\u00ef (~\u20ac4)", "Alibus luchthaven (~\u20ac5)", "Let op zakkenrollers"],
  },
  {
    city: "Amalfikust", region: "Campani\u00eb", days: "Dag 4\u20135", emoji: "\ud83c\udfd6\ufe0f",
    hero: "linear-gradient(135deg, #1a2633 0%, #2d4a5e 100%)",
    intro: "Pastelkleurige dorpen die aan kliffen hangen boven een azuurblauwe zee.",
    lat: 40.6333, lng: 14.6029, mapQuery: "Amalfi+Coast,Italy",
    mustDo: [
      { name: "Positano", desc: "Het iconische kleurendorp", tip: "Draag comfortabele schoenen" },
      { name: "Sentiero degli Dei", desc: "Pad der Goden \u2014 spectaculaire kustwandeling", tip: "Start vroeg, neem 2L water mee" },
      { name: "Ravello", desc: "Villa Rufolo & Villa Cimbrone", tip: "Rustig alternatief voor Positano" },
      { name: "Amalfi kathedraal", desc: "Arabisch-Normandische kathedraal", tip: "Gratis toegang" },
      { name: "Limoncello proeven", desc: "Citroenen zo groot als je vuist", tip: "Koop bij lokale producenten" },
    ],
    restaurants: [
      { name: "Da Vincenzo", cuisine: "Vis / zeefood", price: "\u20ac\u20ac\u20ac", tip: "Positano \u2014 reserveer op het terras" },
      { name: "Il Ritrovo", cuisine: "Lokaal", price: "\u20ac\u20ac", tip: "Montepertuso \u2014 kookles mogelijk" },
      { name: "Le Arcate", cuisine: "Pizza / pasta", price: "\u20ac", tip: "Atrani \u2014 budget optie aan zee" },
    ],
    transport: ["SITA-bus langs de kust \u2014 kaartjes bij tabacchi", "Veerboot Positano-Amalfi-Salerno", "Auto huren afgeraden", "Trein naar Salerno, dan bus/boot"],
  },
  {
    city: "Toscane", region: "Toscane", days: "Dag 6\u20138", emoji: "\ud83c\udf77",
    hero: "linear-gradient(135deg, #1f2418 0%, #3d4a2a 100%)",
    intro: "Glooiende heuvels, cipressen, wijn en Renaissance-schatten.",
    lat: 43.7696, lng: 11.2558, mapQuery: "Florence,Tuscany,Italy",
    mustDo: [
      { name: "Firenze \u2014 Uffizi", desc: "Botticelli, Da Vinci, Caravaggio", tip: "Boek weken vooruit" },
      { name: "Ponte Vecchio", desc: "De beroemde brug vol juwelierswinkels", tip: "Mooiste bij zonsondergang" },
      { name: "San Gimignano", desc: "Middeleeuws Manhattan \u2014 torens en wijn", tip: "Dondero gelato is wereldkampioen" },
      { name: "Val d'Orcia", desc: "Iconische heuvels \u2014 cipressen en gouden licht", tip: "Huur een auto voor een dag" },
      { name: "Siena", desc: "Piazza del Campo en de Duomo", tip: "Compacter dan Firenze" },
    ],
    restaurants: [
      { name: "Trattoria Mario", cuisine: "Florentijns", price: "\u20ac", tip: "Gedeelde tafels, bistecca" },
      { name: "All'Antico Vinaio", cuisine: "Panini", price: "\u20ac", tip: "Beroemdste broodjeszaak ter wereld" },
      { name: "Osteria dell'Enoteca", cuisine: "Toscaans", price: "\u20ac\u20ac", tip: "San Gimignano \u2014 wild zwijn rag\u00f9" },
    ],
    transport: ["Firenze SMN is de hub", "Bus naar San Gimignano (via Poggibonsi)", "Huurauto voor Val d'Orcia", "ZTL-zones \u2014 niet met auto het centrum in!"],
  },
  {
    city: "Verona", region: "Veneto", days: "Dag 9\u201310", emoji: "\ud83c\udfdf\ufe0f",
    hero: "linear-gradient(135deg, #1e1520 0%, #3a2845 100%)",
    intro: "Shakespeare's stad van de liefde. Romeinse arena, Amarone-wijn en een perfecte afsluiting.",
    lat: 45.4384, lng: 10.9916, mapQuery: "Verona,Italy",
    mustDo: [
      { name: "Arena di Verona", desc: "Romeins amfitheater \u2014 opera in de openlucht", tip: "Check arena.it" },
      { name: "Piazza delle Erbe", desc: "Het kloppend hart \u2014 markt en aperitivo", tip: "Torre dei Lamberti voor uitzicht" },
      { name: "Ponte Pietra", desc: "Romeinse brug aan de Adige", tip: "Wandel naar Castel San Pietro" },
      { name: "Juliet's Balkon", desc: "Kitscherig maar onvermijdelijk", tip: "Sla de rij over, plein is gratis" },
      { name: "Amarone proeverij", desc: "Valpolicella ligt op 20 min", tip: "Boek via Viator" },
    ],
    restaurants: [
      { name: "Osteria al Duca", cuisine: "Veronees", price: "\u20ac\u20ac", tip: "Pastissada de caval" },
      { name: "Pizzeria Du de Cope", cuisine: "Pizza", price: "\u20ac", tip: "Beste pizza van Verona" },
      { name: "Antica Bottega del Vino", cuisine: "Wijnbar", price: "\u20ac\u20ac\u20ac", tip: "Legendarische wijnkaart" },
    ],
    transport: ["Verona Porta Nuova \u2014 treinen naar Milaan/Veneti\u00eb", "Compact centrum \u2014 alles te voet", "Bus 11/12/13 naar Valpolicella", "Airport bus 199 naar centrum"],
  },
];

export default function Page() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const city = selected !== null ? CITIES[selected] : null;

  return (
    <div style={s.wrapper}>
      <header style={s.header}>
        <div style={s.pin}>2026</div>
        <h1 style={s.title}>Italia</h1>
        <p style={s.subtitle}>Tein & Tessa · 10 dagen</p>
        <p style={s.route}>Napels → Amalfikust → Toscane → Verona</p>
      </header>

      {!city && (
        <div style={s.cityList}>
          {CITIES.map((c, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{...s.cityCard, background: c.hero}}>
              <span style={s.cityEmoji}>{c.emoji}</span>
              <div>
                <div style={s.cityName}>{c.city}</div>
                <div style={s.cityDays}>{c.days} · {c.region}</div>
              </div>
              <span style={s.cityArrow}>→</span>
            </button>
          ))}
          <button onClick={() => setShowEmergency(!showEmergency)} style={s.emergencyBtn}>
            🚨 Noodnummers {showEmergency ? "▲" : "▼"}
          </button>
          {showEmergency && (
            <div style={s.emergencyBox}>
              {Object.entries(EMERGENCY).map(([k, v]) => (
                <div key={k} style={s.emergencyRow}>
                  <span style={s.emergencyLabel}>{k}</span>
                  <a href={`tel:${v.replace(/\s/g, "")}`} style={s.emergencyVal}>{v}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {city && (
        <div style={s.detail}>
          <button onClick={() => setSelected(null)} style={s.backBtn}>← Alle steden</button>
          <div style={{...s.detailHero, background: city.hero}}>
            <span style={s.detailEmoji}>{city.emoji}</span>
            <h2 style={s.detailTitle}>{city.city}</h2>
            <p style={s.detailDays}>{city.days} · {city.region}</p>
          </div>
          <p style={s.detailIntro}>{city.intro}</p>
          <div style={s.mapContainer}>
            <iframe
              style={s.mapIframe}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${city.lat},${city.lng}&zoom=${city.zoom}&maptype=roadmap`}
              allowFullScreen
            />
          </div>
          <section style={s.section}>
            <h3 style={s.sectionTitle}>Must-do&apos;s</h3>
            {city.mustDo.map((p, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardName}>{p.name}</div>
                <div style={s.cardDesc}>{p.desc}</div>
                {p.tip && <div style={s.tip}>💡 {p.tip}</div>}
              </div>
            ))}
          </section>
          <section style={s.section}>
            <h3 style={s.sectionTitle}>Eten &amp; drinken</h3>
            {city.restaurants.map((r, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardName}>{r.name} <span style={s.price}>{r.price}</span></div>
                <div style={s.cardDesc}>{r.cuisine}</div>
                {r.tip && <div style={s.tip}>💡 {r.tip}</div>}
              </div>
            ))}
          </section>
          <section style={s.section}>
            <h3 style={s.sectionTitle}>Vervoer</h3>
            {city.transport.map((t, i) => (
              <div key={i} style={s.transportItem}>🚃 {t}</div>
            ))}
          </section>
        </div>
      )}
      <footer style={s.footer}>Buon viaggio, Tein &amp; Tessa 🇮🇹</footer>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: 480, margin: "0 auto", padding: "0 16px", minHeight: "100vh" },
  header: { textAlign: "center", padding: "48px 0 32px" },
  pin: { display: "inline-block", background: "#c4704b", color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-sans)", letterSpacing: 2, padding: "4px 14px", borderRadius: 20, marginBottom: 16, textTransform: "uppercase" as const },
  title: { fontFamily: "var(--font-serif)", fontSize: 52, fontWeight: 400, color: "var(--cream)", lineHeight: 1.1, margin: 0 },
  subtitle: { fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--cream-muted)", marginTop: 8 },
  route: { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--accent)", marginTop: 4 },
  cityList: { display: "flex", flexDirection: "column" as const, gap: 12, paddingBottom: 32 },
  cityCard: { display: "flex", alignItems: "center", gap: 16, padding: "20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", color: "var(--cream)", textAlign: "left" as const, fontSize: 16, fontFamily: "var(--font-sans)", width: "100%" },
  cityEmoji: { fontSize: 32, flexShrink: 0 },
  cityName: { fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400 },
  cityDays: { fontSize: 13, color: "var(--cream-muted)", marginTop: 2 },
  cityArrow: { marginLeft: "auto", fontSize: 20, color: "#c4704b", flexShrink: 0 },
  emergencyBtn: { background: "rgba(196,112,75,0.15)", border: "1px solid #c4704b", borderRadius: 12, padding: "14px 20px", color: "#d4886a", fontSize: 14, fontFamily: "var(--font-sans)", cursor: "pointer", width: "100%", textAlign: "left" as const, marginTop: 8 },
  emergencyBox: { background: "var(--bg-card)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" as const, gap: 10 },
  emergencyRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  emergencyLabel: { fontSize: 13, color: "var(--cream-muted)", textTransform: "capitalize" as const },
  emergencyVal: { fontSize: 14, color: "#d4886a", textDecoration: "none", fontWeight: 500 },
  detail: { paddingBottom: 32 },
  backBtn: { background: "none", border: "none", color: "#d4886a", fontSize: 14, fontFamily: "var(--font-sans)", cursor: "pointer", padding: "8px 0", marginBottom: 8 },
  detailHero: { borderRadius: 20, padding: "36px 24px", textAlign: "center" as const, marginBottom: 20 },
  detailEmoji: { fontSize: 48, display: "block", marginBottom: 8 },
  detailTitle: { fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 400, color: "#fff", margin: 0 },
  detailDays: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 6, fontFamily: "var(--font-sans)" },
  detailIntro: { fontSize: 15, lineHeight: 1.7, color: "var(--cream-muted)", marginBottom: 24, fontStyle: "italic", fontFamily: "var(--font-serif)" },
  mapContainer: { borderRadius: 16, overflow: "hidden", marginBottom: 28, border: "1px solid rgba(255,255,255,0.08)" },
  mapIframe: { width: "100%", height: 220, border: "none", display: "block" },
  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--cream)", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  card: { background: "var(--bg-card)", borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.04)" },
  cardName: { fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--cream)", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "var(--cream-muted)", lineHeight: 1.5 },
  price: { color: "#d4886a", fontWeight: 400, fontSize: 13 },
  tip: { fontSize: 12, color: "#d4886a", marginTop: 8, lineHeight: 1.4 },
  transportItem: { fontSize: 14, color: "var(--cream-muted)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", lineHeight: 1.5 },
  footer: { textAlign: "center" as const, padding: "32px 0 48px", fontSize: 14, color: "var(--accent)", fontFamily: "var(--font-serif)", fontStyle: "italic" },
};

export default function Page() {
  const [activeCity, setActiveCity] = useState(0);
  const [showEmergency, setShowEmergency] = useState(false);
  const city = CITIES[activeCity];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <header style={{ padding: "2rem 1rem 1rem", textAlign: "center", borderBottom: "1px solid rgba(196,112,75,0.2)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3rem)", color: "var(--terracotta)", fontWeight: 400, margin: 0 }}>
          Italia 2026
        </h1>
        <p style={{ color: "var(--cream-muted)", fontSize: "0.9rem", marginTop: 4 }}>Tein & Tessa — 10 dagen</p>
        <span style={{ display: "inline-block", marginTop: 8, padding: "3px 12px", borderRadius: 20, background: "var(--terracotta)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 1 }}>
          \ud83d\udccc 2026
        </span>
      </header>

      <nav style={{ display: "flex", overflowX: "auto", gap: 0, borderBottom: "1px solid rgba(196,112,75,0.15)", WebkitOverflowScrolling: "touch" as never }}>
        {CITIES.map((c, i) => (
          <button key={i} onClick={() => setActiveCity(i)}
            style={{
              flex: "1 0 auto", padding: "14px 18px", border: "none", cursor: "pointer",
              background: i === activeCity ? "var(--bg-card)" : "transparent",
              color: i === activeCity ? "var(--terracotta)" : "var(--cream-muted)",
              fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: i === activeCity ? 600 : 400,
              borderBottom: i === activeCity ? "2px solid var(--terracotta)" : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.2s",
            }}>
            {c.emoji} {c.city}
          </button>
        ))}
      </nav>

      <div style={{ background: city.hero, padding: "2rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem" }}>{city.emoji}</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--cream)", margin: "8px 0 4px", fontWeight: 400 }}>
          {city.city}
        </h2>
        <p style={{ color: "var(--terracotta-light)", fontSize: "0.85rem", margin: 0 }}>{city.region} \u00b7 {city.days}</p>
        <p style={{ color: "var(--cream-muted)", fontSize: "0.95rem", marginTop: 12, maxWidth: 500, marginInline: "auto", lineHeight: 1.6 }}>{city.intro}</p>
      </div>

      <div style={{ padding: "1rem", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(196,112,75,0.2)" }}>
          <iframe
            width="100%" height="300" style={{ border: 0, display: "block" }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${city.mapQuery}&zoom=12`}
          />
        </div>
      </div>

      <section style={{ padding: "1rem", maxWidth: 700, margin: "0 auto" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--terracotta)", marginBottom: 12, fontWeight: 400 }}>Must-do&apos;s</h3>
        {city.mustDo.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-card)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, borderLeft: "3px solid var(--terracotta)" }}>
            <div style={{ fontWeight: 600, color: "var(--cream)", fontSize: "0.95rem" }}>{p.name}</div>
            <div style={{ color: "var(--cream-muted)", fontSize: "0.85rem", marginTop: 4 }}>{p.desc}</div>
            {p.tip && <div style={{ color: "var(--terracotta-light)", fontSize: "0.8rem", marginTop: 6 }}>\ud83d\udca1 {p.tip}</div>}
          </div>
        ))}
      </section>

      <section style={{ padding: "1rem", maxWidth: 700, margin: "0 auto" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--terracotta)", marginBottom: 12, fontWeight: 400 }}>Restaurants</h3>
        {city.restaurants.map((r, i) => (
          <div key={i} style={{ background: "var(--bg-card)", borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--cream)", fontSize: "0.95rem" }}>{r.name}</span>
              <span style={{ color: "var(--terracotta)", fontSize: "0.85rem", fontWeight: 600 }}>{r.price}</span>
            </div>
            <div style={{ color: "var(--cream-muted)", fontSize: "0.85rem", marginTop: 2 }}>{r.cuisine}</div>
            {r.tip && <div style={{ color: "var(--terracotta-light)", fontSize: "0.8rem", marginTop: 6 }}>\ud83d\udca1 {r.tip}</div>}
          </div>
        ))}
      </section>

      <section style={{ padding: "1rem", maxWidth: 700, margin: "0 auto" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--terracotta)", marginBottom: 12, fontWeight: 400 }}>Vervoer</h3>
        {city.transport.map((t, i) => (
          <div key={i} style={{ color: "var(--cream-muted)", fontSize: "0.9rem", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            \ud83d\ude83 {t}
          </div>
        ))}
      </section>

      <section style={{ padding: "1rem", maxWidth: 700, margin: "0 auto" }}>
        <button onClick={() => setShowEmergency(!showEmergency)}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(196,112,75,0.3)", background: showEmergency ? "var(--bg-card)" : "transparent", color: "var(--terracotta)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 500 }}>
          \ud83c\udd98 {showEmergency ? "Verberg" : "Toon"} noodnummers
        </button>
        {showEmergency && (
          <div style={{ marginTop: 8, background: "var(--bg-card)", borderRadius: 10, padding: 16 }}>
            {Object.entries(EMERGENCY).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "var(--cream-muted)", fontSize: "0.85rem", textTransform: "capitalize" }}>{k}</span>
                <a href={`tel:${v.replace(/\s/g, "")}`} style={{ color: "var(--terracotta-light)", fontSize: "0.85rem", textDecoration: "none" }}>{v}</a>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--cream-muted)", fontSize: "0.8rem" }}>
        Buon viaggio, Tein & Tessa \ud83c\uddee\ud83c\uddf9
      </footer>
    </div>
  );
}

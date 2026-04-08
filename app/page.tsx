"use client";
import { useState } from "react";

const EMERGENCY = {
  algemeen: "112",
  politie: "113",
  ambulance: "118",
  wegenwacht: "+39 803 116",
  nlAmbassade: "+39 06 3228 6001",
};

interface Place { name: string; desc: string; tip?: string; }
interface Resto { name: string; cuisine: string; price: string; tip?: string; }
interface CityData {
  city: string; region: string; days: string; emoji: string;
  hero: string; intro: string; mustDo: Place[]; restaurants: Resto[]; transport: string[];
}

const CITIES: CityData[] = [
  {
    city: "Napels", region: "Campanië", days: "Dag 1–3", emoji: "🌋",
    hero: "linear-gradient(135deg, #2d1f1a 0%, #4a2c1e 100%)",
    intro: "Rauw, luid en ongelooflijk echt. De geboorteplaats van pizza en de poort naar de Amalfikust.",
    mustDo: [
      { name: "Spaccanapoli", desc: "De hartader van het historisch centrum", tip: "Loop van west naar oost in de ochtend" },
      { name: "Pompeï", desc: "De bevroren stad onder de Vesuvius", tip: "Boek tickets online, ga vroeg" },
      { name: "Cappella Sansevero", desc: "De Christus onder het lijkkleed — adembenemend", tip: "Klein museum, reserveer vooraf" },
      { name: "Vesuvius beklimmen", desc: "Uitzicht over de hele Golf van Napels", tip: "Combi-ticket met Pompeï mogelijk" },
      { name: "Napoli Sotterranea", desc: "Griekse en Romeinse tunnels onder de stad", tip: "Tours elk half uur" },
    ],
    restaurants: [
      { name: "L'Antica Pizzeria Da Michele", cuisine: "Pizza", price: "€", tip: "Alleen margherita of marinara" },
      { name: "Trattoria da Nennella", cuisine: "Napolitaans", price: "€", tip: "Chaotisch en fantastisch. Cash only." },
      { name: "Sorbillo", cuisine: "Pizza", price: "€", tip: "Probeer de frittatina" },
      { name: "Gran Caffè Gambrinus", cuisine: "Café", price: "€€", tip: "Sfogliata en espresso" },
    ],
    transport: [
      "Metro Lijn 1: Garibaldi → Toledo (spectaculair station)",
      "Circumvesuviana naar Pompeï en Sorrento (~€4)",
      "Alibus van/naar luchthaven (~€5)",
      "Pas op voor zakkenrollers in drukke metro's",
    ],
  },
  {
    city: "Amalfikust", region: "Campanië", days: "Dag 4–5", emoji: "🏖️",
    hero: "linear-gradient(135deg, #1a2633 0%, #2d4a5e 100%)",
    intro: "Pastelkleurige dorpen aan kliffen boven een azuurblauwe zee. Elke bocht is een ansichtkaart.",
    mustDo: [
      { name: "Positano", desc: "Het iconische kleurendorp met steile trappen", tip: "Comfortabele schoenen!" },
      { name: "Sentiero degli Dei", desc: "Pad der Goden — kustwandeling Agerola → Nocelle", tip: "Start vroeg, neem 2L water mee" },
      { name: "Ravello", desc: "Villa Rufolo & Cimbrone — tuinen met panorama", tip: "Rustig alternatief voor Positano" },
      { name: "Amalfi kathedraal", desc: "Arabisch-Normandisch met imposante trap", tip: "Gratis toegang" },
      { name: "Limoncello proeven", desc: "Citroenen zo groot als je vuist — overal langs de kust" },
    ],
    restaurants: [
      { name: "Da Vincenzo", cuisine: "Vis", price: "€€€", tip: "Positano — terras reserveren" },
      { name: "Il Ritrovo", cuisine: "Lokaal", price: "€€", tip: "Montepertuso — kookles mogelijk" },
      { name: "Le Arcate", cuisine: "Pizza / pasta", price: "€", tip: "Atrani — budget optie aan zee" },
    ],
    transport: [
      "SITA-bus langs de kust — koop kaartjes bij tabacchi",
      "Veerboot tussen Positano, Amalfi en Salerno",
      "Auto huren afgeraden — smalle wegen, geen parkeren",
      "Vanuit Napels: trein naar Salerno, dan bus of boot",
    ],
  },
  {
    city: "Toscane", region: "Toscane", days: "Dag 6–8", emoji: "🍷",
    hero: "linear-gradient(135deg, #1f2418 0%, #3d4a2a 100%)",
    intro: "Glooiende heuvels, cipressen, wijn en Renaissance. Hier vertraagt de tijd.",
    mustDo: [
      { name: "Uffizi (Firenze)", desc: "Botticelli, Da Vinci, Caravaggio", tip: "Boek weken vooruit" },
      { name: "Ponte Vecchio", desc: "Beroemde brug vol juwelierswinkels", tip: "Mooiste bij zonsondergang" },
      { name: "San Gimignano", desc: "Middeleeuws Manhattan — torens en Vernaccia", tip: "Dondero gelato = wereldkampioen" },
      { name: "Val d'Orcia", desc: "Iconische heuvels — cipressen en gouden licht", tip: "Huur een auto voor een dag" },
      { name: "Siena", desc: "Piazza del Campo en de Duomo", tip: "Compacter dan Firenze, fijner" },
    ],
    restaurants: [
      { name: "Trattoria Mario", cuisine: "Florentijns", price: "€", tip: "Gedeelde tafels, bistecca" },
      { name: "All'Antico Vinaio", cuisine: "Panini", price: "€", tip: "Beroemdste broodjeszaak ter wereld" },
      { name: "Osteria dell'Enoteca", cuisine: "Toscaans", price: "€€", tip: "Wild zwijn ragù in San Gimignano" },
      { name: "La Bottega del Buon Caffè", cuisine: "Fine dining", price: "€€€", tip: "Michelin-ster aan de Arno" },
    ],
    transport: [
      "Firenze SMN is de hub — Trenitalia en Italo",
      "Bus naar San Gimignano via Poggibonsi",
      "Huurauto voor Val d'Orcia en de dorpen",
      "ZTL-zones: niet met auto het centrum in!",
    ],
  },
  {
    city: "Verona", region: "Veneto", days: "Dag 9–10", emoji: "🏟️",
    hero: "linear-gradient(135deg, #1e1520 0%, #3a2845 100%)",
    intro: "Shakespeare's stad van de liefde. Romeinse arena, Amarone en een perfecte afsluiting.",
    mustDo: [
      { name: "Arena di Verona", desc: "Romeins amfitheater — opera in openlucht", tip: "Check arena.it voor programma" },
      { name: "Piazza delle Erbe", desc: "Markt overdag, aperitivo 's avonds", tip: "Torre dei Lamberti voor uitzicht" },
      { name: "Ponte Pietra", desc: "Romeinse brug en teatro aan de Adige", tip: "Castel San Pietro voor panorama" },
      { name: "Juliet's Balkon", desc: "Kitscherig maar onvermijdelijk", tip: "Sla de rij over, plein is gratis" },
      { name: "Amarone proeverij", desc: "Valpolicella op 20 min — bezoek een cantina", tip: "Boek via Viator of direct" },
    ],
    restaurants: [
      { name: "Osteria al Duca", cuisine: "Veronees", price: "€€", tip: "Pastissada de caval" },
      { name: "Trattoria al Pompiere", cuisine: "Klassiek", price: "€€", tip: "Al 100+ jaar, risotto all'Amarone" },
      { name: "Gelateria Savoia", cuisine: "Gelato", price: "€", tip: "Pistachio is legendarisch" },
    ],
    transport: [
      "Verona Porta Nuova — snelle Frecciarossa naar Firenze/Milaan",
      "Compact centrum: alles te voet bereikbaar",
      "Bus 11/12/13 naar Valpolicella wijnstreek",
      "Verona Villafranca airport op 15 min",
    ],
  },
];

/* ── styles ── */
const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" } as const,
  header: {
    textAlign: "center" as const, padding: "80px 0 60px",
    borderBottom: "1px solid rgba(196,112,75,0.2)",
  },
  h1: {
    fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
    fontWeight: 400, color: "var(--terracotta-light)", letterSpacing: "0.04em",
    lineHeight: 1.1, marginBottom: 12,
  },
  subtitle: {
    fontFamily: "var(--font-sans)", fontSize: "1.05rem", color: "var(--cream-muted)",
    fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase" as const,
  },
  nav: {
    display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" as const,
    padding: "32px 0", position: "sticky" as const, top: 0,
    background: "var(--bg)", zIndex: 10, borderBottom: "1px solid rgba(196,112,75,0.1)",
  },
  navBtn: (active: boolean) => ({
    padding: "10px 20px", border: "1px solid",
    borderColor: active ? "var(--terracotta)" : "rgba(196,112,75,0.25)",
    background: active ? "rgba(196,112,75,0.15)" : "transparent",
    color: active ? "var(--terracotta-light)" : "var(--cream-muted)",
    borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-sans)",
    fontSize: "0.9rem", fontWeight: 500, transition: "all 0.2s",
  }),
  heroCard: (bg: string) => ({
    background: bg, borderRadius: 16, padding: "48px 36px",
    marginTop: 32, marginBottom: 40,
  }),
  cityTitle: {
    fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 400, color: "var(--cream)", marginBottom: 4,
  },
  badge: {
    display: "inline-block", padding: "4px 14px", borderRadius: 20,
    background: "rgba(255,255,255,0.08)", color: "var(--cream-muted)",
    fontSize: "0.8rem", fontWeight: 500, marginBottom: 16,
  },
  intro: {
    fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontStyle: "italic" as const,
    color: "var(--cream)", opacity: 0.85, lineHeight: 1.6, maxWidth: 600,
  },
  section: { marginBottom: 40 },
  sectionTitle: {
    fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400,
    color: "var(--terracotta-light)", marginBottom: 20,
    paddingBottom: 8, borderBottom: "1px solid rgba(196,112,75,0.15)",
  },
  card: {
    background: "var(--bg-card)", borderRadius: 12, padding: "20px 24px",
    marginBottom: 12, border: "1px solid rgba(196,112,75,0.08)",
    transition: "background 0.2s",
  },
  cardName: {
    fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem",
    color: "var(--cream)", marginBottom: 4,
  },
  cardDesc: { fontSize: "0.9rem", color: "var(--cream-muted)", marginBottom: 6 },
  tip: {
    fontSize: "0.82rem", color: "var(--terracotta)", fontStyle: "italic" as const,
  },
  priceBadge: {
    display: "inline-block", padding: "2px 8px", borderRadius: 6,
    background: "rgba(196,112,75,0.12)", color: "var(--terracotta-light)",
    fontSize: "0.75rem", fontWeight: 600, marginLeft: 8,
  },
  transportItem: {
    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: "0.9rem", color: "var(--cream-muted)",
  },
  emergencyGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12, marginTop: 32,
  },
  emergencyCard: {
    background: "var(--bg-card)", borderRadius: 10, padding: "16px 20px",
    border: "1px solid rgba(196,112,75,0.1)",
  },
  emergencyLabel: {
    fontSize: "0.75rem", color: "var(--cream-muted)", textTransform: "uppercase" as const,
    letterSpacing: "0.1em", marginBottom: 4,
  },
  emergencyNumber: {
    fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--terracotta-light)",
  },
  footer: {
    textAlign: "center" as const, padding: "48px 0", marginTop: 48,
    borderTop: "1px solid rgba(196,112,75,0.1)",
    fontFamily: "var(--font-serif)", fontSize: "1.1rem",
    color: "var(--cream-muted)", fontStyle: "italic" as const,
  },
};

export default function Page() {
  const [active, setActive] = useState(0);
  const [showEmergency, setShowEmergency] = useState(false);
  const city = CITIES[active];

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1 style={s.h1}>Italia</h1>
        <p style={s.subtitle}>Tein &amp; Tessa &middot; 10 dagen &middot; 2025</p>
      </header>

      <nav style={s.nav}>
        {CITIES.map((c, i) => (
          <button key={c.city} style={s.navBtn(i === active)} onClick={() => setActive(i)}>
            {c.emoji} {c.city}
          </button>
        ))}
        <button
          style={s.navBtn(showEmergency)}
          onClick={() => setShowEmergency(!showEmergency)}
        >
          🆘 Nood
        </button>
      </nav>

      {showEmergency && (
        <div style={{ ...s.section, marginTop: 32 }}>
          <h2 style={s.sectionTitle}>Noodnummers Italië</h2>
          <div style={s.emergencyGrid}>
            {Object.entries(EMERGENCY).map(([k, v]) => (
              <div key={k} style={s.emergencyCard}>
                <div style={s.emergencyLabel}>{k}</div>
                <a href={`tel:${v.replace(/\s/g, "")}`} style={{ ...s.emergencyNumber, textDecoration: "none" }}>
                  {v}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.heroCard(city.hero)}>
        <span style={s.badge}>{city.region} &middot; {city.days}</span>
        <h2 style={s.cityTitle}>{city.emoji} {city.city}</h2>
        <p style={s.intro}>{city.intro}</p>
      </div>

      <section style={s.section}>
        <h3 style={s.sectionTitle}>Must-do&apos;s</h3>
        {city.mustDo.map((p) => (
          <div key={p.name} style={s.card}>
            <div style={s.cardName}>{p.name}</div>
            <div style={s.cardDesc}>{p.desc}</div>
            {p.tip && <div style={s.tip}>💡 {p.tip}</div>}
          </div>
        ))}
      </section>

      <section style={s.section}>
        <h3 style={s.sectionTitle}>Restaurants</h3>
        {city.restaurants.map((r) => (
          <div key={r.name} style={s.card}>
            <div style={s.cardName}>
              {r.name}
              <span style={s.priceBadge}>{r.price}</span>
            </div>
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

      <footer style={s.footer}>
        Buon viaggio, Tein &amp; Tessa 🇮🇹
      </footer>
    </div>
  );
}

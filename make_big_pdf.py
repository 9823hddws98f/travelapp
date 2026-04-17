import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# Load existing app data
with open('/tmp/app_data.json', 'r') as f:
    app_data = json.load(f)

# NEW items from gap analysis research — per city
new_items = {
    "rom": {
        "name": "Rome",
        "spots": [
            {"name":"Galleria Borghese","desc":"Museum met Bernini sculpturen en Caravaggio. Tickets maanden vooruit uitverkocht. Villa Borghese park ernaast met roeibootjes op het meer.","tip":"Boek via galleriaborghese.beniculturali.it, €16-30. Max 2 uur per bezoek. Ga 's ochtends.","link":"https://www.instagram.com/galleriaborgheseufficiale/"},
            {"name":"Testaccio Market","desc":"Rome's beste food market. Binnen: Casa Manco (beste pizza van Rome) en Mordi e Vai (legendarische broodjes). Lokaler dan Campo de' Fiori.","tip":"Open di-za 7-15u. Casa Manco + Mordi e Vai = must. €3-8 per item. Metro B Piramide.","link":"https://www.instagram.com/mercatoditestaccio/"},
            {"name":"Quartiere Coppede","desc":"Surrealistische Art Nouveau wijk met sprookjesachtige architectuur. Fontein der Kikkers. In elke 'verborgen Rome' TikTok met 21K+ likes.","tip":"Gratis. Metro B Buenos Aires. Combineer met Museo MACRO. Ochtend = beste licht.","link":"https://www.instagram.com/explore/tags/quartierecoppede/"},
            {"name":"Ondergrondse Trevi Fontein","desc":"Geheim archeologisch terrein onder de Trevi Fontein — Vicus Caprarius. TikTok @travelbymitra: 308.7K likes. Romeinse ruines onder de fontein.","tip":"€4 entree. 10 min bezoek. Naast de fontein, makkelijk te missen.","link":"https://www.instagram.com/vicuscaprarius/"},
        ],
        "restaurants": [
            {"name":"Suppli Roma","desc":"Suppli al telefono: gefrituurde rijstbal met stretchy mozzarella cheese-pull. DE Romeinse snack op TikTok. 'God-tier Roman snack.'","tip":"Via dei Giubbonari 28. €2.50-4. Neem de klassieke suppli + amatriciana. Cash handig.","link":"https://www.instagram.com/suppliroma/","price":"€"},
            {"name":"Roscioli","desc":"Rome's beste carbonara en cacio e pepe. Bakkerij ernaast (Antico Forno) voor pizza rossa. 'Als je in Rome was maar niet bij Roscioli — was je dan echt in Rome?'","tip":"Reserveer restaurant via rfroscioli.com, €40-60pp. Bakkerij: gewoon instappen, €2-5/stuk.","link":"https://www.instagram.com/raboroscioli/","price":"€€"},
            {"name":"Osteria da Fortunata","desc":"DE virale TikTok-restaurant van Rome. Nonna's rollen verse pasta zichtbaar door het raam. @femalefoodie video met 67K likes.","tip":"Meerdere locaties, origineel: Via del Pellegrino 11. Ga 30 min voor opening. €30-40pp.","link":"https://www.instagram.com/osteriadafortunata/","price":"€€"},
            {"name":"Nannarella","desc":"Trastevere pasta-instituut. 'Honderden keren aanbevolen op TikTok.' Wachtrijen van 40+ minuten zijn normaal.","tip":"Piazza di San Cosimato. Geen reserveringen, ga voor opening. Cacio e pepe of carbonara. €10-20pp.","link":"https://www.instagram.com/nannarellaroma/","price":"€"},
            {"name":"Tonnarello","desc":"60K+ Google reviews met 4.7 gemiddeld. Beroemd om cacio e pepe en €7 tiramisu. Romantische Trastevere setting met kinderkopjes.","tip":"Via della Paglia 77, Trastevere. Reserveer! €20-35pp. Buiten zitten = magisch.","link":"https://www.instagram.com/tonnarello_roma/","price":"€€"},
            {"name":"Dar Poeta","desc":"48 uur gerezen deeg en de legendarische Nutella-ricotta calzone. Wisteria-overgroeid steegje in Trastevere. Goop aanbeveling.","tip":"Vicolo del Bologna 45. €8-14/pizza. Calzone met Nutella+ricotta = must. Geen reserveringen.","link":"https://www.instagram.com/darpoetaroma/","price":"€"},
            {"name":"Felice a Testaccio","desc":"De ober voert tableside cacio e pepe op — dramatisch tossend en mixend. Roberto Benigni wijdde er een gedicht aan.","tip":"Via Mastro Giorgio 29. Reserveer weken vooruit! €35-50pp. Bestel de cacio e pepe + tiramisu.","link":"https://www.instagram.com/feliceatestaccio/","price":"€€"},
            {"name":"Bonci Pizzarium","desc":"Gabriele Bonci = de Michelangelo van pizza. Pizza al taglio (per gewicht) met creatieve toppings. TikTok food-bijbel.","tip":"Via della Meloria 43 (bij Vaticaan). €5-10 voor genoeg stukken. Lunch = druk, ga 14-15u.","link":"https://www.instagram.com/gabrielebonci/","price":"€"},
            {"name":"Mr. 100 Tiramisu","desc":"Lopende band met 100 verschillende tiramisu smaken, elk beoordeeld op zoetheid. De visuele tiramisu-band = pure TikTok-goud.","tip":"Via di Tor Millina 34 (bij Piazza Navona). €5-6 per stuk. Pistachio en klassiek = beste.","link":"https://www.instagram.com/mr100tiramisu/","price":"€"},
            {"name":"Lucciano's","desc":"Gelato ijsjes in de vorm van het Colosseum en andere Romeinse monumenten. Meest Instagramwaardige gelato van Rome.","tip":"Meerdere locaties, o.a. Via del Pantheon. €5-8. Probeer de Colosseum-vorm met pistachio.","link":"https://www.instagram.com/luccianos_/","price":"€"},
        ],
        "viral": [
            {"name":"Suppli cheese-pull","desc":"De stretchy mozzarella 'telefoonlijn' van de suppli al telefono is in elke Rome food-TikTok. Bij Suppli Roma, Via dei Giubbonari 28.","tag":"@riki_andriola viral","link":"https://www.instagram.com/suppliroma/"},
            {"name":"Fortunata nonna's","desc":"Oma's die verse pasta rollen achter het raam. Elke food-creator filmt dit. Meerdere locaties in Rome.","tag":"@femalefoodie 67K likes","link":"https://www.instagram.com/osteriadafortunata/"},
            {"name":"Felice tableside cacio e pepe","desc":"De theatrale bereiding van cacio e pepe aan tafel — de ober tost en mixt dramatisch. Hypnotiserend.","tag":"@theitalianfoodaholic viral","link":"https://www.instagram.com/feliceatestaccio/"},
            {"name":"Ondergrondse Trevi","desc":"Geheim archeologisch terrein pal naast de Trevi Fontein. Romeinse ruines onder de beroemdste fontein. 308.7K likes.","tag":"@travelbymitra 308K likes","link":"https://www.instagram.com/vicuscaprarius/"},
            {"name":"Paolina Roma charmbandjes","desc":"Custom charm bracelet shop. Een TikTok met 3.3 MILJOEN views. Constante rijen toeristen die Rome-themed bandjes maken.","tag":"3.3M views TikTok","link":"https://www.instagram.com/paolinaroma/"},
            {"name":"Mr. 100 Tiramisu band","desc":"Lopende band met 100 tiramisu-smaken = de ultieme TikTok food-content. Bij Piazza Navona.","tag":"TikTok viral 2025","link":"https://www.instagram.com/mr100tiramisu/"},
            {"name":"Quartiere Coppede sprookjeswijk","desc":"Art Nouveau sprookjesarchitectuur. In elke 'verborgen Rome' TikTok. Fontein der Kikkers = fotospot.","tag":"Hidden gem 21K+ likes","link":"https://www.instagram.com/explore/tags/quartierecoppede/"},
            {"name":"Testaccio Market food tour","desc":"Beste food market van Rome. Casa Manco pizza + Mordi e Vai broodjes = het echte Rome. Geen toeristen.","tag":"@femalefoodie tip","link":"https://www.instagram.com/mercatoditestaccio/"},
        ],
    },
    "extra_florence": {
        "restaurants": [
            {"name":"Osteria Pastella","desc":"DE meest virale Florence restaurant. Truffle tagliatelle geflambeerd in een Grana Padano kaaswiel aan tafel. 140K+ likes op één video.","tip":"Reserveer via TheFork! Truffle cheese wheel pasta ~€26-28. Via delle Terme 1. #osteriapastella = miljoenen views.","link":"https://www.instagram.com/osteriapastella/","price":"€€"},
            {"name":"Gelateria dei Neri","desc":"Beste gelato van Florence op TikTok. Ricotta met vijg en Siciliaanse brioche gelato-sandwiches.","tip":"Via dei Neri (zelfde straat als Vinaio). ~€3. Probeer ricotta-vijg en crema.","link":"https://www.instagram.com/gelateria_dei_neri/","price":"€"},
        ],
        "viral": [
            {"name":"Osteria Pastella kaaswiel","desc":"Truffle tagliatelle bereid in een gigantisch Grana Padano kaaswiel en geflambeerd aan tafel. 140K+ likes. Het meest gefilmde gerecht van Italië.","tag":"@erinnobrienn 140K likes","link":"https://www.instagram.com/osteriapastella/"},
            {"name":"Giardino Bardini wisteria","desc":"De wisteria-tunnel in het voorjaar is een van Florence's meest gedeelde foto's. Panoramisch uitzicht met veel minder drukte dan Piazzale.","tag":"Hidden gem spring","link":"https://www.instagram.com/giardinobardini/"},
            {"name":"Officina Santa Maria Novella","desc":"Oudste apotheek ter wereld (1221). Opulente fresco-kamers en eeuwenoude parfumrecepten. Gratis entree, producten vanaf €15.","tag":"@florence hidden gems","link":"https://www.instagram.com/smnovella/"},
        ],
        "spots": [
            {"name":"Giardino Bardini","desc":"Renaissancetuin met de beroemde wisteria-tunnel in april/mei. Panoramisch uitzicht over Florence met veel minder drukte dan Piazzale Michelangelo.","tip":"€10 entree. April-mei = wisteria bloei. Costa San Giorgio 2. Combineer met Boboli-tuinen.","link":"https://www.instagram.com/giardinobardini/"},
        ],
    },
    "extra_amalfi": {
        "viral": [
            {"name":"Music on the Rocks","desc":"Nachtclub GEBOUWD IN EEN GROT op het strand van Positano. 'IT'S LITERALLY IN A CAVE' = veelgebruikt TikTok-onderschrift. Spectaculair.","tag":"@ckanani cave club viral","link":"https://www.instagram.com/musicontherockspositano/"},
        ],
        "restaurants": [
            {"name":"Music on the Rocks","desc":"Nachtclub in een grot direct aan het strand van Positano. Dansen met je voeten in het zand terwijl de golven binnenkomen.","tip":"~€50 entree of gratis met diner bij zusterrestaurant. Open mei-okt, do-za. Reserveer!","link":"https://www.instagram.com/musicontherockspositano/","price":"€€"},
        ],
    },
    "extra_garda": {
        "viral": [
            {"name":"Busatte-Tempesta trail","desc":"400 metalen treden boven een steile klif met panoramisch uitzicht over het meer. POV-wandelvideo's van de duizelingwekkende trappen gaan massaal viral.","tag":"TikTok POV viral","link":"https://www.instagram.com/visitgarda/"},
        ],
    },
    "extra_venice": {
        "viral": [
            {"name":"Teatro Italia supermarkt","desc":"Een theater uit 1910 met fresco's, kroonluchters en glas-in-lood dat nu een werkende supermarkt is. TikTok-video's van pasta kopen onder ornate plafonds = miljoenen views.","tag":"TikTok viral hidden gem","link":"https://www.instagram.com/desaborsa/"},
        ],
    },
}

# Build the PDF
ACCENT = HexColor('#c4704b')
DARK = HexColor('#1a1a1a')
GRAY = HexColor('#666666')
LIGHT = HexColor('#999999')
BLUE = HexColor('#4a6cf7')
GREEN = HexColor('#16a34a')
YELLOW = HexColor('#d97706')

W, H = A4

doc = SimpleDocTemplate(
    '/home/claude/italia_viral_gids_compleet.pdf',
    pagesize=A4,
    topMargin=1.2*cm, bottomMargin=1.2*cm,
    leftMargin=1.8*cm, rightMargin=1.8*cm,
)

s = {
    'title': ParagraphStyle('t', fontName='Helvetica-Bold', fontSize=32, textColor=DARK, alignment=TA_CENTER, spaceAfter=3*mm),
    'sub': ParagraphStyle('s', fontName='Helvetica', fontSize=14, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6*mm),
    'sub2': ParagraphStyle('s2', fontName='Helvetica', fontSize=11, textColor=GRAY, alignment=TA_CENTER, spaceAfter=4*mm),
    'city': ParagraphStyle('c', fontName='Helvetica-Bold', fontSize=24, textColor=ACCENT, spaceBefore=4*mm, spaceAfter=2*mm),
    'cat': ParagraphStyle('cat', fontName='Helvetica-Bold', fontSize=13, textColor=DARK, spaceBefore=5*mm, spaceAfter=2*mm),
    'name': ParagraphStyle('n', fontName='Helvetica-Bold', fontSize=10.5, textColor=DARK, spaceAfter=0.5*mm, leading=13),
    'desc': ParagraphStyle('d', fontName='Helvetica', fontSize=9, textColor=GRAY, leading=12, spaceAfter=0.5*mm),
    'link': ParagraphStyle('l', fontName='Helvetica', fontSize=8, textColor=ACCENT, spaceAfter=2.5*mm),
    'footer': ParagraphStyle('f', fontName='Helvetica-Oblique', fontSize=9, textColor=LIGHT, alignment=TA_CENTER),
    'new': ParagraphStyle('new', fontName='Helvetica-Bold', fontSize=8, textColor=GREEN),
}

story = []

# COVER
story.append(Spacer(1, 50*mm))
story.append(Paragraph('Italia 2026', s['title']))
story.append(Paragraph('De Complete Virale Gids', ParagraphStyle('x', fontName='Helvetica-Bold', fontSize=18, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=4*mm)))
story.append(Paragraph('TikTok & Instagram Hits — Klikbare Links', s['sub']))
story.append(HRFlowable(width='50%', color=ACCENT, thickness=1, spaceAfter=8*mm))
story.append(Paragraph('Tein & Tessa — 17 t/m 26 april 2026', s['sub2']))
story.append(Spacer(1, 15*mm))
story.append(Paragraph('8 steden — 175+ plekken', ParagraphStyle('cnt', fontName='Helvetica-Bold', fontSize=13, textColor=DARK, alignment=TA_CENTER, spaceAfter=3*mm)))

city_list = 'Venetië — Gardameer — Verona — Florence & Toscane<br/>Rome — Napoli — Amalfikust — Apuaanse Alpen'
story.append(Paragraph(city_list, ParagraphStyle('cl', fontName='Helvetica', fontSize=10, textColor=GRAY, alignment=TA_CENTER, leading=14, spaceAfter=15*mm)))

story.append(Paragraph('Per stad, per categorie:<br/><b>Cultuur & Spots</b> — <b>Eten & Drinken</b> — <b>TikTok & Instagram Viral</b><br/><br/>Alle links zijn klikbaar. Tik op een naam of link<br/>om direct naar Instagram, TikTok of de website te gaan.', ParagraphStyle('intro', fontName='Helvetica', fontSize=10, textColor=GRAY, alignment=TA_CENTER, leading=14)))

story.append(PageBreak())

def add_item(i, item, cat_type):
    name = item['name']
    link = item.get('link', '')
    desc = item.get('desc', item.get('tip', ''))
    price = item.get('price', '')
    
    if cat_type == 'restaurant':
        desc = item.get('tip', item.get('desc', ''))
        if price:
            price_show = f' <font color="#c4704b">({price})</font>'
        else:
            price_show = ''
    else:
        price_show = ''
    
    if link:
        name_html = f'<b>{i}.</b> <a href="{link}" color="#c4704b"><b>{name}</b></a>{price_show}'
    else:
        name_html = f'<b>{i}.</b> <b>{name}</b>{price_show}'
    
    story.append(Paragraph(name_html, s['name']))
    
    if desc:
        if len(desc) > 250:
            desc = desc[:247] + '...'
        story.append(Paragraph(desc, s['desc']))
    
    if link:
        if 'tiktok.com' in link: plat = 'TikTok'
        elif 'instagram.com' in link: plat = 'Instagram'
        elif 'tripadvisor' in link: plat = 'TripAdvisor'
        else: plat = 'Website'
        short = link[:70] + ('...' if len(link)>70 else '')
        story.append(Paragraph(f'<a href="{link}" color="#c4704b">{plat}: {short}</a>', s['link']))

cat_colors = {
    'Cultuur & Spots': ACCENT,
    'Eten & Drinken': YELLOW,
    'TikTok & Instagram Viral': BLUE,
}

cities_full = [
    ('ven', 'Venetië', 'extra_venice'),
    ('gar', 'Gardameer', 'extra_garda'),
    ('ver', 'Verona', None),
    ('tos', 'Florence & Toscane', 'extra_florence'),
    ('rom', 'Rome', None),  # entirely new
    ('nap', 'Napoli', None),
    ('ama', 'Amalfikust', 'extra_amalfi'),
    ('apu', 'Apuaanse Alpen', None),
]

for cid, cname, extra_key in cities_full:
    story.append(Paragraph(f'{cname}', s['city']))
    story.append(HRFlowable(width='100%', color=ACCENT, thickness=0.5, spaceAfter=3*mm))
    
    # Merge app data + new items
    if cid in app_data:
        spots = list(app_data[cid]['spots'])
        rests = list(app_data[cid]['restaurants'])
        viral = list(app_data[cid]['viral'])
    elif cid in new_items:
        spots = list(new_items[cid].get('spots', []))
        rests = list(new_items[cid].get('restaurants', []))
        viral = list(new_items[cid].get('viral', []))
    else:
        spots, rests, viral = [], [], []
    
    # Add extra items
    if extra_key and extra_key in new_items:
        extra = new_items[extra_key]
        spots += extra.get('spots', [])
        rests += extra.get('restaurants', [])
        viral += extra.get('viral', [])
    
    categories = [
        ('Cultuur & Spots', spots, 'spot'),
        ('Eten & Drinken', rests, 'restaurant'),
        ('TikTok & Instagram Viral', viral, 'viral'),
    ]
    
    for cat_name, items, cat_type in categories:
        if not items:
            continue
        color = cat_colors[cat_name]
        icon = {'Cultuur & Spots':'🏛️','Eten & Drinken':'🍽️','TikTok & Instagram Viral':'📱'}[cat_name]
        story.append(Paragraph(f'<font color="#{color.hexval()[2:]}">{icon} {cat_name}</font>', s['cat']))
        
        for i, item in enumerate(items[:10], 1):
            add_item(i, item, cat_type)
    
    story.append(PageBreak())

# FINAL
story.append(Spacer(1, 40*mm))
story.append(Paragraph('Buon Viaggio!', ParagraphStyle('bv', fontName='Helvetica-Bold', fontSize=28, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6*mm)))
story.append(Paragraph('Tein & Tessa — Italia 2026', s['sub2']))
story.append(Spacer(1, 10*mm))
story.append(Paragraph('Alle links zijn klikbaar in deze PDF.<br/>Open in je PDF-reader en tik op een link<br/>om direct naar de Instagram of TikTok te gaan.<br/><br/>Goed eten, mooie plekken, en onvergetelijke momenten.', ParagraphStyle('note', fontName='Helvetica', fontSize=10, textColor=GRAY, alignment=TA_CENTER, leading=14)))

doc.build(story)
print("PDF created!")

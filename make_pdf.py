import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

with open('/tmp/italia_data.json', 'r') as f:
    raw = json.load(f)

cities_order = raw['cities']
data = raw['data']

ACCENT = HexColor('#c4704b')
DARK = HexColor('#1a1a1a')
GRAY = HexColor('#666666')
LIGHT = HexColor('#999999')
BG = HexColor('#f5f0eb')
WHITE = HexColor('#ffffff')
GREEN = HexColor('#22c55e')
BLUE = HexColor('#6366f1')
YELLOW = HexColor('#f59e0b')

doc = SimpleDocTemplate(
    '/home/claude/italia-travel/italia_viral_guide.pdf',
    pagesize=A4,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm,
    leftMargin=2*cm,
    rightMargin=2*cm,
)

styles = {
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=28, textColor=DARK, spaceAfter=4*mm, alignment=TA_CENTER),
    'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=12, textColor=GRAY, spaceAfter=8*mm, alignment=TA_CENTER),
    'city': ParagraphStyle('city', fontName='Helvetica-Bold', fontSize=22, textColor=ACCENT, spaceBefore=6*mm, spaceAfter=3*mm),
    'category': ParagraphStyle('category', fontName='Helvetica-Bold', fontSize=13, textColor=DARK, spaceBefore=5*mm, spaceAfter=2*mm),
    'item_name': ParagraphStyle('item_name', fontName='Helvetica-Bold', fontSize=11, textColor=DARK, spaceAfter=1*mm),
    'item_desc': ParagraphStyle('item_desc', fontName='Helvetica', fontSize=9, textColor=GRAY, spaceAfter=1*mm, leading=12),
    'item_link': ParagraphStyle('item_link', fontName='Helvetica', fontSize=8, textColor=ACCENT, spaceAfter=3*mm),
    'footer': ParagraphStyle('footer', fontName='Helvetica-Oblique', fontSize=9, textColor=LIGHT, alignment=TA_CENTER),
    'price': ParagraphStyle('price', fontName='Helvetica', fontSize=9, textColor=ACCENT),
    'num': ParagraphStyle('num', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE),
}

story = []

# Cover page
story.append(Spacer(1, 60*mm))
story.append(Paragraph('Italia 2026', styles['title']))
story.append(Paragraph('Virale TikTok & Instagram Gids', ParagraphStyle('st2', fontName='Helvetica', fontSize=16, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6*mm)))
story.append(Paragraph('Tein & Tessa — 17 t/m 26 april', styles['subtitle']))
story.append(Spacer(1, 10*mm))
story.append(HRFlowable(width='60%', color=ACCENT, thickness=1, spaceAfter=10*mm))
story.append(Paragraph('133 plekken met klikbare links', ParagraphStyle('count', fontName='Helvetica', fontSize=11, textColor=GRAY, alignment=TA_CENTER, spaceAfter=4*mm)))

cities_text = ' — '.join([f'{e} {n}' for _, n, e in cities_order])
story.append(Paragraph(cities_text, ParagraphStyle('cities', fontName='Helvetica', fontSize=9, textColor=LIGHT, alignment=TA_CENTER, spaceAfter=20*mm)))

story.append(Paragraph('Alle restaurants, spots en virale TikTok-hits<br/>per stad met Instagram en TikTok links.', ParagraphStyle('intro', fontName='Helvetica', fontSize=10, textColor=GRAY, alignment=TA_CENTER, leading=14)))

story.append(PageBreak())

# Per city
cat_colors = {'Cultuur & Spots': ACCENT, 'Eten & Drinken': YELLOW, 'TikTok & Instagram Viral': BLUE}
cat_icons = {'Cultuur & Spots': '🏛️', 'Eten & Drinken': '🍽️', 'TikTok & Instagram Viral': '📱'}

for cid, cname, emoji in cities_order:
    d = data[cid]
    
    story.append(Paragraph(f'{emoji} {cname}', styles['city']))
    story.append(HRFlowable(width='100%', color=ACCENT, thickness=0.5, spaceAfter=4*mm))
    
    categories = [
        ('Cultuur & Spots', d['spots']),
        ('Eten & Drinken', d['restaurants']),
        ('TikTok & Instagram Viral', d['viral']),
    ]
    
    for cat_name, items in categories:
        if not items:
            continue
        
        icon = cat_icons[cat_name]
        color = cat_colors[cat_name]
        
        story.append(Paragraph(f'{icon} {cat_name}', ParagraphStyle('cat', fontName='Helvetica-Bold', fontSize=12, textColor=color, spaceBefore=4*mm, spaceAfter=2*mm)))
        
        for i, item in enumerate(items[:10]):
            name = item['name']
            link = item.get('link', '')
            
            # Build description
            if 'type' in item:  # restaurant
                desc = item.get('tip', '')
                price = item.get('price', '')
                price_display = f' ({price})' if price else ''
            elif 'tag' in item:  # viral
                desc = item.get('desc', '')
                price_display = ''
            else:  # spot
                desc = item.get('desc', '')
                price_display = ''
            
            # Name with link
            if link:
                name_html = f'<b>{i+1}.</b> <a href="{link}" color="#c4704b"><b>{name}</b></a>{price_display}'
            else:
                name_html = f'<b>{i+1}.</b> <b>{name}</b>{price_display}'
            
            story.append(Paragraph(name_html, ParagraphStyle('iname', fontName='Helvetica', fontSize=10, textColor=DARK, spaceAfter=0.5*mm, leading=13)))
            
            if desc:
                # Truncate long descriptions
                if len(desc) > 200:
                    desc = desc[:197] + '...'
                story.append(Paragraph(desc, styles['item_desc']))
            
            if link:
                # Determine platform
                if 'tiktok.com' in link:
                    platform = 'TikTok'
                elif 'instagram.com' in link:
                    platform = 'Instagram'
                elif 'tripadvisor' in link:
                    platform = 'TripAdvisor'
                else:
                    platform = 'Website'
                
                link_html = f'<a href="{link}" color="#c4704b">{platform}: {link[:60]}{"..." if len(link)>60 else ""}</a>'
                story.append(Paragraph(link_html, styles['item_link']))
            
            story.append(Spacer(1, 1*mm))
    
    story.append(PageBreak())

# Final page
story.append(Spacer(1, 40*mm))
story.append(Paragraph('Buon Viaggio!', ParagraphStyle('bv', fontName='Helvetica-Bold', fontSize=24, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6*mm)))
story.append(Paragraph('Tein & Tessa — Italia 2026', styles['subtitle']))
story.append(Spacer(1, 10*mm))
story.append(Paragraph('Alle links zijn klikbaar in deze PDF.<br/>Open in je PDF-reader en tik op een link<br/>om direct naar de Instagram of TikTok te gaan.', ParagraphStyle('note', fontName='Helvetica', fontSize=10, textColor=GRAY, alignment=TA_CENTER, leading=14)))

doc.build(story)
print("PDF created!")

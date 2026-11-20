import sys
from PIL import Image, ImageDraw, ImageFont
# 사용: make_thumb.py out.jpg "카테고리" "글 제목"
# 11/20 사용자: 카테고리마다 배경(색·아이콘)을 고정하고 제목만 바꿔 넣는다.
# 제목은 첫 쉼표 앞(검색어)을 크게, 뒤(결론)를 노란 글씨로 작게. 글자는 가운데(목록 썸네일 3:2 크롭 안).
out, cat, title = sys.argv[1], sys.argv[2], sys.argv[3]
TPL = {  # 카테고리: (위 색, 아래 색, 격자 색, 아이콘)
    '연봉·퇴직': ((0, 26, 82), (8, 44, 120), (20, 48, 105), 'coin'),
    '대출·부동산': ((0, 60, 70), (0, 95, 105), (15, 85, 95), 'house'),
    '세금·연말정산': ((40, 20, 90), (70, 40, 140), (60, 40, 120), 'calc'),
    '건강 수치': ((100, 20, 50), (150, 40, 80), (125, 40, 70), 'heart'),
    '날짜·나이': ((5, 60, 40), (15, 95, 65), (20, 80, 55), 'calendar'),
}
top, bot, gridc, icon = TPL[cat]
W, H = 1200, 630
img = Image.new('RGB', (W, H)); d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H; d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
for x in range(0, W, 40): d.line([(x, 0), (x, H)], fill=gridc)
for y in range(0, H, 40): d.line([(0, y), (W, y)], fill=gridc)
B = '/home/tjd618/.local/share/fonts/cjk/NotoSansKR-Bold.otf'; R = '/home/tjd618/.local/share/fonts/NotoSansKR-Regular.ttf'
BLUE, WHITE, SOFT, DARK = (59, 130, 246), (255, 255, 255), (150, 180, 235), (30, 64, 140)
cx, cy, s = 600, 140, 0.75  # 아이콘 중심·크기
def R_(v): return int(v * s)
def coin():
    d.ellipse([cx-R_(95), cy-R_(95), cx+R_(95), cy+R_(95)], fill=DARK, outline=SOFT, width=5)
    f = ImageFont.truetype(B, R_(110)); w = d.textlength('₩', font=f); d.text((cx-w/2, cy-R_(82)), '₩', font=f, fill=WHITE)
def house():
    d.polygon([(cx-R_(95), cy-R_(5)), (cx, cy-R_(95)), (cx+R_(95), cy-R_(5))], fill=BLUE)
    d.rectangle([cx-R_(70), cy-R_(5), cx+R_(70), cy+R_(90)], fill=DARK, outline=SOFT, width=4)
    d.rectangle([cx-R_(20), cy+R_(30), cx+R_(20), cy+R_(90)], fill=(15, 35, 85))
def calc():
    d.rounded_rectangle([cx-R_(70), cy-R_(95), cx+R_(70), cy+R_(95)], 14, fill=DARK, outline=SOFT, width=4)
    d.rounded_rectangle([cx-R_(50), cy-R_(75), cx+R_(50), cy-R_(35)], 6, fill=(15, 35, 85))
    for r in range(3):
        for c in range(3):
            x0 = cx-R_(50) + c*R_(36); y0 = cy-R_(20) + r*R_(36)
            d.rounded_rectangle([x0, y0, x0+R_(28), y0+R_(28)], 4, fill=BLUE if (r, c) == (2, 2) else (70, 110, 190))
def heart():
    d.ellipse([cx-R_(90), cy-R_(80), cx+R_(5), cy+R_(15)], fill=BLUE); d.ellipse([cx-R_(5), cy-R_(80), cx+R_(90), cy+R_(15)], fill=BLUE)
    d.polygon([(cx-R_(86), cy-R_(15)), (cx+R_(86), cy-R_(15)), (cx, cy+R_(95))], fill=BLUE)
    d.line([(cx-R_(60), cy-R_(10)), (cx-R_(25), cy-R_(10)), (cx-R_(10), cy-R_(40)), (cx+R_(10), cy+R_(25)), (cx+R_(25), cy-R_(10)), (cx+R_(60), cy-R_(10))], fill=WHITE, width=6)
def calendar():
    d.rounded_rectangle([cx-R_(90), cy-R_(80), cx+R_(90), cy+R_(95)], 12, fill=DARK, outline=SOFT, width=4)
    d.rectangle([cx-R_(90), cy-R_(80), cx+R_(90), cy-R_(35)], fill=BLUE)
    for x in (cx-R_(45), cx+R_(45)): d.rounded_rectangle([x-6, cy-R_(100), x+6, cy-R_(60)], 4, fill=SOFT)
    for r in range(3):
        for c in range(4):
            x0 = cx-R_(70) + c*R_(38); y0 = cy-R_(20) + r*R_(36)
            d.rounded_rectangle([x0, y0, x0+R_(26), y0+R_(24)], 3, fill=WHITE if (r, c) == (1, 2) else (70, 110, 190))
{'coin': coin, 'house': house, 'calc': calc, 'heart': heart, 'calendar': calendar}[icon]()

def wrap(text, font, maxw):  # 공백 기준 줄바꿈
    lines, cur = [], ''
    for w in text.split(' '):
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
head, _, tail = title.partition(',')
head, tail = head.strip(), tail.strip()
MAXW = 820
sz = 84
while True:
    fh = ImageFont.truetype(B, sz); hl = wrap(head, fh, MAXW)
    if len(hl) <= 2 or sz <= 52: break
    sz -= 4
y = 245
for l in hl:
    w = d.textlength(l, font=fh); d.text((cx-w/2, y), l, font=fh, fill=WHITE); y += int(sz * 1.25)
if tail:
    ft = ImageFont.truetype(B, 40); tl = wrap(tail, ft, MAXW)[:2]
    y += 10
    for l in tl:
        w = d.textlength(l, font=ft); d.text((cx-w/2, y), l, font=ft, fill=(255, 225, 140)); y += 54
f3 = ImageFont.truetype(R, 24); bn = cat + '  ·  제이퍼 계산기 노트'; w = d.textlength(bn, font=f3)
d.text((cx-w/2, 580), bn, font=f3, fill=SOFT)
img.save(out, quality=85)

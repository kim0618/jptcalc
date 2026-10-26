"""최종 리뷰 시트 합성(검수용, 배포 제외, 2026-10-20): Claude in Chrome 캡처(viewport2.html, 제목 READY|y=스크롤|H=높이)를
실제 스크롤 위치로 이어 붙여 화면별 시트 1장으로 만든다. 390은 1:1로 세로를 잘라 나란히, 1280은 0.9배 두 단. 가로 2400px 이하.
고정 요소: 위(머리 + sticky 목차)와 아래(탭바·결과 바)는 다음 장과 겹치는 범위에서 덜어 낸다(첫 장 위·마지막 장 아래는 그대로).
사용: python3 design/tools/review_sheets.py MANIFEST... --meta META.json --out design/review-final"""
import sys, os, re, json, math
from PIL import Image, ImageDraw, ImageFont
args = sys.argv[1:]
out = args[args.index('--out') + 1]; meta = json.load(open(args[args.index('--meta') + 1], encoding='utf-8'))
mans = [a for a in args if a.endswith('.txt')]
os.makedirs(out, exist_ok=True)
GRAY = (0x7a, 0x7f, 0x87)
FONT = None
for f in ('/mnt/c/Windows/Fonts/malgunbd.ttf', '/mnt/c/Windows/Fonts/malgun.ttf'):
    if os.path.exists(f): FONT = f; break
def font(n): return ImageFont.truetype(FONT, n) if FONT else ImageFont.load_default()
M = {}
for mf in mans:
    for l in open(mf, encoding='utf-8-sig'):
        p = l.rstrip('\r\n').split('\t')
        if len(p) >= 3 and p[0] != 'VIEWPORT':
            y = re.search(r'y=(\d+)', p[2]); H = re.search(r'H=(\d+)', p[2])
            M[p[0]] = (p[1].replace('C:\\', '/mnt/c/').replace('\\', '/'), int(y.group(1)) if y else 0, int(H.group(1)) if H else 0)
def edge(im):
    y = im.height // 2; px = im.load(); x = im.width - 1
    while x > 0 and all(abs(a - b) <= 10 for a, b in zip(px[x, y], GRAY)): x -= 1
    return x + 1
def shot(name, w, vh):
    f, y, H = M[name]; im = Image.open(f).convert('RGB'); e = edge(im); sc = e / w
    return im.crop((0, 0, e, round(vh * sc))).resize((w, vh), Image.LANCZOS), y, H
VH = {390: 844, 1280: 800}; TOP = {390: 110, 1280: 120}; BOT = {390: 120, 1280: 70}
def stitch(sh, key, w, n):
    shots = [shot(f'{sh}-{key}-{w}-{i:02d}', w, VH[w]) for i in range(n) if f'{sh}-{key}-{w}-{i:02d}' in M]
    H = max(s[2] for s in shots) or (max(s[1] for s in shots) + VH[w])
    seen = {}; [seen.setdefault(y, (im, y)) for im, y, _ in shots]
    order = sorted(seen.values(), key=lambda t: t[1])
    can = Image.new('RGB', (w, H), 'white')
    for im, y in order: can.paste(im, (0, y))                         # 1차: 통째로(빈틈 방지)
    for k, (im, y) in enumerate(order):                                # 2차: 고정 요소를 덜어 낸 띠로 덮기
        t = 0 if k == 0 else TOP[w]; b = VH[w] if k == len(order) - 1 else VH[w] - BOT[w]
        can.paste(im.crop((0, t, w, b)), (0, y + t))
    return can
def cols(img, col_h, gap=16):   # 세로로 잘라 나란히
    k = math.ceil(img.height / col_h); W = k * img.width + (k - 1) * gap
    o = Image.new('RGB', (W, min(col_h, img.height)), (200, 203, 208))
    for i in range(k): o.paste(img.crop((0, i * col_h, img.width, min((i + 1) * col_h, img.height))), (i * (img.width + gap), 0))
    return o
def label(img, text, sz=26):
    o = Image.new('RGB', (img.width, img.height + sz + 16), (255, 255, 255)); d = ImageDraw.Draw(o)
    d.text((4, 4), text, fill=(40, 48, 70), font=font(sz)); o.paste(img, (0, sz + 16)); return o
TITLES = {'01': '홈 (최근 기록 3개 상태)', '02': '헤더 메뉴: 상황별·카테고리 열림(1280) / 모바일 메뉴 시트·탭바(390)', '03': '상황 시트 "집 살 때"',
          '04': '허브: 부동산', '05': '허브: 이직/연봉', '06': '취득세: 빈 상태 → 입력 후 결과(결과 바) → 하단', '07': 'DSR: 결과 + 판정 배지 + 이어서 계산',
          '08': '연봉 실수령액: 결과 + 구성 막대 + 저장·공유 펼침', '09': 'BMI', '10': '만 나이 (날짜 입력)', '11': '블로그 목록 (전체 + 부동산 필터)',
          '12': '블로그 글: holding-tax-guide', '13': '정보 페이지: 소개 + 개인정보처리방침 첫 화면', '14': '404 + /recent/', '15': 'DTI (옛 판, 비교용)'}
sheets = {}
for sh, key, title, w, mode, n in meta: sheets.setdefault(sh, []).append((key, title, w, mode, n))
names = {}
for sh, items in sorted(sheets.items()):
    blocks = []
    for key, title, w, mode, n in items:
        if mode == 'single':
            im, _, _ = shot(f'{sh}-{key}-{w}-00', w, VH[w])
            if w == 1280: im = im.resize((1152, 720), Image.LANCZOS)
            blocks.append(label(im, f'{title}  ·  {w}'))
        else:
            can = stitch(sh, key, w, n)
            if w == 390:
                k = max(1, min(5, math.ceil(can.height / 1700))); blocks.append(label(cols(can, math.ceil(can.height / k)), f'{title}  ·  390 전체 (세로로 잘라 나란히)'))
            else:
                s = can.resize((1152, round(can.height * 0.9)), Image.LANCZOS)
                blocks.append(label(cols(s, math.ceil(s.height / 2), gap=24) if s.height > 1600 else s, f'{title}  ·  1280 전체 (0.9배, 두 단)'))
    # 블록 배치: 가로 2400 안에서 왼쪽부터 채우고 넘치면 다음 줄
    rows, cur, cw = [], [], 0
    for b in blocks:
        if cur and cw + 32 + b.width > 2400: rows.append(cur); cur, cw = [], 0
        cur.append(b); cw += (32 if cw else 0) + b.width
    rows.append(cur)
    W = min(2400, max(sum(b.width for b in r) + 32 * (len(r) - 1) for r in rows)) + 48
    Hh = 80 + sum(max(b.height for b in r) + 40 for r in rows)
    o = Image.new('RGB', (W, Hh), (236, 239, 244)); d = ImageDraw.Draw(o)
    d.text((24, 20), f'{sh}  {TITLES.get(sh, items[0][1])}', fill=(0, 28, 81), font=font(40))
    y = 80
    for r in rows:
        x = 24
        for b in r: o.paste(b, (x, y)); x += b.width + 32
        y += max(b.height for b in r) + 40
    fn = f'{sh}-{items[0][0]}.png'; o.save(os.path.join(out, fn), optimize=True); names[sh] = (fn, o.size)
    print(sh, fn, o.size)
json.dump(names, open(os.path.join(out, '_sheets.json'), 'w'), ensure_ascii=False)

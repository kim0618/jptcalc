"""디자인 검수 비교 이미지: 실제 크롬 스크린샷(viewport.html의 iframe이 왼쪽 위 0,0)에서 iframe 영역만 잘라
원래 CSS 픽셀 크기로 맞춘 뒤 시안(또는 운영 화면) 옆에 붙인다.
사용: python3 design/tools/compose_review.py SHOTDIR OUTDIR VIEWPORT_W   (VIEWPORT_W = 스크린샷 당시 window.innerWidth)"""
import sys, os
from PIL import Image, ImageDraw
shots, out, vw = sys.argv[1], sys.argv[2], int(sys.argv[3]); os.makedirs(out, exist_ok=True)
R = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'references')
PAIRS = [  # (실제 장면, 비교 대상, 출력 이름) - 비교 대상이 'shot:'이면 다른 장면(운영 화면)
    ('m01-home-top', 'A1-home-mobile.png', 'A1-home-390'), ('m02-home-scroll', 'A3-home-mobile-scroll.png', 'A3-home-scroll-390'),
    ('m03-sheet-buyhome', 'A2-situation-sheet.png', 'A2-sheet-390'), ('m04-menu', 'H1-header-sheet.png', 'H1-menu-390'),
    ('m05-dti-empty', '10-calc-mobile-empty.png', '10-dti-empty-390'), ('m06-dti-partial', 'B2-result-bar-3states.png', 'B2-resultbar-390'),
    ('m07-dti-result', '11-calc-mobile-result.png', '11-dti-result-390'), ('m08-dti-over', '12-calc-mobile-over.png', '12-dti-over-390'),
    ('m09-dti-content', '13-calc-mobile-content.png', '13-dti-content-390'), ('m10-dti-table', 'B4-limit-table.png', 'B4-limit-table-390'),
    ('m11-dsr-prefill', 'B3-prefill-dsr.png', 'B3-prefill-390'), ('m12-dsr-result', '00-components.png', '00-components-dsr-390'),
    ('m13-ltv-result', '11-calc-mobile-result.png', '11-ltv-result-390'), ('m14-acq-result', '11-calc-mobile-result.png', '11-acq-result-390'),
    ('m15-salary-result', '15-calc-mobile-salary.png', '15-salary-390'), ('m16-age', '16-calc-mobile-date.png', '16-age-390'),
    ('m17-cookie', 'B5-cookie-banner.png', 'B5-cookie-390'), ('m18-hub-realestate', 'C1-category-mobile.png', 'C1-hub-390'),
    ('m19-blog-list', 'D1-blog-list-mobile.png', 'D1-blog-390'), ('m20-blog-post', 'D2-blog-post-mobile.png', 'D2-post-390'),
    ('m21-404', 'E1-404-mobile.png', 'E1-404-390'), ('m22-recent', '51-recent-mobile.png', '51-recent-390'),
    ('d01-home', 'A4-home-desktop.png', 'A4-home-1280'), ('d02-search', 'H1-header-sheet.png', 'H1-search-1280'),
    ('d03-dti-result', '14-calc-desktop.png', '14-dti-1280'), ('d04-hub-realestate', 'C2-category-desktop.png', 'C2-hub-1280'),
    ('d05-blog', 'D3-blog-desktop.png', 'D3-blog-1280'), ('d06-blog-post', None, 'D2-post-1280'), ('d07-404', None, 'E1-404-1280'),
    ('d08-sheet', 'A2-situation-sheet.png', 'A2-sheet-1280'),
    ('m01-home-top', 'shot:p01-prod-home-390', 'UP-home-390-vs-prod'), ('m05-dti-empty', 'shot:p02-prod-dti-390', 'UP-dti-390-vs-prod'),
    ('m18-hub-realestate', 'shot:p03-prod-hub-390', 'UP-hub-390-vs-prod'), ('m19-blog-list', 'shot:p04-prod-blog-390', 'UP-blog-390-vs-prod'),
    ('m20-blog-post', 'shot:p05-prod-post-390', 'UP-post-390-vs-prod'), ('d01-home', 'shot:p06-prod-home-1280', 'UP-home-1280-vs-prod')]
SIZE = lambda n: (390, 844) if n.startswith(('m', 'p0')) and not n.endswith('1280') else (1280, 800)
def crop(name):
    p = os.path.join(shots, name + '.jpg')
    if not os.path.exists(p): return None
    im = Image.open(p).convert('RGB'); s = im.width / vw; w, h = SIZE(name)
    return im.crop((0, 0, round(w * s), round(h * s))).resize((w, h), Image.LANCZOS)
def label(img, text):
    o = Image.new('RGB', (img.width, img.height + 26), 'white'); o.paste(img, (0, 26)); ImageDraw.Draw(o).text((4, 6), text, fill=(70, 70, 70)); return o
made = []
for real, ref, name in PAIRS:
    A = crop(real)
    if A is None: continue
    A.save(os.path.join(out, f'_real-{real}.png'))
    if ref is None: B = None
    elif ref.startswith('shot:'): B = crop(ref[5:]); tag = 'production (jptcalc.kr)'
    else: B = Image.open(os.path.join(R, ref)).convert('RGB'); tag = 'reference ' + ref
    if B is not None and B.height != A.height: B = B.resize((round(B.width * A.height / B.height), A.height), Image.LANCZOS)
    parts = ([label(B, tag)] if B is not None else []) + [label(A, 'real chrome ' + real)]
    W = sum(x.width for x in parts) + 30 * (len(parts) - 1); H = max(x.height for x in parts)
    o = Image.new('RGB', (W, H), 'white'); x = 0
    for q in parts: o.paste(q, (x, 0)); x += q.width + 30
    o.save(os.path.join(out, name + '.png')); made.append(name)
print(len(made), '장', made)

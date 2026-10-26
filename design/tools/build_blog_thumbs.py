"""블로그 썸네일: 카테고리 그림(cat-{k}.png)과 상황 그림(sit-{id}.png, design/situations.json의 color)을 그 색 10% 틴트 바탕에 올린 WebP(글자 없음).
와이드(대표 글·글 머리, 960x480)와 정사각(목록, 192x192). 색은 tokens.css의 --c-*와 --surface(틴트 = color-mix 10%).
사용: python3 design/tools/build_blog_thumbs.py (PIL은 사용자 패키지라 -I 없이)"""
import os, re
from PIL import Image
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
tok = open(os.path.join(SITE, 'assets/ds/tokens.css'), encoding='utf-8').read()
col = {k: v for k, v in re.findall(r'--c-([a-z-]+):\s*(#[0-9A-Fa-f]{6})', tok)}
surf = re.search(r'--surface:\s*(#[0-9A-Fa-f]{6})', tok).group(1)
hexrgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
out = os.path.join(SITE, 'assets/img/blog-thumb'); os.makedirs(out, exist_ok=True)
import json
sits = json.load(open(os.path.join(SITE, 'design', 'situations.json'), encoding='utf-8'))['situations']
jobs = [(k, c, f'cat-{k}', k) for k, c in col.items()] + [(x['id'], col[x['color'].replace('--c-', '')], f'sit-{x["id"]}', 'sit-' + x['id']) for x in sits]
for k, c, src, outname in jobs:
    a, s = hexrgb(c), hexrgb(surf); tint = tuple(round(a[i] * .10 + s[i] * .90) for i in range(3))
    ill = Image.open(os.path.join(SITE, f'assets/img/illust/{src}.png')).convert('RGBA')
    for name, (w, h), size in (('wide', (960, 480), 240), ('sq', (192, 192), 120)):
        bg = Image.new('RGBA', (w, h), tint + (255,)); im = ill.resize((size, size), Image.LANCZOS)
        bg.alpha_composite(im, ((w - size) // 2, (h - size) // 2))
        bg.convert('RGB').save(os.path.join(out, f'{outname}-{name}.webp'), 'WEBP', quality=86, method=6)
print(len(jobs), '종 ×2', sorted(os.listdir(out))[:4], sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) // 1024, 'KB')

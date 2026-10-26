"""블로그 표지(시안 D4): design/blog-cover-text.csv의 coverText(큰 숫자·설명)로 글마다 표지를 그린다. 배포 제외 도구.
구성: 왼쪽 위 카테고리 칩(라인 아이콘 + 이름, --c-*), 큰 숫자/핵심어, 설명 1줄, 오른쪽 아래 기존 일러스트(sit-* 우선, 없으면 cat-*).
바탕은 카테고리 틴트 단색(그라데이션·원 장식 없음). 글자 Pretendard 800, 숫자 --primary, 단위·한글 --navy(숫자보다 작게), 설명 --navy 600.
비율별로 따로 그린다(잘라 쓰기 금지): 16:9 1280x720(대표·글 머리 데스크톱) + 같은 그림 480x270 축소본 -sm(데스크톱 목록 카드), 3:1 1440x480(모바일 글 상단, 가로 재배치),
1:1 축소 전용(10/21: 폭 160px 이하 자리 = 모바일 목록 카드·많이 읽은 글·관련 가이드) 480x480으로 그려 240x240 저장: 칩·설명 없이 큰 숫자만 왼쪽 아래, 일러스트는 오른쪽 위에 작게(겹침 0).
글자 영역은 폭 60% 이내, 일러스트와 겹침 0. 넘치면 큰 글자를 단계 축소하고, 최소 크기에서도 넘치면 목록으로 알린다(그 글은 만들지 않음).
csv에 없는 글은 만들지 않는다(기존 썸네일 유지). og:image는 건드리지 않는다.
사용: python3 design/tools/build_blog_covers.py [--out DIR] [--ratio 16x9|3x1|1x1] [slug ...]   (기본 DIR = assets/img/blog-thumb, slug 없으면 csv 전체)
      LD_LIBRARY_PATH=$HOME/.local/emulib 필요(이 WSL의 헤드리스 크롬)"""
import os, re, sys, csv, json, html, base64
from playwright.sync_api import sync_playwright
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
sys.path.insert(0, T)
from convert_calc import CATS
CATICON = {k: i for k, _, i in CATS}; CATLABEL = {k: n for k, n, _ in CATS}   # 카테고리는 원고 설정(blog_info.json)의 slug 기준, 이름은 사이트 표기

args = sys.argv[1:]; out = os.path.join(SITE, 'assets', 'img', 'blog-thumb')
if '--out' in args: i = args.index('--out'); out = args[i + 1]; del args[i:i + 2]
only = None
if '--ratio' in args: i = args.index('--ratio'); only = args[i + 1]; del args[i:i + 2]   # 검토용으로 한 비율만(16x9 또는 3x1)
os.makedirs(out, exist_ok=True)
rows = {r['slug']: r for r in csv.DictReader(open(os.path.join(SITE, 'design', 'blog-cover-text.csv'), encoding='utf-8'))}
INFO = json.load(open(os.path.join(T, 'results', 'blog_info.json'), encoding='utf-8'))
SITS = json.load(open(os.path.join(SITE, 'design', 'situations.json'), encoding='utf-8'))['situations']
TOKENS = open(os.path.join(SITE, 'assets', 'ds', 'tokens.css'), encoding='utf-8').read()
ICONS = open(os.path.join(SITE, 'assets', 'ds', 'icons.svg'), encoding='utf-8').read()
slugs = args or sorted(rows)

def illust(cat, rc_url):   # build_blog.thumb_of와 같은 규칙: 관련 계산기가 속한 상황 그림, 없으면 카테고리 그림
    m = re.search(r'/calc/([a-z-]+)/([a-z0-9-]+)/', rc_url or '')
    if m:
        for x in SITS:
            if f'{m.group(1)}/{m.group(2)}' in x['calcs']: return f'sit-{x["id"]}'
    return f'cat-{cat}'
def big_html(t):   # 숫자 덩어리(숫자·쉼표·소수점)는 --primary 큰 글자, 나머지(단위·한글·기호)는 --navy 작은 글자
    return ''.join(f'<span class="n">{html.escape(p)}</span>' if re.fullmatch(r'[\d][\d.,]*', p) else f'<span class="u">{html.escape(p)}</span>'
                   for p in re.findall(r'\d[\d.,]*|[^\d]+', t))
def glue(t):   # 1:1 두 줄 꺾임용: 숫자 없는 3글자 이하 낱말(이상·이하·m²·vs 등)은 앞 낱말에 붙인다(혼자 다음 줄로 떨어지지 않게)
    w = t.split(' '); out = w[0]
    for x in w[1:]: out += ('\u00a0' if not re.search(r'\d', x) and len(x) <= 3 else ' ') + x
    return out
def symbol(name):
    m = re.search(r'<symbol id="i-' + name + r'"[^>]*>.*?</symbol>', ICONS, re.S); return m.group(0) if m else ''

PAGE = r'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://vendor.local/assets/vendor/pretendard/1.3.9/pretendard.css" rel="stylesheet">
<style>__TOKENS__
html, body { margin: 0; }
.cv { position: relative; overflow: hidden; width: var(--w); height: var(--h); background: color-mix(in srgb, var(--cat) 10%, var(--surface)); font-family: Pretendard, sans-serif; }
.txt { position: absolute; left: var(--pad); top: var(--pad); width: calc(var(--w) * .6 - var(--pad)); }
.chip { display: inline-flex; align-items: center; gap: calc(var(--chip) * .45); height: calc(var(--chip) * 2.2); padding: 0 calc(var(--chip) * .9); border-radius: 999px; background: color-mix(in srgb, var(--cat) 14%, var(--surface)); color: var(--cat); font-size: var(--chip); font-weight: 700; }
.chip svg { width: calc(var(--chip) * 1.25); height: calc(var(--chip) * 1.25); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.big { display: inline-block; margin-top: var(--gap); white-space: nowrap; font-weight: 800; line-height: 1; letter-spacing: -0.03em; font-size: var(--big); }
.big .n { color: var(--primary); }
.big .u { color: var(--navy); font-size: .62em; }
.desc { margin-top: calc(var(--gap) * .7); white-space: nowrap; color: var(--navy); font-weight: 600; font-size: var(--desc); letter-spacing: -0.01em; }
.ill { position: absolute; right: var(--ill-r); bottom: var(--ill-b); width: var(--ill); height: var(--ill); }
/* 1:1 축소 전용: 칩·설명 없이 큰 숫자만 왼쪽 아래, 일러스트는 오른쪽 위에 작게 */
.r1 .chip, .r1 .desc, .r1 br { display: none; }
.r1 .txt { top: auto; bottom: var(--pad); width: calc(var(--w) - var(--pad) * 2); }
.r1 .big { margin-top: 0; white-space: normal; word-break: keep-all; line-height: 1.04; }   /* 긴 문구는 띄어쓰기 자리에서만 두 줄(숫자·단위는 붙어 있다) */
.r1 .ill { bottom: auto; top: var(--ill-b); }
.r1 .w { white-space: nowrap; }   /* 꺾임은 띄어쓰기 자리에서만(㎡ 같은 한 글자 기호 앞에서 꺾이지 않게) */
/* 3:1 가로 재배치: 칩·큰 글자·설명을 세로 가운데에, 일러스트는 오른쪽 가운데 */
.r3 .txt { top: 50%; transform: translateY(-50%); }
.r3 .ill { bottom: auto; top: 50%; transform: translateY(-50%); }
</style></head><body><svg style="display:none">__SYMBOL__</svg>
<div class="cv __RCLS__" style="--cat: var(--c-__CAT__); __VARS__">
  <div class="txt"><span class="chip"><svg><use href="#i-__ICON__"/></svg>__LABEL__</span><br><span class="big">__BIG__</span><div class="desc">__DESC__</div></div>
  <img class="ill" src="data:image/png;base64,__ILL__" alt="">
</div></body></html>'''
# 비율별 치수: 큰 글자 시작·최소 크기(px), 설명·칩 크기, 일러스트 크기와 여백
RATIOS = {
    '16x9': dict(w=1280, h=720, pad=80, chip=40, gap=52, big=250, big_min=110, desc=60, ill=440, ill_r=48, ill_b=36, cls=''),
    '3x1': dict(w=1440, h=480, pad=80, chip=32, gap=28, big=190, big_min=90, desc=46, ill=380, ill_r=96, ill_b=50, cls='r3'),
    '1x1': dict(w=480, h=480, pad=40, chip=0, gap=0, big=170, big_min=60, desc=0, ill=160, ill_r=28, ill_b=28, cls='r1'),
}
FIT = r'''([minBig, lim]) => {
  const cv = document.querySelector('.cv'), txt = document.querySelector('.txt'), big = document.querySelector('.big'), desc = document.querySelector('.desc'), ill = document.querySelector('.ill');
  const W = cv.getBoundingClientRect(), limit = W.left + W.width * lim;   // 글자 오른쪽 한계: 16:9·3:1은 폭 60%, 1:1은 오른쪽 여백까지
  let size = parseFloat(getComputedStyle(cv).getPropertyValue('--big')), ok = false;
  for (; size >= minBig; size = Math.floor(size * .92)) {
    cv.style.setProperty('--big', size + 'px');
    const b = big.getBoundingClientRect(), d = desc.getBoundingClientRect(), i = ill.getBoundingClientRect(), t = txt.getBoundingClientRect();
    const right = Math.max(b.right, d.right);
    const textBox = { left: b.left, top: b.top, right: right, bottom: Math.max(b.bottom, d.bottom) };
    // 글자 상자와 일러스트 상자가 겹치는지(네 방향 모두 확인: 1:1은 일러스트가 위, 글자가 아래)
    const hits = !(textBox.right <= i.left || textBox.left >= i.right || textBox.bottom <= i.top || textBox.top >= i.bottom);
    if (right <= limit && !hits && textBox.bottom <= W.bottom - 8) { ok = true; break; }
  }
  return { ok: ok, size: size, descRight: Math.round(desc.getBoundingClientRect().right), limit: Math.round(limit) };
}'''

fails, made = [], 0
def serve_vendor(route):
    path = os.path.join(SITE, route.request.url.split('://', 1)[1].split('/', 1)[1].split('?')[0])
    route.fulfill(path=path, headers={'Access-Control-Allow-Origin': '*'})
with sync_playwright() as p:
    b = p.chromium.launch()
    for slug in slugs:
        r = rows.get(slug)
        if not r: print('csv에 없음(기존 썸네일 유지):', slug); continue
        cat = INFO[slug]['cfg']['category']
        ill = os.path.join(SITE, 'assets', 'img', 'illust', illust(cat, INFO[slug]['cfg'].get('relatedCalc', {}).get('url', '')) + '.png')
        for name, d in RATIOS.items():
            if only and name != only: continue
            vars_ = '; '.join(f'--{k.replace("_", "-")}: {v}px' for k, v in d.items() if k not in ('cls', 'big_min'))
            doc = (PAGE.replace('__TOKENS__', TOKENS).replace('__SYMBOL__', symbol(CATICON[cat])).replace('__RCLS__', d['cls'])
                   .replace('__CAT__', cat).replace('__VARS__', vars_).replace('__ICON__', CATICON[cat]).replace('__LABEL__', html.escape(CATLABEL[cat]))
                   .replace('__BIG__', ' '.join(f'<span class="w">{big_html(x)}</span>' for x in glue(r['big']).split(' ')) if name == '1x1' else big_html(r['big'])).replace('__DESC__', html.escape(r['desc'])).replace('__ILL__', base64.b64encode(open(ill, 'rb').read()).decode()))
            pg = b.new_page(viewport={'width': d['w'], 'height': d['h']})
            pg.route('https://vendor.local/**', serve_vendor)   # 글꼴은 저장소의 /assets/vendor에서(외부 CDN 안 씀)
            pg.set_content(doc, wait_until='networkidle'); pg.evaluate('document.fonts.ready')
            res = pg.evaluate(FIT, [d['big_min'], 1 - d['pad'] / d['w'] if name == '1x1' else .6])
            if not res['ok']: fails.append((slug, name, r['big'], r['desc'], res)); pg.close(); continue
            f = os.path.join(out, f'{slug}-{name}.png'); pg.screenshot(path=f, clip={'x': 0, 'y': 0, 'width': d['w'], 'height': d['h']}); pg.close()
            try:
                from PIL import Image
                im = Image.open(f).convert('RGB')
                if name == '1x1': im = im.resize((240, 240), Image.LANCZOS)   # 표시 88px 이하 x 배율 2.6
                im.save(f[:-4] + '.webp', 'WEBP', quality=88, method=6); os.remove(f)
                if name == '16x9': im.resize((480, 270), Image.LANCZOS).save(f[:-4] + '-sm.webp', 'WEBP', quality=86, method=6)   # 작은 자리(목록·관련 가이드)용 축소본(자르지 않음)
            except ImportError: pass
            made += 1
    b.close()
print('만든 표지', made, '장 →', out)
print('최소 크기에서도 넘침(만들지 않음)', len(fails)); [print('  ', x) for x in fails]

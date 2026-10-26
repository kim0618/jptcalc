"""홈(/index.html, 시안 A1·A2·A3·A4)과 최근 사용(/recent/index.html, 시안 51) 생성.
데이터: design/situations.json(상황 15개·홈 노출 순서·시즌), assets/calc-registry.js(registry.json), 각 계산기 페이지(받는 칸·검토일),
원본 홈(a74cc04 index.html: head·글·인기 TOP 7·카테고리 설명). design/는 배포에서 빠지므로 홈에 필요한 데이터는 생성 때 HTML·인라인 JSON에 넣는다.
사용: python3 -I design/tools/build_home.py   (상황·시즌을 바꾸면 situations.json 수정 후 다시 실행)"""
import json, re, os, html, subprocess, datetime, sys
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
sys.path.insert(0, T)
from convert_calc import CATS, I
from strip_emoji import strip as strip_emoji
from asset_version import stamp_html, stamp_sources   # 공용 CSS·JS 주소에 ?v=내용 해시(캐시 버전)
REF = 'a74cc04'
def git(p): return subprocess.run(['git', '-C', SITE, 'show', f'{REF}:{p}'], capture_output=True, text=True).stdout
def tx(h): return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()
def esc(t): return html.escape(t, quote=True)
CATNAME = {k: n for k, n, _ in CATS}; CATICON = {k: i for k, _, i in CATS}
REG = json.load(open(os.path.join(T, 'registry.json'), encoding='utf-8'))          # 'cat/slug': 이름
SIT = json.load(open(os.path.join(SITE, 'design', 'situations.json'), encoding='utf-8'))
ORIG = git('index.html')
COUNT = {k: sum(1 for x in REG if x.startswith(k + '/')) for k, _, _ in CATS}
TOTAL = sum(COUNT.values())

# ── 계산기 정보: 제목(h1)·받는 칸(data-prefill)·검토일 ──
def page(path):
    s = open(os.path.join(SITE, 'calc', path, 'index.html'), encoding='utf-8').read()
    h1 = tx(re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1))
    rv = re.search(r"lastReviewed:\s*'(\d{4}\.\d{2}\.\d{2})'", s)
    return {'h1': h1, 'recv': sorted(set(re.findall(r'data-prefill="([^"]+)"', s))), 'reviewed': rv.group(1) if rv else ''}
INFO = {p: page(p) for p in REG}
# 단계 설명: 원본 허브 카드의 한 줄 설명
DESC = {}
for k, _, _ in CATS:
    for slug, d in re.findall(r'<a class="calc-hub-card" href="/calc/' + k + r'/([a-z0-9-]+)/">.*?<div class="calc-hub-desc">(.*?)</div>', git(f'calc/{k}/index.html'), re.S):
        DESC[f'{k}/{slug}'] = tx(d)

# ── 원본 홈의 글(유지) ──
def short(name): return re.sub(r'\s*계산기$', '', name)
CARDS = re.findall(r'<a href="\./calc/([a-z-]+)/" class="cat-card[^"]*">.*?class="cat-desc">(.*?)</div>\s*<div class="cat-pills">(.*?)</div>', ORIG, re.S)
PILL = {('realestate', '양도세'): 'capital-gains', ('realestate', '취득세'): 'acquisition', ('tax', '4대보험료'): 'four-insurance', ('pet', '월 양육비'): 'monthly-cost'}
def pill_slug(cat, p):
    if (cat, p) in PILL: return cat, PILL[(cat, p)]
    n = lambda t: re.sub(r'[\s·()/]|계산', '', t)
    for full, nm in REG.items():
        if n(p)[:4] and n(p)[:4] in n(nm):
            c, s = full.split('/'); return c, s
    raise SystemExit(f'칩 대응 실패: {cat} {p}')
catrows = {}
for cat, desc, pills in CARDS:
    items = []
    for p in [html.unescape(x) for x in re.findall(r'<span class="cat-pill">(.*?)</span>', pills)]:
        c, s = pill_slug(cat, p); items.append((c, s, p))
    catrows[cat] = [tx(desc), items]
# 원본 날짜 카드에 잘못 들어 있던 "전기차 보조금"은 자동차 목록으로 옮긴다(계산기가 있으므로 삭제 대신 이동)
moved = [x for x in catrows['date'][1] if x[0] != 'date']
catrows['date'][1] = [x for x in catrows['date'][1] if x[0] == 'date']
catrows['auto'][1] += moved
TOP7 = re.findall(r'href="\./calc/([a-z-]+)/([a-z0-9-]+)/"[^>]*class="popular-item[^"]*">.*?class="popular-name">(.*?)</div>', ORIG, re.S) or \
       [tuple(m[0].strip('./').split('/')[1:3]) + (m[1],) for m in re.findall(r'href="(\./calc/[a-z-]+/[a-z0-9-]+/)"[^>]*>\s*<span class="popular-rank[^>]*>.*?class="popular-name">(.*?)</div>', ORIG, re.S)]
if len(TOP7) != 7:
    seg = ORIG[ORIG.index('TOP 7'):]; TOP7 = [(h.split('/')[2], h.split('/')[3], tx(n)) for h, n in re.findall(r'href="\.(/calc/[a-z-]+/[a-z0-9-]+/)".*?class="popular-name">(.*?)</div>', seg, re.S)[:7]]
assert len(TOP7) == 7, TOP7
RECO = re.findall(r'<a href="\./calc/([a-z-]+)/([a-z0-9-]+)/" class="recommend-link">.*?class="recommend-text">(.*?)<br><span[^>]*>(.*?)</span>', ORIG, re.S)
ABOUT = re.search(r'<div class="about-card">\s*<h2>(.*?)</h2>(.*?)</div>', ORIG, re.S)
about_ps = re.sub(r'\s*\n\s*', ' ', ABOUT.group(2)).strip()
HERO_SUB = tx(re.search(r'class="hero-sub">(.*?)</p>', ORIG, re.S).group(1).replace('<br />', ' ').replace('<br>', ' '))
HERO_BADGE = re.sub(r'^\W+', '', tx(re.search(r'class="hero-badge">(.*?)</div>', ORIG, re.S).group(1)))

# ── head: 원본 그대로(인라인 <style>만 빼고 새 CSS 연결) ──
def orig_head(extra):
    h = ORIG[ORIG.index('<head>') + 6:ORIG.index('</head>')]
    h = re.sub(r'\s*<style>.*?</style>', '', h, flags=re.S)
    h = re.sub(r'\s*<link rel="stylesheet" href="/assets/(?!ds/)[^"]+\.css"\s*/?>', '', h)
    return h.rstrip() + '\n  <link rel="stylesheet" href="/assets/ds/tokens.css" />\n  <link rel="stylesheet" href="/assets/ds/base.css" />\n' + extra

# ── 홈 데이터(시트·시즌) ──
def step(path):
    return {'path': f'/calc/{path}/', 'name': REG[path], 'desc': DESC.get(path, ''), 'recv': INFO[path]['recv']}
sits = {s['id']: s for s in SIT['situations']}
data = {'situations': {s['id']: {'name': s['name'], 'desc': s['desc'], 'illust': s['illust'], 'cat': s['color'].replace('--c-', ''),
                                 'inputs': s.get('inputs', []), 'steps': [step(c) for c in s['calcs']]} for s in SIT['situations']},
        'seasons': [{'months': x['months'], 'title': x['title'], 'path': f"/calc/{x['calc']}/", 'name': INFO[x['calc']]['h1'], 'cat': x['calc'].split('/')[0]} for x in SIT['seasons']]}
# 받는 칸 검사: inputs의 param을 받는 단계가 하나도 없으면 실수
for sid, s in data['situations'].items():
    for i in s['inputs']:
        assert any(i['param'] in st['recv'] for st in s['steps']), (sid, i['param'])

now = datetime.date.today()
season = next(x for x in data['seasons'] if now.month in x['months'])
order = SIT['home_order'] + [s['id'] for s in SIT['situations'] if s['id'] not in SIT['home_order']]

def sit_card(sid, i):
    s = sits[sid]; first = f"/calc/{s['calcs'][0]}/"
    lazy = '' if i < 8 else ' loading="lazy"'
    return (f'<a class="h-sit{" h-sit-more" if i >= 8 else ""}" href="{first}" data-sit="{sid}">'
            f'<img src="{s["illust"]}" alt="" width="44" height="44" decoding="async"{lazy}>'
            f'<span class="h-sit-body"><b>{esc(s["name"])}</b><span>{esc(s["desc"])}</span></span>'
            f'<span class="h-sit-count">계산기 {len(s["calcs"])}개{I("chevron-right", "ds-i-sm")}</span></a>')

changed = sorted([(v['reviewed'], p) for p, v in INFO.items() if v['reviewed']], key=lambda x: (x[0], -list(REG).index(x[1])), reverse=True)[:5]
cat_tiles = ''.join(f'<a href="/calc/{k}/"><img src="/assets/img/illust/cat-{k}.webp" alt="" width="52" height="52" loading="lazy" decoding="async">{n}</a>' for k, n, _ in CATS)
cat_list = ''.join(
    f'<li><a class="h-catrow-name" href="/calc/{k}/" style="--cat: var(--c-{k})"><span class="ds-cat-ico">{I(ic)}</span>{n} <em>{COUNT[k]}개</em></a>'
    f'<p>{esc(catrows[k][0])}</p><p class="h-catrow-links">'
    + ''.join(f'<a href="/calc/{c}/{s}/">{esc(p)}</a>' for c, s, p in catrows[k][1])
    + (f'<span>+{COUNT[k] - sum(1 for c, _, _ in catrows[k][1] if c == k)}</span>' if COUNT[k] > len(catrows[k][1]) else '') + '</p></li>'
    for k, n, ic in CATS)

STYLE = r'''  <style>
    /* 홈 고유(시안 A1·A2·A3·A4). 색·크기는 tokens.css 변수만 */
    .ds-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
    .h-main { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--gap-card); padding-top: var(--space-4); padding-bottom: var(--space-section); }   /* 간격 기준(2026-10-20): 블록 사이 카드 간격, 제목 있는 섹션 앞은 섹션 간격 */
    @media (max-width: 1023px) { .h-sits-wrap, .h-recent, .h-top, .h-cats, .h-changed { margin-top: calc(var(--gap-section) - var(--gap-card)) !important; } }
    .h-main > * { min-width: 0; margin: 0; }
    .h-col { display: contents; }   /* 모바일: 묶음 없이 한 줄 흐름. 카테고리부터 아래는 order로 TOP 7 뒤에(원래 순서) */
    .h-cats, .h-ad { order: 1; } .h-changed { order: 2; } .h-about { order: 3; }   /* 모바일 순서: … TOP 7 → 카테고리 → 광고 → 기준 변경 → 소개(DOM은 데스크톱 칸 순서) */
    .h-head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin: 0 0 var(--gap-title); }
    .h-head .h-more { margin: calc(var(--space-2) * -1) 0; }   /* 44px 누름 영역은 그대로, 줄 높이는 제목에 맞춤(제목→내용 간격 기준) */
    .h-head h2 { margin: 0; font-size: var(--fs-section); font-weight: var(--fw-title); color: var(--navy); }
    .h-more { display: inline-flex; align-items: center; gap: 2px; min-height: var(--h-tap); padding: 0; border: 0; background: none; color: var(--text-sub); font: inherit; font-size: var(--fs-meta); font-weight: var(--fw-meta); text-decoration: none; cursor: pointer; }
    .h-more .ds-i { width: 16px; height: 16px; transition: transform .15s; }
    .h-more[aria-expanded="true"] .ds-i { transform: rotate(90deg); }
    .h-title { margin: 0 0 calc(var(--gap-h1) - var(--gap-card)); font-size: var(--fs-title); font-weight: var(--fw-title); line-height: 1.3; letter-spacing: var(--ls-tight); color: var(--navy); }
    .h-search .ds-search-field { height: var(--h-input); }
    .h-meta { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @media (min-width: 1024px) { body[data-cat="home"] .ds-header-search { display: none; } }
    .h-meta { margin: var(--space-2) 0 0; font-size: var(--fs-meta); color: var(--text-sub); }
    .h-season { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); border-radius: var(--radius-lg); background: var(--primary-tint); color: var(--text); text-decoration: none; }
    .h-season .ds-icon-tile { width: 56px; height: 56px; }
    .h-season .ds-icon-tile .ds-i { width: 28px; height: 28px; }
    .h-season-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .h-season-body small { font-size: var(--fs-meta); font-weight: var(--fw-label); color: var(--blue); }
    .h-season-body b { font-size: var(--fs-body); font-weight: var(--fw-title); line-height: 1.4; }
    .h-season-body span { font-size: var(--fs-meta); color: var(--text-sub); }
    .h-sits { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap-card); }
    .h-sit { display: grid; grid-template-columns: 40px minmax(0, 1fr); grid-template-areas: "img body" "count count"; grid-template-rows: 1fr auto; column-gap: var(--space-2); row-gap: var(--space-1); align-items: start;  padding: var(--space-3); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); color: var(--text); text-decoration: none; }   /* A1: 그림 왼쪽 + 글 오른쪽 */
    .h-sit img { grid-area: img; width: 40px; height: 40px; }
    .h-sit-body { grid-area: body; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .h-sit-body b { font-size: var(--fs-label); font-weight: var(--fw-title); line-height: 1.35; }
    .h-sit-body span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--fs-meta); color: var(--text-sub); line-height: 1.4; }
    .h-sit-count { grid-area: count; display: inline-flex; align-items: center; gap: 2px; justify-self: end; white-space: nowrap; font-size: var(--fs-meta); color: var(--text-sub); }
    .h-sits:not(.is-all) .h-sit-more { display: none; }
    .h-recent-list { display: flex; gap: var(--space-2); overflow-x: auto; scrollbar-width: none; margin: 0; padding: 0; list-style: none; }
    .h-recent-list a { display: inline-flex; align-items: center; gap: var(--space-1); min-height: var(--h-chip); padding: 0 var(--space-3); border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--text); font-size: var(--fs-meta); white-space: nowrap; text-decoration: none; }
    /* 칩(10/22): 줄어들지 않고 한 줄 고정, 칩 줄은 가로 스크롤(넘칠 때만 끝 흐림), 긴 결과값은 칩 안에서 말줄임 */
    .h-recent-list li { flex: 0 0 auto; min-width: 0; }
    .h-recent-list.is-over:not(.is-end) { -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent); mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent); }
    .h-recent-list b { flex-shrink: 0; font-weight: var(--fw-title); white-space: nowrap; }
    .h-recent-list span { min-width: 0; max-width: 9em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-sub); }
    .h-recent-list .ds-i { display: none; }
    .h-card { margin: 0; padding: 0 var(--space-4); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); list-style: none; }
    .h-card a { display: flex; align-items: center; gap: var(--space-3); min-height: 52px; border-bottom: 1px solid var(--line); color: var(--text); text-decoration: none; }
    .h-card li:last-child a { border-bottom: 0; }
    .h-card a > b { flex: 1; min-width: 0; font-size: var(--fs-body); font-weight: var(--fw-label); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .h-card .ds-i { width: 18px; height: 18px; color: var(--text-muted); flex-shrink: 0; }
    .h-rank { width: 24px; font-size: var(--fs-section); font-weight: var(--fw-title); color: var(--blue); font-variant-numeric: tabular-nums; }
    .h-cat { font-size: var(--fs-meta); color: var(--text-sub); white-space: nowrap; }
    .h-date { width: 44px; font-size: var(--fs-meta); color: var(--text-sub); font-variant-numeric: tabular-nums; flex-shrink: 0; }
    .h-cats .ds-cat-grid a { font-size: var(--fs-meta); }
    .h-about { padding: var(--space-card); border-radius: var(--radius-lg); background: var(--surface); }
    .h-about h2 { margin: 0 0 var(--space-3); font-size: var(--fs-section); font-weight: var(--fw-title); color: var(--navy); }
    .h-about h3 { margin: var(--space-card) 0 var(--space-2); font-size: var(--fs-label); font-weight: var(--fw-title); color: var(--text); }
    .h-about p { margin: 0 0 var(--space-2); font-size: var(--fs-meta); line-height: 1.7; color: var(--text-sub); }
    .h-about strong { color: var(--text); }
    .h-reco, .h-catrows { margin: 0; padding: 0; list-style: none; }
    .h-reco li { padding: var(--space-2) 0; border-bottom: 1px solid var(--line); }
    .h-reco a { color: var(--text); font-size: var(--fs-label); font-weight: var(--fw-label); text-decoration: none; }
    .h-reco span { display: block; font-size: var(--fs-meta); color: var(--text-sub); }
    .h-catrows li { padding: var(--space-3) 0; border-bottom: 1px solid var(--line); }
    .h-catrows li:last-child, .h-reco li:last-child { border-bottom: 0; }
    .h-catrow-name { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text); font-size: var(--fs-label); font-weight: var(--fw-title); text-decoration: none; }
    .h-catrow-name em { font-style: normal; font-weight: var(--fw-meta); color: var(--text-sub); font-size: var(--fs-meta); }
    .h-catrows p { margin: var(--space-1) 0 0; }
    .h-catrow-links { display: flex; flex-wrap: wrap; gap: var(--space-1) var(--space-3); }
    .h-catrow-links a { color: var(--blue); font-size: var(--fs-meta); text-decoration: none; }
    .h-catrow-links span { font-size: var(--fs-meta); color: var(--text-muted); }
    /* 상황 시트(A2) */
    @media (min-width: 1024px) {
      /* 데스크톱: 왼쪽(상황·카테고리)과 오른쪽(검색·시즌 / 최근·TOP 7)이 각자 세로로 흐른다. 같은 행으로 묶지 않아 서로 높이에 끌려 빈칸이 생기지 않음.
         왼쪽 묶음이 1fr 행까지 걸쳐서, 왼쪽이 길어도 그 여분은 1fr 행이 받고 오른쪽 r1·r2 사이는 벌어지지 않는다 */
      .h-main { grid-template-columns: minmax(0, 1fr) 344px; grid-template-rows: auto auto 1fr auto auto; grid-template-areas: "title title" "l r1" "l r2" "ad ad" "about about"; column-gap: var(--grid-gap); row-gap: var(--gap-card); align-items: start; padding-top: var(--space-card); }
      .h-title { grid-area: title; margin: 0 0 calc(var(--gap-h1) - var(--gap-card)); }
      .h-col { display: flex; flex-direction: column; min-width: 0; }
      .h-col-l { grid-area: l; gap: var(--gap-section); } .h-col-r1 { grid-area: r1; gap: var(--gap-card); } .h-col-r2 { grid-area: r2; gap: var(--gap-section); margin-top: calc(var(--gap-section) - var(--gap-card)); }
      .h-ad { grid-area: ad; } .h-about { grid-area: about; }
      .h-sits { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gap-card); }
      .h-cats .ds-cat-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .h-recent-list { flex-direction: column; gap: 0; padding: 0 var(--space-4); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
      .h-recent-list a { display: flex; min-height: 44px; padding: 0; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; }
      .h-recent-list li:last-child a { border-bottom: 0; }
      .h-recent-list .ds-i { display: block; margin-left: auto; width: 16px; height: 16px; color: var(--text-muted); }
      .h-recent-list span { flex: 0 1 auto; max-width: none; }   /* 데스크톱 목록형: 줄 끝까지 쓰고 넘치면 말줄임 */
      .h-recent-list.is-over:not(.is-end) { -webkit-mask-image: none; mask-image: none; }
      /* 왼쪽 칸 목록형: 최근 기록이 없으면 3열(오른쪽이 짧음), 있으면 1열로 펼쳐 두 칸 끝 높이를 맞춘다(2026-10-20 실측 차이 48px 이하) */
      .h-changed .h-card { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: var(--space-card); }
      .h-changed .h-card a { min-height: 48px; }
      .h-changed .h-card li:nth-child(n+4) a { border-bottom: 0; }
      .h-main:has(#h-recent:not([hidden])) .h-changed .h-card { grid-template-columns: minmax(0, 1fr); }
      .h-main:has(#h-recent:not([hidden])) .h-changed .h-card a { min-height: 52px; }
      .h-main:has(#h-recent:not([hidden])) .h-changed .h-card li:nth-child(n+4):not(:last-child) a { border-bottom: 1px solid var(--line); }
    }
  </style>
'''


SCRIPT = r'''<script>
/* 홈: 시즌 카드·상황 전체 펼치기·최근 계산·GA4 이벤트. 데이터는 #h-data(생성 때 situations.json에서) */
(function () {
  var D = JSON.parse(document.getElementById('h-data').textContent);
  function ev(name, p) { try { if (window.gtag) gtag('event', name, Object.assign({ transport_type: 'beacon' }, p || {})); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ico(n) { return '<svg class="ds-i" aria-hidden="true"><use href="/assets/ds/icons.svg#i-' + n + '"></use></svg>'; }

  // ── 시즌 카드: 이번 달 항목으로(생성 때 달과 다르면 바꾼다) ──
  var m = new Date().getMonth() + 1, sc = document.getElementById('h-season');
  var se = D.seasons.filter(function (x) { return x.months.indexOf(m) >= 0; })[0];
  if (sc && se && sc.getAttribute('href') !== se.path) {
    sc.setAttribute('href', se.path); sc.style.setProperty('--cat', 'var(--c-' + se.cat + ')');
    sc.querySelector('small').textContent = m + '월 시즌'; sc.querySelector('b').textContent = se.title; sc.querySelector('.h-season-body span').textContent = se.name;
    sc.querySelector('use').setAttribute('href', '/assets/ds/icons.svg#i-' + D.catIcon[se.cat]);
  } else if (sc) sc.querySelector('small').textContent = m + '월 시즌';
  if (sc) sc.addEventListener('click', function () { ev('season_card_click', { calc: sc.getAttribute('href'), month: m }); });

  // ── 상황 전체 15개 펼치기 ──
  var grid = document.getElementById('h-sits'), allBtn = document.getElementById('h-sits-all');
  if (allBtn) allBtn.addEventListener('click', function () {
    var on = !grid.classList.contains('is-all'); grid.classList.toggle('is-all', on); allBtn.setAttribute('aria-expanded', on);
    allBtn.firstChild.nodeValue = on ? '접기 ' : '전체 ' + grid.children.length + '개 ';
  });

  // 상황 시트(A2)는 site-shell.js가 연다([data-sit] 클릭·#s=id, 헤더 상황별 메뉴와 공용)

  // ── 최근 사용한 계산기(A3): 이 기기 기록(site-shell이 jpt_recent에 저장) ──
  var list = [];
  try { list = JSON.parse(localStorage.getItem('jpt_recent') || '[]'); } catch (e) {}
  var box = document.getElementById('h-recent');
  if (box && list.length) {
    document.getElementById('h-recent-list').innerHTML = list.slice(0, 3).map(function (r) {
      var n = String(r.name || '').replace(/\s*계산기$/, ''), sm = String(r.summary || '');
      if (sm.indexOf(n + ' ') === 0) sm = sm.slice(n.length + 1);   // "DTI 34.0%" → "34.0%" (A3: DTI · 34.0%)
      return '<li><a href="' + esc(r.url) + '"><b>' + esc(n) + '</b>' + (sm ? '<span>· ' + esc(sm) + '</span>' : '') + ico('chevron-right') + '</a></li>';
    }).join('');
    box.hidden = false;
    var ul = document.getElementById('h-recent-list'), upd = function () {   // 칩 줄이 넘칠 때만 끝 흐림(끝까지 밀면 없앰)
      var o = ul.scrollWidth > ul.clientWidth + 1;
      ul.classList.toggle('is-over', o); ul.classList.toggle('is-end', o && ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 2);
    };
    ul.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    box.addEventListener('click', function (e) { var a = e.target.closest('#h-recent-list a'); if (a) ev('recent_click', { calc: a.pathname, from: 'home' }); });
  }

  // ── 홈 검색(home_search): 자동완성에서 고르거나 Enter로 이동할 때 ──
  var hs = document.getElementById('h-search');
  if (hs) {
    var q = function () { var i = hs.querySelector('.ds-search-input'); return i ? i.value.trim() : ''; };
    hs.addEventListener('click', function (e) { var a = e.target.closest('.ds-ac a'); if (a) ev('home_search', { search_term: q(), calc: a.pathname }); });
    hs.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var a = hs.querySelector('.ds-ac a.is-active') || hs.querySelector('.ds-ac a');
      if (a) ev('home_search', { search_term: q(), calc: a.pathname });
    }, true);
  }
})();
</script>'''

hdata = {'seasons': data['seasons'], 'catIcon': CATICON}

# ── 헤더 펼침 메뉴(H2)·상황 시트(A2)용 배포 데이터: site-shell.js가 읽는다(design/는 배포에서 빠지므로 /assets/ds/에) ──
json.dump({'order': order, 'situations': data['situations']}, open(os.path.join(SITE, 'assets', 'ds', 'situations.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
def hub_top(k):   # 허브 "자주 찾는 계산기" 순서, 모자라면 레지스트리 순서로 채워 3개
    hub = open(os.path.join(SITE, 'calc', k, 'index.html'), encoding='utf-8').read()
    pop = re.findall(r'<a class="hub-popular-card" href="/calc/' + k + r'/([a-z0-9-]+)/">', hub)
    seq = [f'{k}/{x}' for x in pop if f'{k}/{x}' in REG] + [x for x in REG if x.startswith(k + '/')]
    return [{'path': f'/calc/{x}/', 'name': REG[x]} for x in dict.fromkeys(seq)][:3]
CATMENU = {'cats': [{'key': k, 'name': CATNAME[k], 'icon': CATICON[k], 'count': COUNT[k], 'top': hub_top(k)} for k, _, _ in CATS]}
json.dump(CATMENU, open(os.path.join(SITE, 'assets', 'ds', 'cat-menu.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
stamp_sources()   # 메뉴 JSON이 바뀌었을 수 있으니 site-shell.js 안 버전부터
body = f'''<body data-cat="home">
<header id="ds-site-header" class="ds-header">
  <div class="ds-container"><div class="ds-header-inner">
    <a class="ds-logo" href="/"><span class="ds-logo-text">제이퍼계산기</span></a>
    <nav class="ds-header-nav" aria-label="주 메뉴"><a href="/#situations">상황별</a><a href="/#categories">카테고리</a><a href="/blog/">블로그</a></nav>
  </div></div>
</header>

<main class="h-main ds-container">
  <h1 class="h-title">모든 계산을 한 곳에서</h1>

  <div class="h-col h-col-r1">
  <div class="h-search">
    <div id="h-search" data-ds-search="ds-q-home" role="search"></div>
    <p class="h-meta">무료 계산기 {TOTAL}개 · 전문 카테고리 {len(CATS)}개 · 2026년 최신 세율</p>
  </div>

  <div class="h-season-wrap">
    <a class="h-season" id="h-season" href="{season['path']}" style="--cat: var(--c-{season['cat']})">
      <span class="ds-icon-tile">{I(CATICON[season['cat']])}</span>
      <span class="h-season-body"><small>{now.month}월 시즌</small><b>{esc(season['title'])}</b><span>{esc(season['name'])}</span></span>
      {I("chevron-right", "ds-chevron")}
    </a>
  </div>
  </div>

  <div class="h-col h-col-l">
  <section class="h-sits-wrap" id="situations" aria-labelledby="h-sits-title">
    <div class="h-head"><h2 id="h-sits-title">어떤 상황이세요?</h2><button type="button" class="h-more" id="h-sits-all" aria-expanded="false" aria-controls="h-sits">전체 {len(order)}개 {I("chevron-right")}</button></div>
    <div class="h-sits" id="h-sits">
      {"".join(sit_card(sid, i) for i, sid in enumerate(order))}
    </div>
  </section>

  <section class="h-cats" id="categories" aria-labelledby="h-cats-title">
    <div class="h-head"><h2 id="h-cats-title">카테고리로 찾기</h2></div>
    <div class="ds-cat-grid">{cat_tiles}</div>
  </section>

  <section class="h-changed" aria-labelledby="h-changed-title">
    <div class="h-head"><h2 id="h-changed-title">기준이 바뀐 계산기</h2></div>
    <ol class="h-card">
      {"".join(f'<li><a href="/calc/{p}/"><span class="h-date">{d[5:]}</span><b>{esc(INFO[p]["h1"])}</b>{I("chevron-right")}</a></li>' for d, p in changed)}
    </ol>
  </section>
  </div>

  <div class="h-col h-col-r2">
  <section class="h-recent" id="h-recent" aria-labelledby="h-recent-title" hidden>
    <div class="h-head"><h2 id="h-recent-title">최근 사용한 계산기</h2><a class="h-more" href="/recent/">전체보기 {I("chevron-right")}</a></div>
    <ul class="h-recent-list" id="h-recent-list"></ul>
  </section>

  <section class="h-top" aria-labelledby="h-top-title">
    <div class="h-head"><h2 id="h-top-title">이달의 인기 계산기 TOP 7</h2></div>
    <ol class="h-card">
      {"".join(f'<li><a href="/calc/{c}/{s}/"><span class="h-rank">{i + 1}</span><b>{esc(tx(n))}</b><span class="h-cat">{CATNAME[c]}</span>{I("chevron-right")}</a></li>' for i, (c, s, n) in enumerate(TOP7))}
    </ol>
  </section>
  </div>


  <div class="h-ad adfit-slot ds-ad">
    <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-FVtGPbPVy9mv3sGa" data-ad-width="300" data-ad-height="250"></ins>
    <script type="text/javascript" src="//t1.kakaocdn.net/kas/static/ba.min.js" async></script>
  </div>


  <section class="h-about" aria-labelledby="h-about-title">
    <h2 id="h-about-title">{tx(ABOUT.group(1))}</h2>
    <p><strong>{esc(HERO_BADGE)}</strong> · {esc(HERO_SUB)}</p>
    {about_ps}
    <h3>함께 많이 쓰는 계산기</h3>
    <ul class="h-reco">{"".join(f'<li><a href="/calc/{c}/{s}/">{esc(tx(t))}</a><span>{esc(tx(sub))}</span></li>' for c, s, t, sub in RECO)}</ul>
    <h3>카테고리별 대표 계산기</h3>
    <ul class="h-catrows">{cat_list}</ul>
  </section>
</main>


<footer id="ds-site-footer" class="site-footer ds-footer">
  <div class="ds-container">
    <div class="ds-footer-top">
      <ul class="ds-footer-cats" aria-label="계산기 카테고리">{"".join(f'<li><a href="/calc/{k}/">{n}</a></li>' for k, n, _ in CATS)}</ul>
      <div class="ds-footer-links footer-links">
        <a href="/">홈</a><a href="/about.html">소개</a><a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a><a href="/disclaimer.html">면책조항</a>
      </div>
    </div>
    <!-- 바닥글 원문(main 홈 그대로): site-shell.js가 저작권 줄 위 면책 줄로 보인다 -->
    <p class="ds-footer-copy footer-copy">&copy; 2026 제이퍼 계산기 (JPT Calc) - 본 계산 결과는 참고용입니다.</p>
  </div>
</footer>

<script type="application/json" id="h-data">{json.dumps(hdata, ensure_ascii=False, separators=(",", ":"))}</script>
<script src="/assets/calc-registry.js"></script>
<script src="/assets/ds/site-shell.js"></script>
{SCRIPT}
</body>
</html>
'''
doc = '<!DOCTYPE html>\n<html lang="ko">\n<head>' + orig_head(STYLE) + '</head>\n' + strip_emoji('<body>' + body)[len('<body>'):]
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8').write(stamp_html(doc))

# ── /recent/ (시안 51): 이 기기 기록만, 검색 노출 제외 ──
head_keep = re.findall(r'\s*<link rel="(?:icon|apple-touch-icon|manifest|preconnect|dns-prefetch)"[^>]*>|\s*<link rel="stylesheet" crossorigin href="https://cdn\.jsdelivr\.net[^>]*>', ORIG)
ga = re.search(r'\s*<!-- Google Analytics -->\s*<script async src="https://www\.googletagmanager\.com[^>]*></script>', ORIG).group(0)
ga_cfg = re.search(r"\s*<script>\s*window\.dataLayer.*?</script>", ORIG, re.S).group(0)
RSTYLE = r'''  <style>
    .r-main { padding-top: var(--space-card); padding-bottom: var(--space-section); max-width: 720px; }
    .r-main h1 { margin: 0 0 var(--space-2); font-size: var(--fs-title); font-weight: var(--fw-title); color: var(--navy); }
    .r-lead { margin: 0 0 var(--space-4); font-size: var(--fs-meta); color: var(--text-sub); }
    .r-list { margin: 0; padding: 0 var(--space-4); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); list-style: none; }
    .r-list a { display: flex; align-items: center; gap: var(--space-3); min-height: 64px; padding: var(--space-2) 0; border-bottom: 1px solid var(--line); color: var(--text); text-decoration: none; }
    .r-list li:last-child a { border-bottom: 0; }
    .r-list .ds-cat-ico { width: 40px; height: 40px; border-radius: var(--radius-md); flex-shrink: 0; }
    .r-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r-body b { font-size: var(--fs-body); font-weight: var(--fw-title); }
    .r-body span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--fs-meta); color: var(--text-sub); }
    .r-list .ds-chevron { width: 18px; height: 18px; color: var(--text-muted); }
    .r-actions { display: flex; justify-content: flex-end; margin-top: var(--space-2); }
    .r-clear { min-height: var(--h-tap); padding: 0 var(--space-2); border: 0; background: none; color: var(--blue); font: inherit; font-size: var(--fs-label); font-weight: var(--fw-label); cursor: pointer; }
    .r-empty { padding: var(--space-section) var(--space-card); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); text-align: center; }
    .r-empty b { display: block; font-size: var(--fs-body); font-weight: var(--fw-title); color: var(--text); }
    .r-empty p { margin: var(--space-2) 0 var(--space-4); font-size: var(--fs-meta); color: var(--text-sub); }
    .r-empty[hidden], .r-has[hidden] { display: none; }
  </style>
'''
RSCRIPT = r'''<script>
/* 최근 사용한 계산기(51): site-shell이 계산기 페이지에서 jpt_recent에 남긴 기록. 저장소를 못 쓰면 빈 화면 */
(function () {
  var CAT = JSON.parse(document.getElementById('r-cats').textContent);
  function ev(name, p) { try { if (window.gtag) gtag('event', name, Object.assign({ transport_type: 'beacon' }, p || {})); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function when(t) {
    var d = new Date(t), now = new Date(), day = 864e5;
    var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()), b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var hm = pad(d.getHours()) + ':' + pad(d.getMinutes()), diff = Math.round((b - a) / day);
    return (diff === 0 ? '오늘 ' : diff === 1 ? '어제 ' : pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ' ') + hm;
  }
  var list = [];
  function load() { try { list = JSON.parse(localStorage.getItem('jpt_recent') || '[]'); } catch (e) { list = []; } }
  function render() {
    load();
    var has = list.length > 0;
    document.getElementById('r-has').hidden = !has; document.getElementById('r-empty').hidden = has;
    document.getElementById('r-list').innerHTML = list.map(function (r) {
      var c = CAT[r.cat] || { name: '', icon: 'calculator' };
      var meta = [c.name, r.t ? when(r.t) : '', r.summary || ''].filter(Boolean).map(esc).join(' · ');
      return '<li><a href="' + esc(r.url) + '"><span class="ds-cat-ico" style="--cat: var(--c-' + esc(r.cat || 'realestate') + ')"><svg class="ds-i" aria-hidden="true"><use href="/assets/ds/icons.svg#i-' + c.icon + '"></use></svg></span>' +
        '<span class="r-body"><b>' + esc(r.name || '') + '</b><span>' + meta + '</span></span><svg class="ds-i ds-chevron" aria-hidden="true"><use href="/assets/ds/icons.svg#i-chevron-right"></use></svg></a></li>';
    }).join('');
  }
  render();
  document.getElementById('r-list').addEventListener('click', function (e) { var a = e.target.closest('a'); if (a) ev('recent_click', { calc: a.pathname, from: 'recent' }); });
  document.getElementById('r-clear').addEventListener('click', function () { try { localStorage.removeItem('jpt_recent'); } catch (e) {} render(); });
})();
</script>'''
rcats = {k: {'name': n, 'icon': ic} for k, n, ic in CATS}
recent = f'''<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>최근 사용한 계산기 | 제이퍼 계산기</title>
  <meta name="robots" content="noindex, follow" />
  <meta name="description" content="이 기기에서 최근 사용한 제이퍼 계산기 목록입니다. 기록은 이 기기에만 저장됩니다." />{"".join(head_keep)}{ga}{ga_cfg}
  <link rel="stylesheet" href="/assets/ds/tokens.css" />
  <link rel="stylesheet" href="/assets/ds/base.css" />
{RSTYLE}</head>
<body data-cat="recent">
<header id="ds-site-header" class="ds-header">
  <div class="ds-container"><div class="ds-header-inner">
    <a class="ds-logo" href="/"><span class="ds-logo-text">제이퍼계산기</span></a>
  </div></div>
</header>

<main class="r-main ds-container">
  <h1>최근 사용한 계산기</h1>
  <p class="r-lead">최근 사용 기록은 이 기기에만 저장됩니다.</p>
  <div class="r-has" id="r-has" hidden>
    <ul class="r-list" id="r-list"></ul>
    <div class="r-actions"><button type="button" class="r-clear" id="r-clear">기록 지우기</button></div>
  </div>
  <div class="r-empty" id="r-empty">
    <b>최근 사용한 계산기가 없어요</b>
    <p>계산기를 사용하면 이곳에서 다시 찾을 수 있어요.</p>
    <a class="ds-btn-primary" href="/#situations">상황별로 찾아보기</a>
  </div>
</main>

<footer id="ds-site-footer" class="site-footer ds-footer">
  <div class="ds-container">
    <div class="ds-footer-top">
      <ul class="ds-footer-cats" aria-label="계산기 카테고리">{"".join(f'<li><a href="/calc/{k}/">{n}</a></li>' for k, n, _ in CATS)}</ul>
      <div class="ds-footer-links footer-links">
        <a href="/">홈</a><a href="/about.html">소개</a><a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a><a href="/disclaimer.html">면책조항</a>
      </div>
    </div>
    <p class="ds-footer-copy footer-copy">&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 세액은 전문가에게 문의하세요.</p>
  </div>
</footer>

<script type="application/json" id="r-cats">{json.dumps(rcats, ensure_ascii=False, separators=(",", ":"))}</script>
<script src="/assets/ds/site-shell.js"></script>
{RSCRIPT}
</body>
</html>
'''
os.makedirs(os.path.join(SITE, 'recent'), exist_ok=True)
open(os.path.join(SITE, 'recent', 'index.html'), 'w', encoding='utf-8').write(stamp_html(recent))
print('홈: 상황', len(order), '(첫 화면 8) | 시즌', season['title'], '| 인기', len(TOP7), '| 기준 변경', [(d, p) for d, p in changed], '| 이동한 칩', [(c, s, p) for c, s, p in moved])
print('받는 칸:', {sid: {st['path']: [i['param'] for i in s['inputs'] if i['param'] in st['recv']] for st in s['steps']} for sid, s in data['situations'].items() if s['inputs']})

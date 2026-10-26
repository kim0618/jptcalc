"""카테고리 허브(C1·C2) 일반형. 원본 <main> 안 섹션은 제목·계산기 카드 격자만 빼고 순서·글 그대로 옮기고,
계산기 목록은 plan.json 그룹으로(탭 4개 이상 그룹이면 상황 탭, 아니면 탭 없이 소제목).
사용: python3 -I design/tools/build_hub.py CAT   (원본은 design/tools/orig/CAT/_hub.html)"""
import re, sys, html, json, os
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
cat = sys.argv[1]
plan = json.load(open(os.path.join(T, 'plan.json'), encoding='utf-8'))[cat]
src = os.path.join(T, 'orig', cat, '_hub.html')
if not os.path.exists(src):
    os.makedirs(os.path.dirname(src), exist_ok=True)
    open(src, 'w', encoding='utf-8').write(open(os.path.join(SITE, 'calc', cat, 'index.html'), encoding='utf-8').read())
s = open(src, encoding='utf-8').read()
sys.path.insert(0, T)
from convert_calc import CATS, I, div_end

def txt(h): return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()
reg = open(os.path.join(SITE, 'assets/calc-registry.js'), encoding='utf-8').read()
counts = {k: len(re.findall(r'"slug"', body)) for k, body in re.findall(r'"([a-z-]+)":\s*\{\s*"name".*?"calcs":\s*\[(.*?)\]\s*\}', reg, re.S)}

head = s[:s.index('<style>', s.index('pretendard'))].rstrip() + '\n'
assert '</head>' not in head
m0 = re.search(r'<main[^>]*>', s); m1 = s.index('</main>', m0.end())
main = s[m0.end():m1]
# 제목
ph0 = main.index('<div class="page-header">'); ph1 = div_end(main, ph0); ph = main[ph0:ph1]
h1 = txt(re.search(r'<h1[^>]*>(.*?)</h1>', ph, re.S).group(1))
subm = re.search(r'</h1>\s*<p[^>]*>(.*?)</p>', ph, re.S); sub = txt(subm.group(1)) if subm else ''
bm = re.search(r'class="page-header-badge">(.*?)</div>', ph, re.S); badge = txt(bm.group(1)) if bm else ''
crumb = re.findall(r'<a [^>]*>(.*?)</a>', re.search(r'class="breadcrumb">(.*?)</div>', ph, re.S).group(1))
lastc = re.findall(r'<span(?![^>]*breadcrumb-sep)[^>]*>(.*?)</span>', re.search(r'class="breadcrumb">(.*?)</div>', ph, re.S).group(1))
crumb_last = txt(lastc[-1]) if lastc else h1   # 원본 경로 표시의 마지막 칸 그대로
main = main[:ph0] + main[ph1:]
# 계산기 카드 격자 → 이름·설명만 쓰고 빼기
c0 = re.search(r'<div class="calc-hub"[^>]*>', main).start(); c1 = div_end(main, c0); hubgrid = main[c0:c1]
cards = {m[0]: (m[1], m[2]) for m in re.findall(r'<a class="calc-hub-card" href="/calc/' + cat + r'/([a-z0-9-]+)/">.*?<div class="calc-hub-name">(.*?)</div>\s*<div class="calc-hub-desc">(.*?)</div>', hubgrid, re.S)}
main = main[:c0] + main[c1:]
popular = re.findall(r'<a class="hub-popular-card" href="/calc/' + cat + r'/([a-z0-9-]+)/">', s)
groups = plan['groups']
assert sorted(sum([g[3] for g in groups], [])) == sorted(cards), set(cards) ^ set(sum([g[3] for g in groups], []))
tabs = plan.get('tabs', len(groups) >= 2 and len(cards) >= 9)

def row(slug):
    name, desc = cards[slug]
    badge_ = '<span class="ds-badge-pop">인기</span>' if slug in popular else ''
    return (f'          <a class="ds-hub-row" id="calc-{slug}" href="/calc/{cat}/{slug}/"><span class="ds-hub-body"><b>{name}</b><span>{desc}</span></span>'
            f'{badge_}{I("chevron-right", "ds-chevron")}</a>\n')
groups_html = ''.join(f'''      <section class="ds-hub-group" data-group="{k}" aria-labelledby="hub-{k}">
        <h2 class="ds-hub-group-title" id="hub-{k}">{t}</h2>
{f'        <p class="ds-hub-group-sub">{st}</p>' + chr(10) if st else ''}        <div class="ds-hub-list">
{''.join(row(x) for x in slugs)}        </div>
      </section>
''' for k, t, st, slugs in groups)
tabs_html = ('''    <nav class="ds-toc ds-hub-tabs" aria-label="상황별 보기">
      <button type="button" class="is-active" data-tab="all" aria-pressed="true">전체</button>''' + ''.join(f'<button type="button" data-tab="{k}" aria-pressed="false">{t}</button>' for k, t, _, _ in groups) + '\n    </nav>\n') if tabs else ''

# 남은 원본 섹션: 글 그대로, 모양만
EMO = {'🏠': 'house', '📄': 'file-text', '📈': 'trending-up', '💰': 'banknote', '🏦': 'landmark', '💼': 'briefcase', '🧮': 'calculator', '📅': 'calendar-days',
       '🏛': 'landmark', '🏛️': 'landmark', '🛠️': 'wrench', '🛠': 'wrench', '🏃': 'heart-pulse', '🤖': 'cpu', '🐾': 'paw-print', '🚗': 'car', '👶': 'baby',
       '📝': 'file-text', '📊': 'table-2', '💵': 'banknote', '🎁': 'gift', '🔢': 'calculator', '⏰': 'clock', '🧾': 'receipt', '💊': 'heart-pulse', '🐶': 'paw-print', '🐱': 'paw-print'}
def icon_of(t):
    t = t.strip()
    for e, n in EMO.items():
        if t.startswith(e): return n
    return 'calculator'
rest = main
rest = re.sub(r'<(div|span) class="(hub-[a-z-]*icon)">(.*?)</\1>', lambda m: f'<{m.group(1)} class="{m.group(2)}">' + I(icon_of(m.group(3))) + f'</{m.group(1)}>', rest)
rest = re.sub(r'<div class="hub-[a-z-]*arrow">\s*→\s*</div>', I('chevron-right', 'ds-chevron'), rest)
fq = [0]
def faq_item(m):
    fq[0] += 1
    return f'<details class="faq-item"><summary><h3>{m.group(1)}</h3>{I("chevron-down", "ds-faq-chev")}</summary>\n          <p>{m.group(2)}</p>\n        </details>'
rest = re.sub(r'<div class="hub-faq-item">\s*<div class="hub-faq-q">(.*?)</div>\s*<p class="hub-faq-a">(.*?)</p>\s*</div>', faq_item, rest, flags=re.S)
rest = rest.replace('<div class="hub-faq-list">', '<div class="hub-faq-list ds-faq">')
rest = re.sub(r'<div class="adfit-slot"[^>]*>', '<div class="adfit-slot ds-ad">', rest)
rest = re.sub(r'<!--.*?-->', '', rest, flags=re.S)

catname = dict((k, n) for k, n, _ in CATS)[cat]
nav = ''.join(f'<a href="/calc/{k}/"{" aria-current=" + chr(34) + "page" + chr(34) if k == cat else ""} style="--cat: var(--c-{k})"><span class="ds-cat-ico">{I(ic)}</span>{n}<em>{counts.get(k, "")}</em></a>' for k, n, ic in CATS)
body = f'''  <link rel="stylesheet" href="/assets/ds/tokens.css" />
  <link rel="stylesheet" href="/assets/ds/base.css" />
</head>
<body data-cat="{cat}" style="--cat: var(--c-{cat})">
<header id="ds-site-header" class="ds-header">
  <div class="ds-container"><div class="ds-header-inner">
    <a class="ds-logo" href="/"><span class="ds-logo-text">제이퍼계산기</span></a>
    <nav class="ds-header-nav" aria-label="주 메뉴"><a href="/#situations">상황별</a><a href="/#categories" aria-current="page">카테고리</a><a href="/blog/">블로그</a></nav>
  </div></div>
</header>

<div class="ds-container ds-hub">
  <aside class="ds-hub-nav" aria-label="카테고리">
    <h2>카테고리</h2>
    <nav>{nav}</nav>
  </aside>

  <main class="ds-hub-main">
    <div class="page-header ds-hub-head">
      <div class="breadcrumb ds-crumbs"><a href="/">홈</a> &rsaquo; {crumb_last}</div>
      <div class="page-badge">{badge}</div>
      <div class="ds-hub-title">
        <img src="/assets/img/illust/cat-{cat}.webp" alt="" width="40" height="40" decoding="async">
        <h1 class="page-title">{h1}</h1>
        <p class="page-subtitle">{sub}</p>
      </div>
    </div>

{tabs_html}
    <div class="ds-hub-groups">
{groups_html}    </div>

    <div class="ds-hub-more ds-prose">
{rest.strip()}
    </div>
  </main>
</div>

<footer id="ds-site-footer" class="site-footer ds-footer">
  <div class="ds-container">
    <div class="ds-footer-top">
      <ul class="ds-footer-cats" aria-label="계산기 카테고리">{''.join(f'<li><a href="/calc/{k}/">{n}</a></li>' for k, n, _ in CATS)}</ul>
      <div class="ds-footer-links footer-links">
        <a href="/">홈</a><a href="/about.html">소개</a><a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a><a href="/disclaimer.html">면책조항</a>
      </div>
    </div>
    <p class="ds-footer-copy footer-copy">&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 세액은 전문가에게 문의하세요.</p>
  </div>
</footer>
<div class="toast" id="toast"></div>

<script src="/assets/calc-registry.js"></script>
<script src="/assets/ds/site-shell.js"></script>
<script>
/* 상황 탭(C1·C2): 고른 그룹만 보이기. 옛 주소의 #계산기·?tab=계산기는 그 줄로 이동해 강조 */
(function () {{
  const tabs = document.querySelectorAll('.ds-hub-tabs button'), groups = document.querySelectorAll('.ds-hub-group');
  const pick = key => {{
    tabs.forEach(b => {{ const on = b.dataset.tab === key; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); }});
    groups.forEach(g => {{ g.hidden = key !== 'all' && g.dataset.group !== key; }});
  }};
  tabs.forEach(b => b.addEventListener('click', () => pick(b.dataset.tab)));
  const deep = () => {{
    const k = (location.hash || '').replace(/^#(tab-)?/, '') || new URLSearchParams(location.search).get('tab') || '';
    const row = k && document.getElementById('calc-' + k);
    if (!row) return;
    pick('all'); row.classList.add('is-target'); row.scrollIntoView({{ block: 'center' }});
  }};
  window.addEventListener('hashchange', deep);
  deep();
}})();
</script>
</body>
</html>
'''
fc = re.search(r'class="(?:mega-)?footer-copy">(.*?)</p>', s, re.S)
if fc: body = re.sub(r'(<p class="ds-footer-copy footer-copy">).*?(</p>)', lambda mm: mm.group(1) + fc.group(1).strip() + mm.group(2), body)
from strip_emoji import strip as _strip_emoji
from asset_version import stamp_html, stamp_sources   # 공용 CSS·JS 주소에 ?v=내용 해시(캐시 버전)
stamp_sources()
open(os.path.join(SITE, 'calc', cat, 'index.html'), 'w', encoding='utf-8').write(stamp_html(_strip_emoji(head + body)))
print(cat, '허브:', len(cards), '개, 그룹', len(groups), '탭' if tabs else '탭 없음', '| 인기', popular, '| FAQ', fq[0], '| 줄', len((head + body).splitlines()))

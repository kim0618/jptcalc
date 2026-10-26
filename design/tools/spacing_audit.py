"""간격 검사 v2(검수용, 배포 제외, 2026-10-20 사용자 확정 기준): 실제 크롬에서 정해진 값과 ±4px로 대조한다. 예외 없음.
기준(모바일 / 데스크톱 1024+, tokens.css --gap-*·--pad-card)
- section : 블록 끝 → 다음 섹션 제목            40 / 48
- title   : 섹션 제목 → 내용                    12 / 16
- h3-top / h3-bottom : 소제목 위 / 아래         24 / 32, 8 / 12
- card    : 카드 사이(세로·가로)                12 / 16
- pad     : 카드 안 여백(위·왼쪽, 목록 카드는 왼쪽만) 20 / 24
- para    : 문단 사이                          12
- over64  : main 안 위아래로 쌓인 이웃 블록 사이가 64px 초과(무조건 실패)
- h1      : 페이지·허브 제목 머리 → 첫 섹션             24 / 32 (--gap-h1)
- font    : 섹션 제목(main h2·.hub-section-label·.ds-blog-h·.ds-col-title·.sibling-title)이 --fs-section·--fw-section과 다름
"보이는 간격": 카드가 아닌 블록의 안쪽 여백(제목 padding 등)은 간격에 넣는다. 광고 칸과 시트·펼침 메뉴·결과 바는 뺀다.
사용: [ALL_POSTS=1] [RECENT=1] python3 design/tools/spacing_audit.py OUT.json [BASE]   (LD_LIBRARY_PATH=$HOME/.local/emulib)"""
import sys, json, glob, os, collections
from playwright.sync_api import sync_playwright
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
out = sys.argv[1]; base = sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:8770'
os.chdir(SITE)
posts = sorted(glob.glob('blog/posts/*.html'))
if not os.environ.get('ALL_POSTS'): posts = posts[::max(1, len(posts) // 20)][:20]   # ALL_POSTS=1이면 글 전부(배포 전 기준)
EXCEPT = ('calc/realestate/dti/', 'calc/realestate/pyeong/')   # 11/9까지 main 판(옛 디자인) 유지 - 승인된 예외
PAGES = (['/', '/blog/', '/404.html', '/recent/'] + [f'/{x}.html' for x in ('about', 'contact', 'disclaimer', 'privacy', 'terms')]
         + sorted('/' + p[:-10] for p in glob.glob('calc/*/index.html'))
         + sorted('/' + p[:-10] for p in glob.glob('calc/*/*/index.html') if not p.startswith(EXCEPT))
         + ['/' + p for p in posts])
if len(sys.argv) > 3: PAGES = sys.argv[3].split(',')   # 일부 페이지만(쉼표 구분)
JS = r'''(W) => {
  const D = W >= 1024, E = { h1: D ? 32 : 24, section: D ? 48 : 40, title: D ? 16 : 12, 'h3-top': D ? 32 : 24, 'h3-bottom': D ? 12 : 8, card: D ? 16 : 12, pad: D ? 24 : 20, para: 12 };
  const main = document.querySelector('main'); if (!main) return [];
  const root = getComputedStyle(document.documentElement), FS = parseFloat(root.getPropertyValue('--fs-section')), FW = root.getPropertyValue('--fw-section').trim();
  const out = [], push = (t, v, el, extra) => out.push({ t, v: Math.round(v), want: E[t] === undefined ? null : E[t], el: sig(el), p: sig(el.parentElement), x: extra || '' });
  const SKIP = '.h-sheet, .ds-nav-panel, .ds-rbar, #jpt-cookie-bar, .ds-ac, svg';
  const AD = '.ds-ad, .adfit-slot';   // 광고 칸: 이웃 블록으로는 세지만(그 자리를 차지하므로) 안쪽은 재지 않는다
  // 그려지는 블록만: 숨김·떠 있는(absolute·fixed·sticky)·글줄 안(inline) 요소와 display:contents는 뺀다
  const vis = e => { if (!e || e.closest(SKIP) || (e.parentElement && e.parentElement.closest(AD))) return false; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || /absolute|fixed/.test(cs.position) || cs.display === 'contents' || (cs.display.startsWith('inline') && cs.display !== 'inline-block' && cs.display !== 'inline-flex' && cs.display !== 'inline-grid' && !/^(PICTURE|IMG)$/.test(e.tagName))) return false; const r = e.getBoundingClientRect(); return r.height > 1 && r.width > 1; };
  const sig = e => { if (!e) return ''; const c = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(x => x && !/^is-/.test(x))[0]; return e.tagName.toLowerCase() + (c ? '.' + c : ''); };
  const CTRL = '.input-wrap, .seg-group, .mode-group, .cat-group, select, input, button, a[class*="btn"], .ds-icon-tile, .ds-cat-ico, img, picture, .ds-post-chip, .ds-toc, .ds-toc a, .h-recent-list a, .ds-blog-calc, .ds-search-field, .ds-badge-pop, summary, .mode-tab, .mode-tabs, .tab-group, .tab-btn';
  const isCard = e => { if (!e || !e.parentElement || e.matches(CTRL)) return false; const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    if (parseFloat(cs.borderTopLeftRadius) < 4 || r.height < 48 || r.width < 120 || cs.display.startsWith('inline')) return false;
    const bd = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && parseFloat(cs.borderLeftWidth) > 0;
    const sh = cs.boxShadow !== 'none', bg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== getComputedStyle(e.parentElement).backgroundColor;
    return bd || sh || bg; };
  const R = e => e.getBoundingClientRect();
  // 보이는 경계: 바탕·테두리·그림자가 있는 상자(둥글지 않아도)는 상자 끝, 아니면 글 끝(안쪽 여백 제외)
  const effBg = e => { for (let x = e; x; x = x.parentElement) { const b = getComputedStyle(x).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)') return b; } return 'rgb(255, 255, 255)'; };   // 실제로 비치는 바탕색
  const boxed = e => { const cs = getComputedStyle(e); return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && e.parentElement && cs.backgroundColor !== effBg(e.parentElement)) || cs.boxShadow !== 'none' || (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && parseFloat(cs.borderLeftWidth) > 0); };
  const vt = e => R(e).top + (boxed(e) ? 0 : parseFloat(getComputedStyle(e).paddingTop));
  const vb = e => R(e).bottom - (boxed(e) ? 0 : parseFloat(getComputedStyle(e).paddingBottom));
  // display:contents 묶음은 펼쳐서 같은 흐름으로 본다(모바일 홈의 .h-col)
  const flat = e => [...e.children].flatMap(k => getComputedStyle(k).display === 'contents' ? flat(k) : [k]);
  const flowParent = e => { let p = e.parentElement; while (p && getComputedStyle(p).display === 'contents') p = p.parentElement; return p; };
  const kidsOf = e => flat(e).filter(vis);
  const stacked = (a, b) => R(b).top >= R(a).bottom - 1 && Math.min(R(a).right, R(b).right) - Math.max(R(a).left, R(b).left) > 20;
  // 바로 위 블록: 같은 흐름 안에서 화면상 위에 있고 가로로 겹치는 것 중 아래쪽 끝이 가장 낮은 것(order·contents와 무관)
  const above = e => { const fp = flowParent(e); if (!fp) return null; let best = null; for (const c of kidsOf(fp)) { if (c === e || !stacked(c, e)) continue; if (!best || R(c).bottom > R(best).bottom) best = c; } return best; };
  const below = e => { const fp = flowParent(e); if (!fp) return null; let best = null; for (const c of kidsOf(fp)) { if (c === e || !stacked(e, c)) continue; if (!best || R(c).top < R(best).top) best = c; } return best; };
  const prevStacked = above, nextVis = below;
  // 섹션 제목: 글꼴 + 앞 블록 간격 + 내용 간격
  const TITLES = [...main.querySelectorAll('h2, .hub-section-label, .ds-blog-h, .ds-col-title, .sibling-title')].filter(vis);
  TITLES.forEach(t => {
    const cs = getComputedStyle(t);
    if (Math.abs(parseFloat(cs.fontSize) - FS) > 0.5 || String(cs.fontWeight) !== FW) push('font', parseFloat(cs.fontSize), t, cs.fontWeight);
    let s = t; while (flowParent(s) && flowParent(s) !== main && !above(s) && !isCard(s)) s = flowParent(s);   // 제목이 맨 위인 묶음까지 올라가 그 위 블록과 잰다
    if (!isCard(s)) { const p = prevStacked(s); if (p && !p.matches('.updated, .subtitle, .page-subtitle, .ds-404-sub, .r-lead, h1, .page-header, .ds-hub-title, .ds-blog-hero, .ds-hero, h2, .hub-section-label, .ds-blog-h, .ds-col-title, .sibling-title, .ds-section-head, .h-head')) push('section', vt(t) - vb(p), t, sig(p)); }   // 페이지 제목 → 첫 섹션은 기준 밖(64 초과만 검사)
    let n = nextVis(t), from = t;
    if (!n && flowParent(t) !== main && kidsOf(flowParent(t)).length <= 2) { from = flowParent(t); n = nextVis(from); }   // 제목 줄(.h-head 등) 다음
    if (n && stacked(from, n)) push('title', vt(n) - vb(t), t, sig(n));
  });
  // 페이지 제목(h1) 머리 → 첫 섹션: 제목 묶음(히어로·페이지 머리·허브 제목·블로그 머리)과 바로 붙은 부제·메타 줄까지가 머리
  const h1 = [...main.querySelectorAll('h1')].find(vis);
  if (h1) {
    let s = h1.closest('.page-header, .ds-hero, .ds-hub-title, .ds-blog-hero') || h1;
    let n = below(s);
    while (n && n.matches('.updated, .subtitle, .page-subtitle, .ds-post-meta, .h-meta, .ds-404-sub, .r-lead')) { s = n; n = below(n); }
    if (!n) { let up = s; while (!n && flowParent(up) && flowParent(up) !== document.body) { up = flowParent(up); if (up === main) break; n = below(up); s = up; } }
    if (n) push('h1', vt(n) - vb(s), h1, sig(s) + ' → ' + sig(n));
  }
  // 소제목 h3: 글 흐름 안(앞뒤가 문단·목록·표)
  main.querySelectorAll('h3').forEach(h => {
    if (!vis(h) || h.closest('summary, a, .ds-blog-card, .ds-blog-feat, .h-sit, .faq-item, .ds-next-card, .h-sheet')) return;
    const p = prevStacked(h), n = nextVis(h);
    if (p && !p.matches('h2, h3, h4, .ds-section-head, .h-head, .hub-section-label, .ds-blog-h, .sibling-title')) push('h3-top', vt(h) - vb(p), h, sig(p));   // 제목 바로 아래 h3는 title 규칙이 잰다
    if (n && stacked(h, n)) push('h3-bottom', vt(n) - vb(h), h, sig(n));
  });
  // 카드 사이 / 카드 안 여백 / 문단 사이 / 64 초과
  main.querySelectorAll('*').forEach(par => {
    if (!vis(par) || par.closest(AD)) return;
    const kids = kidsOf(par).sort((x, y) => R(x).top - R(y).top || R(x).left - R(y).left);
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1], b = kids[i];
      if (a.matches(AD) || b.matches(AD)) { if (stacked(a, b) && vt(b) - vb(a) > 64) push('over64', vt(b) - vb(a), b, sig(a)); continue; }
      if (isCard(a) && isCard(b)) {
        if (stacked(a, b) && sig(a) === sig(b) && Math.abs(R(b).top - R(a).bottom) <= 1) continue;   // 같은 종류가 틈 없이 이어 붙은 묶음(구분선 있는 한 장, 글 안 사례·단계 등)
        if (stacked(a, b)) push('card', R(b).top - R(a).bottom, b, sig(a));
        else if (Math.abs(R(a).top - R(b).top) < 2 && R(b).left > R(a).right - 1) push('card', R(b).left - R(a).right, b, sig(a) + ' 가로');
      }
      if (a.tagName === 'P' && b.tagName === 'P' && stacked(a, b) && !a.closest('.ds-blog-card, .h-sit, td, li')) push('para', vt(b) - vb(a), b);
      if (stacked(a, b) && vt(b) - vb(a) > 64) push('over64', vt(b) - vb(a), b, sig(a));
    }
    if (isCard(par) && kids.length && !par.closest('.ds-blog-card, .h-sit')) {
      const cs = getComputedStyle(par), pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom), pl = parseFloat(cs.paddingLeft);
      if (!(pt === 0 && pb === 0)) push('pad', Math.min(pt, pl), par, 'top ' + pt + ' left ' + pl);
      else if (pl > 0 || kids.length > 1) push('pad', pl, par, '목록 카드 left');
    }
  });
  return out;
}'''
rows = []
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for w in (390, 1280):
        c = br.new_context(viewport={'width': w, 'height': 900 if w > 500 else 844})
        c.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        if os.environ.get('RECENT'):   # 최근 사용 기록 3개 상태(홈 최근 사용한 계산기가 보임)
            c.add_init_script("try{localStorage.setItem('jpt_recent', JSON.stringify([['take-home-pay','연봉 실수령액 계산기'],['bonus-pay','성과급 실수령 계산기'],['ordinary-wage','통상임금 계산기']].map(function(x){return {url:'/calc/salary/'+x[0]+'/',name:x[1],cat:'salary',t:1,summary:''}})))}catch(e){}")
        c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in ('googlesyndication', 'googletagmanager', 'kakao', 'daumcdn', 'pagead')) else rt.continue_())
        pg = c.new_page()
        for u in PAGES:
            try: pg.goto(base + u, wait_until='load'); pg.wait_for_timeout(200)
            except Exception as e: print('열기 실패', u, e); continue
            for r in pg.evaluate(JS, w): r.update(u=u, w=w); rows.append(r)
        c.close()
    br.close()
def fail(r):
    if r['t'] in ('font', 'over64'): return True
    return abs(r['v'] - r['want']) > 4
groups = collections.defaultdict(list)
for r in rows:
    if fail(r): groups[(r['t'], r['p'], r['el'], r['x'] if r['t'] in ('font', 'pad') else r['x'].split(' ')[0], r['v'], r['want'])].append((r['u'], r['w']))
res = sorted(([*k, len(v), sorted({x[1] for x in v}), sorted({x[0] for x in v})[:4]] for k, v in groups.items()), key=lambda x: -x[6])
cnt = collections.Counter(r['t'] for r in rows); fcnt = collections.Counter()
for g in res: fcnt[g[0]] += g[6]
json.dump({'pages': len(PAGES), 'measured': len(rows), 'by_type': cnt, 'fail_by_type': fcnt, 'groups': res}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('페이지', len(PAGES), '× 2폭 | 측정', len(rows), dict(cnt), '| 실패 묶음', len(res), '| 실패', sum(g[6] for g in res), dict(fcnt))
for g in res[:90]: print(g)

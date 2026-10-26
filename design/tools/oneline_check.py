"""한 줄 검사(2026-10-22, 최근 기록 칩이 글자 단위로 세로로 꺾인 사고 뒤 신설): 한 줄이어야 하는 요소의 글자 높이가
그 요소 한 줄 높이(line-height, normal이면 글자 크기 x 1.3) x 1.5를 넘으면 실패. 높이는 아이콘을 뺀 글자 상자만으로 잰다.
대상: 칩·탭·버튼·배지·결과 바·메뉴 항목·결과 큰 숫자(표지 숫자는 이미지라 글자로 잴 수 없어 화면 큰 숫자로 대신).
선택 버튼(.seg-btn)은 두 줄(이름 + 기준)이 원래 디자인이라 뺀다.
전 페이지 x 320·390·1280, 홈은 최근 기록 0·3개 두 상태. 헤더 펼침 메뉴(1280)와 모바일 메뉴 시트·카테고리 시트(390·320)는 홈·계산기 1곳에서 열어 잰다.
사용: python3 design/tools/oneline_check.py [BASE]   (BASE가 없으면 작업본을 임시 서버로 띄웠다가 닫는다. build_all.sh 9단계, LD_LIBRARY_PATH=$HOME/.local/emulib) 실패 있으면 종료코드 1"""
import os, sys, json, glob
from multiprocessing import Pool
TOOLS = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.abspath(os.path.join(TOOLS, '..', '..'))
BASE = sys.argv[1] if len(sys.argv) > 1 else None
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'adfit', 'doubleclick', 'kakao', 'daumcdn')
RECENT = [{'url': '/calc/realestate/dti/', 'name': 'DTI 계산기', 'cat': 'realestate', 't': 1, 'summary': 'DTI 34.0%'},
          {'url': '/calc/tax/withholding/', 'name': '3.3% 원천징수 계산기', 'cat': 'tax', 't': 2, 'summary': '공제액 3.3만원'},
          {'url': '/calc/realestate/acquisition/', 'name': '취득세 계산기', 'cat': 'realestate', 't': 3, 'summary': '약 660만원'}]
GROUPS = {
    '칩': '.ds-trust-chip, .ds-post-chip, .h-recent-list a, .ds-blog-chips :is(a, button), .ds-hub-tabs :is(a, button), .hub-blog-tag, .ds-chip-meta',
    '탭': '.ds-tabbar a',
    '버튼': '.ds-btn-calc, .ds-btn-primary, .ds-btn-outline, .ds-btn-text, .action-btn, .ds-tools-toggle, .ds-header-nav > :is(a, button), .h-more, .ds-rbar-act, .cta-btn, .ds-table-cta',
    '배지': '.ds-verdict, .ds-pill, .result-badge, .page-badge, .page-header-badge, .ds-badge-pop, .ds-rbar-verdict',
    '결과 바': '.ds-rbar-main',
    '메뉴 항목': '.ds-nav-cats li li a, .ds-nav-cat-all, .ds-footer a, .h-cat-tiles b',
    '큰 숫자': '.ds-result-number, .rh-value, .result-total-value',
}
JS = r"""(groups) => {
  const out = [];
  for (const [g, sel] of Object.entries(groups)) {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.getClientRects().length || el.closest('.seg-btn')) return;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden') return;
      let top = 1e9, bot = -1e9, any = false;
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim() || n.parentElement.closest('svg')) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        for (const q of r.getClientRects()) { if (q.width < 0.5) continue; any = true; top = Math.min(top, q.top); bot = Math.max(bot, q.bottom); }
      }
      if (!any) return;
      const fs = parseFloat(cs.fontSize), lh = cs.lineHeight === 'normal' ? fs * 1.3 : parseFloat(cs.lineHeight);
      const h = bot - top;
      if (h > lh * 1.5) out.push({g, cls: (el.getAttribute('class') || el.tagName).slice(0, 40), text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 30), h: Math.round(h), lh: Math.round(lh), box: Math.round(el.getBoundingClientRect().height)});
    });
  }
  return out;
}"""


def pages():
    out = []
    for d, ds, fs in os.walk(SITE):
        ds[:] = [x for x in ds if x not in ('.git', 'node_modules', 'design', '__pycache__')]
        out += ['/' + os.path.relpath(os.path.join(d, f), SITE) for f in fs if f.endswith('.html') and not f.startswith('naver')]
    out = [p[:-len('index.html')] if p.endswith('index.html') else p for p in out]
    return sorted(p for p in out if '/realestate/dti/' not in p and '/realestate/pyeong/' not in p)


def ctx(b, w, recent):
    c = b.new_context(viewport={'width': w, 'height': 844 if w < 1024 else 800}, is_mobile=w < 1024, has_touch=w < 1024)
    c.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1');" + (f"localStorage.setItem('jpt_recent', {json.dumps(json.dumps(RECENT))});" if recent else "localStorage.removeItem('jpt_recent');") + "}catch(e){}")
    c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
    return c


def measure(pg, url, w, state, res):
    pg.goto(BASE + url, wait_until='domcontentloaded', timeout=60000); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
    for f in pg.evaluate(JS, GROUPS): f.update(u=url, w=w, state=state); res.append(f)


def work(jobs):
    from playwright.sync_api import sync_playwright
    res = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in (320, 390, 1280):
            c = ctx(b, w, False); pg = c.new_page()
            for u in jobs: measure(pg, u, w, '', res)
            c.close()
        b.close()
    return res


def extra():
    """홈 최근 기록 3개 + 열린 메뉴들"""
    from playwright.sync_api import sync_playwright
    res = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in (320, 390, 1280):
            c = ctx(b, w, True); pg = c.new_page()
            measure(pg, '/', w, '최근 기록 3개', res)
            for u in ('/', '/calc/realestate/dsr/'):
                if w >= 1024:
                    for k in ('sit', 'cat'):
                        pg.goto(BASE + u, wait_until='domcontentloaded'); pg.wait_for_timeout(300); pg.click(f'#ds-nav-{k}-btn'); pg.wait_for_timeout(500)
                        for f in pg.evaluate(JS, GROUPS): f.update(u=u, w=w, state=f'헤더 {k} 열림'); res.append(f)
                else:
                    pg.goto(BASE + u, wait_until='domcontentloaded'); pg.wait_for_timeout(300); pg.tap('.ds-menu-btn'); pg.wait_for_timeout(500)
                    for f in pg.evaluate(JS, GROUPS): f.update(u=u, w=w, state='메뉴 시트 열림'); res.append(f)
                    pg.goto(BASE + u, wait_until='domcontentloaded'); pg.wait_for_timeout(300); pg.tap('.ds-tabbar a[data-tab=cat]'); pg.wait_for_timeout(600)
                    for f in pg.evaluate(JS, GROUPS): f.update(u=u, w=w, state='카테고리 시트 열림'); res.append(f)
            c.close()
        b.close()
    return res


if __name__ == '__main__':
    srv = None
    if not BASE:
        sys.path.insert(0, TOOLS); from click_audit import serve
        srv, BASE = serve()
    P = pages(); n = 5
    with Pool(n + 1) as pool:
        parts = [pool.apply_async(work, (P[i::n],)) for i in range(n)] + [pool.apply_async(extra)]
        res = [r for x in parts for r in x.get()]
    if srv: srv.shutdown()
    json.dump(res, open(os.path.join(TOOLS, 'results', 'oneline_check.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    import collections
    by = collections.defaultdict(list)
    for r in res: by[(r['g'], r['cls'], r['text'])].append(f"{r['w']}{('·' + r['state']) if r['state'] else ''} {r['u']}")
    print(f'페이지 {len(P)} x 320·390·1280 + 홈 최근 3개·열린 메뉴 | 실패 {len(res)}건 / {len(by)}종')
    for (g, cls, text), where in sorted(by.items(), key=lambda x: -len(x[1]))[:40]:
        print(f'  [{g}] .{cls} "{text}" {len(where)}곳 예: {where[0]}' + (f' 외 {where[1]}' if len(where) > 1 else ''))
    sys.exit(1 if res else 0)

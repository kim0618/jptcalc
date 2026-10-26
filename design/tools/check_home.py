"""홈·최근 화면 측정: JS 오류, 가로 넘침, 390 첫 화면(검색창·상황 카드 몇 개가 탭바 위로 온전히 보이는지), 스크린샷.
사용: python3 design/tools/check_home.py OUTDIR"""
import sys, os, json
from playwright.sync_api import sync_playwright
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'adfit', 'doubleclick')
R = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in ((390, 844), (1280, 900)):
        ctx = b.new_context(viewport={'width': w, 'height': h}); ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.on('console', lambda m: errs.append('console:' + m.text[:200]) if m.type == 'error' and 'net::' not in m.text else None)
        pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
        for path in ('/', '/recent/'):
            pg.goto('http://localhost:8765' + path, wait_until='networkidle'); pg.wait_for_timeout(300)
            r = pg.evaluate("""() => {
              const tab = document.querySelector('.ds-tabbar'); const tr = tab && tab.getClientRects().length ? tab.getBoundingClientRect() : null; const bottom = tr && tr.height ? tr.top : innerHeight;
              const s = document.querySelector('#h-search .ds-search-field'); const sr = s && s.getBoundingClientRect();
              const cards = [...document.querySelectorAll('.h-sit')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
              return { scrollW: document.documentElement.scrollWidth, search: sr ? [Math.round(sr.top), Math.round(sr.bottom)] : null,
                       cards_full: cards.filter(r => r.top >= 0 && r.bottom <= bottom).length, cards_visible: cards.length, tab_top: Math.round(bottom) }; }""")
            r['errors'] = list(errs); errs.clear()
            name = (path.strip('/') or 'home') + f'-{w}'
            pg.screenshot(path=os.path.join(out, name + '-first.png'))
            pg.screenshot(path=os.path.join(out, name + '-full.png'), full_page=True)
            R[name] = r
        ctx.close()
    b.close()
print(json.dumps(R, ensure_ascii=False, indent=1))

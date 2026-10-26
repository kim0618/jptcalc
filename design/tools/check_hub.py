"""허브 확인: 390 첫 화면 계산기 링크 수, 탭 거르기, 가로 넘침, JS 오류, 캡처. 사용: python3 design/tools/check_hub.py OUTDIR CAT"""
import sys, json, os
from playwright.sync_api import sync_playwright
OUT, CAT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'adfit', 'doubleclick', 'html2canvas')
r = {'errors': []}
with sync_playwright() as p:
    b = p.chromium.launch()
    def page(w, h):
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=w < 1024); ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        pg = ctx.new_page(); pg.on('pageerror', lambda e: r['errors'].append(str(e)[:120]))
        pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
        pg.goto(f'http://localhost:8765/calc/{CAT}/', wait_until='networkidle'); pg.wait_for_timeout(300); return pg
    pg = page(390, 844)
    r['first_screen_links'] = pg.evaluate("() => { const tb = document.querySelector('.ds-tabbar').getBoundingClientRect().top; return [...document.querySelectorAll('.ds-hub-row')].filter(a => { const x = a.getBoundingClientRect(); return x.top >= 0 && x.bottom <= tb }).length }")
    r['rows'] = pg.evaluate("document.querySelectorAll('.ds-hub-row').length")
    r['w390'] = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
    pg.screenshot(path=f'{OUT}/hub-m.png')
    tabs = pg.evaluate("[...document.querySelectorAll('.ds-hub-tabs button')].map(b => b.dataset.tab)")
    r['tabs'] = {}
    for t in tabs[1:]:
        pg.click(f'.ds-hub-tabs button[data-tab="{t}"]'); pg.wait_for_timeout(100)
        r['tabs'][t] = pg.evaluate("[...document.querySelectorAll('.ds-hub-group')].filter(g => !g.hidden).map(g => g.querySelectorAll('.ds-hub-row').length).join(',')")
    pg.context.close()
    pg = page(1440, 1000); r['w1440'] = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]"); pg.screenshot(path=f'{OUT}/hub-d.png'); pg.context.close()
    b.close()
print(json.dumps(r, ensure_ascii=False))

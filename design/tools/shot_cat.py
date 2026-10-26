"""카테고리 계산기들 캡처·측정: 390 첫 화면, 390 결과(예시값 입력), 1440 결과. 첫 조작칸 top·가로 넘침·JS 오류.
사용: python3 design/tools/shot_cat.py OUTDIR CAT SLUG [SLUG...]"""
import sys, json, os
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
OUT, CAT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FILL = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'baseline_auto.py'), encoding='utf-8').read().split('FILL = r"""')[1].split('"""')[0]
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'adfit', 'doubleclick', 'html2canvas')
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for slug in sys.argv[3:]:
        r = {'errors': []}
        for w, h in ((390, 844), (1440, 1000)):
            ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, has_touch=w < 1024)
            ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
            pg = ctx.new_page(); pg.on('pageerror', lambda e: r['errors'].append(str(e)[:120]))
            pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
            pg.goto(f'http://localhost:8765/calc/{CAT}/{slug}/', wait_until='networkidle'); pg.wait_for_timeout(300)
            if w == 390:
                r['first_control'] = pg.evaluate("() => { const e = (document.querySelector('.ds-input-card input:not([type=hidden]), .ds-input-card .seg-btn, .ds-input-card select, .ds-input-card textarea, .ds-input-card button') || document.querySelector('.ds-calc-table table')); return e ? Math.round(e.getBoundingClientRect().top) : null }")
                r['group_label_first'] = pg.evaluate("() => { const c = document.querySelector('.ds-input-card'); const f = c && c.querySelector('.ds-group-label'); if (!f) return false; const first = c.querySelector('input, .seg-btn, select, textarea, .ds-group-label'); return first === f }")
                pg.screenshot(path=f'{OUT}/{slug}-m-empty.png')
            pg.evaluate(FILL, 'a'); pg.wait_for_timeout(400)
            r[f'w{w}'] = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
            if w == 390:
                pg.evaluate("() => { const c = document.querySelector('.ds-btn-calc') || document.querySelector('.ds-calc-result') || document.querySelector('.ds-calc-table'); scrollTo(0, c.getBoundingClientRect().top + scrollY - 170) }"); pg.wait_for_timeout(250)
                pg.screenshot(path=f'{OUT}/{slug}-m-result.png')
            else:
                pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(200); pg.screenshot(path=f'{OUT}/{slug}-d-result.png')
            ctx.close()
        res[slug] = r
        print(slug, json.dumps(r, ensure_ascii=False))
    b.close()

"""상황 시트 흐름 시험(390): 카드 → 시트 열림 → 입력 → 단계 클릭 → 계산기 값·"가져옴" → 뒤로(시트 다시 열림) → 뒤로(시트 닫힘).
GA 이벤트는 페이지의 gtag가 쌓는 dataLayer에서 확인. 사용: python3 design/tools/test_sheet.py OUTDIR"""
import sys, os, json
from playwright.sync_api import sync_playwright
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
CASES = [('buy-home', {'price': '60000', 'income': '5000'}, 1, '#acq-price', '60,000'),
         ('job-change', {'salary': '4500'}, 2, '#s0-salary', '4,500'),
         ('save-money', {'monthly': '50', 'principal': '1000'}, 2, '#dep-amount', '1,000')]
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'adfit', 'doubleclick')
EVS = "() => (window.dataLayer || []).filter(a => a && a[0] === 'event').map(a => [a[1], JSON.stringify(a[2])])"
res = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for sid, vals, stepno, sel, want in CASES:
        ctx = b.new_context(viewport={'width': 390, 'height': 844}); ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:150]))
        pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
        pg.goto('http://localhost:8765/', wait_until='networkidle')
        if not pg.is_visible(f'[data-sit="{sid}"]'): pg.click('#h-sits-all')
        pg.click(f'[data-sit="{sid}"]'); pg.wait_for_timeout(250)
        r = {'situation': sid, 'sheet_open': pg.is_visible('#h-sheet'), 'url_after_open': pg.url.replace('http://localhost:8765', '')}
        for k, v in vals.items(): pg.fill(f'#h-in-{k}', v)
        pg.screenshot(path=os.path.join(out, f'{sid}-1-sheet.png'))
        a = pg.locator(f'#h-steps a[data-step="{stepno}"]'); r['step_href'] = a.get_attribute('href')
        r['events_home'] = pg.evaluate(EVS)
        a.click(); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(400)
        r['calc_url'] = pg.url.replace('http://localhost:8765', '')
        r['calc_value'] = pg.input_value(sel)
        r['badge'] = pg.locator('.ds-prefill-badge').count(); r['note'] = pg.inner_text('.ds-prefill-note span') if pg.locator('.ds-prefill-note').count() else ''
        r['value_ok'] = r['calc_value'] == want
        pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{block:'center'}})"); pg.wait_for_timeout(150)
        pg.screenshot(path=os.path.join(out, f'{sid}-2-calc.png'))
        pg.go_back(); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(400)
        r['back1_url'] = pg.url.replace('http://localhost:8765', ''); r['back1_sheet'] = pg.is_visible('#h-sheet')
        pg.go_back(); pg.wait_for_timeout(400)
        r['back2_url'] = pg.url.replace('http://localhost:8765', ''); r['back2_sheet'] = pg.is_visible('#h-sheet')
        # 시트를 열고 바로 뒤로가기만 해도 닫히는지
        pg.click(f'[data-sit="{sid}"]') if pg.is_visible(f'[data-sit="{sid}"]') else (pg.click('#h-sits-all'), pg.click(f'[data-sit="{sid}"]'))
        pg.wait_for_timeout(200); pg.go_back(); pg.wait_for_timeout(300)
        r['open_then_back_closed'] = not pg.is_visible('#h-sheet') and pg.url.endswith('/')
        r['errors'] = errs; res.append(r); ctx.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))

"""최종 화면 리뷰 캡처 + 시트(검수용, 배포 제외, 2026-10-21): WSL Playwright 헤드리스 Chromium.
- 390: 390×844, deviceScaleFactor 2, isMobile, hasTouch, 모바일(iPhone) UA / 1280: 1280×800, dsf 1
- 쿠키 동의 상태로 시작. 글꼴(document.fonts.ready)·이미지(지연 로드 포함) 로드 후 촬영. 광고 네트워크는 막아 광고 칸은 원래 크기 빈 칸 → 시트에 "광고 칸" 표시
- 전체 컷(fullPage)은 고정 요소(탭바·결과 바·쿠키 바)를 숨겨 중간에 반복되지 않게, 결과 바·메뉴 열림·시트는 뷰포트 컷으로
- 계산기 컷은 입력 뒤 계산 버튼을 실제로 눌러 결과 상태로 찍는다(10/21부터 빈 상태 클릭 → 검증 안내 컷 추가)
- 상태 동작(입력·클릭·메뉴 열기)은 page 스크립트, 동작 뒤 기대 요소가 보이는지 확인하고 아니면 그 컷은 실패로 기록
사용: python3 design/tools/review_final.py BASE OUTDIR [시트번호,...]   (예: http://localhost:8772 design/review-final, LD_LIBRARY_PATH=$HOME/.local/emulib)"""
import sys, os, json, math, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
BASE, OUT = sys.argv[1].rstrip('/'), sys.argv[2]
ONLY = sys.argv[3].split(',') if len(sys.argv) > 3 else None   # 시트 번호만 다시(예: 01,06,08), 나머지 컷 기록·시트는 그대로
RAW = os.path.join(OUT, '_raw'); os.makedirs(RAW, exist_ok=True)
UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
ADS = ('googlesyndication', 'googletagmanager', 'google-analytics', 'doubleclick', 'kakao', 'daumcdn', 'adfit', 'pagead')
RECENT = [{'url': '/calc/realestate/dti/', 'name': 'DTI 계산기', 'cat': 'realestate', 't': 1, 'summary': 'DTI 34.0%'},
          {'url': '/calc/tax/withholding/', 'name': '3.3% 원천징수 계산기', 'cat': 'tax', 't': 2, 'summary': '공제액 3.3만원'},
          {'url': '/calc/realestate/acquisition/', 'name': '취득세 계산기', 'cat': 'realestate', 't': 3, 'summary': '약 660만원'}]
VIS = "(s) => { const e = document.querySelector(s); if (!e) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.height > 0 && !e.closest('[hidden]'); }"
def result_ok(sel): return f"() => {{ const e = document.querySelector('{sel}'); if (!e) return false; const r = e.getBoundingClientRect(); const t = e.innerText || ''; return r.height > 40 && /\\d/.test(t) && !/값을 입력하면/.test(t); }}"
# 동작: ('fill', sel, val) / ('click', sel) / ('date', sel, val) / ('js', code) / ('top',)
ACQ = [('fill', '#acq-price', '90000'), ('click', '.ds-btn-calc')]
DSR = [('fill', '#dsr-income', '6000'), ('fill', '#dsr-mortgage', '1200'), ('fill', '#dsr-other', '300'), ('click', '.ds-btn-calc')]
SAL = [('fill', '#s0-salary', '4800'), ('click', '.ds-btn-calc'), ('click', '.ds-tools-toggle')]
BMI = [('fill', '#bmi-height', '170'), ('fill', '#bmi-weight', '65'), ('click', '.ds-btn-calc')]
AGE = [('date', '#age-birth', '1990-05-20'), ('date', '#age-base', '2026-10-19'), ('click', 'main button:has-text("나이 계산하기")')]
# (시트, 컷 이름, 설명, 경로, 동작, 확인 JS, 폭들, 종류 full|view, 최근 기록 넣기)
CUTS = [
 ('01', 'home', '홈 (최근 기록 3개)', '/', [], "() => document.querySelectorAll('#h-recent:not([hidden]) #h-recent-list li').length === 3", (390, 1280), 'full', True),
 ('02', 'menu-sit', '헤더 상황별 열림', '/calc/realestate/dsr/', [('click', '#ds-nav-sit-btn')], "() => !!document.querySelector('#ds-nav-sit.is-open') && document.querySelectorAll('#ds-nav-sit .ds-nav-sits a').length === 15", (1280,), 'view', False),
 ('02', 'menu-cat', '헤더 카테고리 열림', '/calc/realestate/dsr/', [('click', '#ds-nav-cat-btn')], "() => !!document.querySelector('#ds-nav-cat.is-open') && document.querySelectorAll('#ds-nav-cat .ds-nav-cats > li').length === 12", (1280,), 'view', False),
 ('02', 'menu-mobile', '모바일 메뉴 시트', '/calc/realestate/dsr/', [('click', '.ds-menu-btn')], "() => { const m = document.getElementById('ds-menu'); return !!m && !m.hidden; }", (390,), 'view', False),
 ('02', 'tabbar', '모바일 탭바 (카테고리 활성)', '/calc/salary/', [], "() => { const a = document.querySelector('.ds-tabbar a[aria-current=page]'); return !!a && /카테고리/.test(a.textContent); }", (390,), 'view', False),
 ('03', 'sheet', '상황 시트: 집 살 때', '/#s=buy-home', [], "() => { const s = document.getElementById('h-sheet'); return !!s && !s.hidden && document.getElementById('h-sheet-title').textContent === '집 살 때'; }", (390, 1280), 'view', False),
 ('04', 'hub-re', '허브: 부동산', '/calc/realestate/', [], f"() => ({VIS})('main h1')", (390, 1280), 'full', False),
 ('05', 'hub-sal', '허브: 이직/연봉', '/calc/salary/', [], f"() => ({VIS})('main h1')", (390, 1280), 'full', False),
 ('06', 'acq-empty', '취득세: 빈 상태', '/calc/realestate/acquisition/', [], f"() => ({VIS})('.ds-input-card')", (390, 1280), 'full', False),
 ('06', 'acq-result', '취득세: 입력 후 결과 → 하단', '/calc/realestate/acquisition/', ACQ, result_ok('#acq-result'), (390, 1280), 'full', False),
 ('06', 'acq-need', '취득세: 빈 상태에서 계산 클릭 (검증 안내)', '/calc/realestate/acquisition/', [('click', '.ds-btn-calc')], f"() => ({VIS})('.ds-calc-hint')", (390, 1280), 'view', False),
 ('06', 'acq-bar', '취득세: 입력 후 첫 화면 (결과 바)', '/calc/realestate/acquisition/', ACQ + [('top',)], f"() => ({VIS})('.ds-rbar')", (390,), 'view', False),
 ('07', 'dsr', 'DSR: 결과 + 판정 배지 + 이어서 계산', '/calc/realestate/dsr/', DSR, result_ok('#dsr-result'), (390, 1280), 'full', False),
 ('08', 'salary', '연봉 실수령액: 결과 + 구성 막대 + 저장·공유 펼침', '/calc/salary/take-home-pay/', SAL, result_ok('#s0-result').replace('return r.height', "return document.querySelector('.ds-tools-toggle[aria-expanded=\"true\"]') && r.height"), (390, 1280), 'full', False),
 ('09', 'bmi', 'BMI', '/calc/health/bmi/', BMI, result_ok('#s0-result'), (390, 1280), 'full', False),
 ('10', 'age', '만 나이 (날짜 입력)', '/calc/date/age/', AGE, result_ok('#age-result'), (390, 1280), 'full', False),
 ('11', 'blog-all', '블로그 목록: 전체', '/blog/', [], "() => document.querySelectorAll('#ds-blog-list .ds-blog-card').length > 0", (390, 1280), 'full', False),
 ('11', 'blog-re', '블로그 목록: 부동산 필터', '/blog/', [('click', '.ds-blog-chips button[data-cat=realestate]')], "() => !!document.querySelector('.ds-blog-chips button[data-cat=realestate][aria-pressed=true]')", (390, 1280), 'full', False),
 ('12', 'post', '블로그 글: holding-tax-guide', '/blog/posts/holding-tax-guide.html', [], f"() => ({VIS})('.ds-post-body')", (390, 1280), 'full', False),
 ('13', 'about', '소개 첫 화면', '/about.html', [], f"() => ({VIS})('.ds-doc-body h1')", (390, 1280), 'view', False),
 ('13', 'privacy', '개인정보처리방침 첫 화면', '/privacy.html', [], f"() => ({VIS})('.ds-doc-body h1')", (390, 1280), 'view', False),
 ('14', '404', '404', '/404.html', [], f"() => ({VIS})('.ds-404 h1')", (390, 1280), 'full', False),
 ('14', 'recent', '최근 사용 (/recent/, 기록 3개)', '/recent/', [], "() => document.querySelectorAll('main a[href*=\"/calc/\"]').length >= 3", (390, 1280), 'full', True),
 ('15', 'dti', 'DTI (옛 판, 비교용)', '/calc/realestate/dti/', [], f"() => ({VIS})('main, .container, body')", (390, 1280), 'full', False),
]
# 탭바를 숨기면 그 자리 여백(body padding-bottom)도 없앤다(10/21: 남겨 두면 바닥글 아래 회색 띠로 보였다)
HIDE_FIXED = '.ds-tabbar, .ds-rbar, #jpt-cookie-bar, .cookie-banner { display: none !important; } body.ds-has-tabbar, body.ds-has-tabbar.ds-rbar-on { padding-bottom: 0 !important; }'
def ctx_for(br, w, recent):
    if w == 390: c = br.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, user_agent=UA)
    else: c = br.new_context(viewport={'width': 1280, 'height': 800}, device_scale_factor=1)
    init = "try{localStorage.setItem('jpt_cookie_ok','1');" + (f"localStorage.setItem('jpt_recent', {json.dumps(json.dumps(RECENT))});" if recent else "localStorage.removeItem('jpt_recent');") + "}catch(e){}"
    c.add_init_script(init)
    c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in ADS) else rt.continue_())
    return c
def settle(pg):
    pg.evaluate("document.fonts.ready")
    pg.evaluate("() => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); }")
    pg.wait_for_function("() => [...document.images].every(i => i.complete)", timeout=15000)
    pg.wait_for_timeout(300)
results = []
with sync_playwright() as p:
    br = p.chromium.launch()
    for sh, key, title, path, acts, check, ws, kind, recent in CUTS:
        if ONLY and sh not in ONLY: continue
        for w in ws:
            name = f'{sh}-{key}-{w}'; rec = {'sheet': sh, 'cut': key, 'title': title, 'w': w, 'kind': kind, 'file': name + '.png', 'ok': False, 'err': '', 'ads': []}
            c = ctx_for(br, w, recent); pg = c.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:120]))
            try:
                pg.goto(BASE + path, wait_until='load'); pg.wait_for_timeout(500); settle(pg)
                for a in acts:
                    if a[0] == 'fill': pg.fill(a[1], a[2]); pg.dispatch_event(a[1], 'change')
                    elif a[0] == 'click': pg.click(a[1])
                    elif a[0] == 'date': pg.evaluate("([s, v]) => { const e = document.querySelector(s); if (e._flatpickr) e._flatpickr.setDate(v, true); else { e.value = v; e.dispatchEvent(new Event('input', {bubbles: true})); e.dispatchEvent(new Event('change', {bubbles: true})); } }", [a[1], a[2]])
                    elif a[0] == 'top': pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(400); pg.evaluate("window.dispatchEvent(new Event('scroll'))")
                    pg.wait_for_timeout(450)
                pg.wait_for_timeout(400); settle(pg)
                ok = pg.evaluate(check)
                if kind == 'full':
                    pg.add_style_tag(content=HIDE_FIXED); pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(300)
                    rec['ads'] = pg.evaluate("() => [...document.querySelectorAll('.adfit-slot, .ds-ad')].filter(e => e.offsetHeight > 0 && !e.parentElement.closest('.adfit-slot, .ds-ad')).map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height]; })")
                    pg.screenshot(path=os.path.join(RAW, rec['file']), full_page=True)
                else:
                    rec['ads'] = pg.evaluate("() => [...document.querySelectorAll('.adfit-slot, .ds-ad')].filter(e => e.offsetHeight > 0 && !e.parentElement.closest('.adfit-slot, .ds-ad')).map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; }).filter(r => r[1] < innerHeight && r[1] + r[3] > 0)")
                    pg.screenshot(path=os.path.join(RAW, rec['file']))
                rec['ok'] = bool(ok); rec['js'] = errs
                if not ok: rec['err'] = '기대 요소 확인 실패'
            except Exception as e:
                rec['err'] = str(e)[:200]
            results.append(rec); c.close()
            print(('OK  ' if rec['ok'] else 'FAIL'), name, rec['err'], ('JS오류 ' + str(len(errs))) if errs else '')
    br.close()
if ONLY:   # 다시 찍은 시트만 바꾸고 나머지 컷 기록은 그대로
    prev = json.load(open(os.path.join(OUT, '_cuts.json'), encoding='utf-8')) if os.path.exists(os.path.join(OUT, '_cuts.json')) else []
    keep = [r for r in prev if r['sheet'] not in ONLY]
    json.dump(sorted(keep + results, key=lambda r: r['sheet']), open(os.path.join(OUT, '_cuts.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
else:
    json.dump(results, open(os.path.join(OUT, '_cuts.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ── 시트 ──
FONTF = next((f for f in ('/mnt/c/Windows/Fonts/malgunbd.ttf', '/mnt/c/Windows/Fonts/malgun.ttf') if os.path.exists(f)), None)
def font(n): return ImageFont.truetype(FONTF, n) if FONTF else ImageFont.load_default()
TITLES = {'01': '홈 (최근 기록 3개 상태)', '02': '헤더 메뉴: 상황별·카테고리 열림(1280) / 모바일 메뉴 시트·탭바(390)', '03': '상황 시트 "집 살 때"', '04': '허브: 부동산', '05': '허브: 이직/연봉',
          '06': '취득세: 빈 상태 → 입력 후 결과(결과 바) → 하단', '07': 'DSR: 결과 + 판정 배지 + 이어서 계산', '08': '연봉 실수령액: 결과 + 구성 막대 + 저장·공유 펼침', '09': 'BMI', '10': '만 나이 (날짜 입력)',
          '11': '블로그 목록 (전체 + 부동산 필터)', '12': '블로그 글: holding-tax-guide', '13': '정보 페이지: 소개 + 개인정보처리방침 첫 화면', '14': '404 + /recent/', '15': 'DTI (옛 판, 비교용)'}
FILES = {'01': '01-home', '02': '02-header-menu', '03': '03-situation-sheet', '04': '04-hub-realestate', '05': '05-hub-salary', '06': '06-acquisition', '07': '07-dsr', '08': '08-take-home-pay',
         '09': '09-bmi', '10': '10-age', '11': '11-blog-list', '12': '12-blog-post', '13': '13-info-pages', '14': '14-404-recent', '15': '15-dti-old'}
def load(rec):
    im = Image.open(os.path.join(RAW, rec['file'])).convert('RGB'); sc = 0.5 if rec['w'] == 390 else 1.0   # 390은 2배로 찍어 1배로 줄임
    if sc != 1: im = im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    for x, y, w, h in rec['ads']:   # 광고 칸 표시
        x, y, w, h = [v * (1 if rec['w'] == 1280 else 1) for v in (x, y, w, h)]
        for k in range(0, int(w), 12): d.line([(x + k, y), (x + min(k + 6, w), y)], fill=(220, 38, 38), width=2); d.line([(x + k, y + h), (x + min(k + 6, w), y + h)], fill=(220, 38, 38), width=2)
        for k in range(0, int(h), 12): d.line([(x, y + k), (x, y + min(k + 6, h))], fill=(220, 38, 38), width=2); d.line([(x + w, y + k), (x + w, y + min(k + 6, h))], fill=(220, 38, 38), width=2)
        d.rectangle([x + w / 2 - 60, y + h / 2 - 18, x + w / 2 + 60, y + h / 2 + 18], fill=(254, 236, 236)); d.text((x + w / 2 - 44, y + h / 2 - 14), '광고 칸', fill=(200, 30, 30), font=font(22))
    return im
def cols(img, n, gap=16):
    ch = math.ceil(img.height / n); o = Image.new('RGB', (n * img.width + (n - 1) * gap, ch), (200, 203, 208))
    for i in range(n): o.paste(img.crop((0, i * ch, img.width, min((i + 1) * ch, img.height))), (i * (img.width + gap), 0))
    return o
def label(img, text, bad=False):
    o = Image.new('RGB', (img.width, img.height + 44), (255, 255, 255)); d = ImageDraw.Draw(o)
    d.text((4, 6), text + ('   [실패 컷]' if bad else ''), fill=(200, 30, 30) if bad else (40, 48, 70), font=font(24)); o.paste(img, (0, 44)); return o
by = {}
for r in results: by.setdefault(r['sheet'], []).append(r)
for sh, recs in sorted(by.items()):
    blocks = []
    for r in [x for x in recs if x['w'] == 390 and x['kind'] == 'full'] + [x for x in recs if x['kind'] == 'view'] + [x for x in recs if x['w'] == 1280 and x['kind'] == 'full']:
        if not os.path.exists(os.path.join(RAW, r['file'])): continue
        im = load(r)
        if r['kind'] == 'full' and r['w'] == 390: im = cols(im, max(1, min(5, math.ceil(im.height / 1900)))); t = f"{r['title']} · 390 전체(세로로 잘라 나란히)"
        elif r['kind'] == 'full': im = im.resize((1152, round(im.height * 0.9)), Image.LANCZOS); im = cols(im, 2, 24) if im.height > 1900 else im; t = f"{r['title']} · 1280 전체(0.9배)"
        else:
            if r['w'] == 1280: im = im.resize((1024, 640), Image.LANCZOS)
            t = f"{r['title']} · {r['w']} 뷰포트 컷"
        blocks.append(label(im, t, not r['ok']))
    rows, cur, cw = [], [], 0
    for b in blocks:
        if cur and cw + 32 + b.width > 2352: rows.append(cur); cur, cw = [], 0
        cur.append(b); cw += (32 if cw else 0) + b.width
    if cur: rows.append(cur)
    if not rows: print('시트 건너뜀(컷 없음)', sh); continue
    W = max(sum(b.width for b in r) + 32 * (len(r) - 1) for r in rows) + 48; H = 90 + sum(max(b.height for b in r) + 40 for r in rows)
    o = Image.new('RGB', (W, H), (236, 239, 244)); d = ImageDraw.Draw(o); d.text((24, 22), f'{sh}  {TITLES[sh]}', fill=(0, 28, 81), font=font(40))
    y = 90
    for r in rows:
        x = 24
        for b in r: o.paste(b, (x, y)); x += b.width + 32
        y += max(b.height for b in r) + 40
    o.save(os.path.join(OUT, FILES[sh] + '.png'), optimize=True); print('시트', FILES[sh], o.size)
fails = [r for r in results if not r['ok']]
print('컷', len(results), '| 실패', len(fails), [f"{r['sheet']}-{r['cut']}-{r['w']}: {r['err']}" for r in fails])

"""클릭 검사(2026-10-21, 계산 버튼 onclick 깨짐 58페이지 사고 뒤 신설): 실제 크롬으로 버튼을 눌러 본다.
계산기 102개(results/expected_102.json 목록, dti·pyeong 제외) 각각, 390:
  a) 빈 상태에서 계산 버튼 클릭 → 검증 안내(.ds-calc-hint) 표시. 기본값이 들어 있어 바로 계산되는 페이지는 결과 표시로 통과(따로 집계)
  b) 대표 입력 a·b(calc_inputs.py, baseline_auto와 같은 입력) → 계산 버튼 클릭 → 결과 표시 + 결과가 화면 위쪽 60% 안으로 스크롤
     + 결과 글자가 expected_102와 일치 + 그 결과가 실제로 보임(숨은 카드의 글자로 일치하는 것 방지, 10/21 글자수 세기)
  c) 결과 복사 · 결과 아래 줄(저장·기록·결과공유·이미지저장) · 이어서 계산(첫 카드, 이동한 페이지까지) 클릭
  + 그 페이지의 나머지 버튼(선택 버튼·FAQ·목차·메뉴 등) 전부 클릭
홈(최근 기록 3개)·/recent/·허브 12·블로그 목록·글 전부·정보 페이지 5·404: 390과 1280에서 버튼 전부 클릭
(button, [role=button], summary, a[href^="#"], onclick 붙은 요소. 다른 페이지로 가는 링크는 누르지 않는다).
모든 단계 JS 오류 0(pageerror), alert 0. 계산기 대조 수가 102가 아니면 실패.
계산 버튼이 없는 계산기(입력하면 바로 계산되는 표·통합 계산기)는 a·b의 버튼·스크롤 단계를 건너뛰고 결과 일치만 본다(목록 출력).
사용: python3 design/tools/click_audit.py [--base http://localhost:8765] [--only 접두어,...] [--workers 5] [--offline]
  --offline(2026-10-26): 광고·분석(ADS·AD_PASS) 말고는 외부 요청을 전부 막는다(외부 CDN 없이 도는지). 외부 요청은 모드와 상관없이 기록해 끝에 목록으로 낸다.
  이미지 저장 버튼은 실제 파일 내려받기가 6초 안에 일어나야 통과.
  --base가 없으면 작업본을 임시 서버(빈 포트)로 띄웠다가 끝나면 닫는다. 결과: results/click_audit.json, 실패 있으면 종료코드 1.
  날짜는 DS_NOW(기본 2026-10-19T12:00:00+09:00)로 고정: expected_102가 그날 기준이다."""
import sys, os, json, time, threading, functools, http.server, socket, collections, urllib.parse, re
from multiprocessing import Pool
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(TOOLS, '..', '..'))
sys.path.insert(0, TOOLS)
from calc_inputs import READ, now_script, fill, core, same
EXPECT = json.load(open(os.path.join(TOOLS, 'results', 'expected_102.json'), encoding='utf-8'))
ADS = ('googlesyndication', 'googletagmanager', 'google-analytics', 'adfit', 'doubleclick')   # 광고·분석만 막는다(html2canvas 등은 실제로 받는다)
AD_PASS = ('kakaocdn', 'daumcdn')   # 카카오 애드핏 로더: --offline에서도 평소처럼 둔다
OFFLINE = '--offline' in sys.argv
LOCAL = ('127.0.0.1', 'localhost')
NOW = os.environ.get('DS_NOW', '2026-10-19T12:00:00+09:00')
RECENT = [{'url': '/calc/realestate/dti/', 'name': 'DTI 계산기', 'cat': 'realestate', 't': 1, 'summary': 'DTI 34.0%'},
          {'url': '/calc/tax/freelancer-income/', 'name': '3.3% 원천징수 계산기', 'cat': 'tax', 't': 2, 'summary': '공제액 3.3만원'},
          {'url': '/calc/realestate/acquisition/', 'name': '취득세 계산기', 'cat': 'realestate', 't': 3, 'summary': '약 660만원'}]
SIZES = {390: dict(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True), 1280: dict(viewport={'width': 1280, 'height': 800})}

# 누를 것 표시: 아직 표시 안 한 '보이는' 누름 요소에 번호를 붙인다(새로 열린 메뉴·시트 안 요소는 다음 호출에서 잡힌다)
TAG = r"""(n0) => { const sel = 'button, [role=button], summary, a[href^="#"], [onclick]:not(a):not(button)';
  const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  let n = n0; const out = [];
  for (const e of document.querySelectorAll(sel)) {
    if (e.dataset.caIdx || e.closest('[data-ca-idx]:not(:scope)') && e.closest('[data-ca-idx]').matches(sel) && e.closest('[data-ca-idx]') !== e) continue;
    if (e.matches('[data-calc-submit]') || !vis(e)) continue;
    e.dataset.caIdx = n; out.push([n, e.tagName.toLowerCase(), (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30)]); n++;
  } return out; }"""
# 결과가 실제로 화면에 그려졌는지: READ와 같은 결과 카드 중 보이는 것의 글자(숨은 카드의 innerText는 글자를 그대로 돌려주므로 따로 본다)
SHOWN = r"""() => [...document.querySelectorAll('.result-card, [id$="-result"], #resultCard, #result')].filter(e => !e.id.startsWith('ds-') && e.getClientRects().length && e.getBoundingClientRect().height > 0).map(e => e.innerText).join(' ').replace(/\s+/g, '').length || ((document.querySelector('.ds-calc-table table, main table') || {getClientRects: () => []}).getClientRects().length ? 1 : 0)"""
STATE = r"""() => { const h = document.querySelector('.ds-calc-hint'); const hint = h && h.getClientRects().length ? h.textContent.trim() : '';
  const b = document.querySelector('main .ds-btn-calc'); let c = b && b.dataset.result && document.getElementById(b.dataset.result);
  if (!c || !c.getClientRects().length) c = [...document.querySelectorAll('.ds-calc-result .result-card, .ds-calc-result [id$="-result"], .ds-calc-result #result')].find(e => e.getClientRects().length && e.innerText.trim());
  const r = c ? c.getBoundingClientRect() : null; const ghost = !!document.querySelector('.ds-result-empty') && getComputedStyle(document.querySelector('.ds-result-empty')).display !== 'none';
  return { hint, card: c ? (c.id || c.className) : '', top: r ? Math.round(r.top) : null, bottom: r ? Math.round(r.bottom) : null, vh: innerHeight, ghost }; }"""


def serve():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
    class H(http.server.SimpleHTTPRequestHandler):
        def end_headers(self): self.send_header('Cache-Control', 'no-store'); super().end_headers()
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(H, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f'http://127.0.0.1:{port}'


def new_page(b, w, rec, recent=False):
    ctx = b.new_context(accept_downloads=True, **SIZES[w])
    ctx.grant_permissions(['clipboard-read', 'clipboard-write'])
    ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1');" + (f"localStorage.setItem('jpt_recent', {json.dumps(json.dumps(RECENT))});" if recent else '') + "}catch(e){}")
    ctx.add_init_script(now_script(NOW))
    def route(rt):
        u = rt.request.url; host = urllib.parse.urlsplit(u).hostname or ''
        external = u.startswith(('http:', 'https:')) and host not in LOCAL
        hold = re.search(r'/calc/realestate/(dti|pyeong)/', rt.request.frame.url or '')   # 11/9까지 main 판(CDN 그대로): 막지 않고 따로 적는다
        if external: rec.setdefault('ext_hold' if hold else 'ext', set()).add(u.split('?')[0])
        if any(k in u for k in ADS): rt.abort()
        elif hold: rt.continue_()
        elif OFFLINE and external and not any(k in u for k in AD_PASS): rec['errors'].append(f"[{rec.get('step', '')}] 외부 요청 막음 {u[:120]}"); rt.abort()
        else: rt.continue_()
    ctx.route('**/*', route)
    ctx.on('page', lambda p: p.close() if p.opener() else None)   # 공유 등으로 새 창이 열리면 닫는다
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: rec['errors'].append(f"[{rec.get('step', '')}] {str(e)[:160]}"))
    pg.on('download', lambda d: rec.setdefault('dl', []).append(d.suggested_filename))
    pg.on('dialog', lambda d: (rec['dialogs'].append(f"[{rec.get('step', '')}] {d.message[:80]}"), d.dismiss()))
    return ctx, pg


def click(pg, loc, rec):
    """실제 클릭(가려지면 Esc 뒤 다시, 그래도 안 되면 요소에 직접 click)"""
    try: loc.click(timeout=1500); return 'click'
    except Exception:
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
        try: loc.click(timeout=1000); return 'click'
        except Exception:
            try: loc.evaluate('e => e.click()'); return 'js'
            except Exception as e: rec['notes'].append(f"누르지 못함 {rec.get('step')}: {str(e)[:80]}"); return 'none'


def sweep(pg, rec, url, label, limit=300):
    """페이지의 누름 요소 전부(새로 보이는 것 포함) 클릭. 다른 페이지로 가면 다시 열고 이어서"""
    done, n, q = set(), 0, []
    def tag():
        nonlocal n
        new = pg.evaluate(TAG, n); n += len(new); q.extend(new)
    tag(); clicks = 0
    while q and clicks < limit:
        idx, t, txt = q.pop(0)
        if idx in done: continue
        done.add(idx); rec['step'] = f'{label} {t}"{txt}"'
        loc = pg.locator(f'[data-ca-idx="{idx}"]')
        if not loc.count(): continue
        before = pg.url.split('#')[0]
        click(pg, loc, rec); clicks += 1; pg.wait_for_timeout(60)
        if pg.url.split('#')[0] != before:   # 버튼이 다른 페이지로 보냄: 기록하고 원래 페이지를 새로 열어 번호를 다시 붙인다
            rec['notes'].append(f'{label} {t}"{txt}" → {pg.url}')
            pg.goto(url, wait_until='load'); pg.wait_for_timeout(300); n = 0; q.clear()
            seen = set(done); tag(); q[:] = [x for x in q if x[0] not in seen]; continue
        tag()
    rec['clicks'] = rec.get('clicks', 0) + clicks
    if clicks >= limit: rec['notes'].append(f'{label}: 클릭 상한 {limit} 도달')


def calc_one(b, base, key):
    rec = {'key': key, 'fail': [], 'errors': [], 'dialogs': [], 'notes': []}
    url = f'{base}/calc/{key}/'
    # a) 빈 상태 클릭
    rec['step'] = 'a 빈 상태'
    ctx, pg = new_page(b, 390, rec); pg.goto(url, wait_until='load'); pg.wait_for_timeout(300)
    btn = pg.locator('main .ds-btn-calc:visible').first
    rec['button'] = btn.count() > 0
    if rec['button']:
        click(pg, btn, rec); pg.wait_for_timeout(500)
        st = pg.evaluate(STATE)
        if st['hint']: rec['a'] = 'hint'; rec['a_hint'] = st['hint']
        elif core(pg.evaluate(READ)) and not st['ghost']: rec['a'] = 'default'
        else: rec['a'] = 'none'; rec['fail'].append('a: 빈 상태 클릭 뒤 안내도 결과도 없음')
    ctx.close()
    # b) 대표 입력 → 클릭 → 결과·스크롤·값  /  c) 결과 쪽 버튼
    for name in ('a', 'b'):
        rec['step'] = f'b 입력{name}'
        ctx, pg = new_page(b, 390, rec); pg.goto(url, wait_until='load'); pg.wait_for_timeout(300)
        fill(pg, key, name); pg.wait_for_timeout(200)
        if rec['button'] and not pg.locator('main .ds-btn-calc:visible').count():
            rec['notes'].append(f'b{name}: 입력 뒤 계산 버튼이 숨는 모드(입력칸 없음) → 결과 글자만 비교')
            pg.wait_for_timeout(400)
        elif rec['button']:
            click(pg, pg.locator('main .ds-btn-calc:visible').first, rec); pg.wait_for_timeout(900)
            st = pg.evaluate(STATE)
            if st['hint']: rec['fail'].append(f'b{name}: 입력 뒤에도 검증 안내 "{st["hint"]}"')
            elif st['top'] is None: rec['fail'].append(f'b{name}: 결과 카드가 보이지 않음')
            elif not (st['bottom'] > 0 and st['top'] <= st['vh'] * 0.6 + 2): rec['fail'].append(f'b{name}: 결과가 화면 밖(top {st["top"]}, 화면 {st["vh"]})')
            rec[f'b{name}_scroll'] = st['top']
        else:
            pg.wait_for_timeout(400)
        got = pg.evaluate(READ)
        if core(got) and not pg.evaluate(SHOWN): rec['fail'].append(f'b{name}: 결과 글자는 있지만 화면에 보이지 않음(숨은 카드)')
        if not same(EXPECT[key], name, got):
            rec['fail'].append(f'b{name}: 결과 불일치\n      기대 {core(EXPECT[key][name])[:150]}\n      실제 {core(got)[:150]}')
        if name == 'b': ctx.close(); continue
        rec['step'] = 'c 결과 버튼'; done = []
        for sel, lab in (('.ds-result-actions button:visible', '결과 복사'), ('.action-row button:visible', '결과 아래 줄')):
            i = 0
            while i < pg.locator(sel).count() and i < 12:   # "저장·공유" 토글을 누르면 아래 줄 4개가 새로 보인다 → 다시 센다
                l = pg.locator(sel).nth(i); t = (l.text_content() or '').strip(); i += 1
                rec['step'] = f'c {lab} "{t}"'; n_dl = len(rec.get('dl', [])); click(pg, l, rec)
                if '이미지' in t:
                    for _ in range(30):
                        if len(rec.get('dl', [])) > n_dl: break
                        pg.wait_for_timeout(200)
                    if len(rec.get('dl', [])) > n_dl: rec['img_ok'] = True
                    else: rec['fail'].append(f'c 이미지 저장: 6초 안에 파일이 내려받아지지 않음')
                else: pg.wait_for_timeout(250)
                done.append(t)
                pg.keyboard.press('Escape')
        rec['c_buttons'] = done
        nxt = pg.locator('.ds-calc-next a.ds-next-card[data-next]:visible, #ds-primary-next:visible').first
        if nxt.count():
            rec['step'] = 'c 이어서 계산'; href = nxt.get_attribute('href'); before = pg.url
            click(pg, nxt, rec)
            try: pg.wait_for_load_state('networkidle', timeout=8000)
            except Exception: pass
            pg.wait_for_timeout(300); rec['c_next'] = href
            if pg.url == before: rec['fail'].append(f'c: 이어서 계산 링크를 눌러도 이동하지 않음 ({href})')
        else:
            rec['c_next'] = ''
        ctx.close()
    # 그 밖의 버튼 전부(390)
    rec['step'] = '버튼 전부'
    ctx, pg = new_page(b, 390, rec); pg.goto(url, wait_until='load'); pg.wait_for_timeout(300)
    sweep(pg, rec, url, '390'); ctx.close()
    if rec['errors']: rec['fail'].append(f"JS 오류 {len(rec['errors'])}건")
    if rec['dialogs']: rec['fail'].append(f"alert {len(rec['dialogs'])}건")
    return rec


def page_one(b, base, path):
    rec = {'key': path, 'fail': [], 'errors': [], 'dialogs': [], 'notes': []}
    recent = path in ('/', '/recent/')
    for w in (390, 1280):
        ctx, pg = new_page(b, w, rec, recent); url = base + path
        rec['step'] = f'{w} 열기'; pg.goto(url, wait_until='load'); pg.wait_for_timeout(300)
        sweep(pg, rec, url, str(w)); ctx.close()
    if rec['errors']: rec['fail'].append(f"JS 오류 {len(rec['errors'])}건")
    if rec['dialogs']: rec['fail'].append(f"alert {len(rec['dialogs'])}건")
    return rec


def work(args):
    base, jobs = args
    from playwright.sync_api import sync_playwright
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for kind, key in jobs:
            t0 = time.time()
            for attempt in (1, 2):   # 페이지 로드 시간 초과(동시 부하로 외부 글꼴·스크립트 대기)만 한 번 다시. 다른 실패는 그대로
                try: r = calc_one(b, base, key) if kind == 'calc' else page_one(b, base, key); break
                except Exception as e:
                    r = {'key': key, 'fail': [f'검사 중단: {str(e)[:200]}'], 'errors': [], 'dialogs': [], 'notes': []}
                    if 'Timeout' not in str(e) or attempt == 2: break
                    r['notes'].append('시간 초과로 다시 검사')
            r['kind'] = kind; r['sec'] = round(time.time() - t0, 1); out.append(r)
            print(('실패 ' if r['fail'] else 'ok ') + key, flush=True)
        b.close()
    return out


def other_pages():
    pages = ['/', '/recent/', '/blog/', '/404.html'] + [f'/{x}.html' for x in ('about', 'privacy', 'terms', 'contact', 'disclaimer')]
    pages += sorted(f'/calc/{d}/' for d in os.listdir(os.path.join(ROOT, 'calc')) if os.path.exists(os.path.join(ROOT, 'calc', d, 'index.html')))
    pages += sorted(f'/blog/posts/{f}' for f in os.listdir(os.path.join(ROOT, 'blog', 'posts')) if f.endswith('.html'))
    return pages


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    only = [x for x in (opt('--only') or '').split(',') if x]
    workers = int(opt('--workers', 5))
    srv = None; base = opt('--base')
    if not base: srv, base = serve()
    jobs = [('calc', k) for k in EXPECT] + [('page', p) for p in other_pages()]
    if only: jobs = [j for j in jobs if any(j[1].startswith(o) for o in only)]
    chunks = [jobs[i::workers] for i in range(workers)]
    t0 = time.time()
    with Pool(workers) as pool: res = [r for part in pool.map(work, [(base, c) for c in chunks]) for r in part]
    if srv: srv.shutdown()
    res.sort(key=lambda r: (r['kind'], r['key']))
    for r in res: r['ext'] = sorted(r.get('ext', ())); r['ext_hold'] = sorted(r.get('ext_hold', ()))
    json.dump(res, open(os.path.join(TOOLS, 'results', 'click_audit.json' if not only else 'click_audit_partial.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    calcs = [r for r in res if r['kind'] == 'calc']; pages = [r for r in res if r['kind'] == 'page']
    bad = [r for r in res if r['fail']]
    print(f'\n소요 {time.time() - t0:.0f}초, 계산기 {len(calcs)}개, 그 밖의 페이지 {len(pages)}개, 클릭 {sum(r.get("clicks", 0) for r in res)}회')
    cnt = collections.Counter(r.get('a', '버튼 없음') for r in calcs)
    print(f"a) 빈 상태 클릭: 검증 안내 {cnt['hint']}, 기본값으로 바로 결과 {cnt['default']}, 아무 반응 없음 {cnt['none']}, 계산 버튼 없음 {cnt['버튼 없음']}")
    nob = [r['key'] for r in calcs if not r.get('button')]
    if nob: print('   계산 버튼 없는 계산기(입력 즉시 계산):', ', '.join(nob))
    dft = [r['key'] for r in calcs if r.get('a') == 'default']
    if dft: print('   기본값으로 바로 결과:', ', '.join(dft))
    print(f"b) 입력 → 클릭 → 결과 일치: {sum(1 for r in calcs if not any(f.startswith('b') for f in r['fail']))}/{len(calcs)}")
    print(f"c) 결과 버튼: 결과 아래 줄·복사 누른 계산기 {sum(1 for r in calcs if r.get('c_buttons'))}, 이어서 계산 이동 {sum(1 for r in calcs if r.get('c_next'))}")
    img = [r['key'] for r in calcs if any('이미지' in t for t in r.get('c_buttons', []))]
    print(f"   이미지 저장: 버튼 누른 계산기 {len(img)}, 파일 받아짐 {sum(1 for r in calcs if r.get('img_ok'))}")
    ext = collections.Counter(u for r in res for u in r['ext'])
    print(f"외부 요청({'막음: 광고·분석 외 전부' if OFFLINE else '막지 않음'}) 주소 {len(ext)}종:")
    for u, n in sorted(ext.items(), key=lambda x: (-x[1], x[0]))[:40]: print(f'   {n:4d}쪽  {u[:110]}')
    hold = sorted({u for r in res for u in r['ext_hold']})
    if hold: print(f"   dti·pyeong(main 판 유지, 막지 않음)에서 나간 외부 요청 {len(hold)}종: " + ', '.join(f'{h} {n}' for h, n in sorted(collections.Counter(urllib.parse.urlsplit(u).hostname for u in hold).items())))
    for r in bad:
        print(f"실패 {r['key']}")
        for f in r['fail']: print('   ', f)
        for e in r['errors'][:5]: print('    오류', e)
        for d in r['dialogs'][:3]: print('    alert', d)
    for r in res:
        for nt in r['notes'][:3]: print('  참고', r['key'], nt)
    want = len([k for k in EXPECT if not only or any(k.startswith(o) for o in only)])
    if len(calcs) != want or (not only and want != 102):
        print(f'실패: 계산기 기대 {102 if not only else want}개, 검사 {len(calcs)}개'); sys.exit(1)
    print(f'클릭 검사 실패 {len(bad)}건'); sys.exit(1 if bad else 0)

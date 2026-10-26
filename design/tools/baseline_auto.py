"""계산기 대표 입력 2세트 결과를 기록(390). 입력값은 각 칸의 예시(placeholder)에서 자동으로 만든다.
  a: 보이는 숫자 칸에 예시값, 날짜 칸 2024-03-15(두 번째부터 2026-10-19), 월 칸 2025-06
  b: 첫 선택 묶음의 두 번째 버튼을 누른 뒤 예시값 ×2 (날짜는 2023-07-01 / 2026-01-31)
  cases.json에 페이지별 수동 케이스가 있으면 그것을 쓴다.
사용: python3 design/tools/baseline_auto.py OUT.json CAT SLUG [SLUG...]   (8765에 작업본 서버)"""
import sys, json, os
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from calc_inputs import BLOCK, READ, ORIG_BTN, now_script, fill   # 입력·읽기는 click_audit.py와 공용
out = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    cat = sys.argv[2]
    for slug in sys.argv[3:]:
        r = {'errors': []}
        for name in ('a', 'b'):
            ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True)
            ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
            if os.environ.get('DS_NOW'):   # 날짜 고정(예: 2026-10-19T12:00:00+09:00): '오늘' 기준 결과(D-day·나이)를 다른 날 잰 결과와 대조할 때
                ctx.add_init_script(now_script(os.environ['DS_NOW']))
            pg = ctx.new_page(); pg.on('pageerror', lambda e: r['errors'].append(str(e)[:150]))
            pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
            pg.goto(os.environ.get('DS_BASE', 'http://localhost:8765') + f'/calc/{cat}/{slug}/', wait_until='networkidle'); pg.wait_for_timeout(300)
            r[name + '_input'] = fill(pg, f'{cat}/{slug}', name)
            # 계산 버튼만 있고 입력 이벤트로 계산하지 않는 페이지 대비: 원본 '계산' 버튼이 있으면 누른다
            pg.evaluate(ORIG_BTN)
            pg.wait_for_timeout(400)
            r[name] = pg.evaluate(READ)
            ctx.close()
        out[f'{cat}/{slug}'] = r
    b.close()
prev = json.load(open(sys.argv[1], encoding='utf-8')) if os.path.exists(sys.argv[1]) else {}
prev.update(out); json.dump(prev, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k, v in out.items():
    print(k, '| err', len(v['errors']), '|', v['a'][:90], '||', v['b'][:90])

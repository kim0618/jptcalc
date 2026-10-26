"""넘침 검사 실행기(검수용, 배포 제외): design/tools/sweep.html을 실제 크롬에서 열어 페이지 x 폭을 차례로 잰다.
잰 것: 가로 넘침(합격 기준 0), 낱말 끊김·잘림(참고값), iframe 안 JS 오류.
사용: python3 design/tools/sweep_run.py [BASE=http://localhost:8770] [폭=320,360,390,412,1280]   (LD_LIBRARY_PATH=$HOME/.local/emulib)"""
import json, sys, os
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8770'
W = sys.argv[2] if len(sys.argv) > 2 else '320,360,390,412,1280'
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(viewport={'width': 1400, 'height': 900})
    c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in ('googlesyndication', 'googletagmanager', 'google-analytics', 'adfit', 'doubleclick', 'kakao', 'daumcdn')) else rt.continue_())
    pg = c.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)[:150]))
    pg.goto(f'{BASE}/design/tools/sweep.html?w={W}')
    pg.wait_for_function("document.title === 'DONE'", timeout=3600000, polling=2000)
    res = json.loads(pg.evaluate('window.RESULT')); b.close()
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results', 'sweep_out.json'), 'w'), ensure_ascii=False)
ov = [r for r in res if r.get('overflow', 0) > 0]
print('측정', len(res), '넘침', len(ov), '낱말 끊김', sum(1 for r in res if r.get('broken')), '잘림', sum(1 for r in res if r.get('clipped')), '측정 오류', sum(1 for r in res if r.get('err')), 'JS 오류', len(errs))
for r in ov[:20]: print(' 넘침', r['u'], r['w'], r['overflow'])
for e in errs[:10]: print(' JS', e)
sys.exit(1 if ov or errs else 0)

"""회귀 스크린샷: 같은 페이지를 변경 전 서버·변경 후 서버에서 입력 세트 a를 넣은 결과 상태로 전체 페이지 촬영(1280·390) 후 픽셀 비교.
사용: python3 design/tools/regress_shots.py OUTDIR BEFORE_BASE AFTER_BASE PATH...   (PATH 예: /calc/salary/severance/)
달라진 페이지는 OUTDIR/diff/에 좌(전)·우(후)·차이 강조 합성 이미지를 남기고 목록을 출력한다."""
import sys, os, json, re
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
T = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(T, 'baseline_auto.py'), encoding='utf-8').read()
ns = {}; exec(src[src.index('BLOCK ='):src.index('out = {}')], ns)
FILL, BLOCK = ns['FILL'], ns['BLOCK']
out, before, after = sys.argv[1], sys.argv[2], sys.argv[3]; paths = sys.argv[4:]
os.makedirs(os.path.join(out, 'diff'), exist_ok=True)
NOANIM = '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'
def shoot(pg, base, path, w, fn):
    pg.set_viewport_size({'width': w, 'height': 900 if w > 500 else 844})
    pg.goto(base + path, wait_until='networkidle'); pg.add_style_tag(content=NOANIM); pg.wait_for_timeout(250)
    if '/calc/' in path and path.count('/') > 3:
        pg.evaluate(FILL, 'a')
        pg.evaluate("() => { const b = document.querySelector('.ds-btn-calc') || [...document.querySelectorAll('main button')].find(x => /계산하기|계산$|변환하기|확인하기/.test(x.textContent.trim()) && x.offsetParent !== null); if (b) b.click(); }")
        pg.wait_for_timeout(500)
    pg.evaluate("() => scrollTo(0, 0)"); pg.wait_for_timeout(150)
    pg.screenshot(path=fn, full_page=True)
changed = []
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(device_scale_factor=1)
    ctx.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
    pg = ctx.new_page(); pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
    for path in paths:
        name = path.strip('/').replace('/', '_') or 'home'
        for w in (1280, 390):
            fa, fb = os.path.join(out, f'{name}-{w}-before.png'), os.path.join(out, f'{name}-{w}-after.png')
            shoot(pg, before, path, w, fa); shoot(pg, after, path, w, fb)
            A, B = Image.open(fa).convert('RGB'), Image.open(fb).convert('RGB')
            if A.size == B.size:
                d = ImageChops.difference(A, B); bbox = d.getbbox()
                n = sum(1 for px in d.convert('L').point(lambda v: 255 if v > 24 else 0).getdata() if px) if bbox else 0
            else:
                bbox, n = (0, 0) + A.size, -1
            if n != 0:
                H = max(A.height, B.height); comp = Image.new('RGB', (A.width * 2 + 16, H), 'white')
                comp.paste(A, (0, 0)); comp.paste(B, (A.width + 16, 0))
                if n > 0:
                    m = d.convert('L').point(lambda v: 255 if v > 24 else 0); red = Image.new('RGB', B.size, (255, 0, 0))
                    comp.paste(red, (A.width + 16, 0), m.point(lambda v: 110 if v else 0))
                cf = os.path.join(out, 'diff', f'{name}-{w}.png'); comp.save(cf)
                changed.append({'path': path, 'w': w, 'px': n, 'size': [A.size, B.size], 'bbox': bbox, 'img': cf})
                print('변경', path, w, '픽셀', n, '크기', A.size, B.size, 'bbox', bbox, flush=True)
            os.remove(fa) if n == 0 else None; os.remove(fb) if n == 0 else None
    b.close()
json.dump(changed, open(os.path.join(out, 'changed.json'), 'w'), ensure_ascii=False, indent=1)
print('대상', len(paths) * 2, '장면, 달라진 장면', len(changed))

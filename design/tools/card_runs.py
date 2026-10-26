"""카드 연속 검사(검수용, 배포 제외, 2026-10-20): main 안 같은 흐름에서 카드(둥근 상자: 바탕·선·그림자가 비치는 것)가
위아래로 3개 이상 잇달아 붙는 구간을 찾는다. 같은 종류가 틈 없이 이어 붙은 묶음(구분선 있는 한 장)은 카드 1장으로 센다. 사이에 카드 아닌 블록(문단·제목·목록·한 줄 안내)이 하나라도 있으면 끊긴다. 광고 칸은 건너뛴다.
사용: python3 design/tools/card_runs.py OUT.json [BASE]   (대상: 블로그 글 전체 + 계산기 102, 390·1280. LD_LIBRARY_PATH=$HOME/.local/emulib)"""
import sys, os, glob, json
from playwright.sync_api import sync_playwright
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T)); os.chdir(SITE)
out = sys.argv[1]; base = sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:8770'
PAGES = ['/' + p for p in sorted(glob.glob('blog/posts/*.html'))] + \
        sorted('/' + p[:-10] for p in glob.glob('calc/*/*/index.html') if '/dti/' not in p and '/pyeong/' not in p)
JS = r'''() => {
  const main = document.querySelector('main'); if (!main) return [];
  const eff = e => { for (let x = e; x; x = x.parentElement) { const b = getComputedStyle(x).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)') return b; } return 'rgb(255, 255, 255)'; };
  const vis = e => { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || /absolute|fixed/.test(c.position)) return false; const r = e.getBoundingClientRect(); return r.height > 1 && r.width > 1; };
  const card = e => { if (e.matches('input, button, a[class*="btn"], .ds-toc, img, picture, .seg-group, .input-wrap')) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect();
    if (parseFloat(c.borderTopLeftRadius) < 4 || r.height < 48 || r.width < 120) return false;
    return (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== eff(e.parentElement)) || c.boxShadow !== 'none' || (parseFloat(c.borderTopWidth) > 0 && parseFloat(c.borderLeftWidth) > 0); };
  const R = e => e.getBoundingClientRect(), out = [];
  main.querySelectorAll('*').forEach(p => {
    if (!vis(p) || p.closest('.ds-ad, .adfit-slot, .h-sheet, .ds-nav-panel')) return;
    const kids = [...p.children].filter(k => vis(k) && !k.matches('.ds-ad, .adfit-slot, script, style'));
    let run = [];
    const flush = () => { if (run.length >= 3) out.push({ n: run.length, parent: p.className.toString().split(' ')[0] || p.tagName.toLowerCase(), kinds: run.map(k => (k.className.toString().split(' ')[0] || k.tagName.toLowerCase())), top: Math.round(R(run[0]).top + scrollY) }); run = []; };
    const kind = e => (e.className.toString().split(' ')[0] || e.tagName);
    for (const k of kids) {
      const prev = run[run.length - 1];
      if (prev && card(k) && kind(k) === kind(prev) && Math.abs(R(k).top - R(prev).bottom) <= 1) { run[run.length - 1] = k; continue; }   // 같은 종류가 틈 없이 이어 붙으면 한 장의 카드(구분선 있는 묶음)
      const stacked = !prev || (R(k).top >= R(prev).bottom - 1 && Math.min(R(k).right, R(prev).right) - Math.max(R(k).left, R(prev).left) > 20);
      if (card(k) && stacked) run.push(k); else { flush(); if (card(k)) run.push(k); }
    }
    flush();
  });
  return out;
}'''
res = []
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for w in (390, 1280):
        c = br.new_context(viewport={'width': w, 'height': 900}); c.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in ('googlesyndication', 'googletagmanager', 'kakao', 'daumcdn', 'pagead')) else rt.continue_())
        pg = c.new_page()
        for u in PAGES:
            pg.goto(base + u, wait_until='load'); pg.wait_for_timeout(150)
            for r in pg.evaluate(JS): r.update(u=u, w=w); res.append(r)
        c.close()
    br.close()
json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('페이지', len(PAGES), '× 2폭 | 카드 3개 이상 연속', len(res), '구간')
for r in res: print(' ', r['w'], r['u'], r['n'], r['parent'], '>', ' → '.join(r['kinds']))

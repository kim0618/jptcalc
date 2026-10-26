"""SVG 글자 대비 측정(검수용, 배포 제외): 실제 크롬에서 글 본문 SVG의 <text>마다 글자 상자 중심 아래에 깔린 도형을
문서 순서대로 겹쳐(계산된 fill·fill-opacity·opacity) 실제 바탕색을 만들고, 계산된 글자색과 WCAG 대비를 잰다.
사용: python3 design/tools/svg_contrast.py BASE SLUG...   (BASE 예: http://localhost:8770)
출력: 그림별 글자 수·최저 대비·4.5 미달 목록. 미달이 있으면 종료코드 1."""
import sys
from playwright.sync_api import sync_playwright
JS = r"""() => {
  const rgb = s => { const m = s.match(/[\d.]+/g).map(Number); return m.length > 3 ? m : m.concat([1]); };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const over = (top, a, base) => base.map((b, i) => top[i] * a + b * (1 - a));
  const alpha = el => { let a = 1; for (let e = el; e && e.tagName.toLowerCase() !== 'svg'; e = e.parentElement) a *= parseFloat(getComputedStyle(e).opacity); return a; };
  const pageBg = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] > 0) return c.slice(0, 3); } return [255, 255, 255]; };
  const out = [];
  document.querySelectorAll('main svg').forEach((svg, si) => {
    const els = [...svg.querySelectorAll('*')], base0 = pageBg(svg.parentElement);
    els.forEach((t, ti) => {
      if (t.tagName.toLowerCase() !== 'text' || !t.textContent.trim()) return;
      const bb = t.getBBox(), p = new DOMPoint(bb.x + bb.width / 2, bb.y + bb.height / 2);
      let bg = base0.slice();
      els.slice(0, ti).forEach(s => {
        if (!(s instanceof SVGGeometryElement) || s.closest('text')) return;
        const cs = getComputedStyle(s); if (cs.fill === 'none' || cs.display === 'none') return;
        if (!s.isPointInFill(p)) return;
        const c = rgb(cs.fill); bg = over(c, c[3] * parseFloat(cs.fillOpacity) * alpha(s), bg);
      });
      const tc = getComputedStyle(t), c = rgb(tc.fill), fg = over(c, c[3] * parseFloat(tc.fillOpacity) * alpha(t), bg);
      const L1 = lum(fg), L2 = lum(bg), r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      out.push({ svg: si, text: t.textContent.trim().slice(0, 20), ratio: Math.round(r * 100) / 100,
                 fg: fg.map(Math.round), bg: bg.map(Math.round), size: tc.fontSize, weight: tc.fontWeight });
    });
  });
  return out;
}"""
base, slugs = sys.argv[1].rstrip('/'), [a for a in sys.argv[2:] if not a.startswith('-')]
bad_all = 0
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900})
    for s in slugs:
        pg.goto(f'{base}/blog/posts/{s}.html', wait_until='load'); pg.wait_for_timeout(300)
        rows = pg.evaluate(JS); bad = [r for r in rows if r['ratio'] < 4.5]; bad_all += len(bad)
        print(f'{s}: 그림 {len({r["svg"] for r in rows})} | 글자 {len(rows)} | 최저 {min((r["ratio"] for r in rows), default=0)} | 미달 {len(bad)}')
        for r in bad: print('   미달', r)
        if '-v' in sys.argv[2:] or len(slugs) == 1:
            for r in sorted(rows, key=lambda r: r['ratio'])[:6]: print('   ', r['ratio'], r['text'], r['fg'], r['bg'])
    b.close()
print('미달 합계', bad_all); sys.exit(1 if bad_all else 0)

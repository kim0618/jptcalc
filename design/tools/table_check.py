"""본문 표 검사(2026-10-21): 블로그 글 전부 + 계산기(가이드 표 포함) 페이지의 모든 표 칸을 실제 크롬 390·1280에서 연다.
  쪼개짐: 칸 안 낱말(띄어쓰기 단위, 2글자 이상)이 두 줄에 걸쳐 그려짐 → 실패(글자 단위로 쪼개진 것. 숫자+단위 "1,200만원"도 한 낱말)
  분리: 숫자와 띄어 쓴 단위("1,200 만원", "30 %")가 다른 줄 → 실패
낱말은 칸 전체 글자(여러 태그에 걸친 것 포함)를 이어 붙여 찾는다(<br>·블록 경계는 낱말 경계). 줄은 글자 상자 가운데 높이가 10px 넘게 다르면 다른 줄. 넘쳐서 가로 스크롤되는 표도 그려진 대로 잰다.
사용: python3 design/tools/table_check.py [BASE=http://localhost:8765]   (LD_LIBRARY_PATH=$HOME/.local/emulib) 실패 있으면 종료코드 1"""
import os, sys, json, glob
from multiprocessing import Pool
TOOLS = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.abspath(os.path.join(TOOLS, '..', '..'))
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765'
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'adfit', 'doubleclick', 'kakao')
JS = r"""() => {
  const UNIT = /^(만원|억원|천원|원|%|세|살|개월|년|월|일|주|배|명|회|건|개|kg|cm|㎡|평|시간|분|초|점|kcal|원\/월|만원\/월)/;
  let cells = 0, tables = 0; const split = [], apart = [];
  // 줄 수: 글자 상자 가운데 높이를 줄 단위로 묶는다(10px 넘게 다르면 다른 줄. 위첨자·글꼴 차이로 몇 px 어긋나는 것은 같은 줄)
  const lines = (r) => { const ys = [...r.getClientRects()].filter(x => x.width > 0.5).map(x => x.top + x.height / 2).sort((a, b) => a - b); let n = ys.length ? 1 : 0; for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] > 10) n++; return n; };
  document.querySelectorAll('main table').forEach(t => {
    if (!t.getClientRects().length) return; tables++;
    t.querySelectorAll('th, td').forEach(c => {
      if (!c.getClientRects().length) return; cells++;
      // 글자를 이어 붙이되 <br>·블록 경계는 띄어쓰기로(낱말 경계)
      const nodes = [], w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let n, text = '';
      while ((n = w.nextNode())) {
        if (n.nodeType === 1) { if (n.tagName === 'BR' || /^(block|list-item|flex|grid)$/.test(getComputedStyle(n).display)) text += ' '; continue; }
        nodes.push([n, text.length]); text += n.nodeValue;
      }
      const at = (i) => { for (let k = nodes.length - 1; k >= 0; k--) if (nodes[k][1] <= i) return [nodes[k][0], i - nodes[k][1]]; };
      const range = (a, b) => { const r = document.createRange(), s = at(a), e = at(b - 1); r.setStart(s[0], s[1]); r.setEnd(e[0], e[1] + 1); return r; };
      const re = /\S+/g; let m; const words = [];
      while ((m = re.exec(text))) words.push([m.index, m.index + m[0].length, m[0]]);
      words.forEach((x, i) => {
        if (x[2].length >= 2 && lines(range(x[0], x[1])) > 1) split.push(x[2]);
        const y = words[i + 1];   // 숫자 뒤 띄어 쓴 단위
        if (y && /\d$/.test(x[2]) && UNIT.test(y[2]) && lines(range(x[0], y[1])) > 1) apart.push(x[2] + ' ' + y[2]);
      });
    });
  });
  return {tables, cells, split, apart};
}"""


def pages():
    out = sorted('/blog/posts/' + os.path.basename(f) for f in glob.glob(os.path.join(SITE, 'blog', 'posts', '*.html')))
    out += sorted('/' + os.path.relpath(os.path.dirname(f), SITE) + '/' for f in glob.glob(os.path.join(SITE, 'calc', '*', '*', 'index.html'))
                  if '/realestate/dti/' not in f and '/realestate/pyeong/' not in f)   # 11/9까지 main 판(옛 디자인)
    return out


def work(chunk):
    from playwright.sync_api import sync_playwright
    res = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in (390, 1280):
            c = b.new_context(viewport={'width': w, 'height': 900}, is_mobile=w == 390, has_touch=w == 390)
            c.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
            c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
            pg = c.new_page()
            for u in chunk:
                pg.goto(BASE + u, wait_until='load'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(200)
                r = pg.evaluate(JS); r['u'] = u; r['w'] = w; res.append(r)
            c.close()
        b.close()
    return res


if __name__ == '__main__':
    P = pages(); chunks = [P[i::5] for i in range(5)]
    with Pool(5) as pool: res = [r for part in pool.map(work, chunks) for r in part]
    json.dump(res, open(os.path.join(TOOLS, 'results', 'table_check.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    t = sum(r['tables'] for r in res); c = sum(r['cells'] for r in res)
    sp = [(r['u'], r['w'], r['split'][:6]) for r in res if r['split']]; ap = [(r['u'], r['w'], r['apart'][:6]) for r in res if r['apart']]
    print(f"페이지 {len(P)} × 2폭 | 표 {t} | 칸 {c} | 글자 단위 쪼개짐 {sum(len(r['split']) for r in res)}건({len(sp)}곳) | 숫자·단위 분리 {sum(len(r['apart']) for r in res)}건({len(ap)}곳)")
    for x in sp[:25]: print('  쪼개짐', x)
    for x in ap[:25]: print('  분리', x)
    sys.exit(1 if sp or ap else 0)

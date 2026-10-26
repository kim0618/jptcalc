"""바닥글 면책·안내 문구 대조(2026-10-21): main(~/jptcalc) HTML 바닥글의 원문이 작업본 화면 바닥글에 100% 나오는지.
정답 = main 페이지의 class="footer-copy"(또는 mega-footer-copy) 글자에서 앞의 "© 2026 제이퍼 계산기"와 구분 기호만 뗀 것.
화면 = 실제 크롬(390)으로 연 작업본 #ds-site-footer의 글자(site-shell.js가 저작권 줄 위에 원문을 넣는다). 공백과 이모지(☎ 등, 리뉴얼에서 승인된 제거)는 빼고 비교.
  누락: 원문 문장이 화면 바닥글(저작권 줄 포함)에 없음 → 실패. 단 저작권 줄과 같은 뜻의 문장(SAME, site-shell.js와 같은 규칙:
        "본 (계산) 결과/내용은 참고용입니다." 등)은 저작권 줄로 나온 것으로 본다(10/21: 면책 줄에서 중복을 뺐다)
  지어냄: main에 바닥글 문구가 없던 페이지인데 작업본에 면책 줄(.ds-footer-note)이 나옴 → 실패
참고: main 운영 화면에서는 footer-unified.js가 실행 중에 바닥글을 통째로 바꿔, 이 원문들은 허브 2개(auto·baby) 말고는 화면에 안 보였다.
사용: python3 design/tools/footer_note_check.py [BASE]   (기본 http://localhost:8765, LD_LIBRARY_PATH=$HOME/.local/emulib)"""
import os, re, sys, html, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from strip_emoji import SEQ, KEEP   # 리뉴얼은 이모지를 지웠다(☎ 등): 비교는 양쪽에서 이모지만 빼고
from multiprocessing import Pool
TOOLS = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.abspath(os.path.join(TOOLS, '..', '..'))
MAIN = os.path.expanduser('~/jptcalc')
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765'
SKIP = ('calc/realestate/dti/index.html', 'calc/realestate/pyeong/index.html')   # 11/9까지 main 판 그대로(옛 바닥글)
SAME = re.compile(r'^본 (계산 )?(결과|내용)[은는] 참고용(입니다|이며 정확한 (세액|내용)은 전문가에게 문의하세요)\.?$')
def sentences(t): return [x.strip() for x in re.sub(r'([.다요])\s+(?=\S)', '\\1\n', t).split('\n') if x.strip()]
PREFIX = re.compile(r'^©\s*2026\s*제이퍼\s*계산기\s*(?:\(JPT Calc\))?\s*[-.·]?\s*')


def main_note(rel):
    p = os.path.join(MAIN, rel)
    if not os.path.exists(p): return None
    m = re.search(r'class="(?:mega-)?footer-copy">(.*?)</p>', open(p, encoding='utf-8').read(), re.S)
    if not m: return ''
    t = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).strip()
    return PREFIX.sub('', t)


def pages():
    out = []
    for d, ds, fs in os.walk(SITE):
        ds[:] = [x for x in ds if x not in ('.git', 'node_modules', 'design', '__pycache__')]
        out += [os.path.relpath(os.path.join(d, f), SITE) for f in fs if f.endswith('.html') and not f.startswith('naver')]
    return sorted(p for p in out if p not in SKIP)


def work(chunk):
    from playwright.sync_api import sync_playwright
    res = []
    with sync_playwright() as p:
        b = p.chromium.launch(); c = b.new_context(viewport={'width': 390, 'height': 844})
        c.add_init_script("try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
        c.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in ('googlesyndication', 'googletagmanager', 'google-analytics', 'adfit', 'doubleclick', 'kakao', 'daumcdn')) else rt.continue_())
        pg = c.new_page()
        for rel, want in chunk:
            url = BASE + '/' + (rel[:-len('index.html')] if rel.endswith('index.html') else rel)
            pg.goto(url, wait_until='domcontentloaded', timeout=60000); pg.wait_for_selector('#ds-site-footer .ds-footer-copy', timeout=20000); pg.wait_for_timeout(150)
            got = pg.evaluate("() => { const f = document.getElementById('ds-site-footer'); const n = f && f.querySelector('.ds-footer-note'); return [f ? f.innerText : '', n ? n.innerText : null]; }")
            tr = None
            if (rel.startswith('blog/posts/') or (rel.startswith('calc/') and rel.count('/') == 3)):   # 계산기·블로그 글: 신뢰성 정보 카드(늦게 그려지는 검토 안내까지 기다린다)
                pg.wait_for_timeout(900)
                tr = pg.evaluate("() => { const c = document.querySelector('.ds-trust-unified'); if (!c) return null; const d = c.querySelector('.trust-block__disclaimer'); return {src: JSON.parse(c.getAttribute('data-notes-src') || '[]'), shown: d ? d.innerText : '', left: document.querySelectorAll('.review-footer, .update-note, .article-info').length}; }")
            res.append((rel, want, got[0], got[1], tr))
        b.close()
    return res


if __name__ == '__main__':
    jobs = [(rel, main_note(rel)) for rel in pages()]
    chunks = [jobs[i::4] for i in range(4)]
    with Pool(4) as pool: res = [r for part in pool.map(work, chunks) for r in part]
    sq = lambda t: re.sub(r'\s+', '', SEQ.sub(lambda m: m.group(0) if m.group(0) in KEEP else '', t or '').replace('\uFE0F', ''))
    miss, made, ok, none_main, new, same_n = [], [], 0, 0, 0, 0
    for rel, want, foot, note, tr in res:
        if want is None: new += 1; continue            # main에 없는 새 페이지(/recent/ 등)
        if want == '':
            none_main += 1
            if note: made.append((rel, note))
            continue
        lost = [x for x in sentences(want) if not SAME.match(x) and sq(x) not in sq(foot)]
        covered = sum(1 for x in sentences(want) if SAME.match(x))
        if not lost: ok += 1; same_n += covered
        else: miss.append((rel, ' / '.join(lost), foot[-160:]))
    print(f'페이지 {len(res)} | main 원문 있음 {ok + len(miss)} (화면에 나옴 {ok}, 누락 {len(miss)}) | main에 문구 없음 {none_main} (면책 줄 지어냄 {len(made)}) | main에 없는 페이지 {new}')
    kinds = sorted(set(w for _, w, _, _, _ in res if w))
    print(f'원문 종류 {len(kinds)} | 저작권 줄과 같은 뜻이라 면책 줄에서 뺀 문장 {same_n}')
    for r in miss[:20]: print('  누락', r[0], '|', r[1][:80], '| 화면:', r[2].replace('\n', ' ')[-90:])
    for r in made[:20]: print('  지어냄', r[0], '|', r[1][:80])
    # 신뢰성 정보 카드 검토 안내: 원문 문장마다 그대로 나오거나, 같은 의미 그룹(site-shell.js NOTE_GROUPS)의 문장이 1개 이상 나오면 통과
    G = [('info', re.compile(r'정보 제공 목적')), ('expert', re.compile(r'기관 또는 전문가|전문가에게 (확인|문의)'))]
    grp = lambda x: next((k for k, r in G if r.search(x)), '')
    t_pages, t_src, t_grouped, t_bad, t_missing = 0, 0, 0, [], []
    for rel, want, foot, note, tr in res:
        if (rel.startswith('blog/posts/') or (rel.startswith('calc/') and rel.count('/') == 3)):
            if tr is None: t_missing.append(rel); continue
            t_pages += 1; shown = sentences(tr['shown'].replace('검토 안내', '', 1)); sg = {grp(x) for x in shown}
            for x in tr['src']:
                t_src += 1
                if sq(x) in sq(tr['shown']): continue
                if grp(x) and grp(x) in sg: t_grouped += 1; continue
                t_bad.append((rel, x))
            if tr['left']: t_bad.append((rel, f'합치지 못한 상자 {tr["left"]}개'))
    print(f'신뢰성 정보 카드 {t_pages}페이지 | 원문 문장 {t_src} (같은 뜻이라 그룹 첫 문장으로 대신 {t_grouped}) | 누락 {len(t_bad)} | 카드 없음 {len(t_missing)}')
    for r in t_bad[:15]: print('  카드 누락', r[0], '|', r[1][:80])
    for r in t_missing[:10]: print('  카드 없음', r)
    json.dump([{'page': r[0], 'main': r[1], 'note': r[3]} for r in res], open(os.path.join(TOOLS, 'results', 'footer_note_check.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sys.exit(1 if miss or made or t_bad or t_missing else 0)

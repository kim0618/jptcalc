"""표지 검토 시트(검수용, 배포 제외): design/cover-review.html 한 장에 184편 16:9 표지 썸네일 + slug + 큰 숫자·설명 + 근거 문장.
표시: [수정] 이번에 문구를 고친 행(EDITED), [시기] 날짜·연도가 지나면 바뀌는 숫자(정책 금액·세율·한도·금리 등, 아래 규칙으로 자동 표시).
표지 이미지는 /assets/img/blog-thumb/(2026-10-20 정식 생성)를 본다.
사용: python3 -I design/tools/build_cover_review.py   → 8770 미리보기 서버에서 /design/cover-review.html"""
import os, csv, json, html, re
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
rows = list(csv.DictReader(open(os.path.join(SITE, 'design', 'blog-cover-text.csv'), encoding='utf-8')))
EDITED = {'salary-comparison-guide', 'suneung-dday-guide', 'jeonse-conversion-rate', 'jeonse-vs-wolse', 'exercise-calorie-burn-guide', 'cat-monthly-cost',
          'nontaxable-allowance-guide', 'property-tax-guide', 'salary-negotiation', 'youth-future-savings-guide', 'long-term-care-grade-application'}   # 2026-10-20 수정
# 시기를 타는 숫자: 연도가 붙었거나, 해마다 고시·개정되는 금액·율(정책 돈·세율·한도·금리·보험료율·지원금)
TIMELY = re.compile(r'20\d\d년|상한|한도|세율|금리|보조금|지원금|최저임금|요율|보험료|공제|수당|급여|과태료|감면|최우선변제|부모급여|첫만남|기준 중위|소득 기준|D-\d|D\+\d')
cover_dir = os.path.join(SITE, 'assets', 'img', 'blog-thumb')
cards, n_ed, n_tm, n_img = [], 0, 0, 0
for r in rows:
    s = r['slug']; ed = s in EDITED; tm = bool(TIMELY.search(r['evidence'] + r['desc'] + r['big']))
    has = os.path.exists(os.path.join(cover_dir, f'{s}-16x9.webp'))
    n_ed += ed; n_tm += tm; n_img += has
    tags = ('<span class="tag ed">수정</span>' if ed else '') + ('<span class="tag tm">시기</span>' if tm else '')
    img = f'<img src="/assets/img/blog-thumb/{s}-16x9.webp" alt="" loading="lazy" width="320" height="180">' if has else '<div class="noimg">표지 없음(최소 크기 넘침)</div>'
    cards.append(f'<article class="c{" is-ed" if ed else ""}{" is-tm" if tm else ""}">{img}<div class="b"><p class="s">{tags}<a href="/blog/posts/{s}.html" target="_blank">{html.escape(s)}</a> · {html.escape(r["카테고리"])}</p>'
                 f'<p class="t"><b>{html.escape(r["big"])}</b> {html.escape(r["desc"])}</p><p class="e">{html.escape(r["evidence"])}</p></div></article>')
doc = f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>표지 검토 시트</title>
<link rel="stylesheet" href="/assets/ds/tokens.css">
<link rel="stylesheet" href="/assets/vendor/pretendard/1.3.9/pretendard.css">
<style>
body {{ margin: 0; padding: var(--space-card) var(--space-page-x); background: var(--bg); color: var(--text); font-family: var(--font); }}
h1 {{ margin: 0 0 var(--space-2); font-size: var(--fs-title); color: var(--navy); }}
.lead {{ margin: 0 0 var(--space-4); font-size: var(--fs-meta); color: var(--text-sub); }}
.f {{ display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-card); }}
.f button {{ min-height: 36px; padding: 0 var(--space-3); border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--surface); font: inherit; font-size: var(--fs-meta); cursor: pointer; }}
.f button[aria-pressed="true"] {{ border-color: var(--primary); background: var(--primary-tint); color: var(--primary); }}
.g {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }}
.c {{ overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }}
.c.is-ed {{ box-shadow: 0 0 0 2px var(--primary); }}
.c img, .noimg {{ display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; }}
.noimg {{ display: grid; place-items: center; background: var(--bad-tint); color: var(--bad-text); font-size: var(--fs-meta); }}
.b {{ padding: var(--space-3); }}
.b p {{ margin: 0 0 var(--space-1); }}
.s {{ font-size: var(--fs-meta); color: var(--text-sub); }} .s a {{ color: var(--text); font-weight: 600; }}
.t {{ font-size: var(--fs-label); }} .t b {{ color: var(--primary); }}
.e {{ font-size: var(--fs-meta); line-height: 1.6; color: var(--text-sub); }}
.tag {{ display: inline-block; margin-right: var(--space-1); padding: 0 var(--space-1); border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; }}
.tag.ed {{ background: var(--primary-tint); color: var(--primary); }} .tag.tm {{ background: var(--warn-tint); color: var(--warn-text); }}
</style></head><body>
<h1>표지 검토 시트</h1>
<p class="lead">{len(rows)}편 · 표지 {n_img}장(16:9, /assets/img/blog-thumb) · 수정 {n_ed}행 · 시기를 타는 숫자 {n_tm}행.</p>
<div class="f"><button type="button" data-f="all" aria-pressed="true">전체</button><button type="button" data-f="is-ed" aria-pressed="false">수정한 행</button><button type="button" data-f="is-tm" aria-pressed="false">시기를 타는 숫자</button></div>
<div class="g">{"".join(cards)}</div>
<script>
document.querySelectorAll('.f button').forEach(function (b) {{ b.addEventListener('click', function () {{
  var f = b.getAttribute('data-f');
  document.querySelectorAll('.f button').forEach(function (x) {{ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }});
  document.querySelectorAll('.c').forEach(function (c) {{ c.hidden = f !== 'all' && !c.classList.contains(f); }});
}}); }});
</script>
</body></html>
'''
open(os.path.join(SITE, 'design', 'cover-review.html'), 'w', encoding='utf-8').write(doc)
print('검토 시트', len(rows), '편 | 표지', n_img, '| 수정', n_ed, '| 시기', n_tm)

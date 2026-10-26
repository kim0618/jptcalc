"""블로그 글 전/후 기록: 화면에 그려진 작성자·검토 안내 글자(.article-info, .review-footer), 본문 안 계산기 링크 수, 광고 칸 수, FAQ 문항 수.
사용: python3 design/tools/blog_record.py OUT.json [SLUG...]   (8765 서버, 없으면 전체. 원본 백업을 재려면 POSTS=/design/blog-source/posts)"""
import sys, os, json, glob
from playwright.sync_api import sync_playwright
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
out = sys.argv[1]; slugs = sys.argv[2:] or sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(SITE, 'blog/posts/*.html')))
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'daumcdn', 'doubleclick', 'jsdelivr')
JS = """() => {
  const t = s => { const e = document.querySelector(s); return e ? e.innerText.replace(/\\s+/g, ' ').trim() : ''; };
  // 본문 영역: 옛 글은 .post-wrap, 새 글은 .ds-post-body (새로 넣은 CTA 카드 .ds-post-cta와 머리·꼬리 제외)
  const body = document.querySelector('.ds-post-body') || document.querySelector('.post-wrap') || document.querySelector('body > .container');
  const inBody = [...(body ? body.querySelectorAll('a[href*="/calc/"]') : [])].filter(a => !a.closest('.ds-post-cta, .article-info, .ds-article-info, header, footer, .ds-crumbs'));
  return { info: t('.article-info'), review: t('.review-footer'),
    calc_links: inBody.length, calc_hrefs: inBody.map(a => a.getAttribute('href')),
    ads: document.querySelectorAll('ins.kakao_ad_area').length,
    faq: document.querySelectorAll('.faq-item').length,
    errors: window.__errs || [] }; }"""
res = json.load(open(out, encoding='utf-8')) if os.path.exists(out) else {}
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.add_init_script("window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message).slice(0,120)));try{localStorage.setItem('jpt_cookie_ok','1')}catch(e){}")
    pg = ctx.new_page(); pg.route('**/*', lambda rt: rt.abort() if any(k in rt.request.url for k in BLOCK) else rt.continue_())
    for s in slugs:
        pg.goto(f'http://localhost:8765{os.environ.get("POSTS", "/blog/posts")}/{s}.html', wait_until='load'); pg.wait_for_timeout(120)
        res[s] = pg.evaluate(JS)
    b.close()
json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(res), '편 기록')

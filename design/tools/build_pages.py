"""사이트 정보 페이지 5개(소개·문의하기·면책조항·개인정보처리방침·이용약관)를 새 틀(H1 헤더·ds 푸터·base.css)로 옮긴다.
원문은 한 글자도 바꾸지 않는다: 본문은 원본 .wrap 안을 그대로 쓰고, 꾸밈용 인라인 style(옛 색 hex)과 이모지 아이콘만 걷어낸다.
- head: 원본 그대로(인라인 <style>만 빼고 tokens.css·base.css 연결) → head_check 0
- 이모지 아이콘(소개 "제공 서비스" 카드) → 카테고리 라인 아이콘 + --c-* 틴트
- 표 → .ds-table-card, "← 돌아가기" 링크 → 화살표 아이콘 링크(글자 유지)
- footer-unified.js(옛 푸터 주입) → 정적 ds 푸터, site-shell.js
원본은 처음 실행 때 design/tools/orig/pages/에 보관하고 이후에는 그 보관본에서 다시 만든다(되돌리기: 보관본을 제자리로 복사).
사용: python3 -I design/tools/build_pages.py"""
import os, re, sys, shutil
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
sys.path.insert(0, T)
from convert_calc import CATS, I, div_end
from strip_emoji import strip as strip_emoji
from asset_version import stamp_html, stamp_sources   # 공용 CSS·JS 주소에 ?v=내용 해시(캐시 버전)
stamp_sources()
PAGES = ['about', 'contact', 'disclaimer', 'privacy', 'terms']
ORIGDIR = os.path.join(T, 'orig', 'pages'); os.makedirs(ORIGDIR, exist_ok=True)
CATMAP = [('부동산', 'realestate'), ('프리랜서', 'tax'), ('연금', 'pension-welfare'), ('생활', 'tools'), ('연봉', 'salary'), ('금융', 'finance'),
          ('건강', 'health'), ('날짜', 'date'), ('AI', 'ai'), ('반려동물', 'pet'), ('자동차', 'auto'), ('출산', 'baby')]
CATICON = {k: i for k, _, i in CATS}
# 푸터: 404(새 틀)와 같은 정적 푸터
F404 = open(os.path.join(SITE, '404.html'), encoding='utf-8').read()
FOOTER = re.search(r'<footer id="ds-site-footer".*?</footer>', F404, re.S).group(0)

def card_icon(m):
    name = re.search(r'<div class="name">(.*?)</div>', m.group(0), re.S).group(1)
    k = next((k for w, k in CATMAP if name.startswith(w)), None)
    ico = f'<span class="ds-cat-ico" style="--cat: var(--c-{k})">{I(CATICON[k])}</span>' if k else ''
    return re.sub(r'<div class="icon">.*?</div>', ico, m.group(0), count=1, flags=re.S)

for name in PAGES:
    src = os.path.join(SITE, f'{name}.html'); keep = os.path.join(ORIGDIR, f'{name}.html')
    if not os.path.exists(keep): shutil.copy(src, keep)
    s = open(keep, encoding='utf-8').read()
    assert 'site-shell.js' not in s, f'{name}: 보관본이 이미 새 틀'
    head = s[s.index('<head>') + 6:s.index('</head>')]
    head = re.sub(r'\s*<style>.*?</style>', '', head, flags=re.S).rstrip() + \
        '\n  <link rel="stylesheet" href="/assets/ds/tokens.css" />\n  <link rel="stylesheet" href="/assets/ds/base.css" />\n'
    w0 = s.index('<div class="wrap">'); w1 = div_end(s, w0)
    inner = s[w0 + len('<div class="wrap">'):w1 - len('</div>')]
    inner = re.sub(r'<p style="font-weight:700[^"]*">', '<p class="ds-doc-strong">', inner)   # 인라인으로 굵게 했던 줄은 클래스로(소개 운영자 이름)
    inner = re.sub(r'\s+style="[^"]*"', '', inner)                                   # 꾸밈 인라인 style(옛 색)만 제거
    inner = re.sub(r'<a href="/" class="back-link">(?:←|&larr;)\s*(.*?)</a>', lambda m: f'<a href="/" class="ds-doc-back">{I("arrow-left", "ds-i-sm")}{m.group(1)}</a>', inner)
    inner = re.sub(r'<div class="category-card">.*?</div>\s*</div>', card_icon, inner, flags=re.S)
    inner = re.sub(r'(<table\b.*?</table>)', r'<div class="ds-table-card">\1</div>', inner, flags=re.S)
    body = (f'<body data-cat="page">\n<header id="ds-site-header" class="ds-header"></header>\n\n'
            f'<main class="ds-container ds-doc">\n<article class="ds-doc-body">{inner}</article>\n</main>\n\n{FOOTER}\n'
            f'<script src="/assets/calc-registry.js"></script>\n<script src="/assets/ds/site-shell.js"></script>\n</body>\n</html>\n')
    pre = s[:s.index('<head>')]
    doc = pre + '<head>' + head + '</head>\n' + strip_emoji('<body>' + body[len('<body data-cat="page">'):])
    doc = doc.replace('</head>\n<body>', '</head>\n<body data-cat="page">', 1)
    open(src, 'w', encoding='utf-8').write(stamp_html(doc))
    print(name, '변환', len(s), '→', len(doc))

"""캐시 버전 표시(2026-10-20): 우리가 배포하는 공용 CSS·JS 주소에 ?v=파일 내용 해시 앞 8자리(sha256)를 붙인다.
파일 내용이 안 바뀌면 값도 그대로. 외부 주소(GA·애드센스·애드핏)와 파비콘·manifest·이미지는 건드리지 않는다.
- vendorize(html)(2026-10-26): 외부 CDN 라이브러리·웹폰트(Pretendard·flatpickr·html2canvas)를 /assets/vendor/{이름}/{버전}/ 로 바꾸고
  jsdelivr preconnect·dns-prefetch 줄을 지운다. stamp_html이 먼저 부르므로 생성기는 따로 할 일 없음.
  dti·pyeong(11/9까지 main 판)은 단독 실행에서 건너뛴다(?v=만).
- stamp_html(html): <link href="/assets/….css"> · <script src="/assets/….js">의 ?v= 를 지금 파일 내용으로 맞춘다(주소 말고는 한 글자도 안 바꿈)
- stamp_sources(): 공용 JS 안에서 실행 중에 부르는 주소(site-shell.js의 calc-registry.js·cookie-consent.js·메뉴 JSON, footer-unified.js의 cookie-consent.js, calc-result-tools.js의 html2canvas)를 먼저 맞춘다.
  이 파일들이 바뀌면 자기 해시도 바뀌므로 HTML보다 먼저 돌린다.
생성기(build_home·build_blog·build_pages·build_hub·convert_calc)는 쓰기 직전에 stamp_html을 거치고, scripts/inject-sibling.mjs는 같은 규칙을 JS로 따른다.
단독 실행: python3 -I design/tools/asset_version.py   → 소스 맞춘 뒤 사이트 HTML 전부(design/ 제외)에 적용, 바뀐 파일 수 출력
CSS·JS를 고친 뒤에는 생성기를 다시 돌리거나 이 스크립트를 돌려 ?v= 를 갱신한다."""
import os, re, hashlib, glob, json
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))

def ver(path):
    """/assets/… 주소 → 파일 내용 sha256 앞 8자리(파일이 없으면 None)"""
    f = os.path.join(SITE, path.split('?')[0].lstrip('/'))
    return hashlib.sha256(open(f, 'rb').read()).hexdigest()[:8] if os.path.isfile(f) else None

V = '/assets/vendor'
VENDOR = [   # (외부 주소, 로컬 주소). 버전 없는 주소는 2026-10-26 jsdelivr가 가리키던 버전(flatpickr 4.6.13, Pretendard 1.3.9)
    ('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css', f'{V}/pretendard/1.3.9/pretendard.css'),
    ('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css', f'{V}/pretendard/1.3.9/pretendard.css'),
    ('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css', f'{V}/flatpickr/4.6.13/flatpickr.min.css'),
    ('https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js', f'{V}/flatpickr/4.6.13/l10n/ko.js'),
    ('https://cdn.jsdelivr.net/npm/flatpickr', f'{V}/flatpickr/4.6.13/flatpickr.min.js'),
    ('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', f'{V}/html2canvas/1.4.1/html2canvas.min.js'),
]
VTAG = re.compile(r'<(?:link|script)\b[^>]*?\s(?:href|src)="(https://(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)/[^"]*)"[^>]*>')
HINT = re.compile(r'\n?[ \t]*<link rel="(?:preconnect|dns-prefetch)" href="https://cdn\.jsdelivr\.net"[^>]*>')
def vendorize(html):
    def rep(m):
        url = m.group(1)
        for ext, loc in VENDOR:
            if url == ext:
                return m.group(0).replace(f'"{ext}"', f'"{loc}"').replace(' crossorigin', '')
        return m.group(0)
    return HINT.sub('', VTAG.sub(rep, html))

TAG = re.compile(r'(<(?:link|script)\b[^>]*?\s(?:href|src)=")(/assets/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]{8})?(")')
def stamp_html(html, vendor=True):
    if vendor: html = vendorize(html)
    def rep(m):
        v = ver(m.group(2))
        return m.group(1) + m.group(2) + (f'?v={v}' if v else '') + m.group(3)
    return TAG.sub(rep, html)

LIT = re.compile(r"""(['"])(/assets/(?:cookie-consent|calc-registry|vendor/html2canvas/1\.4\.1/html2canvas\.min)\.js)(?:\?v=[0-9a-f]{8})?\1""")
DV = re.compile(r'var DS_DATA_V = \{[^}]*\};')
def stamp_sources():
    for rel in ('assets/footer-unified.js', 'assets/calc-result-tools.js', 'assets/ds/site-shell.js'):   # site-shell은 마지막(다른 파일 해시를 담으므로)
        f = os.path.join(SITE, rel)
        if not os.path.isfile(f): continue
        s = open(f, encoding='utf-8').read()
        n = LIT.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={ver(m.group(2))}{m.group(1)}", s)
        if DV.search(n):
            data = {k: ver(f'/assets/ds/{k}.json') or '' for k in ('situations', 'cat-menu')}
            n = DV.sub('var DS_DATA_V = ' + json.dumps(data, separators=(', ', ': ')) + ';', n)
        if n != s: open(f, 'w', encoding='utf-8').write(n)

def site_pages():
    return [p for p in glob.glob(os.path.join(SITE, '**', '*.html'), recursive=True)
            if not os.path.relpath(p, SITE).startswith(('design', 'node_modules', '.git', 'scripts'))]

if __name__ == '__main__':
    stamp_sources(); changed = 0
    for p in site_pages():
        s = open(p, encoding='utf-8').read()
        n = stamp_html(s, vendor=not re.search(r'calc/realestate/(dti|pyeong)/index\.html$', p))
        if n != s: open(p, 'w', encoding='utf-8').write(n); changed += 1
    print('?v= 갱신', changed, '파일 /', len(site_pages()))

"""내부 링크 검사(배포 전 깨진 링크 0 기준): 페이지들의 href·src 중 사이트 내부 주소를 로컬 서버에 요청해 200인지,
#앵커는 대상 페이지에 그 id가 있는지 확인. 스크립트가 만드는 링크도 보도록 HTML 원문과 인라인 JSON의 "path"/"url"까지 수집.
사용: python3 -I design/tools/link_check.py [--base http://localhost:8765] FILE...   (FILE은 작업본 기준 경로)"""
import sys, re, os, json, urllib.request, urllib.parse, html
args = sys.argv[1:]; base = 'http://localhost:8765'
if '--base' in args: i = args.index('--base'); base = args[i + 1]; del args[i:i + 2]
seen = {}; bad = []; anchors = {}
def fetch(u):
    if u not in seen:
        try:
            with urllib.request.urlopen(urllib.request.Request(base + u, method='GET'), timeout=10) as r: seen[u] = (r.status, r.read().decode('utf-8', 'ignore') if u.endswith(('/', '.html', '.svg')) else '')
        except urllib.error.HTTPError as e: seen[u] = (e.code, '')
        except Exception as e: seen[u] = (str(e)[:40], '')
    return seen[u]
n = 0
for f in args:
    s = open(f, encoding='utf-8').read()
    page = '/' + f[:-len('index.html')] if f.endswith('index.html') else '/' + f
    page = page.replace('//', '/')
    refs = re.findall(r'\b(?:href|src)="([^"]+)"', s)
    refs += re.findall(r'"(?:path|url|illust)":"(/[^"]*)"', s)                    # 인라인 JSON(홈 시트 등)
    refs += re.findall(r"(?:href|src)=\\?'(/[^'\\]+)", s)
    for r in refs:
        r = html.unescape(r)
        if re.match(r'^(https?:)?//|^(mailto|tel|javascript|data):|^#$|^\$\{|^\'\s*\+', r): continue
        if '${' in r or "' +" in r or '+' in r and '?' not in r and r.endswith('+'): continue
        u = urllib.parse.urljoin(page, r); p = urllib.parse.urlparse(u)
        if not p.path.startswith('/'): continue
        n += 1
        st, body = fetch(p.path)
        if st != 200: bad.append((f, r, st)); continue
        if p.fragment and not p.fragment.startswith('s='):
            if not re.search(r'\bid="' + re.escape(p.fragment) + '"', body): bad.append((f, r, '앵커 없음'))
for b in bad: print('깨짐', *b)
print('페이지', len(args), '| 내부 링크·자원', n, '| 고유 주소', len(seen), '| 깨진 것', len(bad))

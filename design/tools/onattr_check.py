"""정적 검사(2026-10-21): 전 페이지 HTML의 모든 on* 속성(onclick·oninput·onchange 등)을 JS 파서로 구문 검사한다.
속성 값은 HTML 파서로 꺼내고(엔티티 해제), node의 new Function으로 컴파일만 한다(실행하지 않음).
인라인 onclick에 JSON을 넣으면 큰따옴표가 속성을 끊어 "Unexpected end of input"이 난다(10/21 계산 버튼 58개 사고).
속성이 끊기면 남은 조각이 이상한 속성 이름(따옴표·괄호가 든 이름)으로 남으므로 그것도 실패로 센다.
사용: python3 -I design/tools/onattr_check.py [파일...]   (작업본 루트, 파일을 주면 그것만. 오류 0이면 종료코드 0)"""
import os, sys, json, re, subprocess
from html.parser import HTMLParser
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SKIP_DIRS = {'.git', 'node_modules', 'design', '__pycache__'}
EXTRA = ['design/hold']   # 11/9 이후 되돌릴 보관본도 같이 본다
BAD_NAME = re.compile(r'[^a-zA-Z0-9_:.\-@\[\]()#*]|^[\[\]()]')

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.items = []; self.bad = []
    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k.startswith('on') and len(k) > 2:
                self.items.append((self.getpos()[0], tag, k, v or ''))
            elif BAD_NAME.search(k) and not k.startswith(('x-', ':', '@')):
                self.bad.append((self.getpos()[0], tag, k))
    handle_startendtag = handle_starttag

def pages():
    out = []
    for base in ['.'] + EXTRA:
        for d, ds, fs in os.walk(os.path.join(ROOT, base)):
            rel = os.path.relpath(d, ROOT)
            if base == '.':
                ds[:] = [x for x in ds if x not in SKIP_DIRS]
            out += [os.path.join(rel, f) for f in fs if f.endswith('.html')]
    return sorted(set(os.path.normpath(p) for p in out))

items, bad = [], []
files = [os.path.relpath(os.path.abspath(x), ROOT) for x in sys.argv[1:]] or pages()
for f in files:
    p = P(); p.feed(open(os.path.join(ROOT, f), encoding='utf-8', errors='replace').read())
    items += [(f,) + it for it in p.items]; bad += [(f,) + b for b in p.bad]
codes = sorted(set(it[4] for it in items))
JS = r"""const codes = JSON.parse(require('fs').readFileSync(0, 'utf8')); const out = {};
for (const c of codes) { try { new Function('event', c); } catch (e) { out[c] = e.message; } }
process.stdout.write(JSON.stringify(out));"""
r = subprocess.run(['node', '-e', JS], input=json.dumps(codes), capture_output=True, text=True)
if r.returncode:
    print(r.stderr); sys.exit(2)
errs = json.loads(r.stdout)
fail = [(it, errs[it[4]]) for it in items if it[4] in errs]
print(f'페이지 {len(files)}개, on* 속성 {len(items)}개(서로 다른 코드 {len(codes)}종)')
for (f, line, tag, k, v), e in fail[:40]:
    print(f'  구문 오류 {f}:{line} <{tag} {k}="{v[:70]}"> {e}')
for f, line, tag, k in bad[:40]:
    print(f'  이상한 속성 이름 {f}:{line} <{tag} {k}>')
print(f'구문 오류 {len(fail)}건, 이상한 속성 이름 {len(bad)}건')
sys.exit(1 if fail or bad else 0)

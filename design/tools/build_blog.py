"""블로그(D1 목록·D2 글·D3 데스크톱)와 404(E1) 변환. 원고는 design/blog-source/(posts/·index.html, 새 글도 여기에 옛 틀로 쓴다), 404 원본은 design/tools/orig/404.html (변환은 늘 원고에서 시작).
글: 본문 글·링크·광고 칸·FAQ 문항은 그대로, 바깥 틀만 교체. head는 원본 그대로(인라인 <style>·옛 CSS 링크만 빼고 새 CSS 연결).
작성자·검토 안내는 원본 스크립트를 node로 실행해 얻은 HTML(results/blog_info.json, blog_static_info.mjs)을 정적으로 넣는다.
사용: node design/tools/blog_static_info.mjs design/tools/results/blog_info.json design/blog-source/posts/*.html
      python3 -I design/tools/build_blog.py"""
import json, re, os, html, subprocess, sys, glob, collections
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
sys.path.insert(0, T)
from convert_calc import CATS, I, div_end
from strip_emoji import strip as strip_emoji
from asset_version import stamp_html, stamp_sources   # 공용 CSS·JS 주소에 ?v=내용 해시(캐시 버전)
stamp_sources()
O = os.path.join(T, 'orig'); SRC = os.path.join(SITE, 'design', 'blog-source')   # 블로그 원고
INFO = json.load(open(os.path.join(T, 'results', 'blog_info.json'), encoding='utf-8'))
REG = json.load(open(os.path.join(T, 'registry.json'), encoding='utf-8'))
CATNAME = {k: n for k, n, _ in CATS}; CATICON = {k: i for k, _, i in CATS}
# 옛 블로그 카테고리 이름 → slug (목록 필터·BreadcrumbList ?cat= 호환)
OLD = {'부동산': 'realestate', '연봉': 'salary', '생활·도구': 'tools', '세금': 'tax', '연금·복지': 'pension-welfare', '금융': 'finance',
       '날짜·D-day': 'date', '건강': 'health', 'AI·테크': 'ai', '반려동물': 'pet', '자동차': 'auto', '출산·육아': 'baby'}
def tx(h): return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()
def esc(t): return html.escape(t, quote=True)
def git(p): return subprocess.run(['git', '-C', SITE, 'show', f'a74cc04:{p}'], capture_output=True, text=True).stdout
DESC = {}
for k, _, _ in CATS:
    for slug, d in re.findall(r'<a class="calc-hub-card" href="/calc/' + k + r'/([a-z0-9-]+)/">.*?<div class="calc-hub-desc">(.*?)</div>', git(f'calc/{k}/index.html'), re.S):
        DESC[f'{k}/{slug}'] = tx(d)
# a74cc04 이후 계산기 기능이 바뀐 곳만 덮어쓴다(2026-10-29 내신: 5등급제 추가)
DESC['tools/naesin-grade'] = '석차와 수강자 수로 내신 등급(5등급제·9등급제)을 환산하고, 과목별 등급·학점으로 전과목 평균 내신등급(가중평균)까지 계산합니다.'

def new_head(s, extra=''):
    h = s[s.index('<head>') + 6:s.index('</head>')]
    h = re.sub(r'\s*<style>.*?</style>', '', h, flags=re.S)
    h = re.sub(r'\s*<link rel="stylesheet" href="(?:\.\./)*/?assets/(?!ds/)[^"]+\.css"\s*/?>', '', h)
    return h.rstrip() + '\n  <link rel="stylesheet" href="/assets/ds/tokens.css" />\n  <link rel="stylesheet" href="/assets/ds/base.css" />\n' + extra

HEADER = '''<header id="ds-site-header" class="ds-header">
  <div class="ds-container"><div class="ds-header-inner">
    <a class="ds-logo" href="/"><span class="ds-logo-text">제이퍼계산기</span></a>
    <nav class="ds-header-nav" aria-label="주 메뉴"><a href="/#situations">상황별</a><a href="/#categories">카테고리</a><a href="/blog/" aria-current="page">블로그</a></nav>
  </div></div>
</header>'''
def footer(copy):
    return f'''<footer id="ds-site-footer" class="site-footer ds-footer">
  <div class="ds-container">
    <div class="ds-footer-top">
      <ul class="ds-footer-cats" aria-label="계산기 카테고리">{"".join(f'<li><a href="/calc/{k}/">{n}</a></li>' for k, n, _ in CATS)}</ul>
      <div class="ds-footer-links footer-links">
        <a href="/">홈</a><a href="/about.html">소개</a><a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a><a href="/disclaimer.html">면책조항</a>
      </div>
    </div>
    <p class="ds-footer-copy footer-copy">{copy}</p>
  </div>
</footer>'''
# 원본 바닥글 문구. 원본에 없으면 홈 문구(10/21: site-shell이 원문을 저작권 줄 위에 보이므로, 원문이 없던 페이지에 지어낸 문구가 나오지 않게)
def orig_copy(s, default='&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 세액은 전문가에게 문의하세요.'):
    m = re.search(r'class="footer-copy">(.*?)</p>', s, re.S); return m.group(1).strip() if m else default

# ── 본문 인라인 스타일 → 토큰 클래스 ──
SUB = {'#6b7280', '#9ca3af'}; PLAIN = {'#374151', '#111827', '#4b5563', '#1f2937'}
RED = {'#ef4444', '#dc2626', '#991b1b', '#b91c1c'}; GREEN = {'#10b981', '#059669', '#065f46', '#064e3b', '#16a34a'}
def restyle(tag, st):
    keep, cls = [], []
    for d in st.split(';'):
        if ':' not in d: continue
        k, v = [x.strip() for x in d.split(':', 1)]; vl = v.lower().replace('!important', '').strip()
        if k == 'color':
            if tag == 'a' or vl in PLAIN: continue
            cls.append('ds-t-sub' if vl in SUB else 'ds-t-bad' if vl in RED else 'ds-t-ok' if vl in GREEN else 'ds-t-accent'); continue
        if k in ('background', 'background-color'):
            cls.append('ds-bg-ok' if '#f0fdf4' in vl else 'ds-bg-warn' if any(x in vl for x in ('#fffbeb', '#fef3c7', '245,158,11')) else
                       'ds-bg-brand' if any(x in vl for x in ('#f5f3ff', '99,102,241')) else 'ds-bg-sub'); continue
        if k.startswith('border') and k != 'border-radius':
            m = re.match(r'(\d+px)\s+(solid|dashed)', vl)
            if m: keep.append(f'{k}: {m.group(1)} {m.group(2)} var(--line)')
            continue
        if k == 'font-family': continue
        if k == 'font-size':
            px = re.match(r'(\d+(?:\.\d+)?)px', vl)
            if px:
                n = float(px.group(1)); v = 'var(--fs-meta)' if n <= 13 else 'var(--fs-label)' if n <= 14.5 else 'var(--fs-body)' if n <= 17 else 'var(--fs-section)'
        if k == 'border-radius' and re.match(r'\d+px$', vl): v = 'var(--radius-sm)' if int(vl[:-2]) <= 8 else 'var(--radius-md)'
        keep.append(f'{k}: {v}')
    return keep, cls
def restyle_all(h):
    def fix(m):
        tag, attrs = m.group(1), m.group(2)
        st = re.search(r'\sstyle="([^"]*)"', attrs)
        if not st or tag == 'ins': return m.group(0)
        keep, cls = restyle(tag, st.group(1))
        attrs = attrs.replace(st.group(0), (f' style="{"; ".join(keep)}"' if keep else ''))
        if cls:
            if re.search(r'\sclass="', attrs): attrs = re.sub(r'\sclass="([^"]*)"', lambda c: f' class="{c.group(1)} {" ".join(cls)}"', attrs, 1)
            else: attrs = f' class="{" ".join(cls)}"' + attrs
        return f'<{tag}{attrs}>'
    return re.sub(r'<([a-z][a-z0-9]*)(\s[^>]*)>', fix, h)

# ── 본문 SVG 그림의 옛 색 → 토큰(2026-10-19 결정 ⑥). 초록계=ok, 주황계=warn, 빨강계=bad, 보라·옛 카테고리 메인색=primary, 그 외=가장 가까운 중립색
SVG_TOKEN = {
    # 초록계
    '#10B981': 'ok', '#059669': 'ok', '#065F46': 'ok-text', '#84CC16': 'ok', '#4D7C0F': 'ok-text', '#D1FAE5': 'ok-tint',
    # 주황계(노랑 포함)
    '#F59E0B': 'warn', '#F97316': 'warn', '#D97706': 'warn', '#FB923C': 'warn', '#92400E': 'warn-text', '#9A3412': 'warn-text',
    '#FDBA74': 'warn-tint', '#FED7AA': 'warn-tint', '#FDE68A': 'warn-tint', '#FFF7ED': 'warn-tint',
    # 빨강계
    '#EF4444': 'bad', '#DC2626': 'bad', '#991B1B': 'bad-text', '#7F1D1D': 'bad-text', '#FCA5A5': 'bad-tint',
    # 보라·옛 메인색(파랑·하늘·청록·분홍 카테고리색)
    '#6366F1': 'primary', '#8B5CF6': 'primary', '#7C3AED': 'primary', '#3B82F6': 'primary', '#0EA5E9': 'primary', '#0284C7': 'primary',
    '#38BDF8': 'primary', '#14B8A6': 'primary', '#0F766E': 'primary', '#F472B6': 'primary', '#9D174D': 'primary',
    '#0C4A6E': 'navy', '#1E40AF': 'navy', '#7DD3FC': 'primary-tint', '#BAE6FD': 'primary-tint', '#F0F9FF': 'primary-tint', '#FDF2F8': 'primary-tint',
    # 중립
    '#111827': 'text', '#374151': 'text', '#6B7280': 'text-sub', '#9CA3AF': 'text-muted', '#94A3B8': 'text-muted',
    '#D1D5DB': 'line', '#E5E7EB': 'line', '#F9FAFB': 'bg', '#FFF': 'surface', '#FFFFFF': 'surface'}
NEUTRAL = [('text', 0x11), ('text-sub', 0x6B), ('text-muted', 0x9C), ('line', 0xD5), ('bg', 0xF9), ('surface', 0xFF)]
SVG_UNKNOWN = collections.Counter(); SVG_COLLIDE = []
SOLID = set() if os.environ.get('SVG_NO_REMAP') else {'ok', 'warn', 'bad', 'primary', 'ok-text', 'warn-text', 'bad-text', 'navy'}   # SVG_NO_REMAP=1: 비교용(충돌 보정 끔)
FAMILY = {'ok': 'ok', 'ok-text': 'ok', 'ok-tint': 'ok', 'warn': 'warn', 'warn-text': 'warn', 'warn-tint': 'warn',
          'bad': 'bad', 'bad-text': 'bad', 'bad-tint': 'bad', 'primary': 'primary', 'primary-tint': 'primary', 'navy': 'primary'}
def _hsl(hx):
    import colorsys
    hx = hx if len(hx) == 7 else '#' + ''.join(c * 2 for c in hx[1:])
    h, l, s_ = colorsys.rgb_to_hls(*(int(hx[k:k + 2], 16) / 255 for k in (1, 3, 5)))
    return h * 360, l
GREENS = {'#10B981', '#059669', '#065F46', '#84CC16', '#4D7C0F', '#D1FAE5'}   # 라임·초록은 한 계열(--ok)로 본다(2026-10-19 결정)
def _same_hue(hs):
    if all(x in GREENS for x in hs): return True
    hues = [_hsl(x)[0] for x in hs]
    return max(min(abs(a - b), 360 - abs(a - b)) for a in hues for b in hues) <= 25
# 농도 단계 그림의 글자 대비(2026-10-19 결정): 바탕 opacity 0.6 미만 단계 위 흰 글자는 계열 -text(primary는 navy)로.
# -text 토큰은 흰 바탕에서도 약 5:1이라 옅은 단계 위에서 4.5에 못 미치면 --text로 내린다. 그 밖 글자도 4.5 미달이면
# 상태색 → -text, text-muted → text-sub, 그래도 미달이면 --text 순으로 고친다. 실제 렌더 대비는 svg_contrast.py로 잰다.
TOKHEX = dict(re.findall(r'--([a-z-]+):\s*(#[0-9A-Fa-f]{6})', open(os.path.join(SITE, 'assets', 'ds', 'tokens.css'), encoding='utf-8').read().split('}')[0]))
FAMTEXT = {'ok': 'ok-text', 'warn': 'warn-text', 'bad': 'bad-text', 'primary': 'navy'}
def _rgb(hx): return [int(hx[k:k + 2], 16) for k in (1, 3, 5)]
def _ratio(a, b):
    def L(c): return sum(w * ((v / 255) / 12.92 if v / 255 <= 0.03928 else ((v / 255 + 0.055) / 1.055) ** 2.4) for w, v in zip((0.2126, 0.7152, 0.0722), c))
    x, y = L(a), L(b); return (max(x, y) + 0.05) / (min(x, y) + 0.05)
SVG_TEXTFIX = []
def text_contrast(svg, base, is_bg, slug, remap, ladder):
    def num(t, a, d=0.0):
        m = re.search(rf'\s{a}="([\d.-]+)"', t); return float(m.group(1)) if m else d
    shapes, out, i = [], [], 0
    for m in re.finditer(r'<(rect|circle|ellipse|text)\b[^>]*>', svg):
        t = m.group(0); f = re.search(r'\sfill="(#[0-9A-Fa-f]{3,6})"', t)
        if m.group(1) != 'text':
            if not f: continue
            k = f.group(1).upper(); tk = remap.get(k) or base.get(k) or SVG_TOKEN.get(k) or 'surface'
            op = (1 if is_bg(t) else ladder.get(k, 1)) * num(t, 'opacity', 1) * num(t, 'fill-opacity', 1)
            if m.group(1) == 'rect': box = (num(t, 'x'), num(t, 'y'), num(t, 'x') + num(t, 'width'), num(t, 'y') + num(t, 'height'))
            else:
                rx = num(t, 'r') or num(t, 'rx'); ry = num(t, 'r') or num(t, 'ry'); box = (num(t, 'cx') - rx, num(t, 'cy') - ry, num(t, 'cx') + rx, num(t, 'cy') + ry)
            shapes.append((box, tk, op, FAMILY.get(tk)))
            continue
        if not f: continue
        fs = num(t, 'font-size', 12); x, y = num(t, 'x'), num(t, 'y') - fs * 0.35
        anc = re.search(r'text-anchor="(\w+)"', t); x += {'middle': 0, 'end': -4}.get(anc.group(1) if anc else '', 4)
        bg, top = _rgb(TOKHEX['surface']), None
        for (x0, y0, x1, y1), tk, op, fam in shapes:
            if x0 <= x <= x1 and y0 <= y <= y1 and tk in TOKHEX:
                bg = [c * op + b * (1 - op) for c, b in zip(_rgb(TOKHEX[tk]), bg)]; top = (tk, op, fam)
        k = f.group(1).upper(); cur = remap.get(k) or SVG_TOKEN.get(k) or tok_plain(k)
        cand = []
        if cur == 'surface' and top and top[1] < 0.6 and top[2] in FAMTEXT: cand = [FAMTEXT[top[2]], 'text']
        elif cur in TOKHEX and _ratio(_rgb(TOKHEX[cur]), bg) < 4.5:
            cand = [c for c in ({'ok': 'ok-text', 'warn': 'warn-text', 'bad': 'bad-text', 'text-muted': 'text-sub', 'primary': 'navy'}.get(cur), 'text') if c]
        pick = next((c for c in cand if _ratio(_rgb(TOKHEX[c]), bg) >= 4.5), None)
        if pick:
            out.append((m.start(), m.end(), t.replace(f.group(0), f' fill="tok:{pick}"', 1))); SVG_TEXTFIX.append((slug, cur, pick, round(_ratio(_rgb(TOKHEX[pick]), bg), 2)))
        elif cand: SVG_TEXTFIX.append((slug, cur, '미달 유지', round(_ratio(_rgb(TOKHEX[cur]), bg), 2)))
    for a, b, t in reversed(out): svg = svg[:a] + t + svg[b:]
    return svg
def tok_plain(k):
    full = k if len(k) == 7 else '#' + ''.join(c * 2 for c in k[1:])
    lum = sum(int(full[i:i + 2], 16) for i in (1, 3, 5)) / 3
    return min(NEUTRAL, key=lambda x: abs(x[1] - lum))[0]
def svg_tokens(h, cat='', slug=''):
    def tok(hexv):
        k = hexv.upper()
        if k in local[0]: return local[0][k]
        if k in SVG_TOKEN: return SVG_TOKEN[k]
        full = k if len(k) == 7 else '#' + ''.join(c * 2 for c in k[1:])
        lum = sum(int(full[i:i + 2], 16) for i in (1, 3, 5)) / 3
        SVG_UNKNOWN[k] += 1
        return min(NEUTRAL, key=lambda x: abs(x[1] - lum))[0]
    def tag(m):
        t = m.group(0); props = []; shape = re.match(r'<(rect|circle|ellipse|path|line|polyline|polygon)\b', t) and not local[2](t)
        def take(a):
            if a.group(2).startswith('tok:'): props.append(f'{a.group(1)}: var(--{a.group(2)[4:]})'); return ''
            k = a.group(2).upper(); props.append(f'{a.group(1)}: var(--{tok(k)})')
            if shape and k in local[1]: props.append(f'{a.group(1)}-opacity: {local[1][k]}')
            return ''
        t = re.sub(r'\s(fill|stroke)="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|tok:[a-z-]+)"', take, t)
        if not props: return t
        st = re.search(r'\sstyle="([^"]*)"', t)
        if st: return t.replace(st.group(0), f' style="{"; ".join(props)}; {st.group(1)}"', 1)
        return re.sub(r'(\s*/?>)$', lambda e: f' style="{"; ".join(props)}"' + e.group(1), t, count=1)
    def one(sv):
        # 같은 그림 안 도형끼리(글자는 같은 hex 도형을 따라감) 서로 다른 원래 색이 같은 계열 토큰으로 모일 때:
        #  같은 hue(농도 차이) → 계열의 진한 토큰 하나 + opacity 단계(옅은 것 0.25 ~ 진한 것 1 균등)
        #  다른 hue → 두 번째부터 navy → c-{카테고리} → text-sub 중 안 쓴 것. 중립(글자·선)은 그대로
        svg = sv.group(0)
        vb = re.search(r'viewBox="[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"', svg); vw, vh = (float(vb.group(1)), float(vb.group(2))) if vb else (0, 0)
        def is_bg(t):   # 그림 폭 90%·높이 50% 이상 사각형 = 배경(구분 요소 아님). 가로 진행선 같은 얇은 막대는 제외
            w = re.search(r'\swidth="([\d.]+)"', t); hh = re.search(r'\sheight="([\d.]+)"', t)
            return bool(t.startswith('<rect') and vw and w and hh and float(w.group(1)) >= vw * 0.9 and float(hh.group(1)) >= vh * 0.5)
        shapes = [t for t in re.findall(r'<(?:rect|circle|ellipse|path|line|polyline|polygon)\b[^>]*>', svg) if not is_bg(t)]
        order = list(dict.fromkeys(x.upper() for t in shapes for x in re.findall(r'\s(?:fill|stroke)="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"', t)))
        local[0], local[1] = {}, {}
        base = {x: SVG_TOKEN.get(x) or tok(x) for x in order}; used = set(base.values())
        fam = collections.defaultdict(list)
        for x in order:
            if base[x] in FAMILY: fam[FAMILY[base[x]]].append(x)
        for f, hs in fam.items():
            toks = {base[x] for x in hs}
            if len(hs) < 2 or (len(toks) == len(hs) and not any(t in SOLID for t in toks) and False): continue
            if len({base[x] for x in hs}) == len(hs): continue          # 서로 다른 토큰으로 이미 구분됨
            if not SOLID: continue
            if _same_hue(hs):
                ladder = sorted(hs, key=lambda x: -_hsl(x)[1])          # 밝은 것부터
                n = len(ladder)
                for k, x in enumerate(ladder):
                    local[0][x] = f; local[1][x] = round(0.25 + 0.75 * k / (n - 1), 2)
                SVG_COLLIDE.append((slug, 'opacity', f, ladder))
            else:
                seen = {}
                for x in hs:
                    t = base[x]
                    if t in seen and seen[t] != x:
                        alt = next((c for c in ('navy', f'c-{cat}', 'text-sub') if c not in used), 'text-sub'); local[0][x] = alt; used.add(alt)
                        SVG_COLLIDE.append((slug, x, t, alt))
                    else: seen.setdefault(t, x)
        local[2] = is_bg
        if local[1] and not os.environ.get('SVG_NO_TEXTFIX'): svg = text_contrast(svg, base, is_bg, slug, local[0], local[1])
        out = re.sub(r'<[a-zA-Z][^<>]*>', tag, svg)
        local[0], local[1] = {}, {}
        return out
    local = [{}, {}, lambda t: False]
    return re.sub(r'<svg\b.*?</svg>', one, h, flags=re.S)

def faq_details(h):
    out, i, n = '', 0, 0
    while True:
        j = h.find('<div class="faq-item"', i)
        if j < 0: return out + h[i:], n
        e = div_end(h, j); blk = h[j:e]
        q = re.search(r'<(div|h3|p) class="faq-q">(.*?)</\1>', blk, re.S); a = re.search(r'<(p|div) class="faq-a">(.*?)</\1>', blk, re.S)
        if not (q and a):   # 질문이 <strong>/<h3>, 답이 그 뒤 나머지인 형식
            q = re.search(r'<(strong|h3|h4|b)>(.*?)</\1>', blk, re.S)
            if q:
                rest = blk[q.end():blk.rfind('</div>')].strip(); a = re.match(r'(x)?(.*)', rest, re.S)
        if q and a:
            n += 1
            blk = (f'<details class="faq-item"><summary><h3 class="faq-q">{q.group(2).strip()}</h3>{I("chevron-down", "ds-faq-chev")}</summary>\n'
                   f'      <div class="faq-a">{a.group(2).strip()}</div>\n    </details>')
        out += h[i:j] + blk; i = e

def calc_info(url):
    m = re.match(r'(?:https?://www\.jptcalc\.kr)?(?:\.\./\.\.)?/calc/([a-z-]+)/(?:([a-z0-9-]+)/)?', url or '')
    return (m.group(1), m.group(2)) if m else (None, None)   # 허브를 가리키면 (카테고리, None)
COUNT = {k: sum(1 for x in REG if x.startswith(k + '/')) for k, _, _ in CATS}
def calc_href(c, s): return f'/calc/{c}/{s}/' if s else f'/calc/{c}/'

def cta_card(name, url):
    c, s = calc_info(url); desc = DESC.get(f'{c}/{s}', '') if s else f'{CATNAME[c]} 계산기 {COUNT[c]}개'
    return (f'\n    <a class="ds-post-cta" href="{calc_href(c, s)}" style="--cat: var(--c-{c})"><span class="ds-icon-tile">{I(CATICON[c])}</span>'
            f'<span class="ds-post-cta-body"><b>{esc(name)}</b><span>{esc(desc)}</span></span><span class="ds-post-cta-go">계산하기 {I("arrow-right", "ds-i-sm")}</span></a>\n')

SITS = json.load(open(os.path.join(SITE, 'design', 'situations.json'), encoding='utf-8'))['situations']
# 표지(D4, build_blog_covers.py가 만든 /assets/img/blog-thumb/{slug}-16x9·-16x9-sm·-3x1.webp). 세 파일이 다 있는 글만 표지, 없으면 기존 썸네일
import csv
COVERTXT = {r['slug']: r for r in csv.DictReader(open(os.path.join(SITE, 'design', 'blog-cover-text.csv'), encoding='utf-8'))}
def has_cover(slug): return all(os.path.exists(os.path.join(SITE, 'assets', 'img', 'blog-thumb', f'{slug}-{k}.webp')) for k in ('16x9', '16x9-sm', '3x1', '1x1'))
def cover_alt(slug): r = COVERTXT.get(slug); return esc(f"{r['big']} {r['desc']}") if r else ''
def thumb_of(cat, rc_url):
    c, sl = calc_info(rc_url)
    if sl:
        for x in SITS:
            if f'{c}/{sl}' in x['calcs']: return f'sit-{x["id"]}', x['color'].replace('--c-', '')
    return cat, cat
posts = {}
for p in sorted(glob.glob(os.path.join(SRC, 'posts', '*.html'))):
    slug = os.path.basename(p)[:-5]; s = open(p, encoding='utf-8').read(); cfg = INFO[slug]['cfg']
    cat = cfg['category']
    b0 = s.index('</header>') + len('</header>')
    w = re.search(r'<(div|main) class="(post-wrap|container)">', s[b0:]); w0 = b0 + w.start()
    w1 = div_end(s, w0) if w.group(1) == 'div' else s.index('</main>', w0) + len('</main>')
    inner = s[s.index('>', w0) + 1:w1 - len(f'</{w.group(1)}>')]
    after = s[w1:]
    lead_out = re.sub(r'<footer.*?</footer>|<script.*?</script>|\s', '', after, flags=re.S)
    assert lead_out == '</body></html>', (slug, lead_out[:200])
    tag = re.search(r'<span class="post-tag[^"]*">(.*?)</span>', inner, re.S)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', inner, re.S)
    meta = re.search(r'<(div|p) class="post-meta">(.*?)</\1>', inner, re.S)
    # 원본 메타 글자를 조각 그대로(날짜·읽는 시간·작성자 등), 작성자가 없으면 설정값 작성자를 날짜 뒤에
    parts = [tx(x) for x in re.findall(r'<span[^>]*>(.*?)</span>', meta.group(2), re.S)] or [x for x in tx(meta.group(2)).split('·')]
    parts = [re.sub(r'^[^\w(]+', '', x).strip() for x in parts]; parts = [x for x in parts if x and x != '·']
    date = re.search(r'\d{4}\.\d{2}\.\d{2}', meta.group(2)).group(0)
    if cfg.get('author') and not any(cfg['author'] in x for x in parts): parts.insert(1, cfg['author'])
    rd = next((x for x in parts if '분' in x), '')
    for m in (tag, h1, meta): inner = inner.replace(m.group(0), '', 1)
    pb = inner.find('<div class="post-body">')
    if pb >= 0:
        pe = div_end(inner, pb); inner = inner[:pb] + inner[pb + len('<div class="post-body">'):pe - len('</div>')] + inner[pe:]
    inner = svg_tokens(inner, cat, slug)
    inner = restyle_all(inner)
    # 감싸지 않은 표는 가로 스크롤 상자로(원본은 글별 CSS가 맡던 일)
    def wrap_tables(h):
        out, i = '', 0
        for m in re.finditer(r'<table\b', h):
            if m.start() < i: continue
            j = h.index('</table>', m.start()) + len('</table>')
            before = h[:m.start()]
            inside = before.rfind('<div class="table-wrap') > before.rfind('</div>') or re.search(r'<div class="table-wrap[^"]*"[^>]*>\s*$', before)
            out += h[i:m.start()] + (h[m.start():j] if inside else '<div class="table-wrap">' + h[m.start():j] + '</div>'); i = j
        return out + h[i:]
    inner = wrap_tables(inner)
    inner, nfaq = faq_details(inner)
    inner = re.sub(r'<div class="adfit-slot"', '<div class="adfit-slot ds-ad"', inner)
    # 목차: h2에 id
    toc = []
    def hid(m):
        toc.append((f'sec-{len(toc) + 1}', tx(m.group(2)))); return f'<h2{m.group(1)} id="sec-{len(toc)}">{m.group(2)}</h2>'
    inner = re.sub(r'<h2([^>]*)>(.*?)</h2>', hid, inner, flags=re.S)
    toc_html = (f'\n    <details class="ds-post-toc"><summary>목차 ({len(toc)}){I("chevron-down", "ds-faq-chev")}</summary><ol>' +
                ''.join(f'<li><a href="#{i}">{esc(t)}</a></li>' for i, t in toc) + '</ol></details>\n') if len(toc) >= 2 else ''
    # 첫 문단 뒤: 관련 계산기 CTA(relatedCalc) + 목차
    rc = cfg['relatedCalc']; fp = inner.find('</p>')
    inner = inner[:fp + 4] + cta_card(rc['name'], rc['url']) + toc_html + inner[fp + 4:]
    # 검토 안내: 원본처럼 CTA 상자 뒤(없으면 본문 끝)
    rv = INFO[slug]['review']
    if rv:
        cb = inner.find('<div class="cta-box"')
        if cb >= 0: ce = div_end(inner, cb); inner = inner[:ce] + '\n    ' + rv + inner[ce:]
        else: inner = inner.rstrip() + '\n    ' + rv + '\n'
    scripts = '\n'.join(x for x in re.findall(r'<script>.*?</script>', after, re.S) if 'ARTICLE_INFO_CONFIG' in x)
    body = f'''<body data-cat="{cat}" style="--cat: var(--c-{cat})">
{HEADER}

<main class="ds-post ds-container">
  <article>
    <div class="breadcrumb ds-crumbs"><a href="/">홈</a> &rsaquo; <a href="/blog/">블로그</a> &rsaquo; <a href="/blog/?cat={esc(CATNAME[cat])}">{CATNAME[cat]}</a></div>
    <div class="ds-post-meta"><span class="ds-post-chip">{CATNAME[cat]}</span>{"".join(f'<span>{esc(x)}</span>' for x in parts)}</div>
    <h1 class="ds-post-title">{h1.group(1).strip()}</h1>
    {(f'<picture><source media="(min-width: 1024px)" srcset="/assets/img/blog-thumb/{slug}-16x9.webp" width="1280" height="720"><img class="ds-post-thumb is-cover" src="/assets/img/blog-thumb/{slug}-3x1.webp" alt="{cover_alt(slug)}" width="1440" height="480" decoding="async" fetchpriority="high"></picture>') if has_cover(slug) else f'<img class="ds-post-thumb" src="/assets/img/blog-thumb/{thumb_of(cat, cfg["relatedCalc"]["url"])[0]}-wide.webp" alt="" width="960" height="480" decoding="async">'}
    <div class="ds-post-body ds-prose">
{inner.strip()}
    </div>
    {INFO[slug]['info']}
  </article>
</main>

{footer(orig_copy(s))}
{scripts}
<script src="/assets/calc-registry.js"></script>
<script src="/assets/ds/site-shell.js"></script>
</body>
</html>
'''
    doc = s[:s.index('<head>') + 6] + new_head(s) + '</head>\n' + strip_emoji(body)
    open(os.path.join(SITE, 'blog', 'posts', slug + '.html'), 'w', encoding='utf-8').write(stamp_html(doc))
    posts[slug] = {'cat': cat, 'title': tx(h1.group(1)), 'date': date, 'rd': rd, 'rc': rc, 'faq': nfaq, 'thumb': thumb_of(cat, rc['url'])}

# ── 목록(D1·D3) ──
s = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
hero = re.search(r'<div class="blog-hero">\s*<h1>(.*?)</h1>\s*<p>(.*?)</p>\s*<p[^>]*>(.*?)</p>', s, re.S)
cards = re.findall(r'<a href="\./posts/([^"]+)\.html" class="post-card" data-cat="([^"]*)">.*?class="post-title">(.*?)</div>\s*<div class="post-desc">(.*?)</div>\s*<div class="post-meta">(.*?)</div>', s, re.S)
pop = re.findall(r'<a href="\./posts/([^"]+)\.html" class="feat-card"', s)
filters = [f for f in re.findall(r'data-filter="([^"]*)"', s) if f != '전체']
assert len(cards) >= 168 and len(pop) == 6, (len(cards), len(pop))
def meta_tail(meta):   # 목록 메타: "날짜" + 데스크톱에서만 " · 읽는 시간"(모바일은 카테고리 · 날짜 한 줄, 10/21)
    parts = [x.strip() for x in tx(meta).split('·') if x.strip()]
    date = next((x for x in parts if re.match(r'\d{4}\.\d', x)), parts[0] if parts else '')
    read = next((x for x in parts if '읽기' in x), '')
    return esc(date) + (f'<span class="ds-blog-rt"> · {esc(read)}</span>' if read else '')
def card(slug, title, desc, meta, eager=False):
    c = posts[slug]['cat']; rc = posts[slug]['rc']; cc, cs = calc_info(rc['url'])
    return (f'<article class="ds-blog-card" data-cat="{c}" style="--cat: var(--c-{c})">'
            # 표지: 모바일 목록(폭 88px)은 축소 전용 1:1, 데스크톱 목록(폭 300px대)은 16:9 축소본(10/21)
            + (f'<picture><source media="(min-width: 1024px)" srcset="/assets/img/blog-thumb/{slug}-16x9-sm.webp" width="480" height="270"><img class="is-cover" src="/assets/img/blog-thumb/{slug}-1x1.webp" alt="" width="240" height="240" decoding="async"{"" if eager else " loading=\"lazy\""}></picture>' if has_cover(slug) else
               f'<picture><source media="(min-width: 1024px)" srcset="/assets/img/blog-thumb/{posts[slug]["thumb"][0]}-wide.webp"><img src="/assets/img/blog-thumb/{posts[slug]["thumb"][0]}-sq.webp" alt="" width="96" height="96" decoding="async"{"" if eager else " loading=\"lazy\""}></picture>')
            + ''
            f'<div class="ds-blog-card-body"><div class="ds-blog-meta"><i aria-hidden="true"></i>{CATNAME[c]} · {meta_tail(meta)}</div>'
            f'<h3><a href="/blog/posts/{slug}.html">{tx(title)}</a></h3><p>{esc(tx(desc))}</p>'
            f'<a class="ds-blog-calc" href="{calc_href(cc, cs)}">{esc(rc["name"])}</a></div></article>')
def pop_item(i, sl):   # 많이 읽은 글: 순위 + 1:1 표지 + 제목
    th = f'<img class="ds-blog-pop-thumb" src="/assets/img/blog-thumb/{sl}-1x1.webp" alt="" width="240" height="240" loading="lazy" decoding="async">' if has_cover(sl) else ''   # 56px 자리: 축소 전용 1:1
    return f'<li><a href="/blog/posts/{sl}.html"><span>{i + 1}</span>{th}<b>{esc(posts[sl]["title"])}</b></a></li>'
feat_slug, feat_title, feat_desc, feat_meta = cards[0][0], cards[0][2], cards[0][3], cards[0][4]
fc = posts[feat_slug]['cat']
feat = (f'<article class="ds-blog-feat" data-cat="{fc}" style="--cat: var(--c-{fc})">'
        + (f'<img class="is-cover" src="/assets/img/blog-thumb/{feat_slug}-16x9.webp" alt="{cover_alt(feat_slug)}" width="1280" height="720" decoding="async">' if has_cover(feat_slug) else f'<img src="/assets/img/blog-thumb/{posts[feat_slug]["thumb"][0]}-wide.webp" alt="" width="960" height="480" decoding="async">')
        + ''
        f'<div><div class="ds-blog-meta"><span class="ds-post-chip">{CATNAME[fc]}</span> · {meta_tail(feat_meta)}</div><h3><a href="/blog/posts/{feat_slug}.html">{tx(feat_title)}</a></h3><p>{esc(tx(feat_desc))}</p></div></article>')
seen = []; rel = []
for sl in pop:
    u = posts[sl]['rc']['url']
    if u not in seen and len(rel) < 4: seen.append(u); rel.append(posts[sl]['rc'])
chips = '<button type="button" class="is-active" data-cat="" aria-pressed="true">전체</button>' + ''.join(
    f'<button type="button" data-cat="{OLD[f]}" aria-pressed="false">{CATNAME[OLD[f]]}</button>' for f in filters)
alias = {**{k: v for k, v in OLD.items()}, **{n: k for k, n, _ in CATS}, **{k: k for k, _, _ in CATS}, '이직/연봉': 'salary', '날짜/D-day': 'date'}
SCRIPT = '''<script>
/* 블로그 목록: 카테고리 필터(?cat= 옛 이름·새 이름·slug 모두) + 12편씩 더 보기. 대표 글은 '전체'에서만 */
(function () {
  var ALIAS = ''' + json.dumps(alias, ensure_ascii=False) + ''', NAME = ''' + json.dumps(CATNAME, ensure_ascii=False) + ''';
  var chips = document.querySelectorAll('.ds-blog-chips button'), cards = [].slice.call(document.querySelectorAll('#ds-blog-list .ds-blog-card'));
  var feat = document.querySelector('.ds-blog-feat'), more = document.getElementById('ds-blog-more'), head = document.getElementById('ds-blog-list-title');
  var cur = '', shown = 12, PAGE = 12;
  function render() {
    var list = cards.filter(function (c) { return !cur || c.getAttribute('data-cat') === cur; });
    cards.forEach(function (c) { c.hidden = true; });
    list.forEach(function (c, i) { c.hidden = i >= shown; });
    if (feat) feat.hidden = !!cur;
    head.textContent = cur ? NAME[cur] + ' 글' : '최신 글';
    var rest = list.length - shown;
    more.hidden = rest <= 0; if (rest > 0) more.textContent = '+' + rest + '개의 글 더 보기';
    chips.forEach(function (b) { var on = b.getAttribute('data-cat') === cur; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
  }
  function pick(k, push) {
    cur = k || ''; shown = PAGE; render();
    if (push) { var u = cur ? '?cat=' + encodeURIComponent(NAME[cur]) : location.pathname; history.replaceState(null, '', u); }
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-cat'), true); }); });
  more.addEventListener('click', function () { shown += PAGE; render(); });
  var q = ''; try { q = new URLSearchParams(location.search).get('cat') || ''; } catch (e) {}
  pick(ALIAS[q] || '', false);
})();
</script>'''
list_cards = ''.join(card(sl, t, d, m, i < 4) for i, (sl, _, t, d, m) in enumerate(cards) if sl != feat_slug)
body = f'''<body data-cat="blog">
{HEADER}

<main class="ds-blog ds-container">
  <div class="ds-blog-hero">
    <h1>{tx(hero.group(1))}</h1>
    <p>{tx(hero.group(2))}</p>
    <p class="ds-t-sub">{tx(hero.group(3))}</p>
  </div>
  <nav class="ds-blog-chips" aria-label="카테고리">{chips}</nav>
  <div class="ds-blog-grid">
    <div class="ds-blog-main">
      {feat}
      <h2 class="ds-blog-h" id="ds-blog-list-title">최신 글</h2>
      <div class="ds-blog-list" id="ds-blog-list">{list_cards}</div>
      <button type="button" class="ds-btn-outline ds-blog-more" id="ds-blog-more">더 보기</button>
    </div>
    <aside class="ds-blog-side">
      <section class="ds-blog-box"><h2 class="ds-blog-h">많이 읽은 글</h2><p class="ds-blog-box-sub">{tx(re.search(r'<div class="feat-head">.*?<span>(.*?)</span>', s, re.S).group(1))}</p><ol class="ds-blog-pop">{"".join(pop_item(i, sl) for i, sl in enumerate(pop))}</ol></section>
      <section class="ds-blog-box"><h2 class="ds-blog-h">관련 계산기 바로가기</h2><ul class="ds-blog-rel">{"".join((lambda c, sl: f'<li><a href="{calc_href(c, sl)}" style="--cat: var(--c-{c})"><span class="ds-cat-ico">{I(CATICON[c])}</span><b>{esc(r["name"])}</b>{I("chevron-right", "ds-chevron")}</a></li>')(*calc_info(r["url"])) for r in rel)}</ul></section>
    </aside>
  </div>
</main>

{footer(orig_copy(s))}
<script src="/assets/calc-registry.js"></script>
<script src="/assets/ds/site-shell.js"></script>
{SCRIPT}
</body>
</html>
'''
open(os.path.join(SITE, 'blog', 'index.html'), 'w', encoding='utf-8').write(stamp_html(s[:s.index('<head>') + 6] + new_head(s) + '</head>\n' + strip_emoji(body)))

# ── 404(E1): 어느 경로에서 보여도 되게 모든 주소는 루트 기준 ──
s = open(os.path.join(O, '404.html'), encoding='utf-8').read()
TOP5 = [('salary', 'take-home-pay', '연봉 실수령액 계산기'), ('realestate', 'acquisition', '취득세 계산기'), ('tax', 'withholding', '3.3% 원천징수 계산기'),
        ('realestate', 'dsr', 'DSR 계산기'), ('date', 'age', '만 나이 계산기')]
ocats = re.findall(r'<a href="(/calc/[a-z-]+/)"[^>]*>(.*?)</a>', s)
sub = tx(re.sub(r'<br\s*/?>', ' ', re.search(r'<p[^>]*>(요청하신.*?)</p>', s, re.S).group(1)))
body = f'''<body data-cat="404">
{HEADER.replace(' aria-current="page"', '')}

<main class="ds-404 ds-container">
  <div class="ds-404-ico" aria-hidden="true">{I("search")}</div>
  <p class="ds-404-code">404</p>
  <h1>페이지를 찾을 수 없습니다</h1>
  <p class="ds-404-sub">{esc(sub)}</p>
  <div class="ds-404-search" data-ds-search="ds-q-404" role="search"></div>
  <h2 class="ds-blog-h">많이 찾는 계산기</h2>
  <ol class="ds-404-list">{"".join(f'<li><a href="/calc/{c}/{sl}/"><span>{i + 1}</span><b>{n}</b><em>{CATNAME[c]}</em>{I("chevron-right")}</a></li>' for i, (c, sl, n) in enumerate(TOP5))}</ol>
  <nav class="ds-404-cats" aria-label="카테고리">{"".join(f'<a href="{h}">{tx(n)}</a>' for h, n in ocats)}<a href="/blog/">블로그</a></nav>
  <a class="ds-btn-outline ds-404-home" href="/">홈으로 이동</a>
</main>

{footer(orig_copy(s))}
<script src="/assets/calc-registry.js"></script>
<script src="/assets/ds/site-shell.js"></script>
</body>
</html>
'''
open(os.path.join(SITE, '404.html'), 'w', encoding='utf-8').write(stamp_html(s[:s.index('<head>') + 6] + new_head(s) + '</head>\n' + strip_emoji(body)))
import collections
tc = collections.Counter('상황' if p['thumb'][0].startswith('sit-') else '카테고리' for p in posts.values())
print('썸네일', dict(tc), collections.Counter(p['thumb'][0] for p in posts.values()).most_common(40))
print('SVG 표에 없던 색', dict(SVG_UNKNOWN)); print('SVG 충돌 재배정', len(SVG_COLLIDE), '건 /', len({c[0] for c in SVG_COLLIDE}), '편'); [print('  ', c) for c in SVG_COLLIDE]
print('SVG 글자 대비 보정', len(SVG_TEXTFIX), '건'); [print('  ', c) for c in SVG_TEXTFIX]
print('글', len(posts), '| FAQ 접기', sum(p['faq'] for p in posts.values()), '| 목록 카드', len(cards), '대표', feat_slug, '| 인기', pop, '| 관련 계산기', [r['name'] for r in rel])

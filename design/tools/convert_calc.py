"""옛 카테고리 템플릿 계산기 페이지를 새 계산기 템플릿(시안 10~14)으로 옮긴다. 감싸기 방식:
계산 스크립트·결과 칸 id는 그대로, 입력 카드·결과 카드는 안쪽 원문을 그대로 쓰고 바깥 틀만 바꾼다.
사용: python3 -I design/tools/convert_calc.py CAT SLUG [SLUG...]   (작업본 루트에서)
설정: design/tools/conv_cfg.json 의 "CAT/SLUG" 항목(없으면 원문에서 자동):
  chips[], basis[text, href, label], next[{key,path,title,sub,params?}], related[[href,title]],
  prefill{inputId: name}, required[ids], wait, primary[label, path, params?], static_card
원본 백업: design/tools/orig/CAT/SLUG.html (처음 변환할 때 한 번 저장, 다시 돌리면 거기서 시작)"""
import re, sys, json, html, os

TOOLS = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(TOOLS))
CFG = json.load(open(os.path.join(TOOLS, 'conv_cfg.json'), encoding='utf-8')) if os.path.exists(os.path.join(TOOLS, 'conv_cfg.json')) else {}
CATS = [('realestate', '부동산', 'house'), ('salary', '이직/연봉', 'briefcase'), ('tools', '생활·도구', 'wrench'), ('tax', '프리랜서 세금', 'receipt'),
        ('pension-welfare', '연금·복지', 'shield-check'), ('finance', '금융·이자', 'piggy-bank'), ('date', '날짜·D-day', 'calendar-days'),
        ('health', '건강', 'heart-pulse'), ('ai', 'AI/테크', 'cpu'), ('pet', '반려동물', 'paw-print'), ('auto', '자동차', 'car'), ('baby', '출산·육아', 'baby')]
ICON = {k: i for k, _, i in CATS}

def I(n, c=''):
    return f'<svg class="ds-i{(" " + c) if c else ""}" aria-hidden="true"><use href="/assets/ds/icons.svg#i-{n}"></use></svg>'

def div_end(s, start):
    depth = 0
    for m in re.finditer(r'<div\b|</div>', s[start:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return start + m.end()
    raise ValueError('div not closed')

def text_of(h):
    return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()

# 페이지 <style>에서 공통 부품을 다시 칠하는 규칙은 버리고(base.css가 맡음) 페이지 고유 규칙만 남긴다
GENERIC = re.compile(r'(^|[\s,>+~])(\.card\b|\.card-title|\.field\b|\.field-label|\.field-hint|\.label-hint|\.input-wrap|input\b|\.unit\b|\.converted|'
                     r'\.result-|\.seg-|\.page-header|\.page-title|\.page-subtitle|\.breadcrumb|h1\b|\.explain-|\.guide-|\.faq-|\.site-header|\.header-|'
                     r'\.[\w-]*-select\b|select\b|\.mob-|\.nav-|\.logo|\.toast|\.update-note|\.ref-links|\.affiliate|\.page-wrap|body\b|html\b|\.hidden\b|\.page-badge|\.page-header-badge)')

def filter_style(css):
    def rules(text):
        res, i = [], 0
        while i < len(text):
            if text[i].isspace(): i += 1; continue
            if text.startswith('/*', i):
                i = text.index('*/', i) + 2; continue
            j = text.index('{', i); head = text[i:j].strip()
            d, k = 1, j + 1
            while d:
                d += {'{': 1, '}': -1}.get(text[k], 0); k += 1
            body = text[j + 1:k - 1]
            if head.startswith('@media'):
                inner = rules(body)
                if inner: res.append(head + ' {\n' + '\n'.join('  ' + r for r in inner) + '\n}')
            elif head.startswith('@'):
                res.append(head + ' {' + body + '}')
            else:
                sels = [x for x in head.split(',') if not GENERIC.search(x.strip())]
                if sels: res.append(', '.join(x.strip() for x in sels) + ' { ' + body.strip() + ' }')
            i = k
        return res
    return rules(css)

def short(t):
    rules = (('자주 묻는 질문', 'FAQ'), ('가이드', '가이드'), ('확인할 핵심', '확인할 핵심'), ('확인하', '확인할 핵심'), ('주의', '주의할 점'),
             ('예시', '계산 예시'), ('사례', '계산 예시'), ('시나리오', '계산 예시'), ('비교', '비교'), ('요율', '요율표'), ('세율', '세율표'),
             ('공제', '공제'), ('표', '구간별 표'), ('별 ', '구간별 표'), ('방법', '계산 방법'), ('공식', '계산 방법'), ('절차', '절차'))
    for k, v in rules:
        if k in t: return v
    return ' '.join(re.split(r'\s[-–]\s|[(:]', t)[0].split()[:2])

def registry_names():
    # calc-registry.js를 node로 뽑은 design/tools/registry.json (계산기 추가 시 다시 뽑기)
    d = json.load(open(os.path.join(TOOLS, 'registry.json'), encoding='utf-8'))
    return {tuple(k.split('/')): v for k, v in d.items()}
NAMES = registry_names()

def convert(cat, slug):
    key = f'{cat}/{slug}'
    c = CFG.get(key, {})
    p = os.path.join(SITE, 'calc', cat, slug, 'index.html')
    bak = os.path.join(TOOLS, 'orig', cat, slug + '.html')
    if not os.path.exists(bak):
        os.makedirs(os.path.dirname(bak), exist_ok=True)
        open(bak, 'w', encoding='utf-8').write(open(p, encoding='utf-8').read())
    s = open(bak, encoding='utf-8').read()
    log = []
    catname = dict((k, n) for k, n, _ in CATS)[cat]

    # ── head ──
    lm = re.search(r'\s*<link rel="stylesheet" href="/assets/[a-z-]+-common\.css" />', s)
    cut = lm.start()
    head = s[:cut] + '\n'
    styles = re.findall(r'<style>(.*?)</style>', s[lm.end():s.index('</head>')], flags=re.S)
    kept = []
    for st in styles: kept += filter_style(st)
    head_rest = re.sub(r'\s*<style>.*?</style>', '', s[lm.end():s.index('</head>')], flags=re.S).strip()
    head_rest = ('  ' + head_rest + '\n') if head_rest else ''
    page_style = ('  <style>\n    /* 페이지 고유 스타일(공통 부품 재정의는 base.css가 맡아 뺐다) */\n' + '\n'.join('    ' + r for r in kept) + '\n  </style>\n') if kept else ''

    # ── 제목 ──
    ph0 = s.index('<div class="page-header">'); ph1 = div_end(s, ph0); ph = s[ph0:ph1]
    h1 = text_of(re.search(r'<h1[^>]*>(.*?)</h1>', ph, re.S).group(1))
    sub = re.search(r'</h1>\s*<p[^>]*>(.*?)</p>', ph, re.S) or re.search(r'<p[^>]*>(.*?)</p>', ph, re.S)
    sub = text_of(sub.group(1)) if sub else ''
    badge = re.search(r'class="page-(?:header-)?badge">(.*?)</div>', ph, re.S); badge = text_of(badge.group(1)) if badge else ''
    crumb_cat = re.findall(r'<a href="/calc/' + re.escape(cat) + r'/">(.*?)</a>', ph)
    crumb_cat = text_of(crumb_cat[0]) if crumb_cat else f'{catname} 계산기'
    bc = re.search(r'class="breadcrumb">(.*?)</div>', ph, re.S)
    last = re.findall(r'<span(?![^>]*breadcrumb-sep)[^>]*>(.*?)</span>', bc.group(1)) if bc else []
    crumb_last = text_of(last[-1]) if last else (text_of(re.split(r'&rsaquo;|›', bc.group(1))[-1]) if bc else h1) or h1

    # ── 입력 영역: 제목 다음 ~ 첫 결과 카드 ──
    table = c.get('table_card')   # 입력·결과 없는 비교표 페이지(llm-comparison): 첫 표 카드를 본체로
    r0 = re.search(r'<div [^>]*\bclass="[^"]*\b' + ('card guide-card' if table else r'result-card\b[^"]*') + '"', s[ph1:]).start() + ph1
    # 첫 결과 카드를 감싼 결과 상자(id="result" 또는 data-result-group)가 있으면 그것이 결과 단위
    wraps = [m for m in re.finditer(r'<div [^>]*(?:\bid="result"|data-result-group)[^>]*>', s[ph1:r0])]
    for m in reversed(wraps):
        w0 = ph1 + m.start()
        if div_end(s, w0) > r0: r0 = w0; break
    inp = s[ph1:r0]
    r1 = div_end(s, r0); res = s[r0:r1]
    ends = [x for x in [s.find('<a class="affiliate-banner"', r1), s.find('<div class="explain-section"', r1), s.find('<div class="adfit-slot"', r1),
                        s.find('<div class="guide-section"', r1)] if x > 0]
    nxt = min(ends)
    extra = s[r1:nxt].strip()
    extra_in_result = 'result-card' in extra

    inp = re.sub(r'<!--.*?-->', '', inp, flags=re.S)
    inp = re.sub(r'class="card-title"', 'class="field-label ds-group-label"', inp)
    # 입력칸보다 먼저 오는 원본 안내 상자(.info-box)는 글 그대로 입력 카드 맨 아래(계산하기 위)로: 첫 입력칸을 끌어올린다. 이모지는 라인 아이콘으로
    infos = []
    while '<div class="info-box"' in inp:
        b0 = inp.index('<div class="info-box"'); b1 = div_end(inp, b0)
        infos.append(re.sub(r'<span class="info-icon">.*?</span>', '<span class="info-icon">' + I('info') + '</span>', inp[b0:b1], flags=re.S))
        inp = inp[:b0] + inp[b1:]
    if infos: log.append(f'안내 상자 {len(infos)}개 입력 카드 아래로')
    inp_tail = '\n'.join(infos)
    money = []
    # 값을 그대로 꺼내 쓰는 곳(const raw = el.value 등)이 있는 칸은 콤마를 넣지 않는다(원본 계산이 콤마를 못 읽음)
    script_part = s[s.index('</main>'):] if '</main>' in s else s
    def raw_read(i):
        for mm in re.finditer(r"getElementById\(['\"]" + re.escape(i) + r"['\"]\)\.value", script_part):
            if not re.search(r'(parseFloat|parseInt|Number)\(\s*(document\.)?$', script_part[max(0, mm.start() - 40):mm.start()]):
                return True
        return False
    def money_input(m):
        tag, unit = m.group(1), m.group(3)
        idm = re.search(r'id="([^"]+)"', tag)
        if unit.strip() in ('만원', '원') and idm and 'type="number"' in tag and 'step="0.' not in tag and not raw_read(idm.group(1)):
            i = idm.group(1); money.append(i)
            tag = tag.replace('type="number"', 'type="text" inputmode="numeric" autocomplete="off" data-ds-num')
            if i in c.get('prefill', {}) and 'data-prefill' not in tag:
                tag = tag.replace(f'id="{i}"', f'data-prefill="{c["prefill"][i]}" id="{i}"')
        return tag + m.group(2)
    inp = re.sub(r'(<input[^>]*>)(\s*<span class="unit">([^<]*)</span>)', money_input, inp)
    # 원본 자체 계산 버튼(date 5종 .calc-btn): 공용 계산 버튼으로 바꾸고 문구는 원문 그대로 둔다
    own_btn = re.search(r'<button class="calc-btn" onclick="([A-Za-z_]\w*)\(\)">([^<]*)</button>', inp)
    btn_text = '계산하기'
    if own_btn:
        inp = inp.replace(own_btn.group(0), ''); btn_text = own_btn.group(2).strip()
    # 계산 함수 = 입력 때 부르는 함수. 인자 없는 것을 먼저 고른다(선택 버튼 함수는 인자가 필요해 쓰지 않음)
    fm = re.search(r'oninput="([A-Za-z_]\w*)\(\)"', inp) or re.search(r'onchange="([A-Za-z_]\w*)\(\)"', inp) \
        or re.search(r'oninput="([A-Za-z_]\w*)\(', inp) or re.search(r'onchange="([A-Za-z_]\w*)\(', inp)
    # 입력 줄을 스크립트가 그리는 페이지(gpa): 템플릿 안의 oninput/onchange 함수
    fm = fm or re.search(r'oninput="([A-Za-z_]\w*)\(\)"', s) or re.search(r'onchange="([A-Za-z_]\w*)\(\)"', s)
    calc_fn = fm.group(1) if fm else ''
    # 인자를 받는 입력 함수(onNumInput(this, ...))는 버튼에서 인자 없이 부르면 오류: 그 함수가 끝에 부르는 인자 없는 계산 함수로 바꾼다(10/21)
    if calc_fn and not re.search(r'on(?:input|change)="' + calc_fn + r'\(\)"', inp + s):
        body = re.search(r'function ' + calc_fn + r'\s*\([^)]*\)\s*\{(.*?)\n\}', s, re.S)
        inner = re.findall(r'\b([A-Za-z_]\w*)\(\);', body.group(1)) if body else []
        if inner: log.append(f'계산 함수 {calc_fn}(인자 있음) → {inner[-1]}'); calc_fn = inner[-1]
    if own_btn: calc_fn = own_btn.group(1)
    req = c.get('required', money[:1])
    card_id = re.match(r'<div [^>]*\bid="([^"]+)"', res[:res.index('>') + 1]); card_id = card_id.group(1) if card_id else ''
    if not card_id:
        card_id = f'{slug}-result-card'; res = res.replace('<div class="', f'<div id="{card_id}" class="', 1); log.append('결과 카드 id 없어 추가')
    replaces_card = re.search(r"getElementById\(['\"]" + re.escape(card_id) + r"['\"]\)\.innerHTML\s*=", s) is not None
    res_open = re.match(r'<div ([^>]*?)class="([^"]*)"', res)
    static = c.get('static_card') or table
    if res_open and res_open.end() <= res.index('>'):
        res = res.replace(res_open.group(0), f'<div {res_open.group(1)}class="{res_open.group(2)} ds-wrap{" show" if static else ""}"', 1)
    else:
        res = res.replace('<div ', '<div class="ds-wrap" ', 1)   # 클래스 없는 결과 상자
    nx = c.get('next')
    if nx is None:
        nx = []
    prim = c.get('primary')
    actions = ''
    if not static:
        actions = (f'\n        <div class="ds-result-actions">\n          <button type="button" class="ds-btn-outline" onclick="DSCalc.copy(\'{card_id}\')">{I("copy", "ds-i-sm")}결과 복사</button>\n'
                   + (f'          <a class="ds-btn-primary" id="ds-primary-next" href="{prim[1]}">{prim[0]} {I("arrow-right", "ds-i-sm")}</a>\n' if prim else '')
                   + '        </div>')
        if not replaces_card:
            res = res[:-len('</div>')].rstrip() + actions + '\n      </div>'; actions = ''
        else:
            log.append('결과 카드를 스크립트가 통째로 다시 그려서 버튼 줄은 카드 밖에 둠')
    tl = re.search(r'class="(?:rh-label|result-total-label)"[^>]*>(.*?)</', res, re.S)
    ghost_label = text_of(tl.group(1)) if tl else '계산 결과'

    # ── 가이드 ──
    rest = s[nxt:s.index('</main>')]
    aff = ''
    m = re.search(r'\s*<a class="affiliate-banner".*?</a>\s*(<p class="affiliate-disclosure">.*?</p>)?', rest, re.S)
    if m:
        aff = m.group(0).strip().replace('rel="noopener noreferrer sponsored">', 'rel="noopener noreferrer sponsored">\n      <span class="ds-icon-badge">' + I('shield-check') + '</span>', 1)
        rest = rest.replace(m.group(0), '\n', 1)
    toc = []
    em = re.search(r'<div class="explain-section">\s*<button class="explain-toggle[^"]*"[^>]*>(.*?)</button>\s*<div class="explain-body[^"]*">', rest, re.S)
    explain_html = ''
    if em:
        e0 = rest.index('<div class="explain-section">'); e1 = div_end(rest, e0)
        body0 = rest.index('<div class="explain-body', e0); body1 = div_end(rest, body0)
        body = rest[rest.index('>', body0) + 1:body1 - len('</div>')]
        title = text_of(re.sub(r'<span class="etarrow">.*?</span>', '', em.group(1)))
        sid = f'{slug}-guide'; toc.append((sid, '가이드'))
        body = body.replace('</h3><p>', '</h3>\n      <p>')
        explain_html = f'''      <section class="explain-section ds-section ds-prose" aria-labelledby="{sid}">
        <div class="ds-section-head"><h2 id="{sid}">{title}</h2></div>
{body.rstrip()}
      </section>'''
        rest = rest[:e0] + '@@EXPLAIN@@' + rest[e1:]
    # 건강형: <section class="guide-section seo-card">도 같은 본문 섹션으로(목차·FAQ 접기)
    rest = re.sub(r'<section class="guide-section seo-card( faq-card)?">(.*?)</section>', lambda mm: f'<div class="guide-card{mm.group(1) or ""}">{mm.group(2)}</div>', rest, flags=re.S)
    n = 0
    while '<div class="guide-card' in rest:
        g0 = rest.index('<div class="guide-card'); g1 = div_end(rest, g0); g = rest[g0:g1]
        n += 1; is_faq = 'faq-card' in g[:80] or ('faq-item' in g and '자주 묻는' in g)
        h2m = re.search(r'<h2[^>]*>(.*?)</h2>', g, re.S); title = text_of(h2m.group(1)) if h2m else ''
        inner = g[g.index('>') + 1:-len('</div>')]
        if h2m: inner = inner.replace(h2m.group(0), '', 1)
        sid = f'{slug}-faq' if is_faq else f'{slug}-s{n}'
        lbl = 'FAQ' if is_faq else short(title)
        if lbl not in [t[1] for t in toc]: toc.append((sid, lbl))
        elif is_faq: toc.append((sid, lbl))
        inner = inner.replace('<div class="guide-table-wrap">', '<div class="ds-table-card">').replace('<div class="table-wrap">', '<div class="ds-table-card">')
        inner = re.sub(r'<p style="font-size:14px;color:var\(--gray-600\);margin-bottom:12px">', '<p class="ds-table-lead">', inner)
        if is_faq:
            cnt = [0]
            def fq(mm):
                cnt[0] += 1
                return (f'<details class="faq-item"><summary><h3>{mm.group(1)}</h3>{I("chevron-down", "ds-faq-chev")}</summary>\n'
                        f'              <p>{mm.group(2)}</p>\n            </details>')
            inner = re.sub(r'<div class="faq-item">\s*<(?:h3|div class="faq-q")>(.*?)</(?:h3|div)>\s*<(?:p|div class="faq-a")>(.*?)</(?:p|div)>\s*</div>', fq, inner, flags=re.S)
            sec = f'''        <section class="ds-section faq-card" aria-labelledby="{sid}">
          <div class="ds-section-head"><h2 id="{sid}">{h2m.group(1) if h2m else ''}</h2></div>
          <div class="ds-faq">
{inner.strip()}
          </div>
        </section>'''
            log.append(f'FAQ {cnt[0]}개 접기')
        else:
            sec = f'''        <section class="ds-section ds-prose" aria-labelledby="{sid}">
          <div class="ds-section-head"><h2 id="{sid}">{h2m.group(1) if h2m else ''}</h2></div>
{inner.strip()}
        </section>'''
        rest = rest[:g0] + sec + rest[g1:]
    rest = re.sub(r'<p style="[^"]*#FEF3C7[^"]*">(.*?)</p>', lambda mm: '<p class="ds-callout">' + I('circle-alert') + '<span>' + re.sub(r' style="[^"]*"', '', mm.group(1)) + '</span></p>', rest, flags=re.S)
    rest = re.sub(r'<div class="adfit-slot"[^>]*>', '<div class="adfit-slot ds-ad">', rest)
    tb = rest.find('<script src="/assets/trust-block.js"></script>')
    if tb > 0:
        mm = re.match(r'<script src="/assets/trust-block.js"></script>\s*</div>', rest[tb:])
        if mm and rest[:tb].count('<div') - rest[:tb].count('</div') < 1:
            rest = rest[:tb] + '<script src="/assets/trust-block.js"></script>' + rest[tb + mm.end():]
    rest = rest.replace('<div class="sibling-section">', '<div class="sibling-section ds-section">', 1)
    tm = re.search(r'<script>\s*window\.TRUST_BLOCK_CONFIG', rest)
    trust_col = '  </div>\n\n  <div class="ds-aside-row">\n    <div class="ds-aside-col" id="ds-trust-col"></div>\n  </div>\n\n  '
    if tm:
        rest = rest[:tm.start()] + '@@ENDFLOW@@' + rest[tm.start():]
    else:
        log.append('신뢰 설정 없음')
    rest = rest.replace('@@EXPLAIN@@', ('\n' + explain_html + '\n') if explain_html else '')
    faq_t = [t for t in toc if t[1] == 'FAQ']; mid = [t for t in toc if t[1] not in ('FAQ', '가이드')][:4]
    toc = [t for t in toc if t[1] == '가이드'][:1] + mid + faq_t[:1]
    toc_html = '      <nav class="ds-toc" aria-label="이 페이지 내용">\n        ' + ''.join(f'<a href="#{i}">{l}</a>' for i, l in toc) + '\n      </nav>\n' if len(toc) >= 2 else ''
    flow = '  <div class="ds-calc-flow">\n' + ('  ' + aff + '\n' if aff else '') + '\n' + toc_html + rest.strip()
    flow = flow.replace('@@ENDFLOW@@', trust_col) if '@@ENDFLOW@@' in flow else flow + '\n' + trust_col

    # ── 원문에서 자동으로 채우는 것: 칩·근거·관련 계산기 ──
    std = re.search(r"standard:\s*'([^']*)'", s); std = std.group(1) if std else ''
    refm = re.search(r"references:\s*\[\s*\{\s*name:\s*'([^']*)',\s*url:\s*'([^']*)'", s)
    rev = re.search(r"window\.ARTICLE_INFO_CONFIG\s*=\s*\{.*?lastReviewed:\s*'([^']*)'", s, re.S)
    chips = c.get('chips') or [x for x in [re.sub(r'^[^\w가-힣]+', '', badge).strip(), (rev.group(1) + ' 검토') if rev else ''] if x]
    basis = c.get('basis') or ([std.split(', 20')[0], refm.group(2), refm.group(1).split('(')[0] + ' 확인'] if std and refm else None)
    sib = re.findall(r'<a href="/calc/' + re.escape(cat) + r'/([a-z0-9-]+)/" class="sibling-link(?: current)?">', s)
    others = [x for x in dict.fromkeys(sib) if x != slug]
    nkeys = [x['path'].strip('/').split('/')[-1] for x in nx]
    related = c.get('related') or [[f'/calc/{cat}/{x}/', (lambda nm: nm if nm.endswith(('계산기', '변환기', '세기')) else nm + ('기' if nm.endswith('계산') else ' 계산기'))(NAMES.get((cat, x), x))] for x in others if x not in nkeys][:3]

    # ── 스크립트 ──
    tail = s[s.index('</main>'):]
    tail = re.sub(r'<footer class="site-footer">.*?</footer>', '@@FOOTER@@', tail, flags=re.S)
    if '@@FOOTER@@' not in tail:
        tail = tail.replace('</main>', '</main>\n@@FOOTER@@', 1); log.append('원본 푸터 없음')
    before = tail
    tail = re.sub(r'\b(parseFloat|parseInt|Number)\(\s*([A-Za-z_$][\w$]*(?:\.getElementById\([^()]*\))?)\.value\s*\)',
                  lambda mm: f"{mm.group(1)}(String({mm.group(2)}.value).replace(/,/g, ''))", tail)
    patched = len(re.findall(r"replace\(/,/g, ''\)", tail)) - len(re.findall(r"replace\(/,/g, ''\)", before))
    for i in money:
        for mm in re.finditer(r"getElementById\(['\"]" + re.escape(i) + r"['\"]\)\.value", tail):
            ctx = tail[max(0, mm.start() - 30):mm.end() + 40]
            if "replace(/,/g" not in ctx:
                log.append(f'확인 필요: {i} 읽기 {ctx!r}')
    toast = re.search(r'<div (?:id="toast" class="toast"|class="toast" id="toast")></div>', tail)
    at = toast.end() if toast else tail.index('@@FOOTER@@') + len('@@FOOTER@@')
    tail = tail[:at] + '\n\n<script src="/assets/ds/calc-kit.js"></script>' + tail[at:]
    tail = re.sub(r'\s*<script src="/assets/[a-z-]+-detail-shell\.js"[^>]*></script>', '\n<script src="/assets/ds/site-shell.js"></script>', tail)
    tail = re.sub(r'\s*<script src="/assets/footer-unified\.js"[^>]*></script>', '', tail)
    if '/assets/ds/site-shell.js' not in tail:
        tail = tail.replace('</body>', '<script src="/assets/ds/site-shell.js"></script>\n</body>', 1); log.append('셸 스크립트 새로 추가')
    auto = {'card': card_id, 'required': req, 'waitText': c.get('wait', '값을 입력하면 계산됩니다'), 'nextBox': f'#{slug}-next',
            'next': [{k: v for k, v in x.items() if k in ('key', 'path', 'params', 'sub')} | {'from': slug} for x in nx if x.get('params')]}
    prim_js = ''
    if prim and len(prim) > 2:
        prim_js = (f"\n  (function () {{ const a = document.getElementById('ds-primary-next'); if (!a) return; const go = () => {{ const v = {{}}; "
                   f"Object.entries({json.dumps(prim[2])}).forEach(([k, id]) => v[k] = DSCalc.num(id)); a.href = DSCalc.link('{prim[1]}', v, '{slug}'); }}; "
                   f"document.addEventListener('input', go, true); go(); }})();")
    boot = (f"<script>\n  // 새 틀 연결: 결과 바 · 결과 복사 · 이어서 계산 값 싣기 · 신뢰 블록 배치 (원본 계산 스크립트는 그대로)\n"
            + ('' if static else f"  DSCalc.auto({json.dumps(auto, ensure_ascii=False)});\n") + f"  DSCalc.placeTrust('ds-trust-col');{prim_js}\n</script>\n")
    if 'prefill.js' not in tail:
        boot += '<script src="/assets/ds/prefill.js" defer></script>\n'
    tail = tail.replace('</body>', boot + '</body>', 1)

    ch = I('chevron-right'); ic = ICON[cat]
    def card(href, title, sub=None, key=None):
        k = f' data-next="{key}"' if key else ''
        sb = f'<span>{sub}</span>' if sub else ''
        return f'        <a class="ds-next-card" href="{href}"{k}><span class="ds-cat-ico">{I(ic)}</span><span class="ds-next-body"><b>{title}</b>{sb}</span>{ch}</a>\n'
    chips_html = ''.join(f'\n          <span class="ds-trust-chip">{x}</span>' for x in chips)
    basis_html = (f'''
  <section class="ds-basis" aria-labelledby="ds-h-basis">
    <h2 class="ds-block-title" id="ds-h-basis">계산 근거</h2>
    <div class="ds-basis-card">{basis[0]} <a href="{basis[1]}" target="_blank" rel="noopener">{basis[2]} {I('arrow-up-right', 'ds-i-sm')}</a></div>
  </section>
''' if basis else '')
    next_html = (f'''      <h2 class="ds-col-title" id="ds-h-next">이어서 계산</h2>
      <div class="ds-next" id="{slug}-next">
{''.join(card(x['path'], x['title'], x.get('sub'), x['key']) for x in nx)}      </div>
''' if nx else '')
    ghost = '' if static else f'''      <div class="ds-result-empty">
        <div class="ds-rbox is-ghost"><span class="ds-result-label">{ghost_label}</span><span class="ds-result-number">--</span><span class="ds-ghost-msg">값을 입력하면 계산됩니다</span></div>
      </div>'''
    page = head + f'''  <link rel="stylesheet" href="/assets/ds/tokens.css" />
  <link rel="stylesheet" href="/assets/ds/base.css" />
{head_rest}{page_style}</head>
<body data-cat="{cat}" style="--cat: var(--c-{cat})">
<header id="ds-site-header" class="ds-header">
  <div class="ds-container"><div class="ds-header-inner">
    <a class="ds-logo" href="/"><span class="ds-logo-text">제이퍼계산기</span></a>
    <nav class="ds-header-nav" aria-label="주 메뉴"><a href="/#situations">상황별</a><a href="/#categories" aria-current="page">카테고리</a><a href="/blog/">블로그</a></nav>
  </div></div>
</header>

<div class="ds-hero ds-hero--calc">
  <div class="ds-container ds-hero-inner">
    <div class="page-header">
      <div class="breadcrumb ds-crumbs"><a href="/">홈</a> &rsaquo; <a href="/calc/{cat}/">{crumb_cat}</a> &rsaquo; {crumb_last}</div>
      <div class="page-badge">{badge or crumb_cat}</div>
      <div class="ds-title-row">
        <span class="ds-cat-ico ds-title-ico">{I(ic)}</span>
        <h1 class="page-title">{h1}</h1>
        <div class="ds-trust-chips" aria-label="기준 정보">{chips_html}
        </div>
      </div>
      <p class="page-subtitle">{sub}</p>
    </div>
  </div>
</div>

<main class="page-wrap ds-main ds-container">
  <div class="ds-calc{' ds-calc--table' if table else ''}">
    <section class="ds-calc-input" aria-labelledby="ds-h-input">
      <h2 class="ds-col-title" id="ds-h-input">계산 입력</h2>
      <div class="ds-input-card">
{inp.strip()}
{inp_tail}
{f"""        <button type="button" class="ds-btn-calc" data-calc-submit="{calc_fn}" data-result="{card_id}" data-required="{','.join(req)}">{btn_text}</button>""" if calc_fn and not static else ''}
      </div>
    </section>

    <section class="ds-calc-result" aria-labelledby="ds-h-result">
      <h2 class="ds-col-title" id="ds-h-result">계산 결과</h2>
      {res}{actions}
{('      ' + extra) if extra_in_result else ''}
{ghost}
    </section>

    <section class="ds-calc-next" aria-labelledby="ds-h-next">
{next_html}      <h2 class="ds-col-title">관련 계산기</h2>
      <div class="ds-next ds-related">
{''.join(card(h, t) for h, t in related)}      </div>
    </section>
  </div>
{('''
  <div class="ds-calc-extra">
    ''' + extra + '''
  </div>
''') if extra and not extra_in_result else ''}{basis_html}
{flow}
'''
    if table:   # 입력·결과 칸 자리에 표 카드 한 칸(카드 제목이 칸 제목)
        tm_ = re.search(r'<div class="card-title">(.*?)</div>', res, re.S)
        body_ = res[res.index('>') + 1:-len('</div>')].replace(tm_.group(0), '', 1).replace('<div class="guide-table-wrap">', '<div class="ds-table-card">')
        body_ = re.sub(r'<span class="info-icon">.*?</span>', '<span class="info-icon">' + I('info') + '</span>', body_, flags=re.S)
        ib_ = re.search(r'<div class="info-box">.*?</div>', body_, re.S)   # 안내 상자는 표 아래로(입력 카드와 같은 규칙)
        if ib_: body_ = body_.replace(ib_.group(0), '', 1).rstrip() + '\n' + ib_.group(0)
        table_html = (f'''
    <section class="ds-calc-table" aria-labelledby="ds-h-table">
      <h2 class="ds-col-title" id="ds-h-table">{text_of(tm_.group(1))}</h2>
      <div class="card ds-table-main" id="{card_id}">
{body_.strip()}
      </div>
    </section>
''')
        page, k_ = re.subn(r'\n    <section class="ds-calc-input".*?</section>\n\n    <section class="ds-calc-result".*?</section>\n', lambda mm: table_html, page, count=1, flags=re.S)
        assert k_ == 1; log.append('비교표 모드: 입력·결과 칸 대신 표 카드')
    footer = f'''<footer id="ds-site-footer" class="site-footer ds-footer">
  <div class="ds-container">
    <div class="ds-footer-top">
      <ul class="ds-footer-cats" aria-label="계산기 카테고리">{''.join(f'<li><a href="/calc/{k}/">{nm}</a></li>' for k, nm, _ in CATS)}</ul>
      <div class="ds-footer-links footer-links">
        <a href="/">홈</a><a href="/about.html">소개</a><a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a><a href="/contact.html">문의하기</a><a href="/disclaimer.html">면책조항</a>
      </div>
    </div>
    <p class="ds-footer-copy footer-copy">&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 세액은 전문가에게 문의하세요.</p>
  </div>
</footer>'''
    fc = re.search(r'class="(?:mega-)?footer-copy">(.*?)</p>', s, re.S)
    if fc: footer = re.sub(r'(<p class="ds-footer-copy footer-copy">).*?(</p>)', lambda mm: mm.group(1) + fc.group(1).strip() + mm.group(2), footer)
    out = page + tail.replace('@@FOOTER@@', footer)
    # 원본 강조색(보라)이 var(--primary)라 리뉴얼 뒤 파란색으로 보인다: 안내 문구의 색 이름만 실제 색으로
    if '보라색' in out and 'color:var(--primary)' in out:
        out = out.replace('보라색', '파란색'); log.append('안내 문구 보라색→파란색(강조색 var(--primary))')
    # 날짜칸(시안 16): 계산 스크립트가 읽는 값은 Y-m-d 그대로, 보이는 칸만 Y.m.d. 직접 입력은 구분자 무관하게 해석
    out = out.replace("dateFormat:'Y-m-d',", "dateFormat:'Y-m-d',altInput:true,altFormat:'Y.m.d',onReady:function(d,s,fp){if(fp.altInput){fp.altInput.setAttribute('inputmode','decimal');fp.altInput.placeholder='예) 2024.03.15'}},parseDate:function(s){var m=String(s).match(/(\\d{4})\\D+(\\d{1,2})\\D+(\\d{1,2})/);return m?new Date(+m[1],m[2]-1,+m[3]):undefined},")
    out = re.sub(r'\n[ \t]*\.flatpickr-input(:focus)? \{[^}]*\}', '', out)   # 칸 모양은 base.css
    # 스크립트가 그리는 원본 주 결과 상자에 공용 결과 상자 클래스를 덧붙인다(틴트 상자·결과 바 값·총계 줄 보조화). 글·계산은 그대로
    for old_, new_ in {'dday-display': 'result-highlight', 'dday-label': 'rh-label', 'dday-number': 'rh-value', 'dday-title': 'rh-sub',
                       'ymd-highlight': 'result-highlight', 'ymd-label': 'rh-label', 'ymd-value': 'rh-value', 'ymd-sub': 'rh-sub'}.items():
        out = out.replace(f'class="{old_}"', f'class="{old_} {new_}"')
    # 옛 카테고리 공용 CSS에만 있던 고유 부품: design/tools/cat_css/CAT.css(토큰 색)를 넣고, 같은 클래스의 옛 페이지 규칙(hex)은 뺀다
    cc = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cat_css', cat + '.css')
    if os.path.exists(cc):
        css = open(cc, encoding='utf-8').read()
        own = set(re.findall(r'^\.([\w-]+)', css, re.M)) | set(re.findall(r', \.([\w-]+)', css))
        out = re.sub(r'\n[ \t]*\.([\w-]+)[^{\n]*\{[^}\n]*\}', lambda mm: '' if mm.group(1) in own and mm.start() < out.find('</head>') else mm.group(0), out)
        out = out.replace('</head>', '  <style>\n' + css.strip() + '\n  </style>\n</head>', 1)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from strip_emoji import strip as _strip_emoji   # 이모지 금지: 본문 ⚠️·💡는 라인 아이콘, 나머지 제거
    out = _strip_emoji(out)
    _fx = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'page_fixes.json'), encoding='utf-8')).get(key, [])
    for _o, _n in _fx:   # 페이지별 보정(design/tools/page_fixes.json)
        assert out.count(_o) == 1, (key, _o); out = out.replace(_o, _n)
    from asset_version import stamp_html, stamp_sources; stamp_sources()   # 공용 CSS·JS 주소에 ?v=내용 해시(캐시 버전)
    open(p, 'w', encoding='utf-8').write(stamp_html(out))
    print(f'{key}: money={money} calc={calc_fn} card={card_id} parse패치={patched} style유지={len(kept)} extra={"결과열" if extra_in_result else ("있음" if extra else "-")} toc={[t[1] for t in toc]} chips={chips}')
    for l in log: print('   ', l)

if __name__ == '__main__':
    cat = sys.argv[1]
    for slug in sys.argv[2:]:
        convert(cat, slug)

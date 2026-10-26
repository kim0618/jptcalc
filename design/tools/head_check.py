"""head 검사: title·description·keywords·canonical·OG·twitter·JSON-LD가 원본(a74cc04)과 같은지. 사용: python3 -I design/tools/head_check.py [--fix] [--blog-src] FILE...  (--blog-src: blog/는 원고 design/blog-source/와 비교)
--fix: 다른 항목을 원본 그대로 되돌린다(태그 단위 교체, 없는 건 </head> 앞에 추가)."""
import re, sys, subprocess
REF = 'a74cc04'
PAT = [('title', r'<title>.*?</title>'),
       ('description', r'<meta\s+name="description"[^>]*>'),
       ('keywords', r'<meta\s+name="keywords"[^>]*>'),
       ('canonical', r'<link\s+rel="canonical"[^>]*>'),
       ('og', r'<meta\s+property="og:[^"]+"[^>]*>'),
       ('twitter', r'<meta\s+name="twitter:[^"]+"[^>]*>'),
       ('jsonld', r'<script type="application/ld\+json">.*?</script>')]
def items(html):
    head = html[:html.find('</head>')]
    out = []
    for k, p in PAT:
        for m in re.finditer(p, head, re.S | re.I): out.append((k, m.group(0)))
    return out
fix = '--fix' in sys.argv
bad = 0; fixed = 0; files = [f for f in sys.argv[1:] if not f.startswith('--')]
for f in files:
    src = f.replace('blog/', 'design/blog-source/', 1) if ('--blog-src' in sys.argv and f.startswith('blog/')) else None
    o = open(src, encoding='utf-8').read() if src and __import__('os').path.exists(src) else subprocess.run(['git', 'show', f'{REF}:{f}'], capture_output=True, text=True).stdout
    if not o: print(f, '원본 없음(새 파일)'); continue
    n = open(f, encoding='utf-8').read()
    io, inn = items(o), items(n)
    if io == inn: continue
    bad += 1
    so, sn = [x[1] for x in io], [x[1] for x in inn]
    miss = [x for x in so if x not in sn]; extra = [x for x in sn if x not in so]
    print(f, '| 원본에만', len(miss), '| 새 쪽에만', len(extra), '|', (miss[:1] or extra[:1])[0][:110].replace('\n', ' ') if (miss or extra) else '순서만 다름')
    if fix:
        for k, p in PAT:   # 같은 종류는 원본 묶음으로 통째 교체
            ol = [x[1] for x in io if x[0] == k]; nl = [x[1] for x in inn if x[0] == k]
            if ol == nl: continue
            hd = n[:n.find('</head>')]; rest = n[n.find('</head>'):]
            for x in nl: hd = hd.replace(x, '@@HC@@', 1)
            if '@@HC@@' in hd:
                hd = hd.replace('@@HC@@', '\n  '.join(ol), 1).replace('@@HC@@', '')
            else:
                hd = hd.rstrip() + '\n  ' + '\n  '.join(ol) + '\n'
            hd = re.sub(r'\n\s*\n(\s*\n)+', '\n', hd)
            n = hd + rest
        open(f, 'w', encoding='utf-8').write(n); fixed += 1
print('검사', len(files), '| 다름', bad, '| 고침', fixed)

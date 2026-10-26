"""그라데이션 검사: linear/radial/conic-gradient 사용처. 배경 그라데이션은 금지(brief), 단 mask-image(칩 줄 끝 스크롤 신호)는 예외.
사용: python3 -I design/tools/gradient_scan.py PATH...  (.html/.css/.js)"""
import re, sys, os
G = re.compile(r'(?:repeating-)?(?:linear|radial|conic)-gradient\(')
bad = ok = 0
for root in sys.argv[1:]:
    fs = [root] if os.path.isfile(root) else [os.path.join(d, f) for d, _, n in os.walk(root) for f in n if f.endswith(('.html', '.css', '.js'))]
    for p in fs:
        for i, line in enumerate(open(p, encoding='utf-8', errors='ignore'), 1):
            for m in G.finditer(line):
                prop = re.findall(r'([\w-]+)\s*:\s*[^;:{}]*$', line[:m.start()])
                if prop and prop[-1] in ('mask-image', '-webkit-mask-image'): ok += 1; continue
                bad += 1; print(f'{p}:{i}: {prop[-1] if prop else "?"} {line.strip()[max(0, m.start() - 60):m.start() + 60]}')
print('그라데이션(금지)', bad, '건 | mask-image 예외', ok, '건')

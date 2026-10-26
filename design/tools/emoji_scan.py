"""이모지 검사(본문만, head·JSON-LD는 원본 유지라 따로 집계): 경로 아래 .html/.js/.json의 이모지(그림 문자·변형 선택자·키캡) 위치 출력. 사용: python3 -I design/tools/emoji_scan.py PATH... [--summary]"""
import re, sys, os, collections
EMO = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍⃣⌀-⏿←-⇿■-◿㊗㊙]')
# 일반 기호로 쓰는 문자(화살표·도형 일부)는 별도 표시만: → ← ↑ ↓ ↔ ⇅ ▲ ▼ ● ○ ■ □ ★ ☆ ✓ ✔ ✕ ✗ ※
SYMBOL_OK = set('→←↑↓↔⇅↗↘▲▼△▽●○■□◆◇★☆✓✕✗※·')
paths = [a for a in sys.argv[1:] if not a.startswith('--')]
headcnt = {'n': 0}; cnt = collections.Counter(); files = collections.Counter(); sym = collections.Counter()
for root in paths:
    for dp, _, fs in os.walk(root):
        for f in fs:
            if not f.endswith(('.html', '.js', '.json')): continue
            p = os.path.join(dp, f)
            raw = open(p, encoding='utf-8', errors='ignore').read()
            # head와 JSON-LD는 원본 유지 대상(검색 노출 문구): 따로 세고 본문 검사에서 뺀다
            hb = raw.find('<body')
            keep = (raw[:hb] if hb > 0 else '') + ''.join(re.findall(r'<script type="application/ld\+json">.*?</script>', raw[hb:] if hb > 0 else raw, re.S))
            headcnt['n'] += sum(1 for m in EMO.finditer(keep) if m.group(0) not in SYMBOL_OK and m.group(0) != '\uFE0F')
            body = raw[hb:] if hb > 0 else raw
            body = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: '\n' * m.group(0).count('\n'), body, flags=re.S)
            off = raw[:hb].count('\n') if hb > 0 else 0
            for i, line in enumerate(body.split('\n'), 1 + off):
                for m in EMO.finditer(line):
                    ch = m.group(0)
                    if ch in SYMBOL_OK: sym[ch] += 1; continue
                    cnt[ch] += 1; files[p] += 1
                    if '--summary' not in sys.argv: print(f'{p}:{i}: {ch!r} {line.strip()[max(0, m.start() - 40):m.start() + 40]}')
print('이모지', sum(cnt.values()), '건 /', len(files), '파일', dict(cnt.most_common(40)))
print('기호(허용, 참고)', dict(sym))
print('head·JSON-LD 안(원본 유지, 검사 제외)', headcnt['n'], '건')

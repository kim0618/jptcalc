"""이모지 제거(리뉴얼: 이모지 금지, 라인 아이콘으로). 사용: python3 -I design/tools/strip_emoji.py FILE...
  head와 JSON-LD는 건드리지 않는다. 본문 글자 안 ⚠️ → triangle-alert, 💡 → info 라인 아이콘. 그 밖의 이모지와 스크립트·JSON-LD·속성 안 이모지는 지운다(뒤 공백 1칸 포함).
  글자 기호(→ ↗ ✓ ✗ ※ 등)는 이모지가 아니라 둔다. convert_calc.py가 변환 끝에 같은 함수를 부른다."""
import re, sys
EMO = '[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿■-◿←-⇿㊗㊙]'
KEEP = set('→←↑↓↔⇅↗↘▲▼△▽●○■□◆◇★☆✓✕✗※·')
SEQ = re.compile('(?:' + EMO + ')[️⃣]?(?:‍(?:' + EMO + ')[️]?)*')
ICON = {'⚠': 'triangle-alert', '💡': 'info'}
def icon(n): return f'<svg class="ds-i ds-i-sm ds-inline-ico" aria-hidden="true"><use href="/assets/ds/icons.svg#i-{n}"></use></svg>'

def _drop(text, with_icons):
    def rep(m):
        seq, sp = m.group(1), m.group(2)
        if seq[0] in KEEP and len(seq) == 1: return seq + sp            # 글자 기호는 그대로
        if with_icons and seq[0] in ICON: return icon(ICON[seq[0]]) + ' '
        return ''                                                         # 이모지와 뒤 공백 1칸 제거
    return re.sub('(' + SEQ.pattern + ')( ?)', rep, text).replace('\uFE0F', '')

def strip(html):
    # head(title·meta·OG·JSON-LD)와 본문 안 JSON-LD는 원본 그대로 둔다(검색 노출 문구는 손대지 않음, 2026-10-19 결정)
    hb = html.find('<body')
    if hb > 0: return html[:hb] + strip(html[hb:]) if html.find('</head>') < hb else html
    parts = re.split(r'(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<[^>]+>)', html, flags=re.S)
    for i, p in enumerate(parts):
        if not p: continue
        if p.startswith('<script type="application/ld+json"'): continue
        if p.startswith('<'):
            parts[i] = _drop(p, False)          # 태그 속성·스크립트·JSON-LD: 지우기만
        else:
            parts[i] = _drop(p, True)           # 본문 글자: ⚠️·💡는 아이콘
    return ''.join(parts)

if __name__ == '__main__':
    n = 0
    for f in sys.argv[1:]:
        s = open(f, encoding='utf-8').read(); t = strip(s)
        if t != s: open(f, 'w', encoding='utf-8').write(t); n += 1
    print('고친 파일', n)

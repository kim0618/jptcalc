"""원본(main a74cc04) 대비 본문 글자 수·누락 문장. 사용: python3 -I textcmp.py ORIG NEW (옛 aside 사이드바 제외 옵션: --noaside). 누락 대조는 텍스트 노드 단위·이모지 제외"""
import sys, re
from html.parser import HTMLParser
class T(HTMLParser):
    def __init__(s):
        super().__init__(); s.skip = 0; s.out = []; s.inbody = False
    def handle_starttag(s, t, a):
        if t == 'body': s.inbody = True
        if t in ('script', 'style', 'header', 'footer', 'head', 'noscript'): s.skip += 1
    def handle_endtag(s, t):
        if t in ('script', 'style', 'header', 'footer', 'head', 'noscript'): s.skip -= 1
    def handle_data(s, d):
        if s.inbody and s.skip == 0: s.out.append(d)
def text(p, noaside):
    h = open(p, encoding='utf-8').read()
    if noaside: h = re.sub(r'<aside\b.*?</aside>', '', h, flags=re.S)
    t = T(); t.feed(h); return t.out
na = '--noaside' in sys.argv
on, nn = text(sys.argv[1], na), text(sys.argv[2], na)
o, n = ' '.join(on), ' '.join(nn)
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from strip_emoji import SEQ, KEEP
emo = lambda x: SEQ.sub(lambda m: m.group(0) if m.group(0) in KEEP else '', x).replace('\uFE0F', '')
cnt = lambda x: len(re.sub(r'\s', '', x))
norm = lambda x: re.sub(r'[\s\u00a0]+', '', emo(x))   # 이모지는 리뉴얼에서 지우므로 대조에서 뺀다(비율은 원본 이모지까지 센 보수값)
N = norm(n)
# 글 조각은 원본 텍스트 노드 단위로 나눈 뒤 문장으로(머리글처럼 노드 여러 개가 한 덩어리로 묶이는 오탐 방지)
segs = [x for node in on for x in re.split(r'(?<=[.!?다요])\s+|\n', node) if len(norm(x)) >= 8]
miss = [x.strip() for x in segs if norm(x) not in N]
print(f'{cnt(n) / cnt(o) * 100:.1f}% ({cnt(o)}→{cnt(n)}) 누락 {len(miss)}' + (': ' + ' / '.join(m[:40] for m in miss[:6]) if miss else ''))

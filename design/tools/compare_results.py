"""전/후 결과 비교. 사용: python3 -I compare_results.py BEFORE.json AFTER.json [접두어] [--noemoji] [--expect N]
--expect N: 대조한 계산기 수가 N이 아니거나(빠진 계산기 포함) 불일치가 있으면 종료코드 1. 카테고리별 대조 수/일치 수 표를 함께 출력.
전체 기준(2026-10-20): results/expected_102.json = dti·pyeong 제외 102개(after.json 84 + re_after.json 부동산 17 + LLM 비교표 원문)"""
import json, sys, re, collections
a = json.load(open(sys.argv[1], encoding='utf-8')); b = json.load(open(sys.argv[2], encoding='utf-8'))
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
_skip = {sys.argv.index('--expect') + 1} if '--expect' in sys.argv else set()   # --expect 다음 숫자는 접두어가 아님
_args = [x for i, x in enumerate(sys.argv) if i >= 3 and i not in _skip and not x.startswith('--')]
pre = _args[0] if _args else ''
def core(t):
    t = re.split(r'이어서 계산하기|결과 복사|값을 입력하면 계산됩니다', t or '')[0]
    if '--noemoji' in sys.argv:   # 이모지 제거 전후 비교: 양쪽에서 이모지만 빼고 본다
        from strip_emoji import SEQ, KEEP
        t = SEQ.sub(lambda m: m.group(0) if m.group(0) in KEEP else '', t).replace('\uFE0F', '')
    return re.sub(r'\s+', '', t)
def ok(k, c):
    """보통은 core 글자 그대로. 기대값에 c+'_compare' == 'numbers'면 기대(main) 결과의 숫자가 결과에 모두 있는지(표시 위치가 바뀐 경우)"""
    if a[k].get(c + '_compare') == 'numbers':
        nums = lambda t: collections.Counter(re.findall(r'\d[\d,.]*', core(t)))
        return not (nums(a[k][c]) - nums(b[k][c]))
    return core(a[k][c]) == core(b[k][c])
bad = 0
for k in b:
    if not k.startswith(pre) or k not in a: continue
    r = [('일치' if ok(k, c) else '불일치') for c in 'ab']
    empty = [c for c in 'ab' if not core(a[k][c])]
    print(k, r, '오류', len(b[k]['errors']), ('(원본 결과 빈 케이스: ' + ','.join(empty) + ')') if empty else '')
    for c in 'ab':
        if not ok(k, c):
            bad += 1; print('   전', core(a[k][c])[:180], '\n   후', core(b[k][c])[:180])
print('불일치', bad)
if '--expect' in sys.argv:
    import collections
    n = int(sys.argv[sys.argv.index('--expect') + 1])
    keys = [k for k in a if k.startswith(pre)]
    done = [k for k in keys if k in b]; miss = [k for k in keys if k not in b]
    cnt, okc = collections.Counter(), collections.Counter()
    for k in done:
        c = k.split('/')[0]; cnt[c] += 1
        if all(ok(k, x) for x in 'ab'): okc[c] += 1
    print('\n| 카테고리 | 대조 | 일치 |\n|---|---|---|')
    for c in sorted(cnt): print(f'| {c} | {cnt[c]} | {okc[c]} |')
    print(f'| 합계 | {len(done)} | {sum(okc.values())} |')
    if miss: print('대조 못 한 계산기', miss)
    if len(done) != n or bad or miss:
        print(f'실패: 기대 {n}개, 대조 {len(done)}개, 불일치 {bad}건'); sys.exit(1)
    print(f'통과: {n}개 전부 대조·일치')

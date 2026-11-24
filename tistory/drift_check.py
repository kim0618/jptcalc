#!/usr/bin/env python3
"""계산기 대조: 각 글의 캡처 입력값(caps/setup/tNNN.js)을 지금 배포된 계산기에 다시 넣어,
저장해 둔 기준값(caps/baseline.json)과 결과가 달라진 글만 보여 준다.

사용:
  python3 drift_check.py                 # 전체 글 대조
  python3 drift_check.py salary/take-home-pay   # 그 계산기를 쓰는 글만
  python3 drift_check.py t004 t012       # 특정 글만
  python3 drift_check.py --save [대상]   # 지금 결과를 기준값으로 저장(검증 끝난 뒤에만)

계산기를 고쳐 배포한 뒤 돌린다. 달라진 글은 /tistory-verify 최종 통합 검증 → 고침 → /tistory-publish --update.
"""
import json, os, re, subprocess, sys, glob

DIR = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(DIR, 'caps', 'baseline.json')
ENV = dict(os.environ, LD_LIBRARY_PATH=os.path.expanduser('~/.local/emulib'))


def posts():
    out = []
    for setup in sorted(glob.glob(os.path.join(DIR, 'caps', 'setup', 't*.js'))):
        t = os.path.basename(setup)[:-3]
        p = glob.glob(os.path.join(DIR, 'posts', f'{t}-*.html'))
        if not p:
            continue
        m = re.search(r'jptcalc\.kr/calc/([a-z0-9/-]+?)/?[?"]', open(p[0], encoding='utf-8').read())
        if m:
            out.append((t, m.group(1), setup))
    return out


def run(calc, setup):
    r = subprocess.run(['node', 'run.mjs', calc, setup], cwd=DIR, env=ENV,
                       capture_output=True, text=True, timeout=120)
    lines = [l for l in r.stdout.strip().splitlines() if l.strip()]
    out = lines[-1] if lines else ('오류: ' + r.stderr.strip()[-200:])
    # 날마다 바뀌는 표시(오늘 기준 남은 날)는 비교에서 뺀다
    return re.sub(r'오늘로부터 \d[\d,]*일 (후|전)|오늘', '(오늘 기준)', out)


def main():
    args = sys.argv[1:]
    save = '--save' in args
    args = [a for a in args if a != '--save']
    items = posts()
    if args:
        items = [x for x in items if x[0] in args or x[1] in args or x[1].startswith(tuple(args))]
    base = json.load(open(BASE, encoding='utf-8')) if os.path.exists(BASE) else {}
    changed = 0
    for t, calc, setup in items:
        now = run(calc, setup)
        if save:
            base[t] = {'calc': calc, 'result': now}
            print(f'{t} 저장 ({calc})')
            continue
        old = base.get(t, {}).get('result')
        if old is None:
            print(f'{t} 기준값 없음 ({calc}) → 지금: {now[:150]}')
            changed += 1
        elif old != now:
            print(f'✕ {t} 달라짐 ({calc})\n   전: {old[:200]}\n   후: {now[:200]}')
            changed += 1
        else:
            print(f'  {t} 같음 ({calc})')
    if save:
        json.dump(base, open(BASE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'기준값 {len(items)}편 저장: {BASE}')
    else:
        print(f'\n{len(items)}편 중 달라진 글 {changed}편' + (' → 해당 글만 /tistory-verify 후 --update' if changed else ''))
        sys.exit(1 if changed else 0)


if __name__ == '__main__':
    main()

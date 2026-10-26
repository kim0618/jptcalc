"""탭 없는 카테고리 계획 자동 생성: 원본 허브 그룹 제목·순서 그대로, 이어서 계산 = 같은 그룹 이웃 2개(모자라면 다른 그룹 앞에서).
값 넘기기는 넣지 않는다(필요하면 plan.json에서 carry 추가). 사용: python3 -I design/tools/auto_plan.py CAT"""
import json, os, re, sys
T = os.path.dirname(os.path.abspath(__file__)); cat = sys.argv[1]
s = open(os.path.join(T, 'orig', cat, '_hub.html'), encoding='utf-8').read()
groups = []
for i, g in enumerate(re.finditer(r'class="calc-hub-group-title">(.*?)</div>(.*?)(?=class="calc-hub-group-title"|<!-- |</main>)', s, re.S)):
    slugs = list(dict.fromkeys(re.findall(r'href="/calc/' + cat + r'/([a-z0-9-]+)/"', g.group(2))))
    groups.append([f'g{i + 1}', re.sub(r'<[^>]+>', '', g.group(1)).strip(), '', slugs])
allc = [x for g in groups for x in g[3]]
pages = {}
for g in groups:
    for x in g[3]:
        nb = [y for y in g[3] if y != x] + [y for y in allc if y not in g[3]]
        pages[x] = {'next': [{'to': y} for y in nb[:2]]}
p = json.load(open(os.path.join(T, 'plan.json'), encoding='utf-8'))
p[cat] = {'tabs': False, 'groups': groups, 'pages': pages}
json.dump(p, open(os.path.join(T, 'plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(cat, [(g[1], g[3]) for g in groups])

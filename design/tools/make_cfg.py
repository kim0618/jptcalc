"""카테고리 설정 생성: 이어서 계산 카드(같은 그룹 이웃, 같은 뜻의 값만 넘김) + 받는 칸(data-prefill).
사용: python3 -I design/tools/make_cfg.py CAT  (design/tools/plan.json 의 CAT 항목을 읽어 conv_cfg.json 갱신)"""
import json, os, re, sys
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
cat = sys.argv[1]
plan = json.load(open(os.path.join(T, 'plan.json'), encoding='utf-8'))[cat]
hub = open(os.path.join(T, 'orig', cat, '_hub.html') if os.path.exists(os.path.join(T, 'orig', cat, '_hub.html')) else os.path.join(SITE, 'calc', cat, 'index.html'), encoding='utf-8').read()
desc = {m[0]: (m[1], m[2]) for m in re.findall(r'<a class="calc-hub-card" href="/calc/' + cat + r'/([a-z0-9-]+)/">.*?<div class="calc-hub-name">(.*?)</div>\s*<div class="calc-hub-desc">(.*?)</div>', hub, re.S)}
cfg = json.load(open(os.path.join(T, 'conv_cfg.json'), encoding='utf-8')) if os.path.exists(os.path.join(T, 'conv_cfg.json')) else {}
for slug, spec in plan['pages'].items():
    nx = []
    for n in spec['next']:
        tgt = n['to']; nm, ds = desc.get(tgt, (tgt, ''))
        item = {'key': tgt, 'path': f'/calc/{cat}/{tgt}/', 'title': nm if nm.endswith(('계산기', '변환기', '세기')) else nm + ('기' if nm.endswith('계산') else ' 계산기'), 'sub': ds}
        if n.get('carry'): item['params'] = n['carry']
        nx.append(item)
    c = cfg.get(f'{cat}/{slug}', {})
    c['next'] = nx
    first = nx[0]
    pn = desc.get(first['key'], (first['key'],))[0]
    c['primary'] = [pn[:-1] if pn.endswith(('계산기', '변환기')) else pn if pn.endswith(('계산', '세기')) else pn + ' 계산', first['path']] + ([first['params']] if first.get('params') else [])
    if spec.get('prefill'): c['prefill'] = spec['prefill']
    if spec.get('required'): c['required'] = spec['required']
    if spec.get('static'): c['static_card'] = True
    if spec.get('table'): c['table_card'] = True
    cfg[f'{cat}/{slug}'] = c
json.dump(cfg, open(os.path.join(T, 'conv_cfg.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(cat, len(plan['pages']), '개 설정')

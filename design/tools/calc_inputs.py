"""계산기 대표 입력 2세트(a·b)를 넣고 결과 글자를 읽는 공용 부품(2026-10-21 baseline_auto.py에서 분리).
baseline_auto.py(결과 기록)와 click_audit.py(버튼 클릭 검사)가 같은 입력·같은 읽기를 쓰게 한다.
  a: 보이는 숫자 칸에 예시값, 날짜 칸 2024-03-15(두 번째부터 2026-10-19), 월 칸 2025-06
  b: 첫 선택 묶음의 두 번째 버튼을 누른 뒤 예시값 ×2 (날짜는 2023-07-01 / 2026-01-31)
  cases.json에 페이지별 수동 케이스가 있으면 그것을 쓴다."""
import os, json, re
TOOLS = os.path.dirname(os.path.abspath(__file__))
MANUAL = json.load(open(os.path.join(TOOLS, 'cases.json'), encoding='utf-8')) if os.path.exists(os.path.join(TOOLS, 'cases.json')) else {}
BLOCK = ('googlesyndication', 'googletagmanager', 'google-analytics', 'kakao', 'adfit', 'doubleclick', 'html2canvas')
FILL = r"""(mode) => {
  const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', {bubbles: true})); el.dispatchEvent(new Event('change', {bubbles: true})); };
  if (mode === 'b') { const g = document.querySelector('main .seg-group, .ds-calc .seg-group'); const bs = g ? g.querySelectorAll('.seg-btn') : []; if (bs[1]) bs[1].click(); }
  const ins = [...document.querySelectorAll('main input, main select, main textarea')].filter(e => e.offsetParent !== null && !e.closest('.ds-site-header, header, .ds-menu') && !e.classList.contains('ds-search-input'));
  let d = 0; const log = [];
  for (const el of ins) {
    const t = (el.type || '').toLowerCase();
    if (el.tagName === 'SELECT') { if (mode === 'b' && el.options.length > 1) { el.selectedIndex = 1; el.dispatchEvent(new Event('change', {bubbles: true})); log.push(el.id + '=#1'); } continue; }
    if (t === 'checkbox' || t === 'radio' || t === 'button' || t === 'hidden') continue;
    if (t === 'date') { const v = mode === 'a' ? (d++ ? '2026-10-19' : '2024-03-15') : (d++ ? '2026-01-31' : '2023-07-01'); set(el, v); log.push(el.id + '=' + v); continue; }
    if (t === 'month') { set(el, mode === 'a' ? '2025-06' : '2024-11'); log.push(el.id + '=month'); continue; }
    const m = (el.placeholder || '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    if (!m) { if (el.tagName === 'TEXTAREA' || t === 'text') { if (!el.hasAttribute('data-ds-num')) { set(el, mode === 'a' ? '제이퍼 계산기 글자수 테스트 문장입니다.' : '두 번째 케이스'); log.push(el.id + '=text'); } } continue; }
    let v = parseFloat(m[0]); if (mode === 'b') v = Math.round(v * 2 * 100) / 100;
    if (el.value !== '' && mode === 'a' && el.defaultValue) { log.push(el.id + '=기본값'); continue; }
    set(el, String(v)); log.push(el.id + '=' + v);
  }
  return log;
}"""
READ = r"""() => { const cards = [...document.querySelectorAll('.result-card, [id$="-result"], #resultCard, #result')].filter(e => !e.id.startsWith('ds-'));
  const seen = new Set(); return cards.filter(e => { if (seen.has(e)) return false; for (const s of seen) if (s.contains(e)) return false; seen.add(e); return true; })
    .map(e => e.innerText).join(' | ').replace(/\s+/g, ' ').trim() || ((document.querySelector('.ds-calc-table table, main table') || {}).innerText || '').replace(/\s+/g, ' ').trim(); }"""   # 결과 카드 없는 표 계산기(LLM 비교표)는 본문 첫 표
# 계산 버튼 누르기: 원본 '계산' 버튼이 있으면 그것, 없으면 공용 계산 버튼(.ds-btn-calc, 10/21 수정 전에는 onclick이 깨져 뺐다)
ORIG_BTN = "() => { const vis = x => x.offsetParent !== null; const b = [...document.querySelectorAll('main button')].find(x => /계산하기|계산$|변환하기|확인하기/.test(x.textContent.trim()) && !x.classList.contains('ds-btn-calc') && vis(x)) || [...document.querySelectorAll('main .ds-btn-calc')].find(vis); if (b) b.click(); }"


def now_script(now):
    """날짜 고정(예: 2026-10-19T12:00:00+09:00): '오늘' 기준 결과(D-day·나이)를 다른 날 잰 결과와 대조할 때"""
    return "(()=>{const O=Date,off=new O(%s).getTime()-O.now();class D extends O{constructor(...a){a.length?super(...a):super(O.now()+off)}static now(){return O.now()+off}}window.Date=D})()" % json.dumps(now)


def fill(pg, key, name):
    """케이스 name(a|b) 입력. 수동 케이스면 'manual', 아니면 FILL 기록을 돌려준다."""
    man = MANUAL.get(key, {}).get(name)
    if man:
        for step in man:
            if step[0] == 'click': pg.evaluate("s => document.querySelector(s).click()", step[1])
            else: pg.evaluate("([s, v]) => { const el = document.querySelector(s); if (el._flatpickr) { el._flatpickr.setDate(v, true); return; } el.value = v; el.dispatchEvent(new Event('input', {bubbles: true})); el.dispatchEvent(new Event('change', {bubbles: true})); }", [step[1], step[2]])
            pg.wait_for_timeout(60)
        return 'manual'
    return pg.evaluate(FILL, name)


def core(t):
    """결과 비교용: 결과 뒤의 버튼·안내 글자를 떼고 공백을 모두 지운다(compare_results.py와 같은 규칙)"""
    t = re.split(r'이어서 계산하기|결과 복사|값을 입력하면 계산됩니다', t or '')[0]
    return re.sub(r'\s+', '', t)


def same(exp, name, got):
    """기대값 대조. 보통은 core 글자 그대로, exp[name+'_compare'] == 'numbers'면 기대(main) 결과의 숫자가 작업본 결과에 모두 있는지
    (표시 위치가 바뀐 경우, 10/21 양도소득세 비과세: main은 배너, 작업본은 결과 카드)"""
    if exp.get(name + '_compare') == 'numbers':
        import collections
        nums = lambda t: collections.Counter(re.findall(r'\d[\d,.]*', core(t)))
        return not (nums(exp[name]) - nums(got))
    return core(got) == core(exp[name])

/* ================================================
   /assets/ds/prefill.js
   다른 계산기에서 넘어온 입력값을 자동 입력한다(design/brief.md v3 '이어서 계산', 시안 B3).
   예: /calc/realestate/dsr/?income=5000&mortgage=1500&from=dti
   대상 입력칸에 data-prefill="income" 처럼 이름을 달아 두면 같은 이름의 쿼리 값을 넣고
   input 이벤트를 보내 그 페이지의 계산을 그대로 돌린다. 경로·canonical은 바뀌지 않는다.
   숫자만 받는다(최대 9자리).
   B3: 입력 카드 위 안내 띠("DTI 계산기에서 2개 값을 가져왔어요" + 지우기),
       가져온 칸마다 "가져옴" 배지(사용자가 그 칸을 고치면 사라짐). "지우기"는 가져온 값만 비운다.
   ================================================ */
(function () {
  'use strict';
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { return; }
  if (!params || !Array.from(params.keys()).length) return;

  // 보낸 계산기 이름: from 파라미터 → 없으면 referrer 경로 → 없으면 일반 문구
  var NAMES = { dti: 'DTI 계산기', dsr: 'DSR 계산기', ltv: 'LTV 계산기', didimdol: '디딤돌대출 계산기', loan: '대출이자 계산기', acquisition: '취득세 계산기', acq: '취득세 계산기',
    brokerage: '중개수수료 계산기', registry: '등기비용 계산기', rental: '임대수익률 계산기', didimdol: '디딤돌대출 계산기',
    joint: '공동명의 계산기', jongbu: '종합부동산세 계산기', 'property-tax-comprehensive': '재산세 종합 계산기', propertytax: '재산세 계산기',
    // 부동산 밖에서 값을 보내는 계산기(10/27, 빠져 있어 '이전 계산기'로 나오던 것). 이름은 각 페이지 h1
    compound: '복리 계산기', deposit: '예금 이자 계산기', 'jangbyeong-savings': '장병내일준비적금 계산기', savings: '적금 만기금액 계산기',
    'youth-future-savings': '청년미래적금 계산기', 'youth-leap-account': '청년도약계좌 계산기', 'annual-leave-pay': '연차수당 계산기',
    comparison: '연봉 비교 계산기', 'hourly-wage': '시급·일급 변환 계산기', 'job-change': '이직 연봉 비교 계산기', 'raise-rate': '연봉 인상률 계산기',
    severance: '퇴직금 계산기', 'take-home-pay': '연봉 실수령액 계산기', 'four-insurance': '4대보험료 계산기', 'insurance-comparison': '4대보험 vs 3.3% 비교 계산기' };
  function sourceName() {
    var f = params.get('from');
    if (f && NAMES[f]) return NAMES[f];
    // 홈 상황 시트(A2)에서 온 값: from=sit-{상황 id} (이름은 design/situations.json과 같게)
    var SIT = {"buy-home": "집 살 때", "rent-home": "전세·월세 구할 때", "home-loan": "주택 대출 알아볼 때", "sell-home": "집 팔 때·물려줄 때", "own-home": "집 보유 세금", "job-change": "이직·연봉 협상", "pay-check": "월급·보너스 확인", "quit-job": "퇴사할 때", "freelancer": "프리랜서·부업 세금", "pregnancy": "임신·출산 준비", "child-care": "아이 키울 때", "retirement": "노후·부모님 준비", "buy-car": "차 살 때", "save-money": "목돈 모을 때", "adopt-pet": "반려동물 입양"};
    if (f && /^sit-/.test(f) && SIT[f.slice(4)]) return "홈 '" + SIT[f.slice(4)] + "'";
    var m = document.referrer && document.referrer.match(/\/calc\/[^/]+\/([^/?#]+)\//);
    return m && NAMES[m[1]] ? NAMES[m[1]] : '이전 계산기';
  }

  var CSS =
    '.ds-prefill-note{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:4px 6px 4px 14px;min-height:52px;box-sizing:border-box;' +
      'border-radius:var(--radius-md,12px);background:var(--pf-tint,var(--primary-tint,#EFF5FF));border:1px solid color-mix(in srgb,var(--blue,#1572F9) 22%,transparent);' +
      'color:var(--text,#1F2A44);font-size:14px;font-weight:600;line-height:1.4}' +
    '.ds-prefill-note>svg{width:18px;height:18px;flex-shrink:0;fill:none;stroke:var(--blue,#1572F9);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.ds-prefill-note span{flex:1;min-width:0}' +
    '.ds-prefill-note button{flex-shrink:0;min-height:44px;padding:0 10px;border:0;background:none;color:var(--pf-primary,var(--primary,#0D63DC));font:inherit;font-weight:600;cursor:pointer}' +
    '.ds-prefill-badge{flex-shrink:0;align-self:center;margin-left:10px;padding:2px 8px;border-radius:6px;background:var(--pf-tint,var(--primary-tint,#EFF5FF));' +
      'color:var(--pf-primary,var(--primary,#0D63DC));font-size:12px;font-weight:600;line-height:1.5;white-space:nowrap}';

  function run() {
    var filled = [];
    document.querySelectorAll('[data-prefill]').forEach(function (el) {
      var raw = params.get(el.getAttribute('data-prefill'));
      if (raw == null || !/^\d{1,9}(\.\d{1,4})?$/.test(raw)) return;
      el.value = raw;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      filled.push(el);
    });
    if (!filled.length) return;
    // 리뉴얼 전 페이지는 --primary가 카테고리색(부동산=주황)이라, tokens.css가 없으면 브랜드 값을 직접 준다
    var hasTokens = !!getComputedStyle(document.documentElement).getPropertyValue('--navy').trim();
    var pfVars = hasTokens ? '' : '--pf-primary:#0D63DC;--pf-tint:#EFF5FF;';
    if (!document.getElementById('ds-prefill-style')) {
      var st = document.createElement('style'); st.id = 'ds-prefill-style'; st.textContent = CSS;
      document.head.appendChild(st);
    }

    // 칸마다 "가져옴" 배지
    filled.forEach(function (el) {
      el.setAttribute('data-prefilled', '');
      var badge = document.createElement('span');
      badge.className = 'ds-prefill-badge'; badge.textContent = '가져옴';
      if (pfVars) badge.setAttribute('style', pfVars);
      el.parentNode.insertBefore(badge, el);
      el._dsBadge = badge;
      // 사용자가 직접 고치면 배지를 뗀다(프로그램이 보낸 input 이벤트는 무시)
      el.addEventListener('input', function onEdit(e) {
        if (!e.isTrusted) return;
        unmark(el); el.removeEventListener('input', onEdit);
      });
    });
    function unmark(el) {
      el.removeAttribute('data-prefilled');
      if (el._dsBadge) { el._dsBadge.remove(); el._dsBadge = null; }
      if (!document.querySelector('[data-prefilled]') && note.isConnected) note.remove();
    }

    // 안내 띠: 첫 입력 카드 위
    var note = document.createElement('div');
    note.className = 'ds-prefill-note';
    if (pfVars) note.setAttribute('style', pfVars);
    note.setAttribute('role', 'status');
    note.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' +
      '<span></span><button type="button">지우기</button>';
    note.querySelector('span').textContent = sourceName() + '에서 ' + filled.length + '개 값을 가져왔어요';
    note.querySelector('button').addEventListener('click', function () {
      // 가져온 값 중 사용자가 고치지 않은 칸만 비운다
      filled.forEach(function (el) {
        if (!el.hasAttribute('data-prefilled')) return;
        el.value = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        unmark(el);
      });
      if (note.isConnected) note.remove();
      filled[0].focus();
    });
    var anchor = filled[0].closest('.ds-input-card') || filled[0].closest('.card') || filled[0].closest('.field');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(note, anchor);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

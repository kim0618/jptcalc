/**
 * 시니어 혜택 진단 엔진
 * 규칙 원본: /assets/benefit-rules.js (window.BENEFIT_RULES)
 * 문구 규칙: window.BENEFIT_DECISION_COPY — decision_type이 문구를 강제한다.
 *
 * 이 파일은 규칙을 해석해 렌더링만 한다. 제도·연령·금액을 여기에 적지 말 것.
 * 값이 필요하면 benefit-rules.js에 넣고 여기서는 읽기만 한다.
 */
(function () {
  'use strict';

  var SIDO = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  // 판정 결과 분류 순서 (화면 표시 순서)
  var ORDER = ['direct', 'calculator', 'authority_review'];
  var GROUP_TITLE = {
    direct: '바로 이용할 수 있는 것',
    calculator: '더 확인해야 아는 것',
    authority_review: '신청해서 심사를 받아야 하는 것',
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* 한 제도를 입력값에 대해 판정한다.
     반환: null(해당 없음) 또는 {decision_type, name, copy, caution, cta, notes[]} */
  function evaluate(rule, input) {
    var age = input.age;
    var COPY = window.BENEFIT_DECISION_COPY;
    var notes = [];
    var type = rule.decision_type;
    var copy = rule.result_copy;
    var caution = rule.caution_copy;
    var cta = null;

    // 연령 하한. 단 exceptions에 "미만" 예외가 있으면 배제하지 않고 안내로 돌린다.
    if (rule.min_age != null && age < rule.min_age) {
      var hasUnderAge = (rule.exceptions || []).some(function (e) { return /미만/.test(e); });
      if (!hasUnderAge) return null;
      // 연령 미달인데 예외로 살아남은 경우, 조건을 문구 앞에 명시한다.
      // 그렇게 하지 않으면 조건 없이 대상인 것처럼 읽힌다.
      var underAgeNote = (rule.exceptions || []).filter(function (e) { return /미만/.test(e); })[0];
      notes.push(underAgeNote);
      copy = '만 ' + rule.min_age + '세 미만은 조건을 충족하는 경우에만 해당합니다. ' + copy;
    }
    if (rule.max_age != null && age > rule.max_age) return null;

    // 지역 예외. 값을 박지 않기로 한 지역은 확정 문구를 쓸 수 없다.
    if (rule.region_rule && rule.region_rule.exceptions && rule.region_rule.exceptions.length) {
      // 지역에 따라 기준이 갈리는 제도인데 지역을 모르면 확정할 수 없다.
      if (!input.region) {
        type = 'calculator';
        copy = '지역에 따라 기준이 다릅니다. 거주 지역을 선택하시면 정확히 알려 드립니다.';
        caution = null;
      }
      var ex = rule.region_rule.exceptions.filter(function (e) { return e.region === input.region; })[0];
      if (ex && ex.pin_value === false) {
        type = 'calculator'; // 확정 문구 금지 → "추가 확인이 필요합니다" 계열로 내린다
        copy = ex.notice;
        caution = null;
        cta = ex.link ? { label: '대구시 교통 안내에서 확인하기', href: ex.link, external: true } : null;
      }
    }

    // 자격 분기 (건강보험 자격 / 기초연금 수급 여부)
    if (rule.recipient_rule && rule.recipient_rule.branches) {
      var key = rule.recipient_rule.input;
      var branches = rule.recipient_rule.branches;

      if (key === 'health_insurance') {
        var b = branches[input.insurance];
        if (!b) {
          type = 'calculator';
          copy = '건강보험 자격에 따라 검진 주기가 달라집니다. 자격을 확인한 뒤 다시 진단해 보세요.';
        } else {
          copy = b.copy;
          notes.push('검진 주기: ' + b.cycle);
        }
      }

      if (key === 'basic_pension_recipient') {
        var eligible = [];
        Object.keys(branches).forEach(function (nm) {
          var br = branches[nm];
          if (age < br.min_age) return;
          if (br.requires === '기초연금 수급자') {
            // '모름'을 '아니오'로 취급하면 해당될 수도 있는 제도를 빼앗는다.
            if (input.basicPension === 'no') return;
            if (input.basicPension !== 'yes') {
              eligible.push(nm + '(만 ' + br.min_age + '세 이상, 기초연금 수급 시)');
              return;
            }
          }
          eligible.push(nm + '(만 ' + br.min_age + '세 이상)');
        });
        if (!eligible.length) return null;
        notes.push('신청 가능한 사업: ' + eligible.join(' · '));
      }
    }

    // 이미 받고 있는 혜택은 계산을 권하지 않는다
    if (rule.benefit_id === 'basic_pension' && input.basicPension === 'yes') {
      copy = '이미 기초연금을 받고 계시다면 금액이 맞는지 계산기로 확인해 볼 수 있습니다.';
    }

    if (!cta && rule.cta_type === 'calculator' && rule.cta_target) {
      cta = { label: rule.name + ' 계산기로 확인하기', href: rule.cta_target, external: false };
    }

    // 문구 규칙 강제: direct가 아니면 확정 표현을 쓸 수 없다
    var spec = COPY[type];
    if (type !== 'direct' && /받을 수 있습니다/.test(copy || '')) {
      copy = rule.name + '은(는) ' + spec.verb + '.';
    }
    if (spec.requires_authority && !rule.authority) return null; // 판정주체 없으면 렌더 금지

    var guide = rule.guide_url
      ? { label: rule.guide_label || '자세히 보기', href: rule.guide_url }
      : null;

    return {
      id: rule.benefit_id,
      decision_type: type,
      guide: guide,
      name: rule.name,
      copy: copy,
      caution: caution,
      authority: spec.requires_authority ? rule.authority : null,
      notes: notes,
      cta: cta,
    };
  }

  function renderForm(el) {
    el.innerHTML =
      '<div class="hub-section-label">부모님 혜택 진단</div>' +
      '<div class="bf-panel">' +
      '<p class="bf-lead">나이와 몇 가지 조건을 넣으면 <b>' +
        esc((window.BENEFIT_RULES || []).map(function (r) {
          return r.short_name || r.name;
        }).join(' · ')) +
        '</b> 가운데 해당되는 것을 골라 드립니다.</p>' +
      '<form class="bf-form" id="bfForm">' +
        '<label class="bf-field"><span>나이</span>' +
          '<input type="number" id="bfAge" min="50" max="120" inputmode="numeric" placeholder="예: 68" required></label>' +
        '<label class="bf-field"><span>거주 지역</span><select id="bfRegion">' +
          '<option value="">선택하세요</option>' +
          SIDO.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') +
        '</select></label>' +
        '<label class="bf-field"><span>기초연금을 받고 계신가요?</span><select id="bfBasic">' +
          '<option value="unknown">잘 모르겠어요</option>' +
          '<option value="yes">받고 있어요</option>' +
          '<option value="no">받지 않아요</option>' +
        '</select></label>' +
        '<label class="bf-field"><span>건강보험 자격</span><select id="bfIns">' +
          '<option value="">잘 모르겠어요</option>' +
          '<option value="insured">건강보험 가입자 또는 피부양자</option>' +
          '<option value="insured_worker_nonoffice">직장가입자(사무직 아님)</option>' +
          '<option value="medicaid">의료급여 수급권자</option>' +
        '</select></label>' +
        '<button type="submit" class="bf-submit">혜택 확인하기</button>' +
      '</form>' +
      '</div>' +
      '<div id="bfResult" class="bf-result" hidden></div>';

    el.querySelector('#bfForm').addEventListener('submit', function (e) {
      e.preventDefault();
      run(el);
    });
  }

  function run(el) {
    var age = parseInt(el.querySelector('#bfAge').value, 10);
    if (!age || age < 50 || age > 120) {
      alert('나이를 50에서 120 사이로 입력해 주세요.');
      return;
    }
    var input = {
      age: age,
      region: el.querySelector('#bfRegion').value,
      basicPension: el.querySelector('#bfBasic').value,
      insurance: el.querySelector('#bfIns').value,
    };

    var results = (window.BENEFIT_RULES || [])
      .map(function (r) { return evaluate(r, input); })
      .filter(Boolean);

    var box = el.querySelector('#bfResult');
    box.hidden = false;

    if (!results.length) {
      box.innerHTML = '<p class="bf-empty">입력하신 조건으로는 안내할 제도를 찾지 못했습니다. ' +
        '나이나 자격을 다시 확인해 보세요.</p>';
      return;
    }

    var html = '<div class="bf-summary">만 ' + age + '세 기준으로 ' + results.length + '개를 찾았습니다.</div>';
    ORDER.forEach(function (t) {
      var group = results.filter(function (r) { return r.decision_type === t; });
      if (!group.length) return;
      html += '<div class="bf-group bf-' + t + '">' +
        '<div class="bf-group-title">' + GROUP_TITLE[t] + '</div>';
      group.forEach(function (r) {
        html += '<div class="bf-card">' +
          '<div class="bf-name">' + esc(r.name) + '</div>' +
          '<p class="bf-copy">' + esc(r.copy) + '</p>';
        if (r.authority) html += '<p class="bf-authority">판정 기관: ' + esc(r.authority) + '</p>';
        r.notes.forEach(function (n) { html += '<p class="bf-note">' + esc(n) + '</p>'; });
        if (r.caution) html += '<p class="bf-caution">' + esc(r.caution) + '</p>';
        if (r.cta || r.guide) {
          html += '<div class="bf-actions">';
          if (r.cta) {
            html += '<a class="bf-cta" href="' + esc(r.cta.href) + '"' +
              (r.cta.external ? ' target="_blank" rel="noopener"' : '') + '>' + esc(r.cta.label) + '</a>';
          }
          if (r.guide) {
            html += '<a class="bf-guide" href="' + esc(r.guide.href) + '" target="_blank" rel="noopener">' +
              esc(r.guide.label) + ' &#8599;</a>';
          }
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    });

    html += '<p class="bf-disclaimer">이 진단은 공개된 법령과 정부 안내를 기준으로 한 참고용입니다. ' +
      '최종 자격은 각 기관의 확인이 필요합니다. 기준 확인일 ' +
      esc(window.BENEFIT_RULES_UPDATED || '') + '.</p>';

    box.innerHTML = html;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function init() {
    var el = document.getElementById('sec-guide');
    if (!el || !window.BENEFIT_RULES) return;
    renderForm(el);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

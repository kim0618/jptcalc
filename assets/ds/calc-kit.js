/* ================================================
   /assets/ds/calc-kit.js — 계산기 페이지 전용 공통 부품 (base.css 3구역과 짝)
   계산기 페이지에서만, 페이지 계산 스크립트보다 먼저 로드한다. 계산 로직은 각 페이지에 두고,
   여기는 "값 읽기 · 판정 · 결과 카드 그리기 · 이어서 계산 · 결과 복사 · 표 강조"만 맡는다.

   쓰는 법(요약)
     DSCalc.num('dti-income')                       콤마를 뺀 숫자(빈칸은 0)
     DSCalc.verdict(34, 40)                         {cls, icon, text}  한도 이내 / 주의(한도까지 5%p 이내) / 한도 초과
     DSCalc.result({...})                           결과 카드 HTML (아래 result 주석)
     DSCalc.link('/calc/realestate/dsr/', {income: 5000}, 'dti')   값 넘기는 링크(prefill.js가 받음)
     DSCalc.next('#dti-next', {dsr: {href, title, sub}, ...})      이어서 계산 카드 문구·링크 갱신
     DSCalc.copy('dti-result')                      calc-result-tools.js의 '복사'를 대신 누름(중복 버튼은 숨김)
     DSCalc.tableNear('#dti-limit-table', 5000, 1)  가까운 행(data-income)·선택 열 강조
   ================================================ */
(function () {
  'use strict';

  function num(idOrEl) {
    var el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    return el ? parseFloat(String(el.value).replace(/,/g, '')) || 0 : 0;
  }

  function icon(n) { return window.DS ? DS.icon(n, 'ds-i-sm') : ''; }

  // 이어서 계산 카드 문구: 실제로 넘기는 칸 이름으로 "공시가격을 가져옵니다"(10/27, 이전 문구 '입력값을 그대로'는 일부만 넘기는데도 전부처럼 읽혔다)
  // 칸 이름 = 입력칸이 속한 .field의 .field-label 맨 앞 글자(맨 앞이 태그면 그 태그 글자)에서 괄호를 뺀 것. 단위·보조 안내는 뒤에 붙어 있어 빠진다. 못 찾으면 '입력값'
  function carryName(id) {
    var el = document.getElementById(id), f = el && el.closest('.field'), l = f && f.querySelector('.field-label');
    if (!l) return '';
    var t = l.firstChild && l.firstChild.nodeType === 3 && l.firstChild.nodeValue.trim() ? l.firstChild.nodeValue : (l.firstElementChild ? l.firstElementChild.textContent : '');
    return t.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  }
  function carryText(ids) {
    var names = ids.map(carryName).filter(function (t, i, a) { return t && a.indexOf(t) === i; });
    var t = names.length && names.length === ids.length ? names.join('·') : '입력값';
    var code = t.charCodeAt(t.length - 1) - 0xAC00;
    var josa = code >= 0 && code <= 11171 ? (code % 28 ? '을' : '를') : '을(를)';
    return t + josa + ' 가져옵니다';
  }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 판정 3종 (brief 시안 검수 메모, 2026-10-16 확정): 값이 낮을수록 좋은 비율(DTI·DSR)
  function verdict(value, limit, warnGap) {
    var gap = warnGap == null ? 5 : warnGap;
    if (value > limit) return { cls: 'is-bad', icon: 'x', text: '한도 초과' };
    if (value > limit - gap) return { cls: 'is-warn', icon: 'circle-alert', text: '주의' };
    return { cls: 'is-ok', icon: 'check', text: '한도 이내' };
  }

  /* 결과 카드 HTML (시안 11·12). 필요한 칸만 넘기면 된다.
     o.label    결과 박스 위 작은 글자            o.value  큰 숫자(문자열, 단위 포함)
     o.verdict  verdict() 결과 → 배지·색 (없으면 배지 없음: LTV·취득세)
     o.gauge    {value, limit, label}  0~80%(넘으면 10% 단위로 늘림) 게이지 + 한도 세로선
     o.comp     {parts: [[값, 'm'|'o'|'r'], ...], legend: ['주담대 원리금', ...], aria}  구성 막대
     o.hint     박스 아래 빨간 안내 한 줄          o.rows  [[라벨, 값, true면 빨강], ...]
     o.note     원본 안내문(* ...)                 o.actions {copy: '카드 id', primary: {href, label}} */
  function result(o) {
    var v = o.verdict, h = '';
    h += '<div class="ds-rbox' + (v ? ' ' + v.cls : '') + '">';
    h += '<span class="ds-result-label">' + esc(o.label) + '</span>';
    h += '<div class="ds-rbox-main"><span class="ds-result-number">' + esc(o.value) + '</span>' +
      (v ? '<span class="ds-verdict ' + v.cls + '">' + icon(v.icon) + v.text + '</span>' : '') + '</div>';
    if (o.gauge) {
      var g = o.gauge, scale = Math.max(80, Math.ceil(g.value / 10) * 10);
      var pct = function (x) { return (Math.min(x, scale) / scale * 100).toFixed(2) + '%'; };
      h += '<div class="ds-gauge" role="img" aria-label="' + esc(g.aria || '') + '">' +
        '<span class="ds-gauge-fill" style="width:' + pct(g.value) + '"></span>' +
        '<span class="ds-gauge-tick" style="left:' + pct(g.limit) + '"><em>' + esc(g.label) + '</em></span></div>' +
        '<div class="ds-gauge-scale"><span>0%</span><span>' + scale + '%</span></div>';
    }
    if (o.comp) {
      var total = o.comp.parts.reduce(function (s, p) { return s + Math.max(p[0], 0); }, 0) || 1;
      h += '<div class="ds-comp" role="img" aria-label="' + esc(o.comp.aria || '') + '">' +
        o.comp.parts.map(function (p) { return '<span class="ds-comp-' + p[1] + '" style="width:' + (Math.max(p[0], 0) / total * 100).toFixed(2) + '%"></span>'; }).join('') +
        '</div><div class="ds-comp-legend">' +
        o.comp.legend.map(function (t, i) { return '<span><i class="ds-comp-' + o.comp.parts[i][1] + '"></i>' + esc(t) + '</span>'; }).join('') + '</div>';
    }
    h += '</div>';
    if (o.hint) h += '<p class="ds-over-hint">' + esc(o.hint) + '</p>';
    if (o.rows || o.note) {
      h += '<div class="ds-result-detail">' + (o.rows || []).map(function (r) {
        return '<div class="result-row"><span class="result-label">' + esc(r[0]) + '</span><span class="result-value' + (r[2] ? ' is-bad' : '') + '">' + esc(r[1]) + '</span></div>';
      }).join('') + (o.note ? '<div class="result-note">' + esc(o.note) + '</div>' : '') + '</div>';
    }
    if (o.actions) {
      h += '<div class="ds-result-actions">' +
        (o.actions.copy ? '<button type="button" class="ds-btn-outline" onclick="DSCalc.copy(\'' + o.actions.copy + '\')">' + icon('copy') + '결과 복사</button>' : '') +
        (o.actions.primary ? '<a class="ds-btn-primary" href="' + esc(o.actions.primary.href) + '">' + esc(o.actions.primary.label) + ' ' + icon('arrow-right') + '</a>' : '') +
        '</div>';
    }
    return h;
  }

  // 값 넘기는 링크: 0·빈 값은 빼고, 값이 하나라도 있으면 보낸 계산기(from)를 붙인다
  function link(path, params, from) {
    var q = new URLSearchParams();
    Object.keys(params || {}).forEach(function (k) { if (params[k] > 0) q.set(k, params[k]); });
    var s = q.toString();
    return path + (s ? '?' + s + (from ? '&from=' + from : '') : '');
  }

  // 이어서 계산 카드: 컨테이너 안 [data-next="key"] 카드의 링크·제목·보조 문구를 바꾼다
  function next(container, cards) {
    var root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return;
    Object.keys(cards).forEach(function (k) {
      var a = root.querySelector('[data-next="' + k + '"]'), c = cards[k];
      if (!a) return;
      if (c.href) a.href = c.href;
      if (c.title != null) a.querySelector('b').textContent = c.title;
      if (c.sub != null) a.querySelector('.ds-next-body span').textContent = c.sub;
      if (c.prefilled != null) a.dataset.prefilled = c.prefilled;
    });
  }

  // 결과 복사: calc-result-tools.js가 결과 카드 바로 뒤에 붙인 줄의 '복사'(기록·GA 포함)를 그대로 누른다.
  // 같은 버튼이 두 번 보이지 않게 그쪽 '복사'는 숨긴다(.ds-dup).
  function copyBtn(cardId) {
    var card = document.getElementById(cardId), row = card && card.nextElementSibling;
    if (!row || !row.classList.contains('action-row')) return null;
    var b = Array.prototype.find.call(row.querySelectorAll('button'), function (x) { return x.textContent.trim() === '복사'; });
    if (b) b.classList.add('ds-dup');
    return b;
  }
  function copy(cardId) { var b = copyBtn(cardId); if (b) b.click(); }

  // 표 강조(B4): 값에 가장 가까운 행(data-income) + 선택 열(머리칸 포함)
  function tableNear(table, value, col) {
    var t = typeof table === 'string' ? document.querySelector(table) : table;
    if (!t) return;
    var rows = Array.prototype.slice.call(t.querySelectorAll('tbody tr')), near = null;
    if (value > 0) near = rows.reduce(function (a, r) { return Math.abs(r.dataset.income - value) < Math.abs(a.dataset.income - value) ? r : a; }, rows[0]);
    t.querySelectorAll('thead th').forEach(function (th, i) { th.classList.toggle('is-col', i === col); });
    rows.forEach(function (r) {
      r.classList.toggle('is-near', r === near);
      Array.prototype.forEach.call(r.children, function (td, i) { td.classList.toggle('is-col', i === col); });
    });
  }

  // 결과 바(B2) 연결: 필수칸이 다 차야 값·판정을 보인다
  function bar(o) {
    if (!window.DS || !DS.resultBar) return;
    var req = o.required || [];
    var remaining = req.filter(function (el) { return !(num(el) > 0); }).length;
    DS.resultBar.set({
      started: o.started, remaining: remaining, required: req,
      label: o.label, value: remaining || o.value == null ? null : o.value,
      verdict: o.verdict ? o.verdict.text : (o.verdictText || ''),
      tone: o.verdict ? (o.verdict.cls === 'is-bad' ? 'bad' : o.verdict.cls === 'is-warn' ? 'warn' : 'ok') : 'ok',
      target: o.target, waitText: o.waitText
    });
  }

  // 작성·검토 정보(blog-article-info.js)와 신뢰성 정보(trust-block.js)는 각 스크립트가 늦게 그린다.
  // 나타나는 대로 계산 영역 아래 칸(colId)으로 옮긴다.
  function placeTrust(colId) {
    var col = document.getElementById(colId);
    if (!col) return;
    var place = function () {
      var ai = document.querySelector('.article-info'), tb = document.querySelector('.trust-block');
      if (ai && ai.parentElement !== col) col.prepend(ai);
      if (tb && tb.parentElement !== col) col.appendChild(tb);
      return ai && tb;
    };
    if (!place()) {
      var mo = new MutationObserver(function () { if (place()) mo.disconnect(); });
      mo.observe(document.body, { childList: true, subtree: true });
      window.addEventListener('load', place);
    }
  }

  /* 원본 계산 스크립트를 그대로 두는 페이지(감싸기 방식)용 자동 연결.
     결과 카드(.show)와 입력을 지켜보다가: 결과 바(B2) · 결과 복사 중복 숨김 · 이어서 계산 링크에 값 싣기.
     o = { card: 'id', required: ['id', ...], waitText, next: [{key, path, params: {쿼리이름: '입력 id'}, from, sub}] } */
  function auto(o) {
    var card = document.getElementById(o.card);
    if (!card) return;
    var inputs = function () { return Array.prototype.slice.call(document.querySelectorAll('.ds-input-card input')); };
    var started = false;
    var sync = function () {
      // 시작 = 사용자가 값을 바꿨을 때. 처음부터 들어 있는 기본값(예: 비과세 0)은 입력으로 세지 않는다
      if (!started) started = inputs().some(function (el) { return el.type !== 'checkbox' && el.type !== 'radio' && el.value && el.value !== el.defaultValue; });
      // 원본마다 결과를 보이는 방식이 다르다(.show 클래스 / 인라인 display): 실제로 그려졌는지로 판정
      var done = card.getClientRects().length > 0;
      // 주 결과: 원본 주 결과 상자(.rh-value) → 총계 줄 → 없으면 값 없이 "결과 보기"
      var tv = card.querySelector('.rh-value') || card.querySelector('.result-total-value'), tl = card.querySelector('.rh-label') || card.querySelector('.result-total-label');
      if (window.DS && DS.resultBar) {
        var req = (o.required || []).map(function (id) { return document.getElementById(id); }).filter(function (el) { return el && el.offsetParent !== null; });
        DS.resultBar.set({
          started: started, required: req, remaining: done ? 0 : Math.max(1, req.filter(function (el) { return !el.value; }).length),
          // 필수 칸은 다 찼는데 결과가 아직 없다 = 계산 버튼을 눌러야 하는 페이지: "N개 남음" 대신 "계산하기"
          ready: !done && !req.some(function (el) { return !el.value; }),
          label: tl ? tl.textContent.trim() : (o.label || '계산 결과'), value: done ? (tv ? tv.textContent.trim() : '') : null,
          verdict: '', tone: 'ok', target: card, waitText: o.waitText || '값을 입력하면 계산됩니다'
        });
      }
      if (done) copyBtn(o.card);
      // 입력칸이 하나도 안 보이는 모드(연금소득세 '공적연금' 안내 등)에서는 계산 버튼을 숨긴다(눌러도 할 일이 없다)
      var calcBtn = document.querySelector('.ds-input-card .ds-btn-calc');
      if (calcBtn) calcBtn.hidden = !Array.prototype.some.call(document.querySelectorAll('.ds-input-card input, .ds-input-card select, .ds-input-card textarea'), function (el) { return el.type !== 'hidden' && shown(el).offsetParent !== null || (el._flatpickr && shown(el).offsetParent !== null); });
      (o.next || []).forEach(function (n) {
        var vals = {};
        Object.keys(n.params || {}).forEach(function (k) { vals[k] = num(n.params[k]); });
        var carry = done && Object.keys(vals).some(function (k) { return vals[k] > 0; });
        var c = { href: carry ? link(n.path, vals, n.from) : n.path };
        if (n.params) c.sub = carry ? carryText(Object.keys(vals).filter(function (k) { return vals[k] > 0; }).map(function (k) { return n.params[k]; })) : n.sub;
        var x = {}; x[n.key] = c; next(o.nextBox || '.ds-calc-next .ds-next', x);
      });
    };
    new MutationObserver(sync).observe(card, { attributes: true, attributeFilter: ['class', 'style'], childList: true, subtree: true, characterData: true });
    document.addEventListener('input', function () { setTimeout(sync, 0); }, true);
    document.addEventListener('click', function () { setTimeout(sync, 0); }, true);
    sync();
  }

  // 날짜 칸(flatpickr)은 원래 input이 숨겨지고 보이는 칸이 따로 생긴다: 보이는 쪽으로
  function shown(el) { return (el && el._flatpickr && el._flatpickr.altInput) || el; }

  // 칸 이름: .field 안 .field-label 첫 글자 → <label for> → 칸 바로 앞 라벨 → aria-label
  function fieldName(el) {
    var f = shown(el);
    var prev = (f.closest('.input-wrap') || f).previousElementSibling;
    var lab = (f.closest('.field') && f.closest('.field').querySelector('.field-label')) || (el.id && document.querySelector('label[for="' + el.id + '"]')) || (prev && prev.matches('.field-label, label') ? prev : null);
    return lab ? (lab.firstChild && lab.firstChild.nodeType === 3 && lab.firstChild.nodeValue.trim() ? lab.firstChild.nodeValue : lab.textContent).trim() : (f.getAttribute('aria-label') || '');
  }

  /* 입력 안내(검증, 10/21 2차): 칸 테두리 빨강 + 안내 문구를 그 칸 바로 아래에. 포커스는 주지 않는다(모바일 키보드가 올라와
     안내를 가리던 것). noScroll이 아니면 그 칸을 화면 가운데로 스크롤. 칸에 입력을 시작하면 그 칸 안내만 사라진다 */
  function need(el, msg, noScroll) {
    var f = shown(el), name = fieldName(el);
    var box = f.closest('.ds-date-wrap') || f.closest('.input-wrap') || f;
    var hint = box.nextElementSibling && box.nextElementSibling.classList.contains('ds-calc-hint') ? box.nextElementSibling : null;
    if (!hint) {
      hint = document.createElement('p'); hint.className = 'ds-calc-hint'; hint.setAttribute('role', 'alert');
      hint.id = 'ds-hint-' + (el.id || Math.random().toString(36).slice(2, 8));
      box.parentNode.insertBefore(hint, box.nextSibling);
    }
    hint.innerHTML = icon('circle-alert') + '<span>' + esc(msg || (name ? '"' + name + '" 칸을 입력해 주세요.' : '빈 칸을 입력해 주세요.')) + '</span>';
    var wrap = f.closest('.input-wrap') || f;
    wrap.classList.add('is-invalid'); f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', hint.id);
    var clear = function () {
      wrap.classList.remove('is-invalid'); f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby');
      if (hint.parentNode) hint.parentNode.removeChild(hint);
      f.removeEventListener('input', clear); f.removeEventListener('change', clear); el.removeEventListener('change', clear);
    };
    f.addEventListener('input', clear); f.addEventListener('change', clear); el.addEventListener('change', clear);
    if (!noScroll) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  // 이전 안내 모두 지우기(다시 누를 때 지금 상태로만 안내)
  function clearNeeds(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('.ds-calc-hint'), function (h) { h.parentNode.removeChild(h); });
    Array.prototype.forEach.call((root || document).querySelectorAll('.is-invalid'), function (b) { b.classList.remove('is-invalid'); });
    Array.prototype.forEach.call((root || document).querySelectorAll('[aria-invalid="true"]'), function (x) { x.removeAttribute('aria-invalid'); });
  }

  /* 필수칸 목록(data-required, 쉼표로 구분): 항목은 입력 id 또는 CSS 선택자(.g-credit 등, 보이는 첫 칸).
     "a|b|c"는 묶음: 그중 한 칸 이상 입력해야 한다(날짜 더하기의 년·월·일 등). 빈 칸(또는 묶음)을 돌려준다 */
  function pick(t) {
    if (!/^[.#\[]|\s/.test(t)) return document.getElementById(t);
    return Array.prototype.find.call(document.querySelectorAll(t), function (e) { return shown(e).offsetParent !== null; });
  }
  // 빈 칸 = 값 없음. 묶음에서는 미리 채워 둔 기본값(날짜 더하기의 0 등)을 건드리지 않은 칸도 빈 칸(직접 넣은 0은 입력으로 본다)
  function blank(el, inGroup) { var v = String(el.value).trim(); return !v || (inGroup && el.defaultValue !== '' && el.value === el.defaultValue); }
  function missing(required) {
    var out = [];
    for (var i = 0; i < required.length; i++) {
      var group = required[i].indexOf('|') >= 0;
      var els = required[i].split('|').map(pick).filter(function (el) { return el && shown(el).offsetParent !== null; });
      if (els.length && els.every(function (el) { return blank(el, group); })) out.push({ el: els[0], els: els, group: group });
    }
    return out;
  }

  // 범위 안내 문구(HTML min·max): 계산했는데 결과가 안 보일 때 범위를 벗어난 칸을 알려 준다
  function rangeMsg(el) {
    var name = fieldName(el), lo = el.getAttribute('min'), hi = el.getAttribute('max');
    var r = lo && hi ? lo + '~' + hi + ' 사이로' : lo ? lo + ' 이상으로' : hi + ' 이하로';
    return (name ? '"' + name + '" 칸은 ' : '') + r + ' 입력해 주세요.';
  }

  /* 계산 함수 부르기. 모드마다 입력칸과 계산 함수가 다른 페이지(시급 계산기의 연봉/시급 등): 버튼 함수가 입력칸 함수인데
     지금 보이는 칸들은 다른 함수를 쓰면, 보이는 칸(값 있는 것 먼저)의 입력 이벤트를 다시 일으켜 그 모드의 계산을 돌린다(10/21) */
  function handler(el) { var m = /^\s*([A-Za-z_]\w*)\(/.exec(el.getAttribute('oninput') || el.getAttribute('onchange') || ''); return m && m[1]; }
  function run(fnName, btn) {
    var box = btn && btn.closest('.ds-input-card');
    var ins = box ? Array.prototype.filter.call(box.querySelectorAll('input, select, textarea'), handler) : [];
    var vis = ins.filter(function (el) { return shown(el).offsetParent !== null; });
    var own = ins.some(function (el) { return handler(el) === fnName; });
    if (own && vis.length && !vis.some(function (el) { return handler(el) === fnName; })) {
      var src = vis.filter(function (el) { return !blank(el); })[0] || vis[0];
      src.dispatchEvent(new Event(src.getAttribute('oninput') ? 'input' : 'change', { bubbles: true }));
      return;
    }
    if (typeof window[fnName] === 'function') window[fnName]();
  }

  // "계산하기" 버튼: 빈 필수칸이 있으면 안내하고 멈춘다. 다 찼으면 계산 함수를 한 번 부르고 결과 카드로
  function submit(fnName, cardId, required, btn) {
    clearNeeds(btn && btn.closest('.ds-input-card'));
    var ms = missing(required || []);
    if (ms.length) {   // 빈 칸마다 그 칸 아래 안내, 스크롤은 첫 칸으로
      ms.forEach(function (m, i) {
        var names = m.els.map(fieldName).filter(Boolean);
        need(m.el, !m.group ? null : names.length === m.els.length ? names.map(function (n) { return '"' + n + '"'; }).join(', ') + ' 중 한 칸 이상 입력해 주세요.' : '값을 한 칸 이상 입력해 주세요.', i > 0);
      });
      return;
    }
    run(fnName, btn);
    var c = cardId && document.getElementById(cardId);
    if (c && !c.getClientRects().length) {
      var bad = Array.prototype.find.call(document.querySelectorAll('.ds-input-card input'), function (e) { return shown(e).offsetParent !== null && e.validity && (e.validity.rangeUnderflow || e.validity.rangeOverflow); });
      if (bad) { need(bad, rangeMsg(bad)); return; }
    }
    if (c && (c.getBoundingClientRect().top > innerHeight * 0.6 || c.getBoundingClientRect().top < 0)) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 계산 버튼 연결: <button class="ds-btn-calc" data-calc-submit="함수" data-result="결과 카드 id" data-required="id1,id2|id3">
  // (인라인 onclick에 JSON을 넣지 않는다: 큰따옴표가 속성을 끊는다)
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-calc-submit]');
    if (!b) return;
    submit(b.getAttribute('data-calc-submit'), b.getAttribute('data-result'), (b.getAttribute('data-required') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean), b);
  });

  // 결과 큰 숫자: 한 줄로 두고, 칸보다 길면 글자를 칸 폭에 맞게 줄인다(최소 --fs-label 크기)
  var BIG = '.ds-result-number, .rh-value, .result-total-value';
  function fit() {
    Array.prototype.forEach.call(document.querySelectorAll(BIG), function (el) {
      if (!el.getClientRects().length) return;
      // 글자 크기를 정한 쪽: 글자를 그대로 감싼 안쪽 요소 하나뿐이면 그쪽(음력 변환기의 .big-num 등)
      var t = el;
      while (t.children.length === 1 && t.children[0].textContent.trim() === t.textContent.trim()) t = t.children[0];
      t.style.fontSize = '';
      // 칸 폭은 부모의 안쪽 여백을 뺀 내용 폭(clientWidth는 padding 포함이라, 여백 안으로 넘쳐도 들어간다고 봤다. 10/27 프리랜서 순수입 PC 46px 넘침)
      var p = el.parentElement, ps = getComputedStyle(p);
      var w = p.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight), s = el.scrollWidth;
      if (!w || s <= w + 1) return;
      var base = parseFloat(getComputedStyle(t).fontSize), min = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-label')) || 14;
      var size = Math.max(min, Math.floor(base * w / s * 10) / 10);
      t.style.fontSize = size + 'px';
      // 글자 폭이 크기에 정확히 비례하지 않아(자간·숫자 폭 반올림) 1~3px 남을 수 있다: 다시 재서 들어갈 때까지 조금씩
      for (var i = 0; i < 8 && size > min && el.scrollWidth > w + 1; i++) { size = Math.max(min, size - 0.5); t.style.fontSize = size + 'px'; }
    });
    if (fitMo) fitMo.takeRecords();   // 방금 바꾼 글자 크기로 다시 깨지 않게
  }
  var fitT = 0, fitMo = null;
  function fitSoon() { clearTimeout(fitT); fitT = setTimeout(fit, 30); }
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('.ds-calc');
    if (!root) return;
    fitMo = new MutationObserver(fitSoon); fitMo.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });
    window.addEventListener('resize', fitSoon);
    window.addEventListener('load', fitSoon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSoon);   // 웹폰트가 늦게 붙으면 폭이 바뀐다
    fitSoon();
  });

  /* 날짜 칸(flatpickr, 10/21 2차): 글자 칸 탭 = 키보드만(달력 안 열림), 오른쪽 달력 아이콘 = 달력만(inputmode none으로 키보드 안 뜸).
     모바일·데스크톱 같은 규칙. 생년월일 칸(id에 birth)은 달력에 연·월 선택 상자, 처음 열 때 30년 전 같은 달 */
  function dateEnhance(el) {
    var fp = el._flatpickr;
    if (!fp || fp._ds) return;
    fp._ds = 1;
    var alt = fp.altInput || fp.input, mode = alt.getAttribute('inputmode') || 'decimal';
    fp.set('clickOpens', false);
    var wrap = document.createElement('span'); wrap.className = 'ds-date-wrap';
    el.parentNode.insertBefore(wrap, el); wrap.appendChild(el); wrap.appendChild(alt);
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ds-date-btn';
    btn.setAttribute('aria-label', (fieldName(el) || '날짜') + ' 달력 열기');
    wrap.appendChild(btn);
    var wasOpen = false;
    btn.addEventListener('pointerdown', function () { wasOpen = fp.isOpen; });
    btn.addEventListener('click', function () {
      if (wasOpen || fp.isOpen) { fp.close(); wasOpen = false; return; }
      alt.setAttribute('inputmode', 'none');
      if (document.activeElement === alt) alt.blur();
      byBtn = true; fp.open(); byBtn = false;
    });
    // 초기화 때 걸린 입력칸 열기(포커스·클릭)는 set('clickOpens')로 안 풀린다: 버튼으로 연 게 아니면 바로 닫는다
    var byBtn = false;
    fp.config.onOpen.unshift(function () { if (!byBtn) fp.close(); });
    // 글자 칸을 누르면 키보드로(열린 달력은 닫는다)
    alt.addEventListener('pointerdown', function () { alt.setAttribute('inputmode', mode); if (fp.isOpen) fp.close(); });
    alt.addEventListener('focus', function () { if (!fp.isOpen) alt.setAttribute('inputmode', mode); });
    fp.config.onClose.push(function () { alt.setAttribute('inputmode', mode); });
    if (/birth/i.test(el.id)) birthCalendar(fp);
  }
  function birthCalendar(fp) {
    var now = new Date(), y0 = now.getFullYear();
    var yw = fp.calendarContainer.querySelector('.numInputWrapper');
    var sel = document.createElement('select');
    sel.className = 'flatpickr-monthDropdown-months ds-year-select'; sel.setAttribute('aria-label', '연도');
    for (var y = y0; y >= 1920; y--) sel.insertAdjacentHTML('beforeend', '<option value="' + y + '">' + y + '년</option>');
    if (yw) { yw.style.display = 'none'; yw.parentNode.insertBefore(sel, yw); }
    var sync = function () { sel.value = String(fp.currentYear); };
    sel.addEventListener('change', function () { fp.changeYear(+sel.value); sync(); });
    fp.config.onYearChange.push(sync); fp.config.onMonthChange.push(sync);
    fp.config.onOpen.push(function () { if (!fp.selectedDates.length) fp.jumpToDate(new Date(now.getFullYear() - 30, now.getMonth(), 1)); sync(); });
    sync();
  }
  function dateAll() { Array.prototype.forEach.call(document.querySelectorAll('input.flatpickr-input'), function (el) { if (el._flatpickr) dateEnhance(el); }); }
  document.addEventListener('DOMContentLoaded', dateAll);
  window.addEventListener('load', dateAll);

  window.DSCalc = { carryText: carryText, auto: auto, submit: submit, need: need, clearNeeds: clearNeeds, placeTrust: placeTrust,  num: num, verdict: verdict, result: result, link: link, next: next, copy: copy, copyBtn: copyBtn, tableNear: tableNear, bar: bar };
})();

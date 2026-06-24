/**
 * calc-validate.js
 * 모든 계산기 페이지에서 input[type=number]에 대해:
 * 1. min="0" 속성 자동 부여 (data-allow-negative 없는 경우)
 * 2. 음수 입력 시 0으로 보정
 * 3. 붙여넣기로 음수 입력하는 경우도 처리
 */
(function () {
  function clampNegative(el) {
    if (el.dataset.allowNegative) return;
    var v = parseFloat(el.value);
    if (!isNaN(v) && v < 0) {
      el.value = 0;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function init() {
    var inputs = document.querySelectorAll('input[type=number]');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (!el.dataset.allowNegative && !el.hasAttribute('min')) {
        el.setAttribute('min', '0');
      }
      el.addEventListener('change', function () { clampNegative(this); });
      el.addEventListener('paste', function () {
        var self = this;
        setTimeout(function () { clampNegative(self); }, 0);
      });
    }
    // 날짜·월 입력: 연도 4자리 제한 (202122 같은 6자리 연도 등 비정상 입력 방지).
    // 미래 날짜가 필요한 계산기(D-day·날짜차이·날짜더하기 등)도 있으므로 상한은 넓게(2200) 둔다.
    // 특정 계산기에서 더 좁은 범위가 필요하면 해당 input에 min/max를 직접 지정(여기선 건드리지 않음).
    var dInputs = document.querySelectorAll('input[type=date]');
    for (var d = 0; d < dInputs.length; d++) {
      if (!dInputs[d].hasAttribute('max')) dInputs[d].setAttribute('max', '2200-12-31');
      if (!dInputs[d].hasAttribute('min')) dInputs[d].setAttribute('min', '1900-01-01');
    }
    var mInputs = document.querySelectorAll('input[type=month]');
    for (var m = 0; m < mInputs.length; m++) {
      if (!mInputs[m].hasAttribute('max')) mInputs[m].setAttribute('max', '2200-12');
      if (!mInputs[m].hasAttribute('min')) mInputs[m].setAttribute('min', '1900-01');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

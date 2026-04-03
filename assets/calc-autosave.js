(function () {
  if (typeof window === 'undefined' || !window.localStorage) return;

  var STORAGE_KEY = 'jptcalc:autosave:' + location.pathname.replace(/\/+$/, '/');
  var INPUT_SELECTOR = 'input, textarea, select';
  var BUTTON_SELECTOR = '.seg-btn, .tab-btn, .sl-tab-btn, .calc-tab-link';
  var restoring = false;
  var saveTimer = null;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function saveState(state) {
    try {
      state.savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function elKey(el, idx) {
    return (
      el.getAttribute('data-autosave-key') ||
      el.name ||
      el.id ||
      (el.type || el.tagName.toLowerCase()) + ':' + idx
    );
  }

  function buttonValue(btn, idx) {
    return (
      btn.getAttribute('data-value') ||
      btn.getAttribute('data-tab') ||
      btn.getAttribute('aria-controls') ||
      (btn.textContent || '').trim() ||
      'btn:' + idx
    );
  }

  function collectState() {
    var state = { fields: {}, groups: {} };
    document.querySelectorAll(INPUT_SELECTOR).forEach(function (el, idx) {
      if (el.disabled) return;
      var key = elKey(el, idx);
      if (el.type === 'password') return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        state.fields[key] = !!el.checked;
      } else {
        state.fields[key] = el.value;
      }
    });

    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (btn, idx) {
      var group = btn.closest('.seg-group, .tab-nav, .sl-tab-list, .calc-tab-list, .tab-links, .tab-buttons');
      if (!group) return;
      var groupKey = group.getAttribute('data-autosave-key') || group.id || ('group:' + Array.from(document.querySelectorAll('.seg-group, .tab-nav, .sl-tab-list, .calc-tab-list, .tab-links, .tab-buttons')).indexOf(group));
      if (btn.classList.contains('active') || btn.classList.contains('sl-tab-active')) {
        state.groups[groupKey] = buttonValue(btn, idx);
      }
    });
    return state;
  }

  function trigger(el, type) {
    try { el.dispatchEvent(new Event(type, { bubbles: true })); } catch (e) {}
  }

  function restoreFields(state) {
    document.querySelectorAll(INPUT_SELECTOR).forEach(function (el, idx) {
      var key = elKey(el, idx);
      if (!state.fields || !(key in state.fields)) return;
      var value = state.fields[key];
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = !!value;
        trigger(el, 'change');
      } else {
        el.value = value;
        trigger(el, 'input');
        trigger(el, 'change');
      }
    });
  }

  function restoreGroups(state) {
    var groups = document.querySelectorAll('.seg-group, .tab-nav, .sl-tab-list, .calc-tab-list, .tab-links, .tab-buttons');
    groups.forEach(function (group, groupIdx) {
      var groupKey = group.getAttribute('data-autosave-key') || group.id || ('group:' + groupIdx);
      var wanted = state.groups && state.groups[groupKey];
      if (!wanted) return;
      var buttons = group.querySelectorAll(BUTTON_SELECTOR);
      buttons.forEach(function (btn, idx) {
        if (buttonValue(btn, idx) === wanted) {
          try { btn.click(); } catch (e) {}
        }
      });
    });
  }

  function scheduleSave() {
    if (restoring) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveState(collectState());
    }, 150);
  }

  function init() {
    var state = loadState();
    restoring = true;
    setTimeout(function () {
      restoreFields(state);
      restoreGroups(state);
      restoring = false;
    }, 60);

    document.addEventListener('input', function (e) {
      if (e.target && e.target.matches(INPUT_SELECTOR)) scheduleSave();
    }, true);
    document.addEventListener('change', function (e) {
      if (e.target && e.target.matches(INPUT_SELECTOR)) scheduleSave();
    }, true);
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest(BUTTON_SELECTOR);
      if (btn) scheduleSave();
    }, true);
  }

  window.jcalcAutoSave = {
    clear: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    },
    key: STORAGE_KEY
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

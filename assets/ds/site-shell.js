/* ================================================
   /assets/ds/site-shell.js
   공통 틀을 한 곳에서 그린다: H1 헤더(검색 자동완성) · 하단 탭바 · A6 모바일 메뉴 · A4 푸터 ·
   B5 쿠키 배너 · B2 하단 결과 바 · 최근 사용 기록. (design/brief.md 헤더 규칙·시안 검수 메모)
   기존 {category}-detail-shell.js(좌측 사이드바 포함)와 footer-unified.js를 대신한다.
   공통 스크립트가 넣는 이모지는 라인 아이콘으로 1:1 바꾼다(v2 보정 3).
   ================================================ */
(function () {
  'use strict';
  var SPRITE = '/assets/ds/icons.svg';

  function icon(name, cls) {
    return '<svg class="ds-i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="' + SPRITE + '#i-' + name + '"></use></svg>';
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 로고: design/brand/logo-symbol.svg와 같은 도형, 색은 tokens(--navy / --blue)
  function logo() {
    return '<svg class="ds-logo-sym" viewBox="0 0 146 188" aria-hidden="true">' +
      '<path class="ds-logo-j" d="M122.5 0 V116 A48.5 48.5 0 0 1 25.5 116" fill="none" stroke-width="47"/>' +
      '<rect class="ds-logo-jt" x="83" y="0" width="20" height="40"/>' +
      '<rect class="ds-logo-bar" x="0" y="52" width="79" height="26" rx="6"/>' +
      '<rect class="ds-logo-bar" x="0" y="90" width="79" height="26" rx="6"/></svg>' +
      '<span class="ds-logo-text">제이퍼계산기</span>';
  }

  // 카테고리: 이름은 실제 사이트, 아이콘은 brief 확정 매핑, 일러스트는 /assets/img/illust/cat-{key}.webp
  var CATS = {
    realestate:        { name: '부동산',        icon: 'house' },
    salary:            { name: '이직/연봉',     icon: 'briefcase' },
    tools:             { name: '생활·도구',     icon: 'wrench' },
    tax:               { name: '프리랜서 세금', icon: 'receipt' },
    'pension-welfare': { name: '연금·복지',     icon: 'shield-check' },
    finance:           { name: '금융·이자',     icon: 'piggy-bank' },
    date:              { name: '날짜·D-day',    icon: 'calendar-days' },
    health:            { name: '건강',          icon: 'heart-pulse' },
    ai:                { name: 'AI/테크',       icon: 'cpu' },
    pet:               { name: '반려동물',      icon: 'paw-print' },
    auto:              { name: '자동차',        icon: 'car' },
    baby:              { name: '출산·육아',     icon: 'baby' }
  };
  var ORDER = (window.CALC_CAT_ORDER && window.CALC_CAT_ORDER.length) ? window.CALC_CAT_ORDER.slice() : Object.keys(CATS);
  ORDER = ORDER.filter(function (k) { return CATS[k]; });
  Object.keys(CATS).forEach(function (k) { if (ORDER.indexOf(k) < 0) ORDER.push(k); });
  function catVar(k) { return '--cat: var(--c-' + k + ')'; }

  // 레지스트리 이모지 → 라인 아이콘
  var EMOJI = {
    '🏠': 'house', '🏡': 'house', '📄': 'file-text', '🔄': 'repeat', '💰': 'banknote', '💵': 'banknote',
    '📊': 'table-2', '📈': 'trending-up', '🔢': 'calculator', '🔑': 'key-round', '🏘️': 'building-2',
    '🏘': 'building-2', '🎁': 'gift', '📜': 'scroll-text', '👥': 'users', '🏦': 'landmark', '🏛️': 'landmark',
    '🏛': 'landmark', '💼': 'briefcase-business', '📐': 'ruler', '📋': 'clipboard-list', '📖': 'book-open'
  };
  function emojiIcon(txt) {
    txt = (txt || '').trim();
    for (var e in EMOJI) { if (txt.indexOf(e) === 0) return EMOJI[e]; }
    return 'calculator';
  }

  // ── 페이지 종류: 탭바 활성·뒤로 버튼·헤더 활성 메뉴를 정한다 ──
  var path = location.pathname.replace(/index\.html$/, '');
  var m;
  var PAGE = { type: 'other', tab: '', back: '' };
  if (path === '/') PAGE = { type: 'home', tab: 'home', back: '' };
  else if ((m = path.match(/^\/calc\/([^/]+)\/[^/]+\//))) PAGE = { type: 'calc', tab: 'cat', back: '/calc/' + m[1] + '/', cat: m[1] };
  else if ((m = path.match(/^\/calc\/([^/]+)\/$/))) PAGE = { type: 'hub', tab: 'cat', back: '/', cat: m[1] };
  else if (/^\/blog\/posts\//.test(path)) PAGE = { type: 'post', tab: 'blog', back: '/blog/' };
  else if (/^\/blog\/$/.test(path)) PAGE = { type: 'blog', tab: 'blog', back: '' };
  else if (/^\/recent\/$/.test(path)) PAGE = { type: 'recent', tab: 'recent', back: '' };
  else PAGE.back = document.body && document.body.getAttribute('data-cat') === '404' ? '' : '/';   // 404(E1)는 돌아갈 상위가 없어 뒤로 버튼 없음

  // 링크 목적지 (홈·최근 화면은 T3 단계에서 만든다)
  var URL = { situations: '/#situations', categories: '/#categories', blog: '/blog/', recent: '/recent/' };

  // ── 계산기 검색 (calc-registry.js 기반, 최대 6개) ──
  var INDEX = null;
  function buildIndex() {
    var R = window.CALC_REGISTRY;
    if (!R) return null;
    var list = [];
    ORDER.forEach(function (k) {
      (R[k] && R[k].calcs || []).forEach(function (c) {
        list.push({ name: c.name, cat: k, url: '/calc/' + k + '/' + c.slug + '/', key: norm(c.name) });
      });
    });
    return list;
  }
  function norm(t) { return String(t).toLowerCase().replace(/[\s()·\/\-]/g, ''); }
  function ensureIndex(cb) {
    if (INDEX) return cb();
    if (window.CALC_REGISTRY) { INDEX = buildIndex(); return cb(); }
    var s = document.createElement('script');
    s.src = '/assets/calc-registry.js?v=d25870c6';
    s.onload = function () { INDEX = buildIndex(); cb(); };
    document.head.appendChild(s);
  }
  function search(q) {
    var k = norm(q);
    if (!k || !INDEX) return [];
    var hits = INDEX.filter(function (r) { return r.key.indexOf(k) >= 0; });
    hits.sort(function (a, b) { return (a.key.indexOf(k) === 0 ? 0 : 1) - (b.key.indexOf(k) === 0 ? 0 : 1); });
    return hits.slice(0, 6);
  }
  function highlight(name, q) {
    var i = name.toLowerCase().indexOf(q.trim().toLowerCase());
    if (!q.trim() || i < 0) return esc(name);
    return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.trim().length)) + '</mark>' + esc(name.slice(i + q.trim().length));
  }
  function searchField(id) {
    return '<div class="ds-search-field">' + icon('search') +
      '<input class="ds-search-input" id="' + id + '" type="search" placeholder="계산기 이름으로 찾기" autocomplete="off" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '-list" aria-label="계산기 검색">' +
      '<button type="button" class="ds-search-clear" aria-label="지우기">' + icon('circle-x') + '</button></div>' +
      '<ul class="ds-ac" id="' + id + '-list" role="listbox" hidden></ul>';
  }
  function wireSearch(root, onState) {
    var input = root.querySelector('.ds-search-input'), list = root.querySelector('.ds-ac'),
        field = root.querySelector('.ds-search-field'), clear = root.querySelector('.ds-search-clear'), active = -1;
    function render() {
      var q = input.value;
      field.classList.toggle('has-value', !!q);
      if (!q.trim()) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); if (onState) onState(false); return; }
      ensureIndex(function () {
        var hits = search(q);
        active = -1;
        list.innerHTML = hits.length ? hits.map(function (r) {
          return '<li role="option"><a href="' + r.url + '"><span class="ds-cat-ico" style="' + catVar(r.cat) + '">' + icon(CATS[r.cat].icon) + '</span>' +
            '<span class="ds-ac-body"><b>' + highlight(r.name, q) + ' 계산기</b><span>' + CATS[r.cat].name + '</span></span>' + icon('chevron-right') + '</a></li>';
        }).join('') : '<li class="ds-ac-empty">"' + esc(q) + '"에 맞는 계산기가 없어요</li>';
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        if (onState) onState(true);
      });
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', function () { ensureIndex(function () {}); if (input.value) render(); });
    input.addEventListener('keydown', function (e) {
      var links = list.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!links.length) return;
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
      } else if (e.key === 'Enter') {
        var go = links[active >= 0 ? active : 0];
        if (go) { e.preventDefault(); location.href = go.getAttribute('href'); }
      } else if (e.key === 'Escape') { input.value = ''; render(); input.blur(); }
    });
    clear.addEventListener('click', function () { input.value = ''; render(); input.focus(); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); } });
    return input;
  }

  // ── 페이지 안 검색창(홈 등): <div data-ds-search="id"></div> 자리에 헤더와 같은 검색 부품을 붙인다 ──
  document.querySelectorAll('[data-ds-search]').forEach(function (el) {
    el.innerHTML = searchField(el.getAttribute('data-ds-search') || 'ds-q-page');
    wireSearch(el);
  });

  // ── 헤더 (H1) ──
  var header = document.getElementById('ds-site-header');
  if (header) {
    var navCur = PAGE.tab === 'cat' ? 'cat' : PAGE.tab === 'blog' ? 'blog' : '';
    var navLink = function (href, label, key) { return '<a href="' + href + '"' + (key === navCur ? ' aria-current="page"' : '') + '>' + label + '</a>'; };
    // H2: 상황별·카테고리는 펼침 버튼(데스크톱 전용 줄, 모바일은 이 줄이 숨겨지고 탭바·메뉴 시트를 쓴다)
    var navBtn = function (key, label) {
      return '<button type="button" id="ds-nav-' + key + '-btn" aria-expanded="false" aria-controls="ds-nav-' + key + '"' + (key === navCur ? ' class="is-current"' : '') + '>' + label + icon('chevron-down') + '</button>' +
        '<div class="ds-nav-panel" id="ds-nav-' + key + '" role="region" aria-labelledby="ds-nav-' + key + '-btn"></div>';
    };
    header.className = 'ds-header';
    header.innerHTML =
      '<div class="ds-container"><div class="ds-header-inner">' +
        (PAGE.back ? '<a class="ds-icon-btn ds-back" href="' + PAGE.back + '" aria-label="뒤로">' + icon('arrow-left') + '</a>' : '') +
        '<a class="ds-logo" href="/" aria-label="제이퍼계산기 홈">' + logo() + '</a>' +
        '<nav class="ds-header-nav" aria-label="주 메뉴">' +
          navBtn('sit', '상황별') + navBtn('cat', '카테고리') + navLink(URL.blog, '블로그', 'blog') +
        '</nav>' +
        '<div class="ds-header-search" role="search">' + searchField('ds-q-head') + '</div>' +
        '<div class="ds-header-actions">' +
          '<button class="ds-icon-btn ds-search-btn" type="button" aria-label="계산기 찾기">' + icon('search') + '</button>' +
          '<button class="ds-icon-btn ds-menu-btn" type="button" aria-label="메뉴" aria-expanded="false" aria-controls="ds-menu">' + icon('menu') + '</button>' +
        '</div>' +
      '</div></div>';
    wireSearch(header.querySelector('.ds-header-search'));
    // 뒤로: 같은 사이트에서 왔으면 브라우저 뒤로, 아니면 상위 페이지로
    var back = header.querySelector('.ds-back');
    if (back) back.addEventListener('click', function (e) {
      if (document.referrer && document.referrer.indexOf(location.origin) === 0 && history.length > 1) { e.preventDefault(); history.back(); }
    });
  }

  // ── A6 모바일 메뉴: 전체 화면 패널 (검색 아이콘도 이 패널을 검색창에 포커스한 채로 연다) ──
  var menu = document.createElement('div');
  menu.className = 'ds-menu'; menu.id = 'ds-menu'; menu.hidden = true;
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', '전체 메뉴');
  menu.innerHTML =
    '<div class="ds-menu-top"><a class="ds-logo" href="/" aria-label="제이퍼계산기 홈">' + logo() + '</a>' +
      '<button class="ds-icon-btn ds-menu-close" type="button" aria-label="닫기">' + icon('x') + '</button></div>' +
    '<div class="ds-menu-search" role="search">' + searchField('ds-q-menu') + '</div>' +
    '<div class="ds-menu-body">' +
      '<ul class="ds-menu-list">' +
        '<li><a href="' + URL.situations + '">' + icon('map-pin') + '상황별로 찾기' + icon('chevron-right') + '</a></li>' +
        '<li><a href="' + URL.blog + '">' + icon('newspaper') + '블로그' + icon('chevron-right') + '</a></li>' +
        '<li><a href="' + URL.recent + '">' + icon('clock') + '최근 사용한 계산기' + icon('chevron-right') + '</a></li>' +
      '</ul>' +
      '<section><h2>카테고리</h2><div class="ds-cat-grid">' +
        ORDER.map(function (k) {
          return '<a href="/calc/' + k + '/"><img src="/assets/img/illust/cat-' + k + '.webp" alt="" width="52" height="52" loading="lazy" decoding="async">' + CATS[k].name + '</a>';
        }).join('') +
      '</div></section>' +
      '<nav class="ds-menu-links" aria-label="사이트 정보"><a href="/about.html">소개</a>·<a href="/contact.html">문의하기</a>·<a href="/privacy.html">개인정보처리방침</a>·<a href="/terms.html">이용약관</a></nav>' +
    '</div>';
  document.body.appendChild(menu);
  var menuInput = wireSearch(menu.querySelector('.ds-menu-search'), function (on) { menu.classList.toggle('is-searching', on); });
  var menuBtn = header && header.querySelector('.ds-menu-btn');
  // 안드로이드 뒤로가기로 메뉴가 닫히게: 열 때 기록 한 칸(주소 그대로)을 남기고, 뒤로가기(popstate)면 닫는다
  function setMenu(open, focusSearch, fromPop) {
    if (open && menu.hidden) { try { history.pushState({ dsMenu: 1 }, ''); } catch (e) {} }
    else if (!open && !menu.hidden && !fromPop && history.state && history.state.dsMenu) { menu.hidden = true; try { history.back(); } catch (e) {} }
    menu.hidden = !open;
    document.body.classList.toggle('ds-menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && focusSearch) menuInput.focus();
    if (!open && menuBtn) menuBtn.focus();
  }
  if (header) {
    menuBtn.addEventListener('click', function () { setMenu(true, false); });
    header.querySelector('.ds-search-btn').addEventListener('click', function () { setMenu(true, true); });
  }
  menu.querySelector('.ds-menu-close').addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  window.addEventListener('popstate', function () { if (!menu.hidden) setMenu(false, false, true); });

  // ── 배포 데이터(/assets/ds/*.json, build_home.py가 생성): 상황 시트·헤더 메뉴 공용. 처음 필요할 때 한 번 받는다 ──
  var DATA = {};
  var DS_DATA_V = {"situations": "58b8af97", "cat-menu": "b65e6fe8"};   // 메뉴 데이터 캐시 버전(design/tools/asset_version.py가 파일 내용 해시로 채움)
  function load(name, ok, fail) {
    var d = DATA[name];
    if (d && d.v) return ok(d.v);
    if (d && !d.err) return d.q.push([ok, fail]);
    d = DATA[name] = { q: [[ok, fail]] };
    fetch('/assets/ds/' + name + '.json' + (DS_DATA_V[name] ? '?v=' + DS_DATA_V[name] : '')).then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (v) { d.v = v; d.q.forEach(function (c) { c[0](v); }); d.q = []; })
      .catch(function () { d.err = 1; d.q.forEach(function (c) { if (c[1]) c[1](); }); d.q = []; });
  }

  // ── 상황 시트(A2): 홈 카드·헤더 상황별 메뉴 공용. 새 URL 없이 해시 상태(#s=id)만 남겨 뒤로가기로 닫힌다 ──
  var sheet = null, sitCur = null, sitFocus = null, SD = null;
  function sitHref(st) {
    var q = [];
    (SD.situations[sitCur].inputs || []).forEach(function (i) {
      var el = document.getElementById('h-in-' + i.param), v = el ? String(el.value || '').replace(/[^\d.]/g, '') : '';
      if (v && st.recv.indexOf(i.param) >= 0) q.push(i.param + '=' + encodeURIComponent(v));
    });
    return st.path + (q.length ? '?' + q.join('&') + '&from=sit-' + sitCur : '');
  }
  function sitRelink() {
    var s = SD.situations[sitCur];
    sheet.querySelectorAll('.h-steps a').forEach(function (a, i) { a.href = sitHref(s.steps[i]); });
    sheet.querySelector('.h-sheet-cta').href = sitHref(s.steps[0]);
  }
  function sitBuild() {
    sheet = document.createElement('div');
    sheet.className = 'h-sheet'; sheet.id = 'h-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="h-sheet-backdrop" data-close></div>' +
      '<div class="h-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="h-sheet-title" tabindex="-1">' +
        '<div class="h-sheet-grip" aria-hidden="true"></div>' +
        '<button type="button" class="ds-icon-btn h-sheet-x" data-close aria-label="닫기">' + icon('x') + '</button>' +
        '<div class="h-sheet-head"><img id="h-sheet-img" src="" alt="" width="48" height="48"><div><h2 id="h-sheet-title"></h2><p id="h-sheet-desc"></p></div></div>' +
        '<div class="h-sheet-inputs" id="h-sheet-inputs" hidden></div>' +
        '<ol class="h-steps" id="h-steps"></ol>' +
        '<a class="ds-btn-primary h-sheet-cta" id="h-sheet-cta" href="#"></a>' +
      '</div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) sitClose(); });
    sheet.querySelector('.h-sheet-inputs').addEventListener('input', sitRelink);
    sheet.querySelector('.h-steps').addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      sitRelink(); ga('situation_step_click', { situation_id: sitCur, step: +a.getAttribute('data-step'), calc: a.pathname });
    });
    var cta = sheet.querySelector('.h-sheet-cta');
    cta.addEventListener('click', function () { sitRelink(); ga('situation_step_click', { situation_id: sitCur, step: 1, calc: cta.pathname, via: 'cta' }); });
  }
  function sitRender(id) {
    var s = SD.situations[id], box = sheet.querySelector('.h-sheet-inputs'); sitCur = id;
    sheet.querySelector('#h-sheet-img').src = s.illust;
    sheet.querySelector('#h-sheet-title').textContent = s.name;
    sheet.querySelector('#h-sheet-desc').textContent = s.desc;
    box.hidden = !s.inputs.length;
    box.innerHTML = s.inputs.map(function (i) {
      return '<div><label for="h-in-' + i.param + '">' + esc(i.label) + '</label><div class="input-wrap"><input type="text" inputmode="numeric" autocomplete="off" data-ds-num id="h-in-' + i.param + '" placeholder="' + esc(i.placeholder || '') + '"><span class="unit">' + esc(i.unit) + '</span></div></div>';
    }).join('') + (s.inputs.length ? '<p class="field-hint">입력하면 아래 계산기에 자동으로 채워져요</p>' : '');
    sheet.querySelector('.h-steps').innerHTML = s.steps.map(function (st, i) {
      return '<li><a href="' + st.path + '" data-step="' + (i + 1) + '"><span class="h-step-no">' + (i + 1) + '</span><span class="h-step-body"><b>' + esc(st.name) + '</b><span>' + esc(st.desc) + '</span></span>' + icon('chevron-right') + '</a></li>';
    }).join('');
    sheet.querySelector('.h-sheet-cta').textContent = '1단계 ' + s.steps[0].name + '부터 계산하기';
    sitRelink();
  }
  // id: 상황, push: 해시 기록을 새로 남길지, from: GA4 출처(home/header), fallback: 데이터를 못 받으면 갈 주소
  function sitOpen(id, push, from, fallback) {
    load('situations', function (d) {
      SD = d; if (!SD.situations[id]) return;
      if (!sheet) sitBuild();
      sitRender(id); sitFocus = document.activeElement;
      sheet.hidden = false; document.body.classList.add('h-sheet-open');
      if (push) history.pushState({ sheet: id }, '', '#s=' + id);
      // 터치 기기는 입력칸에 자동 포커스하지 않는다(열자마자 키보드가 올라오던 것, 10/21). 데스크톱은 첫 칸으로
      var touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      var f = touch ? sheet.querySelector('.h-sheet-panel') : sheet.querySelector('input, .h-steps a');
      if (f) f.focus({ preventScroll: true });
      ga('situation_open', from ? { situation_id: id, from: from } : { situation_id: id });
    }, function () { if (fallback) location.href = fallback; });
  }
  function sitHide() { if (!sheet) return; sheet.hidden = true; document.body.classList.remove('h-sheet-open'); sitCur = null; if (sitFocus) sitFocus.focus({ preventScroll: true }); }
  function sitClose() { if (history.state && history.state.sheet) history.back(); else sitHide(); }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-sit]') : null;
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var fromHeader = !!a.closest('.ds-nav-panel');
    if (fromHeader) setNav(null, true);
    sitOpen(a.getAttribute('data-sit'), true, fromHeader ? 'header' : 'home', a.href);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) sitClose(); });
  window.addEventListener('popstate', function (e) {
    var id = e.state && e.state.sheet;
    if (id) { if (!sheet || sheet.hidden || sitCur !== id) sitOpen(id, false); } else if (sheet && !sheet.hidden) sitHide();
  });
  // 계산기에서 뒤로 돌아오거나 #s=id로 들어오면: 시트를 연 상태로, 한 번 더 뒤로가기면 닫힘(어느 페이지든)
  var sitHash = location.hash.match(/^#s=([a-z-]+)$/);
  if (sitHash) {
    if (!(history.state && history.state.sheet)) { history.replaceState(null, '', location.pathname + location.search); history.pushState({ sheet: sitHash[1] }, '', '#s=' + sitHash[1]); }
    sitOpen(sitHash[1], false);
  }
  if (PAGE.type === 'home') load('situations', function () {});   // 홈 카드는 누르자마자 열리게 미리 받는다

  // ── 헤더 펼침 메뉴(H2, 데스크톱): 클릭으로 열고 닫기, 한 번에 하나. 바깥 클릭·ESC·같은 버튼 다시 누르기로 닫힘 ──
  var navOpen = null, dim = null;
  function navRender(key, panel) {
    if (panel.getAttribute('data-ready')) return;
    if (key === 'sit') load('situations', function (d) {
      panel.innerHTML = '<ul class="ds-nav-sits">' + d.order.map(function (id) {
        var s = d.situations[id];
        return '<li><a href="' + s.steps[0].path + '" data-sit="' + id + '"><img src="' + s.illust + '" alt="" width="56" height="56" loading="lazy" decoding="async"><span><b>' + esc(s.name) + '</b><small>' + esc(s.desc) + '</small></span></a></li>';
      }).join('') + '</ul>';
      panel.setAttribute('data-ready', '1');
    });
    else load('cat-menu', function (d) {
      panel.innerHTML = '<ul class="ds-nav-cats">' + d.cats.map(function (c) {
        return '<li style="' + catVar(c.key) + '"><a class="ds-nav-cat-head" href="/calc/' + c.key + '/" data-slot="head"><span class="ds-cat-ico">' + icon(c.icon) + '</span><span><b>' + esc(c.name) + '</b><small>계산기 ' + c.count + '개</small></span></a>' +
          '<ul>' + c.top.map(function (t) { return '<li><a href="' + t.path + '" data-slot="top">' + esc(t.name) + '</a></li>'; }).join('') + '</ul>' +
          '<a class="ds-nav-cat-all" href="/calc/' + c.key + '/" data-slot="all">전체 ' + c.count + '개' + icon('arrow-right') + '</a></li>';
      }).join('') + '</ul>';
      panel.setAttribute('data-ready', '1');
    });
  }
  // key: 열 메뉴(null이면 닫기), quiet: 닫을 때 버튼으로 포커스를 돌리지 않음
  function setNav(key, quiet) {
    if (!header) return;
    if (!dim) { dim = document.createElement('div'); dim.className = 'ds-nav-dim'; document.body.appendChild(dim); dim.addEventListener('click', function () { setNav(null); }); }
    var prev = navOpen;
    navOpen = key;
    header.querySelectorAll('.ds-header-nav button[aria-controls]').forEach(function (b) {
      var k = b.id.replace(/^ds-nav-|-btn$/g, ''), on = k === key, panel = document.getElementById('ds-nav-' + k);
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      panel.classList.toggle('is-open', on);
      if (on) navRender(k, panel);
    });
    dim.classList.toggle('is-on', !!key);
    if (!key && prev && !quiet) { var pb = document.getElementById('ds-nav-' + prev + '-btn'); if (pb) pb.focus(); }
  }
  if (header) {
    header.querySelectorAll('.ds-header-nav button[aria-controls]').forEach(function (b) {
      var k = b.id.replace(/^ds-nav-|-btn$/g, '');
      b.addEventListener('click', function () { setNav(navOpen === k ? null : k, true); });
      b.addEventListener('pointerenter', function () { load(k === 'sit' ? 'situations' : 'cat-menu', function () {}); });   // 미리 받기만(열기는 클릭)
    });
    document.addEventListener('click', function (e) { if (navOpen && !e.target.closest('.ds-header-nav')) setNav(null, true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navOpen) setNav(null); });
    var wide = window.matchMedia('(min-width: 1024px)');
    var onWide = function () { if (!wide.matches && navOpen) setNav(null, true); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
    var catPanel = document.getElementById('ds-nav-cat');
    if (catPanel) catPanel.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      var li = a.closest('.ds-nav-cats > li'), key = li ? (li.querySelector('.ds-nav-cat-head').getAttribute('href').split('/')[2]) : '';
      ga('hub_calc_click', { to: a.getAttribute('href'), cat: key, slot: a.getAttribute('data-slot'), from: 'header_menu' });
    });
  }

  // ── 하단 탭바: 활성 = 홈/카테고리(계산기·카테고리 페이지)/블로그/최근 ──
  var tabbar = document.createElement('nav');
  tabbar.className = 'ds-tabbar'; tabbar.setAttribute('aria-label', '하단 메뉴');
  tabbar.innerHTML = [['home', '/', 'house', '홈'], ['cat', URL.categories, 'layout-grid', '카테고리'], ['blog', URL.blog, 'newspaper', '블로그'], ['recent', URL.recent, 'clock', '최근']]
    .map(function (t) { return '<a href="' + t[1] + '" data-tab="' + t[0] + '"' + (PAGE.tab === t[0] ? ' aria-current="page"' : '') + '>' + icon(t[2]) + '<span>' + t[3] + '</span></a>'; }).join('');
  document.body.appendChild(tabbar);
  document.body.classList.add('ds-has-tabbar');
  function tabActive(key) {
    Array.prototype.forEach.call(tabbar.querySelectorAll('a[data-tab]'), function (a) { if (a.getAttribute('data-tab') === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }

  // ── 카테고리 시트(모바일 탭바 "카테고리", 10/21): 12개 카테고리 2열 타일 → 허브. 상황 시트와 같은 부품,
  //    해시 #c 한 칸을 남겨 뒤로가기로 닫힌다. 탭바는 가리지 않고 열린 동안 활성 탭 = 카테고리 ──
  var csheet = null, csFocus = null;
  function csBuild(d) {
    csheet = document.createElement('div');
    csheet.className = 'h-sheet h-catsheet'; csheet.id = 'h-catsheet'; csheet.hidden = true;
    csheet.innerHTML = '<div class="h-sheet-backdrop" data-close></div>' +
      '<div class="h-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="h-catsheet-title" tabindex="-1">' +
        '<div class="h-sheet-grip" aria-hidden="true"></div>' +
        '<button type="button" class="ds-icon-btn h-sheet-x" data-close aria-label="닫기">' + icon('x') + '</button>' +
        '<h2 class="h-catsheet-title" id="h-catsheet-title">카테고리</h2>' +
        '<ul class="h-cat-tiles">' + d.cats.map(function (c) {
          return '<li style="' + catVar(c.key) + '"><a href="/calc/' + c.key + '/" data-cat="' + c.key + '"><span class="ds-cat-ico">' + icon(c.icon) + '</span><b>' + esc(c.name) + '</b><small>계산기 ' + c.count + '개</small></a></li>';
        }).join('') + '</ul>' +
      '</div>';
    document.body.appendChild(csheet);
    csheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { csClose(); return; }
      var a = e.target.closest('a[data-cat]');
      if (a) ga('hub_calc_click', { to: a.getAttribute('href'), cat: a.getAttribute('data-cat'), slot: 'tile', from: 'tab_sheet' });
    });
  }
  function csOpen(push) {
    load('cat-menu', function (d) {
      if (!csheet) csBuild(d);
      csFocus = document.activeElement;
      csheet.hidden = false; document.body.classList.add('h-sheet-open', 'h-catsheet-open');
      if (push) history.pushState({ catsheet: 1 }, '', '#c');
      tabActive('cat');
      csheet.querySelector('.h-sheet-panel').focus({ preventScroll: true });
    }, function () { location.href = URL.categories; });
  }
  function csHide() {
    if (!csheet || csheet.hidden) return;
    csheet.hidden = true; document.body.classList.remove('h-sheet-open', 'h-catsheet-open');
    tabActive(PAGE.tab);
    if (csFocus) csFocus.focus({ preventScroll: true });
  }
  function csClose() { if (history.state && history.state.catsheet) history.back(); else csHide(); }
  tabbar.querySelector('a[data-tab="cat"]').addEventListener('click', function (e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (csheet && !csheet.hidden) csClose(); else csOpen(true);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && csheet && !csheet.hidden) csClose(); });
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.catsheet) { if (!csheet || csheet.hidden) csOpen(false); } else csHide();
  });
  // #c로 들어오면(뒤로 돌아오기 포함) 시트를 연 상태로, 한 번 더 뒤로가기면 닫힘
  if (location.hash === '#c') {
    if (!(history.state && history.state.catsheet)) { history.replaceState(null, '', location.pathname + location.search); history.pushState({ catsheet: 1 }, '', '#c'); }
    csOpen(false);
  }

  // ── 푸터 (A4): 로고 · 카테고리 4열×3 · 사이트 링크 2열 · 저작권 (문구는 footer-unified.js와 동일) ──
  var footer = document.getElementById('ds-site-footer');
  if (footer) {
    var total = window.CALC_TOTAL;
    // 저작권 줄은 전 페이지 홈 문구 하나(10/21 통일). 페이지 HTML 바닥글에 원래 있던 면책·안내 문구(의료·세무 등)는
    // 앞의 "© 2026 제이퍼 계산기"만 떼고 원문 그대로 저작권 줄 바로 위에 둔다(홈 문구와 같으면 두 번 쓰지 않는다)
    var copy = '&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 세액은 전문가에게 문의하세요.';
    var oldCopy = footer.querySelector('.footer-copy');
    var note = oldCopy ? oldCopy.textContent.replace(/\s+/g, ' ').trim().replace(/^©\s*2026\s*제이퍼\s*계산기\s*(?:\(JPT Calc\))?\s*[-.·]?\s*/, '') : '';
    // 저작권 줄과 같은 뜻의 문장("본 (계산) 결과/내용은 참고용입니다." 등)은 뺀다(10/21). 다른 정보가 든 문장은 원문 그대로
    var SAME = /^본 (계산 )?(결과|내용)[은는] 참고용(입니다|이며 정확한 (세액|내용)은 전문가에게 문의하세요)\.?$/;
    note = note.replace(/([.다요])\s+(?=\S)/g, '$1\n').split('\n').filter(function (x) { return x.trim() && !SAME.test(x.trim()); }).join(' ');
    note = note.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    footer.className = 'ds-footer site-footer';
    footer.innerHTML =
      '<div class="ds-container">' +
        '<div class="ds-footer-top">' +
          '<div class="ds-footer-brand"><a class="ds-logo" href="/" aria-label="제이퍼계산기 홈">' + logo() + '</a>' +
            (total ? '<p>계산기 ' + total + '개 · 카테고리 ' + ORDER.length + '개</p>' : '') + '</div>' +
          '<ul class="ds-footer-cats" aria-label="계산기 카테고리">' +
            ORDER.map(function (k) { return '<li><a href="/calc/' + k + '/">' + CATS[k].name + '</a></li>'; }).join('') + '</ul>' +
          '<div class="ds-footer-links footer-links">' +
            '<ul><li><a href="/">홈</a></li><li><a href="/about.html">소개</a></li><li><a href="/blog/">블로그</a></li></ul>' +
            '<ul><li><a href="/privacy.html">개인정보처리방침</a></li><li><a href="/terms.html">이용약관</a></li><li><a href="/contact.html">문의하기</a></li><li><a href="/disclaimer.html">면책조항</a></li></ul>' +
          '</div>' +
        '</div>' +
        (note ? '<p class="ds-footer-note">' + note + '</p>' : '') +
        '<p class="ds-footer-copy footer-copy">' + copy + '</p>' +
      '</div>';
  }

  // ── 쿠키 동의 (footer-unified.js가 하던 일) ──
  if (!document.getElementById('jpt-cookie-bar') && !document.querySelector('script[src*="cookie-consent"]')) {
    var cc = document.createElement('script'); cc.src = '/assets/cookie-consent.js?v=6898ebae'; cc.defer = true; document.body.appendChild(cc);
  }

  // ── 최근 사용 기록 (51 시안 데이터): 이 기기에만 저장, 실패해도 페이지는 그대로 ──
  var RECENT_KEY = 'jpt_recent';
  function saveRecent(summary) {
    if (PAGE.type !== 'calc') return;
    try {
      var h1 = document.querySelector('h1');
      var list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter(function (r) { return r.url !== path; });
      var prev = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter(function (r) { return r.url === path; })[0];
      list.unshift({ url: path, name: h1 ? h1.textContent.trim() : document.title, cat: PAGE.cat, t: Date.now(), summary: summary || (prev && prev.summary) || '' });
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 10)));
    } catch (e) { /* 저장소를 못 쓰는 환경 */ }
  }
  saveRecent();

  // ── 하단 결과 바 (B2) ──
  // 페이지는 DS.resultBar.set({...})만 부른다. 판정·숫자는 필수값이 다 찼을 때만(remaining 0) 보인다.
  //   started: 사용자가 입력을 시작했는가 / remaining: 비어 있는 필수값 수 / waitText: 미완성 문구
  //   label·value·verdict·tone('ok'|'bad'): 완성 상태 / target: 결과 카드(보이면 바를 숨김)
  var rbar = document.createElement('div');
  rbar.className = 'ds-rbar'; rbar.hidden = true; rbar.setAttribute('role', 'status');
  rbar.innerHTML = '<span class="ds-rbar-dot" aria-hidden="true"></span><span class="ds-rbar-main"></span><button type="button" class="ds-rbar-act"></button>';
  document.body.appendChild(rbar);
  var RB = { started: false }, kb = false;
  var FIELD = 'input:not([type=button]):not([type=checkbox]):not([type=radio]):not(.ds-search-input), textarea, select';
  function targetVisible() {
    // 결과 카드가 길면 카드 전체가 아니라 주 숫자가 보이는지로 판단(주 숫자가 보이면 바는 숨김)
    var t = RB.target && (RB.target.querySelector('.ds-result-number, .rh-value, .result-total-value') || RB.target);
    if (!t || !t.getClientRects().length) return false;
    var r = t.getBoundingClientRect(), vv = window.visualViewport;
    var bottom = (vv ? vv.height + vv.offsetTop : innerHeight) - rbar.offsetHeight - (kb ? 0 : tabbar.offsetHeight);
    return r.top >= (header ? header.offsetHeight : 0) && r.bottom <= bottom;
  }
  function renderBar() {
    var done = RB.remaining === 0 && RB.value != null;
    rbar.classList.toggle('is-wait', !done);
    rbar.classList.toggle('is-bad', done && RB.tone === 'bad');
    rbar.classList.toggle('is-warn', done && RB.tone === 'warn');
    rbar.classList.toggle('is-plain', done && !RB.verdict);  // 판정 없는 금액 결과(LTV·취득세): 점 없이
    var main = done
      ? '<b>' + esc(RB.label + ' ' + RB.value) + '</b>' + (RB.verdict ? ' · <span class="ds-rbar-verdict">' + esc(RB.verdict) + '</span>' : '')
      : esc(RB.waitText || '값을 모두 입력하면 계산됩니다');
    var act = kb ? '완료' : done ? '결과 보기' + icon('chevron-up') : RB.ready ? '계산하기' : RB.remaining + '개 남음';
    // 스크롤마다 다시 그리지 않는다(바뀐 경우만): decorate()의 MutationObserver가 매번 돌지 않게
    if (main !== RB._main) { rbar.querySelector('.ds-rbar-main').innerHTML = main; RB._main = main; }
    if (act !== RB._act) { rbar.querySelector('.ds-rbar-act').innerHTML = act; RB._act = act; }
    // 미완성 상태는 결과가 아직 없으므로 결과 카드 위치와 상관없이 보인다
    var show = RB.started && (kb || !done || !targetVisible());
    rbar.hidden = !show;
    document.body.classList.toggle('ds-rbar-on', show && !kb);
  }
  // 키보드: visualViewport가 레이아웃 높이보다 크게 줄고 입력칸에 포커스가 있으면 열린 것으로 본다
  var fullH = innerHeight;
  function syncKeyboard() {
    var vv = window.visualViewport;
    var gap = vv ? innerHeight - vv.height - vv.offsetTop : 0;
    var focused = document.activeElement && document.activeElement.matches && document.activeElement.matches(FIELD);
    // 크롬이 레이아웃 자체를 키보드만큼 줄이는 경우도 있다: 키보드 없을 때 높이를 기억해 두고 그보다 크게 줄면 키보드
    if (!focused || innerHeight > fullH) fullH = Math.max(innerHeight, focused ? fullH : 0);
    kb = !!(focused && (gap > 120 || fullH - innerHeight > 120));
    document.body.classList.toggle('ds-kb', kb);
    rbar.style.setProperty('--kb-bottom', kb ? gap + 'px' : '0px');
    if (RB.started) renderBar();
    // 키보드 위 결과 바가 포커스된 칸을 가리면 그만큼 올린다
    if (kb && RB.started && !rbar.hidden) {
      var f = document.activeElement.closest('.input-wrap') || document.activeElement;
      var over = f.getBoundingClientRect().bottom + 8 - rbar.getBoundingClientRect().top;
      if (over > 0) window.scrollBy({ top: over, behavior: 'smooth' });
    }
  }
  rbar.addEventListener('click', function (e) {
    if (kb) { if (document.activeElement) document.activeElement.blur(); setTimeout(syncKeyboard, 0); return; }
    if (RB.remaining > 0) {
      var empty = (RB.required || []).filter(function (el) { return el && !el.value; })[0];
      if (empty) { empty.focus(); return; }
      if (RB.ready) {   // 계산 버튼을 대신 누른다(새 버튼 → 원본 버튼 순)
        var go = document.querySelector('.ds-btn-calc') || Array.prototype.find.call(document.querySelectorAll('main button'), function (b) { return /계산하기|계산$|확인하기|변환하기/.test(b.textContent.trim()) && b.offsetParent; });
        if (go) { go.click(); setTimeout(function () { if (RB.target) goTarget(); }, 150); }
        return;
      }
    }
    if (RB.target) goTarget();
  });
  // 결과로 이동: 헤더 높이만큼 띄우고, 키보드가 닫히며 화면 크기가 바뀌어 부드러운 스크롤이 끊기면 한 번 더 맞춘다
  function goTarget() {
    var y = function () { return Math.max(0, RB.target.getBoundingClientRect().top + scrollY - (header ? header.offsetHeight : 0) - 12); };
    window.scrollTo({ top: y(), behavior: 'smooth' });
    setTimeout(function () { if (Math.abs(y() - scrollY) > 8) window.scrollTo({ top: y(), behavior: 'auto' }); }, 600);
  }
  window.addEventListener('scroll', function () { if (RB.started) renderBar(); }, { passive: true });
  window.addEventListener('resize', syncKeyboard);
  if (window.visualViewport) { visualViewport.addEventListener('resize', syncKeyboard); visualViewport.addEventListener('scroll', syncKeyboard); }
  document.addEventListener('focusin', syncKeyboard);
  document.addEventListener('focusout', function () { setTimeout(syncKeyboard, 0); });
  var resultBar = {
    set: function (o) {
      for (var k in o) RB[k] = o[k];
      if (RB.remaining === 0 && RB.value != null) saveRecent(RB.label + ' ' + RB.value);
      renderBar();
    }
  };

  // ── 숫자 입력칸 천 단위 콤마 (input[data-ds-num]) ──
  // 캡처 단계에서 먼저 바꿔 두므로 페이지의 oninput 계산은 콤마가 붙은 값을 받는다(페이지는 콤마를 빼고 계산).
  // 숫자 외 글자는 지워지므로 음수·문자 입력이 들어가지 않는다. 커서는 같은 자릿수 뒤로 돌려놓는다.
  function formatNum(el) {
    var v = el.value, pos = el.selectionStart == null ? v.length : el.selectionStart;
    var before = v.slice(0, pos).replace(/\D/g, '').length;
    var digits = v.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 12);
    var out = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (out === v) return;
    el.value = out;
    if (document.activeElement !== el) return;
    var i = 0, c = 0;
    while (i < out.length && c < before) { if (/\d/.test(out[i])) c++; i++; }
    try { el.setSelectionRange(i, i); } catch (e) { /* 일부 브라우저 */ }
  }
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches('input[data-ds-num]')) formatNum(e.target); }, true);
  document.querySelectorAll('input[data-ds-num]').forEach(formatNum);

  // ── 목차 칩(.ds-toc): 스크롤 위치의 현재 구간 칩을 선택 상태로, 칩 줄 안에서 보이게 가로 이동 ──
  var toc = document.querySelector('.ds-toc');
  if (toc) {
    var tocLinks = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var tocTargets = tocLinks.map(function (a) { return document.getElementById(decodeURIComponent(a.hash.slice(1))); });
    var tocCur = -2, tocTick = false;
    var spy = function () {
      tocTick = false;
      var line = (header ? header.offsetHeight : 0) + toc.offsetHeight + 24, cur = -1;
      tocTargets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) cur = i; });
      if (cur === tocCur) return;
      tocCur = cur;
      tocLinks.forEach(function (a, i) {
        a.classList.toggle('is-active', i === cur);
        if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      var on = tocLinks[cur];
      if (on) toc.scrollTo({ left: Math.max(0, on.offsetLeft - toc.clientWidth / 2 + on.offsetWidth / 2), behavior: 'smooth' });
    };
    window.addEventListener('scroll', function () { if (!tocTick) { tocTick = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  // ── 공통 스크립트 출력에 아이콘 붙이기 ──
  /* ── 본문 표(10/21): 가로 스크롤 상자에 넣고, 실제로 넘칠 때만 오른쪽 끝 흐림 + 표 위 "옆으로 밀어서 보기".
     이미 가로 스크롤 상자(.table-wrap 등)에 들어 있으면 그것을 쓴다. 계산 입력·결과 칸의 표는 건드리지 않는다 ── */
  // 표 칸: 띄어쓰기로 나뉜 낱말마다 줄바꿈 금지 덩어리(.ds-w)로(꺾임은 띄어쓰기에서만: ·()~-/ 앞뒤에서 글자가 쪼개지지 않게),
  // 숫자 뒤에 띄어 쓴 단위("155 cm")는 붙여서 한 덩어리. 칸마다 한 번(data-dsw), 나중에 그려지는 결과 표도 decorate가 부른다
  var UNIT_RE = /^(만원|억원|천원|원|%|세|살|개월|년|월|일|주|배|명|회|건|개|kg|cm|㎡|m²|평|시간|분|초|점|kcal)/;
  function cellWords() {
    Array.prototype.forEach.call(document.querySelectorAll('main table :is(td, th):not([data-dsw])'), function (c) {
      c.setAttribute('data-dsw', '');
      var tw = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), nodes = [], n;
      while ((n = tw.nextNode())) if (/\S\S|\d\s+\S/.test(n.nodeValue) && !(n.parentNode.closest && n.parentNode.closest('.ds-w'))) nodes.push(n);
      nodes.forEach(function (n) {
        var parts = n.nodeValue.split(/(\s+)/), frag = document.createDocumentFragment();
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if (/\d$/.test(p) && /^\s+$/.test(parts[i + 1] || '') && UNIT_RE.test(parts[i + 2] || '')) { p = p + '\u00a0' + parts[i + 2]; i += 2; }
          if (p.length >= 2 && !/^\s+$/.test(p)) { var sp = document.createElement('span'); sp.className = 'ds-w'; sp.textContent = p; frag.appendChild(sp); }
          else if (p) frag.appendChild(document.createTextNode(p));
        }
        n.parentNode.replaceChild(frag, n);
      });
      // 태그 경계에 띄어쓰기 없이 붙은 낱말(<b>총지출</b>(보험료 …)도 한 덩어리로: 짧은 태그(20자 이하)와 붙은 덩어리를 같이 감싼다
      Array.prototype.forEach.call(c.querySelectorAll('.ds-w'), function (w) {
        [['previousSibling', 'afterbegin'], ['nextSibling', 'beforeend']].forEach(function (d) {
          var e = w[d[0]];
          if (!e || e.nodeType !== 1 || e.classList.contains('ds-w') || e.tagName === 'BR' || !w.parentNode) return;
          var t = e.textContent;
          if (!t || t.length > 20 || (d[0] === 'previousSibling' ? /\s$/ : /^\s/).test(t)) return;
          if (d[0] === 'previousSibling') w.insertBefore(e, w.firstChild); else w.appendChild(e);
        });
      });
    });
  }
  function tsState(w) {
    var over = w.scrollWidth > w.clientWidth + 1, end = w.scrollLeft + w.clientWidth >= w.scrollWidth - 2;
    w.classList.toggle('is-over', over); w.classList.toggle('is-end', over && end);
    var h = w.previousElementSibling && w.previousElementSibling.classList.contains('ds-tscroll-hint') ? w.previousElementSibling : null;
    if (over && !h) { h = document.createElement('p'); h.className = 'ds-tscroll-hint'; h.innerHTML = '옆으로 밀어서 보기' + icon('arrow-right', 'ds-i-sm'); w.parentNode.insertBefore(h, w); }
    if (!over && h) h.parentNode.removeChild(h);
  }
  function tableScroll() {
    cellWords();
    Array.prototype.forEach.call(document.querySelectorAll('main table'), function (t) {
      if (t.closest('.ds-calc-input, .ds-calc-result')) return;
      var w = t.parentElement;
      if (!w.classList.contains('ds-tscroll')) {
        if (/(auto|scroll)/.test(getComputedStyle(w).overflowX) && w.children.length === 1) w.classList.add('ds-tscroll');
        else { var d = document.createElement('div'); d.className = 'ds-tscroll'; t.parentNode.insertBefore(d, t); d.appendChild(t); w = d; }
        w.addEventListener('scroll', function () { tsState(w); }, { passive: true });
      }
      tsState(w);
    });
  }
  var tsT = 0;
  window.addEventListener('resize', function () { clearTimeout(tsT); tsT = setTimeout(tableScroll, 150); });
  window.addEventListener('load', tableScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tableScroll);
  tableScroll();

  /* ── 신뢰성 정보 통합(10/21): 계산기·블로그 글 하단의 작성자 카드(.article-info)·신뢰성 정보 카드(.trust-block)·
     "○년 기준 작성" 상자(.update-note)·검토 안내 줄(.review-footer)을 신뢰성 정보 카드 하나로.
     순서: 작성 · 검토 · 기준 · 참고 기관 · 예외 · 확인처 · (관련 계산기) · 검토 안내. 문구는 원문 그대로, 같은 문장은 한 번만.
     각 스크립트가 늦게 그리므로 다 나타난 뒤 한 번만 한다(decorate가 부른다) ── */
  // 검토 안내 의미 그룹(10/22): 출처가 달라도 뜻이 같은 문장은 그룹에서 처음 나온 것만 남긴다(남긴 문장은 원문 그대로)
  var NOTE_GROUPS = [['info', /정보 제공 목적/], ['expert', /기관 또는 전문가|전문가에게 (확인|문의)/]];
  function noteGroup(x) { for (var i = 0; i < NOTE_GROUPS.length; i++) if (NOTE_GROUPS[i][1].test(x)) return NOTE_GROUPS[i][0]; return ''; }
  function trustLate(card) {   // 통합 뒤에 늦게 그려진 검토 안내·○년 기준 상자도 카드에 합친다(같은 문장은 한 번만)
    var disc = card.querySelector('.trust-block__disclaimer'), meta = card.querySelector('.trust-block__meta');
    Array.prototype.forEach.call(document.querySelectorAll('.review-footer'), function (r) {
      var t = r.querySelector('.review-footer__text'), add = (t ? t.textContent : r.textContent.replace(/^\s*검토 안내/, '')).replace(/\s+/g, ' ').trim();
      if (!disc) { card.insertAdjacentHTML('beforeend', '<hr class="trust-block__divider"><p class="trust-block__disclaimer"><b>검토 안내</b></p>'); disc = card.querySelector('.trust-block__disclaimer'); }
      var src = JSON.parse(card.getAttribute('data-notes-src') || '[]'), have = JSON.parse(card.getAttribute('data-notes-shown') || '[]');
      add.replace(/([.다요])\s+(?=\S)/g, '$1\n').split('\n').forEach(function (x) {
        x = x.trim(); if (!x) return;
        if (src.indexOf(x) < 0) src.push(x);
        var g = noteGroup(x);
        if (have.indexOf(x) >= 0 || (g && have.some(function (y) { return noteGroup(y) === g; }))) return;
        have.push(x); disc.insertAdjacentText('beforeend', ' ' + x);
      });
      card.setAttribute('data-notes-src', JSON.stringify(src)); card.setAttribute('data-notes-shown', JSON.stringify(have));
      r.parentNode.removeChild(r);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.update-note'), function (u) {
      var body = u.querySelector(':scope > div') || u, h = body.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').trim();
      if (meta && h) meta.insertAdjacentHTML('beforeend', '<div class="trust-block__field is-text"><span class="trust-block__value">' + h + '</span></div>');
      u.parentNode.removeChild(u);
    });
  }
  function trustUnify() {
    var done = document.querySelector('.ds-trust-unified');
    if (done) { if (document.querySelector('.review-footer, .update-note')) trustLate(done); return; }
    var ai = document.querySelector('.article-info'), tb = document.querySelector('.trust-block');
    if ((window.TRUST_BLOCK_CONFIG && !tb) || (window.ARTICLE_INFO_CONFIG && !ai) || (!ai && !tb)) return;
    var uns = Array.prototype.slice.call(document.querySelectorAll('.update-note')), rfs = Array.prototype.slice.call(document.querySelectorAll('.review-footer'));
    var G = { a: [], r: [], b: [], o: [], x: [], c: [], k: [] }, notes = [];
    var txt = function (h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent.replace(/\s+/g, ' ').trim(); };
    var grp = function (l) { return /기관/.test(l) ? 'o' : /검토일|^검토$/.test(l) ? 'r' : /^작성(자)?$/.test(l) ? 'a' : 'b'; };
    var field = function (label, html) {
      var g = G[grp(label)], t = txt(html);
      if (!t) return;
      for (var i = 0; i < g.length; i++) {   // 같은 칸 이름에 한쪽이 다른 쪽의 앞부분이면(2026.05 / 2026.05.12) 긴 쪽만
        var u = txt(g[i][1]);
        if (g[i][0] === label && (u.indexOf(t) === 0 || t.indexOf(u) === 0)) { if (t.length > u.length) g[i][1] = html; return; }
        if (u === t) return;
      }
      g.push([label, html]);
    };
    var sent = function (t) {   // 검토 안내 문장: 문장 단위로 같은 것은 한 번만
      (t || '').replace(/\s+/g, ' ').trim().replace(/([.다요])\s+(?=\S)/g, '$1\n').split('\n').forEach(function (x) { x = x.trim(); if (x && notes.indexOf(x) < 0) notes.push(x); });
    };
    if (ai) {
      ai.querySelectorAll('.article-info__item').forEach(function (it) {
        var l = it.querySelector('.article-info__label'), v = it.querySelector('.article-info__value');
        if (l && v) field(l.textContent.trim(), v.innerHTML.trim());
      });
      ai.querySelectorAll('.article-info__calc').forEach(function (c) { var a = c.querySelector('a'); if (a) G.k.push(['관련 계산기', a.outerHTML]); });
      ai.querySelectorAll('.article-info__disclaimer').forEach(function (d) { sent(d.textContent); });
    }
    if (tb) {
      tb.querySelectorAll('.trust-block__field').forEach(function (f) {
        var l = f.querySelector('.trust-block__label'), v = f.querySelector('.trust-block__value');
        if (l && v) field(l.textContent.trim(), v.innerHTML.trim());
      });
      tb.querySelectorAll('.trust-block__section').forEach(function (sct) {
        var l = sct.querySelector('.trust-block__section-label'), list = sct.querySelector('ul');
        if (!l || !list) return;
        (/예외/.test(l.textContent) ? G.x : G.c).push([l.textContent.trim(), list.outerHTML]);
      });
      tb.querySelectorAll('.trust-block__disclaimer').forEach(function (d) { sent(d.textContent); });
    }
    uns.forEach(function (u) {   // "○년 기준 작성" 문장은 기준 묶음에(링크 포함 원문)
      var body = u.querySelector(':scope > div') || u, h = body.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').trim();
      if (txt(h)) G.b.push(['', h]);
    });
    rfs.forEach(function (r) { var t = r.querySelector('.review-footer__text'); sent(t ? t.textContent : r.textContent.replace(/^\s*검토 안내/, '')); });
    var notesSrc = notes.slice(), seenG = {};
    notes = notes.filter(function (x) { var g = noteGroup(x); if (!g) return true; if (seenG[g]) return false; seenG[g] = 1; return true; });
    var row = function (f) { return '<div class="trust-block__field' + (f[0] ? '' : ' is-text') + '">' + (f[0] ? '<span class="trust-block__label">' + esc(f[0]) + '</span>' : '') + '<span class="trust-block__value">' + f[1] + '</span></div>'; };
    var sec = function (f) { return '<div class="trust-block__section"><span class="trust-block__section-label">' + esc(f[0]) + '</span>' + f[1] + '</div>'; };
    var card = document.createElement('div');
    card.className = 'trust-block ds-trust-unified'; card.setAttribute('role', 'region'); card.setAttribute('aria-label', '신뢰성 정보');
    card.setAttribute('data-notes-src', JSON.stringify(notesSrc)); card.setAttribute('data-notes-shown', JSON.stringify(notes));   // 검사용: 합치기 전 원문 문장·보인 문장
    card.innerHTML = '<p class="trust-block__title">' + icon('shield-check') + '신뢰성 정보</p>' +
      '<div class="trust-block__meta">' + G.a.concat(G.r, G.b, G.o).map(row).join('') + '</div>' +
      G.x.concat(G.c).map(sec).join('') +
      (G.k.length ? '<div class="trust-block__meta">' + G.k.map(row).join('') + '</div>' : '') +
      (notes.length ? '<hr class="trust-block__divider"><p class="trust-block__disclaimer"><b>검토 안내</b> ' + notes.map(esc).join(' ') + '</p>' : '');
    var at = tb || ai;
    at.parentNode.insertBefore(card, at);
    [ai, tb].concat(uns, rfs).forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
  }

  /* 한 줄 버튼(10/22): 글자가 칸보다 길면 칸 폭에 맞게 글자를 줄인다(최소 --fs-meta). 그래도 넘치면 CSS 말줄임 */
  var FIT1 = '.ds-post-body .cta-btn, .ds-btn-primary, .ds-btn-outline, .ds-table-cta';
  function fitOneLine() {
    var min = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-meta')) || 13;
    Array.prototype.forEach.call(document.querySelectorAll(FIT1), function (el) {
      if (!el.getClientRects().length) return;
      el.style.fontSize = '';
      var w = el.clientWidth, s = el.scrollWidth;
      if (!w || s <= w + 1) return;
      var cs = getComputedStyle(el), size = parseFloat(cs.fontSize), side = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      for (var k = 0; k < 6 && s > w + 1 && size > min; k++) {   // 여백을 뺀 칸 비율로 줄이고, 아이콘·간격 몫은 다시 재서 맞을 때까지
        size = Math.max(min, Math.floor(size * (w - side - 1) / (s - side) * 10) / 10);
        el.style.fontSize = size + 'px'; w = el.clientWidth; s = el.scrollWidth;
      }
    });
  }
  var f1T = 0;
  window.addEventListener('resize', function () { clearTimeout(f1T); f1T = setTimeout(fitOneLine, 150); });
  window.addEventListener('load', fitOneLine);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitOneLine);

  function decorate() {
    document.querySelectorAll('.jn-ico').forEach(function (el) {
      if (el.querySelector('.ds-i')) return;
      el.innerHTML = icon(emojiIcon(el.textContent), 'ds-i-sm');
    });
    // 결과 아래 원본 도구 줄: "저장·공유" 버튼 하나로 접기(누르면 펼침, 각 기능은 원본 그대로)
    document.querySelectorAll('.action-row').forEach(function (row) {
      if (row.querySelector('.ds-tools-toggle')) return;
      var tools = Array.prototype.filter.call(row.querySelectorAll('.action-btn'), function (b) { return !b.classList.contains('ds-dup') && !/복사/.test(b.textContent); });
      if (!tools.length) return;
      var t = document.createElement('button');
      t.type = 'button'; t.className = 'action-btn ds-tools-toggle'; t.setAttribute('aria-expanded', 'false');
      t.innerHTML = icon('share-2') + '<span>저장·공유</span>' + icon('chevron-down');
      t.addEventListener('click', function () { var open = row.classList.toggle('ds-tools-closed') === false; t.setAttribute('aria-expanded', open); });
      row.classList.add('ds-tools-closed'); row.insertBefore(t, row.firstChild);
    });
    // 기록 패널 삭제 버튼의 글자 아이콘(✕) → 라인 아이콘(원본 스크립트는 그대로)
    document.querySelectorAll('.hi-delete').forEach(function (d) {
      if (d.querySelector('.ds-i')) return;
      d.innerHTML = icon('x', 'ds-i-sm'); d.setAttribute('aria-label', '기록 삭제');
    });
    var jt = document.querySelector('.jcalc-next__title');
    if (jt && !jt.querySelector('.ds-i')) jt.insertAdjacentHTML('afterbegin', icon('arrow-right', 'ds-i-sm'));
    var tt = document.querySelector('.trust-block__title');
    if (tt && !tt.querySelector('.ds-i')) tt.insertAdjacentHTML('afterbegin', icon('shield-check'));
    var rf = document.querySelector('.review-footer');
    if (rf && !rf.querySelector('.ds-i')) rf.insertAdjacentHTML('afterbegin', icon('clipboard-list'));
    var un = document.querySelector('.update-note');
    if (un && !un.querySelector('.ds-i')) { un.innerHTML = icon('calendar-days') + '<div>' + un.innerHTML + '</div>'; }
    trustUnify();
    if (document.querySelector('main table :is(td, th):not([data-dsw])')) { cellWords(); tableScroll(); }
    // 쿠키 배너: 문구를 감싸서 한 줄 말줄임(링크·버튼은 그대로)
    var cb = document.getElementById('jpt-cookie-bar');
    // position:fixed라 offsetParent는 항상 null → 실제 그려졌는지(display·크기)로 판정
    var cbOn = !!(cb && getComputedStyle(cb).display !== 'none' && cb.getBoundingClientRect().height > 0);
    document.body.classList.toggle('ds-has-cookie', cbOn);
    if (cb && !cb.querySelector('.ds-cookie-text')) {
      var p = cb.querySelector('p');
      if (p && p.firstChild && p.firstChild.nodeType === 3) {
        var span = document.createElement('span'); span.className = 'ds-cookie-text';
        span.textContent = p.firstChild.nodeValue.trim(); p.replaceChild(span, p.firstChild);
      }
    }
    // 계산기 하단 다른 계산기·관련 가이드는 아이콘 없는 목록 줄(2026-10-20): 꾸미지 않는다
  }
  // ── GA4 이벤트(brief 측정 계획): 페이지에 이미 있는 gtag만 쓴다. 입력값·결과값은 보내지 않는다 ──
  //   calc_start / calc_complete / result_copy / next_calc_click (계산기), hub_calc_click (허브), blog_calc_click (블로그 글)
  function ga(name, p) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ transport_type: 'beacon' }, p || {})); } catch (e) {}
  }
  var calcPath = function (href) { var m = String(href || '').match(/\/calc\/[a-z-]+\/(?:[a-z0-9-]+\/)?/); return m ? m[0] : ''; };
  if (PAGE.type === 'calc') {
    var started = false, completed = false, base = { calc: path, cat: PAGE.cat };
    var markStart = function (e) {
      if (started || !e.target || !e.target.closest) return;
      var t = e.target;
      if (t.closest('.ds-search-field, .ds-header, .ds-menu, #jpt-cookie-bar')) return;
      if (!t.closest('main, .ds-calc, .ds-input-card')) return;
      if (e.type === 'click' && !t.closest('.seg-btn, .ds-btn-calc, button[onclick]')) return;
      started = true; ga('calc_start', base);
    };
    document.addEventListener('input', markStart, true); document.addEventListener('change', markStart, true); document.addEventListener('click', markStart, true);
    var setBar = resultBar.set;
    resultBar.set = function (o) {
      setBar.apply(this, arguments);
      if (!completed && o && o.remaining === 0 && o.value != null) { completed = true; ga('calc_complete', base); }
    };
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      var cp = t.closest('button, a');
      // 새 '결과 복사'가 숨긴 원본 '복사'를 스크립트로 한 번 더 누르므로 사람이 누른 클릭만 센다
      if (e.isTrusted && cp && /복사/.test(cp.textContent) && cp.closest('main, .ds-calc, .action-row')) ga('result_copy', base);
      var a = t.closest('a[href*="/calc/"]');
      if (a && a.closest('.ds-calc-next, .ds-next, #ds-primary-next, .ds-result-actions, .jcalc-next')) {
        ga('next_calc_click', Object.assign({ to: calcPath(a.getAttribute('href')), slot: a.id === 'ds-primary-next' ? 'primary' : a.closest('.ds-related') ? 'related' : 'next' }, base));
      }
    }, true);
  } else if (PAGE.type === 'hub') {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('main a[href*="/calc/"]') : null;
      if (a && calcPath(a.getAttribute('href')).split('/').length > 4) ga('hub_calc_click', { to: calcPath(a.getAttribute('href')), cat: PAGE.cat, slot: a.classList.contains('ds-hub-row') ? 'list' : 'content' });
    }, true);
  } else if (PAGE.type === 'post') {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('main a[href*="/calc/"]') : null;
      if (!a) return;
      var slot = a.classList.contains('ds-post-cta') ? 'cta_top' : a.closest('.cta-box') ? 'cta_box' : a.closest('.article-info') ? 'info' : 'body';
      ga('blog_calc_click', { to: calcPath(a.getAttribute('href')), slot: slot, post: path });
    }, true);
  }

  window.DS = { icon: icon, decorate: decorate, resultBar: resultBar, page: PAGE, ga: ga };
  decorate();
  // 결과 도구·신뢰 블록은 뒤에서 그려지므로 변화가 생기면 다시 꾸민다
  new MutationObserver(function () { decorate(); }).observe(document.body, { childList: true, subtree: true });
  // 쿠키 '동의'는 style만 바꾸므로 클릭 뒤 다시 확인
  document.addEventListener('click', function (e) { if (e.target && e.target.id === 'jpt-cookie-ok') setTimeout(decorate, 0); }, true);
  // 셸이 늦게 붙으므로, 먼저 계산된 페이지가 있으면 알려 준다
  document.dispatchEvent(new CustomEvent('ds:ready'));
})();

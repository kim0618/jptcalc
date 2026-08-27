
(function(){
  const PREFIX = 'jcalc_history::';
  const MAX_ITEMS = 30;

  function injectStyles(){
    if (document.getElementById('jcalc-result-tools-style')) return;
    const style = document.createElement('style');
    style.id = 'jcalc-result-tools-style';
    style.textContent = `
      .action-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;margin-bottom:16px}
      .action-btn{flex:1 1 0%;min-width:0;display:flex;align-items:center;justify-content:center;gap:5px;padding:11px 8px;border:1.5px solid var(--gray-200, #E5E7EB);border-radius:12px;background:#fff;font-size:12px;font-weight:700;color:var(--gray-500, #6B7280);cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap}
      .action-btn:hover{border-color:var(--primary, #3B82F6);color:var(--primary, #3B82F6)}
      .action-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      .history-panel{margin-top:12px;display:none}
      .history-panel.show{display:block}
      .history-item{background:#fff;border:1px solid var(--gray-200, #E5E7EB);border-radius:12px;padding:12px 14px;margin-bottom:8px;position:relative;cursor:pointer;transition:border-color .2s}
      .history-item:hover{border-color:var(--primary, #3B82F6)}
      .history-item .hi-title{font-size:12px;font-weight:700;color:var(--gray-700, #374151);margin-bottom:4px;padding-right:20px}
      .history-item .hi-detail{font-size:11px;color:var(--gray-400, #9CA3AF);line-height:1.5;white-space:pre-line}
      .history-item .hi-result{font-size:14px;font-weight:800;color:var(--primary, #3B82F6);margin-top:4px}
      .history-item .hi-delete{position:absolute;top:10px;right:10px;width:22px;height:22px;border:none;background:var(--gray-100, #F3F4F6);border-radius:6px;color:var(--gray-400, #9CA3AF);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
      .history-item .hi-delete:hover{background:#EF4444;color:#fff}
      .history-empty{text-align:center;padding:20px;font-size:12px;color:var(--gray-400, #9CA3AF)}
      .history-clear-all{display:block;width:100%;padding:10px;border:none;background:var(--gray-100, #F3F4F6);border-radius:10px;font-size:12px;font-weight:600;color:var(--gray-400, #9CA3AF);cursor:pointer;margin-top:4px}
      .history-clear-all:hover{background:#EF4444;color:#fff}
      .jcalc-next{margin-top:16px;padding-top:14px;border-top:1px solid var(--gray-100,#F3F4F6)}
      .jcalc-next__title{font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--gray-500,#6B7280);margin-bottom:9px}
      .jcalc-next__calcs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      .jcalc-next__calc{display:flex;align-items:center;justify-content:center;gap:5px;min-width:0;padding:11px 8px;border:1.5px solid var(--gray-200,#E5E7EB);border-radius:12px;background:#fff;font-size:12.5px;font-weight:700;color:var(--gray-700,#374151);text-decoration:none;transition:all .2s}
      .jcalc-next__calc:hover{border-color:var(--primary,#3B82F6);color:var(--primary,#3B82F6)}
      .jcalc-next__calc .jn-ico{flex-shrink:0;font-size:13px;line-height:1}
      .jcalc-next__calc .jn-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
      .jcalc-next__guide{display:flex;align-items:center;gap:7px;margin-top:8px;padding:10px 12px;border-radius:10px;background:var(--gray-50,#F9FAFB);border:1px solid var(--gray-100,#F3F4F6);font-size:12px;font-weight:600;color:var(--gray-600,#4B5563);text-decoration:none}
      .jcalc-next__guide:hover{border-color:var(--primary,#3B82F6);color:var(--primary,#3B82F6)}
      .jcalc-next__guide .jn-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
      @media (max-width:520px){
        .jcalc-next__calcs{grid-template-columns:1fr;gap:6px}
        .jcalc-next__calc{justify-content:flex-start;padding:12px 13px}
      }
      .toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;opacity:0;transition:opacity .3s;pointer-events:none}
      .toast.show{opacity:1}
    `;
    document.head.appendChild(style);
  }

  function ensureToast(){
    let t = document.getElementById('toast');
    if (!t){ t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    return t;
  }
  function showToast(msg){
    const t = ensureToast();
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(()=>t.classList.remove('show'), 1800);
  }

  function loadHtml2Canvas(){
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (loadHtml2Canvas._promise) return loadHtml2Canvas._promise;
    loadHtml2Canvas._promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = () => resolve(window.html2canvas);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return loadHtml2Canvas._promise;
  }

  function isVisible(el){
    if (!el) return false;
    const st = window.getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden' && el.offsetParent !== null;
  }

  function pageTitle(){
    const h1 = document.querySelector('h1');
    return (h1 && h1.textContent.trim()) || document.title.split('|')[0].trim() || '계산기';
  }

  function contextTitle(card){
    const section = card.closest('.calc-section');
    if (section){
      const sid = section.id;
      let link = sid && document.querySelector(`.tab-btn[onclick*="${sid}"], .calc-tab-link[onclick*="${sid}"]`);
      if (link) return `${pageTitle()} - ${link.textContent.trim()}`;
      const heading = section.querySelector('h2, h3, .card-title');
      if (heading) return `${pageTitle()} - ${heading.textContent.trim()}`;
    }
    const prevTitle = card.parentElement && card.parentElement.querySelector('.card-title');
    if (prevTitle) return `${pageTitle()} - ${prevTitle.textContent.trim()}`;
    return pageTitle();
  }

  function cardRows(card){
    const rows = [];
    card.querySelectorAll('.result-row').forEach((row)=>{
      const label = row.querySelector('.result-label, .result-total-label')?.textContent?.trim();
      const value = row.querySelector('.result-value, .result-total-value')?.textContent?.trim();
      if (label && value) rows.push({label, value});
    });
    // 헤드라인 박스. 두 종류가 쓰이는데 .highlight-box(hb-*)는 그동안 아예 누락돼
    // 복사·기록에 핵심 금액이 빠졌었다. 헤드라인은 항상 맨 앞에 온다
    // (기록 패널이 rows[0]을 대표값으로 쓰기 때문).
    const heads = [];
    const readHead = (box, l, v, sb)=>{
      const label = box.querySelector(l)?.textContent?.trim() || '핵심 결과';
      const value = box.querySelector(v)?.textContent?.trim();
      const sub = box.querySelector(sb)?.textContent?.trim();
      if (value) heads.push({label, value: sub ? `${value} (${sub})` : value});
    };
    card.querySelectorAll('.result-highlight').forEach(box => readHead(box, '.rh-label', '.rh-value', '.rh-sub'));
    card.querySelectorAll('.highlight-box').forEach(box => readHead(box, '.hb-label', '.hb-value', '.hb-sub'));
    return heads.concat(rows);
  }

  // 스냅샷(복사·기록·이미지)에서 빼야 하는 것: 이동 링크·액션바·광고
  const SNAP_EXCLUDE = '.jcalc-next, .action-row, .history-panel, .bridge-cta, .official-link-box, .bf-entry, .affiliate-banner, .affiliate-disclosure';

  const LABEL_RE = /(^|[-_])(label|title)$/;
  const VALUE_RE = /(^|[-_])(val|value|num|number|amount|count|total)$/;
  const hasCls = (el, re) => Array.from(el.classList).some(c => re.test(c));
  const oneLine = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  // .result-row 구조가 없는 계산기(4대보험·글자수·D-day 등) 보조 추출.
  // (2) 라벨/값 클래스 쌍  (3) flex space-between 2단 행
  function inferredRows(card){
    const rows = [];
    const seen = new Set();
    const push = (l, v) => {
      const label = oneLine(l), value = oneLine(v);
      if (!label || !value || label.length > 40) return;
      const k = label + '\u0000' + value;
      if (seen.has(k)) return;
      seen.add(k);
      rows.push({label, value});
    };
    card.querySelectorAll('*').forEach((el)=>{
      if (el.closest(SNAP_EXCLUDE)) return;
      const kids = Array.from(el.children);
      if (kids.length < 2 || kids.length > 3) return;
      const lab = kids.find(k => hasCls(k, LABEL_RE));
      const val = kids.find(k => k !== lab && hasCls(k, VALUE_RE));
      if (lab && val){ push(lab.innerText, val.innerText); return; }
      if (kids.length !== 2) return;
      if (kids[0].querySelector('a,button') || kids[1].querySelector('a,button')) return;
      let st;
      try { st = window.getComputedStyle(el); } catch(e){ return; }
      if (st.display !== 'flex' || !/space-between/.test(st.justifyContent)) return;
      push(kids[0].innerText, kids[1].innerText);
    });
    // (4) 결과를 표로 그리는 계산기(GPU 비용 비교 등)
    card.querySelectorAll('table').forEach((tbl)=>{
      if (tbl.closest(SNAP_EXCLUDE)) return;
      const heads = Array.from(tbl.querySelectorAll('thead th')).map(th => oneLine(th.innerText));
      Array.from(tbl.querySelectorAll('tbody tr')).slice(0, 12).forEach((tr)=>{
        const cells = Array.from(tr.querySelectorAll('th,td')).map(td => oneLine(td.innerText));
        if (cells.length < 2 || !cells[0]) return;
        const value = cells.slice(1).map((c, i)=>{
          const h = heads[i + 1];
          return h && c ? `${h} ${c}` : c;
        }).filter(Boolean).join(' · ');
        push(cells[0], value);
      });
    });
    return rows;
  }

  // 최후 폴백. 제외 대상의 줄을 걸러낸 innerText.
  // style을 건드리면 sync()의 MutationObserver가 다시 돌아 재진입하므로 DOM은 손대지 않는다.
  function visibleText(card){
    const drop = new Set();
    card.querySelectorAll(SNAP_EXCLUDE).forEach((n)=>{
      String(n.innerText || '').split('\n').forEach((l)=>{ const t = oneLine(l); if (t) drop.add(t); });
    });
    return card.innerText.split('\n').map(oneLine).filter(l => l && !drop.has(l)).join('\n');
  }

  function cardLabel(card){
    const direct = Array.from(card.children).find(el => el.classList.contains('rh-label'));
    return direct ? direct.textContent.trim() : '';
  }

  function pack(title, rows){
    if (!rows.length) return null;
    const summary = rows.slice(0, 2).map(r => `${r.label} ${r.value}`).join(' · ');
    return { title, rows, summary, time: new Date().toLocaleString('ko-KR') };
  }

  function extractSnapshot(card){
    if (!isVisible(card)) return null;
    let rows = cardRows(card);
    if (!rows.length) rows = inferredRows(card);
    if (!rows.length){
      const raw = visibleText(card);
      if (!raw) return null;
      rows.push({label:'계산 결과', value: raw.split('\n').slice(0,12).join(' / ')});
    }
    return pack(contextTitle(card), rows);
  }

  // data-result-group: 한 화면에 여러 result-card가 동시에 뜨는 계산기(예: 연봉 비교)는
  // 카드마다 버튼을 붙이지 않고 그룹 전체를 하나의 결과로 다룬다.
  function extractGroupSnapshot(group){
    if (!isVisible(group)) return null;
    const rows = [];
    group.querySelectorAll('.result-card').forEach((card)=>{
      if (!isVisible(card)) return;
      const prefix = cardLabel(card);
      let rs = cardRows(card);
      if (!rs.length) rs = inferredRows(card);
      if (rs.length){
        rs.forEach(r => rows.push({label: prefix ? `${prefix} ${r.label}` : r.label, value: r.value}));
      } else {
        const raw = oneLine(visibleText(card));
        if (raw) rows.push({label: prefix || '요약', value: raw});
      }
    });
    return pack(pageTitle(), rows);
  }

  function historyKey(card){ return `${PREFIX}${location.pathname}::${card.id || 'result'}`; }
  function getHistory(card){ try { return JSON.parse(localStorage.getItem(historyKey(card)) || '[]'); } catch(e){ return []; } }
  function setHistory(card, arr){ localStorage.setItem(historyKey(card), JSON.stringify(arr.slice(0, MAX_ITEMS))); }

  function renderHistory(card, panel){
    const arr = getHistory(card);
    if (!arr.length){ panel.innerHTML = '<div class="history-empty">저장된 기록이 없습니다</div>'; return; }
    panel.innerHTML = arr.map((item, idx) => {
      const detail = item.rows.slice(0, 4).map(r => `${r.label}: ${r.value}`).join('\n');
      const main = item.rows[0]?.value || '-';
      return `<div class="history-item"><button class="hi-delete" data-idx="${idx}" type="button">✕</button><div class="hi-title">${escapeHtml(item.title)}</div><div class="hi-detail">${escapeHtml(detail)}</div><div class="hi-result">${escapeHtml(main)}</div><div style="font-size:10px;color:var(--gray-400);margin-top:4px">${escapeHtml(item.time)}</div></div>`;
    }).join('') + '<button class="history-clear-all" type="button">전체 삭제</button>';

    panel.querySelectorAll('.hi-delete').forEach(btn => btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const idx = Number(btn.getAttribute('data-idx'));
      const arr = getHistory(card);
      arr.splice(idx, 1);
      setHistory(card, arr);
      renderHistory(card, panel);
      showToast('삭제되었습니다');
    }));
    panel.querySelector('.history-clear-all')?.addEventListener('click', ()=>{
      localStorage.removeItem(historyKey(card));
      renderHistory(card, panel);
      showToast('전체 삭제되었습니다');
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function copySnapshot(getSnap){
    const snap = getSnap();
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    const url = location.origin + location.pathname;
    const text = `[${snap.title}]\n` + snap.rows.map(r => `${r.label}: ${r.value}`).join('\n') + `\n\n📊 제이퍼 계산기에서 계산하기\n${url}`;
    navigator.clipboard.writeText(text).then(()=>showToast('클립보드에 복사되었습니다')).catch(()=>showToast('복사 실패'));
  }

  function shareSnapshot(getSnap){
    const snap = getSnap();
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    const url = location.origin + location.pathname;
    const text = `[${snap.title}]\n` + snap.rows.map(r => `${r.label}: ${r.value}`).join('\n') + `\n\n📊 제이퍼 계산기에서 계산하기`;
    if (navigator.share){
      navigator.share({ title: snap.title, text, url }).catch(()=>{});
    } else {
      copySnapshot(getSnap);
    }
  }

  function saveSnapshot(card, panel, getSnap){
    const snap = getSnap();
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    const arr = getHistory(card);
    arr.unshift(snap);
    setHistory(card, arr);
    renderHistory(card, panel);
    showToast('저장되었습니다');
  }

  function saveAsImage(card, getSnap){
    const snap = getSnap();
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    showToast('이미지 저장 중...');
    // 캡처 제외: 제휴 배너 + 이동 링크 일체(폼다 브릿지·공식링크·부모혜택·다음단계). display 값 보존 후 복원.
    const hidden = card.querySelectorAll(SNAP_EXCLUDE);
    const prevDisp = [];
    hidden.forEach((b, i) => { prevDisp[i] = b.style.display; b.style.display = 'none'; });
    const restore = () => hidden.forEach((b, i) => {
      if (prevDisp[i]) b.style.display = prevDisp[i];
      else { b.style.removeProperty('display'); if (!b.getAttribute('style')) b.removeAttribute('style'); }
    });
    loadHtml2Canvas().then((html2canvas)=>html2canvas(card, { scale: 2, useCORS: true })).then(canvas => {
      restore();
      const link = document.createElement('a');
      const safe = snap.title.replace(/[\\/:*?"<>|]+/g, '_');
      link.download = `${safe}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('이미지가 저장되었습니다');
    }).catch(()=>{ restore(); showToast('저장 실패 - 다시 시도해주세요'); });
  }

  // ── 결과 카드 안 "다음 단계" 블록 ─────────────────────────────
  // 링크 원본은 페이지 하단 정적 .sibling-section (scripts/inject-sibling.mjs가 관리).
  // 새 URL을 만들지 않으므로 내부링크 그래프는 그대로다.
  function normHref(h){ return String(h || '').split('#')[0].replace(/\/$/, ''); }

  // PC는 3단 그리드라 이름이 길면 잘린다(모바일은 1단). 괄호 약어는 약어만(대출한도 (DSR) -> DSR),
  // 한글 괄호는 떼어낸다(주택연금(역모기지) -> 주택연금).
  function shortName(n){
    const m = n.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (!m) return n;
    if (/^[A-Za-z0-9\/ .-]+$/.test(m[2])) return m[2].trim();
    return m[1].trim() || n;
  }

  function siblingLinks(){
    const out = { calcs: [], guides: [] };
    document.querySelectorAll('.sibling-section a.sibling-link').forEach((a)=>{
      if (a.classList.contains('current')) return;
      const href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '/') return;
      const raw = oneLine(a.textContent);
      const parts = raw.split(' ');
      let icon = '', name = raw;
      if (parts.length > 1 && !/[0-9A-Za-z가-힣]/.test(parts[0])){ icon = parts[0]; name = parts.slice(1).join(' '); }
      if (!name) return;
      if (href.indexOf('/calc/') === 0) out.calcs.push({href, icon: icon || '🧮', name: shortName(name)});
      else if (href.indexOf('/blog') === 0) out.guides.push({href, icon: icon || '📖', name});
    });
    return out;
  }

  function gaEvent(name){
    try { if (typeof window.gtag === 'function') window.gtag('event', name); } catch(e){}
  }

  const usedOnPage = new Set();

  function buildNextStep(target){
    const { calcs, guides } = siblingLinks();
    if (!calcs.length && !guides.length) return null;
    // 카드 안에 이미 있는 링크(연금 official-link 등)와 현재 페이지는 제외
    const used = new Set([normHref(location.pathname)]);
    target.querySelectorAll('a[href]').forEach(a => used.add(normHref(a.getAttribute('href'))));
    // 한 페이지에 결과 카드가 여러 개인 계산기(ev-charging·calories)에서
    // 두 블록이 같은 링크를 반복하지 않도록, 앞 블록이 쓴 링크는 뒤로 미룬다.
    const rank = (arr) => {
      const fresh = arr.filter(x => !usedOnPage.has(normHref(x.href)));
      return fresh.concat(arr.filter(x => usedOnPage.has(normHref(x.href))));
    };
    const pickCalcs = rank(calcs.filter(c => !used.has(normHref(c.href)))).slice(0, 3);
    const pickGuide = rank(guides.filter(g => !used.has(normHref(g.href))))[0];
    [].concat(pickCalcs, pickGuide || []).forEach(x => usedOnPage.add(normHref(x.href)));
    if (!pickCalcs.length && !pickGuide) return null;

    const box = document.createElement('div');
    box.className = 'jcalc-next';
    box.setAttribute('data-html2canvas-ignore', 'true');
    let html = '<div class="jcalc-next__title">이어서 계산하기</div>';
    if (pickCalcs.length){
      html += '<div class="jcalc-next__calcs">' + pickCalcs.map(c =>
        `<a class="jcalc-next__calc" href="${escapeHtml(c.href)}" title="${escapeHtml(c.name)}" data-jn="calc"><span class="jn-ico">${escapeHtml(c.icon)}</span><span class="jn-txt">${escapeHtml(c.name)}</span></a>`
      ).join('') + '</div>';
    }
    if (pickGuide){
      html += `<a class="jcalc-next__guide" href="${escapeHtml(pickGuide.href)}" title="${escapeHtml(pickGuide.name)}" data-jn="guide"><span class="jn-ico">${escapeHtml(pickGuide.icon)}</span><span class="jn-txt">${escapeHtml(pickGuide.name)}</span></a>`;
    }
    box.innerHTML = html;
    box.querySelectorAll('a[data-jn]').forEach(a => a.addEventListener('click', ()=>
      gaEvent(a.getAttribute('data-jn') === 'guide' ? 'result_next_guide' : 'result_next_calc')));
    return box;
  }

  function makeButton(label, icon, onClick){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-btn';
    btn.innerHTML = `${icon}<span>${label}</span>`;
    btn.addEventListener('click', onClick);
    return btn;
  }

  const icons = {
    save: '<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    history: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>',
    image: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>'
  };

  function setupTarget(el, getSnap){
    if (!el.id) el.id = `jcalc-result-${Math.random().toString(36).slice(2, 8)}`;
    const next = el.nextElementSibling;
    if (next && next.classList && next.classList.contains('action-row')) return;
    const nextBox = buildNextStep(el);
    if (nextBox) el.appendChild(nextBox);

    const row = document.createElement('div');
    row.className = 'action-row';
    const panel = document.createElement('div');
    panel.className = 'history-panel';

    row.appendChild(makeButton('저장', icons.save, ()=>saveSnapshot(el, panel, getSnap)));
    row.appendChild(makeButton('복사', icons.copy, ()=>copySnapshot(getSnap)));
    row.appendChild(makeButton('기록', icons.history, ()=>{
      panel.classList.toggle('show');
      if (panel.classList.contains('show')) renderHistory(el, panel);
    }));
    row.appendChild(makeButton('결과공유', '', ()=>shareSnapshot(getSnap)));
    row.appendChild(makeButton('이미지저장', '', ()=>saveAsImage(el, getSnap)));

    el.insertAdjacentElement('afterend', row);
    row.insertAdjacentElement('afterend', panel);

    const sync = ()=>{
      const visible = isVisible(el) && !!getSnap();
      row.style.display = visible ? 'flex' : 'none';
      if (!visible) panel.classList.remove('show');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    el.querySelectorAll('*').forEach(node=>observer.observe(node, {attributes:true, attributeFilter:['class','style']}));
    window.addEventListener('input', sync, true);
    window.addEventListener('change', sync, true);
    window.addEventListener('click', ()=>setTimeout(sync, 0), true);
  }

  function init(){
    injectStyles(); ensureToast();
    const grouped = new Set();
    document.querySelectorAll('[data-result-group]').forEach(group => {
      group.querySelectorAll('.result-card').forEach(card => grouped.add(card));
      setupTarget(group, ()=>extractGroupSnapshot(group));
    });
    document.querySelectorAll('.result-card').forEach(card => {
      if (grouped.has(card)) return;
      setupTarget(card, ()=>extractSnapshot(card));
    });
    // 기존 결과 카드 CTA에도 계측을 붙인다 (파라미터 없이 이벤트명으로 구분 - GA4 맞춤정의 등록 불필요)
    document.querySelectorAll('.result-card .bf-entry').forEach(a =>
      a.addEventListener('click', ()=>gaEvent('result_cta_benefit')));
    document.querySelectorAll('.result-card .bridge-cta').forEach(a =>
      a.addEventListener('click', ()=>gaEvent('result_cta_formda')));
    document.querySelectorAll('.result-card .official-link').forEach(a => {
      const ext = /^https?:/i.test(a.getAttribute('href') || '');
      a.addEventListener('click', ()=>gaEvent(ext ? 'result_cta_official' : 'result_next_calc'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

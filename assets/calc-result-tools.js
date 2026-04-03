
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

  function extractSnapshot(card){
    if (!isVisible(card)) return null;
    const title = contextTitle(card);
    const rows = [];
    card.querySelectorAll('.result-row').forEach((row)=>{
      const label = row.querySelector('.result-label, .result-total-label')?.textContent?.trim();
      const value = row.querySelector('.result-value, .result-total-value')?.textContent?.trim();
      if (label && value) rows.push({label, value});
    });
    card.querySelectorAll('.result-highlight').forEach((box)=>{
      const label = box.querySelector('.rh-label')?.textContent?.trim() || '핵심 결과';
      const value = box.querySelector('.rh-value')?.textContent?.trim();
      const sub = box.querySelector('.rh-sub')?.textContent?.trim();
      if (value) rows.push({label, value: sub ? `${value} (${sub})` : value});
    });
    if (!rows.length){
      const raw = card.innerText.trim();
      if (!raw) return null;
      rows.push({label:'계산 결과', value: raw.split('\n').slice(0,6).join(' / ')});
    }
    const summary = rows.slice(0, 2).map(r => `${r.label} ${r.value}`).join(' · ');
    return { title, rows, summary, time: new Date().toLocaleString('ko-KR') };
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

  function copySnapshot(card){
    const snap = extractSnapshot(card);
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    const text = `[${snap.title}]\n` + snap.rows.map(r => `${r.label}: ${r.value}`).join('\n');
    navigator.clipboard.writeText(text).then(()=>showToast('클립보드에 복사되었습니다')).catch(()=>showToast('복사 실패'));
  }

  function saveSnapshot(card, panel){
    const snap = extractSnapshot(card);
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    const arr = getHistory(card);
    arr.unshift(snap);
    setHistory(card, arr);
    renderHistory(card, panel);
    showToast('저장되었습니다');
  }

  function saveAsImage(card){
    const snap = extractSnapshot(card);
    if (!snap){ showToast('먼저 계산을 해주세요'); return; }
    showToast('이미지 저장 중...');
    const banners = card.querySelectorAll('.affiliate-banner');
    banners.forEach(b => b.style.display = 'none');
    loadHtml2Canvas().then((html2canvas)=>html2canvas(card, { scale: 2, useCORS: true })).then(canvas => {
      banners.forEach(b => b.style.display = '');
      const link = document.createElement('a');
      const safe = snap.title.replace(/[\\/:*?"<>|]+/g, '_');
      link.download = `${safe}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('이미지가 저장되었습니다');
    }).catch(()=>{ banners.forEach(b => b.style.display = ''); showToast('저장 실패 - 다시 시도해주세요'); });
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
    image: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
  };

  function setupCard(card){
    if (!card.id) card.id = `jcalc-result-${Math.random().toString(36).slice(2, 8)}`;
    const next = card.nextElementSibling;
    if (next && next.classList && next.classList.contains('action-row')) return;
    const row = document.createElement('div');
    row.className = 'action-row';
    const panel = document.createElement('div');
    panel.className = 'history-panel';

    row.appendChild(makeButton('저장', icons.save, ()=>saveSnapshot(card, panel)));
    row.appendChild(makeButton('복사', icons.copy, ()=>copySnapshot(card)));
    row.appendChild(makeButton('기록', icons.history, ()=>{
      panel.classList.toggle('show');
      if (panel.classList.contains('show')) renderHistory(card, panel);
    }));
    row.appendChild(makeButton('이미지저장', icons.image, ()=>saveAsImage(card)));

    card.insertAdjacentElement('afterend', row);
    row.insertAdjacentElement('afterend', panel);

    const sync = ()=>{
      const visible = isVisible(card) && !!extractSnapshot(card);
      row.style.display = visible ? 'flex' : 'none';
      if (!visible) panel.classList.remove('show');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(card, { attributes: true, attributeFilter: ['class', 'style'] });
    card.querySelectorAll('*').forEach(el=>observer.observe(el, {attributes:true, attributeFilter:['class','style']}));
    window.addEventListener('input', sync, true);
    window.addEventListener('change', sync, true);
    window.addEventListener('click', ()=>setTimeout(sync, 0), true);
  }

  function init(){
    injectStyles(); ensureToast();
    document.querySelectorAll('.result-card').forEach(card => setupCard(card));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

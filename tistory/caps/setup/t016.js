(() => { const set=(id,v)=>{const el=document.getElementById(id); if(el._flatpickr) el._flatpickr.setDate(v,true); else el.value=v;};
 set('diff-start','2025-12-01'); set('diff-end','2026-11-30'); document.getElementById('diff-include-start').checked=true; calcDiff();
 return document.getElementById('diff-result').innerText.replace(/\n/g,' | ').slice(0,300); })()

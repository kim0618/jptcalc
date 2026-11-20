(() => { const el=document.getElementById('add-start'); if(el._flatpickr) el._flatpickr.setDate('2026-11-01',true); else el.value='2026-11-01';
 document.getElementById('add-years').value=''; document.getElementById('add-months').value=''; document.getElementById('add-days').value='99';
 calcAdd(); return document.getElementById('add-result-date').textContent+' '+document.getElementById('add-result-weekday').textContent; })()

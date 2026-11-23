(() => { setAddOp('+',document.getElementById('add-op-plus')); const el=document.getElementById('add-start'); if(el._flatpickr) el._flatpickr.setDate('2027-08-31',true); else el.value='2027-08-31';
 document.getElementById('add-years').value=''; document.getElementById('add-months').value='6'; document.getElementById('add-days').value=''; calcAdd();
 return [document.getElementById('add-result-date').textContent, document.getElementById('add-result-weekday').textContent]; })()

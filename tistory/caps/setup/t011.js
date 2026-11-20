(() => { const set=(id,v)=>{const el=document.getElementById(id); if(el._flatpickr) el._flatpickr.setDate(v,true); else el.value=v;};
 set('age-birth','2008-12-15'); set('age-base','2027-01-01'); calcAge();
 return [document.getElementById('age-man').textContent, document.getElementById('age-detail').innerText.replace(/\n/g,' | ').slice(0,200)]; })()

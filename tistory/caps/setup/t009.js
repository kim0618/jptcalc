(() => { document.getElementById('ye-salary').value='4500'; const r=document.getElementById('ye-saving'); r.value='600';
 let e=r; while(e){ if(e.tagName==='DETAILS') e.open=true; e=e.parentElement; }
 for (const el of document.querySelectorAll('[aria-expanded="false"]')) { if (el.parentElement && el.parentElement.contains(r)) el.click(); }
 calcYE(); return [document.getElementById('ye-r-main').textContent, r.offsetParent!==null]; })()

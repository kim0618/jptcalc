(() => { document.getElementById('ye-salary').value='4000'; document.getElementById('ye-rent').value='720';
 const r=document.getElementById('ye-rent'); let e=r; while(e){ if(e.tagName==='DETAILS') e.open=true; e=e.parentElement; }
 for (const el of document.querySelectorAll('[aria-expanded="false"]')) { if (el.parentElement && el.parentElement.contains(r)) el.click(); }
 calcYE(); return [document.getElementById('ye-r-main').textContent, r.offsetParent!==null]; })()

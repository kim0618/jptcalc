(() => { document.getElementById('ye-salary').value='4500'; const c=document.getElementById('ye-credit'); c.value='1125'; document.getElementById('ye-debit').value='675';
 let e=c; while(e){ if(e.tagName==='DETAILS') e.open=true; e=e.parentElement; }
 for (const el of document.querySelectorAll('[aria-expanded="false"]')) { if (el.parentElement && el.parentElement.contains(c)) el.click(); }
 calcYE(); return document.getElementById('ye-r-rows').innerText.split('\n').slice(0,16).join(' | '); })()

(() => { document.querySelector("[onclick^=\"setBmrSex('female'\"]").click();
 const s=(id,v)=>document.getElementById(id).value=v; s('bmr-age','35'); s('bmr-height','160'); s('bmr-weight','55'); s('bmr-fat','25');
 for (const id of ['bmr-age','bmr-height','bmr-weight']) { const e=document.getElementById(id); e.style.paddingLeft='10px'; e.style.paddingRight='2px'; e.style.minWidth='0'; }
 calcBmr(); return document.getElementById('bmr-value').textContent+' / '+document.getElementById('bmr-f-km').textContent; })()

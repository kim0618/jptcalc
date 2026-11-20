(() => { setMode('monthly');
 const s=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
 s('monthly','350');s('ot','12');s('night','4');s('hol','8');s('holot','1');calcPremium();
 return document.getElementById('r-total').textContent; })()

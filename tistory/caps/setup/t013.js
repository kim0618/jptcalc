(() => { const s=(id,v)=>{const e=document.getElementById(id); e.value=v; e.dispatchEvent(new Event('input',{bubbles:true}));};
 s('dsr-income','6000'); s('dsr-mortgage','1800'); s('dsr-other','600'); calcDsr();
 return document.getElementById('dsr-result').innerText.slice(0,120).replace(/\n/g,' | '); })()

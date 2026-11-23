(() => { const el=document.getElementById('acq-price'); el.value='80000'; el.dispatchEvent(new Event('input',{bubbles:true})); calcAcquisition();
 return ['acq-rate','acq-tax','edu-tax','rural-tax','acq-total'].map(i=>document.getElementById(i).textContent); })()

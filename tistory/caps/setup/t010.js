(() => { document.querySelector("[onclick^=\"setBfSex('male'\"]").click();
 const s=(id,v)=>document.getElementById(id).value=v; s('bf-height','175'); s('bf-weight','75'); s('bf-waist','84'); s('bf-neck','38');
 calcBodyFat(); return [document.getElementById('bf-value').textContent, document.getElementById('bf-fat-mass').textContent, document.getElementById('bf-status').textContent]; })()

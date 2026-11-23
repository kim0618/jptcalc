(() => { setCalSex('male', document.querySelector(`[onclick^="setCalSex('male'"]`)); setActivity(1.2, document.querySelector(`[onclick^="setActivity(1.2,"]`));
 document.getElementById('cal-age').value='42'; document.getElementById('cal-height').value='180'; document.getElementById('cal-weight').value='84'; calcCalorie();
 return ['cal-tdee','cal-bmr-sub','cal-diet300','cal-diet500'].map(i=>document.getElementById(i).textContent); })()

(() => { const a=document.getElementById('loan-amount'); a.value='10000'; document.getElementById('loan-rate').value='4.5';
 document.querySelector('[onclick^="setLoanPeriod(30"]').click(); document.querySelector("[onclick^=\"setLoanType('equal'\"]").click();
 calc(); return document.getElementById('loan-monthly').textContent+' / '+document.getElementById('loan-r-interest').textContent; })()

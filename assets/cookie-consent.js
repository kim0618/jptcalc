(function () {
  if (localStorage.getItem('jpt_cookie_ok')) return;

  var STYLE_ID = 'jpt-cookie-style';
  if (!document.getElementById(STYLE_ID)) {
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '#jpt-cookie-bar{position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
      'background:#fff;border-top:1px solid #e5e7eb;box-shadow:0 -2px 12px rgba(0,0,0,0.08);' +
      'padding:14px 20px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;' +
      'font-family:"Pretendard",-apple-system,sans-serif;font-size:13px;color:#374151;line-height:1.6}' +
      '#jpt-cookie-bar p{margin:0;text-align:center}' +
      '#jpt-cookie-bar a{color:#10B981;text-decoration:none;font-weight:600}' +
      '#jpt-cookie-bar a:hover{text-decoration:underline}' +
      '#jpt-cookie-ok{border:none;background:#10B981;color:#fff;font-size:13px;font-weight:700;' +
      'padding:8px 20px;border-radius:8px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0}' +
      '#jpt-cookie-ok:hover{background:#059669}' +
      '@media(max-width:600px){#jpt-cookie-bar{flex-direction:column;gap:10px;padding:12px 16px;font-size:12px}' +
      '#jpt-cookie-ok{width:100%;padding:10px}}';
    document.head.appendChild(s);
  }

  var bar = document.createElement('div');
  bar.id = 'jpt-cookie-bar';
  bar.innerHTML =
    '<p>이 사이트는 사용자 경험 개선 및 광고 제공을 위해 쿠키를 사용합니다. ' +
    '<a href="/privacy.html">개인정보처리방침</a></p>' +
    '<button id="jpt-cookie-ok">동의</button>';
  document.body.appendChild(bar);

  document.getElementById('jpt-cookie-ok').addEventListener('click', function () {
    localStorage.setItem('jpt_cookie_ok', '1');
    bar.style.display = 'none';
  });
})();

(function () {
  var STYLE_ID = 'jptcalc-unified-footer-style';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .site-footer.site-footer-unified{
        background:#f3f4f6 !important;
        border-top:1px solid #e5e7eb !important;
        padding:20px 24px !important;
        margin-top:0 !important;
        color:#6b7280 !important;
      }
      .site-footer.site-footer-unified .footer-inner{
        max-width:1400px !important;
        margin:0 auto !important;
        display:flex !important;
        align-items:center !important;
        justify-content:space-between !important;
        gap:16px !important;
        flex-wrap:wrap !important;
      }
      .site-footer.site-footer-unified .footer-links{
        display:flex !important;
        align-items:center !important;
        flex-wrap:wrap !important;
        gap:12px !important;
      }
      .site-footer.site-footer-unified .footer-links a{
        color:#6b7280 !important;
        text-decoration:none !important;
        font-size:10px !important;
        font-weight:600 !important;
        line-height:1.6 !important;
        padding:0 !important;
        background:none !important;
        border:none !important;
        border-radius:0 !important;
        box-shadow:none !important;
      }
      .site-footer.site-footer-unified .footer-links a:hover{
        color:#374151 !important;
        text-decoration:none !important;
        background:none !important;
      }
      .site-footer.site-footer-unified .footer-copy{
        margin:0 !important;
        font-size:10px !important;
        line-height:1.6 !important;
        color:#6b7280 !important;
        text-align:right !important;
      }
      @media (max-width: 900px){
        .site-footer.site-footer-unified{
          padding:18px 16px !important;
        }
        .site-footer.site-footer-unified .footer-inner{
          justify-content:center !important;
          text-align:center !important;
        }
        .site-footer.site-footer-unified .footer-links{
          justify-content:center !important;
          gap:10px 14px !important;
        }
        .site-footer.site-footer-unified .footer-links a,
        .site-footer.site-footer-unified .footer-copy{
          font-size:10px !important;
        }
        .site-footer.site-footer-unified .footer-copy{
          width:100% !important;
          text-align:center !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildFooterHTML() {
    return ''
      + '<div class="footer-inner">'
      + '  <div class="footer-links">'
      + '    <a href="/">홈</a>'
      + '    <a href="/about.html">소개</a>'
      + '    <a href="/privacy.html">개인정보처리방침</a>'
      + '    <a href="/terms.html">이용약관</a>'
      + '    <a href="/contact.html">문의하기</a>'
      + '    <a href="/disclaimer.html">면책조항</a>'
      + '  </div>'
      + '  <p class="footer-copy">&copy; 2026 제이퍼 계산기 - 본 결과는 참고용이며 정확한 내용은 전문가에게 문의하세요.</p>'
      + '</div>';
  }

  function applyUnifiedFooter() {
    var footer = document.querySelector('footer.site-footer') || document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }
    footer.className = 'site-footer site-footer-unified';
    footer.setAttribute('data-unified-footer', 'true');
    footer.innerHTML = buildFooterHTML();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyUnifiedFooter);
  } else {
    applyUnifiedFooter();
  }
})();

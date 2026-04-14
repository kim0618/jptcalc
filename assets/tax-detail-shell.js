
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/tax/withholding/': {
      key:'withholding',
      quick:['3.3%는 소득세 3%와 지방소득세 0.3%의 합계입니다.','원천징수된 금액은 다음 해 5월 종합소득세 신고 시 기납부세액으로 공제됩니다.','건별·월별·연간 기준을 바꿔 보면 연간 세금 부담을 가늠할 수 있습니다.','부가세를 별도로 받는 구조라면 세금계산서 기준 금액을 따로 확인하세요.'],
      related:[['/calc/tax/income-tax/','종합소득세 계산기','📈'],['/calc/tax/freelancer-income/','월 순수입 계산기','💰'],['/calc/tax/vat/','부가가치세 계산기','📄']],
      guides:[['/blog/posts/withholding-tax-guide.html','3.3% 원천징수 - 실수령액과 환급 완전 정리'],['/blog/posts/freelancer-tax-refund.html','프리랜서 3.3%, 5월에 환급받는 방법']]
    },
    '/calc/tax/income-tax/': {
      key:'income-tax',
      quick:['프리랜서 소득은 사업소득으로 분류되어 종합소득세 신고 대상입니다.','경비율(단순·기준)에 따라 과세표준이 크게 달라질 수 있습니다.','기납부한 3.3% 원천징수 세액은 종합소득세에서 공제됩니다.','소득공제·세액공제 항목을 빠짐없이 반영하면 절세 효과를 높일 수 있습니다.'],
      related:[['/calc/tax/withholding/','3.3% 원천징수 계산기','💲'],['/calc/tax/insurance-comparison/','4대보험 비교 계산기','👥'],['/calc/tax/freelancer-income/','월 순수입 계산기','💰']],
      guides:[['/blog/posts/comprehensive-income-tax.html','종합소득세 신고 완벽 가이드 2026'],['/blog/posts/income-tax-deduction.html','종합소득세 공제 항목 총정리 - 놓치면 손해']]
    },
    '/calc/tax/vat/': {
      key:'vat',
      quick:['일반과세자는 매출세액에서 매입세액을 차감한 금액을 납부합니다.','간이과세자는 업종별 부가가치율을 적용하여 세액을 계산합니다.','연 매출 8,000만원 미만 간이과세자는 납부 면제 대상일 수 있습니다.','세금계산서 발행 여부와 과세 유형을 미리 확인하세요.'],
      related:[['/calc/tax/withholding/','3.3% 원천징수 계산기','💲'],['/calc/tax/income-tax/','종합소득세 계산기','📈'],['/calc/tax/freelancer-income/','월 순수입 계산기','💰']],
      guides:[['/blog/posts/vat-guide.html','부가가치세 신고 완벽 가이드 - 일반·간이과세자 차이'],['/blog/posts/comprehensive-income-tax.html','종합소득세 신고 완벽 가이드 2026']]
    },
    '/calc/tax/insurance-comparison/': {
      key:'insurance-comparison',
      quick:['4대보험 직장인은 국민연금·건강보험·고용보험·산재보험이 적용됩니다.','3.3% 프리랜서는 국민연금·건강보험을 지역가입자로 별도 납부합니다.','소득 수준과 경비율에 따라 유불리가 달라지므로 비교 후 판단하세요.','4대보험 가입 시 퇴직금·실업급여 등 추가 혜택도 고려하세요.'],
      related:[['/calc/tax/withholding/','3.3% 원천징수 계산기','💲'],['/calc/tax/income-tax/','종합소득세 계산기','📈'],['/calc/tax/freelancer-income/','월 순수입 계산기','💰']],
      guides:[['/blog/posts/four-insurance-vs-33-comparison.html','4대보험 vs 3.3%, 어떤 계약이 유리할까'],['/blog/posts/freelancer-insurance-guide.html','프리랜서 4대보험, 지역가입자 보험료 계산법']]
    },
    '/calc/tax/freelancer-income/': {
      key:'freelancer-income',
      quick:['3.3% 원천징수, 종합소득세, 국민연금, 건강보험을 모두 반영합니다.','경비율에 따라 실제 순수입이 크게 달라질 수 있습니다.','월 순수입은 세금·보험료를 모두 차감한 실제 가처분 소득입니다.','소득 변동이 클 때는 연 단위로도 함께 확인하면 도움이 됩니다.'],
      related:[['/calc/tax/withholding/','3.3% 원천징수 계산기','💲'],['/calc/tax/income-tax/','종합소득세 계산기','📈'],['/calc/tax/insurance-comparison/','4대보험 비교 계산기','👥']],
      guides:[['/blog/posts/freelancer-tax-refund.html','프리랜서 3.3%, 5월에 환급받는 방법'],['/blog/posts/withholding-tax-guide.html','3.3% 원천징수 - 실수령액과 환급 완전 정리']]
    }
  };
  const cfg=pages[path];
  if(!cfg) return;

  const style=document.createElement('style');
  style.textContent=`
    .site-header{position:sticky!important;top:0!important;z-index:200!important;background:rgba(15,17,23,.95)!important;backdrop-filter:blur(12px)!important;border-bottom:1px solid rgba(255,255,255,.06)!important;padding:0!important;}
    .sh-inner{max-width:1400px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;gap:32px;}
    .sh-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;}
    .sh-logo-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
    .sh-logo-text{font-size:18px;font-weight:900;color:#fff;letter-spacing:-.5px;line-height:1;}
    .sh-nav{display:flex;align-items:center;gap:2px;flex:1;min-width:0!important;}
    .sh-nav-item{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;color:#9CA3AF;transition:all .15s;white-space:nowrap;}
    .sh-nav-item:hover{background:rgba(255,255,255,.06);color:#fff;}
    .sh-nav-item.sh-active{background:rgba(16,185,129,.12);color:#10B981;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#10B981;color:#10B981;}
    .sh-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;margin-left:auto;background:none;border:none;}
    .sh-hamburger span{display:block;width:22px;height:2px;background:#9CA3AF;border-radius:2px;}
    .mega-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
    .mega-sidebar-left{position:sticky;top:88px;align-self:start;line-height:normal;}
    .msl-section{margin-bottom:20px;}
    .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
    .msl-nav,.msl-calc-list{display:flex;flex-direction:column;gap:2px;}
    .msl-link,.msl-calc-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#6B7280;transition:all .15s;background:none;border:none;width:100%;text-align:left;font-family:inherit;cursor:pointer;}
    .msl-calc-btn{font-size:12px;padding:8px 10px;border-radius:8px;gap:8px;}
    .msl-link:hover,.msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#111827;}
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(16,185,129,.12);color:#10B981;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(16,185,129,.15);color:#10B981;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#10B981;flex-shrink:0;}
    .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;align-self:start;}
    .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;}
    .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
    .msr-widget-list{display:flex;flex-direction:column;gap:4px;}
    .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
    .msr-widget-link:hover{background:rgba(0,0,0,.04);}
    .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
    .msr-widget-text{font-size:12px;font-weight:600;color:#6B7280;line-height:1.6;}
    .msr-widget-link:hover .msr-widget-text{color:#111827;}
    .mega-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:150;}
    .mega-overlay.open{display:block;}
    .page-wrap.tax-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .tax-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .tax-shell-main>.page-header{margin-bottom:0px!important;}
        .tax-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .tax-shell-main .card .field{min-width:0;}
    .tax-shell-main .card,
    .tax-shell-main .result-card,
    .tax-shell-main .explain-section,
    .tax-shell-main .siblings-section,
    .tax-shell-main .sibling-section,
    .tax-shell-main .guide-section{max-width:100%!important;}
    .tax-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .tax-shell-main .guide-section>*{margin:0!important;}
    .tax-shell-main .sibling-section{display:none!important;}
    .mobile-guides{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#10B981;}
    .mobile-guides__icon{font-size:15px;flex-shrink:0;}
    .mobile-guides__text{font-size:13px;font-weight:600;color:#374151;flex:1;line-height:1.4;}
    @media (max-width:1199px){.mega-layout{grid-template-columns:220px minmax(0,1fr);} .mega-sidebar-right{display:none;}}
    @media (max-width:767px){.sh-inner{padding:0 16px;} .sh-nav,.sh-cta{display:none;} .sh-hamburger{display:flex;} .mega-layout{grid-template-columns:1fr;padding:16px;gap:16px;} .mega-sidebar-left{display:none;} .mega-sidebar-left.open{display:block;position:fixed;top:60px;left:0;bottom:0;width:260px;background:#fff;border-right:1px solid rgba(0,0,0,.06);padding:20px 12px;overflow-y:auto;z-index:200;} .mobile-guides{display:block;} }
  `;
  document.head.appendChild(style);

  const header=document.querySelector('header.site-header');
  if(header){
    header.innerHTML=`<div class="sh-inner">
      <a href="/" class="sh-logo">
        <div class="sh-logo-icon"><img src="/assets/logo.svg" alt="제이퍼 계산기 로고" style="width:32px;height:32px;display:block;" /></div>
        <span class="sh-logo-text">제이퍼<span style="color:#818CF8">계산기</span></span>
      </a>
      <nav class="sh-nav">
        <a href="/calc/realestate/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F59E0B"></span>부동산</a>
        <a href="/calc/tax/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#10B981"></span>프리랜서 세금</a>
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/health/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('tax-shell-main')) return;
  main.classList.add('tax-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['withholding','3.3% 원천징수','/calc/tax/withholding/'],
    ['income-tax','종합소득세','/calc/tax/income-tax/'],
    ['vat','부가가치세','/calc/tax/vat/'],
    ['insurance-comparison','4대보험 비교','/calc/tax/insurance-comparison/'],
    ['freelancer-income','월 순수입','/calc/tax/freelancer-income/']
  ];
  const left=document.createElement('aside');
  left.className='mega-sidebar-left';
  left.id='mega-sidebar-left';
  left.innerHTML=`
    <div class="msl-section">
      <div class="msl-title">카테고리</div>
      <nav class="msl-nav">
        <a href="/" class="msl-link"><span class="msl-icon">🧮</span>전체 보기</a>
        <a href="/calc/realestate/" class="msl-link"><span class="msl-icon">🏠</span>부동산<span class="msl-badge">15</span></a>
        <a href="/calc/tax/" class="msl-link msl-active"><span class="msl-icon">💰</span>프리랜서 세금<span class="msl-badge">5</span></a>
        <a href="/calc/salary/" class="msl-link"><span class="msl-icon">📈</span>이직 / 연봉<span class="msl-badge">7</span></a>
        <a href="/calc/finance/" class="msl-link"><span class="msl-icon">🏦</span>금융 · 이자<span class="msl-badge">5</span></a>
        <a href="/calc/health/" class="msl-link"><span class="msl-icon">🏃</span>건강<span class="msl-badge">5</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">프리랜서 세금 계산기</div>
      <div class="msl-calc-list">${calcItems.map(item=>`<a href="${item[2]}" class="msl-calc-btn ${item[0]===cfg.key?'msl-calc-active':''}"><span class="msl-calc-dot"></span>${item[1]}</a>`).join('')}</div>
    </div>`;

  const guidesWidget = (cfg.guides && cfg.guides.length)
    ? `<div class="msr-widget">
        <div class="msr-widget-title">관련 가이드</div>
        <div class="msr-widget-list">${cfg.guides.map(g=>`<a href="${g[0]}" class="msr-widget-link"><span class="msr-widget-icon">📖</span><span class="msr-widget-text">${g[1]}</span></a>`).join('')}</div>
      </div>`
    : '';
  const right=document.createElement('aside');
  right.className='mega-sidebar-right';
  right.innerHTML=`
    <div class="msr-widget">
      <div class="msr-widget-title">관련 계산기</div>
      <div class="msr-widget-list">${cfg.related.map(item=>`<a href="${item[0]}" class="msr-widget-link"><span class="msr-widget-icon">${item[2]}</span><span class="msr-widget-text">${item[1]}</span></a>`).join('')}</div>
    </div>
    ${guidesWidget}`;

  if (cfg.guides && cfg.guides.length) {
    const mobileGuides = document.createElement('div');
    mobileGuides.className = 'mobile-guides';
    mobileGuides.innerHTML =
      '<div class="mobile-guides__title">관련 가이드</div>' +
      '<div class="mobile-guides__list">' +
      cfg.guides.map(g =>
        `<a class="mobile-guides__link" href="${g[0]}"><span class="mobile-guides__icon">📖</span><span class="mobile-guides__text">${g[1]}</span></a>`
      ).join('') +
      '</div>';
    main.appendChild(mobileGuides);
  }

  main.parentNode.insertBefore(overlay, main);
  main.parentNode.insertBefore(layout, main);
  layout.append(left, main, right);

  const hamburger=document.querySelector('.sh-hamburger');
  const toggle=function(){left.classList.toggle('open'); overlay.classList.toggle('open');};
  if(hamburger) hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
})();

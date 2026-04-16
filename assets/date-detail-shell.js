
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/date/dday/': {
      key:'dday',
      quick:['D-day는 특정 날짜까지 남은 일수를 계산합니다.','시작일과 종료일을 포함할지 여부에 따라 1일 차이가 날 수 있습니다.','음력 기념일은 매년 양력 날짜가 달라지므로 주의하세요.','반복 기념일(생일, 기념일 등)은 매년 자동으로 갱신됩니다.'],
      related:[['/calc/date/date-difference/','날짜 차이','📏'],['/calc/date/age/','만 나이','🎂'],['/calc/date/date-add/','날짜 더하기/빼기','➕']],
      guides:[['/blog/posts/dday-counter.html','D-day 계산기 활용법 - 시험·입사·기념일 카운트다운'],['/blog/posts/korean-age-system.html','만 나이 통일법 완벽 정리 - 2023년 이후 달라진 것들']]
    },
    '/calc/date/date-difference/': {
      key:'date-difference',
      quick:['두 날짜 사이의 일수·주수·개월수를 정확히 계산합니다.','윤년(2월 29일)이 포함된 구간은 자동으로 반영됩니다.','근무일수 계산 시 주말·공휴일 제외 옵션을 활용하세요.','시작일 포함 여부에 따라 결과가 1일 차이날 수 있습니다.'],
      related:[['/calc/date/dday/','D-day','📆'],['/calc/date/date-add/','날짜 더하기/빼기','➕'],['/calc/date/weekday/','요일 계산','📅']],
      guides:[['/blog/posts/date-difference.html','날짜 차이 계산법 - 근무일수·계약기간 정확히 계산하기'],['/blog/posts/weekday-calculator-guide.html','요일 계산기 활용법 - 기념일·납부일 요일 확인']]
    },
    '/calc/date/date-add/': {
      key:'date-add',
      quick:['특정 날짜에서 일·주·월·년 단위로 더하거나 뺄 수 있습니다.','월 단위 계산 시 말일 처리에 주의하세요(예: 1/31 + 1개월 = 2/28).','영업일 기준으로 계산하면 주말·공휴일이 자동 제외됩니다.','계약 만료일, 신고 기한 등을 정확히 산출할 수 있습니다.'],
      related:[['/calc/date/dday/','D-day','📆'],['/calc/date/date-difference/','날짜 차이','📏'],['/calc/date/weekday/','요일 계산','📅']],
      guides:[['/blog/posts/date-add-guide.html','날짜 더하기·빼기 계산법 - 계약 만료일 정확히 계산하기'],['/blog/posts/holiday-2026.html','2026년 공휴일 총정리 - 연휴·대체공휴일 완벽 가이드']]
    },
    '/calc/date/age/': {
      key:'age',
      quick:['2023년 6월부터 한국도 만 나이 통일법이 시행되었습니다.','만 나이는 생일이 지나야 한 살이 더해집니다.','법적 나이(연 나이)와 만 나이는 다를 수 있으니 용도에 맞게 확인하세요.','생년월일만 입력하면 현재 만 나이가 자동 계산됩니다.'],
      related:[['/calc/date/dday/','D-day','📆'],['/calc/date/date-difference/','날짜 차이','📏'],['/calc/date/date-add/','날짜 더하기/빼기','➕']],
      guides:[['/blog/posts/korean-age-system.html','만 나이 통일법 완벽 정리 - 2023년 이후 달라진 것들'],['/blog/posts/military-discharge-date.html','전역일 계산법 - 복무 기간별 전역 예정일 확인']]
    },
    '/calc/date/weekday/': {
      key:'weekday',
      quick:['특정 날짜의 요일을 빠르게 확인할 수 있습니다.','과거·미래 어떤 날짜든 요일 계산이 가능합니다.','생일, 기념일, 공휴일 등의 요일을 미리 확인해 보세요.','윤년 2월 29일도 정확하게 요일이 계산됩니다.'],
      related:[['/calc/date/date-add/','날짜 더하기/빼기','➕'],['/calc/date/dday/','D-day','📆'],['/calc/date/date-difference/','날짜 차이','📏']],
      guides:[['/blog/posts/weekday-calculator-guide.html','요일 계산기 활용법 - 기념일·납부일 요일 확인'],['/blog/posts/holiday-2026.html','2026년 공휴일 총정리 - 연휴·대체공휴일 완벽 가이드']]
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
    .sh-nav-item.sh-active{background:rgba(249,115,22,.12);color:#F97316;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#F97316;color:#F97316;}
    .sh-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;margin-left:auto;background:none;border:none;}
    .sh-hamburger span{display:block;width:22px;height:2px;background:#9CA3AF;border-radius:2px;}
    .mega-layout{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
    .mega-sidebar-left{position:sticky;top:88px;align-self:start;line-height:normal;}
    .msl-section{margin-bottom:20px;}
    .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
    .msl-nav,.msl-calc-list{display:flex;flex-direction:column;gap:2px;}
    .msl-link,.msl-calc-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#6B7280;transition:all .15s;background:none;border:none;width:100%;text-align:left;font-family:inherit;cursor:pointer;}
    .msl-calc-btn{font-size:12px;padding:8px 10px;border-radius:8px;gap:8px;}
    .msl-link:hover,.msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#111827;}
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(249,115,22,.12);color:#F97316;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(249,115,22,.15);color:#F97316;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F97316;flex-shrink:0;}
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
    .page-wrap.date-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .date-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .date-shell-main>.page-header{margin-bottom:0px!important;}
        .date-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .date-shell-main .card .field{min-width:0;}
    .date-shell-main .card,
    .date-shell-main .result-card,
    .date-shell-main .explain-section,
    .date-shell-main .siblings-section,
    .date-shell-main .sibling-section,
    .date-shell-main .guide-section{max-width:100%!important;}
    .date-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .date-shell-main .guide-section>*{margin:0!important;}
    .date-shell-main .sibling-section{display:none!important;}
    .date-shell-main .article-info{margin-bottom:0!important;}
    .date-shell-main .review-footer{margin-top:0!important;}
    .date-shell-main .guide-section .review-footer{margin-top:0!important;}
    .date-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#F97316;}
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
        <a href="/calc/tax/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>프리랜서 세금</a>
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/health/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/pension-welfare/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#0EA5E9"></span>연금·복지</a>
        <a href="/calc/date/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('date-shell-main')) return;
  main.classList.add('date-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['dday','D-day','/calc/date/dday/'],
    ['date-difference','날짜 차이','/calc/date/date-difference/'],
    ['date-add','날짜 더하기/빼기','/calc/date/date-add/'],
    ['age','만 나이','/calc/date/age/'],
    ['weekday','요일 계산','/calc/date/weekday/']
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
        <a href="/calc/tax/" class="msl-link"><span class="msl-icon">💰</span>프리랜서 세금<span class="msl-badge">6</span></a>
        <a href="/calc/salary/" class="msl-link"><span class="msl-icon">📈</span>이직 / 연봉<span class="msl-badge">7</span></a>
        <a href="/calc/finance/" class="msl-link"><span class="msl-icon">🏦</span>금융 · 이자<span class="msl-badge">5</span></a>
        <a href="/calc/health/" class="msl-link"><span class="msl-icon">🏃</span>건강<span class="msl-badge">5</span></a>
        <a href="/calc/pension-welfare/" class="msl-link"><span class="msl-icon">🏛</span>연금·복지<span class="msl-badge">5</span></a>
        <a href="/calc/date/" class="msl-link msl-active"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">날짜 · D-day 계산기</div>
      <div class="msl-calc-list">${calcItems.map(item=>`<a href="${item[2]}" class="msl-calc-btn ${item[0]===cfg.key?'msl-calc-active':''}"><span class="msl-calc-dot"></span>${item[1]}</a>`).join('')}</div>
    </div>`;

  const guidesWidget = (cfg.guides && cfg.guides.length)
    ? `<div class="msr-widget">
        <div class="msr-widget-title">관련 블로그</div>
        <div class="msr-widget-list">${cfg.guides.slice(0,3).map(g=>`<a href="${g[0]}" class="msr-widget-link"><span class="msr-widget-icon">📖</span><span class="msr-widget-text">${g[1]}</span></a>`).join('')}</div>
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
      '<div class="mobile-guides__title">관련 블로그</div>' +
      '<div class="mobile-guides__list">' +
      cfg.guides.slice(0,3).map(g =>
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

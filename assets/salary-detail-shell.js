
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/salary/take-home-pay/': {
      key:'take-home-pay',
      quick:['4대보험 요율은 매년 변경되므로 최신 요율을 확인하세요.','소득세는 간이세액표 기준으로 원천징수되며, 부양가족 수에 따라 달라집니다.','부양가족 공제를 반영하면 월 실수령액이 달라질 수 있습니다.','비과세 항목(식대, 차량유지비 등)을 정확히 입력해야 실수령액이 맞습니다.'],
      related:[['/calc/salary/comparison/','연봉 비교','⚖️'],['/calc/salary/job-change/','이직 연봉 비교','📊'],['/calc/salary/hourly-wage/','시급·일급 변환','⏱️']],
      guides:[['/blog/posts/salary-5000-takehome.html','연봉 5,000만원 실수령액은 얼마? 2026년 기준'],['/blog/posts/salary-comparison-guide.html','연봉 비교 분석법 - 동종업계 내 내 연봉 위치 파악하기']]
    },
    '/calc/salary/comparison/': {
      key:'comparison',
      quick:['연봉이 높아도 실수령액 차이는 세금 구간에 따라 달라집니다.','과세표준 구간이 바뀌면 세율이 급격히 올라갈 수 있습니다.','복리후생(식대, 교통비, 성과급 등)도 함께 비교해야 정확합니다.','총 보상(연봉+상여+복리후생)을 기준으로 비교하세요.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/job-change/','이직 연봉 비교','📊'],['/calc/salary/raise-rate/','연봉 인상률','📈']],
      guides:[['/blog/posts/salary-comparison-guide.html','연봉 비교 분석법 - 동종업계 내 내 연봉 위치 파악하기'],['/blog/posts/salary-negotiation.html','이직 연봉 협상 전략 - 얼마나 올려야 실제로 이득일까?']]
    },
    '/calc/salary/hourly-wage/': {
      key:'hourly-wage',
      quick:['월 소정근로시간은 주 40시간 기준 209시간이 표준입니다.','연장·야간·휴일 근로는 통상시급의 1.5배로 계산됩니다.','2026년 최저시급 기준을 확인하고 비교해 보세요.','파트타임·아르바이트는 주휴수당 포함 여부를 확인하세요.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/raise-rate/','연봉 인상률','📈'],['/calc/salary/job-change/','이직 연봉 비교','📊']],
      guides:[['/blog/posts/hourly-wage-guide.html','내 연봉을 시급으로 환산하면 얼마? 실질 시급 계산법'],['/blog/posts/minimum-wage-2026.html','2026년 최저시급 10,320원 - 월급·연봉 환산 총정리']]
    },
    '/calc/salary/job-change/': {
      key:'job-change',
      quick:['이직 시 최소 10~15% 이상 인상이 일반적인 기준입니다.','연봉 외 숨은 비용(통근비, 복지, 퇴직금 차이)도 고려하세요.','퇴직금 정산 시점에 따라 실질 수령액이 달라질 수 있습니다.','연봉 협상 시 기본급과 성과급 비율을 확인하세요.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/comparison/','연봉 비교','⚖️'],['/calc/salary/raise-rate/','연봉 인상률','📈']],
      guides:[['/blog/posts/salary-negotiation.html','이직 연봉 협상 전략 - 얼마나 올려야 실제로 이득일까?'],['/blog/posts/salary-raise-guide.html','연봉 인상률 계산법 - 3% 오르면 실수령액 실제로 얼마 늘까?']]
    },
    '/calc/salary/raise-rate/': {
      key:'raise-rate',
      quick:['물가상승률을 반영해야 실질 인상률을 알 수 있습니다.','복리 효과로 매년 소폭 인상도 장기적으로 큰 차이를 만듭니다.','인상 후 과세표준 구간이 바뀌면 실수령 인상률이 낮아질 수 있습니다.','업종·직군별 평균 인상률과 비교해 보세요.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/comparison/','연봉 비교','⚖️'],['/calc/salary/job-change/','이직 연봉 비교','📊']],
      guides:[['/blog/posts/salary-raise-guide.html','연봉 인상률 계산법 - 3% 오르면 실수령액 실제로 얼마 늘까?'],['/blog/posts/salary-comparison-guide.html','연봉 비교 분석법 - 동종업계 내 내 연봉 위치 파악하기']]
    },
    '/calc/salary/severance/': {
      key:'severance',
      quick:['퇴직금은 최근 3개월 평균임금 × 근속연수로 계산됩니다.','1년 미만 근무 시 퇴직금 지급 의무가 없을 수 있습니다.','퇴직소득세는 근속연수에 따라 공제가 적용되어 일반소득보다 세율이 낮습니다.','퇴직연금(DB/DC) 유형에 따라 수령 방식과 금액이 다릅니다.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/unemployment/','실업급여','🛟'],['/calc/salary/job-change/','이직 연봉 비교','📊']],
      guides:[['/blog/posts/severance-pay-guide.html','퇴직금 계산법과 지급 기준 완벽 정리 2026'],['/blog/posts/unemployment-benefit-guide.html','실업급여 수급 자격과 계산법 완벽 가이드']]
    },
    '/calc/salary/unemployment/': {
      key:'unemployment',
      quick:['자발적 퇴사는 원칙적으로 실업급여 수급 대상이 아닙니다.','실업급여는 퇴직 전 3개월 평균임금의 60%를 기준으로 산정됩니다.','수급 기간은 연령과 고용보험 가입 기간에 따라 120~270일입니다.','구직활동 보고를 성실히 이행해야 급여가 지속 지급됩니다.'],
      related:[['/calc/salary/take-home-pay/','연봉 실수령액','💵'],['/calc/salary/severance/','퇴직금','📦'],['/calc/salary/job-change/','이직 연봉 비교','📊']],
      guides:[['/blog/posts/unemployment-benefit-guide.html','실업급여 수급 자격과 계산법 완벽 가이드'],['/blog/posts/severance-pay-guide.html','퇴직금 계산법과 지급 기준 완벽 정리 2026']]
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
    .sh-nav-item.sh-active{background:rgba(59,130,246,.12);color:#3B82F6;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#3B82F6;color:#3B82F6;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(59,130,246,.12);color:#3B82F6;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(59,130,246,.15);color:#3B82F6;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#3B82F6;flex-shrink:0;}
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
    .page-wrap.salary-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .salary-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .salary-shell-main>.page-header{margin-bottom:0px!important;}
        .salary-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .salary-shell-main .card .field{min-width:0;}
    .salary-shell-main .card,
    .salary-shell-main .result-card,
    .salary-shell-main .explain-section,
    .salary-shell-main .siblings-section,
    .salary-shell-main .sibling-section,
    .salary-shell-main .guide-section{max-width:100%!important;}
    .salary-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .salary-shell-main .guide-section>*{margin:0!important;}
    .salary-shell-main .sibling-section{display:none!important;}
    .salary-shell-main .article-info{margin-bottom:0!important;}
    .salary-shell-main .review-footer{margin-top:0!important;}
    .salary-shell-main .guide-section .review-footer{margin-top:0!important;}
    .salary-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#3B82F6;}
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
        <a href="/calc/salary/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
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
  if(!main || main.classList.contains('salary-shell-main')) return;
  main.classList.add('salary-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['take-home-pay','연봉 실수령액','/calc/salary/take-home-pay/'],
    ['comparison','연봉 비교','/calc/salary/comparison/'],
    ['hourly-wage','시급·일급 변환','/calc/salary/hourly-wage/'],
    ['job-change','이직 연봉 비교','/calc/salary/job-change/'],
    ['raise-rate','연봉 인상률','/calc/salary/raise-rate/'],
    ['severance','퇴직금','/calc/salary/severance/'],
    ['unemployment','실업급여','/calc/salary/unemployment/']
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
        <a href="/calc/tax/" class="msl-link"><span class="msl-icon">💰</span>프리랜서 세금<span class="msl-badge">5</span></a>
        <a href="/calc/salary/" class="msl-link msl-active"><span class="msl-icon">📈</span>이직 / 연봉<span class="msl-badge">7</span></a>
        <a href="/calc/finance/" class="msl-link"><span class="msl-icon">🏦</span>금융 · 이자<span class="msl-badge">5</span></a>
        <a href="/calc/health/" class="msl-link"><span class="msl-icon">🏃</span>건강<span class="msl-badge">5</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">이직 / 연봉 계산기</div>
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

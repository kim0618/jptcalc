
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/health/bmi/': {
      key:'bmi',
      quick:['BMI는 체중(kg)을 신장(m)의 제곱으로 나눈 값입니다.','동일 BMI라도 근육량과 체지방 비율에 따라 건강 상태가 다를 수 있습니다.','WHO 기준과 아시아·한국 기준의 비만 판정 구간이 다릅니다.','정기적으로 측정하여 변화 추이를 확인하는 것이 중요합니다.'],
      related:[['/calc/health/body-fat/','체지방률','💪'],['/calc/health/ideal-weight/','적정체중','⚖️'],['/calc/health/bmr/','기초대사량','🔥']],
      guides:[['/blog/posts/bmi-guide.html','BMI 지수 해석법 - 한국인 기준 비만 판정 가이드'],['/blog/posts/ideal-weight.html','적정체중 계산법과 건강 체중 관리 전략']]
    },
    '/calc/health/bmr/': {
      key:'bmr',
      quick:['기초대사량은 생명 유지에 필요한 최소 에너지량입니다.','근육량이 많을수록 기초대사량이 높아집니다.','나이가 들수록 기초대사량이 감소하는 경향이 있습니다.','다이어트 시 기초대사량 이하로 섭취하면 요요 현상이 올 수 있습니다.'],
      related:[['/calc/health/calories/','칼로리 소모','🏃'],['/calc/health/bmi/','BMI','📏'],['/calc/health/body-fat/','체지방률','💪']],
      guides:[['/blog/posts/bmr-calories.html','기초대사량 계산법 - 다이어트와 체중 유지의 열쇠'],['/blog/posts/diet-calorie-guide.html','다이어트 칼로리 계산법 - 실제로 얼마나 먹어야 할까?']]
    },
    '/calc/health/body-fat/': {
      key:'body-fat',
      quick:['체지방률은 체중 대비 체지방의 비율을 나타냅니다.','남성과 여성의 적정 체지방률 기준이 다릅니다.','체지방률이 너무 낮아도 건강에 해로울 수 있습니다.','체성분 분석기를 이용하면 더 정확한 측정이 가능합니다.'],
      related:[['/calc/health/bmi/','BMI','📏'],['/calc/health/ideal-weight/','적정체중','⚖️'],['/calc/health/bmr/','기초대사량','🔥']],
      guides:[['/blog/posts/body-fat-guide.html','체지방률 측정법과 적정 범위 - 근육과 지방 비율 관리'],['/blog/posts/visceral-fat-guide.html','내장지방 줄이는 법 - 복부비만 관리 완벽 가이드']]
    },
    '/calc/health/calories/': {
      key:'calories',
      quick:['운동 종류와 강도에 따라 소모 칼로리가 크게 달라집니다.','체중이 많이 나갈수록 동일 운동에서 더 많은 칼로리를 소모합니다.','유산소 운동과 근력 운동을 병행하면 효과적입니다.','일상 활동(걷기, 계단 오르기 등)도 칼로리 소모에 기여합니다.'],
      related:[['/calc/health/bmr/','기초대사량','🔥'],['/calc/health/bmi/','BMI','📏'],['/calc/health/body-fat/','체지방률','💪']],
      guides:[['/blog/posts/diet-calorie-guide.html','다이어트 칼로리 계산법 - 실제로 얼마나 먹어야 할까?'],['/blog/posts/bmr-calories.html','기초대사량 계산법 - 다이어트와 체중 유지의 열쇠']]
    },
    '/calc/health/ideal-weight/': {
      key:'ideal-weight',
      quick:['적정체중은 키, 성별, 나이 등을 고려하여 산출됩니다.','표준체중 공식은 여러 가지가 있으며 참고용으로 활용하세요.','근육량이 많은 경우 적정체중보다 무거울 수 있습니다.','BMI와 함께 참고하면 더 정확한 건강 판단이 가능합니다.'],
      related:[['/calc/health/bmi/','BMI','📏'],['/calc/health/body-fat/','체지방률','💪'],['/calc/health/bmr/','기초대사량','🔥']],
      guides:[['/blog/posts/ideal-weight.html','적정체중 계산법과 건강 체중 관리 전략'],['/blog/posts/bmi-guide.html','BMI 지수 해석법 - 한국인 기준 비만 판정 가이드']]
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
    .sh-nav{display:flex;align-items:center;gap:2px;flex:1;min-width:0;}
    .sh-nav-item{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;color:#9CA3AF;transition:all .15s;white-space:nowrap;}
    .sh-nav-item:hover{background:rgba(255,255,255,.06);color:#fff;}
    .sh-nav-item.sh-active{background:rgba(16,185,129,.12);color:#10B981;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#10B981;color:#10B981;}
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
    .page-wrap.health-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .health-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .health-shell-main>.page-header{margin-bottom:0px!important;}
    .health-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .health-shell-main .card .field{min-width:0;}
    .health-shell-main .card,
    .health-shell-main .result-card,
    .health-shell-main .explain-section,
    .health-shell-main .siblings-section,
    .health-shell-main .sibling-section,
    .health-shell-main .guide-section{max-width:100%!important;}
    .health-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .health-shell-main .guide-section>*{margin:0!important;}
    .health-shell-main .sibling-section{display:none!important;}
    .health-shell-main .article-info{margin-bottom:0!important;}
    .health-shell-main .review-footer{margin-top:0!important;}
    .health-shell-main .guide-section .review-footer{margin-top:0!important;}
    .health-shell-main .guide-section>.update-note{margin-top:0!important;}
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
        <a href="/calc/tax/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>프리랜서 세금</a>
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/health/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('health-shell-main')) return;
  main.classList.add('health-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['bmi','BMI','/calc/health/bmi/'],
    ['bmr','기초대사량','/calc/health/bmr/'],
    ['body-fat','체지방률','/calc/health/body-fat/'],
    ['calories','칼로리 소모','/calc/health/calories/'],
    ['ideal-weight','적정체중','/calc/health/ideal-weight/']
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
        <a href="/calc/health/" class="msl-link msl-active"><span class="msl-icon">🏃</span>건강<span class="msl-badge">5</span></a>
        <a href="/calc/pension-welfare/" class="msl-link"><span class="msl-icon">🏛</span>연금·복지<span class="msl-badge">3</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">건강 계산기</div>
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

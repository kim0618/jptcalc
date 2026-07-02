
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/auto/auto-loan/': {
      key:'auto-loan',
      quick:['자동차 할부는 원리금균등 방식이라 매월 같은 금액(원금+이자)을 납부합니다.','선수금(계약금)을 늘리면 대출 원금이 줄어 총 이자가 감소합니다.','할부 금리는 신용도·차종·할부사에 따라 달라지므로 견적서의 실제 금리를 입력하세요.','잔존가치(유예금)를 설정하는 유예할부는 월 납입액이 낮지만 만기에 목돈이 필요합니다.'],
      related:[['/calc/auto/auto-tax/','자동차세','🚙'],['/calc/finance/loan-repayment/','대출 상환','🏠'],['/calc/realestate/dsr/','대출한도 (DSR)','🔢']],
      guides:[]
    },
    '/calc/auto/auto-tax/': {
      key:'auto-tax',
      quick:['비영업용 승용차 자동차세 = 배기량(cc) × cc당 세액(80/140/200원) + 지방교육세 30%입니다.','차령 3년차부터 매년 5%씩, 12년차 이상 최대 50%까지 본세가 경감됩니다.','1월에 연납하면 2026년 기준 약 4.58% 할인되고, 3·6·9월로 갈수록 줄어듭니다.','전기·수소차는 정액(비영업 연 10만원)이며 차령 경감이 없습니다.'],
      related:[['/calc/auto/acquisition-tax/','자동차 취득세','📄'],['/calc/auto/auto-loan/','자동차 할부','💳'],['/calc/tax/four-insurance/','4대보험료','🏢']],
      guides:[['/blog/posts/car-tax-guide.html','자동차세 계산기 2026 - 배기량·차령 감면·연납 할인 한눈에 정리']]
    },
    '/calc/auto/acquisition-tax/': {
      key:'acquisition-tax',
      quick:['비영업용 승용차 취득세 = 과세표준(부가세 뺀 공급가액) × 7%입니다.','과세표준 = 공장도가격 + 개별소비세 + 교육세 = 차량가격 ÷ 1.1입니다.','개별소비세는 2026년 7월 1일 출고분부터 정상세율 5%(6월까지 3.5%)입니다.','경차는 취득세 75만원 한도 면제, 전기·수소차는 140만원 한도 면제(~2026.12.31)입니다.'],
      related:[['/calc/auto/auto-tax/','자동차세','🚙'],['/calc/auto/auto-loan/','자동차 할부','💳'],['/calc/realestate/acquisition/','부동산 취득세','📄']],
      guides:[['/blog/posts/car-acquisition-tax-guide.html','자동차 취득세 계산 2026 - 7% 세율·개별소비세 5%·경차 면제·전기차 감면 총정리']]
    },
    '/calc/auto/ev-charging/': {
      key:'ev-charging',
      quick:['충전비 = 충전 전력량(kWh) × 충전 단가(원/kWh)입니다.','충전 전력량 = 배터리 용량 × (목표% − 현재%) ÷ 100입니다.','2026년 환경부 공공 완속 294.3원/kWh, 초급속 391.9원/kWh(4.30 개편)입니다.','100km 주행 시 전기차(완속)는 약 5,886원으로 휘발유차(약 16,750원)보다 저렴합니다.'],
      related:[['/calc/auto/auto-tax/','자동차세','🚙'],['/calc/auto/auto-loan/','자동차 할부','💳'],['/calc/auto/acquisition-tax/','자동차 취득세','📄']],
      guides:[['/blog/posts/ev-charging-guide.html','전기차 충전비 계산법 2026 - 완속·급속 요금 차이와 휘발유차 유류비 비교']]
    },
    '/calc/auto/used-car-tax/': {
      key:'used-car-tax',
      quick:['중고차 취득세 = 과세표준 × 세율(승용 7%·경차 4%)입니다.','과세표준 = 실거래가와 시가표준액 중 큰 금액입니다.','시가표준액 = 기준가격 × 경과연수별 잔가율(3년 0.518·10년 0.157)입니다.','취득세 7%/4%에는 지방교육세가 통합돼 별도 가산하지 않습니다.'],
      related:[['/calc/auto/acquisition-tax/','자동차 취득세','📄'],['/calc/auto/auto-tax/','자동차세','🚙'],['/calc/auto/auto-loan/','자동차 할부','💳']],
      guides:[['/blog/posts/car-acquisition-tax-guide.html','자동차 취득세 계산 2026 - 7% 세율·개별소비세 5%·경차 면제·전기차 감면 총정리']]
    },
    '/calc/auto/fuel-cost/': {
      key:'fuel-cost',
      quick:['유류비 = 필요 연료량 × 유가, 필요 연료량 = 주행 거리 ÷ 연비입니다.','100km를 연비 12km/L·휘발유 2,010원으로 주행하면 약 16,750원(1km당 약 168원)입니다.','실제 연비는 공인 연비보다 10~20% 낮을 수 있어 계기판 평균 연비 입력을 권장합니다.','유가는 매주 변동하니 오피넷(opinet.co.kr)에서 실제 단가를 확인하세요.'],
      related:[['/calc/auto/ev-charging/','전기차 충전비','🔌'],['/calc/auto/auto-tax/','자동차세','🚙'],['/calc/auto/auto-loan/','자동차 할부','💳']],
      guides:[['/blog/posts/fuel-cost-guide.html','유류비 계산법 2026 - 연비·유종별 기름값 한눈에 비교']]
    },
    '/calc/auto/ev-subsidy/': {
      key:'ev-subsidy',
      quick:['전기차 보조금 = 국고보조금 + 노후차 전환지원금 + 지자체 보조금입니다.','국고는 차종 등급별 대표액(중·대형 580만·소형 530만)에 차량가격 구간계수를 곱합니다.','차량가격 5,300만 미만 100%·5,300~8,500만 50%·8,500만 이상 0%입니다.','지자체 보조금은 지역·예산별 상이하니 ev.or.kr에서 조회 후 입력하세요.'],
      related:[['/calc/auto/ev-charging/','전기차 충전비','🔌'],['/calc/auto/acquisition-tax/','자동차 취득세','📄'],['/calc/auto/auto-loan/','자동차 할부','💳']],
      guides:[['/blog/posts/ev-subsidy-guide.html','전기차 보조금 2026 총정리 - 국고 최대 680만원·지자체·실구매가 계산법']]
    }
  };
  let cfg=pages[path];
  if(!cfg){
    var sm=path.match(/\/calc\/([^/]+)\/([^/]+)\//);
    var R=window.CALC_REGISTRY;
    if(sm && R && R[sm[1]] && R[sm[1]].calcs.some(function(c){return c.slug===sm[2];})){
      var others=R[sm[1]].calcs.filter(function(c){return c.slug!==sm[2];}).slice(0,3);
      cfg={key:sm[2], quick:[], related:others.map(function(c){return ['/calc/'+sm[1]+'/'+c.slug+'/', c.name, c.icon];}), guides:[]};
    } else return;
  }

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
    .sh-nav-item.sh-active{background:rgba(239,68,68,.12);color:#EF4444;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#EF4444;color:#EF4444;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(239,68,68,.12);color:#EF4444;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(239,68,68,.15);color:#EF4444;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#EF4444;flex-shrink:0;}
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
    .page-wrap.auto-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .auto-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .auto-shell-main>.page-header{margin-bottom:0px!important;}
        .auto-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .auto-shell-main .card .field{min-width:0;}
    .auto-shell-main .card,
    .auto-shell-main .result-card,
    .auto-shell-main .explain-section,
    .auto-shell-main .siblings-section,
    .auto-shell-main .sibling-section,
    .auto-shell-main .guide-section{max-width:100%!important;}
    .auto-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .auto-shell-main .guide-section>*{margin:0!important;}
    .auto-shell-main .sibling-section{display:none!important;}
    .auto-shell-main .article-info{margin-bottom:0!important;}
    .auto-shell-main .review-footer{margin-top:0!important;}
    .auto-shell-main .guide-section .review-footer{margin-top:0!important;}
    .auto-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides,.mobile-related{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#EF4444;}
    .mobile-guides__icon{font-size:15px;flex-shrink:0;}
    .mobile-guides__text{font-size:13px;font-weight:600;color:#374151;flex:1;line-height:1.4;}
    @media (max-width:1199px){.mega-layout{grid-template-columns:220px minmax(0,1fr);} .mega-sidebar-right{display:none;}}
    @media (max-width:767px){.sh-inner{padding:0 16px;} .sh-nav,.sh-cta{display:none;} .sh-hamburger{display:flex;} .mega-layout{grid-template-columns:1fr;padding:16px;gap:16px;} .mega-sidebar-left{display:none;} .mega-sidebar-left.open{display:block;position:fixed;top:60px;left:0;bottom:0;width:260px;background:#fff;border-right:1px solid rgba(0,0,0,.06);padding:20px 12px;overflow-y:auto;z-index:200;} .mobile-related,.mobile-guides{display:block;} }
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
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/tools/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#14B8A6"></span>생활·도구</a>
        <a href="/calc/tax/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>프리랜서 세금</a>
        <a href="/calc/pension-welfare/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#0EA5E9"></span>연금·복지</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/health/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
        <a href="/calc/auto/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#EF4444"></span>자동차</a>
        <a href="/calc/baby/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#84CC16"></span>출산·육아</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('auto-shell-main')) return;
  main.classList.add('auto-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const left=document.createElement('aside');
  left.className='mega-sidebar-left';
  left.id='mega-sidebar-left';
  left.innerHTML=(window.JPT_sidebarLeft?window.JPT_sidebarLeft('auto', cfg.key):'');

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

  if (cfg.related && cfg.related.length) {
    const mobileRelated = document.createElement("div");
    mobileRelated.className = "mobile-related";
    mobileRelated.innerHTML =
      "<div class=\"mobile-guides__title\">관련 계산기</div>" +
      "<div class=\"mobile-guides__list\">" +
      cfg.related.map(item =>
        `<a class="mobile-guides__link" href="${item[0]}"><span class="mobile-guides__icon">${item[2]}</span><span class="mobile-guides__text">${item[1]}</span></a>`
      ).join("") +
      "</div>";
    main.appendChild(mobileRelated);
  }

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

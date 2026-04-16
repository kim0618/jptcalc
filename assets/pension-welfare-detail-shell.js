
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/pension-welfare/retirement-living/': {
      key:'retirement-living',
      quick:['은퇴 후 필요한 월 생활비는 현재 생활비의 70~80% 수준으로 추정합니다.','물가상승률을 반드시 반영해야 실질적인 노후 준비 금액을 알 수 있습니다.','국민연금·퇴직연금 수령액을 차감한 순수 부족분을 준비하는 것이 핵심입니다.','통계청 기준 한국인 기대수명은 남성 80.6세, 여성 86.6세입니다(2023년 기준).'],
      related:[['/calc/pension-welfare/pension-tax/','연금소득세','💰'],['/calc/pension-welfare/long-term-care/','장기요양 비용','🏥'],['/calc/tax/income-tax/','종합소득세','📊']],
      guides:[]
    },
    '/calc/pension-welfare/pension-tax/': {
      key:'pension-tax',
      quick:['사적연금 연간 수령액이 1,500만원 이하이면 연령별 저율 분리과세(3.3~5.5%)가 적용됩니다.','1,500만원 초과 시 16.5% 분리과세 또는 종합과세 중 유리한 방법을 선택할 수 있습니다.','공적연금(국민연금 등)은 종합소득세 과세 대상으로, 홈택스 간이세액표를 참고하세요.','연금 수령 나이가 높을수록 낮은 세율이 적용됩니다(55세 미만 5.5%, 70세 이상 3.3%).'],
      related:[['/calc/pension-welfare/retirement-living/','노후 생활비','🏡'],['/calc/pension-welfare/long-term-care/','장기요양 비용','🏥'],['/calc/tax/income-tax/','종합소득세','📊']],
      guides:[]
    },
    '/calc/pension-welfare/long-term-care/': {
      key:'long-term-care',
      quick:['장기요양보험 등급은 1~5등급과 인지지원등급(6등급)으로 구분됩니다.','재가급여 본인부담률은 15%, 시설급여 본인부담률은 20%입니다.','기초수급자와 차상위계층은 본인부담금이 감경 또는 면제됩니다.','월 한도액을 초과하는 서비스 비용은 전액 본인이 부담합니다.'],
      related:[['/calc/pension-welfare/retirement-living/','노후 생활비','🏡'],['/calc/pension-welfare/pension-tax/','연금소득세','💰'],['/calc/health/bmi/','BMI','📏']],
      guides:[]
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
    .sh-nav-item.sh-active{background:rgba(14,165,233,.12);color:#0EA5E9;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#0EA5E9;color:#0EA5E9;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(14,165,233,.12);color:#0EA5E9;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(14,165,233,.15);color:#0EA5E9;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#0EA5E9;flex-shrink:0;}
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
    .page-wrap.pw-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;overflow:visible!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .pw-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .pw-shell-main>.page-header{margin-bottom:0px!important;}
    .pw-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .pw-shell-main .card .field{min-width:0;}
    .pw-shell-main .card,
    .pw-shell-main .result-card,
    .pw-shell-main .explain-section,
    .pw-shell-main .siblings-section,
    .pw-shell-main .sibling-section,
    .pw-shell-main .guide-section{max-width:100%!important;}
    .pw-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .pw-shell-main .guide-section>*{margin:0!important;}
    .pw-shell-main .sibling-section{display:none!important;}
    .pw-shell-main .article-info{margin-bottom:0!important;}
    .pw-shell-main .review-footer{margin-top:0!important;}
    .pw-shell-main .guide-section .review-footer{margin-top:0!important;}
    .pw-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#0EA5E9;}
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
        <a href="/calc/pension-welfare/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#0EA5E9"></span>연금·복지</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('pw-shell-main')) return;
  main.classList.add('pw-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['retirement-living','노후 생활비','/calc/pension-welfare/retirement-living/'],
    ['pension-tax','연금소득세','/calc/pension-welfare/pension-tax/'],
    ['long-term-care','장기요양 비용','/calc/pension-welfare/long-term-care/']
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
        <a href="/calc/pension-welfare/" class="msl-link msl-active"><span class="msl-icon">🏛</span>연금·복지<span class="msl-badge">3</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">연금·복지 계산기</div>
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

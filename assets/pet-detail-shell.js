
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/pet/monthly-cost/': {
      key:'monthly-cost',
      quick:['사료비는 반려동물 크기와 브랜드에 따라 월 3~15만원까지 차이가 납니다.','간식·영양제 비용도 월 고정 지출에 포함해야 정확한 예산이 됩니다.','미용·목욕 비용은 견종에 따라 크게 달라질 수 있습니다.','월 생활비에 예비비(돌발 의료비 등)를 10~20% 추가로 잡으세요.'],
      related:[['/calc/pet/adoption/','입양 초기비용','🏠'],['/calc/pet/medical/','의료비 예산','💊'],['/calc/pet/lifetime-cost/','평생 양육비','📊']]
    },
    '/calc/pet/adoption/': {
      key:'adoption',
      quick:['입양 시 중성화·예방접종·마이크로칩 비용을 반드시 포함하세요.','유기동물 입양은 분양비가 없거나 저렴하지만 초기 건강검진 비용이 필요합니다.','케이지·식기·리드줄 등 필수 용품 초기 구매비를 고려하세요.','품종견 분양가는 수십만원~수백만원까지 편차가 큽니다.'],
      related:[['/calc/pet/monthly-cost/','월 생활비','🐕'],['/calc/pet/medical/','의료비 예산','💊'],['/calc/pet/insurance/','펫보험 비교','🛡️']]
    },
    '/calc/pet/medical/': {
      key:'medical',
      quick:['연간 예방접종·심장사상충 예방비는 필수 고정 지출입니다.','노령 반려동물은 정기 건강검진 비용이 증가합니다.','응급 의료비는 수십만원~수백만원이 될 수 있으니 대비하세요.','치과 스케일링은 매년 또는 격년으로 필요할 수 있습니다.'],
      related:[['/calc/pet/monthly-cost/','월 생활비','🐕'],['/calc/pet/insurance/','펫보험 비교','🛡️'],['/calc/pet/lifetime-cost/','평생 양육비','📊']]
    },
    '/calc/pet/insurance/': {
      key:'insurance',
      quick:['보험 가입 시 면책기간과 대기기간을 반드시 확인하세요.','기왕증(기존 질병)은 보장에서 제외되는 경우가 많습니다.','보험료는 반려동물 나이·품종·보장 범위에 따라 달라집니다.','자기부담금 비율에 따라 실제 보장 금액이 크게 차이 납니다.'],
      related:[['/calc/pet/medical/','의료비 예산','💊'],['/calc/pet/monthly-cost/','월 생활비','🐕'],['/calc/pet/lifetime-cost/','평생 양육비','📊']]
    },
    '/calc/pet/lifetime-cost/': {
      key:'lifetime-cost',
      quick:['소형견 평균 수명 12~16년, 대형견 8~12년으로 총 비용이 달라집니다.','노령기에는 의료비가 크게 증가하므로 별도 예산을 마련하세요.','물가 상승률을 반영하면 실제 총 비용은 더 높아질 수 있습니다.','장묘 비용도 평생 양육비에 포함해서 계획하세요.'],
      related:[['/calc/pet/monthly-cost/','월 생활비','🐕'],['/calc/pet/adoption/','입양 초기비용','🏠'],['/calc/pet/medical/','의료비 예산','💊']]
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
    .sh-nav-item.sh-active{background:rgba(244,114,182,.12);color:#F472B6;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#F472B6;color:#F472B6;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(244,114,182,.12);color:#F472B6;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(244,114,182,.15);color:#F472B6;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F472B6;flex-shrink:0;}
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
    .page-wrap.pet-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .pet-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .pet-shell-main>.page-header{margin-bottom:8px!important;}
        .pet-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .pet-shell-main .card .field{min-width:0;}
    .pet-shell-main .card,
    .pet-shell-main .result-card,
    .pet-shell-main .explain-section,
    .pet-shell-main .siblings-section,
    .pet-shell-main .sibling-section,
    .pet-shell-main .guide-section{max-width:100%!important;}
    .pet-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .pet-shell-main .guide-section>*{margin:0!important;}
    .pet-shell-main .sibling-section{display:none!important;}
    @media (max-width:1199px){.mega-layout{grid-template-columns:220px minmax(0,1fr);} .mega-sidebar-right{display:none;}}
    @media (max-width:767px){.sh-inner{padding:0 16px;} .sh-nav,.sh-cta{display:none;} .sh-hamburger{display:flex;} .mega-layout{grid-template-columns:1fr;padding:16px;gap:16px;} .mega-sidebar-left{display:none;} .mega-sidebar-left.open{display:block;position:fixed;top:60px;left:0;bottom:0;width:260px;background:#fff;border-right:1px solid rgba(0,0,0,.06);padding:20px 12px;overflow-y:auto;z-index:200;} }
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
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/pet/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/health/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('pet-shell-main')) return;
  main.classList.add('pet-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['monthly-cost','월 생활비','/calc/pet/monthly-cost/'],
    ['adoption','입양 초기비용','/calc/pet/adoption/'],
    ['medical','의료비 예산','/calc/pet/medical/'],
    ['insurance','펫보험 비교','/calc/pet/insurance/'],
    ['lifetime-cost','평생 양육비','/calc/pet/lifetime-cost/']
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
        <a href="/calc/ai/" class="msl-link"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/salary/" class="msl-link"><span class="msl-icon">📈</span>이직 / 연봉<span class="msl-badge">7</span></a>
        <a href="/calc/pet/" class="msl-link msl-active"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
        <a href="/calc/finance/" class="msl-link"><span class="msl-icon">🏦</span>금융 · 이자<span class="msl-badge">5</span></a>
        <a href="/calc/health/" class="msl-link"><span class="msl-icon">🏃</span>건강<span class="msl-badge">5</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">반려동물 계산기</div>
      <div class="msl-calc-list">${calcItems.map(item=>`<a href="${item[2]}" class="msl-calc-btn ${item[0]===cfg.key?'msl-calc-active':''}"><span class="msl-calc-dot"></span>${item[1]}</a>`).join('')}</div>
    </div>`;

  const right=document.createElement('aside');
  right.className='mega-sidebar-right';
  right.innerHTML=`
    <div class="msr-widget">
      <div class="msr-widget-title">관련 계산기</div>
      <div class="msr-widget-list">${cfg.related.map(item=>`<a href="${item[0]}" class="msr-widget-link"><span class="msr-widget-icon">${item[2]}</span><span class="msr-widget-text">${item[1]}</span></a>`).join('')}</div>
    </div>`;

  main.parentNode.insertBefore(overlay, main);
  main.parentNode.insertBefore(layout, main);
  layout.append(left, main, right);

  const hamburger=document.querySelector('.sh-hamburger');
  const toggle=function(){left.classList.toggle('open'); overlay.classList.toggle('open');};
  if(hamburger) hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
})();

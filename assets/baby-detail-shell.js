
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  // 출생일·마지막 생리일·배란일은 미래일 수 없으므로 상한을 '오늘'로 좁힌다
  // (calc-validate.js의 전역 넓은 상한 2200을 baby 날짜 입력에 한해 덮어씀).
  // month(생년월) 입력은 출산 예정 입력을 허용하므로 전역 범위를 그대로 둔다.
  (function(){
    var t=new Date(), pad=function(n){return (n<10?'0':'')+n;};
    var today=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
    document.querySelectorAll('input[type=date]').forEach(function(el){
      el.setAttribute('max', today);
      if(!el.getAttribute('min')) el.setAttribute('min','1900-01-01');
    });
  })();
  const pages={
    '/calc/baby/ovulation/': {
      key:'ovulation',
      quick:['배란일은 다음 생리 예정일에서 14일을 뺀 날로 추정합니다(황체기 14일 고정).','가임기는 배란 예상일 5일 전부터 배란 다음날까지 약 6일간입니다.','생리주기가 28일이면 생리 시작 후 약 14일째가 배란일입니다.','주기가 불규칙하면 배란일 오차가 커지므로 배란테스트기·기초체온과 함께 확인하세요.'],
      related:[['/calc/baby/due-date/','출산예정일·임신주수','🤰'],['/calc/baby/baby-months/','아기 개월수','👶'],['/calc/date/date-add/','날짜 더하기/빼기','➕']],
      guides:[['/blog/posts/ovulation-guide.html','배란일 계산법 2026 - 가임기·임신 확률 높은 날 정확히 찾는 법']]
    },
    '/calc/baby/due-date/': {
      key:'due-date',
      quick:['출산예정일은 네겔레 법칙으로 마지막 생리 시작일 + 280일(40주)로 구합니다.','간편식은 마지막 생리 월 −3, 일 +7, 연 +1로 거의 같은 날짜가 나옵니다.','생리주기가 28일이 아니면 (주기−28)일만큼 예정일을 보정합니다.','임신 주수는 마지막 생리일을 0주로 세므로 실제 태아 나이보다 약 2주 많습니다.'],
      related:[['/calc/baby/ovulation/','배란일·가임기','🥚'],['/calc/baby/baby-months/','아기 개월수','👶'],['/calc/date/dday/','D-day','📆']],
      guides:[['/blog/posts/due-date-guide.html','출산예정일 계산법 2026 - 네겔레 법칙·임신 주수·삼분기 완전정리']]
    },
    '/calc/baby/baby-months/': {
      key:'baby-months',
      quick:['아기 개월수는 출생일로부터 지난 만 개월 수로 셉니다(출생일=만 0개월 0일).','만 17개월은 만 1세 5개월과 같습니다.','국가 영유아 건강검진은 14~35일, 4·9·18·30·42·54·66개월에 받습니다.','미숙아는 예정일 기준 교정연령을 별도로 사용하기도 합니다.'],
      related:[['/calc/baby/due-date/','출산예정일·임신주수','🤰'],['/calc/baby/ovulation/','배란일·가임기','🥚'],['/calc/date/age/','만 나이','🎂']],
      guides:[]
    },
    '/calc/baby/parental-benefit/': {
      key:'parental-benefit',
      quick:['2026년 부모급여는 만 0세 월 100만원, 만 1세 월 50만원입니다.','출생부터 24개월간 받으면 총 1,800만원을 지원받습니다.','어린이집 이용 시 보육료 바우처가 우선 지원되고 0세는 차액만 현금입니다.','아동수당(월 10만원)과 중복 지급됩니다.'],
      related:[['/calc/baby/child-allowance/','아동수당','👛'],['/calc/baby/home-care-allowance/','가정양육수당','🏠'],['/calc/baby/first-meeting/','첫만남이용권','🎁']],
      guides:[['/blog/posts/parental-benefit-guide.html','부모급여 2026 완전 가이드 - 0세 월 100만·1세 50만 신청·지급일·아동수당 중복 여부']]
    },
    '/calc/baby/child-allowance/': {
      key:'child-allowance',
      quick:['2026년 아동수당은 만 9세 미만으로 확대되어 월 10만원을 지급합니다.','소득·재산과 무관하게 출생부터 약 108개월간 총 1,080만원을 받습니다.','부모급여·가정양육수당과 중복 지급됩니다.','비수도권·인구감소지역은 추가 지원이 있을 수 있습니다.'],
      related:[['/calc/baby/parental-benefit/','부모급여','🍼'],['/calc/baby/home-care-allowance/','가정양육수당','🏠'],['/calc/baby/first-meeting/','첫만남이용권','🎁']],
      guides:[]
    },
    '/calc/baby/first-meeting/': {
      key:'first-meeting',
      quick:['첫만남이용권은 첫째아 200만원, 둘째아 이상 300만원입니다(2024.1.1 이후 출생).','출생아 1명당 지급되어 쌍둥이는 각각 받습니다.','국민행복카드 바우처로 지급되며 사용 기한은 출생일로부터 1년입니다.','부모급여·아동수당과 중복 지급됩니다.'],
      related:[['/calc/baby/parental-benefit/','부모급여','🍼'],['/calc/baby/child-allowance/','아동수당','👛'],['/calc/baby/home-care-allowance/','가정양육수당','🏠']],
      guides:[]
    },
    '/calc/baby/home-care-allowance/': {
      key:'home-care-allowance',
      quick:['가정양육수당은 만 24~86개월 미만, 어린이집 미이용 시 일반 월 10만원입니다.','농어촌은 24~35개월 15만6천원, 36~47개월 12만9천원, 48개월~ 10만원입니다.','장애아동은 36개월 미만 20만원, 36개월~ 10만원입니다.','어린이집 이용 시 보육료로 전환되어 중복 수급할 수 없습니다.'],
      related:[['/calc/baby/parental-benefit/','부모급여','🍼'],['/calc/baby/child-allowance/','아동수당','👛'],['/calc/baby/first-meeting/','첫만남이용권','🎁']],
      guides:[]
    },
    '/calc/baby/total-support/': {
      key:'total-support',
      quick:['첫만남이용권+부모급여+아동수당+가정양육수당을 합산합니다.','첫째 가정양육 시 출생~취학 전 약 3,700만원, 둘째 이상 약 3,800만원입니다.','어린이집 이용 시 가정양육수당이 보육료로 전환되어 현금 합계가 달라집니다.','지자체 출산장려금은 별도이며 포함되지 않습니다.'],
      related:[['/calc/baby/parental-benefit/','부모급여','🍼'],['/calc/baby/child-allowance/','아동수당','👛'],['/calc/baby/home-care-allowance/','가정양육수당','🏠']],
      guides:[['/blog/posts/childbirth-support-guide.html','출산 지원금 총정리 2026 - 첫만남이용권·부모급여·아동수당·양육수당 합치면 얼마']]
    },
    '/calc/baby/parental-leave-pay/': {
      key:'parental-leave-pay',
      quick:['2026년 일반 육아휴직급여: 1~3개월 100%(상한 250만)·4~6개월 100%(상한 200만)·7개월~ 80%(상한 160만).','월 하한액은 70만원, 통상임금이 상한보다 높으면 상한까지만 지급됩니다.','6+6 특례: 부모 함께 사용 시 첫 6개월 각 100%, 상한 250·250·300·350·400·450만원.','2025년부터 사후지급금(25%)이 폐지되어 휴직 중 전액 매달 지급됩니다.'],
      related:[['/calc/salary/ordinary-wage/','통상임금','🧮'],['/calc/baby/parental-benefit/','부모급여','🍼'],['/calc/baby/total-support/','출산 지원금 통합','💰']],
      guides:[['/blog/posts/parental-leave-pay.html','육아휴직급여 계산법 2026 - 통상임금 100%·6+6 최대 4,000만원, 매월 실수령액은 얼마일까']]
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
    .sh-nav-item.sh-active{background:rgba(132,204,22,.12);color:#84CC16;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#84CC16;color:#84CC16;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(132,204,22,.12);color:#84CC16;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(132,204,22,.15);color:#84CC16;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#84CC16;flex-shrink:0;}
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
    .page-wrap.baby-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .baby-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .baby-shell-main>.page-header{margin-bottom:0px!important;}
        .baby-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .baby-shell-main .card .field{min-width:0;}
    .baby-shell-main .card,
    .baby-shell-main .result-card,
    .baby-shell-main .explain-section,
    .baby-shell-main .siblings-section,
    .baby-shell-main .sibling-section,
    .baby-shell-main .guide-section{max-width:100%!important;}
    .baby-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .baby-shell-main .guide-section>*{margin:0!important;}
    .baby-shell-main .sibling-section{display:none!important;}
    .baby-shell-main .article-info{margin-bottom:0!important;}
    .baby-shell-main .review-footer{margin-top:0!important;}
    .baby-shell-main .guide-section .review-footer{margin-top:0!important;}
    .baby-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides,.mobile-related{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#84CC16;}
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
        <a href="/calc/auto/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#EF4444"></span>자동차</a>
        <a href="/calc/baby/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#84CC16"></span>출산·육아</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('baby-shell-main')) return;
  main.classList.add('baby-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const left=document.createElement('aside');
  left.className='mega-sidebar-left';
  left.id='mega-sidebar-left';
  left.innerHTML=(window.JPT_sidebarLeft?window.JPT_sidebarLeft('baby', cfg.key):'');

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


(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/ai/api-token/': {
      key:'api-token',
      quick:['토큰 단가는 모델과 제공사에 따라 크게 다를 수 있습니다.','한국어는 영어보다 토큰 수가 많아 비용이 더 높아질 수 있습니다.','캐싱을 활용하면 반복 요청의 토큰 비용을 절감할 수 있습니다.','과금 구조(입력/출력 토큰 분리)를 정확히 확인하세요.'],
      related:[['/calc/ai/gpu-cloud/','GPU 클라우드 비교','💻'],['/calc/ai/llm-comparison/','LLM 비교표','📊'],['/calc/ai/saas-comparison/','SaaS vs 자체구축','⚖️']],
      guides:[['/blog/posts/llm-api-price-comparison.html','LLM API 토큰 단가 비교 2026 - Claude·GPT·Gemini'],['/blog/posts/chatgpt-api-cost.html','ChatGPT API 비용 계산 - 토큰 요금 완전 정리']]
    },
    '/calc/ai/gpu-cloud/': {
      key:'gpu-cloud',
      quick:['온디맨드 대비 스팟 인스턴스를 활용하면 최대 70% 절감할 수 있습니다.','예약 인스턴스(1년/3년)는 장기 사용 시 비용 효율이 높습니다.','GPU 종류(A100, H100 등)에 따라 성능과 가격이 크게 달라집니다.','클라우드 벤더별 동일 GPU라도 시간당 가격 차이가 있으니 비교하세요.'],
      related:[['/calc/ai/api-token/','API 토큰 비용','⚡'],['/calc/ai/saas-comparison/','SaaS vs 자체구축','⚖️'],['/calc/ai/infra-forecast/','인프라 예측','🚀']],
      guides:[['/blog/posts/gpu-cloud-comparison.html','GPU 클라우드 비용 비교 - AWS vs GCP vs Azure'],['/blog/posts/ai-infra-cost-guide.html','AI 서비스 운영 비용, 월 얼마나 들까?']]
    },
    '/calc/ai/saas-comparison/': {
      key:'saas-comparison',
      quick:['손익분기점(BEP)을 기준으로 SaaS와 자체구축의 유불리를 판단하세요.','자체구축 시 DevOps 인건비와 운영 비용을 반드시 포함해야 합니다.','사용량이 급증할 때 스케일링 비용도 함께 고려하세요.','라이선스, 보안 인증, 데이터 이전 등 숨은 비용을 놓치지 마세요.'],
      related:[['/calc/ai/api-token/','API 토큰 비용','⚡'],['/calc/ai/gpu-cloud/','GPU 클라우드 비교','💻'],['/calc/ai/infra-forecast/','인프라 예측','🚀']],
      guides:[['/blog/posts/saas-vs-self-build.html','SaaS vs 자체구축 비용 비교 - TCO·손익분기점'],['/blog/posts/ai-saas-cost-guide.html','AI SaaS 구독 비용 최적화 가이드']]
    },
    '/calc/ai/llm-comparison/': {
      key:'llm-comparison',
      quick:['벤치마크 점수는 실제 사용 사례와 다를 수 있으므로 참고 지표로 활용하세요.','API 가격은 수시로 변동되므로 최신 공식 가격표를 확인하세요.','컨텍스트 윈도우 크기에 따라 처리 가능한 데이터 양이 달라집니다.','용도(코딩, 번역, 분석 등)에 따라 최적 모델이 다를 수 있습니다.'],
      related:[['/calc/ai/api-token/','API 토큰 비용','⚡'],['/calc/ai/gpu-cloud/','GPU 클라우드 비교','💻'],['/calc/ai/saas-comparison/','SaaS vs 자체구축','⚖️']],
      guides:[['/blog/posts/claude-vs-gpt.html','Claude vs GPT - AI 모델 성능·비용 비교 2026'],['/blog/posts/llm-api-price-comparison.html','LLM API 토큰 단가 비교 2026']]
    },
    '/calc/ai/infra-forecast/': {
      key:'infra-forecast',
      quick:['사용량 증가는 비선형적일 수 있으므로 단순 선형 예측에 주의하세요.','비용 최적화를 위해 오토스케일링과 예약 인스턴스를 병행 검토하세요.','모니터링 도구를 통해 실제 사용 패턴을 지속적으로 추적하세요.','예약 용량과 온디맨드 비율을 적절히 조합하면 비용을 줄일 수 있습니다.'],
      related:[['/calc/ai/api-token/','API 토큰 비용','⚡'],['/calc/ai/gpu-cloud/','GPU 클라우드 비교','💻'],['/calc/ai/saas-comparison/','SaaS vs 자체구축','⚖️']],
      guides:[['/blog/posts/ai-infra-cost-guide.html','AI 서비스 운영 비용, 월 얼마나 들까?'],['/blog/posts/gpu-cloud-comparison.html','GPU 클라우드 비용 비교 - AWS vs GCP vs Azure']]
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
    .sh-nav-item.sh-active{background:rgba(139,92,246,.12);color:#8B5CF6;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#8B5CF6;color:#8B5CF6;}
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
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(139,92,246,.12);color:#8B5CF6;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(139,92,246,.15);color:#8B5CF6;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#8B5CF6;flex-shrink:0;}
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
    .page-wrap.ai-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .ai-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .ai-shell-main>.page-header{margin-bottom:0px!important;}
        .ai-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .ai-shell-main .card .field{min-width:0;}
    .ai-shell-main .card,
    .ai-shell-main .result-card,
    .ai-shell-main .explain-section,
    .ai-shell-main .siblings-section,
    .ai-shell-main .sibling-section,
    .ai-shell-main .guide-section{max-width:100%!important;}
    .ai-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .ai-shell-main .guide-section>*{margin:0!important;}
    .ai-shell-main .sibling-section{display:none!important;}
    .ai-shell-main .article-info{margin-bottom:0!important;}
    .ai-shell-main .review-footer{margin-top:0!important;}
    .ai-shell-main .guide-section .review-footer{margin-top:0!important;}
    .ai-shell-main .guide-section>.update-note{margin-top:0!important;}
    .mobile-guides{display:none;margin-top:16px;}
    .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
    .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
    .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
    .mobile-guides__link:hover{border-color:#8B5CF6;}
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
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/ai/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('ai-shell-main')) return;
  main.classList.add('ai-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const calcItems=[
    ['api-token','API 토큰 비용','/calc/ai/api-token/'],
    ['gpu-cloud','GPU 클라우드','/calc/ai/gpu-cloud/'],
    ['saas-comparison','SaaS vs 자체구축','/calc/ai/saas-comparison/'],
    ['llm-comparison','LLM 비교표','/calc/ai/llm-comparison/'],
    ['infra-forecast','인프라 예측','/calc/ai/infra-forecast/']
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
        <a href="/calc/pension-welfare/" class="msl-link"><span class="msl-icon">🏛</span>연금·복지<span class="msl-badge">3</span></a>
        <a href="/calc/date/" class="msl-link"><span class="msl-icon">📅</span>날짜 · D-day<span class="msl-badge">5</span></a>
        <a href="/calc/ai/" class="msl-link msl-active"><span class="msl-icon">🤖</span>AI / 테크<span class="msl-badge">5</span></a>
        <a href="/calc/pet/" class="msl-link"><span class="msl-icon">🐾</span>반려동물<span class="msl-badge">5</span></a>
      </nav>
    </div>
    <div class="msl-divider"></div>
    <div class="msl-section">
      <div class="msl-title">AI / 테크 계산기</div>
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

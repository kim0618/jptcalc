(function(){
  const slugMap = {
    'api-token': {
      title: 'API 토큰 비용',
      emoji: '⚡',
      tips: [
        '토큰 단가는 모델과 제공사에 따라 크게 다를 수 있습니다.',
        '한국어는 영어보다 토큰 수가 많아 비용이 더 높아질 수 있습니다.',
        '캐싱을 활용하면 반복 요청의 토큰 비용을 절감할 수 있습니다.',
        '과금 구조(입력/출력 토큰 분리)를 정확히 확인하세요.'
      ],
      related: [
        ['/calc/ai/gpu-cloud/','💻','GPU 클라우드 비교'],
        ['/calc/ai/saas-comparison/','⚖️','SaaS vs 자체구축'],
        ['/calc/ai/llm-comparison/','📊','LLM 비교표']
      ]
    },
    'gpu-cloud': {
      title: 'GPU 클라우드',
      emoji: '💻',
      tips: [
        '온디맨드 대비 스팟 인스턴스를 활용하면 최대 70% 절감할 수 있습니다.',
        '예약 인스턴스(1년/3년)는 장기 사용 시 비용 효율이 높습니다.',
        'GPU 종류(A100, H100 등)에 따라 성능과 가격이 크게 달라집니다.',
        '클라우드 벤더별 동일 GPU라도 시간당 가격 차이가 있으니 비교하세요.'
      ],
      related: [
        ['/calc/ai/api-token/','⚡','API 토큰 비용'],
        ['/calc/ai/saas-comparison/','⚖️','SaaS vs 자체구축'],
        ['/calc/ai/infra-forecast/','🚀','인프라 예측']
      ]
    },
    'saas-comparison': {
      title: 'SaaS vs 자체구축',
      emoji: '⚖️',
      tips: [
        '손익분기점(BEP)을 기준으로 SaaS와 자체구축의 유불리를 판단하세요.',
        '자체구축 시 DevOps 인건비와 운영 비용을 반드시 포함해야 합니다.',
        '사용량이 급증할 때 스케일링 비용도 함께 고려하세요.',
        '라이선스, 보안 인증, 데이터 이전 등 숨은 비용을 놓치지 마세요.'
      ],
      related: [
        ['/calc/ai/api-token/','⚡','API 토큰 비용'],
        ['/calc/ai/gpu-cloud/','💻','GPU 클라우드 비교'],
        ['/calc/ai/infra-forecast/','🚀','인프라 예측']
      ]
    },
    'llm-comparison': {
      title: 'LLM 비교표',
      emoji: '📊',
      tips: [
        '벤치마크 점수는 실제 사용 사례와 다를 수 있으므로 참고 지표로 활용하세요.',
        'API 가격은 수시로 변동되므로 최신 공식 가격표를 확인하세요.',
        '컨텍스트 윈도우 크기에 따라 처리 가능한 데이터 양이 달라집니다.',
        '용도(코딩, 번역, 분석 등)에 따라 최적 모델이 다를 수 있습니다.'
      ],
      related: [
        ['/calc/ai/api-token/','⚡','API 토큰 비용'],
        ['/calc/ai/gpu-cloud/','💻','GPU 클라우드 비교'],
        ['/calc/ai/saas-comparison/','⚖️','SaaS vs 자체구축']
      ]
    },
    'infra-forecast': {
      title: '인프라 예측',
      emoji: '🚀',
      tips: [
        '사용량 증가는 비선형적일 수 있으므로 단순 선형 예측에 주의하세요.',
        '비용 최적화를 위해 오토스케일링과 예약 인스턴스를 병행 검토하세요.',
        '모니터링 도구를 통해 실제 사용 패턴을 지속적으로 추적하세요.',
        '예약 용량과 온디맨드 비율을 적절히 조합하면 비용을 줄일 수 있습니다.'
      ],
      related: [
        ['/calc/ai/api-token/','⚡','API 토큰 비용'],
        ['/calc/ai/gpu-cloud/','💻','GPU 클라우드 비교'],
        ['/calc/ai/saas-comparison/','⚖️','SaaS vs 자체구축']
      ]
    }
  };

  const calcLinks = [
    ['/calc/ai/api-token/','⚡','API 토큰 비용','api-token'],
    ['/calc/ai/gpu-cloud/','💻','GPU 클라우드','gpu-cloud'],
    ['/calc/ai/saas-comparison/','⚖️','SaaS vs 자체구축','saas-comparison'],
    ['/calc/ai/llm-comparison/','📊','LLM 비교표','llm-comparison'],
    ['/calc/ai/infra-forecast/','🚀','인프라 예측','infra-forecast']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/ai\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('ai-shell-styles')) return;
    const css = `
      .ai-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .ai-shell-layout .page-header{border:1px solid rgba(139,92,246,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .ai-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%);}
      .ai-shell-layout .main-content{min-width:0;}
      .ai-shell-layout .page-wrap,.ai-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .ai-shell-layout .main-wrap,.ai-shell-layout .page-wrap{padding:0 !important;}
      .ai-shell-layout .guide-section{margin-top:24px;}
      .ai-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(139,92,246,.12);color:#8B5CF6;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(139,92,246,.15);color:#8B5CF6;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(139,92,246,.12);color:#8B5CF6;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#8B5CF6;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.ai-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.ai-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'ai-shell-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function leftSidebarHtml(currentSlug) {
    const subLinks = calcLinks.map(([href, icon, label, slug]) => {
      const active = slug === currentSlug ? ' msl-calc-active' : '';
      return `<a class="msl-calc-btn${active}" href="${href}"><span class="msl-calc-dot"></span>${label}</a>`;
    }).join('');
    return `
      <aside class="mega-sidebar-left">
        <div class="msl-section">
          <div class="msl-title">카테고리</div>
          <div class="msl-nav">
            <a class="msl-link" href="/"><span class="msl-icon">🧮</span><span>전체 보기</span></a>
            <a class="msl-link" href="/calc/realestate/"><span class="msl-icon">🏠</span><span>부동산</span><span class="msl-badge">15</span></a>
            <a class="msl-link" href="/calc/tax/"><span class="msl-icon">💰</span><span>프리랜서 세금</span><span class="msl-badge">6</span></a>
            <a class="msl-link" href="/calc/salary/"><span class="msl-icon">📈</span><span>이직 / 연봉</span><span class="msl-badge">7</span></a>
            <a class="msl-link" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pension-welfare/"><span class="msl-icon">🏛</span><span>연금·복지</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link msl-active" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">AI / 테크 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'AI / 테크 계산기', emoji:'🤖', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">AI / 테크 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.ai-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout ai-shell-layout';
    shell.innerHTML = leftSidebarHtml(slug) + '<main class="main-content"></main>' + rightSidebarHtml(slug);

    const main = shell.querySelector('.main-content');
    main.appendChild(content);
    if (guide && guide !== content && !main.contains(guide)) main.appendChild(guide);

    if (footer) body.insertBefore(shell, footer);
    else body.appendChild(shell);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShell);
  } else {
    mountShell();
  }
})();

(function(){
  const slugMap = {
    'monthly-cost': {
      title: '월 생활비',
      emoji: '🐕',
      tips: [
        '사료비는 반려동물 크기와 브랜드에 따라 월 3~15만원까지 차이가 납니다.',
        '간식·영양제 비용도 월 고정 지출에 포함해야 정확한 예산이 됩니다.',
        '미용·목욕 비용은 견종에 따라 크게 달라질 수 있습니다.',
        '월 생활비에 예비비(돌발 의료비 등)를 10~20% 추가로 잡으세요.'
      ],
      related: [
        ['/calc/pet/adoption/','🏠','입양 초기비용'],
        ['/calc/pet/medical/','💊','의료비 예산'],
        ['/calc/pet/lifetime-cost/','📊','평생 양육비']
      ]
    },
    'adoption': {
      title: '입양 초기비용',
      emoji: '🏠',
      tips: [
        '입양 시 중성화·예방접종·마이크로칩 비용을 반드시 포함하세요.',
        '유기동물 입양은 분양비가 없거나 저렴하지만 초기 건강검진 비용이 필요합니다.',
        '케이지·식기·리드줄 등 필수 용품 초기 구매비를 고려하세요.',
        '품종견 분양가는 수십만원~수백만원까지 편차가 큽니다.'
      ],
      related: [
        ['/calc/pet/monthly-cost/','🐕','월 생활비'],
        ['/calc/pet/medical/','💊','의료비 예산'],
        ['/calc/pet/insurance/','🛡️','펫보험 비교']
      ]
    },
    'medical': {
      title: '의료비 예산',
      emoji: '💊',
      tips: [
        '연간 예방접종·심장사상충 예방비는 필수 고정 지출입니다.',
        '노령 반려동물은 정기 건강검진 비용이 증가합니다.',
        '응급 의료비는 수십만원~수백만원이 될 수 있으니 대비하세요.',
        '치과 스케일링은 매년 또는 격년으로 필요할 수 있습니다.'
      ],
      related: [
        ['/calc/pet/monthly-cost/','🐕','월 생활비'],
        ['/calc/pet/insurance/','🛡️','펫보험 비교'],
        ['/calc/pet/lifetime-cost/','📊','평생 양육비']
      ]
    },
    'insurance': {
      title: '펫보험 비교',
      emoji: '🛡️',
      tips: [
        '보험 가입 시 면책기간과 대기기간을 반드시 확인하세요.',
        '기왕증(기존 질병)은 보장에서 제외되는 경우가 많습니다.',
        '보험료는 반려동물 나이·품종·보장 범위에 따라 달라집니다.',
        '자기부담금 비율에 따라 실제 보장 금액이 크게 차이 납니다.'
      ],
      related: [
        ['/calc/pet/medical/','💊','의료비 예산'],
        ['/calc/pet/monthly-cost/','🐕','월 생활비'],
        ['/calc/pet/lifetime-cost/','📊','평생 양육비']
      ]
    },
    'lifetime-cost': {
      title: '평생 양육비',
      emoji: '📊',
      tips: [
        '소형견 평균 수명 12~16년, 대형견 8~12년으로 총 비용이 달라집니다.',
        '노령기에는 의료비가 크게 증가하므로 별도 예산을 마련하세요.',
        '물가 상승률을 반영하면 실제 총 비용은 더 높아질 수 있습니다.',
        '장묘 비용도 평생 양육비에 포함해서 계획하세요.'
      ],
      related: [
        ['/calc/pet/monthly-cost/','🐕','월 생활비'],
        ['/calc/pet/adoption/','🏠','입양 초기비용'],
        ['/calc/pet/medical/','💊','의료비 예산']
      ]
    }
  };

  const calcLinks = [
    ['/calc/pet/monthly-cost/','🐕','월 생활비','monthly-cost'],
    ['/calc/pet/adoption/','🏠','입양 초기비용','adoption'],
    ['/calc/pet/medical/','💊','의료비 예산','medical'],
    ['/calc/pet/insurance/','🛡️','펫보험 비교','insurance'],
    ['/calc/pet/lifetime-cost/','📊','평생 양육비','lifetime-cost']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/pet\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('pet-shell-styles')) return;
    const css = `
      .pet-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .pet-shell-layout .page-header{border:1px solid rgba(244,114,182,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .pet-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(244,114,182,0.2) 0%,transparent 70%);}
      .pet-shell-layout .main-content{min-width:0;}
      .pet-shell-layout .page-wrap,.pet-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .pet-shell-layout .main-wrap,.pet-shell-layout .page-wrap{padding:0 !important;}
      .pet-shell-layout .guide-section{margin-top:24px;}
      .pet-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(244,114,182,.12);color:#F472B6;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(244,114,182,.15);color:#F472B6;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(244,114,182,.12);color:#F472B6;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F472B6;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.pet-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.pet-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'pet-shell-styles';
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
            <a class="msl-link" href="/calc/pension-welfare/"><span class="msl-icon">🏛</span><span>연금·복지</span><span class="msl-badge">3</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link msl-active" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">반려동물 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'반려동물 계산기', emoji:'🐾', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">반려동물 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.pet-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout pet-shell-layout';
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

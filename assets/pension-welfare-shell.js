(function(){
  const slugMap = {
    'national-pension': {
      title: '국민연금 수령액',
      emoji: '🏛',
      tips: [
        '국민연금은 최소 10년(120개월) 이상 납부해야 수령할 수 있습니다.',
        '조기수령(60세)은 1년당 6% 감액, 연기수령(70세)은 1년당 7.2% 증액됩니다.',
        '2026년 소득대체율은 41.5%로, 40년 가입 기준 평균소득의 41.5%가 목표 연금액입니다.',
        '정확한 예상 연금액은 국민연금공단(nps.or.kr)에서 공인인증서 없이 조회 가능합니다.'
      ],
      related: [
        ['/calc/pension-welfare/basic-pension/','💰','기초연금 수급 판정'],
        ['/calc/pension-welfare/retirement-living/','🏡','노후 생활비'],
        ['/calc/pension-welfare/pension-tax/','📊','연금소득세']
      ]
    },
    'basic-pension': {
      title: '기초연금 수급 판정',
      emoji: '💰',
      tips: [
        '기초연금은 만 65세 이상 소득 하위 70% 어르신에게 지급됩니다.',
        '2025년 기준 선정기준액은 단독가구 228만원, 부부가구 364.8만원입니다.',
        '부동산·금융자산은 연 4%로 환산해 소득인정액에 합산됩니다.',
        '정확한 수급 여부는 복지로(bokjiro.go.kr) 모의계산 또는 주민센터에서 확인하세요.'
      ],
      related: [
        ['/calc/pension-welfare/national-pension/','🏛','국민연금 수령액'],
        ['/calc/pension-welfare/retirement-living/','🏡','노후 생활비'],
        ['/calc/pension-welfare/long-term-care/','🏥','장기요양 비용']
      ]
    },
    'retirement-living': {
      title: '노후 생활비',
      emoji: '🏡',
      tips: [
        '은퇴 후 필요한 월 생활비는 현재 생활비의 70~80% 수준으로 추정합니다.',
        '물가상승률을 반드시 반영해야 실질적인 노후 준비 금액을 알 수 있습니다.',
        '국민연금·퇴직연금 수령액을 차감한 순수 부족분을 준비하는 것이 핵심입니다.',
        '통계청 기준 한국인 기대수명은 남성 80.6세, 여성 86.6세입니다(2023년 기준).'
      ],
      related: [
        ['/calc/pension-welfare/national-pension/','🏛','국민연금 수령액'],
        ['/calc/pension-welfare/pension-tax/','💰','연금소득세'],
        ['/calc/pension-welfare/long-term-care/','🏥','장기요양 비용']
      ]
    },
    'pension-tax': {
      title: '연금소득세',
      emoji: '💰',
      tips: [
        '사적연금 연간 수령액이 1,500만원 이하이면 연령별 저율 분리과세(3.3~5.5%)가 적용됩니다.',
        '1,500만원 초과 시 16.5% 분리과세 또는 종합과세 중 유리한 방법을 선택할 수 있습니다.',
        '공적연금(국민연금 등)은 종합소득세 과세 대상으로, 홈택스 간이세액표를 참고하세요.',
        '연금 수령 나이가 높을수록 낮은 세율이 적용됩니다(55세 미만 5.5%, 70세 이상 3.3%).'
      ],
      related: [
        ['/calc/pension-welfare/national-pension/','🏛','국민연금 수령액'],
        ['/calc/pension-welfare/retirement-living/','🏡','노후 생활비'],
        ['/calc/pension-welfare/long-term-care/','🏥','장기요양 비용']
      ]
    },
    'long-term-care': {
      title: '장기요양 비용',
      emoji: '🏥',
      tips: [
        '장기요양보험 등급은 1~5등급과 인지지원등급(6등급)으로 구분됩니다.',
        '재가급여 본인부담률은 15%, 시설급여 본인부담률은 20%입니다.',
        '기초수급자와 차상위계층은 본인부담금이 감경 또는 면제됩니다.',
        '월 한도액을 초과하는 서비스 비용은 전액 본인이 부담합니다.'
      ],
      related: [
        ['/calc/pension-welfare/national-pension/','🏛','국민연금 수령액'],
        ['/calc/pension-welfare/retirement-living/','🏡','노후 생활비'],
        ['/calc/pension-welfare/pension-tax/','💰','연금소득세']
      ]
    }
  };

  const calcLinks = [
    ['/calc/pension-welfare/national-pension/','🏛','국민연금 수령액','national-pension'],
    ['/calc/pension-welfare/basic-pension/','💰','기초연금 수급 판정','basic-pension'],
    ['/calc/pension-welfare/retirement-living/','🏡','노후 생활비','retirement-living'],
    ['/calc/pension-welfare/pension-tax/','💰','연금소득세','pension-tax'],
    ['/calc/pension-welfare/long-term-care/','🏥','장기요양 비용','long-term-care']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/pension-welfare\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('pension-welfare-shell-styles')) return;
    const css = `
      .pension-welfare-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .pension-welfare-shell-layout .page-header{border:1px solid rgba(14,165,233,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .pension-welfare-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,0.2) 0%,transparent 70%);}
      .pension-welfare-shell-layout .main-content{min-width:0;}
      .pension-welfare-shell-layout .page-wrap,.pension-welfare-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .pension-welfare-shell-layout .main-wrap,.pension-welfare-shell-layout .page-wrap{padding:0 !important;}
      .pension-welfare-shell-layout .guide-section{margin-top:24px;}
      .pension-welfare-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(14,165,233,.12);color:#0EA5E9;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(14,165,233,.15);color:#0EA5E9;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(14,165,233,.12);color:#0EA5E9;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#0EA5E9;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.pension-welfare-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.pension-welfare-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'pension-welfare-shell-styles';
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
            <a class="msl-link msl-active" href="/calc/pension-welfare/"><span class="msl-icon">🏛</span><span>연금·복지</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">연금·복지 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'연금·복지 계산기', emoji:'🏛', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">연금·복지 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.pension-welfare-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout pension-welfare-shell-layout';
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

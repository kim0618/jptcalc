(function(){
  const slugMap = {
    'deposit': {
      title: '예금 이자',
      emoji: '💰',
      tips: [
        '예금 금리는 세전 금리이므로 이자소득세(15.4%)를 고려하세요.',
        '비과세 종합저축이나 세금우대 상품을 활용하면 세후 수익이 높아집니다.',
        '예금자보호법에 따라 1인당 5천만 원까지 보호됩니다.',
        '금리가 같더라도 이자 지급 방식(만기일시, 월이자)에 따라 실수령이 다릅니다.'
      ],
      related: [
        ['/calc/finance/savings/','📈','적금 만기'],
        ['/calc/finance/compound/','📊','복리 계산'],
        ['/calc/finance/investment/','📉','투자 수익률']
      ]
    },
    'savings': {
      title: '적금 만기',
      emoji: '📈',
      tips: [
        '적금 이자는 매월 불입금에 대해 잔여 개월 수만큼 계산됩니다.',
        '중도 해지 시 약정 금리보다 낮은 중도해지 금리가 적용됩니다.',
        '자유적금은 납입 금액이 유동적이므로 만기 수령액이 달라질 수 있습니다.',
        '세전·세후 이자 차이를 확인하고 절세 상품을 비교하세요.'
      ],
      related: [
        ['/calc/finance/deposit/','💰','예금 이자'],
        ['/calc/finance/compound/','📊','복리 계산'],
        ['/calc/finance/loan-repayment/','🏠','대출 상환']
      ]
    },
    'compound': {
      title: '복리 계산',
      emoji: '📊',
      tips: [
        '복리는 이자에 이자가 붙으므로 기간이 길수록 효과가 극대화됩니다.',
        '복리 주기(연복리, 월복리, 일복리)에 따라 최종 금액이 달라집니다.',
        '72의 법칙: 72를 연이율로 나누면 원금이 2배가 되는 대략적 기간을 알 수 있습니다.',
        '인플레이션을 감안한 실질 수익률로 비교해야 정확합니다.'
      ],
      related: [
        ['/calc/finance/deposit/','💰','예금 이자'],
        ['/calc/finance/savings/','📈','적금 만기'],
        ['/calc/finance/investment/','📉','투자 수익률']
      ]
    },
    'loan-repayment': {
      title: '대출 상환',
      emoji: '🏠',
      tips: [
        '원리금균등 상환은 매월 동일 금액을 납부하지만, 초기에는 이자 비중이 큽니다.',
        '원금균등 상환은 초기 부담이 크지만 총 이자가 적습니다.',
        '중도상환수수료를 확인한 뒤 여유자금으로 조기 상환을 검토하세요.',
        '변동금리 대출은 기준금리 변동에 따라 상환액이 달라질 수 있습니다.'
      ],
      related: [
        ['/calc/finance/deposit/','💰','예금 이자'],
        ['/calc/finance/compound/','📊','복리 계산'],
        ['/calc/finance/investment/','📉','투자 수익률']
      ]
    },
    'investment': {
      title: '투자 수익률',
      emoji: '📉',
      tips: [
        '단순 수익률과 연환산(CAGR) 수익률을 구분해서 비교하세요.',
        '수수료와 세금을 반영한 순수익률이 실제 투자 성과입니다.',
        '분산 투자로 리스크를 줄이면 장기적으로 안정적인 수익을 기대할 수 있습니다.',
        '과거 수익률이 미래 수익을 보장하지 않으므로 참고 지표로만 활용하세요.'
      ],
      related: [
        ['/calc/finance/compound/','📊','복리 계산'],
        ['/calc/finance/deposit/','💰','예금 이자'],
        ['/calc/finance/loan-repayment/','🏠','대출 상환']
      ]
    }
  };

  const calcLinks = [
    ['/calc/finance/deposit/','💰','예금 이자','deposit'],
    ['/calc/finance/savings/','📈','적금 만기','savings'],
    ['/calc/finance/compound/','📊','복리 계산','compound'],
    ['/calc/finance/loan-repayment/','🏠','대출 상환','loan-repayment'],
    ['/calc/finance/investment/','📉','투자 수익률','investment']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/finance\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('finance-shell-styles')) return;
    const css = `
      .finance-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .finance-shell-layout .page-header{border:1px solid rgba(99,102,241,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .finance-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%);}
      .finance-shell-layout .main-content{min-width:0;}
      .finance-shell-layout .page-wrap,.finance-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .finance-shell-layout .main-wrap,.finance-shell-layout .page-wrap{padding:0 !important;}
      .finance-shell-layout .guide-section{margin-top:24px;}
      .finance-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(99,102,241,.12);color:#6366F1;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(99,102,241,.15);color:#6366F1;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(99,102,241,.12);color:#6366F1;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#6366F1;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.finance-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.finance-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'finance-shell-styles';
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
            <a class="msl-link" href="/calc/tax/"><span class="msl-icon">💰</span><span>프리랜서 세금</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/salary/"><span class="msl-icon">📈</span><span>이직 / 연봉</span><span class="msl-badge">7</span></a>
            <a class="msl-link msl-active" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">금융 · 이자 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'금융 · 이자 계산기', emoji:'🏦', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">금융 · 이자 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.finance-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout finance-shell-layout';
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

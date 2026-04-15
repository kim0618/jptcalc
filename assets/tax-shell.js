(function(){
  const slugMap = {
    'withholding': {
      title: '3.3% 원천징수',
      emoji: '💲',
      tips: [
        '3.3%는 소득세 3%와 지방소득세 0.3%의 합계입니다.',
        '원천징수된 금액은 다음 해 5월 종합소득세 신고 시 기납부세액으로 공제됩니다.',
        '건별·월별·연간 기준을 바꿔 보면 연간 세금 부담을 가늠할 수 있습니다.',
        '부가세를 별도로 받는 구조라면 세금계산서 기준 금액을 따로 확인하세요.'
      ],
      related: [
        ['/calc/tax/income-tax/','📈','종합소득세 계산기'],
        ['/calc/tax/freelancer-income/','💰','월 순수입 계산기'],
        ['/calc/tax/vat/','📄','부가가치세 계산기']
      ]
    },
    'income-tax': {
      title: '종합소득세',
      emoji: '📈',
      tips: [
        '프리랜서 소득은 사업소득으로 분류되어 종합소득세 신고 대상입니다.',
        '경비율(단순·기준)에 따라 과세표준이 크게 달라질 수 있습니다.',
        '기납부한 3.3% 원천징수 세액은 종합소득세에서 공제됩니다.',
        '소득공제·세액공제 항목을 빠짐없이 반영하면 절세 효과를 높일 수 있습니다.'
      ],
      related: [
        ['/calc/tax/withholding/','💲','3.3% 원천징수 계산기'],
        ['/calc/tax/insurance-comparison/','👥','4대보험 비교 계산기'],
        ['/calc/tax/freelancer-income/','💰','월 순수입 계산기']
      ]
    },
    'vat': {
      title: '부가가치세',
      emoji: '📄',
      tips: [
        '일반과세자는 매출세액에서 매입세액을 차감한 금액을 납부합니다.',
        '간이과세자는 업종별 부가가치율을 적용하여 세액을 계산합니다.',
        '연 매출 8,000만원 미만 간이과세자는 납부 면제 대상일 수 있습니다.',
        '세금계산서 발행 여부와 과세 유형을 미리 확인하세요.'
      ],
      related: [
        ['/calc/tax/withholding/','💲','3.3% 원천징수 계산기'],
        ['/calc/tax/income-tax/','📈','종합소득세 계산기'],
        ['/calc/tax/freelancer-income/','💰','월 순수입 계산기']
      ]
    },
    'insurance-comparison': {
      title: '4대보험 비교',
      emoji: '👥',
      tips: [
        '4대보험 직장인은 국민연금·건강보험·고용보험·산재보험이 적용됩니다.',
        '3.3% 프리랜서는 국민연금·건강보험을 지역가입자로 별도 납부합니다.',
        '소득 수준과 경비율에 따라 유불리가 달라지므로 비교 후 판단하세요.',
        '4대보험 가입 시 퇴직금·실업급여 등 추가 혜택도 고려하세요.'
      ],
      related: [
        ['/calc/tax/withholding/','💲','3.3% 원천징수 계산기'],
        ['/calc/tax/income-tax/','📈','종합소득세 계산기'],
        ['/calc/tax/freelancer-income/','💰','월 순수입 계산기']
      ]
    },
    'freelancer-income': {
      title: '월 순수입',
      emoji: '💰',
      tips: [
        '3.3% 원천징수, 종합소득세, 국민연금, 건강보험을 모두 반영합니다.',
        '경비율에 따라 실제 순수입이 크게 달라질 수 있습니다.',
        '월 순수입은 세금·보험료를 모두 차감한 실제 가처분 소득입니다.',
        '소득 변동이 클 때는 연 단위로도 함께 확인하면 도움이 됩니다.'
      ],
      related: [
        ['/calc/tax/withholding/','💲','3.3% 원천징수 계산기'],
        ['/calc/tax/income-tax/','📈','종합소득세 계산기'],
        ['/calc/tax/insurance-comparison/','👥','4대보험 비교 계산기']
      ]
    },
    'medical-expense': {
      title: '의료비 세액공제',
      emoji: '🏥',
      tips: [
        '총급여의 3%를 초과한 의료비만 세액공제 대상이 됩니다.',
        '난임시술비는 30%, 미숙아·선천성이상아는 20%, 그 외는 15% 공제율이 적용됩니다.',
        '기타 부양가족 의료비는 700만원 한도 내에서만 공제됩니다.',
        '본인·65세 이상·장애인 의료비는 한도 없이 전액 공제 대상입니다.'
      ],
      related: [
        ['/calc/tax/income-tax/','📈','종합소득세 계산기'],
        ['/calc/tax/withholding/','💲','3.3% 원천징수 계산기'],
        ['/calc/tax/freelancer-income/','💰','월 순수입 계산기']
      ]
    }
  };

  const calcLinks = [
    ['/calc/tax/withholding/','💲','3.3% 원천징수','withholding'],
    ['/calc/tax/income-tax/','📈','종합소득세','income-tax'],
    ['/calc/tax/vat/','📄','부가가치세','vat'],
    ['/calc/tax/insurance-comparison/','👥','4대보험 비교','insurance-comparison'],
    ['/calc/tax/freelancer-income/','💰','월 순수입','freelancer-income'],
    ['/calc/tax/medical-expense/','🏥','의료비 세액공제','medical-expense']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/tax\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('tax-shell-styles')) return;
    const css = `
      .tax-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .tax-shell-layout .page-header{border:1px solid rgba(16,185,129,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .tax-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%);}
      .tax-shell-layout .main-content{min-width:0;}
      .tax-shell-layout .page-wrap,.tax-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .tax-shell-layout .main-wrap,.tax-shell-layout .page-wrap{padding:0 !important;}
      .tax-shell-layout .guide-section{margin-top:24px;}
      .tax-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(16,185,129,.12);color:#10B981;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(16,185,129,.15);color:#10B981;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(16,185,129,.12);color:#10B981;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#10B981;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.tax-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.tax-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'tax-shell-styles';
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
            <a class="msl-link msl-active" href="/calc/tax/"><span class="msl-icon">💰</span><span>프리랜서 세금</span><span class="msl-badge">6</span></a>
            <a class="msl-link" href="/calc/salary/"><span class="msl-icon">📈</span><span>이직 / 연봉</span><span class="msl-badge">7</span></a>
            <a class="msl-link" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pension-welfare/"><span class="msl-icon">🏛</span><span>연금·복지</span><span class="msl-badge">3</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">프리랜서 세금 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'프리랜서 세금 계산기', emoji:'💰', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">프리랜서 세금 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.tax-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout tax-shell-layout';
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

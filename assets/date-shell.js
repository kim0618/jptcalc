(function(){
  const slugMap = {
    'dday': {
      title: 'D-day',
      emoji: '📆',
      tips: [
        'D-day는 특정 날짜까지 남은 일수를 계산합니다.',
        '시작일과 종료일을 포함할지 여부에 따라 1일 차이가 날 수 있습니다.',
        '음력 기념일은 매년 양력 날짜가 달라지므로 주의하세요.',
        '반복 기념일(생일, 기념일 등)은 매년 자동으로 갱신됩니다.'
      ],
      related: [
        ['/calc/date/date-difference/','📏','날짜 차이'],
        ['/calc/date/age/','🎂','만 나이'],
        ['/calc/date/date-add/','➕','날짜 더하기/빼기']
      ]
    },
    'date-difference': {
      title: '날짜 차이',
      emoji: '📏',
      tips: [
        '두 날짜 사이의 일수·주수·개월수를 정확히 계산합니다.',
        '윤년(2월 29일)이 포함된 구간은 자동으로 반영됩니다.',
        '근무일수 계산 시 주말·공휴일 제외 옵션을 활용하세요.',
        '시작일 포함 여부에 따라 결과가 1일 차이날 수 있습니다.'
      ],
      related: [
        ['/calc/date/dday/','📆','D-day'],
        ['/calc/date/date-add/','➕','날짜 더하기/빼기'],
        ['/calc/date/weekday/','📅','요일 계산']
      ]
    },
    'date-add': {
      title: '날짜 더하기/빼기',
      emoji: '➕',
      tips: [
        '특정 날짜에서 일·주·월·년 단위로 더하거나 뺄 수 있습니다.',
        '월 단위 계산 시 말일 처리에 주의하세요(예: 1/31 + 1개월 = 2/28).',
        '영업일 기준으로 계산하면 주말·공휴일이 자동 제외됩니다.',
        '계약 만료일, 신고 기한 등을 정확히 산출할 수 있습니다.'
      ],
      related: [
        ['/calc/date/dday/','📆','D-day'],
        ['/calc/date/date-difference/','📏','날짜 차이'],
        ['/calc/date/weekday/','📅','요일 계산']
      ]
    },
    'age': {
      title: '만 나이',
      emoji: '🎂',
      tips: [
        '2023년 6월부터 한국도 만 나이 통일법이 시행되었습니다.',
        '만 나이는 생일이 지나야 한 살이 더해집니다.',
        '법적 나이(연 나이)와 만 나이는 다를 수 있으니 용도에 맞게 확인하세요.',
        '생년월일만 입력하면 현재 만 나이가 자동 계산됩니다.'
      ],
      related: [
        ['/calc/date/dday/','📆','D-day'],
        ['/calc/date/date-difference/','📏','날짜 차이'],
        ['/calc/date/date-add/','➕','날짜 더하기/빼기']
      ]
    },
    'weekday': {
      title: '요일 계산',
      emoji: '📅',
      tips: [
        '특정 날짜의 요일을 빠르게 확인할 수 있습니다.',
        '과거·미래 어떤 날짜든 요일 계산이 가능합니다.',
        '생일, 기념일, 공휴일 등의 요일을 미리 확인해 보세요.',
        '윤년 2월 29일도 정확하게 요일이 계산됩니다.'
      ],
      related: [
        ['/calc/date/date-add/','➕','날짜 더하기/빼기'],
        ['/calc/date/dday/','📆','D-day'],
        ['/calc/date/date-difference/','📏','날짜 차이']
      ]
    }
  };

  const calcLinks = [
    ['/calc/date/dday/','📆','D-day','dday'],
    ['/calc/date/date-difference/','📏','날짜 차이','date-difference'],
    ['/calc/date/date-add/','➕','날짜 더하기/빼기','date-add'],
    ['/calc/date/age/','🎂','만 나이','age'],
    ['/calc/date/weekday/','📅','요일 계산','weekday']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/date\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('date-shell-styles')) return;
    const css = `
      .date-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .date-shell-layout .page-header{border:1px solid rgba(249,115,22,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .date-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.2) 0%,transparent 70%);}
      .date-shell-layout .main-content{min-width:0;}
      .date-shell-layout .page-wrap,.date-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;display:flex !important;flex-direction:column !important;gap:12px !important;}
      .date-shell-layout .page-wrap>*,.date-shell-layout .app-container>*{margin-top:0 !important;margin-bottom:0 !important;}
      .date-shell-layout .page-wrap>.page-header,.date-shell-layout .app-container>.page-header{margin-bottom:8px !important;}
      .date-shell-layout .main-wrap,.date-shell-layout .page-wrap{padding:0 !important;}
      .date-shell-layout .guide-section{margin-top:0 !important;gap:12px !important;}
      .date-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(249,115,22,.12);color:#F97316;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(249,115,22,.15);color:#F97316;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(249,115,22,.12);color:#F97316;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F97316;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.date-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.date-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'date-shell-styles';
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
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/salary/"><span class="msl-icon">📈</span><span>이직 / 연봉</span><span class="msl-badge">7</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link msl-active" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">6</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">날짜 · D-day 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'날짜 · D-day 계산기', emoji:'📅', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">날짜 · D-day 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.date-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout date-shell-layout';
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

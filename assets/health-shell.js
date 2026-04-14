(function(){
  const slugMap = {
    'bmi': {
      title: 'BMI',
      emoji: '📏',
      tips: [
        'BMI는 체중(kg)을 신장(m)의 제곱으로 나눈 값입니다.',
        '동일 BMI라도 근육량과 체지방 비율에 따라 건강 상태가 다를 수 있습니다.',
        'WHO 기준과 아시아·한국 기준의 비만 판정 구간이 다릅니다.',
        '정기적으로 측정하여 변화 추이를 확인하는 것이 중요합니다.'
      ],
      related: [
        ['/calc/health/body-fat/','💪','체지방률'],
        ['/calc/health/ideal-weight/','⚖️','적정체중'],
        ['/calc/health/bmr/','🔥','기초대사량']
      ]
    },
    'bmr': {
      title: '기초대사량',
      emoji: '🔥',
      tips: [
        '기초대사량은 생명 유지에 필요한 최소 에너지량입니다.',
        '근육량이 많을수록 기초대사량이 높아집니다.',
        '나이가 들수록 기초대사량이 감소하는 경향이 있습니다.',
        '다이어트 시 기초대사량 이하로 섭취하면 요요 현상이 올 수 있습니다.'
      ],
      related: [
        ['/calc/health/calories/','🏃','칼로리 소모'],
        ['/calc/health/bmi/','📏','BMI'],
        ['/calc/health/body-fat/','💪','체지방률']
      ]
    },
    'body-fat': {
      title: '체지방률',
      emoji: '💪',
      tips: [
        '체지방률은 체중 대비 체지방의 비율을 나타냅니다.',
        '남성과 여성의 적정 체지방률 기준이 다릅니다.',
        '체지방률이 너무 낮아도 건강에 해로울 수 있습니다.',
        '체성분 분석기를 이용하면 더 정확한 측정이 가능합니다.'
      ],
      related: [
        ['/calc/health/bmi/','📏','BMI'],
        ['/calc/health/ideal-weight/','⚖️','적정체중'],
        ['/calc/health/bmr/','🔥','기초대사량']
      ]
    },
    'calories': {
      title: '칼로리 소모',
      emoji: '🏃',
      tips: [
        '운동 종류와 강도에 따라 소모 칼로리가 크게 달라집니다.',
        '체중이 많이 나갈수록 동일 운동에서 더 많은 칼로리를 소모합니다.',
        '유산소 운동과 근력 운동을 병행하면 효과적입니다.',
        '일상 활동(걷기, 계단 오르기 등)도 칼로리 소모에 기여합니다.'
      ],
      related: [
        ['/calc/health/bmr/','🔥','기초대사량'],
        ['/calc/health/bmi/','📏','BMI'],
        ['/calc/health/body-fat/','💪','체지방률']
      ]
    },
    'ideal-weight': {
      title: '적정체중',
      emoji: '⚖️',
      tips: [
        '적정체중은 키, 성별, 나이 등을 고려하여 산출됩니다.',
        '표준체중 공식은 여러 가지가 있으며 참고용으로 활용하세요.',
        '근육량이 많은 경우 적정체중보다 무거울 수 있습니다.',
        'BMI와 함께 참고하면 더 정확한 건강 판단이 가능합니다.'
      ],
      related: [
        ['/calc/health/bmi/','📏','BMI'],
        ['/calc/health/body-fat/','💪','체지방률'],
        ['/calc/health/bmr/','🔥','기초대사량']
      ]
    }
  };

  const calcLinks = [
    ['/calc/health/bmi/','📏','BMI','bmi'],
    ['/calc/health/bmr/','🔥','기초대사량','bmr'],
    ['/calc/health/body-fat/','💪','체지방률','body-fat'],
    ['/calc/health/calories/','🏃','칼로리 소모','calories'],
    ['/calc/health/ideal-weight/','⚖️','적정체중','ideal-weight']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/health\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('health-shell-styles')) return;
    const css = `
      .health-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .health-shell-layout .page-header{border:1px solid rgba(16,185,129,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .health-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%);}
      .health-shell-layout .main-content{min-width:0;}
      .health-shell-layout .page-wrap,.health-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .health-shell-layout .main-wrap,.health-shell-layout .page-wrap{padding:0 !important;}
      .health-shell-layout .guide-section{margin-top:24px;}
      .health-shell-layout .siblings-section{display:none !important;}
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
      @media (max-width:1199px){.health-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.health-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'health-shell-styles';
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
            <a class="msl-link" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link msl-active" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">건강 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'건강 계산기', emoji:'🏃', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">건강 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.health-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout health-shell-layout';
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

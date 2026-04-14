(function(){
  const slugMap = {
    'take-home-pay': {
      title: '연봉 실수령액',
      emoji: '💵',
      tips: [
        '4대보험 요율은 매년 변경되므로 최신 요율을 확인하세요.',
        '소득세는 간이세액표 기준으로 원천징수되며, 부양가족 수에 따라 달라집니다.',
        '부양가족 공제를 반영하면 월 실수령액이 달라질 수 있습니다.',
        '비과세 항목(식대, 차량유지비 등)을 정확히 입력해야 실수령액이 맞습니다.'
      ],
      related: [
        ['/calc/salary/comparison/','⚖️','연봉 비교'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교'],
        ['/calc/salary/hourly-wage/','⏱️','시급·일급 변환']
      ]
    },
    'comparison': {
      title: '연봉 비교',
      emoji: '⚖️',
      tips: [
        '연봉이 높아도 실수령액 차이는 세금 구간에 따라 달라집니다.',
        '과세표준 구간이 바뀌면 세율이 급격히 올라갈 수 있습니다.',
        '복리후생(식대, 교통비, 성과급 등)도 함께 비교해야 정확합니다.',
        '총 보상(연봉+상여+복리후생)을 기준으로 비교하세요.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교'],
        ['/calc/salary/raise-rate/','📈','연봉 인상률']
      ]
    },
    'hourly-wage': {
      title: '시급·일급 변환',
      emoji: '⏱️',
      tips: [
        '월 소정근로시간은 주 40시간 기준 209시간이 표준입니다.',
        '연장·야간·휴일 근로는 통상시급의 1.5배로 계산됩니다.',
        '2026년 최저시급 기준을 확인하고 비교해 보세요.',
        '파트타임·아르바이트는 주휴수당 포함 여부를 확인하세요.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/raise-rate/','📈','연봉 인상률'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교']
      ]
    },
    'job-change': {
      title: '이직 연봉 비교',
      emoji: '📊',
      tips: [
        '이직 시 최소 10~15% 이상 인상이 일반적인 기준입니다.',
        '연봉 외 숨은 비용(통근비, 복지, 퇴직금 차이)도 고려하세요.',
        '퇴직금 정산 시점에 따라 실질 수령액이 달라질 수 있습니다.',
        '연봉 협상 시 기본급과 성과급 비율을 확인하세요.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/comparison/','⚖️','연봉 비교'],
        ['/calc/salary/raise-rate/','📈','연봉 인상률']
      ]
    },
    'raise-rate': {
      title: '연봉 인상률',
      emoji: '📈',
      tips: [
        '물가상승률을 반영해야 실질 인상률을 알 수 있습니다.',
        '복리 효과로 매년 소폭 인상도 장기적으로 큰 차이를 만듭니다.',
        '인상 후 과세표준 구간이 바뀌면 실수령 인상률이 낮아질 수 있습니다.',
        '업종·직군별 평균 인상률과 비교해 보세요.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/comparison/','⚖️','연봉 비교'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교']
      ]
    },
    'severance': {
      title: '퇴직금',
      emoji: '📦',
      tips: [
        '퇴직금은 최근 3개월 평균임금 × 근속연수로 계산됩니다.',
        '1년 미만 근무 시 퇴직금 지급 의무가 없을 수 있습니다.',
        '퇴직소득세는 근속연수에 따라 공제가 적용되어 일반소득보다 세율이 낮습니다.',
        '퇴직연금(DB/DC) 유형에 따라 수령 방식과 금액이 다릅니다.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/unemployment/','🛟','실업급여'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교']
      ]
    },
    'unemployment': {
      title: '실업급여',
      emoji: '🛟',
      tips: [
        '자발적 퇴사는 원칙적으로 실업급여 수급 대상이 아닙니다.',
        '실업급여는 퇴직 전 3개월 평균임금의 60%를 기준으로 산정됩니다.',
        '수급 기간은 연령과 고용보험 가입 기간에 따라 120~270일입니다.',
        '구직활동 보고를 성실히 이행해야 급여가 지속 지급됩니다.'
      ],
      related: [
        ['/calc/salary/take-home-pay/','💵','연봉 실수령액'],
        ['/calc/salary/severance/','📦','퇴직금'],
        ['/calc/salary/job-change/','📊','이직 연봉 비교']
      ]
    }
  };

  const calcLinks = [
    ['/calc/salary/take-home-pay/','💵','연봉 실수령액','take-home-pay'],
    ['/calc/salary/comparison/','⚖️','연봉 비교','comparison'],
    ['/calc/salary/hourly-wage/','⏱️','시급·일급 변환','hourly-wage'],
    ['/calc/salary/job-change/','📊','이직 연봉 비교','job-change'],
    ['/calc/salary/raise-rate/','📈','연봉 인상률','raise-rate'],
    ['/calc/salary/severance/','📦','퇴직금','severance'],
    ['/calc/salary/unemployment/','🛟','실업급여','unemployment']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/salary\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('salary-shell-styles')) return;
    const css = `
      .salary-shell-layout{max-width:1400px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .salary-shell-layout .page-header{border:1px solid rgba(59,130,246,0.2) !important;padding:32px 32px 28px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .salary-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%);}
      .salary-shell-layout .main-content{min-width:0;}
      .salary-shell-layout .page-wrap,.salary-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .salary-shell-layout .main-wrap,.salary-shell-layout .page-wrap{padding:0 !important;}
      .salary-shell-layout .guide-section{margin-top:24px;}
      .salary-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(59,130,246,.12);color:#3B82F6;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(59,130,246,.15);color:#3B82F6;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(59,130,246,.12);color:#3B82F6;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#3B82F6;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      @media (max-width:1199px){.salary-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.salary-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}}
    `;
    const style = document.createElement('style');
    style.id = 'salary-shell-styles';
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
            <a class="msl-link msl-active" href="/calc/salary/"><span class="msl-icon">📈</span><span>이직 / 연봉</span><span class="msl-badge">7</span></a>
            <a class="msl-link" href="/calc/finance/"><span class="msl-icon">🏦</span><span>금융 · 이자</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/health/"><span class="msl-icon">🏃</span><span>건강</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/date/"><span class="msl-icon">📅</span><span>날짜 · D-day</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/ai/"><span class="msl-icon">🤖</span><span>AI / 테크</span><span class="msl-badge">5</span></a>
            <a class="msl-link" href="/calc/pet/"><span class="msl-icon">🐾</span><span>반려동물</span><span class="msl-badge">5</span></a>
          </div>
        </div>
        <div class="msl-divider"></div>
        <div class="msl-section">
          <div class="msl-title">이직 / 연봉 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'이직 / 연봉 계산기', emoji:'📈', related:[]};
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">이직 / 연봉 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.salary-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout salary-shell-layout';
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

(function(){
  const slugMap = {
    'brokerage': {
      title: '중개수수료',
      emoji: '🏠',
      tips: [
        '중개수수료는 법정 상한 이내에서 협의가 가능합니다.',
        '오피스텔은 주거용 여부와 전용면적 기준을 함께 확인하세요.',
        '월세·반전세는 보증금 환산 기준금액으로 상한이 달라질 수 있습니다.',
        '부가세 포함 여부는 실제 계약 전에 중개사에게 다시 확인하세요.'
      ],
      related: [
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/conversion/','🔄','전월세전환 계산기'],
        ['/calc/realestate/registry/','📋','등기비용 계산기']
      ],
      guides: [
        ['/blog/posts/realestate-agent-fee.html','부동산 중개수수료, 나는 얼마 내야 할까?'],
        ['/blog/posts/jeonse-vs-wolse.html','전세 vs 월세, 어떤 게 더 유리할까?']
      ]
    },
    'acquisition': {
      title: '취득세',
      emoji: '📄',
      tips: [
        '주택 수 판단은 취득 후 기준으로 달라질 수 있어 미리 확인하는 편이 안전합니다.',
        '조정대상지역 여부와 취득 방식(매수·증여·상속)에 따라 세율이 크게 달라집니다.',
        '감면 대상 여부는 관할 시·군·구청 또는 세무서 안내를 함께 확인하세요.',
        '실제 신고 전에는 농어촌특별세·지방교육세 포함 여부를 다시 점검하세요.'
      ],
      related: [
        ['/calc/realestate/brokerage/','🏠','중개수수료 계산기'],
        ['/calc/realestate/capital-gains/','📈','양도소득세 계산기'],
        ['/calc/realestate/propertytax/','🏛️','재산세 계산기']
      ],
      guides: [
        ['/blog/posts/acquisition-tax-2026.html','2026년 취득세 완벽 정리'],
        ['/blog/posts/realestate-agent-fee.html','부동산 중개수수료, 나는 얼마 내야 할까?']
      ]
    },
    'conversion': {
      title: '전월세전환',
      emoji: '🔄',
      tips: [
        '법정 상한은 일반적으로 기준금리 + 2% 범위를 참고합니다.',
        '전세를 월세로 돌릴 때는 보증금 감소분과 월 부담을 함께 비교하세요.',
        '월세를 전세로 환산할 때는 계약기간과 총 부담액을 같이 보는 것이 좋습니다.',
        '실제 협의 금액은 주변 시세와 계약 조건에 따라 달라질 수 있습니다.'
      ],
      related: [
        ['/calc/realestate/brokerage/','🏠','중개수수료 계산기'],
        ['/calc/realestate/rental/','📊','임대수익률 계산기'],
        ['/calc/realestate/dsr/','🔢','대출한도(DSR) 계산기']
      ],
      guides: [
        ['/blog/posts/jeonse-vs-wolse.html','전세 vs 월세, 어떤 게 더 유리할까?'],
        ['/blog/posts/realestate-agent-fee.html','부동산 중개수수료, 나는 얼마 내야 할까?']
      ]
    },
    'loan': {
      title: '대출이자',
      emoji: '💰',
      tips: [
        '원리금균등은 월 납입액이 일정해 예산 관리가 쉽습니다.',
        '원금균등은 초반 부담이 크지만 총 이자 부담은 더 적은 편입니다.',
        '만기일시는 매달 이자만 내고 만기에 원금을 상환하는 구조입니다.',
        '실행 전에는 중도상환수수료와 우대금리 조건도 함께 확인하세요.'
      ],
      related: [
        ['/calc/realestate/rental/','📊','임대수익률 계산기'],
        ['/calc/realestate/dsr/','🔢','대출한도(DSR) 계산기'],
        ['/calc/realestate/joint/','👥','공동명의비교 계산기']
      ],
      guides: [
        ['/blog/posts/mortgage-dsr-guide.html','주택담보대출 한도 계산법 - DSR·LTV 총정리'],
        ['/blog/posts/loan-refinance-guide.html','대환대출 완벽 가이드 - 대출 갈아타기']
      ]
    },
    'rental': {
      title: '임대수익률',
      emoji: '📊',
      tips: [
        '보증금과 월세를 함께 반영해야 실제 수익률을 더 가깝게 볼 수 있습니다.',
        '대출 이자와 관리·수선비를 빼면 순수익률이 크게 달라질 수 있습니다.',
        '단순 총수익률만 보지 말고 실투자금 대비 수익률도 함께 확인하세요.',
        '공실 가능성과 취득·보유세도 장기 수익성 판단에 영향을 줍니다.'
      ],
      related: [
        ['/calc/realestate/loan/','💰','대출이자 계산기'],
        ['/calc/realestate/conversion/','🔄','전월세전환 계산기'],
        ['/calc/realestate/propertytax/','🏛️','재산세 계산기']
      ],
      guides: [
        ['/blog/posts/jeonse-vs-wolse.html','전세 vs 월세, 어떤 게 더 유리할까?'],
        ['/blog/posts/realestate-agent-fee.html','부동산 중개수수료, 나는 얼마 내야 할까?']
      ]
    },
    'jongbu': {
      title: '종합부동산세',
      emoji: '🏦',
      tips: [
        '매년 6월 1일 기준 보유자에게 12월에 부과됩니다.',
        '1세대 1주택자는 공시가격 12억원 초과분부터 과세됩니다.',
        '고령자·장기보유 공제를 적용하면 최대 80%까지 감면됩니다.',
        '공동명의 시 각각 기본공제를 받아 절세 효과가 있습니다.'
      ],
      related: [
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/propertytax/','🏛️','재산세 계산기'],
        ['/calc/realestate/joint/','👥','공동명의비교 계산기']
      ],
      guides: [
        ['/blog/posts/jongbu-tax-guide.html','종합부동산세, 결국 얼마인가 - 2026년 총정리'],
        ['/blog/posts/property-tax-guide.html','2026년 재산세 완벽 정리']
      ]
    },
    'capital-gains': {
      title: '양도소득세',
      emoji: '📈',
      tips: [
        '1세대 1주택 비과세 요건은 보유기간과 거주기간을 함께 확인해야 합니다.',
        '필요경비와 취득가액 입력이 정확해야 예상 세액 차이가 줄어듭니다.',
        '조정대상지역 여부와 주택 수에 따라 과세 결과가 달라질 수 있습니다.',
        '최종 신고 전에는 장기보유특별공제 적용 여부를 다시 점검하세요.'
      ],
      related: [
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/brokerage/','🏠','중개수수료 계산기'],
        ['/calc/realestate/inheritance/','📜','상속세 계산기']
      ],
      guides: [
        ['/blog/posts/capital-gains-tax.html','양도소득세 절세 방법 총정리 - 2026년 기준'],
        ['/blog/posts/acquisition-tax-2026.html','2026년 취득세 완벽 정리']
      ]
    },
    'gift': {
      title: '증여세',
      emoji: '🎁',
      tips: [
        '증여세는 증여받은 사람(수증자)이 납부합니다.',
        '10년 내 동일인으로부터 받은 증여액은 합산하여 과세됩니다.',
        '증여일 속하는 달의 말일로부터 3개월 이내 신고 시 3% 세액공제를 받습니다.',
        '배우자 공제 6억원은 혼인 중 증여에만 적용되며 이혼 시 소급 과세될 수 있습니다.'
      ],
      related: [
        ['/calc/realestate/jongbu/','🏦','종합부동산세 계산기'],
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/inheritance/','📜','상속세 계산기']
      ],
      guides: [
        ['/blog/posts/gift-tax-guide.html','증여세 계산 완전 가이드 - 공제·세율·절세 전략'],
        ['/blog/posts/inheritance-tax-guide.html','상속세 계산 가이드 2026 - 세율·공제·절세']
      ]
    },
    'pyeong': {
      title: '평수 변환',
      emoji: '📐',
      tips: [
        '1평 = 3.3058㎡, 1㎡ = 0.3025평으로 환산합니다.',
        '분양 면적(공급면적)과 전용면적은 다를 수 있으니 구분해 확인하세요.',
        '국민주택 기준은 85㎡(약 25.7평)이며, 세제 혜택 기준이 됩니다.',
        '아파트 광고 면적은 보통 공급면적 기준이므로 실제 사용면적과 차이가 있습니다.'
      ],
      related: [
        ['/calc/realestate/brokerage/','🏠','중개수수료 계산기'],
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/propertytax/','🏛️','재산세 계산기']
      ],
      guides: []
    },
    'propertytax': {
      title: '재산세',
      emoji: '🏛️',
      tips: [
        '재산세는 매년 6월 1일 기준 보유자에게 7월(1/2)과 9월(1/2)로 나눠 부과됩니다.',
        '공시가격 × 공정시장가액비율(60%)이 과세표준이 됩니다.',
        '지방교육세(재산세의 20%)와 도시지역분도 함께 납부합니다.',
        '재산세와 종합부동산세는 별도로 부과되며, 재산세 납부분은 종부세에서 공제됩니다.'
      ],
      related: [
        ['/calc/realestate/jongbu/','🏦','종합부동산세 계산기'],
        ['/calc/realestate/property-tax-comprehensive/','💼','보유세 종합 계산기'],
        ['/calc/realestate/acquisition/','📄','취득세 계산기']
      ],
      guides: [
        ['/blog/posts/property-tax-guide.html','2026년 재산세 완벽 정리 - 납부 시기·세율·계산법'],
        ['/blog/posts/jongbu-tax-guide.html','종합부동산세, 결국 얼마인가 - 2026년 총정리']
      ]
    },
    'inheritance': {
      title: '상속세',
      emoji: '📜',
      tips: [
        '상속세는 상속 개시일(사망일)로부터 6개월 이내에 신고해야 합니다.',
        '일괄공제(5억)와 기초공제+인적공제 중 유리한 쪽이 자동 적용됩니다.',
        '배우자 공제는 실제 상속금액 기준 최소 5억, 최대 30억까지 가능합니다.',
        '사전 증여 재산은 10년 이내 분이 상속재산에 합산될 수 있습니다.'
      ],
      related: [
        ['/calc/realestate/gift/','🎁','증여세 계산기'],
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/capital-gains/','📈','양도소득세 계산기']
      ],
      guides: [
        ['/blog/posts/inheritance-tax-guide.html','상속세 계산 가이드 2026 - 세율·공제·절세'],
        ['/blog/posts/gift-tax-guide.html','증여세 계산 완전 가이드 - 공제·세율·절세 전략']
      ]
    },
    'dsr': {
      title: '대출한도 (DSR)',
      emoji: '🔢',
      tips: [
        'DSR = (연간 원리금 합계 ÷ 연 소득) × 100으로 계산합니다.',
        '은행권은 DSR 40% 이하, 비은행권은 50% 이하가 적용 기준입니다.',
        '총 대출액 1억원 초과 시 DSR 규제가 적용됩니다.',
        '기존 소액 대출을 상환하면 DSR이 낮아져 대출 한도가 늘어납니다.'
      ],
      related: [
        ['/calc/realestate/loan/','💰','대출이자 계산기'],
        ['/calc/realestate/rental/','📊','임대수익률 계산기'],
        ['/calc/realestate/joint/','👥','공동명의 비교 계산기']
      ],
      guides: [
        ['/blog/posts/mortgage-dsr-guide.html','주택담보대출 한도 계산법 - DSR·LTV 총정리'],
        ['/blog/posts/loan-refinance-guide.html','대환대출 완벽 가이드 - 대출 갈아타기']
      ]
    },
    'registry': {
      title: '등기비용',
      emoji: '📋',
      tips: [
        '등록면허세는 거래금액에 유형별 세율(매매 0.2% 등)을 적용합니다.',
        '지방교육세는 등록면허세의 20%가 자동 부과됩니다.',
        '등기신청수수료는 15,000원으로 고정입니다.',
        '법무사 수수료와 인지세, 국민주택채권은 별도로 발생합니다.'
      ],
      related: [
        ['/calc/realestate/acquisition/','📄','취득세 계산기'],
        ['/calc/realestate/brokerage/','🏠','중개수수료 계산기'],
        ['/calc/realestate/capital-gains/','📈','양도소득세 계산기']
      ],
      guides: []
    },
    'joint': {
      title: '공동명의 비교',
      emoji: '👥',
      tips: [
        '공동명의 시 종부세 기본공제를 각자 9억씩 받아 과세표준이 낮아집니다.',
        '공시가격 9억~20억대 구간에서 공동명의 절세 효과가 가장 큽니다.',
        '양도 시 각자 양도소득세를 신고하므로 소득 분산 효과도 있습니다.',
        '1세대1주택 비과세 요건은 공동명의 비율과 조건에 따라 달라질 수 있습니다.'
      ],
      related: [
        ['/calc/realestate/jongbu/','🏦','종합부동산세 계산기'],
        ['/calc/realestate/property-tax-comprehensive/','💼','보유세 종합 계산기'],
        ['/calc/realestate/capital-gains/','📈','양도소득세 계산기']
      ],
      guides: [
        ['/blog/posts/jongbu-tax-guide.html','종합부동산세, 결국 얼마인가 - 2026년 총정리'],
        ['/blog/posts/property-tax-guide.html','2026년 재산세 완벽 정리']
      ]
    },
    'property-tax-comprehensive': {
      title: '보유세 종합',
      emoji: '💼',
      tips: [
        '보유세는 재산세와 종합부동산세의 합산 세부담입니다.',
        '재산세는 7월·9월에, 종합부동산세는 12월에 부과됩니다.',
        '종부세 납부 시 재산세 납부분을 공제받을 수 있습니다.',
        '공정시장가액비율 60%가 과세표준 계산에 공통 적용됩니다.'
      ],
      related: [
        ['/calc/realestate/propertytax/','🏛️','재산세 계산기'],
        ['/calc/realestate/jongbu/','🏦','종합부동산세 계산기'],
        ['/calc/realestate/joint/','👥','공동명의 비교 계산기']
      ],
      guides: [
        ['/blog/posts/property-tax-guide.html','2026년 재산세 완벽 정리'],
        ['/blog/posts/jongbu-tax-guide.html','종합부동산세, 결국 얼마인가 - 2026년 총정리']
      ]
    }
  };

  const calcLinks = [
    ['/calc/realestate/brokerage/','🏠','중개수수료','brokerage'],
    ['/calc/realestate/acquisition/','📄','취득세','acquisition'],
    ['/calc/realestate/conversion/','🔄','전월세 전환율','conversion'],
    ['/calc/realestate/loan/','💰','대출이자','loan'],
    ['/calc/realestate/rental/','📊','임대수익률','rental'],
    ['/calc/realestate/capital-gains/','📈','양도소득세','capital-gains'],
    ['/calc/realestate/jongbu/','🏦','종합부동산세','jongbu'],
    ['/calc/realestate/gift/','🎁','증여세','gift'],
    ['/calc/realestate/pyeong/','📐','평수 변환','pyeong'],
    ['/calc/realestate/propertytax/','🏛️','재산세','propertytax'],
    ['/calc/realestate/inheritance/','📜','상속세','inheritance'],
    ['/calc/realestate/dsr/','🔢','대출한도 (DSR)','dsr'],
    ['/calc/realestate/registry/','📋','등기비용','registry'],
    ['/calc/realestate/joint/','👥','공동명의비교','joint']
  ];

  function getSlug() {
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    const m = path.match(/\/calc\/realestate\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  function ensureStyles() {
    if (document.getElementById('realestate-shell-styles')) return;
    const css = `
      .realestate-shell-layout{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
      .realestate-shell-layout .page-header{border:1px solid rgba(245,158,11,0.2) !important;padding:24px 28px 14px !important;margin-bottom:12px !important;border-radius:14px !important;position:relative !important;overflow:hidden !important;line-height:normal !important;}
      .realestate-shell-layout .page-header::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(245,158,11,0.2) 0%,transparent 70%);}
      .realestate-shell-layout .main-content{min-width:0;}
      .realestate-shell-layout .page-wrap,.realestate-shell-layout .app-container{max-width:none !important;width:100% !important;margin:0 !important;min-width:0;background:transparent !important;box-shadow:none !important;min-height:0 !important;}
      .realestate-shell-layout .main-wrap,.realestate-shell-layout .page-wrap{padding:0 !important;}
      .realestate-shell-layout .article-info{margin-bottom:12px !important;}
      .realestate-shell-layout .review-footer{margin-top:12px !important;}
      .realestate-shell-layout .guide-section .review-footer{margin-top:0 !important;}
      .realestate-shell-layout .guide-section>.update-note{margin-top:0 !important;}
      .realestate-shell-layout .guide-section{margin-top:12px;}
      .realestate-shell-layout .siblings-section{display:none !important;}
      .mega-sidebar-left{position:sticky;top:88px;line-height:normal;}
      .msl-section{margin-bottom:20px;}
      .msl-title{font-size:10px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:8px;padding:0 8px;}
      .msl-nav,.msl-calc-list,.msr-widget-list{display:flex;flex-direction:column;gap:2px;}
      .msl-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#667085;transition:all .15s;}
      .msl-link:hover{background:rgba(0,0,0,.04);color:#111827;}
      .msl-link.msl-active{background:rgba(245,158,11,.12);color:#F59E0B;}
      .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
      .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
      .msl-link.msl-active .msl-badge{background:rgba(245,158,11,.15);color:#F59E0B;}
      .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
      .msl-calc-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;color:#667085;transition:all .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left;font-family:inherit;}
      .msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#374151;}
      .msl-calc-btn.msl-calc-active{background:rgba(245,158,11,.12);color:#F59E0B;}
      .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F59E0B;flex-shrink:0;}
      .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:12px;}
      .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:14px 16px;box-shadow:0 10px 24px rgba(15,23,42,.04);}
      .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px;}
      .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
      .msr-widget-link:hover{background:rgba(0,0,0,.04);}
      .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
      .msr-widget-text{font-size:12px;font-weight:600;color:#667085;line-height:1.55;}
      .msr-widget-link:hover .msr-widget-text{color:#111827;}
      .msr-note{font-size:11px;color:#98A2B3;line-height:1.6;padding:0 10px;}
      .mobile-guides{display:none;margin-top:16px;}
      .mobile-guides__title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;}
      .mobile-guides__list{display:flex;flex-direction:column;gap:6px;}
      .mobile-guides__link{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;text-decoration:none;transition:border-color .15s;}
      .mobile-guides__link:hover{border-color:#F59E0B;}
      .mobile-guides__icon{font-size:15px;flex-shrink:0;}
      .mobile-guides__text{font-size:13px;font-weight:600;color:#374151;flex:1;line-height:1.4;}
      @media (max-width:1199px){.realestate-shell-layout{grid-template-columns:200px minmax(0,1fr)}.mega-sidebar-right{display:none;}}
      @media (max-width:767px){.realestate-shell-layout{grid-template-columns:1fr;padding:16px;gap:16px}.mega-sidebar-left,.mega-sidebar-right{display:none;}.mobile-guides{display:block;}}
    `;
    const style = document.createElement('style');
    style.id = 'realestate-shell-styles';
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
            <a class="msl-link msl-active" href="/calc/realestate/"><span class="msl-icon">🏠</span><span>부동산</span><span class="msl-badge">15</span></a>
            <a class="msl-link" href="/calc/tax/"><span class="msl-icon">💰</span><span>프리랜서 세금</span><span class="msl-badge">6</span></a>
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
          <div class="msl-title">부동산 계산기</div>
          <div class="msl-calc-list">${subLinks}</div>
        </div>
      </aside>
    `;
  }

  function rightSidebarHtml(slug) {
    const conf = slugMap[slug] || {title:'부동산 계산기', emoji:'🏠', tips:[], related:[], guides:[]};
    const tips = conf.tips.map(t => `<div class="msr-widget-link"><span class="msr-widget-icon">${conf.emoji}</span><span class="msr-widget-text">${t}</span></div>`).join('');
    const related = conf.related.map(([href, icon, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">${icon}</span><span class="msr-widget-text">${label}</span></a>`).join('');
    const guidesHtml = (conf.guides && conf.guides.length)
      ? `<div class="msr-widget">
          <div class="msr-widget-title">관련 가이드</div>
          <div class="msr-widget-list">${conf.guides.map(([href, label]) => `<a class="msr-widget-link" href="${href}"><span class="msr-widget-icon">📖</span><span class="msr-widget-text">${label}</span></a>`).join('')}</div>
        </div>`
      : '';
    return `
      <aside class="mega-sidebar-right">
        <div class="msr-widget">
          <div class="msr-widget-title">관련 계산기</div>
          <div class="msr-widget-list">${related}</div>
          <div class="msr-note">부동산 카테고리 안에서 바로 이어서 비교할 수 있게 구성했습니다.</div>
        </div>
        ${guidesHtml}
      </aside>
    `;
  }

  function mountShell() {
    const slug = getSlug();
    if (!slug || !slugMap[slug] || document.querySelector('.realestate-shell-layout')) return;
    ensureStyles();

    const body = document.body;
    const content = body.querySelector('.app-container, main.page-wrap');
    if (!content) return;

    const footer = body.querySelector('footer');
    const guide = body.querySelector('.guide-section');
    const shell = document.createElement('div');
    shell.className = 'mega-layout realestate-shell-layout';
    shell.innerHTML = leftSidebarHtml(slug) + '<main class="main-content"></main>' + rightSidebarHtml(slug);

    const main = shell.querySelector('.main-content');
    main.appendChild(content);
    if (guide && guide !== content && !main.contains(guide)) main.appendChild(guide);

    const conf = slugMap[slug];
    if (conf.guides && conf.guides.length) {
      const mobileGuides = document.createElement('div');
      mobileGuides.className = 'mobile-guides';
      mobileGuides.innerHTML =
        '<div class="mobile-guides__title">관련 가이드</div>' +
        '<div class="mobile-guides__list">' +
        conf.guides.map(([href, label]) =>
          `<a class="mobile-guides__link" href="${href}"><span class="mobile-guides__icon">📖</span><span class="mobile-guides__text">${label}</span></a>`
        ).join('') +
        '</div>';
      content.appendChild(mobileGuides);
    }

    if (footer) body.insertBefore(shell, footer);
    else body.appendChild(shell);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShell);
  } else {
    mountShell();
  }
})();

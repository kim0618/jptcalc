
(function(){
  const path=(location.pathname||'').replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  const pages={
    '/calc/realestate/brokerage/': {
      key:'brokerage',
      quick:['중개수수료는 법정 상한 이내 협의 가능합니다.','매매·전세·월세·반전세마다 상한 요율이 다릅니다.','거래금액이 클수록 수수료율이 아닌 상한 요율 적용 여부를 먼저 보세요.','실제 중개보수는 부가세·현장 조건에 따라 달라질 수 있습니다.'],
      related:[['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/conversion/','전월세전환 계산기','🔄'],['/calc/realestate/registry/','등기비용 계산기','📋']]
    },
    '/calc/realestate/acquisition/': {
      key:'acquisition',
      quick:['주택 수 판단은 취득 후 기준으로 달라질 수 있어 미리 확인하는 편이 안전합니다.','조정대상지역 여부와 취득 방식(매수·증여·상속)에 따라 세율이 크게 달라집니다.','감면 대상 여부는 관할 시·군·구청 또는 세무서 안내를 함께 확인하세요.','실제 신고 전에는 농어촌특별세·지방교육세 포함 여부를 다시 점검하세요.'],
      related:[['/calc/realestate/brokerage/','중개수수료 계산기','🏠'],['/calc/realestate/capital-gains/','양도소득세 계산기','📈'],['/calc/realestate/#tab-propertytax','재산세 계산기','🏛️']]
    },
    '/calc/realestate/conversion/': {
      key:'conversion',
      quick:['전월세전환율은 법정 상한과 실제 계약 관행을 함께 봐야 합니다.','보증금 증감분 기준인지 월세 전체 기준인지 먼저 정리하면 계산이 쉬워집니다.','기준금리 변동에 따라 비교 결과가 달라질 수 있습니다.','계약 갱신 시점과 신규 계약 시점의 조건을 따로 비교해보세요.'],
      related:[['/calc/realestate/brokerage/','중개수수료 계산기','🏠'],['/calc/realestate/loan/','대출이자 계산기','💰'],['/calc/realestate/rental/','임대수익률 계산기','📊']]
    },
    '/calc/realestate/loan/': {
      key:'loan',
      quick:['원리금균등·원금균등·만기일시상환 방식은 월 납입액이 크게 다릅니다.','금리 차이보다 상환기간 차이가 총이자에 더 크게 작용할 수 있습니다.','중도상환수수료와 고정·변동금리 조건도 함께 비교해보세요.','대출 실행 전에는 DSR과 실제 승인 한도를 별도로 확인하는 편이 안전합니다.'],
      related:[['/calc/realestate/#tab-dsr','대출한도(DSR) 계산기','🔢'],['/calc/realestate/conversion/','전월세전환 계산기','🔄'],['/calc/realestate/rental/','임대수익률 계산기','📊']]
    },
    '/calc/realestate/rental/': {
      key:'rental',
      quick:['임대수익률은 매입가 외에 취득세·중개수수료·수선비를 포함해야 더 정확합니다.','보증금 운용 수익을 반영할지 여부에 따라 체감 수익률이 달라집니다.','공실 기간을 고려하지 않으면 수익률이 과대평가될 수 있습니다.','세전 수익률과 세후 수익률을 구분해서 판단하세요.'],
      related:[['/calc/realestate/loan/','대출이자 계산기','💰'],['/calc/realestate/conversion/','전월세전환 계산기','🔄'],['/calc/realestate/acquisition/','취득세 계산기','📄']],
      guides:[['/blog/posts/rental-yield-guide.html','임대수익률 계산법 완전 정리 - 표면수익률 5%의 진실'],['/blog/posts/jeonse-conversion-rate.html','전월세 전환율 계산법 - 전세를 월세로 바꿀 때 적정 금액 구하기'],['/blog/posts/apartment-officetel-rental-comparison.html','아파트·오피스텔·빌라 임대수익률 비교 - 공실·수선비 포함한 실질 수익 계산']]
    },
    '/calc/realestate/capital-gains/': {
      key:'capital-gains',
      quick:['보유 기간과 거주 요건에 따라 양도세 결과가 크게 달라질 수 있습니다.','필요경비를 얼마나 반영하느냐에 따라 과세표준 차이가 큽니다.','1세대 1주택 비과세 여부는 예외 조건까지 함께 확인하세요.','예상 세액은 참고용이고, 실제 신고 전 세무 전문가 확인이 안전합니다.'],
      related:[['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/brokerage/','중개수수료 계산기','🏠'],['/calc/realestate/propertytax/','재산세 계산기','🏛️']]
    },
    '/calc/realestate/dsr/': {
      key:'dsr',
      quick:['DSR 40% 규제는 은행권 기준이며, 비은행권은 50% 이하입니다.','전세자금보증대출(HUG·HF·SGI)은 DSR 산정에서 제외됩니다.','마이너스통장은 실제 사용액이 아닌 한도 전체가 원리금 기준입니다.','소득 산정 방식은 금융기관마다 다를 수 있어 사전 확인이 필요합니다.'],
      related:[['/calc/realestate/loan/','대출이자 계산기','💰'],['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/rental/','임대수익률 계산기','📊']]
    },
    '/calc/realestate/dti/': {
      key:'dti',
      quick:['DTI는 주담대 원리금 전체 + 기타대출 이자만 합산합니다(기타 원금 제외).','규제지역 40%·조정대상지역 50%·비규제지역 60% 기준이 적용됩니다.','DSR은 기타대출 원금까지 더하므로 일반적으로 DTI보다 보수적입니다.','실제 한도는 DTI·DSR·LTV 중 가장 낮은 기준으로 결정됩니다.'],
      related:[['/calc/realestate/dsr/','대출한도(DSR) 계산기','🔢'],['/calc/realestate/loan/','대출이자 계산기','💰'],['/calc/realestate/acquisition/','취득세 계산기','📄']]
    },
    '/calc/realestate/ltv/': {
      key:'ltv',
      quick:['주택 가격은 매매가가 아닌 KB시세·감정가·실거래가 중 낮은 값을 씁니다.','규제지역은 9억 이하분 40%, 9억 초과분 20%가 나뉘어 적용됩니다.','수도권·규제지역은 LTV와 별개로 주담대 6억원 한도가 함께 걸립니다.','2주택 이상·미처분 1주택 추가구입은 LTV 0%로 금지됩니다.'],
      related:[['/calc/realestate/dsr/','대출한도(DSR) 계산기','🔢'],['/calc/realestate/dti/','총부채상환비율(DTI)','💵'],['/calc/realestate/loan/','대출이자 계산기','💰']]
    },
    '/calc/realestate/gift/': {
      key:'gift',
      quick:['배우자 증여공제는 6억원, 성인 자녀는 5,000만원, 미성년 자녀는 2,000만원입니다.','10년 이내 동일인에게 증여한 재산은 합산과세됩니다.','자금출처조사를 대비해 증여계약서와 이체 내역을 보관하세요.','부담부증여 시 채무 인수 부분은 양도로 보아 양도세가 부과될 수 있습니다.'],
      related:[['/calc/realestate/inheritance/','상속세 계산기','🏛️'],['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/capital-gains/','양도소득세 계산기','📈']]
    },
    '/calc/realestate/inheritance/': {
      key:'inheritance',
      quick:['상속세 신고 기한은 상속 개시일(사망일)로부터 6개월입니다.','배우자공제는 실제 상속금액 기준으로 최소 5억원, 최대 30억원입니다.','사전 증여 재산은 10년 이내 분은 상속재산에 합산됩니다.','상속 재산 평가는 시가를 원칙으로 하며 부동산은 공시가격을 준용합니다.'],
      related:[['/calc/realestate/gift/','증여세 계산기','🎁'],['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/capital-gains/','양도소득세 계산기','📈']]
    },
    '/calc/realestate/joint/': {
      key:'joint',
      quick:['공동명의는 양도세 기본공제(250만원)가 지분별로 각각 적용됩니다.','부부 공동명의는 종합부동산세 세액공제(1주택) 혜택을 선택할 수 있습니다.','취득세는 각자 지분만큼 납부하므로 취득 시 부담 차이는 없습니다.','실제 절세 효과는 보유 기간·소득 수준·주택 수에 따라 달라집니다.'],
      related:[['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/capital-gains/','양도소득세 계산기','📈'],['/calc/realestate/jongbu/','종합부동산세 계산기','🏛️']],
      guides:[['/blog/posts/joint-ownership-tax-guide.html','공동명의 절세 2026 - 공시가격별 종부세 절감액과 전환 비용 함정'],['/blog/posts/jongbu-tax-guide.html','종합부동산세 2026 - 공시가격별 세율 0.5~2.7%, 1주택 고령자 공제까지'],['/blog/posts/acquisition-tax-2026.html','2026 행정안전부 주택 취득세율 - 1주택 6억 이하 1%, 생애최초·2주택 포함']]
    },
    '/calc/realestate/jongbu/': {
      key:'jongbu',
      quick:['종부세는 매년 6월 1일 소유자를 기준으로 과세합니다.','1세대 1주택자는 공시가격 12억원까지 공제됩니다.','공동명의 1주택은 인별 6억 공제와 단독명의 12억 공제를 선택할 수 있습니다.','다주택자 중과세율은 조정대상지역 여부에 따라 달라집니다.'],
      related:[['/calc/realestate/propertytax/','재산세 계산기','🏛️'],['/calc/realestate/joint/','공동명의비교','👥'],['/calc/realestate/acquisition/','취득세 계산기','📄']]
    },
    '/calc/realestate/property-tax-comprehensive/': {
      key:'property-tax-comprehensive',
      quick:['재산세는 매년 6월 1일 소유자를 기준으로 과세합니다.','주택분 재산세는 7월(1/2)과 9월(1/2) 두 번에 나눠 납부합니다.','공시가격 9억원 초과 주택은 종합부동산세도 별도 부과됩니다.','실제 세액은 지자체 조례에 따라 일부 감면될 수 있습니다.'],
      related:[['/calc/realestate/jongbu/','종합부동산세 계산기','🏛️'],['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/propertytax/','재산세 계산기','🏦']],
      guides:[['/blog/posts/realestate-tax-timing.html','잔금일 하루 차이로 세금 수백만원 달라진다 - 6월 1일 재산세·종부세 기준일 2026'],['/blog/posts/holding-tax-guide.html','2026 보유세 완전 정복 - 재산세·종부세 합산 실납부액, 공시가 5억~25억 구간 비교'],['/blog/posts/property-tax-guide.html','재산세 - 공시가격 3억원 아파트 총 납부액 57만원, 7월·9월 계산법 2026']]
    },
    '/calc/realestate/propertytax/': {
      key:'propertytax',
      quick:['재산세는 매년 6월 1일 소유자를 기준으로 과세합니다.','주택분 재산세는 7월(1/2)과 9월(1/2) 두 번에 나눠 납부합니다.','공시가격 9억원 초과 주택은 종합부동산세도 별도 부과됩니다.','실제 세액은 지자체 조례에 따라 일부 감면될 수 있습니다.'],
      related:[['/calc/realestate/jongbu/','종합부동산세 계산기','🏛️'],['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/property-tax-comprehensive/','재산세 종합 계산기','🏦']],
      guides:[['/blog/posts/realestate-tax-timing.html','잔금일 하루 차이로 세금 수백만원 달라진다 - 6월 1일 재산세·종부세 기준일 2026'],['/blog/posts/holding-tax-guide.html','2026 보유세 완전 정복 - 재산세·종부세 합산 실납부액, 공시가 5억~25억 구간 비교'],['/blog/posts/property-tax-guide.html','재산세 - 공시가격 3억원 아파트 총 납부액 57만원, 7월·9월 계산법 2026']]
    },
    '/calc/realestate/pyeong/': {
      key:'pyeong',
      quick:['1평 = 3.30579㎡이며, 아파트 분양 시 전용·공급·계약면적을 구분해야 합니다.','국민주택 규모 기준은 전용면적 85㎡(약 25.7평) 이하입니다.','실거주 느낌은 전용면적 기준이며, 분양가는 보통 공급면적 기준입니다.','발코니 확장 면적은 전용면적에 포함되지 않지만 실사용 공간이 늘어납니다.'],
      related:[['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/brokerage/','중개수수료 계산기','🏠'],['/calc/realestate/rental/','임대수익률 계산기','📊']]
    },
    '/calc/realestate/registry/': {
      key:'registry',
      quick:['등기비용은 등록면허세·교육세·채권매입비용·법무사 수수료로 구성됩니다.','채권 매입 후 즉시 매도(시장매도) 시 할인율에 따른 차액이 실비용입니다.','소유권 이전 등기 신청은 잔금일로부터 60일 이내에 해야 합니다.','법무사 수수료는 법정 기준이 있으나 실제로는 협의 가능합니다.'],
      related:[['/calc/realestate/acquisition/','취득세 계산기','📄'],['/calc/realestate/brokerage/','중개수수료 계산기','🏠'],['/calc/realestate/loan/','대출이자 계산기','💰']]
    }
  };
  let cfg=pages[path];
  if(!cfg){
    var sm=path.match(/\/calc\/([^/]+)\/([^/]+)\//);
    var R=window.CALC_REGISTRY;
    if(sm && R && R[sm[1]] && R[sm[1]].calcs.some(function(c){return c.slug===sm[2];})){
      var others=R[sm[1]].calcs.filter(function(c){return c.slug!==sm[2];}).slice(0,3);
      cfg={key:sm[2], quick:[], related:others.map(function(c){return ['/calc/'+sm[1]+'/'+c.slug+'/', c.name, c.icon];}), guides:[]};
    } else return;
  }

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
    .sh-nav-item.sh-active{background:rgba(245,158,11,.12);color:#F59E0B;}
    .sh-nav-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .sh-cta{margin-left:auto;flex-shrink:0;}
    .sh-btn-blog{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.2);background:transparent;color:#D1D5DB;text-decoration:none;transition:all .15s;display:inline-block;}
    .sh-btn-blog:hover{border-color:#F59E0B;color:#F59E0B;}
    .sh-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;margin-left:auto;background:none;border:none;}
    .sh-hamburger span{display:block;width:22px;height:2px;background:#9CA3AF;border-radius:2px;}
    .mega-layout{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;grid-template-columns:220px minmax(0,1fr) 300px;gap:24px;align-items:start;}
    .mega-sidebar-left{position:sticky;top:88px;align-self:start;}
    .msl-section{margin-bottom:20px;}
    .msl-title{font-size:11px;font-weight:800;letter-spacing:.2px;color:#6B7280;margin-bottom:8px;padding:0 8px;}
    .msl-nav,.msl-calc-list{display:flex;flex-direction:column;gap:2px;}
    .msl-link,.msl-calc-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#6B7280;transition:all .15s;background:none;border:none;width:100%;text-align:left;font-family:inherit;cursor:pointer;}
    .msl-calc-btn{font-size:12px;padding:8px 10px;border-radius:8px;gap:8px;}
    .msl-link:hover,.msl-calc-btn:hover{background:rgba(0,0,0,.04);color:#111827;}
    .msl-link.msl-active,.msl-calc-btn.msl-calc-active{background:rgba(245,158,11,.12);color:#F59E0B;}
    .msl-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center;}
    .msl-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(0,0,0,.06);border-radius:4px;padding:1px 6px;color:#6B7280;}
    .msl-link.msl-active .msl-badge{background:rgba(245,158,11,.15);color:#F59E0B;}
    .msl-divider{height:1px;background:rgba(0,0,0,.06);margin:10px 0;}
    .msl-calc-dot{width:5px;height:5px;border-radius:50%;background:#F59E0B;flex-shrink:0;}
    .mega-sidebar-right{position:sticky;top:88px;display:flex;flex-direction:column;gap:12px;align-self:start;}
    .msr-widget{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;padding:14px 16px;}
    .msr-widget-title{font-size:11px;font-weight:800;color:#6B7280;letter-spacing:.2px;margin-bottom:10px;}
    .msr-widget-list{display:flex;flex-direction:column;gap:4px;}
    .msr-widget-link{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:8px;text-decoration:none;transition:background .15s;}
    .msr-widget-link:hover{background:rgba(0,0,0,.04);}
    .msr-widget-icon{font-size:14px;flex-shrink:0;line-height:1.4;}
    .msr-widget-text{font-size:12px;font-weight:600;color:#6B7280;line-height:1.6;}
    .msr-widget-link:hover .msr-widget-text{color:#111827;}
    .mega-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:150;}
    .mega-overlay.open{display:block;}
    .page-wrap.realestate-shell-main{max-width:none!important;width:100%!important;margin:0!important;padding:0!important;min-width:0;display:flex!important;flex-direction:column!important;gap:12px!important;}
    .realestate-shell-main>*{margin-top:0!important;margin-bottom:0!important;min-width:0!important;}
    .realestate-shell-main>.page-header{margin-bottom:0px!important;}
        .realestate-shell-main .card{width:100%!important;box-sizing:border-box!important;}
    .realestate-shell-main .card .field{min-width:0;}
    .realestate-shell-main .card,
    .realestate-shell-main .result-card,
    .realestate-shell-main .explain-section,
    .realestate-shell-main .siblings-section,
    .realestate-shell-main .guide-section{max-width:100%!important;}
    .realestate-shell-main .guide-section{margin-top:0!important;gap:12px!important;}
    .realestate-shell-main .guide-section>*{margin:0!important;}
    .realestate-shell-main .sibling-section{display:none!important;}
    @media (max-width:1199px){.mega-layout{grid-template-columns:220px minmax(0,1fr);} .mega-sidebar-right{display:none;}}
    @media (max-width:767px){.sh-inner{padding:0 16px;} .sh-nav,.sh-cta{display:none;} .sh-hamburger{display:flex;} .mega-layout{grid-template-columns:1fr;padding:16px;gap:16px;} .mega-sidebar-left{display:none;} .mega-sidebar-left.open{display:block;position:fixed;top:60px;left:0;bottom:0;width:260px;background:#fff;border-right:1px solid rgba(0,0,0,.06);padding:20px 12px;overflow-y:auto;z-index:200;} }
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
        <a href="/calc/realestate/" class="sh-nav-item sh-active"><span class="sh-nav-dot" style="background:#F59E0B"></span>부동산</a>
        <a href="/calc/salary/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#3B82F6"></span>이직/연봉</a>
        <a href="/calc/tools/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#14B8A6"></span>생활·도구</a>
        <a href="/calc/tax/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>프리랜서 세금</a>
        <a href="/calc/pension-welfare/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#0EA5E9"></span>연금·복지</a>
        <a href="/calc/finance/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#6366F1"></span>금융·이자</a>
        <a href="/calc/date/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F97316"></span>날짜·D-day</a>
        <a href="/calc/health/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#10B981"></span>건강</a>
        <a href="/calc/ai/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#8B5CF6"></span>AI/테크</a>
        <a href="/calc/pet/" class="sh-nav-item"><span class="sh-nav-dot" style="background:#F472B6"></span>반려동물</a>
      </nav>
      <div class="sh-cta"><a href="/blog/" class="sh-btn-blog">블로그</a></div>
      <button class="sh-hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
    </div>`;
  }

  const main=document.querySelector('main.page-wrap');
  if(!main || main.classList.contains('realestate-shell-main')) return;
  main.classList.add('realestate-shell-main');

  const overlay=document.createElement('div');
  overlay.className='mega-overlay';
  overlay.id='mega-overlay';
  const layout=document.createElement('div');
  layout.className='mega-layout';

  const left=document.createElement('aside');
  left.className='mega-sidebar-left';
  left.id='mega-sidebar-left';
  left.innerHTML=(window.JPT_sidebarLeft?window.JPT_sidebarLeft('realestate', cfg.key):'');

  // 관련 블로그: 정적 sibling-section의 '관련 가이드'(inject-sibling이 유지)에서 읽어 표준 패턴(📖)으로 렌더, 없으면 박스 숨김
  let guideItems=[];
  document.querySelectorAll('.sibling-section .sibling-title').forEach(function(t){
    if(t.textContent.indexOf('관련 가이드')>-1){
      const list=t.nextElementSibling;
      if(list) list.querySelectorAll('a').forEach(function(a){
        guideItems.push([a.getAttribute('href'), a.textContent.replace(/^\s*📖\s*/,'').trim()]);
      });
    }
  });
  guideItems=guideItems.slice(0,3);
  const guidesWidget = guideItems.length
    ? `<div class="msr-widget">
      <div class="msr-widget-title">관련 블로그</div>
      <div class="msr-widget-list">${guideItems.map(g=>`<a href="${g[0]}" class="msr-widget-link"><span class="msr-widget-icon">📖</span><span class="msr-widget-text">${g[1]}</span></a>`).join('')}</div>
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

  main.parentNode.insertBefore(overlay, main);
  main.parentNode.insertBefore(layout, main);
  layout.append(left, main, right);

  const hamburger=document.querySelector('.sh-hamburger');
  const toggle=function(){left.classList.toggle('open'); overlay.classList.toggle('open');};
  if(hamburger) hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
})();

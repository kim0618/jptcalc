/* calc-registry.js — 계산기 마스터 레지스트리 (단일 소스). 좌측 사이드바·sibling·관련위젯·본문개수 자동.
   계산기 추가 시 해당 카테고리 calcs에 1줄. 본문 그리드·title/meta는 수동(SEO). */
window.CALC_REGISTRY = {
  "realestate": {
    "name": "부동산",
    "icon": "🏠",
    "color": "#F59E0B",
    "calcs": [
      {
        "slug": "brokerage",
        "name": "중개수수료",
        "icon": "🏠"
      },
      {
        "slug": "acquisition",
        "name": "취득세",
        "icon": "📄"
      },
      {
        "slug": "conversion",
        "name": "전월세 전환율",
        "icon": "🔄"
      },
      {
        "slug": "loan",
        "name": "대출이자",
        "icon": "💰"
      },
      {
        "slug": "rental",
        "name": "임대수익률",
        "icon": "📊"
      },
      {
        "slug": "capital-gains",
        "name": "양도소득세",
        "icon": "📈"
      },
      {
        "slug": "dsr",
        "name": "대출한도 (DSR)",
        "icon": "🔢"
      },
      {
        "slug": "gift",
        "name": "증여세",
        "icon": "🎁"
      },
      {
        "slug": "inheritance",
        "name": "상속세",
        "icon": "📜"
      },
      {
        "slug": "joint",
        "name": "공동명의비교",
        "icon": "👥"
      },
      {
        "slug": "jongbu",
        "name": "종합부동산세",
        "icon": "🏦"
      },
      {
        "slug": "property-tax-comprehensive",
        "name": "재산세 종합",
        "icon": "💼"
      },
      {
        "slug": "propertytax",
        "name": "재산세",
        "icon": "🏛️"
      },
      {
        "slug": "pyeong",
        "name": "평수 변환",
        "icon": "📐"
      },
      {
        "slug": "registry",
        "name": "등기비용",
        "icon": "📋"
      }
    ]
  },
  "tax": {
    "name": "프리랜서 세금",
    "icon": "💰",
    "color": "#10B981",
    "calcs": [
      {
        "slug": "withholding",
        "icon": "💲",
        "name": "3.3% 원천징수"
      },
      {
        "slug": "income-tax",
        "icon": "📈",
        "name": "종합소득세"
      },
      {
        "slug": "vat",
        "icon": "📄",
        "name": "부가가치세"
      },
      {
        "slug": "insurance-comparison",
        "icon": "👥",
        "name": "4대보험 비교"
      },
      {
        "slug": "freelancer-income",
        "icon": "💰",
        "name": "월 순수입"
      },
      {
        "slug": "medical-expense",
        "icon": "🏥",
        "name": "의료비 세액공제"
      },
      {
        "slug": "regional-health-insurance",
        "icon": "🏥",
        "name": "지역가입자 건강보험료"
      },
      {
        "slug": "copay-ceiling",
        "icon": "💊",
        "name": "본인부담상한제 환급"
      },
      {
        "slug": "yellow-umbrella",
        "icon": "🪙",
        "name": "노란우산공제"
      },
      {
        "slug": "four-insurance",
        "icon": "🏢",
        "name": "4대보험료"
      }
    ]
  },
  "salary": {
    "name": "이직 / 연봉",
    "icon": "📈",
    "color": "#3B82F6",
    "calcs": [
      {
        "slug": "take-home-pay",
        "icon": "💵",
        "name": "연봉 실수령액"
      },
      {
        "slug": "comparison",
        "icon": "⚖️",
        "name": "연봉 비교"
      },
      {
        "slug": "hourly-wage",
        "icon": "⏱️",
        "name": "시급·일급 변환"
      },
      {
        "slug": "weekly-holiday-pay",
        "icon": "🗓️",
        "name": "주휴수당"
      },
      {
        "slug": "annual-leave-pay",
        "icon": "🏖️",
        "name": "연차수당"
      },
      {
        "slug": "ordinary-wage",
        "icon": "🧮",
        "name": "통상임금"
      },
      {
        "slug": "premium-pay",
        "icon": "⏰",
        "name": "가산수당"
      },
      {
        "slug": "bonus-pay",
        "icon": "🎁",
        "name": "성과급 실수령"
      },
      {
        "slug": "job-change",
        "icon": "📊",
        "name": "이직 연봉 비교"
      },
      {
        "slug": "raise-rate",
        "icon": "📈",
        "name": "연봉 인상률"
      },
      {
        "slug": "severance",
        "icon": "📦",
        "name": "퇴직금"
      },
      {
        "slug": "unemployment",
        "icon": "🛟",
        "name": "실업급여"
      }
    ]
  },
  "finance": {
    "name": "금융 · 이자",
    "icon": "🏦",
    "color": "#6366F1",
    "calcs": [
      {
        "slug": "deposit",
        "icon": "💰",
        "name": "예금 이자"
      },
      {
        "slug": "savings",
        "icon": "📈",
        "name": "적금 만기"
      },
      {
        "slug": "compound",
        "icon": "📊",
        "name": "복리 계산"
      },
      {
        "slug": "loan-repayment",
        "icon": "🏠",
        "name": "대출 상환"
      },
      {
        "slug": "investment",
        "icon": "📉",
        "name": "투자 수익률"
      },
      {
        "slug": "stock-average",
        "icon": "⚖️",
        "name": "주식 평단가"
      }
    ]
  },
  "health": {
    "name": "건강",
    "icon": "🏃",
    "color": "#10B981",
    "calcs": [
      {
        "slug": "bmi",
        "icon": "📏",
        "name": "BMI"
      },
      {
        "slug": "bmr",
        "icon": "🔥",
        "name": "기초대사량"
      },
      {
        "slug": "body-fat",
        "icon": "💪",
        "name": "체지방률"
      },
      {
        "slug": "calories",
        "icon": "🏃",
        "name": "칼로리 소모"
      },
      {
        "slug": "ideal-weight",
        "icon": "⚖️",
        "name": "적정체중"
      }
    ]
  },
  "pension-welfare": {
    "name": "연금·복지",
    "icon": "🏛",
    "color": "#0EA5E9",
    "calcs": [
      {
        "slug": "national-pension",
        "icon": "🏛",
        "name": "국민연금 수령액"
      },
      {
        "slug": "basic-pension",
        "icon": "💰",
        "name": "기초연금 수급 판정"
      },
      {
        "slug": "housing-pension",
        "icon": "🏠",
        "name": "주택연금(역모기지)"
      },
      {
        "slug": "retirement-living",
        "icon": "🏡",
        "name": "노후 생활비"
      },
      {
        "slug": "pension-tax",
        "icon": "💰",
        "name": "연금소득세"
      },
      {
        "slug": "long-term-care",
        "icon": "🏥",
        "name": "장기요양 비용"
      }
    ]
  },
  "date": {
    "name": "날짜 · D-day",
    "icon": "📅",
    "color": "#F97316",
    "calcs": [
      {
        "slug": "dday",
        "icon": "📆",
        "name": "D-day"
      },
      {
        "slug": "date-difference",
        "icon": "📏",
        "name": "날짜 차이"
      },
      {
        "slug": "date-add",
        "icon": "➕",
        "name": "날짜 더하기/빼기"
      },
      {
        "slug": "age",
        "icon": "🎂",
        "name": "만 나이"
      },
      {
        "slug": "weekday",
        "icon": "📅",
        "name": "요일 계산"
      }
    ]
  },
  "ai": {
    "name": "AI / 테크",
    "icon": "🤖",
    "color": "#8B5CF6",
    "calcs": [
      {
        "slug": "api-token",
        "icon": "⚡",
        "name": "API 토큰 비용"
      },
      {
        "slug": "gpu-cloud",
        "icon": "💻",
        "name": "GPU 클라우드"
      },
      {
        "slug": "saas-comparison",
        "icon": "⚖️",
        "name": "SaaS vs 자체구축"
      },
      {
        "slug": "llm-comparison",
        "icon": "📊",
        "name": "LLM 비교표"
      },
      {
        "slug": "infra-forecast",
        "icon": "🚀",
        "name": "인프라 예측"
      }
    ]
  },
  "pet": {
    "name": "반려동물",
    "icon": "🐾",
    "color": "#F472B6",
    "calcs": [
      {
        "slug": "dog-age",
        "icon": "🐶",
        "name": "강아지 나이"
      },
      {
        "slug": "cat-age",
        "icon": "🐱",
        "name": "고양이 나이"
      },
      {
        "slug": "food-amount",
        "icon": "🍽️",
        "name": "사료 급여량"
      },
      {
        "slug": "monthly-cost",
        "icon": "🐕",
        "name": "월 생활비"
      },
      {
        "slug": "adoption",
        "icon": "🏠",
        "name": "입양 초기비용"
      },
      {
        "slug": "medical",
        "icon": "💊",
        "name": "의료비 예산"
      },
      {
        "slug": "insurance",
        "icon": "🛡️",
        "name": "펫보험 비교"
      },
      {
        "slug": "lifetime-cost",
        "icon": "📊",
        "name": "평생 양육비"
      }
    ]
  },
  "tools": {
    "name": "생활·도구",
    "icon": "🛠️",
    "color": "#14B8A6",
    "calcs": [
      {
        "slug": "percent",
        "icon": "％",
        "name": "퍼센트 계산기"
      },
      {
        "slug": "unit-converter",
        "icon": "📐",
        "name": "단위 변환기"
      },
      {
        "slug": "discount",
        "icon": "🏷️",
        "name": "할인율 계산기"
      },
      {
        "slug": "gpa",
        "icon": "🎓",
        "name": "학점 계산기"
      },
      {
        "slug": "naesin-grade",
        "icon": "🏫",
        "name": "내신 등급 계산기"
      },
      {
        "slug": "char-count",
        "icon": "📝",
        "name": "글자수 세기"
      },
      {
        "slug": "lunar-calendar",
        "icon": "🌙",
        "name": "음력 양력 변환기"
      }
    ]
  }
};
window.CALC_TOTAL = Object.keys(window.CALC_REGISTRY).reduce(function(n,k){return n+window.CALC_REGISTRY[k].calcs.length;},0);
window.CALC_CAT_ORDER = ["realestate", "salary", "tools", "tax", "pension-welfare", "finance", "date", "health", "ai", "pet"];

/* 좌측 사이드바(카테고리 nav + 계산기 목록) 공통 렌더 — 9개 detail-shell이 호출. registry 미로드 시 빈 문자열. */
window.JPT_sidebarLeft = function(curCat, curKey){
  var R=window.CALC_REGISTRY, O=window.CALC_CAT_ORDER;
  if(!R||!O||!R[curCat]) return '';
  var nav='<a href="/" class="msl-link"><span class="msl-icon">🧮</span>전체 보기</a>'+O.map(function(c){var x=R[c],a=(c===curCat?' msl-active':'');return '<a href="/calc/'+c+'/" class="msl-link'+a+'"><span class="msl-icon">'+x.icon+'</span>'+x.name+'<span class="msl-badge">'+x.calcs.length+'</span></a>';}).join('');
  var cur=R[curCat], list=cur.calcs.map(function(x){return '<a href="/calc/'+curCat+'/'+x.slug+'/" class="msl-calc-btn '+(x.slug===curKey?'msl-calc-active':'')+'"><span class="msl-calc-dot"></span>'+x.name+'</a>';}).join('');
  return '<div class="msl-section"><div class="msl-title">카테고리</div><nav class="msl-nav">'+nav+'</nav></div><div class="msl-divider"></div><div class="msl-section"><div class="msl-title">'+cur.name+' 계산기</div><div class="msl-calc-list">'+list+'</div></div>';
};

/* 레거시 site-config(JPTCALC_CONFIG) 호환 — 홈 통계 등이 registry 값을 쓰도록 덮어씀.
   site-config.js가 먼저 로드되고 이 파일이 나중에 로드되어 최신 값으로 갱신. */
window.JPTCALC_CONFIG = window.JPTCALC_CONFIG || {};
window.JPTCALC_CONFIG.totalCalcs = window.CALC_TOTAL;
window.JPTCALC_CONFIG.categories = window.CALC_CAT_ORDER.length;

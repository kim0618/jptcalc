/**
 * 시니어 혜택 진단 - 제도 규칙 단일 원본
 * 이 파일만 수정하면 다음 위치에 자동 반영됩니다:
 *   - /calc/pension-welfare/   (허브 #sec-guide 진단 블록)
 *   - 계산기 6개 결과 영역의 진입점
 *
 * 최종 확인: 2026-08-25
 * 근거 원문 대조 기록: ~/jptcalc/senior-benefit-research.md (법령 lsiSeq·조문 기재)
 *
 * ⚠️ 값을 고칠 때는 반드시 sources[]의 원문을 다시 열 것.
 *    순서 고정: ①제도가 현재 존재하는가 → ②자격 구조 → ③해당 연도 값.
 *
 * guide_url/guide_label = 다음 행동으로 넘기는 링크(부모혜택 설명 글 또는 정부 공식).
 *   진단기의 목적이 '나한테 뭐가 해당되지'(제이퍼) → '그게 뭔데 어떻게 신청하지'(부모혜택)
 *   연결이므로, authority_review 항목에는 반드시 있어야 한다.
 *   공공시설 감면은 추가 행동이 필요 없고 딱 맞는 설명 글도 없어 비워 둔다.
 *    뉴스·블로그 재인용 금지. recheck_by가 지난 항목은 값이 맞아 보여도 재확인 대상.
 */

/* 판정 유형별 허용 문구. decision_type이 문구를 강제한다.
   direct 이외에서 "받을 수 있습니다"를 쓰면 안 된다. */
window.BENEFIT_DECISION_COPY = {
  direct: {
    verb: '받을 수 있습니다',
    tone: '조건을 충족하면 별도 심사 없이 이용할 수 있는 혜택입니다.',
    requires_authority: false,
  },
  calculator: {
    verb: '추가 확인이 필요합니다',
    tone: '소득·재산을 계산해야 대상 여부를 알 수 있습니다.',
    requires_authority: false,
  },
  authority_review: {
    verb: '신청 대상 여부를 확인해 볼 수 있습니다',
    tone: '신청은 할 수 있으나, 최종 결정은 심사·선발 기관이 합니다.',
    requires_authority: true, // authority 필드가 비어 있으면 렌더 금지
  },
};

window.BENEFIT_RULES = [
  {
    benefit_id: 'urban_railway',
    guide_url: 'https://www.bumohyetaek.kr/guide/senior-transport-discount/',
    guide_label: '지역별 교통 할인 기준 보기',
    name: '도시철도 경로우대',
    short_name: '도시철도 무임',
    decision_type: 'direct',
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',   // 지자체 운영기준이 연 단위로 바뀜
    reviewed_at: '2026-08-25',
    recheck_by: '2027-01-31',
    min_age: 65,
    max_age: null,
    region_rule: {
      // 국가 기준선: 노인복지법 시행령 별표1 = 도시철도 운임 100분의 100
      // 다만 법 제26조①이 재량 규정("할 수 있다")이라 운영기관이 따로 정할 수 있다.
      basis: 'national_default',
      unit: 'operator',          // 시도가 아니라 도시철도 운영기관 단위로 갈린다
      exceptions: [
        {
          region: '대구',
          // 대구 조례는 "70세 이상"만 규정하고 연차별 연령은 매년 시 지원계획에서 정한다.
          // 법령에도 조례에도 값이 없으므로 값을 박지 않는다.
          pin_value: false,
          notice: '대구는 무임 연령을 시가 매년 따로 정합니다. 대구시 안내에서 올해 기준을 확인하세요.',
          link: 'https://www.daegu.go.kr/tra/index.do',
        },
      ],
    },
    recipient_rule: null,
    conditions: [
      '만 65세 이상',
      '주민등록증 등 나이를 확인할 수 있는 신분증 제시(모바일 주민등록증 포함)',
    ],
    exceptions: [
      '운임에만 적용됩니다. 부가 요금은 해당하지 않습니다.',
      '무임 연령을 별도로 정한 지역이 있습니다. 거주 지역 기준을 확인하세요.',
    ],
    authority: null,
    sources: [
      { label: '노인복지법 제26조(경로우대)', ref: 'law.go.kr lsiSeq=259093', efYd: '2026-01-24' },
      { label: '노인복지법 시행령 제19조', ref: 'law.go.kr lsiSeq=282799', efYd: '2026-01-24' },
      { label: '노인복지법 시행령 별표1 경로우대시설의 종류와 할인율', ref: 'flSeq=161037833', efYd: '2007-12-13' },
    ],
    result_copy: '만 65세 이상이면 도시철도 운임을 무임으로 이용할 수 있습니다.',
    caution_copy: '지역에 따라 무임 연령을 달리 정한 곳이 있습니다.',
    cta_type: 'external',
    cta_target: null,
  },

  {
    benefit_id: 'public_facility',
    name: '공공시설 이용료 감면',
    short_name: '공공시설 무료',
    decision_type: 'direct',
    valid_from: '2026-01-01',
    valid_until: null,
    reviewed_at: '2026-08-25',
    recheck_by: '2027-08-25',   // 별표1이 2007년 이후 미개정이라 변동 위험이 낮다
    min_age: 65,
    max_age: null,
    region_rule: null,          // 국가·지자체 시설이라 지역 분기 없음
    recipient_rule: null,
    conditions: [
      '만 65세 이상',
      '신분증 제시',
    ],
    exceptions: [
      '국공립국악원은 100분의 50 이상, 공연장은 100분의 50 할인입니다.',
      '공연장은 운영자가 자체 기획한 공연의 관람료에만 적용됩니다.',
    ],
    authority: null,
    sources: [
      { label: '노인복지법 시행령 별표1 경로우대시설의 종류와 할인율', ref: 'flSeq=161037833', efYd: '2007-12-13' },
    ],
    result_copy: '만 65세 이상이면 고궁·능원·국공립박물관·국공립미술관·국공립공원을 무료로 이용할 수 있습니다.',
    caution_copy: null,
    cta_type: 'none',
    cta_target: null,
  },

  {
    benefit_id: 'health_checkup',
    guide_url: 'https://www.bumohyetaek.kr/guide/senior-checkup-surgery-guide/',
    guide_label: '검진 항목과 받는 방법 보기',
    name: '국가건강검진(일반건강검진)',
    short_name: '건강검진',
    decision_type: 'direct',
    valid_from: '2026-01-01',
    valid_until: null,
    reviewed_at: '2026-08-25',
    recheck_by: '2027-02-28',
    min_age: null,              // ⚠️ 연령 조건이 아니라 자격 조건이다
    max_age: null,
    region_rule: null,
    recipient_rule: {
      input: 'health_insurance',   // 진단기 입력 4개 중 '건강보험 자격'
      branches: {
        // 국민건강보험법 제52조②1호: 직장가입자·세대주인 지역가입자·20세 이상 지역가입자·20세 이상 피부양자
        insured: {
          label: '건강보험 가입자 또는 피부양자',
          copy: '2년에 한 번 일반건강검진을 받을 수 있습니다.',
          cycle: '2년 1회',
        },
        insured_worker_nonoffice: {
          label: '사무직이 아닌 직장가입자',
          copy: '해마다 일반건강검진을 받을 수 있습니다.',
          cycle: '1년 1회',
        },
        medicaid: {
          label: '의료급여 수급권자',
          copy: '의료급여법에 따른 건강검진 대상입니다.',
          cycle: '의료급여 기준에 따름',
        },
      },
    },
    conditions: [
      '건강보험 가입자 또는 피부양자',
    ],
    exceptions: [
      '암검진은 암 종류별로 연령·성별·주기가 다릅니다. 이 진단에서는 다루지 않습니다.',
    ],
    authority: null,
    sources: [
      { label: '국민건강보험법 제52조(건강검진)', ref: 'law.go.kr lsiSeq=276651', efYd: '2026-01-02' },
      { label: '국민건강보험법 시행령 제25조', ref: 'law.go.kr lsiSeq=283469', efYd: '2026-02-19' },
      { label: '건강검진기본법 제3조3호', ref: 'law.go.kr lsiSeq=279681', efYd: '2026-02-12' },
    ],
    result_copy: '건강보험 자격이 있으면 일반건강검진 대상입니다.',
    caution_copy: '암검진은 조건이 달라 따로 확인해야 합니다.',
    cta_type: 'none',
    cta_target: null,
  },

  {
    benefit_id: 'basic_pension',
    guide_url: 'https://www.bumohyetaek.kr/guide/basic-pension-application/',
    guide_label: '신청 방법과 준비 서류 보기',
    name: '기초연금',
    short_name: '기초연금',
    decision_type: 'calculator',
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',   // 선정기준액·기준연금액이 매년 1월 고시로 바뀐다
    reviewed_at: '2026-08-25',
    recheck_by: '2027-01-15',
    min_age: 65,
    max_age: null,
    region_rule: null,
    recipient_rule: null,
    conditions: [
      '만 65세 이상',
      '대한민국 국적으로 국내 거주',
      '소득인정액이 선정기준액 이하',
    ],
    exceptions: [
      '국민연금 수령액이 기준연금액의 150%를 넘으면 기초연금이 감액될 수 있습니다.',
    ],
    authority: null,
    // 2026년 값. 허브·계산기와 같은 값을 쓴다(사본 3개가 되므로 갱신 시 함께 고칠 것).
    values_2026: {
      선정기준액_단독: 2470000,
      선정기준액_부부: 3952000,
      기준연금액_단독: 349700,
      기준연금액_부부: 559520,
      연계감액_기준: 524550,     // 기준연금액 단독 × 150%
    },
    sources: [
      { label: '보건복지부 보도자료 2026-01-01 (선정기준액)', ref: 'mohw list_no=1488478' },
      { label: '보건복지부 보도자료 2026-01-09 (기준연금액 2.1% 인상)', ref: 'mohw list_no=1488572' },
    ],
    result_copy: '소득과 재산을 계산해야 대상 여부를 알 수 있습니다. 기초연금 계산기에서 확인해 보세요.',
    caution_copy: '소득인정액은 현금 소득만이 아니라 재산을 환산한 금액까지 더해 판단합니다.',
    cta_type: 'calculator',
    cta_target: '/calc/pension-welfare/basic-pension/',
  },

  {
    benefit_id: 'long_term_care',
    guide_url: 'https://www.bumohyetaek.kr/guide/long-term-care-grade/',
    guide_label: '등급 신청 절차 보기',
    name: '노인장기요양보험',
    short_name: '장기요양',
    decision_type: 'authority_review',
    valid_from: '2026-01-01',
    valid_until: null,
    reviewed_at: '2026-08-25',
    recheck_by: '2027-05-31',
    min_age: 65,
    max_age: null,
    region_rule: null,
    recipient_rule: null,
    conditions: [
      '만 65세 이상',
      '장기요양보험 가입자 또는 그 피부양자, 혹은 의료급여 수급권자',
      '6개월 이상 혼자서 일상생활을 수행하기 어려운 상태',
    ],
    exceptions: [
      // ⚠️ min_age를 단순 컷오프로 쓰면 안 되는 이유. 코드에서 65세 미만을 배제하지 말 것.
      '만 65세 미만이어도 치매·뇌혈관성질환 등 노인성 질병이 있으면 신청할 수 있습니다.',
      '신청 시 의사 또는 한의사가 발급한 의사소견서가 필요합니다.',
    ],
    authority: '국민건강보험공단 등급판정위원회',
    sources: [
      { label: '노인장기요양보험법 제2조1호·제12조·제15조②', ref: 'law.go.kr lsiSeq=286217', efYd: '2026-05-26' },
    ],
    result_copy: '신청 대상 여부를 확인해 볼 수 있습니다. 등급은 국민건강보험공단 등급판정위원회가 판정합니다.',
    caution_copy: '신청한다고 모두 등급을 받는 것은 아닙니다.',
    cta_type: 'guide',
    cta_target: null,
  },

  {
    benefit_id: 'senior_job',
    guide_url: 'https://www.seniorro.or.kr/',
    guide_label: '노인일자리 여기에서 모집 공고 보기',
    name: '노인 일자리 및 사회활동 지원사업',
    short_name: '노인일자리',
    decision_type: 'authority_review',
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',   // 연도별 지침으로 바뀐다
    reviewed_at: '2026-08-25',
    recheck_by: '2026-11-30',    // 다음 연도 모집 공고 직전
    min_age: 60,                 // 사업에 따라 60세부터. 65세로 잡으면 잘못 배제된다
    max_age: null,
    region_rule: null,
    recipient_rule: {
      input: 'basic_pension_recipient',
      branches: {
        // ⚠️ 2026년 정본 명칭. '공익활동형·사회서비스형·시장형'은 구 명칭이므로 쓰지 말 것.
        노인공익활동사업: { min_age: 65, requires: '기초연금 수급자' },
        노인역량활용사업: { min_age: 60, requires: null },
        공동체사업단: { min_age: 60, requires: null },
      },
    },
    conditions: [
      '노인공익활동사업은 기초연금을 받는 만 65세 이상',
      '노인역량활용사업과 공동체사업단은 만 60세 이상',
      '사업을 수행할 수 있는 건강 상태와 근로·활동 능력',
    ],
    exceptions: [
      '참여자는 소득 수준, 활동 역량, 경력 등 선발기준에 따라 고득점자순으로 선발됩니다.',
      '모집 시기와 기준은 지방자치단체 여건에 따라 다를 수 있습니다.',
    ],
    authority: '노인일자리 수행기관 및 지방자치단체',
    sources: [
      { label: '노인 일자리 및 사회활동 지원에 관한 법률 제15조·제16조', ref: 'law.go.kr lsiSeq=267415', efYd: '2026-01-01' },
      { label: '같은 법 시행령 제2조', ref: 'law.go.kr lsiSeq=266187', efYd: '2024-11-01' },
      { label: '보건복지부 보도자료 2025-11-27 (2026년 참여자 모집)', ref: 'mohw list_no=1488037' },
    ],
    result_copy: '신청 대상 여부를 확인해 볼 수 있습니다. 참여자는 수행기관이 선발기준에 따라 선발합니다.',
    caution_copy: '신청자가 모집 인원보다 많으면 선발되지 않을 수 있습니다.',
    cta_type: 'guide',
    cta_target: null,
  },
];

// 데이터 확인 기준일
window.BENEFIT_RULES_UPDATED = '2026-08-25';

/* site-config.js - 제이퍼 계산기 전역 상수 (레거시 fallback)

   ⚠️ 이제 assets/calc-registry.js 가 진짜 단일 소스입니다.
   계산기 추가/삭제 시 calc-registry.js 의 해당 카테고리 calcs 만 수정하세요.
   이 파일 값은 calc-registry.js 가 나중에 로드되며 런타임에 덮어씁니다(여기는 미로드 시 fallback). */
window.JPTCALC_CONFIG = {
  totalCalcs: 59,
  categories: 9
};

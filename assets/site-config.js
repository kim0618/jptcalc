/**
 * site-config.js - 제이퍼 계산기 전역 상수
 *
 * 계산기를 추가·삭제할 때 이 파일 하나를 먼저 수정하세요.
 * 수정 후 아래 파일들도 동일하게 맞춰야 합니다:
 *   - index.html             (hero 통계, schema.org, meta description, 사이드바 배지)
 *   - about.html             (meta description, 페이지 제목)
 *   - calc/*/index.html      (각 카테고리 페이지 사이드바 배지)
 *   - assets/realestate-shell.js   (realestate 개별 계산기 사이드바)
 *   - assets/*-detail-shell.js     (각 카테고리 개별 계산기 사이드바)
 */
window.JPTCALC_CONFIG = {
  /** 전체 계산기 수 (calc/ 하위 폴더 기준) */
  totalCalcs: 52,

  /** 카테고리 수 */
  categories: 8,

  /**
   * 카테고리별 계산기 개수
   * 합계: 15+7+5+5+5+5+5+5 = 52
   */
  badges: {
    realestate : 15,   // 취득세·양도세·등기·DSR·증여·상속·종부세·재산세·공동명의·임대·대출·중개·전월세·평형·보유세
    salary     : 7,    // 실수령액·비교·시급·이직·인상률·퇴직금·실업급여
    tax        : 5,    // 3.3%원천징수·소득세·부가세·보험비교·프리랜서순수입
    ai         : 5,    // API토큰·GPU클라우드·인프라예측·LLM비교·SaaS비교
    pet        : 5,    // 입양·보험·평생비용·의료비·월비용
    finance    : 5,    // 복리·예금·투자·대출상환·적금
    health     : 5,    // BMI·BMR·체지방·칼로리·이상체중
    date       : 5     // 만나이·날짜더하기·날짜차이·D-day·요일
  }
};

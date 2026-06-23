# 출산·육아 카테고리 빌드 플랜 (신규 카테고리)

- **작성일**: 2026-06-23
- **근거**: 메모리 `project_jptcalc_calc_candidates` 2026-06-16 스윕(데이터랩 검증·빌드셋 확정) + 2026-06-23 web 수치 재검증
- **SOP**: 자동차 카테고리(2026-06-22~23, 11번째)와 동일. `calc-registry-refactor.md §4` + `.claude/rules/calc-page-assets.md` + `.claude/rules/category-registry.md`
- **상태**: 미착수. 자동차 카테고리 완료 후 **마지막 신규 카테고리** (이후 카테고리 확장 종료, 성장=콘텐츠/SEO)

---

## 0. 카테고리 셋업 (P0, 첫 계산기와 동반)

| 항목 | 값 |
|---|---|
| 한글명 | **출산·육아** |
| slug (폴더) | **`baby`** (확정 필요 - 대안 childcare/parenting) |
| 표시색 | **`#FB7185`** rose-400 (확정 필요 - pet `#F472B6`과 구분되도록) |
| 아이콘 | **👶** |
| nav 순서 | `CALC_CAT_ORDER` **맨 뒤(12번째)** = auto 다음 (신규는 기본 맨뒤, [[feedback_jptcalc_category_order]]) |
| data-filter | `출산·육아` |

**셋업 작업 (자동차 때 실측 = nav 하드코딩 19곳 + 홈 + assets)**:
1. `.claude/rules/category-registry.md` 표에 행 추가
2. `assets/baby-common.css` (auto-common.css 복제 + 리컬러), `baby-detail-shell.js` (auto-detail-shell.js 복제, 12 nav·rose), `baby-shell.js` (카테고리 index용)
3. `assets/calc-registry.js`: `CALC_CAT_ORDER`에 `"baby"` 추가 + `baby` 객체(name/icon/color/calcs)
4. `/calc/baby/index.html` 카테고리 허브 (auto/index.html 복제)
5. 홈 `index.html`: `--c-baby` var·cat-card·cat-pills·상단 nav·sidebar-link·카운트 4곳(s-badge·hero-stat·본문·about) — ⚠️**홈 cat-pills + 카운트가 registry 자동화 안 닿는 단골 누락지점** ([[project_jptcalc_calc_registry]])
6. nav 일괄 통합 스크립트: detail-shell(11→12개 카테고리 nav) + 카테고리 index(11개) 정적헤더 일괄치환
7. `/blog/index.html` filter-btn + `tag-baby` CSS ([[blog-index-sync.md]])
8. `about.html`·`llms.txt`·`sitemap.xml`
9. `scripts/inject-sibling.mjs` `TITLES` 맵에 `baby:'다른 출산·육아 계산기'` 등록 ⚠️ (자동차 P1에서 빠뜨려 sibling 전체 skip된 버그 재발 방지)
10. 요율표 가드 `scripts/check-rate-tables.mjs` `POLICY_CATS`에 `baby` 추가 (정책 고정금액 계산기 표 누락 자동 적발)

---

## 1. 계산기 목록 (8 + 허브 + 양육비 = 10 페이지)

### 순수 날짜계산기 (정책상수 없음 → 요율표 면제 · refresh 면제 · 유지보수 0)

**① 배란일 (ovulation) — 1.8x 최대어 · ROI 최강 · 첫 착지점**
- slug `ovulation` / `/calc/baby/ovulation/`
- 입력: 마지막 생리 시작일(LMP), 평균 생리주기(기본 28일)
- 출력: 배란 예상일, 가임기(배란 −5일 ~ +1일), 다음 생리 예정일
- 로직: 배란일 = LMP + (주기 − 14), 가임기 window
- 난이도: 하. ⚠️ zero-click(네이버 위젯+생리주기앱) 경쟁이나 웹검색 real = 부분 capture, 최대어라 포함
- 블로그: 신규 "배란일·가임기 계산법" /blog 기회

**② 출산예정일 + 임신주수 (due-date) — 0.53x · 한 페이지 2기능**
- slug `due-date` / `/calc/baby/due-date/`
- 입력: LMP (네겔레 법칙) — 같은 입력으로 예정일·주수 동시
- 출력: 출산예정일(LMP +280일 = −3개월+7일+1년), 현재 임신 주수/일수, 삼분기 구분
- 로직: 네겔레 법칙, 윤년·월말 처리 주의
- 난이도: 하~중

**③ 아기 월령 (baby-months) — 0.63x · 깨끗**
- slug `baby-months` / `/calc/baby/baby-months/`
- 입력: 출생일
- 출력: 현재 만 X개월 Y일, (옵션) 다음 영유아검진·예방접종 시기 안내
- 난이도: 하

### 정책 고정금액 계산기 (요율표 의무 + data-points 등록 + refresh 대상)

> 🔴 모든 금액은 빌드 직전 **WebFetch 공식 검증** 후 상수 박기. 2026 확정치(2026-06-23 web 1차 확인, 빌드시 복지로/고용노동부 재확인):

**④ 부모급여 (parental-benefit) — 0.57x**
- slug `parental-benefit` / `/calc/baby/parental-benefit/`
- 입력: 자녀 생년월, 보육형태(가정양육/어린이집)
- 출력: 0세 월 100만 · 1세 월 50만 총수령액, 어린이집 이용 시 보육료 바우처 차액
- 요율표: "2026 부모급여 지급액표(0세/1세)"
- 난이도: 하

**⑤ 아동수당 (child-allowance) — 0.57x**
- slug `child-allowance` / `/calc/baby/child-allowance/`
- 입력: 자녀 생년월
- 출력: 월 10만 × 잔여 개월(만 8세 미만 = 95개월까지) = 총액
- ⚠️ "만 8세 미만" vs 일부 자료 "만 9세 미만" → **빌드 직전 현행 연령 상한 확정 필수**
- 요율표: "아동수당 지급 기준(연령·월액)"
- 난이도: 하

**⑥ 첫만남이용권 (first-meeting) — 0.57x**
- slug `first-meeting` / `/calc/baby/first-meeting/`
- 입력: 출생 순위(첫째 / 둘째 이상), 자녀 수
- 출력: 첫째 200만 · 둘째 이상 300만 (고정 lookup)
- 요율표: "첫만남이용권 지급액(출생순위별)"
- 난이도: 하

**⑦ 가정양육수당 (home-care-allowance) — 0.36x**
- slug `home-care-allowance` / `/calc/baby/home-care-allowance/`
- 입력: 자녀 월령(24~86개월, 어린이집/유치원 미이용), 농어촌·장애아 여부
- 출력: 월 10만(24개월 이상 미취학·미이용분), 농어촌·장애아 별도 단가
- ⚠️ 부모급여 도입으로 **0~23개월은 부모급여, 24개월~취학 전이 가정양육수당** 대상 (경계 안내)
- 요율표: "양육수당 지급 단가(일반/농어촌/장애아)"
- 난이도: 하~중

### 허브 (P3, 정책 4종 완성 후)

**⑧ 출산지원금 통합 시뮬 (total-support) — 정책 4종 묶는 종합 페이지**
- slug `total-support` / `/calc/baby/total-support/`
- 입력: 자녀 출생일·출생순위·보육형태
- 출력: 출생 ~ 취학까지 받는 **총 지원금 타임라인**(첫만남+부모급여+아동수당+가정양육수당 합산), 개별 계산기 링크
- 난이도: 중(④~⑦ 로직 조합 + 타임라인 UI). 개별+허브 SEO 구조

### 고난이도 캐리 (P4~5, 독립 집중 빌드)

**⑨ 육아휴직급여 (parental-leave-pay) — 1.5x 캐리 · ⚠️최고난도**
- slug `parental-leave-pay` / `/calc/baby/parental-leave-pay/`
- 입력: 월 통상임금, 육아휴직 개월수, (토글) **6+6 부모육아휴직제** 해당 여부(생후 18개월 내 부모 모두 사용)
- 출력: 월별 급여 + 총액
- 로직 (2025~ 개편, 🔴빌드 직전 고용노동부 2026 고시 WebFetch 필수):
  - **일반**: 1~3개월 통상임금 100%(상한 250만) / 4~6개월 100%(상한 200만) / 7개월~ 80%(상한 160만), 하한 70만
  - **6+6 특례**: 첫 6개월 부모 각각 100%, 월 상한 1→6개월 = 200/250/300/350/400/450만
- 요율표: "육아휴직급여 월별 상한표(일반/6+6특례)" — data-points 등록
- 난이도: **상** (월별 상한 분기 + 6+6 표). capturable(서드파티 활발=삼쩜삼 패턴, UX 차별화 여지)
- ⚠️ 고용24 공식 모의계산 경쟁 → 우리 강점=쉬운 UX·월별 분해 시각화

### 법률 이동 (P6, 선택/보류 가능 · 최저 우선)

**⑩ 양육비 (child-support) — 0.2x · 법률에서 이동**
- slug `child-support` / `/calc/baby/child-support/`
- 입력: 부모 합산 소득, 자녀 수·나이
- 출력: 서울가정법원 **양육비 산정기준표** 기준 표준양육비
- 기준표: "양육비 산정기준표(소득구간×자녀연령)" — 의무
- ⚠️ **YMYL(이혼·법률) 성격** → 면책 강화("법원 최종 판단과 다를 수 있음"), 출산·육아 카테고리와 결이 달라 **별 성격**. 0.2x로 최저 우선, 보류 가능

---

## 2. 제작 순서 (ROI + 트래픽 블렌드)

| 단계 | 작업 | 근거 |
|---|---|---|
| **P0+P1** | 카테고리 셋업 + **배란일(①)** | 셋업 1회 + 최대어(1.8x)·순수날짜=유지보수0 = 자동차 "할부" 같은 빠른 착지점 |
| **P2** | 출산예정일+임신주수(②) · 아기월령(③) | 순수 날짜군 양산(정책 무관·refresh 면제) |
| **P3** | 부모급여(④)·아동수당(⑤)·첫만남(⑥)·가정양육수당(⑦) | 정책 고정금액 batch, 요율표+data-points §10 일괄 등록 |
| **P4** | 출산지원금 통합 허브(⑧) | P3 4종 완성 후 조합 |
| **P5** | **육아휴직급여(⑨)** | 최고난도 독립 집중 빌드, 고시 검증. ⚠️1.5x 캐리라 트래픽 급하면 P2로 당겨도 됨 |
| **P6** | 양육비(⑩) | 법률 YMYL·별 성격, 선택/보류 |

**총계**: 94 → **104 계산기**(허브 포함) / **12 카테고리**.
**예상 분량**: P0+P1 셋업 무거움(자동차 수준), P2~P3는 빠름(쉬운 로직), P5 1개가 단독 큰 작업.

---

## 3. 빌드 후 공통 마무리 (각 계산기 / 카테고리)

- **node 검산**: 각 계산기 핵심 케이스 (자동차 SOP)
- **적대적 재검증**: 카테고리 완료 후 에이전트 2개(정책수치 + 코드/SEO) — 자동차 때 치명버그 다수 적발한 필수 단계
- **요율표 가드**: `node scripts/check-rate-tables.mjs` (POLICY_CATS=baby로 정책 4종+육아휴직+양육비 표 자동 확인)
- **sibling**: `node scripts/inject-sibling.mjs` (TITLES에 baby 등록 후)
- **data-points.md §10 출산·육아** 신규 섹션: 부모급여(100/50만)·아동수당(10만·8세미만)·첫만남(200/300)·가정양육수당(10만)·육아휴직급여 상한표·양육비 기준표 + 검색패턴 + 영향페이지
- **refresh 등록**: `jptcalc-refresh`에 baby 정책수치 — 1월 일제점검 + 정책발표 트리거([[project_refresh_cadence]])
- **블로그 양방향**: bumohyetaek 출산·육아 글 relatedCalculator 연결 + jptcalc 블로그 신규(배란일·출산예정일·부모급여 비교 등)
- **JSON-LD 3종**(WebApplication·FAQPage·BreadcrumbList)·TRUST_BLOCK·ARTICLE_INFO 각 페이지 필수
- 배포는 사용자 직접(rsync) — 빌드까지만 ([[feedback_no_deploy.md]])

---

## 4. 착수 전 확정 필요 (2건)

1. **slug**: `baby` 권장 (대안 `childcare`/`parenting`) — URL에 박혀 되돌리기 어려움
2. **표시색**: `#FB7185`(rose) 권장 — pet 핑크와 구분, 브랜드 취향

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
| slug (폴더) | **`baby`** ✅확정(2026-06-24) |
| 표시색 | **`#84CC16`** lime-500 ✅확정(2026-06-24, 빈 hue 슬롯·pet핑크/auto빨강과 최대 구분, pill텍스트 #4D7C0F). 나중 교체 쉬움(CSS var 1개) |
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

## 4. 진행 상황

- ✅ **P0 카테고리 셋업 완료(2026-06-24)**: slug=`baby`·색=lime `#84CC16`·아이콘 👶. registry(CALC_CAT_ORDER 12번째)+baby-common.css+baby-detail-shell.js+/calc/baby/index.html+홈(--c-baby·nav·sidebar·cat-card·cat-pills·카운트 96/12 보정)+nav일괄삽입(detail-shell12+카테고리index12, realestate 상대경로 수동)+blog(filter+tag-baby)+about+llms+sitemap+category-registry.md+inject-sibling TITLES+check-rate-tables POLICY_CATS(ovulation은 SKIP_NO_TABLE). 가드 전수통과(JSON-LD3/3·nav12/12·FAQ5=5·총96계산기).
- ✅ **P1 배란일(ovulation) 완료(2026-06-24)**: `/calc/baby/ovulation/`, 🥚. 입력=마지막생리일+주기(기본28, 빠른버튼 26/28/30/32). 출력=배란예상일(D-day)·가임기(배란−5~+1)·다음생리·다음배란. 황체기14일 역산, node검산 PASS(28일 LMP6/1→배란6/15·가임6/10~16). 순수날짜=요율표면제. 관련계산기는 현존 페이지(date/health)로 임시연결(P2 due-date·baby-months 빌드 시 교체).
- ✅ **P2 완료(2026-06-24)**: ①**출산예정일·임신주수(due-date)** 🤰 — 모드토글(마지막생리일/배란·수정일), 네겔레 LMP+280일(주기보정 ±(cycle−28))·배란일+266일, 현재 임신주수(GA=오늘−LMP)·삼분기(1삼<98일/2삼<196일/3삼)·태아나이(GA−14)·출산 D-day. node검산 PASS(LMP1/1·28일→예정일10/8). ②**아기 개월수(baby-months)** 👶 — 출생일→만개월+일(월말경계 borrow 처리)·만나이·총일수·다음 영유아검진(14~35일/4·9·18·30·42·54·66개월)·다음생일 D-day. node검산 PASS(2025-01-15→17개월9일, 윤일·월말 OK). 둘 다 순수날짜=SKIP_NO_TABLE 등록. registry baby 3종·총98계산기. 동기화 전수(카테고리index 사이드바/그리드/hasPart3/msr·홈 카운트98·pills3·sidebar badge3·sitemap·llms·inject-sibling). ovulation 관련계산기를 due-date·baby-months로 교체. JSON-LD 3/3·FAQ 5=5·인라인 calc JS 문법 OK·HTTP 200.
- ✅ **P3~P5 + 적대검증 완료(2026-06-24)**: 정책 5종 + 통합허브 + 육아휴직급여. web 재검증 확정수치=부모급여 0세100만/1세50만(동결)·아동수당 만9세미만 월10만(2026.3.20 확대)·첫만남 200/300만·가정양육수당 일반10만/농어촌15.6·12.9·10만/장애아20·10만·육아휴직급여 일반(1~3개월100%상한250만/4~6개월100%200만/7~12개월80%160만/하한70만)+6+6특례(250·250·300·350·400·450만). **node검산 전수 PASS**. data-points §10.2~10.7 등록. **적대 재검증 2에이전트(정책수치+코드/SEO) 결과 치명0**: 수치 9종 전부 정확(복지로·보건복지부·고용노동부·nodong.kr 교차), 경미2 즉수정(요율표 .highlight-cell 라임 스타일 baby-common.css 추가 / 정적 no-JS nav 9종 통일=연금·복지). **총 104계산기·12카테고리. baby 9종 100% 완성·배포준비.** JSON-LD3/3·FAQ5=5·calcJS·요율표가드·HTTP200·nav12/12 전수통과.
- ⏳ **남은 선택지**: P6 양육비(child-support) — YMYL(이혼·법률)·0.2x·별 성격이라 **보류 권장**. 진행 시 서울가정법원 양육비 산정기준표 + 면책 강화 필요. 사용자 판단 대기.
- ✅ **최종 런타임 버그검증 + 입력위생 강화(2026-06-24)**: 사용자가 날짜칸에 6자리연도(202122-02-32) 입력되는 버그 제보 → ①**전역 수정 calc-validate.js**: 모든 date입력 min=1900-01-01/max=2200-12-31, month입력 1900-01~2200-12 자동부여(연도 4자리 강제). ⚠️D-day·날짜차이·날짜더하기는 미래 필수라 상한 넓게(2200), max=today 금지. ②baby-detail-shell.js: baby 날짜입력(출생일·생리일·배란일)만 max=today로 좁힘(미래불가, 전역 덮어씀). ③런타임 버그헌터 에이전트 → **치명1+경미2 수정**: [치명]baby-months 신생아 1차검진 누락+66개월 8차 사라짐(루프 `m<c.m`→창종료 `m<c.e` 기준 재작성, 1차는 totalDays<35 일수기준, node 11/11 PASS) / [경미]first-meeting prev-children 직접입력 999 클램프(Math.min 10) / [경미]parental-leave-pay 통상임금 max=3000. 미래생년월 만액표시·due-date 미래수정일은 정상동작(오해소지 경미, 미수정). 전수 재QA: 104계산기·9종 JSON-LD3/3·FAQ5=5·calcJS·HTTP200, 날짜/부동산 계산기 회귀 0.
- **배포는 사용자 직접(rsync)** — 빌드까지 완료.

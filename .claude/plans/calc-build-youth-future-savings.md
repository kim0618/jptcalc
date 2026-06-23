# 청년미래적금 계산기 빌드 플랜

- **slug**: `youth-future-savings` (금융/finance 9번째)
- **name**: 청년미래적금 / display "청년미래적금 계산기"
- **icon**: 💳 (도약계좌 🚀와 구분)
- **템플릿**: `calc/finance/youth-leap-account/index.html` 복제 → 3년·6/12% 구조로 개조
- **트래픽 근거**: 2026.6.22 출시 정책 신키워드, 가입신청 6.22~7.3 (수요 집중기). "청년미래적금 계산기 / 청년도약계좌 vs 청년미래적금" 선점.
- **검증일**: 2026-06-23, 출처 = 금융위원회 보도자료(fsc.go.kr 87106/87158) + 서민금융진흥원(kinfa) + 토스/카뱅 상품안내

## 상품 사실 (web 검증 완료, 2026-06-23)
- 만기 **3년(36개월)**, 월 납입한도 **50만원**, 자유적립식, 이자소득 **비과세(15.4% 면제)**
- 정부기여금: **일반형 납입액의 6% / 우대형 12%**
  - 월 50만 기준 → 일반형 월 3만(3년 108만) · 우대형 월 6만(3년 216만)
- 자격(공통): 개인소득 7,500만(종소득 6,300만, 소상공인 매출 3억) 이하 + 기준중위 200%(맞벌이 2인 250%) 이하, 만 19~34세
  - 일반형: 개인소득 6,000만 이하 / 중위 200% 이하
  - 우대형: 개인소득 3,600만 이하 / 중위 150% 이하, **또는** 중소기업 재직·신규취업·소상공인(매출 1억 이하)
- 갈아타기: 기존 청년도약계좌 가입자는 6월 최초 신청기간(~7.3)에 한해 특별중도해지로 전환 가능(중복가입 불가)
- 공식 예시(우대형·월50만·연8% 가정): 원금 1,800 + 기여금 216 + 비과세이자 239 = **약 2,255만원**

## 입력
1. 유형 select (기여금률 결정):
   - `6` 일반형 (개인소득 6,000만 이하·중위 200%) → 기여금 6%
   - `12` 우대형 (개인소득 3,600만 이하·중위 150% / 중기재직·신규취업·소상공인) → 기여금 12%
2. 월 납입액 (만원) input: min 0, max 50, step 1, default 50, oninput=calc()
3. 적용 금리 (연 %) input: min 0, step 0.1, **default 5.0** (hint: 은행 우대 충족 시 최대 약 8%)

## 계산 로직 (youth-leap 패턴 복제, n=36)
```
n = 36                            // 3년
monthly = 월납입만원 * 10000       // 한도 50만 클램프
matchRate = 유형값/100            // 0.06 or 0.12
monthlyContrib = monthly * matchRate
principal = monthly * n
match = monthlyContrib * n
// 적립식 단리 비과세 이자 (원금+기여금에 부리, youth-leap와 동일 처리)
interest = (monthly + monthlyContrib) * (rate/100) * (n*(n+1)/2) / 12
total = principal + match + interest
extra = match + interest         // 내 돈 대비 추가수익
```
- 검산(우대형·50만·8%): principal 1,800만 / match 216만 / interest ≈ 249만 / total ≈ 2,265만 → 공식 "약 2,255만"과 동치(가정 차 ±10만)
- 50만 초과 입력 시 `.result-warn` 노출("월 납입한도 50만원") + 50만 클램프

## ★ 차별 기능 — 체감 환산수익률 (도약계좌엔 없음, "체감 20%" 검색의도 대응)
일반 과세적금이라면 연 몇 %짜리와 같은가:
```
denom = monthly * (n*(n+1)/2) / 12
grossRate = (extra / denom) / (1 - 0.154) * 100   // 비과세 효과까지 그로스업
```
- 검산(우대형·50만·8%): extra 455만 / denom 2,775만 = 16.4% → /0.846 = **19.4%** (기사 "체감 19~20%"와 일치)
- 결과카드에 "일반 과세적금 환산 연 OO%" 행으로 출력 → 후크 키워드 점유

## 출력 (result-card)
- 하이라이트: 3년 만기 수령액(total)
- 납입 원금 (월납입 × 36개월)
- 정부기여금 (3년 합계) — match-row 강조
- 비과세 이자 (적립식 단리)
- 내 돈 대비 추가수익 (기여금+이자) = extra
- **일반 과세적금 환산 연 OO%** (체감 수익률)
- note: 만기 3년 유지 시 기여금 전액, 중도해지 시 소멸. 금리·우대조건은 은행별 상이.

## 요율표 (필수 - check-rate-tables.mjs, finance ∈ POLICY_CATS)
`<div class="guide-card">` 내 표 1개 — 값은 위 JS 상수와 일치(재발명 금지):
- 제목 "청년미래적금 유형별 정부기여금 (2026)"
- 표 위 40~60자 핵심요약 1문장(ChatGPT 인용용)
- 컬럼: 유형 / 기여금률 / 월 최대 기여금(50만 기준) / 3년 합계 / 자격
  - 일반형 / 6% / 30,000원 / 108만원 / 개인소득 6,000만·중위200%
  - 우대형 / 12% / 60,000원 / 216만원 / 개인소득 3,600만·중위150%·중기재직
- 하단: 만 19~34세, 3년 만기, 비과세 15.4%, 가입신청 2026.6.22~7.3 안내

## JSON-LD 3종
- WebApplication (FinanceApplication)
- BreadcrumbList (홈 > 금융·이자 > 청년미래적금)
- FAQPage (HTML faq와 일치) — Q 후보: 기여금 6/12% 차이 / 일반형·우대형 자격 / 도약계좌 갈아타기 순서·주의 / 3년 만기 실수령 / 체감수익률 의미

## 메타 (youth-leap 패턴)
- title: `청년미래적금 계산기 - 3년 만기 수령액·정부기여금 6/12% 2026 | 제이퍼 계산기`
- description: 유형(일반/우대)·월납입·금리 입력 → 정부기여금+비과세이자 합산 3년 만기액 자동계산, 체감 환산수익률까지. 2026 출시 무료.
- og/twitter 동기화

## 동기화 (finance registry 추가 SOP)
1. `assets/calc-registry.js` finance.calcs 9번째 추가: `{ "slug":"youth-future-savings","icon":"💳","name":"청년미래적금" }`
2. `assets/finance-detail-shell.js` cfg에 `/calc/finance/youth-future-savings/` 추가 (youth-leap-account 항목 참고)
3. `node scripts/inject-sibling.mjs` (sibling-section 재생성 - 누락 시 크롤러 내부링크 이탈)
4. `calc/finance/index.html`: hasPart·calc-hub-card·msl-calc-btn·count(8→9)·desc/keywords
5. 홈 `index.html`: s-badge·cat-pills·총계 bump (현재 총계 grep으로 확인 후 +1)
6. `about.html` 총계 +1
7. `sitemap.xml` + `llms.txt` 항목 추가
8. `data-points.md` finance절 등록: 검색패턴(기여금 6%/12%, 한도 50만, 만기 3년, 가입 2026.6.22~7.3) + 영향페이지 → refresh 누락 방지
9. 블로그 양방향: `youth-leap-account` 관련 가이드(도약계좌 글)에 "vs 청년미래적금" 단락 보강 + 신규 블로그 글 후보("청년미래적금 갈아타기/일반형우대형 차이")는 /blog 별도 진행
10. 가드: `node scripts/check-rate-tables.mjs` (표 보유 확인) + 월50만·8% 엣지 검산

## 결정 완료
- **default 금리 = 5.0%** (사용자 확정 2026-06-23). input value="5.0" + hint "은행 우대 충족 시 최대 약 8%". 과대표시 회피, 환산수익률 행이 업사이드 노출.

## 주의
- 배포(rsync)는 사용자 직접 (deploy-policy)
- "연 8%"는 우대금리 풀충족 가정 - 금리는 사용자 입력값으로 노출, 단정 금지
- 메모리 정정 반영: 기여금은 "월 최대 6만(우대)"이 곧 "납입액 12%"임. 일반형/우대형 2단계 차등은 신규 확정 정보 → project_jptcalc_calc_candidates 갱신

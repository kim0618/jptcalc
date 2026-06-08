# 부모혜택 깔때기용 계산기 3개 - 제작 스펙

2026-06-05 데이터랩 검증 완료. **기존 카테고리 추가**(신규 카테고리 셋업 불필요). 통상임금(완료) 다음 제작 대상.

## 공통 원칙 (필독)
- **모두 기존 카테고리 추가** → 카테고리 신설 X. calc-registry SOP(`calc-registry-refactor.md §4`)대로: ① 페이지 본체 생성 ② `assets/calc-registry.js`의 해당 `{cat}.calcs`에 1줄 ③ SEO 수동(카테고리 index title/meta·hasPart·본문그리드·**홈 index.html cat-pills**·sitemap).
- 🔴 **공식 2026 수치는 추측 절대 금지.** jptcalc 정확도가 생명. 제작 직전 **WebFetch로 공식 출처 검증 후** 상수 박기. (세율·요율·금액은 매년 바뀜)
- 면책 문구 + `TRUST_BLOCK_CONFIG` 필수. 페이지 구조는 `.claude/rules/calc-page-assets.md`.
- 빌드 후 **부모혜택(bumohyetaek) 해당 글에 relatedCalculator 연결/교체** (아래 각 항목).

---

## 1. 주택연금(역모기지) 계산기 ⭐ (꾸준·1순위)
- **카테고리**: 연금·복지(pension-welfare) / **slug**: `housing-pension` / URL: `/calc/pension-welfare/housing-pension/`
- **입력**: 주택가격(시세, 만원), 본인 나이(만 55세+), (옵션)배우자 나이, 지급방식(종신지급)
- **출력**: 예상 월 수령액(종신지급방식 기준)
- **로직**: 한국주택금융공사(HF) **월지급금 예시표 룩업 + 나이·주택가격 보간**. 정확한 산정식 비공개라 공사 공시 예시표(연령 55~ × 주택가격 1억~12억) 사용.
- **🔴 데이터 검증**: HF(hf.go.kr) 2026 월지급금 예시표 WebFetch. 매년 조정됨.
- **면책**: "참고용, 정확한 금액은 한국주택금융공사 ☎1688-8114"
- **난이도**: 중
- **부모혜택 연결**: housing-pension, housing-farmland-pension-comparison, senior-home-disposal-comparison, senior-housing-guide

## 2. 건강보험료(지역가입자) 계산기 ⭐ (검색 큼·깔때기 개선)
- **카테고리**: 세금(tax) / **slug**: `regional-health-insurance` / URL: `/calc/tax/regional-health-insurance/`
- **입력**: 연소득(사업·연금·이자 등), 재산(재산세 과세표준, 만원), (자동차는 2024 폐지됨-확인)
- **출력**: 월 건강보험료 + 장기요양보험료
- **로직**: 지역가입자 = **보험료 부과점수 × 점수당 금액**. 소득점수 + 재산점수 합산.
- **🔴 데이터 검증**: 건강보험공단(nhis.or.kr) 2026 **부과점수표 + 점수당 금액** WebFetch. ⚠️ 2024~ 자동차 부과 폐지 등 제도변경 있음, 최신 확인 필수.
- **면책**: "참고용, 정확한 금액은 건강보험공단 ☎1577-1000"
- **난이도**: 중~상(부과점수표)
- **부모혜택 연결**: retirement-health-insurance, retirement-health-insurance-comparison → **현재 이 둘이 insurance-comparison(4대보험 비교)에 잘못 연결됨. 이 계산기로 교체**(깔때기 정확도 개선).

## 3. 본인부담상한제 환급 계산기 (⏰ 8월 시즌 임박)
- **카테고리**: 세금(tax) / **slug**: `copay-ceiling` / URL: `/calc/tax/copay-ceiling/`
- **입력**: 소득분위(1~10분위 또는 건강보험료 수준으로 추정), 연간 본인부담 의료비(만원), (옵션)요양병원 120일 초과 여부
- **출력**: 본인부담상한액 + 예상 환급액(상한 초과분)
- **로직**: **소득분위별 본인부담상한액(2026)** 룩업 → 의료비 − 상한액 = 환급액. 요양병원 장기입원(120일 초과)은 별도 상한.
- **🔴 데이터 검증**: 건강보험공단 2026 **분위별 본인부담상한액 표** WebFetch. 매년 변경.
- **면책**: "참고용, 정확한 환급은 건강보험공단 ☎1577-1000"
- **난이도**: 중
- **⏰ 타이밍**: 본인부담상한제 환급 신청이 **8월경** → 검색 폭발. 8월 색인 맞추려면 6~7월 제작. 늦으면 가치 급감(내년 8월로).
- **부모혜택 연결**: health-insurance-limit

---

## 제작 순서
1. **주택연금** (꾸준, 시즌 무관) 또는 **본인부담상한제**(8월 임박이면 먼저)
2. 건강보험료(지역가입자)
3. 본인부담상한제 (8월 전)

상세 배경: 메모리 `project_jptcalc_calc_candidates`, SOP `calc-registry-refactor.md §4`.

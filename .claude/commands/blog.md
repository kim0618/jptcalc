---
description: 제이퍼 계산기 블로그 글 작성 (네이버 타겟 큐 기반 주제 선정, 파일 생성 + index + sitemap 업데이트)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 블로그 글 작성

## 편수 원칙 (최우선)
- **사용자가 명시하지 않으면 반드시 1편만 작성한다.**
- 사용자가 "5개", "3편" 등 명시한 경우에만 그 수를 따른다.
- 절대로 자의적으로 편수를 늘리지 않는다.

## 네이버 타겟 큐 신선도 체크 (글 작성 전 최우선)

글 작성을 시작하기 전에 **반드시 먼저** 아래 3가지 트리거를 점검한다. **하나라도 걸리면 글을 바로 쓰지 말고, 사용자에게 필요한 정보를 요청한다.** (셋 다 통과하면 묻지 않고 바로 작성)

| # | 트리거 (이 조건이면 멈추고 요청) | 사용자에게 요청할 정보 | 받은 뒤 할 일 |
|---|---|---|---|
| **A. 큐 신선도** | 최종갱신일로부터 **21일 이상**(2026-08-31까지 급성장기, 이후 30일) 경과 **또는** 미사용 주제 **3개 미만** | 네이버 서치어드바이저 > 리포트의 **검색어 TOP 30 + 웹문서 TOP 30 캡처** | 큐 갱신(새 승자 추가 / 완료 주제 제거 / 노출↑·CTR↓ 페이지를 제목최적화 대상에) + `최종갱신`을 오늘로 + **아래 "네이버 서치어드바이저 갱신 이력" 표 맨 위에 한 줄 추가(누적)** |
| **B. 클러스터 성과 점검** | 아래 "클러스터 진행 현황"의 **성과 점검 예정일**이 지났다 | `/report` 실행 가능하면 직접 / 안 되면 **GA4 또는 서치콘솔의 해당 클러스터 글 노출·클릭 데이터** | 먹힌 클러스터 → 위성 글 추가(더블다운), 안 먹힌 클러스터 → 다음 클러스터로 전환. 현황 블록 갱신 |
| **C. 클러스터 소진** | 현재 진행 클러스터의 위성 주제를 다 썼다(미사용 0) | (정보 불필요) 다음 클러스터 후보를 제시하고 사용자 확인 | 새 클러스터 시작, 현황 블록에 시작일·성과점검 예정일 기록 |

**요청 문구 예시 (A):** "네이버 타겟 큐가 [최종갱신일] 기준이라 갱신이 필요합니다. 서치어드바이저 리포트에서 검색어 TOP30 + 웹문서 TOP30 캡처를 주시면 갱신 후 작성하겠습니다."
**요청 문구 예시 (B):** "[클러스터명] 클러스터 완성 4주가 지나 성과 점검 시점입니다. /report를 돌리거나 서치콘솔 데이터를 주시면, 먹혔는지 보고 더블다운할지 다음으로 넘어갈지 정하겠습니다."

### 📌 다음 1편 우선 지정 (사용자 지정, 클러스터·Tier보다 최우선)

> 이 블록에 지정 항목이 있으면 **클러스터·네이버 큐보다 먼저** 이 1편을 쓴다. 작성 완료하면 이 블록을 비우고(또는 `[완료]` 표기) 평소 선정 순서로 복귀한다.

- **[지정 2026-06-23, 사용자] 청년미래적금 가이드 1편 (금융)** — ⏰ 시의성: 가입신청 **2026.7.3 마감** (D-day 짧음, 검색 피크기). 다음 작성 슬롯(2026-06-24)에서 바로 이 1편부터 쓸 것.
  - **주제/각도**: "청년도약계좌 vs 청년미래적금 - 갈아탈까 버틸까" (비교·갈아타기 키워드가 현재 최강 후크). 본문에 **일반형 vs 우대형 자격 3트랙**(중기재직·신규취업·소상공인)과 **갈아타기 절차 순서**(미래적금 가입신청·계좌개설 먼저 → 도약계좌 특별중도해지, 중복불가)를 반드시 포함. 체감 환산수익률(우대형 ~연 19%대) 설명 1섹션.
  - **제목 키워드 선두 배치**: "청년미래적금" + 2026. 예) `청년미래적금 vs 청년도약계좌 2026 - 갈아타기 조건·일반형 우대형 차이`
  - **연결 계산기(필수 양방향)**: `/calc/finance/youth-future-savings/` (cta-box + ARTICLE_INFO relatedCalc), 보조로 `/calc/finance/youth-leap-account/` 비교 링크
  - **파일명 제안**: `youth-future-savings-guide.html`
  - **교차링크(금융 기존글)**: savings-maturity-guide.html, five-year-seed-money.html, isa-guide.html 중 2~3개
  - **수치 출처**: 금융위(fsc.go.kr)·서민금융진흥원. ⚠️기여금 일반형6%/우대형12%, 한도 50만, 만기 3년, 기본금리 전은행 연5.0%·최고8%. 토스뱅크 페이지는 소상공인 매출 "4억"·우대금리 단독 오기라 출처 사용 금지. data-points §5.4-1 참조.
  - 작성 후: detail-shell guides 배열 추가 + `node scripts/inject-sibling.mjs` + `find-orphan-calcs.mjs` 재확인 (계산기 양방향)

### 클러스터 진행 현황 (글 선정 시 Tier 순서보다 우선)

진행 중인 클러스터가 있으면 **그 위성 주제를 큐에서 먼저 뽑는다.** 클러스터가 없거나 소진되면 Tier 1 승자 중 하나를 새 허브로 삼아 클러스터를 시작한다. (단, 위 "📌 다음 1편 우선 지정"이 있으면 그것이 최우선.)

- **완료 클러스터: 연봉(salary)** | 2026-06-01~06-03 완료 | **성과 점검 예정: 2026-07-06** (트리거 B 발동)
  - 허브: raise-rate-industry / 위성: raise-or-quit-guide · hourly-wage-guide · four-insurance-vs-33-comparison
- **완료 클러스터: 건강(health)** | 허브: weight-by-height-2026(2026-06-03) / 위성: bmi-guide(기존)
- **완료 클러스터: 국민연금(pension-welfare)** | 2026-06-05~06-08 완료 | **성과 점검 예정: 2026-07-06** (트리거 B)
  - 허브: national-pension-40years(06-05) / 위성: national-pension-early-receipt(조기수령·06-08)·national-pension-payment-exemption(납부예외·06-08)·national-pension-additional-payment(추납·06-08) | 임의가입은 national-pension-voluntary.html로 기커버
- **[완료 2026-06-08] 주택연금 신규 계산기 글(pension-welfare)** | housing-pension-guide.html. HF 2026 월지급금 예시표 기준. detail-shell guides + ARTICLE_INFO guides + 본문 CTA 양방향 연결 완료
- **진행 클러스터: 부동산 비용(realestate)** | 2026-06-21 서치어드바이저 갱신으로 시작 | 근거: "부동산 보유세 계산기"가 네이버 검색어 #1(클릭 93·CTR 9.1), realestate 계산기군이 웹문서 상위 다수 점유 = 최고 성과 카테고리. 보유세·취득세·중개수수료는 커버됐고 **등기비용이 빈칸** → 더블다운.
  - 위성 순서: ① registry-cost-guide(등기비용, Tier 1) → ② property-purchase-costs-guide(매매 부대비용 허브, Tier 2)
  - **성과 점검 예정: 2026-07-19** (트리거 B)
- **참고**: orphan 계산기 5종(copay-ceiling·stock-average·cat-age·food-amount·lunar-calendar)은 여전히 전용 블로그 0개 - 네이버 큐 소진 시 우선순위 ③로 폴백. (네이버 큐에는 넣지 않음)

## 네이버 타겟 주제 큐

**최종갱신: 2026-06-21** (출처: 네이버 서치어드바이저 검색어/웹문서 TOP 30)

### 📌 네이버 서치어드바이저 갱신 이력 (월 1회)

> 네이버 서치어드바이저 TOP30을 반영해 큐를 갱신할 때마다 **이 표 맨 위에 한 줄 추가**한다. 덮어쓰지 말 것(누적 이력). 위 `최종갱신` 날짜와 항상 일치시킨다.

| 갱신일 | 출처 캡처 | 큐 변경 요약 |
|---|---|---|
| 2026-06-21 | 검색어 TOP30 + 웹문서 TOP30 (최근30일 총클릭 2.9천·노출 29.5만, 전월비 +523%·+1318%, 평균 CTR 1%) | 기존 큐 사실상 전소진 확인(brokerage→realestate-agent-fee, api-token→chatgpt-api-cost 등으로 기커버 완료처리). 신규 승자 **등기비용**(registry, CTR 11.5) 추가 + 부동산 비용 클러스터 시작. 제목최적화에 **korean-age-system 블로그**(노출 7,116·CTR 0.7%) 신규 지정 |
| 2026-05-29 | 검색어 TOP30 + 웹문서 TOP30 | 기준 베이스라인 |

주제 선정 시 **이 큐를 카테고리 균형보다 우선**한다. 위에서부터 미사용 주제를 선택하고, 작성 완료한 주제 앞에 `[완료]`를 붙인다.

### Tier 1 - 네이버 검증된 신규 승자 (최우선)
1. 부동산 등기비용 계산기 2026 - 법무사 보수·취득세 포함 매매 시 등기 총비용 (키워드 "부동산 등기비용 계산기" 클릭 17·**CTR 11.5%** / calc/realestate/registry **전용 블로그 없음 = 신규 기회** / → registry-cost-guide.html)
   - 근거: 부동산 비용 클러스터의 빈칸. 보유세(holding-tax-guide)·취득세(acquisition-tax-2026)·중개수수료(realestate-agent-fee)는 커버됐으나 등기비용 전용 글이 없음. registry 계산기는 현재 realestate-agent-fee에서만 링크됨.

### Tier 2 - 부동산 비용 클러스터 확장 (보유세=네이버 #1 키워드, 더블다운)
2. [완료] 부동산 매매 부대비용 총정리 2026 - 취득세·등기비용·중개수수료·법무사 한눈에 (허브성 / acquisition+registry+brokerage 계산기 묶어 링크 / → property-purchase-costs-guide.html)
3. [완료 2026-06-26] 1인 가구 노후 필요자금·생활비 얼마 (키워드 "1인 노후자금 얼마" 클릭 12 / pension-welfare/retirement-living 연결 / → single-household-retirement-guide.html) - 1인가구 특화(적정 192만·부부 1인당 대비 +44만)·30/40/50대 연령대별 목표액·의료간병 1.5억으로 차별화하여 작성, 기존 retirement-living-cost(부부)·late-start(나이별)와 비중복 확인

> 이전 큐(연봉인상률·표준체중·보유세·국민연금40년·API토큰·중개수수료·BMI·날짜차이·D-day 등)는 전부 작성 완료. 완료 이력은 아래 "클러스터 진행 현황"에 보존. brokerage(중개수수료)는 realestate-agent-fee, api-token은 chatgpt-api-cost/claude-vs-gpt/llm-api-price-comparison로 기커버 완료처리됨.

### 제목 최적화 대상 (월 1회 점검, 메타 쿨다운 4주 준수)
노출 많은데 CTR 낮은 페이지를 네이버 검색어에 맞춰 제목 갱신. 변경 전 `git blame`으로 4주 쿨다운 확인.
- [2026-05-29 완료] 만나이(date/age), 시급(salary/hourly-wage), 날짜차이(date/date-difference)
- **[2026-06-21 신규 지정] korean-age-system 블로그** (노출 7,116·CTR 0.7% = 이번 회차 최대 기회): "만 나이 계산법 2026"을 제목 앞부분에 배치하도록 갱신. 키워드 "만 19세 계산방법" CTR 42.9%가 만나이 실수요를 입증. (5/29에 만나이 *계산기*는 최적화했으나 이 *블로그*는 미최적화 / 블로그 메타 쿨다운 확인 후 진행)
- **내부링크 리프트(제목보다 순위 문제)**: 고노출·저CTR이나 제목이 이미 양호한 계산기 - salary/hourly-wage(6,117·0.9%), salary/index(4,219·0.9%), health/ideal-weight(4,002·1.3%), pension-welfare/national-pension(3,385·1.3%). 제목 손대지 말고 상위 글(weight-by-height-2026·raise-rate-industry 등)에서 내부링크를 추가해 순위를 페이지1로 끌어올린다.

## 사전 확인
1. `ls /home/tjd618/jptcalc/blog/posts/` 로 기존 포스트 파일 목록 전체 확인
2. `ls /home/tjd618/jptcalc/calc/` 및 하위 폴더 확인해서 사용 가능한 계산기 URL 파악
3. `/home/tjd618/jptcalc/blog/index.html` 에서 data-cat 개수를 세서 카테고리별 글 수 확인
4. **주제 선정 우선순위: ① 진행 중 클러스터의 위성 주제 → ② 네이버 타겟 큐 Tier 순서 → ③ (큐 비었거나 사용자 지정 시) 블로그 글이 아직 없는 신규 계산기 우선 → ④ 글 적은 카테고리.** "클러스터 진행 현황" 블록에 진행 중 클러스터가 있으면 그 위성을 먼저 뽑아 클러스터를 채운다.
   - **③ 신규 계산기 미커버 우선순위**: 네이버 큐 소진 시, 블로그 글이 0개인 신규 계산기부터 글을 쓴다. **대상 목록은 하드코딩하지 말고 `node scripts/find-orphan-calcs.mjs`를 실행해 "연결된 블로그가 없는 계산기"를 그때그때 받아온다** (계산기가 새로 추가되면 자동으로 이 목록에 잡힘). 데이터랩 검증 수요가 높은 것부터(예: 생활·도구 글자수세기·내신등급) 고른다. 각 글은 cta-box·relatedCalc·해당 detail-shell guides로 그 계산기에 유입을 연결한다. (네이버 큐 자체에는 서치어드바이저 검증 주제만 넣고, 이 신규 계산기 주제는 큐에 넣지 않는다.)
5. 기존 글과 겹치지 않는 주제를 선정하고, 큐 주제에 연결된 계산기와 본문에서 링크
6. 기존 포스트 파일 1개 읽어서 해당 카테고리의 포맷·색상 정확히 파악
   - **반드시 헤더·footer 크롬이 정상인 글을 템플릿으로 복사한다** (예: `dog-monthly-cost.html`). 헤더 없는 구버전 글을 베끼면 헤더 누락이 전파된다. 의심되면 `node scripts/check-post-chrome.mjs`로 후보 글 상태를 먼저 확인.
7. **같은 카테고리 기존 글 목록 확인** - 본문 내 교차 링크용 (2~3개 선정)

### 시의성 체크 (주제 선정 전 필수)
- 오늘 날짜 기준 **3개월 이상 미래의 이벤트**를 주제로 하지 않는다.
- **이미 지난 이벤트**를 "올해" 기준으로 쓰지 않는다.
- 시의성 있는 주제는 현재 시점에서 1~2개월 내 실제 필요한 내용이어야 한다.

사용자가 카테고리나 주제를 지정하면 그것을 따르고, 지정하지 않으면 위 기준으로 자동 선정한다.

글 작성 후 해당 계산기의 detail-shell.js guides 배열에 블로그 URL을 추가한다.

---

## 포스트 파일 작성 기준
파일 위치: `/home/tjd618/jptcalc/blog/posts/[영문-소문자-하이픈].html`

### head 영역
- charset UTF-8, viewport
- title: "|제이퍼 계산기 블로그" 포함. **네이버 타겟 큐의 키워드를 제목 앞부분에 그대로 넣는다** (예: 타겟이 "연봉인상률"이면 제목 앞에 "연봉인상률" 포함). 연식(2026)을 붙이면 네이버 CTR에 유리.
- meta description (120~155자, 핵심 키워드 포함)
- og:type=article, og:title, og:description, og:url, og:image, twitter:image
- og:image = https://www.jptcalc.kr/android-chrome-512x512.png
- canonical = https://www.jptcalc.kr/blog/posts/[파일명].html
- favicon: ../../assets/logo.svg
- 광고: 애드센스 디스플레이 로더는 head에 넣지 않는다(애드센스 폐기). 대신 **카카오 애드핏 슬롯 2개를 본문에 반드시 삽입**한다(기존 글 전체 동일 구조). 두 슬롯은 unit ID만 다르고 나머지 코드는 동일하다.
  - **① 상단 슬롯** (unit `DAN-IE2keARtehW1pRBT`): 목차형 요약 리스트(`</ul>`) 직후, 첫 콘텐츠 h2 직전.
  - **② 본문중간 슬롯** (unit `DAN-88xhdLeiIK3V35kb`): 글 h2의 **중간 순번 h2 직전**. 단 FAQ("자주 묻는/나오는 질문")·마무리 섹션 앞은 피하고, 그런 위치면 그 다음 본문 콘텐츠 h2 앞으로 옮긴다. 상단 슬롯과 최소 2개 섹션 이상 떨어뜨린다. **하단(CTA/마무리)에는 광고를 넣지 않는다** - 계산기 전환 구간이므로 광고 청정구역.

```html
<!-- ① 상단: 목차 직후 -->
<div class="adfit-slot" style="text-align:center;margin:28px 0">
  <ins class="kakao_ad_area" style="display:none" data-ad-unit="DAN-IE2keARtehW1pRBT" data-ad-width="300" data-ad-height="250"></ins>
  <script async type="text/javascript" src="//t1.kakaocdn.net/kas/static/ba.min.js"></script>
</div>

<!-- ② 본문중간: 중간 h2 직전 (FAQ/마무리 회피) -->
<div class="adfit-slot" style="text-align:center;margin:28px 0">
  <ins class="kakao_ad_area" style="display:none" data-ad-unit="DAN-88xhdLeiIK3V35kb" data-ad-width="300" data-ad-height="250"></ins>
  <script async type="text/javascript" src="//t1.kakaocdn.net/kas/static/ba.min.js"></script>
</div>
```
- GA: G-BRSX3F10MZ
- Pretendard 폰트 CDN
- **Article JSON-LD** + **FAQPage JSON-LD** 모두 `<head>` 안에 배치 (아래 JSON-LD 섹션 참고)

### 카테고리별 post-tag CSS 색상 및 --primary (인라인 style로 각 포스트 파일에 작성)
- 부동산: --primary #F59E0B, post-tag background rgba(245,158,11,0.15) color #F59E0B, highlight-box background rgba(245,158,11,0.1) text-color #92400E
- 세금: --primary #10B981, post-tag background rgba(16,185,129,0.15) color #10B981, highlight-box background rgba(16,185,129,0.08) text-color #065F46
- 금융: --primary #6366F1, post-tag background rgba(99,102,241,0.15) color #6366F1, highlight-box background rgba(99,102,241,0.08) text-color #3730A3
- 연봉: --primary #3B82F6, post-tag background rgba(59,130,246,0.15) color #3B82F6, highlight-box background rgba(59,130,246,0.08) text-color #1E40AF
- 건강: --primary #10B981, post-tag background rgba(16,185,129,0.15) color #10B981, highlight-box background rgba(16,185,129,0.08) text-color #065F46
- 반려동물: --primary #F472B6, post-tag background rgba(244,114,182,0.15) color #F472B6, highlight-box background rgba(244,114,182,0.08) text-color #9D174D
- 날짜·D-day: --primary #F97316, post-tag background rgba(249,115,22,0.15) color #F97316, highlight-box background rgba(249,115,22,0.08) text-color #9A3412
- AI·테크: --primary #8B5CF6, post-tag background rgba(139,92,246,0.15) color #8B5CF6, highlight-box background rgba(139,92,246,0.08) text-color #5B21B6
- 연금·복지: --primary #0EA5E9, post-tag background rgba(14,165,233,0.15) color #0EA5E9, highlight-box background rgba(14,165,233,0.08) text-color #0C4A6E
- 생활·도구: --primary #14B8A6, post-tag background rgba(20,184,166,0.15) color #14B8A6, highlight-box background rgba(20,184,166,0.08) text-color #0F766E

cta-btn 배경색과 td.rate 색상도 각 카테고리의 --primary와 동일하게 적용한다.
인라인 계산기 링크의 color도 반드시 해당 카테고리의 --primary 색상을 사용한다. (#2563eb 같은 임의 색상 사용 금지)

---

## 콘텐츠 퀄리티 기준 (핵심)

### 텍스트 분량
- HTML 태그·CSS·스크립트를 제외한 **순수 텍스트 15,000자 이상** 작성 (Bash로 반드시 측정)
- 13,000자 미만은 얇은 글(thin content)로 간주해 섹션을 추가해서 보강
- 분량을 채우기 위한 중복·반복 문장 금지 - 내용이 없으면 새 섹션을 추가할 것
- 15,000자를 못 채우겠으면 주제 범위를 넓히거나 시나리오를 추가

### 계산 예시 (3~4개 필수)
단순 수치 나열이 아닌 **인물·상황 기반 시나리오**로 작성한다.
- 예) "연봉 4,200만 원 직장인 A씨(35세, 부양가족 1명)의 경우"
- 예) "전용 84㎡ 아파트를 6억에 취득한 경우 vs 9억에 취득한 경우"
- 금액·조건을 달리한 **대조 시나리오** 2개 이상 포함
- 모든 수식은 반드시 검산하고 검산 결과를 본문에 간단히 명시
- **"그래서 뭐가 달라지는데"까지 연결**: 계산 결과만 나열하지 말고, 그 차이가 독자의 의사결정에 어떤 영향을 주는지 1~2문장 추가
  - 예) "이 차이를 월로 환산하면 매달 73만원을 무상 노동하는 것과 같습니다"
  - 예) "연봉 협상에서 500만원을 더 받는 것보다 야근 1시간을 줄이는 게 시급 기준으로 더 이득입니다"

### 비교표 (2개 이상 필수)
- 단순 설명표 금지 - **실제 수치가 들어간 데이터 표**여야 한다
- 예) "월 10만 원 저축 시 1년·3년·5년·10년 후 금액" 같은 구체 수치 표
- 첫 번째 표: 핵심 수치 비교 / 두 번째 표: 상황별·조건별 비교

### FAQ (4개 필수)
- 각 답변 **4~5문장 이상**, 구체적 수치나 기준 포함
- "~일 수 있습니다", "~하는 경우도 있습니다" 같은 일반론 금지
- 독자가 실제로 궁금해할 만한 엣지케이스·예외상황 위주로 구성
- 마지막 FAQ는 계산기 활용과 자연스럽게 연결되는 내용으로

### 출처 링크 (1~2개 필수)
본문 내 자연스럽게 삽입:
- 세금: 국세청(nts.go.kr), 홈택스(hometax.go.kr)
- 부동산: 국토교통부(molit.go.kr), 한국부동산원(reb.or.kr)
- 금융: 금융감독원(fss.or.kr), 예금보험공사(kdic.or.kr), 한국은행(bok.or.kr)
- 연봉: 고용노동부(moel.go.kr), 통계청(kostat.go.kr)
- 연금·복지: 국민연금공단(nps.or.kr), 국민건강보험공단(nhis.or.kr), 통계청(kostat.go.kr)
- 건강: 질병관리청(kdca.go.kr), 보건복지부(mohw.go.kr)
- 반려동물: 농림축산식품부(mafra.go.kr)
- AI·테크: 각 서비스 공식 페이지
- 날짜: 한국천문연구원(kasi.re.kr), 인사혁신처

### 신뢰 시그널 강화 (필수)
기관 링크만으로는 부족하다. 아래 3가지 중 **2개 이상** 본문에 포함해야 한다.
1. **법률·고시명 인용**: "근로기준법 제56조에 따르면~", "국세청 간이세액표(2026년 1월 고시) 기준~"
2. **공식 통계 인용**: 기관명 + 연도 + 구체 수치 (예: "2025년 고용노동부 임금구조기본통계조사에 따르면 중위 월급 297만원")
3. **계산 근거 명시**: "~에 따르면" 형식으로, "일반적으로~" 같은 모호한 표현 대체

### 내부 교차 링크 (2~3개 필수)
- 같은 카테고리의 기존 블로그 글을 **2~3개** 본문 내 자연스럽게 링크
- 링크 형식: `<a href="../posts/[파일명].html" style="color:[--primary색상];">[앵커 텍스트]</a>`
- 본문 흐름에서 자연스러운 위치에 삽입 (억지로 끼워 넣지 않는다)
- 기존 글이 부족한 카테고리는 연관 카테고리 글로 대체

### 부모혜택 사이트 연결 (해당 시 삽입)
부모·시니어·노후 관련 주제와 자연스럽게 연결되는 글에만 부모혜택(bumohyetaek.kr) 링크를 삽입한다. 모든 글에 넣지 않는다.

**연결 가능한 카테고리 매핑:**
- 건강 → 부모혜택 건강·의료 글 (예: 건강검진, 혈압, BMI 관련)
- 금융 → 부모혜택 재무 안전 글 (예: 예금, 노후 자금, 보험 관련)
- 세금 → 부모혜택 세금 혜택 글 (예: 연금소득세, 의료비 공제)
- 연봉 → 부모혜택 연금·복지 글 (예: 퇴직금, 실업급여)

**삽입 위치:** 본문 중간~후반부, 관련 내용이 나오는 문맥에서 한 번만.
**링크 형식:**
```html
<a href="https://www.bumohyetaek.kr/guide/[슬러그]" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin:20px 0;text-decoration:none;">
  <span style="font-size:28px;line-height:1">👨‍👩‍👧</span>
  <div style="flex:1;min-width:0">
    <div style="font-size:11px;font-weight:700;color:#10B981;margin-bottom:3px;letter-spacing:0.3px">부모님께도 알려드리세요</div>
    <div style="font-size:14px;font-weight:700;color:#111827;line-height:1.4">[부모혜택 글 제목]</div>
  </div>
  <span style="font-size:18px;color:#10B981;flex-shrink:0">→</span>
</a>
```

**연결 전 확인 사항:**
- 해당 글의 주제가 부모·시니어·가족과 접점이 있는지 판단 (접점 없으면 삽입하지 않는다)
- 부모혜택 사이트의 실제 글 슬러그를 확인해서 정확한 URL 작성 (`ls /home/tjd618/bumohyetaek/src/data/articles/`)
- 강제로 끼워 넣지 않는다. 문맥상 자연스러운 경우에만 삽입

### SVG 인포그래픽 (1개 필수)
본문 핵심 데이터를 시각화하는 **인라인 SVG** 1개를 삽입한다.

**삽입 위치:** 첫 번째 비교표 바로 아래 또는 핵심 비교 섹션 내
**크기:** width="100%" viewBox="0 0 680 적절높이", 최대 높이 400px
**스타일:** 글의 --primary 색상과 통일, 둥근 모서리(rx), 깔끔한 라벨

**적합한 유형 (주제에 따라 선택):**
- **수평 막대 비교:** 금액·비율 비교 (예: 실수령액 비교, 세율 비교)
- **원형 비율:** 비용 구성 비율 (예: 양육비 항목별 비중)
- **타임라인:** 시간 흐름에 따른 변화 (예: 연도별 추이, 나이별 변화)
- **비교 카드:** 두 옵션의 장단점 대비 (예: 전세 vs 월세)

**SVG 작성 규칙:**
- 반드시 `<div style="margin:24px 0;overflow-x:auto">` 로 감싸기
- 텍스트는 font-family="Pretendard, sans-serif" 사용
- 색상: --primary (강조), #6B7280 (보조 텍스트), #F3F4F6 (배경), #111827 (레이블)
- 반응형: viewBox 사용, width="100%" 고정
- 접근성: `role="img"` + `<title>` 태그 포함
- 데이터는 본문의 비교표/계산 예시와 일치해야 함

**SVG 코드 예시 (수평 막대 비교):**
```html
<div style="margin:24px 0;overflow-x:auto">
<svg role="img" width="100%" viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg">
  <title>항목 비교 차트</title>
  <rect width="680" height="160" rx="12" fill="#F9FAFB"/>
  <text x="24" y="36" font-size="14" font-weight="800" fill="#111827" font-family="Pretendard,sans-serif">비교 제목</text>
  <text x="24" y="72" font-size="13" fill="#6B7280" font-family="Pretendard,sans-serif">항목 A</text>
  <rect x="120" y="58" width="340" height="22" rx="4" fill="var(--primary)" opacity="0.8"/>
  <text x="468" y="74" font-size="13" font-weight="700" fill="#111827" font-family="Pretendard,sans-serif">3,400만원</text>
  <text x="24" y="112" font-size="13" fill="#6B7280" font-family="Pretendard,sans-serif">항목 B</text>
  <rect x="120" y="98" width="250" height="22" rx="4" fill="#D1D5DB"/>
  <text x="378" y="114" font-size="13" font-weight="700" fill="#111827" font-family="Pretendard,sans-serif">2,500만원</text>
</svg>
</div>
```

### 목차형 요약 리스트 (필수, 도입부 직후)
highlight-box 바로 다음에 "이 글에서 확인할 수 있는 것" 리스트를 삽입한다.
독자가 스크롤할 이유를 만들어주고, 검색 스니펫 노출 확률을 높인다.
```html
<ul style="background:#F9FAFB;padding:16px 20px 16px 36px;border-radius:10px;margin:16px 0;font-size:14px;color:#374151;line-height:1.8">
  <li>항목 1 - 핵심 수치가 포함된 구체적 내용</li>
  <li>항목 2</li>
  <li>항목 3</li>
  <li>항목 4</li>
</ul>
```
- 4~6개 항목, 각 항목에 구체 수치나 키워드 포함
- "~란?", "~정리" 같은 추상적 항목 금지. "연봉 3,000~1억 구간별 시급 환산표"처럼 구체적으로

### 반전 비교 섹션 (1개 필수)
독자의 기존 상식을 뒤집는 비교 데이터를 **반드시 1개** 포함한다. 이 섹션이 공유와 체류시간을 만든다.
- 예) "연봉 5,000만원인데 시급은 편의점 알바보다 낮을 수 있다"
- 예) "복리 연 5% 수익인데 물가+세금 빼면 실질 0%대"
- 예) "종부세보다 재산세가 더 많은 구간이 있다"
- h2 제목 패턴: "~인 줄 알았는데", "여기서 함정이 있다", "~보다 ~가 더 ~하다"
- 반드시 수치 근거를 함께 제시 (주장만 하지 않는다)

### 마무리 섹션 (필수)
- h2 제목은 "마무리" 고정하지 않고 매번 다르게 (이건 rewrite 스킬의 규칙과 동일)
- 요약 문단 **4문장 이상**
- **핵심 숫자 1개를 다시 한 번 강조** (예: "연봉 4,200만원의 실질 시급은 13,834원이었습니다")
- 계산기 활용 권유로 자연스럽게 마무리

---

## 페이지 크롬 (헤더·footer, 필수)

모든 글은 `<body>` 바로 다음에 헤더, 스크립트 직전에 footer fallback을 넣는다. 인라인 `<style>`에 헤더·footer CSS도 함께 포함(정상 글 복사 시 자동 포함됨).

**헤더 (`<body>` 직후):**
```html
<header class="site-header">
  <div class="header-inner">
    <a href="../../" class="site-logo"><div class="logo-icon"><img src="../../assets/logo.svg" alt="로고"/></div><span class="logo-text">제이퍼<span>계산기</span></span></a>
    <a href="../" class="header-back">← 블로그 목록</a>
  </div>
</header>
```
- 로고는 **공백 없이** `제이퍼<span>계산기</span>` (`제이퍼 <span>` 처럼 공백 들어가면 안 됨)

**footer (하단 스크립트 직전):**
```html
<footer class="site-footer"><p class="footer-copy">&copy; 2026 제이퍼 계산기 - 본 내용은 참고용입니다.</p></footer>
```

## 본문 구성 순서

1. 도입 문단 (2~3문장, 독자의 문제 상황 공감)
2. highlight-box (이 글이 필요한 사람 명시)
3. **목차형 요약 리스트** (이 글에서 확인할 수 있는 것 4~6개, 아래 형식)
4. h2/h3 섹션 + 데이터 비교표
5. 인물·상황 기반 계산 예시 (highlight-box 활용)
6. 본문 중간 인라인 계산기 링크
7. **반전 비교 섹션** (독자 상식을 뒤집는 데이터 비교 h2)
8. 추가 h2 섹션 + 두 번째 비교표
9. **같은 카테고리 기존 글 교차 링크** (문맥 내 자연 삽입)
10. cta-box (관련 계산기 버튼)
11. 관련 계산기 링크 p태그 (style="font-size:13px;color:#6B7280;margin-top:8px;")
12. faq-item 4개
13. 마무리 h2 단락

---

## 자연스러운 글쓰기 (AI 티 제거)

기존 글이 전부 동일 구조/문체면 네이버·검색엔진과 카카오 애드핏의 AI 필터가 자동 생성 콘텐츠로 판단할 수 있다.
**새 글은 아래 규칙을 반드시 적용해서 글마다 다르게 쓴다.**

### 구조 다양화
- 본문 구성 순서(도입→표→시나리오→FAQ→마무리)를 **글마다 셔플**한다
  - 어떤 글은 시나리오로 시작, 어떤 글은 핵심 수치 결론부터
  - 비교표가 먼저 오는 글도 있고, 설명 후 표가 오는 글도 있어야 함
- highlight-box 위치를 고정하지 않는다. 중간에 쓰기도 하고, 아예 안 쓸 수도 있다
- FAQ 개수: **3~5개 랜덤**. 매번 4개 고정하지 않는다

### 문체 다양화
- **도입부 패턴을 5가지 이상 돌려쓴다:**
  1. 질문으로 시작: "혹시 ~해본 적 있으신가요?"
  2. 결론 먼저: "결론부터 말하면, ~입니다."
  3. 상황 묘사: "계약서에 사인하기 직전, 갑자기 ~"
  4. 통계/팩트: "2026년 기준 ~는 00만원입니다."
  5. 반전: "~라고 생각하기 쉽지만, 실제로는 ~"
- **"~정리합니다", "~알아보겠습니다" 남발 금지** - 전체 글에서 1회 이하
- 중간중간 **짧은 문장**(10자 이하)을 섞는다: "핵심은 이겁니다.", "답은 간단합니다."
- 일부 섹션에서 **필자의 판단/의견**을 넣는다: "개인적으로는 ~가 더 낫다고 봅니다"
- 독자에게 말을 거는 톤을 섞는다: "여기서 주의할 점이 하나 있는데요."

### 반복 패턴 회피
- 직전 3개 글의 도입부 패턴을 확인하고 **다른 패턴** 사용
- h2 제목 스타일도 다양하게: "~란?", "~하는 법", "~비교", "~의 진실", "왜 ~인가"
- 마무리 섹션도 항상 "마무리"가 아니라 "정리하면", "한 줄 요약", "체크리스트" 등으로

---

## 글쓰기 금지사항
- em dash(—) 사용 금지, 하이픈(-) 사용
- "계산기으로" 사용 금지, "계산기로"가 올바른 표현
- "공인인증서" 사용 금지, "공동인증서"로 작성 (2020년 변경됨)
- 인라인 링크에 임의 색상(#2563eb 등) 사용 금지, 반드시 카테고리 --primary 색상 사용
- 3개월 이상 미래 이벤트 기반 글 작성 금지
- 수치 없는 추상적 설명 섹션 금지 ("중요합니다", "필요합니다" 수준의 내용만 있으면 삭제)
- 같은 내용을 다른 표현으로 반복하는 패딩 문장 금지

## CTA 링크 규칙
- cta-btn의 href는 반드시 **구체적인 계산기 URL** 사용 (예: ../../calc/health/bmi/)
- 카테고리 index 페이지(../../calc/health/)로 링크하지 않는다
- 해당 주제에 정확히 맞는 계산기가 없는 경우에만 카테고리 index 허용

---

## JSON-LD 구조화 데이터 (head 안에 배치, 필수)

### Article JSON-LD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "글 제목 (title에서 | 제이퍼 계산기 블로그 제외)",
  "description": "meta description과 동일",
  "author": { "@type": "Organization", "name": "제이퍼 계산기", "url": "https://www.jptcalc.kr" },
  "publisher": { "@type": "Organization", "name": "제이퍼 계산기", "url": "https://www.jptcalc.kr", "logo": { "@type": "ImageObject", "url": "https://www.jptcalc.kr/android-chrome-512x512.png" } },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "canonical URL" },
  "image": "https://www.jptcalc.kr/android-chrome-512x512.png",
  "articleSection": "카테고리 한글명",
  "inLanguage": "ko"
}
</script>
```

### FAQPage JSON-LD
FAQ 항목은 본문 faq-item과 **문장 단위로 정확히 동일**한 Q&A.

**불일치 자주 나는 패턴 (모두 금지):**
- JSON-LD에만 괄호 부연설명 추가 (예: JSON-LD `장모종(말티즈, 푸들)은` vs HTML `장모종은`)
- JSON-LD에만 마지막 문장 추가 (예: `~합리적입니다. 기존 질환은 보장에서 제외됩니다.` vs HTML `~합리적입니다.`)
- 한쪽만 단어 수정 (예: JSON-LD `급격한 사료 변경은` vs HTML `급격한 변경은`)

**작성 순서 강제:** 본문 faq-item HTML을 먼저 확정 → JSON-LD는 **복사-붙여넣기 후 따옴표 처리만 변경**. 절대 따로 쓰지 말 것.
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "질문1", "acceptedAnswer": { "@type": "Answer", "text": "답변1" } },
    { "@type": "Question", "name": "질문2", "acceptedAnswer": { "@type": "Answer", "text": "답변2" } },
    { "@type": "Question", "name": "질문3", "acceptedAnswer": { "@type": "Answer", "text": "답변3" } },
    { "@type": "Question", "name": "질문4", "acceptedAnswer": { "@type": "Answer", "text": "답변4" } }
  ]
}
</script>
```

---

## 하단 스크립트

### ARTICLE_INFO_CONFIG (필수 필드)
```html
<script>
window.ARTICLE_INFO_CONFIG = {
  author: "제이퍼 계산기 편집팀",
  reviewBasis: "관련 법령/기관, 2026년 기준",
  basisDate: "2026년 기준",
  referenceOrg: "관련 기관명",
  lastReviewed: 'YYYY.MM.DD',
  disclaimer: "본 내용은 참고용이며...",
  relatedCalc: { name: '계산기명', url: '/calc/카테고리/계산기/' },
  category: '카테고리영문'
};
</script>
<script src="/assets/blog-article-info.js"></script>
<script src="/assets/footer-unified.js" defer></script>
<script src="/assets/blog-review-footer.js" defer></script>
```

### post-meta 날짜
오늘 날짜를 YYYY.MM.DD 형식으로 사용한다.

### category 값 매핑
- 부동산=realestate, 세금=tax, 금융=finance, 연봉=salary, 건강=health, 연금·복지=pension-welfare, 반려동물=pet, 날짜·D-day=date, AI·테크=ai, 생활·도구=tools

---

## 후속 작업 (파일 작성 후 반드시 진행)

### 1. blog/index.html 카드 추가
- 카드 포맷: `<a href="./posts/[파일명].html" class="post-card" data-cat="[카테고리명]">`
- 카테고리별 tag 클래스: 부동산=tag-realestate / 세금=tag-tax / 금융=tag-finance / 연봉=tag-salary / 건강=tag-health / 연금·복지=tag-pension-welfare / 반려동물=tag-pet / 날짜·D-day=tag-date / AI·테크=tag-ai / 생활·도구=tag-tools
- 최신 글이 목록 상단(post-grid 바로 아래)에 오도록 배치

### 2. sitemap.xml 업데이트
- `<loc>https://www.jptcalc.kr/blog/posts/[파일명].html</loc>`
- `<lastmod>오늘날짜(YYYY-MM-DD)</lastmod>`
- `<changefreq>monthly</changefreq>`
- `<priority>0.7</priority>`

### 2-1. 계산기 양방향 연결 (글이 계산기를 다루면 필수)
글→계산기, 계산기→글 양쪽을 모두 잇는다. 신규 계산기 글(우선순위 ③)이면 특히 빠짐없이.
1. **글→계산기**: 본문 cta-box href + `ARTICLE_INFO_CONFIG.relatedCalc.url` 을 정확한 `/calc/{cat}/{slug}/` 로 지정 (실제 폴더 존재 `ls`로 확인)
2. **계산기→글**: 해당 카테고리 `assets/{cat}-detail-shell.js` 의 그 계산기 `guides` 배열에 `['/blog/posts/[파일명].html','글 제목']` 형식으로 새 글 1줄 추가 (배열 맨 앞에)
3. **sibling-section 재생성**: `node scripts/inject-sibling.mjs` 실행 (계산기 페이지 하단 크롤러용 "관련 가이드"에 새 글 반영)
4. **고아 해소 확인**: `node scripts/find-orphan-calcs.mjs` 다시 실행 → 방금 다룬 계산기가 목록에서 빠졌는지 확인

### 3. 작성 후 자체 검증 (필수)
```
검증 항목:
□ HTML 태그 제거 후 순수 텍스트 15,000자 이상인지 확인 (13,000 미만이면 반드시 보강)
  - Bash: cat 파일.html | sed 's/<[^>]*>//g' | tr -s ' \n' | wc -c
□ 목차형 요약 리스트 포함 여부 (도입부 직후)
□ 반전 비교 섹션 1개 포함 여부
□ 계산 예시 3개 이상, 수식 검산 완료, 의사결정 연결 문장 포함
□ 비교표 2개 이상 (실제 수치 포함)
□ SVG 인포그래픽 1개 포함 여부 확인
□ FAQ 4개, 각 답변 4문장 이상
□ 신뢰 시그널 2개 이상 (법조문/고시명/공식통계 중)
□ 교차 링크 파일이 실제 존재하는지 확인 (ls)
□ Article + FAQPage JSON-LD 모두 <head> 안에 있는지 확인
□ FAQPage JSON-LD 각 답변 텍스트가 본문 faq-item과 **문장 단위 정확히 일치**하는지 (괄호·마지막 문장 차이 금지)
□ em dash(—), "계산기으로", "공인인증서" grep 체크
□ CTA 계산기 URL 실제 존재 확인 (ls)
□ 마무리 h2 제목이 "마무리"가 아닌 다른 표현인지 확인
□ 카카오 애드핏 슬롯 2개 포함 여부 - ①상단(DAN-IE2k, 목차 직후) ②본문중간(DAN-88xhd, 중간 h2 앞, FAQ/마무리 회피). 하단 CTA엔 광고 없어야 함
□ **공통 크롬 검증: `node scripts/check-post-chrome.mjs` 실행** (헤더·필수 스크립트 누락, 로고 공백 오타 자동 검출. 전 글 통과해야 함)
```

### 4. 결과 요약
모든 작업 완료 후 추가/수정한 파일 목록, 텍스트 글자 수, 주요 섹션 구성을 요약해서 알려준다.


## 완료 후 로그 기록

스킬 실행이 완료되면 반드시 아래 명령으로 `skill-log.json`에 기록한다:

```bash
python3 -c "import json,datetime; logs=json.load(open('/home/tjd618/skill-log.json')); now=datetime.datetime.now(); logs.insert(0,{'date':now.strftime('%Y-%m-%d'),'time':now.strftime('%H:%M'),'project':'jptcalc','skill':'blog'}); open('/home/tjd618/skill-log.json','w').write(json.dumps(logs,ensure_ascii=False,indent=2))"
```

$ARGUMENTS

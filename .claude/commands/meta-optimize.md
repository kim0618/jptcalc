---
description: jptcalc 블로그/카테고리 meta title·description 최적화 (CTR 개선, 클릭 유도)
---

# 메타 태그 최적화 스킬

**네이버 서치어드바이저**에서 노출 많고 CTR 낮은 페이지의 `<title>`·`<meta description>`을 검색 스니펫 최적화 관점으로 교정. 본문 콘텐츠는 건드리지 않고 메타·스키마만 동기화한다.

> 주 트래픽이 네이버(약 59%)·ChatGPT라 **네이버 CTR 기준**으로 최적화한다. 구글 서치콘솔(유입 1%)은 보지 않는다.

## 실행 주기
- **월 1회** (매월 유지보수 슬롯에서 /jptcalc-refresh·/blog 큐 갱신과 함께). 네이버 데이터가 월 단위로 의미 있고, 페이지당 메타 변경 쿨다운이 4주라 주간 실행은 무의미.
- 1회 실행당 **노출 높고 CTR 낮은 페이지 6-7개** 처리.
- 초반 급성장기(~2026-08)에는 3주 간격도 가능.
- 이 스킬은 **자동 삭제하지 않음** (CTR 개선은 상시 작업)

## 진행 현황

| 라운드 | 기간 | 대상 수 | 완료 | 재측정 예정 |
|---|---|---|---|---|
| 1차 | 2026-04-23 ~ 2026-04-25 | 20페이지 | 7 | 2026-05-02 |
| 2차 (재교정) | 2026-04-26 | 6 | 6 | 2026-05-03 |
| 3차 | 2026-04-27 ~ 2026-05-01 | 잔여 페이지 | 20+ | - |
| 4차 (재교정) | 2026-05-02, 05-08 ~ | 14+ | 14 | 2026-05-15 |
| 5차 | 2026-05-15 ~ 2026-05-16 | 미최적화 잔여 | 13 | 2026-05-23 |

**누적 진행: 67+페이지 완료 (블로그 posts + calc 페이지 포함)**

작업 완료 시 이 표를 즉시 갱신할 것.

## 기본 동작

- **1회 실행당 페이지 6-7개** 최적화 (별도 지정 없을 시)
- 지정 시: `/meta-optimize /blog/posts/xxx.html` → 해당 페이지만
- 대상 선정: **네이버 서치어드바이저 > 리포트 > 웹문서/검색어 TOP 30**에서 노출 높고 CTR 낮은 페이지. 네이버는 공개 API가 없으므로 사용자가 캡처/목록을 제공 → 그걸로 선정.

## 선정 기준 (우선순위)

네이버 서치어드바이저 검색어/웹문서 TOP 30 기준. 네이버는 평균순위를 제공하지 않으므로 **노출·CTR만** 사용:

1. **노출 높은데(상위 30위권) CTR 2% 미만** - 클릭 손실이 가장 큰 구간 (예: 만나이 3,080노출 1.3%)
2. 노출 중상위 + CTR 낮음 - 제목이 네이버 검색어와 안 맞는 케이스
3. 직전 갱신에서 다룬 페이지는 **4주 쿨다운** 전까지 제외

선정 데이터: 사용자가 네이버 서치어드바이저 **검색어 TOP 30 + 웹문서 TOP 30** 캡처/목록을 제공한다. (구글 서치콘솔 report.mjs는 사용하지 않음 - 유입 1%)

## 교정 규칙

### title (60자 이내)
- **검색 키워드 + 차별화 문구 + 년도** 포함
- 좋음: `연봉 5000만원 실수령액 2026년 계산 (월 350만원 실수령 맞나요?)`
- 나쁨: `연봉 5000만원 실수령액 | 제이퍼 계산기 블로그`
- **|(파이프) 기준 좌측에 핵심 키워드**, 브랜드 접미는 선택
- 클릭 유도 패턴 (각 페이지 중복 금지, 돌려쓰기):
  - 수치형: "월 ~만원 맞나요?", "진짜 ~일까?"
  - 질문형: "왜 ~일까?", "~ vs ~ 어떤 게 유리?"
  - 팩트형: "2026년 기준", "법령 기준", "공식 발표"
  - 체크형: "한눈에 보기", "10초 계산", "3분 정리"

### description (155자 이내, 핵심은 앞 80자에 - 네이버 모바일 노출 기준)
- 첫 문장에 **검색 의도 답변** (결론부터)
- 두 번째 문장에 **차별화 포인트** (수치·시나리오·비교)
- 세 번째 문장에 **행동 유도** (계산기 링크·상세 예시)
- 좋음: `연봉 5,000만 원 실수령액은 월 350-360만 원 수준입니다. 부양가족·공제항목에 따라 최대 20만 원까지 차이 납니다. 세부 조건별 실수령액을 10초 만에 계산해보세요.`
- 나쁨: `연봉 5,000만 원 실수령액을 계산하는 방법과 공제 항목에 대해 정리합니다.`

### 금지 사항
- 본문 내용과 다른 숫자·사실 작성 금지 (스니펫 거짓 표기 위반)
- **낚시성 과장** 금지 ("충격", "이것만 알면", "모르면 손해")
- 키워드 스터핑 금지 (연봉, 연봉계산기, 연봉실수령액, 연봉세금 ← 나쁨)
- "정리합니다", "알아보겠습니다" 같은 AI 패턴 금지
- 255자 초과 description 금지 (네이버 모바일은 약 80자만 노출되니 핵심 검색어·결론을 앞쪽에)
- 브랜드명 중복 금지 (title·description 양쪽에 "제이퍼 계산기" 금지 → description에서 제외)

## 동시 갱신 대상 (한 페이지 건드릴 때 모두)

페이지 1개 수정 시 **8개 위치를 모두 동기화**해야 함. 누락 시 `/verify` 룰 위반:

### head 메타 태그 (4-6개)
```html
<title>...</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta name="twitter:title" content="..." />     <!-- 있는 경우만 -->
<meta name="twitter:description" content="..." /> <!-- 있는 경우만 -->
```

### JSON-LD 스키마 (필수 동기화 대상)
```json
// Article 스키마
"headline": "{title에서 ' | 제이퍼 계산기 블로그' 접미 제거한 값}"
"description": "{meta description과 완전 일치}"

// BreadcrumbList 스키마
"position": 4 "name": "{title에서 사이트 접미 제거한 값과 일치}"
```

### 동기화 규칙 요약
- `og:title`·`twitter:title` = `<title>` (완전 동일)
- `og:description`·`twitter:description` = `<meta description>` (완전 동일)
- **JSON-LD `headline`** = `<title>` (단, ` | 제이퍼 계산기 블로그` 접미는 제거)
- **JSON-LD `description`** = `<meta description>` (완전 동일)
- **BreadcrumbList position 4 `name`** = JSON-LD headline (= 접미 제거된 title)

**canonical, og:url, BreadcrumbList position 1-3은 건드리지 않는다.** (position 3 잘못 → `/verify`에서 처리)

## 작업 순서

### 1) 대상 페이지 확보
- 네이버 서치어드바이저 **웹문서 TOP 30**(페이지별 노출/클릭/CTR)에서 노출 높고 CTR 낮은 페이지 6-7개 선정.
- **검색어 TOP 30**으로 그 페이지가 어떤 네이버 검색어로 노출되는지 파악 (제목에 넣을 키워드).
- 데이터는 사용자가 캡처로 제공 (네이버 API 없음).

### 2) 페이지별 현재 메타 + JSON-LD 확인
```bash
grep -E '<title>|name="description"|og:title|og:description|twitter:title|twitter:description|"headline":|"description":|"position": 4' 파일.html
```
JSON-LD `headline`·`description`·BreadcrumbList position 4 `name`까지 확인. 이 값들도 새 title·desc와 동기화 필요.

### 3) 핵심 검색 쿼리 매핑
- **네이버 서치어드바이저 검색어 TOP 30**에서 해당 페이지가 노출되는 실제 검색어 확인
- 새 title·description 앞부분에 그 검색어 1-2개를 **그대로** 자연 삽입 (네이버는 검색어 일치도를 크게 봄)
- 주력 검색어가 이미 포함돼 있다면 클릭 유도 문구·연식(2026)만 교체

### 4) 교정 실행 (Edit 도구)
페이지 1개당 **최대 8개 위치**를 모두 동기화 (Edit 6-8회):

**4-1. head 메타 (4-6 위치)**
- `<title>` / `<meta name="description">` / `og:title` / `og:description` / (있다면) `twitter:title` / `twitter:description`

**4-2. JSON-LD Article 스키마 (2 위치)**
- `"headline"` ← title에서 ` | 제이퍼 계산기 블로그` 접미만 제거한 값
- `"description"` ← meta description과 완전 동일

**4-3. JSON-LD BreadcrumbList 스키마 (1 위치)**
- `position: 4`의 `"name"` ← 새 headline과 동일

title 60자, description 155자 **반드시 세어서 초과 여부 확인**.

### 5) 검증 (필수)
```
□ title 60자 이내
□ description 155자 이내
□ og:title = title (완전 동일)
□ og:description = meta description (완전 동일)
□ twitter:title = title (있는 경우 완전 동일)
□ twitter:description = meta description (있는 경우 완전 동일)
□ JSON-LD headline = title (사이트 접미 제거 후 완전 동일)  ← /verify 룰
□ JSON-LD description = meta description (완전 동일)        ← /verify 룰
□ BreadcrumbList position 4 name = headline (완전 동일)
□ canonical/og:url 원본 유지 확인
□ BreadcrumbList position 1-3 원본 유지 확인
□ 본문 첫 h1 또는 첫 문단의 사실과 모순 없음
□ "충격", "이것만", "모르면 손해" 같은 낚시 금지어 grep
```

### 검증 자동화 스크립트
```bash
# 8개 위치 일괄 비교
for f in 파일1 파일2; do
  title=$(grep -m1 -oP '(?<=<title>)[^<]+' /home/tjd618/jptcalc/blog/posts/${f}.html | sed 's/ | 제이퍼 계산기 블로그$//')
  headline=$(grep -m1 -oP '"headline":\s*"[^"]+' /home/tjd618/jptcalc/blog/posts/${f}.html | sed 's/"headline":\s*"//')
  meta_desc=$(grep -m1 -oP '(?<=name="description" content=")[^"]+' /home/tjd618/jptcalc/blog/posts/${f}.html)
  jsonld_desc=$(grep -m1 -oP '"description":\s*"[^"]+' /home/tjd618/jptcalc/blog/posts/${f}.html | head -1 | sed 's/"description":\s*"//')
  [[ "$title" == "$headline" ]] && echo "✓ $f headline" || echo "✗ $f headline 불일치"
  [[ "$meta_desc" == "$jsonld_desc" ]] && echo "✓ $f desc" || echo "✗ $f desc 불일치"
done
```

## 결과 요약 형식

```
## 메타 최적화 결과 ({YYYY-MM-DD})

| 파일 | 이전 CTR | 선정 이유 | 주요 변경 |
|------|---------|----------|----------|
| xxx.html | 1.2% | 노출 1,230 / 평균 4위 / CTR 1.2% | title 재작성(수치형 추가), description 결론먼저 |
| yyy.html | 0.8% | 노출 890 / 평균 12위 / 증가추세 | 주력 쿼리 앞쪽 배치, 차별화 문구 추가 |

**진행 현황: 완료 N페이지 / 예상 대상 약 20페이지**
```

## 진행 현황 기록

`/home/tjd618/jptcalc/meta-optimize-log.md`에 누적 기록:
```
## 2026-04-23
- posts/salary-5000-takehome.html: CTR 1.2% → (재측정 4/30 예정)
- posts/pension-tax.html: CTR 0.8% → (재측정 4/30 예정)
```

## 재측정·쿨다운 규칙

- 메타 변경 후 **최소 4주**가 지나야 같은 페이지를 재변경한다 (메모리 쿨다운 룰: 동일 페이지 4주 텀, 한 달 내 3회 금지). 네이버 재색인·CTR 반영에도 2~4주 걸림.
- 변경 전 `git blame -L`로 해당 title 줄의 마지막 변경일을 확인해 4주 쿨다운 준수.
- 4주 후 CTR 개선이 없으면 재교정 (다른 검색어 타겟, 다른 유도 패턴)

## 금지

- 본문 HTML 콘텐츠 변경 금지 (이 스킬은 **메타·스키마 동기화 전용**)
- JSON-LD `headline`·`description`·BreadcrumbList position 4 `name`은 **반드시 동기화** (이전 버전 룰과 다름)
- 단, JSON-LD의 다른 필드(`datePublished`, `articleSection`, FAQ Q&A, Author, Publisher 등)·BreadcrumbList position 1-3은 건드리지 않음
- em dash(—) 금지
- sitemap.xml 갱신 불필요 (`<lastmod>` 업데이트는 선택)

## 변경 이력

- **2026-04-26**: meta-optimize로 title·desc만 바꾸고 JSON-LD 안 고치는 패턴이 `/verify` 룰을 위반시키는 문제 발견. JSON-LD `headline`·`description`·BreadcrumbList position 4를 의무 동기화 대상으로 추가.

$ARGUMENTS

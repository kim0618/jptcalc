---
description: 제이퍼 계산기 얇은 계산기 페이지 보강 - guide-section에 섹션 추가해 AdSense 기준 달성
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
---

# 제이퍼 계산기 calc 페이지 보강

`/calc/` 하위 계산기 페이지 중 순수 텍스트 2,500자 미만인 페이지의 `guide-section`에
**새 guide-card 3개 + FAQ 2개 확장**을 삽입해 2,800자 이상으로 끌어올린다.

기존 계산기 UI, 결과 영역, JSON-LD 구조는 건드리지 않는다.
모든 대상 페이지 보강 완료 시 이 스킬 파일을 삭제한다.

## 실행 일정
- **시작일**: 2026-05-06
- **진행 속도**: 하루 5개 (사용자 명시 없을 시), 마지막 날 6개
- **종료일**: 2026-05-12 (7일 × 평균 5.1개 = 36개)
- **애드센스 신청 목표**: 2026-05-21 (블로그 보강 5/13-5/20 후 신청)
- 5/13부터는 `/jpt-blog-bolster`로 전환
- 대상 전수 보강 완료 시 스킬 자동 삭제

## 목표 분량 기준

- **보강 대상**: 순수 텍스트(태그 제외) **2,500자 미만** 계산기 페이지
- **목표**: **2,800자 이상** (안전 마진 포함 3,000자 권장)

측정 명령어:
```bash
python3 -c "
import re, glob
files = sorted(glob.glob('/home/tjd618/jptcalc/calc/*/*/index.html'))
results = []
for f in files:
    html = open(f).read()
    body = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    body = re.sub(r'<style.*?</style>', '', body, flags=re.DOTALL)
    body = re.sub(r'<head.*?</head>', '', body, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', body)
    text = re.sub(r'\s+', ' ', text).strip()
    results.append((len(text), f.replace('/home/tjd618/jptcalc/','')))
results.sort()
for n, f in results:
    if n < 2500:
        print(f'{n:5d}자  {f}')
"
```

## 보강 완료 목록 (건너뛴다)

작업 완료 시 `- {경로} ({YYYY-MM-DD} 보강, 옵션{X}, N,NNN자)` 형식으로 추가.

**옵션 누적 카운트 (목표 A:12 / B:11 / C:13)**:
- A 사용: 6/12
- B 사용: 5/11
- C 사용: 4/13

- calc/salary/raise-rate (2026-05-06 보강, 옵션B, 2,996자)
- calc/salary/job-change (2026-05-06 보강, 옵션C, 2,896자)
- calc/ai/saas-comparison (2026-05-06 보강, 옵션A, 3,159자)
- calc/ai/api-token (2026-05-06 보강, 옵션C, 3,135자)
- calc/health/body-fat (2026-05-06 보강, 옵션A, 3,875자)
- calc/ai/gpu-cloud (2026-05-07 보강, 옵션A, 2,822자)
- calc/salary/comparison (2026-05-07 보강, 옵션A, 2,806자)
- calc/date/weekday (2026-05-07 보강, 옵션B, 2,803자)
- calc/ai/infra-forecast (2026-05-07 보강, 옵션B, 3,146자)
- calc/date/date-difference (2026-05-07 보강, 옵션C, 2,825자)
- calc/realestate/loan (2026-05-08 보강, 옵션A, 2,916자)
- calc/realestate/conversion (2026-05-08 보강, 옵션B, 2,886자)
- calc/date/date-add (2026-05-08 보강, 옵션A, 2,841자)
- calc/salary/hourly-wage (2026-05-08 보강, 옵션B, 2,913자)
- calc/ai/llm-comparison (2026-05-08 보강, 옵션C, 2,904자)

## 대상 36개 (실측 기준, 짧은 순)

### 표준 패턴 (33개) - 자동 처리 가능

| # | 경로 | 현재 |
|---|------|------|
| 1 | calc/salary/raise-rate | 931자 |
| 2 | calc/salary/job-change | 938자 |
| 3 | calc/ai/saas-comparison | 1,029자 |
| 4 | calc/ai/api-token | 1,039자 |
| 5 | calc/ai/gpu-cloud | 1,052자 |
| 6 | calc/salary/comparison | 1,062자 |
| 7 | calc/date/weekday | 1,064자 |
| 8 | calc/ai/infra-forecast | 1,074자 |
| 9 | calc/date/date-difference | 1,101자 |
| 10 | calc/realestate/loan | 1,123자 |
| 11 | calc/realestate/conversion | 1,129자 |
| 12 | calc/date/date-add | 1,143자 |
| 13 | calc/salary/hourly-wage | 1,152자 |
| 14 | calc/ai/llm-comparison | 1,170자 |
| 15 | calc/realestate/rental | 1,175자 |
| 16 | calc/finance/compound | 1,204자 |
| 17 | calc/pet/lifetime-cost | 1,307자 |
| 18 | calc/finance/investment | 1,311자 |
| 19 | calc/pet/monthly-cost | 1,408자 |
| 20 | calc/pet/adoption | 1,466자 |
| 21 | calc/date/dday | 1,571자 |
| 22 | calc/realestate/joint | 1,687자 |
| 23 | calc/realestate/propertytax | 1,768자 |
| 24 | calc/realestate/registry | 1,780자 |
| 25 | calc/realestate/pyeong | 1,796자 |
| 26 | calc/realestate/inheritance | 1,826자 |
| 27 | calc/realestate/jongbu | 1,968자 |
| 28 | calc/finance/savings | 2,032자 |
| 29 | calc/finance/deposit | 2,063자 |
| 30 | calc/health/bmi | 2,271자 |
| 31 | calc/pet/medical | 2,282자 |
| 32 | calc/pet/insurance | 2,418자 |
| 33 | calc/realestate/brokerage | 2,468자 |

### 비표준 패턴 (3개) - 수동 처리 필요

`guide-card` 구조가 없어 별도 삽입 위치 찾아야 함.

| # | 경로 | 현재 |
|---|------|------|
| 34 | calc/health/body-fat | 1,907자 |
| 35 | calc/health/ideal-weight | 2,084자 |
| 36 | calc/health/bmr | 2,287자 |

실행 전 측정 명령어로 실제 순서 재확인 후 진행.

---

## 작업 순서

### 1) 대상 선정

위 측정 명령어 실행 → 2,500자 미만 중 완료 목록에 없는 **가장 짧은 5개** 선택.
표준/비표준 분기:
- 표준 패턴: 파일에 `guide-card` 클래스 존재 (33개)
- 비표준: health/body-fat, health/ideal-weight, health/bmr 3개

**1일차 특수 규칙 (2026-05-06)**: 표준 4개 + 비표준 body-fat 1개 처리.
비표준 1개를 먼저 처리해 패턴 확정 후 나머지 2개(ideal-weight, bmr)는 그 패턴으로 작업.

### 2) 파일 읽기

```
Read /home/tjd618/jptcalc/{경로}/index.html
```

확인할 것:
- H1 제목, 계산기 이름
- 기존 `guide-card` 내용 (언제 쓰나요? 섹션 텍스트)
- 기존 FAQ 3개 질문/답변 전체
- `window.TRUST_BLOCK_CONFIG` 내용 (어떤 법령 기준인지)
- 카테고리 (breadcrumb으로 확인)
- JSON-LD FAQPage 기존 항목

### 3) 보강 섹션 생성

아래 **삽입 위치**와 **섹션 구조**에 따라 3개 guide-card + FAQ 2개 작성.
주제에 맞게 실제 내용으로 채운다. 패딩 금지.

**카테고리별 사전 작업**:

- **AI 카테고리**: 같은 날 첫 AI 페이지 작업 시작 시 **WebFetch 1회로 가격 데이터 일괄 수집 후 캐시**, 같은 날 작업하는 나머지 AI 페이지는 캐시 재사용 (5개 페이지 = WebFetch 1회만)
  - 1회 fetch 대상:
    - OpenAI: `https://openai.com/api/pricing/`
    - Anthropic: `https://www.anthropic.com/pricing`
    - Google AI: `https://ai.google.dev/pricing` (필요 시)
  - 수집할 정보: 모델명, 1M 토큰당 input/output 가격 (USD)
  - 캐시 형식: 작업 시작 시 가격표를 응답 텍스트에 명시적으로 적어두고(예: "OpenAI 가격표 - GPT-4o input $2.50/1M, output $10/1M..."), 같은 세션 내 다음 AI 페이지 작업 시 위 메모 참조해 동일 수치 인용. 세션이 새로 시작되면 다시 fetch.
  - 가격 인용 시 "2026년 X월 기준" 명시 필수 (작업일 기준)
- **부동산**: 시세·세율 작성 시 "2026년 기준" 명시
- **건강**: 의료 단정 표현 자가 검증 (정상/비정상 → 참고 범위)

**섹션별 최소 분량 (필수 준수, 미달 시 감점/재신청 위험)**:

| 섹션 | 최소 자수 | 구성 |
|------|----------|------|
| 섹션 1 (계산 원리) | 400자 이상 | 도입 1-2문장 + 4-5단계 또는 3개 guide-box (각 80자+) |
| 섹션 2 (실제 예시) | 800자 이상 | 예시 2개, 각 350자+ (상황 설명 + 입력값/계산 결과 + 해석 1문장) |
| 섹션 3 (주의사항) | 400자 이상 | 도입 1-2문장 + 3-4개 항목 (각 100자+) |
| FAQ 신규 2개 | 각 150자 이상 | 3-4문장 답변 |
| FAQ 기존 확장 | 답변 50자 미만만 | 100자 이상으로 확장 (이미 충분하면 건드리지 않음) |

**합계 최소 추가 분량**: 1,950자
- 가장 짧은 페이지(931자) + 1,950자 = 2,881자 → 목표 2,800자 안전 확보
- 1,500자 페이지면 + 1,950자 = 3,450자 (여유)

분량 부족 시 우선 확장 위치:
1. 섹션 2 예시의 상황 설명·해석 부분
2. 주의사항 항목 1개 추가 (3개 → 4개)
3. FAQ 답변을 4문장으로

### 4) HTML 삽입 (Edit 도구) - 표준 패턴

**삽입 위치**: 첫 번째 `guide-card` (언제 쓰나요?) 닫힘 태그와 `faq-card` 사이.

**Edit old_string 유일성 확보 (필수)**:
파일 내 `</div>`가 다중 매칭되므로 unique 한 컨텍스트가 필요하다. 첫 번째 guide-card 직전의 `<h2>{언제 쓰나요?}</h2>`부터 faq-card 시작까지 통째로 잡는다.

old_string 권장 형식 (예: raise-rate):
```
      <h2>연봉 인상률 계산기는 언제 쓰나요?</h2>
      <p>...기존 본문...</p>
      <div class="guide-grid">
        ...기존 grid...
      </div>
    </div>
    <div class="guide-card faq-card">
```

new_string: 위 전체를 그대로 복사하고 `</div>`와 `<div class="guide-card faq-card">` 사이에 새 3개 섹션 삽입.

**대안: 더 짧은 unique 패턴**
파일별로 첫 번째 guide-card 끝의 마지막 텍스트가 unique 할 수 있음. 예시:
- "물가상승률 대비 실질 인상 여부 판단</span></div>" → 이 패턴은 raise-rate에만 존재

작업 시작 시 grep으로 해당 패턴이 파일 내 1회만 등장하는지 확인 후 사용.

### 4a) HTML 삽입 - 비표준 패턴 (health 3개)

이 3개 파일은 `<div class="guide-card">` 대신 `<section class="guide-section seo-card">` 구조 사용.

**비표준 처리 규칙**:
- 삽입 시 새 섹션도 **`<section class="guide-section seo-card">` 형식 유지** (div 아님)
- 삽입 위치: 첫 번째 `<section class="guide-section seo-card">` 닫힘과 `<section class="guide-section seo-card faq-card">` 시작 사이
- h2 직접 사용 (guide-card h2 아님)
- 들여쓰기는 해당 파일의 기존 패턴 (보통 2칸)에 맞출 것

**1일차 body-fat 처리 후 패턴 확정 기록**:
처리 후 아래 표에 실제 사용한 정확한 삽입 패턴을 기록한다. 2일차 이후 ideal-weight, bmr 작업 시 이 패턴 그대로 활용.

```
[비표준 패턴 확정 - 2026-05-0X body-fat 처리 후 작성]
- 시작 태그: <section class="guide-section seo-card">
- 닫힘 태그: </section>
- 들여쓰기: 2칸
- 삽입 위치 unique 패턴: {실제 사용한 old_string}
```

### 5) FAQ 확장 (Edit 도구)

기존 FAQ `<div class="faq-item">` 3개의 마지막 항목 뒤에 2개 추가.

```html
      <div class="faq-item"><h3>새 질문 4</h3><p>2-3문장 답변.</p></div>
      <div class="faq-item"><h3>새 질문 5</h3><p>2-3문장 답변.</p></div>
```

기존 FAQ 답변도 1줄짜리는 2-3문장으로 확장.

### 6) JSON-LD FAQPage 업데이트 (한 줄 minified 처리)

기존 JSON-LD FAQPage는 한 줄로 minified 되어 있다. 부분 Edit은 따옴표/공백 escape 실수 위험이 크므로 **통째로 재작성**한다.

**처리 방법**:
1. 파일에서 기존 FAQPage JSON-LD 한 줄 전체를 `Read`로 정확히 복사
2. 신규 작성한 HTML FAQ 5개와 1:1 매칭되도록 새 JSON-LD 한 줄 작성 (HTML 문장과 완전히 일치)
3. `Edit`으로 기존 줄 전체를 새 줄 전체로 교체 (1회 호출)

**새 JSON-LD 형식 (5개 항목)**:
```
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"질문1","acceptedAnswer":{"@type":"Answer","text":"답변1"}},{"@type":"Question","name":"질문2","acceptedAnswer":{"@type":"Answer","text":"답변2"}},{"@type":"Question","name":"질문3","acceptedAnswer":{"@type":"Answer","text":"답변3"}},{"@type":"Question","name":"질문4","acceptedAnswer":{"@type":"Answer","text":"답변4"}},{"@type":"Question","name":"질문5","acceptedAnswer":{"@type":"Answer","text":"답변5"}}]}</script>
```

**주의**:
- HTML 본문 FAQ와 질문 텍스트 100% 일치 (오타도 동일하게)
- 답변에 큰따옴표(") 들어가면 `\"`로 escape
- 답변에 줄바꿈 금지 (한 줄로)
- HTML 엔티티(&amp; 등) 사용 금지, 일반 문자 사용

### 7) description 메타 태그 확장 (3곳 동기화)

`<meta name="description">`이 60자 미만이면 80-130자로 확장. 핵심 사용 상황 + 계산 결과 항목 명시.

**3곳 모두 동기화 (한 페이지에 description이 3개)**:
- `<meta name="description" content="...">`
- `<meta property="og:description" content="...">`
- `<meta name="twitter:description" content="...">`

세 개를 같은 텍스트로 통일. Edit 1회로 가능 (`replace_all=true` 또는 같은 줄 내라면 한 번에).

### 8) lastReviewed 날짜 갱신

`window.ARTICLE_INFO_CONFIG`의 `lastReviewed` → `'YYYY.MM.DD'` 형식 (실제 작업일)
`window.TRUST_BLOCK_CONFIG`의 `lastReviewed` → `'YYYY.MM'` 형식

작업일 자동 확보:
```bash
date +%Y.%m.%d  # ARTICLE_INFO용
date +%Y.%m     # TRUST_BLOCK용
```

### 9) 분량 검증

```bash
python3 -c "
import re
html = open('/home/tjd618/jptcalc/{경로}/index.html').read()
body = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
body = re.sub(r'<style.*?</style>', '', body, flags=re.DOTALL)
body = re.sub(r'<head.*?</head>', '', body, flags=re.DOTALL)
text = re.sub(r'<[^>]+>', ' ', body)
text = re.sub(r'\s+', ' ', text).strip()
print(f'{len(text)}자')
"
```

2,800자 미만이면 섹션 보강 후 재확인.

### 10) 이 스킬 파일 갱신

완료 목록에 추가:
```
- calc/{경로} (2026-05-0X 보강, X,XXX자)
```

---

## 사용 가능한 CSS 클래스 (검증됨)

**전역 CSS에 정의되어 안전하게 사용 가능**:
- `guide-section`, `guide-card`, `guide-grid`, `guide-box`
- `guide-card` 내부의 `<table>` (`.guide-card table` 스타일 자동 적용)
- `guide-card` 내부의 `<ul>` (`.guide-card > ul` 스타일 자동 적용)
- `guide-card` 내부의 `<h3>` (`.guide-card h3` 스타일 자동 적용 - 구분선 포함)
- `guide-card .guide-table-wrap` (테이블 가로 스크롤 래퍼)

**사용 금지 (CSS 미정의)**:
- `example-block`, `example-label` - 정의 없음
- `guide-steps` - 정의 없음
- `highlight-box` - 일부 페이지의 inline `<style>`에만 있음, 전역 X
- 기타 임의 클래스

---

## 삽입 섹션 구조

### 콘텐츠 다양성 의무 분산

**같은 사이트 내 36개 페이지가 동일 패턴이면 중복성 신호로 페널티 위험.**
섹션 1(계산 원리)은 페이지마다 옵션 A/B/C 중 다르게 선택해서 사이트 전체 다양성을 확보한다.

**카테고리별 옵션 분산 비율 (36개 전체 기준)**:

같은 카테고리 안에서도 옵션을 섞어서 중복성 신호를 분산시킨다. 비주력 옵션도 1-2개는 반드시 사용.

| 카테고리 | 대상 페이지 수 | 옵션 A (grid) | 옵션 B (ul 단계) | 옵션 C (table) |
|---------|--------------|--------------|----------------|--------------|
| 부동산 (realestate) | 10 | 3 | 3 | 4 |
| AI/테크 (ai) | 5 | 2 | 1 | 2 |
| 반려동물 (pet) | 5 | 2 | 1 | 2 |
| 연봉 (salary) | 4 | 1 | 2 | 1 |
| 날짜·D-day (date) | 4 | 1 | 2 | 1 |
| 금융 (finance) | 4 | 1 | 1 | 2 |
| 건강 (health) | 4 | 2 | 1 | 1 |
| **합계** | **36** | **12** | **11** | **13** |

**규칙**:
- 같은 카테고리 처리 시 직전 페이지와 같은 옵션 연속 2회까지만 (3연속 금지)
- 카테고리 내 분배 표를 보고 부족한 옵션 우선 선택
- 작업 완료 후 보강 완료 목록에 사용한 옵션 기록 (`옵션B`, `옵션C` 등)

### 섹션 1: 계산 원리 · 공식

**옵션 A: guide-grid 사용 (3개 핵심 항목 강조)**
```html
    <div class="guide-card">
      <h2>{계산기명} 계산 방법</h2>
      <p>{계산 원리 설명 2-3문장. 어떤 공식/법령 기준인지 명시.}</p>
      <div class="guide-grid">
        <div class="guide-box"><strong>{핵심 항목 1}</strong><span>{설명}</span></div>
        <div class="guide-box"><strong>{핵심 항목 2}</strong><span>{설명}</span></div>
        <div class="guide-box"><strong>{핵심 항목 3}</strong><span>{설명}</span></div>
      </div>
    </div>
```

**옵션 B: 단계별 절차 (`<ul>` 활용)**
```html
    <div class="guide-card">
      <h2>{계산기명} 계산 방법</h2>
      <p>{계산 원리 설명 2-3문장.}</p>
      <ul>
        <li><strong>1단계.</strong> {내용}</li>
        <li><strong>2단계.</strong> {내용}</li>
        <li><strong>3단계.</strong> {내용}</li>
      </ul>
    </div>
```

**옵션 C: 기준표 (`<table>` 활용)**
```html
    <div class="guide-card">
      <h2>{계산기명} 적용 기준</h2>
      <p>{설명 2-3문장.}</p>
      <div class="guide-table-wrap">
        <table>
          <thead><tr><th>구분</th><th>기준</th><th>비고</th></tr></thead>
          <tbody>
            <tr><td>{항목1}</td><td>{값}</td><td>{설명}</td></tr>
            <tr><td>{항목2}</td><td>{값}</td><td>{설명}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
```

### 섹션 2: 실제 예시 2개

`<h3>` 으로 두 예시를 구분 (구분선 자동 적용됨).

```html
    <div class="guide-card">
      <h2>실제 계산 예시</h2>
      <h3>예시 1 - {이름}({나이}, {직업/상황})</h3>
      <p>{구체적 상황 설명. 입력값 명시.}</p>
      <ul>
        <li>{계산 항목}: {결과값}</li>
        <li>{계산 항목}: {결과값}</li>
        <li><strong>{핵심 결과}: {최종값}</strong></li>
      </ul>
      <h3>예시 2 - {이름}({나이}, {다른 상황})</h3>
      <p>{구체적 상황 설명. 예시 1과 다른 케이스.}</p>
      <ul>
        <li>{계산 항목}: {결과값}</li>
        <li>{계산 항목}: {결과값}</li>
        <li><strong>{핵심 결과}: {최종값}</strong></li>
      </ul>
    </div>
```

### 섹션 3: 주의사항

```html
    <div class="guide-card">
      <h2>이것만은 확인하세요</h2>
      <p>{왜 주의해야 하는지 1-2문장.}</p>
      <div class="guide-grid">
        <div class="guide-box"><strong>{주의 항목 1}</strong><span>{구체적 설명}</span></div>
        <div class="guide-box"><strong>{주의 항목 2}</strong><span>{구체적 설명}</span></div>
        <div class="guide-box"><strong>{주의 항목 3}</strong><span>{구체적 설명}</span></div>
      </div>
    </div>
```

---

## 섹션별 내용 기준

### 계산 원리 섹션
- 실제 공식 또는 계산 단계 명시 (수식 가능)
- 관련 법령·기준 근거 포함 (예: "근로기준법 2026년 기준", "국세청 간이세액표 기준")
- 추상적 설명 금지, 수치와 기준 명시

### 카테고리별 권장 출처와 특수 주의사항

**세금/연봉/연금/금융** (변동 주기: 연 1회 1월 갱신)
- 출처: 국세청·고용노동부·국민연금공단·한국은행·금융감독원
- 주의: "2026년 기준" 명시 필수. 매년 1월 세율표/요율 갱신 안내

**부동산** (변동 주기: 분기/매월)
- 출처: 국토교통부·한국부동산원·KB부동산·위택스
- 주의: 시세는 "{작성일} 기준" 명시 필수. "최신 시세는 KB부동산 또는 한국부동산원 R-ONE에서 확인" 안내

**건강** (변동 주기: 의학 연구 갱신 시)
- 출처: WHO·대한비만학회·대한가정의학회·식품의약품안전처
- 주의: **의료 단정 절대 금지**. "전문의 상담 권장", "개인차 있음" 자연스럽게 포함. 정상/비정상 판정 표현 대신 "참고 범위" 사용

**AI/테크** (변동 주기: 수시, 모델/가격 자주 변경)
- 출처: OpenAI·Anthropic·Google AI·AWS·GCP·Azure 공식 가격 페이지
- 주의: **가격 정보 작성 시 작성일 명시 필수** ("2026년 4월 기준"). "각 벤더 공식 페이지에서 최신 가격 확인" 강조. 모델명 정확히 표기 (GPT-4o, Claude Sonnet 4.6 등)

**반려동물** (변동 주기: 연/분기)
- 출처: 농림축산식품부·동물보호관리시스템·한국펫보험협회
- 주의: 평균값 활용 시 출처 명시 ("KB펫보험 평균 기준 등"). 품종별 차이 큼 주석

### 예시 섹션
- 이름/나이/직업/상황 구체적으로 (예: "김민수(32세, IT 회사 재직 4년차)")
- 입력값과 결과값 모두 수치로 명시
- 두 예시는 서로 다른 케이스 (금액대, 상황, 결과 차이)
- 결과에서 의미를 뽑아주는 해석 1문장

### 주의사항 섹션
- 계산기 사용자가 자주 놓치는 3가지
- 계산 결과가 실제와 다를 수 있는 이유 포함
- 공식 기관 확인 권장 문구 자연스럽게 삽입

### FAQ 추가 2개
- 기존 3개와 겹치지 않는 주제
- 실제 사용자가 검색할 법한 질문
- 각 답변 2-3문장 (기존 1줄짜리도 확장)
- 엣지케이스 또는 자주 오해하는 상황 포함

---

## 글쓰기 규칙

- em dash(—) 금지, 하이픈(-) 사용
- "~알아보겠습니다", "~정리해드리겠습니다", "~살펴보겠습니다" 금지
- "다양한", "여러 가지" 등 막연한 표현 금지, 수치/사례로 대체
- 하이픈(-) 으로 시작하는 리스트 금지, `<ul><li>` 사용
- 단정 표현 금지 ("반드시 ~이다" → "~일 수 있습니다" / "~를 권장합니다")
- 의료 단정 금지 (health 카테고리는 "전문의 상담 권장" 자연스럽게 포함)
- 수치 없는 추상 설명 금지
- 인물 예시는 가상 인물 (실명 금지)

---

## 절대 변경하지 않는 것

- 계산기 UI (`<div class="card">`, `<div class="result-card">`)
- `<div class="page-header">` 내용 (제목/뱃지/설명)
- `<div class="sibling-section">` 내용 (있는 경우)
- `window.TRUST_BLOCK_CONFIG`의 `standard`, `references` 필드
- `window.ARTICLE_INFO_CONFIG`의 `author`, `reviewBasis`, `referenceOrg`, `category`
- BreadcrumbList JSON-LD
- WebApplication JSON-LD
- 기존 FAQ 3개의 질문 텍스트 (답변 확장은 가능)
- `<script>` 계산 로직 (`calcRaise()` 등)
- 페이지별 inline `<style>` 블록
- 새 CSS 클래스 도입 금지 (사용 가능한 클래스 목록 참고)

---

## Edit 호출 압축 가이드

한 페이지당 Edit 호출 **5-9회 범위** (페이지 상태에 따라 변동).

| 작업 | Edit 횟수 | 비고 |
|------|----------|------|
| guide-section에 섹션 3개 통합 삽입 | 1회 | 한 번에 3개 섹션 묶어서 |
| FAQ 2개 추가 | 1회 | faq-card 안 마지막 faq-item 뒤 |
| FAQ 기존 답변 확장 | 0-3회 | 50자 미만만, 이미 충분하면 건드리지 않음 |
| JSON-LD FAQPage 통째 교체 | 1회 | 한 줄 전체 |
| description 메타 (60자 미만일 때만, 3곳 동기화) | 0-1회 | replace_all 활용 |
| lastReviewed 갱신 (ARTICLE_INFO + TRUST_BLOCK) | 2회 | 두 곳 |
| **총합** | **5-9회** | 페이지별 상태에 따라 |

**최적화 원칙**:
- 기존 FAQ 답변이 이미 50자 이상이면 확장하지 않음 (그 분량은 신규 섹션에서 채움)
- description이 60자 이상이면 건드리지 않음
- 섹션 3개는 한 Edit으로 묶어서 처리 (개별 Edit 금지)

## 검증 체크리스트 (파일 1개 완료 후)

```
□ 순수 텍스트 2,800자 이상 (측정 명령어로 확인)
□ 새 섹션 3개 guide-card 삽입 확인
□ FAQ 5개 (기존 3 + 신규 2)
□ JSON-LD FAQPage HTML FAQ와 질문 개수·내용 일치
□ em dash(—) 없음 (grep -c '—' 으로 확인)
□ "알아보겠습니다", "살펴보겠습니다" 등 AI 패턴 없음
□ 사용한 CSS 클래스가 전역 정의 클래스인지 확인 (example-* 등 금지)
□ description 60자 이상 (가능하면 80-130자)
□ lastReviewed 작업일 날짜
□ 기존 계산기 UI 코드 변경 없음
□ HTML 문법 오류 없음 (태그 열닫힘 쌍 확인)
```

분량 검증이 실패하면 (2,800자 미만):
- 예시 섹션의 시나리오를 더 구체적으로 (각 예시 200자→400자)
- FAQ 답변을 3-4문장으로 확장
- 계산 원리 섹션에 단계별 설명 추가

---

## 결과 요약 형식

```
## jpt-calc-bolster 결과 (2026-05-0X)

| 파일 | 카테고리 | 옵션 | 보강 전 | 보강 후 | 추가 섹션 |
|------|---------|-----|---------|---------|----------|
| calc/salary/raise-rate | salary | B | 931자 | 3,212자 | 계산 원리, 예시 2개, 주의사항, FAQ +2 |
| calc/salary/job-change | salary | C | 938자 | 3,180자 | ... |

**옵션 사용 누적 (36개 중)**: A {n}개 / B {n}개 / C {n}개
**진행 현황: N개 완료 / 36개 전체**
**남은 것: M개 (하루 5개 기준 D일 소요)**
**AdSense 신청 목표 5/21 기준 D-{N}일** (5/13부터 jpt-blog-bolster 전환)

### 다음 작업일 대상 5개 (자동 선정)

작업할 5개를 미리 선정해 다음 세션 시작 시 즉시 진행 가능하게 한다.

선정 규칙:
1. 보강 완료 목록에 없는 페이지 중 가장 짧은 순
2. 카테고리 옵션 분배 표를 보고 부족한 옵션 매칭
3. 같은 카테고리 3연속 회피 (다양성 분산)

| # | 다음 대상 | 카테고리 | 권장 옵션 | 현재 자수 |
|---|----------|---------|----------|----------|
| 1 | calc/{경로} | {카테고리} | {옵션} | {자수}자 |
| 2 | ... | | | |
| 3 | ... | | | |
| 4 | ... | | | |
| 5 | ... | | | |

**다음 작업 명령어**: `/jpt-calc-bolster` (기본 5개) 또는 `/jpt-calc-bolster 3` (개수 지정)
```

---

## 모든 대상 보강 완료 시

전체 36개가 완료 목록에 포함되면:
1. 사용자에게 메시지 출력:
   ```
   jptcalc calc 페이지 36개 보강 완료.
   thin content 문제 해결 완료 - 다음 단계는 /jpt-blog-bolster (5/13 시작) → 애드센스 신청(5/21).
   이 스킬(/jpt-calc-bolster)을 삭제합니다.
   ```
2. 이 파일(`/home/tjd618/jptcalc/.claude/commands/jpt-calc-bolster.md`) 삭제
3. 전역 심링크도 제거:
   ```bash
   rm /home/tjd618/.claude/commands/jpt-calc-bolster.md
   ```

$ARGUMENTS

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
- **진행 속도**: 하루 5개, 마지막 날(5/12) 6개
- **종료일**: 2026-05-12
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

---

## 보강 완료 목록 (건너뛴다)

**진행 현황: 30개 완료 / 36개**

**옵션 누적 카운트 (목표 A:12 / B:11 / C:13)**:
- A 사용: 10/12
- B 사용: 10/11
- C 사용: 10/13

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
- calc/realestate/rental (2026-05-09 보강, 옵션C, 3,146자)
- calc/finance/compound (2026-05-09 보강, 옵션C, 3,150자)
- calc/pet/lifetime-cost (2026-05-09 보강, 옵션A, 3,235자)
- calc/finance/investment (2026-05-09 보강, 옵션B, 3,424자)
- calc/pet/monthly-cost (2026-05-09 보강, 옵션C, 3,114자)
- calc/pet/adoption (2026-05-10 보강, 옵션B, 3,183자)
- calc/date/dday (2026-05-10 보강, 옵션B, 3,388자)
- calc/realestate/joint (2026-05-10 보강, 옵션C, 3,276자)
- calc/realestate/propertytax (2026-05-10 보강, 옵션A, 3,475자)
- calc/realestate/registry (2026-05-10 보강, 옵션B, 3,510자)
- calc/realestate/pyeong (2026-05-11 보강, 옵션C, 3,601자)
- calc/realestate/inheritance (2026-05-11 보강, 옵션B, 3,875자)
- calc/realestate/jongbu (2026-05-11 보강, 옵션A, 3,993자)
- calc/finance/savings (2026-05-11 보강, 옵션A, 4,014자)
- calc/finance/deposit (2026-05-11 보강, 옵션C, 4,164자)

---

## 남은 대상 6개 (옵션 사전 배정)

실행 전 측정 명령어로 자수 재확인 후 진행.

| # | 경로 | 현재 | 패턴 | 권장 옵션 |
|---|------|------|------|---------|
| 1 | calc/health/ideal-weight | 2,084자 | **비표준** | C |
| 2 | calc/health/bmi | 2,271자 | 표준 | B |
| 3 | calc/pet/medical | 2,282자 | 표준 | A |
| 4 | calc/health/bmr | 2,287자 | **비표준** | A |
| 5 | calc/pet/insurance | 2,418자 | 표준 | C |
| 6 | calc/realestate/brokerage | 2,468자 | 표준 | C |

**하루 5개 기준**: 5/12(6개) = 완료

---

## 작업 순서

### 1) 대상 선정

측정 명령어 실행 → 2,500자 미만 중 완료 목록에 없는 **가장 짧은 5개** 선택.
표준/비표준 분기:
- 표준 패턴: 파일에 `guide-card` 클래스 존재
- 비표준: health/ideal-weight, health/bmr (body-fat 패턴 동일)

### 2) 파일 읽기

```
Read /home/tjd618/jptcalc/{경로}/index.html
```

확인할 것:
- H1 제목, 계산기 이름
- 기존 `guide-card` 내용 (언제 쓰나요? 섹션 텍스트)
- 기존 FAQ 질문/답변 전체 (개수 확인)
- `window.TRUST_BLOCK_CONFIG` 내용 (법령 기준)
- 카테고리 (breadcrumb으로 확인)
- JSON-LD FAQPage 기존 항목

### 3) 보강 섹션 생성

아래 **삽입 위치**와 **섹션 구조**에 따라 3개 guide-card + FAQ 2개 작성.
주제에 맞게 실제 내용으로 채운다. 패딩 금지.

**카테고리별 사전 작업**:

- **부동산**: 시세·세율 작성 시 "2026년 기준" 명시
- **건강**: 의료 단정 표현 자가 검증 (정상/비정상 → 참고 범위). "전문의 상담 권장" 포함
- **금융**: "2026년 기준" 명시, 금리·세율 수치 정확히

**섹션별 최소 분량 (필수 준수)**:

| 섹션 | 최소 자수 | 구성 |
|------|----------|------|
| 섹션 1 (계산 원리) | 400자 이상 | 도입 1-2문장 + 4-5단계 또는 3개 guide-box (각 80자+) |
| 섹션 2 (실제 예시) | 800자 이상 | 예시 2개, 각 350자+ (상황 설명 + 입력값/계산 결과 + 해석 1문장) |
| 섹션 3 (주의사항) | 400자 이상 | 도입 1-2문장 + 3-4개 항목 (각 100자+) |
| FAQ 신규 2개 | 각 150자 이상 | 3-4문장 답변 |
| FAQ 기존 확장 | 답변 50자 미만만 | 100자 이상으로 확장 |

### 4) HTML 삽입 (Edit 도구) - 표준 패턴

**삽입 위치**: 첫 번째 `guide-card` (언제 쓰나요?) 닫힘 태그와 `faq-card` 사이.

**Edit old_string 유일성 확보**: 첫 번째 guide-card 마지막 guide-box의 unique 텍스트를 포함해서 잡는다.

```
        <div class="guide-box"><strong>{마지막 항목}</strong><span>{텍스트}</span></div>
      </div>
    </div>
    <div class="guide-card faq-card">
```

섹션 3개를 **한 Edit 호출로** 통합 삽입 (개별 Edit 금지).

### 4a) HTML 삽입 - 비표준 패턴 (health)

`<section class="guide-section seo-card">` 구조 사용 (body-fat 처리 때 확정된 패턴).

- 삽입 시 새 섹션도 `<section class="guide-section seo-card">` 형식
- 삽입 위치: 첫 번째 section 닫힘과 faq-card 시작 사이
- 들여쓰기 2칸

### 5) FAQ 추가 (Edit 도구)

기존 FAQ 마지막 항목 뒤에 2개 추가. old_string은 마지막 faq-item + update-note 시작부분으로 잡는다.

### 6) JSON-LD FAQPage 통째 교체

기존 한 줄 전체를 새 6개 항목(기존 N개 + 신규 2개)으로 교체. HTML FAQ와 질문 텍스트 100% 일치.

```
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[...6개...]}</script>
```

### 7) description 메타 태그

60자 미만이면 80-130자로 확장. 3곳(description, og:description, twitter:description) replace_all=true로 동기화.

### 8) lastReviewed 날짜 갱신

- `window.ARTICLE_INFO_CONFIG`의 `lastReviewed` → `'2026.05.DD'` (작업일)
- `window.TRUST_BLOCK_CONFIG`의 `lastReviewed` → `'2026.05'`

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

2,800자 미만이면 예시 섹션 보강 후 재확인.

### 10) 이 스킬 파일 갱신

완료 목록에 추가:
```
- calc/{경로} ({YYYY-MM-DD} 보강, 옵션{X}, N,NNN자)
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
- `example-block`, `example-label`, `guide-steps`, `highlight-box` (일부 페이지 inline에만 있음)
- 기타 임의 클래스

---

## 삽입 섹션 구조

### 섹션 1: 계산 원리 · 공식

**옵션 A: guide-grid 사용 (3개 핵심 항목 강조)**
```html
    <div class="guide-card">
      <h2>{계산기명} 계산 방법</h2>
      <p>{계산 원리 설명 2-3문장. 법령·기준 명시.}</p>
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
        <li><strong>4단계.</strong> {내용}</li>
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

## 글쓰기 규칙

- em dash(—) 금지, 하이픈(-) 사용
- "~알아보겠습니다", "~정리해드리겠습니다", "~살펴보겠습니다" 금지
- "다양한", "여러 가지" 등 막연한 표현 금지, 수치/사례로 대체
- 하이픈(-) 으로 시작하는 리스트 금지, `<ul><li>` 사용
- 단정 표현 금지 ("반드시 ~이다" → "~일 수 있습니다" / "~를 권장합니다")
- 의료 단정 금지 (health 카테고리는 "전문의 상담 권장" 자연스럽게 포함)
- 수치 없는 추상 설명 금지
- 인물 예시는 가상 인물 (실명 금지)

## 절대 변경하지 않는 것

- 계산기 UI (`<div class="card">`, `<div class="result-card">`)
- `<div class="page-header">` 내용 (제목/뱃지/설명)
- `<div class="sibling-section">` 내용
- `window.TRUST_BLOCK_CONFIG`의 `standard`, `references` 필드
- `window.ARTICLE_INFO_CONFIG`의 `author`, `reviewBasis`, `referenceOrg`, `category`
- BreadcrumbList JSON-LD / WebApplication JSON-LD
- 기존 FAQ 질문 텍스트 (답변 확장은 가능)
- `<script>` 계산 로직
- 페이지별 inline `<style>` 블록

## Edit 호출 압축 가이드

한 페이지당 Edit 호출 **5-7회**.

| 작업 | Edit 횟수 |
|------|----------|
| guide-section에 섹션 3개 통합 삽입 | 1회 |
| FAQ 2개 추가 | 1회 |
| JSON-LD FAQPage 통째 교체 | 1회 |
| description 확장 (60자 미만일 때만) | 0-1회 |
| lastReviewed 갱신 (ARTICLE_INFO + TRUST_BLOCK) | 2회 |

## 검증 체크리스트

```
□ 순수 텍스트 2,800자 이상
□ 새 섹션 3개 삽입 확인
□ FAQ 기존+신규 2개 확인
□ JSON-LD FAQPage HTML FAQ와 질문 개수·내용 일치
□ em dash(—) 없음
□ CSS 클래스 전역 정의 클래스만 사용
□ description 60자 이상
□ lastReviewed 작업일 날짜
□ 기존 계산기 UI 코드 변경 없음
```

---

## 결과 요약 형식

```
## jpt-calc-bolster 결과 (2026-05-XX)

| 파일 | 옵션 | 보강 전 | 보강 후 |
|------|-----|---------|---------|
| calc/... | A | 1,796자 | 3,XXX자 |

**진행 현황: N개 완료 / 36개**
**남은 것: M개**
```

---

## 모든 대상 보강 완료 시

전체 36개가 완료 목록에 포함되면:
1. 사용자에게 메시지 출력:
   ```
   jptcalc calc 페이지 36개 보강 완료.
   다음 단계: /jpt-blog-bolster (5/13 시작) → 애드센스 신청(5/21).
   이 스킬(/jpt-calc-bolster)을 삭제합니다.
   ```
2. 이 파일(`/home/tjd618/jptcalc/.claude/commands/jpt-calc-bolster.md`) 삭제
3. 전역 심링크도 제거:
   ```bash
   rm /home/tjd618/.claude/commands/jpt-calc-bolster.md
   ```

$ARGUMENTS

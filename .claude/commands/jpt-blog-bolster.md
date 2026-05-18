---
description: 제이퍼 계산기 블로그 thin 글 보강 - 본문에 새 섹션 추가해 5,000자 이상으로 끌어올림
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 제이퍼 계산기 블로그 thin 글 보강

`/blog/posts/` 하위 글 중 순수 텍스트 3,500자 미만인 글의 `<div class="post-body">` 본문에
**새 섹션 2-3개 + FAQ 확장**을 삽입해 5,000자 이상으로 끌어올린다.

**중요**: 이 사이트의 블로그 글은 `<article>` 태그를 사용하지 않고 `<div class="post-body">` 구조다. 스킬 곳곳에서 이를 기준으로 판단한다.

기존 도입부(`/rewrite`로 다듬은 자연스러운 문체), 제목, 카테고리, 마무리 결론은 건드리지 않는다.
모든 대상 글 보강 완료 시 이 스킬 파일을 삭제한다.

## 실행 일정
- **시작일**: 2026-05-13
- **진행 속도**: 하루 3편 (사용자 명시 없을 시)
- **애드센스 신청 목표**: 2026-05-21 - 5/20까지 23편 전수 보강 완료 필요
- 23편 / 하루 3편 = 8일 → 5/13-5/20 (5/21 신청)

## 목표 분량 기준

- **보강 대상**: 순수 텍스트(태그 제외) **3,500자 미만** 블로그 글
- **목표**: **5,000자 이상**
- 평균 추가량: 약 1,860자/편

측정 명령어:
```bash
python3 -c "
import re, glob
files = sorted(glob.glob('/home/tjd618/jptcalc/blog/posts/*.html'))
results = []
for f in files:
    html = open(f).read()
    m = re.search(r'<div class="post-body"[^>]*>(.*?)</div>\s*</div>\s*<footer', html, re.DOTALL)
    if not m:
        m = re.search(r'<div class="post-body"[^>]*>(.*?)</main>', html, re.DOTALL)
    body = m.group(1) if m else html
    body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<style.*?</style>', '', body, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', body)
    text = re.sub(r'\s+', ' ', text).strip()
    results.append((len(text), f.replace('/home/tjd618/jptcalc/','')))
results.sort()
for n, f in results:
    if n < 3500:
        print(f'{n:5d}자  {f}')
"
```

## 보강 완료 목록 (건너뛴다)

작업 완료 시 `- {파일명} ({YYYY-MM-DD} 보강, 유형{X}, N,NNN자)` 형식으로 추가.

**유형 누적 카운트 (목표 분산 비율, 23편 기준)**:
- 유형 A (인물 시나리오 추가): 17/6 ✓
- 유형 B (비교표 추가): 12/5 ✓
- 유형 C (단계별 가이드): 11/4 ✓
- 유형 D (자주 오해하는 부분): 12/3 ✓
- 유형 E (FAQ 확장): 17/3 ✓
- 유형 F (데이터/수치 보강): 8/2 ✓

- salary-comparison-guide.html (2026-05-12 보강, 유형A+C+D+E, 5,388자)
- weekday-calculator-guide.html (2026-05-13 보강, 유형A+B+C+E+F, 5,038자)
- withholding-tax-guide.html (2026-05-13 보강, 유형A+B+C+E, 5,133자)
- pet-adoption-cost-guide.html (2026-05-13 보강, 유형A+B+C+E, 5,116자)
- emergency-fund-guide.html (2026-05-14 보강, 유형A+B+D+E, 5,873자)
- cat-lifetime-cost.html (2026-05-14 보강, 유형A+B+F+E, 5,451자)
- vat-guide.html (2026-05-14 보강, 유형A+B+D+E, 5,600자)
- unemployment-benefit-guide.html (2026-05-15 보강, 유형B+A+C+E, 5,443자)
- income-tax-deduction.html (2026-05-15 보강, 유형D+B+A+E, 5,109자)
- blood-pressure-guide.html (2026-05-15 보강, 유형F+D+A+C, 5,302자)
- bmi-guide.html (2026-05-16 보강, 유형F+A+C+E, 5,290자)
- health-checkup-guide.html (2026-05-16 보강, 유형B+D+A+E, 5,151자)
- salary-5000-takehome.html (2026-05-16 보강, 유형D+A+C+E, 5,380자)
- severance-pay-guide.html (2026-05-17 보강, 유형B+C+D+F, 5,134자)
- deposit-interest-guide.html (2026-05-17 보강, 유형A+C+E+F, 5,528자)
- loan-repayment.html (2026-05-17 보강, 유형A+B+D+E, 5,390자)
- comprehensive-income-tax.html (2026-05-18 보강, 유형D+A+F+E, 5,710자)
- ai-infra-cost-guide.html (2026-05-18 보강, 유형A+C+D+E, 6,476자)
- claude-vs-gpt.html (2026-05-18 보강, 유형D+B+F+E, 5,785자)

## 대상 23편 (실측 기준 - post-body 본문만 측정, 짧은 순)

| # | 파일 | 카테고리 | 현재 | 추가 필요 |
|---|------|---------|------|---------|
| 1 | weekday-calculator-guide.html | 날짜 | 2,541자 | +2,459 |
| 2 | withholding-tax-guide.html | 세금 | 2,739자 | +2,261 |
| 3 | pet-adoption-cost-guide.html | 반려동물 | 2,750자 | +2,250 |
| 4 | emergency-fund-guide.html | 금융 | 2,778자 | +2,222 |
| 5 | cat-lifetime-cost.html | 반려동물 | 2,786자 | +2,214 |
| 6 | vat-guide.html | 세금 | 2,834자 | +2,166 |
| 7 | unemployment-benefit-guide.html | 연봉 | 2,835자 | +2,165 |
| 8 | income-tax-deduction.html | 세금 | 2,837자 | +2,163 |
| 9 | blood-pressure-guide.html | 건강 | 2,847자 | +2,153 |
| 10 | bmi-guide.html | 건강 | 2,874자 | +2,126 |
| 11 | salary-comparison-guide.html | 연봉 | 2,933자 | +2,067 |
| 12 | health-checkup-guide.html | 건강 | 2,950자 | +2,050 |
| 13 | salary-5000-takehome.html | 연봉 | 3,010자 | +1,990 |
| 14 | severance-pay-guide.html | 연봉 | 3,046자 | +1,954 |
| 15 | deposit-interest-guide.html | 금융 | 3,071자 | +1,929 |
| 16 | ai-infra-cost-guide.html | AI | 3,146자 | +1,854 |
| 17 | loan-repayment.html | 부동산 | 3,184자 | +1,816 |
| 18 | comprehensive-income-tax.html | 세금 | 3,205자 | +1,795 |
| 19 | jeonse-vs-wolse.html | 부동산 | 3,263자 | +1,737 |
| 20 | claude-vs-gpt.html | AI | 3,265자 | +1,735 |
| 21 | pet-insurance.html | 반려동물 | 3,318자 | +1,682 |
| 22 | freelancer-tax-refund.html | 세금 | 3,364자 | +1,636 |
| 23 | isa-guide.html | 금융 | 3,407자 | +1,593 |

평균 추가량: 약 1,995자/편

실행 전 측정 명령어로 실제 순서 재확인.

**카테고리 분포**:
세금 5 / 연봉 4 / 반려동물 3 / 건강 3 / 금융 3 / 부동산 2 / AI 2 / 날짜 1 = 23편

---

## 작업 순서

### 1) 대상 선정

위 측정 명령어 실행 → 3,500자 미만 중 완료 목록에 없는 **가장 짧은 3편** 선택.

**유형 분배 규칙**:
- 유형 누적 카운트를 보고 부족한 유형 우선 사용
- 같은 유형 연속 3편 사용 금지

### 2) 파일 읽기

```
Read /home/tjd618/jptcalc/blog/posts/{파일명}
```

확인할 것:
- H1 제목, 도입부 첫 문단 (톤 파악)
- 기존 H2 섹션 목록과 내용
- 기존 FAQ 항목 수와 내용
- JSON-LD FAQPage 항목 (있는 경우)
- post-tag (카테고리) 확인
- 글의 마무리 섹션 위치

### 3) 부족 분량 계산과 유형 조합

목표 5,000자 - 현재 측정값 = 추가 필요 분량 (안전 마진 +300자 확보)

**유형별 자수 (권장 분량 기준 강화)**:

| 유형 | 권장 자수 (최소) |
|------|----------------|
| A 시나리오 (인물 2명 + 해석) | **800자** |
| B 비교표 + 해석 | **600자** |
| C 단계별 가이드 | **700자** |
| D 오해 3개 + 핵심 박스 | **700자** |
| E FAQ 3-4개 신규 | **600자** |
| F 데이터 4-5개 + 해석 | **600자** |

**분량 구간별 의무 조합 (5,000자 + 마진 500자 = 5,500자 목표)**:

| 현재 자수 | 추가 필요 | 의무 조합 | 예시 |
|-----------|----------|----------|------|
| 2,500-2,800자 (5편) | +2,700자 | **5개 유형 의무** | A+B+C+D+E |
| 2,800-3,200자 (10편) | +2,300자 | **4개 유형 의무** | A+B+C+E |
| 3,200-3,500자 (8편) | +2,000자 | **3-4개 유형 의무** | A+B+E or A+C+D |

**합계 검증** (조합 + 권장 자수):
- 5개 (2,500자대): 800+600+700+700+600 = 3,400자 → 2,541+3,400 = 5,941자 ✓
- 4개 (2,800자대): 800+600+700+600 = 2,700자 → 2,800+2,700 = 5,500자 ✓
- 3개 (3,200자대): 800+700+600 = 2,100자 → 3,200+2,100 = 5,300자 ✓

**작성 시점 검증 권장**:
각 유형 작성 후 자수 측정 → 권장 자수 미달 시 해당 섹션 보강 → 전체 5,500자 도달 후 다음 단계.

### 4) 새 섹션 작성

아래 6가지 유형 중 부족 분량에 맞게 조합. 주제와 어울리는 유형 우선.

### 5) HTML 삽입 (Edit 도구)

**삽입 위치 우선순위** (실측 기준):
1. **FAQ 앞 cta-box (16/21편)**: `<div class="cta-box">` 직전 → 보강 섹션 → cta-box → FAQ 그대로
2. **FAQ 뒤 cta-box (5/21편)**: FAQ H2 직전 → 보강 섹션 → 기존 FAQ → cta-box 그대로

**FAQ H2 텍스트 변형 (실측 4가지)**:
- "자주 묻는 질문 (FAQ)" : 16편
- "자주 묻는 질문" : 4편
- "자주 놓치는 공제 항목" : 1편 (income-tax-deduction)
- "혈압 관련 흔한 궁금증" : 1편 (blood-pressure-guide)

**작업 절차**:
1. 파일 Read → cta-box와 FAQ 위치 확인 (어느 쪽이 먼저 나오는지)
2. cta-box가 FAQ보다 앞: cta-box 직전에 새 섹션 삽입
3. FAQ가 cta-box보다 앞: FAQ H2 직전에 새 섹션 삽입 (FAQ H2 텍스트는 위 4가지 중 그 글의 실제 값 사용)

**Edit old_string 유일성 확인**:
- `<div class="cta-box">`는 파일당 1회만 등장 (검증됨) → unique
- FAQ H2도 보통 1회만 등장 → unique
- grep으로 1회 매칭 확인 후 사용

### 6) FAQ 확장 (유형 E 또는 일부 유형 조합 시)

기존 FAQ `<div class="faq-item">` 마지막 뒤에 신규 추가.

```html
      <div class="faq-item">
        <div class="faq-q">새 질문</div>
        <p class="faq-a">3-4문장 답변.</p>
      </div>
```

### 7) JSON-LD FAQPage 업데이트 (FAQ 추가 시)

블로그 글의 FAQPage JSON-LD는 **여러 줄로 expand** 되어있다 (계산기 페이지의 minified 한 줄과 다름).

**처리 방법**:
- 기존 JSON-LD FAQPage 블록 전체를 Read로 정확히 확인
- 새 항목 추가하되 들여쓰기·줄바꿈 패턴 유지
- Edit으로 마지막 `}` 닫힘 직전에 신규 항목 삽입

**주의**: 모든 글에 FAQPage JSON-LD가 있는 건 아님. 없으면 HTML FAQ만 추가, JSON-LD 신규 작성은 안 함 (구조 안전).

### 8) dateModified 갱신

JSON-LD Article 스키마의 `"dateModified": "YYYY-MM-DD"`를 작업일로 갱신.
`"datePublished"`는 변경 금지.

```bash
date +%Y-%m-%d  # dateModified용
```

### 9) 분량 검증

```bash
python3 -c "
import re
html = open('/home/tjd618/jptcalc/blog/posts/{파일명}').read()
m = re.search(r'<div class=\"post-body\"[^>]*>(.*?)</div>\s*</div>\s*<footer', html, re.DOTALL)
if not m:
    m = re.search(r'<div class=\"post-body\"[^>]*>(.*?)</main>', html, re.DOTALL)
body = m.group(1) if m else html
body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL)
body = re.sub(r'<style.*?</style>', '', body, flags=re.DOTALL)
text = re.sub(r'<[^>]+>', ' ', body)
text = re.sub(r'\s+', ' ', text).strip()
print(f'{len(text)}자')
"
```

5,000자 미만이면 추가 섹션 1개 더 삽입 후 재확인.

### 10) 이 스킬 파일 갱신

완료 목록에 추가:
```
- {파일명} (2026-05-1X 보강, 유형{X}, X,XXX자)
```

유형 누적 카운트 갱신.

---

## 사용 가능한 CSS 클래스 (검증됨, 21편 inline style 실측)

블로그 글 inline `<style>` 블록에 정의되어 안전하게 사용 가능:
- `highlight-box` - 강조 박스 (orange border-left, 21/21편 사용)
- `table-wrap`, `<table>`, `<th>`, `<td>` - 표 (테이블 가로 스크롤 래퍼 포함)
- `td.rate` - 테이블 내 수치 강조 (orange, font-weight: 700)
- `td.total-rate` - 테이블 합계 강조
- `cta-box`, `cta-btn` - CTA 박스와 버튼
- `faq-item`, `faq-q`, `faq-a` - FAQ
- `<h2>`, `<h3>` - 섹션 제목 (자동 스타일)
- `<ul>`, `<ol>`, `<li>` - 리스트

**금지**:
- `<article>` 태그 사용 금지 (이 사이트 구조에 없음)
- 임의 클래스 (`example-block`, `tip-box`, `info-box` 등) 도입 금지
- 새 inline `<style>` 추가 금지
- 기존 inline `<style>` 수정 금지

---

## 보강 섹션 유형

### 유형 A: 인물 기반 추가 시나리오 (500-700자)

기존 글에 인물 시나리오가 1-2개 있으면 다른 케이스 1-2개 추가.

```html
<h2>다른 상황은 어떨까요</h2>
<p>도입 1-2문장. 왜 이 케이스를 추가했는지.</p>
<h3>{이름}({나이}, {직업/상황})</h3>
<p>구체적 상황 설명. 입력값 명시.</p>
<ul>
  <li>{항목}: {결과}</li>
  <li>{항목}: {결과}</li>
  <li><strong>{핵심 결과}: {최종값}</strong></li>
</ul>
<p>해석 1-2문장. 앞 시나리오와 차이점.</p>
<h3>{이름}({나이}, {다른 상황})</h3>
<p>...</p>
<div class="highlight-box">
  <p>핵심: {두 케이스 비교에서 얻는 인사이트}</p>
</div>
```

### 유형 B: 비교표 추가 (300-500자)

옵션별 / 케이스별 / 단계별 비교를 표로 정리.

```html
<h2>{비교 주제} 한눈에 비교</h2>
<p>도입 1-2문장.</p>
<div class="table-wrap">
  <table>
    <thead>
      <tr><th>구분</th><th>옵션 A</th><th>옵션 B</th><th>비고</th></tr>
    </thead>
    <tbody>
      <tr><td>{기준1}</td><td>{값}</td><td>{값}</td><td>{설명}</td></tr>
      <tr><td>{기준2}</td><td>{값}</td><td>{값}</td><td>{설명}</td></tr>
      <tr><td>{기준3}</td><td>{값}</td><td>{값}</td><td>{설명}</td></tr>
    </tbody>
  </table>
</div>
<p>표 해석 2-3문장. 결정 가이드.</p>
```

### 유형 C: 단계별 실행 가이드 (400-600자)

"이렇게 하세요" 체크리스트.

```html
<h2>{주제} 진행 단계</h2>
<p>도입 1-2문장. 왜 이 순서인지.</p>
<ol>
  <li><strong>1단계 - {제목}.</strong> {구체적 행동과 기준}</li>
  <li><strong>2단계 - {제목}.</strong> {구체적 행동과 기준}</li>
  <li><strong>3단계 - {제목}.</strong> {구체적 행동과 기준}</li>
  <li><strong>4단계 - {제목}.</strong> {구체적 행동과 기준}</li>
  <li><strong>5단계 - {제목}.</strong> {구체적 행동과 기준}</li>
</ol>
<p>마무리 1-2문장. 다음에 할 일.</p>
```

### 유형 D: 자주 오해하는 부분 (400-600자)

별도 H2 섹션으로 오해를 풀어줌.

```html
<h2>이런 오해는 조심하세요</h2>
<p>도입 1-2문장.</p>
<h3>오해 1: {잘못된 통념}</h3>
<p>실제는 {정확한 내용}. 근거 1-2문장.</p>
<h3>오해 2: {잘못된 통념}</h3>
<p>실제는 {정확한 내용}. 근거 1-2문장.</p>
<h3>오해 3: {잘못된 통념}</h3>
<p>실제는 {정확한 내용}. 근거 1-2문장.</p>
<div class="highlight-box">
  <p>핵심: {3개 오해의 공통 원인 또는 판단 기준}</p>
</div>
```

### 유형 E: FAQ 확장 (300-500자)

기존 FAQ + 3-4개 추가. 기존 짧은 답변(50자 미만)도 확장.

```html
<div class="faq-item">
  <div class="faq-q">{새 질문 1}</div>
  <p class="faq-a">{3-4문장 답변}</p>
</div>
<div class="faq-item">
  <div class="faq-q">{새 질문 2}</div>
  <p class="faq-a">{3-4문장 답변}</p>
</div>
<div class="faq-item">
  <div class="faq-q">{새 질문 3}</div>
  <p class="faq-a">{3-4문장 답변}</p>
</div>
```

### 유형 F: 데이터/수치 보강 (300-500자)

통계, 비율, 추이 데이터 추가.

```html
<h2>{주제} 관련 핵심 수치</h2>
<p>도입 1-2문장 + 출처 명시.</p>
<ul>
  <li><strong>{지표 1}:</strong> {수치 + 설명}</li>
  <li><strong>{지표 2}:</strong> {수치 + 설명}</li>
  <li><strong>{지표 3}:</strong> {수치 + 설명}</li>
  <li><strong>{지표 4}:</strong> {수치 + 설명}</li>
</ul>
<p>해석 1-2문장. 어떤 의사결정에 활용할 수 있는지.</p>
```

---

## 카테고리별 권장 유형 조합 (다양성 분산, 23편)

자수 부족분에 맞게 2-5개 조합. **2,500-2,800자대 5편은 4-5개 조합 의무**.

| 카테고리 | 페이지 수 | 권장 조합 (자수대별) |
|---------|----------|----------|
| 세금 (5) | withholding-tax 2,739자 | A+B+C+E (4개) |
| 세금 | vat 2,834자 / income-tax-deduction 2,837자 | A+C+E (3개) |
| 세금 | comprehensive-income-tax 3,205자 / freelancer-tax-refund 3,364자 | A+E or B+D |
| 연봉 (4) | unemployment 2,835자 / salary-comparison 2,933자 | A+B+E or C+D+F |
| 연봉 | salary-5000 3,010자 / severance 3,046자 | A+C or B+E |
| 반려동물 (3) | pet-adoption 2,750자 / cat-lifetime 2,786자 | A+B+C+E (4개) |
| 반려동물 | pet-insurance 3,318자 | A+F |
| 건강 (3) | blood-pressure 2,847자 / bmi 2,874자 / health-checkup 2,950자 | A+E+F or B+C+D |
| 금융 (3) | emergency-fund 2,778자 | A+B+C+E (4개) |
| 금융 | deposit-interest 3,071자 / isa-guide 3,407자 | C+B or A+F |
| 부동산 (2) | loan-repayment 3,184자 / jeonse-vs-wolse 3,263자 | B+C or D+A |
| AI (2) | ai-infra-cost 3,146자 / claude-vs-gpt 3,265자 | F+B or D+C |
| 날짜 (1) | weekday 2,541자 | **A+B+C+E+F (5개) 의무** |

---

## 글쓰기 규칙

- em dash(—) 금지, 하이픈(-) 사용
- "~알아보겠습니다", "~정리해드리겠습니다" 금지
- "다양한", "여러 가지" 금지, 수치/사례로 대체
- 단정 표현 금지 ("반드시" → "보통" / "권장")
- 의료 단정 금지 (건강 카테고리는 "전문의 상담 권장" 포함)
- AI 가격 인용 시 "2026년 X월 기준" 필수
- 인물 예시는 가상 인물 (실명 금지)
- **기존 글의 톤 유지** (구어체면 구어체, 격식체면 격식체로)

---

## 절대 변경하지 않는 것

- H1 제목
- 도입부 첫 문단 (`/rewrite`로 다듬은 결과 유지)
- 기존 H2 섹션 텍스트와 순서
- 글 마무리 섹션 (결론·요약·체크리스트 박스 등)
- post-tag (카테고리)
- post-meta (작성일, 읽기 시간)
- canonical, og:url
- BreadcrumbList JSON-LD
- Article 스키마의 `datePublished`, `headline`, `author`
- cta-box (계산기 링크)
- inline `<style>` 블록

## 변경 가능한 것

- `<div class="post-body">` 본문에 새 H2 섹션 추가 (cta-box 또는 FAQ 앞 중 먼저 나오는 곳)
- 기존 FAQ 답변 50자 미만이면 확장
- FAQ 신규 추가
- Article JSON-LD `dateModified` 갱신
- FAQPage JSON-LD 항목 추가 (있는 경우만)

---

## Edit 호출 압축 가이드

페이지당 Edit 호출 4-6회 범위.

| 작업 | Edit 횟수 |
|------|----------|
| 본문 새 섹션 통합 삽입 (2-3개 묶어서) | 1 |
| FAQ 신규 추가 (FAQ 확장 시) | 0-1 |
| FAQ 기존 답변 확장 (50자 미만만) | 0-2 |
| JSON-LD FAQPage 항목 추가 (있는 경우) | 0-1 |
| dateModified 갱신 | 1 |
| **총합** | **2-6회** |

---

## 검증 체크리스트

```
□ 순수 텍스트 5,000자 이상 (측정 명령어로 확인)
□ 새 섹션이 post-body 안 cta-box/FAQ 앞에 위치
□ 기존 H2 섹션 텍스트 변경 없음
□ 도입부 첫 문단 변경 없음
□ 글 마무리/결론 섹션 변경 없음
□ em dash(—) 없음 (grep -c '—')
□ "알아보겠습니다", "살펴보겠습니다" 등 AI 패턴 없음
□ 사용한 CSS 클래스가 inline style 정의 클래스인지 확인
□ FAQPage JSON-LD가 있다면 HTML FAQ와 항목 수 일치
□ dateModified 작업일 날짜
□ datePublished 변경 없음
□ HTML 문법 오류 없음 (태그 열닫힘 쌍)
□ 기존 글 톤과 일관성 (구어체/격식체 매칭)
```

분량 미달 시 (5,000자 미만):
- 유형 1개 더 추가 (가장 가벼운 유형 E 또는 F)
- 인물 시나리오 해석 부분 더 길게
- 표 행 추가

---

## 결과 요약 형식

```
## jpt-blog-bolster 결과 (2026-05-1X)

| 파일 | 카테고리 | 유형 | 보강 전 | 보강 후 | 추가 섹션 |
|------|---------|-----|---------|---------|----------|
| weekday-calculator-guide.html | 날짜 | A+C | 2,710자 | 5,150자 | 시나리오 추가, 단계 가이드 |
| withholding-tax-guide.html | 세금 | A+E | 2,935자 | 5,080자 | 시나리오 추가, FAQ 확장 |
| pet-adoption-cost-guide.html | 반려동물 | A+F | 2,938자 | 5,200자 | 시나리오 추가, 데이터 |

**유형 사용 누적 (목표 분산)**: A {n}/6 / B {n}/5 / C {n}/4 / D {n}/3 / E {n}/3 / F {n}/2
**진행 현황: N편 완료 / 23편 전체**
**남은 글: M편 (하루 3편 기준 D일 소요)**
**AdSense 신청 목표 5/21 기준 D-{N}일**

### 다음 작업일 대상 3편 (자동 선정)

| # | 다음 대상 | 카테고리 | 권장 유형 | 현재 자수 |
|---|----------|---------|----------|----------|
| 1 | {파일} | {카테고리} | {유형} | {자수}자 |
| 2 | ... | | | |
| 3 | ... | | | |

**다음 작업 명령어**: `/jpt-blog-bolster` (기본 3편) 또는 `/jpt-blog-bolster N` (개수 지정)
```

---

## 모든 대상 보강 완료 시

전체 23편이 완료 목록에 포함되면:
1. 사용자에게 메시지:
   ```
   jptcalc 블로그 thin 23편 보강 완료.
   사이트 5,000자 미만 글 비율 큰 폭 감소 - AdSense 신청(5/21) 준비 강화.
   이 스킬(/jpt-blog-bolster)을 삭제합니다.
   ```
2. 이 파일(`/home/tjd618/jptcalc/.claude/commands/jpt-blog-bolster.md`) 삭제
3. 전역 심링크도 제거:
   ```bash
   rm /home/tjd618/.claude/commands/jpt-blog-bolster.md
   ```

$ARGUMENTS

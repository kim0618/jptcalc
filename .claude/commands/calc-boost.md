---
description: 계산기 페이지 콘텐츠 보강 - JSON-LD FAQ를 화면에 표시하고 가이드 콘텐츠 추가
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 계산기 페이지 콘텐츠 보강

JSON-LD에 FAQ가 있지만 화면에 보이지 않는 calc 페이지에 **가시적 FAQ + 가이드 콘텐츠**를 추가한다.
구조화 데이터와 실제 화면 콘텐츠 불일치를 해소하고, thin content 문제를 개선한다.

## 보강 완료된 페이지 (건너뛴다)

1. realestate/pyeong - guide-section + FAQ 4개 화면 표시
2. realestate/brokerage - guide-section + FAQ 4개 화면 표시
3. realestate/loan - guide-section + FAQ 3개 화면 표시
4. realestate/rental - guide-section + FAQ 3개 화면 표시
5. realestate/registry - guide-section + FAQ 4개 화면 표시
6. realestate/propertytax - guide-section + FAQ 4개 화면 표시
7. realestate/inheritance - guide-section + FAQ 4개 화면 표시

## 대상 페이지

### A그룹: 가이드 섹션 없음 + FAQ 화면 미표시 (9개, 우선 처리)

전부 /calc/realestate/ 경로. 기존 h3 설명은 있지만 guide-section 구조가 아니고, FAQ가 JSON-LD에만 존재.

```
1. realestate/pyeong       (평수변환)
2. realestate/brokerage    (중개보수)
3. realestate/loan         (대출이자)
4. realestate/rental       (전월세전환/임대수익률)
5. realestate/registry     (등기비용)
6. realestate/propertytax  (재산세)
7. realestate/inheritance  (상속세)
8. realestate/joint        (공동명의)
9. realestate/jongbu       (종부세)
```

### B그룹: 가이드 있음 + FAQ 화면 미표시 (5개)

guide-card는 있지만 faq-item이 없는 건강 카테고리 페이지.

```
10. health/bmi        (BMI 계산기)
11. health/bmr        (기초대사량)
12. health/body-fat   (체지방률)
13. health/calories   (칼로리 계산기)
14. health/ideal-weight (표준체중)
```

---

## 편수 원칙 (최우선)
- **사용자가 명시하지 않으면 반드시 7개만 작업한다.**
- 사용자가 "전부", "10개" 등 명시한 경우에만 그 수를 따른다.

## 작업 순서

1. 위 "보강 완료된 페이지" 목록과 대조해서 다음 대상 확인
2. 각 페이지의 index.html 읽기
3. JSON-LD FAQPage에서 기존 FAQ 질문/답변 추출
4. 아래 "보강 방법"에 따라 콘텐츠 삽입
5. 보강 후 이 파일의 "보강 완료된 페이지" 목록에 추가
6. 결과 요약 출력

---

## 보강 방법

### A그룹 (가이드 없음) - 두 가지 추가

#### 1) guide-section 추가

`</main>` 바로 앞에 삽입. 기존 sibling-section이 있으면 그 앞에 삽입.

```html
<div class="guide-section">
  <div class="guide-card">
    <h2>{계산기 이름}은 언제 쓰나요?</h2>
    <p>{1~2문장 설명 - 이 계산기가 어떤 상황에서 유용한지}</p>
    <div class="guide-grid">
      <div class="guide-box"><strong>{활용 1}</strong><span>{구체적 설명}</span></div>
      <div class="guide-box"><strong>{활용 2}</strong><span>{구체적 설명}</span></div>
      <div class="guide-box"><strong>{활용 3}</strong><span>{구체적 설명}</span></div>
    </div>
  </div>
  <div class="guide-card faq-card">
    <h2>자주 묻는 질문</h2>
    {faq-item 3~5개 - JSON-LD의 기존 FAQ를 화면용으로 변환}
    <div class="update-note">최종 검토: 2026.04.15 · 계산 결과는 참고용입니다.</div>
  </div>
</div>
```

#### 2) FAQ 화면 표시

JSON-LD FAQPage에 이미 있는 질문/답변을 **동일한 내용으로** 화면에 faq-item으로 표시한다.
단, 화면용은 간결하게 줄여도 된다 (JSON-LD 원문은 변경 금지).

```html
<div class="faq-item"><h3>{질문}</h3><p>{답변 - JSON-LD 내용 기반, 2~3문장으로 축약 가능}</p></div>
```

### B그룹 (가이드 있음, FAQ만 없음) - FAQ만 추가

기존 guide-section 안에 있는 마지막 guide-card 뒤에 faq-card를 추가한다.

```html
<div class="guide-card faq-card">
  <h2>자주 묻는 질문</h2>
  {faq-item 3~5개}
  <div class="update-note">최종 검토: 2026.04.15 · 계산 결과는 참고용입니다.</div>
</div>
```

FAQ 내용은 해당 페이지의 JSON-LD FAQPage에서 가져온다. JSON-LD가 없으면 새로 작성하고 JSON-LD도 함께 추가한다.

---

## guide-section CSS 확인

삽입 전에 해당 페이지가 사용하는 CSS 파일(예: `realestate-common.css`, `health-common.css`)에 `.guide-section`, `.guide-card`, `.guide-grid`, `.guide-box`, `.faq-card`, `.faq-item` 스타일이 포함되어 있는지 확인한다.

이미 다른 calc 페이지에서 사용 중이므로 공통 CSS에 있을 가능성이 높다. 없으면 해당 CSS 파일 확인 후 알려줄 것.

---

## 절대 변경하지 않는 것

- 기존 JSON-LD (FAQPage, WebApplication, BreadcrumbList)
- 기존 본문 콘텐츠 (h3 설명, 표, 계산 결과 영역)
- 계산기 JS 로직
- CSS 클래스, 레이아웃
- meta 태그, canonical, og 태그
- 기존 sibling-section

## 변경해도 되는 것

- `</main>` 앞에 guide-section 삽입
- 기존 guide-section 안에 faq-card 추가
- ARTICLE_INFO_CONFIG의 lastReviewed 날짜 업데이트

---

## 글쓰기 금지사항

- em dash(—) 사용 금지, 하이픈(-) 사용
- "계산기으로" 사용 금지, "계산기로"가 올바른 표현
- "공인인증서" 사용 금지, "공동인증서"로 작성
- "~정리합니다", "~알아보겠습니다" 남발 금지 (페이지당 1회 이하)
- 분량 채우기용 중복·반복 문장 금지
- 수치 없는 추상적 설명 금지
- FAQ 답변은 구체적 수치 포함 (예: "~는 약 3.3%입니다")
- 다른 calc 페이지의 FAQ와 동일한 문장 구조 반복 금지 (의식적으로 문체 변형)

---

## 결과 요약 형식

```
## 계산기 페이지 보강 결과

| 페이지 | 추가 내용 |
|--------|----------|
| realestate/pyeong | guide-section + FAQ 4개 화면 표시 |
| realestate/brokerage | guide-section + FAQ 3개 화면 표시 |

**진행 현황: 보강 완료 N개 / 전체 14개 (N%)**
**남은 페이지: N개**
```

---

## 모든 페이지 보강 완료 시

전체 14개가 보강 완료 목록에 포함되면:
1. 사용자에게 아래 메시지 출력:
```
전체 14개 계산기 페이지 보강 완료!
JSON-LD ↔ 화면 콘텐츠 불일치 해소.
이 스킬(/calc-boost)을 삭제합니다.
```
2. 이 스킬 파일 삭제
3. 일일 루틴에서 /calc-boost 항목 제거 알림

$ARGUMENTS

---
description: 제이퍼 계산기 블로그 기존 글 문체 수정 (AI 톤 제거, 매일 3편씩)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 기존 블로그 글 문체 수정

매일 3편씩 기존 블로그 글의 문체를 자연스럽게 수정한다.
모든 글 수정이 완료되면 이 스킬 파일을 삭제한다.

## 수정 완료된 글 (건너뛴다)
- four-insurance-vs-33-comparison.html
- realestate-agent-fee.html
- subscription-score-guide.html
- bmi-guide.html
- freelancer-tax-refund.html
- cat-lifetime-cost.html
- savings-maturity-guide.html
- salary-comparison-guide.html
- ai-saas-cost-guide.html
- annual-leave-guide.html
- acquisition-tax-2026.html
- visceral-fat-guide.html
- gift-tax-guide.html
- social-insurance-guide.html
- military-discharge-date.html
- pet-cost-saving-tips.html
- blood-pressure-guide.html
- pet-senior-care-guide.html
- unemployment-benefit-guide.html
- withholding-tax-guide.html
- bmr-calories.html
- capital-gains-tax.html
- compound-interest.html

## 작업 순서

1. `/home/tjd618/jptcalc/blog/posts/` 에서 전체 파일 목록 확인
2. 위 "수정 완료된 글" 목록과 대조해서 아직 수정 안 된 글 파악
3. 미수정 글 중 **3편** 선택 (아래 우선순위 기준)
4. 3편 수정 진행
5. 수정 완료 후 이 파일의 "수정 완료된 글" 목록에 파일명 추가
6. 결과 요약 출력

### 선택 우선순위
- blog/index.html의 post-grid에서 각 카테고리 필터 클릭 시 상단에 노출되는 글부터
- 아직 수정 안 된 카테고리의 글 우선

---

## 수정 원칙

### 절대 변경하지 않는 것
- 데이터/표/수치 (금액, 요율, 계산 예시 등 모든 숫자)
- HTML 구조 (CSS 클래스, 태그, 레이아웃)
- 내부 링크, CTA 버튼, FAQ 내용
- JSON-LD, script 블록
- SVG 인포그래픽

### 변경하는 것 (문체/톤만)

**도입부 (5가지 패턴 돌려쓰기, 직전 수정한 글과 다른 패턴 사용):**
1. 질문으로 시작: "혹시 ~해본 적 있으신가요?"
2. 결론 먼저: "결론부터 말하면, ~입니다."
3. 상황 묘사: "계약서에 사인하기 직전, 갑자기 ~"
4. 통계/팩트: "2026년 기준 ~는 00만원입니다."
5. 반전: "~라고 생각하기 쉽지만, 실제로는 ~"

**h2 제목:**
- "~완벽 정리", "~총정리", "~한눈에 보기" 같은 AI 패턴 제거
- 구어체/질문형으로 변경: "그래서 얼마인데?", "이건 함정이다", "왜 이렇게 되는 걸까"

**본문:**
- 짧은 문장 섞기: "핵심은 이겁니다.", "답은 간단합니다.", "여기서 주의할 점이 하나 있는데요."
- 필자의 판단/의견 넣기: "개인적으로는 ~가 더 낫다고 봅니다"
- 독자에게 말 거는 톤: "여기서 주의할 점이 하나 있는데요."

**"마무리" 섹션 제목 (매번 다르게):**
- "한 줄 요약", "핵심만 뽑으면", "체크리스트", "결국 중요한 건", "정리하면", "한줄 요약", "입양 전에 숫자부터 보세요" 등

**금지:**
- "~정리합니다", "~알아보겠습니다" 패턴: 전체 글에서 1회 이하
- em dash(—) 사용 금지, 하이픈(-) 사용

---

## 결과 요약 형식

수정 작업 완료 후 반드시 아래 형식으로 요약한다:

```
## 문체 수정 결과

| 파일 | 주요 변경 |
|------|----------|
| xxx.html | 도입부 질문형, h2 구어체로, 마무리→"핵심만 뽑으면" |
| yyy.html | 도입부 결론먼저, h2 질문형으로, 마무리→"체크리스트" |
| zzz.html | 도입부 상황묘사, h2 반전형으로, 마무리→"결국 중요한 건" |

**진행 현황: 수정 완료 N편 / 전체 63편 (N%)**
**남은 글: N편**
```

---

## 모든 글 수정 완료 시

전체 63편이 수정 완료 목록에 포함되면:
1. 사용자에게 "전체 문체 수정 완료" 알림
2. 이 스킬 파일(`/home/tjd618/.claude/commands/rewrite.md`)을 삭제

$ARGUMENTS

---
description: 부모혜택 콘텐츠 작성 (주제 자동 선정, 구조 다양화 적용, 파일 생성 + index + 빌드)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 부모혜택 콘텐츠 작성

## 편수 원칙 (최우선)
- **사용자가 명시하지 않으면 반드시 1편만 작성한다.**
- 사용자가 "3개", "2편" 등 명시한 경우에만 그 수를 따른다.

## 사전 확인
1. `src/data/articles/*/*.ts` 파일 목록 전체 확인 (index.ts 제외) - 기존 slug 파악
2. 각 카테고리의 index.ts에서 글 수 확인
3. 가장 글이 적은 카테고리를 우선 선정 (동률이면 허브 커버리지 적은 쪽)
4. 기존 글과 겹치지 않는 주제 선정
5. 기존 글 1개 읽어서 구조/분량 파악
6. **직전 3개 글의 도입부 패턴 확인** (diversify-done.txt 또는 최근 createdAt 글)

### 시의성 체크 (주제 선정 전 필수)
- 오늘 날짜 기준 **3개월 이상 미래의 이벤트**를 주제로 하지 않는다.
- **이미 지난 이벤트**를 "올해" 기준으로 쓰지 않는다.

사용자가 카테고리나 주제를 지정하면 그것을 따르고, 지정하지 않으면 위 기준으로 자동 선정한다.
**선정한 주제 목록을 먼저 보여주고 승인받은 후 작성 시작한다.**

---

## 파일 위치/구조

글은 카테고리별 디렉토리에 slug 이름으로 개별 파일로 저장:
- `src/data/articles/pension-welfare/{slug}.ts`
- `src/data/articles/health-care/{slug}.ts`
- `src/data/articles/finance-safety/{slug}.ts`

파일 형식:
```typescript
import type { ContentItem } from '@/types/content';

const article: ContentItem = {
  slug: '...',
  // ... 필드
};

export default article;
```

해당 카테고리의 index.ts에 import 추가 및 배열에 포함.
order 필드는 해당 카테고리의 마지막 order + 1부터 순차 부여.

---

## 중복 방지 (필수)
- 작성 전 기존 slug 전체를 직접 확인
- 기존 slug와 동일하거나 유사한 주제 금지
- 기존 글과 주제가 70% 이상 겹치면 안 됨
- 각도가 다른 경우(기존 "신청 방법" vs 새 "비교 분석")는 별개 글로 허용
- 새로 추가하는 글끼리도 중복 금지

---

## ContentItem 필드 규칙

TypeScript 타입: ContentItem (`src/types/content.ts`)

필수 필드:
  slug           - 영문 kebab-case, 사이트 전체 고유
  title          - 페이지 제목 (한글, 30~60자)
  category       - 'pension-welfare' | 'health-care' | 'finance-safety'
  template       - 'standard' | 'policy' | 'checklist' | 'calculator' | 'comparison'
  targetUser     - 'senior' | 'family' | 'both'
  createdAt      - 오늘 날짜 (ISO)
  updatedAt      - createdAt과 동일
  reviewStatus   - 'current'
  summary        - 카드/meta description용 요약 (2~3문장, 80~150자)
  sections       - 본문 섹션 배열

필수 선택 필드:
  keyPoints      - 핵심 포인트 (2~3개, 각 1줄)
  tags           - 검색용 태그 (4~6개, 한글)
  hubKey         - 연관 허브 slug 배열 (1~2개)
                   'retirement-income' | 'prepare-care' | 'government-benefits' |
                   'health-checkup' | 'financial-safety'
  relatedSlugs   - 연관 글 slug 배열 (2~4개)
  order          - 카테고리 내 정렬 순서
  officialSources - 공식 출처 [{name, url, note}] (1~3개)
  faq            - [{question, answer}]
  cautionNote    - 면책 메모 1줄

선택 필드:
  seoTitle, seoDescription, heroDescription, isFeatured, effectiveDate,
  relatedCalculator, calculatorCTA

---

## sections 작성 규칙

섹션 타입:
  'text'          - 일반 텍스트 (heading + body)
  'list'          - 불릿 목록 (heading + items[])
  'numbered-list' - 순서 목록 (heading + items[])
  'info'          - 파란 안내 박스
  'tip'           - 초록 팁 박스
  'warning'       - 주황 경고 박스
  'summary'       - 회색 요약 박스

본문 작성 원칙:
- 글당 sections **5~8개** (9개 이상 금지)
- body에 표(pipe table) 넣지 말 것 -> items[] 배열로 변환
- 내부 링크: [[slug|표시텍스트]] 형식, 글당 최소 2개 이상
- em dash(-) 대신 hyphen(-) 사용

---

## 구조 다양화 규칙 (핵심 - 반드시 적용)

### FAQ 개수 다양화
매번 3개 고정하지 않는다. 글마다 아래 분포로 작성:
- 2개: 간단한 주제 (~20%)
- 3개: 일반 주제 (~40%)
- 4개: 심화 주제 (~30%)
- 5개: 복잡한 주제 (~10%)

같은 날 작성하는 글끼리도 FAQ 개수를 다르게 한다.

### 도입부(첫 번째 text 섹션) 톤 다양화
**7가지 패턴을 돌려 사용. 직전 3개 글과 다른 패턴 사용 필수:**
1. 질문형: "부모님이 ~하신다면 어떻게 해야 할까요?"
2. 결론 먼저: "결론부터 말하면, ~입니다."
3. 상황 묘사: "갑자기 ~한 상황이 생겼을 때..."
4. 통계/팩트: "만 65세 이상 노인 중 ~%가..."
5. 반전: "~라고 생각하기 쉽지만, 실제로는..."
6. 공감형: "~때문에 걱정이 많으시죠."
7. 비교형: "A와 B 중 어떤 것이 더 유리할까요?"

### 섹션 타입 다양화
text + list만 쓰지 않는다. 글마다 아래 중 2개 이상 포함:
- info 박스 (금액/기준 강조)
- tip 박스 (실천 가능한 팁)
- warning 박스 (주의사항)
- numbered-list (순서가 있는 절차)

### h2(heading) 제목 스타일 다양화
매번 "~란?", "~방법"만 쓰지 않는다:
- "~의 진실", "왜 ~인가", "~할 때 주의할 점", "~비교", "~체크리스트"

### 문체 다양화
- "~정리합니다", "~알아보겠습니다" 전체 글에서 1회 이하
- 중간중간 짧은 문장(10자 이하) 섞기: "핵심은 이겁니다."
- 일부 섹션에서 필자 판단 넣기: "개인적으로는 ~가 더 낫다고 봅니다"
- 독자에게 말 거는 톤 섞기: "여기서 주의할 점이 하나 있는데요."

---

## health-care 카테고리 추가 규칙

건강 카테고리 글을 작성할 때는 반드시 아래 의료 면책 warning 섹션을 sections 배열의 **summary 바로 앞**에 추가한다:

```typescript
{
  type: 'warning',
  heading: '의료 안내 사항',
  body: '이 글은 일반적인 건강 정보를 제공하며, 의학적 진단이나 치료를 대체하지 않습니다. 증상이 있거나 치료가 필요한 경우 반드시 의사와 상담하세요. 개인의 건강 상태에 따라 적합한 치료법이 다를 수 있습니다. 응급 상황 시 ☎ 119, 건강 상담은 ☎ 1577-1000(국민건강보험공단)으로 문의하세요.',
},
```

---

## A등급 품질 필수 요소

### (a) 전화번호 (모든 글 필수)
- 주제와 관련된 공식 문의 전화번호 1개 이상
- ☎ 129 (보건복지상담센터), ☎ 1355 (국민연금공단), ☎ 1577-1000 (건강보험공단)
- ☎ 1332 (금융감독원), ☎ 182 (경찰청), ☎ 126 (국세청), ☎ 110 (정부민원)

### (b) 신청 서류 목록 (신청/절차 글 필수)
- policy, checklist 템플릿: 반드시 포함
- 형식: { type: 'list', heading: '신청 시 필요한 서류', items: [...] }

### (c) 처리 기간 (신청/절차 글 필수)
- "신청 후 통상 30일 이내 결과 통보" 등 구체적 명시

### (d) 금액/기간 시뮬레이션 예시
- 신청/수령 관련 글은 구체적 계산 예시 포함

---

## 제이퍼 계산기 연결 규칙

연결 가능한 계산기 목록 (www.jptcalc.kr):
  퇴직금         -> /calc/salary/severance/
  실업급여       -> /calc/salary/unemployment/
  상속세         -> /calc/realestate/inheritance/
  증여세         -> /calc/realestate/gift/
  소득세         -> /calc/tax/income-tax/
  만 나이        -> /calc/date/age/
  BMI            -> /calc/health/bmi/
  기초대사량     -> /calc/health/bmr/
  예금이자       -> /calc/finance/deposit/

글 주제와 직접 관련된 경우에만 relatedCalculator + calculatorCTA 입력.
연결이 어색한 글은 비워둘 것.

---

## 글쓰기 금지사항
- em dash(-) 사용 금지, 하이픈(-) 사용
- "~년 기준" 표현은 seoDescription에 넣지 말 것
- 3개월 이상 미래 이벤트 기반 글 금지
- 수치 없는 추상적 설명 섹션 금지
- 같은 내용을 다른 표현으로 반복하는 패딩 문장 금지
- body에 pipe table 금지

---

## 작성 후 필수 작업

### 1. 카테고리 index.ts에 추가
- import 추가 + 배열에 포함

### 2. 관련 기존 글 연결
- 새 글과 연관된 기존 글의 relatedSlugs에 새 slug 추가

### 3. 작성 후 검증 (A등급 체크리스트)
```
□ TypeScript 타입 오류 없는지 확인
□ npm run build 빌드 성공
□ relatedSlugs의 slug가 실제 존재하는지
□ 위키링크 [[slug|텍스트]]의 slug가 실제 존재하는지
□ ☎ 전화번호 1개 이상 포함
□ summary 80~150자 범위
□ sections 5~8개
□ 위키링크 2개 이상
□ faq 개수 확인 (2~5개, 다른 글과 다르게)
□ 도입부 패턴이 직전 글과 다른지
□ health-care면 의료 면책 warning 포함
□ em dash(-) grep 체크
□ officialSources 1~3개
□ cautionNote 있는지
□ keyPoints 2~3개
□ tags 4~6개
□ 제이퍼 계산기 연결 가능 여부 확인
```

### 4. 결과 요약
모든 작업 완료 후 추가한 파일 목록, 주요 섹션 구성, FAQ 수, 도입부 패턴, 빌드 결과를 요약해서 알려준다.

$ARGUMENTS

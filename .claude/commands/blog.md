---
description: 제이퍼 계산기 블로그 글 작성 (카테고리 자동 선정, 주제 자동 선정, 파일 생성 + index + sitemap 업데이트)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 블로그 글 작성

## 편수 원칙 (최우선)
- **사용자가 명시하지 않으면 반드시 1편만 작성한다.**
- 사용자가 "5개", "3편" 등 명시한 경우에만 그 수를 따른다.
- 절대로 자의적으로 편수를 늘리지 않는다.

## 사전 확인
1. `ls /home/tjd618/jptcalc/blog/posts/` 로 기존 포스트 파일 목록 전체 확인
2. `ls /home/tjd618/jptcalc/calc/` 및 하위 폴더 확인해서 사용 가능한 계산기 URL 파악
3. `/home/tjd618/jptcalc/blog/index.html` 에서 data-cat 개수를 세서 카테고리별 글 수 확인
4. 가장 글이 적은 카테고리를 우선 선정 (동률이면 제휴 배너 있는 계산기와 연결되는 카테고리 우선)
5. 기존 글과 겹치지 않는 주제를 선정하고, 아직 블로그 글이 없는 계산기와 연결
6. 기존 포스트 파일 1개 읽어서 해당 카테고리의 포맷·색상 정확히 파악
7. **같은 카테고리 기존 글 목록 확인** - 본문 내 교차 링크용 (2~3개 선정)

### 시의성 체크 (주제 선정 전 필수)
- 오늘 날짜 기준 **3개월 이상 미래의 이벤트**를 주제로 하지 않는다.
- **이미 지난 이벤트**를 "올해" 기준으로 쓰지 않는다.
- 시의성 있는 주제는 현재 시점에서 1~2개월 내 실제 필요한 내용이어야 한다.

사용자가 카테고리나 주제를 지정하면 그것을 따르고, 지정하지 않으면 위 기준으로 자동 선정한다.

### 우선 주제 큐 (블로그 미연결 계산기)
아래 계산기에 연결할 블로그 글이 아직 없다. **주제 자동 선정 시 이 목록을 최우선으로 소화한다.**
각 계산기당 **블로그 글 2편**을 작성해야 목록에서 제거한다. 1편 작성 후에는 완료 횟수를 괄호로 표시하고, 2편째 완료 후 삭제한다.
목록이 모두 소화되면 이 섹션을 삭제한다.

1. `/calc/pension-welfare/pension-tax/` - 연금소득세 계산기 (연금·복지) (1/2 완료 - pension-tax-guide.html)
2. `/calc/tax/medical-expense/` - 의료비 세액공제 계산기 (세금) (1/2 완료 - medical-expense-deduction-guide.html)

글 작성 후 해당 계산기의 detail-shell.js guides 배열에 블로그 URL을 추가한다. 2편 모두 완료된 계산기만 이 목록에서 제거한다.

---

## 포스트 파일 작성 기준
파일 위치: `/home/tjd618/jptcalc/blog/posts/[영문-소문자-하이픈].html`

### head 영역
- charset UTF-8, viewport
- title: "|제이퍼 계산기 블로그" 포함
- meta description (120~155자, 핵심 키워드 포함)
- og:type=article, og:title, og:description, og:url, og:image, twitter:image
- og:image = https://www.jptcalc.kr/android-chrome-512x512.png
- canonical = https://www.jptcalc.kr/blog/posts/[파일명].html
- favicon: ../../assets/logo.svg
- AdSense: ca-pub-6112766558731601
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

기존 63개 글이 전부 동일 구조/문체여서 Google이 자동 생성으로 판단할 수 있다.
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
- 부동산=realestate, 세금=tax, 금융=finance, 연봉=salary, 건강=health, 연금·복지=pension-welfare, 반려동물=pet, 날짜·D-day=date, AI·테크=ai

---

## 후속 작업 (파일 작성 후 반드시 진행)

### 1. blog/index.html 카드 추가
- 카드 포맷: `<a href="./posts/[파일명].html" class="post-card" data-cat="[카테고리명]">`
- 카테고리별 tag 클래스: 부동산=tag-realestate / 세금=tag-tax / 금융=tag-finance / 연봉=tag-salary / 건강=tag-health / 연금·복지=tag-pension-welfare / 반려동물=tag-pet / 날짜·D-day=tag-date / AI·테크=tag-ai
- 최신 글이 목록 상단(post-grid 바로 아래)에 오도록 배치

### 2. sitemap.xml 업데이트
- `<loc>https://www.jptcalc.kr/blog/posts/[파일명].html</loc>`
- `<lastmod>오늘날짜(YYYY-MM-DD)</lastmod>`
- `<changefreq>monthly</changefreq>`
- `<priority>0.7</priority>`

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
```

### 4. 결과 요약
모든 작업 완료 후 추가/수정한 파일 목록, 텍스트 글자 수, 주요 섹션 구성을 요약해서 알려준다.


## 완료 후 로그 기록

스킬 실행이 완료되면 반드시 아래 명령으로 `skill-log.json`에 기록한다:

```bash
python3 -c "import json,datetime; logs=json.load(open('/home/tjd618/skill-log.json')); now=datetime.datetime.now(); logs.insert(0,{'date':now.strftime('%Y-%m-%d'),'time':now.strftime('%H:%M'),'project':'jptcalc','skill':'blog'}); open('/home/tjd618/skill-log.json','w').write(json.dumps(logs,ensure_ascii=False,indent=2))"
```

$ARGUMENTS

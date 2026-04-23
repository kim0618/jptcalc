---
description: jptcalc 블로그/카테고리 meta title·description 최적화 (CTR 개선, 클릭 유도)
---

# 메타 태그 최적화 스킬

서치콘솔에서 **노출 많고 CTR 낮은 페이지**의 `<title>`·`<meta description>`을 검색 스니펫 최적화 관점으로 교정.
콘텐츠 자체는 건드리지 않으므로 **애드센스 거절 위험 제로**.

## 실행 일정
- **시작일**: 2026-04-22 (수) — `/bolster` 완료 후 진입
- **집중 기간**: 2026-04-22 ~ 2026-04-24 (3일), 하루 6-7개 × 3일 = 약 20페이지
- **이후**: 재측정 7일 간격으로 지속 (계속 필요)
- **애드센스 재신청일(4/28) 전까지 20페이지 이상** 처리 목표
- 이 스킬은 **자동 삭제하지 않음** (CTR 개선은 상시 작업)

## 진행 현황

| 라운드 | 기간 | 대상 수 | 완료 | 재측정 예정 |
|---|---|---|---|---|
| 1차 | 2026-04-22 ~ 2026-04-24 | 20페이지 | 13 | 2026-05-01 |
| 2차 | 2026-05-01 ~ 2026-05-03 | 개선 안 된 페이지 재교정 | - | - |

**누적 진행: 13페이지 / 목표 20페이지**

작업 완료 시 이 표를 즉시 갱신할 것.

## 기본 동작

- **1회 실행당 페이지 6-7개** 최적화 (별도 지정 없을 시)
- 지정 시: `/meta-optimize /blog/posts/xxx.html` → 해당 페이지만
- 대상 선정은 `/report` 결과의 **서치콘솔 상위 노출 페이지 중 CTR 3% 미만**

## 선정 기준 (우선순위)

1. 노출 **500회 이상** 이면서 CTR **3% 미만**
2. 평균 순위 **10위 이내**인데 CTR 낮음 (스니펫이 죽은 케이스)
3. 평균 순위 **11-20위** 이면서 노출 증가 추세 (클릭당 이익 큰 구간)

선정 커맨드:
```bash
node /home/tjd618/.claude/analytics/report.mjs --period=28d --site=jptcalc --rank-11-20
node /home/tjd618/.claude/analytics/report.mjs --period=28d --site=jptcalc --low-ctr
```

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

### description (155자 이내, 영문 기준 160자 한도 여유)
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
- 255자 초과 description 금지 (구글 잘림)
- 브랜드명 중복 금지 (title·description 양쪽에 "제이퍼 계산기" 금지 → description에서 제외)

## 동시 갱신 대상 (한 페이지 건드릴 때 모두)

페이지 1개 수정 시 다음 태그 전부 동기화:

```html
<title>...</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
```

`og:title`·`twitter:title`은 `<title>`과 동일하게, `og:description`·`twitter:description`은 `<meta description>`과 동일하게 유지.

**canonical, og:url은 건드리지 않는다.**

### JSON-LD 동기화 (필수, 2025-04-23 추가)

title/description 변경 시 다음 JSON-LD 필드도 **반드시 같은 내용으로** 동기화:

- `Article` JSON-LD의 `"headline"` ← title (브랜드 ` | 제이퍼 계산기 블로그` 부분 제거한 본문)
- `Article` JSON-LD의 `"description"` ← meta description
- `BreadcrumbList` JSON-LD의 `"position": 4`의 `"name"` ← title (브랜드 부분 제거한 본문)

**이유**: `/verify` 스킬 D항목(JSON-LD ↔ HTML 정합성)에 위배되지 않도록 함. title만 변경하고 JSON-LD를 그대로 두면 Google Rich Results에서 일관성 깨짐.

### h1 동기화 (필수)

`<h1>` 태그도 새 title의 본문(브랜드 제거)과 동일하게 변경. h1과 title이 다르면 SEO·UX 모두 손해.

## 작업 순서

### 1) 대상 페이지 확보
```bash
# 서치콘솔 28일 데이터에서 CTR 3% 미만, 노출 500+ 페이지
node /home/tjd618/.claude/analytics/report.mjs --period=28d --site=jptcalc
```

### 2) 페이지별 현재 메타 확인
```bash
grep -E '<title>|name="description"|og:title|og:description|twitter:title|twitter:description' 파일.html
```

### 3) 핵심 검색 쿼리 매핑
- 서치콘솔에서 해당 페이지가 실제 노출되는 **상위 3개 쿼리** 확인
- 새 title·description에 그 쿼리 1-2개 자연 삽입
- 주력 쿼리가 이미 포함되어 있다면 클릭 유도 문구만 교체

### 4) 교정 실행 (Edit 도구)
- 6개 meta 태그를 일괄 교체 (Edit 4-6회)
- title 60자, description 155자 **반드시 세어서 초과 여부 확인**

### 5) 검증 (필수)
```
□ title 60자 이내
□ description 155자 이내
□ og:title = title (완전 동일)
□ og:description = meta description (완전 동일)
□ twitter:title = title (완전 동일)
□ twitter:description = meta description (완전 동일)
□ canonical/og:url 원본 유지 확인
□ 본문 첫 h1 또는 첫 문단의 사실과 모순 없음
□ "충격", "이것만", "모르면 손해" 같은 낚시 금지어 grep
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
## 2026-04-22
- posts/salary-5000-takehome.html: CTR 1.2% → (재측정 4/29 예정)
- posts/pension-tax.html: CTR 0.8% → (재측정 4/29 예정)
```

## 재측정 규칙

- 메타 변경 후 **최소 7일**은 지나야 CTR 재측정 가능 (구글 캐시 반영 시간)
- 14일 후 CTR 개선 없으면 재교정 (다른 쿼리 타겟, 다른 유도 패턴)

## 금지

- 본문 HTML 콘텐츠 변경 금지 (이 스킬은 **메타 전용** - h1, title, description, JSON-LD headline·description·BreadcrumbList p4까지만 허용)
- 본문 단락(`<p>`), 표(`<table>`), FAQ 답변, CTA 박스 등은 변경 금지
- em dash(—) 금지
- sitemap.xml 갱신 불필요 (`<lastmod>` 업데이트는 선택)


## 완료 후 로그 기록

스킬 실행이 완료되면 반드시 아래 명령으로 `skill-log.json`에 기록한다:

```bash
python3 -c "import json,datetime; logs=json.load(open('/home/tjd618/skill-log.json')); now=datetime.datetime.now(); logs.insert(0,{'date':now.strftime('%Y-%m-%d'),'time':now.strftime('%H:%M'),'project':'jptcalc','skill':'meta-optimize'}); open('/home/tjd618/skill-log.json','w').write(json.dumps(logs,ensure_ascii=False,indent=2))"
```

$ARGUMENTS

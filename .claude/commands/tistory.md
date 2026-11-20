---
description: 제이퍼 티스토리(jptcalc.tistory.com) 원고 작성 전용 - 큐 기반 본문·검증·캡처·대표이미지·메타까지. 크롬 예약 발행은 /tistory-publish
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# /tistory [주차 또는 번호]

예: `/tistory` (큐에서 다음 대기 5편), `/tistory t2-t6`, `/tistory t4`

모든 파일은 `~/jptcalc/tistory/` 한 폴더에 있다.

**이 스킬은 원고 작성까지만 한다. 크롬을 열지 않는다.** 순서: `/tistory`(작성) → `/tistory-verify`(새 에이전트 독립 재검증) → `/tistory-publish`(예약). 모든 단계 Opus. 예약 발행은 사용자가 `/tistory-publish`를 부를 때 그 스킬이 한다(11/19 사용자 지시: 작성과 발행은 다른 스킬).

| 파일 | 내용 |
|---|---|
| `rules.md` | **원고 규칙 정본.** 시작 전에 전부 읽는다. 특히 §2 겹침 기준, §4 본문, §6 이미지, §7 숫자 검증, §10 자동 발행 범위, §11 품질(최우선) |
| `queue.md` | 발행 큐(날짜·번호·검색어·계산기·축·근거). 완료하면 상태 칸 갱신 |
| `ledger.tsv` | 발행 기록. 새 글 쓰기 전 직전 4편 구성 확인(§11-3) |
| `posts/tNNN-<slug>.html` | 본문 HTML(티스토리에 그대로 들어감) |
| `meta/tNNN.txt` | TITLE / CATEGORY / TAGS / DATE / ALT |
| `caps/setup/tNNN.js`, `caps/tNNN-cap.jpg` | 계산기 캡처 설정과 결과 |
| `thumbs/tNNN.jpg` | 대표이미지 |
| `check_post.py` | 품질 자동 검사 |
| `cap.mjs` | 계산기 캡처 |
| `make_thumb.py` | 대표이미지 생성 |
| `publish.sh` | 크롬 예약 발행 스크립트 (`/tistory-publish` 전용, 이 스킬에서는 실행 금지) |

## 역할
원고·이미지·메타 파일을 완성하고 검사를 통과시키는 데까지. 예약 발행은 `/tistory-publish`.

## 글 화면 구성 (11/20 사용자 확정, 바꾸지 않는다)
1. 상단: 흰 바탕·파란 카테고리·검은 제목·회색 날짜(스킨 CSS `skin/white-header.css` 적용됨, 띠 없음)
2. 본문 첫 줄: 그 글의 대표이미지(`[[TOPIMG]]` 자리) = 목록 썸네일과 같은 이미지
3. 첫 문단: 목록 요약에 그대로 나가는 문장(기준 줄 금지)
4. 본문 → 계산기 캡처(`[[CAPTURE1]]`) → 계산기 링크 → 글쓴이 단락 → 회색 기준·면책 줄
대표이미지: 카테고리별 고정 배경(연봉·퇴직 남색·₩ / 대출·부동산 청록·집 / 세금·연말정산 보라·계산기 / 건강 수치 자주·하트 / 날짜·나이 초록·달력) + 글 제목. 새 카테고리는 make_thumb.py의 TPL에 한 줄 추가.

## 절차 (편마다 1~7)

### 1. 슬롯 확인
`queue.md`에서 대상 행을 읽는다. ★ 표시는 외부 기준(법령·고시·통계) 원문 확인 필수. 큐 메모(맨 아래)도 읽는다.

### 2. 겹침·각도 확인 (rules §2)
- 같은 검색어의 사이트 블로그(`~/jptcalc/blog/posts/`)·네이버 글(`~/jptcalc/naverblog-ledger.tsv`, 원고는 네이버 큐)·티스토리 기존 글을 찾아 **쓴 숫자와 축을 확인**하고 피한다. 주제가 같은 건 괜찮다. 같은 글이 되면 안 된다.
- 검색한 사람의 **진짜 질문 1개**를 한 문장으로 적는다(rules §11-4).

### 3. 숫자 뽑기·검증 (rules §7)
계산기 JS를 `~/jptcalc/calc/<경로>/index.html`에서 읽고 → 페이지 예시표와 원 단위 대조 → 표시 포맷·입력 단위 확인. 검증 없이 본문 금지. 숫자를 보고 나서 구성을 정한다.
- 여러 조합 값을 뽑을 때는 실제 페이지 함수를 그대로 부른다: `LD_LIBRARY_PATH=$HOME/.local/emulib node run.mjs <calc 경로> expr.js` (expr 마지막 식이 JSON으로 출력). 간이세액표처럼 큰 표를 손으로 옮기지 않는다.
- **본문에 넣는 파생 숫자(차이·합계·비율·날짜·연도 기한)는 계산식과 함께 스크립트로 다시 뽑는다.** 머리로 더하지 않는다(11/19 부부 월세 합계 189만→187만, 경정청구 2020→2021 귀속을 늦게 잡았다).
- "평균"·통계처럼 계산기가 내지 않는 숫자는 공식 원문(질병관리청·통계청 등)을 찾았을 때만. 못 찾으면 제목·본문에서 그 단어를 빼거나 "계산값"이라고 밝힌다.
- 법령 기준은 `node ~/jptcalc/scripts/law-render.mjs <법령> <out>`로 원문 조문을 확인한다(★ 항목 필수).

### 4. 본문 작성 (rules §4, §11)
- 직전 4편(ledger)과 도입·구성·소제목·표 개수·끝맺음·분량 중 **3가지 이상 다르게**.
- 판단 문장 2곳 이상, 흔한 오해 1개 이상, 우리 계산기로 뽑은 숫자.
- 간격: 문단·표·목록 뒤(다음이 문단일 때) `<p data-ke-size="size16">&nbsp;</p>`.
- 표: 4칸 이하, 칸 안 글자는 짧게(단위는 머리글로). 다 쓴 뒤 `python3 fix_tables.py posts/tNNN-*.html`(14px·숫자 칸만 nowrap·가로 스크롤 감싸기) → `node mobile_check.mjs posts/tNNN-*.html`로 **휴대폰 폭 340px 안에 들어오는지** 확인(11/19 첫 주 6편 전부 넘쳤다). 넘치면 칸을 줄이거나 날짜·요일을 `<br>`로 나눈다.
- 분량·구성: 직전 4편과 분량이 ±15% 안에 3편 이상 몰리면 안 된다. 늘리려고 덧붙이지 말고 독자 질문(계산 과정, 다른 경우 예시, 신청·주의)을 더하거나 뺀다.
- 캡처 자리에 `<p>[[CAPTURE1]]</p>` + 아래 회색 한 줄 설명.
- 링크: `https://www.jptcalc.kr/calc/...?utm_source=tistory&utm_medium=blog&utm_campaign=tN` 1~2개. 끝에 글쓴이 단락(`/page/about` 링크, 문장은 글마다 조금씩 다르게) + 기준·면책 한 줄.
- 저장: `posts/tNNN-<slug>.html`, `meta/tNNN.txt`(TITLE·CATEGORY·TAGS·DATE `YYYY-MM-DD 08:00`·ALT).
- 제목: 공백 포함 42자 이하. 첫 쉼표 앞 = 검색어(대표이미지에 크게 들어감), 뒤 = 결론 숫자(노란 줄). 쉼표를 꼭 넣는다.

### 5. 검사
`python3 ~/jptcalc/tistory/check_post.py posts/tNNN-*.html --numbers` → PASS까지 고친다. 검사 항목: 금지 표현·문장 끝 반복·다른 원고와 겹침·분량/구성 몰림·제목 길이·meta/thumb/cap 존재·기준 줄·글쓴이 단락·www 주소와 utm_campaign 번호·스페이서·표 칸 수.
`--numbers`가 뽑아 준 숫자 문장 목록을 **한 줄씩 3단계 스크립트 결과와 대조**한다. 그다음 직접 다시 읽고 rules §11-1 네 가지에 예라고 답할 수 있는지 본다. 아니면 다시 쓴다.

### 6. 이미지
- 캡처: `caps/setup/tNNN.js`(입력 id에 값 넣고 계산 함수 호출, 마지막에 결과 텍스트 반환) 작성 →
  `cd ~/jptcalc/tistory && LD_LIBRARY_PATH=$HOME/.local/emulib node cap.mjs caps/tNNN-cap.jpg <calc 경로> caps/setup/tNNN.js`
  → 출력된 결과 숫자가 본문과 같은지 확인, 이미지를 Read로 직접 본다. 결과 요소 id가 `#result`가 아니면 `RESULT_SEL=...`.
  - **입력값이 화면에 다 보이는지** 확대해서 본다(11/19 기초대사량 키 칸이 "160"→"16"으로 잘림). 잘리면 사이트 문제로 사용자에게 보고하고, 캡처에서만 setup.js로 칸 여백을 줄인다.
  - **접힌 입력 영역**(아코디언)에 들어간 값은 setup.js에서 펼친다(11/19 월세 칸이 접혀 안 보였다).
- 대표이미지: `python3 make_thumb.py thumbs/tNNN.jpg "카테고리" "글 제목"` (카테고리별 고정 배경·아이콘 + 제목, 11/20 확정). 목록 크기(가운데 3:2)로 잘라 Read로 확인. 본문 첫 줄은 반드시 `<p>[[TOPIMG]]</p>` + 스페이서(발행 때 이 자리에 같은 이미지가 들어간다).

### 7. 기록·보고
- `queue.md` 상태 칸 "작성 완료(발행 대기)".
- 분량이 직전 편들과 비슷하게 몰렸는지 본다(rules §11-3 6항). 몰렸으면 늘리려고 덧붙이지 말고, 독자에게 필요한 내용(계산 과정, 다른 경우의 예시, 신청·주의)을 더하거나 빼서 조정한다.
- 사용자에게 보고: 편별 제목·분량·주제 고른 이유 한 줄·확인할 점, 작업 중 발견한 사이트 문제. 다음은 `/tistory-verify`(재검증) → `/tistory-publish`라고 안내한다.
- 예약 뒤에 원고를 고치면(사용자 요청 등) `/tistory-publish --update`가 필요하다고 함께 말한다.

## 하지 말 것
- 큐가 비었다고 아무 주제로 채우기(측정 없이). 큐가 3편 미만이면 `/keyword jptcalc`로 재측정 후 보고.
- 크롬 열기, publish.sh 실행(발행은 /tistory-publish).
- 실행 중인 스크립트(publish.sh 등) 파일을 그 사이에 고치기(11/19 실행 중 수정으로 bash 문법 오류).

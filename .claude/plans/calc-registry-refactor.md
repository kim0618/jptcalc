# 계산기/카테고리 공통화 리팩토링 계획

- **작성일**: 2026-06-01 (2026-06-01 주휴수당 추가로 실측 갱신)
- **상태**: ✅ 사실상 완료 — 2026-06-01 **사이드바(59계산기+9index+홈)·홈통계·sibling 전부 registry 자동화**(calc-registry.js + JPT_sidebarLeft 헬퍼, node 검증 PASS, fallback 가드). sibling은 detail-shell이 하단 sibling-section을 숨기고 좌측 사이드바가 대체하므로 별도 작업 불필요(확인됨). **잔존 수동은 SEO 메타·JSON-LD hasPart·본문그리드·본문개수텍스트뿐**(전부 정적이라 공통화 불가, 계획대로). 현재 SOP는 §4.
- **목적**: 계산기 1개 추가 시 수동 수정 **29곳+ → 3곳**으로 축소
- **제약**: jptcalc는 빌드 도구 없는 순수 정적 사이트 → 공통화는 **런타임 JS**로만 가능. SEO 핵심(title/meta/JSON-LD)은 정적 유지 필수.
- ⚠️ **실측 경고**: 처음엔 "20곳"으로 추정했으나, 2026-06-01 주휴수당(salary)을 실제 추가해보니 **29곳+**이었다. 카운트가 (shell JS 18 + 카테고리 index HTML 9 + 홈 사이드바·통계·본문) 세 종류로 흩어져 있고, 좌측 서브목록·본문 그리드도 HTML 하드코딩이었다. **아래 [부록 B] 체크리스트가 실측 기준이다.**

---

## 1. 현황 진단 (하드코딩 위치 전수 — 2026-06-01 주휴수당 추가로 실측 갱신)

> 처음 "개수 14곳" 추정으로 적었으나, 실제 추가해보니 **카운트만 약 20곳, 전체 29곳+**. 아래는 실측. (line 번호는 당시 기준, 편집되면 달라질 수 있으니 패턴으로 grep)

### 개수 하드코딩 — (A) 전체 계산기 수 + (B) 카테고리별 카운트 + (C) 자기 카테고리 종수
**(A) 전체 계산기 수 (예: 58→59)**
- **홈 `index.html`**: ①통계 박스 `hero-stat-num">NN<span>개` (⚠️숫자·"개"가 분리돼 "NN개" 치환에 안 잡힘 → `>NN<`로 검색) ②hero-sub 본문 "NN개 계산기" ③WebSite JSON-LD description "NN개" ④본문 강조 "NN개 계산기와 9개 카테고리"
- **`about.html`**: meta + 본문 "NN개" (2곳)
- **`llms.txt`**: `> ...무료 계산기 NN종`

**(B) 카테고리별 카운트 (좌측 사이드바, 전 카테고리) — 카운트가 3종 소스에 흩어짐 ★처음 누락한 핵심**
- **홈 `index.html`**: `sidebar-link`의 `s-badge` (카테고리별, 멀티라인 — 텍스트와 badge가 다른 줄). ※프리랜서 세금이 5로 잘못돼 있던 기존 오류도 여기서 발견(실제 6)
- **9개 카테고리 index `calc/*/index.html`**: 각 index가 좌측 사이드바를 **HTML 하드코딩** → `{카테고리}<span class="msl-badge">N` (9개 파일 전부에 전 카테고리 카운트)
- **18개 `assets/*shell*.js`** (shell 9 + detail-shell 9): 계산기 페이지 사이드바용 `{카테고리}...msl-badge">N`

**(C) 자기 카테고리 종수 (예: salary 7종→8종)** — 해당 카테고리 index `calc/{cat}/index.html`만: title·meta desc·og·twitter·WebApplication JSON-LD·CollectionPage JSON-LD desc·본문 (≈8곳) + `llms.txt` 해당 줄

### 목록 하드코딩 (해당 카테고리)
- **카테고리 index 좌측 계산기 목록**: `{cat}-shell.js`의 `calcLinks` 배열이 생성(자동). 단 `slugMap`(계산기별 tips·related)은 별도 추가 필요
- **카테고리 index 좌측 서브목록 `msl-calc-list`**: ★`calc/{cat}/index.html`에 **HTML 하드코딩** (shell.js와 별개 — 처음 누락)
- **카테고리 index 본문 그리드**: ★`calc/{cat}/index.html`에 **HTML 하드코딩** — "상황별 추천" `hub-guide-item` + 그룹 `calc-hub-card` (처음 누락)
- **카테고리 index JSON-LD `hasPart`**: 계산기 목록 정적 나열
- **계산기 페이지 좌측 목록**: `{cat}-detail-shell.js`의 `calcItems` 배열 (★shell.js calcLinks와 별개 — 처음 누락) + `pages` 객체(quick·related·guides)
- **개별 페이지 sibling-list**: 동 카테고리 계산기 페이지에 HTML 하드코딩 (신규 추가 시 기존 페이지 전부 + 신규는 자기 `current`)
- **메인 홈**: cat-card(카테고리 9, "+N" pill 포함)·popular-item·sidebar-link 하드코딩
- **블로그 ↔ 계산기 상호링크**: 신규 계산기를 다루는 블로그 글 본문에 계산기 링크 수동 추가(역방향은 detail-shell guides)

---

## 2. 공통화 가능 / 불가 분류

### ✅ 공통화 가능 (런타임 JS, 화면 표시용)
| 항목 | 현재 | 방법 |
|---|---|---|
| 카테고리 그리드 | shell.js 9곳 분산 | `calc-registry.js` 1곳 통합 |
| 좌측 사이드바 | shell.js | registry 참조 |
| sibling-list | 33곳 하드코딩 | registry 기반 detail-shell 자동 생성 → 33곳 0 |
| 관련계산기 위젯 | detail-shell 분산 | registry 참조 |
| 홈 인기/사이드바 | 하드코딩 | registry 참조 |
| 본문 개수 텍스트 | "58개"/"7종" | `<span data-calc-count>` / `data-cat-count="salary"` + JS 주입 |

### ❌ 공통화 불가 (SEO 정적 — 크롤러가 JS 실행 전에 읽음)
| 항목 | 위치 | 대응 |
|---|---|---|
| title 개수 | 카테고리 9 + 홈 | **개수 숫자 제거** (계산기명 키워드는 유지) |
| meta/og/twitter desc 개수 | 카테고리·홈·about | 개수 숫자 제거 |
| JSON-LD description 개수 | 9 카테고리 | 숫자 제거 |
| JSON-LD hasPart 목록 | 9 카테고리 | **정적 수동 (카테고리당 1곳) — 유일하게 남는 수동** |

> 핵심: 개수 숫자("7종")는 SEO 기여도 낮음 → title/meta에서 빼면 정적 부담 거의 소멸. 결국 남는 수동은 JSON-LD hasPart 1곳뿐(카테고리당, 구조화 데이터라 유지 권장).

---

## 3. 실행 단계 (단계적, 안전 우선)

⚠️ 9개 카테고리·58개 페이지를 만지는 대규모 리팩토링. **화면은 그대로, 데이터 소스만 통합.** 반드시 백업 + 카테고리 1개 시범 + 검증 후 확대.

0. **백업**: `tar czf /tmp/jptcalc-refactor-backup-YYYYMMDD.tar.gz calc/ assets/ index.html about.html`
1. **`assets/calc-registry.js` 생성**: 58개 계산기 + 9개 카테고리 마스터 목록 1곳
   ```js
   window.CALC_REGISTRY = {
     salary: { name:'이직/연봉', count:7, calcs:[{slug:'take-home-pay',icon:'💵',name:'연봉 실수령액'}, ...] },
     ... (9개 카테고리)
   };
   window.CALC_TOTAL = Object.values(...).reduce(...); // 총 58
   ```
2. **sibling 자동화 (효과 최대)**: detail-shell이 registry에서 같은 카테고리 목록 읽어 sibling 렌더. **salary 1개 카테고리 먼저 전환 → 화면·링크 검증 → 나머지 8개 확대.** 33곳 하드코딩 HTML 제거.
3. **본문 개수 자동 주입**: 본문 "58개"→`<span data-calc-total>`, "7종"→`<span data-cat-count="salary">`. registry가 채우는 공통 스크립트 추가.
4. **title/meta 개수 숫자 제거**: 9개 카테고리 + 홈 + about의 title·meta·og·twitter·JSON-LD desc에서 "N종/N개" 삭제 (계산기명 나열은 유지).
5. **검증**: 카테고리별 그리드/사이드바/sibling 정상 렌더, 링크 실존, 개수 표시 일치, JSON-LD 유효성.

### 남는 수동 (공통화 후에도)
- JSON-LD `hasPart` 목록: 계산기 추가 시 해당 카테고리 1곳 수동 (또는 생략 검토)

---

## 4. 계산기 추가 SOP — 2026-06-01 사이드바 공통화 완료 후 (현재 실제)

> ⚠️ 2026-06-01 **사이드바·홈통계 공통화 완료**. 부록 B(공통화 전 전체수동)의 "카운트 28곳"은 이제 대부분 자동. 아래가 현재 기준.

**✅ 자동 — `assets/calc-registry.js`의 `{cat}.calcs`에 1줄 추가하면:**
- 계산기 페이지 좌측 사이드바 (카테고리 카운트 9개 + 계산기 목록) — `JPT_sidebarLeft` 헬퍼
- 9개 카테고리 index 좌측 사이드바 (인라인 스크립트가 헬퍼 호출)
- 홈 좌측 사이드바 카운트(s-badge) + 통계(JPTCALC_CONFIG 덮어씀)
- **전체 계산기 수**(`CALC_TOTAL`)는 calcs 합계로 **동적 계산** → 홈 통계 자동
- **detail-shell이 registry fallback** → 계산기 페이지가 `pages[path]` 항목 없어도 사이드바·관련계산기 자동 생성 (`{cat}.calcs`에만 있으면 됨)
- 관련계산기 위젯도 같은 카테고리 다른 계산기로 자동
- → 옛날 "카운트 28곳 + sibling + detail-shell pages 수동"이 **registry 1줄**로 축소
- ※ 2026-06-01 연차수당(salary) 추가가 이 자동화의 검증 케이스: registry 1줄 + 본체로 사이드바·카운트·통계·관련계산기 전부 자동 확인. 검증 중 CALC_TOTAL 하드코딩·pages 의존 2개 결함 발견→수정.

**⬜ 아직 수동 (계산기 추가 시 처리):**
1. `calc/{cat}/{slug}/index.html` 본체 생성 + **`<script src="/assets/calc-registry.js"></script>`를 `{cat}-detail-shell.js` 앞에** 추가
2. `calc-registry.js`의 `{cat}.calcs`에 `{slug,icon,name}` 1줄 (→ 위 ✅ 전부 자동)
3. ~~sibling-list~~ **불필요** — detail-shell이 `main.page-wrap`에 `{cat}-shell-main` 클래스를 붙여(`classList.add`) 하단 `sibling-section`을 `display:none`으로 숨기고, 좌측 사이드바(registry)가 sibling 역할을 대체함. **새 계산기 본체에 sibling-section을 안 넣어도 되고, 넣어도 숨겨짐.** (주휴수당 때 sibling 8개 수정한 건 숨겨진 죽은 HTML이었음 — 무해)
4. 해당 카테고리 index `calc/{cat}/index.html`: title·meta·og·twitter·JSON-LD desc "N종"(SEO) + JSON-LD `hasPart` + 본문 그리드 카드(상황별/그룹). ※좌측 서브목록은 자동
5. 본문 개수 텍스트: 홈 hero-sub·about "N개", 카테고리 index "N종" (SEO·본문)
6. `sitemap.xml` 1줄

> 즉 **카운트 노가다(28곳) + sibling(동카테고리 전부) 모두 사라짐**. 남은 수동은 **SEO 메타·JSON-LD hasPart·본문 그리드·본문 개수텍스트뿐**(전부 정적 SEO라 공통화 불가, 어차피 손봐야 함). detail-shell 헬퍼 호출엔 `window.JPT_sidebarLeft?` 가드 → registry 미로드 시에도 페이지 안 깨짐.

### sibling-list: 이미 자동 (좌측 사이드바가 대체) ✅
9개 detail-shell 전부 `main`에 `{cat}-shell-main` 추가 + `.{cat}-shell-main .sibling-section{display:none}` + pages 59개 100% 커버 → 모든 계산기 페이지에서 하단 sibling 숨김, 좌측 사이드바(registry) 목록이 sibling 역할. **별도 자동화 불필요 — 공통화 사실상 완료.**

---

## 5. 부록: 신규 계산기 추가 대기 목록 (별도 진행)
네이버 데이터랩 검증 완료 (2026-06-01, 1년/월간 기준):
- **주휴수당** (salary 편입): 검색량 1위, 연봉 클러스터 시너지 → 최우선
- **연차수당** (salary 편입): 연중+연말 피크 2순위
- **전기요금** (새 카테고리 "생활요금" 필요): 여름 7~8월 폭발, 시즌 타이밍
- 자동차세(1월 피크)·연말정산(1월): 겨울에
- 가스요금·자동차취등록세: 볼륨 부족, 보류
- 주휴수당 계산 로직: 주 15시간 이상 근무 시 지급, 1주 소정근로시간 기반 (제작 전 정확히 확정 필요)
- 기준 계산기 구조: `calc/salary/hourly-wage/index.html` (387줄) 참고. 공통 에셋(salary-common.css, salary-detail-shell.js, calc-validate.js 등) 사용.

> 권장 순서: **공통화 리팩토링 먼저 → 그 후 계산기 추가** (추가가 1줄로 끝나므로).
> 단 전기요금 여름 타이밍이 급하면 예외 검토.
> ✅ 주휴수당(salary)은 2026-06-01 **공통화 전에 수동 추가 완료** (아래 부록 B 체크리스트가 그 실측 기록).

---

## 부록 B: 계산기 1개 추가 시 수동 수정 체크리스트 (공통화 전, 실측)

**2026-06-01 주휴수당(salary) 추가 시 실제로 건드린 전체 위치.** 다음 계산기 추가 시 이 순서대로 빠짐없이 처리한다. (`{cat}`=카테고리 slug, `{slug}`=계산기 slug, `{N}`=해당 카테고리 새 계산기 수)

### 1. 본체 생성 (1)
- [ ] `calc/{cat}/{slug}/index.html` — 같은 카테고리 기존 계산기 1개를 틀로 복사, 계산로직·콘텐츠·메타·JSON-LD 3종(WebApplication·BreadcrumbList·FAQPage) 교체. FAQ JSON-LD ↔ 본문 faq-item 문장단위 일치. 계산식은 Python 등으로 재검산.

### 2. 개수 카운트 (가장 잘 빠뜨림 — 3종으로 흩어져 있음)
- [ ] **홈 `index.html`** ① 좌측 사이드바 `s-badge` (해당 카테고리) ② 통계 박스 `hero-stat-num">{전체수}<span>개` (숫자·"개" 분리돼 있으니 `>NN<`로 검색) ③ 본문 hero-sub "{전체}개 계산기" ④ WebSite JSON-LD description "{전체}개"
- [ ] **🔴 홈 `index.html` 카테고리 카드 `cat-pills` (가장 자주 까먹는 곳)** — 본문 "계산기 카테고리" 그리드의 해당 카테고리 `<a class="cat-card c-{cat}">` 안 `.cat-pills`. 칩 4개(`cat-pill`) + `cat-pill more`로 "+N"(=총 N개 − 표시 4개). 신규 계산기를 첫 칩으로 노출하고 `more`의 +N을 +1 올릴 것. `cat-desc` 설명도 갱신. **registry 자동화가 닿지 않는 순수 하드코딩 — 2026-06-02 dog-age 추가 때 이 칩만 누락돼 메인에서 강아지 나이가 안 보였음.**
- [ ] **`about.html`** "{전체}개" (meta + 본문, 2곳)
- [ ] **`llms.txt`** ① `> ...무료 계산기 {전체}종` ② 해당 카테고리 줄 "...{N}종"
- [ ] **9개 카테고리 index `calc/*/index.html`** 좌측 사이드바의 해당 카테고리 `msl-badge` — **9개 파일 전부**(각 index가 전 카테고리 사이드바를 HTML 하드코딩). 패턴: `{카테고리명}<span class="msl-badge">N</span>`
- [ ] **18개 `assets/*shell*.js`** 좌측 사이드바 해당 카테고리 `msl-badge` — **shell 9 + detail-shell 9 전부**(개별 계산기 페이지 사이드바용). 패턴: `{카테고리명}...msl-badge">N`
- [ ] **해당 카테고리 index `calc/{cat}/index.html`** 자기 카운트 "{N}종/{N}개": title·meta description·og·twitter·WebApplication JSON-LD·CollectionPage JSON-LD·본문 (≈8곳). 검색량 큰 신규 계산기면 계산기명도 나열에 추가(SEO).

### 3. 목록·링크 (해당 카테고리만)
- [ ] **`{cat}-shell.js`** ① `calcLinks` 배열(카테고리 index 좌측목록 자동생성) ② `slugMap`(계산기별 tips·related)
- [ ] **`{cat}-detail-shell.js`** ① `pages` 객체(계산기 페이지 quick·related·guides) ② `calcItems` 배열(계산기 페이지 좌측목록)
- [ ] **`calc/{cat}/index.html`** ① 좌측 서브목록 `msl-calc-list`(HTML 하드코딩) ② 본문 "상황별 추천" `hub-guide-item` ③ 본문 그룹 `calc-hub-card` ④ JSON-LD `hasPart`
- [ ] **기존 동 카테고리 계산기 페이지 전부** `sibling-list`에 새 링크 추가(신규 페이지 본체엔 자기 `current` 포함). Python 정규식 일괄 권장.

### 4. 색인 (1)
- [ ] **`sitemap.xml`** `<url>` 추가. (rss.xml은 블로그 전용 — 계산기 미포함)

### 5. 검증
- [ ] `grep`으로 옛 카운트(N) 잔존 0 / 새 카운트(N+1) 반영 수 / 새 slug가 모든 목록에 / 링크 실존 / FAQ 일치 / 금지어 0
- [ ] 로컬 서버 + node로 계산기 JS 시뮬레이션(엣지케이스 포함) 기대값 대조
- [ ] 메인·카테고리·계산기 페이지 하드리프레시 육안 확인

> **요약**: 본체 1 + 카운트 약 20곳(홈 4·about 2·llms 2·카테고리index 9·shellJS 18·해당카테고리 8) + 목록 약 8곳 + sitemap 1 = **29곳+**. 이 노가다를 없애려는 게 본 문서 §1~4의 공통화다.

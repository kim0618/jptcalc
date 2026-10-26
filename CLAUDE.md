# jptcalc 프로젝트

순수 정적 HTML/CSS/JS 사이트 (프레임워크 없음). 빌드 도구 없음.

## 구조

- `/calc/{category}/` - 계산기 페이지 (카테고리별 index.html + 개별 페이지)
- `/blog/posts/` - 블로그 글 (87개+)
- `/blog/index.html` - 블로그 목록 (필터 버튼 + 포스트 카드)
- `/assets/` - CSS/JS (카테고리별 `{category}-common.css`, `{category}-shell.js`, `{category}-detail-shell.js`)

## 카테고리 9개

부동산 / 세금 / 연봉 / 금융 / 건강 / 연금·복지 / 날짜·D-day / AI·테크 / 반려동물

상세 색상·slug·CSS 클래스: `.claude/rules/category-registry.md`

## 작업별 룰

| 작업 | 참고 파일 |
|------|-----------|
| 블로그 글 작성 | `rules/blog-post-html.md`, `rules/blog-quality.md` |
| 블로그 글 추가 후 index 수정 | `rules/blog-index-sync.md` |
| 계산기 페이지 작성 | `rules/calc-page-assets.md` |
| 배포 관련 | `rules/deploy-policy.md` |

## 블로그 글 작성 명령

`/blog` 스킬 사용. 스킬이 파일 생성 + `/blog/index.html` + `sitemap.xml` + `rss.xml` 업데이트까지 처리.

## Design Rules (리디자인, 2026-10-16 키트 기준)

- UI 작업(새 화면, 컴포넌트, 스타일 수정)을 할 때는 반드시 `human-design` 스킬을 먼저 따른다.
- 이 사이트는 완전 정적 HTML이다. React/Tailwind/빌드 도구를 도입하지 않는다.
- 코드 작성 전 `design/brief.md`를 끝까지 읽는다. `/assets/ds/tokens.css`가 없으면 먼저 만들고 확인을 받는다.
- 색상, 폰트 크기, 간격, 라운드 값은 `/assets/ds/tokens.css`의 CSS 변수만 사용한다. 하드코딩 금지.
- 계산 로직이 쓰는 id/class(`#dti-*`, `.input-wrap`, `.unit`, `.seg-btn`, `.result-*` 등)는 이름을 바꾸지 않는다.
- `design/references/` 폴더의 스크린샷을 디자인 기준으로 삼는다.
- UI 변경 후에는 데스크톱/모바일 스크린샷으로 시각 검증을 한 뒤 완료 보고한다.
- **비주얼은 직접 디자인하지 않는다. design/references/INDEX.md에 적힌 확정 시안을 그대로 옮긴다. 우선순위: brief 메모 > H1 헤더 > 00 부품 > 화면 시안. _old/ 폴더는 참고 금지.**
- 최우선 목적: 모바일에서 빨리 계산 완료 + 이어서 계산. brief의 v3 합격 기준(첫 입력 ≤200px 등)을 숫자로 검증한다.
- 리디자인은 '업그레이드'다. 원본 요소·텍스트를 삭제하지 말고 더 나은 형태로 교체한다(brief의 v2 보정 우선).
- 금지: 계산기 상세의 좌측 사이드바(카테고리 허브 데스크톱은 허용), 그라데이션 배경, 이모지(라인 아이콘으로 교체), 3열 기능 카드 그리드 기본 패턴, 마케팅 상투어 카피, Lorem ipsum.

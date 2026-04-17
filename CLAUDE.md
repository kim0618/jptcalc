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

# 카테고리 레지스트리

카테고리 관련 값은 반드시 아래 표 기준으로 사용. 임의 추측 금지.

## 9개 카테고리 매핑

| 한글명 | slug (폴더명) | 표시색 (hex) | CSS 태그 클래스 | data-filter 값 |
|--------|--------------|-------------|----------------|----------------|
| 부동산 | realestate | #F59E0B | tag-realestate | 부동산 |
| 세금 | tax | #10B981 | tag-tax | 세금 |
| 연봉 | salary | #3B82F6 | tag-salary | 연봉 |
| 금융 | finance | #6366F1 | tag-finance | 금융 |
| 건강 | health | #10B981 | tag-health | 건강 |
| 연금·복지 | pension-welfare | #0EA5E9 | tag-pension-welfare | 연금·복지 |
| 날짜·D-day | date | #F97316 | tag-date | 날짜·D-day |
| AI·테크 | ai | #8B5CF6 | tag-ai | AI·테크 |
| 반려동물 | pet | #F472B6 | tag-pet | 반려동물 |

## 사용 위치별 값

**블로그 글 내 `<span class="post-tag">`**
- 텍스트: 한글명 그대로 (예: `AI·테크`)
- 배경색: 위 표의 표시색

**`/blog/index.html` 포스트 카드 태그**
- 클래스: `tag-{slug}` (예: `<span class="tag-ai">AI·테크</span>`)
- `data-cat` 속성: 한글명 그대로 (예: `data-cat="AI·테크"`)

**`window.ARTICLE_INFO_CONFIG` 의 `category` 필드**
- slug 사용 (예: `category: 'ai'`)

**CSS 파일/JS 파일 prefix**
- slug 사용 (예: `ai-common.css`, `ai-shell.js`, `ai-detail-shell.js`)

## 신규 카테고리 추가 시

1. 이 파일에 행 추가
2. `/blog/index.html` 에 filter-btn + tag CSS 동시 추가 (`blog-index-sync.md` 참고)
3. `/assets/` 에 `{slug}-common.css`, `{slug}-shell.js`, `{slug}-detail-shell.js` 생성

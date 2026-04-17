# /blog/index.html 동기화 규칙

블로그 글을 추가하거나 카테고리를 신규 생성할 때 `/blog/index.html`을 반드시 함께 수정.

## 새 글 추가 시 - 포스트 카드 삽입

`<div class="post-grid">` 안의 **첫 번째** 위치에 삽입 (최신 글이 상단).

```html
<a href="./posts/{kebab-case}.html" class="post-card" data-cat="카테고리 한글명">
  <span class="post-tag tag-{slug}">카테고리 한글명</span>
  <div class="post-title">글 제목</div>
  <div class="post-desc">설명 (1-2문장)</div>
  <div class="post-meta">📅 YYYY.MM.DD · ⏱ XX분 읽기</div>
</a>
```

- `data-cat`: 카테고리 한글명 (예: `AI·테크`) - 필터 JS가 이 값으로 매칭
- `class="post-tag tag-{slug}"`: slug 기반 클래스 (예: `tag-ai`)
- 읽기 시간 계산 기준: 글 분량 / 분당 400자

## 신규 카테고리 추가 시 - 2곳 동시 수정

### 1. 필터 버튼 추가 (line ~112-121 영역)

```html
<button class="filter-btn" data-filter="카테고리 한글명">카테고리 한글명</button>
```

기존 버튼 목록 뒤에 추가. `data-filter` 값 = `data-cat` 값과 반드시 일치.

### 2. tag CSS 추가 (line ~65-73 영역)

```css
.tag-{slug} { background: rgba(R,G,B,0.15); color: #{HEX}; }
```

RGB 값은 hex를 분리해서 사용 (예: `#F59E0B` → `rgba(245,158,11,0.15)`).

## 기존 카테고리별 tag CSS (참고)

```css
.tag-realestate { background: rgba(245,158,11,0.15); color: #F59E0B; }
.tag-tax        { background: rgba(16,185,129,0.15);  color: #10B981; }
.tag-salary     { background: rgba(59,130,246,0.15);  color: #3B82F6; }
.tag-finance    { background: rgba(99,102,241,0.15);  color: #6366F1; }
.tag-health     { background: rgba(16,185,129,0.15);  color: #10B981; }
.tag-ai         { background: rgba(139,92,246,0.15);  color: #8B5CF6; }
.tag-pet        { background: rgba(244,114,182,0.15); color: #F472B6; }
.tag-date       { background: rgba(249,115,22,0.15);  color: #F97316; }
.tag-pension-welfare { background: rgba(14,165,233,0.15); color: #0EA5E9; }
```

## sitemap.xml / rss.xml

새 글 추가 시 `/sitemap.xml`과 `/rss.xml`에도 항목 추가.
- sitemap: `<url><loc>`, `<lastmod>` 포함
- rss: `<item>` 블록, `<pubDate>` RFC 822 형식

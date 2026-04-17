# 블로그 글 HTML 구조 규칙

## JSON-LD 3종 필수 (누락 불가)

`<head>` 안에 반드시 아래 3개 스키마를 모두 포함.

### 1. Article 스키마
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "글 제목",
  "description": "설명",
  "author": {
    "@type": "Person",
    "name": "Jay Kim",
    "url": "https://www.jptcalc.kr/about.html",
    "jobTitle": "제이퍼 계산기 운영자"
  },
  "publisher": {
    "@type": "Organization",
    "name": "제이퍼 계산기",
    "logo": { "@type": "ImageObject", "url": "https://www.jptcalc.kr/assets/logo_161.png" }
  },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "image": "https://www.jptcalc.kr/assets/logo_161.png",
  "articleSection": "카테고리 한글명",
  "inLanguage": "ko-KR"
}
```

### 2. FAQPage 스키마
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "질문",
      "acceptedAnswer": { "@type": "Answer", "text": "답변" }
    }
  ]
}
```
- FAQ 항목 수: 4-5개
- HTML FAQ 섹션(`<div class="faq-item">`)과 반드시 내용 일치

### 3. BreadcrumbList 스키마
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.jptcalc.kr/" },
    { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://www.jptcalc.kr/blog/" },
    { "@type": "ListItem", "position": 3, "name": "카테고리명", "item": "https://www.jptcalc.kr/blog/?cat=카테고리명" },
    { "@type": "ListItem", "position": 4, "name": "글 제목" }
  ]
}
```

## window.ARTICLE_INFO_CONFIG

`</body>` 직전 `<script>` 태그 안에 포함. 필드 누락 금지.

```javascript
window.ARTICLE_INFO_CONFIG = {
  author: "제이퍼 계산기 편집팀",
  reviewBasis: "관련 공식 기준·자료",
  basisDate: "YYYY년 기준",
  referenceOrg: "관련 기관명",
  lastReviewed: 'YYYY.MM.DD',
  relatedCalc: { name: '계산기명', url: '/calc/{slug}/계산기명/' },
  category: '{slug}'
};
```
- `category`: slug 사용 (`category-registry.md` 참고)
- `relatedCalc`: 글과 연관된 계산기 1개 지정

## 필수 스크립트 include (</body> 직전)

```html
<script src="/assets/footer-unified.js"></script>
<script src="/assets/blog-article-info.js"></script>
<script src="/assets/blog-review-footer.js"></script>
```

## 콘텐츠 섹션 구조

```html
<!-- 포스트 태그 -->
<span class="post-tag">카테고리 한글명</span>

<!-- 제목 -->
<h1>글 제목</h1>

<!-- 메타 -->
<div class="post-meta">📅 YYYY.MM.DD · ⏱ XX분 읽기</div>

<!-- 본문 -->
<!-- 하이라이트 박스 -->
<div class="highlight-box">강조 내용</div>

<!-- 테이블 (반응형 래퍼 필수) -->
<div class="table-wrap"><table>...</table></div>

<!-- FAQ 섹션 -->
<div class="faq-item">
  <div class="faq-q">질문</div>
  <div class="faq-a">답변</div>
</div>

<!-- CTA 박스 (계산기 링크) -->
<div class="cta-box">
  <a href="/calc/{slug}/계산기명/">계산기 바로가기</a>
</div>
```

## 교차 링크

- 본문 내 계산기 링크: 상대경로 `../../calc/{slug}/계산기명/`
- 관련 글/계산기 링크: 절대 URL `https://www.jptcalc.kr/calc/{slug}/계산기명/`
- 교차 링크 최소 2개 이상

## 파일 경로

`/blog/posts/{kebab-case-title}.html`
- 소문자 + 하이픈만 사용
- 한글 제목을 영문 kebab-case로 변환

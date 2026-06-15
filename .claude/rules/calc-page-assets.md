# 계산기 페이지 필수 에셋

## ⚠️ 계산기 추가/삭제 후 필수: sibling-section 재생성

계산기를 `assets/calc-registry.js`에 추가/삭제한 뒤 **반드시 실행**:

```bash
node scripts/inject-sibling.mjs
```

- 모든 계산기 페이지 하단의 정적 `sibling-section`(관련 계산기 + 관련 가이드)을 registry·블로그 기준으로 재생성
- **관련 계산기** = calc-registry.js (단일 소스)
- **관련 가이드** = blog/posts/*.html의 계산기 링크 역매핑 (자동)
- 이 섹션은 크롤러용(네이버·AI 내부링크). JS 사용자에겐 detail-shell의 `.sibling-section{display:none}`이 숨기고 사이드바를 보여줌
- 빼먹으면 새 계산기가 크롤러 내부링크 그래프에서 누락됨 (realestate·tools가 과거 이렇게 누락됐던 사례)

블로그 글을 추가했을 때도 재실행하면 해당 계산기의 관련 가이드에 자동 반영된다.

## CSS (카테고리별 1개 + 공통)

```html
<link rel="stylesheet" href="/assets/{slug}-common.css">
```

## JS include 순서 (</body> 직전)

```html
<script src="/assets/calc-validate.js"></script>
<script src="/assets/calc-result-tools.js"></script>
<script src="/assets/footer-unified.js"></script>
<script src="/assets/{slug}-detail-shell.js"></script>
<script src="/assets/blog-article-info.js"></script>
<script src="/assets/blog-review-footer.js"></script>
```

- `{slug}-detail-shell.js`: 카테고리별 상세 페이지 셸 (예: `health-detail-shell.js`)
- `{slug}-shell.js`는 카테고리 index 페이지용, 개별 계산기 페이지에는 `{slug}-detail-shell.js` 사용

## window.ARTICLE_INFO_CONFIG (계산기 페이지용)

```javascript
window.ARTICLE_INFO_CONFIG = {
  author: '제이퍼 계산기 편집팀',
  reviewBasis: '관련 공식 기준표·자료',
  basisDate: 'YYYY년 기준',
  referenceOrg: '관련 기관명',
  lastReviewed: 'YYYY.MM.DD',
  category: '{slug}'
};
```
- 블로그 글과 달리 `relatedCalc` 필드 없음

## window.TRUST_BLOCK_CONFIG

```javascript
window.TRUST_BLOCK_CONFIG = {
  standard: '기준 설명',
  appliedFrom: '적용 시점',
  exceptions: '예외 사항',
  references: ['참고자료1', '참고자료2'],
  lastReviewed: 'YYYY.MM.DD'
};
```

## 페이지 구조 (calc/</s>{slug}/{page-name}/index.html)

```
/calc/{slug}/{page-name}/index.html
```

- 개별 계산기: `/calc/health/bmi/index.html` 형태
- 카테고리 인덱스: `/calc/health/index.html`

## JSON-LD 3종 필수

계산기 페이지도 블로그와 동일하게 3종 포함:
1. WebApplication (Article 대신)
2. FAQPage
3. BreadcrumbList (홈 > 카테고리 > 계산기명)

/**
 * blog-article-info.js - 블로그 글 신뢰성 정보 컴포넌트 (재사용 가능)
 *
 * 사용법:
 *   1. 페이지에 window.ARTICLE_INFO_CONFIG 객체를 먼저 정의합니다.
 *   2. 이 스크립트를 <script src="/assets/blog-article-info.js"></script> 로 로드합니다.
 *
 * Config 형식:
 *   window.ARTICLE_INFO_CONFIG = {
 *     author:       '작성 주체 (예: 제이퍼 계산기 편집팀)',  // 문자열
 *     reviewBasis:  '검토 기준 (예: 소득세법 2026년 기준)',  // 문자열
 *     lastReviewed: '최종 검토일 (예: 2026.03.26 또는 2026년 3월)', // 문자열 - YYYY.MM.DD 형식 권장, 월 단위만 있으면 YYYY년 MM월
 *     basisDate:    '적용 기준일 (예: 2026년 귀속, 2026년 1월 1일 시행)', // 문자열 (선택) - 법령·세율 등 기준 시점
 *     referenceOrg: '참고 기관 (예: 국세청, 국토교통부)',   // 문자열 (선택) - 주요 참고 기관명
 *     disclaimer:   '참고 성격 안내 (생략 시 기본값 사용)', // 문자열 (선택)
 *     relatedCalc:  { name: '계산기 이름', url: '/calc/...' }, // 객체 (선택) - 관련 계산기 링크
 *     category:     'tax',  // 문자열 (선택) - blog-review-footer.js에서 사용
 *   };
 */
(function () {
  'use strict';

  /* ── CSS 주입 ──────────────────────────────────────────────── */
  var STYLE_ID = 'blog-article-info-style';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.article-info {',
      '  background: #F9FAFB;',
      '  border: 1px solid rgba(0,0,0,0.07);',
      '  border-radius: 10px;',
      '  padding: 14px 18px;',
      '  margin-bottom: 32px;',
      '  font-size: 13px;',
      '  line-height: 1.6;',
      '}',
      '.article-info__row {',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  gap: 6px 0;',
      '  align-items: center;',
      '  margin-bottom: 8px;',
      '}',
      '.article-info__item {',
      '  display: flex;',
      '  align-items: baseline;',
      '  gap: 5px;',
      '}',
      '.article-info__label {',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  color: var(--primary, #3730A3);',
      '  white-space: nowrap;',
      '}',
      '.article-info__value {',
      '  color: #374151;',
      '  font-size: 13px;',
      '}',
      '.article-info__sep {',
      '  color: #D1D5DB;',
      '  margin: 0 10px;',
      '  font-size: 12px;',
      '  line-height: 1;',
      '  align-self: center;',
      '}',
      '.article-info__calc {',
      '  margin-bottom: 6px;',
      '}',
      '.article-info__calc a {',
      '  font-size: 12px;',
      '  font-weight: 600;',
      '  color: var(--primary, #3730A3);',
      '  text-decoration: none;',
      '}',
      '.article-info__calc a:hover {',
      '  text-decoration: underline;',
      '}',
      '.article-info__disclaimer {',
      '  font-size: 12px;',
      '  color: #6B7280;',
      '  margin: 0;',
      '  padding-top: 8px;',
      '  border-top: 1px solid rgba(0,0,0,0.06);',
      '}',
      '@media (max-width: 520px) {',
      '  .article-info__row { flex-direction: column; gap: 4px; align-items: flex-start; }',
      '  .article-info__sep { display: none; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── 설정값 검증 ──────────────────────────────────────────── */
  var cfg = window.ARTICLE_INFO_CONFIG;
  if (!cfg) return;

  /* ── HTML 생성 헬퍼 ───────────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * formatReviewDate - 최종 검토일 표시 포맷 정규화
   * YYYY.MM.DD → 그대로 출력 (정확한 날짜)
   * YYYY.MM    → 그대로 출력 (월 단위 - 일자 확인 후 갱신 권장)
   */
  function formatReviewDate(d) {
    if (!d) return '';
    return String(d).trim();
  }

  function item(label, value) {
    return (
      '<div class="article-info__item">' +
        '<span class="article-info__label">' + esc(label) + '</span>' +
        '<span class="article-info__value">' + esc(value) + '</span>' +
      '</div>'
    );
  }

  var sep = '<span class="article-info__sep" aria-hidden="true">|</span>';

  /* ── 카테고리별 라벨 매핑 ─────────────────────────────────── */
  var categoryLabels = {
    tax:        { reviewBasis: '검토 기준', basisDate: '적용 기준',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    realestate: { reviewBasis: '검토 기준', basisDate: '적용 기준',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    salary:     { reviewBasis: '검토 기준', basisDate: '적용 기준',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    finance:    { reviewBasis: '적용 기준', basisDate: '기준 시점',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    health:     { reviewBasis: '참고 기준', basisDate: '기준 시점',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    pet:        { reviewBasis: '참고 기준', basisDate: '기준 시점',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
    ai:         { reviewBasis: '비교 기준', basisDate: '업데이트 기준', referenceOrg: '참고',     lastReviewed: '최종 확인일' },
    date:       { reviewBasis: '검토 기준', basisDate: '적용 기준',     referenceOrg: '참고 기관', lastReviewed: '최종 검토일' },
  };
  var defaultLabels = { reviewBasis: '검토 기준', basisDate: '적용 기준', referenceOrg: '참고 기관', lastReviewed: '최종 검토일' };
  var labels = (cfg.category && categoryLabels[cfg.category]) || defaultLabels;

  /* ── 행(row) 조립 ─────────────────────────────────────────── */
  var row1Parts = [];
  if (cfg.author)       row1Parts.push(item('작성', cfg.author));
  if (cfg.reviewBasis)  row1Parts.push(item(labels.reviewBasis, cfg.reviewBasis));
  if (cfg.lastReviewed) row1Parts.push(item(labels.lastReviewed, formatReviewDate(cfg.lastReviewed)));

  var row1Html = row1Parts.join(sep);

  /* ── 보조 행(row2): 적용 기준일·참고 기관 (있을 때만) ──── */
  var row2Parts = [];
  if (cfg.basisDate)    row2Parts.push(item(labels.basisDate, cfg.basisDate));
  if (cfg.referenceOrg) row2Parts.push(item(labels.referenceOrg, cfg.referenceOrg));

  var row2Html = row2Parts.length
    ? '<div class="article-info__row">' + row2Parts.join(sep) + '</div>'
    : '';

  /* ── 관련 계산기 링크 ─────────────────────────────────────── */
  var calcHtml = '';
  if (cfg.relatedCalc && cfg.relatedCalc.name && cfg.relatedCalc.url) {
    calcHtml =
      '<div class="article-info__calc">' +
        '<span class="article-info__label">관련 계산기</span> ' +
        '<a href="' + esc(cfg.relatedCalc.url) + '">' + esc(cfg.relatedCalc.name) + ' &rarr;</a>' +
      '</div>';
  }

  var defaultDisclaimer =
    '이 글은 정보 제공 목적으로 작성되었습니다. ' +
    '실제 세금·법률·금융 판단은 관할 기관 또는 전문가에게 확인하세요.';

  var disclaimer = cfg.disclaimer ? esc(cfg.disclaimer) : defaultDisclaimer;

  /* ── 전체 블록 조립 ───────────────────────────────────────── */
  var html =
    '<aside class="article-info" aria-label="글 작성 및 검토 정보">' +
      '<div class="article-info__row">' + row1Html + '</div>' +
      row2Html +
      calcHtml +
      '<p class="article-info__disclaimer">' + disclaimer + '</p>' +
    '</aside>';

  /* ── DOM에 삽입 ───────────────────────────────────────────── */
  function inject() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var block = wrapper.firstChild;

    // .post-meta 바로 다음에 삽입 (블로그)
    var meta = document.querySelector('.post-meta');
    if (meta && meta.parentNode) {
      meta.parentNode.insertBefore(block, meta.nextSibling);
      return;
    }

    // fallback: .post-body 앞에 삽입 (블로그)
    var body = document.querySelector('.post-body');
    if (body && body.parentNode) {
      body.parentNode.insertBefore(block, body);
      return;
    }

    // fallback: .page-header 다음에 삽입 (계산기 페이지)
    var pageHeader = document.querySelector('.page-header');
    if (pageHeader && pageHeader.parentNode) {
      pageHeader.parentNode.insertBefore(block, pageHeader.nextSibling);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

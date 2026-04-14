/**
 * trust-block.js - 신뢰성 정보 블록 (재사용 가능 공통 컴포넌트)
 *
 * 사용법:
 *   1. 페이지에 window.TRUST_BLOCK_CONFIG 객체를 먼저 정의합니다.
 *   2. 이 스크립트를 <script src="/assets/trust-block.js"></script> 로 로드합니다.
 *
 * Config 형식:
 *   window.TRUST_BLOCK_CONFIG = {
 *     standard:    '계산 기준 법령·고시명',          // 문자열
 *     appliedFrom: '적용 시작일 (예: 2026년 1월 1일)',// 문자열 - 법령·세율 등의 적용 시작일. "최종 검토일"과 별개
 *     exceptions:  ['예외 항목1', '예외 항목2', ...],// 문자열 배열
 *     references:  [                                 // 확인 권장처 배열
 *       { name: '링크 표시 이름', url: 'https://...' },
 *       ...
 *     ],
 *     lastReviewed: '최종 검토일 (예: 2026.03.26)',  // 문자열 - YYYY.MM.DD 권장, YYYY.MM 허용(일자 확인 후 갱신 권장)
 *   };
 *
 * 날짜 표기 원칙:
 *   - 최종 검토일(lastReviewed): YYYY.MM.DD 형식 권장 (예: 2026.03.26)
 *     정확한 일자를 모르면 YYYY.MM 허용 (예: 2026.03), 확인 후 YYYY.MM.DD로 갱신
 *   - 적용 시점(appliedFrom): 한국어 자연어 형식 (예: 2026년 1월 1일)
 *   - 이 두 필드는 서로 다른 의미:
 *     "적용 시점" = 법령·세율 등이 시행된 날짜
 *     "최종 검토일" = 편집팀이 이 계산기를 마지막으로 점검한 날짜
 */
(function () {
  'use strict';

  /* ── CSS 주입 ──────────────────────────────────────────────── */
  var STYLE_ID = 'trust-block-style';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      /* 컨테이너 */
      '.trust-block {',
      '  background: var(--gray-50, #F9FAFB);',
      '  border: 1px solid var(--dark-border, rgba(0,0,0,0.06));',
      '  border-radius: 12px;',
      '  padding: 16px;',
      '  margin-top: 16px;',
      '  margin-bottom: 0;',
      '  font-size: 13px;',
      '  line-height: 1.6;',
      '  color: var(--gray-600, #4B5563);',
      '}',
      /* 타이틀 */
      '.trust-block__title {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '  font-size: 12px;',
      '  font-weight: 700;',
      '  color: var(--gray-500, #6B7280);',
      '  margin: 0 0 10px;',
      '}',
      '.trust-block__title-icon {',
      '  width: 14px; height: 14px;',
      '  flex-shrink: 0;',
      '  fill: var(--gray-400, #9CA3AF);',
      '}',
      /* 메타데이터: 인라인 나열 */
      '.trust-block__meta {',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  gap: 6px 16px;',
      '  margin-bottom: 10px;',
      '  padding-bottom: 10px;',
      '  border-bottom: 1px solid var(--dark-border, rgba(0,0,0,0.06));',
      '}',
      '.trust-block__field {',
      '  display: flex;',
      '  align-items: baseline;',
      '  gap: 5px;',
      '}',
      '.trust-block__label {',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  color: var(--gray-400, #9CA3AF);',
      '  white-space: nowrap;',
      '}',
      '.trust-block__value {',
      '  font-size: 12px;',
      '  font-weight: 500;',
      '  color: var(--gray-700, #374151);',
      '  overflow-wrap: break-word;',
      '  word-break: keep-all;',
      '}',
      /* 예외/권장처 */
      '.trust-block__section {',
      '  margin-bottom: 10px;',
      '}',
      '.trust-block__section:last-of-type {',
      '  margin-bottom: 0;',
      '}',
      '.trust-block__section-label {',
      '  display: block;',
      '  font-size: 11px;',
      '  font-weight: 700;',
      '  color: var(--gray-400, #9CA3AF);',
      '  margin-bottom: 4px;',
      '}',
      '.trust-block__exceptions {',
      '  margin: 0;',
      '  padding-left: 16px;',
      '  font-size: 12px;',
      '  color: var(--gray-500, #6B7280);',
      '}',
      '.trust-block__exceptions li { margin-bottom: 2px; }',
      '.trust-block__refs {',
      '  margin: 0; padding: 0;',
      '  list-style: none;',
      '  display: flex; flex-wrap: wrap; gap: 6px 12px;',
      '}',
      '.trust-block__refs li::before { content: none; }',
      '.trust-block__ref-link {',
      '  font-size: 12px;',
      '  font-weight: 600;',
      '  color: var(--primary, #4F46E5);',
      '  text-decoration: none;',
      '}',
      '.trust-block__ref-link:hover { text-decoration: underline; }',
      '.trust-block__divider {',
      '  border: none;',
      '  border-top: 1px solid var(--dark-border, rgba(0,0,0,0.06));',
      '  margin: 10px 0;',
      '}',
      '.trust-block__disclaimer {',
      '  font-size: 11px;',
      '  color: var(--gray-400, #9CA3AF);',
      '  margin: 0;',
      '}',
      '@media (max-width: 480px) {',
      '  .trust-block { padding: 16px; }',
      '  .trust-block__meta { flex-direction: column; gap: 4px; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── 설정값 검증 ──────────────────────────────────────────── */
  var cfg = window.TRUST_BLOCK_CONFIG;
  if (!cfg) return; // config 없으면 아무것도 렌더하지 않음

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
   * 기타       → 그대로 출력 (pass-through)
   */
  function formatReviewDate(d) {
    if (!d) return '';
    var s = String(d).trim();
    // YYYY.MM → YYYY.MM (월 단위 허용)
    // YYYY.MM.DD → YYYY.MM.DD (정확한 날짜)
    return s;
  }

  function field(label, valueHtml) {
    return (
      '<div class="trust-block__field">' +
        '<span class="trust-block__label">' + esc(label) + '</span>' +
        '<span class="trust-block__value">' + valueHtml + '</span>' +
      '</div>'
    );
  }

  /* ── 각 필드 렌더 ─────────────────────────────────────────── */
  var gridItems = '';

  if (cfg.standard) {
    gridItems += field('계산 기준', esc(cfg.standard));
  }

  if (cfg.appliedFrom) {
    gridItems += field('적용 시점', esc(cfg.appliedFrom));
  }

  if (cfg.lastReviewed) {
    gridItems += field('최종 검토일', esc(formatReviewDate(cfg.lastReviewed)));
  }

  var exceptionsHtml = '';
  if (cfg.exceptions && cfg.exceptions.length) {
    var items = cfg.exceptions.map(function (e) {
      return '<li>' + esc(e) + '</li>';
    }).join('');
    exceptionsHtml =
      '<div class="trust-block__section">' +
        '<span class="trust-block__section-label">예외 사항</span>' +
        '<ul class="trust-block__exceptions">' + items + '</ul>' +
      '</div>';
  }

  var refsHtml = '';
  if (cfg.references && cfg.references.length) {
    var links = cfg.references.map(function (r) {
      return (
        '<li><a class="trust-block__ref-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(r.name) +
        '</a></li>'
      );
    }).join('');
    refsHtml =
      '<div class="trust-block__section">' +
        '<span class="trust-block__section-label">확인 권장처</span>' +
        '<ul class="trust-block__refs">' + links + '</ul>' +
      '</div>';
  }

  /* ── 전체 블록 조립 ───────────────────────────────────────── */
  var html =
    '<div class="trust-block">' +
      '<p class="trust-block__title">' +
        '<svg class="trust-block__title-icon" viewBox="0 0 20 20" aria-hidden="true">' +
          '<path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm.75 11.25h-1.5v-5h1.5v5zm0-6.5h-1.5v-1.5h1.5v1.5z"/>' +
        '</svg>' +
        '신뢰성 정보' +
      '</p>' +
      '<div class="trust-block__meta">' + gridItems + '</div>' +
      exceptionsHtml +
      refsHtml +
      '<hr class="trust-block__divider" />' +
      '<p class="trust-block__disclaimer">' +
        '본 계산기는 참고용이며 법적 효력이 없습니다. ' +
        '정확한 세액·금액은 관련 기관 또는 전문가에게 확인하시기 바랍니다.' +
      '</p>' +
    '</div>';

  /* ── DOM에 삽입 ───────────────────────────────────────────── */
  function inject() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var block = wrapper.firstChild;

    // 삽입 기준점 탐색 순서: .siblings-section → .sibling-section → main/main-wrap 끝
    var anchor =
      document.querySelector('.siblings-section') ||
      document.querySelector('.sibling-section') ||
      null;

    if (anchor) {
      anchor.parentNode.insertBefore(block, anchor);
    } else {
      var main =
        document.querySelector('main.page-wrap') ||
        document.querySelector('main') ||
        document.querySelector('.main-wrap');
      if (main) {
        main.appendChild(block);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

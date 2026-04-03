/**
 * blog-review-footer.js - 블로그 글 하단 검토 안내 컴포넌트
 *
 * ARTICLE_INFO_CONFIG.category 값에 따라 카테고리별 검토 안내를 렌더링합니다.
 * blog-article-info.js와 동일한 config 객체를 공유합니다.
 *
 * 지원 카테고리: tax, realestate, finance, health, pet, ai, date, salary
 */
(function () {
  'use strict';

  var STYLE_ID = 'blog-review-footer-style';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.review-footer {',
      '  background: #F9FAFB;',
      '  border: 1px solid rgba(0,0,0,0.07);',
      '  border-radius: 10px;',
      '  padding: 16px 18px;',
      '  margin: 32px 0 0;',
      '  font-size: 13px;',
      '  line-height: 1.7;',
      '}',
      '.review-footer__title {',
      '  font-size: 12px;',
      '  font-weight: 700;',
      '  color: #6B7280;',
      '  margin: 0 0 6px;',
      '}',
      '.review-footer__text {',
      '  font-size: 12px;',
      '  color: #6B7280;',
      '  margin: 0;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  var cfg = window.ARTICLE_INFO_CONFIG;
  if (!cfg || !cfg.category) return;

  var notices = {
    tax:        '실제 세금 신고·납부 전 국세청(nts.go.kr) 또는 세무사에게 확인하세요.',
    realestate: '실제 거래·계약 전 관할 기관 또는 공인중개사에게 확인하세요.',
    finance:    '실제 금융 상품 가입·투자 전 해당 금융기관에 직접 확인하세요.',
    health:     '건강 관련 판단은 의료 전문가와 상담하세요. 본 내용은 의료 조언을 대체하지 않습니다.',
    pet:        '반려동물 관련 비용은 지역·개체별로 차이가 크므로 참고용으로 활용하세요.',
    ai:         'AI 서비스 가격·성능은 수시로 변동됩니다. 최신 정보는 각 벤더 공식 사이트에서 확인하세요.',
    date:       '날짜 계산 결과는 참고용이며, 공휴일·영업일 등은 별도 확인이 필요합니다.',
    salary:     '실제 급여·퇴직금은 고용 조건에 따라 다르므로 회사 또는 고용노동부(moel.go.kr)에 확인하세요.'
  };

  var notice = notices[cfg.category];
  if (!notice) return;

  var html =
    '<div class="review-footer">' +
      '<p class="review-footer__title">검토 안내</p>' +
      '<p class="review-footer__text">' +
        '이 글은 공공기관 공개 자료를 기준으로 작성되었으며, 정보 제공 목적입니다. ' +
        notice +
      '</p>' +
    '</div>';

  function inject() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var block = wrapper.firstChild;

    // .cta-box 뒤에 삽입 (글 하단 CTA 다음)
    var cta = document.querySelector('.cta-box');
    if (cta && cta.parentNode) {
      cta.parentNode.insertBefore(block, cta.nextSibling);
      return;
    }

    // fallback: .post-body 끝에 삽입
    var body = document.querySelector('.post-body');
    if (body) {
      body.appendChild(block);
      return;
    }

    // fallback: .post-wrap 끝에 삽입
    var wrap = document.querySelector('.post-wrap');
    if (wrap) {
      wrap.appendChild(block);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

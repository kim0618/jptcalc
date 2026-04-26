# 애드센스 재신청 점검 리포트 (2026-04-26)

> 4/28 재신청 사전 점검. 콘텐츠 품질·정책·기술 5개 영역 전수 검사.

## 통과 항목

### A. 사이트 구조
- sitemap.xml 유효 (151개 URL, 무작위 10개 실파일 존재 확인)
- robots.txt 정상 (Allow: /, Sitemap 선언 포함)
- 블로그 index 카드 → posts/*.html 매칭 누락 0건
- 필수 페이지 모두 존재: about.html, privacy.html, terms.html, contact.html, disclaimer.html (.html 형태)

### B. 콘텐츠 품질
- thin blog post 0건 (전수 87개 모두 13,000자 이상)
- AI 자동생성 의심 패턴 42회 (임계 100회 미만, 통과)
- 중복 제목 0건

### C. SEO/구조화 데이터
- JSON-LD 문법 오류 0건 (블로그 + 카테고리 전수)
- FAQPage JSON-LD ↔ 본문 일치 (10개 샘플, 'Q.' prefix 정규화 후 100% 일치)
- canonical/og:url 불일치 0건

### D. 정책 준수
- 실전화번호/실주민번호 패턴 0건
- 금지 키워드 매칭 3건 모두 합법 문맥 (수의사 처방, 의사 처방 난임시술, 비유 표현)

### E. 접근성/기술
- viewport meta 태그 누락 0건
- 광고 개별 슬롯(`<ins class="adsbygoogle">`) 0건, push 호출 0건 → 자동광고 로더만 박힌 상태

## 수정 완료 (즉시 처리)
- `/calc/ai/llm-comparison/index.html:107` - em dash(—) → hyphen(-) 교체
- `/calc/tax/medical-expense/index.html:426` - em dash(—) → hyphen(-) 교체

## 요주의 (재신청 전 결정 필요)

### [REQ-1] realestate 카테고리 인덱스 thin page
- `/calc/realestate/index.html` 본문 텍스트 1,901자 (다른 카테고리 4,283~9,023자 대비 절반 이하)
- 거절 사유 "가치가 별로 없는 콘텐츠"의 직접 트리거 가능성 높음
- **권장**: `/category-enhance` 실행으로 즉시 보강

### [REQ-2] ads.txt 잔재
- `/ads.txt`에 `pub-6112766558731601` 항목 존재 (59 bytes)
- 이전 승인 시도 흔적. 재신청 전에는 비우거나 삭제 권장
- **권장**: 파일 삭제 또는 빈 파일로 교체

### [REQ-3] 광고 로더 스크립트 유지 여부
- 30+개 블로그 글, 9개 카테고리 페이지, 6개 루트 페이지에 `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-...` 로더 박힘
- 개별 `<ins>` 태그·push 호출은 0건이므로 광고가 실제로 송출되지는 않음 (자동광고용 로더만)
- 스킬 가이드 기준: 자동광고 로더만 유지는 허용. 다만 재신청 전 제거하는 게 더 안전
- **권장**: 결정 필요. 현 구조대로 유지 OR 전수 제거

### 참고 (거절 사유 아님)
- `<main>` 태그 미사용 페이지 76/77 - 사이트 디자인 선택. `<div class="post-wrap">` 등으로 대체. SEO/접근성에 결정적 영향 없음.

## 재신청 권장 여부

**[HOLD]** - 3건 선결 필요

### 선결 우선순위
1. REQ-1 (realestate 보강) - **필수**: 거절 사유 직접 연관
2. REQ-2 (ads.txt 처리) - **권장**: 정책상 이전 시도 흔적 제거
3. REQ-3 (광고 로더) - **선택**: 현 상태 유지 가능, 다만 보수적으로는 제거

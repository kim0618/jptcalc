# 애드센스 재신청 점검 리포트 (2026-04-28)

신청 예정일: 2026-04-28 (오늘)
이전 거절 사유: "가치가 별로 없는 콘텐츠"

## ✅ 통과 항목

### A. 사이트 구조
- sitemap.xml 유효 (153개 URL), 샘플 10건 모두 실존 확인
- robots.txt 적절 (Allow: /, sitemap 선언)
- ads.txt 부재 (재신청 전 정상)
- blog/index.html 카드 → 실제 파일 매핑 broken link 0건

### B. 콘텐츠 품질
- thin blog 0건 (전체 77편, 모두 13,000 byte 이상)
- thin category 0건 (전체 9개 카테고리 인덱스, 모두 8,000 byte 이상)
- AI 자동생성 패턴: "정리합니다" 17회, "완벽 가이드" 28회, "한눈에 정리" 1회 (모두 100회 임계 미만)
- em dash(—) 0건 (사이트 전체)
- 중복 제목 0건

### C. SEO/구조화 데이터
- JSON-LD 문법 오류 0건 (블로그 77편 + calc 페이지 전체)
- canonical = og:url 일치 (블로그 77편)
- FAQPage JSON-LD ↔ 본문 일치 (오늘 작업 4편 표본 검증, verify 작업으로 누적 40편 검증 완료)

### D. 정책 준수
- 금지 콘텐츠 키워드 0건 (수정 후)
- 실전화번호/주민번호 패턴 0건
- 광고 코드: 자동광고 스크립트만 79개 페이지에서 사용, 개별 `<ins>` 광고 박스 0건

### E. 접근성/기술
- viewport meta 누락 0건
- 필수 페이지 5개 모두 존재: about / privacy / terms / disclaimer / contact
- title/h1 태그 누락 0건 (샘플 20건 검증)

## ⚠️ 수정 완료

| 파일 | 내용 | 조치 |
|------|------|------|
| pet-cost-saving-tips.html | "도박입니다" 비유 표현 (정책 자동 필터 위험) | "위험한 선택입니다"로 교체 |

## ❌ 요주의 사항

**없음.** 신청 가능 상태입니다.

## 보너스 검증 (오늘 작업 정합성)

오늘 4개 스킬(blog, rewrite, meta-optimize, verify)에서 발견되어 수정한 7건 + 검증 후속 수정 1건 모두 반영 확인됨:
- national-pension-voluntary 손익분기 "4년 4개월"→"2년 2개월" 7곳 동기화 완료
- meta-optimize 6편의 6개 메타 태그 동기화 완료
- BreadcrumbList position 3 calc 경로 → blog/?cat 경로 4건 수정 완료
- dog-monthly-cost rewrite 시 추가 문장의 수치 오류 2곳 수정 완료

## 재신청 권장 여부

**[PASS]** - 즉시 신청 가능

## 신청 전 마지막 체크리스트

1. **배포 필수** - 오늘 변경한 19개 파일이 라이브에 반영되어야 함 (rsync 진행)
2. 배포 후 https://www.jptcalc.kr/blog/posts/national-pension-voluntary.html 접속 확인
3. 배포 후 Google AdSense 콘솔에서 신청

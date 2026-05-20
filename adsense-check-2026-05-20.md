# jptcalc 애드센스 3차 신청 D-1 사전 점검 리포트 (2026-05-20)

**신청 예정일: 2026-05-21 (내일)**
**이전 시도: 1차 2026-03-XX 거절, 2차 2026-04-28 거절**

---

## 1. 사이트 전체 상태 매트릭스

| 영역 | 수치 | 상태 |
|------|------|------|
| 블로그 글 | 94편 | ✅ |
| 계산기 페이지 | 67편 | ✅ |
| 합계 | 161페이지 | - |
| 광고 로더 잔존 (`pagead2.googlesyndication`) | 0건 | ✅ |
| BreadcrumbList JSON-LD | 161/161 | ✅ |
| FAQPage JSON-LD ↔ HTML faq-item 일치 | 100% | ✅ |
| Article JSON-LD `articleSection` 정합 | 94/94 (오늘 1건 수정) | ✅ |
| canonical URL 정합 | 94/94 | ✅ |
| 메타파일 동기화 (index/sitemap/rss) | 100% | ✅ |

---

## 2. 카테고리 분포 (94편)

| 카테고리 | 글 수 | 비고 |
|----------|------|------|
| 부동산 | 14 | 최다 |
| 세금 | 11 | |
| 연봉 | 10 | |
| 연금·복지 | 10 | |
| 반려동물 | 10 | |
| 금융 | 10 | |
| 건강 | 10 | |
| AI·테크 | 10 | 오늘 +1 (windsurf) |
| 날짜·D-day | 9 | 최소 |

균형 양호. 부동산↔날짜 격차 5편 (이전 6편에서 개선).

---

## 3. 5/19 → 5/20 변동 사항

### 3-1. 신규 작성
- **windsurf-vs-cursor-cost-guide.html** (AI·테크, 26,386자)
  - JSON-LD 3종 OK, 광고 로더 0, 면책 문구 명시
  - 시급/ROI 계산 모두 검산 완료

### 3-2. 보강 (thin → 5,000자+)
- **isa-guide.html** (금융): 3,407자 → 6,181자
  - 박지수씨/김성호씨 시나리오 + 5단계 가이드 + FAQ 3개 추가
  - 오늘 사전 점검에서 박지수씨 수익률 5% → 4% 정정 (단리 누적 일관성 확보)

### 3-3. 검증 (오류 수정)
| 파일 | 오류 | 수정 후 |
|------|------|--------|
| comprehensive-income-tax.html | "공동인증서(구 공인인증서)" 금지어 | "공동인증서" |
| isa-guide.html | 박지수씨 수익 337→450만 단리 불일치 | 수익률 4%로 변경, 360만원 |
| isa-guide.html | IRP 이전 "1,500만원" 근거 불명확 | "만기 수령액 일부(예: 1,500만원)" |
| gift-tax-guide.html | articleSection "부동산" (실제 세금) | "세금" |

### 3-4. 검증 (이상 없음)
- withholding-tax-guide.html
- income-tax-may-guide.html

### 3-5. 스킬 정리
- `/jpt-blog-bolster` 삭제 (23편 보강 완료)

---

## 4. 검증 항목별 결과

### A. 광고 로더 (AdSense 거절 핵심 변수)
- HTML 파일 검색: **0건** ✅
- 라이브 사이트 (acquisition-tax-2026.html 샘플): **0건** ✅
- 잔존 파일 5개는 모두 `.sh`/`.md`/`blog.md` (실제 페이지 아님)
- 복구 스크립트 `/home/tjd618/jptcalc/restore-adsense-loader.sh` 준비됨

### B. JSON-LD 3종 (Article·FAQPage·BreadcrumbList)
- 94편 전수 검증: 모두 3종 보유 ✅
- FAQPage 항목 수 일치: 100% ✅
- BreadcrumbList position 3 표준 (`blog/?cat=`): 94/94 ✅

### C. 카테고리 정합성 (articleSection)
- 명백 오류 1건 수정 (gift-tax-guide.html)
- 하이픈 표기 불일치 8건 (AI/테크↔AI·테크, 날짜/D-day↔날짜·D-day): **5/22 이후 처리** (디자인 일관성, D-1 freeze 룰 적용)

### D. 메타파일 동기화
- blog/posts/ (94) = blog/index.html post-card (94) = sitemap.xml (94) ✅
- rss.xml 74개 (최신 N개 정책, 의도적) ✅
- 새 글 windsurf의 canonical/og:url/sitemap/rss 완전 일치 ✅

### E. 글쓰기 규칙
- em dash (—): 0건 ✅
- "계산기으로", "공인인증서": 0건 (오늘 1건 수정 완료) ✅

---

## 5. 5/21 D-Day 작업 순서

### 5-1. 신청 직전 (사용자)
1. **2차 rsync 배포** (사용자 직접)
   ```
   rsync -avz --delete /home/tjd618/jptcalc/ root@223.130.151.202:/root/jptcalc/
   ```
2. **라이브 광고 로더 0건 재확인**
   ```
   curl -s https://www.jptcalc.kr/blog/posts/acquisition-tax-2026.html | grep -c "pagead2.googlesyndication"
   ```
3. **사이트 가동 정상 확인** (홈/블로그/계산기 페이지 샘플 접속)

### 5-2. AdSense 신청
- Google AdSense 콘솔 → jptcalc.kr 신청

### 5-3. 통과 후 즉시 (사용자가 "승인됐다" 알리면)
1. `restore-adsense-loader.sh` 실행 → 167페이지 광고 로더 자동 복구
2. `/home/tjd618/.claude/commands/blog.md` line 59 원복 (AdSense 라인 한 줄로)
3. 사용자 rsync 1회로 광고 로더 복구
4. AdSense 콘솔에서 자동 광고 ON
5. 6/2 bumo 신청 일정대로 진행

### 5-4. 거절 시
1. 거절 사유 캡처
2. bumo 일정 6/9~6/12로 자동 연기
3. jptcalc 4차 재신청 보강 계획 수립

---

## 6. 2차 신청(4/28) 거절 대비 변화

| 항목 | 2차 신청 시점 | 3차 신청 시점 (5/21) |
|------|--------------|--------------------|
| 광고 로더 박힘 | 167페이지 박혀있음 (W-2 변수) | **사전 일괄 제거** |
| 블로그 글 수 | 약 70편 | 94편 (+24편) |
| thin 글 (5,000자 미만) | 23편 | **0편** (전수 보강) |
| BreadcrumbList 표준화 | 부분 적용 | 161/161 완전 적용 |
| JSON-LD 3종 정합성 | 일부 불일치 | 94/94 일치 |
| 카테고리 균형 | 부동산↔최소 6편 격차 | 5편 격차 |
| 메타 description 다양성 | 단조로움 | meta-optimize 적용 |

**핵심 변수 제거 완료: 광고 로더 사전 박힘 + thin content + JSON-LD 불일치**

---

## 7. 잔존 리스크 (소)

1. **AI/테크·날짜 카테고리 articleSection 하이픈 표기 8건**: 디자인 일관성 영역이라 D-1 freeze 적용. 5/22 이후 처리. AdSense 통과에 영향 미미.
2. **rss.xml 74개 (94편 중)**: 최신 N개 정책. 정상 동작.

---

## 8. 최종 판정

**5/21 신청 진행 가능 (Go)**

- 광고 로더, 광고 로더, 광고 로더: 모두 0건 확인 완료
- thin content: 0편
- JSON-LD 3종: 100% 정합
- 메타파일 동기화: 100%
- 글 수치 오류: 오늘 추가 4건 수정 완료

이제 사용자가 2차 rsync 배포 → 라이브 재확인 → AdSense 콘솔 신청 순으로 진행하면 됩니다.

---

**점검자**: 제이퍼 계산기 편집팀
**점검 일시**: 2026-05-20

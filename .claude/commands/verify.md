# 블로그 글 오류 검증

## 목적

제이퍼 계산기 블로그 글의 **계산 오류·사실 오류·링크 오류**를 검증. 2026년 4월 28일 애드센스 신청을 앞두고 콘텐츠 품질(E-E-A-T) 확보가 최우선.

## 실행 원칙

- 사용자가 명시하지 않으면 **하루 3편** 검증
- **우선순위 × 최신순** 2단 정렬로 대상 선정
- **병렬 Explore subagent 3개**로 교차 검증 (자기검증 편향 차단)
- 발견된 오류는 부모 Claude가 **직접 재계산 후 수정**
- 검증 완료 후 `verified-posts.md`에 기록해 재검증 방지

## 대상 선정 로직

### Step 1: sitemap.xml에서 blog/posts URL + lastmod 추출
`/home/tjd618/jptcalc/sitemap.xml`에서 blog/posts 경로 전체 추출.

### Step 2: 검증 완료 목록 제외
`/home/tjd618/jptcalc/blog/verified-posts.md`에 등록된 파일명 제외.

### Step 3: 카테고리 분류
각 글의 `ARTICLE_INFO_CONFIG` 스크립트에서 `category` 값 확인 (없으면 블로그 index.html의 data-cat로 대체).

### Step 4: 우선순위 정렬

| 순위 | 카테고리 (category 값) | 이유 |
|------|----------------------|------|
| P1 | tax, finance, pension-welfare, salary | 세율·공제·복리 계산 오류 리스크 최고 |
| P2 | health | 의료 면책 리스크 |
| P3 | realestate, pet, date, ai | 상대적 저위험 |

각 순위 내에서 lastmod 최신순. P1 소진 후 P2, P3.

### Step 5: 상위 3편 선택해 사용자에게 알림 후 검증 시작

## 검증 절차

### Step 1: 3개 글 병렬 검증 (Explore subagent 3개)

각 subagent에게 **한 개의 글 파일 경로 + 아래 전체 검증 항목**을 지시. subagent는 오류만 보고하고 **수정은 하지 말 것**.

**A. 수치 계산 정확성 (가장 중요)**
- 모든 수식 직접 재계산: 복리 FV/PV, 세금 누진공제, 물가 반영 현가, 퇴직소득세 이연 등
- 시나리오별 납부세액·실수령액·실효세율 검증
- 비교표 내 각 셀의 수치 정합성
- 1~2% 오차는 OK, 10%+ 오차는 오류 보고
- **특히 주의:** 연복리 vs 월복리, 0% 가정 누락, 누진공제 빠뜨림

**B. 법률·제도 팩트**
- 세율표, 공제 한도, 법정 한도 (상증세법, 소득세법, 국민연금법, 건강보험법, 근로기준법)
- 자주 틀리는 것: 배우자 공제 최소 5억 규정, 연금소득세 나이별 세율, 퇴직소득세 이연율(60/70%), 연금소득공제 공식, 1,500만원 기준
- 2026년 기준 최신성 (개정 반영 여부)

**C. 시의성**
- 오늘 날짜 기준 3개월 이상 미래 이벤트 주제 금지
- 이미 지난 이벤트를 "올해" 기준으로 쓰기 금지

**D. JSON-LD ↔ HTML 정합성**
- Article JSON-LD의 headline·description = head의 title·meta description
- FAQPage JSON-LD의 각 Q&A = 본문 faq-item의 Q&A (문장 단위 일치)

**E. 링크·파일 실존**
- `<a href="../posts/XXX.html">` → /home/tjd618/jptcalc/blog/posts/XXX.html 실제 존재 (ls 확인)
- CTA `../../calc/XXX/` → /home/tjd618/jptcalc/calc/XXX/ 실제 폴더 존재
- 부모혜택 `bumohyetaek.kr/guide/XXX` → /home/tjd618/bumohyetaek/src/data/articles/*/XXX.ts 존재

**F. 금지어·글자수·구조**
- em dash(—), "계산기으로", "공인인증서" 포함 금지
- 순수 텍스트 15,000자 이상 (13,000 미만이면 보강 권고)
- 비교표 2개 이상, FAQ 3~5개(답변 4문장 이상), SVG 1개, 시나리오 3~4개

**G. 애드센스 리스크**
- 의료 글: 면책(disclaimer) 섹션 존재 여부 (`blog-review-footer.js` 로드 여부)
- 금융·투자 글: 투자 자문이 아닌 교육 목적임을 명시
- 지나치게 단정적인 의료/법률/투자 조언 ("반드시 OO하면 낫는다" 등)

### Step 2: 오류 확인 및 수정 (부모 Claude)

- subagent 3개 보고를 검토
- **명백한 오류**는 부모 Claude가 Bash로 **직접 재계산**해 확인 후 수정
- **확신 없는 항목**은 "의심되지만 확인 필요" 목록으로 분류해 사용자에게 보고
- subagent 계산 결과를 그대로 믿지 말고 반드시 부모가 재검산
- 오류 수정 후 수정된 텍스트의 glob 영향 확인 (예: 시나리오 숫자 변경 시 요약표·메타 description도 동기화)

### Step 3: 검증 완료 기록

`/home/tjd618/jptcalc/blog/verified-posts.md`에 다음 형식으로 추가:

```
- [파일명] (YYYY-MM-DD 검증, 오류 N개 수정 | 이상 없음)
```

### Step 4: 결과 보고

- 검증한 글 3편 목록
- 각 글별 발견된 오류와 수정 사항 (간결 bullet)
- 누적 검증 완료 편수 / 전체 블로그 글 편수 (X/Y, Z%)
- 2026-04-28 애드센스 신청까지 **남은 일수**와 **잔여 검증 목표**
- 오늘 발견된 중대 오류 유형 요약 (다음 /blog 작업 시 주의 사항으로 활용)

## 주의사항

- subagent는 Explore(read-only) 사용해 임의 파일 수정 방지
- 모든 계산은 부모 Claude가 **직접 Bash로 재계산**. subagent 수치 그대로 신뢰 금지
- `/rewrite`·`/bolster` 스킬로 글이 수정되면 재검증 대상이 될 수 있으나, 1차 패스 완료까지는 무시
- 검증 중 HTML 구조·스타일 개선은 하지 말 것. 사실·수치·링크 오류만 수정
- 글 한 편 수정으로 index.html·sitemap.xml이 영향받으면 안 되지만, 제목·desc 변경 시에는 index.html 카드 텍스트도 동기화

---
description: jptcalc 애드센스 재신청 전 최종 점검 (4/27 1회 실행 전용)
---

# 애드센스 재신청 최종 점검 스킬

4/28 재신청 하루 전 **4/27에 1회 실행**하는 사전 점검 스킬. 콘텐츠 생성·변경 없음. 검수만 수행하고 지적사항 발생 시 즉시 수정.

**이전 거절 사유**: "가치가 별로 없는 콘텐츠" → thin page·AI 자동생성 의심·저품질 시그널 제거가 목표.

## 기본 동작

- **1회 실행으로 전수 점검** (페이지 단위 아닌 사이트 전체)
- 지적사항은 **즉시 수정** (스킬이 직접 Edit 실행)
- 수정 불가한 건은 리포트에 **요주의 플래그**로 기록

## 점검 항목 (순서대로 실행)

### A. 사이트 구조

**A-1. sitemap.xml 유효성**
```bash
ls /home/tjd618/jptcalc/sitemap.xml
head -5 /home/tjd618/jptcalc/sitemap.xml
grep -c '<url>' /home/tjd618/jptcalc/sitemap.xml
```
- XML 파싱 오류 없는지
- 존재하지 않는 경로 포함 여부 확인 (URL 10개 샘플링 → 실제 파일 존재 확인)

**A-2. robots.txt**
```bash
cat /home/tjd618/jptcalc/robots.txt
```
- `Disallow: /` (전체 차단) 존재 여부
- sitemap 선언 줄 있는지

**A-3. ads.txt 부재 또는 유효성**
- 재신청 시점에는 **없거나 빈 파일**이어야 함 (아직 승인 전)
- 이전 승인 시도 흔적이 남아 있으면 삭제

**A-4. 404/broken 링크 점검**
```bash
# 블로그 index 카드가 실존 파일을 가리키는지
grep -oE 'href="\./posts/[^"]+\.html"' /home/tjd618/jptcalc/blog/index.html | sort -u | while read href; do
  file=$(echo "$href" | sed 's|href="\./|/home/tjd618/jptcalc/blog/|; s|"||')
  [ -f "$file" ] || echo "MISSING: $file"
done
```

### B. 콘텐츠 품질

**B-1. thin page 전수 확인**
```bash
for f in /home/tjd618/jptcalc/blog/posts/*.html; do
  chars=$(sed 's/<[^>]*>//g' "$f" | tr -s ' \n' | wc -c)
  [ "$chars" -lt 13000 ] && echo "THIN: $f ($chars자)"
done
```
- 결과 0이어야 함. 발견 시 `/bolster`로 즉시 보강

**B-2. 카테고리 인덱스 본문 충실도**
```bash
for f in /home/tjd618/jptcalc/calc/*/index.html; do
  chars=$(awk '/<main/,/<\/main>/' "$f" | sed 's/<script.*//; s/<style.*//; s/<[^>]*>//g' | tr -s ' \n' | wc -c)
  [ "$chars" -lt 8000 ] && echo "THIN-CAT: $f ($chars자)"
done
```
- 결과 0이어야 함. 발견 시 `/category-enhance`로 즉시 보강

**B-3. AI 자동생성 의심 패턴 대량 검출**
```bash
# 전체 블로그에서 "정리합니다", "알아보겠습니다", "완벽 가이드" 빈도
grep -rEo '정리합니다|알아보겠습니다|완벽 가이드|한눈에 정리' /home/tjd618/jptcalc/blog/posts/ | wc -l
```
- 특정 패턴이 100회 이상이면 `/rewrite` 재적용 대상 식별
- em dash(—) 사용 여부: `grep -rl '—' /home/tjd618/jptcalc/blog/posts/ /home/tjd618/jptcalc/calc/` - 발견 시 하이픈으로 즉시 교체

**B-4. 중복/거의 동일 글 탐지**
```bash
# 제목 중복
grep -rhoE '<title>[^<]+</title>' /home/tjd618/jptcalc/blog/posts/ | sort | uniq -d
```
- 중복 제목 0이어야 함

### C. SEO/구조화 데이터

**C-1. JSON-LD 문법 오류**
```bash
for f in /home/tjd618/jptcalc/blog/posts/*.html /home/tjd618/jptcalc/calc/*/index.html; do
  awk '/<script type="application\/ld\+json">/,/<\/script>/' "$f" | sed '1d; $d' | node -e '
    let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{
      try { d.split(/}\s*<script[^>]*>\s*{/).forEach((p,i,a)=>JSON.parse((i>0?"{":"")+p+(i<a.length-1?"}":""))); }
      catch(e){ console.error("JSONLD-ERR: '$f': "+e.message); }
    });' 2>/dev/null
done
```
- 오류 발생 파일 즉시 수정

**C-2. FAQPage JSON-LD ↔ 본문 일치**
- 샘플 10개 파일에서 FAQPage의 answer text와 본문 `faq-item` 텍스트 비교
- 불일치 발견 시 즉시 수정 (본문 쪽을 기준으로 JSON-LD 갱신)

**C-3. canonical/og:url 일치**
```bash
for f in /home/tjd618/jptcalc/blog/posts/*.html; do
  canon=$(grep -oE 'rel="canonical" href="[^"]+"' "$f" | sed 's/.*href="//; s/"//')
  ogurl=$(grep -oE 'og:url" content="[^"]+"' "$f" | sed 's/.*content="//; s/"//')
  [ "$canon" != "$ogurl" ] && echo "MISMATCH: $f"
done
```

### D. 정책 준수

**D-1. 저작권 위험 콘텐츠**
- 타 사이트에서 복사한 긴 문단 여부 (우연 일치 수준 초과)
- 이미지 출처 없이 게시된 외부 이미지 유무

**D-2. 금지 콘텐츠**
```bash
# 성인/도박/의료 오용/무면허 자문 연상 키워드
grep -rEil '도박|베팅|성인용품|의사 처방|무허가|불법 복제' /home/tjd618/jptcalc/blog/posts/ /home/tjd618/jptcalc/calc/
```
- 발견 시 문맥 확인 → 합법 맥락이면 통과, 문제 시 글 삭제 또는 수정

**D-3. 개인정보 포함 여부**
```bash
# 실전화번호/실주민번호 패턴
grep -rEl '01[0-9]-[0-9]{4}-[0-9]{4}|[0-9]{6}-[1-4][0-9]{6}' /home/tjd618/jptcalc/blog/posts/
```
- 예시용 형식은 `010-0000-0000`, `000000-0000000` 같이 명백히 가짜여야 함

**D-4. 광고 코드 잔재**
```bash
grep -rl 'adsbygoogle\|pagead2.googlesyndication.com\|ca-pub-' /home/tjd618/jptcalc/blog/posts/ /home/tjd618/jptcalc/calc/
```
- 재신청 전에는 광고 코드 **제거 권장** (또는 자동광고만 유지, 개별 삽입 광고 제거)
- **판단 기준**: 현재 코드가 이전 신청 시점과 동일하면 유지, 개별 `<ins>` 태그 박힌 페이지가 있으면 제거

### E. 접근성 / 기술

**E-1. 모든 페이지 모바일 반응형 확인**
- viewport meta 태그 존재: `grep -rL 'name="viewport"' /home/tjd618/jptcalc/blog/posts/`
- 누락 파일 있으면 즉시 삽입

**E-2. 페이지 로딩 오류 없음**
- 주요 페이지 20개 sampling하여 `<title>`, `<h1>`, `<main>` 태그 존재 확인

**E-3. 필수 페이지 존재**
- `/about/` 또는 소개 페이지
- `/privacy/` 또는 개인정보처리방침
- `/terms/` 또는 이용약관
- `/contact/` 또는 문의 페이지
```bash
ls /home/tjd618/jptcalc/{about,privacy,terms,contact}/index.html 2>&1
```

## 실행 결과 리포트 형식

`/home/tjd618/jptcalc/adsense-check-{YYYY-MM-DD}.md`에 저장:

```markdown
# 애드센스 재신청 점검 리포트 (2026-04-27)

## ✅ 통과 항목
- sitemap.xml 유효, URL N개 실존 확인
- robots.txt 적절
- thin blog 0건
- thin category 0건
- ...

## ⚠️ 수정 완료
- xxx.html: em dash(—) 2건 → 하이픈 교체
- yyy.html: FAQ JSON-LD 불일치 → 본문 기준 갱신

## ❌ 요주의 (신청 전 결정 필요)
- 광고 코드 잔재: /blog/posts/zzz.html (ca-pub 포함) → 제거 결정 필요
- 필수 페이지 누락: /contact/ 없음 → 생성 결정 필요

## 재신청 권장 여부
[PASS] 또는 [HOLD (x건 선결 필요)]
```

## 작업 흐름

1. A~E 순서대로 전수 실행
2. 자동 수정 가능한 건 Edit 도구로 즉시 처리 (em dash, JSON-LD 불일치, viewport 누락 등)
3. 판단 필요한 건(광고 코드, 필수 페이지 생성)은 사용자에게 질문
4. 최종 리포트 출력 후 [PASS]/[HOLD] 판정
5. [HOLD]면 선결 과제 목록 제시, 해결 후 재실행 권장

## 금지

- 콘텐츠 **신규 생성 금지** (이 스킬은 검수+소규모 수정 전용)
- 사용자 동의 없이 페이지 **삭제 금지** (플래그만 올림)
- 재신청 자체는 자동 수행하지 않음 (사용자가 Google AdSense 콘솔에서 직접 신청)


## 완료 후 로그 기록

스킬 실행이 완료되면 반드시 아래 명령으로 `skill-log.json`에 기록한다:

```bash
python3 -c "import json,datetime; logs=json.load(open('/home/tjd618/skill-log.json')); now=datetime.datetime.now(); logs.insert(0,{'date':now.strftime('%Y-%m-%d'),'time':now.strftime('%H:%M'),'project':'jptcalc','skill':'adsense-check'}); open('/home/tjd618/skill-log.json','w').write(json.dumps(logs,ensure_ascii=False,indent=2))"
```

$ARGUMENTS

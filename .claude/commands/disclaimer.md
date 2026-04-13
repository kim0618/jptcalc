---
description: 건강 글 의료 면책 warning 섹션 추가 (하루 5개씩)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 건강 글 의료 면책 warning 섹션 추가

health-care 카테고리 글에 의료 면책 warning 섹션을 추가하는 작업.
YMYL(Your Money Your Life) 구글 정책 대응을 위해 기존 cautionNote(1줄 면책)보다 눈에 띄는 warning 박스를 본문에 추가한다.

## 작업 원칙

- **하루 5개**만 수정한다. 그 이상 요청해도 5개까지만.
- 수정 대상: `/home/tjd618/bumohyetaek/src/data/articles/health-care/*.ts` (index.ts 제외)
- updatedAt 날짜를 오늘 날짜로 변경한다.

## 수정 완료 추적

작업 전 반드시 `/home/tjd618/bumohyetaek/.claude/disclaimer-done.txt` 파일을 확인한다.
- 파일이 없으면 새로 생성한다.
- 이미 수정된 글의 slug가 한 줄씩 기록되어 있다.
- 오늘 수정할 5개는 이 파일에 없는 글 중에서 선택한다.
- 수정 완료 후 slug를 이 파일에 추가한다.
- 모든 health-care 글이 완료되면 "모든 건강 글 면책 추가 완료"를 알려준다.

## 추가할 warning 섹션

각 글의 sections 배열에서 **마지막 summary 섹션 바로 앞**에 아래 형태의 warning 섹션을 추가한다.
summary가 없으면 sections 배열의 마지막에 추가한다.

```typescript
{
  type: 'warning',
  heading: '의료 안내 사항',
  body: '이 글은 일반적인 건강 정보를 제공하며, 의학적 진단이나 치료를 대체하지 않습니다. 증상이 있거나 치료가 필요한 경우 반드시 의사와 상담하세요. 개인의 건강 상태에 따라 적합한 치료법이 다를 수 있습니다. 응급 상황 시 ☎ 119, 건강 상담은 ☎ 1577-1000(국민건강보험공단)으로 문의하세요.',
},
```

## 주의사항

1. **기존에 이미 '의료 안내 사항' heading의 warning 섹션이 있는 글은 건너뛴다** (중복 방지)
2. 기존에 다른 warning 섹션이 있어도 (예: '이런 증상이면 빨리 병원에 가세요') 그건 그대로 두고, 새 warning을 별도로 추가한다
3. sections 외 다른 필드(title, summary, faq 등)는 절대 수정하지 않는다
4. updatedAt만 오늘 날짜로 변경한다
5. em dash(-) 사용 금지, 하이픈(-) 사용

## 작업 순서

1. `/home/tjd618/bumohyetaek/.claude/disclaimer-done.txt` 읽기 (없으면 빈 목록)
2. health-care 디렉토리의 전체 글 목록 확인
3. 완료 목록에 없는 글 중 5개 선택 (파일명 알파벳 순)
4. 각 글 파일을 읽고, '의료 안내 사항' warning이 이미 있는지 확인
5. 없으면 sections 배열의 적절한 위치에 warning 추가 + updatedAt 변경
6. disclaimer-done.txt에 slug 추가
7. 완료 후 결과 요약: 수정한 글 5개 목록 + 남은 글 수

$ARGUMENTS

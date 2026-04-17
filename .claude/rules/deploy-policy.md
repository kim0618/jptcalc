# 배포 정책

## Claude의 역할 범위

- 파일 생성/수정 (HTML, CSS, JS)
- `/blog/index.html`, `sitemap.xml`, `rss.xml` 업데이트
- **여기까지가 끝**

## Claude가 절대 실행하지 않는 것

```bash
# 아래 명령어 실행 금지
rsync -avz ...
ssh ...
scp ...
```

배포(rsync)는 사용자가 직접 수행. Claude는 배포 명령어를 제안하거나 실행하지 않음.

## 작업 완료 보고 형식

파일 생성/수정 완료 후:
- 생성/수정한 파일 목록 나열
- "빌드 완료. 배포는 직접 진행해 주세요." 로 마무리
- rsync 명령어 출력 금지

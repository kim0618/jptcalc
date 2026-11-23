---
description: 제이퍼 티스토리 예약 발행 전용 - /tistory로 작성 완료된 원고를 윈도우 크롬 자동화로 예약(08:00)·이미지 업로드·결과 캡처 확인, 예약 글 본문 교체
allowed-tools: Read, Edit, Glob, Grep, Bash
---

# /tistory-publish [번호들] [--update]

예: `/tistory-publish t2-t6` (새로 예약), `/tistory-publish t3 t4 --update` (이미 예약된 글의 본문·캡처만 교체)

원고 작성은 `/tistory`가 한다. 이 스킬은 **완성된 파일을 티스토리에 올리는 일만** 한다. 글 내용은 고치지 않는다(고칠 게 보이면 멈추고 보고).

파일: `~/jptcalc/tistory/` (`posts/`, `meta/`, `caps/`, `thumbs/`, `publish.sh`, `ledger.tsv`, `queue.md`). 운영 범위는 `rules.md` §10.

## 할 수 있는 것 / 없는 것 (rules §10-2)
- 예약 발행(08:00, 공개)만. 즉시 발행 금지. 예약이 안 걸리면 임시저장으로 멈추고 보고.
- 내가 건 **발행 전** 예약 글의 본문·이미지 교체(`--update`).
- 발행된 글 수정·삭제, 블로그 설정·스킨·메뉴·카테고리 변경, 댓글·공감은 사용자가 그때 시킬 때만.

## 절차

### 1. 사전 확인
- publish.sh가 실행 전에 check_post.py와 **mobile_check.mjs(휴대폰 폭 340px)** 를 돌린다. 하나라도 실패하면 크롬을 켜지 않는다.
- 대상마다 `posts/tNNN-*.html`, `meta/tNNN.txt`, `thumbs/tNNN.jpg`, (본문에 `[[CAPTURE1]]` 있으면) `caps/tNNN-cap.jpg`가 있는지.
- `queue.md` 상태가 "검증 완료"인지. "작성 완료"면 `/tistory-verify`부터, 그 전이면 `/tistory`부터라고 보고하고 멈춘다.
- `--update`면 `meta/tNNN.txt`에 `POSTNO:` 줄이 있어야 한다(새 예약 후 글 번호를 적어 둔다). 제목이 meta와 다르면 같이 맞춘다.
- 윈도우 크롬이 켜져 있는지: `powershell.exe -NoProfile -Command "(Get-Process chrome -ErrorAction SilentlyContinue).Count"`.

### 2. 실행 (run_in_background, 5편 20~30분)
```bash
cd ~/jptcalc/tistory && ./publish.sh t002 t003 ...            # 새 예약
cd ~/jptcalc/tistory && ./publish.sh --update t003 t004 ...   # 예약 글 본문·캡처 교체
```
publish.sh가 검사기(check_post.py)를 먼저 돌리고 하나라도 실패하면 크롬을 켜지 않는다. 크롬 1회 호출로 모든 편을 처리하고, 끝에 자기가 연 탭을 닫는다.

### 3. 결과 확인 (직접 본다)
- **원본 대조**: `./verify.sh <글번호들>` (run_in_background) → 크롬 읽기 전용 추출 후 `verify.py`가 제목·카테고리·날짜·태그·소제목·표/이미지/링크 수·alt·이미지 로딩·UTM·www·대표이미지를 원본과 맞춘다. 문제 0이 될 때까지 `--update`.
- 출력의 편별 글 번호·예약 시각·본문 이미지 2장(맨 위 대표이미지 alt=제목, 캡처 alt=ALT)·목록 대표이미지 교체 여부.
- `/mnt/c/Users/jinsung/Downloads/claude-chrome/shots/tNNN-*.jpg`를 Read로 전부 본다: 표 깨짐, 간격, 맨 위 대표이미지·캡처 2장, 흰 바탕 상단. 본문 끝에 태그·잘못 들어간 글자가 남지 않았는지(11/23 t17 태그가 본문에 들어갔다 지워짐).

### 4. 기록·보고
- `ledger.tsv`: post_no 채우기(새 예약은 행 추가: date, no, post_no, category, title, calc, axis, intro, structure).
- `queue.md` 상태 "예약 완료(글 N)".
- 사용자에게 한 번에: 날짜별 제목·주소, 확인할 점. 사용자가 편집 화면에서 직접 저장하면 예약이 풀릴 수 있으니 수정은 말로 받는다.

## 알아 둘 것 (11/19~20 겪은 일)
- 크롬의 티스토리 로그인이 풀리면 예약 글·관리 페이지가 전부 "권한 없음". 시작 전에 로그인부터 확인하고, 풀렸으면 사용자에게 로그인 요청.
- 새로 올린 본문 이미지에 티스토리 "불법촬영물 검토중" 자리표시가 뜨지만 시간이 지나면 저절로 풀린다. **확인·기록·보고 대상 아님**(11/23 사용자: 왜 계속 말하냐).
- 크롬 프롬프트에 한글을 넣으면 "???"로 깨진다. 한글 문자열을 찾게 할 때는 `\uAC80` 같은 유니코드 이스케이프로 쓰거나, 한글 데이터는 UTF-8 파일로 주고 Read하게 한다.
- verify.sh는 본문 문장까지는 대조하지 않는다. 자동화가 "고쳤다"고 보고한 편은 스크린샷으로 해당 부분을 직접 본다.
- 이미 발행된 글을 `--update`하면 날짜는 건드리지 않고 발행 상태 유지(스크립트 지시에 들어 있음). 발행된 글 수정은 사용자가 시킬 때만.
- 공개된 글은 로그인 없이 WSL 헤드리스로 직접 확인(PC 1280·휴대폰 390 캡처, 이미지 naturalWidth, 가로 넘침).
- 스킨 CSS 원본 백업: `C:\Users\jinsung\Downloads\jptcalc-tistory\skin-style-backup-20261120(-b).css`. 지금 스킨 끝에 붙은 우리 CSS는 `~/jptcalc/tistory/skin/white-header.css` 한 블록뿐.

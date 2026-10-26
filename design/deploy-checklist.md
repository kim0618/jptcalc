# 리뉴얼 배포 전 체크리스트

## ★ 배포 완료 (2026-10-26 15:51 KST, main `1ab44d8`)

> 아래 표는 배포 직전까지의 기록과 배포 결과다. 롤백: nginx는 `sites-available/jptcalc.kr.bak-20261026`으로 되돌린 뒤 reload, 사이트는 `e36a541`을 git archive로 꺼내 같은 필터(`.deploy-filter`)로 rsync.

| 구분 | 항목 | 상태 |
|---|---|---|
| 완료 | main 동기화(10/26 재확인: main HEAD `4ad2db5`, 미커밋 0) | `2bc6751` 이후 main 변경은 `4ad2db5` 1건(`.deploy-filter` 추가·`.claude/rules/deploy-policy.md`·`adsense-check-2026-05-20.md`, 사이트 파일 0). 작업본은 이 3개를 건드리지 않아 merge 때 main 판이 그대로 들어오므로 작업본에 복사하지 않음. 그 밖에는 작업본과 차이 0. 글 4편은 원고에 반영 후 생성, css 12·rss·sitemap·date-detail-shell 등 main 판, `.claude/commands/blog.md·verify.md`는 3방향 병합(충돌 0, 일시정지 블록 포함) |
| 완료 | dti·pyeong 배포용 교체 | main 판으로 교체(운영과 결과 일치, JS 오류 0), 리뉴얼 판은 `design/hold/realestate/{dti,pyeong}/` 보관, 옛 자산 11개 유지 |
| 완료 | 파비콘·logo.svg·manifest 교체 | 옛 파일은 `design/hold/old-icons/` |
| 완료 | 헤더 펼침 메뉴(H2) | 데스크톱 상황별·카테고리 패널, 모든 페이지 상황 시트(site-shell.js), 데이터 `/assets/ds/situations.json`·`cat-menu.json`(build_home.py가 생성) |
| 완료 | 홈 두 칸 | 왼쪽 상황·카테고리·기준이 바뀐 계산기 / 오른쪽 검색·시즌·최근(최대 3)·TOP 7, 두 칸 끝 차이 46·16px(최근 0·3개) |
| 완료 | 정보 페이지 5개 새 틀 | 소개·문의·면책·개인정보·약관(build_pages.py, 원문 글자 동일·head 0, 원본은 `design/tools/orig/pages/`) |
| 완료 | 간격 기준 | tokens.css `--gap-*`·`--pad-card`, base.css "간격 정리" 블록 재작성, 143페이지 × 2폭 실패 0(`design/spacing-audit.md`) |
| 완료 | 블로그 표지 184편 | `/assets/img/blog-thumb/{slug}-16x9·-16x9-sm·-3x1.webp`(합계 약 11.8MB), 목록·대표·많이 읽은 글·글 머리·계산기 관련 가이드에 연결, og:image 그대로 |
| 완료 | 계산기 하단 목록 | 다른 ○○ 계산기(아이콘 없는 줄, 현재 페이지 제외)·관련 가이드(표지 썸네일 + 제목 2줄), `scripts/inject-sibling.mjs` |
| 완료 | 생성 재현성 | `bash design/tools/build_all.sh` 하나로 전체 생성(convert_calc 85 → build_hub 11 → build_home → build_pages → build_blog → inject-sibling → asset_version). 첫 실행에 빈 줄 차이 53개 해소, 다시 실행 시 바뀐 파일 0 |
| 완료 | 생성기 없는 페이지 | **부동산 계산기 17개와 부동산 허브(`calc/realestate/`)는 생성기가 없다(원본 백업 없음) → 직접 고치는 페이지.** build_all은 이들에 하단 목록(inject-sibling)과 `?v=`만 손댄다. dti·pyeong은 11/9까지 main 판(`?v=`만) |
| 완료 | 검토 안내·상자 묶음 | 검토 안내(글·계산기)는 카드 없이 한 줄(작은 아이콘 + --text-sub). 글 안 같은 종류 상자가 잇달아 오면 구분선 있는 한 장으로. 카드 3개 이상 연속 = 1곳(아래 예외 목록) |
| 완료 | 캐시 버전 표시 | 309페이지의 공용 CSS·JS 주소에 `?v=` 부착(외부 스크립트·파비콘·manifest 제외), site-shell.js가 실행 중 부르는 calc-registry·cookie-consent·메뉴 JSON도 같은 값. dti·pyeong은 주소 외 main과 바이트 동일, inject-sibling은 옛 디자인 페이지를 건너뜀 |
| 완료 | 최종 재검사(10/20 마감) | 아래 행의 항목 + 계산 결과 102개 `--expect 102` 통과, 간격 실패 0(블로그 184편 전부 포함) |
| 완료 | 최종 재검사(10/20) | 링크 0·head 0·JS 0·넘침 0·그라데이션 0·이모지 0(dti·pyeong 제외)·블로그 크롬 184·계산 결과 불일치 0(날짜 10/19 고정)·간격 실패 0 |
| 완료 | 계산 버튼 결함(10/21, 배포 차단 해제) | 인라인 `onclick="DSCalc.submit(..., ["id"])"` 계산기 58페이지(생성 46 + 부동산 직접 12)의 큰따옴표가 속성을 끊던 것 → `data-calc-submit`·`data-result`·`data-required` + calc-kit.js 클릭 위임. 부동산 자체 함수 3개(acq·dsr·ltv)와 보관본 dti·pyeong도 같은 방식. 빈 필수칸은 버튼 위 검증 안내 한 줄(`.ds-calc-hint`), 계산 뒤 결과가 안 보이면 HTML min·max 범위 안내, `a|b` 묶음(한 칸 이상)·선택자 필수칸, 모드별 입력 함수가 다른 페이지는 보이는 칸의 입력 이벤트로 계산 |
| 완료 | 클릭 검사가 찾은 추가 결함(10/21) | 버튼이 인자 받는 입력 함수(onNumInput)를 불러 JS 오류 4페이지 → 생성기가 안쪽 계산 함수로, 필수칸 없어 빈 상태 클릭 무반응 32페이지 → conv_cfg `required`, 글자수 세기 결과 상자가 늘 숨어 있음 → `static_card`, date 5종 옛 `.calc-btn` → 공용 버튼(문구 유지), 양도소득세 전액 비과세가 입력 칸 안 글자로만 나옴 → 결과 카드, 시급 계산기 '시급으로' 모드에서 버튼이 다른 모드 함수를 불러 결과를 숨김 → 보이는 칸 함수로, 연금소득세 '공적연금'처럼 입력칸 없는 모드는 계산 버튼 숨김 |
| 완료 | 새 검사 2개(10/21, build_all.sh 8·9단계) | `onattr_check.py`(전 페이지 on* 속성 JS 구문 검사, 보관본 포함) · `click_audit.py`(실제 크롬: 계산기 102 빈 상태·입력→클릭→결과·스크롤·기대값·결과 버튼·이어서 계산 + 홈·허브·블로그·정보 페이지 버튼 전부, 390·1280, 약 13분, `SKIP_CLICK=1`로 생략 가능하나 배포 전엔 돌릴 것). 둘 다 옛 결함을 넣은 대조군에서 실패를 내는 것 확인. 입력·읽기는 `calc_inputs.py`(baseline_auto와 공용) |
| 완료 | 기대값 정정 3건(10/21, `results/expected_102.json`) | 배란일 b(주기 56일)·공동명의 b(지분 100)는 범위 밖이라 결과가 숨겨지는데 숨은 카드 글자를 읽고 있었음 → `cases.json` 수동 케이스(주기 35·지분 70), 값은 main에서 다시 받음(공동명의는 이모지 하나 외 동일). 양도소득세 a(비과세)는 페이지 수정 후 작업본 값 |
| 완료 | 화면 수정(10/21) | hover는 `@media (hover: hover)` 안으로(터치 뒤 어두운 상태 남던 것), 눌림은 `:active`만 / 결과 금액 줄바꿈 금지(keep-all, 큰 숫자는 한 줄 + 칸 폭에 맞게 축소) / 정보 페이지 읽기 폭 `--read-max` 720 가운데 / 바닥글이 화면 바닥에(body 세로 flex, 전 페이지 배치 전후 대조: 바닥글 외 차이는 의도한 11건뿐) / 저작권 문구 site-shell 한 곳에서 홈 문구로 통일(페이지별 원문 50여 종은 화면에서 안 씀, HTML 원문은 그대로) |
| 완료 | 바닥글 면책 문구 복원(10/21 2차) | 저작권 줄은 홈 문구 하나 유지, 페이지 HTML 바닥글의 원래 면책·안내 문구(57종)는 site-shell.js가 읽어 저작권 줄 바로 위에 원문 그대로(작은 글씨, 남색 바탕 대비 때문에 --text-muted 5.3:1). main 원문 대조 `footer_note_check.py`: 원문 있는 181페이지 전부 화면에 나옴(누락 0), 원문 없던 125페이지에 지어낸 문구 0. 참고: main 운영에서는 footer-unified.js가 실행 중 바닥글을 바꿔 이 문구들이 허브 2개(auto·baby) 말고는 화면에 안 보였다. 같이 고친 것: 생성기 기본 문구(원문 없는 글·404·정보 페이지)를 홈 문구로, 디딤돌·전세대출 원문 복구, 중개수수료의 옛 mega-footer → 새 바닥글, 홈 원문 "(JPT Calc) - 본 계산 결과는 참고용입니다.", build_all 순서 build_blog → build_pages(정보 페이지가 404 바닥글을 복사) |
| 완료 | 양도소득세 기대값 a(10/21 2차) | main에서 같은 입력으로 화면에 보인 결과(비과세 배너)를 기준으로, 표시 위치는 무시하고 숫자 대조(`a_compare: numbers`, compare_results·click_audit 공통). 9억·12억 일치, 작업본에 더 있는 양도차익 4억원은 main 2주택 경로 값과 같음 |
| 완료 | 인수 테스트 결함 수정(10/21 3차) | 빈칸 안내(포커스 없음·칸 아래·빈 칸마다, calc-kit.js need/clearNeeds), 날짜 칸(글자 = 키보드, 달력 아이콘 버튼 = 달력, dateEnhance), 생년월일 달력(연도 상자·30년 전), 상황 시트 터치 자동 포커스 제거, 모바일 탭바 카테고리 바텀시트(#c, GA4 hub_calc_click from=tab_sheet), 헤더 열린 메뉴만 밑줄, 결과 복사 대체(calc-result-tools.js copyText, window.jptCopyText, 중개수수료도 사용). 에뮬레이터·WebKit 재현 통과(`design/test-final/RESULTS.md` 수정 확인) |
| 완료 | 화면 리뷰 2차 수정(10/21) | 작은 표지 1:1(`{slug}-1x1.webp` 240px, `build_blog_covers.py --ratio 1x1`, 184편 겹침·넘침 0): 모바일 목록 카드 88px·많이 읽은 글 56px·관련 가이드 64px, 데스크톱 목록은 16:9 유지 / 목록 메타 한 줄(모바일 카테고리·날짜, 데스크톱 읽는 시간 포함) / 본문 표: 낱말 단위로만 꺾임(site-shell cellWords, 숫자 뒤 띄어 쓴 단위는 붙임), 첫 칸 최소 폭, 넘칠 때만 오른쪽 흐림 + "옆으로 밀어서 보기", 검사 `table_check.py`(쪼개짐·분리 0, 표 1,702개) / 신뢰성 정보 통합 카드(작성·검토·기준·참고 기관·예외·확인처·관련 계산기·검토 안내, 원문 그대로·같은 문장 한 번, 계산기·블로그 글) / "관련 계산기"에서 "다른 ○○ 계산기"와 겹치는 카드 제거(inject-sibling, 결과 102개 모두 섹션 삭제, "이어서 계산" 유지) / 카드 제목 text-wrap: balance / 데스크톱 가이드 문단·목록·FAQ 읽기 폭 / 바닥글 면책 줄에서 저작권 줄과 같은 뜻의 문장 생략(footer_note_check는 저작권 줄 포함 판정) |
| 완료 | 배포 직전 점검(10/26) | `build_all.sh` SKIP_CLICK 없이: 바뀐 파일 0·`?v=` 갱신 0, on* 구문 0(312페이지), 한 줄 실패 0, 클릭 검사 실패 0(102/102 일치, 960초). 추가: check-post-chrome 184 정상·noindex·rate-tables 통과, link_check 깨진 것 0(304페이지), head_check 다름 0. `.deploy-filter` 로컬 시험(scratchpad 복사): 1,225파일, 내부 파일 0, 참조 누락 0, assets/ds JSON 2개 포함. dti·pyeong은 `?v=` 외 main과 동일. 8770 미리보기 켬 |
| 확인 | merge 충돌 예상(10/26, `git merge-tree` 시뮬레이션) | `git merge redesign`은 **6개 파일에서 충돌로 멈춘다**: `blog/index.html`, `blog/posts/{bmr-calories,income-tax-deduction,isa-guide,suneung-dday-guide}.html`, `calc/date/weekday/index.html`(main 판 내용은 이미 원고·inject-sibling으로 작업본에 반영됨). 6개 모두 redesign 쪽을 고르면 결과 = 작업본 + main `4ad2db5`의 3파일. `.claude/commands/blog.md·verify.md`는 자동 병합되고 작업본 판과 같다. **커밋 뒤 재시뮬레이션(main `e36a541` × redesign `cd1ed2d`): 같은 6개, `.deploy-filter`·`.gitignore` 충돌 없음, 결과 = redesign + main의 `.deploy-filter`(라이선스 줄 포함)·`deploy-policy.md`·`adsense-check` 3파일** |
| 완료 | `.gitignore` 추가(10/26) | 무시: `design/step-*/`·`design/test-final/`·`design/review-final/`·`design/tools/results/**/*.png`·`design/tmp*/`·`**/_raw/`·`**/__pycache__/`(파일은 로컬에 남음, 442파일 227.9MB). 추적 유지 확인: references 27·brand 3·tools 173(빠지는 것 `__pycache__` 5개뿐)·blog-source 185·hold 10·design/*.md 4·*.csv 1·situations.json. 남은 것: 루트 `__pycache__/add_jsonld.cpython-312.pyc`는 a74cc04부터 추적 중이라 `.gitignore`로 안 빠짐, `design/step-A-dti-390.png`(129KB)는 폴더 밖이라 커밋에 들어감 |
| 완료 | 알림(토스트) 탭바 겹침 수정(10/26) | 원인: calc-result-tools.js가 실행 중 head 끝에 넣는 `.toast`(`#111827`, `bottom:30px`)가 base.css를 덮음 → 이 인라인 규칙은 base.css 없는 옛 화면(dti·pyeong)에만 넣고, 리뉴얼 화면은 base.css가 토큰으로 그림(`--text`·`--surface`·`--radius-md`·`--space-*`·`--fs-label`·`--shadow-pop`). 1023px 이하 탭바 화면: bottom = `--h-tabbar` + 결과 바 보일 때 `--h-sticky-bar` + `--space-3` + safe-area, 데스크톱은 `--space-4`*2(32px, 예전 30px). 실측 390: 토스트 728~776·탭바 788(간격 12), 결과 바 있을 때 672~720·결과 바 732, 320도 같은 간격, dti는 예전과 같음(#111827·30px). 키보드 열림(ds-kb)은 따로 처리 안 함(복사 버튼을 누르면 포커스가 빠짐). 검사: build_all 2회차 바뀐 파일 0·on* 0·한 줄 0, link 0·head 0, 클릭 검사 전체 재실행 실패 0(102/102). 2회차 build_all 안의 클릭 검사는 외부 CDN 지연(flatpickr 미로드·로드 30초 초과)으로 11건 실패였고 같은 페이지 재검사·전체 재실행 모두 0 |
| 완료 | 외부 CDN 자체 호스팅(10/26) | `/assets/vendor/{이름}/{버전}/`: pretendard 1.3.9(woff2 7개 300~900·`pretendard.css`는 npm 원본에서 그 굵기·woff2만 남김, Thin·ExtraLight는 어디서도 안 써서 뺌, 300은 flatpickr 달력 머리가 씀), flatpickr 4.6.13(min.js·min.css·l10n/ko.js), html2canvas 1.4.1. 전부 npm 공식 배포본이고 CDN 파일과 바이트 동일(Pretendard는 CSS의 글꼴 경로만 다름). 라이선스 파일 같이 둠(OFL·MIT·MIT). 합계 5.48MB(글꼴 5.2MB, 방문자는 쓰는 굵기만 받음). 교체는 `asset_version.vendorize()`가 `stamp_html` 안에서 하므로 모든 생성기·새 글 흐름에 자동 적용, orig·원고는 그대로. jsdelivr preconnect·dns-prefetch 줄 제거, calc-result-tools.js의 html2canvas 실행 중 로드도 로컬, 표지 생성기는 route로 로컬 글꼴(표지 8장 픽셀 동일). **dti·pyeong은 CDN 그대로(11/9까지 main 판)**. 화면 비교 `design/step-M/compare-*.png` 12장(날짜 계산기 2개 + 달력 열림, 홈, 블로그 글, 390·1280) 전부 픽셀 동일 |
| 완료 | click_audit 보강(10/26) | `--offline`(광고·분석 말고 외부 요청 전부 막기), 외부 요청 목록 출력(dti·pyeong에서 나간 것은 따로), **"저장·공유" 토글 안 4개 버튼(저장·기록·결과공유·이미지저장)을 10/19 접기 이후 한 번도 안 누르던 것 수정**, 이미지 저장은 6초 안에 실제 파일이 받아져야 통과. 결과: 외부 차단·비차단 둘 다 실패 0, 이미지 저장 100/100, 남은 외부 요청은 GA·애드센스·카카오 애드핏(2)뿐 |
| 완료 | 신뢰성 카드 넘침 수정(10/26) | `ai-chatbot-subscription-comparison` 320·390에서 문서 폭 421px: 카드 값 "OpenAI·Anthropic·Google·Perplexity·Microsoft"(가운뎃점만으로 이어져 줄이 안 바뀜)가 격자를 넓힘 → base.css `.trust-block__value`에 `min-width: 0; overflow-wrap: anywhere`. 전 페이지 넘침 검사(308쪽 × 320·390·1280) 실패 0(네이버 소유확인 파일 제외) |
| 완료 | 10/26 최종 검사(자체 호스팅·카드 수정 뒤) | build_all 2회차 바뀐 파일 0·on* 0·한 줄 0·클릭 0, `--offline` 클릭 0, link 0·head 0·check-post-chrome 184·noindex·rate-tables 통과, 그라데이션 0·이모지 0, `--expect 102` 102/102(baseline_auto는 `DS_NOW=2026-10-19T12:00:00+09:00` 필수: 안 주면 '오늘' 기준 6개 계산기 12건이 날짜 차이로 불일치), 간격 307쪽 × 2폭 실패 0 |
| **사용자** | **라이선스 파일 배포 여부(결정 필요)** | `.deploy-filter`가 `*.md`·확장자 없는 파일·루트 밖 `.txt`를 막아 `assets/vendor/*/LICENSE*` 3개는 서버에 안 올라간다(서비스 파일 12개는 통과, 로컬 시험 1,237파일). 압축본 머리에 MIT 표기(flatpickr·html2canvas)와 pretendard.css 머리에 저작권·OFL 표기는 들어 있음. 파일도 올리려면 main `.deploy-filter` 2)항 위에 `+ /assets/vendor/**/LICENSE*` 한 줄 |
| 도구 | 미리보기 서버 `design/tools/preview_server.py [8770]` | 캐시 끔 + HTML 응답에서 광고·GA 외부 스크립트 태그만 빼고 보냄(파일은 그대로). 화면 크기 틀 `design/tools/viewport.html?w=390&h=844&u=/경로/` |
| 완료 | 3차 수정(10/22) | **[배포 차단 해소] 모바일 홈 최근 기록 칩이 글자 단위로 세로로 꺾임(높이 68~157px)**: 원인은 2차에 넣은 `.h-col :is(h3, b) { text-wrap: balance }`. text-wrap 축약형이 nowrap을 덮었다 → `text-wrap-style`(지원 안 하면 축약형)·대상은 여러 줄 카드 제목만. 칩은 줄지 않고 한 줄, 칩 줄 가로 스크롤(넘칠 때만 끝 흐림), 긴 결과값 말줄임. 한 줄 검사가 함께 찾은 것: 블로그 CTA 버튼 320에서 두 줄 20종 → 한 줄 + 칸 폭에 맞게 글자 축소(site-shell fitOneLine), 카테고리 시트 타일 이름 320에서 두 줄 → 360 미만은 아이콘을 위로. 신뢰성 정보 카드 검토 안내: 의미 그룹(정보 제공 목적 / 기관 또는 전문가에게 확인)별 첫 문장만 |
| 완료 | 한 줄 검사(10/22, build_all 9단계) | `oneline_check.py`: 칩·탭·버튼·배지·결과 바·메뉴 항목·큰 숫자의 글자 높이 > 한 줄 x 1.5면 실패, 전 페이지 x 320·390·1280 + 홈 최근 0·3개 + 열린 메뉴. 수정 전 44건(23종) → 0 |
| **사용자** | **배포 전 build_all은 SKIP_CLICK 없이 실행** | `bash design/tools/build_all.sh` 그대로(약 15분). 8 정적 검사·9 클릭 검사가 모두 0이어야 배포. `SKIP_CLICK=1`은 작업 중 빠른 재생성용일 뿐 배포 전에는 쓰지 않는다 |
| 완료 | 1. main 커밋(10/26) | `e36a541` deploy-filter: vendor 라이선스 파일 포함(`+ /assets/vendor/**/LICENSE*`를 2)항 위에, 로컬 rsync -n 시험 1,237 → 1,240 = LICENSE 3개만 늘고 그 외 변화 0). main 미커밋 0 |
| 완료 | 2. 작업본 커밋(10/26) | `cd1ed2d` jptcalc v2 리뉴얼(redesign): 1,622파일(새 1,279 + 수정 343) 약 62.5MB, 커밋 직전 build_all 바뀐 파일 0. 검수 캡처 0·vendor 15 포함, `__pycache__`는 a74cc04부터 추적하던 루트 1개만. 이 체크리스트 수정은 뒤따르는 커밋 |
| 완료 | 3. merge(10/26) | `1ab44d8` Merge branch 'redesign'(부모 `e36a541`·`4f0158c`). 충돌 6개는 redesign 쪽, `git diff --stat redesign HEAD` = `.deploy-filter`·`deploy-policy.md`·`adsense-check` 3개. push 안 함 |
| 완료 | 4. 배포(2026-10-26 15:51:08 KST) | `.deploy-filter` 사용, 삭제 동기화 + `--delete-excluded` + 빈 폴더 정리. 미리보기 대비: deleting 7,636줄 동일(서버 전용 내부 파일 7,354 = .git 7,314·.claude 21·scripts 8·.md 9·serve.py·__pycache__, 공개 파일 삭제 0), 보낸 파일 1,187(배포 대상 1,240 중 53개는 서버와 해시·시각 같아 건너뜀). 배포 전 비밀값 검사(커밋 287개·blob 5,829, 정규식 + 대조군) 발견 0 |
| 완료 | 5. nginx(배포 전 10/26 15:47) | 백업 `sites-available/jptcalc.kr.bak-20261026`. 추가: `error_page 404 /404.html`, gzip_types(css·js·json·svg·text·xml), `/.well-known/` 허용, 점 경로·`*.md|py|pyc|sh|mjs|json.bak`·`/design/` 404, 캐시 = `?v=` 있는 css·js 1년 immutable / 없으면 1시간 / `/assets/vendor/` 1년 / html no-cache / 이미지 7일(map `$arg_v`·`$sent_http_content_type`). `nginx -t` 통과 후 reload |
| 완료 | 6. 배포 직후 확인(10/26) | 200: `/`·dsr·take-home-pay·`/blog/`·holding-tax-guide·`/recent/`·`/404.html`·`/about.html`·situations.json·cat-menu.json·flatpickr.min.js·pretendard.css·woff2·dti·pyeong·ads.txt·robots.txt·sitemap.xml·소유확인 html·vendor LICENSE 3개. 404: `/calc/nope/`(본문 = 새 404.html 해시 동일)·`/.git/HEAD`·`/.deploy-filter`·`/design/brief.md`·`/CLAUDE.md`·`/serve.py`·`/data-points.md`. 헤더: base.css gzip + `max-age=31536000, immutable`, index.html `no-cache`, woff2 1년. 서버 웹 루트 내부 파일 0(.md는 vendor LICENSE.md만), 파일 1,240개(35MB, 디스크 여유 1.9G). 운영 렌더링 5쪽 × 390·1280: JS 오류 0·4xx 0·넘침 0, 글꼴 자체 서버, 광고 외 외부 요청은 dti뿐(CDN 유지) |
| 사용자 | 7. 11/9 이후 dti·pyeong 복원 | `cp design/hold/realestate/dti/index.html calc/realestate/dti/` (pyeong 같게) → `node scripts/inject-sibling.mjs`(하단 목록을 새 모양으로) → 간격 검사 `spacing_audit.py`에서 두 페이지 예외 해제 → 커밋·배포 |
| 사용자 | 페이지·CSS/JS 수정 후 | 생성기가 있는 페이지는 원본·설정을 고친 뒤 `bash design/tools/build_all.sh`(바뀐 파일 수 확인, 다시 돌려 0이면 정상). 부동산 17·허브는 파일을 직접 고친 뒤 build_all(?v=·하단 목록 갱신) |
| 사용자 | CSS/JS 수정 후 | 공용 CSS·JS(assets/ds/*, *-common.css, cookie-consent.js, calc-registry.js 등)를 고치면 생성기(build_home·build_blog·build_pages·build_hub·inject-sibling)를 다시 돌리거나 `python3 -I design/tools/asset_version.py` → 주소의 `?v=`(파일 내용 해시 8자리)가 갱신돼 방문자 캐시가 새 파일을 받는다. 안 바뀐 파일은 값도 그대로 |
| 사용자 | 8. 새 글 발행 때 | 원고 + `design/blog-cover-text.csv` 행 → `build_blog_covers.py <slug>` → `build_blog.py` → `inject-sibling.mjs` (표지 3장이 다 있어야 글에 연결됨) |

### 알려진 예외
- 카드 3개 이상 연속 1곳: `inheritance-tax-guide` 본문의 강조 상자 → 목록 상자 → 강조 상자(종류가 서로 달라 한 장으로 묶지 않음, 390·1280 모두). 검사 `design/tools/card_runs.py`.
- 콜레스테롤 글(`cholesterol-levels-guide`) SVG의 진한 막대 위 흰 글자 8건(11px, 굵기 700)은 대비 4.5 미달로 둔다(2026-10-19 사용자 결정): --ok 막대 4건 3.3:1, --bad 막대 4건 3.91:1(원본 색에서는 2.5·3.8). 토큰 글자색으로는 해결 불가, 막대를 -text 색으로 바꾸면 "높음"·"매우높음" 색 구분이 사라져 보류. 측정은 `design/tools/svg_contrast.py`.


## ★ 요약: 커밋 → 배포 → nginx → 확인 (2026-10-19, 위 순서대로. 실행은 사용자)
1. **동기화 확인**(작업본에서): `git -C ~/jptcalc log --oneline a74cc04..HEAD` 와 `git -C ~/jptcalc status --short` 로 main 새 변경이 없는지 본다. 있으면 아래 "1단계 동기화"부터.
2. **최종 검사**(작업본, 8765 서버 켠 상태):
   ```bash
   cd ~/jptcalc_redesign
   node scripts/check-post-chrome.mjs && node scripts/check-noindex-excluded.mjs && node scripts/check-rate-tables.mjs
   python3 -I design/tools/link_check.py index.html recent/index.html 404.html blog/index.html blog/posts/*.html $(find calc -name index.html)
   python3 -I design/tools/head_check.py --blog-src index.html 404.html blog/index.html blog/posts/*.html $(find calc -name index.html)
   ```
3. **dti·pyeong 원본으로**(아래 "2단계"): `mkdir -p design/hold/realestate/{dti,pyeong}` → 두 리뉴얼 판 복사 → `git show main:calc/realestate/dti/index.html > calc/realestate/dti/index.html` (pyeong 같게).
4. **커밋**(작업본 redesign 브랜치): `git add -A && git commit -m "jptcalc v2 리뉴얼"` → main에 합치기: 위 표 "3. merge" 행대로(충돌 6개는 redesign 쪽, main 쪽 미커밋 변경이 없어야 함).
5. **배포**: main의 `.deploy-filter`(허용 목록)를 merge 필터로 지정하고 `--delete-excluded`를 함께 쓴다(명령 전체는 deploy-policy상 여기 적지 않음). **⚠️ 2026-10-21 정정: 이전 판의 "`.git`·`.claude` 제외는 평소대로"는 틀린 전제였다. 실제 운영에서 `.git` 전체·`.claude`·내부 `.md`가 공개 주소로 열려 있었다(book/ops/EXPOSURE_FIX_PLAN_V2_20261021.md). 평소 명령에는 제외 목록이 없었다.**
6. **배포 직후 확인**: 운영에서 `/` · `/calc/realestate/dsr/` · `/blog/` · `/recent/` · `/404.html` 이 200, `/design/brief.md` 가 404, 새 파비콘(브라우저 캐시 비우고)·GA4 실시간 이벤트(calc_start 등) 도착.
7. **nginx**(서버, 사용자): server 블록에 `error_page 404 /404.html;` 추가 → 설정 검사 후 다시 읽기 → `/calc/nope/` 가 상태 404 + 새 404 화면인지 확인.
8. **11/9 이후**: `design/hold/`의 dti·pyeong 리뉴얼 판을 제자리로 되돌려 커밋·배포.


리뉴얼 작업본(`~/jptcalc_redesign`, redesign 브랜치)을 운영에 올리기 전에 아래를 **모두** 통과해야 한다. 배포(rsync)는 사용자가 직접 한다.

## 배포 전 조건 (2026-10-16 결정)

- [ ] **내부 깨진 링크 0**: 리뉴얼 페이지의 모든 내부 링크(헤더·탭바·메뉴·푸터·이어서 계산·본문)가 200으로 열린다.
  - `/#situations`, `/#categories`, `/recent/`는 2026-10-19 홈·최근 화면으로 해결. 검사는 `python3 -I design/tools/link_check.py index.html recent/index.html $(find calc -name index.html)`(작업본 8765 서버, 10/19 기준 깨진 것 0).
- [ ] **dti·pyeong 제외**: `calc/realestate/dti/`, `calc/realestate/pyeong/`은 11/9 관측 대상이라 그 전 배포 묶음에서 뺀다(rsync exclude 확인). 두 페이지 모두 작업본에서는 리뉴얼 완료(pyeong 파일 첫 줄에 배포 제외 주석).
- [ ] **design/ 폴더 전체 배포 제외**: 시안·도구(`design/tools/`)·기준값 기록·미리보기 서버는 작업용이라 rsync에서 뺀다(2026-10-19 결정).
- [ ] **실제 폰 키보드 확인**: 하단 결과 바(B2)가 키보드 위로 올라오고 "완료"로 키보드가 닫히는지 실제 기기(Android Chrome, iOS Safari)에서 확인. 개발 중 확인은 visualViewport 높이를 줄인 시뮬레이션뿐이었다.

## 함께 배포되는 공용 파일 (운영 전 페이지에 영향)

- `assets/cookie-consent.js`: 쿠키 문구를 B5로 변경(2026-10-16). `footer-unified.js`를 쓰는 기존 페이지 전체에도 바로 적용된다. 기존 페이지 화면에서 문구·레이아웃 확인.
- `scripts/inject-sibling.mjs`(2026-10-19 수정): 경로를 고정값 `/home/tjd618/jptcalc`에서 스크립트가 든 저장소 기준으로 변경(작업본에서 돌려도 원본을 건드리지 않음), 링크 앞 이모지 제거, 리뉴얼 페이지의 `class="sibling-section ds-section"`을 인식해 교체(예전 정규식은 못 찾고 `</main>` 앞에 한 벌을 더 넣었음). 리뉴얼 배포 전까지 main의 블로그 루틴은 옛 스크립트를 쓴다는 점 확인.
- 계산기 머리 칩 줄 끝 흐림 마스크(linear-gradient) 제거로 칩이 잘린 채 끝남(그라데이션 0건 요구). 시각 확인 후 유지/대안 결정.
- `/recent/`는 noindex(메타)이며 sitemap.xml에 넣지 않는다. 광고 스크립트 없음(내용 없는 화면).
- 홈 `/index.html`은 `design/tools/build_home.py`가 만든다(상황·시즌 변경은 design/situations.json 수정 후 재실행). 홈 GA4 이벤트: situation_open, situation_step_click, season_card_click, home_search, recent_click(기존 gtag 사용).
- base.css `[style*="--cat"]` 틴트 재계산(10/19): 계산기 제목 옆 아이콘 타일이 주황 고정 → 카테고리 색 틴트로 바뀜(design/step-G/cat-tint-before-after-390.png).
- 블로그(2026-10-19): `blog/posts/*.html` 183편·`blog/index.html`은 `design/tools/build_blog.py`가 원고(`design/blog-source/`)에서 만든다. 작성자·검토 안내는 정적 HTML(옛 blog-article-info.js·blog-review-footer.js는 글에서 뺐고, 계산기 페이지가 아직 쓰므로 파일은 유지). 썸네일 `assets/img/blog-thumb/`(24장) 함께 배포. `scripts/check-post-chrome.mjs`는 새 틀 기준.

## 404 연결 (순서대로)
1. 리뉴얼 `404.html`을 배포한다(모든 주소가 루트 기준이라 어느 경로에서 보여도 됨).
2. 배포 확인 후 서버 nginx server 블록에 `error_page 404 /404.html;`를 추가하고 nginx 설정을 다시 읽힌다(사용자 작업).
3. 없는 주소(예: `/calc/nope/`)가 상태 404 + 새 404 화면으로 나오는지 확인. 2026-10-19 확인 시 운영은 nginx 기본 "404 Not Found" 페이지였다.

## 합치기·배포 절차 (2026-10-19 정리, 위에서부터 순서대로)

### 1단계: 리뉴얼 이후 main에 생긴 변경을 작업본으로 동기화 (합치기 직전)
10/19 기준 main(`~/jptcalc`)은 리뉴얼 기준 커밋 `a74cc04` 이후 커밋 `db84426`(10/16) + 커밋 안 된 변경이 있다. 합치기 직전에 다시 뽑는다:
`git -C ~/jptcalc diff --name-only a74cc04 HEAD; git -C ~/jptcalc status --short`
- **블로그 글**: main `blog/posts/`에만 있거나 내용이 다른 글을 원고 `design/blog-source/posts/`로 복사(10/19: 새 글 `suneung-dday-guide.html`, 수정 `bmr-calories`·`income-tax-deduction`·`isa-guide`). 새 글 카드는 main `blog/index.html`의 해당 카드를 원고 목록 `design/blog-source/index.html` post-grid 맨 앞에 넣는다(공개 blog/index.html을 그대로 가져오지 않는다).
  → `node design/tools/blog_static_info.mjs design/tools/results/blog_info.json design/blog-source/posts/*.html && python3 -I design/tools/build_blog.py` 재실행 → `node scripts/check-post-chrome.mjs`.
- **옛 카테고리 CSS 12개**(`assets/{ai,auto,baby,date,finance,health,pension-welfare,pet,realestate,salary,tax,tools}-common.css`): main 판으로 교체. db84426이 입력칸에 `min-width: 0`을 더했고, 작업본 판으로 배포하면 옛 화면(dti·pyeong 등)의 단위 "만원"이 잘린다(design/step-I 확인).
- `assets/date-detail-shell.js`, `rss.xml`, `sitemap.xml`, `data-points.md`, `blog/verified-posts.md`, `.claude/skill-log.md`: main 판으로.
- `calc/date/weekday/index.html`: main 변경은 크롤러용 관련 가이드에 새 글 1줄 추가뿐이라 파일을 가져오지 말고, 작업본에서 `node scripts/inject-sibling.mjs`를 다시 돌린다(리뉴얼 페이지도 교체 가능).
- `.claude/commands/blog.md`·`verify.md`: 양쪽이 모두 바뀌었으니 손으로 합친다(작업본 쪽 원고→생성 체제 문단 유지).

### 2단계: dti·pyeong을 원본으로 두기 (11/9 관측 끝날 때까지)
1. 리뉴얼 판 보관: `mkdir -p design/hold/realestate/dti design/hold/realestate/pyeong` 후 `calc/realestate/dti/index.html`, `calc/realestate/pyeong/index.html`을 같은 이름으로 복사.
2. 원본 판 가져오기: `git show main:calc/realestate/dti/index.html > calc/realestate/dti/index.html` (pyeong도 같게). main 판은 a74cc04와 같다(10/19 확인).
3. 원본 판이 쓰는 옛 자산은 지우지 않는다: `assets/realestate-common.css`(1단계의 main 판), `realestate-detail-shell.js`, `footer-unified.js`, `calc-validate.js`, `calc-result-tools.js`, `trust-block.js`, `blog-article-info.js`, `blog-review-footer.js`, `affiliate-banner.css`, `calc-registry.js`, `cookie-consent.js`(B5 문구가 이 두 페이지에도 나온다).
4. 확인: 두 페이지 JS 오류 0, 대표 입력 2세트가 운영과 같음(10/19: dti 34.0% 2세트, pyeong 25평→82.64㎡·84.97㎡→25.70평 일치).
5. 11/9 이후: `design/hold/`의 리뉴얼 판을 제자리로 되돌리고 hold 폴더 삭제.

### 3단계: 배포에서 뺄 것 (rsync)
- 개별 `--exclude` 나열 대신 main의 `.deploy-filter`를 쓴다(design/, __pycache__/, scripts/, 점 파일, *.md 등 포함). 이 작업본에는 아직 그 파일이 없으니 합치기 뒤 main 판을 쓴다. 필터를 로컬 임시 폴더에 먼저 적용해 내부 파일 0개·참조 누락 0을 확인한다(2026-10-21 로컬 시험: 이 작업본 1,042파일, 내부 파일 0, 참조 누락 0).
- 배포 후 `/design/brief.md`가 404인지 확인.

### 4단계: 파비콘 교체 (아직 만들지 않음, 10/19 기준 main과 같은 옛 파일)
교체 대상(루트 기준): `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `assets/logo.svg`(옛 페이지 head 아이콘·헤더), `site.webmanifest`(아이콘 경로·색 확인). 원본 그림: `design/brand/logo-appicon.svg`, `logo-symbol.svg`.
- 주의: 모든 페이지의 `og:image`·JSON-LD 로고가 `android-chrome-512x512.png`·`assets/logo_161.png`를 가리킨다. 파일을 바꾸면 head 글자는 그대로여도 공유 이미지가 바뀐다(교체 여부는 사용자 결정).
- 교체 후 브라우저 캐시 때문에 즉시 안 보일 수 있다(파일명 유지 시).

- GA4 이벤트(10/19, `assets/ds/site-shell.js` 한곳): calc_start·calc_complete·result_copy·next_calc_click(계산기), hub_calc_click(허브), blog_calc_click(블로그). 홈은 situation_open·situation_step_click·season_card_click·home_search·recent_click. 배포 후 GA4 실시간에서 도착 확인, 맞춤 측정기준(calc·to·slot·cat·post 등) 등록은 사용자 작업.

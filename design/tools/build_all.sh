#!/bin/bash
# 전체 생성(2026-10-20 고정 순서): convert_calc(85) → build_hub(11) → build_home → build_blog → build_pages → inject-sibling → asset_version (10/21: build_pages가 404 바닥글을 복사하므로 build_blog 뒤로)
# 끝에 검사 3개: 8 on* 속성 구문 검사(onattr_check.py) → 9 한 줄 검사(oneline_check.py, 10/22, 약 4분) → 10 클릭 검사(click_audit.py, 실제 크롬, 약 15분). 하나라도 실패하면 종료코드 1
#   클릭 검사만 빼려면 SKIP_CLICK=1 bash design/tools/build_all.sh (작업 중 빠른 재생성용. 배포 전 build_all은 반드시 SKIP_CLICK 없이)
# 작업본 루트에서: bash design/tools/build_all.sh      (끝에 바뀐 파일 수를 알려 준다. 두 번째 실행은 0이어야 정상)
# 생성기 없는 페이지(직접 고치는 대상): 부동산 계산기 17개와 부동산 허브(calc/realestate/), dti·pyeong(11/9까지 main 판).
#   이 페이지들은 아래 단계 중 inject-sibling(하단 목록)과 asset_version(?v=)만 손댄다(dti·pyeong은 ?v=만).
# 표지 그림(build_blog_covers.py)은 그림 생성이라 여기 넣지 않는다(새 글이 생기면 따로 먼저 돌린다).
set -euo pipefail
cd "$(dirname "$0")/../.."
SNAP=$(mktemp)
snap() { find . -path ./design -prune -o -path ./.git -prune -o -path ./node_modules -prune -o -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \) -print0 | sort -z | xargs -0 md5sum; }
snap > "$SNAP"

echo '1/10 convert_calc (계산기 85: 원본 백업 design/tools/orig/CAT/SLUG.html이 있는 것)'
for d in design/tools/orig/*/; do
  c=$(basename "$d"); [ "$c" = pages ] && continue
  slugs=$(ls "$d" | grep -v '^_' | grep '\.html$' | sed 's/\.html$//' | tr '\n' ' ')
  [ -n "$slugs" ] && python3 -I design/tools/convert_calc.py "$c" $slugs > /dev/null
done
echo '2/10 build_hub (허브 11: 원본 design/tools/orig/CAT/_hub.html이 있는 것)'
for f in design/tools/orig/*/_hub.html; do python3 -I design/tools/build_hub.py "$(basename "$(dirname "$f")")" > /dev/null; done
echo '3/10 build_home (홈·최근·메뉴 데이터)'
python3 -I design/tools/build_home.py > /dev/null
echo '4/10 build_blog (글 184·목록·404)'
node design/tools/blog_static_info.mjs design/tools/results/blog_info.json design/blog-source/posts/*.html > /dev/null
python3 -I design/tools/build_blog.py > /dev/null
echo '5/10 build_pages (정보 페이지 5, 바닥글을 404에서 복사하므로 build_blog 뒤)'
python3 -I design/tools/build_pages.py > /dev/null
echo '6/10 inject-sibling (계산기 하단 다른 계산기·관련 가이드)'
node scripts/inject-sibling.mjs | tail -1
echo '7/10 asset_version (공용 CSS·JS ?v=)'
python3 -I design/tools/asset_version.py

CH=$(snap | diff "$SNAP" - | grep -c '^>' || true)
echo "바뀐 파일: $CH"
snap | diff "$SNAP" - | grep '^>' | awk '{print "  " $3}' | head -60 || true
rm -f "$SNAP"

echo '8/10 on* 속성 구문 검사 (전 페이지 onclick·oninput 등을 JS 파서로)'
python3 -I design/tools/onattr_check.py | tail -3
echo '9/10 한 줄 검사 (칩·탭·버튼·배지·결과 바·메뉴·큰 숫자, 320·390·1280, 홈 최근 0·3개)'
LD_LIBRARY_PATH="${LD_LIBRARY_PATH:+$LD_LIBRARY_PATH:}$HOME/.local/emulib" python3 design/tools/oneline_check.py | sed -n '1,45p'
if [ "${SKIP_CLICK:-}" = 1 ]; then echo '10/10 클릭 검사: SKIP_CLICK=1로 건너뜀'; exit 0; fi
echo '10/10 클릭 검사 (계산기 102 + 홈·허브·블로그·정보 페이지, 실제 크롬)'
LD_LIBRARY_PATH="${LD_LIBRARY_PATH:+$LD_LIBRARY_PATH:}$HOME/.local/emulib" python3 design/tools/click_audit.py | sed -n '/^소요/,$p'

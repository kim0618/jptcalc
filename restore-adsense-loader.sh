#!/bin/bash
# AdSense 광고 로더 복구 스크립트
# 사용 시점: jptcalc.kr 애드센스 3차 신청 통과 후 즉시 실행
# 작성일: 2026-05-19 (3차 신청 D-2)
# 제거 시점: 2026-05-19 (3차 신청 D-2, 166페이지)

set -e

cd "$(dirname "$0")"

LOADER='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6112766558731601" crossorigin="anonymous"></script>'
GTM_MARK='<script async src="https://www.googletagmanager.com/gtag/js?id=G-BRSX3F10MZ"></script>'

if [ ! -f .adsense-loader-files.txt ]; then
  echo "ERROR: .adsense-loader-files.txt 파일이 없음. 복구 대상 리스트 누락."
  exit 1
fi

TOTAL=$(wc -l < .adsense-loader-files.txt)
echo "복구 대상: $TOTAL개 파일"
echo ""

restored=0
skipped=0
missing_gtm=0

while IFS= read -r f; do
  if [ ! -f "$f" ]; then
    echo "SKIP (파일 없음): $f"
    skipped=$((skipped+1))
    continue
  fi

  if grep -q "pagead2.googlesyndication" "$f"; then
    echo "SKIP (이미 박힘): $f"
    skipped=$((skipped+1))
    continue
  fi

  if ! grep -q "googletagmanager.com/gtag/js?id=G-BRSX3F10MZ" "$f"; then
    echo "WARN (GTM 없음, </head> 앞에 삽입): $f"
    sed -i "s|</head>|$LOADER\n</head>|" "$f"
    missing_gtm=$((missing_gtm+1))
    restored=$((restored+1))
    continue
  fi

  # GTM 라인 바로 위에 광고 로더 삽입
  sed -i "/$(echo "$GTM_MARK" | sed 's/[][\/.*^$]/\\&/g')/i\\$LOADER" "$f"
  restored=$((restored+1))
done < .adsense-loader-files.txt

echo ""
echo "=== 복구 결과 ==="
echo "성공: $restored / $TOTAL"
echo "스킵: $skipped (이미 박힘 또는 파일 없음)"
echo "GTM 누락 → </head> 앞 삽입: $missing_gtm"
echo ""
echo "=== 잔존 검증 ==="
final=$(grep -rl "pagead2.googlesyndication" blog/posts calc *.html 2>/dev/null | wc -l)
echo "광고 로더 박힘: $final 페이지 (목표: $TOTAL)"
echo ""
echo "다음 단계: rsync -avz --delete /home/tjd618/jptcalc/ root@223.130.151.202:/root/jptcalc/"

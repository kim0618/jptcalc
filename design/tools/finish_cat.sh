#!/bin/bash
# 카테고리 마무리 측정: 첫 조작칸·가로 넘침·JS 오류, 원본 대비 본문, 허브 생성·확인. 사용: bash design/tools/finish_cat.sh CAT SLUG...
C=$1; shift; SL="$*"; export LD_LIBRARY_PATH=$HOME/.local/emulib
timeout 900 python3 design/tools/shot_cat.py /tmp/claude-1000/jpt_shots/$C $C $SL 2>&1 | python3 -c "
import sys,json
for l in sys.stdin:
    s,j=l.split(' ',1); r=json.loads(j); print(s, '첫조작', r['first_control'], '그룹제목먼저' if r['group_label_first'] else '', r['w390'][0], r['w1440'][0], '오류', len(r['errors']))"
for f in $SL; do git show a74cc04:calc/$C/$f/index.html > /tmp/claude-1000/m_$f.html; echo "$f $(python3 -I design/tools/textcmp.py /tmp/claude-1000/m_$f.html calc/$C/$f/index.html)"; done
python3 -I design/tools/build_hub.py $C && git show a74cc04:calc/$C/index.html > /tmp/claude-1000/m_hub.html && echo "허브 $(python3 -I design/tools/textcmp.py /tmp/claude-1000/m_hub.html calc/$C/index.html) | 사이드바 제외 $(python3 -I design/tools/textcmp.py /tmp/claude-1000/m_hub.html calc/$C/index.html --noaside)" && python3 design/tools/check_hub.py /tmp/claude-1000/jpt_shots/$C $C

#!/usr/bin/env node
// 블로그 글 "실제 본문" 순수 텍스트 글자수 측정기
// 사용: node scripts/count-chars.mjs blog/posts/파일.html [파일2.html ...]
//       node scripts/count-chars.mjs            (인자 없으면 전체 글 분포)
//
// ⚠️ 왜 이 스크립트가 필요한가 (2026-07-10 신설)
// 기존 측정법 `sed 's/<[^>]*>//g' | wc -c` 은 두 가지가 틀렸다:
//   1) <style>/<script> 태그의 "내용물"(CSS 규칙·JS 코드)은 태그가 아니라 텍스트로 남아
//      글자수에 그대로 포함된다 → 실제 본문의 2~4배로 부풀려짐.
//   2) wc -c 는 바이트를 세는데 한글은 UTF-8에서 글자당 3바이트다 → "자"와 불일치.
// 이 스크립트는 head·script·style·header·footer 크롬을 제거한 실제 본문만 글자수로 센다.

import fs from 'fs';
import path from 'path';

function bodyChars(html) {
  let h = html;
  h = h.replace(/<head[\s\S]*?<\/head>/gi, '');
  h = h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  h = h.replace(/<header[\s\S]*?<\/header>/gi, '');
  h = h.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  const text = h.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length;
}

// 기준 (실제 본문 순수 텍스트 글자수, 2026-07-10 실측 분포 기반: 139편 중앙값 6,174자)
const TARGET = 6000; // 권장 하한
const THIN = 4000;   // 이 미만은 thin content로 간주, 보강 필요

const args = process.argv.slice(2);

if (args.length === 0) {
  // 전체 분포 모드
  const dir = 'blog/posts';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
  const rows = files.map(f => [f, bodyChars(fs.readFileSync(path.join(dir, f), 'utf8'))]);
  rows.sort((a, b) => a[1] - b[1]);
  const cs = rows.map(r => r[1]);
  const median = cs[Math.floor(cs.length / 2)];
  const mean = Math.round(cs.reduce((a, b) => a + b, 0) / cs.length);
  console.log(`총 ${rows.length}편 | 최소 ${cs[0].toLocaleString()} / 중앙값 ${median.toLocaleString()} / 평균 ${mean.toLocaleString()} / 최대 ${cs[cs.length-1].toLocaleString()}`);
  console.log(`${TARGET.toLocaleString()}자+ : ${cs.filter(c => c >= TARGET).length}편 | ${THIN.toLocaleString()}자 미만(thin): ${cs.filter(c => c < THIN).length}편`);
  const thin = rows.filter(r => r[1] < THIN);
  if (thin.length) {
    console.log(`\n[thin content 후보 - ${THIN.toLocaleString()}자 미만]`);
    thin.forEach(([f, c]) => console.log(`  ${String(c).padStart(6)}자  ${f}`));
  }
} else {
  // 개별 파일 모드
  let anyThin = false;
  for (const f of args) {
    const c = bodyChars(fs.readFileSync(f, 'utf8'));
    let mark = '✓';
    if (c < THIN) { mark = '✗ thin'; anyThin = true; }
    else if (c < TARGET) { mark = '△ 권장 하한 미달'; }
    console.log(`${mark}  ${c.toLocaleString()}자  ${path.basename(f)}`);
  }
  process.exit(anyThin ? 1 : 0);
}

#!/usr/bin/env node
// 블로그 글 공통 크롬(헤더·footer·필수 스크립트) 누락 검사기
// 사용: node scripts/check-post-chrome.mjs
// 신규 글 작성 후 /blog 스킬 자체 검증 단계에서 실행. 누락 시 exit 1.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'blog', 'posts');

// 모든 글이 반드시 가져야 하는 공통 크롬 (라벨: 검사 정규식)
// footer는 footer-unified.js가 JS로 전 글에 주입하므로 여기 넣지 않음
// (하드코딩 <footer>는 일부 글에만 있는 선택적 no-JS fallback이라 표준 아님)
const REQUIRED = [
  ['헤더(site-logo)',        /<header class="site-header">/],
  ['헤더 로고링크',          /class="site-logo"/],
  ['헤더 블로그목록 링크',   /class="header-back"/],
  ['footer-unified.js',      /assets\/footer-unified\.js/],
  ['blog-article-info.js',   /assets\/blog-article-info\.js/],
  ['blog-review-footer.js',  /assets\/blog-review-footer\.js/],
];

// 로고 공백 오타 (제이퍼 <span>계산기) 도 함께 검출
const LOGO_SPACE_BUG = /제이퍼\s+<span>계산기/;

const files = readdirSync(postsDir).filter((f) => f.endsWith('.html'));
let bad = 0;

for (const f of files) {
  const html = readFileSync(join(postsDir, f), 'utf-8');
  const missing = REQUIRED.filter(([, re]) => !re.test(html)).map(([label]) => label);
  const logoBug = LOGO_SPACE_BUG.test(html);
  if (missing.length || logoBug) {
    bad++;
    console.log(`\n✗ ${f}`);
    for (const m of missing) console.log(`    누락: ${m}`);
    if (logoBug) console.log(`    로고 공백 오타: 제이퍼 <span>계산기 → 제이퍼<span>계산기`);
  }
}

if (bad === 0) {
  console.log(`✓ ${files.length}개 글 전부 공통 크롬 정상`);
  process.exit(0);
} else {
  console.log(`\n${bad}개 글에 문제 발견. 위 항목을 정상 글(예: dog-monthly-cost.html) 기준으로 보강하세요.`);
  process.exit(1);
}

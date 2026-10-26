#!/usr/bin/env node
// 블로그 글 공통 크롬(헤더·footer·필수 스크립트) 누락 검사기
// 사용: node scripts/check-post-chrome.mjs
// 신규 글 작성 후 /blog 스킬 자체 검증 단계에서 실행. 누락 시 exit 1.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'blog', 'posts');

// 모든 글이 반드시 가져야 하는 공통 크롬 (라벨: 검사 정규식). 2026-10-19 리뉴얼 틀 기준
// (헤더·푸터·탭바는 site-shell.js, 작성자·검토 안내는 build_blog.py가 정적 HTML로 넣는다)
const REQUIRED = [
  ['헤더 자리(ds-site-header)',   /<header id="ds-site-header"/],
  ['푸터(ds-site-footer)',        /<footer id="ds-site-footer"/],
  ['site-shell.js',               /assets\/ds\/site-shell\.js/],
  ['base.css',                    /assets\/ds\/base\.css/],
  ['본문(ds-post-body)',          /class="ds-post-body/],
  ['작성자 안내(정적 .article-info)', /<aside class="article-info"/],
  ['ARTICLE_INFO_CONFIG',         /window\.ARTICLE_INFO_CONFIG\s*=/],
];
// 리뉴얼에서 뺀 옛 스크립트가 다시 들어오면 실패(두 번 그려짐)
const FORBIDDEN = [
  ['옛 footer-unified.js',  /assets\/footer-unified\.js/],
  ['옛 blog-article-info.js', /assets\/blog-article-info\.js/],
  ['옛 blog-review-footer.js', /assets\/blog-review-footer\.js/],
  ['옛 헤더(site-header)',  /<header class="site-header">/],
];

// 로고 공백 오타 (제이퍼 <span>계산기) 도 함께 검출
const LOGO_SPACE_BUG = /제이퍼\s+<span>계산기/;

const files = readdirSync(postsDir).filter((f) => f.endsWith('.html'));
let bad = 0;

for (const f of files) {
  const html = readFileSync(join(postsDir, f), 'utf-8');
  const missing = REQUIRED.filter(([, re]) => !re.test(html)).map(([label]) => label)
    .concat(FORBIDDEN.filter(([, re]) => re.test(html)).map(([label]) => label + ' 있음'));
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
  console.log(`\n${bad}개 글에 문제 발견. 원고(design/blog-source/posts/)를 고친 뒤 python3 -I design/tools/build_blog.py 로 다시 만드세요.`);
  process.exit(1);
}

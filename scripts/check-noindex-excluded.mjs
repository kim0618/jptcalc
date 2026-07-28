#!/usr/bin/env node
/**
 * noindex 글이 sitemap.xml · blog/index.html · rss.xml 에 다시 섞여 들어갔는지 검사한다.
 *
 * 배경: 2026-06-29 애드센스 준비로 약한 꼬리 15편에 robots noindex 를 걸고
 * 세 파일에서 뺐는데, 이후 /blog 작업이 sitemap 과 blog/index 를 통째로 다시
 * 만들면서 15편이 전부 되살아났다(커밋 f7bb01d 7/10, 9643af7 7/15).
 * noindex 는 검색엔진만 막을 뿐 애드센스 심사자의 동선은 못 막으므로,
 * 목록 카드가 살아있으면 프루닝 자체가 무효가 된다.
 *
 * 대상 목록은 하드코딩하지 않고 blog/posts/*.html 의 robots 메타에서 직접 읽는다.
 * 글에 noindex 를 새로 걸거나 풀면 이 스크립트는 자동으로 따라온다.
 *
 * 사용: node scripts/check-noindex-excluded.mjs
 * 종료코드: 0 = 정상, 1 = 되살아난 참조 있음
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');

function noindexSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => {
      const head = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8').slice(0, 8000);
      const m = head.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
      return m ? /noindex/i.test(m[1]) : false;
    })
    .map((f) => f.replace(/\.html$/, ''));
}

const slugs = noindexSlugs();
if (slugs.length === 0) {
  console.log('noindex 글이 없습니다. 검사할 대상 없음.');
  process.exit(0);
}

const checks = [
  { label: 'sitemap.xml', file: 'sitemap.xml', needle: (s) => `/blog/posts/${s}.html` },
  { label: 'blog/index.html', file: 'blog/index.html', needle: (s) => `./posts/${s}.html" class="post-card` },
  { label: 'rss.xml', file: 'rss.xml', needle: (s) => `/blog/posts/${s}.html` },
];

let bad = 0;
console.log(`noindex 글 ${slugs.length}편 기준으로 검사합니다.\n`);

for (const { label, file, needle } of checks) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.log(`  - ${label}: 파일 없음, 건너뜀`);
    continue;
  }
  const body = fs.readFileSync(full, 'utf8');
  const hits = slugs.filter((s) => body.includes(needle(s)));
  if (hits.length === 0) {
    console.log(`  ✓ ${label}: 깨끗함`);
  } else {
    bad += hits.length;
    console.log(`  ✗ ${label}: ${hits.length}편이 되살아났습니다`);
    hits.forEach((s) => console.log(`      ${s}`));
  }
}

console.log('');
if (bad > 0) {
  console.log(`총 ${bad}건. noindex 글은 세 파일 어디에도 남으면 안 됩니다.`);
  console.log('해당 항목을 지운 뒤 다시 실행하세요.');
  process.exit(1);
}
console.log('통과. noindex 글이 sitemap · index · rss 어디에도 없습니다.');

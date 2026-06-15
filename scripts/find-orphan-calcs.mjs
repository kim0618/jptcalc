#!/usr/bin/env node
// 블로그 글이 하나도 연결되지 않은 "고아 계산기" 탐지기
// 사용: node scripts/find-orphan-calcs.mjs
// calc-registry.js의 전 계산기 중, 어떤 blog/posts/*.html도 /calc/{cat}/{slug}/ 를
// 가리키지 않는 것을 카테고리별로 보고. /blog 스킬의 신규 계산기 우선 선정(③)에 사용.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// calc-registry.js 파싱 (window.CALC_REGISTRY = {...})
const regSrc = readFileSync(join(root, 'assets', 'calc-registry.js'), 'utf-8');
const sandbox = { window: {} };
new Function('window', regSrc)(sandbox.window);
const REG = sandbox.window.CALC_REGISTRY;

// 전 블로그 글 본문을 한 덩어리로 (relatedCalc url + 본문 링크 모두 포함)
const postsDir = join(root, 'blog', 'posts');
const posts = readdirSync(postsDir).filter((f) => f.endsWith('.html'));
const allHtml = posts.map((f) => readFileSync(join(postsDir, f), 'utf-8')).join('\n');

const orphans = [];
let total = 0;
for (const [cat, data] of Object.entries(REG)) {
  for (const c of data.calcs || []) {
    total++;
    const url = `/calc/${cat}/${c.slug}/`;
    // 블로그 어디서든 이 계산기 URL을 가리키면 연결된 것으로 간주
    if (!allHtml.includes(url)) {
      orphans.push({ cat, catName: data.name, slug: c.slug, name: c.name, url });
    }
  }
}

if (orphans.length === 0) {
  console.log(`✓ 계산기 ${total}개 전부 연결된 블로그 글이 있음`);
} else {
  console.log(`연결된 블로그가 없는 계산기 ${orphans.length}/${total}개:\n`);
  let lastCat = '';
  for (const o of orphans) {
    if (o.cat !== lastCat) { console.log(`[${o.catName} / ${o.cat}]`); lastCat = o.cat; }
    console.log(`  ${o.slug.padEnd(24)} ${o.name}   →  ${o.url}`);
  }
  console.log(`\n→ /blog 작성 시 우선순위 ③(신규 계산기 미커버)에서 이 목록을 우선 타겟으로.`);
}

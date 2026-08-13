#!/usr/bin/env node
/**
 * noindex 격리 상태가 흐트러졌는지 검사한다. 격리 체제가 두 종류이고
 * 검사 방향이 서로 정반대라 한 스크립트에서 같이 본다.
 *
 * ── 체제 A: 전면차단 (2026-06-29, 15편)
 *   `<meta name="robots" content="noindex, follow">`
 *   주제이탈 약체글(AI 도구비교 7 + 펫 4 + 얇은 온니치 4). 구글·네이버 모두 차단하고
 *   sitemap · blog/index · rss 에서도 뺐다. noindex 는 검색엔진만 막을 뿐
 *   애드센스 심사자의 동선은 못 막으므로 목록 카드가 살아있으면 프루닝이 무효가 된다.
 *   → 세 파일 어디에도 있으면 안 된다.
 *
 * ── 체제 B: 구글한정 (2026-08-13, 105편)
 *   `<meta name="googlebot" content="noindex, follow">`
 *   애드센스 4차 거절 후속. 구글이 이미 색인을 거부한 블로그 105편을 구글 시야에서만
 *   빼서 사이트 평균 품질 신호를 계산기 중심으로 되돌린다. 이 글들은 네이버 트래픽의
 *   본체이므로 네이버에는 그대로 남겨야 한다.
 *   → sitemap 에 반드시 남아 있어야 하고(네이버 발견 경로),
 *     범용 robots noindex 가 섞이면 네이버까지 죽으므로 그것도 잡는다.
 *
 * 대상 목록은 하드코딩하지 않고 blog/posts/*.html 의 메타에서 직접 읽는다.
 * 글에 noindex 를 새로 걸거나 풀면 이 스크립트는 자동으로 따라온다.
 *
 * 사용: node scripts/check-noindex-excluded.mjs
 * 종료코드: 0 = 정상, 1 = 위반 있음
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');

function metaContent(head, name) {
  const m = head.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'));
  return m ? m[1] : null;
}

// 체제 B 격리 시점. 이 날짜 뒤에 발행된 글은 구글 색인 회복을 관측하는
// 카나리아이므로 어떤 noindex 도 걸리면 안 된다.
const CANARY_AFTER = '2026-07-30';

function classify() {
  const blocked = []; // 체제 A
  const googleOnly = []; // 체제 B
  const canaryViolations = []; // 격리 이후 발행인데 noindex 가 걸린 글
  for (const f of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.html'))) {
    const body = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const head = body.slice(0, 8000);
    const slug = f.replace(/\.html$/, '');
    const robots = metaContent(head, 'robots');
    const googlebot = metaContent(head, 'googlebot');
    const isNoindex = (v) => v && /noindex/i.test(v);
    if (isNoindex(robots)) blocked.push(slug);
    else if (isNoindex(googlebot)) googleOnly.push(slug);

    if (isNoindex(robots) || isNoindex(googlebot)) {
      const pd = body.match(/"datePublished"\s*:\s*"([0-9-]+)"/);
      if (pd && pd[1] > CANARY_AFTER) canaryViolations.push(`${pd[1]} ${slug}`);
    }
  }
  return { blocked, googleOnly, canaryViolations };
}

const { blocked, googleOnly, canaryViolations } = classify();
const read = (rel) => {
  const full = path.join(ROOT, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
};

const sitemap = read('sitemap.xml');
const blogIndex = read('blog/index.html');
const rss = read('rss.xml');

const inSitemap = (s) => sitemap?.includes(`/blog/posts/${s}.html`);
const inIndex = (s) => blogIndex?.includes(`./posts/${s}.html" class="post-card`);
const inRss = (s) => rss?.includes(`/blog/posts/${s}.html`);

let bad = 0;

console.log(`체제 A 전면차단 ${blocked.length}편 · 체제 B 구글한정 ${googleOnly.length}편\n`);

// ── 체제 A: 세 파일에서 빠져 있어야 한다
console.log('[체제 A] 전면차단 글이 목록에 되살아났는지');
for (const [label, present] of [
  ['sitemap.xml', inSitemap],
  ['blog/index.html', inIndex],
  ['rss.xml', inRss],
]) {
  const hits = blocked.filter(present);
  if (hits.length === 0) {
    console.log(`  ✓ ${label}: 깨끗함`);
  } else {
    bad += hits.length;
    console.log(`  ✗ ${label}: ${hits.length}편이 되살아났습니다`);
    hits.forEach((s) => console.log(`      ${s}`));
  }
}

// ── 체제 B: sitemap 에 남아 있어야 하고, 범용 robots 로 승격되면 안 된다
console.log('\n[체제 B] 구글한정 글의 네이버 경로가 유지되는지');
if (googleOnly.length === 0) {
  console.log('  - 대상 없음, 건너뜀');
} else {
  const dropped = googleOnly.filter((s) => !inSitemap(s));
  if (dropped.length === 0) {
    console.log(`  ✓ sitemap.xml: ${googleOnly.length}편 전부 남아있음 (네이버 발견 경로 정상)`);
  } else {
    bad += dropped.length;
    console.log(`  ✗ sitemap.xml: ${dropped.length}편이 빠졌습니다. 네이버까지 색인에서 사라집니다`);
    dropped.forEach((s) => console.log(`      ${s}`));
  }

  const droppedIndex = googleOnly.filter((s) => !inIndex(s));
  if (droppedIndex.length === 0) {
    console.log(`  ✓ blog/index.html: ${googleOnly.length}편 전부 카드 유지`);
  } else {
    console.log(`  ! blog/index.html: ${droppedIndex.length}편 카드 없음 (치명적이진 않으나 확인 권장)`);
    droppedIndex.slice(0, 10).forEach((s) => console.log(`      ${s}`));
  }
}

// ── 카나리아: 격리 이후 발행글에 noindex 가 붙으면 안 된다
console.log(`\n[카나리아] ${CANARY_AFTER} 이후 발행글이 색인 가능한지`);
if (canaryViolations.length === 0) {
  console.log('  ✓ 격리 이후 발행글에 noindex 없음');
} else {
  bad += canaryViolations.length;
  console.log(`  ✗ ${canaryViolations.length}편에 noindex 가 걸렸습니다. 구글 색인 회복을 관측할 지표가 사라집니다`);
  canaryViolations.forEach((s) => console.log(`      ${s}`));
  console.log('    → 새 글을 기존 글에서 복사할 때 메타까지 딸려온 경우가 대부분이다. 해당 meta 줄을 지울 것');
}

console.log('');
if (bad > 0) {
  console.log(`총 ${bad}건 위반. 체제 A 는 목록에서 빠져야 하고, 체제 B 는 sitemap 에 남아야 합니다.`);
  process.exit(1);
}
console.log('통과. 두 체제 모두 정상입니다.');

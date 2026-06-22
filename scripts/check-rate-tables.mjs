#!/usr/bin/env node
// 요율/기준표 가드 (2026-06 신설)
// 사용: node scripts/check-rate-tables.mjs
//
// 두 가지를 점검한다.
//  ① 정책·세율 카테고리(salary·tax·realestate·finance) 계산기 중 본문에 <table>이 없는 페이지
//     → 요율/기준표 누락 후보 (calc-page-assets.md "정책·세율 계산기는 요율/기준표 1개 필수" 룰).
//        순수 공식·날짜·비교 계산기는 SKIP_NO_TABLE 화이트리스트로 제외.
//  ② 상속·증여세 "부결안"(2024-12-10 국회 부결된 개편안: 최고세율 40%·4단계·자녀공제 5억)
//     시그니처가 계산기/블로그에 되살아났는지 탐지. 현행법은 5단계 10~50%.
//        관련 메모리: project_jptcalc_inheritance_tax_current_law / data-points.md 7.0
//
// ②에 걸리면 exit 1 (회귀=하드 실패). ①은 리뷰 후보로 리포트만.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── ① 정책 카테고리 표 누락 ────────────────────────────────
const POLICY_CATS = ['salary', 'tax', 'realestate', 'finance'];
// 표가 면제되는 순수 공식·날짜·비교 계산기 (slug)
const SKIP_NO_TABLE = new Set([
  'loan', 'stock-average', 'investment',          // 공식
  'raise-rate', 'comparison',                     // 연봉 공식·비교
]);

const missingTable = [];
for (const cat of POLICY_CATS) {
  const catDir = join(root, 'calc', cat);
  if (!existsSync(catDir)) continue;
  for (const slug of readdirSync(catDir)) {
    const file = join(catDir, slug, 'index.html');
    if (!existsSync(file) || !statSync(file).isFile()) continue;
    if (SKIP_NO_TABLE.has(slug)) continue;
    const html = readFileSync(file, 'utf-8');
    if (!/<table/i.test(html)) {
      missingTable.push(`calc/${cat}/${slug}/index.html`);
    }
  }
}

// ── ② 상속·증여세 부결안 시그니처 ──────────────────────────
// 현행법(정답): 1억이하10%/~5억20%(-1,000만)/~10억30%(-6,000만)/~30억40%(-1억6,000만)/30억초과50%(-4억6,000만)
// 부결안(오류): 2억이하10%/~5억20%(-2,000만)/~10억30%(-7,000만)/10억초과40%(-1억7,000만)
// 현행법을 "설명"하는 줄(부결·미통과 안내, 현행 5천만 언급, 일괄공제 5억 등)은 오탐 → 제외
const CURRENT_LAW_CONTEXT = /미통과|부결|시행되지|폐기|아니라|아닌|5,?000만|5천만|일괄공제|합이|기초/;
const REFORM_SIGNATURES = [
  { re: /1억\s*7,?000\s*만/, desc: '부결안 40% 누진공제(1억 7,000만) — 현행 1억 6,000만' },
  { re: /0\.40\s*-\s*17000/, desc: '부결안 JS 세율(0.40 - 17000) — 현행 0.50 - 46000' },
  { re: /0\.30\s*-\s*7000/, desc: '부결안 JS 세율(0.30 - 7000) — 현행 0.30 - 6000' },
  { re: /0\.20\s*-\s*2000/, desc: '부결안 JS 세율(0.20 - 2000) — 현행 0.20 - 1000' },
  { re: /30억\s*초과\s*50%\s*구간\s*폐지/, desc: '부결안 문구(30억 초과 50% 구간 폐지)' },
  // 자녀공제 5억은 숫자 경계(앞에 소수점/숫자 없을 때)로 한정 + 현행법 설명 줄은 제외
  { re: /자녀\s*(인적\s*)?공제\s*(한도\s*)?(1인당\s*)?5억/, desc: '부결안 자녀공제 5억 — 현행 1인당 5,000만', guardCurrentLaw: true },
];

const scanFiles = [];
const calcRoot = join(root, 'calc');
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (e === 'index.html') scanFiles.push(p);
  }
})(calcRoot);
const postsDir = join(root, 'blog', 'posts');
for (const f of readdirSync(postsDir)) {
  if (f.endsWith('.html')) scanFiles.push(join(postsDir, f));
}

const reformHits = [];
for (const file of scanFiles) {
  const lines = readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    for (const sig of REFORM_SIGNATURES) {
      if (!sig.re.test(line)) continue;
      if (sig.guardCurrentLaw && CURRENT_LAW_CONTEXT.test(line)) continue; // 현행법 설명 줄 = 오탐 제외
      reformHits.push({ file: file.replace(root + '/', ''), line: i + 1, desc: sig.desc });
    }
  });
}

// ── 리포트 ─────────────────────────────────────────────────
console.log('① 정책 카테고리 표 누락 (요율/기준표 추가 검토 후보)');
if (missingTable.length === 0) {
  console.log('  ✓ salary·tax·realestate·finance 계산기 모두 표 보유 (화이트리스트 제외)');
} else {
  for (const m of missingTable) console.log('  · ' + m);
  console.log('  → 정책·세율 페이지면 요율/기준표 추가, 순수 공식이면 SKIP_NO_TABLE에 등록');
}

console.log('\n② 상속·증여세 부결안 시그니처 (현행법 위반 = 회귀)');
if (reformHits.length === 0) {
  console.log('  ✓ 부결안 흔적 없음 (현행 5단계 10~50% 유지)');
  process.exit(0);
} else {
  for (const h of reformHits) console.log(`  ✗ ${h.file}:${h.line}  ${h.desc}`);
  console.log('\n  부결안 재도입 금지. 현행법으로 정정하세요 (data-points.md 7.0 참조).');
  process.exit(1);
}

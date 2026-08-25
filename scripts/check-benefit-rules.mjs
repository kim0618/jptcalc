#!/usr/bin/env node
/**
 * benefit-rules.js 가드
 *  ① decision_type이 문구를 막는지 (direct 아닌 곳의 "받을 수 있습니다" 금지)
 *  ② authority_review에 판정주체가 있는지
 *  ③ sources·recheck_by 누락
 *  ④ recheck_by 경과 (제도가 아직 있는지 재확인 대상)
 *  ⑤ 기초연금 값 자체 정합 (연계감액 = 기준연금액 × 150%, 부부 = 단독 × 160%)
 *  ⑥ 폐기된 구 명칭 사용 (노인일자리 3유형 등)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'assets/benefit-rules.js'), 'utf8');
const sandbox = { window: {} };
new Function('window', src)(sandbox.window);
const RULES = sandbox.window.BENEFIT_RULES;
const COPY = sandbox.window.BENEFIT_DECISION_COPY;
const UPDATED = sandbox.window.BENEFIT_RULES_UPDATED;

const fail = [];
const warn = [];
const today = new Date().toISOString().slice(0, 10);

// 폐기된 구 명칭 (쓰면 안 되는 표현)
const DEPRECATED = ['공익활동형', '사회서비스형', '시장형'];

for (const b of RULES) {
  const id = b.benefit_id;
  const texts = [b.result_copy, b.caution_copy, ...(b.conditions || []), ...(b.exceptions || [])]
    .filter(Boolean).join(' ');

  if (b.decision_type !== 'direct' && /받을 수 있습니다/.test([b.result_copy, b.caution_copy].filter(Boolean).join(' ')))
    fail.push(`${id}: ${b.decision_type}인데 "받을 수 있습니다" 사용`);

  if (COPY[b.decision_type]?.requires_authority && !b.authority)
    fail.push(`${id}: ${b.decision_type}인데 판정주체(authority) 없음`);

  if (b.decision_type === 'authority_review' && !/확인해 볼 수 있습니다/.test(b.result_copy || ''))
    fail.push(`${id}: authority_review 표준 문구 미사용`);

  // 진단기의 목적이 '다음 행동으로 넘기기'이므로 심사 항목에 링크가 없으면 결과가 막다른 길이 된다
  if (b.decision_type === 'authority_review' && !b.guide_url)
    fail.push(`${id}: authority_review인데 guide_url 없음 (결과가 막다른 길)`);
  if (b.guide_url && !/^https:\/\//.test(b.guide_url))
    fail.push(`${id}: guide_url이 https 절대경로가 아님`);
  if (b.guide_url && !b.guide_label)
    fail.push(`${id}: guide_url은 있는데 guide_label 없음`);
  if (!b.short_name) fail.push(`${id}: short_name 없음 (미리보기 문구에 필요)`);
  if (!b.sources?.length) fail.push(`${id}: sources 비어 있음`);
  if (!b.recheck_by) fail.push(`${id}: recheck_by 없음`);
  else if (b.recheck_by < today) warn.push(`${id}: recheck_by ${b.recheck_by} 경과 - 제도 존속 여부부터 재확인`);

  if (b.valid_until && b.valid_until < today)
    warn.push(`${id}: valid_until ${b.valid_until} 경과`);

  for (const d of DEPRECATED)
    if (texts.includes(d) || JSON.stringify(b.recipient_rule || {}).includes(d))
      fail.push(`${id}: 폐기된 구 명칭 "${d}" 사용`);
}

// 기초연금 값 자체 정합
const bp = RULES.find(b => b.benefit_id === 'basic_pension');
if (bp?.values_2026) {
  const v = bp.values_2026;
  if (v.기준연금액_단독 * 1.5 !== v.연계감액_기준)
    fail.push(`basic_pension: 연계감액 기준 불일치 (${v.기준연금액_단독} × 150% ≠ ${v.연계감액_기준})`);
  const r1 = v.기준연금액_부부 / v.기준연금액_단독;
  const r2 = v.선정기준액_부부 / v.선정기준액_단독;
  if (Math.abs(r1 - 1.6) > 0.001) fail.push(`basic_pension: 기준연금액 부부/단독 ${r1.toFixed(3)} (160% 기대)`);
  if (Math.abs(r2 - 1.6) > 0.001) fail.push(`basic_pension: 선정기준액 부부/단독 ${r2.toFixed(3)} (160% 기대)`);

  // 사이트 내 다른 사본과 대조 (허브·계산기)
  const copies = [
    ['calc/pension-welfare/index.html', ['247만원', '395.2만원', '34.97만원', '55.95만원']],
    ['calc/pension-welfare/basic-pension/index.html', ['2,470,000원', '3,952,000원', '349,700원']],
  ];
  for (const [f, needles] of copies) {
    const html = fs.readFileSync(path.join(root, f), 'utf8');
    for (const n of needles)
      if (!html.includes(n)) fail.push(`사본 불일치: ${f} 에 "${n}" 없음`);
  }
}

console.log(`benefit-rules.js  제도 ${RULES.length}개 / 최종 확인 ${UPDATED}`);
const dist = {};
RULES.forEach(b => { dist[b.decision_type] = (dist[b.decision_type] || 0) + 1; });
console.log('  분류: ' + Object.entries(dist).map(([k, v]) => `${k} ${v}`).join(' · '));

if (warn.length) { console.log('\n[재확인 필요]'); warn.forEach(w => console.log('  ! ' + w)); }
if (fail.length) { console.log('\n[실패]'); fail.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
console.log('\n✓ 통과');

// law.go.kr 법령·행정규칙 원문을 헤드리스 크롬으로 렌더해 텍스트로 저장한다.
// DRF API(OC=test)는 2026-11 기준 IP 미등록으로 막혀 있어 이 방식을 쓴다.
// 사용: LD_LIBRARY_PATH=$HOME/.local/emulib node scripts/law-render.mjs "<법령명 또는 law.go.kr URL>" <출력경로(확장자 없이)>
//   예: node scripts/law-render.mjs 근로기준법 /tmp/law/lsa
//   결과: <출력>.txt (모든 frame innerText), <출력>.html, <출력>.links (별표·서식 flDownload 링크)
// 별표·서식 PDF: curl -s -A Mozilla -o x.pdf "https://www.law.go.kr/LSW/<links의 한 줄>" 후 pypdf로 텍스트 추출.
// 세율표·공제율표는 innerText에 비어 나오고 .html의 <img alt="...">에 들어 있다.
import fs from 'fs';
const PW = '/home/tjd618/.claude/tools/calc-runner/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const [arg, out] = process.argv.slice(2);
if (!arg || !out) { console.error('usage: law-render.mjs <법령명|URL> <out>'); process.exit(1); }
const url = arg.startsWith('http') ? arg : `https://www.law.go.kr/법령/${arg}`;
// 설치된 chromium-NNNN 중 가장 높은 버전을 쓴다(버전 고정 경로는 playwright 갱신 때마다 깨졌다, 2026-11-06)
const pwDir = process.env.HOME + '/.cache/ms-playwright';
const chromeDir = fs.readdirSync(pwDir).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1])[0];
const b = await chromium.launch({ executablePath: `${pwDir}/${chromeDir}/chrome-linux64/chrome` });
const p = await b.newPage();
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(3000);
let txt = '', html = '';
for (const f of p.frames()) { try { txt += await f.evaluate(() => document.body.innerText) + '\n'; html += await f.content(); } catch (e) {} }
fs.writeFileSync(out + '.txt', txt); fs.writeFileSync(out + '.html', html);
const links = [...new Set([...html.matchAll(/flDownload\.do\?[^"' ]+/g)].map(m => m[0].replace(/&amp;/g, '&')))];
fs.writeFileSync(out + '.links', links.join('\n'));
await b.close();
console.log(`ok ${url} text=${txt.length} links=${links.length}`);

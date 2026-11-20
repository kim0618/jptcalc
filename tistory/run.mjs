// 계산기 페이지의 실제 함수로 값 뽑기: node run.mjs <calc 경로> <expr.js>  (expr 마지막 식 = JSON 가능한 값)
import fs from 'fs';
const { chromium } = await import('/home/tjd618/.claude/tools/calc-runner/node_modules/playwright/index.mjs');
const [calc, f] = process.argv.slice(2);
const pwDir = process.env.HOME + '/.cache/ms-playwright';
const cd = fs.readdirSync(pwDir).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1])[0];
const b = await chromium.launch({ executablePath: `${pwDir}/${cd}/chrome-linux64/chrome` });
const p = await b.newPage();
await p.goto(`https://www.jptcalc.kr/calc/${calc}/`, { waitUntil: 'networkidle' });
console.log(JSON.stringify(await p.evaluate(fs.readFileSync(f, 'utf8')), null, 0));
await b.close();

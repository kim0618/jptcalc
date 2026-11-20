// 계산기 캡처: node cap.mjs <out.jpg> <calc 경로 예: salary/premium-pay> <setup.js>
// setup.js = 페이지 안에서 실행할 코드(입력값 넣고 계산 함수 호출). 마지막 식의 값이 콘솔에 찍힌다(결과 숫자 확인용).
// 실행: LD_LIBRARY_PATH=$HOME/.local/emulib node cap.mjs ...
import fs from 'fs';
const { chromium } = await import('/home/tjd618/.claude/tools/calc-runner/node_modules/playwright/index.mjs');
const [out, calc, setupFile] = process.argv.slice(2);
const pwDir = process.env.HOME + '/.cache/ms-playwright';
const cd = fs.readdirSync(pwDir).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1])[0];
const b = await chromium.launch({ executablePath: `${pwDir}/${cd}/chrome-linux64/chrome` });
const p = await b.newPage({ viewport: { width: +(process.env.VIEW_W || 1280), height: 1400 }, deviceScaleFactor: 2 });
await p.goto(`https://www.jptcalc.kr/calc/${calc}/`, { waitUntil: 'networkidle' });
const res = await p.evaluate(fs.readFileSync(setupFile, 'utf8'));
console.log('setup 결과:', res);
await p.waitForTimeout(1500);
await p.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e).position; if (s === 'fixed' || s === 'sticky') e.style.display = 'none'; } });
const sel = process.env.RESULT_SEL || '#result';
const el = await p.evaluateHandle((sel) => { let e = document.querySelector(sel); while (e.parentElement && e.getBoundingClientRect().width < 900) e = e.parentElement; return e; }, sel);
const tmp = out + '.full.png';
await el.screenshot({ path: tmp });
await b.close();
// 입력·결과 두 칸만 남기고(오른쪽 '이어서 계산' 칸 제거) 가로 1100으로
const { execFileSync } = await import('child_process');
execFileSync('python3', ['-c', `
from PIL import Image
im=Image.open('${tmp}'); w,h=im.size
im=im.crop((0,0,int(w*0.722),h)).convert('RGB')
im=im.resize((1100,int(im.size[1]*1100/im.size[0])),Image.LANCZOS); im.save('${out}',quality=86)
print('저장',im.size)`], { stdio: 'inherit' });
fs.unlinkSync(tmp);

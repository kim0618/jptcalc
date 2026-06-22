/* 계산기 sibling-section 생성기 (관련 계산기 + 관련 가이드).
   단일 소스:
     - 관련 계산기 = assets/calc-registry.js
     - 관련 가이드 = blog/posts/*.html 의 계산기 링크를 역매핑(자동)
   계산기/블로그 추가 후 이 스크립트만 재실행하면 전 페이지 정적 sibling-section이 자동 갱신된다.
   (크롤러용. JS 사용자에겐 detail-shell의 .sibling-section{display:none}이 숨김 → 사이드바를 봄)
   실행: node scripts/inject-sibling.mjs */
import fs from 'fs';
const BASE='/home/tjd618/jptcalc';
global.window={};
eval(fs.readFileSync(`${BASE}/assets/calc-registry.js`,'utf8'));
const REG=global.window.CALC_REGISTRY;
const TITLES={
  realestate:'다른 부동산 계산기', salary:'다른 이직/연봉 계산기', tax:'다른 프리랜서 세금 계산기',
  'pension-welfare':'다른 연금·복지 계산기', date:'다른 날짜 계산기', finance:'다른 금융·이자 계산기',
  health:'다른 건강 계산기', pet:'다른 반려동물 계산기', ai:'다른 AI / 테크 계산기', tools:'다른 생활·도구 계산기',
  auto:'다른 자동차 계산기',
};
const GUIDE_CAP=6;

// 블로그 → 계산기 링크를 역매핑 (calc "cat/slug" → [{url,title}])
const calcBlogs={};
const blogDir=`${BASE}/blog/posts`;
for(const fn of fs.readdirSync(blogDir)){
  if(!fn.endsWith('.html'))continue;
  const html=fs.readFileSync(`${blogDir}/${fn}`,'utf8');
  let title=((html.match(/<title>([^<]*)<\/title>/)||[])[1]||fn).split('|')[0].trim();
  if(title.length>42)title=title.slice(0,41)+'…';
  const url=`/blog/posts/${fn}`;
  const keys=new Set();
  let m; const re=/\/calc\/([a-z-]+)\/([a-z-]+)\//g;
  while((m=re.exec(html)))keys.add(`${m[1]}/${m[2]}`);
  for(const k of keys)(calcBlogs[k]=calcBlogs[k]||[]).push({url,title});
}
for(const k in calcBlogs) calcBlogs[k]=calcBlogs[k].slice(0,GUIDE_CAP);

function genBlock(cat,slug){
  const calcLinks=REG[cat].calcs.map(c=>{
    const cur=c.slug===slug?' current':'';
    return `      <a href="/calc/${cat}/${c.slug}/" class="sibling-link${cur}">${c.icon} ${c.name}</a>`;
  }).join('\n');
  let out=`  <div class="sibling-section">\n    <div class="sibling-title">${TITLES[cat]}</div>\n    <div class="sibling-list">\n${calcLinks}\n    </div>`;
  const blogs=calcBlogs[`${cat}/${slug}`];
  if(blogs&&blogs.length){
    const bl=blogs.map(b=>`      <a href="${b.url}" class="sibling-link">📖 ${b.title}</a>`).join('\n');
    out+=`\n    <div class="sibling-title">관련 가이드</div>\n    <div class="sibling-list">\n${bl}\n    </div>`;
  }
  return out+`\n  </div>`;
}

const re=/[ \t]*<div class="sibling-section">[\s\S]*?<\/div>\s*<\/div>/;
let rep=0,ins=0,withGuide=0;
for(const cat of Object.keys(REG)){
  if(!TITLES[cat])continue;
  const dir=`${BASE}/calc/${cat}`;
  if(!fs.existsSync(dir))continue;
  for(const slug of fs.readdirSync(dir)){
    const fp=`${dir}/${slug}/index.html`;
    if(!fs.existsSync(fp))continue;
    let html=fs.readFileSync(fp,'utf8');
    const block=genBlock(cat,slug);
    if(calcBlogs[`${cat}/${slug}`])withGuide++;
    if(re.test(html)){html=html.replace(re,block);rep++;}
    else if(html.includes('</main>')){html=html.replace('</main>',block+'\n</main>');ins++;}
    else continue;
    fs.writeFileSync(fp,html);
  }
}
console.log(`완료: 교체 ${rep} · 신규 ${ins} · 관련가이드 포함 ${withGuide}개 계산기`);

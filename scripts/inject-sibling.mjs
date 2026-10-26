/* 계산기 sibling-section 생성기 (관련 계산기 + 관련 가이드).
   단일 소스:
     - 관련 계산기 = assets/calc-registry.js
     - 관련 가이드 = blog/posts/*.html 의 계산기 링크를 역매핑(자동)
   계산기/블로그 추가 후 이 스크립트만 재실행하면 전 페이지 정적 sibling-section이 자동 갱신된다.
   (크롤러용. JS 사용자에겐 detail-shell의 .sibling-section{display:none}이 숨김 → 사이드바를 봄)
   실행: node scripts/inject-sibling.mjs */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
// 캐시 버전 표시(design/tools/asset_version.py와 같은 규칙): 공용 CSS·JS 주소에 ?v=파일 내용 sha256 앞 8자리
function stampHtml(html){
  return html.replace(/(<(?:link|script)\b[^>]*?\s(?:href|src)=")(\/assets\/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]{8})?(")/g,(m,a,u,z)=>{
    const f=path.join(BASE,u.slice(1));
    return fs.existsSync(f)&&fs.statSync(f).isFile()?`${a}${u}?v=${crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0,8)}${z}`:`${a}${u}${z}`;
  });
}
// 스크립트가 들어 있는 저장소 기준(작업본에서 돌리면 작업본만 고친다)
const BASE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
global.window={};
eval(fs.readFileSync(`${BASE}/assets/calc-registry.js`,'utf8'));
const REG=global.window.CALC_REGISTRY;
const TITLES={
  realestate:'다른 부동산 계산기', salary:'다른 이직/연봉 계산기', tax:'다른 프리랜서 세금 계산기',
  'pension-welfare':'다른 연금·복지 계산기', date:'다른 날짜 계산기', finance:'다른 금융·이자 계산기',
  health:'다른 건강 계산기', pet:'다른 반려동물 계산기', ai:'다른 AI / 테크 계산기', tools:'다른 생활·도구 계산기',
  auto:'다른 자동차 계산기', baby:'다른 출산·육아 계산기',
};
const GUIDE_CAP=6;

// 블로그 → 계산기 링크를 역매핑 (calc "cat/slug" → [{url,title}])
const calcBlogs={};
const blogDir=`${BASE}/blog/posts`;
for(const fn of fs.readdirSync(blogDir)){
  if(!fn.endsWith('.html'))continue;
  const html=fs.readFileSync(`${blogDir}/${fn}`,'utf8');
  let title=((html.match(/<title>([^<]*)<\/title>/)||[])[1]||fn).split('|')[0].trim();
  const url=`/blog/posts/${fn}`;
  const slugB=fn.replace(/\.html$/,'');
  // 표지가 있으면 썸네일: 64px 자리라 축소 전용 1:1(build_blog_covers.py --ratio 1x1, 2026-10-21)
  const thumb=fs.existsSync(`${BASE}/assets/img/blog-thumb/${slugB}-1x1.webp`)?`/assets/img/blog-thumb/${slugB}-1x1.webp`:'';
  const keys=new Set();
  let m; const re=/\/calc\/([a-z-]+)\/([a-z-]+)\//g;
  while((m=re.exec(html)))keys.add(`${m[1]}/${m[2]}`);
  for(const k of keys)(calcBlogs[k]=calcBlogs[k]||[]).push({url,title,thumb});
}
for(const k in calcBlogs) calcBlogs[k]=calcBlogs[k].slice(0,GUIDE_CAP);

function genBlock(cat,slug,cls){
  // 현재 페이지는 목록에서 뺀다(강조 대신, 2026-10-20). 제목은 섹션 제목(h2)
  const calcLinks=REG[cat].calcs.filter(c=>c.slug!==slug).map(c=>`      <a href="/calc/${cat}/${c.slug}/" class="sibling-link">${c.name}</a>`).join('\n');
  let out=`  <div class="sibling-section${cls||''}">\n    <h2 class="sibling-title">${TITLES[cat]}</h2>\n    <div class="sibling-list">\n${calcLinks}\n    </div>`;
  const blogs=calcBlogs[`${cat}/${slug}`];
  if(blogs&&blogs.length){
    const bl=blogs.map(b=>`      <a href="${b.url}" class="sibling-link${b.thumb?' sibling-guide':''}">${b.thumb?`<img src="${b.thumb}" alt="" width="240" height="240" loading="lazy" decoding="async">`:''}<span>${b.title}</span></a>`).join('\n');
    out+=`\n    <h2 class="sibling-title">관련 가이드</h2>\n    <div class="sibling-list sibling-guides">\n${bl}\n    </div>`;
  }
  return out+`\n  </div>`;
}

// 리뉴얼 페이지는 class="sibling-section ds-section": 덧붙은 클래스를 지키며 교체(이모지는 2026-10-19부터 넣지 않음)
const re=/[ \t]*<div class="sibling-section( [^"]*)?">[\s\S]*?<\/div>\s*<\/div>/;
let rep=0,ins=0,withGuide=0,skip=0,pruned=0,trimmed=0;
for(const cat of Object.keys(REG)){
  if(!TITLES[cat])continue;
  const dir=`${BASE}/calc/${cat}`;
  if(!fs.existsSync(dir))continue;
  for(const slug of fs.readdirSync(dir)){
    const fp=`${dir}/${slug}/index.html`;
    if(!fs.existsSync(fp))continue;
    let html=fs.readFileSync(fp,'utf8');
    // 옛 디자인 페이지(새 틀 site-shell.js가 없는 main 판: dti·pyeong 11/9까지)는 바이트 그대로 둔다
    if(!html.includes('/assets/ds/site-shell.js')){skip++;continue;}
    const cm=html.match(re);
    const block=genBlock(cat,slug,cm&&cm[1]);
    if(calcBlogs[`${cat}/${slug}`])withGuide++;
    // "관련 계산기"(.ds-related)에서 "다른 ○○ 계산기"와 겹치는 카드는 뺀다. 다 빠지면 제목과 함께 지운다(10/21, "이어서 계산"은 그대로)
    const sib=new Set(REG[cat].calcs.filter(c=>c.slug!==slug).map(c=>`/calc/${cat}/${c.slug}/`));
    html=html.replace(/([ \t]*<h2 class="ds-col-title">관련 계산기<\/h2>\s*)<div class="ds-next ds-related">([\s\S]*?)\n([ \t]*)<\/div>/,(all,head,inner,ind)=>{
      const cards=inner.match(/[ \t]*<a class="ds-next-card" href="[^"]+">[\s\S]*?<\/a>\n?/g)||[];
      const keep=cards.filter(c=>!sib.has(c.match(/href="([^"]+)"/)[1]));
      if(!keep.length){pruned++;return '';}
      if(keep.length<cards.length)trimmed++;
      return `${head}<div class="ds-next ds-related">\n${keep.join('').replace(/\n?$/,'\n')}${ind}</div>`;
    });
    if(re.test(html)){html=html.replace(re,block);rep++;}
    else if(html.includes('</main>')){html=html.replace('</main>',block+'\n</main>');ins++;}
    else continue;
    fs.writeFileSync(fp,stampHtml(html));
  }
}
console.log(`완료: 교체 ${rep} · 신규 ${ins} · 관련가이드 포함 ${withGuide}개 계산기 · 옛 디자인이라 건너뜀 ${skip} · 관련 계산기 줄임 ${trimmed}·없앰 ${pruned}`);

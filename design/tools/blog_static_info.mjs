// 글 하단 작성자·검토 안내 정적화: 원본 blog-article-info.js·blog-review-footer.js를 가짜 DOM에서 그대로 실행해 넣으려던 HTML을 받아 온다.
// 문구를 다시 쓰지 않으므로 화면 글자가 원본과 같다. 사용: node design/tools/blog_static_info.mjs OUT.json POST.html...
import fs from 'fs'; import vm from 'vm'; import path from 'path'; import { fileURLToPath } from 'url';
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = { info: fs.readFileSync(`${SITE}/assets/blog-article-info.js`, 'utf8'), review: fs.readFileSync(`${SITE}/assets/blog-review-footer.js`, 'utf8') };
const [out, ...files] = process.argv.slice(2); const res = {};
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.includes('ARTICLE_INFO_CONFIG'));
  const r = {};
  for (const [k, src] of Object.entries(SRC)) {
    const got = [];
    const node = () => ({ parentNode: { insertBefore: b => got.push(b.__html) }, appendChild: b => got.push(b.__html) });
    const document = { readyState: 'complete', getElementById: () => null, head: { appendChild() {} },
      createElement: t => { const o = { set innerHTML(v) { this.__h = v; }, get firstChild() { return { __html: this.__h }; } }; return o; },
      querySelector: () => node(), addEventListener() {} };
    const ctx = { window: {}, document, String, Object }; ctx.window.document = document; vm.createContext(ctx);
    for (const s of inline) vm.runInContext(s.replace(/\bwindow\./g, 'window.'), ctx);
    vm.runInContext(src, ctx);
    r[k] = got[0] || '';
    if (k === 'info') r.cfg = JSON.parse(JSON.stringify(ctx.window.ARTICLE_INFO_CONFIG || {}));
  }
  res[path.basename(f, '.html')] = r;
}
fs.writeFileSync(out, JSON.stringify(res, null, 0)); console.log(Object.keys(res).length, '편');

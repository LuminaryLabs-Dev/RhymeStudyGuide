import {mkdir,writeFile,readFile,copyFile,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {content} from '../src/content/public.mjs';
import {createRepository} from '../src/repositories/content-repository.mjs';
import {createPageModels} from '../src/viewmodels/pages.mjs';
import {renderPage} from '../src/views/pages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const pages=createPageModels(createRepository(content));
const routes=pages.map(p=>p.route.endsWith('.html')?p.route:`${p.route}index.html`);
// Remove only exact previously generated HTML paths, never broad directories.
let previous=[];try{previous=JSON.parse(await readFile(path.join(root,'build-manifest.json'),'utf8')).files}catch{}
for(const f of previous)if(!routes.includes(f)&&/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/.test(f))await unlink(path.join(root,f)).catch(e=>{if(e.code!=='ENOENT')throw e});
for(const [i,v] of pages.entries()){
  const target=path.join(root,routes[i]);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,renderPage(v));
}
await mkdir(path.join(root,'assets'),{recursive:true});
await copyFile(path.join(root,'src/styles/site.css'),path.join(root,'assets/site.css'));
await copyFile(path.join(root,'src/services/site.js'),path.join(root,'assets/site.js'));
await writeFile(path.join(root,'.nojekyll'),'');
const urls=pages.filter(p=>p.kind!=='not-found').map(p=>`${content.site.origin}${content.site.base}${p.route}`);
await writeFile(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${content.site.origin}${content.site.base}sitemap.xml\n`);
await writeFile(path.join(root,'build-manifest.json'),JSON.stringify({version:1,base:content.site.base,files:routes},null,2)+'\n');
console.log(`Built ${pages.length} static pages at repository root (${content.site.base}).`);

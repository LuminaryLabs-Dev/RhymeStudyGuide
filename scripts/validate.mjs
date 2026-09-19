import {readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {files,base}=JSON.parse(await readFile(path.join(root,'build-manifest.json'),'utf8'));
const failures=[];let checkedLinks=0;
const htmls=new Map(await Promise.all(files.map(async f=>[f,await readFile(path.join(root,f),'utf8')])));
for(const [file,html] of htmls){
 if((html.match(/<h1[ >]/g)??[]).length!==1)failures.push(`${file}: expected one H1`);
 if(!html.includes('<title>')||!html.includes('name="description"')||!html.includes('rel="canonical"'))failures.push(`${file}: metadata missing`);
 if(/DB-RSG-|LUM-000|privateAnswer|api[_-]?key|TODO|lorem ipsum/i.test(html))failures.push(`${file}: internal or placeholder content`);
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 if(ids.size!==[...html.matchAll(/\bid="([^"]+)"/g)].length)failures.push(`${file}: duplicate IDs`);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const url=m[1];if(/^(https?:|data:|mailto:)/.test(url))continue;
  checkedLinks++;
  if(url.startsWith('#')){if(!ids.has(url.slice(1)))failures.push(`${file}: missing anchor ${url}`);continue}
  if(!url.startsWith(base)){failures.push(`${file}: incorrect base ${url}`);continue}
  const [raw,anchor]=url.slice(base.length).split('#');const target=raw.endsWith('/')?`${raw}index.html`:raw;
  try{await stat(path.join(root,target))}catch{failures.push(`${file}: broken link ${url}`)}
  if(anchor&&!htmls.get(target)?.includes(`id="${anchor}"`))failures.push(`${file}: broken fragment ${url}`);
 }
}
await mkdir(path.join(root,'validation'),{recursive:true});
const report={checkedPages:files.length,checkedLinks,failures,passed:failures.length===0};
await writeFile(path.join(root,'validation/route-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;

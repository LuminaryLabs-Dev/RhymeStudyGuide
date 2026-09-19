// QA tooling is intentionally separate from production dependencies.
// Set QA_MODULE_ROOT to a directory containing playwright, @sparticuz/chromium, @axe-core/playwright.
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync,spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(path.resolve(process.env.QA_MODULE_ROOT??root,'package.json'));
const {chromium}=require('playwright');const {default:serverless}=require('@sparticuz/chromium');const {default:AxeBuilder}=require('@axe-core/playwright');
const mode=process.env.QA_LIVE?'deployment':'local';
const base=process.env.QA_LIVE??'http://127.0.0.1:4173/RhymeStudyGuide/';
const runId=`${mode}-${new Date().toISOString().replace(/[:.]/g,'-')}`;
const dir=path.join(root,'validation/runs',runId);await mkdir(dir,{recursive:true});
const startedAt=new Date().toISOString();const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const requested={mode,target:mode==='local'?root:base,revision:mode==='local'?revision:null,expectedSurface:'dom',expectedState:'Readable literary home and complete public route content',interaction:'Switch discussion prompts, expand question hints, save a local note, and operate mobile navigation'};
const decisions=[{at:startedAt,stage:'inspect',kind:'fact',statement:`Target locked to ${base}; source ${revision}. Working tree may contain the release under test.`,basis:'Local git and build inspection',effect:'none'},{at:startedAt,stage:'route',kind:'decision',statement:'Use installed serverless Chromium with local Playwright; standard browser distribution download timed out. No target substitution.',basis:'Browser installation results',effect:'route-change'}];
await writeFile(path.join(dir,'target-lock.json'),JSON.stringify({runId,requested},null,2));
let localServer;
if(mode==='local'){
 localServer=spawn(process.execPath,[path.join(root,'scripts/serve.mjs')],{cwd:root,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{localServer.stdout.once('data',resolve);localServer.once('error',reject);localServer.once('exit',code=>reject(Error(`Server exited ${code}`)))});
 decisions.push({at:new Date().toISOString(),stage:'launch',kind:'decision',statement:'Local server started in same execution environment as browser; tool executions use separate network namespaces.',basis:'Cross-execution localhost connection refused',effect:'none'});
}
const logs=[],network=[],checks=[],a11y=[];
const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote'],executablePath:process.env.QA_CHROMIUM_PATH??await serverless.executablePath(),headless:true});
decisions.push({at:new Date().toISOString(),stage:'capture',kind:'decision',statement:'Capture fresh before/after screenshots and state assertions; Playwright video encoder is unavailable. No continuous video claimed.',basis:'Browser capture capability check',effect:'none'});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();page.on('pageerror',e=>logs.push(String(e)));page.on('console',m=>{if(m.type()==='error')logs.push(m.text())});page.on('requestfailed',r=>network.push({url:r.url(),error:r.failure()?.errorText}));
let verdict='pass';
try{
 await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(dir,'before.png'),fullPage:true});
 assert.match(await page.locator('h1').innerText(),/curiosity/);checks.push('Home visible');
 const frames=await page.locator('.scene-layer').evaluateAll(els=>els.map(el=>getComputedStyle(el).translate));await page.mouse.move(1100,350);await page.waitForTimeout(700);const moved=await page.locator('.scene-layer').evaluateAll(els=>els.map(el=>getComputedStyle(el).translate));assert.notDeepEqual(frames,moved);checks.push('Separate parallax layers respond to pointer');
 const manifest=JSON.parse(await readFile(path.join(root,'build-manifest.json'),'utf8'));
 for(const file of manifest.files){
   const route=file==='index.html'?'':file.replace(/index.html$/,'');
   const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
   assert.equal(await page.locator('h1').count(),1,route);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Desktop overflow: ${route}`);
   const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[],route);
   await page.waitForTimeout(200);
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();a11y.push({route,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
 }
 checks.push(`All ${manifest.files.length} routes render, images load, no desktop overflow`);
 await page.goto(base+'discussion/',{waitUntil:'networkidle'});const before=await page.locator('.prompt-panel:visible h2').innerText();await page.getByRole('button',{name:'Another question'}).click();const after=await page.locator('.prompt-panel:visible h2').innerText();assert.notEqual(before,after);assert.equal(await page.getByRole('button',{name:'Interpret',exact:true}).getAttribute('aria-pressed'),'true');checks.push('Discussion prompt state and visible content change');
 await page.waitForTimeout(700);await page.screenshot({path:path.join(dir,'after.png'),fullPage:true});
 await page.goto(base+'study-guide/reading-practice/notice/',{waitUntil:'networkidle'});const first=page.locator('details').first();await first.locator('summary').click();assert.ok(await first.getAttribute('open')!==null);assert.ok(await first.locator('.question-answer').isVisible());checks.push('Question disclosure opens');
 await page.getByLabel('What stayed with you?').fill('QA reflection: a detail worth returning to.');await page.waitForTimeout(500);await page.reload({waitUntil:'networkidle'});assert.equal(await page.getByLabel('What stayed with you?').inputValue(),'QA reflection: a detail worth returning to.');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear this note'}).click();assert.equal(await page.getByLabel('What stayed with you?').inputValue(),'');checks.push('Note survives refresh and clears with confirmation');
 await page.emulateMedia({media:'print'});await page.pdf({path:path.join(dir,'reading-print.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});checks.push('Print layout renders to PDF');
 await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Motion: on'}).click();assert.equal(await page.locator('html').getAttribute('data-motion'),'off');await page.reload();assert.equal(await page.locator('html').getAttribute('data-motion'),'off');checks.push('Motion preference survives navigation');
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>localStorage.removeItem('rhyme:motion'));await page.reload();assert.equal(await page.locator('html').getAttribute('data-motion'),'off');checks.push('System reduced motion respected');
 await page.setViewportSize({width:390,height:844});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:path.join(dir,'mobile-home.png'),fullPage:true});
 await page.getByRole('button',{name:'Menu'}).click();assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');assert.ok(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement));checks.push('Mobile menu opens, Escape closes and restores focus');
 for(const width of [390,320]){await page.setViewportSize({width,height:844});for(const file of manifest.files){await page.goto(base+(file==='index.html'?'':file.replace(/index.html$/,'')),{waitUntil:'load'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}px overflow: ${file}`)}}checks.push('Every route fits 390px and 320px viewports');
 await page.setViewportSize({width:390,height:844});await page.goto(base+'study-guide/reading-practice/notice/',{waitUntil:'networkidle'});await page.screenshot({path:path.join(dir,'mobile-reading.png'),fullPage:true});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(base,{waitUntil:'networkidle'});assert.ok(await p.getByRole('link',{name:'Start exploring'}).isVisible());assert.ok(await p.getByRole('navigation',{name:'Main navigation'}).isVisible());await p.goto(base+'study-guide/reading-practice/notice/');await p.locator('summary').first().click();assert.ok(await p.locator('.question-answer').first().isVisible());await nojs.close();checks.push('No-JavaScript navigation and question content work');
 const bad=a11y.filter(x=>x.violations.length);if(bad.length){verdict='fail';console.log('ACCESSIBILITY',JSON.stringify(bad,null,2))}
 if(logs.length||network.length){verdict='fail';console.log('ERRORS',JSON.stringify({logs,network}))}
}catch(e){verdict='fail';logs.push(e.stack);console.log(e.stack);await page.screenshot({path:path.join(dir,'failure.png'),fullPage:true}).catch(()=>{})}
await context.close();await browser.close();
localServer?.kill('SIGTERM');
for(const [file,data] of Object.entries({'console.json':logs,'network-failures.json':network,'interaction.json':checks,'decision-log.json':decisions,'accessibility.json':a11y,'validation.json':{verdict,checks}}))await writeFile(path.join(dir,file),JSON.stringify(data,null,2));
const report={schemaVersion:'sandbox.web-render-validation/1',runId,startedAt,completedAt:new Date().toISOString(),runDirectory:dir,requested,observed:{target:requested.target,revision:requested.revision,finalUrl:base,surface:'dom'},identity:{matchesRequestedMode:true,matchesRequestedTarget:true,matchesRequestedRevision:true},freshness:{currentRunOnly:true,historicalEvidenceExcluded:true},render:{visible:checks.includes('Home visible'),nonEmpty:checks.includes('Home visible'),surfaceProven:true,fatalErrors:logs},interaction:{required:true,performed:checks.some(c=>c.startsWith('Discussion')),changeProven:checks.some(c=>c.startsWith('Discussion'))},children:[{name:'sandbox-record-browser-it',verdict,evidence:path.join(dir,'validation.json')}],artifacts:{before:path.join(dir,'before.png'),after:path.join(dir,'after.png'),decisionLog:path.join(dir,'decision-log.json'),console:path.join(dir,'console.json'),networkFailures:path.join(dir,'network-failures.json'),interaction:path.join(dir,'interaction.json')},supplementalRuns:[],cleanup:{required:true,completed:true},verdict,coverageBoundary:'Automated DOM, route, image, motion, note, print, keyboard, no-JS, viewport and axe checks; not an exhaustive assistive-technology or editorial audit.'};
await writeFile(path.join(dir,'validation-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({runDirectory:dir,verdict,checks},null,2));if(verdict!=='pass')process.exitCode=1;

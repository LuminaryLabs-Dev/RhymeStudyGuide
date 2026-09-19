import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const require=createRequire(path.resolve(process.env.QA_MODULE_ROOT??'../browser-runtime','package.json'));
const {chromium}=require('playwright');
const {default:AxeBuilder}=require('@axe-core/playwright');
const pass=Number(process.env.QA_PASS??5),output=path.resolve(`validation/runs/fixed-reader/pass-${pass}`);
await mkdir(output,{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs']);
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
const browser=await chromium.launch({executablePath:process.env.QA_CHROMIUM_PATH??'/tmp/rhyme-browser-VOEnp8/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1536,height:1024}}),page=await context.newPage();
const base='http://127.0.0.1:4173/RhymeStudyGuide/',checks=[],errors=[],audits=[];
page.on('pageerror',e=>errors.push(e.message));
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const selected=()=>page.locator('[data-volume][aria-pressed=true]').getAttribute('data-volume');
async function capture(name){await page.waitForTimeout(600);await page.screenshot({path:path.join(output,name+'.png')});}
try{
 await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 check('Default volume is 01',await selected()==='0');
 check('Three.js atmosphere ready',await page.locator('html').getAttribute('data-webgl')==='ready');
 await capture('desktop');
 for(let i=0;i<12;i++){await page.locator(`[data-volume="${i}"]`).click();assert.equal(await selected(),String(i));assert.equal(await page.locator('[data-cover]:visible').getAttribute('data-cover'),String(i));assert.equal(await page.locator('.volume-panel:visible').getAttribute('id'),`volume-panel-${String(i+1).padStart(2,'0')}`);assert.ok(page.url().endsWith(`#volume-${String(i+1).padStart(2,'0')}`));}
 check('All 12 selections synchronize full cover, panel and URL',true);
 check('Last volume is bounded',await page.locator('[data-next]').isDisabled());
 await page.keyboard.press('Home');check('Keyboard Home and first boundary',await selected()==='0'&&await page.locator('[data-previous]').isDisabled());
 await page.keyboard.press('ArrowRight');check('Keyboard next',await selected()==='1');
 await page.goBack();check('Back restores selection',await selected()==='0');await page.goForward();check('Forward restores selection',await selected()==='1');
 await page.reload({waitUntil:'networkidle'});check('Refresh retains selection',await selected()==='1');
 for(const view of ['activities','resources','about','volumes']){await page.locator(`[data-view="${view}"]`).click();assert.equal(await page.locator('[data-scene]:visible').getAttribute('data-scene'),view);assert.equal(await page.evaluate(()=>scrollY),0);}
 check('All supporting views switch within fixed viewport',true);
 await page.locator('[data-chooser]').click();await page.locator('[data-choice="10"]').click();check('All volumes chooser selects directly',await selected()==='10'&&!await page.locator('dialog').isVisible());
 if(pass>=3){
  await page.mouse.move(100,250);await page.mouse.wheel(0,-140);await page.waitForFunction(()=>document.querySelector('[data-volume][aria-pressed=true]').dataset.volume==='9');check('Wheel selects previous',await selected()==='9');
  await page.waitForTimeout(800);
  await page.evaluate(async()=>{const surface=document.querySelector('.reader-shell');surface.dispatchEvent(new WheelEvent('wheel',{deltaY:-140,bubbles:true,cancelable:true}));for(let i=0;i<20;i++){await new Promise(resolve=>setTimeout(resolve,15));surface.dispatchEvent(new WheelEvent('wheel',{deltaY:-40,bubbles:true,cancelable:true}));}});
  check('Trackpad momentum advances once per gesture',await selected()==='8');
  await page.waitForTimeout(750);await page.mouse.wheel(0,140);await page.waitForFunction(()=>document.querySelector('[data-volume][aria-pressed=true]').dataset.volume==='9');check('New gesture selects next',await selected()==='9');
  const panel=await page.locator('.reading-panel').boundingBox();await page.mouse.move(panel.x+20,panel.y+20);await page.mouse.wheel(0,-500);check('Reading panel wheel does not select books',await selected()==='9');
  await page.waitForTimeout(550);check('Selected cover settles flat',await page.locator('[data-cover]:visible').evaluate(el=>getComputedStyle(el).transform==='none'));
 }
 await page.goto(base,{waitUntil:'networkidle'});
 await page.setViewportSize({width:390,height:844});await capture('mobile');
 if(pass>=4){
  for(const [width,height] of [[320,568],[390,844],[768,900],[1024,768],[1440,900],[1920,1080],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(550);
   check(`Viewport stays fixed at ${width}x${height}`,await page.evaluate(()=>document.documentElement.scrollHeight===innerHeight&&document.documentElement.scrollWidth===innerWidth));
   if(pass>=5)await capture(`viewport-${width}x${height}`);
   check(`Whole cover visible at ${width}x${height}`,await page.locator('[data-cover]:visible').evaluate(el=>{const r=el.getBoundingClientRect(),img=el.querySelector('img');return r.width>35&&r.height>45&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth&&getComputedStyle(img).objectFit==='contain'&&Math.abs(r.width/r.height-.75)<.025;}));
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-chooser]').click();await page.keyboard.press('Shift+Tab');check('Dialog traps focus',await page.locator('dialog').evaluate(el=>el.contains(document.activeElement)));await page.keyboard.press('Escape');check('Escape restores chooser focus',await page.locator('[data-chooser]').evaluate(el=>el===document.activeElement));
  await page.locator('[data-standard]').click();check('Standard layout can scroll',await page.locator('.standard-reading').isVisible()&&await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight));await page.locator('[data-return]').click();check('Visual layout restored',await page.locator('.reader-shell').isVisible()&&await page.evaluate(()=>scrollY===0));
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.dataset.motion==='off');await page.locator('[data-next]').click();check('Reduced motion selection is immediate',await page.locator('[data-cover]:visible').evaluate(el=>getComputedStyle(el).animationName==='none'));await page.emulateMedia({reducedMotion:'no-preference'});
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const tp=await touch.newPage();await tp.goto(base,{waitUntil:'networkidle'});const box=await tp.locator('.cover-stage').boundingBox();const cdp=await touch.newCDPSession(tp);let x=box.x+box.width*.7,y=box.y+box.height*.5;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=5;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-n*20,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});check('Real touch swipe selects next book',await tp.locator('[data-volume][aria-pressed=true]').getAttribute('data-volume')==='1');await touch.close();
 }
 if(pass>=5){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.volume-panel:visible summary').click();check('Read more expands and persists',await page.locator('.volume-panel:visible details').getAttribute('open')!==null);
  await page.locator('[data-next]').click();check('New selection closes expanded reading',await page.locator('.volume-panel:visible details').getAttribute('open')===null);
  await page.evaluate(()=>{for(const i of [5,2,11,3,8])document.querySelector(`[data-volume="${i}"]`).click();});await page.waitForTimeout(600);check('Rapid selections settle on latest book',await selected()==='8'&&await page.locator('[data-cover]:visible').getAttribute('data-cover')==='8'&&await page.locator('.departing-cover').count()===0);
  await page.goto(base+'#volume-99',{waitUntil:'networkidle'});check('Invalid deep link safely selects 01',await selected()==='0');
  const fallback=await browser.newContext();await fallback.route('**/assets/volumes/*.webp',route=>route.abort());await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:get.call(this,type,...args);};});const fp=await fallback.newPage();await fp.goto(base,{waitUntil:'networkidle'});await fp.locator('[data-next]').click();check('Image and WebGL failure preserve book selection',await fp.locator('[data-volume][aria-pressed=true]').getAttribute('data-volume')==='1'&&await fp.locator('html').getAttribute('data-webgl')==='fallback'&&await fp.locator('[data-cover]:visible img').evaluate(img=>img.dataset.fallback==='true'&&img.naturalWidth>0));await fallback.close();
  for(const [width,height] of [[1536,1024],[390,844]]){await page.setViewportSize({width,height});await page.goto(base,{waitUntil:'networkidle'});audits.push({width,violations:(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations});}
  check('Automated desktop and mobile accessibility checks',audits.every(a=>!a.violations.length));
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),np=await nojs.newPage();await np.goto(base);await np.locator('.standard-grid a').first().click();check('No-JavaScript companion links work',np.url().includes('/volumes/01/'));await nojs.close();
  const manifest=JSON.parse(await readFile('build-manifest.json','utf8'));for(const file of manifest.files){const response=await page.goto(base+file);assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,file);}check('All 40 static pages render on mobile',true);
  await page.goto(base+'discussion/');const old=await page.locator('.prompt-panel:visible h2').textContent();await page.locator('[data-next-prompt]').click();check('Discussion interaction retained',old!==await page.locator('.prompt-panel:visible h2').textContent());
  await page.goto(base+'study-guide/reading-practice/notice/');await page.getByLabel('What stayed with you?').fill('A detail worth revisiting.');await page.waitForTimeout(450);await page.reload();check('Reading notes retained',await page.getByLabel('What stayed with you?').inputValue()==='A detail worth revisiting.');
 }
 if(pass>=5){
  await page.setViewportSize({width:1536,height:1024});await page.goto(base,{waitUntil:'networkidle'});
  check('Three generated transparent clouds load',await page.locator('.cloud').evaluateAll(images=>images.length===3&&images.every(img=>img.complete&&img.naturalWidth>0)));check('Foreground atmosphere sits above the reader and passes clicks through',await page.locator('.foreground-atmosphere').evaluate(el=>getComputedStyle(el).zIndex==='20'&&getComputedStyle(el).pointerEvents==='none'));check('Desktop foreground flock has seven birds',await page.locator('.foreground-bird').evaluateAll(birds=>birds.filter(bird=>!bird.hidden).length===7));check('Bird rigs use separate body and wing parts',await page.locator('.foreground-bird').evaluateAll(birds=>birds.filter(bird=>bird.querySelectorAll('.bird-part').length===3).length===7));check('Birds stay upright with limited banking',await page.locator('.foreground-bird').evaluateAll(birds=>birds.filter(bird=>{const bank=parseFloat(getComputedStyle(bird).getPropertyValue('--bird-bank'));return Number.isFinite(bank)&&Math.abs(bank)<=.16&&Math.abs(Number(getComputedStyle(bird).getPropertyValue('--bird-facing')) )===1;}).length===7));
  const position=()=>page.locator('.cloud-bank').evaluate(el=>getComputedStyle(el).transform);
  const initial=await position();await page.waitForTimeout(350);check('Clouds drift while motion is enabled',initial!==await position());
  await page.locator('.motion-control').click();const paused=await position();await page.waitForTimeout(350);check('Pause motion freezes cloud position',paused===await position());
  await page.locator('.motion-control').click();
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  const hidden=await position();await page.waitForTimeout(350);check('Hidden document freezes clouds',hidden===await position());
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.dataset.motion==='off');
  check('Reduced motion pauses all cloud layers',await page.locator('.cloud').evaluateAll(images=>images.every(el=>getComputedStyle(el).animationPlayState==='paused')));
  await page.emulateMedia({reducedMotion:'no-preference'});await capture('atmosphere-desktop');
  check('Atmosphere cannot intercept reading controls',await page.locator('.world-art').evaluate(el=>getComputedStyle(el).pointerEvents==='none'));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
  check('Mobile reduces clouds to two layers',await page.locator('.cloud').evaluateAll(images=>images.filter(el=>getComputedStyle(el).display!=='none').length===2));check('Mobile foreground flock has four birds',await page.locator('.foreground-bird').evaluateAll(birds=>birds.filter(bird=>!bird.hidden).length===4));await capture('atmosphere-mobile');
 }
 check('No uncaught browser errors',errors.length===0);
}catch(error){errors.push(error.stack);await page.screenshot({path:path.join(output,'failure.png')});}
finally{await writeFile(path.join(output,'results.json'),JSON.stringify({passed:!errors.length,checks,errors,audits},null,2));await browser.close();server.kill();}
console.log(JSON.stringify({passed:!errors.length,checks,errors,output},null,2));if(errors.length)process.exitCode=1;

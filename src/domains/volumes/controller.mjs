import {bindSelectionInput} from './input.mjs';
import {mountForegroundAtmosphere} from '../atmosphere/foreground.mjs';
import {volumes} from './catalog.mjs';
import {ExplorerViewModel} from './view-model.mjs';
const root=document.documentElement;
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const vm=new ExplorerViewModel(volumes,location.hash);
const thumbs=$$('[data-volume]'),covers=$$('[data-cover]'),panels=$$('.volume-panel');
const dialog=$('dialog'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let active=-1,view='',settleTimer,world,worldPromise,foreground;
root.classList.add('js');
const syncVisibility=()=>{root.dataset.documentHidden=String(document.hidden);foreground?.setPaused(document.hidden||vm.state.motionOff||root.dataset.layout==='standard');};
document.addEventListener('visibilitychange',syncVisibility);syncVisibility();
function remember(){if(location.hash!==vm.hash)history.pushState(null,'',vm.hash);}
function select(index){if(vm.select(index))remember();}
function show(next){if(vm.show(next))remember();}
function centerThumb(index){const strip=$('.thumbnail-strip'),thumb=thumbs[index];strip.scrollTo({left:thumb.offsetLeft-strip.offsetLeft-(strip.clientWidth-thumb.clientWidth)/2,behavior:'instant'});}
vm.subscribe(state=>{
 const changed=active!==state.activeIndex;
 if(changed&&active>=0&&!state.motionOff){
  $$('.departing-cover').forEach(element=>element.remove());
  const previous=covers[active],rect=previous.getBoundingClientRect(),ghost=previous.cloneNode(true);
  ghost.removeAttribute('data-cover');ghost.className='departing-cover';ghost.setAttribute('aria-hidden','true');
  ghost.style.width=`${rect.width}px`;ghost.style.height=`${rect.height}px`;
  $('.cover-stage').append(ghost);ghost.addEventListener('animationend',()=>ghost.remove(),{once:true});
 }
 thumbs.forEach((thumb,i)=>thumb.setAttribute('aria-pressed',String(i===state.activeIndex)));
 covers.forEach((cover,i)=>cover.hidden=i!==state.activeIndex);
 panels.forEach((panel,i)=>{panel.hidden=i!==state.activeIndex;panel.querySelector('details').open=i===state.activeIndex&&state.expanded;});
 $('[data-position]').textContent=`Volume ${state.volume.number} of ${volumes.length}`;
 $('[data-previous]').disabled=!state.canPrevious;
 $('[data-next]').disabled=!state.canNext;
 $$('[data-scene]').forEach(scene=>scene.hidden=scene.dataset.scene!==state.view);
 $$('header [data-view]').forEach(link=>{if(link.dataset.view===state.view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 if(changed){
  active=state.activeIndex;
  for(const el of [covers[active],panels[active]]){el.classList.remove('is-entering');void el.offsetWidth;el.classList.add('is-entering');}
  $('[data-announcer]').textContent=`Volume ${state.volume.number} of ${volumes.length}. ${state.volume.focus}.`;
  $('[data-reading-panel]').scrollTop=0;
  requestAnimationFrame(()=>centerThumb(active));
  clearTimeout(settleTimer);settleTimer=setTimeout(()=>{covers[active].classList.remove('is-entering');panels[active].classList.remove('is-entering');vm.update({transition:'idle'});},500);
 }
 if(view!==state.view){view=state.view;root.dataset.currentView=view;}
});
thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>select(i)));
$('[data-previous]').addEventListener('click',()=>select(active-1));
$('[data-next]').addEventListener('click',()=>select(active+1));
$$('header [data-view]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();show(link.dataset.view);}));
$$('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(!detail.closest('[hidden]')&&detail.open!==vm.state.expanded)vm.update({expanded:detail.open});}));
function layout(standard){root.dataset.layout=standard?'standard':'visual';if(!standard)window.scrollTo(0,0);world?.setPaused(standard||vm.state.motionOff);foreground?.setPaused(standard||vm.state.motionOff);}
$('[data-standard]').addEventListener('click',event=>{event.preventDefault();history.pushState(null,'','#standard');layout(true);$('[data-return]').focus();});
$('[data-return]').addEventListener('click',()=>{layout(false);remember();$('[data-standard]').focus();});
function restore(){layout(location.hash==='#standard');vm.readHash(location.hash);}
addEventListener('popstate',restore);addEventListener('hashchange',restore);restore();
function closeChooser(){dialog.close();vm.update({chooserOpen:false});$('[data-chooser]').focus({preventScroll:true});}
$('[data-chooser]').addEventListener('click',()=>{vm.update({chooserOpen:true});dialog.showModal();$('[data-close-chooser]').focus();});
$('[data-close-chooser]').addEventListener('click',closeChooser);
dialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const items=[...dialog.querySelectorAll('button')],first=items[0],last=items.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeChooser();});
$$('[data-choice]').forEach(button=>button.addEventListener('click',()=>{select(Number(button.dataset.choice));closeChooser();}));
document.addEventListener('keydown',event=>{
 if(event.altKey||event.ctrlKey||event.metaKey||dialog.open||root.dataset.layout==='standard'||vm.state.view!=='volumes'||event.target.closest('details,input,textarea,select'))return;
 const next={ArrowRight:active+1,ArrowLeft:active-1,Home:0,End:volumes.length-1}[event.key];
 if(next!==undefined){event.preventDefault();select(next);}
});
const storage={get(){try{return localStorage.getItem('rhyme:motion')}catch{return null}},set(value){try{localStorage.setItem('rhyme:motion',value)}catch{}}};
async function motion(){
 const off=reduced.matches||storage.get()==='off';vm.update({motionOff:off});root.dataset.motion=off?'off':'on';
 const button=$('.motion-control');button.disabled=reduced.matches;button.setAttribute('aria-pressed',String(off));button.textContent=reduced.matches?'Reduced motion':off?'Enable motion':'Pause motion';
 if(!off&&!world){worldPromise??=import('../atmosphere/world-renderer.mjs').then(({mountWorld})=>mountWorld($('#world-canvas'))).catch(()=>{root.dataset.webgl='fallback';return null;});world=await worldPromise;}
 world?.setPaused(vm.state.motionOff||root.dataset.layout==='standard');foreground?.setPaused(vm.state.motionOff||root.dataset.layout==='standard'||document.hidden);
}
$('.motion-control').addEventListener('click',()=>{storage.set(vm.state.motionOff?'on':'off');motion();});
reduced.addEventListener('change',motion);motion();
$('.cover-stage').addEventListener('pointermove',event=>{if(!vm.state.motionOff&&event.pointerType==='mouse')world?.setPointer((event.clientX/innerWidth-.5)*.5,(event.clientY/innerHeight-.5)*.5);});
$('.cover-stage').addEventListener('pointerleave',()=>world?.setPointer(0,0));
$$('img').forEach(img=>{const fallback=()=>{if(img.dataset.fallback)return;img.dataset.fallback='true';img.src=new URL('assets/world/fallback.svg',document.baseURI).href;};img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});
addEventListener('resize',()=>centerThumb(active));
bindSelectionInput({surface:$('.reader-shell'),enabled:()=>vm.state.view==='volumes'&&!vm.state.chooserOpen&&root.dataset.layout!=='standard',step:delta=>select(active+delta)});
foreground=mountForegroundAtmosphere($('.foreground-atmosphere'));foreground.setPaused(vm.state.motionOff||root.dataset.layout==='standard'||document.hidden);root.dataset.explorer='ready';

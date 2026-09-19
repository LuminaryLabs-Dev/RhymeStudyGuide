// Progressive enhancement only: the complete reading content is already in HTML.
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const storage = {
    read(key){try{return localStorage.getItem(`rhyme:${key}`)}catch{return null}},
    write(key,value){try{localStorage.setItem(`rhyme:${key}`,value);return true}catch{return false}},
    remove(key){try{localStorage.removeItem(`rhyme:${key}`);return true}catch{return false}}
  };
  let motionOff = reduced.matches || storage.read('motion') === 'off';
  const motionButton = document.querySelector('[data-motion-toggle]');
  function applyMotion(){
    document.documentElement.dataset.motion = motionOff?'off':'on';
    motionButton?.setAttribute('aria-pressed',String(motionOff));
    if(motionButton)motionButton.textContent = motionOff?'Motion: off':'Motion: on';
    document.querySelectorAll('.scene-layer').forEach(el=>el.style.translate='0px 0px');
  }
  applyMotion();
  motionButton?.addEventListener('click',()=>{motionOff=!motionOff;storage.write('motion',motionOff?'off':'on');applyMotion()});
  reduced.addEventListener('change',()=>{motionOff=reduced.matches||storage.read('motion')==='off';applyMotion()});
  function animate(el,name){if(motionOff||reduced.matches)return;el.classList.remove(name);void el.offsetWidth;el.classList.add(name)}
  // Never permanently hide sections. Observed elements animate on arrival, even if JS later fails.
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animate(entry.target,'reveal-enter');observer.unobserve(entry.target)}}),{threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  }
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#primary-nav');
  const setMenu=open=>{menu?.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open)};
  menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))setMenu(false)});
  matchMedia('(max-width:760px)').addEventListener('change',()=>setMenu(false));
  document.querySelectorAll('details[data-question]').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)animate(detail.querySelector('.question-answer'),'answer-enter')}));
  const panels=[...document.querySelectorAll('[data-prompt-panel]')],tabs=[...document.querySelectorAll('[data-prompt-index]')];
  let promptIndex=0;
  function showPrompt(i){promptIndex=(i+panels.length)%panels.length;panels.forEach((p,n)=>{p.hidden=n!==promptIndex;if(n===promptIndex)animate(p,'prompt-enter')});tabs.forEach((t,n)=>t.setAttribute('aria-pressed',String(n===promptIndex)))}
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>showPrompt(i)));
  document.querySelector('[data-next-prompt]')?.addEventListener('click',()=>showPrompt(promptIndex+1));
  const note=document.querySelector('[data-note]'),status=document.querySelector('[data-note-status]');
  if(note){
    const key=`note:${note.dataset.note}`;
    note.value=storage.read(key)??'';
    let timer;
    const save=()=>{const saved=storage.write(key,note.value);status.textContent=saved?'Saved on this device.':'Storage unavailable. Copy your note before leaving.'};
    note.addEventListener('input',()=>{clearTimeout(timer);status.textContent='Saving…';timer=setTimeout(save,350)});
    window.addEventListener('pagehide',()=>{if(timer){clearTimeout(timer);save()}});
    document.querySelector('[data-clear-note]')?.addEventListener('click',()=>{if(note.value&&!window.confirm('Clear this note from this browser?'))return;clearTimeout(timer);if(storage.remove(key)){note.value='';status.textContent='Note cleared.'}else{status.textContent='Could not clear stored note. Browser storage is unavailable.'}note.focus()});
  }
  document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
  let openDetails=[];
  window.addEventListener('beforeprint',()=>{openDetails=[...document.querySelectorAll('details:not([open])')];openDetails.forEach(d=>d.open=true)});
  window.addEventListener('afterprint',()=>openDetails.forEach(d=>d.open=false));
  // Bounded pointer + scroll parallax. No continuous loop, scroll capture, or hover-only content.
  const scene=document.querySelector('.book-scene');
  if(scene){
    const fine=matchMedia('(pointer:fine)');let pending=false,px=0,py=0;
    const render=()=>{pending=false;if(motionOff||reduced.matches)return;const rect=scene.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;const scroll=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));scene.querySelectorAll('[data-depth]').forEach(layer=>{const depth=Number(layer.dataset.depth);layer.style.translate=`${px*depth}px ${py*depth+scroll*depth}px`})};
    const request=()=>{if(!pending){pending=true;requestAnimationFrame(render)}};
    scene.parentElement.addEventListener('pointermove',e=>{if(!fine.matches||motionOff)return;const r=scene.getBoundingClientRect();px=Math.max(-.65,Math.min(.65,(e.clientX-r.left)/r.width-.5));py=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));request()},{passive:true});
    scene.parentElement.addEventListener('pointerleave',()=>{px=py=0;request()});
    addEventListener('scroll',request,{passive:true});
  }
})();

import {flockPath} from './flock-path.mjs';

const birdCount=7;

function birdMarkup(index,link){
 return `<div class="foreground-bird" data-bird="${index}"><img class="bird-part bird-wing bird-wing-left" src="${link('assets/world/bird-wing-left.png')}" alt="" decoding="async"><img class="bird-part bird-body" src="${link('assets/world/bird-body.png')}" alt="" decoding="async"><img class="bird-part bird-wing bird-wing-right" src="${link('assets/world/bird-wing-right.png')}" alt="" decoding="async"></div>`;
}

export function mountForegroundAtmosphere(element){
 let stopped=false,raf=0,last=performance.now(),elapsed=0;
 const birds=[...element.querySelectorAll('[data-bird]')];
 const render=()=>{
  const narrow=innerWidth<700,count=narrow?4:birdCount;
  birds.forEach((bird,index)=>{
   bird.hidden=index>=count;
   if(bird.hidden)return;
   const pose=flockPath(elapsed,index),x=50+pose.x*44,y=12+pose.y*22;
   bird.style.setProperty('--bird-x',`${x}%`);
   bird.style.setProperty('--bird-y',`${y}%`);
   bird.style.setProperty('--bird-scale',narrow?.42:.62);
   bird.style.setProperty('--bird-angle',`${pose.angle}rad`);
   bird.style.setProperty('--wing-flap',`${pose.wing}rad`);
  });
 };
 const frame=now=>{raf=0;if(stopped||document.hidden)return;elapsed+=Math.min((now-last)/1000,.07);last=now;render();raf=requestAnimationFrame(frame);};
 const schedule=()=>{cancelAnimationFrame(raf);raf=0;if(!stopped&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}};
 const resize=()=>render();
 addEventListener('resize',resize);render();schedule();
 return {setPaused(value){stopped=value;if(stopped){cancelAnimationFrame(raf);raf=0;render();}else schedule();element.dataset.paused=String(stopped);},dispose(){stopped=true;cancelAnimationFrame(raf);removeEventListener('resize',resize);}};
}

export function renderForegroundAtmosphere(link){
 return `<div class="foreground-atmosphere" aria-hidden="true"><div class="cloud-layers">${['bank','wisp','cluster'].map(name=>`<img class="cloud cloud-${name}" src="${link(`assets/world/cloud-${name}.webp`)}" alt="" decoding="async">`).join('')}</div><div class="foreground-birds">${Array.from({length:birdCount},(_,index)=>birdMarkup(index,link)).join('')}</div></div>`;
}

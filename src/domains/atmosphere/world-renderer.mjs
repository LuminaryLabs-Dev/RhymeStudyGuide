import * as THREE from 'three';
import {createWorldScene} from './world.mjs';
export function mountWorld(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x061726,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const world=createWorldScene();let paused=false,visible=true,raf=0,last=0,elapsed=0,px=0,py=0,disposed=false;
 const resize=()=>{const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);world.camera.aspect=rect.width/rect.height;world.camera.updateProjectionMatrix();renderStill();};
 function renderStill(){world.update(elapsed,px,py);renderer.render(world.scene,world.camera);}
 function frame(now){raf=0;if(disposed||paused||!visible||document.hidden)return;if(now-last>32){elapsed+=Math.min((now-last)/1000,.07);last=now;renderStill();}raf=requestAnimationFrame(frame);}
 function schedule(){cancelAnimationFrame(raf);raf=0;if(!disposed&&!paused&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}}
 const ro=new ResizeObserver(resize);ro.observe(canvas);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});io.observe(canvas);
 const visibility=()=>schedule();document.addEventListener('visibilitychange',visibility);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;cancelAnimationFrame(raf);document.documentElement.dataset.webgl='fallback';});canvas.addEventListener('webglcontextrestored',()=>{paused=document.documentElement.dataset.motion==='off';resize();schedule();document.documentElement.dataset.webgl='ready';});
 resize();schedule();document.documentElement.dataset.webgl='ready';
 return{setPaused(value){paused=value;if(paused){cancelAnimationFrame(raf);raf=0;renderStill();}else schedule();},setPointer(x,y){px=x;py=y;},dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);world.dispose();renderer.dispose();}};
}

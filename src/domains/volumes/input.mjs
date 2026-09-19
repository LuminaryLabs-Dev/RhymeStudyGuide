// A wheel burst is one deliberate selection. A quiet gap releases its momentum lock.
export class WheelSelection {
 constructor(){this.reset();}
 reset(){this.total=0;this.last=-Infinity;this.locked=false;this.selectedAt=-Infinity;}
 feed(delta,time){
  if(time-this.last>220&&time-this.selectedAt>650){this.total=0;this.locked=false;}
  this.last=time;
  if(this.locked||!delta)return 0;
  if(Math.sign(delta)!==Math.sign(this.total))this.total=0;
  this.total+=delta;
  if(Math.abs(this.total)<70)return 0;
  this.locked=true;this.selectedAt=time;return Math.sign(this.total);
 }
}
export function bindSelectionInput({surface,enabled,step}){
 const wheel=new WheelSelection();
 const excluded=target=>target.closest('.reading-panel,.thumbnail-strip,header,footer,dialog,details,input,textarea,select,a,button');
 surface.addEventListener('wheel',event=>{
  if(!enabled()||event.ctrlKey||event.metaKey||excluded(event.target))return;
  event.preventDefault();
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  const direction=wheel.feed(delta,performance.now());if(direction)step(direction);
 },{passive:false});
 const stage=surface.querySelector('.cover-stage');let start=null;
 stage.addEventListener('touchstart',event=>{
  start=enabled()&&event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;
 },{passive:true});
 stage.addEventListener('touchmove',event=>{if(event.touches.length!==1)start=null;},{passive:true});
 stage.addEventListener('touchend',event=>{
  if(!start||!enabled())return;
  const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;start=null;
  const distance=Math.abs(dx)>Math.abs(dy)?dx:dy;if(Math.abs(distance)>45)step(distance<0?1:-1);
 },{passive:true});
 stage.addEventListener('touchcancel',()=>start=null,{passive:true});
}

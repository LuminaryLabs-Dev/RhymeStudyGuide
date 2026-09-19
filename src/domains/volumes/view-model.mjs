const views=new Set(['volumes','activities','resources','about']);
export class ExplorerViewModel {
 constructor(volumes,hash='') {
  this.volumes=volumes;
  this.listeners=new Set();
  this.state={activeIndex:0,view:'volumes',expanded:false,transition:'idle',motionOff:false,chooserOpen:false};
  this.readHash(hash);
 }
 snapshot(){return {...this.state,volume:this.volumes[this.state.activeIndex],canPrevious:this.state.activeIndex>0,canNext:this.state.activeIndex<this.volumes.length-1};}
 subscribe(fn){this.listeners.add(fn);fn(this.snapshot());return()=>this.listeners.delete(fn);}
 update(patch){this.state={...this.state,...patch};this.listeners.forEach(fn=>fn(this.snapshot()));}
 select(index){
  if(!Number.isInteger(index)||index<0||index>=this.volumes.length)return false;
  this.update({activeIndex:index,view:'volumes',expanded:false,transition:this.state.motionOff?'idle':'entering'});
  return true;
 }
 step(delta){return this.select(this.state.activeIndex+delta);}
 show(view){if(!views.has(view))return false;this.update({view,expanded:false});return true;}
 readHash(hash){
  const match=/^#volume-(\d{2})$/.exec(hash);
  if(match){if(!this.select(Number(match[1])-1))this.select(0);}
  else if(views.has(hash.slice(1)))this.show(hash.slice(1));
  else if(!hash||hash.startsWith('#volume-'))this.select(0);
 }
 get hash(){return this.state.view==='volumes'?`#volume-${this.volumes[this.state.activeIndex].number}`:`#${this.state.view}`;}
}
export const prepareVolumes=(volumes,link)=>volumes.map(v=>({...v,href:link(v.route),activityHref:link(v.activity),cover:link(v.coverImage),smallCover:link(v.thumbnail)}));

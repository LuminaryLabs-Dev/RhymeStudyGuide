export class ExplorerViewModel {
 constructor(volumes,hash=''){this.volumes=volumes;this.listeners=new Set();this.state={activeIndex:10,panelOpen:true,menuOpen:false,motionOff:false,dragging:false};this.readHash(hash);}
 subscribe(fn){this.listeners.add(fn);fn(this.snapshot());return()=>this.listeners.delete(fn);}
 snapshot(){return {...this.state,volume:this.volumes[this.state.activeIndex],canPrevious:this.state.activeIndex>0,canNext:this.state.activeIndex<this.volumes.length-1};}
 update(patch){this.state={...this.state,...patch};this.listeners.forEach(fn=>fn(this.snapshot()));}
 select(index){if(!Number.isInteger(index)||index<0||index>=this.volumes.length)return false;this.update({activeIndex:index,panelOpen:true});return true;}
 step(delta){return this.select(this.state.activeIndex+delta);}
 readHash(hash){const match=/^#volume-(\d{2})$/.exec(hash);if(match){if(!this.select(Number(match[1])-1))this.select(10);}else if(!hash||hash.startsWith('#volume-'))this.select(10);}
 get hash(){return `#volume-${this.volumes[this.state.activeIndex].number}`;}
}
export const prepareVolumes=(volumes,link)=>volumes.map(v=>({...v,href:link(v.route),activityHref:link(v.activity),cover:link(v.coverImage),smallCover:link(v.thumbnail)}));

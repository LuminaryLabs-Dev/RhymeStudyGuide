import * as THREE from 'three';
// Closed cubic Bézier oval: matching endpoint tangents prevent a visible loop seam.
const upper=new THREE.CubicBezierCurve3(new THREE.Vector3(-.78,.5,0),new THREE.Vector3(-.78,.83,0),new THREE.Vector3(.78,.83,0),new THREE.Vector3(.78,.5,0));
const lower=new THREE.CubicBezierCurve3(new THREE.Vector3(.78,.5,0),new THREE.Vector3(.78,.17,0),new THREE.Vector3(-.78,.17,0),new THREE.Vector3(-.78,.5,0));
export const FLOCK_PERIOD=60;
export function flockPose(time,index){
 const phase=((time/FLOCK_PERIOD+.28-index*.008)%1+1)%1,curve=phase<.5?upper:lower,t=(phase% .5)*2;
 const position=curve.getPoint(t);
 const tangent=new THREE.Vector3().subVectors(curve.v1,curve.v0).multiplyScalar(3*(1-t)**2)
  .addScaledVector(new THREE.Vector3().subVectors(curve.v2,curve.v1),6*(1-t)*t)
  .addScaledVector(new THREE.Vector3().subVectors(curve.v3,curve.v2),3*t*t).normalize();
 // Cohesion follows the shared path; alternating lateral slots preserve separation.
 const side=index===0?0:(index%2?1:-1)*(.024+Math.floor(index/2)*.018);
 position.x+=-tangent.y*side;position.y+=tangent.x*side;
 return {position,tangent,wing:Math.sin(time*Math.PI*2*1.4+index*.8)*.65};
}
export function createFlock(){
 const group=new THREE.Group();group.name='sky-flock';
 const material=new THREE.MeshBasicMaterial({color:0x031626,side:THREE.DoubleSide});
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.17,.065,0,.085,-.025,0],3));geometry.computeVertexNormals();
 const birds=Array.from({length:7},(_,index)=>{
  const bird=new THREE.Group();bird.name=`bird-${index}`;
  const left=new THREE.Mesh(geometry,material),right=new THREE.Mesh(geometry,material);left.scale.x=-1;
  bird.add(left,right);group.add(bird);return {bird,left,right};
 });
 function update(time,aspect){
  const mobile=aspect<.9,count=mobile?4:7,halfHeight=Math.tan(THREE.MathUtils.degToRad(19))*15;
  birds.forEach(({bird,left,right},index)=>{
   bird.visible=index<count;if(!bird.visible)return;
   const pose=flockPose(time,index);
   bird.position.set(pose.position.x*halfHeight*aspect,pose.position.y*2.1+1.8,0);
   bird.rotation.z=Math.atan2(pose.tangent.y*.3,pose.tangent.x);
   bird.scale.setScalar(mobile?.42:.62);
   left.rotation.x=pose.wing;right.rotation.x=-pose.wing;
  });
 }
 return {group,update};
}

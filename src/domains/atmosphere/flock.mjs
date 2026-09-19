import * as THREE from 'three';
import {flockPath,flockOrientation,FLOCK_PERIOD} from './flock-path.mjs';
export {FLOCK_PERIOD};
export function flockPose(time,index){const pose=flockPath(time,index),orientation=flockOrientation(pose.angle);return{position:new THREE.Vector3(pose.x,pose.y,0),tangent:new THREE.Vector3(Math.cos(pose.angle),Math.sin(pose.angle),0),facing:orientation.facing,bank:orientation.bank,wing:pose.wing};}
export function createFlock(){
 const group=new THREE.Group();group.name='sky-flock';const material=new THREE.MeshBasicMaterial({color:0x031626,side:THREE.DoubleSide});const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.17,.065,0,.085,-.025,0],3));geometry.computeVertexNormals();
 const birds=Array.from({length:7},(_,index)=>{const bird=new THREE.Group();bird.name=`bird-${index}`;const left=new THREE.Mesh(geometry,material),right=new THREE.Mesh(geometry,material);left.scale.x=-1;bird.add(left,right);group.add(bird);return{bird,left,right};});
 function update(time,aspect){const mobile=aspect<.9,count=mobile?4:7,halfHeight=Math.tan(THREE.MathUtils.degToRad(19))*15;birds.forEach(({bird,left,right},index)=>{bird.visible=index<count;if(!bird.visible)return;const pose=flockPose(time,index),scale=mobile?.42:.62;bird.position.set(pose.position.x*halfHeight*aspect,pose.position.y*2.1+1.8,0);bird.rotation.z=pose.bank;bird.scale.set(pose.facing*scale,scale,scale);left.rotation.x=pose.wing;right.rotation.x=-pose.wing;});}
 return{group,update};
}

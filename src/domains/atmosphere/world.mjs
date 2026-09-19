import * as THREE from 'three';
// Shared production scene: imported by browser and native headless validation.
export function createWorldScene(aspect=1.5){
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,aspect,.1,100);camera.position.set(0,0,15);
 const root=new THREE.Group();scene.add(root);
 const steps=new Uint8Array([75,150,235,255]);const gradient=new THREE.DataTexture(steps,4,1,THREE.RedFormat);gradient.needsUpdate=true;gradient.minFilter=gradient.magFilter=THREE.NearestFilter;
 const paper=new THREE.MeshToonMaterial({color:0xf1dfb5,gradientMap:gradient,side:THREE.DoubleSide});
 const ink=new THREE.MeshBasicMaterial({color:0x314352,side:THREE.DoubleSide});
 const pages=[];
 const positions=[[-.3,3.6,-1,.28],[3.0,3.0,-.5,-.32],[5.6,1.5,-2,.32],[-1.1,1.6,-.6,-.24]];
 for(let i=0;i<positions.length;i++){
  const [x,y,z,angle]=positions[i];const group=new THREE.Group();const geometry=new THREE.PlaneGeometry(.45,.72,8,12);const p=geometry.attributes.position;for(let k=0;k<p.count;k++)p.setZ(k,Math.sin(p.getY(k)*5+i)*.055);p.needsUpdate=true;geometry.computeVertexNormals();group.add(new THREE.Mesh(geometry,paper));
  for(let line=0;line<11;line++){const stroke=new THREE.Mesh(new THREE.PlaneGeometry(line===10?.18:.32,.006),ink);stroke.position.set(-.015,.22-line*.034,.065);group.add(stroke);}
  group.position.set(x,y,z);group.rotation.set(.08,angle,angle);group.userData={x,y,z,angle,index:i};root.add(group);pages.push(group);
 }
 const star=new THREE.Group();const gold=new THREE.MeshToonMaterial({color:0xd8b25b,gradientMap:gradient});
 for(let i=0;i<8;i++){const shape=new THREE.ConeGeometry(i%2?.037:.055,i%2?.3:.58,3);const mesh=new THREE.Mesh(shape,gold);const angle=i*Math.PI/4;mesh.rotation.z=-angle;mesh.position.set(Math.sin(angle)*(i%2?.13:.22),Math.cos(angle)*(i%2?.13:.22),0);star.add(mesh);}
 star.position.set(5,3.55,-1);root.add(star);
 const rand=(()=>{let n=814;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};})();
 const positionsArray=new Float32Array(60*3);for(let i=0;i<60;i++){positionsArray[i*3]=(rand()-.2)*13;positionsArray[i*3+1]=(rand()-.4)*10;positionsArray[i*3+2]=-rand()*5;}
 const particlesGeometry=new THREE.BufferGeometry();particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positionsArray,3));const particles=new THREE.Points(particlesGeometry,new THREE.PointsMaterial({color:0xd4bd82,size:.017,transparent:true,opacity:.45,depthWrite:false}));root.add(particles);
 scene.add(new THREE.AmbientLight(0xb4c9e0,2.1));const key=new THREE.DirectionalLight(0xffe4b5,3);key.position.set(-3,6,9);scene.add(key);
 function update(time=0,x=0,y=0){pages.forEach(p=>{const b=p.userData;p.position.y=b.y+Math.sin(time*.28+b.index)*.11;p.position.x=b.x+Math.cos(time*.17+b.index)*.06;p.rotation.y=b.angle+Math.sin(time*.22+b.index)*.12;p.rotation.z=b.angle+Math.sin(time*.18+b.index)*.035;});star.rotation.z=time*.015;star.rotation.y=Math.sin(time*.17)*.12;particles.rotation.z=time*.002;root.position.x=x*.15;root.position.y=-y*.1;}
 update(0);return{scene,camera,update,dispose(){scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});gradient.dispose();}};
}

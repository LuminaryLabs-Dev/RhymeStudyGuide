import test from 'node:test';
import assert from 'node:assert/strict';
import {flockPose,FLOCK_PERIOD,createFlock} from '../src/domains/atmosphere/flock.mjs';
test('flock loop closes with continuous position, heading and wingbeat',()=>{
 for(let i=0;i<7;i++){
  const a=flockPose(0,i),b=flockPose(FLOCK_PERIOD,i);
  assert.ok(a.position.distanceTo(b.position)<1e-9);assert.ok(a.tangent.distanceTo(b.tangent)<1e-9);assert.ok(Math.abs(a.wing-b.wing)<1e-9);
  const before=flockPose(FLOCK_PERIOD-.001,i),after=flockPose(.001,i);
  assert.ok(before.position.distanceTo(after.position)<.001);assert.ok(before.tangent.distanceTo(after.tangent)<.001);
 }
});
test('flock preserves separation and uses fewer visible birds on mobile',()=>{
 const flock=createFlock();flock.update(0,1.5);assert.equal(flock.group.children.filter(b=>b.visible).length,7);flock.update(0,.46);assert.equal(flock.group.children.filter(b=>b.visible).length,4);
 for(let t=0;t<60;t+=.5){const poses=Array.from({length:7},(_,i)=>flockPose(t,i));for(let i=0;i<7;i++)for(let j=i+1;j<7;j++)assert.ok(poses[i].position.distanceTo(poses[j].position)>.012);}
});

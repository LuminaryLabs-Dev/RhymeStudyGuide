// Pure path math shared by the foreground SVG flock and the native Three.js flock.
const upper=[[-.78,.5],[-.78,.83],[.78,.83],[.78,.5]];
const lower=[[.78,.5],[.78,.17],[-.78,.17],[-.78,.5]];
export const FLOCK_PERIOD=60;
function cubic(points,t){const u=1-t;return{x:u**3*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t**3*points[3][0],y:u**3*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t**3*points[3][1]};}
function tangent(points,t){const u=1-t;return{x:3*u*u*(points[1][0]-points[0][0])+6*u*t*(points[2][0]-points[1][0])+3*t*t*(points[3][0]-points[2][0]),y:3*u*u*(points[1][1]-points[0][1])+6*u*t*(points[2][1]-points[1][1])+3*t*t*(points[3][1]-points[2][1])};}
export function flockPath(time,index=0){const phase=((time/FLOCK_PERIOD+.28-index*.008)%1+1)%1,points=phase<.5?upper:lower,t=(phase% .5)*2,position=cubic(points,t),raw=tangent(points,t),length=Math.hypot(raw.x,raw.y)||1,direction={x:raw.x/length,y:raw.y/length},side=index===0?0:(index%2?1:-1)*(.024+Math.floor(index/2)*.018);return{x:position.x-direction.y*side,y:position.y+direction.x*side,angle:Math.atan2(direction.y,direction.x),wing:Math.sin(time*Math.PI*2*1.4+index*.8)*.65};}

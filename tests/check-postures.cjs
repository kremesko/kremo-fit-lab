const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/app.js','utf8');
const math=source.slice(source.indexOf('const dist='),source.indexOf('const svgNS='));
const geometry=source.slice(source.indexOf('function bikeGeometry('),source.indexOf('function dimension('));
const {model,posturePreset,riderCOM}=new Function('rad',math+geometry+';return {model,posturePreset,riderCOM};')(d=>d*Math.PI/180);
const g={reach:513,stack:644,seat:500,chain:437,wheelbase:1265,head:140,top:666,ha:66,sa:77,drop:35,bbheight:339,actualsa:72,rake:41};
const b={thigh:43,shin:43,torso:56,upper:32,fore:27,hand:8,foot:12,shoulders:50};
const s={saddle:730,offset:0,gripx:25,gripy:70,crank:175,lean:45,hipx:-50,hipy:700,barwidth:760,gripinset:60,pose:'seated'};
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0)),eq=(a,b)=>assert.ok(Math.abs(a-b)<1e-6);
const seated=model(g,b,s,270);
for(const pose of ['neutral','aggressive','manual']){
 const p=posturePreset(g,b,s,pose),m=model(g,b,p,37);
 assert.ok(m.knee&&m.knee2&&m.elbow,pose+' contacts must be reachable');
 eq(d(m.hip,m.knee),430);eq(d(m.knee,m.ankle),430);eq(d(m.hip,m.knee2),430);eq(d(m.knee2,m.ankle2),430);eq(d(m.shoulder,m.elbow),320);eq(d(m.elbow,m.wrist),270);
 eq(m.saddle.x,seated.saddle.x);eq(m.saddle.y,seated.saddle.y);eq(m.pedal.y,0);eq(m.pedal2.y,0);assert.notDeepEqual(m.hip,m.saddle);
 if(pose==='manual')assert.ok(Math.abs(m.hip.x+435.596143233615)<180);
 console.log('PASS',pose,'hip',Math.round(m.hip.x),Math.round(m.hip.y),'lean',p.lean);
}
const seatedCOM=riderCOM(seated,b);assert.ok(seatedCOM&&Number.isFinite(seatedCOM.x));
const manualState=model(g,b,posturePreset(g,b,s,'manual'),0),manualCOM=riderCOM(manualState,b);assert.ok(manualCOM.x<seatedCOM.x);
assert.equal(riderCOM({...manualState,knee:null},b),null);
const translated=Object.fromEntries(Object.entries(manualState).map(([key,p])=>[key,p&&typeof p==='object'&&'x' in p?{...p,x:p.x+100,y:p.y+200}:p]));
const shiftedCOM=riderCOM(translated,b);eq(shiftedCOM.x,manualCOM.x+100);eq(shiftedCOM.y,manualCOM.y+200);
console.log('PASS COM: finite, follows manual posture, translation invariant, hidden for invalid geometry.');

const narrow=model(g,b,{...s,barwidth:620},270),wide=model(g,b,{...s,barwidth:900},270);
assert.ok(d(wide.shoulder,wide.wrist)>d(narrow.shoulder,narrow.wrist));
assert.ok(wide.elbow);eq(d(wide.shoulder,wide.elbow),320);eq(d(wide.elbow,wide.wrist),270);
eq(model(g,b,s,270).grip.z,320);eq(model(g,b,s,270).shoulder.z,250);
console.log('PASS arm width: 760 mm end-to-end, 640 mm grip centres, 70 mm lateral reach per arm; 3D lengths preserved.');

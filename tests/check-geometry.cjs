const fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/app.js','utf8');
const piece=source.slice(source.indexOf('function bikeGeometry('),source.indexOf('function dimension('));
const geometry=new Function('rad',piece+';return bikeGeometry;')(d=>d*Math.PI/180);
const g={reach:513,stack:644,seat:500,chain:437,wheelbase:1265,head:140,top:666,ha:66,sa:77,drop:35,bbheight:339,actualsa:72,rake:41};
const q=geometry(g),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),eq=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
eq(q.front.x-q.rear.x,1265);eq(distance(q.rear,q.bb),437);eq(distance(q.ht,q.hb),140);eq(distance(q.bb,q.collar),500);eq(q.ht.x,513);eq(q.ht.y,644);eq(q.ht.x-q.seatRef.x,666);eq(q.rear.y-q.ground,374);eq(q.bb.y-q.ground,339);eq(Math.atan2(q.crown.y-q.forkEnd.y,q.forkEnd.x-q.crown.x)*180/Math.PI,66);
const before=geometry(g),after=geometry({...g,reach:550});eq(after.ht.x-before.ht.x,37);eq(after.front.x-before.front.x,0);
console.log('PASS: scale, wheelbase, chainstay, head tube, seat length, reach, stack, ETT, BB height, wheel diameter and fork angle.');


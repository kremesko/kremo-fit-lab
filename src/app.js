(() => {
'use strict';
const $=id=>document.getElementById(id), rad=d=>d*Math.PI/180;
let bike='izzo';
const catalog={laufey:{name:'Orbea Laufey H30',sizes:['S','M','L','XL'],source:''},izzo:{name:'YT IZZO · 2021',sizes:['S','M','L','XL','XXL'],source:'https://geometrics.mtb-news.de/bike/yt-industries-izzo-core-2021.338'},neuron:{name:'Canyon Neuron 6 · produkt 4004',sizes:['XS','S','M','L','XL'],source:'https://www.canyon.com/en-de/productpdf/geometry/?pid=4004'}};
let sizes=catalog.izzo.sizes;
const laufeyData={reach:[409,435,459,484],stack:[632,636,645,664],seat:[381,432,470,521],head:[95,100,110,130],top:[578,606,632,662],wheelbase:[1146,1174,1202,1235],stand:[678,714,726,763]};
const neuronData={reach:[410,430,455,480,510],stack:[587,596,626,639,656],seat:[390,390,425,460,500],chain:[430,430,440,440,440],wheelbase:[1139,1164,1203,1234,1271],head:[90,100,110,125,143],top:[556,579,611,639,674],stand:[756,760,760,766,772],drop:[18,18,38,38,38]};
const data={reach:[429,450,472,492,513],stack:[603,612,621,635,644],seat:[400,425,450,475,500],chain:[432,432,432,437,437],wheelbase:[1158,1183,1209,1240,1265],head:[95,105,115,130,140],top:[566,591,616,641,666],stand:[734,727,721,716,734]};
const body=[['height','Výška',130,220,'naboso'],['inseam','Rozkrok',50,110,'podlaha–rozkrok'],['thigh','Stehno',25,65,'bedro–koleno'],['shin','Predkolenie',25,65,'koleno–členok'],['torso','Trup',30,80,'bedro–rameno'],['upper','Rameno',18,48,'rameno–lakeť'],['fore','Predlaktie',15,40,'lakeť–zápästie'],['hand','Zápästie–úchop',3,18,'po os držania'],['foot','Členok–pedál',4,25,'bočná vzdialenosť'],['shoulders','Šírka ramien',25,70,'medzi stredmi ramenných kĺbov']];
const geo=[['reach','Reach',300,650],['stack','Stack',400,850],['seat','Sedlová trubka',250,650],['chain','Reťazová vzpera',350,550],['wheelbase','Rázvor',950,1500],['head','Hlavová trubka',70,200],['ha','Hlavový uhol °',60,75],['sa','Efektívny sedlový uhol °',65,85],['drop','BB drop',0,70],['top','Efektívna horná trubka',400,850],['stand','Standover',500,950],['bbheight','Výška stredu nad zemou',250,400],['actualsa','Skutočný sklon sedlovky °',60,85],['rake','Offset vidlice',30,65],['rimradius','Polomer ráfika (referenčný)',270,330]];
const setup=[['saddle','Výška sedla',500,950,730,'mm'],['offset','Posun sedla',-50,50,0,'mm'],['gripx','Dosah úchopu od hlavovej trubky',-20,120,25,'mm'],['gripy','Výška úchopu nad hlavovou trubkou',20,150,70,'mm'],['crank','Dĺžka kľúk',150,180,175,'mm'],['lean','Sklon trupu voči bajku',10,80,45,'°'],['hipx','Panva: dopredu / dozadu',-800,250,-50,'mm'],['hipy','Panva: výška nad stredom',200,1100,700,'mm'],['barwidth','Šírka riadidiel: koniec–koniec',500,900,760,'mm'],['gripinset','Stred dlane od konca riadidiel',0,100,60,'mm'],['footpitch','Sklon chodidla: + špička hore',-20,20,0,'°'],['anklerise','Členok nad osou pedála',30,100,65,'mm'],['refmin','Referencia kolena: od',10,50,25,'°'],['refmax','Referencia kolena: do',10,50,30,'°'],['bikepitch','Sklon bajku: + predok hore',-40,40,0,'°'],['bikeheight','Odstup najnižšieho kolesa od zeme',0,1500,0,'mm'],['fronttravel','Zdvih vidlice',80,200,130,'mm'],['reartravel','Zdvih zadného kolesa',0,200,130,'mm'],['frontload','Stlačenie vidlice',0,100,0,'%'],['rearload','Stlačenie zadného kolesa',0,100,0,'%']];
let demo=false, timer=null, custom=false, pose="seated", selectedStage=null;
for(const [id,label,min,max,note] of body){const l=document.createElement('label');l.innerHTML=`${label}<input id="b-${id}" type="number" min="${min}" max="${max}" step="0.1" placeholder="—"><span class="measure-note">${note}</span>`;$('body-fields').append(l)}
for(const [id,label,min,max] of geo){const l=document.createElement('label');l.innerHTML=`${label}<input id="g-${id}" type="number" min="${min}" max="${max}" step="0.1">`;$('geo-fields').append(l)}
for(const [id,label,min,max,val,unit] of setup){const l=document.createElement('label');l.innerHTML=`${label} <output id="o-${id}">${val} ${unit}</output><input id="s-${id}" type="range" min="${min}" max="${max}" value="${val}" step="1">`;$('setup-fields').append(l)}
$('source').href='https://geometrics.mtb-news.de/bike/yt-industries-izzo-core-2021.338';
function defaultGeo(size){const i=Math.max(0,catalog[bike].sizes.indexOf(size));if(bike==='laufey')return {...Object.fromEntries(Object.entries(laufeyData).map(([k,v])=>[k,v[i]])),chain:435,bbheight:313.5,drop:65,ha:65.5,sa:75,actualsa:75,rake:44,rimradius:311};if(bike==='neuron')return {...Object.fromEntries(Object.entries(neuronData).map(([k,v])=>[k,v[i]])),ha:66,sa:76,bbheight:(i<2?355:374)-neuronData.drop[i],actualsa:72,rake:44,rimradius:i<2?292:311};return Object.fromEntries([...Object.entries(data).map(([k,v])=>[k,v[i]]),['ha',66],['sa',77],['drop',35],['bbheight',339],['actualsa',72],['rake',i<3?42:41],['rimradius',311]])}
function bikeUI(size){sizes=catalog[bike].sizes;$('bike').value=bike;$('size').replaceChildren(...sizes.map(value=>{const o=document.createElement('option');o.value=value;o.textContent=value;return o}));$('size').value=sizes.includes(size)?size:sizes.at(-1);$('source').href=catalog[bike].source;$('compare').textContent='Porovnať veľkosti '+sizes[0]+'–'+sizes.at(-1);$('bike-note').textContent=bike==='izzo'?'Tvoje IZZO 2021. Geometria podľa tvojej tabuľky.':'Canyon Neuron 6 podľa produktu 4004. XS/S: 27,5″; M–XL: 29″. Rok nie je v zdroji uvedený.';$('geometry-note').textContent=bike==='izzo'?'Zdroj: tvoja tabuľka IZZO 2021. Skutočný sklon sedlovky 72° je pracovný odhad.':'Zdroj: oficiálna tabuľka Canyon, produkt 4004. Reach, stack, trubky, uhly, rázvor a BB drop sú prevzaté. Výška BB je odvodená z odhadovaného priemeru s plášťom: 710 / 748 mm. Skutočný sklon sedlovky 72° a offset vidlice 44 mm sú pracovné odhady; uprav ich podľa merania.';if(bike==='laufey'){$('bike-note').textContent='Tvoj Orbea Laufey H30 · hardtail. Geometria podľa priloženej tabuľky; rok nebol uvedený.';$('geometry-note').textContent='Zdroj: tvoja tabuľka S–XL. XL: reach 484, stack 664, sedlová trubka 521, horná trubka 662, hlavová 130, rázvor 1235 mm. Vzpera 435, BB height 313,5, BB drop 65, offset 44 mm; uhly 65,5° / 75°. Dĺžka vidlice 547 mm nie je jej zdvih. Zdvih vidlice 140 mm je pracovná predvoľba, over ho na svojom bajku. Priama sedlová os 75° je zjednodušenie.';}$('source').hidden=bike==='laufey';for(const id of ['reartravel','rearload'])$('s-'+id).disabled=bike==='laufey';}
function loadGeo(components=false){const g=defaultGeo($('size').value);for(const [k,v] of Object.entries(g))$('g-'+k).value=v;custom=false;if(components){$('s-fronttravel').value=bike==='izzo'?130:140;$('s-reartravel').value=bike==='laufey'?0:130;if(bike==='laufey')$('s-rearload').value=0;const i=sizes.indexOf($('size').value);$('s-barwidth').value=bike==='neuron'&&i<2?740:760;$('s-crank').value=bike==='neuron'?(i<2?165:170):175;}}
function values(prefix,fields){return Object.fromEntries(fields.map(([id])=>[id,Number($(prefix+id).value)]))}
function invalid(prefix,fields){return fields.find(([id,,min,max])=>{const el=$(prefix+id);return el.value===''||!Number.isFinite(Number(el.value))||Number(el.value)<min||Number(el.value)>max})}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
function joint(a,b,l1,l2,kind){const d=dist(a,b);if(d<1e-6||d>l1+l2||d<Math.abs(l1-l2))return null;const along=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-along*along)),ux=(b.x-a.x)/d,uy=(b.y-a.y)/d;const p={x:a.x+along*ux,y:a.y+along*uy};const c=[{x:p.x-h*uy,y:p.y+h*ux},{x:p.x+h*uy,y:p.y-h*ux}];return kind==='knee'?c.sort((p,q)=>q.x-p.x)[0]:c.sort((p,q)=>p.y-q.y)[0]}
function angle(a,b,c){const u={x:a.x-b.x,y:a.y-b.y,z:(a.z||0)-(b.z||0)},v={x:c.x-b.x,y:c.y-b.y,z:(c.z||0)-(b.z||0)};return Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y+u.z*v.z)/(Math.hypot(u.x,u.y,u.z)*Math.hypot(v.x,v.y,v.z)))))*180/Math.PI}
function armJoint3D(a,b,l1,l2){
 const d=dist(a,b);if(d<1e-6||d>l1+l2||d<Math.abs(l1-l2))return null;
 const u={x:(b.x-a.x)/d,y:(b.y-a.y)/d,z:((b.z||0)-(a.z||0))/d};
 const along=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-along*along));
 const planar=Math.hypot(u.x,u.y);const n=planar>1e-8?{x:u.y/planar,y:-u.x/planar,z:0}:{x:0,y:-1,z:0};
 return {x:a.x+along*u.x+h*n.x,y:a.y+along*u.y+h*n.y,z:(a.z||0)+along*u.z};
}

function ankleAt(pedal,b,s){const a=rad(s.footpitch||0),h=s.anklerise??65,l=b.foot*10;return {x:pedal.x-l*Math.cos(a)-h*Math.sin(a),y:pedal.y-l*Math.sin(a)+h*Math.cos(a)}}
function cycleAssessment(g,b,s){
 if(!b||s.pose!=='seated')return null;
 const samples=[];for(let phase=0;phase<360;phase++){const m=model(g,b,s,phase);samples.push({phase,flex:m.knee?180-angle(m.hip,m.knee,m.ankle):null})}
 const valid=samples.filter(p=>p.flex!==null),fails=360-valid.length;
 if(fails)return {samples,fails,color:'#88918c',message:`Cyklus mimo dosahu: ${fails}/360 polôh. Najprv uprav rozmery alebo sedlo; farebné hodnotenie je vypnuté.`};
 if(s.refmin>s.refmax)return {samples,fails:0,color:'#88918c',message:'Referenčné minimum musí byť menšie alebo rovné maximu.'};
 const extended=valid.reduce((a,b)=>a.flex<b.flex?a:b),bent=valid.reduce((a,b)=>a.flex>b.flex?a:b);
 const gap=Math.max(s.refmin-extended.flex,extended.flex-s.refmax,0),hue=120*Math.max(0,1-gap/20),color=`hsl(${hue}, 68%, 38%)`;
 const verdict=gap===0?'V referenčnom rozsahu':extended.flex>s.refmax?'Koleno ostáva viac pokrčené':'Koleno sa príliš vystiera';
 return {samples,fails,extended,bent,gap,color,message:`${verdict}. Pri najväčšom vystretí: ${extended.flex.toFixed(1)}° flexie (referencia ${s.refmin}–${s.refmax}°); odchýlka ${gap.toFixed(1)}°. Najväčšie pokrčenie: ${bent.flex.toFixed(1)}°. Skús jemne upraviť výšku sedla a sleduj výsledok.`};
}
function cycleRing(a,s,phase){
 if(!a)return;const r=s.crank+45,point=p=>({x:r*Math.cos(rad(p)),y:r*Math.sin(rad(p))});
 for(let p=0;p<360;p+=5){const sample=a.samples[p];line(point(p),point(p+4),sample.flex===null?'#b34b45':a.color,7)}
 if(a.extended){const e=point(a.extended.phase),f=point(a.bent.phase);svg('rect',{x:e.x-13,y:-e.y-13,width:26,height:26,fill:a.color,stroke:'#fff','stroke-width':4});dot(f,'#687b74',10)}
 dot(point(phase),'#173831',10);
}
function model(g,b,s,phase){
 const saddlePoint=bikeGeometry({...g,seat:s.saddle}).collar,saddle={x:saddlePoint.x+s.offset,y:saddlePoint.y};
 const standing=s.pose && s.pose!=='seated',hip=standing?{x:s.hipx,y:s.hipy}:saddle;
 const grip={x:g.reach+s.gripx,y:g.stack+s.gripy,z:s.barwidth/2-s.gripinset};
 const shoulder={x:hip.x+b.torso*10*Math.cos(rad(s.lean)),y:hip.y+b.torso*10*Math.sin(rad(s.lean)),z:b.shoulders*10/2};
 const pedal={x:s.crank*Math.cos(rad(standing?0:phase)),y:s.crank*Math.sin(rad(standing?0:phase))};
 const ankle=ankleAt(pedal,b,s),knee=joint(hip,ankle,b.thigh*10,b.shin*10,'knee');
 const wrist={x:grip.x-b.hand*10,y:grip.y,z:grip.z},elbow=armJoint3D(shoulder,wrist,b.upper*10,b.fore*10);
 const pedal2={x:-s.crank,y:0},ankle2=ankleAt(pedal2,b,s),knee2=standing?joint(hip,ankle2,b.thigh*10,b.shin*10,'knee'):null;
 return {hip,saddle,grip,shoulder,pedal,ankle,knee,wrist,elbow,standing,pedal2,ankle2,knee2,footSettings:s};
}
function posturePreset(g,b,s,pose){
 const leg=(b.thigh+b.shin)*10,rear=bikeGeometry(g).rear;
 const desired=pose==='neutral'?{x:-50,y:leg*.84,lean:55,elbow:125}:pose==='aggressive'?{x:-200,y:leg*.67,lean:50,elbow:100}:{x:rear.x-60,y:leg*.68,lean:45,elbow:155};
 let best=null,cost=Infinity;
 // Search feasible postures; segment lengths and both pedal contacts stay fixed.
 for(let dx=-80;dx<=80;dx+=20)for(let dy=-100;dy<=100;dy+=20)for(let lean=10;lean<=80;lean+=2){
  const trial={...s,pose,hipx:desired.x+dx,hipy:desired.y+dy,lean},m=model(g,b,trial,0);
  if(!m.knee||!m.knee2||!m.elbow)continue;
  if(pose==='manual' && Math.abs(m.hip.x-rear.x)>180)continue;
  const arm=angle(m.shoulder,m.elbow,m.wrist),score=(dx/60)**2+(dy/80)**2+((lean-desired.lean)/15)**2+((arm-desired.elbow)/22)**2;
  if(score<cost){cost=score;best=trial;}
 }
 return best||{...s,pose,hipx:desired.x,hipy:desired.y,lean:desired.lean};
}

const svgNS='http://www.w3.org/2000/svg';function svg(tag,attrs){const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));$('scene').append(el);return el}
function line(a,b,color,width=9,dash){return svg('line',{x1:a.x,y1:-a.y,x2:b.x,y2:-b.y,stroke:color,'stroke-width':width,'stroke-linecap':'round',...(dash?{'stroke-dasharray':dash}:{})})}
function dot(a,color,r=12){svg('circle',{cx:a.x,cy:-a.y,r,fill:'#f5f7f1',stroke:color,'stroke-width':6})}
function text(p,label){svg('text',{x:p.x,y:-p.y}).textContent=label}
// Metric construction: every world coordinate is a millimetre.
function bikeGeometry(g){
 const bb={x:0,y:0},rear={x:-Math.sqrt(g.chain*g.chain-g.drop*g.drop),y:g.drop},front={x:rear.x+g.wheelbase,y:g.drop};
 const fc=g.frontcompression||0,rc=g.hardtail?0:(g.rearcompression||0);front.x-=fc*Math.cos(rad(g.ha));front.y+=fc*Math.sin(rad(g.ha));rear.y+=rc;
 const ht={x:g.reach,y:g.stack},hb={x:ht.x+g.head*Math.cos(rad(g.ha)),y:ht.y-g.head*Math.sin(rad(g.ha))};
 const radius=g.bbheight+g.drop,ground=-g.bbheight;
 // Effective top tube fixes the reference point on the seatpost axis.
 const seatRef={x:g.reach-g.top,y:g.stack},u={x:-Math.cos(rad(g.actualsa)),y:Math.sin(rad(g.actualsa))};
 const projection=seatRef.x*u.x+seatRef.y*u.y, discriminant=projection*projection-(seatRef.x*seatRef.x+seatRef.y*seatRef.y-g.seat*g.seat);
 if(discriminant<0)throw Error('Sedlová trubka a jej sklon netvoria možnú geometriu.');
 const t=projection-Math.sqrt(discriminant),collar={x:seatRef.x-t*u.x,y:seatRef.y-t*u.y};
 const junction={x:collar.x+90*Math.cos(rad(g.actualsa)),y:collar.y-90*Math.sin(rad(g.actualsa))};
 const pivot={x:20,y:75},seatBend={x:10,y:junction.y*0.58};
 const forkN={x:Math.sin(rad(g.ha)),y:Math.cos(rad(g.ha))};
 const impliedOffset=(front.x-ht.x)*forkN.x+(front.y-ht.y)*forkN.y;
 const crown={x:hb.x+forkN.x*g.rake,y:hb.y+forkN.y*g.rake},forkEnd={x:front.x+forkN.x*(g.rake-impliedOffset),y:front.y+forkN.y*(g.rake-impliedOffset)};
 return {bb,rear,front,ht,hb,radius,ground,seatRef,collar,junction,pivot,seatBend,crown,forkEnd,impliedOffset};
}
function riderCOM(m,b){
 if(!m.knee||!m.elbow)return null;
 let ankle2=m.ankle2,knee2=m.knee2,pedal2=m.pedal2;
 if(!m.standing){pedal2={x:-m.pedal.x,y:-m.pedal.y};ankle2=ankleAt(pedal2,b,m.footSettings);knee2=joint(m.hip,ankle2,b.thigh*10,b.shin*10,'knee');}
 if(!knee2)return null;
 const mix=(a,c,t)=>({x:a.x+(c.x-a.x)*t,y:a.y+(c.y-a.y)*t});
 // Reference adult-male mass fractions (de Leva, 1996). Segment centres
 // are approximated on this app's simplified joint/head/foot definitions.
 const parts=[
  [.4346,mix(m.hip,m.shoulder,.5)],
  [.0694,{x:m.shoulder.x+55,y:m.shoulder.y+140}],
  [.0271*2,mix(m.shoulder,m.elbow,.5772)],
  [.0162*2,mix(m.elbow,m.wrist,.4574)],
  [.0061*2,mix(m.wrist,m.grip,.5)],
  [.1416,mix(m.hip,m.knee,.4095)],[.1416,mix(m.hip,knee2,.4095)],
  [.0433,mix(m.knee,m.ankle,.4459)],[.0433,mix(knee2,ankle2,.4459)],
  [.0137,mix(m.ankle,m.pedal,.5)],[.0137,mix(ankle2,pedal2,.5)]
 ];
 const mass=parts.reduce((sum,[w])=>sum+w,0);
 return {x:parts.reduce((sum,[w,p])=>sum+w*p.x,0)/mass,y:parts.reduce((sum,[w,p])=>sum+w*p.y,0)/mass};
}

function dimension(a,b,label,position){line(a,b,'#71856a',2.5,'8 7');const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,n={x:-dy/l*9,y:dx/l*9};for(const p of [a,b])line({x:p.x-n.x,y:p.y-n.y},{x:p.x+n.x,y:p.y+n.y},'#71856a',3);text(position,label)}
let photo=null,photoPoints=[],photoPicking=false;
function photoMatrix(q){
 const mirrored=$('photo-mirror').checked,points=photoPoints.length===2?photoPoints:[{x:photo.width*.25,y:photo.height*.7},{x:photo.width*.75,y:photo.height*.7}];
 const px=p=>mirrored?photo.width-p.x:p.x,r={x:px(points[0]),y:points[0].y},f={x:px(points[1]),y:points[1].y};
 const scale=(q.front.x-q.rear.x)/Math.hypot(f.x-r.x,f.y-r.y)*Number($('photo-scale').value)/100;
 const a=-Math.atan2(f.y-r.y,f.x-r.x)+rad(Number($('photo-angle').value)),c=Math.cos(a)*scale,s=Math.sin(a)*scale;
 const tx=q.rear.x+Number($('photo-x').value)-c*r.x+s*r.y,ty=-q.rear.y+Number($('photo-y').value)-s*r.x-c*r.y;
 return mirrored?[-c,-s,-s,c,tx+c*photo.width,ty+s*photo.width]:[c,s,-s,c,tx,ty];
}
function photoDraw(q){if(!photo)return;const attrs={href:photo.src,x:0,y:0,width:photo.width,height:photo.height,opacity:Number($('photo-opacity').value)/100,transform:'matrix('+photoMatrix(q).join(' ')+')','pointer-events':'none',preserveAspectRatio:'none'};svg('image',attrs)}
function photoPicker(){const canvas=$('photo-picker'),ctx=canvas.getContext('2d');canvas.width=Math.min(1000,photo.width);canvas.height=canvas.width*photo.height/photo.width;ctx.drawImage(photo,0,0,canvas.width,canvas.height);const scale=canvas.width/photo.width;photoPoints.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x*scale,p.y*scale,9,0,Math.PI*2);ctx.fillStyle=i?'#e96937':'#198754';ctx.fill();ctx.strokeStyle='white';ctx.lineWidth=3;ctx.stroke();});}
function resetPhotoAdjust(){for(const [id,v] of [['opacity',35],['scale',100],['x',0],['y',0],['angle',0]])$('photo-'+id).value=v;$('photo-mirror').checked=false;}
$('photo-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>20*1024*1024)throw Error('Použi fotku menšiu než 20 MB.');if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Použi JPG, PNG alebo WebP.');const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)}),img=new Image();img.src=src;await img.decode();photo=img;photoPoints=[];resetPhotoAdjust();$('photo-calibrate').click();update();}catch(err){$('photo-status').textContent=err.message||'Fotku sa nepodarilo načítať.';}finally{e.target.value=''}};
$('photo-calibrate').onclick=()=>{if(!photo){$('photo-status').textContent='Najprv nahraj fotku.';return}stop();photoPoints=[];photoPicking=true;$('photo-status').textContent='1/2: Klikni na stred osi zadného kolesa na fotke.';$('photo-step').textContent=$('photo-status').textContent;photoPicker();if(!$('photo-dialog').open)$('photo-dialog').showModal();};
$('photo-cancel').onclick=()=>{$('photo-dialog').close();};$('photo-dialog').addEventListener('close',()=>{if(photoPicking){photoPicking=false;photoPoints=[];$('photo-status').textContent='Kalibrácia zrušená. Klikni na Označiť osi kolies a skús znova.';update();}});
$('photo-picker').onclick=e=>{if(!photo||!photoPicking)return;const box=e.currentTarget.getBoundingClientRect(),p={x:(e.clientX-box.left)/box.width*photo.width,y:(e.clientY-box.top)/box.height*photo.height};if(photoPoints.length&&Math.hypot(p.x-photoPoints[0].x,p.y-photoPoints[0].y)<photo.width*.05){$('photo-status').textContent='Osi sú príliš blízko. Označ os predného kolesa.';$('photo-step').textContent=$('photo-status').textContent;return}photoPoints.push(p);photoPicker();if(photoPoints.length===1){$('photo-status').textContent='2/2: Klikni na stred osi predného kolesa.';$('photo-step').textContent=$('photo-status').textContent;return}photoPicking=false;$('photo-dialog').close();resetPhotoAdjust();$('photo-status').textContent='Zarovnané podľa osí a rázvoru vybraného bajku. Skontroluj stred kľúk; perspektívu nemožno opraviť rovnomernou mierkou. Pri prepnutí rámu sa fotka prispôsobí jeho rázvoru.';update();};
$('photo-reset').onclick=()=>{resetPhotoAdjust();update();};
$('photo-remove').onclick=()=>{photo=null;photoPoints=[];photoPicking=false;$('photo-dialog').close();$('photo-status').textContent='Fotka odstránená.';update();};
let snapshotA=null,hipMapCache=null;
function hipReachable(g,b,s,x,y){const m=model(g,b,{...s,pose:'neutral',hipx:x,hipy:y},0);return !!(m.knee&&m.knee2&&m.elbow);}
function hipMap(g,b,s){
 const bounds={left:-800,right:250,bottom:200,top:1100},key=JSON.stringify([g,b,s.lean,s.gripx,s.gripy,s.barwidth,s.gripinset,s.crank,s.footpitch,s.anklerise]);
 if(hipMapCache?.key===key)return hipMapCache;
 let path='',count=0;for(let x=bounds.left;x<=bounds.right;x+=15)for(let y=bounds.bottom;y<=bounds.top;y+=15)if(hipReachable(g,b,s,x,y)){path+=`M${x-7.5},${-y-7.5}h15v15h-15z`;count++;}
 return hipMapCache={key,path,count,bounds};
}
function drawHipMap(g,b,s){
 if(!$('show-hip-map').checked){$('hip-map-note').textContent='Mapa je vypnutá.';return;}
 if(!b||s.pose==='seated'){$('hip-map-note').textContent=!b?'Najprv doplň rozmery jazdca.':'Vyber postoj mimo sedla; pri sedení je panva viazaná na sedlo.';return;}
 const map=hipMap(g,b,s);svg('path',{d:map.path,fill:'#45a26b',opacity:.22,'pointer-events':'none'});
 $('hip-map-note').textContent=map.count?'Zelená oblasť: obe nohy a ruky dosiahnu kontakty pri aktuálnom sklone trupu. Kliknutím do nej presunieš panvu. Mapa je vzorkovaná po 15 mm.':'V zobrazenom rozsahu nie je dosiahnuteľná poloha. Uprav sklon trupu alebo úchop.';
}
function drawA(g,b,s){
 if(!snapshotA){$('ab-table').replaceChildren();return null;}
 const a=snapshotA,qa=bikeGeometry(a.g),qb=bikeGeometry(g),dx=$('ab-align').value==='rear'?qb.rear.x-qa.rear.x:0,dy=$('ab-align').value==='rear'?qb.rear.y-qa.rear.y:0;
 $('ab-note').textContent=`A: ${a.name} / ${a.size} · ${{seated:'v sedle',neutral:'neutrálny postoj',aggressive:'agresívny postoj',manual:'manuál'}[a.s.pose]} (modrá). B: ${catalog[bike].name} / ${$('size').value}. Rozdiely = B mínus A.`;
 const table=document.createElement('table');table.innerHTML='<thead><tr><th>Rozmer</th><th>A</th><th>B</th><th>Δ mm</th></tr></thead>';for(const [key,label] of [['reach','Reach'],['stack','Stack'],['wheelbase','Rázvor'],['chain','Zadná stavba']]){const row=document.createElement('tr');for(const value of [label,a.g[key],g[key],Math.round((g[key]-a.g[key])*10)/10]){const td=document.createElement('td');td.textContent=value;row.append(td)}table.append(row);}$('ab-table').replaceChildren(table);
 if(!$('show-a').checked)return null;
 const before=new Set($('scene').children),color='#3978bd',shift=p=>({x:p.x+dx,y:p.y+dy});
 for(const p of [qa.rear,qa.front])svg('circle',{cx:p.x+dx,cy:-p.y-dy,r:qa.radius,fill:'none',stroke:color,'stroke-width':9,'stroke-dasharray':'20 12'});
 for(const [p,q] of [[qa.rear,qa.bb],[qa.rear,qa.junction],[qa.junction,qa.ht],[qa.ht,qa.hb],[qa.hb,qa.bb],[qa.bb,qa.junction],[qa.hb,qa.front]])line(shift(p),shift(q),color,9,'16 10');
 const m=model(a.g,a.b,{...a.s,bikepitch:s.bikepitch,bikeheight:s.bikeheight},Number($('phase').value));
 line(shift(qa.collar),shift(m.saddle),color,6,'16 10');line(shift({x:m.saddle.x-70,y:m.saddle.y}),shift({x:m.saddle.x+70,y:m.saddle.y}),color,8);
 for(const [p,q] of [[m.hip,m.shoulder],[m.hip,m.knee],[m.knee,m.ankle],[m.ankle,m.pedal],[m.hip,m.knee2],[m.knee2,m.ankle2],[m.shoulder,m.elbow],[m.elbow,m.wrist],[m.wrist,m.grip]])if(p&&q)line(shift(p),shift(q),color,8,'14 8');
 for(const el of $('scene').children)if(!before.has(el))el.setAttribute('opacity','.6');
 return {left:qa.rear.x+dx-qa.radius-90,right:qa.front.x+dx+qa.radius+90,top:m.shoulder.y+dy+215,bottom:-a.g.bbheight+dy-180};
}
$('save-a').onclick=()=>{if(invalid('b-',body)||invalid('g-',geo)){$('ab-note').textContent='Pred uložením A doplň platné rozmery jazdca a geometrie.';return;}try{const s={...values('s-',setup),pose},g={...values('g-',geo),frontcompression:s.fronttravel*s.frontload/100,hardtail:bike==='laufey',rearcompression:bike==='laufey'?0:s.reartravel*s.rearload/100};bikeGeometry(g);bikeGeometry({...g,seat:s.saddle});snapshotA={name:catalog[bike].name,size:$('size').value,g,b:values('b-',body),s};$('show-a').checked=true;update();}catch(err){$('ab-note').textContent=err.message;}};
$('clear-a').onclick=()=>{snapshotA=null;$('ab-note').textContent='A vymazané. Aktuálne nastavenie zostáva ako B.';update();};
$('scene').addEventListener('click',e=>{if(!$('show-hip-map').checked||pose==='seated'||invalid('b-',body)||invalid('g-',geo))return;const point=$('scene').createSVGPoint();point.x=e.clientX;point.y=e.clientY;const pt=point.matrixTransform($('scene').getScreenCTM().inverse()),s={...values('s-',setup),pose},a=rad(s.bikepitch),x=pt.x*Math.cos(a)-pt.y*Math.sin(a),y=-pt.x*Math.sin(a)-pt.y*Math.cos(a);if(x<-800||x>250||y<200||y>1100)return;if(!hipReachable(values('g-',geo),values('b-',body),s,x,y)){$('hip-map-note').textContent='Táto poloha je mimo dosahu. Klikni do zelenej oblasti.';return;}$('s-hipx').value=Math.round(x);$('s-hipy').value=Math.round(y);selectedStage=null;stageUI();update();});
function draw(g,b,s,m,a){
 $('scene').replaceChildren();const q=bikeGeometry(g),chassis=Math.atan2(q.rear.y-q.front.y,q.front.x-q.rear.x)*180/Math.PI;s={...s,bikepitch:s.bikepitch+chassis};$('suspension-note').textContent=`Vidlica ${g.frontcompression?.toFixed(1)||0} mm · zadné koleso ${g.rearcompression?.toFixed(1)||0} mm. Zmena sklonu rámu ${chassis.toFixed(1)}°. Hlavový uhol voči vodorovnej zemi ${(g.ha-chassis).toFixed(1)}°. Výška stredu pri vyrovnaných osiach ${Math.round(q.radius-(q.rear.x*Math.sin(rad(chassis))+q.rear.y*Math.cos(rad(chassis))))} mm.`;const {rear,front,bb,ht,hb,collar,junction,pivot,seatBend,crown,forkEnd,radius,ground}=q,ink='#244d43',orange='#de653a';
 photoDraw(q);
 drawHipMap(g,b,s);const aBounds=drawA(g,b,s);
 line({x:rear.x-radius-65,y:ground},{x:front.x+radius+65,y:ground},'#ccd7c8',3).setAttribute('data-ground','true');
 [rear,front].forEach(p=>{svg('circle',{cx:p.x,cy:-p.y,r:radius,fill:'none',stroke:'#92a393','stroke-width':11});svg('circle',{cx:p.x,cy:-p.y,r:g.rimradius??311,fill:'none',stroke:'#c5d1bf','stroke-width':3});for(let a=0;a<360;a+=45)line(p,{x:p.x+(g.rimradius??311)*Math.cos(rad(a)),y:p.y+(g.rimradius??311)*Math.sin(rad(a))},'#c5d1bf',2);dot(p,ink,8)});
 // IZZO MK1 silhouette: low top-tube junction, curved seat tube,
 // four-bar rear triangle and almost vertical shock. These shape points
 // are schematic; published geometry fixes the hard reference points.
 const topAttach={x:ht.x+15*Math.cos(rad(g.ha)),y:ht.y-15*Math.sin(rad(g.ha))},lower={x:45,y:35};
 if(g.hardtail){[[junction,topAttach],[hb,ht],[hb,bb],[bb,collar],[rear,bb],[rear,junction]].forEach(([a,c])=>line(a,c,ink,12));}else{
 [[junction,topAttach],[bb,lower],[lower,hb],[hb,ht],[bb,pivot],[pivot,seatBend],[seatBend,junction],[junction,collar]].forEach(([a,c])=>line(a,c,ink,13));
 const rocker={x:junction.x+85,y:junction.y+12},horst={x:rear.x+45,y:rear.y+17};
 [[rear,horst],[horst,pivot],[rear,junction],[junction,rocker],[rocker,seatBend]].forEach(([a,c])=>line(a,c,ink,8));
 const shockBottom={x:rocker.x+12,y:130};line(rocker,shockBottom,'#6f8273',10);line({x:rocker.x+6,y:235},shockBottom,ink,23);[junction,pivot,horst,rocker].forEach(p=>dot(p,ink,8));
 }
 line(hb,crown,ink,8);line(crown,forkEnd,ink,12);const forkMid={x:crown.x+(forkEnd.x-crown.x)*0.48,y:crown.y+(forkEnd.y-crown.y)*0.48};line(forkMid,forkEnd,ink,20);line(forkEnd,front,ink,8);
 const postTop={x:collar.x+(m.saddle.y-collar.y)/Math.tan(rad(g.actualsa))*-1,y:m.saddle.y};line(collar,postTop,ink,7);line({x:postTop.x-55,y:postTop.y-8},{x:postTop.x+40,y:postTop.y-8},ink,5);line({x:m.saddle.x-80,y:m.saddle.y},{x:m.saddle.x+85,y:m.saddle.y},ink,13);
 const stemBase={x:ht.x-35*Math.cos(rad(g.ha)),y:ht.y+35*Math.sin(rad(g.ha))},bar={x:m.grip.x+45,y:m.grip.y-20};line(ht,stemBase,ink,6);line(stemBase,bar,ink,9);line(bar,m.grip,ink,7);line({x:m.grip.x-25,y:m.grip.y},{x:m.grip.x+18,y:m.grip.y},ink,11);
 cycleRing(a,s,+$('phase').value);svg('circle',{cx:0,cy:0,r:48,fill:'none',stroke:ink,'stroke-width':4});line(bb,m.pedal,ink,9);dot(bb,ink,15);line({x:m.pedal.x-30,y:m.pedal.y},{x:m.pedal.x+30,y:m.pedal.y},ink,8);
 if($('dimensions').checked){
  dimension({x:0,y:g.stack+55},{x:g.reach,y:g.stack+55},`Reach ${g.reach} mm`,{x:100,y:g.stack+82});
  dimension({x:g.reach+145,y:0},{x:g.reach+145,y:g.stack},`Stack ${g.stack} mm`,{x:g.reach+170,y:g.stack*.56});
  dimension({x:rear.x,y:ground-80},{x:front.x,y:ground-80},`Rázvor ${g.wheelbase} mm`,{x:(rear.x+front.x)/2-160,y:ground-135});
  dimension({x:-80,y:ground},{x:-80,y:0},`BB ${g.bbheight} mm`,{x:-280,y:ground*.52});
  dimension({x:g.reach-g.top,y:g.stack+155},{x:g.reach,y:g.stack+155},`Efektívna horná trubka ${g.top} mm`,{x:g.reach-g.top,y:g.stack+190});
  text({x:rear.x-180,y:rear.y+radius+35},`Ø ${Math.round(radius*2)} mm`);
 }
 if(b){if(m.standing && m.knee2){line(bb,m.pedal2,ink,7);line({x:m.pedal2.x-30,y:0},{x:m.pedal2.x+30,y:0},ink,7);line(m.hip,m.knee2,'#c88f79',7);line(m.knee2,m.ankle2,'#c88f79',7);line(m.ankle2,m.pedal2,'#c88f79',5);dot(m.knee2,'#c88f79',9);}line(m.hip,m.shoulder,orange,12);line(m.shoulder,{x:m.shoulder.x+45,y:m.shoulder.y+80},orange,8);svg('circle',{cx:m.shoulder.x+55,cy:-m.shoulder.y-140,r:58,fill:'none',stroke:orange,'stroke-width':9});if(m.knee){line(m.hip,m.knee,a?.color||orange);line(m.knee,m.ankle,a?.color||orange);line(m.ankle,m.pedal,a?.color||orange,7);dot(m.knee,a?.color||orange);dot(m.ankle,a?.color||orange)}if(m.elbow){line(m.shoulder,m.elbow,orange);line(m.elbow,m.wrist,orange);line(m.wrist,m.grip,orange,7);dot(m.elbow,orange);dot(m.wrist,orange)}dot(m.hip,orange);dot(m.shoulder,orange)}
const com=b?riderCOM(m,b):null;
$('com-value').textContent=!b?'Doplň rozmery jazdca pre odhad ťažiska.':!com?'Ťažisko sa nezobrazuje: niektorý kontaktný bod je mimo dosahu.':`Ťažisko jazdca: ${Math.round(com.x/10)} cm od stredu kľúk (＋ dopredu), ${Math.round((com.y-ground)/10)} cm nad zemou.`;
if(com && $('show-com').checked && !s.bikepitch && !s.bikeheight && !g.frontcompression && !g.rearcompression){const gold='#c39415';line(com,{x:com.x,y:ground},gold,3,'10 10');svg('circle',{cx:com.x,cy:-com.y,r:23,fill:'#f4d76a',stroke:'#173831','stroke-width':4});line({x:com.x-32,y:com.y},{x:com.x+32,y:com.y},'#173831',4);line({x:com.x,y:com.y-32},{x:com.x,y:com.y+32},'#173831',4);text({x:com.x+40,y:com.y+35},'Ťažisko ≈');svg('circle',{cx:com.x,cy:-ground,r:9,fill:gold});}
 const mapVisible=b&&s.pose!=='seated'&&$('show-hip-map').checked,top=Math.max(b?m.shoulder.y+215:1200,1200,aBounds?.top||0),left=Math.min(rear.x-radius-90,aBounds?.left??Infinity,mapVisible?-820:Infinity),right=Math.max(front.x+radius+90,aBounds?.right??-Infinity),bottom=Math.min(ground-180,aBounds?.bottom??Infinity);
 if(s.bikepitch||s.bikeheight||g.frontcompression||g.rearcompression){
  // Rigid rotation preserves the frame geometry and all body contacts.
  const oldGround=$('scene').querySelector('line[data-ground]');oldGround?.remove();
  const group=document.createElementNS(svgNS,'g');group.setAttribute('transform',`rotate(${-s.bikepitch})`);group.id='bike-rotated';
  while($('scene').firstChild)group.append($('scene').firstChild);$('scene').append(group);
  const rotate=p=>({x:p.x*Math.cos(rad(s.bikepitch))-p.y*Math.sin(rad(s.bikepitch)),y:p.x*Math.sin(rad(s.bikepitch))+p.y*Math.cos(rad(s.bikepitch))});
  const r=rotate(rear),f=rotate(front),level=Math.min(r.y,f.y)-radius-s.bikeheight;
  const corners=[{x:left,y:top+65},{x:right,y:top+65},{x:left,y:bottom},{x:right,y:bottom}].map(rotate);
  const minX=Math.min(...corners.map(p=>p.x)),maxX=Math.max(...corners.map(p=>p.x)),maxY=Math.max(...corners.map(p=>p.y)),minY=Math.min(level-100,...corners.map(p=>p.y));
  line({x:minX,y:level},{x:maxX,y:level},'#9ba99c',3,'12 10');
  if(com){const c=rotate(com);$('com-value').textContent=`Ťažisko jazdca: ${Math.round(c.x/10)} cm vodorovne od stredu kľúk, ${Math.round((c.y-level)/10)} cm nad referenčnou zemou.`;}
  if(com&&$('show-com').checked){const c=rotate(com),gold='#c39415';line(c,{x:c.x,y:level},gold,3,'10 10');svg('circle',{cx:c.x,cy:-c.y,r:23,fill:'#f4d76a',stroke:'#173831','stroke-width':4});text({x:c.x+40,y:c.y+35},'Ťažisko ≈');$('com-value').textContent=`Ťažisko jazdca: ${Math.round(c.x/10)} cm vodorovne od stredu kľúk, ${Math.round((c.y-level)/10)} cm nad referenčnou zemou.`;}
  $('scene').setAttribute('viewBox',`${minX} ${-maxY} ${maxX-minX} ${maxY-minY}`);
 }else $('scene').setAttribute('viewBox',`${left} ${-top-65} ${right-left} ${top+65-bottom}`);
 $('scene').setAttribute('preserveAspectRatio','xMidYMid meet');

}

function update(){for(const [id,unit] of [['opacity','%'],['scale','%'],['x','mm'],['y','mm'],['angle','°']])$('photo-'+id+'-out').textContent=$('photo-'+id).value+' '+unit;for(const [id,,,,,unit] of setup)$('o-'+id).textContent=$('s-'+id).value+' '+unit;$('phase-value').textContent=$('phase').value+'°';$('comparison').replaceChildren();const badG=invalid('g-',geo);if(badG){$('cycle-result').textContent='Oprav geometriu pre hodnotenie cyklu.';$('cycle-swatch').style.background='#88918c';$('status').textContent='Oprav geometriu: '+badG[1];$('status').className='status error';return}const s={...values('s-',setup),pose},g={...values('g-',geo),frontcompression:s.fronttravel*s.frontload/100,hardtail:bike==='laufey',rearcompression:bike==='laufey'?0:s.reartravel*s.rearload/100},badB=invalid('b-',body),complete=!badB, b=complete?values('b-',body):null;try{bikeGeometry(g);bikeGeometry({...g,seat:s.saddle});}catch(error){stop();$('cycle-result').textContent='Geometria sa nedá zostaviť; hodnotenie cyklu je vypnuté.';$('cycle-swatch').style.background='#88918c';$('scene').replaceChildren();$('status').textContent=error.message;$('status').className='status error';for(const id of ['knee','elbow','torso-out'])$(id).textContent='—';$('analysis').textContent='Oprav vzájomne nezlučiteľné rozmery geometrie.';return}const m=model(g,b||{torso:0,thigh:0,shin:0,upper:0,fore:0,hand:0,foot:0},s,+$('phase').value);const assessment=cycleAssessment(g,b,s);draw(g,b,s,m,assessment);renderJump(g,b,s);$('cycle-result').textContent=assessment?assessment.message:complete?'Pri postojoch hodnotíme dosah, farebná referencia šliapania platí pre sedenie.':'Doplň rozmery jazdca pre hodnotenie cyklu.';$('cycle-swatch').style.background=assessment?.color||'#88918c';$('bike-title').textContent=catalog[bike].name+' / '+($('size').value||'L · náhľad')+(custom?' · vlastná geometria':'');$('mode').textContent=demo?'Ukážkové rozmery — nahraď ich svojimi.':'Tvoje rozmery · '+body.filter(([id])=>$('b-'+id).value!=='').length+'/'+body.length+' vyplnených.';let status=!$('size').value?'Vyber svoju veľkosť; bicykel zatiaľ zobrazuje L. ':'';status+=complete?(demo?'Ukážkový jazdec. ':'')+(!m.knee||(m.standing&&!m.knee2)?'Nohy nedosiahnu kontaktné body. ':!m.elbow?'Ruky nedosiahnu úchop. ':'Segmenty sa geometricky uzatvárajú v tejto polohe.'):'Doplň '+badB[1].toLowerCase()+' a ostatné telesné rozmery v uvedenom rozsahu.';$('status').textContent=status;$('status').className='status '+(complete&&(!m.knee||!m.elbow||(m.standing&&!m.knee2))?'error':'');$('knee').textContent=complete&&m.knee?angle(m.hip,m.knee,m.ankle).toFixed(1)+'°':'—';$('elbow').textContent=complete&&m.elbow?angle(m.shoulder,m.elbow,m.wrist).toFixed(1)+'°':'—';$('torso-out').textContent=complete?(s.lean+s.bikepitch)+'°':'—';
if(!complete){$('analysis').textContent='Po vyplnení rozmerov porovnáme dosiahnuteľnosť kontaktných bodov a celý cyklus pedálovania. Prázdne rozmery nenahrádzame odhadmi.';return}if(m.standing){const labels={neutral:'Neutrálny postoj',aggressive:'Agresívny postoj',manual:'Manuál'};const rear=bikeGeometry(g).rear;const ok=m.knee&&m.knee2&&m.elbow;document.getElementById('analysis').textContent=labels[pose]+': panva je voľná, chodidlá sú na vodorovných pedáloch a ruky držia úchop. '+(ok?'Všetky segmenty oboch nôh a jednej ruky sa geometricky uzatvárajú.':'Táto poloha je mimo dosahu tvojich segmentov. Posuň panvu alebo uprav sklon trupu.')+(pose==='manual'?' Panva je '+Math.round(m.hip.x-rear.x)+' mm od osi zadného kolesa (kladné = dopredu). Ide o polohu tela; samotný postoj nemení sklon bajku; ten nastav samostatne.':'')+' Predvoľby sú geometrické ukážky, nie návod na techniku jazdy. Sedlo nastav nižšie podľa vysunutia teleskopickej sedlovky.';return}let fails=0,kAngles=[];for(let p=0;p<360;p+=5){const t=model(g,b,s,p);if(!t.knee)fails++;else kAngles.push(angle(t.hip,t.knee,t.ankle))}const armDist=dist(m.shoulder,m.wrist),armTotal=(b.upper+b.fore)*10;const reachPercent=Math.round(100*armDist/armTotal);$('analysis').textContent=`${demo?'Ukážka: ':''}Priestorová vzdialenosť rameno–zápästie zodpovedá ${reachPercent} % súčtu dĺžok ramena a predlaktia. ${m.elbow?'Ruky sa pri zvolenom sklone trupu uzatvárajú.':'Úchop je mimo dosahu segmentov; skús zmeniť sklon trupu alebo polohu úchopu.'} ${fails?`Nohy sa nedajú uzavrieť v ${fails} zo 72 vzoriek otáčky. Skontroluj miery a výšku sedla.`:`Nohy sa uzatvárajú v 72 vzorkách otáčky; vnútorný uhol kolena sa mení od ${Math.min(...kAngles).toFixed(0)}° do ${Math.max(...kAngles).toFixed(0)}°.`} Toto je test dosiahnuteľnosti, nie hodnotenie pohodlia. Výška sedla, poloha bedra a pevný sklon chodidla sú zjednodušenia prototypu.`}
function poseUI(){
 const standing=pose!=='seated';
 document.querySelectorAll('[data-pose]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pose===pose)));
 for(const id of ['hipx','hipy']){$('s-'+id).disabled=!standing;$('s-'+id).parentElement.hidden=!standing;}
 $('phase').disabled=standing;$('play').disabled=standing;
 $('pose-note').textContent=standing?'Postoj na vodorovných pedáloch. Panvu a sklon trupu môžeš doladiť posuvníkmi.':'Sedenie: panva je viazaná na sedlo.';
}
function applyPose(){
 if(pose==='seated')return;
 $('phase').value=0;
 if(invalid('b-',body)||invalid('g-',geo))return;
 try{const s=posturePreset(values('g-',geo),values('b-',body),{...values('s-',setup),pose},pose);for(const id of ['hipx','hipy','lean'])$('s-'+id).value=Math.round(s[id]);}catch{}
}
$('sag-preset').onclick=()=>{$('s-frontload').value=20;$('s-rearload').value=bike==='laufey'?0:30;update();};$('suspension-reset').onclick=()=>{$('s-frontload').value=0;$('s-rearload').value=0;update();};
const jumpStages={approach:{pitch:0,height:0,pose:'aggressive'},takeoff:{pitch:18,height:0,pose:'neutral'},flight:{pitch:8,height:350,pose:'neutral'},landing:{pitch:-15,height:0,pose:'aggressive'}};
document.querySelectorAll('[data-bike-stage]').forEach(button=>button.addEventListener('click',()=>{stop();selectedStage=button.dataset.bikeStage;stageUI();const stage=jumpStages[selectedStage];$('s-bikepitch').value=stage.pitch;$('s-bikeheight').value=stage.height;pose=stage.pose;applyPose();poseUI();update();}));
function stageUI(){document.querySelectorAll('[data-bike-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bikeStage===selectedStage)));}
$('bike-level').onclick=()=>{selectedStage=null;stageUI();$('s-bikepitch').value=0;$('s-bikeheight').value=0;update();};
document.querySelectorAll('[data-pose]').forEach(button=>button.addEventListener('click',()=>{stop();pose=button.dataset.pose;if(pose==='seated')$('phase').value=270;applyPose();poseUI();update();}));

const jumpFields=[['speed','Rýchlosť na odraze',8,40,22,'km/h'],['angle','Sklon odrazu',5,40,20,'°'],['height','Výška lavice',0.3,2,1,'m'],['length','Dĺžka plošiny',1,8,3,'m'],['landing','Sklon dopadu',5,40,20,'°']];
for(const [id,label,min,max,value,unit] of jumpFields){const l=document.createElement('label');l.innerHTML=`${label} <output id="j-o-${id}"></output><input type="range" id="j-${id}" min="${min}" max="${max}" value="${value}" step="${id==='height'?.1:1}">`;$('jump-fields').append(l);}
let jumpTimer=null,jumpCache=null;
function jumpStop(){clearInterval(jumpTimer);jumpTimer=null;$('jump-play').textContent='▶ Skok';$('jump-play').setAttribute('aria-pressed','false');}
function jumpPhysics(p,wheelbase,radius){
 const v=p.speed/3.6*1000,a=rad(p.angle),vx=v*Math.cos(a),vy=v*Math.sin(a),h=p.height*1000,L=p.length*1000,down=Math.tan(rad(p.landing));
 const terrain=x=>x<0?Math.max(0,h+x*Math.tan(a)):x<=L?h:Math.max(0,h-(x-L)*down);
 const at=t=>{const pitch=p.angle+(-p.landing-p.angle)*Math.min(1,t/1.2),r={x:vx*t,y:h+radius+vy*t-4905*t*t},f={x:r.x+wheelbase*Math.cos(rad(pitch)),y:r.y+wheelbase*Math.sin(rad(pitch))};return {r,f,pitch,gap:Math.min(r.y-radius-terrain(r.x),f.y-radius-terrain(f.x))};};
 let contact=4,cleared=false;for(let t=.005;t<=4;t+=.005){const q=at(t);if(q.gap>0)cleared=true;if(cleared&&q.gap<=0){let lo=t-.005,hi=t;for(let i=0;i<15;i++){const mid=(lo+hi)/2;if(at(mid).gap>0)lo=mid;else hi=mid;}contact=(lo+hi)/2;break;}}
 const ramp=h/Math.tan(a),approach=(ramp+2000)/vx;return {at,terrain,contact,vx,h,L,down,ramp,approach};
}
function renderJump(g,b,s){
 $('jump-content').hidden=!$('jump-enabled').checked;if(!$('jump-enabled').checked){jumpStop();return;}
 const p=Object.fromEntries(jumpFields.map(([id,,,,,unit])=>{const value=Number($('j-'+id).value);$('j-o-'+id).textContent=value+' '+unit;return [id,value]}));
 const q=bikeGeometry(g),physics=jumpPhysics(p,Math.hypot(q.front.x-q.rear.x,q.front.y-q.rear.y),q.radius),fraction=Number($('jump-time').value)/1000,t=-physics.approach+fraction*(physics.contact+physics.approach),air=physics.at(Math.max(0,t));
 let r=air.r,pitch=air.pitch;if(t<0){r={x:physics.vx*t,y:physics.terrain(physics.vx*t)+q.radius};pitch=r.x < -physics.ramp?0:p.angle;}
 const stage=t<-.04?'Nájazd':t<.06?'Odraz':t<physics.contact-.06?'Let':'Kontakt / dopad';$('jump-time-out').textContent=`${t.toFixed(2)} s · ${stage}`;
 const root=$('jump-scene');root.replaceChildren();const add=(tag,attrs)=>{const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);root.append(el);return el},seg=(a,b,color,width=15)=>add('line',{x1:a.x,y1:-a.y,x2:b.x,y2:-b.y,stroke:color,'stroke-width':width,'stroke-linecap':'round'});
 const end=physics.L+physics.h/physics.down+2000,start=-physics.ramp-2000;
 const terrainPoints=[{x:start,y:0},{x:-physics.ramp,y:0},{x:0,y:physics.h},{x:physics.L,y:physics.h},{x:physics.L+physics.h/physics.down,y:0},{x:end,y:0}];
 add('polyline',{points:terrainPoints.map(p=>`${p.x},${-p.y}`).join(' '),fill:'none',stroke:'#879a76','stroke-width':25});
 const path=[];for(let k=0;k<=80;k++){const pt=physics.at(physics.contact*k/80).r;path.push(`${pt.x},${-pt.y}`);}add('polyline',{points:path.join(' '),fill:'none',stroke:'#c39415','stroke-width':8,'stroke-dasharray':'30 20'});
 pitch+=Math.atan2(q.rear.y-q.front.y,q.front.x-q.rear.x)*180/Math.PI;const rotate=pt=>({x:r.x+(pt.x-q.rear.x)*Math.cos(rad(pitch))-(pt.y-q.rear.y)*Math.sin(rad(pitch)),y:r.y+(pt.x-q.rear.x)*Math.sin(rad(pitch))+(pt.y-q.rear.y)*Math.cos(rad(pitch))});
 const rear=rotate(q.rear),front=rotate(q.front);for(const wheel of [rear,front])add('circle',{cx:wheel.x,cy:-wheel.y,r:q.radius,fill:'none',stroke:'#244d43','stroke-width':16});
 for(const [a,c] of [[q.rear,q.bb],[q.rear,q.junction],[q.junction,q.ht],[q.ht,q.hb],[q.hb,q.bb],[q.bb,q.junction],[q.hb,q.front]])seg(rotate(a),rotate(c),'#244d43',14);
 let bodyStatus='Doplň rozmery jazdca.';
 if(b){const key=JSON.stringify([g,b,s.saddle,s.offset,s.gripx,s.gripy,s.crank,s.barwidth,s.gripinset,s.footpitch,s.anklerise]);if(jumpCache?.key!==key)jumpCache={key,neutral:posturePreset(g,b,{...s,pose:'neutral'},'neutral'),aggressive:posturePreset(g,b,{...s,pose:'aggressive'},'aggressive')};
 const mix=t<0?1:Math.min(1,Math.max(0,(t/physics.contact-.6)/.4)),settings={...s,pose:'neutral'};for(const id of ['hipx','hipy','lean'])settings[id]=jumpCache.neutral[id]*(1-mix)+jumpCache.aggressive[id]*mix;const m=model(g,b,settings,0),ok=m.knee&&m.knee2&&m.elbow,color=ok?'#de653a':'#ae4035';bodyStatus=ok?'Kontakty jazdca sú v dosahu.':'Interpolovaná poloha jazdca je mimo dosahu; segmenty nenatiahneme.';
 for(const [a,c] of [[m.hip,m.shoulder],[m.hip,m.knee],[m.knee,m.ankle],[m.ankle,m.pedal],[m.hip,m.knee2],[m.knee2,m.ankle2],[m.ankle2,m.pedal2],[m.shoulder,m.elbow],[m.elbow,m.wrist],[m.wrist,m.grip]])if(a&&c)seg(rotate(a),rotate(c),color,14);const head=rotate({x:m.shoulder.x+55,y:m.shoulder.y+140});add('circle',{cx:head.x,cy:-head.y,r:58,fill:'none',stroke:color,'stroke-width':12});}
 const impact=physics.at(physics.contact),hit=impact.r.y-q.radius-physics.terrain(impact.r.x)<=1?impact.r:impact.f;const hitOnTop=hit.x<=physics.L;
 $('jump-result').textContent=`${bodyStatus} Prvý modelovaný kontakt: ${physics.contact.toFixed(2)} s, ${Math.round(hit.x)/1000} m od odrazovej hrany — ${hitOnTop?'na plošine lavice':'za hranou plošiny'}.`;
 const apex=physics.h+q.radius+(p.speed/3.6*1000*Math.sin(rad(p.angle)))**2/(2*9810),maxX=Math.max(end,impact.f.x+1000),maxY=Math.max(apex+1700,r.y+1800);root.setAttribute('viewBox',`${start} ${-maxY} ${maxX-start} ${maxY+350}`);
}
$('jump-play').onclick=()=>{if(jumpTimer){jumpStop();return;}stop();if(Number($('jump-time').value)>=1000)$('jump-time').value=0;jumpTimer=setInterval(()=>{$('jump-time').value=Math.min(1000,Number($('jump-time').value)+8);update();if(Number($('jump-time').value)>=1000)jumpStop();},30);$('jump-play').textContent='Ⅱ Zastaviť skok';$('jump-play').setAttribute('aria-pressed','true');};
$('jump-time').addEventListener('pointerdown',jumpStop);document.addEventListener('visibilitychange',()=>{if(document.hidden)jumpStop();});
document.querySelectorAll('input,select').forEach(el=>{if(el.type==='file')return;el.addEventListener('input',()=>{if(el.id.startsWith('j-')){jumpStop();$('jump-time').value=0;}if(el.id.startsWith('g-')||el.id==='bike'||el.id==='size'){jumpStop();$('jump-time').value=0;jumpCache=null;}if(el.id.startsWith('s-')||el.id.startsWith('g-')||el.id==='bike'||el.id==='size'){selectedStage=null;stageUI();}if(el.id.startsWith('b-'))demo=false;if(el.id.startsWith('g-'))custom=true;if(el.id==='bike'){stop();const previous=$('size').value;bike=$('bike').value;bikeUI(previous);loadGeo(true);}if(el.id==='size')loadGeo(true);if(pose!=='seated'&&(el.id==='size'||el.id==='bike'||el.id.startsWith('b-')))applyPose();update()})});
$('demo').onclick=()=>{const v=[192,97,49,46,62,30,30,9,17,50];body.forEach(([id],i)=>$('b-'+id).value=v[i]);demo=true;if(pose!=="seated")applyPose();update()};
$('clear').onclick=()=>{body.forEach(([id])=>$('b-'+id).value='');demo=false;update()};
function stop(){clearInterval(timer);timer=null;$('play').textContent='▶ Pedálovanie';$('play').setAttribute('aria-pressed','false')}
$('play').onclick=()=>{jumpStop();if(timer){stop();return}timer=setInterval(()=>{$('phase').value=(+$('phase').value-3+360)%360;update()},65);$('play').textContent='Ⅱ Zastaviť';$('play').setAttribute('aria-pressed','true')};document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
$('compare').onclick=()=>{if(invalid('b-',body)){$('comparison').textContent='Najprv doplň všetky rozmery jazdca.';return}const b=values('b-',body),s={...values('s-',setup),pose};const table=document.createElement('table');table.innerHTML='<thead><tr><th>Rám</th><th>Reach / stack</th><th>Úchop</th><th>Nohy / otáčka</th></tr></thead><tbody></tbody>';sizes.forEach(size=>{const g=defaultGeo(size),m=model(g,b,s,pose==='seated'?270:0);let f=0;for(let p=0;p<360;p+=5)if(!model(g,b,s,p).knee)f++;const tr=document.createElement('tr');[size,`${g.reach} / ${g.stack} mm`,m.elbow?'Dosiahnuteľný':'Mimo dosahu',f?`${72-f}/72 polôh`:'72/72 polôh'].forEach(t=>{const td=document.createElement('td');td.textContent=t;tr.append(td)});table.querySelector('tbody').append(tr)});$('comparison').replaceChildren(table);const p=document.createElement('p');p.className='hint';p.textContent='Rovnaké nastavenia na pracovnej geometrii všetkých veľkostí. Vlastné úpravy geometrie sa tu nepoužijú. Dosiahnuteľnosť sama neurčuje najlepší rám.';$('comparison').append(p)};
$('export').onclick=()=>{const profile={version:9,bike,pose,selectedStage,jump:{enabled:$('jump-enabled').checked,time:Number($('jump-time').value),...Object.fromEntries(jumpFields.map(([id])=>[id,Number($('j-'+id).value)]))},size:$('size').value,demo,custom,body:Object.fromEntries(body.map(([id])=>[id,$('b-'+id).value])),geometry:values('g-',geo),setup:values('s-',setup),phase:+$('phase').value};const url=URL.createObjectURL(new Blob([JSON.stringify(profile,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='kremo-fit-profil.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('import').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>20000)throw Error('Súbor je príliš veľký.');const p=JSON.parse(await f.text());if(p.version<6)p.bike='izzo';if(!catalog[p.bike])throw Error('Neznámy bicykel.');if(![1,2,3,4,5,6,7,8,9].includes(p.version)||!catalog[p.bike].sizes.concat('').includes(p.size)||typeof p.demo!=='boolean')throw Error('Neplatný profil.');if(p.version<9&&p.setup)p.setup={fronttravel:p.bike==='neuron'?140:130,reartravel:130,frontload:0,rearload:0,...p.setup};if(p.version<7&&p.setup)p.setup={bikepitch:0,bikeheight:0,...p.setup};if(p.version<6&&p.geometry)p.geometry={rimradius:311,...p.geometry};if(p.version<5 && p.setup)p.setup={footpitch:0,anklerise:65,refmin:25,refmax:30,...p.setup};if(p.version<4 && p.setup){p.setup={barwidth:760,gripinset:60,...p.setup};if(p.body)p.body={shoulders:'',...p.body};}if(p.version<3 && p.setup){p.setup={...Object.fromEntries(setup.map(([id,,,,val])=>[id,val])),...p.setup};p.pose='seated';}if(p.version>=3 && !['seated','neutral','aggressive','manual'].includes(p.pose))throw Error('Neplatná poloha jazdca.');if(p.version===1 && p.geometry){const previousBike=bike;bike=p.bike;const defaults=defaultGeo(p.size);bike=previousBike;p.geometry={...defaults,...p.geometry};}for(const [key,fields] of [['body',body],['geometry',geo],['setup',setup]]){if(!p[key]||typeof p[key]!=='object')throw Error('Chýbajú údaje profilu.');for(const [id,,min,max] of fields){const v=p[key][id];if(key==='body'&&v==='')continue;if(v===null||v===undefined||typeof v==='object'||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error('Neplatný rozmer: '+id)}}if(!Number.isFinite(p.phase)||p.phase<0||p.phase>359)throw Error('Neplatná poloha kľuky.');if(p.version>=8){if(p.selectedStage!==null&&!Object.hasOwn(jumpStages,p.selectedStage))throw Error('Neplatná fáza skoku.');if(!p.jump||typeof p.jump.enabled!=='boolean'||!Number.isFinite(p.jump.time)||p.jump.time<0||p.jump.time>1000)throw Error('Neplatné nastavenie simulácie.');for(const [id,,min,max] of jumpFields)if(!Number.isFinite(p.jump[id])||p.jump[id]<min||p.jump[id]>max)throw Error('Neplatný rozmer lavice.');}stop();jumpStop();selectedStage=p.version>=8?p.selectedStage:null;stageUI();if(p.version>=8){$('jump-enabled').checked=p.jump.enabled;$('jump-time').value=p.jump.time;for(const [id] of jumpFields)$('j-'+id).value=p.jump[id];}bike=p.bike;bikeUI(p.size);$('size').value=p.size;for(const [key,fields,prefix] of [['body',body,'b-'],['geometry',geo,'g-'],['setup',setup,'s-']])fields.forEach(([id])=>$(prefix+id).value=p[key][id]);$('phase').value=p.phase;demo=p.demo;custom=!!p.custom;pose=p.pose;poseUI();update();$('file-status').textContent='Profil načítaný.'}catch(err){$('file-status').textContent=err.message}finally{e.target.value=''}};
bikeUI('XXL');loadGeo();poseUI();update();window.fitLab={joint,model,angle,defaultGeo,bikeGeometry,posturePreset,riderCOM,armJoint3D,ankleAt,cycleAssessment};
})();











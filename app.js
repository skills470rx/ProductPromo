const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let files=[],urls=[],idx=0,timer=null,musicURL='',playing=false;const audio=$('#audio');const esc=s=>{let d=document.createElement('div');d.textContent=s;return d.innerHTML};const data=()=>({name:$('#name').value.trim(),price:$('#price').value.trim(),old:$('#old').value.trim(),tag:$('#tag').value.trim(),features:$('#features').value.split('\n').filter(Boolean),use:$('#use').value.trim(),note:$('#note').value.trim()});function slide(u,n,d,total){let m=n%4,b='';if(m===0)b=`<small>NEW PRODUCT</small><h2>${esc(d.name)}</h2><p>${esc(d.tag)}</p><span class="price">฿${esc(d.price)}</span>${d.old?`<span class="old">฿${esc(d.old)}</span>`:''}`;if(m===1)b=`<small>HIGHLIGHTS</small><h2>จุดเด่น</h2>${d.features.slice(0,4).map(x=>`<div class="feature">✦ ${esc(x)}</div>`).join('')}`;if(m===2)b=`<small>HOW TO USE</small><h2>ใช้งานง่าย</h2><p>${esc(d.use)}</p>`;if(m===3)b=`<small>GOOD TO KNOW</small><h2>${n===total-1?esc(d.name):'ข้อควรรู้'}</h2><p>${esc(d.note)}</p><span class="price">฿${esc(d.price)}</span>`;return `<section class="slide" style="--dur:${$('#duration').value}s"><div class="media"><img src="${u}"></div><div class="copy ${m?'bottom':''}">${b}</div></section>`}function build(){let d=data(),arr=urls.length?urls:['data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1100"><rect width="100%" height="100%" fill="%23142134"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="55">เพิ่มรูปสินค้า</text></svg>')];$('#slides').innerHTML=arr.map((u,n)=>slide(u,n,d,arr.length)).join('');$('#bars').innerHTML=arr.map(()=>'<i></i>').join('');$('#timeline').innerHTML=arr.map((u,n)=>`<button class="tile" data-i="${n}"><img src="${u}"></button>`).join('');$$('.tile').forEach(x=>x.onclick=()=>{stop();show(+x.dataset.i)});$$('.slide img').forEach(im=>im.onload=()=>{if(im.naturalHeight/im.naturalWidth>1.5)im.closest('.slide').classList.add('portrait')});show(0)}function show(n){let s=$$('.slide');if(!s.length)return;idx=(n+s.length)%s.length;s.forEach((x,j)=>x.classList.toggle('on',j===idx));$$('.tile').forEach((x,j)=>x.classList.toggle('on',j===idx));$$('.bars i').forEach((x,j)=>x.className=j<idx?'done':j===idx?'now':'');$('#count').textContent=`${idx+1}/${s.length}`}function play(){if(timer){stop();return}playing=true;$('#play').textContent='⏸ หยุด';if(musicURL){audio.currentTime=0;audio.play().catch(()=>{})}timer=setInterval(()=>show(idx+1),+$('#duration').value*1000)}function stop(){clearInterval(timer);timer=null;playing=false;$('#play').textContent='▶ เล่น';audio.pause()}$('#pics').onchange=e=>{files=[...e.target.files].slice(0,10);urls.forEach(URL.revokeObjectURL);urls=files.map(URL.createObjectURL);$('#picCount').textContent=`${files.length} / 10`;$('#thumbs').innerHTML=urls.map(x=>`<img src="${x}">`).join('');if(e.target.files.length>10)alert('รองรับสูงสุด 10 รูป ระบบใช้ 10 รูปแรก');build()};$('#music').onchange=e=>{let f=e.target.files[0];if(!f)return;if(musicURL)URL.revokeObjectURL(musicURL);musicURL=URL.createObjectURL(f);audio.src=musicURL;$('#musicName').textContent=f.name};$('#build').onclick=build;$('#play').onclick=play;$('#prev').onclick=()=>{stop();show(idx-1)};$('#next').onclick=()=>{stop();show(idx+1)};$('#mute').onclick=()=>{audio.muted=!audio.muted;$('#mute').textContent=audio.muted?'🔇':'🔊'};$('#theme').onchange=()=>$('#stage').className='stage '+$('#theme').value;$('#toggleEditor').onclick=()=>$('#editor').classList.toggle('open');function fs(){document.body.classList.toggle('presentation');if(document.body.classList.contains('presentation')&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})}$('#fullscreen').onclick=fs;$('#fs2').onclick=fs;

let exportState={cancel:false,blob:null,url:null,ext:'webm',mime:''};
function supportedMime(){
  const list=[
    ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],
    ['video/mp4','mp4'],
    ['video/webm;codecs=vp8,opus','webm'],
    ['video/webm;codecs=vp9,opus','webm'],
    ['video/webm','webm']
  ];
  for(const [m,e] of list) if(MediaRecorder.isTypeSupported(m)) return {mime:m,ext:e};
  return {mime:'',ext:'webm'};
}
const codec=supportedMime();
$('#codecInfo').textContent=codec.mime?`รองรับ: ${codec.ext.toUpperCase()}`:'ใช้ format เริ่มต้นของ browser';

function wrap(c,text,x,y,max,line,maxLines){
  let chars=[...String(text)],s='',lines=[];
  for(let ch of chars){let test=s+ch;if(c.measureText(test).width>max&&s){lines.push(s);s=ch}else s=test}
  if(s)lines.push(s); lines.slice(0,maxLines).forEach((l,i)=>c.fillText(l,x,y+i*line));
}
function drawFrame(ctx,W,H,im,d,si,local){
  ctx.fillStyle='#0b1018';ctx.fillRect(0,0,W,H);
  if(im&&im.naturalWidth){
    let scale=Math.max(W/im.naturalWidth,H/im.naturalHeight)*(1.08-.06*local);
    let dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
    ctx.drawImage(im,(W-dw)/2+(local-.5)*(W*.035),(H-dh)/2,dw,dh);
  }
  let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.58)');g.addColorStop(.34,'rgba(0,0,0,0)');g.addColorStop(.68,'rgba(0,0,0,.06)');g.addColorStop(1,'rgba(0,0,0,.82)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  let k=W/540;ctx.fillStyle='#ffd279';ctx.font=`700 ${18*k}px sans-serif`;
  ctx.fillText(si%4===0?'NEW PRODUCT':si%4===1?'HIGHLIGHTS':si%4===2?'HOW TO USE':'GOOD TO KNOW',34*k,70*k);
  ctx.fillStyle='white';ctx.font=`700 ${38*k}px sans-serif`;
  wrap(ctx,si%4===1?'จุดเด่น':si%4===2?'ใช้งานง่าย':si%4===3?'ข้อควรรู้':d.name,34*k,115*k,470*k,44*k,3);
  ctx.font=`${24*k}px sans-serif`;
  if(si%4===0)wrap(ctx,d.tag,34*k,220*k,470*k,32*k,2);
  else if(si%4===1)d.features.slice(0,4).forEach((x,n)=>ctx.fillText('• '+x,38*k,(690+n*42)*k));
  else wrap(ctx,si%4===2?d.use:d.note,34*k,720*k,470*k,34*k,4);
  ctx.fillStyle='#ffd279';ctx.font=`800 ${42*k}px sans-serif`;ctx.fillText('฿'+d.price,34*k,900*k);
}
async function exportVideo(){
  if(!HTMLCanvasElement.prototype.captureStream||!window.MediaRecorder){alert('เครื่องนี้ไม่รองรับ MediaRecorder');return}
  stop(); exportState.cancel=false; exportState.blob=null;
  if(exportState.url){URL.revokeObjectURL(exportState.url);exportState.url=null}
  $('#resultVideo').hidden=true;$('#previewExport').disabled=true;$('#downloadExport').disabled=true;$('#cancelExport').disabled=false;$('#export').disabled=true;
  const W=Number($('#quality').value),H=Math.round(W*16/9),dur=Number($('#duration').value)*1000,total=Math.max(1,urls.length),totalMs=dur*total;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
  const stream=canvas.captureStream(30); let ac=null,dest=null,source=null;
  if(musicURL){try{ac=new AudioContext();source=ac.createMediaElementSource(audio);dest=ac.createMediaStreamDestination();source.connect(dest);source.connect(ac.destination);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));audio.currentTime=0;await audio.play()}catch(e){console.warn(e)}}
  let opts={videoBitsPerSecond:W>=720?7000000:W>=540?4500000:2500000};if(codec.mime)opts.mimeType=codec.mime;
  let rec;try{rec=new MediaRecorder(stream,opts)}catch(e){rec=new MediaRecorder(stream);codec.ext='webm'}
  let chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);let finished=new Promise(r=>rec.onstop=r);rec.start(500);
  const ims=await Promise.all((urls.length?urls:['']).map(u=>new Promise(res=>{let im=new Image();if(!u)return res(null);im.onload=()=>res(im);im.onerror=()=>res(null);im.src=u})));
  let started=performance.now();$('#status').textContent='กำลัง Render…';
  await new Promise(resolve=>{
    function frame(now){
      let elapsed=Math.min(now-started,totalMs),si=Math.min(total-1,Math.floor(elapsed/dur)),local=(elapsed%dur)/dur;
      drawFrame(ctx,W,H,ims[si],data(),si,local);
      let pct=Math.min(100,elapsed/totalMs*100),remain=Math.max(0,totalMs-elapsed);
      $('#renderBar').style.width=pct.toFixed(1)+'%';$('#renderStep').textContent=`ภาพ ${si+1}/${total} • ${pct.toFixed(0)}%`;$('#eta').textContent=`เหลือ ~${Math.ceil(remain/1000)} วิ`;
      if(exportState.cancel||elapsed>=totalMs)return resolve();requestAnimationFrame(frame)
    }requestAnimationFrame(frame)
  });
  rec.stop();await finished;audio.pause();if(ac)await ac.close();$('#cancelExport').disabled=true;$('#export').disabled=false;
  if(exportState.cancel){$('#status').textContent='ยกเลิกแล้ว';$('#renderStep').textContent='ยังไม่ได้บันทึกไฟล์';$('#eta').textContent='—';return}
  exportState.mime=rec.mimeType||codec.mime||'video/webm';exportState.ext=exportState.mime.includes('mp4')?'mp4':'webm';
  exportState.blob=new Blob(chunks,{type:exportState.mime});exportState.url=URL.createObjectURL(exportState.blob);
  const v=$('#resultVideo');v.src=exportState.url;v.hidden=false;
  $('#renderBar').style.width='100%';$('#status').textContent='✅ Render เสร็จแล้ว';$('#renderStep').textContent=`${(exportState.blob.size/1024/1024).toFixed(1)} MB • ${exportState.ext.toUpperCase()}`;$('#eta').textContent='กดดูก่อน แล้วค่อยดาวน์โหลด';$('#previewExport').disabled=false;$('#downloadExport').disabled=false;
}
$('#cancelExport').onclick=()=>{exportState.cancel=true;$('#status').textContent='กำลังยกเลิก…'};
$('#previewExport').onclick=()=>{let v=$('#resultVideo');v.hidden=false;v.play().catch(()=>{})};
$('#downloadExport').onclick=()=>{if(!exportState.url)return;let a=document.createElement('a');a.href=exportState.url;a.download=`ProductPromo-${Date.now()}.${exportState.ext}`;a.click()};
$('#export').onclick=exportVideo;
build();
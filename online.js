// ===== SLOI: THI ĐẤU XẾP HẠNG (nạp sau sloi.js) =====
// Dán URL Firebase Realtime Database vào NET.fb để ghép trận thật giữa các máy, ví dụ 'https://ten-du-an-default-rtdb.firebaseio.com'
// Để trống = chế độ thử: chỉ ghép được với tab khác trong cùng trình duyệt (hoặc đấu với máy).
const NET={fb:'https://sloivn-default-rtdb.asia-southeast1.firebasedatabase.app',ms:1500};
const RN=['🥉 Đồng','🥈 Bạc','🥇 Vàng','💠 Bạch Kim','💎 Kim Cương','🔥 Cao Thủ','👑 Đại Cao Thủ','🐉 Huyền Thoại'];
const WIN_PTS=100,STEP=200; // thắng +100 điểm; rank r cần STEP*(r+1) điểm để lên rank r+1
const LV=[0,0,1,1,1,2,4,2,3,3,5,5,2,3,2,2,3,4,3,5,6,7]; // độ khó từng chuyên đề (đúng thứ tự các vòng 1-22)
const OL={uid:'u'+Math.random().toString(36).slice(2,8),mm:null,m:null};
const $$=id=>document.getElementById(id);

// ---- lưu trữ: LS (thử, cùng trình duyệt) / FB (Firebase REST) / MEM (đấu với máy) ----
const lk=k=>'sloi_net_'+k;
const LS={
  async get(k){try{return JSON.parse(localStorage.getItem(lk(k)))}catch(e){return null}},
  async set(k,v){localStorage.setItem(lk(k),JSON.stringify(v))},
  async del(k){localStorage.removeItem(lk(k))},
  async list(p){const o={},pf=lk(p+'/');for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(pf)&&k.indexOf('/',pf.length)<0)o[k.slice(pf.length)]=JSON.parse(localStorage.getItem(k))}return o},
  async claim(k,v){if(await this.get(k)!=null)return false;await this.set(k,v);return true}};
const FB={
  u:k=>NET.fb.replace(/\/$/,'')+'/'+k+'.json',
  async get(k){return (await fetch(this.u(k))).json()},
  async set(k,v){await fetch(this.u(k),{method:'PUT',body:JSON.stringify(v)})},
  async del(k){await fetch(this.u(k),{method:'DELETE'})},
  async list(p){return (await (await fetch(this.u(p))).json())||{}},
  async claim(k,v){const r=await fetch(this.u(k),{headers:{'X-Firebase-ETag':'true'}}),e=r.headers.get('ETag');if(await r.json()!=null)return false;return (await fetch(this.u(k),{method:'PUT',headers:{'if-match':e},body:JSON.stringify(v)})).ok}};
const MEM={d:{},async get(k){return this.d[k]??null},async set(k,v){this.d[k]=v},async del(k){delete this.d[k]},async claim(k,v){if(this.d[k]!=null)return false;this.d[k]=v;return true}};

// ---- rank ----
const rk=()=>{try{return Object.assign({r:0,p:0,w:0,l:0},JSON.parse(localStorage.getItem('sloi_rk_'+USER)||'{}'))}catch(e){return {r:0,p:0,w:0,l:0}}};
function rkAdd(win){const k=rk();if(win===true){k.w++;k.p+=WIN_PTS;while(k.r<7&&k.p>=STEP*(k.r+1)){k.p-=STEP*(k.r+1);k.r++}}else if(win===false)k.l++;try{localStorage.setItem('sloi_rk_'+USER,JSON.stringify(k))}catch(e){}return k}
const disOf=r=>r<2?0:r<5?1:2; // 0: rõ chuyên đề · 1: ẩn tên chuyên đề · 2: ẩn tên + chỉ thấy 1 test mẫu

// ---- chọn 5 bài cho trận (cùng seed = cùng đề cho cả hai người) ----
function pickP(id,r){
  let s=0;for(const c of id)s=(s*31+c.charCodeAt(0))>>>0;
  const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296};
  const lo=Math.max(0,Math.min(r-1,5)),hi=r==0?1:lo+2;
  const pool=LV.map((l,i)=>[l,i]).filter(x=>x[0]>=lo&&x[0]<=hi).map(x=>x[1]);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool.slice(0,5).sort((a,b)=>LV[a]-LV[b]).map((t,j)=>({t,k:Math.min(4,(r>>1)+(j>>1))}));
}

// ---- màn hình chính ----
function olHome(){
  const k=rk(),need=k.r<7?STEP*(k.r+1):0;
  app.innerHTML=`<div class="card"><h2>⚔️ Thi đấu xếp hạng</h2><p class="mut">Mỗi trận có 5 vòng, mỗi vòng một bài lập trình khác nhau. Ai làm đúng cả 3 test trước thì thắng vòng. Thắng nhiều vòng hơn thì thắng trận: +${WIN_PTS} điểm. Rank càng cao, đề càng khó và bối cảnh càng khó nhận ra thuật toán.</p>
  <div class="row"><h3>${RN[k.r]}</h3><span class="mut">${k.w} thắng · ${k.l} thua</span></div>
  ${need?`<div style="background:var(--bg);border-radius:8px;height:14px;overflow:hidden"><div style="width:${Math.min(100,k.p/need*100)}%;height:100%;background:var(--ac)"></div></div><p class="mut">${k.p}/${need} điểm để lên ${RN[k.r+1]}</p>`:'<p class="ok">Bạn đã đạt rank cao nhất!</p>'}
  <button onclick="olQueue()">⚔️ Ghép trận</button>
  ${NET.fb?'':'<p class="mut">Chế độ thử: chưa cấu hình máy chủ, nên chỉ ghép được với tab khác của trình duyệt này, hoặc đấu với máy sau 30 giây.</p>'}</div>
  <div class="card"><h3>Bảng rank</h3><table><tr><th>Rank</th><th>Điểm để lên rank kế</th><th>Đề</th></tr>${RN.map((n,i)=>`<tr><td>${n}</td><td>${i<7?STEP*(i+1):'-'}</td><td>${['Hiện tên chuyên đề','Hiện tên chuyên đề','Chỉ có bối cảnh','Chỉ có bối cảnh','Chỉ có bối cảnh','Bối cảnh + 1 test mẫu','Bối cảnh + 1 test mẫu','Bối cảnh + 1 test mẫu'][i]}</td></tr>`).join('')}</table></div>`;
}

// ---- ghép trận ----
function olQueue(){
  olStop();const S=NET.fb?FB:LS,now=Date.now();
  OL.mm={S,t0:now,me:{n:USER,r:rk().r,t:now}};
  app.innerHTML=`<div class="card" style="text-align:center"><h2>🔎 Đang ghép trận...</h2><div class="timer" id="mmT">00:00</div><p class="mut" id="mmI">Đang chờ đối thủ cùng rank (${RN[rk().r]}).</p><p><button id="mmBot" class="sec" style="display:none" onclick="olBot()">🤖 Đấu với máy</button> <button class="sec" onclick="tab(4)">Hủy</button></p></div>`;
  OL.mm.iv=setInterval(mmTick,NET.ms);OL.mm.ti=setInterval(()=>{const e=$$('mmT');if(!e)return;const d=Date.now()-OL.mm.t0;e.textContent=fmt(d);if(d>30000)$$('mmBot').style.display=''},500);mmTick();
}
async function mmTick(){
  const q=OL.mm;if(!q||q.tk)return;q.tk=1;
  try{
    const S=q.S,me=OL.uid,now=Date.now(),w=(now-q.t0)/1000;
    await S.set('q/'+me,Object.assign({h:now},q.me));
    const mid=await S.get('k/'+me);if(mid)return olStart(S,mid);
    const L=await S.list('q');
    const c=Object.entries(L).filter(([u,v])=>u!=me&&v&&now-v.h<15000&&(v.t>q.me.t||(v.t==q.me.t&&u>me))&&Math.abs(v.r-q.me.r)<=1+Math.floor(w/10)).sort((a,b)=>a[1].t-b[1].t)[0];
    if(c){const id=me+'_'+c[0]+'_'+now;
      await S.set('m/'+id,{r:Math.floor((q.me.r+c[1].r)/2),a:me,an:USER,b:c[0],bn:c[1].n});
      if(await S.claim('k/'+c[0],id)){if(await S.claim('k/'+me,id))return olStart(S,id);await S.del('k/'+c[0])}}
  }catch(e){const i=$$('mmI');if(i)i.innerHTML='<span class="bad">⚠️ Không kết nối được máy chủ ghép trận ('+esc(e.message)+'). Đang thử lại...</span>'}
  finally{q.tk=0}
}
function olClearMM(){if(OL.mm){clearInterval(OL.mm.iv);clearInterval(OL.mm.ti);try{OL.mm.S.del('q/'+OL.uid);OL.mm.S.del('k/'+OL.uid)}catch(e){}OL.mm=null}}
async function olStart(S,id){
  const M0=await S.get('m/'+id);olClearMM();if(!M0)return tab(4);
  olInit(S,id,M0.r,M0.a==OL.uid?M0.bn:M0.an,0);
}
function olBot(){olClearMM();MEM.d={};olInit(MEM,'bot'+Date.now(),rk().r,'Bot SLOI',1)}
function olInit(S,id,r,opp,bot){
  OL.m={s:S,id,r,opp,bot,probs:pickP(id,r),j:0,me:0,op:0,RT:420+r*60,dis:disOf(r),hist:[]};olRound();
}

// ---- một vòng đấu ----
function olRound(){
  const M=OL.m,P=M.probs[M.j],d=ALL[P.t],[q,ts]=T[P.t][P.k],vis=M.dis>=2?1:3;
  M.over=false;M.busy=false;M.rt0=Date.now();
  app.innerHTML=`<div class="card"><div class="row"><b>⚔️ Vòng ${M.j+1}/5 · ${esc(USER)} ${M.me} - ${M.op} ${esc(M.opp)}</b><span class="timer" id="olT">${fmt(M.RT*1000)}</span></div>
  ${M.dis==0?`<p class="mut">Chuyên đề: <b>${esc(d.n)}</b></p>`:''}
  <div class="det"><b>📖 Bối cảnh</b><br>${STORY[P.t]||''}</div>
  <p><b>📝 Nhiệm vụ:</b> ${esc(q)}</p>
  ${ts.slice(0,vis).map((t,j)=>`<p><b>Input ${j+1}</b></p><pre>${esc(t[0])}</pre><p class="mut"><b>Output mong đợi ${j+1}</b></p><pre>${esc(expOut(t[1]))}</pre>`).join('')}
  ${vis<3?'<p class="mut">Còn các test ẩn, code được chấm trên cả 3 test.</p>':''}
  <p><b>Code C++ của bạn</b></p><textarea id="code" spellcheck="false"></textarea>
  <p><button id="olSub" onclick="olSubmit()">▶ Chạy &amp; Nộp bài</button> <button class="sec" onclick="olQuit()">Bỏ trận</button></p><div id="olRes"></div></div>`;
  $('#code').value=TPL;$('#code').onkeydown=k=>{if(k.key=='Tab'){k.preventDefault();const t=k.target;t.setRangeText('    ',t.selectionStart,t.selectionEnd,'end')}};
  clearInterval(M.iv);M.iv=setInterval(olTick,1000);
  if(M.bot){clearTimeout(M.bt);const j=M.j;M.bt=setTimeout(async()=>{if(OL.m===M&&M.j==j&&!M.over)await M.s.claim('m/'+M.id+'/w'+j,'bot')},(Math.max(45,220-M.r*20)+Math.random()*70+M.j*15)*1000)}
}
async function olTick(){
  const M=OL.m;if(!M||M.over||M.tk)return;M.tk=1;
  try{
    const left=M.RT-(Date.now()-M.rt0)/1000,e=$$('olT');if(e)e.textContent=fmt(Math.max(0,left)*1000);
    const f=await M.s.get('m/'+M.id+'/f');if(f&&f!=OL.uid)return olFinish(true);
    const k='m/'+M.id+'/w'+M.j;let w=await M.s.get(k);
    if(w==null&&left<=0){await M.s.claim(k,'none');w=await M.s.get(k)}
    if(w!=null)olRoundEnd(w);
  }catch(e){}finally{M.tk=0}
}
async function olSubmit(){
  const M=OL.m,j=M.j;if(!M||M.busy||M.over)return;
  const P=M.probs[j],ts=T[P.t][P.k][1],res=$$('olRes'),b=$$('olSub');
  M.busy=true;b.disabled=true;res.innerHTML='<p class="mut">⏳ Đang chấm...</p>';
  const S=await judge(ts,res);M.busy=false;
  if(OL.m!==M||M.j!=j||M.over)return;b.disabled=false;if(!S)return;
  const ok=S.map((x,i)=>x.status.id==3&&enc(ub(x.stdout))===ts[i][1]);
  if(!ok.every(Boolean)){res.innerHTML='<p class="bad">❌ Đúng '+ok.filter(Boolean).length+'/3 test. Sửa code và nộp lại.</p>'+(S.find(x=>x.status.id==6)?'<pre>'+esc(ub(S.find(x=>x.status.id==6).compile_output)).slice(0,800)+'</pre>':'');return}
  if(await M.s.claim('m/'+M.id+'/w'+j,OL.uid))olRoundEnd(OL.uid);
  else olRoundEnd(await M.s.get('m/'+M.id+'/w'+j));
}
function olRoundEnd(w){
  const M=OL.m;if(!M||M.over)return;M.over=true;clearInterval(M.iv);clearTimeout(M.bt);
  const mine=w==OL.uid;if(mine){M.me++;fx()}else if(w!='none')M.op++;
  const msg=mine?'🎉 Bạn thắng vòng này!':w=='none'?'⌛ Hết giờ, không ai thắng vòng này.':'😓 '+esc(M.opp)+' đã giải xong trước.';
  const r=$$('olRes');if(r)r.innerHTML=`<p class="${mine?'ok':'bad'}">${msg} Tỉ số ${M.me} - ${M.op}.</p>`;
  const b=$$('olSub');if(b)b.disabled=true;
  setTimeout(()=>{if(OL.m!==M)return;if(++M.j<5)olRound();else olFinish(false)},3500);
}
async function olFinish(forfeit){
  const M=OL.m;if(!M||M.done)return;M.done=true;clearInterval(M.iv);clearTimeout(M.bt);
  const res=forfeit||M.me>M.op?true:M.me<M.op?false:null,before=rk().r,k=rkAdd(res);
  const t=res===true?'🏆 Bạn thắng trận!':res===false?'😢 Bạn thua trận':'🤝 Hòa';
  app.innerHTML=`<div class="card" style="text-align:center"><h2>${t}</h2><p>${esc(USER)} ${M.me} - ${M.op} ${esc(M.opp)}${forfeit?' (đối thủ đã rời trận)':''}</p>
  <p class="${res===true?'ok':'mut'}">${res===true?'+'+WIN_PTS+' điểm':'+0 điểm'}</p>${k.r>before?`<h3 class="ok">🎊 Lên rank ${RN[k.r]}!</h3>`:''}<p>${RN[k.r]}${k.r<7?` · ${k.p}/${STEP*(k.r+1)} điểm`:''}</p>
  <button onclick="olQueue()">⚔️ Trận mới</button> <button class="sec" onclick="tab(4)">Về trang xếp hạng</button></div>`;
  if(res===true){fx();setTimeout(fx,500)}
  OL.m=null;
}
function olQuit(){if(confirm('Bỏ trận sẽ bị xử thua. Bạn chắc chứ?')){olStop(true);tab(4)}}
function olStop(quit){
  olClearMM();const M=OL.m;
  if(M){clearInterval(M.iv);clearTimeout(M.bt);if(!M.done){try{M.s.set('m/'+M.id+'/f',OL.uid)}catch(e){}rkAdd(false)}OL.m=null}
}
window.addEventListener('beforeunload',()=>{if(OL.mm)try{OL.mm.S.del('q/'+OL.uid)}catch(e){}});

// ---- gắn vào thanh tab có sẵn ----
{const _tr=tabRaw,_lo=logout;
tabRaw=function(k){olStop();if(k==4){if(R2)clearInterval(R2.iv);if(typeof simStop=='function')simStop();[1,2,3].forEach(i=>$('#b'+i).className='sec');$('#b4').className='';olHome();return}$('#b4').className='sec';_tr(k)};
logout=function(){olStop();_lo()};
$('#b4').onclick=()=>tab(4);}

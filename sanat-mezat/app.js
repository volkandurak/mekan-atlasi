const works=[
 {group:'Peyzaj',name:'Peyzaj I',id:'p1',img:'assets/peyzaj-1.jpg'},
 {group:'Peyzaj',name:'Peyzaj II',id:'p2',img:'assets/peyzaj-2.jpg'},
 {group:'Peyzaj',name:'Peyzaj III',id:'p3',img:'assets/peyzaj-3.jpg'},
 {group:'Figür',name:'Figür I',id:'f1',img:'assets/figur-1.jpg'},
 {group:'Figür',name:'Figür II',id:'f2',img:'assets/figur-2.jpg'},
 {group:'Figür',name:'Figür III',id:'f3',img:'assets/figur-3.jpg'},
 {group:'Renkli Peyzaj',name:'Renkli Peyzaj I',id:'r1',img:'assets/renkli-peyzaj-1.jpg'},
 {group:'Renkli Peyzaj',name:'Renkli Peyzaj II',id:'r2',img:'assets/renkli-peyzaj-2.jpg'},
 {group:'Renkli Peyzaj',name:'Renkli Peyzaj III',id:'r3',img:'assets/renkli-peyzaj-3.jpg'}
];
const END=72*60*60*1000, OPEN=5000, STEP=500, BUY=18000;
const groupsEl=document.getElementById('groups');
const fmtTL=n=>Number(n).toLocaleString('tr-TR')+' TL';
function state(){return JSON.parse(localStorage.getItem('sm_bids')||'{}')}
function user(){return JSON.parse(localStorage.getItem('sm_user')||'null')}
function getState(id){return state()[id]||{p:OPEN,c:0,start:null}}
function render(){['Peyzaj','Figür','Renkli Peyzaj'].forEach(group=>{const section=document.createElement('section');section.className='group';section.innerHTML=`<h3>${group}</h3><div class="grid"></div>`;const grid=section.querySelector('.grid');works.filter(w=>w.group===group).forEach(w=>{const d=getState(w.id);const card=document.createElement('article');card.className='art-card';card.dataset.id=w.id;card.dataset.name=w.name;card.dataset.img=w.img;card.innerHTML=`<img class="art-image open-detail" src="${w.img}" alt="${w.name}"><div class="card-body"><h4 class="open-detail">${w.name}</h4><div class="meta">Volkan Durak · Tuval üzerine akrilik · 50 × 70 cm</div><div class="bid-row"><div><div class="meta">Güncel pey</div><div class="price cp">${fmtTL(d.p)}</div><div class="meta"><span class="cnt">${d.c}</span> pey</div></div><div style="text-align:right"><div class="meta">Hemen Al</div><div class="price">${fmtTL(BUY)}</div></div></div><div class="step">Pey artış miktarı: 500 TL</div><div class="timer ${d.start?'':'wait'}"></div><div class="actions"><button class="btn btn-dark bid">Pey Ver</button><button class="btn btn-outline buy">Hemen Al</button></div></div>`;grid.append(card)});groupsEl.append(section)})}
render();
const $=s=>document.querySelector(s), overlay=$('#overlay'), accountModal=$('#accountModal'), bidModal=$('#bidModal'), detailModal=$('#detailModal'), toastEl=$('#toast');
let active=null;
function toast(t){toastEl.textContent=t;toastEl.classList.add('on');setTimeout(()=>toastEl.classList.remove('on'),1800)}
function show(modal){overlay.classList.remove('hidden');modal.classList.remove('hidden')}
function hideAll(){overlay.classList.add('hidden');document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'))}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=hideAll);overlay.onclick=hideAll;
function syncAccount(){const u=user();$('#accountBtn').textContent=u?u.name:'Hesap Aç / Giriş';$('#loggedInBox').classList.toggle('hidden',!u);$('#authBox').classList.toggle('hidden',!!u);if(u){$('#userName').textContent=u.name;$('#userInfo').textContent=u.email+' · '+u.phone}}
function openAccount(){syncAccount();show(accountModal)}
$('#accountBtn').onclick=$('#accountBtn2').onclick=openAccount;
$('#saveAccount').onclick=()=>{const u={name:$('#nameInput').value.trim(),phone:$('#phoneInput').value.trim(),city:$('#cityInput').value.trim(),email:$('#emailInput').value.trim(),pass:$('#passInput').value};if(u.name.length<3||u.phone.length<10||!u.email.includes('@')||u.pass.length<6){$('#authError').textContent='Bilgileri eksiksiz girin; şifre en az 6 karakter olsun.';return}localStorage.setItem('sm_user',JSON.stringify(u));$('#authError').textContent='';hideAll();syncAccount();toast('Hesap hazır. Artık pey verebilirsiniz.')};
$('#logoutBtn').onclick=()=>{localStorage.removeItem('sm_user');syncAccount()};
function remaining(ms){if(ms<=0)return 'Müzayede sona erdi';let s=Math.floor(ms/1000),d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;return `${d} gün ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} kaldı`}
function syncCards(){document.querySelectorAll('.art-card').forEach(card=>{const d=getState(card.dataset.id);card.querySelector('.cp').textContent=fmtTL(d.p);card.querySelector('.cnt').textContent=d.c;const t=card.querySelector('.timer');if(d.start){t.classList.remove('wait');t.textContent=remaining(d.start+END-Date.now())}else{t.classList.add('wait');t.textContent='İlk pey verildiğinde 3 günlük müzayede başlar.'}});if(active&&!detailModal.classList.contains('hidden')){const d=getState(active.dataset.id);$('#detailPrice').textContent=fmtTL(d.p);$('#detailCount').textContent=d.c;const t=$('#detailTimer');if(d.start){t.classList.remove('wait');t.textContent=remaining(d.start+END-Date.now())}else{t.classList.add('wait');t.textContent='İlk pey verildiğinde 3 günlük müzayede başlar.'}}}
function startBid(card){if(!user()){openAccount();toast('Önce hesap açın.');return}const d=getState(card.dataset.id);if(d.start&&Date.now()>=d.start+END){toast('Bu müzayede sona erdi.');return}active=card;$('#bidTitle').textContent=card.dataset.name;$('#bidCurrent').textContent=d.c===0?'Açılış fiyatı '+fmtTL(OPEN):'Güncel pey '+fmtTL(d.p);$('#bidInput').value=d.c===0?OPEN:d.p+STEP;$('#bidError').textContent='';show(bidModal)}
function openDetail(card){active=card;const d=getState(card.dataset.id);$('#detailImage').src=card.dataset.img;$('#detailName').textContent=card.dataset.name;$('#detailPrice').textContent=fmtTL(d.p);$('#detailCount').textContent=d.c;syncCards();show(detailModal)}
document.addEventListener('click',e=>{const card=e.target.closest('.art-card');if(card&&e.target.closest('.open-detail'))openDetail(card);if(card&&e.target.classList.contains('bid'))startBid(card);if(e.target.classList.contains('buy')){if(!user()){openAccount();return}toast('18.000 TL Hemen Al talebiniz kaydedildi.')}})
$('#detailBid').onclick=()=>{hideAll();startBid(active)};$('#detailBuy').onclick=()=>{if(!user()){hideAll();openAccount();return}toast('18.000 TL Hemen Al talebiniz kaydedildi.')};
$('#confirmBid').onclick=()=>{const all=state(),d=getState(active.dataset.id),v=Number($('#bidInput').value);let next;if(d.c===0){if(v!==OPEN){$('#bidError').textContent='İlk pey 5.000 TL olmalıdır.';return}next={p:OPEN,c:1,start:Date.now()}}else{if(Date.now()>=d.start+END){$('#bidError').textContent='Müzayede sona erdi.';return}if(v!==d.p+STEP){$('#bidError').textContent='Sıradaki pey '+fmtTL(d.p+STEP)+' olmalıdır.';return}next={p:v,c:d.c+1,start:d.start}}all[active.dataset.id]=next;localStorage.setItem('sm_bids',JSON.stringify(all));hideAll();syncCards();toast('Peyiniz kaydedildi: '+fmtTL(next.p))};
syncAccount();syncCards();setInterval(syncCards,1000);
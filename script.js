const upgrades=[
{id:'finger',name:'Fast Finger',icon:'☝️',desc:'+1 per click',base:15,type:'click',amt:1},
{id:'hype',name:'Hype Train',icon:'🚂',desc:'+4 per click',base:90,type:'click',amt:4},
{id:'editor',name:'Clip Editor',icon:'✂️',desc:'+1 every second',base:45,type:'auto',amt:1},
{id:'stream',name:'Stream Setup',icon:'🎙️',desc:'+5 every second',base:260,type:'auto',amt:5},
{id:'crew',name:'la4awale Crew',icon:'👥',desc:'+20 every second',base:1350,type:'auto',amt:20},
{id:'empire',name:'Content Empire',icon:'👑',desc:'+75 every second',base:6200,type:'auto',amt:75},
{id:'sponsor',name:'Big Sponsor',icon:'💼',desc:'+250 every second',base:24000,type:'auto',amt:250},
{id:'planet',name:'la4awale Planet',icon:'🪐',desc:'+1000 every second',base:120000,type:'auto',amt:1000}
];
const KEY='la4awale-clicker-v1';
const fresh=()=>({score:0,clicks:0,total:0,owned:{},last:Date.now()});
let state=load();
function owned(id,s=state){return s.owned[id]||0}
function perClick(s=state){return 1+upgrades.filter(u=>u.type==='click').reduce((a,u)=>a+owned(u.id,s)*u.amt,0)}
function perSec(s=state){return upgrades.filter(u=>u.type==='auto').reduce((a,u)=>a+owned(u.id,s)*u.amt,0)}
function cost(u){return Math.floor(u.base*Math.pow(1.16,owned(u.id)))}
function fmt(n){if(n<1000)return Math.floor(n).toLocaleString();const u=['K','M','B','T','Qa','Qi'];let i=-1;while(n>=1000&&i<u.length-1){n/=1000;i++}return n.toFixed(n>=100?0:n>=10?1:2)+u[i]}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return fresh();const s={...fresh(),...JSON.parse(raw)};const away=Math.min(28800,Math.max(0,(Date.now()-s.last)/1000));const a=perSec(s);if(away>5&&a){const gain=Math.floor(away*a);s.score+=gain;s.total+=gain;setTimeout(()=>toast('Offline bonus: +'+fmt(gain)),250)}return s}catch{return fresh()}}
function save(show=false){state.last=Date.now();localStorage.setItem(KEY,JSON.stringify(state));if(show)toast('Saved')}
function render(){score.textContent=fmt(state.score);perClickEl.textContent=fmt(perClick());perSecond.textContent=fmt(perSec());clicks.textContent=fmt(state.clicks);shopList.innerHTML=upgrades.map(u=>{const c=cost(u),n=owned(u.id);return '<div class="item"><div class="icon">'+u.icon+'</div><div><h3>'+u.name+'</h3><p>'+u.desc+'</p><span class="owned">Owned: '+n+'</span></div><button class="buy" data-id="'+u.id+'" '+(state.score<c?'disabled':'')+'>Buy<small>'+fmt(c)+'</small></button></div>'}).join('');document.querySelectorAll('.buy').forEach(b=>b.onclick=()=>buy(b.dataset.id))}
function buy(id){const u=upgrades.find(x=>x.id===id),c=cost(u);if(state.score<c)return;state.score-=c;state.owned[id]=owned(id)+1;save();render();toast(u.name+' purchased')}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1400)}
function floatText(x,y,t){const e=document.createElement('div');e.className='float';e.textContent=t;e.style.left=(x-8)+'px';e.style.top=(y-10)+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),720)}
const score=document.getElementById('score'),perClickEl=document.getElementById('perClick'),perSecond=document.getElementById('perSecond'),clicks=document.getElementById('clicks'),shopList=document.getElementById('shopList'),mainClick=document.getElementById('mainClick');
mainClick.addEventListener('click',e=>{const g=perClick();state.score+=g;state.total+=g;state.clicks++;mainClick.classList.add('pop');setTimeout(()=>mainClick.classList.remove('pop'),80);floatText(e.clientX||innerWidth/2,e.clientY||innerHeight/2,'+'+fmt(g));render()});
document.getElementById('saveBtn').onclick=()=>save(true);
document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset all la4awale progress?')){state=fresh();save();render();toast('Progress reset')}};
setInterval(()=>{const a=perSec();if(a){state.score+=a/10;state.total+=a/10;render()}},100);
setInterval(()=>save(),10000);addEventListener('beforeunload',()=>save());render();
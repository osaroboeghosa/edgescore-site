shell();
let mode='Quant',Q='',F=null,T,QR=[],CR=[],QD='-',CD='-';
const k=(v,t,c)=>'<div class="kpi"><b class="'+(c||'')+'">'+v+'</b><span>'+t+'</span></div>';
function draw(){const cq=mode==='Quant',rows=cq?QR:CR,n=rows.length,srt=rows.slice().sort((x,y)=>y.sc-x.sc),th=cq?5:3,d=cq?1:0;
$('sub').textContent=(cq?'Quant v2 scores as of '+QD:'Classic matrix scores as of '+CD)+' | '+n+' markets';
$('kp').innerHTML=k(rows.filter(x=>x.sc>=th).length,'Bullish (score +'+th+' or more)','pos')+k(rows.filter(x=>x.sc<=-th).length,'Bearish (score -'+th+' or less)','neg')+k(srt[0].s+' '+sgn(srt[0].sc,d),'Strongest','pos')+k(srt[n-1].s+' '+sgn(srt[n-1].sc,d),'Weakest','neg');
T=table('t',cq?QC:CC,rows,{sort:'sc',go:s=>location.href=(mode==='Classic'?'classic.html?s=':'asset.html?symbol=')+s});
T.search(Q);T.filter(F);$('nt').textContent=cq?NQ:NC}
(async()=>{try{
const [q,a,l,t]=await Promise.all([api('quant_latest?select=*'),api('atr_heat?select=symbol,state&order=as_of.desc&limit=60'),api('asset_levels?select=symbol,sma_signal&order=as_of.desc&limit=60'),api('top_setups?select=*')]);
const A={},L={};a.forEach(x=>{if(!A[x.symbol])A[x.symbol]=x});l.forEach(x=>{if(!L[x.symbol])L[x.symbol]=x});
const tv=s=>(L[s]||{}).sma_signal||'-',vv=s=>(A[s]||{}).state||'-';
QD=q[0]?q[0].as_of:'-';CD=t[0]?String(t[0].as_of).slice(0,10):'-';
QR=q.map(x=>{const c=x.components||{};return{s:x.symbol,cl:CL[x.symbol]||'Other',sc:+x.score,tr:tv(x.symbol),vol:vv(x.symbol),trend:c.trend,macro:c.macro,carry:c.carry,cot:c.cot,retail:c.retail,risk:c.risk,season:c.season,rates:c.rates,real:c.real,dollar:c.dollar,cv:+x.coverage}});
CR=t.map(x=>{let c=x.components;if(typeof c==='string'){try{c=JSON.parse(c)}catch(e){c={}}}c=c||{};const g=z=>+c[z]||0,v=Object.keys(c).map(z=>+c[z]||0);return{s:x.symbol,cl:CL[x.symbol]||'Other',sc:+x.score,bias:x.bias,tr:tv(x.symbol),vol:vv(x.symbol),bull:v.filter(z=>z>0).length,bear:v.filter(z=>z<0).length,seas:g('seasonality'),cot:g('cot'),mac:MAC.reduce((s,z)=>s+g(z),0)}});
$('md').innerHTML=['Quant','Classic'].map((c,i)=>'<span class="chip'+(i?'':' on')+'">'+c+'</span>').join(' ');
document.querySelectorAll('#md .chip').forEach(e=>e.onclick=()=>{document.querySelectorAll('#md .chip').forEach(z=>z.classList.remove('on'));e.classList.add('on');mode=e.textContent;draw()});
$('ch').innerHTML=['All','Forex','Indices','Commodities'].map((c,i)=>'<span class="chip'+(i?'':' on')+'">'+c+'</span>').join(' ');
document.querySelectorAll('#ch .chip').forEach(e=>e.onclick=()=>{document.querySelectorAll('#ch .chip').forEach(z=>z.classList.remove('on'));e.classList.add('on');const c=e.textContent;F=c==='All'?null:x=>x.cl===c;T.filter(F)});
$('q').oninput=e=>{Q=e.target.value;T.search(Q)};
draw();
}catch(e){$('sub').textContent='Error: '+e.message}})();

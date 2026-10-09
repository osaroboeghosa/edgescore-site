shell();
var W;
const SY=(new URLSearchParams(location.search).get('symbol')||'EURUSD').toUpperCase().replace(/[^A-Z0-9]/g,''),
OW={carry:27,esi:18,pmi:18,vix:9,cot:9,retail:19},
V={fx:{trend:30,carry:20,macro:20,cot:10,retail:8,risk:7,season:5},index:{trend:35,macro:25,cot:10,risk:10,rates:7,retail:8,season:5},pre:{trend:35,real:25,dollar:12,cot:10,retail:8,risk:5,season:5},cu:{trend:35,macro:25,cot:10,risk:10,retail:8,season:7,dollar:5}},
CLS=/^(EURUSD|GBPUSD|AUDUSD|NZDUSD|USDJPY|USDCAD|USDCHF)$/.test(SY)?'fx':/^(GOLD|SILVER|PLATINUM)$/.test(SY)?'pre':SY==='COPPER'?'cu':'index',
bias=s=>s>=20?'Bullish':s>=5?'Mild bullish':s>-5?'Neutral':s>-20?'Mild bearish':'Bearish',
tq=p=>api(p).catch(()=>[]),
pct1=v=>v==null?'-':(v>0?'+':'')+Math.round(v*100),
LB={trend:'Momentum',real:'Real Yield',dollar:'USD',retail:'Crowd',season:'Seasonality',cot:'COT',macro:'Macro',carry:'Carry',risk:'Risk',rates:'Rates'};
(async()=>{try{
const [q,h,ps,lv,av,bt]=await Promise.all([tq('quant_latest?symbol=eq.'+SY),tq('quant_scores?select=as_of,score&symbol=eq.'+SY+'&order=as_of.asc&limit=400'),tq('price_series?symbol=eq.'+SY),tq('asset_levels?symbol=eq.'+SY+'&order=as_of.desc&limit=1'),tq('atr_heat?symbol=eq.'+SY+'&order=as_of.desc&limit=1'),tq('backtest_results?symbol=in.('+SY+',ALL)&order=kind.asc,horizon.asc,symbol.asc')]);
$('ttl').textContent=SY;
if(!q.length){$('sub').textContent='No data for this symbol.';return}
const r=q[0],sc=+r.score,c=r.components||{};
W=('esi' in c)?OW:V[CLS];
const L=lv[0],A=av[0],bs=bias(sc),K=Object.keys(W);
const k=(v,l,x)=>'<div class="kpi"><b class="'+(x||'')+'">'+v+'</b><span>'+l+'</span></div>';
$('sub').textContent='Updated '+r.as_of+' | '+(W===OW?'old model':'Quant v2')+' | data coverage '+num(r.coverage,0)+'%';
$('kp').innerHTML=k(sgn(sc),'Quant score',cls(sc))+k(bs,'Bias',cls(sc))+k(L?L.sma_signal:'-','Trend vs SMA50/200')+k(A?A.state:'-','Volatility'+(A?' ('+num(A.atr_ratio,2)+'x)':''));
const P=ps[0];
if(P){const dr=n=>lineChart('pc',P.dates.slice(-n),[{n:'Close',c:'#e2e8f0',w:2,v:P.close.slice(-n)},{n:'SMA50',c:'#fbbf24',v:P.sma50.slice(-n)},{n:'SMA200',c:'#f87171',d:1,v:P.sma200.slice(-n)}]);dr(126);document.querySelectorAll('.chip[data-n]').forEach(e=>e.onclick=()=>dr(+e.dataset.n))}else $('pc').innerHTML='<div class="sub">No price data yet.</div>';
const R=70,pt=a=>[100+R*Math.cos(a*Math.PI/180),95+R*Math.sin(a*Math.PI/180)],arc=(s,e,col)=>{const m=pt(s),n=pt(e);return'<path d="M'+m[0]+' '+m[1]+'A'+R+' '+R+' 0 0 1 '+n[0]+' '+n[1]+'" stroke="'+col+'" stroke-width="16" fill="none"/>'},nd=pt(-180+(Math.max(-50,Math.min(50,sc))+50)/100*180);
$('gg').innerHTML=arc(-180,-120,'#f87171')+arc(-120,-60,'#475569')+arc(-60,0,'#34d399')+'<line x1="100" y1="95" x2="'+(100+(nd[0]-100)*.85)+'" y2="'+(95+(nd[1]-95)*.85)+'" stroke="#fff" stroke-width="3"/><circle cx="100" cy="95" r="5" fill="#fff"/><text x="100" y="114" text-anchor="middle" fill="#e2e8f0" font-size="13">'+sgn(sc)+' '+bs+'</text>';
$('cp').innerHTML=K.map(z=>{const v=c[z];return'<div class="cr"><span>'+(LB[z]||z)+' <small class="mut">'+W[z]+'%</small></span><div class="bar">'+(v==null?'':'<i style="left:'+(v<0?50+v*50:50)+'%;width:'+Math.abs(v)*50+'%;background:'+(v>0?'#34d399':'#f87171')+'"></i>')+'</div><b class="'+cls(v)+'">'+pct1(v)+'</b></div>'}).join('')+'<div class="sub">COT regime: '+(r.cot_regime||'n/a')+'</div>';
lineChart('sh',h.map(z=>z.as_of),[{n:'Score',c:'#60a5fa',w:2,v:h.map(z=>+z.score)}],{zero:1,h:170});
more({r,sc,c,L,A,bs,K,bt});
}catch(e){$('sub').textContent='Error: '+e.message}})();

shell();
const GR={USDCAD:'Forex',USDCHF:'Forex',USDJPY:'Forex',GBPUSD:'Forex',EURUSD:'Forex',AUDUSD:'Forex',NZDUSD:'Forex',NIKKEI:'Indices',NASDAQ:'Indices',DOW:'Indices',DAX:'Indices',SPX500:'Indices',UK100:'Indices',COPPER:'Commodities',SILVER:'Commodities',GOLD:'Commodities',PLATINUM:'Commodities'};
const KS=['trend','seasonality','cot','crowd','gdp','mpmi','spmi','retail','cnsmr','cpi','ppi','pce','rates','nfp','unemp','claims','adp','jolts'];
const AB=['tren','seas','cot','crow','gdp','mpmi','spmi','reta','cnsm','cpi','ppi','pce','rate','nfp','unem','clai','adp','jolt'];
const bc=b=>/Bull/.test(b)?'pos':/Bear/.test(b)?'neg':'mut';
const col=v=>v>=2?'#15803d':v>0?'#1f5c3a':v===0?'#1e2440':v>-2?'#6b2d34':'#b91c1c';
(async()=>{try{
const d=await api('top_setups?select=*&order=score.desc');
const rows=d.map(x=>{let c=x.components;if(typeof c==='string'){try{c=JSON.parse(c)}catch(e){c={}}}c=c||{};const v=KS.map(k=>+c[k]||0);return{sym:x.symbol,grp:GR[x.symbol]||'Other',score:+x.score,bias:x.bias,bull:v.filter(z=>z>0).length,bear:v.filter(z=>z<0).length,v:v,as:String(x.as_of||'').slice(0,10)}});
function show(s){const r=rows.find(x=>x.sym===s);$('dc').style.display='block';
$('dt').innerHTML=s+' <span class="'+bc(r.bias)+'">'+sgn(r.score,0)+' '+r.bias+'</span>';
$('dt').innerHTML+=' <a href="asset.html?symbol='+s+'" style="font-size:13px;margin-left:8px">Full analysis &rarr;</a>';
$('db').innerHTML=KS.map((k,i)=>{const v=r.v[i];return'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:84px;font-size:13px">'+k+'</span><div style="flex:1;height:8px;background:#1e2440;border-radius:4px;position:relative"><div style="position:absolute;height:8px;border-radius:4px;background:'+(v>0?'#2dd4bf':'#f87171')+';left:'+(v>=0?50:50+v*25)+'%;width:'+Math.abs(v)*25+'%"></div></div><b class="'+cls(v)+'" style="width:26px;text-align:right">'+sgn(v,0)+'</b></div>'}).join('');
$('dc').scrollIntoView({behavior:'smooth'})}
const bu=rows.filter(r=>r.score>=3).length,be=rows.filter(r=>r.score<=-3).length;
$('sub').textContent=rows.length+' markets | 18-component matrix | tap a row for the breakdown';
$('kp').innerHTML=[[rows.length,'Markets',''],[bu,'Bullish','pos'],[be,'Bearish','neg'],[rows.length?rows[0].as:'-','Updated','']].map(z=>'<div class="kpi"><b class="'+z[2]+'">'+z[0]+'</b><span>'+z[1]+'</span></div>').join('');
const T=table('tb',[{k:'sym',t:'Market'},{k:'grp',t:'Group'},{k:'score',t:'Score',f:r=>sgn(r.score,0),c:r=>cls(r.score)},{k:'bias',t:'Bias',c:r=>bc(r.bias)},{k:'bull',t:'Bull',c:r=>'pos'},{k:'bear',t:'Bear',c:r=>'neg'}],rows,{sort:'score',asc:false,go:show});
$('cp').innerHTML=['All','Forex','Indices','Commodities','Bullish','Bearish'].map((g,i)=>'<button'+(i?'':' class="on"')+'>'+g+'</button>').join('');
$('cp').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('cp').querySelectorAll('button').forEach(x=>x.className='');b.className='on';const g=b.textContent;T.filter(g==='All'?null:g==='Bullish'?r=>r.score>=3:g==='Bearish'?r=>r.score<=-3:r=>r.grp===g)});
$('q').oninput=e=>T.search(e.target.value);
$('hm').innerHTML='<table class="hm"><tr><th>Market</th>'+AB.map(a=>'<th>'+a+'</th>').join('')+'</tr>'+rows.map(r=>'<tr data-s="'+r.sym+'" style="cursor:pointer"><td>'+r.sym+'</td>'+r.v.map(v=>'<td style="background:'+col(v)+'">'+(v?sgn(v,0):'')+'</td>').join('')+'</tr>').join('')+'</table>';
$('hm').querySelectorAll('tr[data-s]').forEach(t=>t.onclick=()=>show(t.dataset.s));
  const sp=new URLSearchParams(location.search).get('s');if(sp&&rows.some(r=>r.sym===sp))show(sp);
}catch(e){$('sub').textContent='Error: '+e.message}})();

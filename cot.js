shell();
const GR={AUDUSD:'Forex',EURUSD:'Forex',GBPUSD:'Forex',NZDUSD:'Forex',USDCAD:'Forex',USDCHF:'Forex',USDJPY:'Forex',DOW:'Indices',NASDAQ:'Indices',NIKKEI:'Indices',SPX500:'Indices',COPPER:'Commodities',GOLD:'Commodities',PLATINUM:'Commodities',SILVER:'Commodities'};
const S=Object.keys(GR).sort();
const fmt=v=>Math.abs(v)>=1000?num(v/1000,1)+'k':num(v,0);
const sg=v=>(v>0?'+':'')+fmt(v);
(async()=>{try{
const A=await Promise.all(S.map(s=>api('cot?select=report_date,long_pos,short_pos&symbol=eq.'+s+'&order=report_date.asc&limit=200')));
const D={};
const rows=S.map((s,i)=>{const r=A[i],n=r.length;if(n<2)return null;const ne=r.map(a=>a.long_pos-a.short_pos),a=ne[n-1],t=r[n-1];D[s]=r;const p=Math.round(ne.filter(v=>v<=a).length/n*100);return{sym:s,grp:GR[s],net:a,chg:a-ne[n-2],pct:p,zone:p>=90?'Crowded long':p<=10?'Crowded short':'Mid-range',lp:t.long_pos/(t.long_pos+t.short_pos)*100,per:t.report_date}}).filter(Boolean);
function show(s){const r=D[s],n=r.length,ne=r.map(a=>a.long_pos-a.short_pos),d=r.map(a=>a.report_date),w=rows.find(x=>x.sym===s);
$('sy').value=s;
$('ds').innerHTML='Net <b class="'+cls(w.net)+'">'+sg(w.net)+'</b> | Week <b class="'+cls(w.chg)+'">'+sg(w.chg)+'</b> | Percentile <b>'+w.pct+'%</b> | Long '+num(w.lp,0)+'% | '+w.zone;
lineChart('l1',d,[{n:'Net',c:'#818cf8',w:2,v:ne}],{zero:true,h:200});
lineChart('l2',d,[{n:'Long',c:'#22c55e',w:2,v:r.map(a=>a.long_pos)},{n:'Short',c:'#ef4444',w:2,v:r.map(a=>a.short_pos)}],{h:200})}
const cr=rows.filter(r=>r.pct>=90).length,cs=rows.filter(r=>r.pct<=10).length;
$('sub').textContent=rows.length+' markets | weekly CFTC positioning | tap a row for its chart';
$('kp').innerHTML=[[rows.length,'Markets',''],[cr,'Crowded long','pos'],[cs,'Crowded short','neg'],[rows.map(r=>r.per).sort().pop(),'Latest report','']].map(z=>'<div class="kpi"><b class="'+z[2]+'">'+z[0]+'</b><span>'+z[1]+'</span></div>').join('');
$('sy').innerHTML=rows.map(r=>'<option>'+r.sym+'</option>').join('');
$('sy').onchange=e=>show(e.target.value);
const T=table('tb',[{k:'sym',t:'Market'},{k:'net',t:'Net',f:r=>sg(r.net),c:r=>cls(r.net)},{k:'chg',t:'Week',f:r=>sg(r.chg),c:r=>cls(r.chg)},{k:'pct',t:'Pctile',f:r=>r.pct+'%'},{k:'zone',t:'Zone'},{k:'lp',t:'Long %',f:r=>num(r.lp,0)+'%'}],rows,{sort:'pct',asc:false,go:s=>{show(s);$('ch').scrollIntoView({behavior:'smooth'})}});
$('cp').innerHTML=['All','Forex','Indices','Commodities','Crowded'].map((g,i)=>'<button'+(i?'':' class="on"')+'>'+g+'</button>').join('');
$('cp').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('cp').querySelectorAll('button').forEach(x=>x.className='');b.className='on';const g=b.textContent;T.filter(g==='All'?null:g==='Crowded'?r=>r.pct>=90||r.pct<=10:r=>r.grp===g)});
const q=new URLSearchParams(location.search).get('symbol');
show(D[q]?q:(D.EURUSD?'EURUSD':rows[0].sym));
}catch(e){$('sub').textContent='Error: '+e.message}})();

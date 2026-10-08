shell();
const MK=['AUDUSD','COPPER','DAX','DOW','EURUSD','GBPUSD','GOLD','NASDAQ','NIKKEI','NZDUSD','PLATINUM','SILVER','SPX500','UK100','USDCAD','USDCHF','USDJPY'];
const q=new URLSearchParams(location.search).get('symbol');
let N=126,P=null,SC=null;
const f4=v=>num(v,v<10?4:v<1000?2:1);
function px(){if(!P||!P.dates||P.dates.length<2){$('pc').innerHTML='<div class="sub">No price data yet</div>';$('ps').textContent='';return}
const a=Math.max(0,P.dates.length-N),s=z=>(P[z]||[]).slice(a),c=s('close');
const ch=(c[c.length-1]/c[0]-1)*100;
$('ps').innerHTML='Close <b>'+f4(c[c.length-1])+'</b> | Change over range <b class="'+cls(ch)+'">'+sgn(ch,1)+'%</b>'+(SC!=null?' | Quant score <b class="'+cls(SC)+'">'+sgn(SC,1)+'</b>':'');
lineChart('pc',P.dates.slice(a),[{n:'Close',c:'#e5e7eb',w:2,v:c},{n:'SMA50',c:'#fbbf24',w:1.5,v:s('sma50')},{n:'SMA200',c:'#f87171',w:1.5,d:true,v:s('sma200')}],{h:220})}
async function mk(s){try{
const [p,h]=await Promise.all([api('price_series?select=dates,close,sma50,sma200&symbol=eq.'+s),api('quant_scores?select=as_of,score&symbol=eq.'+s+'&order=as_of.asc&limit=400')]);
P=p[0]||null;SC=h.length?+h[h.length-1].score:null;px();
if(h.length>1){$('ss').textContent=s+' | '+h.length+' days of history, grows daily';lineChart('sh',h.map(x=>String(x.as_of).slice(0,10)),[{n:'Score',c:'#2dd4bf',w:2,v:h.map(x=>+x.score)}],{zero:true,h:180})}
else{$('ss').textContent='';$('sh').innerHTML='<div class="sub">Not enough score history yet</div>'}
}catch(e){$('sub').textContent='Error: '+e.message}}
$('sy').innerHTML=MK.map(s=>'<option>'+s+'</option>').join('');
$('sy').value=MK.includes(q)?q:'EURUSD';
$('sy').onchange=e=>mk(e.target.value);
$('rg').innerHTML=[['3M',63],['6M',126],['1Y',252]].map((r,i)=>'<span class="chip'+(i==1?' on':'')+'" data-n="'+r[1]+'">'+r[0]+'</span>').join(' ');
document.querySelectorAll('#rg .chip').forEach(e=>e.onclick=()=>{document.querySelectorAll('#rg .chip').forEach(z=>z.classList.remove('on'));e.classList.add('on');N=+e.dataset.n;px()});
mk($('sy').value);
(async()=>{try{
const d=await api('macro?select=indicator,period,actual&order=period.asc&limit=1000'),by={};
d.forEach(x=>{if(x.actual!=null)(by[x.indicator]=by[x.indicator]||[]).push(x)});
const ks=Object.keys(by).sort();
$('mi').innerHTML=ks.map(k=>'<option>'+k+'</option>').join('');
if(by.CPI)$('mi').value='CPI';
function ms(){const k=$('mi').value,r=by[k]||[];
if(r.length<2){$('ms').textContent='';$('mc').innerHTML='<div class="sub">Only one data point so far</div>';return}
const l=+r[r.length-1].actual,p=+r[r.length-2].actual;
$('ms').innerHTML='Latest <b>'+num(l,2)+'</b> | Previous <b>'+num(p,2)+'</b> | Change <b class="'+cls(l-p)+'">'+sgn(l-p,2)+'</b> | '+r.length+' points';
lineChart('mc',r.map(x=>x.period.slice(0,10)),[{n:k,c:'#818cf8',w:2,v:r.map(x=>+x.actual)}],{h:200})}
$('mi').onchange=ms;ms();
}catch(e){$('ms').textContent='Error: '+e.message}})();

shell();
const G={CPI:'Inflation',PPI:'Inflation',PCE:'Inflation',GDP:'Growth',RETAIL:'Growth',MPMI:'Growth',SPMI:'Growth',PMI_US:'Growth',PMI_EZ:'Growth',PMI_GB:'Growth',PMI_CA:'Growth',NFP:'Labour',UNEMP:'Labour',CLAIMS:'Labour',ADP:'Labour',JOLTS:'Labour',CNSMR:'Sentiment',RATES:'Rates'};
const INV=['UNEMP','CLAIMS'];
const fm=v=>v==null?'-':num(v,Math.abs(v)>=1000?0:2);
(async()=>{try{
const d=await api('macro?select=indicator,period,actual&order=period.desc&limit=1000');
const by={};d.forEach(x=>{if(x.actual!=null)(by[x.indicator]=by[x.indicator]||[]).push(x)});
const rows=Object.keys(by).sort().map(k=>{const a=by[k],c=a[0],p=a[1],chg=p?c.actual-p.actual:null,gr=G[k]||'Other',info=gr==='Inflation'||gr==='Rates';
let s=0;if(chg){s=chg>0?1:-1;if(INV.includes(k))s=-s}
const lab=chg==null?'No prior':info?(chg>0?'Rising':chg<0?'Falling':'Unchanged'):(s>0?'Improving':s<0?'Worsening':'Unchanged');
return{ind:k,grp:gr,info:info,last:+c.actual,prev:p?+p.actual:null,chg:chg,sig:info?0:s,lab:lab,per:c.period.slice(0,10),h:a.slice().reverse()}});
function show(k){const r=rows.find(x=>x.ind===k);$('hc').style.display='block';$('ht').textContent=k+' history';
lineChart('lc',r.h.map(x=>x.period.slice(0,10)),[{n:k,c:'#2dd4bf',w:2,v:r.h.map(x=>+x.actual)}],{h:200});
$('hc').scrollIntoView({behavior:'smooth'})}
const up=rows.filter(r=>r.sig>0).length,dn=rows.filter(r=>r.sig<0).length;
$('sub').textContent=rows.length+' indicators | US and global PMI | tap a row for history';
$('kp').innerHTML=[[rows.length,'Indicators',''],[up,'Improving','pos'],[dn,'Worsening','neg'],[rows.map(r=>r.per).sort().pop(),'Latest data','']].map(z=>'<div class="kpi"><b class="'+z[2]+'">'+z[0]+'</b><span>'+z[1]+'</span></div>').join('');
const T=table('tb',[{k:'ind',t:'Indicator'},{k:'grp',t:'Group'},{k:'last',t:'Latest',f:r=>fm(r.last)},{k:'prev',t:'Previous',f:r=>fm(r.prev)},{k:'chg',t:'Change',f:r=>sgn(r.chg,2),c:r=>r.info?'mut':cls(r.sig)},{k:'lab',t:'Signal',f:r=>r.lab,c:r=>r.info?'mut':cls(r.sig)},{k:'per',t:'As of'}],rows,{sort:'ind',asc:true,go:show});
$('ch').innerHTML=['All','Inflation','Growth','Labour','Sentiment','Rates'].map((g,i)=>'<button'+(i?'':' class="on"')+'>'+g+'</button>').join('');
$('ch').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('ch').querySelectorAll('button').forEach(x=>x.className='');b.className='on';T.filter(b.textContent==='All'?null:r=>r.grp===b.textContent)});
$('q').oninput=e=>T.search(e.target.value);
}catch(e){$('sub').textContent='Error: '+e.message}})();

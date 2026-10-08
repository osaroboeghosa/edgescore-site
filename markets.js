shell();
const tq=p=>api(p).catch(()=>[]),first=(a,k)=>{const s={};return a.filter(x=>s[x[k]]?0:(s[x[k]]=1))},go=s=>{location.href='asset.html?symbol='+s},
PR=[['USDCHF','USD','CHF'],['USDJPY','USD','JPY'],['USDCAD','USD','CAD'],['AUDUSD','AUD','USD'],['GBPUSD','GBP','USD'],['NZDUSD','NZD','USD'],['EURUSD','EUR','USD']];
(async()=>{try{
const [g,a,p,q]=await Promise.all([tq('risk_gauge?select=*&order=as_of.desc&limit=1'),tq('atr_heat?select=*&order=as_of.desc&limit=60'),tq('policy_rates?select=*&order=as_of.desc&limit=60'),tq('quant_latest?select=symbol,score,components')]);
const av=first(a,'symbol'),rt={};first(p,'ccy').forEach(z=>rt[z.ccy]=z);
const rows=PR.filter(z=>rt[z[1]]&&rt[z[2]]).map(z=>({pair:z[0],b:z[1],q:z[2],br:+rt[z[1]].rate,qr:+rt[z[2]].rate,sp:+rt[z[1]].rate-+rt[z[2]].rate}));
const x=g[0],k=(v,t,c)=>'<div class="kpi"><b class="'+(c||'')+'">'+v+'</b><span>'+t+'</span></div>',wide=rows.slice().sort((m,n)=>Math.abs(n.sp)-Math.abs(m.sp))[0];
$('sub').textContent='Updated '+(x?x.as_of:av[0]?av[0].as_of:'')+' | intermarket risk, volatility and carry';
$('kp').innerHTML=(x?k(sgn(x.score,0)+' '+x.regime,'Risk gauge',cls(x.score)):'')+k(av.filter(z=>z.state==='Expanded').length,'Expanded volatility','neg')+k(av.filter(z=>z.state==='Compressed').length,'Compressed volatility')+(wide?k(wide.pair+' '+sgn(wide.sp,2),'Widest rate spread',cls(wide.sp)):'');
if(x){let o='';for(const c in x.components){const v=x.components[c];o+='<span class="chip" style="border-color:'+(v>0?'var(--g)':v<0?'var(--r)':'var(--b)')+'">'+c+' '+sgn(v,0)+'</span> '}$('rg').innerHTML=o+'<div class="sub" style="margin-top:8px">Six intermarket signals, each +1, 0 or -1, summed (-6 to +6). Gold, VIX and DXY count inverted.</div>'}else $('rg').innerHTML='<div class="sub">No data yet.</div>';
table('vt',[{k:'symbol',t:'Market'},{k:'atr_pct',t:'ATR %',f:z=>num(z.atr_pct,2)},{k:'atr_ratio',t:'Ratio',f:z=>num(z.atr_ratio,2)},{k:'state',t:'State',c:z=>z.state==='Expanded'?'sx':z.state==='Compressed'?'sc':''}],av,{sort:'atr_ratio',go});
table('rt',[{k:'pair',t:'Pair'},{k:'b',t:'Base',f:z=>z.b+' '+num(z.br,2)},{k:'q',t:'Quote',f:z=>z.q+' '+num(z.qr,2)},{k:'sp',t:'Spread',f:z=>sgn(z.sp,2),c:z=>z.sp>.25?'cg':z.sp<-.25?'cr2':''}],rows,{sort:'sp',go});
const old=Object.values(rt).filter(z=>(Date.now()-new Date(z.as_of))/864e5>90).map(z=>z.ccy+' '+z.as_of);
$('rn').textContent='Positive spread favours holding the base currency. Rates mix policy and 3-month series and can be old'+(old.length?' (older than 90 days: '+old.join(', ')+')':'')+'.';
const cr=q.filter(z=>z.components&&z.components.carry!=null).map(z=>({symbol:z.symbol,carry:+z.components.carry,score:+z.score}));
table('cm',[{k:'symbol',t:'Market'},{k:'carry',t:'Carry',f:z=>sgn(z.carry,2),c:z=>z.carry>.25?'cg':z.carry<-.25?'cr2':''},{k:'score',t:'Score',f:z=>sgn(z.score),c:z=>cls(z.score)}],cr,{sort:'carry',go});
}catch(e){$('sub').textContent='Error: '+e.message}})();
  

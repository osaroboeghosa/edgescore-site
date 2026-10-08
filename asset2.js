const NM={carry:'carry/yield spreads',esi:'economic surprises',pmi:'PMI gap',vix:'risk mood (VIX)',cot:'COT positioning',retail:'retail crowd (contrarian)'};
const px=v=>v==null?'-':(+v).toFixed(v<10?4:v<1000?2:1);
function more(D){const {r,sc,c,L,A,bs,K,bt}=D;
const ct=K.filter(z=>c[z]!=null).map(z=>[z,W[z]*c[z]]).sort((a,b)=>b[1]-a[1]),up=ct.filter(z=>z[1]>0).slice(0,2).map(z=>NM[z[0]]),dn=ct.filter(z=>z[1]<0).slice(-2).reverse().map(z=>NM[z[0]]);
$('sm').innerHTML='<p>'+SY+' scores <b class="'+cls(sc)+'">'+sgn(sc)+'</b> ('+bs.toLowerCase()+'), using '+num(r.coverage,0)+'% of the model data.'+(up.length?' Supported by '+up.join(' and ')+'.':'')+(dn.length?' Held back by '+dn.join(' and ')+'.':'')+'</p><p>'+(L?'Price is '+String(L.sma_signal).toLowerCase()+' against its 50 and 200-day averages. ':'')+(A?'Volatility is '+String(A.state).toLowerCase()+' ('+num(A.atr_ratio,2)+'x its 100-day average). ':'')+(r.cot_regime&&r.cot_regime!=='n/a'?'COT regime: '+r.cot_regime.toLowerCase()+'. ':'')+'The trend filter scales the signal by '+num(r.gate,2)+'x.</p>';
const lr=[['Price',px(L&&L.price)],['SMA 50',px(L&&L.sma50)],['SMA 200',px(L&&L.sma200)],['ATR (14)',px(L&&L.atr)]];
if(L){lr.push(['Range +/-1 ATR',px(L.price-L.atr)+' - '+px(+L.price+ +L.atr)]);lr.push(['Range +/-2 ATR',px(L.price-2*L.atr)+' - '+px(+L.price+2*L.atr)])}
$('lv').innerHTML=L?'<table style="width:100%;min-width:0">'+lr.map(z=>'<tr><td>'+z[0]+'</td><td style="text-align:right;white-space:nowrap">'+z[1]+'</td></tr>').join('')+'</table><div class="sub">Volatility ranges are not forecasts.</div>':'<div class="sub">No levels yet.</div>';
const nm={forward:'Live scores',trend_hist:'Trend-only history'};
if(bt.length)table('bt',[{k:'kind',t:'Check',f:z=>nm[z.kind]||z.kind},{k:'symbol',t:'Asset'},{k:'horizon',t:'Days'},{k:'n',t:'n'},{k:'hit_rate',t:'Hit %'},{k:'avg_ret',t:'Avg %'},{k:'base_rate',t:'Base %',f:z=>z.base_rate==null?'-':z.base_rate}],bt);else $('bt').innerHTML='<div class="sub">No checks yet.</div>';
                }

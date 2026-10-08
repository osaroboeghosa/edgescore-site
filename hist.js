(function(){let n=0;const t=setInterval(()=>{if(++n>60){clearInterval(t);return}const el=document.getElementById('sh');if(!el||!el.innerHTML||typeof tq==='undefined'||typeof SY==='undefined')return;clearInterval(t);go(el)},250);
async function go(el){
const h=await tq('quant_scores?select=as_of,score,raw_score,coverage,components&symbol=eq.'+SY+'&order=as_of.asc&limit=400');
if(h.length<2)return;
el.innerHTML='<div id="shb"></div><div id="shx"></div><div class="sub" id="shn"></div>';
const d=h.map(z=>z.as_of),CK=[['carry','#34d399'],['esi','#fbbf24'],['pmi','#a78bfa'],['vix','#f472b6'],['cot','#fb923c'],['retail','#22d3ee']];
const draw=m=>{$('shb').innerHTML=['score','components'].map(x=>'<span class="chip" data-m="'+x+'" style="cursor:pointer;margin-right:6px;'+(x===m?'border-color:var(--g)':'')+'">'+(x==='score'?'Score':'Components')+'</span>').join('');
document.querySelectorAll('#shb .chip').forEach(e=>e.onclick=()=>draw(e.dataset.m));
lineChart('shx',d,m==='score'?[{n:'Score',c:'#60a5fa',w:2,v:h.map(z=>+z.score)},{n:'Raw',c:'#94a3b8',d:1,v:h.map(z=>+z.raw_score)}]:CK.map(k=>({n:k[0],c:k[1],v:h.map(z=>z.components&&z.components[k[0]]!=null?+z.components[k[0]]:null)})),{zero:1,h:180})};
draw('score');
$('shn').textContent=h.length+' days of history (one point per day). Data coverage went from '+num(h[0].coverage,0)+'% to '+num(h[h.length-1].coverage,0)+'%, so early points used less of the model. Grey dashed = score before the trend filter.'}
})();

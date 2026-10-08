function lineChart(id,dates,S,o){o=o||{};const W=600,H=o.h||220,L=46,R=8,T=8,B=20,el=$(id),pts=S.flatMap(s=>s.v.filter(x=>x!=null));
if(pts.length<2||dates.length<2){el.innerHTML='<div class="sub">Not enough data yet - history builds daily.</div>';return}
let lo=Math.min(...pts,...(o.zero?[0]:[])),hi=Math.max(...pts,...(o.zero?[0]:[]));if(lo===hi){lo-=1;hi+=1}const p=(hi-lo)*.06;lo-=p;hi+=p;
const n=dates.length,X=i=>L+i/(n-1)*(W-L-R),Y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B),f=v=>v==null?'-':String(+(+v).toPrecision(5));
let g='';for(let k=0;k<5;k++){const v=lo+(hi-lo)*k/4,y=Y(v);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="#1e293b"/><text x="'+(L-5)+'" y="'+(y+4)+'" text-anchor="end" fill="#64748b" font-size="11">'+f(v)+'</text>'}
if(o.zero)g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(0)+'" y2="'+Y(0)+'" stroke="#64748b" stroke-dasharray="3 3"/>';
[0,Math.floor(n/2),n-1].forEach(i=>g+='<text x="'+X(i)+'" y="'+(H-5)+'" text-anchor="'+(i?i<n-1?'middle':'end':'start')+'" fill="#64748b" font-size="11">'+dates[i]+'</text>');
S.forEach(s=>{let d='',pen=0;s.v.forEach((v,i)=>{if(v==null){pen=0;return}d+=(pen?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);pen=1});g+='<path d="'+d+'" fill="none" stroke="'+s.c+'" stroke-width="'+(s.w||1.5)+'"'+(s.d?' stroke-dasharray="5 4"':'')+'/>'});
el.innerHTML='<div class="sub" id="'+id+'L"></div><svg viewBox="0 0 '+W+' '+H+'">'+g+'<line id="'+id+'X" y1="'+T+'" y2="'+(H-B)+'" stroke="#94a3b8" opacity="0"/><rect x="'+L+'" y="0" width="'+(W-L-R)+'" height="'+H+'" fill="transparent"/></svg>';
const lg=i=>{$(id+'L').innerHTML=dates[i]+S.map(s=>' &nbsp;<span style="color:'+s.c+'">'+s.n+' '+f(s.v[i])+'</span>').join('')};lg(n-1);
const sv=el.querySelector('svg'),ln=$(id+'X'),mv=e=>{const r=sv.getBoundingClientRect(),i=Math.max(0,Math.min(n-1,Math.round(((e.clientX-r.left)/r.width*W-L)/(W-L-R)*(n-1))));ln.setAttribute('x1',X(i));ln.setAttribute('x2',X(i));ln.setAttribute('opacity',1);lg(i)};
sv.onpointermove=mv;sv.onpointerdown=mv}

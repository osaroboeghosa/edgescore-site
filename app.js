const SB='https://lveqwyasscpwslqvitbt.supabase.co',KEY='sb_publishable_xMyRvBFDAlDyDobfgFekug_gY0tEORR';
const NAV=[['Dashboard','home.html'],['Screener','screener.html'],['Classic','classic.html'],['Markets','markets.html'],['Macro','macro.html'],['COT','cot.html'],['Charts','charts.html']];
const $=i=>document.getElementById(i);
async function api(p){const r=await fetch(SB+'/rest/v1/'+p,{headers:{apikey:KEY}});const j=await r.json();if(!Array.isArray(j))throw new Error(JSON.stringify(j));return j}
const cls=v=>v>0?'pos':v<0?'neg':'mut';
const num=(v,d=1)=>{if(v==null)return'-';const s=(+v).toFixed(d);return +s===0?(0).toFixed(d):s};
const sgn=(v,d=1)=>{if(v==null)return'-';const s=(+v).toFixed(d);return +s===0?(0).toFixed(d):(v>0?'+':'')+s};
function shell(){const here=location.pathname.split('/').pop()||'home.html';
$('hdr').innerHTML='<div class="top"><a class="logo" href="home.html">Edge<i>Score</i></a></div><div class="nav">'+NAV.map(n=>'<a href="'+n[1]+'"'+(n[1]===here?' class="on"':'')+'>'+n[0]+'</a>').join('')+'</div>';
document.body.insertAdjacentHTML('beforeend','<footer>Not financial advice. EdgeScore is an experimental research tool. Scores are unvalidated model outputs built from third-party data that may be delayed or wrong. Trading carries a risk of loss.</footer>')}
function table(id,cols,rows,o){o=o||{};let sk=o.sort,asc=!!o.asc,q='',fl=null;const el=$(id);
function draw(){let r=rows.filter(x=>!q||String(x[cols[0].k]).toLowerCase().includes(q));
if(fl)r=r.filter(fl);
if(sk){const c=cols.find(c=>c.k===sk);r=r.slice().sort((a,b)=>{const x=c.v?c.v(a):a[sk],y=c.v?c.v(b):b[sk];return(x>y?1:x<y?-1:0)*(asc?1:-1)})}
let hg='';if(cols.some(c=>c.g)){const gl=[];let p=null;cols.forEach(c=>{const g=c.g||'';if(p&&p.g===g)p.n++;else{p={g:g,n:1};gl.push(p)}});hg='<tr>'+gl.map(z=>'<th colspan="'+z.n+'" style="position:static;text-align:center;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#2dd4bf;border-bottom:1px solid #243049;border-left:1px solid #243049;cursor:default">'+z.g+'</th>').join('')+'</tr>'}
el.innerHTML='<table>'+hg+'<tr>'+cols.map(c=>'<th data-k="'+c.k+'">'+c.t+(sk===c.k?(asc?' ▲':' ▼'):'')+'</th>').join('')+'</tr>'+r.map(x=>'<tr data-r="'+x[cols[0].k]+'"'+(o.go?' style="cursor:pointer"':'')+'>'+cols.map(c=>{const v=c.v?c.v(x):x[c.k];return'<td class="'+(c.c?c.c(x):'')+'">'+(c.f?c.f(x):v)+'</td>'}).join('')+'</tr>').join('')+'</table>';
el.querySelectorAll('th[data-k]').forEach(h=>h.onclick=()=>{const k=h.dataset.k;if(sk===k)asc=!asc;else{sk=k;asc=false}draw()});
if(o.go)el.querySelectorAll('tr[data-r]').forEach(t=>t.onclick=()=>o.go(t.dataset.r))}
draw();return{search:v=>{q=v.toLowerCase();draw()},filter:f=>{fl=f;draw()}}}

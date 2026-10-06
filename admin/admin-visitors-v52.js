(()=>{
if(window.__gdsVisitorsV52)return;window.__gdsVisitorsV52=true;
let channel=null;
function badge(){let b=document.getElementById('gdsVisitors52');if(b)return b;const nav=document.querySelector('.gdsNav48in')||document.body;const el=document.createElement('div');el.id='gdsVisitors52';el.style.cssText='margin-left:auto;background:#fff;border:1px solid #efdde4;border-radius:999px;padding:8px 11px;font:900 12px Inter,system-ui;color:#4a101e;box-shadow:0 6px 18px #4a101e0d;white-space:nowrap';el.textContent='👥 0 na loja agora';const links=document.querySelector('.gdsLinks48');if(links&&links.parentNode)links.parentNode.insertBefore(el,links);else nav.appendChild(el);return el}
function countVisible(){if(!channel)return 0;const st=channel.presenceState?.()||{};let n=0;for(const arr of Object.values(st)){if(!Array.isArray(arr))continue;for(const p of arr){if(p&&p.role==='shopper'&&p.visible!==false)n++}}return n}
function render(){const n=countVisible(),b=badge();b.textContent=`👥 ${n} ${n===1?'pessoa':'pessoas'} na loja agora`;b.style.color=n?'#14753e':'#78616a'}
async function start(){for(let i=0;i<30&&!window.GDS48;i++)await new Promise(r=>setTimeout(r,100));if(!window.GDS48)return;badge();try{channel=GDS48.sb.channel('gds-store-presence');channel.on('presence',{event:'sync'},render).on('presence',{event:'join'},render).on('presence',{event:'leave'},render).subscribe(status=>{if(status==='SUBSCRIBED')render()});setInterval(render,10000)}catch(e){badge().textContent='👥 Visitantes indisponíveis';console.warn('GDS visitantes v52',e)}}
start();
})();
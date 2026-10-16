(()=>{
'use strict';
if(window.__gdsVisitorsV138)return;
window.__gdsVisitorsV138=true;
const CHANNEL='gds-store-presence',MAX_AGE=60000;
let channel=null,connection='Conectando',sessions=[],lastUpdate=null;
const escStatus=()=>connection==='Conectado';
const css=document.createElement('style');
css.id='gdsVisitorsStyle138';
css.textContent='#gdsVisitorBtn138{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;min-height:43px;padding:10px 15px;background:#fff4f8;color:#a81450;border:1px solid #f3bdd3;border-radius:13px;font:850 13px/1.35 Inter,system-ui,sans-serif;cursor:pointer;max-width:100%;box-shadow:0 4px 14px #ec176813}#gdsVisitorBtn138.live{background:#eaf8ef;color:#12673e;border-color:#b5e4c9}#gdsVisitorBtn138.unavailable{background:#fff8ef;color:#8d6125;border-color:#f1dba2}#gdsVisitorBtn138:focus-visible,#gdsVisitorDialog138 button:focus-visible{outline:3px solid #f79bbf;outline-offset:2px}#gdsVisitorDialog138{box-sizing:border-box;width:min(440px,calc(100vw - 28px));max-height:80dvh;overflow:auto;padding:20px;border:1px solid #f0dae4;border-radius:20px;background:#fff;color:#17203c;box-shadow:0 20px 55px #35182b55;font:14px/1.5 Inter,system-ui,sans-serif}#gdsVisitorDialog138::backdrop{background:#25152788}#gdsVisitorDialog138 h2{margin:0 0 8px;font-size:21px;color:#9d124b}#gdsVisitorDialog138 .gdsVisitorsMain{font-size:32px;font-weight:950;margin:8px 0;color:#b40d50}#gdsVisitorDialog138 p{font-size:13px;color:#596079}#gdsVisitorDialog138 .gdsVisitorsRow{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:10px 0;border-bottom:1px solid #f3e6ec;font-size:13px}#gdsVisitorDialog138 .gdsVisitorsRow strong{font-size:18px}#gdsVisitorDialog138 .gdsVisitorsFoot{padding:13px 0;color:#777b96;font-size:12px}#gdsVisitorDialog138 button{background:#ec1768;color:white;border:0;border-radius:11px;min-height:43px;padding:10px 18px;font-weight:800;cursor:pointer}#gdsVisitorBtn138.gdsOnHome{margin-bottom:16px;justify-content:flex-start}@media(max-width:850px){#gdsVisitorBtn138{font-size:12px;padding:9px 12px}}';
document.head.appendChild(css);
function classify(p){
 const a=String(p.activity||'');
 if(a.includes('finalizando'))return 'Finalizando pedido';
 if(a.includes('visualizando carrinho'))return 'Visualizando carrinho';
 if(a.includes('carrinho')||Number(p.cart_qty)>0)return 'Com produtos no carrinho';
 return 'Navegando pelos sabores';
}
function currentSessions(){
 const data=channel&&channel.presenceState?channel.presenceState():{};
 const now=Date.now(),result=[];
 for(const presences of Object.values(data||{})){
  if(!Array.isArray(presences))continue;
  const eligible=presences.filter(p=>{
   if(!p||p.role!=='shopper'||p.visible===false)return false;
   const at=Date.parse(p.at||'');
   return Number.isFinite(at)&&now-at<=MAX_AGE&&at-now<=MAX_AGE;
  });
  if(!eligible.length)continue;
  eligible.sort((a,b)=>Date.parse(b.at||'')-Date.parse(a.at||''));
  result.push(eligible[0]);
 }
 return result;
}
function makeButton(){
 let b=document.getElementById('gdsVisitorBtn138');
 if(b)return b;
 b=document.createElement('button');b.id='gdsVisitorBtn138';b.type='button';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','gdsVisitorDialog138');b.setAttribute('aria-live','polite');
 b.textContent='👥 Conectando visitantes...';
 b.addEventListener('click',()=>{render();dialog().showModal()});
 const heading=document.querySelector('#dashboard .heading');
 const pageHead=document.querySelector('main .head');
 if(heading){heading.insertAdjacentElement('afterend',b);b.classList.add('gdsOnHome')}
 else if(pageHead)pageHead.appendChild(b);
 else {const main=document.querySelector('main');if(main)main.prepend(b);else document.body.prepend(b)}
 return b;
}
function dialog(){
 let d=document.getElementById('gdsVisitorDialog138');
 if(d)return d;
 d=document.createElement('dialog');d.id='gdsVisitorDialog138';
 d.innerHTML='<h2>👥 Quem está na loja agora?</h2><div class="gdsVisitorsMain" id="gdsVisitorsCount138">—</div><div id="gdsVisitorsConnection138"></div><div id="gdsVisitorsActivities138"></div><div class="gdsVisitorsFoot">Mostra sessões anônimas com a loja aberta no navegador. Uma pessoa com vários dispositivos pode contar mais de uma vez. A contagem não revela nomes, telefones ou dados dos clientes.</div><button type="button" id="gdsVisitorsClose138">Fechar</button>';
 document.body.appendChild(d);
 d.querySelector('#gdsVisitorsClose138').addEventListener('click',()=>d.close());
 return d;
}
function render(){
 const b=makeButton();
 sessions=escStatus()?currentSessions():[];
 const n=sessions.length;
 b.classList.toggle('live',escStatus()&&n>0);
 b.classList.toggle('unavailable',connection==='Indisponível');
 b.textContent=connection==='Indisponível'?'⚠️ Visitantes indisponíveis':connection!=='Conectado'?'👥 Conectando visitantes...':n===0?'👥 0 visitantes na loja · Ver detalhes':'🟢 '+n+(n===1?' visitante na loja':' visitantes na loja')+' · Ver detalhes';
 b.title=escStatus()?'Clique para ver a atividade de visitantes anônimos em tempo real.':'Monitor de visitantes: '+connection.toLowerCase();
 const d=document.getElementById('gdsVisitorDialog138');
 if(!d)return;
 d.querySelector('#gdsVisitorsCount138').textContent=escStatus()?n+(n===1?' visitante online':' visitantes online'):'Status: '+connection;
 d.querySelector('#gdsVisitorsConnection138').textContent=escStatus()?'Atualização em tempo real · '+new Date().toLocaleTimeString('pt-BR'):'Não foi possível confirmar a presença de visitantes no momento.';
 const box=d.querySelector('#gdsVisitorsActivities138');
 box.replaceChildren();
 if(!escStatus()||!n){const p=document.createElement('p');p.textContent=escStatus()?'Nenhum visitante ativo neste momento.':'Confira sua conexão e tente abrir novamente.';box.appendChild(p);return}
 const groups=new Map();
 for(const p of sessions){const label=classify(p);groups.set(label,(groups.get(label)||0)+1)}
 for(const [label,count] of groups){const row=document.createElement('div');row.className='gdsVisitorsRow';const txt=document.createElement('span');txt.textContent=label;const num=document.createElement('strong');num.textContent=count;row.append(txt,num);box.appendChild(row)}
}
function connect(){
 makeButton();connection='Conectando';render();
 try{
  if(!window.GDS48?.sb)throw Error('Administração não conectada');
  channel=GDS48.sb.channel(CHANNEL);
  channel.on('presence',{event:'sync'},render).on('presence',{event:'join'},render).on('presence',{event:'leave'},render);
  channel.subscribe(status=>{
   if(status==='SUBSCRIBED')connection='Conectado';
   else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))connection='Indisponível';
   render();
  });
  window.setInterval(render,5000);
 }catch(e){connection='Indisponível';render();console.warn('GDS: monitor de visitantes',e)}
}
connect();
})();
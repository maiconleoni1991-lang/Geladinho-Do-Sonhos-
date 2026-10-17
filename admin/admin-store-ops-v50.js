(()=>{
if(window.__gdsAdminStoreOpsV50)return;window.__gdsAdminStoreOpsV50=true;
const LS='gds_admin_order_notifications_v63';
let isOpen=false,channel=null,audioCtx=null,lastStateAt=0,alarmTimer=null,pendingCount=0,knownPending=new Set(),initialPendingRead=false,pendingBusy=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<40&&!window.GDS48;i++)await sleep(100);if(!window.GDS48)throw new Error('Admin indisponível');return GDS48}
function addStyle(){if(document.getElementById('gdsOps50Style'))return;const s=document.createElement('style');s.id='gdsOps50Style';s.textContent=`
.gdsOps50{margin:14px 0;background:#fff;border:1px solid #efdde4;border-radius:20px;padding:15px;box-shadow:0 12px 30px #4a101e0d}.gdsOps50Top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.gdsOps50State{display:flex;align-items:center;gap:8px;font-weight:950;color:#4a101e}.gdsOps50Dot{width:12px;height:12px;border-radius:50%;background:#c9374f;box-shadow:0 0 0 5px #c9374f18}.gdsOps50.open .gdsOps50Dot{background:#19b15b;box-shadow:0 0 0 5px #19b15b20}.gdsOps50.open .gdsOps50State{color:#14753e}.gdsOps50Text{font-size:12px;color:#78616a;margin-top:4px;line-height:1.4}.gdsOps50Btns{margin-left:auto;display:flex;gap:7px;flex-wrap:wrap}.gdsOps50 button{border:1px solid #efdde4;background:#fff;color:#4a101e;border-radius:12px;padding:10px 12px;font-weight:900;min-height:42px}.gdsOps50 .toggle{background:#19b15b;color:#fff;border-color:#19b15b}.gdsOps50.open .toggle{background:#c9374f;border-color:#c9374f}.gdsOps50 .notify.on{background:#eefaf3;color:#14753e;border-color:#bde7cc}.gdsOps50Foot{margin-top:10px;padding-top:10px;border-top:1px solid #f4e7eb;font-size:11px;color:#78616a}.gdsOpsToast50{position:fixed;z-index:2147483646;left:50%;bottom:22px;transform:translateX(-50%);width:min(92vw,520px);background:#4a101e;color:#fff;border-radius:16px;padding:13px 15px;box-shadow:0 18px 50px #2a0a1640;font:800 13px Inter,system-ui;text-align:center}@media(max-width:720px){.gdsOps50Btns{width:100%;margin:0;display:grid;grid-template-columns:1fr 1fr}.gdsOps50Btns .toggle{grid-column:1/-1}.gdsOps50 button{width:100%}}
`;document.head.appendChild(s)}
function toast(t){let x=document.getElementById('gdsOpsToast50');if(!x){x=document.createElement('div');x.id='gdsOpsToast50';x.className='gdsOpsToast50';document.body.appendChild(x)}x.textContent=t;clearTimeout(x._t);x._t=setTimeout(()=>x.remove(),4200)}
function alertsOn(){return localStorage.getItem(LS)!=='0'}
function notificationsOn(){return alertsOn()&&('Notification'in window)&&Notification.permission==='granted'}
function inject(){if(!location.pathname.endsWith('/orders-v48.html')||document.getElementById('gdsOps50'))return;addStyle();const head=document.querySelector('.head');if(!head)return;const box=document.createElement('section');box.id='gdsOps50';box.className='gdsOps50';box.innerHTML=`<div class="gdsOps50Top"><div><div class="gdsOps50State"><span class="gdsOps50Dot"></span><span id="gdsOpsState50">Verificando vendas online…</span></div><div id="gdsOpsText50" class="gdsOps50Text">Horário automático: 08:00 às 20:30. Você pode fechar manualmente quando não houver atendimento.</div></div><div class="gdsOps50Btns"><button id="gdsOpsToggle50" class="toggle">Abrir vendas online</button><button id="gdsOpsNotify50" class="notify">🔔 Ativar notificações</button><button id="gdsOpsTest50">🔊 Testar aviso</button></div></div><div class="gdsOps50Foot">A loja abre automaticamente às 08:00 e fecha às 20:30. Se você fechar manualmente, permanecerá fechada até a abertura automática do dia seguinte. Quando aberta, novos pedidos fazem a campainha repetir até o pedido ser atendido, além de vibração e da notificação “🍧 GELADINHO DOS SONHOS — NOVO PEDIDO”.</div>`;head.insertAdjacentElement('afterend',box);document.getElementById('gdsOpsToggle50').onclick=toggleStore;document.getElementById('gdsOpsNotify50').onclick=toggleNotifications;document.getElementById('gdsOpsTest50').onclick=testNotification;render()}
function render(){const box=document.getElementById('gdsOps50');if(!box)return;box.classList.toggle('open',isOpen);const st=document.getElementById('gdsOpsState50'),tx=document.getElementById('gdsOpsText50'),bt=document.getElementById('gdsOpsToggle50'),bn=document.getElementById('gdsOpsNotify50');st.textContent=isOpen?'VENDAS ONLINE ABERTAS':'VENDAS ONLINE FECHADAS';tx.textContent=isOpen?'Clientes podem finalizar pedidos pelo site.':'O cardápio continua visível, mas nenhum novo pedido pode ser finalizado.';bt.textContent=isOpen?'Fechar vendas online':'Abrir vendas online';const on=alertsOn();bn.classList.toggle('on',on);bn.textContent=on?(audioCtx?.state!=='running'?'🔊 Ativar som da sirene':notificationsOn()?'🔔 Sirene e avisos ativos':'🔔 Sirene ligada · testar som'):'🔕 Ativar sirene e avisos'}
async function getState(){const g=await ready();const {data,error}=await g.sb.from('store_settings').select('is_open,opened_at,closed_at,updated_at').eq('id','main').single();if(error)throw error;isOpen=!!data?.is_open;lastStateAt=Date.now();render();return data}
function unlockAudio(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=audioCtx||new AC();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch(_){return null}}
function tone(freq,start,dur,vol=.42){const c=unlockAudio();if(!c||c.state!=='running')return;const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime+start);g.gain.exponentialRampToValueAtTime(vol,c.currentTime+start+.015);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+start+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+start);o.stop(c.currentTime+start+dur+.03)}
function orderSound(){tone(784,0,.22,.50);tone(1047,.18,.24,.55);tone(1319,.40,.34,.60);setTimeout(()=>{tone(1047,0,.20,.48);tone(1319,.18,.34,.58)},760)}
function startPersistentAlarm(){
  if(!alertsOn()||pendingCount<1)return;
  unlockAudio();
  if(alarmTimer)return;
  orderSound();
  if(navigator.vibrate)try{navigator.vibrate([260,100,260,100,520])}catch(_){}
  alarmTimer=setInterval(()=>{
    if(pendingCount<1){stopPersistentAlarm();return}
    orderSound();
    if(navigator.vibrate)try{navigator.vibrate([260,100,260,100,520])}catch(_){}
  },2400)
}
function stopPersistentAlarm(){
  if(alarmTimer){clearInterval(alarmTimer);alarmTimer=null}
  if(navigator.vibrate)try{navigator.vibrate(0)}catch(_){}
}
async function refreshPendingAlarm(){
 if(pendingBusy)return;
 pendingBusy=true;
 try{
  const g=await ready();
  const {data,error}=await g.sb.from('orders').select('id,public_code,customer_name,total,created_at,status,sales_channel').eq('status','Pedido recebido').is('archived_at',null).is('deleted_at',null).order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  const pending=(data||[]).filter(o=>o.sales_channel!=='local');
  const added=initialPendingRead?pending.filter(o=>!knownPending.has(o.id)):[];
  knownPending=new Set(pending.map(o=>o.id));initialPendingRead=true;
  pendingCount=pending.length;
  pendingCount>0?startPersistentAlarm():stopPersistentAlarm();
  for(const o of added)void notifyOrder(o);
 }catch(e){console.warn('Contagem de pedidos pendentes indisponível',e)}
 finally{pendingBusy=false}
}
async function registerSw(){if(!('serviceWorker'in navigator))return null;try{return await navigator.serviceWorker.register('./sw-admin.js?v=140',{scope:'./'})}catch(_){return null}}
async function enableNotifications(showFeedback=true){
 unlockAudio();
 localStorage.setItem(LS,'1');
 let allowed=false;
 if('Notification'in window){
  try{let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();allowed=p==='granted'}catch(e){console.warn('Permissão de notificação',e)}
 }
 await registerSw();
 render();await refreshPendingAlarm();
 if(showFeedback)toast(allowed?'🔔 Sirene e notificações ativadas.':'🔔 Sirene ativada. Para avisos do sistema, permita notificações no navegador.');
 return true
}
async function toggleNotifications(){if(alertsOn()){if(!audioCtx||audioCtx.state!=='running'){await enableNotifications(true);return}localStorage.setItem(LS,'0');stopPersistentAlarm();render();toast('Sirene e notificações desativadas.');return}await enableNotifications(true)}
async function showSystem(title,body,tag,url){if(!notificationsOn())return;try{const reg=await navigator.serviceWorker.ready;await reg.showNotification(title,{body,icon:new URL('../assets/icon-192.png?v=50',location.href).href,badge:new URL('../assets/favicon-32.png?v=50',location.href).href,tag,renotify:true,requireInteraction:true,silent:false,vibrate:[220,90,220,90,420],data:{url:url||location.href}})}catch(e){console.warn('GDS notificação',e)}}
async function testNotification(){await enableNotifications(false);orderSound();if(navigator.vibrate)try{navigator.vibrate([220,90,220,90,420])}catch(_){}await showSystem('🍧 GELADINHO DOS SONHOS — NOVO PEDIDO','PED-TESTE • Esta é uma demonstração do aviso de novo pedido.','gds-order-test-v50',location.href);toast('Aviso de teste enviado. Verifique som, vibração e notificação do celular.')}
async function toggleStore(){const g=await ready();const session=await g.ensure('orders');const next=!isOpen;if(next)await enableNotifications(false);const now=new Date().toISOString(),payload={is_open:next,updated_at:now,updated_by:session.user.id,opened_at:next?now:null,closed_at:next?null:now};const {error}=await g.sb.from('store_settings').update(payload).eq('id','main');if(error){toast('Não foi possível alterar a loja: '+error.message);return}isOpen=next;render();toast(next?'🟢 Vendas online abertas.':'🔴 Vendas online fechadas.');}
async function notifyOrder(o){if(!o?.id||o.sales_channel==='local'||o.status!=='Pedido recebido')return;const key='gds_notified_v83_'+o.id;const first=localStorage.getItem(key)!=='1';if(first)localStorage.setItem(key,'1');pendingCount=Math.max(1,pendingCount);if(alertsOn())startPersistentAlarm();if(!first||!alertsOn())return;if(navigator.vibrate)try{navigator.vibrate([220,90,220,90,420])}catch(_){}const code=o.public_code||'NOVO PEDIDO',name=o.customer_name||'Cliente',total=window.GDS48?GDS48.money(o.total):Number(o.total||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});const title='🍧 GELADINHO DOS SONHOS — NOVO PEDIDO',body=`${code} • ${name} • ${total}`;toast('🔔 '+title+' — '+body);await showSystem(title,body,'gds-new-order-'+o.id,new URL('orders-v48.html?v=140',location.href).href)}
async function subscribe(){const g=await ready();let session;try{session=await g.ensure('')}catch(_){return}if(session?.access_token)try{g.sb.realtime.setAuth(session.access_token)}catch(_){}if(channel)try{await g.sb.removeChannel(channel)}catch(_){}channel=g.sb.channel('gds-admin-order-alerts-v140').on('postgres_changes',{event:'*',schema:'public',table:'orders'},p=>{if(p.eventType==='INSERT'&&p.new?.sales_channel!=='local'&&p.new?.status==='Pedido recebido')void notifyOrder(p.new);void refreshPendingAlarm()}).subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('GDS: tempo real indisponível, mantendo consulta periódica')});}
function addHomeTestButton(){
 if(!location.pathname.endsWith('/admin/')&&!location.pathname.endsWith('/admin/index.html'))return;
 if(document.getElementById('gdsHomeAlarm140'))return;
 const header=document.querySelector('#dashboard .toolbar-right');if(!header)return;
 const button=document.createElement('button');button.id='gdsHomeAlarm140';button.type='button';button.textContent='🔊 Testar sirene';
 button.style.cssText='background:#fff4f8;color:#a90d4a;border:1px solid #f0bed3;border-radius:12px;padding:10px 12px;font-weight:850;min-height:43px;cursor:pointer';
 button.onclick=testNotification;header.prepend(button);
}
async function start(){
 addStyle();inject();
 try{await getState()}catch(e){console.warn('Estado da loja indisponível',e)}
 try{await refreshPendingAlarm();await subscribe();addHomeTestButton()}catch(e){console.warn('Avisos de pedidos indisponíveis',e)}
 setInterval(()=>{if(Date.now()-lastStateAt>12000)getState().catch(()=>{})},13000);
 setInterval(()=>{void refreshPendingAlarm()},5000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){getState().catch(()=>{});void refreshPendingAlarm()}});
 window.addEventListener('focus',()=>{getState().catch(()=>{});void refreshPendingAlarm()});
 ['pointerdown','touchstart','keydown'].forEach(ev=>addEventListener(ev,unlockAudio,{capture:true,passive:true}));
}
start();
})();
(()=>{
  if(window.__gdsAdminLiveV39)return;window.__gdsAdminLiveV39=true;
  const SB_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const SB_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const SDK='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.min.js';
  let sb=null,ordersChannel=null,presenceChannel=null,lastToken='',installPrompt=null,audioCtx=null,presenceWarm=false;
  let unread=Number(localStorage.getItem('gds_admin_unread_orders')||0);
  const pref=(k,def)=>localStorage.getItem(k)==null?def:localStorage.getItem(k)==='1';
  const setPref=(k,v)=>localStorage.setItem(k,v?'1':'0');
  const ordersPref=()=>pref('gds_admin_pref_orders',true);
  const visitorsPref=()=>pref('gds_admin_pref_visitors',false);
  const alertsEnabled=()=>localStorage.getItem('gds_admin_notify')==='1';

  function loadSdk(){return new Promise((resolve,reject)=>{
    if(window.supabase?.createClient)return resolve();
    const old=document.querySelector('script[data-gds-supabase-sdk]');
    if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return}
    const s=document.createElement('script');s.src=SDK;s.async=true;s.dataset.gdsSupabaseSdk='1';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)
  })}

  function addStyles(){if(document.getElementById('gdsAdminLiveStyle'))return;const s=document.createElement('style');s.id='gdsAdminLiveStyle';s.textContent=`
    .gdsLiveBar{max-width:1180px;margin:0 auto 8px;padding:0 14px 8px;display:flex;gap:7px;align-items:center;flex-wrap:wrap}
    .gdsLiveChip,.gdsLiveBtn{border:1px solid #efdde4;background:#fff;border-radius:999px;padding:7px 10px;font:850 11px Inter,system-ui,Arial;color:#4a101e;display:inline-flex;align-items:center;gap:6px}
    .gdsLiveBtn{cursor:pointer}.gdsLiveBtn.on{background:#eefaf3;color:#14753e;border-color:#bde7cc}.gdsDot{width:8px;height:8px;border-radius:50%;background:#bbb}.gdsDot.on{background:#19b15b;box-shadow:0 0 0 4px #19b15b22}
    .gdsOrdersBadge{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;margin-left:4px;border-radius:99px;background:#ff0f68;color:#fff;font-size:10px}
    .gdsToast{position:fixed;z-index:99999;right:14px;top:86px;width:min(390px,calc(100% - 28px));background:#fff;border:1px solid #efdde4;border-radius:18px;padding:14px 15px;box-shadow:0 18px 50px rgba(74,16,30,.20);transform:translateY(-12px);opacity:0;transition:.22s;pointer-events:none}.gdsToast.show{transform:none;opacity:1}.gdsToast.order{border-color:#ffb8d1;background:#fff7fa}.gdsToast b{display:block;color:#4a101e;margin-bottom:4px}.gdsToast span{color:#78616a;font-size:12px;line-height:1.4}
    .gdsPrefOverlay{position:fixed;inset:0;z-index:999999;background:#2a0a1677;backdrop-filter:blur(6px);display:grid;place-items:center;padding:16px}.gdsPrefCard{width:min(480px,100%);background:#fff;border-radius:22px;padding:20px;box-shadow:0 30px 80px #2a0a1640}.gdsPrefCard h2{margin:0 0 6px;color:#4a101e}.gdsPrefCard p{margin:0 0 14px;color:#78616a;font-size:13px;line-height:1.45}.gdsPrefRow{display:flex;align-items:center;gap:10px;padding:12px 0;border-top:1px solid #f3e7eb}.gdsPrefRow label{flex:1;font-weight:850;color:#4a101e}.gdsPrefRow small{display:block;color:#78616a;font-weight:500;margin-top:3px}.gdsPrefCard button{width:100%;border:0;border-radius:12px;padding:12px;margin-top:12px;background:#ff0f68;color:#fff;font-weight:900}
    @media(max-width:800px){.gdsLiveBar{padding-left:10px;padding-right:10px}.gdsLiveChip,.gdsLiveBtn{flex:1;justify-content:center}.gdsToast{top:132px;right:10px;width:calc(100% - 20px)}}
  `;document.head.appendChild(s)}

  function buildUi(){addStyles();const bar=document.querySelector('.bar');if(!bar||document.getElementById('gdsLiveBar'))return;const live=document.createElement('div');live.id='gdsLiveBar';live.className='gdsLiveBar';live.innerHTML=`
    <span class="gdsLiveChip"><i id="gdsRealtimeDot" class="gdsDot"></i><span id="gdsRealtimeText">Conectando...</span></span>
    <span class="gdsLiveChip">👥 <b id="gdsOnlineCount">0</b> online agora</span>
    <button id="gdsNotifyBtn" class="gdsLiveBtn">🔔 Ativar avisos</button>
    <button id="gdsPrefsBtn" class="gdsLiveBtn">⚙️ Notificações</button>
    <button id="gdsInstallAdmin" class="gdsLiveBtn" style="display:none">📲 Instalar GDS Admin</button>`;bar.appendChild(live);
    document.getElementById('gdsNotifyBtn').onclick=enableAlerts;document.getElementById('gdsPrefsBtn').onclick=openPrefs;document.getElementById('gdsInstallAdmin').onclick=installAdmin;updateNotifyButton();updateBadge();
    const ot=document.getElementById('ordersTab');if(ot){const b=document.createElement('span');b.id='gdsOrdersBadge';b.className='gdsOrdersBadge';ot.appendChild(b);ot.addEventListener('click',clearUnread);updateBadge()}
  }

  function setLive(ok,text){const d=document.getElementById('gdsRealtimeDot'),t=document.getElementById('gdsRealtimeText');if(d)d.classList.toggle('on',!!ok);if(t)t.textContent=text|| (ok?'Tempo real ativo':'Desconectado')}
  function updateNotifyButton(){const b=document.getElementById('gdsNotifyBtn');if(!b)return;const ok=alertsEnabled()&&(!('Notification'in window)||Notification.permission==='granted');b.classList.toggle('on',ok);b.textContent=ok?'🔔 Avisos ativos':'🔔 Ativar avisos'}
  function updateBadge(){const b=document.getElementById('gdsOrdersBadge');if(b){b.textContent=unread;b.style.display=unread?'inline-grid':'none'}if('setAppBadge'in navigator){try{unread?navigator.setAppBadge(unread):navigator.clearAppBadge()}catch(_){}}}
  function clearUnread(){unread=0;localStorage.setItem('gds_admin_unread_orders','0');updateBadge()}

  function toast(title,body,type=''){let x=document.getElementById('gdsAdminToast');if(!x){x=document.createElement('div');x.id='gdsAdminToast';x.className='gdsToast';x.innerHTML='<b></b><span></span>';document.body.appendChild(x)}x.className='gdsToast '+type;x.querySelector('b').textContent=title;x.querySelector('span').textContent=body||'';requestAnimationFrame(()=>x.classList.add('show'));clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove('show'),6500)}
  function unlockAudio(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch(_){return null}}
  function tone(f,start,dur,vol=.14){const c=unlockAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,c.currentTime+start);g.gain.exponentialRampToValueAtTime(vol,c.currentTime+start+.02);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+start+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+start);o.stop(c.currentTime+start+dur+.03)}
  function orderSound(){tone(880,0,.20,.17);tone(1175,.22,.24,.18);tone(880,.52,.20,.15)}
  function visitorSound(){tone(660,0,.14,.08);tone(880,.16,.16,.08)}

  async function notifyOs(title,body,tag){if(!alertsEnabled()||!('Notification'in window)||Notification.permission!=='granted')return;try{const reg=await navigator.serviceWorker.ready;await reg.showNotification(title,{body,icon:new URL('../assets/icon-192.png',location.href).href,badge:new URL('../assets/favicon-32.png',location.href).href,tag,renotify:true,data:{url:new URL('./',location.href).href}})}catch(_){}}
  async function enableAlerts(){unlockAudio();if('serviceWorker'in navigator)try{await navigator.serviceWorker.register('../sw.js')}catch(_){};if('Notification'in window){const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();if(p!=='granted'){localStorage.removeItem('gds_admin_notify');updateNotifyButton();toast('Notificações bloqueadas','Você ainda verá os avisos dentro do painel.');return}}localStorage.setItem('gds_admin_notify','1');updateNotifyButton();visitorSound();toast('Avisos ativados','Novos pedidos poderão tocar, vibrar e aparecer como notificação enquanto o GDS Admin estiver ativo.')}

  function openPrefs(){document.getElementById('gdsPrefsOverlay')?.remove();const ov=document.createElement('div');ov.id='gdsPrefsOverlay';ov.className='gdsPrefOverlay';ov.innerHTML=`<div class="gdsPrefCard"><h2>Notificações do GDS Admin</h2><p>Escolha quais acontecimentos merecem chamar sua atenção.</p><div class="gdsPrefRow"><label>Novo pedido<small>Som, vibração, aviso e badge.</small></label><input id="gdsPrefOrders" type="checkbox" ${ordersPref()?'checked':''}></div><div class="gdsPrefRow"><label>Cliente entrou na loja<small>Opcional. O contador online continua funcionando mesmo desligado.</small></label><input id="gdsPrefVisitors" type="checkbox" ${visitorsPref()?'checked':''}></div><button id="gdsPrefsSave">Salvar preferências</button></div>`;document.body.appendChild(ov);ov.addEventListener('click',e=>{if(e.target===ov)ov.remove()});document.getElementById('gdsPrefsSave').onclick=()=>{setPref('gds_admin_pref_orders',document.getElementById('gdsPrefOrders').checked);setPref('gds_admin_pref_visitors',document.getElementById('gdsPrefVisitors').checked);ov.remove();toast('Preferências salvas','As próximas notificações seguirão sua escolha.')}}

  async function installAdmin(){if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;const b=document.getElementById('gdsInstallAdmin');if(b)b.style.display='none'}
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;const b=document.getElementById('gdsInstallAdmin');if(b)b.style.display='inline-flex'});
  addEventListener('appinstalled',()=>{installPrompt=null;const b=document.getElementById('gdsInstallAdmin');if(b)b.style.display='none';toast('GDS Admin instalado','Agora você pode abrir o administrativo pelo ícone do celular.')});

  async function handleOrder(payload){const o=payload?.new||{};const id=o.id||o.public_code;if(!id)return;const key='gds_admin_notified_'+id;if(localStorage.getItem(key)==='1')return;localStorage.setItem(key,'1');if(!ordersPref())return;unread++;localStorage.setItem('gds_admin_unread_orders',String(unread));updateBadge();orderSound();if(navigator.vibrate)try{navigator.vibrate([180,100,180,100,350])}catch(_){};const code=o.public_code?'#'+o.public_code:'novo pedido',body=[o.customer_name||'Cliente',o.total!=null?Number(o.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):''].filter(Boolean).join(' · ');toast('🔔 Novo pedido '+code,body,'order');await notifyOs('🔔 Novo pedido '+code,body,'gds-admin-order-'+id);try{if(document.getElementById('ordersFrame')?.classList.contains('on'))document.getElementById('ordersFrame').src='orders-v30.html?v=39&t='+Date.now()}catch(_){}}

  function countPresence(){if(!presenceChannel)return;const st=presenceChannel.presenceState?.()||{};let n=0;Object.values(st).flat().forEach(p=>{if(p?.role==='shopper'&&p?.visible!==false)n++});const el=document.getElementById('gdsOnlineCount');if(el)el.textContent=String(n)}
  function visitorJoined(info){if(!presenceWarm||!visitorsPref())return;const list=Array.isArray(info?.newPresences)?info.newPresences:[];if(!list.some(p=>p?.role==='shopper'&&p?.visible!==false))return;visitorSound();toast('👀 Cliente na loja','Uma pessoa acabou de abrir a loja.');notifyOs('👀 Cliente na loja','Uma pessoa acabou de abrir o Geladinho dos Sonhos.','gds-admin-visitor-'+Date.now())}

  async function startPresence(){if(presenceChannel||!sb)return;presenceChannel=sb.channel('gds-store-presence',{config:{presence:{key:'admin-watch-'+Math.random().toString(36).slice(2)}}});presenceChannel.on('presence',{event:'sync'},countPresence).on('presence',{event:'join'},visitorJoined).on('presence',{event:'leave'},countPresence).subscribe(status=>{if(status==='SUBSCRIBED'){countPresence();setTimeout(()=>{presenceWarm=true},1800)}})}

  async function ensureOrders(){if(!sb)return;try{const {data:{session}}=await sb.auth.getSession();if(!session){setLive(false,'Entre no painel');return}const aal=await sb.auth.mfa.getAuthenticatorAssuranceLevel();if(aal.error||aal.data?.currentLevel!=='aal2'){setLive(false,'Aguardando MFA');return}if(lastToken===session.access_token&&ordersChannel)return;if(ordersChannel){await sb.removeChannel(ordersChannel);ordersChannel=null}lastToken=session.access_token;sb.realtime.setAuth(session.access_token);ordersChannel=sb.channel('gds-admin-orders-'+Date.now()).on('postgres_changes',{event:'INSERT',schema:'public',table:'orders'},handleOrder).subscribe(status=>{if(status==='SUBSCRIBED')setLive(true,'Pedidos ao vivo');else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')setLive(false,'Reconectando...')})}catch(e){setLive(false,'Reconectando...')}}

  async function start(){buildUi();try{if('serviceWorker'in navigator)await navigator.serviceWorker.register('../sw.js');await loadSdk();sb=window.supabase.createClient(SB_URL,SB_KEY);await startPresence();await ensureOrders();setInterval(ensureOrders,3000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)ensureOrders()});['pointerdown','touchstart','keydown'].forEach(ev=>addEventListener(ev,unlockAudio,{capture:true,passive:true,once:false}))}catch(e){console.error('GDS Admin Live indisponível',e);setLive(false,'Tempo real indisponível')}}
  start();
})();
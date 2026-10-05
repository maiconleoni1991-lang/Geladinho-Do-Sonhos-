(()=>{
  if(window.__gdsStorePresenceV39)return;window.__gdsStorePresenceV39=true;
  const SB_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const SB_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const SDK='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.min.js';
  let channel=null,sb=null;
  const visitorKey=sessionStorage.getItem('gds_presence_id')||((crypto.randomUUID&&crypto.randomUUID())||('gds-'+Date.now()+'-'+Math.random().toString(36).slice(2)));
  sessionStorage.setItem('gds_presence_id',visitorKey);

  function loadSdk(){
    return new Promise((resolve,reject)=>{
      if(window.supabase?.createClient)return resolve();
      const old=document.querySelector('script[data-gds-supabase-sdk]');
      if(old){old.addEventListener('load',()=>resolve(),{once:true});old.addEventListener('error',reject,{once:true});return}
      const s=document.createElement('script');s.src=SDK;s.async=true;s.dataset.gdsSupabaseSdk='1';s.onload=()=>resolve();s.onerror=reject;document.head.appendChild(s);
    });
  }

  async function track(){
    if(!channel)return;
    try{await channel.track({role:'shopper',visible:!document.hidden,at:Date.now()})}catch(_){ }
  }

  async function start(){
    try{
      await loadSdk();
      sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'gds-store-public'}});
      channel=sb.channel('gds-store-presence',{config:{presence:{key:visitorKey}}});
      channel.subscribe(async status=>{if(status==='SUBSCRIBED')await track()});
      document.addEventListener('visibilitychange',track);
      addEventListener('pagehide',()=>{try{channel?.untrack()}catch(_){}});
    }catch(e){console.warn('Presença da loja indisponível',e)}
  }
  start();
})();
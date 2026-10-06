(()=>{
  if(window.__gdsAdminMfaGateV46)return;window.__gdsAdminMfaGateV46=true;
  const SB_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const SB_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const sb=supabase.createClient(SB_URL,SB_KEY);
  let checking=false,lastState='';

  function style(){
    if(document.getElementById('gdsMfaGateStyleV46'))return;
    const s=document.createElement('style');s.id='gdsMfaGateStyleV46';s.textContent=`
      #gdsMfaGateV46{position:fixed;inset:0;z-index:2147483647;background:rgba(42,10,22,.76);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:none;place-items:center;padding:16px;touch-action:manipulation}
      #gdsMfaGateV46.show{display:grid}
      #gdsMfaGateV46 .card{width:min(460px,100%);background:#fff;border-radius:24px;padding:22px;box-shadow:0 30px 90px rgba(45,10,25,.38);text-align:center;color:#35131f;border:1px solid #efdde4}
      #gdsMfaGateV46 h2{margin:6px 0 8px;color:#4a101e}
      #gdsMfaGateV46 p{margin:0 0 14px;color:#735e66;line-height:1.5;font-size:14px}
      #gdsMfaGateV46 input{width:100%;border:1px solid #efdde4;border-radius:13px;padding:13px;text-align:center;font-size:22px;letter-spacing:.18em;outline:none;background:#fff;pointer-events:auto!important;touch-action:manipulation!important}
      #gdsMfaGateV46 input:focus{border-color:#ff0f68;box-shadow:0 0 0 3px rgba(255,15,104,.12)}
      #gdsMfaGateV46 button{width:100%;border:0;border-radius:13px;padding:12px;margin-top:9px;font-weight:900;cursor:pointer;pointer-events:auto!important;touch-action:manipulation!important}
      #gdsMfaGateV46 .primary{background:linear-gradient(90deg,#ff0f68,#ff4e8e);color:#fff}
      #gdsMfaGateV46 .ghost{background:#fff0f5;color:#6a1936}
      #gdsMfaGateV46 .msg{min-height:20px;margin-top:10px;font-size:12px;color:#b02a42}
      #gdsMfaGateV46 .ok{color:#128249}
      #gdsMfaGateV46 .shield{font-size:42px}
    `;document.head.appendChild(s);
  }
  function gate(){
    style();let g=document.getElementById('gdsMfaGateV46');if(g)return g;
    g=document.createElement('div');g.id='gdsMfaGateV46';g.innerHTML=`<div class="card"><div class="shield">🔐</div><h2>Confirmação de segurança</h2><p>Digite o código de 6 dígitos do seu aplicativo autenticador para liberar estoque, pedidos, eventos e relatórios.</p><input id="gdsMfaCodeV46" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"><button id="gdsMfaVerifyV46" class="primary" type="button">Confirmar código e liberar painel</button><button id="gdsMfaLogoutV46" class="ghost" type="button">Sair da conta</button><div id="gdsMfaMsgV46" class="msg"></div></div>`;document.body.appendChild(g);
    document.getElementById('gdsMfaVerifyV46').addEventListener('click',verify);
    document.getElementById('gdsMfaCodeV46').addEventListener('keydown',e=>{if(e.key==='Enter')verify()});
    document.getElementById('gdsMfaLogoutV46').addEventListener('click',async()=>{await sb.auth.signOut();hide();reloadAdmin('logout')});
    return g;
  }
  function show(message=''){
    const g=gate();g.classList.add('show');document.body.dataset.gdsMfaReady='0';
    const m=document.getElementById('gdsMfaMsgV46');if(m){m.className='msg';m.textContent=message}
    setTimeout(()=>document.getElementById('gdsMfaCodeV46')?.focus(),80);
  }
  function hide(){const g=document.getElementById('gdsMfaGateV46');if(g)g.classList.remove('show');document.body.dataset.gdsMfaReady='1'}
  function reloadFrames(){
    const t=Date.now();
    const map=[['adminFrame','manage.html'],['ordersFrame','orders-v30.html'],['eventsFrame','events-v41.html'],['reportsFrame','reports-v30.html']];
    map.forEach(([id,path])=>{const f=document.getElementById(id);if(f)f.src=`${path}?v=46&mfa=1&t=${t}`});
  }
  function reloadAdmin(reason){if(reason==='logout'){const f=document.getElementById('adminFrame');if(f)f.src='manage.html?v=46&t='+Date.now()}}
  async function factor(){
    const {data,error}=await sb.auth.mfa.listFactors();if(error)throw error;
    return data?.totp?.find(x=>x.status==='verified')||null;
  }
  async function verify(){
    const code=(document.getElementById('gdsMfaCodeV46')?.value||'').trim();const m=document.getElementById('gdsMfaMsgV46');
    if(!/^\d{6}$/.test(code)){m.textContent='Digite os 6 dígitos do aplicativo autenticador.';return}
    const b=document.getElementById('gdsMfaVerifyV46');b.disabled=true;m.className='msg';m.textContent='Verificando código...';
    try{
      const f=await factor();if(!f)throw new Error('Fator MFA verificado não encontrado para esta conta.');
      const ch=await sb.auth.mfa.challenge({factorId:f.id});if(ch.error)throw ch.error;
      const vr=await sb.auth.mfa.verify({factorId:f.id,challengeId:ch.data.id,code});if(vr.error)throw vr.error;
      const aal=await sb.auth.mfa.getAuthenticatorAssuranceLevel();if(aal.error)throw aal.error;
      if(aal.data?.currentLevel!=='aal2')throw new Error('A sessão ainda não foi promovida para AAL2.');
      m.className='msg ok';m.textContent='Segurança confirmada. Painel liberado.';lastState='aal2';
      setTimeout(()=>{hide();reloadFrames()},250);
    }catch(e){m.className='msg';m.textContent=e?.message||'Não foi possível validar o código.'}
    finally{b.disabled=false}
  }
  async function check(){
    if(checking)return;checking=true;
    try{
      const {data:{session}}=await sb.auth.getSession();
      if(!session){lastState='signed-out';hide();return}
      const {data,error}=await sb.auth.mfa.getAuthenticatorAssuranceLevel();if(error)throw error;
      const cur=data?.currentLevel||'aal1',next=data?.nextLevel||cur;
      if(cur==='aal2'){if(lastState!=='aal2')reloadFrames();lastState='aal2';hide();return}
      if(cur==='aal1'&&next==='aal2'){lastState='needs-mfa';show();return}
      lastState='aal1-no-factor';hide();
    }catch(e){console.error('GDS MFA gate v46',e);show('Não foi possível confirmar a segurança da sessão. Atualize a página e tente novamente.')}
    finally{checking=false}
  }
  gate();hide();
  sb.auth.onAuthStateChange(()=>setTimeout(check,80));
  window.addEventListener('focus',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
  setInterval(check,1200);
  setTimeout(check,100);setTimeout(check,500);
})();
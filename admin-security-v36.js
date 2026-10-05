(()=>{
  if(window.__gdsAdminSecurityV36)return;window.__gdsAdminSecurityV36=true;
  const SB_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const SB_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const secSb=supabase.createClient(SB_URL,SB_KEY);
  let enrollFactorId=null;

  function addStyles(){
    if(document.getElementById('gdsSecurityStyle'))return;
    const s=document.createElement('style');s.id='gdsSecurityStyle';s.textContent=`
      .gdsSecBanner{margin:0 0 16px;padding:14px 16px;border-radius:16px;border:1px solid #efdde4;background:#fff;box-shadow:0 10px 30px rgba(99,23,51,.06);display:flex;gap:12px;align-items:center;flex-wrap:wrap}
      .gdsSecBanner b{display:block;color:#4a101e}.gdsSecBanner small{display:block;color:#78616a;margin-top:3px;line-height:1.4}.gdsSecBanner .grow{flex:1;min-width:220px}.gdsSecBanner button{border:0;border-radius:11px;padding:10px 13px;background:#ff0f68;color:#fff;font-weight:900;cursor:pointer}.gdsSecBanner.good{background:#f0fbf5;border-color:#bfe6ce}.gdsSecBanner.warn{background:#fff8ed;border-color:#f0d6a5}
      .gdsSecOverlay{position:fixed;inset:0;z-index:99999;background:rgba(42,10,22,.72);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px}
      .gdsSecCard{width:min(480px,100%);background:#fff;border-radius:22px;padding:22px;box-shadow:0 30px 90px rgba(45,10,25,.35);text-align:center;color:#35131f}.gdsSecCard h2{margin:4px 0 8px}.gdsSecCard p{color:#735e66;line-height:1.5}.gdsSecCard input{width:100%;border:1px solid #efdde4;border-radius:12px;padding:12px;margin:8px 0;text-align:center;font-size:20px;letter-spacing:.12em}.gdsSecCard button{width:100%;border:0;border-radius:12px;padding:12px;margin-top:8px;font-weight:900;cursor:pointer}.gdsSecPrimary{background:#ff0f68;color:#fff}.gdsSecGhost{background:#fff0f5;color:#6a1936}.gdsQr{max-width:220px;width:70%;margin:12px auto;border-radius:14px;background:#fff;padding:8px;border:1px solid #efdde4}.gdsSecret{font-family:ui-monospace,Consolas,monospace;font-size:12px;word-break:break-all;background:#f7f2f4;padding:9px;border-radius:9px}.gdsSecMsg{min-height:20px;margin-top:8px;font-size:12px;color:#b02a42}
    `;document.head.appendChild(s)
  }

  function removeSignup(){const b=document.getElementById('signup');if(b)b.remove()}
  function hideViewsForMfa(){document.getElementById('appView')?.classList.add('hidden');document.getElementById('waitingView')?.classList.add('hidden')}
  function showAppAfterMfa(){document.getElementById('waitingView')?.classList.add('hidden');document.getElementById('authView')?.classList.add('hidden');document.getElementById('appView')?.classList.remove('hidden')}
  function closeOverlay(){document.getElementById('gdsSecOverlay')?.remove()}

  function banner(mode){
    const app=document.getElementById('appView');if(!app)return;
    let b=document.getElementById('gdsSecBanner');
    if(!b){b=document.createElement('div');b.id='gdsSecBanner';app.insertBefore(b,app.firstChild)}
    if(mode==='enabled'){
      b.className='gdsSecBanner good';b.innerHTML='<div>🛡️</div><div class="grow"><b>Verificação em 2 etapas ativa</b><small>Este painel exige senha + código do autenticador em novos logins.</small></div>';
    }else{
      b.className='gdsSecBanner warn';b.innerHTML='<div>⚠️</div><div class="grow"><b>Ative a verificação em 2 etapas</b><small>Protege estoque, pedidos e administração mesmo se sua senha vazar.</small></div><button type="button" id="gdsEnableMfa">Ativar agora</button>';
      document.getElementById('gdsEnableMfa').onclick=startEnroll;
    }
  }

  async function startEnroll(){
    closeOverlay();
    const ov=document.createElement('div');ov.id='gdsSecOverlay';ov.className='gdsSecOverlay';ov.innerHTML='<div class="gdsSecCard"><div style="font-size:40px">🛡️</div><h2>Ativar verificação em 2 etapas</h2><p>Abra Google Authenticator, Microsoft Authenticator, Authy ou outro app TOTP e escaneie o QR code.</p><div id="gdsEnrollBody">Gerando QR code...</div><div class="gdsSecMsg" id="gdsEnrollMsg"></div></div>';document.body.appendChild(ov);
    const {data,error}=await secSb.auth.mfa.enroll({factorType:'totp',friendlyName:'Geladinho dos Sonhos Admin'});
    if(error){document.getElementById('gdsEnrollBody').textContent='Não foi possível iniciar a configuração.';document.getElementById('gdsEnrollMsg').textContent=error.message;return}
    enrollFactorId=data.id;
    document.getElementById('gdsEnrollBody').innerHTML=`<img class="gdsQr" src="${data.totp.qr_code}" alt="QR code MFA"><div class="gdsSecret">${data.totp.secret}</div><p>Digite abaixo o código de 6 dígitos exibido no seu aplicativo.</p><input id="gdsEnrollCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"><button class="gdsSecPrimary" id="gdsVerifyEnroll">Confirmar e ativar</button><button class="gdsSecGhost" id="gdsCancelEnroll">Cancelar</button>`;
    document.getElementById('gdsVerifyEnroll').onclick=verifyEnrollment;
    document.getElementById('gdsCancelEnroll').onclick=cancelEnrollment;
  }

  async function cancelEnrollment(){
    if(enrollFactorId)try{await secSb.auth.mfa.unenroll({factorId:enrollFactorId})}catch(_){}
    enrollFactorId=null;closeOverlay();
  }

  async function verifyEnrollment(){
    const code=(document.getElementById('gdsEnrollCode')?.value||'').trim(),m=document.getElementById('gdsEnrollMsg');
    if(!/^\d{6}$/.test(code)){m.textContent='Digite o código de 6 dígitos.';return}
    m.textContent='Verificando...';
    const ch=await secSb.auth.mfa.challenge({factorId:enrollFactorId});if(ch.error){m.textContent=ch.error.message;return}
    const vr=await secSb.auth.mfa.verify({factorId:enrollFactorId,challengeId:ch.data.id,code});if(vr.error){m.textContent=vr.error.message;return}
    m.style.color='#128249';m.textContent='Proteção ativada com sucesso.';setTimeout(()=>location.reload(),500)
  }

  async function showChallenge(){
    hideViewsForMfa();closeOverlay();
    const factors=await secSb.auth.mfa.listFactors();const factor=factors.data?.totp?.find(f=>f.status==='verified')||factors.data?.totp?.[0];
    const ov=document.createElement('div');ov.id='gdsSecOverlay';ov.className='gdsSecOverlay';ov.innerHTML='<div class="gdsSecCard"><div style="font-size:42px">🔐</div><h2>Confirmação de segurança</h2><p>Digite o código de 6 dígitos do seu aplicativo autenticador para abrir o painel.</p><input id="gdsMfaCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"><button class="gdsSecPrimary" id="gdsMfaVerify">Entrar no painel</button><button class="gdsSecGhost" id="gdsMfaLogout">Sair da conta</button><div class="gdsSecMsg" id="gdsMfaMsg"></div></div>';document.body.appendChild(ov);
    document.getElementById('gdsMfaLogout').onclick=async()=>{await secSb.auth.signOut();location.reload()};
    document.getElementById('gdsMfaVerify').onclick=async()=>{
      const code=(document.getElementById('gdsMfaCode').value||'').trim(),m=document.getElementById('gdsMfaMsg');if(!factor){m.textContent='Fator MFA não encontrado.';return}if(!/^\d{6}$/.test(code)){m.textContent='Digite o código de 6 dígitos.';return}
      m.textContent='Verificando...';const ch=await secSb.auth.mfa.challenge({factorId:factor.id});if(ch.error){m.textContent=ch.error.message;return}const vr=await secSb.auth.mfa.verify({factorId:factor.id,challengeId:ch.data.id,code});if(vr.error){m.textContent=vr.error.message;return}closeOverlay();showAppAfterMfa();banner('enabled');setTimeout(()=>{try{window.loadAll?.()}catch(_){}},120)
    }
  }

  async function checkSecurity(){
    addStyles();removeSignup();
    const {data:{session}}=await secSb.auth.getSession();if(!session){closeOverlay();return}
    const aal=await secSb.auth.mfa.getAuthenticatorAssuranceLevel();if(aal.error)return;
    if(aal.data?.nextLevel==='aal2'&&aal.data?.currentLevel!=='aal2'){await showChallenge();return}
    const factors=await secSb.auth.mfa.listFactors();const hasVerified=!!factors.data?.totp?.some(f=>f.status==='verified');
    if(hasVerified){showAppAfterMfa();banner('enabled')}else{banner('setup')}
  }

  secSb.auth.onAuthStateChange(()=>setTimeout(checkSecurity,120));
  setTimeout(checkSecurity,200);setTimeout(checkSecurity,900);
})();
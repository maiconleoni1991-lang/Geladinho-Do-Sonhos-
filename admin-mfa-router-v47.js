(()=>{
  if(window.__gdsAdminMfaRouterV47)return;window.__gdsAdminMfaRouterV47=true;
  const SB_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co',SB_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const sb=supabase.createClient(SB_URL,SB_KEY);let checking=false,last='';
  async function check(){
    if(checking)return;checking=true;
    try{
      const {data:{session}}=await sb.auth.getSession();
      if(!session){last='signed-out';return}
      const {data,error}=await sb.auth.mfa.getAuthenticatorAssuranceLevel();if(error)throw error;
      const cur=data?.currentLevel||'aal1',next=data?.nextLevel||cur;
      if(cur==='aal1'&&next==='aal2'){
        if(last!=='redirecting'){last='redirecting';location.replace('./mfa.html?v=47')}
        return;
      }
      last=cur;
    }catch(e){console.error('GDS MFA router v47',e)}
    finally{checking=false}
  }
  sb.auth.onAuthStateChange(()=>setTimeout(check,80));
  window.addEventListener('focus',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
  setInterval(check,1000);setTimeout(check,100);setTimeout(check,500);
})();
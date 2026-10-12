(()=>{
const V='125';
const URL='https://qpqruhcspbdxjcnbhdhn.supabase.co',KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
const sb=window.supabase.createClient(URL,KEY);
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
(function markAdminArea(){
 let meta=document.querySelector('meta[name="robots"]');
 if(!meta){meta=document.createElement('meta');meta.name='robots';document.head.appendChild(meta)}
 meta.content='noindex,nofollow,noarchive';
})();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw-admin.js?v='+V,{scope:'./'}).then(r=>r.update()).catch(()=>{});
function nav(active=''){
 if(document.getElementById('gdsAdminNav48'))return;
 const s=document.createElement('style');s.textContent=`.gdsNav48{position:sticky;top:0;z-index:1000;background:#fffafcee;backdrop-filter:blur(14px);border-bottom:1px solid #efdde4}.gdsNav48in{max-width:1180px;margin:auto;padding:8px 12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gdsNav48 img{width:110px;height:66px;object-fit:contain;display:block;opacity:1;visibility:visible}.gdsNav48 b{color:#4a101e}.gdsLinks48{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}.gdsLinks48 a{min-height:42px;display:inline-flex;align-items:center;text-decoration:none;border:1px solid #efdde4;border-radius:11px;padding:9px 10px;background:#fff;color:#4a101e;font:800 12px Inter,system-ui}.gdsLinks48 a.on{background:#ff0f68;color:#fff;border-color:#ff0f68}.gdsSec48{width:100%;font-size:11px;color:#14753e;font-weight:800}.gdsMobileBar48,.gdsMore48{display:none}
@media(max-width:760px){
 body{padding-bottom:74px!important}
 .gdsNav48{position:sticky}
 .gdsNav48in{padding:7px 10px;flex-wrap:nowrap}
 .gdsNav48 img{width:74px;height:48px}
 .gdsNav48in>div:nth-of-type(1){min-width:0}
 .gdsNav48in>div:nth-of-type(1) b{font-size:14px}
 .gdsLinks48{display:none!important}
 .gdsSec48{display:none}
 .gdsMobileBar48{display:grid;position:fixed;left:8px;right:8px;bottom:8px;z-index:1500;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #efdde4;border-radius:18px;padding:6px;box-shadow:0 14px 40px #4a101e26}
 .gdsMobileBar48 a,.gdsMobileBar48 button{min-height:52px;border:0;background:transparent;color:#4a101e;border-radius:12px;text-decoration:none;font:800 10px Inter,system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
 .gdsMobileBar48 .ico{font-size:19px;line-height:1}
 .gdsMobileBar48 .on{background:#ff0f68;color:#fff}
 .gdsMore48{position:fixed;inset:0;z-index:2000;background:#2a0a166e;align-items:flex-end}
 .gdsMore48.open{display:flex}
 .gdsMoreSheet48{width:100%;max-height:82vh;overflow:auto;background:#fff;border-radius:24px 24px 0 0;padding:14px 14px 24px;box-shadow:0 -18px 50px #2a0a1633}
 .gdsMoreHead48{display:flex;align-items:center;gap:10px;margin-bottom:10px}
 .gdsMoreHead48 b{font-size:17px;color:#4a101e}
 .gdsMoreClose48{margin-left:auto;width:38px;height:38px;border:1px solid #efdde4;border-radius:11px;background:#fff;font-size:22px;font-weight:900;color:#4a101e}
 .gdsMoreGroup48{margin-top:13px}
 .gdsMoreTitle48{font-size:11px;font-weight:950;color:#8c6b76;text-transform:uppercase;letter-spacing:.05em;margin:0 0 7px 4px}
 .gdsMoreGrid48{display:grid;grid-template-columns:1fr 1fr;gap:7px}
 .gdsMoreGrid48 a,.gdsMoreGrid48 button{min-height:46px;border:1px solid #efdde4;border-radius:12px;background:#fff;color:#4a101e;text-decoration:none;font:800 12px Inter,system-ui;display:flex;align-items:center;justify-content:flex-start;gap:7px;padding:10px}
 .gdsMoreGrid48 a.on{background:#fff0f5;border-color:#ff9dbf;color:#9e1648}
}`;
 document.head.appendChild(s);
 const n=document.createElement('div');n.id='gdsAdminNav48';n.className='gdsNav48';n.innerHTML=`<div class="gdsNav48in"><img class="gdsAdminLogo65" src="../assets/logo-oficial-hq-v65.webp?v=117" alt="Geladinho dos Sonhos" onerror="this.onerror=null;this.src='../assets/icon-512.png?v=117'"><div><b>Geladinho dos Sonhos</b><div style="font-size:11px;color:#78616a">Administração</div></div><div class="gdsLinks48"><a data-k="home" href="./?v=${V}">🏠 Painel</a><a data-k="products" href="products-v48.html?v=${V}">⚙️ Estoque</a><a data-k="orders" href="orders-v48.html?v=${V}">🔔 Pedidos / Abrir Loja</a><a data-k="local" href="local-sales-v90.html?v=${V}">🏠 Venda no Local</a><a data-k="payments" href="payments-v117.html?v=${V}">💰 Pagamentos</a><a data-k="trusted" href="trusted-customers-v116.html?v=${V}">🤝 Clientes / Fiado</a><a data-k="archived" href="archived-orders-v87.html?v=${V}">🗄️ Arquivados</a><a data-k="events" href="events-v57.html?v=${V}">🎉 Eventos</a><a data-k="bases" href="receitas-bases-v1.html?v=125">🧾 Receitas e custos</a><a data-k="book" href="receitas-bases-v1.html?v=125#book">📖 Livro de Receitas / Produções</a><a data-k="powders" href="receitas-bases-v1.html?v=125#powders">🎨 Pós saborizantes</a><a data-k="complements" href="receitas-bases-v1.html?v=125#complements">🍫 Recheios</a><a data-k="reports" href="reports-v48.html?v=${V}">📊 Relatórios</a><a data-k="reviews" href="reviews-v63.html?v=${V}">⭐ Depoimentos</a><a data-k="store" href="../?v=${V}" target="_blank" rel="noopener">👁️ Loja</a><button id="gdsInstallAdmin48" type="button" style="min-height:42px;border:1px solid #efdde4;border-radius:11px;padding:9px 10px;background:#fff;color:#4a101e;font:800 12px Inter,system-ui;cursor:pointer">⬇️ Instalar Admin</button></div><div id="gdsSec48" class="gdsSec48">🔐 Verificando segurança…</div></div>`;
 document.body.prepend(n);const localLinks=[...document.querySelectorAll('a[href*="local-sales-v90.html"]')];if(localLinks.length>1)localLinks.slice(1).forEach(a=>a.remove());n.querySelector(`[data-k="${active}"]`)?.classList.add('on');

 const mb=document.createElement('div');mb.className='gdsMobileBar48';mb.id='gdsMobileBar48';mb.innerHTML=`
   <a data-mk="home" href="./?v=${V}"><span class="ico">🏠</span><span>Painel</span></a>
   <a data-mk="orders" href="orders-v48.html?v=${V}"><span class="ico">🔔</span><span>Pedidos</span></a>
   <a data-mk="local" href="local-sales-v90.html?v=${V}"><span class="ico">🛒</span><span>Venda</span></a>
   <button id="gdsMoreBtn48" type="button"><span class="ico">☰</span><span>Mais</span></button>`;
 document.body.appendChild(mb);
 if(['home','orders','local'].includes(active))mb.querySelector(`[data-mk="${active}"]`)?.classList.add('on');else mb.querySelector('#gdsMoreBtn48')?.classList.add('on');

 const more=document.createElement('div');more.className='gdsMore48';more.id='gdsMore48';more.innerHTML=`
  <div class="gdsMoreSheet48">
   <div class="gdsMoreHead48"><b>☰ Mais opções</b><button id="gdsMoreClose48" class="gdsMoreClose48" type="button">×</button></div>
   <div class="gdsMoreGroup48"><div class="gdsMoreTitle48">Vendas</div><div class="gdsMoreGrid48">
    <a data-k2="payments" href="payments-v117.html?v=${V}">💰 Pagamentos</a>
    <a data-k2="trusted" href="trusted-customers-v116.html?v=${V}">🤝 Clientes / Fiado</a>
    <a data-k2="archived" href="archived-orders-v87.html?v=${V}">🗄️ Arquivados</a>
    <a data-k2="events" href="events-v57.html?v=${V}">🎉 Eventos</a>
   </div></div>
   <div class="gdsMoreGroup48"><div class="gdsMoreTitle48">Produção</div><div class="gdsMoreGrid48">
    <a data-k2="products" href="products-v48.html?v=${V}">⚙️ Estoque</a>
    <a data-k2="bases" href="receitas-bases-v1.html?v=${V}">🧾 Receitas e custos</a>
    <a data-k2="powders" href="receitas-bases-v1.html?v=${V}#powders">🎨 Pós saborizantes</a>
    <a data-k2="complements" href="receitas-bases-v1.html?v=${V}#complements">🍫 Recheios</a>
   </div></div>
   <div class="gdsMoreGroup48"><div class="gdsMoreTitle48">Gestão</div><div class="gdsMoreGrid48">
    <a data-k2="reports" href="reports-v48.html?v=${V}">📊 Relatórios</a>
    <a data-k2="reviews" href="reviews-v63.html?v=${V}">⭐ Depoimentos</a>
    <a data-k2="store" href="../?v=${V}" target="_blank" rel="noopener">👁️ Loja</a>
    <button id="gdsInstallAdminMobile48" type="button">⬇️ Instalar Admin</button>
   </div></div>
  </div>`;
 document.body.appendChild(more);
 more.querySelector(`[data-k2="${active}"]`)?.classList.add('on');
 const openMore=()=>more.classList.add('open'),closeMore=()=>more.classList.remove('open');
 mb.querySelector('#gdsMoreBtn48').onclick=openMore;
 more.querySelector('#gdsMoreClose48').onclick=closeMore;
 more.addEventListener('click',e=>{if(e.target===more)closeMore()});
 more.querySelector('#gdsInstallAdminMobile48').onclick=()=>gdsInstallAdmin();

}
async function ensure(active=''){
 nav(active);const chip=document.getElementById('gdsSec48');
 const {data:{session}}=await sb.auth.getSession();
 if(!session){location.replace(`login-v48.html?v=${V}`);throw new Error('NO_SESSION')}
 const aal=await sb.auth.mfa.getAuthenticatorAssuranceLevel();if(aal.error)throw aal.error;
 if(aal.data?.currentLevel!=='aal2'&&aal.data?.nextLevel==='aal2'){location.replace(`mfa-v48.html?v=${V}`);throw new Error('MFA_REQUIRED')}
 const {data,error}=await sb.from('admin_users').select('user_id').maybeSingle();if(error)throw error;
 if(!data){chip.textContent='⛔ Conta sem permissão administrativa';throw new Error('NOT_ADMIN')}
 chip.textContent='🛡️ MFA confirmado · Supabase conectado';return session;
}
async function logout(){await sb.auth.signOut();location.replace(`login-v48.html?v=${V}`)}
function isEvents(){return location.pathname.endsWith('/events-v57.html')||location.pathname.endsWith('/events-v48.html')}
function loadScript(src,key,async=true){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.async=async;s.setAttribute('data-'+key,'1');document.head.appendChild(s)}
function installEventPdf(){if(isEvents())loadScript(`event-order-pdf-v58.js?v=${V}`,'gds-event-pdf58',false)}
function installEventPicker(){if(isEvents())loadScript(`events-product-picker-v49.js?v=${V}`,'gds-event-picker49')}
function installStoreOps(){loadScript(`admin-store-ops-v50.js?v=${V}`,'gds-store-ops50')}
function installVisitors(){loadScript(`admin-visitors-v52.js?v=${V}`,'gds-visitors52')}
function installReports(){if(location.pathname.endsWith('/reports-v48.html'))loadScript(`reports-fix-v59.js?v=${V}`,'gds-reports59')}
let gdsAdminInstallPrompt=null;
function gdsAdminStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
function gdsInstallButtons(){return [document.getElementById('gdsInstallAdmin48'),document.getElementById('installAdmin')].filter(Boolean)}
function gdsSyncInstallButtons(){gdsInstallButtons().forEach(b=>b.hidden=gdsAdminStandalone())}
async function gdsInstallAdmin(){
 if(gdsAdminStandalone())return alert('O GDS Admin já está instalado neste aparelho.');
 if(gdsAdminInstallPrompt){gdsAdminInstallPrompt.prompt();await gdsAdminInstallPrompt.userChoice;gdsAdminInstallPrompt=null;gdsSyncInstallButtons();return}
 const isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
 if(isiOS)return alert('No iPhone/iPad: abra este painel no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.');
 alert('No computador ou Android: abra o menu do Chrome/Edge e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.');
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();gdsAdminInstallPrompt=e;gdsSyncInstallButtons()});
window.addEventListener('appinstalled',()=>{gdsAdminInstallPrompt=null;gdsSyncInstallButtons()});
document.addEventListener('click',e=>{if(e.target.closest('#gdsInstallAdmin48'))gdsInstallAdmin()});
window.GDS48={sb,money,esc,nav,ensure,logout,version:V,installAdmin:gdsInstallAdmin};
installEventPicker();installStoreOps();installVisitors();installEventPdf();
})();

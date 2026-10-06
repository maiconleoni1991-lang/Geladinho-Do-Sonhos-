(()=>{
if(window.__gdsRuntimeFixV60)return;window.__gdsRuntimeFixV60=true;
const prices={Tradicional:1.5,Cremoso:4,Gourmet:6,Trufado:7.5};
function fix(){
 try{
  if(typeof products!=='undefined'&&Array.isArray(products)){
   let changed=false;
   products.forEach(p=>{const v=prices[p.cat];if(v!=null&&Number(p.price)!==v){p.price=v;changed=true}});
   if(changed&&typeof render==='function')render();
   if(typeof updateTotal==='function')updateTotal();
  }
 }catch(e){console.warn('Ajuste de preços v60',e)}
}
fix();setTimeout(fix,250);setTimeout(fix,900);setTimeout(fix,2200);
})();
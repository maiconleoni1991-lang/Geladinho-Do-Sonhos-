// Geladinho dos Sonhos - receptor preliminar de Webhooks de PRODUCAO.
// ETAPA DE PREPARACAO: NAO CONFIRMA PAGAMENTOS; NAO ALTERA PEDIDOS.
// Nao implantar como receptor definitivo nem cadastrar URL antes da conciliacao.
// Assinatura secreta em Supabase Edge Functions Secrets: MP_WEBHOOK_PROD_SECRET.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
function reply(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {"content-type":"application/json","cache-control":"no-store"}
  });
}
function param(header, name) {
  const item=header.split(",").map(s=>s.trim()).find(s=>s.startsWith(name+"="));
  return item ? item.slice(name.length+1) : "";
}
function hexBytes(s) {
  return Uint8Array.from({length:s.length/2},(_,i)=>parseInt(s.slice(i*2,i*2+2),16));
}
async function verifyWebhook(secret, signature, requestId, resourceId) {
  const ts=param(signature,"ts"),hash=param(signature,"v1");
  if (!/^\d{10,16}$/.test(ts)||!/^[a-f0-9]{64}$/i.test(hash)) return false;
  const epoch=Number(ts)/(ts.length>=13?1000:1);
  if (!Number.isFinite(epoch)||Math.abs(Date.now()/1000-epoch)>300) return false;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),
    {name:"HMAC",hash:"SHA-256"},false,["verify"]);
  const ids=[resourceId.toLowerCase(),resourceId];
  for(const id of new Set(ids)){
    const manifest="id:"+id+";"+(requestId?"request-id:"+requestId+";":"")+"ts:"+ts+";";
    if(await crypto.subtle.verify("HMAC",key,hexBytes(hash),new TextEncoder().encode(manifest)))return true;
  }
  return false;
}
Deno.serve(async(req)=>{
  if(req.method==="GET")return reply(200,{service:"gds-mp-prod",mode:"locked"});
  if(req.method!=="POST")return reply(405,{error:"method_not_allowed"});
  const url=new URL(req.url),id=url.searchParams.get("data.id")||"";
  if(url.searchParams.get("type")!=="order"||!/^ORD[A-Za-z0-9]{15,80}$/.test(id))
    return reply(400,{error:"unsupported_event"});
  const secret=Deno.env.get("MP_WEBHOOK_PROD_SECRET");
  if(!secret)return reply(503,{error:"signature_secret_not_configured"});
  const signature=req.headers.get("x-signature")||"",rid=req.headers.get("x-request-id")||"";
  if(signature.length>512||rid.length>256)return reply(400,{error:"invalid_headers"});
  try{
    if(!await verifyWebhook(secret,signature,rid,id))return reply(401,{error:"invalid_signature"});
    if(Number(req.headers.get("content-length")||0)>65536)return reply(413,{error:"too_large"});
    const text=await req.text();
    if(text.length>65536)return reply(413,{error:"too_large"});
    let event;
    try{event=JSON.parse(text);}catch{return reply(400,{error:"invalid_json"});}
    if(event?.type!=="order"||event?.live_mode!==true||String(event?.data?.id||"")!==id)
      return reply(400,{error:"notification_mismatch"});
    // Retorna 503 de proposito: sem vinculo local e consulta independente da order.
    // NUNCA responder 200 a um evento real antes de tratar e persistir de forma idempotente.
    console.info("gds_webhook_signature_valid_setup_locked");
    return reply(503,{error:"reconciliation_not_ready"});
  }catch{return reply(503,{error:"verification_unavailable"});}
});

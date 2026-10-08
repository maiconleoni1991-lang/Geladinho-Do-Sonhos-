(()=>{
if(window.__gdsReportsDateV99)return;window.__gdsReportsDateV99=true;
const money=v=>GDS48.money(v);
const soldStatuses=['Aceito','Em preparação','Saiu para entrega','Entregue','Finalizado'];
const $=id=>document.getElementById(id);

function spDate(d=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
  const o={};parts.forEach(p=>o[p.type]=p.value);
  return o.year+'-'+o.month+'-'+o.day;
}
function fromYmd(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12,0,0)}
function addDays(s,n){const d=fromYmd(s);d.setDate(d.getDate()+n);return spDate(d)}
function fmt(s){const [y,m,d]=s.split('-');return d+'/'+m+'/'+y}
function inRange(day,a,b){return day&&day>=a&&day<=b}
function orderDay(x){return spDate(new Date(x.created_at))}
function eventDay(x){if(x.payment_confirmed_at)return spDate(new Date(x.payment_confirmed_at));if(x.created_at)return spDate(new Date(x.created_at));return x.event_date||''}
function soldOrder(x){return !x.deleted_at&&x.status!=='Cancelado'&&soldStatuses.includes(x.status)}
function inject(){
  if($('gdsDateSales99'))return;
  const style=document.createElement('style');
  style.textContent=`
  .gdsDate99{background:#fff;border:1px solid #efdde4;border-radius:17px;padding:14px;margin:12px 0}
  .gdsDate99 h2{margin:0 0 10px;color:#4a101e;font-size:18px}
  .gdsDateGrid{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end}
  .gdsDateField label{display:block;font-size:11px;font-weight:900;color:#78616a;margin-bottom:5px}
  .gdsDateField input{width:100%;border:1px solid #efdde4;border-radius:11px;padding:11px;background:#fff}
  .gdsDateQuick{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
  .gdsDateBtn{border:1px solid #efdde4;background:#fff;color:#4a101e;border-radius:11px;padding:10px 12px;font-weight:900;cursor:pointer}
  .gdsDateBtn.primary{background:#ff0f68;color:#fff;border-color:#ff0f68}
  .gdsDateTotals{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px}
  .gdsDateStat{border:1px solid #efdde4;border-radius:13px;padding:11px;background:#fffafc}
  .gdsDateStat small{display:block;color:#78616a}.gdsDateStat b{display:block;margin-top:4px;font-size:20px;color:#4a101e}
  .gdsDateStat.main b{color:#ff0f68}
  .gdsDateTableWrap{overflow:auto;margin-top:12px}.gdsDateTable{width:100%;border-collapse:collapse;font-size:12px}
  .gdsDateTable th,.gdsDateTable td{padding:9px 8px;border-bottom:1px solid #f4e9ed;text-align:right;white-space:nowrap}
  .gdsDateTable th:first-child,.gdsDateTable td:first-child{text-align:left}.gdsDateTable th{color:#78616a;font-size:11px}
  .gdsDateMsg{margin-top:10px;color:#14753e;font-size:12px;font-weight:800}
  @media(max-width:850px){.gdsDateGrid{grid-template-columns:1fr 1fr}.gdsDateGrid .primary{grid-column:1/-1}.gdsDateTotals{grid-template-columns:1fr 1fr}}
  @media(max-width:500px){.gdsDateGrid,.gdsDateTotals{grid-template-columns:1fr}.gdsDateQuick .gdsDateBtn{flex:1}}
  `;
  document.head.appendChild(style);
  const box=document.createElement('section');box.id='gdsDateSales99';box.className='gdsDate99';
  box.innerHTML=`<h2>📅 Vendas por dia / período</h2>
  <div class="gdsDateGrid">
    <div class="gdsDateField"><label>DATA INICIAL</label><input id="gdsDateFrom99" type="date"></div>
    <div class="gdsDateField"><label>DATA FINAL</label><input id="gdsDateTo99" type="date"></div>
    <button id="gdsDateApply99" class="gdsDateBtn primary">Aplicar filtro</button>
  </div>
  <div class="gdsDateQuick">
    <button class="gdsDateBtn" data-gds-range="today">Hoje</button>
    <button class="gdsDateBtn" data-gds-range="yesterday">Ontem</button>
    <button class="gdsDateBtn" data-gds-range="7">7 dias</button>
    <button class="gdsDateBtn" data-gds-range="30">30 dias</button>
  </div>
  <div class="gdsDateTotals">
    <div class="gdsDateStat main"><small>Total vendido</small><b id="gdsDateTotal99">—</b></div>
    <div class="gdsDateStat"><small>Online</small><b id="gdsDateOnline99">—</b></div>
    <div class="gdsDateStat"><small>Venda local</small><b id="gdsDateLocal99">—</b></div>
    <div class="gdsDateStat"><small>Eventos pagos</small><b id="gdsDateEvents99">—</b></div>
    <div class="gdsDateStat"><small>Nº de vendas</small><b id="gdsDateCount99">—</b></div>
  </div>
  <div class="gdsDateTableWrap"><table class="gdsDateTable"><thead><tr><th>Dia</th><th>Vendas</th><th>Online</th><th>Local</th><th>Eventos</th><th>Total</th></tr></thead><tbody id="gdsDateRows99"></tbody></table></div>
  <div id="gdsDateMsg99" class="gdsDateMsg">Carregando vendas…</div>`;
  const msg=document.getElementById('msg');(msg?.parentNode||document.querySelector('main'))?.insertBefore(box,msg||null);
}
async function run(){
  if(!window.GDS48)return setTimeout(run,120);
  inject();
  const today=spDate();$('gdsDateFrom99').value=today;$('gdsDateTo99').value=today;
  let orders=[],events=[];
  async function load(){
    $('gdsDateMsg99').textContent='Carregando vendas…';
    const [o,e]=await Promise.all([
      GDS48.sb.from('orders').select('status,total,created_at,deleted_at,sales_channel'),
      GDS48.sb.from('events').select('status,subtotal,delivery_fee,payment_status,payment_confirmed_at,created_at,event_date')
    ]);
    if(o.error||e.error){$('gdsDateMsg99').textContent='Erro: '+(o.error||e.error).message;return}
    orders=o.data||[];events=e.data||[];render();
  }
  function render(){
    let a=$('gdsDateFrom99').value||today,b=$('gdsDateTo99').value||a;
    if(a>b){const z=a;a=b;b=z;$('gdsDateFrom99').value=a;$('gdsDateTo99').value=b}
    const sold=orders.filter(x=>soldOrder(x)&&inRange(orderDay(x),a,b));
    const paidEvents=events.filter(x=>x.status!=='Cancelado'&&x.payment_status==='Pago'&&inRange(eventDay(x),a,b));
    const online=sold.filter(x=>(x.sales_channel||'online')!=='local');
    const local=sold.filter(x=>x.sales_channel==='local');
    const onlineValue=online.reduce((n,x)=>n+(Number(x.total)||0),0);
    const localValue=local.reduce((n,x)=>n+(Number(x.total)||0),0);
    const eventValue=paidEvents.reduce((n,x)=>n+(Number(x.subtotal)||0)+(Number(x.delivery_fee)||0),0);
    const grand=onlineValue+localValue+eventValue;
    $('gdsDateTotal99').textContent=money(grand);$('gdsDateOnline99').textContent=money(onlineValue);$('gdsDateLocal99').textContent=money(localValue);$('gdsDateEvents99').textContent=money(eventValue);$('gdsDateCount99').textContent=sold.length+paidEvents.length;
    const map={};
    sold.forEach(x=>{const d=orderDay(x);map[d]??={count:0,online:0,local:0,event:0};map[d].count++;if(x.sales_channel==='local')map[d].local+=Number(x.total)||0;else map[d].online+=Number(x.total)||0});
    paidEvents.forEach(x=>{const d=eventDay(x);map[d]??={count:0,online:0,local:0,event:0};map[d].count++;map[d].event+=(Number(x.subtotal)||0)+(Number(x.delivery_fee)||0)});
    const days=Object.keys(map).sort((x,y)=>y.localeCompare(x));
    $('gdsDateRows99').innerHTML=days.length?days.map(d=>{const v=map[d],t=v.online+v.local+v.event;return '<tr><td>'+fmt(d)+'</td><td>'+v.count+'</td><td>'+money(v.online)+'</td><td>'+money(v.local)+'</td><td>'+money(v.event)+'</td><td><b>'+money(t)+'</b></td></tr>'}).join(''):'<tr><td colspan="6" style="text-align:center;color:#78616a">Nenhuma venda neste período.</td></tr>';
    $('gdsDateMsg99').textContent='Período: '+fmt(a)+' até '+fmt(b)+' · total '+money(grand);
  }
  function range(k){const t=spDate();let a=t,b=t;if(k==='yesterday')a=b=addDays(t,-1);else if(k==='7')a=addDays(t,-6);else if(k==='30')a=addDays(t,-29);$('gdsDateFrom99').value=a;$('gdsDateTo99').value=b;render()}
  $('gdsDateApply99').onclick=render;document.querySelectorAll('[data-gds-range]').forEach(b=>b.onclick=()=>range(b.dataset.gdsRange));
  await load();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
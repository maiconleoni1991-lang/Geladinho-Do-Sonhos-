/* Lembretes administrativos de fiado. Sem envios automáticos ou alterações financeiras. */
(function(){
  'use strict';
  const timezone='America/Sao_Paulo';
  function dayKey(value){
    if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
    const d=value instanceof Date?value:new Date(value);
    if(!Number.isFinite(d.getTime()))return '';
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    const obj={};for(const p of parts)obj[p.type]=p.value;
    return obj.year+'-'+obj.month+'-'+obj.day;
  }
  function localDate(yyyy,month,day){return new Date(Date.UTC(yyyy,month-1,day)).toISOString().slice(0,10)}
  function dateBR(value){return value?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):'—'}
  function balance(order){return Math.max(0,Number(order.total||0)-Number(order.paid_amount||0))}
  function normName(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ')}
  function normPhone(value){let digits=String(value||'').replace(/\D/g,'');if(digits.startsWith('55')&&(digits.length===12||digits.length===13))digits=digits.slice(2);return digits}
  function matches(customer,order){
    if(order.trusted_customer_id)return order.trusted_customer_id===customer.id;
    const phone=normPhone(customer.phone);
    return /^[0-9]{10,11}$/.test(phone)&&phone===normPhone(order.customer_phone)&&normName(customer.name)===normName(order.customer_name);
  }
  function isOpenCredit(order){
    return order&&order.status!=='Cancelado'&&!order.deleted_at&&
      (order.payment_method==='Fiado'||Boolean(order.trusted_customer_id))&&
      balance(order)>0;
  }
  function dueDate(customer,openOrders){
    const exact=String(customer.payment_due_date||'');
    if(/^\d{4}-\d{2}-\d{2}$/.test(exact))return exact;
    const dueDay=Number(customer.payment_due_day);
    if(![5,20].includes(dueDay)||!openOrders.length)return '';
    // O primeiro vencimento mensal ocorre no dia combinado após a compra
    // mais antiga ainda não quitada; atrasos não desaparecem no mês seguinte.
    const oldest=openOrders.map(o=>dayKey(o.created_at)).filter(Boolean).sort()[0];
    if(!oldest)return '';
    const year=Number(oldest.slice(0,4)),month=Number(oldest.slice(5,7)),day=Number(oldest.slice(8,10));
    return day<=dueDay?localDate(year,month,dueDay):localDate(year,month+1,dueDay);
  }
  function daysBetween(first,second){
    return Math.round((Date.parse(second+'T12:00:00Z')-Date.parse(first+'T12:00:00Z'))/86400000);
  }
  function collect(customers,orders,today=dayKey(new Date())){
    const result=[];
    for(const customer of customers||[]){
      if(!customer.active||customer.deleted_at)continue;
      const pending=(orders||[]).filter(o=>isOpenCredit(o)&&matches(customer,o));
      if(!pending.length)continue;
      const date=dueDate(customer,pending);
      if(!date)continue;
      const remaining=pending.reduce((sum,o)=>sum+balance(o),0);
      const days=daysBetween(today,date);
      result.push({
        id:customer.id,name:customer.name||'Cliente',phone:customer.phone||'',
        total:remaining,dueDate:date,daysUntil:days,
        state:days<0?'atrasado':days===0?'hoje':days<=7?'proximo':'futuro',
        recurring:[5,20].includes(Number(customer.payment_due_day))&&!customer.payment_due_date
      });
    }
    return result.sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.name.localeCompare(b.name,'pt-BR'));
  }
  window.GDSCreditReminders=Object.freeze({dayKey,dateBR,balance,dueDate,collect});
})();

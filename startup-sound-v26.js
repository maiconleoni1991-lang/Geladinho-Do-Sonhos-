(()=>{
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return;
  let ctx=null,lastPlay=0;
  function setup(){
    if(ctx)return ctx;
    ctx=new AC();
    return ctx;
  }
  function hornBlast(c,start,duration,f1,f2){
    const master=c.createGain();
    const comp=c.createDynamicsCompressor();
    comp.threshold.value=-18;comp.knee.value=8;comp.ratio.value=8;comp.attack.value=.002;comp.release.value=.10;
    master.gain.setValueAtTime(.0001,start);
    master.gain.exponentialRampToValueAtTime(.92,start+.012);
    master.gain.setValueAtTime(.92,start+Math.max(.02,duration-.065));
    master.gain.exponentialRampToValueAtTime(.0001,start+duration);
    master.connect(comp);comp.connect(c.destination);
    [[f1,.64],[f2,.34],[f1*2.02,.08]].forEach(([freq,vol])=>{
      const o=c.createOscillator(),g=c.createGain();
      o.type='sine';o.frequency.setValueAtTime(freq,start);o.frequency.linearRampToValueAtTime(freq*1.012,start+duration);
      g.gain.value=vol;o.connect(g);g.connect(master);o.start(start);o.stop(start+duration+.02);
    });
  }
  async function playStartupHorn(){
    const now=Date.now();if(now-lastPlay<2500)return true;
    const c=setup();
    try{if(c.state==='suspended')await c.resume()}catch(_){ }
    if(c.state!=='running')return false;
    const t=c.currentTime+.025;
    hornBlast(c,t,.34,1180,1540);
    hornBlast(c,t+.51,.36,1240,1620);
    lastPlay=now;return true;
  }
  async function firstGesture(){
    const ok=await playStartupHorn();
    if(ok){['pointerdown','touchstart','keydown','wheel'].forEach(ev=>window.removeEventListener(ev,firstGesture,true))}
  }
  ['pointerdown','touchstart','keydown','wheel'].forEach(ev=>window.addEventListener(ev,firstGesture,{capture:true,passive:true}));
  setTimeout(()=>playStartupHorn(),120);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(()=>playStartupHorn(),120)});
  window.gdsPlayStartupHorn=playStartupHorn;
})();
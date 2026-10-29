(() => {
 const hero=document.querySelector('#demo');
 if(!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const control=hero.querySelector('.hero-motion-control');
 let paused=false, onscreen=true;
 const sync=()=>hero.classList.toggle('hero-paused',paused||document.hidden||!onscreen||reduced.matches);
 control.addEventListener('click',()=>{paused=!paused;control.textContent=paused?'Play motion':'Pause motion';control.setAttribute('aria-pressed',String(paused));sync();});
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',sync);
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{onscreen=entry.isIntersecting;sync();}).observe(hero);
 hero.addEventListener('pointermove',e=>{
  if(paused||reduced.matches||e.pointerType!=='mouse'||innerWidth<768)return;
  const r=hero.getBoundingClientRect();
  hero.style.setProperty('--pointer-x',`${((e.clientX-r.left)/r.width-.5)*18}px`);
  hero.style.setProperty('--pointer-y',`${((e.clientY-r.top)/r.height-.5)*14}px`);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--pointer-x','0px');hero.style.setProperty('--pointer-y','0px');});
 sync();
})();

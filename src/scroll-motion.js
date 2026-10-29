(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.createElement('div');
  progress.className = 'storly-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const hero = document.querySelector('#demo');
  const header = document.querySelector('header');
  let frame = 0;
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, y / total) : 0})`;
    header?.classList.toggle('motion-scrolled', y > 20);
    if (hero && !reduced.matches && innerWidth > 767 && y < hero.offsetHeight + innerHeight)
      hero.style.setProperty('--hero-shift', `${Math.min(65, y * .12)}px`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  new ResizeObserver(schedule).observe(document.body);
  update();
  if (!('IntersectionObserver' in window) || reduced.matches) return;
  const animations = new Set();
  const targets = new Map();
  document.querySelectorAll('section:not(#demo) h2, section:not(#demo) h3:not(article h3)').forEach(el => targets.set(el, {delay:0,type:'heading'}));
  document.querySelectorAll('article').forEach((el,i) => targets.set(el,{delay:(i%3)*90,type:'card'}));
  document.querySelectorAll('#features .grid > div').forEach((el,i) => targets.set(el,{delay:(i%4)*65,type:'feature'}));
  document.querySelectorAll('#faq [x-data] > div').forEach((el,i) => targets.set(el,{delay:i*45,type:'faq'}));
  document.querySelectorAll('section:last-of-type .max-w-3xl > *').forEach((el,i) => targets.set(el,{delay:i*65,type:'cta'}));
  const observer = new IntersectionObserver(entries => {
    for (const {target,isIntersecting} of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      const {delay,type} = targets.get(target);
      target.classList.remove('motion-pending');
      if (reduced.matches) continue;
      const distance = innerWidth < 768 ? 24 : type === 'card' ? 64 : 40;
      const animation = target.animate([
        {opacity:0,translate:`0 ${distance}px`,scale:type === 'card' ? '.96':'1'},
        {opacity:1,translate:'0 0',scale:'1'}
      ], {duration:type === 'card' ? 900:750,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
      animations.add(animation);
      animation.finished.then(()=>animations.delete(animation)).catch(()=>{});
    }
  }, {threshold:.06,rootMargin:'0px 0px -30px 0px'});
  targets.forEach((config,el) => {
    // Never hide content above the restored scroll position or initially visible content.
    if (el.getBoundingClientRect().top < innerHeight - 30) return;
    el.classList.add('motion-pending');
    observer.observe(el);
  });
  const revealAll = () => {
    observer.disconnect();
    document.querySelectorAll('.motion-pending').forEach(el=>el.classList.remove('motion-pending'));
    animations.forEach(a=>a.cancel());
    hero?.style.removeProperty('--hero-shift');
  };
  reduced.addEventListener('change',e=>{if(e.matches)revealAll();});
  addEventListener('beforeprint',revealAll);
  document.addEventListener('focusin',e=>{
    const el=e.target.closest('.motion-pending');
    if(el){observer.unobserve(el);el.classList.remove('motion-pending');}
  });
})();

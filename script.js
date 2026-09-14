const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const nav=$('.nav'),menu=$('.menu'),links=$$('.navlinks a'),stage=$('.hero-stage'),glow=$('.cursor-glow'),progress=$('#progressBar'),backTop=$('#backTop'),preloader=$('#preloader');
const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

const particleField=$('#heroParticles');
if(particleField){
  const count=innerWidth<700?18:42;
  for(let i=0;i<count;i++){
    const p=document.createElement('i');p.className='hero-particle';
    p.style.setProperty('--left',`${Math.random()*100}%`);p.style.setProperty('--dur',`${6+Math.random()*10}s`);p.style.setProperty('--delay',`${-Math.random()*12}s`);p.style.setProperty('--drift',`${(Math.random()-.5)*180}px`);p.style.width=p.style.height=`${Math.random()>0.82?3:2}px`;particleField.appendChild(p);
  }
}

addEventListener('load',()=>setTimeout(()=>preloader?.classList.add('done'),650));
menu?.addEventListener('click',()=>$('.navlinks')?.classList.toggle('open'));
links.forEach(a=>a.addEventListener('click',()=>$('.navlinks')?.classList.remove('open')));

addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',scrollY>30);
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
  backTop?.classList.toggle('show',scrollY>700);
  let current='#home';
  [...links].forEach(a=>{const id=a.getAttribute('href');const el=id&&$(id);if(el&&scrollY>=el.offsetTop-190)current=id;});
  links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===current));
},{passive:true});

addEventListener('mousemove',e=>{
  if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}
  if(stage&&innerWidth>900){const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;stage.style.transform=`translateY(-47%) rotateX(${-y*1.3}deg) rotateY(${x*2}deg)`;}
},{passive:true});

const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}}),{threshold:.08});
$$('.reveal').forEach(e=>obs.observe(e));

$$('.team-card').forEach(card=>{
  card.setAttribute('tabindex','0');
  card.addEventListener('mousemove',e=>{if(innerWidth<900)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-8px)`});
  card.addEventListener('mouseleave',()=>card.style.transform='');
});
backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

// Subtle magnetic motion for primary actions
$$('.btn.primary,.nav-cta').forEach(el=>{
  el.addEventListener('mousemove',e=>{if(innerWidth<900)return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.035}px,${(e.clientY-r.top-r.height/2)*.035}px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

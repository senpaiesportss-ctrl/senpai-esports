const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const nav=$('.nav'), menu=$('.menu'), links=$$('.navlinks a'), stage=$('.hero-stage'), glow=$('.cursor-glow');
$('#year').textContent=new Date().getFullYear();

menu?.addEventListener('click',()=>$('.navlinks').classList.toggle('open'));
links.forEach(a=>a.addEventListener('click',()=>$('.navlinks').classList.remove('open')));

addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',scrollY>30);
  const ids=[...links].map(a=>a.getAttribute('href')).filter(Boolean);
  let current='#home';
  ids.forEach(id=>{const el=$(id); if(el && scrollY>=el.offsetTop-180) current=id;});
  links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===current));
},{passive:true});

addEventListener('mousemove',e=>{
  if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}
  if(stage && innerWidth>900){
    const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;
    stage.style.transform=`translateY(-47%) rotateX(${-y*1.3}deg) rotateY(${x*2}deg)`;
  }
},{passive:true});

const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}});
},{threshold:.08});
$$('.reveal').forEach(e=>obs.observe(e));

$$('.team-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    if(innerWidth<900)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

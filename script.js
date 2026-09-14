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

/* ───────── SENPAI LIVE CMS ───────── */
(async function initSenpaiCMS(){
  try{
    if(!window.supabase || !window.SENPAI_SUPABASE_URL || !window.SENPAI_SUPABASE_ANON_KEY) return;
    const db=window.supabase.createClient(window.SENPAI_SUPABASE_URL,window.SENPAI_SUPABASE_ANON_KEY);
    const {data:row,error}=await db.from('site_content').select('data').eq('id',1).maybeSingle();
    if(error || !row?.data) return;
    const d=row.data;

    // Hero
    const heroEy=document.querySelector('.hero-copy .eyebrow');
    const heroTitle=document.querySelector('.hero-copy h1');
    const heroSub=document.querySelector('.hero-copy .hero-sub');
    if(heroEy && d.hero?.eyebrow) heroEy.innerHTML=escapeCMS(d.hero.eyebrow).replaceAll('×','<b>×</b>');
    if(heroTitle && d.hero?.title){
      const parts=String(d.hero.title).trim().split(/\s+/); const last=parts.pop()||'';
      heroTitle.innerHTML=escapeCMS(parts.join(' '))+'<br><em>'+escapeCMS(last)+'</em>';
    }
    if(heroSub && d.hero?.subtitle) heroSub.textContent=d.hero.subtitle;

    // Contact
    const mail=document.querySelector('.contact-mail[href^="mailto:"]');
    const phone=document.querySelector('.contact-mail[href^="tel:"]');
    if(mail && d.contact?.email){mail.href='mailto:'+d.contact.email; mail.firstChild.textContent=d.contact.email+' ';}
    if(phone && d.contact?.phone){const digits=String(d.contact.phone).replace(/\D/g,''); phone.href='tel:+91'+digits.replace(/^91/,''); phone.firstChild.textContent='+91 '+formatPhone(digits)+' ';}
    const note=document.querySelector('.contact-note'); if(note && d.contact?.phone) note.textContent='PHONE / '+d.contact.phone+' · RESPONSE TIME / AS AVAILABLE';
    const form=document.querySelector('.contact-form'); if(form && d.contact?.email) form.action='mailto:'+d.contact.email;
    const joinApply=document.querySelector('.join-actions a[href^="mailto:"]'); if(joinApply && d.contact?.email) joinApply.href='mailto:'+d.contact.email+'?subject=Senpai%20Esports%20Application';

    // Owner
    const ownerImg=document.querySelector('.owner-photo-wrap img');
    const ownerName=document.querySelector('.owner-copy h3');
    const ownerDesc=document.querySelector('.owner-copy > p:not(.eyebrow)');
    const ownerMeta=document.querySelector('.owner-meta');
    const ownerBadge=document.querySelector('.owner-photo-wrap span');
    if(ownerImg && d.owner?.photo) ownerImg.src=d.owner.photo;
    if(ownerImg && d.owner?.name){ownerImg.alt=d.owner.name+' — '+(d.owner.title||'Founder & Owner');}
    if(ownerName && d.owner?.name){const parts=String(d.owner.name).trim().split(/\s+/);const last=parts.pop()||'';ownerName.innerHTML=escapeCMS(parts.join(' '))+'<br><em>'+escapeCMS(last)+'.</em>';}
    if(ownerDesc && d.owner?.description) ownerDesc.textContent=d.owner.description;
    if(ownerMeta && d.owner){ownerMeta.innerHTML='<span><i>ESTABLISHED</i>'+escapeCMS(d.owner.established||'2023')+'</span><span><i>ROLE</i>'+escapeCMS(d.owner.title||'FOUNDER & OWNER')+'</span>';}
    if(ownerBadge && d.owner?.established) ownerBadge.textContent='EST. '+d.owner.established;

    // Social links
    const socials=d.socials||{};
    const socialMap=[['.media-links a:nth-child(1)',socials.youtube],['.media-links a:nth-child(2)',socials.instagram],['.media-links a:nth-child(3)',socials.discord],['.footer .socials a:nth-child(1)',socials.youtube],['.footer .socials a:nth-child(2)',socials.instagram],['.footer .socials a:nth-child(3)',socials.discord],['.footer .socials a:nth-child(4)',socials.x]];
    socialMap.forEach(([sel,url])=>{const a=document.querySelector(sel);if(a && url){a.href=url;a.target='_blank';a.rel='noopener noreferrer';}else if(a && !url){a.style.display='none';}});

    // Teams
    if(Array.isArray(d.teams) && d.teams.length){
      const grid=document.querySelector('.team-grid');
      if(grid){grid.innerHTML=d.teams.map((t,i)=>{
        const cls=gameClass(t.name); const status=(t.status||'COMING SOON').toUpperCase();
        return `<article class="team-card ${cls}" data-game="${escapeAttr(t.name)}" data-status="${escapeAttr(status)}"><span class="team-index">${String(i+1).padStart(2,'0')}</span><span class="game">${escapeCMS(t.type||'GAME / DIVISION')}</span><div class="team-symbol">${escapeCMS(t.code||String(t.name||'SE').slice(0,2).toUpperCase())}</div><h3>${escapeCMS(t.name||'TEAM')}</h3><p>${escapeCMS(t.description||status)}</p><span class="card-arrow">↗</span><div class="team-status"><i></i> ${escapeCMS(status)}</div></article>`;
      }).join('');
      wireTeamCards();
    }

    // Roster
    const rosterSection=document.querySelector('#roster');
    if(rosterSection && Array.isArray(d.roster) && d.roster.length){
      const wrap=rosterSection.querySelector('.coming-soon');
      if(wrap){wrap.className='roster-live-grid';wrap.innerHTML=d.roster.map((p,i)=>`<article class="roster-live-card"><div class="roster-live-photo"><img src="${escapeAttr(p.photo||'assets/senpai-logo.png')}" alt="${escapeAttr(p.ign||'Senpai Player')}"></div><div class="roster-live-num">${String(i+1).padStart(2,'0')}</div><small>${escapeCMS(p.game||'SENPAI')}</small><h3>${escapeCMS(p.ign||'PLAYER')}</h3><p>${escapeCMS(p.role||'PLAYER')}</p><div class="roster-live-links">${p.youtube?`<a href="${escapeAttr(p.youtube)}" target="_blank" rel="noopener noreferrer">YT ↗</a>`:''}${p.instagram?`<a href="${escapeAttr(p.instagram)}" target="_blank" rel="noopener noreferrer">IG ↗</a>`:''}</div></article>`).join('');
      }
      const note=rosterSection.querySelector('.roster-note'); if(note) note.textContent='OFFICIAL ROSTER / LIVE';
    }

    // Tournaments
    const eventHub=document.querySelector('.event-hub');
    if(eventHub && Array.isArray(d.tournaments) && d.tournaments.length){
      const t=d.tournaments[0];
      const copy=eventHub.querySelector('.event-feature-copy');
      if(copy){copy.querySelector('h3').innerHTML=escapeCMS(t.name||'SENPAI NEXT CUP').replace(/\s+(\S+)$/,'<br><em>$1.</em>');copy.querySelector('p').textContent=t.description||'Official tournament details will appear here.';}
      const meta=eventHub.querySelectorAll('.event-meta span'); if(meta.length>=3){meta[0].innerHTML='<i>DATE</i>'+escapeCMS(t.date||'TBA');meta[1].innerHTML='<i>FORMAT</i>'+escapeCMS(t.format||'TBA');meta[2].innerHTML='<i>STATUS</i>'+escapeCMS(t.status||'COMING SOON');}
      const timeline=eventHub.querySelector('.event-timeline');
      if(timeline) timeline.innerHTML=d.tournaments.map((x,i)=>`<article class="event ${i===0?'event-live':''}"><div class="event-num">${String(i+1).padStart(2,'0')}</div><div><small>${escapeCMS((x.status||'TBA').toUpperCase())}</small><h4>${escapeCMS(x.name||'TOURNAMENT')}</h4><p>${escapeCMS(x.description||'Official tournament details will appear here.')}</p></div><span class="event-dot"></span></article>`).join('');
    }

    // News
    const newsSide=document.querySelector('.news-side');
    if(newsSide && Array.isArray(d.news) && d.news.filter(n=>n.published!==false).length){
      const published=d.news.filter(n=>n.published!==false);
      newsSide.innerHTML=published.slice(0,3).map((n,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><h3>${escapeCMS(n.title||'SENPAI NEWS')}</h3><p>${escapeCMS(n.excerpt||'Official Senpai update.')}</p></article>`).join('');
      const main=document.querySelector('.news-main'); if(main && published[0]){main.querySelector('small').textContent='NEWS / '+String(1).padStart(3,'0');main.querySelector('h2').innerHTML=escapeCMS(published[0].title||'THE NEXT ERA').replace(/\s+(\S+)$/,'<br><em>$1.</em>');main.querySelector('p').textContent=published[0].excerpt||'Official Senpai update.';}
    }

  }catch(e){console.warn('Senpai CMS unavailable:',e)}

  function escapeCMS(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function escapeAttr(v){return escapeCMS(v).replace(/`/g,'&#96;');}
  function formatPhone(v){v=String(v).replace(/\D/g,'').replace(/^91/,'');return v.length===10?v.slice(0,5)+' '+v.slice(5):v;}
  function gameClass(name){const n=String(name||'').toLowerCase();if(n.includes('valorant'))return 'valorant';if(n.includes('free fire'))return 'freefire';if(n.includes('creator'))return 'creators';return 'bgmi';}
  function wireTeamCards(){
    document.querySelectorAll('.team-card').forEach(card=>{
      card.setAttribute('tabindex','0');
      card.addEventListener('mousemove',e=>{if(innerWidth<900)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-8px)`});
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }
})();

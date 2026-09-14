const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
const hasConfig=()=>window.SENPAI_SUPABASE_URL&&window.SENPAI_SUPABASE_ANON_KEY&&!window.SENPAI_SUPABASE_URL.includes('YOUR-PROJECT');
const client=hasConfig()?supabase.createClient(window.SENPAI_SUPABASE_URL,window.SENPAI_SUPABASE_ANON_KEY):null;
let data=null,dirty=false;
const toast=(m)=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function markDirty(){dirty=true;$('#saveStatus').textContent='UNSAVED';$('#saveStatus').classList.remove('online')}
async function load(){
 let {data:row,error}=await client.from('site_content').select('data').eq('id',1).maybeSingle();
 if(error){toast(error.message);return}
 if(!row){const res=await fetch('default-content.json');data=await res.json();await client.from('site_content').upsert({id:1,data});}
 else data=row.data;
 renderAll();
}
function renderAll(){
 $('#statRoster').textContent=data.roster?.length||0;$('#statTeams').textContent=data.teams?.length||0;
 renderRoster();renderTeams();renderTournaments();renderNews();
 $('#ownerName').value=data.owner?.name||'';$('#ownerTitle').value=data.owner?.title||'';$('#ownerEstablished').value=data.owner?.established||'';$('#ownerPhoto').value=data.owner?.photo||'';$('#ownerPreview').src=data.owner?.photo||'assets/owner-aditya-sinha.jpg';
 $('#contactEmail').value=data.contact?.email||'';$('#contactPhone').value=data.contact?.phone||'';
 $('#socialYoutube').value=data.socials?.youtube||'';$('#socialInstagram').value=data.socials?.instagram||'';$('#socialDiscord').value=data.socials?.discord||'';$('#socialX').value=data.socials?.x||'';
 $('#heroEyebrow').value=data.hero?.eyebrow||'';$('#heroTitle').value=data.hero?.title||'';$('#heroSubtitle').value=data.hero?.subtitle||'';
 dirty=false;$('#saveStatus').textContent='SAVED';$('#saveStatus').classList.add('online');
}
function renderRoster(){const el=$('#rosterList');if(!data.roster?.length){el.innerHTML='<div class="empty">No players yet. Public roster remains Coming Soon.</div>';return}el.innerHTML=data.roster.map((p,i)=>`<div class="item"><div><strong>${esc(p.ign||'Unnamed Player')}</strong><small>${esc(p.role||'Role TBA')} · ${esc(p.game||'Game TBA')}</small></div><div class="actions"><button class="btn" onclick="editRoster(${i})">EDIT</button><button class="btn danger" onclick="removeItem('roster',${i})">DELETE</button></div></div>`).join('')}
function renderTeams(){const el=$('#teamsList');el.innerHTML=(data.teams||[]).map((p,i)=>`<div class="item"><div><strong>${esc(p.name)}</strong><small>${esc(p.type)} · ${esc(p.status)}</small></div><div class="actions"><button class="btn" onclick="editTeam(${i})">EDIT</button><button class="btn danger" onclick="removeItem('teams',${i})">DELETE</button></div></div>`).join('')||'<div class="empty">No teams.</div>'}
function renderTournaments(){const el=$('#tournamentsList');el.innerHTML=(data.tournaments||[]).map((p,i)=>`<div class="item"><div><strong>${esc(p.name)}</strong><small>${esc(p.date||'TBA')} · ${esc(p.status||'TBA')}</small></div><div class="actions"><button class="btn" onclick="editTournament(${i})">EDIT</button><button class="btn danger" onclick="removeItem('tournaments',${i})">DELETE</button></div></div>`).join('')||'<div class="empty">No tournaments.</div>'}
function renderNews(){const el=$('#newsList');el.innerHTML=(data.news||[]).map((p,i)=>`<div class="item"><div><strong>${esc(p.title)}</strong><small>${esc(p.date||'')} · ${p.published?'Published':'Draft'}</small></div><div class="actions"><button class="btn" onclick="editNews(${i})">EDIT</button><button class="btn danger" onclick="removeItem('news',${i})">DELETE</button></div></div>`).join('')||'<div class="empty">No news posts.</div>'}
function formDialog(title,fields,existing,cb){const wrap=document.createElement('div');wrap.style.cssText='position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:20px;z-index:20';const box=document.createElement('div');box.className='login-box';box.style.maxHeight='90vh';box.style.overflow='auto';box.innerHTML=`<h2>${title}</h2>`+fields.map(f=>`<div class="field"><label>${f.label}</label>${f.type==='textarea'?`<textarea id="dlg_${f.key}">${esc(existing?.[f.key]||'')}</textarea>`:`<input id="dlg_${f.key}" type="${f.type||'text'}" value="${esc(existing?.[f.key]||'')}">`}</div>`).join('')+`<div class="actions"><button class="btn" id="dlgCancel">CANCEL</button><button class="btn primary" id="dlgSave">SAVE</button></div>`;wrap.appendChild(box);document.body.appendChild(wrap);$('#dlgCancel').onclick=()=>wrap.remove();$('#dlgSave').onclick=()=>{const o={...(existing||{})};fields.forEach(f=>o[f.key]=$('#dlg_'+f.key).value);cb(o);wrap.remove();markDirty();};}
window.editRoster=i=>formDialog('Edit Player',[{key:'ign',label:'IGN'},{key:'name',label:'Real Name'},{key:'role',label:'Role'},{key:'game',label:'Game'},{key:'photo',label:'Photo URL / path'},{key:'youtube',label:'YouTube'},{key:'instagram',label:'Instagram'}],data.roster[i],o=>{data.roster[i]=o;renderAll();markDirty()});
window.editTeam=i=>formDialog('Edit Team',[{key:'name',label:'Team Name'},{key:'code',label:'Code'},{key:'type',label:'Type'},{key:'status',label:'Status'},{key:'description',label:'Description'}],data.teams[i],o=>{data.teams[i]=o;renderAll();markDirty()});
window.editTournament=i=>formDialog('Edit Tournament',[{key:'name',label:'Name'},{key:'date',label:'Date'},{key:'format',label:'Format'},{key:'status',label:'Status'},{key:'description',label:'Description'}],data.tournaments[i],o=>{data.tournaments[i]=o;renderAll();markDirty()});
window.editNews=i=>formDialog('Edit News',[{key:'title',label:'Title'},{key:'date',label:'Date'},{key:'excerpt',label:'Excerpt'},{key:'image',label:'Image URL / path'},{key:'published',label:'Published? type yes/no'}],data.news[i],o=>{o.published=['yes','true','1'].includes(String(o.published).toLowerCase());data.news[i]=o;renderAll();markDirty()});
window.removeItem=(k,i)=>{if(confirm('Delete this item?')){data[k].splice(i,1);renderAll();markDirty()}};
$('#addRoster').onclick=()=>{data.roster.push({ign:'NEW PLAYER',name:'',role:'ROLE TBA',game:'BGMI',photo:'',youtube:'',instagram:''});renderAll();markDirty();editRoster(data.roster.length-1)};
$('#addTeam').onclick=()=>{data.teams.push({name:'NEW TEAM',code:'NT',type:'GAME / DIVISION',status:'COMING SOON',description:'COMING SOON'});renderAll();markDirty();editTeam(data.teams.length-1)};
$('#addTournament').onclick=()=>{data.tournaments.push({name:'NEW TOURNAMENT',date:'TBA',format:'TBA',status:'COMING SOON',description:''});renderAll();markDirty();editTournament(data.tournaments.length-1)};
$('#addNews').onclick=()=>{data.news.push({title:'NEW NEWS',date:new Date().toISOString().slice(0,10),excerpt:'',image:'',published:false});renderAll();markDirty();editNews(data.news.length-1)};
['ownerName','ownerTitle','ownerEstablished','ownerPhoto','contactEmail','contactPhone','socialYoutube','socialInstagram','socialDiscord','socialX','heroEyebrow','heroTitle','heroSubtitle'].forEach(id=>$('#'+id).addEventListener('input',()=>{markDirty();if(id==='ownerPhoto')$('#ownerPreview').src=$('#ownerPhoto').value||'assets/owner-aditya-sinha.jpg'}));
function syncFields(){data.owner={name:$('#ownerName').value,title:$('#ownerTitle').value,established:$('#ownerEstablished').value,photo:$('#ownerPhoto').value};data.contact={email:$('#contactEmail').value,phone:$('#contactPhone').value};data.socials={youtube:$('#socialYoutube').value,instagram:$('#socialInstagram').value,discord:$('#socialDiscord').value,x:$('#socialX').value};data.hero={eyebrow:$('#heroEyebrow').value,title:$('#heroTitle').value,subtitle:$('#heroSubtitle').value}}
$('#saveBtn').onclick=async()=>{syncFields();const {error}=await client.from('site_content').upsert({id:1,data});if(error){toast(error.message);return}dirty=false;$('#saveStatus').textContent='SAVED';$('#saveStatus').classList.add('online');toast('Changes saved. Live site will use the new data.')};
$$('.nav button').forEach(b=>b.onclick=()=>{$$('.nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.panel').forEach(x=>x.classList.remove('active'));$('#'+b.dataset.tab).classList.add('active');$('#pageTitle').textContent=b.textContent});
$('#logoutBtn').onclick=async()=>{await client.auth.signOut();location.reload()};
$('#loginForm').onsubmit=async e=>{e.preventDefault();if(!client)return toast('Configure Supabase first');const {error}=await client.auth.signInWithPassword({email:$('#loginEmail').value,password:$('#loginPassword').value});if(error)toast(error.message);else showApp()};
async function showApp(){ $('#loginView').classList.add('hidden');$('#app').classList.remove('hidden');await load() }
(async()=>{if(!hasConfig()){$('#setupWarning').classList.remove('hidden');return}const {data:{session}}=await client.auth.getSession();if(session)showApp()})();
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});

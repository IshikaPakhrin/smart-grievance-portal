// ── STATE ──
let role='user', usr={name:'User',email:'',role:'user'};
let selPri='low', chatOpen=false, notifOpen=false;
let uChartsInit=false, aChartsInit=false, rChartsInit=false;

// ── DATA ──
let data=[
  {id:'GRV-001',user:'Rahul Kumar',title:'No Water Supply in Sector 5',cat:'Water Supply Disruption',pri:'High',status:'Resolved',dept:'Water Department',date:'2024-01-15',desc:'No water supply in Sector 5 for 3 consecutive days. Residents facing severe hardship. Multiple complaints raised with no response.'},
  {id:'GRV-002',user:'Priya Sharma',title:'Street Lights Non-Functional on MG Road',cat:'Electrical Infrastructure Failure',pri:'Medium',status:'Accepted',dept:'Electricity Department',date:'2024-01-20',desc:'Multiple street lights on MG Road non-functional for over a week, causing safety concerns at night and near-miss accidents.'},
  {id:'GRV-003',user:'Rahul Kumar',title:'Severe Pothole Near School Zone',cat:'Road & Pavement Deterioration',pri:'High',status:'Pending',dept:'Road Department',date:'2024-01-22',desc:'A dangerous pothole near the school zone is causing accidents. Several two-wheelers damaged. Urgent repair required.'},
];

// ── CURSOR ──
const cur=document.getElementById('cur'), cdot=document.getElementById('cdot');
document.addEventListener('mousemove',e=>{
  cur.style.left=(e.clientX-9)+'px'; cur.style.top=(e.clientY-9)+'px';
  cdot.style.left=e.clientX+'px'; cdot.style.top=e.clientY+'px';
});
document.querySelectorAll('button,a,.btn,.ni,.feat,.sc,.how-card,.stat-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('h'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('h'));
});

// ── PAGE NAVIGATION ──
function gp(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(notifOpen) tn();
  // Add portal-mode to body when inside a portal (activates light theme)
  if(id==='user-portal'||id==='admin-portal'){
    document.body.classList.add('portal-mode');
  } else {
    document.body.classList.remove('portal-mode');
  }
  if(id==='landing'){
    const l=document.getElementById('landing');
    if(l) l.scrollTop=0;
    statsAnimated=false;
    setTimeout(initScrollReveal,100);
  }
}

// ── THEME TOGGLE ──
function initThemeToggle(){
  const saved=localStorage.getItem('portalTheme');
  if(saved==='dark') document.body.classList.add('portal-dark');
  else document.body.classList.remove('portal-dark');
  syncToggleBtns();
}
function syncToggleBtns(){
  const isDark=document.body.classList.contains('portal-dark');
  ['themeToggleU','themeToggleA'].forEach(id=>{
    const btn=document.getElementById(id);
    if(!btn) return;
    btn.querySelector('.theme-lbl').textContent=isDark?'Light':'Dark';
    btn.querySelector('.theme-icon').textContent=isDark?'☀️':'🌙';
  });
}
function doThemeToggle(){
  document.body.classList.toggle('portal-dark');
  const isDark=document.body.classList.contains('portal-dark');
  syncToggleBtns();
  localStorage.setItem('portalTheme', isDark?'dark':'light');
  // Rebuild charts with new theme colours
  uChartsInit=false; aChartsInit=false; rChartsInit=false;
  const activePortal=document.querySelector('#user-portal.active,#admin-portal.active');
  if(activePortal){
    if(activePortal.id==='user-portal') setTimeout(initUCharts,100);
    if(activePortal.id==='admin-portal') setTimeout(initACharts,100);
  }
}

// ── TOAST ──
function toast(msg,type='inf'){
  const tc=document.getElementById('TC');
  const icons={suc:'✅',err:'❌',inf:'ℹ️'};
  const t=document.createElement('div');
  t.className='ts2 '+type;
  t.innerHTML=`${icons[type]||'•'} ${msg}`;
  tc.appendChild(t);
  setTimeout(()=>t.remove(),3200);
}

// ── BADGE HELPERS ──
function bk(s){
  const m={Pending:'bk-p',Accepted:'bk-a',Resolved:'bk-r',Rejected:'bk-x','In Review':'bk-ir'};
  const i={Pending:'⏳',Accepted:'📝',Resolved:'✅',Rejected:'❌','In Review':'🔄'};
  return`<span class="bk ${m[s]||'bk-p'}">${i[s]||''} ${s}</span>`;
}
function pbk(p){return`<span class="bk bk-${(p||'').toLowerCase()}">${p}</span>`}
function getInitials(n){return(n||'').trim().split(/\s+/).filter(Boolean).map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';}

// ── CHATBOT VISIBILITY ──
function showChatbot(show){
  const fab=document.getElementById('chatFab');
  fab.style.display=show?'flex':'none';
  if(!show){chatOpen=false;document.getElementById('CW').classList.remove('open');}
}

// ── AUTH ──
function setRole(r,el){
  role=r;
  document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('on'));
  if(el) el.classList.add('on');
}

// ── VALIDATION HELPERS ──
function validateEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
function validatePassword(password){
  const checks=[/[A-Z]/.test(password),/[a-z]/.test(password),/\d/.test(password),/[!@#$%^&*]/.test(password)];
  return password.length>=8 && checks.filter(Boolean).length>=3;
}
function showError(input,message){
  clearError(input);
  const err=document.createElement('div');
  err.className='error-message';
  err.textContent=message;
  input.parentNode.insertBefore(err,input.nextSibling);
  input.classList.add('input-err');
}
function clearError(input){
  const next=input.nextElementSibling;
  if(next&&next.classList.contains('error-message')) next.remove();
  input.classList.remove('input-err');
}
function clearAllErrors(){
  document.querySelectorAll('.error-message').forEach(e=>e.remove());
  document.querySelectorAll('.input-err').forEach(e=>e.classList.remove('input-err'));
}

// ── LOGIN ──
function doLogin(){
  clearAllErrors();
  const name=document.getElementById('ln').value.trim();
  const email=document.getElementById('le').value.trim();
  const pw=document.getElementById('lp').value;
  let valid=true;
  if(!name){showError(document.getElementById('ln'),'Please enter your full name');valid=false;}
  if(!validateEmail(email)){showError(document.getElementById('le'),'Please enter a valid email address');valid=false;}
  if(!validatePassword(pw)){showError(document.getElementById('lp'),'Password must be 8+ chars with 3 of: uppercase, lowercase, number, special character');valid=false;}
  if(!valid) return;

  usr={name,email,role};
  if(role==='admin'){
    showChatbot(false);
    const el=document.getElementById('adminName');
    if(el) el.textContent=name;
    gp('admin-portal');
    setTimeout(()=>{initACharts();animCounts();},300);
  } else {
    showChatbot(true);
    const initials=getInitials(name);
    document.getElementById('uwn').textContent=name;
    document.getElementById('usn').textContent=name;
    document.getElementById('uav').textContent=initials;
    document.getElementById('pav').textContent=initials;
    document.getElementById('pn').textContent=name;
    document.getElementById('pname').value=name;
    document.getElementById('pemail').value=email;
    gp('user-portal');
    renderUC();
    setTimeout(()=>{initUCharts();animCounts();},300);
  }
  toast(`Welcome, ${name}! 🎉`,'suc');
}

// ── REGISTER ──
function doRegister(){
  const n=document.getElementById('rn').value.trim(),
        e=document.getElementById('re').value.trim(),
        p=document.getElementById('rp').value;
  if(!n||!e||!p){toast('Please fill all fields','err');return;}
  if(p.length<8){toast('Password must be at least 8 characters','err');return;}
  toast('Account created! Please sign in.','suc');
  setTimeout(()=>gp('login-page'),900);
}

// ── LOGOUT ──
function doLogout(){
  uChartsInit=false; aChartsInit=false; rChartsInit=false;
  showChatbot(false);
  ['ln','le','lp'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  gp('landing');
  toast('Logged out','inf');
}

// ── SECTIONS ──
function ss(portal,id,el){
  const pid=portal==='u'?'user-portal':'admin-portal';
  document.querySelectorAll('#'+pid+' .sv').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  document.querySelectorAll('#'+pid+' .ni').forEach(n=>n.classList.remove('on'));
  if(el) el.classList.add('on');
  const T={'u-dash':'Dashboard','u-sub':'Submit Complaint','u-hist':'My Complaints','u-track':'Track Status','u-prof':'My Profile','a-dash':'Admin Dashboard','a-all':'Manage Complaints','a-users':'User Management','a-rep':'Reports & Analytics','a-set':'System Settings'};
  const S={'u-dash':`Welcome back, ${usr.name}! Here's your overview.`,'u-sub':'Fill the form to lodge a new complaint','u-hist':'All your submitted complaints','u-track':'Real-time complaint status tracking','u-prof':'Manage your account','a-dash':'System overview and analytics','a-all':'Review, assign and resolve complaints','a-users':'Manage registered users','a-rep':'Analytics and performance reports','a-set':'Configure system preferences'};
  const tEl=document.getElementById(portal+'st'), sEl=document.getElementById(portal+'ss');
  if(tEl) tEl.textContent=T[id]||id;
  if(sEl) sEl.textContent=S[id]||'';
  if(id==='a-all') renderAA();
  if(id==='a-rep') setTimeout(initRCharts,200);
  if(id==='u-hist') renderUC();
}

// ── ANIMATE STAT COUNTERS ──
function animCounts(){
  // Only animate the currently active portal's stat cards
  const activePortal=document.querySelector('.page.active');
  if(!activePortal) return;
  activePortal.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count);
    if(isNaN(target)) return;
    let c=0;
    const step=Math.max(1,Math.ceil(target/30));
    const iv=setInterval(()=>{
      c=Math.min(c+step,target);
      el.textContent=c;
      if(c>=target) clearInterval(iv);
    },40);
  });
}

// ── CHART THEME COLOURS ──
function getChartTheme(){
  const isLight=document.body.classList.contains('portal-mode')&&!document.body.classList.contains('portal-dark');
  return{
    grid: isLight?'rgba(0,0,0,0.06)':'rgba(255,255,255,.05)',
    tick: isLight?'rgba(17,24,39,.45)':'rgba(241,245,249,.35)',
  };
}
function bOpts(donut){
  const th=getChartTheme();
  const tk={color:th.tick,font:{size:11}};
  return{
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false}},
    scales:donut?undefined:{
      x:{grid:{color:th.grid},ticks:tk},
      y:{grid:{color:th.grid},ticks:{...tk,stepSize:1},beginAtZero:true}
    }
  };
}

// ── CHART COLOURS ──
const C={
  b:'rgba(59,130,246,.65)',bB:'#3B82F6',
  c:'rgba(34,211,238,.65)',cB:'#22D3EE',
  g:'rgba(34,197,94,.65)',gB:'#22C55E',
  a:'rgba(234,179,8,.65)',aB:'#EAB308',
  v:'rgba(167,139,250,.65)',vB:'#A78BFA',
};

function initUCharts(){
  if(uChartsInit) return; uChartsInit=true;
  const existing1=Chart.getChart('tC'), existing2=Chart.getChart('dC');
  if(existing1) existing1.destroy();
  if(existing2) existing2.destroy();
  new Chart(document.getElementById('tC'),{type:'line',data:{
    labels:['Aug','Sep','Oct','Nov','Dec','Jan'],
    datasets:[{data:[0,1,0,1,1,3],borderColor:C.bB,backgroundColor:'rgba(59,130,246,.08)',tension:.4,fill:true,pointRadius:4,borderWidth:2}]
  },options:bOpts(false)});
  new Chart(document.getElementById('dC'),{type:'doughnut',data:{
    labels:['Resolved','Pending','Accepted'],
    datasets:[{data:[1,1,1],backgroundColor:[C.g,C.a,C.b],borderWidth:2,borderColor:[C.gB,C.aB,C.bB]}]
  },options:{...bOpts(true),cutout:'58%'}});
}

function initACharts(){
  if(aChartsInit) return; aChartsInit=true;
  const ex1=Chart.getChart('atC'), ex2=Chart.getChart('catC');
  if(ex1) ex1.destroy(); if(ex2) ex2.destroy();
  new Chart(document.getElementById('atC'),{type:'line',data:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets:[
      {data:[1,0,1,0,1,0,0],borderColor:C.cB,backgroundColor:'rgba(34,211,238,.1)',tension:.4,fill:true,pointRadius:4,borderWidth:2},
      {data:[0,0,0,1,0,0,0],borderColor:C.gB,backgroundColor:'rgba(34,197,94,.06)',tension:.4,fill:true,pointRadius:4,borderWidth:2,borderDash:[5,5]}
    ]
  },options:bOpts(false)});
  new Chart(document.getElementById('catC'),{type:'bar',data:{
    labels:['Water','Electrical','Road','Sanitation'],
    datasets:[{data:[1,1,1,0],backgroundColor:[C.b,C.c,C.g,C.a],borderColor:[C.bB,C.cB,C.gB,C.aB],borderWidth:1,borderRadius:6}]
  },options:bOpts(false)});
  renderAA();
}

function initRCharts(){
  if(rChartsInit) return; rChartsInit=true;
  const ex1=Chart.getChart('mC'), ex2=Chart.getChart('fC2');
  if(ex1) ex1.destroy(); if(ex2) ex2.destroy();
  new Chart(document.getElementById('mC'),{type:'bar',data:{
    labels:['Sep','Oct','Nov','Dec','Jan','Feb'],
    datasets:[
      {data:[0,0,1,1,2,1],backgroundColor:C.b,borderColor:C.bB,borderWidth:1,borderRadius:5},
      {data:[0,0,0,1,1,0],backgroundColor:C.g,borderColor:C.gB,borderWidth:1,borderRadius:5}
    ]
  },options:bOpts(false)});
  new Chart(document.getElementById('fC2'),{type:'doughnut',data:{
    labels:['Resolved','Pending','Accepted'],
    datasets:[{data:[1,1,1],backgroundColor:[C.g,C.a,C.b],borderWidth:2,borderColor:[C.gB,C.aB,C.bB]}]
  },options:{...bOpts(true),cutout:'58%'}});
  const cpf=document.getElementById('cpf');
  if(cpf){
    const pd=[
      {cat:'Water Supply Disruption',t:1,r:1,pct:100},
      {cat:'Electrical Infrastructure Failure',t:1,r:0,pct:0},
      {cat:'Road & Pavement Deterioration',t:1,r:0,pct:0},
      {cat:'Sanitation & Waste Management',t:0,r:0,pct:0}
    ];
    cpf.innerHTML=pd.map(d=>`<div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;color:var(--text)"><span>${d.cat}</span><span style="color:var(--muted)">${d.r}/${d.t} resolved</span></div>
      <div class="pb"><div class="pf" style="width:${d.pct}%;background:${d.pct>=100?'linear-gradient(90deg,#22C55E,#16A34A)':d.pct>50?'linear-gradient(90deg,#EAB308,#D97706)':'linear-gradient(90deg,#EF4444,#B91C1C)'}"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${d.pct}% resolution rate</div>
    </div>`).join('');
  }
}

// ── COMPLAINTS ──
function renderUC(){
  const tb=document.getElementById('UCB'); if(!tb) return;
  tb.innerHTML=data.map(c=>`<tr>
    <td style="font-weight:700;color:#3B82F6">${c.id}</td>
    <td style="color:var(--text)">${c.title.length>32?c.title.slice(0,32)+'…':c.title}</td>
    <td style="font-size:12px;color:var(--text)">${c.cat}</td>
    <td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td style="color:var(--muted)">${c.date}</td>
    <td><button class="ib" onclick="vC('${c.id}')">👁 View</button></td>
  </tr>`).join('');
}

function renderAA(){
  const ab=document.getElementById('AAB'), rb=document.getElementById('ARB');
  const rows=data.map(c=>`<tr>
    <td style="font-weight:700;color:#3B82F6">${c.id}</td>
    <td><div style="display:flex;align-items:center;gap:6px"><div class="av" style="width:24px;height:24px;font-size:10px">${c.user.split(' ').map(w=>w[0]).join('')}</div><span style="color:var(--text)">${c.user.split(' ')[0]}</span></div></td>
    <td style="font-size:12px;color:var(--text)">${c.title.length>24?c.title.slice(0,24)+'…':c.title}</td>
    <td style="font-size:11px;color:var(--text)">${c.cat}</td>
    <td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td style="color:var(--muted);font-size:12px">${c.dept}</td>
    <td><div class="abtn">
      <button class="ib ac" onclick="upS('${c.id}','Accepted')">✓</button>
      <button class="ib rs" onclick="upS('${c.id}','Resolved')">✅</button>
      <button class="ib rj" onclick="upS('${c.id}','Rejected')">✗</button>
      <button class="ib" onclick="vC('${c.id}')">👁</button>
    </div></td></tr>`);
  if(ab) ab.innerHTML=rows.join('');
  if(rb) rb.innerHTML=data.map(c=>`<tr>
    <td style="font-weight:700;color:#3B82F6">${c.id}</td>
    <td style="color:var(--text)">${c.user.split(' ')[0]}</td>
    <td style="font-size:12px;color:var(--text)">${c.title.length>24?c.title.slice(0,24)+'…':c.title}</td>
    <td style="font-size:11px;color:var(--text)">${c.cat}</td>
    <td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td><div class="abtn">
      <button class="ib ac" onclick="upS('${c.id}','Accepted')">✓ Accept</button>
      <button class="ib rs" onclick="upS('${c.id}','Resolved')">✅</button>
      <button class="ib" onclick="vC('${c.id}')">👁</button>
    </div></td></tr>`).join('');
}

function upS(id,s){
  const c=data.find(x=>x.id===id);
  if(c){c.status=s;renderAA();renderUC();}
  toast(`${id} → ${s}`,'suc');
}

function vC(id){
  const c=data.find(x=>x.id===id); if(!c) return;
  document.getElementById('mt').textContent=c.id+' — '+c.title;
  document.getElementById('mb2').innerHTML=`
    <div class="dr"><span class="dl">Category</span><span>${c.cat}</span></div>
    <div class="dr"><span class="dl">Priority</span><span>${pbk(c.pri)}</span></div>
    <div class="dr"><span class="dl">Status</span><span>${bk(c.status)}</span></div>
    <div class="dr"><span class="dl">Department</span><span>${c.dept}</span></div>
    <div class="dr"><span class="dl">User</span><span>${c.user}</span></div>
    <div class="dr"><span class="dl">Date</span><span>${c.date}</span></div>
    ${c.addr?`<div class="dr"><span class="dl">Address</span><span style="font-size:12px">${c.addr}</span></div>`:''}
    <div style="margin-top:1rem;padding:.85rem;background:var(--bg2);border-radius:var(--r);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px">Description</div>
      <p style="font-size:13px;line-height:1.65;color:var(--text)">${c.desc}</p>
    </div>
    ${role==='admin'?'<div class="fg" style="margin-top:1rem"><label>Admin Comment</label><textarea placeholder="Add your comment or feedback…"></textarea></div>':''}`;
  document.getElementById('ma').innerHTML=role==='admin'
    ?`<button class="btn btn-g btn-sm" onclick="upS('${id}','Resolved');cM()">✅ Resolve</button><button class="btn btn-p btn-sm" onclick="upS('${id}','Accepted');cM()">✓ Accept</button><button class="btn btn-r btn-sm" onclick="upS('${id}','Rejected');cM()">✗ Reject</button>`
    :`<button class="btn btn-o btn-sm" onclick="cM()">Close</button>`;
  document.getElementById('MOD').classList.add('show');
}
function cM(){document.getElementById('MOD').classList.remove('show');}
document.getElementById('MOD').addEventListener('click',function(e){if(e.target===this)cM();});

// ── SUBMIT ──
function sp(p,el){selPri=p;document.querySelectorAll('.popt').forEach(o=>o.classList.remove('on'));el.classList.add('on');}
function sf(inp){const fp=document.getElementById('fp');if(inp.files.length)fp.innerHTML='📎 '+Array.from(inp.files).map(f=>f.name).join(', ');}
async function getAI(){
  const h=document.getElementById('ai-h').value; if(!h){toast('Enter a description first','err');return;}
  const r=document.getElementById('ai-r'); r.style.display='block'; r.innerHTML='🧠 Analyzing…';
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:`You are an AI for a civic grievance portal. Analyze this complaint and respond ONLY with valid JSON (no markdown): category (one of: "Water Supply Disruption","Electrical Infrastructure Failure","Road & Pavement Deterioration","Sanitation & Waste Management"), priority (High/Medium/Low), suggested_title (under 10 words), department (one of: "Water Department","Electricity Department","Road Department","Sanitation Department"), ai_note (1 sentence). Description: "${h}"`}]})});
    const d=await res.json();
    const txt=d.content?.map(i=>i.text||'').join('');
    let parsed; try{parsed=JSON.parse(txt.replace(/```json|```/g,'').trim())}catch{parsed=null}
    if(parsed){
      document.getElementById('ct').value=parsed.suggested_title||'';
      document.getElementById('cc').value=parsed.category||'';
      document.getElementById('cdept').value=parsed.department||'';
      r.innerHTML=`<b style="color:#3B82F6">AI Analysis Complete ✨</b><br>📁 ${parsed.category} &nbsp;|&nbsp; 🎯 ${parsed.priority} &nbsp;|&nbsp; 🏢 ${parsed.department}<br><span style="color:var(--muted);font-size:12px;margin-top:4px;display:block">💡 ${parsed.ai_note}</span>`;
      const pEl=document.querySelector('.popt.'+parsed.priority?.toLowerCase()); if(pEl) sp(parsed.priority?.toLowerCase(),pEl);
    } else r.innerHTML='<span style="color:var(--muted)">Fill the form manually.</span>';
  }catch(e){r.innerHTML='<span style="color:var(--muted)">AI temporarily unavailable. Fill the form manually.</span>';}
}
function submitC(){
  const title=document.getElementById('ct').value, cat=document.getElementById('cc').value,
        dept=document.getElementById('cdept').value, addr=document.getElementById('co').value,
        desc=document.getElementById('cd').value;
  if(!title||!cat||!desc){toast('Please fill all required fields','err');return;}
  const nid='GRV-00'+(data.length+1);
  data.unshift({id:nid,user:usr.name,title,cat,pri:selPri.charAt(0).toUpperCase()+selPri.slice(1),status:'Pending',dept:dept||'General',date:new Date().toISOString().split('T')[0],desc,addr});
  ['ct','cc','cdept','co','cd'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('ai-r').style.display='none';
  toast(`Complaint ${nid} submitted! 🎉`,'suc');
  setTimeout(()=>ss('u','u-hist',document.querySelector('#user-portal .ni:nth-child(3)')),1200);
}

// ── TRACK ──
function trackC(){
  const id=document.getElementById('tid').value.toUpperCase().replace(/^GRV(\d)/,'GRV-$1');
  const c=data.find(x=>x.id===id);
  const el=document.getElementById('tr'); el.style.display='block';
  const si={Pending:1,Accepted:2,'In Review':3,Resolved:4,Rejected:1};
  if(c){
    const steps=['Submitted','Accepted','In Review','Resolved'], curr=si[c.status]||1;
    const reached=stage=>si[c.status]>=si[stage];
    const mDate=off=>{const d=new Date(c.date);d.setDate(d.getDate()+off);return d.toISOString().split('T')[0];};
    const stRow=(lbl,stage,off)=>`<div class="dr"><span class="dl">${lbl}</span><span style="display:flex;align-items:center;gap:8px">${reached(stage)?`${bk(stage)}<span style="color:var(--muted);font-size:11px">${mDate(off)}</span>`:`<span style="color:var(--muted);font-size:12px">— Not yet reached</span>`}</span></div>`;
    el.innerHTML=`
      <h4 style="margin-bottom:1.2rem;font-family:var(--font-head);letter-spacing:-.3px;color:var(--text)">${c.id} — ${c.title}</h4>
      <div class="strack">${steps.map((s,i)=>`<div class="sstep"><div class="sd ${i<curr?'done':i===curr?'act':''}">${i<curr?'✓':'○'}</div><div class="sl ${i<curr?'done':i===curr?'act':''}">${s}</div></div>`).join('')}</div>
      <div class="dr"><span class="dl">Current Status</span><span>${bk(c.status)}</span></div>
      ${stRow('Accepted','Accepted',1)}${stRow('In Review','In Review',2)}${stRow('Resolved','Resolved',3)}
      <div class="dr"><span class="dl">Category</span><span>${c.cat}</span></div>
      <div class="dr"><span class="dl">Department</span><span>${c.dept}</span></div>
      <div class="dr"><span class="dl">Priority</span><span>${pbk(c.pri)}</span></div>
      <div class="dr"><span class="dl">Submitted</span><span>${c.date}</span></div>`;
  } else {
    el.innerHTML='<p style="color:var(--danger)">⚠️ Complaint not found. Check the ID and try again.</p>';
  }
}

// ── FILTER ──
function fC(q){document.querySelectorAll('#UCB tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';})}
function fS(s){document.querySelectorAll('#UCB tr').forEach(r=>{r.style.display=!s||r.textContent.includes(s)?'':'none';})}

// ── PROFILE ──
function saveP(){
  const n=document.getElementById('pname').value.trim();
  if(!n){toast('Name cannot be empty','err');return;}
  usr.name=n;
  const initials=getInitials(n);
  document.getElementById('usn').textContent=n;
  document.getElementById('pn').textContent=n;
  document.getElementById('uwn').textContent=n;
  document.getElementById('uav').textContent=initials;
  document.getElementById('pav').textContent=initials;
  toast('Profile updated!','suc');
}

// ── NOTIFICATIONS ──
function tn(){notifOpen=!notifOpen;document.getElementById('NP').classList.toggle('show',notifOpen);}
document.addEventListener('click',e=>{
  if(notifOpen&&!e.target.closest('.nbell')&&!e.target.closest('.np')){
    notifOpen=false;document.getElementById('NP').classList.remove('show');
  }
});

// ── CHATBOT ──
const BOTS={submit:'Go to Submit Complaint in the sidebar. AI can auto-categorize your issue!',status:'Use Track Status and enter your GRV-001 format ID.',hello:'Hello! 👋 How can I assist you today?',hi:'Hi there! 😊 Ask me anything about the portal!',help:'I can help with submitting complaints, tracking status, and account settings.',priority:'High = urgent civic issues (no water/power, dangerous roads). Low = general improvements.',default:'I can help with complaints and portal navigation. Could you rephrase? 🤔'};
function tChat(){chatOpen=!chatOpen;document.getElementById('CW').classList.toggle('open',chatOpen);}
async function sChat(){
  const inp=document.getElementById('CI'), msg=inp.value.trim(); if(!msg) return; inp.value='';
  addMsg(msg,'usr');
  const tp=document.createElement('div'); tp.className='cm bot'; tp.innerHTML='<i style="color:var(--muted)">Typing…</i>';
  document.getElementById('CB').appendChild(tp); scrollCB();
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:`You are GrieveBot, AI assistant for SmartGrieve civic grievance portal. Answer helpfully in 1-2 sentences. User: "${msg}"`}]})});
    const d=await res.json(); tp.remove();
    const txt=d.content?.map(i=>i.text||'').join('')||(BOTS[Object.keys(BOTS).find(k=>k!=='default'&&msg.toLowerCase().includes(k))]||BOTS.default);
    addMsg(txt,'bot');
  }catch(e){tp.remove();addMsg(BOTS[Object.keys(BOTS).find(k=>k!=='default'&&msg.toLowerCase().includes(k))]||BOTS.default,'bot');}
}
function addMsg(txt,type){const el=document.createElement('div');el.className='cm '+type;el.textContent=txt;document.getElementById('CB').appendChild(el);scrollCB();}
function scrollCB(){const b=document.getElementById('CB');b.scrollTop=b.scrollHeight;}

// ── EXPORT ──
function exportR(){
  const rows=['ID,User,Title,Category,Priority,Status,Department,Date'];
  data.forEach(c=>rows.push([c.id,c.user,`"${c.title}"`,`"${c.cat}"`,c.pri,c.status,c.dept,c.date].join(',')));
  const blob=new Blob([rows.join('\n')],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='smartgrieve_report.csv'; a.click();
  toast('Report exported!','suc');
}

// ── LANDING ANIMATIONS ──
let revObs;
function initScrollReveal(){
  if(revObs) revObs.disconnect();
  revObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');revObs.unobserve(e.target);}});
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('#landing .rev').forEach((el,i)=>{
    el.style.transitionDelay=(i*0.1)+'s';
    el.classList.remove('vis');
    revObs.observe(el);
  });
}

let statsAnimated=false;
let statsObs;
function initStatsObserver(){
  if(statsObs) statsObs.disconnect();
  statsObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!statsAnimated){
        statsAnimated=true;
        document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
          const target=parseInt(el.dataset.target), suffix=el.dataset.suffix||'';
          let c=0; const step=Math.max(1,Math.ceil(target/55));
          const iv=setInterval(()=>{c=Math.min(c+step,target);el.textContent=c+suffix;if(c>=target)clearInterval(iv);},24);
        });
      }
    });
  },{threshold:0.4});
  const statsEl=document.getElementById('stats');
  if(statsEl) statsObs.observe(statsEl);
}

// ── INIT ON LOAD ──
window.addEventListener('load',()=>{
  initThemeToggle();
  setTimeout(()=>{
    initScrollReveal();
    initStatsObserver();
  },200);
});


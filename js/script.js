// ── STATE ──
let role='user',usr={name:'User',email:'',role:'user'};
let selPri='low',chatOpen=false,notifOpen=false;
let uChartsInit=false,aChartsInit=false,rChartsInit=false;

// ── DATA ──
let data=[
  {id:'GRV-001',user:'Rahul Kumar',title:'No Water Supply in Sector 5',cat:'Water Supply Disruption',pri:'High',status:'Resolved',dept:'Water Department',date:'2024-01-15',desc:'No water supply in Sector 5 for 3 consecutive days. Residents facing severe hardship. Multiple complaints raised with no response.'},
  {id:'GRV-002',user:'Priya Sharma',title:'Street Lights Non-Functional on MG Road',cat:'Electrical Infrastructure Failure',pri:'Medium',status:'Accepted',dept:'Electricity Department',date:'2024-01-20',desc:'Multiple street lights on MG Road non-functional for over a week, causing safety concerns at night and near-miss accidents.'},
  {id:'GRV-003',user:'Rahul Kumar',title:'Severe Pothole Near School Zone',cat:'Road & Pavement Deterioration',pri:'High',status:'Pending',dept:'Road Department',date:'2024-01-22',desc:'A dangerous pothole near the school zone is causing accidents. Several two-wheelers damaged. Urgent repair required.'},
];

// ── CURSOR ──
const cur=document.getElementById('cur'),cdot=document.getElementById('cdot');
document.addEventListener('mousemove',e=>{
  cur.style.left=(e.clientX-9)+'px';cur.style.top=(e.clientY-9)+'px';
  cdot.style.left=e.clientX+'px';cdot.style.top=e.clientY+'px';
});
document.querySelectorAll('button,a,.btn,.ni,.feat,.sc,.how-card,.stat-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('h'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('h'));
});

// ── PAGE NAVIGATION ──
function gp(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(notifOpen)tn();
  // Reset landing scroll position
  if(id==='landing'){
    const l=document.getElementById('landing');
    if(l)l.scrollTop=0;
    statsAnimated=false;
    setTimeout(initScrollReveal,100);
  }
}

// ── TOAST ──
function toast(msg,type='inf'){
  const tc=document.getElementById('TC'),icons={suc:'✅',err:'❌',inf:'ℹ️'};
  const t=document.createElement('div');t.className='ts2 '+type;t.innerHTML=`${icons[type]||'•'} ${msg}`;
  tc.appendChild(t);setTimeout(()=>t.remove(),3200);
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
  if(el)el.classList.add('on');
}
 
//Login
function doLogin(){
  const name=document.getElementById('ln').value.trim();
  const email=document.getElementById('le').value.trim();
  const pw=document.getElementById('lp').value;
  if(!name){showError(document.getElementById('ln'), 'Please enter your name');return;}
  if(!validateEmail(email)){showError(document.getElementById('le'), 'Please enter a valid email');return;}
  if(!validatePassword(pw)){showError(document.getElementById('lp'), 'Password must be 8+ chars with 3 of: uppercase, lowercase, number, special character');return;}
  usr={name,email,role};
  if(role==='admin'){
    showChatbot(false);
    const el=document.getElementById('adminName');if(el)el.textContent=name;
    gp('admin-portal');
    setTimeout(()=>{initACharts();animCounts();},250);
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
    setTimeout(()=>{initUCharts();animCounts();},250);
  }
  toast(`Welcome, ${name}! 🎉`,'suc');
}

//Register
function doRegister(){
  const n=document.getElementById('rn').value.trim(),
        e=document.getElementById('re').value.trim(),
        p=document.getElementById('rp').value;
  if(!n||!e||!p){toast('Please fill all fields','err');return;}
  if(p.length<8){toast('Password must be at least 8 characters','err');return;}
  toast('Account created! Please sign in.','suc');
  setTimeout(()=>gp('login-page'),900);
}

// Email must contain @ and a valid domain
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password: 8+ chars, 3 of 4 categories
function validatePassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const validCategories = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    return password.length >= 8 && validCategories >= 3;
}

// Display error below the input
function showError(input, message) {
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;
} 

//Logout
function doLogout(){
  uChartsInit=false;aChartsInit=false;rChartsInit=false;
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
  if(el)el.classList.add('on');
  const T={'u-dash':'Dashboard','u-sub':'Submit Complaint','u-hist':'My Complaints','u-track':'Track Status','u-prof':'My Profile','a-dash':'Admin Dashboard','a-all':'Manage Complaints','a-users':'User Management','a-rep':'Reports & Analytics','a-set':'System Settings'};
  const S={'u-dash':`Welcome back, ${usr.name}! Here's your overview.`,'u-sub':'Fill the form to lodge a new complaint','u-hist':'All your submitted complaints','u-track':'Real-time complaint status tracking','u-prof':'Manage your account','a-dash':'System overview and analytics','a-all':'Review, assign and resolve complaints','a-users':'Manage registered users','a-rep':'Analytics and performance reports','a-set':'Configure system preferences'};
  const tEl=document.getElementById(portal+'st'),sEl=document.getElementById(portal+'ss');
  if(tEl)tEl.textContent=T[id]||id;if(sEl)sEl.textContent=S[id]||'';
  if(id==='a-all')renderAA();
  if(id==='a-rep')setTimeout(initRCharts,200);
  if(id==='u-hist')renderUC();
}

// ── CHARTS ──
const C={
  b:'rgba(59,130,246,.65)',bB:'#3B82F6',
  c:'rgba(34,211,238,.65)',cB:'#22D3EE',
  g:'rgba(34,197,94,.65)',gB:'#22C55E',
  a:'rgba(234,179,8,.65)',aB:'#EAB308',
  v:'rgba(167,139,250,.65)',vB:'#A78BFA',
  grid:'rgba(255,255,255,.05)',
  tk:{color:'rgba(241,245,249,.35)',font:{size:11}}
};
function bOpts(d){
  return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
    scales:d?undefined:{x:{grid:{color:C.grid},ticks:C.tk},y:{grid:{color:C.grid},ticks:{...C.tk,stepSize:1},beginAtZero:true}}
  };
}

function initACharts(){
  if(aChartsInit)return;aChartsInit=true;
  new Chart(document.getElementById('atC'),{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[
    {data:[1,0,1,0,1,0,0],borderColor:C.cB,backgroundColor:'rgba(34,211,238,.1)',tension:.4,fill:true,pointRadius:4,borderWidth:2},
    {data:[0,0,0,1,0,0,0],borderColor:C.gB,backgroundColor:'rgba(34,197,94,.06)',tension:.4,fill:true,pointRadius:4,borderWidth:2,borderDash:[5,5]}
  ]},options:bOpts(false)});
  new Chart(document.getElementById('catC'),{type:'bar',data:{
    labels:['Water Supply','Electrical','Road & Pvmt','Sanitation'],
    datasets:[{data:[1,1,1,0],backgroundColor:[C.b,C.c,C.g,C.a],borderColor:[C.bB,C.cB,C.gB,C.aB],borderWidth:1,borderRadius:6}]
  },options:bOpts(false)});
  renderAA();
}
function initRCharts(){
  if(rChartsInit)return;rChartsInit=true;
  new Chart(document.getElementById('mC'),{type:'bar',data:{labels:['Sep','Oct','Nov','Dec','Jan','Feb'],datasets:[
    {data:[0,0,1,1,2,1],backgroundColor:C.b,borderColor:C.bB,borderWidth:1,borderRadius:5},
    {data:[0,0,0,1,1,0],backgroundColor:C.g,borderColor:C.gB,borderWidth:1,borderRadius:5}
  ]},options:bOpts(false)});
  new Chart(document.getElementById('fC2'),{type:'doughnut',data:{labels:['Resolved','Pending','Accepted'],datasets:[{data:[1,1,1],backgroundColor:[C.g,C.a,C.b],borderWidth:2,borderColor:[C.gB,C.aB,C.bB]}]},options:{...bOpts(true),cutout:'58%'}});
  const cpf=document.getElementById('cpf');
  if(cpf){
    const pd=[{cat:'Water Supply Disruption',t:1,r:1,pct:100},{cat:'Electrical Infrastructure Failure',t:1,r:0,pct:0},{cat:'Road & Pavement Deterioration',t:1,r:0,pct:0},{cat:'Sanitation & Waste Management',t:0,r:0,pct:0}];
    cpf.innerHTML=pd.map(d=>`<div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>${d.cat}</span><span style="color:var(--muted)">${d.r}/${d.t} resolved</span></div>
      <div class="pb"><div class="pf" style="width:${d.pct}%;background:${d.pct>=100?'linear-gradient(90deg,#22C55E,#16A34A)':d.pct>50?'linear-gradient(90deg,#EAB308,#D97706)':'linear-gradient(90deg,#EF4444,#B91C1C)'}"></div></div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${d.pct}% resolution rate</div></div>`).join('');
  }
}

// ── COMPLAINTS ──
function renderUC(){
  const tb=document.getElementById('UCB');if(!tb)return;
  tb.innerHTML=data.map(c=>`<tr>
    <td style="font-weight:700;color:#93C5FD">${c.id}</td>
    <td>${c.title.length>32?c.title.slice(0,32)+'…':c.title}</td>
    <td style="font-size:12px">${c.cat}</td>
    <td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td style="color:var(--muted)">${c.date}</td>
  </tr>`).join('');

  // Calculate counts from the data array
  const total = data.length;
  const pending = data.filter(c => c.status === 'Pending').length;
  const resolved = data.filter(c => c.status === 'Resolved').length;
  const accepted = data.filter(c => c.status === 'Accepted').length;

  // Update the data-count attribute for each counter
  document.querySelector('.sc-val[data-count]').setAttribute('data-count', total);
  document.querySelectorAll('.sc-val')[1].setAttribute('data-count', pending);
  document.querySelectorAll('.sc-val')[2].setAttribute('data-count', resolved);
  document.querySelectorAll('.sc-val')[3].setAttribute('data-count', accepted);
}  

function animCounts(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count);let c2=0;const step=Math.max(1,Math.ceil(target/30));
    const iv=setInterval(()=>{c2=Math.min(c2+step,target);el.textContent=c2;if(c2>=target)clearInterval(iv);},40);
  });
}

function renderAA(){
  const ab=document.getElementById('AAB'),rb=document.getElementById('ARB');
  if(ab)ab.innerHTML=data.map(c=>`<tr>
    <td style="font-weight:700;color:#93C5FD">${c.id}</td>
    <td><div style="display:flex;align-items:center;gap:6px"><div class="av" style="width:24px;height:24px;font-size:10px">${c.user.split(' ').map(w=>w[0]).join('')}</div>${c.user.split(' ')[0]}</div></td>
    <td style="font-size:12px">${c.title.length>24?c.title.slice(0,24)+'…':c.title}</td>
    <td style="font-size:11px">${c.cat}</td><td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td style="color:var(--muted);font-size:12px">${c.dept}</td>
    <td><div class="abtn">
      <button class="ib ac" onclick="upS('${c.id}','Accepted')">✓</button>
      <button class="ib rs" onclick="upS('${c.id}','Resolved')">✅</button>
      <button class="ib rj" onclick="upS('${c.id}','Rejected')">✗</button>
      <button class="ib" onclick="vC('${c.id}')">👁</button>
    </div></td></tr>`).join('');
  if(rb)rb.innerHTML=data.map(c=>`<tr>
    <td style="font-weight:700;color:#93C5FD">${c.id}</td>
    <td>${c.user.split(' ')[0]}</td>
    <td style="font-size:12px">${c.title.length>24?c.title.slice(0,24)+'…':c.title}</td>
    <td style="font-size:11px">${c.cat}</td><td>${pbk(c.pri)}</td><td>${bk(c.status)}</td>
    <td><div class="abtn">
      <button class="ib ac" onclick="upS('${c.id}','Accepted')">✓ Accept</button>
      <button class="ib rs" onclick="upS('${c.id}','Resolved')">✅</button>
      <button class="ib" onclick="vC('${c.id}')">👁</button>
    </div></td></tr>`).join('');
}
function upS(id,s){const c=data.find(x=>x.id===id);if(c){c.status=s;renderAA();renderUC();}toast(`${id} → ${s}`,'suc');}
function vC(id){
  const c=data.find(x=>x.id===id);if(!c)return;
  document.getElementById('mt').textContent=c.id+' — '+c.title;
  document.getElementById('mb2').innerHTML=`
    <div class="dr"><span class="dl">Category</span><span style="font-size:12px">${c.cat}</span></div>
    <div class="dr"><span class="dl">Priority</span><span>${pbk(c.pri)}</span></div>
    <div class="dr"><span class="dl">Status</span><span>${bk(c.status)}</span></div>
    <div class="dr"><span class="dl">Department</span><span>${c.dept}</span></div>
    <div class="dr"><span class="dl">User</span><span>${c.user}</span></div>
    <div class="dr"><span class="dl">Date</span><span>${c.date}</span></div>
    ${c.addr?`<div class="dr"><span class="dl">Address</span><span style="font-size:12px">${c.addr}</span></div>`:''}
    <div style="margin-top:1rem;padding:.85rem;background:rgba(255,255,255,.025);border-radius:var(--r);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px">Description</div>
      <p style="font-size:13px;line-height:1.65">${c.desc}</p>
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
  const h=document.getElementById('ai-h').value;if(!h){toast('Enter a description first','err');return;}
  const r=document.getElementById('ai-r');r.style.display='block';r.innerHTML='🧠 Analyzing…';
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:`You are an AI for a civic grievance portal. Analyze this complaint and respond ONLY with valid JSON (no markdown): category (one of: "Water Supply Disruption","Electrical Infrastructure Failure","Road & Pavement Deterioration","Sanitation & Waste Management"), priority (High/Medium/Low), suggested_title (under 10 words), department (one of: "Water Department","Electricity Department","Road Department","Sanitation Department"), ai_note (1 sentence). Description: "${h}"`}]})});
    const d=await res.json();
    const txt=d.content?.map(i=>i.text||'').join('');
    let parsed;try{parsed=JSON.parse(txt.replace(/```json|```/g,'').trim())}catch{parsed=null}
    if(parsed){
      document.getElementById('ct').value=parsed.suggested_title||'';
      document.getElementById('cc').value=parsed.category||'';
      document.getElementById('cdept').value=parsed.department||'';
      r.innerHTML=`<b style="color:#93C5FD">AI Analysis Complete ✨</b><br>📁 ${parsed.category} &nbsp;|&nbsp; 🎯 ${parsed.priority} &nbsp;|&nbsp; 🏢 ${parsed.department}<br><span style="color:var(--muted);font-size:12px;margin-top:4px;display:block">💡 ${parsed.ai_note}</span>`;
      const pEl=document.querySelector('.popt.'+parsed.priority?.toLowerCase());if(pEl)sp(parsed.priority?.toLowerCase(),pEl);
    }else r.innerHTML='<span style="color:var(--muted)">Fill the form manually.</span>';
  }catch(e){r.innerHTML='<span style="color:var(--muted)">AI temporarily unavailable. Fill the form manually.</span>';}
}
function submitC(){
  const title=document.getElementById('ct').value,cat=document.getElementById('cc').value,
        dept=document.getElementById('cdept').value,addr=document.getElementById('co').value,
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
  const el=document.getElementById('tr');el.style.display='block';
  const si={Pending:1,Accepted:2,'In Review':3,Resolved:4,Rejected:1};
  if(c){
    const steps=['Submitted','Accepted','In Review','Resolved'],curr=si[c.status]||1;
    const reached=stage=>si[c.status]>=si[stage];
    const mDate=off=>{const d=new Date(c.date);d.setDate(d.getDate()+off);return d.toISOString().split('T')[0];};
    const stRow=(lbl,stage,off)=>`<div class="dr"><span class="dl">${lbl}</span><span style="display:flex;align-items:center;gap:8px">${reached(stage)?`${bk(stage)}<span style="color:var(--muted);font-size:11px">${mDate(off)}</span>`:`<span style="color:var(--muted);font-size:12px">— Not yet reached</span>`}</span></div>`;
    el.innerHTML=`
      <h4 style="margin-bottom:1.2rem;font-family:var(--font-head);letter-spacing:-.3px">${c.id} — ${c.title}</h4>
      <div class="strack">${steps.map((s,i)=>`<div class="sstep"><div class="sd ${i<curr?'done':i===curr?'act':''}">${i<curr?'✓':'○'}</div><div class="sl ${i<curr?'done':i===curr?'act':''}">${s}</div></div>`).join('')}</div>
      <div class="dr"><span class="dl">Current Status</span><span>${bk(c.status)}</span></div>
      ${stRow('Accepted','Accepted',1)}${stRow('In Review','In Review',2)}${stRow('Resolved','Resolved',3)}
      <div class="dr"><span class="dl">Category</span><span style="font-size:12px">${c.cat}</span></div>
      <div class="dr"><span class="dl">Department</span><span>${c.dept}</span></div>
      <div class="dr"><span class="dl">Priority</span><span>${pbk(c.pri)}</span></div>
      <div class="dr"><span class="dl">Submitted</span><span>${c.date}</span></div>`;
  }else{el.innerHTML='<p style="color:var(--danger)">⚠️ Complaint not found. Check the ID and try again.</p>';}
}

// ── FILTER ──
function fC(q){document.querySelectorAll('#UCB tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';})}
function fS(s){document.querySelectorAll('#UCB tr').forEach(r=>{r.style.display=!s||r.textContent.includes(s)?'':'none';})}

// ── PROFILE — avatar updates with correct initials ──
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
  if(notifOpen&&!e.target.closest('.nbell')&&!e.target.closest('.np')){notifOpen=false;document.getElementById('NP').classList.remove('show');}
});

// ── CHATBOT ──
const BOTS={submit:'Go to Submit Complaint in the sidebar. AI can auto-categorize your issue!',status:'Use Track Status and enter your GRV-001 format ID.',hello:'Hello! 👋 How can I assist you today?',hi:'Hi there! 😊 Ask me anything about the portal!',help:'I can help with submitting complaints, tracking status, and account settings.',priority:'High = urgent civic issues (no water/power, dangerous roads). Low = general improvements.',default:'I can help with complaints and portal navigation. Could you rephrase? 🤔'};
function tChat(){chatOpen=!chatOpen;document.getElementById('CW').classList.toggle('open',chatOpen);}
async function sChat(){
  const inp=document.getElementById('CI'),msg=inp.value.trim();if(!msg)return;inp.value='';
  addMsg(msg,'usr');
  const tp=document.createElement('div');tp.className='cm bot';tp.innerHTML='<i style="color:var(--muted)">Typing…</i>';
  document.getElementById('CB').appendChild(tp);scrollCB();
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:`You are GrieveBot, AI assistant for SmartGrieve civic grievance portal. Answer helpfully in 1-2 sentences. User: "${msg}"`}]})});
    const d=await res.json();tp.remove();
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
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='smartgrieve_report.csv';a.click();
  toast('Report exported!','suc');
}

// ═══════════════════════════════════════
// LANDING PAGE ANIMATIONS
// ═══════════════════════════════════════

// ── Scroll Reveal (Intersection Observer) ──
let revObs;
function initScrollReveal(){
  if(revObs)revObs.disconnect();
  revObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');revObs.unobserve(e.target);}});
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  // Cards in landing
  document.querySelectorAll('#landing .rev').forEach((el,i)=>{
    el.style.transitionDelay=(i*0.1)+'s';
    el.classList.remove('vis');
    revObs.observe(el);
  });
}

// ── Stats Count-up ──
let statsAnimated=false;
let statsObs;
function initStatsObserver(){
  if(statsObs)statsObs.disconnect();
  statsObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!statsAnimated){
        statsAnimated=true;
        document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
          const target=parseInt(el.dataset.target),suffix=el.dataset.suffix||'';
          let cur=0;const step=Math.max(1,Math.ceil(target/55));
          const iv=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur+suffix;if(cur>=target)clearInterval(iv);},24);
        });
      }
    });
  },{threshold:0.4});
  const statsEl=document.getElementById('stats');
  if(statsEl)statsObs.observe(statsEl);
}

// ── How cards also use rev class ──
// rev class is handled by revObs above

// ── Init on load ──
window.addEventListener('load',()=>{
  setTimeout(()=>{
    initScrollReveal();
    initStatsObserver();
  },200);
});

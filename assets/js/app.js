// ====================================================================
// DEMO / FALLBACK DATA
// Used automatically until Supabase is connected (see supabase-client.js).
// Once connected, these are replaced by real database rows.
// ====================================================================
const DISTRICTS = ["Nanded","Latur","Parbhani","Hingoli","Beed"];

const COLLEGE_SEED = [
  {name:"Science College, Nanded", district:"Nanded", students:"2,400+", verified:true},
  {name:"Yeshwant Mahavidyalaya, Nanded", district:"Nanded", students:"1,800+", verified:true},
  {name:"People's College, Nanded", district:"Nanded", students:"1,200+", verified:false},
  {name:"Vasantrao Naik College, Nanded", district:"Nanded", students:"950+", verified:false},
  {name:"Shri Sharda Bhavan College, Nanded", district:"Nanded", students:"1,100+", verified:false},
  {name:"Rajarshi Shahu Mahavidyalaya, Latur", district:"Latur", students:"2,100+", verified:true},
  {name:"Dayanand College, Latur", district:"Latur", students:"2,800+", verified:true},
  {name:"Shivaji Mahavidyalaya, Udgir", district:"Latur", students:"1,400+", verified:false},
  {name:"Jawahar College, Ausa", district:"Latur", students:"900+", verified:false},
  {name:"Vasantrao Kale Mahavidyalaya, Parbhani", district:"Parbhani", students:"1,600+", verified:true},
  {name:"New Arts, Commerce & Science, Parbhani", district:"Parbhani", students:"1,300+", verified:false},
  {name:"Shri Shivaji College, Parbhani", district:"Parbhani", students:"1,050+", verified:false},
  {name:"Indira Gandhi Mahavidyalaya, Hingoli", district:"Hingoli", students:"800+", verified:false},
  {name:"Sant Ramdas College, Hingoli", district:"Hingoli", students:"700+", verified:false},
  {name:"Balbhim College, Beed", district:"Beed", students:"1,900+", verified:true},
  {name:"Vaidyanath College, Parli, Beed", district:"Beed", students:"1,250+", verified:false},
  {name:"Adarsh Mahavidyalaya, Ambajogai", district:"Beed", students:"1,050+", verified:false},
];

const RESOURCES = [
  {tag:"DBMS · Sem 3", title:"Unit 1–4 PYQs (2021–25)", sub:"MySQL, Normalization, ER Models · 12 papers"},
  {tag:"DSA · Sem 3", title:"Java DSA Notes + PYQs", sub:"Arrays to Trees · consolidated notes"},
  {tag:"OOP Java · Sem 2", title:"Full syllabus + solved papers", sub:"9 previous papers with solutions"},
  {tag:"Maths · Sem 2", title:"Logic, Algebra, LPP", sub:"Unit-wise PYQs, 2019–2025"},
  {tag:"Web Tech · Sem 2", title:"HTML/CSS/JS/DOM notes", sub:"Lab record + theory PYQs"},
  {tag:"Constitution · Sem 1", title:"Pointwise answer bank", sub:"Exam-ready short answers"},
];

const ANNOUNCEMENTS = [
  {date:"18 AUG", title:"3rd Sem timetable released", sub:"Check university portal — classes begin next week"},
  {date:"22 AUG", title:"Scholarship form deadline", sub:"State scholarship — submit via college office"},
  {date:"05 SEP", title:"Internal exam dates out", sub:"DBMS & DSA internals scheduled first week"},
];

const MENTORS = [
  {name:"Ubaid R.", role:"Full-Stack Dev · Alumni", initials:"UR"},
  {name:"Mufassil P.", role:"Solution Architect", initials:"MP"},
  {name:"Sana K.", role:"3rd Year, CS · DSA mentor", initials:"SK"},
  {name:"Rohan D.", role:"Placed @ startup · Java", initials:"RD"},
];

let DEMO_NEEDS = [
  {id:1, name:"Priya S.", college:"Yeshwant Mahavidyalaya, Nanded", need:"Laptop", story:"Priya is learning web development on her phone and has completed two certifications, but can't practice real projects without a laptop of her own.", raised:35, supported:false},
  {id:2, name:"Imran S.", college:"Deogiri College, Aurangabad", need:"Course Fee", story:"Imran cleared the entrance for a coding bootcamp but needs help covering the ₹4,000 course fee to actually enroll.", raised:60, supported:false},
];

// ====================================================================
// CURRENT USER (very simple client-side session using localStorage-free
// in-memory state per tab; real persistence happens via Supabase auth
// once connected)
// ====================================================================
let currentUser = null; // { id, name, college }

// ====================================================================
// DATA ACCESS LAYER — every function below tries Supabase first,
// and silently falls back to demo data if DB_CONNECTED is false.
// This means the SAME code works before and after you set up Supabase.
// ====================================================================

async function fetchColleges(){
  if (DB_CONNECTED) {
    const { data, error } = await supabase.from('colleges').select('*').order('name');
    if (!error && data) return data;
  }
  return COLLEGE_SEED.map((c, i) => ({ ...c, id: i }));
}

async function fetchResources(){
  if (DB_CONNECTED) {
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending:false });
    if (!error && data) return data;
  }
  return RESOURCES;
}

async function fetchAnnouncements(){
  if (DB_CONNECTED) {
    const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending:true });
    if (!error && data) return data;
  }
  return ANNOUNCEMENTS;
}

async function fetchNeeds(){
  if (DB_CONNECTED) {
    const { data, error } = await supabase.from('scholarship_requests').select('*').order('created_at', { ascending:false });
    if (!error && data) return data;
  }
  return DEMO_NEEDS;
}

async function insertNeed(need){
  if (DB_CONNECTED) {
    const { data, error } = await supabase.from('scholarship_requests').insert([need]).select();
    if (!error && data) return data[0];
  }
  const newNeed = { ...need, id: Date.now(), raised: 0, supported:false };
  DEMO_NEEDS.unshift(newNeed);
  return newNeed;
}

async function pledgeSupport(requestId, donorName){
  if (DB_CONNECTED) {
    await supabase.from('support_pledges').insert([{ request_id: requestId, donor_name: donorName }]);
    return;
  }
  const n = DEMO_NEEDS.find(x => x.id === requestId);
  if (n) { n.supported = true; n.raised = Math.min(100, n.raised + Math.floor(Math.random()*15)+15); }
}

// ====================================================================
// AI STORY POLISH — template-based for now.
// To use real Gemini API: replace this function body with a fetch()
// call to your backend endpoint that calls the Gemini API (never call
// Gemini directly from frontend JS — your API key would be exposed).
// ====================================================================
function polishStory(raw, need){
  const openers = {
    "Laptop": "is working hard to learn tech skills but is held back by not having access to a laptop.",
    "Course / Exam Fee": "has qualified for an opportunity but needs support to cover the course/exam fee.",
    "Books & Study Material": "needs books and study material to keep up with the semester.",
    "Internet Access": "doesn't have reliable internet access needed to study and attend classes online."
  };
  const base = openers[need] || "needs support to continue their education.";
  return `A student from Marathwada ${base} ${raw ? 'In their own words: "' + raw.trim() + '"' : ''}`.trim();
}

// ====================================================================
// SHARED UI: nav auth slot, auth modal
// ====================================================================
function renderAuthSlot(){
  const slot = document.getElementById('auth-slot');
  if (!slot) return;
  if (currentUser) {
    slot.innerHTML = `
      <span class="mono" style="font-size:12px; color:var(--paper-dim);">${currentUser.name}</span>
      <button class="btn-small" onclick="logout()">Logout</button>
    `;
  } else {
    slot.innerHTML = `<button class="btn-small primary" onclick="openAuthModal()">Sign up / Login</button>`;
  }
}

function openAuthModal(){
  document.getElementById('auth-overlay').classList.add('show');
}
function closeAuthModal(){
  document.getElementById('auth-overlay').classList.remove('show');
}
function switchAuthTab(tab){
  document.getElementById('tab-login').classList.toggle('active', tab==='login');
  document.getElementById('tab-signup').classList.toggle('active', tab==='signup');
  document.getElementById('login-form').style.display = tab==='login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab==='signup' ? 'block' : 'none';
}

async function doSignup(){
  const name = document.getElementById('su-name').value.trim();
  const college = document.getElementById('su-college').value.trim();
  const email = document.getElementById('su-email').value.trim();
  if (!name || !college) { alert('Please fill your name and college'); return; }

  if (DB_CONNECTED) {
    // Real signup would use supabase.auth.signUp({ email, password }) plus
    // an insert into the students table. Wire this up in Phase 3.
  }
  currentUser = { id: Date.now(), name, college, email };
  renderAuthSlot();
  closeAuthModal();
}

async function doLogin(){
  const email = document.getElementById('li-email').value.trim();
  if (!email) { alert('Enter your email'); return; }
  // Demo login: in the real version this calls supabase.auth.signInWithPassword(...)
  currentUser = { id: Date.now(), name: email.split('@')[0], college: 'Your College', email };
  renderAuthSlot();
  closeAuthModal();
}

function logout(){
  currentUser = null;
  renderAuthSlot();
}

function scrollToId(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth'});
}
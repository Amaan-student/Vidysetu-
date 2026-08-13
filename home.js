let ALL_COLLEGES = [];
let joined = new Set();

function initDistrictFilter(){
  const sel = document.getElementById('district-filter');
  DISTRICTS.forEach(d=>{
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    sel.appendChild(opt);
  });
}

function collegeInitials(name){
  return name.split(' ').map(w=>w[0]).slice(0,2).join('');
}

function renderCollegeCards(list){
  const grid = document.getElementById('college-grid');
  grid.innerHTML = '';
  list.forEach((c)=>{
    const key = 'c-'+c.id;
    const isJoined = joined.has(key);
    const div = document.createElement('div');
    div.className = 'card college-card';
    div.innerHTML = `
      <div class="college-top">
        <div class="seal" style="width:30px;height:30px;"><span style="font-size:9px;">${collegeInitials(c.name)}</span></div>
        <div>
          <div class="college-name">${c.name}</div>
          <div class="college-meta">${c.district} district · ${c.students} students</div>
        </div>
      </div>
      <span class="chip ${c.verified?'verified':''}">${c.verified?'✓ Verified community':'Community open'}</span>
      <button class="join-btn ${isJoined?'joined':''}" onclick="joinCollege('${key}', this)">${isJoined?'✓ Joined':'Join community'}</button>
    `;
    grid.appendChild(div);
  });
  document.getElementById('college-count').textContent =
    `Showing ${list.length} of 370 colleges — full list loads from database in production`;
}

function applyCollegeFilters(){
  const q = (document.getElementById('college-search').value || '').toLowerCase();
  const district = document.getElementById('district-filter').value;
  const filtered = ALL_COLLEGES.filter(c=>{
    const matchesQ = !q || c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
    const matchesD = !district || c.district === district;
    return matchesQ && matchesD;
  });
  renderCollegeCards(filtered);
}

function joinCollege(key, btn){
  if (!currentUser) { openAuthModal(); return; }
  joined.add(key);
  btn.textContent = '✓ Joined';
  btn.classList.add('joined');
}

async function renderResources(){
  const items = await fetchResources();
  const grid = document.getElementById('resource-grid');
  grid.innerHTML = '';
  items.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'card res-card';
    div.innerHTML = `
      <div>
        <span class="res-tag">${r.tag}</span>
        <div class="res-title">${r.title}</div>
        <div class="res-sub">${r.sub}</div>
      </div>
      <div class="dl" onclick="alert('Full file upload/download wires in once storage is connected.')">View</div>
    `;
    grid.appendChild(div);
  });
}

async function renderAnnouncements(){
  const items = await fetchAnnouncements();
  const list = document.getElementById('announce-list');
  list.innerHTML = '';
  items.forEach(a=>{
    const div = document.createElement('div');
    div.className = 'announce-item';
    div.innerHTML = `
      <div class="a-date">${a.date}</div>
      <div class="a-body"><b>${a.title}</b><span>${a.sub}</span></div>
    `;
    list.appendChild(div);
  });
}

function renderMentors(){
  const grid = document.getElementById('mentor-grid');
  grid.innerHTML = '';
  MENTORS.forEach(m=>{
    const div = document.createElement('div');
    div.className = 'card mentor-card';
    div.innerHTML = `
      <div style="display:flex; align-items:center; gap:14px; width:100%;">
        <div class="avatar">${m.initials}</div>
        <div>
          <div class="mentor-name">${m.name}</div>
          <div class="mentor-role">${m.role}</div>
        </div>
      </div>
      <span class="wa-btn">💬 Join WhatsApp discussion</span>
    `;
    grid.appendChild(div);
  });
}

async function initHomePage(){
  renderAuthSlot();
  initDistrictFilter();
  ALL_COLLEGES = await fetchColleges();
  renderCollegeCards(ALL_COLLEGES);
  document.getElementById('college-search').addEventListener('input', applyCollegeFilters);
  document.getElementById('district-filter').addEventListener('change', applyCollegeFilters);
  renderResources();
  renderAnnouncements();
  renderMentors();
}

document.addEventListener('DOMContentLoaded', initHomePage);

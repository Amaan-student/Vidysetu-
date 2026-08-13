async function postNeed(){
  if (!currentUser) { openAuthModal(); return; }

  const name = currentUser.name;
  const college = currentUser.college;
  const need = document.getElementById('f-need').value;
  const raw = document.getElementById('f-story').value.trim();
  const msg = document.getElementById('form-msg');

  if (!raw) {
    msg.textContent = 'Please describe your situation.';
    msg.className = 'form-msg show error';
    return;
  }

  const story = polishStory(raw, need);
  await insertNeed({ name, college, need_type: need, need, story, status:'open' });

  msg.textContent = 'Posted! Your request is now live below.';
  msg.className = 'form-msg show success';
  document.getElementById('f-story').value = '';

  await loadAndRenderNeeds();
  document.getElementById('need-list').scrollIntoView({behavior:'smooth', block:'start'});
}

async function loadAndRenderNeeds(){
  const needs = await fetchNeeds();
  const wrap = document.getElementById('need-list');
  wrap.innerHTML = '';

  if (needs.length === 0) {
    wrap.innerHTML = `<div class="empty-state">No requests yet — be the first to post, or check back soon.</div>`;
    return;
  }

  needs.forEach((n)=>{
    const div = document.createElement('div');
    div.className = 'need-card';
    div.innerHTML = `
      <div class="need-top">
        <div>
          <div class="need-name">${n.name} · <span style="color:var(--gold); font-family:'JetBrains Mono',monospace; font-size:11px;">${n.need}</span></div>
          <div class="need-college">${n.college}</div>
        </div>
      </div>
      <div class="need-story">${n.story}</div>
      <div class="need-bottom">
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width:${n.raised}%;"></div></div>
          <div class="progress-label">${n.raised}% funded</div>
        </div>
        <button class="support-btn ${n.supported?'done':''}" onclick="handleSupport(${n.id}, this)">${n.supported?'Supported ✓':'Support'}</button>
      </div>
      <div class="thankyou" id="thanks-${n.id}"></div>
    `;
    wrap.appendChild(div);
  });
}

async function handleSupport(id, btn){
  if (!currentUser) { openAuthModal(); return; }
  await pledgeSupport(id, currentUser.name);
  btn.textContent = 'Supported ✓';
  btn.classList.add('done');
  await loadAndRenderNeeds();
  setTimeout(()=>{
    const t = document.getElementById('thanks-'+id);
    if(t){
      t.textContent = `✦ Thank you — your support was recorded. The student will see your encouragement on their dashboard.`;
      t.classList.add('show');
    }
  }, 150);
}

async function initScholarshipPage(){
  renderAuthSlot();
  await loadAndRenderNeeds();
}

document.addEventListener('DOMContentLoaded', initScholarshipPage);

(() => {
  'use strict';
  const SEED = window.STUDY_DATA;
  const STORAGE_KEY = 'studymate.admission.v1';
  const SEEN_INSTALL_KEY = 'studymate.install-seen.v1';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const svgPaths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h8"/>',
    chart:'<path d="M3 3v18h18"/><path d="m8 14 4-4 3 3 5-7"/><path d="M16 6h4v4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2L5.9 12l1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 1.9Z"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    alert:'<path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    layers:'<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    'chevron-left':'<path d="m15 18-6-6 6-6"/>',
    'chevron-right':'<path d="m9 18 6-6-6-6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'calendar-clock':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><circle cx="16" cy="15" r="3"/><path d="M16 13v2l1.5 1"/>',
    database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    smartphone:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/>',
    rotate:'<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  };
  const iconSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${svgPaths[name] || svgPaths.check}</svg>`;
  function hydrateIcons(root=document) { $$('[data-icon]', root).forEach(el => { const name=el.dataset.icon; if(name) el.innerHTML=iconSvg(name); }); }
  function localISO(date=new Date()) { const shifted=new Date(date.getTime()-date.getTimezoneOffset()*60000); return shifted.toISOString().slice(0,10); }
  function isoAdd(iso, days) { const [y,m,d]=iso.split('-').map(Number); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+days); return localISO(dt); }
  function isoWeekday(iso) { const [y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d).getDay(); }
  function displayDate(iso, options={weekday:'short',day:'numeric',month:'short'}) { if(!iso) return 'তারিখ নেই'; const [y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('bn-BD',options); }
  function displayLong(iso) { return displayDate(iso,{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }
  function upperDate(iso) { const [y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(); }
  function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  let state, routineMigrated=false;
  try {
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(stored && Array.isArray(stored.tasks)) {
      const storedById=new Map(stored.tasks.map(t=>[t.id,t]));
      const tasks=SEED.tasks.map(seed=>({...seed,...(storedById.get(seed.id)||{})}));
      // Preserve any user-created/imported tasks whose IDs are not in the original source.
      stored.tasks.filter(t=>!SEED.tasks.some(s=>s.id===t.id)).forEach(t=>tasks.push(t));
      state={tasks,chapterStages:stored.chapterStages||{},lastBackup:stored.lastBackup||null,routineVersion:stored.routineVersion||1};
    } else state={tasks:clone(SEED.tasks),chapterStages:{},lastBackup:null,routineVersion:SEED.meta.routineVersion||2};
  } catch { state={tasks:clone(SEED.tasks),chapterStages:{},lastBackup:null,routineVersion:SEED.meta.routineVersion||2}; }

  // Migrate an existing install to the revised routine once. Preserve completion states and user-rescheduled dates.
  if((state.routineVersion||1)<(SEED.meta.routineVersion||2)) {
    const seeds=new Map(SEED.tasks.map(t=>[t.id,t]));
    state.tasks=state.tasks.map(t=>{
      const seed=seeds.get(t.id);
      if(!seed)return t;
      const next={...t};
      if(t.track==='Public'&&!t.rescheduled) {
        next.date=seed.date;
        next.originalDate=seed.originalDate||seed.date;
      }
      if(t.track==='Private'&&next.examDone) {
        next.studied=!!(next.studied||next.examDone);
        next.examDone=false;
      }
      return next;
    });
    state.routineVersion=SEED.meta.routineVersion||2;
    routineMigrated=true;
  } else {
    state.tasks=state.tasks.map(t=>{
      if(t.track==='Private'&&t.examDone) return {...t,studied:!!(t.studied||t.examDone),examDone:false};
      return t;
    });
  }
  let selectedDate=localISO();
  let currentPage='dashboard';
  let todayTrack='All';
  let upcomingOffset=0;
  let activeRescheduleId=null;
  let deferredInstallPrompt=null;
  let installedMode=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
  let mobileOverlay=null;

  function saveState() { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch(e) { showToast('ডেটা সেভ হয়নি—স্টোরেজ খালি করো বা ব্যাকআপ নাও।',true); } }
  function currentTaskDate(t) { return t.date || t.originalDate || selectedDate; }
  function isComplete(t) { return t.track==='Private' ? !!t.studied : !!(t.studied || t.examDone); }
  function statusText(t) { if(t.track!=='Private'&&t.examDone) return 'এক্সাম দিয়েছি'; if(t.studied) return 'পড়েছি'; if(t.rescheduled) return 'রিশিডিউল'; return 'বাকি'; }
  function bufferInfo(iso) { return (SEED.meta.bufferDays||[]).find(item=>item.date===iso)||null; }
  function isBufferDay(iso) { return !!bufferInfo(iso); }
  function completedCount(list) { return list.filter(isComplete).length; }
  function percentage(a,b) { return b ? Math.round(a/b*100) : 0; }
  function getTask(id) { return state.tasks.find(t=>t.id===id); }
  function tasksForDate(iso) { return state.tasks.filter(t=>currentTaskDate(t)===iso).sort((a,b)=>trackSort(a)-trackSort(b)||a.id.localeCompare(b.id)); }
  function trackSort(t) { return t.track==='Private'?0:1; }
  function chapterStageArray(id) { return state.chapterStages[id] || [false,false,false,false,false]; }
  function chapterDoneStages(id) { return chapterStageArray(id).filter(Boolean).length; }
  function chapterReady(id) { return chapterDoneStages(id)===5; }
  function totalStageCount() { return state.chapterStages ? Object.values(state.chapterStages).reduce((sum,arr)=>sum+(arr||[]).filter(Boolean).length,0):0; }
  function allChaptersReady() { return SEED.chapters.filter(c=>chapterReady(c.id)).length; }
  function overdueTasks() { const today=localISO(); return state.tasks.filter(t=>currentTaskDate(t)<today&&!isComplete(t)).sort((a,b)=>currentTaskDate(a).localeCompare(currentTaskDate(b))||trackSort(a)-trackSort(b)); }
  function renderTaskCard(t, compact=false) {
    const complete=isComplete(t), status= t.track!=='Private'&&t.examDone?'exam':t.studied?'studied':t.rescheduled?'rescheduled':'';
    const showExamAction=t.track!=='Private'&&t.kind!=='Catch-up / Buffer'&&t.kind!=='Weekly Buffer';
    const date=currentTaskDate(t);
    const trackClass=t.track==='Private'?'private':'public';
    const dueWasMoved=t.rescheduled&&t.originalDate&&t.originalDate!==date;
    return `<article class="task-card ${t.examDone?'is-exam':t.studied?'is-studied':''}" data-task-id="${escapeHTML(t.id)}">
      <div class="task-card-main"><div class="task-card-top"><span class="task-id">${escapeHTML(t.id)}</span><span class="track-tag ${trackClass}">${t.track==='Private'?'PRIVATE':'PUBLIC'}</span><span class="kind-tag">${escapeHTML(t.kind||'Study Task')}</span><span class="status-pill ${status}">${statusText(t)}</span>${dueWasMoved?'<span class="status-pill rescheduled">তারিখ বদলানো</span>':''}</div>
      <div class="task-title">${escapeHTML(t.title||'Untitled task')}</div><div class="task-meta"><span><span data-icon="calendar"></span>${escapeHTML(displayDate(date,{day:'numeric',month:'short',year:'numeric'}))}</span><span>${escapeHTML(t.subject||t.track)}</span>${t.block?`<span class="gold-text">${escapeHTML(t.block)}</span>`:''}</div>${t.notes?`<div class="task-note">নোট: ${escapeHTML(t.notes)}</div>`:''}${dueWasMoved?`<div class="task-note">আগের তারিখ: ${escapeHTML(displayDate(t.originalDate,{day:'numeric',month:'short',year:'numeric'}))}</div>`:''}</div>
      <div class="task-actions"><button class="action-button ${t.studied?'done':''}" data-action="studied" data-id="${escapeHTML(t.id)}" aria-pressed="${!!t.studied}"><span data-icon="check"></span>${t.studied?'পড়েছি ✓':'পড়েছি'}</button>${showExamAction?`<button class="action-button ${t.examDone?'exam':''}" data-action="exam" data-id="${escapeHTML(t.id)}" aria-pressed="${!!t.examDone}"><span data-icon="target"></span>${t.examDone?'এক্সাম ✓':'এক্সাম দিয়েছি'}</button>`:''}<button class="action-button reschedule" data-action="reschedule" data-id="${escapeHTML(t.id)}"><span data-icon="calendar-clock"></span>রিশিডিউল</button></div>
    </article>`;
  }
  function emptyMarkup(title,desc) { return `<div class="task-empty"><span data-icon="check"></span><strong>${escapeHTML(title)}</strong><p>${escapeHTML(desc)}</p></div>`; }
  function renderDashboard() {
    const today=localISO(), todayTasks=tasksForDate(today), complete=completedCount(todayTasks), privateTasks=state.tasks.filter(t=>t.track==='Private'&&t.kind==='Private Class'), publicTasks=state.tasks.filter(t=>t.track==='Public');
    const pDone=completedCount(privateTasks), uDone=completedCount(publicTasks), allDone=completedCount(state.tasks), over=overdueTasks();
    $('#welcomeDate').textContent=displayLong(today);
    $('#topDate').textContent=displayDate(today,{day:'numeric',month:'short'});
    $('#heroDate').textContent=upperDate(today);
    $('#publicDeadlineLabel').textContent=upperDate(SEED.meta.publicDeadline||'2026-12-25');
    $('#heroDone').innerHTML=`${complete}<span>/${todayTasks.length}</span>`;
    $('#heroBar').style.width=percentage(complete,todayTasks.length)+'%';
    $('#heroRemaining').textContent=todayTasks.length===0?'আজ কোনো টাস্ক নির্ধারিত নেই':(todayTasks.length-complete)+'টি কাজ বাকি';
    $('#chapterReady').textContent=allChaptersReady();
    $('#chapterBar').style.width=percentage(allChaptersReady(),SEED.chapters.length)+'%';
    $('#chapterStageInfo').textContent=`${totalStageCount()} / 255 স্টাডি চেকপয়েন্ট`;
    $('#privateDone').innerHTML=`${pDone} <small>/ ${privateTasks.length}</small>`;
    $('#privateRate').textContent=percentage(pDone,privateTasks.length)+'%'; $('#privateBar').style.width=percentage(pDone,privateTasks.length)+'%';
    $('#publicDone').innerHTML=`${uDone} <small>/ ${publicTasks.length}</small>`;
    $('#publicRate').textContent=percentage(uDone,publicTasks.length)+'%'; $('#publicBar').style.width=percentage(uDone,publicTasks.length)+'%';
    $('#overallRate').textContent=percentage(allDone,state.tasks.length)+'%';$('#overallBar').style.width=percentage(allDone,state.tasks.length)+'%';
    $('#overdueCount').innerHTML=`${over.length} <small>tasks</small>`;$('#overdueNote').textContent=over.length?`${over.length}টি কাজ দেখে নাও`:'কোনো বকেয়া নেই';
    $('#dashboardOverdueCount').textContent=`${over.length}টি`;
    $('#dashboardOverdue').innerHTML=over.length?over.slice(0,5).map(t=>renderTaskCard(t,true)).join('')+(over.length>5?`<button class="outline-button full" data-action="view-overdue">আরও ${over.length-5}টি বকেয়া দেখুন</button>`:''):emptyMarkup('কোনো বকেয়া কাজ নেই','সব কাজ সময়মতো শেষ আছে। ভবিষ্যতে কোনো কাজ মিস হলে এখানে দেখা যাবে।');
    $('#todayCount').textContent=todayTasks.length;
    $('#dashboardToday').innerHTML=todayTasks.length?todayTasks.slice(0,4).map(t=>renderTaskCard(t,true)).join('')+(todayTasks.length>4?`<button class="outline-button full" data-page="today">আরও ${todayTasks.length-4}টি টাস্ক দেখুন</button>`:''):isBufferDay(today)?emptyMarkup('আজ বাফার ডে','বকেয়া কাজ গুছিয়ে নাও, দুর্বল টপিক রিভিশন করো এবং Weekly Exam-এর প্রস্তুতি সম্পন্ন করো।'):emptyMarkup('আজকের তালিকা ফাঁকা','আগামী টাস্কগুলো দেখতে Upcoming Routine খুলে দেখো।');
    renderMiniUpcoming(today); renderWeekBars(today); hydrateIcons($('#page-dashboard'));
  }
  function renderMiniUpcoming(today) {
    let rows=[];
    for(let i=1;i<=7;i++){const date=isoAdd(today,i), tasks=tasksForDate(date); if(tasks.length||isBufferDay(date)) rows.push({date,tasks});}
    $('#dashboardUpcoming').innerHTML=rows.length?rows.slice(0,5).map(({date,tasks})=>`<div class="mini-agenda-row ${isBufferDay(date)?'buffer-row':''}"><div class="mini-date">${escapeHTML(displayDate(date,{day:'numeric',month:'short'}))}</div><div class="mini-agenda-info"><strong>${isBufferDay(date)?'বাফার ডে · রিভিশন':escapeHTML(tasks[0]?.title||'খালি সময়')}</strong><small>${isBufferDay(date)?'বকেয়া কাজ · Weekly প্রস্তুতি':escapeHTML(tasks[0]?.subject||'Study Task')}</small></div><div class="mini-count">${tasks.length}</div></div>`).join(''):'<div class="task-empty">আগামী ৭ দিনে কোনো টাস্ক নেই।</div>';
  }
  function renderWeekBars(today) {
    const weekday=isoWeekday(today), monday=isoAdd(today,weekday===0?-6:1-weekday), days=['সোম','মঙ্গল','বুধ','বৃহঃ','শুক্র','শনি','রবি'];
    $('#weekRange').textContent=displayDate(monday,{day:'numeric',month:'short'})+' – '+displayDate(isoAdd(monday,6),{day:'numeric',month:'short'});
    $('#weekBars').innerHTML=days.map((d,i)=>{const date=isoAdd(monday,i),ts=tasksForDate(date),done=completedCount(ts),pct=percentage(done,ts.length);return `<div class="week-row"><span class="week-day">${d}</span><div class="week-track"><span class="done-segment" style="width:${pct}%"></span></div><span class="week-total">${done}/${ts.length}</span></div>`}).join('');
  }
  function renderToday() {
    $('#selectedDate').value=selectedDate;
    const list=tasksForDate(selectedDate), visible=list.filter(t=>(todayTrack==='All'||t.track===todayTrack)&&`${t.id} ${t.subject} ${t.title} ${t.kind}`.toLowerCase().includes($('#todaySearch').value.trim().toLowerCase()));
    const complete=completedCount(list), studied=list.filter(t=>t.studied).length, exams=list.filter(t=>t.track!=='Private'&&t.examDone).length;
    const examSummary=todayTrack==='Private'?'':`<div class="day-stat"><span>এক্সাম দিয়েছি</span><strong>${exams}</strong></div>`;
    $('#daySummary').innerHTML=`<div class="day-stat"><span>মোট টাস্ক</span><strong>${list.length}</strong></div><div class="day-stat"><span>পড়েছি</span><strong>${studied}</strong></div>${examSummary}<div class="day-stat"><span>বাকি</span><strong>${Math.max(0,list.length-complete)}</strong></div>`;
    $('#todayTasks').innerHTML=visible.length?visible.map(t=>renderTaskCard(t)).join(''):emptyMarkup(list.length?'কোনো মিল পাওয়া যায়নি':isBufferDay(selectedDate)?'বাফার ডে · রিভিশন ও ক্যাচ-আপ':'এই দিনে কোনো টাস্ক নেই',list.length?'ফিল্টার বা সার্চ পরিবর্তন করে দেখো।':isBufferDay(selectedDate)?'এই দিনটি বকেয়া কাজ শেষ করা এবং Weekly Exam-এর প্রস্তুতির জন্য রাখা হয়েছে।':'তারিখ বদলে অন্য দিনের রুটিন দেখো, অথবা Upcoming থেকে কাজ রিশিডিউল করো।');
    $$('#todayTrackFilter button').forEach(b=>b.classList.toggle('selected',b.dataset.filter===todayTrack));
    hydrateIcons($('#page-today'));
  }
  function renderUpcoming() {
    const start=isoAdd(localISO(),upcomingOffset*7), end=isoAdd(start,6);
    $('#upcomingRange').textContent=`${displayDate(start,{day:'numeric',month:'short',year:'numeric'})} — ${displayDate(end,{day:'numeric',month:'short',year:'numeric'})}`;
    const days=[];for(let i=0;i<7;i++){const date=isoAdd(start,i),tasks=tasksForDate(date);days.push({date,tasks});}
    $('#upcomingList').innerHTML=days.map(({date,tasks})=>`<article class="agenda-day ${date===localISO()?'today':''}"><div class="agenda-date"><span class="weekday">${escapeHTML(displayDate(date,{weekday:'long'}))}${date===localISO()?' · আজ':''}</span><strong>${escapeHTML(displayDate(date,{day:'numeric'}))}</strong><small>${escapeHTML(displayDate(date,{month:'long',year:'numeric'}))}</small></div><div class="agenda-day-content"><div class="agenda-day-heading"><strong>${tasks.length?'পরিকল্পিত কাজ':'কোনো নির্ধারিত কাজ নেই'}</strong><span>${tasks.length}টি টাস্ক</span></div><div class="agenda-tasks">${tasks.length?tasks.map(t=>`<div class="agenda-task-row"><i class="agenda-task-marker"></i><div class="agenda-task-copy"><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.subject)} · ${escapeHTML(t.id)}</small></div><span class="agenda-task-status">${escapeHTML(statusText(t))}</span></div>`).join(''):'<div class="task-note">এই দিনটি খালি আছে—বকেয়া কাজ রিশিডিউল করার জন্য ব্যবহার করতে পারো।</div>'}</div></div></article>`).join('');
  }
  function statusForFilter(t) { if(!isComplete(t)&&currentTaskDate(t)<localISO())return 'Overdue'; if(t.track!=='Private'&&t.examDone)return 'Exam'; if(t.studied)return 'Studied'; if(t.rescheduled)return 'Rescheduled'; return 'Pending'; }
  function renderAllTasks() {
    const q=$('#allSearch').value.trim().toLowerCase(), track=$('#allTrack').value, status=$('#allStatus').value;
    let list=state.tasks.filter(t=>(track==='All'||t.track===track)&&(status==='All'||statusForFilter(t)===status)&&`${t.id} ${t.title} ${t.subject} ${t.kind} ${t.block}`.toLowerCase().includes(q));
    list.sort((a,b)=>currentTaskDate(a).localeCompare(currentTaskDate(b))||trackSort(a)-trackSort(b)||a.id.localeCompare(b.id));
    $('#allTaskCount').textContent=`${list.length} / ${state.tasks.length} tasks`;
    $('#allTasksList').innerHTML=list.length?list.map(t=>renderTaskCard(t)).join(''):emptyMarkup('কোনো টাস্ক পাওয়া যায়নি','সার্চ বা ফিল্টার বদলে আবার চেষ্টা করো।');
    hydrateIcons($('#page-tasks'));
  }
  function renderSyllabus() {
    const ready=allChaptersReady(), pct=percentage(totalStageCount(),SEED.chapters.length*5);
    $('#syllabusPercent').textContent=pct+'%';
    $('#syllabusOverview').innerHTML=`<div class="syllabus-stat"><span>মোট অধ্যায়</span><strong>51</strong></div><div class="syllabus-stat"><span>সম্পূর্ণ প্রস্তুত</span><strong>${ready}</strong></div><div class="syllabus-stat"><span>অগ্রগতির ধাপ</span><strong>${totalStageCount()} <small style="font-size:10px;color:#80909a">/ 255</small></strong></div><div class="syllabus-stat"><span>চলমান অধ্যায়</span><strong>${SEED.chapters.filter(c=>chapterDoneStages(c.id)>0&&!chapterReady(c.id)).length}</strong></div>`;
    const q=$('#chapterSearch').value.trim().toLowerCase(), subject=$('#chapterSubject').value, readiness=$('#chapterReadiness').value;
    const list=SEED.chapters.filter(c=>(subject==='All'||c.subjectKey===subject)&&(readiness==='All'||(readiness==='Ready'?chapterReady(c.id):!chapterReady(c.id)))&&`${c.id} ${c.subject} ${c.title}`.toLowerCase().includes(q));
    $('#chaptersList').innerHTML=list.map(c=>{const done=chapterDoneStages(c.id), p=percentage(done,5), stageArr=chapterStageArray(c.id);return `<article class="chapter-card ${chapterReady(c.id)?'ready':''}"><div class="chapter-head"><div class="chapter-number">${c.id}</div><div class="chapter-title-wrap"><div class="chapter-subject">${escapeHTML(c.subject)} · টার্গেট ${escapeHTML(displayDate(c.date,{day:'numeric',month:'short'}))}</div><div class="chapter-title">${escapeHTML(c.title)}</div></div><div class="chapter-pct">${p}%</div></div><div class="chapter-mini-progress"><span style="width:${p}%"></span></div><div class="chapter-stages">${c.stages.map((stage,i)=>`<label class="stage-check"><input type="checkbox" data-chapter="${c.id}" data-stage="${i}" ${stageArr[i]?'checked':''} aria-label="${escapeHTML(c.title)}: ${escapeHTML(stage)}"><span>${escapeHTML(stage)}</span></label>`).join('')}</div></article>`}).join('')||emptyMarkup('কোনো অধ্যায় পাওয়া যায়নি','সার্চ বা ফিল্টার পরিবর্তন করো।');
  }
  function renderProgress() {
    const allDone=completedCount(state.tasks), privateTasks=state.tasks.filter(t=>t.track==='Private'&&t.kind==='Private Class'), publicTasks=state.tasks.filter(t=>t.track==='Public');
    $('#progressSummary').innerHTML=`<div class="progress-big"><span>OVERALL TASK COMPLETION</span><strong>${percentage(allDone,state.tasks.length)}%</strong><div class="thin-progress"><span style="width:${percentage(allDone,state.tasks.length)}%"></span></div></div><div class="progress-small"><span>পড়েছি</span><strong>${state.tasks.filter(t=>t.studied).length}</strong></div><div class="progress-small"><span>এক্সাম দিয়েছি (Public)</span><strong>${state.tasks.filter(t=>t.track==='Public'&&t.examDone).length}</strong></div><div class="progress-small"><span>Chapter ready</span><strong>${allChaptersReady()} / 51</strong></div>`;
    const tracks=[{label:'Private classes',list:privateTasks,done:completedCount(privateTasks)},{label:'Public tasks',list:publicTasks,done:completedCount(publicTasks)},{label:'Private readiness check',list:state.tasks.filter(t=>t.id==='PR-READY'),done:completedCount(state.tasks.filter(t=>t.id==='PR-READY'))}];
    $('#trackProgress').innerHTML=tracks.map(x=>`<div class="track-row"><div class="track-row-top"><span>${x.label}</span><strong>${x.done}/${x.list.length} · ${percentage(x.done,x.list.length)}%</strong></div><div class="track-progress-bar"><span style="width:${percentage(x.done,x.list.length)}%"></span></div></div>`).join('');
    const subs=new Map();state.tasks.forEach(t=>{const key=t.subject||t.track;if(!subs.has(key))subs.set(key,{all:0,done:0});const o=subs.get(key);o.all++;if(isComplete(t))o.done++;});
    const subjRows=[...subs.entries()].sort((a,b)=>a[1].done/a[1].all-b[1].done/b[1].all||b[1].all-a[1].all).slice(0,10);
    $('#subjectProgress').innerHTML=subjRows.map(([name,x])=>`<div class="subject-row"><div class="subject-row-top"><span>${escapeHTML(name)}</span><strong>${x.done}/${x.all} · ${percentage(x.done,x.all)}%</strong></div><div class="subject-progress-bar"><span style="width:${percentage(x.done,x.all)}%"></span></div></div>`).join('');
    const start='2026-10-28';
    const weekCount=Math.ceil((new Date((SEED.meta.rangeEnd||start)+'T00:00:00')-new Date(start+'T00:00:00'))/86400000/7);
    $('#weeklyProgressReport').innerHTML=Array.from({length:weekCount},(_,i)=>{const a=isoAdd(start,i*7), b=isoAdd(a,6),group=state.tasks.filter(t=>currentTaskDate(t)>=a&&currentTaskDate(t)<=b),done=completedCount(group);return `<div class="weekly-block"><span>WEEK ${String(i+1).padStart(2,'0')}</span><strong>${percentage(done,group.length)}%</strong><small>${done}/${group.length} tasks</small><div class="tiny-bar"><i style="width:${percentage(done,group.length)}%"></i></div></div>`}).join('');
  }
  function renderSettings() {
    $('#settingsTaskCount').textContent=state.tasks.length;
    $('#lastBackupLabel').textContent=state.lastBackup?displayDate(state.lastBackup,{day:'numeric',month:'short'}):'এখনও হয়নি';
    $('#installHelp').textContent=installedMode?'StudyMate ইতিমধ্যেই অ্যাপ মোডে চলছে।':'Chrome/Edge-এ সমর্থিত হলে Install prompt খুলবে।';
  }
  const pageNames={dashboard:'ড্যাশবোর্ড',today:'আজকের টাস্ক',upcoming:'আপকামিং রুটিন',tasks:'সব টাস্ক',syllabus:'৫১ অধ্যায়ের সিলেবাস',progress:'প্রগ্রেস রিপোর্ট',settings:'সেটিংস ও ব্যাকআপ'};
  function showPage(page) {
    if(!pageNames[page])page='dashboard';currentPage=page;
    $$('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${page}`));
    $$('.nav-item,.mobile-nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
    $('#crumbTitle').textContent=pageNames[page];
    document.title=`${pageNames[page]} — StudyMate`;
    if(page==='dashboard')renderDashboard();if(page==='today')renderToday();if(page==='upcoming')renderUpcoming();if(page==='tasks')renderAllTasks();if(page==='syllabus')renderSyllabus();if(page==='progress')renderProgress();if(page==='settings')renderSettings();
    closeMobileNav();window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderAll() { renderDashboard(); if(currentPage==='today')renderToday();if(currentPage==='upcoming')renderUpcoming();if(currentPage==='tasks')renderAllTasks();if(currentPage==='syllabus')renderSyllabus();if(currentPage==='progress')renderProgress();if(currentPage==='settings')renderSettings(); }
  function showToast(message,error=false) { const host=$('#toastHost'),el=document.createElement('div');el.className='toast'+(error?' error':'');el.textContent=message;host.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(5px)';setTimeout(()=>el.remove(),220)},2800); }
  function openModal(id) { const el=$('#'+id);el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'; }
  function closeModal(id) { const el=$('#'+id);el.classList.remove('open');el.setAttribute('aria-hidden','true');document.body.style.overflow=''; }
  function openReschedule(id) { const t=getTask(id);if(!t)return;activeRescheduleId=id;$('#rescheduleTaskName').textContent=`${t.id} · ${t.title}`;$('#rescheduleDate').value=currentTaskDate(t);$('#rescheduleNote').value='';openModal('rescheduleModal'); }
  function actOnTask(action,id) {
    const t=getTask(id);if(!t)return;
    if(action==='studied'){t.studied=!t.studied;if(t.studied)showToast('পড়া সম্পন্ন হিসেবে সেভ হয়েছে।');else showToast('পড়েছি স্ট্যাটাস সরানো হয়েছে।');}
    if(action==='exam'){t.examDone=!t.examDone;if(t.examDone){t.studied=true;showToast('এক্সাম দেওয়া হিসেবে সেভ হয়েছে।');}else showToast('এক্সাম স্ট্যাটাস সরানো হয়েছে।');}
    if(action==='reschedule'){openReschedule(id);return;}
    saveState();renderAll();
  }
  function doReschedule(event) {
    event.preventDefault();const t=getTask(activeRescheduleId),newDate=$('#rescheduleDate').value,note=$('#rescheduleNote').value.trim();if(!t||!newDate)return;
    if(newDate===currentTaskDate(t)){closeModal('rescheduleModal');return;}
    if(!t.originalDate)t.originalDate=t.date;
    t.rescheduledFrom=t.date;t.date=newDate;t.rescheduled=true;
    if(note)t.notes=note;
    saveState();closeModal('rescheduleModal');showToast(`টাস্কটি ${displayDate(newDate,{day:'numeric',month:'short'})} তারিখে সরানো হয়েছে।`);renderAll();
  }
  function downloadBackup() {
    const backup={app:'StudyMate',schemaVersion:1,exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`studymate-backup-${localISO()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    state.lastBackup=localISO();saveState();renderSettings();showToast('ব্যাকআপ ফাইল ডাউনলোড শুরু হয়েছে।');
  }
  function importBackup(file) {
    if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result),incoming=parsed.state||parsed;if(!Array.isArray(incoming.tasks)||typeof incoming.chapterStages!=='object')throw new Error('invalid');
      const valid=new Set(SEED.tasks.map(t=>t.id));const incomingTasks=incoming.tasks.filter(t=>t&&t.id&&valid.has(t.id));
      const byId=new Map(incomingTasks.map(t=>[t.id,t]));state.tasks=SEED.tasks.map(t=>({...t,...(byId.get(t.id)||{})}));
      state.chapterStages=incoming.chapterStages||{};state.lastBackup=localISO();saveState();renderAll();showToast('ব্যাকআপ সফলভাবে Import হয়েছে।');
    }catch(e){showToast('এই ফাইলটি StudyMate backup নয় বা নষ্ট হয়েছে।',true);}$('#importBackup').value='';};reader.readAsText(file);
  }
  function resetProgress() {
    const ok=confirm('সব টাস্কের পড়া/এক্সাম স্ট্যাটাস, রিশিডিউল এবং অধ্যায়ের প্রগ্রেস মুছে প্রাথমিক অবস্থায় ফিরিয়ে দেব? আগে ব্যাকআপ নাও।');if(!ok)return;
    state={tasks:clone(SEED.tasks),chapterStages:{},lastBackup:null};saveState();renderAll();showToast('প্রগ্রেস প্রাথমিক অবস্থায় ফিরেছে।');
  }
  async function requestInstall() {
    if(installedMode){showToast('StudyMate ইতিমধ্যেই অ্যাপ মোডে চলছে।');closeModal('installModal');return;}
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();const choice=await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;if(choice&&choice.outcome==='accepted'){closeModal('installModal');localStorage.setItem(SEEN_INSTALL_KEY,'1');}else {$('#installFallback').hidden=false;}return;}
    $('#installFallback').hidden=false;
    $('#installFallback').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function openInstallModal(auto=false) {
    if(installedMode)return;
    $('#installFallback').hidden=false;
    if(deferredInstallPrompt)$('#installFallback').hidden=true;
    openModal('installModal');
  }
  function closeMobileNav() { if(mobileOverlay){mobileOverlay.remove();mobileOverlay=null;} $('#sidebar').classList.remove('mobile-open'); }
  function toggleMobileNav() {
    const sidebar=$('#sidebar');if(sidebar.classList.contains('mobile-open')){closeMobileNav();return;}
    sidebar.classList.add('mobile-open');mobileOverlay=document.createElement('div');mobileOverlay.className='nav-overlay';mobileOverlay.addEventListener('click',closeMobileNav);document.body.appendChild(mobileOverlay);
  }

  document.addEventListener('click',e=>{
    const pageBtn=e.target.closest('[data-page]');if(pageBtn){e.preventDefault();showPage(pageBtn.dataset.page);return;}
    const action=e.target.closest('[data-action]');if(action){actOnTask(action.dataset.action,action.dataset.id);return;}
    const close=e.target.closest('[data-close]');if(close){if(close.dataset.close==='installModal')localStorage.setItem(SEEN_INSTALL_KEY,'1');closeModal(close.dataset.close);return;}
    const stage=e.target.closest('input[data-chapter]');if(stage){const id=stage.dataset.chapter,i=Number(stage.dataset.stage),arr=chapterStageArray(id).slice();arr[i]=stage.checked;state.chapterStages[id]=arr;saveState();renderSyllabus();renderDashboard();if(currentPage==='progress')renderProgress();return;}
  });
  $('#menuToggle').addEventListener('click',toggleMobileNav);
  $('#selectedDate').addEventListener('change',e=>{if(e.target.value){selectedDate=e.target.value;renderToday();}});
  $('#prevDay').addEventListener('click',()=>{selectedDate=isoAdd(selectedDate,-1);renderToday();});
  $('#nextDay').addEventListener('click',()=>{selectedDate=isoAdd(selectedDate,1);renderToday();});
  $$('#todayTrackFilter button').forEach(b=>b.addEventListener('click',()=>{todayTrack=b.dataset.filter;renderToday();}));
  $('#todaySearch').addEventListener('input',renderToday);
  $('#allSearch').addEventListener('input',renderAllTasks);$('#allTrack').addEventListener('change',renderAllTasks);$('#allStatus').addEventListener('change',renderAllTasks);
  $('#chapterSearch').addEventListener('input',renderSyllabus);$('#chapterSubject').addEventListener('change',renderSyllabus);$('#chapterReadiness').addEventListener('change',renderSyllabus);
  $('#rescheduleForm').addEventListener('submit',doReschedule);
  $$('.modal-backdrop').forEach(back=>back.addEventListener('click',e=>{if(e.target===back){if(back.id==='installModal')localStorage.setItem(SEEN_INSTALL_KEY,'1');closeModal(back.id);}}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){ $$('.modal-backdrop.open').forEach(modal=>{if(modal.id==='installModal')localStorage.setItem(SEEN_INSTALL_KEY,'1');closeModal(modal.id);}); }});
  $('#upPrev').addEventListener('click',()=>{upcomingOffset--;renderUpcoming();});$('#upNext').addEventListener('click',()=>{upcomingOffset++;renderUpcoming();});$('#jumpToday').addEventListener('click',()=>{upcomingOffset=0;renderUpcoming();});
  $('#exportBackup').addEventListener('click',downloadBackup);$('#exportQuick').addEventListener('click',downloadBackup);$('#importBackup').addEventListener('change',e=>importBackup(e.target.files[0]));$('#resetData').addEventListener('click',resetProgress);
  $('#installTop').addEventListener('click',()=>openInstallModal(false));$('#installSettings').addEventListener('click',()=>openInstallModal(false));$('#installModalButton').addEventListener('click',requestInstall);
  $('#installLater').addEventListener('click',()=>{localStorage.setItem(SEEN_INSTALL_KEY,'1');closeModal('installModal');});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;if($('#installModal').classList.contains('open'))$('#installFallback').hidden=true;});
  window.addEventListener('appinstalled',()=>{installedMode=true;deferredInstallPrompt=null;localStorage.setItem(SEEN_INSTALL_KEY,'1');closeModal('installModal');renderSettings();showToast('StudyMate সফলভাবে ইনস্টল হয়েছে।');});
  window.addEventListener('online',()=>showToast('ইন্টারনেট সংযোগ ফিরে এসেছে।'));window.addEventListener('offline',()=>showToast('অফলাইন মোড: সেভ করা টাস্ক ব্যবহার করতে পারবে।'));

  // The custom first-run install prompt is separate from the native install prompt.
  // A native installation prompt is requested only after a direct user click, as browsers require.
  hydrateIcons();renderAll();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')) {
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
  if(!installedMode&&!localStorage.getItem(SEEN_INSTALL_KEY)) setTimeout(()=>openInstallModal(true),900);
})();

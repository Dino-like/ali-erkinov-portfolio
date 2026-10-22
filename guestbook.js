(() => {
  const $ = id => document.getElementById(id), root = $('exhibition');
  if (!root) return;
  let api = '', notes = [], page = 0, startedAt = 0, selected = 'butter', focusBefore;
  const pageSize = 8, dialog = $('note-dialog'), form = $('note-form'), wall = $('visitor-wall');
  const status = (text) => { $('note-status').textContent = text; };
  function mode(show) {
    root.classList.toggle('show-notes',show);
    $('notes-mode').setAttribute('aria-pressed',String(show)); $('art-mode').setAttribute('aria-pressed',String(!show));
    if(show) { $('xd').querySelectorAll('button')[1]?.click(); render(); }
  }
  function render() {
    wall.replaceChildren(); const visible = notes.slice(page*pageSize,(page+1)*pageSize);
    if(!visible.length) { const p=document.createElement('p');p.className='note-empty';p.textContent=api?'Здесь может быть твоя идея. Оставь первый стикер.':'Общая стена скоро откроется.';wall.append(p); }
    for(const [i,note] of visible.entries()) {
      const card=document.createElement('article');card.className='visitor-note note-'+note.color;card.style.setProperty('--tilt',[-3,2,-1,3,1,-2,2,-3][i]+'deg');
      const body=document.createElement('p');body.textContent=note.text;body.style.fontSize=note.text.length>150?'14px':note.text.length>90?'16px':'20px';
      const footer=document.createElement('footer');footer.textContent=(note.name||'Гость')+' · '+new Date(note.created_at).toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
      card.append(body,footer);wall.append(card);
    }
    $('notes-page').textContent=notes.length ? `${page+1} / ${Math.ceil(notes.length/pageSize)}` : '';
    $('notes-prev').disabled=page===0;$('notes-next').disabled=(page+1)*pageSize>=notes.length;
  }
  async function refresh() { if(!api)return; try { const r=await fetch(api,{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();notes=Array.isArray(data.notes)?data.notes:[];page=Math.min(page,Math.max(0,Math.ceil(notes.length/pageSize)-1));render();$('wall-status').textContent=''; } catch { $('wall-status').textContent='Стена временно недоступна. Обнови её чуть позже.'; } }
  function close() { dialog.hidden=true;focusBefore?.focus({preventScroll:true}); }
  $('note-open').onclick=()=>{ focusBefore=document.activeElement;dialog.hidden=false;startedAt=Date.now();status(api?'':'Общая стена ещё подключается. Публикация пока недоступна.');$('note-send').disabled=!api;$('note-text').focus(); };
  $('note-close').onclick=close;dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape')close();
    if(e.key==='Tab') { const els=Array.from(dialog.querySelectorAll('button:not(:disabled),textarea,input:not([tabindex="-1"])')).filter(el=>!el.closest('.note-honey'));const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();} }
  });
  $('note-text').oninput=()=>{ $('note-count').textContent=$('note-text').value.length+' / 240'; };
  document.querySelectorAll('[data-note-color]').forEach(b=>b.onclick=()=>{selected=b.dataset.noteColor;document.querySelectorAll('[data-note-color]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));form.dataset.color=selected;});
  $('notes-mode').onclick=()=>{mode(true);refresh();};$('art-mode').onclick=()=>mode(false);
  $('notes-prev').onclick=()=>{if(page>0){page--;render();}};$('notes-next').onclick=()=>{if((page+1)*pageSize<notes.length){page++;render();}};
  $('notes-refresh').onclick=refresh;
  form.onsubmit=async e=>{e.preventDefault();if(!api)return;const button=$('note-send');button.disabled=true;status('Приклеиваем…');
    try { const r=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:$('note-text').value,name:$('note-name').value,color:selected,website:$('note-website').value,startedAt})});const data=await r.json();if(!r.ok)throw Error(data.error||'Не удалось приклеить стикер.');notes.unshift(data.note);page=0;form.reset();$('note-count').textContent='0 / 240';close();mode(true);$('wall-status').textContent='Твой стикер на стене.'; }
    catch(error) {status(error.message||'Не удалось отправить стикер. Текст сохранён в форме.');}finally{button.disabled=false;}
  };
  fetch('guestbook-config.json',{cache:'no-store'}).then(r=>r.json()).then(config=>{api=config.apiUrl||(['localhost','127.0.0.1'].includes(location.hostname)?'/api/notes':'');return refresh();}).catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&root.classList.contains('show-notes'))refresh();});
  render();
})();

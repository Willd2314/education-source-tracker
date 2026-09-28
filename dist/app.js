'use strict';
const $ = id => document.getElementById(id);
let db, user, rows = [], deleteId, generation = 0;
const tell = message => { $('message').textContent = message; };
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validURL = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
function render() {
  $('total').textContent = rows.length;
  $('pending').textContent = rows.filter(r => r.status === 'To review').length;
  $('reviewed').textContent = rows.filter(r => r.status === 'Reviewed').length;
  const q = $('search').value.toLowerCase(), status = $('filter').value;
  const shown = rows.filter(r => (!status || r.status === status) && [r.title,r.publisher,r.notes].join(' ').toLowerCase().includes(q));
  $('sources').innerHTML = shown.length ? shown.map(r => `<article class="source"><span class="badge type">${escapeHTML(r.kind)}</span><span class="badge">${escapeHTML(r.status)}</span><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.publisher)}</p>${validURL(r.url) ? `<a href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : '<span>Invalid source URL</span>'}<p>${escapeHTML(r.notes)}</p><div class="actions"><button data-edit="${escapeHTML(r.id)}">Edit</button><button data-delete="${escapeHTML(r.id)}">Delete</button></div></article>`).join('') : `<div class="empty"><h3>${rows.length ? 'No matching sources' : 'Start your source library'}</h3><p>${rows.length ? 'Try another search or status.' : 'Add an article, dataset, or discussion to begin your research.'}</p></div>`;
}
async function refresh() {
  const ticket = ++generation;
  $('sources').textContent = 'Loading sources…';
  const {data,error} = await db.from('sources').select('*').order('created_at',{ascending:false});
  if (ticket !== generation || !user) return;
  if (error) { rows=[]; render(); $('sources').textContent='Unable to load sources. Reload to try again.'; throw error; }
  rows=data; render();
}
async function sessionChanged(session) {
  generation++; user=session?.user ?? null; rows=[];
  $('auth').hidden=!!user; $('workspace').hidden=!user; $('logout').hidden=!user;
  $('identity').textContent=user?.email ?? '';
  $('editor').close(); $('delete-dialog').close();
  if(user) { try { await refresh(); } catch(e) {tell(e.message);} } else render();
}
async function start() {
  let stored={}; try {stored=JSON.parse(localStorage.getItem('est-config') || '{}');} catch {}
  const config=window.APP_CONFIG?.supabaseUrl ? window.APP_CONFIG : stored;
  if(!config.supabaseUrl || !config.supabaseKey) { $('setup').hidden=false; return; }
  if(!window.supabase) {tell('Could not load the authentication library. Check your internet connection and reload.'); return;}
  try {
    db=window.supabase.createClient(config.supabaseUrl,config.supabaseKey);
    db.auth.onAuthStateChange((_event,session) => { setTimeout(() => sessionChanged(session),0); });
    const {data,error}=await db.auth.getSession(); if(error) throw error;
    await sessionChanged(data.session);
  } catch(e) { tell(e.message); $('setup').hidden=false; }
}
$('setup-form').onsubmit=e=>{
  e.preventDefault(); const url=$('project-url').value.trim(), key=$('project-key').value.trim();
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) return tell('Enter the HTTPS project URL from your Supabase dashboard.');
  let role='';try { role=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role; } catch {}
  if(key.startsWith('sb_secret_') || role==='service_role') return tell('Use a publishable or anon key, not a secret key.');
  if(!key.startsWith('sb_publishable_') && role!=='anon') return tell('Enter a valid Supabase publishable or anon key.');
  try {localStorage.setItem('est-config',JSON.stringify({supabaseUrl:url,supabaseKey:key})); location.reload();} catch {tell('Browser storage is unavailable. Set the public values in config.js instead.');}
};
$('auth-form').onsubmit=async e=>{
  e.preventDefault(); const buttons=[...e.currentTarget.querySelectorAll('button')]; buttons.forEach(b=>b.disabled=true); tell('');
  try {
    const credentials={email:$('email').value.trim(),password:$('password').value};
    const register=e.submitter?.value==='register';
    const {data,error}=register ? await db.auth.signUp({...credentials,options:{emailRedirectTo:location.origin}}) : await db.auth.signInWithPassword(credentials);
    if(error) throw error;
    $('password').value='';
    tell(register && !data.session ? 'Check your email to confirm your account, then log in.' : 'Signed in.');
  } catch(e) {tell(e.message);} finally {buttons.forEach(b=>b.disabled=false);}
};
$('logout').onclick=async()=>{const {error}=await db.auth.signOut();if(error)tell(error.message);else tell('Logged out.');};
function openEditor(row={}) {
  $('source-form').reset(); $('source-id').value=row.id || '';
  ['title','url','publisher','notes'].forEach(k=>$(k).value=row[k] || '');
  $('kind').value=row.kind || 'Article'; $('status').value=row.status || 'To review';
  $('editor-title').textContent=row.id ? 'Edit source' : 'Add source'; $('form-message').textContent='';
  $('editor').showModal(); $('title').focus();
}
$('add').onclick=()=>openEditor(); $('close').onclick=()=>$('editor').close();
$('source-form').onsubmit=async e=>{
  e.preventDefault(); if(!user)return; $('save').disabled=true;
  try {
    const record={}; ['title','url','kind','status','publisher','notes'].forEach(k=>record[k]=$(k).value.trim());
    if(!record.title)throw new Error('Enter a source title.');
    if(!validURL(record.url))throw new Error('Enter a valid HTTP or HTTPS URL.');
    const id=$('source-id').value;
    const query=id ? db.from('sources').update(record).eq('id',id) : db.from('sources').insert({...record,user_id:user.id});
    const {error}=await query.select().single(); if(error)throw error;
    $('editor').close(); tell('Source saved.'); await refresh();
  } catch(e) {$('form-message').textContent=e.message; tell(e.message);} finally {$('save').disabled=false;}
};
$('sources').onclick=e=>{
  const edit=e.target.closest('[data-edit]'), del=e.target.closest('[data-delete]');
  if(edit)openEditor(rows.find(r=>r.id===edit.dataset.edit));
  if(del){deleteId=del.dataset.delete; $('delete-dialog').showModal();}
};
$('cancel-delete').onclick=()=>$('delete-dialog').close();
$('confirm-delete').onclick=async()=>{
  $('confirm-delete').disabled=true;
  try {const {error}=await db.from('sources').delete().eq('id',deleteId).select().single();if(error)throw error;$('delete-dialog').close();tell('Source deleted.');await refresh();} catch(e){$('delete-dialog').close();tell(e.message);} finally{$('confirm-delete').disabled=false;}
};
$('search').oninput=render; $('filter').onchange=render;
start();

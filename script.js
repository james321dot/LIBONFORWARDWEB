
// Minimal script for portal
const STORAGE_KEY = 'libon-official-v1';
const ADMIN_EMAIL = 'Libonforward.gov.ph';
const ADMIN_HASH = '1db64a5b53649f551ef71d698066cb025ca1ce802adba4030782ac23932c7751';

const DEFAULT = { news:[{id:'n-1',title:'Medical Mission',content:'Free checkups.',date:'2025-11-08'}], reports:[], services:[], hotlines:[] };
function loadStore(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw){ localStorage.setItem(STORAGE_KEY,JSON.stringify(DEFAULT)); return structuredClone(DEFAULT); } return JSON.parse(raw); }catch(e){ localStorage.setItem(STORAGE_KEY,JSON.stringify(DEFAULT)); return structuredClone(DEFAULT); } }
let store = loadStore();

const $ = s => document.querySelector(s);
function renderNews(){ const area = document.getElementById('newsArea'); area.innerHTML = ''; (store.news||[]).forEach(n=>{ const d=document.createElement('div'); d.className='news-item'; d.innerHTML = `<h4 style="margin:0">${n.title}</h4><div class="muted small">${n.date}</div><p>${n.content}</p>`; area.appendChild(d); }); }
renderNews();

document.getElementById('reportForm').addEventListener('submit', e=>{ e.preventDefault(); const fd=new FormData(e.target); const r = { id: Date.now(), issue: fd.get('issue'), citizen: fd.get('citizen'), details: fd.get('details'), priority: fd.get('priority'), status:'Pending', date: new Date().toISOString().slice(0,10) }; store.reports = store.reports || []; store.reports.unshift(r); localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); document.getElementById('reportMsg').textContent='Report submitted — salamat!'; setTimeout(()=>document.getElementById('reportMsg').textContent='',3000); e.target.reset(); });

function openModal(title, html){ document.getElementById('modal').classList.remove('hidden'); document.getElementById('modalTitle').innerText = title; document.getElementById('modalBody').innerHTML = html; }
function closeModal(){ document.getElementById('modal').classList.add('hidden'); document.getElementById('modalBody').innerHTML=''; }

function openLogin(){ document.getElementById('loginModal').classList.remove('hidden'); document.getElementById('loginEmail').value = ADMIN_EMAIL; document.getElementById('loginPassword').value=''; }
function closeLogin(){ document.getElementById('loginModal').classList.add('hidden'); }

function fillDemoLogin(){ document.getElementById('loginEmail').value = ADMIN_EMAIL; document.getElementById('loginPassword').value = 'libonforward2025'; }

async function sha256hex(str){ const enc = new TextEncoder(); const data = enc.encode(str); const digest = await crypto.subtle.digest('SHA-256', data); return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join(''); }

async function doLogin(){ const email = document.getElementById('loginEmail').value.trim(); const pass = document.getElementById('loginPassword').value; if(!email||!pass){ alert('Enter email & password'); return; } const hash = await sha256hex(pass); if(email.toLowerCase()===ADMIN_EMAIL.toLowerCase() && hash === ADMIN_HASH){ closeLogin(); showAdmin(); } else { alert('Invalid credentials'); } }

function showAdmin(){ document.getElementById('citizenView').classList.add('hidden'); document.getElementById('adminView').classList.remove('hidden'); openModal('Admin','<div class="muted">Admin dashboard loaded. Use localStorage to manage content.</div>'); }


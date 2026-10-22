/* DEX portfolio - main.js (vanilla JS, no dependencies) */
'use strict';

/* ====== Config: عدّل هنا ====== */
const CONFIG = {
  whatsappNumber: '', // مثال: '201234567890' (بدون + ولا مسافات). فاضي = الأيقونة تتخبى
};

const PROJECTS = [
  {
    title: 'Reze Bot',
    desc: 'WhatsApp entertainment bot built with Baileys / MeowSab: games, stickers and menus.',
    link: 'https://github.com/luffy182010',
    tags: ['Node.js', 'Baileys'],
  },
  // زوّد مشاريعك هنا بنفس الشكل:
  // { title: 'اسم المشروع', desc: 'وصف', link: 'https://...', image: 'https://...', tags: ['JS'] },
];

const SNIPPETS = {
  html: `<div class="dex">
  <h1>DEX</h1>
  <p>Full-stack developer</p>
</div>`,
  css: `.dex {
  background: #020607;
  color: #4fd1e0;
  border: 1px solid #0a4652;
  border-radius: 16px;
}`,
  js: `const dex = {
  name: "Mos3ab",
  role: "Full-stack",
  coffee: true,
};

console.log(\`Hi, I'm \${dex.name}\`);`,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ====== WhatsApp ====== */
function loadWhatsAppNumber() {
  const a = $('#waLink');
  const n = CONFIG.whatsappNumber.replace(/\D/g, '');
  if (!a || !n) return;
  a.href = 'https://wa.me/' + n;
  a.hidden = false;
}

/* ====== Projects ====== */
function loadProjects() {
  const box = $('#projectsContainer');
  if (!box) return;
  box.textContent = '';
  if (!PROJECTS.length) {
    const p = document.createElement('p');
    p.style.cssText = 'text-align:center;color:#7fa3aa;grid-column:1/-1';
    p.textContent = 'Coming soon...';
    box.appendChild(p);
    return;
  }
  PROJECTS.forEach((pr) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    if (pr.image) {
      const img = document.createElement('img');
      img.src = pr.image; img.alt = pr.title; img.loading = 'lazy';
      card.appendChild(img);
    }
    const h = document.createElement('h3');
    h.className = 'project-title'; h.textContent = pr.title;
    const d = document.createElement('p');
    d.className = 'project-desc'; d.textContent = pr.desc;
    card.append(h, d);
    if (pr.tags && pr.tags.length) {
      const t = document.createElement('p');
      t.className = 'project-desc'; t.style.color = '#19a3b8';
      t.textContent = pr.tags.join(' • ');
      card.appendChild(t);
    }
    if (pr.link) {
      const a = document.createElement('a');
      a.className = 'project-link'; a.href = pr.link;
      a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'View';
      card.appendChild(a);
    }
    box.appendChild(card);
  });
}

/* ====== Sounds ====== */
function setupSoundEffects() {
  const play = (id, vol) => {
    const a = document.getElementById(id);
    if (!a) return;
    a.volume = vol;
    a.currentTime = 0;
    a.play().catch(() => {}); // المتصفح بيمنع الصوت قبل أول ضغطة
  };
  let lastHover = 0;
  $$('.skill-card, .stat-card, .social-link').forEach((el) =>
    el.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastHover < 250) return;
      lastHover = now;
      play('hoverSound', 0.15);
    })
  );
  $$('.nav-btn, .social-link').forEach((el) => el.addEventListener('click', () => play('clickSound', 0.3)));
  $$('.submit-btn, .code-tab, .code-icon-btn').forEach((el) => el.addEventListener('click', () => play('buttonSound', 0.3)));
}

/* ====== Code editor (typing effect) ====== */
let typeToken = 0;
function typeSnippet(key) {
  const out = $('#code-content');
  if (!out) return;
  const text = SNIPPETS[key] || '';
  const my = ++typeToken;
  out.textContent = '';
  if (reduceMotion) { out.textContent = text; return; }
  let i = 0;
  (function step() {
    if (my !== typeToken) return; // اتغير التاب
    out.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, 28);
  })();
}

function setupCodeEditorEvents() {
  const tabs = $$('.code-tab');
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      typeSnippet(tab.dataset.snippet);
    })
  );
  const first = $('.code-tab.active') || tabs[0];
  if (first) typeSnippet(first.dataset.snippet);
}

/* ====== UI: navigation, modal, message form ====== */
function showToast(el, ms = 2600) {
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), ms);
}

function setupUIEventListeners() {
  // التنقل بين الصفحات
  const navs = $$('.nav-btn');
  const pages = $$('.page-section');
  navs.forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.page;
      navs.forEach((b) => b.classList.toggle('active', b === btn));
      pages.forEach((p) => p.classList.toggle('active', p.id === id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
  );

  // المودال
  const modal = $('#profileModal');
  const open = () => modal.classList.add('active');
  const close = () => modal.classList.remove('active');
  ['#avatarBtn', '#modalOpen'].forEach((s) => {
    const el = $(s);
    if (el) el.addEventListener('click', open);
  });
  $('#closeModal').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // فورم الرسائل (لسه مش شغال - مفيش سيرفر)
  const body = $('#messageBody');
  const validation = $('#validationMsg');
  $('#sendBtn').addEventListener('click', () => {
    const empty = !body.value.trim();
    validation.querySelector('h3').textContent = empty ? 'Please enter a message!' : 'Not available yet';
    validation.querySelector('p').textContent = empty
      ? 'The message field cannot be empty.'
      : 'Sending is not working at the moment. Please try again later.';
    showToast(validation);
  });
}

/* ====== Particles background ====== */
function initParticlesBackground() {
  const canvas = $('#bgCanvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
  const mouse = { x: -999, y: -999 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const n = Math.min(80, Math.floor((w * h) / 18000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6,
    }));
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();

  (function frame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const p = dots[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,209,224,0.85)';
      ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const q = dots[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(25,163,184,${0.28 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const m = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (m < 150) {
        ctx.strokeStyle = `rgba(79,209,224,${0.5 * (1 - m / 150)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  })();
}

/* ====== Init ====== */
document.addEventListener('DOMContentLoaded', () => {
  loadWhatsAppNumber();
  loadProjects();
  setupUIEventListeners();
  setupCodeEditorEvents();
  setupSoundEffects();
  initParticlesBackground();
});

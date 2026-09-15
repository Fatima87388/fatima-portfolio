/* animations.js — word rotator, counters, skill rings, reveals, scroll, nav, marquee */

/* ── Word rotator ─────────────────────────────────────────── */
const WORDS = ['work.', 'land.', 'scale.', 'stick.', 'matter.', 'connect.'];
let wordIdx = 0;

export function initWordRotator() {
  const el = document.getElementById('rotatorWord');
  if (!el) return;

  function next() {
    wordIdx = (wordIdx + 1) % WORDS.length;

    // Exit old word
    el.classList.remove('enter');
    el.classList.add('exit');

    setTimeout(() => {
      el.textContent = WORDS[wordIdx];
      el.classList.remove('exit');
      el.classList.add('enter');
    }, 380);
  }

  setInterval(next, 3200);
}

/* ── Typewriter ───────────────────────────────────────────── */
export function typewrite(el, text, speed = 24) {
  if (!el) return;
  let i = 0;
  el.textContent = '';
  (function tick() {
    el.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(tick, speed + Math.random() * 16);
  })();
}

/* ── Counter animation ────────────────────────────────────── */
export function initCounters() {
  const els = document.querySelectorAll('.hstat-value');
  if (!els.length) return;

  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      runCounter(e.target);
      ob.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  els.forEach(el => ob.observe(el));
}

function runCounter(el) {
  const raw    = el.dataset.target || el.textContent.trim();
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const suffix = raw.replace(/[0-9.]/g, '');
  if (isNaN(num)) return;

  const t0  = performance.now();
  const DUR = 1400;

  (function tick(now) {
    const t    = Math.min((now - t0) / DUR, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * num) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ── SVG Skill rings ──────────────────────────────────────── */
export function initSkillRings() {
  const groups = document.querySelectorAll('.skill-ring-group');
  if (!groups.length) return;

  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      // Animate the ring stroke
      const fill = e.target.querySelector('.ring-fill');
      if (fill) fill.classList.add('animate');

      // Animate the small bars
      e.target.querySelectorAll('.skill-fill-bar').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 100);
      });

      ob.unobserve(e.target);
    });
  }, { threshold: 0.25 });

  groups.forEach(g => ob.observe(g));
}

/* ── Scroll reveal ────────────────────────────────────────── */
export function initReveal() {
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ob.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => ob.observe(el));
}

/* ── Scroll progress + back-to-top ───────────────────────── */
export function initScroll() {
  const bar = document.getElementById('progress');
  const btn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = `${(scrollY / max) * 100}%`;
    btn?.classList.toggle('visible', scrollY > 500);
  }, { passive: true });

  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Active nav ───────────────────────────────────────────── */
export function initActiveNav() {
  const links = document.querySelectorAll('#siteNav a');
  const ids   = ['work', 'experience', 'skills', 'approach'];

  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = [...links].find(l => l.hash === `#${e.target.id}`);
      link?.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) ob.observe(el);
  });
}

/* ── Magnetic elements ────────────────────────────────────── */
export function initMagnetic() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.theme-toggle').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px) rotate(30deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ── Ticker hover pause ───────────────────────────────────── */
export function initTicker() {
  const track = document.querySelector('.ticker-track');
  const wrap  = track?.closest('.hero-ticker');
  if (!wrap) return;
  wrap.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  wrap.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
}

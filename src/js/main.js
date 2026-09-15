/* main.js — ES module entry point */
import { loadresume_new, render } from './render.js';
import { initLoader }    from './modules/loader.js';
import { initParticles } from './modules/particles.js';
import { initCursor }    from './modules/cursor.js';
import { initModal }     from './modules/modal.js';
import {
  initWordRotator,
  initReveal,
  initScroll,
  initActiveNav,
  initMagnetic,
  initTicker,
} from './modules/animations.js';

/* ── Theme (dark default, .light = light mode) ──────────────── */
function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light') document.body.classList.add('light');
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

/* ── Bootstrap ──────────────────────────────────────────────── */
const loader = initLoader();
const MIN_MS = 1650;
const t0     = performance.now();

initTheme();
initParticles();
initCursor();
initReveal();
initScroll();
initActiveNav();
initMagnetic();
initWordRotator();

loadresume_new()
  .then(data => {
    window.resume_newData = data;
    render(data);
    initModal();
    initTicker();
    const wait = Math.max(0, MIN_MS - (performance.now() - t0));
    setTimeout(loader.complete, wait);
  })
  .catch(() => {
    const el = document.getElementById('intro');
    if (el) el.textContent = 'Please open via a local server (python3 -m http.server).';
    loader.complete();
  });

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  window.addEventListener('pointermove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  }, { passive: true });

  (function trackRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(trackRing);
  })();

  const HOVER = 'a,button,[tabindex],.work-card,.t-btn,.t-dot,.theme-toggle';
  document.addEventListener('pointerover', e => {
    if (e.target.closest(HOVER)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest(HOVER)) document.body.classList.remove('cursor-hover');
  });
}

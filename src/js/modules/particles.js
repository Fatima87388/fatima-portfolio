export function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const hero = canvas.closest('.hero') || canvas.parentElement;
  const ctx  = canvas.getContext('2d');
  const COUNT = 52;
  const CONNECT = 118;
  const REPEL   = 85;
  const mouse   = { x: null, y: null };

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(hero);

  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  hero.addEventListener('pointerleave', () => { mouse.x = null; mouse.y = null; });

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r:  Math.random() * 1.5 + 0.5,
    op: Math.random() * 0.3 + 0.07,
  }));

  function getColor() {
    const hex = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#7A9E87';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  let rgb = getColor();
  document.getElementById('themeToggle')
    ?.addEventListener('click', () => setTimeout(() => { rgb = getColor(); }, 60));

  let raf;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < REPEL && d > 0) {
          const f = (REPEL - d) / REPEL;
          p.vx += (dx / d) * f * 0.55;
          p.vy += (dy / d) * f * 0.55;
        }
      }
      p.vx *= 0.978; p.vy *= 0.978;
      p.x  += p.vx;  p.y  += p.vy;

      if (p.x < 0)             { p.x = 0;             p.vx *= -0.6; }
      if (p.x > canvas.width)  { p.x = canvas.width;  p.vx *= -0.6; }
      if (p.y < 0)             { p.y = 0;             p.vy *= -0.6; }
      if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.6; }
    }

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / CONNECT) * 0.1})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Dots
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${p.op})`;
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
}

export function initCarousel(testimonials) {
  const track = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('tDots');
  if (!track || !testimonials?.length) return;

  track.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-item ${i === 0 ? 'active' : ''}">
      <blockquote>
        <p class="testimonial-quote">"${t.quote}"</p>
        <footer class="testimonial-attr">
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </footer>
      </blockquote>
    </div>
  `).join('');

  if (dotsEl) {
    dotsEl.innerHTML = testimonials.map((_, i) => `
      <button class="t-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
    `).join('');
  }

  let current = 0;
  let timer;

  function goTo(idx) {
    const items = track.querySelectorAll('.testimonial-item');
    const dots  = dotsEl?.querySelectorAll('.t-dot') ?? [];
    items[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = ((idx % items.length) + items.length) % items.length;
    items[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5200);
  }

  document.getElementById('tPrev')?.addEventListener('click', () => { goTo(current - 1); autoPlay(); });
  document.getElementById('tNext')?.addEventListener('click', () => { goTo(current + 1); autoPlay(); });
  dotsEl?.addEventListener('click', e => {
    const d = e.target.closest('.t-dot');
    if (d) { goTo(+d.dataset.index); autoPlay(); }
  });

  autoPlay();
}

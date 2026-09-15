export function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  function open(idx) {
    const d = window.resume_newData?.work?.[idx];
    if (!d) return;

    set('modalType', d.type);
    set('modalYear', d.year);
    set('modalTitle', d.title);
    set('modalSummary', d.summary);
    set('modalChallenge', d.challenge || '—');
    set('modalApproach', d.approach || '—');
    set('modalResult', d.result || '—');

    const tags = document.getElementById('modalTags');
    if (tags && d.tags) {
      tags.innerHTML = d.tags
        .map(t => `<span>${t}</span>`)
        .join('');
    }

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.getElementById('modalClose')?.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', e => {

    // If user clicks the project link, let the link open normally
    if (e.target.closest('.work-arrow')) {
      return;
    }

    // Clicking the project opens the modal
    const card = e.target.closest('.work-item');

    if (card) {
      const cards = [...document.querySelectorAll('.work-item')];
      open(cards.indexOf(card));
      return;
    }

    // Close modal
    if (
      e.target.closest('#modalClose') ||
      e.target === modal.querySelector('.modal-backdrop')
    ) {
      close();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      close();
    }

    if (
      (e.key === 'Enter' || e.key === ' ') &&
      e.target.matches('.work-item')
    ) {
      e.preventDefault();
      e.target.click();
    }
  });
}
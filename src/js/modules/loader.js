export function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');

  let width = 0;
  const interval = setInterval(() => {
    width = Math.min(width + (Math.random() * 6 + 2), 90);
    if (fill) fill.style.width = width + '%';
    if (width >= 90) clearInterval(interval);
  }, 90);

  function complete() {
    clearInterval(interval);
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('hide');
      document.body.classList.add('loaded');
      setTimeout(() => loader?.remove(), 750);
    }, 360);
  }

  return { complete };
}

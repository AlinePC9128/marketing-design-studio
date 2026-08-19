const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function setupTheme() {
  const button = $('#theme-toggle');
  const apply = (theme) => { document.body.dataset.theme = theme; button.querySelector('.theme-label').textContent = theme === 'dark' ? 'Claro' : 'Oscuro'; button.setAttribute('aria-pressed', String(theme === 'dark')); };
  apply(localStorage.getItem('marketing-design-theme') || 'light');
  button.addEventListener('click', () => { const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('marketing-design-theme', next); apply(next); });
}

function notify(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); window.clearTimeout(window.__toast); window.__toast = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const area = document.createElement('textarea'); area.value = value; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); return Promise.resolve();
}

function setupFilters() {
  const cards = $$('.campaign-card');
  $$('.filter').forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter; $$('.filter').forEach((item) => item.classList.toggle('active', item === button));
    cards.forEach((card) => { card.hidden = filter !== 'all' && !card.dataset.kind.split(' ').includes(filter); });
    notify(filter === 'all' ? 'Mostrando todo el campaign kit' : `Filtro: ${button.textContent}`);
  }));
}

$$('.swatch').forEach((button) => button.addEventListener('click', async () => { await copyText(button.dataset.color); $('#palette-note').textContent = `${button.dataset.color} copiado · ${button.querySelector('span').textContent}`; notify(`Color ${button.dataset.color} copiado`); }));

setupTheme(); setupFilters();

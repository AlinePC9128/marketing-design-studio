const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function setupTheme() {
  const button = $('#theme-toggle');
  if (!button) return;
  const apply = (theme) => {
    document.body.dataset.theme = theme;
    button.querySelector('.theme-label').textContent = theme === 'dark' ? 'Claro' : 'Oscuro';
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  };
  apply(localStorage.getItem('aline-portfolio-theme') || 'light');
  button.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aline-portfolio-theme', next);
    apply(next);
  });
}

function notify(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.__toast);
  window.__toast = window.setTimeout(() => toast.classList.remove('show'), 1900);
}

function setupFilters() {
  const cards = $$('.project-card');
  $$('.filter').forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('.filter').forEach((item) => item.classList.toggle('active', item === button));
    cards.forEach((card) => { card.hidden = filter !== 'all' && !card.dataset.kind.split(' ').includes(filter); });
    notify(filter === 'all' ? 'Mostrando todos los proyectos' : `Mostrando proyectos de ${button.textContent.trim()}`);
  }));
}

function setupAssetModal() {
  const modal = $('#asset-modal');
  if (!modal) return;
  const image = $('#modal-image');
  const title = $('#modal-title');
  const description = $('#modal-description');
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); };
  const open = (card) => {
    const cardImage = card.querySelector('img');
    const cardTitle = card.dataset.title || card.querySelector('h3')?.textContent || 'Proyecto seleccionado';
    title.textContent = cardTitle;
    description.textContent = card.querySelector('.project-copy p')?.textContent || card.querySelector('small')?.textContent || 'Evidencia visual del portafolio de diseño de Aline Peña Colunga.';
    image.src = cardImage.src;
    image.alt = cardImage.alt;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };
  $$('.project-card, .evidence-card').forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Abrir ${card.dataset.title || card.querySelector('h3')?.textContent || 'evidencia visual'}`);
    card.addEventListener('click', (event) => { if (event.target.closest('a')) event.preventDefault(); open(card); });
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(card); } });
  });
  $$('[data-close-modal]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
}

function setupScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function setupMetricAnimation() {
  const metrics = $$('[data-count]');
  if (!('IntersectionObserver' in window) || !metrics.length) return;
  const animate = (element) => {
    const target = Number(element.dataset.count);
    const suffix = target === 15000 ? 'K' : '';
    const displayTarget = target === 15000 ? 15 : target;
    const duration = 900;
    const started = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const value = Math.round(displayTarget * (1 - Math.pow(1 - progress, 3)));
      element.textContent = `${value}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  };
  const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { animate(entry.target); instance.unobserve(entry.target); } }), { threshold: .45 });
  metrics.forEach((metric) => observer.observe(metric));
}

function setupActiveNavigation() {
  const links = $$('.main-nav a');
  const sections = links.map((link) => $(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

setupTheme();
setupFilters();
setupAssetModal();
setupScrollProgress();
setupMetricAnimation();
setupActiveNavigation();

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

const previewCopy = {
  direccion: {
    authority: { title: 'La infraestructura que sostiene el siguiente movimiento.', body: 'Una lectura ejecutiva de capacidad, confiabilidad y visión de largo plazo.', cta: 'Ver capacidades' },
    evidence: { title: '345 MMpcd explicados sin ruido.', body: 'Un dato público se convierte en una señal de escala, continuidad y conversación.', cta: 'Abrir caso' },
    conversation: { title: '¿Qué hace que un proyecto avance?', body: 'Una invitación a hablar de capacidad, riesgos y decisiones con el contexto correcto.', cta: 'Iniciar conversación' },
  },
  ingenieria: {
    authority: { title: 'Precisión para operar con continuidad.', body: 'Procesos, equipos y criterios organizados para que lo técnico se pueda compartir.', cta: 'Ver proceso' },
    evidence: { title: 'Cada etapa deja una señal.', body: 'La comunicación baja la complejidad a secuencias, indicadores y puntos de control.', cta: 'Ver indicadores' },
    conversation: { title: 'Diseñemos la siguiente variable.', body: 'Un mensaje directo para poner experiencia y capacidad sobre la mesa de trabajo.', cta: 'Consultar al equipo' },
  },
  compras: {
    authority: { title: 'Capacidad que cabe en una decisión.', body: 'Una propuesta B2B que ordena alcance, confiabilidad y siguiente paso.', cta: 'Conocer alcance' },
    evidence: { title: 'Menos promesa. Más evidencia.', body: 'Presentar certificaciones, datos y experiencia para comparar con claridad.', cta: 'Ver evidencia' },
    conversation: { title: 'Hablemos del proyecto completo.', body: 'El CTA no empuja una venta: abre una conversación con información suficiente.', cta: 'Solicitar consulta' },
  },
};

function setupPlayground() {
  const preview = $('#live-preview');
  const audience = $('#preview-audience');
  const objective = $('#preview-objective');
  const channel = $('#preview-channel');
  if (!preview || !audience || !objective || !channel) return;
  const updatePreview = () => {
    const copy = previewCopy[audience.value][objective.value];
    const channelName = channel.options[channel.selectedIndex].text;
    $('#preview-kicker').textContent = `${channelName.toUpperCase()} / ${objective.value.toUpperCase()}`;
    $('#preview-tag').textContent = audience.options[audience.selectedIndex].text.toUpperCase();
    $('#preview-title').textContent = copy.title;
    $('#preview-body').textContent = copy.body;
    $('#preview-cta').textContent = `${copy.cta} ↗`;
    preview.classList.toggle('email', channel.value === 'email');
    preview.classList.toggle('deck', channel.value === 'deck');
  };
  [audience, objective, channel].forEach((select) => select.addEventListener('change', updatePreview));
  $('#generate-preview').addEventListener('click', () => { updatePreview(); notify('Mensaje actualizado'); });
  $('#copy-preview').addEventListener('click', async () => {
    const copy = previewCopy[audience.value][objective.value];
    const brief = `${channel.options[channel.selectedIndex].text} · ${audience.options[audience.selectedIndex].text}\n${copy.title}\n${copy.body}\nCTA: ${copy.cta}`;
    await copyText(brief);
    notify('Brief copiado');
  });
  $('#preview-cta').addEventListener('click', () => notify(`CTA de ${channel.options[channel.selectedIndex].text}: ${previewCopy[audience.value][objective.value].cta}`));
  updatePreview();
}

function setupEvidenceSearch() {
  const input = $('#evidence-search');
  const count = $('#evidence-count');
  if (!input || !count) return;
  const resources = $$('.evidence-grid a');
  const update = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    resources.forEach((resource) => {
      const matches = !query || resource.textContent.toLowerCase().includes(query);
      resource.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = `${visible} recurso${visible === 1 ? '' : 's'}`;
  };
  input.addEventListener('input', update);
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
    title.textContent = card.querySelector('h3').textContent;
    description.textContent = card.querySelector('.piece-copy p').textContent;
    image.src = cardImage.src;
    image.alt = cardImage.alt;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };
  $$('.campaign-card').forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ampliar ${card.querySelector('h3').textContent}`);
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(card); } });
  });
  $$('[data-close-modal]').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
}

$$('.swatch').forEach((button) => button.addEventListener('click', async () => { await copyText(button.dataset.color); $('#palette-note').textContent = `${button.dataset.color} copiado · ${button.querySelector('span').textContent}`; notify(`Color ${button.dataset.color} copiado`); }));

setupTheme(); setupFilters(); setupPlayground(); setupEvidenceSearch(); setupAssetModal();

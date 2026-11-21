const CATEGORIES = ['Animation', 'Generative AI', 'Consulting', 'Vimeo', 'YouTube'];

export function isEditMode() {
  return new URLSearchParams(window.location.search).get('edit') === '1';
}

export function renderEditorToolbar(portfolioConfig, { onAdd, onSave, onExit }) {
  const workSection = document.querySelector('#work .container');
  if (!workSection) return null;

  let toolbar = document.getElementById('portfolio-editor-bar');
  if (toolbar) toolbar.remove();

  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  toolbar = document.createElement('div');
  toolbar.id = 'portfolio-editor-bar';
  toolbar.className = 'editor-bar';
  toolbar.innerHTML = `
    <div class="editor-bar-header">
      <div>
        <strong>Modo Editor de Proyectos</strong>
        <span class="editor-hint">Haz clic en 📌 en cualquier vídeo para fijarlo, usa ◀ ▶ para reordenar o pega un enlace de Vimeo / YouTube.</span>
      </div>
      <div class="editor-actions">
        <button type="button" id="editor-save-btn" class="btn btn-primary btn-sm">
          ${isLocal ? 'Guardar en proyecto' : 'Descargar portfolio.json'}
        </button>
        <button type="button" id="editor-exit-btn" class="btn btn-outline btn-sm">Salir</button>
      </div>
    </div>
    <form id="editor-add-form" class="editor-add-form">
      <input type="url" name="url" placeholder="Pega una URL de Vimeo o YouTube (ej. https://vimeo.com/... o https://youtu.be/...)" required />
      <input type="text" name="title" placeholder="Título (opcional)" />
      <select name="category">
        ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <button type="submit" class="btn btn-primary btn-sm">+ Fijar vídeo</button>
    </form>
    <div id="editor-status" class="editor-status" role="status" aria-live="polite"></div>
  `;

  const workGrid = document.getElementById('work-grid');
  workSection.insertBefore(toolbar, workGrid);

  toolbar.querySelector('#editor-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const url = form.url.value.trim();
    const title = form.title.value.trim();
    const category = form.category.value;
    if (!url) return;
    onAdd({ url, ...(title ? { title } : {}), category });
    form.reset();
  });

  toolbar.querySelector('#editor-save-btn').addEventListener('click', () => {
    onSave(toolbar.querySelector('#editor-status'));
  });

  toolbar.querySelector('#editor-exit-btn').addEventListener('click', onExit);

  return toolbar;
}

export function renderCardEditorControls(video, pinnedIndex, totalPinned) {
  const isPinned = pinnedIndex !== -1;
  return `
    <div class="card-editor-controls" onclick="event.stopPropagation()">
      <button type="button" class="editor-pill ${isPinned ? 'pinned' : ''}" data-action="toggle-pin" data-url="${video.url}" data-title="${video.title.replace(/"/g, '&quot;')}" data-category="${video.category || 'Animation'}" title="${isPinned ? 'Quitar de fijados' : 'Fijar proyecto'}">
        ${isPinned ? '📌 Fijado #' + (pinnedIndex + 1) : '📍 Fijar'}
      </button>
      ${isPinned ? `
        <div class="editor-move-group">
          <button type="button" class="editor-icon-btn" data-action="move-left" data-index="${pinnedIndex}" ${pinnedIndex === 0 ? 'disabled' : ''} title="Mover antes">◀</button>
          <button type="button" class="editor-icon-btn" data-action="move-right" data-index="${pinnedIndex}" ${pinnedIndex === totalPinned - 1 ? 'disabled' : ''} title="Mover después">▶</button>
        </div>
        <select class="editor-cat-select" data-action="change-category" data-index="${pinnedIndex}" aria-label="Categoría">
          ${CATEGORIES.map((c) => `<option value="${c}" ${video.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      ` : ''}
    </div>
  `;
}

export async function savePortfolioConfig(portfolioConfig, statusEl) {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isLocal) {
    try {
      const res = await fetch('/__save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioConfig)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al guardar');
      }
      if (statusEl) {
        statusEl.textContent = '✓ Guardado directamente en public/portfolio.json';
        statusEl.className = 'editor-status success';
      }
      return;
    } catch (err) {
      console.error('Save failed:', err);
      if (statusEl) {
        statusEl.textContent = `Error al guardar: ${err.message}`;
        statusEl.className = 'editor-status error';
      }
      return;
    }
  }

  // In production: download portfolio.json
  const blob = new Blob([JSON.stringify(portfolioConfig, null, 2) + '\n'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio.json';
  a.click();
  URL.revokeObjectURL(a.href);

  if (statusEl) {
    statusEl.textContent = '✓ Descargado portfolio.json (súbelo a public/portfolio.json)';
    statusEl.className = 'editor-status success';
  }
}

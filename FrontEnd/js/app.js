/**
 * Neuform Studio Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize React Bits Pro Landscape Engine & Telemetry
  const landscapeEngine = new ReactBitsLandscape('terrain-canvas');
  const telemetry = new TelemetryManager(landscapeEngine);

  // Tab Switching (PREVIEW vs DESIGN.MD)
  const previewTabBtn = document.getElementById('tab-btn-preview');
  const designTabBtn = document.getElementById('tab-btn-design');
  const previewPane = document.getElementById('pane-preview');
  const designPane = document.getElementById('pane-design');

  function switchTab(tab) {
    if (tab === 'preview') {
      previewTabBtn.classList.add('active');
      designTabBtn.classList.remove('active');
      previewPane.classList.add('active');
      designPane.classList.remove('active');
      // Trigger canvas resize
      setTimeout(() => landscapeEngine.onResize(), 50);
    } else {
      designTabBtn.classList.add('active');
      previewTabBtn.classList.remove('active');
      designPane.classList.add('active');
      previewPane.classList.remove('active');
    }
  }

  if (previewTabBtn && designTabBtn) {
    previewTabBtn.addEventListener('click', () => switchTab('preview'));
    designTabBtn.addEventListener('click', () => switchTab('design'));
  }

  // Fullscreen / "Open in Library" Toggle
  const openLibraryBtn = document.getElementById('open-library-btn');
  const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
  const macGreenDot = document.querySelector('.nf-dot.max');

  function toggleFullscreen() {
    document.body.classList.toggle('fullscreen-mode');
    setTimeout(() => landscapeEngine.onResize(), 100);
  }

  if (openLibraryBtn) openLibraryBtn.addEventListener('click', toggleFullscreen);
  if (exitFullscreenBtn) exitFullscreenBtn.addEventListener('click', toggleFullscreen);
  if (macGreenDot) macGreenDot.addEventListener('click', toggleFullscreen);

  // Copy DESIGN.md Code Button
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const rawCodeEl = document.getElementById('raw-design-code');

  if (copyCodeBtn && rawCodeEl) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(rawCodeEl.textContent).then(() => {
        copyCodeBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        copyCodeBtn.classList.add('copied');
        setTimeout(() => {
          copyCodeBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy DESIGN.md
          `;
          copyCodeBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // Download Actions
  const downloadDesignBtn = document.getElementById('btn-download-design');
  const downloadHtmlBtn = document.getElementById('btn-download-html');

  if (downloadDesignBtn) {
    downloadDesignBtn.addEventListener('click', () => {
      const code = rawCodeEl ? rawCodeEl.textContent : '';
      const blob = new Blob([code], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DESIGN.md';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener('click', () => {
      fetch('standalone.html')
        .then(r => r.text())
        .then(html => {
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'nexus-volumetric-interfaces.html';
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(() => {
          window.open('standalone.html', '_blank');
        });
    });
  }

  // Favorite Toggle
  const favoriteBtn = document.getElementById('btn-favorite');
  const favoriteCountEl = document.getElementById('stat-favorites-val');
  let isFavorited = false;
  let favorites = 30;

  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', () => {
      isFavorited = !isFavorited;
      favorites += isFavorited ? 1 : -1;
      if (favoriteCountEl) favoriteCountEl.textContent = favorites;
      favoriteBtn.classList.toggle('active', isFavorited);
      favoriteBtn.innerHTML = isFavorited
        ? `★ Favorited`
        : `☆ Favorite`;
    });
  }

  // Remix Modal Dialog
  const remixBtn = document.getElementById('btn-remix');
  const remixModal = document.getElementById('remix-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const submitRemixBtn = document.getElementById('submit-remix-btn');

  if (remixBtn && remixModal) {
    remixBtn.addEventListener('click', () => {
      remixModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
      remixModal.classList.remove('open');
    });

    remixModal.addEventListener('click', (e) => {
      if (e.target === remixModal) {
        remixModal.classList.remove('open');
      }
    });

    submitRemixBtn.addEventListener('click', () => {
      const promptText = document.getElementById('remix-prompt').value;
      alert(`Remix submitted with prompt: "${promptText}"!\nMutating procedural terrain engine...`);
      remixModal.classList.remove('open');
      telemetry.generateNewSeed();
      switchTab('preview');
    });
  }

  // Accordion Toggles
  const accordionItems = document.querySelectorAll('.nf-accordion-item');
  accordionItems.forEach(item => {
    const summary = item.querySelector('.nf-accordion-summary');
    if (summary) {
      summary.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });
});

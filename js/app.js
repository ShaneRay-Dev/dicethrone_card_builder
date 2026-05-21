// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  ui.updateUI();
  // Ensure default Action Cards + Main Phase assets apply on load
  renderer.applyAssetsForCardType(gameState.card.cardType, gameState.card.cardSubType);

  // Load shared card from URL hash first (if present), otherwise restore local autosave.
  let hasPreloadedCard = typeof ui.tryLoadCardFromUrlHash === 'function'
    ? ui.tryLoadCardFromUrlHash({ clearHash: true })
    : false;
  if (!hasPreloadedCard) {
    const savedCard = localStorage.getItem('diceThroneSavedCard');
    if (savedCard) {
      const loadedFromAutosave = gameState.fromJSON(savedCard) === true;
      if (loadedFromAutosave) {
        ui.updateUI();
        hasPreloadedCard = true;
      } else {
        // Drop invalid autosave payloads so startup can cleanly recover.
        localStorage.removeItem('diceThroneSavedCard');
      }
    }
    if (!hasPreloadedCard && typeof ui.applySavedDefaultsToState === 'function') {
      hasPreloadedCard = ui.applySavedDefaultsToState({ silent: true }) === true;
    }
    if (!hasPreloadedCard) {
      gameState.reset();
      ui.updateUI();
      if (typeof ui.scheduleRenderWarmup === 'function') {
        ui.scheduleRenderWarmup({ immediate: true });
      }
    }
  }

  let lastAutosaveRevision = typeof gameState.getRevision === 'function'
    ? gameState.getRevision()
    : -1;
  let autosavePending = false;

  const runAutosave = () => {
    autosavePending = false;
    const currentRevision = typeof gameState.getRevision === 'function'
      ? gameState.getRevision()
      : -1;
    if (currentRevision === lastAutosaveRevision) return;
    try {
      localStorage.setItem('diceThroneSavedCard', gameState.toJSON());
      lastAutosaveRevision = currentRevision;
    } catch (error) {
      console.warn('Autosave failed:', error);
    }
  };

  // Auto-save only when the card changed, and push the JSON work off the hot path.
  setInterval(() => {
    const currentRevision = typeof gameState.getRevision === 'function'
      ? gameState.getRevision()
      : -1;
    if (autosavePending || currentRevision === lastAutosaveRevision) return;
    autosavePending = true;
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(runAutosave, { timeout: 2000 });
    } else {
      setTimeout(runAutosave, 0);
    }
  }, 30000);

  // Header collapse toggle
  const headerCollapseKey = 'dtc_header_collapsed_v1';
  const headerEl = document.getElementById('mainHeader');
  const collapseBtn = document.getElementById('headerCollapseBtn');
  const collapseIcon = document.querySelector('.header-collapse-icon');

  if (headerEl && collapseBtn && collapseIcon) {
    // Restore collapsed state from localStorage
    const isCollapsed = localStorage.getItem(headerCollapseKey) === 'true';
    if (isCollapsed) {
      headerEl.classList.add('is-collapsed');
      collapseBtn.setAttribute('aria-expanded', 'false');
      collapseIcon.textContent = '+';
    } else {
      collapseBtn.setAttribute('aria-expanded', 'true');
      collapseIcon.textContent = '−';
    }

    // Handle collapse button click
    collapseBtn.addEventListener('click', () => {
      const wasCollapsed = headerEl.classList.contains('is-collapsed');
      if (wasCollapsed) {
        headerEl.classList.remove('is-collapsed');
        collapseBtn.setAttribute('aria-expanded', 'true');
        collapseIcon.textContent = '−';
        localStorage.setItem(headerCollapseKey, 'false');
      } else {
        headerEl.classList.add('is-collapsed');
        collapseBtn.setAttribute('aria-expanded', 'false');
        collapseIcon.textContent = '+';
        localStorage.setItem(headerCollapseKey, 'true');
      }
    });
  }

});


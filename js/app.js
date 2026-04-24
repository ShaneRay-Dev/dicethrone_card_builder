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

});


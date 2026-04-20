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

  // Auto-save to localStorage every 30 seconds
  setInterval(() => {
    localStorage.setItem('diceThroneSavedCard', gameState.toJSON());
  }, 30000);

});


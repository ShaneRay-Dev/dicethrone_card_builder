// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  ui.updateUI();
  // Ensure default Action Cards + Main Phase assets apply on load
  renderer.applyAssetsForCardType(gameState.card.cardType, gameState.card.cardSubType);

  // Load shared card from URL hash first (if present), otherwise restore local autosave.
  const loadedFromHash = typeof ui.tryLoadCardFromUrlHash === 'function'
    ? ui.tryLoadCardFromUrlHash({ clearHash: true })
    : false;
  if (!loadedFromHash) {
    const savedCard = localStorage.getItem('diceThroneSavedCard');
    if (savedCard) {
      gameState.fromJSON(savedCard);
      ui.updateUI();
    }
  }

  // Auto-save to localStorage every 30 seconds
  setInterval(() => {
    localStorage.setItem('diceThroneSavedCard', gameState.toJSON());
  }, 30000);

});


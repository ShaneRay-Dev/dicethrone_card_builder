// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  ui.updateUI();
  // Ensure default Action Cards + Main Phase assets apply on load
  renderer.applyAssetsForCardType(gameState.card.cardType, gameState.card.cardSubType);
  
  // Load saved card from localStorage if available
  const savedCard = localStorage.getItem('diceThroneSavedCard');
  if (savedCard) {
    gameState.fromJSON(savedCard);
    ui.updateUI();
  }

  // Auto-save to localStorage every 30 seconds
  setInterval(() => {
    localStorage.setItem('diceThroneSavedCard', gameState.toJSON());
  }, 30000);

  console.log('Dice Throne Creator initialized');
});


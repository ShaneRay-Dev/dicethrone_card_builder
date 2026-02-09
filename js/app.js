// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Set default card art image
  const defaultArtPath = 'Assets/images/Card Art/Common Loot.png';
  
  // Load default art into the card if no custom art is set
  if (!gameState.card.artData && !gameState.card.artUrl) {
    gameState.updateProperty('artUrl', defaultArtPath);
    gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
    renderer.setCardArt(defaultArtPath);
  }
  
  // Initialize the app
  ui.updateUI();
  // Ensure default Action Cards + Main Phase assets apply on load
  renderer.applyAssetsForCardType(gameState.card.cardType, gameState.card.cardSubType);
  
  // Load default reference image
  const referenceOverlay = document.getElementById('referenceOverlay');
  // make defaultReferencePath available globally for UI fallbacks
  window.defaultReferencePath = 'Assets/Reference/Transference_basic.png';
  const defaultReferencePath = window.defaultReferencePath;
  referenceOverlay.style.backgroundImage = `url('${defaultReferencePath}')`;
  referenceOverlay.style.backgroundSize = '100% 100%';
  referenceOverlay.style.backgroundRepeat = 'no-repeat';
  referenceOverlay.style.backgroundPosition = 'center';
  referenceOverlay.style.opacity = '0.7';
  // Also set side-by-side element if present
  const referenceSideEl = document.getElementById('referenceSide');
  if (referenceSideEl) {
    referenceSideEl.style.backgroundImage = `url('${defaultReferencePath}')`;
    referenceSideEl.style.backgroundSize = '100% 100%';
    referenceSideEl.style.backgroundRepeat = 'no-repeat';
    referenceSideEl.style.backgroundPosition = 'center';
    referenceSideEl.style.display = 'none';
  }
  
  // Update reference preview with default
  const referencePreview = document.getElementById('referencePreview');
  referencePreview.innerHTML = `<img src="${defaultReferencePath}" alt="Default Reference">`;
  
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


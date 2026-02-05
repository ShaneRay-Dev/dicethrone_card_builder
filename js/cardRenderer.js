// Card Rendering Logic
class CardRenderer {
  constructor() {
    this.previewElement = document.getElementById('cardPreview');
    
    // 8-layer architecture references
    this.bleedLayer = document.getElementById('bleedLayer');
    this.artworkLayer = document.getElementById('artworkLayer');
    this.bgLowerLayer = document.getElementById('backgroundLowerLayer');
    this.bgUpperLayer = document.getElementById('backgroundUpperLayer');
    this.imageFrameLayer = document.getElementById('imageFrameLayer');
    this.frameLayer = document.getElementById('frameLayer');
    this.panelLowerLayer = document.getElementById('panelLowerLayer');
    this.panelUpperLayer = document.getElementById('panelUpperLayer');
    
    this.assetManifest = null;
    this.loadAssetManifest();
  }

  async loadAssetManifest() {
    try {
      const response = await fetch('Assets/manifest.json');
      this.assetManifest = await response.json();
    } catch (error) {
      console.warn('Could not load asset manifest:', error);
      this.assetManifest = {};
    }
  }

  applyAssetsForCardType(cardType, cardSubType) {
    if (!this.assetManifest || !this.assetManifest[cardType] || !this.assetManifest[cardType][cardSubType]) {
      return;
    }

    const assets = this.assetManifest[cardType][cardSubType];

    // Apply frame as background image to frame layer
    if (assets.border && this.frameLayer) {
      this.frameLayer.style.backgroundImage = `url('${assets.border}')`;
    }

    // Apply background lower
    if (assets.backgroundLower && this.bgLowerLayer) {
      this.bgLowerLayer.style.backgroundImage = `url('${assets.backgroundLower}')`;
    }

    // Apply background upper
    if (assets.backgroundUpper && this.bgUpperLayer) {
      this.bgUpperLayer.style.backgroundImage = `url('${assets.backgroundUpper}')`;
    }

    // Apply image frame
    if (assets.imageFrame && this.imageFrameLayer) {
      this.imageFrameLayer.style.backgroundImage = `url('${assets.imageFrame}')`;
    }

    // Apply panel upper (title bar area)
    if (assets.panelUpper && this.panelUpperLayer) {
      this.panelUpperLayer.style.backgroundImage = `url('${assets.panelUpper}')`;
    }

    // Apply panel lower (text area)
    if (assets.panelLower && this.panelLowerLayer) {
      this.panelLowerLayer.style.backgroundImage = `url('${assets.panelLower}')`;
    }
  }

  render(card) {
    if (!card) return;

    // Update card inner background color/gradient
    this.updateCardStyle(card);

    // Update text content
    this.updateCardContent(card);

    // Apply assets based on card type/subtype
    this.applyAssetsForCardType(card.cardType, card.cardSubType);

    // Apply bleed layer settings
    this.updateBleed(card);
    // Apply element visibility toggles
    this.updateVisibility(card);
  }

  updateVisibility(card) {
    const layers = (card && card.layers) || {};

    // Border (Frame layer)
    if (this.frameLayer) {
      this.frameLayer.style.opacity = layers.border === false ? '0' : '1';
      this.frameLayer.style.pointerEvents = layers.border === false ? 'none' : 'auto';
    }

    // Title bar (Panel Upper layer)
    if (this.panelUpperLayer) {
      this.panelUpperLayer.style.opacity = layers.titleBar === false ? '0' : '1';
      this.panelUpperLayer.style.pointerEvents = layers.titleBar === false ? 'none' : 'auto';
    }

    // Artwork layer
    if (this.artworkLayer) {
      this.artworkLayer.style.opacity = layers.artwork === false ? '0' : '1';
      this.artworkLayer.style.pointerEvents = layers.artwork === false ? 'none' : 'auto';
    }

    // Bottom text (Panel Lower layer)
    if (this.panelLowerLayer) {
      this.panelLowerLayer.style.opacity = layers.bottomText === false ? '0' : '1';
      this.panelLowerLayer.style.pointerEvents = layers.bottomText === false ? 'none' : 'auto';
    }
  }

  updateBleed(card) {
    if (!this.bleedLayer) return;
    const bleed = card.bleed || { enabled: false, color: '#ffffff' };
    
    this.bleedLayer.style.setProperty('--bleed-color', bleed.color || '#ffffff');
    this.bleedLayer.style.backgroundColor = bleed.color || '#ffffff';
  }

  updateCardStyle(card) {
    // Styling is now applied per-layer via assets from manifest
    // No need for direct cardInner styling
  }

  updateCardContent(card) {
    // Update title (now on the draggable/editable element in Panel Upper)
    const titleEl = document.getElementById('cardTitleBar');
    if (titleEl) {
      titleEl.textContent = card.name || 'Card Name';
      
      // Apply saved position, default to top-left if not set
      const pos = card.titlePosition || { x: 0, y: 0 };
      titleEl.style.left = `${Math.max(0, pos.x)}px`;
      titleEl.style.top = `${Math.max(0, pos.y)}px`;
    }

    // Update description (in Panel Lower)
    const descElement = document.getElementById('previewDescription');
    if (descElement) {
      descElement.textContent = card.description || 'Card description goes here';
    }
  }

  applyBorder(card) {
    // Map card selections to border file names
    const borderMap = {
      'Hero Upgrade': {
        'Ability Upgrade': 'hero_upgrade_Ability.png',
        'Defense Upgrade': 'hero_upgrade_defense.png',
        'Passive Upgrade': 'hero_upgrade_Passive.png'
      },
      'Action Cards': {
        'Main Phase': 'Main_Phase_Base.png',
        'Instant': 'Instant_Phase_Base.png',
        'Roll Phase': 'Roll_Phase_Base.png'
      }
    };

    const borderFileName = borderMap[card.cardType]?.[card.cardSubType];
    if (borderFileName) {
      const borderPath = `Assets/Boarder/${borderFileName}`;
      this.cardInner.style.backgroundImage = `url('${borderPath}')`;
      this.cardInner.style.backgroundSize = 'cover';
      this.cardInner.style.backgroundPosition = 'center';
    }
  }

  updatePhaseAndType(card) {
    // Update phase icon based on card subtype
    const phaseIcon = document.getElementById('previewPhaseIcon');
    const phaseMap = {
      'Ability Upgrade': 'A',
      'Defense Upgrade': 'D',
      'Passive Upgrade': 'P',
      'Main Phase': 'M',
      'Instant': 'I',
      'Roll Phase': 'R'
    };
    
    if (phaseIcon) {
      phaseIcon.textContent = phaseMap[card.cardSubType] || 'M';
    }

    // Update card type label on right side
    const cardTypeLabel = document.getElementById('previewCardType');
    if (cardTypeLabel) {
      cardTypeLabel.textContent = card.cardType === 'Hero Upgrade' ? 'UPGRADE' : 'ACTION';
    }

    // Update cost display
    const costValue = document.getElementById('previewCost');
    if (costValue) {
      costValue.textContent = card.stats.health || '0';
    }
  }

  // Update single stat
  updateStat(statName, value) {
    const statMap = {
      health: 'previewCost',
      attack: 'previewAttack',
      defense: 'previewDefense',
      speed: 'previewSpeed',
      range: 'previewRange'
    };

    const elementId = statMap[statName];
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  // Update single text field
  updateTextField(fieldName, value) {
    const fieldMap = {
      name: 'previewName',
      description: 'previewDescription'
    };

    const elementId = fieldMap[fieldName];
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  // Add card art image
  setCardArt(imageUrl) {
    const artArea = document.getElementById('cardArtArea');
    if (!artArea) return;

    if (imageUrl) {
      artArea.innerHTML = `<img src="${imageUrl}" alt="Card Art">`;
    } else {
      artArea.innerHTML = '<div class="art-placeholder">Card Art</div>';
    }
  }

  // Export card as image (PNG)
  async exportAsImage() {
    try {
      // Check if html2canvas is available
      if (typeof html2canvas === 'undefined') {
        alert('Please include html2canvas library to export as image');
        return false;
      }

      const canvas = await html2canvas(this.previewElement, {
        backgroundColor: null,
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${gameState.card.name || 'card'}.png`;
      link.click();

      return true;
    } catch (error) {
      console.error('Error exporting image:', error);
      return false;
    }
  }
}

// Initialize renderer
const renderer = new CardRenderer();

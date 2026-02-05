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
    this.costBadgeLayer = document.getElementById('costBadgeLayer');
    this.panelUpperLayer = document.getElementById('panelUpperLayer');
    this.titleLayer = document.getElementById('titleLayer');
    this.cardTextLayer = document.getElementById('cardTextLayer');
    this.frameImageUrl = '';
    
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
      this.frameImageUrl = assets.border;
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
    this.updateArtTransform(card);

    // Apply assets based on card type/subtype
    this.applyAssetsForCardType(card.cardType, card.cardSubType);

    // Apply bleed layer settings
    this.updateBleed(card);
    // Apply element visibility toggles
    this.updateVisibility(card);

    // Apply cost badge
    this.updateCostBadge(card);

    // Apply art crop to frame
    this.updateArtCrop(card);
  }

  updateVisibility(card) {
    const layers = (card && card.layers) || {};

    const titleTextEl = document.getElementById('cardTitleBar');
    const cardTextEl = document.getElementById('previewDescription');

    const panelUpperVisible = layers.panelUpper ?? layers.titleBar;
    const panelLowerVisible = layers.panelLower ?? layers.bottomText;

    // Bleed layer
    if (this.bleedLayer) {
      this.bleedLayer.style.opacity = layers.bleed === false ? '0' : '1';
      this.bleedLayer.style.pointerEvents = layers.bleed === false ? 'none' : 'auto';
    }

    // Background lower
    if (this.bgLowerLayer) {
      this.bgLowerLayer.style.opacity = layers.backgroundLower === false ? '0' : '1';
      this.bgLowerLayer.style.pointerEvents = layers.backgroundLower === false ? 'none' : 'auto';
    }

    // Background upper
    if (this.bgUpperLayer) {
      this.bgUpperLayer.style.opacity = layers.backgroundUpper === false ? '0' : '1';
      this.bgUpperLayer.style.pointerEvents = layers.backgroundUpper === false ? 'none' : 'auto';
    }

    // Image frame
    if (this.imageFrameLayer) {
      this.imageFrameLayer.style.opacity = layers.imageFrame === false ? '0' : '1';
      this.imageFrameLayer.style.pointerEvents = layers.imageFrame === false ? 'none' : 'auto';
    }

    // Border (Frame layer)
    if (this.frameLayer) {
      this.frameLayer.style.opacity = layers.border === false ? '0' : '1';
      this.frameLayer.style.pointerEvents = layers.border === false ? 'none' : 'auto';
    }

    // Title bar (Panel Upper layer)
    if (this.panelUpperLayer) {
      this.panelUpperLayer.style.opacity = panelUpperVisible === false ? '0' : '1';
      this.panelUpperLayer.style.pointerEvents = panelUpperVisible === false ? 'none' : 'auto';
    }

    // Title text (on Panel Upper)
    if (titleTextEl) {
      titleTextEl.style.opacity = layers.titleText === false ? '0' : '1';
      titleTextEl.style.pointerEvents = layers.titleText === false ? 'none' : 'auto';
    }

    // Title layer (separate from Panel Upper)
    if (this.titleLayer) {
      this.titleLayer.style.opacity = layers.titleText === false ? '0' : '1';
      this.titleLayer.style.pointerEvents = layers.titleText === false ? 'none' : 'auto';
    }

    // Artwork layer
    if (this.artworkLayer) {
      this.artworkLayer.style.opacity = layers.artwork === false ? '0' : '1';
      this.artworkLayer.style.pointerEvents = layers.artwork === false ? 'none' : 'auto';
    }

    // Bottom text (Panel Lower layer)
    if (this.panelLowerLayer) {
      this.panelLowerLayer.style.opacity = panelLowerVisible === false ? '0' : '1';
      this.panelLowerLayer.style.pointerEvents = panelLowerVisible === false ? 'none' : 'auto';
    }

    // Cost badge layer
    if (this.costBadgeLayer) {
      this.costBadgeLayer.style.opacity = layers.costBadge === false ? '0' : '1';
      this.costBadgeLayer.style.pointerEvents = layers.costBadge === false ? 'none' : 'auto';
    }

    // Card text (inside Panel Lower)
    if (cardTextEl) {
      cardTextEl.style.opacity = layers.cardText === false ? '0' : '1';
      cardTextEl.style.pointerEvents = layers.cardText === false ? 'none' : 'auto';
    }

    // Card text layer (separate from Panel Lower)
    if (this.cardTextLayer) {
      this.cardTextLayer.style.opacity = layers.cardText === false ? '0' : '1';
      this.cardTextLayer.style.pointerEvents = layers.cardText === false ? 'none' : 'auto';
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
      
      const pos = card.cardTextPosition || { x: 0, y: 0 };
      descElement.style.left = `${Math.max(0, pos.x)}px`;
      descElement.style.top = `${Math.max(0, pos.y)}px`;
    }
  }

  updateArtTransform(card) {
    const artImage = document.getElementById('cardArtImage');
    if (!artImage) return;

    const transform = card.artTransform || { x: 0, y: 0, scale: 1 };
    const x = Number(transform.x) || 0;
    const y = Number(transform.y) || 0;
    const scale = Math.max(0.5, Math.min(3, Number(transform.scale) || 1));

    artImage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }
  updateCostBadge(card) {
    if (!this.costBadgeLayer) return;

    const value = Math.max(0, Math.min(5, Number(card?.costBadge?.value) || 0));
    const costMap = this.assetManifest?.CostBadge || {};
    const badgePath = costMap[String(value)];

    if (badgePath) {
      this.costBadgeLayer.style.backgroundImage = `url('${badgePath}')`;
    } else {
      this.costBadgeLayer.style.backgroundImage = '';
    }
  }

  updateArtCrop(card) {
    const artImage = document.getElementById('cardArtImage');
    if (!artImage) return;
    const enabled = !!card?.artCropToFrame;
    if (enabled && this.frameImageUrl) {
      artImage.classList.add('crop-to-frame');
      artImage.style.setProperty('--frame-mask', `url('${this.frameImageUrl}')`);
    } else {
      artImage.classList.remove('crop-to-frame');
      artImage.style.removeProperty('--frame-mask');
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
    const artImage = document.getElementById('cardArtImage');
    const artworkLayer = document.getElementById('artworkLayer');
    if (!artArea && !artImage && !artworkLayer) return;

    if (imageUrl) {
      if (artArea) artArea.innerHTML = '';
      if (artImage) {
        artImage.src = imageUrl;
        artImage.style.display = 'block';
      }
      if (artworkLayer) {
        artworkLayer.style.backgroundImage = '';
      }
    } else {
      if (artArea) artArea.innerHTML = '<div class="art-placeholder"></div>';
      if (artImage) {
        artImage.src = '';
        artImage.style.display = 'none';
      }
      if (artworkLayer) {
        artworkLayer.style.backgroundImage = '';
      }
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

      const card = gameState.getCard();
      const includeBleed = !!(card.export && card.export.includeBleed);

      // Bridge size @ 600 DPI
      // Cut size: 2.25" x 3.5" => 1350 x 2100
      // With bleed: 2.5" x 3.75" => 1500 x 2250
      const targetWidth = includeBleed ? 1500 : 1350;
      const targetHeight = includeBleed ? 2250 : 2100;

      const previewContainer = document.querySelector('.preview-container');
      const currentScale = parseFloat(
        getComputedStyle(previewContainer).getPropertyValue('--zoom-scale')
      ) || 1;
      const rect = this.previewElement.getBoundingClientRect();
      const exportScale = rect.height > 0 ? targetHeight / rect.height : 1;

      // Build an offscreen export clone so we can size it precisely
      const exportStage = document.createElement('div');
      exportStage.style.position = 'fixed';
      exportStage.style.left = '-100000px';
      exportStage.style.top = '0';
      exportStage.style.width = '0';
      exportStage.style.height = '0';
      exportStage.style.overflow = 'hidden';

      const exportClone = this.previewElement.cloneNode(true);
      exportClone.classList.add('export-card');
      if (!includeBleed) exportClone.classList.add('export-no-bleed');

      exportClone.style.setProperty('--zoom-scale', currentScale);
      exportClone.style.setProperty('--export-text-scale', currentScale);

      exportStage.appendChild(exportClone);
      document.body.appendChild(exportStage);

      const canvas = await html2canvas(exportClone, {
        backgroundColor: null,
        scale: exportScale,
        logging: false
      });

      document.body.removeChild(exportStage);

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

// UI Event Handlers
class UI {
  constructor() {
    this.cardNameInput = document.getElementById('cardName');
    this.cardDescInput = document.getElementById('cardDescription');
    this.cardTypeSelect = document.getElementById('cardType');
    this.cardSubTypeSelect = document.getElementById('cardSubType');

    this.imageUploadInput = document.getElementById('imageUpload');
    this.imagePreview = document.getElementById('imagePreview');
    this.btnClearImage = document.getElementById('btn-clear-image');

    this.referenceImageInput = document.getElementById('referenceImage');
    this.referencePreview = document.getElementById('referencePreview');
    this.showReferenceCheckbox = document.getElementById('showReference');
    this.showReferenceSideBySideCheckbox = document.getElementById('showReferenceSideBySide');
    this.referenceOverlay = document.getElementById('referenceOverlay');
    this.referenceSide = document.getElementById('referenceSide');

    this.toggleBleedLayer = document.getElementById('toggleBleedLayer');
    this.bleedColorInput = document.getElementById('bleedColor');
    this.toggleBorder = document.getElementById('toggleBorder');
    this.toggleTitleBar = document.getElementById('toggleTitleBar');
    this.toggleArtwork = document.getElementById('toggleArtwork');
    this.toggleBottomText = document.getElementById('toggleBottomText');

    this.cardTitleEl = document.getElementById('cardTitleBar');

    this.zoomSlider = document.getElementById('zoomSlider');
    this.zoomValue = document.getElementById('zoomValue');
    this.previewContainer = document.querySelector('.preview-container');
    this.previewElement = document.getElementById('cardPreview');

    this.btnNew = document.getElementById('btn-new');
    this.btnSave = document.getElementById('btn-save');
    this.btnLoad = document.getElementById('btn-load');
    this.btnExport = document.getElementById('btn-export');
    this.fileInput = document.getElementById('fileInput');

    this.initEventListeners();
  }

  initEventListeners() {
    // Card properties
    this.cardNameInput.addEventListener('input', (e) => {
      gameState.updateProperty('name', e.target.value);
      renderer.updateTextField('name', e.target.value);
    });

    this.cardDescInput.addEventListener('input', (e) => {
      gameState.updateProperty('description', e.target.value);
      renderer.updateTextField('description', e.target.value);
    });

    this.cardTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardType', e.target.value);
      this.updateSubTypeOptions(e.target.value);
      this.updateSubTypeLabel(e.target.value);
      renderer.applyAssetsForCardType(e.target.value, this.cardSubTypeSelect.value);
    });

    this.cardSubTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardSubType', e.target.value);
      renderer.applyAssetsForCardType(this.cardTypeSelect.value, e.target.value);
    });

    // Buttons
    this.btnNew.addEventListener('click', () => this.newCard());
    this.btnSave.addEventListener('click', () => this.saveCard());
    this.btnLoad.addEventListener('click', () => this.loadCard());
    this.btnExport.addEventListener('click', () => this.exportCard());

    // Image upload
    this.imageUploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
    this.btnClearImage.addEventListener('click', () => this.clearImage());

    // Reference overlay
    this.referenceImageInput.addEventListener('change', (e) => this.handleReferenceUpload(e));
    this.showReferenceCheckbox.addEventListener('change', (e) => this.toggleReferenceOverlay(e.target.checked));
    this.showReferenceSideBySideCheckbox.addEventListener('change', (e) => this.toggleReferenceSideBySide(e.target.checked));

    // Bleed layer controls
    if (this.toggleBleedLayer) {
      this.toggleBleedLayer.addEventListener('change', (e) => {
        gameState.updateProperty('bleed.enabled', e.target.checked);
        renderer.updateBleed(gameState.getCard());
      });
    }

    if (this.bleedColorInput) {
      this.bleedColorInput.addEventListener('input', (e) => {
        gameState.updateProperty('bleed.color', e.target.value);
        renderer.updateBleed(gameState.getCard());
      });
    }

    // Layer toggles for individual card elements
    if (this.toggleBorder) {
      this.toggleBorder.addEventListener('change', (e) => {
        gameState.updateProperty('layers.border', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTitleBar) {
      this.toggleTitleBar.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleBar', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleArtwork) {
      this.toggleArtwork.addEventListener('change', (e) => {
        gameState.updateProperty('layers.artwork', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBottomText) {
      this.toggleBottomText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomText', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    // Title bar drag and edit handlers
    if (this.cardTitleEl) {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      this.cardTitleEl.addEventListener('dragstart', (e) => {
        isDragging = true;
        this.cardTitleEl.classList.add('dragging');
        const rect = this.cardTitleEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.dataTransfer.effectAllowed = 'move';
      });

      this.cardTitleEl.addEventListener('dragend', (e) => {
        isDragging = false;
        this.cardTitleEl.classList.remove('dragging');
      });

      this.previewElement.addEventListener('dragover', (e) => {
        if (isDragging) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      });

      this.previewElement.addEventListener('drop', (e) => {
        if (isDragging) {
          e.preventDefault();
          const cardRect = this.previewElement.getBoundingClientRect();
          const newX = e.clientX - cardRect.left - offsetX;
          const newY = e.clientY - cardRect.top - offsetY;
          
          // Clamp position to stay within card bounds with padding
          const clampedX = Math.max(0, Math.min(newX, cardRect.width - 80));
          const clampedY = Math.max(0, Math.min(newY, cardRect.height - 30));
          
          this.cardTitleEl.style.left = `${clampedX}px`;
          this.cardTitleEl.style.top = `${clampedY}px`;
          
          // Update state with new position
          gameState.updateProperty('titlePosition', { x: clampedX, y: clampedY });
        }
      });

      this.cardTitleEl.addEventListener('input', (e) => {
        gameState.updateProperty('name', this.cardTitleEl.textContent);
      });

      this.cardTitleEl.addEventListener('blur', (e) => {
        gameState.updateProperty('name', this.cardTitleEl.textContent);
      });
    }

    // Zoom slider
    this.zoomSlider.addEventListener('input', (e) => this.handleZoom(e.target.value));

    // Drag and drop
    this.imagePreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.imagePreview.classList.add('dragover');
    });

    this.imagePreview.addEventListener('dragleave', () => {
      this.imagePreview.classList.remove('dragover');
    });

    this.imagePreview.addEventListener('drop', (e) => {
      e.preventDefault();
      this.imagePreview.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.imageUploadInput.files = files;
        this.handleImageUpload({ target: { files } });
      }
    });

    // Templates removed

    // File input
    this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          this.saveCard();
        }
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          this.undo();
        }
        if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          this.redo();
        }
      }
    });
  }

  newCard() {
    if (confirm('Create a new card? This will clear the current card.')) {
      gameState.reset();
      this.updateUI();
      alert('New card created!');
    }
  }

  saveCard() {
    const json = gameState.toJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameState.card.name || 'card'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Card saved!');
  }

  loadCard() {
    this.fileInput.click();
  }

  exportCard() {
    const exportOptions = prompt(
      'Export as:\n1 - JSON (for saving)\n2 - Image (PNG)\n3 - Copy JSON to clipboard',
      '1'
    );

    switch (exportOptions) {
      case '1':
        this.saveCard();
        break;
      case '2':
        renderer.exportAsImage();
        break;
      case '3':
        navigator.clipboard.writeText(gameState.toJSON()).then(() => {
          alert('Card JSON copied to clipboard!');
        });
        break;
      default:
        break;
    }
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      if (gameState.fromJSON(json)) {
        this.updateUI();
        alert('Card loaded successfully!');
      } else {
        alert('Failed to load card. Invalid JSON format.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    this.fileInput.value = '';
  }

  // Templates removed

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      gameState.updateProperty('artData', imageData);
      
      // Display preview
      this.imagePreview.innerHTML = `<img src="${imageData}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      
      // Update card preview
      renderer.setCardArt(imageData);
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    gameState.updateProperty('artData', null);
    this.imageUploadInput.value = '';
    this.imagePreview.innerHTML = '';
    this.btnClearImage.style.display = 'none';
    renderer.setCardArt(null);
  }

  handleReferenceUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      
      // Display preview
      this.referencePreview.innerHTML = `<img src="${imageData}" alt="Reference">`;
      
      // Set overlay image with proper styling
      this.referenceOverlay.style.backgroundImage = `url('${imageData}')`;
      this.referenceOverlay.style.backgroundSize = 'contain';
      this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
      this.referenceOverlay.style.backgroundPosition = 'center';
      
      // Also update the side-by-side pseudo-element
      const style = document.documentElement.style;
      style.setProperty('--reference-image', `url('${imageData}')`);

      // Update the real side element if present
      if (this.referenceSide) {
        this.referenceSide.style.backgroundImage = `url('${imageData}')`;
        this.referenceSide.style.backgroundSize = 'cover';
        this.referenceSide.style.backgroundRepeat = 'no-repeat';
        this.referenceSide.style.backgroundPosition = 'center';
      }

      // Show the overlay if checkbox is already checked
      if (this.showReferenceCheckbox.checked) {
        this.referenceOverlay.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  toggleReferenceOverlay(show) {
    if (show) {
      // If the overlay has no inline image, try to fall back to CSS var or default
      let bg = this.referenceOverlay.style.backgroundImage;
      if (!bg || bg === 'none' || bg === '') {
        // Try CSS variable set on :root
        const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--reference-image').trim();
        if (cssVar && cssVar !== 'none') {
          this.referenceOverlay.style.backgroundImage = cssVar;
          bg = cssVar;
        }
      }

      // If still no image, try the default asset path (safe fallback)
      if ((!bg || bg === 'none' || bg === '') && typeof window.defaultReferencePath !== 'undefined') {
        this.referenceOverlay.style.backgroundImage = `url('${window.defaultReferencePath}')`;
      }

      // Ensure sizing properties
      this.referenceOverlay.style.backgroundSize = 'contain';
      this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
      this.referenceOverlay.style.backgroundPosition = 'center';

      this.referenceOverlay.style.display = 'block';
      // Uncheck side-by-side if overlay is shown
      if (this.showReferenceSideBySideCheckbox) this.showReferenceSideBySideCheckbox.checked = false;
      this.previewContainer.classList.remove('side-by-side');
    } else {
      this.referenceOverlay.style.display = 'none';
    }
  }

  toggleReferenceSideBySide(show) {
    if (show) {
      // Hide overlay when showing side-by-side
      this.referenceOverlay.style.display = 'none';
      this.showReferenceCheckbox.checked = false;
      this.previewContainer.classList.add('side-by-side');
      if (this.referenceSide) this.referenceSide.style.display = 'block';
    } else {
      this.previewContainer.classList.remove('side-by-side');
      if (this.referenceSide) this.referenceSide.style.display = 'none';
    }
  }

  handleZoom(value) {
    const zoomScale = value / 100;
    this.zoomValue.textContent = value;
    this.previewContainer.style.setProperty('--zoom-scale', zoomScale);
  }

  updateUI() {
    const card = gameState.getCard();

    // Update inputs
    this.cardNameInput.value = card.name;
    this.cardDescInput.value = card.description;
    this.cardTypeSelect.value = card.cardType;
    this.updateSubTypeLabel(card.cardType);
    this.updateSubTypeOptions(card.cardType);
    this.cardSubTypeSelect.value = card.cardSubType;

    // Update image preview
    if (card.artData) {
      this.imagePreview.innerHTML = `<img src="${card.artData}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
    } else {
      this.imagePreview.innerHTML = '';
      this.btnClearImage.style.display = 'none';
    }

    // Update renderer
    renderer.render(card);

    // Update bleed UI
    if (this.toggleBleedLayer) this.toggleBleedLayer.checked = !!(card.bleed && card.bleed.enabled);
    if (this.bleedColorInput) this.bleedColorInput.value = (card.bleed && card.bleed.color) || '#ffffff';

    // Update element layer toggles
    if (this.toggleBorder) this.toggleBorder.checked = !!(card.layers && card.layers.border);
    if (this.toggleTitleBar) this.toggleTitleBar.checked = !!(card.layers && card.layers.titleBar);
    if (this.toggleArtwork) this.toggleArtwork.checked = !!(card.layers && card.layers.artwork);
    if (this.toggleBottomText) this.toggleBottomText.checked = !!(card.layers && card.layers.bottomText);

    // Templates removed
  }
  updateSubTypeOptions(cardType) {
    const subTypeOptions = {
      'Hero Upgrade': [
        'Ability Upgrade',
        'Defense Upgrade',
        'Passive Upgrade'
      ],
      'Action Cards': [
        'Main Phase',
        'Instant',
        'Roll Phase'
      ]
    };

    const options = subTypeOptions[cardType] || [];
    this.cardSubTypeSelect.innerHTML = '';
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      this.cardSubTypeSelect.appendChild(optionElement);
    });

    // Set the first option as selected
    if (options.length > 0) {
      this.cardSubTypeSelect.value = options[0];
      gameState.updateProperty('cardSubType', options[0]);
    }
  }

  updateSubTypeLabel(cardType) {
    const label = document.getElementById('cardSubTypeLabel');
    if (label) {
      label.textContent = cardType === 'Action Cards' ? 'Card Phase' : 'Upgrade Type';
    }
  }
  undo() {
    if (gameState.undo()) {
      this.updateUI();
    }
  }

  redo() {
    if (gameState.redo()) {
      this.updateUI();
    }
  }
}

// Initialize UI
const ui = new UI();

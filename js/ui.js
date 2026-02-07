// UI Event Handlers
class UI {
  constructor() {
    this.cardNameInput = document.getElementById('cardName');
    this.cardDescInput = document.getElementById('cardDescription');
    this.cardTypeSelect = document.getElementById('cardType');
    this.cardSubTypeSelect = document.getElementById('cardSubType');
    this.costSelect = document.getElementById('costSelect');

    this.imageUploadInput = document.getElementById('imageUpload');
    this.imagePreview = document.getElementById('imagePreview');
    this.btnClearImage = document.getElementById('btn-clear-image');
    this.artSelect = document.getElementById('artSelect');
    this.btnCropArt = document.getElementById('btn-crop-art');

    this.referenceImageInput = document.getElementById('referenceImage');
    this.referencePreview = document.getElementById('referencePreview');
    this.showReferenceCheckbox = document.getElementById('showReference');
    this.showReferenceSideBySideCheckbox = document.getElementById('showReferenceSideBySide');
    this.referenceOverlay = document.getElementById('referenceOverlay');
    this.referenceSide = document.getElementById('referenceSide');

    this.toggleExportBleed = document.getElementById('toggleExportBleed');

    this.toggleBleedLayer = document.getElementById('toggleBleedLayer');
    this.toggleBackgroundLower = document.getElementById('toggleBackgroundLower');
    this.toggleBackgroundUpper = document.getElementById('toggleBackgroundUpper');
    this.toggleImageFrame = document.getElementById('toggleImageFrame');
    this.toggleFrameShading = document.getElementById('toggleFrameShading');
    this.bleedColorInput = document.getElementById('bleedColor');
    this.toggleBorder = document.getElementById('toggleBorder');
    this.toggleTitleBar = document.getElementById('toggleTitleBar');
    this.toggleTitleText = document.getElementById('toggleTitleText');
    this.toggleArtwork = document.getElementById('toggleArtwork');
    this.togglePanelBleed = document.getElementById('togglePanelBleed');
    this.toggleBottomText = document.getElementById('toggleBottomText');
    this.toggleCostBadge = document.getElementById('toggleCostBadge');
    this.toggleAttackModifier = document.getElementById('toggleAttackModifier');
    this.toggleCardText = document.getElementById('toggleCardText');

    this.cardTitleEl = document.getElementById('cardTitleBar');
    this.cardTextEl = null;
    this.artworkLayer = document.getElementById('artworkLayer');
    this.artImage = document.getElementById('cardArtImage');
    this.descriptionImageLayer = document.getElementById('descriptionImageLayer');

    this.zoomSlider = document.getElementById('zoomSlider');
    this.zoomValue = document.getElementById('zoomValue');
    this.previewContainer = document.querySelector('.preview-container');
    this.previewElement = document.getElementById('cardPreview');
    this.panelLowerLayer = document.getElementById('panelLowerLayer');

    this.btnNew = document.getElementById('btn-new');
    this.btnSave = document.getElementById('btn-save');
    this.btnLoad = document.getElementById('btn-load');
    this.btnExport = document.getElementById('btn-export');
    this.btnResetCanvas = document.getElementById('btn-reset-canvas');
    this.fileInput = document.getElementById('fileInput');

    this.initEventListeners();
    this.loadCardArtOptions();
  }

  initEventListeners() {
    // Card properties

    if (this.cardNameInput) {
      this.cardNameInput.addEventListener('input', (e) => {
        gameState.updateProperty('name', e.target.value);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    this.cardDescInput.addEventListener('input', (e) => {
      gameState.updateProperty('description', e.target.value);
      renderer.updateCardContent(gameState.getCard());
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

    if (this.costSelect) {
      this.costSelect.addEventListener('change', (e) => {
        const value = Math.max(0, Math.min(5, Number(e.target.value) || 0));
        gameState.updateProperty('costBadge.value', value);
        renderer.updateCostBadge(gameState.getCard());
      });
    }


    // Buttons
    this.btnNew.addEventListener('click', () => this.newCard());
    this.btnSave.addEventListener('click', () => this.saveCard());
    this.btnLoad.addEventListener('click', () => this.loadCard());
    this.btnExport.addEventListener('click', () => this.exportCard());
    if (this.btnResetCanvas) {
      this.btnResetCanvas.addEventListener('click', () => this.resetCanvas());
    }

    // Image upload
    this.imageUploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
    this.btnClearImage.addEventListener('click', () => this.clearImage());
    if (this.artSelect) {
      this.artSelect.addEventListener('change', (e) => this.handleArtSelect(e));
    }
    if (this.btnCropArt) {
      this.btnCropArt.addEventListener('click', () => this.cropArtToFrame());
    }

    // Reference overlay
    this.referenceImageInput.addEventListener('change', (e) => this.handleReferenceUpload(e));
    this.showReferenceCheckbox.addEventListener('change', (e) => this.toggleReferenceOverlay(e.target.checked));
    this.showReferenceSideBySideCheckbox.addEventListener('change', (e) => this.toggleReferenceSideBySide(e.target.checked));

    // Export settings
    if (this.toggleExportBleed) {
      this.toggleExportBleed.addEventListener('change', (e) => {
        gameState.updateProperty('export.includeBleed', e.target.checked);
      });
    }

    // Bleed layer controls
    if (this.toggleBleedLayer) {
      this.toggleBleedLayer.addEventListener('change', (e) => {
        gameState.updateProperty('bleed.enabled', e.target.checked);
        gameState.updateProperty('layers.bleed', e.target.checked);
        renderer.updateBleed(gameState.getCard());
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.bleedColorInput) {
      this.bleedColorInput.addEventListener('input', (e) => {
        gameState.updateProperty('bleed.color', e.target.value);
        renderer.updateBleed(gameState.getCard());
      });
    }

    // Layer toggles for individual card elements
    if (this.toggleBackgroundLower) {
      this.toggleBackgroundLower.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundLower', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBackgroundUpper) {
      this.toggleBackgroundUpper.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundUpper', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleImageFrame) {
      this.toggleImageFrame.addEventListener('change', (e) => {
        gameState.updateProperty('layers.imageFrame', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleFrameShading) {
      this.toggleFrameShading.addEventListener('change', (e) => {
        gameState.updateProperty('layers.frameShading', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBorder) {
      this.toggleBorder.addEventListener('change', (e) => {
        gameState.updateProperty('layers.border', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTitleBar) {
      this.toggleTitleBar.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleBar', e.target.checked);
        gameState.updateProperty('layers.panelUpper', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTitleText) {
      this.toggleTitleText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleText', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }


    if (this.toggleArtwork) {
      this.toggleArtwork.addEventListener('change', (e) => {
        gameState.updateProperty('layers.artwork', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.togglePanelBleed) {
      this.togglePanelBleed.addEventListener('change', (e) => {
        gameState.updateProperty('layers.panelBleed', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBottomText) {
      this.toggleBottomText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomText', e.target.checked);
        gameState.updateProperty('layers.panelLower', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleCostBadge) {
      this.toggleCostBadge.addEventListener('change', (e) => {
        gameState.updateProperty('layers.costBadge', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleAttackModifier) {
      this.toggleAttackModifier.addEventListener('change', (e) => {
        gameState.updateProperty('layers.attackModifier', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleCardText) {
      this.toggleCardText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardText', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }


    // Description + Title are rendered as images; use identical drag behavior.
    if (this.descriptionImageLayer || this.cardTitleEl) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let startPos = { x: 0, y: 0 };
      let activeTarget = null;
      let dragScale = 1;

      const setActiveTarget = (target) => {
        activeTarget = target;
        if (this.artworkLayer) {
          this.artworkLayer.classList.toggle('active', target === 'art');
        }
        if (this.descriptionImageLayer) {
          this.descriptionImageLayer.classList.toggle('active', target === 'description');
        }
        if (this.cardTitleEl) {
          this.cardTitleEl.classList.toggle('active', target === 'title');
        }
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const scale = dragScale || 1;
        const newX = startPos.x + dx / scale;
        const newY = startPos.y + dy / scale;
        if (activeTarget === 'description') {
          gameState.updateProperty('descriptionPosition', { x: newX, y: newY });
          renderer.updateDescriptionImage(gameState.getCard());
        } else if (activeTarget === 'title') {
          gameState.updateProperty('titlePosition', { x: newX, y: newY });
          renderer.updateTitleImage(gameState.getCard());
        }
      };

      const onUp = () => {
        if (!isDragging) return;
        isDragging = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (this.previewElement && this.previewElement.hasPointerCapture?.(pointerId)) {
          this.previewElement.releasePointerCapture(pointerId);
        }
      };

      let pointerId = null;
      const startTextDrag = (targetKey, textKey, positionKey, e) => {
        if (!gameState.getCard()[textKey]) return false;
        e.preventDefault();
        e.stopPropagation();
        setActiveTarget(targetKey);
        isDragging = true;
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = gameState.getCard()[positionKey] || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        pointerId = e.pointerId;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        if (this.previewElement && Number.isFinite(pointerId)) {
          this.previewElement.setPointerCapture(pointerId);
        }
        return true;
      };

      const hitTest = (el, e) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      };

      if (this.previewElement) {
        this.previewElement.style.touchAction = 'none';
        this.previewElement.addEventListener('pointerdown', (e) => {
          if (this.artworkLayer && this.artworkLayer.contains(e.target)) return;

          if (hitTest(this.cardTitleEl, e)) {
            startTextDrag('title', 'name', 'titlePosition', e);
            return;
          }
          if (hitTest(this.descriptionImageLayer, e)) {
            startTextDrag('description', 'description', 'descriptionPosition', e);
            return;
          }
          setActiveTarget(null);
        });
      }

      // Artwork drag and scale (click to activate)
      if (this.artworkLayer) {
        let artDragging = false;
        let artStartX = 0;
        let artStartY = 0;
        let artStartPos = { x: 0, y: 0 };

        const startArtDrag = (e) => {
          if (!this.artImage || !this.artImage.src) return;
          if (this.descriptionImageLayer && this.descriptionImageLayer.contains(e.target)) return;
          setActiveTarget('art');
          artDragging = true;
          this.artworkLayer.classList.add('dragging');
          artStartX = e.clientX;
          artStartY = e.clientY;
          const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
          artStartPos = { x: current.x || 0, y: current.y || 0 };
          window.addEventListener('mousemove', onArtMove);
          window.addEventListener('mouseup', onArtUp);
        };

        const onArtMove = (e) => {
          if (!artDragging || activeTarget !== 'art') return;
          const dx = e.clientX - artStartX;
          const dy = e.clientY - artStartY;
          const newX = artStartPos.x + dx;
          const newY = artStartPos.y + dy;
          gameState.updateProperty('artCroppedData', null);
          gameState.updateProperty('artTransform', {
            ...gameState.getCard().artTransform,
            x: newX,
            y: newY
          });
          renderer.updateArtTransform(gameState.getCard());
        };

        const onArtUp = () => {
          if (!artDragging) return;
          artDragging = false;
          this.artworkLayer.classList.remove('dragging');
          window.removeEventListener('mousemove', onArtMove);
          window.removeEventListener('mouseup', onArtUp);
        };

        this.artworkLayer.addEventListener('mousedown', (e) => {
          if (!this.artImage || !this.artImage.src) return;
          e.stopPropagation();
          startArtDrag(e);
        });

        this.artworkLayer.addEventListener('wheel', (e) => {
          if (!this.artImage || !this.artImage.src) return;
          if (activeTarget !== 'art') return;
          e.preventDefault();
          const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
          const delta = e.deltaY > 0 ? -0.05 : 0.05;
          const nextScale = Math.max(0.5, Math.min(3, (current.scale || 1) + delta));
          gameState.updateProperty('artCroppedData', null);
          gameState.updateProperty('artTransform', {
            ...current,
            scale: nextScale
          });
          renderer.updateArtTransform(gameState.getCard());
        }, { passive: false });

        if (this.previewElement) {
          this.previewElement.addEventListener('mousedown', (e) => {
            if (!this.artImage || !this.artImage.src) return;
            if (this.cardTitleEl && this.cardTitleEl.contains(e.target)) return;
            if (this.cardTextEl && this.cardTextEl.contains(e.target)) return;
            if (this.descriptionImageLayer && this.descriptionImageLayer.contains(e.target)) return;
            if (e.target && e.target.isContentEditable) return;
            const rect = this.artworkLayer.getBoundingClientRect();
            const inside =
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom;
            if (inside) {
              startArtDrag(e);
            }
          });

          this.previewElement.addEventListener('wheel', (e) => {
            if (!this.artImage || !this.artImage.src) return;
            if (activeTarget !== 'art') return;
            e.preventDefault();
            const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            const nextScale = Math.max(0.5, Math.min(3, (current.scale || 1) + delta));
            gameState.updateProperty('artCroppedData', null);
            gameState.updateProperty('artTransform', {
              ...current,
              scale: nextScale
            });
            renderer.updateArtTransform(gameState.getCard());
          }, { passive: false });
        }

        document.addEventListener('mousedown', (e) => {
          if (!this.artImage || !this.artImage.src) return;
          if (this.artworkLayer.contains(e.target)) return;
          if (this.cardTitleEl && this.cardTitleEl.contains(e.target)) return;
          if (this.descriptionImageLayer && this.descriptionImageLayer.contains(e.target)) return;
          const rect = this.artworkLayer.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (inside) return;
          setActiveTarget(null);
        });
      }
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

    // Artwork edit (Alt + drag / Alt + wheel) from anywhere on the card
    if (this.previewElement) {
      let isAltDragging = false;
      let startX = 0;
      let startY = 0;
      let startPos = { x: 0, y: 0 };

      const onAltMove = (e) => {
        if (!isAltDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newX = startPos.x + dx;
        const newY = startPos.y + dy;
        gameState.updateProperty('artTransform', {
          ...gameState.getCard().artTransform,
          x: newX,
          y: newY
        });
        renderer.updateArtTransform(gameState.getCard());
      };

      const onAltUp = () => {
        if (!isAltDragging) return;
        isAltDragging = false;
        window.removeEventListener('mousemove', onAltMove);
        window.removeEventListener('mouseup', onAltUp);
      };

      this.previewElement.addEventListener('mousedown', (e) => {
        if (!e.altKey) return;
        if (!this.artImage || !this.artImage.src) return;
        isAltDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        window.addEventListener('mousemove', onAltMove);
        window.addEventListener('mouseup', onAltUp);
      });

      this.previewElement.addEventListener('wheel', (e) => {
        if (!e.altKey) return;
        if (!this.artImage || !this.artImage.src) return;
        e.preventDefault();
        const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const nextScale = Math.max(0.5, Math.min(3, (current.scale || 1) + delta));
        gameState.updateProperty('artTransform', {
          ...current,
          scale: nextScale
        });
        renderer.updateArtTransform(gameState.getCard());
      }, { passive: false });
    }

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
      gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
      gameState.updateProperty('artCropToFrame', false);
      
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
    gameState.updateProperty('artUrl', null);
    this.imageUploadInput.value = '';
    this.imagePreview.innerHTML = '';
    this.btnClearImage.style.display = 'none';
    renderer.setCardArt(null);
  }

  resetCanvas() {
    if (confirm('Reset the canvas to defaults? This will reset text, images, and positions.')) {
      gameState.reset();
      this.updateUI();
    }
  }

  handleArtSelect(event) {
    const value = event.target.value || '';
    gameState.updateProperty('artUrl', value);
    gameState.updateProperty('artData', null);
    gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
    gameState.updateProperty('artCropToFrame', false);
    if (value) {
      renderer.setCardArt(value);
      this.imagePreview.innerHTML = `<img src="${value}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
    } else {
      this.imagePreview.innerHTML = '';
      this.btnClearImage.style.display = 'none';
      renderer.setCardArt(null);
    }
  }

  cropArtToFrame() {
    const card = gameState.getCard();
    if (!card.artData && !card.artUrl) return;
    gameState.updateProperty('artCropToFrame', true);
    renderer.ensureArtMask(renderer.imageFrameUrl, renderer.frameImageUrl);
    renderer.updateArtCrop(gameState.getCard());
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
      this.referenceOverlay.style.backgroundSize = '100% 100%';
      this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
      this.referenceOverlay.style.backgroundPosition = 'center';
      
      // Also update the side-by-side pseudo-element
      const style = document.documentElement.style;
      style.setProperty('--reference-image', `url('${imageData}')`);

      // Update the real side element if present
      if (this.referenceSide) {
        this.referenceSide.style.backgroundImage = `url('${imageData}')`;
        this.referenceSide.style.backgroundSize = '100% 100%';
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
      this.referenceOverlay.style.backgroundSize = '100% 100%';
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
    renderer.updateTitleImage(gameState.getCard());
    renderer.updateDescriptionImage(gameState.getCard());
  }

  getPreviewScale() {
    const baseRaw = this.previewContainer
      ? getComputedStyle(this.previewContainer).getPropertyValue('--card-width')
      : '';
    const baseWidth = parseFloat(baseRaw) || 520;
    const currentWidth = this.previewElement ? this.previewElement.clientWidth : baseWidth;
    if (!baseWidth || !currentWidth) return 1;
    return currentWidth / baseWidth;
  }

  updateUI() {
    let card = gameState.getCard();
    const scale = this.getPreviewScale();
    if (card.positionUnits !== 'base') {
      const updates = { positionUnits: 'base' };
      if (card.titlePosition) {
        updates.titlePosition = {
          x: (Number(card.titlePosition.x) || 0) / scale,
          y: (Number(card.titlePosition.y) || 0) / scale
        };
      }
      if (card.descriptionPosition) {
        updates.descriptionPosition = {
          x: (Number(card.descriptionPosition.x) || 0) / scale,
          y: (Number(card.descriptionPosition.y) || 0) / scale
        };
      }
      gameState.updateProperties(updates);
      card = gameState.getCard();
    }

    // Update inputs
    if (this.cardNameInput) this.cardNameInput.value = card.name;
    this.cardDescInput.value = card.description;
    this.cardTypeSelect.value = card.cardType;
    this.updateSubTypeLabel(card.cardType);
    this.updateSubTypeOptions(card.cardType);
    this.cardSubTypeSelect.value = card.cardSubType;

    if (this.costSelect) {
      this.costSelect.value = String(Math.max(0, Math.min(5, Number(card?.costBadge?.value) || 0)));
    }


    // Update image preview
    if (card.artData) {
      if (!card.artTransform) {
        gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
      }
      if (card.artCropToFrame === undefined) {
        gameState.updateProperty('artCropToFrame', false);
      }
      this.imagePreview.innerHTML = `<img src="${card.artData}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      if (this.artSelect) this.artSelect.value = '';
      renderer.setCardArt(card.artData);
      renderer.updateArtCrop(card);
    } else if (card.artUrl) {
      if (!card.artTransform) {
        gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
      }
      if (card.artCropToFrame === undefined) {
        gameState.updateProperty('artCropToFrame', false);
      }
      this.imagePreview.innerHTML = `<img src="${card.artUrl}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      if (this.artSelect) this.artSelect.value = card.artUrl;
      renderer.setCardArt(card.artUrl);
      renderer.updateArtCrop(card);
    } else {
      this.imagePreview.innerHTML = '';
      this.btnClearImage.style.display = 'none';
      if (this.artSelect) this.artSelect.value = '';
      renderer.setCardArt(null);
      renderer.updateArtCrop(card);
    }

    if (!card.titlePosition) {
      gameState.updateProperty('titlePosition', { x: 0, y: 0 });
    }
    if (!card.descriptionPosition) {
      gameState.updateProperty('descriptionPosition', { x: 0, y: 0 });
    }

    // Update renderer
    renderer.render(card);

    // Update export settings
    if (this.toggleExportBleed) {
      this.toggleExportBleed.checked = !!(card.export && card.export.includeBleed);
    }

    // Update bleed UI
    if (this.toggleBleedLayer) this.toggleBleedLayer.checked = !!(card.bleed && card.bleed.enabled);
    if (this.bleedColorInput) this.bleedColorInput.value = (card.bleed && card.bleed.color) || '#ffffff';

    // Update element layer toggles
    if (this.toggleBackgroundLower) this.toggleBackgroundLower.checked = !!(card.layers && card.layers.backgroundLower);
    if (this.toggleBackgroundUpper) this.toggleBackgroundUpper.checked = !!(card.layers && card.layers.backgroundUpper);
    if (this.toggleImageFrame) this.toggleImageFrame.checked = !!(card.layers && card.layers.imageFrame);
    if (this.toggleFrameShading) this.toggleFrameShading.checked = !!(card.layers && card.layers.frameShading);
    if (this.toggleBorder) this.toggleBorder.checked = !!(card.layers && card.layers.border);
    if (this.toggleTitleBar) {
      const panelUpper = card.layers && (card.layers.panelUpper ?? card.layers.titleBar);
      this.toggleTitleBar.checked = !!panelUpper;
    }
    if (this.toggleTitleText) this.toggleTitleText.checked = !!(card.layers && card.layers.titleText);
    if (this.toggleArtwork) this.toggleArtwork.checked = !!(card.layers && card.layers.artwork);
    if (this.togglePanelBleed) this.togglePanelBleed.checked = !!(card.layers && card.layers.panelBleed);
    if (this.toggleBottomText) {
      const panelLower = card.layers && (card.layers.panelLower ?? card.layers.bottomText);
      this.toggleBottomText.checked = !!panelLower;
    }
    if (this.toggleCostBadge) this.toggleCostBadge.checked = !!(card.layers && card.layers.costBadge);
    if (this.toggleAttackModifier) this.toggleAttackModifier.checked = !!(card.layers && card.layers.attackModifier);
    if (this.toggleCardText) this.toggleCardText.checked = !!(card.layers && card.layers.cardText);

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

  async loadCardArtOptions() {
    if (!this.artSelect) return;
    try {
      const response = await fetch('Assets/manifest.json');
      const manifest = await response.json();
      const artMap = manifest.CardArt || {};
      Object.entries(artMap).forEach(([label, path]) => {
        const opt = document.createElement('option');
        opt.value = path;
        opt.textContent = label;
        this.artSelect.appendChild(opt);
      });
    } catch (error) {
      console.warn('Could not load card art options:', error);
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

// UI Event Handlers
class UI {
  constructor() {
    this.cardNameInput = document.getElementById('cardName');
    this.cardIdInput = document.getElementById('cardIdInput');
    this.cardDescInput = document.getElementById('cardDescription');
    this.cardIdFontSizeInput = document.getElementById('cardIdFontSize');
    this.cardIdFontSizeValue = document.getElementById('cardIdFontSizeValue');
    this.cardIdPositionXInput = document.getElementById('cardIdPositionX');
    this.cardIdPositionXValue = document.getElementById('cardIdPositionXValue');
    this.cardIdPositionYInput = document.getElementById('cardIdPositionY');
    this.cardIdPositionYValue = document.getElementById('cardIdPositionYValue');
    this.titleFontSelect = document.getElementById('titleFontSelect');
    this.descriptionFontSelect = document.getElementById('descriptionFontSelect');
    this.titleFontSizeInput = document.getElementById('titleFontSize');
    this.descriptionFontSizeInput = document.getElementById('descriptionFontSize');
    this.descriptionLineHeightInput = document.getElementById('descriptionLineHeight');
    this.descriptionLineHeightValue = document.getElementById('descriptionLineHeightValue');
    this.titleLetterSpacingInput = document.getElementById('titleLetterSpacing');
    this.descriptionLetterSpacingInput = document.getElementById('descriptionLetterSpacing');
    this.titleLetterSpacingValue = document.getElementById('titleLetterSpacingValue');
    this.descriptionLetterSpacingValue = document.getElementById('descriptionLetterSpacingValue');
    this.defaultTitleFont = 'PhosphateSolid';
    this.defaultDescriptionFont = 'MYRIADPRO-BOLDCOND';
    this.defaultTitleFontSize = 40;
    this.defaultDescriptionFontSize = 35;
    this.defaultDescriptionLineHeight = 1.4;
    this.defaultTitleLetterSpacing = 1.5;
    this.defaultDescriptionLetterSpacing = 0;
    this.defaultCardIdFont = 'MyriadPro-Light';
    this.defaultCardIdFontSize = 24;
    this.defaultCardIdOffset = 0;
    this.defaultCardIdOffsetX = 0;
    this.cardTypeSelect = document.getElementById('cardType');
    this.cardSubTypeSelect = document.getElementById('cardSubType');
    this.costSelect = document.getElementById('costSelect');

    this.imageUploadInput = document.getElementById('imageUpload');
    this.imagePreview = document.getElementById('imagePreview');
    this.btnClearImage = document.getElementById('btn-clear-image');
    this.artSelect = document.getElementById('artSelect');
    this.btnCropArt = document.getElementById('btn-crop-art');
    this.artScaleRange = document.getElementById('artScaleRange');
    this.artScaleInput = document.getElementById('artScaleInput');

    this.referenceImageInput = document.getElementById('referenceImage');
    this.referencePreview = document.getElementById('referencePreview');
    this.referenceSelect = document.getElementById('referenceSelect');
    this.showReferenceCheckbox = document.getElementById('showReference');
    this.showReferenceSideBySideCheckbox = document.getElementById('showReferenceSideBySide');
    this.referenceOverlay = document.getElementById('referenceOverlay');
    this.referenceSide = document.getElementById('referenceSide');
    this.referenceOpacity = document.getElementById('referenceOpacity');

    this.toggleExportBleed = document.getElementById('toggleExportBleed');

    this.toggleBleedLayer = document.getElementById('toggleBleedLayer');
    this.toggleBackgroundLower = document.getElementById('toggleBackgroundLower');
    this.toggleBackgroundUpper = document.getElementById('toggleBackgroundUpper');
    this.toggleImageFrame = document.getElementById('toggleImageFrame');
    this.toggleFrameShading = document.getElementById('toggleFrameShading');
    this.bleedColorInput = document.getElementById('bleedColor');
    this.toggleBorder = document.getElementById('toggleBorder');
    this.toggleCardId = document.getElementById('toggleCardId');
    this.toggleTitleBar = document.getElementById('toggleTitleBar');
    this.toggleTitleText = document.getElementById('toggleTitleText');
    this.toggleArtwork = document.getElementById('toggleArtwork');
    this.togglePanelBleed = document.getElementById('togglePanelBleed');
    this.toggleBottomText = document.getElementById('toggleBottomText');
    this.toggleCostBadge = document.getElementById('toggleCostBadge');
    this.toggleAttackModifier = document.getElementById('toggleAttackModifier');
    this.toggleCardText = document.getElementById('toggleCardText');

    this.cardTitleEl = document.getElementById('cardTitleBar');
    this.artworkLayer = document.getElementById('artworkLayer');
    this.artImage = document.getElementById('cardArtImage');
    this.descriptionImageLayer = document.getElementById('descriptionImageLayer');

    this.zoomSlider = document.getElementById('zoomSlider');
    this.zoomValue = document.getElementById('zoomValue');
    this.cardScaleSlider = document.getElementById('cardScaleSlider');
    this.cardScaleValue = document.getElementById('cardScaleValue');
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
    this.loadFontOptions();
    this.loadReferenceOptions();
  }

  initEventListeners() {
    // Card properties

    if (this.cardNameInput) {
      this.cardNameInput.addEventListener('input', (e) => {
        gameState.updateProperty('name', e.target.value);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.cardIdInput) {
      this.cardIdInput.addEventListener('input', (e) => {
        const normalized = this.normalizeCardIdInput(e.target.value);
        e.target.value = normalized;
        gameState.updateProperty('cardId', normalized);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdFontSizeInput) {
      this.cardIdFontSizeInput.addEventListener('input', (e) => {
        const size = this.clampCardIdFontSize(e.target.value);
        e.target.value = size;
        if (this.cardIdFontSizeValue) this.cardIdFontSizeValue.textContent = size;
        gameState.updateProperty('cardIdFontSize', size);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdPositionXInput) {
      this.cardIdPositionXInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionXValue) this.cardIdPositionXValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffsetX', offset);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdPositionYInput) {
      this.cardIdPositionYInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionYValue) this.cardIdPositionYValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffset', offset);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.titleFontSelect) {
      this.titleFontSelect.addEventListener('change', (e) => {
        gameState.updateProperty('titleFont', e.target.value || this.defaultTitleFont);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.addEventListener('change', (e) => {
        const value = Number(e.target.value);
        const size = Number.isFinite(value) ? Math.max(8, Math.min(96, value)) : this.defaultTitleFontSize;
        e.target.value = size;
        gameState.updateProperty('titleFontSize', size);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.titleLetterSpacingInput) {
      this.titleLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
        gameState.updateProperty('titleLetterSpacing', spacing);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    this.cardDescInput.addEventListener('input', (e) => {
      gameState.updateProperty('description', e.target.value);
      renderer.updateDescriptionImage(gameState.getCard());
    });

    if (this.descriptionFontSelect) {
      this.descriptionFontSelect.addEventListener('change', (e) => {
        gameState.updateProperty('descriptionFont', e.target.value || this.defaultDescriptionFont);
        renderer.updateDescriptionImage(gameState.getCard());
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.addEventListener('change', (e) => {
        const value = Number(e.target.value);
        const size = Number.isFinite(value) ? Math.max(8, Math.min(96, value)) : this.defaultDescriptionFontSize;
        e.target.value = size;
        gameState.updateProperty('descriptionFontSize', size);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    if (this.descriptionLineHeightInput) {
      this.descriptionLineHeightInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const spacing = this.clampLineHeightScale(value);
        e.target.value = spacing;
        if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
        gameState.updateProperty('descriptionLineHeightScale', spacing);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    if (this.descriptionLetterSpacingInput) {
      this.descriptionLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
        gameState.updateProperty('descriptionLetterSpacing', spacing);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    this.cardTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardType', e.target.value);
      this.updateSubTypeOptions(e.target.value);
      this.updateSubTypeLabel(e.target.value);
      renderer.applyAssetsForCardType(e.target.value, this.cardSubTypeSelect.value);
      renderer.updateCardIdText(gameState.getCard());
    });

    this.cardSubTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardSubType', e.target.value);
      renderer.applyAssetsForCardType(this.cardTypeSelect.value, e.target.value);
      renderer.updateCardIdText(gameState.getCard());
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

    const onArtScaleChange = (value) => {
      const scale = this.clampArtScale(value);
      const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
      gameState.updateProperty('artCroppedData', null);
      gameState.updateProperty('artTransform', {
        ...current,
        scale
      });
      this.setArtScaleInputs(scale);
      renderer.updateArtTransform(gameState.getCard());
    };

    if (this.artScaleRange) {
      this.artScaleRange.addEventListener('input', (e) => {
        onArtScaleChange(Number(e.target.value));
      });
    }

    if (this.artScaleInput) {
      this.artScaleInput.addEventListener('change', (e) => {
        onArtScaleChange(Number(e.target.value));
      });
    }

    // Reference overlay
    this.referenceImageInput.addEventListener('change', (e) => this.handleReferenceUpload(e));
    if (this.referenceSelect) {
      this.referenceSelect.addEventListener('change', (e) => this.handleReferenceSelect(e));
    }
    this.showReferenceCheckbox.addEventListener('change', (e) => this.toggleReferenceOverlay(e.target.checked));
    this.showReferenceSideBySideCheckbox.addEventListener('change', (e) => this.toggleReferenceSideBySide(e.target.checked));
    if (this.referenceOpacity) {
      this.referenceOpacity.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const opacity = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.7;
        e.target.value = opacity;
        if (this.referenceOverlay) this.referenceOverlay.style.opacity = String(opacity);
      });
    }

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

    if (this.toggleCardId) {
      this.toggleCardId.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardId', e.target.checked);
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
          this.setArtScaleInputs(nextScale);
          renderer.updateArtTransform(gameState.getCard());
        }, { passive: false });

        if (this.previewElement) {
          this.previewElement.addEventListener('mousedown', (e) => {
            if (!this.artImage || !this.artImage.src) return;
            if (this.cardTitleEl && this.cardTitleEl.contains(e.target)) return;
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
            this.setArtScaleInputs(nextScale);
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
    if (this.cardScaleSlider) {
      this.cardScaleSlider.addEventListener('input', (e) => this.handleCardScale(e.target.value));
    }

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
        this.setArtScaleInputs(nextScale);
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
      this.setArtScaleInputs(1);
      
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
      this.setArtScaleInputs(1);
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
      this.applyReferenceImage(imageData, 'Uploaded Reference');
      if (this.referenceSelect) {
        this.referenceSelect.value = '__upload__';
      }
    };
    reader.readAsDataURL(file);
  }

  handleReferenceSelect(event) {
    const value = event.target.value;
    if (value === '__upload__') return;
    if (!value) {
      this.clearReferenceImage();
      return;
    }
    const label = event.target.options[event.target.selectedIndex]?.textContent || 'Reference';
    this.applyReferenceImage(value, label);
  }

  applyReferenceImage(imageData, label = 'Reference') {
    if (!imageData) return;
    if (this.referencePreview) {
      this.referencePreview.innerHTML = `<img src="${imageData}" alt="${label}">`;
    }

    if (this.referenceOverlay) {
      this.referenceOverlay.style.backgroundImage = `url('${imageData}')`;
      this.referenceOverlay.style.backgroundSize = '100% 100%';
      this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
      this.referenceOverlay.style.backgroundPosition = 'center';
      if (this.referenceOpacity) {
        const value = Number(this.referenceOpacity.value);
        const opacity = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.7;
        this.referenceOverlay.style.opacity = String(opacity);
      }
      if (this.showReferenceCheckbox && this.showReferenceCheckbox.checked) {
        this.referenceOverlay.style.display = 'block';
      }
    }

    const style = document.documentElement.style;
    style.setProperty('--reference-image', `url('${imageData}')`);
    window.defaultReferencePath = imageData;

    if (this.referenceSide) {
      this.referenceSide.style.backgroundImage = `url('${imageData}')`;
      this.referenceSide.style.backgroundSize = '100% 100%';
      this.referenceSide.style.backgroundRepeat = 'no-repeat';
      this.referenceSide.style.backgroundPosition = 'center';
    }
  }

  clearReferenceImage() {
    if (this.referencePreview) this.referencePreview.innerHTML = '';
    if (this.referenceOverlay) {
      this.referenceOverlay.style.backgroundImage = '';
      this.referenceOverlay.style.display = 'none';
    }
    if (this.referenceSide) {
      this.referenceSide.style.backgroundImage = '';
      this.referenceSide.style.display = 'none';
    }
    const style = document.documentElement.style;
    style.setProperty('--reference-image', '');
    window.defaultReferencePath = '';
  }

  toggleReferenceOverlay(show) {
    if (show) {
      if (this.referenceOpacity) {
        const value = Number(this.referenceOpacity.value);
        const opacity = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.7;
        this.referenceOverlay.style.opacity = String(opacity);
      }
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
    renderer.updateCardIdText(gameState.getCard());
  }

  handleCardScale(value) {
    const scaleValue = Number(value);
    const scale = Number.isFinite(scaleValue) ? Math.max(80, Math.min(120, scaleValue)) : 100;
    if (this.cardScaleValue) this.cardScaleValue.textContent = String(scale);
    if (this.previewContainer) {
      this.previewContainer.style.setProperty('--card-scale', String(scale / 100));
      this.previewContainer.style.setProperty('--card-scale-inverse', String(100 / scale));
    }
    renderer.updateTitleImage(gameState.getCard());
    renderer.updateDescriptionImage(gameState.getCard());
    renderer.updateCardIdText(gameState.getCard());
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

  clampArtScale(value) {
    const scale = Number(value);
    if (!Number.isFinite(scale)) return 1;
    return Math.max(0.5, Math.min(3, scale));
  }

  clampLetterSpacing(value) {
    const spacing = Number(value);
    if (!Number.isFinite(spacing)) return 0;
    return Math.max(-10, Math.min(10, spacing));
  }

  clampLineHeightScale(value) {
    const spacing = Number(value);
    if (!Number.isFinite(spacing)) return this.defaultDescriptionLineHeight;
    return Math.max(0.8, Math.min(1.6, spacing));
  }

  clampCardIdFontSize(value) {
    const size = Number(value);
    if (!Number.isFinite(size)) return this.defaultCardIdFontSize;
    return Math.max(8, Math.min(48, size));
  }

  clampCardIdOffset(value) {
    const offset = Number(value);
    if (!Number.isFinite(offset)) return this.defaultCardIdOffset;
    return Math.max(-10, Math.min(10, offset));
  }

  normalizeCardIdInput(value) {
    const raw = String(value || '');
    const letters = raw.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
    const parts = [];
    if (letters) parts.push(letters);
    if (digits.length > 0) {
      parts.push(digits.slice(0, Math.min(2, digits.length)));
    }
    if (digits.length >= 2) {
      parts.push(`v${digits.slice(2, 4)}`);
    }
    return parts.join(' ').slice(0, 11);
  }

  setArtScaleInputs(scale) {
    if (this.artScaleRange) this.artScaleRange.value = String(scale);
    if (this.artScaleInput) this.artScaleInput.value = String(scale);
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
    const fontUpdates = {};
    if (!card.titleFont) fontUpdates.titleFont = this.defaultTitleFont;
    if (!card.descriptionFont) fontUpdates.descriptionFont = this.defaultDescriptionFont;
    if (!card.titleFontSize) fontUpdates.titleFontSize = this.defaultTitleFontSize;
    if (!card.descriptionFontSize) fontUpdates.descriptionFontSize = this.defaultDescriptionFontSize;
    if (!card.descriptionLineHeightScale) fontUpdates.descriptionLineHeightScale = this.defaultDescriptionLineHeight;
    if (card.titleLetterSpacing === undefined) fontUpdates.titleLetterSpacing = this.defaultTitleLetterSpacing;
    if (card.descriptionLetterSpacing === undefined) fontUpdates.descriptionLetterSpacing = this.defaultDescriptionLetterSpacing;
    if (Object.keys(fontUpdates).length > 0) {
      gameState.updateProperties(fontUpdates);
      card = gameState.getCard();
    }

    if (card.cardId === undefined) {
      gameState.updateProperty('cardId', '');
      card = gameState.getCard();
    }
    if (!card.cardIdFont) {
      gameState.updateProperty('cardIdFont', this.defaultCardIdFont);
      card = gameState.getCard();
    }
    if (card.cardIdFontSize === undefined) {
      gameState.updateProperty('cardIdFontSize', this.defaultCardIdFontSize);
      card = gameState.getCard();
    }
    if (card.cardIdOffset === undefined) {
      gameState.updateProperty('cardIdOffset', this.defaultCardIdOffset);
      card = gameState.getCard();
    }
    if (card.cardIdOffsetX === undefined) {
      gameState.updateProperty('cardIdOffsetX', this.defaultCardIdOffsetX);
      card = gameState.getCard();
    }

    // Update inputs
    if (this.cardNameInput) this.cardNameInput.value = card.name;
    if (this.cardIdInput) this.cardIdInput.value = card.cardId || '';
    if (this.cardIdFontSizeInput) {
      const size = this.clampCardIdFontSize(card.cardIdFontSize);
      this.cardIdFontSizeInput.value = size;
      if (this.cardIdFontSizeValue) this.cardIdFontSizeValue.textContent = size;
    }
    if (this.cardIdPositionXInput) {
      const offset = this.clampCardIdOffset(card.cardIdOffsetX);
      this.cardIdPositionXInput.value = offset;
      if (this.cardIdPositionXValue) this.cardIdPositionXValue.textContent = offset.toFixed(1);
    }
    if (this.cardIdPositionYInput) {
      const offset = this.clampCardIdOffset(card.cardIdOffset);
      this.cardIdPositionYInput.value = offset;
      if (this.cardIdPositionYValue) this.cardIdPositionYValue.textContent = offset.toFixed(1);
    }
    this.cardDescInput.value = card.description;
    this.ensureFontSelection(this.titleFontSelect, card.titleFont || this.defaultTitleFont);
    this.ensureFontSelection(this.descriptionFontSelect, card.descriptionFont || this.defaultDescriptionFont);
    if (this.titleFontSizeInput) this.titleFontSizeInput.value = card.titleFontSize || this.defaultTitleFontSize;
    if (this.descriptionFontSizeInput) this.descriptionFontSizeInput.value = card.descriptionFontSize || this.defaultDescriptionFontSize;
    if (this.descriptionLineHeightInput) {
      const spacing = this.clampLineHeightScale(card.descriptionLineHeightScale);
      this.descriptionLineHeightInput.value = spacing;
      if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
    }
    if (this.titleLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.titleLetterSpacing);
      this.titleLetterSpacingInput.value = spacing;
      if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.descriptionLetterSpacing);
      this.descriptionLetterSpacingInput.value = spacing;
      if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
    }
    if (this.cardScaleSlider) {
      const current = this.previewContainer
        ? parseFloat(getComputedStyle(this.previewContainer).getPropertyValue('--card-scale'))
        : 1;
      const percent = Math.round((Number.isFinite(current) ? current : 1) * 100);
      this.cardScaleSlider.value = String(percent);
      if (this.cardScaleValue) this.cardScaleValue.textContent = String(percent);
      if (this.previewContainer) {
        this.previewContainer.style.setProperty('--card-scale-inverse', String(100 / percent));
      }
    }
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
    const artScale = card.artTransform && Number.isFinite(card.artTransform.scale)
      ? card.artTransform.scale
      : 1;
    this.setArtScaleInputs(artScale);

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
    if (this.toggleCardId) this.toggleCardId.checked = !!(card.layers && card.layers.cardId);
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

  async loadFontOptions() {
    const selects = [this.titleFontSelect, this.descriptionFontSelect].filter(Boolean);
    if (!selects.length) return;

    const systemFonts = [
      { label: 'Default (Arial)', family: 'Arial' },
      { label: 'Georgia', family: 'Georgia' },
      { label: 'Times New Roman', family: 'Times New Roman' },
      { label: 'Verdana', family: 'Verdana' }
    ];

    let customFonts = [];
    try {
      const response = await fetch('Assets/fonts/manifest.json');
      const manifest = await response.json();
      customFonts = (manifest.fonts || []).map((font) => ({
        label: font.label || font.family,
        family: font.family
      }));
    } catch (error) {
      console.warn('Could not load font manifest:', error);
    }

    const allFonts = [...systemFonts, ...customFonts];
    selects.forEach((select) => {
      select.innerHTML = '';
      allFonts.forEach((font) => {
        const option = document.createElement('option');
        option.value = font.family;
        option.textContent = font.label;
        select.appendChild(option);
      });
    });

    const card = gameState.getCard();
    this.ensureFontSelection(this.titleFontSelect, card.titleFont || this.defaultTitleFont);
    this.ensureFontSelection(this.descriptionFontSelect, card.descriptionFont || this.defaultDescriptionFont);
    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.value = card.titleFontSize || this.defaultTitleFontSize;
    }
    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.value = card.descriptionFontSize || this.defaultDescriptionFontSize;
    }
    if (this.descriptionLineHeightInput) {
      const spacing = this.clampLineHeightScale(card.descriptionLineHeightScale);
      this.descriptionLineHeightInput.value = spacing;
      if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
    }
    if (this.titleLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.titleLetterSpacing);
      this.titleLetterSpacingInput.value = spacing;
      if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.descriptionLetterSpacing);
      this.descriptionLetterSpacingInput.value = spacing;
      if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
    }
    if (this.referenceOpacity && this.referenceOverlay) {
      const current = parseFloat(this.referenceOverlay.style.opacity || '0.7');
      const opacity = Number.isFinite(current) ? Math.max(0, Math.min(1, current)) : 0.7;
      this.referenceOpacity.value = String(opacity);
      this.referenceOverlay.style.opacity = String(opacity);
    }
  }

  async loadReferenceOptions() {
    if (!this.referenceSelect) return;
    try {
      const response = await fetch('Assets/Reference/manifest.json');
      const manifest = await response.json();
      const files = Array.isArray(manifest.files) ? manifest.files : [];
      const defaultFile = manifest.default && files.includes(manifest.default)
        ? manifest.default
        : files[0];

      this.referenceSelect.innerHTML = '';
      const uploadOption = document.createElement('option');
      uploadOption.value = '__upload__';
      uploadOption.textContent = 'Custom Upload';
      this.referenceSelect.appendChild(uploadOption);

      const noneOption = document.createElement('option');
      noneOption.value = '';
      noneOption.textContent = 'None';
      this.referenceSelect.appendChild(noneOption);

      files.forEach((file) => {
        const option = document.createElement('option');
        option.value = `Assets/Reference/${file}`;
        option.textContent = this.formatReferenceLabel(file);
        this.referenceSelect.appendChild(option);
      });

      if (defaultFile) {
        const defaultValue = `Assets/Reference/${defaultFile}`;
        this.referenceSelect.value = defaultValue;
        this.applyReferenceImage(defaultValue, this.formatReferenceLabel(defaultFile));
      }
    } catch (error) {
      console.warn('Could not load reference manifest:', error);
    }
  }

  formatReferenceLabel(filename) {
    const base = String(filename || '').replace(/\.[^/.]+$/, '');
    const spaced = base.replace(/[_-]+/g, ' ');
    return spaced.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  ensureFontSelection(select, value) {
    if (!select) return;
    const existing = Array.from(select.options).some((opt) => opt.value === value);
    if (!existing && value) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
    select.value = value || 'Arial';
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

class ReferenceOverlayManager {
  constructor(options = {}) {
    this.referenceImageInput = options.referenceImageInput || null;
    this.referencePreview = options.referencePreview || null;
    this.referenceSelect = options.referenceSelect || null;
    this.showReferenceCheckbox = options.showReferenceCheckbox || null;
    this.showReferenceSideBySideCheckbox = options.showReferenceSideBySideCheckbox || null;
    this.referenceOverlay = options.referenceOverlay || null;
    this.referenceSide = options.referenceSide || null;
    this.referenceOpacity = options.referenceOpacity || null;
    this.previewContainer = options.previewContainer || null;

    this.manifestPath = options.manifestPath || 'Assets/Reference/manifest.json';
    this.defaultReferencePath = options.defaultReferencePath || 'Assets/Reference/Transference_basic.png';
    this.fitSize = options.fitSize || 'cover';
    this.maxUploadBytes = Number(options.maxUploadBytes) || (5 * 1024 * 1024);
    this.isBound = false;

    if (!window.defaultReferencePath) {
      window.defaultReferencePath = this.defaultReferencePath;
    }
  }

  init() {
    this.resetViewState();
    this.bindEvents();
    return this.loadReferenceOptions();
  }

  resetViewState() {
    if (this.showReferenceCheckbox) this.showReferenceCheckbox.checked = false;
    if (this.showReferenceSideBySideCheckbox) this.showReferenceSideBySideCheckbox.checked = false;
    if (this.referenceOverlay) this.referenceOverlay.style.display = 'none';
    if (this.referenceSide) this.referenceSide.style.display = 'none';
    if (this.previewContainer) this.previewContainer.classList.remove('side-by-side');
  }

  bindEvents() {
    if (this.isBound) return;
    this.isBound = true;

    if (this.referenceImageInput) {
      this.referenceImageInput.addEventListener('change', (e) => this.handleUpload(e));
    }
    if (this.referenceSelect) {
      this.referenceSelect.addEventListener('change', (e) => this.handleSelect(e));
    }
    if (this.showReferenceCheckbox) {
      this.showReferenceCheckbox.addEventListener('change', (e) => this.toggleOverlay(!!e.target.checked));
    }
    if (this.showReferenceSideBySideCheckbox) {
      this.showReferenceSideBySideCheckbox.addEventListener('change', (e) => this.toggleSideBySide(!!e.target.checked));
    }
    if (this.referenceOpacity) {
      this.referenceOpacity.addEventListener('input', (e) => this.setOpacity(e.target.value));
    }
  }

  setOpacity(rawValue) {
    const value = Number(rawValue);
    const opacity = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.7;
    if (this.referenceOpacity) {
      this.referenceOpacity.value = String(opacity);
    }
    if (this.referenceOverlay) {
      this.referenceOverlay.style.opacity = String(opacity);
    }
    return opacity;
  }

  getBackgroundSize() {
    return this.fitSize || '100% 100%';
  }

  formatLabel(filename) {
    const base = String(filename || '').replace(/\.[^/.]+$/, '');
    const spaced = base.replace(/[_-]+/g, ' ');
    return spaced.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  buildCssUrl(source) {
    const safe = String(source || '').replace(/"/g, '%22');
    return `url("${safe}")`;
  }

  applySource(source) {
    if (!source) return;
    const cssUrl = this.buildCssUrl(source);
    const fit = this.getBackgroundSize();

    if (this.referenceOverlay) {
      this.referenceOverlay.style.backgroundImage = cssUrl;
      this.referenceOverlay.style.backgroundSize = fit;
      this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
      this.referenceOverlay.style.backgroundPosition = 'center';
    }
    if (this.referenceSide) {
      this.referenceSide.style.backgroundImage = cssUrl;
      this.referenceSide.style.backgroundSize = fit;
      this.referenceSide.style.backgroundRepeat = 'no-repeat';
      this.referenceSide.style.backgroundPosition = 'center';
    }

    document.documentElement.style.setProperty('--reference-image', cssUrl);
    window.defaultReferencePath = source;
  }

  applyImage(source, label = 'Reference') {
    if (!source) return;
    if (this.referencePreview) {
      this.referencePreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = source;
      img.alt = label;
      this.referencePreview.appendChild(img);
    }
    this.applySource(source);
    this.setOpacity(this.referenceOpacity ? this.referenceOpacity.value : 0.7);
    if (this.referenceOverlay && (!this.showReferenceCheckbox || !this.showReferenceCheckbox.checked)) {
      this.referenceOverlay.style.display = 'none';
    }
    if (this.referenceSide && (!this.showReferenceSideBySideCheckbox || !this.showReferenceSideBySideCheckbox.checked)) {
      this.referenceSide.style.display = 'none';
    }
  }

  clearImage() {
    if (this.referencePreview) this.referencePreview.innerHTML = '';
    if (this.referenceOverlay) {
      this.referenceOverlay.style.backgroundImage = '';
      this.referenceOverlay.style.display = 'none';
    }
    if (this.referenceSide) {
      this.referenceSide.style.backgroundImage = '';
      this.referenceSide.style.display = 'none';
    }
    document.documentElement.style.setProperty('--reference-image', '');
    window.defaultReferencePath = '';
  }

  handleUpload(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > this.maxUploadBytes) {
      alert('Image file is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e?.target?.result;
      if (!imageData) return;
      this.applyImage(imageData, 'Uploaded Reference');
      if (this.referenceSelect) this.referenceSelect.value = '__upload__';
    };
    reader.readAsDataURL(file);
  }

  handleSelect(event) {
    const value = event?.target?.value || '';
    if (value === '__upload__') return;
    if (!value) {
      this.clearImage();
      return;
    }
    const label = event?.target?.options?.[event.target.selectedIndex]?.textContent || 'Reference';
    this.applyImage(value, label);
  }

  toggleOverlay(show) {
    if (!this.referenceOverlay) return;
    if (!show) {
      this.referenceOverlay.style.display = 'none';
      return;
    }

    this.setOpacity(this.referenceOpacity ? this.referenceOpacity.value : 0.7);
    let bg = this.referenceOverlay.style.backgroundImage;
    if (!bg || bg === 'none') {
      const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--reference-image').trim();
      if (cssVar && cssVar !== 'none') {
        this.referenceOverlay.style.backgroundImage = cssVar;
        bg = cssVar;
      }
    }
    if ((!bg || bg === 'none') && window.defaultReferencePath) {
      this.referenceOverlay.style.backgroundImage = this.buildCssUrl(window.defaultReferencePath);
    }
    this.referenceOverlay.style.backgroundSize = this.getBackgroundSize();
    this.referenceOverlay.style.backgroundRepeat = 'no-repeat';
    this.referenceOverlay.style.backgroundPosition = 'center';
    this.referenceOverlay.style.display = 'block';

    if (this.showReferenceSideBySideCheckbox) {
      this.showReferenceSideBySideCheckbox.checked = false;
    }
    if (this.previewContainer) {
      this.previewContainer.classList.remove('side-by-side');
    }
    if (this.referenceSide) {
      this.referenceSide.style.display = 'none';
    }
  }

  toggleSideBySide(show) {
    if (show) {
      if (this.referenceOverlay) this.referenceOverlay.style.display = 'none';
      if (this.showReferenceCheckbox) this.showReferenceCheckbox.checked = false;
      if (this.previewContainer) this.previewContainer.classList.add('side-by-side');
      if (this.referenceSide) this.referenceSide.style.display = 'block';
      return;
    }

    if (this.previewContainer) this.previewContainer.classList.remove('side-by-side');
    if (this.referenceSide) this.referenceSide.style.display = 'none';
  }

  async loadReferenceOptions() {
    if (!this.referenceSelect) {
      if (this.defaultReferencePath) {
        this.applyImage(this.defaultReferencePath, this.formatLabel(this.defaultReferencePath));
      }
      return;
    }

    try {
      const response = await fetch(this.manifestPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
        option.textContent = this.formatLabel(file);
        this.referenceSelect.appendChild(option);
      });

      if (defaultFile) {
        const defaultValue = `Assets/Reference/${defaultFile}`;
        this.referenceSelect.value = defaultValue;
        this.applyImage(defaultValue, this.formatLabel(defaultFile));
      }
    } catch (error) {
      console.warn('Could not load reference manifest:', error);
      if (this.defaultReferencePath) {
        this.applyImage(this.defaultReferencePath, this.formatLabel(this.defaultReferencePath));
      }
    }
  }
}

window.ReferenceOverlayManager = ReferenceOverlayManager;

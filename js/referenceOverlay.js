const DTC_REFERENCE_ROOT = typeof window !== 'undefined' ? window : globalThis;

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
    this.defaultReferencePath = options.defaultReferencePath || 'Assets/Reference/missed_me_II.png';
    this.fitSize = options.fitSize || 'cover';
    this.maxUploadBytes = Number(options.maxUploadBytes) || (5 * 1024 * 1024);
    this.notify = typeof options.notify === 'function'
      ? options.notify
      : ((message) => {
        const text = String(message || '').trim();
        if (text) console.warn(text);
      });
    this.isBound = false;

    if (!DTC_REFERENCE_ROOT.defaultReferencePath) {
      DTC_REFERENCE_ROOT.defaultReferencePath = this.defaultReferencePath;
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
    DTC_REFERENCE_ROOT.defaultReferencePath = source;
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
    DTC_REFERENCE_ROOT.defaultReferencePath = '';
  }

  async handleFile(file, inputEl = null) {
    if (!file) return false;
    if (!file.type.startsWith('image/')) {
      this.notify('Please select a valid image file');
      if (inputEl) inputEl.value = '';
      return false;
    }
    if (file.size > this.maxUploadBytes) {
      this.notify('Image file is too large. Maximum size is 5MB');
      if (inputEl) inputEl.value = '';
      return false;
    }

    try {
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(String(e?.target?.result || ''));
        reader.onerror = () => reject(new Error('Failed to read the selected reference image.'));
        reader.readAsDataURL(file);
      });
      if (!imageData) return false;
      this.applyImage(imageData, 'Uploaded Reference');
      if (this.referenceSelect) this.referenceSelect.value = '__upload__';
      if (inputEl) inputEl.value = '';
      return true;
    } catch (error) {
      this.notify('Failed to read the selected reference image.');
      if (inputEl) inputEl.value = '';
      return false;
    }
  }

  handleUpload(event) {
    const inputEl = event?.target || null;
    const file = inputEl?.files?.[0];
    if (!file) return;
    this.handleFile(file, inputEl);
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
    if ((!bg || bg === 'none') && DTC_REFERENCE_ROOT.defaultReferencePath) {
      this.referenceOverlay.style.backgroundImage = this.buildCssUrl(DTC_REFERENCE_ROOT.defaultReferencePath);
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

if (typeof window !== 'undefined') {
  window.ReferenceOverlayManager = ReferenceOverlayManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReferenceOverlayManager };
}

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
    this.frameShadingLayer = document.getElementById('frameShadingLayer');
    this.frameLayer = document.getElementById('frameLayer');
    this.cardIdLayer = document.getElementById('cardIdLayer');
    this.cardIdTextLayer = document.getElementById('cardIdTextLayer');
    this.panelBleedLayer = document.getElementById('panelBleedLayer');
    this.panelLowerLayer = document.getElementById('panelLowerLayer');
    this.costBadgeLayer = document.getElementById('costBadgeLayer');
    this.panelUpperLayer = document.getElementById('panelUpperLayer');
    this.titleLayer = document.getElementById('titleLayer');
    this.attackModifierLayer = document.getElementById('attackModifierLayer');
    this.cardTextLayer = document.getElementById('cardTextLayer');
    this.frameImageUrl = '';
    this.imageFrameUrl = '';
    this.artMaskUrl = '';
    this.artMaskCache = {};
    this.bgLowerBoundsCache = {};
    this.cardIdBoundsCache = {};
    this.iconCache = {};
    this.iconPromises = {};
    this.fontManifest = null;
    this.fontMap = {};
    this.fontPromises = {};
    this.statusEffectsManifest = null;
    this.statusEffectMap = {};

    this.assetManifest = null;
    this.loadAssetManifest();
    this.fontManifestPromise = this.loadFontManifest();
    this.loadStatusEffectsManifest();
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

  async loadFontManifest() {
    try {
      const response = await fetch('Assets/fonts/manifest.json');
      const manifest = await response.json();
      this.fontManifest = manifest;
      this.fontMap = {};
      (manifest.fonts || []).forEach((font) => {
        if (font.family && font.file) {
          this.fontMap[font.family] = font.file;
        }
      });
    } catch (error) {
      console.warn('Could not load font manifest:', error);
      this.fontManifest = { fonts: [] };
      this.fontMap = {};
    }
  }

  async loadStatusEffectsManifest() {
    try {
      const response = await fetch('Assets/Status effects/manifest.json');
      const manifest = await response.json();
      this.statusEffectsManifest = manifest;
      const files = Array.isArray(manifest.files) ? manifest.files : [];
      this.statusEffectMap = {};
      files.forEach((file) => {
        const base = String(file || '').replace(/\.[^/.]+$/, '');
        const key = this.normalizeStatusEffectKey(base);
        if (!key) return;
        this.statusEffectMap[key] = `Assets/Status effects/${file}`;
      });
    } catch (error) {
      console.warn('Could not load status effects manifest:', error);
      this.statusEffectsManifest = { files: [] };
      this.statusEffectMap = {};
    }
  }

  getFontFamily(family) {
    const safe = (family || '').trim();
    if (!safe) return 'Arial, sans-serif';
    return `"${safe}", Arial, sans-serif`;
  }

  normalizeStatusEffectKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .trim();
  }

  async ensureFontLoaded(family, weight = 700) {
    const safe = (family || '').trim();
    if (!safe) return;
    const key = `${safe}:${weight}`;
    if (this.fontPromises[key]) return this.fontPromises[key];

    const loadPromise = (async () => {
      if (this.fontManifestPromise) {
        await this.fontManifestPromise;
      }
      const src = this.fontMap[safe];
      if (src) {
        const face = new FontFace(safe, `url('${src}')`, { weight: String(weight) });
        const loaded = await face.load();
        document.fonts.add(loaded);
        return true;
      }
      await document.fonts.load(`${weight} 18px "${safe}"`);
      return true;
    })().catch((error) => {
      console.warn('Failed to load font:', safe, error);
      return false;
    });

    this.fontPromises[key] = loadPromise;
    return loadPromise;
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
      this.imageFrameUrl = assets.imageFrame;
    }

    // Apply frame shading
    if (assets.frameShading && this.frameShadingLayer) {
      this.frameShadingLayer.style.backgroundImage = `url('${assets.frameShading}')`;
    }

    // Apply card ID layer (above frame)
    if (this.cardIdLayer) {
      this.cardIdLayer.style.backgroundImage = assets.cardId ? `url('${assets.cardId}')` : '';
    }
    if (this.cardIdTextLayer) {
      this.updateCardIdText(gameState.getCard());
    }

    // Apply panel upper (title bar area)
    if (assets.panelUpper && this.panelUpperLayer) {
      this.panelUpperLayer.style.backgroundImage = `url('${assets.panelUpper}')`;
    }

    // Apply panel lower (text area)
    if (assets.panelLower && this.panelLowerLayer) {
      this.panelLowerLayer.style.backgroundImage = `url('${assets.panelLower}')`;
    }

    // Apply panel bleed
    if (assets.panelBleed && this.panelBleedLayer) {
      this.panelBleedLayer.style.backgroundImage = `url('${assets.panelBleed}')`;
    }

    // Apply attack modifier (Roll Phase only)
    if (assets.attackModifier && this.attackModifierLayer) {
      this.attackModifierLayer.style.backgroundImage = `url('${assets.attackModifier}')`;
    }

    this.artMaskUrl = this.getArtMaskPath();
    if (!this.artMaskUrl) {
      this.ensureArtMask(assets.imageFrame, assets.border);
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

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  getIconCandidates(path) {
    const candidates = [path];
    try {
      const absolute = new URL(path, document.baseURI).toString();
      if (absolute && absolute !== path) candidates.push(absolute);
    } catch (error) {
      // Ignore URL construction errors and keep relative path only.
    }
    return candidates;
  }

  async loadIcon(src) {
    if (this.iconCache[src]) return this.iconCache[src];
    if (!this.iconPromises[src]) {
      const candidates = this.getIconCandidates(src);
      const tryLoad = async () => {
        for (const candidate of candidates) {
          try {
            const img = await this.loadImage(candidate);
            return img;
          } catch (error) {
            // Try next candidate.
          }
        }
        return null;
      };
      this.iconPromises[src] = tryLoad().then((img) => {
        if (img) this.iconCache[src] = img;
        if (!img) console.warn('Failed to load icon:', src);
        return img;
      });
    }
    return this.iconPromises[src];
  }

  collectIconPaths(text) {
    const atoms = this.tokenizeForLayout(text);
    const paths = [];
    atoms.forEach((atom) => {
      if (atom.type !== 'icon') return;
      const path = this.resolveIconPath(atom);
      if (path) paths.push(path);
    });
    return Array.from(new Set(paths));
  }

  async preloadIconsForText(text) {
    const paths = this.collectIconPaths(text);
    if (!paths.length) return;
    await Promise.all(paths.map((path) => this.loadIcon(path)));
  }

  areIconsReady(text) {
    const paths = this.collectIconPaths(text);
    return paths.every((path) => this.iconCache[path]);
  }

  async buildWindowMaskFromFrame(src) {
    const img = await this.loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    // Build a map of transparent pixels (alpha == 0)
    const outside = new Uint8Array(w * h);
    const queueX = new Int32Array(w * h);
    const queueY = new Int32Array(w * h);
    let qh = 0;
    let qt = 0;

    const isTransparent = (idx) => data[idx * 4 + 3] === 0;

    // Flood fill from edges to mark outside transparent area
    const push = (x, y) => {
      const i = y * w + x;
      if (outside[i]) return;
      if (!isTransparent(i)) return;
      outside[i] = 1;
      queueX[qt] = x;
      queueY[qt] = y;
      qt += 1;
    };

    for (let x = 0; x < w; x += 1) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y += 1) {
      push(0, y);
      push(w - 1, y);
    }

    while (qh < qt) {
      const x = queueX[qh];
      const y = queueY[qh];
      qh += 1;
      if (x > 0) push(x - 1, y);
      if (x < w - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1);
      if (y < h - 1) push(x, y + 1);
    }

    // Window mask: transparent pixels NOT connected to outside
    const mask = ctx.createImageData(w, h);
    const mdata = mask.data;
    let hasWindow = false;
    for (let i = 0; i < w * h; i += 1) {
      const transparent = isTransparent(i);
      const isOutside = outside[i] === 1;
      const inWindow = transparent && !isOutside;
      const alpha = inWindow ? 255 : 0;
      if (alpha === 255) hasWindow = true;
      const idx = i * 4;
      mdata[idx] = 255;
      mdata[idx + 1] = 255;
      mdata[idx + 2] = 255;
      mdata[idx + 3] = alpha;
    }

    if (!hasWindow) return null;
    ctx.putImageData(mask, 0, 0);
    return canvas.toDataURL('image/png');
  }

  getLayerAssets(card) {
    if (!this.assetManifest || !this.assetManifest[card.cardType]) return {};
    return this.assetManifest[card.cardType][card.cardSubType] || {};
  }

  getPreviewScale() {
    const previewContainer = document.querySelector('.preview-container');
    const baseRaw = previewContainer
      ? getComputedStyle(previewContainer).getPropertyValue('--card-width')
      : '';
    const baseWidth = parseFloat(baseRaw) || 520;
    const currentWidth = this.previewElement ? this.previewElement.clientWidth : baseWidth;
    if (!baseWidth || !currentWidth) return 1;
    return currentWidth / baseWidth;
  }

  async computeOpaqueBounds(src) {
    const img = await this.loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    let minX = img.width;
    let minY = img.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < img.height; y += 1) {
      for (let x = 0; x < img.width; x += 1) {
        const idx = (y * img.width + x) * 4 + 3;
        if (data[idx] > 0) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return null;
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, iw: img.width, ih: img.height };
  }

  getCostBadgePath(card) {
    const value = Math.max(0, Math.min(5, Number(card?.costBadge?.value) || 0));
    const costMap = this.assetManifest?.CostBadge || {};
    return costMap[String(value)] || '';
  }

  getArtMaskPath() {
    return this.assetManifest?.ArtMask?.default || '';
  }

  async ensureArtMask(imageFrameSrc, frameSrc) {
    const provided = this.getArtMaskPath();
    if (provided) {
      this.artMaskUrl = provided;
      return;
    }
    const sources = [imageFrameSrc, frameSrc].filter(Boolean);
    if (!sources.length) return;
    const key = sources.join('|');
    if (this.artMaskCache[key]) {
      this.artMaskUrl = this.artMaskCache[key];
      return;
    }
    try {
      const primary = sources[0];
      const mask = await this.buildWindowMaskFromFrame(primary);
      if (mask) {
        this.artMaskCache[key] = mask;
        this.artMaskUrl = mask;
        this.updateArtCrop(gameState.getCard());
        return;
      }
      if (sources[1]) {
        const fallback = await this.buildWindowMaskFromFrame(sources[1]);
        if (fallback) {
          this.artMaskCache[key] = fallback;
          this.artMaskUrl = fallback;
          this.updateArtCrop(gameState.getCard());
        }
      }
    } catch (error) {
      console.warn('Failed to build art mask:', error);
    }
  }

  updateVisibility(card) {
    const layers = (card && card.layers) || {};

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

    // Frame shading
    if (this.frameShadingLayer) {
      this.frameShadingLayer.style.opacity = layers.frameShading === false ? '0' : '1';
      this.frameShadingLayer.style.pointerEvents = layers.frameShading === false ? 'none' : 'auto';
    }

    // Border (Frame layer)
    if (this.frameLayer) {
      this.frameLayer.style.opacity = layers.border === false ? '0' : '1';
      this.frameLayer.style.pointerEvents = layers.border === false ? 'none' : 'auto';
    }

    // Card ID layer (above frame)
    if (this.cardIdLayer) {
      this.cardIdLayer.style.opacity = layers.cardId === false ? '0' : '1';
      this.cardIdLayer.style.pointerEvents = layers.cardId === false ? 'none' : 'auto';
    }
    if (this.cardIdTextLayer) {
      this.cardIdTextLayer.style.opacity = layers.cardId === false ? '0' : '1';
      this.cardIdTextLayer.style.pointerEvents = layers.cardId === false ? 'none' : 'auto';
    }

    // Panel bleed
    if (this.panelBleedLayer) {
      this.panelBleedLayer.style.opacity = layers.panelBleed === false ? '0' : '1';
      this.panelBleedLayer.style.pointerEvents = layers.panelBleed === false ? 'none' : 'auto';
    }

    // Title bar (Panel Upper layer)
    if (this.panelUpperLayer) {
      this.panelUpperLayer.style.opacity = panelUpperVisible === false ? '0' : '1';
      this.panelUpperLayer.style.pointerEvents = panelUpperVisible === false ? 'none' : 'auto';
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

    // Attack modifier layer (Roll Phase only)
    if (this.attackModifierLayer) {
      const enabled = card.cardSubType === 'Roll Phase' && layers.attackModifier !== false;
      this.attackModifierLayer.style.opacity = enabled ? '1' : '0';
      this.attackModifierLayer.style.pointerEvents = enabled ? 'auto' : 'none';
    }

    // Card text layer (separate from Panel Lower)
    if (this.cardTextLayer) {
      this.cardTextLayer.style.opacity = layers.cardText === false ? '0' : '1';
      this.cardTextLayer.style.pointerEvents = layers.cardText === false ? 'none' : 'auto';
    }

    // Title layer
    if (this.titleLayer) {
      this.titleLayer.style.opacity = layers.titleText === false ? '0' : '1';
      this.titleLayer.style.pointerEvents = layers.titleText === false ? 'none' : 'auto';
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
    // Update title image (in Panel Upper)
    this.updateTitleImage(card);

    // Update description image (in Panel Lower)
    this.updateDescriptionImage(card);

    // Update card ID text (right edge)
    this.updateCardIdText(card);
  }

  normalizeCardIdText(value) {
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

  getCardIdSegments(text) {
    const safe = String(text || '').replace(/\s+/g, '');
    const letters = safe.slice(0, 4);
    const nums = safe.slice(4, 6);
    const tail = safe.slice(6);
    return [letters, nums, tail].filter(Boolean);
  }

  measureCardIdSegments(ctx, segments, segmentSpacing, letterSpacing) {
    const parts = segments.filter(Boolean);
    let width = 0;
    parts.forEach((part, idx) => {
      width += this.measureTextWithSpacing(ctx, part, letterSpacing);
      if (idx < parts.length - 1) width += segmentSpacing;
    });
    return width;
  }

  drawCardIdSegments(ctx, segments, x, y, segmentSpacing, letterSpacing) {
    const parts = segments.filter(Boolean);
    let cursorX = x;
    parts.forEach((part, idx) => {
      cursorX += this.drawTextWithSpacing(ctx, part, cursorX, y, letterSpacing);
      if (idx < parts.length - 1) cursorX += segmentSpacing;
    });
    return cursorX - x;
  }

  async updateTitleImage(card) {
    const titleEl = document.getElementById('cardTitleBar');
    if (!titleEl) return;
    const text = (card.name || '').trim();
    if (!text) {
      titleEl.style.backgroundImage = '';
      return;
    }

    if (!this.areIconsReady(text)) {
      await this.preloadIconsForText(text);
    }

    const container = this.previewElement;
    if (!container) return;
    const width = Math.max(1, Math.round(container.clientWidth));
    const height = Math.max(1, Math.round(container.clientHeight));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = Number(card.titleFontSize) || 18;
    const titleFont = card.titleFont || 'Arial';
    await this.ensureFontLoaded(titleFont, 700);
    ctx.font = `700 ${fontSize}px ${this.getFontFamily(titleFont)}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    const containerRect = container.getBoundingClientRect();
    let centerX = width / 2;
    let centerY = height / 2;
    let maxWidth = width * 0.6;

    const assets = this.getLayerAssets(card);
    const bgUpperSrc = assets.backgroundUpper;
    if (bgUpperSrc && !this.bgLowerBoundsCache[bgUpperSrc]) {
      this.computeOpaqueBounds(bgUpperSrc).then((bounds) => {
        if (bounds) this.bgLowerBoundsCache[bgUpperSrc] = bounds;
        this.updateTitleImage(card);
      }).catch(() => {});
    }

    const bounds = bgUpperSrc ? this.bgLowerBoundsCache[bgUpperSrc] : null;
    if (bounds) {
      const scaleX = width / bounds.iw;
      const scaleY = height / bounds.ih;
      centerX = (bounds.x + bounds.w / 2) * scaleX;
      centerY = (bounds.y + bounds.h / 2) * scaleY;
      maxWidth = bounds.w * scaleX * 0.8;
    } else if (this.bgUpperLayer) {
      const upperRect = this.bgUpperLayer.getBoundingClientRect();
      centerX = (upperRect.left - containerRect.left) + (upperRect.width / 2);
      centerY = (upperRect.top - containerRect.top) + (upperRect.height / 2);
      maxWidth = (upperRect.width / containerRect.width) * width * 0.8;
    }

    const offset = card.titlePosition || { x: 0, y: 0 };
    const currentScale = this.getPreviewScale();
    const offsetX = (Number(offset.x) || 0) * currentScale;
    const offsetY = (Number(offset.y) || 0) * currentScale;
    const iconSize = Math.round(fontSize * 1.8);
    const letterSpacing = Number(card.titleLetterSpacing) || 0;
    const layout = this.layoutTextWithIcons(
      ctx,
      text,
      maxWidth,
      fontSize * 1.35,
      iconSize,
      letterSpacing,
      1.05
    );
    const pad = Math.ceil(Math.max(iconSize * 0.2, ctx.shadowBlur + 2));

    const tightCanvas = document.createElement('canvas');
    tightCanvas.width = Math.max(1, Math.ceil(layout.width + pad * 2));
    tightCanvas.height = Math.max(1, Math.ceil(layout.height + pad * 2));
    const tightCtx = tightCanvas.getContext('2d');
    if (!tightCtx) return;
    tightCtx.font = ctx.font;
    tightCtx.fillStyle = ctx.fillStyle;
    tightCtx.textAlign = 'left';
    tightCtx.textBaseline = 'top';
    tightCtx.shadowColor = ctx.shadowColor;
    tightCtx.shadowBlur = ctx.shadowBlur;
    tightCtx.shadowOffsetY = ctx.shadowOffsetY;
    this.drawLaidOutTextWithIcons(tightCtx, layout, pad, pad, iconSize, 'center', letterSpacing);

    titleEl.style.backgroundImage = `url('${tightCanvas.toDataURL('image/png')}')`;
    titleEl.style.backgroundSize = `${tightCanvas.width}px ${tightCanvas.height}px`;
    titleEl.style.backgroundPosition = 'center';
    titleEl.style.width = `${tightCanvas.width}px`;
    titleEl.style.height = `${tightCanvas.height}px`;
    const left = Number.isFinite(centerX) ? centerX - tightCanvas.width / 2 : 0;
    const top = Number.isFinite(centerY) ? centerY - tightCanvas.height / 2 : 0;
    titleEl.style.position = 'absolute';
    titleEl.style.left = `${left}px`;
    titleEl.style.top = `${top}px`;
    titleEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  async updateCardIdText(card) {
    const idEl = this.cardIdTextLayer;
    if (!idEl) return;
    const text = this.normalizeCardIdText(card.cardId || '');
    if (!text) {
      idEl.style.backgroundImage = '';
      idEl.style.width = '0';
      idEl.style.height = '0';
      return;
    }

    const assets = this.getLayerAssets(card);
    const idSrc = assets.cardId;
    if (idSrc && !this.cardIdBoundsCache[idSrc]) {
      this.computeOpaqueBounds(idSrc).then((bounds) => {
        if (bounds) this.cardIdBoundsCache[idSrc] = bounds;
        this.updateCardIdText(card);
      }).catch(() => {});
    }

    const container = this.previewElement;
    if (!container) return;
    const width = Math.max(1, Math.round(container.clientWidth));
    const height = Math.max(1, Math.round(container.clientHeight));
    let boxLeft = width * 0.9;
    let boxTop = height * 0.18;
    let boxWidth = width * 0.08;
    let boxHeight = height * 0.18;

    const bounds = idSrc ? this.cardIdBoundsCache[idSrc] : null;
    if (bounds) {
      const scaleX = width / bounds.iw;
      const scaleY = height / bounds.ih;
      boxLeft = bounds.x * scaleX;
      boxTop = bounds.y * scaleY;
      boxWidth = bounds.w * scaleX;
      boxHeight = bounds.h * scaleY;
    }

    const fallbackSize = Math.max(10, Math.round(Math.min(boxWidth, boxHeight) * 0.6));
    const fontSize = Number.isFinite(Number(card.cardIdFontSize))
      ? Number(card.cardIdFontSize)
      : fallbackSize;
    const fontFamily = card.cardIdFont || 'MyriadPro-Light';
    const fontWeight = 400;
    await this.ensureFontLoaded(fontFamily, fontWeight);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cardIdColor = '#ffffff';
    ctx.font = `${fontWeight} ${fontSize}px ${this.getFontFamily(fontFamily)}`;
    ctx.fillStyle = cardIdColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    const segments = this.getCardIdSegments(text);
    const segmentSpacing = 0.5;
    const letterSpacing = 0;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const lineHeight = Math.max(fontSize * 1.2, textHeight + Math.max(2, textHeight * 0.1));
    const lineWidth = this.measureCardIdSegments(ctx, segments, segmentSpacing, letterSpacing);
    const rotatedWidth = lineHeight;
    const rotatedHeight = lineWidth;
    const scaleFit = Math.min(boxWidth / rotatedWidth, boxHeight / rotatedHeight, 1);
    const offsetY = Number(card.cardIdOffset) || 0;
    const offsetX = Number(card.cardIdOffsetX) || 0;
    const centerX = boxLeft + boxWidth / 2 + offsetX;
    const centerY = boxTop + boxHeight / 2 + offsetY;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.PI / 2);
    ctx.scale(scaleFit, scaleFit);
    this.drawCardIdSegments(
      ctx,
      segments,
      -lineWidth / 2,
      -lineHeight / 2,
      segmentSpacing,
      letterSpacing
    );
    ctx.restore();

    idEl.style.position = 'absolute';
    idEl.style.left = '0';
    idEl.style.top = '0';
    idEl.style.width = '100%';
    idEl.style.height = '100%';
    idEl.style.backgroundImage = `url('${canvas.toDataURL('image/png')}')`;
    idEl.style.backgroundSize = '100% 100%';
    idEl.style.backgroundPosition = 'center';
  }
  async updateDescriptionImage(card) {
    const descLayer = document.getElementById('descriptionImageLayer');
    if (!descLayer) return;
    const text = (card.description || '').trim();
    if (!text) {
      descLayer.style.backgroundImage = '';
      return;
    }

    if (!this.areIconsReady(text)) {
      await this.preloadIconsForText(text);
    }

    const container = this.previewElement;
    if (!container) return;
    const width = Math.max(1, Math.round(container.clientWidth));
    const height = Math.max(1, Math.round(container.clientHeight));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = Number(card.descriptionFontSize) || 18;
    const descFont = card.descriptionFont || 'Arial';
    await this.ensureFontLoaded(descFont, 700);
    ctx.font = `700 ${fontSize}px ${this.getFontFamily(descFont)}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    const containerRect = container.getBoundingClientRect();
    let centerX = width / 2;
    let centerY = height / 2;
    const descriptionWidthRatio = 0.8;
    const descriptionLineHeightScale = Number(card.descriptionLineHeightScale) || 1.0;
    let maxWidth = width * descriptionWidthRatio;

    const assets = this.getLayerAssets(card);
    const bgLowerSrc = assets.backgroundLower;
    if (bgLowerSrc && !this.bgLowerBoundsCache[bgLowerSrc]) {
      this.computeOpaqueBounds(bgLowerSrc).then((bounds) => {
        if (bounds) this.bgLowerBoundsCache[bgLowerSrc] = bounds;
        this.updateDescriptionImage(card);
      }).catch(() => {});
    }

    const bounds = bgLowerSrc ? this.bgLowerBoundsCache[bgLowerSrc] : null;
    if (bounds) {
      const scaleX = width / bounds.iw;
      const scaleY = height / bounds.ih;
      centerX = (bounds.x + bounds.w / 2) * scaleX;
      centerY = (bounds.y + bounds.h / 2) * scaleY;
      maxWidth = bounds.w * scaleX * descriptionWidthRatio;
    } else if (this.bgLowerLayer) {
      const lowerRect = this.bgLowerLayer.getBoundingClientRect();
      centerX = (lowerRect.left - containerRect.left) + (lowerRect.width / 2);
      centerY = (lowerRect.top - containerRect.top) + (lowerRect.height / 2);
      maxWidth = (lowerRect.width / containerRect.width) * width * descriptionWidthRatio;
    }

    const offset = card.descriptionPosition || { x: 0, y: 0 };
    const currentScale = this.getPreviewScale();
    const offsetX = (Number(offset.x) || 0) * currentScale;
    const offsetY = (Number(offset.y) || 0) * currentScale;
    const iconSize = Math.round(fontSize * 1.8);
    const letterSpacing = Number(card.descriptionLetterSpacing) || 0;
    const layout = this.layoutTextWithIcons(
      ctx,
      text,
      maxWidth,
      fontSize * descriptionLineHeightScale,
      iconSize,
      letterSpacing,
      1.0
    );
    const pad = Math.ceil(Math.max(iconSize * 0.2, ctx.shadowBlur + 2));

    const tightCanvas = document.createElement('canvas');
    tightCanvas.width = Math.max(1, Math.ceil(layout.width + pad * 2));
    tightCanvas.height = Math.max(1, Math.ceil(layout.height + pad * 2));
    const tightCtx = tightCanvas.getContext('2d');
    if (!tightCtx) return;
    tightCtx.font = ctx.font;
    tightCtx.fillStyle = ctx.fillStyle;
    tightCtx.textAlign = 'left';
    tightCtx.textBaseline = 'top';
    tightCtx.shadowColor = ctx.shadowColor;
    tightCtx.shadowBlur = ctx.shadowBlur;
    tightCtx.shadowOffsetY = ctx.shadowOffsetY;
    this.drawLaidOutTextWithIcons(tightCtx, layout, pad, pad, iconSize, 'center', letterSpacing);

    descLayer.style.backgroundImage = `url('${tightCanvas.toDataURL('image/png')}')`;
    descLayer.style.backgroundSize = `${tightCanvas.width}px ${tightCanvas.height}px`;
    descLayer.style.backgroundPosition = 'center';
    descLayer.style.width = `${tightCanvas.width}px`;
    descLayer.style.height = `${tightCanvas.height}px`;
    const left = Number.isFinite(centerX) ? centerX - tightCanvas.width / 2 : 0;
    const top = Number.isFinite(centerY) ? centerY - tightCanvas.height / 2 : 0;
    descLayer.style.position = 'absolute';
    descLayer.style.left = `${left}px`;
    descLayer.style.top = `${top}px`;
    descLayer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
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
    const maskUrl = this.artMaskUrl;
    if (enabled && !maskUrl) {
      this.ensureArtMask(this.imageFrameUrl, this.frameImageUrl);
    }
    if (enabled && maskUrl) {
      artImage.classList.add('crop-to-frame');
      artImage.style.setProperty('--frame-mask', `url('${maskUrl}')`);
    } else {
      artImage.classList.remove('crop-to-frame');
      artImage.style.removeProperty('--frame-mask');
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
      const card = gameState.getCard();
      const includeBleed = !!(card.export && card.export.includeBleed);

      // Bridge size @ 600 DPI
      // Cut size: 2.25" x 3.5" => 1350 x 2100
      // With bleed: 2.5" x 3.75" => 1500 x 2250
      const targetWidth = includeBleed ? 1500 : 1350;
      const targetHeight = includeBleed ? 2250 : 2100;

      const rect = this.previewElement.getBoundingClientRect();
      const currentScale = this.getPreviewScale();
      const paddingTop = parseFloat(getComputedStyle(this.previewElement).paddingTop) || 0;
      const paddingLeft = parseFloat(getComputedStyle(this.previewElement).paddingLeft) || 0;

      const scale = rect.width > 0 ? targetWidth / rect.width : 1;
      const offsetX = includeBleed ? 0 : -(paddingLeft * scale);
      const offsetY = includeBleed ? 0 : -(paddingTop * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Draw in layer order
      const assets = this.getLayerAssets(card);
      const layers = card.layers || {};
      const panelUpperVisible = layers.panelUpper ?? layers.titleBar;
      const panelLowerVisible = layers.panelLower ?? layers.bottomText;

      const drawLayer = async (src, visible = true) => {
        if (!visible || !src) return;
        const img = await this.loadImage(src);
        ctx.drawImage(img, offsetX, offsetY, rect.width * scale, rect.height * scale);
      };

      const drawArt = async () => {
        if (layers.artwork === false) return;
        const artSrc = card.artData || card.artUrl;
        if (!artSrc) return;

        const img = await this.loadImage(artSrc);
        const cardW = rect.width * scale;
        const cardH = rect.height * scale;
        const coverScale = Math.max(cardW / img.width, cardH / img.height);
        const drawW = img.width * coverScale;
        const drawH = img.height * coverScale;
        const baseX = (cardW - drawW) / 2;
        const baseY = (cardH - drawH) / 2;

        const transform = card.artTransform || { x: 0, y: 0, scale: 1 };
        const artScale = Math.max(0.5, Math.min(3, Number(transform.scale) || 1));

        const maskSrc = this.artMaskUrl;
        if (card.artCropToFrame && maskSrc) {
          const artCanvas = document.createElement('canvas');
          artCanvas.width = cardW;
          artCanvas.height = cardH;
          const artCtx = artCanvas.getContext('2d');
          if (!artCtx) return;

          artCtx.save();
          artCtx.translate(transform.x * scale, transform.y * scale);
          artCtx.scale(artScale, artScale);
          artCtx.drawImage(img, baseX, baseY, drawW, drawH);
          artCtx.restore();

          const maskImg = await this.loadImage(maskSrc);
          artCtx.globalCompositeOperation = 'destination-in';
          artCtx.drawImage(maskImg, 0, 0, cardW, cardH);
          artCtx.globalCompositeOperation = 'source-over';

          ctx.drawImage(artCanvas, offsetX, offsetY, cardW, cardH);
        } else {
          ctx.save();
          ctx.translate(offsetX + transform.x * scale, offsetY + transform.y * scale);
          ctx.scale(artScale, artScale);
          ctx.drawImage(img, baseX, baseY, drawW, drawH);
          ctx.restore();
        }
      };

      const drawCardIdText = async () => {
        if (layers.cardId === false) return;
        const raw = this.normalizeCardIdText(card.cardId || '');
        if (!raw) return;
        if (!assets.cardId) return;

        let bounds = this.cardIdBoundsCache[assets.cardId];
        if (!bounds) {
          try {
            bounds = await this.computeOpaqueBounds(assets.cardId);
            if (bounds) this.cardIdBoundsCache[assets.cardId] = bounds;
          } catch (error) {
            return;
          }
        }
        if (!bounds) return;

        const scaleX = rect.width / bounds.iw;
        const scaleY = rect.height / bounds.ih;
        const boxLeft = bounds.x * scaleX;
        const boxTop = bounds.y * scaleY;
        const boxWidth = bounds.w * scaleX;
        const boxHeight = bounds.h * scaleY;

        const fallbackSize = Math.max(10, Math.round(Math.min(boxWidth, boxHeight) * 0.6));
        const baseFontSize = Number.isFinite(Number(card.cardIdFontSize))
          ? Number(card.cardIdFontSize)
          : fallbackSize;
        const fontFamily = card.cardIdFont || 'MyriadPro-Light';
        const fontWeight = 400;
        await this.ensureFontLoaded(fontFamily, fontWeight);

        const fontSize = baseFontSize * scale;
        const cardIdColor = '#ffffff';
        ctx.save();
        ctx.font = `${fontWeight} ${fontSize}px ${this.getFontFamily(fontFamily)}`;
        ctx.fillStyle = cardIdColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 4 * scale;
        ctx.shadowOffsetY = 2 * scale;

        const segments = this.getCardIdSegments(raw);
        const segmentSpacing = 0.5 * scale;
        const letterSpacing = 0;
        const metrics = ctx.measureText('Mg');
        const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
        const lineHeight = Math.max(fontSize * 1.2, textHeight + Math.max(2, textHeight * 0.1));
        const lineWidth = this.measureCardIdSegments(ctx, segments, segmentSpacing, letterSpacing);
        const rotatedWidth = lineHeight;
        const rotatedHeight = lineWidth;
        const boxWidthPx = boxWidth * scale;
        const boxHeightPx = boxHeight * scale;
        const scaleFit = Math.min(boxWidthPx / rotatedWidth, boxHeightPx / rotatedHeight, 1);
        const idOffsetY = Number(card.cardIdOffset) || 0;
        const idOffsetX = Number(card.cardIdOffsetX) || 0;
        const centerX = offsetX + boxLeft * scale + boxWidthPx / 2 + idOffsetX * scale;
        const centerY = offsetY + boxTop * scale + boxHeightPx / 2 + idOffsetY * scale;

        ctx.translate(centerX, centerY);
        ctx.rotate(Math.PI / 2);
        ctx.scale(scaleFit, scaleFit);
        this.drawCardIdSegments(
          ctx,
          segments,
          -lineWidth / 2,
          -lineHeight / 2,
          segmentSpacing,
          letterSpacing
        );
        ctx.restore();
      };

      // Bleed
      if (layers.bleed !== false) {
        ctx.save();
        ctx.fillStyle = (card.bleed && card.bleed.color) || '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.restore();
      }

      await drawArt();

      if (layers.backgroundLower !== false) await drawLayer(assets.backgroundLower, true);
      if (layers.backgroundUpper !== false) await drawLayer(assets.backgroundUpper, true);
      if (layers.imageFrame !== false) await drawLayer(assets.imageFrame, true);
      if (layers.frameShading !== false) await drawLayer(assets.frameShading, true);
      if (layers.border !== false) await drawLayer(assets.border, true);
      if (layers.cardId !== false) await drawLayer(assets.cardId, true);
      await drawCardIdText();
      if (layers.panelBleed !== false) await drawLayer(assets.panelBleed, true);
      if (panelLowerVisible !== false) await drawLayer(assets.panelLower, true);
      if (panelUpperVisible !== false) await drawLayer(assets.panelUpper, true);

      // Cost badge layer
      if (layers.costBadge !== false) {
        const badgePath = this.getCostBadgePath(card);
        await drawLayer(badgePath, !!badgePath);
      }

      // Attack modifier layer (Roll Phase only)
      if (card.cardSubType === 'Roll Phase' && layers.attackModifier !== false) {
        await drawLayer(assets.attackModifier, !!assets.attackModifier);
      }

      const drawExportText = async (
        text,
        layerEl,
        position,
        include,
        align = 'left',
        boundsSrc = null,
        widthRatio = 0.6,
        fontFamily = 'Arial',
        baseFontSize = 18,
        lineHeightScale = 1.35,
        letterSpacing = 0,
        iconLineHeightScale = 1.0
      ) => {
        if (!include) return;
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        ctx.save();
        const fontSize = baseFontSize * scale;
        await this.ensureFontLoaded(fontFamily, 700);
        ctx.font = `700 ${fontSize}px ${this.getFontFamily(fontFamily)}`;
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 4 * scale;
        ctx.shadowOffsetY = 2 * scale;
        await this.preloadIconsForText(trimmed);

        let px;
        let py;
        let pw;
        let ph;

        if (boundsSrc) {
          let bounds = this.bgLowerBoundsCache[boundsSrc];
          if (!bounds) {
            try {
              bounds = await this.computeOpaqueBounds(boundsSrc);
              if (bounds) this.bgLowerBoundsCache[boundsSrc] = bounds;
            } catch (error) {
              // Ignore bounds failures and fall back to layer rect.
            }
          }
          if (bounds) {
            const scaleX = rect.width / bounds.iw;
            const scaleY = rect.height / bounds.ih;
            px = bounds.x * scaleX;
            py = bounds.y * scaleY;
            pw = bounds.w * scaleX;
            ph = bounds.h * scaleY;
          }
        }

        if (px === undefined || py === undefined || pw === undefined || ph === undefined) {
          const layerRect = layerEl
            ? layerEl.getBoundingClientRect()
            : this.previewElement.getBoundingClientRect();
          px = layerRect.left - rect.left;
          py = layerRect.top - rect.top;
          pw = layerRect.width;
          ph = layerRect.height;
        }
        const offset = position || { x: 0, y: 0 };
        const scaledOffsetX = (Number(offset.x) || 0) * currentScale;
        const scaledOffsetY = (Number(offset.y) || 0) * currentScale;
        const iconSize = Math.round(fontSize * 1.8);
        const scaledSpacing = (Number(letterSpacing) || 0) * scale;
        const layout = this.layoutTextWithIcons(
          ctx,
          trimmed,
          pw * widthRatio * scale,
          fontSize * lineHeightScale,
          iconSize,
          scaledSpacing,
          iconLineHeightScale
        );
        const drawX =
          offsetX +
          (px + pw / 2) * scale +
          scaledOffsetX * scale -
          layout.width / 2;
        const drawY =
          offsetY +
          (py + ph / 2) * scale +
          scaledOffsetY * scale -
          layout.height / 2;
        this.drawLaidOutTextWithIcons(ctx, layout, drawX, drawY, iconSize, align, scaledSpacing);
        ctx.restore();
      };

      // Title text
      await drawExportText(
        card.name,
        this.bgUpperLayer,
        card.titlePosition,
        layers.titleText !== false,
        'center',
        assets.backgroundUpper,
        0.8,
        card.titleFont || 'Arial',
        Number(card.titleFontSize) || 18,
        1.35,
        Number(card.titleLetterSpacing) || 0,
        1.05
      );

      // Card description text
      await drawExportText(
        card.description,
        this.bgLowerLayer,
        card.descriptionPosition,
        layers.cardText !== false,
        'center',
        assets.backgroundLower,
        0.8,
        card.descriptionFont || 'Arial',
        Number(card.descriptionFontSize) || 18,
        Number(card.descriptionLineHeightScale) || 1.0,
        Number(card.descriptionLetterSpacing) || 0,
        1.0
      );

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


  resolveIconPath(token) {
    const name = (token?.name || '').toLowerCase();
    const rawValue = (token?.value || '').toLowerCase();

    const normalizeValue = (value, allowed, fallback = 'blank') => {
      if (!value) return fallback;
      if (allowed.includes(value)) return value;
      return fallback;
    };

    const mapFolder = (folder, prefix, allowed, fallback = 'blank') => {
      const safe = normalizeValue(rawValue, allowed, fallback);
      return `Assets/Icons/${folder}/${prefix}_${safe}.png`;
    };

    if (name === 'dmg') {
      const allowed = ['1','2','3','4','5','6','7','8','9','10','blank'];
      return mapFolder('Dmg', 'dmg', allowed);
    }

    if (name === 'rdmg') {
      const allowed = ['1','2','3','4','5','6','7','8','9','10','blank'];
      return mapFolder('Rdmg', 'dmg', allowed);
    }

    if (name === 'heal') {
      const allowed = ['1','2','3','4','5','half','blank'];
      return mapFolder('Heal', 'heal', allowed);
    }

    if (name === 'prevent') {
      const allowed = ['1','2','3','4','5','half','blank'];
      return mapFolder('Prevent', 'prevent', allowed);
    }

    if (name === 'draw') {
      const allowed = ['1','2','3','4','5','blank'];
      return mapFolder('Draw', 'draw', allowed);
    }

    if (name === 'cp') {
      const allowed = ['1','2','3','4','5','blank'];
      return mapFolder('CP', 'cp', allowed);
    }

    if (name === 'dice') {
      return 'Assets/Icons/Dice/dice.png';
    }

    if (name) {
      const suffix = rawValue ? `_${rawValue}` : '';
      const key = this.normalizeStatusEffectKey(`${name}${suffix}`);
      if (key && this.statusEffectMap && this.statusEffectMap[key]) {
        return this.statusEffectMap[key];
      }
      const baseKey = this.normalizeStatusEffectKey(name);
      if (rawValue && baseKey) {
        const combined = this.normalizeStatusEffectKey(`${baseKey}_${rawValue}`);
        if (combined && this.statusEffectMap && this.statusEffectMap[combined]) {
          return this.statusEffectMap[combined];
        }
      }
      if (baseKey && this.statusEffectMap && this.statusEffectMap[baseKey]) {
        return this.statusEffectMap[baseKey];
      }
      const safe = this.normalizeStatusEffectKey(`${name}${suffix}`);
      if (safe) {
        return encodeURI(`Assets/Status effects/${safe}.png`);
      }
    }

    console.warn('No icon mapping for token:', token);
    return '';
  }

  tokenizeForLayout(text) {
    const atoms = [];
    const normalized = String(text || '')
      .replace(/&#123;|&lcub;|&lbrace;/gi, '{')
      .replace(/&#125;|&rcub;|&rbrace;/gi, '}');

    const parseToken = (raw) => {
      const cleaned = raw.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!cleaned) return null;
      const parts = cleaned.split(/[,:\s]+/).filter(Boolean);
      if (!parts.length) return null;
      return {
        name: parts[0].toLowerCase(),
        value: parts[1] ? parts[1].toLowerCase() : ''
      };
    };

    const pushWhitespaceSensitive = (segment) => {
      if (!segment) return;
      for (let i = 0; i < segment.length; i += 1) {
        const ch = segment[i];
        if (ch === '\n') {
          atoms.push({ type: 'newline' });
        } else if (ch === ' ' || ch === '\t') {
          atoms.push({ type: 'space' });
        } else {
          let j = i;
          let word = '';
          while (j < segment.length) {
            const c = segment[j];
            if (c === '\n' || c === ' ' || c === '\t') break;
            word += c;
            j += 1;
          }
          atoms.push({ type: 'text', value: word });
          i = j - 1;
        }
      }
    };

    const tokenRegex = /\{\{([^}]+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(normalized)) !== null) {
      pushWhitespaceSensitive(normalized.slice(lastIndex, match.index));
      const raw = match[1] || '';
      const token = parseToken(raw);
      if (token) {
        atoms.push({ type: 'icon', name: token.name, value: token.value });
      } else {
        pushWhitespaceSensitive(match[0]);
      }
      lastIndex = tokenRegex.lastIndex;
    }
    pushWhitespaceSensitive(normalized.slice(lastIndex));
    return atoms;
  }

  measureTextWithSpacing(ctx, text, spacing) {
    if (!spacing || spacing <= 0) {
      return ctx.measureText(text).width;
    }
    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
      width += ctx.measureText(text[i]).width;
      if (i < text.length - 1) width += spacing;
    }
    return width;
  }

  drawTextWithSpacing(ctx, text, x, y, spacing) {
    if (!spacing || spacing <= 0) {
      ctx.fillText(text, x, y);
      return ctx.measureText(text).width;
    }
    let cursorX = x;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      ctx.fillText(ch, cursorX, y);
      cursorX += ctx.measureText(ch).width;
      if (i < text.length - 1) cursorX += spacing;
    }
    return cursorX - x;
  }

  layoutTextWithIcons(
    ctx,
    text,
    maxWidth,
    lineHeight,
    iconSize,
    letterSpacing = 0,
    iconLineHeightScale = 1.0
  ) {
    const atoms = this.tokenizeForLayout(text);
    const lines = [];
    let current = [];
    let width = 0;
    const spaceWidth = ctx.measureText(' ').width - 3;
    const iconGap = Math.round(iconSize * 0.15);
    const hasIcons = atoms.some((atom) => atom.type === 'icon');
    const iconLineHeight = iconSize * iconLineHeightScale;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const minLineHeight = textHeight ? textHeight + Math.max(2, textHeight * 0.1) : lineHeight;
    let effectiveLineHeight = Math.max(lineHeight, minLineHeight);
    if (hasIcons) {
      effectiveLineHeight = Math.max(effectiveLineHeight, iconLineHeight);
    }

    const measureAtom = (atom) => {
      if (atom.type === 'text') return this.measureTextWithSpacing(ctx, atom.value, letterSpacing);
      if (atom.type === 'icon') return iconSize + iconGap;
      return spaceWidth;
    };

    const pushLine = () => {
      if (!current.length) return;
      while (current.length && current[0].type === 'space') current.shift();
      while (current.length && current[current.length - 1].type === 'space') current.pop();
      if (!current.length) return;
      let lineWidth = 0;
      current.forEach((atom) => {
        if (atom.type === 'space') {
          lineWidth += spaceWidth;
          return;
        }
        lineWidth += measureAtom(atom);
      });
      lines.push({ atoms: current, width: lineWidth });
      width = 0;
      current = [];
    };

    atoms.forEach((atom) => {
      if (atom.type === 'newline') {
        pushLine();
        return;
      }
      if (atom.type === 'space') {
        if (!current.length) return;
        width += spaceWidth;
        current.push(atom);
        return;
      }
      const itemWidth = measureAtom(atom);
      if (width + itemWidth > maxWidth && current.length > 0) {
        pushLine();
      }
      width += itemWidth;
      current.push(atom);
    });
    pushLine();

    const maxLineWidth = lines.reduce((max, line) => Math.max(max, line.width), 0);
    return {
      lines,
      width: Math.max(1, maxLineWidth),
      height: Math.max(1, lines.length * effectiveLineHeight),
      lineHeight: effectiveLineHeight,
      iconGap,
      spaceWidth
    };
  }

  drawLaidOutTextWithIcons(ctx, layout, originX, originY, iconSize, align = 'left', letterSpacing = 0) {
    const iconGap = layout.iconGap;
    const spaceWidth = layout.spaceWidth;
    const effectiveLineHeight = layout.lineHeight;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const iconYOffset = Math.max(0, (textHeight - iconSize) / 2) - Math.round(iconSize * 0.225);

    const getOpaqueBounds = (img) => {
      if (img.__opaqueBounds !== undefined) {
        return img.__opaqueBounds;
      }
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const octx = canvas.getContext('2d');
      if (!octx) return null;
      octx.drawImage(img, 0, 0);
      const data = octx.getImageData(0, 0, img.width, img.height).data;
      let minX = img.width;
      let minY = img.height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < img.height; y += 1) {
        for (let x = 0; x < img.width; x += 1) {
          const idx = (y * img.width + x) * 4 + 3;
          if (data[idx] > 8) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX || maxY < minY) {
        img.__opaqueBounds = null;
        return null;
      }
      const bounds = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
      img.__opaqueBounds = bounds;
      return bounds;
    };

    const drawIconToBox = (img, x, y, size) => {
      const bounds = getOpaqueBounds(img);
      const srcX = bounds ? bounds.x : 0;
      const srcY = bounds ? bounds.y : 0;
      const srcW = bounds ? bounds.w : img.width;
      const srcH = bounds ? bounds.h : img.height;
      const scale = size / Math.max(srcW, srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = x + (size - drawW) / 2;
      const drawY = y + (size - drawH) / 2;
      const smoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);
      ctx.imageSmoothingEnabled = smoothing;
    };

    layout.lines.forEach((line, row) => {
      let x = originX;
      if (align === 'center') {
        x += (layout.width - line.width) / 2;
      } else if (align === 'right') {
        x += (layout.width - line.width);
      }
      const y = originY + row * effectiveLineHeight;
      line.atoms.forEach((atom) => {
        if (atom.type === 'space') {
          x += spaceWidth;
          return;
        }
        if (atom.type === 'text') {
          const textWidth = this.drawTextWithSpacing(ctx, atom.value, x, y, letterSpacing);
          x += textWidth;
          return;
        }
        if (atom.type === 'icon') {
          const path = this.resolveIconPath(atom);
          if (path) {
            const cached = this.iconCache[path];
            if (cached) {
              drawIconToBox(cached, x, y + iconYOffset, iconSize);
              x += iconSize + iconGap;
              return;
            }
          }
          const boxY = y + iconYOffset;
          ctx.save();
          ctx.fillStyle = 'rgba(220, 70, 200, 0.75)';
          ctx.fillRect(x, boxY, iconSize, iconSize);
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, boxY + 0.5, iconSize - 1, iconSize - 1);
          ctx.restore();
          x += iconSize + iconGap;
        }
      });
    });
  }

}

// Initialize renderer
const renderer = new CardRenderer();

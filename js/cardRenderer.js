// Card Rendering Logic
const DTC_RENDER_COMMON = window.DTC_COMMON || {};
const deepCloneRender = DTC_RENDER_COMMON.deepClone || ((value) => JSON.parse(JSON.stringify(value)));
const DTC_RENDER_DEFAULT_LAYER_ORDER = Array.isArray(DTC_RENDER_COMMON.DEFAULT_LAYER_ORDER)
  ? [...DTC_RENDER_COMMON.DEFAULT_LAYER_ORDER]
  : [
    'cardBleed',
    'backgroundLower',
    'backgroundUpper',
    'artwork',
    'imageFrame',
    'topNameGradient',
    'bottomNameGradient',
    'frameShading',
    'border',
    'cardId',
    'panelBleed',
    'panelLower',
    'secondAbilityFrame',
    'panelUpper',
    'costBadge',
    'attackModifier',
    'titleText',
    'cardText'
  ];
const DTC_RENDER_EXPORT_SIZE = DTC_RENDER_COMMON.EXPORT_CARD_SIZE || { width: 675, height: 1050 };

class CardRenderer {
  constructor() {
    this.previewElement = document.getElementById('cardPreview');
    
    // 8-layer architecture references
    this.cardBleedLayer = document.getElementById('cardBleedLayer');
    this.artworkLayer = document.getElementById('artworkLayer');
    this.artworkCanvas = document.getElementById('artworkPreviewCanvas');
    this.artworkCtx = this.artworkCanvas ? this.artworkCanvas.getContext('2d') : null;
    this.defaultArtPath = '';
    this.bgLowerLayer = document.getElementById('backgroundLowerLayer');
    this.bgUpperLayer = document.getElementById('backgroundUpperLayer');
    this.imageFrameLayer = document.getElementById('imageFrameLayer');
    this.frameShadingLayer = document.getElementById('frameShadingLayer');
    this.frameLayer = document.getElementById('frameLayer');
    this.cardIdLayer = document.getElementById('cardIdLayer');
    this.cardIdTextLayer = document.getElementById('cardIdTextLayer');
    this.panelBleedLayer = document.getElementById('panelBleedLayer');
    this.panelLowerLayer = document.getElementById('panelLowerLayer');
    this.secondAbilityFrameLayer = document.getElementById('secondAbilityFrameLayer');
    this.costBadgeLayer = document.getElementById('costBadgeLayer');
    this.panelUpperLayer = document.getElementById('panelUpperLayer');
    this.topNameGradientLayer = document.getElementById('topNameGradientLayer');
    this.bottomNameGradientLayer = document.getElementById('bottomNameGradientLayer');
    this.titleLayer = document.getElementById('titleLayer');
    this.attackModifierLayer = document.getElementById('attackModifierLayer');
    this.cardTextLayer = document.getElementById('cardTextLayer');
    this.frameImageUrl = '';
    this.imageFrameUrl = '';
    this.artMaskUrl = '';
    this.artMaskCache = {};
    this.bgLowerBoundsCache = {};
    this.cardIdBoundsCache = {};
    this.costBadgeBoundsCache = {};
    this.costBadgeRenderCache = {};
    this.iconCache = {};
    this.iconPromises = {};
    this.descriptionLayerMap = new Map();
    this.titleLayerMap = new Map();
    this.fontManifest = null;
    this.fontMap = {};
    this.fontPromises = {};
    this.statusEffectsManifest = null;
    this.statusEffectMap = {};
    this.statusEffectIconScale = 0.81;
    this.textShadowPresets = {
      title: { color: 'rgba(0,0,0,0.42)', blur: 3, offsetX: 0, offsetY: 2 },
      description: { color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 0, offsetY: 2 }
    };
    this.previewRenderNonce = 0;
    this.tokenIconCardContext = null;
    this.renderBleedOverridePath = 'Assets/Action Cards/card_bleed.png';
    this.renderCardIdOverridePath = 'Assets/Action Cards/card_id_trimmed.png';
    this.finalExportCropMaskPath = 'Assets/Action Cards/crop_mask.png';
    this.defaultLayerOrder = [...DTC_RENDER_DEFAULT_LAYER_ORDER];

    this.assetManifest = null;
    this.loadAssetManifest();
    this.fontManifestPromise = this.loadFontManifest();
    this.loadStatusEffectsManifest();

    this._previewFitRaf = null;
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (this._previewFitRaf) cancelAnimationFrame(this._previewFitRaf);
        this._previewFitRaf = requestAnimationFrame(() => {
          this.updatePreviewViewportScale();
          this._previewFitRaf = null;
        });
      });
    }
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

  buildFontWithSize(family, sizePx, weight = 700) {
    const safeSize = Math.max(1, Math.round(Number(sizePx) || 0));
    const safeWeight = Number.isFinite(Number(weight)) ? weight : 700;
    const safeFamily = family || 'Arial';
    return `${safeWeight} ${safeSize}px ${this.getFontFamily(safeFamily)}`;
  }

  formatFontWithSize(baseFont, sizePx, fallbackFamily = 'Arial', fallbackWeight = 700) {
    const safeSize = Math.max(1, Math.round(Number(sizePx) || 0));
    const fontString = String(baseFont || '').trim();
    if (fontString && /px/.test(fontString)) {
      return fontString.replace(/(\d+(?:\.\d+)?)px/, `${safeSize}px`);
    }
    return this.buildFontWithSize(fallbackFamily, safeSize, fallbackWeight);
  }

  resolveTextShadowStyle(shadowStyle, fallbackPreset = 'description') {
    if (shadowStyle === false) return null;
    if (typeof shadowStyle === 'string') {
      const preset = this.textShadowPresets[shadowStyle];
      if (preset) return { ...preset };
      return { ...(this.textShadowPresets[fallbackPreset] || this.textShadowPresets.description) };
    }
    if (shadowStyle && typeof shadowStyle === 'object') {
      const fallback = this.textShadowPresets[fallbackPreset] || this.textShadowPresets.description;
      return {
        color: shadowStyle.color ?? fallback.color,
        blur: Number.isFinite(Number(shadowStyle.blur)) ? Number(shadowStyle.blur) : fallback.blur,
        offsetX: Number.isFinite(Number(shadowStyle.offsetX)) ? Number(shadowStyle.offsetX) : fallback.offsetX,
        offsetY: Number.isFinite(Number(shadowStyle.offsetY)) ? Number(shadowStyle.offsetY) : fallback.offsetY
      };
    }
    return { ...(this.textShadowPresets[fallbackPreset] || this.textShadowPresets.description) };
  }

  applyTextShadow(ctx, shadowStyle, scale = 1, fallbackPreset = 'description') {
    if (!ctx) return;
    const style = this.resolveTextShadowStyle(shadowStyle, fallbackPreset);
    if (!style) {
      ctx.shadowColor = 'rgba(0,0,0,0)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      return;
    }
    const safeScale = Number.isFinite(Number(scale)) ? Number(scale) : 1;
    ctx.shadowColor = style.color;
    ctx.shadowBlur = style.blur * safeScale;
    ctx.shadowOffsetX = style.offsetX * safeScale;
    ctx.shadowOffsetY = style.offsetY * safeScale;
  }

  getBaseCardMetrics() {
    // Canonical no-bleed card render size.
    const baseWidth = Number(DTC_RENDER_EXPORT_SIZE.width) || 675;
    const baseHeight = Number(DTC_RENDER_EXPORT_SIZE.height) || 1050;
    const bleedRatio = 0.0517;
    const bleedInset = baseWidth * bleedRatio;
    return {
      width: baseWidth,
      height: baseHeight,
      bleedInset
    };
  }

  getRenderMetrics(usePreviewMetrics = true) {
    if (usePreviewMetrics && this.previewElement) {
      const rect = this.previewElement.getBoundingClientRect();
      const currentScale = this.getPreviewScale();
      const paddingTop = parseFloat(getComputedStyle(this.previewElement).paddingTop) || 0;
      return {
        rect,
        currentScale,
        padding: paddingTop
      };
    }
    const base = this.getBaseCardMetrics();
    return {
      rect: { width: base.width, height: base.height, left: 0, top: 0 },
      currentScale: 1,
      padding: base.bleedInset
    };
  }

  async getArtMaskForAssets(imageFrameSrc, frameSrc) {
    const provided = this.getArtMaskPath();
    if (provided) return provided;
    const sources = [imageFrameSrc, frameSrc].filter(Boolean);
    if (!sources.length) return '';
    const key = sources.join('|');
    if (this.artMaskCache[key]) return this.artMaskCache[key];
    try {
      const primary = sources[0];
      const mask = await this.buildWindowMaskFromFrame(primary);
      if (mask) {
        this.artMaskCache[key] = mask;
        return mask;
      }
      if (sources[1]) {
        const fallback = await this.buildWindowMaskFromFrame(sources[1]);
        if (fallback) {
          this.artMaskCache[key] = fallback;
          return fallback;
        }
      }
    } catch (error) {
      console.warn('Failed to build art mask:', error);
    }
    return '';
  }

  getDefaultLayerOrder() {
    return Array.isArray(this.defaultLayerOrder)
      ? [...this.defaultLayerOrder]
      : [];
  }

  normalizeLayerOrder(order) {
    const fallback = this.getDefaultLayerOrder();
    if (typeof DTC_RENDER_COMMON.normalizeLayerOrder === 'function') {
      return DTC_RENDER_COMMON.normalizeLayerOrder(order, fallback);
    }
    return fallback;
  }

  getLayerOrder(card) {
    return this.normalizeLayerOrder(card?.layerOrder);
  }

  getLayerElementForKey(key) {
    switch (key) {
      case 'cardBleed':
        return this.cardBleedLayer;
      case 'backgroundLower':
        return this.bgLowerLayer;
      case 'backgroundUpper':
        return this.bgUpperLayer;
      case 'artwork':
        return this.artworkLayer;
      case 'imageFrame':
        return this.imageFrameLayer;
      case 'topNameGradient':
        return this.topNameGradientLayer;
      case 'bottomNameGradient':
        return this.bottomNameGradientLayer;
      case 'frameShading':
        return this.frameShadingLayer;
      case 'border':
        return this.frameLayer;
      case 'cardId':
        return this.cardIdLayer;
      case 'panelBleed':
        return this.panelBleedLayer;
      case 'panelLower':
        return this.panelLowerLayer;
      case 'secondAbilityFrame':
        return this.secondAbilityFrameLayer;
      case 'panelUpper':
        return this.panelUpperLayer;
      case 'costBadge':
        return this.costBadgeLayer;
      case 'attackModifier':
        return this.attackModifierLayer;
      case 'titleText':
        return this.titleLayer;
      case 'cardText':
        return this.cardTextLayer;
      default:
        return null;
    }
  }

  applyLayerOrder(cardOrOrder) {
    const order = Array.isArray(cardOrOrder)
      ? cardOrOrder
      : this.getLayerOrder(cardOrOrder);
    const normalized = this.normalizeLayerOrder(order);
    let zIndex = 1;
    normalized.forEach((key) => {
      const el = this.getLayerElementForKey(key);
      if (el) {
        el.style.zIndex = String(zIndex);
      }
      if (key === 'cardId' && this.cardIdTextLayer) {
        this.cardIdTextLayer.style.zIndex = String(zIndex + 1);
        zIndex += 2;
        return;
      }
      zIndex += 1;
    });
    if (this.cardIdTextLayer && !normalized.includes('cardId')) {
      this.cardIdTextLayer.style.zIndex = String(zIndex + 1);
    }
  }

  getIconOverlayText(token) {
    const name = (token?.name || '').toLowerCase();
    if (name !== 'prevent' && name !== 'damage' && name !== 'dmg' && name !== 'rdmg') return '';
    const raw = String(token?.value || '').trim();
    if (!raw || raw === 'blank' || raw === 'half') return '';
    return raw;
  }

  getIconOverlayScale(token) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'damage' || name === 'dmg' || name === 'rdmg') return 0.8850086;
    return 1.0;
  }

  getIconOverlaySizeAdjust(token) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'damage' || name === 'dmg' || name === 'rdmg') return -1;
    return 0;
  }

  getIconOverlayYOffsetAdjust(token, iconSize) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'damage' || name === 'dmg' || name === 'rdmg') return iconSize * 0.02;
    return 0;
  }

  splitTokenParts(raw) {
    const cleaned = String(raw || '')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return [];
    const parts = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < cleaned.length; i += 1) {
      const ch = cleaned[i];
      if (ch === '(') {
        depth += 1;
        current += ch;
        continue;
      }
      if (ch === ')' && depth > 0) {
        depth -= 1;
        current += ch;
        continue;
      }
      if (depth === 0 && (ch === ',' || ch === ':' || ch === ' ' || ch === '\t')) {
        if (current) {
          parts.push(current);
          current = '';
        }
        continue;
      }
      current += ch;
    }
    if (current) parts.push(current);
    return parts;
  }

  parseTokenString(raw) {
    const parts = this.splitTokenParts(raw);
    if (!parts.length) return null;
    const name = parts[0].toLowerCase();
    const value = parts[1] ? parts[1].toLowerCase() : '';
    const color = parts[2] ? parts.slice(2).join(' ') : '';
    return { name, value, color };
  }

  parseIconColor(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    const hexMatch = raw.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      let hex = hexMatch[1].toLowerCase();
      if (hex.length === 3) {
        hex = hex.split('').map((ch) => ch + ch).join('');
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, key: `#${hex}` };
    }
    const rgbMatch = raw.match(/^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i);
    if (rgbMatch) {
      const clamp = (val) => Math.max(0, Math.min(255, Number(val)));
      const r = clamp(rgbMatch[1]);
      const g = clamp(rgbMatch[2]);
      const b = clamp(rgbMatch[3]);
      return { r, g, b, key: `rgb(${r}, ${g}, ${b})` };
    }
    return null;
  }

  tintStraightIcon(base, colorInfo) {
    if (!base || !colorInfo) return null;
    const canvas = document.createElement('canvas');
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(base, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const target = { r: 141, g: 147, b: 150 };
    const threshold = 40;
    const thresholdSq = threshold * threshold;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha === 0) continue;
      const dr = data[i] - target.r;
      const dg = data[i + 1] - target.g;
      const db = data[i + 2] - target.b;
      const distSq = (dr * dr) + (dg * dg) + (db * db);
      if (distSq <= thresholdSq) {
        data[i] = colorInfo.r;
        data[i + 1] = colorInfo.g;
        data[i + 2] = colorInfo.b;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  tintAbilityTriggerIcon(base, colorInfo) {
    if (!base || !colorInfo) return null;
    const canvas = document.createElement('canvas');
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(base, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (!alpha) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      data[i] = Math.round(colorInfo.r * luminance);
      data[i + 1] = Math.round(colorInfo.g * luminance);
      data[i + 2] = Math.round(colorInfo.b * luminance);
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  getIconImageForAtom(atom, path) {
    if (!path) return null;
    const base = this.iconCache[path];
    if (!base) return null;
    const name = (atom?.name || '').toLowerCase();
    if (name !== 'straight' && name !== 'at' && name !== 'abilitydice') return base;
    const colorInfo = this.parseIconColor(atom?.color || '');
    if (!colorInfo) return base;
    const cacheKey = `tint:${path}:${colorInfo.key}`;
    if (this.iconCache[cacheKey]) return this.iconCache[cacheKey];
    const tinted = (name === 'at' || name === 'abilitydice')
      ? this.tintAbilityTriggerIcon(base, colorInfo)
      : this.tintStraightIcon(base, colorInfo);
    if (tinted) {
      this.iconCache[cacheKey] = tinted;
      return tinted;
    }
    return base;
  }

  getTokenRepeatCount(token) {
    const name = (token?.name || '').toLowerCase();
    if (name !== 'abilitydice') return 1;
    const seq = this.getAbilityDiceSequence(token);
    if (seq.length) return seq.length;
    const raw = Number.parseInt(String(token?.value || '').trim(), 10);
    if (!Number.isFinite(raw)) return 1;
    return Math.max(1, Math.min(12, raw));
  }

  getAbilityDiceGapPx(iconSizeForAtom) {
    // ability_dice source art includes transparent edge pixels;
    // use a negative gap so visible faces touch.
    void iconSizeForAtom;
    return -12;
  }

  getAbilityDiceVariant(token) {
    const value = String(token?.value || '').trim().toLowerCase();
    if (value === 'small' || value === 'large') return value;
    return '';
  }

  getAbilityDiceSequence(token) {
    const value = String(token?.value || '').trim().toUpperCase();
    if (!value) return [];
    if (value === 'SMALL' || value === 'LARGE') return [];
    if (/^[A-F]+$/.test(value)) return value.split('');
    return [];
  }

  getAbilityDiceIconForSlot(slot, card = null) {
    const safeSlot = String(slot || '').trim().toUpperCase();
    if (!/^[A-F]$/.test(safeSlot)) return '';
    const sourceCard = card || this.tokenIconCardContext || null;
    const entries = Array.isArray(sourceCard?.abilityDiceEntries) ? sourceCard.abilityDiceEntries : [];
    const match = entries.find((entry) => String(entry?.slot || '').toUpperCase() === safeSlot);
    if (!match) return '';
    return String(match.iconData || match.iconUrl || '').trim();
  }

  getAbilityDiceCompositeIcon(atom, slot) {
    const basePath = encodeURI('Assets/Icons/Ability Dice/ability_dice.png');
    const base = this.getIconImageForAtom(atom, basePath) || this.iconCache[basePath] || null;
    if (!base) return null;

    const overlaySrc = this.getAbilityDiceIconForSlot(slot);
    if (!overlaySrc) return base;
    const overlay = this.iconCache[overlaySrc] || null;
    if (!overlay) return base;

    const colorKey = String(atom?.color || '').trim().toLowerCase();
    const key = `abilitydice:composite:${slot}:${overlaySrc}:${colorKey}`;
    if (this.iconCache[key]) return this.iconCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return base;
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

    const measureOpaqueBounds = (img) => {
      const probe = document.createElement('canvas');
      probe.width = img.width;
      probe.height = img.height;
      const pctx = probe.getContext('2d');
      if (!pctx) return null;
      pctx.drawImage(img, 0, 0);
      const data = pctx.getImageData(0, 0, img.width, img.height).data;
      let minX = img.width;
      let minY = img.height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < img.height; y += 1) {
        for (let x = 0; x < img.width; x += 1) {
          const a = data[(y * img.width + x) * 4 + 3];
          if (a <= 8) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < minX || maxY < minY) return null;
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    };

    const srcBounds = measureOpaqueBounds(overlay) || { x: 0, y: 0, w: overlay.width || 1, h: overlay.height || 1 };
    const fit = Math.min(canvas.width, canvas.height) * 0.78;
    const scale = fit / Math.max(srcBounds.w || 1, srcBounds.h || 1);
    const drawW = (srcBounds.w || 1) * scale;
    const drawH = (srcBounds.h || 1) * scale;
    const drawX = (canvas.width - drawW) / 2 - (canvas.width * 0.05);
    const drawY = (canvas.height - drawH) / 2 - (canvas.height * 0.05);
    ctx.drawImage(
      overlay,
      srcBounds.x,
      srcBounds.y,
      srcBounds.w,
      srcBounds.h,
      drawX,
      drawY,
      drawW,
      drawH
    );

    this.iconCache[key] = canvas;
    return canvas;
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
    const setLayerBackground = (layer, src) => {
      if (!layer) return;
      layer.style.backgroundImage = src ? `url('${src}')` : '';
    };

    // Apply frame as background image to frame layer
    setLayerBackground(this.frameLayer, assets.border);
    this.frameImageUrl = assets.border || '';

    // Apply card bleed (bottom-most)
    this.applyCardBleedLayerBackground(assets.cardBleed);

    // Apply background lower
    setLayerBackground(this.bgLowerLayer, assets.backgroundLower);

    // Apply background upper
    setLayerBackground(this.bgUpperLayer, assets.backgroundUpper);

    // Apply image frame
    setLayerBackground(this.imageFrameLayer, assets.imageFrame);
    this.imageFrameUrl = assets.imageFrame || '';

    // Apply frame shading
    setLayerBackground(this.frameShadingLayer, assets.frameShading);

    // Apply card ID layer (above frame)
    setLayerBackground(this.cardIdLayer, assets.cardId);
    if (this.cardIdTextLayer) {
      this.updateCardIdText(gameState.getCard());
    }

    // Apply panel upper (title bar area)
    setLayerBackground(this.panelUpperLayer, assets.panelUpper);

    // Apply panel lower (text area)
    setLayerBackground(this.panelLowerLayer, assets.panelLower);

    // Apply panel bleed
    setLayerBackground(this.panelBleedLayer, assets.panelBleed);

    // Apply second ability frame
    setLayerBackground(this.secondAbilityFrameLayer, assets.secondAbilityFrame);

    // Apply name gradients
    setLayerBackground(this.topNameGradientLayer, assets.topNameGradient);
    setLayerBackground(this.bottomNameGradientLayer, assets.bottomNameGradient);

    // Apply attack modifier (Roll Phase only)
    setLayerBackground(this.attackModifierLayer, assets.attackModifier);

    this.artMaskUrl = this.getArtMaskPath();
    if (!this.artMaskUrl) {
      this.ensureArtMask(assets.imageFrame, assets.border);
    }
  }

  applyCardBleedLayerBackground(src) {
    if (!this.cardBleedLayer) return;
    const base = String(src || '').trim();

    if (!base) {
      this.cardBleedLayer.style.backgroundImage = '';
      this.cardBleedLayer.style.removeProperty('background-size');
      this.cardBleedLayer.style.removeProperty('background-repeat');
      this.cardBleedLayer.style.removeProperty('background-position');
      this.cardBleedLayer.style.removeProperty('-webkit-mask-image');
      this.cardBleedLayer.style.removeProperty('mask-image');
      this.cardBleedLayer.style.removeProperty('-webkit-mask-size');
      this.cardBleedLayer.style.removeProperty('mask-size');
      this.cardBleedLayer.style.removeProperty('-webkit-mask-repeat');
      this.cardBleedLayer.style.removeProperty('mask-repeat');
      this.cardBleedLayer.style.removeProperty('-webkit-mask-position');
      this.cardBleedLayer.style.removeProperty('mask-position');
      return;
    }

    this.cardBleedLayer.style.backgroundImage = `url('${base}')`;
    this.cardBleedLayer.style.backgroundSize = 'cover';
    this.cardBleedLayer.style.backgroundRepeat = 'no-repeat';
    this.cardBleedLayer.style.backgroundPosition = 'center';
    this.cardBleedLayer.style.removeProperty('-webkit-mask-image');
    this.cardBleedLayer.style.removeProperty('mask-image');
    this.cardBleedLayer.style.removeProperty('-webkit-mask-size');
    this.cardBleedLayer.style.removeProperty('mask-size');
    this.cardBleedLayer.style.removeProperty('-webkit-mask-repeat');
    this.cardBleedLayer.style.removeProperty('mask-repeat');
    this.cardBleedLayer.style.removeProperty('-webkit-mask-position');
    this.cardBleedLayer.style.removeProperty('mask-position');
  }

  render(card) {
    if (!card) return;
    this.tokenIconCardContext = card;
    this.clearPreviewOutputMask();
    this.updatePreviewViewportScale();

    // Update card inner background color/gradient
    this.updateCardStyle(card);

    // Update text content
    this.updateCardContent(card);
    this.updateArtTransform(card);

    // Apply assets based on card type/subtype
    this.applyAssetsForCardType(card.cardType, card.cardSubType);

    // Apply element visibility toggles
    this.updateVisibility(card);
    // Apply layer stacking order
    this.applyLayerOrder(card);

    // Apply cost badge
    this.updateCostBadge(card);

    // Apply art crop to frame
    this.updateArtCrop(card);
    // Keep art preview in sync
    this.renderArtPreview(card);
  }

  updatePreviewViewportScale() {
    const container = document.querySelector('.preview-container');
    if (!container) return;
    // Lock preview zoom so moving the window across monitors (different DPI/scaling)
    // does not change card sizing/placement.
    container.style.setProperty('--zoom-scale', '1');
  }

  clearPreviewOutputMask() {
    if (!this.previewElement) return;
    this.previewElement.style.removeProperty('-webkit-mask-image');
    this.previewElement.style.removeProperty('mask-image');
    this.previewElement.style.removeProperty('-webkit-mask-size');
    this.previewElement.style.removeProperty('mask-size');
    this.previewElement.style.removeProperty('-webkit-mask-position');
    this.previewElement.style.removeProperty('mask-position');
    this.previewElement.style.removeProperty('-webkit-mask-repeat');
    this.previewElement.style.removeProperty('mask-repeat');
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
      if ((atom.name || '').toLowerCase() === 'abilitydice') {
        paths.push(encodeURI('Assets/Icons/Ability Dice/ability_dice.png'));
        const seq = this.getAbilityDiceSequence(atom);
        seq.forEach((slot) => {
          const slotSrc = this.getAbilityDiceIconForSlot(slot);
          if (slotSrc) paths.push(slotSrc);
        });
      }
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

  getPlainTextFromRuns(runs) {
    if (!Array.isArray(runs)) return '';
    return runs.map((run) => String(run.text || '')).join('');
  }

  collectFontsFromRuns(runs, fallbackFont) {
    const fonts = new Set();
    const base = (fallbackFont || '').trim();
    if (base) fonts.add(base);
    (runs || []).forEach((run) => {
      const font = (run && run.font) ? String(run.font).trim() : '';
      if (font) fonts.add(font);
    });
    return Array.from(fonts);
  }

  normalizeDescriptionBlock(block, fallback, fallbackId) {
    const safeBlock = (block && typeof block === 'object') ? block : {};
    const safeFallback = (fallback && typeof fallback === 'object') ? fallback : {};
    const id = String(safeBlock.id || fallbackId || '').trim() || String(fallbackId || 'desc-1');
    const description = safeBlock.description !== undefined
      ? String(safeBlock.description)
      : String(safeFallback.description || '');
    const descriptionRich = Array.isArray(safeBlock.descriptionRich)
      ? safeBlock.descriptionRich
      : (Array.isArray(safeFallback.descriptionRich) ? safeFallback.descriptionRich : []);
    const descriptionHtml = safeBlock.descriptionHtml !== undefined
      ? String(safeBlock.descriptionHtml || '')
      : String(safeFallback.descriptionHtml || '');
    const rawPos = safeBlock.position || safeFallback.position || {};
    const position = {
      x: Number(rawPos.x) || 0,
      y: Number(rawPos.y) || 0
    };
    const rawScale = safeBlock.scale !== undefined ? safeBlock.scale : safeFallback.scale;
    const scale = Number.isFinite(Number(rawScale)) ? Number(rawScale) : 1;
    return {
      id,
      description,
      descriptionRich,
      descriptionHtml,
      position,
      scale
    };
  }

  normalizeTitleBlock(block, fallback, fallbackId) {
    const safeBlock = (block && typeof block === 'object') ? block : {};
    const safeFallback = (fallback && typeof fallback === 'object') ? fallback : {};
    const id = String(safeBlock.id || fallbackId || '').trim() || String(fallbackId || 'title-1');
    const text = safeBlock.text !== undefined
      ? String(safeBlock.text)
      : String(safeFallback.text || '');
    const rawPos = safeBlock.position || safeFallback.position || {};
    const position = {
      x: Number(rawPos.x) || 0,
      y: Number(rawPos.y) || 0
    };
    return {
      id,
      text,
      position
    };
  }

  getDescriptionBlocks(card) {
    if (Array.isArray(card.descriptionBlocks) && card.descriptionBlocks.length) {
      return card.descriptionBlocks.map((block, idx) => (
        this.normalizeDescriptionBlock(block, null, `desc-${idx + 1}`)
      ));
    }
    const fallback = {
      description: card.description || '',
      descriptionRich: Array.isArray(card.descriptionRich) ? card.descriptionRich : [],
      descriptionHtml: card.descriptionHtml || '',
      position: card.descriptionPosition || { x: 0, y: 0 },
      scale: 1
    };
    return [this.normalizeDescriptionBlock({}, fallback, 'desc-1')];
  }

  getTitleBlocks(card) {
    if (Array.isArray(card.titleBlocks) && card.titleBlocks.length) {
      return card.titleBlocks.map((block, idx) => (
        this.normalizeTitleBlock(block, null, `title-${idx + 1}`)
      ));
    }
    const fallback = {
      text: card.name || '',
      position: card.titlePosition || { x: 1.4874028450301893, y: -1.2779890290537477 }
    };
    return [this.normalizeTitleBlock({}, fallback, 'title-1')];
  }

  getDescriptionRuns(card, block = null) {
    const source = block || card || {};
    if (Array.isArray(source.descriptionRich) && source.descriptionRich.length) {
      return source.descriptionRich;
    }
    const text = (source.description || '').trim();
    if (!text) return [];
    return [{ text, font: card.descriptionFont || 'Arial' }];
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

  getRenderLayerAssets(card, options = {}) {
    const assets = { ...(this.getLayerAssets(card) || {}) };
    const applyOverrides = options.applyAssetOverrides === true;
    // Use explicit overrides only when requested; default path should match preview assets exactly.
    if (applyOverrides) {
      if (this.renderBleedOverridePath) assets.cardBleed = this.renderBleedOverridePath;
      if (this.renderCardIdOverridePath) assets.cardId = this.renderCardIdOverridePath;
    }
    return assets;
  }

  getPreviewScale() {
    const previewContainer = document.querySelector('.preview-container');
    const baseRaw = previewContainer
      ? getComputedStyle(previewContainer).getPropertyValue('--card-width')
      : '';
    const baseWidth = parseFloat(baseRaw) || 673;
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

  trimTransparentCanvas(canvas, alphaThreshold = 1) {
    const threshold = Number.isFinite(Number(alphaThreshold)) ? Number(alphaThreshold) : 1;
    if (!canvas) return canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = (y * width + x) * 4 + 3;
        if (data[idx] >= threshold) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return canvas;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const trimmed = document.createElement('canvas');
    trimmed.width = w;
    trimmed.height = h;
    const trimmedCtx = trimmed.getContext('2d');
    if (!trimmedCtx) return canvas;
    trimmedCtx.drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
    return trimmed;
  }

  scaleCanvas(canvas, targetWidth, targetHeight) {
    if (!canvas) return canvas;
    const width = Math.max(1, Math.round(Number(targetWidth) || 0));
    const height = Math.max(1, Math.round(Number(targetHeight) || 0));
    if (!width || !height) return canvas;
    const output = document.createElement('canvas');
    output.width = width;
    output.height = height;
    const ctx = output.getContext('2d');
    if (!ctx) return canvas;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, width, height);
    return output;
  }

  forceOpaqueBorder(canvas, thicknessPx = 2) {
    if (!canvas) return canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    const width = canvas.width;
    const height = canvas.height;
    if (width < 3 || height < 3) return canvas;

    const thickness = Math.max(1, Math.min(4, Math.round(Number(thicknessPx) || 1)));
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const idx = (x, y) => (y * width + x) * 4;

    const copyPixel = (sx, sy, tx, ty) => {
      const s = idx(sx, sy);
      const t = idx(tx, ty);
      data[t] = data[s];
      data[t + 1] = data[s + 1];
      data[t + 2] = data[s + 2];
      data[t + 3] = 255;
    };

    const innerLeft = Math.min(width - 1, thickness);
    const innerRight = Math.max(0, width - 1 - thickness);
    const innerTop = Math.min(height - 1, thickness);
    const innerBottom = Math.max(0, height - 1 - thickness);

    // Left and right borders
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < thickness; x += 1) {
        copyPixel(innerLeft, y, x, y);
      }
      for (let x = width - thickness; x < width; x += 1) {
        copyPixel(innerRight, y, x, y);
      }
    }

    // Top and bottom borders
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < thickness; y += 1) {
        copyPixel(x, innerTop, x, y);
      }
      for (let y = height - thickness; y < height; y += 1) {
        copyPixel(x, innerBottom, x, y);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  async applyAlphaMaskToCanvas(canvas, maskSrc) {
    if (!canvas || !maskSrc) return canvas;
    let maskImg;
    try {
      maskImg = await this.loadImage(encodeURI(maskSrc));
    } catch (error) {
      console.warn('Failed to load export crop mask:', maskSrc, error);
      return canvas;
    }
    if (!maskImg) return canvas;

    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const ctx = output.getContext('2d');
    if (!ctx) return canvas;
    ctx.clearRect(0, 0, output.width, output.height);
    ctx.drawImage(canvas, 0, 0, output.width, output.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskImg, 0, 0, output.width, output.height);
    return output;
  }

  async applyOuterBoundsMaskToCanvas(canvas, maskSrc, options = {}) {
    if (!canvas || !maskSrc) return canvas;
    const targetExportW = Number(DTC_RENDER_EXPORT_SIZE.width) || 675;
    const targetExportH = Number(DTC_RENDER_EXPORT_SIZE.height) || 1050;
    let cropToBounds = options.cropToBounds === true;
    // Never resize/crop dimensions when already on final export size.
    if (
      cropToBounds &&
      Math.abs(canvas.width - targetExportW) <= 1 &&
      Math.abs(canvas.height - targetExportH) <= 1
    ) {
      cropToBounds = false;
    }

    let bounds = null;
    try {
      bounds = await this.computeOpaqueBounds(maskSrc);
    } catch (error) {
      console.warn('Failed to compute bleed bounds from mask:', maskSrc, error);
      return canvas;
    }
    if (!bounds) return canvas;

    // If canvas is already at the no-bleed target size (same as mask opaque bounds),
    // do not re-apply the mask offset from the larger source sheet.
    const matchesOpaqueSize =
      Math.abs(canvas.width - bounds.w) <= 1 &&
      Math.abs(canvas.height - bounds.h) <= 1;

    let x;
    let y;
    let w;
    let h;
    if (matchesOpaqueSize) {
      x = 0;
      y = 0;
      w = canvas.width;
      h = canvas.height;
    } else {
      const sx = canvas.width / bounds.iw;
      const sy = canvas.height / bounds.ih;
      x = Math.max(0, Math.round(bounds.x * sx));
      y = Math.max(0, Math.round(bounds.y * sy));
      w = Math.max(1, Math.min(canvas.width - x, Math.round(bounds.w * sx)));
      h = Math.max(1, Math.min(canvas.height - y, Math.round(bounds.h * sy)));
    }

    // Keep fixed size by default; optionally crop to bleed bounds.
    const output = document.createElement('canvas');
    output.width = cropToBounds ? w : canvas.width;
    output.height = cropToBounds ? h : canvas.height;
    const ctx = output.getContext('2d');
    if (!ctx) return canvas;
    if (cropToBounds) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, output.width, output.height);
      ctx.drawImage(canvas, 0, 0, output.width, output.height);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    return output;
  }


  async drawArtToContext(ctx, card, rect, scale, offsetX, offsetY, ignoreTransform = false, ignoreMask = false, maskOverride = null, maskBounds = null) {
    const layers = card.layers || {};
    if (layers.artwork === false) return;
    const artSrc = card.artData || card.artUrl;
    if (!artSrc) return;

    const img = await this.loadImage(artSrc);
    let srcX = 0;
    let srcY = 0;
    let srcW = img.width;
    let srcH = img.height;
    if (
      maskBounds
      && img.width === maskBounds.iw
      && img.height === maskBounds.ih
    ) {
      srcX = maskBounds.x;
      srcY = maskBounds.y;
      srcW = maskBounds.w;
      srcH = maskBounds.h;
    }
    const cardW = rect.width * scale;
    const cardH = rect.height * scale;
    if (ignoreTransform) {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, offsetX, offsetY, cardW, cardH);
      return;
    }
    const coverScale = Math.max(cardW / srcW, cardH / srcH);
    const drawW = srcW * coverScale;
    const drawH = srcH * coverScale;
    const baseX = (cardW - drawW) / 2;
    const baseY = (cardH - drawH) / 2;

    const useTransform = !card.artWasCropped && !ignoreTransform;
    const transform = useTransform ? (card.artTransform || { x: 0, y: 0, scale: 1 }) : { x: 0, y: 0, scale: 1 };
    const artScale = Math.max(0.5, Math.min(3, Number(transform.scale) || 1));

    const maskUrl = maskOverride || this.artMaskUrl;
    if (!ignoreMask && card.artCropToFrame && maskUrl) {
      const artCanvas = document.createElement('canvas');
      artCanvas.width = cardW;
      artCanvas.height = cardH;
      const artCtx = artCanvas.getContext('2d');
      if (!artCtx) return;

      artCtx.save();
      artCtx.translate(transform.x * scale, transform.y * scale);
      artCtx.scale(artScale, artScale);
      artCtx.drawImage(img, srcX, srcY, srcW, srcH, baseX, baseY, drawW, drawH);
      artCtx.restore();

      const maskImg = await this.loadImage(maskUrl);
      artCtx.globalCompositeOperation = 'destination-in';
      if (
        maskBounds
        && maskImg
        && maskImg.width === maskBounds.iw
        && maskImg.height === maskBounds.ih
      ) {
        artCtx.drawImage(
          maskImg,
          maskBounds.x,
          maskBounds.y,
          maskBounds.w,
          maskBounds.h,
          0,
          0,
          cardW,
          cardH
        );
      } else {
        artCtx.drawImage(maskImg, 0, 0, cardW, cardH);
      }
      artCtx.globalCompositeOperation = 'source-over';

      ctx.drawImage(artCanvas, offsetX, offsetY, cardW, cardH);
      return;
    }

    ctx.save();
    ctx.translate(offsetX + transform.x * scale, offsetY + transform.y * scale);
    ctx.scale(artScale, artScale);
    ctx.drawImage(img, srcX, srcY, srcW, srcH, baseX, baseY, drawW, drawH);
    ctx.restore();
  }

  getCostBadgeBasePath() {
    const costMap = this.assetManifest?.CostBadge || {};
    if (costMap['0']) return costMap['0'];
    const first = Object.values(costMap)[0];
    return first || '';
  }

  getLayerBackgroundUrl(el) {
    if (!el) return '';
    const raw = el.style.backgroundImage || '';
    const match = raw.match(/url\\(["']?(.*?)["']?\\)/);
    return match ? match[1] : '';
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
        this.renderArtPreview(gameState.getCard());
        return;
      }
      if (sources[1]) {
        const fallback = await this.buildWindowMaskFromFrame(sources[1]);
        if (fallback) {
          this.artMaskCache[key] = fallback;
          this.artMaskUrl = fallback;
          this.updateArtCrop(gameState.getCard());
          this.renderArtPreview(gameState.getCard());
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

    // Card bleed
    if (this.cardBleedLayer) {
      this.cardBleedLayer.style.opacity = layers.cardBleed === false ? '0' : '1';
      this.cardBleedLayer.style.pointerEvents = layers.cardBleed === false ? 'none' : 'auto';
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

    // Second ability frame
    if (this.secondAbilityFrameLayer) {
      this.secondAbilityFrameLayer.style.opacity = layers.secondAbilityFrame === false ? '0' : '1';
      this.secondAbilityFrameLayer.style.pointerEvents = layers.secondAbilityFrame === false ? 'none' : 'auto';
    }

    // Title bar (Panel Upper layer)
    if (this.panelUpperLayer) {
      this.panelUpperLayer.style.opacity = panelUpperVisible === false ? '0' : '1';
      this.panelUpperLayer.style.pointerEvents = panelUpperVisible === false ? 'none' : 'auto';
    }

    // Name gradients
    if (this.topNameGradientLayer) {
      this.topNameGradientLayer.style.opacity = layers.topNameGradient === false ? '0' : '1';
      this.topNameGradientLayer.style.pointerEvents = layers.topNameGradient === false ? 'none' : 'auto';
    }
    if (this.bottomNameGradientLayer) {
      this.bottomNameGradientLayer.style.opacity = layers.bottomNameGradient === false ? '0' : '1';
      this.bottomNameGradientLayer.style.pointerEvents = layers.bottomNameGradient === false ? 'none' : 'auto';
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

  syncTitleLayers(blocks) {
    if (!this.titleLayer) return new Map();
    if (!this.titleLayerMap) this.titleLayerMap = new Map();
    const seen = new Set();
    blocks.forEach((block, idx) => {
      const id = block.id || `title-${idx + 1}`;
      let layer = this.titleLayerMap.get(id);
      if (!layer) {
        if (idx === 0) {
          const existing = document.getElementById('cardTitleBar');
          if (existing && !Array.from(this.titleLayerMap.values()).includes(existing)) {
            layer = existing;
          }
        }
        if (!layer) {
          layer = document.createElement('div');
          layer.className = 'card-title-image';
          this.titleLayer.appendChild(layer);
        }
        this.titleLayerMap.set(id, layer);
      }
      layer.dataset.titleId = id;
      seen.add(id);
    });

    for (const [id, layer] of this.titleLayerMap.entries()) {
      if (!seen.has(id)) {
        layer.remove();
        this.titleLayerMap.delete(id);
      }
    }

    return this.titleLayerMap;
  }

  async renderTitleBlockImage(card, block, titleEl, base) {
    if (!titleEl || !base) return;
    const text = (block.text || '').trim();
    if (!text) {
      titleEl.style.backgroundImage = '';
      const hasSize = !!titleEl.style.width && !!titleEl.style.height;
      if (!hasSize) {
        titleEl.style.width = '0px';
        titleEl.style.height = '0px';
        titleEl.style.left = '0px';
        titleEl.style.top = '0px';
        titleEl.style.transform = 'translate(0px, 0px)';
        titleEl.style.pointerEvents = 'none';
      } else {
        titleEl.style.pointerEvents = 'auto';
      }
      return;
    }

    if (!this.areIconsReady(text)) {
      await this.preloadIconsForText(text);
    }

    const { width, height, centerX, centerY, maxWidth } = base;
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
    this.applyTextShadow(ctx, 'title', 1, 'title');

    const offset = block.position || { x: 0, y: 0 };
    const currentScale = this.getPreviewScale();
    const offsetX = (Number(offset.x) || 0) * currentScale;
    const offsetY = (Number(offset.y) || 0) * currentScale;
    const iconSize = Math.round(fontSize * 0.9);
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
    tightCtx.shadowOffsetX = ctx.shadowOffsetX;
    tightCtx.shadowOffsetY = ctx.shadowOffsetY;
    this.drawLaidOutTextWithIcons(tightCtx, layout, pad, pad, iconSize, 'center', letterSpacing);

    titleEl.style.pointerEvents = 'auto';
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

  async updateTitleImage(card) {
    const blocks = this.getTitleBlocks(card);
    if (!blocks.length) return;
    const layerMap = this.syncTitleLayers(blocks);
    if (!layerMap || !layerMap.size) return;

    const container = this.previewElement;
    if (!container) return;
    const width = Math.max(1, Math.round(container.clientWidth));
    const height = Math.max(1, Math.round(container.clientHeight));

    const containerRect = container.getBoundingClientRect();
    let centerX = width / 2;
    let centerY = height / 2;
    let maxWidth = width * 0.75;

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
      maxWidth = bounds.w * scaleX * 0.9;
    } else if (this.bgUpperLayer) {
      const upperRect = this.bgUpperLayer.getBoundingClientRect();
      centerX = (upperRect.left - containerRect.left) + (upperRect.width / 2);
      centerY = (upperRect.top - containerRect.top) + (upperRect.height / 2);
      maxWidth = (upperRect.width / containerRect.width) * width * 0.9;
    }

    const base = {
      width,
      height,
      centerX,
      centerY,
      maxWidth
    };

    for (const block of blocks) {
      const titleEl = layerMap.get(block.id);
      if (!titleEl) continue;
      await this.renderTitleBlockImage(card, block, titleEl, base);
    }
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
      const scale = Math.max(width / bounds.iw, height / bounds.ih);
      const scaledW = bounds.iw * scale;
      const scaledH = bounds.ih * scale;
      const coverOffsetX = (width - scaledW) / 2;
      const coverOffsetY = (height - scaledH) / 2;
      boxLeft = bounds.x * scale + coverOffsetX;
      boxTop = bounds.y * scale + coverOffsetY;
      boxWidth = bounds.w * scale;
      boxHeight = bounds.h * scale;
    }

    const fallbackSize = Math.max(10, Math.round(Math.min(boxWidth, boxHeight) * 0.6));
    const fontSize = Number.isFinite(Number(card.cardIdFontSize))
      ? Number(card.cardIdFontSize)
      : fallbackSize;
    const fontFamily = card.cardIdFont || 'MyriadPro-Light';
    const fontWeight = 700;
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
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    const letterSpacing = 0.5;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const lineHeight = Math.max(fontSize * 1.2, textHeight + Math.max(2, textHeight * 0.1));
    const lineWidth = this.measureTextWithSpacing(ctx, text, letterSpacing);
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
    this.drawTextWithSpacing(ctx, text, -lineWidth / 2, -lineHeight / 2, letterSpacing);
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
  syncDescriptionLayers(blocks) {
    if (!this.cardTextLayer) return new Map();
    if (!this.descriptionLayerMap) this.descriptionLayerMap = new Map();
    const seen = new Set();
    blocks.forEach((block, idx) => {
      const id = block.id || `desc-${idx + 1}`;
      let layer = this.descriptionLayerMap.get(id);
      if (!layer) {
        if (idx === 0) {
          const existing = document.getElementById('descriptionImageLayer');
          if (existing && !Array.from(this.descriptionLayerMap.values()).includes(existing)) {
            layer = existing;
          }
        }
        if (!layer) {
          layer = document.createElement('div');
          layer.className = 'card-description-image';
          this.cardTextLayer.appendChild(layer);
        }
        this.descriptionLayerMap.set(id, layer);
      }
      layer.dataset.descriptionId = id;
      seen.add(id);
    });

    for (const [id, layer] of this.descriptionLayerMap.entries()) {
      if (!seen.has(id)) {
        layer.remove();
        this.descriptionLayerMap.delete(id);
      }
    }

    return this.descriptionLayerMap;
  }

  async renderDescriptionBlockImage(card, block, descLayer, base) {
    if (!descLayer || !base) return;
    const runs = this.getDescriptionRuns(card, block);
    const plainText = this.getPlainTextFromRuns(runs).trim();
    if (!plainText) {
      descLayer.style.backgroundImage = '';
      const hasSize = !!descLayer.style.width && !!descLayer.style.height;
      if (!hasSize) {
        descLayer.style.width = '0px';
        descLayer.style.height = '0px';
        descLayer.style.left = '0px';
        descLayer.style.top = '0px';
        descLayer.style.transform = 'translate(0px, 0px)';
        descLayer.style.pointerEvents = 'none';
      } else {
        descLayer.style.pointerEvents = 'auto';
      }
      return;
    }

    if (!this.areIconsReady(plainText)) {
      await this.preloadIconsForText(plainText);
    }

    const { width, height, centerX, centerY, maxWidth, descriptionLineHeightScale } = base;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = Number(card.descriptionFontSize) || 18;
    const descFont = card.descriptionFont || 'Arial';
    const fontsToLoad = this.collectFontsFromRuns(runs, descFont);
    await Promise.all(fontsToLoad.map((font) => this.ensureFontLoaded(font, 700)));
    ctx.font = `700 ${fontSize}px ${this.getFontFamily(descFont)}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    this.applyTextShadow(ctx, 'description', 1, 'description');

    const offset = block.position || { x: 0, y: 0 };
    const currentScale = this.getPreviewScale();
    const offsetX = (Number(offset.x) || 0) * currentScale;
    const offsetY = (Number(offset.y) || 0) * currentScale;
    const descriptionIconScale = 1.386;
    const iconSize = Math.round(fontSize * descriptionIconScale);
    const letterSpacing = Number(card.descriptionLetterSpacing) || 0;
    const atoms = this.tokenizeRichRuns(runs, descFont);
    const lineHeight = Math.max(1, fontSize * descriptionLineHeightScale - 1);
    let layout = this.layoutRichTextWithIcons(
      ctx,
      atoms,
      maxWidth,
      lineHeight,
      iconSize,
      letterSpacing,
      1.0,
      fontSize,
      descFont
    );
    const usePlainLayout = !layout.lines.length;
    if (usePlainLayout) {
      layout = this.layoutTextWithIcons(
        ctx,
        plainText,
        maxWidth,
        lineHeight,
        iconSize,
        letterSpacing,
        1.0
      );
    }
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
    tightCtx.shadowOffsetX = ctx.shadowOffsetX;
    tightCtx.shadowOffsetY = ctx.shadowOffsetY;
    if (usePlainLayout) {
      this.drawLaidOutTextWithIcons(
        tightCtx,
        layout,
        pad,
        pad,
        iconSize,
        'center',
        letterSpacing
      );
    } else {
      this.drawLaidOutRichTextWithIcons(
        tightCtx,
        layout,
        pad,
        pad,
        iconSize,
        'center',
        letterSpacing,
        fontSize,
        descFont
      );
    }

    const rawScale = Number(block.scale);
    const renderScale = Number.isFinite(rawScale) && rawScale > 0 ? rawScale : 1;
    const scaledWidth = Math.max(1, Math.round(tightCanvas.width * renderScale));
    const scaledHeight = Math.max(1, Math.round(tightCanvas.height * renderScale));

    descLayer.style.pointerEvents = 'auto';
    descLayer.style.backgroundImage = `url('${tightCanvas.toDataURL('image/png')}')`;
    descLayer.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
    descLayer.style.backgroundPosition = 'center';
    descLayer.style.width = `${scaledWidth}px`;
    descLayer.style.height = `${scaledHeight}px`;
    const left = Number.isFinite(centerX) ? centerX - scaledWidth / 2 : 0;
    const top = Number.isFinite(centerY) ? centerY - scaledHeight / 2 : 0;
    descLayer.style.position = 'absolute';
    descLayer.style.left = `${left}px`;
    descLayer.style.top = `${top}px`;
    descLayer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  async updateDescriptionImage(card) {
    const blocks = this.getDescriptionBlocks(card);
    if (!blocks.length) return;
    const layerMap = this.syncDescriptionLayers(blocks);
    if (!layerMap || !layerMap.size) return;

    const container = this.previewElement;
    if (!container) return;
    const width = Math.max(1, Math.round(container.clientWidth));
    const height = Math.max(1, Math.round(container.clientHeight));

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

    const base = {
      width,
      height,
      centerX,
      centerY,
      maxWidth,
      descriptionLineHeightScale
    };

    for (const block of blocks) {
      const descLayer = layerMap.get(block.id);
      if (!descLayer) continue;
      await this.renderDescriptionBlockImage(card, block, descLayer, base);
    }
  }
  updateArtTransform(card) {
    const artImage = document.getElementById('cardArtImage');
    if (!artImage) return;

    const isCroppedOutput = !!card.artWasCropped;
    artImage.classList.toggle('art-cropped', isCroppedOutput);
    artImage.style.display = 'none';

    this.renderArtPreview(card);
  }

  async renderArtPreview(card) {
    if (!this.artworkCanvas || !this.artworkCtx) return;

    const nonce = ++this.previewRenderNonce;
    const artImage = document.getElementById('cardArtImage');
    const artArea = document.getElementById('cardArtArea');
    const artSrc = card && (card.artData || card.artUrl) ? (card.artData || card.artUrl) : '';
    const hasArt = !!artSrc;

    if (!hasArt) {
      this.artworkCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.artworkCtx.clearRect(0, 0, this.artworkCanvas.width, this.artworkCanvas.height);
      this.artworkCanvas.style.display = 'none';
      if (artArea) {
        if (!artArea.innerHTML) artArea.innerHTML = '<div class="art-placeholder"></div>';
        artArea.style.display = '';
      }
      if (artImage) artImage.style.display = 'none';
      return;
    }

    if (artArea) {
      artArea.innerHTML = '';
      artArea.style.display = 'none';
    }
    if (artImage) {
      if (artImage.src !== artSrc) artImage.src = artSrc;
      artImage.style.display = 'none';
    }

    const container = this.artworkLayer || this.previewElement;
    const rect = container ? container.getBoundingClientRect() : null;
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      this.artworkCanvas.style.display = 'none';
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const cssW = rect.width;
    const cssH = rect.height;
    const canvasW = Math.max(1, Math.round(cssW * dpr));
    const canvasH = Math.max(1, Math.round(cssH * dpr));

    if (this.artworkCanvas.width !== canvasW || this.artworkCanvas.height !== canvasH) {
      this.artworkCanvas.width = canvasW;
      this.artworkCanvas.height = canvasH;
    }

    this.artworkCanvas.style.display = 'block';
    this.artworkCanvas.style.width = '100%';
    this.artworkCanvas.style.height = '100%';

    this.artworkCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.artworkCtx.clearRect(0, 0, canvasW, canvasH);

    try {
      if (nonce !== this.previewRenderNonce) return;
      let previewMaskBounds = null;
      const previewMaskSrc = this.renderBleedOverridePath || '';
      if (previewMaskSrc) {
        previewMaskBounds = this.bgLowerBoundsCache[previewMaskSrc] || null;
        if (!previewMaskBounds) {
          try {
            previewMaskBounds = await this.computeOpaqueBounds(previewMaskSrc);
            if (previewMaskBounds) this.bgLowerBoundsCache[previewMaskSrc] = previewMaskBounds;
          } catch (error) {
            previewMaskBounds = null;
          }
        }
      }
      // Preview should always show through frame assets; avoid additional mask pass here.
      await this.drawArtToContext(
        this.artworkCtx,
        card,
        { width: cssW, height: cssH },
        dpr,
        0,
        0,
        false,
        true,
        null,
        previewMaskBounds
      );
    } catch (error) {
      console.warn('Failed to render art preview:', error);
      // Fallback to DOM image if canvas render fails.
      if (artImage) artImage.style.display = 'block';
    }
  }
  async updateCostBadge(card) {
    if (!this.costBadgeLayer) return;

    const value = String(card?.costBadge?.value ?? '').trim();
    if (!value) {
      this.costBadgeLayer.style.backgroundImage = '';
      this.updateCostBadgePosition(card);
      return;
    }
    const dataUrl = await this.buildCostBadgeDataUrl(value, card?.costBadge?.fontSize);
    this.costBadgeLayer.style.backgroundImage = dataUrl ? `url('${dataUrl}')` : '';
    this.updateCostBadgePosition(card);
  }

  async buildCostBadgeDataUrl(value, fontSize) {
    const safeValue = String(value ?? '').trim();
    if (!safeValue) return '';
    const basePath = this.getCostBadgeBasePath();
    if (!basePath) return '';

    const sizeKey = Number.isFinite(Number(fontSize)) ? Number(fontSize) : 'auto';
    const cacheKey = `${basePath}|${safeValue}|${sizeKey}`;
    if (this.costBadgeRenderCache[cacheKey]) {
      return this.costBadgeRenderCache[cacheKey];
    }

    const canvas = document.createElement('canvas');
    let baseImg = null;
    try {
      baseImg = await this.loadImage(basePath);
    } catch (error) {
      baseImg = null;
    }
    if (!baseImg) return '';

    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    // Keep the canvas transparent; only draw the text so we don't keep the baked-in "0".

    let bounds = this.costBadgeBoundsCache[basePath];
    if (!bounds) {
      try {
        bounds = await this.computeOpaqueBounds(basePath);
        if (bounds) this.costBadgeBoundsCache[basePath] = bounds;
      } catch (error) {
        bounds = null;
      }
    }

    if (bounds) {
      const centerX = bounds.x + bounds.w / 2 + 2;
      const centerY = bounds.y + bounds.h / 2;
      const explicitSize = Number(fontSize);
      const maxSize = Number.isFinite(explicitSize) && explicitSize > 0
        ? explicitSize
        : Math.min(bounds.w, bounds.h) * 0.62;
      const fontFamily = 'MYRIADPRO-BOLDCOND';
      await this.ensureFontLoaded(fontFamily, 700);
      let fontSizeResolved = maxSize;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.shadowColor = 'rgba(255,255,255,0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;

      const measure = (size) => {
        ctx.font = `700 ${size}px ${this.getFontFamily(fontFamily)}`;
        return ctx.measureText(safeValue).width;
      };

      let width = measure(fontSizeResolved);
      const maxWidth = bounds.w * 1.0;
      if (width > maxWidth) {
        fontSizeResolved = Math.max(10, (maxWidth / width) * fontSizeResolved);
        width = measure(fontSizeResolved);
      }

      ctx.font = `700 ${fontSizeResolved}px ${this.getFontFamily(fontFamily)}`;
      ctx.fillText(safeValue, centerX, centerY);
    }

    const dataUrl = canvas.toDataURL('image/png');
    this.costBadgeRenderCache[cacheKey] = dataUrl;
    return dataUrl;
  }

  updateCostBadgePosition(card) {
    if (!this.costBadgeLayer) return;
    const pos = card?.costBadgePosition || { x: 0, y: 0 };
    const scale = this.getPreviewScale();
    const x = (Number(pos.x) || 0) * scale;
    const y = (Number(pos.y) || 0) * scale;
    this.costBadgeLayer.style.transform = `translate(${x}px, ${y}px)`;
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
    this.renderArtPreview(card);
  }




  // Add card art image
  setCardArt(imageUrl) {
    const artArea = document.getElementById('cardArtArea');
    const artImage = document.getElementById('cardArtImage');
    const artworkLayer = document.getElementById('artworkLayer');
    if (!artArea && !artImage && !artworkLayer) return;
    if (imageUrl) {
      if (artArea) {
        artArea.innerHTML = '';
        artArea.style.display = 'none';
      }
      if (artImage) {
        artImage.src = imageUrl;
        artImage.style.display = 'none';
      }
      if (artworkLayer) {
        artworkLayer.style.backgroundImage = '';
      }
    } else {
      if (artArea) {
        artArea.innerHTML = '<div class="art-placeholder"></div>';
        artArea.style.display = '';
      }
      if (artImage) {
        artImage.src = '';
        artImage.style.display = 'none';
      }
      if (artworkLayer) {
        artworkLayer.style.backgroundImage = '';
      }
    }

    // Keep preview canvas in sync with art source updates.
    if (typeof gameState !== 'undefined') {
      this.renderArtPreview(gameState.getCard());
    }
  }

  async renderCardToCanvas(card, options = {}) {
    try {
      this.tokenIconCardContext = card || null;
      if (!this.assetManifest) {
        await this.loadAssetManifest();
      }
      const baseMetrics = this.getBaseCardMetrics();
      const includeBleed = options.includeBleed !== undefined
        ? !!options.includeBleed
        : !!(card.export && card.export.includeBleed);
      const requestedWidth = Number(options.width);
      const requestedHeight = Number(options.height);
      const defaultWidth = includeBleed ? baseMetrics.width : (Number(DTC_RENDER_EXPORT_SIZE.width) || baseMetrics.width);
      const defaultHeight = includeBleed ? baseMetrics.height : (Number(DTC_RENDER_EXPORT_SIZE.height) || baseMetrics.height);
      const targetWidth = Number.isFinite(requestedWidth) && requestedWidth > 0
        ? Math.round(requestedWidth)
        : defaultWidth;
      const targetHeight = Number.isFinite(requestedHeight) && requestedHeight > 0
        ? Math.round(requestedHeight)
        : Math.round(targetWidth * (defaultHeight / defaultWidth));
      const usePreviewMetrics = options.usePreviewMetrics !== undefined
        ? !!options.usePreviewMetrics
        : true;
      const fitMode = (options.fitMode || 'width').toLowerCase();
      const renderCardIdLayer = options.renderCardIdLayer !== undefined
        ? !!options.renderCardIdLayer
        : true;
      const renderCardIdText = options.renderCardIdText !== undefined
        ? !!options.renderCardIdText
        : true;

      const metrics = this.getRenderMetrics(usePreviewMetrics);
      const rect = metrics.rect;
      const currentScale = metrics.currentScale;
      const defaultPadding = includeBleed ? metrics.padding : 0;
      const padding = Number.isFinite(Number(options.padding))
        ? Number(options.padding)
        : defaultPadding;
      const scaleX = rect.width > 0 ? targetWidth / rect.width : 1;
      const scaleY = rect.height > 0 ? targetHeight / rect.height : 1;
      let scale = scaleX;
      if (fitMode === 'height') {
        scale = scaleY;
      } else if (fitMode === 'contain') {
        scale = Math.min(scaleX, scaleY);
      } else if (fitMode === 'cover') {
        scale = Math.max(scaleX, scaleY);
      }
      let offsetX = includeBleed ? 0 : -(padding * scale);
      let offsetY = includeBleed ? 0 : -(padding * scale);
      if (fitMode === 'contain' || fitMode === 'cover') {
        const extraX = (targetWidth - rect.width * scale) / 2;
        const extraY = (targetHeight - rect.height * scale) / 2;
        offsetX += extraX;
        offsetY += extraY;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const assets = this.getRenderLayerAssets(card, options);
      const layers = card.layers || {};
      const panelUpperVisible = layers.panelUpper ?? layers.titleBar;
      const panelLowerVisible = layers.panelLower ?? layers.bottomText;

      const maskUrl = card.artCropToFrame
        ? await this.getArtMaskForAssets(assets.imageFrame, assets.border)
        : '';

      const normalizeLayerBounds = options.normalizeLayerBounds !== undefined
        ? !!options.normalizeLayerBounds
        : !usePreviewMetrics;
      const normalizeMaskSrc = options.bleedMaskSrc || assets.cardBleed || this.renderBleedOverridePath;
      let normalizeMaskBounds = null;
      if (normalizeLayerBounds && normalizeMaskSrc) {
        try {
          normalizeMaskBounds = await this.computeOpaqueBounds(normalizeMaskSrc);
        } catch (error) {
          normalizeMaskBounds = null;
        }
      }

      const drawLayer = async (src, visible = true, normalizeToMaskBounds = true) => {
        if (!visible || !src) return;
        const img = await this.loadImage(src);
        if (
          normalizeToMaskBounds &&
          normalizeMaskBounds &&
          img.width === normalizeMaskBounds.iw &&
          img.height === normalizeMaskBounds.ih
        ) {
          ctx.drawImage(
            img,
            normalizeMaskBounds.x,
            normalizeMaskBounds.y,
            normalizeMaskBounds.w,
            normalizeMaskBounds.h,
            offsetX,
            offsetY,
            rect.width * scale,
            rect.height * scale
          );
          return;
        }
        ctx.drawImage(img, offsetX, offsetY, rect.width * scale, rect.height * scale);
      };

      const drawCardBleed = async () => {
        if (!assets.cardBleed) return;
        await drawLayer(assets.cardBleed, true, true);
      };

      const drawArt = async () => {
        await this.drawArtToContext(
          ctx,
          card,
          rect,
          scale,
          offsetX,
          offsetY,
          false,
          false,
          maskUrl,
          normalizeMaskBounds
        );
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

        let scaleX = rect.width / bounds.iw;
        let scaleY = rect.height / bounds.ih;
        let boxLeft = bounds.x * scaleX;
        let boxTop = bounds.y * scaleY;
        let boxWidth = bounds.w * scaleX;
        let boxHeight = bounds.h * scaleY;
        if (normalizeMaskBounds && bounds.iw === normalizeMaskBounds.iw && bounds.ih === normalizeMaskBounds.ih) {
          scaleX = rect.width / normalizeMaskBounds.w;
          scaleY = rect.height / normalizeMaskBounds.h;
          boxLeft = (bounds.x - normalizeMaskBounds.x) * scaleX;
          boxTop = (bounds.y - normalizeMaskBounds.y) * scaleY;
          boxWidth = bounds.w * scaleX;
          boxHeight = bounds.h * scaleY;
        }

        const fallbackSize = Math.max(10, Math.round(Math.min(boxWidth, boxHeight) * 0.6));
        const baseFontSize = Number.isFinite(Number(card.cardIdFontSize))
          ? Number(card.cardIdFontSize)
          : fallbackSize;
        const fontFamily = card.cardIdFont || 'MyriadPro-Light';
        const fontWeight = 700;
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

        const letterSpacing = 0.5 * scale;
        const metrics = ctx.measureText('Mg');
        const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
        const lineHeight = Math.max(fontSize * 1.2, textHeight + Math.max(2, textHeight * 0.1));
        const lineWidth = this.measureTextWithSpacing(ctx, raw, letterSpacing);
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
        this.drawTextWithSpacing(ctx, raw, -lineWidth / 2, -lineHeight / 2, letterSpacing);
        ctx.restore();
      };

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
        iconLineHeightScale = 1.0,
        runs = null,
        lineHeightOffsetPx = 0,
        shadowStyle = null,
        iconScale = 0.9,
        renderScale = 1
      ) => {
        if (!include) return;
        const resolvedRuns = Array.isArray(runs) && runs.length ? runs : null;
        const sourceText = resolvedRuns ? this.getPlainTextFromRuns(resolvedRuns) : text;
        const trimmed = (sourceText || '').trim();
        if (!trimmed) return;
        ctx.save();
        const fontSize = baseFontSize * scale;
        const fontsToLoad = resolvedRuns ? this.collectFontsFromRuns(resolvedRuns, fontFamily) : [fontFamily];
        await Promise.all(fontsToLoad.map((font) => this.ensureFontLoaded(font, 700)));
        ctx.font = `700 ${fontSize}px ${this.getFontFamily(fontFamily)}`;
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        this.applyTextShadow(ctx, shadowStyle, scale, 'description');
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
            let scaleX = rect.width / bounds.iw;
            let scaleY = rect.height / bounds.ih;
            if (normalizeMaskBounds && bounds.iw === normalizeMaskBounds.iw && bounds.ih === normalizeMaskBounds.ih) {
              scaleX = rect.width / normalizeMaskBounds.w;
              scaleY = rect.height / normalizeMaskBounds.h;
              px = (bounds.x - normalizeMaskBounds.x) * scaleX;
              py = (bounds.y - normalizeMaskBounds.y) * scaleY;
            } else {
              px = bounds.x * scaleX;
              py = bounds.y * scaleY;
            }
            pw = bounds.w * scaleX;
            ph = bounds.h * scaleY;
          }
        }

        if (px === undefined || py === undefined || pw === undefined || ph === undefined) {
          const layerRect = usePreviewMetrics
            ? (layerEl ? layerEl.getBoundingClientRect() : this.previewElement.getBoundingClientRect())
            : { left: 0, top: 0, width: rect.width, height: rect.height };
          px = layerRect.left - rect.left;
          py = layerRect.top - rect.top;
          pw = layerRect.width;
          ph = layerRect.height;
        }
        const offset = position || { x: 0, y: 0 };
        const scaledOffsetX = (Number(offset.x) || 0) * currentScale;
        const scaledOffsetY = (Number(offset.y) || 0) * currentScale;
        const resolvedIconScale = Number.isFinite(Number(iconScale)) ? Number(iconScale) : 0.9;
        const iconSize = Math.round(fontSize * resolvedIconScale);
        const scaledSpacing = (Number(letterSpacing) || 0) * scale;
        const maxWidth = pw * widthRatio * scale;
        const lineHeight = Math.max(1, fontSize * lineHeightScale + lineHeightOffsetPx);
        let layout = resolvedRuns
          ? this.layoutRichTextWithIcons(
            ctx,
            this.tokenizeRichRuns(resolvedRuns, fontFamily),
            maxWidth,
            lineHeight,
            iconSize,
            scaledSpacing,
            iconLineHeightScale,
            fontSize,
            fontFamily
          )
          : this.layoutTextWithIcons(
            ctx,
            trimmed,
            maxWidth,
            lineHeight,
            iconSize,
            scaledSpacing,
            iconLineHeightScale
          );
        const fallbackToPlain = resolvedRuns && !layout.lines.length;
        if (fallbackToPlain) {
          layout = this.layoutTextWithIcons(
            ctx,
            trimmed,
            maxWidth,
            lineHeight,
            iconSize,
            scaledSpacing,
            iconLineHeightScale
          );
        }
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
        const resolvedScale = Number.isFinite(Number(renderScale)) ? Number(renderScale) : 1;
        const safeScale = resolvedScale;
        const centerX = drawX + layout.width / 2;
        const centerY = drawY + layout.height / 2;
        if (safeScale !== 1) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(safeScale, safeScale);
          ctx.translate(-centerX, -centerY);
        }
        if (resolvedRuns && !fallbackToPlain) {
          this.drawLaidOutRichTextWithIcons(
            ctx,
            layout,
            drawX,
            drawY,
            iconSize,
            align,
            scaledSpacing,
            fontSize,
            fontFamily
          );
        } else {
          this.drawLaidOutTextWithIcons(
            ctx,
            layout,
            drawX,
            drawY,
            iconSize,
            align,
            scaledSpacing
          );
        }
        if (safeScale !== 1) {
          ctx.restore();
        }
        ctx.restore();
      };

      const drawTitleText = async () => {
        if (layers.titleText === false) return;
        const titleBlocks = this.getTitleBlocks(card);
        for (const block of titleBlocks) {
          await drawExportText(
            block.text,
            this.bgUpperLayer,
            block.position || card.titlePosition,
            true,
            'center',
            assets.backgroundUpper,
            0.8,
            card.titleFont || 'Arial',
            Number(card.titleFontSize) || 18,
            1.35,
            Number(card.titleLetterSpacing) || 0,
            1.05,
            null,
            0,
            'title'
          );
        }
      };

      const drawCardText = async () => {
        if (layers.cardText === false) return;
        const descriptionBlocks = this.getDescriptionBlocks(card);
        const descriptionIconScale = 1.386;
        for (const block of descriptionBlocks) {
          const descriptionRuns = this.getDescriptionRuns(card, block);
          await drawExportText(
            block.description,
            this.bgLowerLayer,
            block.position || card.descriptionPosition,
            true,
            'center',
            assets.backgroundLower,
            0.8,
            card.descriptionFont || 'Arial',
            Number(card.descriptionFontSize) || 18,
            Number(card.descriptionLineHeightScale) || 1.0,
            Number(card.descriptionLetterSpacing) || 0,
            1.0,
            descriptionRuns,
            -1,
            'description',
            descriptionIconScale,
            block.scale
          );
        }
      };

      const layerOrder = this.getLayerOrder(card);
      for (const layerKey of layerOrder) {
        switch (layerKey) {
          case 'cardBleed':
            if (layers.cardBleed !== false) await drawCardBleed();
            break;
          case 'backgroundLower':
            if (layers.backgroundLower !== false) await drawLayer(assets.backgroundLower, true);
            break;
          case 'backgroundUpper':
            if (layers.backgroundUpper !== false) await drawLayer(assets.backgroundUpper, true);
            break;
          case 'artwork':
            if (layers.artwork !== false) await drawArt();
            break;
          case 'imageFrame':
            if (layers.imageFrame !== false) await drawLayer(assets.imageFrame, true);
            break;
          case 'topNameGradient':
            if (layers.topNameGradient !== false) await drawLayer(assets.topNameGradient, true);
            break;
          case 'bottomNameGradient':
            if (layers.bottomNameGradient !== false) await drawLayer(assets.bottomNameGradient, true);
            break;
          case 'frameShading':
            if (layers.frameShading !== false) await drawLayer(assets.frameShading, true);
            break;
          case 'border':
            if (layers.border !== false) await drawLayer(assets.border, true);
            break;
          case 'cardId':
            if (layers.cardId !== false) {
              if (renderCardIdLayer) {
                await drawLayer(assets.cardId, true);
              }
              if (renderCardIdText) {
                await drawCardIdText();
              }
            }
            break;
          case 'panelBleed':
            if (layers.panelBleed !== false) await drawLayer(assets.panelBleed, true);
            break;
          case 'panelLower':
            if (panelLowerVisible !== false) await drawLayer(assets.panelLower, true);
            break;
          case 'secondAbilityFrame':
            if (layers.secondAbilityFrame !== false) await drawLayer(assets.secondAbilityFrame, true);
            break;
          case 'panelUpper':
            if (panelUpperVisible !== false) await drawLayer(assets.panelUpper, true);
            break;
          case 'costBadge':
            if (layers.costBadge !== false) {
              const costValue = String(card?.costBadge?.value ?? '').trim();
              const badgePath = costValue
                ? (await this.buildCostBadgeDataUrl(costValue, card?.costBadge?.fontSize) || this.getCostBadgeBasePath())
                : '';
              if (badgePath) {
                const pos = card?.costBadgePosition || { x: 0, y: 0 };
                const dx = (Number(pos.x) || 0) * scale;
                const dy = (Number(pos.y) || 0) * scale;
                ctx.save();
                ctx.translate(dx, dy);
                await drawLayer(badgePath, true);
                ctx.restore();
              }
            }
            break;
          case 'attackModifier':
            if (card.cardSubType === 'Roll Phase' && layers.attackModifier !== false) {
              await drawLayer(assets.attackModifier, !!assets.attackModifier);
            }
            break;
          case 'titleText':
            await drawTitleText();
            break;
          case 'cardText':
            await drawCardText();
            break;
          default:
            break;
        }
      }

      const shouldApplyBleedMask = options.applyBleedMask !== undefined
        ? !!options.applyBleedMask
        : true;
      if (shouldApplyBleedMask) {
        const geometryMaskSrc = options.geometryMaskSrc
          || this.finalExportCropMaskPath
          || options.bleedMaskSrc
          || assets.cardBleed
          || this.renderBleedOverridePath;
        if (geometryMaskSrc) {
          const masked = await this.applyOuterBoundsMaskToCanvas(canvas, geometryMaskSrc, {
            cropToBounds: options.cropToGeometryBounds === true || options.cropToBleedBounds === true
          });
          if (masked) return masked;
        }
      }

      return canvas;
    } catch (error) {
      console.error('Error rendering card to canvas:', error);
      return null;
    }
  }

  async renderCardToDataUrl(card, options = {}) {
    const canvas = await this.renderCardToCanvas(card, options);
    if (!canvas) return '';
    const shouldTrim = options.trimTransparent === true;
    const alphaThreshold = Number.isFinite(Number(options.trimAlphaThreshold))
      ? Number(options.trimAlphaThreshold)
      : 1;
    const output = shouldTrim ? this.trimTransparentCanvas(canvas, alphaThreshold) : canvas;
    return (output || canvas).toDataURL('image/png');
  }

  async exportAsImage() {
    try {
      const card = gameState.getCard();
      const cloneCard = (source) => deepCloneRender(source || {});
      const buildLayerMap = (sourceLayers = {}, defaults = {}, defaultVisible = true) => {
        const map = {};
        for (const key of this.defaultLayerOrder) {
          map[key] = defaultVisible;
          if (Object.prototype.hasOwnProperty.call(sourceLayers, key)) {
            map[key] = sourceLayers[key] !== false;
          }
        }
        return {
          ...map,
          ...defaults
        };
      };

      const finalMaskSrc = this.finalExportCropMaskPath || this.renderBleedOverridePath;
      const baseWidth = Number(DTC_RENDER_EXPORT_SIZE.width) || 675;
      const baseHeight = Number(DTC_RENDER_EXPORT_SIZE.height) || 1050;
      const exportWidth = baseWidth;
      const exportHeight = baseHeight;

      const baseCard = cloneCard(card);
      baseCard.layers = buildLayerMap(card.layers || {}, {
        cardId: false,
        titleText: false,
        cardText: false
      }, true);
      const baseCanvas = await this.renderCardToCanvas(baseCard, {
        includeBleed: false,
        width: baseWidth,
        height: baseHeight,
        usePreviewMetrics: false,
        fitMode: 'cover',
        padding: 0,
        applyBleedMask: false
      });
      if (!baseCanvas) throw new Error('Base export canvas not available');

      const overlayCard = cloneCard(card);
      overlayCard.layers = buildLayerMap({}, {
        cardId: card.layers?.cardId !== false,
        titleText: card.layers?.titleText !== false,
        cardText: card.layers?.cardText !== false
      }, false);
      const overlayCanvas = await this.renderCardToCanvas(overlayCard, {
        includeBleed: false,
        width: baseWidth,
        height: baseHeight,
        usePreviewMetrics: false,
        fitMode: 'cover',
        padding: 0,
        applyBleedMask: false,
        renderCardIdLayer: true,
        renderCardIdText: false
      });

      const output = document.createElement('canvas');
      output.width = exportWidth;
      output.height = exportHeight;
      const outCtx = output.getContext('2d');
      if (!outCtx) throw new Error('Export canvas context not available');

      // Keep card art at configured export size, then place text/card-id overlay on top.
      outCtx.clearRect(0, 0, exportWidth, exportHeight);
      outCtx.drawImage(baseCanvas, 0, 0, baseWidth, baseHeight);
      if (overlayCanvas) {
        outCtx.drawImage(overlayCanvas, 0, 0, baseWidth, baseHeight);
      }
      // Fixed-rect export: keep exact registration at configured export size with no post normalization.
      let finalOutput = output;

      // Render Card ID text as the final pass on the fixed export rect.
      if (card.layers?.cardId !== false) {
        const cardIdTextCard = cloneCard(card);
        cardIdTextCard.layers = buildLayerMap({}, {
          cardId: true
        }, false);
        const cardIdTextCanvas = await this.renderCardToCanvas(cardIdTextCard, {
          includeBleed: false,
          width: finalOutput.width,
          height: finalOutput.height,
          usePreviewMetrics: false,
          fitMode: 'cover',
          padding: 0,
          applyBleedMask: false,
          renderCardIdLayer: false,
          renderCardIdText: true
        });
        if (cardIdTextCanvas) {
          const finalCtx = finalOutput.getContext('2d');
          if (finalCtx) {
            finalCtx.drawImage(cardIdTextCanvas, 0, 0, finalOutput.width, finalOutput.height);
          }
        }
      }
      // Apply final outer-bounds crop using the dedicated crop mask geometry.
      if (finalMaskSrc) {
        const cropped = await this.applyOuterBoundsMaskToCanvas(finalOutput, finalMaskSrc, {
          cropToBounds: true
        });
        if (cropped) {
          finalOutput = cropped;
        }
      }

      const link = document.createElement('a');
      link.href = finalOutput.toDataURL('image/png');
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

    if (name === 'dmg' || name === 'damage') {
      const allowed = ['blank'];
      return mapFolder('Dmg', 'dmg', allowed, 'blank');
    }

    if (name === 'rdmg') {
      const allowed = ['blank'];
      return mapFolder('Rdmg', 'dmg', allowed, 'blank');
    }

    if (name === 'heal') {
      const allowed = ['1','2','3','4','5','half','blank'];
      return mapFolder('Heal', 'heal', allowed);
    }

    if (name === 'prevent') {
      if (rawValue === 'half') {
        const allowed = ['half'];
        return mapFolder('Prevent', 'prevent', allowed, 'half');
      }
      const allowed = ['blank'];
      return mapFolder('Prevent', 'prevent', allowed, 'blank');
    }

    if (name === 'draw') {
      const allowed = ['1','2','3','4','5','blank'];
      return mapFolder('Draw', 'draw', allowed);
    }

    if (name === 'cp') {
      const allowed = ['1','2','3','4','5','blank'];
      return mapFolder('CP', 'cp', allowed);
    }

    if (name === 'at') {
      const safe = rawValue || 'basic_1';
      return encodeURI(`Assets/Ability Trigger/${safe}.png`);
    }

    if (name === 'abilitydice') {
      const slotValue = String(rawValue || '').trim().toUpperCase();
      const custom = this.getAbilityDiceIconForSlot(slotValue);
      if (custom) return custom;
      const variant = this.getAbilityDiceVariant(token);
      if (variant === 'small') {
        return encodeURI('Assets/Icons/Ability Dice/straight/small_straight.png');
      }
      if (variant === 'large') {
        return encodeURI('Assets/Icons/Ability Dice/straight/large_straight.png');
      }
      return encodeURI('Assets/Icons/Ability Dice/ability_dice.png');
    }

    if (name === 'straight') {
      const allowed = ['small', 'large'];
      const safe = normalizeValue(rawValue, allowed, 'small');
      return `Assets/Icons/Straight/${safe}.png`;
    }

    if (name === 'dice') {
      return 'Assets/Icons/Dice/dice.png';
    }

    if (name === 'half') {
      return 'Assets/Icons/Half/half.png';
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

  getIconSpaceCount(token) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'dmg' || name === 'damage' || name === 'rdmg') return 9;
    if (name === 'heal') return 8;
    if (name === 'prevent') return 7;
    if (name === 'cp') return 7;
    if (name === 'draw') return 6;
    if (name === 'at') return 7;
    if (name === 'abilitydice') return 7;
    if (name === 'straight') return 7;
    if (name === 'dice') return 7;
    if (name === 'half') return 5;
    return 8;
  }

  getIconScale(token) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'dmg' || name === 'damage' || name === 'rdmg') return 1.0;
    if (name === 'heal') return 1.0;
    if (name === 'prevent') return 1.0;
    if (name === 'cp') return 0.855;
    if (name === 'draw') return 1.0;
    if (name === 'at') return 7.695;
    if (name === 'abilitydice') {
      const variant = this.getAbilityDiceVariant(token);
      if (variant === 'small') return 5.55;
      if (variant === 'large') return 7.85;
      return 1.85;
    }
    if (name === 'straight') return 4.55175;
    if (name === 'dice') return 0.588;
    if (name === 'half') return 0.6;
    if (this.isStatusEffectToken(token)) return this.statusEffectIconScale;
    return 1.0;
  }

  isStatusEffectToken(token) {
    const name = (token?.name || '').toLowerCase();
    if (!name) return false;
    return ![
      'dmg',
      'damage',
      'rdmg',
      'heal',
      'prevent',
      'cp',
      'draw',
      'at',
      'abilitydice',
      'straight',
      'dice',
      'half'
    ].includes(name);
  }

  getIconAdvanceWidth(spaceWidth, iconSize, atom) {
    const name = (atom?.name || '').toLowerCase();
    const scale = this.getIconScale(atom);
    const repeat = this.getTokenRepeatCount(atom);
    if (name === 'abilitydice') {
      const minSizeOnly = (Number(iconSize) || 0) * scale;
      const gap = this.getAbilityDiceGapPx(minSizeOnly);
      return Math.max(1, minSizeOnly * repeat + gap * Math.max(0, repeat - 1));
    }
    const base = Math.max(0, spaceWidth) * this.getIconSpaceCount(atom) * scale * repeat;
    const minSize = (Number(iconSize) || 0) * scale;
    return Math.max(base, minSize * repeat);
  }

  getIconYOffsetAdjust(token, iconSize) {
    const name = (token?.name || '').toLowerCase();
    if (name === 'draw') return -Math.round(iconSize * 0.15);
    if (name === 'prevent') return -Math.round(iconSize * 0.1);
    if (name === 'cp') return -Math.round(iconSize * 0.1);
    if (name === 'damage' || name === 'dmg' || name === 'rdmg') return -Math.round(iconSize * 0.15);
    return 0;
  }

  tokenizeForLayout(text) {
    const atoms = [];
    const normalized = String(text || '')
      .replace(/&#123;|&lcub;|&lbrace;/gi, '{')
      .replace(/&#125;|&rcub;|&rbrace;/gi, '}');

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
      const token = this.parseTokenString(raw);
      if (token) {
        atoms.push({
          type: 'icon',
          name: token.name,
          value: token.value,
          color: token.color
        });
      } else {
        pushWhitespaceSensitive(match[0]);
      }
      lastIndex = tokenRegex.lastIndex;
    }
    pushWhitespaceSensitive(normalized.slice(lastIndex));
    return atoms;
  }

  tokenizeRichRuns(runs, defaultFont) {
    const atoms = [];
    const tokenRegex = /\{\{([^}]+)\}\}/g;

    const normalize = (value) => String(value || '')
      .replace(/&#123;|&lcub;|&lbrace;/gi, '{')
      .replace(/&#125;|&rcub;|&rbrace;/gi, '}');

    const pushWhitespaceSensitive = (segment, font) => {
      if (!segment) return;
      for (let i = 0; i < segment.length; i += 1) {
        const ch = segment[i];
        if (ch === '\n') {
          atoms.push({ type: 'newline' });
        } else if (ch === ' ' || ch === '\t') {
          atoms.push({ type: 'space', font });
        } else {
          let j = i;
          let word = '';
          while (j < segment.length) {
            const c = segment[j];
            if (c === '\n' || c === ' ' || c === '\t') break;
            word += c;
            j += 1;
          }
          atoms.push({ type: 'text', value: word, font });
          i = j - 1;
        }
      }
    };

    (runs || []).forEach((run) => {
      const font = (run && run.font) ? String(run.font).trim() : '';
      const safeFont = font || defaultFont || 'Arial';
      const normalized = normalize(run && run.text ? run.text : '');
      let lastIndex = 0;
      let match;

      while ((match = tokenRegex.exec(normalized)) !== null) {
        pushWhitespaceSensitive(normalized.slice(lastIndex, match.index), safeFont);
        const raw = match[1] || '';
        const token = this.parseTokenString(raw);
        if (token) {
          atoms.push({
            type: 'icon',
            name: token.name,
            value: token.value,
            color: token.color,
            font: safeFont
          });
        } else {
          pushWhitespaceSensitive(match[0], safeFont);
        }
        lastIndex = tokenRegex.lastIndex;
      }
      pushWhitespaceSensitive(normalized.slice(lastIndex), safeFont);
    });

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
    const spaceWidth = ctx.measureText(' ').width;
    const getIconAdvance = (atom) => this.getIconAdvanceWidth(spaceWidth, iconSize, atom);
    const iconScales = atoms.filter((atom) => atom.type === 'icon').map((atom) => (
      this.getIconScale(atom)
    ));
    const maxIconScale = iconScales.length ? Math.max(...iconScales) : 1;
    const hasIcons = iconScales.length > 0;
    const iconLineHeight = iconSize * maxIconScale * iconLineHeightScale;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const minLineHeight = textHeight ? textHeight + Math.max(2, textHeight * 0.1) : lineHeight;
    let effectiveLineHeight = Math.max(lineHeight, minLineHeight);
    if (hasIcons) {
      effectiveLineHeight = Math.max(effectiveLineHeight, iconLineHeight);
    }

    const measureAtom = (atom) => {
      if (atom.type === 'text') return this.measureTextWithSpacing(ctx, atom.value, letterSpacing);
      if (atom.type === 'icon') return getIconAdvance(atom);
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
      spaceWidth
    };
  }

  layoutRichTextWithIcons(
    ctx,
    atoms,
    maxWidth,
    lineHeight,
    iconSize,
    letterSpacing = 0,
    iconLineHeightScale = 1.0,
    fontSize = 18,
    defaultFont = 'Arial'
  ) {
    const lines = [];
    let current = [];
    let width = 0;
    const iconScales = atoms.filter((atom) => atom.type === 'icon').map((atom) => (
      this.getIconScale(atom)
    ));
    const maxIconScale = iconScales.length ? Math.max(...iconScales) : 1;
    const hasIcons = iconScales.length > 0;

    ctx.font = `700 ${fontSize}px ${this.getFontFamily(defaultFont)}`;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);
    const minLineHeight = textHeight ? textHeight + Math.max(2, textHeight * 0.1) : lineHeight;
    let effectiveLineHeight = Math.max(lineHeight, minLineHeight);
    if (hasIcons) {
      effectiveLineHeight = Math.max(effectiveLineHeight, iconSize * maxIconScale * iconLineHeightScale);
    }

    const setFont = (font) => {
      const safe = font || defaultFont || 'Arial';
      ctx.font = `700 ${fontSize}px ${this.getFontFamily(safe)}`;
    };

    const measureAtom = (atom) => {
      if (atom.type === 'text') {
        setFont(atom.font);
        return this.measureTextWithSpacing(ctx, atom.value, letterSpacing);
      }
      if (atom.type === 'space') {
        setFont(atom.font);
        return Math.max(0, ctx.measureText(' ').width);
      }
      if (atom.type === 'icon') {
        setFont(atom.font);
        const spaceWidth = Math.max(0, ctx.measureText(' ').width);
        return this.getIconAdvanceWidth(spaceWidth, iconSize, atom);
      }
      return 0;
    };

    const pushLine = () => {
      if (!current.length) return;
      while (current.length && current[0].type === 'space') current.shift();
      while (current.length && current[current.length - 1].type === 'space') current.pop();
      if (!current.length) return;
      let lineWidth = 0;
      current.forEach((atom) => {
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
      lineHeight: effectiveLineHeight
    };
  }

  drawLaidOutTextWithIcons(
    ctx,
    layout,
    originX,
    originY,
    iconSize,
    align = 'left',
    letterSpacing = 0
  ) {
    const spaceWidth = Number.isFinite(layout.spaceWidth)
      ? layout.spaceWidth
      : ctx.measureText(' ').width;
    const effectiveLineHeight = layout.lineHeight;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);

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
      if (row > 0) {
        x -= 1;
      }
      const y = originY + row * effectiveLineHeight - (row > 0 ? 1 : 0);
      line.atoms.forEach((atom) => {
        if (atom.type === 'space') {
          x += spaceWidth;
          return;
        }
        if (atom.type === 'text') {
          ctx.textBaseline = 'top';
          const textWidth = this.drawTextWithSpacing(ctx, atom.value, x, y, letterSpacing);
          x += textWidth;
          return;
        }
        if (atom.type === 'icon') {
          const path = this.resolveIconPath(atom);
          const isAbilityDice = (atom.name || '').toLowerCase() === 'abilitydice';
          const abilitySeq = isAbilityDice ? this.getAbilityDiceSequence(atom) : [];
          const scale = this.getIconScale(atom);
          const repeatCount = this.getTokenRepeatCount(atom);
          const iconSizeForAtom = iconSize * scale;
          const iconAdvance = this.getIconAdvanceWidth(spaceWidth, iconSize, atom);
          const iconGap = isAbilityDice
            ? this.getAbilityDiceGapPx(iconSizeForAtom)
            : Math.max(1, iconSizeForAtom * 0.1);
          const totalIconWidth = (iconSizeForAtom * repeatCount) + (iconGap * Math.max(0, repeatCount - 1));
          const iconX = x + (iconAdvance - totalIconWidth) / 2;
          const iconYOffset = Math.max(0, (textHeight - iconSizeForAtom) / 2)
            + this.getIconYOffsetAdjust(atom, iconSizeForAtom);
          const overlayText = this.getIconOverlayText(atom);
          const drawOverlay = () => {
            if (!overlayText) return;
            const overlaySize = Math.max(
              1,
              iconSizeForAtom * 0.73205 * this.getIconOverlayScale(atom) + this.getIconOverlaySizeAdjust(atom)
            );
            const overlayFont = this.formatFontWithSize(ctx.font, overlaySize, 'Arial');
            ctx.save();
            ctx.font = overlayFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              overlayText,
              iconX + iconSizeForAtom / 2,
              y + iconYOffset + iconSizeForAtom / 2 + iconSizeForAtom * 0.02
                + this.getIconOverlayYOffsetAdjust(atom, iconSizeForAtom)
            );
            ctx.restore();
          };
          if (path) {
            const icon = this.getIconImageForAtom(atom, path);
            if (icon) {
              for (let i = 0; i < repeatCount; i += 1) {
                const renderIcon = (isAbilityDice && abilitySeq.length)
                  ? (this.getAbilityDiceCompositeIcon(atom, abilitySeq[i]) || icon)
                  : icon;
                drawIconToBox(
                  renderIcon,
                  iconX + i * (iconSizeForAtom + iconGap),
                  y + iconYOffset,
                  iconSizeForAtom
                );
              }
              drawOverlay();
              x += iconAdvance;
              return;
            }
          }
          const boxY = y + iconYOffset;
          ctx.save();
          ctx.fillStyle = 'rgba(220, 70, 200, 0.75)';
          ctx.fillRect(iconX, boxY, iconSizeForAtom, iconSizeForAtom);
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 1;
          ctx.strokeRect(iconX + 0.5, boxY + 0.5, iconSizeForAtom - 1, iconSizeForAtom - 1);
          ctx.restore();
          drawOverlay();
          x += iconAdvance;
        }
      });
    });
  }

  drawLaidOutRichTextWithIcons(
    ctx,
    layout,
    originX,
    originY,
    iconSize,
    align = 'left',
    letterSpacing = 0,
    fontSize = 18,
    defaultFont = 'Arial'
  ) {
    ctx.font = `700 ${fontSize}px ${this.getFontFamily(defaultFont)}`;
    const metrics = ctx.measureText('Mg');
    const textHeight = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0);

    const setFont = (font) => {
      const safe = font || defaultFont || 'Arial';
      ctx.font = `700 ${fontSize}px ${this.getFontFamily(safe)}`;
    };

    const measureSpace = (font) => {
      setFont(font);
      return Math.max(0, ctx.measureText(' ').width);
    };

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
      if (row > 0) {
        x -= 1;
      }
      const y = originY + row * layout.lineHeight - (row > 0 ? 1 : 0);
      line.atoms.forEach((atom) => {
        if (atom.type === 'space') {
          x += measureSpace(atom.font);
          return;
        }
        if (atom.type === 'text') {
          setFont(atom.font);
          ctx.textBaseline = 'top';
          const textWidth = this.drawTextWithSpacing(ctx, atom.value, x, y, letterSpacing);
          x += textWidth;
          return;
        }
        if (atom.type === 'icon') {
          const path = this.resolveIconPath(atom);
          const isAbilityDice = (atom.name || '').toLowerCase() === 'abilitydice';
          const abilitySeq = isAbilityDice ? this.getAbilityDiceSequence(atom) : [];
          const scale = this.getIconScale(atom);
          const repeatCount = this.getTokenRepeatCount(atom);
          const iconSizeForAtom = iconSize * scale;
          const iconAdvance = this.getIconAdvanceWidth(measureSpace(atom.font), iconSize, atom);
          const iconGap = isAbilityDice
            ? this.getAbilityDiceGapPx(iconSizeForAtom)
            : Math.max(1, iconSizeForAtom * 0.1);
          const totalIconWidth = (iconSizeForAtom * repeatCount) + (iconGap * Math.max(0, repeatCount - 1));
          const iconX = x + (iconAdvance - totalIconWidth) / 2;
          const iconYOffset = Math.max(0, (textHeight - iconSizeForAtom) / 2)
            + this.getIconYOffsetAdjust(atom, iconSizeForAtom);
          const overlayText = this.getIconOverlayText(atom);
          const drawOverlay = () => {
            if (!overlayText) return;
            const overlaySize = Math.max(
              1,
              iconSizeForAtom * 0.73205 * this.getIconOverlayScale(atom) + this.getIconOverlaySizeAdjust(atom)
            );
            const overlayFont = this.buildFontWithSize(atom.font || defaultFont, overlaySize);
            ctx.save();
            ctx.font = overlayFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              overlayText,
              iconX + iconSizeForAtom / 2,
              y + iconYOffset + iconSizeForAtom / 2 + iconSizeForAtom * 0.02
                + this.getIconOverlayYOffsetAdjust(atom, iconSizeForAtom)
            );
            ctx.restore();
          };
          if (path) {
            const icon = this.getIconImageForAtom(atom, path);
            if (icon) {
              for (let i = 0; i < repeatCount; i += 1) {
                const renderIcon = (isAbilityDice && abilitySeq.length)
                  ? (this.getAbilityDiceCompositeIcon(atom, abilitySeq[i]) || icon)
                  : icon;
                drawIconToBox(
                  renderIcon,
                  iconX + i * (iconSizeForAtom + iconGap),
                  y + iconYOffset,
                  iconSizeForAtom
                );
              }
              drawOverlay();
              x += iconAdvance;
              return;
            }
          }
          const boxY = y + iconYOffset;
          ctx.save();
          ctx.fillStyle = 'rgba(220, 70, 200, 0.75)';
          ctx.fillRect(iconX, boxY, iconSizeForAtom, iconSizeForAtom);
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 1;
          ctx.strokeRect(iconX + 0.5, boxY + 0.5, iconSizeForAtom - 1, iconSizeForAtom - 1);
          ctx.restore();
          drawOverlay();
          x += iconAdvance;
        }
      });
    });
  }

}

// Initialize renderer
const renderer = new CardRenderer();

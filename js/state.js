// State Management
const DTC_STATE_ROOT = typeof window !== 'undefined' ? window : globalThis;
const DTC_STATE_COMMON = DTC_STATE_ROOT.DTC_COMMON || {};
const deepCloneState = DTC_STATE_COMMON.deepClone || ((value) => JSON.parse(JSON.stringify(value)));
const DTC_STATE_DEFAULT_LAYER_ORDER = Array.isArray(DTC_STATE_COMMON.DEFAULT_LAYER_ORDER)
  ? [...DTC_STATE_COMMON.DEFAULT_LAYER_ORDER]
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

class CardState {
  constructor() {
    this.card = this.getDefaultCard();
    this.history = [deepCloneState(this.card)];
    this.historyIndex = 0;
  }

  getDefaultLayerOrder() {
    return [...DTC_STATE_DEFAULT_LAYER_ORDER];
  }

  normalizeLayerOrder(order) {
    const fallback = this.getDefaultLayerOrder();
    if (typeof DTC_STATE_COMMON.normalizeLayerOrder === 'function') {
      return DTC_STATE_COMMON.normalizeLayerOrder(order, fallback);
    }
    return fallback;
  }

  normalizeHiddenLayers(hiddenLayers, order) {
    const safe = Array.isArray(hiddenLayers) ? hiddenLayers : [];
    const allowed = new Set(this.normalizeLayerOrder(order));
    const seen = new Set();
    return safe.filter((key) => {
      if (!allowed.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getDefaultCard() {
    return {
      cardType: 'Action Cards',
      cardSubType: 'Main Phase',
      cardId: '',
      cardIdFont: 'MYRIADPRO-REGULAR',
      cardIdFontSize: 15,
      cardIdOffset: 0,
      cardIdOffsetX: -3.5,
      name: 'Title',
      titleBlocks: [
        {
          id: 'title-1',
          text: 'Title',
          position: { x: 1.4874028450301893, y: -1.2779890290537477 }
        }
      ],
      activeTitleId: 'title-1',
      description: 'place holder',
      descriptionRich: [],
      descriptionHtml: '',
      descriptionBlocks: [
        {
          id: 'desc-1',
          description: 'place holder',
          descriptionRich: [],
          descriptionHtml: '',
          position: { x: 0, y: 0 },
          scale: 1,
          fontSize: 39,
          color: '#ffffff'
        }
      ],
      activeDescriptionId: 'desc-1',
      leafletDescriptionBlocks: [
        {
          id: 'leaflet-desc-1',
          description: 'place holder',
          descriptionRich: [],
          descriptionHtml: '',
          position: { x: 0, y: 0 },
          scale: 1,
          fontSize: 20,
          color: '#ffffff'
        }
      ],
      leafletActiveDescriptionId: 'leaflet-desc-1',
      titleFont: 'PHOSPHATE_FIXED_SOLID',
      descriptionFont: 'MYRIADPRO-BOLDCOND',
      titleFontSize: 46,
      descriptionFontSize: 39,
      descriptionColor: '#ffffff',
      defaultDiceColor: '#33ccff',
      descriptionLineHeightScale: 1.2,
      titleLetterSpacing: 0.5,
      descriptionLetterSpacing: 0,
      descriptionBaselineOffset: -1,
      positionUnits: 'base',
      artUrl: null,
      artData: null, // Base64 encoded image
      artSourceUrl: null,
      artSourceData: null,
      artCropTransform: null,
      artTransform: { x: 0, y: 0, scale: 1 },
      artCropToFrame: false,
      artWasCropped: false,
      titlePosition: { x: 1.4874028450301893, y: -1.2779890290537477 },
      descriptionPosition: { x: 0, y: 0 },
      export: {
        includeBleed: true
      },
      layers: {
        cardBleed: false,
        backgroundLower: true,
        backgroundUpper: true,
        imageFrame: true,
        frameShading: true,
        border: true,
        cardId: true,
        titleBar: true,
        panelUpper: true,
        titleText: true,
        artwork: true,
        panelBleed: true,
        bottomText: true,
        secondAbilityFrame: true,
        panelLower: true,
        topNameGradient: true,
        bottomNameGradient: true,
        costBadge: true,
        attackModifier: false,
        cardText: true
      },
      layerOrder: this.getDefaultLayerOrder(),
      hiddenLayers: [],
      theme: 'warrior',
      font: 'Arial',
      costBadge: {
        value: '',
        fontSize: 33
      },
      costBadgePosition: { x: -1.5999755859375, y: 2.399993896484375 },
      abilityDiceEntries: [],
      customStatusEffects: [],
      leafletSide: 'front',
      leafletBreaks: [],
      leafletLayers: {
        background: true,
        art: true,
        title: true,
        text: true
      }
    };
  }

  // Update card properties
  updateProperty(key, value) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      this.card[parent][child] = value;
    } else {
      this.card[key] = value;
    }
    this.addToHistory();
  }

  // Batch update properties
  updateProperties(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        this.card[parent][child] = value;
      } else {
        this.card[key] = value;
      }
    });
    this.addToHistory();
  }

  // Get current card state
  getCard() {
    return deepCloneState(this.card);
  }

  // History management
  addToHistory() {
    // Remove any history after current index (for redo)
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(deepCloneState(this.card));
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.card = deepCloneState(this.history[this.historyIndex]);
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.card = deepCloneState(this.history[this.historyIndex]);
      return true;
    }
    return false;
  }

  // Save to JSON
  toJSON() {
    return JSON.stringify(this.card, null, 2);
  }

  // Load from JSON
  fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const defaults = this.getDefaultCard();
      const safeData = data && typeof data === 'object' ? data : {};
      const safeExport = safeData.export && typeof safeData.export === 'object' ? safeData.export : {};
      const safeLayers = safeData.layers && typeof safeData.layers === 'object' ? safeData.layers : {};
      const safeCostBadge = safeData.costBadge && typeof safeData.costBadge === 'object' ? safeData.costBadge : {};
      const safeArtTransform = safeData.artTransform && typeof safeData.artTransform === 'object' ? safeData.artTransform : {};
      const safeCostBadgePosition = safeData.costBadgePosition && typeof safeData.costBadgePosition === 'object' ? safeData.costBadgePosition : {};
      const safeTitlePosition = safeData.titlePosition && typeof safeData.titlePosition === 'object' ? safeData.titlePosition : {};
      const safeDescriptionPosition = safeData.descriptionPosition && typeof safeData.descriptionPosition === 'object' ? safeData.descriptionPosition : {};
      const safeLeafletLayers = safeData.leafletLayers && typeof safeData.leafletLayers === 'object' ? safeData.leafletLayers : {};

      this.card = { ...defaults, ...safeData };
      this.card.export = { ...defaults.export, ...safeExport };
      this.card.layers = { ...defaults.layers, ...safeLayers };
      this.card.costBadge = { ...defaults.costBadge, ...safeCostBadge };
      this.card.artTransform = { ...defaults.artTransform, ...safeArtTransform };
      this.card.costBadgePosition = { ...defaults.costBadgePosition, ...safeCostBadgePosition };
      this.card.titlePosition = { ...defaults.titlePosition, ...safeTitlePosition };
      this.card.descriptionPosition = { ...defaults.descriptionPosition, ...safeDescriptionPosition };
      this.card.leafletLayers = { ...defaults.leafletLayers, ...safeLeafletLayers };
      this.card.layerOrder = this.normalizeLayerOrder(data.layerOrder || this.card.layerOrder);
      this.card.hiddenLayers = this.normalizeHiddenLayers(data.hiddenLayers, this.card.layerOrder);
      if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(this.card.defaultDiceColor || '').trim())) {
        this.card.defaultDiceColor = defaults.defaultDiceColor;
      }
      if (!Array.isArray(data.titleBlocks) || !data.titleBlocks.length) {
        this.card.titleBlocks = [
          {
            id: 'title-1',
            text: data.name ?? this.card.name,
            position: data.titlePosition ?? { x: 1.4874028450301893, y: -1.2779890290537477 }
          }
        ];
        this.card.activeTitleId = data.activeTitleId || 'title-1';
      }
      if (!Array.isArray(data.descriptionBlocks) || !data.descriptionBlocks.length) {
        this.card.descriptionBlocks = [
          {
            id: 'desc-1',
            description: data.description ?? this.card.description,
            descriptionRich: Array.isArray(data.descriptionRich) ? data.descriptionRich : [],
            descriptionHtml: data.descriptionHtml ?? '',
            position: data.descriptionPosition ?? { x: 0, y: 0 },
            scale: 1,
            fontSize: data.descriptionFontSize ?? this.card.descriptionFontSize,
            color: data.descriptionColor ?? this.card.descriptionColor ?? '#ffffff'
          }
        ];
        this.card.activeDescriptionId = data.activeDescriptionId || 'desc-1';
      }
      if (!Array.isArray(data.leafletDescriptionBlocks) || !data.leafletDescriptionBlocks.length) {
        this.card.leafletDescriptionBlocks = [
          {
            id: 'leaflet-desc-1',
            description: data.description ?? this.card.description,
            descriptionRich: Array.isArray(data.descriptionRich) ? data.descriptionRich : [],
            descriptionHtml: data.descriptionHtml ?? '',
            position: { x: 0, y: 0 },
            scale: 1,
            fontSize: defaults.leafletDescriptionBlocks?.[0]?.fontSize ?? 20,
            color: defaults.leafletDescriptionBlocks?.[0]?.color ?? '#ffffff'
          }
        ];
        this.card.leafletActiveDescriptionId = data.leafletActiveDescriptionId || 'leaflet-desc-1';
      }
      this.addToHistory();
      return true;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return false;
    }
  }

  // Reset to default
  reset() {
    this.card = this.getDefaultCard();
    this.history = [deepCloneState(this.card)];
    this.historyIndex = 0;
  }
}

// Export for use in other files
const gameState = new CardState();

if (typeof window !== 'undefined') {
  window.CardState = CardState;
  window.gameState = gameState;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CardState, gameState };
}


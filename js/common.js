// Shared runtime config and utilities
(function initDtcCommon(global) {
  const DEFAULT_LAYER_ORDER = Object.freeze([
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
  ]);

  const EXPORT_CARD_SIZE = Object.freeze({
    width: 675,
    height: 1050
  });

  function deepClone(value) {
    if (typeof global.structuredClone === 'function') {
      try {
        return global.structuredClone(value);
      } catch (error) {
        // Fall back to JSON clone below.
      }
    }
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeLayerOrder(order, fallbackOrder = DEFAULT_LAYER_ORDER) {
    const fallback = Array.isArray(fallbackOrder) ? [...fallbackOrder] : [...DEFAULT_LAYER_ORDER];
    const provided = Array.isArray(order) ? order : [];
    const allowed = new Set(fallback);
    const seen = new Set();
    const normalized = [];

    for (const key of provided) {
      if (!allowed.has(key) || seen.has(key)) continue;
      seen.add(key);
      normalized.push(key);
    }
    for (const key of fallback) {
      if (!seen.has(key)) normalized.push(key);
    }

    const bleedIndex = normalized.indexOf('cardBleed');
    if (bleedIndex > 0) {
      normalized.splice(bleedIndex, 1);
      normalized.unshift('cardBleed');
    }
    return normalized;
  }

  global.DTC_COMMON = Object.freeze({
    DEFAULT_LAYER_ORDER,
    EXPORT_CARD_SIZE,
    deepClone,
    normalizeLayerOrder
  });
})(window);

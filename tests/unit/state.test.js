import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

function loadStateModule() {
  globalThis.DTC_COMMON = {};
  const modulePath = require.resolve('../../js/state.js');
  delete require.cache[modulePath];
  return require(modulePath);
}

describe('CardState', () => {
  it('tracks updates through undo and redo', () => {
    const { CardState } = loadStateModule();
    const state = new CardState();

    state.updateProperty('cardType', 'Hero Upgrade');
    state.updateProperty('costBadge.value', '3');

    expect(state.getCard().cardType).toBe('Hero Upgrade');
    expect(state.getCard().costBadge.value).toBe('3');
    expect(state.historyIndex).toBe(2);

    expect(state.undo()).toBe(true);
    expect(state.getCard().costBadge.value).toBe('');

    expect(state.redo()).toBe(true);
    expect(state.getCard().costBadge.value).toBe('3');
  });

  it('loads JSON while preserving synthesized defaults', () => {
    const { CardState } = loadStateModule();
    const state = new CardState();
    const ok = state.fromJSON(JSON.stringify({
      name: 'Test Card',
      cardType: 'Hero Upgrade',
      cardSubType: 'Offensive Roll Phase',
      layers: {
        border: false
      },
      costBadge: {
        value: '4'
      },
      leafletLayers: {
        title: false
      }
    }));

    expect(ok).toBe(true);
    const card = state.getCard();
    expect(card.name).toBe('Test Card');
    expect(card.costBadge.value).toBe('4');
    expect(card.costBadge.fontSize).toBe(33);
    expect(card.titleBlocks).toHaveLength(1);
    expect(card.descriptionBlocks).toHaveLength(1);
    expect(card.leafletDescriptionBlocks).toHaveLength(1);
    expect(card.leafletDescriptionBlocks[0].fontSize).toBe(20);
    expect(card.descriptionColor).toBe('#ffffff');
    expect(card.defaultDiceColor).toBe('#33ccff');
    expect(card.descriptionBlocks[0].fontSize).toBe(39);
    expect(card.descriptionBlocks[0].color).toBe('#ffffff');
    expect(card.layers.border).toBe(false);
    expect(card.layers.backgroundLower).toBe(true);
    expect(card.leafletLayers.title).toBe(false);
    expect(card.leafletLayers.text).toBe(true);
  });
});

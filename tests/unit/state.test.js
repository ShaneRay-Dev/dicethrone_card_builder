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
      cardSubType: 'Offensive Roll Phase'
    }));

    expect(ok).toBe(true);
    expect(state.getCard().name).toBe('Test Card');
    expect(state.getCard().costBadge.value).toBe('');
    expect(state.getCard().titleBlocks).toHaveLength(1);
    expect(state.getCard().descriptionBlocks).toHaveLength(1);
    expect(state.getCard().leafletDescriptionBlocks).toHaveLength(1);
    expect(state.getCard().leafletDescriptionBlocks[0].fontSize).toBe(20);
    expect(state.getCard().descriptionColor).toBe('#ffffff');
    expect(state.getCard().descriptionBlocks[0].fontSize).toBe(39);
    expect(state.getCard().descriptionBlocks[0].color).toBe('#ffffff');
  });
});

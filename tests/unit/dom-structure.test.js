import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

describe('index.html upload markup', () => {
  it('uses native file inputs for art and reference uploads', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const imageUpload = document.getElementById('imageUpload');
    const referenceUpload = document.getElementById('referenceImage');

    expect(imageUpload).not.toBeNull();
    expect(imageUpload?.tagName).toBe('INPUT');
    expect(imageUpload?.getAttribute('type')).toBe('file');
    expect(imageUpload?.classList.contains('upload-input')).toBe(true);

    expect(referenceUpload).not.toBeNull();
    expect(referenceUpload?.tagName).toBe('INPUT');
    expect(referenceUpload?.getAttribute('type')).toBe('file');
    expect(referenceUpload?.classList.contains('upload-input')).toBe(true);

    expect(document.getElementById('imageUploadLabel')).toBeNull();
    expect(document.getElementById('referenceImageLabel')).toBeNull();

    dom.window.close();
  });

  it('includes a real board preview layer for the board workspace', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const boardPreview = document.getElementById('boardPreview');
    const cardDragGuideLayer = document.getElementById('cardDragGuideLayer');
    const boardLayer = document.getElementById('boardWorkingAreaLayer');
    const boardLayerToggles = [
      document.getElementById('boardLayerWorkingArea'),
      document.getElementById('boardLayerAbilityPadding'),
      document.getElementById('boardLayerAbilityBoundary')
    ];
    const boardSlotsLayer = document.getElementById('boardSlotsLayer');

    expect(boardPreview).not.toBeNull();
    expect(cardDragGuideLayer).not.toBeNull();
    expect(cardDragGuideLayer?.classList.contains('card-drag-guide-layer')).toBe(true);
    expect(boardPreview?.classList.contains('board-preview')).toBe(true);
    expect(boardPreview?.getAttribute('data-tool-panel')).toBe('board-render');

    expect(boardLayer).not.toBeNull();
    expect(boardLayer?.classList.contains('board-layer')).toBe(true);
    expect(boardLayer?.classList.contains('board-layer-working-area')).toBe(true);
    boardLayerToggles.forEach((toggle) => {
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('type')).toBe('checkbox');
    });
    expect(boardSlotsLayer).not.toBeNull();

    dom.window.close();
  });

  it('keeps Board Abilities out of the Card Creator type selector', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const cardType = document.getElementById('cardType');
    const options = Array.from(cardType?.querySelectorAll('option') || []).map((node) => node.textContent?.trim());

    expect(options).toContain('Hero Upgrade');
    expect(options).toContain('Action Cards');
    expect(options).not.toContain('Board Abilities');

    dom.window.close();
  });

  it('offers separate custom border and full card art crop masks', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const cropMaskSelect = document.getElementById('cropMaskSelect');
    const options = Array.from(cropMaskSelect?.querySelectorAll('option') || []).map((node) => ({
      value: node.getAttribute('value'),
      text: node.textContent?.trim(),
      mode: node.getAttribute('data-mask-mode')
    }));

    expect(options).toContainEqual({
      value: 'Assets/Action Cards/Main Phase/Main Action Frame.png',
      text: 'Custom Boarder',
      mode: 'alpha'
    });
    expect(options).toContainEqual({
      value: 'inside-frame|Assets/Action Cards/Main Phase/Main Action Frame.png',
      text: 'Full Card Art',
      mode: 'inside-frame'
    });

    dom.window.close();
  });

  it('renders board ability placement controls in the board creator panel', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const addCurrent = document.getElementById('boardAddCurrentAbilityBtn');
    const boardCreatorMode = document.getElementById('boardCreatorMode');
    const placementSelect = document.getElementById('boardPlacementSelect');
    const addSaved = document.getElementById('boardPlacementAddBtn');
    const placementList = document.getElementById('boardPlacementList');
    const oldUltimateInput = document.getElementById('boardUltimateTextInput');
    const oldUltimateLayer = document.getElementById('boardUltimateSlotLayer');

    expect(boardCreatorMode).not.toBeNull();
    expect(boardCreatorMode?.tagName).toBe('SELECT');
    expect(Array.from(boardCreatorMode?.querySelectorAll('option') || []).map((node) => node.value)).toEqual(['board', 'ability']);
    expect(addCurrent).not.toBeNull();
    expect(addCurrent?.tagName).toBe('BUTTON');
    expect(placementSelect).not.toBeNull();
    expect(placementSelect?.tagName).toBe('SELECT');
    expect(addSaved).not.toBeNull();
    expect(addSaved?.tagName).toBe('BUTTON');
    expect(placementList).not.toBeNull();
    expect(oldUltimateInput).toBeNull();
    expect(oldUltimateLayer).toBeNull();

    dom.window.close();
  });

  it('includes leaflet side and break controls for the leaflet workspace', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const leafletSide = document.getElementById('leafletSide');
    const leafletBreakAddBtn = document.getElementById('leafletBreakAddBtn');
    const leafletBreakList = document.getElementById('leafletBreakList');
    const leafletBreakLayer = document.getElementById('leafletBreakLayer');

    expect(leafletSide).not.toBeNull();
    expect(leafletSide?.tagName).toBe('SELECT');
    expect(Array.from(leafletSide?.querySelectorAll('option') || []).map((node) => node.value)).toEqual(['front', 'back']);

    expect(leafletBreakAddBtn).not.toBeNull();
    expect(leafletBreakAddBtn?.tagName).toBe('BUTTON');
    expect(leafletBreakList).not.toBeNull();
    expect(leafletBreakLayer).not.toBeNull();

    dom.window.close();
  });

  it('includes default dice color controls', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const colorPicker = document.getElementById('defaultDiceColorPicker');
    const colorHex = document.getElementById('defaultDiceColor');

    expect(colorPicker).not.toBeNull();
    expect(colorPicker?.tagName).toBe('INPUT');
    expect(colorPicker?.getAttribute('type')).toBe('color');
    expect(colorHex).not.toBeNull();
    expect(colorHex?.tagName).toBe('INPUT');
    expect(colorHex?.getAttribute('type')).toBe('text');

    dom.window.close();
  });

  it('includes a dismissible information alert banner', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const banner = document.getElementById('infoBanner');
    const dismiss = document.getElementById('infoBannerDismiss');

    expect(banner).not.toBeNull();
    expect(banner?.getAttribute('role')).toBe('status');
    expect(banner?.textContent).toContain('Creator Notice');
    expect(dismiss).not.toBeNull();
    expect(dismiss?.getAttribute('aria-label')).toBe('Dismiss information alert');

    dom.window.close();
  });

});

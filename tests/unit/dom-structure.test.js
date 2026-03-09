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
    const boardLayer = document.getElementById('boardAbilityLocationLayer');
    const boardSlotCards = Array.from(document.querySelectorAll('.board-slot-card'));

    expect(boardPreview).not.toBeNull();
    expect(boardPreview?.classList.contains('board-preview')).toBe(true);
    expect(boardPreview?.getAttribute('data-tool-panel')).toBe('board-render');

    expect(boardLayer).not.toBeNull();
    expect(boardLayer?.classList.contains('board-layer')).toBe(true);
    expect(boardLayer?.classList.contains('board-layer-ability-location')).toBe(true);
    expect(boardSlotCards).toHaveLength(8);

    dom.window.close();
  });

  it('offers Board Abilities as a card type option', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const cardType = document.getElementById('cardType');
    const options = Array.from(cardType?.querySelectorAll('option') || []).map((node) => node.textContent?.trim());

    expect(options).toContain('Hero Upgrade');
    expect(options).toContain('Action Cards');
    expect(options).toContain('Board Abilities');

    dom.window.close();
  });

  it('renders eight board slot dropdowns in the board creator panel', async () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const boardSlots = Array.from(document.querySelectorAll('.board-slot-select'));

    expect(boardSlots).toHaveLength(8);
    boardSlots.forEach((selectEl, index) => {
      expect(selectEl.id).toBe(`boardSlot${index + 1}`);
    });

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

});

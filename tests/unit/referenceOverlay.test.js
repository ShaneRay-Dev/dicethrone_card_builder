import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);

function buildReferenceHtml() {
  return `
    <!doctype html>
    <html>
      <body>
        <input id="referenceImage" type="file">
        <select id="referenceSelect">
          <option value="">None</option>
          <option value="__upload__">Uploaded</option>
        </select>
        <input id="showReference" type="checkbox">
        <input id="showReferenceSideBySide" type="checkbox">
        <input id="referenceOpacity" type="range" value="0.7">
        <div id="referencePreview"></div>
        <div id="referenceOverlay"></div>
        <div id="referenceSide"></div>
        <div id="previewContainer"></div>
      </body>
    </html>
  `;
}

async function createManager() {
  const dom = new JSDOM(buildReferenceHtml(), {
    url: 'http://localhost/'
  });
  const alertSpy = vi.fn();
  const { document } = dom.window;
  globalThis.window = dom.window;
  globalThis.document = document;
  globalThis.FileReader = dom.window.FileReader;
  globalThis.File = dom.window.File;
  globalThis.alert = alertSpy;
  globalThis.defaultReferencePath = '';

  const modulePath = require.resolve('../../js/referenceOverlay.js');
  delete require.cache[modulePath];
  const { ReferenceOverlayManager } = require(modulePath);

  const manager = new ReferenceOverlayManager({
    referenceImageInput: document.getElementById('referenceImage'),
    referencePreview: document.getElementById('referencePreview'),
    referenceSelect: document.getElementById('referenceSelect'),
    showReferenceCheckbox: document.getElementById('showReference'),
    showReferenceSideBySideCheckbox: document.getElementById('showReferenceSideBySide'),
    referenceOverlay: document.getElementById('referenceOverlay'),
    referenceSide: document.getElementById('referenceSide'),
    referenceOpacity: document.getElementById('referenceOpacity'),
    previewContainer: document.getElementById('previewContainer')
  });

  return { alertSpy, dom, manager };
}

describe('ReferenceOverlayManager', () => {
  it('applies an uploaded image to the preview and overlay', async () => {
    const { dom, manager } = await createManager();
    const file = new dom.window.File(
      ['<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"></svg>'],
      'reference.svg',
      { type: 'image/svg+xml' }
    );

    const result = await manager.handleFile(file);

    expect(result).toBe(true);
    expect(dom.window.document.querySelector('#referencePreview img')).not.toBeNull();
    expect(dom.window.document.getElementById('referenceOverlay').style.backgroundImage).toContain('data:image/svg+xml');
    expect(dom.window.document.getElementById('referenceSelect').value).toBe('__upload__');

    dom.window.close();
  });

  it('rejects non-image uploads', async () => {
    const { alertSpy, dom, manager } = await createManager();
    const file = new dom.window.File(['not an image'], 'bad.txt', { type: 'text/plain' });

    const result = await manager.handleFile(file);

    expect(result).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Please select a valid image file');

    dom.window.close();
  });
});

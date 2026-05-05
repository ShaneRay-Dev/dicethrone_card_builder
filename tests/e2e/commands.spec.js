import { test, expect } from '@playwright/test';

const quillStub = `
  (() => {
    class FakeQuill {
      constructor(root) {
        this.root = root;
        this.clipboard = {
          dangerouslyPasteHTML: (html = '') => {
            this.root.innerHTML = html;
          }
        };
      }
      static import() {
        return { whitelist: [] };
      }
      static register() {}
      on() {}
      getContents() {
        return [];
      }
      getText() {
        return (this.root.textContent || '') + '\\n';
      }
      focus() {}
      format() {}
      getSelection() {
        return null;
      }
      setSelection() {}
      setText(text) {
        this.root.textContent = text;
      }
    }
    window.Quill = FakeQuill;
  })();
`;

const jspdfStub = `
  window.jspdf = {
    jsPDF: function jsPDF() {}
  };
`;

test.beforeEach(async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: quillStub
    });
  });

  await page.route('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: jspdfStub
    });
  });
});

test('shows the dice commands in the Other Commands list', async ({ page }) => {
  await page.goto('/index.html');

  await page.locator('#toggleOtherCommands').check();
  await expect(page.locator('#otherCommandsTableBody')).toContainText('Basic Dice');
  await expect(page.locator('#otherCommandsTableBody')).toContainText('{{basicdice,3,#33ccff}}');
  await expect(page.locator('#otherCommandsTableBody')).toContainText('Text Dice');
  await expect(page.locator('#otherCommandsTableBody')).toContainText('{{textdice,3,#33ccff}}');
  await expect(page.locator('#otherCommandsTableBody')).toContainText('Defensive Dice');
  await expect(page.locator('#otherCommandsTableBody')).toContainText('{{defensivedice,3}}');
});

test('worker compositor can render a PNG blob', async ({ page }) => {
  await page.goto('/index.html');

  const result = await page.evaluate(async () => {
    if (typeof ui === 'undefined' || typeof ui.runRenderWorker !== 'function') {
      return { supported: false, reason: 'ui unavailable' };
    }
    if (!ui.supportsRenderWorker()) {
      return { supported: false, reason: 'worker unsupported' };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff00aa';
    ctx.fillRect(0, 0, 8, 8);
    const blobUrl = URL.createObjectURL(await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    }));
    const badge = new URL('Assets/CostBadge/cp_cost_0.png', document.baseURI).href;
    try {
      const response = await ui.runRenderWorker('compose-deck', {
        width: 8,
        height: 8,
        background: '#000000',
        baseLayer: badge,
        items: [{ src: blobUrl, x: 0, y: 0, width: 8, height: 8 }]
      });
      return {
        supported: true,
        type: response.blob?.type || '',
        size: response.blob?.size || 0
      };
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  });

  expect(result.supported).toBe(true);
  expect(result.type).toBe('image/png');
  expect(result.size).toBeGreaterThan(0);
});

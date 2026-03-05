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

const html2canvasStub = `
  window.html2canvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas;
  };
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

  await page.route('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: html2canvasStub
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

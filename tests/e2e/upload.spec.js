import path from 'node:path';
import { test, expect } from '@playwright/test';

const fixturePath = path.resolve(process.cwd(), 'tests/fixtures/test-image.svg');

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

test('uploads card art and reference images', async ({ page }) => {
  await page.goto('/index.html');

  await expect(page.locator('#imageUpload')).toBeVisible();
  await page.setInputFiles('#imageUpload', fixturePath);
  await expect(page.locator('#imagePreview img')).toBeVisible();
  await expect(page.locator('#btn-clear-image')).toBeVisible();

  await page.setInputFiles('#referenceImage', fixturePath);
  await expect(page.locator('#referencePreview img')).toHaveAttribute('src', /^data:image\/svg\+xml/);
});

test('manual clicks on upload controls open a file chooser', async ({ page }) => {
  await page.goto('/index.html');

  const artChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#imageUpload').click();
  const artChooser = await artChooserPromise;
  const artElement = await artChooser.element();
  await expect(await artElement.getAttribute('id')).toBe('imageUpload');

  const referenceSection = page.locator('details.panel-section').filter({ has: page.locator('#referenceImage') });
  await referenceSection.locator('summary').click();
  const referenceChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#referenceImage').click();
  const referenceChooser = await referenceChooserPromise;
  const referenceElement = await referenceChooser.element();
  await expect(await referenceElement.getAttribute('id')).toBe('referenceImage');

  await page.locator('#abilityDiceAddBtn').click();
  const abilityChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#abilityDiceList input[type="file"]').click();
  const abilityChooser = await abilityChooserPromise;
  const abilityElement = await abilityChooser.element();
  await expect(await abilityElement.getAttribute('type')).toBe('file');

  await page.locator('#workspaceLeafletBtn').click();
  await page.locator('#customStatusNameInput').fill('Click Check');
  await page.locator('#customStatusAddBtn').click();
  const statusChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#customStatusList input[type="file"]').click();
  const statusChooser = await statusChooserPromise;
  const statusElement = await statusChooser.element();
  await expect(await statusElement.getAttribute('type')).toBe('file');
});

test('uploads an ability dice icon from the inline uploader', async ({ page }) => {
  await page.goto('/index.html');

  await page.locator('#abilityDiceAddBtn').click();
  await page.setInputFiles('#abilityDiceList input[type="file"]', fixturePath);

  const preview = page.locator('#abilityDiceList .ability-dice-preview').first();
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('src', /^data:image\/svg\+xml/);
});

test('uploads a custom status icon from the inline uploader', async ({ page }) => {
  await page.goto('/index.html');

  await page.locator('#workspaceLeafletBtn').click();
  await page.locator('#customStatusNameInput').fill('Power Punch');
  await page.locator('#customStatusAddBtn').click();
  await page.setInputFiles('#customStatusList input[type="file"]', fixturePath);

  const preview = page.locator('#customStatusList .ability-dice-preview').first();
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('src', /^data:image\/svg\+xml/);
});

import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("here", "previews");
const outDir = path.join(root, "images");

const pages = [
  { input: "mockup-a.html", output: "mockup-a-command-center.png" },
  { input: "mockup-b.html", output: "mockup-b-studio-light.png" },
  { input: "mockup-c.html", output: "mockup-c-tactical-blueprint.png" }
];

async function toFileUrl(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return `file:///${normalized}`;
}

async function render() {
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 2000, height: 1160 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  for (const item of pages) {
    const inPath = path.join(root, item.input);
    const outPath = path.join(outDir, item.output);
    const url = await toFileUrl(inPath);

    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(80);

    const frame = page.locator(".frame");
    await frame.waitFor({ state: "visible", timeout: 3_000 });
    await frame.screenshot({
      path: outPath,
      type: "png"
    });
    console.log(`Rendered: ${outPath}`);
  }

  await context.close();
  await browser.close();
}

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

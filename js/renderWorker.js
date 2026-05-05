/* global OffscreenCanvas, createImageBitmap */
self.addEventListener('message', (event) => {
  const message = event.data || {};
  handleMessage(message).catch((error) => {
    self.postMessage({
      id: message.id,
      ok: false,
      error: error && error.message ? error.message : String(error || 'Worker render failed')
    });
  });
});

async function handleMessage(message) {
  const { id, type, payload } = message;
  if (type === 'compose-deck') {
    const result = await composeDeck(payload || {});
    self.postMessage({ id, ok: true, ...result });
    return;
  }
  if (type === 'compose-print-pages') {
    const result = await composePrintPages(payload || {});
    self.postMessage({ id, ok: true, ...result });
    return;
  }
  throw new Error(`Unknown worker render type: ${type}`);
}

async function loadBitmap(src) {
  const safeSrc = String(src || '');
  if (!safeSrc) return null;
  const response = await fetch(safeSrc);
  if (!response.ok) {
    throw new Error(`Failed to load image: ${safeSrc}`);
  }
  const blob = await response.blob();
  return createImageBitmap(blob);
}

function createCanvas(width, height) {
  const safeWidth = Math.max(1, Math.round(Number(width) || 1));
  const safeHeight = Math.max(1, Math.round(Number(height) || 1));
  const canvas = new OffscreenCanvas(safeWidth, safeHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create worker canvas context');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { canvas, ctx };
}

async function drawImageSource(ctx, src, x, y, width, height) {
  if (!src) return;
  let bitmap = null;
  try {
    bitmap = await loadBitmap(src);
    if (!bitmap) return;
    ctx.drawImage(bitmap, x, y, width, height);
  } finally {
    if (bitmap && typeof bitmap.close === 'function') bitmap.close();
  }
}

async function canvasToPngBlob(canvas) {
  if (typeof canvas.convertToBlob !== 'function') {
    throw new Error('Worker canvas blob export is unavailable');
  }
  return canvas.convertToBlob({ type: 'image/png' });
}

async function composeDeck(payload) {
  const width = Math.max(1, Math.round(Number(payload.width) || 1));
  const height = Math.max(1, Math.round(Number(payload.height) || 1));
  const { canvas, ctx } = createCanvas(width, height);
  ctx.fillStyle = payload.background || '#000000';
  ctx.fillRect(0, 0, width, height);

  if (payload.baseLayer) {
    await drawImageSource(ctx, payload.baseLayer, 0, 0, width, height);
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  for (const item of items) {
    await drawImageSource(
      ctx,
      item.src,
      Number(item.x) || 0,
      Number(item.y) || 0,
      Math.max(1, Number(item.width) || 1),
      Math.max(1, Number(item.height) || 1)
    );
  }

  if (payload.overlayLayer) {
    await drawImageSource(ctx, payload.overlayLayer, 0, 0, width, height);
  }

  const blob = await canvasToPngBlob(canvas);
  return { blob, width, height };
}

async function composePrintPages(payload) {
  const pages = Array.isArray(payload.pages) ? payload.pages : [];
  const blobs = [];

  for (const page of pages) {
    const width = Math.max(1, Math.round(Number(page.width) || 1));
    const height = Math.max(1, Math.round(Number(page.height) || 1));
    const { canvas, ctx } = createCanvas(width, height);
    ctx.fillStyle = page.background || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const layers = Array.isArray(page.layers) ? page.layers : [];
    for (const layer of layers) {
      await drawImageSource(ctx, layer.src, 0, 0, width, height);
    }

    const items = Array.isArray(page.items) ? page.items : [];
    for (const item of items) {
      await drawImageSource(
        ctx,
        item.src,
        Number(item.x) || 0,
        Number(item.y) || 0,
        Math.max(1, Number(item.width) || 1),
        Math.max(1, Number(item.height) || 1)
      );
    }

    blobs.push(await canvasToPngBlob(canvas));
  }

  return { blobs };
}

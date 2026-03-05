import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const rootDir = process.cwd();

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp']
]);

function resolvePath(requestUrl = '/') {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const resolved = path.resolve(rootDir, `.${pathname}`);
  if (!resolved.startsWith(rootDir)) {
    return null;
  }
  return resolved;
}

const server = http.createServer(async (req, res) => {
  const filePath = resolvePath(req.url);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes.get(ext) || 'application/octet-stream'
    });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Test server listening at http://${host}:${port}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

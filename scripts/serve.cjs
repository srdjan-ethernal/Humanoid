const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Humanoid: http://127.0.0.1:${port}`));


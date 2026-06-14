'use strict';
/* quietflix.zlef.fr — landing page + extension download.
   100% static: serves the public/ dir, including the packaged extension zip.
   No accounts, no tracking, nothing transits here. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 10040);
const ROOT = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/') p = '/index.html';
    // extensionless pretty paths (e.g. /privacy) → /privacy.html
    if (!path.extname(p) && fs.existsSync(path.join(ROOT, p + '.html'))) p += '.html';
    const file = path.normalize(path.join(ROOT, p));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('not found'); }
      const ext = path.extname(file).toLowerCase();
      const headers = { 'content-type': MIME[ext] || 'application/octet-stream' };
      if (ext === '.zip') headers['content-disposition'] = 'attachment; filename="quietflix.zip"';
      headers['cache-control'] = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
      res.writeHead(200, headers);
      res.end(buf);
    });
  } catch (e) {
    res.writeHead(500); res.end('error');
  }
});
server.listen(PORT, '127.0.0.1', () => console.log(`quietflix.zlef.fr (static) on 127.0.0.1:${PORT}`));

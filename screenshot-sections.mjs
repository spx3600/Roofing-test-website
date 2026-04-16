import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inline server
const mime = { '.html':'text/html','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.css':'text/css','.js':'application/javascript','.mjs':'application/javascript' };
const server = createServer(async (req, res) => {
  const rawPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const urlPath = decodeURIComponent(rawPath);
  const filePath = join(__dirname, urlPath);
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise(resolve => server.listen(3001, resolve));
console.log('Server on 3001');

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/work/.cache/puppeteer/chrome/win64-147.0.7727.56/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 15000 });

// Hero
await page.screenshot({ path: 'temporary screenshots/hero-check.png', clip: { x: 0, y: 0, width: 1440, height: 660 } });
console.log('Hero done');

// Shingle section
const servicesEl = await page.$('#services');
const sbox = await servicesEl.boundingBox();
await page.screenshot({ path: 'temporary screenshots/shingle-check.png', clip: { x: sbox.x, y: sbox.y, width: sbox.width, height: Math.min(sbox.height, 560) } });
console.log('Shingle done');

// About/team section
const aboutEl = await page.$('#about');
const abox = await aboutEl.boundingBox();
await page.screenshot({ path: 'temporary screenshots/team-check.png', clip: { x: abox.x, y: abox.y, width: abox.width, height: Math.min(abox.height, 560) } });
console.log('Team done');

// Gallery section
const galleryEl = await page.$('#gallery');
const gbox = await galleryEl.boundingBox();
await page.screenshot({ path: 'temporary screenshots/gallery-check.png', clip: { x: gbox.x, y: gbox.y, width: gbox.width, height: Math.min(gbox.height, 750) } });
console.log('Gallery done');

await browser.close();
server.close();
console.log('All done.');
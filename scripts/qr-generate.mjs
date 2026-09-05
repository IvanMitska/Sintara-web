/**
 * Renders the printable QR images — `npm run qr`.
 *
 * Output (committed, so the files are always at hand without a toolchain):
 *   qr/<code>.svg    vector — this is the one to send to a printer
 *   qr/<code>.png    1024px raster — for slides, chats, Instagram stories
 *   qr/index.html    contact sheet: every code with its label and destination
 *
 * Error correction is H (30% recoverable). The encoded string is ~18 characters,
 * so even at level H the matrix stays tiny and every module prints large — which
 * is what actually makes a code scan from a business card in bad light. The
 * headroom also survives a logo dropped in the middle later.
 *
 * Pure black on pure white, not the brand ink: scanners threshold the image, and
 * contrast is the only property that matters. Brand colour belongs around the
 * code, not in it.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { QR_CODES, publicUrl, targetUrl, validate } from '../src/data/qrCodes.mjs';

let QRCode;
try {
  QRCode = (await import('qrcode')).default;
} catch {
  console.error(
    'The "qrcode" package is missing. Run `npm install` first — it is a devDependency.',
  );
  process.exit(1);
}

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'qr');

validate();
mkdirSync(OUT, { recursive: true });

const OPTIONS = {
  errorCorrectionLevel: 'H',
  // Four modules of quiet zone. Below four, scanners start failing when the code
  // sits close to other ink — which on a business card it always does.
  margin: 4,
  color: { dark: '#000000', light: '#FFFFFF' },
};

const sheet = [];

for (const entry of QR_CODES) {
  const url = publicUrl(entry);

  const svg = await QRCode.toString(url, { ...OPTIONS, type: 'svg' });
  writeFileSync(join(OUT, `${entry.code}.svg`), svg, 'utf8');
  await QRCode.toFile(join(OUT, `${entry.code}.png`), url, { ...OPTIONS, width: 1024 });

  sheet.push({ ...entry, url, svg });
  console.log(`  ${entry.code}  ${url}  →  ${targetUrl(entry)}`);
}

// The sheet exists so the codes can be checked without opening five files: open
// it, scan each code with a phone, confirm it lands where the caption says. That
// two-minute check is the only thing standing between a typo in the registry and
// a thousand printed cards pointing at a 404.
const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<title>Sintara — QR-коды</title>
<style>
  body { font: 15px/1.5 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
         margin: 48px auto; max-width: 960px; color: #0A0A0C; padding: 0 24px; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  p.lead { color: #6B6B76; margin: 0 0 40px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 32px; }
  .card { border: 1px solid #E4E4EA; border-radius: 12px; padding: 20px; }
  .card svg { width: 100%; height: auto; display: block; }
  .code { font-weight: 600; margin-top: 14px; }
  .label { color: #0A0A0C; }
  .meta { color: #6B6B76; font-size: 13px; word-break: break-all; margin-top: 6px; }
  @media print { .card { break-inside: avoid; border-color: #000; } p.lead { display: none; } }
</style>
</head>
<body>
<h1>QR-коды Sintara</h1>
<p class="lead">Сгенерировано из scripts/qr-codes.mjs. Отсканируйте каждый код и проверьте, что он ведёт туда, что написано под ним.</p>
<div class="grid">
${sheet
  .map(
    (entry) => `  <div class="card">
    ${entry.svg.trim()}
    <div class="code">${entry.code} — ${entry.label}</div>
    <div class="meta">${entry.url}<br />→ ${entry.to} · ${entry.medium} · ${entry.content}</div>
  </div>`,
  )
  .join('\n')}
</div>
</body>
</html>
`;
writeFileSync(join(OUT, 'index.html'), html, 'utf8');

console.log(`\n${QR_CODES.length} codes written to qr/. Open qr/index.html to check them.\n`);

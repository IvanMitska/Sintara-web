/**
 * Renders the printable QR images — `npm run qr`.
 *
 * Four files per code, all with a transparent background so they drop straight
 * into a layout without a white box around them:
 *
 *   qr/<code>.svg / .png          black modules  — for light surfaces
 *   qr/<code>-white.svg / .png    white modules  — for dark surfaces
 *
 * plus qr/index.html, a contact sheet showing every code on both backgrounds.
 *
 * Transparency is a layout convenience, not a licence to put the code on a
 * photo: a scanner needs contrast between the modules and whatever shows
 * through, plus the empty margin around them. Keep a plain area behind the code
 * — the transparent version means that area can be the card's own colour
 * instead of a white patch.
 *
 * SVG is the file to send to a printer; the 1024px PNG is for slides, chats and
 * stories. On a dark card use the -white pair: inverted codes scan fine on
 * modern phones, but only when the contrast is real, so don't put white modules
 * on mid-grey.
 *
 * Error correction is H (30% recoverable). The encoded string is ~18 characters,
 * so even at level H the matrix stays tiny and every module prints large — which
 * is what actually makes a code scan from a business card in bad light. The
 * headroom also survives a logo dropped in the middle later.
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
};

// '#0000' is transparent black in the 4-digit hex the encoder accepts. Given a
// transparent light colour it drops the background rectangle from the SVG
// entirely, rather than emitting an invisible one.
const VARIANTS = [
  { suffix: '', color: { dark: '#000000', light: '#0000' } },
  { suffix: '-white', color: { dark: '#FFFFFF', light: '#0000' } },
];

const sheet = [];

for (const entry of QR_CODES) {
  const url = publicUrl(entry);
  const svgs = {};

  for (const variant of VARIANTS) {
    const options = { ...OPTIONS, color: variant.color };
    const svg = await QRCode.toString(url, { ...options, type: 'svg' });
    writeFileSync(join(OUT, `${entry.code}${variant.suffix}.svg`), svg, 'utf8');
    await QRCode.toFile(join(OUT, `${entry.code}${variant.suffix}.png`), url, {
      ...options,
      width: 1024,
    });
    svgs[variant.suffix || 'black'] = svg;
  }

  sheet.push({ ...entry, url, svgs });
  console.log(`  ${entry.code}  ${url}  →  ${targetUrl(entry)}`);
}

// The sheet exists so the codes can be checked without opening twenty files:
// open it, scan each code with a phone, confirm it lands where the caption says.
// That two-minute check is the only thing standing between a typo in the
// registry and a thousand printed cards pointing at a 404. Both variants are
// shown on the background they are meant for, which is also the only honest way
// to check that the white one scans.
const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sintara — QR-коды</title>
<style>
  body { font: 15px/1.5 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
         margin: 48px auto; max-width: 900px; color: #0A0A0C; background: #FBFAFD; padding: 0 24px 64px; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  p.lead { color: #6B6B76; margin: 0 0 40px; }
  .row { display: grid; grid-template-columns: 180px 180px 1fr; gap: 24px; align-items: start;
         border-top: 1px solid #E4E4EA; padding: 28px 0; }
  .swatch { padding: 14px; border-radius: 12px; }
  .swatch.light { background: #FFFFFF; border: 1px solid #E4E4EA; }
  .swatch.dark { background: #0A0A0C; }
  .swatch svg { width: 100%; height: auto; display: block; }
  .caption { font-size: 12px; color: #6B6B76; margin-top: 8px; text-align: center; }
  .code { font-weight: 600; font-size: 17px; }
  .meta { color: #6B6B76; font-size: 13px; margin-top: 6px; word-break: break-all; }
  .files { color: #6B6B76; font-size: 12px; margin-top: 10px; font-family: ui-monospace, Menlo, monospace; }
  @media print { .row { break-inside: avoid; } p.lead { display: none; } }
</style>
</head>
<body>
<h1>QR-коды Sintara</h1>
<p class="lead">Сгенерировано из src/data/qrCodes.mjs. Фон прозрачный — тут он показан на белом и на чёрном. Отсканируйте каждый код и проверьте, что он ведёт туда, что написано справа.</p>
${sheet
  .map(
    (entry) => `<div class="row">
  <div>
    <div class="swatch light">${entry.svgs.black.trim()}</div>
    <div class="caption">на светлом</div>
  </div>
  <div>
    <div class="swatch dark">${entry.svgs['-white'].trim()}</div>
    <div class="caption">на тёмном</div>
  </div>
  <div>
    <div class="code">${entry.code} — ${entry.label}</div>
    <div class="meta">${entry.url}<br />→ ${entry.to} · ${entry.medium} · ${entry.content}</div>
    <div class="files">${entry.code}.svg · ${entry.code}.png<br />${entry.code}-white.svg · ${entry.code}-white.png</div>
  </div>
</div>`,
  )
  .join('\n')}
</body>
</html>
`;
writeFileSync(join(OUT, 'index.html'), html, 'utf8');

console.log(`\n${QR_CODES.length} codes × 2 variants written to qr/. Open qr/index.html to check them.\n`);

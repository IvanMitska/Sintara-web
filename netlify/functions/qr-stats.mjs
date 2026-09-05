/**
 * The scan report — sintara.io/api/qr-stats?token=…
 *
 * Reads what netlify/functions/qr.mjs recorded and renders it as a page: scans
 * and unique people per code, today / 7 days / 30 days, countries, and a daily
 * grid. `&format=json` returns the same numbers raw.
 *
 * Aggregation is done from the blob KEYS alone. Every field the report needs —
 * code, date, country, visitor — is encoded in the key, so counting a year of
 * scans is one list call rather than thousands of value fetches. The JSON
 * bodies exist for looking at an individual scan, not for the totals.
 *
 * Access is a shared token in the query string, checked against QR_STATS_TOKEN.
 * That is deliberately modest: this data is scan counts, not customer records,
 * and a login screen for an audience of one is a worse trade than a long URL
 * kept in a password manager. With the variable unset the endpoint does not
 * exist at all — an unconfigured deploy cannot leak anything.
 */
import { timingSafeEqual } from 'node:crypto';

import { getStore } from '@netlify/blobs';

import { QR_CODES } from '../../src/data/qrCodes.mjs';

import { STORE_NAME, localStamp } from './qr.mjs';

const LABELS = new Map(QR_CODES.map((entry) => [entry.code, entry]));

/** Days shown in the daily grid. Long enough to see a tirage land, short
 * enough to stay readable on a phone. */
const GRID_DAYS = 14;

export default async (req) => {
  const expected = process.env.QR_STATS_TOKEN;
  const url = new URL(req.url);

  if (!expected || !matches(url.searchParams.get('token'), expected)) {
    return new Response('Not found', { status: 404 });
  }

  const store = getStore({
    name: STORE_NAME,
    // Strong consistency: the first thing anyone does with this page is scan a
    // code and refresh to check it worked. Eventual consistency would show
    // nothing for a few seconds and read as "the counter is broken".
    consistency: 'strong',
  });

  const { blobs } = await store.list();
  const stats = aggregate(blobs.map((blob) => blob.key));

  if (url.searchParams.get('format') === 'json') {
    return json(stats);
  }
  return new Response(render(stats), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};

/** Constant-time compare, so the token can't be guessed a character at a time. */
const matches = (given, expected) => {
  if (typeof given !== 'string' || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
};

/**
 * Keys look like `qr1/2026-09-05/TH/6f3a90c2b1d4-142731-8kq2`.
 *
 * Anything that doesn't parse is skipped rather than thrown on: a single
 * malformed key — a manual write, a future format — must not blank the whole
 * report.
 */
const aggregate = (keys) => {
  const today = localStamp(new Date()).date;
  const since = (days) => shiftDate(today, -(days - 1));
  const codes = new Map();

  for (const key of keys) {
    const [code, date, country, tail] = key.split('/');
    if (!code || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || !tail) continue;

    const visitor = tail.split('-')[0];
    const stat =
      codes.get(code) ??
      codes
        .set(code, {
          code,
          label: LABELS.get(code)?.label ?? 'Не в реестре',
          to: LABELS.get(code)?.to ?? '—',
          medium: LABELS.get(code)?.medium ?? 'unknown',
          scans: 0,
          people: new Set(),
          byDate: new Map(),
          byCountry: new Map(),
          first: date,
          last: date,
        })
        .get(code);

    stat.scans += 1;
    // Unique people are counted per day, because the visitor id is salted with
    // the date — see visitorId() in qr.mjs. Summing across days therefore means
    // "person-days", which is the honest reading of a pseudonym that cannot
    // follow anyone: it answers "how many separate people showed up", not "how
    // many distinct humans ever".
    stat.people.add(`${date}|${visitor}`);
    stat.byDate.set(date, (stat.byDate.get(date) ?? 0) + 1);
    stat.byCountry.set(country, (stat.byCountry.get(country) ?? 0) + 1);
    if (date < stat.first) stat.first = date;
    if (date > stat.last) stat.last = date;
  }

  // Registered codes with zero scans still belong in the report — "printed and
  // nobody scanned it" is a result, and a code missing from the table looks
  // like a bug in the tracking rather than a fact about the tirage.
  for (const entry of QR_CODES) {
    if (codes.has(entry.code)) continue;
    codes.set(entry.code, {
      code: entry.code,
      label: entry.label,
      to: entry.to,
      medium: entry.medium,
      scans: 0,
      people: new Set(),
      byDate: new Map(),
      byCountry: new Map(),
      first: null,
      last: null,
    });
  }

  const days = Array.from({ length: GRID_DAYS }, (_, i) => shiftDate(today, -(GRID_DAYS - 1 - i)));

  const rows = [...codes.values()]
    .map((stat) => ({
      code: stat.code,
      label: stat.label,
      to: stat.to,
      medium: stat.medium,
      scans: stat.scans,
      people: stat.people.size,
      today: stat.byDate.get(today) ?? 0,
      last7: sumSince(stat.byDate, since(7)),
      last30: sumSince(stat.byDate, since(30)),
      countries: [...stat.byCountry.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, count]) => `${name} ${count}`),
      lastScan: stat.last,
      grid: days.map((day) => stat.byDate.get(day) ?? 0),
    }))
    .sort((a, b) => b.scans - a.scans || a.code.localeCompare(b.code));

  return {
    generatedAt: new Date().toISOString(),
    today,
    days,
    total: rows.reduce((sum, row) => sum + row.scans, 0),
    codes: rows,
  };
};

const sumSince = (byDate, from) =>
  [...byDate.entries()].reduce((sum, [date, count]) => (date >= from ? sum + count : sum), 0);

const shiftDate = (date, days) => {
  const shifted = new Date(`${date}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
};

const json = (stats) =>
  new Response(JSON.stringify(stats, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });

const escape = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  );

const render = (stats) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>QR-сканы — Sintara</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.5 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
         margin: 0; padding: 40px 20px 80px; color: #0A0A0C; background: #FBFAFD; }
  main { max-width: 1000px; margin: 0 auto; }
  h1 { font-size: 26px; margin: 0 0 4px; }
  .sub { color: #6B6B76; margin: 0 0 32px; font-size: 14px; }
  .total { font-size: 44px; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
  .total span { font-size: 15px; font-weight: 400; color: #6B6B76; margin-left: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 28px 0 40px; font-size: 14px; }
  th { text-align: left; font-weight: 600; color: #6B6B76; font-size: 12px;
       text-transform: uppercase; letter-spacing: 0.04em; padding: 0 10px 8px; }
  td { padding: 12px 10px; border-top: 1px solid #E7E6EE; vertical-align: top; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .code { font-weight: 600; }
  .muted { color: #6B6B76; font-size: 13px; }
  .zero { color: #B4B4BE; }
  .grid { display: flex; gap: 3px; }
  .cell { width: 14px; height: 22px; border-radius: 3px; background: #ECEBF3; }
  .cell[data-hot="1"] { background: #C9C3F0; }
  .cell[data-hot="2"] { background: #9C8FE6; }
  .cell[data-hot="3"] { background: #6C58D9; }
  footer { color: #6B6B76; font-size: 13px; border-top: 1px solid #E7E6EE; padding-top: 16px; }
  @media (prefers-color-scheme: dark) {
    body { background: #0A0A0C; color: #F4F3F8; }
    td { border-color: #23232A; } footer { border-color: #23232A; }
    .cell { background: #1C1C22; }
  }
</style>
</head>
<body>
<main>
  <h1>Сканы QR-кодов</h1>
  <p class="sub">Считается на редиректе, до загрузки страницы — сюда попадает каждый скан, включая тех, кто сразу закрыл сайт. Дни — по времени Пхукета (UTC+7).</p>

  <p class="total">${stats.total}<span>сканов всего</span></p>

  <table>
    <thead>
      <tr>
        <th>Код</th>
        <th class="num">Всего</th>
        <th class="num">Людей</th>
        <th class="num">Сегодня</th>
        <th class="num">7 дней</th>
        <th class="num">30 дней</th>
        <th>Страны</th>
        <th>Последние ${GRID_DAYS} дней</th>
      </tr>
    </thead>
    <tbody>
${stats.codes
  .map(
    (row) => `      <tr>
        <td>
          <div class="code">${escape(row.code)}</div>
          <div class="muted">${escape(row.label)}</div>
          <div class="muted">${escape(row.to)} · ${escape(row.medium)}</div>
        </td>
        <td class="num${row.scans ? '' : ' zero'}">${row.scans}</td>
        <td class="num${row.people ? '' : ' zero'}">${row.people}</td>
        <td class="num${row.today ? '' : ' zero'}">${row.today}</td>
        <td class="num${row.last7 ? '' : ' zero'}">${row.last7}</td>
        <td class="num${row.last30 ? '' : ' zero'}">${row.last30}</td>
        <td class="muted">${row.countries.length ? escape(row.countries.join(', ')) : '—'}</td>
        <td>
          <div class="grid">${row.grid
            .map(
              (count, i) =>
                `<div class="cell" data-hot="${count ? Math.min(3, Math.ceil(count / 3)) : 0}" title="${stats.days[i]}: ${count}"></div>`,
            )
            .join('')}</div>
        </td>
      </tr>`,
  )
  .join('\n')}
    </tbody>
  </table>

  <footer>
    Обновлено ${escape(stats.generatedAt.replace('T', ' ').slice(0, 19))} UTC ·
    боты и предпросмотры ссылок не считаются ·
    «Людей» — уникальные посетители по дням (один человек в два разных дня = 2) ·
    <a href="?token=${escape(process.env.QR_STATS_TOKEN ?? '')}&amp;format=json">JSON</a>
  </footer>
</main>
</body>
</html>
`;

/**
 * The QR short-link registry — the single source of truth for sintara.io/qrN.
 *
 * One printed code = one entry here. Everything else reads this file and
 * nothing else, so a code can never exist in only half the system:
 *
 *   netlify/functions/qr.mjs  → counts the scan and sends the visitor onward
 *   scripts/qr-redirects.mjs  → the Netlify rules that route /qr1 to it
 *   scripts/qr-generate.mjs   → the printable QR images (npm run qr)
 *
 * Plain .mjs rather than .ts because both a build script (Node, no compile
 * step) and a bundled Netlify function import it directly.
 *
 * Why short codes instead of putting the full UTM URL in the QR itself: the
 * destination and the campaign tagging stay editable after the code is printed.
 * A card handed out in March can be re-pointed at a landing page in June by
 * changing one line here — the paper in someone's wallet keeps working. Encode
 * `sintara.io/?utm_source=...` directly and the URL is frozen in ink forever.
 *
 * Adding a code:
 *   1. Append an entry below with the next free number.
 *   2. `npm run qr` → the image lands in qr/qr<N>.svg (+ .png).
 *   3. Commit and deploy. The redirect ships with the build.
 *
 * Never renumber or delete a code that has been printed: the number is the only
 * link between the paper and the report. Retire a code by pointing it somewhere
 * sensible and marking it `retired: true` in the label instead.
 */

export const SITE = 'https://sintara.io';

/**
 * utm_source for every scan, so all offline traffic groups under one name in
 * GA4 regardless of which piece of print it came from. The per-piece detail
 * lives in utm_medium (what kind of surface) and utm_campaign (which code).
 */
export const UTM_SOURCE = 'qr';

/**
 * code    the URL suffix — sintara.io/<code>. Keep it short: it is typed by
 *         hand by anyone whose camera fails to focus.
 * to      where the scan lands, as a site path. Include a language prefix for
 *         a non-Russian audience ('/en', '/en/contact').
 * medium  the kind of surface the code is printed on. Becomes utm_medium and
 *         reads as "qr / card" in GA4's source/medium report.
 * content the specific placement, latin slug. Becomes utm_content — this is
 *         what tells two business cards or two flyers apart.
 * label   human description, Russian. Only for the printable sheet and docs;
 *         never reaches the URL.
 */
export const QR_CODES = [
  {
    code: 'qr1',
    to: '/',
    medium: 'card',
    content: 'visitka-ivan',
    label: 'Визитка Ивана',
  },
  {
    code: 'qr2',
    to: '/work',
    medium: 'presentation',
    content: 'deck-last-slide',
    label: 'Презентация / КП — последний слайд',
  },
  {
    code: 'qr3',
    to: '/contact',
    medium: 'event',
    content: 'event-stand',
    label: 'Стенд / бейдж на мероприятии',
  },
  {
    code: 'qr4',
    to: '/services',
    medium: 'flyer',
    content: 'flyer-services',
    label: 'Флаер / буклет по услугам',
  },
  {
    code: 'qr5',
    to: '/en',
    medium: 'card',
    content: 'visitka-en',
    label: 'Визитка для англоязычных (ведёт на /en)',
  },
];

/** The address that gets encoded into the QR image and printed under it. */
export const publicUrl = (entry) => `${SITE}/${entry.code}`;

/**
 * The redirect target: the destination path plus the campaign tagging GA4
 * reads off the landing URL.
 *
 * The parameters are appended rather than assigned, because a destination is
 * allowed to carry its own query string (a prefilled brief, say) and dropping
 * it here would be invisible until someone complained the form was empty.
 */
export const targetUrl = (entry) => {
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: entry.medium,
    utm_campaign: entry.code,
    utm_content: entry.content,
  });
  return `${entry.to}${entry.to.includes('?') ? '&' : '?'}${params}`;
};

/**
 * Fails the build on a registry that would print broken paper.
 *
 * A duplicate code silently makes one of the two entries unreachable — the
 * first matching redirect rule wins and the second is dead. That is the kind of
 * mistake you discover from a client holding a card that goes to the wrong
 * page, so it is worth stopping a deploy over.
 */
export const validate = (codes = QR_CODES) => {
  const seen = new Set();
  for (const entry of codes) {
    if (!/^[a-z0-9-]+$/.test(entry.code)) {
      throw new Error(`QR code "${entry.code}": use only lowercase letters, digits and dashes.`);
    }
    if (seen.has(entry.code)) {
      throw new Error(`QR code "${entry.code}" is declared twice — the second one would never resolve.`);
    }
    seen.add(entry.code);
    if (!entry.to.startsWith('/')) {
      throw new Error(`QR code "${entry.code}": "to" must be a site path starting with "/".`);
    }
    if (!entry.medium || !entry.content) {
      throw new Error(`QR code "${entry.code}": medium and content are required — without them the scan is untraceable in GA4.`);
    }
  }
  return codes;
};

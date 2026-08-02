/**
 * Bakes a static HTML file for every route.
 *
 * Why this exists: the site is a single index.html with client-side routing, so
 * every URL served the same empty <div id="root"> — and, worse, the same
 * <link rel="canonical" href="https://sintara.io/">. That canonical is a
 * directive, not a hint: it told search engines that /work, /services and every
 * case study were duplicates of the homepage. Only the homepage was indexed.
 *
 * After this step each route ships real markup and its own head, so a crawler
 * that never runs JavaScript still gets a full page. Netlify serves a matching
 * static file in preference to the SPA rewrite, so /work now resolves to
 * dist/work/index.html rather than falling through to the shell.
 *
 * The markup is not hydrated — createRoot replaces the container on boot — so
 * visitors still get the normal app. This only changes what machines see.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://sintara.io';
// Both languages are prerendered now that each has its own address: Russian at
// the bare path, English under /en. Previously only one could exist in the HTML
// at a time, which meant one of the two was permanently invisible to search.
const LANGUAGES = ['ru', 'en'];

const { render, resolveSeo, PRERENDER_PATHS, withLanguage } = await import(
  pathToFileURL(join(ROOT, 'dist-ssr', 'entry-prerender.js')).href
);

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

// dist/index.html is both the template for every route AND the file the "/"
// route overwrites, so this step is only correct against a fresh `vite build`.
// Run it twice in a row and the template would be the already-rendered home
// page: the empty-root marker wouldn't match, every route would keep the home
// page's body, and each would still get its own head — a silent, plausible-
// looking corruption. Refuse instead.
if (!template.includes('<div id="root"></div>')) {
  console.error(
    'dist/index.html has already been prerendered (or its root div changed).\n' +
      'Run `vite build` first — `npm run build` does this in the right order.',
  );
  process.exit(1);
}

/** Replace a tag's attribute value in the head, leaving everything else be. */
const setAttr = (html, pattern, attr, value) =>
  html.replace(pattern, (tag) =>
    new RegExp(`${attr}="[^"]*"`).test(tag)
      ? tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`)
      : tag.replace(/\/?>$/, ` ${attr}="${escapeAttr(value)}">`),
  );

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildHead = (html, { path, language, seo }) => {
  const url = `${SITE}${withLanguage(path, language)}`;
  const image = seo.image
    ? seo.image.startsWith('http')
      ? seo.image
      : `${SITE}${seo.image}`
    : `${SITE}/og-image.png?v=4`;

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(seo.title)}</title>`);
  out = setAttr(out, /<meta name="title"[^>]*>/, 'content', seo.title);
  out = setAttr(out, /<meta name="description"[^>]*>/, 'content', seo.description);
  out = setAttr(out, /<link rel="canonical"[^>]*>/, 'href', url);
  out = setAttr(out, /<meta property="og:title"[^>]*>/, 'content', seo.title);
  out = setAttr(out, /<meta property="og:description"[^>]*>/, 'content', seo.description);
  out = setAttr(out, /<meta property="og:url"[^>]*>/, 'content', url);
  // The closing quote in `"og:image"` is what keeps this off og:image:width /
  // og:image:height / og:image:alt. A lookahead for ":" can't do it — the URL
  // in the content attribute has one in "https://".
  out = setAttr(out, /<meta property="og:image"\s[^>]*>/, 'content', image);
  out = setAttr(out, /<meta name="twitter:title"[^>]*>/, 'content', seo.title);
  out = setAttr(out, /<meta name="twitter:description"[^>]*>/, 'content', seo.description);
  out = setAttr(out, /<meta name="twitter:url"[^>]*>/, 'content', url);
  out = setAttr(out, /<meta name="twitter:image"\s[^>]*>/, 'content', image);
  out = setAttr(
    out,
    /<meta property="og:locale"[^>]*>/,
    'content',
    language === 'ru' ? 'ru_RU' : 'en_US',
  );
  out = setAttr(
    out,
    /<meta property="og:locale:alternate"[^>]*>/,
    'content',
    language === 'ru' ? 'en_US' : 'ru_RU',
  );
  // Case pages are works, not the site itself — "article" is what link
  // previews and search use to treat them as a piece of content.
  if (path.startsWith('/work/')) {
    out = setAttr(out, /<meta property="og:type"[^>]*>/, 'content', 'article');
  }
  out = setAttr(
    out,
    /<meta name="robots"[^>]*>/,
    'content',
    seo.noindex ? 'noindex, follow' : DEFAULT_ROBOTS,
  );
  out = out.replace(/<html lang="[^"]*"/, `<html lang="${language}"`);

  // hreflang pair. The template carries none (the old ones were removed for
  // claiming two languages at one URL); now there really are two addresses.
  const alternates = [
    ['ru', `${SITE}${withLanguage(path, 'ru')}`],
    ['en', `${SITE}${withLanguage(path, 'en')}`],
    ['x-default', `${SITE}${withLanguage(path, 'ru')}`],
  ]
    .map(([lang, href]) => `    <link rel="alternate" hreflang="${lang}" href="${href}" />`)
    .join('\n');
  out = out.replace('</head>', `${alternates}\n  </head>`);

  // The template's BreadcrumbList only ever describes the homepage. Copied
  // verbatim onto a case page it claims that page's trail is a single item,
  // "Главная" — structured data that is simply false. Rebuild it per route.
  out = out.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "BreadcrumbList"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(breadcrumb(path, language, seo), null, 2)}\n    </script>`,
  );

  // Case pages describe the work itself, so search engines can treat a case
  // study as a piece of content rather than another marketing page.
  if (path.startsWith('/work/')) {
    const work = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: seo.title.replace(/\s+—\s+(кейс Sintara|Sintara case study)$/, ''),
      description: seo.description,
      url,
      image,
      inLanguage: language,
      author: { '@type': 'Organization', name: 'Sintara', '@id': `${SITE}/#organization` },
    };
    out = out.replace(
      '</head>',
      `    <script type="application/ld+json">\n${JSON.stringify(work, null, 2)}\n    </script>\n  </head>`,
    );
  }
  return out;
};

/** Trail for a path: Home → [section] → [page], in the page's own language. */
const breadcrumb = (path, language, seo) => {
  const home = language === 'ru' ? 'Главная' : 'Home';
  const work = language === 'ru' ? 'Работы' : 'Work';
  const url = (p) => `${SITE}${withLanguage(p, language)}`;
  const items = [{ name: home, item: url('/') }];

  if (path.startsWith('/work/')) {
    items.push({ name: work, item: url('/work') });
    // Strip the title's suffix: a breadcrumb names the page, it doesn't
    // repeat the title tag.
    items.push({
      name: seo.title.replace(/\s+—\s+(кейс Sintara|Sintara case study)$/, ''),
      item: url(path),
    });
  } else if (path !== '/') {
    items.push({ name: seo.title.replace(/\s+—\s+Sintara$/, ''), item: url(path) });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
};

const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const results = [];

for (const language of LANGUAGES) {
for (const path of PRERENDER_PATHS) {
  const url = withLanguage(path, language);
  const seo = resolveSeo(path, language);
  // Render the real address, not the neutral path: the app reads its language
  // from the URL, so /en/work renders English through exactly the same code
  // path a visitor gets. Nothing here can disagree with the live site.
  const { html, css } = render(url);

  let page = buildHead(template, { path, language, seo });
  // styled-components' collected CSS, so the prerendered markup isn't a wall of
  // unstyled text in the split second before the bundle takes over.
  page = page.replace('</head>', `${css}\n</head>`);
  page = page.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${html}</div>`,
  );

  // Flat "work.html", not "work/index.html". Netlify serves a directory only
  // at its trailing-slash address: with work/index.html on disk, /work answers
  // 301 → /work/. That would have put every existing URL — the ones already in
  // Google's index and in this build's own sitemap and canonicals — behind a
  // redirect, and left each page declaring a canonical that redirects to the
  // page itself. A sibling .html file is served at the bare path with 200, so
  // the addresses stay exactly what they were before prerendering existed.
  const file =
    url === '/' ? join(DIST, 'index.html') : join(DIST, `${url}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page, 'utf8');

  // Strip tags to measure what a text-only crawler actually receives.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  results.push({ path: url, chars: text.length, title: seo.title });
}
}

// Sitemap comes from the same list that drives prerendering, so the two can't
// drift. The hand-maintained public/sitemap.xml did drift — it advertised five
// projects that no longer existed and omitted half the live pages.
//
// Each entry carries its own hreflang alternates. Sitemap alternates are the
// belt to the tags' braces: Google accepts either, and a page whose pair is
// declared in both places is far less likely to be read as a duplicate of the
// other language.
const today = new Date().toISOString().slice(0, 10);
const priority = (path) =>
  path === '/' ? '1.0' : path.split('/').length > 2 ? '0.8' : '0.9';
const entries = LANGUAGES.flatMap((language) =>
  PRERENDER_PATHS.map((path) => ({
    loc: `${SITE}${withLanguage(path, language)}`,
    priority: priority(path),
    alternates: [
      ['ru', `${SITE}${withLanguage(path, 'ru')}`],
      ['en', `${SITE}${withLanguage(path, 'en')}`],
      ['x-default', `${SITE}${withLanguage(path, 'ru')}`],
    ],
  })),
);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/prerender.mjs from src/lib/routes.ts. Do not edit. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${entry.priority}</priority>
${entry.alternates
  .map(
    ([lang, href]) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

const width = Math.max(...results.map((r) => r.path.length));
console.log('\nPrerendered pages:');
for (const r of results) {
  console.log(`  ${r.path.padEnd(width)}  ${String(r.chars).padStart(6)} chars  ${r.title}`);
}

const empty = results.filter((r) => r.chars < 400);
if (empty.length) {
  console.error(
    `\nPrerender produced near-empty HTML for: ${empty.map((r) => r.path).join(', ')}`,
  );
  process.exit(1);
}
console.log(`\n${results.length} routes prerendered.\n`);

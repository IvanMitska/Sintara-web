/**
 * Google Analytics 4 (gtag.js).
 *
 * Three things this file exists to get right, none of which the copy-paste
 * snippet from the GA console handles on its own:
 *
 * 1. SPA page views. The snippet fires exactly one page_view — on the first
 *    HTML load. Every client-side navigation after that is invisible, so the
 *    whole site reports as one page. We disable the automatic hit
 *    (send_page_view: false) and send page_view ourselves from <Analytics />
 *    on every route change, after RouteSeo has written the new title.
 *
 * 2. Load cost. gtag.js is ~100 KB of third-party JS. Loading it in <head>
 *    competes with the hero video and the fonts for the first seconds of the
 *    connection. Here the dataLayer stub is installed synchronously (so events
 *    fired before the script lands are queued, not lost) and the script itself
 *    is injected during browser idle time.
 *
 * 3. Consent Mode v2. Everything ad-related is denied unconditionally — we run
 *    no ads and no remarketing, so there is nothing to ask about. Analytics
 *    storage follows lib/consent: denied in the EEA/UK/Switzerland, where it
 *    keeps gtag cookieless and therefore consent-free, granted everywhere else.
 *    That is why this site has no cookie banner.
 */

import { effectiveConsent } from './consent';

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The GA4 web data stream for sintara.io.
 *
 * Hardcoded rather than kept in an environment variable, on purpose: this id is
 * public by definition — it travels in every measurement request the browser
 * makes — so there is nothing to protect. And because Vite inlines env values
 * at build time, an env var wouldn't even buy the ability to change it without
 * a rebuild. VITE_GA_ID still wins if set, which is how a fork or a staging
 * deploy points at its own property.
 */
const MEASUREMENT_ID = import.meta.env.VITE_GA_ID?.trim() || 'G-94EHPVYB44';

/** Set VITE_GA_DEBUG=true in .env.local to also measure a local dev session. */
const ALLOW_LOCALHOST = import.meta.env.VITE_GA_DEBUG === 'true';

let started = false;

const isLocalhost = () =>
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

export const analyticsEnabled = () =>
  MEASUREMENT_ID !== '' && (!isLocalhost() || ALLOW_LOCALHOST);

/**
 * The stub gtag: pushes into dataLayer, which gtag.js drains once it loads.
 *
 * It has to push the live `arguments` object, exactly as Google's snippet does
 * — hence the old-style function and the rest-params lint exception. gtag.js
 * identifies commands by testing each dataLayer entry for [object Arguments];
 * a plain array pushed in its place is dropped without a warning. Do not
 * "modernise" this into (...args) => push(args): everything keeps loading,
 * the container still appears in window.google_tag_manager, and yet no consent
 * default, no config and no event is ever applied. Verified by inspecting
 * google_tag_data.ics, which showed every consent type as implicit — i.e. our
 * defaults never arrived — and by the total absence of /g/collect requests.
 */
const gtag: (...args: unknown[]) => void = function () {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};

/**
 * Installs the dataLayer + consent defaults immediately and schedules the
 * gtag.js download for the first idle moment. Safe to call more than once.
 */
export const initAnalytics = () => {
  if (started || !analyticsEnabled()) return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  // Consent defaults MUST be pushed before config, otherwise the first hits
  // go out unconsented.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: effectiveConsent(),
  });

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    // We send page_view manually per route — see <Analytics />.
    send_page_view: false,
  });

  attachOutboundTracking();

  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };

  const win = window as typeof window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
  };
  if (win.requestIdleCallback) {
    win.requestIdleCallback(load, { timeout: 3000 });
  } else {
    window.setTimeout(load, 1200);
  }
};

/** One page_view per client-side navigation. */
export const trackPageView = (path: string, title: string) => {
  if (!analyticsEnabled()) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

/** Any custom or GA4-recommended event. */
export const track = (name: string, params: GtagParams = {}) => {
  if (!analyticsEnabled()) return;
  gtag('event', name, params);
};

/**
 * Raises analytics storage mid-session — the hook a consent UI would call.
 *
 * Nothing calls it today: there is no banner, and lib/consent decides storage
 * once at init. Kept because it is the non-obvious half of adding one back —
 * the re-sent page_view below is easy to forget and its absence is invisible.
 */
export const grantConsent = () => {
  if (!analyticsEnabled()) return;
  gtag('consent', 'update', { analytics_storage: 'granted' });

  // The visitor was sending cookieless pings until now, including the
  // page_view for the page they are on. Send it again now that the session can
  // actually be attributed, otherwise their landing page is missing from the
  // reports.
  trackPageView(window.location.pathname + window.location.search, document.title);
};

/**
 * Contact clicks, tracked once for the whole site instead of per link.
 *
 * Every channel — mail, Telegram, WhatsApp, Instagram — appears in the footer,
 * the nav, the contact page and several home sections. A delegated listener on
 * document catches all of them, including links added by lazy-loaded routes,
 * and keeps the JSX free of analytics plumbing.
 *
 * GA4's enhanced measurement already logs generic outbound clicks; this adds a
 * named event you can promote to a key event (conversion) with the channel as
 * a dimension.
 */
const CHANNELS: Array<[RegExp, string]> = [
  [/^mailto:/i, 'email'],
  [/^tel:/i, 'phone'],
  [/(^|\/\/)([^/]*\.)?t\.me\//i, 'telegram'],
  [/(^|\/\/)([^/]*\.)?wa\.me\//i, 'whatsapp'],
  [/(^|\/\/)([^/]*\.)?instagram\.com\//i, 'instagram'],
];

const attachOutboundTracking = () => {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a');
      if (!link) return;

      const href = link.getAttribute('href') ?? '';
      if (!href) return;

      const match = CHANNELS.find(([pattern]) => pattern.test(href));
      if (!match) return;

      track('contact_click', {
        channel: match[1],
        link_url: href,
        page_path: window.location.pathname,
      });
    },
    // Capture phase: some rows stop propagation for the custom cursor.
    true,
  );
};

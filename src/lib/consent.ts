/**
 * Where analytics cookies may be set, without ever asking.
 *
 * There is no cookie banner on this site, and this file is what makes that
 * defensible. In the EEA, the UK and Switzerland analytics storage stays
 * denied — permanently, not "until accepted". Google's Consent Mode then runs
 * gtag in cookieless mode: no identifier is stored on the device, so no
 * consent is required in the first place, and GA still receives the pings and
 * reports those visits in aggregate (modelled sessions, no user-level data).
 *
 * Everywhere else — Russia, Thailand, the US, the rest of Asia — analytics runs
 * normally from the first page view.
 *
 * The trade is deliberate: European visits are counted but not attributable
 * (no source/medium per user, no cross-page session stitching). For a studio
 * whose traffic is mostly outside the EU that costs little, and it beats both
 * alternatives — a banner nobody wants, or setting cookies in the EU without
 * asking.
 *
 * Region comes from the browser's IANA time zone: no request, no third-party
 * geo service, and unlike IP lookup it survives being served from a CDN edge.
 * It is a heuristic — a Berlin visitor on a US-set laptop reads as non-EEA, and
 * a Bangkok resident whose clock is still Europe/Paris gets the cookieless
 * treatment. The error is small and runs both ways. When the zone can't be read
 * we assume consent is required, which is the safe direction.
 */

/**
 * EEA (EU 27 + Iceland, Liechtenstein, Norway) plus the UK and Switzerland.
 *
 * Listed zone by zone rather than as a "Europe/*" prefix test on purpose: that
 * prefix would also catch Moscow, Kyiv, Minsk, Istanbul and Belgrade, and would
 * miss Atlantic/Canary, Asia/Nicosia and the Azores, which are in.
 */
const CONSENT_ZONES = new Set([
  // EU
  'Europe/Vienna', 'Europe/Brussels', 'Europe/Sofia', 'Europe/Zagreb',
  'Asia/Nicosia', 'Asia/Famagusta', 'Europe/Prague', 'Europe/Copenhagen',
  'Europe/Tallinn', 'Europe/Helsinki', 'Europe/Mariehamn', 'Europe/Paris',
  'Europe/Berlin', 'Europe/Busingen', 'Europe/Athens', 'Europe/Budapest',
  'Europe/Dublin', 'Europe/Rome', 'Europe/Riga', 'Europe/Vilnius',
  'Europe/Luxembourg', 'Europe/Malta', 'Europe/Amsterdam', 'Europe/Warsaw',
  'Europe/Lisbon', 'Atlantic/Azores', 'Atlantic/Madeira', 'Europe/Bucharest',
  'Europe/Bratislava', 'Europe/Ljubljana', 'Europe/Madrid', 'Africa/Ceuta',
  'Atlantic/Canary', 'Europe/Stockholm',
  // French overseas departments — EU territory, GDPR applies
  'Indian/Reunion', 'Indian/Mayotte', 'America/Martinique',
  'America/Guadeloupe', 'America/Cayenne',
  // EEA non-EU
  'Atlantic/Reykjavik', 'Europe/Vaduz', 'Europe/Oslo', 'Arctic/Longyearbyen',
  // UK (+ crown dependencies, which follow UK GDPR) and Switzerland
  'Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Jersey',
  'Europe/Isle_of_Man', 'Europe/Gibraltar', 'Europe/Zurich',
]);

/** True where storing an analytics cookie would require an explicit opt-in. */
export const consentRequired = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return true;
    return CONSENT_ZONES.has(zone);
  } catch {
    return true;
  }
};

/**
 * What analytics_storage is set to for this visitor.
 *
 * If a consent banner is ever added, this is the single place to change: return
 * the stored answer where consentRequired() is true, and call gtag('consent',
 * 'update', ...) from the banner.
 */
export const effectiveConsent = (): 'granted' | 'denied' =>
  consentRequired() ? 'denied' : 'granted';

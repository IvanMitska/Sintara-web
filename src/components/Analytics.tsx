import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView, trackQrScan } from '../lib/analytics';

/**
 * Sends one GA4 page_view per route.
 *
 * Placed after <RouteSeo /> in the tree on purpose: RouteSeo writes the new
 * title in a useLayoutEffect, and layout effects of earlier siblings run before
 * this component's passive effect — so document.title is already the new page's
 * by the time we read it. Reading it earlier would report every page under the
 * previous page's title.
 *
 * Language switches don't produce a page_view: the path is the dependency, and
 * only a real navigation changes it.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();
  const started = useRef(false);
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    initAnalytics();
  }, []);

  useEffect(() => {
    const url = `${pathname}${search}`;
    // Guard against sending the same URL twice in a row. StrictMode runs every
    // effect twice in development, which was reporting the landing page as two
    // page views; the same guard also covers a remount that doesn't change the
    // route. A genuine A → B → A path still reports all three.
    if (lastSent.current === url) return;
    lastSent.current = url;
    trackPageView(url, document.title);
  }, [pathname, search]);

  // Declared after the page_view effect on purpose: effects run in declaration
  // order, so the landing page_view — the hit GA4 derives session source and
  // campaign from — is queued before the qr_scan event that annotates it.
  // Mount-only, because a QR arrival is by definition the first URL of the
  // session; a later navigation keeps the query string in `search` and would
  // otherwise re-fire the event on every route change.
  useEffect(() => {
    trackQrScan();
  }, []);

  return null;
};

export default Analytics;

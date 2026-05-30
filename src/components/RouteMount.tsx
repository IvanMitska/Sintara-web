import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { applyScroll, scrollPositions } from '../lib/lenis';

/**
 * RouteMount — sits inside each Route's element. Its useLayoutEffect fires
 * the moment the new route's tree actually commits, which is exactly when
 * the user *sees* the new page. That timing is what we need for the scroll
 * jump.
 *
 * Why this isn't done in SmoothScroll at the app root: react-router v7 +
 * React 18 transitions update `useLocation()` as soon as the navigation
 * starts, but the lazy route can still be loading. A useLayoutEffect at
 * the root therefore fires on the *still-visible* outgoing tree (the home
 * page), jerking it to scroll=0 a frame before the screen swaps to the
 * incoming page. RouteMount sits *inside* the suspending route, so its
 * effect is gated on the commit — no jerk on the old page.
 */
const RouteMount = () => {
  const navType = useNavigationType();
  const { key: locationKey } = useLocation();

  useLayoutEffect(() => {
    // RouteMount sits inside the Routes Suspense boundary, so this layout
    // effect is held until the new route's lazy chunk is ready and the
    // whole subtree commits — exactly the moment we want to apply the
    // scroll jump. Deps on locationKey so it also refires on param-only
    // changes (e.g. /work/kaif → /work/sintara) where React reuses the
    // same Route element instance.
    if (navType === 'POP') {
      const target = scrollPositions.get(locationKey) ?? 0;
      applyScroll(target, true);
    } else {
      applyScroll(0, false);
    }
  }, [locationKey, navType]);

  return null;
};

export default RouteMount;

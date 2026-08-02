import { forwardRef } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { withLanguage } from '../../lib/i18n';

/**
 * Language-aware replacements for react-router's Link and NavLink.
 *
 * Every internal link across the site imports from here instead of from
 * react-router-dom, so `to="/work"` resolves to /work in Russian and /en/work
 * in English without a single call site having to think about it. Doing this
 * per component would have meant threading the language through thirty-odd
 * links and getting it wrong in one of them — which is exactly the bug that
 * strands a visitor back in the other language mid-journey.
 *
 * Paths are normalised, not just prefixed, so passing an already-prefixed path
 * is safe and idempotent.
 */

const useLocalizedTo = () => {
  const { language } = useLanguage();
  return (to: LinkProps['to']) =>
    typeof to === 'string' ? withLanguage(to, language) : to;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, ...rest }, ref) => {
    const localize = useLocalizedTo();
    return <RouterLink ref={ref} to={localize(to)} {...rest} />;
  },
);
Link.displayName = 'Link';

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, ...rest }, ref) => {
    const localize = useLocalizedTo();
    return <RouterNavLink ref={ref} to={localize(to)} {...rest} />;
  },
);
NavLink.displayName = 'NavLink';

export default Link;

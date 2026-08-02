import { projects } from '../data/projects';

/**
 * Every URL the build prerenders to its own static HTML file.
 *
 * Case pages come from the project data, so adding a project to
 * data/projects.ts gets it prerendered — and listed for crawlers — without
 * anyone remembering to update a list here. Own products (Sintara Rent) live
 * under /products/ and are added explicitly instead of under /work/.
 *
 * Legacy /project/<slug> URLs still resolve at runtime for old inbound links
 * but are not prerendered: they are duplicates of /work/<slug>, and giving
 * them static pages would invite crawlers to index both.
 */
const STATIC_PATHS = [
  '/',
  '/work',
  '/services',
  '/products/sintara-rent-crm',
  '/about',
  '/contact',
  '/brief',
];

export const PRERENDER_PATHS: string[] = [
  ...STATIC_PATHS,
  ...projects.filter((p) => !p.own).map((p) => `/work/${p.slug}`),
];

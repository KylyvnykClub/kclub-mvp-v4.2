import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * Next.js 16 proxy (formerly middleware).
 * Negotiates the locale for every incoming request and redirects the bare `/`
 * to the default locale per ADR-010.
 */
export default createMiddleware(routing);

export const config = {
  // Match all paths except api routes, Next.js internals, and static assets.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

const LOCALES = routing.locales;
const AUTH_ROUTES = /^\/[a-z]{2}\/auth(\/|$)/;
const DASHBOARD_ROUTES = /^\/[a-z]{2}\/dashboard(\/|$)/;

function extractLocale(pathname: string): string {
  const segment = pathname.split('/')[1] ?? '';
  return LOCALES.includes(segment as (typeof LOCALES)[number])
    ? segment
    : routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { user, supabaseResponse } = await updateSession(request);

  if (DASHBOARD_ROUTES.test(pathname) && !user) {
    const locale = extractLocale(pathname);
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.test(pathname) && user) {
    const locale = extractLocale(pathname);
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  const intlResponse = intlMiddleware(request);

  for (const [name, value] of supabaseResponse.cookies.getAll().map(c => [c.name, c.value] as const)) {
    intlResponse.cookies.set(name, value);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

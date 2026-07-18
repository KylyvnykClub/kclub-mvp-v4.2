import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Typed navigation helpers bound to the central routing definition (ADR-010).
 * Prefer these over `next/link` and `next/navigation` so links stay locale-aware.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

'use client';

import { Refine } from '@refinedev/core';
import type { ReactNode } from 'react';

type AdminProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function AdminProviders({ children }: AdminProvidersProps): ReactNode {
  return <Refine>{children}</Refine>;
}

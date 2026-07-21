'use client';

import { logError } from '@kclub/observability';
import { DataState } from '@kclub/ui';
import type { ReactNode } from 'react';

type DashboardErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function DashboardError({ error, reset }: DashboardErrorProps): ReactNode {
  logError(error, { scope: 'product-core.dashboard-error' });

  return (
    <DataState
      tone="error"
      title="Dashboard Error"
      message="An error occurred while loading this page."
    >
      <button className="kc-button" onClick={reset} type="button">
        Try Again
      </button>
    </DataState>
  );
}

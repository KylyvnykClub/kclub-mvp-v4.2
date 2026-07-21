'use client';

import { logError } from '@kclub/observability';
import type { ReactNode } from 'react';

type GlobalErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function GlobalError({ error, reset }: GlobalErrorProps): ReactNode {
  logError(error, { scope: 'product-core.global-error' });

  return (
    <html>
      <body>
        <div className="kc-data-state" data-tone="error" aria-live="polite">
          <h2>Critical Error</h2>
          <p>Something went very wrong. Please reload the page.</p>
          <button className="kc-button" onClick={reset} type="button">
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

'use client';

import { logError } from '@kclub/observability';
import type { ReactNode } from 'react';

type GlobalErrorProps = Readonly<{ error: Error; reset: () => void }>;

export default function GlobalError({ error, reset }: GlobalErrorProps): ReactNode {
  logError(error, { scope: 'admin-app.global-error' });

  return (
    <html>
      <body>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
          <h1>Critical Error</h1>
          <p>Something went very wrong. Please reload the page.</p>
          <button onClick={reset} style={{ cursor: 'pointer', padding: '8px 16px' }} type="button">
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

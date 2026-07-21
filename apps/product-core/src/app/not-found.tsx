import type { ReactNode } from 'react';

export default function RootNotFound(): ReactNode {
  return (
    <html>
      <body className="kc-app">
        <section className="kc-data-state" data-tone="neutral" aria-live="polite">
          <h2>Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a className="kc-button" href="/en">
            Go Home
          </a>
        </section>
      </body>
    </html>
  );
}

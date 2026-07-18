import '@kclub/ui/styles.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'KYLYVNYK CLUB',
  description: 'Private membership club for trusted business connections.',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body className="kc-app">{children}</body>
    </html>
  );
}

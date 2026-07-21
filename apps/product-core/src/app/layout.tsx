import { ReactNode } from 'react';

// Since we have a root `not-found.tsx` page, a root layout file
// is required by Next.js, even if it just passes children through.
// (Our main layout with html/body is inside `app/[locale]/layout.tsx`)
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

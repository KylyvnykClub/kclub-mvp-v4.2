'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function AppThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

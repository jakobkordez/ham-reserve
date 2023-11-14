'use client';

import { THEME_DARK, useThemeState } from '@/state/theme-state';
import { useEffect, useState } from 'react';
import { Allerta, Inter } from 'next/font/google';

const callsignFont = Allerta({
  subsets: ['latin'],
  variable: '--callsign-font',
  weight: '400',
});

const inter = Inter({ subsets: ['latin'] });

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(THEME_DARK);

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((t) => setTheme(t.theme));
  }, []);

  return (
    <html lang="sl" data-theme={theme}>
      <body
        className={`${inter.className} ${callsignFont.variable} min-h-screen dark:[color-scheme:dark]`}
      >
        {children}
      </body>
    </html>
  );
}

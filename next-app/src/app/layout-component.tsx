'use client';

import { Header } from '@/components/header';
import { useThemeState } from '@/state/theme-state';
import { Allerta, Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const callsignFont = Allerta({
  subsets: ['latin'],
  variable: '--callsign-font',
  weight: '400',
});

const inter = Inter({ subsets: ['latin'] });

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((s) => setTheme(s.theme));
  }, []);

  return (
    <html lang="sl" className={theme}>
      <body
        className={`${inter.className} ${callsignFont.variable} dark:bg-gray-900 dark:text-light dark:[color-scheme:dark]`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

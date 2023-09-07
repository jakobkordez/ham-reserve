'use client';

import { Header } from '@/components/header';
import { useThemeState } from '@/state/theme-state';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((s) => setTheme(s.theme));
  }, []);

  return (
    <html lang="en" className={theme}>
      <body
        className={`${inter.className} dark:bg-[#121212] dark:text-[#d6d6d6]`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

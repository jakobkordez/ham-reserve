'use client';

import { THEME_DARK, useThemeState } from '@/state/theme-state';
import { useEffect, useState } from 'react';

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(THEME_DARK);

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((t) => setTheme(t.theme));
  }, []);

  return <div data-theme={theme}>{children}</div>;
}

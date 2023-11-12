import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEME_DARK = 'forest';
export const THEME_LIGHT = 'lemonade';

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

export const useThemeState = create(
  persist<ThemeState>(
    (set) => ({
      theme:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? THEME_DARK
          : THEME_LIGHT,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK,
        })),
    }),
    {
      name: 'theme',
    },
  ),
);

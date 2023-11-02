'use client';

import { Header } from '@/components/header';
import { THEME_LIGHT } from '@/state/theme-state';
import { Allerta, Inter } from 'next/font/google';

const callsignFont = Allerta({
  subsets: ['latin'],
  variable: '--callsign-font',
  weight: '400',
});

const inter = Inter({ subsets: ['latin'] });

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  // const [theme, setTheme] = useState<string>(THEME_DARK);

  // useEffect(() => {
  //   setTheme(useThemeState.getState().theme);
  //   useThemeState.subscribe((s) => setTheme(s.theme));
  // }, []);

  return (
    <html lang="sl" data-theme={THEME_LIGHT}>
      <body
        className={`${inter.className} ${callsignFont.variable} dark:[color-scheme:dark]`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

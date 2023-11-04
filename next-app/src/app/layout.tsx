import './globals.css';
import type { Metadata } from 'next';
import { LayoutComponent } from './layout-component';
import { Header } from '@/components/header';
import { Allerta, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    default: 'Ham Reserve',
    template: '%s | Ham Reserve',
  },
};

const callsignFont = Allerta({
  subsets: ['latin'],
  variable: '--callsign-font',
  weight: '400',
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <body
        className={`${inter.className} ${callsignFont.variable} dark:[color-scheme:dark]`}
      >
        <LayoutComponent>
          <Header />
          <main>{children}</main>
        </LayoutComponent>
      </body>
    </html>
  );
}

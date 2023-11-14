import './globals.css';
import type { Metadata } from 'next';
import { LayoutComponent } from './layout-component';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: {
    default: 'Ham Reserve',
    template: '%s | Ham Reserve',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutComponent>
      <Header />
      <main>{children}</main>
    </LayoutComponent>
  );
}

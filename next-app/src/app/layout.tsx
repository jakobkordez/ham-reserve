import './globals.scss';
import type { Metadata } from 'next';
import { LayoutComponent } from './layout-component';

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
  return <LayoutComponent children={children} />;
}

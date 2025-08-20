import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebCloset',
  description: 'Search pre-loved fashion across marketplaces'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fff' }}>{children}</body>
    </html>
  );
}

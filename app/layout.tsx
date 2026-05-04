import type { Metadata, Viewport } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: "Stormin' Shane Weather App",
  description: "Premium storm tracking and creator weather app preview.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#06111f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

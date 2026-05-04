import type { Metadata, Viewport } from 'next';
import './styles.css';
export const metadata: Metadata = { title: "Stormin' Shane Weather", description: "Installable storm-tracking weather app by Stormin' Shane.", manifest: '/manifest.webmanifest', appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: "Stormin Shane" }, icons: { icon: '/icon.svg', apple: '/icon.svg' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover', themeColor: '#06111f' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }

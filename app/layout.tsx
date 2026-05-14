import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stormin' Shane",
  description:
    "Premier weather, live tornado tracker, and Shane's storm updates. Built for the home screen.",
  manifest: "/manifest.webmanifest",
  applicationName: "Stormin' Shane",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stormin' Shane",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Stormin' Shane Weather",
    description: "Live storm tracking, premier forecast, and Shane's video updates.",
    siteName: "Stormin' Shane",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#04060c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="preconnect" href="https://api.weather.gov" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }); }`,
          }}
        />
      </head>
      <body className="min-h-full bg-ink-950 text-white antialiased font-display">
        {children}
      </body>
    </html>
  );
}

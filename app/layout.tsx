import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Italia 2026 — Tein & Tessa",
  description: "10 dagen Italie reisplanner",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Italia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#c4704b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`}} />
      </body>
    </html>
  );
}

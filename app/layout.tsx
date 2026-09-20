import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Vinyl — Cyberpunk Music Player",
  description: "A neon cyberpunk record-player music app with a spinning speckled vinyl, sliding tonearm, and a full playlist. Fully local, no login.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Neon Vinyl",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="fixed inset-0 bg-black z-0" />
          {children}
        </div>
      </body>
    </html>
  );
}

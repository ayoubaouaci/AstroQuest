import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "AstroQuest",
  description: "A Pixel-Art RPG Engine for Astrology",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a2a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${pixelFont.variable} antialiased font-pixel`}
        suppressHydrationWarning
      >
        <div
          className="h-screen w-screen bg-midnight-purple text-magic-gold relative overflow-hidden !border-0 flex flex-col"
          suppressHydrationWarning
        >
          {/* Background decorative elements could go here */}
          {children}
        </div>
      </body>
    </html>
  );
}

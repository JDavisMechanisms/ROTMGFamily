import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, JetBrains_Mono } from "next/font/google";
import { CONFIG } from "@/config";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-title",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: CONFIG.GUILD,
};

export const viewport: Viewport = {
  themeColor: "#0a0000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

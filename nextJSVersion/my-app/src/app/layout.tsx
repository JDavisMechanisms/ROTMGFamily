import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, VT323 } from "next/font/google";
import { CONFIG } from "@/config";
import "./globals.css";

// Loaded via next/font — self-hosted, no layout shift, no external <link>.
// Exposed as CSS variables that globals.css references.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: CONFIG.GUILD,
};

export const viewport: Viewport = {
  themeColor: "#fcbdf4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  );
}

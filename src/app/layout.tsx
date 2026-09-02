import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emailarchiver.app"),
  title: {
    default: "Export Emails to PDF | EmailArchiver",
    template: "%s | EmailArchiver",
  },
  description:
    "Upload .eml and .mbox files, browse your library, and export emails to PDF. No live inbox required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>{children}</body>
    </html>
  );
}

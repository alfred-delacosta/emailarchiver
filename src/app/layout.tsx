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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "EmailArchiver",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "EmailArchiver email to PDF" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>{children}</body>
    </html>
  );
}

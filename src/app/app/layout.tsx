import type { Metadata } from "next";
import { AppCredit } from "@/components/AppCredit";
import { AppHeader } from "@/components/AppHeader";
import styles from "./app.module.css";

export const metadata: Metadata = {
  title: {
    default: "App",
    template: "%s | EmailArchiver",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <AppHeader />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <AppCredit />
    </>
  );
}

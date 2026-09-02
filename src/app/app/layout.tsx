import type { Metadata } from "next";
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
      <AppHeader />
      <main className={styles.main}>{children}</main>
    </>
  );
}

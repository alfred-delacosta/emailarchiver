import type { Metadata } from "next";
import { LibraryClient } from "@/components/LibraryClient";
import styles from "../app.module.css";

export const metadata: Metadata = {
  title: "Library",
};

export default function LibraryPage() {
  return (
    <>
      <h1 className={styles.title}>Library</h1>
      <p className={styles.sub}>Multi-select messages and export as PDF.</p>
      <LibraryClient />
    </>
  );
}

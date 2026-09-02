import type { Metadata } from "next";
import { ExportsClient } from "@/components/ExportsClient";
import styles from "../app.module.css";

export const metadata: Metadata = {
  title: "Exports",
};

export default function ExportsPage() {
  return (
    <>
      <h1 className={styles.title}>Exports</h1>
      <p className={styles.sub}>Download history for generated PDFs.</p>
      <ExportsClient />
    </>
  );
}

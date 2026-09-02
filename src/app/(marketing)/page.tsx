import Link from "next/link";
import type { Metadata } from "next";
import styles from "./marketing.module.css";

export const metadata: Metadata = {
  title: { absolute: "Export Emails to PDF | EmailArchiver" },
  description:
    "EmailArchiver turns .eml and .mbox files into a browsable library and PDF exports.",
};

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <h1>Export emails to PDF — without connecting your inbox</h1>
        <p className={styles.lead}>
          Upload .eml or .mbox (or a zip), parse into a library, multi-select, preview, and export
          clean PDFs. Gmail sync is coming soon.
        </p>
        <div className={styles.actions}>
          <Link href="/app" className={styles.primary}>
            Open EmailArchiver
          </Link>
          <Link href="/features" className={styles.secondary}>
            See features
          </Link>
        </div>
      </section>
      <section className={styles.grid}>
        <article className={styles.card}>
          <h3>File-first import</h3>
          <p>Drop .eml, .mbox, or zip archives. Bad files are skipped — the rest still import.</p>
        </article>
        <article className={styles.card}>
          <h3>Library & multi-select</h3>
          <p>Browse parsed messages, select many, and export a batch as PDF with progress.</p>
        </article>
        <article className={styles.card}>
          <h3>Private by default</h3>
          <p>Session-local storage. Wipe anytime. No OAuth or live mailbox access in v1.</p>
        </article>
      </section>
    </>
  );
}

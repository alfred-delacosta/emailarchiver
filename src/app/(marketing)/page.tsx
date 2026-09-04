import Link from "next/link";
import type { Metadata } from "next";
import styles from "./marketing.module.css";
import { marketingMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingMetadata({
  title: "Export Emails to PDF | EmailArchiver",
  description:
    "Turn archived .eml and .mbox files into a browsable library and clean PDF exports — no live inbox required.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>email to PDF</p>
        <div className={styles.heroRow}>
          <div>
            <h1>Archive emails as clean, printable PDFs</h1>
            <p className={styles.lead}>
              Upload .eml or .mbox files (or a zip), build a session library, preview messages, and
              export PDFs that look like the email — not a plain-text dump. No OAuth. No live inbox
              in v1.
            </p>
            <div className={styles.actions}>
              <Link href="/app" className={styles.primary}>
                Open EmailArchiver
              </Link>
              <Link href="/features" className={styles.secondary}>
                See features
              </Link>
            </div>
          </div>
          <img
            src="/mark-archive.svg"
            alt=""
            width={96}
            height={96}
            className={styles.heroMark}
            aria-hidden="true"
          />
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

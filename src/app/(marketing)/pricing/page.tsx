import type { Metadata } from "next";
import Link from "next/link";
import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className={styles.prose}>
      <h1>Pricing</h1>
      <p>Simple plans while we ship v1.</p>
      <div className={styles.priceGrid}>
        <article className={styles.priceCard}>
          <h2>Free</h2>
          <p className={styles.price}>$0</p>
          <p>Upload, library, and PDF export for personal use. Session-local storage.</p>
          <Link href="/app" className={styles.primary}>
            Get started
          </Link>
        </article>
        <article className={styles.priceCard}>
          <h2>Pro</h2>
          <p className={styles.price}>Coming soon</p>
          <p>Gmail sync, longer retention, and team features — not available yet.</p>
        </article>
      </div>
    </div>
  );
}

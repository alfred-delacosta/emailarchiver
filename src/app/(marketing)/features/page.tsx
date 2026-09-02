import type { Metadata } from "next";
import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Features",
};

export default function FeaturesPage() {
  return (
    <div className={styles.prose}>
      <h1>Features</h1>
      <p>Everything you need to archive exported mail files into PDFs.</p>
      <ul>
        <li>Upload .eml, .mbox, or zip of those (25 MB/file, 50/batch)</li>
        <li>Per-file parse status — one failure does not stop the batch</li>
        <li>Message library with multi-select</li>
        <li>Email + PDF layout preview</li>
        <li>Batch PDF export with download history</li>
        <li>Session wipe from Settings</li>
        <li>Gmail source card — Coming soon</li>
      </ul>
    </div>
  );
}

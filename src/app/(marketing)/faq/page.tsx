import type { Metadata } from "next";
import styles from "../marketing.module.css";
import { marketingMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingMetadata({
  title: "Email to PDF FAQ | EmailArchiver",
  description:
    "Answers about uploading .eml and .mbox files, session storage, PDF export, and what’s coming next for EmailArchiver.",
  path: "/faq",
  absoluteTitle: true,
});

const faqs = [
  {
    q: "Do I need to connect Gmail?",
    a: "No. v1 is upload-only (.eml / .mbox / zip). Gmail is Coming soon.",
  },
  {
    q: "What are the upload limits?",
    a: "25 MB per file and 50 files per batch. Unsupported or corrupt files are reported individually.",
  },
  {
    q: "Where is my data stored?",
    a: "On the server under session-scoped .data/ storage. Wipe anytime in Settings.",
  },
  {
    q: "How are PDFs generated?",
    a: "Server-side with pdf-lib: headers (from/subject/date), body text, and attachment names.",
  },
];

export default function FaqPage() {
  return (
    <div className={styles.prose}>
      <h1>Email to PDF FAQ</h1>
      {faqs.map((f) => (
        <div key={f.q} className={styles.faqItem}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Security",
};

export default function SecurityPage() {
  return (
    <div className={styles.prose}>
      <h1>Security & privacy</h1>
      <p>
        EmailArchiver v1 is file-upload only. We do not connect to Gmail or other providers, and we
        do not request mailbox OAuth scopes.
      </p>
      <h2>Data handling</h2>
      <ul>
        <li>Uploads are stored under session-scoped local disk (<code className="mono">.data/</code>)</li>
        <li>Keyed by an httpOnly session cookie</li>
        <li>Delete anytime via Settings or <code className="mono">DELETE /api/data</code></li>
        <li>Production deployments should use object storage and retention TTLs</li>
      </ul>
      <h2>Exports</h2>
      <p>
        PDFs are generated server-side with pdf-lib from parsed message fields and plain text — no
        third-party rendering service.
      </p>
    </div>
  );
}

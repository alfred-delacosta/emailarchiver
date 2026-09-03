"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PreviewClient.module.css";
import type { MessageDetail } from "@/lib/types";

export function PreviewClient({ id }: { id: string }) {
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [tab, setTab] = useState<"email" | "pdf">("email");
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [fallbackBanner, setFallbackBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/messages/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Not found");
        setMessage(d.message);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function exportPdf() {
    setExporting(true);
    setFallbackBanner(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: [id] }),
      });
      const data = await res.json();
      if (res.ok && data.downloadUrl) {
        if (data.renderMode === "text-fallback") {
          const reason = data.fallbackReason
            ? `: ${data.fallbackReason}`
            : "";
          const msg = `PDF used text fallback (HTML render failed)${reason}`;
          setFallbackBanner(msg);
          window.alert(msg);
        }
        window.location.href = data.downloadUrl;
      } else {
        setError(data.error || "Export failed");
      }
    } finally {
      setExporting(false);
    }
  }

  if (error && !message) {
    return (
      <p className={styles.error}>
        {error}. <Link href="/app/library">Back to library</Link>
      </p>
    );
  }
  if (!message) return <p className={styles.muted}>Loading…</p>;

  const emailBody = message.html ? (
    <iframe
      title="Email HTML"
      className={styles.frame}
      sandbox=""
      srcDoc={message.html}
    />
  ) : (
    <pre className={styles.text}>{message.text || "(empty)"}</pre>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Link href="/app/library" className={styles.back}>
          ← Library
        </Link>
        <button type="button" className={styles.exportBtn} onClick={exportPdf} disabled={exporting}>
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>
      {fallbackBanner && (
        <div className={styles.fallbackBanner} role="alert">
          {fallbackBanner}
        </div>
      )}
      <h1 className={styles.subject}>{message.subject}</h1>
      <div className={styles.meta}>
        <div>
          <strong>From:</strong> {message.from || "—"}
        </div>
        <div>
          <strong>To:</strong> {message.to || "—"}
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {message.date ? new Date(message.date).toLocaleString() : "—"}
        </div>
        {message.attachmentNames.length > 0 && (
          <div>
            <strong>Attachments:</strong> {message.attachmentNames.join(", ")}
          </div>
        )}
      </div>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "email"}
          className={tab === "email" ? styles.active : ""}
          onClick={() => setTab("email")}
        >
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pdf"}
          className={tab === "pdf" ? styles.active : ""}
          onClick={() => setTab("pdf")}
        >
          PDF preview
        </button>
      </div>
      <div className={styles.panel}>
        {tab === "email" ? (
          emailBody
        ) : (
          <div className={styles.pdfPreview}>
            <p className={styles.muted}>
              Export creates a PDF of this rendered email (HTML as shown in the Email tab,
              with from / subject / to / date header). Chrome/Chromium is used server-side
              for visual fidelity; text fallback is used if HTML rendering fails.
            </p>
            {emailBody}
          </div>
        )}
      </div>
    </div>
  );
}

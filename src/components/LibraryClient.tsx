"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./LibraryClient.module.css";
import type { MessageMeta } from "@/lib/types";

export function LibraryClient() {
  const [messages, setMessages] = useState<MessageMeta[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, []);

  const allSelected = useMemo(
    () => messages.length > 0 && selected.size === messages.length,
    [messages, selected]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(messages.map((m) => m.id)));
  }

  async function exportSelected() {
    if (!selected.size) return;
    setExporting(true);
    setProgress(`Exporting ${selected.size} message${selected.size === 1 ? "" : "s"}…`);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProgress(data.error || "Export failed");
        return;
      }
      setProgress("Done — downloading…");
      if (data.downloadUrl) {
        window.location.href = data.downloadUrl;
      }
    } catch {
      setProgress("Network error");
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(null), 2500);
    }
  }

  if (loading) return <p className={styles.muted}>Loading library…</p>;
  if (!messages.length) {
    return (
      <div className={styles.empty}>
        <p>No messages yet.</p>
        <Link href="/app">Upload emails</Link>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {selected.size > 0 && (
        <div className={styles.bulk}>
          <span>{selected.size} selected</span>
          <button type="button" onClick={exportSelected} disabled={exporting}>
            Export {selected.size} as PDF
          </button>
        </div>
      )}
      {progress && <p className={styles.progress}>{progress}</p>}
      <div className={styles.toolbar}>
        <label className={styles.check}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Select all
        </label>
        <span className={styles.muted}>{messages.length} messages</span>
      </div>
      <ul className={styles.list}>
        {messages.map((m) => (
          <li key={m.id} className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={selected.has(m.id)}
                onChange={() => toggle(m.id)}
              />
            </label>
            <Link href={`/app/preview/${m.id}`} className={styles.main}>
              <div className={styles.subject}>{m.subject}</div>
              <div className={styles.meta}>
                <span>{m.from || "Unknown"}</span>
                <span>·</span>
                <span>{m.date ? new Date(m.date).toLocaleString() : "No date"}</span>
                {m.hasAttachments && <span className={styles.att}>📎</span>}
              </div>
              <div className={styles.preview}>{m.preview}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

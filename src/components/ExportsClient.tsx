"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ExportsClient.module.css";
import type { ExportJob } from "@/lib/types";

export function ExportsClient() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/export")
      .then((r) => r.json())
      .then((d) => setJobs(d.exports || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.muted}>Loading exports…</p>;
  if (!jobs.length) {
    return (
      <div className={styles.empty}>
        <p>No exports yet.</p>
        <Link href="/app/library">Select messages in the library</Link>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {jobs.map((j) => (
        <li key={j.id} className={styles.row}>
          <div>
            <div className={styles.name}>{j.filename}</div>
            <div className={styles.meta}>
              {j.messageIds.length} message{j.messageIds.length === 1 ? "" : "s"} ·{" "}
              {new Date(j.createdAt).toLocaleString()} ·{" "}
              <span className={styles[j.status]}>{j.status}</span>
            </div>
            {j.error && <div className={styles.err}>{j.error}</div>}
          </div>
          {j.status === "done" && (
            <a className={styles.dl} href={`/api/export/${j.id}`}>
              Download
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

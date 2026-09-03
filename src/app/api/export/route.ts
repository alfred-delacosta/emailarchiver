import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { getOrCreateSessionId } from "@/lib/session";
import { exportsDir, getMessage, listExports, saveExport } from "@/lib/store";
import { messagesToPdf } from "@/lib/pdf";
import { messagesToHtmlPdf } from "@/lib/htmlPdf";
import type { ExportJob, MessageDetail } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const sessionId = getOrCreateSessionId();
  const jobs = await listExports(sessionId);
  return NextResponse.json({ exports: jobs });
}

export async function POST(req: Request) {
  const sessionId = getOrCreateSessionId();
  const body = (await req.json()) as { messageIds?: string[] };
  const messageIds = body.messageIds || [];
  if (!messageIds.length) {
    return NextResponse.json({ error: "messageIds required" }, { status: 400 });
  }

  const id = randomUUID();
  const filename = `emailarchiver-export-${id.slice(0, 8)}.pdf`;
  const job: ExportJob = {
    id,
    messageIds,
    status: "processing",
    createdAt: new Date().toISOString(),
    finishedAt: null,
    filename,
  };
  await saveExport(sessionId, job);

  try {
    const details: MessageDetail[] = [];
    for (const mid of messageIds) {
      const m = await getMessage(sessionId, mid);
      if (m) details.push(m);
    }
    if (!details.length) {
      throw new Error("No messages found for export");
    }

    let pdf: Uint8Array;
    let renderMode: "html" | "text-fallback" = "html";
    let fallbackReason: string | undefined;

    try {
      pdf = await messagesToHtmlPdf(details);
    } catch (htmlErr) {
      const reason =
        htmlErr instanceof Error ? htmlErr.message : String(htmlErr);
      console.error(
        "[export] HTML PDF render failed; falling back to text PDF:",
        reason
      );
      pdf = await messagesToPdf(details);
      renderMode = "text-fallback";
      fallbackReason = reason;
    }

    await fs.mkdir(exportsDir(sessionId), { recursive: true });
    await fs.writeFile(path.join(exportsDir(sessionId), `${id}.pdf`), pdf);
    job.status = "done";
    job.finishedAt = new Date().toISOString();
    await saveExport(sessionId, job);
    return NextResponse.json({
      export: job,
      downloadUrl: `/api/export/${id}`,
      renderMode,
      ...(fallbackReason ? { fallbackReason } : {}),
    });
  } catch (err) {
    job.status = "error";
    job.error = err instanceof Error ? err.message : "Export failed";
    job.finishedAt = new Date().toISOString();
    await saveExport(sessionId, job);
    return NextResponse.json({ export: job, error: job.error }, { status: 500 });
  }
}

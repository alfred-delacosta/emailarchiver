import { NextResponse } from "next/server";
import AdmZip from "adm-zip";
import path from "path";
import { getOrCreateSessionId } from "@/lib/session";
import { saveMessage, uploadsDir } from "@/lib/store";
import { parseEmlBuffer, parseMboxBuffer } from "@/lib/parse";
import { MAX_FILE_BYTES, MAX_FILES_PER_BATCH } from "@/lib/limits";
import type { UploadFileResult } from "@/lib/types";
import fs from "fs/promises";

export const runtime = "nodejs";

function extOf(name: string) {
  return path.extname(name).toLowerCase();
}

async function handleBuffer(
  sessionId: string,
  filename: string,
  buf: Buffer,
  results: UploadFileResult[]
) {
  const ext = extOf(filename);
  try {
    if (ext === ".eml") {
      const parsed = await parseEmlBuffer(buf, filename);
      await saveMessage(sessionId, parsed.meta, { text: parsed.text, html: parsed.html });
      results.push({
        filename,
        status: "ok",
        messageCount: 1,
        messageIds: [parsed.meta.id],
      });
    } else if (ext === ".mbox") {
      const parsed = await parseMboxBuffer(buf, filename);
      for (const p of parsed) {
        await saveMessage(sessionId, p.meta, { text: p.text, html: p.html });
      }
      results.push({
        filename,
        status: "ok",
        messageCount: parsed.length,
        messageIds: parsed.map((p) => p.meta.id),
      });
    } else if (ext === ".zip") {
      const zip = new AdmZip(buf);
      const entries = zip.getEntries().filter((e) => !e.isDirectory);
      let count = 0;
      const ids: string[] = [];
      for (const entry of entries) {
        const name = entry.entryName.split("/").pop() || entry.entryName;
        const eext = extOf(name);
        if (eext !== ".eml" && eext !== ".mbox") continue;
        const ebuf = entry.getData();
        if (ebuf.length > MAX_FILE_BYTES) continue;
        if (eext === ".eml") {
          const parsed = await parseEmlBuffer(ebuf, `${filename}:${name}`);
          await saveMessage(sessionId, parsed.meta, { text: parsed.text, html: parsed.html });
          ids.push(parsed.meta.id);
          count += 1;
        } else {
          const parsed = await parseMboxBuffer(ebuf, `${filename}:${name}`);
          for (const p of parsed) {
            await saveMessage(sessionId, p.meta, { text: p.text, html: p.html });
            ids.push(p.meta.id);
          }
          count += parsed.length;
        }
      }
      results.push({
        filename,
        status: "ok",
        messageCount: count,
        messageIds: ids,
      });
    } else {
      results.push({
        filename,
        status: "error",
        messageCount: 0,
        messageIds: [],
        error: "Unsupported type. Use .eml, .mbox, or .zip",
      });
    }
  } catch (err) {
    results.push({
      filename,
      status: "error",
      messageCount: 0,
      messageIds: [],
      error: err instanceof Error ? err.message : "Parse failed",
    });
  }
}

export async function POST(req: Request) {
  const sessionId = getOrCreateSessionId();
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_BATCH) {
    return NextResponse.json(
      { error: `Max ${MAX_FILES_PER_BATCH} files per batch` },
      { status: 400 }
    );
  }

  await fs.mkdir(uploadsDir(sessionId), { recursive: true });
  const results: UploadFileResult[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      results.push({
        filename: file.name,
        status: "error",
        messageCount: 0,
        messageIds: [],
        error: "File exceeds 25 MB limit",
      });
      continue;
    }
    const ab = await file.arrayBuffer();
    const buf = Buffer.from(ab);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    await fs.writeFile(path.join(uploadsDir(sessionId), `${Date.now()}-${safeName}`), buf);
    await handleBuffer(sessionId, file.name, buf, results);
  }

  return NextResponse.json({ results });
}

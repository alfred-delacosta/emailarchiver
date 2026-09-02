import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getOrCreateSessionId } from "@/lib/session";
import { exportsDir, getExport } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const sessionId = getOrCreateSessionId();
  const job = await getExport(sessionId, id);
  if (!job || job.status !== "done") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const filePath = path.join(exportsDir(sessionId), `${id}.pdf`);
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${job.filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
}

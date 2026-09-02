import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getMessage } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const sessionId = getOrCreateSessionId();
  const message = await getMessage(sessionId, id);
  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message });
}

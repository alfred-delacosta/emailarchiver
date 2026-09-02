import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { listMessages } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const sessionId = getOrCreateSessionId();
  const messages = await listMessages(sessionId);
  return NextResponse.json({ messages });
}

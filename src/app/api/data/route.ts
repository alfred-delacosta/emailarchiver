import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { wipeSession } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE() {
  const sessionId = getSessionId();
  if (sessionId) {
    await wipeSession(sessionId);
  }
  return NextResponse.json({ ok: true });
}

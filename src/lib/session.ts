import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE = "ea_session";

export function getOrCreateSessionId(): string {
  const jar = cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return id;
}

export function getSessionId(): string | null {
  const jar = cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

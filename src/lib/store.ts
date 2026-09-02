import fs from "fs/promises";
import path from "path";
import type { ExportJob, MessageDetail, MessageMeta } from "./types";

const ROOT = path.join(process.cwd(), ".data");

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

function sessionDir(sessionId: string) {
  return path.join(ROOT, "sessions", sessionId);
}

function messagesPath(sessionId: string) {
  return path.join(sessionDir(sessionId), "messages.json");
}

function exportsPath(sessionId: string) {
  return path.join(sessionDir(sessionId), "exports.json");
}

export function uploadsDir(sessionId: string) {
  return path.join(sessionDir(sessionId), "uploads");
}

export function exportsDir(sessionId: string) {
  return path.join(sessionDir(sessionId), "exports");
}

export function messageBodiesDir(sessionId: string) {
  return path.join(sessionDir(sessionId), "bodies");
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function listMessages(sessionId: string): Promise<MessageMeta[]> {
  return readJson(messagesPath(sessionId), []);
}

export async function saveMessage(
  sessionId: string,
  meta: MessageMeta,
  detail: { text: string; html: string | null }
) {
  await ensureDir(messageBodiesDir(sessionId));
  await ensureDir(uploadsDir(sessionId));
  const list = await listMessages(sessionId);
  const next = [meta, ...list.filter((m) => m.id !== meta.id)];
  await writeJson(messagesPath(sessionId), next);
  await writeJson(path.join(messageBodiesDir(sessionId), `${meta.id}.json`), detail);
}

export async function getMessage(
  sessionId: string,
  id: string
): Promise<(MessageMeta & { text: string; html: string | null }) | null> {
  const list = await listMessages(sessionId);
  const meta = list.find((m) => m.id === id);
  if (!meta) return null;
  const body = await readJson<{ text: string; html: string | null }>(
    path.join(messageBodiesDir(sessionId), `${id}.json`),
    { text: "", html: null }
  );
  return { ...meta, ...body };
}

export async function listExports(sessionId: string): Promise<ExportJob[]> {
  return readJson(exportsPath(sessionId), []);
}

export async function saveExport(sessionId: string, job: ExportJob) {
  const list = await listExports(sessionId);
  const next = [job, ...list.filter((j) => j.id !== job.id)];
  await writeJson(exportsPath(sessionId), next);
}

export async function getExport(sessionId: string, id: string): Promise<ExportJob | null> {
  const list = await listExports(sessionId);
  return list.find((j) => j.id === id) ?? null;
}

export async function wipeSession(sessionId: string) {
  const dir = sessionDir(sessionId);
  await fs.rm(dir, { recursive: true, force: true });
}

export type { MessageDetail };

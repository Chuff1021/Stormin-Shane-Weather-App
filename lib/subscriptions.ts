// Subscriber store backed by Vercel Blob — no DB needed.
// One JSON blob at subscribers/index.json holding the entire list.
// For a personal app with <10k subs this is fine; if it grows, shard by hash prefix.

import { head, list, put } from "@vercel/blob";
import type { PushSubscription as WebPushSubscription } from "web-push";

export type Subscriber = {
  id: string;
  subscription: WebPushSubscription;
  // Optional location for geo-targeted tornado alerts
  lat?: number;
  lon?: number;
  label?: string;
  // Topic preferences
  topics: {
    shaneVideos: boolean;
    tornadoAlerts: boolean;
  };
  createdAt: string;
  lastSeenAt: string;
};

const PATH = "subscribers/index.json";

export function isConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function loadAll(): Promise<Subscriber[]> {
  if (!isConfigured()) return [];
  try {
    // Find the current index blob via list — head() requires the exact URL which we don't store.
    const { blobs } = await list({ prefix: "subscribers/" });
    const idx = blobs.find((b) => b.pathname === PATH);
    if (!idx) return [];
    const res = await fetch(idx.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveAll(subs: Subscriber[]) {
  if (!isConfigured()) return;
  await put(PATH, JSON.stringify(subs), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function upsert(sub: Subscriber): Promise<Subscriber> {
  const all = await loadAll();
  const existingIdx = all.findIndex((s) => s.id === sub.id);
  if (existingIdx >= 0) {
    all[existingIdx] = { ...all[existingIdx], ...sub, lastSeenAt: new Date().toISOString() };
  } else {
    all.push(sub);
  }
  await saveAll(all);
  return all[existingIdx >= 0 ? existingIdx : all.length - 1];
}

export async function remove(id: string) {
  const all = await loadAll();
  const next = all.filter((s) => s.id !== id);
  if (next.length !== all.length) await saveAll(next);
}

export async function pruneInvalid(invalidIds: string[]) {
  if (!invalidIds.length) return;
  const all = await loadAll();
  const next = all.filter((s) => !invalidIds.includes(s.id));
  if (next.length !== all.length) await saveAll(next);
}

// Stable id from the endpoint URL.
export function idForEndpoint(endpoint: string) {
  let h = 0;
  for (let i = 0; i < endpoint.length; i++) h = (h * 31 + endpoint.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

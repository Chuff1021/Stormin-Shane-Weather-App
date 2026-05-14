import webpush, { type PushSubscription } from "web-push";

// VAPID keys — generated once via `npx web-push generate-vapid-keys`.
// Public key is safe to expose. Private key SHOULD be rotated via env var when
// you want to harden the app. For first run we ship sane defaults.

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BEXcvCBcOPjvXARBHW0ZmiPGnsGoUSfskd_uUJZaZBCKksbg_O7ElQ9OWDCap0xpTMCbAKKqdPRhef1LQiPa55Y";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "pDxl8RCb5tfiQ0aNa8z6hqF4ArLoZl-WHJ8HBgAGFg0";

const SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:aaronsfireplaceco@yahoo.com";

let configured = false;
function ensure() {
  if (configured) return;
  webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
}

export type Payload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
  data?: any;
};

export async function sendPush(sub: PushSubscription, payload: Payload) {
  ensure();
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload), {
      TTL: 60 * 60,
      urgency: "high",
    });
    return { ok: true as const };
  } catch (err: any) {
    return {
      ok: false as const,
      gone: err?.statusCode === 410 || err?.statusCode === 404,
      status: err?.statusCode,
      error: err?.message || String(err),
    };
  }
}

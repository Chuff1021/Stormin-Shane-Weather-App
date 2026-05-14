import { cookies } from "next/headers";

// Simple username + password gate for Shane's studio.
// Defaults are baked in for first-run convenience — override with env vars on Vercel
// when you want to rotate credentials.

export const DEFAULT_USERNAME = "shane";
export const DEFAULT_PASSWORD = "stormin2026";

const COOKIE = "shane_session";

function creds() {
  return {
    username: process.env.SHANE_USERNAME || DEFAULT_USERNAME,
    password: process.env.SHANE_PASSWORD || DEFAULT_PASSWORD,
  };
}

export async function isShane(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === expected();
}

export async function login(username: string, password: string): Promise<boolean> {
  const c = creds();
  if (username !== c.username || password !== c.password) return false;
  const jar = await cookies();
  jar.set(COOKIE, expected(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

// Cookie value is tied to current creds so rotating either invalidates old sessions.
function expected() {
  const { username, password } = creds();
  const blob = `${username}::${password}`;
  let h = 0;
  for (let i = 0; i < blob.length; i++) h = (h * 31 + blob.charCodeAt(i)) | 0;
  return `ok-${(h >>> 0).toString(36)}`;
}

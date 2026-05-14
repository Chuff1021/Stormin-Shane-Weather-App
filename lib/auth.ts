import { cookies } from "next/headers";

const COOKIE = "shane_session";

export async function isShane(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === expected();
}

export async function login(password: string): Promise<boolean> {
  if (password !== process.env.SHANE_PASSWORD) return false;
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

// Tie the cookie value to the current password so a rotation invalidates old sessions.
function expected() {
  const pw = process.env.SHANE_PASSWORD || "no-password-set";
  // simple non-secret token; not for crypto, just to bind cookie to current pw value
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return `ok-${(h >>> 0).toString(36)}`;
}

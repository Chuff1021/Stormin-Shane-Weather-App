"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Video } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Login failed.");
      }
      router.replace("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="storm-canvas min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="glass-strong rounded-3xl p-6 w-full max-w-sm border border-white/10"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-bolt-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-bolt-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50">
              Stormin' Shane
            </div>
            <div className="font-semibold">Shane's Studio</div>
          </div>
        </div>

        <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
          Studio password
        </label>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/10">
          <Lock className="w-4 h-4 text-white/50" />
          <input
            autoFocus
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
          />
        </div>

        {err && <div className="mt-3 text-sm text-siren-500">{err}</div>}

        <button
          disabled={loading}
          className="w-full mt-5 rounded-xl py-3 bg-bolt-500 hover:bg-bolt-600 transition text-ink-950 font-semibold disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Enter studio"}
        </button>

        <p className="mt-4 text-[11px] text-white/40 text-center">
          Set the studio password via the <code>SHANE_PASSWORD</code> env var on Vercel.
        </p>
      </form>
    </main>
  );
}
